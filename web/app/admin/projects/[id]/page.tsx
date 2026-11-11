"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  FileCheck2,
  FolderKanban,
  Layers,
  Mail,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  User,
  Users,
  XCircle,
  AlertCircle,
  Check,
  Eye,
  FileText,
  Building,
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

type DeliverableStatus = "DRAFT" | "SHARED" | "CHANGES_REQUESTED" | "APPROVED";

type Deliverable = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  fileUrl: string;
  previewUrl: string | null;
  version: number;
  status: DeliverableStatus;
  sharedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

type ProjectDetail = {
  id: string;
  projectCode: string;
  title: string;
  brief: string;
  status: ProjectStatus;
  budget: number | string | null;
  currency: string;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt?: string;
  };
  assignedTo: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    appRole: string;
  } | null;
  deliverables: Deliverable[];
  teamMembers?: {
    id: string;
    roleTitle: string | null;
    joinedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
      appRole: string;
    };
  }[];
  quoteRequest?: {
    id: string;
    status: string;
    companyName: string | null;
    companyWebsite: string | null;
    message: string;
    attachments: any;
    createdAt: string;
  } | null;
  _count?: {
    messages: number;
  };
};

type Creator = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  appRole: string;
};

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; bg: string; text: string; border: string; dot: string; desc: string }
> = {
  INTAKE: {
    label: "Intake & Scoping",
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
    desc: "Project brief received, preparing scoping & assignment",
  },
  PLANNED: {
    label: "Planned",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    desc: "Scope confirmed and scheduled for creative pod kick-off",
  },
  IN_PROGRESS: {
    label: "Ongoing / In Progress",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-500 animate-pulse",
    desc: "Creative pod is actively designing & producing deliverables",
  },
  IN_REVIEW: {
    label: "Internal Review",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
    desc: "Creative assets are undergoing internal art director QA",
  },
  WAITING_FOR_CLIENT: {
    label: "Waiting for Client",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
    desc: "Deliverables shared with client, awaiting review or approval",
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    desc: "All deliverables approved and final creative released",
  },
  ON_HOLD: {
    label: "Closed / On Hold",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    desc: "Project is temporarily paused or closed",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
    desc: "Project cancelled and inactive",
  },
};

const DELIVERABLE_STATUS_CONFIG: Record<
  DeliverableStatus,
  { label: string; badgeClass: string }
