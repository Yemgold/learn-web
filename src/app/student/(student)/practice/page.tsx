





"use client";

import Link from "next/link";
import {
  Brain,
  ArrowRight,
  GraduationCap,
  FileText,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

import { Card } from "@/components/ui/card";

/* ============================================================
   TYPES
   ============================================================ */

type ExamType = "jamb" | "waec" | "neco";

interface ExamConfig {
  id: ExamType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  lightColor: string;
  href: string;
}

/* ============================================================
   EXAM CONFIGURATION
   ============================================================ */

const EXAMS: ExamConfig[] = [
  {
    id: "jamb",
    name: "JAMB",
    description:
      "Practice JAMB past questions, CBT examinations, and track your performance.",
    icon: Brain,
    color: "text-blue-400",
    lightColor: "bg-blue-500/10",
    href: "/student/practice/jamb",
  },

  {
    id: "waec",
    name: "WAEC",
    description:
      "Practice WAEC past questions, examinations, and monitor your academic progress.",
    icon: FileText,
    color: "text-green-400",
    lightColor: "bg-green-500/10",
    href: "/student/practice/waec",
  },

  {
    id: "neco",
    name: "NECO",
    description:
      "Practice NECO past questions, examinations, and improve your examination performance.",
    icon: ClipboardCheck,
    color: "text-purple-400",
    lightColor: "bg-purple-500/10",
    href: "/student/practice/neco",
  },
];

/* ============================================================
   PRACTICE EXAMINATION SELECTION PAGE
   ============================================================ */

export default function PracticePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ==================================================
          BACKGROUND IDENTITY
         ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-10">
        {/* ==================================================
            HEADER
           ================================================== */}

        <div className="mb-10 text-center">
          {/* Icon */}

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <GraduationCap className="h-8 w-8 text-blue-400" />
          </div>

          {/* Label */}

          <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-300">
            Student Practice
          </span>

          {/* Heading */}

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
            Choose Your Examination Type
          </h1>

          {/* Description */}

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-slate-400">
            Select the examination you want to practise. Your practice
            dashboard will be customized for the examination you choose.
          </p>
        </div>

        {/* ==================================================
            EXAMINATION CARDS
           ================================================== */}

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {EXAMS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className="group text-left"
              >
                <Card
                  hoverable
                  className="relative h-full overflow-hidden border border-white/10 bg-white/[0.04] p-7 shadow-none transition-all duration-200 group-hover:-translate-y-1 group-hover:border-blue-500/30 group-hover:bg-white/[0.06]"
                >
                  {/* ==================================================
                      SELECTED / ARROW INDICATOR
                     ================================================== */}

                  <div className="absolute right-5 top-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  </div>

                  {/* ==================================================
                      ICON
                     ================================================== */}

                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 ${item.lightColor}`}
                  >
                    <Icon className={`h-8 w-8 ${item.color}`} />
                  </div>

                  {/* ==================================================
                      NAME
                     ================================================== */}

                  <h2 className="mt-6 text-2xl font-bold text-white">
                    {item.name}
                  </h2>

                  {/* ==================================================
                      DESCRIPTION
                     ================================================== */}

                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>

                  {/* ==================================================
                      ACTION
                     ================================================== */}

                  <div className="mt-7 flex items-center gap-2 text-sm font-bold text-blue-400 transition-colors group-hover:text-blue-300">
                    Start {item.name} Practice

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>

                  {/* ==================================================
                      SUBTLE HOVER ACCENT
                     ================================================== */}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}














// "use client";

// import Link from "next/link";
// import {
//   Brain,
//   ArrowRight,
//   GraduationCap,
//   FileText,
//   ClipboardCheck,
//   CheckCircle2,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";

// /* ============================================================
//    TYPES
//    ============================================================ */

// type ExamType = "jamb" | "waec" | "neco";

// interface ExamConfig {
//   id: ExamType;
//   name: string;
//   description: string;
//   icon: React.ElementType;
//   color: string;
//   lightColor: string;
//   href: string;
// }

// /* ============================================================
//    EXAM CONFIGURATION
//    ============================================================ */

// const EXAMS: ExamConfig[] = [
//   {
//     id: "jamb",
//     name: "JAMB",
//     description:
//       "Practice JAMB past questions, CBT examinations, and track your performance.",
//     icon: Brain,
//     color: "text-blue-600",
//     lightColor: "bg-blue-50",
//     href: "/student/practice/jamb",
//   },

//   {
//     id: "waec",
//     name: "WAEC",
//     description:
//       "Practice WAEC past questions, examinations, and monitor your academic progress.",
//     icon: FileText,
//     color: "text-green-600",
//     lightColor: "bg-green-50",
//     href: "/student/practice/waec",
//   },

//   {
//     id: "neco",
//     name: "NECO",
//     description:
//       "Practice NECO past questions, examinations, and improve your examination performance.",
//     icon: ClipboardCheck,
//     color: "text-purple-600",
//     lightColor: "bg-purple-50",
//     href: "/student/practice/neco",
//   },
// ];

// /* ============================================================
//    PRACTICE EXAMINATION SELECTION PAGE
//    ============================================================ */

// export default function PracticePage() {
//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto px-4 py-10">
//         {/* ==================================================
//             HEADER
//            ================================================== */}

//         <div className="mb-10 text-center">
//           <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
//             <GraduationCap className="h-8 w-8 text-blue-600" />
//           </div>

//           <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
//             Student Practice
//           </span>

//           <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
//             Choose Your Examination Type
//           </h1>

//           <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-slate-600">
//             Select the examination you want to practise. Your practice
//             dashboard will be customized for the examination you choose.
//           </p>
//         </div>

//         {/* ==================================================
//             EXAMINATION CARDS
//            ================================================== */}

//         <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
//           {EXAMS.map((item) => {
//             const Icon = item.icon;

//             return (
//               <Link
//                 key={item.id}
//                 href={item.href}
//                 className="group text-left"
//               >
//                 <Card
//                   hoverable
//                   className="relative h-full overflow-hidden border-2 border-slate-200 bg-white p-7 transition-all group-hover:-translate-y-1 group-hover:border-blue-500 group-hover:shadow-xl"
//                 >
//                   {/* Selected / Arrow Indicator */}

//                   <div className="absolute right-5 top-5 opacity-0 transition group-hover:opacity-100">
//                     <CheckCircle2 className="h-6 w-6 text-blue-600" />
//                   </div>

//                   {/* Icon */}

//                   <div
//                     className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.lightColor}`}
//                   >
//                     <Icon className={`h-8 w-8 ${item.color}`} />
//                   </div>

//                   {/* Name */}

//                   <h2 className="mt-6 text-2xl font-bold text-slate-900">
//                     {item.name}
//                   </h2>

//                   {/* Description */}

//                   <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">
//                     {item.description}
//                   </p>

//                   {/* Button */}

//                   <div className="mt-7 flex items-center gap-2 text-sm font-bold text-blue-600">
//                     Start {item.name} Practice

//                     <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                   </div>
//                 </Card>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </main>
//   );
// }