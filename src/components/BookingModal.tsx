import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { GROUND_INFO, STANDARD_HOURLY_SLOTS, getSlotInfo } from '../data/initialData';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Upload,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  User,
  Users,
  Check,
  Image as ImageIcon,
  Building2,
  Wallet,
  Zap,
  MapPin,
  FileCheck,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    closeBookingModal,
    paymentAccounts,
    selectedDate,
    preselectedSlot,
    addBooking,
    setActiveVoucher,
    isSlotBooked,
  } = useBooking();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Match details state
  const [date, setDate] = useState<string>(selectedDate);
  const [startTime, setStartTime] = useState<string>('20:00');
  const [durationHours, setDurationHours] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [opponentTeam, setOpponentTeam] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Payment state
  const activeAccounts = paymentAccounts.filter((a) => a.isActive);
  const defaultAcc = activeAccounts.find((a) => a.isDefault) || activeAccounts[0];
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    defaultAcc?.id || 'ep-1'
  );
  const [transactionId, setTransactionId] = useState<string>('');
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Sync preselected slot and default account
  useEffect(() => {
    if (preselectedSlot) {
      setDate(preselectedSlot.date);
      setStartTime(preselectedSlot.time);
    } else {
      setDate(selectedDate);
    }

    if (isBookingModalOpen) {
      const active = paymentAccounts.filter((a) => a.isActive);
      const def = active.find((a) => a.isDefault) || active[0];
      if (def && (!selectedAccountId || !active.some((a) => a.id === selectedAccountId))) {
        setSelectedAccountId(def.id);
      }
    }
  }, [preselectedSlot, selectedDate, isBookingModalOpen, paymentAccounts]);

  if (!isBookingModalOpen) return null;

  const selectedAccount = paymentAccounts.find((a) => a.id === selectedAccountId) || paymentAccounts[0] || {
    id: 'ep-1',
    name: 'Easypaisa',
    type: 'wallet',
    accountTitle: GROUND_INFO.managerName,
    accountNumber: GROUND_INFO.phone,
    instructions: 'Send Rs. 500 advance to 03401082265',
    isActive: true,
  };

  // Pricing calculation
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = (startHour + durationHours) % 24;
  const endTime = `${endHour.toString().padStart(2, '0')}:00`;

  const calculateTotal = (): number => {
    let total = 0;
    for (let i = 0; i < durationHours; i++) {
      const h = (startHour + i) % 24;
      const timeStr = `${h.toString().padStart(2, '0')}:00`;
      const { rate } = getSlotInfo(timeStr);
      total += rate;
    }
    return total;
  };

  const totalAmount = calculateTotal();
  const advanceRequired = GROUND_INFO.advanceRequired * durationHours;
  const remainingAtGround = Math.max(0, totalAmount - advanceRequired);
  const currentSlotTier = getSlotInfo(startTime);

  // Handle Screenshot File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 10MB.');
      return;
    }

    setErrorMsg('');
    setScreenshotFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Validation before step 2
  const handleProceedToPayment = () => {
    setErrorMsg('');
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 11-digit phone/WhatsApp number (e.g. 03401082265).');
      return;
    }
    if (!teamName.trim()) {
      setErrorMsg('Please enter your team or squad name.');
      return;
    }

    // Check slot conflict
    const booked = isSlotBooked(date, startTime);
    if (booked) {
      setErrorMsg(`This slot (${startTime}) is already reserved for ${booked.teamName}. Please select another time.`);
      return;
    }

    setStep(2);
  };

  // Validation before confirmation
  const handleProceedToConfirm = () => {
    setErrorMsg('');
    if (!screenshotPreview && !transactionId.trim()) {
      setErrorMsg('Please upload your payment screenshot or provide the Transaction ID (TID) to proceed.');
      return;
    }
    setStep(3);
  };

  // Final Submit
  const handleFinalSubmit = () => {
    const newBooking = addBooking({
      date,
      startTime,
      endTime,
      durationHours,
      customerName,
      customerPhone,
      teamName,
      opponentTeam: opponentTeam.trim() || undefined,
      notes: notes.trim() || undefined,
      totalAmount,
      advanceAmount: advanceRequired,
      remainingAmount: Math.max(0, totalAmount - advanceRequired),
      paidAmount: advanceRequired,
      paymentMethod: selectedAccount.name,
      paymentAccountId: selectedAccount.id,
      transactionId: transactionId.trim() || `TID-${Date.now().toString().slice(-6)}`,
      screenshotImage: screenshotPreview || undefined,
      status: 'pending_verification',
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    closeBookingModal();
    setActiveVoucher(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                Book Tami Futsal Ground
              </h3>
              <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {GROUND_INFO.location}
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-5 py-2.5 bg-neutral-950/60 border-b border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                step >= 1 ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              1
            </span>
            <span className={step >= 1 ? 'text-white font-semibold' : 'text-neutral-500'}>
              Match Details
            </span>
          </div>

          <div className="w-8 h-[1px] bg-neutral-800"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                step >= 2 ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              2
            </span>
            <span className={step >= 2 ? 'text-white font-semibold' : 'text-neutral-500'}>
              Rs. 500 Advance & Slip
            </span>
          </div>

          <div className="w-8 h-[1px] bg-neutral-800"></div>

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                step === 3 ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'text-white font-semibold' : 'text-neutral-500'}>
              Confirm
            </span>
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: MATCH & TEAM DETAILS */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Ground & Pricing Highlight */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Ground Selected
                    </span>
                    <span className="text-[11px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full">
                      5v5 / 7v7 Standard Turf
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base mt-0.5">Tami Futsal Ground</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Behind Faysal Bank, Near Soneri Bank, Gahkuch Khari
                  </p>
                </div>

                <div className="sm:text-right bg-neutral-900/90 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-neutral-800 w-full sm:w-auto">
                  <span className="text-[11px] text-neutral-400 block">Slot Rate</span>
                  <span className="text-lg font-extrabold text-emerald-400 font-mono">
                    Rs. {currentSlotTier.rate.toLocaleString()}
                    <span className="text-xs text-neutral-400 font-normal">/hr</span>
                  </span>
                  <span className="text-[11px] text-neutral-400 block">
                    ({currentSlotTier.categoryLabel})
                  </span>
                </div>
              </div>

              {/* Date & Time Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    Match Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    Kickoff Time
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {STANDARD_HOURLY_SLOTS.map((s) => (
                      <option key={s.start} value={s.start}>
                        {s.start} - {s.end} (Rs. {s.rate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Duration
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDurationHours(1)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        durationHours === 1
                          ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:bg-neutral-800'
                      }`}
                    >
                      1 Hour
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationHours(2)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        durationHours === 2
                          ? 'bg-emerald-500 text-neutral-950 border-emerald-400'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:bg-neutral-800'
                      }`}
                    >
                      2 Hours
                    </button>
                  </div>
                </div>
              </div>

              {/* Player Contact Details */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Captain & Contact Information
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Zubair Shah"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 03401082265"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Your Team / Squad Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Red Devils FC"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">
                      Opponent Team (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Blue Stars / Internal Squad"
                      value={opponentTeam}
                      onChange={(e) => setOpponentTeam(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    Special Notes / Equipment Needs (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Need size 4 match balls, numbered bibs ready"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Match Time: {startTime} - {endTime} ({durationHours} hr)</span>
                  <span className="font-mono text-white">Rs. {totalAmount}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <span>Advance Required Now to Lock Slot:</span>
                  <span className="font-mono font-bold text-sm">Rs. {advanceRequired}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-800">
                  <span>Remaining Balance (Payable at Ground):</span>
                  <span className="font-mono text-amber-400 font-bold">Rs. {remainingAtGround}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ADVANCE PAYMENT & SCREENSHOT UPLOAD */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Advance Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-white text-sm">
                    Rs. 500 Advance Required for Confirmation
                  </p>
                  <p className="text-emerald-200/90 leading-relaxed">
                    To prevent ghost bookings and secure the turf for your squad, please send <strong>Rs. {advanceRequired}</strong> via any bank account or E-wallet below and upload your payment slip screenshot.
                  </p>
                </div>
              </div>

              {/* Select Bank Account / E-Wallet */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Select Payment Account / E-Wallet
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activeAccounts.map((acc) => {
                    const isSelected = acc.id === selectedAccountId;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setSelectedAccountId(acc.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-950/50 border-emerald-400 text-white ring-1 ring-emerald-500 shadow-md'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{acc.name}</span>
                          {acc.type === 'bank' ? (
                            <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                          ) : (
                            <Wallet className="w-3.5 h-3.5 text-neutral-400" />
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-neutral-300 truncate">
                          {acc.accountNumber}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Account Details Box */}
              {selectedAccount && (
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase">
                        {selectedAccount.name}
                      </span>
                      {selectedAccount.bankBranch && (
                        <span className="text-[10px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                          {selectedAccount.bankBranch}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      Advance: Rs. {advanceRequired}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase font-semibold">
                        Account Title
                      </span>
                      <span className="font-bold text-white text-sm">
                        {selectedAccount.accountTitle}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 block text-[10px] uppercase font-semibold">
                          Account / Mobile / IBAN
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedAccount.accountNumber)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          {copiedAccount ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <span className="font-mono font-bold text-white text-sm break-all">
                        {selectedAccount.accountNumber}
                      </span>
                    </div>
                  </div>

                  {selectedAccount.instructions && (
                    <p className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
                      💡 {selectedAccount.instructions}
                    </p>
                  )}
                </div>
              )}

              {/* Upload Screenshot Area */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    Upload Payment Screenshot (Slip) *
                  </span>
                  <span className="text-[11px] text-emerald-400 font-normal">
                    JPG, PNG, WEBP (Max 10MB)
                  </span>
                </label>

                {screenshotPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-neutral-950 p-3 flex items-center gap-4">
                    <img
                      src={screenshotPreview}
                      alt="Receipt preview"
                      className="w-20 h-20 object-cover rounded-xl border border-neutral-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                        <FileCheck className="w-4 h-4" /> Screenshot Attached
                      </div>
                      <p className="text-xs text-neutral-300 font-medium truncate">
                        {screenshotFileName || 'payment_receipt.jpg'}
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Will be reviewed by ground manager Irfan Hyder
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotPreview('');
                        setScreenshotFileName('');
                      }}
                      className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-xl transition-colors shrink-0"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-700 hover:border-emerald-500 rounded-2xl cursor-pointer bg-neutral-950/60 hover:bg-neutral-950 transition-all text-center group">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-emerald-400 group-hover:scale-110 transition-all mb-2">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                      Click or drag to upload payment receipt screenshot
                    </span>
                    <span className="text-[11px] text-neutral-500 mt-1">
                      Upload screenshot from Easypaisa, JazzCash, Faysal Bank, or Soneri Bank app
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Transaction ID / TID (Optional if screenshot uploaded)
                </label>
                <input
                  type="text"
                  placeholder="e.g. EP9847291048 or TRX-384910"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 3: FINAL CONFIRMATION & REVIEW */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-white">Review Booking Summary</h4>
                <p className="text-xs text-neutral-400">
                  Ready to confirm your slot at Tami Futsal Ground
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <span className="text-neutral-400">Ground Location:</span>
                  <span className="font-semibold text-white text-right">
                    {GROUND_INFO.location}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <span className="text-neutral-400">Date & Slot:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    {date} • {startTime} - {endTime}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <span className="text-neutral-400">Team / Captain:</span>
                  <span className="font-semibold text-white">
                    {teamName} ({customerName})
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <span className="text-neutral-400">Total Match Fee:</span>
                  <span className="font-mono text-white font-bold">Rs. {totalAmount}</span>
                </div>

                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                  <span className="text-emerald-400 font-semibold">Advance Submitted:</span>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm">
                    Rs. {advanceRequired} ({selectedAccount.name})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-medium">Balance on Ground:</span>
                  <span className="font-mono text-amber-400 font-bold">
                    Rs. {remainingAtGround}
                  </span>
                </div>
              </div>

              {screenshotPreview && (
                <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 flex items-center gap-3">
                  <img
                    src={screenshotPreview}
                    alt="Slip preview"
                    className="w-12 h-12 object-cover rounded-lg border border-neutral-700"
                  />
                  <div className="text-xs">
                    <span className="text-emerald-400 font-bold block">Payment Slip Ready</span>
                    <span className="text-neutral-400 text-[11px]">
                      Automated push notifications will be sent to you and ground admin.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as 1 | 2)}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={closeBookingModal}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={handleProceedToPayment}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Continue to Advance (Rs. {advanceRequired})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleProceedToConfirm}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Review Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Lock Booking</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
