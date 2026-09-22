import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { GROUND_INFO } from '../data/initialData';
import {
  X,
  Share2,
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  ImageIcon,
  Receipt,
  ExternalLink,
} from 'lucide-react';

export const BookingVoucherModal: React.FC = () => {
  const { activeVoucher, setActiveVoucher } = useBooking();
  const [showScreenshot, setShowScreenshot] = useState<boolean>(false);

  if (!activeVoucher) return null;

  const handleShareWhatsApp = () => {
    const text = `⚽ *MATCH CONFIRMATION PASS - Tami Futsal Ground*\n\n` +
      `📌 *Booking Ref:* ${activeVoucher.id}\n` +
      `🏟️ *Ground:* Tami Futsal Ground\n` +
      `📍 *Location:* ${GROUND_INFO.address}\n` +
      `📅 *Date:* ${activeVoucher.date}\n` +
      `⏰ *Timing:* ${activeVoucher.startTime} - ${activeVoucher.endTime} (${activeVoucher.durationHours} hr)\n` +
      `👥 *Team:* ${activeVoucher.teamName}\n` +
      `💵 *Advance Paid:* Rs. ${(activeVoucher.advanceAmount ?? 500).toLocaleString()} PKR\n` +
      `💰 *Remaining Due at Ground:* Rs. ${(activeVoucher.remainingAmount ?? 0).toLocaleString()} PKR\n` +
      `💳 *Paid Via:* ${activeVoucher.paymentMethod} (TID: ${activeVoucher.transactionId || 'Verified'})\n` +
      `📞 *Management:* ${GROUND_INFO.managerName} (${GROUND_INFO.phone})\n\n` +
      `_Please arrive 15 minutes before kickoff. Astro turf shoes only!_`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const isConfirmed = activeVoucher.status === 'confirmed' || activeVoucher.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden my-6">
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-950 border-b border-neutral-800 p-6 relative">
          <button
            onClick={() => setActiveVoucher(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-950/60 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Official Digital Match Pass & Receipt
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {GROUND_INFO.name}
          </h2>
          <p className="text-xs text-neutral-300 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{GROUND_INFO.address}</span>
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Booking Reference
              </span>
              <p className="text-lg font-mono font-black text-emerald-400 tracking-wider">
                {activeVoucher.id}
              </p>
            </div>

            <div>
              {isConfirmed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" /> Advance Verification
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 space-y-4 bg-neutral-900">
          {/* Ground & Time Highlight */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                Venue
              </span>
              <p className="text-sm font-bold text-white mt-0.5">Tami Futsal Ground</p>
              <p className="text-[11px] text-neutral-400">Gahkuch Khari</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                Date & Timing
              </span>
              <p className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                {activeVoucher.date}
              </p>
              <p className="text-xs text-neutral-300 font-mono">
                {activeVoucher.startTime} - {activeVoucher.endTime} ({activeVoucher.durationHours} hr)
              </p>
            </div>
          </div>

          {/* Team and Captain */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-neutral-800 pb-3">
            <div>
              <span className="text-neutral-500">Team / Club:</span>
              <p className="font-extrabold text-white text-sm mt-0.5">{activeVoucher.teamName}</p>
              {activeVoucher.opponentTeam && (
                <p className="text-[11px] text-neutral-400">vs {activeVoucher.opponentTeam}</p>
              )}
            </div>
            <div>
              <span className="text-neutral-500">Booked By:</span>
              <p className="font-bold text-white text-sm mt-0.5">{activeVoucher.customerName}</p>
              <p className="text-[11px] text-neutral-400 font-mono">{activeVoucher.customerPhone}</p>
            </div>
          </div>

          {/* Financial Breakdown (Advance & Balance) */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-neutral-400">
              <span>Total Match Fee:</span>
              <span className="font-bold font-mono text-white text-sm">
                Rs. {activeVoucher.totalAmount.toLocaleString()} PKR
              </span>
            </div>
            <div className="flex justify-between items-center text-emerald-400 font-semibold">
              <span>Advance Paid / Submitted:</span>
              <span className="font-mono text-sm">
                Rs. {(activeVoucher.advanceAmount ?? 500).toLocaleString()} PKR
              </span>
            </div>
            <div className="flex justify-between items-center text-amber-300 pt-1.5 border-t border-neutral-800">
              <span>Remaining Balance (Due on Ground):</span>
              <span className="font-bold font-mono text-sm">
                Rs. {(activeVoucher.remainingAmount ?? 0).toLocaleString()} PKR
              </span>
            </div>
          </div>

          {/* Payment Method & Transaction ID & Screenshot */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Payment Gateway:</span>
              <span className="font-bold uppercase text-white">{activeVoucher.paymentMethod}</span>
            </div>
            {activeVoucher.transactionId && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Transaction ID (TID):</span>
                <span className="font-mono text-emerald-400 font-bold">{activeVoucher.transactionId}</span>
              </div>
            )}
            {activeVoucher.screenshotImage && (
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payment Screenshot Attached</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowScreenshot(!showScreenshot)}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  {showScreenshot ? 'Hide Screenshot' : 'View Screenshot'}
                </button>
              </div>
            )}
          </div>

          {/* Screenshot Preview Dropdown */}
          {showScreenshot && activeVoucher.screenshotImage && (
            <div className="p-2 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
              <div className="text-[11px] text-neutral-400 px-1 font-medium">Uploaded Receipt:</div>
              <img
                src={activeVoucher.screenshotImage}
                alt="Payment Receipt"
                className="w-full max-h-56 object-contain rounded-xl bg-neutral-900 border border-neutral-800"
              />
            </div>
          )}

          {/* Ground Guidelines */}
          <div className="rounded-xl bg-neutral-950/60 p-3 text-[11px] text-neutral-400 space-y-1 border border-neutral-800/60">
            <p className="font-bold text-neutral-300">Ground Instructions:</p>
            <p>• Only Astro-turf studs or flat rubber trainers allowed. Strictly NO metal studs.</p>
            <p>• Low-bounce match balls and numbered scrimmage bibs are provided free at the dugout.</p>
            <p>• Pay the remaining balance of Rs. {activeVoucher.remainingAmount ?? 0} to manager Irfan Hyder upon arrival.</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Match Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
