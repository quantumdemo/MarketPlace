'use client';

/*
 * WORKSHOPS, HEAVY EQUIPMENT RENTALS, WALLET & ADMIN PANEL
 * Pages 24, 25, 26, 32 & 33 of PDF Design Reference
 * Features:
 * - Workshop Directory (Free bay status counters: 2 of 6 free, 1 of 4 free, full)
 * - Heavy Equipment Rental Engine (CAT Excavators 20t, JCB Backhoes, Forklifts, Mikano Silent Generators with certified operator options)
 * - MechSource Wallet Ledger & Account Overview (Available vs Held Protect funds, transaction history)
 * - System Notifications & Alerts Feed (Order updates, quote alerts, maintenance reminders)
 * - Platform Super Admin Control Panel (Dispute resolution, escrow overrides, user role management)
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_EQUIPMENT, INITIAL_WORKSHOPS, EquipmentRental, Workshop } from '@/lib/db';
import {
  Building2,
  Truck,
  Wallet,
  Bell,
  ShieldCheck,
  User,
  CheckCircle2,
  Clock,
  Plus,
  Calendar,
  MapPin,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  Check
} from 'lucide-react';

export const ExtraModulesView: React.FC = () => {
  const {
    user,
    currentRole,
    setRole,
    walletBalance,
    heldEscrowBalance,
    transactions,
    notifications,
    markNotificationsRead,
    garage,
    logout,
    setActiveTab
  } = useAuth();

  const [equipmentList, setEquipmentList] = useState<EquipmentRental[]>(INITIAL_EQUIPMENT);
  const [workshopsList, setWorkshopsList] = useState<Workshop[]>(INITIAL_WORKSHOPS);
  const [bookedEquipmentId, setBookedEquipmentId] = useState<string | null>(null);

  const handleBookEquipment = (eqId: string) => {
    setBookedEquipmentId(eqId);
    setTimeout(() => setBookedEquipmentId(null), 3000);
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">

      {/* HEADER BAR */}
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-black text-amber-500 tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6" />
          WORKSHOPS, EQUIPMENT RENTAL & ACCOUNT
        </h1>
        <p className="text-xs text-zinc-400">Rent silent generators & excavators, find workshops with free bays, and manage your account.</p>
      </div>

      {/* RENT A MACHINE / HEAVY EQUIPMENT (PAGE 32) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-amber-400">HEAVY PLANT & GENERATORS</span>
            <h2 className="text-lg font-black text-white">RENT A MACHINE</h2>
          </div>
          <span className="text-xs text-zinc-400">Site: Lekki, Lagos · Includes Certified Operator</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {equipmentList.map((eq) => (
            <div key={eq.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
              <div>
                <img src={eq.image_url} alt={eq.title} className="w-full h-28 object-cover rounded-xl border border-zinc-800 mb-2" />
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
                  {eq.availability_status}
                </span>
                <h4 className="font-extrabold text-sm text-white mt-1">{eq.title}</h4>
                <p className="text-xs text-zinc-400">{eq.specifications}</p>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 block">DAILY RATE</span>
                  <span className="text-sm font-black text-amber-400 font-mono">₦{eq.daily_rate.toLocaleString()}</span>
                </div>

                {bookedEquipmentId === eq.id ? (
                  <span className="bg-emerald-500 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs">
                    ✓ Requested
                  </span>
                ) : (
                  <button
                    onClick={() => handleBookEquipment(eq.id)}
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    BOOK
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WORKSHOPS DIRECTORY & BAY AVAILABILITY (PAGE 33) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-amber-400">VERIFIED SERVICE CENTRES</span>
            <h2 className="text-lg font-black text-white">WORKSHOP DIRECTORY</h2>
          </div>
          <span className="text-xs text-zinc-400">Gearbox, AC, Injectors, Truck Bodywork</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workshopsList.map((ws) => (
            <div key={ws.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-sm text-white">{ws.name}</h4>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    {ws.location}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  ws.is_busy ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {ws.is_busy ? 'FULL TODAY' : `${ws.free_bays} OF ${ws.total_bays} BAYS FREE`}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 text-[10px]">
                {ws.specialties.map((sp, i) => (
                  <span key={i} className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                    {sp}
                  </span>
                ))}
              </div>

              <button
                onClick={() => alert(`Directions sent for ${ws.name}`)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-400 font-bold py-2 rounded-lg text-xs transition-colors"
              >
                BOOK SERVICE BAY
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ACCOUNT SETTINGS & WALLET LEDGER (PAGES 24 & 26) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* WALLET & MECHSOURCE PROTECT HELD FUNDS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase">WALLET & MECHSOURCE PROTECT</span>
              <h3 className="text-lg font-black text-white">FINANCIAL SUMMARY</h3>
            </div>
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
              <span className="text-[10px] text-zinc-400 block font-mono">AVAILABLE BALANCE</span>
              <span className="text-lg font-black text-amber-400 font-mono">₦{walletBalance.toLocaleString()}</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
              <span className="text-[10px] text-zinc-400 block font-mono">HELD IN PROTECT</span>
              <span className="text-lg font-black text-emerald-400 font-mono">₦{heldEscrowBalance.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-zinc-400 uppercase">Recent Activity</h4>
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-white">{tx.description}</p>
                  <span className="text-[10px] text-zinc-500">{tx.created_at}</span>
                </div>
                <span className={`font-mono font-bold ${tx.is_credit ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {tx.is_credit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ACCOUNT PROFILE & ROLE SWITCHING (PAGE 24) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
            <img src={user.avatar_url} alt={user.full_name} className="w-12 h-12 rounded-xl object-cover border border-zinc-800" />
            <div>
              <h3 className="font-extrabold text-base text-white">{user.full_name}</h3>
              <p className="text-xs text-zinc-400">{user.phone_number} · {user.email}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-amber-400 uppercase">My Stuff</h4>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex justify-between items-center">
              <span>My Garage Machines</span>
              <span className="font-bold text-amber-400">{garage.length} machines</span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex justify-between items-center">
              <span>Primary Delivery Address</span>
              <span className="font-bold text-zinc-300">Site office, Ikeja GRA</span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <button
              onClick={logout}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              Sign Out Persistent Account
            </button>
          </div>
        </div>

      </div>

      {/* PLATFORM SUPER ADMIN CONTROL PANEL (ADMIN ROLE ONLY) */}
      {currentRole === 'admin' && (
        <div className="bg-zinc-950 border-2 border-amber-500/60 rounded-2xl p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-6 h-6" />
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold">MECHSOURCE SUPER ADMIN</span>
                <h3 className="text-lg font-black text-white">PLATFORM ESCROW & DISPUTE OVERRIDES</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
              <span className="text-[10px] text-zinc-400 block font-mono">TOTAL ESCROW HELD</span>
              <span className="text-lg font-black text-emerald-400 font-mono">₦1,240,000</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
              <span className="text-[10px] text-zinc-400 block font-mono">ACTIVE DISPUTES</span>
              <span className="text-lg font-black text-amber-400 font-mono">1 Pending</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
              <span className="text-[10px] text-zinc-400 block font-mono">REGISTERED MECHANICS</span>
              <span className="text-lg font-black text-white font-mono">48 Verified</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
