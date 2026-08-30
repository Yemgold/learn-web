






// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import {
//   AlertCircle,
//   ArrowLeft,
//   CheckCircle2,
//   ChevronRight,
//   Clock3,
//   FileQuestion,
//   Trophy,
//   User,
//   XCircle,
// } from "lucide-react";

// /* ============================================================
//    TYPES
//    ============================================================ */

// interface ParticipantAnswer {
//   id: string;
//   questionNumber: number;
//   question: string;
//   selectedAnswer: string;
//   correctAnswer: string;
//   isCorrect: boolean;
//   marks: number;
//   awardedMarks: number;
// }

// interface ParticipantResult {
//   participantId: string;
//   studentName: string;
//   studentEmail: string;

//   rank: number;

//   score: number;
//   totalMarks: number;
//   percentage: number;

//   answeredQuestions: number;
//   unansweredQuestions: number;
//   totalQuestions: number;

//   correctAnswers: number;
//   incorrectAnswers: number;

//   timeTaken: number;

//   status:
//     | "COMPLETED"
//     | "IN_PROGRESS"
//     | "NOT_STARTED";

//   answers: ParticipantAnswer[];
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function ParticipantResultPage() {
//   const params = useParams();

//   const rawCompetitionId =
//     params.nationalcompetitionid;

//   const rawParticipantId =
//     params.participantid;

//   const competitionId =
//     Array.isArray(rawCompetitionId)
//       ? rawCompetitionId[0]
//       : rawCompetitionId;

//   const participantId =
//     Array.isArray(rawParticipantId)
//       ? rawParticipantId[0]
//       : rawParticipantId;

//   /* ==========================================================
//      TEMPORARY DATA
//      ========================================================== */

//   /*
//    * The National Competition participant-result API
//    * is not available yet.
//    *
//    * Keep this page UI-only until the backend endpoint
//    * is available.
//    */

//   const participant: ParticipantResult | null =
//     null;

//   /* ==========================================================
//      FORMAT TIME
//      ========================================================== */

//   const formatTime = (
//     seconds: number,
//   ) => {
//     const minutes = Math.floor(
//       seconds / 60,
//     );

//     const remainingSeconds =
//       seconds % 60;

//     return `${minutes}m ${String(
//       remainingSeconds,
//     ).padStart(2, "0")}s`;
//   };

//   /* ==========================================================
//      ROUTE VALIDATION
//      ========================================================== */

//   if (
//     !competitionId ||
//     !participantId
//   ) {
//     return (
//       <ErrorState message="Competition ID or participant ID is missing." />
//     );
//   }

//   /* ==========================================================
//      EMPTY / API NOT CONNECTED
//      ========================================================== */

//   if (!participant) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

//         <div className="mx-auto max-w-6xl">

//           {/* ==================================================
//               BREADCRUMB
//           ================================================== */}

//           <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

//             <Link
//               href="/admin"
//               className="hover:text-gray-900 dark:hover:text-white"
//             >
//               Admin
//             </Link>

//             <ChevronRight className="h-4 w-4" />

//             <span>Secondary</span>

//             <ChevronRight className="h-4 w-4" />

//             <Link
//               href="/admin/secondary/nationalcompetitions"
//               className="hover:text-gray-900 dark:hover:text-white"
//             >
//               National Competitions
//             </Link>

//             <ChevronRight className="h-4 w-4" />

//             <Link
//               href={`/admin/secondary/nationalcompetitions/${competitionId}`}
//               className="hover:text-gray-900 dark:hover:text-white"
//             >
//               Competition
//             </Link>

//             <ChevronRight className="h-4 w-4" />

//             <Link
//               href={`/admin/secondary/nationalcompetitions/${competitionId}/results`}
//               className="hover:text-gray-900 dark:hover:text-white"
//             >
//               Results
//             </Link>

//             <ChevronRight className="h-4 w-4" />

//             <span className="font-medium text-gray-900 dark:text-white">
//               Participant
//             </span>

//           </div>

//           {/* ==================================================
//               BACK
//           ================================================== */}

//           <Link
//             href={`/admin/secondary/nationalcompetitions/${competitionId}/results`}
//             className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Results
//           </Link>

//           {/* ==================================================
//               HEADER
//           ================================================== */}

//           <div className="mb-8">

//             <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
//               <User className="h-6 w-6" />
//             </div>

//             <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
//               Participant Result
//             </h1>

//             <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
//               View the detailed performance and answers
//               submitted by this participant.
//             </p>

//           </div>

//           {/* ==================================================
//               NOTICE
//           ================================================== */}

//           <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">

//             <div className="flex items-start gap-3">

//               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />

//               <div>

//                 <h2 className="font-semibold text-amber-900 dark:text-amber-300">
//                   Participant results API not connected
//                 </h2>

//                 <p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-400">
//                   The participant ID is available from the
//                   route, but the backend endpoint that returns
//                   the participant's competition result has not
//                   been connected yet.
//                 </p>

//                 <p className="mt-3 text-xs font-medium text-amber-700 dark:text-amber-500">
//                   Participant ID: {participantId}
//                 </p>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>
//     );
//   }

//   /* ==========================================================
//      RESULT VIEW
//      ========================================================== */

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

//       <div className="mx-auto max-w-6xl">

//         {/* ==================================================
//             BREADCRUMB
//         ================================================== */}

//         <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

//           <Link
//             href="/admin"
//             className="hover:text-gray-900 dark:hover:text-white"
//           >
//             Admin
//           </Link>

//           <ChevronRight className="h-4 w-4" />

//           <span>Secondary</span>

//           <ChevronRight className="h-4 w-4" />

//           <Link
//             href="/admin/secondary/nationalcompetitions"
//             className="hover:text-gray-900 dark:hover:text-white"
//           >
//             National Competitions
//           </Link>

//           <ChevronRight className="h-4 w-4" />

//           <Link
//             href={`/admin/secondary/nationalcompetitions/${competitionId}`}
//             className="hover:text-gray-900 dark:hover:text-white"
//           >
//             Competition
//           </Link>

//           <ChevronRight className="h-4 w-4" />

//           <Link
//             href={`/admin/secondary/nationalcompetitions/${competitionId}/results`}
//             className="hover:text-gray-900 dark:hover:text-white"
//           >
//             Results
//           </Link>

//           <ChevronRight className="h-4 w-4" />

//           <span className="font-medium text-gray-900 dark:text-white">
//             {participant.studentName}
//           </span>

//         </div>

//         {/* ==================================================
//             BACK
//         ================================================== */}

//         <Link
//           href={`/admin/secondary/nationalcompetitions/${competitionId}/results`}
//           className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Results
//         </Link>

//         {/* ==================================================
//             PARTICIPANT HEADER
//         ================================================== */}

//         <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

//           <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

//             <div className="flex items-center gap-4">

//               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
//                 <User className="h-6 w-6" />
//               </div>

//               <div>

//                 <h1 className="text-xl font-bold text-gray-900 dark:text-white">
//                   {participant.studentName}
//                 </h1>

//                 <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                   {participant.studentEmail}
//                 </p>

//               </div>

//             </div>

//             <StatusBadge
//               status={participant.status}
//             />

//           </div>

//         </div>

//         {/* ==================================================
//             PERFORMANCE CARDS
//         ================================================== */}

//         <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

//           <PerformanceCard
//             icon={
//               <Trophy className="h-5 w-5" />
//             }
//             label="Rank"
//             value={`#${participant.rank}`}
//           />

//           <PerformanceCard
//             icon={
//               <CheckCircle2 className="h-5 w-5" />
//             }
//             label="Score"
//             value={`${participant.score}/${participant.totalMarks}`}
//           />

//           <PerformanceCard
//             icon={
//               <FileQuestion className="h-5 w-5" />
//             }
//             label="Percentage"
//             value={`${participant.percentage}%`}
//           />

//           <PerformanceCard
//             icon={
//               <Clock3 className="h-5 w-5" />
//             }
//             label="Time Taken"
//             value={formatTime(
//               participant.timeTaken,
//             )}
//           />

//         </div>

//         {/* ==================================================
//             QUESTION SUMMARY
//         ================================================== */}

//         <div className="mb-6 grid gap-4 sm:grid-cols-3">

//           <SummaryCard
//             label="Correct"
//             value={
//               participant.correctAnswers
//             }
//             icon={
//               <CheckCircle2 className="h-5 w-5" />
//             }
//           />

//           <SummaryCard
//             label="Incorrect"
//             value={
//               participant.incorrectAnswers
//             }
//             icon={
//               <XCircle className="h-5 w-5" />
//             }
//           />

//           <SummaryCard
//             label="Unanswered"
//             value={
//               participant.unansweredQuestions
//             }
//             icon={
//               <FileQuestion className="h-5 w-5" />
//             }
//           />

//         </div>

//         {/* ==================================================
//             ANSWERS
//         ================================================== */}

//         <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

//           <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">

//             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//               Question Review
//             </h2>

//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               Review the answers submitted by the participant.
//             </p>

//           </div>

//           <div className="divide-y divide-gray-200 dark:divide-gray-800">

//             {participant.answers.map(
//               (answer) => (
//                 <div
//                   key={answer.id}
//                   className="p-6"
//                 >

//                   {/* QUESTION HEADER */}

//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

//                     <div className="flex gap-3">

//                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
//                         {answer.questionNumber}
//                       </div>

//                       <p className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
//                         {answer.question}
//                       </p>

//                     </div>

//                     {answer.isCorrect ? (
//                       <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">
//                         <CheckCircle2 className="h-3.5 w-3.5" />
//                         Correct
//                       </span>
//                     ) : (
//                       <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">
//                         <XCircle className="h-3.5 w-3.5" />
//                         Incorrect
//                       </span>
//                     )}

//                   </div>

//                   {/* ANSWERS */}

//                   <div className="mt-5 grid gap-3 sm:grid-cols-2">

//                     <AnswerBox
//                       label="Participant Answer"
//                       value={
//                         answer.selectedAnswer ||
//                         "Not answered"
//                       }
//                       correct={
//                         answer.isCorrect
//                       }
//                     />

//                     <AnswerBox
//                       label="Correct Answer"
//                       value={
//                         answer.correctAnswer
//                       }
//                       correct
//                     />

//                   </div>

//                   {/* MARKS */}

//                   <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">

//                     Marks awarded:{" "}

//                     <span className="font-semibold text-gray-700 dark:text-gray-300">
//                       {
//                         answer.awardedMarks
//                       }
//                       /
//                       {answer.marks}
//                     </span>

//                   </div>

//                 </div>
//               ),
//             )}

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// /* ============================================================
//    PERFORMANCE CARD
//    ============================================================ */

// function PerformanceCard({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

//       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
//         {icon}
//       </div>

//       <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
//         {label}
//       </p>

//       <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
//         {value}
//       </p>

//     </div>
//   );
// }

// /* ============================================================
//    SUMMARY CARD
//    ============================================================ */

// function SummaryCard({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: number;
// }) {
//   return (
//     <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

//       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
//         {icon}
//       </div>

//       <div>

//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           {label}
//         </p>

//         <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
//           {value}
//         </p>

//       </div>

//     </div>
//   );
// }

// /* ============================================================
//    ANSWER BOX
//    ============================================================ */

// function AnswerBox({
//   label,
//   value,
//   correct,
// }: {
//   label: string;
//   value: string;
//   correct: boolean;
// }) {
//   return (
//     <div
//       className={`rounded-lg border p-4 ${
//         correct
//           ? "border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20"
//           : "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20"
//       }`}
//     >

//       <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
//         {label}
//       </p>

//       <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
//         {value}
//       </p>

//     </div>
//   );
// }

// /* ============================================================
//    STATUS BADGE
//    ============================================================ */

// function StatusBadge({
//   status,
// }: {
//   status:
//     | "COMPLETED"
//     | "IN_PROGRESS"
//     | "NOT_STARTED";
// }) {
//   const config = {
//     COMPLETED: {
//       label: "Completed",
//       className:
//         "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
//     },

//     IN_PROGRESS: {
//       label: "In Progress",
//       className:
//         "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
//     },

//     NOT_STARTED: {
//       label: "Not Started",
//       className:
//         "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
//     },
//   };

//   const item =
//     config[status];

//   return (
//     <span
//       className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${item.className}`}
//     >
//       {item.label}
//     </span>
//   );
// }

// /* ============================================================
//    ERROR STATE
//    ============================================================ */

// function ErrorState({
//   message,
// }: {
//   message: string;
// }) {
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

//       <div className="mx-auto max-w-3xl">

//         <Link
//           href="/admin/secondary/nationalcompetitions"
//           className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Competitions
//         </Link>

//         <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900/50 dark:bg-gray-900">

//           <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">

//             <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />

//           </div>

//           <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
//             Invalid route
//           </h1>

//           <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
//             {message}
//           </p>

//           <Link
//             href="/admin/secondary/nationalcompetitions"
//             className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900"
//           >
//             Back to Competitions
//           </Link>

//         </div>

//       </div>

//     </div>
//   );
// }





export default function CreateCompetitionPage() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">
        Create Competition
      </h1>

      <p className="mt-2 text-slate-600">
        Competition creation page.
      </p>
    </main>
  );
}