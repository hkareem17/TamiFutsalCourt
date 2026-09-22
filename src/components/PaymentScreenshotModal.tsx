import React from 'react';
import { X, CheckCircle2, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { Booking } from '../types';

interface PaymentScreenshotModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (bookingId: string) => void;
}

export const PaymentScreenshotModal: React.FC<PaymentScreenshotModalProps> = ({
  booking,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Payment Slip & Advance Verification
            </h3>
            <p className="text-xs text-neutral-400">
              Booking Ref: <span className="font-mono text-emerald-400">{booking.id}</span> • {booking.teamName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Bar */}
        <div className="px-4 py-3 bg-neutral-950/50 border-b border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Advance Paid</span>
            <span className="font-bold text-emerald-400">Rs. {booking.advanceAmount || 500}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Total / Remaining</span>
            <span className="font-medium text-neutral-300">
              Rs. {booking.totalAmount} / <span className="text-amber-400">Rs. {booking.remainingAmount ?? (booking.totalAmount - (booking.advanceAmount || 500))}</span>
            </span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Gateway Method</span>
            <span className="font-medium text-neutral-200">{booking.paymentMethod}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">TRX / TID</span>
            <span className="font-mono text-neutral-300 truncate block">
              {booking.transactionId || 'Uploaded Image'}
            </span>
          </div>
        </div>

        {/* Image Display */}
        <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-neutral-950/90 min-h-[260px]">
          {booking.screenshotImage ? (
            <div className="relative group max-w-full">
              <img
                src={booking.screenshotImage}
                alt={`Payment receipt for ${booking.teamName}`}
                className="max-h-[50vh] max-w-full object-contain rounded-lg border border-neutral-800 shadow-md"
              />
              <a
                href={booking.screenshotImage}
                download={`receipt-${booking.id}.png`}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-2 right-2 px-2.5 py-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium border border-neutral-700 flex items-center gap-1.5 opacity-90 hover:opacity-100 shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Open</span>
              </a>
            </div>
          ) : (
            <div className="text-center py-10 text-neutral-500">
              <p className="text-sm">No image screenshot file attached for this booking.</p>
              <p className="text-xs text-neutral-600 mt-1">
                Transaction ID: <span className="font-mono text-neutral-400">{booking.transactionId || 'None'}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
          >
            Close
          </button>

          {onConfirm && booking.status === 'pending_verification' && (
            <button
              onClick={() => {
                onConfirm(booking.id);
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Approve Booking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
