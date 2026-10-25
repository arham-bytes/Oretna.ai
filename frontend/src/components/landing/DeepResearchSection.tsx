'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FeatureItemData {
  id: string;
  numberTag: string;
  shortTitle: string;
  headline: string;
  description: string;
  boldEmphasis: string;
  frameBg: string;
  href: string;
  ctaText: string;
}

const FEATURES: FeatureItemData[] = [
  {
    id: 'feature-deep-research',
    numberTag: '01 / DEEP RESEARCH',
    shortTitle: 'Deep Research',
    headline: 'Your topic in. Relevant research out.',
    description:
      'Turn a research question into a starting point for serious investigation. Enter a topic, and Oretna helps you discover relevant research papers, articles and sources to explore further.',
    boldEmphasis:
      "Whether you're writing an academic paper, developing an article or investigating an unfamiliar subject, find the material you need to get started.",
    frameBg: '/images/frame-card-deep-research.png',
    href: '/workspace?q=Why+do+countries+become+poor',
    ctaText: 'Explore Deep Research',
  },
  {
    id: 'feature-knowledge-exploration',
    numberTag: '02 / KNOWLEDGE EXPLORATION',
    shortTitle: 'Knowledge Exploration',
    headline: 'From the basics to the rabbit hole.',
    description:
      'Enter any subject, no matter how broad, technical or unconventional. Oretna helps you discover books and learning resources across different levels, from beginner introductions to advanced material.',
    boldEmphasis:
      "Whether it's quantum mechanics, biochemistry, cancer biology, economics or even conspiracy theories, find a path into the subject and explore how far it goes.",
    frameBg: '/images/frame-card-knowledge-exploration.png',
    href: '/workspace?q=Knowledge+exploration',
    ctaText: 'Explore Knowledge Paths',
  },
  {
    id: 'feature-citation-workspace',
    numberTag: '03 / ACADEMIC WRITING',
    shortTitle: 'Citation Workspace',
    headline: 'Citations, without the busywork.',
    description:
      'Working on a paper, thesis or article? Upload a PDF or provide your source details, and let Oretna help you generate properly formatted citations and references.',
    boldEmphasis:
      'Spend less time formatting bibliographies and more time developing the ideas behind your work.',
    frameBg: '/images/frame-card-citation-workspace.png',
    href: '/workspace?tab=citations',
    ctaText: 'Open Citation Workspace',
  },
  {
    id: 'feature-community',
    numberTag: '04 / COMMUNITY',
    shortTitle: 'Community',
    headline: 'A feed for ideas, not just updates.',
    description:
      "Share what you're learning, publish your discoveries, ask questions and join conversations that go beyond the obvious.",
    boldEmphasis:
      'Think the spontaneity of Twitter meets the depth of Substack a space where a short observation can become a meaningful discussion, and a long-form idea can find its audience.',
    frameBg: '/images/frame-card-community.png',
    href: '/workspace?tab=community',
    ctaText: 'Join the Community',
  },
];

