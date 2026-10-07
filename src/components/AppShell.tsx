'use client';

/*
 * MECHSOURCE APP NAVIGATION & HEADER SHELL
 * Implements top system header, role switcher dropdown, notification badge,
 * and bottom role-aware navigation bar strictly aligned with the PDF design.
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/db';
import {
  Car,
  Search,
  PackageCheck,
  Wrench,
  User,
  Bell,
  Store,
  Truck,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { user, currentRole, setRole, notifications, activeTab, setActiveTab, garage } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const primaryVehicle = garage[0];

  const roleLabels: Record<UserRole, { title: string; badge: string }> = {
    driver: { title: 'Driver / Vehicle Owner', badge: 'R-01' },
    fleet: { title: 'Fleet / Business Manager', badge: 'R-02' },
    seller: { title: 'Parts Seller Store', badge: 'R-03' },
    mechanic: { title: 'Mechanic Pro Service', badge: 'R-04' },
    admin: { title: 'Platform Super Admin', badge: 'ADMIN' }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950 border-b border-zinc-800 text-white px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* LOGO & BRANDING */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-2 text-amber-500 font-extrabold text-xl tracking-tight"
          >
            <div className="bg-amber-500 text-zinc-950 p-1.5 rounded-lg">
              <Wrench className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span>MECHSOURCE</span>
          </button>

          {/* ACTIVE VEHICLE FITMENT LOCK BADGE */}
          {currentRole === 'driver' && primaryVehicle && (
            <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full text-xs text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              <span>Fitment Lock: <strong className="text-amber-400">{primaryVehicle.make} {primaryVehicle.model} {primaryVehicle.year}</strong></span>
            </div>
          )}
        </div>

        {/* RIGHT CONTROLS: NOTIFICATIONS & ROLE SWITCHER */}
        <div className="flex items-center space-x-3">

          {/* ALERTS / NOTIFICATION BUTTON */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-zinc-300 transition-colors"
            title="System Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* ROLE SWITCHER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              <span className="bg-zinc-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-mono">
                {roleLabels[currentRole].badge}
              </span>
              <span className="hidden md:inline">{roleLabels[currentRole].title}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* ROLE DROPDOWN MENU */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 p-2 text-zinc-200">
                <div className="px-3 py-2 border-b border-zinc-800 text-xs text-zinc-400">
                  Switch MechSource Role:
                </div>

                {(['driver', 'fleet', 'seller', 'mechanic', 'admin'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      setRole(role);
                      setShowRoleMenu(false);
                      if (role === 'seller') setActiveTab('seller_dash');
                      else if (role === 'mechanic') setActiveTab('mechanic_dash');
                      else if (role === 'fleet') setActiveTab('fleet_yard');
                      else if (role === 'admin') setActiveTab('admin_panel');
                      else setActiveTab('home');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentRole === role ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30' : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span>{roleLabels[role].title}</span>
                    <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
                      {roleLabels[role].badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export const AppShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <AppHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <BottomNavBar />
    </div>
  );
};

export const BottomNavBar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab } = useAuth();

  // Define tab navigation based on active User Role
  const getTabs = () => {
    if (currentRole === 'seller') {
      return [
        { id: 'seller_dash', label: 'Pack Queue', icon: PackageCheck },
        { id: 'seller_requests', label: 'Part Requests', icon: Search },
        { id: 'seller_stock', label: 'Add Stock', icon: Layers },
        { id: 'account', label: 'Store Account', icon: Store }
      ];
    }

    if (currentRole === 'mechanic') {
      return [
        { id: 'mechanic_dash', label: 'Jobs Hub', icon: Wrench },
        { id: 'mechanic_step', label: 'Live Job Sheet', icon: CheckCircle2 },
        { id: 'mechanics', label: 'Trade Card', icon: User },
        { id: 'account', label: 'Account', icon: User }
      ];
    }

    if (currentRole === 'fleet') {
      return [
        { id: 'fleet_yard', label: 'The Yard', icon: Truck },
        { id: 'fleet_rfq', label: 'B2B RFQs', icon: Layers },
        { id: 'garage', label: 'Fleet Garage', icon: Car },
        { id: 'account', label: 'Fleet Account', icon: User }
      ];
    }

    if (currentRole === 'admin') {
      return [
        { id: 'admin_panel', label: 'Platform Control', icon: ShieldAlert },
        { id: 'orders', label: 'All Orders', icon: PackageCheck },
        { id: 'account', label: 'Admin Settings', icon: User }
      ];
    }

    // Default Customer / Driver Tabs
    return [
      { id: 'home', label: 'Home', icon: Car },
      { id: 'find', label: 'Find My Part', icon: Search },
      { id: 'orders', label: 'Orders', icon: PackageCheck },
      { id: 'mechanics', label: 'Mechanics', icon: Wrench },
      { id: 'account', label: 'Account / Garage', icon: User }
    ];
  };

  const tabs = getTabs();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950 border-t border-zinc-800 text-zinc-400 py-2 px-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 py-1 px-2 rounded-lg transition-all ${
                isActive ? 'text-amber-400 font-bold scale-105' : 'hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
