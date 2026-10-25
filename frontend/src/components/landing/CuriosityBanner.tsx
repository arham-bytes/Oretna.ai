'use client';

import React from 'react';
import Link from 'next/link';

export default function CuriosityBanner() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Outer Botanical Deckled Frame */}
        <div
          className="rounded-xl p-4 sm:p-6 md:p-8 shadow-none"
          style={{
            backgroundImage: 'url(/images/frame-callout.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Inner Cream Card */}
          <div className="w-full bg-[#FAF8F5] rounded-lg px-6 py-12 sm:px-12 sm:py-16 md:py-20 text-center border border-[#EDE8E0]/70 shadow-none">
            <h3 className="font-serif text-[36px] sm:text-5xl lg:text-[58px] font-normal leading-[1.1] text-[#1E1E1E]">
              Curiosity has no syllabus.
            </h3>

            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-[#555558] max-w-xl mx-auto leading-relaxed font-normal">
              Research a question. Explore an unfamiliar subject. Find the right sources. Share an idea worth discussing.
            </p>

            <p className="mt-4 text-base sm:text-lg text-[#1E1E1E] font-bold">
              Whatever you&apos;re curious about, start there.
            </p>

            <div className="mt-7 sm:mt-8">
              <Link
                href="/workspace"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-[15px] font-medium bg-[#242426] text-white hover:bg-[#151516] transition-all shadow-sm active:scale-95"
              >
                Discover Oretna
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
