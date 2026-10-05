"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TopBar from "../components/topbar";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import Footer from "../components/Footer";
import PictureCard, { FoodMenuItem } from "./PictureCard";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import {
  Search,
  Sparkles,
  CheckCircle2,
  ArrowUpDown,
  ShoppingBag,
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuIfU2gZnlYpfHO4Jr8SUXFzwjt7VNUhEOlEzqKmjlKQ&s=10",
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
    name: "Coconut Lemongrass Tom Yum",
    category: "Soups",
    categoryId: "soups",
    price: 13.5,
    rating: 4.8,
    reviews: 82,
    description:
      "Jumbo prawns, galangal, kaffir lime leaves, straw mushrooms in an aromatic coconut broth.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP1WJZMirBAhkLn3BRC-cudzg2il5rSV3wlFm8pzODsA&s=10",
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
   {
    id: "sl3",
    name: "Caprese Salad",
    category: "Salads",
    categoryId: "salads",
    price: 16.5,
    rating: 4.9,
    reviews: 114,
    description:
      "Fresh mozzarella, ripe tomatoes, and basil with balsamic glaze.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN92adBUfPff-f4xIQLaMQ17Z0mPttoArcxPYpHE8RnA&s=10",
    tag: "Healthy",
    prepTime: "10 min",
    calories: 520,
  },
   {
    id: "sl4",
    name: "Spinach and Strawberry Salad",
    category: "Salads",
    categoryId: "salads",
    price: 16.5,
    rating: 4.9,
    reviews: 114,
    description:
      "Spinach, fresh strawberries, feta cheese, and balsamic vinaigrette.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLtb37g_btRHlusaiH14a17rmg65Hz8MoC78kBwZUrEA&s=10",
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
   {
    id: "v3",
    name: "Rice Paper Rolls",
    category: "Vegan",
    categoryId: "vegan",
    price: 12.0,
    rating: 4.7,
    reviews: 55,
    description:
      "Rice paper rolls filled with fresh vegetables, herbs, and vermicelli noodles.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiLluXJWCmoraze7V_hEdQ2lPloyuNJ9hJm3QONZHhuQ&s=10",
    prepTime: "10 min",
    calories: 390,
    isVegetarian: true,
  },
   {
    id: "v4",
    name: "Spicy Peanut Noodles",
    category: "Vegan",
    categoryId: "vegan",
    price: 12.0,
    rating: 4.7,
    reviews: 55,
    description:
      "Warm noodles tossed in a rich peanut sauce with shredded carrots, bell peppers, and green onions.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhW1LedcZJT6ylvp33swmLerYMefvvFTu5N7i7aDjbIQ&s=10",
    prepTime: "10 min",
    calories: 390,
    isVegetarian: true,
  },
   {
    id: "v5",
    name: "Sweet Potato Fries",
    category: "Vegan",
    categoryId: "vegan",
    price: 12.0,
    rating: 4.7,
    reviews: 55,
    description:
      " Crispy sweet potato fries seasoned with sea salt and served with a side of vegan aioli.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQShueKMDZRbOQcpkOrHJi1H2qdAh3JtNJ3iJBc51PIkw&s=10",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpIbOoZTyeLBITAN-pBJ3Dqp0Z2WF_sv56XOo9GywAnw&s=10",
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
  {
    id: "d4",
    name: "Orange Juice",
    category: "Drinks",
    categoryId: "drinks",
    price: 2.5,
    rating: 4.5,
    reviews: 52,
    description: "Fresh Orange Juice",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzDkbWO3mXEDWHhMeQYD9wDrFpHhL6Z60w5afWUVoIlQ&s=10",
    prepTime: "2 min",
    calories: 15,
    isVegetarian: true,
  },
  {
    id: "d5",
    name: "Ice Latte",
    category: "Drinks",
    categoryId: "drinks",
    price: 3.5,
    rating: 4.5,
    reviews: 52,
    description: "Fresh Ice Latte",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoukS6flmACeI7s87ROZuOkQ77Iu0BCXhVN-35AinGYA&s=10",
    prepTime: "2 min",
    calories: 15,
    isVegetarian: true,
  },
  {
    id: "d6",
    name: "Lemon Tea",
    category: "Drinks",
    categoryId: "drinks",
    price: 2.5,
    rating: 4.5,
    reviews: 52,
    description: "Fresh Lemon Tea",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUb4dFFOROSoBH4JueAEGZBEf7AiqHhzkahV_ZX_GSMA&s=10",
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
    {
    id: "ds4",
    name: "Oreo Chocolate",
    category: "Desserts",
    categoryId: "desserts",
    price: 2.5,
    rating: 4.6,
    reviews: 300,
    description:
      "Oreo Dessert is a delicious dessert made with Oreo cookies, cream, and chocolate.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4lXQbCvKaFmDWNXGDkmRFO8wkrOYD05u1-p1fyNpwgnFBidCHbR1rymlB&s=10",
    prepTime: "5 min",
    calories: 480,
    isVegetarian: true,
  },
    {
    id: "ds5",
    name: "Caramel Pudding",
    category: "Desserts",
    categoryId: "desserts",
    price: 1.5,
    rating: 4.9,
    reviews: 250,
    description:
      "Caramelized baked crust with an ultra-creamy, custard-like center and berry compote.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuKM46uonWsNFQB19Nj4pt2Li4PQgeA78WHgjFqZxqIQ&s=10",
    prepTime: "5 min",
    calories: 480,
    isVegetarian: true,
  },
    {
    id: "ds6",
    name: "Tiramisu ",
    category: "Desserts",
    categoryId: "desserts",
    price: 4.0,
    rating: 4.8,
    reviews: 96,
    description:
      "Tiramisu is a delicious dessert made with coffee, ladyfingers, and mascarpone cheese.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJoD6b3imF2bhRbve3ewHE1HYz284JtY1DDNZs0sek0w&s=10  ",
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

  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const currentMeta = CATEGORY_META[selectedCategory] || CATEGORY_META.all;

  const { requireAuth } = useAuth();
  const { orders, activeOrders, totalCartCount, totalCartSubtotal } = useOrders();

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

  // When Add is pressed -> show toast confirmation
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

            {/* Header Right Stats */}
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
            </div>
          </div>
        </div>

        {/* Loyalty Reward Info Strip */}
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-b border-emerald-100 py-2.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex h-5 w-5 rounded-full bg-amber-500 text-white items-center justify-center text-[11px] font-black shrink-0 shadow-2xs">
                ★
              </span>
              <span className="font-bold text-gray-800">
                Loyalty Rewards:
              </span>
              <span className="text-gray-600">
                $10 = <strong className="text-emerald-700">2 Points</strong> ($5 = 1 pt)
              </span>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2 py-0.5 rounded-full text-[11px]">
                ⚡ $20 = 4 pts • $100 = 20 pts!
              </span>
            </div>
            <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <span>Exchange points from 150 pts up to 70% OFF coupons</span>
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

              {/* Quick Order Menu Card in Sidebar */}
              <div className="mt-5 p-4 rounded-3xl bg-white border border-gray-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                    <ShoppingBag size={15} className="text-emerald-600" />
                    <span>Your Order Menu</span>
                  </div>
                  <span className="text-[10.5px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                    {totalCartCount} {totalCartCount === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs text-gray-600 pt-1 border-t border-gray-100">
                  <span>Current Bill:</span>
                  <span className="text-sm font-black text-emerald-800 font-mono">
                    ${totalCartSubtotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/Orders"
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
                >
                  <ShoppingBag size={13} />
                  <span>View Order Menu &amp; Bill</span>
                </Link>
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
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${vegetarianOnly
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
