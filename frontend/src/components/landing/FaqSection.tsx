'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: '01',
    question: 'What exactly is Oretna?',
    answer:
      'Oretna is an AI-powered research and discovery platform that helps you explore subjects, discover relevant research papers and articles, generate citations, and share ideas with a community of curious minds.',
  },
  {
    id: '02',
    question: 'Is Oretna free to use?',
    answer:
      'Oretna is planned to offer free access to research features through a token-based usage model. Your available tokens will determine how much research you can run. Final token limits and usage rules will be announced at launch.',
  },
  {
    id: '03',
    question: 'How does token-based research work?',
    answer:
      'Tokens are used when you access AI-powered features. Different tasks may consume different amounts depending on their complexity. Your available balance and usage costs should be visible before you start a task.',
  },
  {
    id: '04',
    question: 'How is Oretna different from ChatGPT or Perplexity?',
    answer:
      'Oretna aims to bring research discovery, subject exploration, citation generation, and community discussions into one connected experience. Rather than focusing only on answers, it is designed to help you investigate sources and explore ideas further.',
  },
  {
    id: '05',
    question: 'Can I generate citations from a PDF?',
    answer:
      'The planned citation feature will let you upload a PDF or provide source details to generate formatted references. You should verify the extracted author names, publication dates, titles, and other details before using a citation in your work.',
  },
  {
    id: '06',
    question: 'Which citation styles will Oretna support?',
    answer:
      'APA, MLA, Chicago, and Harvard are proposed citation styles. The final list of supported formats will depend on the implemented product.',
  },
  {
    id: '07',
    question: 'Can I share my discoveries with other people?',
    answer:
      'The planned Community Space will let users share ideas, publish discoveries, ask questions, and participate in discussions with people exploring different subjects.',
  },
];

export default function FaqSection() {
  // Default first question open matching screenshot Image 5
  const [openIds, setOpenIds] = useState<string[]>(['01']);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-20 md:py-28 bg-white border-t border-[#F2EEE9]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <h2 className="font-serif text-[38px] sm:text-5xl lg:text-[54px] font-normal leading-[1.12] text-[#1E1E1E]">
              Frequently asked
              <br />
              questions
            </h2>
          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-7 divide-y divide-[#EAE4DC] border-b border-[#EAE4DC]">
            {FAQ_DATA.map((item) => {
              const isOpen = openIds.includes(item.id);
              return (
                <div key={item.id} className="py-5 sm:py-6">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between text-left group gap-4 transition-colors"
                  >
                    <span className="text-[16px] sm:text-[17px] font-bold text-[#1E1E1E] group-hover:text-black">
                      {item.question}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-[#F4F1EA] group-hover:bg-[#EAE4DC] flex items-center justify-center text-[#555558] flex-shrink-0 transition-colors">
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-4 text-[14px] sm:text-[15px] text-[#555558] leading-relaxed font-normal pr-8 animate-fadeIn">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
