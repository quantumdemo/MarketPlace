'use client';

/*
 * ONBOARDING & SPLASH SCREEN ANIMATED COMPONENT
 * Pages 7, 8, 9 & 10 of PDF Design Reference
 * Features:
 * - Animated MechSource splash screen intro
 * - 3-slide animated onboarding carousel:
 *   1) Slide 01: SNAP IT. WE NAME IT. (Camera AI part identification)
 *   2) Slide 02: PARK YOUR MACHINE. (Fitment lock & garage)
 *   3) Slide 03: MECHSOURCE PROTECT. (Escrow holding & mobile mechanics)
 * - Role picker selection (R-01 Driver, R-02 Fleet, R-03 Seller, R-04 Mechanic)
 * - Phone OTP SMS verification step
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/db';
import {
  Camera,
  Car,
  ShieldCheck,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Phone,
  Lock,
  Sparkles,
  ChevronRight,
  Store,
  Truck,
  UserCheck
} from 'lucide-react';

export const OnboardingSplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { setRole, sendPhoneOtp, verifyPhoneOtp } = useAuth();

  const [step, setStep] = useState<'splash' | 'onboarding' | 'role_select' | 'otp'>('splash');
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedRole, setSelectedRoleState] = useState<UserRole>('driver');
  const [phoneNumber, setPhoneNumber] = useState('08030000000');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Splash auto-advance timer
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
      color: 'from-amber-500/20 to-zinc-900',
      lottie: '/animations/snap-and-identify.json'
    },
    {
      stepNum: '02 / 03',
      title: 'PARK YOUR MACHINE.',
      description: 'Add your vehicles to lock fitment for parts, oil filters, brake pads, and routine maintenance schedules.',
      icon: Car,
      badge: 'FITMENT LOCK',
      color: 'from-emerald-500/20 to-zinc-900',
      lottie: '/animations/garage-fitment-lock.json'
    },
    {
      stepNum: '03 / 03',
      title: 'MECHSOURCE PROTECT.',
      description: 'Pay safely with escrow protection. Your payment is only released when the part fits and your machine runs right.',
      icon: ShieldCheck,
      badge: 'ESCROW SAFETY',
      color: 'from-blue-500/20 to-zinc-900',
      lottie: '/animations/mechsource-protect.json'
    }
  ];

  const handleNextSlide = () => {
    if (activeSlide < onboardingSlides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      setStep('role_select');
    }
  };

  const handleSelectRole = (r: UserRole) => {
    setSelectedRoleState(r);
    setRole(r);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    sendPhoneOtp(phoneNumber);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPhoneOtp(otpInput)) {
      onComplete();
    } else {
      setOtpError(true);
    }
  };

  // SPLASH SCREEN (PAGE 7)
  if (step === 'splash') {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
        <div className="bg-amber-500 text-zinc-950 p-4 rounded-2xl mb-4 shadow-2xl animate-bounce">
          <Wrench className="w-12 h-12 stroke-[2.5]" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-amber-500 mb-2">MECHSOURCE</h1>
        <p className="text-sm font-semibold text-zinc-300 tracking-wide">Find the right part. Keep moving.</p>
        <p className="text-[10px] font-mono text-zinc-500 mt-6 tracking-widest uppercase">CARS · TRUCKS · DIESEL · TOOLS · SAFETY</p>
      </div>
    );
  }

  // ONBOARDING SLIDES (PAGE 8)
  if (step === 'onboarding') {
    const current = onboardingSlides[activeSlide];
    const IconComponent = current.icon;

    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-between p-6 text-white max-w-md mx-auto">

        {/* HEADER BAR */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="text-amber-400 font-bold">{current.stepNum}</span>
          <button
            onClick={() => setStep('role_select')}
            className="text-zinc-400 hover:text-white font-bold"
          >
            Skip &rarr;
          </button>
        </div>

        {/* ANIMATED SLIDE CARD */}
        <div className={`bg-gradient-to-b ${current.color} border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl transition-all my-auto`}>

          <div className="flex justify-center">
            <div className="relative bg-zinc-950/80 border border-amber-500/30 p-6 rounded-full shadow-2xl">
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

          {/* DOT INDICATORS */}
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

        {/* NEXT BUTTON */}
        <button
          onClick={handleNextSlide}
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-2xl text-sm uppercase shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <span>{activeSlide === onboardingSlides.length - 1 ? 'GET STARTED' : 'NEXT'}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

      </div>
    );
  }

  // ROLE SELECTION (PAGE 9)
  if (step === 'role_select') {
    const rolesList = [
      { id: 'driver', badge: 'R-01', title: 'Driver / Owner', desc: 'Parts for my vehicle', icon: Car },
      { id: 'fleet', badge: 'R-02', title: 'Fleet / Business', desc: 'Many machines, one account', icon: Truck },
      { id: 'seller', badge: 'R-03', title: 'Parts Seller', desc: 'List stock, get orders', icon: Store },
      { id: 'mechanic', badge: 'R-04', title: 'Mechanic', desc: 'Take jobs near me', icon: Wrench }
    ];

    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-between p-6 text-white max-w-md mx-auto">

        <div className="space-y-4">
          <div className="text-center pt-4 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase">STEP 2 OF 3</span>
            <h2 className="text-2xl font-black text-white">WHO'S KEEPING MACHINES MOVING?</h2>
            <p className="text-xs text-zinc-400">Pick one. You can switch or add roles later anytime.</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {rolesList.map((r) => {
              const IconComp = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => handleSelectRole(r.id as UserRole)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-lg text-amber-400'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-zinc-950 border border-zinc-800 text-amber-400 text-[10px] font-mono px-2 py-1 rounded-lg font-bold">
                      {r.badge}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{r.title}</h4>
                      <p className="text-xs text-zinc-400">{r.desc}</p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'border-zinc-700'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 fill-zinc-950 text-amber-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSendOtp} className="space-y-3 pt-4 border-t border-zinc-800">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 block mb-1">ENTER PHONE NUMBER</label>
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2">
              <span className="text-xs font-bold text-amber-400 mr-2">+234</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="803 000 0000"
                className="w-full bg-transparent text-sm text-white focus:outline-none font-mono font-bold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3.5 rounded-xl text-xs uppercase shadow-lg transition-all"
          >
            SEND SMS CODE
          </button>
        </form>

      </div>
    );
  }

  // PHONE OTP VERIFICATION (PAGE 10)
  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-between p-6 text-white max-w-md mx-auto">

      <div className="space-y-6 pt-6 text-center">
        <div>
          <span className="text-[10px] font-mono text-amber-400 uppercase">STEP 3 OF 3</span>
          <h2 className="text-2xl font-black text-white">ENTER THE CODE</h2>
          <p className="text-xs text-zinc-400 mt-1">Sent by SMS to <strong className="text-white">+234 {phoneNumber}</strong></p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={(e) => { setOtpInput(e.target.value); setOtpError(false); }}
              placeholder="4 8 1 2 0 0"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 text-center text-2xl font-mono font-black text-amber-400 tracking-widest focus:outline-none focus:border-amber-500"
              required
            />
            <span className="text-[11px] text-zinc-500 mt-2 block">Default demo OTP code is: <strong>481200</strong></span>
          </div>

          {otpError && (
            <p className="text-xs text-red-400 font-bold bg-red-500/10 p-2 rounded-lg border border-red-500/30">
              Invalid code. Try code 481200
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-xl text-xs uppercase shadow-lg transition-all"
          >
            VERIFY & CONTINUE TO APP
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-zinc-500 pb-4">
        Resend SMS in 00:42 · Call me instead
      </div>

    </div>
  );
};
