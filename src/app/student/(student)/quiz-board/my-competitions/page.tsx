
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import MyCompetitions from "@/components/quiz-board/MyCompetitions";

import { getAllMyQuizzes } from "@/lib/api/quizCompetition";

import { mapQuizToBoard } from "@/lib/quiz-board/helpers";

import { getCurrentQuizBoardUserId } from "@/lib/quiz-board/user";

import type {
  MyQuizApiResponse,
  QuizBoard,
  QuizParticipation,
} from "@/lib/quiz-board/types";

export default function MyCompetitionsPage() {
  const router = useRouter();

  // Current user
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserReady, setIsUserReady] = useState(false);

  // Competitions
  const [myBoards, setMyBoards] = useState<QuizBoard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clock used by competition cards
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Resolve the logged-in user
  useEffect(() => {
    try {
      const id = getCurrentQuizBoardUserId();
      setUserId(id);
    } catch (err) {
      console.error("Failed to get current Quiz Board user:", err);
      setUserId(null);
    } finally {
      setIsUserReady(true);
    }
  }, []);

  // Load the user's joined competitions
  const loadMyCompetitions = useCallback(async () => {
    if (!userId) {
      setMyBoards([]);
      setError(
        "Your account could not be identified. Please sign in again.",
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = (await getAllMyQuizzes(
        userId,
      )) as MyQuizApiResponse;

      const participations: QuizParticipation[] =
        response?.data?.participationsObj ?? [];

      const mappedBoards = participations
        .filter((participation) => Boolean(participation?.quizId))
        .map((participation) => {
          const quiz = participation.quizId as
            typeof participation.quizId & {
              room_id?: string | null;
              status?: string | null;
              current_round?: number | null;
              joined_users?: string[];
              no_of_contestants?: number | null;
            };

          const board = mapQuizToBoard(participation.quizId);

          const joinedUsers = Array.isArray(quiz.joined_users)
            ? quiz.joined_users
            : [];

          const maxContestants =
            typeof quiz.no_of_contestants === "number"
              ? quiz.no_of_contestants
              : Number(quiz.no_of_contestants ?? 0);

          const currentRound =
            typeof quiz.current_round === "number"
              ? quiz.current_round
              : Number(quiz.current_round ?? 0);

          const quizStatus =
            typeof quiz.status === "string"
              ? quiz.status.toUpperCase()
              : null;

          const contestantId =
            typeof participation.contestantId === "string"
              ? participation.contestantId.trim()
              : null;

          return {
            ...board,
            isJoined: true,
            roomId: quiz.room_id ?? null,
            roomStatus: quizStatus,
            currentRound,
            joined_users: joinedUsers,
            max_contestants: Number.isFinite(maxContestants)
              ? maxContestants
              : 0,
            contestantId,
            participation,
          } as QuizBoard;
        });

      console.log("My Quiz Board competitions:", mappedBoards);

      console.log(
        "My Quiz Board contestant IDs:",
        mappedBoards.map((board) => ({
          quizId: board.id,
          contestantId: board.contestantId,
          roomId: board.roomId,
        })),
      );

      setMyBoards(mappedBoards);
    } catch (err: unknown) {
      console.error("Failed to load my Quiz Board competitions:", err);

      setMyBoards([]);
      setError(
        getApiErrorMessage(err, "Unable to load your competitions."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load after user identification
  useEffect(() => {
    if (!isUserReady) return;

    if (!userId) {
      setMyBoards([]);
      setError(
        "Your account could not be identified. Please sign in again.",
      );
      return;
    }

    void loadMyCompetitions();
  }, [isUserReady, userId, loadMyCompetitions]);

  // Keep card countdowns and time-based displays current
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 30_000);

    return () => window.clearInterval(interval);
  }, []);

  // Refresh
  const handleRefresh = useCallback(() => {
    if (!userId || isLoading) return;
    void loadMyCompetitions();
  }, [userId, isLoading, loadMyCompetitions]);

  // Back to Quiz Board
  const handleBack = useCallback(() => {
    router.push("/student/quiz-board");
  }, [router]);

  // Full-page loading state
  if (!isUserReady) {
    return (
      <main className="min-h-dvh overflow-x-clip bg-slate-950 px-3 py-5 text-white sm:px-6 sm:py-8">
        <div className="mx-auto flex min-h-[65dvh] max-w-7xl items-center justify-center">
          <div className="w-full max-w-sm text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
            </div>

            <h1 className="mt-5 text-lg font-bold text-white">
              Loading My Competitions
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Preparing your competitions...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh overflow-x-clip bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">

        {/* Top navigation */}
        <header className="mb-5 sm:mb-8">
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="h-10 min-w-0 gap-2 px-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white sm:px-3"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span>Quiz Board</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading || !userId}
              className="h-10 shrink-0 gap-2 border-white/10 bg-white/[0.03] px-3 text-slate-200 hover:bg-white/[0.08] hover:text-white"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
            </Button>
          </div>

          {/* Page title */}
          <div className="mt-4 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-blue-500/[0.09] to-transparent p-4 sm:mt-5 sm:border-0 sm:bg-none sm:p-0">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 sm:h-12 sm:w-12">
                <Trophy className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-white sm:text-3xl">
                    My Competitions
                  </h1>

                  {!isLoading && (
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2 text-xs font-bold text-blue-300">
                      {myBoards.length}
                    </span>
                  )}
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  View and continue the Quiz Board competitions
                  you have already joined.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-3 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  Unable to load My Competitions
                </p>

                <p className="mt-1 break-words text-sm leading-6 text-slate-400">
                  {error}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={isLoading || !userId}
                  className="mt-4 h-10 w-full gap-2 border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.1] hover:text-white sm:w-auto"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  Try again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Competition list */}
        <section className="min-w-0">
          <MyCompetitions
            competitions={myBoards}
            isLoading={isLoading}
            error={error}
            currentTime={currentTime}
            onRetry={handleRefresh}
          />
        </section>

        {/* Bottom navigation */}
        <footer className="mt-7 border-t border-white/[0.07] pb-5 pt-5 sm:mt-10 sm:pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-center text-xs leading-5 text-slate-500 sm:text-left">
              Your joined Quiz Board competitions appear here.
            </p>

            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="h-auto min-h-11 w-full justify-center gap-2 whitespace-normal px-3 py-3 text-center text-sm text-slate-300 hover:bg-white/5 hover:text-white sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Browse Available Competitions
            </Button>
          </div>
        </footer>
      </div>
    </main>
  );
}

/**
 * Extract a useful error message from the API response.
 */
function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error && typeof error === "object") {
    const object = error as Record<string, unknown>;
    const response = object.response;

    if (response && typeof response === "object") {
      const responseObject = response as Record<string, unknown>;
      const data = responseObject.data;

      if (data && typeof data === "object") {
        const dataObject = data as Record<string, unknown>;

        if (typeof dataObject.message === "string") {
          return dataObject.message;
        }

        if (typeof dataObject.error === "string") {
          return dataObject.error;
        }

        if (Array.isArray(dataObject.errors)) {
          const messages = dataObject.errors
            .map((item): string | null => {
              if (typeof item === "string") {
                return item;
              }

              if (item && typeof item === "object") {
                const itemObject = item as Record<string, unknown>;

                if (typeof itemObject.message === "string") {
                  return itemObject.message;
                }

                if (typeof itemObject.error === "string") {
                  return itemObject.error;
                }
              }

              return null;
            })
            .filter((message): message is string => Boolean(message));

          if (messages.length > 0) {
            return messages.join(" ");
          }
        }
      }

      if (typeof responseObject.status === "number") {
        return `Request failed with status ${responseObject.status}.`;
      }
    }

    if (typeof object.message === "string") {
      return object.message;
    }
  }

  return fallback;
}





















