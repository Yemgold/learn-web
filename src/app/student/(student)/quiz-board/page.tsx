






// src/app/student/(student)/quiz-board/page.tsx

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import QuizBoardHero from "@/components/quiz-board/QuizBoardHero";
import QuizBoardStats from "@/components/quiz-board/QuizBoardStats";
import QuizBoardFilters from "@/components/quiz-board/QuizBoardFilters";
import QuizBoardList from "@/components/quiz-board/QuizBoardList";
import QuizBoardPagination from "@/components/quiz-board/QuizBoardPagination";
import QuizBoardHowItWorks from "@/components/quiz-board/QuizBoardHowItWorks";

import {
  getAllWaitingQuizzesUserHasNotJoined,
} from "@/lib/api/quizCompetition";

import {
  DEFAULT_QUIZ_BOARD_FILTERS,
  QUIZ_BOARD_API_LIMIT,
  QUIZ_BOARD_API_PAGE,
} from "@/lib/quiz-board/constants";

import {
  filterQuizBoards,
  getQuizBoardStats,
  getUniqueSubjects,
  mapQuizToBoard,
} from "@/lib/quiz-board/helpers";

import {
  getCurrentQuizBoardUserId,
} from "@/lib/quiz-board/user";

import type {
  Difficulty,
  DisplayStatus,
  QuizApiResponse,
  QuizBoard,
} from "@/lib/quiz-board/types";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface ApiPagination {
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function QuizBoardPage() {
  /* ========================================================================
     USER
  ======================================================================== */

  const [userId, setUserId] =
    useState<string | null>(null);

  const [isUserReady, setIsUserReady] =
    useState(false);

  /* ========================================================================
     AVAILABLE COMPETITIONS
     
     This page now contains ONLY competitions
     the current student has not joined.
  ======================================================================== */

  const [boards, setBoards] =
    useState<QuizBoard[]>([]);

  const [
    availablePagination,
    setAvailablePagination,
  ] = useState<ApiPagination>({
    totalCount: 0,
    totalPages: 1,
    page: QUIZ_BOARD_API_PAGE,
    limit: QUIZ_BOARD_API_LIMIT,
  });

  const [
    isLoadingCompetitions,
    setIsLoadingCompetitions,
  ] = useState(false);

  const [
    competitionsError,
    setCompetitionsError,
  ] = useState<string | null>(null);

  /* ========================================================================
     FILTERS
  ======================================================================== */

  const [
    searchQuery,
    setSearchQuery,
  ] = useState(
    DEFAULT_QUIZ_BOARD_FILTERS.searchQuery,
  );

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    DisplayStatus | "ALL"
  >(
    DEFAULT_QUIZ_BOARD_FILTERS.statusFilter,
  );

  const [
    difficultyFilter,
    setDifficultyFilter,
  ] = useState<
    Difficulty | "ALL"
  >(
    DEFAULT_QUIZ_BOARD_FILTERS.difficultyFilter,
  );

  const [
    subjectFilter,
    setSubjectFilter,
  ] = useState(
    DEFAULT_QUIZ_BOARD_FILTERS.subjectFilter,
  );

  const [
    showFilters,
    setShowFilters,
  ] = useState(false);

  /* ========================================================================
     CLOCK
  ======================================================================== */

  const [
    currentTime,
    setCurrentTime,
  ] = useState(() => Date.now());

  /* ========================================================================
     RESOLVE AUTHENTICATED USER
  ======================================================================== */

  useEffect(() => {
    const id =
      getCurrentQuizBoardUserId();

    setUserId(id);
    setIsUserReady(true);
  }, []);

  /* ========================================================================
     LOAD AVAILABLE COMPETITIONS
     
     Only this endpoint is used on this page.
  ======================================================================== */

  const loadCompetitions =
    useCallback(
      async (
        page = QUIZ_BOARD_API_PAGE,
      ) => {
        if (!userId) {
          return;
        }

        setIsLoadingCompetitions(
          true,
        );

        setCompetitionsError(
          null,
        );

        try {
          const response =
            (await getAllWaitingQuizzesUserHasNotJoined(
              userId,
              page,
              QUIZ_BOARD_API_LIMIT,
            )) as QuizApiResponse;

          const data =
            response?.data;

          /*
           * Backend response:
           *
           * {
           *   data: {
           *     totalCount,
           *     totalPages,
           *     quizzesObj: [...]
           *   }
           * }
           */

          const rawQuizzes =
            Array.isArray(
              data?.quizzesObj,
            )
              ? data.quizzesObj
              : [];

          const mappedBoards =
            rawQuizzes.map(
              (quiz) =>
                mapQuizToBoard(
                  quiz,
                ),
            );

          const totalCount =
            Number(
              data?.totalCount ??
                0,
            );

          const calculatedTotalPages =
            Math.max(
              Math.ceil(
                totalCount /
                  QUIZ_BOARD_API_LIMIT,
              ),
              1,
            );

          const totalPages =
            Number(
              data?.totalPages ??
                calculatedTotalPages,
            );

          setBoards(
            mappedBoards,
          );

          setAvailablePagination({
            totalCount,

            totalPages:
              totalPages > 0
                ? totalPages
                : 1,

            page:
              Number(
                data?.page ??
                  page,
              ) || page,

            limit:
              Number(
                data?.limit ??
                  QUIZ_BOARD_API_LIMIT,
              ) ||
              QUIZ_BOARD_API_LIMIT,
          });
        } catch (error: unknown) {
          console.error(
            "Failed to load available Quiz Board competitions:",
            error,
          );

          const message =
            getApiErrorMessage(
              error,
              "Unable to load available Quiz Board competitions.",
            );

          setCompetitionsError(
            message,
          );

          setBoards([]);

          setAvailablePagination(
            (previous) => ({
              ...previous,
              page,
            }),
          );
        } finally {
          setIsLoadingCompetitions(
            false,
          );
        }
      },
      [userId],
    );

  /* ========================================================================
     INITIAL DATA LOADING
  ======================================================================== */

  useEffect(() => {
    if (!isUserReady) {
      return;
    }

    if (!userId) {
      setBoards([]);

      setCompetitionsError(
        "Your account could not be identified. Please sign in again.",
      );

      return;
    }

    void loadCompetitions(
      QUIZ_BOARD_API_PAGE,
    );
  }, [
    isUserReady,
    userId,
    loadCompetitions,
  ]);

  /* ========================================================================
     REFRESH RELATIVE TIME
  ======================================================================== */

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setCurrentTime(
          Date.now(),
        );
      }, 30_000);

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, []);

  /* ========================================================================
     FILTER AVAILABLE COMPETITIONS
  ======================================================================== */

  const filteredBoards =
    useMemo(() => {
      return filterQuizBoards(
        boards,
        searchQuery,
        statusFilter,
        difficultyFilter,
        subjectFilter,
      );
    }, [
      boards,
      searchQuery,
      statusFilter,
      difficultyFilter,
      subjectFilter,
    ]);

  /* ========================================================================
     SUBJECTS
  ======================================================================== */

  const subjects =
    useMemo(() => {
      return getUniqueSubjects(
        boards,
      );
    }, [boards]);

  /* ========================================================================
     STATISTICS
  ======================================================================== */

  const stats =
    useMemo(() => {
      return getQuizBoardStats(
        boards,
      );
    }, [boards]);

  /* ========================================================================
     PAGINATION
  ======================================================================== */

  const currentPage =
    availablePagination.page;

  const totalPages =
    availablePagination.totalPages;

  const totalCount =
    availablePagination.totalCount;

  const pageSize =
    availablePagination.limit ||
    QUIZ_BOARD_API_LIMIT;

  const handlePageChange =
    useCallback(
      (page: number) => {
        if (
          page < 1 ||
          page > totalPages ||
          page === currentPage ||
          isLoadingCompetitions
        ) {
          return;
        }

        void loadCompetitions(
          page,
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      },
      [
        currentPage,
        totalPages,
        isLoadingCompetitions,
        loadCompetitions,
      ],
    );

  /* ========================================================================
     FILTER RESET
  ======================================================================== */

  const resetFilters =
    useCallback(() => {
      setSearchQuery(
        DEFAULT_QUIZ_BOARD_FILTERS.searchQuery,
      );

      setStatusFilter(
        DEFAULT_QUIZ_BOARD_FILTERS.statusFilter,
      );

      setDifficultyFilter(
        DEFAULT_QUIZ_BOARD_FILTERS.difficultyFilter,
      );

      setSubjectFilter(
        DEFAULT_QUIZ_BOARD_FILTERS.subjectFilter,
      );
    }, []);

  /* ========================================================================
     RETRY
  ======================================================================== */

  const handleRetry =
    useCallback(() => {
      if (!userId) {
        return;
      }

      void loadCompetitions(
        currentPage,
      );
    }, [
      userId,
      currentPage,
      loadCompetitions,
    ]);

  /* ========================================================================
     ACCOUNT LOADING STATE
  ======================================================================== */

  if (!isUserReady) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PageLoadingState />
        </div>
      </main>
    );
  }

  /* ========================================================================
     PAGE
  ======================================================================== */

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================================================================
            HERO
        ================================================================ */}

        <QuizBoardHero
          stats={stats}
          totalCompetitions={
            totalCount
          }
          isLoading={
            isLoadingCompetitions
          }
        />

        {/* ================================================================
            STATS
        ================================================================ */}

        <div className="mb-8">
          <QuizBoardStats
            stats={stats}
            boards={boards}
            isLoading={
              isLoadingCompetitions
            }
          />
        </div>

        {/* ================================================================
            AVAILABLE COMPETITIONS
        ================================================================ */}

        <section
          id="quiz-competitions"
          className="scroll-mt-6"
        >
          {/* ==============================================================
              SECTION HEADER
          ============================================================== */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  Available Competitions
                </h2>

                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-xs font-bold text-violet-300">
                  {totalCount}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Choose a competition and
                test yourself against other
                students.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={
                handleRetry
              }
              disabled={
                isLoadingCompetitions
              }
              className="w-fit gap-2 border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoadingCompetitions
                    ? "animate-spin"
                    : ""
                }`}
              />

              Refresh
            </Button>
          </div>

          {/* ==============================================================
              FILTERS
          ============================================================== */}

          <div className="mb-6">
            <QuizBoardFilters
              filters={{
                searchQuery,
                statusFilter,
                difficultyFilter,
                subjectFilter,
              }}
              subjects={subjects}
              showFilters={
                showFilters
              }
              onToggleFilters={() =>
                setShowFilters(
                  (value) =>
                    !value,
                )
              }
              onSearchChange={
                setSearchQuery
              }
              onStatusChange={
                setStatusFilter
              }
              onDifficultyChange={
                setDifficultyFilter
              }
              onSubjectChange={
                setSubjectFilter
              }
              onReset={
                resetFilters
              }
            />
          </div>

          {/* ==============================================================
              API ERROR
          ============================================================== */}

          {competitionsError &&
            boards.length ===
              0 && (
              <div className="mb-6">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Unable to load available competitions
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          {
                            competitionsError
                          }
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={
                        handleRetry
                      }
                      disabled={
                        isLoadingCompetitions
                      }
                      className="shrink-0 gap-2 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isLoadingCompetitions
                            ? "animate-spin"
                            : ""
                        }`}
                      />

                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            )}

          {/* ==============================================================
              COMPETITION LIST
          ============================================================== */}

          <QuizBoardList
            boards={
              filteredBoards
            }
            isLoading={
              isLoadingCompetitions
            }
            error={
              competitionsError &&
              boards.length > 0
                ? competitionsError
                : null
            }
            currentTime={
              currentTime
            }
            joinedCompetitionIds={
              new Set()
            }
            onRetry={
              handleRetry
            }
          />

          {/* ==============================================================
              PAGINATION
          ============================================================== */}

          {!competitionsError &&
            totalCount > 0 && (
              <QuizBoardPagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                totalResults={
                  totalCount
                }
                pageSize={
                  pageSize
                }
                isLoading={
                  isLoadingCompetitions
                }
                onPageChange={
                  handlePageChange
                }
              />
            )}
        </section>

        {/* ================================================================
            HOW IT WORKS
        ================================================================ */}

        <div className="mt-14">
          <QuizBoardHowItWorks />
        </div>

        {/* ================================================================
            FOOTER
        ================================================================ */}

        <div className="mt-10">
          <QuizBoardFooterPlaceholder />
        </div>
      </div>
    </main>
  );
}

