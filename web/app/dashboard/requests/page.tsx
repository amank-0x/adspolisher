'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
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
  RefreshCw,
  ExternalLink,
  Layers,
  Calendar,
  DollarSign,
  Tag,
} from 'lucide-react';

type FilterTab = 'ALL' | 'NEW' | 'IN_REVIEW' | 'PROPOSAL_READY' | 'COMPLETED';

interface DBQuoteRequest {
  id: string;
  name: string;
  email: string;
  companyName?: string | null;
  companyWebsite?: string | null;
  country?: string | null;
  message: string;
  goals?: string | null;
  budgetRange?: string | null;
  desiredDeadline?: string | null;
  attachments?: {
    projectTitle?: string;
    serviceNeeded?: string;
    targetPlatforms?: string[];
    customAttachments?: any[];
    submittedAt?: string;
  } | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    projectCode: string;
    status: string;
  } | null;
}

interface DisplayRequest {
  id: string;
  rawId: string;
  title: string;
  service: string;
  submittedDate: string;
  status: 'NEW' | 'IN_REVIEW' | 'PROPOSAL_READY' | 'COMPLETED';
  statusLabel: string;
  tone: 'attention' | 'info' | 'success';
  budget: string;
  deliverables: string;
  turnaround: string;
  actionHref: string;
  actionLabel: string;
  isLive: boolean;
}

// Fallback seed requests for demo context if database has few records
const FALLBACK_REQUESTS: DisplayRequest[] = [
  {
    id: 'REQ-104',
    rawId: 'demo-104',
    title: 'Spring Promo & Paid Social Launch',
    service: 'Paid Social Ads & Hook Videos',
    submittedDate: 'Oct 24, 2026',
    status: 'PROPOSAL_READY',
    statusLabel: 'Proposal ready for review',
    tone: 'attention',
    budget: '$2,400 USD',
    deliverables: '10 static ads + 4 motion hooks',
    turnaround: '5 business days',
    actionHref: '/dashboard/proposals',
    actionLabel: 'View proposal',
    isLive: false,
  },
  {
    id: 'REQ-102',
    rawId: 'demo-102',
    title: 'Display Retargeting Suite Q4',
    service: 'Display Ads (6 formats)',
    submittedDate: 'Oct 18, 2026',
    status: 'IN_REVIEW',
    statusLabel: 'Under art direction review',
    tone: 'info',
    budget: '$1,800 USD',
    deliverables: '6 responsive HTML5 & static sizes',
    turnaround: '3 business days',
    actionHref: '/dashboard/messages',
    actionLabel: 'Chat with pod',
    isLive: false,
  },
  {
    id: 'REQ-098',
    rawId: 'demo-098',
    title: 'Brand Refresh Asset Polish',
    service: 'Branding & Vector Elements',
    submittedDate: 'Oct 02, 2026',
    status: 'COMPLETED',
    statusLabel: 'Delivered & Accepted',
    tone: 'success',
    budget: '$1,200 USD',
    deliverables: 'Vector logos, icon set, guidelines',
    turnaround: 'Completed Oct 08',
    actionHref: '/dashboard/files',
    actionLabel: 'View delivered files',
    isLive: false,
  },
];