// "use client";

// import {
//   useCallback,
//   useEffect,
//   useState,
// } from "react";

// import { useRouter } from "next/navigation";

// import {
//   AlertCircle,
//   ArrowLeft,
//   RefreshCw,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import MyCompetitions from "@/components/quiz-board/MyCompetitions";

// import {
//   getAllMyQuizzes,
// } from "@/lib/api/quizCompetition";

// import {
//   mapQuizToBoard,
// } from "@/lib/quiz-board/helpers";

// import {
//   getCurrentQuizBoardUserId,
// } from "@/lib/quiz-board/user";

// import type {
//   MyQuizApiResponse,
//   QuizBoard,
//   QuizParticipation,
// } from "@/lib/quiz-board/types";

// /* ========================================================================== */
// /* PAGE                                                                       */
// /* ========================================================================== */

// export default function MyCompetitionsPage() {
//   const router = useRouter();

//   /* ======================================================================== */
//   /* USER                                                                     */
//   /* ======================================================================== */

//   const [userId, setUserId] =
//     useState<string | null>(null);

//   const [isUserReady, setIsUserReady] =
//     useState(false);

//   /* ======================================================================== */
//   /* MY COMPETITIONS                                                          */
//   /* ======================================================================== */

//   const [myBoards, setMyBoards] =
//     useState<QuizBoard[]>([]);

