

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
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
//   Users,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   getAllActiveContests,
//   type SolveAndWinContest,
// } from "@/lib/api/solveAndWin";

// type Countdown = {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// };

// function parseDateValue(value: unknown): Date | null {
//   if (!value) return null;

//   const date = new Date(String(value));

//   if (Number.isNaN(date.getTime())) {
//     return null;
//   }

//   return date;
// }

// /**
//  * Gets the scheduled contest start date.
//  *
//  * Scheduled/full datetime fields are checked first.
//  * Scheduled date + time is checked next.
//  * Generic startDate is only used as a fallback.
//  */
// function getContestStartDate(
//   contest: SolveAndWinContest
// ): Date | null {
//   const data = contest as any;

//   /*
//    * ---------------------------------------------------------
//    * 1. Full scheduled datetime fields
//    * ---------------------------------------------------------
//    */
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

//   /*
//    * ---------------------------------------------------------
//    * 2. Scheduled date + scheduled time
//    *
//    * Example:
//    *
//    * scheduledDate = "2026-09-04"
//    * scheduledTime = "01:00"
//    *
//    * becomes:
//    *
//    * 2026-09-04T01:00
//    * ---------------------------------------------------------
//    */
//   const scheduledDate =
//     data.scheduledDate ??
//     data.scheduledStartDate ??
//     data.contestDate;

//   const scheduledTime =
//     data.scheduledTime ??
//     data.scheduledStartTime ??
//     data.startTime;

//   if (scheduledDate && scheduledTime) {
//     const combined = `${scheduledDate}T${scheduledTime}`;

//     const parsed = parseDateValue(combined);

//     if (parsed) {
//       return parsed;
//     }
//   }

//   /*
//    * ---------------------------------------------------------
//    * 3. Generic startDate fallback
//    * ---------------------------------------------------------
//    */
//   const fallbackStartDate = parseDateValue(data.startDate);

//   if (fallbackStartDate) {
//     return fallbackStartDate;
//   }

//   return null;
// }

// function getCountdown(
//   target: Date,
//   currentTime: number
// ): Countdown {
//   const difference = Math.max(
//     0,
//     target.getTime() - currentTime
//   );

//   const totalSeconds = Math.floor(difference / 1000);

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

// export default function StartContestPage() {
//   const router = useRouter();
//   const params = useParams();

//   const contestId = params?.contestId as string;

//   const [contest, setContest] =
//     useState<SolveAndWinContest | null>(null);

//   const [isLoading, setIsLoading] =
//     useState(true);

//   const [isStarting, setIsStarting] =
//     useState(false);

//   const [error, setError] =
//     useState<string | null>(null);

//   /*
//    * Live client clock.
//    *
//    * It updates every second so the Start button
//    * automatically changes state when the scheduled
//    * time arrives.
//    */
//   const [now, setNow] = useState(() => Date.now());

//   /*
//    * ---------------------------------------------------------
//    * LOAD CONTEST
//    * ---------------------------------------------------------
//    */
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
//           await getAllActiveContests();

//         if (!response.success) {
//           throw new Error(
//             response.message ||
//               "Unable to load contest information."
//           );
//         }

//         const contests: SolveAndWinContest[] =
//           response.data ?? [];

//         const foundContest = contests.find(
//           (item: SolveAndWinContest) =>
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

//         console.log(
//           "Contest scheduled start fields:",
//           {
//             scheduledStartAt:
//               (foundContest as any)
//                 .scheduledStartAt,

//             scheduledStartDate:
//               (foundContest as any)
//                 .scheduledStartDate,

//             scheduledStartDateTime:
//               (foundContest as any)
//                 .scheduledStartDateTime,

//             scheduledStart:
//               (foundContest as any)
//                 .scheduledStart,

//             startAt:
//               (foundContest as any).startAt,

//             startsAt:
//               (foundContest as any).startsAt,

//             startDateTime:
//               (foundContest as any)
//                 .startDateTime,

//             startDate:
//               (foundContest as any).startDate,

//             scheduledDate:
//               (foundContest as any)
//                 .scheduledDate,

//             scheduledTime:
//               (foundContest as any)
//                 .scheduledTime,

//             scheduledStartTime:
//               (foundContest as any)
//                 .scheduledStartTime,

//             startTime:
//               (foundContest as any).startTime,
//           }
//         );

