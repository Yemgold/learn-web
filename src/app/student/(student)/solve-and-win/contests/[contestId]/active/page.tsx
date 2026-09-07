








"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  FileText,
  Loader2,
  Trophy,
  Users,
  AlertCircle,
  BookOpen,
  ChevronRight,
  Radio,
} from "lucide-react";

import { getAllActiveContests } from "@/lib/api/solveAndWin";

interface Subject {
  subjectId:
    | string
    | {
        _id: string;
        name: string;
      };
  questions?: unknown[];
}

interface ActiveContest {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  amountToBeWonInKobo?: number;
  entryPoints?: number;
  subjects?: Subject[];
  status?: string;
  isActive?: boolean;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ActiveCompetitionPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const [competitionId, setCompetitionId] = useState("");
  const [contest, setContest] = useState<ActiveContest | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadParamsAndContest = async () => {
      try {
        const resolvedParams = await params;

        if (!mounted) return;

        setCompetitionId(resolvedParams.competitionId);

        const response = await getAllActiveContests();

        if (!mounted) return;

        const contests: ActiveContest[] = Array.isArray(
          response?.data,
        )
          ? response.data
          : Array.isArray(response?.data?.solveAndWinContestObj)
            ? response.data.solveAndWinContestObj
            : [];

        const currentContest = contests.find(
          (item) => item._id === resolvedParams.competitionId,
        );

        if (!currentContest) {
          setContest(null);
          setError(
            "This competition is not currently active.",
          );
          return;
        }

        setContest(currentContest);
      } catch (err: unknown) {
        console.error(
          "Failed to load active competition:",
          err,
        );

        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load the active competition.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadParamsAndContest();

    return () => {
      mounted = false;
    };
  }, [params]);

  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date?: string) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatNaira = (amountInKobo?: number) => {
    if (
      typeof amountInKobo !== "number" ||
      Number.isNaN(amountInKobo)
    ) {
      return "₦0";
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amountInKobo / 100);
  };

  const totalQuestions = useMemo(() => {
    if (!contest?.subjects) return 0;

    return contest.subjects.reduce((total, subject) => {
      return total + (subject.questions?.length ?? 0);
    }, 0);
  }, [contest]);

  const totalSubjects = contest?.subjects?.length ?? 0;

  const getSubjectId = (subject: Subject) => {
    if (
      typeof subject.subjectId === "object" &&
      subject.subjectId !== null
    ) {
      return subject.subjectId._id;
    }

    return subject.subjectId;
  };

  const getSubjectName = (subject: Subject) => {
    if (
      typeof subject.subjectId === "object" &&
      subject.subjectId !== null
    ) {
      return subject.subjectId.name;
    }

    return "Subject";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">
                Loading active competition...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!contest) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/admin/secondary/solveandwin"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Solve & Win
          </Link>

          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>

              <h1 className="text-xl font-semibold">
                Competition Not Active
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                {error ||
                  "This competition could not be found among the currently active competitions."}
              </p>

              <Link
                href="/admin/secondary/solveandwin"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Competitions
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="mb-6">
          <Link
            href="/admin/secondary/solveandwin"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Solve & Win
          </Link>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-400">
                  <Radio className="h-3.5 w-3.5 animate-pulse" />
                  LIVE NOW
                </span>

                {contest.category && (
                  <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                    {contest.category}
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {contest.title}
              </h1>

              {contest.description && (
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
                  {contest.description}
                </p>
              )}
            </div>

            <Link
              href={`/admin/secondary/solveandwin/competitions/${competitionId}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Competition Dashboard
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* =====================================================
            LIVE BANNER
        ====================================================== */}
        <div className="mb-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>

              <div>
                <p className="font-semibold">
                  Competition is currently live
                </p>

                <p className="text-sm text-muted-foreground">
                  Students can participate in this competition
                  while the active period is open.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              Ends {formatDateTime(contest.endDate)}
            </div>
          </div>
        </div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>

            <p className="text-sm text-muted-foreground">
              Prize Pool
            </p>

            <p className="mt-1 text-xl font-bold">
              {formatNaira(
                contest.amountToBeWonInKobo,
              )}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Coins className="h-5 w-5 text-primary" />
            </div>

            <p className="text-sm text-muted-foreground">
              Entry Points
            </p>

            <p className="mt-1 text-xl font-bold">
              {contest.entryPoints ?? 0}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>

            <p className="text-sm text-muted-foreground">
              Subjects
            </p>

            <p className="mt-1 text-xl font-bold">
              {totalSubjects}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>

            <p className="text-sm text-muted-foreground">
              Questions
            </p>

            <p className="mt-1 text-xl font-bold">
              {totalQuestions}
            </p>
          </div>
        </div>

        {/* =====================================================
            CONTEST INFORMATION
        ====================================================== */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <CalendarDays className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Competition Schedule
                </h2>

                <p className="text-sm text-muted-foreground">
                  Active competition period
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Start Date
                </p>

                <p className="mt-2 font-semibold">
                  {formatDate(contest.startDate)}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDateTime(contest.startDate)}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  End Date
                </p>

                <p className="mt-2 font-semibold">
                  {formatDate(contest.endDate)}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDateTime(contest.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              STATUS
          ==================================================== */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">
              Competition Status
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Status
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Backend Active
                </span>

                <span className="text-sm font-medium">
                  {contest.isActive ? "Yes" : "No"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Category
                </span>

                <span className="text-sm font-medium">
                  {contest.category || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Contest ID
                </span>

                <span className="max-w-[150px] truncate font-mono text-xs">
                  {contest._id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            SUBJECTS
        ====================================================== */}
        <div className="rounded-2xl border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">
                Competition Subjects
              </h2>

              <p className="text-sm text-muted-foreground">
                Subjects and questions configured for this
                competition.
              </p>
            </div>

            <span className="text-sm font-medium text-muted-foreground">
              {totalSubjects}{" "}
              {totalSubjects === 1 ? "subject" : "subjects"}
            </span>
          </div>

          {contest.subjects && contest.subjects.length > 0 ? (
            <div className="divide-y">
              {contest.subjects.map((subject, index) => {
                const subjectId = getSubjectId(subject);
                const subjectName = getSubjectName(subject);
                const questionCount =
                  subject.questions?.length ?? 0;

                return (
                  <div
                    key={`${subjectId}-${index}`}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold capitalize">
                          {subjectName}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {questionCount}{" "}
                          {questionCount === 1
                            ? "question"
                            : "questions"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects/${subjectId}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      View Subject
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="font-medium">
                No subjects configured
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                This competition does not currently have any
                subjects or questions.
              </p>
            </div>
          )}
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold">
              Quick Actions
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage this competition.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/secondary/solveandwin/competitions/${competitionId}`}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Trophy className="h-4 w-4" />
              Competition Dashboard
            </Link>

            <Link
              href={`/admin/secondary/solveandwin/competitions/${competitionId}/subjects`}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <BookOpen className="h-4 w-4" />
              Manage Subjects
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}