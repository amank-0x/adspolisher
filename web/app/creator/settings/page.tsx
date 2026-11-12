"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { backendFetch } from "@/lib/backend-api";
import {
  Settings2,
  Lock,
  Camera,
  Bell,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Sparkles,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
  Laptop,
  Save,
  RotateCcw,
  Wrench,
  Clock,
  Award,
  MapPin,
  FileText,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
];

const CRAFT_OPTIONS = [
  "Motion Graphics & 3D Ads",
  "Performance Creative & Static Ads",
  "UGC & Short-Form Video Hooks",
  "Brand Identity & Vector Systems",
  "High-Converting E-commerce Carousels",
  "Visual Design & Retouching",
  "Full-Stack Creative / Art Direction",
];

const EXPERIENCE_OPTIONS = [
  "Junior Creator (1–2 yrs)",
  "Mid-Level Specialist (3–5 yrs)",
  "Senior Creative (5–8 yrs)",
  "Lead Creator / Art Director (8+ yrs)",
];

const AVAILABILITY_OPTIONS = [
  "10–15 hrs/week (Part-time sprints)",
  "20–30 hrs/week (Dedicated half-time)",
  "35–40 hrs/week (Full-time sprints)",
  "Flexible / Ad-hoc projects only",
];

type SettingsTab = "profile" | "avatar" | "password" | "notifications";

function CreatorSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as SettingsTab) || "profile";
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  const { data: session } = useSession();

  // General Loading & Notification states
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Profile & Craft Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [craftSpecialty, setCraftSpecialty] = useState(CRAFT_OPTIONS[0]);
  const [primaryTools, setPrimaryTools] = useState("");
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_OPTIONS[1]);
  const [weeklyAvailability, setWeeklyAvailability] = useState(AVAILABILITY_OPTIONS[1]);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [secondaryUrl, setSecondaryUrl] = useState("");
  const [notes, setNotes] = useState("");

  // Avatar states
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Notification preferences
  const [notifySprintInvites, setNotifySprintInvites] = useState(true);
  const [notifyReviews, setNotifyReviews] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyPayouts, setNotifyPayouts] = useState(true);
  const [prefSaved, setPrefSaved] = useState(false);

  // Load all user profile and craft information
  const loadProfileData = async () => {
    setLoading(true);
    try {
      const res = await backendFetch("/api/v1/creator/profile");
      const json = await res.json();
      if (json.success && json.data) {
        const u = json.data.user;
        const app = json.data.application;

        setName(u.name || "");
        setEmail(u.email || "");
        setCurrentImage(u.image || null);
        setCustomImageUrl(u.image || "");

        if (app) {
          setLocation(app.location || "");
          setCraftSpecialty(app.craftSpecialty || CRAFT_OPTIONS[0]);
          setPrimaryTools(app.primaryTools || "");
          setExperienceLevel(app.experienceLevel || EXPERIENCE_OPTIONS[1]);
          setWeeklyAvailability(app.weeklyAvailability || AVAILABILITY_OPTIONS[1]);
          setPortfolioUrl(app.portfolioUrl || "");
          setSecondaryUrl(app.secondaryUrl || "");
          setNotes(app.notes || "");

          if (app.notificationPreferences) {
            setNotifySprintInvites(app.notificationPreferences.sprintInvites ?? true);
            setNotifyReviews(app.notificationPreferences.reviews ?? true);
            setNotifyMessages(app.notificationPreferences.messages ?? true);
            setNotifyPayouts(app.notificationPreferences.payouts ?? true);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load creator settings data:", err);
      setProfileMsg({ type: "error", text: "Failed to load current settings." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // Handle Profile & Skills save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileMsg({ type: "error", text: "Please enter your full name." });
      return;
    }

    setSavingProfile(true);
    setProfileMsg(null);

    try {
      const res = await backendFetch("/api/v1/creator/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: currentImage,
          location: location.trim(),
          craftSpecialty: craftSpecialty.trim(),
          primaryTools: primaryTools.trim(),
          experienceLevel: experienceLevel.trim(),
          weeklyAvailability: weeklyAvailability.trim(),
          portfolioUrl: portfolioUrl.trim(),
          secondaryUrl: secondaryUrl.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update profile.");
      }

      setProfileMsg({ type: "success", text: "Personal details, craft, and skills updated successfully!" });
    } catch (err: any) {
      console.error("Profile save error:", err);
      setProfileMsg({ type: "error", text: err?.message || "Failed to update settings." });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle avatar update
  const handleSaveAvatar = async (imageUrlToSave: string | null) => {
    setAvatarLoading(true);
    setAvatarMsg(null);
    try {
      const res = await backendFetch("/api/v1/creator/settings/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: imageUrlToSave }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update profile image.");
      }
      setCurrentImage(imageUrlToSave);
      setCustomImageUrl(imageUrlToSave || "");
      setAvatarMsg({ type: "success", text: "Profile image updated successfully!" });
    } catch (err: any) {
      console.error("Avatar update error:", err);
      setAvatarMsg({ type: "error", text: err?.message || "Failed to update avatar image." });
    } finally {
      setAvatarLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword) {
      setPasswordMsg({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await backendFetch("/api/v1/creator/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to change password.");
      }
      setPasswordMsg({ type: "success", text: "Your password has been changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Password change error:", err);
      setPasswordMsg({ type: "error", text: err?.message || "Failed to update password." });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      const res = await backendFetch("/api/v1/creator/settings/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sprintInvites: notifySprintInvites,
          reviews: notifyReviews,
          messages: notifyMessages,
          payouts: notifyPayouts,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setPrefSaved(true);
        setTimeout(() => setPrefSaved(false), 3000);
      }
    } catch (err) {
      console.error("Save notifications error", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/creator/login");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  const getInitials = (n?: string) => {
    if (!n) return "CR";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-44 animate-pulse rounded-3xl bg-neutral-200/70" />
        <div className="h-96 animate-pulse rounded-3xl bg-neutral-200/60" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Settings Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-white via-white/95 to-indigo-50/40 p-6 sm:p-8 shadow-[0_8px_30px_rgba(20,20,19,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1 text-xs font-semibold text-neutral-600 backdrop-blur-md shadow-xs mb-2">
              <Settings2 size={13} className="text-indigo-600" />
              <span>Creator Management Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141413]">
              Creator Account Settings
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#5A5852]">
              Edit your personal details, craft specialty, software tools, profile picture, and account credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/creator/profile"
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-800 shadow-xs hover:bg-neutral-50 transition"
            >
              <User size={13} />
              <span>View My Profile</span>
            </Link>
            <Link
              href="/creator/portfolio"
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition"
            >
              <Sparkles size={13} />
              <span>My Portfolio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-black/[0.08] pb-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "profile"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
          }`}
        >
          <User size={14} />
          <span>Personal & Craft Details</span>
        </button>

        <button
          onClick={() => setActiveTab("avatar")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "avatar"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
          }`}
        >
          <Camera size={14} />
          <span>Profile Image & Avatar</span>
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "password"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
          }`}
        >
          <KeyRound size={14} />
          <span>Change Password</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "notifications"
              ? "bg-neutral-900 text-white shadow-xs"
              : "bg-white text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
          }`}
        >
          <Bell size={14} />
          <span>Notifications & Sessions</span>
        </button>
      </div>

      {/* TAB 1: PERSONAL & CRAFT DETAILS (EDIT EVERYTHING) */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {profileMsg && (
            <div
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-xs font-semibold transition ${
                profileMsg.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {profileMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{profileMsg.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setProfileMsg(null)}
                className="text-neutral-400 hover:text-neutral-700 text-xs font-bold ml-4"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Personal Identity */}
            <div className="space-y-5 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xs backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <User size={18} className="text-indigo-600" />
                <h3 className="text-base font-bold text-neutral-900">Personal Identity</h3>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Full Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your legal or creator name"
                  required
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* Email Address (Read-only Account ID) */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Account Email
                  </label>
                  <span className="text-[10px] font-semibold text-neutral-400">Fixed identifier</span>
                </div>
                <div className="relative mt-1.5">
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-100/70 px-3.5 py-2.5 text-xs text-neutral-600 cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>

              {/* Location & Timezone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Location & Timezone
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA (PST) or Berlin, Germany (CET)"
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* Bio & Creative Statement */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Bio & Creative Philosophy
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share a short summary of your background, experience, style, and what creative advertising problems you love solving..."
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
                />
              </div>
            </div>

            {/* Right: Craft, Skills & External Links */}
            <div className="space-y-5 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xs backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <Sparkles size={18} className="text-purple-600" />
                <h3 className="text-base font-bold text-neutral-900">Craft, Skills & Availability</h3>
              </div>

              {/* Craft Specialty */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Craft Specialty
                </label>
                <select
                  value={craftSpecialty}
                  onChange={(e) => setCraftSpecialty(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                >
                  {CRAFT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Primary Software Tools */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Primary Software & Tools
                </label>
                <input
                  type="text"
                  value={primaryTools}
                  onChange={(e) => setPrimaryTools(e.target.value)}
                  placeholder="e.g. After Effects, Blender, Figma, Premiere Pro, Cinema 4D"
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                <p className="mt-1 text-[11px] text-neutral-500">Separate multiple tools with commas.</p>
              </div>

              {/* Experience Tier & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    {EXPERIENCE_OPTIONS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Sprint Capacity
                  </label>
                  <select
                    value={weeklyAvailability}
                    onChange={(e) => setWeeklyAvailability(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    {AVAILABILITY_OPTIONS.map((av) => (
                      <option key={av} value={av}>
                        {av}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Portfolio Showcase URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Primary Portfolio Showcase URL
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://behance.net/username or personal website"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {portfolioUrl && (
                    <a
                      href={portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-10 w-10 place-items-center shrink-0 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 transition"
                      title="Open showcase URL"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Secondary Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Secondary Link (Vimeo / Dribbble / ArtStation / Instagram)
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="url"
                    value={secondaryUrl}
                    onChange={(e) => setSecondaryUrl(e.target.value)}
                    placeholder="https://vimeo.com/username"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  {secondaryUrl && (
                    <a
                      href={secondaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-10 w-10 place-items-center shrink-0 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 transition"
                      title="Open secondary link"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs">
            <button
              type="button"
              onClick={loadProfileData}
              disabled={savingProfile}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition disabled:opacity-50"
            >
              <RotateCcw size={14} />
              <span>Reset to Saved</span>
            </button>

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-neutral-800 transition disabled:opacity-50"
            >
              {savingProfile ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Profile & Skills</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: PROFILE PICTURE & AVATAR */}
      {activeTab === "avatar" && (
        <section className="space-y-6 max-w-2xl rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-8 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Camera size={18} className="text-indigo-600" />
            <h3 className="text-base font-bold text-neutral-900">Profile Image & Visual Avatar</h3>
          </div>

          {avatarMsg && (
            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${
                avatarMsg.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {avatarMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{avatarMsg.text}</span>
            </div>
          )}

          {/* Current Avatar Display */}
          <div className="flex items-center gap-5">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-neutral-200 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-3xl font-black">
                  {getInitials(name || "Creator")}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-neutral-900">
                {name || "Creator Studio"}
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                This image will appear on project pods, team directories, and submission review cards.
              </p>
              {currentImage && (
                <button
                  type="button"
                  onClick={() => handleSaveAvatar(null)}
                  disabled={avatarLoading}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                >
                  Remove current photo
                </button>
              )}
            </div>
          </div>

          {/* Custom Image URL Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
              Custom Image URL
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
              <button
                type="button"
                onClick={() => handleSaveAvatar(customImageUrl.trim() || null)}
                disabled={avatarLoading || !customImageUrl.trim()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-neutral-800 transition disabled:opacity-40"
              >
                {avatarLoading ? <RefreshCw size={13} className="animate-spin" /> : "Apply Image"}
              </button>
            </div>
          </div>

          {/* Preset Avatars */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Or Choose a Curated Avatar Preset
            </label>
            <div className="grid grid-cols-6 gap-2.5">
              {AVATAR_PRESETS.map((preset, idx) => {
                const isSelected = currentImage === preset;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSaveAvatar(preset)}
                    disabled={avatarLoading}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition hover:scale-105 ${
                      isSelected ? "border-indigo-600 ring-2 ring-indigo-200" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                    {isSelected && (
                      <span className="absolute inset-0 grid place-items-center bg-indigo-900/40 text-white">
                        <Check size={16} className="stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: CHANGE PASSWORD */}
      {activeTab === "password" && (
        <section className="space-y-6 max-w-lg rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-8 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Lock size={18} className="text-amber-600" />
            <h3 className="text-base font-bold text-neutral-900">Change Account Password</h3>
          </div>

          {passwordMsg && (
            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${
                passwordMsg.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              {passwordMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 pr-10 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 pr-10 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 pr-10 text-xs text-neutral-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-neutral-800 transition disabled:opacity-50"
              >
                {passwordLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound size={14} />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB 4: NOTIFICATIONS & ACTIVE SESSIONS */}
      {activeTab === "notifications" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Notification Preferences */}
          <section className="space-y-5 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xs backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-purple-600" />
                <h3 className="text-base font-bold text-neutral-900">Notification Alerts</h3>
              </div>
              {prefSaved && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <Check size={12} />
                  Preferences saved!
                </span>
              )}
            </div>

            <div className="space-y-4">
              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-neutral-900">Sprint Assignments & Project Offers</p>
                  <p className="text-[11px] text-neutral-500">
                    Notify me immediately when an admin adds me to a new client campaign.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifySprintInvites}
                  onChange={(e) => setNotifySprintInvites(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 cursor-pointer border-t border-neutral-100 pt-3">
                <div>
                  <p className="text-xs font-bold text-neutral-900">Creative Review & Feedback</p>
                  <p className="text-[11px] text-neutral-500">
                    Receive alerts when clients or art directors leave frame annotations or request revisions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyReviews}
                  onChange={(e) => setNotifyReviews(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 cursor-pointer border-t border-neutral-100 pt-3">
                <div>
                  <p className="text-xs font-bold text-neutral-900">Direct Messages & Mentions</p>
                  <p className="text-[11px] text-neutral-500">
                    Email summary when team members mention @you in project discussions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyMessages}
                  onChange={(e) => setNotifyMessages(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 cursor-pointer border-t border-neutral-100 pt-3">
                <div>
                  <p className="text-xs font-bold text-neutral-900">Earnings & Payout Statements</p>
                  <p className="text-[11px] text-neutral-500">
                    Alerts when project milestone payouts are cleared to your account.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyPayouts}
                  onChange={(e) => setNotifyPayouts(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleSavePreferences}
              className="w-full rounded-xl border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-800 shadow-xs hover:bg-neutral-50 transition"
            >
              Save Notification Preferences
            </button>
          </section>

          {/* Security & Sessions */}
          <section className="space-y-5 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xs backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                <Shield size={18} className="text-emerald-600" />
                <h3 className="text-base font-bold text-neutral-900">Account Security & Sessions</h3>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                  <span className="text-neutral-500">Account Privilege:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    <ShieldCheck size={12} />
                    CREATOR ROLE
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                  <span className="text-neutral-500">Confidentiality Gate:</span>
                  <span className="font-semibold text-emerald-700">Strictly Enforced (No Client Budgets)</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                  <span className="text-neutral-500">Authentication:</span>
                  <span className="font-semibold text-neutral-800">Secure Session Cookie</span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                  <div className="flex items-center gap-2">
                    <Laptop size={14} className="text-neutral-400" />
                    <span className="text-neutral-700 font-medium">Current Active Device</span>
                  </div>
                  <span className="font-bold text-emerald-600">Online Now</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
              >
                <LogOut size={14} />
                <span>Sign out of all sessions</span>
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default function CreatorSettingsPage() {
  return (
    <Suspense fallback={<div className="h-44 animate-pulse rounded-3xl bg-neutral-200/70" />}>
      <CreatorSettingsContent />
    </Suspense>
  );
}
