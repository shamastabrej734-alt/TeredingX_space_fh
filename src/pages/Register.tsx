import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { Button, Input, Label, Card } from '../components/ui';
import { toast } from 'react-hot-toast';
import { TrendingUp } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create user document with initial ₹10 virtual bonus
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role: 'user',
        virtualBalance: 10,
        totalProfit: 0,
        todayPnL: 0,
        totalInvestment: 0,
        totalTrades: 0,
        bonusClaimed: true,
        createdAt: new Date(),
        status: 'active'
      });
      
      toast.success('Account created! ₹10 virtual bonus added.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName || 'User',
          email: result.user.email,
          photoURL: result.user.photoURL,
          role: 'user',
          virtualBalance: 10,
          totalProfit: 0,
          todayPnL: 0,
          totalInvestment: 0,
          totalTrades: 0,
          bonusClaimed: true,
          createdAt: new Date(),
          status: 'active'
        });
        toast.success('Account created! ₹10 virtual bonus added.');
      } else {
        toast.success('Logged in with Google');
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight">TradingX</span>
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          
          <Button type="submit" className="w-full" isLoading={loading}>
            Sign Up
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
          <div className="relative flex justify-center text-sm"><span className="bg-[#0B0E14] px-2 text-gray-500">Or continue with</span></div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          Google
        </Button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Login</Link>
        </p>
      </Card>
    </div>
  );
}