




"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import FreeTrialCard from "@/components/access/FreeTrialCard";
import { useAuthStore } from "@/stores";

export default function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const { user } = useAuthStore();

  const hasSecondaryPlan =
    Array.isArray(user?.plans) &&
    user.plans.includes("SECONDARY");

  /*
   * Do not show the Free Trial Card inside:
   *
   * 1. Quiz Board live game
   *    /student/quiz-board/123/play
   *
   * 2. Word Challenge
   *    /student/games/word-challenge
   */
  const isQuizBoardPlayPage =
    pathname.includes("/quiz-board/") &&
    pathname.endsWith("/play");

  const isWordChallengePage =
    pathname === "/student/games/word-challenge" ||
    pathname.startsWith("/student/games/word-challenge/");

  const shouldShowFreeTrial =
    !hasSecondaryPlan &&
    !isQuizBoardPlayPage &&
    !isWordChallengePage;

  return (
    <DashboardLayout role="student">
      {children}

      {shouldShowFreeTrial && (
        <FreeTrialCard
          createdAt={user?.createdAt}
          actionHref="/student/access/secondary"
          actionLabel="Activate Learning Now"
        />
      )}
    </DashboardLayout>
  );
}