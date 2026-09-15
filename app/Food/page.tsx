"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "../components/topbar";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Footer from "../components/Footer";
import PictureCard, { FoodMenuItem } from "./PictureCard";
import CartPanel, { CartItem } from "./CartPanel";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  ArrowUpDown,
  X,
  ChevronRight,
  Receipt,
} from "lucide-react";

const FOOD_ITEMS: FoodMenuItem[] = [
  // Pizza (18 category)
  {
    id: "p1",
    name: "Truffle Burrata Margherita",
    category: "Pizza",
    categoryId: "pizza",
    price: 18.5,
    originalPrice: 22.0,
    rating: 4.9,
    reviews: 142,
    description:
      "San Marzano tomato coulis, creamy burrata pugliese, fragrant basil, and white truffle oil.",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    tag: "Popular",
    prepTime: "15-20 min",
    calories: 780,
    isVegetarian: true,
  },
  {
    id: "p2",
    name: "Pepperoni Diavola Crisp",
    category: "Pizza",
    categoryId: "pizza",
    price: 17.0,
    rating: 4.8,
    reviews: 98,
    description:
      "Spicy Calabrese artisan pepperoni, hot honey drizzle, fior di latte, and fresh oregano.",
    imageUrl:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    tag: "Chef's Pick",
    prepTime: "15 min",
    calories: 850,
  },
  {
    id: "p3",
    name: "Quattro Formaggi Riserva",
    category: "Pizza",
    categoryId: "pizza",
    price: 19.0,
    originalPrice: 21.5,
    rating: 4.7,
    reviews: 76,
    description:
      "Gorgonzola dolce, aged pecorino, smoked provolone, mozzarella, and toasted walnuts.",
    imageUrl:
      "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80",
    prepTime: "18 min",
    calories: 820,
    isVegetarian: true,
  },
  {
    id: "p4",
    name: "Smoky BBQ Wood-Fired Chicken",
    category: "Pizza",
    categoryId: "pizza",
    price: 18.0,
    rating: 4.8,
    reviews: 110,
    description:
      "Charred chicken breast, sweet chipotle BBQ glaze, red onions, cilantro, and smoked gouda.",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    tag: "Trending",
    prepTime: "20 min",
    calories: 890,
  },

  // Burgers (14 category)
  {
    id: "b1",
    name: "Double Wagyu Smash Burger",
    category: "Burgers",
    categoryId: "burgers",
    price: 16.5,
    originalPrice: 19.0,
    rating: 4.9,
    reviews: 165,
    description:
      "Dual prime Wagyu patties smashed crispy, aged Wisconsin cheddar, caramelized shallots, on brioche.",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    tag: "Best Seller",
    prepTime: "12 min",
    calories: 920,
  },
  {
    id: "b2",
    name: "Crispy Buttermilk Hot Chicken",
    category: "Burgers",
    categoryId: "burgers",
    price: 14.5,
    rating: 4.8,
    reviews: 120,
    description:
      "24-hr brined tender chicken breast, Nashville spice, creamy slaw, and house pickles.",
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    tag: "Spicy",
    prepTime: "15 min",
    calories: 790,
  },
  {
    id: "b3",
    name: "Smoked Bacon & Cheddar Deluxe",
    category: "Burgers",
    categoryId: "burgers",
    price: 15.5,
    rating: 4.7,
    reviews: 84,
    description:
      "Applewood smoked thick-cut bacon, melted sharp cheddar, garlic aioli, and butterhead lettuce.",
    imageUrl:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    prepTime: "12 min",
    calories: 860,
  },
  {
    id: "b4",
    name: "Truffle Portobello Veggie Burger",
    category: "Burgers",
    categoryId: "burgers",
    price: 14.0,
    rating: 4.6,
    reviews: 62,
    description:
      "Balsamic grilled giant portobello cap, truffle mayo, baby arugula, and goat cheese spread.",
    imageUrl:
      "https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?auto=format&fit=crop&w=800&q=80",
    prepTime: "14 min",
    calories: 640,
    isVegetarian: true,
  },

  // Sushi (22 category)
  {
    id: "s1",
    name: "Flame-Torched Salmon Aburi Roll",
    category: "Sushi",
    categoryId: "sushi",
    price: 16.0,
    rating: 4.9,
    reviews: 130,
    description:
      "Seared Atlantic salmon, ripe avocado, unagi glaze, spicy kewpie, and crispy tobiko.",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    tag: "Signature",
    prepTime: "10 min",
    calories: 450,
  },
  {
    id: "s2",
    name: "Grand Sashimi Moriawase",
    category: "Sushi",
    categoryId: "sushi",
    price: 26.0,
    originalPrice: 30.0,
    rating: 4.9,
    reviews: 88,
    description:
      "Chef selection of prime Bluefin tuna, King salmon, yellowtail hamachi, and Hokkaido scallop.",
    imageUrl:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80",
    tag: "Premium",
    prepTime: "15 min",
    calories: 380,
  },
  {
    id: "s3",
    name: "Dragon Eel & Avocado Crunch",
    category: "Sushi",
    categoryId: "sushi",
    price: 17.5,
    rating: 4.8,
    reviews: 74,
    description:
      "Crispy tempura prawn topped with glazed BBQ unagi eel, creamy avocado slices, and toasted sesame.",
    imageUrl:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80",
    prepTime: "12 min",
    calories: 520,
  },

  // Soups (9 category)
  {
    id: "sp1",
    name: "Tonkotsu Chashu Ramen",
    category: "Soups",
    categoryId: "soups",
    price: 15.0,
    rating: 4.9,
    reviews: 195,
    description:
      "20-hour rich pork bone broth, tender slow-cooked pork belly chashu, ajitsuke tamago egg, and nori.",
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    tag: "Popular",
    prepTime: "10 min",
    calories: 680,
  },
  {
    id: "sp2",
    name: "Velvety Tomato Basil Bisque",
    category: "Soups",
    categoryId: "soups",
    price: 9.5,
    rating: 4.7,
    reviews: 64,
    description:
      "Slow-simmered vine tomatoes, roasted garlic, sweet cream, sourdough garlic croutons.",
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    prepTime: "8 min",
    calories: 340,
    isVegetarian: true,
  },
  {
    id: "sp3",
    name: "Thai Coconut Lemongrass Tom Yum",
    category: "Soups",
    categoryId: "soups",
    price: 13.5,
    rating: 4.8,
    reviews: 82,
    description:
      "Jumbo prawns, galangal, kaffir lime leaves, straw mushrooms in an aromatic coconut broth.",
    imageUrl:
      "https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&w=800&q=80",
    tag: "Chef's Pick",
    prepTime: "12 min",
    calories: 420,
  },

  // Salads (16 category)
  {
    id: "sl1",
    name: "Mediterranean Greek Quinoa Bowl",
    category: "Salads",
    categoryId: "salads",
    price: 12.5,
    rating: 4.8,
    reviews: 89,
    description:
      "Organic tri-color quinoa, Kalamata olives, cucumbers, cherry tomatoes, creamy feta, and lemon oregano vinaigrette.",
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    prepTime: "8 min",
    calories: 410,
    isVegetarian: true,
  },
  {
    id: "sl2",
    name: "Grilled Salmon Caesar Harvest",
    category: "Salads",
    categoryId: "salads",
    price: 16.5,
    rating: 4.9,
    reviews: 114,
    description:
      "Crisp romaine hearts, herb-crusted grilled salmon, shaved 24-month parmesan, and house Caesar dressing.",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    tag: "Healthy",
    prepTime: "10 min",
    calories: 520,
  },

  // Vegan (11 category)
  {
    id: "v1",
    name: "Rainbow Tofu Poke Bowl",
    category: "Vegan",
    categoryId: "vegan",
    price: 13.5,
    rating: 4.8,
    reviews: 73,
    description:
      "Organic sesame-crusted tofu, edamame, sliced avocado, pickled ginger, sea salad, and tamari drizzle.",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    tag: "Vegan",
    prepTime: "8 min",
    calories: 460,
    isVegetarian: true,
  },
  {
    id: "v2",
    name: "Green Goddess Harvest Bowl",
    category: "Vegan",
    categoryId: "vegan",
    price: 12.0,
    rating: 4.7,
    reviews: 55,
    description:
      "Kale, roasted sweet potatoes, spiced chickpeas, creamy tahini green goddess dressing, pumpkin seeds.",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    prepTime: "10 min",
    calories: 390,
    isVegetarian: true,
  },

  // Drinks (20 category)
  {
    id: "d1",
    name: "Ceremonial Iced Matcha Latte",
    category: "Drinks",
    categoryId: "drinks",
    price: 5.5,
    rating: 4.9,
    reviews: 145,
    description:
      "Single-origin Uji matcha whisked fresh over oat milk and light organic agave nectar.",
    imageUrl:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    tag: "Trending",
    prepTime: "3 min",
    calories: 140,
    isVegetarian: true,
  },
  {
    id: "d2",
    name: "Fresh Strawberry Mint Mojito Mocktail",
    category: "Drinks",
    categoryId: "drinks",
    price: 6.0,
    rating: 4.8,
    reviews: 87,
    description:
      "Muddled wild strawberries, crushed spearmint, fresh lime juice, and sparkling soda.",
    imageUrl:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    prepTime: "3 min",
    calories: 110,
    isVegetarian: true,
  },
  {
    id: "d3",
    name: "Cold Brew Nitro Supreme",
    category: "Drinks",
    categoryId: "drinks",
    price: 5.0,
    rating: 4.7,
    reviews: 92,
    description:
      "Slow-steeped Arabica blend infused with nitrogen for a velvety, creamy cascade.",
    imageUrl:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
    prepTime: "2 min",
    calories: 15,
    isVegetarian: true,
  },

  // Desserts (18 category)
  {
    id: "ds1",
    name: "Classic Tiramisu Della Casa",
    category: "Desserts",
    categoryId: "desserts",
    price: 8.5,
    rating: 4.9,
    reviews: 180,
    description:
      "Espresso-soaked Savoiardi ladyfingers, rich mascarpone zabaglione, and dark cocoa dust.",
    imageUrl:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    tag: "Chef's Special",
    prepTime: "5 min",
    calories: 420,
    isVegetarian: true,
  },
  {
    id: "ds2",
    name: "Belgian Molten Chocolate Lava Cake",
    category: "Desserts",
    categoryId: "desserts",
    price: 9.0,
    rating: 4.9,
    reviews: 154,
    description:
      "Warm Callebaut 70% dark chocolate cake with a molten center, paired with vanilla bean gelato.",
    imageUrl:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    prepTime: "8 min",
    calories: 560,
    isVegetarian: true,
  },
  {
    id: "ds3",
    name: "San Sebastián Basque Cheesecake",
    category: "Desserts",
    categoryId: "desserts",
    price: 8.0,
    rating: 4.8,
    reviews: 96,
    description:
      "Caramelized baked crust with an ultra-creamy, custard-like center and berry compote.",
    imageUrl:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    prepTime: "5 min",
    calories: 480,
    isVegetarian: true,
  },
];

