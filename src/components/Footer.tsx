import React from 'react';
import { GROUND_INFO } from '../data/initialData';
import { Phone, MapPin, Clock, ShieldCheck, Heart, Wallet } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'booking' | 'stats' | 'location' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-neutral-950 font-black flex items-center justify-center text-sm">
                TF
              </div>
              <span className="font-extrabold text-base text-white">Tami Futsal Ground</span>
            </div>
            <p className="text-xs leading-relaxed text-neutral-400">
              Gahkuch Khari's premier artificial turf arena with 800-lux LED floodlights, online reservations, automated match push notifications, and team rankings.
            </p>
            <div className="text-[11px] text-emerald-400 font-mono">
              Open 24 Hours • Morning, Day & Night Shifts
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('booking')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Book Slot (Rs. 500 Advance)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('stats')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Team Rankings & Leaderboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('location')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Location & Arena Amenities
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Ground Admin & Verification Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Details */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Payment Gateway (Rs. 500 Adv.)
            </h4>
            <div className="space-y-1.5 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Account Title:</span>
                <span className="font-bold text-white">{GROUND_INFO.paymentAccountName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Mobile Account:</span>
                <span className="font-mono font-bold text-emerald-400">{GROUND_INFO.paymentAccountNumber}</span>
              </div>
              <div className="pt-1 flex items-center gap-1.5 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 font-bold">
                  Easypaisa
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                  JazzCash
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                  Banks
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Ground Location & Contact */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Ground Inquiries</h4>
            <div className="space-y-1.5 text-xs text-neutral-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{GROUND_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Manager: {GROUND_INFO.managerName} ({GROUND_INFO.phone})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© 2026 Tami Futsal Ground, Gahkuch Khari. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>FIFA-Certified Turf Grass</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
