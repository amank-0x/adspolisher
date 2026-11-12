"use client";

import React, { useEffect, useState, useMemo } from "react";
import { backendFetch } from "@/lib/backend-api";
import {
  Tag,
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  RefreshCw,
  Edit2,
  Trash2,
  Layers,
  Check,
  Star,
  Eye,
  Briefcase,
  AlertCircle,
  X,
} from "lucide-react";

type PackageItem = {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  badge?: string | null;
  description: string;
  price: string | number;
  currency: string;
  billingPeriod?: string | null;
  deliverables?: string[] | null;
  turnaroundDays?: number | null;
  revisionLimit?: number | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  serviceId?: string | null;
  service?: { id: string; name: string; slug: string } | null;
  createdAt: string;
  _count?: { projects: number; quoteRequests: number };
};

type ServiceItem = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  sortOrder: number;
  packages?: PackageItem[];
  _count?: { packages: number; projects: number };
};

const POPULAR_DELIVERABLE_SUGGESTIONS = [
  "5 High-Converting Creative Ads (Feed & Stories)",
  "Google Indexing & Search Console Setup",
  "Social Media Management (30 Days)",
  "12 Custom Branded Social Media Posts",
  "Target Hook & Ad Angle Copywriting",
  "Local Google Business Profile Optimization",
  "Meta & Instagram Pixel Integration",
  "A/B Creative Hook Testing & Variants",
  "Dedicated Art Director & Slack Access",
  "Weekly ROI & Performance Analytics Report",
];

const CURRENCY_OPTIONS = [
  { code: "INR", symbol: "₹", label: "INR (₹) - Indian Rupee" },
  { code: "USD", symbol: "$", label: "USD ($) - US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR (€) - Euro" },
  { code: "GBP", symbol: "£", label: "GBP (£) - British Pound" },
];

const BILLING_PERIODS = [
  { value: "one-time", label: "One-Time Project" },
  { value: "monthly", label: "Monthly Retainer" },
  { value: "quarterly", label: "Quarterly Campaign" },
  { value: "per campaign", label: "Per Campaign" },
];

