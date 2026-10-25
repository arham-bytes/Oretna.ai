'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import KaetleLogo from '@/components/KaetleLogo';

export default function Footer() {
  return (
    <footer className="w-full bg-[#181819] text-white pt-16 sm:pt-20 pb-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Tier 1: Top Callout & Discover CTA */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-serif text-[34px] sm:text-4xl md:text-[44px] font-normal text-white leading-tight">
              A space for curious minds.
            </h2>
            <p className="text-[14.5px] sm:text-[15.5px] text-[#A1A1A5] leading-relaxed mt-3.5 font-normal max-w-lg">
              Explore ideas, discover knowledge, question assumptions, and follow your curiosity wherever it leads.
            </p>
          </div>

          <div className="md:pt-2">
            <Link
              href="/workspace"
              className="inline-flex items-center justify-center px-7 py-3 rounded-xl text-[14.5px] font-medium bg-[#FAF8F5] text-[#1E1E1E] hover:bg-white transition-all shadow-sm active:scale-95 shrink-0"
            >
              Discover Oretna
            </Link>
          </div>
        </div>

        {/* Hairline Divider 1 */}
        <div className="h-[1px] w-full bg-[#2C2C2E] mt-12 sm:mt-14 mb-10 sm:mb-12" />

        {/* Tier 2: Logo and Navigation Columns */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          {/* Logo on the left */}
          <div>
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <KaetleLogo variant="light" size={32} />
            </Link>
          </div>

          {/* Two Navigation Columns */}
          <div className="flex items-start gap-16 sm:gap-24">
            {/* Column 1: EXPLORE */}
            <div>
              <div className="text-[11px] font-bold tracking-[0.08em] text-[#8E8E93] uppercase mb-4">
                EXPLORE
              </div>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/workspace"
                    className="text-[13.5px] text-[#C4C4C8] hover:text-white transition-colors"
                  >
                    Deep research
                  </Link>
                </li>
                <li>
                  <Link
                    href="/workspace"
                    className="text-[13.5px] text-[#C4C4C8] hover:text-white transition-colors"
                  >
                    Explore any subject
                  </Link>
                </li>
                <li>
                  <Link
                    href="/workspace"
                    className="text-[13.5px] text-[#C4C4C8] hover:text-white transition-colors"
                  >
                    Citations &amp; References
                  </Link>
                </li>
                <li>
                  <Link
                    href="/workspace"
                    className="text-[13.5px] text-[#C4C4C8] hover:text-white transition-colors"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: DISCOVER */}
            <div>
              <div className="text-[11px] font-bold tracking-[0.08em] text-[#8E8E93] uppercase mb-4">
                DISCOVER
              </div>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#product"
                    className="text-[13.5px] text-[#C4C4C8] hover:text-white transition-colors"
                  >
                    About Oretna
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:contact@oretna.ai"
                    className="text-[13.5px] text-[#C4C4C8] hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hairline Divider 2 */}
        <div className="h-[1px] w-full bg-[#2C2C2E] mt-10 sm:mt-12 mb-8 sm:mb-9" />

        {/* Tier 3: Social Icons & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Social Icons */}
          <div className="flex items-center gap-5 text-[#C4C4C8]">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/oretna.ai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="4" />
                <path d="M8 11v5" />
                <path d="M8 8v.01" />
                <path d="M12 16v-5" />
                <path d="M16 16v-3a2 2 0 0 0-4 0" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>

          {/* Copyright text */}
          <div className="text-[13px] text-[#8E8E93] font-normal">
            &copy; 2026 Oretna. All rights reserved.
          </div>
        </div>

        {/* Artistic Glowing Spectrum Ribbon at Bottom */}
        <div className="mt-14 sm:mt-18 relative flex items-center justify-center">
          <div className="w-full max-w-5xl h-8 sm:h-10 md:h-12 relative flex items-center justify-center">
            {/* The painterly deckled watercolor spectrum ribbon */}
            <div
              className="w-full h-full mix-blend-screen opacity-95"
              style={{
                backgroundImage: 'url(/images/footer-ribbon.png)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'contrast(1.15) brightness(1.05)',
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
