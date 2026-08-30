




"use client";

import type { QuickAction } from "@/components/dashboard/widgets/QuickActions";
import type { StatCardProps } from "@/components/dashboard/widgets/StatCard";

import {
  QuickActions,
  StatsGrid,
  UpcomingCompetitions,
} from "@/components/dashboard/widgets";

import AccessBlocker from "@/components/access/AccessBlocker";

import { useAuthStore } from "@/stores";

import { useRouter } from "next/navigation";

export default function StudentDashboardPage() {
  /* ============================================================
     AUTH
     ============================================================ */

  const { user } = useAuthStore();

  const router = useRouter();

  /*
   * Current backend login response:
   *
   * hasPaid: false
   * plans: []
   *
   * Therefore the AccessBlocker is displayed.
   *
   * Once the backend confirms an active plan,
   * the blocker disappears.
   */

 const hasSecondaryPlan =
  Array.isArray(user?.plans) &&
  user.plans.includes("SECONDARY");

  type SecondaryExam = "jamb" | "waec" | "neco";

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
      title: "Join Competition",
      description: "Browse available competitions",
      href: "/student/competitions",
      icon: "trophy",
    },

     {
      title: "Solve & Win Questions",
      description: " Earn While You Learn",
      href: "/student/solve-and-win",
       icon: "trophy",
    },

    {
      title: "Learning Arena",
      description: "Learn through interactive lessons",
      href: "/student/arena",
      icon: "play",
    },

    {
      title: "Past Quetions Mood",
      description: "Practice Past Quetions",
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
    <main className="space-y-8">
      {/* ======================================================
          WELCOME
         ====================================================== */}

      <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <h1 className="text-3xl font-bold">
          Welcome back 👋
        </h1>

        <p className="mt-2 max-w-2xl text-blue-100">
          Continue your preparation, practice consistently, and
          climb the national leaderboard.
        </p>
      </section>


{/* ======================================================
    ACCESS BLOCKER
   ====================================================== */}

{!hasSecondaryPlan && (
  <AccessBlocker
    onSecondaryClick={() => {
      router.push("/student/access/secondary");
    }}
  />
)}

      {/* ======================================================
          STATISTICS
         ====================================================== */}

      <StatsGrid stats={stats} />

      {/* ======================================================
          QUICK ACTIONS
         ====================================================== */}

      <QuickActions
  title="Quick Actions"
  actions={actions}
  locked={!hasSecondaryPlan}
/>

      {/* ======================================================
          UPCOMING COMPETITIONS
         ====================================================== */}

      <UpcomingCompetitions
        title="Upcoming Competitions"
        competitions={competitions}
      />

      {/* ======================================================
          DASHBOARD WIDGETS
         ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ====================================================
            PERFORMANCE
           ==================================================== */}

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Performance Overview
          </h2>

          <p className="mt-3 text-slate-600">
            Your CBT scores, ranking progress, and subject
            performance charts will appear here after completing
            practice sessions and competitions.
          </p>

          <div className="mt-8 flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <span className="text-slate-400">
              Performance Chart Placeholder
            </span>
          </div>
        </div>

        {/* ====================================================
            RECENT ACTIVITY
           ==================================================== */}

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Recent Activity
          </h2>

          <div className="mt-6 space-y-5">
            {[
              {
                title:
                  "Completed Mathematics Practice",
                time: "Today • 92%",
              },
              {
                title: "Joined August Challenge",
                time: "Yesterday",
              },
              {
                title:
                  "Team Invitation Accepted",
                time: "2 days ago",
              },
              {
                title: "Moved to Rank #18",
                time: "This Week",
              },
            ].map((activity) => (
              <div
                key={activity.title}
                className="flex items-start gap-4"
              >
                <div className="mt-2 h-3 w-3 rounded-full bg-blue-600" />

                <div>
                  <p className="font-medium text-slate-900">
                    {activity.title}
                  </p>

                  <p className="text-sm text-slate-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
