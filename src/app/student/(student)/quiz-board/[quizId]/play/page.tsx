// "use client";

// import {
//   AlertCircle,
//   ArrowLeft,
//   CheckCircle2,
//   Clock3,
//   Loader2,
//   Radio,
//   RefreshCw,
//   Trophy,
//   Users,
//   Wifi,
//   WifiOff,
//   XCircle,
// } from "lucide-react";
// import {
//   useCallback,
//   useEffect,
//   useMemo,
// } from "react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";

// import { useQuizGame } from "@/hooks/quiz-board/useQuizGame";

// import type {
//   QuizGameOption,
//   QuizGameParticipant,
//   QuizLeaderboardEntry,
// } from "@/lib/quiz-board/shared/quizGameTypes";

// /* ============================================================
//    TYPES
//    ============================================================ */

// type Params = {
//   quizId: string;
// };

// /* ============================================================
//    SAFE DISPLAY HELPERS
//    ============================================================ */

// function getParticipantName(
//   participant: QuizGameParticipant,
// ): string {
//   return (
//     participant.username ||
//     participant.name ||
//     "Participant"
//   );
// }

// function getParticipantId(
//   participant: QuizGameParticipant,
// ): string {
//   return (
//     participant.userId ||
//     getParticipantName(participant)
//   );
// }

// function getLeaderboardName(
//   entry: QuizLeaderboardEntry,
// ): string {
//   return (
//     entry.username ||
//     entry.name ||
//     "Participant"
//   );
// }

// function getLeaderboardId(
//   entry: QuizLeaderboardEntry,
// ): string {
//   return (
//     entry.userId ||
//     entry.participantId ||
//     getLeaderboardName(entry)
//   );
// }

// function getOptionValue(
//   option: QuizGameOption,
// ): string {
//   return (
//     option.value ||
//     option.label ||
//     ""
//   );
// }

// function getOptionLabel(
//   option: QuizGameOption,
// ): string {
//   return (
//     option.label ||
//     option.value ||
//     ""
//   );
// }

// function formatSeconds(
//   seconds: number,
// ): string {
//   const safeSeconds = Math.max(
//     0,
//     Math.floor(seconds),
//   );

//   const minutes = Math.floor(
//     safeSeconds / 60,
//   );

//   const remainingSeconds =
//     safeSeconds % 60;

//   return `${String(minutes).padStart(
//     2,
//     "0",
//   )}:${String(
//     remainingSeconds,
//   ).padStart(2, "0")}`;
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function QuizGamePlayPage() {
//   const params = useParams<Params>();
//   const router = useRouter();

//   const quizId =
//     typeof params?.quizId === "string"
//       ? params.quizId
//       : "";

//   const game = useQuizGame({
//     quizId,
//     role: "CONTESTANT",
//     autoJoin: true,
//   });

//   const {
//     state,
//     connected,
//     roomJoined,
//     roomActivated,
//     currentRound,
//     currentQuestion,
//     currentQuestionData,
//     participants,
//     leaderboard,
//     questionStarted,
//     questionLocked,
//     selectedAnswer,
//     answerSubmitted,
//     actionLoading,
//     loading,
//     error,
//     canAnswer,
//     clearError,
//     refreshRoom,
//     submitAnswer,
//   } = game;

//   /* ==========================================================
//      CURRENT QUESTION
//      ========================================================== */

//   const question =
//     currentQuestionData ??
//     currentQuestion?.question ??
//     null;

//   const options = useMemo(
//     () =>
//       question?.options ?? [],
//     [question],
//   );

//   const questionNumber =
//     currentQuestion?.questionNumber ??
//     null;

//   const roundNumber =
//     currentQuestion?.roundNumber ??
//     currentRound ??
//     null;

//   const timeLimit =
//     currentQuestion?.timeLimit ?? 0;

//   const remainingSeconds =
//     currentQuestion?.timer
//       ?.remainingSeconds ?? 0;

//   const hasQuestion =
//     question !== null;

//   const timerRunning =
//     questionStarted &&
//     !questionLocked &&
//     remainingSeconds > 0;

//   const waitingForRoom =
//     !roomJoined ||
//     !roomActivated;

//   const waitingForQuestion =
//     roomJoined &&
//     roomActivated &&
//     !hasQuestion;

//   /*
//    * Keep state referenced so TypeScript does not
//    * complain about an unused destructured value
//    * if the shared state grows later.
//    */
//   void state;

//   /* ==========================================================
//      ERROR AUTO CLEAR
//      ========================================================== */

//   useEffect(() => {
//     if (!error) {
//       return;
//     }

//     const timeout =
//       window.setTimeout(() => {
//         clearError();
//       }, 6000);

//     return () => {
//       window.clearTimeout(timeout);
//     };
//   }, [error, clearError]);

//   /* ==========================================================
//      ANSWER
//      ========================================================== */

//   const handleAnswer = useCallback(
//     (answer: string) => {
//       if (!canAnswer) {
//         return;
//       }

//       if (answerSubmitted) {
//         return;
//       }

//       if (questionLocked) {
//         return;
//       }

//       submitAnswer(answer);
//     },
//     [
//       canAnswer,
//       answerSubmitted,
//       questionLocked,
//       submitAnswer,
//     ],
//   );

//   /* ==========================================================
//      BACK
//      ========================================================== */

//   const handleBack = useCallback(() => {
//     router.push(
//       "/student/quiz-board",
//     );
//   }, [router]);

//   /* ==========================================================
//      INVALID QUIZ
//      ========================================================== */

//   if (!quizId) {
//     return (
//       <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
//         <div className="mx-auto max-w-3xl">
//           <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="mt-0.5 h-5 w-5 text-red-400" />

//               <div>
//                 <h1 className="font-semibold">
//                   Unable to load quiz
//                 </h1>

//                 <p className="mt-1 text-sm text-slate-400">
//                   No quiz competition ID was
//                   provided.
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleBack}
//               className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Quiz Board
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      PAGE
//      ========================================================== */

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       {/* ======================================================
//           HEADER
//          ====================================================== */}

//       <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur">
//         <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
//           <div className="flex min-w-0 items-center gap-3">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
//               aria-label="Back to Quiz Board"
//             >
//               <ArrowLeft className="h-4 w-4" />
//             </button>

//             <div className="min-w-0">
//               <p className="truncate text-sm font-semibold text-white">
//                 Quiz Competition
//               </p>

//               <p className="truncate text-xs text-slate-500">
//                 {quizId}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <div
//               className={[
//                 "hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs sm:flex",
//                 connected
//                   ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
//                   : "border-red-400/20 bg-red-400/10 text-red-300",
//               ].join(" ")}
//             >
//               {connected ? (
//                 <Wifi className="h-3.5 w-3.5" />
//               ) : (
//                 <WifiOff className="h-3.5 w-3.5" />
//               )}

//               {connected
//                 ? "Connected"
//                 : "Disconnected"}
//             </div>

//             <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
//               <Users className="h-3.5 w-3.5" />
//               {participants.length}
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
//         {/* ====================================================
//             ERROR
//            ==================================================== */}

//         {error && (
//           <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

//               <div>
//                 <p className="text-sm font-medium text-red-200">
//                   Quiz error
//                 </p>

//                 <p className="mt-1 text-sm text-red-300/80">
//                   {error}
//                 </p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={clearError}
//               className="rounded-md p-1 text-red-300 transition hover:bg-red-400/10"
//               aria-label="Dismiss error"
//             >
//               <XCircle className="h-4 w-4" />
//             </button>
//           </div>
//         )}

//         {/* ====================================================
//             TOP STATUS
//            ==================================================== */}

//         <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           <StatusCard
//             icon={
//               connected ? (
//                 <Wifi className="h-4 w-4" />
//               ) : (
//                 <WifiOff className="h-4 w-4" />
//               )
//             }
//             label="Connection"
//             value={
//               connected
//                 ? "Live"
//                 : "Offline"
//             }
//             valueClassName={
//               connected
//                 ? "text-emerald-300"
//                 : "text-red-300"
//             }
//           />