/* ==========================================================================
   API ERROR HELPER
========================================================================== */

function getApiErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    error &&
    typeof error === "object"
  ) {
    const object =
      error as Record<
        string,
        unknown
      >;

    const response =
      object.response;

    if (
      response &&
      typeof response === "object"
    ) {
      const responseObject =
        response as Record<
          string,
          unknown
        >;

      const data =
        responseObject.data;

      if (
        data &&
        typeof data === "object"
      ) {
        const dataObject =
          data as Record<
            string,
            unknown
          >;

        if (
          typeof dataObject.message ===
          "string"
        ) {
          return dataObject.message;
        }

        if (
          typeof dataObject.error ===
          "string"
        ) {
          return dataObject.error;
        }

        if (
          Array.isArray(
            dataObject.errors,
          )
        ) {
          const messages =
            dataObject.errors
              .map(
                (
                  item,
                ) => {
                  if (
                    typeof item ===
                    "string"
                  ) {
                    return item;
                  }

                  if (
                    item &&
                    typeof item ===
                      "object"
                  ) {
                    const itemObject =
                      item as Record<
                        string,
                        unknown
                      >;

                    if (
                      typeof itemObject.message ===
                      "string"
                    ) {
                      return itemObject.message;
                    }

                    if (
                      typeof itemObject.error ===
                      "string"
                    ) {
                      return itemObject.error;
                    }
                  }

                  return null;
                },
              )
              .filter(
                (
                  message,
                ): message is string =>
                  Boolean(
                    message,
                  ),
              );

          if (
            messages.length > 0
          ) {
            return messages.join(
              " ",
            );
          }
        }
      }

      if (
        typeof responseObject.status ===
        "number"
      ) {
        return `Request failed with status ${responseObject.status}.`;
      }
    }

    if (
      typeof object.message ===
      "string"
    ) {
      return object.message;
    }
  }

  return fallback;
}

