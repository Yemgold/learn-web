




import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import AppProviders from "@/providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/* =========================================================
   WEBSITE BRANDING & SEO
========================================================= */

const siteName = "Learnyfi Educational Platform";

const siteDescription =
  "Learn new skills, practise with interactive questions, prepare for exams, take courses, and compete with other learners on Learnyfi Educational Platform.";

const siteUrl = "https://learn-web-pink.vercel.app";

/**
 * Place your logo image at:
 * public/images/learnyfi-logo.png
 *
 * The public directory is served from the website root.
 */
const logoUrl = "/images/learnyfi-logo.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: siteName,

  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },

  description: siteDescription,

  keywords: [
    "Learnyfi",
    "Learnyfi Educational Platform",
    "learning platform",
    "online learning",
    "online courses",
    "education platform Nigeria",
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
      name: siteName,
    },
  ],

  creator: siteName,

  publisher: siteName,

  /* =======================================================
     BROWSER TAB ICON & DEVICE ICON
  ======================================================= */

  icons: {
    icon: [
      {
        url: logoUrl,
        type: "image/png",
      },
    ],
    shortcut: logoUrl,
    apple: logoUrl,
  },

  /* =======================================================
     OPEN GRAPH — WHATSAPP, FACEBOOK & OTHER LINK PREVIEWS
  ======================================================= */

  openGraph: {
    title: siteName,

    description: siteDescription,

    url: siteUrl,

    siteName,

    type: "website",

    locale: "en_NG",

    images: [
      {
        url: logoUrl,
        alt: `${siteName} logo`,
      },
    ],
  },

  /* =======================================================
     TWITTER / X LINK PREVIEW
  ======================================================= */

  twitter: {
    card: "summary",

    title: siteName,

    description: siteDescription,

    images: [
      {
        url: logoUrl,
        alt: `${siteName} logo`,
      },
    ],
  },

  /* =======================================================
     SEARCH ENGINE INDEXING
  ======================================================= */

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/* =========================================================
   ROOT LAYOUT
========================================================= */

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

















// // C:\Users\Lara Spellman\Jamb\jamb-league\src\app\layout.tsx

// import type { Metadata } from "next";
// import { Inter } from "next/font/google";

// import "./globals.css";

// import AppProviders from "@/providers/AppProviders";

// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-inter",
// });

// export const metadata: Metadata = {
//   title: {
//     default: "JAMB League | Learn, Practice & Compete",
//     template: "%s | JAMB League",
//   },

//   description:
//     "JAMB League is a learning platform where students and learners can take courses, learn new skills, practice with interactive questions, prepare for exams, take quizzes, and compete with other learners.",

//   keywords: [
//     "JAMB League",
//     "learning platform",
//     "online learning",
//     "online courses",
//     "learning platform Nigeria",
//     "education platform",
//     "online education",
//     "study platform",
//     "practice questions",
//     "online quizzes",
//     "CBT practice",
//     "JAMB preparation",
//     "WAEC preparation",
//     "exam preparation",
//     "programming courses",
//     "learn programming",
//     "Go programming",
//     "student learning",
//     "online study",
//   ],

//   authors: [
//     {
//       name: "JAMB League",
//     },
//   ],

//   creator: "JAMB League",

//   publisher: "JAMB League",

//   openGraph: {
//     title: "JAMB League | Learn, Practice & Compete",

//     description:
//       "Learn new skills, study for exams, practice with interactive questions, take courses, and compete with other learners.",

//     type: "website",

//     locale: "en_NG",

//     siteName: "Learning Platform",
//   },

//   twitter: {
//     card: "summary_large_image",

//     title: "JAMB League | Learn, Practice & Compete",

//     description:
//       "Learn, practice, build skills, prepare for exams, and compete with other learners.",
//   },

//   robots: {
//     index: true,
//     follow: true,
//   },
// };

// interface RootLayoutProps {
//   children: React.ReactNode;
// }

// export default function RootLayout({
//   children,
// }: RootLayoutProps) {
//   return (
//     <html lang="en">
//       <body
//         className={`${inter.variable} font-sans bg-white text-slate-900 antialiased`}
//       >
//         <AppProviders>{children}</AppProviders>
//       </body>
//     </html>
//   );
// }