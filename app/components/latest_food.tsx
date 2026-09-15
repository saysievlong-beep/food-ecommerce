"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Heart, Plus, Check, Clock, Flame, Sparkles, ChevronRight, Eye, Store, Award, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export type LatestFoodItem = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  description: string;
  imageUrl: string;
  tag?: string;
  prepTime?: string;
  calories?: number;
  isNew?: boolean;
  isVegetarian?: boolean;
  isChefSpecial?: boolean;
};

export const DEFAULT_LATEST_FOODS: LatestFoodItem[] = [
  {
    id: "lf-1",
    name: "Smoked Salmon Brioche Benedict",
    category: "Breakfast & Brunch",
    categoryId: "brunch",
    price: 14.5,
    originalPrice: 17.0,
    rating: 4.9,
    reviews: 64,
    description: "Poached organic eggs, smoked Norwegian salmon, velvety hollandaise, and micro-herbs on golden toasted brioche.",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    tag: "New Arrival",
    prepTime: "15 min",
    calories: 480,
    isNew: true,
  },
  {
    id: "lf-2",
    name: "Artisan Wood-Fired Prosciutto & Fig",
    category: "Gourmet Pizza",
    categoryId: "pizza",
    price: 18.99,
    originalPrice: 22.0,
    rating: 4.8,
    reviews: 82,
    description: "Crispy hand-stretched sourdough, Parma prosciutto, black mission figs, gorgonzola crumble, and balsamic reduction.",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    tag: "Chef's Choice",
    prepTime: "20 min",
    calories: 620,
    isChefSpecial: true,
  },
  {
    id: "lf-3",
    name: "Avocado & Grilled Halloumi Nourish Bowl",
    category: "Healthy Bowls",
    categoryId: "healthy",
    price: 13.75,
    rating: 4.9,
    reviews: 51,
    description: "Pan-seared Cypriot halloumi, Hass avocado slices, tri-color quinoa, roasted chickpeas, and tahini herb dressing.",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    tag: "Organic",
    prepTime: "12 min",
    calories: 390,
    isVegetarian: true,
    isNew: true,
  },
  {
    id: "lf-4",
    name: "Black Angus Smash Cheeseburger",
    category: "Gourmet Burgers",
    categoryId: "burger",
    price: 15.2,
    originalPrice: 18.5,
    rating: 4.9,
    reviews: 110,
    description: "Two 100% Black Angus smashed beef patties, melted sharp cheddar, caramelized onions, and signature secret relish.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    tag: "Fresh Today",
    prepTime: "15 min",
    calories: 710,
  },
  {
    id: "lf-5",
    name: "Pan-Seared Sea Bass with Asparagus",
    category: "Seafood Mains",
    categoryId: "seafood",
    price: 24.0,
    originalPrice: 28.0,
    rating: 4.9,
    reviews: 43,
    description: "Crispy skin Mediterranean sea bass fillet, garlic butter asparagus, saffron potato puree, and lemon dill emulsion.",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    tag: "Premium",
    prepTime: "25 min",
    calories: 450,
    isChefSpecial: true,
  },
  {
    id: "lf-6",
    name: "Handcrafted Matcha Pistachio Tart",
    category: "Artisan Desserts",
    categoryId: "dessert",
    price: 8.5,
    rating: 4.8,
    reviews: 38,
    description: "Kyoto ceremonial grade matcha ganache, roasted pistachio praline crunch, nestled in a flaky French sable crust.",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    tag: "New Dessert",
    prepTime: "10 min",
    calories: 320,
    isVegetarian: true,
    isNew: true,
  },
  {
    id: "lf-7",
    name: "Slow-Cooked Beef Short Rib Tacos",
    category: "Mexican Gourmet",
    categoryId: "tacos",
    price: 16.0,
    originalPrice: 19.5,
    rating: 4.8,
    reviews: 76,
    description: "Tender 12-hour braised beef short rib, pickled red onions, cotija cheese, salsa verde, and fresh cilantro on warm corn tortillas.",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    tag: "Popular",
    prepTime: "18 min",
    calories: 540,
  },
  {
    id: "lf-8",
    name: "Dragonfruit Yuzu Chia Refresher",
    category: "Beverages",
    categoryId: "drinks",
    price: 6.5,
    rating: 4.7,
    reviews: 29,
    description: "Cold-pressed pink pitaya dragonfruit, sparkling Japanese yuzu, organic chia pearls, and fresh mint leaves.",
    imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
    tag: "Refreshing",
    prepTime: "5 min",
    calories: 140,
    isVegetarian: true,
    isNew: true,
  },
];

const CATEGORIES = [
  { id: "all", name: "All Latest Dishes" },
  { id: "brunch", name: "Brunch & Bowls" },
  { id: "pizza", name: "Pizza & Pasta" },
  { id: "burger", name: "Burgers & Grill" },
  { id: "dessert", name: "Desserts & Drinks" },
];

