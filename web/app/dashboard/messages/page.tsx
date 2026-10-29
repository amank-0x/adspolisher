'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, Paperclip } from 'lucide-react';

const CONVERSATIONS = [
  {
    id: 'conv-1',
    title: 'Q4 Meta Performance Ads',
    projectCode: 'AP-2041',
    lastSender: 'Maya (Art Director)',
    preview: 'We’ve just uploaded the updated v2 exports for the 4:5 lifestyle feed ads. Let us know if the typography hook aligns with your feedback!',
    time: '2 hours ago',
    unread: true,
  },
  {
    id: 'conv-2',
    title: 'Display Retargeting Suite',
    projectCode: 'AP-1988',
    lastSender: 'Liam (Senior Designer)',
    preview: 'First 2 drafts for Google Display 300x250 and 728x90 are ready for your review in the deliverables tab.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'conv-3',
    title: 'Spring Promo Brief Inquiry',
    projectCode: 'REQ-104',
    lastSender: 'AdSpolisher Ops',
    preview: 'Which specific platforms will this campaign primarily target? Meta, Google Display, or TikTok?',
    time: 'Oct 26',
    unread: true,
  },
];

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState('conv-1');
  const [replyText, setReplyText] = useState('');

  const activeConv = CONVERSATIONS.find((c) => c.id === selectedId) || CONVERSATIONS[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#141413]">
          Creative Team Messages
        </h2>
        <p className="mt-1 text-sm text-[#5A5852]">
          Communicate directly with your assigned creative pod on briefs, feedback, and milestones.
        </p>
      </div>

      {/* Two-Column Messenger Layout (Frosted Glass) */}
      <div className="grid grid-cols-1 md:grid-cols-12 rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)] overflow-hidden min-h-[580px]">
        {/* Left Conversation List (5 cols) */}
        <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-black/[0.06] divide-y divide-black/[0.05] overflow-y-auto bg-white/40">
          {CONVERSATIONS.map((conv) => {
            const isSelected = conv.id === selectedId;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full p-4 sm:p-5 text-left transition flex flex-col gap-1.5 ${
                  isSelected ? 'bg-white shadow-xs' : 'hover:bg-white/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-neutral-500 bg-black/[0.04] px-1.5 py-0.5 rounded">
                      {conv.projectCode}
                    </span>
                    <h4 className="text-sm font-bold text-[#141413] truncate">{conv.title}</h4>
                  </div>
                  {conv.unread && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9480F] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9480F]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {conv.preview}
                </p>
                <span className="text-[10px] font-medium text-neutral-400 mt-0.5">{conv.time}</span>
              </button>
            );
          })}
        </div>

        {/* Right Active Message Thread (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between p-6 bg-white/60 backdrop-blur-md">
          {/* Thread Header */}
          <div className="border-b border-black/[0.06] pb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-neutral-500">
                  {activeConv.projectCode}
                </span>
                <h3 className="text-base font-bold text-[#141413] mt-0.5">{activeConv.title}</h3>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-xs">
                Active thread
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="my-6 space-y-4 flex-1 overflow-y-auto">
            {/* Incoming message */}
            <div className="flex items-start gap-3 max-w-lg">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] text-xs font-bold text-[#4F46E5] ring-1 ring-[#4F46E5]/20 shadow-xs shrink-0">
                M
              </span>
              <div className="rounded-2xl rounded-tl-none border border-black/[0.06] bg-white p-4 shadow-sm text-sm leading-relaxed text-[#141413]">
                <p className="text-xs font-bold text-[#4F46E5] mb-1">{activeConv.lastSender}</p>
                {activeConv.preview}
              </div>
            </div>
          </div>

          {/* Reply Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!replyText.trim()) return;
              alert('Message sent to creative pod!');
              setReplyText('');
            }}
            className="flex items-center gap-2 rounded-2xl border border-black/[0.08] bg-white p-2 shadow-xs focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/15"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a message to your pod…"
              className="flex-1 bg-transparent px-3 py-2 text-xs text-[#141413] outline-none placeholder-neutral-400"
            />
            <button
              type="submit"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#141413] to-[#2B2927] text-white shadow-xs hover:shadow-md transition hover:scale-105"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
