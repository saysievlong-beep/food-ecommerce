"use client";

import { useState, useEffect, useRef } from "react";
import { Zap, Flame, Clock, Star, Plus, Check, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export type FlashSaleItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviews: number;
  description: string;
  imageUrl: string;
  soldCount: number;
  totalStock: number;
  badge?: string;
  prepTime?: string;
};

export const DEFAULT_FLASH_SALE_ITEMS: FlashSaleItem[] = [
  {
    id: "fs-1",
    name: "Truffle Ribeye Steak Deluxe",
    category: "Gourmet Steak",
    price: 26.99,
    originalPrice: 42.0,
    discountPercent: 35,
    rating: 4.9,
    reviews: 142,
    description: "USDA Prime 300g ribeye seared with black truffle butter, grilled asparagus, and red wine demi-glace.",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
    soldCount: 38,
    totalStock: 50,
    badge: "Hot Deal",
    prepTime: "20 min",
  },
  {
    id: "fs-2",
    name: "Crispy Korean Fried Chicken Platter",
    category: "Asian Street Food",
    price: 15.5,
    originalPrice: 26.0,
    discountPercent: 40,
    rating: 4.9,
    reviews: 189,
    description: "Ultra-crispy double-fried chicken coated in sweet & spicy gochujang glaze with toasted sesame and pickled radish.",
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    soldCount: 72,
    totalStock: 80,
    badge: "Selling Fast",
    prepTime: "15 min",
  },
  {
    id: "fs-3",
    name: "Smoked Salmon & Caviar Bagel Set",
    category: "Signature Brunch",
    price: 13.9,
    originalPrice: 22.0,
    discountPercent: 36,
    rating: 4.8,
    reviews: 97,
    description: "Toasted everything bagel topped with cream cheese, wild Alaskan smoked salmon, lumpfish caviar, and capers.",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    soldCount: 29,
    totalStock: 35,
    badge: "Flash Deal",
    prepTime: "10 min",
  },
  {
    id: "fs-4",
    name: "Molten Lava Chocolate Soufflé",
    category: "Artisan Dessert",
    price: 7.99,
    originalPrice: 14.5,
    discountPercent: 45,
    rating: 4.9,
    reviews: 215,
    description: "Rich 70% Valrhona dark chocolate lava center, Madagascan vanilla bean gelato, and raspberry coulis.",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    soldCount: 44,
    totalStock: 50,
    badge: "50% OFF",
    prepTime: "12 min",
  },
];

const PROMOTION_CYCLE_MS = 5 * 60 * 60 * 1000; // 5 hour continuous promotion cycle
const STORAGE_TIMER_KEY = "tastybyte_flash_sale_end_timestamp_v2";

function getOrInitEndTime(): number {
  if (typeof window === "undefined") {
    return Date.now() + PROMOTION_CYCLE_MS;
  }
  try {
    const stored = localStorage.getItem(STORAGE_TIMER_KEY);
    const now = Date.now();
    if (stored) {
      const parsedTime = parseInt(stored, 10);
      if (!isNaN(parsedTime) && parsedTime > now) {
        return parsedTime;
      }
    }
    // Set continuous 5-hour target
    const newTarget = now + PROMOTION_CYCLE_MS;
    localStorage.setItem(STORAGE_TIMER_KEY, String(newTarget));
    return newTarget;
  } catch {
    return Date.now() + PROMOTION_CYCLE_MS;
  }
}

function calculateTimeRemaining(targetTime: number) {
  const now = Date.now();
  const diff = Math.max(0, targetTime - now);
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds, isExpired: diff <= 0 };
}

