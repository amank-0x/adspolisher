"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, Clock3, ExternalLink, FileText, FolderKanban, LoaderCircle, RefreshCw, Users } from "lucide-react";
import { backendFetch } from "@/lib/backend-api";

type ProjectDetail = {
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
  agreement: { offerId: string; offerCode: string; acceptedAmount: string | null; currency: string; scopeSummary: string; paymentTerms: string | null; acceptedAt: string | null; proposedDueDate: string | null };
  teamMembers: { id: string; name: string; image: string | null; roleTitle: string; isYou: boolean }[];
  deliverables: { id: string; title: string; description: string | null; fileUrl: string; previewUrl: string | null; version: number; status: string; createdAt: string }[];
};

export default function CreatorProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await backendFetch(`/api/creator/projects/${encodeURIComponent(projectId)}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Could not load project details.");
      setProject(payload.data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load project details."); }
    finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { void loadProject(); }, [loadProject]);

  if (loading) return <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-neutral-500"><LoaderCircle className="animate-spin" size={17}/> Loading project workspace…</div>;
  if (error || !project) return <div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-white p-8 text-center"><p className="text-sm font-semibold text-rose-800">{error || "Project not found."}</p><div className="mt-4 flex justify-center gap-3"><Link href="/creator/projects" className="rounded-xl border border-black/10 px-4 py-2 text-xs font-semibold">Back to my projects</Link><button onClick={() => void loadProject()} className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"><RefreshCw size={13}/>Retry</button></div></div>;

  const status = project.status.replaceAll("_", " ");
  const agreedFee = project.agreement.acceptedAmount ? new Intl.NumberFormat("en-IN", { style: "currency", currency: project.agreement.currency, maximumFractionDigits: 2 }).format(Number(project.agreement.acceptedAmount)) : "Not available";

  return <div className="mx-auto max-w-6xl space-y-6 pb-12">
    <Link href="/creator/projects" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-indigo-700"><ArrowLeft size={14}/>My projects</Link>

    <header className="rounded-3xl bg-neutral-950 p-6 text-white shadow-sm sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div className="min-w-0"><p className="font-mono text-[11px] text-white/55">{project.projectCode} · {project.agreement.offerCode}</p><h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{project.title}</h1><p className="mt-2 text-sm text-white/65">{project.client.name}{project.service?.name ? ` · ${project.service.name}` : project.package?.name ? ` · ${project.package.name}` : ""}</p></div><span className="w-fit rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide">{status}</span></div><div className="mt-6 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3"><div><p className="text-[10px] uppercase tracking-wide text-white/50">Your role</p><p className="mt-1 text-sm font-semibold">{project.roleTitle}</p></div><div><p className="text-[10px] uppercase tracking-wide text-white/50">Agreed creator fee</p><p className="mt-1 text-lg font-extrabold">{agreedFee}</p></div><div><p className="text-[10px] uppercase tracking-wide text-white/50">Target deadline</p><p className="mt-1 text-sm font-semibold">{project.dueDate || project.agreement.proposedDueDate ? new Date(project.dueDate || project.agreement.proposedDueDate!).toLocaleDateString() : "To be agreed"}</p></div></div></header>

    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-2"><FolderKanban className="text-indigo-600" size={18}/><h2 className="text-base font-bold">Project scope</h2></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-700">{project.agreement.scopeSummary}</p></section>

        <section className="rounded-2xl border border-black/[0.07] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 sm:px-6"><div><div className="flex items-center gap-2"><FileText className="text-indigo-600" size={17}/><h2 className="text-base font-bold">My project files</h2></div><p className="mt-1 text-xs text-neutral-500">Files you have uploaded for this project.</p></div><span className="text-xs text-neutral-500">{project.deliverables.length}</span></div>{project.deliverables.length === 0 ? <div className="p-8 text-center text-sm text-neutral-500">Your uploads and submissions will appear here.</div> : <div className="divide-y divide-black/[0.05]">{project.deliverables.map((file) => <div key={file.id} className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center sm:px-6"><div className="min-w-0"><p className="truncate text-sm font-semibold">{file.title}</p><p className="mt-1 text-xs text-neutral-500">Version {file.version} · {new Date(file.createdAt).toLocaleDateString()} · {file.status.replaceAll("_", " ")}</p>{file.description && <p className="mt-1 text-xs text-neutral-500">{file.description}</p>}</div><a href={file.fileUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900">Open file <ArrowUpRight size={13}/></a></div>)}</div>}</section>
      </div>

      <aside className="space-y-6">
        <section className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><CalendarDays className="text-indigo-600" size={17}/><h2 className="text-sm font-bold">Timeline</h2></div><div className="mt-4 space-y-4"><div className="flex justify-between gap-3 text-xs"><span className="text-neutral-500">Joined project</span><span className="text-right font-semibold">{new Date(project.joinedAt).toLocaleDateString()}</span></div><div className="flex justify-between gap-3 text-xs"><span className="text-neutral-500">Project start</span><span className="text-right font-semibold">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}</span></div><div className="flex justify-between gap-3 text-xs"><span className="text-neutral-500">Target deadline</span><span className="text-right font-semibold">{project.dueDate || project.agreement.proposedDueDate ? new Date(project.dueDate || project.agreement.proposedDueDate!).toLocaleDateString() : "Not set"}</span></div>{project.completedAt && <div className="flex justify-between gap-3 text-xs"><span className="text-neutral-500">Completed</span><span className="text-right font-semibold">{new Date(project.completedAt).toLocaleDateString()}</span></div>}</div></section>

        <section className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Users className="text-indigo-600" size={17}/><h2 className="text-sm font-bold">Project team</h2></div><div className="mt-4 space-y-3">{project.teamMembers.map((member) => <div key={member.id} className="flex items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-50 text-xs font-bold text-indigo-700">{member.image ? <img src={member.image} alt="" className="h-full w-full object-cover"/> : (member.name || "C").slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{member.name}{member.isYou ? " (you)" : ""}</p><p className="truncate text-[10px] text-neutral-500">{member.roleTitle}</p></div></div>)}{project.teamMembers.length === 0 && <p className="text-xs text-neutral-500">Team details will appear when collaborators accept their offers.</p>}</div><Link href="/creator/teams" className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 hover:text-indigo-900">Open My Teams <ExternalLink size={12}/></Link></section>

        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5"><div className="flex items-center gap-2 text-indigo-800"><CheckCircle2 size={16}/><h2 className="text-sm font-bold">Your agreement</h2></div><p className="mt-3 text-xs leading-5 text-indigo-950">{project.agreement.paymentTerms || "Your accepted offer is the source of your agreed creator fee."}</p><p className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-indigo-800"><Clock3 size={12}/>Accepted {project.agreement.acceptedAt ? new Date(project.agreement.acceptedAt).toLocaleDateString() : "offer"}</p></section>
      </aside>
    </div>
  </div>;
}
