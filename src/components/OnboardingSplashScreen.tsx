'use client';

/*
 * ONBOARDING INTRO & SLIDES COMPONENT
 * Features:
 * - Animated MechSource splash screen intro
 * - 3-slide animated onboarding carousel (Snap It, Park Machine, Escrow Protect)
 * - Navigates directly to /signup upon completion or skip
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Car,
  ShieldCheck,
  Wrench,
  ArrowRight
} from 'lucide-react';

export const OnboardingSplashScreen: React.FC<{ onComplete?: () => void }> = () => {
  const router = useRouter();
  const [step, setStep] = useState<'splash' | 'onboarding'>('splash');
  const [activeSlide, setActiveSlide] = useState(0);

  // Splash auto-advance to onboarding slides after 2s
  React.useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('onboarding');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const onboardingSlides = [
    {
      stepNum: '01 / 03',
      title: 'SNAP IT. WE NAME IT.',
      description: 'Photograph a worn or broken part. We identify it, give you the OEM number and check it fits your machine.',
      icon: Camera,
      badge: 'AI PART MATCH',
      color: 'from-amber-500/20 to-zinc-900'
    },
    {
      stepNum: '02 / 03',
      title: 'PARK YOUR MACHINE.',
      description: 'Add your vehicles to lock fitment for parts, oil filters, brake pads, and routine maintenance schedules.',
      icon: Car,
      badge: 'FITMENT LOCK',
      color: 'from-emerald-500/20 to-zinc-900'
    },
    {
      stepNum: '03 / 03',
      title: 'MECHSOURCE PROTECT.',
      description: 'Pay safely with escrow protection. Your payment is only released when the part fits and your machine runs right.',
      icon: ShieldCheck,
      badge: 'ESCROW SAFETY',
      color: 'from-blue-500/20 to-zinc-900'
    }
  ];

  const handleNextSlide = () => {
    if (activeSlide < onboardingSlides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      router.push('/signup');
    }
  };

  const handleSkip = () => {
    router.push('/signup');
  };

  // SPLASH INTRO SCREEN
  if (step === 'splash') {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="bg-amber-500 text-zinc-950 p-4 rounded-2xl mb-4 shadow-2xl animate-bounce">
          <Wrench className="w-12 h-12 stroke-[2.5]" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-amber-500 mb-2">MECHSOURCE</h1>
        <p className="text-sm font-semibold text-zinc-300 tracking-wide">Find the right part. Keep moving.</p>
        <p className="text-[10px] font-mono text-zinc-500 mt-6 tracking-widest uppercase">
          CARS · TRUCKS · DIESEL · TOOLS · SAFETY
        </p>
      </div>
    );
  }

  // ONBOARDING CAROUSEL SLIDES
  const current = onboardingSlides[activeSlide];
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-between p-6 text-white max-w-md mx-auto">
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
        <span className="text-amber-400 font-bold">{current.stepNum}</span>
        <button onClick={handleSkip} className="text-zinc-400 hover:text-white font-bold">
          Skip &rarr;
        </button>
      </div>

      <div className={`bg-gradient-to-b ${current.color} border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl my-auto`}>
        <div className="flex justify-center">
          <div className="bg-zinc-950/80 border border-amber-500/30 p-6 rounded-full shadow-2xl">
            <IconComponent className="w-16 h-16 text-amber-400" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase">
            {current.badge}
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white">{current.title}</h2>
          <p className="text-xs text-zinc-300 leading-relaxed max-w-xs mx-auto">{current.description}</p>
        </div>

        <div className="flex justify-center gap-2 pt-2">
          {onboardingSlides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                activeSlide === idx ? 'w-8 bg-amber-500' : 'w-2 bg-zinc-800'
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNextSlide}
        className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-2xl text-sm uppercase shadow-xl transition-all flex items-center justify-center gap-2"
      >
        <span>{activeSlide === onboardingSlides.length - 1 ? 'GET STARTED' : 'NEXT'}</span>
        <ArrowRight className="w-4 h-4 stroke-[3]" />
      </button>
    </div>
  );
};
