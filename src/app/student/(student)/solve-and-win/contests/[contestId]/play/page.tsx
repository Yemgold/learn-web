

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import {
//   AlertCircle,
//   ArrowLeft,
//   ArrowRight,
//   CheckCircle2,
//   Clock3,
//   Flag,
//   Loader2,
//   Trophy,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// /* ============================================================
//    TYPES
//    ============================================================ */

// type ContestOption = {
//   id?: string;
//   _id?: string;
//   label?: string;
//   text?: string;
//   value?: string;
//   option?: string;
// };

// type ContestQuestion = {
//   _id?: string;
//   id?: string;
//   questionId?: string;

//   question?: string;
//   text?: string;
//   instruction?: string;

//   content?: unknown[];
//   media?: unknown;

//   options?: ContestOption[] | string[];

//   questionType?: string;
//   isMultipleAnswer?: boolean;

//   marks?: number;

//   explanation?: string;
//   explanationSteps?: string[];

//   selectedOption?: string | null;
//   isCorrect?: boolean | null;
//   marksAwarded?: number;
// };

// type ParticipationSubject = {
//   subjectId?: string;
//   questions?: ContestQuestion[];

//   correctAnswers?: number;
//   wrongAnswers?: number;
//   unansweredQuestions?: number;
//   score?: number;

//   durationInSeconds?: number;
//   remainingDurationInSeconds?: number;

//   startedAt?: string | null;
//   endsAt?: string | null;
//   submittedAt?: string | null;
// };

// type Participation = {
//   _id?: string;
//   id?: string;
//   participationId?: string;

//   userId?: string;
//   contestId?: string;

//   subjects?: ParticipationSubject[];
//   questions?: ContestQuestion[];

//   totalQuestions?: number;
//   correctAnswers?: number;
//   wrongAnswers?: number;
//   unansweredQuestions?: number;

//   score?: number;
//   percentage?: number;
//   pointsSpent?: number;

//   durationInSeconds?: number;
//   remainingDurationInSeconds?: number;

//   status?: string;

//   startedAt?: string;
//   endsAt?: string;
//   submittedAt?: string;
// };

// /* ============================================================
//    GENERIC HELPERS
//    ============================================================ */

// function isObject(
//   value: unknown
// ): value is Record<string, unknown> {
//   return (
//     typeof value === "object" &&
//     value !== null
//   );
// }

// function getNumber(
//   value: unknown
// ): number | null {
//   if (typeof value === "number") {
//     return Number.isFinite(value)
//       ? value
//       : null;
//   }

//   if (
//     typeof value === "string" &&
//     value.trim() !== ""
//   ) {
//     const parsed = Number(value);

//     return Number.isFinite(parsed)
//       ? parsed
//       : null;
//   }

//   return null;
// }

// /* ============================================================
//    RESPONSE EXTRACTION
//    ============================================================ */

// function extractParticipation(
//   response: unknown
// ): Participation | null {
//   if (!isObject(response)) {
//     return null;
//   }

//   if (
//     isObject(response.participation)
//   ) {
//     return response.participation as Participation;
//   }

//   if (
//     isObject(response.data) &&
//     isObject(response.data.participation)
//   ) {
//     return response.data
//       .participation as Participation;
//   }

//   if (isObject(response.data)) {
//     const data =
//       response.data as Record<
//         string,
//         unknown
//       >;

//     if (
//       data.subjects ||
//       data.questions ||
//       data.contestId ||
//       data.participationId ||
//       data._id
//     ) {
//       return data as Participation;
//     }
//   }

//   if (
//     response.subjects ||
//     response.questions ||
//     response.contestId ||
//     response.participationId
//   ) {
//     return response as Participation;
//   }

//   return null;
// }

// /* ============================================================
//    QUESTION EXTRACTION
//    ============================================================ */

// function extractQuestions(
//   participation: Participation | null
// ): ContestQuestion[] {
//   if (!participation) {
//     return [];
//   }

//   if (
//     Array.isArray(
//       participation.questions
//     )
//   ) {
//     return participation.questions;
//   }

//   if (
//     Array.isArray(
//       participation.subjects
//     )
//   ) {
//     return participation.subjects.flatMap(
//       (subject) =>
//         Array.isArray(subject.questions)
//           ? subject.questions
//           : []
//     );
//   }

//   return [];
// }

// /* ============================================================
//    QUESTION HELPERS
//    ============================================================ */

// function getQuestionText(
//   question: ContestQuestion
// ): string {
//   return (
//     question.question ??
//     question.text ??
//     "Question unavailable"
//   );
// }

// function getQuestionId(
//   question: ContestQuestion,
//   index: number
// ): string {
//   return (
//     question.questionId ??
//     question._id ??
//     question.id ??
//     `question-${index}`
//   );
// }

// /* ============================================================
//    OPTION HELPERS
//    ============================================================ */

// function getOptionText(
//   option: ContestOption | string,
//   index: number
// ): string {
//   if (typeof option === "string") {
//     return option;
//   }

//   return (
//     option.value ??
//     option.text ??
//     option.option ??
//     option.label ??
//     `Option ${index + 1}`
//   );
// }

// function getOptionLabel(
//   option: ContestOption | string,
//   index: number
// ): string {
//   if (typeof option === "string") {
//     return String.fromCharCode(
//       65 + index
//     );
//   }

//   return (
//     option.label ??
//     String.fromCharCode(
//       65 + index
//     )
//   );
// }

// function getOptionId(
//   option: ContestOption | string,
//   index: number
// ): string {
//   if (typeof option === "string") {
//     return option;
//   }

//   return (
//     option._id ??
//     option.id ??
//     option.value ??
//     `option-${index}`
//   );
// }

// /* ============================================================
//    SHARED BACKGROUND
//    ============================================================ */

// function ContestBackground({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//       {/* Atmospheric background matching Solve & Win */}
//       <div className="pointer-events-none fixed inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
//       </div>

//       <div className="relative z-10">
//         {children}
//       </div>
//     </main>
//   );
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function SolveAndWinPlayPage() {
//   const params = useParams();

//   const contestId =
//     params?.contestId as
//       | string
//       | undefined;

//   const [participation, setParticipation] =
//     useState<Participation | null>(null);

//   const [questions, setQuestions] =
//     useState<ContestQuestion[]>([]);

//   const [currentQuestionIndex, setCurrentQuestionIndex] =
//     useState(0);

//   const [answers, setAnswers] =
//     useState<Record<string, string>>({});

//   const [timeRemaining, setTimeRemaining] =
//     useState<number | null>(null);

//   const [isLoading, setIsLoading] =
//     useState(true);

//   const [error, setError] =
//     useState<string | null>(null);

//   const [isSubmitting, setIsSubmitting] =
//     useState(false);

//   const [isSubmitted, setIsSubmitted] =
//     useState(false);

//   /* ==========================================================
//      LOAD START RESPONSE
//      ========================================================== */

//   useEffect(() => {
//     if (!contestId) {
//       setError(
//         "Contest information could not be found."
//       );

//       setIsLoading(false);
//       return;
//     }

//     try {
//       const storageKey =
//         `solve-and-win-start-${contestId}`;

//       const stored =
//         sessionStorage.getItem(
//           storageKey
//         );

//       if (!stored) {
//         setError(
//           "Your contest session could not be found. Please return to the contest and start again."
//         );

//         setIsLoading(false);
//         return;
//       }

//       const parsed: unknown =
//         JSON.parse(stored);

//       console.log(
//         "Stored Solve & Win start response:",
//         parsed
//       );

//       const extracted =
//         extractParticipation(parsed);

//       console.log(
//         "Extracted participation:",
//         extracted
//       );

//       if (!extracted) {
//         setError(
//           "The contest session was created, but the response format could not be understood yet."
//         );

//         setIsLoading(false);
//         return;
//       }

//       const extractedQuestions =
//         extractQuestions(extracted);

//       console.log(
//         "Extracted contest questions:",
//         extractedQuestions
//       );

//       extractedQuestions.forEach(
//         (question, questionIndex) => {
//           console.log(
//             `Question ${questionIndex + 1} options:`,
//             question.options
//           );
//         }
//       );

//       setParticipation(extracted);
//       setQuestions(extractedQuestions);

//       const remaining =
//         getNumber(
//           extracted.remainingDurationInSeconds
//         );

//       if (remaining !== null) {
//         setTimeRemaining(remaining);
//       } else {
//         const firstSubject =
//           extracted.subjects?.[0];

//         const subjectRemaining =
//           getNumber(
//             firstSubject?.remainingDurationInSeconds
//           );

//         const subjectDuration =
//           getNumber(
//             firstSubject?.durationInSeconds
//           );

//         setTimeRemaining(
//           subjectRemaining ??
//           subjectDuration
//         );
//       }

//       setIsLoading(false);
//     } catch (err) {
//       console.error(
//         "Failed to load contest session:",
//         err
//       );

//       setError(
//         "Unable to load your contest session. Please return and start the contest again."
//       );

//       setIsLoading(false);
//     }
//   }, [contestId]);

//   /* ==========================================================
//      TIMER
//      ========================================================== */

//   useEffect(() => {
//     if (
//       timeRemaining === null ||
//       isSubmitted
//     ) {
//       return;
//     }

//     if (timeRemaining <= 0) {
//       return;
//     }

//     const timer =
//       window.setInterval(() => {
//         setTimeRemaining(
//           (previous) => {
//             if (
//               previous === null ||
//               previous <= 1
//             ) {
//               return 0;
//             }

//             return previous - 1;
//           }
//         );
//       }, 1000);

//     return () => {
//       window.clearInterval(timer);
//     };
//   }, [
//     timeRemaining,
//     isSubmitted,
//   ]);

//   /* ==========================================================
//      CURRENT QUESTION
//      ========================================================== */

//   const currentQuestion =
//     questions[
//       currentQuestionIndex
//     ];

//   const currentQuestionId =
//     currentQuestion
//       ? getQuestionId(
//           currentQuestion,
//           currentQuestionIndex
//         )
//       : null;

//   const currentOptions =
//     currentQuestion &&
//     Array.isArray(
//       currentQuestion.options
//     )
//       ? currentQuestion.options
//       : [];

//   /* ==========================================================
//      PROGRESS
//      ========================================================== */

//   const answeredCount =
//     Object.keys(answers).length;

//   const progressPercentage =
//     questions.length > 0
//       ? Math.round(
//           ((currentQuestionIndex + 1) /
//             questions.length) *
//             100
//         )
//       : 0;

//   const answeredPercentage =
//     questions.length > 0
//       ? Math.round(
//           (answeredCount /
//             questions.length) *
//             100
//         )
//       : 0;

//   /* ==========================================================
//      TIMER DISPLAY
//      ========================================================== */

//   const timerDisplay =
//     useMemo(() => {
//       if (
//         timeRemaining === null
//       ) {
//         return "--:--";
//       }

//       const minutes =
//         Math.floor(
//           timeRemaining / 60
//         );

//       const seconds =
//         timeRemaining % 60;

//       return `${String(
//         minutes
//       ).padStart(
//         2,
//         "0"
//       )}:${String(
//         seconds
//       ).padStart(
//         2,
//         "0"
//       )}`;
//     }, [timeRemaining]);

//   const timerCritical =
//     timeRemaining !== null &&
//     timeRemaining <= 60;

//   /* ==========================================================
//      SELECT ANSWER
//      ========================================================== */

//   const handleSelectAnswer = (
//     optionId: string
//   ) => {
//     if (
//       !currentQuestionId ||
//       isSubmitted
//     ) {
//       return;
//     }

//     setAnswers(
//       (previous) => ({
//         ...previous,
//         [currentQuestionId]:
//           optionId,
//       })
//     );
//   };

//   /* ==========================================================
//      NAVIGATION
//      ========================================================== */

//   const goToPreviousQuestion = () => {
//     setCurrentQuestionIndex(
//       (previous) =>
//         Math.max(
//           0,
//           previous - 1
//         )
//     );
//   };

//   const goToNextQuestion = () => {
//     setCurrentQuestionIndex(
//       (previous) =>
//         Math.min(
//           questions.length - 1,
//           previous + 1
//         )
//     );
//   };

//   /* ==========================================================
//      SUBMIT
//      ========================================================== */

//   const handleSubmit = async () => {
//     if (
//       isSubmitting ||
//       isSubmitted
//     ) {
//       return;
//     }

//     console.log(
//       "Solve & Win submission payload:",
//       {
//         contestId,
//         participation,
//         answers,
//       }
//     );

//     setIsSubmitting(true);

//     setTimeout(() => {
//       setIsSubmitting(false);
//       setIsSubmitted(true);
//     }, 500);
//   };

//   /* ==========================================================
//      LOADING
//      ========================================================== */

//   if (isLoading) {
//     return (
//       <ContestBackground>
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

//             <div className="p-10 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//                 <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
//               </div>

//               <h1 className="mt-6 text-2xl font-black text-white">
//                 Loading Contest
//               </h1>

//               <p className="mt-2 text-sm text-slate-400">
//                 Preparing your questions...
//               </p>
//             </div>
//           </Card>
//         </div>
//       </ContestBackground>
//     );
//   }

//   /* ==========================================================
//      ERROR
//      ========================================================== */

//   if (error) {
//     return (
//       <ContestBackground>
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />

//             <div className="p-8 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
//                 <AlertCircle className="h-8 w-8 text-red-400" />
//               </div>

//               <h1 className="mt-6 text-2xl font-black text-white">
//                 Unable to Load Contest
//               </h1>

//               <p className="mt-3 text-sm leading-6 text-slate-400">
//                 {error}
//               </p>

//               <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
//                 <Link
//                   href={`/student/solve-and-win/contests/${contestId}/start`}
//                   className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Return to Start
//                 </Link>

//                 <Link
//                   href="/student/solve-and-win"
//                   className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
//                 >
//                   Back to Contests
//                 </Link>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </ContestBackground>
//     );
//   }

//   /* ==========================================================
//      NO QUESTIONS
//      ========================================================== */

//   if (
//     !questions.length &&
//     !isSubmitted
//   ) {
//     return (
//       <ContestBackground>
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

//             <div className="p-8 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
//                 <AlertCircle className="h-8 w-8 text-amber-400" />
//               </div>

//               <h1 className="mt-6 text-2xl font-black text-white">
//                 No Questions Available
//               </h1>

//               <p className="mt-3 text-sm leading-6 text-slate-400">
//                 The contest session was created,
//                 but no questions were returned yet.
//               </p>

//               <p className="mt-4 text-xs text-slate-500">
//                 Check the browser console for the
//                 actual backend response.
//               </p>

//               <Link
//                 href={`/student/solve-and-win/contests/${contestId}/start`}
//                 className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Return to Contest
//               </Link>
//             </div>
//           </Card>
//         </div>
//       </ContestBackground>
//     );
//   }

//   /* ==========================================================
//      SUBMITTED
//      ========================================================== */

//   if (isSubmitted) {
//     return (
//       <ContestBackground>
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

//             <div className="p-8 text-center">
//               <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-xl shadow-emerald-500/20">
//                 <CheckCircle2 className="h-10 w-10 text-white" />
//               </div>

//               <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
//                 Contest Submitted
//               </p>

//               <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
//                 Your answers have been recorded
//               </h1>

//               <p className="mt-3 text-sm leading-6 text-slate-400">
//                 Your contest result will be processed
//                 by the competition system.
//               </p>

//               <Link
//                 href="/student/solve-and-win"
//                 className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5"
//               >
//                 <Trophy className="h-4 w-4" />
//                 Back to Solve & Win
//               </Link>
//             </div>
//           </Card>
//         </div>
//       </ContestBackground>
//     );
//   }

//   /* ==========================================================
//      MAIN CBT
//      ========================================================== */

//   return (
//     <ContestBackground>
//       <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

//         {/* ====================================================
//             TOP HEADER
//            ==================================================== */}

//         <div className="mb-5 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-sm">
//           <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

//           <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">

//             {/* Brand */}

//             <div className="flex items-center gap-3">
//               <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-600 shadow-lg shadow-blue-600/20">
//                 <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />

//                 <Trophy className="relative h-5 w-5 text-white" />
//               </div>

//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-400">
//                   Solve & Win
//                 </p>

//                 <h1 className="text-base font-black text-white">
//                   Live Contest
//                 </h1>
//               </div>
//             </div>

//             {/* Stats */}

//             <div className="flex items-center gap-3">
//               <div className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-right sm:block">
//                 <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
//                   Answered
//                 </p>

//                 <p className="text-sm font-black text-white">
//                   {answeredCount}

//                   <span className="text-slate-500">
//                     {" "}
//                     / {questions.length}
//                   </span>
//                 </p>
//               </div>

//               {/* Timer */}

//               <div
//                 className={`relative flex items-center gap-2 overflow-hidden rounded-xl border px-4 py-2.5 shadow-sm ${
//                   timerCritical
//                     ? "border-red-400/30 bg-red-500/10 text-red-400"
//                     : "border-cyan-400/25 bg-cyan-500/10 text-cyan-300"
//                 }`}
//               >
//                 <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

//                 <Clock3 className="h-4 w-4" />

//                 <span className="font-mono text-sm font-black tracking-wider">
//                   {timerDisplay}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Main progress */}

//           <div className="h-1.5 bg-white/[0.04]">
//             <div
//               className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all duration-300"
//               style={{
//                 width: `${progressPercentage}%`,
//               }}
//             />
//           </div>
//         </div>

//         {/* ====================================================
//             QUESTION PROGRESS
//            ==================================================== */}

//         <div className="mb-5">
//           <div className="mb-2 flex items-center justify-between">
//             <div className="text-xs font-bold text-slate-500">
//               Question{" "}
//               <span className="font-black text-white">
//                 {currentQuestionIndex + 1}
//               </span>
//               {" "}of{" "}
//               <span className="font-black text-white">
//                 {questions.length}
//               </span>
//             </div>

//             <div className="text-xs font-black text-emerald-400">
//               {progressPercentage}%
//             </div>
//           </div>

//           <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
//             <div
//               className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
//               style={{
//                 width: `${progressPercentage}%`,
//               }}
//             />
//           </div>
//         </div>

//         {/* ====================================================
//             CBT LAYOUT
//            ==================================================== */}

//         <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">

//           {/* ==================================================
//               QUESTION CARD
//              ================================================== */}

//           <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

//             <div className="p-6 sm:p-9">

//               {/* Question header */}

//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5">
//                     <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
//                       Question{" "}
//                       {currentQuestionIndex + 1}
//                     </span>
//                   </div>

//                   {currentQuestion?.instruction && (
//                     <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
//                       {currentQuestion.instruction}
//                     </p>
//                   )}
//                 </div>

//                 {currentQuestion?.marks !==
//                   undefined && (
//                   <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-black text-slate-300">
//                     {currentQuestion.marks}{" "}
//                     {currentQuestion.marks === 1
//                       ? "mark"
//                       : "marks"}
//                   </div>
//                 )}
//               </div>

//               {/* Question */}

//               <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
//                 <h2 className="max-w-4xl whitespace-pre-wrap text-xl font-extrabold leading-9 tracking-tight text-white sm:text-[1.4rem]">
//                   {currentQuestion
//                     ? getQuestionText(
//                         currentQuestion
//                       )
//                     : "Question unavailable"}
//                 </h2>
//               </div>

//               {/* Options */}

//               <div className="mt-8 space-y-3">
//                 {currentOptions.map(
//                   (
//                     option,
//                     optionIndex
//                   ) => {
//                     const optionId =
//                       getOptionId(
//                         option,
//                         optionIndex
//                       );

//                     const optionLabel =
//                       getOptionLabel(
//                         option,
//                         optionIndex
//                       );

//                     const optionText =
//                       getOptionText(
//                         option,
//                         optionIndex
//                       );

//                     const selected =
//                       currentQuestionId
//                         ? answers[
//                             currentQuestionId
//                           ] === optionId
//                         : false;

//                     return (
//                       <button
//                         key={optionId}
//                         type="button"
//                         onClick={() =>
//                           handleSelectAnswer(
//                             optionId
//                           )
//                         }
//                         disabled={
//                           isSubmitted
//                         }
//                         className={`group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${
//                           selected
//                             ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/10"
//                             : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-white/[0.05] hover:shadow-lg"
//                         }`}
//                       >
//                         {/* Top highlight */}

//                         <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

//                         {/* Letter */}

//                         <span
//                           className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition-all ${
//                             selected
//                               ? "border-blue-400/40 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20"
//                               : "border-white/10 bg-white/[0.04] text-slate-300 group-hover:border-blue-400/30 group-hover:bg-blue-500/10 group-hover:text-blue-300"
//                           }`}
//                         >
//                           {optionLabel}
//                         </span>

//                         {/* Text */}

//                         <span
//                           className={`relative pt-1.5 whitespace-pre-wrap text-[15px] font-semibold leading-7 sm:text-base ${
//                             selected
//                               ? "text-white"
//                               : "text-slate-200"
//                           }`}
//                         >
//                           {optionText}
//                         </span>

//                         {/* Selected indicator */}

//                         {selected && (
//                           <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
//                             <CheckCircle2 className="h-4 w-4" />
//                           </span>
//                         )}
//                       </button>
//                     );
//                   }
//                 )}
//               </div>

//               {/* Navigation */}

//               <div className="mt-9 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={
//                     goToPreviousQuestion
//                   }
//                   disabled={
//                     currentQuestionIndex ===
//                     0
//                   }
//                   className="h-11 rounded-xl border-white/10 bg-white/[0.03] px-5 font-bold text-slate-300 shadow-sm hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
//                 >
//                   <ArrowLeft className="mr-2 h-4 w-4" />
//                   Previous
//                 </Button>

//                 {currentQuestionIndex <
//                 questions.length - 1 ? (
//                   <Button
//                     type="button"
//                     onClick={
//                       goToNextQuestion
//                     }
//                     className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-7 font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-600/30"
//                   >
//                     Next
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 ) : (
//                   <Button
//                     type="button"
//                     onClick={
//                       handleSubmit
//                     }
//                     disabled={
//                       isSubmitting
//                     }
//                     className="h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         <Flag className="mr-2 h-4 w-4" />
//                         Submit Contest
//                       </>
//                     )}
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {/* ==================================================
//               SIDEBAR
//              ================================================== */}

//           <div className="lg:sticky lg:top-5 lg:self-start">

//             {/* Question navigator */}

//             <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//               <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

//               <div className="p-5">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//                       Questions
//                     </p>

//                     <p className="mt-1 text-sm font-black text-white">
//                       {answeredCount}{" "}
//                       <span className="font-semibold text-slate-500">
//                         answered
//                       </span>
//                     </p>
//                   </div>

//                   <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-blue-500/10">
//                     <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

//                     <span className="relative text-xs font-black text-blue-300">
//                       {questions.length}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Completion */}

//                 <div className="mt-5">
//                   <div className="mb-1.5 flex justify-between text-[10px] font-bold">
//                     <span className="text-slate-500">
//                       Completion
//                     </span>

//                     <span className="text-emerald-400">
//                       {answeredPercentage}%
//                     </span>
//                   </div>

//                   <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
//                       style={{
//                         width: `${answeredPercentage}%`,
//                       }}
//                     />
//                   </div>
//                 </div>

//                 {/* Navigator */}

//                 <div className="mt-5 grid grid-cols-5 gap-2">
//                   {questions.map(
//                     (
//                       question,
//                       index
//                     ) => {
//                       const questionId =
//                         getQuestionId(
//                           question,
//                           index
//                         );

//                       const answered =
//                         Boolean(
//                           answers[
//                             questionId
//                           ]
//                         );

//                       const active =
//                         index ===
//                         currentQuestionIndex;

//                       return (
//                         <button
//                           key={questionId}
//                           type="button"
//                           onClick={() =>
//                             setCurrentQuestionIndex(
//                               index
//                             )
//                           }
//                           className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border text-xs font-black transition-all ${
//                             active
//                               ? "border-blue-400/40 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/10"
//                               : answered
//                               ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
//                               : "border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20 hover:bg-white/[0.05] hover:text-slate-300"
//                           }`}
//                         >
//                           {active && (
//                             <span className="absolute inset-x-0 top-0 h-px bg-white/70" />
//                           )}

//                           {index + 1}
//                         </button>
//                       );
//                     }
//                   )}
//                 </div>

//                 {/* Legend */}

//                 <div className="mt-5 space-y-2 border-t border-white/10 pt-5">
//                   <div className="flex items-center gap-2 text-xs text-slate-500">
//                     <span className="h-3 w-3 rounded bg-gradient-to-br from-blue-500 to-cyan-500" />
//                     Current
//                   </div>

//                   <div className="flex items-center gap-2 text-xs text-slate-500">
//                     <span className="h-3 w-3 rounded border border-emerald-400/20 bg-emerald-500/10" />
//                     Answered
//                   </div>

//                   <div className="flex items-center gap-2 text-xs text-slate-500">
//                     <span className="h-3 w-3 rounded border border-white/10 bg-white/[0.03]" />
//                     Unanswered
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             {/* Contest session */}

//             <Card className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//               <div className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />

//               <div className="p-5">
//                 <div className="flex items-center gap-3">
//                   <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-500/10">
//                     <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

//                     <Trophy className="relative h-4 w-4 text-emerald-400" />
//                   </div>

//                   <div>
//                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//                       Contest Session
//                     </p>

//                     <p className="mt-0.5 text-xs font-bold text-slate-300">
//                       Live participation
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-5 space-y-3">
//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-xs text-slate-500">
//                       Questions
//                     </span>

//                     <span className="text-xs font-black text-white">
//                       {questions.length}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-xs text-slate-500">
//                       Answered
//                     </span>

//                     <span className="text-xs font-black text-emerald-400">
//                       {answeredCount}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-xs text-slate-500">
//                       Remaining
//                     </span>

//                     <span className="text-xs font-black text-cyan-400">
//                       {Math.max(
//                         0,
//                         questions.length -
//                           answeredCount
//                       )}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </ContestBackground>
//   );
// }








"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flag,
  Loader2,
  PauseCircle,
  PlayCircle,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  pauseSolveAndWinContest,
  updateSolveAndWinContestQuestionAnswers,
  resumeSolveAndWinContest,
  submitSolveAndWinContest,
} from "@/lib/api/solveAndWin";

/* ============================================================
   TYPES
   ============================================================ */

type ContestOption = {
  id?: string;
  _id?: string;
  label?: string;
  text?: string;
  value?: string;
  option?: string;
};

type ContestQuestion = {
  _id?: string;
  id?: string;
  questionId?: string;

  question?: string;
  text?: string;
  instruction?: string;

  content?: unknown[];
  media?: unknown;

  options?: ContestOption[] | string[];

  questionType?: string;
  isMultipleAnswer?: boolean;

  marks?: number;

  explanation?: string;
  explanationSteps?: string[];

  selectedOption?: string | null;
  isCorrect?: boolean | null;
  marksAwarded?: number;

  /*
   * Added so questions extracted from multiple
   * participation subjects can retain their subject.
   */
  subjectId?: string;
};

type ParticipationSubject = {
  subjectId?:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
      };

  questions?: ContestQuestion[];

  correctAnswers?: number;
  wrongAnswers?: number;
  unansweredQuestions?: number;
  score?: number;

  durationInSeconds?: number;
  remainingDurationInSeconds?: number;

  startedAt?: string | null;
  endsAt?: string | null;
  submittedAt?: string | null;
};

