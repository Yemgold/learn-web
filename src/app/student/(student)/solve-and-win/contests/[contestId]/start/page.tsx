
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Play,
  Trophy,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  getMyJoinedContests,
  startSolveAndWinContest,
} from "@/lib/api/solveAndWin";

/* ============================================================
   TYPES
   ============================================================ */

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type ContestSubject = {
  subjectId?: string;
  expectedNoOfQuestions?: number;
  durationInSeconds?: number;
  difficultyBreakdown?: {
    easy?: number;
    medium?: number;
    hard?: number;
  };
};

type Contest = {
  _id?: string;
  title?: string;
  description?: string;
  category?: string;
  amountToBeWonInKobo?: number;
  entryPoints?: number;
  subjects?: ContestSubject[];
  status?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  windowPeriod?: number | string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

type Participation = {
  _id?: string;
  userId?: string;
  contestId?: string;
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
  subjects?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  contest?: Contest;
  [key: string]: unknown;
};

type ContestSchedule = {
  startDate: Date | null;
  endDate: Date | null;
  windowDays: number | null;
};

/* ============================================================
   HELPERS
   ============================================================ */

function getCurrentUserId(): string | null {
  if (typeof window === "undefined") {
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
      const rawValue = localStorage.getItem(key);

      if (
        typeof rawValue !== "string" ||
        rawValue.length === 0
      ) {
        continue;
      }

      /*
       * Some applications store only the user ID:
       *
       * "6a882e27b03aa8c1156b28a2"
       *
       * Others store a JSON object:
       *
       * {
       *   "_id": "...",
       *   "name": "..."
       * }
       */

      try {
        const parsed: unknown = JSON.parse(rawValue);

        if (typeof parsed === "string") {
          if (parsed.length > 0) {
            return parsed;
          }

          continue;
        }

        if (
          parsed !== null &&
          typeof parsed === "object"
        ) {
          const data =
            parsed as Record<string, unknown>;

          const directId: unknown =
            data["_id"] ??
            data["id"] ??
            data["userId"];

          if (
            typeof directId === "string" &&
            directId.length > 0
          ) {
            return directId;
          }

          const nestedUser: unknown =
            data["user"];

          if (
            nestedUser !== null &&
            typeof nestedUser === "object"
          ) {
            const user =
              nestedUser as Record<string, unknown>;

            const nestedId: unknown =
              user["_id"] ??
              user["id"] ??
              user["userId"];

            if (
              typeof nestedId === "string" &&
              nestedId.length > 0
            ) {
              return nestedId;
            }
          }
        }
      } catch {
        /*
         * Not JSON.
         *
         * Treat the raw localStorage value as a
         * possible user ID.
         */
        return rawValue;
      }
    } catch (error) {
      console.error(
        `Failed to read "${key}" from localStorage:`,
        error
      );
    }
  }

  return null;
}

function parseDateValue(
  value: unknown
): Date | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getContestStartDate(
  contest: Contest
): Date | null {
  return parseDateValue(contest.startDate);
}

function getContestWindowDays(
  contest: Contest
): number | null {
  const value = contest.windowPeriod;

  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  ) {
    return Math.floor(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (
      Number.isFinite(parsed) &&
      parsed > 0
    ) {
      return Math.floor(parsed);
    }
  }

  return null;
}

function calculateEndDate(
  startDate: Date,
  windowDays: number
): Date {
  const endDate = new Date(
    startDate.getTime()
  );

  endDate.setDate(
    endDate.getDate() + windowDays
  );

  return endDate;
}

function getCountdown(
  target: Date,
  currentTime: number
): Countdown {
  const difference = Math.max(
    0,
    target.getTime() - currentTime
  );

  const totalSeconds = Math.floor(
    difference / 1000
  );

  const days = Math.floor(
    totalSeconds / (60 * 60 * 24)
  );

  const hours = Math.floor(
    (totalSeconds % (60 * 60 * 24)) /
      (60 * 60)
  );

  const minutes = Math.floor(
    (totalSeconds % (60 * 60)) / 60
  );

  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/* ============================================================
   RESPONSE HELPERS
   ============================================================ */

function extractParticipations(
  response: unknown
): Participation[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response as Participation[];
  }

  if (
    typeof response !== "object" ||
    response === null
  ) {
    return [];
  }

  const root =
    response as Record<string, unknown>;

  if (
    root.data &&
    typeof root.data === "object" &&
    !Array.isArray(root.data)
  ) {
    const data =
      root.data as Record<string, unknown>;

    if (
      Array.isArray(
        data.contestParticipationObj
      )
    ) {
      return data.contestParticipationObj as Participation[];
    }

    if (
      Array.isArray(data.participations)
    ) {
      return data.participations as Participation[];
    }

    if (
      Array.isArray(
        data.contestParticipations
      )
    ) {
      return data.contestParticipations as Participation[];
    }

    if (
      data.participation &&
      typeof data.participation === "object"
    ) {
      return [
        data.participation as Participation,
      ];
    }
  }

  if (
    Array.isArray(
      root.contestParticipationObj
    )
  ) {
    return root.contestParticipationObj as Participation[];
  }

  if (Array.isArray(root.participations)) {
    return root.participations as Participation[];
  }

  if (
    Array.isArray(
      root.contestParticipations
    )
  ) {
    return root.contestParticipations as Participation[];
  }

  if (
    root.participation &&
    typeof root.participation === "object"
  ) {
    return [
      root.participation as Participation,
    ];
  }

  return [];
}

function getContestFromParticipation(
  participation: Participation
): Contest | null {
  const joinedContest =
    participation.contest;

  if (
    joinedContest &&
    typeof joinedContest === "object"
  ) {
    return joinedContest;
  }

  return null;
}

function getContestSubjectId(
  contest: Contest
): string | null {
  if (
    !Array.isArray(contest.subjects) ||
    contest.subjects.length === 0
  ) {
    return null;
  }

  const firstSubject =
    contest.subjects[0];

  if (
    !firstSubject ||
    typeof firstSubject !== "object"
  ) {
    return null;
  }

  const subjectId =
    firstSubject.subjectId;

  /*
   * IMPORTANT:
   *
   * Do not call .trim() until TypeScript has
   * confirmed the value is a string.
   */
  if (typeof subjectId !== "string") {
    return null;
  }

  if (subjectId.length === 0) {
    return null;
  }

  return subjectId;
}

function getApiErrorMessage(
  error: unknown
): string {
  if (
    error &&
    typeof error === "object"
  ) {
    const apiError =
      error as {
        response?: {
          data?: {
            message?: unknown;
            error?: unknown;
          };
        };
        message?: unknown;
      };

    const message =
      apiError.response?.data?.message ??
      apiError.response?.data?.error ??
      apiError.message;

    if (Array.isArray(message)) {
      return message
        .map((item) => String(item))
        .join(", ");
    }

    if (
      typeof message === "string" &&
      message.length > 0
    ) {
      return message;
    }
  }

  return "Unable to continue. Please try again.";
}