/* ==========================================================================
   PAGE LOADING
========================================================================== */

function PageLoadingState() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
          <RefreshCw className="h-6 w-6 animate-spin text-violet-400" />
        </div>

        <h2 className="mt-5 text-lg font-bold text-white">
          Loading Available Competitions
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Preparing your competition arena...
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   FOOTER
========================================================================== */

function QuizBoardFooterPlaceholder() {
  return (
    <footer className="border-t border-white/5 py-6 text-center">
      <p className="text-[11px] leading-5 text-slate-600">
        Quiz Board competitions are designed
        to reward both speed and accuracy.
        Read each question carefully and submit
        your answer before the timer expires.
      </p>
    </footer>
  );
}


















// // src/app/student/(student)/quiz-board/page.tsx

// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   AlertCircle,
//   RefreshCw,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";



// import QuizBoardHero from "@/components/quiz-board/QuizBoardHero";
// import QuizBoardStats from "@/components/quiz-board/QuizBoardStats";
// import QuizBoardFilters from "@/components/quiz-board/QuizBoardFilters";
// import QuizBoardList from "@/components/quiz-board/QuizBoardList";
// import QuizBoardPagination from "@/components/quiz-board/QuizBoardPagination";
// import QuizBoardHowItWorks from "@/components/quiz-board/QuizBoardHowItWorks";
// import MyCompetitions from "@/components/quiz-board/MyCompetitions";

