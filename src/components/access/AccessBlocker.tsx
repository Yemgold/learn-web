
// "use client";

// import { useState } from "react";
// import {
//   Lock,
//   ArrowRight,
//   GraduationCap,
//   BriefcaseBusiness,
//   BookOpen,
//   FileText,
//   ClipboardCheck,
//   ArrowLeft,
// } from "lucide-react";

// export type SecondaryExam = "jamb" | "waec" | "neco";

// interface AccessBlockerProps {
//   onSecondaryClick?: () => void;
//   onExamClick?: (exam: SecondaryExam) => void;
// }

// export default function AccessBlocker({
//   onSecondaryClick,
//   onExamClick,
// }: AccessBlockerProps) {
//   const [showExaminations, setShowExaminations] = useState(false);

//   /*
//    * IMPORTANT:
//    *
//    * Clicking "Choose Secondary" does NOT navigate anywhere.
//    *
//    * It only changes the UI from:
//    *
//    * Choose Your Access
//    *
//    * to:
//    *
//    * Choose Your Examination
//    */
//   const handleSecondaryClick = () => {
//     setShowExaminations(true);

//     // Keep this callback available if the parent needs
//     // to know that Secondary was selected.
//     onSecondaryClick?.();
//   };

//   /*
//    * ONLY this handler selects the actual examination.
//    *
//    * JAMB  -> onExamClick("jamb")
//    * WAEC  -> onExamClick("waec")
//    * NECO  -> onExamClick("neco")
//    */
//   const handleExamClick = (exam: SecondaryExam) => {
//     onExamClick?.(exam);
//   };

//   const handleBack = () => {
//     setShowExaminations(false);
//   };

//   return (
//     <section className="w-full">
//       {/* ======================================================
//           ACCESS CATEGORY SCREEN
//          ====================================================== */}

//       {!showExaminations && (
//         <>
//           <div className="mb-8 text-center">
//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
//               <Lock className="h-7 w-7 text-blue-600" />
//             </div>

//             <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//               Choose Your Access
//             </h2>

//             <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
//               Select the category that matches your educational
//               level to continue.
//             </p>
//           </div>

//           <div className="grid gap-6 lg:grid-cols-3">
//             {/* ==================================================
//                 SECONDARY
//                ================================================== */}

//             <article className="relative overflow-hidden rounded-3xl border-2 border-blue-500 bg-white p-6 shadow-lg shadow-blue-100/50">
//               <div className="absolute right-5 top-5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
//                 AVAILABLE
//               </div>

//               <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
//                 <GraduationCap className="h-7 w-7 text-blue-600" />
//               </div>

//               <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
//                 Secondary
//               </p>

//               <h3 className="mt-2 text-2xl font-bold text-slate-900">
//                 Secondary Students
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Access JAMB, WAEC, and NECO examination
//                 preparation resources and plans.
//               </p>

//               <ul className="mt-6 space-y-3 text-sm text-slate-600">
//                 <li className="flex items-center gap-3">
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
//                     ✓
//                   </span>
//                   JAMB Preparation
//                 </li>

//                 <li className="flex items-center gap-3">
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
//                     ✓
//                   </span>
//                   WAEC Preparation
//                 </li>

//                 <li className="flex items-center gap-3">
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
//                     ✓
//                   </span>
//                   NECO Preparation
//                 </li>
//               </ul>

//               <button
//                 type="button"
//                 onClick={handleSecondaryClick}
//                 className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
//               >
//                 Choose Secondary
//                 <ArrowRight className="h-4 w-4" />
//               </button>
//             </article>

//             {/* ==================================================
//                 TERTIARY
//                ================================================== */}

//             <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 opacity-90 shadow-sm">
//               <div className="absolute right-5 top-5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
//                 COMING SOON
//               </div>

//               <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
//                 <GraduationCap className="h-7 w-7 text-slate-500" />
//               </div>

//               <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
//                 Tertiary
//               </p>

//               <h3 className="mt-2 text-2xl font-bold text-slate-800">
//                 Tertiary Students
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 University, polytechnic, and other tertiary-level
//                 examination and learning resources.
//               </p>

//               <ul className="mt-6 space-y-3 text-sm text-slate-400">
//                 <li className="flex items-center gap-3">
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
//                     —
//                   </span>
//                   Tertiary Practice
//                 </li>

//                 <li className="flex items-center gap-3">
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
//                     —
//                   </span>
//                   Academic Challenges
//                 </li>

//                 <li className="flex items-center gap-3">
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
//                     —
//                   </span>
//                   Learning Resources
//                 </li>
//               </ul>

//               <button
//                 type="button"
//                 disabled
//                 className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-400"
//               >
//                 Coming Soon
//               </button>
//             </article>

//             {/* ==================================================
//                 PROFESSIONALS
//                ================================================== */}

//             <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 opacity-90 shadow-sm">
//               <div className="absolute right-5 top-5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
//                 COMING SOON
//               </div>

//               <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
//                 <BriefcaseBusiness className="h-7 w-7 text-slate-500" />
//               </div>

//               <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
//                 Professionals
//               </p>

//               <h3 className="mt-2 text-2xl font-bold text-slate-800">
//                 Professionals
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Professional certification, career development,
//                 and specialized examination preparation.
//               </p>

//               <ul className="mt-6 space-y-3 text-sm text-slate-400">
//                 <li className="flex items-center gap-3">
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
//                     —
//                   </span>
//                   Professional Exams
//                 </li>