//         setContest(foundContest);
//       } catch (err: any) {
//         console.error(
//           "Failed to load contest:",
//           err
//         );

//         const message =
//           err?.response?.data?.message ||
//           err?.response?.data?.error ||
//           err?.message ||
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

//   /*
//    * ---------------------------------------------------------
//    * LIVE CLOCK
//    * ---------------------------------------------------------
//    */
//   useEffect(() => {
//     const timer = window.setInterval(() => {
//       setNow(Date.now());
//     }, 1000);

//     return () => {
//       window.clearInterval(timer);
//     };
//   }, []);

//   /*
//    * ---------------------------------------------------------
//    * ACTUAL SCHEDULED START DATE
//    * ---------------------------------------------------------
//    */
//   const startDate = useMemo(() => {
//     if (!contest) {
//       return null;
//     }

//     return getContestStartDate(contest);
//   }, [contest]);

//   /*
//    * ---------------------------------------------------------
//    * START TIMESTAMP
//    * ---------------------------------------------------------
//    */
//   const startTimestamp = useMemo(() => {
//     if (!startDate) {
//       return null;
//     }

//     return startDate.getTime();
//   }, [startDate]);

//   /*
//    * ---------------------------------------------------------
//    * HAS CONTEST STARTED?
//    *
//    * Before:
//    *
//    * now < startTimestamp
//    *
//    * false
//    *
//    * At/after:
//    *
//    * now >= startTimestamp
//    *
//    * true
//    * ---------------------------------------------------------
//    */
//   const hasStarted = useMemo(() => {
//     if (startTimestamp === null) {
//       return false;
//     }

//     return now >= startTimestamp;
//   }, [now, startTimestamp]);

//   /*
//    * ---------------------------------------------------------
//    * COUNTDOWN
//    * ---------------------------------------------------------
//    */
//   const countdown = useMemo(() => {
//     if (!startDate) {
//       return {
//         days: 0,
//         hours: 0,
//         minutes: 0,
//         seconds: 0,
//       };
//     }

//     return getCountdown(startDate, now);
//   }, [startDate, now]);

//   /*
//    * ---------------------------------------------------------
//    * START CONTEST
//    * ---------------------------------------------------------
//    */
//   const handleStartContest = () => {
//     if (isStarting || !contestId) {
//       return;
//     }

//     /*
//      * No valid scheduled start time.
//      */
//     if (startTimestamp === null) {
//       setError(
//         "The contest start time could not be determined."
//       );

//       return;
//     }

//     /*
//      * ALWAYS use a fresh timestamp when the student
//      * clicks the button.
//      *
//      * This prevents the button from being bypassed
//      * because the displayed `now` value is slightly old.
//      */
//     const currentTime = Date.now();

//     /*
//      * Contest has NOT started.
//      *
//      * Do not navigate.
//      */
//     if (currentTime < startTimestamp) {
//       setError(
//         "This contest has not started yet. Please wait until the scheduled start time."
//       );

//       setNow(currentTime);

//       return;
//     }

//     /*
//      * Contest has started.
//      */
//     setIsStarting(true);
//     setError(null);

//     router.replace(
//       `/student/solve-and-win/contests/${contestId}/play`
//     );
//   };

//   /*
//    * ---------------------------------------------------------
//    * LOADING
//    * ---------------------------------------------------------
//    */
//   if (isLoading) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
//           <Card className="w-full rounded-3xl border-0 bg-white p-10 text-center shadow-sm">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
//               <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
//             </div>

//             <h1 className="mt-5 text-xl font-black text-slate-900">
//               Preparing Contest
//             </h1>

//             <p className="mt-2 text-sm text-slate-500">
//               Checking the contest schedule...
//             </p>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /*
//    * ---------------------------------------------------------
//    * CONTEST NOT FOUND
//    * ---------------------------------------------------------
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

//   /*
//    * ---------------------------------------------------------
//    * NO START DATE
//    * ---------------------------------------------------------
//    */
//   if (!startDate) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
//               <Clock3 className="h-7 w-7 text-amber-600" />
//             </div>

//             <h1 className="mt-5 text-xl font-black text-slate-900">
//               Contest Schedule Unavailable
//             </h1>