/* ============================================================
   PAGE
   ============================================================ */

export default function StartContestPage() {
  const router = useRouter();
  const params = useParams();

  const contestId =
    typeof params?.contestId === "string"
      ? params.contestId
      : undefined;

  const [participation, setParticipation] =
    useState<Participation | null>(null);

  const [contest, setContest] =
    useState<Contest | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isStarting, setIsStarting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [now, setNow] = useState(
    () => Date.now()
  );

  /* ==========================================================
     LOAD JOINED CONTEST
     ========================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadJoinedContest =
      async () => {
        if (!contestId) {
          if (!cancelled) {
            setError(
              "Contest information could not be found."
            );
            setIsLoading(false);
          }

          return;
        }

        const userId =
          getCurrentUserId();

        if (!userId) {
          if (!cancelled) {
            setError(
              "Your account information could not be found. Please sign in again."
            );
            setIsLoading(false);
          }

          return;
        }

        try {
          setIsLoading(true);
          setError(null);

          const response =
            await getMyJoinedContests(userId);

          if (cancelled) {
            return;
          }

          console.log(
            "My joined Solve & Win contests:",
            response
          );

          const participations =
            extractParticipations(response);

          const matchedParticipation =
            participations.find(
              (item) =>
                String(item.contestId) ===
                String(contestId)
            );

          if (!matchedParticipation) {
            setError(
              "You have not joined this contest or your participation could not be found."
            );

            setParticipation(null);
            setContest(null);

            return;
          }

          const joinedContest =
            getContestFromParticipation(
              matchedParticipation
            );

          if (!joinedContest) {
            setError(
              "The contest information could not be found in your participation."
            );

            setParticipation(
              matchedParticipation
            );

            setContest(null);

            return;
          }

          console.log(
            "Joined contest:",
            joinedContest
          );

          console.log(
            "Contest subjects:",
            joinedContest.subjects
          );

          console.log(
            "Contest subject ID:",
            getContestSubjectId(
              joinedContest
            )
          );

          setParticipation(
            matchedParticipation
          );

          setContest(
            joinedContest
          );
        } catch (err: unknown) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to load joined contest:",
            err
          );

          setError(
            getApiErrorMessage(err)
          );
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };

    loadJoinedContest();

    return () => {
      cancelled = true;
    };
  }, [contestId]);

  /* ==========================================================
     LIVE CLOCK
     ========================================================== */

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setNow(Date.now());
      }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  /* ==========================================================
     CONTEST SCHEDULE
     ========================================================== */

  const schedule =
    useMemo<ContestSchedule>(() => {
      if (!contest) {
        return {
          startDate: null,
          endDate: null,
          windowDays: null,
        };
      }

      const startDate =
        getContestStartDate(contest);

      const windowDays =
        getContestWindowDays(contest);

      if (
        !startDate ||
        !windowDays
      ) {
        return {
          startDate,
          endDate: null,
          windowDays,
        };
      }

      const endDate =
        calculateEndDate(
          startDate,
          windowDays
        );

      return {
        startDate,
        endDate,
        windowDays,
      };
    }, [contest]);

  const startDate =
    schedule.startDate;

  const endDate =
    schedule.endDate;

  const windowDays =
    schedule.windowDays;

  const startTimestamp =
    startDate
      ? startDate.getTime()
      : null;

  const endTimestamp =
    endDate
      ? endDate.getTime()
      : null;

  /* ==========================================================
     CONTEST STATE
     ========================================================== */

  const hasStarted =
    startTimestamp !== null &&
    now >= startTimestamp;

  const isWithinWindow =
    startTimestamp !== null &&
    endTimestamp !== null &&
    now >= startTimestamp &&
    now < endTimestamp;

  const hasEnded =
    endTimestamp !== null &&
    now >= endTimestamp;

  const hasNotStarted =
    startTimestamp !== null &&
    now < startTimestamp;

  /*
   * Keep this variable because it describes whether the
   * contest has actually reached its scheduled start.
   */
  void hasStarted;

  /* ==========================================================
     COUNTDOWN
     ========================================================== */

  const countdown = useMemo(() => {
    if (
      startDate &&
      now < startDate.getTime()
    ) {
      return getCountdown(
        startDate,
        now
      );
    }

    if (
      endDate &&
      now < endDate.getTime()
    ) {
      return getCountdown(
        endDate,
        now
      );
    }

    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }, [
    startDate,
    endDate,
    now,
  ]);

  /* ==========================================================
     START CONTEST
     ========================================================== */

  const handleStartContest =
    async () => {
      if (
        isStarting ||
        !contestId ||
        !contest
      ) {
        return;
      }

      const currentTime =
        Date.now();

      /* ------------------------------------------------------
         1. Verify contest schedule
         ------------------------------------------------------ */

      if (
        startTimestamp === null
      ) {
        setError(
          "The contest start time could not be determined."
        );

        return;
      }

      if (
        currentTime <
        startTimestamp
      ) {
        setError(
          "This contest has not started yet. Please wait until the scheduled start time."
        );

        setNow(currentTime);

        return;
      }

      if (
        endTimestamp !== null &&
        currentTime >=
          endTimestamp
      ) {
        setError(
          "This contest window has ended. You can no longer enter this contest."
        );

        setNow(currentTime);

        return;
      }

      /* ------------------------------------------------------
         2. Resolve subject ID
         ------------------------------------------------------ */

      const subjectId =
        getContestSubjectId(
          contest
        );

      if (!subjectId) {
        console.error(
          "Unable to determine contest subject ID.",
          {
            contestId,
            contest,
            participation,
          }
        );

        setError(
          "The subject for this contest could not be determined. Please try again or contact support."
        );

        return;
      }

      /* ------------------------------------------------------
         3. Start contest through backend
         ------------------------------------------------------ */

      try {
        setIsStarting(true);
        setError(null);

        console.log(
          "Starting Solve & Win contest:",
          {
            contestId,
            subjectId,
          }
        );

        /*
         * POST
         *
         * /solve-and-win/contests/
         * start-solve-and-win-contest/
         * {contestId}/{subjectId}
         */
        const response =
          await startSolveAndWinContest(
            contestId,
            subjectId
          );

        console.log(
          "Contest start response:",
          response
        );

        /* ----------------------------------------------------
           4. Save backend response
           ---------------------------------------------------- */

        sessionStorage.setItem(
          `solve-and-win-start-${contestId}`,
          JSON.stringify(response)
        );

        /* ----------------------------------------------------
           5. Navigate only after successful start
           ---------------------------------------------------- */

        router.replace(
          `/student/solve-and-win/contests/${contestId}/play`
        );
      } catch (err: unknown) {
        console.error(
          "Failed to start contest:",
          err
        );

        setError(
          getApiErrorMessage(err)
        );
      } finally {
        setIsStarting(false);
      }
    };

  /* ==========================================================
     BACKGROUND
     ========================================================== */

  const PageBackground = () => (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

      <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
    </div>
  );

  /* ==========================================================
     LOADING
     ========================================================== */

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <PageBackground />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
            </div>

            <h1 className="mt-5 text-xl font-black text-white">
              Preparing Contest
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Checking your contest
              participation and schedule...
            </p>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     CONTEST NOT FOUND
     ========================================================== */

  if (!contest) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <PageBackground />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>

            <h1 className="mt-5 text-xl font-black text-white">
              Contest Unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {error ||
                "This contest could not be found or is no longer available."}
            </p>

            <Link
              href="/student/solve-and-win/my-contests"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Contests
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     NO START DATE
     ========================================================== */

  if (!startDate) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <PageBackground />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
              <Clock3 className="h-7 w-7 text-amber-400" />
            </div>

            <h1 className="mt-5 text-xl font-black text-white">
              Contest Schedule Unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              We could not determine when this
              contest is scheduled to start.
              Please try again later.
            </p>

            <Link
              href="/student/solve-and-win/my-contests"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Contests
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     NO WINDOW PERIOD
     ========================================================== */

  if (!windowDays || !endDate) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <PageBackground />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
              <CalendarDays className="h-7 w-7 text-amber-400" />
            </div>

            <h1 className="mt-5 text-xl font-black text-white">
              Contest Window Unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              The contest start date was
              found, but the participation
              window could not be determined.
              Please try again later.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Start Date
              </p>

              <p className="mt-1 font-bold text-white">
                {formatDateTime(startDate)}
              </p>
            </div>

            <Link
              href="/student/solve-and-win/my-contests"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Contests
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     MAIN PAGE
     ========================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <PageBackground />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

        {/* BACK */}

        <Link
          href="/student/solve-and-win/my-contests"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Contests
        </Link>

        {/* STATUS HEADER */}

        <div className="mb-8">
          {hasNotStarted && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300">
              <Clock3 className="h-3.5 w-3.5" />
              Contest Starts Soon
            </div>
          )}

          {isWithinWindow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Contest is Live
            </div>
          )}

          {hasEnded && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300">
              <XCircle className="h-3.5 w-3.5" />
              Contest Ended
            </div>
          )}

          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {hasNotStarted &&
              "Get Ready"}

            {isWithinWindow &&
              "Contest is Live"}

            {hasEnded &&
              "Contest Has Ended"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            {hasNotStarted &&
              "The contest has not started yet. You will be able to enter when the scheduled start time arrives."}

            {isWithinWindow &&
              "The contest has started and the participation window is still open. You can enter now."}

            {hasEnded &&
              "The participation window for this contest has ended. This contest can no longer be entered."}
          </p>
        </div>

        {/* CONTEST CARD */}

        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-sm">

          {/* CONTEST HEADER */}

          <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.20),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_45%)]" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
                <Trophy className="h-7 w-7 text-purple-300" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-300/80">
                  Solve & Win Contest
                </p>

                <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                  {contest.title ||
                    "Solve & Win Contest"}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {contest.description ||
                    "Compete against other students and answer the contest questions to win rewards."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">

            {/* BEFORE START */}

            {hasNotStarted && (
              <div className="rounded-3xl border border-blue-400/20 bg-blue-500/[0.06] p-6">
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
                    <Clock3 className="h-6 w-6 text-blue-400" />
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-widest text-blue-400">
                    Contest Starts In
                  </p>

                  <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
                    {[
                      {
                        value: countdown.days,
                        label: "Days",
                      },
                      {
                        value: countdown.hours,
                        label: "Hours",
                      },
                      {
                        value: countdown.minutes,
                        label: "Minutes",
                      },
                      {
                        value: countdown.seconds,
                        label: "Seconds",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4"
                      >
                        <p className="text-2xl font-black text-white sm:text-3xl">
                          {pad(item.value)}
                        </p>

                        <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 text-sm text-slate-400">
                    Starts{" "}
                    <span className="font-bold text-slate-200">
                      {formatDateTime(startDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* LIVE CONTEST */}

            {isWithinWindow && (
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.06] p-6">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10">
                    <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-widest text-emerald-400">
                    Contest is Live
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    You can enter now!
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                    The scheduled start time has
                    passed, but the contest window is
                    still open.
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Time Remaining
                    </p>

                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {[
                        {
                          value: countdown.days,
                          label: "Days",
                        },
                        {
                          value: countdown.hours,
                          label: "Hours",
                        },
                        {
                          value: countdown.minutes,
                          label: "Minutes",
                        },
                        {
                          value: countdown.seconds,
                          label: "Seconds",
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-xl font-black text-white">
                            {pad(item.value)}
                          </p>

                          <p className="text-[10px] font-bold uppercase text-slate-500">
                            {item.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      Window closes{" "}
                      <span className="font-bold text-slate-300">
                        {formatDateTime(endDate)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ENDED */}

            {hasEnded && (
              <div className="rounded-3xl border border-red-400/20 bg-red-500/[0.06] p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10">
                  <XCircle className="h-7 w-7 text-red-400" />
                </div>

                <p className="mt-4 text-xs font-black uppercase tracking-widest text-red-400">
                  Contest Ended
                </p>

                <h3 className="mt-2 text-2xl font-black text-white">
                  Participation window closed
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                  This contest started on{" "}
                  <span className="font-bold text-slate-200">
                    {formatDateTime(startDate)}
                  </span>{" "}
                  and the participation window ended
                  on{" "}
                  <span className="font-bold text-slate-200">
                    {formatDateTime(endDate)}
                  </span>
                  .
                </p>
              </div>
            )}

            {/* CONTEST INFORMATION */}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                  <CalendarDays className="h-5 w-5 text-blue-400" />
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Starts
                </p>

                <p className="mt-1 text-sm font-bold text-slate-200">
                  {formatDateTime(startDate)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
                  <Clock3 className="h-5 w-5 text-purple-400" />
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Window Period
                </p>

                <p className="mt-1 text-sm font-bold text-slate-200">
                  {windowDays}{" "}
                  {windowDays === 1
                    ? "Day"
                    : "Days"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10">
                  <CalendarDays className="h-5 w-5 text-red-400" />
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Window Ends
                </p>

                <p className="mt-1 text-sm font-bold text-slate-200">
                  {formatDateTime(endDate)}
                </p>
              </div>

            </div>

            {/* WINDOW SUMMARY */}

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                <div>
                  <p className="text-sm font-bold text-white">
                    Contest Participation Window
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Students can enter this contest
                    from{" "}
                    <span className="font-bold text-slate-200">
                      {formatDateTime(startDate)}
                    </span>{" "}
                    until{" "}
                    <span className="font-bold text-slate-200">
                      {formatDateTime(endDate)}
                    </span>
                    .
                  </p>

                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    Window period:{" "}
                    {windowDays}{" "}
                    {windowDays === 1
                      ? "day"
                      : "days"}
                  </p>
                </div>
              </div>
            </div>

            {/* PARTICIPATION INFO */}

            {participation && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start gap-3">
                  <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">
                      Your Contest Entry
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      You have already joined this
                      contest. Your entry has been
                      reserved and is ready when the
                      contest window is open.
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-300">
                        {participation.pointsSpent ??
                          contest.entryPoints ??
                          0}{" "}
                        Practice Points
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-300">
                        {contest.subjects?.[0]
                          ?.expectedNoOfQuestions ??
                          0}{" "}
                        Questions
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-300">
                        {Math.floor(
                          (contest
                            .subjects?.[0]
                            ?.durationInSeconds ??
                            0) / 60
                        )}{" "}
                        Minutes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTICE */}

            <div
              className={`mt-6 flex gap-3 rounded-2xl border p-4 ${
                isWithinWindow
                  ? "border-emerald-400/20 bg-emerald-500/[0.06]"
                  : hasEnded
                  ? "border-red-400/20 bg-red-500/[0.06]"
                  : "border-amber-400/20 bg-amber-500/[0.06]"
              }`}
            >
              {isWithinWindow && (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              )}

              {hasNotStarted && (
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              )}

              {hasEnded && (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              )}

              <div>
                <p
                  className={`text-sm font-bold ${
                    isWithinWindow
                      ? "text-emerald-300"
                      : hasEnded
                      ? "text-red-300"
                      : "text-amber-300"
                  }`}
                >
                  {isWithinWindow &&
                    "Your contest is ready"}

                  {hasNotStarted &&
                    "Please wait for the start time"}

                  {hasEnded &&
                    "This contest is no longer available"}
                </p>

                <p
                  className={`mt-1 text-sm leading-6 ${
                    isWithinWindow
                      ? "text-emerald-400/80"
                      : hasEnded
                      ? "text-red-400/80"
                      : "text-amber-400/80"
                  }`}
                >
                  {isWithinWindow &&
                    "The start date has passed, but the participation window is still open. You can enter the contest now."}

                  {hasNotStarted &&
                    "The Start Contest button will become available when the scheduled start time arrives."}

                  {hasEnded &&
                    "The participation window has expired. You can no longer enter this contest."}
                </p>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                <div>
                  <p className="text-sm font-bold text-red-300">
                    Unable to continue
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-400/80">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* ACTIONS */}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

              <Link
                href="/student/solve-and-win/my-contests"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Contests
              </Link>

              <Button
                type="button"
                onClick={handleStartContest}
                disabled={
                  !isWithinWindow ||
                  isStarting
                }
                aria-disabled={
                  !isWithinWindow ||
                  isStarting
                }
                className={`h-12 rounded-xl px-7 font-bold transition ${
                  isWithinWindow
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                    : "cursor-not-allowed border border-white/10 bg-white/[0.04] text-slate-600 hover:bg-white/[0.04]"
                }`}
              >
                {isStarting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : isWithinWindow ? (
                  <>
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    Start Contest
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : hasEnded ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Contest Ended
                  </>
                ) : (
                  <>
                    <Clock3 className="mr-2 h-4 w-4" />
                    Contest Not Started
                  </>
                )}
              </Button>

            </div>
          </div>
        </Card>

        {/* FOOTER */}

        <div className="mt-5 text-center">
          <p className="text-xs text-slate-600">
            Contest ID:{" "}
            <span className="font-mono font-bold text-slate-500">
              {contestId}
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}













// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { axiosInstance } from "@/lib/api/axios";
// import {
//   ArrowLeft,
//   ArrowRight,
//   AlertCircle,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   Loader2,
//   Play,
//   Trophy,
//   XCircle,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// import {
//   getAllNotCompletedContests,
//   type SolveAndWinContest,
// } from "@/lib/api/solveAndWin";

// /* ============================================================
//    TYPES
//    ============================================================ */

// type Countdown = {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// };

// type ContestSchedule = {
//   startDate: Date | null;
//   endDate: Date | null;
//   windowDays: number | null;
// };

// /* ============================================================
//    HELPERS
//    ============================================================ */

// function parseDateValue(value: unknown): Date | null {
//   if (!value) return null;

//   const date = new Date(String(value));

//   if (Number.isNaN(date.getTime())) {
//     return null;
//   }

//   return date;
// }

// function parseDateAndTime(
//   dateValue: unknown,
//   timeValue: unknown
// ): Date | null {
//   if (!dateValue || !timeValue) {
//     return null;
//   }

//   const combined = `${String(dateValue)}T${String(timeValue)}`;

//   return parseDateValue(combined);
// }

// /**
//  * Gets the scheduled contest START date.
//  *
//  * Priority:
//  * 1. Explicit scheduled datetime
//  * 2. Scheduled date + scheduled time
//  * 3. Generic startDate fallback
//  */
// function getContestStartDate(
//   contest: SolveAndWinContest
// ): Date | null {
//   const data = contest as unknown as Record<string, unknown>;

//   const scheduledDateTimeCandidates = [
//     data.scheduledStartAt,
//     data.scheduledStartDateTime,
//     data.scheduledStart,
//     data.startAt,
//     data.startsAt,
//     data.startDateTime,
//   ];

//   for (const value of scheduledDateTimeCandidates) {
//     const parsed = parseDateValue(value);

//     if (parsed) {
//       return parsed;
//     }
//   }

//   const scheduledDate =
//     data.scheduledDate ??
//     data.scheduledStartDate ??
//     data.contestDate;

//   const scheduledTime =
//     data.scheduledTime ??
//     data.scheduledStartTime ??
//     data.startTime;

//   const scheduledDateTime = parseDateAndTime(
//     scheduledDate,
//     scheduledTime
//   );

//   if (scheduledDateTime) {
//     return scheduledDateTime;
//   }

//   const fallbackStartDate = parseDateValue(data.startDate);

//   if (fallbackStartDate) {
//     return fallbackStartDate;
//   }

//   return null;
// }

// /**
//  * Gets the contest window period in DAYS.
//  */
// function getContestWindowDays(
//   contest: SolveAndWinContest
// ): number | null {
//   const data = contest as unknown as Record<string, unknown>;

//   const candidates = [
//     data.windowPeriod,
//     data.windowDays,
//     data.durationDays,
//     data.contestDurationDays,
//     data.participationWindowDays,
//     data.registrationWindowDays,
//     data.duration,
//   ];

//   for (const value of candidates) {
//     if (
//       typeof value === "number" &&
//       Number.isFinite(value) &&
//       value > 0
//     ) {
//       return Math.floor(value);
//     }

//     if (
//       typeof value === "string" &&
//       value.trim() !== ""
//     ) {
//       const parsed = Number(value);

//       if (
//         Number.isFinite(parsed) &&
//         parsed > 0
//       ) {
//         return Math.floor(parsed);
//       }
//     }

//     if (
//       typeof value === "object" &&
//       value !== null
//     ) {
//       const objectValue =
//         value as Record<string, unknown>;

//       const nestedDays =
//         objectValue.days ??
//         objectValue.durationDays ??
//         objectValue.value;

//       const parsed = Number(nestedDays);

//       if (
//         Number.isFinite(parsed) &&
//         parsed > 0
//       ) {
//         return Math.floor(parsed);
//       }
//     }
//   }

//   return null;
// }

// function getContestSubjectId(
//   contest: SolveAndWinContest
// ): string | null {
//   const data =
//     contest as unknown as Record<string, unknown>;

//   const findId = (
//     value: unknown
//   ): string | null => {
//     if (
//       typeof value === "string" &&
//       value.trim()
//     ) {
//       return value;
//     }

//     if (
//       typeof value !== "object" ||
//       value === null
//     ) {
//       return null;
//     }

//     const objectValue =
//       value as Record<string, unknown>;

//     const directIdFields = [
//       objectValue.subjectId,
//       objectValue._id,
//       objectValue.id,
//       objectValue.subjectID,
//       objectValue.subject_id,
//     ];

//     for (const candidate of directIdFields) {
//       const found = findId(candidate);

//       if (found) {
//         return found;
//       }
//     }

//     if (
//       objectValue.subject !== undefined
//     ) {
//       const found = findId(
//         objectValue.subject
//       );

//       if (found) {
//         return found;
//       }
//     }

//     if (
//       objectValue.data !== undefined
//     ) {
//       const found = findId(
//         objectValue.data
//       );

//       if (found) {
//         return found;
//       }
//     }

//     if (
//       objectValue.value !== undefined
//     ) {
//       const found = findId(
//         objectValue.value
//       );

//       if (found) {
//         return found;
//       }
//     }

//     return null;
//   };

//   const directSubjectId =
//     findId(data.subjectId) ??
//     findId(data.selectedSubjectId);

//   if (directSubjectId) {
//     return directSubjectId;
//   }

//   if (data.subject !== undefined) {
//     const subjectId =
//       findId(data.subject);

//     if (subjectId) {
//       return subjectId;
//     }
//   }

//   if (Array.isArray(data.subjects)) {
//     for (const subject of data.subjects) {
//       const subjectId =
//         findId(subject);

//       if (subjectId) {
//         return subjectId;
//       }
//     }
//   }

//   return null;
// }

// /**
//  * Calculates the END of the contest window.
//  */
// function calculateEndDate(
//   startDate: Date,
//   windowDays: number
// ): Date {
//   const endDate = new Date(
//     startDate.getTime()
//   );

//   endDate.setDate(
//     endDate.getDate() + windowDays
//   );

//   return endDate;
// }

// function getCountdown(
//   target: Date,
//   currentTime: number
// ): Countdown {
//   const difference = Math.max(
//     0,
//     target.getTime() - currentTime
//   );

//   const totalSeconds = Math.floor(
//     difference / 1000
//   );

//   const days = Math.floor(
//     totalSeconds / (60 * 60 * 24)
//   );

//   const hours = Math.floor(
//     (totalSeconds % (60 * 60 * 24)) /
//       (60 * 60)
//   );

//   const minutes = Math.floor(
//     (totalSeconds % (60 * 60)) / 60
//   );

//   const seconds = totalSeconds % 60;

//   return {
//     days,
//     hours,
//     minutes,
//     seconds,
//   };
// }

// function pad(value: number) {
//   return String(value).padStart(2, "0");
// }

// function formatDateTime(date: Date) {
//   return date.toLocaleString("en-NG", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function StartContestPage() {
//   const router = useRouter();
//   const params = useParams();

//   const contestId = params?.contestId as
//     | string
//     | undefined;

//   const [contest, setContest] =
//     useState<SolveAndWinContest | null>(null);

//   const [isLoading, setIsLoading] =
//     useState(true);

//   const [isStarting, setIsStarting] =
//     useState(false);

//   const [error, setError] =
//     useState<string | null>(null);

//   const [now, setNow] = useState(
//     () => Date.now()
//   );

//   /* ==========================================================
//      LOAD CONTEST
//      ========================================================== */

//   useEffect(() => {
//     const loadContest = async () => {
//       if (!contestId) {
//         setError(
//           "Contest information could not be found."
//         );

//         setIsLoading(false);

//         return;
//       }

//       try {
//         setIsLoading(true);
//         setError(null);

//         const response =
//           await getAllNotCompletedContests();

//         if (!response.success) {
//           throw new Error(
//             response.message ||
//               "Unable to load contest information."
//           );
//         }

//         const contests: SolveAndWinContest[] =
//   response.data?.solveAndWinContestObj ?? [];

//         const foundContest = contests.find(
//           (item) =>
//             item._id === contestId
//         );

//         if (!foundContest) {
//           setError(
//             "This contest could not be found or is no longer available."
//           );

//           return;
//         }

//         console.log(
//           "Solve & Win contest data:",
//           foundContest
//         );

//         const raw =
//           foundContest as unknown as Record<
//             string,
//             unknown
//           >;

//         console.log(
//           "Contest schedule fields:",
//           {
//             scheduledStartAt:
//               raw.scheduledStartAt,

//             scheduledStartDateTime:
//               raw.scheduledStartDateTime,

//             scheduledStart:
//               raw.scheduledStart,

//             startAt: raw.startAt,

//             startsAt: raw.startsAt,

//             startDateTime:
//               raw.startDateTime,

//             scheduledDate:
//               raw.scheduledDate,

//             scheduledTime:
//               raw.scheduledTime,

//             scheduledStartDate:
//               raw.scheduledStartDate,

//             scheduledStartTime:
//               raw.scheduledStartTime,

//             startDate: raw.startDate,

//             startTime: raw.startTime,

//             windowPeriod:
//               raw.windowPeriod,

//             windowDays:
//               raw.windowDays,

//             durationDays:
//               raw.durationDays,

//             contestDurationDays:
//               raw.contestDurationDays,
//           }
//         );

//         setContest(foundContest);
//       } catch (err: unknown) {
//         console.error(
//           "Failed to load contest:",
//           err
//         );

//         const apiError = err as {
//           response?: {
//             data?: {
//               message?: unknown;
//               error?: unknown;
//             };
//           };
//           message?: unknown;
//         };

//         const message =
//           apiError?.response?.data
//             ?.message ||
//           apiError?.response?.data?.error ||
//           apiError?.message ||
//           "Unable to load contest information. Please try again.";

//         setError(
//           Array.isArray(message)
//             ? message.join(", ")
//             : String(message)
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadContest();
//   }, [contestId]);

//   /* ==========================================================
//      LIVE CLOCK
//      ========================================================== */

//   useEffect(() => {
//     const timer = window.setInterval(() => {
//       setNow(Date.now());
//     }, 1000);

//     return () => {
//       window.clearInterval(timer);
//     };
//   }, []);

//   /* ==========================================================
//      CONTEST SCHEDULE
//      ========================================================== */

//   const schedule =
//     useMemo<ContestSchedule>(() => {
//       if (!contest) {
//         return {
//           startDate: null,
//           endDate: null,
//           windowDays: null,
//         };
//       }

//       const startDate =
//         getContestStartDate(contest);

//       const windowDays =
//         getContestWindowDays(contest);

//       if (!startDate || !windowDays) {
//         return {
//           startDate,
//           endDate: null,
//           windowDays,
//         };
//       }

//       const endDate = calculateEndDate(
//         startDate,
//         windowDays
//       );

//       return {
//         startDate,
//         endDate,
//         windowDays,
//       };
//     }, [contest]);

//   const startDate = schedule.startDate;
//   const endDate = schedule.endDate;
//   const windowDays = schedule.windowDays;

//   const startTimestamp = startDate
//     ? startDate.getTime()
//     : null;

//   const endTimestamp = endDate
//     ? endDate.getTime()
//     : null;

//   /* ==========================================================
//      CONTEST STATE
//      ========================================================== */

//   const hasStarted =
//     startTimestamp !== null &&
//     now >= startTimestamp;

//   const isWithinWindow =
//     startTimestamp !== null &&
//     endTimestamp !== null &&
//     now >= startTimestamp &&
//     now < endTimestamp;

//   const hasEnded =
//     endTimestamp !== null &&
//     now >= endTimestamp;

//   const hasNotStarted =
//     startTimestamp !== null &&
//     now < startTimestamp;

//   /* ==========================================================
//      COUNTDOWN
//      ========================================================== */

//   const countdown = useMemo(() => {
//     if (
//       startDate &&
//       now < startDate.getTime()
//     ) {
//       return getCountdown(
//         startDate,
//         now
//       );
//     }

//     if (
//       endDate &&
//       now < endDate.getTime()
//     ) {
//       return getCountdown(
//         endDate,
//         now
//       );
//     }

//     return {
//       days: 0,
//       hours: 0,
//       minutes: 0,
//       seconds: 0,
//     };
//   }, [
//     startDate,
//     endDate,
//     now,
//   ]);

//   /* ==========================================================
//      START CONTEST
//      ========================================================== */

//   const handleStartContest = async () => {
//     if (
//       isStarting ||
//       !contestId ||
//       !contest
//     ) {
//       return;
//     }

//     const currentTime = Date.now();

//     /* --------------------------------------------------------
//        1. Verify contest schedule
//        -------------------------------------------------------- */

//     if (startTimestamp === null) {
//       setError(
//         "The contest start time could not be determined."
//       );

//       return;
//     }

//     if (currentTime < startTimestamp) {
//       setError(
//         "This contest has not started yet. Please wait until the scheduled start time."
//       );

//       setNow(currentTime);

//       return;
//     }

//     if (
//       endTimestamp !== null &&
//       currentTime >= endTimestamp
//     ) {
//       setError(
//         "This contest window has ended. You can no longer enter this contest."
//       );

//       setNow(currentTime);

//       return;
//     }

//     /* --------------------------------------------------------
//        2. Resolve subject ID
//        -------------------------------------------------------- */

//     const subjectId =
//       getContestSubjectId(contest);

//     if (!subjectId) {
//       console.error(
//         "Unable to determine contest subject ID.",
//         contest
//       );

//       setError(
//         "The subject for this contest could not be determined. Please try again or contact support."
//       );

//       return;
//     }

//     /* --------------------------------------------------------
//        3. Start contest through backend
//        -------------------------------------------------------- */

//     try {
//       setIsStarting(true);
//       setError(null);

//       console.log(
//         "Starting Solve & Win contest:",
//         {
//           contestId,
//           subjectId,
//         }
//       );

//       const response =
//         await axiosInstance.get(
//           `/solve-and-win/contests/start-solve-and-win-contest/${contestId}/${subjectId}`
//         );

//       console.log(
//         "Contest start response:",
//         response.data
//       );

//       sessionStorage.setItem(
//         `solve-and-win-start-${contestId}`,
//         JSON.stringify(response.data)
//       );

//       /* ------------------------------------------------------
//          4. Navigate only after successful API call
//          ------------------------------------------------------ */

//       router.replace(
//         `/student/solve-and-win/contests/${contestId}/play`
//       );
//     } catch (err: unknown) {
//       console.error(
//         "Failed to start contest:",
//         err
//       );

//       const apiError = err as {
//         response?: {
//           data?: {
//             message?: unknown;
//             error?: unknown;
//           };
//         };
//         message?: unknown;
//       };

//       const message =
//         apiError?.response?.data?.message ||
//         apiError?.response?.data?.error ||
//         apiError?.message ||
//         "Unable to start the contest. Please try again.";

//       setError(
//         Array.isArray(message)
//           ? message.join(", ")
//           : String(message)
//       );
//     } finally {
//       setIsStarting(false);
//     }
//   };

//   /* ==========================================================
//      REUSABLE BACKGROUND
//      ========================================================== */

//   const PageBackground = () => (
//     <div className="pointer-events-none fixed inset-0 overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />

//       <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />

//       <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
//     </div>
//   );

//   /* ==========================================================
//      LOADING
//      ========================================================== */

//   if (isLoading) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         <PageBackground />

//         <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
//           <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//               <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
//             </div>

//             <h1 className="mt-5 text-xl font-black text-white">
//               Preparing Contest
//             </h1>

//             <p className="mt-2 text-sm text-slate-400">
//               Checking the contest schedule...
//             </p>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      CONTEST NOT FOUND
//      ========================================================== */

//   if (!contest) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         <PageBackground />

//         <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
//               <AlertCircle className="h-7 w-7 text-red-400" />
//             </div>

//             <h1 className="mt-5 text-xl font-black text-white">
//               Contest Unavailable
//             </h1>

//             <p className="mt-2 text-sm leading-6 text-slate-400">
//               {error ||
//                 "This contest could not be found or is no longer available."}
//             </p>

//             <Link
//               href="/student/solve-and-win"
//               className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Contests
//             </Link>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      NO START DATE
//      ========================================================== */

//   if (!startDate) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         <PageBackground />

//         <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
//               <Clock3 className="h-7 w-7 text-amber-400" />
//             </div>

//             <h1 className="mt-5 text-xl font-black text-white">
//               Contest Schedule Unavailable
//             </h1>

//             <p className="mt-2 text-sm leading-6 text-slate-400">
//               We could not determine when this
//               contest is scheduled to start.
//               Please try again later.
//             </p>

//             <Link
//               href="/student/solve-and-win"
//               className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Contests
//             </Link>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      NO WINDOW PERIOD
//      ========================================================== */

//   if (!windowDays || !endDate) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         <PageBackground />

//         <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
//               <CalendarDays className="h-7 w-7 text-amber-400" />
//             </div>

//             <h1 className="mt-5 text-xl font-black text-white">
//               Contest Window Unavailable
//             </h1>

//             <p className="mt-2 text-sm leading-6 text-slate-400">
//               The contest start date was found,
//               but the participation window could
//               not be determined.
//             </p>

//             <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
//               <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
//                 Start Date
//               </p>

//               <p className="mt-1 font-bold text-white">
//                 {formatDateTime(startDate)}
//               </p>
//             </div>

//             <Link
//               href="/student/solve-and-win"
//               className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Contests
//             </Link>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      MAIN PAGE
//      ========================================================== */

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//       <PageBackground />

//       <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

//         {/* =====================================================
//             BACK
//            ===================================================== */}

//         <Link
//           href="/student/solve-and-win"
//           className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Contests
//         </Link>

//         {/* =====================================================
//             STATUS HEADER
//            ===================================================== */}

//         <div className="mb-8">

//           {hasNotStarted && (
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300">
//               <Clock3 className="h-3.5 w-3.5" />
//               Contest Starts Soon
//             </div>
//           )}

//           {isWithinWindow && (
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
//               <CheckCircle2 className="h-3.5 w-3.5" />
//               Contest is Live
//             </div>
//           )}

//           {hasEnded && (
//             <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300">
//               <XCircle className="h-3.5 w-3.5" />
//               Contest Ended
//             </div>
//           )}

//           <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
//             {hasNotStarted &&
//               "Get Ready"}

//             {isWithinWindow &&
//               "Contest is Live"}

//             {hasEnded &&
//               "Contest Has Ended"}
//           </h1>

//           <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
//             {hasNotStarted &&
//               "The contest has not started yet. You will be able to enter when the scheduled start time arrives."}

//             {isWithinWindow &&
//               "The contest has started and the participation window is still open. You can enter now."}

//             {hasEnded &&
//               "The participation window for this contest has ended. This contest can no longer be entered."}
//           </p>
//         </div>

//         {/* =====================================================
//             CONTEST CARD
//            ===================================================== */}

//         <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-sm">

//           {/* Contest Header */}

//           <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8">

//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.20),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_45%)]" />

//             <div className="relative flex items-start gap-4">

//               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
//                 <Trophy className="h-7 w-7 text-purple-300" />
//               </div>

//               <div className="min-w-0">

//                 <p className="text-xs font-bold uppercase tracking-wider text-purple-300/80">
//                   Solve & Win Contest
//                 </p>

//                 <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
//                   {contest.title}
//                 </h2>

//                 <p className="mt-1 text-sm leading-6 text-slate-400">
//                   {contest.description ||
//                     "Compete against other students and answer the contest questions to win rewards."}
//                 </p>

//               </div>

//             </div>
//           </div>

//           <div className="p-6 sm:p-8">

//             {/* =================================================
//                 BEFORE START
//                ================================================= */}

//             {hasNotStarted && (
//               <div className="rounded-3xl border border-blue-400/20 bg-blue-500/[0.06] p-6">

//                 <div className="text-center">

//                   <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//                     <Clock3 className="h-6 w-6 text-blue-400" />
//                   </div>

//                   <p className="mt-4 text-xs font-black uppercase tracking-widest text-blue-400">
//                     Contest Starts In
//                   </p>

//                   <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">

//                     {[
//                       {
//                         value: countdown.days,
//                         label: "Days",
//                       },
//                       {
//                         value: countdown.hours,
//                         label: "Hours",
//                       },
//                       {
//                         value: countdown.minutes,
//                         label: "Minutes",
//                       },
//                       {
//                         value: countdown.seconds,
//                         label: "Seconds",
//                       },
//                     ].map((item) => (
//                       <div
//                         key={item.label}
//                         className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:p-4"
//                       >
//                         <p className="text-2xl font-black text-white sm:text-3xl">
//                           {pad(item.value)}
//                         </p>

//                         <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
//                           {item.label}
//                         </p>
//                       </div>
//                     ))}

//                   </div>

//                   <div className="mt-5 text-sm text-slate-400">
//                     Starts{" "}
//                     <span className="font-bold text-slate-200">
//                       {formatDateTime(startDate)}
//                     </span>
//                   </div>

//                 </div>
//               </div>
//             )}

//             {/* =================================================
//                 LIVE CONTEST
//                ================================================= */}

//             {isWithinWindow && (
//               <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.06] p-6">

//                 <div className="text-center">

//                   <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10">
//                     <CheckCircle2 className="h-7 w-7 text-emerald-400" />
//                   </div>

//                   <p className="mt-4 text-xs font-black uppercase tracking-widest text-emerald-400">
//                     Contest is Live
//                   </p>

//                   <h3 className="mt-2 text-2xl font-black text-white">
//                     You can enter now!
//                   </h3>

//                   <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
//                     The scheduled start time has
//                     passed, but the contest window is
//                     still open.
//                   </p>

//                   {/* Remaining Window */}

//                   <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

//                     <p className="text-xs font-black uppercase tracking-widest text-slate-500">
//                       Time Remaining
//                     </p>

//                     <div className="mt-3 grid grid-cols-4 gap-2">

//                       {[
//                         {
//                           value: countdown.days,
//                           label: "Days",
//                         },
//                         {
//                           value: countdown.hours,
//                           label: "Hours",
//                         },
//                         {
//                           value: countdown.minutes,
//                           label: "Minutes",
//                         },
//                         {
//                           value: countdown.seconds,
//                           label: "Seconds",
//                         },
//                       ].map((item) => (
//                         <div key={item.label}>
//                           <p className="text-xl font-black text-white">
//                             {pad(item.value)}
//                           </p>

//                           <p className="text-[10px] font-bold uppercase text-slate-500">
//                             {item.label}
//                           </p>
//                         </div>
//                       ))}

//                     </div>

//                     <p className="mt-4 text-xs text-slate-500">
//                       Window closes{" "}
//                       <span className="font-bold text-slate-300">
//                         {formatDateTime(endDate)}
//                       </span>
//                     </p>

//                   </div>

//                 </div>
//               </div>
//             )}

//             {/* =================================================
//                 ENDED
//                ================================================= */}

//             {hasEnded && (
//               <div className="rounded-3xl border border-red-400/20 bg-red-500/[0.06] p-6 text-center">

//                 <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10">
//                   <XCircle className="h-7 w-7 text-red-400" />
//                 </div>

//                 <p className="mt-4 text-xs font-black uppercase tracking-widest text-red-400">
//                   Contest Ended
//                 </p>

//                 <h3 className="mt-2 text-2xl font-black text-white">
//                   Participation window closed
//                 </h3>

//                 <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
//                   This contest started on{" "}
//                   <span className="font-bold text-slate-200">
//                     {formatDateTime(startDate)}
//                   </span>{" "}
//                   and the participation window ended
//                   on{" "}
//                   <span className="font-bold text-slate-200">
//                     {formatDateTime(endDate)}
//                   </span>
//                   .
//                 </p>

//               </div>
//             )}

//             {/* =================================================
//                 CONTEST INFORMATION
//                ================================================= */}

//             <div className="mt-6 grid gap-4 sm:grid-cols-3">

//               {/* Start */}

//               <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]">

//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
//                   <CalendarDays className="h-5 w-5 text-blue-400" />
//                 </div>

//                 <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
//                   Starts
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-slate-200">
//                   {formatDateTime(startDate)}
//                 </p>

//               </div>

//               {/* Window */}

//               <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]">

//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
//                   <Clock3 className="h-5 w-5 text-purple-400" />
//                 </div>

//                 <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
//                   Window Period
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-slate-200">
//                   {windowDays}{" "}
//                   {windowDays === 1
//                     ? "Day"
//                     : "Days"}
//                 </p>

//               </div>

//               {/* Ends */}

//               <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]">

//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10">
//                   <CalendarDays className="h-5 w-5 text-red-400" />
//                 </div>

//                 <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
//                   Window Ends
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-slate-200">
//                   {formatDateTime(endDate)}
//                 </p>

//               </div>

//             </div>

//             {/* =================================================
//                 WINDOW SUMMARY
//                ================================================= */}

//             <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

//               <div className="flex items-start gap-3">

//                 <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

//                 <div>

//                   <p className="text-sm font-bold text-white">
//                     Contest Participation Window
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-slate-400">
//                     Students can enter this contest
//                     from{" "}
//                     <span className="font-bold text-slate-200">
//                       {formatDateTime(startDate)}
//                     </span>{" "}
//                     until{" "}
//                     <span className="font-bold text-slate-200">
//                       {formatDateTime(endDate)}
//                     </span>
//                     .
//                   </p>

//                   <p className="mt-2 text-xs font-semibold text-slate-500">
//                     Window period:{" "}
//                     {windowDays}{" "}
//                     {windowDays === 1
//                       ? "day"
//                       : "days"}
//                   </p>

//                 </div>

//               </div>

//             </div>

//             {/* =================================================
//                 NOTICE
//                ================================================= */}

//             <div
//               className={`mt-6 flex gap-3 rounded-2xl border p-4 ${
//                 isWithinWindow
//                   ? "border-emerald-400/20 bg-emerald-500/[0.06]"
//                   : hasEnded
//                   ? "border-red-400/20 bg-red-500/[0.06]"
//                   : "border-amber-400/20 bg-amber-500/[0.06]"
//               }`}
//             >

//               {isWithinWindow && (
//                 <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
//               )}

//               {hasNotStarted && (
//                 <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
//               )}

//               {hasEnded && (
//                 <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
//               )}

//               <div>

//                 <p
//                   className={`text-sm font-bold ${
//                     isWithinWindow
//                       ? "text-emerald-300"
//                       : hasEnded
//                       ? "text-red-300"
//                       : "text-amber-300"
//                   }`}
//                 >
//                   {isWithinWindow &&
//                     "Your contest is ready"}

//                   {hasNotStarted &&
//                     "Please wait for the start time"}

//                   {hasEnded &&
//                     "This contest is no longer available"}
//                 </p>

//                 <p
//                   className={`mt-1 text-sm leading-6 ${
//                     isWithinWindow
//                       ? "text-emerald-400/80"
//                       : hasEnded
//                       ? "text-red-400/80"
//                       : "text-amber-400/80"
//                   }`}
//                 >
//                   {isWithinWindow &&
//                     "The start date has passed, but the participation window is still open. You can enter the contest now."}

//                   {hasNotStarted &&
//                     "The Start Contest button will become available when the scheduled start time arrives."}

//                   {hasEnded &&
//                     "The participation window has expired. You can no longer enter this contest."}
//                 </p>

//               </div>

//             </div>

//             {/* =================================================
//                 ERROR
//                ================================================= */}

//             {error && (
//               <div className="mt-6 flex gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-4">

//                 <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

//                 <div>

//                   <p className="text-sm font-bold text-red-300">
//                     Unable to continue
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-red-400/80">
//                     {error}
//                   </p>

//                 </div>

//               </div>
//             )}

//             {/* =================================================
//                 ACTIONS
//                ================================================= */}

//             <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

//               <Link
//                 href="/student/solve-and-win"
//                 className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Back to Contests
//               </Link>

//               {/* =================================================
//                   START BUTTON
//                  ================================================= */}

//               <Button
//                 type="button"
//                 onClick={handleStartContest}
//                 disabled={
//                   !isWithinWindow ||
//                   isStarting
//                 }
//                 aria-disabled={
//                   !isWithinWindow ||
//                   isStarting
//                 }
//                 className={`h-12 rounded-xl px-7 font-bold transition ${
//                   isWithinWindow
//                     ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
//                     : "cursor-not-allowed border border-white/10 bg-white/[0.04] text-slate-600 hover:bg-white/[0.04]"
//                 }`}
//               >

//                 {isStarting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Starting...
//                   </>
//                 ) : isWithinWindow ? (
//                   <>
//                     <Play className="mr-2 h-4 w-4 fill-current" />
//                     Start Contest
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </>
//                 ) : hasEnded ? (
//                   <>
//                     <XCircle className="mr-2 h-4 w-4" />
//                     Contest Ended
//                   </>
//                 ) : (
//                   <>
//                     <Clock3 className="mr-2 h-4 w-4" />
//                     Contest Not Started
//                   </>
//                 )}

//               </Button>

//             </div>

//           </div>
//         </Card>

//         {/* =====================================================
//             FOOTER
//            ===================================================== */}

//         <div className="mt-5 text-center">

//           <p className="text-xs text-slate-600">
//             Contest ID:{" "}
//             <span className="font-mono font-bold text-slate-500">
//               {contestId}
//             </span>
//           </p>

//         </div>

//       </div>
//     </main>
//   );
// }