type Participation = {
  _id?: string;
  id?: string;
  participationId?: string;

  userId?: string;
  contestId?: string;

  subjects?: ParticipationSubject[];
  questions?: ContestQuestion[];

  totalQuestions?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  unansweredQuestions?: number;

  score?: number;
  percentage?: number;
  pointsSpent?: number;

  durationInSeconds?: number;
  remainingDurationInSeconds?: number;

  status?: string;

  startedAt?: string;
  endsAt?: string;
  submittedAt?: string;
};

/* ============================================================
   GENERIC HELPERS
   ============================================================ */

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function getNumber(
  value: unknown,
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }

  if (
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    const parsed = Number(value);

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
}

/* ============================================================
   RESPONSE EXTRACTION
   ============================================================ */

function extractParticipation(
  response: unknown,
): Participation | null {
  if (!isObject(response)) {
    return null;
  }

  if (
    isObject(response.participation)
  ) {
    return response.participation as Participation;
  }

  if (
    isObject(response.data) &&
    isObject(response.data.participation)
  ) {
    return response.data
      .participation as Participation;
  }

  if (isObject(response.data)) {
    const data =
      response.data as Record<
        string,
        unknown
      >;

    if (
      data.subjects ||
      data.questions ||
      data.contestId ||
      data.participationId ||
      data._id
    ) {
      return data as Participation;
    }
  }

  if (
    response.subjects ||
    response.questions ||
    response.contestId ||
    response.participationId
  ) {
    return response as Participation;
  }

  return null;
}

