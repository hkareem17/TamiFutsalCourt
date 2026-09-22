import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItem } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/initialData';
import { playNotificationSound } from '../utils/notificationService';

const NOTIFICATIONS_STORAGE_KEY = 'tfg_notifications_v2';
const PUSH_PREF_KEY = 'tfg_push_enabled_v1';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  unreadAdminCount: number;
  unreadUserCount: number;
  activeToast: NotificationItem | null;
  dismissToast: () => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isPushSupported: boolean;
  isPushEnabled: boolean;
  requestPushPermission: () => Promise<boolean>;
  togglePushNotifications: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => NotificationItem;
  markAsRead: (id: string) => void;
  markAllAsRead: (filter?: 'user' | 'admin' | 'all') => void;
  clearAllNotifications: () => void;
  triggerSlotReminder: (teamName?: string, slot?: string) => void;
  triggerAdminTestAlert: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isPushSupported, setIsPushSupported] = useState<boolean>(false);
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PUSH_PREF_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Check if browser Push API is available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsPushSupported(true);
      if (Notification.permission === 'granted') {
        setIsPushEnabled(true);
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Request browser Notification permission
  const requestPushPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setIsPushEnabled(granted);
      localStorage.setItem(PUSH_PREF_KEY, String(granted));
      return granted;
    } catch (err) {
      console.warn('Notification permission error:', err);
      return false;
    }
  };

  const togglePushNotifications = async () => {
    if (!isPushEnabled) {
      const granted = await requestPushPermission();
      if (!granted) {
        // Fallback: enable in-app simulation
        setIsPushEnabled(true);
        localStorage.setItem(PUSH_PREF_KEY, 'true');
      }
    } else {
      setIsPushEnabled(false);
      localStorage.setItem(PUSH_PREF_KEY, 'false');
    }
  };

  // Dispatch browser desktop / device notification if supported and granted
  const dispatchBrowserNotification = useCallback((title: string, body: string) => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        });
      }
    } catch {
      // ignore permission or iframe sandbox blocks
    }
  }, []);

  // Add a new notification
  const addNotification = useCallback(
    (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): NotificationItem => {
      const newNotif: NotificationItem = {
        ...item,
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // Pop toast notification
      setActiveToast(newNotif);

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setActiveToast((current) => (current?.id === newNotif.id ? null : current));
      }, 5500);

      // Trigger audio chime
      if (item.type === 'confirmation') {
        playNotificationSound('confirmation');
      } else if (item.type === 'receipt') {
        playNotificationSound('receipt');
      } else if (item.type === 'reminder') {
        playNotificationSound('reminder');
      } else {
        playNotificationSound('alert');
      }

      // Dispatch real push if enabled
      dispatchBrowserNotification(newNotif.title, newNotif.message);

      return newNotif;
    },
    [dispatchBrowserNotification]
  );

  const dismissToast = () => {
    setActiveToast(null);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = (filter: 'user' | 'admin' | 'all' = 'all') => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (filter === 'all' || n.recipient === filter || n.recipient === 'all') {
          return { ...n, isRead: true };
        }
        return n;
      })
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Helper trigger for upcoming slot reminders
  const triggerSlotReminder = (teamName = 'Your Team', slot = '20:00 - 21:00') => {
    addNotification({
      title: `Upcoming Match Kickoff Reminder! ⚽`,
      message: `Match reminder for ${teamName}: Kickoff is in 2 hours at ${slot} on Tami Futsal Ground (Behind Faysal Bank, Gahkuch Khari). Don't forget your turf shoes!`,
      type: 'reminder',
      recipient: 'user',
      meta: {
        teamName,
        timeSlot: slot,
      },
    });
  };

  // Helper trigger for test admin alert
  const triggerAdminTestAlert = () => {
    addNotification({
      title: 'Admin Alert: New Slot Booking & Advance',
      message: 'Northern Warriors booked Prime Slot (21:00 - 22:00) with Rs. 500 advance via Easypaisa. Payment screenshot submitted for verification.',
      type: 'admin_booking',
      recipient: 'admin',
      meta: {
        teamName: 'Northern Warriors',
        amount: 3500,
        advanceAmount: 500,
        timeSlot: '21:00 - 22:00',
      },
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadAdminCount = notifications.filter((n) => !n.isRead && (n.recipient === 'admin' || n.recipient === 'all')).length;
  const unreadUserCount = notifications.filter((n) => !n.isRead && (n.recipient === 'user' || n.recipient === 'all')).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        unreadAdminCount,
        unreadUserCount,
        activeToast,
        dismissToast,
        isNotificationOpen,
        setIsNotificationOpen,
        isPushSupported,
        isPushEnabled,
        requestPushPermission,
        togglePushNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        triggerSlotReminder,
        triggerAdminTestAlert,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
