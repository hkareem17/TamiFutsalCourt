import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useBooking } from '../context/BookingContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  Receipt,
  AlertTriangle,
  X,
  Volume2,
  Trash2,
  CheckCheck,
  Sparkles,
} from 'lucide-react';
import { NotificationItem } from '../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isNotificationOpen,
    setIsNotificationOpen,
    activeToast,
    dismissToast,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    isPushEnabled,
    requestPushPermission,
    addNotification,
  } = useNotification();

  const { isAdmin } = useBooking();
  const [activeTab, setActiveTab] = useState<'all' | 'user' | 'admin'>('all');

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    if (granted) {
      addNotification({
        title: 'Push Notifications Active! 🔔',
        message: 'You will now receive instant push alerts for booking confirmations, slot reminders, and receipts.',
        type: 'confirmation',
        recipient: 'all',
      });
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'user') return n.recipient === 'user' || n.recipient === 'all';
    if (activeTab === 'admin') return n.recipient === 'admin' || n.recipient === 'all';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'confirmation':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'receipt':
        return <Receipt className="w-4 h-4 text-sky-400" />;
      case 'admin_booking':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'admin_cancellation':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-emerald-400" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      {/* Floating Active Toast Alert */}
      {activeToast && !isNotificationOpen && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-neutral-900/98 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl shadow-black/80 p-4 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            {getIcon(activeToast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <h4 className="text-xs font-bold text-white truncate">{activeToast.title}</h4>
              <button
                onClick={dismissToast}
                className="text-neutral-400 hover:text-white p-0.5 rounded transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
              {activeToast.message}
            </p>
          </div>
        </aside>
      )}

      {/* Drawer / Modal Popover */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsNotificationOpen(false)}
          />
          <div
            id="notification-center-dropdown"
            className="relative w-full max-w-md bg-neutral-900/98 backdrop-blur-xl border border-neutral-700/80 rounded-3xl shadow-2xl shadow-black/80 z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-top-4 sm:slide-in-from-right-4 duration-200"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Notifications & Alerts</h3>
                  <p className="text-xs text-neutral-400">
                    {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead('all')}
                    className="p-1.5 text-xs text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="p-1.5 text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Browser Push Permission Banner */}
            {!isPushEnabled && (
              <div className="px-4 py-2.5 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Volume2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Enable push alerts for match reminders & receipts</span>
                </div>
                <button
                  onClick={handleEnablePush}
                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  Enable
                </button>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-900/50 px-3 pt-2 gap-1 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 font-medium rounded-t-lg transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'all'
                    ? 'border-emerald-400 text-emerald-400 bg-neutral-800/40'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('user')}
                className={`px-3 py-1.5 font-medium rounded-t-lg transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'user'
                    ? 'border-emerald-400 text-emerald-400 bg-neutral-800/40'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Player Updates
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 font-medium rounded-t-lg transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'border-emerald-400 text-emerald-400 bg-neutral-800/40'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                Admin Alerts
              </button>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto divide-y divide-neutral-800/60 flex-1 max-h-[380px] p-2 space-y-1">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-10 px-4 text-neutral-400">
                  <Bell className="w-8 h-8 mx-auto text-neutral-600 mb-2 opacity-60" />
                  <p className="text-sm font-medium text-neutral-300">No notifications yet</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Booking confirmations, receipts, and slot reminders will appear here automatically.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 rounded-xl transition-all cursor-pointer ${
                      notif.isRead
                        ? 'bg-neutral-900/40 hover:bg-neutral-800/40 opacity-75'
                        : 'bg-neutral-800/70 hover:bg-neutral-800 border border-emerald-500/20 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-neutral-800 border border-neutral-700 shrink-0 mt-0.5">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4
                            className={`text-xs font-bold truncate ${
                              notif.isRead ? 'text-neutral-200' : 'text-emerald-300'
                            }`}
                          >
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-neutral-500 shrink-0">
                            {formatTimeAgo(notif.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed break-words">
                          {notif.message}
                        </p>

                        {/* Metadata tags */}
                        {notif.meta && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {notif.meta.teamName && (
                              <span className="text-[10px] bg-neutral-950 px-2 py-0.5 rounded text-neutral-300 border border-neutral-700">
                                ⚽ {notif.meta.teamName}
                              </span>
                            )}
                            {notif.meta.advanceAmount && (
                              <span className="text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/30">
                                Rs. {notif.meta.advanceAmount} Adv.
                              </span>
                            )}
                            {notif.meta.timeSlot && (
                              <span className="text-[10px] bg-neutral-950 px-2 py-0.5 rounded text-neutral-400 border border-neutral-700">
                                🕒 {notif.meta.timeSlot}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with test sound button */}
            <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => {
                  addNotification({
                    title: '🔔 Test Push Notification Chime',
                    message: 'Push sound and in-app automated alert system are verified & working perfectly!',
                    type: 'reminder',
                    recipient: 'all',
                  });
                }}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Audio Chime</span>
              </button>

              {isAdmin && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                  Admin Realtime Stream
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
