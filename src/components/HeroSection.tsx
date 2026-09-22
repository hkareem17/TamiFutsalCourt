import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { GROUND_INFO, TIMING_TIERS } from '../data/initialData';
import { WeatherFieldCondition } from './WeatherFieldCondition';
import {
  Calendar,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle,
  Copy,
  Clock,
  ArrowRight,
  Trophy,
  MapPin,
  Building2,
  Wallet,
  CloudSun,
} from 'lucide-react';

interface HeroSectionProps {
  onBookClick: () => void;
  onStatsClick: () => void;
  onLocationClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookClick,
  onStatsClick,
  onLocationClick,
}) => {
  const { bookings, selectedDate, paymentAccounts } = useBooking();
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Filter active payment accounts configured by admin
  const activeAccounts = paymentAccounts.filter((a) => a.isActive);
  const defaultAccount = activeAccounts.find((a) => a.isDefault) || activeAccounts[0];
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    defaultAccount?.id || 'ep-1'
  );

  const currentAccount =
    activeAccounts.find((a) => a.id === selectedAccountId) || defaultAccount || activeAccounts[0];

  // Available slots calculation
  const bookedToday = bookings.filter((b) => b.date === selectedDate && b.status !== 'cancelled').length;
  const remainingToday = Math.max(0, 24 - bookedToday);

  const copyAccountNumber = (accNumber: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800/80 pt-6 pb-12 sm:pt-10 sm:pb-16">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/15 via-emerald-950/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE ARENA OPEN • 24/7 SLOTS</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-300 font-normal">
                  {remainingToday} slots open for {selectedDate}
                </span>
              </div>

              <a
                href="#field-weather-forecast"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 text-neutral-300 text-xs font-medium transition-colors"
              >
                <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                <span>Field Playability: Optimal</span>
              </a>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Play on Premium Turf at{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                  Tami Futsal Ground
                </span>
              </h1>
              <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
                Premier futsal destination featuring 50mm FIFA-grade monofilament turf,
                high-intensity floodlights, match balls, and instant reservations with Rs. 500 advance via bank accounts & e-wallets.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                id="hero-book-now-btn"
                onClick={onBookClick}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Reserve Match Slot</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onStatsClick}
                className="px-5 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Leaderboard & Stats</span>
              </button>

              <button
                onClick={onLocationClick}
                className="px-4 py-3.5 rounded-xl text-neutral-400 hover:text-white text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Turf Directions</span>
              </button>
            </div>

            {/* Timings and Charges Showcase Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-neutral-800/80">
              {TIMING_TIERS.map((tier) => (
                <div
                  key={tier.category}
                  className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800"
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.badgeClass}`}>
                    {tier.name}
                  </span>
                  <p className="font-mono font-bold text-white text-sm mt-1.5">
                    Rs. {tier.rate.toLocaleString()}
                    <span className="text-[10px] text-neutral-400 font-normal">/hr</span>
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{tier.timeRange}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Card & Dynamic Admin Account Info Highlight */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-900/95 border border-neutral-800 p-5 sm:p-6 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs uppercase tracking-wider font-bold text-neutral-300">
                    Official Payment Accounts
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  Rs. 500 Advance
                </span>
              </div>

              {/* Dynamic Account Switcher Tabs */}
              {activeAccounts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                    Select Official Payment Method:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => setSelectedAccountId(acc.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          (currentAccount?.id === acc.id)
                            ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
                            : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {acc.type === 'bank' ? (
                          <Building2 className="w-3 h-3" />
                        ) : (
                          <Wallet className="w-3 h-3" />
                        )}
                        <span>{acc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Account Details Box */}
              {currentAccount && (
                <div className="rounded-2xl bg-neutral-950 p-4 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">
                        Account Title
                      </span>
                      <p className="text-base font-extrabold text-white tracking-wide">
                        {currentAccount.accountTitle}
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {currentAccount.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">
                        {currentAccount.type === 'bank' ? 'Account / IBAN Number' : 'Mobile / Wallet Number'}
                      </span>
                      <p className="text-lg sm:text-xl font-mono font-extrabold text-emerald-400 tracking-wider truncate">
                        {currentAccount.accountNumber}
                      </p>
                    </div>

                    <button
                      onClick={() => copyAccountNumber(currentAccount.accountNumber)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                      title="Copy account number"
                    >
                      {copiedAccount ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {currentAccount.bankBranch && (
                    <div className="text-[11px] text-neutral-400 pt-1">
                      <strong className="text-neutral-300">Branch:</strong> {currentAccount.bankBranch}
                    </div>
                  )}

                  {currentAccount.instructions && (
                    <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-900 leading-relaxed">
                      {currentAccount.instructions}
                    </p>
                  )}
                </div>
              )}

              {/* 3 Step Process */}
              <div className="space-y-2 text-xs text-neutral-300 bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    1
                  </span>
                  <span>Select any free match hour from the schedule.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    2
                  </span>
                  <span>Transfer Rs. 500 advance to the verified account above.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    3
                  </span>
                  <span>Upload screenshot of transaction for immediate confirmation.</span>
                </div>
              </div>

              <button
                onClick={onBookClick}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-extrabold text-sm text-center shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                Browse Timings & Reserve Slot
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Field Weather & Turf Conditions Component */}
        <div className="pt-2">
          <WeatherFieldCondition onBookClick={onBookClick} />
        </div>
      </div>
    </div>
  );
};

