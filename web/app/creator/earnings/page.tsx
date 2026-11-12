"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, Banknote, CalendarDays, CheckCircle2, Clock3, LoaderCircle, RefreshCw, Wallet } from "lucide-react";
import { backendFetch } from "@/lib/backend-api";

type EarningsProject = {
  offerId: string;
  offerCode: string;
  agreedAmount: string;
  currency: string;
  roleTitle: string;
  acceptedAt: string;
  dueDate: string | null;
  completedAt: string | null;
  project: { id: string; projectCode: string; title: string; status: string; dueDate: string | null; completedAt: string | null };
};

const money = (amount: number, currency: string) => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

export default function CreatorEarningsPage() {
  const [projects, setProjects] = useState<EarningsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");

  const loadEarnings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await backendFetch("/api/v1/creator/earnings", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Could not load your earnings.");
      setProjects(payload.data?.projects || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load your earnings.");
    } finally { setLoading(false); }
  };

  useEffect(() => { void loadEarnings(); }, []);

  const currencies = useMemo(() => [...new Set(projects.map((project) => project.currency))], [projects]);
  const currency = currencyFilter || currencies[0] || "INR";
  const currencyProjects = useMemo(() => projects.filter((project) => project.currency === currency), [projects, currency]);
  const summary = useMemo(() => {
    const totalAgreed = currencyProjects.reduce((sum, project) => sum + Number(project.agreedAmount), 0);
    const completed = currencyProjects.filter((project) => project.project.status === "COMPLETED");
    const cancelled = currencyProjects.filter((project) => project.project.status === "CANCELLED");
    const estimated = currencyProjects.filter((project) => !["COMPLETED", "CANCELLED"].includes(project.project.status));
    return {
      totalAgreed,
      completedAmount: completed.reduce((sum, project) => sum + Number(project.agreedAmount), 0),
      estimatedAmount: estimated.reduce((sum, project) => sum + Number(project.agreedAmount), 0),
      completedCount: completed.length,
      estimatedCount: estimated.length,
      cancelledCount: cancelled.length,
    };
  }, [currencyProjects]);

  const chart = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleDateString(undefined, { month: "short" }), amount: 0 };
    });
    const monthIndex = new Map(months.map((month, index) => [month.key, index]));
    for (const project of currencyProjects) {
      const date = new Date(project.acceptedAt);
      const index = monthIndex.get(`${date.getFullYear()}-${date.getMonth()}`);
      if (index !== undefined) months[index].amount += Number(project.agreedAmount);
    }
    return months;
  }, [currencyProjects]);
  const chartMax = Math.max(...chart.map((month) => month.amount), 1);

  if (loading) return <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-neutral-500"><LoaderCircle className="animate-spin" size={17}/> Loading your earnings…</div>;

  return <div className="mx-auto max-w-6xl space-y-7 pb-12">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#4F46E5]">Finance</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950">Earnings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">Your amounts come from accepted creator offers and are tracked per project.</p></div>
      <div className="flex items-center gap-2">
        {currencies.length > 1 && <select aria-label="Currency" value={currency} onChange={(event) => setCurrencyFilter(event.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"><option value="" disabled>Select currency</option>{currencies.map((item) => <option key={item} value={item}>{item}</option>)}</select>}
        <button type="button" onClick={() => void loadEarnings()} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"><RefreshCw size={14}/>Refresh</button>
      </div>
    </header>

    {error && <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><AlertCircle size={17}/>{error}</div>}

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-neutral-500"><span className="text-xs font-semibold">Total agreed</span><Wallet size={17}/></div><p className="mt-4 text-2xl font-extrabold tracking-tight">{money(summary.totalAgreed, currency)}</p><p className="mt-1 text-[11px] text-neutral-500">Across {currencyProjects.length} accepted {currencyProjects.length === 1 ? "project" : "projects"}</p></article>
      <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm"><div className="flex items-center justify-between text-emerald-800"><span className="text-xs font-semibold">Completed project fees</span><CheckCircle2 size={17}/></div><p className="mt-4 text-2xl font-extrabold tracking-tight text-emerald-950">{money(summary.completedAmount, currency)}</p><p className="mt-1 text-[11px] text-emerald-800">{summary.completedCount} completed {summary.completedCount === 1 ? "project" : "projects"}</p></article>
      <article className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-sm"><div className="flex items-center justify-between text-indigo-800"><span className="text-xs font-semibold">Estimated in progress</span><ArrowUpRight size={17}/></div><p className="mt-4 text-2xl font-extrabold tracking-tight text-indigo-950">{money(summary.estimatedAmount, currency)}</p><p className="mt-1 text-[11px] text-indigo-800">Agreed on {summary.estimatedCount} active {summary.estimatedCount === 1 ? "project" : "projects"}</p></article>
      <article className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm"><div className="flex items-center justify-between text-neutral-500"><span className="text-xs font-semibold">Accepted projects</span><Banknote size={17}/></div><p className="mt-4 text-2xl font-extrabold tracking-tight">{currencyProjects.length}</p><p className="mt-1 text-[11px] text-neutral-500">{summary.cancelledCount} cancelled agreement{summary.cancelledCount === 1 ? "" : "s"}</p></article>
    </section>

    <section className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-base font-bold">Accepted project fees</h2><p className="mt-1 text-xs text-neutral-500">Value of agreements accepted in the last six months.</p></div><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">{currency}</span></div>
      <div className="mt-7 grid h-48 grid-cols-6 items-end gap-3 border-b border-l border-black/[0.08] px-2 sm:gap-6 sm:px-5">
        {chart.map((month) => <div key={month.key} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-[9px] font-medium text-neutral-500">{month.amount ? money(month.amount, currency) : ""}</span><div title={`${month.label}: ${money(month.amount, currency)}`} className="w-full max-w-14 rounded-t-lg bg-gradient-to-t from-[#4F46E5] to-violet-400 transition-all" style={{ height: `${Math.max(month.amount ? (month.amount / chartMax) * 72 : 0, month.amount ? 5 : 0)}%` }}/><span className="mb-2 text-[10px] text-neutral-500">{month.label}</span></div>)}
      </div>
      <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-neutral-500"><AlertCircle className="mt-0.5 shrink-0" size={13}/>These are agreed project amounts, not payout records. Payment approval and payout tracking are not available yet.</p>
    </section>

    <section className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 sm:px-6"><div><h2 className="text-base font-bold">Project earnings</h2><p className="mt-1 text-xs text-neutral-500">Agreed fee and current project progress for each accepted offer.</p></div><span className="text-xs text-neutral-500">{currencyProjects.length} records</span></div>
      {currencyProjects.length === 0 ? <div className="p-10 text-center"><Banknote className="mx-auto text-neutral-300" size={28}/><p className="mt-3 text-sm font-semibold text-neutral-700">No accepted project fees yet</p><p className="mt-1 text-xs text-neutral-500">When you accept a project offer, its agreed fee will appear here.</p></div> : <div className="divide-y divide-black/[0.05]">{currencyProjects.map((entry) => {
        const completed = entry.project.status === "COMPLETED";
        const cancelled = entry.project.status === "CANCELLED";
        const statusLabel = completed ? "Project completed" : cancelled ? "Cancelled" : entry.project.status.replaceAll("_", " ");
        return <article key={entry.offerId} className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:px-6"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-bold">{entry.project.title}</h3><span className="font-mono text-[10px] text-neutral-400">{entry.project.projectCode}</span></div><p className="mt-1 text-xs text-neutral-500">{entry.roleTitle} · {entry.offerCode}</p></div><div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-500"><span className="inline-flex items-center gap-1"><CalendarDays size={12}/>Accepted {new Date(entry.acceptedAt).toLocaleDateString()}</span><span className="inline-flex items-center gap-1"><Clock3 size={12}/>Due {entry.dueDate ? new Date(entry.dueDate).toLocaleDateString() : "Not set"}</span></div><div className="flex items-center justify-between gap-3 sm:justify-end"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${completed ? "bg-emerald-50 text-emerald-700" : cancelled ? "bg-neutral-100 text-neutral-500" : "bg-indigo-50 text-indigo-700"}`}>{statusLabel}</span><span className="text-sm font-extrabold">{money(Number(entry.agreedAmount), currency)}</span></div></article>;
      })}</div>}
    </section>
  </div>;
}
