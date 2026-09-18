





// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Clock3, Gift, ShieldCheck } from "lucide-react";

// import type { QuickAction } from "@/components/dashboard/widgets/QuickActions";
// import type { StatCardProps } from "@/components/dashboard/widgets/StatCard";

// import {
//   QuickActions,
//   StatsGrid,
//   UpcomingCompetitions,
// } from "@/components/dashboard/widgets";

// import AccessBlocker from "@/components/access/AccessBlocker";

// import { useAuthStore } from "@/stores";

// import { useRouter } from "next/navigation";

// const FREE_TRIAL_DAYS = 30;
// const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

// export default function StudentDashboardPage() {
//   /* ============================================================
//      AUTH
//      ============================================================ */

//   const { user } = useAuthStore();

//   const router = useRouter();

//   /* ============================================================
//      PLAN / FREE TRIAL
//      ============================================================ */

//   const hasSecondaryPlan =
//     Array.isArray(user?.plans) &&
//     user.plans.includes("SECONDARY");

//   /*
//    * A student with no plan receives a 30-day free trial.
//    *
//    * The trial starts from the user's registration date,
//    * NOT from the date they visit this page.
//    */
//   const trialEndsAt = useMemo(() => {
//     if (!user?.createdAt) {
//       return null;
//     }

//     const createdAt = new Date(user.createdAt).getTime();

//     if (Number.isNaN(createdAt)) {
//       return null;
//     }

//     return createdAt + FREE_TRIAL_DAYS * MILLISECONDS_IN_DAY;
//   }, [user?.createdAt]);

//   const [remainingTime, setRemainingTime] = useState(() => {
//     if (!trialEndsAt) {
//       return 0;
//     }

//     return Math.max(0, trialEndsAt - Date.now());
//   });

//   /* ============================================================
//      COUNTDOWN
//      ============================================================ */

//   useEffect(() => {
//     /*
//      * Students with an active SECONDARY plan don't need
//      * the free-trial countdown.
//      */
//     if (hasSecondaryPlan || !trialEndsAt) {
//       setRemainingTime(0);
//       return;
//     }

//     const updateCountdown = () => {
//       const remaining = Math.max(0, trialEndsAt - Date.now());

//       setRemainingTime(remaining);
//     };

//     updateCountdown();

//     const interval = window.setInterval(updateCountdown, 1000);

//     return () => {
//       window.clearInterval(interval);
//     };
//   }, [hasSecondaryPlan, trialEndsAt]);

//   /* ============================================================
//      TRIAL STATUS
//      ============================================================ */

//   const isFreeTrialActive =
//     !hasSecondaryPlan &&
//     trialEndsAt !== null &&
//     remainingTime > 0;

//   const isFreeTrialExpired =
//     !hasSecondaryPlan &&
//     trialEndsAt !== null &&
//     remainingTime <= 0;

//   /*
//    * A student can access Secondary features when:
//    *
//    * 1. They have the SECONDARY plan, OR
//    * 2. They are still within their 30-day free trial.
//    */
//   const hasSecondaryAccess =
//     hasSecondaryPlan || isFreeTrialActive;

//   /* ============================================================
//      FORMAT COUNTDOWN
//      ============================================================ */

//   const countdown = useMemo(() => {
//     const totalSeconds = Math.floor(remainingTime / 1000);

//     const days = Math.floor(
//       totalSeconds / (24 * 60 * 60),
//     );

//     const hours = Math.floor(
//       (totalSeconds % (24 * 60 * 60)) / (60 * 60),
//     );

//     const minutes = Math.floor(
//       (totalSeconds % (60 * 60)) / 60,
//     );

//     const seconds = totalSeconds % 60;

//     return {
//       days,
//       hours,
//       minutes,
//       seconds,
//     };
//   }, [remainingTime]);

//   /* ============================================================
//      STATISTICS
//      ============================================================ */

//   const stats: StatCardProps[] = [
//     {
//       title: "Competitions",
//       value: 12,
//       icon: "trophy",
//       change: 15,
//       changeLabel: "from last month",
//     },
//     {
//       title: "Current Rank",
//       value: "#18",
//       icon: "medal",
//     },
//     {
//       title: "Practice Tests",
//       value: 147,
//       icon: "book",
//     },
//     {
//       title: "Team Members",
//       value: 3,
//       icon: "users",
//     },
//   ];

