


// C:\Users\Lara Spellman\Jamb\jamb-league\src\app\layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import AppProviders from "@/providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "JAMB League | Learn, Practice & Compete",
    template: "%s | JAMB League",
  },

  description:
    "JAMB League is a learning platform where students and learners can take courses, learn new skills, practice with interactive questions, prepare for exams, take quizzes, and compete with other learners.",

  keywords: [
    "JAMB League",
    "learning platform",
    "online learning",
    "online courses",
    "learning platform Nigeria",
    "education platform",
    "online education",
    "study platform",
    "practice questions",
    "online quizzes",
    "CBT practice",
    "JAMB preparation",
    "WAEC preparation",
    "exam preparation",
    "programming courses",
    "learn programming",
    "Go programming",
    "student learning",
    "online study",
  ],

  authors: [
    {
      name: "JAMB League",
    },
  ],

  creator: "JAMB League",

  publisher: "JAMB League",

  openGraph: {
    title: "JAMB League | Learn, Practice & Compete",

    description:
      "Learn new skills, study for exams, practice with interactive questions, take courses, and compete with other learners.",

    type: "website",

    locale: "en_NG",

    siteName: "Learning Platform",
  },

  twitter: {
    card: "summary_large_image",

    title: "JAMB League | Learn, Practice & Compete",

    description:
      "Learn, practice, build skills, prepare for exams, and compete with other learners.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-white text-slate-900 antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}