




import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Medal,
  Settings,
  Trophy,
  User,
  Play,
  Video,
  Wallet,
  Users,
} from "lucide-react";

import type { NavigationSection } from "./types";

export const studentNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/student/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },

      {
  label: "Referrals",
  href: "/student/referrals",
  icon: Users,
},

{
  label: "Wallet",
  href: "/student/wallet",
  icon: Wallet,
}


    ],
  },

  {
    title: "Competition",
    items: [
      {
        label: "Competitions",
        href: "/student/competitions",
        icon: Trophy,
      },
      {
        label: "Leaderboard",
        href: "/student/competitions/leaderboard",
        icon: Medal,
      },
      {
        label: "Competition Calendar",
        href: "/student/competitions/calendar",
        icon: CalendarDays,
        disabled: true,
      },
    ],
  },

  {
  title: "Learning CBT",
  items: [
    {
      label: "Practice CBT",
      description: "Simulate the real JAMB exams",
      href: "/student/practice",
      icon: BookOpen,
    },
  ],
},






  {
  title: "Learning Arena",
  items: [
    {
      label: "Interactive Lessons",
      description: "Learn through guided lessons",
      href: "/student/arena",
      icon: Play,
    },
  ],
},

{
  title: "Earn While You Learn",
  items: [
    {
      label: "Solve & Win",
      description: "Answer questions, earn rewards, and compete for prizes",
      href: "/student/solve-and-win",
      icon: Trophy,
    },
  ],
},

{
  title: "Learn by Watching",
  items: [
    {
      label: "Question Videos",
      description: "Watch questions, answers and step-by-step explanations",
      href: "/student/question-videos",
      icon: Video,
    },
  ],
},

  {
    title: "Team",
    items: [
      {
        label: "My Team",
        href: "/student/team",
        icon: Users,
      },
    ],
  },

  {
    title: "Account",
    items: [
      {
        label: "Profile",
        href: "/student/profile",
        icon: User,
      },
      {
        label: "Settings",
        href: "/student/settings",
        icon: Settings,
      },
    ],
  },
];