// import {
//   getAllWaitingQuizzesUserHasNotJoined,
//   getAllMyQuizzes,
// } from "@/lib/api/quizCompetition";

// import {
//   DEFAULT_QUIZ_BOARD_FILTERS,
//   QUIZ_BOARD_API_LIMIT,
//   QUIZ_BOARD_API_PAGE,
// } from "@/lib/quiz-board/constants";

// import {
//   filterQuizBoards,
//   getQuizBoardStats,
//   getUniqueSubjects,
//   mapQuizToBoard,
// } from "@/lib/quiz-board/helpers";

// import {
//   getCurrentQuizBoardUserId,
// } from "@/lib/quiz-board/user";

// import type {
//   Difficulty,
//   DisplayStatus,
//   QuizApiItem,
//   QuizApiResponse,
//   MyQuizApiResponse,
//   QuizBoard,
//   QuizParticipation,
// } from "@/lib/quiz-board/types";

// /* -------------------------------------------------------------------------- */
// /* Types                                                                      */
// /* -------------------------------------------------------------------------- */

// interface ApiPagination {
//   totalCount: number;
//   totalPages: number;
//   page: number;
//   limit: number;
// }

// /* -------------------------------------------------------------------------- */
// /* Page                                                                       */
// /* -------------------------------------------------------------------------- */

// export default function QuizBoardPage() {
//   /* ------------------------------------------------------------------------ */
//   /* User                                                                     */
//   /* ------------------------------------------------------------------------ */

//   const [userId, setUserId] =
//     useState<string | null>(null);

//   const [isUserReady, setIsUserReady] =
//     useState(false);

//   /* ------------------------------------------------------------------------ */
//   /* Available competitions                                                   */
//   /* ------------------------------------------------------------------------ */

//   const [boards, setBoards] = useState<
//     QuizBoard[]
//   >([]);

//   const [
//     availablePagination,
//     setAvailablePagination,
//   ] = useState<ApiPagination>({
//     totalCount: 0,
//     totalPages: 1,
//     page: QUIZ_BOARD_API_PAGE,
//     limit: QUIZ_BOARD_API_LIMIT,
//   });

//   const [
//     isLoadingCompetitions,
//     setIsLoadingCompetitions,
//   ] = useState(false);

//   const [
//     competitionsError,
//     setCompetitionsError,
//   ] = useState<string | null>(null);

