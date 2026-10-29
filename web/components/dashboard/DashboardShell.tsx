"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  CheckCheck,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

export type DashboardRole = "USER" | "CREATOR" | "ADMIN";

type NavItem = { label: string; href: string; icon: LucideIcon; badge?: string };
type NavGroup = { label: string; items: NavItem[] };

const ROLE_HOME: Record<DashboardRole, string> = {
  USER: "/dashboard",
  CREATOR: "/creator",
  ADMIN: "/admin",
};

const ROLE_DETAILS: Record<DashboardRole, { name: string; workspace: string; action: string; actionHref: string; groups: NavGroup[] }> = {
  USER: {
    name: "Customer",
    workspace: "Client workspace",
    action: "Start a project",
    actionHref: "/dashboard/requests/new",
    groups: [
      { label: "Workspace", items: [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "Requests", href: "/dashboard/requests", icon: FileText, badge: "2" },
        { label: "Projects", href: "/dashboard/projects", icon: FolderKanban, badge: "2" },
      ] },
    ],
  },
  CREATOR: {
    name: "Creator",
    workspace: "Production workspace",
    action: "View my tasks",
    actionHref: "/creator/tasks",
    groups: [
      { label: "My work", items: [
        { label: "Overview", href: "/creator", icon: LayoutDashboard },
        { label: "My tasks", href: "/creator/tasks", icon: ClipboardCheck, badge: "4" },
      ] },
    ],
  },
  ADMIN: {
    name: "Admin",
    workspace: "Agency operations",
    action: "Review requests",
    actionHref: "/admin/requests",
    groups: [
      { label: "Operations", items: [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "Project requests", href: "/admin/requests", icon: FileText, badge: "5" },
        { label: "Projects", href: "/admin/projects", icon: FolderKanban },
        { label: "Creative reviews", href: "/admin/review", icon: ClipboardCheck, badge: "3" },
      ] },
      { label: "People & business", items: [
        { label: "Creator applications", href: "/admin/creator-applications", icon: Users, badge: "2" },
        { label: "Team", href: "/admin/team", icon: BriefcaseBusiness },
        { label: "Services & pricing", href: "/admin/services", icon: Settings2 },
        { label: "Portfolio", href: "/admin/portfolio", icon: Sparkles },
      ] },
    ],
  },
};

const ROLE_NOTIFICATIONS: Record<DashboardRole, { title: string; detail: string }[]> = {
  USER: [
    { title: "Proposal ready to review", detail: "Q4 Meta Campaign · 2 hours ago" },
    { title: "Drafts submitted", detail: "Display Retargeting · Yesterday" },
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
  if (pathname.startsWith("/account")) return "Account";
  const item = ROLE_DETAILS[role].groups.flatMap((group) => group.items)
    .find((entry) => entry.href !== ROLE_HOME[role] && pathname.startsWith(entry.href));
  if (pathname === ROLE_HOME[role]) return "Overview";
  if (item) return item.label;
  return "Workspace";
}

function LoadingWorkspace() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2] text-sm text-neutral-500">
      <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      Loading workspace…
    </div>
  );
}

