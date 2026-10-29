"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";

function AdminDashboardLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <DashboardShell role="ADMIN">{children}</DashboardShell>;
}

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AdminDashboardLayoutInner>{children}</AdminDashboardLayoutInner>
    </Suspense>
  );
}
