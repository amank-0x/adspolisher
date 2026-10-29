'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Globe,
  Building,
  User,
  Mail,
  Calendar,
  DollarSign,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Share2,
} from 'lucide-react';

interface RequestDetail {
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerRequestDetailPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRequest() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/requests/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to load request (${res.status})`);
        }
        const json = await res.json();
        if (json.success && json.data) {
          if (isMounted) setRequest(json.data);
        } else {
          throw new Error(json.message || 'Request not found');
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Error fetching request details');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRequest();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-[#4F46E5]" />
        <p className="text-sm font-semibold text-neutral-600">Retrieving creative brief details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-[#141413]">Creative Brief Not Found</h2>
        <p className="mt-2 text-sm text-[#5A5852]">
          {error || `Unable to load brief with ID ${id}. It may have been archived or moved.`}
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/requests"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20"
          >
            <ArrowLeft size={16} />
            <span>Back to all requests</span>
          </Link>
        </div>
      </div>
    );
  }

  const attachments = request.attachments || {};
  const projectTitle = attachments.projectTitle || 'Custom Creative Request';
  const serviceNeeded = attachments.serviceNeeded || 'Paid Social & Creative Design';
  const targetPlatforms = attachments.targetPlatforms || [];
  const submittedDate = new Date(request.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/requests"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.08] bg-white/80 text-neutral-600 backdrop-blur-md shadow-xs transition hover:bg-white hover:text-neutral-900"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-black/[0.08] bg-black/[0.04] px-2 py-0.5 text-xs font-mono font-bold text-neutral-700">
                REQ-{request.id.slice(-6).toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-50/90 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                {request.status === 'NEW' ? 'Intake Review' : request.status}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#141413]">
              {projectTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/messages"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/[0.08] bg-white/80 px-4 text-xs font-bold text-neutral-700 backdrop-blur-md shadow-xs transition hover:bg-white hover:text-neutral-900"
          >
            <MessageSquare size={14} className="text-[#4F46E5]" />
            <span>Chat with Pod</span>
          </Link>
          <Link
            href="/dashboard/requests/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:scale-[1.02]"
          >
            <Sparkles size={14} />
            <span>New Brief</span>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 Cols) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Workflow Stepper */}
          <div className="rounded-3xl border border-white/80 bg-white/75 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Request Lifecycle
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">1. Brief Submitted</p>
                  <p className="text-[11px] text-neutral-500">{submittedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-indigo-100 text-[#4F46E5] font-bold text-xs animate-pulse">
                  2
                </div>
                <div>
                  <p className="text-xs font-bold text-[#4F46E5]">2. Pod Review</p>
                  <p className="text-[11px] text-neutral-500">In Progress (~24h)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-50">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-500 font-bold text-xs">
                  3
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-700">3. Proposal Ready</p>
                  <p className="text-[11px] text-neutral-400">Fixed quote & scope</p>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-50">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-500 font-bold text-xs">
                  4
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-700">4. Kickoff</p>
                  <p className="text-[11px] text-neutral-400">Sprint production</p>
                </div>
              </div>
            </div>
          </div>

          {/* Brief Overview */}
          <div className="rounded-3xl border border-white/80 bg-white/75 p-7 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)] space-y-6">
            <div>
              <span className="inline-block rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-[#4F46E5]">
                {serviceNeeded}
              </span>
              <h2 className="mt-3 text-xl font-extrabold text-[#141413]">
                Project Scope &amp; Target Platforms
              </h2>
            </div>

            {targetPlatforms.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                  Target Advertising Channels
                </h4>
                <div className="flex flex-wrap gap-2">
                  {targetPlatforms.map((plat) => (
                    <span
                      key={plat}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-bold text-neutral-800 shadow-xs"
                    >
                      <Sparkles size={13} className="text-[#4F46E5]" />
                      {plat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign Goals */}
            {request.goals && (
              <div className="rounded-2xl border border-indigo-100 bg-[#EEF2FF]/40 p-4.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] mb-1">
                  Primary Campaign Objective
                </h4>
                <p className="text-sm font-semibold text-neutral-800">{request.goals}</p>
              </div>
            )}

            {/* Creative Brief */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Detailed Creative Brief
              </h4>
              <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-5 text-sm leading-relaxed text-neutral-800 whitespace-pre-wrap">
                {request.message}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Key Parameters */}
          <div className="rounded-3xl border border-white/80 bg-white/75 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)] space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Budget &amp; Schedule
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
                <span className="flex items-center gap-2 text-xs text-neutral-500">
                  <DollarSign size={15} className="text-neutral-400" />
                  Budget Scope
                </span>
                <span className="text-xs font-bold text-[#141413]">
                  {request.budgetRange || 'Custom Fixed Quote'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
                <span className="flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar size={15} className="text-neutral-400" />
                  Desired Delivery
                </span>
                <span className="text-xs font-bold text-[#141413]">
                  {request.desiredDeadline
                    ? new Date(request.desiredDeadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Standard Sprint (48-72h)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-neutral-500">
                  <Clock size={15} className="text-neutral-400" />
                  Submitted On
                </span>
                <span className="text-xs font-medium text-neutral-700">{submittedDate}</span>
              </div>
            </div>
          </div>

          {/* Client Identity */}
          <div className="rounded-3xl border border-white/80 bg-white/75 p-6 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Client &amp; Organization
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-neutral-100 text-neutral-600">
                  <User size={15} />
                </div>
                <div>
                  <p className="font-bold text-neutral-900">{request.name}</p>
                  <p className="text-neutral-500">{request.email}</p>
                </div>
              </div>

              {request.companyName && (
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-neutral-100 text-neutral-600">
                    <Building size={15} />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{request.companyName}</p>
                    {request.companyWebsite && (
                      <a
                        href={request.companyWebsite.startsWith('http') ? request.companyWebsite : `https://${request.companyWebsite}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#4F46E5] hover:underline flex items-center gap-1 text-[11px]"
                      >
                        {request.companyWebsite.replace(/^https?:\/\//, '')}
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Creative Pod Guarantee */}
          <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-purple-50/40 p-6 backdrop-blur-xl shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4F46E5]">
              <ShieldCheck size={16} />
              <span>Assigned Art Direction Pod #4</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              Senior motion &amp; visual specialists are currently analyzing your brief. Your scoped proposal with deliverable breakdowns and timeline will be ready within 24 hours.
            </p>
            <div className="mt-4 pt-4 border-t border-indigo-100/60 flex items-center justify-between text-xs font-bold text-neutral-700">
              <span>SLA Target</span>
              <span className="text-[#4F46E5]">Under 24 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
