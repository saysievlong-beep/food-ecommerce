'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CheckCircle2, Gift } from 'lucide-react';
import LoginModal from '../components/LoginModal';

export type UserCoupon = {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  pointsCost?: number;
};

export type PointHistoryItem = {
  id: string;
  title: string;
  points: number; // positive for earned, negative for spent
  type: 'earned' | 'redeemed' | 'bonus';
  date: string;
  orderNumber?: string;
};

export type UserProfile = {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
  address?: string;
  joinedDate?: string;
  rewardPoints?: number;
  pointHistory?: PointHistoryItem[];
  coupons?: UserCoupon[];
};

export type CouponTier = {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  pointsCost: number;
  description: string;
  badge: string;
};

export const REWARD_COUPON_TIERS: CouponTier[] = [
  {
    id: 'tier-20',
    code: 'REWARD20',
    title: '20% OFF Feast Saver',
    discountPercent: 20,
    pointsCost: 150,
    description: 'Save 20% on any food order. Redeemable with 150 reward points!',
    badge: 'Popular',
  },
  {
    id: 'tier-30',
    code: 'CHEF30',
    title: '30% OFF Chef Choice',
    discountPercent: 30,
    pointsCost: 200,
    description: 'Save 30% on your delicious meal. Redeemable with 200 reward points.',
    badge: 'Saver',
  },
  {
    id: 'tier-40',
    code: 'FEAST40',
    title: '40% OFF Gourmet Deluxe',
    discountPercent: 40,
    pointsCost: 300,
    description: 'Enjoy 40% discount on your entire cart. Redeemable with 300 points.',
    badge: 'Best Value',
  },
  {
    id: 'tier-50',
    code: 'VIP50',
    title: '50% OFF VIP Half-Price',
    discountPercent: 50,
    pointsCost: 400,
    description: 'Huge 50% discount on all dishes! Redeemable with 400 points.',
    badge: 'VIP Only',
  },
  {
    id: 'tier-70',
    code: 'ULTRA70',
    title: '70% OFF Grand Master Feast',
    discountPercent: 70,
    pointsCost: 500,
    description: 'Ultimate 70% OFF mega reward! Redeemable with 500 reward points.',
    badge: 'Mega Deal',
  },
];

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  isLoginModalOpen: boolean;
  loginPromptMessage: string;
  openLoginModal: (message?: string, onSuccessCallback?: () => void) => void;
  closeLoginModal: () => void;
  login: (email?: string, name?: string, phone?: string, address?: string, isNewAccount?: boolean) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  markCouponUsed: (code: string) => void;
  addRewardPoints: (points: number, sourceTitle: string, orderNumber?: string) => void;
  redeemCouponWithPoints: (tier: CouponTier) => { success: boolean; message: string; coupon?: UserCoupon };
  resetPoints: () => void;
  getNewUserCouponStatus: () => {
    coupon: UserCoupon | null;
    isValid: boolean;
    isExpired: boolean;
    isUsed: boolean;
    remainingDays: number;
    remainingHours: number;
    remainingText: string;
  };
  requireAuth: (action: () => void, message?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'tastybyte_auth_user_v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState<string>('');
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string }>({
    title: 'Signed in successfully!',
    subtitle: '',
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        if (parsed && (parsed.email || parsed.phone)) {
          // Default reward points if missing or outdated legacy scale
          if (parsed.rewardPoints === undefined || parsed.rewardPoints === 250 || parsed.rewardPoints === 15) {
            parsed.rewardPoints = 0;
          }
          if (!parsed.pointHistory || parsed.pointHistory.length === 0 || parsed.pointHistory[0]?.points === 100) {
            parsed.pointHistory = [
              {
                id: 'ph-welcome',
                title: 'New Member Welcome Bonus',
                points: 5,
                type: 'bonus',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              },
              {
                id: 'ph-init-1',
                title: 'Earned from Order #TB-92841 ($43.25 spend)',
                points: 8,
                type: 'earned',
                date: new Date(Date.now() - 1000 * 60 * 60 * 24).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                orderNumber: 'TB-92841',
              },
            ];
          }

          // Check if coupon exists, if not generate default 3-day welcome coupon
          if (!parsed.coupons || parsed.coupons.length === 0) {
            const now = new Date();
            const expiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
            parsed.coupons = [
              {
                id: 'coupon-welcome-10',
                code: 'WELCOME10',
                title: 'New User 10% OFF (Valid 3 Days)',
                discountPercent: 10,
                createdAt: now.toISOString(),
                expiresAt: expiry.toISOString(),
                isUsed: false,
              },
            ];
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(parsed));
          }
          setUser(parsed);
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      console.error('Error loading auth from localStorage', e);
    }
  }, []);

  const login = useCallback(
    (
      customEmail?: string,
      customName?: string,
      customPhone?: string,
      customAddress?: string,
      isNewAccount: boolean = false
    ) => {
      const now = new Date();
      // 3 days expiry from creation:
      const expiry = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

      const welcomeCoupon: UserCoupon = {
        id: 'coupon-welcome-10',
        code: 'WELCOME10',
        title: 'New User 10% OFF',
        discountPercent: 10,
        createdAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
        isUsed: false,
      };

      const isNew = Boolean(isNewAccount);
      const isDemo = !isNew && customEmail === 'alex.vance@example.com' && !customName;

      const authUser: UserProfile = {
        name: customName || (customEmail ? customEmail.split('@')[0] : 'Alex Vance'),
        email: customEmail || 'alex.vance@example.com',
        phone: customPhone || '+855 12 345 678',
        role: isNew ? 'Member' : (isDemo ? 'Gold Member' : 'Member'),
        address: customAddress || 'Phnom Penh, Cambodia',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        rewardPoints: isNew ? 0 : 0, // Fresh/first user starts with 0 pts
        pointHistory: [],
        coupons: [welcomeCoupon],
      };

      setUser(authUser);
      setIsLoggedIn(true);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      } catch (e) {
        console.error('Error saving auth to localStorage', e);
      }

      if (isNewAccount) {
        setToastMessage({
          title: 'Account created! 🎁 10% OFF Coupon added',
          subtitle: 'Code: WELCOME10 (Expires in 3 days) • 0 Points to start',
        });
      } else {
        setToastMessage({
          title: 'Signed in successfully!',
          subtitle: `Welcome back, ${authUser.name}`,
        });
      }

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);

      // Execute pending action if any
      if (pendingCallback) {
        const cb = pendingCallback;
        setPendingCallback(null);
        setTimeout(() => {
          cb();
        }, 100);
      }

      setIsLoginModalOpen(false);
    },
    [pendingCallback]
  );

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error updating user profile in localStorage', e);
      }
      return updated;
    });
  }, []);

  const addRewardPoints = useCallback((points: number, sourceTitle: string, orderNumber?: string) => {
    if (points <= 0) return;
    setUser((prev) => {
      if (!prev) return prev;
      const newPoints = (prev.rewardPoints || 0) + points;
      const newHistoryItem: PointHistoryItem = {
        id: `ph-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: sourceTitle,
        points,
        type: 'earned',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        orderNumber,
      };
      const updatedHistory = [newHistoryItem, ...(prev.pointHistory || [])];
      const updated: UserProfile = {
        ...prev,
        rewardPoints: newPoints,
        pointHistory: updatedHistory,
      };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error adding reward points in localStorage', e);
      }

      setToastMessage({
        title: `+${points} Reward Points Earned! ⭐️`,
        subtitle: `Total balance: ${newPoints} pts`,
      });
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);

      return updated;
    });
  }, []);

  const redeemCouponWithPoints = useCallback((tier: CouponTier) => {
    if (!user) {
      return { success: false, message: 'Please sign in to redeem coupons.' };
    }

    const currentPoints = user.rewardPoints || 0;
    if (currentPoints < tier.pointsCost) {
      return {
        success: false,
        message: `Insufficient points! You need ${tier.pointsCost} pts (Current: ${currentPoints} pts).`,
      };
    }

    const now = new Date();
    // 30 days validity for redeemed reward vouchers
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCouponCode = `${tier.code}-${uniqueSuffix}`;

    const newCoupon: UserCoupon = {
      id: `coupon-${Date.now()}`,
      code: newCouponCode,
      title: tier.title,
      discountPercent: tier.discountPercent,
      createdAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      isUsed: false,
      pointsCost: tier.pointsCost,
    };

    const newHistoryItem: PointHistoryItem = {
      id: `ph-redeem-${Date.now()}`,
      title: `Redeemed ${tier.title} (${tier.code})`,
      points: -tier.pointsCost,
      type: 'redeemed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const updatedUser: UserProfile = {
      ...user,
      rewardPoints: currentPoints - tier.pointsCost,
      pointHistory: [newHistoryItem, ...(user.pointHistory || [])],
      coupons: [newCoupon, ...(user.coupons || [])],
    };

    setUser(updatedUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Error redeeming coupon in localStorage', e);
    }

    setToastMessage({
      title: `Coupon Redeemed! 🎁 ${newCoupon.code}`,
      subtitle: `${tier.discountPercent}% OFF coupon added to your account!`,
    });
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);

    return {
      success: true,
      message: `Successfully exchanged ${tier.pointsCost} points for ${tier.title}!`,
      coupon: newCoupon,
    };
  }, [user]);

  const resetPoints = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated: UserProfile = {
        ...prev,
        rewardPoints: 0,
        pointHistory: [],
      };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error resetting points in localStorage', e);
      }
      return updated;
    });
  }, []);

  const markCouponUsed = useCallback((code: string) => {
    setUser((prev) => {
      if (!prev || !prev.coupons) return prev;
      const cleanCode = code.trim().toUpperCase();
      const updatedCoupons = prev.coupons.map((c) =>
        c.code.toUpperCase() === cleanCode || (cleanCode.startsWith(c.code.toUpperCase()) && c.code !== 'WELCOME10')
          ? { ...c, isUsed: true }
          : c
      );
      const updated = { ...prev, coupons: updatedCoupons };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error marking coupon used in localStorage', e);
      }
      return updated;
    });
  }, []);

  const getNewUserCouponStatus = useCallback(() => {
    if (!user || !user.coupons || user.coupons.length === 0) {
      return {
        coupon: null,
        isValid: false,
        isExpired: false,
        isUsed: false,
        remainingDays: 0,
        remainingHours: 0,
        remainingText: 'No coupon available',
      };
    }

    const coupon = user.coupons.find((c) => c.code === 'WELCOME10') || user.coupons[0];
    if (!coupon) {
      return {
        coupon: null,
        isValid: false,
        isExpired: false,
        isUsed: false,
        remainingDays: 0,
        remainingHours: 0,
        remainingText: 'No coupon',
      };
    }

    const now = new Date().getTime();
    const expiryTime = new Date(coupon.expiresAt).getTime();
    const diffMs = expiryTime - now;
    const isExpired = diffMs <= 0;
    const isUsed = coupon.isUsed;
    const isValid = !isExpired && !isUsed;

    const remainingTotalHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    const remainingDays = Math.floor(remainingTotalHours / 24);
    const remainingHours = remainingTotalHours % 24;

    let remainingText = '';
    if (isUsed) {
      remainingText = 'Already Redeemed';
    } else if (isExpired) {
      remainingText = 'Expired (After 3 Days)';
    } else if (remainingDays > 0) {
      remainingText = `${remainingDays}d ${remainingHours}h remaining`;
    } else {
      remainingText = `${remainingHours}h remaining`;
    }

    return {
      coupon,
      isValid,
      isExpired,
      isUsed,
      remainingDays,
      remainingHours,
      remainingText,
    };
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Error removing auth from localStorage', e);
    }
  }, []);

  const openLoginModal = useCallback((message?: string, onSuccessCallback?: () => void) => {
    setLoginPromptMessage(message || 'Please log in to your account.');
    if (onSuccessCallback) {
      setPendingCallback(() => onSuccessCallback);
    } else {
      setPendingCallback(null);
    }
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setPendingCallback(null);
  }, []);

  const requireAuth = useCallback(
    (action: () => void, message?: string): boolean => {
      if (isLoggedIn) {
        action();
        return true;
      } else {
        openLoginModal(
          message || 'Please log in first to order menu items and proceed to checkout.',
          action
        );
        return false;
      }
    },
    [isLoggedIn, openLoginModal]
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        isLoginModalOpen,
        loginPromptMessage,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        updateUserProfile,
        markCouponUsed,
        addRewardPoints,
        redeemCouponWithPoints,
        resetPoints,
        getNewUserCouponStatus,
        requireAuth,
      }}
    >
      {children}

      {/* Global Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 animate-slideUp">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Gift size={18} className="text-amber-200" />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">{toastMessage.title}</div>
            <div className="text-[11px] text-emerald-200">{toastMessage.subtitle}</div>
          </div>
        </div>
      )}

      {/* High-End Login & Registration Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        promptMessage={loginPromptMessage}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
