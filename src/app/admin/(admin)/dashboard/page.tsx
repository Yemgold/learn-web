







"use client";

import { useState } from "react";

import {
  PerformanceChart,
  QuickActions,
  RecentActivity,
  StatsGrid,
  UpcomingCompetitions,
} from "@/components/dashboard/widgets";

import type { StatCardProps } from "@/components/dashboard/widgets/StatCard";
import type { QuickAction } from "@/components/dashboard/widgets/QuickActions";

/* ============================================================
   PLAN TYPES
============================================================ */

type Plan = "secondary" | "tertiary" | "professional";

/* ============================================================
   PAGE
============================================================ */

export default function AdminDashboardPage() {
  /* ==========================================================
     COLLAPSIBLE PLAN STATE

     Only one plan can be open at a time.
  ========================================================== */

  const [openPlan, setOpenPlan] = useState<Plan | null>(null);

  const togglePlan = (plan: Plan) => {
    setOpenPlan((current) =>
      current === plan ? null : plan,
    );
  };

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const stats: StatCardProps[] = [
    {
      title: "Registered Students",
      value: "12,846",
      icon: "users",
      change: 18,
      changeLabel: "since last month",
    },
    {
      title: "Competitions",
      value: 24,
      icon: "trophy",
      change: 3,
      changeLabel: "currently active",
    },
    {
      title: "Question Bank",
      value: "5,280",
      icon: "book",
    },
    {
      title: "Revenue",
      value: "₦8.6M",
      icon: "payment",
      change: 12,
      changeLabel: "this month",
    },
  ];

  /* ==========================================================
     QUICK ACTIONS
  ========================================================== */

  const quickActions: QuickAction[] = [
    {
      title: "CBT Practice",
      description: "Manage CBT Questions",
      href: "/admin/cbt/practice",
      icon: "book",
    },

    {
      title: "Direct Practice",
      description: "Manage Direct Questions",
      href: "/admin/practice",
      icon: "book",
    },

    {
      title: "Interactive Lessons",
      description: "Manage Interactive Lessons",
      href: "/admin/practice",
      icon: "book",
    },

    {
      title: "Lecture Videos",
      description: "Manage Lectures on Videos",
      href: "/admin/practice",
      icon: "book",
    },
  ];

  /* ==========================================================
     COMPETITIONS
  ========================================================== */

  const competitions = [
    {
      id: "1",
      title: "JAMB League 2027 Qualifiers",
      date: "20 January 2027",
      time: "09:00 AM",
      teams: 640,
      status: "Registration Open" as const,
      href: "/admin/competitions/1",
    },

    {
      id: "2",
      title: "Science Masters Challenge",
      date: "5 February 2027",
      time: "10:00 AM",
      teams: 420,
      status: "Upcoming" as const,
      href: "/admin/competitions/2",
    },
  ];

  /* ==========================================================
     PERFORMANCE
  ========================================================== */

  const performanceData = [
    { name: "Jan", score: 1200 },
    { name: "Feb", score: 1800 },
    { name: "Mar", score: 2400 },
    { name: "Apr", score: 3100 },
    { name: "May", score: 3900 },
    { name: "Jun", score: 4700 },
  ];

  /* ==========================================================
     RECENT ACTIVITIES
  ========================================================== */

  const recentActivities = [
    {
      id: "1",
      title: "New competition created",
      description: "JAMB League 2027 Qualifiers was published.",
      time: "15 minutes ago",
      type: "competition" as const,
    },

    {
      id: "2",
      title: "245 students registered",
      description: "New student registrations today.",
      time: "1 hour ago",
      type: "success" as const,
    },

    {
      id: "3",
      title: "Question bank updated",
      description: "120 new Mathematics questions added.",
      time: "Today",
      type: "practice" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ======================================================
          WELCOME
      ====================================================== */}

      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Monitor competitions, registrations, payments and platform
          performance from one place.
        </p>
      </section>

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <StatsGrid stats={stats} />

      {/* ======================================================
          PLAN ADMINISTRATOR ACTIONS
      ====================================================== */}

      <section className="space-y-3">
        {/* ====================================================
            SECONDARY
        ==================================================== */}

        <PlanAccordion
          title="Secondary Plan Administrator Actions"
          plan="secondary"
          isOpen={openPlan === "secondary"}
          onToggle={() => togglePlan("secondary")}
          actions={quickActions}
        />

        {/* ====================================================
            TERTIARY
        ==================================================== */}

        <PlanAccordion
          title="Tertiary Plan Administrator Actions"
          plan="tertiary"
          isOpen={openPlan === "tertiary"}
          onToggle={() => togglePlan("tertiary")}
          actions={quickActions}
        />

        {/* ====================================================
            PROFESSIONAL
        ==================================================== */}

        <PlanAccordion
          title="Professional Plan Administrator Actions"
          plan="professional"
          isOpen={openPlan === "professional"}
          onToggle={() => togglePlan("professional")}
          actions={quickActions}
        />
      </section>

      {/* ======================================================
          CHARTS + ACTIVITY
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-3">
        <PerformanceChart
          className="xl:col-span-2"
          title="Monthly Registrations"
          subtitle="Student registrations over the last six months."
          data={performanceData}
        />

        <RecentActivity activities={recentActivities} />
      </div>

      {/* ======================================================
          UPCOMING COMPETITIONS
      ====================================================== */}

      <UpcomingCompetitions
        title="Upcoming Competitions"
        competitions={competitions}
      />
    </div>
  );
}

/* ============================================================
   PLAN ACCORDION
============================================================ */

interface PlanAccordionProps {
  title: string;
  plan: Plan;
  isOpen: boolean;
  onToggle: () => void;
  actions: QuickAction[];
}

function PlanAccordion({
  title,
  plan,
  isOpen,
  onToggle,
  actions,
}: PlanAccordionProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 ${
        isOpen
          ? "border-blue-200"
          : "border-slate-200"
      }`}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`${plan}-plan-actions`}
        className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition md:px-6 ${
          isOpen
            ? "bg-blue-50"
            : "bg-white hover:bg-slate-50"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Indicator */}

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition ${
              isOpen
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isOpen ? "−" : "+"}
          </div>

          <div className="min-w-0">
            <h2
              className={`font-semibold transition ${
                isOpen
                  ? "text-blue-900"
                  : "text-slate-900"
              }`}
            >
              {title}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {isOpen
                ? "Administrator actions are visible"
                : "Click to view administrator actions"}
            </p>
          </div>
        </div>

        {/* Chevron */}

        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div
        id={`${plan}-plan-actions`}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-slate-200 p-4 md:p-6">
            <QuickActions
              title=""
              actions={actions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