function DashboardShellInner({ role, children }: { role: DashboardRole; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const config = ROLE_DETAILS[role];
  const title = useMemo(() => pageTitle(pathname, role), [pathname, role]);

  const appRole = String(session?.user?.appRole ?? "USER").toUpperCase();
  const actualRole: DashboardRole = appRole === "ADMIN" || appRole === "CREATOR" ? appRole : "USER";

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

  if (isPending || !session || actualRole !== role) return <LoadingWorkspace />;

  const userName = session.user.name || "Workspace member";
  const userEmail = session.user.email || "";
  const initials = userName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  const doSignOut = async () => {
    await signOut();
    router.replace("/auth?mode=signin");
  };

  const sidebar = (
    <>
      <div className={`flex h-[76px] shrink-0 items-center border-b border-black/[0.07] ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}>
        <Link href={ROLE_HOME[role]} className="flex min-w-0 items-center gap-3" aria-label="AdSpolisher workspace">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#141413] text-sm font-bold tracking-tight text-white">A.</span>
          {!collapsed && <span className="truncate text-[15px] font-semibold tracking-[-0.03em]">AdSpolisher</span>}
        </Link>
        {!collapsed && <span className="hidden rounded-full border border-black/[0.08] px-2 py-1 text-[9px] font-semibold uppercase tracking-[.14em] text-neutral-500 lg:inline-flex">{config.name}</span>}
        <button className="rounded-lg p-2 text-neutral-500 hover:bg-black/[0.05] md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
      </div>

      {!collapsed && (
        <Link href={config.actionHref} className="mx-4 mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#141413] px-4 text-[13px] font-semibold text-white transition hover:bg-neutral-700">
          {role === "USER" ? <Plus size={16} /> : role === "ADMIN" ? <CheckCheck size={16} /> : <ClipboardCheck size={16} />}
          {config.action}
        </Link>
      )}

      <nav className="min-h-0 flex-1 space-y-7 overflow-y-auto px-3 py-6" aria-label={`${config.name} navigation`}>
        {config.groups.map((group) => (
          <div key={group.label}>
            {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-neutral-400">{group.label}</p>}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.href === ROLE_HOME[role] ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} className={`group flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] transition ${active ? "bg-white font-semibold text-[#141413] shadow-[0_1px_2px_rgba(20,20,19,.06)] ring-1 ring-black/[0.05]" : "text-neutral-600 hover:bg-white/75 hover:text-[#141413]"}`}>
                    <Icon size={17} strokeWidth={active ? 2.2 : 1.8} className="shrink-0" />
                    {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge && <span className={`min-w-5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold ${active ? "bg-[#141413] text-white" : "bg-black/[0.06] text-neutral-600"}`}>{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={`shrink-0 border-t border-black/[0.07] p-3 ${collapsed ? "text-center" : ""}`}>
        <a href="mailto:support@adspolisher.com" title={collapsed ? "Help & support" : undefined} className="flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] text-neutral-600 transition hover:bg-white/75 hover:text-[#141413]">
          <CircleHelp size={17} className="shrink-0" />
          {!collapsed && <span>Help &amp; support</span>}
        </a>
        {!collapsed && <p className="px-3 pb-1 pt-3 text-[10px] text-neutral-400">Sample workspace view</p>}
      </div>
    </>
  );

  return (
    <div className="flex h-dvh min-h-[560px] overflow-hidden bg-[#f7f6f2] text-[#141413]">
      {mobileOpen && <button className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-black/[0.07] bg-[#fbfaf7] shadow-xl transition-[transform,width] duration-200 md:relative md:z-auto md:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${collapsed ? "md:w-[82px]" : "md:w-[258px]"}`}>
        {sidebar}
        <button onClick={() => setCollapsed((value) => !value)} className="hidden h-11 shrink-0 items-center justify-center gap-2 border-t border-black/[0.07] text-xs text-neutral-500 hover:bg-white hover:text-neutral-900 md:flex" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeftOpen size={16} /> : <><PanelLeftClose size={16} /><span>Collapse sidebar</span></>}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 flex h-[76px] shrink-0 items-center justify-between border-b border-black/[0.07] bg-[#fbfaf7]/95 px-4 backdrop-blur md:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-neutral-600 hover:bg-black/[0.05] md:hidden" aria-label="Open navigation"><Menu size={19} /></button>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-[.15em] text-neutral-400">{config.workspace}</p>
              <h1 className="truncate text-[17px] font-semibold tracking-[-.025em]">{title}</h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative">
              <button onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false); }} className="relative grid h-10 w-10 place-items-center rounded-xl text-neutral-600 transition hover:bg-black/[0.05]" aria-label="Notifications" aria-expanded={notificationsOpen}>
                <Bell size={18} />
                <span className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full bg-[#d9480f] ring-2 ring-[#fbfaf7]" />
              </button>
              {notificationsOpen && <div className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-28px))] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3"><p className="text-sm font-semibold">Notifications</p><span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-800">2 new</span></div>
                {ROLE_NOTIFICATIONS[role].map((notification) => <div key={notification.title} className="border-b border-black/[0.05] px-4 py-3 last:border-0"><p className="text-xs font-semibold">{notification.title}</p><p className="mt-1 text-[11px] text-neutral-500">{notification.detail}</p></div>)}
              </div>}
            </div>

            <div className="relative">
              <button onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false); }} className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition hover:bg-black/[0.04]" aria-label="Open profile menu" aria-expanded={profileOpen}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dedbd2] text-xs font-bold text-[#34322e]">{initials || "A"}</span>
                <span className="hidden max-w-32 text-left sm:block"><span className="block truncate text-xs font-semibold">{userName}</span><span className="block text-[10px] text-neutral-500">{config.name} account</span></span>
                <ChevronDown size={14} className="hidden text-neutral-400 sm:block" />
              </button>
              {profileOpen && <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-black/[0.08] bg-white py-2 shadow-xl">
                <div className="border-b border-black/[0.06] px-4 pb-3 pt-2"><p className="truncate text-xs font-semibold">{userName}</p><p className="mt-1 truncate text-[11px] text-neutral-500">{userEmail}</p></div>
                <Link href="/account#profile" className="flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50"><Users size={15} />My Profile</Link>
                <Link href="/account#settings" className="flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50"><Settings2 size={15} />Account Settings</Link>
                <Link href="/auth/forgot-password" className="flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50"><ShieldCheck size={15} />Security</Link>
                <a href="mailto:support@adspolisher.com" className="flex items-center gap-3 px-4 py-2.5 text-xs text-neutral-700 hover:bg-neutral-50"><MessageSquare size={15} />Help &amp; Support</a>
                <div className="mt-1 border-t border-black/[0.06] pt-1"><button onClick={doSignOut} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs font-medium text-red-700 hover:bg-red-50"><LogOut size={15} />Sign out</button></div>
              </div>}
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
          <div className="mx-auto w-full max-w-[1320px]">{children}</div>
          <div className="mx-auto mt-8 flex max-w-[1320px] items-center gap-2 border-t border-black/[0.07] pt-4 text-[10px] text-neutral-400"><Activity size={13} />Illustrative workspace data · Not connected to a live account</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardShell(props: { role: DashboardRole; children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <DashboardShellInner {...props} />
    </Suspense>
  );
}