export function FlashSaleCard({
  item,
  index = 0,
  isVisible = true,
}: {
  item: FlashSaleItem;
  index?: number;
  isVisible?: boolean;
}) {
  const { requireAuth } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const percentClaimed = Math.min(100, Math.round((item.soldCount / item.totalStock) * 100));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(() => {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }, `Please log in to grab flash deal for ${item.name}.`);
  };

  return (
    <div
      style={{
        transitionDelay: `${index * 60}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-rose-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-rose-300 opacity-100 translate-y-0"
    >
      {/* Media Image */}
      <div className="relative h-48 w-full overflow-hidden bg-rose-50/50">
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {/* Discount Badge & Heart */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-600 to-red-500 px-2.5 py-1 text-xs font-extrabold text-white shadow-md">
              <Zap size={12} className="fill-amber-300 text-amber-300" />
              -{item.discountPercent}%
            </span>
            {item.badge && (
              <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
                {item.badge}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 shadow-sm ${
              isLiked
                ? "bg-rose-500 text-white"
                : "bg-white/85 text-gray-700 hover:bg-white hover:text-rose-500"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart
              size={14}
              className={isLiked ? "fill-white text-white" : ""}
            />
          </button>
        </div>

        {/* Category & Prep Time */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/95 font-medium z-10 pointer-events-none">
          <span className="backdrop-blur-sm bg-black/40 px-2 py-0.5 rounded-md">
            {item.category}
          </span>
          {item.prepTime && (
            <span className="backdrop-blur-sm bg-black/40 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Clock size={11} className="text-amber-300" />
              {item.prepTime}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 text-xs text-amber-500 mb-1">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-gray-800">{item.rating.toFixed(1)}</span>
          <span className="text-gray-400 font-normal">({item.reviews} reviews)</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Stock Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1">
            <span className="flex items-center gap-1 text-rose-600">
              <Flame size={12} className="fill-rose-500 text-rose-500" />
              Claimed: {item.soldCount}/{item.totalStock}
            </span>
            <span className="text-gray-400">{percentClaimed}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 transition-all duration-700"
              style={{ width: `${percentClaimed}%` }}
            />
          </div>
        </div>

        {/* Footer: Price & Add to Cart */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-rose-600">
                ${item.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ${item.originalPrice.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600">
              Save ${(item.originalPrice - item.price).toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs cursor-pointer ${
              isAdded
                ? "bg-rose-600 text-white shadow-rose-200"
                : "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check size={14} className="stroke-[3]" />
                <span>Grabbed!</span>
              </>
            ) : (
              <>
                <Plus size={14} className="stroke-[2.5]" />
                <span>Grab Deal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FlashSale({
  title = "⚡ Flash Sale Super Deals",
  subtitle = "Limited time discounts on our highest-rated signature culinary specialties. Hurry before stocks run out!",
  items = DEFAULT_FLASH_SALE_ITEMS,
}: {
  title?: string;
  subtitle?: string;
  items?: FlashSaleItem[];
}) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 59,
    seconds: 36,
  });

  // Persistent countdown: sync with real time and continue across page reloads/visits
  useEffect(() => {
    let targetTime = getOrInitEndTime();

    const updateTimer = () => {
      const remaining = calculateTimeRemaining(targetTime);
      if (remaining.isExpired) {
        // Automatically roll over to the next round of flash sale promotions
        targetTime = Date.now() + PROMOTION_CYCLE_MS;
        try {
          localStorage.setItem(STORAGE_TIMER_KEY, String(targetTime));
        } catch {}
        setTimeLeft(calculateTimeRemaining(targetTime));
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section
      id="flash-sale"
      className="py-12 bg-gradient-to-b from-rose-50/40 via-white to-slate-50 border-t border-rose-100/70 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Persistent Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 transition-all duration-300">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200 mb-2">
              <Flame size={14} className="fill-rose-600 text-rose-600 animate-bounce" />
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* Live Continuous Countdown Box */}
          <div className="flex items-center gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-rose-200/90 shadow-sm self-start md:self-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 mr-1">
              <Clock size={16} className="animate-spin" style={{ animationDuration: "10s" }} />
              <span className="hidden sm:inline">ENDS IN:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col items-center">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-red-600 text-base sm:text-lg font-black text-white shadow-sm">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400 mt-0.5">Hours</span>
              </div>
              <span className="text-lg font-black text-rose-500 pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-red-600 text-base sm:text-lg font-black text-white shadow-sm">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400 mt-0.5">Mins</span>
              </div>
              <span className="text-lg font-black text-rose-500 pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-red-600 text-base sm:text-lg font-black text-white shadow-sm">
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400 mt-0.5">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid of Flash Sale Cards (Instantly Loaded & Visible) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <FlashSaleCard
              key={item.id}
              item={item}
              index={index}
              isVisible={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
