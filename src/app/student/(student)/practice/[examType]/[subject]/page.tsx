



// "use client";

//  import { useEffect, useMemo, useState } from "react";

// import {
//   ArrowLeft,
//   ArrowRight,
//   BookOpen,
//   CheckCircle2,
//   Clock3,
//   HelpCircle,
//   Loader2,
//   Target,
//   Coins,
// } from "lucide-react";

// import {
//   useParams,
//   useRouter,
//   useSearchParams,
// } from "next/navigation";

// import { useCbtStore } from "@/stores/cbtStore";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// import {
//   createPracticeSession,
//   type PracticeMode,
// } from "@/lib/api/practice";


// /* ============================================================
//    TYPES
//    ============================================================ */

// interface ModeOption {
//   id: PracticeMode;
//   name: string;
//   description: string;
//   icon: React.ElementType;
//   secondsPerQuestion: number;
//   pointsPerCorrect: number;
// }

// interface StoredPracticeConfig {
//   subjectId: string;
//   mode: PracticeMode;
//   questionCount: number;
//   duration: number;
//   secondsPerQuestion: number;
//   pointsPerCorrect: number;
//   examType: string;
// }

// const PRACTICE_CONFIG_KEY =
//   "jamb-league-active-practice-config";

// /* ============================================================
//    PRACTICE RULES
//    ============================================================ */

// const PRACTICE_RULES: Record<
//   PracticeMode,
//   {
//     secondsPerQuestion: number;
//     pointsPerCorrect: number;
//   }
// > = {
//   quick: {
//     secondsPerQuestion: 25,
//     pointsPerCorrect: 0.02,
//   },

//   standard: {
//     secondsPerQuestion: 35,
//     pointsPerCorrect: 0.0015,
//   },

//   timed: {
//     secondsPerQuestion: 45,
//     pointsPerCorrect: 0.001,
//   },
// };

// /* ============================================================
//    MODES
//    ============================================================ */

// const modes: ModeOption[] = [
//   {
//     id: "quick",
//     name: "Quick Practice",
//     description:
//       "Answer quickly and earn the highest CBT points for every correct answer.",
//     icon: Target,
//     secondsPerQuestion: 25,
//     pointsPerCorrect: 0.02,
//   },

//   {
//     id: "standard",
//     name: "Standard Practice",
//     description:
//       "Practice at a balanced pace while earning CBT points for correct answers.",
//     icon: BookOpen,
//     secondsPerQuestion: 35,
//     pointsPerCorrect: 0.0015,
//   },

//   {
//     id: "timed",
//     name: "Timed Practice",
//     description:
//       "Practice under a longer time limit and earn CBT points for correct answers.",
//     icon: Clock3,
//     secondsPerQuestion: 45,
//     pointsPerCorrect: 0.001,
//   },
// ];

// /* ============================================================
//    QUESTION COUNTS
//    ============================================================ */

// const questionCounts = [
//   10,
//   20,
//   30,
//   40,
//   50,
// ];

// /* ============================================================
//    HELPERS
//    ============================================================ */

// function formatSubjectName(subject: string) {
//   if (!subject) {
//     return "Practice";
//   }

//   return subject
//     .replace(/-/g, " ")
//     .replace(/\b\w/g, (letter) =>
//       letter.toUpperCase(),
//     );
// }

// /* ============================================================
//    FORMAT DURATION
//    ============================================================ */

// function formatDuration(
//   totalSeconds: number,
// ) {
//   const minutes = Math.floor(
//     totalSeconds / 60,
//   );

//   const seconds =
//     totalSeconds % 60;

//   if (minutes === 0) {
//     return `${seconds} sec`;
//   }

//   if (seconds === 0) {
//     return `${minutes} min`;
//   }

//   return `${minutes} min ${seconds} sec`;
// }

// /* ============================================================
//    FORMAT POINTS
//    ============================================================ */

// function formatPoints(
//   points: number,
// ) {
//   return points.toLocaleString(
//     "en-US",
//     {
//       maximumFractionDigits: 4,
//     },
//   );
// }

// /* ============================================================
//    CONFIG COMPARISON
//    ============================================================ */

// function configsMatch(
//   first: StoredPracticeConfig | null,
//   second: StoredPracticeConfig,
// ) {
//   if (!first) {
//     return false;
//   }

//   return (
//     first.subjectId ===
//       second.subjectId &&
//     first.mode === second.mode &&
//     first.questionCount ===
//       second.questionCount &&
//     first.duration ===
//       second.duration &&
//     first.secondsPerQuestion ===
//       second.secondsPerQuestion &&
//     first.pointsPerCorrect ===
//       second.pointsPerCorrect &&
//     first.examType ===
//       second.examType
//   );
// }

// /* ============================================================
//    LOAD SAVED CONFIG
//    ============================================================ */

// function getStoredPracticeConfig():
//   | StoredPracticeConfig
//   | null {
//   if (
//     typeof window ===
//     "undefined"
//   ) {
//     return null;
//   }

//   try {
//     const raw =
//       window.localStorage.getItem(
//         PRACTICE_CONFIG_KEY,
//       );

//     if (!raw) {
//       return null;
//     }

//     const parsed =
//       JSON.parse(raw);

//     if (
//       !parsed ||
//       typeof parsed !== "object"
//     ) {
//       return null;
//     }

//     return parsed as StoredPracticeConfig;
//   } catch (error) {
//     console.error(
//       "Failed to read saved practice configuration:",
//       error,
//     );

//     return null;
//   }
// }

// /* ============================================================
//    SAVE CONFIG
//    ============================================================ */

// function savePracticeConfig(
//   config: StoredPracticeConfig,
// ) {
//   if (
//     typeof window ===
//     "undefined"
//   ) {
//     return;
//   }