/* ============================================================
   QUESTION EXTRACTION
   ============================================================ */

function extractQuestions(
  participation: Participation | null,
): ContestQuestion[] {
  if (!participation) {
    return [];
  }

  if (
    Array.isArray(
      participation.questions,
    )
  ) {
    return participation.questions;
  }

  if (
    Array.isArray(
      participation.subjects,
    )
  ) {
    return participation.subjects.flatMap(
      (subject) => {
        if (
          !Array.isArray(
            subject.questions,
          )
        ) {
          return [];
        }

        const subjectId =
          getSubjectId(subject);

        return subject.questions.map(
          (question) => ({
            ...question,
            subjectId:
              question.subjectId ??
              subjectId ??
              undefined,
          }),
        );
      },
    );
  }

  return [];
}

/* ============================================================
   SUBJECT ID EXTRACTION
   ============================================================ */

function getSubjectId(
  subject:
    | ParticipationSubject
    | undefined,
): string | null {
  if (!subject?.subjectId) {
    return null;
  }

  if (
    typeof subject.subjectId ===
    "string"
  ) {
    return subject.subjectId;
  }

  return (
    subject.subjectId._id ??
    subject.subjectId.id ??
    null
  );
}

/* ============================================================
   CURRENT SUBJECT ID
   ============================================================ */

