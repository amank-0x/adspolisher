"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { backendFetch } from "@/lib/backend-api";

type RequestPoint = { date: string; count: number };
type CreatorOverview = {
  counts: { pendingOffers: number; activeProjects: number; completedProjects: number; totalProjects: number };
  projectRequests: RequestPoint[];
  recentOffers: {
    id: string;
    offerCode: string;
    status: string;
    currentAmount: string;
    acceptedAmount: string | null;
    currency: string;
    createdAt: string;
    project: { id: string; projectCode: string; title: string; status: string };
  }[];
  projects: { id: string; projectCode: string; title: string; status: string; dueDate: string | null; updatedAt: string }[];
};

const EMPTY_OVERVIEW: CreatorOverview = {
  counts: { pendingOffers: 0, activeProjects: 0, completedProjects: 0, totalProjects: 0 },
  projectRequests: [],
  recentOffers: [],
  projects: [],
};

function formatAmount(amount: string | null, currency: string) {
  if (amount === null) return "Amount not set";
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${currency} ${amount}`;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}

function RequestsChart({ points }: { points: RequestPoint[] }) {
  const normalized = (Array.isArray(points) ? points : []).map((point) => ({
    date: typeof point?.date === "string" ? point.date : "",
    count: Number.isFinite(Number(point?.count)) ? Number(point.count) : 0,
  }));
  const chartPoints = normalized.length ? normalized : Array.from({ length: 30 }, () => ({ date: "", count: 0 }));
  const maximum = Math.max(1, ...chartPoints.map((point) => point.count));
  const plotted = chartPoints.map((point, index) => ({
    ...point,
    x: 48 + (index * 904) / Math.max(1, chartPoints.length - 1),
    y: 174 - (point.count / maximum) * 132,
  }));
  const line = plotted.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${line} L${plotted[plotted.length - 1].x},174 L${plotted[0].x},174 Z`;
  const total = normalized.reduce((sum, point) => sum + point.count, 0);
  const labelIndexes = [0, 7, 14, 21, chartPoints.length - 1].filter(
    (index, position, all) => index >= 0 && index < chartPoints.length && all.indexOf(index) === position,
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_12px_38px_rgba(37,99,235,0.10)]">
      <div className="flex flex-col justify-between gap-3 border-b border-blue-50 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
        <div>
          <h3 className="text-base font-bold text-slate-950">Project requests</h3>
          <p className="mt-1 text-xs text-slate-500">Offers received from the studio each day over the last 30 days.</p>
        </div>
        <div className="flex items-baseline gap-2 self-start rounded-xl bg-blue-50 px-3.5 py-2 sm:self-auto">
          <span className="text-xl font-extrabold tabular-nums text-blue-700">{total}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600">Last 30 days</span>
        </div>
      </div>
      <div className="px-3 pb-4 pt-5 sm:px-6">
        <div className="w-full overflow-hidden">
          <svg viewBox="0 0 1000 218" role="img" aria-label="Project requests received over the last 30 days" className="h-56 w-full overflow-visible">
            <defs>
              <linearGradient id="creator-request-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.015" />
              </linearGradient>
              <filter id="creator-request-glow" x="-20%" y="-50%" width="140%" height="200%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#2563EB" floodOpacity="0.28" />
              </filter>
            </defs>
            {[42, 108, 174].map((y, index) => (
              <g key={y}>
                <line x1="48" x2="952" y1={y} y2={y} stroke="#E5EEF9" strokeDasharray={index === 2 ? "0" : "4 7"} />
                <text x="38" y={y + 4} textAnchor="end" className="fill-slate-400" fontSize="10">{Math.round((maximum * (2 - index)) / 2)}</text>
              </g>
            ))}
            <path d={area} fill="url(#creator-request-fill)" />
            <path d={line} fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#creator-request-glow)" />
            {plotted.map((point, index) => (
              <circle key={`${point.date}-${index}`} cx={point.x} cy={point.y} r="2.6" fill="#fff" stroke="#2563EB" strokeWidth="1.8">
                <title>{point.date || "Date unavailable"}: {point.count}</title>
              </circle>
            ))}
            {labelIndexes.map((index) => {
              const date = chartPoints[index].date;
              return (
                <text key={`${date}-${index}`} x={plotted[index].x} y="203" textAnchor={index === 0 ? "start" : index === chartPoints.length - 1 ? "end" : "middle"} className="fill-slate-400" fontSize="10">
                  {date ? new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—"}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}

export default function CreatorDashboardPage() {
  const [overview, setOverview] = useState<CreatorOverview>(EMPTY_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await backendFetch("/api/creator/overview", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not load your creator overview.");
      const data = result.data || {};
      setOverview({
        counts: {
          pendingOffers: Number(data.counts?.pendingOffers) || 0,
          activeProjects: Number(data.counts?.activeProjects) || 0,
          completedProjects: Number(data.counts?.completedProjects) || 0,
          totalProjects: Number(data.counts?.totalProjects) || 0,
        },
        projectRequests: Array.isArray(data.projectRequests) ? data.projectRequests : [],
        recentOffers: Array.isArray(data.recentOffers) ? data.recentOffers : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load your creator overview.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadOverview(); }, [loadOverview]);

  const metrics = [
    { label: "Project requests", value: overview.counts.pendingOffers, note: "Awaiting your response", icon: FileText, color: "indigo" },
    { label: "Active projects", value: overview.counts.activeProjects, note: "Accepted and in progress", icon: FolderKanban, color: "blue" },
    { label: "Completed projects", value: overview.counts.completedProjects, note: "Accepted work completed", icon: CheckCircle2, color: "emerald" },
    { label: "Total projects", value: overview.counts.totalProjects, note: "Your accepted project history", icon: CalendarClock, color: "amber" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 shadow-xs backdrop-blur-md">
            <Sparkles size={13} className="text-[#4F46E5]" />
            <span>Creator Studio Workspace</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413] sm:text-4xl">Your work, in focus.</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#5A5852]">See your project offers, accepted work, and current studio activity.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void loadOverview()} disabled={loading} aria-label="Refresh overview" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-black/[0.08] bg-white/80 text-neutral-600 shadow-xs hover:bg-white disabled:opacity-50">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <Link href="/creator/requests" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] px-5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:scale-[1.02]">
            <FileText size={16} /> Review project requests
          </Link>
        </div>
      </section>

      {error && <div role="alert" className="flex flex-col justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center"><span>{error}</span><button onClick={() => void loadOverview()} className="font-semibold underline">Retry</button></div>}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-[0_4px_20px_rgba(20,20,19,0.03)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">{item.label}</p>
                <span className={`grid h-8 w-8 place-items-center rounded-xl ${item.color === "indigo" ? "bg-indigo-50 text-indigo-600" : item.color === "blue" ? "bg-blue-50 text-blue-600" : item.color === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}><Icon size={16} /></span>
              </div>
              <p className="mt-4 text-3xl font-extrabold tabular-nums text-[#141413]">{loading ? "—" : item.value}</p>
              <p className="mt-1 text-xs text-[#5A5852]">{item.note}</p>
            </article>
          );
        })}
      </div>

      <RequestsChart points={overview.projectRequests} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
        <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-[0_8px_30px_rgba(20,20,19,0.04)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] bg-white/50 px-5 py-4 sm:px-6">
            <div><h3 className="text-base font-bold text-[#141413]">Recent project requests</h3><p className="mt-0.5 text-xs text-[#5A5852]">Offers sent to your creator account.</p></div>
            <Link href="/creator/requests" className="inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:underline">View all <ArrowRight size={13} /></Link>
          </div>
          {loading ? <div className="flex min-h-32 items-center justify-center gap-2 text-xs text-neutral-500"><LoaderCircle size={15} className="animate-spin" /> Loading requests…</div> : overview.recentOffers.length === 0 ? (
            <div className="p-8 text-center"><FileText size={25} className="mx-auto text-neutral-300" /><p className="mt-2 text-sm font-semibold text-neutral-800">No project requests yet</p><p className="mt-1 text-xs text-neutral-500">New offers from the studio will appear here.</p></div>
          ) : <div className="divide-y divide-black/[0.05]">{overview.recentOffers.map((offer) => {
            const pending = ["SENT", "COUNTERED_BY_ADMIN"].includes(offer.status);
            const amount = offer.acceptedAmount ?? offer.currentAmount;
            return <article key={offer.id} className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:px-6">
              <div className="min-w-0"><p className="font-mono text-[10px] text-neutral-400">{offer.offerCode} · {offer.project.projectCode}</p><h4 className="mt-1 truncate text-sm font-bold text-neutral-900">{offer.project.title}</h4><p className="mt-1 text-xs text-neutral-500">{new Date(offer.createdAt).toLocaleDateString()} · {formatAmount(amount, offer.currency)}</p></div>
              <div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${pending ? "bg-blue-50 text-blue-700" : offer.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-600"}`}>{offer.status.replaceAll("_", " ")}</span><Link href={pending ? "/creator/requests" : offer.status === "ACCEPTED" ? `/creator/projects/${offer.project.id}` : "/creator/requests"} aria-label={`Open ${offer.project.title}`} className="text-neutral-500 hover:text-blue-600"><ArrowUpRight size={16} /></Link></div>
            </article>;
          })}</div>}
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/75 shadow-[0_8px_30px_rgba(20,20,19,0.04)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4"><div><h3 className="text-base font-bold text-[#141413]">Your active projects</h3><p className="mt-0.5 text-xs text-neutral-500">Accepted projects in your workspace.</p></div><FolderKanban size={17} className="text-blue-600" /></div>
          {loading ? <div className="flex min-h-32 items-center justify-center gap-2 text-xs text-neutral-500"><LoaderCircle size={15} className="animate-spin" /> Loading projects…</div> : overview.projects.filter((project) => !["COMPLETED", "CANCELLED"].includes(project.status)).length === 0 ? <p className="p-7 text-center text-xs text-neutral-500">Accepted projects will appear here.</p> : <div className="divide-y divide-black/[0.05]">{overview.projects.filter((project) => !["COMPLETED", "CANCELLED"].includes(project.status)).slice(0, 5).map((project) => <Link key={project.id} href={`/creator/projects/${project.id}`} className="block p-4 transition hover:bg-white"><p className="font-mono text-[10px] text-neutral-400">{project.projectCode}</p><p className="mt-1 truncate text-xs font-bold text-neutral-900">{project.title}</p><p className="mt-1 inline-flex items-center gap-1 text-[10px] text-neutral-500"><Clock3 size={11} />{project.dueDate ? `Due ${new Date(project.dueDate).toLocaleDateString()}` : project.status.replaceAll("_", " ")}</p></Link>)}</div>}
          <Link href="/creator/projects" className="flex items-center justify-center gap-1.5 border-t border-black/[0.06] px-4 py-3 text-xs font-bold text-[#4F46E5] hover:bg-white">Open my projects <ArrowRight size={13} /></Link>
        </section>
      </div>
    </div>
  );
}
