'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  UserPlus
} from 'lucide-react';

export function SigninFlow() {
  const router = useRouter();
  const { sendPhoneOtp, verifyPhoneOtp, checkUserExists, loginExistingUser } = useAuth();

  // Signin step state: 'phone' -> 'otp'
  const [signinStep, setSigninStep] = useState<'phone' | 'otp'>('phone');

  // Phone state
  const [countryCode, setCountryCode] = useState('+234');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpErrorMsg, setOtpErrorMsg] = useState<string | null>(null);
  const [accountNotFoundErr, setAccountNotFoundErr] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Timer & rate limit state
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

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

  // OTP resend countdown
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (signinStep === 'otp' && resendTimer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [signinStep, resendTimer]);

  const handleSendOtp = async (e?: React.FormEvent, isVoice: boolean = false) => {
    if (e) e.preventDefault();
    if (isLocked) return;

    if (!phoneNumber || phoneNumber.trim().length < 5) {
      setOtpErrorMsg('Please enter your registered phone number.');
      return;
    }

    setResendTimer(60);
    setCanResend(false);
    setOtpErrorMsg(null);
    setAccountNotFoundErr(null);
    await sendPhoneOtp(`${countryCode} ${phoneNumber}`, isVoice);
    setSigninStep('otp');
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
    setAccountNotFoundErr(null);

    const fullPhone = `${countryCode} ${phoneNumber}`;
    const result = await verifyPhoneOtp(fullPhone, otpInput);

    if (result.success) {
      // Check if user exists in database or local store
      const userCheck = await checkUserExists(fullPhone);

      setIsVerifying(false);

      if (userCheck.exists && userCheck.user) {
        loginExistingUser(userCheck.user);
        router.push('/');
      } else {
        // Account not found error
        setAccountNotFoundErr(`Account not found for ${fullPhone}. Please create a new account to continue.`);
      }
    } else {
      setIsVerifying(false);
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

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-between p-6 text-white max-w-md mx-auto">
      <div>
        {/* BRAND TITLE HEADER */}
        <div className="text-center pt-2 pb-4">
          <h1 className="text-2xl font-black text-amber-500 tracking-tight">MECHSOURCE</h1>
          <p className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Parts & Maintenance Platform</p>
        </div>

        {/* NAVIGATION TABS (OUTSIDE CONTAINER) */}
        <div className="flex border-b border-zinc-800 mb-6 text-xs font-bold">
          <Link
            href="/signup"
            className="flex-1 py-3 border-b-2 border-transparent text-zinc-400 hover:text-white transition-all tracking-wider uppercase text-center"
          >
            CREATE NEW ACCOUNT
          </Link>
          <button
            type="button"
            className="flex-1 py-3 border-b-2 border-amber-500 text-amber-400 font-black tracking-wider uppercase text-center"
          >
            SIGN IN TO EXISTING
          </button>
        </div>

        {/* SIGN IN STEP 1: ENTER REGISTERED PHONE NUMBER */}
        {signinStep === 'phone' && (
          <div className="space-y-6 pt-2">
            <div className="text-center space-y-1.5">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">WELCOME BACK</h2>
              <p className="text-xs text-zinc-400">Enter your registered phone number to continue</p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 block tracking-wide">
                  ENTER REGISTERED PHONE NUMBER
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

              <p className="text-[11px] text-zinc-400 text-center">
                We will send a 6-digit code via SMS to verify your number
              </p>

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

        {/* SIGN IN STEP 2: OTP VERIFICATION & CHECK EXISTENCE */}
        {signinStep === 'otp' && (
          <div className="space-y-6 text-center pt-2">
            <div>
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
                    setAccountNotFoundErr(null);
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

              {accountNotFoundErr && (
                <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-4 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>ACCOUNT NOT FOUND</span>
                  </div>
                  <p className="text-xs text-zinc-300">{accountNotFoundErr}</p>
                  <Link
                    href="/signup"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>CREATE NEW ACCOUNT</span>
                  </Link>
                </div>
              )}

              {!accountNotFoundErr && (
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
                      <span>VERIFY & SIGN IN</span>
                    </>
                  )}
                </button>
              )}
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
      </div>

      {/* CLEAR DIVIDER & BOTTOM SWITCHER LINK */}
      <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
        <p className="text-xs text-zinc-400 mb-2">Don't have an account?</p>
        <Link
          href="/signup"
          className="text-amber-400 font-black text-xs uppercase hover:underline tracking-wider inline-flex items-center gap-1"
        >
          <span>CREATE NEW ACCOUNT</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
