'use client';

/*
 * GARAGE & FITMENT ENGINE MODULE
 * Pages 11 & 23 of PDF Design Reference
 * Allows customer and fleet users to park machines (Car, SUV, Truck, Generator, Heavy Plant),
 * run simulated VIN/paper scanner, track odometer readings, and manage maintenance schedules.
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GarageVehicle } from '@/lib/db';
import {
  Car,
  Plus,
  QrCode,
  Gauge,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShoppingBag,
  Fuel,
  Zap,
  Check
} from 'lucide-react';

export const GarageView: React.FC = () => {
  const { garage, addVehicleToGarage, setActiveTab } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [scanningVin, setScanningVin] = useState(false);

  // Form State
  const [vehicleType, setVehicleType] = useState<'Car / SUV' | 'Truck' | 'Generator' | 'Heavy Plant'>('Car / SUV');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Hilux');
  const [year, setYear] = useState(2018);
  const [engine, setEngine] = useState('1GD-FTV');
  const [fuelType, setFuelType] = useState('Diesel');
  const [nickname, setNickname] = useState('MY HILUX 2018');
  const [vin, setVin] = useState('');

  // Active selected machine for odometer & service check
  const [selectedVehicle, setSelectedVehicle] = useState<GarageVehicle | null>(garage[0] || null);
  const [odometerInput, setOdometerInput] = useState(selectedVehicle ? selectedVehicle.odometer_km.toString() : '0');
  const [odometerUpdated, setOdometerUpdated] = useState(false);

  // Simulate VIN scan auto-fill
  const handleSimulateVinScan = () => {
    setScanningVin(true);
    setTimeout(() => {
      setMake('Toyota');
      setModel('Hilux');
      setYear(2018);
      setEngine('1GD-FTV');
      setFuelType('Diesel');
      setVin('AHTFR22G90581920');
      setNickname('TOYOTA HILUX 2018');
      setScanningVin(false);
    }, 1200);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newV: Omit<GarageVehicle, 'id' | 'user_id'> = {
      vehicle_type: vehicleType,
      make,
      model,
      year: Number(year),
      engine,
      fuel_type: fuelType,
      nickname,
      vin,
      odometer_km: 0,
      status: 'Running',
      is_fleet: false
    };
    addVehicleToGarage(newV);
    setShowAddModal(false);
  };

  const handleUpdateOdometer = () => {
    if (selectedVehicle) {
      selectedVehicle.odometer_km = Number(odometerInput);
      setOdometerUpdated(true);
      setTimeout(() => setOdometerUpdated(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">

      {/* HEADER BAR */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-amber-500 tracking-tight flex items-center gap-2">
            <Car className="w-6 h-6" />
            MY GARAGE
          </h1>
          <p className="text-xs text-zinc-400">Park machines to lock fitment for parts, oil, and scheduled service.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>PARK MACHINE</span>
        </button>
      </div>

      {/* PARKED MACHINES CARDS OR EMPTY STATE */}
      {garage.length === 0 ? (
        <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-2xl p-8 text-center space-y-4">
          <div className="bg-amber-500/10 text-amber-400 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">NO MACHINES PARKED YET</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              Park your car, truck, generator or heavy plant machine to lock exact fitment for all parts and maintenance.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-5 py-3 rounded-xl text-xs uppercase shadow-lg transition-all"
          >
            + PARK YOUR FIRST MACHINE NOW
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {garage.map((v, idx) => (
            <div
              key={v.id}
              onClick={() => {
                setSelectedVehicle(v);
                setOdometerInput(v.odometer_km.toString());
              }}
              className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                selectedVehicle?.id === v.id
                  ? 'bg-zinc-900 border-amber-500/80 shadow-lg ring-1 ring-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-1">
                <span>MECHSOURCE GARAGE NO. 0{idx + 1}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                  v.status === 'Running' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {v.status}
                </span>
              </div>

              <h3 className="font-extrabold text-lg uppercase tracking-tight text-white">{v.make} {v.model}</h3>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <span>YEAR: <strong className="text-zinc-200">{v.year}</strong></span>
                <span>•</span>
                <span>ENGINE: <strong className="text-zinc-200">{v.engine}</strong></span>
                <span>•</span>
                <span>FUEL: <strong className="text-zinc-200">{v.fuel_type}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE MACHINE DETAILED ODOMETER & MAINTENANCE HUB */}
      {selectedVehicle && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-6">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase">Active Machine Detail</span>
              <h2 className="text-xl font-black text-white">{selectedVehicle.nickname || `${selectedVehicle.make} ${selectedVehicle.model}`}</h2>
              <p className="text-xs text-zinc-400">VIN: {selectedVehicle.vin || 'AHTFR22G90581920'} · Engine: {selectedVehicle.engine}</p>
            </div>

            {/* ODOMETER DISPLAY */}
            <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <Gauge className="w-5 h-5 text-amber-400" />
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase block">Odometer (KM)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={odometerInput}
                    onChange={(e) => setOdometerInput(e.target.value)}
                    className="bg-zinc-900 font-mono text-lg font-bold text-amber-400 px-2 py-0.5 rounded border border-zinc-700 w-28 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleUpdateOdometer}
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3 py-1 rounded text-xs transition-colors"
                  >
                    {odometerUpdated ? <Check className="w-4 h-4" /> : 'Update'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* UPCOMING MAINTENANCE SCHEDULE */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Upcoming Maintenance Schedule
            </h3>

            <div className="space-y-3">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 mt-0.5">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Engine oil + oil filter</h4>
                    <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Due Soon · Every 5,000 km
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('find')}
                  className="bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-400 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shop Parts</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* PARK NEW MACHINE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5">

            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400">MECHSOURCE GARAGE NO. 0{garage.length + 1}</span>
                <h3 className="font-black text-xl text-white">PARK YOUR MACHINE</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* VIN SCAN SIMULATOR BUTTON */}
            <button
              type="button"
              onClick={handleSimulateVinScan}
              className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold p-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>{scanningVin ? 'Scanning VIN / Vehicle Papers...' : 'Scan VIN or Vehicle Papers (Auto-Fill)'}</span>
            </button>

            <form onSubmit={handleSaveVehicle} className="space-y-4">

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">MACHINE TYPE</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Car / SUV', 'Truck', 'Generator', 'Heavy Plant'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVehicleType(type)}
                      className={`p-2 rounded-lg border font-semibold text-center transition-colors ${
                        vehicleType === type ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">MAKE</label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">MODEL</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">YEAR</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">ENGINE</label>
                  <input
                    type="text"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">FUEL</label>
                  <input
                    type="text"
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">NICKNAME (OPTIONAL)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Site Office Hilux"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3 rounded-xl text-sm transition-all uppercase shadow-lg mt-2"
              >
                SAVE TO GARAGE
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
