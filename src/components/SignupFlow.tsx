'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/db';
import {
  Car,
  Truck,
  Store,
  Wrench,
  CheckCircle2,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export function SignupFlow() {
  const router = useRouter();
  const { setRole, sendPhoneOtp, verifyPhoneOtp, updateUserProfile, completeOnboarding } = useAuth();

  // Signup step state: 1 (role) -> 2 (phone) -> 3 (otp) -> 4 (profile)
  const [signupStep, setSignupStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRole, setSelectedRoleState] = useState<UserRole>('driver');

  // Phone Auth State
  const [countryCode, setCountryCode] = useState('+234');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpErrorMsg, setOtpErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Rate limiting & timer state
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Registration Profile Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cityLocation, setCityLocation] = useState('Lagos');
  const [companyName, setCompany] = useState('');
  const [fleetSize, setFleetSize] = useState('10');
  const [storeName, setStoreName] = useState('');
  const [calloutFee, setCalloutFee] = useState('5000');
  const [specialisation, setSpecialisation] = useState('Toyota Diesel & Servicing');

  const countryCodes = [
    { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: '+1', flag: '🇺🇸', name: 'USA / Canada' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: '+233', flag: '🇬🇭', name: 'Ghana' },
    { code: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: '+971', flag: '🇦🇪', name: 'UAE' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+86', flag: '🇨🇳', name: 'China' }
  ];

  const rolesList = [
    { id: 'driver', badge: 'R-01', title: 'Driver / Vehicle Owner', desc: 'Parts & maintenance for my machine', icon: Car },
    { id: 'fleet', badge: 'R-02', title: 'Fleet / Business Manager', desc: 'Many machines, B2B procurement', icon: Truck },
    { id: 'seller', badge: 'R-03', title: 'Parts Seller Store', desc: 'List inventory stock & take orders', icon: Store },
    { id: 'mechanic', badge: 'R-04', title: 'Mechanic Pro Service', desc: 'Take mobile fitting jobs near me', icon: Wrench }
  ];

  // Timer countdown for OTP resend
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (signupStep === 3 && resendTimer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [signupStep, resendTimer]);

  const handleSelectRole = (r: UserRole) => {
    setSelectedRoleState(r);
    setRole(r);
  };

  const handleSendOtp = async (e?: React.FormEvent, isVoice: boolean = false) => {
    if (e) e.preventDefault();
    if (isLocked) return;

    if (!phoneNumber || phoneNumber.trim().length < 5) {
      setOtpErrorMsg('Please enter a valid phone number.');
      return;
    }

    setResendTimer(60);
    setCanResend(false);
    setOtpErrorMsg(null);
    await sendPhoneOtp(`${countryCode} ${phoneNumber}`, isVoice);
    setSignupStep(3);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (attemptCount >= 3) {
      setIsLocked(true);
      setOtpErrorMsg('Maximum verification attempts (3) reached. Please wait 60s or request a voice call.');
      return;
    }

    setIsVerifying(true);
    setOtpErrorMsg(null);

    const fullPhone = `${countryCode} ${phoneNumber}`;
    const result = await verifyPhoneOtp(fullPhone, otpInput);

    setIsVerifying(false);

    if (result.success) {
      setSignupStep(4);
    } else {
      const newAttempts = attemptCount + 1;
      setAttemptCount(newAttempts);
      if (newAttempts >= 3) {
        setIsLocked(true);
        setOtpErrorMsg('Rate limit exceeded: 3 failed attempts. Please request a new SMS or voice call.');
      } else {
        setOtpErrorMsg(result.error || `Invalid verification code. Attempts left: ${3 - newAttempts}`);
      }
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullPhone = `${countryCode} ${phoneNumber}`;
    await updateUserProfile({
      full_name: fullName || 'MechSource User',
      email: email || 'user@mechsource.ng',
      phone_number: fullPhone,
      primary_role: selectedRole
    });

    completeOnboarding();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-between p-6 text-white max-w-md mx-auto">
      <div>
        {/* BRAND TITLE HEADER */}
        <div className="text-center pt-2 pb-4">
          <h1 className="text-2xl font-black text-amber-500 tracking-tight">MECHSOURCE</h1>
          <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Parts & Maintenance Platform</p>
        </div>

        {/* NAVIGATION TABS (OUTSIDE ROLE SELECTOR CONTAINER) */}
        <div className="flex border-b border-zinc-800 mb-6 text-xs font-bold">
          <button
            type="button"
            className="flex-1 py-3 border-b-2 border-amber-500 text-amber-400 font-black tracking-wider uppercase text-center"
          >
            CREATE NEW ACCOUNT
          </button>
          <Link
            href="/signin"
            className="flex-1 py-3 border-b-2 border-transparent text-zinc-400 hover:text-white transition-all tracking-wider uppercase text-center"
          >
            SIGN IN TO EXISTING
          </Link>
        </div>

        {/* STEP 1: ROLE SELECTION */}
        {signupStep === 1 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                STEP 1 OF 3 · ACCOUNT ROLE
              </span>
              <h2 className="text-2xl font-black text-white">WHO'S KEEPING MACHINES MOVING?</h2>
              <p className="text-xs text-zinc-400">Select your primary role. You can switch or add roles later.</p>
            </div>

            <div className="space-y-2.5 pt-2">
              {rolesList.map((r) => {
                const isSelected = selectedRole === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleSelectRole(r.id as UserRole)}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-lg text-amber-400'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="bg-zinc-950 border border-zinc-800 text-amber-400 text-[10px] font-mono px-2 py-1 rounded-lg font-bold">
                        {r.badge}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{r.title}</h4>
                        <p className="text-[11px] text-zinc-400">{r.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-amber-500 border-amber-500 text-zinc-950' : 'border-zinc-700'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 fill-zinc-950 text-amber-500" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setSignupStep(2)}
              className="w-full mt-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-zinc-950 font-black py-4 rounded-xl text-xs uppercase shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>CONTINUE</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* STEP 2: ENTER MOBILE PHONE */}
        {signupStep === 2 && (
          <div className="space-y-4">
            <button
              onClick={() => setSignupStep(1)}
              className="text-xs text-zinc-400 hover:text-amber-400 flex items-center gap-1 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Role Selection
            </button>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                STEP 2 OF 3 · MOBILE PHONE
              </span>
              <h2 className="text-xl font-black text-white uppercase">ENTER MOBILE PHONE NUMBER</h2>
              <p className="text-xs text-zinc-400">We will send a 6-digit code via SMS to verify your number.</p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 block">
                  ENTER MOBILE PHONE NUMBER
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name}
                    </option>
                  ))}
                </select>

                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-amber-400 font-mono font-extrabold text-sm">
                    {countryCode}
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="803 000 0000"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 pl-16 pr-3.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono font-bold tracking-wide"
                    required
                  />
                </div>
              </div>

              {otpErrorMsg && (
                <p className="text-xs text-red-400 font-bold bg-red-500/10 p-2.5 rounded-lg border border-red-500/30 text-center">
                  {otpErrorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-zinc-950 font-black py-4 rounded-xl text-xs uppercase shadow-lg transition-all duration-200 tracking-wider flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 stroke-[2.5]" />
                <span>SEND SMS VERIFICATION CODE</span>
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {signupStep === 3 && (
          <div className="space-y-6 text-center">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                STEP 3 OF 3 · PHONE AUTHENTICATION
              </span>
              <h2 className="text-2xl font-black text-white">ENTER VERIFICATION CODE</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Sent by SMS to <strong className="text-white">{countryCode} {phoneNumber}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                <p className="text-[11px] text-zinc-400">
                  Check your mobile phone SMS inbox for your 6-digit security code.
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  disabled={isLocked || isVerifying}
                  onChange={(e) => {
                    setOtpInput(e.target.value);
                    setOtpErrorMsg(null);
                  }}
                  placeholder="──────"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 text-center text-2xl font-mono font-black text-amber-400 tracking-widest focus:outline-none focus:border-amber-500 placeholder-zinc-700 disabled:opacity-50"
                  required
                />
              </div>

              {otpErrorMsg && (
                <p className="text-xs text-red-400 font-bold bg-red-500/10 p-2.5 rounded-lg border border-red-500/30 text-center">
                  {otpErrorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isLocked || isVerifying || otpInput.length < 6}
                className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:transform-none text-zinc-950 font-black py-4 rounded-xl text-xs uppercase shadow-lg transition-all duration-200 tracking-wider flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <span>VERIFYING SERVER-SIDE...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>VERIFY CODE & CONTINUE</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-zinc-400 space-y-2">
              {canResend ? (
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAttemptCount(0);
                      setIsLocked(false);
                      handleSendOtp(undefined, false);
                    }}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Resend SMS Code
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAttemptCount(0);
                      setIsLocked(false);
                      handleSendOtp(undefined, true);
                    }}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Call me instead (Voice OTP)
                  </button>
                </div>
              ) : (
                <div>
                  Resend SMS code in{' '}
                  <strong className="font-mono text-amber-400">
                    00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                  </strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: PROFILE SETUP & DATABASE USER CREATION */}
        {signupStep === 4 && (
          <div className="space-y-4">
            <div className="text-center border-b border-zinc-800 pb-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">PROFILE SETUP</span>
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
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
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
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
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
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-zinc-400 block mb-1">FLEET MACHINE COUNT</label>
                    <input
                      type="number"
                      value={fleetSize}
                      onChange={(e) => setFleetSize(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
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
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-bold"
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-zinc-950 font-black py-4 rounded-xl text-xs uppercase shadow-lg transition-all mt-4"
              >
                FINISH REGISTRATION & ENTER MECHSOURCE
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
