"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Receipt,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  CreditCard,
  Printer,
  ChevronRight,
  ArrowLeft,
  Search,
  Sparkles,
  ShieldCheck,
  UtensilsCrossed,
  ChefHat,
  Truck,
  AlertCircle,
  QrCode,
  Share2,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Bike,
  Package,
  PackageCheck,
  Zap,
  Check,
  RotateCcw,
  MessageSquare,
  DollarSign,
  Flame,
  Info,
  ExternalLink,
  Mail,
} from "lucide-react";
import TopBar from "../components/topbar";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import { useOrders, Order, OrderItem, calculateItemRewardPoints, calculateRewardPoints } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

type DeliveryPartnerId =
  | "GrabExpress"
  | "Doordash"
  | "UberEats"
  | "Deliveroo"
  | "Foodpanda"
  | "DHL Express";

// Single source of truth for the delivery-company picker. Add or remove a
// carrier here and the grid, icon, and selected state all update together.
const DELIVERY_OPTIONS: Array<{
  id: DeliveryPartnerId;
  label: string;
  eta: string;
  image: string;
}> = [
    { id: "GrabExpress", label: "GrabExpress", eta: "20–30 min", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM0FSVsPuFpIM89c949TBNHJQAJrkyiy8VeefTq7xEnw&s=10" },
    { id: "Doordash", label: "Doordash", eta: "25–35 min", image: "https://images.ctfassets.net/trvmqu12jq2l/1fl1jUAiV8AB4npGwVLUK6/7e111f1db742182cb3b0e980da1c1b8d/doordash-logo-0.png" },
    { id: "UberEats", label: "UberEats", eta: "20–30 min", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCUTw7j4YmjHa6kN7kptpKp2MS46TXTuPkE-lbuVAN2Q&s" },
    { id: "Deliveroo", label: "Deliveroo", eta: "30–40 min", image: "https://companieslogo.com/img/orig/ROO.L-03a09123.png?t=1720244493" },
    { id: "Foodpanda", label: "Foodpanda", eta: "25–35 min", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShbQX-3iw27RRT8715x-g9uo9085B71IudZQc-oIuADYdQJ9Zixyk71FY&s=10" },
    { id: "DHL Express", label: "DHL Express", eta: "40–60 min", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHQJtiirNzAmmcrV3JpfENFmnRsUaR8LmObqOxjAPy6g&s=10" },
  ];

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get("id");
  const {
    cartItems,
    totalCartCount,
    totalCartSubtotal,
    updateCartQuantity,
    updateItemNotes,
    removeFromCart,
    clearCart,
    orders,
    activeOrders,
    selectedOrder,
    setSelectedOrder,
    getOrderById,
    placeOrder,
    updateOrderStatus,
    reorderOrder,
  } = useOrders();

  const { isLoggedIn, user, openLoginModal, getNewUserCouponStatus, markCouponUsed } = useAuth();
  const couponStatus = getNewUserCouponStatus();

  // Tab state: "current" (order menu / cart), "detail" (placed bill & live tracking), or "history" (order archive)
  const [activeTab, setActiveTab] = useState<"current" | "detail" | "history">("current");
  const [orderType, setOrderType] = useState<"GrabExpress" | "Doordash" | "UberEats" | "Deliveroo" | "Foodpanda" | "DHL Express" | "Delivery">("GrabExpress");
  const currentCompany = DELIVERY_OPTIONS.find(company => company.id === orderType);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [reorderSuccessToast, setReorderSuccessToast] = useState<string | null>(null);

  // Active editing notes for an item
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState("");

  // Cart / Checkout inputs
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card (Visa •••• 4242)");
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.address || "Street 240, Daun Penh, Phnom Penh, Cambodia"
  );
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Sync user profile address if available
  useEffect(() => {
    if (user?.address) {
      setDeliveryAddress(user.address);
    }
  }, [user?.address]);

  // Bill calculations for current cart
  const freeDeliveryThreshold = 35;
  const isFreeDelivery = orderType !== "DHL Express" || totalCartSubtotal >= freeDeliveryThreshold || cartItems.length === 0;
  const deliveryFee = cartItems.length === 0 ? 0 : isFreeDelivery ? 0 : 3.99;
  const discountAmount = (totalCartSubtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, totalCartSubtotal - discountAmount);
  const tax = taxableAmount * 0.08;
  const grandTotal = taxableAmount + deliveryFee + tax;
  const progressToFreeDelivery = Math.min(
    100,
    (totalCartSubtotal / freeDeliveryThreshold) * 100
  );
  const amountNeededForFreeDelivery = Math.max(
    0,
    freeDeliveryThreshold - totalCartSubtotal
  );

  // Sync tab and selected order from query parameter
  useEffect(() => {
    const requestedTab = searchParams.get("tab") as "current" | "detail" | "history" | null;

    if (orderIdParam) {
      const match = getOrderById(orderIdParam);
      if (match) {
        setSelectedOrder(match);
        setActiveTab("detail");
        return;
      }
    }

    if (requestedTab) {
      setActiveTab(requestedTab);
      return;
    }

    // Default to the Order Menu tab ("current") so user always sees the Order Menu
    setActiveTab("current");
  }, [orderIdParam, searchParams, getOrderById, setSelectedOrder]);

  const currentOrder = selectedOrder || orders[0] || null;

  const handleApplyPromoCode = (codeToApply: string) => {
    setPromoError("");
    const code = codeToApply.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a coupon code.");
      return;
    }

    if (!isLoggedIn) {
      openLoginModal("Please sign in to use your discount coupon.");
      return;
    }

    // 1. Check standard welcome coupons
    if (code === "WELCOME10" || code === "NEWUSER10") {
      if (couponStatus.isUsed) {
        setPromoError("This 10% welcome coupon has already been redeemed.");
        return;
      }
      if (couponStatus.isExpired) {
        setPromoError("This 10% coupon has expired (Valid only for 3 days after sign up).");
        return;
      }
      setDiscountPercent(10);
      setPromoApplied("WELCOME10 (10% OFF - New User Special)");
      setPromoCode("");
      return;
    }

    // 2. Check user's claimed/redeemed coupons from profile
    const matchedCoupon = user?.coupons?.find(
      (c) => c.code.toUpperCase() === code || code.startsWith(c.code.toUpperCase())
    );

    if (matchedCoupon) {
      if (matchedCoupon.isUsed) {
        setPromoError(`Coupon "${matchedCoupon.code}" has already been redeemed.`);
        return;
      }
      const isExpired = new Date(matchedCoupon.expiresAt).getTime() < Date.now();
      if (isExpired) {
        setPromoError(`Coupon "${matchedCoupon.code}" has expired.`);
        return;
      }
      setDiscountPercent(matchedCoupon.discountPercent);
      setPromoApplied(`${matchedCoupon.code} (${matchedCoupon.discountPercent}% OFF)`);
      setPromoCode("");
      return;
    }

    // 3. Support direct reward codes
    if (code === "POINTS10" || code.startsWith("POINTS10")) {
      setDiscountPercent(10);
      setPromoApplied(`${code} (10% OFF Points Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "POINTS15" || code.startsWith("POINTS15")) {
      setDiscountPercent(15);
      setPromoApplied(`${code} (15% OFF Points Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "REWARD20" || code.startsWith("REWARD20")) {
      setDiscountPercent(20);
      setPromoApplied(`${code} (20% OFF Points Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "VIP25" || code.startsWith("VIP25")) {
      setDiscountPercent(25);
      setPromoApplied(`${code} (25% OFF VIP Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "CHEF30" || code.startsWith("CHEF30")) {
      setDiscountPercent(30);
      setPromoApplied(`${code} (30% OFF Chef Voucher)`);
      setPromoCode("");
      return;
    }
    if (code === "FEAST40" || code.startsWith("FEAST40")) {
      setDiscountPercent(40);
      setPromoApplied(`${code} (40% OFF Gourmet Deluxe)`);
      setPromoCode("");
      return;
    }
    if (code === "VIP50" || code.startsWith("VIP50")) {
      setDiscountPercent(50);
      setPromoApplied(`${code} (50% OFF VIP Half-Price)`);
      setPromoCode("");
      return;
    }
    if (code === "ULTRA70" || code.startsWith("ULTRA70")) {
      setDiscountPercent(70);
      setPromoApplied(`${code} (70% OFF Grand Master Feast)`);
      setPromoCode("");
      return;
    }

    setPromoError("Invalid or expired coupon code.");
  };

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;
    if (!isLoggedIn) {
      openLoginModal("Please sign in to confirm and place your order.", () => {
        handleConfirmOrder();
      });
      return;
    }

    setIsSubmittingOrder(true);
    setTimeout(() => {
      const newOrder = placeOrder(
        cartItems,
        {
          subtotal: totalCartSubtotal,
          discountPercent,
          discountAmount,
          promoApplied: promoApplied || undefined,
          deliveryFee,
          tax,
          total: grandTotal,
          paymentMethod,
          paymentStatus: paymentMethod.includes("Cash") ? "Pending" : "Paid",
        },
        {
          name: user?.name || "Alex Vance",
          email: user?.email || "alex.vance@example.com",
          address: deliveryAddress.trim() || user?.address || "Street 240, Daun Penh, Phnom Penh, Cambodia",
          notes: deliveryNotes,
        },
        {
          deliveryPartner: currentCompany?.label || orderType,
          deliveryCompanyImage: currentCompany?.image,
          estimatedDeliveryTime: currentCompany?.eta || "25-35 mins",
        }
      );

      // Mark applied coupon redeemed
      if (promoApplied) {
        const appliedCode = promoApplied.split(" ")[0];
        markCouponUsed(appliedCode);
      }

      setIsSubmittingOrder(false);
      setSelectedOrder(newOrder);
      setActiveTab("detail");
    }, 1100);
  };

  const handleReorder = (orderId: string, orderNumber: string) => {
    reorderOrder(orderId);
    setReorderSuccessToast(`Added all items from Order #${orderNumber} to your Order Menu!`);
    setActiveTab("current");
    setTimeout(() => setReorderSuccessToast(null), 3500);
  };

  const handleAdvanceStatus = () => {
    if (!currentOrder) return;
    const current = currentOrder.status;
    let next: Order["status"] = "Preparing in Kitchen";
    if (current === "Order Confirmed") next = "Preparing in Kitchen";
    else if (current === "Preparing in Kitchen") next = "Out for Delivery";
    else if (current === "Out for Delivery") next = "Delivered";
    else if (current === "Delivered") next = "Preparing in Kitchen";

    updateOrderStatus(currentOrder.id, next);
  };

  const handleSaveItemNote = (itemId: string) => {
    updateItemNotes(itemId, tempNoteText);
    setEditingNotesId(null);
    setTempNoteText("");
  };

  // Filtered orders for the history view
  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "active") {
      if (order.status === "Delivered" || order.status === "Cancelled")
        return false;
    } else if (filterStatus === "delivered") {
      if (order.status !== "Delivered") return false;
    } else if (filterStatus === "cancelled") {
      if (order.status !== "Cancelled") return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.orderNumber.toLowerCase().includes(q);
      const matchItem = order.items.some((i) =>
        i.name.toLowerCase().includes(q)
      );
      if (!matchId && !matchItem) return false;
    }
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (!currentOrder) return;
    const url = `${window.location.origin}/Orders?id=${currentOrder.orderNumber}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };



  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Scope printing to the bill card only, so the nav, tabs and footer
          never end up in the printed / saved-as-PDF output. */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-bill,
          #printable-bill * {
            visibility: visible;
          }
          #printable-bill {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }
      `}</style>

      <div>
        <TopBar />
        <Navbar />

        {/* Hero Header Section */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white py-9 px-4 sm:px-6 lg:px-8 shadow-sm overflow-hidden">
          {/* Subtle background glow element */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-800/80 border border-emerald-600/40 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-300" />
                  <span>Customer Food Portal</span>
                </span>
                {activeOrders.length > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-gray-950 font-black text-[11px] animate-pulse">
                    ⚡ {activeOrders.length} Order Active
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                <Receipt className="text-amber-400" size={32} />
                <span>My Order Menu &amp; Bill</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                Review and customize your ordered dishes, monitor real-time kitchen preparation and driver delivery, and access genuine itemized payment bills.
              </p>
            </div>

            {/* Quick Actions & Navigation on Right */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/Food"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-2xl text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <ArrowLeft size={14} />
                <span>Browse Menu</span>
              </Link>

              <Link
                href="/Food"
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-gray-950 font-black px-4 py-2.5 rounded-2xl shadow-md text-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={15} />
                <span>Add More Food</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Global Toast Alert if Reorder Triggered */}
        {reorderSuccessToast && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-slideDown">
            <div className="p-3.5 bg-emerald-900 text-white rounded-2xl shadow-lg border border-emerald-500 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <Check size={14} />
                </div>
                <span className="font-bold">{reorderSuccessToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setReorderSuccessToast(null)}
                className="text-emerald-300 hover:text-white font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          {/* STEPPER / VIEW SWITCHER TABS */}
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-gray-200/90 shadow-xs mb-7 flex flex-col md:flex-row items-center justify-between gap-3">
            {/* View Tabs */}
            <div className="flex items-center gap-1.5 w-full md:w-auto bg-gray-100/90 p-1.5 rounded-xl flex-wrap">
              {/* TAB 1: CURRENT CART ORDER MENU */}
              <button
                type="button"
                onClick={() => setActiveTab("current")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "current"
                  ? "bg-white text-emerald-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <ShoppingBag
                  size={15}
                  className={cartItems.length > 0 ? "text-amber-500" : "text-gray-400"}
                />
                <span>1. Order Menu</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${cartItems.length > 0
                    ? "bg-amber-400 text-gray-950"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {totalCartCount}
                </span>
              </button>

              {/* TAB 2: ORDER HISTORY */}
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "history"
                  ? "bg-white text-emerald-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <Clock size={15} className="text-gray-500" />
                <span>2. Order History</span>
                <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded-full">
                  {orders.length}
                </span>
              </button>
            </div>

            {/* Quick Bill Selector Dropdown for detail tab */}
            {orders.length > 0 && activeTab === "detail" && (
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
                  Switch Order:
                </span>
                <select
                  value={currentOrder?.id || ""}
                  onChange={(e) => {
                    const found = getOrderById(e.target.value);
                    if (found) {
                      setSelectedOrder(found);
                      setActiveTab("detail");
                    }
                  }}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      Order #{o.orderNumber} ({o.status}) - ${o.bill.total.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* TAB 1: CURRENT ORDER MENU & BILL CHECKOUT REVIEW */}
          {/* ============================================================ */}
          {activeTab === "current" && (
            <div>
              {cartItems.length === 0 ? (
                /* Empty Order State */
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 max-w-lg mx-auto shadow-xs">
                  <div className="w-18 h-18 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
                    <ShoppingBag size={34} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">
                    Your Order Menu is Empty
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Explore our mouthwatering chef specials, burgers, pizzas, and desserts. Click &quot;Add&quot; to build your order!
                  </p>
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href="/Food"
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      Browse Food Menu
                    </Link>
                    {orders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("detail")}
                        className="w-full sm:w-auto px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        View Placed Orders ({orders.length})
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Active Cart Order of Menu & Bill Breakdown */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* LEFT (7 cols): Ordered Dishes List & Delivery Specs */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* 1. Dining / Fulfillment Mode Switcher — data-driven, no external logo images */}
                    <div className="bg-white rounded-3xl p-4 border border-gray-200/90 shadow-xs">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">
                        Choose delivery partner
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {DELIVERY_OPTIONS.map(({ id, label, eta, image }) => {
                          const active = orderType === id;
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setOrderType(id)}
                              aria-pressed={active}
                              className={`relative flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${active
                                ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-500/30"
                                : "border-gray-200 bg-gray-50/70 hover:bg-gray-100"
                                }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white text-gray-500 border border-gray-200"
                                  }`}
                              >
                                <img src={image} alt={label} className="w-full h-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <div
                                  className={`text-xs font-bold truncate ${active ? "text-emerald-950" : "text-gray-800"
                                    }`}
                                >
                                  {label}
                                </div>
                                <div className="text-[10.5px] text-gray-500">{eta}</div>
                              </div>
                              {active && (
                                <CheckCircle2
                                  size={15}
                                  className="absolute top-2 right-2 text-emerald-600"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Main Dishes List Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs">
                      {/* Card Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                            <UtensilsCrossed size={18} />
                          </div>
                          <div>
                            <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                              Selected Food Dishes
                            </h2>
                            <span className="text-xs text-emerald-700 font-semibold">
                              {totalCartCount} {totalCartCount === 1 ? "item" : "items"} in order menu
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={clearCart}
                          className="text-xs text-gray-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>

                      {/* Free Delivery Bar (if delivery mode selected) */}
                      {orderType === "Delivery" && (
                        <div className="my-4 p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-xs">
                          {isFreeDelivery ? (
                            <div className="flex items-center gap-2 text-emerald-900 font-bold">
                              <Sparkles size={16} className="text-emerald-600 shrink-0" />
                              <span>Congratulations! You qualify for <strong>FREE Delivery</strong> ($0.00).</span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between text-gray-700 mb-1.5 font-medium">
                                <span>Add <strong>${amountNeededForFreeDelivery.toFixed(2)}</strong> more to get FREE delivery!</span>
                                <span className="text-emerald-700 font-bold">{Math.round(progressToFreeDelivery)}%</span>
                              </div>
                              <div className="h-2 w-full bg-emerald-200/60 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                                  style={{ width: `${progressToFreeDelivery}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Items List */}
                      <div className="divide-y divide-gray-100">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-slate-50/50 p-2 rounded-2xl transition-colors"
                          >
                            {/* Thumbnail & Dish Details */}
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-2xs">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                  {item.name}
                                </h4>
                                <div className="text-[11px] text-gray-500 font-medium mt-0.5 flex items-center gap-2">
                                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-100">
                                    {item.category}
                                  </span>
                                  <span>${item.price.toFixed(2)} each</span>
                                </div>

                                {/* Item Note Preview / Add Note Trigger */}
                                {item.notes ? (
                                  <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 w-fit">
                                    <MessageSquare size={11} className="text-amber-600" />
                                    <span>Note: &quot;{item.notes}&quot;</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingNotesId(item.id);
                                        setTempNoteText(item.notes || "");
                                      }}
                                      className="text-amber-600 hover:text-amber-900 font-bold ml-1 underline cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingNotesId(item.id);
                                      setTempNoteText("");
                                    }}
                                    className="mt-1 text-[10.5px] text-gray-400 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <MessageSquare size={11} />
                                    <span>+ Add chef request (e.g. no onions)</span>
                                  </button>
                                )}

                                {/* Inline Note Editor Modal/Input */}
                                {editingNotesId === item.id && (
                                  <div className="mt-2 flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={tempNoteText}
                                      onChange={(e) => setTempNoteText(e.target.value)}
                                      placeholder="Chef note (extra sauce, mild spice...)"
                                      className="text-xs px-2.5 py-1 bg-white border border-emerald-400 rounded-lg focus:outline-none w-48 text-gray-800"
                                      autoFocus
                                      onKeyDown={(e) => e.key === "Enter" && handleSaveItemNote(item.id)}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSaveItemNote(item.id)}
                                      className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingNotesId(null)}
                                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls & Line Price */}
                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                              <div className="text-right">
                                <div className="text-sm sm:text-base font-black text-emerald-800 font-mono">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 bg-gray-100/80 border border-gray-200 rounded-xl p-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                  className="h-7 w-7 rounded-lg bg-white shadow-2xs flex items-center justify-center text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Decrease quantity"
                                >
                                  {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                                </button>
                                <span className="w-6 text-center text-xs font-black text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                  className="h-7 w-7 rounded-lg bg-white shadow-2xs flex items-center justify-center text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                                  title="Increase quantity"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address & Customer Notes */}
                      <div className="mt-6 pt-5 border-t border-gray-100 space-y-3.5">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin size={15} className="text-emerald-600" />
                          <span>
                            {orderType === "GrabExpress"
                              ? "GrabExpress Destination & Instructions"
                              : orderType === "Doordash"
                                ? "Doordash Pickup Details"
                                : orderType === "UberEats"
                                  ? "UberEats Table Information"
                                  : orderType === "Deliveroo"
                                    ? "Deliveroo Pickup Details"
                                    : orderType === "Foodpanda"
                                      ? "Foodpanda Pickup Details"
                                      : orderType === "DHL Express"
                                        ? "DHL Express Pickup Details"
                                        : "Delivery Destination & Instructions"}
                          </span>
                        </h4>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            {orderType === "GrabExpress" || orderType === "Doordash" || orderType === "UberEats" || orderType === "Deliveroo" || orderType === "Foodpanda" || orderType === "DHL Express" ? "Street Address / Building" : "Pickup / Table Location"}
                          </label>
                          <input
                            type="text"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Enter delivery address..."
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Driver / Chef Instructions (Optional)
                          </label>
                          <input
                            type="text"
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                            placeholder="e.g. Ring the doorbell, leave at front door, provide extra napkins..."
                            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT (5 cols): Live Bill Calculation & Checkout Card */}
                  <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-md relative overflow-hidden">
                      <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 absolute top-0 left-0" />

                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <div>
                          <h3 className="text-base font-black text-gray-900">
                            Bill of Payment Summary
                          </h3>
                          <span className="text-[11px] text-gray-500">
                            Live itemized bill &amp; tax breakdown
                          </span>
                        </div>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200">
                          {totalCartCount} ITEMS
                        </span>
                      </div>

                      {/* Promo Coupons Section */}
                      <div className="py-3.5 border-b border-gray-100 space-y-2">
                        <label className="block text-xs font-bold text-gray-700 flex items-center justify-between">
                          <span>Apply Coupon Code</span>
                          {couponStatus.isValid && !promoApplied && (
                            <span className="text-[10.5px] text-emerald-700 font-semibold">
                              New user code: <strong>WELCOME10</strong> ({couponStatus.remainingText})
                            </span>
                          )}
                        </label>

                        {promoApplied ? (
                          <div className="flex items-center justify-between bg-emerald-100/80 border border-emerald-300 px-3 py-2 rounded-xl text-xs text-emerald-900 font-bold">
                            <div className="flex items-center gap-1.5">
                              <Tag size={13} className="text-emerald-700" />
                              <span>Applied: {promoApplied}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDiscountPercent(0);
                                setPromoApplied("");
                              }}
                              className="text-emerald-800 hover:text-rose-700 font-bold underline cursor-pointer text-[11px]"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1.5 pt-0.5">
                            <div className="relative flex-1">
                              <Tag size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Enter coupon code (e.g. WELCOME10)"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleApplyPromoCode(promoCode)}
                                className="w-full pl-8 pr-2 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase placeholder:normal-case text-gray-900 font-semibold"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleApplyPromoCode(promoCode)}
                              className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-2xs"
                            >
                              Apply
                            </button>
                          </div>
                        )}
                        {promoError && (
                          <p className="text-[11px] text-rose-500 font-medium pl-1">{promoError}</p>
                        )}

                        {/* Quick Pick Active Vouchers */}
                        {user?.coupons && user.coupons.filter(c => !c.isUsed).length > 0 && !promoApplied && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            <span className="text-[10.5px] text-gray-500 font-semibold">Your vouchers:</span>
                            {user.coupons.filter(c => !c.isUsed).map(c => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => handleApplyPromoCode(c.code)}
                                className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10.5px] font-bold transition-all cursor-pointer shadow-2xs"
                              >
                                {c.code} ({c.discountPercent}% OFF)
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Payment Method Selector */}
                      <div className="py-3.5 border-b border-gray-100 space-y-2">
                        <label className="block text-xs font-bold text-gray-800">
                          Select Payment Method
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            { name: "ABA Pay (KHQR)", icon: "🇰🇭", badge: "Instant" },
                            { name: "Credit Card (Visa)", icon: "💳", badge: "Verified" },
                            { name: "Apple / Google Pay", icon: "📱", badge: "Fast" },
                            { name: "Cash on Delivery", icon: "💵", badge: "Pay Later" },
                          ].map((m) => (
                            <button
                              key={m.name}
                              type="button"
                              onClick={() => setPaymentMethod(m.name)}
                              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${paymentMethod === m.name
                                ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold"
                                : "bg-gray-50/70 border-gray-200 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-base">{m.icon}</span>
                                <span className="text-[9px] bg-white px-1.5 py-0.2 rounded font-bold text-gray-500 border border-gray-200">
                                  {m.badge}
                                </span>
                              </div>
                              <span className="text-[11px] font-semibold mt-1 truncate">
                                {m.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Financial Calculation Lines */}
                      <div className="space-y-2.5 text-xs text-gray-600 py-3.5 border-b border-gray-200">
                        <div className="flex justify-between">
                          <span>Dishes Subtotal ({totalCartCount} items)</span>
                          <span className="font-bold text-gray-900 font-mono">${totalCartSubtotal.toFixed(2)}</span>
                        </div>

                        {discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-700 font-bold">
                            <span>Discount ({discountPercent}%)</span>
                            <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span>Delivery &amp; Service Fee</span>
                          {isFreeDelivery ? (
                            <span className="text-emerald-800 font-black uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md">
                              FREE ($0.00)
                            </span>
                          ) : (
                            <span className="font-bold text-gray-900 font-mono">${deliveryFee.toFixed(2)}</span>
                          )}
                        </div>

                        <div className="flex justify-between">
                          <span>Estimated VAT / Tax (8%)</span>
                          <span className="font-bold text-gray-900 font-mono">${tax.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Grand Total Highlight */}
                      <div className="pt-3.5 pb-2 flex items-baseline justify-between">
                        <div>
                          <span className="text-sm font-black text-gray-900 block uppercase tracking-tight">
                            Total Due
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            Includes all dishes, taxes &amp; packaging
                          </span>
                        </div>
                        <span className="text-2xl font-black text-emerald-800 font-mono">
                          ${grandTotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Confirm & Place Order CTA Button */}
                      <button
                        type="button"
                        disabled={isSubmittingOrder}
                        onClick={handleConfirmOrder}
                        className="w-full mt-3 py-4 px-5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 disabled:opacity-60 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/25 transition-all active:scale-98 cursor-pointer"
                      >
                        {isSubmittingOrder ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Confirming &amp; Generating Bill...</span>
                          </div>
                        ) : (
                          <>
                            <span>Confirm Order &amp; Pay • ${grandTotal.toFixed(2)}</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-gray-400 text-center mt-3">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span>Instant order receipt &amp; real-time kitchen tracking</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: PLACED ORDER BILL & History/}
          {/* ============================================================ */}
          {activeTab === "detail" && currentOrder && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN (7 cols): Order Status Tracking & Menu Breakdown */}
              <div className="lg:col-span-7 space-y-6">

                {/* 2. Menu Items in this Order */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <UtensilsCrossed size={17} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-gray-900 leading-tight">
                          Dishes Ordered in this Bill
                        </h3>
                        <span className="text-xs text-gray-500 font-medium">
                          {currentOrder.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                          dishes total
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReorder(currentOrder.id, currentOrder.orderNumber)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={13} />
                      <span>Reorder All Dishes</span>
                    </button>
                  </div>

                  {/* List of Ordered Food Items */}
                  <div className="divide-y divide-gray-100 mt-2">
                    {currentOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-3.5 flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-2xs">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              loading="lazy"
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-100">
                                {item.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                ${item.price.toFixed(2)} × {item.quantity}
                              </span>
                              {(() => {
                                const ptsPerUnit = item.rewardPoints !== undefined ? item.rewardPoints : calculateItemRewardPoints(item);
                                const itemPts = ptsPerUnit * item.quantity;
                                if (itemPts <= 0) return null;
                                return (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md border inline-flex items-center gap-0.5 text-emerald-800 bg-emerald-50 border-emerald-100">
                                    +{itemPts} pts
                                  </span>
                                );
                              })()}
                            </div>
                            {item.notes && (
                              <p className="text-[11px] text-amber-800 italic mt-0.5">
                                Note: &quot;{item.notes}&quot;
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm sm:text-base font-black text-gray-900 font-mono">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <Link
                            href={`/Food?search=${encodeURIComponent(item.name)}`}
                            className="text-[10.5px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline block mt-0.5"
                          >
                            View on Menu
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Delivery Details Footer */}
                  <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

                    {/* CARD 1: CUSTOMER INFO */}
                    <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 flex flex-col justify-between">
                      <div>
                        {/* Card Header */}
                        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-gray-400 text-gray-500 uppercase tracking-wider font-semibold text-[11px]">
                          <User size={14} className="text-emerald-600 shrink-0" />
                          <span>Customer Info</span>
                        </div>

                        {/* Customer Details */}
                        <div className="space-y-2">
                          <div className="font-bold text-gray-900 text-sm">
                            {currentOrder?.customer?.name}
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={13} className="text-gray-400 shrink-0" />
                            <span className="truncate">{currentOrder?.customer?.email}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={13} className="text-gray-400 shrink-0" />
                            <span>{currentOrder?.customer?.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CARD 2: DELIVERY INFO */}
                    <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 flex flex-col justify-between">
                      <div>
                        {/* Card Header */}
                        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-gray-400 text-gray-700 uppercase tracking-wider font-semibold text-[11px]">
                          <Truck size={14} className="text-emerald-600 shrink-0" />
                          <span>Delivery Info</span>
                        </div>

                        {/* Delivery Details */}
                        <div className="space-y-2.5">
                          {/* Delivery Company/Provider */}
                          {(() => {
                            const partnerName = currentOrder.deliveryPartner || "GrabExpress";
                            const partnerObj = DELIVERY_OPTIONS.find(
                              (c) => c.id === partnerName || c.label === partnerName
                            );
                            const partnerImage = currentOrder.deliveryCompanyImage || partnerObj?.image;

                            return (
                              <div className="flex items-center justify-between">
                                <span className="text-gray-800 font-medium">Delivery Partner:</span>
                                <div className="flex items-center gap-1.5 font-semibold text-gray-800 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                  <span>{partnerName}</span>
                                  {partnerImage && (
                                    <img
                                      src={partnerImage}
                                      alt={partnerName}
                                      className="w-12 h-12 object-contain shrink-0"
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Address */}
                          <div className="flex items-start gap-2 text-gray-700">
                            <MapPin size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight font-medium">
                              {currentOrder.customer.address}
                            </span>
                          </div>

                          {/* Special Instructions / Notes */}
                          {currentOrder.customer.notes && (
                            <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-gray-100 text-gray-500 italic text-[11px]">
                              <MessageSquare size={12} className="text-gray-600 shrink-0 mt-0.5" />
                              <span className="text-gray-600">&quot;{currentOrder.customer.notes}&quot;</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (5 cols): Official Tax Invoice / Payment Bill */}
              <div className="lg:col-span-5 space-y-4 print:w-full">
                {/* Print/Download Toolbar */}
                <div className="flex flex-col gap-1.5 print:hidden">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                      >
                        <Printer size={14} />
                        <span>Print / PDF Bill</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                      >
                        <Share2 size={13} />
                        <span>{copiedLink ? "Link Copied!" : "Share Bill"}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowQRModal(true)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <QrCode size={14} />
                      <span>QR Receipt</span>
                    </button>
                  </div>
                  <p className="text-[10.5px] text-gray-400 pl-1">
                    In the print dialog, choose "Save as PDF" to download.
                  </p>
                </div>

                {/* THE OFFICIAL BILL / INVOICE CARD */}
                <div
                  id="printable-bill"
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-md relative overflow-hidden print:border-none print:shadow-none"
                >
                  <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 absolute top-0 left-0" />

                  {/* Bill Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                    <div>
                      <div className="text-lg font-black text-emerald-700 flex items-center gap-1.5">
                        <span>TastyByte Foods</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">
                        Official Bill &amp; Tax Receipt
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Tax ID: VAT-9948102-KH
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-gray-900 block">
                        TAX INVOICE
                      </span>
                      <span className="text-xs font-mono text-emerald-900 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        #{currentOrder.orderNumber}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        {new Date(currentOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Status Pill */}
                  <div className="my-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-emerald-700" />
                      <div>
                        <span className="font-bold text-emerald-950 block">
                          {currentOrder.bill.paymentMethod}
                        </span>
                        <span className="text-[10.5px] text-emerald-700 font-mono">
                          Ref: {currentOrder.bill.transactionId}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10.5px] uppercase tracking-wider shadow-2xs">
                      {currentOrder.bill.paymentStatus}
                    </span>
                  </div>

                  <table className="min-w-full space-y-2.5 text-xs text-gray-700 py-3">
                    <thead className="font-bold uppercase tracking-wider text-black border-b-1 border-black">
                      <tr className="flex justify-between">
                        <th className="text-left">Menu Item</th>
                        <th className="text-center ml-28">Qty</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrder.items.map((item) => (
                        <tr key={item.id} className="flex justify-between">
                          <td className="font-medium truncate w-[200px] ">
                            {item.name}
                          </td>
                          <td className="font-bold font-mono text-center mr-10">
                            {item.quantity}
                          </td>
                          <td className="font-bold text-gray-900 font-mono text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Financial Calculations */}
                  <div className="space-y-2 text-xs text-gray-600 py-3 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span>Dishes Subtotal</span>
                      <span className="font-bold text-gray-900 font-mono">
                        ${currentOrder.bill.subtotal.toFixed(2)}
                      </span>
                    </div>

                    {currentOrder.bill.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Discount ({currentOrder.bill.promoApplied || "Coupon"})</span>
                        <span className="font-mono">
                          -${currentOrder.bill.discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span>Delivery Fee</span>
                      {currentOrder.bill.deliveryFee === 0 ? (
                        <span className="text-emerald-800 font-black uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded">
                          FREE
                        </span>
                      ) : (
                        <span className="font-bold text-gray-900 font-mono">
                          ${currentOrder.bill.deliveryFee.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span>Estimated VAT / Tax (8%)</span>
                      <span className="font-bold text-gray-900 font-mono">
                        ${currentOrder.bill.tax.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Total Paid Amount Highlight */}
                  <div className="pt-3.5 pb-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-black text-gray-900 block uppercase tracking-tight">
                        Total Paid
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Includes all applicable taxes
                      </span>
                    </div>
                    <span className="text-2xl font-black text-emerald-800 font-mono">
                      ${currentOrder.bill.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Points Earned on Order */}
                  <div className="mt-2.5 p-2.5 bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-500" />
                      <span>Loyalty Points Earned:</span>
                    </span>
                    <span className="font-mono font-black text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-lg border border-amber-300">
                      +{currentOrder.earnedPoints !== undefined
                        ? currentOrder.earnedPoints
                        : calculateRewardPoints(currentOrder.bill?.subtotal || currentOrder.bill?.total || 0)} PTS
                    </span>
                  </div>

                  {/* Digital Stamp / Guarantee */}
                  <div className="mt-4 pt-3 border-t border-dashed border-gray-200 text-center space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-bold">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>Verified Genuine Payment Receipt</span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Thank you for Ordering with TastyByte! For inquiries contact billing@tastybyte.com
                    </p>
                  </div>
                </div>

                {/* Reorder Button */}
                <div className="flex flex-col gap-2.5 print:hidden">
                  <button
                    type="button"
                    onClick={() => handleReorder(currentOrder.id, currentOrder.orderNumber)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <RotateCcw size={15} />
                    <span>Reorder All Items in this Bill</span>
                  </button>

                  <Link
                    href="/Food"
                    className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all"
                  >
                    <ShoppingBag size={14} />
                    <span>Explore More Food Dishes</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: ALL ORDERS HISTORY VIEW */}
          {/* ============================================================ */}
          {activeTab === "history" && (
            <div className="space-y-6">
              {/* Filter & Search Toolbar */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search by Order # or dish name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-gray-900 font-medium"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  {["all", "active", "delivered"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFilterStatus(status)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${filterStatus === status
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {status === "all" ? "All Orders" : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* List of Historical Orders */}
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <Receipt size={30} />
                  </div>
                  <h3 className="text-base font-bold text-gray-800">No matching orders found</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Try searching with another keyword or place a new tasty order from our menu!
                  </p>
                  <Link
                    href="/Food"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <ShoppingBag size={14} />
                    <span>Explore Food Menu</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-5 border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div>
                        {/* Order Number & Status Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                        </div>

                        {/* Items Thumbnails Preview */}
                        <div className="py-3.5 flex items-center gap-2 overflow-x-auto">
                          {order.items.slice(0, 4).map((item, idx) => (
                            <div
                              key={idx}
                              className="relative h-13 w-13 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0"
                              title={`${item.name} (${item.quantity}x)`}
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute bottom-0 right-0 bg-black/75 text-white text-[9px] font-bold px-1 rounded-tl">
                                ×{item.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <span className="text-xs font-bold text-gray-500 pl-1">
                              +{order.items.length - 4} more
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-600 flex items-center justify-between flex-wrap gap-1">
                          <span>
                            <strong>{order.items.reduce((s, i) => s + i.quantity, 0)}</strong>{" "}
                            dishes • Paid via {order.bill.paymentMethod}
                          </span>
                          {order.deliveryPartner && (
                            <span className="text-[10.5px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                              {order.deliveryPartner}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                            Bill Total
                          </span>
                          <span className="text-base font-black text-emerald-800 font-mono">
                            ${order.bill.total.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleReorder(order.id, order.orderNumber)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200 transition-colors cursor-pointer"
                          >
                            <RotateCcw size={12} />
                            <span>Reorder</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrder(order);
                              setActiveTab("detail");
                            }}
                            className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>View Bill</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Digital QR Receipt Modal */}
        {showQRModal && currentOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowQRModal(false)}
          >
            <div
              className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-gray-100 space-y-4 animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <QrCode size={26} />
              </div>

              <div>
                <h3 className="text-base font-black text-gray-900">
                  Digital Bill QR Code
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Order #{currentOrder.orderNumber} • ${currentOrder.bill.total.toFixed(2)}
                </p>
              </div>

              {/* QR Code Graphic Box */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 inline-block">
                <div className="w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
                  <div className="w-full h-full border-4 border-dashed border-emerald-700 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                    <QrCode size={80} className="text-emerald-900" />
                    <span className="text-[9px] font-mono text-emerald-800 font-bold mt-1">
                      {currentOrder.bill.transactionId}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed">
                Scan this QR code with any mobile scanner to inspect itemized payment verification and invoice details.
              </p>

              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-gray-600">
              Loading Order Menu &amp; Bill Details...
            </span>
          </div>
        </div>
      }
    >
      <OrdersPageContent />
    </Suspense>
  );
}