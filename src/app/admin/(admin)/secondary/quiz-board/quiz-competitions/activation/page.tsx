// "use client";

// import {
//   AlertCircle,
//   ArrowLeft,
//   CheckCircle2,
//   Loader2,
//   Radio,
//   ShieldCheck,
//   Users,
// } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { axiosInstance } from "@/lib/api/axios";
// import { activateQuizRoom } from "@/lib/quiz-board/admin/activateQuizRoom";

// type RecordPayload = Record<string, unknown>;

// interface QuizBoard {
//   _id?: string;
//   id?: string;

//   quiz_title?: string;
//   title?: string;

//   description?: string;
//   subject?: string;
//   difficulty?: string;

//   status?: string;

//   room_id?: string | null;
//   roomId?: string | null;

//   no_of_contestants?: number;
//   max_players?: number;
//   maxPlayers?: number;

//   joined_users?: unknown[];
//   players?: unknown[];

//   current_round?: number;
//   number_of_rounds?: number;

//   time_per_question?: number;

//   start_date?: string;
//   startsAt?: string;
// }

// function getPayloadLayers(payload: unknown): RecordPayload[] {
//   const layers: RecordPayload[] = [];

//   let current: unknown = payload;

//   while (
//     current &&
//     typeof current === "object" &&
//     !Array.isArray(current)
//   ) {
//     const record = current as RecordPayload;

//     layers.push(record);

//     if (
//       record.data &&
//       typeof record.data === "object" &&
//       !Array.isArray(record.data) &&
//       record.data !== current
//     ) {
//       current = record.data;
//       continue;
//     }

//     if (
//       record.quiz &&
//       typeof record.quiz === "object" &&
//       !Array.isArray(record.quiz) &&
//       record.quiz !== current
//     ) {
//       current = record.quiz;
//       continue;
//     }

//     if (
//       record.quizObj &&
//       typeof record.quizObj === "object" &&
//       !Array.isArray(record.quizObj) &&
//       record.quizObj !== current
//     ) {
//       current = record.quizObj;
//       continue;
//     }

//     if (
//       record.quizBoard &&
//       typeof record.quizBoard === "object" &&
//       !Array.isArray(record.quizBoard) &&
//       record.quizBoard !== current
//     ) {
//       current = record.quizBoard;
//       continue;
//     }

//     break;
//   }

//   return layers;
// }

// function getRecordFromPayload(payload: unknown): QuizBoard | null {
//   const layers = getPayloadLayers(payload);

//   for (const layer of layers) {
//     if (
//       typeof layer._id === "string" ||
//       typeof layer.id === "string" ||
//       typeof layer.quiz_title === "string" ||
//       typeof layer.title === "string"
//     ) {
//       return layer as QuizBoard;
//     }
//   }

//   return null;
// }

// function getStringValue(value: unknown): string | null {
//   if (typeof value !== "string") {
//     return null;
//   }

//   const trimmed = value.trim();

//   return trimmed ? trimmed : null;
// }

// function getNumberValue(value: unknown): number | null {
//   if (typeof value === "number" && Number.isFinite(value)) {
//     return value;
//   }

//   if (typeof value === "string" && value.trim()) {
//     const parsed = Number(value);

//     if (Number.isFinite(parsed)) {
//       return parsed;
//     }
//   }

//   return null;
// }

// function getQuizId(quiz: QuizBoard): string | null {
//   return getStringValue(quiz._id) ?? getStringValue(quiz.id);
// }

// function getRoomId(quiz: QuizBoard): string | null {
//   return (
//     getStringValue(quiz.room_id) ??
//     getStringValue(quiz.roomId)
//   );
// }

// function getQuizTitle(quiz: QuizBoard): string {
//   return (
//     getStringValue(quiz.quiz_title) ??
//     getStringValue(quiz.title) ??
//     "Quiz Competition"
//   );
// }

// function getContestantCount(quiz: QuizBoard): number {
//   if (Array.isArray(quiz.joined_users)) {
//     return quiz.joined_users.length;
//   }

//   if (Array.isArray(quiz.players)) {
//     return quiz.players.length;
//   }

