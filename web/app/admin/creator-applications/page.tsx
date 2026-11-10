"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, ExternalLink, Mail, MapPin, RefreshCw, Search, X } from "lucide-react";
import { backendFetch } from "@/lib/backend-api";

type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";
type FilterStatus = "ALL" | ApplicationStatus;

interface CreatorApplication {
  id: string;
  name: string;
  email: string;
  location: string;
  portfolioUrl: string;
  secondaryUrl?: string | null;
  craftSpecialty: string;
  primaryTools: string;
  experienceLevel: string;
  weeklyAvailability: string;
  notes?: string | null;
  reviewNotes?: string | null;
  status: ApplicationStatus;
  createdAt: string;
}

const tabs: { id: FilterStatus; label: string }[] = [
  { id: "ALL", label: "Pending Applications" },
];

function statusStyles(status: ApplicationStatus) {
  if (status === "APPROVED") return "bg-emerald-100 text-emerald-700";
  if (status === "REJECTED") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default function AdminCreatorApplicationsPage() {
  const [applications, setApplications] = useState<CreatorApplication[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setError(null);
    try {
      const response = await backendFetch("/api/v1/admin/creator-applications");
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) throw new Error(data?.message || "Failed to load creator applications.");
      setApplications(Array.isArray(data.data) ? data.data : []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load creator applications.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadApplications(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadApplications]);

  const counts = useMemo(() => ({
    ALL: applications.length,
    PENDING: applications.filter((application) => application.status === "PENDING").length,
    APPROVED: applications.filter((application) => application.status === "APPROVED").length,
    REJECTED: applications.filter((application) => application.status === "REJECTED").length,
  }), [applications]);

  const visibleApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesStatus = filter === "ALL" || application.status === filter;
      const matchesQuery = !normalizedQuery || [application.name, application.email, application.location, application.craftSpecialty]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesStatus && matchesQuery;
    });
  }, [applications, filter, query]);

  const reviewApplication = async (application: CreatorApplication, status: ApplicationStatus) => {
    setUpdatingId(application.id);
    try {
      const response = await backendFetch(`/api/v1/admin/creator-applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNotes: notes[application.id]?.trim() || application.reviewNotes || null }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) throw new Error(data?.message || "Could not update this application.");
      if (status === "APPROVED" || status === "REJECTED") {
        setApplications((current) => current.filter((item) => item.id !== application.id));
      } else {
        setApplications((current) => current.map((item) => item.id === application.id ? data.data : item));
      }
      setToast(data?.message || (status === "APPROVED" ? "Creator access granted and removed from queue." : "Application rejected and removed."));
      window.setTimeout(() => setToast(null), 3500);
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Could not update this application.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-7 pb-16">
      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#141413] px-5 py-3 text-xs font-bold text-white shadow-xl"><CheckCircle2 size={16} className="text-emerald-400" />{toast}</div>}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#4F46E5]">Talent pipeline</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#141413]">Creator Applications</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#5A5852]">Review creator requests, grant creator access, or reject applications with an internal note.</p>
        </div>
        <button type="button" onClick={() => { setRefreshing(true); void loadApplications(); }} disabled={refreshing} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white/80 px-4 text-xs font-bold text-neutral-700 shadow-xs transition hover:bg-white disabled:opacity-50">
          <RefreshCw size={15} className={refreshing ? "animate-spin text-[#4F46E5]" : ""} /> Refresh
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => <button key={tab.id} type="button" onClick={() => setFilter(tab.id)} className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${filter === tab.id ? "bg-white text-[#141413] shadow-sm ring-1 ring-black/10" : "bg-white/60 text-neutral-600 hover:bg-white"}`}>{tab.label} ({counts[tab.id]})</button>)}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search applications…" className="h-10 w-full rounded-xl border border-black/[0.08] bg-white/80 pl-10 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-[#4F46E5]" />
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {loading ? (
        <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-10 text-center text-sm text-neutral-500">
          Loading creator applications…
        </div>
      ) : visibleApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-12 text-center">
          <p className="font-semibold text-neutral-800">No pending creator applications</p>
          <p className="mt-1 text-sm text-neutral-500">
            All submitted applications have been reviewed. When new creators apply, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {visibleApplications.map((application) => (
            <article key={application.id} className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-[#141413]">{application.name}</h2><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles(application.status)}`}>{application.status}</span></div><div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500"><span className="inline-flex items-center gap-1"><Mail size={13} />{application.email}</span><span className="inline-flex items-center gap-1"><MapPin size={13} />{application.location}</span></div></div>
                <span className="text-xs text-neutral-400">{formatDate(application.createdAt)}</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div><p className="text-neutral-400">Specialty</p><p className="mt-1 font-semibold text-neutral-800">{application.craftSpecialty}</p></div>
                <div><p className="text-neutral-400">Experience</p><p className="mt-1 font-semibold text-neutral-800">{application.experienceLevel}</p></div>
                <div><p className="text-neutral-400">Availability</p><p className="mt-1 font-semibold text-neutral-800">{application.weeklyAvailability}</p></div>
                <div><p className="text-neutral-400">Tools</p><p className="mt-1 font-semibold text-neutral-800">{application.primaryTools}</p></div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold"><a href={application.portfolioUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#4F46E5] hover:underline">Portfolio <ExternalLink size={13} /></a>{application.secondaryUrl && <a href={application.secondaryUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#4F46E5] hover:underline">Additional link <ExternalLink size={13} /></a>}</div>
              {application.notes && <p className="mt-4 rounded-xl bg-[#f5f4ef] p-3 text-sm leading-6 text-neutral-700">{application.notes}</p>}

              <div className="mt-5 border-t border-black/[0.06] pt-4"><label className="text-xs font-bold uppercase tracking-wider text-neutral-500" htmlFor={`review-notes-${application.id}`}>Internal review note</label><textarea id={`review-notes-${application.id}`} value={notes[application.id] ?? application.reviewNotes ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [application.id]: event.target.value }))} rows={2} placeholder="Optional note for your team…" className="mt-2 w-full resize-y rounded-xl border border-black/[0.08] bg-white px-3 py-2 text-sm outline-none focus:border-[#4F46E5]" /><div className="mt-3 flex flex-wrap gap-2">
                {application.status !== "APPROVED" && <button type="button" disabled={updatingId === application.id} onClick={() => void reviewApplication(application, "APPROVED")} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"><Check size={14} /> Make creator</button>}
                {application.status !== "REJECTED" && <button type="button" disabled={updatingId === application.id} onClick={() => void reviewApplication(application, "REJECTED")} className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"><X size={14} /> Reject</button>}
                {application.status !== "PENDING" && <button type="button" disabled={updatingId === application.id} onClick={() => void reviewApplication(application, "PENDING")} className="rounded-xl border border-black/10 px-3.5 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50">Move to pending</button>}
              </div></div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
