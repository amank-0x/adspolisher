"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  FolderKanban,
  UserPlus,
  UserMinus,
  Check,
  Search,
  Sparkles,
  ArrowRight,
  Shield,
  Briefcase,
  Calendar,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  Palette,
  Video,
  PenTool,
  Clock,
  ChevronRight,
  Plus,
  Mail,
  UserCheck,
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

type TeamMember = {
  id: string;
  projectId: string;
  userId: string;
  roleTitle: string | null;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    appRole: string;
  };
};

type Project = {
  id: string;
  projectCode: string;
  title: string;
  status: ProjectStatus;
  brief?: string;
  dueDate: string | null;
  client?: {
    id?: string;
    name: string;
    email: string;
  };
  teamMembers?: TeamMember[];
  _count?: {
    teamMembers: number;
    deliverables: number;
  };
};

type Creator = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  appRole: string;
  createdAt: string;
  projectMemberships?: {
    id: string;
    roleTitle: string | null;
    project: {
      id: string;
      projectCode: string;
      title: string;
      status: string;
      dueDate: string | null;
    };
  }[];
};

type ProjectOffer = { id: string; offerCode: string; status: string; currentAmount: string; currency: string; roleTitle: string; scopeSummary: string; createdAt: string; creator: { id: string; name: string; email: string }; negotiation: { id: string; action: string; amount: string | null; message: string | null; actorRole: string }[] };

