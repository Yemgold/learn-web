


// "use client";

// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";

// interface PracticeSessionHeaderProps {
//   subjectSlug: string;
//   examType: string;
//   subjectName: string;
//   year: string;
//   questionNumber: number;
//   totalQuestions: number;
// }

// export function PracticeSessionHeader({
//   subjectSlug,
//   subjectName,
//   year,
//   questionNumber,
//   totalQuestions,
// }: PracticeSessionHeaderProps) {
//   const progress =
//     totalQuestions > 0
//       ? (questionNumber / totalQuestions) * 100
//       : 0;

//   return (
//     <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
//       <div className="container mx-auto px-4">

//         {/* ====================================================
//             HEADER ROW
//             ==================================================== */}

//         <div className="flex min-h-16 items-center justify-between gap-4">

//           {/* ==================================================
//               BACK / EXIT
//               ================================================== */}

//           <Link
//             href={`/student/practice/${subjectSlug}/years`}
//             className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
//           >
//             <ArrowLeft className="h-4 w-4 shrink-0" />

//             <span className="hidden sm:inline">
//               Exit Practice
//             </span>
//           </Link>

//           {/* ==================================================
//               TITLE
//               ================================================== */}

//           <div className="min-w-0 text-center">

//             <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//               JAMB Past Questions
//             </p>

//             <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">
//               {subjectName} • {year}
//             </h1>

//           </div>

//           {/* ==================================================
//               QUESTION COUNTER
//               ================================================== */}

//           <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
//             {questionNumber} / {totalQuestions}
//           </div>
//         </div>

//         {/* ====================================================
//             PROGRESS BAR
//             ==================================================== */}

//         <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
//           <div
//             className="h-full rounded-full bg-blue-600 transition-all duration-300"
//             style={{
//               width: `${progress}%`,
//             }}
//           />
//         </div>

//       </div>
//     </header>
//   );
// }









"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PracticeSessionHeaderProps {
  subjectSlug: string;
  examType: string;
  subjectName: string;
  year: string;
  questionNumber: number;
  totalQuestions: number;
}

export function PracticeSessionHeader({
  subjectSlug,
  subjectName,
  year,
  questionNumber,
  totalQuestions,
}: PracticeSessionHeaderProps) {
  const progress =
    totalQuestions > 0
      ? (questionNumber / totalQuestions) * 100
      : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 text-white shadow-none backdrop-blur-xl">
      <div className="container mx-auto px-4">
        {/* HEADER ROW */}
        <div className="flex min-h-16 items-center justify-between gap-3 sm:gap-4">
          {/* BACK / EXIT */}
          <Link
            href={`/student/practice/${subjectSlug}/years`}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-3"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />

            <span className="hidden sm:inline">
              Exit Practice
            </span>
            <span className="sm:hidden">
              Exit
            </span>
          </Link>

          {/* TITLE */}
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-400 sm:text-xs">
              JAMB Past Questions
            </p>

            <h1 className="mt-0.5 truncate text-sm font-bold text-white sm:text-base">
              {subjectName} <span className="text-slate-500">•</span>{" "}
              {year}
            </h1>
          </div>

          {/* QUESTION COUNTER */}
          <div className="shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1.5 text-xs font-semibold tabular-nums text-blue-300 sm:px-3 sm:text-sm">
            {questionNumber} / {totalQuestions}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </header>
  );
}
