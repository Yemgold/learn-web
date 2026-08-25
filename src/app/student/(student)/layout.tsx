

// C:\Users\Lara Spellman\Jamb\jamb-league\src\app\student\(student)\layout.tsx

import type { ReactNode } from "react";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

export default function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout role="student">
      {children}
    </DashboardLayout>
  );
}