"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CheckCheck,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  FileClock,
  Files,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import CommandPalette from "./CommandPalette";

export type DashboardRole = "USER" | "CREATOR" | "ADMIN";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeAriaLabel?: string;
};
type NavGroup = { label: string; items: NavItem[] };

const ROLE_HOME: Record<DashboardRole, string> = {
  USER: "/dashboard",
  CREATOR: "/creator",
  ADMIN: "/admin",
};

const ROLE_DETAILS: Record<
  DashboardRole,
  {
    name: string;
    workspace: string;
    action: string;
    actionHref: string;
    groups: NavGroup[];
  }
> = {
  USER: {
    name: "Client",
    workspace: "Client workspace",
    action: "Start a project",
    actionHref: "/dashboard/requests/new",
    groups: [
      {
        label: "Workspace",
        items: [
          { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
          {
            label: "Requests",
            href: "/dashboard/requests",
            icon: FileText,
            badge: "2",
            badgeAriaLabel: "2 requests need your reply",
          },
          {
            label: "Proposals",
            href: "/dashboard/proposals",
            icon: FileClock,
            badge: "1",
            badgeAriaLabel: "1 proposal awaiting decision",
          },
          {
            label: "Projects",
            href: "/dashboard/projects",
            icon: FolderKanban,
            badge: "1",
            badgeAriaLabel: "1 project has drafts in review",
          },
          { label: "Files", href: "/dashboard/files", icon: Files },
          {
            label: "Messages",
            href: "/dashboard/messages",
            icon: MessageSquare,
            badge: "3",
            badgeAriaLabel: "3 unread messages",
          },
        ],
      },
      {
        label: "Account",
        items: [
          { label: "Profile", href: "/dashboard/profile", icon: Users },
          { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
        ],
      },
    ],
  },
  CREATOR: {
    name: "Creator",
    workspace: "Production workspace",
    action: "View my tasks",
    actionHref: "/creator/tasks",
    groups: [
      {
        label: "My work",
        items: [
          { label: "Overview", href: "/creator", icon: LayoutDashboard },
          { label: "My tasks", href: "/creator/tasks", icon: ClipboardCheck, badge: "4" },
        ],
      },
    ],
  },
  ADMIN: {
    name: "Admin",
    workspace: "Agency operations",
    action: "Review requests",
    actionHref: "/admin/requests",
    groups: [
      {
        label: "Operations",
        items: [
          { label: "Overview", href: "/admin", icon: LayoutDashboard },
          { label: "Project requests", href: "/admin/requests", icon: FileText, badge: "5" },
          { label: "Projects", href: "/admin/projects", icon: FolderKanban },
          { label: "Creative reviews", href: "/admin/review", icon: ClipboardCheck, badge: "3" },
        ],
      },
      {
        label: "People & business",
        items: [
          {
            label: "Creator applications",
            href: "/admin/creator-applications",
            icon: Users,
            badge: "2",
          },
          { label: "Team", href: "/admin/team", icon: BriefcaseBusiness },
          { label: "Services & pricing", href: "/admin/services", icon: Settings2 },
          { label: "Portfolio", href: "/admin/portfolio", icon: Sparkles },
        ],
      },
    ],
  },
};

const ROLE_NOTIFICATIONS: Record<DashboardRole, { title: string; detail: string }[]> = {
  USER: [
    { title: "Proposal ready to review", detail: "Q4 Meta Campaign · 2 hours ago" },
    { title: "Drafts submitted for review", detail: "Display Retargeting · 3 hours ago" },
    { title: "Brief question asked", detail: "Spring Promo Request · Yesterday" },
  ],
  CREATOR: [
    { title: "Feedback on your submission", detail: "Spring Launch · 35 minutes ago" },
    { title: "New task assigned", detail: "Product Hook Variations · Today" },
  ],
  ADMIN: [
    { title: "3 creative reviews waiting", detail: "Oldest submission · 4 hours ago" },
    { title: "New project request", detail: "Northstar Outdoor · 1 hour ago" },
  ],
};

function pageTitle(pathname: string, role: DashboardRole) {
  if (pathname.includes("/requests/new")) return "Start a project";
  if (/\/requests\/[^/]+/.test(pathname)) return "Request details";
  if (/\/projects\/[^/]+/.test(pathname)) return "Project workspace";
  if (/\/tasks\/[^/]+/.test(pathname)) return "Task workspace";
  if (pathname.startsWith("/dashboard/proposals")) return "Proposals";
  if (pathname.startsWith("/dashboard/files")) return "Files & Assets";
  if (pathname.startsWith("/dashboard/messages")) return "Messages";
  if (pathname.startsWith("/dashboard/profile")) return "Profile";
  if (pathname.startsWith("/dashboard/settings")) return "Settings";
  if (pathname.startsWith("/account")) return "Account";
  const item = ROLE_DETAILS[role].groups
    .flatMap((group) => group.items)
    .find((entry) => entry.href !== ROLE_HOME[role] && pathname.startsWith(entry.href));
  if (pathname === ROLE_HOME[role]) return "Overview";
  if (item) return item.label;
  return "Workspace";
}

function LoadingWorkspace() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] text-sm text-[#5A5852]">
      <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-[#4F46E5]" />
      Loading workspace…
    </div>
  );
}

function DashboardShellInner({
  role,
  children,
}: {
  role: DashboardRole;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const config = ROLE_DETAILS[role];
  const title = useMemo(() => pageTitle(pathname, role), [pathname, role]);

  const appRole = String(session?.user?.appRole ?? "USER").toUpperCase();
  const actualRole: DashboardRole =
    appRole === "ADMIN" || appRole === "CREATOR" ? appRole : "USER";

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/auth?mode=signin");
      return;
    }
    if (actualRole !== role) router.replace(ROLE_HOME[actualRole]);
  }, [actualRole, isPending, role, router, session]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isPending || !session || actualRole !== role) return <LoadingWorkspace />;

  const DEFAULT_AVATAR = "/team/user-avatar.jpg";
  const userName = session.user.name || "Workspace member";
  const userEmail = session.user.email || "";
  const userAvatar =
    session.user.image && session.user.image.trim() !== ""
      ? session.user.image
      : DEFAULT_AVATAR;

  const initials = userName
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const doSignOut = async () => {
    await signOut();
    router.replace("/auth?mode=signin");
  };

  const sidebar = (
    <>
      {/* Brand Header with Real AdsPolisher Logo */}
      <div
        className={`flex h-[76px] shrink-0 items-center border-b border-black/[0.06] bg-white/20 backdrop-blur-md ${
          collapsed ? "justify-center px-2" : "justify-between px-5"
        }`}
      >
        <Link
          href={ROLE_HOME[role]}
          className="flex min-w-0 items-center gap-3 group"
          aria-label="AdsPolisher workspace"
        >
          {collapsed ? (
            <Image
              src="/logo/adspolisher_color.png"
              alt="AdsPolisher"
              width={34}
              height={34}
              className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
              priority
            />
          ) : (
            <div className="flex items-center gap-2">
              <Image
                src="/logo/adspolisher.png"
                alt="AdsPolisher"
                width={140}
                height={38}
                className="h-7 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                priority
              />
            </div>
          )}
        </Link>
        {!collapsed && (
          <span className="hidden rounded-full border border-black/[0.06] bg-white/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600 shadow-xs backdrop-blur-md lg:inline-flex">
            {config.name}
          </span>
        )}
        <button
          className="rounded-lg p-2 text-neutral-500 hover:bg-black/[0.05] md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Primary Action Button (Refined Indigo Gradient Pill) */}
      {!collapsed && (
        <div className="px-3.5 pt-4 pb-1">
          <Link
            href={config.actionHref}
            className="group relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] px-4 text-xs font-bold text-white shadow-[0_4px_16px_rgba(79,70,229,0.25)] transition-all duration-200 hover:shadow-[0_6px_22px_rgba(79,70,229,0.38)] hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {role === "USER" ? (
              <Plus size={15} strokeWidth={2.5} />
            ) : role === "ADMIN" ? (
              <CheckCheck size={15} strokeWidth={2.5} />
            ) : (
              <ClipboardCheck size={15} strokeWidth={2.5} />
            )}
            <span>{config.action}</span>
          </Link>
        </div>
      )}

      {/* Navigation Groups */}
      <nav
        className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-3"
        aria-label={`${config.name} navigation`}
      >
        {config.groups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[.16em] text-neutral-400">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === ROLE_HOME[role]
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex h-10 items-center gap-2.5 rounded-xl px-2.5 text-[13px] transition-all duration-150 ${
                      active
                        ? "bg-white/90 font-bold text-[#141413] shadow-[0_2px_10px_rgba(20,20,19,0.06)] border border-white/95 ring-1 ring-black/[0.04]"
                        : "text-[#5A5852] hover:bg-white/60 hover:text-[#141413] hover:shadow-xs"
                    }`}
                  >
                    {/* Icon container */}
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors ${
                        active
                          ? "bg-[#EEF2FF] text-[#4F46E5]"
                          : "text-neutral-400 group-hover:text-neutral-700 group-hover:bg-black/[0.03]"
                      }`}
                    >
                      <Icon size={16} strokeWidth={active ? 2.3 : 1.8} />
                    </span>

                    {!collapsed && (
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <span
                        aria-label={item.badgeAriaLabel || `${item.badge} items`}
                        className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${
                          active
                            ? "bg-[#D9480F] text-white shadow-xs"
                            : "bg-[#D9480F]/15 text-[#D9480F]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Active Pod Mini-Widget (for USER role) */}
        {!collapsed && role === "USER" && (
          <div className="mt-4 rounded-2xl border border-white/80 bg-white/55 p-3.5 backdrop-blur-xl shadow-xs ring-1 ring-black/[0.04]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-[#141413]">Creative Pod #4</span>
              </div>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                ACTIVE
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-[#5A5852] leading-snug">
              Maya &amp; Liam assigned · 2 drafts ready in review queue.
            </p>
            <Link
              href="/dashboard/projects/proj-1988"
              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#4F46E5] hover:underline"
            >
              <span>Review drafts</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        )}
      </nav>

      {/* Footer: Pinned User Profile Card + Help Button */}
      <div className="shrink-0 border-t border-black/[0.06] bg-white/20 p-2.5 backdrop-blur-md">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } gap-2`}
        >
          <Link
            href="/dashboard/profile"
            title={collapsed ? userName : undefined}
            className="flex items-center gap-2.5 min-w-0 p-1 rounded-xl hover:bg-white/70 transition group"
          >
            <div className="relative shrink-0">
              <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#4F46E5]/30 shadow-xs bg-neutral-200">
                <img
                  src={userAvatar}
                  alt={userName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1.5 ring-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0 text-left">
                <p className="truncate text-xs font-bold text-[#141413] group-hover:text-[#4F46E5] transition-colors">
                  {userName}
                </p>
                <p className="truncate text-[10px] font-medium text-neutral-400">
                  {config.name} workspace
                </p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <a
              href="mailto:support@adspolisher.com"
              title="Help & support"
              className="grid h-8 w-8 place-items-center rounded-xl text-neutral-400 hover:bg-white/80 hover:text-[#141413] transition"
            >
              <CircleHelp size={16} />
            </a>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="relative flex h-dvh min-h-[560px] overflow-hidden bg-gradient-to-br from-[#F6F3EC] via-[#ECE8DF] to-[#E3DED4] text-[#141413]">
      {/* Ambient luminous glow orbs for authentic glassy refraction across sidebar, navbar & canvas */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Top-left vibrant indigo orb - shines directly through sidebar header */}
        <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#4F46E5]/25 via-[#818CF8]/18 to-transparent blur-3xl" />
        {/* Top-center warm amber gold orb - shines directly through top navbar */}
        <div className="absolute -top-16 left-1/4 h-[440px] w-[620px] rounded-full bg-gradient-to-r from-[#D9480F]/20 via-[#F59E0B]/24 to-[#4F46E5]/16 blur-3xl" />
        {/* Mid-left cyan / azure orb - shines through sidebar menu */}
        <div className="absolute top-1/3 -left-20 h-[480px] w-[420px] rounded-full bg-gradient-to-tr from-[#06B6D4]/22 via-[#3B82F6]/16 to-transparent blur-3xl" />
        {/* Bottom-right violet & rose glow - shines through dashboard cards */}
        <div className="absolute -bottom-24 right-10 h-[540px] w-[540px] rounded-full bg-gradient-to-tl from-[#6366F1]/20 via-[#EC4899]/14 to-transparent blur-3xl" />
        {/* Subtle glass grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1414130a_1px,transparent_1px),linear-gradient(to_bottom,#1414130a_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
      </div>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      {/* Glassy Frosted Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-black/[0.06] bg-[#FAF8F5]/85 backdrop-blur-2xl backdrop-saturate-150 shadow-[2px_0_24px_rgba(0,0,0,0.03)] transition-[transform,width] duration-200 md:relative md:z-auto md:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "md:w-[74px]" : "md:w-[270px]"}`}
      >
        {sidebar}
        <button
          onClick={() => setCollapsed((value) => !value)}
          className="hidden h-11 shrink-0 items-center justify-center gap-2 border-t border-black/[0.06] bg-white/20 text-xs font-medium text-neutral-500 backdrop-blur-md hover:bg-white/60 hover:text-neutral-900 md:flex transition"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <>
              <PanelLeftClose size={16} />
              <span>Collapse sidebar</span>
            </>
          )}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Glassy Frosted Top Navbar */}
        <header className="z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-white/60 bg-white/45 px-4 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_4px_30px_rgba(0,0,0,0.03)] md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-neutral-600 hover:bg-black/[0.05] md:hidden"
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-[#141413]">
                {title}
              </h1>
            </div>
          </div>

          {/* Search Trigger Bar (Command Palette ⌘K) */}
          <div className="hidden sm:flex flex-1 max-w-md mx-6">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-white/80 bg-white/55 px-3.5 py-2 text-xs text-neutral-600 shadow-xs backdrop-blur-xl transition hover:border-[#4F46E5]/40 hover:bg-white/85 hover:text-neutral-900 ring-1 ring-black/[0.04]"
            >
              <div className="flex items-center gap-2">
                <Search size={14} className="text-[#4F46E5]" />
                <span>Search projects, files, requests…</span>
              </div>
              <kbd className="rounded border border-black/[0.08] bg-black/[0.04] px-1.5 py-0.5 text-[10px] font-mono font-semibold text-neutral-600">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setProfileOpen(false);
                }}
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/80 bg-white/55 text-neutral-600 backdrop-blur-xl shadow-xs ring-1 ring-black/[0.04] transition hover:bg-white/90 hover:text-[#141413]"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={18} />
                <span className="absolute right-[9px] top-[9px] flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9480F] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9480F] ring-1.5 ring-white" />
                </span>
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-13 z-50 w-[min(360px,calc(100vw-28px))] overflow-hidden rounded-2xl border border-white/80 bg-white/95 backdrop-blur-2xl shadow-2xl">
                  <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3 bg-[#FAF9F5]">
                    <p className="text-sm font-bold text-[#141413]">Notifications</p>
                    <span className="rounded-full bg-[#D9480F]/15 px-2 py-0.5 text-[10px] font-bold text-[#D9480F]">
                      3 unread
                    </span>
                  </div>
                  <div className="divide-y divide-black/[0.05] max-h-72 overflow-y-auto">
                    {ROLE_NOTIFICATIONS[role].map((notification) => (
                      <div
                        key={notification.title}
                        className="px-4 py-3 hover:bg-[#FAF9F5] transition"
                      >
                        <p className="text-xs font-semibold text-[#141413]">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-500">
                          {notification.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/[0.06] p-2 bg-[#FAF9F5] text-center">
                    <Link
                      href="/dashboard/requests"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs font-semibold text-[#4F46E5] hover:underline"
                    >
                      View all activity →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown with Guaranteed User Photo Image */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
                className="group flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/55 p-1.5 pr-2.5 backdrop-blur-xl shadow-xs ring-1 ring-black/[0.04] transition hover:border-[#4F46E5]/40 hover:bg-white/90"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {/* User Photographic Image Avatar */}
                <div className="relative shrink-0">
                  <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#4F46E5]/30 ring-offset-2 ring-offset-white/80 shadow-sm bg-neutral-200">
                    <img
                      src={userAvatar}
                      alt={userName}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Active online green dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </span>
                </div>
                <span className="hidden max-w-36 text-left sm:block">
                  <span className="block truncate text-xs font-bold text-[#141413]">
                    {userName}
                  </span>
                  <span className="block text-[10px] font-semibold text-[#4F46E5]">
                    {config.name} workspace
                  </span>
                </span>
                <ChevronDown size={14} className="hidden text-neutral-400 transition-transform group-hover:text-neutral-700 sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-3xl border border-white/80 bg-white/95 backdrop-blur-2xl p-2 shadow-[0_20px_50px_rgba(20,20,19,0.14)]">
                  {/* Profile Header with user image */}
                  <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#FAF9F5] to-[#F5F2EB] p-3 border border-black/[0.04]">
                    <div className="relative shrink-0">
                      <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-[#4F46E5] ring-offset-2 ring-offset-white shadow-md bg-neutral-200">
                        <img
                          src={userAvatar}
                          alt={userName}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#141413]">{userName}</p>
                      <p className="truncate text-[11px] text-neutral-500">{userEmail}</p>
                      <span className="mt-1 inline-flex items-center rounded-full bg-[#4F46E5]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#4F46E5]">
                        {config.name} Role
                      </span>
                    </div>
                  </div>

                  <div className="mt-1.5 space-y-0.5">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAF9F5] hover:text-[#141413] transition"
                    >
                      <Users size={15} className="text-[#4F46E5]" />
                      Company &amp; Brand Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAF9F5] hover:text-[#141413] transition"
                    >
                      <Settings2 size={15} className="text-neutral-500" />
                      Account Settings
                    </Link>
                    <Link
                      href="/auth/forgot-password"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-[#FAF9F5] hover:text-[#141413] transition"
                    >
                      <ShieldCheck size={15} className="text-neutral-500" />
                      Security &amp; Passwords
                    </Link>
                  </div>

                  <div className="mt-1.5 border-t border-black/[0.06] pt-1">
                    <button
                      onClick={doSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut size={15} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Workspace Body */}
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>
      </div>

      {/* Command Palette Modal (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default function DashboardShell(props: {
  role: DashboardRole;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <DashboardShellInner {...props} />
    </Suspense>
  );
}