//   /* ------------------------------------------------------------------------ */
//   /* My competitions                                                          */
//   /* ------------------------------------------------------------------------ */

//   const [myBoards, setMyBoards] = useState<
//     QuizBoard[]
//   >([]);

//   const [
//     isLoadingMyCompetitions,
//     setIsLoadingMyCompetitions,
//   ] = useState(false);

//   const [
//     myCompetitionsError,
//     setMyCompetitionsError,
//   ] = useState<string | null>(null);

//   /* ------------------------------------------------------------------------ */
//   /* Filters                                                                  */
//   /* ------------------------------------------------------------------------ */

//   const [
//     searchQuery,
//     setSearchQuery,
//   ] = useState(
//     DEFAULT_QUIZ_BOARD_FILTERS.searchQuery,
//   );

//   const [
//     statusFilter,
//     setStatusFilter,
//   ] = useState<
//     DisplayStatus | "ALL"
//   >(
//     DEFAULT_QUIZ_BOARD_FILTERS.statusFilter,
//   );

//   const [
//     difficultyFilter,
//     setDifficultyFilter,
//   ] = useState<
//     Difficulty | "ALL"
//   >(
//     DEFAULT_QUIZ_BOARD_FILTERS.difficultyFilter,
//   );

//   const [
//     subjectFilter,
//     setSubjectFilter,
//   ] = useState(
//     DEFAULT_QUIZ_BOARD_FILTERS.subjectFilter,
//   );

//   const [
//     showFilters,
//     setShowFilters,
//   ] = useState(false);

//   /* ------------------------------------------------------------------------ */
//   /* Clock                                                                    */
//   /* ------------------------------------------------------------------------ */

//   const [
//     currentTime,
//     setCurrentTime,
//   ] = useState(() => Date.now());

//   /* ------------------------------------------------------------------------ */
//   /* Resolve authenticated user                                               */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     const id =
//       getCurrentQuizBoardUserId();

//     setUserId(id);
//     setIsUserReady(true);
//   }, []);

//   /* ------------------------------------------------------------------------ */
//   /* Load available competitions                                              */
//   /* ------------------------------------------------------------------------ */

//   const loadCompetitions =
//     useCallback(
//       async (
//         page = QUIZ_BOARD_API_PAGE,
//       ) => {
//         if (!userId) {
//           return;
//         }

//         setIsLoadingCompetitions(true);
//         setCompetitionsError(null);

//         try {
//           const response =
//             (await getAllWaitingQuizzesUserHasNotJoined(
//               userId,
//               page,
//               QUIZ_BOARD_API_LIMIT,
//             )) as QuizApiResponse;

//           const data =
//             response?.data;

//           const rawQuizzes =
//             Array.isArray(
//               data?.quizzesObj,
//             )
//               ? data.quizzesObj
//               : [];

//           const mappedBoards =
//             rawQuizzes.map(
//               (quiz) =>
//                 mapQuizToBoard(quiz),
//             );

//           const totalCount =
//             Number(
//               data?.totalCount ?? 0,
//             );

//           const totalPages =
//             Number(
//               data?.totalPages ??
//                 Math.max(
//                   Math.ceil(
//                     totalCount /
//                       QUIZ_BOARD_API_LIMIT,
//                   ),
//                   1,
//                 ),
//             );

//           setBoards(mappedBoards);

//           setAvailablePagination({
//             totalCount,
//             totalPages:
//               totalPages > 0
//                 ? totalPages
//                 : 1,
//             page:
//               Number(
//                 data?.page ?? page,
//               ) || page,
//             limit:
//               Number(
//                 data?.limit ??
//                   QUIZ_BOARD_API_LIMIT,
//               ) ||
//               QUIZ_BOARD_API_LIMIT,
//           });
//         } catch (error: unknown) {
//           console.error(
//             "Failed to load Quiz Board competitions:",
//             error,
//           );

//           const message =
//             getApiErrorMessage(
//               error,
//               "Unable to load Quiz Board competitions.",
//             );

//           setCompetitionsError(
//             message,
//           );

//           setBoards([]);

//           setAvailablePagination(
//             (previous) => ({
//               ...previous,
//               page,
//             }),
//           );
//         } finally {
//           setIsLoadingCompetitions(
//             false,
//           );
//         }
//       },
//       [userId],
//     );

  
// /* ------------------------------------------------------------------------ */
// /* Load my competitions                                                     */
// /* ------------------------------------------------------------------------ */

// const loadMyCompetitions =
//   useCallback(async () => {
//     if (!userId) {
//       setMyBoards([]);
//       return;
//     }

