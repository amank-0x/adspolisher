"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  MessageSquare,
  Plus,
  ExternalLink,
  LogOut,
  ChevronDown,
  Bell,
  Menu,
  X,
  Search,
} from "lucide-react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userName = session?.user?.name || "Client";
  const userEmail = session?.user?.email || "client@company.com";
  const userInitials =
    userName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "CL";

  const navLinks = [
    { label: "Overview", href: "/dashboard", exact: true, icon: LayoutDashboard },
    { label: "Requests & Quotes", href: "/dashboard/requests", exact: false, icon: FileText, badge: "1" },
    { label: "Active Projects", href: "/dashboard/projects", exact: false, icon: FolderKanban, badge: "2" },
  ];

  const isLinkActive = (item: { href: string; exact: boolean }) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await signOut();
    window.location.href = "/auth?mode=signin";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f7f4] text-[#141413] font-sans antialiased">
      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Clean Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-black/[0.08] bg-[#fdfdfc] transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-black/[0.06] px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <Image
              src="/logo/adspolisher.png"
              alt="AdsPolisher"
              width={140}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-black md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary CTA */}
        <div className="p-4 border-b border-black/[0.04]">
          <Link
            href="/dashboard/requests/new"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-neutral-800 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Start a Project</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
            Navigation
          </div>
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const active = isLinkActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    active
                      ? "bg-neutral-900 text-white font-semibold"
                      : "text-neutral-600 hover:bg-black/[0.04] hover:text-black"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        active
                          ? "bg-neutral-800 text-neutral-200"
                          : "bg-neutral-200/80 text-neutral-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-black/[0.06] p-4 text-xs space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-md px-3 py-2 text-neutral-600 hover:bg-black/[0.04] hover:text-black transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
          </Link>
          <div className="px-3 pt-2 text-[11px] text-neutral-600">
            AdsPolisher &bull; Client Portal
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Minimal Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/[0.08] bg-[#fdfdfc] px-6 lg:px-8">
          {/* Left: Mobile hamburger & breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-black md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-600 font-medium">
              <span>Client Workspace</span>
              <span>/</span>
              <span className="text-neutral-900 font-semibold">
                {pathname.includes("/requests")
                  ? "Requests & Proposals"
                  : pathname.includes("/projects")
                  ? "Active Projects"
                  : "Overview"}
              </span>
            </div>
          </div>

          {/* Right: Notifications & User Profile with Logout */}
          <div className="flex items-center gap-4">
            {/* User Profile Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-lg border border-black/[0.08] bg-white px-2.5 py-1.5 text-left text-xs transition-colors hover:border-black/20 hover:bg-neutral-50"
                aria-label="User profile and settings"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 font-semibold text-white text-[11px]">
                  {userInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-semibold text-neutral-900 leading-tight">
                    {userName}
                  </div>
                  <div className="text-[10px] text-neutral-600 leading-tight">
                    Customer Account
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              </button>

              {/* Profile Dropdown Menu with Logout */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-black/10 bg-white py-2 shadow-xl z-50 text-xs">
                    {/* User Info */}
                    <div className="border-b border-black/[0.06] px-4 py-2.5">
                      <p className="font-semibold text-neutral-900 truncate">
                        {userName}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {userEmail}
                      </p>
                    </div>

                    {/* Navigation inside menu */}
                    <div className="py-1">
                      <Link
                        href="/dashboard/requests"
                        className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-black"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        My Requests &amp; Quotes
                      </Link>
                      <Link
                        href="/dashboard/projects"
                        className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-black"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        My Active Projects
                      </Link>
                      <Link
                        href="/"
                        target="_blank"
                        className="flex items-center justify-between px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-black"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <span>Public Showcase</span>
                        <ExternalLink className="h-3 w-3 text-neutral-400" />
                      </Link>
                    </div>

                    {/* Logout Option */}
                    <div className="border-t border-black/[0.06] pt-1 mt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5 text-neutral-500 hover:text-red-600" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#f8f7f4] text-xs text-neutral-500">
          Loading workspace...
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
