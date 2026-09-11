'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Food', href: '/Food' },
    { name: 'Blog', href: '/Blog' },
    { name: 'Contact', href: '/Contact' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/80'
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Use grid to ensure perfect alignment and centering */}
        <div className="grid grid-cols-2 md:grid-cols-3 h-16 items-center">

          {/* Logo (Left aligned) */}
          <div className="flex justify-start">
            <Link href="/" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              TastyByte
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

          {/* Right Spacer / Desktop placeholder (Ensures true center) */}
          <div className="hidden md:block"></div>

          {/* Mobile Menu Button (Right aligned on small screens) */}
          <div className="md:hidden flex justify-end">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-700 hover:text-emerald-600 focus:outline-none"
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 text-center shadow-lg">
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
  );
}