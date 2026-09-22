import React, { useState } from 'react';
import { GROUND_INFO, GROUND_AMENITIES } from '../data/initialData';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  SunMedium,
  Car,
  Droplets,
  Coffee,
  MessageCircle,
  Zap,
  DollarSign,
  Wallet,
} from 'lucide-react';

export const LocationSection: React.FC = () => {
  const [copiedNumber, setCopiedNumber] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(GROUND_INFO.phone);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      case 'SunMedium':
        return <SunMedium className="w-5 h-5 text-amber-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-300" />;
      case 'Car':
        return <Car className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="location-section" className="py-10 bg-neutral-950 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Turf Ground & Arena Directions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Location Details & Ground Facilities
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Conveniently situated in Gahkuch Khari, Behind Faysal Bank, Near Soneri Bank with dedicated player parking and 24/7 floodlight access.
          </p>
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Address, Hours, Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 space-y-5 shadow-xl">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Official Venue Address
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{GROUND_INFO.name}</h3>
                <p className="text-sm text-neutral-200 mt-1 font-medium leading-relaxed">
                  {GROUND_INFO.address}, {GROUND_INFO.city}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-neutral-400 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <Navigation className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Landmark: Behind Faysal Bank, Near Soneri Bank, Gahkuch Khari</span>
                </div>
              </div>

              {/* Operating Hours & Shifts */}
              <div className="pt-4 border-t border-neutral-800 space-y-2">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                  Ground Timings & Shifts
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-950">
                    <span className="text-neutral-300 font-medium">Morning Shift (5:00 AM - 11:00 AM)</span>
                    <span className="font-mono font-bold text-emerald-400">Rs. 2,000 / hr</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-950">
                    <span className="text-neutral-300 font-medium">Day Timings (12:00 PM - 4:00 PM)</span>
                    <span className="font-mono font-bold text-teal-400">Rs. 2,500 / hr</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-950">
                    <span className="text-neutral-300 font-medium">Night Timings (4:00 PM - 5:00 AM)</span>
                    <span className="font-mono font-bold text-amber-400">Rs. 3,000 / hr</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                    <span className="text-emerald-300 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Prime Hours (8:00 PM - 1:00 AM)
                    </span>
                    <span className="font-mono font-bold text-white">Rs. 3,500 / hr</span>
                  </div>
                </div>
              </div>

              {/* Manager & Inquiries */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                  Ground Management & Booking Assistance
                </span>
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-500">Manager & Account Holder</p>
                      <p className="text-sm font-extrabold text-white">{GROUND_INFO.managerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-neutral-500">Easypaisa / JazzCash</p>
                      <p className="text-sm font-mono font-black text-emerald-400">{GROUND_INFO.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
                    <a
                      href={`tel:${GROUND_INFO.phone}`}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Manager</span>
                    </a>

                    <a
                      href={`https://wa.me/${GROUND_INFO.whatsapp}?text=${encodeURIComponent('Hello Irfan Hyder, I want to book a match slot at Tami Futsal Ground, Gahkuch Khari.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-700/40 hover:bg-emerald-700/60 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                      title="Copy Number"
                    >
                      {copiedNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map Preview & Ground Specifications */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Map Visual */}
            <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-white">Google Maps Location Preview</h3>
                  <p className="text-xs text-neutral-400">Gahkuch Khari, Behind Faysal Bank, Near Soneri Bank</p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Tami Futsal Ground Gahkuch Khari Behind Faysal Bank')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Styled Map Canvas View */}
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                {/* Visual Map Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {/* Pitch Marker */}
                <div className="relative z-10 w-4/5 max-w-sm border-2 border-emerald-500/50 rounded-2xl p-4 bg-emerald-950/40 backdrop-blur-md text-center space-y-2 shadow-2xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-neutral-950 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-base text-white">Tami Futsal Ground</h4>
                  <p className="text-xs text-neutral-200">
                    Gahkuch Khari • Behind Faysal Bank, Near Soneri Bank
                  </p>
                  <div className="pt-1 flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono font-bold">
                    <span>5-a-side / 7-a-side Main Turf Arena</span>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 z-10 text-[10px] bg-neutral-900/90 px-2.5 py-1 rounded-full text-neutral-300 border border-neutral-800 font-mono">
                  GPS Navigation Active
                </div>
              </div>
            </div>

            {/* Single Arena Turf Specifications */}
            <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-white">Arena Turf Specifications</h4>
                  <p className="text-xs text-neutral-400">Professional futsal engineering standards</p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  FIFA Certified Turf
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Dimensions</span>
                  <p className="font-bold text-white text-sm mt-0.5">38m × 20m</p>
                  <p className="text-[11px] text-neutral-400">5v5 & 7v7 format</p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Grass Pile</span>
                  <p className="font-bold text-white text-sm mt-0.5">50mm Monofilament</p>
                  <p className="text-[11px] text-neutral-400">Silica sand & rubber infill</p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Floodlights</span>
                  <p className="font-bold text-white text-sm mt-0.5">800-Lux LED</p>
                  <p className="text-[11px] text-neutral-400">Zero shadow glare</p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Ball & Bibs</span>
                  <p className="font-bold text-emerald-400 text-sm mt-0.5">Included Free</p>
                  <p className="text-[11px] text-neutral-400">2 match balls + bibs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ground Amenities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Turf Amenities & Player Facilities</h3>
            <span className="text-xs text-neutral-400">Everything provided for match night</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GROUND_AMENITIES.map((amenity) => (
              <div
                key={amenity.id}
                className="rounded-2xl bg-neutral-900/70 border border-neutral-800 p-4 space-y-2 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neutral-800/80">
                    {getAmenityIcon(amenity.icon)}
                  </div>
                  <h4 className="font-bold text-sm text-white">{amenity.title}</h4>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed pl-1">
                  {amenity.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ground Rules & Safety Code */}
        <div className="rounded-2xl bg-neutral-900/40 border border-neutral-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Tami Futsal Ground Rules & Footwear Guidelines</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Permitted Footwear:</strong> Turf shoes (multi-stud rubber AG/TF soles) or flat indoor/sneakers. Metal studs or SG cleats are strictly prohibited to preserve turf fibers.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Advance & Reporting:</strong> Rs. 500 advance locks the reservation. Captains must report 15 minutes before scheduled kickoff for kit check-in.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Equipment Provided:</strong> Low-bounce futsal match balls and numbered scrimmage bibs are included in every hourly booking.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>No Smoking / Littering:</strong> Smoking or bringing glass bottles onto the pitch area is strictly forbidden.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