//     setIsLoadingMyCompetitions(true);
//     setMyCompetitionsError(null);

//     try {
//       const response =
//         (await getAllMyQuizzes(
//           userId,
//         )) as MyQuizApiResponse;

//       const participations: QuizParticipation[] =
//         response?.data?.participationsObj ??
//         [];

//       const mappedBoards =
//         participations
//           .filter(
//             (
//               participation: QuizParticipation,
//             ) => Boolean(
//               participation.quizId,
//             ),
//           )
//           .map(
//             (
//               participation: QuizParticipation,
//             ) =>
//               mapQuizToBoard(
//                 participation.quizId,
//               ),
//           );

//       console.log(
//         "My Quiz Board participations:",
//         participations,
//       );

//       console.log(
//         "My Quiz Board competitions:",
//         mappedBoards,
//       );

//       setMyBoards(
//         mappedBoards,
//       );
//     } catch (error: unknown) {
//       console.error(
//         "Failed to load my Quiz Board competitions:",
//         error,
//       );

//       setMyCompetitionsError(
//         getApiErrorMessage(
//           error,
//           "Unable to load your competitions.",
//         ),
//       );

//       setMyBoards([]);
//     } finally {
//       setIsLoadingMyCompetitions(
//         false,
//       );
//     }
//   }, [userId]);





//   /* ------------------------------------------------------------------------ */
//   /* Initial data loading                                                     */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     if (!isUserReady) {
//       return;
//     }

//     if (!userId) {
//       setBoards([]);
//       setMyBoards([]);

//       setCompetitionsError(
//         "Your account could not be identified. Please sign in again.",
//       );

//       setMyCompetitionsError(
//         "Your account could not be identified.",
//       );

//       return;
//     }

//     void loadCompetitions(
//       QUIZ_BOARD_API_PAGE,
//     );

//     void loadMyCompetitions();
//   }, [
//     isUserReady,
//     userId,
//     loadCompetitions,
//     loadMyCompetitions,
//   ]);

//   /* ------------------------------------------------------------------------ */
//   /* Refresh relative time                                                    */
//   /* ------------------------------------------------------------------------ */

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

//   /* ------------------------------------------------------------------------ */
//   /* Joined competition IDs                                                   */
//   /* ------------------------------------------------------------------------ */

//   const joinedCompetitionIds =
//     useMemo(() => {
//       return new Set(
//         myBoards.map(
//           (board) => board.id,
//         ),
//       );
//     }, [myBoards]);

//   /* ------------------------------------------------------------------------ */
//   /* Filter available competitions                                            */
//   /* ------------------------------------------------------------------------ */

//   const filteredBoards =
//     useMemo(() => {
//       return filterQuizBoards(
//         boards,
//         searchQuery,
//         statusFilter,
//         difficultyFilter,
//         subjectFilter,
//       );
//     }, [
//       boards,
//       searchQuery,
//       statusFilter,
//       difficultyFilter,
//       subjectFilter,
//     ]);

//   /* ------------------------------------------------------------------------ */
//   /* Subjects                                                                 */
//   /* ------------------------------------------------------------------------ */

//   const subjects =
//     useMemo(() => {
//       /*
//        * Include subjects from both the current
//        * available competitions and the user's
//        * competitions.
//        */
//       const allBoards = [
//         ...boards,
//         ...myBoards,
//       ];

//       return getUniqueSubjects(
//         allBoards,
//       );
//     }, [boards, myBoards]);

//   /* ------------------------------------------------------------------------ */
//   /* Statistics                                                               */
//   /* ------------------------------------------------------------------------ */

//   const stats =
//     useMemo(() => {
//       return getQuizBoardStats(
//         boards,
//       );
//     }, [boards]);

//   /* ------------------------------------------------------------------------ */
//   /* Pagination                                                                */
//   /* ------------------------------------------------------------------------ */

//   const currentPage =
//     availablePagination.page;

//   const totalPages =
//     availablePagination.totalPages;

//   const totalCount =
//     availablePagination.totalCount;

//   const pageSize =
//     availablePagination.limit ||
//     QUIZ_BOARD_API_LIMIT;

//   const handlePageChange =
//     useCallback(
//       (page: number) => {
//         if (
//           page < 1 ||
//           page > totalPages ||
//           page === currentPage ||
//           isLoadingCompetitions
//         ) {
//           return;
//         }

//         void loadCompetitions(
//           page,
//         );

