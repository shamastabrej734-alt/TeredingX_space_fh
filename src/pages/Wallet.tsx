import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, Clock } from 'lucide-react';
import { Card, Button, Input, Label } from '../components/ui';
import { doc, addDoc, collection, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

export default function Wallet() {
  const { user, userData, refreshUserData } = useAuth();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !depositAmount) return;
    
    // Normal users cannot add virtual funds directly.
    toast.error('Only administrators can add virtual funds to accounts.');
    setDepositAmount('');
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !withdrawAmount || !withdrawMethod || !accountDetails) return;
    
    const amount = parseFloat(withdrawAmount);
    if (amount > (userData?.virtualBalance || 0)) {
      toast.error('Insufficient virtual balance');
      return;
    }

    setIsWithdrawing(true);
    
    try {
      // Add withdrawal request
      await addDoc(collection(db, 'withdrawalRequests'), {
        userId: user.uid,
        amount: amount,
        method: withdrawMethod,
        accountDetails: accountDetails,
        status: 'Pending',
        createdAt: new Date()
      });
      
      // Also add transaction record as pending
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'WITHDRAWAL',
        amount: amount,
        status: 'Pending',
        createdAt: new Date(),
        description: `Virtual withdrawal via ${withdrawMethod}`
      });
      
      toast.success('Virtual withdrawal request submitted. Pending admin approval.');
      setWithdrawAmount('');
      setWithdrawMethod('');
      setAccountDetails('');
    } catch (error: any) {
      toast.error('Error requesting withdrawal: ' + error.message);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Virtual Wallet</h1>
        <p className="text-gray-400">Manage your virtual funds and virtual transactions.</p>
      </div>
      
      <div className="bg-indigo-600/10 border-l-4 border-indigo-500 p-4 rounded-r-lg mb-8">
        <p className="text-sm text-indigo-300 font-medium">
          TradingX is a virtual trading simulator. All balances and transactions are simulated and have no real monetary value. No real money is transferred.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1 flex flex-col justify-center items-center py-10 bg-gradient-to-b from-gray-800/50 to-[#0B0E14] border-gray-700">
          <div className="bg-indigo-500/20 p-4 rounded-full mb-4">
            <WalletIcon className="h-8 w-8 text-indigo-400" />
          </div>
          <span className="text-gray-400 mb-2">Available Virtual Balance</span>
          <span className="text-4xl font-bold">{formatCurrency(userData?.virtualBalance || 0)}</span>
        </Card>
        
        <div className="col-span-1 md:col-span-2 grid sm:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <ArrowDownToLine className="h-5 w-5 text-emerald-400" />
              Add Virtual Funds
            </h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Amount</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[1000, 5000, 10000, 50000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt.toString())}
                      className="border border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 rounded-lg py-2 text-sm transition-colors"
                    >
                      +{formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customAmount">Custom Amount</Label>
                <Input 
                  id="customAmount" 
                  type="number" 
                  min="1" 
                  value={depositAmount} 
                  onChange={e => setDepositAmount(e.target.value)} 
                  placeholder="Enter amount" 
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" isLoading={isDepositing}>
                Add Virtual Funds
              </Button>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <ArrowUpFromLine className="h-5 w-5 text-amber-400" />
              Request Virtual Withdrawal
            </h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Amount to Withdraw</Label>
                <Input 
                  id="withdrawAmount" 
                  type="number" 
                  min="1"
                  max={userData?.virtualBalance}
                  value={withdrawAmount} 
                  onChange={e => setWithdrawAmount(e.target.value)} 
                  placeholder="Enter amount" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Mock Withdrawal Method</Label>
                <select 
                  id="method"
                  value={withdrawMethod}
                  onChange={e => setWithdrawMethod(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select method</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Crypto Wallet">Crypto Wallet</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="details">Mock Account Details</Label>
                <Input 
                  id="details" 
                  value={accountDetails} 
                  onChange={e => setAccountDetails(e.target.value)} 
                  placeholder="e.g. 1234567890 (For virtual purposes only)" 
                  required
                />
              </div>
              <Button type="submit" variant="secondary" className="w-full" isLoading={isWithdrawing}>
                Request Virtual Withdrawal
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}