//   /* ============================================================
//      QUICK ACTIONS
//      ============================================================ */

//   const actions: QuickAction[] = [
//     {
//       title: "CBT Wallet",
//       description: "Manage your CBT points",
//       href: "/student/practice/cbt-wallet",
//       icon: "wallet",
//     },

//     {
//       title: "Solve & Win Questions",
//       description: "Earn While You Learn",
//       href: "/student/solve-and-win",
//       icon: "trophy",
//     },

//     {
//       title: "Learning Arena",
//       description: "Learn through guided lessons",
//       href: "/student/arena",
//       icon: "play",
//     },

//     {
//       title: "Past Questions Mode",
//       description: "Practice Past Questions",
//       href: "/student/practice",
//       icon: "book",
//     },
//   ];

//   /* ============================================================
//      COMPETITIONS
//      ============================================================ */

//   const competitions = [
//     {
//       id: "1",
//       title: "JAMB League August Challenge",
//       date: "15 August 2026",
//       time: "10:00 AM",
//       teams: 128,
//       status: "Registration Open" as const,
//       href: "/student/competitions/1",
//     },
//     {
//       id: "2",
//       title: "Science Quiz Championship",
//       date: "28 August 2026",
//       time: "09:00 AM",
//       teams: 82,
//       status: "Upcoming" as const,
//       href: "/student/competitions/2",
//     },
//   ];

//   /* ============================================================
//      RENDER
//      ============================================================ */

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//       {/* ========================================================
//           BACKGROUND ATMOSPHERE
//          ======================================================== */}

//       <div className="pointer-events-none fixed inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

//         <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.1),rgba(2,6,23,0.7))]" />
//       </div>

//       {/* ========================================================
//           CONTENT
//          ======================================================== */}

//       <div className="relative space-y-8">
//         {/* ======================================================
//             WELCOME
//            ====================================================== */}

//         <section
//           className="
//             relative
//             overflow-hidden
//             rounded-3xl
//             border
//             border-white/10
//             bg-white/[0.035]
//             p-6
//             shadow-2xl
//             shadow-black/20
//             backdrop-blur-sm
//             sm:p-8
//           "
//         >
//           <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

//           <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

//           <div className="relative">
//             <div className="mb-4 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
//               Student Dashboard
//             </div>

//             <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
//               Welcome back 👋
//             </h1>

//             <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
//               Continue your preparation, practice consistently,
//               and climb the national leaderboard.
//             </p>
//           </div>
//         </section>

//         {/* ======================================================
//             FREE TRIAL
//            ====================================================== */}

//         {isFreeTrialActive && (
//           <section
//             className="
//               relative
//               overflow-hidden
//               rounded-3xl
//               border
//               border-blue-400/20
//               bg-blue-500/[0.08]
//               p-6
//               shadow-2xl
//               shadow-blue-950/20
//               backdrop-blur-sm
//               sm:p-8
//             "
//           >
//             {/* Decorative glow */}

//             <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

//             <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

//             <div className="relative">
//               <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
//                 {/* ==================================================
//                     TRIAL INFORMATION
//                    ================================================== */}

//                 <div className="flex items-start gap-4">
//                   <div
//                     className="
//                       flex
//                       h-14
//                       w-14
//                       shrink-0
//                       items-center
//                       justify-center
//                       rounded-2xl
//                       border
//                       border-blue-400/20
//                       bg-blue-500/10
//                       shadow-lg
//                       shadow-blue-950/20
//                     "
//                   >
//                     <Gift className="h-7 w-7 text-blue-300" />
//                   </div>

//                   <div>
//                     <div className="flex flex-wrap items-center gap-2">
//                       <h2 className="text-lg font-bold text-white sm:text-xl">
//                         Your 30-Day Free Trial
//                       </h2>

//                       <span
//                         className="
//                           rounded-full
//                           border
//                           border-emerald-400/20
//                           bg-emerald-500/10
//                           px-2.5
//                           py-1
//                           text-[10px]
//                           font-bold
//                           uppercase
//                           tracking-wider
//                           text-emerald-300
//                         "
//                       >
//                         Active
//                       </span>
//                     </div>

//                     <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
//                       You currently have free access to Secondary
//                       learning, practice, and competition features.
//                     </p>

