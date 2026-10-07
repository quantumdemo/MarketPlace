'use client';

/*
 * SELLER DASHBOARD & B2B FLEET PROCUREMENT PORTAL
 * Pages 27, 28, 29, 34 & 35 of PDF Design Reference
 * Features:
 * - Parts Seller Store Dashboard (Pack queue with countdown timers, local part request quote bidding, listing builder with photo label scanner)
 * - Fleet Manager "The Yard" Machine Board (12 running, 2 service due, 2 down)
 * - Maintenance Spend Analytics (October ₦1,850,000)
 * - B2B RFQ Procurement Creation & Quote Comparison (Best value vs Genuine vs Aftermarket, 30-day credit terms, Export PO, Finance approval workflow)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchPartRequests, fetchFleetRFQs, PartRequest, FleetRFQ } from '@/lib/db';
import {
  Store,
  PackageCheck,
  Clock,
  Search,
  Plus,
  Truck,
  FileText,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Camera,
  Send,
  Building2,
  Check,
  AlertCircle
} from 'lucide-react';

export const SellerAndFleetView: React.FC = () => {
  const { currentRole, setRole, setActiveTab } = useAuth();

  // Seller State
  const [partRequests, setPartRequests] = useState<PartRequest[]>([]);
  const [quoteInput, setQuoteInput] = useState<{ [key: string]: string }>({});
  const [quotedRequests, setQuotedRequests] = useState<string[]>([]);

  // Listing builder state (Page 29)
  const [scannedPartNo, setScannedPartNo] = useState('23390-0L070');
  const [partTitle, setPartTitle] = useState('Fuel filter element');
  const [partPrice, setPartPrice] = useState('18500');
  const [partStock, setPartStock] = useState('12');
  const [qualityGrade, setQualityGrade] = useState<'Genuine' | 'OEM-equivalent' | 'Aftermarket'>('Genuine');
  const [listingPublished, setListingPublished] = useState(false);

  // Fleet RFQ State (Pages 34 & 35)
  const [rfqs, setRfqs] = useState<FleetRFQ[]>([]);

  useEffect(() => {
    async function loadSellerData() {
      const requests = await fetchPartRequests();
      const rfqsData = await fetchFleetRFQs();
      setPartRequests(requests);
      setRfqs(rfqsData);
    }
    loadSellerData();
  }, []);
  const [awardedRfqId, setAwardedRfqId] = useState<string | null>(null);

  const handleSendQuote = (reqId: string) => {
    setQuotedRequests(prev => [...prev, reqId]);
  };

  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    setListingPublished(true);
    setTimeout(() => setListingPublished(false), 3000);
  };

  const activeRfq = rfqs[0] || null;

  return (
    <div className="space-y-6 pb-20 text-zinc-100">

      {/* ROLE CONTROLLER HEADER */}
      <div className="border-b border-zinc-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-amber-500 tracking-tight flex items-center gap-2">
            {currentRole === 'fleet' ? <Truck className="w-6 h-6" /> : <Store className="w-6 h-6" />}
            {currentRole === 'fleet' ? 'MECHSOURCE FLEET & B2B PROCUREMENT' : 'MECHSOURCE SELLER STORE'}
          </h1>
          <p className="text-xs text-zinc-400">
            {currentRole === 'fleet' ? 'Manage yard machines, maintenance spend and RFQ supplier quotes.' : 'DIESEL PRO IKEJA ● Open · Pack queue & local part requests'}
          </p>
        </div>

        {/* ROLE TOGGLE FOR PREVIEW */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => { setRole('seller'); setActiveTab('seller_dash'); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentRole === 'seller' ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Seller Store View
          </button>
          <button
            onClick={() => { setRole('fleet'); setActiveTab('fleet_yard'); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentRole === 'fleet' ? 'bg-amber-500 text-zinc-950 shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Fleet Yard View
          </button>
        </div>
      </div>

      {/* SELLER SYSTEM MODULE */}
      {(currentRole === 'seller' || currentRole === 'driver') && (
        <div className="space-y-6">

          {/* SELLER STATS BANNER */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center">
              <span className="text-2xl font-black text-amber-400 font-mono block">3</span>
              <span className="text-xs text-zinc-400 font-bold">Orders to Pack</span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center">
              <span className="text-2xl font-black text-amber-400 font-mono block">{partRequests.length}</span>
              <span className="text-xs text-zinc-400 font-bold">Part Requests Near You</span>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-center">
              <span className="text-xl font-black text-emerald-400 font-mono block">₦485,000</span>
              <span className="text-xs text-zinc-400 font-bold">Payout Due Friday</span>
            </div>
          </div>

          {/* PACK QUEUE WITH COUNTDOWN TIMERS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-amber-400" />
                PACK QUEUE (RIDERS ASSIGNED AUTOMATICALLY)
              </h3>
              <span className="text-xs font-mono text-amber-400">Dispatch Speed Target &lt; 15 mins</span>
            </div>

            <div className="space-y-3">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                    08 MIN LEFT
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Denso fuel filter ×1</h4>
                    <p className="text-xs text-zinc-400">Fitting job · Rider arriving</p>
                  </div>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs">
                  Mark Packed
                </button>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                    22 MIN LEFT
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">Oil filter ×4</h4>
                    <p className="text-xs text-zinc-400">Fleet order · Pickup</p>
                  </div>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs">
                  Mark Packed
                </button>
              </div>
            </div>
          </div>

          {/* LOCAL PART REQUEST BIDDING RADAR */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400">BUYERS WITHIN 15 KM</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">LOCAL PART REQUESTS (BIDDING)</h3>
              </div>
              <span className="text-xs text-zinc-400">First good quote usually wins</span>
            </div>

            {partRequests.length === 0 ? (
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center text-xs text-zinc-400">
                No active buyer part requests within 15 km area right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {partRequests.map((req) => (
                  <div key={req.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between text-xs text-amber-400 font-mono">
                      <span>{req.distance_km} km away</span>
                      <span>{req.expires_in_mins} mins left</span>
                    </div>

                    <div className="flex gap-3">
                      <img src={req.photo_url} alt={req.part_name} className="w-16 h-16 rounded-lg object-cover border border-zinc-800" />
                      <div>
                        <h4 className="font-bold text-sm text-white">{req.part_name}</h4>
                        <p className="text-xs text-zinc-400">{req.vehicle_info}</p>
                      </div>
                    </div>

                    {quotedRequests.includes(req.id) ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2 rounded text-xs font-bold text-center">
                        ✓ Quote Sent to Buyer
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <input
                          type="number"
                          placeholder="Your price (₦)"
                          value={quoteInput[req.id] || ''}
                          onChange={(e) => setQuoteInput({ ...quoteInput, [req.id]: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-amber-400 font-mono font-bold focus:outline-none"
                        />
                        <button
                          onClick={() => handleSendQuote(req.id)}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>SEND QUOTE</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NEW LISTING BUILDER */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase">INVENTORY LISTING BUILDER</span>
              <h3 className="text-lg font-black text-white">CREATE NEW LISTING</h3>
            </div>

            <form onSubmit={handlePublishListing} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">SCANNED OEM PART NO.</label>
                  <input
                    type="text"
                    value={scannedPartNo}
                    onChange={(e) => setScannedPartNo(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-amber-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">PRICE (₦)</label>
                  <input
                    type="number"
                    value={partPrice}
                    onChange={(e) => setPartPrice(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">STOCK QUANTITY</label>
                  <input
                    type="number"
                    value={partStock}
                    onChange={(e) => setPartStock(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase shadow-lg transition-all"
              >
                PUBLISH LISTING TO MECHSOURCE MARKETPLACE
              </button>

              {listingPublished && (
                <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-3 rounded-xl text-xs font-bold text-center">
                  ✓ Listing Published Live! Fits Toyota Hilux 2016-2020, Fortuner & Hiace.
                </div>
              )}
            </form>
          </div>

        </div>
      )}

      {/* FLEET & B2B PROCUREMENT MODULE */}
      {(currentRole === 'fleet' || currentRole === 'admin') && (
        <div className="space-y-6">

          {/* THE YARD MACHINE STATUS BOARD */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400">MECHSOURCE FLEET ● DANGOTE LOGISTICS</span>
                <h2 className="text-xl font-black text-white">THE YARD MACHINE STATUS</h2>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/30">12 Running</span>
                <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/30">2 Service due</span>
                <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg border border-red-500/30">2 Down</span>
              </div>
            </div>

            {/* NEEDS ATTENTION BANNER */}
            <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4 space-y-2">
              <h4 className="font-bold text-sm text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                NEEDS IMMEDIATE ATTENTION
              </h4>
              <p className="text-xs text-zinc-300">VH-05 · Turbo failure · Down since yesterday · Parts quote pending</p>
              <button className="bg-red-500 hover:bg-red-400 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                Source Parts via RFQ
              </button>
            </div>
          </div>

          {/* B2B PROCUREMENT RFQ & QUOTE COMPARISON */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">RFQ-9021 · CLOSES IN 6 HRS</span>
                <h3 className="text-lg font-black text-white">OIL SERVICE × 4 PICKUPS</h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">Maintenance Spend Oct: ₦1,850,000</span>
            </div>

            {/* QUOTES RECEIVED LIST */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase">QUOTES RECEIVED</h4>

              {!activeRfq || !activeRfq.quotes || activeRfq.quotes.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center text-xs text-zinc-400">
                  No supplier quotes received for RFQs yet. Create a new B2B RFQ to invite supplier bids.
                </div>
              ) : (
                activeRfq.quotes.map((q) => (
                  <div
                    key={q.id}
                    className={`bg-zinc-950 border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      awardedRfqId === q.id ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-sm text-white">{q.seller_name}</span>
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
                          {q.tag}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        {q.quality_grade} · {q.delivery_timeframe} delivery · {q.payment_terms}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-amber-400 font-mono">₦{q.amount.toLocaleString()}</span>
                      {awardedRfqId === q.id ? (
                        <span className="bg-emerald-500 text-zinc-950 font-black px-3 py-1.5 rounded-lg text-xs">
                          AWARDED PO
                        </span>
                      ) : (
                        <button
                          onClick={() => setAwardedRfqId(q.id)}
                          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold px-3 py-1.5 rounded-lg text-xs"
                        >
                          AWARD PO
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
              <span>Status: Fleet Manager Requested &rarr; Awaiting Finance Sign-off</span>
              <button
                onClick={() => alert('Purchase Order PDF exported for ERP finance ingestion.')}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3 py-1.5 rounded-lg"
              >
                Export Purchase Order (PO)
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
