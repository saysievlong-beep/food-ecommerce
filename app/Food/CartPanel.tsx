"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Tag,
  Clock,
  ShieldCheck,
  User,
  Receipt,
  ExternalLink,
  FileText,
  Gift,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders, Order, calculateItemRewardPoints, calculateRewardPoints } from "../context/OrderContext";

export type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  rewardPoints?: number;
  categoryId?: string;
};

export type CartPanelProps = {
  items: CartItem[];
  isOpen?: boolean;
  onCloseAction?: () => void;
  onUpdateQuantityAction: (id: string, newQty: number) => void;
  onRemoveItemAction: (id: string) => void;
  onClearCartAction: () => void;
  isFloatingDrawer?: boolean;
};

export default function CartPanel({
  items,
  isOpen = true,
  onCloseAction,
  onUpdateQuantityAction,
  onRemoveItemAction,
  onClearCartAction,
  isFloatingDrawer = false,
}: CartPanelProps) {
  const router = useRouter();
  const { requireAuth, user, isLoggedIn, getNewUserCouponStatus, markCouponUsed } = useAuth();
  const { placeOrder, orders } = useOrders();
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<Order | null>(null);

  const couponStatus = getNewUserCouponStatus();

  // Calculations
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const freeDeliveryThreshold = 35;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || items.length === 0;
  const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : 3.99;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08; // 8% tax
  const total = taxableAmount + deliveryFee + tax;
  const progressToFreeDelivery = Math.min(
    100,
    (subtotal / freeDeliveryThreshold) * 100
  );
  const amountNeededForFreeDelivery = Math.max(
    0,
    freeDeliveryThreshold - subtotal
  );

  const handleApplyWelcomeCoupon = () => {
    setPromoError("");
    if (!isLoggedIn) {
      requireAuth(() => { }, "Sign in to use your 10% welcome coupon.");
      return;
    }

    if (couponStatus.isUsed) {
      setPromoError("This 10% welcome coupon has already been redeemed.");
      return;
    }

    if (couponStatus.isExpired) {
      setPromoError("This 10% coupon has expired (Valid only for 3 days after sign up).");
      return;
    }

    setDiscountPercent(10);
    setPromoApplied("WELCOME10 (10% OFF - New User Special)");
    setPromoCode("");
  };

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter your coupon code.");
      return;
    }

    if (!isLoggedIn) {
      requireAuth(() => { }, "Sign in to use your discount coupon.");
      return;
    }

    if (code === "WELCOME10" || code === "NEWUSER10") {
      if (couponStatus.isUsed) {
        setPromoError("This 10% welcome coupon has already been redeemed.");
        return;
      }
      if (couponStatus.isExpired) {
        setPromoError("This 10% coupon has expired (Valid only for 3 days after sign up).");
        return;
      }
      setDiscountPercent(10);
      setPromoApplied("WELCOME10 (10% OFF - New User Special)");
      setPromoCode("");
      return;
    }

    // Check user's claimed/redeemed coupons from profile
    const matchedCoupon = user?.coupons?.find(
      (c) => c.code.toUpperCase() === code || code.startsWith(c.code.toUpperCase())
    );

    if (matchedCoupon) {
      if (matchedCoupon.isUsed) {
        setPromoError(`Coupon "${matchedCoupon.code}" has already been redeemed.`);
        return;
      }
      const isExpired = new Date(matchedCoupon.expiresAt).getTime() < Date.now();
      if (isExpired) {
        setPromoError(`Coupon "${matchedCoupon.code}" has expired.`);
        return;
      }
      setDiscountPercent(matchedCoupon.discountPercent);
      setPromoApplied(`${matchedCoupon.code} (${matchedCoupon.discountPercent}% OFF)`);
      setPromoCode("");
      return;
    }

    // Support reward voucher prefix codes
    if (code === "POINTS10" || code.startsWith("POINTS10")) {
      setDiscountPercent(10);
      setPromoApplied(`${code} (10% OFF Points Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "POINTS15" || code.startsWith("POINTS15")) {
      setDiscountPercent(15);
      setPromoApplied(`${code} (15% OFF Points Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "REWARD20" || code.startsWith("REWARD20")) {
      setDiscountPercent(20);
      setPromoApplied(`${code} (20% OFF Points Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "VIP25" || code.startsWith("VIP25")) {
      setDiscountPercent(25);
      setPromoApplied(`${code} (25% OFF VIP Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "CHEF30" || code.startsWith("CHEF30")) {
      setDiscountPercent(30);
      setPromoApplied(`${code} (30% OFF Chef Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "FEAST40" || code.startsWith("FEAST40")) {
      setDiscountPercent(40);
      setPromoApplied(`${code} (40% OFF Gourmet Deluxe)`);
      setPromoCode("");
      return;
    }
    if (code === "VIP50" || code.startsWith("VIP50")) {
      setDiscountPercent(50);
      setPromoApplied(`${code} (50% OFF VIP Half-Price)`);
      setPromoCode("");
      return;
    }
    if (code === "ULTRA70" || code.startsWith("ULTRA70")) {
      setDiscountPercent(70);
      setPromoApplied(`${code} (70% OFF Grand Master Feast)`);
      setPromoCode("");
      return;
    }

    setPromoError("Invalid or expired coupon code.");
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    requireAuth(() => {
      setIsCheckingOut(true);
      setTimeout(() => {
        const orderResult = placeOrder(
          items,
          {
            subtotal,
            discountPercent,
            discountAmount,
            promoApplied: promoApplied || undefined,
            deliveryFee,
            tax,
            total,
            paymentMethod: "Credit Card (Visa •••• 4242)",
            paymentStatus: "Paid",
          },
          {
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            address: user?.address,
          }
        );

        // Mark applied coupon as redeemed
        if (promoApplied) {
          const appliedCode = promoApplied.split(" ")[0];
          markCouponUsed(appliedCode);
        }

        setPlacedOrderInfo(orderResult);
        setIsCheckingOut(false);
        setOrderComplete(true);
      }, 1400);
    }, "Please sign in to confirm and place your order.");
  };

  const handleResetAfterOrder = () => {
    setOrderComplete(false);
    setPlacedOrderInfo(null);
    onClearCartAction();
    if (onCloseAction) onCloseAction();
  };

  const handleGoToOrderBill = () => {
    if (onCloseAction) onCloseAction();
    if (placedOrderInfo) {
      router.push(`/Orders?id=${placedOrderInfo.orderNumber}`);
    } else {
      router.push("/Orders");
    }
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden ${isFloatingDrawer ? "h-full max-h-[92vh]" : "h-full"
        }`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 to-teal-50/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <ShoppingBag size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-none">
              Your Order
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {totalCount} {totalCount === 1 ? "item" : "items"} selected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {items.length > 0 && (
            <button
              onClick={onClearCartAction}
              className="text-xs text-gray-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors font-medium"
              title="Clear all items"
            >
              Clear
            </button>
          )}

          {onCloseAction && (
            <button
              onClick={onCloseAction}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Free Delivery Bar */}
      {items.length > 0 && (
        <div className="px-5 py-2.5 bg-emerald-50/60 border-b border-emerald-100/80 text-xs">
          {isFreeDelivery ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <Sparkles size={14} className="text-emerald-600 shrink-0" />
              <span>🎉 You unlocked <strong>FREE Delivery</strong>!</span>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-gray-700 mb-1 font-medium">
                <span>Add <strong>${amountNeededForFreeDelivery.toFixed(2)}</strong> for FREE delivery</span>
                <span className="text-emerald-700 font-bold">{Math.round(progressToFreeDelivery)}%</span>
              </div>
              <div className="h-1.5 w-full bg-emerald-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressToFreeDelivery}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cart Content */}
      {orderComplete ? (
        /* Order Success State with Direct Link to Order & Bill Details */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3 animate-bounce shadow-xs">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
            Order Placed Successfully!
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            Your delicious food is being prepared by our chefs and will arrive fresh in 25-35 minutes.
          </p>

          {/* Order Summary Pill */}
          <div className="mt-3.5 p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 w-full text-xs text-left space-y-1.5 shadow-2xs">
            <div className="flex justify-between items-center pb-1.5 border-b border-emerald-200/60">
              <span className="text-gray-600 font-medium">Order Reference:</span>
              <span className="font-extrabold text-emerald-900 bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                #{placedOrderInfo?.orderNumber || "TB-ORDER"}
              </span>
            </div>
            {user && (
              <div className="flex justify-between items-center py-0.5 text-gray-600">
                <span>Customer:</span>
                <span className="font-bold text-gray-900 flex items-center gap-1">
                  <User size={12} className="text-emerald-600" />
                  <span>{user.name}</span>
                </span>
              </div>
            )}
            <div className="flex justify-between py-0.5 text-gray-600">
              <span>Delivery Status:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <Clock size={12} />
                <span>Preparing in Kitchen</span>
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-emerald-200/60 text-gray-700">
              <span className="font-bold">Total Bill Paid:</span>
              <span className="font-black text-emerald-800 text-sm">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* PRIMARY CTA: Link to Order & Bill Details */}
          <button
            type="button"
            onClick={handleGoToOrderBill}
            className="mt-4 w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Receipt size={15} />
            <span>View Order Details &amp; Payment Bill</span>
            <ArrowRight size={14} />
          </button>

          {/* Secondary Action: Order more */}
          <button
            type="button"
            onClick={handleResetAfterOrder}
            className="mt-2 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Order More Dishes
          </button>
        </div>
      ) : items.length === 0 ? (
        /* Empty Cart State */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-3 border border-dashed border-gray-200">
            <ShoppingBag size={28} />
          </div>
          <h4 className="text-sm font-bold text-gray-800">Your cart is empty</h4>
          <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
            Click &quot;Add&quot; on any delicious dish from the menu to start your order!
          </p>

          {/* Quick link to past orders if user has any */}
          {orders.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (onCloseAction) onCloseAction();
                router.push("/Orders");
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all"
            >
              <Receipt size={13} />
              <span>View Past Orders &amp; Bills ({orders.length})</span>
            </button>
          )}
        </div>
      ) : (
        /* Items List */
        <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-gray-100">
          {items.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-center gap-3 group transition-colors"
            >
              {/* Picture Thumbnail */}
              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                  {item.name}
                </h4>
                <div className="text-[11px] text-gray-400 font-medium">
                  ${item.price.toFixed(2)} each
                </div>

                {/* Subtotal and points for item */}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-extrabold text-emerald-700">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  {(() => {
                    const itemPoints = item.rewardPoints !== undefined
                      ? item.rewardPoints * item.quantity
                      : calculateRewardPoints(item.price * item.quantity);
                    if (itemPoints <= 0) return null;
                    return (
                      <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-md border inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-800 border-emerald-200">
                        +{itemPoints} pts
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/80 rounded-xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateQuantityAction(item.id, item.quantity - 1)}
                  className="h-6 w-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                </button>

                <span className="w-5 text-center text-xs font-bold text-gray-800">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => onUpdateQuantityAction(item.id, item.quantity + 1)}
                  className="h-6 w-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bill & Summary Footer (When cart has items and not in order complete state) */}
      {items.length > 0 && !orderComplete && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex flex-col gap-3 shrink-0">

          {/* 1-Click New User 10% Welcome Coupon Card */}
          {couponStatus.isValid && !promoApplied && (
            <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Gift size={14} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-emerald-950">10% OFF Welcome Coupon</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded-full font-bold">
                      {couponStatus.remainingText}
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-700 truncate">
                    Special gift for new users (Valid for 3 days)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyWelcomeCoupon}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11px] font-bold rounded-xl shadow-2xs transition-all shrink-0 cursor-pointer"
              >
                Apply 10%
              </button>
            </div>
          )}

          {/* Promo code accordion / input */}
          <div>
            {promoApplied ? (
              <div className="flex items-center justify-between bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs text-emerald-800 font-medium">
                <div className="flex items-center gap-1.5">
                  <Tag size={13} className="text-emerald-700" />
                  <span>Coupon: <strong>{promoApplied}</strong></span>
                </div>
                <button
                  onClick={() => {
                    setDiscountPercent(0);
                    setPromoApplied("");
                  }}
                  className="text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <Tag size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Coupon code (WELCOME10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    className="w-full pl-7 pr-2 py-1.5 text-xs bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase placeholder:normal-case placeholder-gray-400 text-gray-800 font-medium"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
            )}
            {promoError && (
              <p className="text-[11px] text-rose-500 mt-1 pl-1">{promoError}</p>
            )}
          </div>

          {/* Price Calculation Breakdown */}
          <div className="space-y-1.5 text-xs text-gray-600 pt-1">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span>Delivery Fee</span>
              {isFreeDelivery ? (
                <span className="text-emerald-700 font-bold uppercase text-[11px] bg-emerald-100 px-1.5 py-0.5 rounded-md">
                  FREE
                </span>
              ) : (
                <span className="font-semibold text-gray-900">${deliveryFee.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-extrabold text-gray-900 block">Total Amount</span>
                <span className="text-[10px] text-gray-400 font-normal">Including all taxes &amp; fees</span>
              </div>
              <span className="text-xl font-black text-emerald-700 font-mono">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Earned Points Info */}
            <div className="flex items-center justify-between text-[11px] bg-gradient-to-r from-amber-50 to-emerald-50 px-2.5 py-1.5 rounded-xl border border-amber-200/60 text-amber-900 font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles size={12} className="text-amber-600" />
                <span>Points Earned:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] text-amber-700 font-normal hidden sm:inline">
                  ($10 = 2 pts • $5 = 1 pt)
                </span>
                <span className="font-mono font-black text-amber-900 bg-amber-100/80 px-1.5 py-0.5 rounded-md border border-amber-200">
                  +{calculateRewardPoints(subtotal)} pts
                </span>
              </div>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            type="button"
            disabled={isCheckingOut}
            onClick={handleCheckout}
            className="w-full mt-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            {isCheckingOut ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Order...</span>
              </div>
            ) : (
              <>
                <span>Place Order • ${total.toFixed(2)}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1 text-[10.5px] text-gray-400 text-center">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Guaranteed secure payment & fresh delivery</span>
          </div>
        </div>
      )}
    </div>
  );
}