//                     <p className="mt-2 text-xs text-white/35">
//                       Your trial started from your original
//                       registration date.
//                     </p>
//                   </div>
//                 </div>

//                 {/* ==================================================
//                     COUNTDOWN
//                    ================================================== */}

//                 <div
//                   className="
//                     shrink-0
//                     rounded-3xl
//                     border
//                     border-amber-400/20
//                     bg-black/10
//                     p-4
//                     shadow-xl
//                     shadow-black/10
//                     sm:p-5
//                   "
//                 >
//                   {/* Countdown title */}

//                   <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
//                     <Clock3 className="h-4 w-4" />

//                     <span>Free Trial Ends In</span>
//                   </div>

//                   {/* ==================================================
//                       LARGE DAYS REMAINING
//                      ================================================== */}

//                   <div
//                     className="
//                       mb-4
//                       rounded-2xl
//                       border
//                       border-amber-400/20
//                       bg-amber-500/[0.08]
//                       px-5
//                       py-4
//                       text-center
//                     "
//                   >
//                     <div
//                       className="
//                         text-4xl
//                         font-black
//                         leading-none
//                         tracking-tight
//                         text-amber-100
//                         sm:text-5xl
//                       "
//                     >
//                       {countdown.days}
//                     </div>

//                     <div
//                       className="
//                         mt-2
//                         text-[11px]
//                         font-bold
//                         uppercase
//                         tracking-[0.18em]
//                         text-amber-300
//                       "
//                     >
//                       Days Remaining
//                     </div>
//                   </div>

//                   {/* ==================================================
//                       HOURS / MINUTES / SECONDS
//                      ================================================== */}

//                   <div className="flex items-center justify-center gap-1.5 sm:gap-2">
//                     {/* Hours */}

//                     <div className="min-w-[58px] rounded-xl border border-amber-400/20 bg-amber-500/[0.06] px-2.5 py-2.5 text-center sm:min-w-[64px]">
//                       <div className="text-lg font-bold text-amber-100 sm:text-xl">
//                         {String(countdown.hours).padStart(2, "0")}
//                       </div>

//                       <div className="mt-0.5 text-[9px] uppercase tracking-wider text-amber-300/60">
//                         Hours
//                       </div>
//                     </div>

//                     <span className="text-amber-400/40">:</span>

//                     {/* Minutes */}

//                     <div className="min-w-[58px] rounded-xl border border-amber-400/20 bg-amber-500/[0.06] px-2.5 py-2.5 text-center sm:min-w-[64px]">
//                       <div className="text-lg font-bold text-amber-100 sm:text-xl">
//                         {String(countdown.minutes).padStart(2, "0")}
//                       </div>

//                       <div className="mt-0.5 text-[9px] uppercase tracking-wider text-amber-300/60">
//                         Minutes
//                       </div>
//                     </div>

//                     <span className="text-amber-400/40">:</span>

//                     {/* Seconds */}

//                     <div className="min-w-[58px] rounded-xl border border-amber-400/20 bg-amber-500/[0.06] px-2.5 py-2.5 text-center sm:min-w-[64px]">
//                       <div className="text-lg font-bold text-amber-100 sm:text-xl">
//                         {String(countdown.seconds).padStart(2, "0")}
//                       </div>

//                       <div className="mt-0.5 text-[9px] uppercase tracking-wider text-amber-300/60">
//                         Seconds
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ==================================================
//                   TRIAL REMINDER
//                  ================================================== */}

//               <div
//                 className="
//                   mt-6
//                   flex
//                   items-start
//                   gap-2
//                   rounded-2xl
//                   border
//                   border-white/5
//                   bg-white/[0.02]
//                   px-4
//                   py-3
//                   text-xs
//                   text-white/40
//                 "
//               >
//                 <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-300/70" />

//                 <p>
//                   Your free Secondary access is calculated from
//                   your original registration date and does not
//                   restart when you log in.
//                 </p>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* ======================================================
//             ACCESS EXPIRED
//            ====================================================== */}

//         {isFreeTrialExpired && (
//           <section
//             className="
//               rounded-3xl
//               border
//               border-amber-400/20
//               bg-amber-500/[0.06]
//               p-5
//               backdrop-blur-sm
//             "
//           >
//             <div className="flex items-center gap-3">
//               <Clock3 className="h-5 w-5 shrink-0 text-amber-300" />

