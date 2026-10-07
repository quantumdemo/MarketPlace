'use client';

/*
 * MECHANIC PRO HUB, 6-STEP JOB EXECUTION & EMERGENCY SOS
 * Pages 19, 20, 21, 22, 30 & 31 of PDF Design Reference
 * Features:
 * - Mechanic Trade Card directory (verified badges, specialisations, rating, call-out fee)
 * - Call-out fee booking & diagnosis quote interaction
 * - 3-second hold Emergency SOS breakdown trigger with live location & instant responder alert
 * - Mechanic Pro taking jobs toggle & earnings dashboard
 * - Interactive 6-step job execution sheet with photo uploads (Arrived -> Before photos -> Diagnose -> Fit parts -> Test run -> After photos -> Customer sign-off)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchMechanics, INITIAL_JOB, MechanicProfile, MechanicJobRecord } from '@/lib/db';
import { uploadFile } from '@/lib/storage';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Clock,
  Star,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Navigation,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  Send
} from 'lucide-react';

export const MechanicsAndSosView: React.FC = () => {
  const { currentRole, setActiveTab } = useAuth();

  // Selected mechanic for booking
  const [mechanics, setMechanics] = useState<MechanicProfile[]>([]);
  const [selectedMechanic, setSelectedMechanic] = useState<MechanicProfile | null>(null);

  useEffect(() => {
    async function loadMechanics() {
      const data = await fetchMechanics();
      setMechanics(data);
      if (data.length > 0) {
        setSelectedMechanic(data[0]);
      }
    }
    loadMechanics();
  }, []);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Emergency SOS state (3 second hold trigger)
  const [sosProgress, setSosProgress] = useState(0);
  const [sosActive, setSosActive] = useState(false);
  const [sosHoldTimer, setSosHoldTimer] = useState<NodeJS.Timeout | null>(null);

  // Mechanic Pro 6-step live job sheet state (Pages 30 & 31)
  const [job, setJob] = useState<MechanicJobRecord>(INITIAL_JOB);
  const [isOnline, setIsOnline] = useState(true);
  const [takingJobs, setTakingJobs] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Handle 3-second hold for SOS
  const startSosHold = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setSosProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setSosActive(true);
      }
    }, 100);
    setSosHoldTimer(interval as unknown as NodeJS.Timeout);
  };

  const cancelSosHold = () => {
    if (sosHoldTimer) clearInterval(sosHoldTimer);
    setSosProgress(0);
  };

  // Step-by-step job execution progress handler (Page 31)
  const handleToggleStep = (stepNumber: number) => {
    setJob(prev => {
      const updatedSteps = prev.steps.map(s =>
        s.step_number === stepNumber ? { ...s, completed: !s.completed } : s
      );
      const nextStep = updatedSteps.filter(s => s.completed).length + 1;
      return {
        ...prev,
        steps: updatedSteps,
        current_step: Math.min(6, nextStep)
      };
    });
  };

  const handleUploadJobPhoto = async (e: React.ChangeEvent<HTMLInputElement>, phase: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const result = await uploadFile(file, 'job_proof');
    setUploadingPhoto(false);

    setJob(prev => ({
      ...prev,
      before_photos: phase === 'before' ? [...prev.before_photos, result.url] : prev.before_photos,
      after_photos: phase === 'after' ? [...prev.after_photos, result.url] : prev.after_photos
    }));
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">

      {/* HEADER BAR */}
      <div className="border-b border-zinc-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-amber-500 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6" />
            MECHANIC PRO HUB & SOS
          </h1>
          <p className="text-xs text-zinc-400">Book verified mobile mechanics or activate Emergency breakdown mode.</p>
        </div>

        {/* SOS EMERGENCY BUTTON LINK */}
        <a
          href="#sos-mode"
          className="bg-red-500 hover:bg-red-600 text-white font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg animate-pulse"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>EMERGENCY SOS MODE</span>
        </a>
      </div>

      {/* MECHANIC PRO DASHBOARD VIEW FOR MECHANIC USER ROLE (PAGES 30 & 31) */}
      {currentRole === 'mechanic' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold">MECHSOURCE PRO ACCOUNT</span>
              <h2 className="text-xl font-black text-white">{job.mechanic_id === 'mech-01' ? 'Sampson "Diesel King" Okafor' : 'Mechanic Service'}</h2>
              <p className="text-xs text-zinc-400">Toyota & Diesel Specialist · ID Verified & Skills Tested</p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 bg-zinc-950 p-2 rounded-xl border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={takingJobs}
                  onChange={(e) => setTakingJobs(e.target.checked)}
                  className="accent-amber-500 w-4 h-4"
                />
                <span>{takingJobs ? 'ONLINE · TAKING JOBS' : 'OFFLINE'}</span>
              </label>

              <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded-xl text-right">
                <span className="text-[10px] text-zinc-400 block font-mono">TODAY'S EARNINGS</span>
                <span className="text-sm font-black text-amber-400 font-mono">₦32,500</span>
              </div>
            </div>
          </div>

          {/* JOB SHEET EXECUTION WORKFLOW (PAGE 31) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400">ACTIVE JOB SHEET #{job.id}</span>
                <h3 className="font-extrabold text-base text-white">{job.vehicle_info}</h3>
                <p className="text-xs text-zinc-400">Customer: {job.customer_name} ({job.customer_phone})</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-zinc-400 block">YOU EARN</span>
                <span className="text-lg font-black text-amber-400 font-mono">₦{job.earnings.toLocaleString()}</span>
              </div>
            </div>

            {/* 6-STEP TAP CHECKLIST */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 block uppercase">
                {job.steps.filter(s => s.completed).length} / 6 Steps Completed · Tap each step as you go
              </span>

              {job.steps.map((step) => (
                <div
                  key={step.step_number}
                  onClick={() => handleToggleStep(step.step_number)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    step.completed
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center ${
                      step.completed ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {step.completed ? '✓' : step.step_number}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">{step.title}</h4>
                      <p className="text-[10px] text-zinc-400">{step.description}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {step.completed ? 'DONE' : 'TAP'}
                  </span>
                </div>
              ))}
            </div>

            {/* PHOTO PROOF UPLOAD BUTTONS */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <label className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-3 rounded-xl text-center text-xs font-bold text-amber-400 cursor-pointer transition-all">
                <Camera className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span>+ Upload Before Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadJobPhoto(e, 'before')}
                  className="hidden"
                />
              </label>

              <label className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-3 rounded-xl text-center text-xs font-bold text-amber-400 cursor-pointer transition-all">
                <Camera className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                <span>+ Upload After Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadJobPhoto(e, 'after')}
                  className="hidden"
                />
              </label>
            </div>

            {/* SUBMIT FOR SIGN OFF */}
            <button
              onClick={() => alert('Job Sheet submitted for customer sign-off and escrow payment release!')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase transition-all shadow-lg mt-2"
            >
              SEND FOR CUSTOMER SIGN-OFF
            </button>

          </div>
        </div>
      )}

      {/* MECHANIC TRADE CARD DIRECTORY (PAGE 19 & 20) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            NEARBY VERIFIED MECHANICS
          </h3>
          <span className="text-xs text-zinc-400">Ikeja GRA & Surroundings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mechanics.map((mech) => (
            <div
              key={mech.id}
              onClick={() => setSelectedMechanic(mech)}
              className={`bg-zinc-950 border rounded-2xl p-4 space-y-3 cursor-pointer transition-all ${
                selectedMechanic?.id === mech.id ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={mech.avatar_url}
                  alt={mech.name}
                  className="w-14 h-14 rounded-xl object-cover border border-zinc-800"
                />
                <div>
                  <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>ID & SKILLS VERIFIED</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{mech.name}</h4>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{mech.rating}</span>
                    <span className="text-zinc-500 font-normal">({mech.jobs_completed} jobs)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 text-[10px]">
                {mech.specialisations.map((spec, i) => (
                  <span key={i} className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono">{mech.distance_km} km · {mech.eta_mins} mins</span>
                <span className="font-mono font-bold text-amber-400">₦{mech.callout_fee.toLocaleString()} Call-out</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SELECTED MECHANIC TRADE CARD BOOKING DETAIL (PAGE 20) */}
      {selectedMechanic && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase">MECHSOURCE TRADE CARD</span>
              <h3 className="text-lg font-black text-white uppercase">{selectedMechanic.name}</h3>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
              ★ {selectedMechanic.rating} Rating
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1">
              <h4 className="font-bold text-amber-400">Diagnose a problem</h4>
              <p className="text-[11px] text-zinc-400">Scan tool + inspection, quote before work</p>
              <span className="font-mono font-bold text-white block pt-1">₦{selectedMechanic.callout_fee.toLocaleString()}</span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1">
              <h4 className="font-bold text-amber-400">Fit a part I bought</h4>
              <p className="text-[11px] text-zinc-400">Bring it, or order it directly to mechanic</p>
              <span className="font-mono font-bold text-white block pt-1">₦12,000 Labour</span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1">
              <h4 className="font-bold text-amber-400">Routine service</h4>
              <p className="text-[11px] text-zinc-400">Oil, filters, checks · parts added at quote</p>
              <span className="font-mono font-bold text-white block pt-1">₦{selectedMechanic.standard_service_fee.toLocaleString()}</span>
            </div>

          </div>

          <button
            onClick={() => {
              setBookingConfirmed(true);
              setTimeout(() => setBookingConfirmed(false), 4000);
            }}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase shadow-lg transition-all"
          >
            BOOK NOW ₦{selectedMechanic.callout_fee.toLocaleString()} (ARRIVES IN {selectedMechanic.eta_mins} MINS)
          </button>

          {bookingConfirmed && (
            <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-3 rounded-xl text-xs font-bold text-center animate-bounce">
              ✓ Booking confirmed! {selectedMechanic.name} is en route to your location.
            </div>
          )}
        </div>
      )}

      {/* EMERGENCY SOS MODE 3-SECOND HOLD BUTTON (PAGE 21) */}
      <div id="sos-mode" className="bg-zinc-950 border-2 border-red-500/60 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <div>
              <span className="text-[10px] font-mono text-red-400 font-bold">EMERGENCY MODE</span>
              <h3 className="text-xl font-black text-white">STUCK? TELL US WHAT HAPPENED</h3>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">Third Mainland Bridge, inbound</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px] font-bold text-center">
          {['Won\'t start', 'Flat tyre', 'Overheating', 'Dead battery', 'Need towing', 'Out of fuel'].map((reason, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-zinc-300 hover:border-red-500/50 cursor-pointer">
              {reason}
            </div>
          ))}
        </div>

        {/* 3-SECOND HOLD BUTTON WITH PROGRESS BAR */}
        <div className="text-center space-y-2 pt-2">
          <button
            onMouseDown={startSosHold}
            onMouseUp={cancelSosHold}
            onTouchStart={startSosHold}
            onTouchEnd={cancelSosHold}
            className="w-full max-w-sm mx-auto bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-black py-4 rounded-2xl text-sm uppercase shadow-2xl relative overflow-hidden transition-all"
          >
            {/* Hold Progress Bar Overlay */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-red-800/80 transition-all"
              style={{ width: `${sosProgress}%` }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <span>HOLD FOR HELP (3 SECONDS)</span>
            </span>
          </button>

          <span className="text-[11px] text-zinc-400 block">
            Live location shared with emergency responder only.
          </span>
        </div>

        {sosActive && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl text-xs space-y-2 animate-bounce">
            <h4 className="font-bold text-sm text-red-400">🚨 EMERGENCY RESPONDER DISPATCHED</h4>
            <p>Rider and Mobile Tow Service assigned. Expected arrival in 12 minutes.</p>
            <div className="flex gap-2 pt-1">
              <button onClick={() => alert('Emergency contact notified')} className="bg-red-600 text-white font-bold px-3 py-1 rounded text-[10px]">
                Share Trip with Family
              </button>
              <a href="tel:112" className="bg-zinc-900 border border-zinc-700 text-white font-bold px-3 py-1 rounded text-[10px]">
                Call 112
              </a>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
