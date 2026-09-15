"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  Pizza,
  BookOpen,
  Phone,
  Compass,
  Zap,
  Star,
  ExternalLink,
  Percent,
} from "lucide-react";

export type SearchResultType =
  | "food"
  | "flash_sale"
  | "promotion"
  | "blog"
  | "category"
  | "page"
  | "contact";

export interface SearchableItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  category?: string;
  description: string;
  imageUrl: string;
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviews?: number;
  tag?: string;
  targetUrl: string;
  keywords?: string[];
}

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

// Master index of everything in the site - Foods & Deals first so users always see appetizing images
export const GLOBAL_SEARCH_ITEMS: SearchableItem[] = [
  // ── 🍕 Food Dishes (Popular & Signature) ──
  {
    id: "p1",
    type: "food",
    title: "Truffle Burrata Margherita",
    category: "Pizza",
    price: 18.5,
    originalPrice: 22.0,
    rating: 4.9,
    reviews: 142,
    tag: "Popular",
    description: "San Marzano tomato coulis, creamy burrata pugliese, fragrant basil, and white truffle oil.",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=pizza&search=Truffle+Burrata",
    keywords: ["pizza", "burrata", "truffle", "margherita", "cheese", "italian"],
  },
  {
    id: "b1",
    type: "food",
    title: "Double Wagyu Smash Burger",
    category: "Burgers",
    price: 16.5,
    originalPrice: 19.0,
    rating: 4.9,
    reviews: 215,
    tag: "Best Seller",
    description: "Twin 100% Wagyu smash patties, double aged cheddar, caramelized shallots, secret sauce, butter brioche.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=burgers&search=Double+Wagyu",
    keywords: ["burger", "wagyu", "smash burger", "double patty", "cheddar", "beef"],
  },
  {
    id: "s1",
    type: "food",
    title: "Flame-Torched Salmon Aburi Set",
    category: "Sushi",
    price: 21.0,
    originalPrice: 24.5,
    rating: 4.9,
    reviews: 165,
    tag: "Signature",
    description: "6pcs seared Atlantic salmon nigiri, sweet kabayaki unagi glaze, spicy mentaiko mayo, ikura pearls.",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=sushi&search=Salmon+Aburi",
    keywords: ["sushi", "salmon", "aburi", "seared", "nigiri", "japanese"],
  },
  {
    id: "p2",
    type: "food",
    title: "Pepperoni Diavola Crisp",
    category: "Pizza",
    price: 17.0,
    rating: 4.8,
    reviews: 98,
    tag: "Chef's Pick",
    description: "Spicy Calabrese artisan pepperoni, hot honey drizzle, fior di latte, and fresh oregano.",
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=pizza&search=Pepperoni+Diavola",
    keywords: ["pizza", "pepperoni", "spicy", "hot honey", "calabrese"],
  },
  {
    id: "fs-1",
    type: "flash_sale",
    title: "Truffle Ribeye Steak Deluxe",
    category: "Flash Sale",
    price: 26.99,
    originalPrice: 42.0,
    discountPercent: 35,
    rating: 4.9,
    reviews: 142,
    tag: "35% OFF Flash Deal",
    description: "USDA Prime 300g ribeye seared with black truffle butter, grilled asparagus, and red wine demi-glace.",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/#flash-sale",
    keywords: ["flash sale", "steak", "ribeye", "deal", "discount", "meat"],
  },
  {
    id: "b3",
    type: "food",
    title: "Crispy Nashville Hot Chicken Burger",
    category: "Burgers",
    price: 14.5,
    originalPrice: 16.5,
    rating: 4.9,
    reviews: 180,
    tag: "Trending",
    description: "Buttermilk fried chicken thigh, cayenne chili oil dip, tangy slaw, house pickles, garlic mayo.",
    imageUrl: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=burgers&search=Nashville+Hot+Chicken",
    keywords: ["burger", "chicken", "nashville", "spicy", "fried chicken"],
  },
  {
    id: "v1",
    type: "food",
    title: "Rainbow Quinoa & Edamame Power Bowl",
    category: "Vegan",
    price: 13.5,
    rating: 4.8,
    reviews: 88,
    tag: "Superfood",
    description: "Tri-color organic quinoa, spiced chickpeas, steamed edamame, shaved red cabbage, citrus tahini dressing.",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=vegan&search=Rainbow+Quinoa",
    keywords: ["vegan", "quinoa", "bowl", "edamame", "plant-based", "healthy"],
  },
  {
    id: "dr1",
    type: "food",
    title: "Iced Ceremonial Uji Matcha Latte",
    category: "Drinks",
    price: 6.5,
    rating: 4.9,
    reviews: 140,
    tag: "Best Seller",
    description: "First-harvest Kyoto Uji green tea whisked fresh, organic oat milk, and subtle organic agave.",
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=drinks&search=Matcha+Latte",
    keywords: ["matcha", "tea", "latte", "drink", "oat milk", "beverage"],
  },
  {
    id: "de1",
    type: "food",
    title: "Valrhona Molten Chocolate Lava Cake",
    category: "Desserts",
    price: 9.5,
    rating: 4.9,
    reviews: 198,
    tag: "Signature",
    description: "70% French dark chocolate warm runny core, dusted with cocoa, served with Madagascar vanilla bean gelato.",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=desserts&search=Chocolate+Lava",
    keywords: ["dessert", "chocolate", "lava cake", "gelato", "sweet"],
  },

  // ── ⚡ Flash Sale & Promotions ──
  {
    id: "fs-2",
    type: "flash_sale",
    title: "Crispy Korean Fried Chicken Platter",
    category: "Flash Sale",
    price: 15.5,
    originalPrice: 26.0,
    discountPercent: 40,
    rating: 4.9,
    reviews: 189,
    tag: "40% OFF Flash Deal",
    description: "Ultra-crispy double-fried chicken coated in sweet & spicy gochujang glaze with toasted sesame.",
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/#flash-sale",
    keywords: ["flash sale", "korean chicken", "fried chicken", "deal", "spicy"],
  },
  {
    id: "promo-family-bundle",
    type: "promotion",
    title: "Weekend Gourmet Family Feast",
    category: "Promotion",
    price: 49.99,
    originalPrice: 78.0,
    discountPercent: 36,
    tag: "Save $28",
    description: "2 Artisan Pizzas + 2 Wagyu Smash Burgers + Large Truffle Fries + 4 Cold Brews.",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/#promotions",
    keywords: ["promotion", "discount", "combo", "family feast", "bundle", "save"],
  },

  // ── 🧭 Categories ──
  {
    id: "cat-pizza",
    type: "category",
    title: "Stone-Baked Pizza Category",
    subtitle: "18 Handcrafted Pizzas",
    description: "48-hour fermented sourdough pizzas with San Marzano tomatoes, burrata, and artisan toppings.",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=pizza",
    keywords: ["pizza", "margherita", "pepperoni", "dough", "cheese", "crust", "italian"],
  },
  {
    id: "cat-burgers",
    type: "category",
    title: "Gourmet Smash Burgers Category",
    subtitle: "14 Juicy Smashed Patties",
    description: "100% prime Wagyu patties, brioche buns, aged cheddar, and house caramelized shallots.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=burgers",
    keywords: ["burger", "burgers", "wagyu", "smash", "beef", "patty", "cheeseburger"],
  },
  {
    id: "cat-sushi",
    type: "category",
    title: "Japanese Sushi & Sashimi",
    subtitle: "22 Fresh Seafood Rolls",
    description: "Wild-caught Atlantic salmon, flame-torched aburi nigiri, and signature handcrafted rolls.",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food?category=sushi",
    keywords: ["sushi", "sashimi", "salmon", "tuna", "rolls", "japanese", "nigiri", "maki"],
  },

  // ── 📰 Blog Articles & Guides ──
  {
    id: "blog-sourdough",
    type: "blog",
    title: "The Art of 48-Hour Fermented Sourdough Pizza",
    category: "Blog / Pizza",
    subtitle: "By Chef Marco Rossi • 5 min read",
    description: "Learn traditional Italian fermentation secrets for creating light, bubbly crusts with maximum depth of flavor.",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviews: 84,
    tag: "Trending Guide",
    targetUrl: "/Blog",
    keywords: ["blog", "article", "sourdough", "fermentation", "pizza making", "chef tips", "dough"],
  },
  {
    id: "blog-wagyu",
    type: "blog",
    title: "Mastering the Crispy Smashed Wagyu Burger",
    category: "Blog / Burgers",
    subtitle: "By Chef Alex Rivera • 4 min read",
    description: "The exact griddle temperature, searing technique, and cheese melt timing for legendary homemade smash burgers.",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviews: 62,
    tag: "Grill Guide",
    targetUrl: "/Blog",
    keywords: ["blog", "article", "wagyu", "smash burger", "grill", "burger technique"],
  },

  // ── 📄 Pages & Navigation with Photos ──
  {
    id: "page-food",
    type: "page",
    title: "Food Menu & Online Ordering",
    subtitle: "Complete Catalog (120+ Dishes)",
    description: "Browse our complete food menu, filter by dietary preferences, customize dishes, and order online.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Food",
    keywords: ["food", "menu", "dishes", "order", "eat", "catalog", "delivery"],
  },
  {
    id: "page-home",
    type: "page",
    title: "TastyByte Home Hub",
    subtitle: "Featured Daily Specials & Deals",
    description: "Explore today's special deals, trending dishes, discount swiper, and category explorer.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/",
    keywords: ["home", "main", "start", "landing", "welcome"],
  },
  {
    id: "page-latest-food",
    type: "page",
    title: "Latest Arrivals & New Dishes",
    subtitle: "Fresh Kitchen Releases",
    description: "Discover the newest culinary creations freshly crafted by our master chefs this season.",
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Lastest_Food",
    keywords: ["latest", "new", "fresh", "arrivals", "seasonal"],
  },
  {
    id: "page-blog",
    type: "page",
    title: "Foodie Blog & Culinary Guides",
    subtitle: "Chef Secrets & Recipes",
    description: "Read masterclass guides on pizza fermentation, wagyu searing, sushi slicing, and drink pairing.",
    imageUrl: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Blog",
    keywords: ["blog", "article", "recipe", "guides", "cooking", "chef tips", "stories"],
  },
  {
    id: "page-contact",
    type: "page",
    title: "Contact & Store Location",
    subtitle: "Customer Support & Hours",
    description: "Get in touch with customer support, check restaurant open hours, and get directions in Phnom Penh.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    targetUrl: "/Contact",
    keywords: ["contact", "support", "help", "phone", "email", "address", "location", "hours"],
  },
];