//               <div>
//                 <h2 className="font-semibold text-white">
//                   Your free access has expired
//                 </h2>

//                 <p className="mt-1 text-sm text-white/50">
//                   Choose a Secondary plan to continue using
//                   Secondary learning and practice features.
//                 </p>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* ======================================================
//             ACCESS BLOCKER
//            ====================================================== */}

//         {!hasSecondaryAccess && (
//           <div
//             className="
//               overflow-hidden
//               rounded-3xl
//               border
//               border-white/10
//               bg-white/[0.025]
//               shadow-2xl
//               shadow-black/20
//               backdrop-blur-sm
//             "
//           >
//             <AccessBlocker
//               onSecondaryClick={() => {
//                 router.push("/student/access/secondary");
//               }}
//             />
//           </div>
//         )}

//         {/* ======================================================
//             STATISTICS
//            ====================================================== */}

//         <section>
//           <div className="mb-3">
//             <h2 className="text-base font-semibold text-white">
//               Your Overview
//             </h2>

//             <p className="mt-1 text-xs text-white/45">
//               Track your competition and practice progress.
//             </p>
//           </div>

//           <div className="overflow-hidden">
//             <StatsGrid stats={stats} />
//           </div>
//         </section>

//         {/* ======================================================
//             QUICK ACTIONS
//            ====================================================== */}

//         <section>
//           <QuickActions
//             title="Quick Actions"
//             actions={actions}
//             locked={!hasSecondaryAccess}
//           />
//         </section>

//         {/* ======================================================
//             UPCOMING COMPETITIONS
//            ====================================================== */}

//         <section>
//           <UpcomingCompetitions
//             title="Upcoming Competitions"
//             competitions={competitions}
//           />
//         </section>

//         {/* ======================================================
//             DASHBOARD WIDGETS
//            ====================================================== */}

//         <div className="grid gap-6 lg:grid-cols-2">
//           {/* ====================================================
//               PERFORMANCE
//              ==================================================== */}

//           <section
//             className="
//               rounded-3xl
//               border
//               border-white/10
//               bg-white/[0.035]
//               p-6
//               shadow-2xl
//               shadow-black/20
//               backdrop-blur-sm
//               sm:p-8
//             "
//           >
//             <div className="flex items-start justify-between gap-4">
//               <div>
//                 <h2 className="text-xl font-semibold text-white">
//                   Performance Overview
//                 </h2>

//                 <p className="mt-2 text-sm leading-6 text-white/50">
//                   Track your CBT scores, ranking progress, and
//                   subject performance.
//                 </p>
//               </div>

//               <div className="hidden shrink-0 rounded-xl border border-purple-400/20 bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-300 sm:block">
//                 Coming Soon
//               </div>
//             </div>

//             <div
//               className="
//                 mt-7
//                 flex
//                 h-64
//                 items-center
//                 justify-center
//                 rounded-2xl
//                 border
//                 border-dashed
//                 border-white/10
//                 bg-black/10
//               "
//             >
//               <div className="text-center">
//                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
//                   <div className="h-2 w-2 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50" />
//                 </div>

//                 <p className="mt-4 text-sm font-medium text-white/60">
//                   Performance Chart
//                 </p>

//                 <p className="mt-1 text-xs text-white/35">
//                   Your performance data will appear here.
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* ====================================================
//               RECENT ACTIVITY
//              ==================================================== */}

//           <section
//             className="
//               rounded-3xl
//               border
//               border-white/10
//               bg-white/[0.035]
//               p-6
//               shadow-2xl
//               shadow-black/20
//               backdrop-blur-sm
//               sm:p-8
//             "
//           >
//             <div>
//               <h2 className="text-xl font-semibold text-white">
//                 Recent Activity
//               </h2>

//               <p className="mt-2 text-sm text-white/50">
//                 Your latest learning and competition activity.
//               </p>
//             </div>

