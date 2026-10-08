'use client';

/*
 * MAIN MECHSOURCE APPLICATION ENTRY POINT
 * Renders Onboarding / Phone Auth flow for non-authenticated or new users,
 * and wraps authenticated users in the responsive AppShell layout.
 */

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/AppShell';
import { OnboardingSplashScreen } from '@/components/OnboardingSplashScreen';
import { WelcomePlatformBanner } from '@/components/WelcomePlatformBanner';
import { FindMyPartView } from '@/components/FindMyPartView';
import { GarageView } from '@/components/GarageView';
import { OrdersAndEscrowView } from '@/components/OrdersAndEscrowView';
import { MechanicsAndSosView } from '@/components/MechanicsAndSosView';
import { SellerAndFleetView } from '@/components/SellerAndFleetView';
import { ExtraModulesView } from '@/components/ExtraModulesView';

export default function Home() {
  const { hasCompletedOnboarding, activeTab } = useAuth();

  if (!hasCompletedOnboarding) {
    return <OnboardingSplashScreen />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'garage':
      case 'account':
        return <GarageView />;
      case 'orders':
        return <OrdersAndEscrowView />;
      case 'mechanics':
      case 'mechanic_dash':
      case 'mechanic_step':
        return <MechanicsAndSosView />;
      case 'seller':
      case 'seller_dash':
      case 'seller_requests':
      case 'seller_stock':
      case 'fleet_yard':
      case 'fleet_rfq':
        return <SellerAndFleetView />;
      case 'more':
      case 'admin_panel':
        return <ExtraModulesView />;
      case 'home':
      case 'find':
      default:
        return (
          <div className="space-y-6">
            <WelcomePlatformBanner />
            <FindMyPartView />
          </div>
        );
    }
  };

  return <AppShell>{renderActiveView()}</AppShell>;
}
