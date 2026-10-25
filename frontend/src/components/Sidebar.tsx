'use client';

import React from 'react';
import {
  PanelLeft,
  Plus,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { Conversation, GroupedConversations } from '@/types/chat';
import KaetleLogo from '@/components/KaetleLogo';

interface SidebarProps {
  conversations: GroupedConversations;
  activeChatId?: string | null;
  onSelectChat: (chat: Conversation) => void;
  onNewChat: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  conversations,
  activeChatId,
  onSelectChat,
  onNewChat,
  searchQuery,
  setSearchQuery,
  isOpen,
  onToggle
}: SidebarProps) {
  const [currentUser, setCurrentUser] = React.useState<{ firstName: string; lastName: string; email: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const filterList = (items: Conversation[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const todayItems = filterList(conversations.today || []);
  const yesterdayItems = filterList(conversations.yesterday || []);
  const previousItems = filterList(conversations.previous || []);

  return (
    <aside
      className={`h-full bg-[#FEFAF6] border-r border-[#ECE6DF] flex flex-col transition-all duration-200 z-20 select-none ${
        isOpen ? 'w-[272px] min-w-[272px]' : 'w-0 min-w-0 overflow-hidden border-r-0 -translate-x-full absolute'
      }`}
    >
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between p-4 pb-3.5">
        <a
          href="/"
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          title="Return to home page"
        >
          <KaetleLogo size={22} />
        </a>
        <button
          className="text-[#78736B] p-1.5 rounded-md flex items-center justify-center hover:bg-[#F3EDE6] hover:text-[#262628] transition-colors"
          onClick={onToggle}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={18} strokeWidth={1.8} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3.5 pb-3">
        <button
          className="w-full h-10 bg-[#262628] hover:bg-[#38383B] active:scale-[0.99] text-[#FFFFFF] rounded-[10px] flex items-center justify-start px-3.5 gap-2.5 text-[13.5px] font-medium transition-all shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          onClick={onNewChat}
        >
          <Plus size={17} strokeWidth={2.4} />
          <span>New chat</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3.5 pb-3.5">
        <div className="h-9 bg-[#FFFFFF] border border-[#EAE5DC] focus-within:border-[#D3CDC2] focus-within:ring-1 focus-within:ring-[#D3CDC2] rounded-lg flex items-center px-2.5 gap-2 transition-all">
          <Search size={15} strokeWidth={1.9} className="text-[#A39E96] shrink-0" />
          <input
            type="text"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[13px] text-[#262628] placeholder-[#A39E96]"
          />
        </div>
      </div>

      {/* History Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-3">
        {todayItems.length > 0 && (
          <div className="mb-3.5">
            <div className="text-[11px] font-semibold text-[#9C968D] tracking-[0.05em] px-4 py-1.5 uppercase">
              TODAY
            </div>
            <ul className="px-2 space-y-0.5">
              {todayItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`block w-full text-left py-1.5 px-2.5 rounded-[7px] text-[13px] truncate transition-colors ${
                      activeChatId === item.id
                        ? 'bg-[#F0EAE2] text-[#262628] font-medium'
                        : 'text-[#484541] hover:bg-[#F3EDE6] hover:text-[#262628]'
                    }`}
                    onClick={() => onSelectChat(item)}
                    title={item.fullTitle || item.title}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {yesterdayItems.length > 0 && (
          <div className="mb-3.5">
            <div className="text-[11px] font-semibold text-[#9C968D] tracking-[0.05em] px-4 py-1.5 uppercase">
              YESTERDAY
            </div>
            <ul className="px-2 space-y-0.5">
              {yesterdayItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`block w-full text-left py-1.5 px-2.5 rounded-[7px] text-[13px] truncate transition-colors ${
                      activeChatId === item.id
                        ? 'bg-[#F0EAE2] text-[#262628] font-medium'
                        : 'text-[#484541] hover:bg-[#F3EDE6] hover:text-[#262628]'
                    }`}
                    onClick={() => onSelectChat(item)}
                    title={item.fullTitle || item.title}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {previousItems.length > 0 && (
          <div className="mb-3.5">
            <div className="text-[11px] font-semibold text-[#9C968D] tracking-[0.05em] px-4 py-1.5 uppercase">
              PREVIOUS 7 DAYS
            </div>
            <ul className="px-2 space-y-0.5">
              {previousItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`block w-full text-left py-1.5 px-2.5 rounded-[7px] text-[13px] truncate transition-colors ${
                      activeChatId === item.id
                        ? 'bg-[#F0EAE2] text-[#262628] font-medium'
                        : 'text-[#484541] hover:bg-[#F3EDE6] hover:text-[#262628]'
                    }`}
                    onClick={() => onSelectChat(item)}
                    title={item.fullTitle || item.title}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {todayItems.length === 0 && yesterdayItems.length === 0 && previousItems.length === 0 && (
          <div className="py-6 px-4 text-center text-[12.5px] text-[#9E988F]">
            No conversations found
          </div>
        )}
      </div>

      {/* User Profile Bar */}
      <div className="border-t border-[#ECE6DF] p-3 px-3.5 flex items-center justify-between bg-[#FEFAF6]">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-full bg-[#262628] text-[#FFFFFF] text-[11px] font-semibold flex items-center justify-center shrink-0 tracking-[-0.02em]">
            {currentUser
              ? `${currentUser.firstName[0] || ''}${currentUser.lastName[0] || ''}`.toUpperCase()
              : 'AR'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-[#262628] leading-tight truncate">
              {currentUser
                ? `${currentUser.firstName} ${currentUser.lastName}`
                : 'Dr. Amara Reyes'}
            </div>
            <div className="text-[11px] text-[#8C867E] leading-tight mt-0.5 truncate">
              {currentUser
                ? `${currentUser.email} · Personal workspace`
                : 'Researcher · Personal workspace'}
            </div>
          </div>
        </div>
        <button
          className="text-[#78736B] p-1.5 rounded-md flex items-center justify-center hover:bg-[#F3EDE6] hover:text-[#262628] transition-colors"
          title="Account settings & preferences"
          aria-label="Account settings"
        >
          <SlidersHorizontal size={15} strokeWidth={1.8} />
        </button>
      </div>
    </aside>
  );
}
