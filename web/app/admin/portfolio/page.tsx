"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  Sparkles,
  Search,
  RefreshCw,
  ExternalLink,
  Mail,
  CheckCircle2,
  Calendar,
  FileCheck2,
  ArrowRight,
  Shield,
  Play,
  Clock,
  X,
  Layers,
  Palette,
  ChevronRight,
  UserCheck,
} from "lucide-react";

type ProjectSummary = {
  id: string;
  projectCode: string;
  title: string;
  brief?: string;
  status: string;
  dueDate: string | null;
  completedAt?: string | null;
  createdAt?: string;
  roleTitle?: string | null;
  deliverablesCount?: number;
  client?: {
    id?: string;
    name: string;
    email: string;
  };
};

type DeliverableItem = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  previewUrl: string | null;
  version: number;
  status: string;
  createdAt: string;
  project?: {
    id: string;
    projectCode: string;
    title: string;
    status: string;
  };
};

type CreatorListItem = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  appRole: string;
  emailVerified: boolean;
  createdAt: string;
  totalProjects: number;
  activeProjectsCount: number;
  deliverablesCount: number;
  currentProjects: {
    id: string;
    projectCode: string;
    title: string;
    status: string;
    dueDate: string | null;
    roleTitle?: string | null;
  }[];
};

type CreatorPortfolioDetail = {
  creator: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    appRole: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  stats: {
    totalProjects: number;
    activeProjectsCount: number;
    completedProjectsCount: number;
    deliverablesCount: number;
  };
  activeProjects: ProjectSummary[];
  projectHistory: ProjectSummary[];
  deliverables: DeliverableItem[];
};

