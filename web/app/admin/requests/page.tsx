"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Building,
  Mail,
  User,
  DollarSign,
  Calendar,
  RefreshCw,
  ChevronDown,
  Layers,
  ArrowLeft,
  Check,
} from "lucide-react";

type RequestStatus =
  | "ALL"
  | "NEW"
  | "IN_REVIEW"
  | "NEEDS_INFORMATION"
  | "ACCEPTED"
  | "DECLINED";

interface DBRequest {
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
  status: string;
  source?: string | null;
  internalNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  attachments?: any;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  project?: {
    id: string;
    projectCode: string;
    status: string;
  } | null;
}

export default function AdminRequestsPage() {
  const searchParams = useSearchParams();
  const initialStatus = (searchParams?.get("status") as RequestStatus) || "ALL";

  const [filter, setFilter] = useState<RequestStatus>(initialStatus);
  const [query, setQuery] = useState("");
  const [requests, setRequests] = useState<DBRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/requests");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setRequests(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load admin requests:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    // 20s auto-refresh
    const interval = setInterval(fetchRequests, 20000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        setSuccessToast(`Updated status to ${newStatus}`);
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => {
    return {
      ALL: requests.length,
      NEW: requests.filter((r) => r.status === "NEW").length,
      IN_REVIEW: requests.filter((r) => r.status === "IN_REVIEW").length,
      NEEDS_INFORMATION: requests.filter((r) => r.status === "NEEDS_INFORMATION").length,
      ACCEPTED: requests.filter((r) => r.status === "ACCEPTED" || r.status === "CONVERTED").length,
      DECLINED: requests.filter((r) => r.status === "DECLINED").length,
    };
  }, [requests]);

  const filtered = useMemo(() => {
    return requests.filter((req) => {
      if (filter !== "ALL") {
        if (filter === "ACCEPTED") {
          if (req.status !== "ACCEPTED" && req.status !== "CONVERTED") return false;
        } else if (req.status !== filter) {
          return false;
        }
      }

      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = req.name.toLowerCase().includes(q);
        const matchesEmail = req.email.toLowerCase().includes(q);
        const matchesCompany = (req.companyName || "").toLowerCase().includes(q);
        const matchesId = req.id.toLowerCase().includes(q);
        const matchesMessage = req.message.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesCompany && !matchesId && !matchesMessage) {
          return false;
        }
      }

      return true;
    });
  }, [requests, filter, query]);

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#141413] px-5 py-3 text-xs font-bold text-white shadow-xl">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-3">
            <Sparkles size={13} className="text-[#4F46E5]" />
            <span>Client &amp; Landing Page Requests</span>
            <span className="h-1 w-1 rounded-full bg-neutral-300" />
            <span>{requests.length} Total</span>
            {counts.NEW > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#D9480F]" />
                <span className="text-[#D9480F] font-bold">{counts.NEW} Need Review</span>
              </>
            )}
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#141413]">
            Quote Requests &amp; Intake Inbox
          </h2>
          <p className="mt-1 text-sm text-[#5A5852]">
            Review briefs submitted via the public landing page and client workspace. Qualify scope and update status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchRequests();
            }}
            disabled={refreshing}
            title="Refresh database records"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-black/[0.08] bg-white/80 px-4 text-xs font-bold text-neutral-700 backdrop-blur-md shadow-xs transition hover:bg-white hover:text-neutral-900 disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin text-[#4F46E5]" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "ALL", label: `All (${counts.ALL})` },
              { id: "NEW", label: `New / Intake (${counts.NEW})` },
              { id: "IN_REVIEW", label: `In Review (${counts.IN_REVIEW})` },
              { id: "NEEDS_INFORMATION", label: `Needs Info (${counts.NEEDS_INFORMATION})` },
              { id: "ACCEPTED", label: `Accepted (${counts.ACCEPTED})` },
              { id: "DECLINED", label: `Declined (${counts.DECLINED})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs ${
                filter === tab.id
                  ? "bg-white text-[#141413] ring-1 ring-black/10 shadow-sm"
                  : "bg-white/60 text-neutral-600 hover:bg-white hover:text-neutral-900 backdrop-blur-md"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, company, email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-black/[0.06] bg-white/70 pl-9 pr-4 py-2 text-xs text-neutral-800 placeholder-neutral-400 backdrop-blur-md shadow-xs focus:border-[#4F46E5] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/70 p-16 text-center shadow-xs">
          <RefreshCw className="h-8 w-8 animate-spin text-[#4F46E5]" />
          <p className="mt-3 text-sm font-semibold text-neutral-600">Loading studio intake inbox...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/80 bg-white/75 p-16 text-center backdrop-blur-xl shadow-xs">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
            <FileText size={24} />
          </div>
          <h3 className="mt-4 text-base font-bold text-neutral-900">No requests in this view</h3>
          <p className="mt-1 max-w-sm text-xs text-neutral-500">
            {query ? `No brief matched "${query}". Try another keyword.` : "There are no briefs currently matching this status."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const att = req.attachments || {};
            const service = att.serviceNeeded || "Custom Creative Project";
            const platforms = (att.targetPlatforms || []).join(", ");
            const isNew = req.status === "NEW";
            const isUpdating = updatingId === req.id;

            return (
              <div
                key={req.id}
                className={`group relative overflow-hidden rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-lg ${
                  isNew
                    ? "border-indigo-200/90 bg-white/90 shadow-[0_8px_30px_rgba(79,70,229,0.06)]"
                    : "border-white/80 bg-white/75 shadow-[0_8px_30px_rgba(20,20,19,0.03)] hover:bg-white"
                }`}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Column: Brief details */}
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="rounded-md border border-black/[0.08] bg-black/[0.04] px-2 py-0.5 text-xs font-mono font-bold text-neutral-700">
                        REQ-{req.id.slice(-5).toUpperCase()}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          req.source === "LANDING_PAGE"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        }`}
                      >
                        {req.source === "LANDING_PAGE" ? "Landing Page /start-project" : "Dashboard Client"}
                      </span>

                      {/* Status Dropdown */}
                      <div className="relative inline-block">
                        <select
                          value={req.status}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className={`rounded-full border px-3 py-0.5 text-[11px] font-bold shadow-xs cursor-pointer focus:outline-none ${
                            req.status === "NEW"
                              ? "border-[#D9480F]/30 bg-[#D9480F]/10 text-[#D9480F]"
                              : req.status === "IN_REVIEW"
                              ? "border-blue-500/30 bg-blue-50 text-blue-700"
                              : req.status === "NEEDS_INFORMATION"
                              ? "border-amber-500/30 bg-amber-50 text-amber-700"
                              : req.status === "ACCEPTED" || req.status === "CONVERTED"
                              ? "border-emerald-500/30 bg-emerald-50 text-emerald-700"
                              : "border-neutral-300 bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          <option value="NEW">Intake / New</option>
                          <option value="IN_REVIEW">Under Review</option>
                          <option value="NEEDS_INFORMATION">Needs Information</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="DECLINED">Declined</option>
                        </select>
                      </div>

                      {isUpdating && (
                        <RefreshCw size={13} className="animate-spin text-[#4F46E5]" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-[#141413]">
                        {att.projectTitle || `${req.companyName || req.name} - ${service}`}
                      </h3>
                      <p className="mt-1 text-xs text-[#5A5852] font-semibold">{service}</p>
                    </div>

                    {/* Brief text */}
                    <div className="rounded-2xl border border-black/[0.05] bg-white/70 p-4 text-xs leading-relaxed text-neutral-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {req.message}
                    </div>

                    {/* Meta info chips */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <DollarSign size={14} className="text-neutral-400" />
                        Budget: <strong className="text-neutral-800">{req.budgetRange || "Custom"}</strong>
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-neutral-400" />
                        Submitted:{" "}
                        <strong className="text-neutral-800">
                          {new Date(req.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </strong>
                      </span>
                      {platforms && (
                        <>
                          <span className="text-neutral-300">•</span>
                          <span>Channels: <strong className="text-neutral-800">{platforms}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Client & Action */}
                  <div className="lg:w-72 shrink-0 space-y-4 rounded-2xl border border-black/[0.06] bg-white/80 p-5 shadow-xs">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Client Contact Info
                    </h4>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-neutral-400" />
                        <span className="font-bold text-neutral-900">{req.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-neutral-400" />
                        <a
                          href={`mailto:${req.email}`}
                          className="text-[#4F46E5] hover:underline truncate"
                        >
                          {req.email}
                        </a>
                      </div>

                      {req.companyName && (
                        <div className="flex items-center gap-2">
                          <Building size={14} className="text-neutral-400" />
                          <span className="text-neutral-700 font-medium">
                            {req.companyName}
                          </span>
                        </div>
                      )}

                      {req.companyWebsite && (
                        <div className="flex items-center gap-2">
                          <ExternalLink size={14} className="text-neutral-400" />
                          <a
                            href={
                              req.companyWebsite.startsWith("http")
                                ? req.companyWebsite
                                : `https://${req.companyWebsite}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#4F46E5] hover:underline truncate"
                          >
                            {req.companyWebsite.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-black/[0.06] space-y-2">
                      <Link
                        href={`/dashboard/requests/${req.id}`}
                        target="_blank"
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white py-2 text-xs font-bold text-neutral-800 shadow-xs hover:bg-neutral-50 transition"
                      >
                        <span>View Client Detail View</span>
                        <ExternalLink size={12} />
                      </Link>

                      <a
                        href={`mailto:${req.email}?subject=Regarding your AdsPolisher Brief: ${encodeURIComponent(att.projectTitle || req.companyName || 'Campaign')}`}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] py-2 text-xs font-bold text-white shadow-xs hover:scale-[1.01] transition"
                      >
                        <Mail size={12} />
                        <span>Email Proposal Quote</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
