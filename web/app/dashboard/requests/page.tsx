'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

type RequestStatus = 'ALL' | 'IN_REVIEW' | 'PROPOSAL_READY' | 'COMPLETED';

const REQUESTS = [
  {
    id: 'REQ-104',
    title: 'Spring Promo & Paid Social Launch',
    service: 'Paid Social Ads & Hook Videos',
    submittedDate: 'Oct 24, 2026',
    status: 'PROPOSAL_READY',
    statusLabel: 'Proposal ready for review',
    tone: 'attention',
    proposalsCount: 1,
    budget: '$2,400 USD',
    deliverables: '10 static ads + 4 motion hooks',
    turnaround: '5 business days',
    actionHref: '/dashboard/proposals',
    actionLabel: 'View proposal',
  },
  {
    id: 'REQ-102',
    title: 'Display Retargeting Suite Q4',
    service: 'Display Ads (6 formats)',
    submittedDate: 'Oct 18, 2026',
    status: 'IN_REVIEW',
    statusLabel: 'Under art direction review',
    tone: 'info',
    proposalsCount: 0,
    budget: '$1,800 USD',
    deliverables: '6 responsive HTML5 & static sizes',
    turnaround: '3 business days',
    actionHref: '/dashboard/messages',
    actionLabel: 'Chat with pod',
  },
  {
    id: 'REQ-098',
    title: 'Brand Refresh Asset Polish',
    service: 'Branding & Vector Elements',
    submittedDate: 'Oct 02, 2026',
    status: 'COMPLETED',
    statusLabel: 'Delivered & Accepted',
    tone: 'success',
    proposalsCount: 1,
    budget: '$1,200 USD',
    deliverables: 'Vector logos, icon set, guidelines',
    turnaround: 'Completed Oct 08',
    actionHref: '/dashboard/files',
    actionLabel: 'View delivered files',
  },
];

export default function CustomerRequestsListPage() {
  const [filter, setFilter] = useState<RequestStatus>('ALL');
  const [query, setQuery] = useState('');

  const filtered = REQUESTS.filter((req) => {
    if (filter !== 'ALL' && req.status !== filter) return false;
    if (query.trim() && !req.title.toLowerCase().includes(query.toLowerCase()) && !req.id.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-3">
            <Sparkles size={13} className="text-[#4F46E5]" />
            <span>Creative Requests</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{REQUESTS.length} Total</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413]">
            Creative Requests
          </h2>
          <p className="mt-1 text-sm text-[#5A5852]">
            Track briefs submitted to our art direction pods and review custom proposal quotes.
          </p>
        </div>

        <Link
          href="/dashboard/requests/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#141413] to-[#2B2927] px-5 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] hover:from-neutral-900 hover:to-neutral-800"
        >
          <Plus size={16} />
          <span>New creative request</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'ALL', label: 'All requests' },
              { id: 'PROPOSAL_READY', label: 'Proposal ready (1)' },
              { id: 'IN_REVIEW', label: 'In review (1)' },
              { id: 'COMPLETED', label: 'Completed (1)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs ${
                filter === tab.id
                  ? 'bg-white text-[#141413] ring-1 ring-black/10 shadow-sm'
                  : 'bg-white/60 text-neutral-600 hover:bg-white hover:text-neutral-900 backdrop-blur-md'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search requests…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-black/[0.06] bg-white/70 pl-9 pr-4 py-2 text-xs text-neutral-800 placeholder-neutral-400 backdrop-blur-md shadow-xs focus:border-[#4F46E5] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Request Cards Grid */}
      <div className="space-y-4">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(20,20,19,0.04)] transition-all duration-300 hover:border-[#4F46E5]/40 hover:bg-white hover:shadow-lg"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* Request Info */}
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] text-[#4F46E5] shadow-xs ring-1 ring-[#4F46E5]/20 group-hover:scale-105 transition-transform">
                  <FileText size={22} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-md border border-black/[0.08] bg-black/[0.04] px-2 py-0.5 text-xs font-mono font-bold text-neutral-700">
                      {req.id}
                    </span>
                    <h3 className="text-base font-bold text-[#141413] group-hover:text-[#4F46E5] transition-colors">
                      {req.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-xs ${
                        req.tone === 'attention'
                          ? 'border border-[#D9480F]/20 bg-[#D9480F]/10 text-[#D9480F]'
                          : req.tone === 'info'
                          ? 'border border-blue-500/20 bg-blue-50/90 text-blue-700'
                          : 'border border-emerald-500/20 bg-emerald-50/90 text-emerald-700'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          req.tone === 'attention'
                            ? 'bg-[#D9480F] animate-ping'
                            : req.tone === 'info'
                            ? 'bg-blue-600'
                            : 'bg-emerald-600'
                        }`}
                      />
                      {req.statusLabel}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-[#5A5852]">{req.service}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                    <span>
                      Submitted <strong className="text-neutral-700">{req.submittedDate}</strong>
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span>
                      Scope: <strong className="text-neutral-700">{req.deliverables}</strong>
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span>
                      Fixed Budget: <strong className="text-neutral-700">{req.budget}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3 self-start lg:self-center">
                <Link
                  href={req.actionHref}
                  className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold transition-all shadow-xs ${
                    req.tone === 'attention'
                      ? 'bg-gradient-to-r from-[#D9480F] to-[#EA580C] text-white hover:shadow-md hover:scale-[1.02]'
                      : 'border border-black/[0.08] bg-white text-[#141413] hover:border-[#4F46E5]/40 hover:bg-neutral-50 hover:shadow-sm'
                  }`}
                >
                  <span>{req.actionLabel}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