//           <StatusCard
//             icon={
//               <Users className="h-4 w-4" />
//             }
//             label="Players"
//             value={String(
//               participants.length,
//             )}
//           />

//           <StatusCard
//             icon={
//               <Radio className="h-4 w-4" />
//             }
//             label="Round"
//             value={
//               roundNumber !== null
//                 ? String(roundNumber)
//                 : "—"
//             }
//           />

//           <StatusCard
//             icon={
//               <Trophy className="h-4 w-4" />
//             }
//             label="Leaderboard"
//             value={String(
//               leaderboard.length,
//             )}
//           />
//         </section>

//         {/* ====================================================
//             WAITING FOR ROOM
//            ==================================================== */}

//         {waitingForRoom && (
//           <WaitingRoom
//             connected={connected}
//             roomJoined={roomJoined}
//             roomActivated={roomActivated}
//             loading={loading}
//             onRefresh={refreshRoom}
//           />
//         )}

//         {/* ====================================================
//             ACTIVE GAME
//            ==================================================== */}

//         {!waitingForRoom && (
//           <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
//             {/* ================================================
//                 QUESTION
//                ================================================ */}

//             <section className="min-w-0">
//               <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//                 <div>
//                   <div className="flex flex-wrap items-center gap-2">
//                     <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
//                       Round{" "}
//                       {roundNumber ?? "—"}
//                     </span>

//                     {questionNumber !==
//                       null && (
//                       <span className="text-sm text-slate-500">
//                         Question{" "}
//                         {questionNumber}
//                       </span>
//                     )}
//                   </div>

//                   <h1 className="mt-2 text-xl font-bold sm:text-2xl">
//                     {hasQuestion
//                       ? "Answer the Question"
//                       : "Waiting for the next question"}
//                   </h1>
//                 </div>

//                 {hasQuestion && (
//                   <div
//                     className={[
//                       "flex items-center gap-2 rounded-xl border px-4 py-2",
//                       timerRunning
//                         ? "border-cyan-400/20 bg-cyan-400/10"
//                         : "border-white/10 bg-white/5",
//                     ].join(" ")}
//                   >
//                     <Clock3
//                       className={[
//                         "h-4 w-4",
//                         timerRunning
//                           ? "text-cyan-300"
//                           : "text-slate-500",
//                       ].join(" ")}
//                     />

//                     <span
//                       className={[
//                         "font-mono text-lg font-bold",
//                         timerRunning
//                           ? "text-cyan-300"
//                           : "text-slate-400",
//                       ].join(" ")}
//                     >
//                       {formatSeconds(
//                         remainingSeconds,
//                       )}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {hasQuestion ? (
//                 <QuestionCard
//                   question={
//                     question?.question ??
//                     ""
//                   }
//                   options={options}
//                   selectedAnswer={
//                     selectedAnswer
//                   }
//                   answerSubmitted={
//                     answerSubmitted
//                   }
//                   questionStarted={
//                     questionStarted
//                   }
//                   questionLocked={
//                     questionLocked
//                   }
//                   canAnswer={
//                     canAnswer
//                   }
//                   actionLoading={
//                     actionLoading
//                   }
//                   onAnswer={
//                     handleAnswer
//                   }
//                 />
//               ) : (
//                 <WaitingQuestion
//                   loading={
//                     loading ||
//                     waitingForQuestion
//                   }
//                   onRefresh={
//                     refreshRoom
//                   }
//                 />
//               )}

//               {hasQuestion &&
//                 timeLimit > 0 && (
//                   <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-slate-500">
//                     <span>
//                       Time limit
//                     </span>

//                     <span className="font-medium text-slate-300">
//                       {formatSeconds(
//                         timeLimit,
//                       )}
//                     </span>
//                   </div>
//                 )}
//             </section>

//             {/* ================================================
//                 SIDEBAR
//                ================================================ */}

//             <aside className="space-y-5">
//               <LeaderboardPanel
//                 leaderboard={
//                   leaderboard
//                 }
//               />

//               <ParticipantsPanel
//                 participants={
//                   participants
//                 }
//               />
//             </aside>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// /* ============================================================
//    STATUS CARD
//    ============================================================ */

// function StatusCard({
//   icon,
//   label,
//   value,
//   valueClassName,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   valueClassName?: string;
// }) {
//   return (
//     <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
//       <div className="flex items-center gap-2 text-xs text-slate-500">
//         {icon}
//         {label}
//       </div>

//       <p
//         className={[
//           "mt-2 text-lg font-bold",
//           valueClassName ??
//             "text-white",
//         ].join(" ")}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// /* ============================================================
//    WAITING ROOM
//    ============================================================ */

// function WaitingRoom({
//   connected,
//   roomJoined,
//   roomActivated,
//   loading,
//   onRefresh,
// }: {
//   connected: boolean;
//   roomJoined: boolean;
//   roomActivated: boolean;
//   loading: boolean;
//   onRefresh: () => void;
// }) {
//   const message = !connected
//     ? "Connecting to the quiz server..."
//     : !roomJoined
//       ? "Joining the quiz room..."
//       : !roomActivated
//         ? "Waiting for the host to activate the room..."
//         : "Preparing the quiz...";

//   return (
//     <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
//       <div className="mx-auto flex max-w-lg flex-col items-center text-center">
//         <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
//           {loading || !connected ? (
//             <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
//           ) : (
//             <Radio className="h-6 w-6 text-cyan-300" />
//           )}
//         </div>

//         <h2 className="mt-5 text-lg font-bold">
//           {message}
//         </h2>

//         <p className="mt-2 text-sm leading-6 text-slate-500">
//           Stay on this page. The quiz will
//           appear when the room is ready.
//         </p>

//         <button
//           type="button"
//           onClick={onRefresh}
//           disabled={loading}
//           className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Refresh
//         </button>

//         <div className="mt-5 grid w-full gap-2 sm:grid-cols-3">
//           <RoomStep
//             label="Connection"
//             complete={connected}
//           />

//           <RoomStep
//             label="Joined"
//             complete={roomJoined}
//           />

//           <RoomStep
//             label="Activated"
//             complete={roomActivated}
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

// function RoomStep({
//   label,
//   complete,
// }: {
//   label: string;
//   complete: boolean;
// }) {
//   return (
//     <div className="rounded-lg border border-white/10 bg-black/10 px-3 py-2">
//       <div className="flex items-center gap-2">
//         {complete ? (
//           <CheckCircle2 className="h-4 w-4 text-emerald-400" />
//         ) : (
//           <div className="h-4 w-4 rounded-full border border-slate-600" />
//         )}

//         <span
//           className={
//             complete
//               ? "text-xs text-emerald-300"
//               : "text-xs text-slate-500"
//           }
//         >
//           {label}
//         </span>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    WAITING QUESTION
//    ============================================================ */

// function WaitingQuestion({
//   loading,
//   onRefresh,
// }: {
//   loading: boolean;
//   onRefresh: () => void;
// }) {
//   return (
//     <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
//       <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
//         <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
//           {loading ? (
//             <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
//           ) : (
//             <Clock3 className="h-6 w-6 text-slate-500" />
//           )}
//         </div>

//         <h2 className="mt-5 text-lg font-semibold">
//           Waiting for the host
//         </h2>

//         <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
//           The next question will appear
//           when the host starts it.
//         </p>

//         <button
//           type="button"
//           onClick={onRefresh}
//           disabled={loading}
//           className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
//         >
//           <RefreshCw className="h-4 w-4" />
//           Refresh
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    QUESTION CARD
//    ============================================================ */

