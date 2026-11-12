"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, FolderKanban, LoaderCircle, RefreshCw } from "lucide-react";
import { backendFetch } from "@/lib/backend-api";

type CreatorProject = {
  id: string;
  projectCode: string;
  title: string;
  status: string;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  client: { name: string };
  service: { name: string } | null;
  package: { name: string } | null;
  roleTitle: string;
  joinedAt: string;
  agreement: { offerId: string; offerCode: string; acceptedAmount: string | null; currency: string; scopeSummary: string; proposedDueDate: string | null };
};

const statusClass = (status: string) => status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : status === "ON_HOLD" || status === "CANCELLED" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700";

export default function CreatorProjectsPage() {
  const [projects, setProjects] = useState<CreatorProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await backendFetch("/api/v1/creator/projects", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Could not load your projects.");
      setProjects(payload.data || []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load your projects."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void loadProjects(); }, []);
  const activeCount = useMemo(() => projects.filter((project) => !["COMPLETED", "CANCELLED"].includes(project.status)).length, [projects]);
  const completedCount = useMemo(() => projects.filter((project) => project.status === "COMPLETED").length, [projects]);

  return <div className="mx-auto max-w-6xl space-y-7 pb-12">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#4F46E5]">Workspace</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950">My projects</h1><p className="mt-2 text-sm text-neutral-600">Projects you joined by accepting an offer, with your agreed scope, fee, and timeline.</p></div><button type="button" onClick={() => void loadProjects()} className="inline-flex items-center gap-2 self-start rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 sm:self-auto"><RefreshCw size={14}/>Refresh</button></header>

    {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {!loading && projects.length > 0 && <section className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-black/[0.07] bg-white p-4"><p className="text-xs text-neutral-500">All accepted projects</p><p className="mt-1 text-2xl font-extrabold">{projects.length}</p></div><div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4"><p className="text-xs text-indigo-700">In progress</p><p className="mt-1 text-2xl font-extrabold text-indigo-950">{activeCount}</p></div><div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"><p className="text-xs text-emerald-700">Completed</p><p className="mt-1 text-2xl font-extrabold text-emerald-950">{completedCount}</p></div></section>}

    {loading ? <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-neutral-500"><LoaderCircle className="animate-spin" size={17}/> Loading your projects…</div> : projects.length === 0 ? <section className="rounded-2xl border border-dashed border-black/10 bg-white/70 p-10 text-center"><FolderKanban className="mx-auto text-neutral-300" size={32}/><h2 className="mt-3 text-base font-bold text-neutral-900">No accepted projects yet</h2><p className="mx-auto mt-1 max-w-md text-sm text-neutral-500">When you accept a creator offer, its project and agreed details will appear here.</p><Link href="/creator/requests" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#4F46E5]">Review project requests <ArrowRight size={15}/></Link></section> : <section className="grid gap-4 lg:grid-cols-2">{projects.map((project) => <Link key={project.id} href={`/creator/projects/${project.id}`} className="group rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-6"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-mono text-[10px] font-semibold text-neutral-400">{project.projectCode} · {project.agreement.offerCode}</p><h2 className="mt-1 truncate text-lg font-bold text-neutral-950">{project.title}</h2><p className="mt-1 text-xs text-neutral-500">{project.client.name}{project.service?.name ? ` · ${project.service.name}` : project.package?.name ? ` · ${project.package.name}` : ""}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClass(project.status)}`}>{project.status.replaceAll("_", " ")}</span></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-600">{project.agreement.scopeSummary}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4"><div><p className="text-[10px] text-neutral-500">Agreed creator fee</p><p className="mt-0.5 text-base font-extrabold">{project.agreement.acceptedAmount ? new Intl.NumberFormat("en-IN", { style: "currency", currency: project.agreement.currency, maximumFractionDigits: 2 }).format(Number(project.agreement.acceptedAmount)) : "—"}</p></div><div className="flex flex-wrap gap-3 text-[10px] text-neutral-500"><span className="inline-flex items-center gap-1"><CalendarDays size={12}/>Due {project.dueDate || project.agreement.proposedDueDate ? new Date(project.dueDate || project.agreement.proposedDueDate!).toLocaleDateString() : "Not set"}</span><span className="inline-flex items-center gap-1">{project.status === "COMPLETED" ? <CheckCircle2 size={12}/> : <Clock3 size={12}/>} {project.roleTitle}</span></div><ArrowRight size={16} className="text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600"/></div></Link>)}</section>}
  </div>;
}
