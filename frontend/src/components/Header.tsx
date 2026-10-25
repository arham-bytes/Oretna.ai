'use client';

import React, { useState } from 'react';
import { MoreHorizontal, PanelLeft, Check } from 'lucide-react';
import { Conversation } from '@/types/chat';

interface HeaderProps {
  activeChat?: Conversation | null;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function Header({
  activeChat,
  sidebarOpen,
  onToggleSidebar
}: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const title = activeChat ? activeChat.title : 'New chat';
  const subtitle = activeChat
    ? activeChat.subtitle || 'Research thread in your workspace'
    : 'Start a research thread in your workspace';

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-[60px] min-h-[60px] px-7 flex items-center justify-between border-b border-transparent bg-transparent z-10">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            className="text-[#78736B] p-1.5 rounded-md flex items-center justify-center hover:bg-[#FEFAF6] hover:text-[#262628] transition-colors"
            onClick={onToggleSidebar}
            title="Open sidebar"
            aria-label="Open sidebar"
          >
            <PanelLeft size={18} strokeWidth={1.8} />
          </button>
        )}
        <div>
          <h1 className="text-[15px] font-semibold text-[#262628] leading-tight">
            {title}
          </h1>
          <p className="text-[12.5px] text-[#8E8A84] leading-tight mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="w-8 h-8 rounded-md flex items-center justify-center text-[#78736B] hover:bg-[#FEFAF6] hover:text-[#262628] transition-colors"
          onClick={handleShare}
          title="Share research thread"
          aria-label="Share"
        >
          {copied ? (
            <Check size={16} strokeWidth={2} className="text-green-600" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          )}
        </button>

        <div className="relative">
          <button
            className="w-8 h-8 rounded-md flex items-center justify-center text-[#78736B] hover:bg-[#FEFAF6] hover:text-[#262628] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            title="More options"
            aria-label="More options"
          >
            <MoreHorizontal size={18} strokeWidth={1.8} />
          </button>

          {menuOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-[190px] bg-[#FFFFFF] border border-[#EAE5DC] rounded-xl shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                className="w-full text-left py-2 px-2.5 rounded-md text-[13px] text-[#262628] hover:bg-[#FEFAF6] transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  window.print();
                }}
              >
                Export / Print thread
              </button>
              <button
                className="w-full text-left py-2 px-2.5 rounded-md text-[13px] text-[#262628] hover:bg-[#FEFAF6] transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  alert('Thread settings: Default citation style is APA 7th Edition');
                }}
              >
                Thread settings
              </button>
              <div className="h-px bg-[#EFECE6] my-1" />
              <button
                className="w-full text-left py-2 px-2.5 rounded-md text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Clear research thread
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
