import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="ADMIN">{children}</DashboardShell>;
}