function getParticipationSubjectId(
  participation: Participation | null,
): string | null {
  if (
    !participation ||
    !Array.isArray(
      participation.subjects,
    ) ||
    participation.subjects.length === 0
  ) {
    return null;
  }

  return getSubjectId(
    participation.subjects[0],
  );
}

/* ============================================================
   QUESTION HELPERS
   ============================================================ */

function getQuestionText(
  question: ContestQuestion,
): string {
  return (
    question.question ??
    question.text ??
    "Question unavailable"
  );
}

function getQuestionId(
  question: ContestQuestion,
  index: number,
): string {
  return (
    question.questionId ??
    question._id ??
    question.id ??
    `question-${index}`
  );
}

/* ============================================================
   OPTION HELPERS
   ============================================================ */

function getOptionText(
  option: ContestOption | string,
  index: number,
): string {
  if (typeof option === "string") {
    return option;
  }

  return (
    option.value ??
    option.text ??
    option.option ??
    option.label ??
    `Option ${index + 1}`
  );
}

function getOptionLabel(
  option: ContestOption | string,
  index: number,
): string {
  if (typeof option === "string") {
    return String.fromCharCode(
      65 + index,
    );
  }

  return (
    option.label ??
    String.fromCharCode(
      65 + index,
    )
  );
}