//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               We could not determine when this contest
//               is scheduled to start. Please try again
//               later.
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
//           <div
//             className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
//               hasStarted
//                 ? "bg-emerald-50 text-emerald-700"
//                 : "bg-blue-50 text-blue-700"
//             }`}
//           >
//             {hasStarted ? (
//               <CheckCircle2 className="h-3.5 w-3.5" />
//             ) : (
//               <Clock3 className="h-3.5 w-3.5" />
//             )}

//             {hasStarted
//               ? "Contest is Live"
//               : "Contest Starts Soon"}
//           </div>

//           <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//             {hasStarted
//               ? "Ready to Start?"
//               : "Get Ready"}
//           </h1>

//           <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
//             {hasStarted
//               ? "The contest is now live. You can start answering the questions."
//               : "The contest has not started yet. The Start Contest button will become available when the scheduled time arrives."}
//           </p>
//         </div>

//         {/* Contest Card */}
//         <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm">

//           {/* Contest Header */}
//           <div
//             className={`p-6 text-white sm:p-8 ${
//               hasStarted
//                 ? "bg-emerald-700"
//                 : "bg-slate-900"
//             }`}
//           >
//             <div className="flex items-start gap-4">

//               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
//                 <Trophy className="h-7 w-7" />
//               </div>

//               <div className="min-w-0">

//                 <p className="text-xs font-bold uppercase tracking-wider text-white/60">
//                   Solve & Win Contest
//                 </p>

//                 <h2 className="mt-1 text-xl font-black sm:text-2xl">
//                   {contest.title}
//                 </h2>

//                 <p className="mt-1 text-sm leading-6 text-white/70">
//                   {contest.description ||
//                     "Compete against other students and answer the contest questions to win rewards."}
//                 </p>

//               </div>

//             </div>
//           </div>

//           <div className="p-6 sm:p-8">

//             {/* Countdown */}
//             {!hasStarted ? (
//               <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

//                 <div className="text-center">

//                   <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
//                     <Clock3 className="h-6 w-6 text-blue-600" />
//                   </div>

//                   <p className="mt-4 text-xs font-black uppercase tracking-widest text-blue-600">
//                     Contest Starts In
//                   </p>

//                   <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">

//                     <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
//                       <p className="text-2xl font-black text-slate-900 sm:text-3xl">
//                         {pad(countdown.days)}
//                       </p>

//                       <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
//                         Days
//                       </p>
//                     </div>

//                     <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
//                       <p className="text-2xl font-black text-slate-900 sm:text-3xl">
//                         {pad(countdown.hours)}
//                       </p>

//                       <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
//                         Hours
//                       </p>
//                     </div>

//                     <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
//                       <p className="text-2xl font-black text-slate-900 sm:text-3xl">
//                         {pad(countdown.minutes)}
//                       </p>

//                       <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
//                         Minutes
//                       </p>
//                     </div>

//                     <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
//                       <p className="text-2xl font-black text-slate-900 sm:text-3xl">
//                         {pad(countdown.seconds)}
//                       </p>

//                       <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
//                         Seconds
//                       </p>
//                     </div>

//                   </div>

//                   <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
//                     <CalendarDays className="h-4 w-4" />

//                     <span>
//                       Starts{" "}
//                       <span className="font-bold text-slate-700">
//                         {startDate.toLocaleString([], {
//                           dateStyle: "medium",
//                           timeStyle: "short",
//                         })}
//                       </span>
//                     </span>
//                   </div>

//                 </div>
//               </div>
//             ) : (
//               <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-center">

//                 <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white">
//                   <CheckCircle2 className="h-7 w-7 text-emerald-600" />
//                 </div>

//                 <p className="mt-4 text-xs font-black uppercase tracking-widest text-emerald-600">
//                   Contest is Live
//                 </p>

//                 <h3 className="mt-2 text-2xl font-black text-slate-900">
//                   You can start now!
//                 </h3>

//                 <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
//                   The scheduled start time has arrived.
//                   Click the button below to enter the
//                   contest.
//                 </p>

//               </div>
//             )}

//             {/* Contest Information */}
//             <div className="mt-6 grid gap-4 sm:grid-cols-3">

//               <div className="rounded-2xl border border-slate-100 p-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
//                   <Trophy className="h-5 w-5 text-blue-600" />
//                 </div>

