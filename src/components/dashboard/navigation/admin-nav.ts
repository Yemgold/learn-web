



import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Trophy,
  Video,
  Book,
  Users,
  UserRound,
  BookOpen,
  FileQuestion,
  Building2,
  GraduationCap,
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
  title: "Create Schools",
  items: [
    {
      label: "Manage Schools",
      href: "/admin/schools",
      icon: Book,
      exact: true,
    },
  ],
},

{
  title: "Creative Studio",
  items: [
    {
      label: "Video Studio",
      href: "/admin/studio",
      icon: Video,
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
      label: "Quiz-Competitions",
      href: "/admin/secondary/quiz-board",
      icon: Trophy,
    },

    {
      label: "National Competitions",
      href: "/admin/secondary/nationalcompetitions",
      icon: Trophy,
    },
    
{
  label: "Video Lectures",
  href: "/admin/secondary/create/video-ai-lecture",
  icon: Video,
},

{
  label: "Manage Books",
  href: "/admin/books",
  icon: Book,
},

  ],
},

{
  title: "School & Study Centres",
  items: [
    {
      label: "Overview",
      href: "/admin/school-centres",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Institutions",
      href: "/admin/school-centres/institutions",
      icon: Building2,
    },
    {
      label: "Students",
      href: "/admin/school-centres/students",
      icon: Users,
    },
    {
      label: "Questions",
      href: "/admin/school-centres/questions",
      icon: BookOpen,
    },
    {
      label: "Classes",
      href: "/admin/school-centres/classes",
      icon: GraduationCap,
    },
    {
      label: "Assignments",
      href: "/admin/school-centres/assignments",
      icon: ClipboardList,
    },
    {
      label: "Results",
      href: "/admin/school-centres/results",
      icon: BarChart3,
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