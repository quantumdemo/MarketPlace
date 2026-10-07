'use client';

/*
 * JOB SHEET CHECKOUT, ESCROW ORDERS & MECHSOURCE PROTECT
 * Pages 14, 15, 16, 17, 18 & 26 of PDF Design Reference
 * Features:
 * - Multi-seller job sheet boxes (Box 01 Diesel Pro Ikeja, Box 02 Ladipo Auto Hub)
 * - Mobile fitting option (parts + fitting combined in one visit)
 * - Delivery address selection & payment method picker (MechSource Protect wallet, card, bank transfer, USSD, POD)
 * - MechSource Protect escrow holding architecture
 * - Order tracking timeline ("Seller packing" -> "On the way" -> "Fitted")
 * - "Did it fit and run right?" confirmation screen releasing held escrow funds
 * - Wallet activity ledger with held vs available balances
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { OrderRecord } from '@/lib/db';
import {
  PackageCheck,
  ShieldCheck,
  Wallet,
  CreditCard,
  Building,
  PhoneCall,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wrench,
  Minus,
  Plus,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  Star
} from 'lucide-react';

export const OrdersAndEscrowView: React.FC = () => {
  const {
    orders,
    confirmFitAndReleaseEscrow,
    walletBalance,
    heldEscrowBalance,
    transactions,
    fundWallet,
    setActiveTab
  } = useAuth();

  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(orders[0] || null);
  const [showFitmentConfirmation, setShowFitmentConfirmation] = useState(false);
  const [rating, setRating] = useState(5);
  const [problemReported, setProblemReported] = useState(false);
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('50000');

  // Job Sheet quantities state (Page 14)
  const [box1Qty, setBox1Qty] = useState(1);
  const [box2Qty, setBox2Qty] = useState(2);

  const box1Price = 18500;
  const box2Price = 24000;
  const labourFee = 12000;
  const deliveryFee = 2500;

  const subtotal = (box1Price * box1Qty) + (box2Price * box2Qty);
  const totalAmount = subtotal + labourFee + deliveryFee;

  const handleConfirmFit = (orderId: string) => {
    confirmFitAndReleaseEscrow(orderId);
    setShowFitmentConfirmation(false);
  };

  const handleFundWallet = (e: React.FormEvent) => {
    e.preventDefault();
    fundWallet(Number(fundAmount), 'Funded by Instant Bank Transfer');
    setFundModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 text-zinc-100">

      {/* HEADER BAR */}
      <div className="border-b border-zinc-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-amber-500 tracking-tight flex items-center gap-2">
            <PackageCheck className="w-6 h-6" />
            ORDERS & MECHSOURCE PROTECT
          </h1>
          <p className="text-xs text-zinc-400">Track active orders, job sheet fitting, held escrow funds and wallet balance.</p>
        </div>

        {/* WALLET SUMMARY BADGE */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-xs">
          <Wallet className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-zinc-400 block">Available Wallet</span>
            <span className="font-extrabold text-amber-400 text-sm">₦{walletBalance.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setFundModalOpen(true)}
            className="ml-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-2.5 py-1 rounded text-[11px] transition-colors"
          >
            + Fund
          </button>
        </div>
      </div>

      {/* JOB SHEET BOX PREVIEW & CHECKOUT (PAGE 14 & 15) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-amber-400">ACTIVE JOB SHEET CHECKOUT</span>
            <h2 className="text-lg font-black text-white">JOB SHEET FOR HILUX 2018</h2>
          </div>
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
            2 Sellers · Mobile Fitting
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* BOX 01 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-mono text-amber-400">
              <span>BOX 01</span>
              <span>Diesel Pro Ikeja · Today · 1 hr</span>
            </div>
            <h3 className="font-bold text-sm text-white">Denso fuel filter</h3>
            <p className="text-xs font-mono text-zinc-400">REPL. 23390-0L070 · ₦{box1Price.toLocaleString()}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-400">Quantity</span>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-2 py-1 rounded-lg">
                <button onClick={() => setBox1Qty(Math.max(1, box1Qty - 1))} className="text-amber-400 hover:text-white font-bold"><Minus className="w-3.5 h-3.5" /></button>
                <span className="text-xs font-bold text-white px-2">{box1Qty}</span>
                <button onClick={() => setBox1Qty(box1Qty + 1)} className="text-amber-400 hover:text-white font-bold"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>

          {/* BOX 02 */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-mono text-amber-400">
              <span>BOX 02</span>
              <span>Ladipo Auto Hub · Store 3 · Today · 2 hrs</span>
            </div>
            <h3 className="font-bold text-sm text-white">Bosch glow plug</h3>
            <p className="text-xs font-mono text-zinc-400">REPL. 19850-30010 · ₦{box2Price.toLocaleString()}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-400">Quantity</span>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-2 py-1 rounded-lg">
                <button onClick={() => setBox2Qty(Math.max(1, box2Qty - 1))} className="text-amber-400 hover:text-white font-bold"><Minus className="w-3.5 h-3.5" /></button>
                <span className="text-xs font-bold text-white px-2">{box2Qty}</span>
                <button onClick={() => setBox2Qty(box2Qty + 1)} className="text-amber-400 hover:text-white font-bold"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>

        </div>

        {/* PRICING BREAKDOWN & MECHSOURCE PROTECT BANNER (PAGE 15) */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>MECHSOURCE PROTECT: You pay &rarr; We hold it &rarr; Released to seller &amp; mechanic when part fits &amp; runs right.</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Mobile fitting · both parts, one visit</span>
              <span className="font-mono text-zinc-200">₦{labourFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Delivery rider logistics fee</span>
              <span className="font-mono text-zinc-200">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal ({box1Qty + box2Qty} parts from 2 sellers)</span>
              <span className="font-mono text-zinc-200">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-black text-sm text-amber-400 pt-2 border-t border-zinc-800">
              <span>TOTAL ORDER PAYABLE</span>
              <span className="text-base font-mono">₦{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE ORDERS TRACKING LIST (PAGE 17 & 18) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          ACTIVE ORDERS & ESCROW STATUS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              onClick={() => setSelectedOrder(ord)}
              className={`bg-zinc-950 border rounded-2xl p-4 space-y-3 transition-all cursor-pointer ${
                selectedOrder?.id === ord.id ? 'border-amber-500 ring-1 ring-amber-500/30' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-400">ORDER #{ord.id}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  ord.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {ord.status}
                </span>
              </div>

              <div className="space-y-1">
                {ord.items.map(item => (
                  <p key={item.id} className="text-xs font-semibold text-zinc-200">
                    • {item.part_name} ({item.quantity}x)
                  </p>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block">HELD IN PROTECT</span>
                  <span className="font-mono font-bold text-white">₦{ord.total_amount.toLocaleString()}</span>
                </div>

                {ord.escrow_status === 'HELD' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrder(ord);
                      setShowFitmentConfirmation(true);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
                  >
                    Confirm Fit & Release
                  </button>
                ) : (
                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Funds Released
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONFIRM FITMENT & RELEASE ESCROW SCREEN (PAGE 18) */}
      {showFitmentConfirmation && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5">

            <div className="text-center space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono text-amber-400 uppercase">ORDER #{selectedOrder.id} · FITTED</span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">DID IT FIT AND RUN RIGHT?</h3>
              <p className="text-xs text-zinc-400">Confirming releases the held payment of ₦{selectedOrder.total_amount.toLocaleString()} to the seller and mechanic.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Part Quality:</span>
                <span className="font-bold text-white">Denso Genuine</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Seller Store:</span>
                <span className="font-bold text-white">Diesel Pro Ikeja</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Fitting Mechanic:</span>
                <span className="font-bold text-amber-400">{selectedOrder.mechanic_name || 'Sampson Okafor'}</span>
              </div>
            </div>

            {/* RATING STARS */}
            <div className="text-center space-y-2">
              <label className="text-xs font-bold text-zinc-400 block">RATE THE SERVICE & PART FITMENT</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-amber-400 text-2xl"
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="space-y-2">
              <button
                onClick={() => handleConfirmFit(selectedOrder.id)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase transition-all shadow-lg"
              >
                YES, ALL GOOD · CONFIRM & RELEASE PAYMENT
              </button>

              <button
                onClick={() => setProblemReported(true)}
                className="w-full bg-zinc-900 hover:bg-red-500/10 border border-zinc-800 text-red-400 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Report a Problem / Dispute Order
              </button>
            </div>

            {problemReported && (
              <div className="bg-red-500/10 border border-red-500/40 text-red-400 p-3 rounded-xl text-xs space-y-1">
                <strong>Dispute Case Opened:</strong> Our MechSource Protect agent will review part photos and mechanic report within 30 minutes. Held funds remain locked.
              </div>
            )}

            <button
              onClick={() => setShowFitmentConfirmation(false)}
              className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 pt-2"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* FUND WALLET MODAL */}
      {fundModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 space-y-4">

            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-black text-lg text-white">FUND MECHSOURCE WALLET</h3>
              <button onClick={() => setFundModalOpen(false)} className="text-zinc-400 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleFundWallet} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">AMOUNT TO FUND (₦)</label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="text-[11px] text-zinc-400 space-y-1">
                <p>• Pay via Bank Transfer, Debit Card, or USSD</p>
                <p>• Funds are immediately credited to your MechSource balance</p>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3 rounded-xl text-xs uppercase shadow-lg transition-all"
              >
                PROCEED TO PAY ₦{Number(fundAmount).toLocaleString()}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