//                 <li className="flex items-center gap-3">
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
//                     —
//                   </span>
//                   Certification Practice
//                 </li>

//                 <li className="flex items-center gap-3">
//                   <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
//                     —
//                   </span>
//                   Career Resources
//                 </li>
//               </ul>

//               <button
//                 type="button"
//                 disabled
//                 className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-400"
//               >
//                 Coming Soon
//               </button>
//             </article>
//           </div>
//         </>
//       )}

//       {/* ======================================================
//           EXAMINATION SELECTION
//          ====================================================== */}

//       {showExaminations && (
//         <div>
//           <div className="mb-8 text-center">
//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
//               <BookOpen className="h-7 w-7 text-blue-600" />
//             </div>

//             <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//               Choose Your Examination
//             </h2>

//             <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
//               Select JAMB, WAEC, or NECO to view its available
//               plans.
//             </p>
//           </div>

//           <div className="grid gap-6 md:grid-cols-3">
//             {/* ==================================================
//                 JAMB
//                ================================================== */}

//             <article className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg">
//               <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
//                 <BookOpen className="h-7 w-7 text-blue-600" />
//               </div>

//               <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
//                 Examination
//               </p>

//               <h3 className="mt-2 text-2xl font-bold text-slate-900">
//                 JAMB
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Prepare for JAMB with structured examination
//                 resources and preparation plans.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => handleExamClick("jamb")}
//                 className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
//               >
//                 View JAMB Plans
//                 <ArrowRight className="h-4 w-4" />
//               </button>
//             </article>

//             {/* ==================================================
//                 WAEC
//                ================================================== */}

//             <article className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg">
//               <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
//                 <FileText className="h-7 w-7 text-blue-600" />
//               </div>

//               <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
//                 Examination
//               </p>

//               <h3 className="mt-2 text-2xl font-bold text-slate-900">
//                 WAEC
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Prepare for WAEC with examination resources
//                 and preparation plans.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => handleExamClick("waec")}
//                 className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
//               >
//                 View WAEC Plans
//                 <ArrowRight className="h-4 w-4" />
//               </button>
//             </article>

//             {/* ==================================================
//                 NECO
//                ================================================== */}

//             <article className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg">
//               <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
//                 <ClipboardCheck className="h-7 w-7 text-blue-600" />
//               </div>

//               <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
//                 Examination
//               </p>

//               <h3 className="mt-2 text-2xl font-bold text-slate-900">
//                 NECO
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-500">
//                 Prepare for NECO with examination resources
//                 and preparation plans.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => handleExamClick("neco")}
//                 className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
//               >
//                 View NECO Plans
//                 <ArrowRight className="h-4 w-4" />
//               </button>
//             </article>
//           </div>

//           <div className="mt-8 flex justify-center">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Access Categories
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }






"use client";

import {
  Lock,
  ArrowRight,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";

interface AccessBlockerProps {
  onSecondaryClick?: () => void;
}

/* ============================================================
   ACCESS BLOCKER
   ============================================================ */

export default function AccessBlocker({
  onSecondaryClick,
}: AccessBlockerProps) {
  return (
    <section className="w-full">
      {/* ======================================================
          HEADER
         ====================================================== */}

      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <Lock className="h-7 w-7 text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Choose Your Access
        </h2>

        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Select the category that matches your educational level
          to unlock the learning, practice, and competition features
          available to you.
        </p>
      </div>

      {/* ======================================================
          PLAN CARDS
         ====================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ====================================================
            SECONDARY
           ==================================================== */}

        <article className="relative overflow-hidden rounded-3xl border-2 border-blue-500 bg-white p-6 shadow-lg shadow-blue-100/50">
          <div className="absolute right-5 top-5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            AVAILABLE
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <GraduationCap className="h-7 w-7 text-blue-600" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Secondary
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            Secondary Students
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Access JAMB, WAEC, and other secondary-school
            examination preparation features.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                ✓
              </span>
              CBT Practice
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                ✓
              </span>
              Solve &amp; Win
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                ✓
              </span>
              Question Videos
            </li>
          </ul>

          <button
            type="button"
            onClick={onSecondaryClick}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            View Secondary Plans
            <ArrowRight className="h-4 w-4" />
          </button>
        </article>

        {/* ====================================================
            TERTIARY
           ==================================================== */}

        <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 opacity-90 shadow-sm">
          <div className="absolute right-5 top-5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
            COMING SOON
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <GraduationCap className="h-7 w-7 text-slate-500" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Tertiary
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            Tertiary Students
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            University, polytechnic, and other tertiary-level
            examination and learning resources.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Tertiary Practice
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Academic Challenges
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Learning Resources
            </li>
          </ul>

          <button
            type="button"
            disabled
            className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-400"
          >
            Coming Soon
          </button>
        </article>

        {/* ====================================================
            PROFESSIONALS
           ==================================================== */}

        <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 opacity-90 shadow-sm">
          <div className="absolute right-5 top-5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
            COMING SOON
          </div>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <BriefcaseBusiness className="h-7 w-7 text-slate-500" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Professionals
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-800">
            Professionals
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Professional certification, career development,
            and specialized examination preparation.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Professional Exams
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Certification Practice
            </li>

            <li className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-xs">
                —
              </span>
              Career Resources
            </li>
          </ul>

          <button
            type="button"
            disabled
            className="mt-8 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-bold text-slate-400"
          >
            Coming Soon
          </button>
        </article>
      </div>
    </section>
  );
}
