



import type { ReactNode } from "react";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout role="admin">
      {children}
    </DashboardLayout>
  );
}