function keepLatestOfferPerCreator(offers: ProjectOffer[]) {
  const latest = new Map<string, ProjectOffer>();
  for (const offer of offers) {
    const existing = latest.get(offer.creator.id);
    if (!existing || new Date(offer.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
      latest.set(offer.creator.id, offer);
    }
  }
  return [...latest.values()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function fetchProjectOffers(projectId: string): Promise<ProjectOffer[]> {
  const response = await backendFetch(`/api/v1/projects/${projectId}/offers`);
  const payload = await response.json();
  if (!response.ok || !payload.success) throw new Error(payload.message || "Failed to refresh project offers.");
  return keepLatestOfferPerCreator(payload.data || []);
}

const DISCIPLINE_PRESETS = [
  "Lead Art Director",
  "Senior Motion Designer",
  "Video Editor & Colorist",
  "Creative Copywriter",
  "3D & VFX Artist",
  "Social Performance Specialist",
  "General Creator",
];

const STATUS_PILLS: Record<
  ProjectStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  INTAKE: { label: "Intake", bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" },
  PLANNED: { label: "Planned", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  IN_PROGRESS: { label: "Ongoing", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500 animate-pulse" },
  IN_REVIEW: { label: "Review", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  WAITING_FOR_CLIENT: { label: "Client QA", bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  COMPLETED: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  ON_HOLD: { label: "On Hold", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
};

function AdminTeamPageInner() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("projectId") || "";

  const [projects, setProjects] = useState<Project[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const [loading, setLoading] = useState(true);
  const [projectSearch, setProjectSearch] = useState("");
  const [creatorSearch, setCreatorSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form state for adding/inviting new creator to roster
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newCreatorEmail, setNewCreatorEmail] = useState("");
  const [newCreatorName, setNewCreatorName] = useState("");
  const [invitingCreator, setInvitingCreator] = useState(false);

  // Discipline selection state per creator when adding to team
  const [selectedDisciplines, setSelectedDisciplines] = useState<Record<string, string>>({});
  const [offerAmounts, setOfferAmounts] = useState<Record<string, string>>({});
  const [offerScopes, setOfferScopes] = useState<Record<string, string>>({});
  const [projectOffers, setProjectOffers] = useState<ProjectOffer[]>([]);
  const [counterAmounts, setCounterAmounts] = useState<Record<string, string>>({});
  const [processingUserIds, setProcessingUserIds] = useState<Record<string, boolean>>({});

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      const [projRes, creatorRes] = await Promise.all([
        backendFetch("/api/v1/projects"),
        backendFetch("/api/v1/projects/roster/creators"),
      ]);

      const [projData, creatorData] = await Promise.all([
        projRes.json(),
        creatorRes.json(),
      ]);

      if (projData.success && Array.isArray(projData.data)) {
        setProjects(projData.data);
        // If no selected project yet, auto-select the first ongoing/intake project or first project
        if (!selectedProjectId && projData.data.length > 0) {
          const priority = projData.data.find(
            (p: Project) => p.status === "IN_PROGRESS" || p.status === "INTAKE"
          );
          setSelectedProjectId(priority ? priority.id : projData.data[0].id);
        }
      }

      if (creatorData.success && Array.isArray(creatorData.data)) {
        setCreators(creatorData.data);
      }
    } catch (err: any) {
      console.error("[LOAD TEAM DATA ERROR]", err);
      showToast("Error loading projects and creators", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) { setProjectOffers([]); return; }
    let active = true;
    void fetchProjectOffers(selectedProjectId).then((offers) => {
      if (active) setProjectOffers(offers);
    }).catch(() => { if (active) setProjectOffers([]); });
    return () => { active = false; };
  }, [selectedProjectId]);

  const respondToCounter = async (offer: ProjectOffer, action: "ACCEPT_COUNTER" | "COUNTER") => {
    try {
      const response = await backendFetch(`/api/v1/projects/${selectedProjectId}/offers/${offer.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "COUNTER" ? { action, amount: Number(counterAmounts[offer.id]), message: "We have reviewed your fee request and are proposing this revised amount." } : { action }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Could not respond to counter-offer.");
      showToast(payload.message);
      setProjectOffers(await fetchProjectOffers(selectedProjectId));
      void loadData();
    } catch (error) { showToast(error instanceof Error ? error.message : "Could not respond to counter-offer.", "error"); }
  };

  // Update selectedProjectId if query param changes
  useEffect(() => {
    if (initialProjectId && initialProjectId !== selectedProjectId) {
      setSelectedProjectId(initialProjectId);
    }
  }, [initialProjectId]);

  // Selected project object
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Project team members
  const currentTeamMembers = useMemo(() => {
    return activeProject?.teamMembers || [];
  }, [activeProject]);

  // Set of user IDs currently on the active project
  const currentTeamUserIds = useMemo(() => {
    return new Set(currentTeamMembers.map((m) => m.userId));
  }, [currentTeamMembers]);

  // Filtered projects list for selection
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (!projectSearch.trim()) return true;
      const q = projectSearch.toLowerCase().trim();
      return (
        p.projectCode?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q) ||
        p.client?.name?.toLowerCase().includes(q)
      );
    });
  }, [projects, projectSearch]);

  // Filtered creators list
  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      if (!creatorSearch.trim()) return true;
      const q = creatorSearch.toLowerCase().trim();
      return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
    });
  }, [creators, creatorSearch]);

  // Add Creator to Active Project Team
  const handleAddMember = async (creatorId: string) => {
    if (!selectedProjectId) {
      showToast("Please choose a project first", "error");
      return;
    }

    const discipline = selectedDisciplines[creatorId] || "Lead Art Director";
    setProcessingUserIds((prev) => ({ ...prev, [creatorId]: true }));

    try {
      const res = await backendFetch(`/api/v1/projects/${selectedProjectId}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId,
          roleTitle: discipline,
          scopeSummary: offerScopes[creatorId] || "",
          amount: Number(offerAmounts[creatorId]),
          currency: "INR",
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Project offer sent to creator");
        try {
          setProjectOffers(await fetchProjectOffers(selectedProjectId));
        } catch (refreshError) {
          console.error("[REFRESH PROJECT OFFERS ERROR]", refreshError);
        }
        void loadData();
      } else {
        if (res.status === 404 || data.code === "CREATOR_NOT_AVAILABLE") void loadData();
        showToast(data.message || "Failed to add creator to team", "error");
      }
    } catch (err: any) {
      console.error("[ADD MEMBER ERROR]", err);
      showToast("Network error while sending project offer", "error");
    } finally {
      setProcessingUserIds((prev) => ({ ...prev, [creatorId]: false }));
    }
  };

  // Remove Creator from Active Project Team
  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (!selectedProjectId) return;
    if (!confirm(`Remove ${memberName} from this project's creative pod?`)) return;

    setProcessingUserIds((prev) => ({ ...prev, [userId]: true }));

    try {
      const res = await backendFetch(`/api/v1/projects/${selectedProjectId}/team/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Creator removed from team");
        void loadData();
      } else {
        showToast(data.message || "Failed to remove member", "error");
      }
    } catch (err: any) {
      console.error("[REMOVE MEMBER ERROR]", err);
      showToast("Network error removing member", "error");
    } finally {
      setProcessingUserIds((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Update Role/Discipline of an existing team member
  const handleUpdateRole = async (userId: string, newRoleTitle: string) => {
    if (!selectedProjectId || !newRoleTitle.trim()) return;

    try {
      const res = await backendFetch(`/api/v1/projects/${selectedProjectId}/team/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleTitle: newRoleTitle.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("Role updated");
        void loadData();
      } else {
        showToast(data.message || "Failed to update role", "error");
      }
    } catch (err) {
      showToast("Error updating role", "error");
    }
  };

  // Invite / Register new Creator to agency roster
  const handleInviteCreator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invitingCreator || !newCreatorEmail.trim()) return;

    setInvitingCreator(true);
    try {
      const res = await backendFetch("/api/v1/projects/roster/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newCreatorEmail.trim(),
          name: newCreatorName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Creator added to roster");
        setShowInviteModal(false);
        setNewCreatorEmail("");
        setNewCreatorName("");
        void loadData();
      } else {
        showToast(data.message || "Failed to register creator", "error");
      }
    } catch (err: any) {
      showToast("Network error registering creator", "error");
    } finally {
      setInvitingCreator(false);
    }
  };

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalCreators = creators.length;
    const staffedProjects = projects.filter(
      (p) => (p.teamMembers?.length || 0) > 0 || (p._count?.teamMembers || 0) > 0
    ).length;
    const activeProjectsCount = projects.filter(
      (p) => p.status === "IN_PROGRESS" || p.status === "INTAKE"
    ).length;
    return { totalCreators, staffedProjects, activeProjectsCount };
  }, [creators, projects]);

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            toastMessage.type === "success"
              ? "border border-emerald-300 bg-emerald-950/90 text-emerald-100"
              : "border border-rose-300 bg-rose-950/90 text-rose-100"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#4F46E5]">
            <Sparkles className="h-3.5 w-3.5" /> Creative Pod &amp; Team Operations
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
            Project Team Builder
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Select a project and build its creative pod with verified Creators. Add members, set disciplines, and coordinate assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800"
          >
            <UserPlus className="h-3.5 w-3.5" /> Register Creator
          </button>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void loadData();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur-xl transition hover:bg-white hover:text-black"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Creator Roster</span>
            <Users className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <p className="mt-3 text-2xl font-black text-neutral-950">{metrics.totalCreators}</p>
          <span className="text-[11px] text-neutral-500">Certified Creators in database</span>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Staffed Projects</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-3 text-2xl font-black text-emerald-600">{metrics.staffedProjects}</p>
          <span className="text-[11px] text-neutral-500">Contracts with assigned pod</span>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Pipeline</span>
            <FolderKanban className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="mt-3 text-2xl font-black text-indigo-600">{metrics.activeProjectsCount}</p>
          <span className="text-[11px] text-neutral-500">Ongoing &amp; intake contracts</span>
        </div>

        <div className="rounded-2xl border border-black/[0.07] bg-white/80 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Pod Security</span>
            <Shield className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-3 text-2xl font-black text-purple-600">Strict</p>
          <span className="text-[11px] text-neutral-500">Only verified Creators permitted</span>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Project Selector (4 cols) */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-3xl border border-black/[0.08] bg-white/85 p-5 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  1. Choose Project
                </h2>
                <p className="text-xs text-neutral-500">
                  Select a contract to view &amp; build its team
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-bold text-neutral-600">
                {projects.length}
              </span>
            </div>

            {/* Project Search */}
            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search project code or title…"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white/90 pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
              />
            </div>

            {/* Projects List */}
            <div className="mt-4 max-h-[560px] space-y-2 overflow-y-auto pr-1">
              {filteredProjects.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  No projects found.
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const isSelected = p.id === selectedProjectId;
                  const statusCfg = STATUS_PILLS[p.status] || STATUS_PILLS.INTAKE;
                  const memberCount = p.teamMembers?.length ?? p._count?.teamMembers ?? 0;

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProjectId(p.id)}
                      className={`w-full rounded-2xl border p-3.5 text-left transition ${
                        isSelected
                          ? "border-[#4F46E5] bg-[#4F46E5]/[0.06] shadow-sm ring-2 ring-[#4F46E5]/20"
                          : "border-black/[0.06] bg-white/60 hover:bg-white hover:border-black/15"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-bold text-neutral-500">
                          {p.projectCode}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusCfg.bg} ${statusCfg.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      </div>

                      <h3
                        className={`mt-1.5 text-xs font-bold leading-snug ${
                          isSelected ? "text-[#4F46E5]" : "text-neutral-900"
                        }`}
                      >
                        {p.title}
                      </h3>

                      <div className="mt-2.5 flex items-center justify-between border-t border-black/[0.04] pt-2 text-[11px] text-neutral-500">
                        <span>{p.client?.name || "Client"}</span>
                        <span
                          className={`flex items-center gap-1 font-semibold ${
                            memberCount > 0 ? "text-emerald-700" : "text-neutral-400"
                          }`}
                        >
                          <Users className="h-3 w-3" />
                          {memberCount} {memberCount === 1 ? "Creator" : "Creators"}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Creative Pod for Chosen Project (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {activeProject ? (
            <>
              {/* Active Project Card Header */}
              <div className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-500">
                        {activeProject.projectCode}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          (STATUS_PILLS[activeProject.status] || STATUS_PILLS.INTAKE).bg
                        } ${(STATUS_PILLS[activeProject.status] || STATUS_PILLS.INTAKE).text}`}
                      >
                        {(STATUS_PILLS[activeProject.status] || STATUS_PILLS.INTAKE).label}
                      </span>
                    </div>
                    <h2 className="mt-1 text-xl font-black text-neutral-950 sm:text-2xl">
                      {activeProject.title}
                    </h2>
                  </div>

                  <Link
                    href={`/admin/projects/${activeProject.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-50"
                  >
                    View Project Details <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {activeProject.brief && (
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                    {activeProject.brief}
                  </p>
                )}
              </div>

              <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3"><div><h3 className="text-base font-bold text-neutral-900">Project offers</h3><p className="mt-1 text-xs text-neutral-500">Latest offer per creator. Earlier offers remain saved in the database.</p></div><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600">{projectOffers.length}</span></div>
                <div className="mt-4 space-y-3">
                  {projectOffers.length === 0 ? <p className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-500">No offers sent for this project yet.</p> : projectOffers.map((offer) => <article key={offer.id} className="rounded-2xl border border-black/[0.06] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-bold">{offer.creator.name || offer.creator.email} <span className="font-normal text-neutral-500">· {offer.roleTitle}</span></p><p className="text-xs text-neutral-500">{offer.offerCode} · {offer.creator.email}</p></div><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase">{offer.status.replaceAll("_", " ")}</span></div>
                    <p className="mt-2 text-xs text-neutral-600">Current fee: <strong>{offer.currency} {Number(offer.currentAmount).toLocaleString()}</strong></p>
                    {offer.status === "COUNTERED_BY_CREATOR" && <div className="mt-3 flex flex-wrap items-center gap-2"><button type="button" onClick={() => void respondToCounter(offer, "ACCEPT_COUNTER")} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white">Accept creator fee</button><input type="number" min="1" step="0.01" value={counterAmounts[offer.id] || ""} onChange={(event) => setCounterAmounts((prev) => ({ ...prev, [offer.id]: event.target.value }))} placeholder={`Revised fee (${offer.currency})`} className="w-40 rounded-lg border border-black/10 px-3 py-2 text-xs"/><button type="button" disabled={!Number(counterAmounts[offer.id])} onClick={() => void respondToCounter(offer, "COUNTER")} className="rounded-lg bg-[#4F46E5] px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Send revised offer</button></div>}
                    <details className="mt-3 text-xs text-neutral-600"><summary className="cursor-pointer font-semibold">Negotiation history</summary><div className="mt-2 space-y-2">{offer.negotiation.map((entry) => <p key={entry.id} className="rounded-lg bg-neutral-50 p-2"><strong>{entry.actorRole} · {entry.action}</strong>{entry.amount ? ` · ${offer.currency} ${Number(entry.amount).toLocaleString()}` : ""}{entry.message ? <span className="block mt-1">{entry.message}</span> : null}</p>)}</div></details>
                  </article>)}
                </div>
              </section>

              {/* Current Creative Pod Members */}
              <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#4F46E5]" />
                    <h3 className="text-base font-bold text-neutral-900">
                      Active Creative Pod ({currentTeamMembers.length})
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Team assigned to produce and deliver this contract
                  </span>
                </div>

                {/* Team Members List */}
                <div className="mt-5 space-y-3">
                  {currentTeamMembers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50/60 p-8 text-center">
                      <Users className="mx-auto h-8 w-8 text-neutral-400" />
                      <p className="mt-2 text-xs font-semibold text-neutral-700">
                        No creators assigned to this project yet.
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-500">
                        Choose certified creators from the roster below and assign them to this project pod.
                      </p>
                    </div>
                  ) : (
                    currentTeamMembers.map((member) => {
                      const isRemoving = processingUserIds[member.userId];

                      return (
                        <div
                          key={member.id}
                          className="flex flex-col justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#4F46E5]/10 font-bold text-[#4F46E5]">
                              {member.user.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={member.user.image}
                                  alt={member.user.name}
                                  className="h-full w-full rounded-2xl object-cover"
                                />
                              ) : (
                                (member.user.name || member.user.email || "C")
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="truncate text-sm font-bold text-neutral-900">
                                  {member.user.name || "Creator"}
                                </h4>
                                <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.2 text-[9px] font-bold text-purple-700">
                                  {member.user.appRole}
                                </span>
                              </div>
                              <p className="truncate text-xs text-neutral-500">
                                {member.user.email}
                              </p>
                              <span className="text-[10px] text-neutral-400">
                                Joined Pod: {new Date(member.joinedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Editable Discipline Dropdown */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-neutral-500">
                                Role:
                              </span>
                              <select
                                value={member.roleTitle || "Creator"}
                                onChange={(e) => handleUpdateRole(member.userId, e.target.value)}
                                className="rounded-xl border border-black/10 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:border-[#4F46E5] focus:outline-none"
                              >
                                {DISCIPLINE_PRESETS.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Remove Member Button */}
                            <button
                              type="button"
                              disabled={isRemoving}
                              onClick={() =>
                                handleRemoveMember(member.userId, member.user.name || member.user.email)
                              }
                              className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                              {isRemoving ? "Removing…" : "Remove"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Available Creators Roster (Add to Team) */}
              <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Agency Creators Roster
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Add certified Creators to the selected project pod
                    </p>
                  </div>

                  <div className="relative min-w-[220px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Search creators…"
                      value={creatorSearch}
                      onChange={(e) => setCreatorSearch(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {filteredCreators.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-500">
                      No creators found matching &quot;{creatorSearch}&quot;.
                    </div>
                  ) : (
                    filteredCreators.map((creator) => {
                      const isOnTeam = currentTeamUserIds.has(creator.id);
                      const isProcessing = processingUserIds[creator.id];
                      const activeWorkload = creator.projectMemberships?.length || 0;
                      const selectedDiscipline =
                        selectedDisciplines[creator.id] || "Lead Art Director";

                      return (
                        <div
                          key={creator.id}
                          className={`flex flex-col justify-between gap-3 rounded-2xl border p-4 transition sm:flex-row sm:items-center ${
                            isOnTeam
                              ? "border-emerald-200/80 bg-emerald-50/40"
                              : "border-black/[0.06] bg-white hover:border-black/15 shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 font-bold text-neutral-700">
                              {creator.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={creator.image}
                                  alt={creator.name}
                                  className="h-full w-full rounded-xl object-cover"
                                />
                              ) : (
                                (creator.name || creator.email || "C").charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-neutral-900">
                                  {creator.name || "Creator"}
                                </h4>
                                <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.2 text-[9px] font-bold text-indigo-700">
                                  CREATOR
                                </span>
                              </div>
                              <p className="text-[11px] text-neutral-500">{creator.email}</p>
                              <span className="text-[10px] text-neutral-400">
                                Active in {activeWorkload}{" "}
                                {activeWorkload === 1 ? "project" : "projects"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {isOnTeam ? (
                              <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-100/70 px-3 py-1.5 text-xs font-bold text-emerald-800">
                                <Check className="h-3.5 w-3.5" /> On This Team
                              </div>
                            ) : (
                              <>
                                {/* Discipline preset selector */}
                                <select
                                  value={selectedDiscipline}
                                  onChange={(e) =>
                                    setSelectedDisciplines((prev) => ({
                                      ...prev,
                                      [creator.id]: e.target.value,
                                    }))
                                  }
                                  className="rounded-xl border border-black/10 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-800 focus:border-[#4F46E5] focus:outline-none"
                                >
                                  {DISCIPLINE_PRESETS.map((d) => (
                                    <option key={d} value={d}>
                                      {d}
                                    </option>
                                  ))}
                                </select>

                                <input
                                  type="number"
                                  min="1"
                                  step="0.01"
                                  required
                                  placeholder="Offer amount (INR)"
                                  aria-label={`Project fee for ${creator.name || creator.email}`}
                                  value={offerAmounts[creator.id] || ""}
                                  onChange={(event) => setOfferAmounts((current) => ({ ...current, [creator.id]: event.target.value }))}
                                  className="w-36 rounded-xl border border-black/10 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-800 focus:border-[#4F46E5] focus:outline-none"
                                />
                                <textarea
                                  rows={2}
                                  required
                                  placeholder="Creator-facing scope and deliverables"
                                  aria-label={`Offer scope for ${creator.name || creator.email}`}
                                  value={offerScopes[creator.id] || ""}
                                  onChange={(event) => setOfferScopes((current) => ({ ...current, [creator.id]: event.target.value }))}
                                  className="w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 focus:border-[#4F46E5] focus:outline-none sm:max-w-64"
                                />
                                <button
                                  type="button"
                                  disabled={isProcessing || !Number(offerAmounts[creator.id]) || !offerScopes[creator.id]?.trim()}
                                  onClick={() => handleAddMember(creator.id)}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#4F46E5] disabled:opacity-50"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                  {isProcessing ? "Sending…" : "Send request to creator"}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-black/10 bg-white/70 p-12 text-center">
              <FolderKanban className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-4 text-base font-bold text-neutral-900">No project selected</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Choose a project from the left panel to configure its creative pod.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Register Creator Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#4F46E5]" />
                <h3 className="text-base font-bold text-neutral-900">
                  Register Creator in Roster
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Add a new creative specialist or promote an existing account. The user will be assigned the verified <strong className="text-neutral-900">CREATOR</strong> role and can be immediately assigned to project teams.
            </p>

            <form onSubmit={handleInviteCreator} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={newCreatorName}
                  onChange={(e) => setNewCreatorName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 focus:border-[#4F46E5] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700">
                  Creator Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="creator@agency.com"
                  value={newCreatorEmail}
                  onChange={(e) => setNewCreatorEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-neutral-50 px-3.5 py-2 text-xs text-neutral-900 focus:border-[#4F46E5] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={invitingCreator}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
                >
                  {invitingCreator && <RefreshCw className="h-3 w-3 animate-spin" />}
                  Register as Creator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminTeamPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-[#4F46E5]" />
        </div>
      }
    >
      <AdminTeamPageInner />
    </Suspense>
  );
}