//   try {
//     window.localStorage.setItem(
//       PRACTICE_CONFIG_KEY,
//       JSON.stringify(config),
//     );
//   } catch (error) {
//     console.error(
//       "Failed to save practice configuration:",
//       error,
//     );
//   }
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function PracticeConfigurationPage() {
//   const router = useRouter();

//   const params = useParams();

//   const searchParams =
//     useSearchParams();

//   /* ==========================================================
//      CBT STORE
//      ========================================================== */

//   const questions = useCbtStore(
//     (state) => state.questions,
//   );

//   const answers = useCbtStore(
//     (state) => state.answers,
//   );

//   const isStarted = useCbtStore(
//     (state) => state.isStarted,
//   );

//   const isSubmitted = useCbtStore(
//     (state) => state.isSubmitted,
//   );

//   const sessionId = useCbtStore(
//     (state) => state.sessionId,
//   );

//   const timeRemainingSeconds =
//     useCbtStore(
//       (state) =>
//         state.timeRemainingSeconds,
//     );

//   const setQuestions =
//     useCbtStore(
//       (state) => state.setQuestions,
//     );

//   const setSubjects =
//     useCbtStore(
//       (state) => state.setSubjects,
//     );

//   const setDuration =
//     useCbtStore(
//       (state) => state.setDuration,
//     );

//   const startExam =
//     useCbtStore(
//       (state) => state.startExam,
//     );

//   /* ==========================================================
//      URL VALUES
//      ========================================================== */

//   const examType = String(
//     params.examType ?? "jamb",
//   )
//     .trim()
//     .toLowerCase();

//   const subjectSlug = String(
//     params.subject ?? "",
//   )
//     .trim()
//     .toLowerCase();

//   /*
//    * Real MongoDB subject ID.
//    *
//    * Example:
//    *
//    * ?subjectId=69bd417a74676c09ac65bc56
//    */

//   const subjectId =
//     searchParams
//       .get("subjectId")
//       ?.trim() ?? "";

//   /*
//    * Optional mode.
//    *
//    * Example:
//    *
//    * ?subjectId=xxx&mode=quick
//    */

//   const initialMode =
//     searchParams.get("mode");

//   /* ==========================================================
//      STATE
//      ========================================================== */

//   const [
//     selectedMode,
//     setSelectedMode,
//   ] = useState<PracticeMode>(
//     initialMode === "quick"
//       ? "quick"
//       : initialMode === "timed"
//         ? "timed"
//         : "standard",
//   );

//   const [
//     questionCount,
//     setQuestionCount,
//   ] = useState(20);

//   const [
//     isStarting,
//     setIsStarting,
//   ] = useState(false);

//   const [
//     error,
//     setError,
//   ] = useState<string | null>(
//     null,
//   );

//   const [
//     isCheckingSession,
//     setIsCheckingSession,
//   ] = useState(true);

//   const [
//     hasMatchingActiveSession,
//     setHasMatchingActiveSession,
//   ] = useState(false);

//   /* ==========================================================
//      DISPLAY
//      ========================================================== */

//   const subjectName = useMemo(
//     () =>
//       formatSubjectName(
//         subjectSlug,
//       ),
//     [subjectSlug],
//   );

//   const examName =
//     examType.toUpperCase();

//   /* ==========================================================
//      SELECTED MODE RULES
//      ========================================================== */

//   const selectedModeRules =
//     PRACTICE_RULES[
//       selectedMode
//     ];

//   const secondsPerQuestion =
//     selectedModeRules.secondsPerQuestion;

//   const pointsPerCorrect =
//     selectedModeRules.pointsPerCorrect;

//   /*
//    * Duration is automatically calculated.
//    *
//    * Example:
//    *
//    * 20 questions × 25 seconds
//    * = 500 seconds
//    * = 8 min 20 sec
//    */

//   const totalDurationSeconds =
//     questionCount *
//     secondsPerQuestion;

//   const totalDurationMinutes =
//     Math.ceil(
//       totalDurationSeconds / 60,
//     );

//   /*
//    * Maximum possible points if every
//    * question is answered correctly.
//    */

//   const maximumPossiblePoints =
//     questionCount *
//     pointsPerCorrect;

//   /* ==========================================================
//      CURRENT CONFIGURATION
//      ========================================================== */

//   const currentConfig =
//     useMemo<StoredPracticeConfig>(
//       () => ({
//         subjectId,
//         mode: selectedMode,
//         questionCount,

//         /*
//          * Store duration in minutes because
//          * your existing API/store currently
//          * works with duration.
//          */
//         duration:
//           totalDurationMinutes,

//         secondsPerQuestion,
//         pointsPerCorrect,

//         examType,
//       }),
//       [
//         subjectId,
//         selectedMode,
//         questionCount,
//         totalDurationMinutes,
//         secondsPerQuestion,
//         pointsPerCorrect,
//         examType,
//       ],
//     );

//   /* ==========================================================
//      CHECK ACTIVE SESSION
//      ========================================================== */

//   useEffect(() => {
//     /*
//      * We only check for an active session
//      * after the component has mounted because
//      * localStorage is browser-only.
//      */

//     if (!subjectId) {
//       setIsCheckingSession(false);
//       setHasMatchingActiveSession(false);

//       return;
//     }

//     const storedConfig =
//       getStoredPracticeConfig();

//     /*
//      * An active session means:
//      *
//      * 1. CBT has started
//      * 2. CBT has NOT been submitted
//      * 3. Questions exist
//      * 4. Saved configuration matches
//      *    the current configuration
//      */

//     const activeSession =
//       Boolean(
//         isStarted &&
//           !isSubmitted &&
//           Array.isArray(
//             questions,
//           ) &&
//           questions.length > 0 &&
//           storedConfig &&
//           configsMatch(
//             storedConfig,
//             currentConfig,
//           ),
//       );

//     setHasMatchingActiveSession(
//       activeSession,
//     );

//     setIsCheckingSession(false);

//     /*
//      * IMPORTANT:
//      *
//      * If an active session exists,
//      * DO NOT call the backend.
//      *
//      * The questions, answers, timer,
//      * current question and flags remain
//      * inside Zustand.
//      */

//     if (activeSession) {
//       console.log(
//         "========================================",
//       );

//       console.log(
//         "ACTIVE PRACTICE SESSION FOUND",
//       );

//       console.log(
//         "No backend request will be made.",
//       );

//       console.log(
//         "Questions:",
//         questions.length,
//       );

//       console.log(
//         "Answers:",
//         answers,
//       );

//       console.log(
//         "Session ID:",
//         sessionId,
//       );

//       console.log(
//         "Time remaining:",
//         timeRemainingSeconds,
//       );

//       console.log(
//         "Practice mode:",
//         selectedMode,
//       );

//       console.log(
//         "Seconds per question:",
//         secondsPerQuestion,
//       );

//       console.log(
//         "Points per correct:",
//         pointsPerCorrect,
//       );

//       console.log(
//         "========================================",
//       );
//     }
//   }, [
//     subjectId,
//     selectedMode,
//     questionCount,
//     totalDurationMinutes,
//     secondsPerQuestion,
//     pointsPerCorrect,
//     examType,
//     currentConfig,
//     isStarted,
//     isSubmitted,
//     questions,
//     answers,
//     sessionId,
//     timeRemainingSeconds,
//   ]);

//   /* ==========================================================
//      RESUME ACTIVE SESSION
//      ========================================================== */

//   const handleResumePractice =
//     () => {
//       console.log(
//         "Resuming cached practice session.",
//       );

//       console.log(
//         "Session ID:",
//         sessionId,
//       );

//       console.log(
//         "Questions:",
//         questions.length,
//       );

//       console.log(
//         "Answers:",
//         answers,
//       );

//       router.push(
//         "/student/practice/cbtsubjects/session",
//       );
//     };

//   /* ==========================================================
//      START NEW PRACTICE
//      ========================================================== */

//   const handleStartPractice =
//     async () => {
//       setError(null);

//       /* --------------------------------------------------------
//          VALIDATE SUBJECT ID
//          -------------------------------------------------------- */

//       if (!subjectId) {
//         setError(
//           "Subject ID is missing. Please go back and select the subject again.",
//         );

//         return;
//       }

//       /*
//        * --------------------------------------------------------
//        * ACTIVE SESSION
//        * --------------------------------------------------------
//        */

//       if (
//         hasMatchingActiveSession
//       ) {
//         handleResumePractice();

//         return;
//       }

//       setIsStarting(true);

//       try {
//         /* ======================================================
//            DEBUG
//            ====================================================== */

//         console.log(
//           "========================================",
//         );

//         console.log(
//           "STARTING NEW PRACTICE SESSION",
//         );

//         console.log(
//           "Previous session:",
//           sessionId,
//         );

//         console.log(
//           "Previous submitted:",
//           isSubmitted,
//         );

//         console.log(
//           "Practice mode:",
//           selectedMode,
//         );

//         console.log(
//           "Questions:",
//           questionCount,
//         );

//         console.log(
//           "Seconds per question:",
//           secondsPerQuestion,
//         );

//         console.log(
//           "Total duration seconds:",
//           totalDurationSeconds,
//         );

//         console.log(
//           "Total duration minutes:",
//           totalDurationMinutes,
//         );

//         console.log(
//           "Points per correct:",
//           pointsPerCorrect,
//         );

//         console.log(
//           "Maximum possible points:",
//           maximumPossiblePoints,
//         );

//         console.log(
//           "Request configuration:",
//           currentConfig,
//         );

//         console.log(
//           "========================================",
//         );

//         /* ======================================================
//            REQUEST PAYLOAD
//            ====================================================== */

//         const payload = {
//           subjectId,
//           mode: selectedMode,
//           questionCount,

//           /*
//            * Existing API receives duration.
//            *
//            * This is now automatically derived
//            * from the selected mode.
//            */
//           duration:
//             totalDurationMinutes,

//           examType,
//         };

//         console.log(
//           "Practice session payload:",
//           payload,
//         );

//         /* ======================================================
//            CREATE NEW BACKEND SESSION
//            ====================================================== */

//         const response =
//           await createPracticeSession(
//             payload,
//           );

//         /* ======================================================
//            DEBUG RESPONSE
//            ====================================================== */

//         console.log(
//           "Practice session response:",
//           response,
//         );

//         console.log(
//           "Response JSON:",
//           JSON.stringify(
//             response,
//             null,
//             2,
//           ),
//         );

//         /* ======================================================
//            VALIDATE RESPONSE
//            ====================================================== */

//         if (!response.success) {
//           throw new Error(
//             response.message ||
//               "Failed to create practice session.",
//           );
//         }

//         const practiceData =
//           response.data;

//         if (!practiceData) {
//           throw new Error(
//             "The server did not return practice session data.",
//           );
//         }

//         if (
//           !Array.isArray(
//             practiceData.questions,
//           )
//         ) {
//           throw new Error(
//             "The server did not return practice questions.",
//           );
//         }

//         if (
//           practiceData.questions.length ===
//           0
//         ) {
//           throw new Error(
//             "No questions were returned for this practice session.",
//           );
//         }

//         /* ======================================================
//            CONVERT API QUESTIONS → CBT QUESTIONS
//            ====================================================== */

//         const cbtQuestions =
//           practiceData.questions.map(
//             (question) => ({
//               _id: question._id,

//               question:
//                 question.question,

//               options:
//                 question.options,

//               questionType:
//                 question.questionType,

//               difficulty:
//                 question.difficulty,

//               /*
//                * These fields are stored in Zustand
//                * for frontend result calculation.
//                *
//                * They should NOT be displayed
//                * while the student is answering.
//                */

//               answer:
//                 question.answer,

//               correctAnswers:
//                 question.correctAnswers,

//               explanation:
//                 question.explanation,

//               solution:
//                 question.solution,

//               examType:
//                 question.examType,

//               examYear:
//                 question.examYear,

//               apiQuestionId:
//                 question.apiQuestionId,

//               imageId:
//                 question.imageId,

//               passageId:
//                 question.passageId,

//               media:
//                 question.media,

//               content:
//                 question.content,

//               isMultipleAnswer:
//                 question.isMultipleAnswer,

//               marks:
//                 question.marks,

//               topic:
//                 question.topic,

//               section:
//                 question.section,

//               plan:
//                 question.plan,

//               subject:
//                 question.subject,
//             }),
//           );

//         /* ======================================================
//            STORE NEW QUESTIONS
//            ====================================================== */

//         setQuestions(
//           cbtQuestions,
//         );

//         /* ======================================================
//            STORE SUBJECT
//            ====================================================== */

//         setSubjects([
//           {
//             _id:
//               practiceData.subjectId,

//             name:
//               subjectName,

//             slug:
//               subjectSlug,
//           },
//         ]);

//         /* ======================================================
//            STORE TIMER
//            ====================================================== */

//         /*
//          * Use the backend duration when available.
//          *
//          * Otherwise use our calculated duration.
//          */

//         setDuration(
//           practiceData.duration ??
//             totalDurationMinutes,
//         );

//         /* ======================================================
//            SAVE PRACTICE CONFIGURATION
//            ====================================================== */

//         savePracticeConfig(
//           currentConfig,
//         );

//         /* ======================================================
//            START CBT
//            ====================================================== */

//         startExam();

//         /* ======================================================
//            DEBUG
//            ====================================================== */

//         console.log(
//           "========================================",
//         );

//         console.log(
//           "NEW PRACTICE READY",
//         );

//         console.log(
//           "Questions stored:",
//           cbtQuestions.length,
//         );

//         console.log(
//           "Practice mode:",
//           selectedMode,
//         );

//         console.log(
//           "Seconds per question:",
//           secondsPerQuestion,
//         );

//         console.log(
//           "Duration:",
//           totalDurationMinutes,
//           "minutes",
//         );

//         console.log(
//           "Points per correct:",
//           pointsPerCorrect,
//         );

//         console.log(
//           "Maximum possible points:",
//           maximumPossiblePoints,
//         );

//         console.log(
//           "Configuration:",
//           currentConfig,
//         );

//         console.log(
//           "Navigating to CBT session...",
//         );

//         console.log(
//           "========================================",
//         );

//         /* ======================================================
//            NAVIGATE
//            ====================================================== */

//         router.push(
//           "/student/practice/cbtsubjects/session",
//         );
//       } catch (err) {
//         console.error(
//           "Failed to start practice:",
//           err,
//         );

//         setError(
//           err instanceof Error
//             ? err.message
//             : "Failed to start practice.",
//         );
//       } finally {
//         setIsStarting(false);
//       }
//     };

//   /* ==========================================================
//      HANDLE MODE CHANGE
//      ========================================================== */

//   const handleModeChange = (
//     mode: PracticeMode,
//   ) => {
//     setSelectedMode(mode);

//     setHasMatchingActiveSession(
//       false,
//     );

//     setError(null);
//   };

//   /* ==========================================================
//      HANDLE QUESTION COUNT CHANGE
//      ========================================================== */

//   const handleQuestionCountChange =
//     (count: number) => {
//       setQuestionCount(count);

//       setHasMatchingActiveSession(
//         false,
//       );

//       setError(null);
//     };

//   /* ==========================================================
//      SELECTED MODE OBJECT
//      ========================================================== */

//   const selectedModeInfo =
//     modes.find(
//       (mode) =>
//         mode.id === selectedMode,
//     );

//   /* ==========================================================
//      RENDER
//      ========================================================== */

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-10">

//         {/* ====================================================
//             BACK
//            ==================================================== */}

//         <button
//           type="button"
//           onClick={() =>
//             router.back()
//           }
//           className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
//         >
//           <ArrowLeft className="h-4 w-4" />

//           Back
//         </button>

//         {/* ====================================================
//             HEADER
//            ==================================================== */}

//         <section className="mb-8">
//           <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-blue-700">
//             {examName} Practice
//           </div>

//           <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//             {subjectName} Practice
//           </h1>

//           <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
//             Choose your practice mode
//             and number of questions.
//             Your time and CBT point
//             rate are automatically
//             determined by the mode.
//           </p>
//         </section>

//         {/* ====================================================
//             ACTIVE SESSION
//            ==================================================== */}

//         {!isCheckingSession &&
//           hasMatchingActiveSession && (
//             <section className="mb-8">
//               <Card className="border-emerald-200 bg-emerald-50 p-6">
//                 <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

//                   <div className="flex items-start gap-4">
//                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
//                       <CheckCircle2 className="h-6 w-6" />
//                     </div>

//                     <div>
//                       <h2 className="font-black text-emerald-950">
//                         Practice in Progress
//                       </h2>

//                       <p className="mt-1 text-sm leading-6 text-emerald-800">
//                         You already have an
//                         unfinished practice
//                         session for this
//                         configuration.
//                       </p>

//                       <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-emerald-700">
//                         <span>
//                           {
//                             questions.length
//                           }{" "}
//                           questions
//                         </span>

//                         <span>
//                           {
//                             Object.keys(
//                               answers ??
//                                 {},
//                             ).length
//                           }{" "}
//                           answered
//                         </span>

//                         {sessionId && (
//                           <span>
//                             Session active
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <Button
//                     size="lg"
//                     onClick={
//                       handleResumePractice
//                     }
//                     rightIcon={
//                       <ArrowRight className="h-5 w-5" />
//                     }
//                   >
//                     Resume Practice
//                   </Button>
//                 </div>
//               </Card>
//             </section>
//           )}

//         {/* ====================================================
//             SUBJECT ID WARNING
//            ==================================================== */}

//         {!subjectId && (
//           <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
//             Subject ID is missing from
//             the URL. Please go back and
//             select the subject again.
//           </div>
//         )}

//         {/* ====================================================
//             ERROR
//            ==================================================== */}

//         {error && (
//           <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
//             {error}
//           </div>
//         )}

//         {/* ====================================================
//             STEP 1 — MODE
//            ==================================================== */}

//         <section className="mb-8">
//           <div className="mb-5 flex items-center gap-3">
//             <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
//               1
//             </span>

//             <div>
//               <h2 className="text-xl font-black text-slate-900">
//                 Choose Practice Mode
//               </h2>

//               <p className="text-sm text-slate-500">
//                 Your mode determines
//                 your time per question
//                 and CBT point reward.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             {modes.map(
//               (mode) => {
//                 const Icon =
//                   mode.icon;

//                 const selected =
//                   selectedMode ===
//                   mode.id;

//                 return (
//                   <button
//                     key={mode.id}
//                     type="button"
//                     onClick={() =>
//                       handleModeChange(
//                         mode.id,
//                       )
//                     }
//                     className={[
//                       "relative rounded-2xl border-2 bg-white p-5 text-left transition-all",
//                       "hover:-translate-y-0.5 hover:shadow-md",
//                       "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
//                       selected
//                         ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                         : "border-slate-200",
//                     ].join(" ")}
//                   >
//                     {selected && (
//                       <div className="absolute right-4 top-4">
//                         <CheckCircle2 className="h-5 w-5 text-blue-600" />
//                       </div>
//                     )}

//                     <div
//                       className={[
//                         "flex h-12 w-12 items-center justify-center rounded-xl",
//                         selected
//                           ? "bg-blue-600 text-white"
//                           : "bg-slate-100 text-slate-600",
//                       ].join(" ")}
//                     >
//                       <Icon className="h-6 w-6" />
//                     </div>

//                     <h3 className="mt-4 font-black text-slate-900">
//                       {mode.name}
//                     </h3>

//                     <p className="mt-2 text-sm leading-6 text-slate-500">
//                       {
//                         mode.description
//                       }
//                     </p>

//                     {/* MODE RULES */}

//                     <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-slate-500">
//                           Time/question
//                         </span>

//                         <span className="font-black text-slate-900">
//                           {
//                             mode.secondsPerQuestion
//                           }{" "}
//                           sec
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-slate-500">
//                           Correct answer
//                         </span>

//                         <span className="font-black text-blue-700">
//                           +
//                           {
//                             mode.pointsPerCorrect
//                           }
//                         </span>
//                       </div>
//                     </div>
//                   </button>
//                 );
//               },
//             )}
//           </div>
//         </section>

//         {/* ====================================================
//             STEP 2 — QUESTIONS
//            ==================================================== */}

//         <section className="mb-8">
//           <div className="mb-5 flex items-center gap-3">
//             <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
//               2
//             </span>

//             <div>
//               <h2 className="text-xl font-black text-slate-900">
//                 Number of Questions
//               </h2>

//               <p className="text-sm text-slate-500">
//                 Choose how many questions
//                 you want to answer.
//               </p>
//             </div>
//           </div>

//           <Card className="p-5">
//             <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
//               {questionCounts.map(
//                 (count) => {
//                   const selected =
//                     questionCount ===
//                     count;

//                   return (
//                     <button
//                       key={count}
//                       type="button"
//                       onClick={() =>
//                         handleQuestionCountChange(
//                           count,
//                         )
//                       }
//                       className={[
//                         "rounded-xl border-2 px-4 py-4 text-center font-bold transition",
//                         selected
//                           ? "border-blue-500 bg-blue-50 text-blue-700"
//                           : "border-slate-200 bg-white text-slate-600 hover:border-blue-300",
//                       ].join(" ")}
//                     >
//                       {count}
//                     </button>
//                   );
//                 },
//               )}
//             </div>
//           </Card>
//         </section>

//         {/* ====================================================
//             STEP 3 — AUTOMATIC TIME & REWARD
//            ==================================================== */}

//         <section className="mb-8">
//           <div className="mb-5 flex items-center gap-3">
//             <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
//               3
//             </span>

//             <div>
//               <h2 className="text-xl font-black text-slate-900">
//                 Practice Rules
//               </h2>

//               <p className="text-sm text-slate-500">
//                 Your selected mode
//                 automatically determines
//                 the time and reward.
//               </p>
//             </div>
//           </div>

//           <Card className="border-blue-200 bg-white p-6">
//             <div className="grid gap-4 sm:grid-cols-3">

//               {/* TIME PER QUESTION */}

//               <div className="rounded-2xl bg-slate-50 p-5">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
//                     <Clock3 className="h-5 w-5" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//                       Time / Question
//                     </p>

//                     <p className="mt-1 text-2xl font-black text-slate-900">
//                       {
//                         secondsPerQuestion
//                       }{" "}
//                       sec
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* TOTAL TIME */}

