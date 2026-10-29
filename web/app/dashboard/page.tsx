'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileClock,
  FileText,
  FolderKanban,
  HelpCircle,
  MessageSquare,
  MessageSquareText,
  Sparkles,
  Download,
  Play,
  ArrowUpRight,
  Check,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { StageStepper } from '@/components/dashboard/StageStepper';

// Summary metrics data
const SUMMARY_TILES = [
  {
    id: 'active-projects',
    label: 'Active projects',
    value: '02',
    subText: '1 in production · 1 in your review',
    href: '/dashboard/projects?status=active',
    icon: FolderKanban,
    colorScheme: 'indigo',
    needsAction: false,
  },
  {
    id: 'requests-in-review',
    label: 'Requests in review',
    value: '02',
    subText: '1 needs your reply',
    href: '/dashboard/requests?tab=in-review',
    icon: FileText,
    colorScheme: 'cyan',
    needsAction: false,
  },
  {
    id: 'proposals-to-decide',
    label: 'Proposals to decide',
    value: '01',
    subText: 'Earliest expires in 5 days',
    href: '/dashboard/proposals',
    icon: FileClock,
    colorScheme: 'amber',
    needsAction: true,
  },
  {
    id: 'approvals-needed',
    label: 'Approvals needed',
    value: '02',
    subText: '2 drafts across 1 project',
    href: '/dashboard/projects?status=review',
    icon: CheckCircle2,
    colorScheme: 'rose',
    needsAction: true,
  },
];

// Needs your attention queue items
const ATTENTION_QUEUE = [
  {
    id: 'att-1',
    type: 'PROPOSAL_DECISION',
    icon: FileClock,
    badge: 'Q-104',
    title: 'Proposal ready · Q4 Meta Performance Campaign',
    context: '10 static ads + 4 video hooks · $2,400 USD fixed',
    urgency: 'Expires in 5 days',
    actionLabel: 'Review proposal',
    actionHref: '/dashboard/proposals',
    primary: true,
  },
  {
    id: 'att-2',
    type: 'DELIVERABLE_REVIEW',
    icon: Eye,
    badge: 'AP-1988',
    title: 'Review drafts · Display Retargeting Suite',
    context: '2 responsive banner drafts ready for your approval',
    urgency: 'Waiting 3 hours',
    actionLabel: 'Review drafts',
    actionHref: '/dashboard/projects/proj-1988',
    primary: false,
  },
  {
    id: 'att-3',
    type: 'INFO_REQUESTED',
    icon: MessageSquareText,
    badge: 'REQ-104',
    title: 'Reply needed · Spring Promo request',
    context: 'Creative pod asked: "Which specific platforms will this campaign primarily target?"',
    urgency: 'Waiting 1 day',
    actionLabel: 'Reply to question',
    actionHref: '/dashboard/messages',
    primary: false,
  },
];

// Active projects data
const ACTIVE_PROJECTS = [
  {
    id: 'proj-1988',
    code: 'AP-1988',
    name: 'Display Retargeting Suite',
    service: 'Display · 6 formats',
    status: 'Your review',
    statusTone: 'attention',
    currentStage: 4 as const,
    milestone: 'Waiting for your review',
    dueDate: '2 drafts ready',
    dueUrgent: true,
    progressLabel: '4 of 6 formats ready',
    team: ['Liam', 'Sarah'],
    actionLabel: 'Review drafts',
    actionPrimary: true,
  },
  {
    id: 'proj-2041',
    code: 'AP-2041',
    name: 'Q4 Meta Performance Ads',
    service: 'Paid social · 10 creatives',
    status: 'In production',
    statusTone: 'info',
    currentStage: 3 as const,
    milestone: 'Next: First drafts due Nov 02',
    dueDate: 'Due Nov 08',
    dueUrgent: false,
    progressLabel: '3 of 10 creatives ready',
    team: ['Maya', 'Dev'],
    actionLabel: 'Open project',
    actionPrimary: false,
  },
];

