



import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Trophy,
  Users,
  UserRound,
  FileQuestion,
  ClipboardList,
  CreditCard,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  exact?: boolean;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const adminNavigation: AdminNavSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },

  {
    title: "Competition",
    items: [
      {
        label: "Competitions",
        href: "/admin/competitions",
        icon: Trophy,
      },
      {
        label: "Questions",
        href: "/admin/questions",
        icon: FileQuestion,
      },
      {
        label: "Results",
        href: "/admin/results",
        icon: ClipboardList,
      },
    ],
  },

  {
    title: "Users",
    items: [
      {
        label: "Students",
        href: "/admin/students",
        icon: Users,
      },
      {
        label: "Teams",
        href: "/admin/teams",
        icon: UserRound,
      },
    ],
  },

  {
    title: "Finance",
    items: [
      {
        label: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
      },
    ],
  },

  {
    title: "Analytics",
    items: [
      {
        label: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
        disabled: true, // Coming soon
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        label: "Announcements",
        href: "/admin/announcements",
        icon: Bell,
        disabled: true,
      },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];