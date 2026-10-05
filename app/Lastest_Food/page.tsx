"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TopBar from "../components/topbar";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import PictureCard, { FoodMenuItem } from "../Food/PictureCard";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import {
  Search,
  Sparkles,
  CheckCircle2,
  ArrowUpDown,
  Flame,
  UtensilsCrossed,
  Pizza,
  Fish,
  Salad,
  IceCream,
  CupSoda,
  Clock,
  Hamburger,
  Tag,
  Eye,
  Users,
  Store,
  MapPin,
  Award,
  ShieldCheck,
} from "lucide-react";

const LATEST_FOOD_ITEMS: FoodMenuItem[] = [
  // Brunch & Bowls
  {
    id: "lf-1",
    name: "Smoked Salmon Brioche Benedict",
    category: "Breakfast & Brunch",
    categoryId: "brunch",
    price: 14.5,
    originalPrice: 17.5,
    rating: 4.9,
    reviews: 64,
    description:
      "Poached organic eggs, smoked Norwegian salmon, velvety hollandaise, and micro-herbs on golden toasted brioche.",
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    tag: "New Arrival",
    prepTime: "15 min",
    calories: 480,
    isNew: true,
  },
  {
    id: "lf-2",
    name: "Avocado & Grilled Halloumi Nourish Bowl",
    category: "Breakfast & Brunch",
    categoryId: "brunch",
    price: 13.75,
    originalPrice: 16.0,
    rating: 4.9,
    reviews: 51,
    description:
      "Pan-seared Cypriot halloumi, Hass avocado slices, tri-color quinoa, roasted chickpeas, and tahini herb dressing.",
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    tag: "Organic",
    prepTime: "12 min",
    calories: 390,
    isVegetarian: true,
    isNew: true,
  },
  {
    id: "lf-3",
    name: "Truffle Ricotta Wild Mushroom Toast",
    category: "Breakfast & Brunch",
    categoryId: "brunch",
    price: 12.5,
    rating: 4.8,
    reviews: 42,
    description:
      "Sautéed chanterelle and cremini mushrooms, whipped herb ricotta, white truffle oil on charred country sourdough.",
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    tag: "Chef's Choice",
    prepTime: "10 min",
    calories: 360,
    isVegetarian: true,
    isNew: true,
  },
  {
    id: "lf-4",
    name: "Acai Berry Dragon Superfood Bowl",
    category: "Breakfast & Brunch",
    categoryId: "brunch",
    price: 11.0,
    originalPrice: 13.5,
    rating: 4.9,
    reviews: 58,
    description:
      "Thick Brazilian acai blend, chia seed pudding, dragonfruit cubes, toasted coconut flakes, and raw wildflower honey.",
    imageUrl:
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80",
    tag: "Superfood",
    prepTime: "8 min",
    calories: 310,
    isVegetarian: true,
    isNew: true,
  },

  // Artisan Pizzas
  {
    id: "lf-5",
    name: "Artisan Wood-Fired Prosciutto & Fig",
    category: "Artisan Pizza",
    categoryId: "pizza",
    price: 18.99,
    originalPrice: 22.0,
    rating: 4.8,
    reviews: 82,
    description:
      "Crispy hand-stretched sourdough, Parma prosciutto, black mission figs, gorgonzola crumble, and balsamic reduction.",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    tag: "Chef's Choice",
    prepTime: "20 min",
    calories: 620,
    isNew: true,
  },
  {
    id: "lf-6",
    name: "Truffle Burrata Margherita",
    category: "Artisan Pizza",
    categoryId: "pizza",
    price: 18.5,
    originalPrice: 21.0,
    rating: 4.9,
    reviews: 142,
    description:
      "San Marzano tomato coulis, creamy burrata pugliese, fragrant basil, and white truffle oil.",
    imageUrl:
      "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80",
    tag: "Trending",
    prepTime: "18 min",
    calories: 780,
    isVegetarian: true,
    isNew: true,
  },
  {
    id: "lf-7",
    name: "Smoky Chipotle Chicken & Corn Flatbread",
    category: "Artisan Pizza",
    categoryId: "pizza",
    price: 17.5,
    rating: 4.7,
    reviews: 49,
    description:
      "Wood-roasted chicken, fire-charred sweet corn, smoked gouda, cilantro crema, and crispy shallots.",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    tag: "New Arrival",
    prepTime: "15 min",
    calories: 710,
    isNew: true,
  },

  // Gourmet Burgers
  {
    id: "lf-8",
    name: "Black Angus Smash Cheeseburger",
    category: "Gourmet Burgers",
    categoryId: "burgers",
    price: 15.2,
    originalPrice: 18.5,
    rating: 4.9,
    reviews: 110,
    description:
      "Two 100% Black Angus smashed beef patties, melted sharp cheddar, caramelized onions, and signature secret relish.",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    tag: "Best Seller",
    prepTime: "15 min",
    calories: 710,
    isNew: true,
  },
  {
    id: "lf-9",
    name: "Nashville Hot Buttermilk Chicken Brioche",
    category: "Gourmet Burgers",
    categoryId: "burgers",
    price: 14.5,
    rating: 4.8,
    reviews: 95,
    description:
      "24-hr brined tender chicken breast, cayenne chili glaze, crunchy purple cabbage slaw, and dill pickles.",
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    tag: "Spicy",
    prepTime: "14 min",
    calories: 680,
    isNew: true,
  },
  {
    id: "lf-10",
    name: "Truffle Portobello & Goat Cheese Burger",
    category: "Gourmet Burgers",
    categoryId: "burgers",
    price: 14.0,
    originalPrice: 16.5,
    rating: 4.7,
    reviews: 63,
    description:
      "Balsamic grilled portobello mushroom, whipped chevre goat cheese, baby arugula, and black garlic mayo.",
    imageUrl:
      "https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?auto=format&fit=crop&w=800&q=80",
    prepTime: "12 min",
    calories: 590,
    isVegetarian: true,
    isNew: true,
  },

  // Premium Seafood
  {
    id: "lf-11",
    name: "Pan-Seared Sea Bass with Asparagus",
    category: "Premium Seafood",
    categoryId: "seafood",
    price: 24.0,
    originalPrice: 28.0,
    rating: 4.9,
    reviews: 43,
    description:
      "Crispy skin Mediterranean sea bass fillet, garlic butter asparagus, saffron potato puree, and lemon dill emulsion.",
    imageUrl:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    tag: "Premium",
    prepTime: "25 min",
    calories: 450,
    isNew: true,
  },
  {
    id: "lf-12",
    name: "Grilled Norwegian Salmon Poke Bowl",
    category: "Premium Seafood",
    categoryId: "seafood",
    price: 16.5,
    rating: 4.9,
    reviews: 78,
    description:
      "Fresh Atlantic salmon fillet, edamame, sliced avocado, pickled ginger, sea salad, and sesame soy reduction.",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    tag: "Healthy",
    prepTime: "12 min",
    calories: 490,
    isNew: true,
  },

  // Japanese & Asian
  {
    id: "lf-13",
    name: "Flame-Torched Salmon Aburi Roll",
    category: "Sushi & Asian",
    categoryId: "sushi",
    price: 16.0,
    originalPrice: 19.0,
    rating: 4.9,
    reviews: 130,
    description:
      "Seared Atlantic salmon, ripe avocado, unagi glaze, spicy kewpie, and crispy tobiko caviar.",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    tag: "Signature",
    prepTime: "10 min",
    calories: 450,
    isNew: true,
  },
  {
    id: "lf-14",
    name: "Tonkotsu Chashu Ramen Supreme",
    category: "Sushi & Asian",
    categoryId: "sushi",
    price: 15.5,
    rating: 4.9,
    reviews: 195,
    description:
      "20-hour rich pork bone broth, tender slow-cooked pork belly chashu, ajitsuke tamago egg, and nori crisps.",
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    tag: "Top Rated",
    prepTime: "10 min",
    calories: 680,
    isNew: true,
  },

  // Mexican Specialties
  {
    id: "lf-15",
    name: "Slow-Cooked Beef Short Rib Tacos",
    category: "Mexican Gourmet",
    categoryId: "tacos",
    price: 16.0,
    originalPrice: 19.5,
    rating: 4.8,
    reviews: 76,
    description:
      "Tender 12-hour braised beef short rib, pickled red onions, cotija cheese, salsa verde, and fresh cilantro on warm corn tortillas.",
    imageUrl:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    tag: "Chef's Special",
    prepTime: "18 min",
    calories: 540,
    isNew: true,
  },
  {
    id: "lf-16",
    name: "Crispy Baja Fish Tacos with Mango Slaw",
    category: "Mexican Gourmet",
    categoryId: "tacos",
    price: 15.0,
    rating: 4.8,
    reviews: 61,
    description:
      "Beer-battered catch of the day, fresh mango pico de gallo, shredded red cabbage, and chipotle crema.",
    imageUrl:
      "https://images.unsplash.com/photo-1512838243191-e81e88cc8c80?auto=format&fit=crop&w=800&q=80",
    tag: "New Arrival",
    prepTime: "12 min",
    calories: 470,
    isNew: true,
  },

  // Artisan Desserts
  {
    id: "lf-17",
    name: "Handcrafted Matcha Pistachio Tart",
    category: "Artisan Desserts",
    categoryId: "desserts",
    price: 8.5,
    rating: 4.8,
    reviews: 38,
    description:
      "Kyoto ceremonial grade matcha ganache, roasted pistachio praline crunch, nestled in a flaky French sable crust.",
    imageUrl:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    tag: "New Dessert",
    prepTime: "10 min",
    calories: 320,
    isVegetarian: true,
    isNew: true,
  },
  {
    id: "lf-18",
    name: "Belgian Molten Chocolate Lava Cake",
    category: "Artisan Desserts",
    categoryId: "desserts",
    price: 9.0,
    originalPrice: 11.0,
    rating: 4.9,
    reviews: 154,
    description:
      "Warm Callebaut 70% dark chocolate cake with a molten center, paired with Madagascar vanilla bean gelato.",
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    tag: "Must Try",
    prepTime: "8 min",
    calories: 560,
    isVegetarian: true,
    isNew: true,
  },

  // Specialty Drinks
  {
    id: "lf-19",
    name: "Dragonfruit Yuzu Chia Refresher",
    category: "Specialty Drinks",
    categoryId: "drinks",
    price: 6.5,
    rating: 4.7,
    reviews: 29,
    description:
      "Cold-pressed pink pitaya dragonfruit, sparkling Japanese yuzu, organic chia pearls, and fresh mint leaves.",
    imageUrl:
      "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
    tag: "Refreshing",
    prepTime: "5 min",
    calories: 140,
    isVegetarian: true,
    isNew: true,
  },
  {
    id: "lf-20",
    name: "Ceremonial Iced Uji Matcha Latte",
    category: "Specialty Drinks",
    categoryId: "drinks",
    price: 5.5,
    rating: 4.9,
    reviews: 145,
    description:
      "Single-origin Kyoto Uji matcha whisked fresh over organic oat milk and light amber agave nectar.",
    imageUrl:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    tag: "Trending",
    prepTime: "3 min",
    calories: 140,
    isVegetarian: true,
    isNew: true,
  },
];

