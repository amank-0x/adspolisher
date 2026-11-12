"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { creatorFetch } from "@/lib/creator-api";
import {
  Sparkles,
  FolderKanban,
  CheckCircle2,
  Clock,
  Layers,
  ExternalLink,
  RefreshCw,
  Search,
  Calendar,
  FileCheck2,
  FileText,
  AlertCircle,
  Eye,
  ArrowRight,
  UserCheck,
  MapPin,
  Wrench,
  Activity,
  Award,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

type ProjectItem = {
  id: string;
  projectCode: string;
  title: string;
  brief?: string;
  status: string;
  roleTitle: string;
  startDate?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
  joinedAt?: string | null;
  clientName?: string;
  deliverablesCount: number;
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
  projectCode: string;
  projectTitle: string;
  projectId: string;
};

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  detail: string;
  status: string;
  date: string;
};

type PortfolioData = {
  creator: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    appRole: string;
    createdAt: string;
  };
  craftDetails: {
    craftSpecialty?: string;
    primaryTools?: string;
    experienceLevel?: string;
    weeklyAvailability?: string;
    portfolioUrl?: string;
    secondaryUrl?: string | null;
    location?: string;
    notes?: string | null;
  } | null;
  stats: {
    totalProjects: number;
    ongoingProjects: number;
    completedProjects: number;
    totalDeliverables: number;
    approvedDeliverables: number;
  };
  ongoingProjects: ProjectItem[];
  completedProjects: ProjectItem[];
  allProjects: ProjectItem[];
  deliverables: DeliverableItem[];
  activityTimeline: ActivityItem[];
};