//   const [isLoading, setIsLoading] =
//     useState(false);

//   const [error, setError] =
//     useState<string | null>(null);

//   /* ======================================================================== */
//   /* CLOCK                                                                     */
//   /* ======================================================================== */

//   const [currentTime, setCurrentTime] =
//     useState(() => Date.now());

//   /* ======================================================================== */
//   /* GET CURRENT USER                                                         */
//   /* ======================================================================== */

//   useEffect(() => {
//     try {
//       const id =
//         getCurrentQuizBoardUserId();

//       setUserId(id);
//     } catch (err) {
//       console.error(
//         "Failed to get current Quiz Board user:",
//         err,
//       );

//       setUserId(null);
//     } finally {
//       setIsUserReady(true);
//     }
//   }, []);

//   /* ======================================================================== */
//   /* LOAD MY COMPETITIONS                                                     */
//   /* ======================================================================== */

//   const loadMyCompetitions =
//     useCallback(async () => {
//       if (!userId) {
//         setMyBoards([]);

//         setError(
//           "Your account could not be identified. Please sign in again.",
//         );

//         return;
//       }

//       setIsLoading(true);
//       setError(null);

//       try {
//         /*
//          * GET:
//          *
//          * /quiz/get-all-my-quizzes/{userId}
//          */
//         const response =
//           (await getAllMyQuizzes(
//             userId,
//           )) as MyQuizApiResponse;

//         console.log(
//           "GET MY QUIZZES RESPONSE:",
//           response,
//         );

//         const participations:
//           QuizParticipation[] =
//           response?.data
//             ?.participationsObj ?? [];

//         console.log(
//           "My Quiz Board participations:",
//           participations,
//         );

//         /*
//          * Normalize the API participation records into
//          * the QuizBoard shape used by MyCompetitions.
//          */
//         const mappedBoards =
//           participations
//             .filter(
//               (participation) =>
//                 Boolean(
//                   participation?.quizId,
//                 ),
//             )
//             .map(
//               (participation) => {
//                 /*
//                  * The API puts the actual competition/room
//                  * state inside participation.quizId.
//                  */
//                 const quiz =
//                   participation.quizId as
//                     typeof participation.quizId & {
//                       room_id?: string | null;
//                       status?: string | null;
//                       current_round?: number | null;
//                       joined_users?: string[];
//                       no_of_contestants?: number | null;
//                     };

//                 /*
//                  * Convert the quiz into the normal QuizBoard
//                  * structure first.
//                  */
//                 const board =
//                   mapQuizToBoard(
//                     participation.quizId,
//                   );

