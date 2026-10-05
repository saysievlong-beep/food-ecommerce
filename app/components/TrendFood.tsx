"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Sparkles, Plus, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";

export type FoodItem = {
  id: string;
  imageUrl: string;
  name: string;
  category?: string;
  description: string;
  price?: number;
  rating?: number;
  reviews?: number;
  tag?: string;
};

export type FoodCardProps = {
  id?: string;
  imageUrl: string;
  name: string;
  description: string;
  category?: string;
  price?: number;
  rating?: number;
  reviews?: number;
  tag?: string;
  index?: number;
  isVisible?: boolean;
};

export const DEFAULT_TRENDING_FOODS: FoodItem[] = [
  {
    id: "trend-1",
    name: "Truffle Burrata Margherita",
    category: "Artisan Pizza",
    price: 18.5,
    description:
      "San Marzano tomato sauce, fresh creamy buffalo burrata, aromatic basil, and a delicate white truffle oil drizzle.",
    rating: 4.9,
    reviews: 128,
    tag: "Popular",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "trend-2",
    name: "Double Wagyu Smash Burger",
    category: "Gourmet Burger",
    price: 15.2,
    description:
      "Two prime Wagyu beef patties smashed crispy, melted aged cheddar, caramelized shallots, and house relish on a toasted brioche bun.",
    rating: 4.8,
    reviews: 95,
    tag: "Chef's Pick",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "trend-3",
    name: "Flame-Torched Salmon Roll",
    category: "Japanese Sushi",
    price: 16.5,
    description:
      "Fresh Atlantic salmon lightly torched, creamy avocado, spicy unagi glaze, crispy tobiko, and spring scallions.",
    rating: 4.9,
    reviews: 84,
    tag: "Trending",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "trend-4",
    name: "Creamy Truffle Wild Mushroom Pasta",
    category: "Handmade Pasta",
    price: 14.8,
    description:
      "Handcrafted fettuccine tossed with pan-seared chanterelles, rich porcini cream, and 24-month aged Parmigiano-Reggiano.",
    rating: 4.7,
    reviews: 73,
    tag: "Best Seller",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaHGQ-2M-fY2S3n7hrBOOXEGbZ6hHYz_1P_3XOc3cENg&s=10",
  },
];

export function FoodCard({
  id = "trend-item",
  imageUrl,
  name,
  description,
  category,
  price = 14.5,
  rating,
  reviews,
  tag,
  index = 0,
  isVisible = true,
}: FoodCardProps) {
  const { requireAuth } = useAuth();
  const { addToCart } = useOrders();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(() => {
      setIsAdded(true);
      addToCart({
        id,
        name,
        category: category || "Trending",
        price,
        imageUrl,
        quantity: 1,
      });
      setTimeout(() => setIsAdded(false), 1500);
    }, `Please log in to order ${name}.`);
  };

  return (
    <div
      style={{
        transitionDelay: `${isVisible ? index * 90 : 0}ms`,
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      className={`group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-xs transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lg hover:border-emerald-200 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-90"
      }`}
    >
      {/* Picture */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {tag && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {tag}
          </span>
        )}
      </div>

      {/* Details & Centered Menu Title & Description */}
      <div className="flex flex-1 flex-col justify-between p-4.5">
        <div>
          {category && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 mb-1 block">
              {category}
            </span>
          )}

          {/* Centered Menu Name */}
          <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          {typeof rating === "number" && (
            <div className="mt-1 flex items-center justify-center gap-1 text-xs text-amber-500">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-800">{rating.toFixed(1)}</span>
              {typeof reviews === "number" && (
                <span className="text-gray-400 font-normal">({reviews} reviews)</span>
              )}
            </div>
          )}

          {/* Text Describe Detail */}
          <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Footer: Price & Add Button */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-emerald-700">
              ${price.toFixed(2)}
            </span>
            {(() => {
              const catLower = ((category || "") + " " + (name || "")).toLowerCase();
              const isDouble = catLower.includes("pizza") || catLower.includes("burger") || catLower.includes("drink");
              const pts = isDouble ? 2 : 1;
              return (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md border inline-flex items-center gap-0.5 ${
                  isDouble ? "text-amber-800 bg-amber-50 border-amber-200" : "text-emerald-800 bg-emerald-50 border-emerald-200"
                }`}>
                  +{pts} {pts === 1 ? "pt" : "pts"} {isDouble && <span className="text-[8px] bg-amber-200 text-amber-900 px-0.5 rounded font-black">2x</span>}
                </span>
              );
            })()}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs cursor-pointer ${
              isAdded
                ? "bg-emerald-600 text-white shadow-emerald-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
            }`}
          >
            {isAdded ? (
              <>
                <Check size={13} className="stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={13} className="stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export type TrendFoodProps = {
  title?: string;
  subtitle?: string;
  items?: FoodItem[];
};

export default function TrendFood({
  title = "Trending Delicious Dishes",
  subtitle = "Explore our most loved handcrafted specialties and culinary highlights.",
  items = DEFAULT_TRENDING_FOODS,
}: TrendFoodProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.15,
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

  return (
    <section
      ref={sectionRef}
      className="py-12 bg-slate-50 border-t border-gray-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`mb-8 transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95"
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles size={14} />
            <span>Highlights</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Grid of Simple Picture Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((food, index) => (
            <FoodCard
              key={food.id}
              id={food.id}
              imageUrl={food.imageUrl}
              name={food.name}
              category={food.category}
              description={food.description}
              price={food.price}
              rating={food.rating}
              reviews={food.reviews}
              tag={food.tag}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}