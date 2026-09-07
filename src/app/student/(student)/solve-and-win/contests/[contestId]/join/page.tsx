



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
  getAllActiveContests,
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

        const response = await getAllActiveContests();

        if (!response.success) {
          throw new Error(
            response.message || "Unable to load contest information."
          );
        }

        const contests: SolveAndWinContest[] = response.data ?? [];

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
       *
       * Backend may return something like:
       *
       * "You have joined this contest earlier"
       *
       * or:
       *
       * "You have already joined this contest"
       *
       * In either case, the student is already a participant,
       * so send them directly to the contest start page.
       */
      const alreadyJoined =
  lowerMessage.includes("joined this contest earlier") ||
  lowerMessage.includes("already joined this contest") ||
  lowerMessage.includes("you have joined this contest") ||
  lowerMessage.includes("already participated") ||
  lowerMessage.includes("already a participant") ||
  lowerMessage.includes("points have already been deducted for this contest");

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
   * Successful first-time join state.
   */
  if (joined) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>

            <h1 className="text-2xl font-black text-slate-900">
              You’re In!
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You have successfully joined this contest. Taking you to the
              contest...
            </p>

            <div className="mt-6 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
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
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Loading Contest
            </h1>

            <p className="mt-2 text-sm text-slate-500">
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
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Contest Unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ||
                "This contest could not be found or is no longer available."}
            </p>

            <Link
              href="/student/solve-and-win/contests"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-blue-600"
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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/student/solve-and-win/contests"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contests
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            <Trophy className="h-3.5 w-3.5" />
            Solve & Win
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Join Contest
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Review the contest details and entry requirement before you
            confirm your participation.
          </p>
        </div>

        {/* Contest Card */}
        <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm">
          {/* Contest Header */}
          <div className="border-b border-slate-100 bg-slate-900 p-6 text-white sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <Trophy className="h-7 w-7" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contest
                </p>

                <h2 className="mt-1 text-xl font-black sm:text-2xl">
                  {contest.title}
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-400">
                  {contest.description ||
                    "Join this contest and compete for the available reward."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Entry Requirement */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                  <Coins className="h-5 w-5 text-blue-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    Contest Entry Requirement
                  </p>

                  <p className="mt-1 text-xl font-black text-slate-900">
                    {contest.entryPoints.toLocaleString()} Practice Points
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    You need enough Practice Points to participate in this
                    competition.
                  </p>
                </div>
              </div>
            </div>

            {/* Contest ID */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Contest ID
              </p>

              <p className="mt-1 break-all font-mono text-sm font-bold text-slate-700">
                {contestId}
              </p>
            </div>

            {/* Contest Information */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Compete & Win
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Answer the contest questions and compete for the available
                  rewards.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Join the Competition
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your participation will be recorded once you successfully
                  join.
                </p>
              </div>
            </div>

            {/* Practice Points Reminder */}
            <div className="mt-6 flex gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

              <div>
                <p className="text-sm font-bold text-violet-900">
                  Keep your Practice Points in mind
                </p>

                <p className="mt-1 text-sm leading-6 text-violet-800">
                  This contest requires{" "}
                  <span className="font-black">
                    {contest.entryPoints.toLocaleString()} Practice Points
                  </span>{" "}
                  to enter. Practice questions help you earn Practice Points
                  that can be used to participate in Solve & Win competitions.
                </p>
              </div>
            </div>

            {/* Insufficient Practice Points */}
            {insufficientPoints && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
                <div className="flex gap-3 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-amber-950">
                      Not enough Practice Points
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      {error ||
                        "Please practice more of our practice questions to earn more points before participating in this competition."}
                    </p>
                  </div>
                </div>

                <div className="border-t border-amber-200 bg-white/60 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Need more points?
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
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
              <div className="mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>
                  <p className="text-sm font-bold text-red-900">
                    Unable to join
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Important notice */}
            {!insufficientPoints && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <p className="text-sm font-bold text-amber-900">
                    Before you join
                  </p>

                  <p className="mt-1 text-sm leading-6 text-amber-800">
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
                className="h-12 rounded-xl px-6 font-bold"
              
              >
                <Link href="/student/solve-and-win/contests">
                  Cancel
                </Link>
              </Button>

              {insufficientPoints ? (
                <Button
                  className="h-12 rounded-xl bg-blue-600 px-7 font-bold text-white hover:bg-blue-700"
                
                >
                  <Link href="/student/practice/cbtsubjects?exam=jamb">
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
                  className="h-12 rounded-xl bg-slate-900 px-7 font-bold text-white hover:bg-blue-600"
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

        {/* Entry reminder below card */}
        <div className="mt-5 text-center">
          <p className="text-xs text-slate-400">
            Entry:{" "}
            <span className="font-bold text-slate-500">
              {contest.entryPoints.toLocaleString()} points
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}














// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   ArrowRight,
//   CheckCircle2,
//   Loader2,
//   ShieldCheck,
//   Trophy,
//   Users,
//   AlertCircle,
//   Coins,
//   BookOpen,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   getAllActiveContests,
//   type SolveAndWinContest,
// } from "@/lib/api/solveAndWin";
// import { axiosInstance } from "@/lib/api/axios";

// export default function JoinContestPage() {
//   const router = useRouter();
//   const params = useParams();

//   const contestId = params?.contestId as string;

//   const [contest, setContest] = useState<SolveAndWinContest | null>(null);
//   const [isLoadingContest, setIsLoadingContest] = useState(true);
//   const [isJoining, setIsJoining] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [joined, setJoined] = useState(false);
//   const [insufficientPoints, setInsufficientPoints] = useState(false);

//   /*
//    * Load the contest so the student can see the actual
//    * entry requirement before confirming participation.
//    */
//   useEffect(() => {
//     const loadContest = async () => {
//       if (!contestId) {
//         setError("Contest information could not be found.");
//         setIsLoadingContest(false);
//         return;
//       }

//       try {
//         setIsLoadingContest(true);
//         setError(null);

//         const response = await getAllActiveContests();

//         if (!response.success) {
//           throw new Error(
//             response.message || "Unable to load contest information."
//           );
//         }

//         const contests: SolveAndWinContest[] = response.data ?? [];

// const foundContest = contests.find(
//   (item: SolveAndWinContest) => item._id === contestId
// );

//         if (!foundContest) {
//           setError(
//             "This contest could not be found or is no longer available."
//           );
//           return;
//         }

//         setContest(foundContest);
//       } catch (err: any) {
//         console.error("Failed to load contest:", err);

//         const message =
//           err?.response?.data?.message ||
//           err?.response?.data?.error ||
//           err?.message ||
//           "Unable to load contest information. Please try again.";

//         setError(Array.isArray(message) ? message.join(", ") : message);
//       } finally {
//         setIsLoadingContest(false);
//       }
//     };

//     loadContest();
//   }, [contestId]);

//   const handleJoinContest = async () => {
//     if (!contestId || isJoining) return;

//     try {
//       setIsJoining(true);
//       setError(null);
//       setInsufficientPoints(false);

//       const response = await axiosInstance.post(
//         `/solve-and-win/contests/join-contest-by-id/${contestId}`
//       );

//       console.log("Contest joined successfully:", response.data);

//       setJoined(true);

//       /*
//        * Change this route to the actual contest/CBT route
//        * once that page is ready.
//        */
//       setTimeout(() => {
//         router.push(`/student/solve-and-win/contests/${contestId}/start`);
//       }, 700);
//     } catch (err: any) {
//       console.error("Failed to join contest:", err);

//       const status = err?.response?.status;

//       const message =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         "Unable to join this contest. Please try again.";

//       const normalizedMessage = Array.isArray(message)
//         ? message.join(", ")
//         : String(message);

//       /*
//        * Handle the specific backend response:
//        *
//        * 400
//        * "Insufficient Practice points..."
//        */
//       const isPracticePointError =
//         status === 400 &&
//         normalizedMessage.toLowerCase().includes("insufficient") &&
//         normalizedMessage.toLowerCase().includes("practice");

//       if (isPracticePointError) {
//         setInsufficientPoints(true);
//         setError(normalizedMessage);
//       } else {
//         setError(normalizedMessage);
//       }
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   if (joined) {
//     return (
//       <main className="min-h-screen bg-slate-50 px-4 py-10">
//         <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
//           <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
//             <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
//               <CheckCircle2 className="h-8 w-8 text-emerald-600" />
//             </div>

//             <h1 className="text-2xl font-black text-slate-900">
//               You’re In!
//             </h1>

//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               You have successfully joined this contest. Taking you to the
//               contest...
//             </p>

//             <div className="mt-6 flex justify-center">
//               <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
//             </div>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * Loading contest state
//    */
//   if (isLoadingContest) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
//           <Card className="w-full rounded-3xl border-0 bg-white p-10 text-center shadow-sm">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
//               <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
//             </div>

//             <h1 className="mt-5 text-xl font-black text-slate-900">
//               Loading Contest
//             </h1>

//             <p className="mt-2 text-sm text-slate-500">
//               Getting the contest details ready for you...
//             </p>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * Contest could not be loaded
//    */
//   if (!contest) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
//               <AlertCircle className="h-7 w-7 text-red-600" />
//             </div>

//             <h1 className="mt-5 text-xl font-black text-slate-900">
//               Contest Unavailable
//             </h1>

//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               {error ||
//                 "This contest could not be found or is no longer available."}
//             </p>

//             <Link
//               href="/student/solve-and-win/contests"
//               className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-blue-600"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Contests
//             </Link>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* Back */}
//         <Link
//           href="/student/solve-and-win/contests"
//           className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Contests
//         </Link>

//         {/* Header */}
//         <div className="mb-8">
//           <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
//             <Trophy className="h-3.5 w-3.5" />
//             Solve & Win
//           </div>

//           <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//             Join Contest
//           </h1>

//           <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
//             Review the contest details and entry requirement before you
//             confirm your participation.
//           </p>
//         </div>

//         {/* Contest Card */}
//         <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm">
//           {/* Contest Header */}
//           <div className="border-b border-slate-100 bg-slate-900 p-6 text-white sm:p-8">
//             <div className="flex items-start gap-4">
//               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
//                 <Trophy className="h-7 w-7" />
//               </div>

//               <div className="min-w-0">
//                 <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//                   Contest
//                 </p>

//                 <h2 className="mt-1 text-xl font-black sm:text-2xl">
//                   {contest.title}
//                 </h2>

//                 <p className="mt-1 text-sm leading-6 text-slate-400">
//                   {contest.description ||
//                     "Join this contest and compete for the available reward."}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="p-6 sm:p-8">
//             {/* Entry Requirement */}
//             <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
//               <div className="flex items-start gap-4">
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
//                   <Coins className="h-5 w-5 text-blue-600" />
//                 </div>

//                 <div className="min-w-0">
//                   <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
//                     Contest Entry Requirement
//                   </p>

//                   <p className="mt-1 text-xl font-black text-slate-900">
//                     {contest.entryPoints.toLocaleString()} Practice Points
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-slate-600">
//                     You need enough Practice Points to participate in this
//                     competition.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Contest ID / reference */}
//             <div className="mt-5 rounded-2xl bg-slate-50 p-4">
//               <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//                 Contest ID
//               </p>

//               <p className="mt-1 break-all font-mono text-sm font-bold text-slate-700">
//                 {contestId}
//               </p>
//             </div>

//             {/* Contest Information */}
//             <div className="mt-6 grid gap-4 sm:grid-cols-2">
//               <div className="rounded-2xl border border-slate-100 p-5">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                   <Trophy className="h-5 w-5 text-blue-600" />
//                 </div>

//                 <h3 className="mt-4 font-bold text-slate-900">
//                   Compete & Win
//                 </h3>

//                 <p className="mt-1 text-sm leading-6 text-slate-500">
//                   Answer the contest questions and compete for the available
//                   rewards.
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-100 p-5">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
//                   <Users className="h-5 w-5 text-emerald-600" />
//                 </div>

//                 <h3 className="mt-4 font-bold text-slate-900">
//                   Join the Competition
//                 </h3>

//                 <p className="mt-1 text-sm leading-6 text-slate-500">
//                   Your participation will be recorded once you successfully
//                   join.
//                 </p>
//               </div>
//             </div>

//             {/* Practice Points Reminder */}
//             <div className="mt-6 flex gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4">
//               <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />

//               <div>
//                 <p className="text-sm font-bold text-violet-900">
//                   Keep your Practice Points in mind
//                 </p>

//                 <p className="mt-1 text-sm leading-6 text-violet-800">
//                   This contest requires{" "}
//                   <span className="font-black">
//                     {contest.entryPoints.toLocaleString()} Practice Points
//                   </span>{" "}
//                   to enter. Practice questions help you earn Practice Points
//                   that can be used to participate in Solve & Win competitions.
//                 </p>
//               </div>
//             </div>

//             {/* Insufficient Practice Points */}
//             {insufficientPoints && (
//               <div className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
//                 <div className="flex gap-3 p-5">
//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
//                     <AlertCircle className="h-5 w-5 text-amber-600" />
//                   </div>

//                   <div>
//                     <p className="text-sm font-black text-amber-950">
//                       Not enough Practice Points
//                     </p>

//                     <p className="mt-1 text-sm leading-6 text-amber-800">
//                       {error ||
//                         "Please practice more of our practice questions to earn more points before participating in this competition."}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="border-t border-amber-200 bg-white/60 p-4">
//                   <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                       <p className="text-sm font-bold text-slate-900">
//                         Need more points?
//                       </p>

//                       <p className="mt-1 text-xs text-slate-500">
//                         Practice questions to build your Practice Points
//                         balance.
//                       </p>
//                     </div>

                   
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Generic Error */}
//             {error && !insufficientPoints && (
//               <div className="mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
//                 <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

//                 <div>
//                   <p className="text-sm font-bold text-red-900">
//                     Unable to join
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-red-700">
//                     {error}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Important notice */}
//             {!insufficientPoints && (
//               <div className="mt-6 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">
//                 <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

//                 <div>
//                   <p className="text-sm font-bold text-amber-900">
//                     Before you join
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-amber-800">
//                     Make sure you have enough Practice Points and are ready to
//                     participate. Your entry will be recorded once you
//                     successfully join this contest.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* Actions */}
//             <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//               <Button
                
//                 variant="outline"
//                 className="h-12 rounded-xl px-6 font-bold"
//               >
//                 <Link href="/student/solve-and-win/contests">Cancel</Link>
//               </Button>

//               {insufficientPoints ? (
//                 <Button
                  
//                   className="h-12 rounded-xl bg-blue-600 px-7 font-bold text-white hover:bg-blue-700"
//                 >
//                  <Link href="/student/practice/cbtsubjects?exam=jamb">
//                     <BookOpen className="mr-2 h-4 w-4" />
//                     Practice & Earn Points
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Link>
//                 </Button>
//               ) : (
//                 <Button
//                   type="button"
//                   onClick={handleJoinContest}
//                   disabled={isJoining}
//                   className="h-12 rounded-xl bg-slate-900 px-7 font-bold text-white hover:bg-blue-600"
//                 >
//                   {isJoining ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Joining Contest...
//                     </>
//                   ) : (
//                     <>
//                       <ShieldCheck className="mr-2 h-4 w-4" />
//                       Confirm & Join
//                       <ArrowRight className="ml-2 h-4 w-4" />
//                     </>
//                   )}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </Card>

//         {/* Entry reminder below card */}
//         <div className="mt-5 text-center">
//           <p className="text-xs text-slate-400">
//             Entry:{" "}
//             <span className="font-bold text-slate-500">
//               {contest.entryPoints.toLocaleString()} points
//             </span>
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// }