const STATUS_PILLS: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  INTAKE: { label: "Intake", bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" },
  PLANNED: { label: "Planned", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  IN_PROGRESS: { label: "Ongoing", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500 animate-pulse" },
  IN_REVIEW: { label: "Internal QA", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  WAITING_FOR_CLIENT: { label: "Client Review", bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  COMPLETED: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  ON_HOLD: { label: "On Hold", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
};

function AdminPortfolioInner() {
  const [creators, setCreators] = useState<CreatorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "IDLE">("ALL");

  // Selected creator for detailed portfolio modal
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [portfolioDetail, setPortfolioDetail] = useState<CreatorPortfolioDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailTab, setDetailTab] = useState<"PROJECTS" | "DELIVERABLES" | "HISTORY" | "ACCOUNT">("PROJECTS");

  const loadCreators = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCreators(data.data);
      }
    } catch (err) {
      console.error("[LOAD PORTFOLIO CREATORS ERROR]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCreators();
  }, []);

  // Fetch detailed portfolio when a creator is selected
  const openCreatorPortfolio = async (creatorId: string) => {
    setSelectedCreatorId(creatorId);
    setLoadingDetail(true);
    setPortfolioDetail(null);
    setDetailTab("PROJECTS");

    try {
      const res = await fetch(`/api/admin/portfolio/${creatorId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setPortfolioDetail(data.data);
      }
    } catch (err) {
      console.error("[LOAD CREATOR PORTFOLIO DETAIL ERROR]", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closePortfolio = () => {
    setSelectedCreatorId(null);
    setPortfolioDetail(null);
  };

  // Filtered creators list
  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      if (filter === "ACTIVE" && c.activeProjectsCount === 0) return false;
      if (filter === "IDLE" && c.activeProjectsCount > 0) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [creators, filter, search]);

  // High-level statistics
  const metrics = useMemo(() => {
    const total = creators.length;
    const active = creators.filter((c) => c.activeProjectsCount > 0).length;
    const idle = total - active;
    const totalDeliverables = creators.reduce((acc, c) => acc + c.deliverablesCount, 0);
    return { total, active, idle, totalDeliverables };
  }, [creators]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#4F46E5]">
            <Sparkles className="h-3.5 w-3.5" /> Creator Talent &amp; Creative Showcase
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
            Creator Portfolios
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Browse all certified agency creators, inspect active contract pods, explore creative deliverables, and review talent history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadCreators();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-black"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Creators</span>
            <Users className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <p className="mt-3 text-2xl font-black text-neutral-950">{metrics.total}</p>
          <span className="text-[11px] text-neutral-500">Certified creative specialists</span>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">In Production</span>
            <Play className="h-4 w-4 text-indigo-600 fill-indigo-600" />
          </div>
          <p className="mt-3 text-2xl font-black text-indigo-600">{metrics.active}</p>
          <span className="text-[11px] text-neutral-500">Assigned to active contracts</span>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Available Capacity</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-600">{metrics.idle}</p>
          <span className="text-[11px] text-neutral-500">Ready for new project pods</span>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Deliverables</span>
            <FileCheck2 className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-3 text-2xl font-black text-purple-600">{metrics.totalDeliverables}</p>
          <span className="text-[11px] text-neutral-500">Produced artwork &amp; assets</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-black/[0.08] bg-white/85 p-4 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filter === "ALL"
                ? "bg-[#4F46E5] text-white shadow-sm"
                : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80"
            }`}
          >
            All Creators ({creators.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("ACTIVE")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filter === "ACTIVE"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80"
            }`}
          >
            In Active Pods ({metrics.active})
          </button>
          <button
            type="button"
            onClick={() => setFilter("IDLE")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filter === "IDLE"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80"
            }`}
          >
            Available ({metrics.idle})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search creator name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/90 pl-9 pr-4 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
          />
        </div>
      </div>

      {/* Creators Directory Grid */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-white/60 p-12">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-[#4F46E5]" />
            <p className="text-xs font-medium text-neutral-500">Loading creator portfolios…</p>
          </div>
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-neutral-400" />
          <h3 className="mt-3 text-base font-bold text-neutral-900">No creators found</h3>
          <p className="mt-1 text-xs text-neutral-500">
            {search || filter !== "ALL"
              ? "No creators match your current filter or search criteria."
              : "Registered and approved creators will automatically appear here."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCreators.map((creator) => {
            const hasActive = creator.activeProjectsCount > 0;

            return (
              <article
                key={creator.id}
                onClick={() => openCreatorPortfolio(creator.id)}
                className="group flex cursor-pointer flex-col justify-between rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md"
              >
                <div>
                  {/* Top Bar: Role badge & Availability */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-purple-700">
                      CREATOR
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        hasActive
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          hasActive ? "bg-indigo-500 animate-pulse" : "bg-emerald-500"
                        }`}
                      />
                      {hasActive ? `${creator.activeProjectsCount} Active Contract` : "Available"}
                    </span>
                  </div>

                  {/* Creator Avatar & Info */}
                  <div className="mt-4 flex items-center gap-3.5">
                    <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#4F46E5]/10 text-lg font-bold text-[#4F46E5] ring-2 ring-black/[0.04]">
                      {creator.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={creator.image}
                          alt={creator.name}
                          className="h-full w-full rounded-2xl object-cover"
                        />
                      ) : (
                        (creator.name || creator.email || "C").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-bold text-neutral-950 transition group-hover:text-[#4F46E5]">
                        {creator.name || "Creator"}
                      </h2>
                      <p className="truncate text-xs text-neutral-500">{creator.email}</p>
                      <span className="text-[10px] text-neutral-400">
                        Joined {new Date(creator.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Current Active Projects Preview */}
                  {hasActive && (
                    <div className="mt-4 space-y-1.5 rounded-2xl border border-black/[0.04] bg-neutral-50/70 p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Current Assignment:
                      </span>
                      {creator.currentProjects.map((p) => (
                        <div key={p.id} className="flex items-center justify-between text-xs">
                          <span className="truncate font-semibold text-neutral-800">
                            {p.title}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-500">
                            {p.projectCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-5 border-t border-black/[0.06] pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-neutral-500">
                      <span>
                        <strong className="text-neutral-800">{creator.totalProjects}</strong>{" "}
                        {creator.totalProjects === 1 ? "project" : "projects"}
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="text-neutral-800">{creator.deliverablesCount}</strong>{" "}
                        deliverables
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 font-bold text-[#4F46E5] transition group-hover:translate-x-0.5">
                      View Portfolio <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Detailed Creator Portfolio Modal */}
      {selectedCreatorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 sm:p-6">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/[0.07] bg-neutral-50/80 px-6 py-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-[#4F46E5]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                  Creator Portfolio &amp; Work History
                </h3>
              </div>
              <button
                type="button"
                onClick={closePortfolio}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingDetail ? (
                <div className="flex min-h-[360px] items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-7 w-7 animate-spin text-[#4F46E5]" />
                    <p className="text-xs font-semibold text-neutral-500">
                      Loading creator portfolio…
                    </p>
                  </div>
                </div>
              ) : portfolioDetail ? (
                <>
                  {/* Creator Profile Hero Card */}
                  <div className="flex flex-col gap-5 rounded-3xl border border-black/[0.08] bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#4F46E5]/10 text-2xl font-bold text-[#4F46E5] ring-2 ring-black/[0.05]">
                        {portfolioDetail.creator.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={portfolioDetail.creator.image}
                            alt={portfolioDetail.creator.name}
                            className="h-full w-full rounded-2xl object-cover"
                          />
                        ) : (
                          (portfolioDetail.creator.name || portfolioDetail.creator.email || "C")
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-black text-neutral-950">
                            {portfolioDetail.creator.name || "Creator"}
                          </h2>
                          <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                            {portfolioDetail.creator.appRole}
                          </span>
                          {portfolioDetail.creator.emailVerified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <CheckCircle2 className="h-3 w-3" /> Verified
                            </span>
                          )}
                        </div>
                        <a
                          href={`mailto:${portfolioDetail.creator.email}`}
                          className="mt-1 inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-[#4F46E5]"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {portfolioDetail.creator.email}
                        </a>
                        <p className="text-[11px] text-neutral-400">
                          Agency Member Since{" "}
                          {new Date(portfolioDetail.creator.createdAt).toLocaleDateString(undefined, {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/team`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-[#4F46E5]"
                      >
                        <Users className="h-3.5 w-3.5" /> Manage in Pods
                      </Link>
                      <a
                        href={`mailto:${portfolioDetail.creator.email}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 shadow-xs hover:bg-neutral-50"
                      >
                        <Mail className="h-3.5 w-3.5" /> Email
                      </a>
                    </div>
                  </div>

                  {/* Quick Stat Tiles */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-black/[0.06] bg-neutral-50/70 p-4 text-center">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">
                        Total Contracts
                      </span>
                      <p className="mt-1 text-2xl font-black text-neutral-950">
                        {portfolioDetail.stats.totalProjects}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/[0.06] bg-neutral-50/70 p-4 text-center">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">
                        Ongoing Projects
                      </span>
                      <p className="mt-1 text-2xl font-black text-indigo-600">
                        {portfolioDetail.stats.activeProjectsCount}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/[0.06] bg-neutral-50/70 p-4 text-center">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">
                        Completed
                      </span>
                      <p className="mt-1 text-2xl font-black text-emerald-600">
                        {portfolioDetail.stats.completedProjectsCount}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-black/[0.06] bg-neutral-50/70 p-4 text-center">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">
                        Deliverables
                      </span>
                      <p className="mt-1 text-2xl font-black text-purple-600">
                        {portfolioDetail.stats.deliverablesCount}
                      </p>
                    </div>
                  </div>

                  {/* Portfolio Tab Switcher */}
                  <div className="flex border-b border-black/[0.07] text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setDetailTab("PROJECTS")}
                      className={`pb-3 pr-4 transition ${
                        detailTab === "PROJECTS"
                          ? "border-b-2 border-[#4F46E5] text-[#4F46E5]"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      Active Projects ({portfolioDetail.activeProjects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailTab("DELIVERABLES")}
                      className={`pb-3 px-4 transition ${
                        detailTab === "DELIVERABLES"
                          ? "border-b-2 border-[#4F46E5] text-[#4F46E5]"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      Deliverables Showcase ({portfolioDetail.deliverables.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailTab("HISTORY")}
                      className={`pb-3 px-4 transition ${
                        detailTab === "HISTORY"
                          ? "border-b-2 border-[#4F46E5] text-[#4F46E5]"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      Project History ({portfolioDetail.projectHistory.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailTab("ACCOUNT")}
                      className={`pb-3 pl-4 transition ${
                        detailTab === "ACCOUNT"
                          ? "border-b-2 border-[#4F46E5] text-[#4F46E5]"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      Account Details
                    </button>
                  </div>

                  {/* Tab 1: Current Active Projects */}
                  {detailTab === "PROJECTS" && (
                    <div className="space-y-3">
                      {portfolioDetail.activeProjects.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50/50 p-8 text-center">
                          <FolderKanban className="mx-auto h-8 w-8 text-neutral-400" />
                          <p className="mt-2 text-xs font-semibold text-neutral-700">
                            No ongoing projects right now.
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            This creator has open capacity and can be assigned to new contract pods.
                          </p>
                          <Link
                            href="/admin/team"
                            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:underline"
                          >
                            Assign to a Pod in Team Builder <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      ) : (
                        portfolioDetail.activeProjects.map((proj) => {
                          const statusCfg = STATUS_PILLS[proj.status] || STATUS_PILLS.INTAKE;

                          return (
                            <div
                              key={proj.id}
                              className="flex flex-col justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-xs sm:flex-row sm:items-center"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-neutral-500">
                                    {proj.projectCode}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text}`}
                                  >
                                    <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                                    {statusCfg.label}
                                  </span>
                                  {proj.roleTitle && (
                                    <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-700">
                                      {proj.roleTitle}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-neutral-900">{proj.title}</h4>
                                <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                                  <span>Client: {proj.client?.name || "Client"}</span>
                                  {proj.dueDate && (
                                    <span>
                                      Due: {new Date(proj.dueDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <Link
                                href={`/admin/projects/${proj.id}`}
                                className="inline-flex items-center gap-1 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#4F46E5]"
                              >
                                View Project <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* Tab 2: Deliverables Showcase */}
                  {detailTab === "DELIVERABLES" && (
                    <div className="space-y-3">
                      {portfolioDetail.deliverables.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50/50 p-8 text-center">
                          <FileCheck2 className="mx-auto h-8 w-8 text-neutral-400" />
                          <p className="mt-2 text-xs font-semibold text-neutral-700">
                            No deliverables linked to this creator yet.
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            Creative assets, Figma files, and video edits uploaded on this creator&apos;s
                            contracts will display here.
                          </p>
                        </div>
                      ) : (
                        portfolioDetail.deliverables.map((deliv) => (
                          <div
                            key={deliv.id}
                            className="flex flex-col justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-xs sm:flex-row sm:items-center"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[10px] font-bold text-neutral-700">
                                  v{deliv.version}
                                </span>
                                <h4 className="text-sm font-bold text-neutral-900">{deliv.title}</h4>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                    deliv.status === "APPROVED"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-blue-50 text-blue-700 border border-blue-200"
                                  }`}
                                >
                                  {deliv.status}
                                </span>
                              </div>
                              {deliv.description && (
                                <p className="text-xs text-neutral-600">{deliv.description}</p>
                              )}
                              <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                                {deliv.project && (
                                  <span>
                                    Project: {deliv.project.projectCode} · {deliv.project.title}
                                  </span>
                                )}
                                <span>Uploaded: {new Date(deliv.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <a
                              href={deliv.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-neutral-50 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-100"
                            >
                              Open Asset <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab 3: Project History */}
                  {detailTab === "HISTORY" && (
                    <div className="space-y-3">
                      {portfolioDetail.projectHistory.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50/50 p-8 text-center">
                          <Clock className="mx-auto h-8 w-8 text-neutral-400" />
                          <p className="mt-2 text-xs font-semibold text-neutral-700">
                            No past completed projects yet.
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            When projects this creator contributes to reach completion, they will archive
                            here in their permanent track record.
                          </p>
                        </div>
                      ) : (
                        portfolioDetail.projectHistory.map((proj) => (
                          <div
                            key={proj.id}
                            className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-neutral-50/50 p-4 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-neutral-500">
                                  {proj.projectCode}
                                </span>
                                <h4 className="font-bold text-neutral-900">{proj.title}</h4>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                                  {proj.status}
                                </span>
                              </div>
                              <p className="mt-1 text-neutral-500">Client: {proj.client?.name}</p>
                            </div>
                            <span className="font-medium text-neutral-400">
                              {proj.completedAt
                                ? `Completed ${new Date(proj.completedAt).toLocaleDateString()}`
                                : "Archived"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab 4: Account Details */}
                  {detailTab === "ACCOUNT" && (
                    <div className="rounded-2xl border border-black/[0.06] bg-neutral-50/60 p-5 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <span className="text-neutral-500">Creator System ID</span>
                        <span className="font-mono font-bold text-neutral-800">
                          {portfolioDetail.creator.id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <span className="text-neutral-500">Email Address</span>
                        <span className="font-medium text-neutral-800">
                          {portfolioDetail.creator.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <span className="text-neutral-500">Role Authority</span>
                        <span className="font-bold text-purple-700">
                          {portfolioDetail.creator.appRole}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                        <span className="text-neutral-500">Email Verification</span>
                        <span
                          className={`font-semibold ${
                            portfolioDetail.creator.emailVerified
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {portfolioDetail.creator.emailVerified ? "Verified" : "Pending Verification"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Account Created</span>
                        <span className="font-medium text-neutral-800">
                          {new Date(portfolioDetail.creator.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPortfolioPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[400px] items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin text-[#4F46E5]" /></div>}>
      <AdminPortfolioInner />
    </Suspense>
  );
}
