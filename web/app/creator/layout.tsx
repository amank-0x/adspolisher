"use client";

import { Suspense, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";

function CreatorDashboardLayoutInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/creator/login") return <>{children}</>;
  return <DashboardShell role="CREATOR">{children}</DashboardShell>;
}

export default function CreatorDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <CreatorDashboardLayoutInner>{children}</CreatorDashboardLayoutInner>
    </Suspense>
  );
}