//               <div className="rounded-2xl bg-slate-50 p-5">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
//                     <Clock3 className="h-5 w-5" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//                       Total Time
//                     </p>

//                     <p className="mt-1 text-2xl font-black text-slate-900">
//                       {formatDuration(
//                         totalDurationSeconds,
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* REWARD */}

//               <div className="rounded-2xl bg-slate-50 p-5">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
//                     <Coins className="h-5 w-5" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//                       Correct Answer
//                     </p>

//                     <p className="mt-1 text-2xl font-black text-emerald-700">
//                       +
//                       {
//                         pointsPerCorrect
//                       }
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* MAXIMUM REWARD */}

//             <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
//               <div className="flex items-start gap-3">
//                 <Coins className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

//                 <div>
//                   <p className="font-black text-emerald-950">
//                     Maximum CBT Points
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-emerald-800">
//                     If you answer all{" "}
//                     <strong>
//                       {questionCount}
//                     </strong>{" "}
//                     questions correctly,
//                     you can earn up to{" "}
//                     <strong>
//                       {
//                         formatPoints(
//                           maximumPossiblePoints,
//                         )
//                       }
//                     </strong>{" "}
//                     CBT points in this
//                     practice session.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </section>

//         {/* ====================================================
//             SESSION SUMMARY
//            ==================================================== */}

