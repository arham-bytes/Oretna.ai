'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import UnderstandingSection from '@/components/landing/UnderstandingSection';
import DeepResearchSection from '@/components/landing/DeepResearchSection';
import CuriosityBanner from '@/components/landing/CuriosityBanner';
import FaqSection from '@/components/landing/FaqSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1E1E1E] flex flex-col selection:bg-[#DDF2FD] selection:text-[#18181B]">
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Hero Section: Headline, CTA, Floating Search Capsule & Nature Landscape */}
      <HeroSection />

      {/* 3. Section: "Beyond answers. Into understanding" with 3 Nature-framed Cards */}
      <UnderstandingSection />

      {/* 4. Section: "One question. A world of possibilities." & Deep Research feature */}
      <DeepResearchSection />

      {/* 5. Section: "Curiosity has no syllabus." Callout Banner */}
      <CuriosityBanner />

      {/* 6. Section: Frequently Asked Questions Accordion */}
      <FaqSection />

      {/* 7. Exact Footer Section with 3 tiers and spectrum ribbon */}
      <Footer />
    </main>
  );
}