//             <div className="mt-7 space-y-1">
//               {[
//                 {
//                   title: "Completed Mathematics Practice",
//                   time: "Today • 92%",
//                 },
//                 {
//                   title: "Joined August Challenge",
//                   time: "Yesterday",
//                 },
//                 {
//                   title: "Team Invitation Accepted",
//                   time: "2 days ago",
//                 },
//                 {
//                   title: "Moved to Rank #18",
//                   time: "This Week",
//                 },
//               ].map((activity, index) => (
//                 <div
//                   key={activity.title}
//                   className="
//                     group
//                     flex
//                     items-start
//                     gap-4
//                     rounded-2xl
//                     px-3
//                     py-4
//                     transition
//                     hover:bg-white/[0.035]
//                   "
//                 >
//                   {/* Timeline */}

//                   <div className="relative flex shrink-0 flex-col items-center">
//                     <div className="mt-1.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/10" />

//                     {index < 3 && (
//                       <div className="absolute top-5 h-10 w-px bg-white/10" />
//                     )}
//                   </div>

//                   {/* Activity */}

//                   <div className="min-w-0">
//                     <p className="font-medium text-white/85 group-hover:text-white">
//                       {activity.title}
//                     </p>

//                     <p className="mt-1 text-sm text-white/40">
//                       {activity.time}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>
//     </main>
//   );
// }







"use client";

import type { QuickAction } from "@/components/dashboard/widgets/QuickActions";
import type { StatCardProps } from "@/components/dashboard/widgets/StatCard";

import {
  QuickActions,
  StatsGrid,
  UpcomingCompetitions,
} from "@/components/dashboard/widgets";

import AccessBlocker from "@/components/access/AccessBlocker";
import FreeTrialCard from "@/components/access/FreeTrialCard";

import { useAuthStore } from "@/stores";
import { useRouter } from "next/navigation";

