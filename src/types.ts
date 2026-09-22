export interface GroundDetails {
  name: string;
  surface: string;
  dimensions: string;
  location: string;
  landmark: string;
  features: string[];
}

export type BookingStatus = 'confirmed' | 'pending_verification' | 'cancelled' | 'completed';

export type PaymentAccountType = 'wallet' | 'bank' | 'raast' | 'other';

export interface PaymentAccount {
  id: string;
  name: string; // e.g. "Easypaisa", "JazzCash", "Faysal Bank", "Soneri Bank", "Raast ID", "SadaPay"
  type: PaymentAccountType;
  accountTitle: string;
  accountNumber: string; // Phone number or Bank Account No / IBAN
  bankBranch?: string;
  instructions?: string;
  isActive: boolean;
  isDefault?: boolean;
}

export interface Booking {
  id: string; // e.g. TFG-2609-1042
  pitchName: string; // "Tami Futsal Ground"
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "20:00"
  endTime: string; // e.g. "21:00"
  durationHours: number;
  customerName: string;
  customerPhone: string;
  teamName: string;
  opponentTeam?: string;
  notes?: string;
  totalAmount: number; // PKR
  advanceAmount: number; // PKR (500 advance required)
  remainingAmount: number; // PKR to be paid on spot
  paidAmount: number;
  paymentMethod: string; // name of bank/wallet e.g. "Easypaisa", "Faysal Bank"
  paymentAccountId?: string;
  transactionId?: string; // TID / TRX ID
  screenshotImage?: string; // Data URL or URL of uploaded screenshot
  status: BookingStatus;
  createdAt: string;
  needsOpponent?: boolean;
}

export interface TimeSlot {
  id: string; // e.g. "2026-09-22-20:00"
  startTime: string;
  endTime: string;
  label: string;
  category: 'morning' | 'day' | 'night' | 'prime';
  categoryLabel: string;
  isPeak: boolean;
  price: number;
  isBlocked?: boolean;
  blockReason?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'confirmation' | 'reminder' | 'receipt' | 'admin_booking' | 'admin_cancellation' | 'admin_verification';
  recipient: 'user' | 'admin' | 'all';
  bookingId?: string;
  isRead: boolean;
  meta?: {
    teamName?: string;
    amount?: number;
    advanceAmount?: number;
    timeSlot?: string;
    date?: string;
  };
}

export interface TeamStatistic {
  id: string;
  rank: number;
  teamName: string;
  captain: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  cleanSheets: number;
  winRate: number; // percentage
  badgeColor: string;
}

export interface MatchScore {
  id: string;
  date: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  pitch: string;
  mvp: string;
}

export type OffTimingType = 'eid' | 'novroz' | 'wedding' | 'maintenance' | 'holiday' | 'other';

export interface OffTimingHoliday {
  id: string;
  title: string; // e.g. "Eid-ul-Fitr Holidays", "Novroz Festival", "Local Wedding Gathering"
  type: OffTimingType;
  date: string; // Start date YYYY-MM-DD
  endDate?: string; // Optional end date YYYY-MM-DD for multi-day holidays (e.g. Eid Day 1-3)
  isFullDay: boolean; // If true, all slots on this date/range are closed
  startTime?: string; // If partial off-timing, e.g. "14:00"
  endTime?: string; // If partial off-timing, e.g. "22:00"
  reason: string; // Public notice displayed to players
  createdAt: string;
}

export interface GroundAmenity {
  id: string;
  title: string;
  description: string;
  icon: string;
}
