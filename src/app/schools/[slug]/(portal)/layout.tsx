

import type { ReactNode } from "react";

import DashboardLayout from "@/components/schools/school/DashboardLayout";
import { SchoolProvider } from "@/components/schools/providers";

interface Props {
  children: ReactNode;
}

export default function SchoolPortalLayout({
  children,
}: Props) {
  return (
    <SchoolProvider>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </SchoolProvider>
  );
}