//   return 0;
// }

// function getContestantCapacity(quiz: QuizBoard): number | null {
//   return (
//     getNumberValue(quiz.no_of_contestants) ??
//     getNumberValue(quiz.max_players) ??
//     getNumberValue(quiz.maxPlayers)
//   );
// }

// function normalizeStatus(status: unknown): string {
//   return getStringValue(status)?.toUpperCase() ?? "UNKNOWN";
// }

// function getApiErrorMessage(error: unknown): string {
//   if (error && typeof error === "object") {
//     const record = error as Record<string, unknown>;

//     const response = record.response;

//     if (response && typeof response === "object") {
//       const responseRecord = response as Record<string, unknown>;

//       const responseData = responseRecord.data;

//       if (
//         responseData &&
//         typeof responseData === "object"
//       ) {
//         const dataRecord =
//           responseData as Record<string, unknown>;

//         const message =
//           getStringValue(dataRecord.message) ??
//           getStringValue(dataRecord.error) ??
//           getStringValue(dataRecord.reason);

//         if (message) {
//           return message;
//         }
//       }

//       const statusText = getStringValue(
//         responseRecord.statusText,
//       );

//       if (statusText) {
//         return statusText;
//       }
//     }

//     const message = getStringValue(record.message);

//     if (message) {
//       return message;
//     }
//   }

//   if (error instanceof Error) {
//     return error.message;
//   }

//   return "Something went wrong while processing the quiz room.";
// }

// export default function QuizRoomActivationPage() {
//   const params = useParams<{
//     "quiz-competitionsId"?: string | string[];
//   }>();

//   const router = useRouter();

//   const quizCompetitionId = useMemo(() => {
//     const value = params?.["quiz-competitionsId"];

//     if (Array.isArray(value)) {
//       const lastValue = value[value.length - 1];

//       return typeof lastValue === "string"
//         ? decodeURIComponent(lastValue).trim()
//         : "";
//     }

//     return typeof value === "string"
//       ? decodeURIComponent(value).trim()
//       : "";
//   }, [params]);

//   const [quiz, setQuiz] =
//     useState<QuizBoard | null>(null);

//   const [isLoading, setIsLoading] =
//     useState(false);

//   const [isActivating, setIsActivating] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   const [successMessage, setSuccessMessage] =
//     useState("");

//   /*
//    * IMPORTANT:
//    *
//    * If the route parameter is missing, do NOT treat that
//    * as an API error.
//    *
//    * We simply leave the page available so the admin can
//    * reach the activation screen first.
//    */
//   const loadQuiz = useCallback(async () => {
//     if (!quizCompetitionId) {
//       setQuiz(null);
//       setError("");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setError("");
//       setSuccessMessage("");

//       const response = await axiosInstance.get(
//         `/quiz/get-quiz-by-quizId/${encodeURIComponent(
//           quizCompetitionId,
//         )}`,
//       );

//       const nextQuiz = getRecordFromPayload(
//         response?.data,
//       );

//       if (!nextQuiz) {
//         throw new Error(
//           "The quiz response did not contain valid competition data.",
//         );
//       }

//       setQuiz(nextQuiz);
//     } catch (err) {
//       setQuiz(null);
//       setError(getApiErrorMessage(err));
//     } finally {
//       setIsLoading(false);
//     }
//   }, [quizCompetitionId]);

//   useEffect(() => {
//     void loadQuiz();
//   }, [loadQuiz]);

//   const quizId = quiz
//     ? getQuizId(quiz)
//     : null;

//   const roomId = quiz
//     ? getRoomId(quiz)
//     : null;

//   const quizTitle = quiz
//     ? getQuizTitle(quiz)
//     : "Quiz Competition";

//   const contestantCount = quiz
//     ? getContestantCount(quiz)
//     : 0;

//   const contestantCapacity = quiz
//     ? getContestantCapacity(quiz)
//     : null;

//   const currentRound =
//     getNumberValue(quiz?.current_round) ?? 0;

//   const totalRounds =
//     getNumberValue(quiz?.number_of_rounds) ?? 0;