// Latest released deliverables with real creative artwork previews
const DELIVERABLES = [
  {
    id: 'del-1',
    title: 'Static Feed Ad 1 - Benefit Focus',
    project: 'Q4 Meta Performance Ads',
    version: 'v2',
    status: 'Ready for review',
    type: 'image',
    image: '/work/slide/Minimal-Graphics-for-Modern-Appeal-Soto.jpg',
    action: 'Review',
    href: '/dashboard/projects/proj-2041',
  },
  {
    id: 'del-2',
    title: 'Story Motion Hook 1',
    project: 'Q4 Meta Performance Ads',
    version: 'v1',
    status: 'Ready for review',
    type: 'video',
    image: '/work/slide/Nostalgic-Energy-poster.jpg',
    action: 'Review',
    href: '/dashboard/projects/proj-2041',
  },
  {
    id: 'del-3',
    title: 'Google Display 300x250 Banner',
    project: 'Display Retargeting Suite',
    version: 'v2',
    status: 'Approved',
    type: 'image',
    image: '/work/slide/Toyota-Innovations-poster.jpg',
    action: 'Download',
    href: '/dashboard/files',
  },
  {
    id: 'del-4',
    title: 'Google Display 728x90 Banner',
    project: 'Display Retargeting Suite',
    version: 'v1',
    status: 'Approved',
    type: 'image',
    image: '/work/slide/Dynamic-Visual-Language-at-Every-Post-Briefly.jpg',
    action: 'Download',
    href: '/dashboard/files',
  },
];

// Activity items grouped by day
const ACTIVITY_GROUPS = [
  {
    day: 'Today',
    items: [
      {
        id: 'act-1',
        text: 'New drafts released for review on',
        entity: 'Display Retargeting Suite',
        href: '/dashboard/projects/proj-1988',
        time: '3 hours ago',
        unread: true,
      },
      {
        id: 'act-2',
        text: 'Art Director Maya posted a note on',
        entity: 'Q4 Meta Performance Ads',
        href: '/dashboard/messages',
        time: '5 hours ago',
        unread: true,
      },
    ],
  },
  {
    day: 'Yesterday',
    items: [
      {
        id: 'act-3',
        text: 'Campaign brief was approved for',
        entity: 'Q4 Meta Performance Ads',
        href: '/dashboard/projects/proj-2041',
        time: 'Yesterday at 4:15 PM',
        unread: false,
      },
    ],
  },
  {
    day: 'Oct 25',
    items: [
      {
        id: 'act-4',
        text: 'Proposal Q-104 was sent for your decision on',
        entity: 'Spring Promo request',
        href: '/dashboard/proposals',
        time: 'Oct 25 at 11:30 AM',
        unread: false,
      },
    ],
  },
];

// Upcoming deadlines
const UPCOMING_DEADLINES = [
  {
    id: 'dl-1',
    date: 'Nov 02',
    label: 'First drafts due',
    project: 'Q4 Meta Performance Ads',
    urgent: true,
  },
  {
    id: 'dl-2',
    date: 'Nov 03',
    label: 'Proposal expires',
    project: 'Proposal Q-104',
    urgent: true,
  },
  {
    id: 'dl-3',
    date: 'Nov 08',
    label: 'Campaign delivery',
    project: 'Q4 Meta Performance Ads',
    urgent: false,
  },
];

