'use client';

import React from 'react';

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  frameImage: string;
}

function FeatureCard({ number, title, description, frameImage }: FeatureCardProps) {
  return (
    <div
      className="relative rounded-sm p-3.5 shadow-none transition-all duration-300 hover:shadow-md group"
      style={{
        backgroundImage: `url(${frameImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Inner Cream Card Container */}
      <div className="bg-[#FCFAF7] rounded-[2px] p-5 sm:p-6 min-h-[320px] sm:min-h-[360px] flex flex-col justify-between border border-[#EDE8E0]/70">
        <div>
          {/* Header Title */}
          <div className="text-[12px] sm:text-[13px] font-bold tracking-[0.06em] text-[#262628] uppercase">
            {number} / {title}
          </div>

          {/* Hairline Divider */}
          <div className="h-[1px] w-full bg-[#E8E2D8] mt-3.5 mb-4" />

          {/* Description */}
          <p className="text-[13.5px] sm:text-[14.5px] text-[#4A4A4D] leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Ambient bottom room - gives the airy gallery aesthetic from the screenshot */}
        <div className="pt-8" />
      </div>
    </div>
  );
}

export default function UnderstandingSection() {
  const cards = [
    {
      number: '01',
      title: 'EXPLORE BEYOND THE OBVIOUS',
      description:
        'Go beyond the basics. Discover related concepts, unfamiliar subjects, and unexpected connections that take your curiosity further.',
      frameImage: '/images/frame-sky.jpg',
    },
    {
      number: '02',
      title: 'FOLLOW THE EVIDENCE',
      description:
        'Find relevant research, explore credible sources, and trace claims back to the evidence behind them.',
      frameImage: '/images/frame-garden.jpg',
    },
    {
      number: '03',
      title: 'CHALLENGE YOUR THINKING',
      description:
        'Question assumptions, consider different perspectives, and develop a deeper understanding of the ideas that matter to you.',
      frameImage: '/images/frame-sunset.jpg',
    },
  ];

  return (
    <section id="product" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-[38px] sm:text-5xl lg:text-[54px] font-normal leading-[1.12] text-[#1E1E1E]">
            Beyond answers. Into
            <br />
            understanding
          </h2>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#555558] max-w-xl mx-auto leading-relaxed font-normal">
            Most AI tools help you get an answer. Oretna helps you understand the bigger picture.
          </p>
        </div>

        {/* 3 Featured Nature Border Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-14 sm:mt-16">
          {cards.map((card) => (
            <FeatureCard
              key={card.number}
              number={card.number}
              title={card.title}
              description={card.description}
              frameImage={card.frameImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