//                 /*
//                  * REAL CONTESTANT LIST
//                  */
//                 const joinedUsers =
//                   Array.isArray(
//                     quiz.joined_users,
//                   )
//                     ? quiz.joined_users
//                     : [];

//                 /*
//                  * REAL MAXIMUM CONTESTANTS
//                  */
//                 const maxContestants =
//                   typeof quiz.no_of_contestants ===
//                   "number"
//                     ? quiz.no_of_contestants
//                     : Number(
//                         quiz.no_of_contestants ??
//                           0,
//                       );

//                 /*
//                  * REAL QUIZ ROUND
//                  */
//                 const currentRound =
//                   typeof quiz.current_round ===
//                   "number"
//                     ? quiz.current_round
//                     : Number(
//                         quiz.current_round ??
//                           0,
//                       );

//                 /*
//                  * REAL QUIZ / ROOM STATUS
//                  */
//                 const quizStatus =
//                   typeof quiz.status ===
//                   "string"
//                     ? quiz.status.toUpperCase()
//                     : null;

//                 /*
//                  * REAL CONTESTANT ID
//                  *
//                  * This comes from:
//                  *
//                  * participation.contestantId
//                  *
//                  * Example:
//                  *
//                  * AT-SUWI20S9
//                  */
//                 const contestantId =
//                   typeof participation.contestantId ===
//                   "string"
//                     ? participation.contestantId.trim()
//                     : null;

//                 /*
//                  * The student reached this endpoint through
//                  * get-all-my-quizzes, so this competition is
//                  * already joined.
//                  */
//                 return {
//                   ...board,

//                   isJoined: true,

//                   /*
//                    * REAL ROOM ID
//                    */
//                   roomId:
//                     quiz.room_id ?? null,

//                   /*
//                    * REAL QUIZ / ROOM STATUS
//                    *
//                    * Do NOT use participation.status here.
//                    *
//                    * participation.status:
//                    * REGISTERED
//                    *
//                    * quiz.status:
//                    * WAITING / IN_PROGRESS / etc.
//                    */
//                   roomStatus:
//                     quizStatus,

//                   /*
//                    * REAL QUIZ ROUND
//                    *
//                    * The actual competition state is:
//                    *
//                    * quiz.current_round
//                    */
//                   currentRound,

//                   /*
//                    * REAL CONTESTANT LIST
//                    *
//                    * Example:
//                    *
//                    * 5 / 5
//                    */
//                   joined_users:
//                     joinedUsers,

//                   /*
//                    * REAL MAXIMUM CONTESTANTS
//                    */
//                   max_contestants:
//                     Number.isFinite(
//                       maxContestants,
//                     )
//                       ? maxContestants
//                       : 0,

//                   /*
//                    * IMPORTANT:
//                    *
//                    * Pass the contestant ID from the
//                    * participation into QuizBoard.
//                    *
//                    * MyCompetitions.tsx will use this
//                    * to construct the Waiting Room URL.
//                    */
//                   contestantId,

//                   /*
//                    * Keep the original participation object
//                    * available for anything else that may need it.
//                    */
//                   participation,
//                 } as QuizBoard;
//               },
//             );

//         console.log(
//           "My Quiz Board competitions:",
//           mappedBoards,
//         );

//         /*
//          * Helpful debugging:
//          *
//          * This should show something like:
//          *
//          * [
//          *   {
//          *     id: "...",
//          *     contestantId: "AT-SUWI20S9",
//          *     roomId: "QUIZ_ROOM_...",
//          *     ...
//          *   }
//          * ]
//          */
//         console.log(
//           "My Quiz Board contestant IDs:",
//           mappedBoards.map(
//             (board) => ({
//               quizId: board.id,
//               contestantId:
//                 board.contestantId,
//               roomId:
//                 board.roomId,
//             }),
//           ),
//         );

