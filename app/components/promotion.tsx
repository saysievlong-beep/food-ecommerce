"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Percent,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Heart,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export interface DiscountMenuItem {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  couponCode: string;
  rating: number;
  reviewsCount: number;
  discountBadge: string;
  imageSrc: string;
  description: string;
  prepTime: string;
  calories: number;
  stockLeft: number;
  isSuperDeal?: boolean;
}

export const DISCOUNT_MENU_ITEMS: DiscountMenuItem[] = [
  {
    id: "disc-1",
    title: "16-Hr Smoked Texas BBQ Brisket Platter",
    category: "BBQ & Roasts",
    categoryId: "bbq",
    originalPrice: 28.0,
    discountPrice: 14.99,
    discountPercent: 46,
    couponCode: "TEXAS46",
    rating: 4.9,
    reviewsCount: 184,
    discountBadge: "46% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    description:
      "Tender 16-hour hickory smoked prime beef brisket, tangy Texas BBQ glaze, grilled sweet corn, and house pickled jalapeños.",
    prepTime: "20 min",
    calories: 890,
    stockLeft: 6,
    isSuperDeal: true,
  },
  {
    id: "disc-2",
    title: "Maine Lobster & Blue Crab Truffle Mac",
    category: "Seafood & Shellfish",
    categoryId: "seafood",
    originalPrice: 29.5,
    discountPrice: 15.5,
    discountPercent: 47,
    couponCode: "LOBSTER47",
    rating: 4.9,
    reviewsCount: 142,
    discountBadge: "47% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
    description:
      "Succulent butter-poached Maine lobster chunks, lump blue crab, four-cheese béchamel, and crispy golden herb breadcrumbs.",
    prepTime: "18 min",
    calories: 760,
    stockLeft: 8,
    isSuperDeal: true,
  },
  {
    id: "disc-3",
    title: "Charcoal Greek Lamb Souvlaki Skewers",
    category: "BBQ & Roasts",
    categoryId: "bbq",
    originalPrice: 22.0,
    discountPrice: 11.99,
    discountPercent: 45,
    couponCode: "GREEK45",
    rating: 4.8,
    reviewsCount: 96,
    discountBadge: "45% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    description:
      "Marinated grilled lamb tenderloin skewers, creamy cucumber dill tzatziki, warm garlic flatbread, and seasoned oregano fries.",
    prepTime: "15 min",
    calories: 620,
    stockLeft: 11,
  },
  {
    id: "disc-4",
    title: "Crispy Golden Calamari Fritti Basket",
    category: "Seafood & Shellfish",
    categoryId: "seafood",
    originalPrice: 18.5,
    discountPrice: 9.99,
    discountPercent: 46,
    couponCode: "CALAMARI46",
    rating: 4.8,
    reviewsCount: 128,
    discountBadge: "46% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    description:
      "Flash-fried wild tender squid rings, charred Amalfi lemon wedges, fresh parsley, and smoked paprika garlic aioli dip.",
    prepTime: "10 min",
    calories: 440,
    stockLeft: 9,
  },
  {
    id: "disc-5",
    title: "Slow-Roasted Pork Belly Lotus Bao Buns",
    category: "BBQ & Roasts",
    categoryId: "bbq",
    originalPrice: 17.5,
    discountPrice: 8.99,
    discountPercent: 48,
    couponCode: "BAOBUN48",
    rating: 4.9,
    reviewsCount: 165,
    discountBadge: "48% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    description:
      "Three steamed fluffy bao buns filled with crispy crackling pork belly, sweet hoisin glaze, crushed peanuts, and scallions.",
    prepTime: "12 min",
    calories: 590,
    stockLeft: 14,
    isSuperDeal: true,
  },
  {
    id: "disc-6",
    title: "Makhani Butter Chicken & Tandoori Naan",
    category: "Pasta & Curries",
    categoryId: "pasta",
    originalPrice: 20.0,
    discountPrice: 10.99,
    discountPercent: 45,
    couponCode: "CURRY45",
    rating: 4.9,
    reviewsCount: 198,
    discountBadge: "45% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    description:
      "Tender grilled chicken thigh in silky spiced tomato-fenugreek butter sauce, aromatic saffron basmati rice, and hot garlic naan.",
    prepTime: "15 min",
    calories: 740,
    stockLeft: 10,
  },
  {
    id: "disc-7",
    title: "Artisanal Burrata Stuffed Truffle Gnocchi",
    category: "Pasta & Curries",
    categoryId: "pasta",
    originalPrice: 19.5,
    discountPrice: 10.5,
    discountPercent: 46,
    couponCode: "GNOCCHI46",
    rating: 4.8,
    reviewsCount: 112,
    discountBadge: "46% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    description:
      "Handcrafted Italian potato gnocchi stuffed with creamy pugliese burrata, brown butter sage emulsion, and toasted hazelnuts.",
    prepTime: "14 min",
    calories: 580,
    stockLeft: 7,
  },
  {
    id: "disc-8",
    title: "Pan-Seared Duck Breast & Black Cherry Glaze",
    category: "BBQ & Roasts",
    categoryId: "bbq",
    originalPrice: 27.0,
    discountPrice: 14.5,
    discountPercent: 46,
    couponCode: "DUCK46",
    rating: 4.9,
    reviewsCount: 84,
    discountBadge: "46% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1514944298352-78d12b07e59b?auto=format&fit=crop&w=800&q=80",
    description:
      "Crispy skin French duck breast, tart wild cherry port reduction, velvety parsnip puree, and butter-braised baby carrots.",
    prepTime: "22 min",
    calories: 610,
    stockLeft: 5,
    isSuperDeal: true,
  },
  {
    id: "disc-9",
    title: "Cinnamon Sugar Churros & Dark Chocolate Fondue",
    category: "Churros & Waffles",
    categoryId: "desserts",
    originalPrice: 12.0,
    discountPrice: 5.99,
    discountPercent: 50,
    couponCode: "CHURRO50",
    rating: 4.9,
    reviewsCount: 245,
    discountBadge: "50% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=800&q=80",
    description:
      "Golden crispy Spanish churros dusted in Saigon cinnamon and sugar, served with warm 70% Callebaut dark chocolate pot.",
    prepTime: "8 min",
    calories: 420,
    stockLeft: 15,
    isSuperDeal: true,
  },
  {
    id: "disc-10",
    title: "Salted Caramel Biscoff Belgian Waffle Tower",
    category: "Churros & Waffles",
    categoryId: "desserts",
    originalPrice: 13.5,
    discountPrice: 6.75,
    discountPercent: 50,
    couponCode: "WAFFLE50",
    rating: 4.8,
    reviewsCount: 160,
    discountBadge: "50% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80",
    description:
      "Thick Belgian sugar-pearl waffle stacked high with Lotus Biscoff butter spread, sea-salt caramel drizzle, and clotted cream.",
    prepTime: "10 min",
    calories: 640,
    stockLeft: 12,
    isSuperDeal: true,
  },
  {
    id: "disc-11",
    title: "Iced Blue Lagoon Coconut Cloud Mocktail",
    category: "Signature Craft Sips",
    categoryId: "drinks",
    originalPrice: 9.0,
    discountPrice: 4.5,
    discountPercent: 50,
    couponCode: "LAGOON50",
    rating: 4.8,
    reviewsCount: 89,
    discountBadge: "50% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    description:
      "Sparkling blue spirulina citrus soda layered with frothy organic coconut cream cloud, fresh pineapple essence, and lime.",
    prepTime: "4 min",
    calories: 130,
    stockLeft: 20,
    isSuperDeal: true,
  },
  {
    id: "disc-12",
    title: "Velvety Maine Lobster Bisque & Herb Croutons",
    category: "Seafood & Shellfish",
    categoryId: "seafood",
    originalPrice: 16.5,
    discountPrice: 8.5,
    discountPercent: 48,
    couponCode: "BISQUE48",
    rating: 4.9,
    reviewsCount: 118,
    discountBadge: "48% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    description:
      "Silky slow-simmered Maine lobster and cognac broth, sweet cream swirl, fresh tarragon oil, and sourdough garlic crostini.",
    prepTime: "8 min",
    calories: 360,
    stockLeft: 9,
  },
  {
    id: "disc-13",
    title: "Smoked Bacon & Sharp Cheddar Smash Burger",
    category: "BBQ & Roasts",
    categoryId: "bbq",
    originalPrice: 18.0,
    discountPrice: 9.99,
    discountPercent: 44,
    couponCode: "BURGER44",
    rating: 4.9,
    reviewsCount: 156,
    discountBadge: "44% OFF",
    imageSrc:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description:
      "Crispy applewood smoked bacon, dual melted cheddar, caramelized onions, and house burger relish on brioche.",
    prepTime: "12 min",
    calories: 780,
    stockLeft: 10,
  },
];

