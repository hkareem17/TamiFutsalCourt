import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';
import { BookingStatus, Booking, PaymentAccount, PaymentAccountType } from '../types';
import { GROUND_INFO, STANDARD_HOURLY_SLOTS, getSlotPricing } from '../data/initialData';
import {
  Shield,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Download,
  Plus,
  Lock,
  Unlock,
  Filter,
  Users,
  CreditCard,
  Building2,
  Wallet,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Eye,
  RefreshCw,
  BellRing,
  Send,
  Trash2,
  Edit2,
  Check,
  X,
  MapPin,
  ExternalLink,
  Receipt,
  Sparkles,
  Zap,
  Copy,
  Star,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    bookings,
    groundDetails,
    paymentAccounts,
    selectedDate,
    setSelectedDate,
    updateBookingStatus,
    cancelBooking,
    addBooking,
    toggleBlockSlot,
    blockedSlots,
    setActiveVoucher,
    getFilteredBookings,
    getMetrics,
    addPaymentAccount,
    updatePaymentAccount,
    deletePaymentAccount,
    togglePaymentAccountActive,
    setDefaultPaymentAccount,
    resetToDefaultData,
  } = useBooking();

  const {
    notifications,
    unreadAdminCount,
    addNotification,
    triggerSlotReminder,
    setIsNotificationOpen,
  } = useNotification();

  const [activeTab, setActiveTab] = useState<'bookings' | 'accounts' | 'analytics' | 'maintenance'>('bookings');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('daily');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [inspectingBooking, setInspectingBooking] = useState<Booking | null>(null);

  // Manual booking form state
  const [manualDate, setManualDate] = useState<string>(selectedDate);
  const [manualTime, setManualTime] = useState<string>('20:00');
  const [manualDuration, setManualDuration] = useState<number>(1);
  const [manualCustomer, setManualCustomer] = useState<string>('');
  const [manualPhone, setManualPhone] = useState<string>('');
  const [manualTeam, setManualTeam] = useState<string>('');
  const [manualPaymentMethod, setManualPaymentMethod] = useState<string>('Easypaisa');
  const [manualTid, setManualTid] = useState<string>('');
  const [manualAdvance, setManualAdvance] = useState<number>(500);

  // New Account form state
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [accName, setAccName] = useState<string>('');
  const [accTitle, setAccTitle] = useState<string>('Irfan Hyder');
  const [accNumber, setAccNumber] = useState<string>('');
  const [accType, setAccType] = useState<PaymentAccountType>('wallet');
  const [accBranch, setAccBranch] = useState<string>('Gahkuch Khari');
  const [accInstructions, setAccInstructions] = useState<string>('');
  const [accIsDefault, setAccIsDefault] = useState<boolean>(false);
  const [copiedAccId, setCopiedAccId] = useState<string | null>(null);

  // Slot block form state
  const [blockDate, setBlockDate] = useState<string>(selectedDate);
  const [blockTime, setBlockTime] = useState<string>('15:00');
  const [blockReason, setBlockReason] = useState<string>('Turf Sprinkler & Maintenance');

  // Metrics
  const metrics = getMetrics(period, selectedDate);
  const filteredList = getFilteredBookings(period, selectedDate).filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      b.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.transactionId && b.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Pending Verifications Queue (All pending bookings awaiting screenshot confirmation)
  const pendingBookings = bookings.filter((b) => b.status === 'pending_verification');

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = [
      'Booking ID',
      'Date',
      'Start Time',
      'End Time',
      'Ground',
      'Team Name',
      'Captain Name',
      'Phone Number',
      'Total Amount (PKR)',
      'Advance Paid (PKR)',
      'Remaining Due (PKR)',
      'Payment Gateway',
      'Transaction ID (TID)',
      'Status',
    ];

    const rows = filteredList.map((b) => [
      `"${b.id}"`,
      `"${b.date}"`,
      `"${b.startTime}"`,
      `"${b.endTime}"`,
      `"Tami Futsal Ground"`,
      `"${b.teamName}"`,
      `"${b.customerName}"`,
      `"${b.customerPhone}"`,
      b.totalAmount,
      b.advanceAmount || 500,
      b.remainingAmount || 0,
      `"${b.paymentMethod}"`,
      `"${b.transactionId || 'N/A'}"`,
      `"${b.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Tami_Futsal_Ground_${period}_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Manual Walk-in Booking
  const handleManualBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomer.trim() || !manualTeam.trim() || !manualPhone.trim()) {
      alert('Please fill in Captain Name, Mobile Number, and Team Name.');
      return;
    }

    const startH = parseInt(manualTime.split(':')[0], 10);
    const endH = (startH + manualDuration) % 24;
    const endT = `${endH.toString().padStart(2, '0')}:00`;

    let calculatedTotal = 0;
    for (let i = 0; i < manualDuration; i++) {
      const h = (startH + i) % 24;
      const t = `${h.toString().padStart(2, '0')}:00`;
      calculatedTotal += getSlotPricing(t).price;
    }

    addBooking({
      date: manualDate,
      startTime: manualTime,
      endTime: endT,
      durationHours: manualDuration,
      customerName: manualCustomer.trim(),
      customerPhone: manualPhone.trim(),
      teamName: manualTeam.trim(),
      totalAmount: calculatedTotal,
      advanceAmount: manualAdvance,
      remainingAmount: Math.max(0, calculatedTotal - manualAdvance),
      paidAmount: manualAdvance,
      paymentMethod: manualPaymentMethod,
      transactionId: manualTid.trim() || `OFFLINE-${Date.now().toString().slice(-6)}`,
      status: 'confirmed',
    });

    setShowManualBookingModal(false);
    setManualCustomer('');
    setManualPhone('');
    setManualTeam('');
    setManualTid('');
  };

  // Save or Update Payment Account
  const handleSavePaymentAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim() || !accNumber.trim()) {
      alert('Please provide Gateway/Bank Name and Account/IBAN Number.');
      return;
    }

    if (editingAccountId) {
      updatePaymentAccount(editingAccountId, {
        name: accName.trim(),
        accountTitle: accTitle.trim(),
        accountNumber: accNumber.trim(),
        type: accType,
        bankBranch: accBranch.trim() || undefined,
        instructions: accInstructions.trim() || undefined,
        isDefault: accIsDefault,
      });
      if (accIsDefault) {
        setDefaultPaymentAccount(editingAccountId);
      }
    } else {
      const generatedId = `acc-${Date.now()}`;
      addPaymentAccount({
        name: accName.trim(),
        accountTitle: accTitle.trim() || 'Irfan Hyder',
        accountNumber: accNumber.trim(),
        type: accType,
        bankBranch: accBranch.trim() || undefined,
        instructions: accInstructions.trim() || undefined,
        isActive: true,
        isDefault: accIsDefault,
      });
      if (accIsDefault) {
        setDefaultPaymentAccount(generatedId);
      }
    }

    setShowAccountModal(false);
    setEditingAccountId(null);
    setAccName('');
    setAccNumber('');
    setAccInstructions('');
    setAccIsDefault(false);
  };

  const openEditAccount = (acc: PaymentAccount) => {
    setEditingAccountId(acc.id);
    setAccName(acc.name);
    setAccTitle(acc.accountTitle);
    setAccNumber(acc.accountNumber);
    setAccType(acc.type);
    setAccBranch(acc.bankBranch || '');
    setAccInstructions(acc.instructions || '');
    setAccIsDefault(Boolean(acc.isDefault));
    setShowAccountModal(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Shield className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Ground Manager & Admin Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Tami Futsal Ground Management
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{groundDetails.address} • Manager: {groundDetails.managerName} ({groundDetails.phone})</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Notification Bell with Badge */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 text-neutral-200 transition-colors cursor-pointer"
              title="Notification Center"
            >
              <BellRing className="w-5 h-5 text-emerald-400" />
              {unreadAdminCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 font-black text-[10px] flex items-center justify-center animate-pulse">
                  {unreadAdminCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowManualBookingModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Manual Walk-in Booking</span>
            </button>

            <button
              onClick={() => {
                setEditingAccountId(null);
                setAccName('');
                setAccTitle('Irfan Hyder');
                setAccNumber('');
                setAccType('wallet');
                setAccBranch('Gahkuch Khari');
                setAccInstructions('');
                setAccIsDefault(false);
                setShowAccountModal(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-neutral-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              title="Add bank account or e-wallet"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>+ Add Payment Account</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 text-sm font-semibold gap-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings & Verifications</span>
            {pendingBookings.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {pendingBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'accounts'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Bank Accounts & E-Wallets ({paymentAccounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Financial & Occupancy Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'maintenance'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Slot Blocking & Maintenance</span>
          </button>
        </div>

        {/* TAB 1: BOOKINGS & SCREENSHOT VERIFICATIONS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Pending Screenshot Verification Banner Queue */}
            {pendingBookings.length > 0 && (
              <div className="rounded-3xl bg-amber-950/20 border border-amber-500/30 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Receipt className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        Advance Payment Receipts Awaiting Verification ({pendingBookings.length})
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Teams uploaded Rs. 500 advance payment screenshots. Inspect proof and confirm slots to lock the schedule.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pendingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono font-bold text-emerald-400">{b.id}</span>
                          <h4 className="font-extrabold text-white text-sm mt-0.5">{b.teamName}</h4>
                          <p className="text-xs text-neutral-400">{b.customerName} • {b.customerPhone}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300">
                          Rs. {b.advanceAmount || 500} Adv.
                        </span>
                      </div>

                      <div className="text-xs text-neutral-300 flex items-center justify-between bg-neutral-950 p-2.5 rounded-xl">
                        <span>{b.date}</span>
                        <span className="font-mono text-emerald-400 font-bold">{b.startTime} - {b.endTime}</span>
                      </div>

                      {/* Screenshot thumbnail if available */}
                      {b.screenshotImage ? (
                        <div
                          onClick={() => setInspectingBooking(b)}
                          className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-950 border border-neutral-800/80 cursor-pointer hover:border-emerald-500/50 transition-colors"
                        >
                          <img
                            src={b.screenshotImage}
                            alt="Receipt"
                            className="w-10 h-10 rounded-lg object-cover bg-neutral-900"
                          />
                          <div className="text-[11px] min-w-0">
                            <span className="text-white font-medium block truncate">Receipt Screenshot</span>
                            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                              <Eye className="w-3 h-3" /> Click to Inspect
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-neutral-500 italic p-1">
                          TID: {b.transactionId || 'No TID'}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Lock</span>
                        </button>

                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter and Period Controls */}
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-neutral-400">Time Range:</span>
                {(['daily', 'weekly', 'monthly', 'all'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      period === p
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                {period !== 'all' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 ml-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 w-52 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search team, phone, TID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent w-full focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-neutral-500 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending_verification">Pending Advance</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950 text-neutral-400">
                    <th className="py-3 px-4 font-semibold">Ref ID</th>
                    <th className="py-3 px-4 font-semibold">Date & Time</th>
                    <th className="py-3 px-4 font-semibold">Team & Contact</th>
                    <th className="py-3 px-4 font-semibold">Rates & Advance</th>
                    <th className="py-3 px-4 font-semibold">Gateway / Proof</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-500">
                        No bookings found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {b.id}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-semibold text-white">{b.date}</div>
                          <div className="text-[11px] text-emerald-400 font-mono">
                            {b.startTime} - {b.endTime} ({b.durationHours}h)
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-white text-sm">{b.teamName}</div>
                          <div className="text-[11px] text-neutral-400">
                            {b.customerName} • <span className="font-mono">{b.customerPhone}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="text-white font-mono font-bold">
                            Rs. {b.totalAmount.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-emerald-400">
                            Adv: Rs. {b.advanceAmount || 500}
                          </div>
                          {b.remainingAmount ? (
                            <div className="text-[10px] text-neutral-400">
                              Bal: Rs. {b.remainingAmount}
                            </div>
                          ) : null}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-white">{b.paymentMethod}</div>
                          {b.screenshotImage ? (
                            <button
                              onClick={() => setInspectingBooking(b)}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-0.5 cursor-pointer"
                            >
                              <Receipt className="w-3 h-3" />
                              <span>View Receipt</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-neutral-500 font-mono">
                              TID: {b.transactionId?.slice(0, 10) || 'None'}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {b.status === 'confirmed' && (
                            <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px]">
                              Confirmed
                            </span>
                          )}
                          {b.status === 'pending_verification' && (
                            <span className="px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px]">
                              Pending Adv.
                            </span>
                          )}
                          {b.status === 'completed' && (
                            <span className="px-2 py-0.5 rounded-full font-bold bg-teal-500/20 text-teal-400 border border-teal-500/40 text-[11px]">
                              Completed
                            </span>
                          )}
                          {b.status === 'cancelled' && (
                            <span className="px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px]">
                              Cancelled
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status === 'pending_verification' && (
                              <button
                                onClick={() => updateBookingStatus(b.id, 'confirmed')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-neutral-950 font-bold transition-colors cursor-pointer"
                                title="Approve"
                              >
                                Approve
                              </button>
                            )}

                            <button
                              onClick={() => setActiveVoucher(b)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                              title="View Match Pass"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {b.status !== 'cancelled' && (
                              <button
                                onClick={() => cancelBooking(b.id)}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Cancel Booking"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BANK ACCOUNTS & E-WALLETS MANAGEMENT */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  Payment Accounts & E-Wallets
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Configure Easypaisa, JazzCash, Faysal Bank, Soneri Bank, and custom payment accounts displayed to users for the Rs. 500 advance transfer.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingAccountId(null);
                  setAccName('');
                  setAccTitle('Irfan Hyder');
                  setAccNumber('');
                  setAccType('bank');
                  setAccBranch('Gahkuch Khari');
                  setAccInstructions('');
                  setShowAccountModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Bank / E-Wallet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                    acc.isActive
                      ? 'bg-neutral-900 border-neutral-800 hover:border-emerald-500/50'
                      : 'bg-neutral-900/40 border-neutral-800/40 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {acc.type === 'bank' ? (
                          <Building2 className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Wallet className="w-4 h-4 text-emerald-400" />
                        )}
                        <span className="font-extrabold text-white text-sm">{acc.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {acc.isDefault && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-300" />
                            Default
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            acc.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {acc.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1">
                      <div className="text-[11px] text-neutral-400">
                        Title: <strong className="text-white">{acc.accountTitle}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs text-emerald-400 font-bold truncate">
                          {acc.accountNumber}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`${acc.name}: ${acc.accountNumber} (${acc.accountTitle})`);
                            setCopiedAccId(acc.id);
                            setTimeout(() => setCopiedAccId(null), 2000);
                          }}
                          className="p-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy number"
                        >
                          {copiedAccId === acc.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      {acc.bankBranch && (
                        <div className="text-[10px] text-neutral-500">
                          Branch: {acc.bankBranch}
                        </div>
                      )}
                    </div>

                    {acc.instructions && (
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {acc.instructions}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePaymentAccountActive(acc.id)}
                        className="text-neutral-400 hover:text-white underline cursor-pointer text-xs"
                      >
                        {acc.isActive ? 'Disable' : 'Enable'}
                      </button>

                      {!acc.isDefault && (
                        <button
                          onClick={() => setDefaultPaymentAccount(acc.id)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Make this the preselected account in customer booking"
                        >
                          Make Primary
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditAccount(acc)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (paymentAccounts.length <= 1) {
                            alert('You must have at least one payment account.');
                            return;
                          }
                          if (confirm(`Delete payment account ${acc.name}?`)) {
                            deletePaymentAccount(acc.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FINANCIAL & OCCUPANCY REPORTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs font-semibold text-neutral-400">Total Bookings Revenue</span>
                <p className="text-2xl font-black text-white font-mono">
                  Rs. {metrics.totalRevenue.toLocaleString()}
                </p>
                <div className="text-[11px] text-emerald-400">
                  Paid / Confirmed: Rs. {metrics.paidRevenue.toLocaleString()}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs font-semibold text-neutral-400">Advance Collected (Rs. 500s)</span>
                <p className="text-2xl font-black text-emerald-400 font-mono">
                  Rs. {metrics.advanceCollected.toLocaleString()}
                </p>
                <div className="text-[11px] text-neutral-400">
                  Remaining on arrival: Rs. {metrics.remainingToCollect.toLocaleString()}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs font-semibold text-neutral-400">Total Reservations</span>
                <p className="text-2xl font-black text-white font-mono">
                  {metrics.totalBookings}
                </p>
                <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{metrics.confirmedBookings} Confirmed</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">{metrics.pendingBookings} Pending</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
                <span className="text-xs font-semibold text-neutral-400">Ground Occupancy Rate</span>
                <p className="text-2xl font-black text-teal-400 font-mono">
                  {metrics.occupancyPercentage}%
                </p>
                <div className="text-[11px] text-neutral-400">
                  Based on 24hr slot timetable
                </div>
              </div>
            </div>

            {/* Official Ground Timings & Charges Reference */}
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>Configured Timings & Official Pricing Structure</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="font-extrabold text-white text-sm block">Morning Slot</span>
                  <span className="text-emerald-400 font-bold font-mono text-base block">Rs. 2,000 / hr</span>
                  <p className="text-neutral-400 text-[11px]">5:00 AM to 11:00 AM</p>
                  <p className="text-neutral-500 text-[10px]">Cool mountain morning kickoffs</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="font-extrabold text-white text-sm block">Day Timings</span>
                  <span className="text-teal-400 font-bold font-mono text-base block">Rs. 2,500 / hr</span>
                  <p className="text-neutral-400 text-[11px]">12:00 PM to 4:00 PM</p>
                  <p className="text-neutral-500 text-[10px]">Afternoon scrimmages</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="font-extrabold text-white text-sm block">Night Timings</span>
                  <span className="text-amber-400 font-bold font-mono text-base block">Rs. 3,000 / hr</span>
                  <p className="text-neutral-400 text-[11px]">4:00 PM to 5:00 AM</p>
                  <p className="text-neutral-500 text-[10px]">Floodlit standard slots</p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1 ring-1 ring-emerald-500/20">
                  <span className="font-extrabold text-white text-sm block flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Prime Hours
                  </span>
                  <span className="text-white font-bold font-mono text-base block">Rs. 3,500 / hr</span>
                  <p className="text-emerald-300 text-[11px]">8:00 PM to 1:00 AM</p>
                  <p className="text-neutral-400 text-[10px]">High-demand peak tournament hours</p>
                </div>
              </div>
            </div>

            {/* Reset Defaults button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset demo bookings and accounts to default sample state?')) {
                    resetToDefaultData();
                  }
                }}
                className="text-xs text-neutral-500 hover:text-neutral-400 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo State to Defaults</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SLOT MAINTENANCE & BLOCK MANAGER */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    Slot Blocking & Grounds Maintenance
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Prevent customer reservations during turf lawn rolling, sprinkler cycles, floodlight repair, or private tournaments.
                  </p>
                </div>
              </div>

              {/* Form to Block a Slot */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Block a Specific Slot
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={blockDate}
                      onChange={(e) => setBlockDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Time Slot</label>
                    <select
                      value={blockTime}
                      onChange={(e) => setBlockTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none"
                    >
                      {STANDARD_HOURLY_SLOTS.map((s) => (
                        <option key={s.start} value={s.start}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Reason / Note</label>
                    <input
                      type="text"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      placeholder="e.g. Turf Sprinkler & Rolling"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toggleBlockSlot(blockDate, blockTime, blockReason);
                    alert(`Slot ${blockTime} on ${blockDate} updated.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Toggle Block on Slot</span>
                </button>
              </div>

              {/* Currently Blocked Slots List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Currently Blocked Slots
                </h4>

                {Object.keys(blockedSlots).length === 0 ? (
                  <p className="text-xs text-neutral-500 py-3">No active maintenance blocks. All slots open.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(blockedSlots).map(([key, reason]) => {
                      const [bDate, bTime] = key.split('_');
                      return (
                        <div
                          key={key}
                          className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-xs font-mono font-bold text-amber-400 block">
                              {bDate} • {bTime}
                            </span>
                            <span className="text-[11px] text-neutral-300 mt-0.5 block truncate max-w-[180px]">
                              {reason}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleBlockSlot(bDate, bTime)}
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-emerald-500/20 text-neutral-400 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Unblock Slot"
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SCREENSHOT INSPECTION MODAL */}
        {inspectingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-neutral-900 via-emerald-950/40 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Payment Receipt Proof • Ref {inspectingBooking.id}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {inspectingBooking.teamName} ({inspectingBooking.customerName} - {inspectingBooking.customerPhone})
                  </p>
                </div>
                <button
                  onClick={() => setInspectingBooking(null)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs">
                  <div>
                    <span className="text-neutral-500">Advance Claimed:</span>
                    <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
                      Rs. {inspectingBooking.advanceAmount || 500} PKR
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Transaction ID (TID):</span>
                    <p className="font-mono font-bold text-white text-sm mt-0.5 truncate">
                      {inspectingBooking.transactionId || 'None'}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Gateway:</span>
                    <p className="font-bold text-white mt-0.5">{inspectingBooking.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500">Match Slot:</span>
                    <p className="font-mono text-emerald-400 mt-0.5">
                      {inspectingBooking.date} ({inspectingBooking.startTime})
                    </p>
                  </div>
                </div>

                {/* Receipt Image Display */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-2 overflow-hidden flex items-center justify-center max-h-80">
                  {inspectingBooking.screenshotImage ? (
                    <img
                      src={inspectingBooking.screenshotImage}
                      alt="Uploaded Receipt"
                      className="max-h-76 w-auto object-contain rounded-xl"
                    />
                  ) : (
                    <p className="text-xs text-neutral-500 py-12">No screenshot image attached to this booking.</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      updateBookingStatus(inspectingBooking.id, 'confirmed');
                      setInspectingBooking(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Advance & Confirm Match</span>
                  </button>

                  <button
                    onClick={() => {
                      cancelBooking(inspectingBooking.id);
                      setInspectingBooking(null);
                    }}
                    className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MANUAL BOOKING MODAL */}
        {showManualBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-neutral-900 via-emerald-950/40 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white">Manual Walk-in Slot Booking</h3>
                  <p className="text-xs text-neutral-400">Direct admin entry for telephone or on-ground bookings</p>
                </div>
                <button
                  onClick={() => setShowManualBookingModal(false)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManualBookingSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Start Time</label>
                    <select
                      value={manualTime}
                      onChange={(e) => setManualTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                    >
                      {STANDARD_HOURLY_SLOTS.map((s) => (
                        <option key={s.start} value={s.start}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Duration</label>
                    <select
                      value={manualDuration}
                      onChange={(e) => setManualDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                    >
                      <option value={1}>1 Hour</option>
                      <option value={2}>2 Hours</option>
                      <option value={3}>3 Hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Advance Received (PKR)</label>
                    <input
                      type="number"
                      value={manualAdvance}
                      onChange={(e) => setManualAdvance(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Captain Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Ali"
                      value={manualCustomer}
                      onChange={(e) => setManualCustomer(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="0340-xxxxxxx"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karakoram Eagles"
                    value={manualTeam}
                    onChange={(e) => setManualTeam(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Payment Method</label>
                    <select
                      value={manualPaymentMethod}
                      onChange={(e) => setManualPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                    >
                      <option value="Cash on Ground">Cash on Ground</option>
                      <option value="Easypaisa">Easypaisa</option>
                      <option value="JazzCash">JazzCash</option>
                      <option value="Faysal Bank">Faysal Bank</option>
                      <option value="Soneri Bank">Soneri Bank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Transaction ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. CASH-PAID"
                      value={manualTid}
                      onChange={(e) => setManualTid(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowManualBookingModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save & Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD / EDIT BANK ACCOUNT MODAL */}
        {showAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md">
            <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-neutral-900 via-emerald-950/40 to-neutral-900 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {editingAccountId ? 'Edit Payment Account' : 'Add Bank Account / E-Wallet'}
                  </h3>
                  <p className="text-xs text-neutral-400">Available to customers during online booking</p>
                </div>
                <button
                  onClick={() => setShowAccountModal(false)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePaymentAccount} className="p-5 space-y-4">
                {/* Quick Presets */}
                {!editingAccountId && (
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                      Quick Preset / Popular Gateways
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Easypaisa', name: 'Easypaisa', type: 'wallet', branch: 'Gahkuch', instructions: 'Send Rs. 500 advance via Easypaisa App or mobile account.' },
                        { label: 'JazzCash', name: 'JazzCash', type: 'wallet', branch: 'Gahkuch', instructions: 'Send Rs. 500 advance via JazzCash App or *786#.' },
                        { label: 'Raast ID', name: 'Raast Instant ID', type: 'raast', branch: 'Instant P2P', instructions: 'Instant 0-fee transfer from any Pakistani banking app via Raast ID.' },
                        { label: 'Faysal Bank', name: 'Faysal Bank', type: 'bank', branch: 'Behind Faysal Bank, Gahkuch Khari', instructions: 'Transfer Rs. 500 advance to Faysal Bank account.' },
                        { label: 'Soneri Bank', name: 'Soneri Bank', type: 'bank', branch: 'Gahkuch Khari Branch', instructions: 'Transfer Rs. 500 advance to Soneri Bank account.' },
                        { label: 'SadaPay', name: 'SadaPay', type: 'wallet', branch: 'Digital Wallet', instructions: 'Transfer Rs. 500 advance to SadaPay account/IBAN.' },
                        { label: 'NayaPay', name: 'NayaPay', type: 'wallet', branch: 'Digital Wallet', instructions: 'Transfer Rs. 500 advance to NayaPay account.' },
                        { label: 'Meezan Bank', name: 'Meezan Bank', type: 'bank', branch: 'Gahkuch Branch', instructions: 'Transfer Rs. 500 advance to Meezan Bank account.' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setAccName(preset.name);
                            setAccType(preset.type as any);
                            setAccBranch(preset.branch);
                            setAccInstructions(preset.instructions);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-medium text-neutral-300 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          +{preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Gateway / Bank Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meezan Bank / SadaPay / NayaPay"
                    value={accName}
                    onChange={(e) => setAccName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">Type</label>
                    <select
                      value={accType}
                      onChange={(e) => setAccType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                    >
                      <option value="wallet">E-Wallet (Easypaisa / Jazzcash)</option>
                      <option value="bank">Commercial Bank (Faysal, Soneri, etc.)</option>
                      <option value="raast">Raast Instant ID</option>
                      <option value="other">Other Payment Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Account Title <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Irfan Hyder"
                      value={accTitle}
                      onChange={(e) => setAccTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Account Number / Mobile / IBAN <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 03401082265 or PK36FAYS00000..."
                    value={accNumber}
                    onChange={(e) => setAccNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Branch Name / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gahkuch Khari Branch"
                    value={accBranch}
                    onChange={(e) => setAccBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Transfer Instructions for User
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Transfer Rs. 500 advance and upload screenshot with TID..."
                    value={accInstructions}
                    onChange={(e) => setAccInstructions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none"
                  />
                </div>

                {/* Make Default Checkbox */}
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accIsDefault}
                      onChange={(e) => setAccIsDefault(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-700 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        Set as Primary / Default Account
                      </span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Will be pre-selected in checkout and highlighted on the hero screen.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAccountModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {editingAccountId ? 'Save Changes' : 'Add Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
