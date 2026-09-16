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
import MyCompetitions from "@/components/quiz-board/MyCompetitions";

import {
  getAllWaitingQuizzesUserHasNotJoined,
  getAllMyQuizzes,
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
  QuizApiItem,
  QuizApiResponse,
  MyQuizApiResponse,
  QuizBoard,
  QuizParticipation,
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
  /* ------------------------------------------------------------------------ */
  /* User                                                                     */
  /* ------------------------------------------------------------------------ */

  const [userId, setUserId] =
    useState<string | null>(null);

  const [isUserReady, setIsUserReady] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Available competitions                                                   */
  /* ------------------------------------------------------------------------ */

  const [boards, setBoards] = useState<
    QuizBoard[]
  >([]);

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

  /* ------------------------------------------------------------------------ */
  /* My competitions                                                          */
  /* ------------------------------------------------------------------------ */

  const [myBoards, setMyBoards] = useState<
    QuizBoard[]
  >([]);

  const [
    isLoadingMyCompetitions,
    setIsLoadingMyCompetitions,
  ] = useState(false);

  const [
    myCompetitionsError,
    setMyCompetitionsError,
  ] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Filters                                                                  */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Clock                                                                    */
  /* ------------------------------------------------------------------------ */

  const [
    currentTime,
    setCurrentTime,
  ] = useState(() => Date.now());

  /* ------------------------------------------------------------------------ */
  /* Resolve authenticated user                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const id =
      getCurrentQuizBoardUserId();

    setUserId(id);
    setIsUserReady(true);
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Load available competitions                                              */
  /* ------------------------------------------------------------------------ */

  const loadCompetitions =
    useCallback(
      async (
        page = QUIZ_BOARD_API_PAGE,
      ) => {
        if (!userId) {
          return;
        }

        setIsLoadingCompetitions(true);
        setCompetitionsError(null);

        try {
          const response =
            (await getAllWaitingQuizzesUserHasNotJoined(
              userId,
              page,
              QUIZ_BOARD_API_LIMIT,
            )) as QuizApiResponse;

          const data =
            response?.data;

          const rawQuizzes =
            Array.isArray(
              data?.quizzesObj,
            )
              ? data.quizzesObj
              : [];

          const mappedBoards =
            rawQuizzes.map(
              (quiz) =>
                mapQuizToBoard(quiz),
            );

          const totalCount =
            Number(
              data?.totalCount ?? 0,
            );

          const totalPages =
            Number(
              data?.totalPages ??
                Math.max(
                  Math.ceil(
                    totalCount /
                      QUIZ_BOARD_API_LIMIT,
                  ),
                  1,
                ),
            );

          setBoards(mappedBoards);

          setAvailablePagination({
            totalCount,
            totalPages:
              totalPages > 0
                ? totalPages
                : 1,
            page:
              Number(
                data?.page ?? page,
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
            "Failed to load Quiz Board competitions:",
            error,
          );

          const message =
            getApiErrorMessage(
              error,
              "Unable to load Quiz Board competitions.",
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

  
/* ------------------------------------------------------------------------ */
/* Load my competitions                                                     */
/* ------------------------------------------------------------------------ */

const loadMyCompetitions =
  useCallback(async () => {
    if (!userId) {
      setMyBoards([]);
      return;
    }

    setIsLoadingMyCompetitions(true);
    setMyCompetitionsError(null);

    try {
      const response =
        (await getAllMyQuizzes(
          userId,
        )) as MyQuizApiResponse;

      const participations: QuizParticipation[] =
        response?.data?.participationsObj ??
        [];

      const mappedBoards =
        participations
          .filter(
            (
              participation: QuizParticipation,
            ) => Boolean(
              participation.quizId,
            ),
          )
          .map(
            (
              participation: QuizParticipation,
            ) =>
              mapQuizToBoard(
                participation.quizId,
              ),
          );

      console.log(
        "My Quiz Board participations:",
        participations,
      );

      console.log(
        "My Quiz Board competitions:",
        mappedBoards,
      );

      setMyBoards(
        mappedBoards,
      );
    } catch (error: unknown) {
      console.error(
        "Failed to load my Quiz Board competitions:",
        error,
      );

      setMyCompetitionsError(
        getApiErrorMessage(
          error,
          "Unable to load your competitions.",
        ),
      );

      setMyBoards([]);
    } finally {
      setIsLoadingMyCompetitions(
        false,
      );
    }
  }, [userId]);





  /* ------------------------------------------------------------------------ */
  /* Initial data loading                                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isUserReady) {
      return;
    }

    if (!userId) {
      setBoards([]);
      setMyBoards([]);

      setCompetitionsError(
        "Your account could not be identified. Please sign in again.",
      );

      setMyCompetitionsError(
        "Your account could not be identified.",
      );

      return;
    }

    void loadCompetitions(
      QUIZ_BOARD_API_PAGE,
    );

    void loadMyCompetitions();
  }, [
    isUserReady,
    userId,
    loadCompetitions,
    loadMyCompetitions,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Refresh relative time                                                    */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Joined competition IDs                                                   */
  /* ------------------------------------------------------------------------ */

  const joinedCompetitionIds =
    useMemo(() => {
      return new Set(
        myBoards.map(
          (board) => board.id,
        ),
      );
    }, [myBoards]);

  /* ------------------------------------------------------------------------ */
  /* Filter available competitions                                            */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Subjects                                                                 */
  /* ------------------------------------------------------------------------ */

  const subjects =
    useMemo(() => {
      /*
       * Include subjects from both the current
       * available competitions and the user's
       * competitions.
       */
      const allBoards = [
        ...boards,
        ...myBoards,
      ];

      return getUniqueSubjects(
        allBoards,
      );
    }, [boards, myBoards]);

  /* ------------------------------------------------------------------------ */
  /* Statistics                                                               */
  /* ------------------------------------------------------------------------ */

  const stats =
    useMemo(() => {
      return getQuizBoardStats(
        boards,
      );
    }, [boards]);

  /* ------------------------------------------------------------------------ */
  /* Pagination                                                                */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Filter reset                                                             */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* Retry everything                                                         */
  /* ------------------------------------------------------------------------ */

  const handleRetryAll =
    useCallback(() => {
      if (!userId) {
        return;
      }

      void loadCompetitions(
        currentPage,
      );

      void loadMyCompetitions();
    }, [
      userId,
      currentPage,
      loadCompetitions,
      loadMyCompetitions,
    ]);

  /* ------------------------------------------------------------------------ */
  /* Browse competitions                                                      */
  /* ------------------------------------------------------------------------ */

  const handleBrowseCompetitions =
    useCallback(() => {
      document
        .getElementById(
          "quiz-competitions",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, []);

  /* ------------------------------------------------------------------------ */
  /* Account loading state                                                    */
  /* ------------------------------------------------------------------------ */

  if (!isUserReady) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PageLoadingState />
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Page                                                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                              */}
        {/* ---------------------------------------------------------------- */}

        <QuizBoardHero
          stats={stats}
          totalCompetitions={
            totalCount
          }
          isLoading={
            isLoadingCompetitions
          }
        />

        {/* ---------------------------------------------------------------- */}
        {/* Stats                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-8">
          <QuizBoardStats
            stats={stats}
            boards={boards}
            isLoading={
              isLoadingCompetitions
            }
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* My Competitions                                                  */}
        {/* ---------------------------------------------------------------- */}

        <MyCompetitions
          competitions={myBoards}
          isLoading={
            isLoadingMyCompetitions
          }
          error={
            myCompetitionsError
          }
          currentTime={
            currentTime
          }
          onRetry={
            loadMyCompetitions
          }
        />

        {/* ---------------------------------------------------------------- */}
        {/* Available competitions                                           */}
        {/* ---------------------------------------------------------------- */}

        <section
          id="quiz-competitions"
          className="mt-10"
        >
          <div className="mb-5">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Available Competitions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose a competition and
                test yourself against other
                students.
              </p>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Filters                                                         */}
          {/* -------------------------------------------------------------- */}

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

          {/* -------------------------------------------------------------- */}
          {/* Global API error                                                */}
          {/* -------------------------------------------------------------- */}

          {competitionsError &&
            boards.length === 0 && (
              <div className="mb-6">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Unable to load competitions
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
                        handleRetryAll
                      }
                      className="shrink-0 gap-2 border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            )}

          {/* -------------------------------------------------------------- */}
          {/* List                                                            */}
          {/* -------------------------------------------------------------- */}

          <QuizBoardList
  boards={filteredBoards}
  isLoading={isLoadingCompetitions}
  error={
    competitionsError &&
    boards.length > 0
      ? competitionsError
      : null
  }
  currentTime={currentTime}
  joinedCompetitionIds={
    joinedCompetitionIds
  }
  onRetry={() =>
    loadCompetitions(currentPage)
  }
/>

          {/* -------------------------------------------------------------- */}
          {/* Pagination                                                      */}
          {/* -------------------------------------------------------------- */}

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

        {/* ---------------------------------------------------------------- */}
        {/* How Quiz Board Works                                             */}
        {/* ---------------------------------------------------------------- */}

        <QuizBoardHowItWorks />

        {/* ---------------------------------------------------------------- */}
        {/* Footer                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-10">
          <QuizBoardFooterPlaceholder />
        </div>
      </div>
    </main>
  );
}

/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */

/**
 * Extract quiz items from the different response
 * shapes that the backend has used.
 */
function extractQuizItems(
  response: MyQuizApiResponse | null | undefined,
): QuizApiItem[] {
  if (!response) {
    return [];
  }

  if (
    Array.isArray(
      response.quizzesObj,
    )
  ) {
    return response.quizzesObj;
  }

  const data =
    response.data;

  if (
    Array.isArray(data)
  ) {
    return data;
  }

  if (
    data &&
    typeof data === "object" &&
    Array.isArray(
      data.quizzesObj,
    )
  ) {
    return data.quizzesObj;
  }

  return [];
}

/**
 * Safely extract a useful API error message.
 */
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

/* -------------------------------------------------------------------------- */
/* Initial page loading                                                       */
/* -------------------------------------------------------------------------- */

function PageLoadingState() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
          <RefreshCw className="h-6 w-6 animate-spin text-violet-400" />
        </div>

        <h2 className="mt-5 text-lg font-bold text-white">
          Loading Quiz Board
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Preparing your competition arena...
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Footer placeholder                                                         */
/* -------------------------------------------------------------------------- */

/**
 * QuizBoardFooter previously contained the How It Works
 * and pagination sections.
 *
 * Those responsibilities are now handled by:
 *
 * - QuizBoardPagination
 * - QuizBoardHowItWorks
 *
 * Keep this small footer here until the final footer
 * component is simplified.
 */
function QuizBoardFooterPlaceholder() {
  return (
    <footer className="border-t border-white/5 py-6 text-center">
      <p className="text-[11px] leading-5 text-slate-600">
        Quiz Board competitions are designed to
        reward both speed and accuracy. Read each
        question carefully and submit your answer
        before the timer expires.
      </p>
    </footer>
  );
}












// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   AlertCircle,
//   ArrowLeft,
//   ArrowRight,
//   Award,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   Coins,
//   Eye,
//   Filter,
//   Flame,
//   Gamepad2,
//   GraduationCap,
//   HelpCircle,
//   Layers3,
//   Loader2,
//   Radio,
//   RefreshCw,
//   Search,
//   ShieldCheck,
//   Sparkles,
//   Trophy,
//   Users,
//   X,
//   Zap,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import {
//   getAllWaitingQuizzesUserHasNotJoined,
//   getAllMyQuizzes,
// } from "@/lib/api/quizCompetition";

// /* -------------------------------------------------------------------------- */
// /* TYPES                                                                      */
// /* -------------------------------------------------------------------------- */

// type QuizApiStatus =
//   | "DRAFT"
//   | "OPEN"
//   | "UPCOMING"
//   | "LIVE"
//   | "ONGOING"
//   | "FULL"
//   | "COMPLETED"
//   | "CLOSED"
//   | "PUBLISHED"
//   | string;

// type DisplayStatus =
//   | "OPEN"
//   | "UPCOMING"
//   | "LIVE"
//   | "FULL"
//   | "COMPLETED";

// type Difficulty = "EASY" | "MEDIUM" | "HARD" | "MIXED";

// type DifficultyBreakdown = {
//   easy?: number;
//   medium?: number;
//   hard?: number;
// };

// type QuizRound = {
//   round_number?: number;
//   round?: number;
//   no_of_questions?: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   exit_number?: number;
//   exit_reward?: number;
// };

// type FinalRoundInformation = {
//   no_of_questions?: number;
//   difficultyBreakdown?: DifficultyBreakdown;
//   first_position_reward?: number;
//   second_position_reward?: number;
// };

// type QuizApiSubject = {
//   _id?: string;
//   name?: string;
// };

// type QuizJoinedUser = Record<string, unknown>;

// type QuizApiItem = {
//   _id: string;
//   quiz_title: string;
//   description?: string;
//   status: QuizApiStatus;

//   subject?: QuizApiSubject | null;

//   time_per_question?: number;
//   start_date?: string;

//   no_of_contestants?: number;

//   joined_users?: QuizJoinedUser[];

//   number_of_rounds?: number;

//   round_information?: QuizRound[];

//   final_round_information?: FinalRoundInformation;

//   current_round?: number;

//   room_id?: string | null;

//   createdAt?: string;
//   updatedAt?: string;
// };

// type QuizApiResponse = {
//   success?: boolean;
//   message?: string;

//   data?: {
//     totalCount?: number;
//     totalPages?: number;
//     page?: number;
//     limit?: number;
//     quizzesObj?: QuizApiItem[];
//   };
// };

// type MyQuizApiResponse = {
//   success?: boolean;
//   message?: string;

//   data?: {
//     totalCount?: number;
//     totalPages?: number;
//     page?: number;
//     limit?: number;
//     quizzesObj?: QuizApiItem[];
//   };
// };

// type QuizBoard = {
//   id: string;

//   title: string;

//   description: string;

//   subject: string;

//   examType: string;

//   difficulty: Difficulty;

//   status: DisplayStatus;

//   players: number;

//   maxPlayers: number;

//   entryFee: number;

//   entryFeeType: "CBT_POINTS";

//   winnerReward: number;

//   secondReward: number;

//   totalQuestions: number;

//   durationMinutes: number;

//   startsAt: string;

//   createdAt: string;

//   numberOfRounds: number;

//   timePerQuestion: number;

//   roomId: string;
// };

// /* -------------------------------------------------------------------------- */
// /* FILTER OPTIONS                                                             */
// /* -------------------------------------------------------------------------- */

// const STATUS_OPTIONS: Array<{
//   value: "ALL" | DisplayStatus;
//   label: string;
// }> = [
//   {
//     value: "ALL",
//     label: "All Boards",
//   },
//   {
//     value: "OPEN",
//     label: "Open",
//   },
//   {
//     value: "UPCOMING",
//     label: "Upcoming",
//   },
//   {
//     value: "LIVE",
//     label: "Live Now",
//   },
//   {
//     value: "FULL",
//     label: "Full",
//   },
//   {
//     value: "COMPLETED",
//     label: "Completed",
//   },
// ];

// const DIFFICULTY_OPTIONS: Array<{
//   value: "ALL" | Difficulty;
//   label: string;
// }> = [
//   {
//     value: "ALL",
//     label: "All Difficulties",
//   },
//   {
//     value: "EASY",
//     label: "Easy",
//   },
//   {
//     value: "MEDIUM",
//     label: "Medium",
//   },
//   {
//     value: "HARD",
//     label: "Hard",
//   },
//   {
//     value: "MIXED",
//     label: "Mixed",
//   },
// ];

// /* -------------------------------------------------------------------------- */
// /* HELPERS                                                                    */
// /* -------------------------------------------------------------------------- */

// function normalizeStatus(status?: QuizApiStatus): DisplayStatus {
//   switch (String(status ?? "").toUpperCase()) {
//     case "OPEN":
//     case "PUBLISHED":
//       return "OPEN";

//     case "LIVE":
//     case "ONGOING":
//       return "LIVE";

//     case "FULL":
//       return "FULL";

//     case "COMPLETED":
//     case "CLOSED":
//       return "COMPLETED";

//     case "UPCOMING":
//     case "DRAFT":
//     default:
//       return "UPCOMING";
//   }
// }

// function getDifficultyFromQuiz(quiz: QuizApiItem): Difficulty {
//   const allBreakdowns: DifficultyBreakdown[] = [
//     ...(quiz.round_information ?? []).map(
//       (round) => round.difficultyBreakdown ?? {},
//     ),
//     quiz.final_round_information?.difficultyBreakdown ?? {},
//   ];

//   const easy = allBreakdowns.reduce(
//     (total, breakdown) => total + Number(breakdown.easy ?? 0),
//     0,
//   );

//   const medium = allBreakdowns.reduce(
//     (total, breakdown) => total + Number(breakdown.medium ?? 0),
//     0,
//   );

//   const hard = allBreakdowns.reduce(
//     (total, breakdown) => total + Number(breakdown.hard ?? 0),
//     0,
//   );

//   const categories = [
//     {
//       name: "EASY" as const,
//       value: easy,
//     },
//     {
//       name: "MEDIUM" as const,
//       value: medium,
//     },
//     {
//       name: "HARD" as const,
//       value: hard,
//     },
//   ].filter((item) => item.value > 0);

//   if (categories.length === 0) {
//     return "MIXED";
//   }

//   if (categories.length > 1) {
//     return "MIXED";
//   }

//   return categories[0].name;
// }

// function getTotalQuestions(quiz: QuizApiItem): number {
//   const eliminationQuestions = (
//     quiz.round_information ?? []
//   ).reduce(
//     (total, round) =>
//       total + Number(round.no_of_questions ?? 0),
//     0,
//   );

//   const finalQuestions = Number(
//     quiz.final_round_information?.no_of_questions ?? 0,
//   );

//   return eliminationQuestions + finalQuestions;
// }

// function getDurationMinutes(quiz: QuizApiItem): number {
//   const totalQuestions = getTotalQuestions(quiz);

//   const timePerQuestion = Number(
//     quiz.time_per_question ?? 0,
//   );

//   if (!totalQuestions || !timePerQuestion) {
//     return 0;
//   }

//   return Math.ceil(
//     (totalQuestions * timePerQuestion) / 60,
//   );
// }

// function mapQuizToBoard(quiz: QuizApiItem): QuizBoard {
//   const joinedUsers = Array.isArray(quiz.joined_users)
//     ? quiz.joined_users
//     : [];

//   const maxPlayers = Number(
//     quiz.no_of_contestants ?? 0,
//   );

//   const normalizedStatus = normalizeStatus(
//     quiz.status,
//   );

//   const players = joinedUsers.length;

//   const status =
//     normalizedStatus !== "COMPLETED" &&
//     normalizedStatus !== "LIVE" &&
//     maxPlayers > 0 &&
//     players >= maxPlayers
//       ? "FULL"
//       : normalizedStatus;

//   return {
//     id: quiz._id,

//     title:
//       quiz.quiz_title ||
//       "Untitled Quiz Competition",

//     description:
//       quiz.description ||
//       "Compete against other students in this Quiz Board competition.",

//     subject:
//       quiz.subject?.name ||
//       "General",

//     examType: "JAMB",

//     difficulty:
//       getDifficultyFromQuiz(quiz),

//     status,

//     players,

//     maxPlayers,

//     entryFee: 0,

//     entryFeeType: "CBT_POINTS",

//     winnerReward: Number(
//       quiz.final_round_information
//         ?.first_position_reward ?? 0,
//     ),

//     secondReward: Number(
//       quiz.final_round_information
//         ?.second_position_reward ?? 0,
//     ),

//     totalQuestions:
//       getTotalQuestions(quiz),

//     durationMinutes:
//       getDurationMinutes(quiz),

//     startsAt:
//       quiz.start_date ||
//       quiz.createdAt ||
//       "",

//     createdAt:
//       quiz.createdAt ||
//       "",

//     numberOfRounds:
//       Number(
//         quiz.number_of_rounds ?? 0,
//       ),

//     timePerQuestion:
//       Number(
//         quiz.time_per_question ?? 0,
//       ),

//     roomId:
//       quiz.room_id ||
//       "",
//   };
// }

// function formatDate(
//   dateString: string,
// ): string {
//   if (!dateString) {
//     return "Date not available";
//   }

//   const date = new Date(dateString);

//   if (Number.isNaN(date.getTime())) {
//     return "Date not available";
//   }

//   return new Intl.DateTimeFormat(
//     "en-NG",
//     {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//     },
//   ).format(date);
// }

// function getRelativeTime(
//   dateString: string,
// ): string {
//   if (!dateString) {
//     return "";
//   }

//   const target =
//     new Date(dateString).getTime();

//   if (Number.isNaN(target)) {
//     return "";
//   }

//   const now = Date.now();

//   const difference =
//     target - now;

//   if (difference <= 0) {
//     return "Started";
//   }

//   const minutes = Math.floor(
//     difference / (1000 * 60),
//   );

//   const hours = Math.floor(
//     minutes / 60,
//   );

//   const days = Math.floor(
//     hours / 24,
//   );

//   if (days > 0) {
//     return `Starts in ${days}d ${hours % 24}h`;
//   }

//   if (hours > 0) {
//     return `Starts in ${hours}h ${minutes % 60}m`;
//   }

//   if (minutes > 0) {
//     return `Starts in ${minutes}m`;
//   }

//   return "Starting soon";
// }

// function getDifficultyClasses(
//   difficulty: Difficulty,
// ): string {
//   switch (difficulty) {
//     case "EASY":
//       return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";

//     case "MEDIUM":
//       return "border-amber-400/20 bg-amber-500/10 text-amber-300";

//     case "HARD":
//       return "border-rose-400/20 bg-rose-500/10 text-rose-300";

//     default:
//       return "border-blue-400/20 bg-blue-500/10 text-blue-300";
//   }
// }

// function getStatusClasses(
//   status: DisplayStatus,
// ): string {
//   switch (status) {
//     case "OPEN":
//       return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";

//     case "LIVE":
//       return "border-red-400/20 bg-red-500/10 text-red-300";

//     case "FULL":
//       return "border-orange-400/20 bg-orange-500/10 text-orange-300";

//     case "COMPLETED":
//       return "border-white/10 bg-white/[0.04] text-slate-400";

//     default:
//       return "border-blue-400/20 bg-blue-500/10 text-blue-300";
//   }
// }

// function getStatusLabel(
//   status: DisplayStatus,
// ): string {
//   switch (status) {
//     case "OPEN":
//       return "Open";

//     case "UPCOMING":
//       return "Upcoming";

//     case "LIVE":
//       return "Live";

//     case "FULL":
//       return "Full";

//     case "COMPLETED":
//       return "Completed";

//     default:
//       return status;
//   }
// }

// function getSubjectIcon(
//   subject: string,
// ): string {
//   const normalized =
//     subject.toLowerCase();

//   if (normalized.includes("biology")) {
//     return "🧬";
//   }

//   if (normalized.includes("chemistry")) {
//     return "⚗️";
//   }

//   if (normalized.includes("physics")) {
//     return "⚛️";
//   }

//   if (
//     normalized.includes("mathematics") ||
//     normalized.includes("math")
//   ) {
//     return "📐";
//   }

//   if (normalized.includes("english")) {
//     return "📚";
//   }

//   if (normalized.includes("agricultural")) {
//     return "🌱";
//   }

//   return "🎯";
// }

// function getBoardAction(
//   board: QuizBoard,
// ): string {
//   switch (board.status) {
//     case "OPEN":
//       return "View & Join";

//     case "LIVE":
//       return "View Live";

//     case "UPCOMING":
//       return "View Details";

//     case "FULL":
//       return "View Board";

//     case "COMPLETED":
//       return "View Result";

//     default:
//       return "View Board";
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* USER ID                                                                    */
// /* -------------------------------------------------------------------------- */

// function getCurrentUserId(): string {
//   const possibleKeys = [
//     "user",
//     "auth-user",
//     "jamb_user",
//     "jamb_auth_user",
//   ];

//   for (const key of possibleKeys) {
//     const storedUser =
//       localStorage.getItem(key);

//     if (!storedUser) {
//       continue;
//     }

//     try {
//       const parsedUser =
//         JSON.parse(storedUser);

//       const userId =
//         parsedUser?._id ||
//         parsedUser?.id ||
//         parsedUser?.userId ||
//         parsedUser?.user?._id ||
//         parsedUser?.user?.id;

//       if (userId) {
//         return String(userId);
//       }
//     } catch (error) {
//       console.error(
//         `Unable to parse localStorage key "${key}"`,
//         error,
//       );
//     }
//   }

//   throw new Error(
//     "Unable to identify the logged-in user.",
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* PAGE                                                                       */
// /* -------------------------------------------------------------------------- */

// export default function QuizBoardPage() {
//   const [boards, setBoards] =
//     useState<QuizBoard[]>([]);

//   const [myBoards, setMyBoards] =
//     useState<QuizBoard[]>([]);

//   const [userId, setUserId] =
//     useState<string | null>(null);

//   const [page, setPage] =
//     useState(1);

//   const limit = 10;

//   const [totalPages, setTotalPages] =
//     useState(1);

//   const [totalCount, setTotalCount] =
//     useState(0);

//   const [isLoading, setIsLoading] =
//     useState(true);

//   const [isRefreshing, setIsRefreshing] =
//     useState(false);

//   const [isLoadingMyBoards, setIsLoadingMyBoards] =
//     useState(false);

//   const [error, setError] =
//     useState("");

//   const [myBoardsError, setMyBoardsError] =
//     useState("");

//   const [showMyBoards, setShowMyBoards] =
//     useState(false);

//   const [searchQuery, setSearchQuery] =
//     useState("");

//   const [statusFilter, setStatusFilter] =
//     useState<"ALL" | DisplayStatus>(
//       "ALL",
//     );

//   const [difficultyFilter, setDifficultyFilter] =
//     useState<"ALL" | Difficulty>(
//       "ALL",
//     );

//   const [subjectFilter, setSubjectFilter] =
//     useState("ALL");

//   const [showFilters, setShowFilters] =
//     useState(false);

//   /* ------------------------------------------------------------------------ */
//   /* USER                                                                     */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     try {
//       const id =
//         getCurrentUserId();

//       console.log(
//         "Quiz Board user ID:",
//         id,
//       );

//       setUserId(id);
//     } catch (error) {
//       console.error(
//         "Unable to get current user:",
//         error,
//       );

//       setError(
//         "Unable to identify the logged-in user.",
//       );

//       setIsLoading(false);
//     }
//   }, []);

//   /* ------------------------------------------------------------------------ */
//   /* LOAD AVAILABLE QUIZZES                                                   */
//   /* ------------------------------------------------------------------------ */

//   const loadQuizzes = useCallback(
//     async (
//       showRefreshState = false,
//     ) => {
//       if (!userId) {
//         return;
//       }

//       try {
//         if (showRefreshState) {
//           setIsRefreshing(true);
//         } else {
//           setIsLoading(true);
//         }

//         setError("");

//         console.log(
//           "Loading Quiz Boards:",
//           {
//             userId,
//             page,
//             limit,
//           },
//         );

//         const response =
//           (await getAllWaitingQuizzesUserHasNotJoined(
//             userId,
//             page,
//             limit,
//           )) as QuizApiResponse;

//         console.log(
//           "Quiz Boards API response:",
//           response,
//         );

//         const quizzes =
//           Array.isArray(
//             response?.data?.quizzesObj,
//           )
//             ? response.data.quizzesObj
//             : [];

//         const apiTotalPages =
//           Number(
//             response?.data?.totalPages ??
//               1,
//           );

//         const apiTotalCount =
//           Number(
//             response?.data?.totalCount ??
//               quizzes.length,
//           );

//         setBoards(
//           quizzes.map(
//             mapQuizToBoard,
//           ),
//         );

//         setTotalPages(
//           Math.max(
//             1,
//             apiTotalPages,
//           ),
//         );

//         setTotalCount(
//           apiTotalCount,
//         );
//       } catch (err: any) {
//         console.error(
//           "Failed to load Quiz Boards:",
//           err,
//         );

//         const status =
//           err?.response?.status;

//         const serverMessage =
//           err?.response?.data
//             ?.message;

//         let message =
//           serverMessage ||
//           err?.message ||
//           "Unable to load Quiz Boards.";

//         if (status === 404) {
//           message =
//             "The Quiz Board endpoint was not found on the server. Please verify that the deployed backend exposes /quiz/get-all-waiting-quizzes-user-has-not-joined/:userId.";
//         }

//         setError(message);

//         setBoards([]);

//         setTotalPages(1);

//         setTotalCount(0);
//       } finally {
//         setIsLoading(false);

//         setIsRefreshing(false);
//       }
//     },
//     [
//       userId,
//       page,
//     ],
//   );

//   /* ------------------------------------------------------------------------ */
//   /* LOAD MY QUIZZES                                                          */
//   /* ------------------------------------------------------------------------ */

//   const loadMyQuizzes =
//     useCallback(
//       async () => {
//         try {
//           setIsLoadingMyBoards(true);

//           setMyBoardsError("");

//           const currentUserId =
//             getCurrentUserId();

//           console.log(
//             "Loading My Competitions:",
//             currentUserId,
//           );

//           const response =
//             (await getAllMyQuizzes(
//               currentUserId,
//             )) as MyQuizApiResponse;

//           console.log(
//             "My Competitions API response:",
//             response,
//           );

//           const quizzes =
//             Array.isArray(
//               response?.data
//                 ?.quizzesObj,
//             )
//               ? response.data.quizzesObj
//               : [];

//           setMyBoards(
//             quizzes.map(
//               mapQuizToBoard,
//             ),
//           );

//           setShowMyBoards(true);
//         } catch (err: any) {
//           console.error(
//             "Failed to load my Quiz Boards:",
//             err,
//           );

//           const status =
//             err?.response?.status;

//           const serverMessage =
//             err?.response?.data
//               ?.message;

//           let message =
//             serverMessage ||
//             err?.message ||
//             "Unable to load your Quiz Boards.";

//           if (status === 404) {
//             message =
//               "The My Competitions endpoint was not found on the server. Please verify that the deployed backend exposes /quiz/get-all-my-quizzes/:userId.";
//           }

//           setMyBoardsError(
//             message,
//           );

//           setMyBoards([]);

//           setShowMyBoards(true);
//         } finally {
//           setIsLoadingMyBoards(
//             false,
//           );
//         }
//       },
//       [],
//     );

//   /* ------------------------------------------------------------------------ */
//   /* LOAD WHEN USER/PAGE CHANGES                                              */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     if (!userId) {
//       return;
//     }

//     void loadQuizzes();
//   }, [
//     userId,
//     page,
//     loadQuizzes,
//   ]);

//   /* ------------------------------------------------------------------------ */
//   /* SUBJECTS                                                                 */
//   /* ------------------------------------------------------------------------ */

//   const subjects = useMemo(() => {
//     const uniqueSubjects =
//       Array.from(
//         new Set(
//           boards
//             .map(
//               (board) =>
//                 board.subject,
//             )
//             .filter(Boolean),
//         ),
//       ).sort();

//     return [
//       "ALL",
//       ...uniqueSubjects,
//     ];
//   }, [boards]);

//   /* ------------------------------------------------------------------------ */
//   /* FILTERED BOARDS                                                          */
//   /* ------------------------------------------------------------------------ */

//   const filteredBoards =
//     useMemo(() => {
//       const normalizedSearch =
//         searchQuery
//           .trim()
//           .toLowerCase();

//       return boards.filter(
//         (board) => {
//           const matchesSearch =
//             !normalizedSearch ||
//             board.title
//               .toLowerCase()
//               .includes(
//                 normalizedSearch,
//               ) ||
//             board.subject
//               .toLowerCase()
//               .includes(
//                 normalizedSearch,
//               ) ||
//             board.description
//               .toLowerCase()
//               .includes(
//                 normalizedSearch,
//               );

//           const matchesStatus =
//             statusFilter ===
//               "ALL" ||
//             board.status ===
//               statusFilter;

//           const matchesDifficulty =
//             difficultyFilter ===
//               "ALL" ||
//             board.difficulty ===
//               difficultyFilter;

//           const matchesSubject =
//             subjectFilter ===
//               "ALL" ||
//             board.subject ===
//               subjectFilter;

//           return (
//             matchesSearch &&
//             matchesStatus &&
//             matchesDifficulty &&
//             matchesSubject
//           );
//         },
//       );
//     }, [
//       boards,
//       searchQuery,
//       statusFilter,
//       difficultyFilter,
//       subjectFilter,
//     ]);

//   /* ------------------------------------------------------------------------ */
//   /* STATS                                                                    */
//   /* ------------------------------------------------------------------------ */

//   const openBoards =
//     boards.filter(
//       (board) =>
//         board.status ===
//         "OPEN",
//     );

//   const liveBoards =
//     boards.filter(
//       (board) =>
//         board.status ===
//         "LIVE",
//     );

//   const upcomingBoards =
//     boards.filter(
//       (board) =>
//         board.status ===
//         "UPCOMING",
//     );

//   const totalPlayers =
//     boards.reduce(
//       (total, board) =>
//         total +
//         board.players,
//       0,
//     );

//   const totalCapacity =
//     boards.reduce(
//       (total, board) =>
//         total +
//         board.maxPlayers,
//       0,
//     );

//   /* ------------------------------------------------------------------------ */
//   /* FILTER STATE                                                             */
//   /* ------------------------------------------------------------------------ */

//   const hasActiveFilters =
//     statusFilter !== "ALL" ||
//     difficultyFilter !== "ALL" ||
//     subjectFilter !== "ALL" ||
//     searchQuery.trim()
//       .length > 0;

//   function clearFilters() {
//     setSearchQuery("");

//     setStatusFilter(
//       "ALL",
//     );

//     setDifficultyFilter(
//       "ALL",
//     );

//     setSubjectFilter(
//       "ALL",
//     );
//   }

//   /* ------------------------------------------------------------------------ */
//   /* PAGINATION                                                               */
//   /* ------------------------------------------------------------------------ */

//   function goToPreviousPage() {
//     if (page <= 1) {
//       return;
//     }

//     setPage(
//       (current) =>
//         current - 1,
//     );
//   }

//   function goToNextPage() {
//     if (page >= totalPages) {
//       return;
//     }

//     setPage(
//       (current) =>
//         current + 1,
//     );
//   }

//   /* ------------------------------------------------------------------------ */
//   /* RENDER                                                                   */
//   /* ------------------------------------------------------------------------ */

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       {/* ================================================================== */}
//       {/* HERO                                                               */}
//       {/* ================================================================== */}

//       <section className="relative overflow-hidden border-b border-white/10 bg-white/[0.02]">
//         <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_30%)]" />

//         <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
//           <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
//             <div className="max-w-3xl">
//               <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
//                 <Gamepad2 className="h-4 w-4" />
//                 Competitive Learning
//               </div>

//               <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
//                 Quiz Board
//               </h1>

//               <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
//                 Explore live and upcoming quiz battles. Pick a
//                 board, check the rules, and compete against other
//                 students for the top spot.
//               </p>

//               <div className="mt-6 flex flex-wrap gap-3">
//                 <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
//                   <Users className="h-4 w-4 text-blue-400" />

//                   <span className="text-sm font-semibold text-slate-300">
//                     {totalPlayers}/
//                     {totalCapacity}
//                   </span>

//                   <span className="text-xs text-slate-500">
//                     joined
//                   </span>
//                 </div>

//                 <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
//                   <Trophy className="h-4 w-4 text-amber-400" />

//                   <span className="text-sm font-semibold text-slate-300">
//                     Multiple elimination rounds
//                   </span>
//                 </div>

//                 <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
//                   <Zap className="h-4 w-4 text-emerald-400" />

//                   <span className="text-sm font-semibold text-slate-300">
//                     Speed matters
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="w-full max-w-sm">
//               <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//                     <Trophy className="h-5 w-5 text-blue-400" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//                       Competition Format
//                     </p>

//                     <p className="mt-1 text-sm font-bold text-white">
//                       20 → 15 → 10 → 5 → 2 → 1
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-5 grid grid-cols-2 gap-3">
//                   <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
//                     <p className="text-xs text-slate-500">
//                       Boards
//                     </p>

//                     <p className="mt-1 text-xl font-black text-white">
//                       {totalCount ||
//                         boards.length}
//                     </p>
//                   </div>

//                   <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
//                     <p className="text-xs text-slate-500">
//                       Live now
//                     </p>

//                     <p className="mt-1 text-xl font-black text-red-400">
//                       {liveBoards.length}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ================================================================== */}
//       {/* QUICK STATS                                                         */}
//       {/* ================================================================== */}

//       <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
//           <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-400">
//                 Open
//               </span>

//               <CheckCircle2 className="h-4 w-4 text-emerald-400" />
//             </div>

//             <p className="mt-2 text-2xl font-black text-white">
//               {openBoards.length}
//             </p>

//             <p className="mt-1 text-xs text-slate-500">
//               Ready to join
//             </p>
//           </div>

//           <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-400">
//                 Live
//               </span>

//               <Radio className="h-4 w-4 text-red-400" />
//             </div>

//             <p className="mt-2 text-2xl font-black text-white">
//               {liveBoards.length}
//             </p>

//             <p className="mt-1 text-xs text-slate-500">
//               Happening now
//             </p>
//           </div>

//           <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-400">
//                 Upcoming
//               </span>

//               <CalendarDays className="h-4 w-4 text-blue-400" />
//             </div>

//             <p className="mt-2 text-2xl font-black text-white">
//               {upcomingBoards.length}
//             </p>

//             <p className="mt-1 text-xs text-slate-500">
//               Starting soon
//             </p>
//           </div>

//           <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl">
//             <div className="flex items-center justify-between">
//               <span className="text-xs font-medium text-slate-400">
//                 Capacity
//               </span>

//               <Users className="h-4 w-4 text-violet-400" />
//             </div>

//             <p className="mt-2 text-2xl font-black text-white">
//               {totalPlayers}/
//               {totalCapacity}
//             </p>

//             <p className="mt-1 text-xs text-slate-500">
//               Joined / maximum contestants
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ================================================================== */}
//       {/* SEARCH + FILTERS                                                    */}
//       {/* ================================================================== */}

//       <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
//         <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl">
//           <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
//             <div className="relative flex-1">
//               <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(event) =>
//                   setSearchQuery(
//                     event.target.value,
//                   )
//                 }
//                 placeholder="Search Quiz Boards, subjects..."
//                 className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-blue-500/10"
//               />
//             </div>

//             <Button
//               type="button"
//               variant="outline"
//               onClick={() =>
//                 setShowFilters(
//                   (value) =>
//                     !value,
//                 )
//               }
//               className="h-11 gap-2 rounded-xl border-white/10 bg-white/[0.03] px-4 text-slate-300 hover:bg-white/[0.06] hover:text-white"
//             >
//               <Filter className="h-4 w-4" />

//               Filters

//               {hasActiveFilters && (
//                 <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
//                   !
//                 </span>
//               )}
//             </Button>

//             <Button
//               type="button"
//               variant="outline"
//               onClick={() =>
//                 void loadQuizzes(
//                   true,
//                 )
//               }
//               disabled={
//                 isLoading ||
//                 isRefreshing ||
//                 !userId
//               }
//               className="h-11 gap-2 rounded-xl border-white/10 bg-white/[0.03] px-4 text-slate-300 hover:bg-white/[0.06] hover:text-white"
//             >
//               {isRefreshing ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <RefreshCw className="h-4 w-4" />
//               )}

//               Refresh
//             </Button>

//             <Button
//               type="button"
//               variant="outline"
//               onClick={() =>
//                 void loadMyQuizzes()
//               }
//               disabled={
//                 isLoadingMyBoards
//               }
//               className="h-11 gap-2 rounded-xl border-blue-400/20 bg-blue-500/10 px-4 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
//             >
//               {isLoadingMyBoards ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Trophy className="h-4 w-4" />
//               )}

//               My Competitions
//             </Button>
//           </div>

//           {showFilters && (
//             <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 md:grid-cols-3">
//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold text-slate-500">
//                   Status
//                 </label>

//                 <select
//                   value={
//                     statusFilter
//                   }
//                   onChange={(
//                     event,
//                   ) =>
//                     setStatusFilter(
//                       event.target
//                         .value as
//                         | "ALL"
//                         | DisplayStatus,
//                     )
//                   }
//                   className="h-10 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm font-medium text-slate-300 outline-none focus:border-blue-400/40"
//                 >
//                   {STATUS_OPTIONS.map(
//                     (option) => (
//                       <option
//                         key={
//                           option.value
//                         }
//                         value={
//                           option.value
//                         }
//                       >
//                         {
//                           option.label
//                         }
//                       </option>
//                     ),
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold text-slate-500">
//                   Difficulty
//                 </label>

//                 <select
//                   value={
//                     difficultyFilter
//                   }
//                   onChange={(
//                     event,
//                   ) =>
//                     setDifficultyFilter(
//                       event.target
//                         .value as
//                         | "ALL"
//                         | Difficulty,
//                     )
//                   }
//                   className="h-10 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm font-medium text-slate-300 outline-none focus:border-blue-400/40"
//                 >
//                   {DIFFICULTY_OPTIONS.map(
//                     (option) => (
//                       <option
//                         key={
//                           option.value
//                         }
//                         value={
//                           option.value
//                         }
//                       >
//                         {
//                           option.label
//                         }
//                       </option>
//                     ),
//                   )}
//                 </select>
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-xs font-semibold text-slate-500">
//                   Subject
//                 </label>

//                 <select
//                   value={
//                     subjectFilter
//                   }
//                   onChange={(
//                     event,
//                   ) =>
//                     setSubjectFilter(
//                       event.target
//                         .value,
//                     )
//                   }
//                   className="h-10 w-full rounded-xl border border-white/10 bg-slate-900 px-3 text-sm font-medium text-slate-300 outline-none focus:border-blue-400/40"
//                 >
//                   {subjects.map(
//                     (subject) => (
//                       <option
//                         key={
//                           subject
//                         }
//                         value={
//                           subject
//                         }
//                       >
//                         {subject ===
//                         "ALL"
//                           ? "All Subjects"
//                           : subject}
//                       </option>
//                     ),
//                   )}
//                 </select>
//               </div>
//             </div>
//           )}

//           {hasActiveFilters && (
//             <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
//               <p className="text-xs text-slate-500">
//                 Showing{" "}
//                 {
//                   filteredBoards.length
//                 }{" "}
//                 of{" "}
//                 {boards.length}{" "}
//                 boards on this page
//               </p>

//               <button
//                 type="button"
//                 onClick={
//                   clearFilters
//                 }
//                 className="text-xs font-bold text-blue-400 hover:text-blue-300"
//               >
//                 Clear filters
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ================================================================== */}
//       {/* MY COMPETITIONS                                                     */}
//       {/* ================================================================== */}

//       {showMyBoards && (
//         <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
//           <div className="overflow-hidden rounded-3xl border border-blue-400/20 bg-blue-500/[0.04] shadow-xl">
//             <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//                   <Trophy className="h-5 w-5 text-blue-400" />
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-black text-white">
//                     My Competitions
//                   </h2>

//                   <p className="mt-1 text-xs text-slate-500">
//                     Competitions you have joined.
//                   </p>
//                 </div>
//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() =>
//                   setShowMyBoards(
//                     false,
//                   )
//                 }
//                 className="rounded-xl border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white"
//               >
//                 <X className="mr-2 h-4 w-4" />
//                 Hide
//               </Button>
//             </div>

//             {myBoardsError && (
//               <div className="m-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />

//                   <div className="flex-1">
//                     <p className="text-sm font-bold text-rose-300">
//                       Unable to load your competitions
//                     </p>

//                     <p className="mt-1 text-xs leading-5 text-rose-200/70">
//                       {myBoardsError}
//                     </p>
//                   </div>

//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() =>
//                       void loadMyQuizzes()
//                     }
//                     className="rounded-xl border-rose-400/20 bg-transparent text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
//                   >
//                     Retry
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {isLoadingMyBoards ? (
//               <div className="px-6 py-12 text-center">
//                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//                   <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
//                 </div>

//                 <p className="mt-4 text-sm font-semibold text-slate-400">
//                   Loading your competitions...
//                 </p>
//               </div>
//             ) : myBoards.length === 0 &&
//               !myBoardsError ? (
//               <div className="px-6 py-12 text-center">
//                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
//                   <Gamepad2 className="h-5 w-5 text-slate-500" />
//                 </div>

//                 <h3 className="mt-4 text-base font-black text-white">
//                   No competitions yet
//                 </h3>

//                 <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
//                   You have not joined any Quiz Board competition yet.
//                 </p>
//               </div>
//             ) : (
//               <div className="grid gap-3 p-5 sm:p-6 lg:grid-cols-2">
//                 {myBoards.map(
//                   (board) => {
//                     const isLive =
//                       board.status ===
//                       "LIVE";

//                     const isCompleted =
//                       board.status ===
//                       "COMPLETED";

//                     const isFull =
//                       board.status ===
//                       "FULL";

//                     const playerPercentage =
//                       board.maxPlayers >
//                       0
//                         ? Math.min(
//                             100,
//                             Math.round(
//                               (board.players /
//                                 board.maxPlayers) *
//                                 100,
//                             ),
//                           )
//                         : 0;

//                     return (
//                       <article
//                         key={
//                           board.id
//                         }
//                         className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-blue-400/20 hover:bg-white/[0.05]"
//                       >
//                         <div className="p-4 sm:p-5">
//                           <div className="flex items-start justify-between gap-4">
//                             <div className="flex min-w-0 items-center gap-3">
//                               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl">
//                                 {getSubjectIcon(
//                                   board.subject,
//                                 )}
//                               </div>

//                               <div className="min-w-0">
//                                 <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
//                                   JAMB •{" "}
//                                   {
//                                     board.subject
//                                   }
//                                 </p>

//                                 <h3 className="mt-1 truncate text-sm font-black text-white">
//                                   {
//                                     board.title
//                                   }
//                                 </h3>
//                               </div>
//                             </div>

//                             <span
//                               className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
//                                 board.status,
//                               )}`}
//                             >
//                               {
//                                 getStatusLabel(
//                                   board.status,
//                                 )
//                               }
//                             </span>
//                           </div>

//                           <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-500">
//                             {
//                               board.description
//                             }
//                           </p>

//                           <div className="mt-4">
//                             <div className="flex items-center justify-between">
//                               <div className="flex items-center gap-2">
//                                 <Users className="h-4 w-4 text-blue-400" />

//                                 <span className="text-xs font-bold text-slate-300">
//                                   {
//                                     board.players
//                                   }
//                                   /
//                                   {
//                                     board.maxPlayers
//                                   }
//                                 </span>

//                                 <span className="text-[11px] text-slate-600">
//                                   joined
//                                 </span>
//                               </div>

//                               <span className="text-[11px] font-semibold text-slate-500">
//                                 {isFull
//                                   ? "Competition full"
//                                   : `${playerPercentage}% full`}
//                               </span>
//                             </div>

//                             <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
//                               <div
//                                 className={`h-full rounded-full ${
//                                   isLive
//                                     ? "bg-red-500"
//                                     : isFull
//                                       ? "bg-orange-500"
//                                       : "bg-blue-600"
//                                 }`}
//                                 style={{
//                                   width: `${playerPercentage}%`,
//                                 }}
//                               />
//                             </div>
//                           </div>

//                           <div className="mt-4 grid grid-cols-3 gap-2">
//                             <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
//                               <p className="text-[10px] text-slate-600">
//                                 Rounds
//                               </p>

//                               <p className="mt-1 text-sm font-black text-white">
//                                 {
//                                   board.numberOfRounds ||
//                                   "—"
//                                 }
//                               </p>
//                             </div>

//                             <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
//                               <p className="text-[10px] text-slate-600">
//                                 Questions
//                               </p>

//                               <p className="mt-1 text-sm font-black text-white">
//                                 {
//                                   board.totalQuestions ||
//                                   "—"
//                                 }
//                               </p>
//                             </div>

//                             <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
//                               <p className="text-[10px] text-slate-600">
//                                 Time
//                               </p>

//                               <p className="mt-1 text-sm font-black text-white">
//                                 {board.timePerQuestion
//                                   ? `${board.timePerQuestion}s`
//                                   : "—"}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
//                             <div className="flex items-center gap-3">
//                               <CalendarDays className="h-4 w-4 shrink-0 text-blue-400" />

//                               <div className="min-w-0 flex-1">
//                                 <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
//                                   {isLive
//                                     ? "Started"
//                                     : isCompleted
//                                       ? "Competition time"
//                                       : "Scheduled"}
//                                 </p>

//                                 <p className="mt-0.5 truncate text-xs font-bold text-slate-300">
//                                   {formatDate(
//                                     board.startsAt,
//                                   )}
//                                 </p>
//                               </div>

//                               {!isCompleted &&
//                                 board.startsAt && (
//                                   <span className="shrink-0 text-[10px] font-bold text-blue-400">
//                                     {getRelativeTime(
//                                       board.startsAt,
//                                     )}
//                                   </span>
//                                 )}
//                             </div>
//                           </div>

//                           <div className="mt-4 flex gap-2">
//                             <Link
//                               href={`/student/quiz-board/${board.id}`}
//                               className="flex-1"
//                             >
//                               <Button className="w-full gap-2 rounded-xl bg-blue-600 text-xs text-white hover:bg-blue-500">
//                                 Open Competition
//                                 <ArrowRight className="h-4 w-4" />
//                               </Button>
//                             </Link>

//                             {isLive && (
//                               <Link
//                                 href={`/student/quiz-board/${board.id}/watch`}
//                               >
//                                 <Button
//                                   type="button"
//                                   variant="outline"
//                                   className="h-10 gap-2 rounded-xl border-red-400/20 bg-red-500/10 px-3 text-xs text-red-400 hover:bg-red-500/20 hover:text-red-300"
//                                 >
//                                   <Eye className="h-4 w-4" />
//                                   Watch
//                                 </Button>
//                               </Link>
//                             )}
//                           </div>
//                         </div>
//                       </article>
//                     );
//                   },
//                 )}
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* ================================================================== */}
//       {/* BOARD LIST                                                          */}
//       {/* ================================================================== */}

//       <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mb-5 flex items-end justify-between gap-4">
//           <div>
//             <div className="flex items-center gap-2">
//               <Sparkles className="h-5 w-5 text-blue-400" />

//               <h2 className="text-xl font-black text-white sm:text-2xl">
//                 Quiz Boards
//               </h2>
//             </div>

//             <p className="mt-1 text-sm text-slate-500">
//               Browse competitions and choose the one you want to
//               view.
//             </p>
//           </div>

//           <div className="hidden items-center gap-2 text-xs font-semibold text-slate-600 sm:flex">
//             <ShieldCheck className="h-4 w-4" />
//             Secure competitions
//           </div>
//         </div>

//         {error && !isLoading && (
//           <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />

//               <div className="flex-1">
//                 <p className="text-sm font-bold text-rose-300">
//                   Unable to load Quiz Boards
//                 </p>

//                 <p className="mt-1 text-xs leading-5 text-rose-200/70">
//                   {error}
//                 </p>

//                 {userId && (
//                   <p className="mt-2 break-all font-mono text-[10px] text-rose-200/40">
//                     User ID:{" "}
//                     {userId}
//                   </p>
//                 )}
//               </div>

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() =>
//                   void loadQuizzes(
//                     true,
//                   )
//                 }
//                 disabled={
//                   !userId ||
//                   isRefreshing
//                 }
//                 className="rounded-xl border-rose-400/20 bg-transparent text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
//               >
//                 {isRefreshing ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : null}
//                 Retry
//               </Button>
//             </div>
//           </div>
//         )}

//         {isLoading ? (
//           <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//               <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
//             </div>

//             <h3 className="mt-4 text-lg font-black text-white">
//               Loading Quiz Boards...
//             </h3>

//             <p className="mt-2 text-sm text-slate-500">
//               Fetching the latest competitions.
//             </p>
//           </div>
//         ) : filteredBoards.length ===
//           0 ? (
//           <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
//               {error ? (
//                 <AlertCircle className="h-6 w-6 text-rose-400" />
//               ) : (
//                 <Search className="h-6 w-6 text-slate-500" />
//               )}
//             </div>

//             <h3 className="mt-4 text-lg font-black text-white">
//               {error
//                 ? "Quiz Boards could not be loaded"
//                 : "No Quiz Boards found"}
//             </h3>

//             <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
//               {error
//                 ? "The server did not return the Quiz Board list. Check the API route and try again."
//                 : boards.length === 0
//                   ? "There are currently no Quiz Board competitions available."
//                   : "Try changing your search or filters to find another Quiz Board."}
//             </p>

//             {error && (
//               <Button
//                 type="button"
//                 onClick={() =>
//                   void loadQuizzes(
//                     true,
//                   )
//                 }
//                 disabled={
//                   !userId ||
//                   isRefreshing
//                 }
//                 className="mt-5 gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500"
//               >
//                 {isRefreshing ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <RefreshCw className="h-4 w-4" />
//                 )}
//                 Try Again
//               </Button>
//             )}

//             {!error &&
//               hasActiveFilters && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={
//                     clearFilters
//                   }
//                   className="mt-5 rounded-xl border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white"
//                 >
//                   Clear filters
//                 </Button>
//               )}
//           </div>
//         ) : (
//           <>
//             <div className="grid gap-5 lg:grid-cols-2">
//               {filteredBoards.map(
//                 (board) => {
//                   const playerPercentage =
//                     board.maxPlayers >
//                     0
//                       ? Math.min(
//                           100,
//                           Math.round(
//                             (board.players /
//                               board.maxPlayers) *
//                               100,
//                           ),
//                         )
//                       : 0;

//                   const isLive =
//                     board.status ===
//                     "LIVE";

//                   const isCompleted =
//                     board.status ===
//                     "COMPLETED";

//                   const isFull =
//                     board.status ===
//                       "FULL" ||
//                     (board.maxPlayers >
//                       0 &&
//                       board.players >=
//                         board.maxPlayers);

//                   return (
//                     <article
//                       key={
//                         board.id
//                       }
//                       className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055] hover:shadow-2xl"
//                     >
//                       <div className="border-b border-white/10 p-5 sm:p-6">
//                         <div className="flex items-start justify-between gap-4">
//                           <div className="flex min-w-0 items-center gap-3">
//                             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
//                               {getSubjectIcon(
//                                 board.subject,
//                               )}
//                             </div>

//                             <div className="min-w-0">
//                               <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
//                                 {
//                                   board.examType
//                                 }{" "}
//                                 •{" "}
//                                 {
//                                   board.subject
//                                 }
//                               </p>

//                               <h3 className="mt-1 truncate text-base font-black text-white sm:text-lg">
//                                 {
//                                   board.title
//                                 }
//                               </h3>
//                             </div>
//                           </div>

//                           <span
//                             className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusClasses(
//                               board.status,
//                             )}`}
//                           >
//                             {isLive && (
//                               <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
//                             )}

//                             {getStatusLabel(
//                               board.status,
//                             )}
//                           </span>
//                         </div>

//                         <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-400">
//                           {
//                             board.description
//                           }
//                         </p>

//                         <div className="mt-5 flex flex-wrap gap-2">
//                           <span
//                             className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getDifficultyClasses(
//                               board.difficulty,
//                             )}`}
//                           >
//                             {
//                               board.difficulty
//                             }
//                           </span>

//                           <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-slate-400">
//                             <HelpCircle className="h-3.5 w-3.5" />
//                             {
//                               board.totalQuestions
//                             }{" "}
//                             questions
//                           </span>

//                           <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-semibold text-slate-400">
//                             <Clock3 className="h-3.5 w-3.5" />

//                             {board.durationMinutes >
//                             0
//                               ? `${board.durationMinutes} min`
//                               : `${board.timePerQuestion}s/question`}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="px-5 pt-5 sm:px-6">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <Users className="h-4 w-4 text-blue-400" />

//                             <span className="text-sm font-bold text-slate-300">
//                               {
//                                 board.players
//                               }
//                               /
//                               {
//                                 board.maxPlayers
//                               }
//                             </span>

//                             <span className="text-xs text-slate-600">
//                               joined
//                             </span>
//                           </div>

//                           <span
//                             className={`text-xs font-semibold ${
//                               isFull
//                                 ? "text-orange-400"
//                                 : "text-slate-500"
//                             }`}
//                           >
//                             {isFull
//                               ? "Competition full"
//                               : `${playerPercentage}% full`}
//                           </span>
//                         </div>

//                         <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
//                           <div
//                             className={`h-full rounded-full transition-all ${
//                               isLive
//                                 ? "bg-red-500"
//                                 : isFull
//                                   ? "bg-orange-500"
//                                   : "bg-blue-600"
//                             }`}
//                             style={{
//                               width: `${playerPercentage}%`,
//                             }}
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3 px-5 py-5 sm:px-6">
//                         <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
//                           <div className="flex items-center gap-2">
//                             <Coins className="h-4 w-4 text-amber-400" />

//                             <span className="text-xs font-medium text-slate-500">
//                               Entry
//                             </span>
//                           </div>

//                           <p className="mt-1 text-sm font-black text-white">
//                             {board.entryFee >
//                             0
//                               ? `${board.entryFee} CBT points`
//                               : "FREE"}
//                           </p>
//                         </div>

//                         <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
//                           <div className="flex items-center gap-2">
//                             <Award className="h-4 w-4 text-emerald-400" />

//                             <span className="text-xs font-medium text-slate-500">
//                               1st Prize
//                             </span>
//                           </div>

//                           <p className="mt-1 text-sm font-black text-white">
//                             {board.winnerReward >
//                             0
//                               ? `${board.winnerReward} CBT points`
//                               : "Not set"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="mx-5 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:mx-6">
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
//                             <CalendarDays className="h-4 w-4 text-blue-400" />
//                           </div>

//                           <div className="min-w-0">
//                             <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
//                               {isLive
//                                 ? "Started"
//                                 : isCompleted
//                                   ? "Competition time"
//                                   : "Scheduled"}
//                             </p>

//                             <p className="mt-0.5 truncate text-sm font-bold text-slate-300">
//                               {formatDate(
//                                 board.startsAt,
//                               )}
//                             </p>
//                           </div>

//                           {!isCompleted &&
//                             board.startsAt && (
//                               <span className="ml-auto shrink-0 text-xs font-bold text-blue-400">
//                                 {getRelativeTime(
//                                   board.startsAt,
//                                 )}
//                               </span>
//                             )}
//                         </div>
//                       </div>

//                       <div className="mx-5 mt-3 grid grid-cols-2 gap-3 sm:mx-6">
//                         <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
//                           <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
//                             Rounds
//                           </p>

//                           <p className="mt-1 text-sm font-black text-white">
//                             {
//                               board.numberOfRounds ||
//                               "—"
//                             }
//                           </p>
//                         </div>

//                         <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
//                           <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
//                             2nd Prize
//                           </p>

//                           <p className="mt-1 text-sm font-black text-white">
//                             {board.secondReward >
//                             0
//                               ? `${board.secondReward} pts`
//                               : "Not set"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
//                         <div className="flex items-center gap-2 text-xs text-slate-600">
//                           {isLive ? (
//                             <>
//                               <Radio className="h-4 w-4 text-red-500" />
//                               Live competition
//                             </>
//                           ) : isCompleted ? (
//                             <>
//                               <Trophy className="h-4 w-4 text-slate-600" />
//                               Competition ended
//                             </>
//                           ) : isFull ? (
//                             <>
//                               <Users className="h-4 w-4 text-orange-500" />
//                               Competition full
//                             </>
//                           ) : (
//                             <>
//                               <Layers3 className="h-4 w-4" />
//                               {
//                                 board.numberOfRounds ||
//                                 5
//                               }
//                               -stage elimination
//                             </>
//                           )}
//                         </div>

//                         <Link
//                           href={`/student/quiz-board/${board.id}`}
//                         >
//                           <Button
//                             className={`gap-2 rounded-xl px-4 ${
//                               isLive
//                                 ? "bg-red-600 text-white hover:bg-red-500"
//                                 : "bg-blue-600 text-white hover:bg-blue-500"
//                             }`}
//                           >
//                             {getBoardAction(
//                               board,
//                             )}

//                             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
//                           </Button>
//                         </Link>
//                       </div>

//                       <div className="px-5 pb-5 sm:px-6 sm:pb-6">
//                         <Link
//                           href={`/student/quiz-board/${board.id}/watch`}
//                           className="block w-full"
//                         >
//                           <Button
//                             type="button"
//                             variant="outline"
//                             className={`w-full gap-2 rounded-xl border-white/10 bg-white/[0.02] ${
//                               isLive
//                                 ? "border-red-400/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
//                                 : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
//                             }`}
//                           >
//                             <Eye className="h-4 w-4" />

//                             {isLive
//                               ? "Watch Live"
//                               : isCompleted
//                                 ? "Watch Replay"
//                                 : "Watch"}
//                           </Button>
//                         </Link>
//                       </div>
//                     </article>
//                   );
//                 },
//               )}
//             </div>

//             {/* ============================================================ */}
//             {/* PAGINATION                                                    */}
//             {/* ============================================================ */}

//             {totalPages > 1 && (
//               <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row">
//                 <div className="text-xs font-medium text-slate-500">
//                   Page{" "}
//                   <span className="font-bold text-slate-300">
//                     {page}
//                   </span>{" "}
//                   of{" "}
//                   <span className="font-bold text-slate-300">
//                     {
//                       totalPages
//                     }
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={
//                       goToPreviousPage
//                     }
//                     disabled={
//                       page <= 1 ||
//                       isLoading
//                     }
//                     className="gap-2 rounded-xl border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
//                   >
//                     <ArrowLeft className="h-4 w-4" />
//                     Previous
//                   </Button>

//                   <div className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 text-sm font-black text-blue-300">
//                     {page}
//                   </div>

//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={
//                       goToNextPage
//                     }
//                     disabled={
//                       page >=
//                         totalPages ||
//                       isLoading
//                     }
//                     className="gap-2 rounded-xl border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
//                   >
//                     Next
//                     <ArrowRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </section>

//       {/* ================================================================== */}
//       {/* HOW IT WORKS                                                        */}
//       {/* ================================================================== */}

//       <section className="border-t border-white/10 bg-slate-950">
//         <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//           <div className="mx-auto max-w-2xl text-center">
//             <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//               <Flame className="h-5 w-5 text-blue-400" />
//             </div>

//             <h2 className="mt-4 text-2xl font-black text-white">
//               How Quiz Board works
//             </h2>

//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               Every board starts with up to 20 students and
//               progressively eliminates players until one champion
//               remains.
//             </p>
//           </div>

//           <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
//             {[
//               {
//                 round: "Round 1",
//                 players: "20 → 15",
//                 description:
//                   "First elimination",
//               },
//               {
//                 round: "Round 2",
//                 players: "15 → 10",
//                 description:
//                   "Speed and accuracy",
//               },
//               {
//                 round: "Round 3",
//                 players: "10 → 5",
//                 description:
//                   "Top performers",
//               },
//               {
//                 round: "Round 4",
//                 players: "5 → 2",
//                 description:
//                   "Final qualification",
//               },
//               {
//                 round: "Final",
//                 players: "2 → 1",
//                 description:
//                   "Champion decided",
//               },
//             ].map(
//               (item, index) => (
//                 <div
//                   key={
//                     item.round
//                   }
//                   className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4"
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
//                       {
//                         item.round
//                       }
//                     </span>

//                     <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-black text-blue-400">
//                       {index + 1}
//                     </span>
//                   </div>

//                   <p className="mt-3 text-lg font-black text-white">
//                     {
//                       item.players
//                     }
//                   </p>

//                   <p className="mt-1 text-xs text-slate-500">
//                     {
//                       item.description
//                     }
//                   </p>
//                 </div>
//               ),
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ================================================================== */}
//       {/* FOOTER INFO                                                         */}
//       {/* ================================================================== */}

//       <section className="border-t border-white/10 bg-slate-950">
//         <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//           <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//             <div className="flex items-start gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
//                 <ShieldCheck className="h-5 w-5 text-white" />
//               </div>

//               <div>
//                 <p className="text-sm font-bold text-white">
//                   Fair and competitive
//                 </p>

//                 <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
//                   Quiz Board results are designed to be determined
//                   by answer correctness, response order and
//                   performance. Competition timing and final
//                   qualification will be controlled by the server.
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
//               <GraduationCap className="h-4 w-4" />
//               Learn • Compete • Qualify
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

























