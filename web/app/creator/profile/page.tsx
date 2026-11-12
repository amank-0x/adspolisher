"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { creatorFetch } from "@/lib/creator-api";
import {
  Users,
  Sparkles,
  Mail,
  MapPin,
  Wrench,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  FolderKanban,
  Award,
  ShieldCheck,
  FileText,
  Settings2,
  ChevronRight,
  Globe,
  Quote,
  Pencil,
} from "lucide-react";

type ProfileData = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    appRole: string;
    emailVerified: boolean;
    createdAt: string;
  };
  application: {
    id?: string;
    location?: string;
    craftSpecialty?: string;
    primaryTools?: string;
    experienceLevel?: string;
    weeklyAvailability?: string;
    portfolioUrl?: string;
    secondaryUrl?: string | null;
    notes?: string | null;
    status?: string;
  } | null;
  stats: {
    totalProjects: number;
    deliverablesCount: number;
  };
};

export default function CreatorProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await creatorFetch("/profile", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load profile details.");
      }
      setData(json.data);
    } catch (err: any) {
      console.error("Profile fetch failed:", err);
      setError(err?.message || "Failed to connect to AdSpolisher servers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getInitials = (n?: string) => {
    if (!n) return "CR";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-44 animate-pulse rounded-3xl bg-neutral-200/70" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-80 animate-pulse rounded-3xl bg-neutral-200/60" />
          <div className="h-80 animate-pulse rounded-3xl bg-neutral-200/60" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50/50 p-12 text-center">
        <AlertCircle size={40} className="text-rose-500 mb-3" />
        <h3 className="text-lg font-bold text-neutral-900">Unable to load creator profile</h3>
        <p className="mt-1 text-sm text-neutral-600 max-w-md">{error}</p>
        <button
          onClick={fetchProfile}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-neutral-800 transition"
        >
          <RefreshCw size={14} />
          Retry Connection
        </button>
      </div>
    );
  }

  const { user, application, stats } = data!;
  const toolsList = application?.primaryTools
    ? application.primaryTools.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Profile Hero & Identity Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-white via-white/95 to-indigo-50/40 p-6 sm:p-8 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Creator Avatar */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-3xl font-black tracking-wider">
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141413]">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                  <Sparkles size={12} />
                  AdSpolisher Creator
                </span>
                {user.emailVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <ShieldCheck size={12} />
                    Verified
                  </span>
                )}
              </div>

              <div className="text-sm text-[#5A5852] flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={13} className="text-neutral-400" />
                  {user.email}
                </span>
                {application?.location && (
                  <>
                    <span className="text-neutral-300">·</span>
                    <span className="inline-flex items-center gap-1 text-xs">
                      <MapPin size={13} className="text-neutral-400" />
                      {application.location}
                    </span>
                  </>
                )}
                <span className="text-neutral-300">·</span>
                <span className="text-xs text-neutral-500">
                  Creator since {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                </span>
              </div>

              {/* Badges */}
              <div className="pt-1.5 flex flex-wrap items-center gap-2">
                {application?.craftSpecialty && (
                  <span className="rounded-lg bg-neutral-900 px-3 py-1 text-xs font-bold text-white shadow-2xs">
                    {application.craftSpecialty}
                  </span>
                )}
                {application?.experienceLevel && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    <Award size={12} className="text-amber-600" />
                    {application.experienceLevel}
                  </span>
                )}
                {application?.weeklyAvailability && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                    <Clock size={12} className="text-emerald-600" />
                    {application.weeklyAvailability}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            <Link
              href="/creator/settings"
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition"
            >
              <Pencil size={13} />
              <span>Edit Profile & Skills</span>
            </Link>
            <Link
              href="/creator/portfolio"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-800 shadow-xs hover:bg-neutral-50 transition"
            >
              <Sparkles size={13} className="text-indigo-600" />
              <span>View Portfolio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Statistics Overview */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <article className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Assigned Sprints
            </p>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <FolderKanban size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black tabular-nums text-neutral-900">
            {stats.totalProjects.toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">Campaigns & Pods</p>
        </article>

        <article className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Shipped Deliverables
            </p>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <Layers size={16} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-black tabular-nums text-neutral-900">
            {stats.deliverablesCount.toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">Creative assets uploaded</p>
        </article>

        <article className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Creator Tier
            </p>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Award size={16} />
            </span>
          </div>
          <p className="mt-3 text-xl font-black text-neutral-900">
            {application?.experienceLevel ? application.experienceLevel.split("(")[0].trim() : "Approved"}
          </p>
          <p className="mt-1 text-xs text-neutral-500">AdSpolisher Network</p>
        </article>

        <article className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Sprint Availability
            </p>
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Clock size={16} />
            </span>
          </div>
          <p className="mt-3 text-sm font-black text-neutral-900 line-clamp-1">
            {application?.weeklyAvailability || "Flexible"}
          </p>
          <p className="mt-1 text-xs text-neutral-500">Open for new offers</p>
        </article>
      </div>

      {/* 3. Detailed Profile Info Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card 1: Personal & Identity Details */}
        <section className="space-y-5 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-indigo-600" />
              <h3 className="text-base font-bold text-neutral-900">Personal & Account Details</h3>
            </div>
            <Link
              href="/creator/settings"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              <span>Edit</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            {/* Display Name */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Full Legal / Display Name
              </span>
              <p className="mt-1 text-sm font-bold text-neutral-900">{user.name}</p>
            </div>

            {/* Email Address */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Email Address
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 size={12} />
                  Verified & Active
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-neutral-900">{user.email}</p>
            </div>

            {/* Location & Timezone */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Location & Timezone
              </span>
              <p className="mt-1 text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                <MapPin size={14} className="text-neutral-400" />
                {application?.location || "Global Remote"}
              </p>
            </div>

            {/* Bio & Philosophy */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Bio & Creative Philosophy
              </span>
              <p className="mt-1.5 text-xs text-neutral-700 leading-relaxed italic">
                {application?.notes ? (
                  `"${application.notes}"`
                ) : (
                  <span className="not-italic text-neutral-400">
                    No bio added yet. You can add your creative statement and background in Settings.
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Card 2: Craft, Skills & External Showcase */}
        <section className="space-y-5 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-purple-600" />
              <h3 className="text-base font-bold text-neutral-900">Craft, Skills & Portfolios</h3>
            </div>
            <Link
              href="/creator/settings"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              <span>Edit</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            {/* Craft Specialty */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Craft Specialty
              </span>
              <p className="mt-1 text-sm font-bold text-indigo-700">
                {application?.craftSpecialty || "Creative Designer & Art Director"}
              </p>
            </div>

            {/* Primary Software & Tools */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Software & Primary Tools
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {toolsList.length > 0 ? (
                  toolsList.map((tool, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800 shadow-2xs"
                    >
                      <Wrench size={11} className="text-neutral-400" />
                      {tool}
                    </span>
                  ))
                ) : (
                  <span className="text-neutral-400">No primary tools specified yet.</span>
                )}
              </div>
            </div>

            {/* Experience Level & Availability */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Experience Tier
                </span>
                <p className="mt-1 text-xs font-bold text-neutral-800">
                  {application?.experienceLevel || "Mid-Level Specialist"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Sprint Capacity
                </span>
                <p className="mt-1 text-xs font-bold text-neutral-800">
                  {application?.weeklyAvailability || "Flexible"}
                </p>
              </div>
            </div>

            {/* External Links */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                External Showcase & Social Profiles
              </span>
              <div className="flex flex-col gap-2 pt-1">
                {application?.portfolioUrl ? (
                  <a
                    href={application.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-900 shadow-2xs hover:bg-neutral-50 hover:text-indigo-600 transition"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Globe size={14} className="text-indigo-500 shrink-0" />
                      <span className="truncate">{application.portfolioUrl}</span>
                    </span>
                    <ExternalLink size={13} className="shrink-0 text-neutral-400" />
                  </a>
                ) : (
                  <p className="text-neutral-400">No external portfolio URL configured.</p>
                )}

                {application?.secondaryUrl && (
                  <a
                    href={application.secondaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-900 shadow-2xs hover:bg-neutral-50 hover:text-indigo-600 transition"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <ExternalLink size={14} className="text-purple-500 shrink-0" />
                      <span className="truncate">{application.secondaryUrl}</span>
                    </span>
                    <ExternalLink size={13} className="shrink-0 text-neutral-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Edit Prompt Footer Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-neutral-900">Need to update your profile or craft details?</h4>
          <p className="text-xs text-neutral-500">
            You can modify your full name, avatar picture, location, tools, availability, and portfolio links in Settings.
          </p>
        </div>
        <Link
          href="/creator/settings"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition shrink-0"
        >
          <Settings2 size={14} />
          <span>Go to Settings to Edit</span>
        </Link>
      </div>
    </div>
  );
}