// function QuestionCard({
//   question,
//   options,
//   selectedAnswer,
//   answerSubmitted,
//   questionStarted,
//   questionLocked,
//   canAnswer,
//   actionLoading,
//   onAnswer,
// }: {
//   question: string;
//   options: QuizGameOption[];
//   selectedAnswer: string | null;
//   answerSubmitted: boolean;
//   questionStarted: boolean;
//   questionLocked: boolean;
//   canAnswer: boolean;
//   actionLoading: boolean;
//   onAnswer: (answer: string) => void;
// }) {
//   return (
//     <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
//       {/* Question status */}
//       <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
//         <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
//           <span className="relative flex h-2 w-2">
//             {questionStarted &&
//               !questionLocked && (
//                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
//               )}

//             <span
//               className={[
//                 "relative inline-flex h-2 w-2 rounded-full",
//                 questionLocked
//                   ? "bg-amber-400"
//                   : questionStarted
//                     ? "bg-emerald-400"
//                     : "bg-slate-600",
//               ].join(" ")}
//             />
//           </span>

//           {questionLocked
//             ? "Question locked"
//             : questionStarted
//               ? "Question live"
//               : "Question ready"}
//         </div>

//         {answerSubmitted && (
//           <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
//             <CheckCircle2 className="h-3.5 w-3.5" />
//             Answer submitted
//           </span>
//         )}
//       </div>

//       {/* Question */}
//       <div className="p-5 sm:p-7">
//         <h2 className="text-lg font-semibold leading-8 text-white sm:text-xl">
//           {question}
//         </h2>

//         {/* Options */}
//         <div className="mt-7 grid gap-3">
//           {options.length > 0 ? (
//             options.map(
//               (
//                 option,
//                 index,
//               ) => {
//                 const value =
//                   getOptionValue(
//                     option,
//                   );

//                 const label =
//                   getOptionLabel(
//                     option,
//                   );

//                 const selected =
//                   selectedAnswer ===
//                     value ||
//                   selectedAnswer ===
//                     label;

//                 const disabled =
//                   !canAnswer ||
//                   answerSubmitted ||
//                   questionLocked ||
//                   actionLoading;

//                 return (
//                   <button
//                     key={`${value}-${index}`}
//                     type="button"
//                     disabled={disabled}
//                     onClick={() =>
//                       onAnswer(value)
//                     }
//                     className={[
//                       "group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition",
//                       selected
//                         ? "border-cyan-400/50 bg-cyan-400/10"
//                         : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]",
//                       disabled
//                         ? "cursor-not-allowed"
//                         : "cursor-pointer",
//                     ].join(" ")}
//                   >
//                     <span
//                       className={[
//                         "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold",
//                         selected
//                           ? "border-cyan-400/50 bg-cyan-400/20 text-cyan-200"
//                           : "border-white/10 bg-white/5 text-slate-400",
//                       ].join(" ")}
//                     >
//                       {String.fromCharCode(
//                         65 + index,
//                       )}
//                     </span>

//                     <span
//                       className={[
//                         "text-sm leading-6",
//                         selected
//                           ? "text-cyan-100"
//                           : "text-slate-300",
//                       ].join(" ")}
//                     >
//                       {label}
//                     </span>

//                     {selected && (
//                       <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-cyan-300" />
//                     )}
//                   </button>
//                 );
//               },
//             )
//           ) : (
//             <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200">
//               No answer options are available
//               for this question.
//             </div>
//           )}
//         </div>

//         {/* Submission */}
//         {answerSubmitted && (
//           <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
//             <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

//             <div>
//               <p className="text-sm font-medium text-emerald-200">
//                 Answer submitted
//               </p>

//               <p className="mt-1 text-xs leading-5 text-emerald-300/70">
//                 Your answer has been sent to
//                 the quiz server.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    LEADERBOARD
//    ============================================================ */

// function LeaderboardPanel({
//   leaderboard,
// }: {
//   leaderboard: QuizLeaderboardEntry[];
// }) {
//   return (
//     <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
//       <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
//         <div className="flex items-center gap-2">
//           <Trophy className="h-4 w-4 text-amber-300" />

//           <h2 className="text-sm font-semibold">
//             Leaderboard
//           </h2>
//         </div>

//         <span className="text-xs text-slate-500">
//           {leaderboard.length}
//         </span>
//       </div>

//       <div className="max-h-[420px] overflow-y-auto p-2">
//         {leaderboard.length ===
//         0 ? (
//           <div className="px-3 py-8 text-center text-xs text-slate-500">
//             No leaderboard data yet.
//           </div>
//         ) : (
//           leaderboard.map(
//             (entry, index) => {
//               const name =
//                 getLeaderboardName(
//                   entry,
//                 );

//               const score =
//                 entry.score ?? 0;

//               const current =
//                 entry.isCurrentUser ===
//                 true;

//               return (
//                 <div
//                   key={`${getLeaderboardId(
//                     entry,
//                   )}-${index}`}
//                   className={[
//                     "flex items-center gap-3 rounded-xl px-3 py-3",
//                     current
//                       ? "bg-cyan-400/10"
//                       : "hover:bg-white/[0.03]",
//                   ].join(" ")}
//                 >
//                   <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-slate-400">
//                     {index + 1}
//                   </span>

//                   <div className="min-w-0 flex-1">
//                     <p
//                       className={[
//                         "truncate text-sm font-medium",
//                         current
//                           ? "text-cyan-200"
//                           : "text-slate-300",
//                       ].join(" ")}
//                     >
//                       {name}
//                     </p>

//                     {entry.eliminated && (
//                       <p className="text-[11px] text-red-400">
//                         Eliminated
//                       </p>
//                     )}
//                   </div>

//                   <span className="text-sm font-bold text-white">
//                     {score}
//                   </span>
//                 </div>
//               );
//             },
//           )
//         )}
//       </div>
//     </section>
//   );
// }

// /* ============================================================
//    PARTICIPANTS
//    ============================================================ */

// function ParticipantsPanel({
//   participants,
// }: {
//   participants: QuizGameParticipant[];
// }) {
//   return (
//     <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
//       <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
//         <div className="flex items-center gap-2">
//           <Users className="h-4 w-4 text-cyan-300" />

//           <h2 className="text-sm font-semibold">
//             Participants
//           </h2>
//         </div>

//         <span className="text-xs text-slate-500">
//           {participants.length}
//         </span>
//       </div>

//       <div className="max-h-[320px] overflow-y-auto p-2">
//         {participants.length ===
//         0 ? (
//           <div className="px-3 py-8 text-center text-xs text-slate-500">
//             No participants yet.
//           </div>
//         ) : (
//           participants.map(
//             (participant, index) => {
//               const name =
//                 getParticipantName(
//                   participant,
//                 );

//               return (
//                 <div
//                   key={`${getParticipantId(
//                     participant,
//                   )}-${index}`}
//                   className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/[0.03]"
//                 >
//                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-slate-300">
//                     {name
//                       .charAt(0)
//                       .toUpperCase()}
//                   </div>

//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-sm text-slate-300">
//                       {name}
//                     </p>

//                     {participant.eliminated && (
//                       <p className="text-[11px] text-red-400">
//                         Eliminated
//                       </p>
//                     )}
//                   </div>

//                   <span
//                     className={[
//                       "h-2 w-2 rounded-full",
//                       participant.eliminated
//                         ? "bg-red-400"
//                         : "bg-emerald-400",
//                     ].join(" ")}
//                   />
//                 </div>
//               );
//             },
//           )
//         )}
//       </div>
//     </section>
//   );
// }


















"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { axiosInstance } from "@/lib/api/axios";
import { getQuizSocket } from "@/lib/socket/quizSocket";

import {
  getQuizCurrentRound,
  getQuizId,
  getQuizNumberOfRounds,
  getQuizRoomId,
  getQuizTimePerQuestion,
  getQuizTitle,
  type Quiz,
} from "@/types/quiz-board/quiz";

import type { QuizGameRole } from "@/types/quiz-board/quiz-role";

import HostQuizShow from "@/components/quiz-board/host/HostQuizShow";

import type {
  HostQuestionListItem,
} from "@/components/quiz-board/host/HostQuestionList";

