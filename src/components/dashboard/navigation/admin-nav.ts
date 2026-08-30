



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
  title: "Competition — Secondary Plan",
  items: [
    {
      label: "Solve & Win Competitions",
      href: "/admin/secondary/solveandwin",
      icon: Trophy,
    },
    {
      label: "National Competitions",
      href: "/admin/secondary/nationalcompetitions",
      icon: Trophy,
    },
  ],
},

{
  title: "Competition — Tertiary Plan",
  items: [
    {
      label: "Solve & Win Competitions",
      href: "/admin/tertiary/solveandwin",
      icon: Trophy,
    },
    {
      label: "National Competitions",
      href: "/admin/tertiary/nationalcompetitions",
      icon: Trophy,
    },
  ],
},

{
  title: "Competition — Professional Plan",
  items: [
    {
      label: "Solve & Win Competitions",
      href: "/admin/professional/solveandwin",
      icon: Trophy,
    },
    {
      label: "National Competitions",
      href: "/admin/professional/nationalcompetitions",
      icon: Trophy,
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