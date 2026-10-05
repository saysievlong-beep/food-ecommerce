"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

export type OrderItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  notes?: string;
  rewardPoints?: number;
  categoryId?: string;
};

/**
 * Reward points rule:
 * $10 spent = 2 points ($5 = 1 pt).
 * E.g., $10 = 2 pts, $20 = 4 pts, $50 = 10 pts, $100 = 20 pts.
 */
export function calculateRewardPoints(amount: number): number {
  if (!amount || amount <= 0) return 0;
  return Math.floor(amount / 5);
}

export function calculateItemRewardPoints(item: {
  price?: number;
  category?: string;
  categoryId?: string;
  name?: string;
}): number {
  const price = typeof item?.price === "number" ? item.price : 0;
  return calculateRewardPoints(price);
}

export function isDoublePointItem(_item?: {
  category?: string;
  categoryId?: string;
  name?: string;
  price?: number;
}): boolean {
  return false;
}

export type BillDetails = {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  promoApplied?: string;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Cash on Delivery";
  transactionId: string;
};

export type OrderTimelineStep = {
  title: string;
  time: string;
  completed: boolean;
  current?: boolean;
  description: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status:
    | "Order Confirmed"
    | "Preparing in Kitchen"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
  items: OrderItem[];
  deliveryPartner?: string;
  deliveryCompanyImage?: string;
  earnedPoints?: number;
  bill: BillDetails;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  };
  estimatedDeliveryTime: string;
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
  timeline: OrderTimelineStep[];
};

