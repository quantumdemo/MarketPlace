'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppHeader } from '@/components/AppShell';
import { ShieldAlert, Users, PackageCheck, Wrench, BarChart3 } from 'lucide-react';

export default function AdminPage() {
  const { setRole, setActiveTab } = useAuth();

  React.useEffect(() => {
    setRole('admin');
    setActiveTab('admin_panel');
  }, [setRole, setActiveTab]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">PLATFORM SUPER ADMIN CONTROL</h1>
              <p className="text-xs text-zinc-400 font-mono">Restricted Route · Project Owner Access Only</p>
            </div>
          </div>
          <span className="bg-amber-500 text-zinc-950 font-black px-3 py-1 rounded-full text-xs uppercase">
            ADMIN LOGGED IN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>TOTAL USERS</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">1,248</p>
            <p className="text-[10px] text-emerald-400 font-mono">+12% this month</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>ESCROW VOLUME</span>
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">₦42.8M</p>
            <p className="text-[10px] text-amber-400 font-mono">Held in Protect</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>PARTS ORDERS</span>
              <PackageCheck className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">312</p>
            <p className="text-[10px] text-zinc-400 font-mono">Active orders</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>VERIFIED MECHANICS</span>
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">84</p>
            <p className="text-[10px] text-emerald-400 font-mono">On-demand fitting</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-2">
          <h3 className="font-bold text-sm text-white uppercase">Platform Governance & Disputes</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Manage escrow releases, review seller part catalog compliance, and resolve fitment dispute tickets.
          </p>
        </div>
      </main>
    </div>
  );
}