export default function CustomerDashboardPage() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.trim().split(/\s+/)[0] || 'there';

  const [overview, setOverview] = useState<{
    counts: {
      totalRequests: number;
      newRequests: number;
      inReviewRequests: number;
      proposalsReady: number;
      completedRequests: number;
      activeProjects: number;
    };
    recentRequests: any[];
    notifications: any[];
  } | null>(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const email = session?.user?.email || '';
        const userId = session?.user?.id || '';
        const params = new URLSearchParams();
        if (email) params.append('email', email);
        if (userId) params.append('userId', userId);
        const res = await fetch(`/api/dashboard/overview?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setOverview(json.data);
          }
        }
      } catch (e) {
        console.error('Failed to load dashboard overview:', e);
      }
    }
    loadOverview();
  }, [session?.user?.email, session?.user?.id]);

  const dynamicTiles = [
    {
      ...SUMMARY_TILES[0],
      value: String(overview?.counts?.activeProjects ?? 2).padStart(2, '0'),
    },
    {
      ...SUMMARY_TILES[1],
      value: String(
        (overview?.counts?.newRequests ?? 0) +
        (overview?.counts?.inReviewRequests ?? 0) || 2
      ).padStart(2, '0'),
      subText: overview?.counts?.newRequests
        ? `${overview.counts.newRequests} awaiting art director`
        : SUMMARY_TILES[1].subText,
    },
    {
      ...SUMMARY_TILES[2],
      value: String(overview?.counts?.proposalsReady ?? 1).padStart(2, '0'),
    },
    {
      ...SUMMARY_TILES[3],
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 4.2 Page Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          {/* Subtle luminous pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-wide text-neutral-700">Client Creative Studio</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span className="text-neutral-500 font-normal">Active Session</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] sm:text-4xl">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-[#141413] via-[#312E81] to-[#4F46E5] bg-clip-text text-transparent">
              {firstName}
            </span>
            .
          </h2>
          <p className="mt-1.5 text-base text-[#5A5852]">
            You have{' '}
            <span className="inline-flex items-center gap-1 rounded-md bg-[#D9480F]/10 px-2 py-0.5 text-xs font-bold text-[#D9480F]">
              <Flame size={12} className="inline" /> 3 items
            </span>{' '}
            that need your decision or review today.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/requests"
            className="inline-flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white/70 px-4 py-2.5 text-xs font-bold text-neutral-700 backdrop-blur-md shadow-xs transition hover:bg-white hover:text-neutral-900 hover:shadow-sm"
          >
            <span>View requests</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/dashboard/requests/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/30"
          >
            <Sparkles size={14} />
            <span>New creative brief</span>
          </Link>
        </div>
      </section>

      {/* 4.3 Needs Your Attention Queue (Frosted Glass with Luminous Aura) */}
      <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        {/* Amber luminous radial glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gradient-to-br from-[#F59E0B]/25 via-[#D9480F]/18 to-transparent blur-3xl" />
        {/* Left vertical gradient accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#D9480F] via-[#F59E0B] to-[#D9480F]" />

        {/* Queue Header */}
        <div className="flex items-center justify-between border-b border-white/60 px-6 py-4 bg-gradient-to-r from-[#FFF8F2]/90 via-white/40 to-transparent">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9480F] opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#D9480F] ring-2 ring-white" />
            </span>
            <h3 className="text-base font-bold text-[#141413]">Needs your attention</h3>
          </div>
          <span className="rounded-full border border-[#D9480F]/20 bg-[#D9480F]/10 px-3 py-1 text-xs font-bold text-[#D9480F] shadow-xs">
            {ATTENTION_QUEUE.length} actions waiting
          </span>
        </div>

        {/* Queue Rows */}
        <div className="divide-y divide-black/[0.05]">
          {ATTENTION_QUEUE.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 transition-all duration-200 hover:bg-white/80"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#FFF0E6] to-[#FED7AA] text-[#C2410C] shadow-xs ring-1 ring-[#D9480F]/20 group-hover:scale-105 transition-transform">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[#141413] group-hover:text-[#4F46E5] transition-colors">
                        {item.title}
                      </h4>
                      <span className="rounded-full border border-[#D9480F]/15 bg-[#FBF0E6] px-2 py-0.5 text-[10px] font-mono font-bold text-[#9A3412]">
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5A5852]">{item.context}</p>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#D9480F]">
                      <Clock size={12} /> {item.urgency}
                    </span>
                  </div>
                </div>

                <Link
                  href={item.actionHref}
                  className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 self-start sm:self-auto rounded-xl px-4 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#4F46E5] ${
                    item.primary
                      ? 'bg-gradient-to-r from-[#141413] to-[#2B2927] text-white shadow-xs hover:shadow-md hover:scale-[1.02] hover:from-neutral-900 hover:to-neutral-800'
                      : 'border border-black/[0.08] bg-white/90 text-[#141413] shadow-xs hover:border-[#4F46E5]/40 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4.4 Interactive Summary Tiles (Frosted Glass with Chromatic Icon Badges) */}
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {dynamicTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.id}
              href={tile.href}
              className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/60 backdrop-blur-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(79,70,229,0.1)] hover:border-[#4F46E5]/40 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            >
              {/* Subtle hover gradient bloom */}
              <div
                className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  tile.colorScheme === 'indigo'
                    ? 'bg-indigo-500/15'
                    : tile.colorScheme === 'cyan'
                    ? 'bg-cyan-500/15'
                    : tile.colorScheme === 'amber'
                    ? 'bg-amber-500/20'
                    : 'bg-rose-500/15'
                }`}
              />

              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {tile.label}
                </span>
                <span
                  className={`grid h-8 w-8 place-items-center rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-110 ${
                    tile.colorScheme === 'indigo'
                      ? 'bg-[#EEF2FF] text-[#4F46E5] ring-1 ring-[#4F46E5]/20'
                      : tile.colorScheme === 'cyan'
                      ? 'bg-[#ECFEFF] text-[#0891B2] ring-1 ring-[#0891B2]/20'
                      : tile.colorScheme === 'amber'
                      ? 'bg-[#FFFBEB] text-[#D97706] ring-1 ring-[#D97706]/20'
                      : 'bg-[#FFF1F2] text-[#E11D48] ring-1 ring-[#E11D48]/20'
                  }`}
                >
                  <Icon size={16} />
                </span>
              </div>

              <p
                className={`mt-4 text-3xl font-extrabold tracking-tight font-sans tabular-nums ${
                  tile.needsAction ? 'text-[#D9480F]' : 'text-[#141413]'
                }`}
              >
                {tile.value}
              </p>
              <p className="mt-1 text-xs text-[#5A5852] line-clamp-1">{tile.subText}</p>
            </Link>
          );
        })}
      </section>

      {/* Main Grid: 8-col Main Column + 4-col Right Rail */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-8 items-start">
        {/* Main Column (8 cols) */}
        <div className="space-y-7 lg:col-span-8">
          {/* Creative Briefs & Project Requests Section (from DB) */}
          {overview?.recentRequests && overview.recentRequests.length > 0 && (
            <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between border-b border-white/60 px-6 py-4 bg-white/40 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#141413]">Your Creative Requests</h3>
                    <p className="mt-0.5 text-xs text-[#5A5852]">
                      Live status of your submitted briefs and custom proposals.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/requests"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/80 px-3.5 py-1.5 text-xs font-bold text-[#4F46E5] shadow-xs backdrop-blur-md transition hover:bg-white hover:underline"
                >
                  <span>View all briefs ({overview.recentRequests.length})</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="divide-y divide-black/[0.05]">
                {overview.recentRequests.map((req: any) => {
                  const att = req.attachments || {};
                  const title =
                    att.projectTitle ||
                    req.message.split('\n')[0].replace(/^\[Project:\s*/, '').replace(/\]$/, '') ||
                    'Creative Brief';
                  const service = att.serviceNeeded || 'Paid Social & Creative Design';
                  const isNew = req.status === 'NEW';
                  const isAccepted = req.status === 'ACCEPTED' || req.status === 'CONVERTED';

                  return (
                    <div
                      key={req.id}
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 transition hover:bg-white/90"
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full shadow-xs ${
                            isNew
                              ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)]'
                              : isAccepted
                              ? 'bg-emerald-500'
                              : 'bg-[#D9480F]'
                          }`}
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md border border-black/[0.08] bg-black/[0.04] px-2 py-0.5 text-[11px] font-mono font-bold text-neutral-700">
                              REQ-{req.id.slice(-5).toUpperCase()}
                            </span>
                            <h4 className="text-sm font-bold text-[#141413]">{title}</h4>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                isNew
                                  ? 'border border-blue-500/20 bg-blue-50 text-blue-700'
                                  : isAccepted
                                  ? 'border border-emerald-500/20 bg-emerald-50 text-emerald-700'
                                  : 'border border-amber-500/20 bg-amber-50 text-amber-700'
                              }`}
                            >
                              {isNew ? 'Intake Review' : isAccepted ? 'In Production' : req.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#5A5852]">
                            {service} · Budget: <strong className="text-neutral-700">{req.budgetRange || 'Custom'}</strong> · Submitted {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/dashboard/requests/${req.id}`}
                        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 self-start sm:self-auto rounded-xl border border-black/[0.08] bg-white px-4 text-xs font-semibold text-[#141413] shadow-xs transition hover:border-[#4F46E5]/40 hover:bg-neutral-50"
                      >
                        <span>View details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4.5 Active Projects (Frosted Glass Container) */}
          <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-white/60 px-6 py-4 bg-white/30 backdrop-blur-md">
              <div>
                <h3 className="text-base font-bold text-[#141413]">Projects in progress</h3>
                <p className="mt-0.5 text-xs text-[#5A5852]">
                  Follow active milestone stages and approve deliverables.
                </p>
              </div>
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/80 bg-white/70 px-3 py-1.5 text-xs font-bold text-[#4F46E5] shadow-xs backdrop-blur-md transition hover:bg-white hover:underline"
              >
                <span>All projects</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="p-6 space-y-5">
              {ACTIVE_PROJECTS.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-xs backdrop-blur-xl transition-all duration-200 hover:border-[#4F46E5]/30 hover:bg-white/80 hover:shadow-sm"
                >
                  {/* Project Card Header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-black/[0.08] bg-black/[0.04] px-2 py-0.5 text-xs font-mono font-bold text-neutral-700">
                          {proj.code}
                        </span>
                        <h4 className="text-base font-bold text-[#141413]">{proj.name}</h4>
                      </div>
                      <p className="mt-1 text-xs text-[#5A5852]">{proj.service}</p>
                    </div>

                    {/* Status Chip */}
                    <span
                      className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
                        proj.statusTone === 'attention'
                          ? 'border border-[#D9480F]/20 bg-[#D9480F]/10 text-[#D9480F]'
                          : 'border border-blue-500/20 bg-blue-50/90 text-blue-700'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          proj.statusTone === 'attention'
                            ? 'bg-[#D9480F] animate-ping'
                            : 'bg-blue-600'
                        }`}
                      />
                      {proj.status}
                    </span>
                  </div>

                  {/* Stage Stepper */}
                  <div className="mt-6 mb-4">
                    <StageStepper currentStage={proj.currentStage} />
                  </div>

                  {/* Milestone, Team & Action Footer */}
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-black/[0.05] pt-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-[#141413]">{proj.milestone}</span>
                        <span className="text-neutral-400">•</span>
                        <span
                          className={`font-bold ${
                            proj.dueUrgent ? 'text-[#D9480F]' : 'text-neutral-600'
                          }`}
                        >
                          {proj.dueDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        <span>{proj.progressLabel}</span>
                        <span className="text-neutral-300">|</span>
                        <span>Team: {proj.team.join(', ')}</span>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/projects/${proj.id}`}
                      className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition-all ${
                        proj.actionPrimary
                          ? 'bg-gradient-to-r from-[#141413] to-[#2B2927] text-white shadow-xs hover:shadow-md hover:scale-[1.02]'
                          : 'border border-black/[0.08] bg-white text-[#141413] shadow-xs hover:border-[#4F46E5]/40 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{proj.actionLabel}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4.6 Latest Deliverables Strip (Rich Creative Previews with Real Artworks) */}
          <section className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#141413]">Latest deliverables</h3>
                <p className="mt-0.5 text-xs text-[#5A5852]">
                  Released creative drafts ready for your review or download.
                </p>
              </div>
              <Link
                href="/dashboard/files"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:underline"
              >
                <span>All files</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DELIVERABLES.map((del) => (
                <div
                  key={del.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.06] bg-white/80 backdrop-blur-md shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#4F46E5]/40 hover:bg-white hover:shadow-lg"
                >
                  {/* Creative Artwork Preview Thumbnail */}
                  <div className="relative h-36 w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={del.image}
                      alt={del.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Top Badges over image */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono font-bold text-white backdrop-blur-md">
                        {del.version}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md shadow-xs ${
                          del.status === 'Approved'
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-amber-500/90 text-white'
                        }`}
                      >
                        {del.status}
                      </span>
                    </div>

                    {/* Media Type Icon Badge */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                        {del.type === 'video' ? (
                          <>
                            <Play size={11} className="text-amber-400" /> Video Hook
                          </>
                        ) : (
                          <>Static Ad</>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Creative Content Details */}
                  <div className="p-4">
                    <h5 className="text-sm font-bold text-[#141413] line-clamp-1 group-hover:text-[#4F46E5] transition-colors">
                      {del.title}
                    </h5>
                    <p className="text-xs text-[#5A5852] mt-0.5 line-clamp-1">{del.project}</p>

                    <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-neutral-400">
                        AdsPolisher Pod
                      </span>

                      <Link
                        href={del.href}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-black/[0.04] px-2.5 py-1 text-xs font-bold text-[#4F46E5] transition hover:bg-[#4F46E5] hover:text-white"
                      >
                        {del.action === 'Download' ? (
                          <>
                            <Download size={12} /> Download
                          </>
                        ) : (
                          <>
                            Review <ArrowRight size={12} />
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Rail (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Upcoming Deadlines (Glass Card) */}
          <section className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
              <h3 className="text-sm font-bold text-[#141413]">Upcoming deadlines</h3>
              <Calendar size={16} className="text-[#4F46E5]" />
            </div>

            <div className="mt-4 divide-y divide-black/[0.05]">
              {UPCOMING_DEADLINES.map((dl) => (
                <div key={dl.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <span
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold shrink-0 tabular-nums shadow-xs ${
                      dl.urgent
                        ? 'border border-[#D9480F]/20 bg-[#D9480F]/10 text-[#D9480F]'
                        : 'border border-black/[0.06] bg-black/[0.03] text-neutral-700'
                    }`}
                  >
                    {dl.date}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#141413]">{dl.label}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{dl.project}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity (Glass Card with Timeline) */}
          <section className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
              <h3 className="text-sm font-bold text-[#141413]">Recent activity</h3>
              <Clock size={16} className="text-[#4F46E5]" />
            </div>

            <div className="mt-4 space-y-4">
              {ACTIVITY_GROUPS.map((group) => (
                <div key={group.day} className="space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {group.day}
                  </p>
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-2.5 rounded-xl p-2.5 transition-all ${
                        item.unread
                          ? 'border border-[#D9480F]/25 bg-[#FFF9F5]/90 shadow-xs'
                          : 'hover:bg-white/80'
                      }`}
                    >
                      <span
                        className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                          item.unread
                            ? 'bg-[#D9480F] shadow-[0_0_8px_rgba(217,72,15,0.8)]'
                            : 'bg-neutral-300'
                        }`}
                      />
                      <div className="min-w-0 text-xs leading-relaxed text-[#5A5852]">
                        <p>
                          {item.text}{' '}
                          <Link
                            href={item.href}
                            className="font-bold text-[#141413] hover:text-[#4F46E5] hover:underline"
                          >
                            {item.entity}
                          </Link>
                        </p>
                        <span className="text-[10px] text-neutral-400 mt-0.5 block">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Recent Messages Card (Glass Card) */}
          <section className="rounded-3xl border border-white/80 bg-white/60 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
              <h3 className="text-sm font-bold text-[#141413]">Creative Team Chat</h3>
              <MessageSquare size={16} className="text-[#4F46E5]" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-black/[0.06] bg-white/60 p-3.5 text-xs leading-relaxed backdrop-blur-md shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="h-7 w-7 overflow-hidden rounded-full ring-1 ring-black/10 bg-[#E0E7FF]">
                      <Image
                        src="/team/headshot-1.svg"
                        alt="Maya"
                        width={28}
                        height={28}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#141413] truncate">Maya (Art Director)</span>
                      <span className="text-[10px] text-neutral-400">2h ago</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 block">Lead Motion Designer</span>
                  </div>
                </div>

                <p className="text-neutral-700 mt-2.5 line-clamp-2 italic bg-[#FAF9F5] p-2 rounded-lg border border-black/[0.04]">
                  &ldquo;Updated v2 exports for 4:5 lifestyle feed ads are ready in your review
                  queue.&rdquo;
                </p>
              </div>

              <Link
                href="/dashboard/messages"
                className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-white/80 px-3.5 py-2 text-xs font-bold text-[#4F46E5] shadow-xs backdrop-blur-md transition hover:bg-white hover:underline"
              >
                <span>Open team messenger</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </section>

          {/* Help & Support Card (Deep Aurora Glass Card) */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#141413] via-[#1E1B4B] to-[#312E81] p-6 text-white shadow-xl">
            {/* Luminous glow circles */}
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#FDE68A]" />
                <h4 className="text-sm font-bold">Need custom campaign support?</h4>
              </div>
              <p className="mt-2 text-xs text-white/80 leading-relaxed">
                Have questions about briefs, rush turnaround times, or custom production quotes?
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href="/dashboard/messages"
                  className="inline-flex h-8 items-center justify-center rounded-xl bg-white px-3.5 text-xs font-bold text-[#141413] shadow-md transition hover:bg-neutral-100 hover:scale-[1.02]"
                >
                  Message team
                </Link>
                <a
                  href="mailto:support@adspolisher.com"
                  className="text-xs text-white/80 hover:text-white underline underline-offset-2"
                >
                  Email support
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