//         window.scrollTo({
//           top: 0,
//           behavior: "smooth",
//         });
//       },
//       [
//         currentPage,
//         totalPages,
//         isLoadingCompetitions,
//         loadCompetitions,
//       ],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* Filter reset                                                             */
//   /* ------------------------------------------------------------------------ */

//   const resetFilters =
//     useCallback(() => {
//       setSearchQuery(
//         DEFAULT_QUIZ_BOARD_FILTERS.searchQuery,
//       );

//       setStatusFilter(
//         DEFAULT_QUIZ_BOARD_FILTERS.statusFilter,
//       );

//       setDifficultyFilter(
//         DEFAULT_QUIZ_BOARD_FILTERS.difficultyFilter,
//       );

//       setSubjectFilter(
//         DEFAULT_QUIZ_BOARD_FILTERS.subjectFilter,
//       );
//     }, []);

//   /* ------------------------------------------------------------------------ */
//   /* Retry everything                                                         */
//   /* ------------------------------------------------------------------------ */

//   const handleRetryAll =
//     useCallback(() => {
//       if (!userId) {
//         return;
//       }

//       void loadCompetitions(
//         currentPage,
//       );

//       void loadMyCompetitions();
//     }, [
//       userId,
//       currentPage,
//       loadCompetitions,
//       loadMyCompetitions,
//     ]);

//   /* ------------------------------------------------------------------------ */
//   /* Browse competitions                                                      */
//   /* ------------------------------------------------------------------------ */

//   const handleBrowseCompetitions =
//     useCallback(() => {
//       document
//         .getElementById(
//           "quiz-competitions",
//         )
//         ?.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//     }, []);

//   /* ------------------------------------------------------------------------ */
//   /* Account loading state                                                    */
//   /* ------------------------------------------------------------------------ */

//   if (!isUserReady) {
//     return (
//       <main className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           <PageLoadingState />
//         </div>
//       </main>
//     );
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Page                                                                     */
//   /* ------------------------------------------------------------------------ */

//   return (
//     <main className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         {/* ---------------------------------------------------------------- */}
//         {/* Hero                                                              */}
//         {/* ---------------------------------------------------------------- */}

//         <QuizBoardHero
//           stats={stats}
//           totalCompetitions={
//             totalCount
//           }
//           isLoading={
//             isLoadingCompetitions
//           }
//         />

//         {/* ---------------------------------------------------------------- */}
//         {/* Stats                                                             */}
//         {/* ---------------------------------------------------------------- */}

//         <div className="mb-8">
//           <QuizBoardStats
//             stats={stats}
//             boards={boards}
//             isLoading={
//               isLoadingCompetitions
//             }
//           />
//         </div>

//         {/* ---------------------------------------------------------------- */}
//         {/* My Competitions                                                  */}
//         {/* ---------------------------------------------------------------- */}

//         <MyCompetitions
//           competitions={myBoards}
//           isLoading={
//             isLoadingMyCompetitions
//           }
//           error={
//             myCompetitionsError
//           }
//           currentTime={
//             currentTime
//           }
//           onRetry={
//             loadMyCompetitions
//           }
//         />

//         {/* ---------------------------------------------------------------- */}
//         {/* Available competitions                                           */}
//         {/* ---------------------------------------------------------------- */}

//         <section
//           id="quiz-competitions"
//           className="mt-10"
//         >
//           <div className="mb-5">
//             <div>
//               <h2 className="text-xl font-bold text-white sm:text-2xl">
//                 Available Competitions
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Choose a competition and
//                 test yourself against other
//                 students.
//               </p>
//             </div>
//           </div>

//           {/* -------------------------------------------------------------- */}
//           {/* Filters                                                         */}
//           {/* -------------------------------------------------------------- */}

//           <div className="mb-6">
//             <QuizBoardFilters
//               filters={{
//                 searchQuery,
//                 statusFilter,
//                 difficultyFilter,
//                 subjectFilter,
//               }}
//               subjects={subjects}
//               showFilters={
//                 showFilters
//               }
//               onToggleFilters={() =>
//                 setShowFilters(
//                   (value) =>
//                     !value,
//                 )
//               }
//               onSearchChange={
//                 setSearchQuery
//               }
//               onStatusChange={
//                 setStatusFilter
//               }
//               onDifficultyChange={
//                 setDifficultyFilter
//               }
//               onSubjectChange={
//                 setSubjectFilter
//               }
//               onReset={
//                 resetFilters
//               }
//             />
//           </div>

//           {/* -------------------------------------------------------------- */}
//           {/* Global API error                                                */}
//           {/* -------------------------------------------------------------- */}