//                 <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
//                   Contest
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-slate-900">
//                   {contest.title}
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-100 p-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
//                   <Users className="h-5 w-5 text-emerald-600" />
//                 </div>

//                 <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
//                   Participation
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-slate-900">
//                   Joined Successfully
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-100 p-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
//                   <CalendarDays className="h-5 w-5 text-violet-600" />
//                 </div>

//                 <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
//                   Start Time
//                 </p>

//                 <p className="mt-1 text-sm font-bold text-slate-900">
//                   {startDate.toLocaleString([], {
//                     dateStyle: "medium",
//                     timeStyle: "short",
//                   })}
//                 </p>
//               </div>

//             </div>

//             {/* Notice */}
//             <div
//               className={`mt-6 flex gap-3 rounded-2xl border p-4 ${
//                 hasStarted
//                   ? "border-emerald-100 bg-emerald-50"
//                   : "border-amber-100 bg-amber-50"
//               }`}
//             >
//               {hasStarted ? (
//                 <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
//               ) : (
//                 <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
//               )}

//               <div>

//                 <p
//                   className={`text-sm font-bold ${
//                     hasStarted
//                       ? "text-emerald-900"
//                       : "text-amber-900"
//                   }`}
//                 >
//                   {hasStarted
//                     ? "Your contest is ready"
//                     : "Please wait for the start time"}
//                 </p>

//                 <p
//                   className={`mt-1 text-sm leading-6 ${
//                     hasStarted
//                       ? "text-emerald-800"
//                       : "text-amber-800"
//                   }`}
//                 >
//                   {hasStarted
//                     ? "You may now enter the contest. Make sure you are ready before starting."
//                     : "The Start Contest button is disabled until the scheduled contest start time is reached."}
//                 </p>

//               </div>
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">

//                 <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

//                 <div>

//                   <p className="text-sm font-bold text-red-900">
//                     Unable to continue
//                   </p>

//                   <p className="mt-1 text-sm leading-6 text-red-700">
//                     {error}
//                   </p>

//                 </div>

//               </div>
//             )}

//             {/* Actions */}
//             <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

//               <Link
//                 href="/student/solve-and-win/contests"
//                 className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Back to Contests
//               </Link>

//               {/* 
//                * IMPORTANT:
//                *
//                * !hasStarted = disabled
//                *
//                * isStarting = disabled
//                *
//                * Therefore the button CANNOT be clicked
//                * before the scheduled start time.
//                */}
//               <Button
//                 type="button"
//                 onClick={handleStartContest}
//                 disabled={!hasStarted || isStarting}
//                 aria-disabled={!hasStarted || isStarting}
//                 className={`h-12 rounded-xl px-7 font-bold ${
//                   hasStarted
//                     ? "bg-emerald-600 text-white hover:bg-emerald-700"
//                     : "cursor-not-allowed bg-slate-200 text-slate-400 hover:bg-slate-200"
//                 }`}
//               >

//                 {isStarting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Starting...
//                   </>
//                 ) : hasStarted ? (
//                   <>
//                     <Play className="mr-2 h-4 w-4 fill-current" />
//                     Start Contest
//                     <ArrowRight className="ml-2 h-4 w-4" />
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

//         {/* Footer */}
//         <div className="mt-5 text-center">
//           <p className="text-xs text-slate-400">
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
  Users,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  getAllActiveContests,
  type SolveAndWinContest,
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

type ContestSchedule = {
  startDate: Date | null;
  endDate: Date | null;
  windowDays: number | null;
};

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Safely convert a value to a Date.
 */
