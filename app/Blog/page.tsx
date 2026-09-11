"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TopBar from "../components/topbar";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import {
  Sparkles,
  Search,
  Star,
  Heart,
  BookOpen,
  ArrowRight,
  User,
  X,
  Clock,
  Calendar,
  Utensils,
  Lightbulb,
  CheckCircle2,
  Share2,
} from "lucide-react";

export type BlogItem = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  categoryId: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  rating: number;
  reviews: number;
  tag?: string;
  imageUrl: string;
  fullStory: string[];
  keyTips: string[];
  ingredients?: string[];
};

const BLOG_ITEMS: BlogItem[] = [
  {
    id: "b1",
    title: "The Art of 48-Hour Fermented Sourdough Pizza",
    excerpt:
      "Learn the time-tested Italian fermentation secrets for creating light, bubbly crusts with maximum depth of flavor.",
    category: "Pizza",
    categoryId: "pizza",
    author: "Chef Marco Rossi",
    authorRole: "Master Pizzaiolo",
    date: "Sep 04, 2026",
    readTime: "5 min",
    rating: 4.9,
    reviews: 84,
    tag: "Trending",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    fullStory: [
      "In traditional Neapolitan pizzerias, great crust is not made in hours—it is nurtured over days. By giving dough a full 48-hour cold fermentation in the refrigerator, wild yeasts break down complex starches into natural sugars, developing incredible micro-blisters and a delicate, digestible crumb.",
      "The choice of flour is paramount. High-protein Italian Tipo 00 flour paired with 68% hydration allows the gluten matrix to stretch paper-thin while maintaining structural integrity in a screaming hot 900°F wood-fired oven.",
      "Top with crushed San Marzano D.O.P. tomatoes, fresh buffalo mozzarella added halfway through baking to prevent excess moisture, and finish with fresh basil and a light ribbon of cold-pressed Sicilian olive oil.",
    ],
    keyTips: [
      "Keep fermentation cold: 4°C to 6°C allows slow flavor development without over-proofing.",
      "Never use a rolling pin: Hand-stretching preserves all the trapped carbon dioxide gas bubbles.",
      "Preheat your baking stone or steel for at least 45 minutes at maximum oven temperature.",
    ],
    ingredients: [
      "500g Italian Tipo 00 Flour",
      "340ml Cold filtered water (68% hydration)",
      "12g Fine sea salt",
      "2g Active dry yeast",
      "San Marzano tomatoes & fresh buffalo mozzarella",
    ],
  },
  {
    id: "b2",
    title: "Mastering the Crispy Smashed Wagyu Burger",
    excerpt:
      "The exact griddle temperature, searing technique, and cheese melt timing for legendary homemade burgers.",
    category: "Burgers",
    categoryId: "burgers",
    author: "Chef Alex Rivera",
    authorRole: "Head Grillmaster",
    date: "Aug 29, 2026",
    readTime: "4 min",
    rating: 4.8,
    reviews: 62,
    tag: "Chef's Pick",
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    fullStory: [
      "The secret behind an unforgettable smash burger is the Maillard reaction—a chemical reaction between amino acids and reducing sugars that gives browned food its distinctive caramelized crust and deep savoriness.",
      "Instead of a gentle press, you need extreme downward force within the first 30 seconds on a screaming hot cast-iron griddle (around 450°F / 230°C). This locks in natural juices while creating lacy, ultra-crispy edges.",
      "Top immediately with aged American or sharp cheddar, cover with a cloche dome for 20 seconds to steam-melt the cheese, and slide onto a toasted buttered brioche bun layered with caramelized onions.",
    ],
    keyTips: [
      "Use 80/20 or 75/25 ground Wagyu chuck blend for the perfect fat-to-meat ratio.",
      "Only smash once: smashing after the first 30 seconds presses out essential flavorful juices.",
      "Use parchment paper between the press tool and meat to avoid sticking.",
    ],
    ingredients: [
      "160g Ground Wagyu beef chuck (formed into two 80g cold balls)",
      "2 Slices aged sharp cheddar",
      "1 Brioche burger bun toasted in clarified butter",
      "Smoked garlic aioli & thinly sliced dill pickles",
    ],
  },
  {
    id: "b3",
    title: "A Masterclass in Bluefin Tuna & Salmon Sashimi",
    excerpt:
      "Selecting sushi-grade whole cuts, precision knife angles, and traditional Japanese garnishing aesthetics.",
    category: "Sushi",
    categoryId: "sushi",
    author: "Kenji Takahashi",
    authorRole: "Executive Sushi Master",
    date: "Aug 22, 2026",
    readTime: "6 min",
    rating: 4.9,
    reviews: 110,
    tag: "Popular",
    imageUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    fullStory: [
      "In Edomae sushi philosophy, knife craftsmanship is as revered as the catch itself. A single continuous pull cut—using a single-bevel Yanagiba knife without sawing—ensures clean cellular cuts that preserve natural fats and silky mouthfeel.",
      "Temperature management is critical. The fish should be kept chilled on crushed ice until seconds before slicing, then brought slightly to room temperature on the palate to unleash aromatic richness.",
      "Serve accompanied by freshly grated Shizuoka wasabi and aged Nikiri soy glaze gently brushed over the surface.",
    ],
    keyTips: [
      "Slice against the grain at a 45-degree angle for the most tender, melt-in-mouth texture.",
      "Never soak sushi in soy sauce: dip only the fish corner to honor the delicate natural flavor.",
      "Pair with pickled young ginger (gari) as a palate cleanser between different fish cuts.",
    ],
    ingredients: [
      "200g Sashimi-grade Atlantic King Salmon",
      "150g Prime Bluefin Akami Tuna",
      "Freshly grated real wasabi root",
      "House brewed Nikiri soy reduction",
    ],
  },
  {
    id: "b4",
    title: "Slow-Simmered Tonkotsu: The 20-Hour Broth Secret",
    excerpt:
      "How collagen breakdown and marrow extraction create the silky, umami-rich pork broth you love in top ramen bars.",
    category: "Soups",
    categoryId: "soups",
    author: "Chef Kenji Sato",
    authorRole: "Ramen Specialist",
    date: "Aug 18, 2026",
    readTime: "7 min",
    rating: 4.9,
    reviews: 95,
    tag: "Secret Recipe",
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
    fullStory: [
      "Tonkotsu ramen broth is a culinary labor of patience. Unlike French consommés that require gentle simmering, authentic Fukuoka Tonkotsu demands a vigorous, continuous rolling boil for over 18 to 20 hours.",
      "This high heat emulsifies the rendered pork fat and dissolved bone collagen with water, transforming clear liquid into a rich, creamy, milky white broth brimming with body and unctuous savoriness.",
      "Balanced with a seasoned shoyu tare reduction and topped with slow-braised chashu pork belly, spring scallions, and marinated ajitsuke tamago eggs.",
    ],
    keyTips: [
      "Pre-blanch pork marrow bones in boiling water for 15 minutes to remove impurities for a clean flavor.",
      "Maintain a vigorous rolling boil to keep the fat emulsion fully suspended.",
      "Strain through a fine-mesh tamis sieve before serving for velvety smoothness.",
    ],
    ingredients: [
      "2kg Pork femur and trotter bones",
      "1 Whole garlic bulb & sliced ginger roots",
      "Kombu dashi seaweed & dried shiitake tare base",
      "Fresh handmade alkaline wheat ramen noodles",
    ],
  },
  {
    id: "b5",
    title: "Organic Harvest Bowls: Balancing Flavor & Nutrition",
    excerpt:
      "Combine roasted ancient grains, crisp greens, and cold-pressed citrus vinaigrettes for healthy lunch meals.",
    category: "Salads",
    categoryId: "salads",
    author: "Elena Rostova",
    authorRole: "Culinary Nutritionist",
    date: "Aug 15, 2026",
    readTime: "4 min",
    rating: 4.7,
    reviews: 48,
    tag: "Healthy",
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    fullStory: [
      "Building a nutritious grain bowl is an exercise in balancing complementary textures and macro-nutrients. Start with a foundation of warm fluffy tri-color quinoa and massaged Tuscan kale.",
      "Layer with nutrient-dense roasted vegetables—such as caramelized butternut squash, paprika-spiced chickpeas, and sweet red beets—for complex carbohydrates and sustained energy.",
      "Finish with healthy monounsaturated fats from sliced Haas avocados and a drizzle of cold-pressed lemon tahini dressing.",
    ],
    keyTips: [
      "Massage kale with a drop of olive oil and pinch of sea salt for 2 minutes to tenderize fibers.",
      "Toast cooked quinoa briefly in a dry skillet for a nutty, aromatic crunch.",
      "Store dressing separately until serving time to maintain vegetable crispness.",
    ],
    ingredients: [
      "1 Cup organic cooked tri-color quinoa",
      "1 Bunch Tuscan Lacinato kale",
      "1 Roasted sweet potato cubed",
      "Creamy lemon tahini & roasted pumpkin seeds",
    ],
  },
  {
    id: "b6",
    title: "100% Plant-Powered: Crispy Sesame Tofu Bowls",
    excerpt:
      "The press-and-bake trick that turns organic tofu into extra-crispy, protein-packed bites with sweet tamari glaze.",
    category: "Vegan",
    categoryId: "vegan",
    author: "Sarah Lin",
    authorRole: "Plant-Based Chef",
    date: "Aug 12, 2026",
    readTime: "4 min",
    rating: 4.8,
    reviews: 53,
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    fullStory: [
      "Tofu is often misunderstood as bland, but with the right technique, it becomes remarkably crispy on the outside while staying tender and custardy inside.",
      "The secret lies in thoroughly pressing extra-firm tofu for 30 minutes, tossing in arrowroot or cornstarch with toasted sesame oil, and baking at 425°F until golden.",
      "Toss hot tofu immediately in a reduction of ginger, garlic, low-sodium tamari, and maple syrup to glaze every crispy facet.",
    ],
    keyTips: [
      "Thorough pressing is non-negotiable: less water means higher heat absorption and crispier skin.",
      "Tossing in cornstarch creates a protective barrier that seals in moisture.",
      "Add the sauce in the final minute so the crispy exterior doesn't become soggy.",
    ],
    ingredients: [
      "400g Extra-firm organic tofu",
      "2 Tbsp Organic cornstarch",
      "1 Tbsp Toasted dark sesame oil",
      "Tamari ginger glaze & steamed edamame",
    ],
  },
  {
    id: "b7",
    title: "Ceremonial Uji Matcha: From Farm to Whisk",
    excerpt:
      "Understand shade-grown green tea harvesting in Kyoto and how to prepare a creamy iced latte with oat milk.",
    category: "Drinks",
    categoryId: "drinks",
    author: "Sarah Lin",
    authorRole: "Beverage Specialist",
    date: "Aug 08, 2026",
    readTime: "3 min",
    rating: 4.9,
    reviews: 77,
    tag: "Trending",
    imageUrl:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=80",
    fullStory: [
      "Ceremonial grade matcha is cultivated using a ancient method called 'tana' shading, where tea bushes in Uji, Kyoto are shaded from direct sunlight for 3 weeks prior to spring harvest.",
      "This causes tea leaves to produce abundant L-theanine and vibrant green chlorophyll, resulting in a naturally sweet, umami-rich flavor profile without bitterness.",
      "Whisked with a 100-prong bamboo chasen in a 'W' motion at 80°C, it creates a velvety micro-foam that pairs beautifully over ice with creamy barista oat milk.",
    ],
    keyTips: [
      "Never use boiling water: water above 80°C scorches delicate tea catechins and causes bitterness.",
      "Sift matcha powder through a fine strainer to eliminate lumps before adding liquid.",
      "Whisk vigorously in a rapid zigzag 'W' motion rather than circular stirring.",
    ],
    ingredients: [
      "2.5g First-harvest Uji ceremonial matcha powder",
      "60ml Filtered water at 75°C - 80°C",
      "180ml Creamy barista oat milk",
      "1 Tsp Pure organic blue agave nectar",
    ],
  },
  {
    id: "b8",
    title: "Authentic Treviso Tiramisu Without Heavy Cream",
    excerpt:
      "Why real Italian pastry chefs strictly use egg yolks, mascarpone, Savoiardi, and strong espresso with cocoa.",
    category: "Desserts",
    categoryId: "desserts",
    author: "Chef Marco Rossi",
    authorRole: "Master Pastry Chef",
    date: "Aug 02, 2026",
    readTime: "5 min",
    rating: 4.9,
    reviews: 120,
    tag: "Classic",
    imageUrl:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80",
    fullStory: [
      "Originating in Treviso, Italy in the late 1960s, true traditional Tiramisu relies on the luscious emulsion of farm-fresh egg yolks, caster sugar, and creamy Italian mascarpone—never heavy whipped cream.",
      "Crisp Savoiardi ladyfingers are dipped for exactly 1.5 seconds in freshly brewed, unsweetened dark espresso so they absorb aromatic coffee essence without collapsing into mush.",
      "Layered and chilled for at least 8 hours in the refrigerator, the flavors marry into an ethereal cloud, dusted generously with unsweetened Valrhona dark cocoa powder just before slicing.",
    ],
    keyTips: [
      "Quick dip technique: roll ladyfingers in espresso in one swift motion (1-2 seconds max).",
      "Allow 8-12 hours of refrigeration so the mascarpone custard sets to velvety perfection.",
      "Only dust cocoa powder right before serving to avoid moisture absorption.",
    ],
    ingredients: [
      "500g Italian Galbani Mascarpone cheese",
      "4 Fresh egg yolks whipped with 100g sugar",
      "24 Artisan Savoiardi ladyfinger biscuits",
      "300ml Freshly brewed Italian dark espresso",
      "Dutch-process dark cocoa powder for dusting",
    ],
  },
];

