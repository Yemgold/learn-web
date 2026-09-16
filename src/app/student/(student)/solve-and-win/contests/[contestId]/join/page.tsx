

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Trophy,
  Users,
  AlertCircle,
  Coins,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAllNotCompletedContests,
  type SolveAndWinContest,
} from "@/lib/api/solveAndWin";
import { axiosInstance } from "@/lib/api/axios";

export default function JoinContestPage() {
  const router = useRouter();
  const params = useParams();

  const contestId = params?.contestId as string;

  const [contest, setContest] = useState<SolveAndWinContest | null>(null);
  const [isLoadingContest, setIsLoadingContest] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [insufficientPoints, setInsufficientPoints] = useState(false);

  /*
   * Load the contest details.
   */
  useEffect(() => {
    const loadContest = async () => {
      if (!contestId) {
        setError("Contest information could not be found.");
        setIsLoadingContest(false);
        return;
      }

      try {
        setIsLoadingContest(true);
        setError(null);

        const response = await getAllNotCompletedContests();

        if (!response.success) {
          throw new Error(
            response.message || "Unable to load contest information."
          );
        }

        const contests: SolveAndWinContest[] =
  response.data?.solveAndWinContestObj ?? [];

        const foundContest = contests.find(
          (item: SolveAndWinContest) => item._id === contestId
        );

        if (!foundContest) {
          setError(
            "This contest could not be found or is no longer available."
          );
          return;
        }

        setContest(foundContest);
      } catch (err: any) {
        console.error("Failed to load contest:", err);

        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Unable to load contest information. Please try again.";

        setError(Array.isArray(message) ? message.join(", ") : String(message));
      } finally {
        setIsLoadingContest(false);
      }
    };

    loadContest();
  }, [contestId]);

  /*
   * Join contest.
   *
   * IMPORTANT:
   * If the backend says the student already joined this contest,
   * we do NOT show it as an error.
   *
   * Instead, we automatically take the student to the contest
   * start page.
   */
  const handleJoinContest = async () => {
    if (!contestId || isJoining) return;

    try {
      setIsJoining(true);
      setError(null);
      setInsufficientPoints(false);

      const response = await axiosInstance.post(
        `/solve-and-win/contests/join-contest-by-id/${contestId}`
      );

      console.log("Contest joined successfully:", response.data);

      setJoined(true);

      /*
       * Student successfully joined for the first time.
       * Take them to the contest start page.
       */
      setTimeout(() => {
        router.replace(
          `/student/solve-and-win/contests/${contestId}/start`
        );
      }, 700);
    } catch (err: any) {
      console.error("Failed to join contest:", err);

      const status = err?.response?.status;

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Unable to join this contest. Please try again.";

      const normalizedMessage = Array.isArray(message)
        ? message.join(", ")
        : String(message);

      const lowerMessage = normalizedMessage.toLowerCase();

      /*
       * ============================================================
       * ALREADY JOINED
       * ============================================================
       */
      const alreadyJoined =
        lowerMessage.includes("joined this contest earlier") ||
        lowerMessage.includes("already joined this contest") ||
        lowerMessage.includes("you have joined this contest") ||
        lowerMessage.includes("already participated") ||
        lowerMessage.includes("already a participant") ||
        lowerMessage.includes(
          "points have already been deducted for this contest"
        );

      if (alreadyJoined) {
        console.log(
          "Student already joined this contest. Redirecting to start page..."
        );

        router.replace(
          `/student/solve-and-win/contests/${contestId}/start`
        );

        return;
      }

      /*
       * ============================================================
       * INSUFFICIENT PRACTICE POINTS
       * ============================================================
       */
      const isPracticePointError =
        status === 400 &&
        lowerMessage.includes("insufficient") &&
        lowerMessage.includes("practice");

      if (isPracticePointError) {
        setInsufficientPoints(true);
        setError(normalizedMessage);
        return;
      }

      /*
       * ============================================================
       * OTHER ERRORS
       * ============================================================
       */
      setError(normalizedMessage);
    } finally {
      setIsJoining(false);
    }
  };

  /*
   * Shared page background.
   */
  const pageBackground = (
    <>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
      </div>
    </>
  );

  /*
   * Successful first-time join state.
   */
  if (joined) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        {pageBackground}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-10">
          <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <h1 className="text-2xl font-black text-white">
              You’re In!
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/60">
              You have successfully joined this contest. Taking you to the
              contest...
            </p>

            <div className="mt-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /*
   * Loading contest state.
   */
  if (isLoadingContest) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        {pageBackground}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
            </div>

            <h1 className="mt-5 text-xl font-black text-white">
              Loading Contest
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Getting the contest details ready for you...
            </p>
          </Card>
        </div>
      </main>
    );
  }

  /*
   * Contest could not be loaded.
   */
  if (!contest) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        {pageBackground}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>

            <h1 className="mt-5 text-xl font-black text-white">
              Contest Unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/60">
              {error ||
                "This contest could not be found or is no longer available."}
            </p>

            <Link
              href="/student/solve-and-win/contests"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-white/80 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Contests
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {pageBackground}

      <div className="relative z-10">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/student/solve-and-win/contests"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contests
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-300">
              <Trophy className="h-3.5 w-3.5" />
              Solve & Win
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Join Contest
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
              Review the contest details and entry requirement before you
              confirm your participation.
            </p>
          </div>

          {/* Contest Card */}
          <Card className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-sm">
            {/* Contest Header */}
            <div className="border-b border-white/10 bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-transparent p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Trophy className="h-7 w-7 text-white" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40">
                    Contest
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                    {contest.title}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    {contest.description ||
                      "Join this contest and compete for the available reward."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Entry Requirement */}
              <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                    <Coins className="h-5 w-5 text-blue-300" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-300">
                      Contest Entry Requirement
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {contest.entryPoints.toLocaleString()} Practice Points
                    </p>

                    <p className="mt-1 text-sm leading-6 text-white/50">
                      You need enough Practice Points to participate in this
                      competition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contest ID */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/30">
                  Contest ID
                </p>

                <p className="mt-1 break-all font-mono text-sm font-bold text-white/50">
                  {contestId}
                </p>
              </div>

              {/* Contest Information */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
                    <Trophy className="h-5 w-5 text-blue-300" />
                  </div>

                  <h3 className="mt-4 font-bold text-white">
                    Compete & Win
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    Answer the contest questions and compete for the available
                    rewards.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10">
                    <Users className="h-5 w-5 text-emerald-300" />
                  </div>

                  <h3 className="mt-4 font-bold text-white">
                    Join the Competition
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/50">
                    Your participation will be recorded once you successfully
                    join.
                  </p>
                </div>
              </div>

              {/* Practice Points Reminder */}
              <div className="mt-6 flex gap-3 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />

                <div>
                  <p className="text-sm font-bold text-violet-200">
                    Keep your Practice Points in mind
                  </p>

                  <p className="mt-1 text-sm leading-6 text-violet-200/70">
                    This contest requires{" "}
                    <span className="font-black text-violet-100">
                      {contest.entryPoints.toLocaleString()} Practice Points
                    </span>{" "}
                    to enter. Practice questions help you earn Practice Points
                    that can be used to participate in Solve & Win competitions.
                  </p>
                </div>
              </div>

              {/* Insufficient Practice Points */}
              {insufficientPoints && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-amber-400/20 bg-amber-500/10">
                  <div className="flex gap-3 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                      <AlertCircle className="h-5 w-5 text-amber-300" />
                    </div>

                    <div>
                      <p className="text-sm font-black text-amber-200">
                        Not enough Practice Points
                      </p>

                      <p className="mt-1 text-sm leading-6 text-amber-200/70">
                        {error ||
                          "Please practice more of our practice questions to earn more points before participating in this competition."}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-amber-400/10 bg-white/[0.02] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">
                          Need more points?
                        </p>

                        <p className="mt-1 text-xs text-white/40">
                          Practice questions to build your Practice Points
                          balance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Generic Error */}
              {error && !insufficientPoints && (
                <div className="mt-6 flex gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

                  <div>
                    <p className="text-sm font-bold text-red-200">
                      Unable to join
                    </p>

                    <p className="mt-1 text-sm leading-6 text-red-200/70">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Important Notice */}
              {!insufficientPoints && (
                <div className="mt-6 flex gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />

                  <div>
                    <p className="text-sm font-bold text-amber-200">
                      Before you join
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-200/70">
                      Make sure you have enough Practice Points and are ready to
                      participate. Your entry will be recorded once you
                      successfully join this contest.
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="h-12 rounded-xl border-white/10 bg-white/[0.03] px-6 font-bold text-white/70 hover:bg-white/[0.07] hover:text-white"
                >
                  <Link
                    href="/student/solve-and-win/contests"
                    className="flex items-center"
                  >
                    Cancel
                  </Link>
                </Button>

                {insufficientPoints ? (
                  <Button
                    className="h-12 rounded-xl bg-blue-600 px-7 font-bold text-white hover:bg-blue-500"
                  >
                    <Link
                      href="/student/practice/cbtsubjects?exam=jamb"
                      className="flex items-center"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Practice & Earn Points
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleJoinContest}
                    disabled={isJoining}
                    className="h-12 rounded-xl bg-blue-600 px-7 font-bold text-white shadow-lg shadow-blue-600/10 hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-white/30"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining Contest...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Confirm & Join
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Entry Reminder */}
          <div className="mt-5 text-center">
            <p className="text-xs text-white/30">
              Entry:{" "}
              <span className="font-bold text-white/40">
                {contest.entryPoints.toLocaleString()} points
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}