const CATEGORY_META: Record<
  string,
  { label: string; count: number; description: string }
> = {
  all: {
    label: "All Dishes",
    count: 128,
    description: "Browse our complete chef-crafted food & beverage selection.",
  },
  pizza: {
    label: "Artisan Pizzas",
    count: 18,
    description:
      "Hand-stretched dough fermented for 48 hours, baked in wood-fired ovens.",
  },
  burgers: {
    label: "Gourmet Burgers",
    count: 14,
    description:
      "Prime aged beef patties and buttermilk chicken served on toasted brioche.",
  },
  sushi: {
    label: "Japanese Sushi & Sashimi",
    count: 22,
    description:
      "Ultra-fresh sashimi-grade fish skillfully prepared by our master sushi chefs.",
  },
  soups: {
    label: "Warm Soups & Noodles",
    count: 9,
    description:
      "Hearty, nutrient-rich broths simmered for hours with premium ingredients.",
  },
  salads: {
    label: "Fresh Organic Salads",
    count: 16,
    description:
      "Crispy greens, vibrant seasonal veggies, and scratch-made dressings.",
  },
  vegan: {
    label: "Plant-Based & Vegan",
    count: 11,
    description:
      "100% plant-powered creations packed with wholesome flavor and nourishment.",
  },
  drinks: {
    label: "Artisanal Drinks & Brews",
    count: 20,
    description:
      "Handcrafted specialty coffee, mocktails, iced teas, and refreshing smoothies.",
  },
  desserts: {
    label: "Handcrafted Desserts",
    count: 18,
    description:
      "Decadent cakes, traditional pastries, and sweet delights to finish your meal.",
  },
};

function FoodCatalogContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search") || searchParams.get("q");

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "all"
  );
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  // Sync category and search query selection when URL query param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam !== null && searchParam !== undefined) {
      setSearchQuery(searchParam);
    }
  }, [searchParam]);

  // Cart State - starts completely empty (0 items)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Controls the Slide-in Right Order Sidebar
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const currentMeta = CATEGORY_META[selectedCategory] || CATEGORY_META.all;
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const { requireAuth } = useAuth();

  // Filter & sort food items
  const filteredItems = useMemo(() => {
    return FOOD_ITEMS.filter((item) => {
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
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      // Vegetarian filter
      if (vegetarianOnly && !item.isVegetarian) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // featured default
    });
  }, [selectedCategory, searchQuery, vegetarianOnly, sortBy]);

  // When Add is pressed -> Requires user to be logged in before adding to cart
  const handleAddToCart = (food: FoodMenuItem) => {
    requireAuth(() => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === food.id);
        if (existing) {
          return prev.map((i) =>
            i.id === food.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          return [
            ...prev,
            {
              id: food.id,
              name: food.name,
              category: food.category,
              price: food.price,
              quantity: 1,
              imageUrl: food.imageUrl,
            },
          ];
        }
      });

      setLastAddedItem(food.name);
      setTimeout(() => setLastAddedItem(null), 3000);
    }, `Please log in to order ${food.name}.`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="sticky top-0 z-50 w-full bg-white transition-all duration-200">
        <TopBar />
        <Navbar />

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white py-7 px-4 sm:px-6 lg:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles size={15} className="text-amber-300" />
                <span>Our Food Menu &amp; Ordering</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {currentMeta.label}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 max-w-xl">
                {currentMeta.description}
              </p>
            </div>

            {/* Header Right Stats & Order Button */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                <div className="text-left">
                  <div className="text-[10px] text-emerald-200 uppercase font-medium">
                    Menu Total
                  </div>
                  <div className="text-base font-bold text-white">
                    {currentMeta.count} Items
                  </div>
                </div>
                <div className="h-7 w-px bg-white/20" />
                <div className="text-left">
                  <div className="text-[10px] text-emerald-200 uppercase font-medium">
                    Displayed
                  </div>
                  <div className="text-base font-bold text-amber-300">
                    {filteredItems.length}
                  </div>
                </div>
              </div>

              {/* View Order Trigger Button */}
              <button
                type="button"
                onClick={() => setIsRightSidebarOpen(true)}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-4 py-2.5 rounded-2xl shadow-sm text-xs transition-all active:scale-95"
              >
                <ShoppingBag size={16} />
                <span>View Order ({totalCartCount}) • ${totalCartSubtotal.toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            
            {/* Left Category Sidebar with amount of each menu */}
            <div className="w-full md:w-64 shrink-0 sticky top-20">
              <Sidebar
                activeCategory={selectedCategory}
                onSelectAction={(id) => setSelectedCategory(id)}
                cartCount={totalCartCount}
              />

              {/* Quick info card */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs hidden md:block">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 uppercase mb-1">
                  <span>⚡ Fast Order</span>
                </div>
                <h4 className="text-xs font-bold">Free Delivery Over $35</h4>
                <p className="text-[11px] text-emerald-100 mt-1 leading-relaxed">
                  Click <b>Add</b> on any menu card to see the order sidebar slide in from the right with instant bill calculation!
                </p>
              </div>
            </div>

            {/* Food Picture Cards Grid Area */}
            <div className="flex-1 w-full min-w-0">
              
              {/* Search & Filter Toolbar */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search dishes, ingredients, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
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

                  {/* Sort Dropdown */}
                  <div className="relative flex items-center">
                    <ArrowUpDown size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
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
                <div className="mb-4 flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-xs animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      Added <strong>{lastAddedItem}</strong> to order!
                    </span>
                  </div>
                  <button
                    onClick={() => setIsRightSidebarOpen(true)}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold text-[11.5px] bg-emerald-100/70 hover:bg-emerald-200/80 px-2.5 py-1 rounded-xl transition-colors"
                  >
                    <span>View Order</span>
                    <ChevronRight size={13} />
                  </button>
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
                    We couldn&apos;t find any items matching &quot;{searchQuery}&quot; in this category.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setVegetarianOnly(false);
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

        {/* ============================================================ */}
        {/* SLIDE-OUT ORDER SIDEBAR (Sliding from Right Side of Screen) */}
        {/* ============================================================ */}
        
        {/* Dimmed Overlay Backdrop */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${
            isRightSidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsRightSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* The Right Order Sidebar Container */}
        <aside
          className={`fixed top-0 right-0 bottom-0 w-full sm:w-[420px] max-w-full bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
            isRightSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Order Cart Sidebar"
        >
          <CartPanel
            items={cartItems}
            onCloseAction={() => setIsRightSidebarOpen(false)}
            onUpdateQuantityAction={handleUpdateQuantity}
            onRemoveItemAction={handleRemoveItem}
            onClearCartAction={handleClearCart}
            isFloatingDrawer={true}
          />
        </aside>

        {/* Floating Side Tab / Button (Sticky on right side for easy access) */}
        <button
          type="button"
          onClick={() => setIsRightSidebarOpen((prev) => !prev)}
          className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-3 rounded-l-2xl shadow-xl flex flex-col items-center gap-2 border-l border-t border-b border-emerald-500/40 transition-all ${
            isRightSidebarOpen ? "translate-x-full" : "translate-x-0"
          }`}
          aria-label="Toggle Order Sidebar"
        >
          <div className="relative">
            <ShoppingBag size={20} />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-900 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold tracking-tight writing-mode-vertical">
            Order • ${totalCartSubtotal.toFixed(0)}
          </span>
        </button>

      </div>

      <Footer />
    </div>
  );
}

export default function FoodPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-emerald-800">
              Loading menu...
            </span>
          </div>
        </div>
      }
    >
      <FoodCatalogContent />
    </Suspense>
  );
}
