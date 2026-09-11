"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Eye,
  Store,
  Award,
} from "lucide-react";

export interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
}

const SLIDES: BannerSlide[] = [
  {
    id: "1",
    tag: "Artisan Pizza",
    title: "Stone-Baked Crusts & Melty Cheeses",
    description:
      "Hand-tossed sourdough topped with rich San Marzano tomato sauce, fresh buffalo mozzarella, and fragrant garden basil.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80",
    ctaText: "Explore Pizzas",
  },
  {
    id: "2",
    tag: "Gourmet Burgers",
    title: "Juicy Smashed Wagyu Patties",
    description:
      "100% prime Wagyu beef seared to perfection, layered with caramelized onions, melted aged cheddar, and house relish.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80",
    ctaText: "Explore Burgers",
  },
  {
    id: "3",
    tag: "Fresh Sushi",
    title: "Wild-Caught Seafood & Sashimi",
    description:
      "Freshly torched Atlantic salmon, bluefin tuna, and signature handcrafted rolls prepared fresh upon every order.",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1400&q=80",
    ctaText: "Explore Sushi",
  },
  {
    id: "4",
    tag: "Organic Bowls",
    title: "Crisp Garden Greens & Grains",
    description:
      "Farm-fresh leafy greens, roasted ancient grains, creamy ripe avocados, and homemade cold-pressed vinaigrettes.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
    ctaText: "Explore Bowls",
  },
];

const FEATURE_BUTTONS = [
  {
    id: "viewers",
    title: "142K+ Viewers",
    subtitle: "Amount of Viewers",
    icon: Eye,
    iconColor: "text-amber-500 bg-amber-50",
    hoverBorder: "hover:border-amber-300",
  },
  {
    id: "branches",
    title: "48+ Branches",
    subtitle: "Amount of Branches",
    icon: Store,
    iconColor: "text-emerald-600 bg-emerald-50",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    id: "quality",
    title: "100% Chef Quality",
    subtitle: "Quality of TastyByte",
    icon: Award,
    iconColor: "text-purple-600 bg-purple-50",
    hoverBorder: "hover:border-purple-300",
  },
];

export default function BannerSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const current = SLIDES[currentIndex];

  return (
    <section className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-3">
      {/* Banner Container */}
      <div
        className="relative flex-1 min-h-[350px] sm:min-h-[370px] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-md group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Image Slides */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            {/* Soft, readable gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          </div>
        ))}

        {/* Text & Content Overlay */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-9 max-w-xl text-white">
          {/* Tag */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <Sparkles size={13} />
              {current.tag}
            </span>
          </div>

          {/* Simple Title & Description */}
          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
              {current.description}
            </p>
          </div>

          {/* Action Button & Indicators */}
          <div className="flex items-center justify-between pt-1">
            <a
              href="/food"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-emerald-500 hover:shadow-lg active:scale-95"
            >
              <span>{current.ctaText}</span>
              <ArrowRight size={15} />
            </a>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-6 bg-emerald-400"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Left / Right Chevron Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 active:scale-90"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Feature Action Buttons Under Banner (3 Equal Buttons Matching Banner Width) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full pt-1">
        {FEATURE_BUTTONS.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.id}
              type="button"
              className={`group flex items-center gap-3.5 w-full rounded-2xl sm:rounded-3xl bg-white p-3.5 sm:p-4 border border-gray-100 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${btn.hoverBorder} active:scale-95 text-left`}
            >
              <div
                className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105 ${btn.iconColor}`}
              >
                <Icon size={20} className="stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-emerald-600 transition-colors leading-snug">
                  {btn.title}
                </h4>
                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                  {btn.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
