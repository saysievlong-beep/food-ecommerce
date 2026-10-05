"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  Clock,
  Flame,
  Leaf,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Sparkles,
  Check,
  ShieldCheck,
} from "lucide-react";
import { FoodMenuItem } from "./PictureCard";
import { useOrders, calculateRewardPoints } from "../context/OrderContext";

interface FoodDetailModalProps {
  item: FoodMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCartSuccess?: (item: FoodMenuItem, quantity: number) => void;
}

export default function FoodDetailModal({
  item,
  isOpen,
  onClose,
  onAddToCartSuccess,
}: FoodDetailModalProps) {
  const { addToCart } = useOrders();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  // Reset state when modal opens with a new item
  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setNotes("");
      setIsAdded(false);
      setImgSrc(item.imageUrl);
    }
  }, [isOpen, item]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const currentPrice = item.price;
  const originalPrice = item.originalPrice;
  const totalPrice = currentPrice * quantity;
  const earnedPoints = calculateRewardPoints(totalPrice);
  const savings = originalPrice && originalPrice > currentPrice
    ? (originalPrice - currentPrice) * quantity
    : 0;

  const handleIncrement = () => {
    setQuantity((q) => Math.min(20, q + 1));
  };

  const handleDecrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleAddToCart = () => {
    setIsAdded(true);
    addToCart({
      id: item.id,
      name: item.name,
      category: item.category,
      categoryId: item.categoryId,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity,
      notes: notes.trim() || undefined,
      rewardPoints: calculateRewardPoints(item.price),
    });

    onAddToCartSuccess?.(item, quantity);

    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all border border-gray-200/80 cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Left Side: Media & Dish Highlights */}
        <div className="relative md:w-5/12 h-64 md:h-auto min-h-[260px] bg-gray-900 overflow-hidden shrink-0 flex items-center justify-center">
          <img
            src={imgSrc || item.imageUrl}
            alt={item.name}
            onError={() => {
              if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
            }}
            className="w-full h-full object-cover object-center"
          />

          {/* Soft Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 pointer-events-none">
            {item.tag && (
              <span className="inline-flex items-center rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                {item.tag}
              </span>
            )}
            {item.isNew && (
              <span className="inline-flex items-center rounded-full bg-amber-500/95 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow-xs">
                NEW
              </span>
            )}
            {item.isVegetarian && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                <Leaf size={11} />
                <span>Veggie</span>
              </span>
            )}
          </div>

          {/* Favorite Button on Image */}
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className={`absolute bottom-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md shadow-md transition-all active:scale-90 cursor-pointer ${
              isLiked
                ? "bg-rose-50 text-rose-500"
                : "bg-white/85 text-gray-700 hover:bg-white hover:text-rose-500"
            }`}
            aria-label="Save dish to favorites"
          >
            <Heart size={16} className={isLiked ? "fill-rose-500 text-rose-500" : ""} />
          </button>

          {/* Category Chip at Bottom Left */}
          <div className="absolute bottom-3.5 left-3.5 pointer-events-none">
            <span className="text-[11px] font-semibold text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
              {item.category}
            </span>
          </div>
        </div>

        {/* Right Side: Full Dish Details & Add To Cart Flow */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto max-h-[calc(92vh-16rem)] md:max-h-[92vh] p-5 sm:p-6">
          <div className="space-y-4">
            {/* Header info: Rating, Category, Calories */}
            <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-amber-700 font-bold">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>{item.rating.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal">({item.reviews} reviews)</span>
                </div>
                {item.prepTime && (
                  <span className="inline-flex items-center gap-1 text-gray-500 text-[11px]">
                    <Clock size={12} className="text-gray-400" />
                    <span>{item.prepTime}</span>
                  </span>
                )}
                {item.calories && (
                  <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 text-[11px] font-semibold">
                    <Flame size={12} />
                    <span>{item.calories} kcal</span>
                  </span>
                )}
              </div>
            </div>

            {/* Dish Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {item.name}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Price & Reward Points Preview */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-amber-50/60 rounded-2xl border border-emerald-100/80 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Unit Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-emerald-700 font-mono">
                    ${currentPrice.toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-sm text-gray-400 line-through font-mono">
                      ${originalPrice.toFixed(2)}
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-200">
                      Save ${(savings).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Loyalty Reward points */}
              <div className="text-right">
                <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                  <Sparkles size={12} className="text-amber-600" />
                  <span>Reward Points</span>
                </span>
                <span className="inline-flex items-center gap-1 mt-0.5 px-2.5 py-1 rounded-xl bg-amber-100/90 text-amber-950 font-mono font-black text-xs border border-amber-300 shadow-2xs">
                  +{earnedPoints} pts
                  <span className="text-[10px] font-normal text-amber-800 hidden sm:inline">
                    ($10 = 2 pts)
                  </span>
                </span>
              </div>
            </div>

            {/* Special Instructions / Kitchen Note */}
            <div>
              <label
                htmlFor="dish-special-instructions"
                className="block text-xs font-bold text-gray-700 mb-1"
              >
                Special Instructions (Optional)
              </label>
              <textarea
                id="dish-special-instructions"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="E.g., No onions, dressing on the side, extra spicy, warm bread..."
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Bottom Actions: Quantity & Add to Cart */}
          <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">Quantity</span>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/80 p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-2xs hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-xs font-black font-mono text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={quantity >= 20}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-700 shadow-2xs hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Total Calculated Amount */}
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Total</span>
                <span className="text-xl font-black text-gray-900 font-mono">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer ${
                isAdded
                  ? "bg-emerald-700 text-white scale-[0.99]"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98] hover:shadow-md"
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={16} className="text-emerald-200 animate-bounce" />
                  <span>Added {quantity} to Cart! (+{earnedPoints} pts)</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>
                    Add to Cart • ${totalPrice.toFixed(2)}
                  </span>
                </>
              )}
            </button>

            {/* Quality Reassurance */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-0.5">
              <span className="flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>100% Fresh &amp; Hygienic</span>
              </span>
              <span>•</span>
              <span>Fast Doorstep Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