import type {
  HostQuestionPreviewQuestion,
} from "@/components/quiz-board/host/HostQuestionPreview";

import type {
  HostParticipant,
} from "@/components/quiz-board/host/HostParticipantPanel";

import type {
  HostLeaderboardEntry,
} from "@/components/quiz-board/host/HostLeaderboardPanel";

import ContestantQuizShow from "@/components/quiz-board/contestant/ContestantQuizShow";

import SpectatorQuizShow from "@/components/quiz-board/spectator/SpectatorQuizShow";

import type { QuizOption } from "@/components/quiz-board/shared/QuizOptions";

/* =========================================================
   TYPES
   ========================================================= */

type SocketPayload = {
  data?: any;

  roomId?: string;
  room_id?: string;

  quizId?: string;
  quiz_id?: string;

  role?: string;

  roundNumber?: number;
  round_number?: number;

  questionNumber?: number;
  question_number?: number;

  questionId?: string;
  question_id?: string;

  question?: any;
  currentQuestion?: any;
  questions?: any[];

  participants?: any[];
  participantList?: any[];

  leaderboard?: any[];
  entries?: any[];

  startedAt?: string | null;
  started_at?: string | null;

  expiresAt?: string | null;
  expires_at?: string | null;

  timeLimit?: number | null;
  time_limit?: number | null;

  activated?: boolean;
  roomActivated?: boolean;

  message?: string;
  error?: string;
};

interface LiveQuestion {
  id: string;
  question: string;
  options: QuizOption[];

  questionNumber: number | null;
  totalQuestions: number | null;

  timeLimit: number | null;

  startedAt: string | null;
  expiresAt: string | null;
}

/* =========================================================
   HELPERS
   ========================================================= */

function unwrapPayload(
  payload: SocketPayload | null | undefined,
): any {
  if (!payload) {
    return null;
  }

  if (
    payload.data &&
    typeof payload.data === "object"
  ) {
    return payload.data;
  }

  return payload;
}