//         <section className="mb-8">
//           <Card className="border-blue-200 bg-blue-50 p-6">
//             <div className="flex items-start gap-4">
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
//                 <HelpCircle className="h-6 w-6" />
//               </div>

//               <div className="min-w-0">
//                 <h2 className="font-black text-slate-900">
//                   Session Summary
//                 </h2>

//                 <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">

//                   <p>
//                     <strong>
//                       Exam:
//                     </strong>{" "}
//                     {examName}
//                   </p>

//                   <p>
//                     <strong>
//                       Subject:
//                     </strong>{" "}
//                     {subjectName}
//                   </p>

//                   <p>
//                     <strong>
//                       Mode:
//                     </strong>{" "}
//                     {
//                       selectedModeInfo?.name
//                     }
//                   </p>

//                   <p>
//                     <strong>
//                       Questions:
//                     </strong>{" "}
//                     {questionCount}
//                   </p>

//                   <p>
//                     <strong>
//                       Time/question:
//                     </strong>{" "}
//                     {
//                       secondsPerQuestion
//                     }{" "}
//                     seconds
//                   </p>

//                   <p>
//                     <strong>
//                       Total duration:
//                     </strong>{" "}
//                     {formatDuration(
//                       totalDurationSeconds,
//                     )}
//                   </p>

