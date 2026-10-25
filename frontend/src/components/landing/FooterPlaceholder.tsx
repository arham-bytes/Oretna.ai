'use client';

import React from 'react';
import Link from 'next/link';
import KaetleLogo from '@/components/KaetleLogo';

export default function FooterPlaceholder() {
  return (
    <footer className="w-full bg-[#FAF8F5] border-t border-[#EAE4DC] pt-14 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo & Slogan */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <KaetleLogo size={24} />
            <p className="text-xs text-[#71717A]">
              Evidence-grounded research &amp; discovery platform.
            </p>
          </div>

          {/* Quick links & workspace jump */}
          <div className="flex items-center gap-6 text-xs text-[#555558]">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <a href="#product" className="hover:text-black transition-colors">
              Product
            </a>
            <a href="#pricing" className="hover:text-black transition-colors">
              Pricing
            </a>
            <Link href="/workspace" className="hover:text-black transition-colors font-medium">
              Open Workspace
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#EFEBE4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8E8E93]">
          <div>&copy; {new Date().getFullYear()} Oretna. All rights reserved.</div>
          <div className="text-[11px] text-[#A1A1AA] italic">
            Ready for your custom footer layout
          </div>
        </div>
      </div>
    </footer>
  );
}
