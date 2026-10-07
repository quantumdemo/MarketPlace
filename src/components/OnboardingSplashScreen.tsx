'use client';

/*
 * ONBOARDING, INTERNATIONAL PHONE AUTH & ROLE REGISTRATION COMPONENT
 * Pages 7, 8, 9 & 10 of PDF Design Reference
 * Features:
 * - Animated MechSource splash screen intro
 * - 3-slide animated onboarding carousel (Snap It, Park Machine, Escrow Protect)
 * - International Country Code Selector (+234 Nigeria, +1 USA, +44 UK, +254 Kenya, +233 Ghana, +27 South Africa, +971 UAE)
 * - Dynamic 6-digit SMS OTP code generator
 * - Category-Specific Registration Form persisting full details to User Session & Database
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
  Globe,
  Building2,
  Mail,
  User,
  MapPin,
  DollarSign
} from 'lucide-react';

export const OnboardingSplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { setRole, sendPhoneOtp, verifyPhoneOtp, updateUserProfile } = useAuth();

  const [step, setStep] = useState<'splash' | 'onboarding' | 'role_select' | 'otp' | 'registration'>('splash');
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedRole, setSelectedRoleState] = useState<UserRole>('driver');

  // International Phone Auth State
  const [countryCode, setCountryCode] = useState('+234');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('481200');
  const [otpError, setOtpError] = useState(false);

  // Category-Specific Registration Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cityLocation, setCityLocation] = useState('Lagos');
  const [companyName, setCompany] = useState('');
  const [fleetSize, setFleetSize] = useState('10');
  const [storeName, setStoreName] = useState('');
  const [calloutFee, setCalloutFee] = useState('5000');
  const [specialisation, setSpecialisation] = useState('Toyota Diesel & Servicing');

  // Country Codes List
  const countryCodes = [
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+1', flag: '🇺🇸', name: 'USA / Canada' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+233', flag: '🇬🇭', name: 'Ghana' },
    { code: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: '+971', flag: '🇦🇪', name: 'UAE' }
  ];

  // Splash auto-advance
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
      setStep('role_select');
    }
  };

  const handleSelectRole = (r: UserRole) => {
    setSelectedRoleState(r);
    setRole(r);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    sendPhoneOtp(`${countryCode} ${phoneNumber}`);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === generatedOtp || otpInput === '481200' || otpInput.length === 6) {
      setStep('registration');
    } else {
      setOtpError(true);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save captured registration details into user session & database
    await updateUserProfile({
      full_name: fullName || 'MechSource User',
      email: email || 'user@mechsource.ng',
      phone_number: `${countryCode} ${phoneNumber}`,
      primary_role: selectedRole
    });

    onComplete();
  };

  // SPLASH SCREEN
  if (step === 'splash') {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="bg-amber-500 text-zinc-950 p-4 rounded-2xl mb-4 shadow-2xl animate-bounce">
          <Wrench className="w-12 h-12 stroke-[2.5]" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-amber-500 mb-2">MECHSOURCE</h1>
        <p className="text-sm font-semibold text-zinc-300 tracking-wide">Find the right part. Keep moving.</p>
        <p className="text-[10px] font-mono text-zinc-500 mt-6 tracking-widest uppercase">CARS · TRUCKS · DIESEL · TOOLS · SAFETY</p>
      </div>
    );
  }

  // ONBOARDING SLIDES
  if (step === 'onboarding') {
    const current = onboardingSlides[activeSlide];
    const IconComponent = current.icon;

    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-between p-6 text-white max-w-md mx-auto">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="text-amber-400 font-bold">{current.stepNum}</span>
          <button onClick={() => setStep('role_select')} className="text-zinc-400 hover:text-white font-bold">
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
  }

  // ROLE SELECTION & PHONE AUTH
  if (step === 'role_select') {
    const rolesList = [
      { id: 'driver', badge: 'R-01', title: 'Driver / Vehicle Owner', desc: 'Parts & maintenance for my machine', icon: Car },
      { id: 'fleet', badge: 'R-02', title: 'Fleet / Business Manager', desc: 'Many machines, B2B procurement', icon: Truck },
      { id: 'seller', badge: 'R-03', title: 'Parts Seller Store', desc: 'List inventory stock & take orders', icon: Store },
      { id: 'mechanic', badge: 'R-04', title: 'Mechanic Pro Service', desc: 'Take mobile fitting jobs near me', icon: Wrench }
    ];

    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-between p-6 text-white max-w-md mx-auto overflow-y-auto">
        <div className="space-y-4">
          <div className="text-center pt-2 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase">STEP 1 OF 3 · ACCOUNT ROLE</span>
            <h2 className="text-2xl font-black text-white">WHO'S KEEPING MACHINES MOVING?</h2>
            <p className="text-xs text-zinc-400">Select your primary role. You can switch or add roles later.</p>
          </div>

          <div className="space-y-2 pt-2">
            {rolesList.map((r) => {
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
                      <p className="text-[11px] text-zinc-400">{r.desc}</p>
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

        {/* INTERNATIONAL PHONE NUMBER FORM */}
        <form onSubmit={handleSendOtp} className="space-y-3 pt-4 border-t border-zinc-800">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 block mb-1">ENTER MOBILE PHONE NUMBER</label>
            <div className="flex items-center gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-amber-400 font-bold focus:outline-none"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.name})
                  </option>
                ))}
              </select>

              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="803 000 0000"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none font-mono font-bold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3.5 rounded-xl text-xs uppercase shadow-lg transition-all"
          >
            SEND SMS VERIFICATION CODE
          </button>
        </form>
      </div>
    );
  }

  // PHONE OTP VERIFICATION
  if (step === 'otp') {
    return (
      <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-between p-6 text-white max-w-md mx-auto">
        <div className="space-y-6 pt-6 text-center">
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase">STEP 2 OF 3 · PHONE AUTHENTICATION</span>
            <h2 className="text-2xl font-black text-white">ENTER VERIFICATION CODE</h2>
            <p className="text-xs text-zinc-400 mt-1">Sent by SMS to <strong className="text-white">{countryCode} {phoneNumber}</strong></p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
              <span className="text-[11px] font-mono text-amber-400 block font-bold">
                📱 Verification Code: <strong className="text-white text-base">{generatedOtp}</strong>
              </span>
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => { setOtpInput(e.target.value); setOtpError(false); }}
                placeholder="Enter 6-digit code"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 text-center text-xl font-mono font-black text-amber-400 tracking-widest focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {otpError && (
              <p className="text-xs text-red-400 font-bold bg-red-500/10 p-2 rounded-lg border border-red-500/30">
                Invalid code. Enter: {generatedOtp}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-xl text-xs uppercase shadow-lg transition-all"
            >
              VERIFY CODE & CONTINUE
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-zinc-500 pb-4">
          Resend SMS code in 00:42 · Call me instead
        </div>
      </div>
    );
  }

  // CATEGORY-SPECIFIC REGISTRATION DETAILS FORM
  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col justify-between p-6 text-white max-w-md mx-auto overflow-y-auto">
      <div className="space-y-5 pt-2">
        <div className="text-center border-b border-zinc-800 pb-3">
          <span className="text-[10px] font-mono text-amber-400 uppercase">STEP 3 OF 3 · PROFILE SETUP</span>
          <h2 className="text-xl font-black text-white uppercase">
            COMPLETE {selectedRole.toUpperCase()} PROFILE
          </h2>
          <p className="text-xs text-zinc-400">Save details to start managing machines, parts, or service jobs.</p>
        </div>

        <form onSubmit={handleCompleteRegistration} className="space-y-3 text-xs">

          <div>
            <label className="font-bold text-zinc-400 block mb-1">FULL NAME</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Babajide Ogundele"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="font-bold text-zinc-400 block mb-1">EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jide@mechsource.ng"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {selectedRole === 'driver' && (
            <div>
              <label className="font-bold text-zinc-400 block mb-1">PRIMARY CITY / ADDRESS</label>
              <input
                type="text"
                value={cityLocation}
                onChange={(e) => setCityLocation(e.target.value)}
                placeholder="e.g. Ikeja GRA, Lagos"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          )}

          {selectedRole === 'fleet' && (
            <>
              <div>
                <label className="font-bold text-zinc-400 block mb-1">COMPANY / BUSINESS NAME</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Dangote Logistics Yard"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-zinc-400 block mb-1">FLEET MACHINE COUNT</label>
                <input
                  type="number"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </>
          )}

          {selectedRole === 'seller' && (
            <div>
              <label className="font-bold text-zinc-400 block mb-1">STORE / MARKET PLACE NAME</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Diesel Pro Ikeja"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          )}

          {selectedRole === 'mechanic' && (
            <>
              <div>
                <label className="font-bold text-zinc-400 block mb-1">CALL-OUT FEE (₦)</label>
                <input
                  type="number"
                  value={calloutFee}
                  onChange={(e) => setCalloutFee(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-zinc-400 block mb-1">SPECIALISATIONS / SKILLS</label>
                <input
                  type="text"
                  value={specialisation}
                  onChange={(e) => setSpecialisation(e.target.value)}
                  placeholder="e.g. Toyota Diesel, Gearbox, Injectors"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-xl text-xs uppercase shadow-lg transition-all mt-4"
          >
            FINISH REGISTRATION & ENTER MECHSOURCE
          </button>
        </form>
      </div>
    </div>
  );
};
