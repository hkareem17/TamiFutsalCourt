import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { STANDARD_HOURLY_SLOTS, getSlotPricing } from '../data/initialData';
import {
  Calendar as CalendarIcon,
  Clock,
  Sun,
  Moon,
  Zap,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';

export const BookingCalendar: React.FC = () => {
  const {
    groundDetails,
    selectedDate,
    setSelectedDate,
    isSlotBooked,
    isSlotBlocked,
    openBookingModal,
    setActiveVoucher,
    isAdmin,
    toggleBlockSlot,
    getHolidayOrOffTiming,
  } = useBooking();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  const activeHoliday = getHolidayOrOffTiming(selectedDate);

  // Quick Date Chips (7 upcoming days from selected date)
  const getUpcomingDays = () => {
    const baseDate = new Date('2026-09-22');
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      days.push({ iso, dayName, dayNumber, monthName });
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();

  // Navigate date
  const changeDateBy = (offset: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  return (
    <section id="booking-section" className="py-8 sm:py-12 bg-neutral-950 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span>Real-Time Slot Availability & Booking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Select Your Match Timing
            </h2>
            <p className="text-sm text-neutral-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{groundDetails.address}</span>
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800 self-start md:self-auto">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Daily Slots
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'weekly'
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Weekly Overview
            </button>
          </div>
        </div>

        {/* Single Arena & Official Rates Showcase Card */}
        <div className="relative rounded-3xl p-6 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-emerald-950/30 border border-neutral-800 shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-xl text-white">Tami Futsal Ground</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Open 24/7
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Rs. 500 Advance Required
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Premium 50mm all-weather artificial turf, pro 800-lux stadium floodlights, free match balls, colored bibs, clean locker rooms, and spectator pavilion.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 pt-1">
                <span>Account: <strong className="text-white">Irfan Hyder (03401082265)</strong></span>
                <span>•</span>
                <span>Behind Faysal Bank, Near Soneri Bank</span>
              </div>
            </div>

            {/* Official Rates Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
              <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
                <div className="text-[11px] text-neutral-400 font-medium flex items-center justify-center gap-1">
                  <Sun className="w-3 h-3 text-amber-400" /> Morning
                </div>
                <div className="text-[10px] text-neutral-500">5 AM - 11 AM</div>
                <div className="text-base font-extrabold text-emerald-400 font-mono mt-1">Rs. 2,000</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
                <div className="text-[11px] text-neutral-400 font-medium flex items-center justify-center gap-1">
                  <Sun className="w-3 h-3 text-yellow-400" /> Day
                </div>
                <div className="text-[10px] text-neutral-500">12 PM - 4 PM</div>
                <div className="text-base font-extrabold text-teal-400 font-mono mt-1">Rs. 2,500</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
                <div className="text-[11px] text-neutral-400 font-medium flex items-center justify-center gap-1">
                  <Moon className="w-3 h-3 text-emerald-400" /> Night
                </div>
                <div className="text-[10px] text-neutral-500">4 PM - 5 AM</div>
                <div className="text-base font-extrabold text-amber-400 font-mono mt-1">Rs. 3,000</div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center ring-1 ring-emerald-500/30">
                <div className="text-[11px] text-emerald-300 font-bold flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Prime Hours
                </div>
                <div className="text-[10px] text-neutral-400">8 PM - 1 AM</div>
                <div className="text-base font-extrabold text-white font-mono mt-1">Rs. 3,500</div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector Navigation */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDateBy(-1)}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
                />
              </div>

              <button
                onClick={() => changeDateBy(1)}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="text-sm font-semibold text-neutral-300 ml-2">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Quick date chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {upcomingDays.map((day) => {
                const isCurrent = day.iso === selectedDate;
                return (
                  <button
                    key={day.iso}
                    onClick={() => setSelectedDate(day.iso)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-500 text-neutral-950 shadow-md font-bold'
                        : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <span>{day.dayName}</span>{' '}
                    <span className="opacity-80 font-mono">({day.dayNumber} {day.monthName})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800 text-xs text-neutral-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Available Slot</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Pending Verification (Screenshot Uploaded)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Confirmed & Locked</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                <span>Turf Maintenance</span>
              </span>
            </div>

            <div className="text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant slot reservation with Rs. 500 advance</span>
            </div>
          </div>
        </div>

        {/* View 1: Daily Slots Timeline */}
        {viewMode === 'daily' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>All Hourly Slots for Tami Futsal Ground</span>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-normal">
                  {selectedDate}
                </span>
              </h3>

              {isAdmin && (
                <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin Mode Active: Toggle slot maintenance or click to inspect</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {STANDARD_HOURLY_SLOTS.map((slot) => {
                const booked = isSlotBooked(selectedDate, slot.start);
                const blockedReason = isSlotBlocked(selectedDate, slot.start);
                const { price, isPrime, categoryLabel } = getSlotPricing(slot.start);

                let cardState: 'available' | 'booked' | 'pending' | 'blocked' = 'available';
                if (blockedReason) cardState = 'blocked';
                else if (booked?.status === 'confirmed' || booked?.status === 'completed') cardState = 'booked';
                else if (booked?.status === 'pending_verification') cardState = 'pending';

                return (
                  <div
                    key={slot.start}
                    className={`relative rounded-2xl p-4 border transition-all flex flex-col justify-between min-h-[145px] ${
                      cardState === 'available'
                        ? 'bg-neutral-900/80 border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-900'
                        : cardState === 'pending'
                        ? 'bg-amber-950/20 border-amber-800/60'
                        : cardState === 'booked'
                        ? 'bg-rose-950/20 border-rose-900/40'
                        : 'bg-neutral-900/30 border-neutral-800/40 opacity-75'
                    }`}
                  >
                    {/* Top bar: Time & Tier Badge */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-extrabold text-white text-base font-mono">
                          {slot.start} - {slot.end}
                        </span>
                        <div>
                          {isPrime ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              <Zap className="w-3 h-3 text-amber-400" /> Prime
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                              {categoryLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-baseline justify-between text-xs mb-3">
                        <span className="text-neutral-400">Total Rate:</span>
                        <span className="font-extrabold text-emerald-400 font-mono text-sm">
                          Rs. {price.toLocaleString()} PKR
                        </span>
                      </div>
                    </div>

                    {/* Bottom Status / Action */}
                    <div className="pt-2 border-t border-neutral-800/80">
                      {cardState === 'available' && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Open
                          </span>
                          <button
                            onClick={() => openBookingModal(selectedDate, slot.start)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                          >
                            Book Slot
                          </button>
                        </div>
                      )}

                      {cardState === 'pending' && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-amber-400 font-semibold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Advance Submitted
                            </span>
                            {booked && (
                              <button
                                onClick={() => setActiveVoucher(booked)}
                                className="text-[11px] text-amber-300 underline hover:text-white cursor-pointer"
                              >
                                View Pass
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-300 truncate">
                            {booked?.teamName || booked?.customerName}
                          </p>
                        </div>
                      )}

                      {cardState === 'booked' && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-rose-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                            </span>
                            {booked && (
                              <button
                                onClick={() => setActiveVoucher(booked)}
                                className="text-[11px] text-neutral-400 underline hover:text-white cursor-pointer"
                              >
                                Match Pass
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-200 font-medium truncate">
                            {booked?.teamName || booked?.customerName}
                            {booked?.needsOpponent && (
                              <span className="text-amber-400 ml-1 font-normal">(Needs Opponent)</span>
                            )}
                          </p>
                        </div>
                      )}

                      {cardState === 'blocked' && (
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span className="flex items-center gap-1 truncate max-w-[130px]">
                            <Lock className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                            {blockedReason || 'Maintenance'}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => toggleBlockSlot(selectedDate, slot.start)}
                              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                            >
                              Unblock
                            </button>
                          )}
                        </div>
                      )}

                      {/* Admin Quick Action for open slot */}
                      {isAdmin && cardState === 'available' && (
                        <div className="mt-2 pt-2 border-t border-neutral-800 flex justify-end">
                          <button
                            onClick={() => toggleBlockSlot(selectedDate, slot.start, 'Turf Sprinkler Maintenance')}
                            className="text-[10px] text-neutral-400 hover:text-amber-400 cursor-pointer"
                          >
                            Block for Maintenance
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* View 2: Weekly Overview Matrix */}
        {viewMode === 'weekly' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Weekly Timetable Matrix (7-Day Overview)
              </h3>
              <span className="text-xs text-neutral-400">
                Click any open slot to reserve with Rs. 500 advance
              </span>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900/60 p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400">
                    <th className="py-2.5 px-3 font-semibold">Time Slot</th>
                    {upcomingDays.map((day) => (
                      <th key={day.iso} className="py-2.5 px-3 font-semibold text-center">
                        <div>{day.dayName}</div>
                        <div className="text-[10px] text-neutral-500">{day.dayNumber} {day.monthName}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {STANDARD_HOURLY_SLOTS.slice(5).map((slot) => {
                    const pricing = getSlotPricing(slot.start);
                    return (
                      <tr key={slot.start} className="hover:bg-neutral-800/30">
                        <td className="py-2 px-3 font-mono font-bold text-white whitespace-nowrap">
                          {slot.start} - {slot.end}
                          {pricing.isPrime && (
                            <span className="ml-1.5 text-[10px] text-amber-400" title="Prime Hour">⚡</span>
                          )}
                        </td>

                        {upcomingDays.map((day) => {
                          const booked = isSlotBooked(day.iso, slot.start);
                          const blocked = isSlotBlocked(day.iso, slot.start);

                          if (blocked) {
                            return (
                              <td key={day.iso} className="py-2 px-2 text-center">
                                <span className="inline-block px-2 py-1 rounded bg-neutral-800/80 text-neutral-500 text-[10px]">
                                  Maintenance
                                </span>
                              </td>
                            );
                          }

                          if (booked?.status === 'confirmed' || booked?.status === 'completed') {
                            return (
                              <td key={day.iso} className="py-2 px-2 text-center">
                                <span className="inline-block px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold max-w-[100px] truncate">
                                  {booked.teamName || 'Booked'}
                                </span>
                              </td>
                            );
                          }

                          if (booked?.status === 'pending_verification') {
                            return (
                              <td key={day.iso} className="py-2 px-2 text-center">
                                <span className="inline-block px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                                  Pending Adv.
                                </span>
                              </td>
                            );
                          }

                          return (
                            <td key={day.iso} className="py-2 px-2 text-center">
                              <button
                                onClick={() => {
                                  setSelectedDate(day.iso);
                                  openBookingModal(day.iso, slot.start);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 border border-emerald-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Rs. {pricing.price}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