//                   <p>
//                     <strong>
//                       Correct answer:
//                     </strong>{" "}
//                     <span className="font-black text-emerald-700">
//                       +
//                       {
//                         pointsPerCorrect
//                       }{" "}
//                       CBT points
//                     </span>
//                   </p>

//                   <p>
//                     <strong>
//                       Maximum reward:
//                     </strong>{" "}
//                     <span className="font-black text-emerald-700">
//                       {
//                         formatPoints(
//                           maximumPossiblePoints,
//                         )
//                       }{" "}
//                       points
//                     </span>
//                   </p>

//                   {/* <p className="sm:col-span-2">
//                     <strong>
//                       Subject ID:
//                     </strong>{" "}
//                     <span className="break-all">
//                       {subjectId ||
//                         "Missing"}
//                     </span>
//                   </p> */}

//                 </div>
//               </div>
//             </div>
//           </Card>
//         </section>

//         {/* ====================================================
//             START / RESUME
//            ==================================================== */}

//         <section>
//           <Button
//             size="lg"
//             fullWidth
//             disabled={
//               isStarting ||
//               isCheckingSession ||
//               !subjectId
//             }
//             onClick={
//               hasMatchingActiveSession
//                 ? handleResumePractice
//                 : handleStartPractice
//             }
//             rightIcon={
//               isCheckingSession ||
//               isStarting ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : (
//                 <ArrowRight className="h-5 w-5" />
//               )
//             }
//           >
//             {isCheckingSession
//               ? "Checking Practice..."
//               : isStarting
//                 ? "Starting Practice..."
//                 : hasMatchingActiveSession
//                   ? "Resume Practice"
//                   : "Start Practice"}
//           </Button>
//         </section>
//       </div>
//     </main>
//   );
// }







"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Coins,
  HelpCircle,
  Loader2,
  Target,
  type LucideIcon,
} from "lucide-react";

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useCbtStore } from "@/stores/cbtStore";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  createPracticeSession,
  type PracticeMode,
} from "@/lib/api/practice";

import {
  getAllPracticeModes,
} from "@/lib/api/practice-modes";

/* ============================================================
   TYPES
   ============================================================ */