function parseDateValue(value: unknown): Date | null {
  if (!value) return null;

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

/**
 * Parse a date + time pair.
 *
 * Example:
 * 2026-09-04 + 01:00
 *
 * becomes:
 * 2026-09-04T01:00:00
 */
function parseDateAndTime(
  dateValue: unknown,
  timeValue: unknown
): Date | null {
  if (!dateValue || !timeValue) {
    return null;
  }

  const combined = `${String(dateValue)}T${String(
    timeValue
  )}`;

  return parseDateValue(combined);
}

/**
 * Gets the scheduled contest START date.
 *
 * IMPORTANT:
 * We prioritize explicit scheduled fields.
 * Generic startDate is only a fallback.
 */
function getContestStartDate(
  contest: SolveAndWinContest
): Date | null {
  const data = contest as unknown as Record<
    string,
    unknown
  >;

  /* ---------------------------------------------------------
     1. Full scheduled datetime fields
     --------------------------------------------------------- */

  const scheduledDateTimeCandidates = [
    data.scheduledStartAt,
    data.scheduledStartDateTime,
    data.scheduledStart,
    data.startAt,
    data.startsAt,
    data.startDateTime,
  ];

  for (const value of scheduledDateTimeCandidates) {
    const parsed = parseDateValue(value);

    if (parsed) {
      return parsed;
    }
  }

  /* ---------------------------------------------------------
     2. Scheduled date + scheduled time
     --------------------------------------------------------- */

  const scheduledDate =
    data.scheduledDate ??
    data.scheduledStartDate ??
    data.contestDate;

  const scheduledTime =
    data.scheduledTime ??
    data.scheduledStartTime ??
    data.startTime;

  const scheduledDateTime = parseDateAndTime(
    scheduledDate,
    scheduledTime
  );

  if (scheduledDateTime) {
    return scheduledDateTime;
  }

  /* ---------------------------------------------------------
     3. Generic startDate fallback
     --------------------------------------------------------- */

  const fallbackStartDate = parseDateValue(
    data.startDate
  );

  if (fallbackStartDate) {
    return fallbackStartDate;
  }

  return null;
}

/**
 * Gets the contest window period in DAYS.
 *
 * Supports several likely backend property names.
 *
 * Example:
 * windowPeriod = 3
 *
 * means:
 * Start: Sept 4
 * End:   Sept 6
 */
function getContestWindowDays(
  contest: SolveAndWinContest
): number | null {
  const data = contest as unknown as Record<
    string,
    unknown
  >;

  const candidates = [
    data.windowPeriod,
    data.windowDays,
    data.durationDays,
    data.contestDurationDays,
    data.participationWindowDays,
    data.registrationWindowDays,
    data.duration,
  ];

  for (const value of candidates) {
    if (
      typeof value === "number" &&
      Number.isFinite(value) &&
      value > 0
    ) {
      return Math.floor(value);
    }

    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      const parsed = Number(value);

      if (
        Number.isFinite(parsed) &&
        parsed > 0
      ) {
        return Math.floor(parsed);
      }
    }

    /*
     * Some APIs may return:
     *
     * { days: 3 }
     */
    if (
      typeof value === "object" &&
      value !== null
    ) {
      const objectValue =
        value as Record<string, unknown>;

      const nestedDays =
        objectValue.days ??
        objectValue.durationDays ??
        objectValue.value;

      const parsed = Number(nestedDays);

      if (
        Number.isFinite(parsed) &&
        parsed > 0
      ) {
        return Math.floor(parsed);
      }
    }
  }

  return null;
}

/**
 * Calculates the END of the contest window.
 *
 * If:
 *
 * start = Sept 4, 1:00 AM
 * window = 3 days
 *
 * contest remains active until:
 *
 * Sept 7, 1:00 AM
 *
 * This means the contest is available for a full
 * three-day period.
 */
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

/**
 * Countdown helper.
 */
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

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/* ============================================================
   PAGE
   ============================================================ */

