import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="USER">{children}</DashboardShell>;
}