//         setMyBoards(
//           mappedBoards,
//         );
//       } catch (err: unknown) {
//         console.error(
//           "Failed to load my Quiz Board competitions:",
//           err,
//         );

//         setMyBoards([]);

//         setError(
//           getApiErrorMessage(
//             err,
//             "Unable to load your competitions.",
//           ),
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     }, [userId]);

//   /* ======================================================================== */
//   /* LOAD AFTER USER IS READY                                                 */
//   /* ======================================================================== */

//   useEffect(() => {
//     if (!isUserReady) {
//       return;
//     }

//     if (!userId) {
//       setMyBoards([]);

//       setError(
//         "Your account could not be identified. Please sign in again.",
//       );

//       return;
//     }

//     void loadMyCompetitions();
//   }, [
//     isUserReady,
//     userId,
//     loadMyCompetitions,
//   ]);

//   /* ======================================================================== */
//   /* UPDATE CLOCK                                                             */
//   /* ======================================================================== */

//   useEffect(() => {
//     const interval =
//       window.setInterval(() => {
//         setCurrentTime(
//           Date.now(),
//         );
//       }, 30_000);

//     return () => {
//       window.clearInterval(
//         interval,
//       );
//     };
//   }, []);

//   /* ======================================================================== */
//   /* REFRESH                                                                  */
//   /* ======================================================================== */

//   const handleRefresh =
//     useCallback(() => {
//       if (!userId) {
//         return;
//       }

//       void loadMyCompetitions();
//     }, [
//       userId,
//       loadMyCompetitions,
//     ]);

//   /* ======================================================================== */
//   /* BACK                                                                     */
//   /* ======================================================================== */

//   const handleBack =
//     useCallback(() => {
//       router.push(
//         "/student/quiz-board",
//       );
//     }, [router]);

//   /* ======================================================================== */
//   /* USER LOADING                                                             */
//   /* ======================================================================== */

//   if (!isUserReady) {
//     return (
//       <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
//         <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
//           <div className="text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
//               <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
//             </div>

//             <h1 className="mt-5 text-lg font-bold text-white">
//               Loading My Competitions
//             </h1>

//             <p className="mt-2 text-sm text-slate-500">
//               Preparing your competitions...
//             </p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /* ======================================================================== */
//   /* PAGE                                                                     */
//   /* ======================================================================== */

//   return (
//     <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">

//         {/* ================================================================ */}
//         {/* HEADER                                                            */}
//         {/* ================================================================ */}

//         <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-start gap-3">

//             <Button
//               type="button"
//               variant="ghost"
//               onClick={handleBack}
//               className="mt-1 shrink-0 text-slate-400 hover:bg-white/[0.05] hover:text-white"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Quiz Board
//             </Button>

//             <div>
//               <div className="flex flex-wrap items-center gap-3">

//                 <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
//                   My Competitions
//                 </h1>

//                 {!isLoading && (
//                   <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
//                     {myBoards.length}
//                   </span>
//                 )}

//               </div>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//                 View and continue the Quiz Board
//                 competitions you have already
//                 joined.
//               </p>
//             </div>
//           </div>

//           {/* ============================================================ */}
//           {/* REFRESH                                                       */}
//           {/* ============================================================ */}

//           <Button
//             type="button"
//             variant="outline"
//             onClick={handleRefresh}
//             disabled={
//               isLoading ||
//               !userId
//             }
//             className="w-fit gap-2 border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
//           >
//             <RefreshCw
//               className={`h-4 w-4 ${
//                 isLoading
//                   ? "animate-spin"
//                   : ""
//               }`}
//             />

//             Refresh
//           </Button>
//         </div>

//         {/* ================================================================ */}
//         {/* ERROR                                                            */}
//         {/* ================================================================ */}

//         {error && (
//           <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//               <div className="flex items-start gap-3">

//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
//                   <AlertCircle className="h-5 w-5 text-red-400" />
//                 </div>

