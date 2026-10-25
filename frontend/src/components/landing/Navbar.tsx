'use client';

import React from 'react';
import Link from 'next/link';
import KaetleLogo from '@/components/KaetleLogo';

export default function Navbar() {
  return (
    <header className="w-full bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-50 transition-all border-b border-transparent">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center transition-transform hover:opacity-90">
          <KaetleLogo size={28} />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link
            href="/"
            className="text-[15px] font-medium text-[#1E1E1E] transition-colors hover:text-black"
          >
            Home
          </Link>
          <a
            href="#product"
            className="text-[15px] font-medium text-[#4A4A4D] transition-colors hover:text-[#1E1E1E]"
          >
            Product
          </a>
          <a
            href="#pricing"
            className="text-[15px] font-medium text-[#4A4A4D] transition-colors hover:text-[#1E1E1E]"
          >
            Pricing
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-[15px] font-medium text-[#1E1E1E] transition-colors hover:text-black hidden sm:inline-block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium bg-[#1E1E1E] text-white hover:bg-[#121212] transition-all shadow-sm active:scale-95"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
