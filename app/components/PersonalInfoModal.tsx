'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
  Save,
  CheckCircle2,
  Sparkles,
  Gift,
  Coins,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRewardsAction?: () => void;
}

export default function PersonalInfoModal({
  isOpen,
  onClose,
  onOpenRewardsAction,
}: PersonalInfoModalProps) {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isSaved, setIsSaved] = useState(false);

  const rewardPoints = user?.rewardPoints || 0;

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs transition-all duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[460px] bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 transition-all duration-300 transform scale-100 animate-modalPop relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-gray-900 leading-tight truncate">{user.name}</h2>
              <span className="text-[10.5px] bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles size={11} className="text-amber-600" />
                <span>{user.role || 'Gold Member'}</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
          </div>
        </div>

        {/* Quick Link to Rewards & Coupons */}
        {onOpenRewardsAction && (
          <div
            onClick={() => {
              onClose();
              onOpenRewardsAction();
            }}
            className="mt-3.5 p-3 bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                <Coins size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <span>Loyalty Points:</span>
                  <span className="text-emerald-800 font-extrabold font-mono">{rewardPoints} PTS</span>
                </div>
                <p className="text-[10.5px] text-gray-500">Click to view &amp; redeem discount coupons</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-emerald-800 text-xs font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>View</span>
              <ChevronRight size={14} />
            </div>
          </div>
        )}

        {/* Edit Personal Info Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+855 12 345 678"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Street 240, Daun Penh, Phnom Penh"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Member Metadata Info */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" />
              <span>Member Since: {user.joinedDate || 'Sep 2026'}</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck size={13} />
              <span>Verified Account</span>
            </span>
          </div>

          {/* Success message banner */}
          {isSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Personal info updated successfully!</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save size={15} />
            <span>Save Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
}
