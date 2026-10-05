"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Check,
  Receipt,
  X,
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  Truck,
} from "lucide-react";
import { useOrders } from "../context/OrderContext";

export default function FloatingOrderButton() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    cartItems,
    totalCartCount,
    totalCartSubtotal,
    lastAddedItemName,
    orders,
    activeOrders,
    setSelectedOrder,
    updateCartQuantity,
    clearCart,
  } = useOrders();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);

  // Trigger bounce animation when cart count changes
  useEffect(() => {
    if (totalCartCount > 0) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 700);
      return () => clearTimeout(timer);
    }
  }, [totalCartCount]);

  const isOrdersPage = pathname?.toLowerCase() === "/orders";

  const freeDeliveryThreshold = 35;
  const isFreeDelivery = totalCartSubtotal >= freeDeliveryThreshold;
  const progressToFreeDelivery = Math.min(
    100,
    (totalCartSubtotal / freeDeliveryThreshold) * 100
  );
  const neededForFree = Math.max(0, freeDeliveryThreshold - totalCartSubtotal);

  // Do not show floating button when already on /Orders page
  if (isOrdersPage) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <aside
        aria-label="Order summary and quick access"
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 print:hidden pointer-events-auto"
      >
        {/* Dynamic "Just Added" Toast Pill */}
        {lastAddedItemName && (
          <div className="flex items-center gap-2 bg-emerald-950/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-2xl shadow-xl border border-emerald-500/40 animate-slideUp">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
              <Check size={12} />
            </div>
            <span>
              Added <strong>{lastAddedItemName}</strong> to order!
            </span>
          </div>
        )}

        {/* The Main Order Menu Floating Button (Always Active & Clickable) */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className={`group flex items-center gap-3 text-white pl-3.5 pr-4.5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border ${
            totalCartCount > 0
              ? "bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 border-emerald-400/40 shadow-emerald-950/30"
              : "bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 hover:from-emerald-700 hover:to-teal-800 border-emerald-500/30 shadow-black/20"
          } ${animateBadge ? "scale-105 ring-4 ring-emerald-400/50" : ""}`}
          title="Open Order Menu Drawer"
        >
          {/* Order Bag Icon with Count Badge */}
          <div className="relative flex items-center justify-center">
            <div className="w-8.5 h-8.5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <ShoppingBag size={17} />
            </div>
            {/* Amount Number of Items Badge */}
            <span
              className={`absolute -top-1.5 -right-1.5 min-w-[19px] h-4.5 px-1 rounded-full text-[10.5px] font-black flex items-center justify-center shadow-md ${
                totalCartCount > 0
                  ? "bg-amber-400 text-gray-950 animate-bounce"
                  : "bg-emerald-700 text-white"
              }`}
            >
              {totalCartCount}
            </span>
          </div>

          {/* Button Text & Live Bill Amount */}
          <div className="text-left leading-tight">
            <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
              <span>Order Menu</span>
              <span
                className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                  totalCartCount > 0
                    ? "bg-amber-400/25 text-amber-200"
                    : "bg-white/15 text-emerald-200"
                }`}
              >
                {totalCartCount} {totalCartCount === 1 ? "dish" : "dishes"}
              </span>
            </div>
            <div className="text-sm font-black text-white">
              ${totalCartSubtotal.toFixed(2)}
            </div>
          </div>

          {/* Forward Arrow */}
          <div className="w-6.5 h-6.5 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </aside>

      {/* QUICK ORDER SLIDE-OVER DRAWER MODAL */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden border-l border-gray-200">
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 border-b border-emerald-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-gray-950 flex items-center justify-center font-black shadow-md">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-white">Your Order Menu</h2>
                    <span className="bg-emerald-700/80 text-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {totalCartCount} {totalCartCount === 1 ? "dish" : "dishes"}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">
                    Live selection &amp; instant payment review
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body - Scrollable Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Free Delivery Bar */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                {isFreeDelivery ? (
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Sparkles size={15} className="text-emerald-600 shrink-0" />
                    <span>You unlocked <strong>FREE Delivery</strong> on this order! 🎉</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-gray-700 mb-1 font-medium text-[11px]">
                      <span>Add <strong>${neededForFree.toFixed(2)}</strong> for FREE delivery</span>
                      <span className="text-emerald-700 font-bold">{Math.round(progressToFreeDelivery)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-emerald-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                        style={{ width: `${progressToFreeDelivery}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items List */}
              {cartItems.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-2">
                  <ShoppingBag size={40} className="mx-auto text-gray-300" />
                  <p className="text-sm font-semibold text-gray-600">Your order is empty</p>
                  <p className="text-xs text-gray-400">Browse delicious food dishes and add them to your order!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-13 w-13 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                            {item.category}
                          </span>
                          <div className="text-xs font-black text-emerald-800 mt-1">
                            ${(item.price * item.quantity).toFixed(2)}
                            <span className="text-[10px] font-normal text-gray-400 ml-1">
                              (${item.price.toFixed(2)} ea)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Orders Tracker Preview if Any */}
              {activeOrders.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    const orderToTrack = activeOrders[0];
                    if (orderToTrack) {
                      setSelectedOrder(orderToTrack);
                      router.push(`/Orders?tab=detail&id=${orderToTrack.orderNumber || orderToTrack.id}`);
                    } else {
                      router.push("/Orders");
                    }
                  }}
                  className="mt-4 p-3 bg-amber-50 hover:bg-amber-100/90 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs transition-all cursor-pointer group shadow-2xs w-full text-left"
                >
                  <div className="flex items-center gap-2.5 text-amber-900 font-bold">
                    <Truck size={15} className="text-amber-700 shrink-0" />
                    <span>Active Order in Progress</span>
                  </div>
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Track</span>
                    <ChevronRight size={13} />
                  </span>
                </button>
              )}
            </div>

            {/* Drawer Footer - Price & Proceed Button */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-gray-50 border-t border-gray-200 space-y-3">
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900 font-mono">${totalCartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Est. Delivery</span>
                    <span className="font-bold text-emerald-700 font-mono">
                      {isFreeDelivery ? "FREE" : "$3.99"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-gray-900 uppercase">Estimated Total</span>
                  <span className="text-xl font-black text-emerald-800 font-mono">
                    ${(totalCartSubtotal + (isFreeDelivery ? 0 : 3.99)).toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    router.push("/Orders");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Review Order &amp; Payment Bill</span>
                  <ArrowRight size={15} />
                </button>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Clear Order
                  </button>
                  <Link
                    href="/Food"
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    + Add More Dishes
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