function getOptionId(
  option: ContestOption | string,
  index: number,
): string {
  if (typeof option === "string") {
    return option;
  }

  return (
    option._id ??
    option.id ??
    option.value ??
    `option-${index}`
  );
}

/* ============================================================
   API ERROR HELPER
   ============================================================ */

function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    isObject(error) &&
    isObject(error.response) &&
    isObject(
      error.response.data,
    )
  ) {
    const data =
      error.response.data;

    if (
      typeof data.message ===
        "string" &&
      data.message.trim()
    ) {
      return data.message;
    }

    if (
      typeof data.error ===
        "string" &&
      data.error.trim()
    ) {
      return data.error;
    }
  }

  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

/* ============================================================
   SHARED BACKGROUND
   ============================================================ */

function ContestBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </main>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function SolveAndWinPlayPage() {
  const params = useParams();

  const contestId =
    params?.contestId as
      | string
      | undefined;

  /* ==========================================================
     PARTICIPATION
     ========================================================== */

  const [participation, setParticipation] =
    useState<Participation | null>(
      null,
    );

  const [questions, setQuestions] =
    useState<ContestQuestion[]>([]);

  /* ==========================================================
     QUESTION STATE
     ========================================================== */

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [answers, setAnswers] =
    useState<
      Record<string, string>
    >({});

  /* ==========================================================
     TIMER
     ========================================================== */

  const [timeRemaining, setTimeRemaining] =
    useState<number | null>(null);

  /* ==========================================================
     LOADING / ERROR
     ========================================================== */

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* ==========================================================
     SUBMISSION
     ========================================================== */

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  /* ==========================================================
     ANSWER SAVING
     ========================================================== */

  const [
    savingQuestionId,
    setSavingQuestionId,
  ] = useState<string | null>(null);

  const [answerSaveError, setAnswerSaveError] =
    useState<string | null>(null);

  /* ==========================================================
     PAUSE / RESUME STATE
     ========================================================== */

  const [isPausing, setIsPausing] =
    useState(false);

  const [isResuming, setIsResuming] =
    useState(false);

  const [pauseError, setPauseError] =
    useState<string | null>(null);

  const [isContestPaused, setIsContestPaused] =
    useState(false);

  /*
   * Prevent automatic pause from being
   * triggered repeatedly when timer reaches zero.
   */
  const autoPauseTriggeredRef =
    useRef(false);

  /* ==========================================================
     LOAD START RESPONSE
     ========================================================== */

  useEffect(() => {
    if (!contestId) {
      setError(
        "Contest information could not be found.",
      );

      setIsLoading(false);
      return;
    }

    try {
      const storageKey =
        `solve-and-win-start-${contestId}`;

      const stored =
        sessionStorage.getItem(
          storageKey,
        );

      if (!stored) {
        setError(
          "Your contest session could not be found. Please return to the contest and start again.",
        );

        setIsLoading(false);
        return;
      }

      const parsed: unknown =
        JSON.parse(stored);

      console.log(
        "Stored Solve & Win start response:",
        parsed,
      );

      const extracted =
        extractParticipation(parsed);

      console.log(
        "Extracted participation:",
        extracted,
      );

      if (!extracted) {
        setError(
          "The contest session was created, but the response format could not be understood yet.",
        );

        setIsLoading(false);
        return;
      }

      const extractedQuestions =
        extractQuestions(
          extracted,
        );

      console.log(
        "Extracted contest questions:",
        extractedQuestions,
      );

      extractedQuestions.forEach(
        (
          question,
          questionIndex,
        ) => {
          console.log(
            `Question ${questionIndex + 1} options:`,
            question.options,
          );
        },
      );

      setParticipation(
        extracted,
      );

      setQuestions(
        extractedQuestions,
      );

      const remaining =
        getNumber(
          extracted.remainingDurationInSeconds,
        );

      if (remaining !== null) {
        setTimeRemaining(
          remaining,
        );
      } else {
        const firstSubject =
          extracted.subjects?.[0];

        const subjectRemaining =
          getNumber(
            firstSubject?.remainingDurationInSeconds,
          );

        const subjectDuration =
          getNumber(
            firstSubject?.durationInSeconds,
          );

        setTimeRemaining(
          subjectRemaining ??
            subjectDuration,
        );
      }

      /*
       * If the backend already says this participation
       * is paused, reflect that state immediately.
       */
      const status =
        extracted.status
          ?.toLowerCase()
          .trim();

      if (
        status === "paused" ||
        status === "pause"
      ) {
        setIsContestPaused(true);
      }

      setIsLoading(false);
    } catch (err) {
      console.error(
        "Failed to load contest session:",
        err,
      );

      setError(
        "Unable to load your contest session. Please return and start the contest again.",
      );

      setIsLoading(false);
    }
  }, [contestId]);

  /* ==========================================================
     SUBJECT ID
     ========================================================== */

  const subjectId = useMemo(() => {
    /*
     * Prefer the current question's subject when available.
     * Fall back to the first participation subject.
     */
    const currentQuestion =
      questions[currentQuestionIndex];

    return (
      currentQuestion?.subjectId ??
      getParticipationSubjectId(
        participation,
      )
    );
  }, [
    questions,
    currentQuestionIndex,
    participation,
  ]);

  /* ==========================================================
     CURRENT QUESTION
     ========================================================== */

  const currentQuestion =
    questions[
      currentQuestionIndex
    ];

  const currentQuestionId =
    currentQuestion
      ? getQuestionId(
          currentQuestion,
          currentQuestionIndex,
        )
      : null;

  const currentOptions =
    currentQuestion &&
    Array.isArray(
      currentQuestion.options,
    )
      ? currentQuestion.options
      : [];

  /* ==========================================================
     PAUSE CONTEST
     ========================================================== */

  const pauseContest = async () => {
    if (
      !contestId ||
      !subjectId ||
      isPausing ||
      isResuming ||
      isSubmitted ||
      isContestPaused
    ) {
      return;
    }

    try {
      setIsPausing(true);
      setPauseError(null);

      console.log(
        "Pausing Solve & Win contest:",
        {
          contestId,
          subjectId,
        },
      );

      const response =
        await pauseSolveAndWinContest(
          contestId,
          subjectId,
        );

      console.log(
        "Solve & Win contest paused successfully:",
        response,
      );

      setIsContestPaused(true);
    } catch (err) {
      console.error(
        "Failed to pause Solve & Win contest:",
        err,
      );

      setPauseError(
        getApiErrorMessage(
          err,
          "The contest could not be paused.",
        ),
      );
    } finally {
      setIsPausing(false);
    }
  };

  /* ==========================================================
     RESUME CONTEST
     ========================================================== */

  const resumeContest = async () => {
    if (
      !contestId ||
      !subjectId ||
      isResuming ||
      isPausing ||
      isSubmitted ||
      timeRemaining === 0
    ) {
      return;
    }

    try {
      setIsResuming(true);
      setPauseError(null);

      console.log(
        "Resuming Solve & Win contest:",
        {
          contestId,
          subjectId,
        },
      );

      const response =
        await resumeSolveAndWinContest(
          contestId,
          subjectId,
        );

      console.log(
        "Solve & Win contest resumed successfully:",
        response,
      );

      /*
       * If the backend returns updated participation
       * information, use its remaining duration.
       */
      const resumedParticipation =
        extractParticipation(
          response,
        );

      if (resumedParticipation) {
        setParticipation(
          resumedParticipation,
        );

        const resumedQuestions =
          extractQuestions(
            resumedParticipation,
          );

        if (resumedQuestions.length > 0) {
          setQuestions(
            resumedQuestions,
          );
        }

        const remaining =
          getNumber(
            resumedParticipation.remainingDurationInSeconds,
          );

        if (remaining !== null) {
          setTimeRemaining(
            remaining,
          );
        } else {
          const resumedSubject =
            resumedParticipation.subjects?.[0];

          const subjectRemaining =
            getNumber(
              resumedSubject?.remainingDurationInSeconds,
            );

          if (
            subjectRemaining !== null
          ) {
            setTimeRemaining(
              subjectRemaining,
            );
          }
        }
      }

      setIsContestPaused(false);
    } catch (err) {
      console.error(
        "Failed to resume Solve & Win contest:",
        err,
      );

      setPauseError(
        getApiErrorMessage(
          err,
          "The contest could not be resumed.",
        ),
      );
    } finally {
      setIsResuming(false);
    }
  };

  /* ==========================================================
     TIMER
     ========================================================== */

  useEffect(() => {
    if (
      timeRemaining === null ||
      isSubmitted ||
      isContestPaused
    ) {
      return;
    }

    if (timeRemaining <= 0) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setTimeRemaining(
          (previous) => {
            if (
              previous === null ||
              previous <= 1
            ) {
              return 0;
            }

            return previous - 1;
          },
        );
      }, 1000);

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, [
    timeRemaining,
    isSubmitted,
    isContestPaused,
  ]);

  /* ==========================================================
     AUTO PAUSE WHEN TIMER EXPIRES
     ========================================================== */

  useEffect(() => {
    if (
      timeRemaining !== 0 ||
      isSubmitted ||
      isContestPaused ||
      isPausing ||
      autoPauseTriggeredRef.current
    ) {
      return;
    }

    autoPauseTriggeredRef.current = true;

    void pauseContest();
  }, [
    timeRemaining,
    isSubmitted,
    isContestPaused,
    isPausing,
    contestId,
    subjectId,
  ]);

  /* ==========================================================
     PROGRESS
     ========================================================== */

  const answeredCount =
    Object.keys(
      answers,
    ).length;

  const progressPercentage =
    questions.length > 0
      ? Math.round(
          ((currentQuestionIndex + 1) /
            questions.length) *
            100,
        )
      : 0;

  const answeredPercentage =
    questions.length > 0
      ? Math.round(
          (answeredCount /
            questions.length) *
            100,
        )
      : 0;

  /* ==========================================================
     TIMER DISPLAY
     ========================================================== */

  const timerDisplay =
    useMemo(() => {
      if (
        timeRemaining === null
      ) {
        return "--:--";
      }

      const minutes =
        Math.floor(
          timeRemaining / 60,
        );

      const seconds =
        timeRemaining % 60;

      return `${String(
        minutes,
      ).padStart(
        2,
        "0",
      )}:${String(
        seconds,
      ).padStart(
        2,
        "0",
      )}`;
    }, [timeRemaining]);

  const timerCritical =
    timeRemaining !== null &&
    timeRemaining <= 60;

  /* ==========================================================
     SELECT ANSWER
     ========================================================== */

  const handleSelectAnswer = async (
    optionId: string,
  ) => {
    if (
      !currentQuestionId ||
      !contestId ||
      !subjectId ||
      isSubmitted ||
      isContestPaused ||
      timeRemaining === 0
    ) {
      return;
    }

    /*
     * Update local state immediately so the UI feels instant.
     */
    setAnswers(
      (previous) => ({
        ...previous,
        [currentQuestionId]:
          optionId,
      }),
    );

    setAnswerSaveError(null);
    setSavingQuestionId(
      currentQuestionId,
    );

    try {
      /*
       * The backend receives the answer for the
       * current question.
       */
      const response =
        await updateSolveAndWinContestQuestionAnswers(
          contestId,
          subjectId,
          {
            questionId:
              currentQuestionId,
            selectedOption:
              optionId,
          },
        );

      console.log(
        "Answer saved successfully:",
        response,
      );
    } catch (err) {
      console.error(
        "Failed to save answer:",
        err,
      );

      setAnswerSaveError(
        getApiErrorMessage(
          err,
          "Your answer could not be saved to the server. Your selection is still kept on this page.",
        ),
      );
    } finally {
      setSavingQuestionId(null);
    }
  };

  /* ==========================================================
     NAVIGATION
     ========================================================== */

  const goToPreviousQuestion = () => {
    if (
      isContestPaused ||
      timeRemaining === 0
    ) {
      return;
    }

    setCurrentQuestionIndex(
      (previous) =>
        Math.max(
          0,
          previous - 1,
        ),
    );
  };

  const goToNextQuestion = () => {
    if (
      isContestPaused ||
      timeRemaining === 0
    ) {
      return;
    }

    setCurrentQuestionIndex(
      (previous) =>
        Math.min(
          questions.length - 1,
          previous + 1,
        ),
    );
  };

  /* ==========================================================
     SUBMIT
     ========================================================== */

  const handleSubmit = async () => {
    if (
      !contestId ||
      !subjectId ||
      isSubmitting ||
      isSubmitted ||
      isContestPaused
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      console.log(
        "Submitting Solve & Win contest:",
        {
          contestId,
          subjectId,
          answers,
          participation,
        },
      );

      const response =
        await submitSolveAndWinContest(
          contestId,
          subjectId,
        );

      console.log(
        "Solve & Win contest submitted successfully:",
        response,
      );

      setIsSubmitted(true);

      /*
       * Keep the latest backend response available
       * in sessionStorage in case the results page
       * needs it.
       */
      try {
        sessionStorage.setItem(
          `solve-and-win-submit-${contestId}`,
          JSON.stringify(
            response,
          ),
        );
      } catch (storageError) {
        console.warn(
          "Could not save submission response to sessionStorage:",
          storageError,
        );
      }
    } catch (err) {
      console.error(
        "Failed to submit Solve & Win contest:",
        err,
      );

      setSubmitError(
        getApiErrorMessage(
          err,
          "Your contest could not be submitted. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==========================================================
     LOADING
     ========================================================== */

  if (isLoading) {
    return (
      <ContestBackground>
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

            <div className="p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
                <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
              </div>

              <h1 className="mt-6 text-2xl font-black text-white">
                Loading Contest
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Preparing your questions...
              </p>
            </div>
          </Card>
        </div>
      </ContestBackground>
    );
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (error) {
    return (
      <ContestBackground>
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
            <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />

            <div className="p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>

              <h1 className="mt-6 text-2xl font-black text-white">
                Unable to Load Contest
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {error}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href={`/student/solve-and-win/contests/${contestId}/start`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to Start
                </Link>

                <Link
                  href="/student/solve-and-win"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                >
                  Back to Contests
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </ContestBackground>
    );
  }

  /* ==========================================================
     NO QUESTIONS
     ========================================================== */

  if (
    !questions.length &&
    !isSubmitted
  ) {
    return (
      <ContestBackground>
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

            <div className="p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
                <AlertCircle className="h-8 w-8 text-amber-400" />
              </div>

              <h1 className="mt-6 text-2xl font-black text-white">
                No Questions Available
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                The contest session was created,
                but no questions were returned yet.
              </p>

              <p className="mt-4 text-xs text-slate-500">
                Check the browser console for the
                actual backend response.
              </p>

              <Link
                href={`/student/solve-and-win/contests/${contestId}/start`}
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Contest
              </Link>
            </div>
          </Card>
        </div>
      </ContestBackground>
    );
  }

  /* ==========================================================
     SUBMITTED
     ========================================================== */

  if (isSubmitted) {
    return (
      <ContestBackground>
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

            <div className="p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
                Contest Submitted
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
                Your answers have been recorded
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Your contest result will be processed
                by the competition system.
              </p>

              <Link
                href="/student/solve-and-win"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5"
              >
                <Trophy className="h-4 w-4" />
                Back to Solve & Win
              </Link>
            </div>
          </Card>
        </div>
      </ContestBackground>
    );
  }

  /* ==========================================================
     MAIN CBT
     ========================================================== */

  return (
    <ContestBackground>
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

        {/* ====================================================
            TOP HEADER
           ==================================================== */}

        <div className="mb-5 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-sm">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Brand */}

            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-600 shadow-lg shadow-blue-600/20">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />

                <Trophy className="relative h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-400">
                  Solve & Win
                </p>

                <h1 className="text-base font-black text-white">
                  Live Contest
                </h1>
              </div>
            </div>

            {/* Stats + Actions */}

            <div className="flex flex-wrap items-center justify-end gap-3">

              {/* Answered */}

              <div className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-right sm:block">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Answered
                </p>

                <p className="text-sm font-black text-white">
                  {answeredCount}

                  <span className="text-slate-500">
                    {" "}
                    / {questions.length}
                  </span>
                </p>
              </div>

              {/* Pause / Resume */}

              {!isContestPaused ? (
                <Button
                  type="button"
                  onClick={() => {
                    void pauseContest();
                  }}
                  disabled={
                    isPausing ||
                    isResuming ||
                    isSubmitting ||
                    timeRemaining === 0
                  }
                  className="h-10 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 text-xs font-black text-amber-300 hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPausing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Pausing...
                    </>
                  ) : (
                    <>
                      <PauseCircle className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    void resumeContest();
                  }}
                  disabled={
                    isResuming ||
                    isPausing ||
                    isSubmitting ||
                    timeRemaining === 0
                  }
                  className="h-10 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 text-xs font-black text-emerald-300 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isResuming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resuming...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Resume
                    </>
                  )}
                </Button>
              )}

              {/* Timer */}

              <div
                className={`relative flex items-center gap-2 overflow-hidden rounded-xl border px-4 py-2.5 shadow-sm ${
                  timerCritical
                    ? "border-red-400/30 bg-red-500/10 text-red-400"
                    : isContestPaused
                    ? "border-amber-400/30 bg-amber-500/10 text-amber-300"
                    : "border-cyan-400/25 bg-cyan-500/10 text-cyan-300"
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

                <Clock3 className="h-4 w-4" />

                <span className="font-mono text-sm font-black tracking-wider">
                  {timerDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Main progress */}

          <div className="h-1.5 bg-white/[0.04]">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* ====================================================
            PAUSE ERROR
           ==================================================== */}

        {pauseError && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <div>
                <p className="text-sm font-bold text-red-300">
                  Contest session update failed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-200/80">
                  {pauseError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            ANSWER SAVE ERROR
           ==================================================== */}

        {answerSaveError && (
          <div className="mb-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

              <div>
                <p className="text-sm font-bold text-amber-300">
                  Answer save warning
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-200/80">
                  {answerSaveError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            SUBMIT ERROR
           ==================================================== */}

        {submitError && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <div>
                <p className="text-sm font-bold text-red-300">
                  Submission failed
                </p>

                <p className="mt-1 text-xs leading-5 text-red-200/80">
                  {submitError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            PAUSED BANNER
           ==================================================== */}

        {isContestPaused &&
          timeRemaining !== 0 && (
            <div className="mb-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <PauseCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                  <div>
                    <p className="text-sm font-black text-amber-300">
                      Contest Paused
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-200/80">
                      Your contest is paused. Your timer
                      and question interactions will remain
                      stopped until you resume.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => {
                    void resumeContest();
                  }}
                  disabled={
                    isResuming ||
                    isPausing ||
                    timeRemaining === 0
                  }
                  className="h-10 shrink-0 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 text-xs font-black text-white shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isResuming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resuming...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Resume Contest
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

        {/* ====================================================
            QUESTION PROGRESS
           ==================================================== */}

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-500">
              Question{" "}
              <span className="font-black text-white">
                {currentQuestionIndex + 1}
              </span>
              {" "}of{" "}
              <span className="font-black text-white">
                {questions.length}
              </span>
            </div>

            <div className="text-xs font-black text-emerald-400">
              {progressPercentage}%
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* ====================================================
            CBT LAYOUT
           ==================================================== */}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* ==================================================
              QUESTION CARD
             ================================================== */}

          <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

            <div className="p-6 sm:p-9">

              {/* Question header */}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                      Question{" "}
                      {currentQuestionIndex + 1}
                    </span>
                  </div>

                  {currentQuestion?.instruction && (
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
                      {currentQuestion.instruction}
                    </p>
                  )}
                </div>

                {currentQuestion?.marks !==
                  undefined && (
                  <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-black text-slate-300">
                    {currentQuestion.marks}{" "}
                    {currentQuestion.marks === 1
                      ? "mark"
                      : "marks"}
                  </div>
                )}
              </div>

              {/* Question */}

              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <h2 className="max-w-4xl whitespace-pre-wrap text-xl font-extrabold leading-9 tracking-tight text-white sm:text-[1.4rem]">
                  {currentQuestion
                    ? getQuestionText(
                        currentQuestion,
                      )
                    : "Question unavailable"}
                </h2>
              </div>

              {/* Options */}

              <div className="mt-8 space-y-3">
                {currentOptions.map(
                  (
                    option,
                    optionIndex,
                  ) => {
                    const optionId =
                      getOptionId(
                        option,
                        optionIndex,
                      );

                    const optionLabel =
                      getOptionLabel(
                        option,
                        optionIndex,
                      );

                    const optionText =
                      getOptionText(
                        option,
                        optionIndex,
                      );

                    const selected =
                      currentQuestionId
                        ? answers[
                            currentQuestionId
                          ] === optionId
                        : false;

                    const savingThisAnswer =
                      currentQuestionId ===
                        currentQuestionId &&
                      savingQuestionId ===
                        currentQuestionId;

                    return (
                      <button
                        key={optionId}
                        type="button"
                        onClick={() => {
                          void handleSelectAnswer(
                            optionId,
                          );
                        }}
                        disabled={
                          isSubmitted ||
                          isContestPaused ||
                          timeRemaining === 0 ||
                          isPausing ||
                          isResuming
                        }
                        className={`group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${
                          selected
                            ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/10"
                            : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-white/[0.05] hover:shadow-lg"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <span
                          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition-all ${
                            selected
                              ? "border-blue-400/40 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20"
                              : "border-white/10 bg-white/[0.04] text-slate-300 group-hover:border-blue-400/30 group-hover:bg-blue-500/10 group-hover:text-blue-300"
                          }`}
                        >
                          {optionLabel}
                        </span>

                        <span
                          className={`relative pt-1.5 whitespace-pre-wrap text-[15px] font-semibold leading-7 sm:text-base ${
                            selected
                              ? "text-white"
                              : "text-slate-200"
                          }`}
                        >
                          {optionText}
                        </span>

                        {selected && (
                          <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
                            {savingThisAnswer ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              {/* Navigation */}

              <div className="mt-9 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    goToPreviousQuestion
                  }
                  disabled={
                    currentQuestionIndex ===
                      0 ||
                    isContestPaused ||
                    timeRemaining === 0
                  }
                  className="h-11 rounded-xl border-white/10 bg-white/[0.03] px-5 font-bold text-slate-300 shadow-sm hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentQuestionIndex <
                questions.length - 1 ? (
                  <Button
                    type="button"
                    onClick={
                      goToNextQuestion
                    }
                    disabled={
                      isContestPaused ||
                      timeRemaining === 0
                    }
                    className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-7 font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={
                      handleSubmit
                    }
                    disabled={
                      isSubmitting ||
                      isContestPaused ||
                      timeRemaining === 0
                    }
                    className="h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Flag className="mr-2 h-4 w-4" />
                        Submit Contest
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Timer expired notice */}

              {timeRemaining === 0 && (
                <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                    <div>
                      <p className="text-sm font-bold text-red-300">
                        Contest time has expired
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-200/80">
                        Your contest session has been
                        paused. Your answers already saved
                        to the backend remain associated
                        with your participation.
                      </p>

                      {isPausing && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-200">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Updating contest session...
                        </div>
                      )}

                      {pauseError && (
                        <p className="mt-3 text-xs font-semibold text-red-200">
                          {pauseError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* ==================================================
              SIDEBAR
             ================================================== */}

          <div className="lg:sticky lg:top-5 lg:self-start">

            {/* Question navigator */}

            <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Questions
                    </p>

                    <p className="mt-1 text-sm font-black text-white">
                      {answeredCount}{" "}
                      <span className="font-semibold text-slate-500">
                        answered
                      </span>
                    </p>
                  </div>

                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-blue-500/10">
                    <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

                    <span className="relative text-xs font-black text-blue-300">
                      {questions.length}
                    </span>
                  </div>
                </div>

                {/* Completion */}

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">
                      Completion
                    </span>

                    <span className="text-emerald-400">
                      {answeredPercentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
                      style={{
                        width: `${answeredPercentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Navigator */}

                <div className="mt-5 grid grid-cols-5 gap-2">
                  {questions.map(
                    (
                      question,
                      index,
                    ) => {
                      const questionId =
                        getQuestionId(
                          question,
                          index,
                        );

                      const answered =
                        Boolean(
                          answers[
                            questionId
                          ],
                        );

                      const active =
                        index ===
                        currentQuestionIndex;

                      return (
                        <button
                          key={questionId}
                          type="button"
                          onClick={() =>
                            setCurrentQuestionIndex(
                              index,
                            )
                          }
                          disabled={
                            isContestPaused ||
                            timeRemaining ===
                              0
                          }
                          className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border text-xs font-black transition-all ${
                            active
                              ? "border-blue-400/40 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/10"
                              : answered
                              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                              : "border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20 hover:bg-white/[0.05] hover:text-slate-300"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {active && (
                            <span className="absolute inset-x-0 top-0 h-px bg-white/70" />
                          )}

                          {index + 1}
                        </button>
                      );
                    },
                  )}
                </div>

                {/* Legend */}

                <div className="mt-5 space-y-2 border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-3 w-3 rounded bg-gradient-to-br from-blue-500 to-cyan-500" />
                    Current
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-3 w-3 rounded border border-emerald-400/20 bg-emerald-500/10" />
                    Answered
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-3 w-3 rounded border border-white/10 bg-white/[0.03]" />
                    Unanswered
                  </div>
                </div>
              </div>
            </Card>

            {/* Contest session */}

            <Card className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />

              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-500/10">
                    <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

                    <Trophy className="relative h-4 w-4 text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      Contest Session
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-slate-300">
                      {isContestPaused
                        ? "Paused participation"
                        : "Live participation"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Questions
                    </span>

                    <span className="text-xs font-black text-white">
                      {questions.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Answered
                    </span>

                    <span className="text-xs font-black text-emerald-400">
                      {answeredCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Remaining
                    </span>

                    <span className="text-xs font-black text-cyan-400">
                      {Math.max(
                        0,
                        questions.length -
                          answeredCount,
                      )}
                    </span>
                  </div>

                  {subjectId && (
                    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                      <span className="text-xs text-slate-500">
                        Subject
                      </span>

                      <span className="max-w-[150px] truncate text-right text-[10px] font-bold text-slate-500">
                        {subjectId}
                      </span>
                    </div>
                  )}

                  {isContestPaused && (
                    <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                        Session Paused
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ContestBackground>
  );
}


