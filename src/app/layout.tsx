
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
  metadataBase: new URL("https://jambleague.com"),

  title: {
    default: "JAMB League",
    template: "%s | JAMB League",
  },

  description:
    "JAMB League is Nigeria's premier team-based UTME competition platform. Form a team of three, compete nationwide, practice CBT questions, climb the leaderboard, and win exciting prizes.",

  keywords: [
    "JAMB",
    "UTME",
    "CBT",
    "JAMB League",
    "Nigeria",
    "Examination",
    "Students",
    "Practice Test",
    "Competition",
    "Education",
  ],

  authors: [
    {
      name: "JAMB League",
    },
  ],

  creator: "JAMB League",

  publisher: "JAMB League",

  openGraph: {
    title: "JAMB League",

    description:
      "Compete with students across Nigeria in the ultimate UTME challenge.",

    type: "website",

    locale: "en_NG",

    siteName: "JAMB League",
  },

  twitter: {
    card: "summary_large_image",

    title: "JAMB League",

    description:
      "Nigeria's largest team-based JAMB competition.",
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