interface OrderContextType {
  // Cart / Pending Order Items
  cartItems: OrderItem[];
  totalCartCount: number;
  totalCartSubtotal: number;
  addToCart: (item: Omit<OrderItem, "quantity"> & { quantity?: number; notes?: string }) => void;
  updateCartQuantity: (id: string, newQty: number) => void;
  updateItemNotes: (id: string, notes: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  lastAddedItemName: string | null;

  // Placed Orders & Bills History
  orders: Order[];
  activeOrders: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  getOrderById: (id: string) => Order | undefined;
  placeOrder: (
    items: OrderItem[],
    bill: Omit<BillDetails, "transactionId" | "paymentStatus"> & {
      paymentMethod?: string;
      paymentStatus?: "Paid" | "Pending" | "Cash on Delivery";
    },
    customerInfo?: Partial<Order["customer"]>,
    deliveryDetails?: {
      deliveryPartner?: string;
      deliveryCompanyImage?: string;
      estimatedDeliveryTime?: string;
    }
  ) => Order;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, newStatus: Order["status"]) => void;
  reorderOrder: (orderId: string) => void;
  clearAllOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = "tastybyte_orders_v1";
const CART_STORAGE_KEY = "tastybyte_cart_v1";

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: "TB-92841",
    orderNumber: "TB-92841",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
    status: "Out for Delivery",
    deliveryPartner: "GrabExpress",
    deliveryCompanyImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM0FSVsPuFpIM89c949TBNHJQAJrkyiy8VeefTq7xEnw&s=10",
    earnedPoints: 8,
    items: [
      {
        id: "demo-1",
        name: "Artisan Truffle Beef Burger",
        category: "Burgers",
        price: 14.5,
        quantity: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "demo-2",
        name: "Crispy Parmesan Garlic Fries",
        category: "Sides",
        price: 5.25,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "demo-3",
        name: "Fresh Strawberry Basil Lemonade",
        category: "Drinks",
        price: 4.5,
        quantity: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
      },
    ],
    bill: {
      subtotal: 43.25,
      discountPercent: 10,
      discountAmount: 4.33,
      promoApplied: "TASTY10 (10% OFF)",
      deliveryFee: 0.0,
      tax: 3.11,
      total: 42.03,
      paymentMethod: "ABA Pay (KHQR)",
      paymentStatus: "Paid",
      transactionId: "TXN-8839201948",
    },
    customer: {
      name: "Alex Vance",
      email: "alex.vance@example.com",
      phone: "+855 (012) 889-421",
      address: "Street 240, Daun Penh, Phnom Penh, Cambodia",
      notes: "Please ring the bell and leave at the front door.",
    },
    estimatedDeliveryTime: "12-15 mins",
    driver: {
      name: "Sopheap Chan",
      phone: "+855 (096) 554-123",
      vehicle: "Honda Wave Alpha (1AY-9942)",
      rating: 4.9,
    },
    timeline: [
      {
        title: "Order Placed & Paid",
        time: "18 mins ago",
        completed: true,
        description: "Payment confirmed via ABA Pay (KHQR)",
      },
      {
        title: "Kitchen Cooking",
        time: "12 mins ago",
        completed: true,
        description: "Chef started preparing Artisan Truffle Beef Burger & sides",
      },
      {
        title: "Out for Delivery",
        time: "4 mins ago",
        completed: true,
        current: true,
        description: "Driver Sopheap Chan picked up your fresh hot order",
      },
      {
        title: "Delivered & Enjoy",
        time: "Est. in ~12 mins",
        completed: false,
        description: "Driver is 1.4 km away from your location",
      },
    ],
  },
  {
    id: "TB-81204",
    orderNumber: "TB-81204",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    status: "Delivered",
    deliveryPartner: "Foodpanda",
    deliveryCompanyImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShbQX-3iw27RRT8715x-g9uo9085B71IudZQc-oIuADYdQJ9Zixyk71FY&s=10",
    earnedPoints: 5,
    items: [
      {
        id: "demo-4",
        name: "Neapolitan Wood-Fired Margherita Pizza",
        category: "Pizza",
        price: 16.0,
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "demo-5",
        name: "Signature Italian Tiramisu",
        category: "Desserts",
        price: 6.5,
        quantity: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
      },
    ],
    bill: {
      subtotal: 29.0,
      discountPercent: 0,
      discountAmount: 0,
      promoApplied: undefined,
      deliveryFee: 3.99,
      tax: 2.32,
      total: 35.31,
      paymentMethod: "Credit Card (Visa •••• 4242)",
      paymentStatus: "Paid",
      transactionId: "TXN-7193021944",
    },
    customer: {
      name: "Alex Vance",
      email: "alex.vance@example.com",
      phone: "+855 (012) 889-421",
      address: "Street 240, Daun Penh, Phnom Penh, Cambodia",
      notes: "Leave with building reception.",
    },
    estimatedDeliveryTime: "Delivered",
    driver: {
      name: "Dara Meng",
      phone: "+855 (088) 332-901",
      vehicle: "Yamaha Scoopy (1FE-4312)",
      rating: 5.0,
    },
    timeline: [
      {
        title: "Order Placed & Paid",
        time: "2 days ago",
        completed: true,
        description: "Payment verified with Visa",
      },
      {
        title: "Kitchen Prepared",
        time: "2 days ago",
        completed: true,
        description: "Pizza baked fresh in wood-fired oven",
      },
      {
        title: "Out for Delivery",
        time: "2 days ago",
        completed: true,
        description: "Dispatched with Dara Meng",
      },
      {
        title: "Delivered Successfully",
        time: "2 days ago",
        completed: true,
        description: "Delivered at reception lobby. Enjoy your meal!",
      },
    ],
  },
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user, requireAuth, addRewardPoints } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [lastAddedItemName, setLastAddedItemName] = useState<string | null>(null);

  // Load cart and orders from localStorage
  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validOrders = parsed.length > 20 ? parsed.slice(0, parsed.length - 2) : parsed;
          setOrders(validOrders);
          setSelectedOrder(validOrders[0]);
          if (parsed.length > 20) {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(validOrders));
          }
        } else {
          setOrders(INITIAL_DEMO_ORDERS);
          setSelectedOrder(INITIAL_DEMO_ORDERS[0]);
        }
      } else {
        setOrders(INITIAL_DEMO_ORDERS);
        setSelectedOrder(INITIAL_DEMO_ORDERS[0]);
        localStorage.setItem(
          ORDERS_STORAGE_KEY,
          JSON.stringify(INITIAL_DEMO_ORDERS)
        );
      }

      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (e) {
      console.error("Error loading orders/cart from localStorage", e);
      setOrders(INITIAL_DEMO_ORDERS);
      setSelectedOrder(INITIAL_DEMO_ORDERS[0]);
    }
  }, []);

  // Save cart to localStorage
  const saveCart = useCallback((newCart: OrderItem[]) => {
    setCartItems(newCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  }, []);

  // Add item to cart (immediate guest/user cart support)
  const addToCart = useCallback(
    (item: Omit<OrderItem, "quantity"> & { quantity?: number; notes?: string; categoryId?: string; rewardPoints?: number }) => {
      setCartItems((prev) => {
        const addQty = item.quantity || 1;
        const ptsPerItem =
          item.rewardPoints !== undefined
            ? item.rewardPoints
            : calculateItemRewardPoints({
                price: item.price,
                category: item.category,
                categoryId: item.categoryId,
                name: item.name,
              });

        const existing = prev.find((i) => i.id === item.id);
        let updated: OrderItem[];
        if (existing) {
          updated = prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: i.quantity + addQty,
                  notes: item.notes || i.notes,
                  rewardPoints: ptsPerItem,
                }
              : i
          );
        } else {
          updated = [
            ...prev,
            {
              id: item.id,
              name: item.name,
              category: item.category,
              price: item.price,
              quantity: addQty,
              imageUrl: item.imageUrl,
              notes: item.notes,
              rewardPoints: ptsPerItem,
              categoryId: item.categoryId,
            },
          ];
        }
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Error saving cart", e);
        }
        return updated;
      });

      setLastAddedItemName(item.name);
      setTimeout(() => setLastAddedItemName(null), 3000);
    },
    []
  );

  const updateCartQuantity = useCallback(
    (id: string, newQty: number) => {
      setCartItems((prev) => {
        let updated: OrderItem[];
        if (newQty <= 0) {
          updated = prev.filter((i) => i.id !== id);
        } else {
          updated = prev.map((i) =>
            i.id === id ? { ...i, quantity: newQty } : i
          );
        }
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error("Error saving cart", e);
        }
        return updated;
      });
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving cart", e);
      }
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error("Error clearing cart", e);
    }
  }, []);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Save orders to localStorage (if more than 20 orders, prune the 2 oldest orders)
  const saveOrders = useCallback((newOrders: Order[]) => {
    let finalOrders = newOrders;
    if (finalOrders.length > 20) {
      finalOrders = finalOrders.slice(0, finalOrders.length - 2);
    }
    setOrders(finalOrders);
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(finalOrders));
    } catch (e) {
      console.error("Error saving orders to localStorage", e);
    }
  }, []);

  const getOrderById = useCallback(
    (id: string) => {
      return orders.find(
        (o) =>
          o.id.toLowerCase() === id.toLowerCase() ||
          o.orderNumber.toLowerCase() === id.toLowerCase()
      );
    },
    [orders]
  );

  const placeOrder = useCallback(
    (
      items: OrderItem[],
      bill: Omit<BillDetails, "transactionId" | "paymentStatus"> & {
        paymentMethod?: string;
        paymentStatus?: "Paid" | "Pending" | "Cash on Delivery";
      },
      customerInfo?: Partial<Order["customer"]>,
      deliveryDetails?: {
        deliveryPartner?: string;
        deliveryCompanyImage?: string;
        estimatedDeliveryTime?: string;
      }
    ): Order => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const orderId = `TB-${randomNum}`;
      const now = new Date();
      const timeFormatted = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const customerName = customerInfo?.name || user?.name || "Valued Customer";
      const customerEmail =
        customerInfo?.email || user?.email || "customer@example.com";
      const customerPhone = customerInfo?.phone || "+855 (012) 889-421";
      const customerAddress =
        customerInfo?.address || user?.address || "Street 240, Daun Penh, Phnom Penh, Cambodia";

      // Calculate reward points earned: $10 = 2 pts ($5 = 1 pt) based on order subtotal/total
      const totalEarnedPoints = calculateRewardPoints(bill.subtotal > 0 ? bill.subtotal : bill.total);

      const newOrder: Order = {
        id: orderId,
        orderNumber: orderId,
        createdAt: now.toISOString(),
        status: "Preparing in Kitchen",
        items: [...items],
        deliveryPartner: deliveryDetails?.deliveryPartner || "GrabExpress",
        deliveryCompanyImage: deliveryDetails?.deliveryCompanyImage,
        earnedPoints: totalEarnedPoints,
        bill: {
          subtotal: bill.subtotal,
          discountPercent: bill.discountPercent,
          discountAmount: bill.discountAmount,
          promoApplied: bill.promoApplied,
          deliveryFee: bill.deliveryFee,
          tax: bill.tax,
          total: bill.total,
          paymentMethod: bill.paymentMethod || "Credit Card (Visa •••• 4242)",
          paymentStatus: bill.paymentStatus || "Paid",
          transactionId: `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        },
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress,
          notes: customerInfo?.notes || "Fresh and hot delivery requested.",
        },
        estimatedDeliveryTime: deliveryDetails?.estimatedDeliveryTime || "25-35 mins",
        driver: {
          name: "Vireak Bot",
          phone: "+855 (097) 771-409",
          vehicle: "Honda Click 125i (1BZ-8102)",
          rating: 4.95,
        },
        timeline: [
          {
            title: "Order Placed & Bill Paid",
            time: `Just now (${timeFormatted})`,
            completed: true,
            description: `Payment of $${bill.total.toFixed(2)} confirmed successfully • Earned +${totalEarnedPoints} pts`,
          },
          {
            title: "Kitchen Preparing Order",
            time: `Est. 10 mins`,
            completed: true,
            current: true,
            description: `Chef is currently cooking ${items.reduce((s, i) => s + i.quantity, 0)} menu item(s)`,
          },
          {
            title: "Driver Pickup & Dispatch",
            time: `Est. in 15 mins`,
            completed: false,
            description: `Assigned to delivery driver Vireak Bot`,
          },
          {
            title: "Arrived at Customer Door",
            time: `Est. in 25-35 mins`,
            completed: false,
            description: `Delivery to ${customerAddress}`,
          },
        ],
      };

      // Award points to user profile
      if (addRewardPoints && totalEarnedPoints > 0) {
        addRewardPoints(totalEarnedPoints, `Earned from Order #${orderId}`, orderId);
      }

      const updated = [newOrder, ...orders];
      saveOrders(updated);
      setSelectedOrder(newOrder);
      clearCart();
      return newOrder;
    },
    [addRewardPoints, clearCart, orders, saveOrders, user]
  );

  const cancelOrder = useCallback(
    (orderId: string) => {
      const updated = orders.map((o) =>
        o.id === orderId ? { ...o, status: "Cancelled" as const } : o
      );
      saveOrders(updated);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: "Cancelled" } : null));
      }
    },
    [orders, saveOrders, selectedOrder]
  );

  const updateItemNotes = useCallback((id: string, notes: string) => {
    setCartItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, notes } : i));
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving cart item notes", e);
      }
      return updated;
    });
  }, []);

  const reorderOrder = useCallback((orderId: string) => {
    const targetOrder = orders.find(
      (o) => o.id.toLowerCase() === orderId.toLowerCase() || o.orderNumber.toLowerCase() === orderId.toLowerCase()
    );
    if (!targetOrder || targetOrder.items.length === 0) return;

    setCartItems((prev) => {
      const merged = [...prev];
      targetOrder.items.forEach((item) => {
        const idx = merged.findIndex((i) => i.id === item.id);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + item.quantity };
        } else {
          merged.push({ ...item });
        }
      });
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        console.error("Error saving reordered items", e);
      }
      return merged;
    });

    setLastAddedItemName(`${targetOrder.items.length} dishes from Order #${targetOrder.orderNumber}`);
    setTimeout(() => setLastAddedItemName(null), 3000);
  }, [orders]);

  const updateOrderStatus = useCallback((orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id === orderId || o.orderNumber === orderId) {
          const updatedTimeline = o.timeline.map((step) => {
            if (newStatus === "Delivered") {
              return { ...step, completed: true, current: step.title.includes("Delivered") };
            }
            if (newStatus === "Out for Delivery") {
              if (step.title.includes("Order Placed") || step.title.includes("Kitchen") || step.title.includes("Driver Pickup") || step.title.includes("Out for Delivery")) {
                return { ...step, completed: true, current: step.title.includes("Out for Delivery") || step.title.includes("Pickup") };
              }
              return { ...step, completed: false, current: false };
            }
            if (newStatus === "Preparing in Kitchen") {
              if (step.title.includes("Order Placed") || step.title.includes("Kitchen")) {
                return { ...step, completed: true, current: step.title.includes("Kitchen") };
              }
              return { ...step, completed: false, current: false };
            }
            return step;
          });

          return {
            ...o,
            status: newStatus,
            timeline: updatedTimeline,
            estimatedDeliveryTime: newStatus === "Delivered" ? "Delivered" : o.estimatedDeliveryTime,
          };
        }
        return o;
      });

      saveOrders(updated);
      return updated;
    });

    setSelectedOrder((prev) => {
      if (prev && (prev.id === orderId || prev.orderNumber === orderId)) {
        const target = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        return target ? { ...target, status: newStatus } : prev;
      }
      return prev;
    });
  }, [orders, saveOrders]);

  const clearAllOrders = useCallback(() => {
    saveOrders([]);
    setSelectedOrder(null);
  }, [saveOrders]);

  const activeOrders = orders.filter(
    (o) =>
      o.status === "Order Confirmed" ||
      o.status === "Preparing in Kitchen" ||
      o.status === "Out for Delivery"
  );

  return (
    <OrderContext.Provider
      value={{
        cartItems,
        totalCartCount,
        totalCartSubtotal,
        addToCart,
        updateCartQuantity,
        updateItemNotes,
        removeFromCart,
        clearCart,
        lastAddedItemName,
        orders,
        activeOrders,
        selectedOrder,
        setSelectedOrder,
        getOrderById,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        reorderOrder,
        clearAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