function getNumber(
  value: unknown,
  fallback: number | null = null,
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function normalizeQuestion(
  raw: any,
  fallbackNumber: number | null = null,
  fallbackTotal: number | null = null,
): LiveQuestion | null {
  if (!raw) {
    return null;
  }

  const id =
    raw.id ??
    raw._id ??
    raw.questionId ??
    raw.question_id;

  if (!id) {
    return null;
  }

  const rawOptions =
    raw.options ??
    raw.answers ??
    raw.choices ??
    [];

  const options: QuizOption[] =
    Array.isArray(rawOptions)
      ? rawOptions.map(
          (option: any, index: number) => ({
            label:
              option?.label ??
              option?.key ??
              String.fromCharCode(
                65 + index,
              ),

            value:
              option?.value ??
              option?.answer ??
              option?.text ??
              String(option),
          }),
        )
      : [];

  return {
    id: String(id),

    question:
      raw.question ??
      raw.questionText ??
      raw.question_text ??
      "",

    options,

    questionNumber: getNumber(
      raw.questionNumber ??
        raw.question_number,
      fallbackNumber,
    ),

    totalQuestions: getNumber(
      raw.totalQuestions ??
        raw.total_questions,
      fallbackTotal,
    ),

    timeLimit: getNumber(
      raw.timeLimit ??
        raw.time_limit,
      null,
    ),

    startedAt:
      raw.startedAt ??
      raw.started_at ??
      null,

    expiresAt:
      raw.expiresAt ??
      raw.expires_at ??
      null,
  };
}

function readStoredUser(): any {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  const keys = [
    "user",
    "auth-user",
    "jamb_user",
    "jamb_auth_user",
  ];

  for (const key of keys) {
    try {
      const value =
        window.localStorage.getItem(key);

      if (value) {
        return JSON.parse(value);
      }
    } catch {
      // Ignore malformed values.
    }
  }

  return null;
}

function getApplicationRole(
  user: any,
): string {
  return String(
    user?.role ??
      user?.userRole ??
      user?.user_role ??
      user?.accountType ??
      user?.account_type ??
      "",
  ).toUpperCase();
}

function getSocketRole(
  user: any,
  requestedRole: string | null,
): QuizGameRole {
  if (
    requestedRole?.toLowerCase() ===
    "spectator"
  ) {
    return "SPECTATOR";
  }

  const applicationRole =
    getApplicationRole(user);

  if (
    applicationRole === "ADMIN" ||
    applicationRole === "HOST"
  ) {
    return "HOST";
  }

  return "CONTESTANT";
}

function mapParticipants(
  participants: any[],
): HostParticipant[] {
  return participants.map(
    (participant, index) => ({
      id: String(
        participant?.id ??
          participant?._id ??
          participant?.participantId ??
          participant?.userId ??
          `participant-${index}`,
      ),

      userId:
        participant?.userId ??
        participant?.user_id ??
        null,

      participantId:
        participant?.participantId ??
        participant?.participant_id ??
        null,

      name:
        participant?.name ??
        participant?.fullName ??
        participant?.full_name ??
        participant?.username ??
        "Participant",

      username:
        participant?.username ??
        null,

      email:
        participant?.email ??
        null,

      avatarUrl:
        participant?.avatarUrl ??
        participant?.avatar_url ??
        null,

      connected:
        participant?.connected ??
        participant?.isConnected ??
        participant?.is_connected ??
        undefined,

      joinedAt:
        participant?.joinedAt ??
        participant?.joined_at ??
        null,

      score:
        participant?.score ??
        participant?.points ??
        0,

      rank:
        participant?.rank ??
        null,

      answeredQuestions:
        participant?.answeredQuestions ??
        participant?.answered_questions ??
        0,

      correctAnswers:
        participant?.correctAnswers ??
        participant?.correct_answers ??
        0,

      isEliminated:
        participant?.isEliminated ??
        participant?.is_eliminated ??
        false,

      isActive:
        participant?.isActive ??
        participant?.is_active ??
        true,
    }),
  );
}

function mapLeaderboard(
  entries: any[],
): HostLeaderboardEntry[] {
  return entries.map(
    (entry, index) => ({
      id: String(
        entry?.id ??
          entry?._id ??
          entry?.participantId ??
          entry?.userId ??
          `leader-${index}`,
      ),

      userId:
        entry?.userId ??
        entry?.user_id ??
        null,

      participantId:
        entry?.participantId ??
        entry?.participant_id ??
        null,

      name:
        entry?.name ??
        entry?.fullName ??
        entry?.full_name ??
        entry?.username ??
        "Participant",

      username:
        entry?.username ??
        null,

      avatarUrl:
        entry?.avatarUrl ??
        entry?.avatar_url ??
        null,

      score:
        entry?.score ??
        entry?.points ??
        0,

      correctAnswers:
        entry?.correctAnswers ??
        entry?.correct_answers ??
        0,

      answeredQuestions:
        entry?.answeredQuestions ??
        entry?.answered_questions ??
        0,

      rank:
        entry?.rank ??
        index + 1,

      isCurrentLeader:
        entry?.isCurrentLeader ??
        entry?.is_current_leader ??
        index === 0,

      isEliminated:
        entry?.isEliminated ??
        entry?.is_eliminated ??
        false,

      isConnected:
        entry?.isConnected ??
        entry?.is_connected ??
        undefined,
    }),
  );
}

/* =========================================================
   PAGE
   ========================================================= */

export default function QuizPlayPage() {
  const params =
    useParams<{ quizId: string }>();

  const searchParams =
    useSearchParams();

  const router = useRouter();

  const quizId = params.quizId;

  const requestedRole =
    searchParams.get("role");

  /* =======================================================
     CORE STATE
     ======================================================= */

  const [quiz, setQuiz] =
    useState<Quiz | null>(null);

  const [role, setRole] =
    useState<QuizGameRole | null>(null);

  const [connected, setConnected] =
    useState(false);

  const [roomJoined, setRoomJoined] =
    useState(false);

  const [roomActivated, setRoomActivated] =
    useState(false);

  const [currentRound, setCurrentRound] =
    useState(1);

  const [questions, setQuestions] =
    useState<HostQuestionListItem[]>([]);

  const [selectedQuestion, setSelectedQuestion] =
    useState<HostQuestionPreviewQuestion | null>(
      null,
    );

  const [question, setQuestion] =
    useState<LiveQuestion | null>(null);

  const [currentQuestionNumber, setCurrentQuestionNumber] =
    useState<number | null>(null);

  const [questionStarted, setQuestionStarted] =
    useState(false);

  const [questionLocked, setQuestionLocked] =
    useState(false);

  const [timeLimit, setTimeLimit] =
    useState(30);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [answerSubmitted, setAnswerSubmitted] =
    useState(false);

  const [submittingAnswer, setSubmittingAnswer] =
    useState(false);

  const [participants, setParticipants] =
    useState<HostParticipant[]>([]);

  const [leaderboard, setLeaderboard] =
    useState<HostLeaderboardEntry[]>([]);

  const [feedEvents, setFeedEvents] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [questionLoading, setQuestionLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [socketError, setSocketError] =
    useState<string | null>(null);

  /* =======================================================
     STABLE REFS

     These prevent the socket effect from being recreated
     every time quiz/currentRound changes.
     ======================================================= */

  const quizRef =
    useRef<Quiz | null>(null);

  const currentRoundRef =
    useRef(currentRound);

  const roleRef =
    useRef<QuizGameRole | null>(null);

  const roomIdRef =
    useRef<string | null>(null);

  const selectedQuestionRef =
    useRef<HostQuestionPreviewQuestion | null>(
      null,
    );

  const questionRef =
    useRef<LiveQuestion | null>(null);

  const timeLimitRef =
    useRef(timeLimit);

  useEffect(() => {
    quizRef.current = quiz;
  }, [quiz]);

  useEffect(() => {
    currentRoundRef.current =
      currentRound;
  }, [currentRound]);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    selectedQuestionRef.current =
      selectedQuestion;
  }, [selectedQuestion]);

  useEffect(() => {
    questionRef.current =
      question;
  }, [question]);

  useEffect(() => {
    timeLimitRef.current =
      timeLimit;
  }, [timeLimit]);

  /* =======================================================
     DERIVED VALUES
     ======================================================= */

  const requestedRoomId = searchParams.get("roomId");

const roomId = useMemo(() => {
  const urlRoomId = requestedRoomId?.trim();

  if (urlRoomId) {
    return urlRoomId;
  }

  return quiz ? getQuizRoomId(quiz) : null;
}, [requestedRoomId, quiz]);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const totalRounds = useMemo(
    () =>
      quiz
        ? getQuizNumberOfRounds(
            quiz,
          )
        : 1,
    [quiz],
  );

  const quizTitle = useMemo(
    () =>
      quiz
        ? getQuizTitle(quiz)
        : "Quiz Competition",
    [quiz],
  );

  const subject =
    quiz?.subject ??
    "Quiz Board";

  /* =======================================================
     LOAD QUIZ

     Runs once for this quiz ID.
     ======================================================= */

  const loadQuiz =
    useCallback(async () => {
      if (!quizId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await axiosInstance.get(
            `/quiz/get-quiz-by-quizId/${encodeURIComponent(
              quizId,
            )}`,
          );

        const rawQuiz =
          response?.data?.data ??
          response?.data?.quiz ??
          response?.data;

        if (!rawQuiz) {
          throw new Error(
            "Quiz competition could not be found.",
          );
        }

        const normalizedQuiz: Quiz = {
          ...rawQuiz,

          id: getQuizId({
            id:
              rawQuiz.id ??
              rawQuiz._id ??
              quizId,

            _id:
              rawQuiz._id,
          }),

          title:
            rawQuiz.title ??
            rawQuiz.quiz_title ??
            "Quiz Competition",

          status:
            rawQuiz.status ??
            "WAITING",

          numberOfRounds:
            getQuizNumberOfRounds(
              rawQuiz,
            ),

          timePerQuestion:
            getQuizTimePerQuestion(
              rawQuiz,
            ),

          noOfContestants:
            rawQuiz.noOfContestants ??
            rawQuiz.no_of_contestants ??
            20,
        };

        setQuiz(normalizedQuiz);

        const initialRound =
          Math.max(
            1,
            getQuizCurrentRound(
              normalizedQuiz,
            ) || 1,
          );

        setCurrentRound(
          initialRound,
        );

        setTimeLimit(
          getQuizTimePerQuestion(
            normalizedQuiz,
          ),
        );
      } catch (err: any) {
        setError(
          err?.response?.data
            ?.message ??
            err?.message ??
            "Unable to load competition.",
        );
      } finally {
        setLoading(false);
      }
    }, [quizId]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  /* =======================================================
     DETERMINE ROLE

     Runs independently from quiz loading.
     ======================================================= */

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const user =
      readStoredUser();

    const resolvedRole =
      getSocketRole(
        user,
        requestedRole,
      );

    setRole(resolvedRole);
    roleRef.current =
      resolvedRole;
  }, [requestedRole]);

  
  
  
  
  
  
  /* =======================================================
     LOAD HOST QUESTIONS

     IMPORTANT:
     Backend currently returns:

       data: Array(10)

     not:

       data: { questions: Array(10) }

     We explicitly support both.
     ======================================================= */

  const loadRoundQuestions =
    useCallback(
      async (roundNumber: number) => {
        if (
          !quizId ||
          roleRef.current !==
            "HOST"
        ) {
          return;
        }

        try {
          setQuestionLoading(true);

          const response =
            await axiosInstance.get(
              `/quiz/get-round-questions/${encodeURIComponent(
                quizId,
              )}`,
              {
                params: {
                  roundNumber,
                },
              },
            );

          const payload =
            response?.data?.data ??
            response?.data;

          let rawQuestions: any[] =
            [];

          if (
            Array.isArray(
              payload,
            )
          ) {
            rawQuestions =
              payload;
          } else if (
            payload &&
            typeof payload ===
              "object"
          ) {
            rawQuestions =
              payload.questions ??
              payload.questionObj ??
              payload.roundQuestions ??
              [];
          }

          const normalized: HostQuestionListItem[] =
            Array.isArray(
              rawQuestions,
            )
              ? rawQuestions.map(
                  (
                    item: any,
                    index: number,
                  ) => ({
                    id: String(
                      item?.id ??
                        item?._id ??
                        `question-${
                          index + 1
                        }`,
                    ),

                    questionNumber:
                      getNumber(
                        item?.questionNumber ??
                          item?.question_number,
                        index + 1,
                      ) ??
                      index + 1,

                    question:
                      item?.question ??
                      item?.questionText ??
                      item?.question_text ??
                      "",

                    options:
                      Array.isArray(
                        item?.options,
                      )
                        ? item.options
                        : [],

                    timeLimit:
                      getNumber(
                        item?.timeLimit ??
                          item?.time_limit,
                        timeLimitRef.current,
                      ),

                    status:
                      item?.status ??
                      "READY",

                    answeredCount:
                      getNumber(
                        item?.answeredCount ??
                          item?.answered_count,
                        0,
                      ) ?? 0,

                    correctCount:
                      getNumber(
                        item?.correctCount ??
                          item?.correct_count,
                        0,
                      ) ?? 0,
                  }),
                )
              : [];

          setQuestions(
            normalized,
          );

          /*
           * Preserve the currently selected question
           * when refreshing the same round.
           */
          const existingNumber =
            selectedQuestionRef
              .current
              ?.questionNumber;

          const selected =
            normalized.find(
              (item) =>
                item.questionNumber ===
                existingNumber,
            ) ??
            normalized[0] ??
            null;

          if (selected) {
            const preview: HostQuestionPreviewQuestion =
              {
                id:
                  selected.id,

                questionNumber:
                  selected.questionNumber,

                question:
                  selected.question,

                options:
                  selected.options?.map(
                    (option: any) => ({
                      label:
                        option?.label,

                      value:
                        option?.value ??
                        option?.answer ??
                        "",

                      isCorrect:
                        option?.isCorrect ??
                        option?.is_correct,
                    }),
                  ) ?? [],

                timeLimit:
                  selected.timeLimit,

                status:
                  selected.status,

                answeredCount:
                  selected.answeredCount,

                correctCount:
                  selected.correctCount,
              };

            setSelectedQuestion(
              preview,
            );

            selectedQuestionRef.current =
              preview;
          } else {
            setSelectedQuestion(
              null,
            );

            selectedQuestionRef.current =
              null;
          }
        } catch (err: any) {
          setError(
            err?.response?.data
              ?.message ??
              err?.message ??
              "Unable to load round questions.",
          );
        } finally {
          setQuestionLoading(
            false,
          );
        }
      },
      [quizId],
    );

  /*
   * Only load host questions when the round changes.
   *
   * timeLimit is intentionally NOT a dependency.
   */
  useEffect(() => {
    if (
      role !== "HOST" ||
      !quiz ||
      !currentRound
    ) {
      return;
    }

    void loadRoundQuestions(
      currentRound,
    );
  }, [
    role,
    quiz,
    currentRound,
    loadRoundQuestions,
  ]);

  /* =======================================================
     SOCKET CONNECTION

     IMPORTANT:
     This effect deliberately depends ONLY on stable
     connection identity.

     It must NOT depend on:
       quiz
       currentRound
       timeLimit
       selectedQuestion
       question
     ======================================================= */

  useEffect(() => {
    if (
      !quizId ||
      !roomId ||
      !role
    ) {
      return;
    }

    const socket =
      getQuizSocket();

    let disposed = false;

   
   
    const joinRoom = () => {
  if (disposed) {
    return;
  }

  const currentRole = roleRef.current;

  if (!currentRole) {
    console.warn("[HOST] Cannot join room: role is missing.");
    return;
  }

  if (!quizId) {
    console.warn("[HOST] Cannot join room: quizId is missing.");
    return;
  }

  if (!roomId) {
    console.warn("[HOST] Cannot join room: roomId is missing.");
    return;
  }

  if (!socket.connected) {
    console.warn("[HOST] Cannot join room: socket is not connected.");
    return;
  }

  const payload = {
    roomId,
    room_id: roomId,

    quizId,
    quiz_id: quizId,

    role: currentRole,
  };

  console.log("========================================");
  console.log("[HOST] ABOUT TO JOIN QUIZ ROOM");
  console.log("quizId:", quizId);
  console.log("roomId:", roomId);
  console.log("requestedRoomId:", requestedRoomId);
  console.log("role:", currentRole);
  console.log("socket.id:", socket.id);
  console.log("socket.connected:", socket.connected);
  console.log("========================================");

  console.log("[HOST JOIN ROOM]", {
    quizId,
    roomId,
    urlRoomId: requestedRoomId,
    role: currentRole,
    socketConnected: socket.connected,
    payload,
  });

  socket.emit("join_room", payload);

  console.log("[HOST] join_room EMITTED", {
    socketId: socket.id,
    quizId,
    roomId,
    role: currentRole,
  });
};




    const handleConnect =
      () => {
        if (disposed) {
          return;
        }

        setConnected(true);
        setSocketError(null);

        /*
         * All three quiz roles join the room.
         *
         * HOST needs room membership too because the host
         * controls the live room through Socket.IO.
         */
        joinRoom();

 
      };

    const handleDisconnect =
      () => {
        if (disposed) {
          return;
        }

        setConnected(false);
        setRoomJoined(false);
      };

    const handleConnectError =
      (err: Error) => {
        if (disposed) {
          return;
        }

        setConnected(false);

        setSocketError(
          err?.message ??
            "Unable to connect to quiz server.",
        );
      };

    const handleJoinedRoom =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        setRoomJoined(true);

        if (
          Array.isArray(
            data?.participants,
          )
        ) {
          setParticipants(
            mapParticipants(
              data.participants,
            ),
          );
        }
      };

    const handleRoomActivated =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        setRoomActivated(
          true,
        );

        if (
          Array.isArray(
            data?.participants,
          )
        ) {
          setParticipants(
            mapParticipants(
              data.participants,
            ),
          );
        }
      };

    const handleRoomState =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        if (
          typeof data?.activated ===
          "boolean"
        ) {
          setRoomActivated(
            data.activated,
          );
        }

        if (
          typeof data?.roomActivated ===
          "boolean"
        ) {
          setRoomActivated(
            data.roomActivated,
          );
        }

        if (
          Array.isArray(
            data?.participants,
          )
        ) {
          setParticipants(
            mapParticipants(
              data.participants,
            ),
          );
        }

        const leaderboardEntries =
          data?.leaderboard ??
          data?.entries;

        if (
          Array.isArray(
            leaderboardEntries,
          )
        ) {
          setLeaderboard(
            mapLeaderboard(
              leaderboardEntries,
            ),
          );
        }

        /*
         * Some backends include the current live question
         * inside room_state when reconnecting.
         */
        const rawQuestion =
          data?.question ??
          data?.currentQuestion;

        if (rawQuestion) {
          const normalized =
            normalizeQuestion(
              rawQuestion,
              getNumber(
                data?.questionNumber ??
                  data?.question_number,
                null,
              ),
              getNumber(
                data?.totalQuestions ??
                  data?.total_questions,
                null,
              ),
            );

          if (normalized) {
            setQuestion(
              normalized,
            );

            questionRef.current =
              normalized;

            setCurrentQuestionNumber(
              normalized.questionNumber,
            );

            setTimeLimit(
              normalized.timeLimit ??
                timeLimitRef.current,
            );

            setQuestionStarted(
              true,
            );

            setQuestionLocked(
              false,
            );
          }
        }
      };

    const handleRoundStarted =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        const round =
          getNumber(
            data?.roundNumber ??
              data?.round_number,
            currentRoundRef.current,
          );

        if (round) {
          setCurrentRound(
            round,
          );
        }

        setQuestion(
          null,
        );

        questionRef.current =
          null;

        setCurrentQuestionNumber(
          null,
        );

        setSelectedAnswer(
          null,
        );

        setAnswerSubmitted(
          false,
        );

        setQuestionStarted(
          false,
        );

        setQuestionLocked(
          false,
        );
      };

    const handleQuestionStarted =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        const rawQuestion =
          data?.question ??
          data?.currentQuestion ??
          data;

        const normalized =
          normalizeQuestion(
            rawQuestion,

            getNumber(
              data?.questionNumber ??
                data?.question_number,
              null,
            ),

            getNumber(
              data?.totalQuestions ??
                data?.total_questions,
              null,
            ),
          );

        if (normalized) {
          setQuestion(
            normalized,
          );

          questionRef.current =
            normalized;

          setCurrentQuestionNumber(
            normalized.questionNumber,
          );

          setTimeLimit(
            normalized.timeLimit ??
              timeLimitRef.current,
          );
        }

        setQuestionStarted(
          true,
        );

        setQuestionLocked(
          false,
        );

        setSelectedAnswer(
          null,
        );

        setAnswerSubmitted(
          false,
        );

        setSubmittingAnswer(
          false,
        );
      };

    const handleQuestionLocked =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        setQuestionLocked(
          true,
        );

        if (
          Array.isArray(
            data?.leaderboard,
          )
        ) {
          setLeaderboard(
            mapLeaderboard(
              data.leaderboard,
            ),
          );
        }
      };

    const handleNextQuestion =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        const nextNumber =
          getNumber(
            data?.questionNumber ??
              data?.question_number,
            null,
          );

        setCurrentQuestionNumber(
          nextNumber,
        );

        setQuestion(
          null,
        );

        questionRef.current =
          null;

        setQuestionStarted(
          false,
        );

        setQuestionLocked(
          false,
        );

        setSelectedAnswer(
          null,
        );

        setAnswerSubmitted(
          false,
        );
      };

    const handleParticipants =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        const list =
          data?.participants ??
          data?.participantList;

        if (
          Array.isArray(list)
        ) {
          setParticipants(
            mapParticipants(
              list,
            ),
          );
        }
      };

    const handleLeaderboard =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        const entries =
          data?.entries ??
          data?.leaderboard ??
          [];

        if (
          Array.isArray(entries)
        ) {
          setLeaderboard(
            mapLeaderboard(
              entries,
            ),
          );
        }
      };

    const handleFirstCorrect =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        setFeedEvents(
          (previous) => [
            ...previous.slice(-49),

            {
              type:
                "FIRST_CORRECT_ANSWER",

              ...data,

              createdAt:
                new Date().toISOString(),
            },
          ],
        );
      };

    const handleEliminations =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        setFeedEvents(
          (previous) => [
            ...previous.slice(-49),

            {
              type:
                "PARTICIPANTS_ELIMINATED",

              ...data,

              createdAt:
                new Date().toISOString(),
            },
          ],
        );

        if (
          Array.isArray(
            data?.participants,
          )
        ) {
          setParticipants(
            mapParticipants(
              data.participants,
            ),
          );
        }
      };

    const handleSocketError =
      (
        payload: SocketPayload,
      ) => {
        if (disposed) {
          return;
        }

        const data =
          unwrapPayload(
            payload,
          );

        setSocketError(
          data?.message ??
            data?.error ??
            "Quiz socket error.",
        );
      };

    /* =====================================================
       LISTENERS
       ===================================================== */

    socket.on(
      "connect",
      handleConnect,
    );

    socket.on(
      "disconnect",
      handleDisconnect,
    );

    socket.on(
      "connect_error",
      handleConnectError,
    );

    socket.on(
      "joined_room_ack",
      handleJoinedRoom,
    );

    socket.on(
      "room_activated",
      handleRoomActivated,
    );

    socket.on(
      "room_activation_ack",
      handleRoomActivated,
    );

    socket.on(
      "room_state",
      handleRoomState,
    );

    socket.on(
      "round_started",
      handleRoundStarted,
    );

    socket.on(
      "question_started",
      handleQuestionStarted,
    );

    socket.on(
      "question_locked",
      handleQuestionLocked,
    );

    socket.on(
      "next_question",
      handleNextQuestion,
    );

    socket.on(
      "participant_joined_room",
      handleParticipants,
    );

    socket.on(
      "participant_left_room",
      handleParticipants,
    );

    socket.on(
      "leaderboard_updated",
      handleLeaderboard,
    );

    socket.on(
      "first_correct_answer",
      handleFirstCorrect,
    );

    socket.on(
      "participants_eliminated",
      handleEliminations,
    );

    socket.on(
      "socket_error",
      handleSocketError,
    );

    /* =====================================================
       CONNECT / REUSE EXISTING CONNECTION
       ===================================================== */

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    /* =====================================================
       CLEANUP
       ===================================================== */

    return () => {
      disposed = true;

      socket.off(
        "connect",
        handleConnect,
      );

      socket.off(
        "disconnect",
        handleDisconnect,
      );

      socket.off(
        "connect_error",
        handleConnectError,
      );

      socket.off(
        "joined_room_ack",
        handleJoinedRoom,
      );

      socket.off(
        "room_activated",
        handleRoomActivated,
      );

      socket.off(
        "room_activation_ack",
        handleRoomActivated,
      );

      socket.off(
        "room_state",
        handleRoomState,
      );

      socket.off(
        "round_started",
        handleRoundStarted,
      );

      socket.off(
        "question_started",
        handleQuestionStarted,
      );

      socket.off(
        "question_locked",
        handleQuestionLocked,
      );

      socket.off(
        "next_question",
        handleNextQuestion,
      );

      socket.off(
        "participant_joined_room",
        handleParticipants,
      );

      socket.off(
        "participant_left_room",
        handleParticipants,
      );

      socket.off(
        "leaderboard_updated",
        handleLeaderboard,
      );

      socket.off(
        "first_correct_answer",
        handleFirstCorrect,
      );

      socket.off(
        "participants_eliminated",
        handleEliminations,
      );

      socket.off(
        "socket_error",
        handleSocketError,
      );
    };
  }, [
    quizId,
    roomId,
    role,
  ]);

  /* =======================================================
     QUESTION SELECTION
     ======================================================= */

  const selectQuestion =
    useCallback(
      (
        item: HostQuestionListItem,
      ) => {
        const preview: HostQuestionPreviewQuestion =
          {
            id: item.id,

            questionNumber:
              item.questionNumber,

            question:
              item.question,

            options:
              item.options?.map(
                (option: any) => ({
                  label:
                    option?.label,

                  value:
                    option?.value ??
                    option?.answer ??
                    "",

                  isCorrect:
                    option?.isCorrect ??
                    option?.is_correct,
                }),
              ) ?? [],

            timeLimit:
              item.timeLimit,

            status:
              item.status,

            answeredCount:
              item.answeredCount,

            correctCount:
              item.correctCount,
          };

        setSelectedQuestion(
          preview,
        );

        selectedQuestionRef.current =
          preview;
      },
      [],
    );

  /* =======================================================
     START QUESTION
     ======================================================= */

  const startQuestion =
    useCallback(() => {
      const currentRole =
        roleRef.current;

      const currentRoomId =
        roomIdRef.current;

      const currentSelectedQuestion =
        selectedQuestionRef.current;

      if (
        currentRole !== "HOST" ||
        !currentRoomId ||
        !currentSelectedQuestion ||
        !connected
      ) {
        return;
      }

      const socket =
        getQuizSocket();

      setActionLoading(true);

      socket.emit(
        "start_question",
        {
          roomId:
            currentRoomId,

          room_id:
            currentRoomId,

          quizId,

          quiz_id:
            quizId,

          roundNumber:
            currentRoundRef.current,

          round_number:
            currentRoundRef.current,

          questionNumber:
            currentSelectedQuestion.questionNumber,

          question_number:
            currentSelectedQuestion.questionNumber,

          questionId:
            currentSelectedQuestion.id,

          question_id:
            currentSelectedQuestion.id,

          timeLimit:
            timeLimitRef.current,

          time_limit:
            timeLimitRef.current,
        },
      );

      /*
       * Do not set questionStarted here.
       *
       * The backend is authoritative.
       *
       * We wait for:
       *
       *     question_started
       *
       * before changing the live question state.
       */
      setActionLoading(false);
    }, [
      quizId,
      connected,
    ]);

  /* =======================================================
     LOCK QUESTION
     ======================================================= */

  const lockQuestion =
    useCallback(() => {
      if (
        roleRef.current !==
          "HOST" ||
        !roomIdRef.current ||
        currentQuestionNumber ==
          null ||
        !connected
      ) {
        return;
      }

      const socket =
        getQuizSocket();

      socket.emit(
        "question_locked",
        {
          roomId:
            roomIdRef.current,

          room_id:
            roomIdRef.current,

          quizId,

          quiz_id:
            quizId,

          roundNumber:
            currentRoundRef.current,

          round_number:
            currentRoundRef.current,

          questionNumber:
            currentQuestionNumber,

          question_number:
            currentQuestionNumber,
        },
      );
    }, [
      quizId,
      connected,
      currentQuestionNumber,
    ]);

  /* =======================================================
     NEXT QUESTION
     ======================================================= */

  const nextQuestion =
    useCallback(() => {
      if (
        roleRef.current !==
          "HOST" ||
        !roomIdRef.current ||
        currentQuestionNumber ==
          null ||
        !connected
      ) {
        return;
      }

      const socket =
        getQuizSocket();

      socket.emit(
        "next_question",
        {
          roomId:
            roomIdRef.current,

          room_id:
            roomIdRef.current,

          quizId,

          quiz_id:
            quizId,

          roundNumber:
            currentRoundRef.current,

          round_number:
            currentRoundRef.current,

          questionNumber:
            currentQuestionNumber,

          question_number:
            currentQuestionNumber,
        },
      );
    }, [
      quizId,
      connected,
      currentQuestionNumber,
    ]);

  /* =======================================================
     SUBMIT CONTESTANT ANSWER
     ======================================================= */

  const submitAnswer =
    useCallback(
      (answer: string) => {
        const currentRole =
          roleRef.current;

        const currentRoomId =
          roomIdRef.current;

        const currentQuestion =
          questionRef.current;

        if (
          currentRole !==
            "CONTESTANT" ||
          !currentRoomId ||
          !currentQuestion ||
          answerSubmitted ||
          submittingAnswer
        ) {
          return;
        }

        setSelectedAnswer(
          answer,
        );

        setSubmittingAnswer(
          true,
        );

        getQuizSocket().emit(
          "submit_answer",
          {
            roomId:
              currentRoomId,

            room_id:
              currentRoomId,

            quizId,

            quiz_id:
              quizId,

            questionId:
              currentQuestion.id,

            question_id:
              currentQuestion.id,

            roundNumber:
              currentRoundRef.current,

            round_number:
              currentRoundRef.current,

            questionNumber:
              currentQuestion.questionNumber,

            question_number:
              currentQuestion.questionNumber,

            answer,

            selectedAnswer:
              answer,
          },
        );

        /*
         * The existing UI treats the answer as submitted
         * immediately after emitting.
         *
         * Backend remains authoritative for correctness.
         */
        setAnswerSubmitted(
          true,
        );

        setSubmittingAnswer(
          false,
        );
      },
      [
        quizId,
        answerSubmitted,
        submittingAnswer,
      ],
    );

  /* =======================================================
     NAVIGATION
     ======================================================= */

  const back =
    useCallback(() => {
      router.back();
    }, [router]);

  /* =======================================================
     REFRESH

     Explicit user action only.
     ======================================================= */

  const refresh =
    useCallback(() => {
      void loadQuiz();

      if (
        roleRef.current ===
        "HOST"
      ) {
        void loadRoundQuestions(
          currentRoundRef.current,
        );
      }
    }, [
      loadQuiz,
      loadRoundQuestions,
    ]);

  /* =======================================================
     CURRENT USER SCORE
     ======================================================= */

  const currentUser =
    useMemo(
      () =>
        readStoredUser(),
      [],
    );

  const currentUserId =
    String(
      currentUser?.id ??
        currentUser?._id ??
        "",
    );

  const currentUserEntry =
    useMemo(
      () =>
        leaderboard.find(
          (entry) =>
            String(
              entry.userId ??
                entry.participantId ??
                "",
            ) ===
            currentUserId,
        ),
      [
        leaderboard,
        currentUserId,
      ],
    );

  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

          <p className="text-sm text-slate-400">
            Loading quiz...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR / INVALID ROOM
     ======================================================= */

  if (
    error ||
    !quiz ||
    !role ||
    !roomId
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-red-500/20 bg-slate-900 p-6 text-center">
          <h1 className="text-lg font-semibold">
            Unable to load competition
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {error ??
              "No quiz room is available for this competition."}
          </p>

          <button
            type="button"
            onClick={back}
            className="mt-6 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }



const canStartQuestion =
  connected &&
  roomJoined &&
  roomActivated &&
  Boolean(selectedQuestion) &&
  !questionStarted;

console.log("[HOST START CONDITIONS]", {
  role,
  connected,
  roomJoined,
  roomActivated,
  selectedQuestion: Boolean(selectedQuestion),
  selectedQuestionNumber:
    selectedQuestion?.questionNumber ?? null,
  questionStarted,
  questionLocked,
  actionLoading,
  canStartQuestion,
});






  /* =======================================================
     HOST
     ======================================================= */

  if (role === "HOST") {
    return (
      <HostQuizShow
        quizId={quizId}
        roomId={roomId}

        quizTitle={
          quizTitle
        }

        subject={
          subject
        }

        description={
          quiz.description ??
          ""
        }

        currentRound={
          currentRound
        }

        totalRounds={
          totalRounds
        }

        questions={
          questions
        }

        selectedQuestionNumber={
          selectedQuestion?.questionNumber ??
          null
        }

        currentQuestionNumber={
          currentQuestionNumber
        }

        totalQuestions={
          questions.length ||
          null
        }

        selectedQuestion={
          selectedQuestion
        }

        questionStarted={
          questionStarted
        }

        questionLocked={
          questionLocked
        }

        timeLimit={
          timeLimit
        }

        connected={
          connected
        }

        roomActivated={
          roomActivated
        }

        participants={
          participants
        }

        leaderboard={
          leaderboard
        }

        loading={
          loading
        }

        questionLoading={
          questionLoading
        }

        actionLoading={
          actionLoading
        }

        error={
          error ??
          socketError
        }

       canStartQuestion={
  canStartQuestion
}

        canLockQuestion={
          connected &&
          roomJoined &&
          questionStarted &&
          !questionLocked
        }

        canNextQuestion={
          connected &&
          roomJoined &&
          questionLocked
        }

        onBack={
          back
        }

        onSelectQuestion={
          selectQuestion
        }

        onStartQuestion={
          startQuestion
        }

        onLockQuestion={
          lockQuestion
        }

        onNextQuestion={
          nextQuestion
        }

        onTimeLimitChange={
          setTimeLimit
        }

        onRefresh={
          refresh
        }
      />
    );
  }

  /* =======================================================
     SPECTATOR
     ======================================================= */

  if (role === "SPECTATOR") {
    const spectatorProps = {
      quizId,

      roomId,

      quizTitle,

      subject,

      description:
        quiz.description ??
        "",

      currentRound,

      totalRounds,

      currentQuestionNumber,

      totalQuestions:
        question?.totalQuestions ??
        questions.length ??
        null,

      question,

      questionStarted,

      questionLocked,

      timeLimit:
        question?.timeLimit ??
        timeLimit,

      startedAt:
        question?.startedAt ??
        null,

      expiresAt:
        question?.expiresAt ??
        null,

      connected,

      connectionStatus:
        connected
          ? "CONNECTED"
          : "DISCONNECTED",

      roomActivated,

      participants,

      leaderboard,

      feedEvents,

      loading,

      questionLoading,

      error:
        error ??
        socketError,

      onBack:
        back,

      onRefresh:
        refresh,
    } as React.ComponentProps<
      typeof SpectatorQuizShow
    >;

    return (
      <SpectatorQuizShow
        {...spectatorProps}
      />
    );
  }

  /* =======================================================
     CONTESTANT
     ======================================================= */

  const contestantProps = {
    quizId,

    roomId,

    quizTitle,

    subject,

    description:
      quiz.description ??
      "",

    currentRound,

    totalRounds,

    question,

    selectedAnswer,

    answerSubmitted,

    questionStarted,

    questionLocked,

    submittingAnswer,

    connected,

    roomJoined,

    roomActivated,

    timerStartedAt:
      question?.startedAt ??
      null,

    timerExpiresAt:
      question?.expiresAt ??
      null,

    timeLimit:
      question?.timeLimit ??
      timeLimit,

    score:
      currentUserEntry?.score ??
      0,

    rank:
      currentUserEntry?.rank ??
      null,

    participantCount:
      participants.length,

    answerStatus:
      answerSubmitted
        ? "SUBMITTED"
        : questionStarted
          ? "WAITING"
          : "IDLE",

    eliminated:
      false,

    loading,

    error:
      error ??
      socketError,

    onBack:
      back,

    onSelectAnswer:
      setSelectedAnswer,

    onSubmitAnswer:
      () => {
        if (
          !selectedAnswer
        ) {
          return;
        }

        submitAnswer(
          selectedAnswer,
        );
      },
  } as React.ComponentProps<
    typeof ContestantQuizShow
  >;

  return (
    <ContestantQuizShow
      {...contestantProps}
    />
  );
}














