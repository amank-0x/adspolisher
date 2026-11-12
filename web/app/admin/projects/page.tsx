"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  Layers,
  User,
  Users,
  RefreshCw,
  Sparkles,
  Calendar,
  FileCheck2,
} from "lucide-react";
import { backendFetch } from "@/lib/backend-api";

type ProjectStatus =
  | "INTAKE"
  | "PLANNED"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "WAITING_FOR_CLIENT"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

type Project = {
  id: string;
  projectCode: string;
  title: string;
  brief: string;
  status: ProjectStatus;
  budget: number | string | null;
  currency: string;
  dueDate: string | null;
  startDate: string | null;
  completedAt: string | null;
  createdAt: string;
  client: {
    id?: string;
    name: string;
    email: string;
    image?: string | null;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    appRole?: string;
  } | null;
  _count?: {
    deliverables: number;
    messages: number;
  };
};

const STATUS_BADGES: Record<
  ProjectStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  INTAKE: {
    label: "Intake",
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  PLANNED: {
    label: "Planned",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  IN_PROGRESS: {
    label: "Ongoing",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500 animate-pulse",
  },
  IN_REVIEW: {
    label: "Internal QA",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  WAITING_FOR_CLIENT: {
    label: "Client Review",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  ON_HOLD: {
    label: "On Hold",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
};

const FILTER_TABS: { key: string; label: string }[] = [
  { key: "ALL", label: "All Projects" },
  { key: "IN_PROGRESS", label: "Ongoing" },
  { key: "IN_REVIEW", label: "Internal Review" },
  { key: "WAITING_FOR_CLIENT", label: "Client Review" },
  { key: "COMPLETED", label: "Completed" },
  { key: "ON_HOLD", label: "On Hold" },
  { key: "INTAKE", label: "Intake" },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadProjects = async () => {
    try {
      const res = await backendFetch("/api/v1/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("[LOAD PROJECTS ERROR]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter === "ALL" && p.status === "COMPLETED") {
        return false;
      }
      if (statusFilter !== "ALL" && p.status !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesCode = p.projectCode?.toLowerCase().includes(q);
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesClientName = p.client?.name?.toLowerCase().includes(q);
        const matchesClientEmail = p.client?.email?.toLowerCase().includes(q);
        const matchesBrief = p.brief?.toLowerCase().includes(q);
        return matchesCode || matchesTitle || matchesClientName || matchesClientEmail || matchesBrief;
      }
      return true;
    });
  }, [projects, statusFilter, search]);

  // Metric counts
  const metrics = useMemo(() => {
    const total = projects.filter((p) => p.status !== "COMPLETED").length;
    const ongoing = projects.filter((p) => p.status === "IN_PROGRESS").length;
    const review = projects.filter(
      (p) => p.status === "IN_REVIEW" || p.status === "WAITING_FOR_CLIENT"
    ).length;
    const completed = projects.filter((p) => p.status === "COMPLETED").length;
    return { total, ongoing, review, completed };
  }, [projects]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#4F46E5]">
            <Sparkles className="h-3.5 w-3.5" /> Studio Production Pipeline
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
            Projects
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Active creative production orders, deliverables tracking, pod management, and status controls.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void loadProjects();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-black"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Projects</span>
            <FolderKanban className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <p className="mt-3 text-2xl font-black text-neutral-950">{metrics.total}</p>
          <span className="text-[11px] text-neutral-500">All registered contracts</span>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Ongoing</span>
            <Play className="h-4 w-4 text-indigo-600 fill-indigo-600" />
          </div>
          <p className="mt-3 text-2xl font-black text-indigo-600">{metrics.ongoing}</p>
          <span className="text-[11px] text-neutral-500">In active production</span>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">In Review</span>
            <Clock className="h-4 w-4 text-sky-600" />
          </div>
          <p className="mt-3 text-2xl font-black text-sky-600">{metrics.review}</p>
          <span className="text-[11px] text-neutral-500">Client / Studio QA</span>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-600">{metrics.completed}</p>
          <span className="text-[11px] text-neutral-500">Delivered & closed</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-black/[0.08] bg-white/85 p-4 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {FILTER_TABS.map((tab) => {
            const active = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  active
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/80"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search code, title, client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/90 pl-9 pr-4 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-white/60 p-12">
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-[#4F46E5]" />
            <p className="text-xs font-medium text-neutral-500">Loading projects…</p>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/10 bg-white/60 p-12 text-center">
          <FolderKanban className="mx-auto h-10 w-10 text-neutral-400" />
          <h3 className="mt-3 text-base font-bold text-neutral-900">No projects found</h3>
          <p className="mt-1 text-xs text-neutral-500">
            {search || statusFilter !== "ALL"
              ? "No projects match your filter or search criteria."
              : "Accepted client requests will automatically appear here as live production projects."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const badge = STATUS_BADGES[project.status] || STATUS_BADGES.INTAKE;
            const deliverablesCount = project._count?.deliverables ?? 0;

            return (
              <article
                key={project.id}
                className="group flex flex-col justify-between rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md"
              >
                <div>
                  {/* Top Bar: Code & Status */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-bold text-neutral-500">
                      {project.projectCode}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/admin/projects/${project.id}`} className="block">
                    <h2 className="mt-3 text-base font-bold text-neutral-950 transition group-hover:text-[#4F46E5]">
                      {project.title}
                    </h2>
                  </Link>

                  {/* Brief Preview */}
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-neutral-600">
                    {project.brief}
                  </p>
                </div>

                {/* Footer details */}
                <div className="mt-5 border-t border-black/[0.06] pt-4">
                  {/* Client Info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[10px] font-bold text-[#4F46E5]">
                        {(project.client?.name || "C").charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-neutral-800">
                        {project.client?.name || "Client"}
                      </span>
                    </div>

                    {project.dueDate && (
                      <span className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Calendar className="h-3 w-3" /> Due{" "}
                        {new Date(project.dueDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Bottom Meta & Manage Link */}
                  <div className="mt-3 flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                      <FileCheck2 className="h-3.5 w-3.5 text-neutral-400" />
                      <span>{deliverablesCount} deliverables</span>
                    </div>

                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#4F46E5]"
                    >
                      Manage Project <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
