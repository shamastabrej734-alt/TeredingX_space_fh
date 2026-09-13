import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Card, Button, Input, Label } from '../components/ui';
import { User as UserIcon, Mail, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Profile() {
  const { userData, user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-gray-400">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-1 flex flex-col items-center py-8 text-center border-gray-700 bg-gray-900/80">
          <div className="bg-indigo-500/20 p-6 rounded-full mb-4">
            <UserIcon className="h-12 w-12 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold">{userData?.name}</h2>
          <p className="text-gray-400 text-sm mb-6">{userData?.email}</p>
          
          <div className="w-full space-y-3 px-6 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className="text-emerald-400 font-medium capitalize">{userData?.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Role</span>
              <span className="text-indigo-400 font-medium capitalize">{userData?.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Joined</span>
              <span className="text-gray-200">
                {userData?.createdAt ? format(userData.createdAt.toDate(), 'MMM yyyy') : '-'}
              </span>
            </div>
          </div>
        </Card>

        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-indigo-400" />
              Account Settings
            </h3>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={userData?.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={userData?.email} disabled />
                </div>
              </div>
              <div className="space-y-2 pt-4">
                <Label>Change Password</Label>
                <Input type="password" placeholder="New password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <div className="pt-2">
                <Button variant="primary">Update Profile</Button>
              </div>
            </form>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-sm text-gray-400 mb-6">These actions are irreversible.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="text-gray-300" onClick={logout}>
                Sign Out
              </Button>
              <Button variant="danger">
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}