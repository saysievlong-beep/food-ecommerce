"use client";

import { useState } from "react";
import { Star, ShoppingBag, Heart, Plus, Check } from "lucide-react";

export type FoodMenuItem = {
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
  spicyLevel?: number;
  isVegetarian?: boolean;
  isNew?: boolean;
};

export type PictureCardProps = {
  item: FoodMenuItem;
  onAddToCartAction?: (item: FoodMenuItem) => void;
  index?: number;
};

export default function PictureCard({
  item,
  onAddToCartAction,
  index = 0,
}: PictureCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.imageUrl);
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  const handleAdd = () => {
    setIsAdded(true);
    onAddToCartAction?.(item);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      style={{
        animationDelay: `${index * 50}ms`,
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300"
    >
      {/* Top Media / Picture Section */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-200">
        <img
          src={imgSrc || item.imageUrl}
          alt={item.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            if (imgSrc !== FALLBACK_IMAGE) {
              setImgSrc(FALLBACK_IMAGE);
            }
          }}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 block"
        />

        {/* Gradient Overlay for bottom text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

        {/* Top Badges: Tag & Category */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.isNew && (
              <span className="inline-flex items-center rounded-full bg-amber-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-xs border border-amber-300/30">
                NEW
              </span>
            )}
            {item.tag && (
              <span className="inline-flex items-center rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                {item.tag}
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-gray-100 border border-white/10">
              {item.category}
            </span>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90 ${
              isLiked
                ? "bg-rose-50 text-rose-500 shadow-sm"
                : "bg-white/80 text-gray-700 hover:bg-white hover:text-rose-500"
            }`}
            aria-label="Save to favorites"
          >
            <Heart
              size={15}
              className={isLiked ? "fill-rose-500 text-rose-500" : ""}
            />
          </button>
        </div>

        {/* Bottom Picture Info: Prep time & Calories */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-medium">
          {item.prepTime && (
            <span className="backdrop-blur-sm bg-black/40 px-2 py-0.5 rounded-md">
              ⏱ {item.prepTime}
            </span>
          )}
          {item.calories && (
            <span className="backdrop-blur-sm bg-black/40 px-2 py-0.5 rounded-md">
              🔥 {item.calories} kcal
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1 text-xs">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-900">{item.rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({item.reviews})</span>
          </div>

          {item.isVegetarian && (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              🌱 Vegetarian
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
          {item.name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Footer: Price and Add button */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-gray-400 block font-normal">Price</span>
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

          <button
            type="button"
            onClick={handleAdd}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 shadow-xs ${
              isAdded
                ? "bg-emerald-600 text-white"
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
