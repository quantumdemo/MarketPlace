'use client';

/*
 * PLATFORM WELCOME HERO BANNER & QUICK START EXPLAINER
 * Displayed at the top of the dashboard for new users to immediately understand
 * what MechSource offers across Drivers, Fleet, Sellers, and Mechanics.
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Wrench,
  Car,
  Search,
  ShieldCheck,
  Truck,
  Store,
  Plus,
  ArrowRight,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const WelcomePlatformBanner: React.FC = () => {
  const { currentRole, setRole, setActiveTab, garage } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/40 rounded-2xl p-5 mb-6 space-y-4 relative shadow-xl">

      {/* DISMISS BUTTON */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xs font-bold bg-zinc-950 p-1.5 rounded-lg border border-zinc-800"
        title="Dismiss explainer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-wider">
        <Sparkles className="w-4 h-4" />
        <span>WELCOME TO MECHSOURCE REAL PLATFORM</span>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Find Parts. Book Mechanics. Keep Machines Moving.
        </h2>
        <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
          MechSource connects vehicle owners, businesses, part sellers, and mobile mechanics into one ecosystem backed by fitment locking and escrow protection.
        </p>
      </div>

      {/* 4 CORE STEPS HOW IT WORKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Car className="w-4 h-4" />
            <span>1. Park Machine</span>
          </div>
          <p className="text-[11px] text-zinc-400">Lock fitment by parking your car, truck, or generator.</p>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Search className="w-4 h-4" />
            <span>2. Snap or Search</span>
          </div>
          <p className="text-[11px] text-zinc-400">Photograph old parts or enter OEM number to find sellers.</p>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>3. Escrow Protect</span>
          </div>
          <p className="text-[11px] text-zinc-400">Funds are held safely until part fits and engine runs right.</p>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Wrench className="w-4 h-4" />
            <span>4. Mobile Fitting</span>
          </div>
          <p className="text-[11px] text-zinc-400">Book verified mechanics to fit parts directly on-site.</p>
        </div>

      </div>

      {/* QUICK ROLE ACTIONS */}
      <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-zinc-400 mr-1">Quick Action:</span>
        <button
          onClick={() => { setRole('driver'); setActiveTab('garage'); }}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Park First Machine</span>
        </button>
        <button
          onClick={() => { setRole('driver'); setActiveTab('find'); }}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          Snap Part Photo
        </button>
        <button
          onClick={() => { setRole('seller'); setActiveTab('seller_dash'); }}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          Seller Store Portal
        </button>
        <button
          onClick={() => { setRole('fleet'); setActiveTab('fleet_yard'); }}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          Fleet Procurement (B2B)
        </button>
      </div>

    </div>
  );
};