export function LatestFoodCard({
  item,
  index = 0,
  isVisible = true,
}: {
  item: LatestFoodItem;
  index?: number;
  isVisible?: boolean;
}) {
  const { requireAuth } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.imageUrl);
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(() => {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1600);
    }, `Please log in to order ${item.name}.`);
  };

  return (
    <div
      style={{
        transitionDelay: `${isVisible ? index * 75 : 0}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-200/80 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      {/* Media & Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={imgSrc || item.imageUrl}
          alt={item.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Ambient Gradient on Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30 pointer-events-none transition-opacity duration-300 group-hover:opacity-85" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.tag && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm border border-emerald-400/30">
                <Sparkles size={11} className="text-emerald-200 animate-pulse" />
                {item.tag}
              </span>
            )}
            {item.isNew && (
              <span className="inline-flex items-center rounded-full bg-amber-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                NEW
              </span>
            )}
          </div>

          {/* Like Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 shadow-sm ${
              isLiked
                ? "bg-rose-500 text-white shadow-rose-200"
                : "bg-white/85 text-gray-700 hover:bg-white hover:text-rose-500"
            }`}
            aria-label="Save dish"
          >
            <Heart
              size={15}
              className={`transition-transform duration-200 ${
                isLiked ? "fill-white text-white scale-110" : ""
              }`}
            />
          </button>
        </div>

        {/* Bottom Picture Info Overlays */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/95 font-medium z-10 pointer-events-none">
          {item.prepTime && (
            <span className="inline-flex items-center gap-1 rounded-md bg-black/50 backdrop-blur-md px-2 py-0.5 border border-white/10">
              <Clock size={11} className="text-emerald-400" />
              {item.prepTime}
            </span>
          )}
          {item.calories && (
            <span className="inline-flex items-center gap-1 rounded-md bg-black/50 backdrop-blur-md px-2 py-0.5 border border-white/10">
              <Flame size={11} className="text-amber-400" />
              {item.calories} kcal
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4.5">
        {/* Rating and Vegetarian indicator */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
            {item.category}
          </span>

          <div className="flex items-center gap-1 text-xs text-amber-500">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-800">{item.rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({item.reviews})</span>
          </div>
        </div>

        {/* Dish Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Card Footer: Price & Action */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider block">
              Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-emerald-700">
                ${item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 shadow-xs ${
              isAdded
                ? "bg-emerald-600 text-white shadow-emerald-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check size={14} className="stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={14} className="stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export type LatestFoodProps = {
  title?: string;
  subtitle?: string;
  items?: LatestFoodItem[];
  seeMoreUrl?: string;
  isExternalLink?: boolean;
};

export default function LatestFood({
  title = "Latest Fresh Culinary Creations",
  subtitle = "Discover our newest chef-inspired recipes, seasonal specials, and freshly crafted delights.",
  items = DEFAULT_LATEST_FOODS,
  seeMoreUrl = "/Lastest_Food",
  isExternalLink = false,
}: LatestFoodProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const isExternal = isExternalLink || seeMoreUrl.startsWith("http://") || seeMoreUrl.startsWith("https://");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentEl = sectionRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, []);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "brunch") return item.categoryId === "brunch" || item.categoryId === "healthy";
    if (selectedCategory === "pizza") return item.categoryId === "pizza";
    if (selectedCategory === "burger") return item.categoryId === "burger" || item.categoryId === "tacos" || item.categoryId === "seafood";
    if (selectedCategory === "dessert") return item.categoryId === "dessert" || item.categoryId === "drinks";
    return true;
  });

  return (
    <section
      ref={sectionRef}
      className="py-14 bg-gradient-to-b from-white via-slate-50 to-white border-t border-gray-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95"
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60 mb-2">
              <Sparkles size={13} className="text-emerald-600" />
              <span>New In Menu</span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500 max-w-2xl">
              {subtitle}
            </p>
          </div>

          {isExternal ? (
            <a
              href={seeMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors group self-start md:self-auto bg-emerald-50/70 hover:bg-emerald-100/70 px-4 py-2 rounded-xl"
            >
              <span>Explore Full Menu</span>
              <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <Link
              href={seeMoreUrl}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors group self-start md:self-auto bg-emerald-50/70 hover:bg-emerald-100/70 px-4 py-2 rounded-xl"
            >
              <span>Explore Full Menu</span>
              <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Category Pills Filter */}
        <div
          className={`flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Picture Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item, index) => (
            <LatestFoodCard
              key={item.id}
              item={item}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Center See More Button */}
        <div className="mt-10 flex justify-center">
          {isExternal ? (
            <a
              href={seeMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group"
            >
              <span>See More Latest Food</span>
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <Link
              href={seeMoreUrl}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group"
            >
              <span>See More Latest Food</span>
              <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Bottom Feature Banner */}
        <div
          className={`mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl relative overflow-hidden transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Decorative Background Circles */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={14} className="animate-pulse" />
              <span>Hungry For More?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Explore 120+ Fresh Signature Dishes
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/80 max-w-lg">
              Check out our full gourmet catalog with seasonal creations, healthy bowls, chef specials, and refreshing drinks.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0">
            {isExternal ? (
              <a
                href={seeMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
              >
                <span>View Full Menu</span>
                <ChevronRight
                  size={18}
                  className="text-emerald-700 group-hover:translate-x-1 transition-transform"
                />
              </a>
            ) : (
              <Link
                href={seeMoreUrl}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group"
              >
                <span>View Full Menu</span>
                <ChevronRight
                  size={18}
                  className="text-emerald-700 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
