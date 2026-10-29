"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ClipboardCheck,
  Clock3,
  FileClock,
  FileText,
  FolderKanban,
  MessageSquareText,
  UserRoundPlus,
  Sparkles,
  Flame,
  Bell,
  RefreshCw,
  ExternalLink,
  Building,
  DollarSign,
  CheckCircle2,
} from "lucide-react";

interface AdminOverviewData {
  counts: {
    newRequests: number;
    inReviewRequests: number;
    proposalsPending: number;
    activeProjects: number;
    totalRequests: number;
    unreadNotifications: number;
  };
  notifications: Array<{
    id: string;
    requestId: string;
    type: string;
    title: string;
    message: string;
    budget: string;
    source: string;
    timestamp: string;
    unread: boolean;
    href: string;
  }>;
  recentRequests: Array<{
    id: string;
    name: string;
    email: string;
    companyName?: string | null;
    companyWebsite?: string | null;
    message: string;
    budgetRange?: string | null;
    source?: string | null;
    status: string;
    createdAt: string;
    attachments?: any;
  }>;
  activeProjects: any[];
  serverTime: string;
}

const DEFAULT_DATA: AdminOverviewData = {
  counts: {
    newRequests: 3,
    inReviewRequests: 1,
    proposalsPending: 3,
    activeProjects: 4,
    totalRequests: 7,
    unreadNotifications: 3,
  },
  notifications: [],
  recentRequests: [],
  activeProjects: [],
  serverTime: new Date().toISOString(),
};

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverviewData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchOverview = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          setLastUpdated(new Date());
        }
      }
    } catch (err) {
      console.error("Failed to load admin overview:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial fetch and 15s interval pinging for real-time notification
  useEffect(() => {
    fetchOverview();
    const interval = setInterval(() => {
      fetchOverview(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchOverview]);

  const pipeline = [
    {
      label: "New requests",
      value: String(data.counts.newRequests).padStart(2, "0"),
      note: "Need initial intake review",
      icon: FileText,
      href: "/admin/requests?status=NEW",
      color: "indigo",
      urgent: data.counts.newRequests > 0,
    },
    {
      label: "Need more info",
      value: String(data.counts.inReviewRequests).padStart(2, "0"),
      note: "Waiting on client replies",
      icon: MessageSquareText,
      href: "/admin/requests?status=IN_REVIEW",
      color: "cyan",
      urgent: false,
    },
    {
      label: "Proposals pending",
      value: String(data.counts.proposalsPending).padStart(2, "0"),
      note: "Awaiting client sign-off",
      icon: FileClock,
      href: "/admin/requests?status=PROPOSAL_READY",
      color: "amber",
      urgent: false,
    },
    {
      label: "Active projects",
      value: String(data.counts.activeProjects).padStart(2, "0"),
      note: "In creative production",
      icon: FolderKanban,
      href: "/admin/projects",
      color: "emerald",
      urgent: false,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles size={13} className="text-[#4F46E5]" />
            <span>Studio Operations Command</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span className="text-[11px] text-neutral-500">
              Live Sync {formatTimeAgo(lastUpdated.toISOString())}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] sm:text-4xl">
            Good day, Studio Admin.
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#5A5852]">
            Monitor new brief requests from the landing page and client workspace, review deliverables, and clear blockers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchOverview(false)}
            disabled={refreshing}
            title="Refresh database records"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.08] bg-white/80 text-neutral-600 backdrop-blur-md shadow-xs transition hover:bg-white hover:text-neutral-900 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin text-[#4F46E5]" : ""} />
          </button>
          <Link
            href="/admin/requests"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/30"
          >
            <FileText size={16} />
            <span>Open request inbox ({data.counts.totalRequests})</span>
          </Link>
        </div>
      </section>

      {/* Live Notification Alert Pill if new requests exist */}
      {data.notifications.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-white/90 p-4.5 backdrop-blur-xl shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#4F46E5] text-white shadow-xs">
                <Bell size={18} className="animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#141413]">
                    {data.notifications.length} New Project Brief{data.notifications.length > 1 ? "s" : ""} Received
                  </span>
                  <span className="rounded-full bg-[#D9480F] px-2 py-0.5 text-[10px] font-extrabold text-white animate-pulse">
                    Action Needed
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-600">
                  Latest: <strong className="text-neutral-800">{data.notifications[0].message}</strong> ({data.notifications[0].budget}) — {formatTimeAgo(data.notifications[0].timestamp)}
                </p>
              </div>
            </div>

            <Link
              href="/admin/requests"
              className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#4F46E5] shadow-xs border border-indigo-100 hover:bg-neutral-50 transition"
            >
              <span>Review Incoming Briefs</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {pipeline.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              href={item.href}
              key={item.label}
              className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                item.urgent
                  ? "border-[#4F46E5]/40 bg-gradient-to-br from-indigo-50/60 to-white/90 shadow-[0_4px_24px_rgba(79,70,229,0.08)]"
                  : "border-white/80 bg-white/75 shadow-[0_4px_20px_rgba(20,20,19,0.03)] hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {item.label}
                </p>
                <span
                  className={`grid h-8 w-8 place-items-center rounded-xl shadow-xs ${
                    item.color === "indigo"
                      ? "bg-[#EEF2FF] text-[#4F46E5]"
                      : item.color === "cyan"
                      ? "bg-[#ECFEFF] text-[#0891B2]"
                      : item.color === "amber"
                      ? "bg-[#FFFBEB] text-[#D97706]"
                      : "bg-[#ECFDF5] text-[#059669]"
                  }`}
                >
                  <Icon size={16} />
                </span>
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight tabular-nums text-[#141413]">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-[#5A5852]">{item.note}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
        {/* Incoming Requests Feed from Database */}
        <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
          <div className="border-b border-black/[0.06] px-6 py-4 bg-white/50 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#141413]">Incoming Project Requests</h3>
                <p className="mt-0.5 text-xs text-[#5A5852]">
                  Real-time submissions from landing page &amp; client dashboard.
                </p>
              </div>
              <Link
                href="/admin/requests"
                className="text-xs font-bold text-[#4F46E5] hover:underline"
              >
                View all ({data.counts.totalRequests})
              </Link>
            </div>
          </div>

          <div className="divide-y divide-black/[0.05]">
            {data.recentRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No project requests submitted yet.
              </div>
            ) : (
              data.recentRequests.slice(0, 5).map((req) => {
                const att = req.attachments || {};
                const service = att.serviceNeeded || "Creative Project";
                const isNew = req.status === "NEW";

                return (
                  <div
                    key={req.id}
                    className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:px-6 transition hover:bg-white/90"
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full shadow-xs ${
                          isNew
                            ? "bg-[#4F46E5] shadow-[0_0_8px_rgba(79,70,229,0.7)] animate-pulse"
                            : "bg-emerald-500"
                        }`}
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-[#141413]">{req.name}</p>
                          {req.companyName && (
                            <span className="text-xs text-neutral-500 font-medium">
                              ({req.companyName})
                            </span>
                          )}
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              req.source === "LANDING_PAGE"
                                ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                            }`}
                          >
                            {req.source === "LANDING_PAGE" ? "Landing Page" : "Dashboard Client"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#5A5852]">
                          {service} · Budget: <strong className="text-neutral-700">{req.budgetRange || "Custom"}</strong> · {formatTimeAgo(req.createdAt)}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/admin/requests?id=${req.id}`}
                      className="inline-flex items-center gap-1.5 self-start rounded-xl border border-black/[0.08] bg-white px-3.5 py-1.5 text-xs font-bold text-[#141413] shadow-xs transition hover:border-[#4F46E5]/40 hover:bg-neutral-50 sm:self-center"
                    >
                      <span>Review Brief</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Creator Recruitment & Ops Events */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
            <div className="flex items-start justify-between border-b border-black/[0.06] pb-3.5">
              <div>
                <h3 className="text-sm font-bold text-[#141413]">Creator Recruitment</h3>
                <p className="mt-0.5 text-[11px] text-neutral-500">Talent pipeline</p>
              </div>
              <UserRoundPlus size={18} className="text-[#4F46E5]" />
            </div>

            <div className="mt-4 grid grid-cols-3 divide-x divide-black/[0.07] rounded-2xl border border-black/[0.06] bg-white/60 py-3 shadow-xs">
              {[
                ["02", "New"],
                ["03", "Shortlisted"],
                ["01", "Onboarding"],
              ].map(([val, label]) => (
                <div key={label} className="px-2 text-center">
                  <p className="text-xl font-extrabold tracking-tight tabular-nums text-[#141413]">
                    {val}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/admin/creator-applications"
              className="mt-4 flex items-center justify-between rounded-xl border border-black/[0.06] bg-white/80 px-4 py-2.5 text-xs font-bold text-[#4F46E5] shadow-xs backdrop-blur-md transition hover:bg-white hover:underline"
            >
              <span className="flex items-center gap-2">
                <BriefcaseBusiness size={15} /> Review applications
              </span>
              <ArrowUpRight size={14} />
            </Link>
          </section>

          <section className="rounded-3xl border border-white/80 bg-white/75 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
            <div className="flex items-center gap-2 border-b border-black/[0.06] pb-3.5">
              <Clock3 size={16} className="text-[#4F46E5]" />
              <h3 className="text-sm font-bold text-[#141413]">Recent Ops Activity</h3>
            </div>
            <div className="mt-4 space-y-3">
              {data.recentRequests.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold text-neutral-800 truncate">
                    Brief from {r.companyName || r.name}
                  </span>
                  <span className="text-neutral-500 shrink-0 text-[11px]">
                    {formatTimeAgo(r.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
