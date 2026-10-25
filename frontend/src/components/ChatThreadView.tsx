'use client';

import React, { useState } from 'react';
import { Paperclip, ArrowUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { Conversation } from '@/types/chat';

interface ChatThreadViewProps {
  chat: Conversation;
  onSendFollowUp: (text: string) => void;
}

export default function ChatThreadView({ chat, onSendFollowUp }: ChatThreadViewProps) {
  const [followUp, setFollowUp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUp.trim()) return;
    onSendFollowUp(followUp.trim());
    setFollowUp('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FFFFFF]">
      <div className="w-full max-w-[760px] mx-auto p-5 pb-28 flex flex-col gap-7">
        {/* Messages Stream */}
        <div className="flex flex-col gap-6">
          {chat.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[82%] bg-[#FEFAF6] border border-[#ECE6DF] rounded-2xl rounded-br-[4px] px-5 py-3.5 text-[15px] leading-relaxed text-[#262628]">
                  <p>{msg.content}</p>
                </div>
              ) : (
                <div className="w-full bg-[#FFFFFF] border border-[#EAE6DF] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col">
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-1.5 bg-[#DDF2FD]/40 border border-[#DDF2FD] px-2.5 py-1 rounded-full text-xs font-semibold text-[#262628]">
                      <Sparkles size={14} strokeWidth={2} className="text-[#262628]" />
                      <span>Synthesis & Evidence</span>
                    </div>
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="bg-[#FEFAF6] border border-[#ECE6DF] rounded-xl p-3 px-3.5 mb-5">
                      <div className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-[#78736B] mb-2.5">
                        <BookOpen size={13} strokeWidth={2} />
                        <span>Sources & Citations ({msg.sources.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E4E1DB] hover:border-[#C8C3B8] hover:bg-[#FEFAF6] rounded-md px-2.5 py-1 text-xs text-[#262628] transition-all"
                          >
                            <span className="bg-[#EFECE6] rounded px-1.5 py-0.5 text-[10.5px] font-semibold text-[#57534E]">
                              {i + 1}
                            </span>
                            <span className="max-w-[220px] truncate">{src.title}</span>
                            {src.year && <span className="text-[#8C867E]">{src.year}</span>}
                            <ExternalLink size={11} strokeWidth={2} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[15px] leading-[1.65] text-[#262628] space-y-3.5">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>

                  {msg.keyFindings && (
                    <div className="mt-4.5 bg-[#FEFAF6] border-l-[3px] border-[#262628] p-3.5 px-4.5 rounded-r-lg">
                      <div className="text-[13px] font-semibold text-[#262628] mb-2 font-pt-serif">
                        Key Academic Takeaways
                      </div>
                      <ul className="pl-4.5 list-disc space-y-1.5 text-[13.5px] text-[#484541] leading-snug">
                        {msg.keyFindings.map((finding, fIdx) => (
                          <li key={fIdx}>{finding}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Sticky Thread Input Bar */}
        <div className="fixed bottom-0 left-[272px] right-0 p-4 px-5 pb-6 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center z-10 pointer-events-none">
          <form
            className="w-full max-w-[760px] pointer-events-auto flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="w-full h-[54px] bg-[#FFFFFF] border border-[#E4E1DB] focus-within:border-[#D3CDC2] focus-within:shadow-[0_3px_14px_rgba(0,0,0,0.06)] rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center py-1 pl-4 pr-2 gap-1.5 transition-all">
              <button
                type="button"
                className="text-[#A39E96] hover:text-[#262628] hover:bg-[#FEFAF6] p-1.5 rounded-full transition-colors shrink-0"
                title="Attach file"
              >
                <Paperclip size={18} strokeWidth={1.8} />
              </button>
              <input
                type="text"
                className="flex-1 border-none outline-none bg-transparent text-[15px] text-[#262628] px-1.5 placeholder-[#A39E96]"
                placeholder="Ask follow-up or probe deeper..."
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
              />
              <button
                type="submit"
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  followUp.trim()
                    ? 'bg-[#262628] hover:bg-[#38383B] text-[#FFFFFF] hover:scale-105 shadow-[0_2px_6px_rgba(0,0,0,0.15)] cursor-pointer'
                    : 'bg-[#ECE8E1] text-[#A8A39C] cursor-not-allowed'
                }`}
                disabled={!followUp.trim()}
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
    </div>
  );
}