export default function StudentDashboardPage() {
  /* ============================================================
     AUTH
     ============================================================ */

  const { user } = useAuthStore();

  const router = useRouter();

  /* ============================================================
     PLAN / ACCESS
     ============================================================ */

  const hasSecondaryPlan =
    Array.isArray(user?.plans) &&
    user.plans.includes("SECONDARY");

  /*
   * FreeTrialCard handles the 30-day trial countdown.
   *
   * The dashboard only needs to know whether the student
   * has a paid SECONDARY plan.
   *
   * A student without the plan can access Secondary features
   * while the FreeTrialCard's 30-day trial is active.
   *
   * Since the trial status itself is calculated inside the
   * reusable FreeTrialCard, the dashboard does not duplicate
   * that countdown logic here.
   */

  /* ============================================================
     STATISTICS
     ============================================================ */

  const stats: StatCardProps[] = [
    {
      title: "Competitions",
      value: 12,
      icon: "trophy",
      change: 15,
      changeLabel: "from last month",
    },
    {
      title: "Current Rank",
      value: "#18",
      icon: "medal",
    },
    {
      title: "Practice Tests",
      value: 147,
      icon: "book",
    },
    {
      title: "Team Members",
      value: 3,
      icon: "users",
    },
  ];

  /* ============================================================
     QUICK ACTIONS
     ============================================================ */

  const actions: QuickAction[] = [
    {
      title: "CBT Wallet",
      description: "Manage your CBT points",
      href: "/student/practice/cbt-wallet",
      icon: "wallet",
    },

    {
      title: "Solve & Win Questions",
      description: "Earn While You Learn",
      href: "/student/solve-and-win",
      icon: "trophy",
    },

    {
      title: "Learning Arena",
      description: "Learn through guided lessons",
      href: "/student/arena",
      icon: "play",
    },

    {
      title: "Past Questions Mode",
      description: "Practice Past Questions",
      href: "/student/practice",
      icon: "book",
    },
  ];

  /* ============================================================
     COMPETITIONS
     ============================================================ */

  const competitions = [
    {
      id: "1",
      title: "JAMB League August Challenge",
      date: "15 August 2026",
      time: "10:00 AM",
      teams: 128,
      status: "Registration Open" as const,
      href: "/student/competitions/1",
    },

    {
      id: "2",
      title: "Science Quiz Championship",
      date: "28 August 2026",
      time: "09:00 AM",
      teams: 82,
      status: "Upcoming" as const,
      href: "/student/competitions/2",
    },
  ];

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ========================================================
          BACKGROUND ATMOSPHERE
         ======================================================== */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.1),rgba(2,6,23,0.7))]" />
      </div>

      {/* ========================================================
          CONTENT
         ======================================================== */}

      <div className="relative space-y-8">
        {/* ======================================================
            WELCOME
           ====================================================== */}

        <section
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/[0.035]
            p-6
            shadow-2xl
            shadow-black/20
            backdrop-blur-sm
            sm:p-8
          "
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
              Student Dashboard
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Welcome back 👋
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Continue your preparation, practice consistently,
              and climb the national leaderboard.
            </p>
          </div>
        </section>

        {/* ======================================================
            FREE TRIAL
           ====================================================== */}

        {!hasSecondaryPlan && (
          <FreeTrialCard
            createdAt={user?.createdAt}
          />
        )}

        {/* ======================================================
            ACCESS BLOCKER
           ====================================================== */}

        {!hasSecondaryPlan && (
          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.025]
              shadow-2xl
              shadow-black/20
              backdrop-blur-sm
            "
          >
            <AccessBlocker
              onSecondaryClick={() => {
                router.push("/student/access/secondary");
              }}
            />
          </div>
        )}

        {/* ======================================================
            STATISTICS
           ====================================================== */}

        <section>
          <div className="mb-3">
            <h2 className="text-base font-semibold text-white">
              Your Overview
            </h2>

            <p className="mt-1 text-xs text-white/45">
              Track your competition and practice progress.
            </p>
          </div>

          <div className="overflow-hidden">
            <StatsGrid stats={stats} />
          </div>
        </section>

        {/* ======================================================
            QUICK ACTIONS
           ====================================================== */}

        <section>
          <QuickActions
            title="Quick Actions"
            actions={actions}
            locked={!hasSecondaryPlan}
          />
        </section>

        {/* ======================================================
            UPCOMING COMPETITIONS
           ====================================================== */}

        <section>
          <UpcomingCompetitions
            title="Upcoming Competitions"
            competitions={competitions}
          />
        </section>

        {/* ======================================================
            DASHBOARD WIDGETS
           ====================================================== */}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ====================================================
              PERFORMANCE
             ==================================================== */}

          <section
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.035]
              p-6
              shadow-2xl
              shadow-black/20
              backdrop-blur-sm
              sm:p-8
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Performance Overview
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  Track your CBT scores, ranking progress, and
                  subject performance.
                </p>
              </div>

              <div className="hidden shrink-0 rounded-xl border border-purple-400/20 bg-purple-500/10 px-3 py-2 text-xs font-medium text-purple-300 sm:block">
                Coming Soon
              </div>
            </div>

            <div
              className="
                mt-7
                flex
                h-64
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-white/10
                bg-black/10
              "
            >
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <div className="h-2 w-2 rounded-full bg-blue-400 shadow-lg shadow-blue-500/50" />
                </div>

                <p className="mt-4 text-sm font-medium text-white/60">
                  Performance Chart
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Your performance data will appear here.
                </p>
              </div>
            </div>
          </section>

          {/* ====================================================
              RECENT ACTIVITY
             ==================================================== */}

          <section
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.035]
              p-6
              shadow-2xl
              shadow-black/20
              backdrop-blur-sm
              sm:p-8
            "
          >
            <div>
              <h2 className="text-xl font-semibold text-white">
                Recent Activity
              </h2>

              <p className="mt-2 text-sm text-white/50">
                Your latest learning and competition activity.
              </p>
            </div>

            <div className="mt-7 space-y-1">
              {[
                {
                  title: "Completed Mathematics Practice",
                  time: "Today • 92%",
                },
                {
                  title: "Joined August Challenge",
                  time: "Yesterday",
                },
                {
                  title: "Team Invitation Accepted",
                  time: "2 days ago",
                },
                {
                  title: "Moved to Rank #18",
                  time: "This Week",
                },
              ].map((activity, index) => (
                <div
                  key={activity.title}
                  className="
                    group
                    flex
                    items-start
                    gap-4
                    rounded-2xl
                    px-3
                    py-4
                    transition
                    hover:bg-white/[0.035]
                  "
                >
                  {/* Timeline */}

                  <div className="relative flex shrink-0 flex-col items-center">
                    <div className="mt-1.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/10" />

                    {index < 3 && (
                      <div className="absolute top-5 h-10 w-px bg-white/10" />
                    )}
                  </div>

                  {/* Activity */}

                  <div className="min-w-0">
                    <p className="font-medium text-white/85 group-hover:text-white">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}