import { Booking, TeamStatistic, MatchScore, GroundAmenity, PaymentAccount, NotificationItem, OffTimingHoliday } from '../types';

export const GROUND_INFO = {
  name: 'Tami Futsal Ground',
  tagline: 'High-Performance Futsal Turf & Floodlit Arena',
  location: 'Gahkuch City near Soneri bank',
  address: 'Gahkuch City near Soneri bank',
  city: 'Gahkuch',
  phone: '03401082265',
  whatsapp: '923401082265',
  managerName: 'Irfan Hyder',
  paymentAccountName: 'Irfan Hyder',
  paymentAccountNumber: '03401082265',
  advanceRequired: 500, // PKR advance required for booking confirmation
  openingHours: '24 Hours / 05:00 AM - 05:00 AM (7 Days a week)',
  email: 'tamifutsal@gmail.com',
  mapCoordinates: {
    lat: 36.1751,
    lng: 73.7667,
  },
  surface: '50mm Monofilament Shock-pad Turf with high-resilience infill',
  dimensions: '38m x 20m (International Futsal Standard 5v5 / 7v7)',
};

export const INITIAL_OFF_TIMINGS: OffTimingHoliday[] = [
  {
    id: 'off-eid-1',
    title: 'Eid-ul-Fitr Holidays',
    type: 'eid',
    date: '2026-03-20',
    endDate: '2026-03-22',
    isFullDay: true,
    reason: 'Ground closed for Eid prayers and family celebrations. Reopens 3rd day of Eid.',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'off-novroz-1',
    title: 'Novroz Spring Festival',
    type: 'novroz',
    date: '2026-03-21',
    endDate: '2026-03-21',
    isFullDay: true,
    reason: 'Arena closed for Navroz regional festivities & cultural gathering.',
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'off-wedding-1',
    title: 'Local Wedding Reception',
    type: 'wedding',
    date: '2026-09-24',
    isFullDay: false,
    startTime: '14:00',
    endTime: '20:00',
    reason: 'Ground and parking reserved for community wedding gathering.',
    createdAt: '2026-09-20T10:00:00Z',
  },
];

export const INITIAL_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: 'ep-1',
    name: 'Easypaisa',
    type: 'wallet',
    accountTitle: 'Irfan Hyder',
    accountNumber: '03401082265',
    instructions: 'Send Rs. 500 advance via Easypaisa App or dial *786# to 03401082265',
    isActive: true,
    isDefault: true,
  },
  {
    id: 'jc-1',
    name: 'JazzCash',
    type: 'wallet',
    accountTitle: 'Irfan Hyder',
    accountNumber: '03401082265',
    instructions: 'Send Rs. 500 advance via JazzCash App or dial *786# to 03401082265',
    isActive: true,
  },
  {
    id: 'fb-1',
    name: 'Faysal Bank',
    type: 'bank',
    accountTitle: 'Irfan Hyder',
    accountNumber: '302100847291001',
    bankBranch: 'Gahkuch Branch',
    instructions: 'Transfer Rs. 500 to Faysal Bank A/C: 302100847291001 or IBAN: PK56FAYS3021008472910010',
    isActive: true,
  },
  {
    id: 'sb-1',
    name: 'Soneri Bank',
    type: 'bank',
    accountTitle: 'Irfan Hyder',
    accountNumber: '002900184719001',
    bankBranch: 'Gahkuch City Branch',
    instructions: 'Transfer Rs. 500 to Soneri Bank A/C: 002900184719001 or IBAN: PK12SONE0029001847190010',
    isActive: true,
  },
  {
    id: 'raast-1',
    name: 'Raast ID (Instant Fee-Free)',
    type: 'raast',
    accountTitle: 'Irfan Hyder',
    accountNumber: '03401082265',
    instructions: 'Transfer Rs. 500 instantly with zero fee from any banking app using Raast ID: 03401082265',
    isActive: true,
  },
];

export interface TimingTier {
  category: 'morning' | 'day' | 'night' | 'prime';
  name: string;
  timeRange: string;
  rate: number;
  description: string;
  badgeClass: string;
}

