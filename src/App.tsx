/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { BookingProvider, useBooking } from './context/BookingContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BookingCalendar } from './components/BookingCalendar';
import { TeamStatsSection } from './components/TeamStatsSection';
import { LocationSection } from './components/LocationSection';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { BookingVoucherModal } from './components/BookingVoucherModal';
import { NotificationCenter } from './components/NotificationCenter';
import { Footer } from './components/Footer';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'booking' | 'stats' | 'location' | 'admin'>('booking');
  const { openBookingModal } = useBooking();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950">
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'booking' && (
          <>
            <HeroSection
              onBookClick={() => {
                const el = document.getElementById('booking-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  openBookingModal();
                }
              }}
              onStatsClick={() => setActiveTab('stats')}
              onLocationClick={() => setActiveTab('location')}
            />
            <BookingCalendar />
          </>
        )}

        {activeTab === 'stats' && <TeamStatsSection />}

        {activeTab === 'location' && <LocationSection />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Booking & Payment Modal */}
      <BookingModal />

      {/* Global Match Pass Digital Voucher */}
      <BookingVoucherModal />

      {/* Global Notification Center & Toast Alerts */}
      <NotificationCenter />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <BookingProvider>
        <MainApp />
      </BookingProvider>
    </NotificationProvider>
  );
}
