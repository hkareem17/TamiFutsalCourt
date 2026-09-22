import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Booking, TeamStatistic, MatchScore, BookingStatus, PaymentAccount, NotificationItem, OffTimingHoliday } from '../types';
import {
  INITIAL_BOOKINGS,
  INITIAL_TEAM_STATS,
  INITIAL_MATCH_RESULTS,
  INITIAL_PAYMENT_ACCOUNTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OFF_TIMINGS,
  STANDARD_HOURLY_SLOTS,
  GROUND_INFO,
} from '../data/initialData';
import { playNotificationSound, dispatchBrowserNotification } from '../utils/notificationService';

interface BookingMetrics {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  advanceCollected: number;
  remainingToCollect: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  paymentBreakdown: Record<string, number>;
  occupancyPercentage: number;
}

interface BookingContextType {
  bookings: Booking[];
  paymentAccounts: PaymentAccount[];
  notifications: NotificationItem[];
  teamStats: TeamStatistic[];
  matchScores: MatchScore[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  blockedSlots: Record<string, string>; // "date_time" -> reason
  offTimings: OffTimingHoliday[];
  groundDetails: typeof GROUND_INFO;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (val: boolean) => void;
  preselectedSlot: { date: string; time: string } | null;
  activeVoucher: Booking | null;
  setActiveVoucher: (booking: Booking | null) => void;
  openBookingModal: (date?: string, time?: string) => void;
  closeBookingModal: () => void;
  addBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'pitchName' | 'remainingAmount'> & { status?: BookingStatus; remainingAmount?: number }) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  cancelBooking: (id: string) => void;
  toggleBlockSlot: (date: string, time: string, reason?: string) => void;
  isSlotBooked: (date: string, time: string) => Booking | undefined;
  isSlotBlocked: (date: string, time: string) => string | undefined;
  // Off-timings and Holidays
  addOffTiming: (item: Omit<OffTimingHoliday, 'id' | 'createdAt'>) => void;
  updateOffTiming: (id: string, updates: Partial<OffTimingHoliday>) => void;
  deleteOffTiming: (id: string) => void;
  getHolidayOrOffTiming: (date: string, time?: string) => OffTimingHoliday | undefined;
  registerTeam: (teamName: string, captain: string) => void;
  addMatchScore: (match: Omit<MatchScore, 'id'>) => void;
  getFilteredBookings: (period: 'daily' | 'weekly' | 'monthly' | 'all', referenceDate?: string) => Booking[];
  getMetrics: (period: 'daily' | 'weekly' | 'monthly' | 'all', referenceDate?: string) => BookingMetrics;
  // Payment Account management
  addPaymentAccount: (account: Omit<PaymentAccount, 'id'>) => void;
  updatePaymentAccount: (id: string, updates: Partial<PaymentAccount>) => void;
  deletePaymentAccount: (id: string) => void;
  togglePaymentAccount: (id: string) => void;
  togglePaymentAccountActive: (id: string) => void;
  setDefaultPaymentAccount: (id: string) => void;
  // Notification management
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  sendUpcomingMatchReminder: (bookingId: string) => void;
  sendCustomNotification: (title: string, message: string, type?: NotificationItem['type'], recipient?: NotificationItem['recipient']) => void;
  resetToDefaultData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BOOKINGS: 'tfg_bookings_v2',
  PAYMENT_ACCOUNTS: 'tfg_payment_accounts_v2',
  NOTIFICATIONS: 'tfg_notifications_v2',
  BLOCKED_SLOTS: 'tfg_blocked_slots_v2',
  OFF_TIMINGS: 'tfg_off_timings_v2',
  TEAM_STATS: 'tfg_team_stats_v2',
  MATCH_SCORES: 'tfg_match_scores_v2',
};

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-22');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [preselectedSlot, setPreselectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [activeVoucher, setActiveVoucher] = useState<Booking | null>(null);

  // Initialize from LocalStorage or defaults
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [paymentAccounts, setPaymentAccounts] = useState<PaymentAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_ACCOUNTS);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT_ACCOUNTS;
    } catch {
      return INITIAL_PAYMENT_ACCOUNTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [blockedSlots, setBlockedSlots] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_SLOTS);
      return saved ? JSON.parse(saved) : {
        '2026-09-22_14:00': 'Turf Sprinkler & Brushing',
      };
    } catch {
      return { '2026-09-22_14:00': 'Turf Sprinkler & Brushing' };
    }
  });

  const [offTimings, setOffTimings] = useState<OffTimingHoliday[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OFF_TIMINGS);
      return saved ? JSON.parse(saved) : INITIAL_OFF_TIMINGS;
    } catch {
      return INITIAL_OFF_TIMINGS;
    }
  });

  const [teamStats, setTeamStats] = useState<TeamStatistic[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAM_STATS);
      return saved ? JSON.parse(saved) : INITIAL_TEAM_STATS;
    } catch {
      return INITIAL_TEAM_STATS;
    }
  });

  const [matchScores, setMatchScores] = useState<MatchScore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATCH_SCORES);
      return saved ? JSON.parse(saved) : INITIAL_MATCH_RESULTS;
    } catch {
      return INITIAL_MATCH_RESULTS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_ACCOUNTS, JSON.stringify(paymentAccounts));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [paymentAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_SLOTS, JSON.stringify(blockedSlots));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [blockedSlots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OFF_TIMINGS, JSON.stringify(offTimings));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [offTimings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEAM_STATS, JSON.stringify(teamStats));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [teamStats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MATCH_SCORES, JSON.stringify(matchScores));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [matchScores]);

  // Push Notification Dispatcher Helper
  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Trigger audio chime
    if (notifData.type === 'confirmation') {
      playNotificationSound('confirmation');
    } else if (notifData.type === 'receipt') {
      playNotificationSound('receipt');
    } else if (notifData.type === 'reminder') {
      playNotificationSound('reminder');
    } else {
      playNotificationSound('alert');
    }

    // Trigger native browser notification
    dispatchBrowserNotification(notifData.title, notifData.message);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const sendUpcomingMatchReminder = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    addNotification({
      title: 'Match Slot Reminder ⚽',
      message: `Upcoming Match: ${booking.teamName} is scheduled today at ${booking.startTime} - ${booking.endTime} at Tami Futsal Ground (Behind Faysal Bank, Gahkuch Khari). Please arrive 15 minutes early!`,
      type: 'reminder',
      recipient: 'user',
      bookingId: booking.id,
      meta: {
        teamName: booking.teamName,
        timeSlot: `${booking.startTime} - ${booking.endTime}`,
        date: booking.date,
        advanceAmount: booking.advanceAmount,
      },
    });
  };

  const sendCustomNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'admin_booking',
    recipient: NotificationItem['recipient'] = 'all'
  ) => {
    addNotification({
      title,
      message,
      type,
      recipient,
    });
  };

  // Payment Accounts Handlers
  const addPaymentAccount = (accountData: Omit<PaymentAccount, 'id'>) => {
    const newAccount: PaymentAccount = {
      ...accountData,
      id: `acc-${Date.now()}`,
    };
    setPaymentAccounts((prev) => [...prev, newAccount]);
    addNotification({
      title: 'Payment Method Added',
      message: `New account ${newAccount.name} (${newAccount.accountNumber}) added to active gateway accounts.`,
      type: 'admin_booking',
      recipient: 'admin',
    });
  };

  const updatePaymentAccount = (id: string, updates: Partial<PaymentAccount>) => {
    setPaymentAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc))
    );
  };

  const deletePaymentAccount = (id: string) => {
    setPaymentAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const togglePaymentAccount = (id: string) => {
    setPaymentAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isActive: !acc.isActive } : acc))
    );
  };

  const setDefaultPaymentAccount = (id: string) => {
    setPaymentAccounts((prev) =>
      prev.map((acc) => ({ ...acc, isDefault: acc.id === id }))
    );
    addNotification({
      title: 'Default Payment Method Updated',
      message: `Account set as the primary payment method for customer checkout.`,
      type: 'admin_booking',
      recipient: 'admin',
    });
  };

  // Slot checking
  const isSlotBooked = (date: string, time: string): Booking | undefined => {
    return bookings.find(
      (b) =>
        b.date === date &&
        b.startTime === time &&
        b.status !== 'cancelled'
    );
  };

  const getHolidayOrOffTiming = (date: string, time?: string): OffTimingHoliday | undefined => {
    return offTimings.find((off) => {
      const startDate = off.date;
      const endDate = off.endDate || off.date;
      const matchesDate = date >= startDate && date <= endDate;
      if (!matchesDate) return false;

      if (off.isFullDay) {
        return true;
      }

      // If specific hours provided and a time is passed:
      if (time && off.startTime && off.endTime) {
        const slotHour = parseInt(time.split(':')[0], 10);
        const startHour = parseInt(off.startTime.split(':')[0], 10);
        const endHour = parseInt(off.endTime.split(':')[0], 10);
        if (startHour <= endHour) {
          return slotHour >= startHour && slotHour < endHour;
        } else {
          // Crosses midnight, e.g. 22:00 to 04:00
          return slotHour >= startHour || slotHour < endHour;
        }
      }

      // If no time is passed, but date matches partial off-timing
      return !time;
    });
  };

  const isSlotBlocked = (date: string, time: string): string | undefined => {
    // Check if covered by a scheduled holiday or off-timing
    const holiday = getHolidayOrOffTiming(date, time);
    if (holiday) {
      return `${holiday.title} (${holiday.reason})`;
    }

    const key = `${date}_${time}`;
    return blockedSlots[key];
  };

  const addOffTiming = (item: Omit<OffTimingHoliday, 'id' | 'createdAt'>) => {
    const newHoliday: OffTimingHoliday = {
      ...item,
      id: `off-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setOffTimings((prev) => [newHoliday, ...prev]);
    addNotification({
      title: 'Off-Timing / Holiday Added',
      message: `${newHoliday.title} scheduled for ${newHoliday.date}${newHoliday.endDate && newHoliday.endDate !== newHoliday.date ? ` to ${newHoliday.endDate}` : ''}.`,
      type: 'admin_booking',
      recipient: 'admin',
    });
  };

  const updateOffTiming = (id: string, updates: Partial<OffTimingHoliday>) => {
    setOffTimings((prev) =>
      prev.map((off) => (off.id === id ? { ...off, ...updates } : off))
    );
  };

  const deleteOffTiming = (id: string) => {
    setOffTimings((prev) => prev.filter((off) => off.id !== id));
    addNotification({
      title: 'Off-Timing Removed',
      message: 'Ground holiday / off-timing has been removed and slots restored.',
      type: 'admin_booking',
      recipient: 'admin',
    });
  };

  const toggleBlockSlot = (date: string, time: string, reason = 'Turf Maintenance') => {
    const key = `${date}_${time}`;
    setBlockedSlots((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
        addNotification({
          title: 'Slot Unblocked',
          message: `Slot ${time} on ${date} has been unblocked and is now open for public bookings.`,
          type: 'admin_booking',
          recipient: 'admin',
        });
      } else {
        next[key] = reason;
        addNotification({
          title: 'Slot Blocked by Admin',
          message: `Slot ${time} on ${date} is reserved for maintenance: ${reason}.`,
          type: 'admin_booking',
          recipient: 'admin',
        });
      }
      return next;
    });
  };

  const openBookingModal = (date?: string, time?: string) => {
    if (date && time) {
      setPreselectedSlot({ date, time });
    } else {
      setPreselectedSlot(null);
    }
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setPreselectedSlot(null);
  };

  const addBooking = (
    bookingData: Omit<Booking, 'id' | 'createdAt' | 'status' | 'pitchName' | 'remainingAmount'> & { status?: BookingStatus }
  ): Booking => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const dateCode = bookingData.date.replace(/-/g, '').slice(2, 6);
    const newId = `TFG-${dateCode}-${randomSuffix}`;
    const advanceAmount = bookingData.advanceAmount ?? GROUND_INFO.advanceRequired;
    const remainingAmount = Math.max(0, bookingData.totalAmount - advanceAmount);

    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      pitchName: GROUND_INFO.name,
      advanceAmount,
      remainingAmount,
      status: bookingData.status || (bookingData.paymentMethod === 'Cash on Spot' ? 'confirmed' : 'pending_verification'),
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // 1. User confirmation notification
    addNotification({
      title: 'Booking Slot Received! ⚽',
      message: `Reservation received for ${newBooking.teamName} on ${newBooking.date} (${newBooking.startTime} - ${newBooking.endTime}). Advance of Rs. ${advanceAmount} submitted via ${newBooking.paymentMethod}.`,
      type: 'confirmation',
      recipient: 'user',
      bookingId: newId,
      meta: {
        teamName: newBooking.teamName,
        timeSlot: `${newBooking.startTime} - ${newBooking.endTime}`,
        date: newBooking.date,
        advanceAmount,
        amount: newBooking.totalAmount,
      },
    });

    // 2. User payment receipt notification
    addNotification({
      title: `Payment Receipt: Rs. ${advanceAmount} Advance`,
      message: `Receipt generated for ${newBooking.teamName}. Advance Rs. ${advanceAmount} paid via ${newBooking.paymentMethod}. Remaining balance Rs. ${remainingAmount} payable at turf on arrival.`,
      type: 'receipt',
      recipient: 'user',
      bookingId: newId,
      meta: {
        teamName: newBooking.teamName,
        advanceAmount,
        amount: newBooking.totalAmount,
      },
    });

    // 3. Admin notification for new booking
    addNotification({
      title: '🚨 New Booking Alert (Action Needed)',
      message: `${newBooking.teamName} (${newBooking.customerName}, ${newBooking.customerPhone}) booked ${newBooking.date} at ${newBooking.startTime}. Advance Rs. ${advanceAmount} submitted via ${newBooking.paymentMethod}${newBooking.screenshotImage ? ' with Screenshot' : ''}.`,
      type: 'admin_booking',
      recipient: 'admin',
      bookingId: newId,
      meta: {
        teamName: newBooking.teamName,
        timeSlot: `${newBooking.startTime} - ${newBooking.endTime}`,
        date: newBooking.date,
        advanceAmount,
      },
    });

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updated = { ...b, status };

          // Notify user when confirmed
          if (status === 'confirmed') {
            addNotification({
              title: 'Booking Confirmed & Verified! ✅',
              message: `Great news! Your booking for ${b.teamName} on ${b.date} at ${b.startTime} has been verified & approved by Irfan Hyder (Ground Manager). Advance Rs. ${b.advanceAmount} verified.`,
              type: 'confirmation',
              recipient: 'user',
              bookingId: b.id,
              meta: {
                teamName: b.teamName,
                timeSlot: `${b.startTime} - ${b.endTime}`,
                date: b.date,
                advanceAmount: b.advanceAmount,
              },
            });
          }

          return updated;
        }
        return b;
      })
    );
  };

  const cancelBooking = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b))
    );

    if (booking) {
      // Notify Admin
      addNotification({
        title: 'Booking Cancelled ❌',
        message: `Reservation for ${booking.teamName} on ${booking.date} at ${booking.startTime} was cancelled. Slot is now reopened.`,
        type: 'admin_cancellation',
        recipient: 'admin',
        bookingId: booking.id,
        meta: {
          teamName: booking.teamName,
          timeSlot: `${booking.startTime} - ${booking.endTime}`,
          date: booking.date,
        },
      });

      // Notify User
      addNotification({
        title: 'Match Slot Cancelled',
        message: `Your booking for ${booking.teamName} on ${booking.date} at ${booking.startTime} has been marked as cancelled.`,
        type: 'admin_cancellation',
        recipient: 'user',
        bookingId: booking.id,
      });
    }
  };

  const registerTeam = (teamName: string, captain: string) => {
    const newTeam: TeamStatistic = {
      id: `team-${Date.now()}`,
      rank: teamStats.length + 1,
      teamName,
      captain,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      cleanSheets: 0,
      winRate: 0,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    };
    setTeamStats((prev) => [...prev, newTeam]);
    addNotification({
      title: 'Squad Registered!',
      message: `Welcome ${teamName} (Captain: ${captain}) to Tami Futsal Ground tournament league standings.`,
      type: 'confirmation',
      recipient: 'user',
    });
  };

  const addMatchScore = (match: Omit<MatchScore, 'id'>) => {
    const newMatch: MatchScore = {
      ...match,
      id: `m-${Date.now()}`,
    };
    setMatchScores((prev) => [newMatch, ...prev]);
  };

  // Helper to filter bookings by period
  const getFilteredBookings = (period: 'daily' | 'weekly' | 'monthly' | 'all', referenceDate = selectedDate): Booking[] => {
    if (period === 'all') return bookings;

    const ref = new Date(referenceDate);

    if (period === 'daily') {
      return bookings.filter((b) => b.date === referenceDate);
    }

    if (period === 'weekly') {
      const startOfWeek = new Date(ref);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return bookings.filter((b) => {
        const bDate = new Date(b.date);
        return bDate >= startOfWeek && bDate <= endOfWeek;
      });
    }

    if (period === 'monthly') {
      const year = ref.getFullYear();
      const month = ref.getMonth();
      return bookings.filter((b) => {
        const bDate = new Date(b.date);
        return bDate.getFullYear() === year && bDate.getMonth() === month;
      });
    }

    return bookings;
  };

  // Financial and occupancy metrics
  const getMetrics = (period: 'daily' | 'weekly' | 'monthly' | 'all', referenceDate = selectedDate): BookingMetrics => {
    const filtered = getFilteredBookings(period, referenceDate);

    let totalRevenue = 0;
    let paidRevenue = 0;
    let pendingRevenue = 0;
    let advanceCollected = 0;
    let confirmedBookings = 0;
    let pendingBookings = 0;
    let cancelledBookings = 0;
    const paymentBreakdown: Record<string, number> = {};

    filtered.forEach((b) => {
      const method = b.paymentMethod || 'Other';
      paymentBreakdown[method] = (paymentBreakdown[method] || 0) + 1;

      if (b.status === 'confirmed' || b.status === 'completed') {
        confirmedBookings++;
        totalRevenue += b.totalAmount;
        paidRevenue += b.paidAmount || b.advanceAmount || 500;
        advanceCollected += b.advanceAmount || 500;
        pendingRevenue += Math.max(0, b.totalAmount - (b.paidAmount || b.advanceAmount || 500));
      } else if (b.status === 'pending_verification') {
        pendingBookings++;
        totalRevenue += b.totalAmount;
        advanceCollected += b.advanceAmount || 500;
        pendingRevenue += b.totalAmount;
      } else if (b.status === 'cancelled') {
        cancelledBookings++;
      }
    });

    const activeSlotsCount = filtered.filter((b) => b.status !== 'cancelled').length;
    const totalDailySlots = STANDARD_HOURLY_SLOTS.length; // 24 slots
    const expectedSlots = period === 'daily' ? totalDailySlots : period === 'weekly' ? totalDailySlots * 7 : totalDailySlots * 30;
    const occupancyPercentage = Math.min(100, Math.round((activeSlotsCount / Math.max(1, expectedSlots)) * 100));

    const remainingToCollect = Math.max(0, totalRevenue - advanceCollected);

    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      advanceCollected,
      remainingToCollect,
      totalBookings: filtered.length,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      paymentBreakdown,
      occupancyPercentage,
    };
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.PAYMENT_ACCOUNTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.BLOCKED_SLOTS);
    localStorage.removeItem(STORAGE_KEYS.OFF_TIMINGS);
    localStorage.removeItem(STORAGE_KEYS.TEAM_STATS);
    localStorage.removeItem(STORAGE_KEYS.MATCH_SCORES);

    setBookings(INITIAL_BOOKINGS);
    setPaymentAccounts(INITIAL_PAYMENT_ACCOUNTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBlockedSlots({ '2026-09-22_14:00': 'Turf Sprinkler & Brushing' });
    setOffTimings(INITIAL_OFF_TIMINGS);
    setTeamStats(INITIAL_TEAM_STATS);
    setMatchScores(INITIAL_MATCH_RESULTS);
  };

  const value = useMemo(
    () => ({
      bookings,
      paymentAccounts,
      notifications,
      teamStats,
      matchScores,
      selectedDate,
      setSelectedDate,
      blockedSlots,
      offTimings,
      groundDetails: GROUND_INFO,
      isAdmin,
      setIsAdmin,
      isBookingModalOpen,
      setIsBookingModalOpen,
      preselectedSlot,
      activeVoucher,
      setActiveVoucher,
      openBookingModal,
      closeBookingModal,
      addBooking,
      updateBookingStatus,
      cancelBooking,
      toggleBlockSlot,
      isSlotBooked,
      isSlotBlocked,
      addOffTiming,
      updateOffTiming,
      deleteOffTiming,
      getHolidayOrOffTiming,
      registerTeam,
      addMatchScore,
      getFilteredBookings,
      getMetrics,
      addPaymentAccount,
      updatePaymentAccount,
      deletePaymentAccount,
      togglePaymentAccount,
      togglePaymentAccountActive: togglePaymentAccount,
      setDefaultPaymentAccount,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotifications,
      sendUpcomingMatchReminder,
      sendCustomNotification,
      resetToDefaultData,
    }),
    [
      bookings,
      paymentAccounts,
      notifications,
      teamStats,
      matchScores,
      selectedDate,
      blockedSlots,
      offTimings,
      isAdmin,
      isBookingModalOpen,
      preselectedSlot,
      activeVoucher,
    ]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
