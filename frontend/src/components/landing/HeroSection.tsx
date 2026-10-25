'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/workspace?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/workspace');
    }
  };

  return (
    <section className="relative pt-10 sm:pt-14 md:pt-18 pb-0 overflow-hidden bg-[#FAF8F5]">
      {/* Hero Text Content */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-20">
        <h1 className="font-serif text-[42px] sm:text-5xl md:text-6xl lg:text-[68px] font-normal leading-[1.08] tracking-[-0.02em] text-[#1E1E1E]">
          Every question opens
          <br className="hidden sm:inline" />
          {' '}a world of ideas.
        </h1>

        <p className="mt-5 text-base sm:text-lg md:text-[18px] text-[#555558] max-w-xl mx-auto leading-relaxed font-normal">
          Explore the unfamiliar. Follow the evidence. Discover connections you never knew existed.
        </p>

        {/* Discover Button */}
        <div className="mt-6 sm:mt-7">
          <Link
            href="/workspace"
            className="inline-flex items-center justify-center px-7 py-3 rounded-xl text-[14.5px] font-medium bg-[#242426] text-white hover:bg-[#151516] transition-all shadow-sm active:scale-95"
          >
            Discover Oretna
          </Link>
        </div>
      </div>

      {/* Hero Search Box Card - Overlapping top of landscape */}
      <div className="relative z-30 max-w-[460px] sm:max-w-[500px] mx-auto px-4 -mb-10 sm:-mb-12">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl p-4 sm:p-4.5 shadow-[0_14px_36px_rgba(0,0,0,0.10)] border border-[#ECE8E1] flex flex-col justify-between min-h-[90px] sm:min-h-[98px] transition-shadow hover:shadow-[0_18px_42px_rgba(0,0,0,0.14)]"
        >
          {/* Top Row: Input field */}
          <div className="w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="How can I help you today?"
              className="w-full bg-transparent border-none outline-none text-[#1E1E1E] placeholder-[#8E8E93] text-[14px] sm:text-[15px] font-normal"
            />
          </div>

          {/* Bottom Row: + and -> Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => router.push('/workspace')}
              className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0 cursor-pointer"
              title="Add attachment or research query"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>

            <button
              type="submit"
              className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0 cursor-pointer"
              title="Start research inquiry"
            >
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>

      {/* Full-bleed Painted Foliage & River Landscape with Deckled Bottom Edge */}
      <div className="relative w-full overflow-hidden select-none">
        <div className="w-full relative">
          <Image
            src="/images/hero-landscape.jpg"
            alt="Impressionistic landscape with lush green foliage and winding turquoise river"
            width={1920}
            height={700}
            priority
            className="w-full h-auto min-h-[280px] max-h-[500px] object-cover object-bottom"
          />
        </div>
      </div>

      {/* Soft Transition to next section */}
      <div className="h-14 sm:h-20 bg-gradient-to-b from-[#FAF8F5] to-white" />
    </section>
  );
}
