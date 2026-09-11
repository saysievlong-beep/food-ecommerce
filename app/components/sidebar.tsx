"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  Pizza,
  Beef,
  Fish,
  Salad,
  IceCream,
  CupSoda,
  Leaf,
  Soup,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  Hamburger,
} from "lucide-react";

type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  count: number;
};

const CATEGORIES: Category[] = [
  { id: "all", label: "All dishes", icon: UtensilsCrossed, count: 128 },
  { id: "pizza", label: "Pizza", icon: Pizza, count: 18 },
  { id: "burgers", label: "Burgers", icon: Hamburger, count: 14 },
  { id: "sushi", label: "Sushi", icon: Fish, count: 22 },
  { id: "soups", label: "Soups", icon: Soup, count: 9 },
  { id: "salads", label: "Salads", icon: Salad, count: 16 },
  { id: "vegan", label: "Vegan", icon: Leaf, count: 11 },
  { id: "drinks", label: "Drinks", icon: CupSoda, count: 20 },
  { id: "desserts", label: "Desserts", icon: IceCream, count: 18 },
];

export type FoodSidebarProps = {
  activeCategory?: string;
  onSelectAction?: (id: string) => void;
  cartCount?: number;
  topOffset?: number;
  showBrand?: boolean;
};

export default function FoodSidebar({
  activeCategory = "all",
  onSelectAction,
  cartCount = 0,
  topOffset = 0,
  showBrand = true,
}: FoodSidebarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [internalActive, setInternalActive] = useState(activeCategory);
  const active = activeCategory ?? internalActive;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  const handleSelect = (id: string) => {
    setInternalActive(id);
    if (onSelectAction) {
      onSelectAction(id);
    } else {
      router.push(id === "all" ? "/Food" : `/Food?category=${id}`);
    }
  };

  return (
    <div className="flex w-full md:w-64 shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xs h-full">
      {/* Brand */}
      {showBrand && (
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-600">
              <Store size={16} />
            </span>
            <span
              className="text-[19px] font-semibold tracking-tight text-[#28361F]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Shop For Food
            </span>
          </div>
          <p className="mt-1 pl-10 text-[12px] text-[#6E7565]">
            Browse the menu by category <b><span className="text-emerald-600 font-semibold">TastyByte always bring the best food to you</span></b>
          </p>
        </div>
      )}

      {/* Category list */}
      <nav className="flex-1 flex flex-col justify-between px-3 py-2.5 overflow-y-auto">
        <ul className="flex flex-col justify-between h-full gap-1">
          {filtered.map(({ id, label, icon: Icon, count }) => {
            const isActive = active === id;
            return (
              <li key={id} className="flex-1 flex">
                <button
                  type="button"
                  onClick={() => handleSelect(id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13.5px] font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "text-[#3F4636] hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-white" : "text-[#5F6756]"} />
                    <span>{label}</span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "text-[#9A9580] bg-gray-50"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-3 py-4 text-center text-[12.5px] text-[#9A9580]">
              No categories match &quot;{query}&quot;
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}