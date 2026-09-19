




"use client";

import type { ReactNode } from "react";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import FreeTrialCard from "@/components/access/FreeTrialCard";
import { useAuthStore } from "@/stores";

export default function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuthStore();

  const hasSecondaryPlan =
    Array.isArray(user?.plans) &&
    user.plans.includes("SECONDARY");

  return (
    <DashboardLayout role="student">
      {children}

      {!hasSecondaryPlan && (
        <FreeTrialCard
          createdAt={user?.createdAt}
          actionHref="/student/access/secondary"
          actionLabel="Activate Learning Now"
        />
      )}
    </DashboardLayout>
  );
}