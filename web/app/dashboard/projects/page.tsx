'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  ArrowRight,
  Search,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { StageStepper } from '@/components/dashboard/StageStepper';

type ProjectFilter = 'ALL' | 'ACTIVE' | 'REVIEW' | 'COMPLETED';

const PROJECTS = [
  {
    id: 'proj-1988',
    code: 'AP-1988',
    name: 'Display Retargeting Suite',
    service: 'Display Ads · 6 banner formats',
    status: 'Your review',
    statusTone: 'attention',
    currentStage: 4 as const,
    milestone: 'Draft review: 2 responsive banners ready for your signoff',
    dueDate: '2 drafts awaiting review',
    dueUrgent: true,
    progressLabel: '4 of 6 formats exported',
    team: ['Liam (Designer)', 'Sarah (Director)'],
    actionLabel: 'Review drafts',
    actionHref: '/dashboard/projects/proj-1988',
    actionPrimary: true,
  },
  {
    id: 'proj-2041',
    code: 'AP-2041',
    name: 'Q4 Meta Performance Ads',
    service: 'Paid Social · 10 static creatives + 4 video hooks',
    status: 'In production',
    statusTone: 'info',
    currentStage: 3 as const,
    milestone: 'Production sprint: Pod finalizing first 4:5 exports',
    dueDate: 'First drafts due Nov 02',
    dueUrgent: false,
    progressLabel: '3 of 10 creatives staged',
    team: ['Maya (Motion)', 'Dev (Art Lead)'],
    actionLabel: 'Open workspace',
    actionHref: '/dashboard/projects/proj-2041',
    actionPrimary: false,
  },
  {
    id: 'proj-1890',
    code: 'AP-1890',
    name: 'Summer SaaS Product Launch',
    service: 'Motion Graphics & Product UI Showcase',
    status: 'Completed',
    statusTone: 'success',
    currentStage: 5 as const,
    milestone: 'Delivered and approved on Sep 14, 2026',
    dueDate: 'Delivered',
    dueUrgent: false,
    progressLabel: '100% complete (8 deliverables)',
    team: ['Maya (Motion)', 'Liam (Design)'],
    actionLabel: 'View deliverables',
    actionHref: '/dashboard/files',
    actionPrimary: false,
  },
];

export default function CustomerProjectsListPage() {
  const [filter, setFilter] = useState<ProjectFilter>('ALL');
  const [query, setQuery] = useState('');

  const filtered = PROJECTS.filter((proj) => {
    if (filter === 'ACTIVE' && (proj.currentStage === 5)) return false;
    if (filter === 'REVIEW' && proj.statusTone !== 'attention') return false;
    if (filter === 'COMPLETED' && proj.currentStage !== 5) return false;
    if (query.trim() && !proj.name.toLowerCase().includes(query.toLowerCase()) && !proj.code.toLowerCase().includes(query.toLowerCase())) {
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
            <span>Creative Projects</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>2 Active In-Flight</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413]">
            Projects in Production
          </h2>
          <p className="mt-1 text-sm text-[#5A5852]">
            Track delivery stages, inspect creative iterations, and provide milestone approvals.
          </p>
        </div>

        <Link
          href="/dashboard/requests/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#141413] to-[#2B2927] px-5 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] hover:from-neutral-900 hover:to-neutral-800"
        >
          <Plus size={16} />
          <span>Start new project</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'ALL', label: 'All projects' },
              { id: 'ACTIVE', label: 'Active in-flight (2)' },
              { id: 'REVIEW', label: 'Needs your review (1)' },
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

        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search projects…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-black/[0.06] bg-white/70 pl-9 pr-4 py-2 text-xs text-neutral-800 placeholder-neutral-400 backdrop-blur-md shadow-xs focus:border-[#4F46E5] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-6">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="group relative overflow-hidden rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(20,20,19,0.04)] transition-all duration-300 hover:border-[#4F46E5]/40 hover:bg-white hover:shadow-lg"
          >
            {/* Project Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] text-[#4F46E5] shadow-xs ring-1 ring-[#4F46E5]/20 group-hover:scale-105 transition-transform">
                  <FolderKanban size={22} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="rounded-md border border-black/[0.08] bg-black/[0.04] px-2 py-0.5 text-xs font-mono font-bold text-neutral-700">
                      {proj.code}
                    </span>
                    <h3 className="text-lg font-bold text-[#141413] group-hover:text-[#4F46E5] transition-colors">
                      {proj.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-[#5A5852]">{proj.service}</p>
                </div>
              </div>

              {/* Status Chip */}
              <span
                className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
                  proj.statusTone === 'attention'
                    ? 'border border-[#D9480F]/20 bg-[#D9480F]/10 text-[#D9480F]'
                    : proj.statusTone === 'info'
                    ? 'border border-blue-500/20 bg-blue-50/90 text-blue-700'
                    : 'border border-emerald-500/20 bg-emerald-50/90 text-emerald-700'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    proj.statusTone === 'attention'
                      ? 'bg-[#D9480F] animate-ping'
                      : proj.statusTone === 'info'
                      ? 'bg-blue-600'
                      : 'bg-emerald-600'
                  }`}
                />
                {proj.status}
              </span>
            </div>

            {/* Stage Stepper Visualizer */}
            <div className="my-6 px-1 sm:px-4">
              <StageStepper currentStage={proj.currentStage} />
            </div>

            {/* Milestone Info & Action Footer */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-black/[0.06] pt-4">
              <div className="space-y-1">
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
                  <span className="inline-flex items-center gap-1">
                    <Users size={12} className="text-neutral-400" />
                    {proj.team.join(', ')}
                  </span>
                </div>
              </div>

              <Link
                href={proj.actionHref}
                className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-xs font-bold transition-all shadow-xs ${
                  proj.actionPrimary
                    ? 'bg-gradient-to-r from-[#D9480F] to-[#EA580C] text-white hover:shadow-md hover:scale-[1.02]'
                    : 'border border-black/[0.08] bg-white text-[#141413] hover:border-[#4F46E5]/40 hover:bg-neutral-50 hover:shadow-sm'
                }`}
              >
                <span>{proj.actionLabel}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