const DISCOUNT_CATEGORIES = [
  { id: "all", label: "🔥 All Exclusive Deals" },
  { id: "bbq", label: "🍖 BBQ & Roasts" },
  { id: "seafood", label: "🦞 Seafood & Shellfish" },
  { id: "pasta", label: "🍝 Gnocchi & Curries" },
  { id: "desserts", label: "🧇 Churros & Waffles" },
  { id: "drinks", label: "🍹 Signature Sips" },
];

/* ========================================================================= */
/* 1. FRONT SPOTLIGHT PICTURE CARD                                           */
/* ========================================================================= */
export function FrontSpotlightCard({
  item,
  onOrderAction,
}: {
  item: DiscountMenuItem;
  onOrderAction?: (item: DiscountMenuItem) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOrdered(true);
    onOrderAction?.(item);
    setTimeout(() => setIsOrdered(false), 1800);
  };

  return (
    <div className="group relative flex flex-col justify-between w-full h-full rounded-3xl overflow-hidden bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
      {/* 1. Picture Container with 3. Button Heart */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={item.imageSrc}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* 3. Button Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90 shadow-sm ${
            isLiked
              ? "bg-rose-50 text-rose-500"
              : "bg-white/85 text-gray-700 hover:bg-white hover:text-rose-500"
          }`}
          aria-label="Save dish"
        >
          <Heart size={16} className={isLiked ? "fill-rose-500 text-rose-500" : ""} />
        </button>
      </div>

      {/* 2. Text Description About Menu & 4. Button Order */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
            {item.title}
          </h3>

          <p className="mt-2 text-xs sm:text-[13px] text-gray-600 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & 4. Button Order */}
        <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">
              ${item.discountPrice.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 line-through font-medium">
              ${item.originalPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleOrder}
            className={`flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs ${
              isOrdered
                ? "bg-emerald-600 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md"
            }`}
          >
            {isOrdered ? (
              <>
                <Check size={14} className="stroke-[3]" />
                <span>Ordered!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Order Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 2. SWIPER COMPACT PICTURE CARD (Horizontal Card for 3-Block Grid)          */
/* ========================================================================= */
export function SwiperBlockCard({
  item,
  onOrderAction,
}: {
  item: DiscountMenuItem;
  onOrderAction?: (item: DiscountMenuItem) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);

  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOrdered(true);
    onOrderAction?.(item);
    setTimeout(() => setIsOrdered(false), 1800);
  };

  return (
    <div className="group relative flex flex-row items-stretch w-[330px] sm:w-[410px] xl:w-[430px] h-[155px] shrink-0 overflow-hidden rounded-3xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 select-none">
      {/* 1. Picture Container with 3. Button Heart */}
      <div className="relative w-36 sm:w-44 shrink-0 overflow-hidden bg-slate-100">
        <img
          src={item.imageSrc}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* 3. Button Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
            isLiked
              ? "bg-rose-50 text-rose-500"
              : "bg-white/80 text-gray-700 hover:bg-white hover:text-rose-500"
          }`}
          aria-label="Save dish"
        >
          <Heart size={13} className={isLiked ? "fill-rose-500 text-rose-500" : ""} />
        </button>
      </div>

      {/* 2. Text Description About Menu & 4. Button Order */}
      <div className="flex flex-1 flex-col justify-between p-3.5 bg-white">
        <div>
          <h4 className="font-bold text-gray-900 text-xs sm:text-[14px] leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {item.title}
          </h4>

          <p className="mt-1 text-[11px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & 4. Button Order */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-extrabold text-emerald-700">
              ${item.discountPrice.toFixed(2)}
            </span>
            <span className="text-[11px] text-gray-400 line-through">
              ${item.originalPrice.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleOrder}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[11.5px] font-bold transition-all duration-200 active:scale-95 shadow-xs ${
              isOrdered
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200"
            }`}
          >
            {isOrdered ? (
              <>
                <Check size={12} className="stroke-[3]" />
                <span>Ordered</span>
              </>
            ) : (
              <>
                <Plus size={12} className="stroke-[2.5]" />
                <span>Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 3. MAIN DISCOUNT PROMOTION SECTION (Front Picture Card + 3-Block Swiper)  */
/* ========================================================================= */
export default function PromotionDiscountSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [claimedToast, setClaimedToast] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Spotlight Deal for the Front Card
  const spotlightItem = DISCOUNT_MENU_ITEMS[0];

  // Remaining Discount Items for the 3-Block Swiper
  const swiperItems = DISCOUNT_MENU_ITEMS.slice(1).filter((item) => {
    if (selectedCategory === "all") return true;
    return item.categoryId === selectedCategory;
  });

  // Group items into 3-block column sets (Top block, Middle block, Bottom block)
  const tripleColumns: DiscountMenuItem[][] = [];
  for (let i = 0; i < swiperItems.length; i += 3) {
    tripleColumns.push(swiperItems.slice(i, i + 3));
  }

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [tripleColumns]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = direction === "left" ? -430 : 430;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleClaim = (item: DiscountMenuItem) => {
    setClaimedToast(`Claimed discount coupon "${item.couponCode}" for ${item.title}!`);
    setTimeout(() => setClaimedToast(null), 3500);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-gray-200/80 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60 mb-2 shadow-2xs">
              <Sparkles size={14} className="text-emerald-600 animate-pulse" />
              <span>Special Promotion Menu</span>
              <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                UP TO 50% OFF
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Exclusive Discount Menu &amp; Swiper Deals
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-2xl">
              Check out our front spotlight deal of the day, then swipe through 3-block discount menus to explore all chef offers.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              href="/Food"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2 rounded-xl transition-colors"
            >
              <span>Explore All Dishes</span>
              <ArrowRight size={14} />
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous discount dishes"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Next discount dishes"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {DISCOUNT_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                    : "bg-white text-gray-700 border border-gray-200/80 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Toast Alert */}
        {claimedToast && (
          <div className="mb-4 flex items-center justify-between p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-md animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check size={16} className="stroke-[3]" />
              <span>{claimedToast}</span>
            </div>
            <Link
              href="/Food"
              className="bg-white text-emerald-800 px-3 py-1 rounded-xl text-[11px] font-black hover:bg-emerald-50 transition-colors"
            >
              Order in Menu →
            </Link>
          </div>
        )}

        {/* ================================================================= */}
        {/* SPLIT LAYOUT: Picture Card in Front + 3-Block Swiper on the Right  */}
        {/* ================================================================= */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6">
          
          {/* 1. Picture Card in Front (Spotlight Deal of the Day) */}
          <div className="w-full lg:w-[410px] xl:w-[430px] shrink-0">
            <FrontSpotlightCard item={spotlightItem} onOrderAction={handleClaim} />
          </div>

          {/* 2. Picture Card 3-Block Swiper (Horizontally scrollable 3-stacked cards per column) */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-3 pt-0.5 scroll-smooth scrollbar-none snap-x"
            >
              {tripleColumns.map((triplet, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-3.5 shrink-0 snap-start">
                  {/* Block 1 (Top) */}
                  {triplet[0] && (
                    <SwiperBlockCard item={triplet[0]} onOrderAction={handleClaim} />
                  )}

                  {/* Block 2 (Middle) */}
                  {triplet[1] && (
                    <SwiperBlockCard item={triplet[1]} onOrderAction={handleClaim} />
                  )}

                  {/* Block 3 (Bottom) */}
                  {triplet[2] && (
                    <SwiperBlockCard item={triplet[2]} onOrderAction={handleClaim} />
                  )}
                </div>
              ))}
            </div>

            {/* Quick helper tip below swiper */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 px-1">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-600" />
                <span>Swipe horizontally to browse 3-block paired discount cards</span>
              </div>
              <span className="font-semibold text-emerald-700">
                {swiperItems.length} Deals Available
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Fast Coupon Banner */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shrink-0 border border-white/30">
              <Percent size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold leading-tight">
                Get an Extra 15% OFF on Your First Order!
              </h4>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Use promo coupon <strong>WELCOME20</strong> or <strong>TASTY10</strong> in cart checkout.
              </p>
            </div>
          </div>

          <Link
            href="/Food"
            className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Claim Coupon in Menu</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}

// Backward-compatible alias for promotion FoodCard
export { SwiperBlockCard as FoodCard };