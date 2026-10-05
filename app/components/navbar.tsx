'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  LogIn,
  LogOut,
  ShoppingBag,
  Receipt,
  Heart,
  Settings,
  MapPin,
  Phone,
  CheckCircle2,
  ChevronDown,
  Gift,
} from 'lucide-react';
import PersonalInfoModal from './PersonalInfoModal';
import RewardCouponModal from './RewardCouponModal';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { isLoggedIn, user, openLoginModal, logout } = useAuth();
  const { orders, totalCartCount } = useOrders();
  const displayName = user?.name || 'Alex Vance';
  const displayEmail = user?.email || 'alex.vance@example.com';
  const displayPhone = user?.phone || '+855 12 345 678';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Food', href: '/Food' },
    { name: 'Blog', href: '/Blog' },
    { name: 'Contact', href: '/Contact' },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/80'
            : 'bg-white border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid layout ensuring logo, centered nav, and right user button */}
          <div className="grid grid-cols-2 md:grid-cols-3 h-16 items-center">

            {/* Logo (Left aligned) */}
            <div className="flex justify-start">
              <Link
                href="/"
                className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <span>TastyByte</span>
              </Link>
            </div>

            {/* Desktop Navigation (Centered with Active Dot) */}
            <div className="hidden md:flex justify-center space-x-8">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname?.toLowerCase().startsWith(link.href.toLowerCase()));

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative py-1 text-sm font-semibold transition-colors duration-200 flex flex-col items-center ${
                      isActive
                        ? 'text-emerald-600'
                        : 'text-gray-700 hover:text-emerald-600'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: User Profile / Login Button (Desktop) */}
            <div className="hidden md:flex justify-end items-center" ref={userMenuRef}>
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-gray-900 leading-none">
                        {displayName}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold leading-none mt-0.5">
                        ⭐ {user?.role || 'Gold Member'}
                      </div>
                    </div>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900">{displayName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{displayEmail}</p>
                        {displayPhone && (
                          <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                            <Phone size={11} />
                            <span>{displayPhone}</span>
                          </p>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsProfileModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left cursor-pointer"
                        >
                          <User size={14} className="text-emerald-600" />
                          <span>Personal Info &amp; Profile</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsRewardModalOpen(true);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-left cursor-pointer"
                        >
                          <span className="flex items-center gap-2.5">
                            <Gift size={14} className="text-amber-500" />
                            <span>Rewards &amp; Coupons</span>
                          </span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded-full font-black">
                            {user?.rewardPoints || 0} pts
                          </span>
                        </button>

                        <Link
                          href="/Orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <span className="flex items-center gap-2.5">
                            <Receipt size={14} className="text-emerald-600" />
                            <span>My Orders &amp; Bills</span>
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                            {orders.length}
                          </span>
                        </Link>

                        <Link
                          href="/Food"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <ShoppingBag size={14} className="text-emerald-600" />
                          <span>Food Menu &amp; Cart</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openLoginModal('Sign in to your TastyByte account to order food.')}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                  aria-label="User Login"
                >
                  <User size={15} />
                  <span>Login / Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Actions (User & Hamburger) */}
            <div className="md:hidden flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (isLoggedIn) {
                    setIsProfileModalOpen(true);
                  } else {
                    openLoginModal('Sign in to your TastyByte account to order food.');
                  }
                }}
                className="p-2 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                aria-label="User Profile"
              >
                <User size={20} className={isLoggedIn ? 'text-emerald-600' : 'text-gray-700'} />
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="p-2 rounded-xl text-gray-700 hover:text-emerald-600 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.12 5.7a1 1 0 00-1.41 1.42L10.59 12l-4.88 4.88a1 1 0 101.41 1.42L12 13.41l4.88 4.89a1 1 0 001.42-1.42L13.41 12l4.89-4.88a1 1 0 000-1.41z" />
                  ) : (
                    <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 text-center shadow-lg">
            {/* User status in mobile drawer */}
            <div className="p-3 bg-emerald-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {isLoggedIn ? displayName.charAt(0).toUpperCase() : <User size={16} />}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">
                    {isLoggedIn ? displayName : 'Guest User'}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    {isLoggedIn ? `${user?.phone || user?.role || 'Personal Info'}` : 'Sign in to order food'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (isLoggedIn) {
                    setIsProfileModalOpen(true);
                  } else {
                    openLoginModal('Sign in to your TastyByte account to order food.');
                  }
                }}
                className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer"
              >
                {isLoggedIn ? 'Edit Profile' : 'Login'}
              </button>
            </div>

            {/* Mobile Rewards Shortcut */}
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsRewardModalOpen(true);
                }}
                className="w-full flex items-center justify-between p-2.5 bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80 rounded-xl text-xs font-bold text-gray-800 cursor-pointer shadow-2xs"
              >
                <span className="flex items-center gap-2 text-emerald-950">
                  <Gift size={15} className="text-amber-500" />
                  <span>Rewards &amp; Coupons Hub</span>
                </span>
                <span className="bg-amber-400 text-gray-950 text-[10.5px] font-black px-2 py-0.5 rounded-full">
                  {user?.rewardPoints || 0} pts
                </span>
              </button>
            )}

            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname?.toLowerCase().startsWith(link.href.toLowerCase()));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  )}
                </Link>
              );
            })}

            {/* Mobile Order Menu Shortcut */}
            <Link
              href="/Orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 text-white shadow-xs"
            >
              <span className="flex items-center gap-2">
                <Receipt size={16} />
                <span>My Order Menu &amp; Bills</span>
              </span>
              <span className="bg-amber-400 text-gray-950 text-xs px-2 py-0.5 rounded-full font-black">
                {totalCartCount > 0 ? `${totalCartCount} in cart` : `${orders.length} orders`}
              </span>
            </Link>
          </div>
        )}
      </nav>

      {/* Personal Info Edit Modal */}
      <PersonalInfoModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenRewardsAction={() => setIsRewardModalOpen(true)}
      />

      {/* Rewards & Coupons Hub Modal (Pure Rewards & Coupons data) */}
      <RewardCouponModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
      />
    </>
  );
}