const QUICK_TRENDING_SEARCHES = [
  "Truffle Pizza",
  "Wagyu Burger",
  "Salmon Aburi",
  "Flash Sale",
  "Matcha Latte",
  "Family Feast",
  "Vegan Bowl",
];

// Helper to highlight matching user typed words
export function HighlightText({
  text,
  highlight,
}: {
  text?: string;
  highlight: string;
}) {
  if (!text) return null;
  if (!highlight.trim()) return <span>{text}</span>;

  const words = highlight
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (words.length === 0) return <span>{text}</span>;

  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, idx) =>
        regex.test(part) ? (
          <mark
            key={idx}
            className="bg-emerald-100 text-emerald-900 font-extrabold px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | SearchResultType>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Smart multi-keyword relevance search matching & scoring
  const { filteredResults, tabCounts } = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    const tokens = cleanQuery.split(/\s+/).filter(Boolean);

    const counts: Record<string, number> = {
      all: 0,
      food: 0,
      flash_sale: 0,
      promotion: 0,
      category: 0,
      blog: 0,
      page: 0,
    };

    const scoredItems = GLOBAL_SEARCH_ITEMS.map((item) => {
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const catLower = item.category?.toLowerCase() || "";
      const subtitleLower = item.subtitle?.toLowerCase() || "";
      const tagLower = item.tag?.toLowerCase() || "";
      const keywords = item.keywords?.map((k) => k.toLowerCase()) || [];

      if (tokens.length === 0) {
        counts.all++;
        if (counts[item.type] !== undefined) counts[item.type]++;
        return { item, score: 1 };
      }

      let score = 0;
      let matchesAllTokens = true;

      for (const token of tokens) {
        const inTitle = titleLower.includes(token);
        const inCat = catLower.includes(token);
        const inKeywords = keywords.some((k) => k.includes(token));
        const inDesc = descLower.includes(token);
        const inSub = subtitleLower.includes(token);
        const inTag = tagLower.includes(token);

        if (!inTitle && !inCat && !inKeywords && !inDesc && !inSub && !inTag) {
          matchesAllTokens = false;
          break;
        }

        if (titleLower.startsWith(token)) score += 50;
        if (inTitle) score += 30;
        if (inCat) score += 20;
        if (inKeywords) score += 15;
        if (inTag) score += 10;
        if (inDesc) score += 5;
      }

      if (matchesAllTokens && score > 0) {
        counts.all++;
        if (counts[item.type] !== undefined) counts[item.type]++;
        return { item, score };
      }

      return { item, score: 0 };
    }).filter((res) => res.score > 0);

    // Sort by relevance score
    scoredItems.sort((a, b) => b.score - a.score);

    let finalItems = scoredItems.map((s) => s.item);

    if (selectedTab !== "all") {
      finalItems = finalItems.filter((item) => item.type === selectedTab);
    }

    return {
      filteredResults: finalItems,
      tabCounts: counts,
    };
  }, [query, selectedTab]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedTab]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
      scrollToActive(selectedIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
      scrollToActive(selectedIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      } else if (query.trim()) {
        router.push(`/Food?search=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    }
  };

  const scrollToActive = (index: number) => {
    const list = listRef.current;
    if (!list) return;
    const items = list.querySelectorAll("[data-search-item]");
    if (items[index]) {
      items[index].scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };

  const handleSelectItem = (item: SearchableItem) => {
    onClose();
    router.push(item.targetUrl);
  };

  if (!isOpen) return null;

  const getTypeBadge = (type: SearchResultType) => {
    switch (type) {
      case "food":
        return { label: "Dish", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Pizza };
      case "flash_sale":
        return { label: "Flash Deal", bg: "bg-rose-50 text-rose-700 border-rose-200", icon: Zap };
      case "promotion":
        return { label: "Promotion", bg: "bg-amber-50 text-amber-700 border-amber-200", icon: Percent };
      case "blog":
        return { label: "Article", bg: "bg-blue-50 text-blue-700 border-blue-200", icon: BookOpen };
      case "category":
        return { label: "Category", bg: "bg-purple-50 text-purple-700 border-purple-200", icon: Compass };
      case "page":
        return { label: "Page", bg: "bg-slate-100 text-slate-700 border-slate-200", icon: ExternalLink };
      case "contact":
        return { label: "Service", bg: "bg-teal-50 text-teal-700 border-teal-200", icon: Phone };
    }
  };

  return (
    <div
      className=" fixed inset-0 z-[100] flex items-start justify-center pt-8 sm:pt-16 px-3 sm:px-4 bg-slate-900/60 transition-opacity duration-200 animate-fadeIn"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden flex flex-col max-h-[85vh] transition-all transform animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header & Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-white">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-emerald-600 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, burgers, pizza, deals, blogs , restaurant..."
              className="w-full pl-12 pr-24 py-3.5 bg-gray-50/90 hover:bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 font-medium text-sm sm:text-base rounded-2xl border border-gray-200/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition-all shadow-inner"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Clear search text"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-red-400 text-white font-bold p-2 rounded-lg hover:bg-red-500 transition-colors">
                Close
              </button>
            </div>
          </div>

          {/* Filter Categories Tabs */}
          <div className="flex items-center gap-1.5 mt-3.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { id: "all", label: "All Items" },
              { id: "food", label: "🍕 Food Dishes" },
              { id: "flash_sale", label: "⚡ Flash Deals" },
              { id: "promotion", label: "🏷️ Promotions" },
              { id: "category", label: "🧭 Categories" },
              { id: "blog", label: "📰 Blog Guides" },
              { id: "page", label: "📄 Pages" },
            ].map((tab) => {
              const isActive = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200/70 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Suggestions / Trending Chips when no query */}
        {!query && (
          <div className="px-5 py-2.5 bg-emerald-50/40 border-b border-emerald-100/60 flex items-center gap-2 flex-wrap">
            <span className="text-[11.5px] font-bold text-emerald-800 flex items-center gap-1">
              <Sparkles size={13} className="text-amber-500" />
              <span>Trending:</span>
            </span>
            {QUICK_TRENDING_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 text-xs font-medium text-emerald-900 bg-white hover:bg-emerald-600 hover:text-white rounded-lg border border-emerald-200/80 shadow-2xs transition-all active:scale-95"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Results List Area */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const badge = getTypeBadge(item.type);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={item.id}
                  data-search-item
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group relative p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all duration-150 flex items-start gap-3.5 border ${
                    isSelected
                      ? "bg-emerald-50/70 border-emerald-300/80 shadow-sm"
                      : "bg-white hover:bg-gray-50/80 border-gray-100"
                  }`}
                >
                  {/* Image Display with Fallback */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200/80 bg-gray-100 shadow-2xs">
                    <img
                      src={item.imageUrl || DEFAULT_FALLBACK_IMAGE}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                    />
                    {item.discountPercent && (
                      <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white font-extrabold text-[9px] px-1 py-0.2 rounded shadow-xs">
                        -{item.discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${badge.bg}`}
                      >
                        <BadgeIcon size={11} />
                        <span>{badge.label}</span>
                      </span>

                      {item.category && (
                        <span className="text-[11px] font-semibold text-gray-500">
                          • <HighlightText text={item.category} highlight={query} />
                        </span>
                      )}

                      {item.tag && (
                        <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          {item.tag}
                        </span>
                      )}

                      {item.rating && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span>{item.rating.toFixed(1)}</span>
                          {item.reviews && (
                            <span className="text-gray-400 text-[10px]">({item.reviews})</span>
                          )}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      <HighlightText text={item.title} highlight={query} />
                    </h4>

                    {item.subtitle && (
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        <HighlightText text={item.subtitle} highlight={query} />
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      <HighlightText text={item.description} highlight={query} />
                    </p>
                  </div>

                  {/* Right Price & Arrow Jump */}
                  <div className="flex flex-col items-end justify-between shrink-0 self-stretch">
                    {item.price !== undefined ? (
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-emerald-700">
                          ${item.price.toFixed(2)}
                        </div>
                        {item.originalPrice && (
                          <div className="text-[11px] text-gray-400 line-through">
                            ${item.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Explore
                      </span>
                    )}

                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white translate-x-0.5"
                          : "bg-gray-100 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                      }`}
                    >
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty State */
            <div className="py-12 px-4 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Search size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                No matching results found for &quot;{query}&quot;
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                Try searching for pizza, wagyu burger, sushi, vegan bowls, dessert recipes, or contact info.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push(`/Food?search=${encodeURIComponent(query.trim())}`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                >
                  Search in Full Food Menu
                </button>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-4 py-2 rounded-xl transition-all"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600">
                ↵
              </kbd>
              <span>to select</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600">
                ESC
              </kbd>
              <span>to close</span>
            </span>
          </div>

          <div className="font-semibold text-emerald-700">
            {filteredResults.length} {filteredResults.length === 1 ? "result" : "results"} found
          </div>
        </div>
      </div>
    </div>
  );
}