> = {
  DRAFT: {
    label: "Draft",
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200",
  },
  SHARED: {
    label: "Shared with Client",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  CHANGES_REQUESTED: {
    label: "Changes Requested",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Approved & Final",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const PIPELINE_STEPS: { key: ProjectStatus; title: string; subtitle: string }[] = [
  { key: "INTAKE", title: "1. Intake", subtitle: "Scoping & Pod Setup" },
  { key: "IN_PROGRESS", title: "2. Production", subtitle: "Ongoing Creation" },
  { key: "IN_REVIEW", title: "3. Internal QA", subtitle: "Studio Polish" },
  { key: "WAITING_FOR_CLIENT", title: "4. Client Review", subtitle: "Feedback & Approval" },
  { key: "COMPLETED", title: "5. Delivered", subtitle: "Project Complete" },
];

export default function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states for project details edit
  const [editTitle, setEditTitle] = useState("");
  const [editBrief, setEditBrief] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editCurrency, setEditCurrency] = useState("USD");
  const [editAssignedToId, setEditAssignedToId] = useState("");

  // New deliverable modal/form state
  const [showAddDeliverable, setShowAddDeliverable] = useState(false);
  const [newDelivTitle, setNewDelivTitle] = useState("");
  const [newDelivUrl, setNewDelivUrl] = useState("");
  const [newDelivDesc, setNewDelivDesc] = useState("");
  const [newDelivVersion, setNewDelivVersion] = useState(1);
  const [newDelivStatus, setNewDelivStatus] = useState<DeliverableStatus>("SHARED");
  const [addingDeliverable, setAddingDeliverable] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadProject = async () => {
    try {
      const res = await backendFetch(`/api/v1/projects/${projectId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProject(data.data);
        setEditTitle(data.data.title || "");
        setEditBrief(data.data.brief || "");
        setEditDueDate(
          data.data.dueDate ? new Date(data.data.dueDate).toISOString().split("T")[0] : ""
        );
        setEditBudget(data.data.budget ? String(data.data.budget) : "");
        setEditCurrency(data.data.currency || "USD");
        setEditAssignedToId(data.data.assignedTo?.id || "");
      } else {
        showToast(data.message || "Failed to load project", "error");
      }
    } catch (err: any) {
      console.error("[LOAD PROJECT ERROR]", err);
      showToast("Network error while loading project", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadCreators = async () => {
    try {
      const res = await backendFetch("/api/v1/projects/creators");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCreators(data.data);
      }
    } catch (err) {
      console.error("[LOAD CREATORS ERROR]", err);
    }
  };

  useEffect(() => {
    void loadProject();
    void loadCreators();
  }, [projectId]);

  // Update Status action
  const handleUpdateStatus = async (newStatus: ProjectStatus) => {
    if (!project || savingStatus) return;
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProject(data.data);
        showToast(`Status updated to ${STATUS_CONFIG[newStatus].label}`);
      } else {
        showToast(data.message || "Failed to update status", "error");
      }
    } catch (err: any) {
      console.error("[UPDATE STATUS ERROR]", err);
      showToast("Error updating project status", "error");
    } finally {
      setSavingStatus(false);
    }
  };

  // Save Project Details (due date, budget, assigned creator, title, brief)
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingDetails) return;
    setSavingDetails(true);

    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          brief: editBrief.trim(),
          dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
          budget: editBudget ? Number(editBudget) : null,
          currency: editCurrency,
          assignedToId: editAssignedToId || null,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProject(data.data);
        showToast("Project details saved successfully");
      } else {
        showToast(data.message || "Failed to save project details", "error");
      }
    } catch (err: any) {
      console.error("[SAVE DETAILS ERROR]", err);
      showToast("Failed to save project details", "error");
    } finally {
      setSavingDetails(false);
    }
  };

  // Add Deliverable
  const handleAddDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addingDeliverable) return;
    if (!newDelivTitle.trim() || !newDelivUrl.trim()) {
      showToast("Please provide both title and asset link.", "error");
      return;
    }

    setAddingDeliverable(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/deliverables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newDelivTitle.trim(),
          fileUrl: newDelivUrl.trim(),
          description: newDelivDesc.trim() || null,
          version: Number(newDelivVersion) || 1,
          status: newDelivStatus,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        showToast("Deliverable added successfully");
        setShowAddDeliverable(false);
        setNewDelivTitle("");
        setNewDelivUrl("");
        setNewDelivDesc("");
        setNewDelivVersion((project?.deliverables.length || 0) + 2);
        void loadProject();
      } else {
        showToast(data.message || "Failed to add deliverable", "error");
      }
    } catch (err: any) {
      console.error("[ADD DELIVERABLE ERROR]", err);
      showToast("Failed to add deliverable", "error");
    } finally {
      setAddingDeliverable(false);
    }
  };

  // Update Deliverable Status
  const handleUpdateDeliverableStatus = async (
    deliverableId: string,
    newStatus: DeliverableStatus
  ) => {
    try {
      const res = await fetch(
        `/api/admin/projects/${projectId}/deliverables/${deliverableId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (data.success) {
        showToast(`Deliverable updated to ${DELIVERABLE_STATUS_CONFIG[newStatus].label}`);
        void loadProject();
      } else {
        showToast(data.message || "Failed to update deliverable", "error");
      }
    } catch (err) {
      showToast("Error updating deliverable", "error");
    }
  };

  // Delete Deliverable
  const handleDeleteDeliverable = async (deliverableId: string) => {
    if (!confirm("Are you sure you want to remove this deliverable?")) return;
    try {
      const res = await fetch(
        `/api/admin/projects/${projectId}/deliverables/${deliverableId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        showToast("Deliverable removed");
        void loadProject();
      } else {
        showToast(data.message || "Failed to remove deliverable", "error");
      }
    } catch (err) {
      showToast("Error deleting deliverable", "error");
    }
  };

  // Calculate Pipeline Stage Progress
  const pipelineProgress = useMemo(() => {
    if (!project) return 0;
    switch (project.status) {
      case "INTAKE":
        return 20;
      case "PLANNED":
        return 35;
      case "IN_PROGRESS":
        return 55;
      case "IN_REVIEW":
        return 75;
      case "WAITING_FOR_CLIENT":
        return 90;
      case "COMPLETED":
        return 100;
      case "ON_HOLD":
        return 50;
      case "CANCELLED":
        return 0;
      default:
        return 20;
    }
  }, [project?.status]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#4F46E5]" />
          <p className="text-sm font-medium text-neutral-600">Loading project workspace…</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="rounded-3xl border border-dashed border-black/10 bg-white/70 p-12 text-center">
        <FolderKanban className="mx-auto h-12 w-12 text-neutral-400" />
        <h2 className="mt-4 text-xl font-bold text-neutral-900">Project Not Found</h2>
        <p className="mt-2 text-sm text-neutral-500">
          This project could not be found or has been removed.
        </p>
        <Link
          href="/admin/projects"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" /> Back to All Projects
        </Link>
      </div>
    );
  }

  const currentStatusConfig = STATUS_CONFIG[project.status];

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

      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/80 text-neutral-600 shadow-sm transition hover:bg-white hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
              <span>/</span>
              <Link href="/admin/projects" className="hover:underline">
                Projects
              </Link>
              <span>/</span>
              <span className="font-mono font-bold text-neutral-800">
                {project.projectCode}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-950 sm:text-3xl">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${currentStatusConfig.bg} ${currentStatusConfig.text} ${currentStatusConfig.border}`}
          >
            <span className={`h-2 w-2 rounded-full ${currentStatusConfig.dot}`} />
            {currentStatusConfig.label}
          </div>
        </div>
      </div>

      {/* Quick Status Control Bar */}
      <div className="overflow-hidden rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
              Quick Status Actions
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Switch project stage with one click. Updates sync directly to client & creators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mark Ongoing / In Progress */}
            {project.status !== "IN_PROGRESS" && (
              <button
                type="button"
                disabled={savingStatus}
                onClick={() => handleUpdateStatus("IN_PROGRESS")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Mark Ongoing
              </button>
            )}

            {/* Waiting for Client Review */}
            {project.status !== "WAITING_FOR_CLIENT" && (
              <button
                type="button"
                disabled={savingStatus}
                onClick={() => handleUpdateStatus("WAITING_FOR_CLIENT")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-800 shadow-sm transition hover:bg-sky-100 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                Client Review
              </button>
            )}

            {/* Internal Review */}
            {project.status !== "IN_REVIEW" && (
              <button
                type="button"
                disabled={savingStatus}
                onClick={() => handleUpdateStatus("IN_REVIEW")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-300 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-800 shadow-sm transition hover:bg-purple-100 disabled:opacity-50"
              >
                <Eye className="h-3.5 w-3.5" />
                Internal QA
              </button>
            )}

            {/* Mark Completed */}
            {project.status !== "COMPLETED" && (
              <button
                type="button"
                disabled={savingStatus}
                onClick={() => handleUpdateStatus("COMPLETED")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark Completed
              </button>
            )}

            {/* Close / On Hold */}
            {project.status !== "ON_HOLD" ? (
              <button
                type="button"
                disabled={savingStatus}
                onClick={() => handleUpdateStatus("ON_HOLD")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100 disabled:opacity-50"
              >
                <Pause className="h-3.5 w-3.5" />
                Pause / Close (On Hold)
              </button>
            ) : (
              <button
                type="button"
                disabled={savingStatus}
                onClick={() => handleUpdateStatus("IN_PROGRESS")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-800 shadow-sm transition hover:bg-indigo-100 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Resume Project
              </button>
            )}

            {/* Cancel Project */}
            {project.status !== "CANCELLED" && (
              <button
                type="button"
                disabled={savingStatus}
                onClick={() => {
                  if (confirm("Are you sure you want to mark this project as cancelled?")) {
                    handleUpdateStatus("CANCELLED");
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Milestone Stepper */}
        <div className="mt-8 border-t border-black/[0.06] pt-6">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
            <span>Project Lifecycle Progress</span>
            <span className="font-bold text-neutral-800">{pipelineProgress}% Complete</span>
          </div>

          <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200/80">
            <div
              className="h-full bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${pipelineProgress}%` }}
            />
          </div>

          {/* Stepper items */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {PIPELINE_STEPS.map((step, idx) => {
              const isCurrent =
                (step.key === "INTAKE" && (project.status === "INTAKE" || project.status === "PLANNED")) ||
                (step.key === "IN_PROGRESS" && project.status === "IN_PROGRESS") ||
                (step.key === "IN_REVIEW" && project.status === "IN_REVIEW") ||
                (step.key === "WAITING_FOR_CLIENT" && project.status === "WAITING_FOR_CLIENT") ||
                (step.key === "COMPLETED" && project.status === "COMPLETED");

              const isPast =
                (step.key === "INTAKE" && project.status !== "INTAKE" && project.status !== "PLANNED") ||
                (step.key === "IN_PROGRESS" &&
                  (project.status === "IN_REVIEW" ||
                    project.status === "WAITING_FOR_CLIENT" ||
                    project.status === "COMPLETED")) ||
                (step.key === "IN_REVIEW" &&
                  (project.status === "WAITING_FOR_CLIENT" || project.status === "COMPLETED")) ||
                (step.key === "WAITING_FOR_CLIENT" && project.status === "COMPLETED");

              return (
                <div
                  key={step.key}
                  className={`rounded-2xl border p-3 transition ${
                    isCurrent
                      ? "border-[#4F46E5]/40 bg-[#4F46E5]/[0.05] shadow-sm ring-2 ring-[#4F46E5]/20"
                      : isPast
                      ? "border-emerald-200/80 bg-emerald-50/40 text-neutral-700"
                      : "border-black/[0.05] bg-white/40 text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {isPast ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isCurrent ? "bg-[#4F46E5] ring-2 ring-[#4F46E5]/30" : "bg-neutral-300"
                        }`}
                      />
                    )}
                    <span className={isCurrent ? "text-[#4F46E5]" : isPast ? "text-neutral-900" : ""}>
                      {step.title}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-neutral-500">{step.subtitle}</p>
                </div>
              );
            })}
          </div>

          {/* On Hold Callout */}
          {project.status === "ON_HOLD" && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
              <Pause className="h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <strong className="font-semibold">Project is currently on hold / closed.</strong> No
                active notifications will be dispatched until resumed. Click &quot;Resume Project&quot; above
                to resume creative production.
              </div>
            </div>
          )}

          {/* Cancelled Callout */}
          {project.status === "CANCELLED" && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-900">
              <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <div>
                <strong className="font-semibold">Project cancelled.</strong> This project is archived
                from active creator workload.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: 2/3 Content, 1/3 Sidebar */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Brief & Deliverables */}
        <div className="space-y-8 lg:col-span-2">
          {/* Creative Brief & Details */}
          <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#4F46E5]" />
                <h2 className="text-lg font-bold text-neutral-900">Creative Scope & Brief</h2>
              </div>
              {project.quoteRequest && (
                <Link
                  href={`/admin/requests`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:underline"
                >
                  View Original Request <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-black/[0.05] bg-neutral-50/60 p-4">
              <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-700">
                {project.brief || "No brief specified."}
              </p>
            </div>

            {project.quoteRequest?.attachments && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {project.quoteRequest.attachments.serviceNeeded && (
                  <div className="rounded-xl border border-black/[0.06] bg-white p-3 text-xs">
                    <span className="text-[10px] font-bold uppercase text-neutral-400">
                      Service
                    </span>
                    <p className="mt-0.5 font-semibold text-neutral-800">
                      {project.quoteRequest.attachments.serviceNeeded}
                    </p>
                  </div>
                )}
                {project.quoteRequest.attachments.desiredDeadline && (
                  <div className="rounded-xl border border-black/[0.06] bg-white p-3 text-xs">
                    <span className="text-[10px] font-bold uppercase text-neutral-400">
                      Target Timeline
                    </span>
                    <p className="mt-0.5 font-semibold text-neutral-800">
                      {project.quoteRequest.attachments.desiredDeadline}
                    </p>
                  </div>
                )}
                {project.quoteRequest.attachments.budgetRange && (
                  <div className="rounded-xl border border-black/[0.06] bg-white p-3 text-xs">
                    <span className="text-[10px] font-bold uppercase text-neutral-400">
                      Client Budget
                    </span>
                    <p className="mt-0.5 font-semibold text-neutral-800">
                      {project.quoteRequest.attachments.budgetRange}
                    </p>
                  </div>
                )}
                {project.quoteRequest.attachments.targetPlatforms &&
                  Array.isArray(project.quoteRequest.attachments.targetPlatforms) && (
                    <div className="rounded-xl border border-black/[0.06] bg-white p-3 text-xs">
                      <span className="text-[10px] font-bold uppercase text-neutral-400">
                        Platforms
                      </span>
                      <p className="mt-0.5 font-semibold text-neutral-800">
                        {project.quoteRequest.attachments.targetPlatforms.join(", ")}
                      </p>
                    </div>
                  )}
              </div>
            )}
          </section>

          {/* Deliverables & Assets Management */}
          <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-neutral-900">
                  Deliverables & Assets ({project.deliverables.length})
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowAddDeliverable(!showAddDeliverable)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800"
              >
                <Plus className="h-3.5 w-3.5" />
                {showAddDeliverable ? "Cancel" : "Add Deliverable"}
              </button>
            </div>

            {/* Add Deliverable Form */}
            {showAddDeliverable && (
              <form
                onSubmit={handleAddDeliverable}
                className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                    New Deliverable Asset
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    Links to Figma, Drive, Loom, Dropbox, or storage URLs
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700">
                      Asset Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meta Reels 9:16 Video Ad v1"
                      value={newDelivTitle}
                      onChange={(e) => setNewDelivTitle(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700">
                      Asset / File URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/... or Figma link"
                      value={newDelivUrl}
                      onChange={(e) => setNewDelivUrl(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700">
                      Deliverable Version
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newDelivVersion}
                      onChange={(e) => setNewDelivVersion(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700">
                      Initial Status
                    </label>
                    <select
                      value={newDelivStatus}
                      onChange={(e) => setNewDelivStatus(e.target.value as DeliverableStatus)}
                      className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="SHARED">Shared with Client (Ready for review)</option>
                      <option value="DRAFT">Internal Draft (Staff only)</option>
                      <option value="APPROVED">Approved & Final</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700">
                    Notes / Version Changelog
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Key adjustments in this cut or feedback notes..."
                    value={newDelivDesc}
                    onChange={(e) => setNewDelivDesc(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddDeliverable(false)}
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingDeliverable}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {addingDeliverable && <RefreshCw className="h-3 w-3 animate-spin" />}
                    Save Deliverable
                  </button>
                </div>
              </form>
            )}

            {/* Deliverables List */}
            <div className="mt-6 space-y-3">
              {project.deliverables.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50/50 p-8 text-center">
                  <FileCheck2 className="mx-auto h-8 w-8 text-neutral-400" />
                  <p className="mt-2 text-xs font-medium text-neutral-600">
                    No deliverables added yet.
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Add artwork, video files, Figma prototypes, or Drive links for client review.
                  </p>
                </div>
              ) : (
                project.deliverables.map((deliv) => {
                  const cfg = DELIVERABLE_STATUS_CONFIG[deliv.status];
                  return (
                    <div
                      key={deliv.id}
                      className="group flex flex-col justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm transition hover:border-black/15 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[10px] font-bold text-neutral-700">
                            v{deliv.version}
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900">{deliv.title}</h4>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${cfg.badgeClass}`}
                          >
                            {cfg.label}
                          </span>
                        </div>

                        {deliv.description && (
                          <p className="text-xs text-neutral-600">{deliv.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-[11px] text-neutral-400">
                          <span>
                            Added {new Date(deliv.createdAt).toLocaleDateString()}
                          </span>
                          {deliv.uploadedBy && (
                            <span>By: {deliv.uploadedBy.name || deliv.uploadedBy.email}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Open Link */}
                        <a
                          href={deliv.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-100"
                        >
                          Open Asset <ExternalLink className="h-3 w-3" />
                        </a>

                        {/* Quick Status Toggles */}
                        {deliv.status !== "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateDeliverableStatus(deliv.id, "APPROVED")}
                            className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 transition hover:bg-emerald-100"
                            title="Mark as Approved"
                          >
                            <Check className="h-3 w-3" /> Approve
                          </button>
                        )}

                        {deliv.status !== "SHARED" && deliv.status !== "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateDeliverableStatus(deliv.id, "SHARED")}
                            className="inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[11px] font-semibold text-blue-800 transition hover:bg-blue-100"
                            title="Share with Client"
                          >
                            <Send className="h-3 w-3" /> Share
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteDeliverable(deliv.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Remove Deliverable"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Controls & Assignment */}
        <div className="space-y-8">
          {/* Project Settings & Assignment Form */}
          <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <h2 className="text-base font-bold text-neutral-900">Project Management</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Assign creators, set production deadlines, and manage budget.
            </p>

            <form onSubmit={handleSaveDetails} className="mt-5 space-y-4">
              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Current Status
                </label>
                <select
                  value={project.status}
                  onChange={(e) => handleUpdateStatus(e.target.value as ProjectStatus)}
                  className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-900 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                >
                  <option value="INTAKE">Intake & Scoping</option>
                  <option value="PLANNED">Planned</option>
                  <option value="IN_PROGRESS">Ongoing / In Progress</option>
                  <option value="IN_REVIEW">Internal QA / Review</option>
                  <option value="WAITING_FOR_CLIENT">Waiting for Client Review</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">Closed / On Hold</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Assign Creator Pod */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Assigned Creator Pod
                </label>
                <select
                  value={editAssignedToId}
                  onChange={(e) => setEditAssignedToId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-medium text-neutral-900 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                >
                  <option value="">Unassigned (Open Pool)</option>
                  {creators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.email} ({c.appRole})
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-medium text-neutral-900 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                />
                <div className="mt-1.5 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 7);
                      setEditDueDate(d.toISOString().split("T")[0]);
                    }}
                    className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 hover:bg-neutral-200"
                  >
                    +7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 14);
                      setEditDueDate(d.toISOString().split("T")[0]);
                    }}
                    className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 hover:bg-neutral-200"
                  >
                    +14 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 30);
                      setEditDueDate(d.toISOString().split("T")[0]);
                    }}
                    className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600 hover:bg-neutral-200"
                  >
                    +30 Days
                  </button>
                </div>
              </div>

              {/* Budget & Currency */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Budget
                </label>
                <div className="mt-1.5 flex gap-2">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 2500"
                      value={editBudget}
                      onChange={(e) => setEditBudget(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-white pl-7 pr-3 py-2 text-xs font-medium text-neutral-900 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                    />
                  </div>
                  <select
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value)}
                    className="w-20 rounded-xl border border-black/10 bg-white px-2 py-2 text-xs font-bold text-neutral-900 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={savingDetails}
                className="w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-50"
              >
                {savingDetails ? "Saving Changes…" : "Save Project Settings"}
              </button>
            </form>
          </section>

          {/* Project Creative Pod Team */}
          <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900">Project Creative Pod</h2>
              <Link
                href={`/admin/team?projectId=${project.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:underline"
              >
                Assemble Team <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Creators assigned to execute and deliver this contract.
            </p>

            <div className="mt-4 space-y-2">
              {project.teamMembers && project.teamMembers.length > 0 ? (
                project.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-xl border border-black/[0.05] bg-white p-2.5 text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]/10 font-bold text-[#4F46E5]">
                        {(member.user.name || member.user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">{member.user.name || "Creator"}</p>
                        <p className="text-[10px] text-neutral-500">{member.roleTitle || "Creator"}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[9px] font-bold text-purple-700">
                      CREATOR
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-black/10 bg-neutral-50/50 p-4 text-center">
                  <p className="text-xs text-neutral-500">No creators in pod yet.</p>
                  <Link
                    href={`/admin/team?projectId=${project.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#4F46E5] hover:underline"
                  >
                    + Build Team Pod
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Client Details Card */}
          <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <h2 className="text-base font-bold text-neutral-900">Client Profile</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4F46E5]/10 font-bold text-[#4F46E5]">
                {project.client.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.client.image}
                    alt={project.client.name}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  (project.client.name || project.client.email || "C").charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-900">
                  {project.client.name || "Client"}
                </p>
                <a
                  href={`mailto:${project.client.email}`}
                  className="truncate text-xs text-neutral-500 hover:text-[#4F46E5]"
                >
                  {project.client.email}
                </a>
              </div>
            </div>

            {project.quoteRequest?.companyName && (
              <div className="mt-4 border-t border-black/[0.06] pt-3 text-xs text-neutral-600">
                <span className="font-medium text-neutral-400">Company:</span>{" "}
                <span className="font-semibold text-neutral-800">
                  {project.quoteRequest.companyName}
                </span>
                {project.quoteRequest.companyWebsite && (
                  <a
                    href={
                      project.quoteRequest.companyWebsite.startsWith("http")
                        ? project.quoteRequest.companyWebsite
                        : `https://${project.quoteRequest.companyWebsite}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 inline-flex items-center text-[#4F46E5] hover:underline"
                  >
                    Visit <ExternalLink className="ml-0.5 h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </section>

          {/* Project Timeline & Dates */}
          <section className="rounded-3xl border border-black/[0.08] bg-white/85 p-6 shadow-sm backdrop-blur-xl">
            <h2 className="text-base font-bold text-neutral-900">Project Timeline</h2>
            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                <dt className="text-neutral-500">Created</dt>
                <dd className="font-medium text-neutral-800">
                  {new Date(project.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                <dt className="text-neutral-500">Production Started</dt>
                <dd className="font-medium text-neutral-800">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "Not started yet"}
                </dd>
              </div>
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-2">
                <dt className="text-neutral-500">Due Date</dt>
                <dd
                  className={`font-semibold ${
                    project.dueDate && new Date(project.dueDate) < new Date() && project.status !== "COMPLETED"
                      ? "text-rose-600"
                      : "text-neutral-800"
                  }`}
                >
                  {project.dueDate
                    ? new Date(project.dueDate).toLocaleDateString()
                    : "No deadline set"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-500">Completed Date</dt>
                <dd className="font-medium text-neutral-800">
                  {project.completedAt
                    ? new Date(project.completedAt).toLocaleDateString()
                    : "In progress"}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