//                 <div>
//                   <p className="text-sm font-semibold text-white">
//                     Unable to load My Competitions
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-slate-400">
//                     {error}
//                   </p>
//                 </div>

//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleRefresh}
//                 disabled={
//                   isLoading ||
//                   !userId
//                 }
//                 className="shrink-0 gap-2 border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.1] hover:text-white"
//               >
//                 <RefreshCw
//                   className={`h-4 w-4 ${
//                     isLoading
//                       ? "animate-spin"
//                       : ""
//                   }`}
//                 />

//                 Retry
//               </Button>

//             </div>
//           </div>
//         )}

//         {/* ================================================================ */}
//         {/* MY COMPETITIONS                                                  */}
//         {/* ================================================================ */}

//         <section>
//           <MyCompetitions
//             competitions={myBoards}
//             isLoading={isLoading}
//             error={error}
//             currentTime={currentTime}
//             onRetry={handleRefresh}
//           />
//         </section>

//         {/* ================================================================ */}
//         {/* BOTTOM NAVIGATION                                                */}
//         {/* ================================================================ */}

//         <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">

//           <p className="text-xs text-slate-600">
//             Your joined Quiz Board competitions
//             appear here.
//           </p>

//           <Button
//             type="button"
//             variant="ghost"
//             onClick={() =>
//               router.push(
//                 "/student/quiz-board",
//               )
//             }
//             className="text-slate-400 hover:bg-white/[0.05] hover:text-white"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Browse Available Competitions
//           </Button>

//         </div>

//       </div>
//     </main>
//   );
// }

// /* ========================================================================== */
// /* API ERROR HELPER                                                           */
// /* ========================================================================== */

// function getApiErrorMessage(
//   error: unknown,
//   fallback: string,
// ): string {
//   if (
//     error &&
//     typeof error === "object"
//   ) {
//     const object =
//       error as Record<
//         string,
//         unknown
//       >;

//     const response =
//       object.response;

//     if (
//       response &&
//       typeof response === "object"
//     ) {
//       const responseObject =
//         response as Record<
//           string,
//           unknown
//         >;

//       const data =
//         responseObject.data;

//       if (
//         data &&
//         typeof data === "object"
//       ) {
//         const dataObject =
//           data as Record<
//             string,
//             unknown
//           >;

//         if (
//           typeof dataObject.message ===
//           "string"
//         ) {
//           return dataObject.message;
//         }

//         if (
//           typeof dataObject.error ===
//           "string"
//         ) {
//           return dataObject.error;
//         }

//         if (
//           Array.isArray(
//             dataObject.errors,
//           )
//         ) {
//           const messages =
//             dataObject.errors
//               .map(
//                 (item) => {
//                   if (
//                     typeof item ===
//                     "string"
//                   ) {
//                     return item;
//                   }

//                   if (
//                     item &&
//                     typeof item ===
//                       "object"
//                   ) {
//                     const itemObject =
//                       item as Record<
//                         string,
//                         unknown
//                       >;

//                     if (
//                       typeof itemObject.message ===
//                       "string"
//                     ) {
//                       return itemObject.message;
//                     }

//                     if (
//                       typeof itemObject.error ===
//                       "string"
//                     ) {
//                       return itemObject.error;
//                     }
//                   }

//                   return null;
//                 },
//               )
//               .filter(
//                 (
//                   message,
//                 ): message is string =>
//                   Boolean(
//                     message,
//                   ),
//               );

//           if (
//             messages.length > 0
//           ) {
//             return messages.join(
//               " ",
//             );
//           }
//         }
//       }

//       if (
//         typeof responseObject.status ===
//         "number"
//       ) {
//         return `Request failed with status ${responseObject.status}.`;
//       }
//     }

//     if (
//       typeof object.message ===
//       "string"
//     ) {
//       return object.message;
//     }
//   }

//   return fallback;
// }