export default function StartContestPage() {
  const router = useRouter();
  const params = useParams();

  const contestId = params?.contestId as
    | string
    | undefined;

  const [contest, setContest] =
    useState<SolveAndWinContest | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isStarting, setIsStarting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Live clock.
   *
   * This is important because the page does not need
   * to be refreshed when the contest becomes live or
   * when the contest window expires.
   */
  const [now, setNow] = useState(
    () => Date.now()
  );

  /* ==========================================================
     LOAD CONTEST
     ========================================================== */

  useEffect(() => {
    const loadContest = async () => {
      if (!contestId) {
        setError(
          "Contest information could not be found."
        );

        setIsLoading(false);

        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response =
          await getAllActiveContests();

        if (!response.success) {
          throw new Error(
            response.message ||
              "Unable to load contest information."
          );
        }

        const contests: SolveAndWinContest[] =
          response.data ?? [];

        const foundContest = contests.find(
          (item) =>
            item._id === contestId
        );

        if (!foundContest) {
          setError(
            "This contest could not be found or is no longer available."
          );

          return;
        }

        console.log(
          "Solve & Win contest data:",
          foundContest
        );

        const raw =
          foundContest as unknown as Record<
            string,
            unknown
          >;

        console.log(
          "Contest schedule fields:",
          {
            scheduledStartAt:
              raw.scheduledStartAt,

            scheduledStartDateTime:
              raw.scheduledStartDateTime,

            scheduledStart:
              raw.scheduledStart,

            startAt: raw.startAt,

            startsAt: raw.startsAt,

            startDateTime:
              raw.startDateTime,

            scheduledDate:
              raw.scheduledDate,

            scheduledTime:
              raw.scheduledTime,

            scheduledStartDate:
              raw.scheduledStartDate,

            scheduledStartTime:
              raw.scheduledStartTime,

            startDate: raw.startDate,

            startTime: raw.startTime,

            windowPeriod:
              raw.windowPeriod,

            windowDays:
              raw.windowDays,

            durationDays:
              raw.durationDays,

            contestDurationDays:
              raw.contestDurationDays,
          }
        );

        setContest(foundContest);
      } catch (err: unknown) {
        console.error(
          "Failed to load contest:",
          err
        );

        const apiError = err as {
          response?: {
            data?: {
              message?: unknown;
              error?: unknown;
            };
          };
          message?: unknown;
        };

        const message =
          apiError?.response?.data
            ?.message ||
          apiError?.response?.data?.error ||
          apiError?.message ||
          "Unable to load contest information. Please try again.";

        setError(
          Array.isArray(message)
            ? message.join(", ")
            : String(message)
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadContest();
  }, [contestId]);

  /* ==========================================================
     LIVE CLOCK
     ========================================================== */

  useEffect(() => {
    const timer = window.setInterval(() => {
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

      if (!startDate || !windowDays) {
        return {
          startDate,
          endDate: null,
          windowDays,
        };
      }

      const endDate = calculateEndDate(
        startDate,
        windowDays
      );

      return {
        startDate,
        endDate,
        windowDays,
      };
    }, [contest]);

  const startDate = schedule.startDate;
  const endDate = schedule.endDate;
  const windowDays = schedule.windowDays;

  const startTimestamp = startDate
    ? startDate.getTime()
    : null;

  const endTimestamp = endDate
    ? endDate.getTime()
    : null;

  /* ==========================================================
     CONTEST STATE
     ========================================================== */

  /*
   * BEFORE START
   *
   * Example:
   *
   * start = Sept 10
   * now   = Sept 6
   *
   * false
   */
  const hasStarted =
    startTimestamp !== null &&
    now >= startTimestamp;

  /*
   * WINDOW STILL ACTIVE
   *
   * This is the important new condition.
   *
   * The contestant can continue seeing the contest
   * after the starting date has passed as long as
   * the window has not expired.
   */
  const isWithinWindow =
    startTimestamp !== null &&
    endTimestamp !== null &&
    now >= startTimestamp &&
    now < endTimestamp;

  /*
   * WINDOW EXPIRED
   */
  const hasEnded =
    endTimestamp !== null &&
    now >= endTimestamp;

  /*
   * BEFORE START
   */
  const hasNotStarted =
    startTimestamp !== null &&
    now < startTimestamp;

  /* ==========================================================
     COUNTDOWN
     ========================================================== */

  const countdown = useMemo(() => {
    /*
     * Before contest starts:
     * countdown to START.
     */
    if (
      startDate &&
      now < startDate.getTime()
    ) {
      return getCountdown(
        startDate,
        now
      );
    }

    /*
     * Contest is already live:
     * countdown to END.
     */
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

  const handleStartContest = () => {
    if (isStarting || !contestId) {
      return;
    }

    const currentTime = Date.now();

    /*
     * Always perform the check again using the
     * current browser timestamp.
     */

    if (
      startTimestamp === null
    ) {
      setError(
        "The contest start time could not be determined."
      );

      return;
    }

    /*
     * Contest has not started yet.
     */
    if (
      currentTime < startTimestamp
    ) {
      setError(
        "This contest has not started yet. Please wait until the scheduled start time."
      );

      setNow(currentTime);

      return;
    }

    /*
     * Contest window has expired.
     */
    if (
      endTimestamp !== null &&
      currentTime >= endTimestamp
    ) {
      setError(
        "This contest window has ended. You can no longer enter this contest."
      );

      setNow(currentTime);

      return;
    }

    /*
     * Contest is live.
     */
    setIsStarting(true);
    setError(null);

    router.replace(
      `/student/solve-and-win/contests/${contestId}/play`
    );
  };

  /* ==========================================================
     LOADING
     ========================================================== */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Preparing Contest
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Checking the contest schedule...
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

  /* ==========================================================
     NO START DATE
     ========================================================== */

  if (!startDate) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
              <Clock3 className="h-7 w-7 text-amber-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Contest Schedule Unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We could not determine when this
              contest is scheduled to start.
              Please try again later.
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

  /* ==========================================================
     NO WINDOW PERIOD
     ========================================================== */

  if (!windowDays || !endDate) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
          <Card className="w-full rounded-3xl border-0 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
              <CalendarDays className="h-7 w-7 text-amber-600" />
            </div>

            <h1 className="mt-5 text-xl font-black text-slate-900">
              Contest Window Unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The contest start date was found, but
              the participation window could not be
              determined.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>
                Start Date
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {formatDateTime(startDate)}
              </p>
            </div>

            <Link
              href="/student/solve-and-win"
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

  /* ==========================================================
     MAIN PAGE
     ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/student/solve-and-win"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Contests
        </Link>

        {/* =====================================================
            STATUS HEADER
           ===================================================== */}

        <div className="mb-8">

          {/* BEFORE START */}
          {hasNotStarted && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <Clock3 className="h-3.5 w-3.5" />
              Contest Starts Soon
            </div>
          )}

          {/* LIVE */}
          {isWithinWindow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Contest is Live
            </div>
          )}

          {/* ENDED */}
          {hasEnded && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
              <XCircle className="h-3.5 w-3.5" />
              Contest Ended
            </div>
          )}

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">

            {hasNotStarted &&
              "Get Ready"}

            {isWithinWindow &&
              "Contest is Live"}

            {hasEnded &&
              "Contest Has Ended"}

          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">

            {hasNotStarted &&
              "The contest has not started yet. You will be able to enter when the scheduled start time arrives."}

            {isWithinWindow &&
              "The contest has started and the participation window is still open. You can enter now."}

            {hasEnded &&
              "The participation window for this contest has ended. This contest can no longer be entered."}

          </p>
        </div>

        {/* =====================================================
            CONTEST CARD
           ===================================================== */}

        <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-sm">

          {/* Contest Header */}
          <div
            className={`p-6 text-white sm:p-8 ${
              isWithinWindow
                ? "bg-emerald-700"
                : hasEnded
                ? "bg-slate-700"
                : "bg-slate-900"
            }`}
          >
            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <Trophy className="h-7 w-7" />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Solve & Win Contest
                </p>

                <h2 className="mt-1 text-xl font-black sm:text-2xl">
                  {contest.title}
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/70">
                  {contest.description ||
                    "Compete against other students and answer the contest questions to win rewards."}
                </p>

              </div>

            </div>
          </div>

          <div className="p-6 sm:p-8">

            {/* =================================================
                BEFORE START
               ================================================= */}

            {hasNotStarted && (
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">

                <div className="text-center">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                    <Clock3 className="h-6 w-6 text-blue-600" />
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-widest text-blue-600">
                    Contest Starts In
                  </p>

                  <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">

                    <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
                      <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {pad(countdown.days)}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                        Days
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
                      <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {pad(countdown.hours)}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                        Hours
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
                      <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {pad(countdown.minutes)}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                        Minutes
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
                      <p className="text-2xl font-black text-slate-900 sm:text-3xl">
                        {pad(countdown.seconds)}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                        Seconds
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 text-sm text-slate-500">
                    Starts{" "}
                    <span className="font-bold text-slate-700">
                      {formatDateTime(startDate)}
                    </span>
                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                LIVE CONTEST
               ================================================= */}

            {isWithinWindow && (
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">

                <div className="text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-widest text-emerald-600">
                    Contest is Live
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-slate-900">
                    You can enter now!
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                    The scheduled start time has
                    passed, but the contest window is
                    still open.
                  </p>

                  {/* Remaining Window */}
                  <div className="mt-6 rounded-2xl bg-white p-4">

                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Time Remaining
                    </p>

                    <div className="mt-3 grid grid-cols-4 gap-2">

                      <div>
                        <p className="text-xl font-black text-slate-900">
                          {pad(countdown.days)}
                        </p>

                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Days
                        </p>
                      </div>

                      <div>
                        <p className="text-xl font-black text-slate-900">
                          {pad(countdown.hours)}
                        </p>

                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Hours
                        </p>
                      </div>

                      <div>
                        <p className="text-xl font-black text-slate-900">
                          {pad(countdown.minutes)}
                        </p>

                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Minutes
                        </p>
                      </div>

                      <div>
                        <p className="text-xl font-black text-slate-900">
                          {pad(countdown.seconds)}
                        </p>

                        <p className="text-[10px] font-bold uppercase text-slate-400">
                          Seconds
                        </p>
                      </div>

                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      Window closes{" "}
                      <span className="font-bold text-slate-700">
                        {formatDateTime(endDate)}
                      </span>
                    </p>

                  </div>

                </div>
              </div>
            )}

            {/* =================================================
                ENDED
               ================================================= */}

            {hasEnded && (
              <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white">
                  <XCircle className="h-7 w-7 text-red-600" />
                </div>

                <p className="mt-4 text-xs font-black uppercase tracking-widest text-red-600">
                  Contest Ended
                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Participation window closed
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  This contest started on{" "}
                  <span className="font-bold">
                    {formatDateTime(startDate)}
                  </span>{" "}
                  and the participation window ended
                  on{" "}
                  <span className="font-bold">
                    {formatDateTime(endDate)}
                  </span>
                  .
                </p>

              </div>
            )}

            {/* =================================================
                CONTEST INFORMATION
               ================================================= */}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              {/* Start */}
              <div className="rounded-2xl border border-slate-100 p-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Starts
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {formatDateTime(startDate)}
                </p>

              </div>

              {/* Window */}
              <div className="rounded-2xl border border-slate-100 p-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                  <Clock3 className="h-5 w-5 text-violet-600" />
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Window Period
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {windowDays}{" "}
                  {windowDays === 1
                    ? "Day"
                    : "Days"}
                </p>

              </div>

              {/* Ends */}
              <div className="rounded-2xl border border-slate-100 p-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <CalendarDays className="h-5 w-5 text-red-600" />
                </div>

                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Window Ends
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {formatDateTime(endDate)}
                </p>

              </div>

            </div>

            {/* =================================================
                WINDOW SUMMARY
               ================================================= */}

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">

              <div className="flex items-start gap-3">

                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                <div>

                  <p className="text-sm font-bold text-slate-900">
                    Contest Participation Window
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Students can enter this contest
                    from{" "}
                    <span className="font-bold text-slate-900">
                      {formatDateTime(startDate)}
                    </span>{" "}
                    until{" "}
                    <span className="font-bold text-slate-900">
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

            {/* =================================================
                NOTICE
               ================================================= */}

            <div
              className={`mt-6 flex gap-3 rounded-2xl border p-4 ${
                isWithinWindow
                  ? "border-emerald-100 bg-emerald-50"
                  : hasEnded
                  ? "border-red-100 bg-red-50"
                  : "border-amber-100 bg-amber-50"
              }`}
            >

              {isWithinWindow && (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              )}

              {hasNotStarted && (
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              )}

              {hasEnded && (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              )}

              <div>

                <p
                  className={`text-sm font-bold ${
                    isWithinWindow
                      ? "text-emerald-900"
                      : hasEnded
                      ? "text-red-900"
                      : "text-amber-900"
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
                      ? "text-emerald-800"
                      : hasEnded
                      ? "text-red-800"
                      : "text-amber-800"
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

            {/* =================================================
                ERROR
               ================================================= */}

            {error && (
              <div className="mt-6 flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <div>

                  <p className="text-sm font-bold text-red-900">
                    Unable to continue
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    {error}
                  </p>

                </div>

              </div>
            )}

            {/* =================================================
                ACTIONS
               ================================================= */}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

              <Link
                href="/student/solve-and-win"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Contests
              </Link>

              {/* =================================================
                  START BUTTON
                 ================================================= */}

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
                className={`h-12 rounded-xl px-7 font-bold ${
                  isWithinWindow
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "cursor-not-allowed bg-slate-200 text-slate-400 hover:bg-slate-200"
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

        {/* =====================================================
            FOOTER
           ===================================================== */}

        <div className="mt-5 text-center">

          <p className="text-xs text-slate-400">
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
