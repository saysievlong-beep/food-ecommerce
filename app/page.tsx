// app/page.tsx
import TopBar from "./components/topbar";
import Navbar from "./components/navbar";
import HomeSearchBar from "./components/HomeSearchBar";
import Sidebar from "./components/sidebar";
import BannerSwiper from "./components/banner-swiper";
import TrendFood from "./components/TrendFood";
import FlashSale from "./components/flash_sale";
import LatestFood from "./components/latest_food";
import DiscountSwiper from "./components/promotion";
import Partnership from "./components/Partnership";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <TopBar />
        <Navbar />
        <HomeSearchBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-stretch gap-6">
          <Sidebar />
          <BannerSwiper />
        </div>
        <TrendFood />
        <FlashSale />
        <LatestFood />
        <DiscountSwiper />
        <Partnership />
      </div>
      <Footer />
    </div>
  );
}