interface BackendPracticeMode {
  _id: string;
  name: string;
  description: string;
  timePerQuestion: number;
  awardedPointPerCorrectAnswer: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ModeOption {
  id: PracticeMode;
  backendId: string;
  name: string;
  description: string;
  icon: LucideIcon;
  secondsPerQuestion: number;
  pointsPerCorrect: number;
}

interface StoredPracticeConfig {
  subjectId: string;
  mode: PracticeMode;
  questionCount: number;
  duration: number;
  secondsPerQuestion: number;
  pointsPerCorrect: number;
  examType: string;
}

const PRACTICE_CONFIG_KEY =
  "jamb-league-active-practice-config";

/* ============================================================
   MODE ICON
   ============================================================ */

function getModeIcon(
  modeName: string,
): LucideIcon {
  const name =
    modeName.toLowerCase();

  if (name.includes("quick")) {
    return Target;
  }

  if (name.includes("timed")) {
    return Clock3;
  }

  return BookOpen;
}

/* ============================================================
   MODE ID
   ============================================================ */

function getModeId(
  modeName: string,
): PracticeMode | null {
  const name =
    modeName
      .toLowerCase()
      .trim();

  if (name.includes("quick")) {
    return "quick";
  }

  if (name.includes("standard")) {
    return "standard";
  }

  if (name.includes("timed")) {
    return "timed";
  }

  return null;
}

/* ============================================================
   FORMAT SUBJECT NAME
   ============================================================ */

function formatSubjectName(
  subject: string,
) {
  if (!subject) {
    return "Practice";
  }

  return subject
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

/* ============================================================
   FORMAT DURATION
   ============================================================ */

function formatDuration(
  totalSeconds: number,
) {
  const safeSeconds =
    Number.isFinite(totalSeconds)
      ? Math.max(
          0,
          Math.round(totalSeconds),
        )
      : 0;

  const minutes =
    Math.floor(
      safeSeconds / 60,
    );

  const seconds =
    safeSeconds % 60;

  if (minutes === 0) {
    return `${seconds} sec`;
  }

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds} sec`;
}

/* ============================================================
   FORMAT CBT POINTS
   ============================================================

   IMPORTANT:

   Backend values can be:

   0.02
   0.0015
   0.001

   We deliberately preserve the decimal portion so
   these values never appear as "0".
   ============================================================ */

function formatPoints(
  points: number,
) {
  const numericPoints =
    Number(points);

  if (
    !Number.isFinite(
      numericPoints,
    )
  ) {
    return "0";
  }

  if (numericPoints === 0) {
    return "0";
  }

  /*
   * Keep enough decimal places for
   * small CBT point values.
   *
   * Examples:
   *
   * 0.02   -> 0.02
   * 0.0015 -> 0.0015
   * 0.001  -> 0.001
   * 0.4    -> 0.4
   * 2      -> 2
   */
  return numericPoints
    .toFixed(4)
    .replace(/\.?0+$/, "");
}

/* ============================================================
   CONFIG COMPARISON
   ============================================================ */

function configsMatch(
  first: StoredPracticeConfig | null,
  second: StoredPracticeConfig,
) {
  if (!first) {
    return false;
  }

  return (
    first.subjectId ===
      second.subjectId &&
    first.mode ===
      second.mode &&
    first.questionCount ===
      second.questionCount &&
    first.duration ===
      second.duration &&
    first.secondsPerQuestion ===
      second.secondsPerQuestion &&
    first.pointsPerCorrect ===
      second.pointsPerCorrect &&
    first.examType ===
      second.examType
  );
}

/* ============================================================
   LOAD SAVED CONFIG
   ============================================================ */

function getStoredPracticeConfig():
  | StoredPracticeConfig
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const raw =
      window.localStorage.getItem(
        PRACTICE_CONFIG_KEY,
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return null;
    }

    return parsed as StoredPracticeConfig;
  } catch (error) {
    console.error(
      "Failed to read saved practice configuration:",
      error,
    );

    return null;
  }
}

/* ============================================================
   SAVE CONFIG
   ============================================================ */

function savePracticeConfig(
  config: StoredPracticeConfig,
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    window.localStorage.setItem(
      PRACTICE_CONFIG_KEY,
      JSON.stringify(config),
    );
  } catch (error) {
    console.error(
      "Failed to save practice configuration:",
      error,
    );
  }
}

/* ============================================================
   PAGE
   ============================================================ */

export default function PracticeConfigurationPage() {
  const router = useRouter();

  const params = useParams();

  const searchParams =
    useSearchParams();

  /* ==========================================================
     CBT STORE
     ========================================================== */

  const questions = useCbtStore(
    (state) => state.questions,
  );

  const answers = useCbtStore(
    (state) => state.answers,
  );

  const isStarted = useCbtStore(
    (state) => state.isStarted,
  );

  const isSubmitted = useCbtStore(
    (state) => state.isSubmitted,
  );

  const sessionId = useCbtStore(
    (state) => state.sessionId,
  );

  const timeRemainingSeconds =
    useCbtStore(
      (state) =>
        state.timeRemainingSeconds,
    );

  const setQuestions =
    useCbtStore(
      (state) => state.setQuestions,
    );

  const setSubjects =
    useCbtStore(
      (state) => state.setSubjects,
    );

  const setDuration =
    useCbtStore(
      (state) => state.setDuration,
    );

  const startExam =
    useCbtStore(
      (state) => state.startExam,
    );

  /* ==========================================================
     URL VALUES
     ========================================================== */

  const examType = String(
    params.examType ?? "jamb",
  )
    .trim()
    .toLowerCase();

  const subjectSlug = String(
    params.subject ?? "",
  )
    .trim()
    .toLowerCase();

  const subjectId =
    searchParams
      .get("subjectId")
      ?.trim() ?? "";

  const initialMode =
    searchParams
      .get("mode")
      ?.trim()
      .toLowerCase();

  /* ==========================================================
     BACKEND MODES
     ========================================================== */

  const [
    modes,
    setModes,
  ] = useState<ModeOption[]>([]);

  const [
    isLoadingModes,
    setIsLoadingModes,
  ] = useState(true);

  const [
    modesError,
    setModesError,
  ] = useState<string | null>(
    null,
  );

  /* ==========================================================
     STATE
     ========================================================== */

  const [
    selectedMode,
    setSelectedMode,
  ] = useState<PracticeMode>(
    initialMode === "quick"
      ? "quick"
      : initialMode === "timed"
        ? "timed"
        : "standard",
  );

  const [
    questionCount,
    setQuestionCount,
  ] = useState(20);

  const [
    isStarting,
    setIsStarting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    isCheckingSession,
    setIsCheckingSession,
  ] = useState(true);

  const [
    hasMatchingActiveSession,
    setHasMatchingActiveSession,
  ] = useState(false);

  /* ==========================================================
     FETCH PRACTICE MODES
     ========================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadModes =
      async () => {
        setIsLoadingModes(true);
        setModesError(null);

        try {
          console.log(
            "========================================",
          );

          console.log(
            "FETCHING PRACTICE MODES",
          );

          const response =
            await getAllPracticeModes();

          console.log(
            "Practice modes response:",
            response,
          );

          console.log(
            "Practice modes response JSON:",
            JSON.stringify(
              response,
              null,
              2,
            ),
          );

          if (!response?.success) {
            throw new Error(
              response?.message ||
                "Failed to load practice modes.",
            );
          }

          const backendModes: BackendPracticeMode[] =
            Array.isArray(
              response.data,
            )
              ? response.data
              : [];

          /*
           * IMPORTANT:
           *
           * We build the array without returning null
           * from map().
           *
           * This completely removes the:
           *
           * "Type 'null' is not assignable to ModeOption"
           *
           * problem.
           */

          const mappedModes: ModeOption[] =
            backendModes.reduce<
              ModeOption[]
            >(
              (
                result,
                mode,
              ) => {
                if (
                  mode.isActive ===
                  false
                ) {
                  return result;
                }

                const modeId =
                  getModeId(
                    mode.name,
                  );

                if (!modeId) {
                  console.warn(
                    "Ignoring unknown practice mode:",
                    mode.name,
                  );

                  return result;
                }

                const seconds =
                  Number(
                    mode.timePerQuestion,
                  );

                const points =
                  Number(
                    mode.awardedPointPerCorrectAnswer,
                  );

                const normalizedSeconds =
                  Number.isFinite(
                    seconds,
                  )
                    ? seconds
                    : 0;

                const normalizedPoints =
                  Number.isFinite(
                    points,
                  )
                    ? points
                    : 0;

                const mappedMode: ModeOption =
                  {
                    id: modeId,

                    backendId:
                      mode._id,

                    name:
                      mode.name
                        .replace(
                          /\b\w/g,
                          (letter) =>
                            letter.toUpperCase(),
                        ),

                    description:
                      mode.description,

                    icon:
                      getModeIcon(
                        mode.name,
                      ),

                    secondsPerQuestion:
                      normalizedSeconds,

                    pointsPerCorrect:
                      normalizedPoints,
                  };

                result.push(
                  mappedMode,
                );

                return result;
              },
              [],
            );

          console.log(
            "Mapped backend modes:",
            mappedModes,
          );

          console.log(
            "Mapped CBT point values:",
            mappedModes.map(
              (mode) => ({
                name:
                  mode.name,

                backendId:
                  mode.backendId,

                pointsPerCorrect:
                  mode.pointsPerCorrect,

                formatted:
                  formatPoints(
                    mode.pointsPerCorrect,
                  ),
              }),
            ),
          );

          if (!cancelled) {
            setModes(
              mappedModes,
            );

            /*
             * If the current selected mode
             * exists in the backend, keep it.
             *
             * Otherwise select the first
             * backend mode.
             */

            const requestedMode =
              mappedModes.find(
                (mode) =>
                  mode.id ===
                  selectedMode,
              );

            if (
              !requestedMode &&
              mappedModes.length >
                0
            ) {
              setSelectedMode(
                mappedModes[0].id,
              );
            }
          }

          console.log(
            "========================================",
          );
        } catch (err) {
          console.error(
            "Failed to load practice modes:",
            err,
          );

          if (!cancelled) {
            setModesError(
              err instanceof Error
                ? err.message
                : "Failed to load practice modes.",
            );
          }
        } finally {
          if (!cancelled) {
            setIsLoadingModes(
              false,
            );
          }
        }
      };

    void loadModes();

    return () => {
      cancelled = true;
    };
  }, [selectedMode]);

  /* ==========================================================
     DISPLAY
     ========================================================== */

  const subjectName = useMemo(
    () =>
      formatSubjectName(
        subjectSlug,
      ),
    [subjectSlug],
  );

  const examName =
    examType.toUpperCase();

  /* ==========================================================
     SELECTED BACKEND MODE
     ========================================================== */

  const selectedModeInfo =
    useMemo<ModeOption | undefined>(
      () =>
        modes.find(
          (mode) =>
            mode.id ===
            selectedMode,
        ),
      [
        modes,
        selectedMode,
      ],
    );

  /* ==========================================================
     BACKEND VALUES
     ========================================================== */

  const secondsPerQuestion =
    selectedModeInfo
      ?.secondsPerQuestion ??
    0;

  const pointsPerCorrect =
    selectedModeInfo
      ?.pointsPerCorrect ??
    0;

  /* ==========================================================
     AUTOMATIC TIME
     ========================================================== */

  const totalDurationSeconds =
    questionCount *
    secondsPerQuestion;

  const totalDurationMinutes =
    Math.ceil(
      totalDurationSeconds / 60,
    );

  /* ==========================================================
     MAXIMUM REWARD
     ========================================================== */

  const maximumPossiblePoints =
    questionCount *
    pointsPerCorrect;

  /* ==========================================================
     CURRENT CONFIGURATION
     ========================================================== */

  const currentConfig =
    useMemo<StoredPracticeConfig>(
      () => ({
        subjectId,
        mode: selectedMode,
        questionCount,

        duration:
          totalDurationMinutes,

        secondsPerQuestion,
        pointsPerCorrect,

        examType,
      }),
      [
        subjectId,
        selectedMode,
        questionCount,
        totalDurationMinutes,
        secondsPerQuestion,
        pointsPerCorrect,
        examType,
      ],
    );

  /* ==========================================================
     CHECK ACTIVE SESSION
     ========================================================== */

  useEffect(() => {
    if (
      isLoadingModes
    ) {
      return;
    }

    if (!subjectId) {
      setIsCheckingSession(false);

      setHasMatchingActiveSession(
        false,
      );

      return;
    }

    const storedConfig =
      getStoredPracticeConfig();

    const activeSession =
      Boolean(
        isStarted &&
          !isSubmitted &&
          Array.isArray(
            questions,
          ) &&
          questions.length > 0 &&
          storedConfig &&
          configsMatch(
            storedConfig,
            currentConfig,
          ),
      );

    setHasMatchingActiveSession(
      activeSession,
    );

    setIsCheckingSession(false);

    if (activeSession) {
      console.log(
        "========================================",
      );

      console.log(
        "ACTIVE PRACTICE SESSION FOUND",
      );

      console.log(
        "No backend request will be made.",
      );

      console.log(
        "Questions:",
        questions.length,
      );

      console.log(
        "Answers:",
        answers,
      );

      console.log(
        "Session ID:",
        sessionId,
      );

      console.log(
        "Time remaining:",
        timeRemainingSeconds,
      );

      console.log(
        "Practice mode:",
        selectedMode,
      );

      console.log(
        "Backend seconds/question:",
        secondsPerQuestion,
      );

      console.log(
        "Backend points/correct:",
        pointsPerCorrect,
      );

      console.log(
        "Formatted points:",
        formatPoints(
          pointsPerCorrect,
        ),
      );

      console.log(
        "========================================",
      );
    }
  }, [
    subjectId,
    selectedMode,
    questionCount,
    totalDurationMinutes,
    secondsPerQuestion,
    pointsPerCorrect,
    examType,
    currentConfig,
    isLoadingModes,
    isStarted,
    isSubmitted,
    questions,
    answers,
    sessionId,
    timeRemainingSeconds,
  ]);

  /* ==========================================================
     RESUME
     ========================================================== */

  const handleResumePractice =
    () => {
      console.log(
        "Resuming cached practice session.",
      );

      console.log(
        "Session ID:",
        sessionId,
      );

      console.log(
        "Questions:",
        questions.length,
      );

      console.log(
        "Answers:",
        answers,
      );

      router.push(
        "/student/practice/cbtsubjects/session",
      );
    };

  /* ==========================================================
     START PRACTICE
     ========================================================== */

  const handleStartPractice =
    async () => {
      setError(null);

      if (!subjectId) {
        setError(
          "Subject ID is missing. Please go back and select the subject again.",
        );

        return;
      }

      /*
       * TypeScript now knows that this is
       * ModeOption | undefined.
       *
       * We explicitly check it before using it.
       */

      if (
        !selectedModeInfo
      ) {
        setError(
          "Practice mode information is not available yet.",
        );

        return;
      }

      if (
        hasMatchingActiveSession
      ) {
        handleResumePractice();

        return;
      }

      setIsStarting(true);

      try {
        console.log(
          "========================================",
        );

        console.log(
          "STARTING NEW PRACTICE SESSION",
        );

        console.log(
          "Practice mode:",
          selectedMode,
        );

        console.log(
          "Backend mode ID:",
          selectedModeInfo.backendId,
        );

        console.log(
          "Questions:",
          questionCount,
        );

        console.log(
          "Backend seconds/question:",
          secondsPerQuestion,
        );

        console.log(
          "Backend points/correct:",
          pointsPerCorrect,
        );

        console.log(
          "Formatted backend points:",
          formatPoints(
            pointsPerCorrect,
          ),
        );

        console.log(
          "Total duration seconds:",
          totalDurationSeconds,
        );

        console.log(
          "Total duration minutes:",
          totalDurationMinutes,
        );

        console.log(
          "Maximum possible points:",
          maximumPossiblePoints,
        );

        console.log(
          "Formatted maximum points:",
          formatPoints(
            maximumPossiblePoints,
          ),
        );

        console.log(
          "Request configuration:",
          currentConfig,
        );

        console.log(
          "========================================",
        );

        /* ======================================================
           REQUEST PAYLOAD
           ====================================================== */

        const payload = {
          subjectId,
          mode: selectedMode,
          questionCount,
          duration:
            totalDurationMinutes,
          examType,
        };

        console.log(
          "Practice session payload:",
          payload,
        );

        /* ======================================================
           CREATE BACKEND SESSION
           ====================================================== */

        const response =
          await createPracticeSession(
            payload,
          );

        console.log(
          "Practice session response:",
          response,
        );

        console.log(
          "Response JSON:",
          JSON.stringify(
            response,
            null,
            2,
          ),
        );

        /* ======================================================
           VALIDATE RESPONSE
           ====================================================== */

        if (!response.success) {
          throw new Error(
            response.message ||
              "Failed to create practice session.",
          );
        }

        const practiceData =
          response.data;

        if (!practiceData) {
          throw new Error(
            "The server did not return practice session data.",
          );
        }

        if (
          !Array.isArray(
            practiceData.questions,
          )
        ) {
          throw new Error(
            "The server did not return practice questions.",
          );
        }

        if (
          practiceData.questions.length ===
          0
        ) {
          throw new Error(
            "No questions were returned for this practice session.",
          );
        }

        /* ======================================================
           CONVERT QUESTIONS
           ====================================================== */

        const cbtQuestions =
          practiceData.questions.map(
            (question) => ({
              _id:
                question._id,

              question:
                question.question,

              options:
                question.options,

              questionType:
                question.questionType,

              difficulty:
                question.difficulty,

              answer:
                question.answer,

              correctAnswers:
                question.correctAnswers,

              explanation:
                question.explanation,

              solution:
                question.solution,

              examType:
                question.examType,

              examYear:
                question.examYear,

              apiQuestionId:
                question.apiQuestionId,

              imageId:
                question.imageId,

              passageId:
                question.passageId,

              media:
                question.media,

              content:
                question.content,

              isMultipleAnswer:
                question.isMultipleAnswer,

              marks:
                question.marks,

              topic:
                question.topic,

              section:
                question.section,

              plan:
                question.plan,

              subject:
                question.subject,
            }),
          );

        /* ======================================================
           STORE QUESTIONS
           ====================================================== */

        setQuestions(
          cbtQuestions,
        );

        /* ======================================================
           STORE SUBJECT
           ====================================================== */

        setSubjects([
          {
            _id:
              practiceData.subjectId,

            name:
              subjectName,

            slug:
              subjectSlug,
          },
        ]);

        /* ======================================================
           STORE TIMER
           ====================================================== */

        setDuration(
          practiceData.duration ??
            totalDurationMinutes,
        );

        /* ======================================================
           SAVE CONFIG
           ====================================================== */

        savePracticeConfig(
          currentConfig,
        );

        /* ======================================================
           START CBT
           ====================================================== */

        startExam();

        console.log(
          "========================================",
        );

        console.log(
          "NEW PRACTICE READY",
        );

        console.log(
          "Questions stored:",
          cbtQuestions.length,
        );

        console.log(
          "Practice mode:",
          selectedMode,
        );

        console.log(
          "Backend seconds/question:",
          secondsPerQuestion,
        );

        console.log(
          "Backend points/correct:",
          pointsPerCorrect,
        );

        console.log(
          "Formatted points:",
          formatPoints(
            pointsPerCorrect,
          ),
        );

        console.log(
          "Maximum possible points:",
          maximumPossiblePoints,
        );

        console.log(
          "Navigating to CBT session...",
        );

        console.log(
          "========================================",
        );

        router.push(
          "/student/practice/cbtsubjects/session",
        );
      } catch (err) {
        console.error(
          "Failed to start practice:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to start practice.",
        );
      } finally {
        setIsStarting(false);
      }
    };

  /* ==========================================================
     MODE CHANGE
     ========================================================== */

  const handleModeChange = (
    mode: PracticeMode,
  ) => {
    setSelectedMode(mode);

    setHasMatchingActiveSession(
      false,
    );

    setError(null);
  };

  /* ==========================================================
     QUESTION COUNT CHANGE
     ========================================================== */

  const handleQuestionCountChange =
    (count: number) => {
      setQuestionCount(count);

      setHasMatchingActiveSession(
        false,
      );

      setError(null);
    };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-10">

        {/* ====================================================
            BACK
           ==================================================== */}

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* ====================================================
            HEADER
           ==================================================== */}

        <section className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wide text-blue-700">
            {examName} Practice
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {subjectName} Practice
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Choose your practice mode
            and number of questions.
            Time and CBT point rewards
            are controlled by the
            backend.
          </p>
        </section>

        {/* ====================================================
            LOADING MODES
           ==================================================== */}

        {isLoadingModes && (
          <Card className="mb-8 border-blue-200 bg-blue-50 p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />

              <span className="text-sm font-semibold text-blue-800">
                Loading practice modes...
              </span>
            </div>
          </Card>
        )}

        {/* ====================================================
            MODE ERROR
           ==================================================== */}

        {modesError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {modesError}
          </div>
        )}

        {/* ====================================================
            ACTIVE SESSION
           ==================================================== */}

        {!isCheckingSession &&
          hasMatchingActiveSession && (
            <section className="mb-8">
              <Card className="border-emerald-200 bg-emerald-50 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="font-black text-emerald-950">
                        Practice in Progress
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-emerald-800">
                        You already have an
                        unfinished practice
                        session for this
                        configuration.
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-emerald-700">
                        <span>
                          {
                            questions.length
                          }{" "}
                          questions
                        </span>

                        <span>
                          {
                            Object.keys(
                              answers ??
                                {},
                            ).length
                          }{" "}
                          answered
                        </span>

                        {sessionId && (
                          <span>
                            Session active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={
                      handleResumePractice
                    }
                    rightIcon={
                      <ArrowRight className="h-5 w-5" />
                    }
                  >
                    Resume Practice
                  </Button>
                </div>
              </Card>
            </section>
          )}

        {/* ====================================================
            SUBJECT WARNING
           ==================================================== */}

        {!subjectId && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
            Subject ID is missing from
            the URL. Please go back and
            select the subject again.
          </div>
        )}

        {/* ====================================================
            ERROR
           ==================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ====================================================
            STEP 1 — MODE
           ==================================================== */}

        <section className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              1
            </span>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Choose Practice Mode
              </h2>

              <p className="text-sm text-slate-500">
                These values come
                directly from the
                backend.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {modes.map(
              (mode) => {
                const Icon =
                  mode.icon;

                const selected =
                  selectedMode ===
                  mode.id;

                return (
                  <button
                    key={
                      mode.backendId
                    }
                    type="button"
                    onClick={() =>
                      handleModeChange(
                        mode.id,
                      )
                    }
                    className={[
                      "relative rounded-2xl border-2 bg-white p-5 text-left transition-all",
                      "hover:-translate-y-0.5 hover:shadow-md",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      selected
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200",
                    ].join(" ")}
                  >
                    {selected && (
                      <div className="absolute right-4 top-4">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      </div>
                    )}

                    <div
                      className={[
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        selected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600",
                      ].join(" ")}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 font-black text-slate-900">
                      {mode.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {
                        mode.description
                      }
                    </p>

                    {/* BACKEND RULES */}

                    <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          Time/question
                        </span>

                        <span className="font-black text-slate-900">
                          {
                            mode.secondsPerQuestion
                          }{" "}
                          sec
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          Correct answer
                        </span>

                        <span className="font-black text-blue-700">
                          +
                          {formatPoints(
                            mode.pointsPerCorrect,
                          )}
                        </span>
                      </div>

                    </div>
                  </button>
                );
              },
            )}
          </div>
        </section>

        {/* ====================================================
            STEP 2 — QUESTIONS
           ==================================================== */}

        <section className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              2
            </span>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Number of Questions
              </h2>

              <p className="text-sm text-slate-500">
                Choose how many
                questions you want to
                answer.
              </p>
            </div>
          </div>

          <Card className="p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                10,
                20,
                30,
                40,
                50,
              ].map(
                (count) => {
                  const selected =
                    questionCount ===
                    count;

                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() =>
                        handleQuestionCountChange(
                          count,
                        )
                      }
                      className={[
                        "rounded-xl border-2 px-4 py-4 text-center font-bold transition",
                        selected
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300",
                      ].join(" ")}
                    >
                      {count}
                    </button>
                  );
                },
              )}
            </div>
          </Card>
        </section>

        {/* ====================================================
            STEP 3 — RULES
           ==================================================== */}

        <section className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              3
            </span>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Practice Rules
              </h2>

              <p className="text-sm text-slate-500">
                Automatically loaded
                from the backend.
              </p>
            </div>
          </div>

          <Card className="border-blue-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-3">

              {/* TIME PER QUESTION */}

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Time / Question
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {
                        secondsPerQuestion
                      }{" "}
                      sec
                    </p>
                  </div>
                </div>
              </div>

              {/* TOTAL TIME */}

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Total Time
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {formatDuration(
                        totalDurationSeconds,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* REWARD */}

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Coins className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Correct Answer
                    </p>

                    <p className="mt-1 text-2xl font-black text-emerald-700">
                      +
                      {formatPoints(
                        pointsPerCorrect,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAXIMUM REWARD */}

            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <Coins className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="font-black text-emerald-950">
                    Maximum CBT Points
                  </p>

                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    If you answer all{" "}
                    <strong>
                      {questionCount}
                    </strong>{" "}
                    questions correctly,
                    you can earn up to{" "}
                    <strong>
                      {formatPoints(
                        maximumPossiblePoints,
                      )}
                    </strong>{" "}
                    CBT points in this
                    practice session.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ====================================================
            SESSION SUMMARY
           ==================================================== */}

        <section className="mb-8">
          <Card className="border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <HelpCircle className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <h2 className="font-black text-slate-900">
                  Session Summary
                </h2>

                <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">

                  <p>
                    <strong>
                      Exam:
                    </strong>{" "}
                    {examName}
                  </p>

                  <p>
                    <strong>
                      Subject:
                    </strong>{" "}
                    {subjectName}
                  </p>

                  <p>
                    <strong>
                      Mode:
                    </strong>{" "}
                    {selectedModeInfo?.name ??
                      "Loading..."}
                  </p>

                  <p>
                    <strong>
                      Questions:
                    </strong>{" "}
                    {questionCount}
                  </p>

                  <p>
                    <strong>
                      Time/question:
                    </strong>{" "}
                    {
                      secondsPerQuestion
                    }{" "}
                    seconds
                  </p>

                  <p>
                    <strong>
                      Total duration:
                    </strong>{" "}
                    {formatDuration(
                      totalDurationSeconds,
                    )}
                  </p>

                  <p>
                    <strong>
                      Correct answer:
                    </strong>{" "}
                    <span className="font-black text-emerald-700">
                      +
                      {formatPoints(
                        pointsPerCorrect,
                      )}{" "}
                      CBT points
                    </span>
                  </p>

                  <p>
                    <strong>
                      Maximum reward:
                    </strong>{" "}
                    <span className="font-black text-emerald-700">
                      {formatPoints(
                        maximumPossiblePoints,
                      )}{" "}
                      points
                    </span>
                  </p>

                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ====================================================
            START / RESUME
           ==================================================== */}

        <section>
          <Button
            size="lg"
            fullWidth
            disabled={
              isStarting ||
              isCheckingSession ||
              isLoadingModes ||
              !subjectId ||
              !selectedModeInfo
            }
            onClick={
              hasMatchingActiveSession
                ? handleResumePractice
                : handleStartPractice
            }
            rightIcon={
              isCheckingSession ||
              isLoadingModes ||
              isStarting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )
            }
          >
            {isLoadingModes
              ? "Loading Practice Modes..."
              : isCheckingSession
                ? "Checking Practice..."
                : isStarting
                  ? "Starting Practice..."
                  : hasMatchingActiveSession
                    ? "Resume Practice"
                    : "Start Practice"}
          </Button>
        </section>

      </div>
    </main>
  );
}