//   const status = normalizeStatus(quiz?.status);

//   const canActivate =
//     Boolean(quizId && roomId) &&
//     !isActivating &&
//     status !== "IN_PROGRESS";

//   const handleActivate = async () => {
//     if (!quizId) {
//       setError(
//         "Quiz ID is missing. The competition cannot be activated.",
//       );
//       return;
//     }

//     if (!roomId) {
//       setError(
//         "No quiz room has been created for this competition yet.",
//       );
//       return;
//     }

//     try {
//       setIsActivating(true);
//       setError("");
//       setSuccessMessage("");

//       /*
//        * activateQuizRoom handles:
//        *
//        * activate_room
//        * room_activation_ack
//        * room_activated
//        *
//        * Do not emit these events directly from this page.
//        */
//       const result = await activateQuizRoom(
//         quizId,
//         roomId,
//       );

//       setSuccessMessage(
//         "Room activated successfully. Opening the host quiz arena...",
//       );

//       router.replace(
//         `/student/quiz-board/${encodeURIComponent(
//           result.quizId,
//         )}/play?role=host&roomId=${encodeURIComponent(
//           result.roomId,
//         )}`,
//       );
//     } catch (err) {
//       setError(getApiErrorMessage(err));
//       setIsActivating(false);
//     }
//   };

//   const handleBack = () => {
//     router.push(
//       "/admin/secondary/quiz-board/quiz-competitions",
//     );
//   };

//   /*
//    * -------------------------------------------------------
//    * NO ROUTE ID
//    * -------------------------------------------------------
//    *
//    * Instead of:
//    *
//    * "Unable to load competition"
//    *
//    * show a usable page.
//    */
//   if (!quizCompetitionId) {
//     return (
//       <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
//         <div className="mx-auto max-w-5xl">
//           <button
//             type="button"
//             onClick={handleBack}
//             className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to competitions
//           </button>

//           <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">
//             <div className="border-b border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 px-6 py-8 sm:px-8">
//               <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
//                 <Radio className="h-3.5 w-3.5" />
//                 Quiz Room
//               </div>

//               <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
//                 Quiz Room Activation
//               </h1>

//               <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
//                 The activation page is ready. A quiz competition
//                 must be selected before its room can be loaded.
//               </p>
//             </div>

//             <div className="p-6 sm:p-8">
//               <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

//                   <div>
//                     <h2 className="text-sm font-semibold text-amber-300">
//                       No competition selected
//                     </h2>

//                     <p className="mt-1 text-sm leading-6 text-slate-400">
//                       Open this page from a specific quiz
//                       competition so the competition ID can be
//                       included in the URL.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 flex flex-col gap-3 sm:flex-row">
//                 <button
//                   type="button"
//                   onClick={handleBack}
//                   className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Select Competition
//                 </button>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * -------------------------------------------------------
//    * LOADING
//    * -------------------------------------------------------
//    */
//   if (isLoading) {
//     return (
//       <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
//         <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
//           <div className="flex flex-col items-center gap-4 text-center">
//             <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
//               <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
//             </div>

//             <div>
//               <h1 className="text-lg font-semibold">
//                 Loading quiz room
//               </h1>

//               <p className="mt-1 text-sm text-slate-400">
//                 Preparing the competition for activation...
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * -------------------------------------------------------
//    * API FAILED
//    * -------------------------------------------------------
//    */
//   if (!quiz) {
//     return (
//       <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
//         <div className="mx-auto max-w-3xl">
//           <button
//             type="button"
//             onClick={handleBack}
//             className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to competitions
//           </button>

//           <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-8">
//             <div className="flex items-start gap-4">
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
//                 <AlertCircle className="h-5 w-5 text-red-400" />
//               </div>

//               <div>
//                 <h1 className="text-xl font-bold">
//                   Unable to load competition
//                 </h1>

//                 <p className="mt-2 text-sm leading-6 text-slate-400">
//                   {error ||
//                     "The requested quiz competition could not be found."}
//                 </p>