// Crisp Code UI: Card 1 (Deep Research)
function DeepResearchCardUI() {
  const items = [
    {
      tag: '01 / INSTITUTIONS',
      title: 'Institutions and economic growth',
      desc: 'How governance, property rights and political institutions influence long-term prosperity.',
    },
    {
      tag: '02 / DEVELOPMENT',
      title: 'Trade, geography & development',
      desc: 'Explore how geography, trade access and historical conditions shape economic outcomes.',
    },
    {
      tag: '03 / EDUCATION & HUMAN CAPITAL',
      title: 'Education and long-term prosperity',
      desc: 'Understand how access to education, skill development and healthcare influence productivity and economic growth.',
    },
    {
      tag: '04 / TECHNOLOGY & INNOVATION',
      title: 'The role of innovation in economic growth',
      desc: 'Explore how technological progress, innovation and industrial development shape the prosperity of nations.',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between text-left select-none">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#1E1E1E]"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <h4 className="text-[16px] sm:text-[17px] font-bold text-[#1E1E1E] tracking-tight">
            Deep Research
          </h4>
        </div>
        <div className="h-[1px] w-full bg-[#EAE4DC] mt-2.5 mb-3" />

        {/* Search Question Box */}
        <div className="rounded-lg border border-[#E4DFD7] p-2.5 sm:p-3 bg-white mb-2.5">
          <div className="text-[9.5px] font-bold tracking-[0.08em] text-[#8E8E93] uppercase">
            YOUR RESEARCH QUESTION
          </div>
          <div className="text-[14px] sm:text-[15px] font-medium text-[#1E1E1E] mt-0.5">
            Why do countries become poor?
          </div>
        </div>

        {/* Discovered Subheading */}
        <div className="text-[12.5px] sm:text-[13px] font-bold text-[#1E1E1E] mb-2">
          Research discovered
        </div>
      </div>

      {/* Discovered Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.tag}
            className="rounded-lg border border-[#DCE8F8] p-2 sm:p-2.5 bg-[#F9FBFE] hover:border-[#1E1E1E]/40 transition-colors"
          >
            <div className="text-[9px] font-bold tracking-[0.06em] text-[#8E8E93] uppercase">
              {item.tag}
            </div>
            <div className="text-[12px] sm:text-[12.5px] font-semibold text-[#1E1E1E] mt-0.5">
              {item.title}
            </div>
            <div className="text-[10.5px] sm:text-[11px] text-[#555558] mt-0.5 leading-snug">
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Crisp Code UI: Card 2 (Knowledge Exploration)
function KnowledgeExplorationCardUI() {
  const items = [
    {
      tag: '01 / INSTITUTIONS',
      title: 'Institutions and economic growth',
      desc: 'How governance, property rights and political institutions influence long-term prosperity.',
    },
    {
      tag: '02 / DEVELOPMENT',
      title: 'Trade, geography & development',
      desc: 'Explore how geography, trade access and historical conditions shape economic outcomes.',
    },
    {
      tag: '03 / EDUCATION & HUMAN CAPITAL',
      title: 'Education and long-term prosperity',
      desc: 'Understand how access to education, skill development and healthcare influence productivity and economic growth.',
    },
    {
      tag: '04 / TECHNOLOGY & INNOVATION',
      title: 'The role of innovation in economic growth',
      desc: 'Explore how technological progress, innovation and industrial development shape the prosperity of nations.',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between text-left select-none">
      <div>
        <div className="flex items-center gap-2">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#1E1E1E]"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <h4 className="text-[16px] sm:text-[17px] font-bold text-[#1E1E1E] tracking-tight">
            Deep Research
          </h4>
        </div>
        <div className="h-[1px] w-full bg-[#EAE4DC] mt-2.5 mb-3" />

        <div className="rounded-lg border border-[#E4DFD7] p-2.5 sm:p-3 bg-white mb-2.5">
          <div className="text-[9.5px] font-bold tracking-[0.08em] text-[#8E8E93] uppercase">
            YOUR RESEARCH QUESTION
          </div>
          <div className="text-[14px] sm:text-[15px] font-medium text-[#1E1E1E] mt-0.5">
            Why do countries become poor?
          </div>
        </div>

        <div className="text-[12.5px] sm:text-[13px] font-bold text-[#1E1E1E] mb-2">
          Research discovered
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.tag}
            className="rounded-lg border border-[#DCE8F8] p-2 sm:p-2.5 bg-[#F9FBFE] hover:border-[#1E1E1E]/40 transition-colors"
          >
            <div className="text-[9px] font-bold tracking-[0.06em] text-[#8E8E93] uppercase">
              {item.tag}
            </div>
            <div className="text-[12px] sm:text-[12.5px] font-semibold text-[#1E1E1E] mt-0.5">
              {item.title}
            </div>
            <div className="text-[10.5px] sm:text-[11px] text-[#555558] mt-0.5 leading-snug">
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Crisp Code UI: Card 3 (Citation Workspace)
function CitationWorkspaceCardUI() {
  return (
    <div className="w-full h-full flex flex-col justify-between text-left select-none">
      <div>
        <div className="flex items-center gap-2">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#1E1E1E]"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <h4 className="text-[16px] sm:text-[17px] font-bold text-[#1E1E1E] tracking-tight">
            Citation workspace
          </h4>
        </div>
        <div className="h-[1px] w-full bg-[#EAE4DC] mt-2.5 mb-2.5" />

        {/* Action Buttons: Add source & Upload PDF */}
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <div className="border border-[#E4DFD7] rounded-lg p-2 text-center bg-white flex items-center justify-center gap-1.5 shadow-2xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="text-[#1E1E1E]"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="text-[11px] font-bold text-[#1E1E1E]">Add source</span>
          </div>

          <div className="border border-[#E4DFD7] rounded-lg p-2 text-center bg-white flex items-center justify-center gap-1.5 shadow-2xs">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="text-[#1E1E1E]"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-[11px] font-bold text-[#1E1E1E]">Upload PDF</span>
          </div>
        </div>

        {/* Source Details Box */}
        <div className="rounded-lg border border-[#E4DFD7] p-2.5 bg-white mb-2.5 space-y-1">
          <div className="text-[9px] font-bold tracking-[0.08em] text-[#8E8E93] uppercase">
            SOURCE DETAILS
          </div>
          <div className="text-[11.5px] text-[#1E1E1E]">
            <span className="text-[#8E8E93]">Title:</span> Thinking, Fast and Slow
          </div>
          <div className="h-[1px] w-full bg-[#F0EDE8]" />
          <div className="text-[11.5px] text-[#1E1E1E]">
            <span className="text-[#8E8E93]">Author:</span> Daniel Kahneman
          </div>
          <div className="h-[1px] w-full bg-[#F0EDE8]" />
          <div className="text-[11.5px] text-[#1E1E1E]">
            <span className="text-[#8E8E93]">Publication year:</span> 2011
          </div>
        </div>

        {/* Citation Style */}
        <div className="text-[12px] font-semibold text-[#1E1E1E] mb-2">
          Citation style: APA 7th Edition
        </div>
      </div>

      <div className="space-y-2">
        {/* Generated Citation Box */}
        <div className="rounded-lg border border-[#DCE8F8] bg-[#F7FAFE] p-2.5">
          <div className="text-[10.5px] font-semibold text-[#1E1E1E] underline underline-offset-2 mb-0.5">
            Generated citation
          </div>
          <div className="text-[11px] text-[#555558] leading-relaxed">
            Kahneman, D. (2011). Thinking, fast and slow. Farrar, Straus and Giroux.
          </div>
        </div>

        {/* Reference List Box */}
        <div className="rounded-lg border border-[#DCE8F8] bg-[#F7FAFE] p-2.5">
          <div className="text-[9px] font-bold tracking-[0.08em] text-[#8E8E93] uppercase mb-0.5">
            REFERENCE LIST
          </div>
          <div className="text-[11px] text-[#1E1E1E] leading-relaxed">
            1. Kahneman, D. (2011). Thinking, fast and slow. Farrar, Straus and Giroux.
          </div>
          <div className="text-[10px] text-[#8E8E93] italic mt-0.5">
            2. Add another source to build your bibliography.
          </div>
        </div>
      </div>
    </div>
  );
}

// Crisp Code UI: Card 4 (Community)
function CommunityCardUI() {
  const posts = [
    {
      author: 'Adam',
      meta: 'Research notes · 2 hrs ago',
      title: "What if economic growth isn't the whole story?",
      desc: "GDP tells us how much an economy produces, but what does it reveal about people's actual well-being? I've been exploring alternative ways to measure progress.",
      comments: '12 discussions',
    },
    {
      author: 'Rosie',
      meta: 'Research notes · 30 mins ago',
      title: 'The ideas hiding between disciplines',
      desc: 'Some of the most interesting discoveries happen where two different fields meet.',
      comments: 'Join the discussion',
    },
    {
      author: 'Jennie',
      meta: 'Research notes · 6 hrs ago',
      title: 'Can cities make people happier?',
      desc: 'Exploring the connection between urban design, public spaces, mental well-being, and how communities thrive.',
      comments: '22 discussions',
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between text-left select-none">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#1E1E1E]"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <h4 className="text-[16px] sm:text-[17px] font-bold text-[#1E1E1E] tracking-tight">
            Community
          </h4>
        </div>
        <div className="h-[1px] w-full bg-[#EAE4DC] mt-2.5 mb-2.5" />

        {/* Share an idea Box */}
        <div className="rounded-lg border border-[#E4DFD7] p-2.5 bg-white mb-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-4 h-4 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center text-[9px] font-bold">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-[11.5px] font-medium text-[#1E1E1E]">Share an idea</span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-[#F0EDE8] pt-1.5">
            <span className="text-[10.5px] sm:text-[11px] text-[#8E8E93]">
              What have you been exploring lately?
            </span>
            <span className="px-2.5 py-0.5 bg-[#242426] text-white rounded text-[10px] font-medium shrink-0">
              Create Post
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="px-2.5 py-0.5 rounded-sm bg-[#242426] text-white text-[10px] font-medium">
            For You
          </span>
          <span className="px-2.5 py-0.5 rounded-sm bg-[#242426] text-white text-[10px] font-medium">
            Following
          </span>
          <span className="px-2.5 py-0.5 rounded-sm bg-[#242426] text-white text-[10px] font-medium">
            Trending
          </span>
        </div>
      </div>

      {/* 3 Discussion Posts */}
      <div className="space-y-1.5">
        {posts.map((post) => (
          <div
            key={post.title}
            className="rounded-lg border border-[#DCE8F8] bg-[#F9FBFE] p-2 hover:border-[#1E1E1E]/40 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center text-[7.5px] font-bold">
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="text-[10.5px] font-bold text-[#1E1E1E]">
                {post.author}{' '}
                <span className="font-normal text-[#8E8E93] text-[9.5px]">
                  · {post.meta}
                </span>
              </div>
            </div>
            <div className="text-[11.5px] font-bold text-[#1E1E1E] leading-snug">
              {post.title}
            </div>
            <div className="text-[10px] text-[#555558] mt-0.5 leading-snug">
              {post.desc}
            </div>
            <div className="flex items-center gap-1 text-[9.5px] text-[#8E8E93] mt-1 pt-1 border-t border-[#EAE4DC]/50 font-medium">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{post.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DeepResearchSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const showcaseContainerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const lastWheelTime = useRef<number>(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Wheel listener: switches features on scroll inside showcase, allows normal scroll outside
  useEffect(() => {
    const container = showcaseContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      const currentIdx = activeIndexRef.current;

      // Throttle wheel switches to 650ms to allow each transition to complete smoothly
      if (now - lastWheelTime.current < 650) {
        if (
          (e.deltaY > 20 && currentIdx < FEATURES.length - 1) ||
          (e.deltaY < -20 && currentIdx > 0)
        ) {
          e.preventDefault();
        }
        return;
      }

      if (e.deltaY > 25) {
        // Scrolling down: go to next feature if available
        if (currentIdx < FEATURES.length - 1) {
          e.preventDefault();
          lastWheelTime.current = now;
          setActiveIndex(currentIdx + 1);
          setUserHasInteracted(true);
        }
        // At the last feature, normal page scroll down continues without hijacking
      } else if (e.deltaY < -25) {
        // Scrolling up: go to previous feature if available
        if (currentIdx > 0) {
          e.preventDefault();
          lastWheelTime.current = now;
          setActiveIndex(currentIdx - 1);
          setUserHasInteracted(true);
        }
        // At the first feature, normal page scroll up continues without hijacking
      }
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Mobile horizontal swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        setActiveIndex((prev) => (prev + 1) % FEATURES.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
      }
      setUserHasInteracted(true);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation for indicators (Arrow keys, Home, End)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
      setUserHasInteracted(true);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
      setUserHasInteracted(true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
      setUserHasInteracted(true);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(FEATURES.length - 1);
      setUserHasInteracted(true);
    }
  };

  // Optional slow rotation (paused on hover or user interaction)
  useEffect(() => {
    if (isHovered || userHasInteracted) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isHovered, userHasInteracted]);

  return (
    <section
      ref={showcaseContainerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="py-16 md:py-24 bg-[#FEFAF6] border-t border-[#F2ECE3] relative select-text"
      aria-label="4-in-1 Feature Showcase"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading: Preserves editorial serif layout */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="font-serif text-[38px] sm:text-5xl lg:text-[54px] font-normal leading-[1.12] text-[#1E1E1E]">
            One question. A world of
            <br />
            possibilities.
          </h2>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#555558] max-w-xl mx-auto leading-relaxed font-normal">
            Five ways to take an idea further, all within one connected space.
          </p>

          {/* Compact Feature Indicators Navigation Row */}
          <div className="mt-8 flex justify-center">
            <div
              role="tablist"
              aria-label="Oretna Features"
              onKeyDown={handleKeyDown}
              className="inline-flex items-center gap-1 sm:gap-2 p-1.5 bg-[#F2ECE3]/80 backdrop-blur-sm rounded-full border border-[#E7DFD4] shadow-xs"
            >
              {FEATURES.map((feature, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={feature.id}
                    role="tab"
                    id={`feature-tab-${idx}`}
                    aria-selected={isActive}
                    aria-controls={`feature-panel-${idx}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => {
                      setActiveIndex(idx);
                      setUserHasInteracted(true);
                    }}
                    onMouseEnter={() => {
                      setActiveIndex(idx);
                      setUserHasInteracted(true);
                    }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E1E1E] ${
                      isActive
                        ? 'bg-[#1E1E1E] text-white shadow-xs font-semibold'
                        : 'text-[#666668] hover:text-[#1E1E1E] hover:bg-[#EAE4D9]/60'
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-mono tracking-wider transition-colors ${
                        isActive ? 'text-[#D0C8B8]' : 'text-[#8E8E93]'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <span className="whitespace-nowrap">{feature.shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4-in-1 Interactive Core Area: 1 Fixed Preview Frame + 1 Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* Left Column: Fixed Content Area with zero-layout-shift grid stacking */}
          <div className="lg:col-span-5 grid grid-cols-1 grid-rows-1">
            {FEATURES.map((feature, idx) => {
              const isCurrent = activeIndex === idx;
              return (
                <div
                  key={feature.id}
                  id={`feature-content-${idx}`}
                  aria-hidden={!isCurrent}
                  className={`col-start-1 row-start-1 space-y-6 transition-all duration-500 ease-out ${
                    isCurrent
                      ? 'opacity-100 translate-y-0 z-10 pointer-events-auto'
                      : 'opacity-0 translate-y-3 z-0 pointer-events-none motion-reduce:opacity-0 motion-reduce:translate-y-0'
                  }`}
                >
                  {/* Category Number Tag */}
                  <div className="text-[12px] sm:text-[13px] font-bold tracking-[0.08em] text-[#666668] uppercase">
                    {feature.numberTag}
                  </div>

                  {/* Headline in Serif Typography */}
                  <h3 className="font-serif text-[34px] sm:text-[40px] lg:text-[44px] font-normal leading-[1.14] text-[#1E1E1E]">
                    {feature.headline}
                  </h3>

                  {/* Description Paragraph */}
                  <p className="text-[15px] sm:text-[16px] text-[#555558] leading-relaxed font-normal">
                    {feature.description}
                  </p>

                  {/* Bold Emphasis Paragraph */}
                  <p className="text-[15px] sm:text-[16px] text-[#1E1E1E] font-semibold leading-relaxed">
                    {feature.boldEmphasis}
                  </p>

                  {/* Contextual Workspace CTA */}
                  <div className="pt-2">
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#1E1E1E] hover:text-[#555558] transition-colors group"
                    >
                      <span>{feature.ctaText}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Fixed UI Preview Frame with Pure Vector Code UI */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[510px] aspect-square rounded-2xl overflow-hidden bg-transparent">
              {FEATURES.map((feature, idx) => {
                const isCurrent = activeIndex === idx;
                return (
                  <div
                    key={feature.id}
                    id={`feature-panel-${idx}`}
                    role="tabpanel"
                    aria-labelledby={`feature-tab-${idx}`}
                    aria-hidden={!isCurrent}
                    className={`absolute inset-0 transition-all duration-500 ease-out ${
                      isCurrent
                        ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                        : 'opacity-0 scale-[0.98] z-0 pointer-events-none motion-reduce:opacity-0 motion-reduce:scale-100'
                    }`}
                  >
                    {/* The Botanical Deckled Edge Frame as Background */}
                    <div
                      className="relative w-full h-full p-4 sm:p-5 flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${feature.frameBg})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* The 100% Pure Vector HTML/CSS UI inside the card */}
                      <div className="w-full h-full bg-white rounded-md p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xs">
                        {idx === 0 && <DeepResearchCardUI />}
                        {idx === 1 && <KnowledgeExplorationCardUI />}
                        {idx === 2 && <CitationWorkspaceCardUI />}
                        {idx === 3 && <CommunityCardUI />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle Progress Bar & Quick Stepper Controls */}
            <div className="flex items-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  setActiveIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
                  setUserHasInteracted(true);
                }}
                aria-label="Previous feature"
                className="w-7 h-7 rounded-full border border-[#E7DFD4] bg-white flex items-center justify-center text-[#555558] hover:text-[#1E1E1E] hover:border-[#1E1E1E] transition-all cursor-pointer text-xs"
              >
                ‹
              </button>

              <div className="flex items-center gap-1.5">
                {FEATURES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => {
                      setActiveIndex(dotIdx);
                      setUserHasInteracted(true);
                    }}
                    aria-label={`Go to feature ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === dotIdx
                        ? 'w-6 bg-[#1E1E1E]'
                        : 'w-1.5 bg-[#D7CFBF] hover:bg-[#A8A090]'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveIndex((prev) => (prev + 1) % FEATURES.length);
                  setUserHasInteracted(true);
                }}
                aria-label="Next feature"
                className="w-7 h-7 rounded-full border border-[#E7DFD4] bg-white flex items-center justify-center text-[#555558] hover:text-[#1E1E1E] hover:border-[#1E1E1E] transition-all cursor-pointer text-xs"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
