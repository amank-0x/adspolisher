import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function CreatorDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="CREATOR">{children}</DashboardShell>;
}
