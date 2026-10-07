'use client';

/*
 * MECHANICS DIRECTORY, CALLOUT BOOKING & SOS EMERGENCY MODULE
 * Pages 18, 19, 20, 21, 30 & 31 of PDF Design Reference
 * Features:
 * - Verified Trade Cards (Rating, ETA, Call-out fee, ID & Guarantor Verified badges)
 * - Call-out fee booking modal
 * - Interactive 6-step job execution sheet with photo uploads
 * - 3-second hold SOS Emergency mode
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchMechanics, fetchActiveMechanicJob, updateMechanicJobStep, MechanicProfile, MechanicJobRecord } from '@/lib/db';
import { uploadFile } from '@/lib/storage';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  PhoneCall,
  AlertTriangle,
  Plus,
  Camera,
  DollarSign,
  Check,
  ChevronRight,
  UserCheck
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
  const [job, setJob] = useState<MechanicJobRecord | null>(null);
  const [takingJobs, setTakingJobs] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    async function loadActiveJob() {
      const activeJob = await fetchActiveMechanicJob('mech-01');
      setJob(activeJob);
    }
    loadActiveJob();
  }, []);

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
    if (!job) return;
    setJob(prev => {
      if (!prev) return null;
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
    if (!file || !job) return;

    setUploadingPhoto(true);
    const result = await uploadFile(file, 'job_proof');
    setUploadingPhoto(false);

    setJob(prev => {
      if (!prev) return null;
      return {
        ...prev,
        before_photos: phase === 'before' ? [...prev.before_photos, result.url] : prev.before_photos,
        after_photos: phase === 'after' ? [...prev.after_photos, result.url] : prev.after_photos
      };
    });
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">

      {/* HEADER BAR */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
            {currentRole === 'mechanic' ? 'MECHANIC PRO WORK BENCH' : 'MOBILE FITTING & REPAIR'}
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {currentRole === 'mechanic' ? 'MY WORK ORDERS & CALLOUTS' : 'ON-DEMAND MOBILE MECHANICS'}
          </h1>
        </div>

        {/* SOS EMERGENCY BUTTON TRIGGER */}
        <div className="relative">
          <button
            onMouseDown={startSosHold}
            onMouseUp={cancelSosHold}
            onTouchStart={startSosHold}
            onTouchEnd={cancelSosHold}
            className="bg-red-600 hover:bg-red-500 text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase shadow-lg shadow-red-900/40 border border-red-400 flex items-center gap-2 transition-transform active:scale-95"
          >
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span>PRESS & HOLD SOS (3S)</span>
          </button>

          {sosProgress > 0 && (
            <div className="absolute inset-x-0 -bottom-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-100"
                style={{ width: `${sosProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* SOS EMERGENCY ACTIVE MODAL */}
      {sosActive && (
        <div className="bg-red-950/90 border-2 border-red-500 rounded-2xl p-5 space-y-4 shadow-2xl animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white p-3 rounded-xl font-bold">
                <AlertTriangle className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">EMERGENCY SOS DISPATCH TRIGGERED</h3>
                <p className="text-xs text-red-200">Broadcasting live GPS location to nearest 3 mobile mechanics & roadside units.</p>
              </div>
            </div>
            <button
              onClick={() => setSosActive(false)}
              className="bg-zinc-900 text-zinc-300 font-bold px-3 py-1.5 rounded-lg text-xs hover:text-white"
            >
              Cancel Emergency
            </button>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-red-900 text-xs text-zinc-300 space-y-1">
            <p><strong>GPS Location:</strong> Ikeja GRA, Lagos (6.5921° N, 3.3581° E)</p>
            <p><strong>Dispatch Status:</strong> 2 Patrol mechanics alerted · Estimated arrival: 8 mins</p>
          </div>
        </div>
      )}

      {/* CUSTOMER & DRIVER VIEW: FIND & BOOK MECHANICS */}
      {currentRole !== 'mechanic' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-white tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              VERIFIED TRADE MECHANICS NEARBY
            </h2>
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
                      <span>ID & GUARANTOR VERIFIED</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-white">{mech.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {mech.rating}
                      </span>
                      <span>({mech.jobs_completed} jobs)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {mech.specialisations.map((s, idx) => (
                    <span key={idx} className="bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">CALL-OUT FEE</span>
                    <span className="font-mono font-bold text-amber-400">₦{mech.callout_fee.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">ETA</span>
                    <span className="font-bold text-emerald-400">{mech.eta_mins} mins away</span>
                  </div>
                </div>

                <button
                  onClick={() => { setSelectedMechanic(mech); setBookingConfirmed(true); }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-2.5 rounded-xl text-xs uppercase shadow-md transition-colors"
                >
                  BOOK MOBILE CALLOUT
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MECHANIC PRO DASHBOARD VIEW FOR MECHANIC USER ROLE (PAGES 30 & 31) */}
      {currentRole === 'mechanic' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold">MECHSOURCE PRO ACCOUNT</span>
              <h2 className="text-xl font-black text-white">{job?.mechanic_id === 'mech-01' ? 'Sampson "Diesel King" Okafor' : 'Mechanic Service'}</h2>
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
          {job ? (
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
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      step.completed ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-black ${
                      step.completed ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'border-zinc-700 text-zinc-400'
                    }`}>
                      {step.step_number}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-xs text-white">{step.title}</h5>
                      <p className="text-[11px] text-zinc-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400 space-y-2">
              <Wrench className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-white">No Active Job Assignment</p>
              <p className="text-xs text-zinc-500">You are currently online and taking callouts in Ikeja GRA. You will be notified when a customer books a mobile service.</p>
            </div>
          )}
        </div>
      )}

      {/* BOOKING CONFIRMED MODAL */}
      {bookingConfirmed && selectedMechanic && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-amber-500/50 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">MOBILE MECHANIC BOOKED</h3>
              <p className="text-xs text-zinc-400 mt-1">
                {selectedMechanic.name} is dispatched to your location with your ordered parts.
              </p>
            </div>

            <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs text-left space-y-1">
              <p className="text-zinc-300"><strong>Call-out Fee:</strong> ₦{selectedMechanic.callout_fee.toLocaleString()} (Held in Protect Escrow)</p>
              <p className="text-zinc-300"><strong>Estimated Arrival:</strong> {selectedMechanic.eta_mins} minutes</p>
            </div>

            <button
              onClick={() => { setBookingConfirmed(false); setActiveTab('orders'); }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase"
            >
              TRACK FITMENT JOB ON ORDERS TAB
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
