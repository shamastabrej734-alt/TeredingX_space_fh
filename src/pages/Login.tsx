import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { Button, Input, Label, Card } from '../components/ui';
import { toast } from 'react-hot-toast';
import { TrendingUp } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists() && userSnap.data().role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      toast.success('Welcome back!');
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
          virtualBalance: 10010,
          bonusClaimed: true,
          createdAt: new Date(),
          status: 'active'
        });
        toast.success('Account created! ₹10 first-time login bonus added.');
        navigate('/dashboard');
      } else {
        toast.success('Welcome back!');
        if (userSnap.data().role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
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
        
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
            </div>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          
          <Button type="submit" className="w-full" isLoading={loading}>
            Login
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
          Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Sign Up</Link>
        </p>
      </Card>
    </div>
  );
}