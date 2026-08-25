




import {
  PerformanceChart,
  QuickActions,
  RecentActivity,
  StatsGrid,
  UpcomingCompetitions,
} from "@/components/dashboard/widgets";

import type { StatCardProps } from "@/components/dashboard/widgets/StatCard";
import type { QuickAction } from "@/components/dashboard/widgets/QuickActions";

export default function AdminDashboardPage() {
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

  const quickActions: QuickAction[] = [
    {
      title: "Create Competition",
      description: "Launch a new competition",
      href: "/admin/competitions",
      icon: "trophy",
    },
    {
      title: "Manage Students",
      description: "View registered students",
      href: "/admin/students",
      icon: "users",
    },
    {
      title: "Question Bank",
      description: "Manage CBT questions",
      href: "/admin/questions",
      icon: "book",
    },
    {
      title: "Payments",
      description: "Review transactions",
      href: "/admin/payments",
      icon: "payment",
    },
  ];

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

  const performanceData = [
    { name: "Jan", score: 1200 },
    { name: "Feb", score: 1800 },
    { name: "Mar", score: 2400 },
    { name: "Apr", score: 3100 },
    { name: "May", score: 3900 },
    { name: "Jun", score: 4700 },
  ];

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
      {/* Welcome */}
      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Monitor competitions, registrations, payments and platform
          performance from one place.
        </p>
      </section>

      {/* Statistics */}
      <StatsGrid stats={stats} />

      {/* Quick Actions */}
      <QuickActions
        title="Administrator Actions"
        actions={quickActions}
      />

      {/* Charts + Activity */}
      <div className="grid gap-6 xl:grid-cols-3">
        <PerformanceChart
          className="xl:col-span-2"
          title="Monthly Registrations"
          subtitle="Student registrations over the last six months."
          data={performanceData}
        />

        <RecentActivity
          activities={recentActivities}
        />
      </div>

      {/* Upcoming Competitions */}
      <UpcomingCompetitions
        title="Upcoming Competitions"
        competitions={competitions}
      />
    </div>
  );
}