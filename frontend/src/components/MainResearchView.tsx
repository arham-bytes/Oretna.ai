'use client';

import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Scale,
  Paperclip,
  ArrowUp,
  X
} from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  prompt: string;
  icon: React.ReactNode;
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: 'complex-concept',
    title: 'Explain a complex concept',
    prompt: 'Explain the mechanism of CRISPR-Cas9 gene editing and how off-target effects are minimized in modern clinical therapeutics.',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a7 7 0 0 0-7 7c0 4 5 10 7 11 2-1 7-7 7-11a7 7 0 0 0-7-7z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
    ),
  },
  {
    id: 'in-depth',
    title: 'Research a topic in depth',
    prompt: 'Provide an in-depth literature synthesis on the long-term macroeconomic impacts of artificial intelligence on labor productivity.',
    icon: <BookOpen size={18} strokeWidth={1.7} />,
  },
  {
    id: 'perspectives',
    title: 'Compare different perspectives',
    prompt: 'Compare differing academic perspectives on Modern Monetary Theory (MMT) versus orthodox fiscal policy in controlling inflation.',
    icon: <Scale size={18} strokeWidth={1.7} />,
  },
  {
    id: 'evaluate-argument',
    title: 'Evaluate an argument or claim',
    prompt: 'Critically evaluate empirical claims regarding carbon offset programs and their verified permanence in reducing global net emissions.',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3.5" />
        <line x1="12" y1="2" x2="12" y2="4.5" />
        <line x1="12" y1="19.5" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4.5" y2="12" />
        <line x1="19.5" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
];

interface MainResearchViewProps {
  onSendMessage: (payload: { text: string; file: File | null }) => void;
}

export default function MainResearchView({ onSendMessage }: MainResearchViewProps) {
  const [inputValue, setInputValue] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() && !attachedFile) return;

    onSendMessage({
      text: inputValue.trim(),
      file: attachedFile,
    });
    setInputValue('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCardClick = (suggestion: Suggestion) => {
    setInputValue(suggestion.prompt);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const isSendActive = inputValue.trim().length > 0 || attachedFile !== null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative p-5 pb-8 min-h-[calc(100vh-60px)]">
      {/* Centered Soft Blue Ambient Glow (#DDF2FD) */}
      <div
        className="absolute top-0 left-0 right-0 h-[75%] pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 58% 50% at 50% 32%, #DDF2FD 0%, rgba(221, 242, 253, 0.42) 36%, rgba(255, 255, 255, 0) 72%)'
        }}
      />

      <div className="relative z-[2] w-full max-w-[680px] flex flex-col items-center -mt-6">
        {/* Main Hero Heading in PT Serif */}
        <div className="text-center mb-8">
          <h2 className="font-pt-serif text-[38px] md:text-[40px] font-normal text-[#262628] leading-[1.18] tracking-[-0.015em]">
            What are you<br />
            researching today?
          </h2>
          <p className="text-[15px] text-[#6B7280] mt-3.5 leading-[1.5] font-normal">
            Explore ideas, understand complex<br />
            topics, and follow the evidence.
          </p>
        </div>

        {/* 2x2 Suggestion Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
          {SUGGESTIONS.map((item) => (
            <button
              key={item.id}
              className="bg-[#FFFFFF] border border-[#EAE6DF] hover:border-[#D3CDC2] hover:bg-[#FFFCF9] hover:shadow-[0_4px_12px_rgba(0,0,0,0.035)] hover:-translate-y-0.5 active:translate-y-0 rounded-[14px] p-3.5 px-4.5 flex items-center gap-3.5 text-left transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.015)]"
              onClick={() => handleCardClick(item)}
              type="button"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FEFAF6] flex items-center justify-center text-[#6E685E] shrink-0 border border-[#F2ECE5]">
                {item.icon}
              </div>
              <span className="text-[14px] font-medium text-[#262628] leading-snug">
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
          {attachedFile && (
            <div className="self-start ml-5 mb-2 bg-[#FEFAF6] border border-[#EAE5DC] rounded-full px-2.5 py-1 inline-flex items-center gap-1.5 text-xs text-[#262628]">
              <span>{attachedFile.name}</span>
              <button
                type="button"
                className="text-[#6B7280] hover:text-[#262628]"
                onClick={() => setAttachedFile(null)}
                aria-label="Remove attachment"
              >
                <X size={12} strokeWidth={2} />
              </button>
            </div>
          )}

          <div className="w-full h-[54px] bg-[#FFFFFF] border border-[#E4E1DB] focus-within:border-[#D3CDC2] focus-within:shadow-[0_3px_14px_rgba(0,0,0,0.06)] rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center py-1 pl-4 pr-2 gap-1.5 transition-all">
            <button
              type="button"
              className="text-[#A39E96] hover:text-[#262628] hover:bg-[#FEFAF6] p-1.5 rounded-full transition-colors shrink-0"
              onClick={() => fileInputRef.current?.click()}
              title="Attach research paper or data (.pdf, .txt, .csv, .docx)"
              aria-label="Attach file"
            >
              <Paperclip size={18} strokeWidth={1.8} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.csv,.json"
            />

            <input
              ref={inputRef}
              type="text"
              className="flex-1 border-none outline-none bg-transparent text-[15px] text-[#262628] px-1.5 placeholder-[#A39E96]"
              placeholder="Ask Oretna anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              type="submit"
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                isSendActive
                  ? 'bg-[#262628] hover:bg-[#38383B] text-[#FFFFFF] hover:scale-105 shadow-[0_2px_6px_rgba(0,0,0,0.15)] cursor-pointer'
                  : 'bg-[#ECE8E1] text-[#A8A39C] cursor-not-allowed'
              }`}
              disabled={!isSendActive}
              title="Send research query"
              aria-label="Send"
            >
              <ArrowUp size={17} strokeWidth={2.4} />
            </button>
          </div>

          <div className="text-[12px] text-[#A8A39C] text-center mt-3.5 tracking-[-0.01em]">
            AI can make mistakes. Verify important information with its sources.
          </div>
        </form>
      </div>
    </div>
  );
}