function mapDBRequestToDisplay(dbReq: DBQuoteRequest): DisplayRequest {
  const shortId = `REQ-${dbReq.id.slice(-4).toUpperCase()}`;
  const attachments = dbReq.attachments || {};
  const title = attachments.projectTitle || dbReq.message.split('\n')[0].replace(/^\[Project:\s*/, '').replace(/\]$/, '') || 'Creative Project';
  const service = attachments.serviceNeeded || 'Custom Creative Request';
  const platforms = (attachments.targetPlatforms || []).join(', ');

  const dateObj = new Date(dbReq.createdAt);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  let displayStatus: 'NEW' | 'IN_REVIEW' | 'PROPOSAL_READY' | 'COMPLETED' = 'NEW';
  let statusLabel = 'Submitted · Awaiting art director review';
  let tone: 'attention' | 'info' | 'success' = 'info';

  if (dbReq.status === 'NEW') {
    displayStatus = 'NEW';
    statusLabel = 'Submitted · Intake in progress';
    tone = 'info';
  } else if (dbReq.status === 'IN_REVIEW') {
    displayStatus = 'IN_REVIEW';
    statusLabel = 'Under art direction review';
    tone = 'info';
  } else if (dbReq.status === 'NEEDS_INFORMATION') {
    displayStatus = 'IN_REVIEW';
    statusLabel = 'Needs clarification';
    tone = 'attention';
  } else if (dbReq.status === 'ACCEPTED' || dbReq.status === 'CONVERTED') {
    displayStatus = 'COMPLETED';
    statusLabel = 'Proposal Accepted · In Production';
    tone = 'success';
  } else if (dbReq.project) {
    displayStatus = 'COMPLETED';
    statusLabel = `Active Project (${dbReq.project.projectCode})`;
    tone = 'success';
  }

  return {
    id: shortId,
    rawId: dbReq.id,
    title,
    service,
    submittedDate: formattedDate,
    status: displayStatus,
    statusLabel,
    tone,
    budget: dbReq.budgetRange || 'Custom Fixed Scope',
    deliverables: platforms ? `${platforms} assets` : 'Multi-format design & motion brief',
    turnaround: dbReq.desiredDeadline
      ? `Target ${new Date(dbReq.desiredDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : 'Standard 48-72h pod review',
    actionHref: `/dashboard/requests/${dbReq.id}`,
    actionLabel: 'View request brief',
    isLive: true,
  };
}

export default function CustomerRequestsListPage() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState<FilterTab>('ALL');
  const [query, setQuery] = useState('');
  const [liveRequests, setLiveRequests] = useState<DisplayRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    try {
      const email = session?.user?.email || '';
      const userId = session?.user?.id || '';
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (userId) params.append('userId', userId);

      const res = await fetch(`/api/requests?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map(mapDBRequestToDisplay);
          setLiveRequests(mapped);
        }
      }
    } catch (err) {
      console.error('Failed to load user requests:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [session?.user?.email, session?.user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  // Combine live requests with fallback demo requests (avoid duplicates)
  const combinedRequests = useMemo(() => {
    const liveIds = new Set(liveRequests.map((r) => r.rawId));
    const fallbacks = FALLBACK_REQUESTS.filter((f) => !liveIds.has(f.rawId));
    return [...liveRequests, ...fallbacks];
  }, [liveRequests]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      ALL: combinedRequests.length,
      NEW: combinedRequests.filter((r) => r.status === 'NEW').length,
      IN_REVIEW: combinedRequests.filter((r) => r.status === 'IN_REVIEW').length,
      PROPOSAL_READY: combinedRequests.filter((r) => r.status === 'PROPOSAL_READY').length,
      COMPLETED: combinedRequests.filter((r) => r.status === 'COMPLETED').length,
    };
  }, [combinedRequests]);

  const filtered = useMemo(() => {
    return combinedRequests.filter((req) => {
      if (filter !== 'ALL' && req.status !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = req.title.toLowerCase().includes(q);
        const matchesId = req.id.toLowerCase().includes(q) || req.rawId.toLowerCase().includes(q);
        const matchesService = req.service.toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesService) return false;
      }
      return true;
    });
  }, [combinedRequests, filter, query]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-3">
            <Sparkles size={13} className="text-[#4F46E5]" />
            <span>Creative Requests</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{combinedRequests.length} Total</span>
            {liveRequests.length > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span className="text-emerald-600 font-medium">{liveRequests.length} live from database</span>
              </>
            )}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413]">
            Creative Requests
          </h2>
          <p className="mt-1 text-sm text-[#5A5852]">
            Track briefs submitted to our art direction pods, check real-time status, and review custom proposals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh requests from database"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.08] bg-white/80 text-neutral-600 backdrop-blur-md shadow-xs transition hover:bg-white hover:text-neutral-900 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin text-[#4F46E5]' : ''} />
          </button>

          <Link
            href="/dashboard/requests/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/30"
          >
            <Plus size={16} />
            <span>New creative request</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'ALL', label: `All requests (${counts.ALL})` },
              { id: 'NEW', label: `Intake / New (${counts.NEW})` },
              { id: 'IN_REVIEW', label: `In review (${counts.IN_REVIEW})` },
              { id: 'PROPOSAL_READY', label: `Proposal ready (${counts.PROPOSAL_READY})` },
              { id: 'COMPLETED', label: `Completed (${counts.COMPLETED})` },
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
            placeholder="Search briefs or requests…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-black/[0.06] bg-white/70 pl-9 pr-4 py-2 text-xs text-neutral-800 placeholder-neutral-400 backdrop-blur-md shadow-xs focus:border-[#4F46E5] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Request Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/70 p-16 text-center shadow-xs">
          <RefreshCw className="h-8 w-8 animate-spin text-[#4F46E5]" />
          <p className="mt-3 text-sm font-semibold text-neutral-600">Loading your creative briefs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/75 p-16 text-center backdrop-blur-xl shadow-xs">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
            <FileText size={24} />
          </div>
          <h3 className="mt-4 text-base font-bold text-neutral-900">No requests match your filter</h3>
          <p className="mt-1 max-w-sm text-xs text-neutral-500">
            {query ? `No brief matching "${query}". Try another search term.` : 'Submit your first brief to get a custom scoped proposal from our creative team.'}
          </p>
          <Link
            href="/dashboard/requests/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-4 py-2 text-xs font-bold text-white shadow-sm"
          >
            <Plus size={14} />
            <span>Create new request</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div
              key={req.rawId || req.id}
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
                      {req.isLive && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Database Sync
                        </span>
                      )}
                      <Link
                        href={req.actionHref}
                        className="text-base font-bold text-[#141413] hover:text-[#4F46E5] transition-colors"
                      >
                        {req.title}
                      </Link>
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

                    <p className="mt-1.5 text-xs text-[#5A5852] font-medium">{req.service}</p>

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
                        Budget: <strong className="text-neutral-700">{req.budget}</strong>
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span>
                        Turnaround: <strong className="text-neutral-700">{req.turnaround}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
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
      )}
    </div>
  );
}