const LATEST_CATEGORY_META: Record<
  string,
  { label: string; count: number; description: string; icon: any }
> = {
  all: {
    label: "All Latest Dishes",
    count: LATEST_FOOD_ITEMS.length,
    description:
      "Discover our newest culinary innovations, seasonal recipes, and freshly crafted dishes.",
    icon: UtensilsCrossed,
  },
  brunch: {
    label: "Breakfast & Brunch",
    count: 4,
    description:
      "Artisanal morning bowls, brioche benedicts, and nutrient-packed power foods.",
    icon: Salad,
  },
  pizza: {
    label: "Artisan Pizzas",
    count: 3,
    description:
      "Handcrafted wood-fired sourdough pizzas with seasonal gourmet toppings.",
    icon: Pizza,
  },
  burgers: {
    label: "Gourmet Burgers",
    count: 3,
    description:
      "Crispy smash patties, hot buttermilk chicken, and premium melted cheeses.",
    icon: Hamburger,
  },
  seafood: {
    label: "Premium Seafood",
    count: 2,
    description:
      "Wild-caught fresh Atlantic fish prepared with vibrant herbs and citrus.",
    icon: Fish,
  },
  sushi: {
    label: "Sushi & Asian",
    count: 2,
    description:
      "Signature torched aburi rolls, ramen broths, and fresh poke bowls.",
    icon: Flame,
  },
  tacos: {
    label: "Mexican Gourmet",
    count: 2,
    description:
      "Slow-braised meats, handmade corn tortillas, and freshly muddled salsas.",
    icon: Tag,
  },
  desserts: {
    label: "Artisan Desserts",
    count: 2,
    description:
      "Chef-crafted patisserie, matcha tarts, and molten lava cakes.",
    icon: IceCream,
  },
  drinks: {
    label: "Specialty Drinks",
    count: 2,
    description:
      "Freshly brewed ceremonial matcha, cold-pressed refreshers, and coffees.",
    icon: CupSoda,
  },
};

function LatestFoodCatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "featured" | "price-asc" | "price-desc" | "rating"
  >("featured");
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);

  // Sync category param from URL
  useEffect(() => {
    if (categoryParam && LATEST_CATEGORY_META[categoryParam]) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const currentMeta =
    LATEST_CATEGORY_META[selectedCategory] || LATEST_CATEGORY_META.all;

  const { requireAuth } = useAuth();
  const { orders, activeOrders, totalCartCount, totalCartSubtotal } = useOrders();

  // Filter & sort
  const filteredItems = useMemo(() => {
    return LATEST_FOOD_ITEMS.filter((item) => {
      // Category match
      if (selectedCategory !== "all" && item.categoryId !== selectedCategory) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchTag = item.tag?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat && !matchTag) return false;
      }
      // Vegetarian filter
      if (vegetarianOnly && !item.isVegetarian) {
        return false;
      }
      // New arrivals filter
      if (newOnly && !item.isNew) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured default
    });
  }, [selectedCategory, searchQuery, vegetarianOnly, newOnly, sortBy]);

  // Add to cart action - toast confirmation
  const handleAddToCart = (food: FoodMenuItem) => {
    setLastAddedItem(food.name);
    setTimeout(() => setLastAddedItem(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <TopBar />
        <Navbar />

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Sparkles size={16} className="text-amber-400 animate-pulse" />
                <span>Fresh From The Kitchen</span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  NEW RELEASES
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {currentMeta.label}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                {currentMeta.description}
              </p>
            </div>

            {/* Header Right Stats */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <div className="text-left">
                  <div className="text-[10px] text-emerald-200 uppercase font-medium">
                    Total Latest
                  </div>
                  <div className="text-base font-bold text-white">
                    {LATEST_FOOD_ITEMS.length} Dishes
                  </div>
                </div>
                <div className="h-7 w-px bg-white/20" />
                <div className="text-left">
                  <div className="text-[10px] text-emerald-200 uppercase font-medium">
                    Showing
                  </div>
                  <div className="text-base font-bold text-amber-300">
                    {filteredItems.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            
            {/* Left Category Sidebar */}
            <div className="w-full md:w-64 shrink-0 sticky top-20">
              <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-xs">
                <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Sparkles size={16} />
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      Latest Categories
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-gray-500">
                    Filter our newest menu additions by section
                  </p>
                </div>

                {/* Category navigation items */}
                <nav className="p-2 space-y-1">
                  {Object.entries(LATEST_CATEGORY_META).map(([key, meta]) => {
                    const IconComponent = meta.icon || UtensilsCrossed;
                    const isActive = selectedCategory === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <IconComponent
                            size={15}
                            className={isActive ? "text-white" : "text-emerald-600"}
                          />
                          <span>{meta.label}</span>
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {meta.count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Special Fast Delivery Banner */}
              <div className="mt-6 p-4.5 rounded-3xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-xs hidden md:block border border-emerald-600/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 uppercase mb-1">
                  <Clock size={14} className="text-amber-300" />
                  <span>⚡ Instant Ordering</span>
                </div>
                <h4 className="text-sm font-bold">Free Delivery Over $35</h4>
                <p className="text-[11.5px] text-emerald-100 mt-1 leading-relaxed">
                  Click <b>Add</b> on any fresh dish to order directly with live bill updates and free delivery discounts!
                </p>
              </div>
            </div>

            {/* Food Picture Cards Grid Area */}
            <div className="flex-1 w-full min-w-0">
              
              {/* Search & Filter Toolbar */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search latest dishes, ingredients, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filters / Sort Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Vegetarian Filter Pill */}
                  <button
                    type="button"
                    onClick={() => setVegetarianOnly(!vegetarianOnly)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                      vegetarianOnly
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span>🌱 Veg Only</span>
                  </button>

                  {/* New Arrivals Filter Pill */}
                  <button
                    type="button"
                    onClick={() => setNewOnly(!newOnly)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                      newOnly
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span>✨ New Only</span>
                  </button>

                  {/* Sort Dropdown */}
                  <div className="relative flex items-center">
                    <ArrowUpDown
                      size={14}
                      className="absolute left-3 text-gray-400 pointer-events-none"
                    />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      aria-label="Sort dishes"
                      className="pl-8 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="featured">Sort: Featured</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Toast Notification when item added */}
              {lastAddedItem && (
                <div className="mb-4 flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-xs animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      Added <strong>{lastAddedItem}</strong> to order!
                    </span>
                  </div>
                </div>
              )}

              {/* Cards Grid */}
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, idx) => (
                    <PictureCard
                      key={item.id}
                      item={item}
                      onAddToCartAction={handleAddToCart}
                      index={idx}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
                    <Search size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    No dishes found
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    We couldn&apos;t find any latest dishes matching &quot;{searchQuery}&quot; in this category.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setVegetarianOnly(false);
                      setNewOnly(false);
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default function LatestFoodPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-emerald-800">
              Loading latest menu...
            </span>
          </div>
        </div>
      }
    >
      <LatestFoodCatalogContent />
    </Suspense>
  );
}