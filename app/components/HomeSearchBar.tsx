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
  Check,
} from "lucide-react";
import {
  GLOBAL_SEARCH_ITEMS,
  SearchableItem,
  SearchResultType,
} from "./global-search-modal";

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

const POPULAR_SUGGESTIONS = [
  "Truffle Pizza",
  "Wagyu Burger",
  "Salmon Aburi",
  "Flash Sale",
  "Matcha Latte",
  "Vegan Bowl",
  "Sourdough Guide",
];

// Helper to highlight matching user typed words
function HighlightText({
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

export default function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"all" | SearchResultType>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smart multi-keyword relevance search matching & scoring
  const { filteredResults, relatedSuggestions, tabCounts } = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    const tokens = cleanQuery.split(/\s+/).filter(Boolean);

    // Compute counts per category for active query
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

    // Generate dynamic related keyword suggestions based on current typed query
    let suggestions: string[] = [];
    if (cleanQuery) {
      const relatedTitles = finalItems.slice(0, 4).map((i) => i.title);
      const relatedCategories = Array.from(
        new Set(finalItems.map((i) => i.category).filter(Boolean))
      ) as string[];
      suggestions = Array.from(
        new Set([...relatedCategories, ...relatedTitles])
      ).slice(0, 5);
    } else {
      suggestions = POPULAR_SUGGESTIONS;
    }

    return {
      filteredResults: finalItems.slice(0, 10),
      relatedSuggestions: suggestions,
      tabCounts: counts,
    };
  }, [query, selectedTab]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedTab]);

  const handleSelectItem = (item: SearchableItem) => {
    setIsDropdownOpen(false);
    router.push(item.targetUrl);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    if (query.trim()) {
      router.push(`/Food?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/Food');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        return;
      }
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) =>
          (prev - 1 + filteredResults.length) %
          Math.max(1, filteredResults.length)
      );
    }
  };

  const getTypeBadge = (type: SearchResultType) => {
    switch (type) {
      case "food":
        return {
          label: "Dish",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: Pizza,
        };
      case "flash_sale":
        return {
          label: "Flash Deal",
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          icon: Zap,
        };
      case "promotion":
        return {
          label: "Promotion",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Percent,
        };
      case "blog":
        return {
          label: "Article",
          bg: "bg-blue-50 text-blue-700 border-blue-200",
          icon: BookOpen,
        };
      case "category":
        return {
          label: "Category",
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          icon: Compass,
        };
      case "page":
        return {
          label: "Page",
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          icon: ExternalLink,
        };
      case "contact":
        return {
          label: "Service",
          bg: "bg-teal-50 text-teal-700 border-teal-200",
          icon: Phone,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-30">
      <div ref={containerRef} className="relative w-full">
        {/* Search Input Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className={`w-full bg-white rounded-2xl p-2 sm:p-2.5 shadow-xs border transition-all duration-200 flex items-center justify-between gap-3 ${
            isDropdownOpen
              ? "border-emerald-500 ring-4 ring-emerald-500/15 shadow-md"
              : "border-gray-200 hover:border-emerald-400"
          }`}
        >
          {/* Left search icon & text input */}
          <div className="flex items-center gap-3 pl-2 sm:pl-3 flex-1 min-w-0">
            <Search
              size={18}
              className="text-emerald-600 shrink-0 transition-transform"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!isDropdownOpen) setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Type to search dishes, burgers, pizza, deals, blogs, restaurant..."
              className="w-full text-xs sm:text-sm font-medium text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Clear query"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <span>Search</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* Floating Dropdown Results Menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-gray-200/90 overflow-hidden z-50 animate-fadeIn">
            {/* Filter Tabs in Dropdown with live result counts */}
            <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
              {[
                { id: "all", label: "All", count: tabCounts.all },
                { id: "food", label: "🍕 Food", count: tabCounts.food },
                { id: "flash_sale", label: "⚡ Deals", count: tabCounts.flash_sale },
                { id: "promotion", label: "🏷️ Promos", count: tabCounts.promotion },
                { id: "category", label: "🧭 Categories", count: tabCounts.category },
                { id: "blog", label: "📰 Blog", count: tabCounts.blog },
              ].map((tab) => {
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`px-2.5 py-1 rounded-xl font-semibold whitespace-nowrap transition-all text-[11px] flex items-center gap-1.5 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-gray-600 hover:bg-gray-200/70 border border-gray-200/60"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1 py-0.1 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-500 font-bold"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Related Query Suggestions while user is typing */}
            {relatedSuggestions.length > 0 && (
              <div className="px-4 py-2 bg-emerald-50/40 border-b border-emerald-100/60 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 shrink-0">
                  <Sparkles size={12} className="text-amber-500" />
                  <span>{query ? "Related:" : "Popular:"}</span>
                </span>
                {relatedSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="px-2.5 py-0.5 text-[11px] font-medium text-emerald-900 bg-white hover:bg-emerald-600 hover:text-white rounded-lg border border-emerald-200/80 shadow-2xs transition-all cursor-pointer"
                  >
                    <HighlightText text={suggestion} highlight={query} />
                  </button>
                ))}
              </div>
            )}

            {/* Results List with live search highlight */}
            <div
              ref={listRef}
              className="max-h-84 overflow-y-auto p-2 sm:p-3 space-y-1.5"
            >
              {filteredResults.length > 0 ? (
                filteredResults.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  const badge = getTypeBadge(item.type);
                  const BadgeIcon = badge.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`group p-2.5 rounded-2xl cursor-pointer transition-all duration-150 flex items-center gap-3 border ${
                        isSelected
                          ? "bg-emerald-50/90 border-emerald-300 shadow-2xs"
                          : "bg-white hover:bg-gray-50 border-transparent"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200/80 bg-gray-100">
                        <img
                          src={item.imageUrl || DEFAULT_FALLBACK_IMAGE}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              DEFAULT_FALLBACK_IMAGE;
                          }}
                        />
                        {item.discountPercent && (
                          <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white font-extrabold text-[8px] px-1 py-0.2 rounded">
                            -{item.discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Content with Real-time Matched Text Highlight */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9.5px] font-bold border ${badge.bg}`}
                          >
                            <BadgeIcon size={10} />
                            <span>{badge.label}</span>
                          </span>

                          {item.category && (
                            <span className="text-[10.5px] font-medium text-gray-500">
                              • <HighlightText text={item.category} highlight={query} />
                            </span>
                          )}

                          {item.rating && (
                            <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-amber-600">
                              <Star
                                size={10}
                                className="fill-amber-400 text-amber-400"
                              />
                              <span>{item.rating.toFixed(1)}</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate mt-0.5">
                          <HighlightText text={item.title} highlight={query} />
                        </h4>

                        <p className="text-[11px] text-gray-500 truncate mt-0.2">
                          <HighlightText text={item.description} highlight={query} />
                        </p>
                      </div>

                      {/* Price / Action */}
                      <div className="flex flex-col items-end shrink-0 pl-2">
                        {item.price !== undefined ? (
                          <span className="text-xs sm:text-sm font-bold text-emerald-700">
                            ${item.price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            View
                          </span>
                        )}
                        <ArrowRight
                          size={13}
                          className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all mt-1"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 px-4 text-center">
                  <p className="text-xs font-semibold text-gray-700">
                    No exact results for &quot;{query}&quot;
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Try searching pizza, wagyu, sushi, vegan, deals, or desserts.
                  </p>
                </div>
              )}
            </div>

            {/* Dropdown Footer Action */}
            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-gray-500 font-medium">
                {filteredResults.length} matches found
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push(
                    `/Food?search=${encodeURIComponent(query.trim())}`
                  );
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <span>View all in Food Menu</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