export default function CreatorPortfolioPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ongoing" | "all" | "completed" | "deliverables" | "activity">("ongoing");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await creatorFetch("/portfolio", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load portfolio details.");
      }
      setData(json.data);
    } catch (err: any) {
      console.error("Portfolio fetch failed:", err);
      setError(err?.message || "Failed to connect to AdSpolisher servers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const filteredOngoing = useMemo(() => {
    if (!data?.ongoingProjects) return [];
    if (!searchQuery.trim()) return data.ongoingProjects;
    const q = searchQuery.toLowerCase();
    return data.ongoingProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.roleTitle?.toLowerCase().includes(q)
    );
  }, [data?.ongoingProjects, searchQuery]);

  const filteredAll = useMemo(() => {
    if (!data?.allProjects) return [];
    if (!searchQuery.trim()) return data.allProjects;
    const q = searchQuery.toLowerCase();
    return data.allProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q) ||
        p.roleTitle?.toLowerCase().includes(q)
    );
  }, [data?.allProjects, searchQuery]);

  const filteredCompleted = useMemo(() => {
    if (!data?.completedProjects) return [];
    if (!searchQuery.trim()) return data.completedProjects;
    const q = searchQuery.toLowerCase();
    return data.completedProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.roleTitle?.toLowerCase().includes(q)
    );
  }, [data?.completedProjects, searchQuery]);

  const filteredDeliverables = useMemo(() => {
    if (!data?.deliverables) return [];
    if (!searchQuery.trim()) return data.deliverables;
    const q = searchQuery.toLowerCase();
    return data.deliverables.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.projectCode.toLowerCase().includes(q) ||
        d.projectTitle.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q)
    );
  }, [data?.deliverables, searchQuery]);

  const filteredActivity = useMemo(() => {
    if (!data?.activityTimeline) return [];
    if (!searchQuery.trim()) return data.activityTimeline;
    const q = searchQuery.toLowerCase();
    return data.activityTimeline.filter(
      (a) => a.title.toLowerCase().includes(q) || a.detail.toLowerCase().includes(q)
    );
  }, [data?.activityTimeline, searchQuery]);

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "COMPLETED" || s === "APPROVED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={12} />
          {status.replace(/_/g, " ")}
        </span>
      );
    }
    if (s === "IN_PROGRESS" || s === "IN PROGRESS") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
          <Clock size={12} />
          In Progress
        </span>
      );
    }
    if (s === "IN_REVIEW" || s === "REVIEW") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
          <Eye size={12} />
          Under Review
        </span>
      );
    }
    if (s === "CHANGES_REQUESTED" || s === "REJECTED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
          <AlertCircle size={12} />
          Revisions
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700 border border-neutral-200">
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return "CR";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-44 animate-pulse rounded-3xl bg-neutral-200/70" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-neutral-200/60" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-neutral-200/50" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50/50 p-12 text-center">
        <AlertCircle size={40} className="text-rose-500 mb-3" />
        <h3 className="text-lg font-bold text-neutral-900">Unable to load creator portfolio</h3>
        <p className="mt-1 text-sm text-neutral-600 max-w-md">{error}</p>
        <button
          onClick={fetchPortfolio}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-neutral-800 transition"
        >
          <RefreshCw size={14} />
          Retry Connection
        </button>
      </div>
    );
  }

  const { creator, craftDetails, stats } = data!;
  const approvalRate =
    stats.totalDeliverables > 0
      ? Math.round((stats.approvedDeliverables / stats.totalDeliverables) * 100)
      : 100;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Creator Hero & Portfolio Header */}
      <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-white via-white/90 to-indigo-50/40 p-6 sm:p-8 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              {creator.image ? (
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-2xl font-black tracking-wider">
                  {getInitials(creator.name)}
                </div>
              )}
            </div>

            {/* Identity & Badges */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141413]">
                  {creator.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                  <Sparkles size={12} />
                  AdSpolisher Creator
                </span>
                {craftDetails?.experienceLevel && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100/80 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
                    <Award size={12} className="text-amber-500" />
                    {craftDetails.experienceLevel}
                  </span>
                )}
              </div>

              <p className="text-sm text-[#5A5852] flex flex-wrap items-center gap-3">
                <span>{creator.email}</span>
                {craftDetails?.location && (
                  <>
                    <span className="text-neutral-300">·</span>
                    <span className="inline-flex items-center gap-1 text-xs">
                      <MapPin size={12} className="text-neutral-400" />
                      {craftDetails.location}
                    </span>
                  </>
                )}
                <span className="text-neutral-300">·</span>
                <span className="text-xs text-neutral-500">
                  Joined {new Date(creator.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                </span>
              </p>

              {/* Craft tags */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                {craftDetails?.craftSpecialty && (
                  <span className="rounded-lg bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-white">
                    {craftDetails.craftSpecialty}
                  </span>
                )}
                {craftDetails?.primaryTools && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white/80 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    <Wrench size={12} className="text-neutral-400" />
                    {craftDetails.primaryTools}
                  </span>
                )}
                {craftDetails?.weeklyAvailability && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/60 px-2.5 py-1 text-xs font-medium text-emerald-800">
                    <Clock size={12} className="text-emerald-600" />
                    {craftDetails.weeklyAvailability}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons & External Portfolio Links */}
          <div className="flex flex-wrap items-center gap-2.5 md:flex-col md:items-end">
            <div className="flex items-center gap-2">
              {craftDetails?.portfolioUrl && (
                <a
                  href={craftDetails.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 shadow-xs hover:bg-neutral-50 hover:text-indigo-600 transition"
                >
                  <ExternalLink size={13} />
                  <span>Showcase Web</span>
                </a>
              )}
              {craftDetails?.secondaryUrl && (
                <a
                  href={craftDetails.secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition"
                >
                  <ExternalLink size={13} />
                  <span>Extra Link</span>
                </a>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/creator/profile"
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition"
              >
                <span>Edit Profile</span>
                <ChevronRight size={13} />
              </Link>
              <button
                onClick={fetchPortfolio}
                title="Refresh portfolio metrics"
                className="grid h-8 w-8 place-items-center rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 transition shadow-xs"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Portfolio Metric Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {/* Ongoing Projects */}
        <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_4px_20px_rgba(20,20,19,0.03)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Ongoing Projects
            </p>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <FolderKanban size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black tabular-nums text-neutral-900">
            {stats.ongoingProjects.toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">Active creative sprints</p>
        </article>

        {/* Completed Projects */}
        <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_4px_20px_rgba(20,20,19,0.03)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Completed Projects
            </p>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black tabular-nums text-neutral-900">
            {stats.completedProjects.toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">Delivered & verified work</p>
        </article>

        {/* Asset Deliverables */}
        <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_4px_20px_rgba(20,20,19,0.03)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Total Deliverables
            </p>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <Layers size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black tabular-nums text-neutral-900">
            {stats.totalDeliverables.toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">Assets submitted to date</p>
        </article>

        {/* Approval Rate */}
        <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/80 p-5 shadow-[0_4px_20px_rgba(20,20,19,0.03)] backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Approval Rate
            </p>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black tabular-nums text-neutral-900">
            {approvalRate}%
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {stats.approvedDeliverables} assets approved
          </p>
        </article>
      </div>

      {/* 3. Portfolio Tabs & Search Filter */}
      <section className="space-y-5">
        <div className="flex flex-col gap-4 border-b border-black/[0.08] pb-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "ongoing"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
              }`}
            >
              <Clock size={13} />
              <span>Ongoing Projects</span>
              <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === "ongoing" ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"}`}>
                {data?.ongoingProjects.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "all"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
              }`}
            >
              <FolderKanban size={13} />
              <span>All Projects</span>
              <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === "all" ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"}`}>
                {data?.allProjects.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "completed"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
              }`}
            >
              <CheckCircle2 size={13} />
              <span>Completed</span>
              <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === "completed" ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"}`}>
                {data?.completedProjects.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("deliverables")}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "deliverables"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
              }`}
            >
              <Layers size={13} />
              <span>Deliverables</span>
              <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${activeTab === "deliverables" ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-700"}`}>
                {data?.deliverables.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("activity")}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeTab === "activity"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
              }`}
            >
              <Activity size={13} />
              <span>Activity Timeline</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in portfolio..."
              className="w-full rounded-xl border border-neutral-200 bg-white py-1.5 pl-9 pr-3 text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        {/* Tab 1: ONGOING PROJECTS */}
        {activeTab === "ongoing" && (
          <div className="space-y-4">
            {filteredOngoing.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
                <FolderKanban size={36} className="mx-auto text-neutral-400 mb-3" />
                <h4 className="text-base font-bold text-neutral-900">No ongoing projects currently</h4>
                <p className="mt-1 text-xs text-neutral-500 max-w-md mx-auto">
                  When project managers assign you to active creative sprints, they will appear here with briefs, roles, and deadlines.
                </p>
                <Link
                  href="/creator/requests"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition"
                >
                  <span>Check Incoming Requests</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredOngoing.map((p) => (
                  <article
                    key={p.id}
                    className="flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-indigo-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {p.projectCode}
                        </span>
                        {getStatusBadge(p.status)}
                      </div>

                      <h4 className="mt-3 text-base font-bold text-neutral-900 line-clamp-1">
                        {p.title}
                      </h4>

                      {p.brief && (
                        <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                          {p.brief}
                        </p>
                      )}

                      <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-3 text-xs text-neutral-600">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Role:</span>
                          <span className="font-semibold text-neutral-800">{p.roleTitle}</span>
                        </div>
                        {p.dueDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Target Due:</span>
                            <span className="font-medium text-amber-700">
                              {new Date(p.dueDate).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Deliverables:</span>
                          <span className="font-medium text-neutral-700">
                            {p.deliverablesCount} assets
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={`/creator/tasks`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                      >
                        <span>View sprint tasks</span>
                        <ArrowRight size={12} />
                      </Link>
                      <Link
                        href={`/creator/projects`}
                        className="text-xs font-semibold text-neutral-500 hover:text-neutral-800"
                      >
                        Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: ALL PROJECTS */}
        {activeTab === "all" && (
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
            {filteredAll.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <FolderKanban size={32} className="mx-auto text-neutral-300 mb-2" />
                <p className="text-sm font-semibold">No projects matched your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-neutral-200 bg-neutral-50/75 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    <tr>
                      <th className="px-5 py-3">Project</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Due Date</th>
                      <th className="px-4 py-3">Deliverables</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                    {filteredAll.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50/80 transition">
                        <td className="px-5 py-3.5">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mr-1.5">
                              {p.projectCode}
                            </span>
                            <span className="font-bold text-neutral-900">{p.title}</span>
                          </div>
                          {p.brief && (
                            <p className="mt-0.5 text-[11px] text-neutral-400 max-w-sm truncate">
                              {p.brief}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-neutral-600">{p.roleTitle}</td>
                        <td className="px-4 py-3.5">{getStatusBadge(p.status)}</td>
                        <td className="px-4 py-3.5 text-neutral-600">
                          {p.dueDate
                            ? new Date(p.dueDate).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-700">
                            {p.deliverablesCount} files
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href="/creator/projects"
                            className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800"
                          >
                            <span>Open</span>
                            <ArrowRight size={11} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: COMPLETED PROJECTS */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            {filteredCompleted.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
                <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-3" />
                <h4 className="text-base font-bold text-neutral-900">No completed projects yet</h4>
                <p className="mt-1 text-xs text-neutral-500 max-w-md mx-auto">
                  Once project sprints reach final sign-off and wrap up, your archived accomplishments will be showcased here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredCompleted.map((p) => (
                  <article
                    key={p.id}
                    className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/20 p-5 shadow-xs transition hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {p.projectCode}
                        </span>
                        {getStatusBadge(p.status)}
                      </div>

                      <h4 className="mt-3 text-base font-bold text-neutral-900 line-clamp-1">
                        {p.title}
                      </h4>

                      {p.brief && (
                        <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2">
                          {p.brief}
                        </p>
                      )}

                      <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-3 text-xs text-neutral-600">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Completed On:</span>
                          <span className="font-semibold text-neutral-800">
                            {p.completedAt
                              ? new Date(p.completedAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Verified"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Shipped Deliverables:</span>
                          <span className="font-semibold text-emerald-700">
                            {p.deliverablesCount} approved assets
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                        <ShieldCheck size={13} />
                        Signed off
                      </span>
                      <Link
                        href="/creator/submissions"
                        className="text-xs font-bold text-neutral-700 hover:text-indigo-600"
                      >
                        View assets
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: DELIVERABLES */}
        {activeTab === "deliverables" && (
          <div className="space-y-4">
            {filteredDeliverables.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
                <Layers size={36} className="mx-auto text-purple-400 mb-3" />
                <h4 className="text-base font-bold text-neutral-900">No creative deliverables uploaded</h4>
                <p className="mt-1 text-xs text-neutral-500 max-w-md mx-auto">
                  When you upload files, draft videos, or design carousels to project sprints, they will appear in your asset showcase.
                </p>
                <Link
                  href="/creator/submissions"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition"
                >
                  <span>Go to Submissions</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDeliverables.map((d) => (
                  <article
                    key={d.id}
                    className="flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs transition hover:shadow-md hover:border-purple-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                          v{d.version} · {d.projectCode}
                        </span>
                        {getStatusBadge(d.status)}
                      </div>

                      <h4 className="mt-3 text-sm font-bold text-neutral-900 line-clamp-1">
                        {d.title}
                      </h4>

                      <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                        {d.description || `Deliverable for ${d.projectTitle}`}
                      </p>

                      <div className="mt-4 text-[11px] text-neutral-400">
                        Uploaded on{" "}
                        {new Date(d.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <a
                        href={d.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <ExternalLink size={12} />
                        <span>Inspect Asset</span>
                      </a>
                      {d.previewUrl && (
                        <a
                          href={d.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-neutral-500 hover:text-neutral-800"
                        >
                          Preview
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: ACTIVITY TIMELINE */}
        {activeTab === "activity" && (
          <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xs backdrop-blur-md">
            {filteredActivity.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                <Activity size={32} className="mx-auto text-neutral-300 mb-2" />
                <p className="text-sm font-semibold">No recent activity recorded yet.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-indigo-100 ml-4 pl-6 space-y-6">
                {filteredActivity.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Circle Indicator */}
                    <div className="absolute -left-[31px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h4 className="text-sm font-bold text-neutral-900">{item.title}</h4>
                      <span className="text-[11px] text-neutral-400">
                        {new Date(item.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-neutral-600">{item.detail}</p>
                    <div className="mt-2">{getStatusBadge(item.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
