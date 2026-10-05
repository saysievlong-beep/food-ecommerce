'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptMessage?: string;
}

type ModalMode = 'login' | 'signup' | 'forgot';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();

  const [mode, setMode] = useState<ModalMode>('login');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus email input when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setResetSuccessMessage('');
      setIsLoading(false);
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'forgot') {
      if (!email || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setResetSuccessMessage(`Password reset link sent to ${email}`);
      }, 700);
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const displayName = mode === 'signup' && name.trim() ? name.trim() : email.split('@')[0];
      const userPhone = phone.trim() || '+855 12 345 678';
      const isNewAccount = mode === 'signup';
      login(email, displayName, userPhone, undefined, isNewAccount);
      onClose();
    }, 600);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      login('google.user@example.com', 'Google User', '+855 98 765 432', undefined, false);
      onClose();
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      login('alex.vance@example.com', 'Alex Vance', '+855 12 888 999', undefined, false);
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-all duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-[420px] bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-gray-100 transition-all duration-300 transform scale-100 animate-modalPop relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button in top right corner */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Top Header */}
        <div className="mb-5">
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-tight">
            {mode === 'login' && 'Please enter your details'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
          </p>
          <h2 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1 tracking-tight text-center">
            {mode === 'login' && 'Tasty Byte'}
            {mode === 'signup' && 'Get started'}
            {mode === 'forgot' && 'Forgot password'}
          </h2>
        </div>

        {/* New user coupon benefit banner on sign up */}
        {mode === 'signup' && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Gift size={16} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-emerald-950">Free 10% OFF Welcome Coupon</p>
              <p className="text-[11px] text-emerald-700">Code: WELCOME10 • Valid for 3 days after sign up</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name in Sign up mode */}
          {mode === 'signup' && (
            <div>
              <label htmlFor="full-name" className="text-xs font-medium text-gray-700 mb-2">Full Name</label>
              <input
                id="full-name"
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
              />
            </div>
          )}

          {/* Email input */}
          <div>
            <label htmlFor="email" className="text-xs font-medium text-gray-700 mb-2">Email Address</label>
            <input
              ref={emailInputRef}
              id="email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
          </div>

          {/* Phone Number input */}
          {mode !== 'forgot' && (
            <div>
              <label htmlFor="telephone" className="text-xs font-medium text-gray-700 mb-2">Telephone Number</label>
              <input
                id="telephone"
                type="tel"
                required
                placeholder="E.g., 096 123 456"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
              />
            </div>
          )}

          {/* Password input */}
          {mode !== 'forgot' && (
            <div className="relative">
              <label htmlFor="password" className="text-xs font-medium text-gray-700 mb-2">Password</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full px-4 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2/3 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {/* Remember me & Forgot Password row */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs sm:text-[13px] pt-1 pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 font-normal">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setErrorMessage('');
                  setResetSuccessMessage('');
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline cursor-pointer"
              >
                Forgot password
              </button>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium animate-shake">
              <AlertCircle size={15} className="shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Reset link success */}
          {resetSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-800 font-medium">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">Success</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">{resetSuccessMessage}</p>
              </div>
            </div>
          )}

          {/* Primary Action Button (Sign in / Sign up) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>
                {mode === 'login' && 'Sign in'}
                {mode === 'signup' && 'Sign up & Get 10% OFF'}
                {mode === 'forgot' && 'Send reset link'}
              </span>
            )}
          </button>

          {/* Sign in with Google Button */}
          {mode !== 'forgot' && (
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 sm:py-3 bg-white hover:bg-gray-50/80 active:scale-98 border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-medium rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              {/* Official Google Icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}

          {/* Quick 1-Click Demo Login shortcut */}
          {mode === 'login' && (
            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound size={12} className="text-emerald-600" />
                <span>Quick 1-Click Demo (Alex Vance)</span>
              </button>
            </div>
          )}
        </form>

        {/* Bottom Switch Link */}
        <div className="mt-6 text-center text-xs sm:text-[13px] text-gray-500">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline cursor-pointer ml-1"
              >
                Sign up
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline cursor-pointer ml-1"
              >
                Log in
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setResetSuccessMessage('');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline cursor-pointer"
            >
              Back to log in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
