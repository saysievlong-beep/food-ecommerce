'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Sparkles,
  X,
  User,
  Lock,
  Mail,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  UtensilsCrossed,
  KeyRound,
} from 'lucide-react';

export type UserProfile = {
  name: string;
  email: string;
  role?: string;
  avatar?: string;
};

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  isLoginModalOpen: boolean;
  loginPromptMessage: string;
  openLoginModal: (message?: string, onSuccessCallback?: () => void) => void;
  closeLoginModal: () => void;
  login: (email?: string, name?: string) => void;
  logout: () => void;
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

  // Form states for the modal
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      console.error('Error loading auth from localStorage', e);
    }
  }, []);

  const login = useCallback(
    (customEmail?: string, customName?: string) => {
      const authUser: UserProfile = {
        name: customName || (customEmail ? customEmail.split('@')[0] : 'Alex Vance'),
        email: customEmail || 'alex.vance@example.com',
        role: 'Gold Member',
      };
      setUser(authUser);
      setIsLoggedIn(true);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      } catch (e) {
        console.error('Error saving auth to localStorage', e);
      }

      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      // Execute pending action if any
      if (pendingCallback) {
        const cb = pendingCallback;
        setPendingCallback(null);
        setTimeout(() => {
          cb();
        }, 100);
      }

      setIsLoginModalOpen(false);
      setEmail('');
      setPassword('');
      setName('');
      setFormError('');
    },
    [pendingCallback]
  );

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
    setFormError('');
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setPendingCallback(null);
    setFormError('');
  }, []);

  // requireAuth: if logged in, executes action and returns true. If not logged in, opens login modal with message and queues action.
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setFormError('Password must be at least 4 characters.');
      return;
    }
    login(email, isSignUpMode && name.trim() ? name.trim() : undefined);
  };

  const handleQuickDemoLogin = () => {
    login('alex.vance@example.com', 'Alex Vance');
  };

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
        requireAuth,
      }}
    >
      {children}

      {/* Global Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/30 animate-slideUp">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="text-xs font-bold leading-tight">Signed in successfully!</div>
            <div className="text-[11px] text-emerald-200">
              Welcome back, {user?.name || 'Valued Member'}
            </div>
          </div>
        </div>
      )}

      {/* Unified High-End Login Modal */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm transition-all duration-300"
          onClick={closeLoginModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 transition-all duration-300 transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Brand Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 relative">
              <button
                type="button"
                onClick={closeLoginModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles size={14} className="text-amber-300 animate-pulse" />
                <span>TastyByte Ordering System</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isSignUpMode ? 'Create Your Account' : 'Welcome Back'}
              </h2>

              <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed">
                {loginPromptMessage ||
                  (isSignUpMode
                    ? 'Join TastyByte to order fresh meals, earn reward points, and track deliveries.'
                    : 'Sign in to order food, save favorites, and access exclusive member discounts.')}
              </p>

              {/* Order Requirement Alert Pill */}
              {loginPromptMessage && (
                <div className="mt-3.5 flex items-center gap-2 bg-amber-400/20 border border-amber-300/40 text-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold">
                  <UtensilsCrossed size={14} className="text-amber-300 shrink-0" />
                  <span>Login required to order from menu</span>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-4">
              {/* Quick 1-Click Demo Login Button for convenient testing */}
              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <KeyRound size={13} className="text-emerald-600" />
                    <span>Instant Demo Access</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                    1-Click
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <User size={14} />
                  <span>Continue as Alex Vance (Demo)</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-gray-400 uppercase">
                  or sign in with credentials
                </span>
              </div>

              {/* Sign In / Sign Up Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                {isSignUpMode && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormError('');
                      }}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Password
                    </label>
                    {!isSignUpMode && (
                      <span className="text-[11px] text-emerald-700 font-medium hover:underline cursor-pointer">
                        Forgot password?
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFormError('');
                      }}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                {formError && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl font-medium">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSignUpMode ? 'Create Account & Order' : 'Sign In & Continue'}</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Toggle Sign in / Sign up */}
              <div className="pt-2 text-center text-xs text-gray-500 border-t border-gray-100 flex items-center justify-center gap-1.5">
                <span>
                  {isSignUpMode
                    ? 'Already have an account?'
                    : "Don't have an account yet?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUpMode(!isSignUpMode);
                    setFormError('');
                  }}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  {isSignUpMode ? 'Sign In' : 'Create Free Account'}
                </button>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 text-center pt-1">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Secure SSL encrypted connection</span>
              </div>
            </div>
          </div>
        </div>
      )}
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