export default function AdminServicesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"packages" | "preview">("packages");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "POPULAR">("ALL");

  // Package Modal State
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);
  const [pkgFormData, setPkgFormData] = useState({
    name: "",
    tagline: "",
    badge: "",
    description: "",
    price: "",
    currency: "INR",
    billingPeriod: "one-time",
    turnaroundDays: "7",
    revisionLimit: "2",
    isPopular: false,
    isActive: true,
    serviceId: "",
  });
  const [pkgDeliverables, setPkgDeliverables] = useState<string[]>([
    "5 High-Converting Creative Ads",
    "Google Indexing & Search Console Setup",
    "Social Media Management (30 Days)",
    "12 Custom Social Media Posts",
  ]);
  const [newDeliverableInput, setNewDeliverableInput] = useState("");
  const [pkgModalSubmitting, setPkgModalSubmitting] = useState(false);
  const [pkgModalError, setPkgModalError] = useState<string | null>(null);

  // Status feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [pkgRes, srvRes] = await Promise.all([
        backendFetch("/api/admin/packages?all=true"),
        backendFetch("/api/admin/services?all=true"),
      ]);

      const pkgData = await pkgRes.json();
      const srvData = await srvRes.json();

      if (pkgData.success && Array.isArray(pkgData.data)) {
        setPackages(pkgData.data);
      }
      if (srvData.success && Array.isArray(srvData.data)) {
        setServices(srvData.data);
      }
    } catch (err) {
      console.error("[LOAD SERVICES/PACKAGES ERROR]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Filter packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (statusFilter === "ACTIVE" && !pkg.isActive) return false;
      if (statusFilter === "INACTIVE" && pkg.isActive) return false;
      if (statusFilter === "POPULAR" && !pkg.isPopular) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = pkg.name.toLowerCase().includes(q);
        const matchesTagline = pkg.tagline?.toLowerCase().includes(q);
        const matchesDesc = pkg.description.toLowerCase().includes(q);
        const matchesDeliverables = (pkg.deliverables || []).some((d) => d.toLowerCase().includes(q));
        const matchesBadge = pkg.badge?.toLowerCase().includes(q);
        return matchesName || matchesTagline || matchesDesc || matchesDeliverables || matchesBadge;
      }
      return true;
    });
  }, [packages, statusFilter, search]);

  // Seed default starter packages
  const handleSeedDefaults = async () => {
    try {
      const res = await backendFetch("/api/admin/packages/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Default packages seeded successfully!");
        void loadData();
      } else {
        alert(data.message || "Failed to seed defaults");
      }
    } catch (err) {
      console.error(err);
      alert("Error seeding defaults");
    }
  };

  // Open Create Package Modal
  const openCreatePkgModal = () => {
    setEditingPkg(null);
    setPkgFormData({
      name: "",
      tagline: "In 5k you'll get creative ads, google indexing, social media management, social media posts for your business",
      badge: "Special 5K Deal",
      description: "Complete growth bundle including 5 high-converting creative ads, Google indexing & Search Console setup, 30 days social media management, and 12 custom social posts.",
      price: "5000",
      currency: "INR",
      billingPeriod: "one-time",
      turnaroundDays: "7",
      revisionLimit: "2",
      isPopular: true,
      isActive: true,
      serviceId: "",
    });
    setPkgDeliverables([
      "5 High-Converting Creative Ads (Feed & Stories)",
      "Google Indexing & Search Console Setup",
      "Social Media Management (30 Days)",
      "12 Custom Branded Social Media Posts",
    ]);
    setNewDeliverableInput("");
    setPkgModalError(null);
    setIsPkgModalOpen(true);
  };

  // Open Edit Package Modal
  const openEditPkgModal = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setPkgFormData({
      name: pkg.name,
      tagline: pkg.tagline || "",
      badge: pkg.badge || "",
      description: pkg.description,
      price: String(pkg.price),
      currency: pkg.currency || "INR",
      billingPeriod: pkg.billingPeriod || "one-time",
      turnaroundDays: pkg.turnaroundDays ? String(pkg.turnaroundDays) : "",
      revisionLimit: pkg.revisionLimit ? String(pkg.revisionLimit) : "",
      isPopular: pkg.isPopular,
      isActive: pkg.isActive,
      serviceId: pkg.serviceId || "",
    });
    setPkgDeliverables(Array.isArray(pkg.deliverables) ? [...pkg.deliverables] : []);
    setNewDeliverableInput("");
    setPkgModalError(null);
    setIsPkgModalOpen(true);
  };

  // Deliverable tag management
  const addDeliverable = (text?: string) => {
    const val = (text || newDeliverableInput).trim();
    if (!val) return;
    if (!pkgDeliverables.includes(val)) {
      setPkgDeliverables((prev) => [...prev, val]);
    }
    setNewDeliverableInput("");
  };

  const removeDeliverable = (index: number) => {
    setPkgDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Package Form (Create or Update)
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgFormData.name.trim()) {
      setPkgModalError("Package name is required");
      return;
    }
    if (!pkgFormData.price || isNaN(Number(pkgFormData.price))) {
      setPkgModalError("Please enter a valid price amount (e.g. 5000)");
      return;
    }
    if (pkgDeliverables.length === 0) {
      setPkgModalError("Add at least one included service/deliverable");
      return;
    }

    try {
      setPkgModalSubmitting(true);
      setPkgModalError(null);

      const payload = {
        name: pkgFormData.name.trim(),
        tagline: pkgFormData.tagline.trim() || null,
        badge: pkgFormData.badge.trim() || null,
        description: pkgFormData.description.trim() || `Package including ${pkgDeliverables.slice(0, 3).join(", ")}.`,
        price: parseFloat(pkgFormData.price),
        currency: pkgFormData.currency,
        billingPeriod: pkgFormData.billingPeriod,
        deliverables: pkgDeliverables,
        turnaroundDays: pkgFormData.turnaroundDays ? parseInt(pkgFormData.turnaroundDays, 10) : null,
        revisionLimit: pkgFormData.revisionLimit ? parseInt(pkgFormData.revisionLimit, 10) : null,
        isPopular: pkgFormData.isPopular,
        isActive: pkgFormData.isActive,
        serviceId: pkgFormData.serviceId || null,
      };

      const url = editingPkg ? `/api/admin/packages/${editingPkg.id}` : "/api/admin/packages";
      const method = editingPkg ? "PATCH" : "POST";

      const res = await backendFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        setPkgModalError(data.message || "Failed to save package");
        return;
      }

      showToast(editingPkg ? "Package updated successfully!" : "Package created successfully!");
      setIsPkgModalOpen(false);
      void loadData();
    } catch (err: any) {
      setPkgModalError(err?.message || "Failed to submit package");
    } finally {
      setPkgModalSubmitting(false);
    }
  };

  // Toggle package active status directly
  const handleToggleActive = async (pkg: PackageItem) => {
    try {
      const res = await backendFetch(`/api/admin/packages/${pkg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !pkg.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, isActive: !pkg.isActive } : p))
        );
        showToast(pkg.isActive ? "Package marked inactive." : "Package published live!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle package popular badge directly
  const handleTogglePopular = async (pkg: PackageItem) => {
    try {
      const res = await backendFetch(`/api/admin/packages/${pkg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPopular: !pkg.isPopular }),
      });
      const data = await res.json();
      if (data.success) {
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, isPopular: !pkg.isPopular } : p))
        );
        showToast(pkg.isPopular ? "Removed popular badge." : "Marked as most popular package!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete package
  const handleDeletePackage = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete or archive package "${name}"?`)) return;
    try {
      const res = await backendFetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Package deleted.");
        void loadData();
      } else {
        alert(data.message || "Failed to delete package.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete package.");
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((p) => p.isActive).length;
    const popular = packages.filter((p) => p.isPopular).length;
    return { total, active, popular, totalServices: services.length };
  }, [packages, services]);

  const currencySymbol = (code: string) => {
    switch (code?.toUpperCase()) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return code || "$";
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-950 px-4 py-3 text-sm font-medium text-emerald-100 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/60 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#4F46E5]">
            <Tag className="h-3.5 w-3.5" /> Commercial Offerings &amp; Catalog
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
            Services &amp; Pricing Packages
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Create packages like 5K Starter (creative ads, google indexing, social media management, social media posts) with custom pricing &amp; deliverables.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {packages.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              Seed 5K, 15K, 35K Defaults
            </button>
          )}

          <button
            onClick={openCreatePkgModal}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 text-emerald-400" />
            Create Package
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Total Packages</span>
            <Layers className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">{metrics.total}</p>
          <p className="mt-1 text-[11px] text-neutral-500">Packages configured</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Live on Site</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">{metrics.active}</p>
          <p className="mt-1 text-[11px] text-emerald-600 font-medium">Active catalog offerings</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Popular Highlights</span>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">{metrics.popular}</p>
          <p className="mt-1 text-[11px] text-neutral-500">Featured badge cards</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-medium">Service Categories</span>
            <Briefcase className="h-4 w-4 text-sky-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">{metrics.totalServices}</p>
          <p className="mt-1 text-[11px] text-neutral-500">Underlying disciplines</p>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col gap-4 border-b border-neutral-200/80 pb-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl bg-neutral-100 p-1">
          <button
            onClick={() => setActiveTab("packages")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === "packages"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> Packages &amp; Bundles ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === "preview"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> Customer Card Preview
          </button>
        </div>

        {/* Filter controls (for packages tab) */}
        {activeTab === "packages" && (
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[240px] flex-1 sm:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search packages, deliverables..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white py-1.5 pl-9 pr-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white p-0.5 text-xs">
              {(["ALL", "ACTIVE", "INACTIVE", "POPULAR"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    statusFilter === key
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {key === "ALL" ? "All" : key === "ACTIVE" ? "Active" : key === "INACTIVE" ? "Inactive" : "Popular"}
                </button>
              ))}
            </div>

            <button
              onClick={() => void loadData()}
              title="Refresh catalog"
              className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-xs">
          <RefreshCw className="h-6 w-6 animate-spin text-neutral-400" />
          <p className="text-xs font-semibold text-neutral-600">Loading services and packages catalog...</p>
        </div>
      ) : activeTab === "packages" ? (
        filteredPackages.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
            <Tag className="h-10 w-10 text-neutral-300 mb-3" />
            <h3 className="text-sm font-bold text-neutral-800">No packages found</h3>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm">
              {search || statusFilter !== "ALL"
                ? "No packages match your search filter criteria."
                : "Get started by creating your first package or seeding default 5K, 15K, 35K bundles."}
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={handleSeedDefaults}
                className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-neutral-50"
              >
                Seed 5K Kickstart Bundle
              </button>
              <button
                onClick={openCreatePkgModal}
                className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800"
              >
                Create New Package
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredPackages.map((pkg) => {
              const deliverablesList = Array.isArray(pkg.deliverables) ? pkg.deliverables : [];
              const priceNum = Number(pkg.price);
              const formattedPrice = isNaN(priceNum) ? String(pkg.price) : priceNum.toLocaleString();

              return (
                <div
                  key={pkg.id}
                  className={`group relative flex flex-col justify-between rounded-2xl border transition duration-200 bg-white p-5 shadow-xs hover:shadow-md ${
                    pkg.isPopular
                      ? "border-amber-300 ring-2 ring-amber-400/20"
                      : !pkg.isActive
                      ? "border-neutral-200/60 opacity-75 bg-neutral-50/50"
                      : "border-neutral-200/90 hover:border-neutral-300"
                  }`}
                >
                  {/* Top Bar with Badges */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {pkg.badge && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                            <Sparkles className="h-3 w-3 text-indigo-500" />
                            {pkg.badge}
                          </span>
                        )}
                        {pkg.isPopular && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Active Live Status Tag */}
                      <button
                        onClick={() => handleToggleActive(pkg)}
                        title={pkg.isActive ? "Click to disable package" : "Click to publish live"}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold transition ${
                          pkg.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-neutral-100 text-neutral-500 border border-neutral-200 hover:bg-neutral-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            pkg.isActive ? "bg-emerald-500" : "bg-neutral-400"
                          }`}
                        />
                        {pkg.isActive ? "Live" : "Draft"}
                      </button>
                    </div>

                    {/* Title & Tagline */}
                    <div className="mt-3">
                      <h3 className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-indigo-600 transition">
                        {pkg.name}
                      </h3>
                      {pkg.tagline && (
                        <p className="mt-1 text-xs font-medium text-neutral-600 line-clamp-2">
                          {pkg.tagline}
                        </p>
                      )}
                    </div>

                    {/* Pricing Display */}
                    <div className="mt-4 flex items-baseline gap-1.5 border-y border-neutral-100 py-3">
                      <span className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
                        {currencySymbol(pkg.currency)}
                        {formattedPrice}
                      </span>
                      <span className="text-xs font-semibold text-neutral-500">
                        {pkg.billingPeriod ? `/${pkg.billingPeriod}` : "/project"}
                      </span>
                    </div>

                    {/* Deliverables Checklist */}
                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Included Services &amp; Deliverables ({deliverablesList.length})
                      </p>
                      <ul className="mt-2.5 space-y-2">
                        {deliverablesList.slice(0, 6).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                            <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                        {deliverablesList.length > 6 && (
                          <li className="text-[11px] font-semibold text-indigo-600 pl-5.5">
                            +{deliverablesList.length - 6} more included services
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Turnaround & Revision Badges */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-neutral-500 border-t border-neutral-100 pt-3">
                      {pkg.turnaroundDays && (
                        <span className="inline-flex items-center gap-1 bg-neutral-100/80 px-2 py-0.5 rounded-md">
                          <Clock className="h-3 w-3 text-neutral-400" />
                          {pkg.turnaroundDays} Days Delivery
                        </span>
                      )}
                      {pkg.revisionLimit !== null && pkg.revisionLimit !== undefined && (
                        <span className="inline-flex items-center gap-1 bg-neutral-100/80 px-2 py-0.5 rounded-md">
                          <RefreshCw className="h-3 w-3 text-neutral-400" />
                          {pkg.revisionLimit === 99 || pkg.revisionLimit < 0
                            ? "Unlimited Revisions"
                            : `${pkg.revisionLimit} Revisions`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3">
                    <button
                      onClick={() => handleTogglePopular(pkg)}
                      title={pkg.isPopular ? "Unmark popular" : "Highlight as popular"}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        pkg.isPopular
                          ? "bg-amber-100 text-amber-800"
                          : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${pkg.isPopular ? "fill-amber-400 text-amber-500" : ""}`} />
                      {pkg.isPopular ? "Popular" : "Feature"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditPkgModal(pkg)}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete package"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Preview Tab: Customer-Facing Visuals */
        <div className="space-y-6">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Eye className="h-4 w-4 text-indigo-600" />
              Live Website Pricing Cards Preview
            </div>
            <p className="mt-1 text-xs text-indigo-700">
              This preview shows how packages appear to prospective clients on <code className="bg-white/80 px-1 py-0.5 rounded font-mono">/services</code> and marketing pages.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {packages
              .filter((p) => p.isActive)
              .map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-lg ${
                    pkg.isPopular
                      ? "border-neutral-900 ring-2 ring-neutral-950"
                      : "border-neutral-200"
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3 left-6">
                      <span className="rounded-full bg-neutral-950 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 shadow-md">
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-black tracking-tight text-neutral-900">{pkg.name}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                      {pkg.tagline || pkg.description}
                    </p>

                    <div className="mt-5 border-y border-neutral-100 py-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-neutral-950">
                          {currencySymbol(pkg.currency)}
                          {Number(pkg.price).toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-neutral-500">
                          {pkg.billingPeriod ? `/${pkg.billingPeriod}` : ""}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-400">
                        {pkg.turnaroundDays ? `Ready in ${pkg.turnaroundDays} business days` : "Standard turnaround"}
                      </p>
                    </div>

                    <div className="mt-5 space-y-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        What you get:
                      </p>
                      {(pkg.deliverables || []).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-800">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100">
                    <button className="w-full rounded-xl bg-neutral-950 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition">
                      Get Started with {pkg.name}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT PACKAGE MODAL */}
      {isPkgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative my-8 w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">
                  {editingPkg ? "Update Package" : "New Offering"}
                </span>
                <h2 className="text-xl font-black tracking-tight text-neutral-900 sm:text-2xl">
                  {editingPkg ? `Edit ${editingPkg.name}` : "Create Service Package"}
                </h2>
              </div>
              <button
                onClick={() => setIsPkgModalOpen(false)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error banner */}
            {pkgModalError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{pkgModalError}</span>
              </div>
            )}

            <form onSubmit={handleSavePackage} className="mt-6 space-y-5">
              {/* Package Name & Badge */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5K All-in-One Kickstart"
                    value={pkgFormData.name}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Card Badge / Promo Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Special 5K Deal, Most Popular"
                    value={pkgFormData.badge}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, badge: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Tagline / Punchline
                </label>
                <input
                  type="text"
                  placeholder="In 5k you'll get creative ads, google indexing, social media management, social media posts"
                  value={pkgFormData.tagline}
                  onChange={(e) => setPkgFormData({ ...pkgFormData, tagline: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              {/* Price, Currency & Billing Period */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Price Amount *
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                      {currencySymbol(pkgFormData.currency)}
                    </span>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="5000"
                      value={pkgFormData.price}
                      onChange={(e) => setPkgFormData({ ...pkgFormData, price: e.target.value })}
                      className="w-full rounded-xl border border-neutral-300 bg-white py-2 pl-7 pr-3 text-xs font-bold text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Currency
                  </label>
                  <select
                    value={pkgFormData.currency}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, currency: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Billing Period
                  </label>
                  <select
                    value={pkgFormData.billingPeriod}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, billingPeriod: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                  >
                    {BILLING_PERIODS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deliverables / Included Services Builder */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Included Services &amp; Deliverables *
                </label>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Services included in this package (e.g. creative ads, google indexing, social media management, social media posts).
                </p>

                {/* Current tags */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {pkgDeliverables.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-100/90 px-2.5 py-1 text-xs font-medium text-neutral-800"
                    >
                      <Check className="h-3 w-3 text-emerald-600" />
                      {item}
                      <button
                        type="button"
                        onClick={() => removeDeliverable(idx)}
                        className="rounded-full p-0.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add new deliverable input */}
                <div className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom service / deliverable and press Add..."
                    value={newDeliverableInput}
                    onChange={(e) => setNewDeliverableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addDeliverable();
                      }
                    }}
                    className="flex-1 rounded-xl border border-neutral-300 bg-white px-3.5 py-1.5 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => addDeliverable()}
                    className="rounded-xl border border-neutral-300 bg-neutral-100 px-3.5 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200 transition"
                  >
                    Add
                  </button>
                </div>

                {/* Quick suggestions chips */}
                <div className="mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Quick Suggestion Chips:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {POPULAR_DELIVERABLE_SUGGESTIONS.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => addDeliverable(sug)}
                        className="rounded-md border border-dashed border-indigo-200 bg-indigo-50/50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Turnaround Days & Revision Limit */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Turnaround Timeline (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 7"
                    value={pkgFormData.turnaroundDays}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, turnaroundDays: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Revision Rounds
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2 (or 99 for unlimited)"
                    value={pkgFormData.revisionLimit}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, revisionLimit: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-medium text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Toggles: Featured & Live */}
              <div className="flex flex-wrap items-center gap-6 border-t border-neutral-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pkgFormData.isPopular}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, isPopular: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-neutral-800">
                    Mark as Featured / Most Popular Package
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pkgFormData.isActive}
                    onChange={(e) => setPkgFormData({ ...pkgFormData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-neutral-800">
                    Publish Live (Visible in Catalog)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPkgModalOpen(false)}
                  className="rounded-xl border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pkgModalSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {pkgModalSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : editingPkg ? (
                    "Save Changes"
                  ) : (
                    "Create Package"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