//                 <button
//                   type="button"
//                   onClick={() => void loadQuiz()}
//                   className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
//                 >
//                   Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * -------------------------------------------------------
//    * COMPETITION LOADED
//    * -------------------------------------------------------
//    */
//   return (
//     <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
//       <div className="mx-auto max-w-5xl">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to competitions
//         </button>

//         <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">
//           <div className="border-b border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 px-6 py-7 sm:px-8">
//             <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
//               <div>
//                 <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
//                   <Radio className="h-3.5 w-3.5" />
//                   Room Activation
//                 </div>

//                 <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
//                   {quizTitle}
//                 </h1>

//                 <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
//                   Activate the existing quiz room to make it
//                   available to contestants. Activation is a
//                   separate action and will only happen when you
//                   press the activation button.
//                 </p>
//               </div>

//               <div
//                 className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-semibold ${
//                   status === "IN_PROGRESS"
//                     ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
//                     : status === "ACTIVE"
//                       ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
//                       : "border-amber-400/20 bg-amber-400/10 text-amber-300"
//                 }`}
//               >
//                 <span className="h-1.5 w-1.5 rounded-full bg-current" />
//                 {status}
//               </div>
//             </div>
//           </div>

//           <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
//             <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//               <div className="mb-3 flex items-center gap-2 text-slate-400">
//                 <Users className="h-4 w-4" />
//                 <span className="text-xs font-medium uppercase tracking-wide">
//                   Contestants
//                 </span>
//               </div>

//               <p className="text-2xl font-bold">
//                 {contestantCount}
//                 {contestantCapacity !== null
//                   ? ` / ${contestantCapacity}`
//                   : ""}
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 Registered contestants
//               </p>
//             </div>

//             <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//               <div className="mb-3 flex items-center gap-2 text-slate-400">
//                 <Radio className="h-4 w-4" />
//                 <span className="text-xs font-medium uppercase tracking-wide">
//                   Room
//                 </span>
//               </div>

//               <p className="truncate text-sm font-semibold text-cyan-300">
//                 {roomId || "Not created"}
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 Socket.IO room ID
//               </p>
//             </div>

//             <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//               <div className="mb-3 flex items-center gap-2 text-slate-400">
//                 <ShieldCheck className="h-4 w-4" />
//                 <span className="text-xs font-medium uppercase tracking-wide">
//                   Round
//                 </span>
//               </div>

//               <p className="text-2xl font-bold">
//                 {currentRound}
//                 {totalRounds > 0
//                   ? ` / ${totalRounds}`
//                   : ""}
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 Current competition round
//               </p>
//             </div>

//             <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
//               <div className="mb-3 flex items-center gap-2 text-slate-400">
//                 <CheckCircle2 className="h-4 w-4" />
//                 <span className="text-xs font-medium uppercase tracking-wide">
//                   Subject
//                 </span>
//               </div>

