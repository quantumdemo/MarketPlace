'use client';

/*
 * MAIN MECHSOURCE APPLICATION PAGE ENTRYPOINT
 * Integrates AuthProvider, AppShell layout, onboarding splash screen, welcome banner, and bottom tab views:
 * - Onboarding Splash Screen (Persisted in localStorage, shown once to new users)
 * - Welcome Platform Banner
 * - Home / Garage Hub
 * - Find My Part Engine
 * - Orders & MechSource Protect Escrow
 * - Mechanics & SOS Emergency Hub
 * - Seller & B2B Fleet Procurement
 * - Workshops, Equipment Rental & Account Settings
 */

import React from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppHeader, BottomNavBar } from '@/components/AppShell';
import { OnboardingSplashScreen } from '@/components/OnboardingSplashScreen';
import { WelcomePlatformBanner } from '@/components/WelcomePlatformBanner';
import { GarageView } from '@/components/GarageView';
import { FindMyPartView } from '@/components/FindMyPartView';
import { OrdersAndEscrowView } from '@/components/OrdersAndEscrowView';
import { MechanicsAndSosView } from '@/components/MechanicsAndSosView';
import { SellerAndFleetView } from '@/components/SellerAndFleetView';
import { ExtraModulesView } from '@/components/ExtraModulesView';

const MainContent: React.FC = () => {
  const { activeTab, hasCompletedOnboarding, completeOnboarding } = useAuth();

  if (!hasCompletedOnboarding) {
    return <OnboardingSplashScreen onComplete={completeOnboarding} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
      case 'garage':
        return <GarageView />;
      case 'find':
        return <FindMyPartView />;
      case 'orders':
        return <OrdersAndEscrowView />;
      case 'mechanics':
      case 'mechanic_dash':
      case 'mechanic_step':
        return <MechanicsAndSosView />;
      case 'seller_dash':
      case 'seller_requests':
      case 'seller_stock':
      case 'fleet_yard':
      case 'fleet_rfq':
        return <SellerAndFleetView />;
      case 'notifications':
      case 'admin_panel':
      case 'account':
      default:
        return <ExtraModulesView />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      <AppHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6 pb-24">
        <WelcomePlatformBanner />
        {renderActiveView()}
      </main>
      <BottomNavBar />
    </div>
  );
};

export default function Home() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
