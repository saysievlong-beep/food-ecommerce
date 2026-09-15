'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  LogIn,
  LogOut,
  ShoppingBag,
  Heart,
  Settings,
  MapPin,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { isLoggedIn, user, openLoginModal, logout } = useAuth();
  const displayName = user?.name || 'Alex Vance';
  const displayEmail = user?.email || 'alex.vance@example.com';

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

            {/* Right: User / Login Button (Desktop) */}
            <div className="hidden md:flex justify-end items-center" ref={userMenuRef}>
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 transition-all cursor-pointer shadow-2xs"
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
                    <ChevronDown size={14} className="text-emerald-600" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900">{displayName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{displayEmail}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/Food"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <ShoppingBag size={14} className="text-emerald-600" />
                          <span>My Orders &amp; Cart</span>
                        </Link>
                        <Link
                          href="/Food"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <Heart size={14} className="text-rose-500" />
                          <span>Saved Favorites</span>
                        </Link>
                        <Link
                          href="/Contact"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          <MapPin size={14} className="text-amber-500" />
                          <span>Delivery Addresses</span>
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
                    logout();
                  } else {
                    openLoginModal('Sign in to your TastyByte account to order food.');
                  }
                }}
                className="p-2 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                aria-label="User Login"
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
                    {isLoggedIn ? `⭐ ${user?.role || 'Gold Member'}` : 'Sign in to order food'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (isLoggedIn) {
                    logout();
                  } else {
                    openLoginModal('Sign in to your TastyByte account to order food.');
                  }
                }}
                className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer"
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </div>

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
          </div>
        )}
      </nav>
    </>
  );
}