//               <p className="truncate text-sm font-semibold text-white">
//                 {getStringValue(quiz.subject) ??
//                   "General"}
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 {getStringValue(quiz.difficulty) ??
//                   "Quiz competition"}
//               </p>
//             </div>
//           </div>

//           {error && (
//             <div className="mx-6 mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 sm:mx-8">
//               <div className="flex items-start gap-3">
//                 <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

//                 <div>
//                   <p className="text-sm font-semibold text-red-300">
//                     Activation failed
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-red-200/70">
//                     {error}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {successMessage && (
//             <div className="mx-6 mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 sm:mx-8">
//               <div className="flex items-start gap-3">
//                 <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

//                 <div>
//                   <p className="text-sm font-semibold text-emerald-300">
//                     Room activated
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-emerald-200/70">
//                     {successMessage}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="border-t border-white/10 px-6 py-6 sm:px-8">
//             {!roomId ? (
//               <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

//                   <div>
//                     <h2 className="text-sm font-semibold text-amber-300">
//                       Quiz room has not been created
//                     </h2>

//                     <p className="mt-1 text-sm leading-6 text-slate-400">
//                       Create the quiz room from the competitions
//                       page before attempting to activate it.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ) : status === "IN_PROGRESS" ? (
//               <div className="flex flex-col gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="flex items-start gap-3">
//                   <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

//                   <div>
//                     <h2 className="text-sm font-semibold text-emerald-300">
//                       Quiz is already in progress
//                     </h2>

//                     <p className="mt-1 text-sm text-slate-400">
//                       This room has already moved into the live
//                       quiz state.
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     router.push(
//                       `/student/quiz-board/${encodeURIComponent(
//                         quizId ?? quizCompetitionId,
//                       )}/play?role=host&roomId=${encodeURIComponent(
//                         roomId,
//                       )}`,
//                     )
//                   }
//                   className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
//                 >
//                   Enter Host Arena
//                 </button>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <h2 className="text-base font-semibold text-white">
//                     Ready to activate the room?
//                   </h2>

//                   <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
//                     The room is loaded and ready. Nothing will be
//                     activated until you press the button.
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => void handleActivate()}
//                   disabled={!canActivate}
//                   className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   {isActivating ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                       Activating...
//                     </>
//                   ) : (
//                     <>
//                       <Radio className="h-4 w-4" />
//                       Activate Room
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         </section>

//         <p className="mt-5 text-center text-xs text-slate-600">
//           Competition ID: {quizCompetitionId}
//           {" • "}
//           Room ID: {roomId || "Not available"}
//         </p>
//       </div>
//     </main>
//   );
// }









"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Radio,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { axiosInstance } from "@/lib/api/axios";
import { activateQuizRoom } from "@/lib/quiz-board/admin/activateQuizRoom";

type RecordPayload = Record<string, unknown>;

interface QuizBoard {
  _id?: string;
  id?: string;

  quiz_title?: string;
  title?: string;

  description?: string;
  subject?: string;
  difficulty?: string;

  status?: string;

  room_id?: string | null;
  roomId?: string | null;

  no_of_contestants?: number;
  max_players?: number;
  maxPlayers?: number;

  joined_users?: unknown[];
  players?: unknown[];

  current_round?: number;
  number_of_rounds?: number;

  time_per_question?: number;

  start_date?: string;
  startsAt?: string;
}

function getPayloadLayers(payload: unknown): RecordPayload[] {
  const layers: RecordPayload[] = [];

  let current: unknown = payload;

  while (
    current &&
    typeof current === "object" &&
    !Array.isArray(current)
  ) {
    const record = current as RecordPayload;

    layers.push(record);

    if (
      record.data &&
      typeof record.data === "object" &&
      !Array.isArray(record.data) &&
      record.data !== current
    ) {
      current = record.data;
      continue;
    }

    if (
      record.quiz &&
      typeof record.quiz === "object" &&
      !Array.isArray(record.quiz) &&
      record.quiz !== current
    ) {
      current = record.quiz;
      continue;
    }

    if (
      record.quizObj &&
      typeof record.quizObj === "object" &&
      !Array.isArray(record.quizObj) &&
      record.quizObj !== current
    ) {
      current = record.quizObj;
      continue;
    }

    if (
      record.quizBoard &&
      typeof record.quizBoard === "object" &&
      !Array.isArray(record.quizBoard) &&
      record.quizBoard !== current
    ) {
      current = record.quizBoard;
      continue;
    }

    break;
  }

  return layers;
}

function getRecordFromPayload(payload: unknown): QuizBoard | null {
  const layers = getPayloadLayers(payload);

  for (const layer of layers) {
    if (
      typeof layer._id === "string" ||
      typeof layer.id === "string" ||
      typeof layer.quiz_title === "string" ||
      typeof layer.title === "string"
    ) {
      return layer as QuizBoard;
    }
  }

  return null;
}

function getStringValue(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function getNumberValue(
  value: unknown,
): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function getQuizId(quiz: QuizBoard): string | null {
  return (
    getStringValue(quiz._id) ??
    getStringValue(quiz.id)
  );
}

function getRoomId(quiz: QuizBoard): string | null {
  return (
    getStringValue(quiz.room_id) ??
    getStringValue(quiz.roomId)
  );
}

function getQuizTitle(quiz: QuizBoard): string {
  return (
    getStringValue(quiz.quiz_title) ??
    getStringValue(quiz.title) ??
    "Quiz Competition"
  );
}

function getContestantCount(quiz: QuizBoard): number {
  if (Array.isArray(quiz.joined_users)) {
    return quiz.joined_users.length;
  }

  if (Array.isArray(quiz.players)) {
    return quiz.players.length;
  }

  return 0;
}

function getContestantCapacity(
  quiz: QuizBoard,
): number | null {
  return (
    getNumberValue(quiz.no_of_contestants) ??
    getNumberValue(quiz.max_players) ??
    getNumberValue(quiz.maxPlayers)
  );
}

function normalizeStatus(
  status: unknown,
): string {
  return (
    getStringValue(status)?.toUpperCase() ??
    "UNKNOWN"
  );
}

function getApiErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object"
  ) {
    const record = error as Record<string, unknown>;

    const response = record.response;

    if (
      response &&
      typeof response === "object"
    ) {
      const responseRecord =
        response as Record<string, unknown>;

      const responseData =
        responseRecord.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const dataRecord =
          responseData as Record<string, unknown>;

        const message =
          getStringValue(dataRecord.message) ??
          getStringValue(dataRecord.error) ??
          getStringValue(dataRecord.reason);

        if (message) {
          return message;
        }
      }

      const statusText =
        getStringValue(
          responseRecord.statusText,
        );

      if (statusText) {
        return statusText;
      }
    }

    const message =
      getStringValue(
        record.message,
      );

    if (message) {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while processing the quiz room.";
}

export default function QuizRoomActivationPage() {
  const params = useParams<{
    "quiz-competitionsId": string;
  }>();

  const router = useRouter();

  const quizCompetitionId = useMemo(() => {
    const value =
      params?.["quiz-competitionsId"];

    return typeof value === "string"
      ? decodeURIComponent(value).trim()
      : "";
  }, [params]);

  const [quiz, setQuiz] =
    useState<QuizBoard | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isActivating, setIsActivating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const loadQuiz = useCallback(async () => {
    if (!quizCompetitionId) {
      setError(
        "No quiz competition ID was provided.",
      );
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response =
        await axiosInstance.get(
          `/quiz/get-quiz-by-quizId/${encodeURIComponent(
            quizCompetitionId,
          )}`,
        );

      const nextQuiz =
        getRecordFromPayload(
          response?.data,
        );

      if (!nextQuiz) {
        throw new Error(
          "The quiz response did not contain valid competition data.",
        );
      }

      setQuiz(nextQuiz);
    } catch (err) {
      setQuiz(null);
      setError(
        getApiErrorMessage(err),
      );
    } finally {
      setIsLoading(false);
    }
  }, [quizCompetitionId]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  const quizId = quiz
    ? getQuizId(quiz)
    : null;

  const roomId = quiz
    ? getRoomId(quiz)
    : null;

  const quizTitle = quiz
    ? getQuizTitle(quiz)
    : "Quiz Competition";

  const contestantCount = quiz
    ? getContestantCount(quiz)
    : 0;

  const contestantCapacity = quiz
    ? getContestantCapacity(quiz)
    : null;

  const currentRound =
    getNumberValue(
      quiz?.current_round,
    ) ?? 0;

  const totalRounds =
    getNumberValue(
      quiz?.number_of_rounds,
    ) ?? 0;

  const status = normalizeStatus(
    quiz?.status,
  );

  const canActivate =
    Boolean(quizId && roomId) &&
    !isActivating &&
    status !== "IN_PROGRESS";

  const handleActivate = async () => {
    if (!quizId) {
      setError(
        "Quiz ID is missing. The competition cannot be activated.",
      );
      return;
    }

    if (!roomId) {
      setError(
        "No quiz room has been created for this competition yet.",
      );
      return;
    }

    try {
      setIsActivating(true);
      setError("");
      setSuccessMessage("");

      /*
       * activateQuizRoom handles the complete Socket.IO
       * activation flow:
       *
       * activate_room
       * room_activation_ack
       * room_activated
       *
       * Do not emit those events directly from this page.
       */
      const result =
        await activateQuizRoom(
          quizId,
          roomId,
        );

      setSuccessMessage(
        "Room activated successfully. Opening the host quiz arena...",
      );

      router.replace(
        `/student/quiz-board/${encodeURIComponent(
          result.quizId,
        )}/play?role=host&roomId=${encodeURIComponent(
          result.roomId,
        )}`,
      );
    } catch (err) {
      setError(
        getApiErrorMessage(err),
      );
      setIsActivating(false);
    }
  };

  const handleBack = () => {
    router.push(
      "/admin/secondary/quiz-board/quiz-competitions",
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-400" />
            </div>

            <div>
              <h1 className="text-lg font-semibold">
                Loading quiz room
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Preparing the competition for activation...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!quiz) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={handleBack}
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to competitions
          </button>

          <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  Unable to load competition
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {error ||
                    "The requested quiz competition could not be found."}
                </p>

                <button
                  type="button"
                  onClick={() => void loadQuiz()}
                  className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to competitions
        </button>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20">
          <div className="border-b border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  <Radio className="h-3.5 w-3.5" />
                  Room Activation
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {quizTitle}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Activate the existing quiz room to make it
                  available to the contestants. Once activation is
                  confirmed, you will enter the host quiz arena.
                </p>
              </div>

              <div
                className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  status === "IN_PROGRESS"
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : status === "ACTIVE"
                      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                      : "border-amber-400/20 bg-amber-400/10 text-amber-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {status}
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 sm:p-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-2 text-slate-400">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Contestants
                </span>
              </div>

              <p className="text-2xl font-bold">
                {contestantCount}
                {contestantCapacity !== null
                  ? ` / ${contestantCapacity}`
                  : ""}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Registered contestants
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-2 text-slate-400">
                <Radio className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Room
                </span>
              </div>

              <p className="truncate text-sm font-semibold text-cyan-300">
                {roomId || "Not created"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Socket.IO room ID
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-2 text-slate-400">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Round
                </span>
              </div>

              <p className="text-2xl font-bold">
                {currentRound}
                {totalRounds > 0
                  ? ` / ${totalRounds}`
                  : ""}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Current competition round
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Subject
                </span>
              </div>

              <p className="truncate text-sm font-semibold text-white">
                {getStringValue(quiz.subject) ??
                  "General"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {getStringValue(quiz.difficulty) ??
                  "Quiz competition"}
              </p>
            </div>
          </div>

          {error && (
            <div className="mx-6 mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 sm:mx-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                <div>
                  <p className="text-sm font-semibold text-red-300">
                    Activation failed
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-200/70">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 sm:mx-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    Room activated
                  </p>

                  <p className="mt-1 text-sm leading-6 text-emerald-200/70">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-white/10 px-6 py-6 sm:px-8">
            {!roomId ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                  <div>
                    <h2 className="text-sm font-semibold text-amber-300">
                      Quiz room has not been created
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Create the quiz room from the competitions page
                      before attempting to activate it.
                    </p>
                  </div>
                </div>
              </div>
            ) : status === "IN_PROGRESS" ? (
              <div className="flex flex-col gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                  <div>
                    <h2 className="text-sm font-semibold text-emerald-300">
                      Quiz is already in progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      This room has already moved into the live quiz
                      state.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/student/quiz-board/${encodeURIComponent(
                        quizId ?? quizCompetitionId,
                      )}/play?role=host&roomId=${encodeURIComponent(
                        roomId,
                      )}`,
                    )
                  }
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
                >
                  Enter Host Arena
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Ready to activate the room?
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                    Activation will notify the connected waiting-room
                    clients. After the server confirms
                    <span className="font-medium text-slate-300">
                      {" "}
                      room_activated
                    </span>
                    , you will be taken to the host quiz arena.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void handleActivate()}
                  disabled={!canActivate}
                  className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isActivating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <Radio className="h-4 w-4" />
                      Activate Room
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-slate-600">
          Room ID: {roomId || "Not available"}
        </p>
      </div>
    </main>
  );
}