//           {competitionsError &&
//             boards.length === 0 && (
//               <div className="mb-6">
//                 <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
//                   <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                     <div className="flex items-start gap-3">
//                       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
//                         <AlertCircle className="h-5 w-5 text-red-400" />
//                       </div>

//                       <div>
//                         <p className="text-sm font-semibold text-white">
//                           Unable to load competitions
//                         </p>

//                         <p className="mt-1 text-xs leading-5 text-slate-400">
//                           {
//                             competitionsError
//                           }
//                         </p>
//                       </div>
//                     </div>

//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={
//                         handleRetryAll
//                       }
//                       className="shrink-0 gap-2 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
//                     >
//                       <RefreshCw className="h-4 w-4" />
//                       Retry
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}

//           {/* -------------------------------------------------------------- */}
//           {/* List                                                            */}
//           {/* -------------------------------------------------------------- */}

//           <QuizBoardList
//   boards={filteredBoards}
//   isLoading={isLoadingCompetitions}
//   error={
//     competitionsError &&
//     boards.length > 0
//       ? competitionsError
//       : null
//   }
//   currentTime={currentTime}
//   joinedCompetitionIds={
//     joinedCompetitionIds
//   }
//   onRetry={() =>
//     loadCompetitions(currentPage)
//   }
// />

//           {/* -------------------------------------------------------------- */}
//           {/* Pagination                                                      */}
//           {/* -------------------------------------------------------------- */}

//           {!competitionsError &&
//             totalCount > 0 && (
//               <QuizBoardPagination
//                 currentPage={
//                   currentPage
//                 }
//                 totalPages={
//                   totalPages
//                 }
//                 totalResults={
//                   totalCount
//                 }
//                 pageSize={
//                   pageSize
//                 }
//                 isLoading={
//                   isLoadingCompetitions
//                 }
//                 onPageChange={
//                   handlePageChange
//                 }
//               />
//             )}
//         </section>

//         {/* ---------------------------------------------------------------- */}
//         {/* How Quiz Board Works                                             */}
//         {/* ---------------------------------------------------------------- */}

//         <QuizBoardHowItWorks />

//         {/* ---------------------------------------------------------------- */}
//         {/* Footer                                                           */}
//         {/* ---------------------------------------------------------------- */}

//         <div className="mt-10">
//           <QuizBoardFooterPlaceholder />
//         </div>
//       </div>
//     </main>
//   );
// }

// /* ========================================================================== */
// /* Helpers                                                                    */
// /* ========================================================================== */

// /**
//  * Extract quiz items from the different response
//  * shapes that the backend has used.
//  */
// function extractQuizItems(
//   response: MyQuizApiResponse | null | undefined,
// ): QuizApiItem[] {
//   if (!response) {
//     return [];
//   }

//   if (
//     Array.isArray(
//       response.quizzesObj,
//     )
//   ) {
//     return response.quizzesObj;
//   }

//   const data =
//     response.data;

//   if (
//     Array.isArray(data)
//   ) {
//     return data;
//   }

//   if (
//     data &&
//     typeof data === "object" &&
//     Array.isArray(
//       data.quizzesObj,
//     )
//   ) {
//     return data.quizzesObj;
//   }

//   return [];
// }

// /**
//  * Safely extract a useful API error message.
//  */
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

// /* -------------------------------------------------------------------------- */
// /* Initial page loading                                                       */
// /* -------------------------------------------------------------------------- */

// function PageLoadingState() {
//   return (
//     <div className="flex min-h-[70vh] items-center justify-center">
//       <div className="flex flex-col items-center text-center">
//         <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
//           <RefreshCw className="h-6 w-6 animate-spin text-violet-400" />
//         </div>

//         <h2 className="mt-5 text-lg font-bold text-white">
//           Loading Quiz Board
//         </h2>

//         <p className="mt-2 text-sm text-slate-500">
//           Preparing your competition arena...
//         </p>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Footer placeholder                                                         */
// /* -------------------------------------------------------------------------- */

// /**
//  * QuizBoardFooter previously contained the How It Works
//  * and pagination sections.
//  *
//  * Those responsibilities are now handled by:
//  *
//  * - QuizBoardPagination
//  * - QuizBoardHowItWorks
//  *
//  * Keep this small footer here until the final footer
//  * component is simplified.
//  */
// function QuizBoardFooterPlaceholder() {
//   return (
//     <footer className="border-t border-white/5 py-6 text-center">
//       <p className="text-[11px] leading-5 text-slate-600">
//         Quiz Board competitions are designed to
//         reward both speed and accuracy. Read each
//         question carefully and submit your answer
//         before the timer expires.
//       </p>
//     </footer>
//   );
// }