const CATEGORIES = [
  "All",
  "Pizza",
  "Burgers",
  "Sushi",
  "Soups",
  "Salads",
  "Vegan",
  "Drinks",
  "Desserts",
];

// Detail Modal Dialog for reading full blog story
function StoryDetailModal({
  item,
  onClose,
}: {
  item: BlogItem;
  onClose: () => void;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh] animate-scaleUp">
        {/* Header Media / Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-200 shrink-0">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

          {/* Top Modal Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.tag && (
                <span className="bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {item.tag}
                </span>
              )}
              <span className="bg-black/50 backdrop-blur-md text-gray-100 text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                {item.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                  isBookmarked
                    ? "bg-rose-50 text-rose-500 shadow-sm"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:text-rose-500"
                }`}
                aria-label="Save story"
              >
                <Heart
                  size={16}
                  className={isBookmarked ? "fill-rose-500 text-rose-500" : ""}
                />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 backdrop-blur-md transition-colors shadow-xs"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold mb-1">
              <span>{item.readTime} read</span>
              <span>•</span>
              <span>{item.date}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Story Details */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-gray-700 text-xs sm:text-sm leading-relaxed">
          {/* Author bar */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                {item.author.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                  {item.author}
                </h4>
                <p className="text-[11px] text-gray-500">{item.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>{item.rating.toFixed(1)}</span>
              <span className="text-gray-400 font-normal">({item.reviews})</span>
            </div>
          </div>

          {/* Full Story Paragraphs */}
          <div className="space-y-3.5">
            {item.fullStory.map((paragraph, idx) => (
              <p key={idx} className="text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Ingredients box if available */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="p-5 bg-slate-50 rounded-2xl border border-gray-200">
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-2 mb-3">
                <Utensils size={16} className="text-emerald-600" />
                <span>Key Ingredients &amp; Recipe Ratios</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                {item.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Chef Pro-Tips Box */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl border border-emerald-200/80">
            <h4 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-2 mb-2.5">
              <Lightbulb size={16} className="text-amber-500 shrink-0" />
              <span>Chef&apos;s Golden Tips</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-900">
              {item.keyTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Share2 size={14} />
            <span>{copied ? "Link Copied! ✓" : "Share Story"}</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href={`/Food?category=${item.categoryId}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors active:scale-95"
            >
              <span>Order {item.category} Menu</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blog Picture Card component with "Read" button trigger
function BlogPictureCard({
  item,
  onRead,
  index = 0,
}: {
  item: BlogItem;
  onRead: (item: BlogItem) => void;
  index?: number;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.imageUrl);
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  return (
    <div
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={() => onRead(item)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 cursor-pointer"
    >
      {/* Top Media / Picture Section */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-200">
        <img
          src={imgSrc || item.imageUrl}
          alt={item.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => {
            if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
          }}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 block"
        />

        {/* Gradient Overlay for bottom text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

        {/* Top Badges: Tag & Category */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.tag && (
              <span className="inline-flex items-center rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-xs">
                {item.tag}
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-medium text-gray-100 border border-white/10">
              {item.category}
            </span>
          </div>

          {/* Favorite heart button */}
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
            aria-label="Save story"
          >
            <Heart
              size={15}
              className={isLiked ? "fill-rose-500 text-rose-500" : ""}
            />
          </button>
        </div>

        {/* Bottom Picture Info: Read time & Date */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-medium">
          <span className="backdrop-blur-sm bg-black/40 px-2 py-0.5 rounded-md">
            ⏱ {item.readTime} read
          </span>
          <span className="backdrop-blur-sm bg-black/40 px-2 py-0.5 rounded-md">
            📅 {item.date}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating and Reviews */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1 text-xs">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-gray-900">{item.rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({item.reviews} reads)</span>
          </div>

          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            📖 Article
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
          {item.title}
        </h3>

        {/* Description / Excerpt */}
        <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 leading-relaxed flex-1">
          {item.excerpt}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <User size={13} className="text-emerald-600" />
            <span className="font-medium text-gray-700">{item.author}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRead(item);
            }}
            className="flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all active:scale-95 shadow-2xs"
          >
            <span>Read</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStory, setActiveStory] = useState<BlogItem | null>(null);

  const filtered = BLOG_ITEMS.filter((item) => {
    const matchCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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
                <span>Culinary Stories &amp; Recipes</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                TastyByte Food Blog
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 max-w-xl">
                Click <b>Read</b> on any picture card to explore the complete recipe story, chef tips, and cooking secrets.
              </p>
            </div>

            {/* Total Articles Count Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <div className="text-left">
                <div className="text-[10px] text-emerald-200 uppercase font-medium">
                  Total Stories
                </div>
                <div className="text-base font-bold text-white">
                  {BLOG_ITEMS.length} Articles
                </div>
              </div>
              <div className="h-7 w-px bg-white/20" />
              <div className="text-left">
                <div className="text-[10px] text-emerald-200 uppercase font-medium">
                  Showing
                </div>
                <div className="text-base font-bold text-amber-300">
                  {filtered.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Category Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search recipes, ingredients, chef tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-800 placeholder-gray-400"
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

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Picture Cards Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((item, idx) => (
                <BlogPictureCard
                  key={item.id}
                  item={item}
                  onRead={(story) => setActiveStory(story)}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-sm font-bold text-gray-800">
                No stories found for &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Story Detail Reader Modal */}
      {activeStory && (
        <StoryDetailModal
          item={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}

      <Footer />
    </div>
  );
}
