import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatPercentage } from '../lib/utils';
import { Card, Button, Input, Label } from '../components/ui';
import { doc, addDoc, collection, updateDoc, increment, runTransaction } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

// Mock Assets Data
const ASSETS = [
  { id: 'BTC', name: 'Bitcoin', price: 5432100, change: 2.4 },
  { id: 'ETH', name: 'Ethereum', price: 284500, change: -1.2 },
  { id: 'AAPL', name: 'Apple Inc.', price: 14500, change: 0.8 },
  { id: 'TSLA', name: 'Tesla', price: 16200, change: 4.5 },
  { id: 'AMZN', name: 'Amazon', price: 11200, change: -0.5 },
  { id: 'GOOGL', name: 'Alphabet', price: 13400, change: 1.1 },
];

// Mock Chart Data
const generateChartData = (basePrice: number) => {
  return Array.from({ length: 30 }).map((_, i) => ({
    time: `Day ${i + 1}`,
    price: basePrice + (Math.random() - 0.5) * (basePrice * 0.1),
  }));
};

export default function Trade() {
  const { user, userData, refreshUserData } = useAuth();
  
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [chartData, setChartData] = useState(generateChartData(ASSETS[0].price));
  const [chartInterval, setChartInterval] = useState('1M');
  
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState('');
  const [isTrading, setIsTrading] = useState(false);

  const filteredAssets = ASSETS.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssetSelect = (asset: typeof ASSETS[0]) => {
    setSelectedAsset(asset);
    setChartData(generateChartData(asset.price));
  };

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !quantity) return;
    const qty = parseFloat(quantity);
    if (qty <= 0) return;

    const total = qty * selectedAsset.price;

    setIsTrading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) throw new Error("User document does not exist!");

        const data = userDoc.data();
        const currentBalance = data.virtualBalance || 0;
        const currentPortfolio = data.portfolio || {};
        
        let newBalance = currentBalance;
        let newInvestment = data.totalInvestment || 0;
        let newTotalProfit = data.totalProfit || 0;
        let newTodayPnL = data.todayPnL || 0;
        const assetHolding = currentPortfolio[selectedAsset.id] || { qty: 0, averagePrice: 0 };

        if (tradeType === 'BUY') {
          if (total > currentBalance) {
            throw new Error(`Insufficient virtual balance. Available: ${formatCurrency(currentBalance)} | Required: ${formatCurrency(total)}. Please deposit virtual funds before placing this trade.`);
          }
          
          // Deduct from balance
          newBalance -= total;
          newInvestment += total;
          
          // Update average price and qty
          const totalQty = assetHolding.qty + qty;
          const totalCost = (assetHolding.qty * assetHolding.averagePrice) + total;
          currentPortfolio[selectedAsset.id] = {
            qty: totalQty,
            averagePrice: totalCost / totalQty
          };

        } else if (tradeType === 'SELL') {
          if (assetHolding.qty < qty) {
            throw new Error(`Insufficient holdings. You only own ${assetHolding.qty} units of ${selectedAsset.id}.`);
          }

          const averageCost = assetHolding.averagePrice;
          const costBasis = averageCost * qty;
          const profit = total - costBasis;

          // Add to balance
          newBalance += total;
          newInvestment = Math.max(0, newInvestment - costBasis); // Reduce investment by cost basis
          newTotalProfit += profit;
          newTodayPnL += profit;
          
          // Update portfolio qty
          currentPortfolio[selectedAsset.id].qty -= qty;
          if (currentPortfolio[selectedAsset.id].qty <= 0) {
            delete currentPortfolio[selectedAsset.id];
          }
        }

        // Apply changes
        transaction.update(userRef, {
          virtualBalance: newBalance,
          totalInvestment: newInvestment,
          totalProfit: newTotalProfit,
          todayPnL: newTodayPnL,
          portfolio: currentPortfolio,
          totalTrades: increment(1)
        });
        
        // Save trade record
        const tradeRef = doc(collection(db, 'trades'));
        transaction.set(tradeRef, {
          userId: user.uid,
          assetId: selectedAsset.id,
          symbol: selectedAsset.id,
          type: tradeType,
          quantity: qty,
          price: selectedAsset.price,
          total: total,
          status: 'Executed',
          createdAt: new Date()
        });
      });

      toast.success(`Virtual ${tradeType} order executed successfully.`);
      setQuantity('');
      refreshUserData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsTrading(false);
    }
  };

  const estAmount = parseFloat(quantity || '0') * selectedAsset.price;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      
      {/* Left sidebar - Asset List */}
      <Card className="w-full md:w-80 flex flex-col p-4 flex-shrink-0 h-[300px] md:h-full">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            className="pl-9" 
            placeholder="Search assets..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 pr-2">
          {filteredAssets.map(asset => (
            <button
              key={asset.id}
              onClick={() => handleAssetSelect(asset)}
              className={`w-full flex justify-between items-center p-3 rounded-lg transition-colors ${
                selectedAsset.id === asset.id ? 'bg-indigo-600/20 border border-indigo-500/50' : 'hover:bg-gray-800'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">{asset.id}</div>
                <div className="text-xs text-gray-500">{asset.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">{formatCurrency(asset.price)}</div>
                <div className={`text-xs flex items-center justify-end ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {asset.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(asset.change)}%
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Main Trading Area */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto md:overflow-visible pb-10 md:pb-0">
        
        {/* Chart Section */}
        <Card className="flex-1 min-h-[400px] p-4 md:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                {selectedAsset.name} ({selectedAsset.id})
              </h2>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-2xl font-medium">{formatCurrency(selectedAsset.price)}</span>
                <span className={`text-sm font-medium ${selectedAsset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatPercentage(selectedAsset.change)} Today
                </span>
              </div>
            </div>
            
            <div className="flex bg-gray-800 p-1 rounded-lg">
              {['1D', '1W', '1M', '1Y'].map(interval => (
                <button
                  key={interval}
                  onClick={() => setChartInterval(interval)}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    chartInterval === interval ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {interval}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedAsset.change >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={selectedAsset.change >= 0 ? '#10B981' : '#EF4444'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [formatCurrency(value), 'Price']}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={selectedAsset.change >= 0 ? '#10B981' : '#EF4444'} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Entry */}
        <Card className="flex-shrink-0 p-6">
          <div className="flex bg-gray-800 p-1 rounded-lg mb-6">
            <button
              onClick={() => setTradeType('BUY')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                tradeType === 'BUY' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType('SELL')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                tradeType === 'SELL' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sell
            </button>
          </div>

          <form onSubmit={handleTrade} className="space-y-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Order Type</span>
              <span className="text-white">Market</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Quantity</Label>
                <span className="text-xs text-gray-400">Available: {formatCurrency(userData?.virtualBalance || 0)}</span>
              </div>
              <div className="relative">
                <Input 
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  {selectedAsset.id}
                </span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 flex justify-between items-center border border-gray-700">
              <span className="text-sm text-gray-400">Estimated Amount</span>
              <span className="font-semibold text-lg">{formatCurrency(estAmount)}</span>
            </div>

            <Button 
              type="submit" 
              className={`w-full ${tradeType === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
              isLoading={isTrading}
            >
              {tradeType} {selectedAsset.id}
            </Button>
          </form>
        </Card>

      </div>
    </div>
  );
}