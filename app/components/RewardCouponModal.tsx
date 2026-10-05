'use client';

import React, { useState } from 'react';
import {
  X,
  Gift,
  Coins,
  Copy,
  Check,
  Tag,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Award,
  History,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth, REWARD_COUPON_TIERS, CouponTier } from '../context/AuthContext';

interface RewardCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RewardCouponModal({ isOpen, onClose }: RewardCouponModalProps) {
  const { user, redeemCouponWithPoints } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const rewardPoints = user.rewardPoints || 0;
  const coupons = user.coupons || [];
  const pointHistory = user.pointHistory || [];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeem = (tier: CouponTier) => {
    const res = redeemCouponWithPoints(tier);
    if (res.success) {
      setRedeemSuccess(res.message);
      setTimeout(() => setRedeemSuccess(null), 3500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs transition-all duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[500px] bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 transition-all duration-300 transform scale-100 animate-modalPop relative max-h-[90vh] overflow-y-auto"
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

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
            <Coins size={22} className="text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-gray-900 leading-tight">Rewards &amp; Coupons</h2>
              <span className="text-[10.5px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Loyalty Hub
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Accumulate points on every dish &amp; exchange for discount coupons
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {redeemSuccess && (
          <div className="mt-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{redeemSuccess}</span>
          </div>
        )}

        {/* 1. Points Balance Card */}
        <div className="mt-4 p-4 bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 rounded-2xl text-white shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <Award size={13} />
              <span>Your Accumulated Points</span>
            </span>
            <div className="text-3xl font-black text-amber-300 font-mono mt-0.5 flex items-baseline gap-1.5">
              <span>{rewardPoints}</span>
              <span className="text-xs font-bold text-white/80">PTS</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-200 block uppercase font-medium">Earning Rate</span>
            <span className="text-xs font-extrabold text-white bg-white/10 border border-white/15 px-2.5 py-1 rounded-xl inline-block mt-0.5">
              $10 = 2 pts • $20 = 4 pts • $100 = 20 pts
            </span>
          </div>
        </div>

        {/* 2. Simple How-To Use Guide */}
        <div className="mt-3.5 p-3 bg-gray-50 rounded-2xl border border-gray-200/80 text-[11px] text-gray-700 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-gray-900">
            <Sparkles size={13} className="text-amber-500" />
            <span>How to Earn &amp; Use Coupons:</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 bg-white rounded-xl border border-gray-200/70 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center mx-auto mb-1">
                1
              </span>
              <strong className="block text-[11px] text-gray-900">Order Food</strong>
              <span className="text-[10px] text-gray-500">Earn 2 pts per $10 spent ($5 = 1 pt)</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-gray-200/70 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-black text-[10px] flex items-center justify-center mx-auto mb-1">
                2
              </span>
              <strong className="block text-[11px] text-gray-900">Exchange</strong>
              <span className="text-[10px] text-gray-500">From 150 pts for coupons</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-gray-200/70 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-black text-[10px] flex items-center justify-center mx-auto mb-1">
                3
              </span>
              <strong className="block text-[11px] text-gray-900">Apply Code</strong>
              <span className="text-[10px] text-gray-500">Paste at checkout</span>
            </div>
          </div>
        </div>

        {/* 3. Exchange Points for Discount Coupons */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Gift size={14} className="text-emerald-600" />
              <span>Redeem Discount Coupons</span>
            </h3>
            <span className="text-[11px] text-gray-500">Balance: <strong>{rewardPoints} pts</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {REWARD_COUPON_TIERS.map((tier) => {
              const canAfford = rewardPoints >= tier.pointsCost;
              return (
                <div
                  key={tier.id}
                  className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                    canAfford
                      ? 'bg-gradient-to-b from-white to-emerald-50/30 border-emerald-200 hover:border-emerald-400 hover:shadow-xs'
                      : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div>
                      <div className="text-xs font-bold text-gray-900">{tier.title}</div>
                      <span className="text-[10px] text-gray-500 font-mono">Code: {tier.code}</span>
                    </div>
                    <span className="text-[9.5px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                      {tier.badge}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
                    <span className="text-xs font-black text-emerald-900 font-mono">
                      {tier.pointsCost} <span className="text-[10px] font-medium text-gray-500">pts</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRedeem(tier)}
                      disabled={!canAfford}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem' : `Need ${tier.pointsCost - rewardPoints} pts`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. My Claimed Coupons (Ready to use) */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={14} className="text-emerald-600" />
              <span>My Active Coupons ({coupons.length})</span>
            </h3>
            <span className="text-[10.5px] text-emerald-700 font-semibold">
              Copy &amp; apply at checkout
            </span>
          </div>

          {coupons.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-2xl text-center text-xs text-gray-400 border border-dashed border-gray-200">
              No coupons yet. Click "Redeem" above to exchange points for vouchers!
            </div>
          ) : (
            <div className="space-y-2">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 ${
                    coupon.isUsed
                      ? 'bg-gray-50 border-gray-200 opacity-50'
                      : 'bg-emerald-50/60 border-emerald-200/90'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-xs text-gray-900 bg-white px-2 py-0.5 rounded-lg border border-gray-200 shadow-2xs">
                        {coupon.code}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-800">
                        {coupon.discountPercent}% OFF
                      </span>
                      <span
                        className={`text-[9.5px] px-2 py-0.2 rounded-full font-bold ${
                          coupon.isUsed
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {coupon.isUsed ? 'Redeemed' : 'Active'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 truncate">{coupon.title}</p>
                  </div>

                  {!coupon.isUsed && (
                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer shrink-0"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Points History */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2">
          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <History size={14} className="text-emerald-600" />
            <span>Points Activity</span>
          </h3>

          {pointHistory.length === 0 ? (
            <div className="p-3 bg-gray-50 rounded-2xl text-center text-xs text-gray-400 border border-dashed border-gray-200">
              0 points accumulated. Place an order to earn 2 pts per $10 spent!
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white text-xs divide-y divide-gray-100 max-h-32 overflow-y-auto">
              {pointHistory.map((item) => (
                <div key={item.id} className="p-2 px-3 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-gray-800 text-[11px] block truncate">{item.title}</span>
                    <span className="text-[10px] text-gray-400">{item.date}</span>
                  </div>
                  <span
                    className={`font-mono font-black text-xs shrink-0 ${
                      item.points > 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {item.points > 0 ? `+${item.points}` : `${item.points}`} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Order Button */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            Close
          </button>

          <Link
            href="/Food"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <ShoppingBag size={13} />
            <span>Order Food &amp; Earn Points</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
