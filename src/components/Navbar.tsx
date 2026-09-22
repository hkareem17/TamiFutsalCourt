import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';
import { GROUND_INFO } from '../data/initialData';
import {
  Shield,
  Calendar,
  Trophy,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  Menu,
  X,
  Lock,
  Unlock,
  BellRing,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'booking' | 'stats' | 'location' | 'admin';
  setActiveTab: (tab: 'booking' | 'stats' | 'location' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { isAdmin, setIsAdmin, openBookingModal, bookings } = useBooking();
  const { unreadCount, setIsNotificationOpen } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Count pending verifications
  const pendingCount = bookings.filter((b) => b.status === 'pending_verification').length;

  const handleAdminClick = () => {
    if (isAdmin) {
      setActiveTab('admin');
    } else {
      setShowAdminPinModal(true);
      setEnteredPin('');
      setPinError(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === '1234' || enteredPin === '0340') {
      setIsAdmin(true);
      setShowAdminPinModal(false);
      setActiveTab('admin');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
        {/* Top announcement bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-950 border-b border-emerald-900/40 px-4 py-1.5 text-xs text-neutral-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-400">Tami Futsal Ground:</span>
              <span className="hidden sm:inline">
                Morning 2000 | Day 2500 | Night 3000 | Prime 3500 PKR (500 Advance Required)
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="hidden md:flex items-center gap-1 text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open 24/7 Floodlights</span>
              </span>
              <a
                href={`tel:${GROUND_INFO.phone}`}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{GROUND_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Brand Logo */}
            <div
              onClick={() => setActiveTab('booking')}
              className="flex items-center gap-3 cursor-pointer group"
              id="brand-logo"
            >
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-neutral-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-xl tracking-tighter text-neutral-950">TF</span>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-300 text-[10px] font-bold text-neutral-950 border-2 border-neutral-950">
                  G
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    Tami Futsal Ground
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Arena
                  </span>
                </div>
                <p className="text-xs text-neutral-400 hidden sm:block">
                  Gahkuch City near Soneri bank • Manager: Irfan Hyder
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                id="nav-booking"
                onClick={() => setActiveTab('booking')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'booking'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Book Slot</span>
              </button>

              <button
                id="nav-stats"
                onClick={() => setActiveTab('stats')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'stats'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Team Stats</span>
              </button>

              <button
                id="nav-location"
                onClick={() => setActiveTab('location')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'location'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Location & Ground</span>
              </button>

              <button
                id="nav-admin"
                onClick={handleAdminClick}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 relative cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Portal</span>
                {pendingCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-neutral-950 font-bold text-xs">
                    {pendingCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Center Trigger */}
              <button
                onClick={() => setIsNotificationOpen(true)}
                className="relative p-2 sm:p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Match Notifications & Alerts"
                aria-label="Match Notifications"
              >
                <BellRing className="w-5 h-5 text-emerald-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 font-black text-[10px] flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isAdmin && (
                <button
                  onClick={() => setIsAdmin(false)}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 hover:bg-amber-900/60 transition-colors cursor-pointer"
                  title="Click to exit Admin view"
                >
                  <Unlock className="w-3 h-3" />
                  <span>Admin Active</span>
                </button>
              )}

              <button
                id="btn-quick-book"
                onClick={() => openBookingModal()}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book Slot</span>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-3 pb-5 space-y-2">
            <button
              onClick={() => {
                setActiveTab('booking');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'booking' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-neutral-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Book Slot & Schedule</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('stats');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'stats' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-neutral-300'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Team Statistics & Leaderboard</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('location');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'location' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-neutral-300'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Ground Location & Amenities</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleAdminClick();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                activeTab === 'admin' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Dashboard</span>
              </div>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-bold text-xs">
                  {pendingCount} Pending
                </span>
              )}
            </button>

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookingModal();
                }}
                className="w-full py-3 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>Reserve a Slot (Rs. 500 Advance)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Admin PIN Unlock Modal */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAdminPinModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Admin Access</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your manager PIN to inspect payment screenshots, confirm slots, and manage bank accounts.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Manager PIN
                </label>
                <input
                  type="password"
                  autoFocus
                  maxLength={6}
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter PIN (Default: 1234)"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-center text-lg tracking-widest text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                {pinError && (
                  <p className="text-xs text-rose-400 mt-1.5 text-center">
                    Incorrect PIN. Use default <span className="font-mono font-bold">1234</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdmin(true);
                    setShowAdminPinModal(false);
                    setActiveTab('admin');
                  }}
                  className="flex-1 py-2 text-xs text-neutral-400 hover:text-white bg-neutral-800/80 rounded-xl"
                >
                  Quick Demo Access
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Verify & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