export const TIMING_TIERS: TimingTier[] = [
  {
    category: 'morning',
    name: 'Morning Timings',
    timeRange: '05:00 AM - 11:00 AM',
    rate: 2000,
    description: 'Crisp mountain air, early fitness & sunrise matches',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    category: 'day',
    name: 'Day Timings',
    timeRange: '11:00 AM - 04:00 PM',
    rate: 2500,
    description: 'Bright daytime slots & afternoon squad practice',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
  {
    category: 'night',
    name: 'Night Timings',
    timeRange: '04:00 PM - 08:00 PM & 01:00 AM - 05:00 AM',
    rate: 3000,
    description: 'High-power 800-lux LED floodlights & late night kickoffs',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  },
  {
    category: 'prime',
    name: 'Prime Night Hours',
    timeRange: '08:00 PM - 01:00 AM',
    rate: 3500,
    description: 'Peak community futsal hours with full arena atmosphere',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
];

/**
 * Helper to get slot rate and category from starting time string "HH:00"
 */
export function getSlotInfo(timeStr: string): {
  rate: number;
  category: 'morning' | 'day' | 'night' | 'prime';
  categoryLabel: string;
  isPeak: boolean;
} {
  const hour = parseInt(timeStr.split(':')[0], 10);

  // Morning: 5 AM to 11 AM = 2000 PKR
  if (hour >= 5 && hour < 11) {
    return {
      rate: 2000,
      category: 'morning',
      categoryLabel: 'Morning (05:00 - 11:00 AM)',
      isPeak: false,
    };
  }

  // Day: 11 AM to 4 PM (12 to 4 PM requested) = 2500 PKR
  if (hour >= 11 && hour < 16) {
    return {
      rate: 2500,
      category: 'day',
      categoryLabel: 'Day Timings (12:00 - 04:00 PM)',
      isPeak: false,
    };
  }

  // Prime Hours: 8 PM to 1 AM (20:00 to 01:00) = 3500 PKR
  if ((hour >= 20 && hour <= 23) || hour === 0) {
    return {
      rate: 3500,
      category: 'prime',
      categoryLabel: 'Prime Hours (08:00 PM - 01:00 AM)',
      isPeak: true,
    };
  }

  // Night: 4 PM to 8 PM & 1 AM to 5 AM = 3000 PKR
  return {
    rate: 3000,
    category: 'night',
    categoryLabel: 'Night Timings (04:00 PM - 05:00 AM)',
    isPeak: true,
  };
}

/**
 * Universal slot pricing helper returning price and category
 */
export function getSlotPricing(timeStr: string): {
  price: number;
  rate: number;
  category: 'morning' | 'day' | 'night' | 'prime';
  tier: string;
  categoryLabel: string;
  isPeak: boolean;
  isPrime: boolean;
} {
  const info = getSlotInfo(timeStr);
  return {
    price: info.rate,
    rate: info.rate,
    category: info.category,
    tier: info.categoryLabel,
    categoryLabel: info.categoryLabel,
    isPeak: info.isPeak,
    isPrime: info.category === 'prime',
  };
}

// 24 Standard Hourly Slots starting at 05:00 AM
export const STANDARD_HOURLY_SLOTS = [
  { start: '05:00', end: '06:00', label: '05:00 AM - 06:00 AM', ...getSlotInfo('05:00') },
  { start: '06:00', end: '07:00', label: '06:00 AM - 07:00 AM', ...getSlotInfo('06:00') },
  { start: '07:00', end: '08:00', label: '07:00 AM - 08:00 AM', ...getSlotInfo('07:00') },
  { start: '08:00', end: '09:00', label: '08:00 AM - 09:00 AM', ...getSlotInfo('08:00') },
  { start: '09:00', end: '10:00', label: '09:00 AM - 10:00 AM', ...getSlotInfo('09:00') },
  { start: '10:00', end: '11:00', label: '10:00 AM - 11:00 AM', ...getSlotInfo('10:00') },
  { start: '11:00', end: '12:00', label: '11:00 AM - 12:00 PM', ...getSlotInfo('11:00') },
  { start: '12:00', end: '13:00', label: '12:00 PM - 01:00 PM', ...getSlotInfo('12:00') },
  { start: '13:00', end: '14:00', label: '01:00 PM - 02:00 PM', ...getSlotInfo('13:00') },
  { start: '14:00', end: '15:00', label: '02:00 PM - 03:00 PM', ...getSlotInfo('14:00') },
  { start: '15:00', end: '16:00', label: '03:00 PM - 04:00 PM', ...getSlotInfo('15:00') },
  { start: '16:00', end: '17:00', label: '04:00 PM - 05:00 PM', ...getSlotInfo('16:00') },
  { start: '17:00', end: '18:00', label: '05:00 PM - 06:00 PM', ...getSlotInfo('17:00') },
  { start: '18:00', end: '19:00', label: '06:00 PM - 07:00 PM', ...getSlotInfo('18:00') },
  { start: '19:00', end: '20:00', label: '07:00 PM - 08:00 PM', ...getSlotInfo('19:00') },
  { start: '20:00', end: '21:00', label: '08:00 PM - 09:00 PM (Prime)', ...getSlotInfo('20:00') },
  { start: '21:00', end: '22:00', label: '09:00 PM - 10:00 PM (Prime)', ...getSlotInfo('21:00') },
  { start: '22:00', end: '23:00', label: '10:00 PM - 11:00 PM (Prime)', ...getSlotInfo('22:00') },
  { start: '23:00', end: '00:00', label: '11:00 PM - 12:00 AM (Prime)', ...getSlotInfo('23:00') },
  { start: '00:00', end: '01:00', label: '12:00 AM - 01:00 AM (Midnight Prime)', ...getSlotInfo('00:00') },
  { start: '01:00', end: '02:00', label: '01:00 AM - 02:00 AM (Night)', ...getSlotInfo('01:00') },
  { start: '02:00', end: '03:00', label: '02:00 AM - 03:00 AM (Night)', ...getSlotInfo('02:00') },
  { start: '03:00', end: '04:00', label: '03:00 AM - 04:00 AM (Night)', ...getSlotInfo('03:00') },
  { start: '04:00', end: '05:00', label: '04:00 AM - 05:00 AM (Night)', ...getSlotInfo('04:00') },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'TFG-2609-101',
    pitchName: 'Tami Futsal Ground',
    date: '2026-09-22',
    startTime: '20:00',
    endTime: '21:00',
    durationHours: 1,
    customerName: 'Zubair Shah',
    customerPhone: '03001234567',
    teamName: 'Red Devils FC',
    opponentTeam: 'Blue Stars',
    totalAmount: 3500,
    advanceAmount: 500,
    remainingAmount: 3000,
    paidAmount: 500,
    paymentMethod: 'Easypaisa',
    paymentAccountId: 'ep-1',
    transactionId: 'EP8472910385',
    status: 'confirmed',
    createdAt: '2026-09-21T18:30:00Z',
    needsOpponent: false,
  },
  {
    id: 'TFG-2609-102',
    pitchName: 'Tami Futsal Ground',
    date: '2026-09-22',
    startTime: '21:00',
    endTime: '22:00',
    durationHours: 1,
    customerName: 'Hamza Tariq',
    customerPhone: '03339876543',
    teamName: 'Thunder Strikers',
    totalAmount: 3500,
    advanceAmount: 500,
    remainingAmount: 3000,
    paidAmount: 500,
    paymentMethod: 'Faysal Bank',
    paymentAccountId: 'fb-1',
    transactionId: 'FB9920194812',
    status: 'confirmed',
    createdAt: '2026-09-21T20:15:00Z',
    needsOpponent: true,
  },
  {
    id: 'TFG-2609-103',
    pitchName: 'Tami Futsal Ground',
    date: '2026-09-22',
    startTime: '17:00',
    endTime: '18:00',
    durationHours: 1,
    customerName: 'Adeel Qureshi',
    customerPhone: '03455512345',
    teamName: 'Gahkuch United',
    totalAmount: 3000,
    advanceAmount: 500,
    remainingAmount: 2500,
    paidAmount: 500,
    paymentMethod: 'Soneri Bank',
    paymentAccountId: 'sb-1',
    transactionId: 'SB6623049182',
    status: 'pending_verification',
    createdAt: '2026-09-22T06:10:00Z',
    needsOpponent: false,
    notes: 'Uploaded payment screenshot for verification',
  },
  {
    id: 'TFG-2609-104',
    pitchName: 'Tami Futsal Ground',
    date: '2026-09-22',
    startTime: '07:00',
    endTime: '08:00',
    durationHours: 1,
    customerName: 'Kareem Ullah',
    customerPhone: '03409887766',
    teamName: 'Khari Youngsters',
    totalAmount: 2000,
    advanceAmount: 500,
    remainingAmount: 1500,
    paidAmount: 500,
    paymentMethod: 'JazzCash',
    paymentAccountId: 'jc-1',
    transactionId: 'JC4481029482',
    status: 'confirmed',
    createdAt: '2026-09-21T21:00:00Z',
  },
  {
    id: 'TFG-2609-105',
    pitchName: 'Tami Futsal Ground',
    date: '2026-09-23',
    startTime: '20:00',
    endTime: '22:00',
    durationHours: 2,
    customerName: 'Usman Ali',
    customerPhone: '03217788990',
    teamName: 'Gladiators SC',
    totalAmount: 7000,
    advanceAmount: 1000,
    remainingAmount: 6000,
    paidAmount: 1000,
    paymentMethod: 'Easypaisa',
    paymentAccountId: 'ep-1',
    transactionId: 'EP3391029381',
    status: 'confirmed',
    createdAt: '2026-09-21T12:00:00Z',
  },
  {
    id: 'TFG-2609-080',
    pitchName: 'Tami Futsal Ground',
    date: '2026-09-18',
    startTime: '21:00',
    endTime: '22:00',
    durationHours: 1,
    customerName: 'Fahad Mehmood',
    customerPhone: '03019988776',
    teamName: 'Falcons Futsal',
    totalAmount: 3500,
    advanceAmount: 500,
    remainingAmount: 3000,
    paidAmount: 3500,
    paymentMethod: 'Easypaisa',
    paymentAccountId: 'ep-1',
    transactionId: 'EP1928374650',
    status: 'completed',
    createdAt: '2026-09-17T11:00:00Z',
  },
  {
    id: 'TFG-2609-081',
    pitchName: 'Tami Futsal Ground',
    date: '2026-09-19',
    startTime: '20:00',
    endTime: '21:00',
    durationHours: 1,
    customerName: 'Danish Khan',
    customerPhone: '03348877665',
    teamName: 'Titan Strikers',
    totalAmount: 3500,
    advanceAmount: 500,
    remainingAmount: 3000,
    paidAmount: 3500,
    paymentMethod: 'JazzCash',
    paymentAccountId: 'jc-1',
    transactionId: 'JC9182736451',
    status: 'completed',
    createdAt: '2026-09-18T10:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Booking Confirmed!',
    message: 'Your match slot for Red Devils FC on 2026-09-22 at 20:00 (Prime Hours) is confirmed. Advance Rs. 500 verified.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'confirmation',
    recipient: 'user',
    bookingId: 'TFG-2609-101',
    isRead: false,
    meta: {
      teamName: 'Red Devils FC',
      timeSlot: '20:00 - 21:00',
      date: '2026-09-22',
      advanceAmount: 500,
    },
  },
  {
    id: 'notif-2',
    title: 'Upcoming Match Reminder ⚽',
    message: 'Reminder: Match kickoff in 1 hour! Red Devils FC vs Blue Stars at 20:00. Location: Gahkuch Khari, Behind Faysal Bank.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    type: 'reminder',
    recipient: 'user',
    bookingId: 'TFG-2609-101',
    isRead: false,
    meta: {
      teamName: 'Red Devils FC',
      timeSlot: '20:00 - 21:00',
      date: '2026-09-22',
    },
  },
  {
    id: 'notif-3',
    title: 'Payment Receipt Issued (Rs. 500)',
    message: 'Advance payment of Rs. 500 received via Easypaisa (TID: EP8472910385). Remaining balance: Rs. 3,000 due on ground.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    type: 'receipt',
    recipient: 'user',
    bookingId: 'TFG-2609-101',
    isRead: false,
    meta: {
      teamName: 'Red Devils FC',
      advanceAmount: 500,
      amount: 3500,
    },
  },
  {
    id: 'notif-4',
    title: 'Admin Alert: New Booking & Screenshot Uploaded',
    message: 'Gahkuch United booked 17:00 - 18:00 (Rs. 500 Advance via Soneri Bank). Screenshot uploaded for verification.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: 'admin_booking',
    recipient: 'admin',
    bookingId: 'TFG-2609-103',
    isRead: false,
    meta: {
      teamName: 'Gahkuch United',
      timeSlot: '17:00 - 18:00',
      date: '2026-09-22',
      advanceAmount: 500,
    },
  },
];

export const INITIAL_TEAM_STATS: TeamStatistic[] = [
  {
    id: 'team-1',
    rank: 1,
    teamName: 'Thunder Strikers',
    captain: 'Hamza Tariq',
    played: 14,
    won: 11,
    drawn: 2,
    lost: 1,
    goalsFor: 58,
    goalsAgainst: 22,
    goalDifference: 36,
    points: 35,
    cleanSheets: 6,
    winRate: 78.5,
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  },
  {
    id: 'team-2',
    rank: 2,
    teamName: 'Red Devils FC',
    captain: 'Zubair Shah',
    played: 13,
    won: 10,
    drawn: 1,
    lost: 2,
    goalsFor: 49,
    goalsAgainst: 24,
    goalDifference: 25,
    points: 31,
    cleanSheets: 5,
    winRate: 76.9,
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
  },
  {
    id: 'team-3',
    rank: 3,
    teamName: 'Gladiators SC',
    captain: 'Usman Ali',
    played: 14,
    won: 9,
    drawn: 2,
    lost: 3,
    goalsFor: 44,
    goalsAgainst: 28,
    goalDifference: 16,
    points: 29,
    cleanSheets: 4,
    winRate: 64.2,
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  },
  {
    id: 'team-4',
    rank: 4,
    teamName: 'Khari Youngsters',
    captain: 'Kareem Ullah',
    played: 12,
    won: 7,
    drawn: 2,
    lost: 3,
    goalsFor: 39,
    goalsAgainst: 30,
    goalDifference: 9,
    points: 23,
    cleanSheets: 3,
    winRate: 58.3,
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  },
  {
    id: 'team-5',
    rank: 5,
    teamName: 'Gahkuch United',
    captain: 'Adeel Qureshi',
    played: 11,
    won: 6,
    drawn: 1,
    lost: 4,
    goalsFor: 32,
    goalsAgainst: 29,
    goalDifference: 3,
    points: 19,
    cleanSheets: 2,
    winRate: 54.5,
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  },
];

export const INITIAL_MATCH_RESULTS: MatchScore[] = [
  {
    id: 'm-1',
    date: '2026-09-21',
    teamA: 'Thunder Strikers',
    teamB: 'Gladiators SC',
    scoreA: 5,
    scoreB: 3,
    pitch: 'Tami Futsal Ground',
    mvp: 'Hamza Tariq (3 Goals)',
  },
  {
    id: 'm-2',
    date: '2026-09-20',
    teamA: 'Red Devils FC',
    teamB: 'Khari Youngsters',
    scoreA: 6,
    scoreB: 2,
    pitch: 'Tami Futsal Ground',
    mvp: 'Zubair Shah (Hat-trick)',
  },
  {
    id: 'm-3',
    date: '2026-09-19',
    teamA: 'Gahkuch United',
    teamB: 'Gladiators SC',
    scoreA: 4,
    scoreB: 4,
    pitch: 'Tami Futsal Ground',
    mvp: 'Adeel Qureshi (2 Assists)',
  },
];

export const GROUND_AMENITIES: GroundAmenity[] = [
  {
    id: 'turf',
    title: 'FIFA Standard Turf',
    description: 'European imported 50mm non-abrasive turf with premium rubber infill for optimal ball roll & ankle safety.',
    icon: 'Sparkles',
  },
  {
    id: 'floodlights',
    title: '800-Lux Anti-Glare Floodlights',
    description: 'Daylight-bright shadow-free illumination engineered for seamless night kickoffs from 4 PM to 5 AM.',
    icon: 'SunMedium',
  },
  {
    id: 'equipment',
    title: 'Free Balls & Bibs',
    description: 'Complimentary match-standard size 4 low-bounce futsal balls and clean numbered scrimmage bibs.',
    icon: 'ShieldCheck',
  },
  {
    id: 'changing',
    title: 'Locker & Washrooms',
    description: 'Clean changing facilities with running water, lockers, and fresh towels.',
    icon: 'Droplets',
  },
  {
    id: 'location-amenity',
    title: 'Central Gahkuch Khari Location',
    description: 'Located Behind Faysal Bank, Near Soneri Bank with direct road access.',
    icon: 'MapPin',
  },
  {
    id: 'parking',
    title: 'Secure Free Parking',
    description: 'Spacious vehicle and motorcycle parking inside the ground premises with safety monitoring.',
    icon: 'Car',
  },
];
