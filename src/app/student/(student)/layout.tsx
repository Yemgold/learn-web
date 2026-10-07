

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

  // Hide FreeTrialCard only on the live Quiz Board play page.
  const isQuizBoardPlayPage =
    pathname.includes("/quiz-board/") &&
    pathname.endsWith("/play");

  // Word Challenge is allowed to show FreeTrialCard.
  const isWordChallengePage =
    pathname === "/student/games/word-challenge" ||
    pathname.startsWith("/student/games/word-challenge/");

  const shouldShowFreeTrial =
    !hasSecondaryPlan &&
    (!isQuizBoardPlayPage || isWordChallengePage);

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










// "use client";

// import type { ReactNode } from "react";
// import { usePathname } from "next/navigation";

// import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
// import FreeTrialCard from "@/components/access/FreeTrialCard";
// import { useAuthStore } from "@/stores";

// export default function StudentLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const pathname = usePathname();

//   const { user } = useAuthStore();

//   const hasSecondaryPlan =
//     Array.isArray(user?.plans) &&
//     user.plans.includes("SECONDARY");

//   /*
//    * Do not show the Free Trial Card
//    * inside the Quiz Board live game.
//    *
//    * Example:
//    * /student/quiz-board/123/play
//    */
//   const isQuizBoardPlayPage =
//     pathname.includes("/quiz-board/") &&
//     pathname.endsWith("/play");

//   const shouldShowFreeTrial =
//     !hasSecondaryPlan && !isQuizBoardPlayPage;

//   return (
//     <DashboardLayout role="student">
//       {children}

//       {shouldShowFreeTrial && (
//         <FreeTrialCard
//           createdAt={user?.createdAt}
//           actionHref="/student/access/secondary"
//           actionLabel="Activate Learning Now"
//         />
//       )}
//     </DashboardLayout>
//   );
// }
