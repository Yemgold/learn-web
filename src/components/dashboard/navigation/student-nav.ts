import {
  BookOpen,
  LayoutDashboard,
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
      },
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
    ],
  },

  {
    title: "Past Questions",
    items: [
      {
        label: "Practice Questions",
        description: "Simulate the real JAMB exams",
        href: "/student/practice",
        icon: BookOpen,
      },
    ],
  },

    {
    title: "Quiz Platform",
    items: [
      {
        label: "Quiz Board",
        description: "Answer fast and Qualify",
        href: "/student/quiz-board",
        icon: Play,
      },
    ],
  },

{
  title: "Learn & Win",
  items: [
    {
      label: "Solve & Win Cash",
      description:
        "Answer CBT questions, win Cash and keep climbing the reward ladder",
      href: "/student/solve-and-win-cash",
      icon: Trophy,
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






 // {
  //   title: "Earn While You Learn",
  //   items: [
  //     {
  //       label: "Solve & Win Cash",
  //       description:
  //         "Answer questions, earn rewards, and compete for prizes",
  //       href: "/student/solve-and-win",
  //       icon: Trophy,
  //     },
  //   ],
  // },


  //  {
//   title: "Learn with Flashcards",
//   items: [
//     {
//       label: "Flashcards",
//       description:
//         "Study topics with quick questions, answers and key explanations",
//       href: "/student/flashcards",
//       icon: BookOpen,
//     },
//   ],
// },