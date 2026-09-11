


// //Csrc\app\admin\(admin)\secondary\solveandwin\competitions\[contestId]\manage\page.tsx



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import {
//   AlertCircle,
//   ArrowLeft,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   Edit3,
//   Loader2,
//   Save,
//   Trophy,
//   Users,
//   X,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// import {
//   getContestById,
//   updateContestById,
//   type SolveAndWinContest,
//   type ContestSubject,
//   type UpdateContestPayload,
// } from "@/lib/api/solveAndWin";

// /* -------------------------------------------------------------------------- */
// /* Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// function formatDateForInput(value?: string): string {
//   if (!value) {
//     return "";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "";
//   }

//   const year = date.getFullYear();

//   const month = String(date.getMonth() + 1).padStart(2, "0");

//   const day = String(date.getDate()).padStart(2, "0");

//   const hours = String(date.getHours()).padStart(2, "0");

//   const minutes = String(date.getMinutes()).padStart(2, "0");

//   return `${year}-${month}-${day}T${hours}:${minutes}`;
// }

// function getSubjectName(subject: ContestSubject): string {
//   if (typeof subject.subjectId === "object") {
//     return subject.subjectId.name || "Unknown Subject";
//   }

//   return subject.subjectId || "Unknown Subject";
// }

// function getSubjectId(subject: ContestSubject): string {
//   if (typeof subject.subjectId === "string") {
//     return subject.subjectId;
//   }

//   return subject.subjectId?._id || "";
// }

// /* -------------------------------------------------------------------------- */
// /* Page                                                                       */
// /* -------------------------------------------------------------------------- */

// export default function ManageSolveAndWinContestPage() {
//   const params = useParams();
//   const router = useRouter();

//   /* ------------------------------------------------------------------------ */
//   /* Contest ID                                                               */
//   /* ------------------------------------------------------------------------ */

//   const contestId = useMemo(() => {
//     const value = params?.contestId;

//     if (Array.isArray(value)) {
//       return value[0] || "";
//     }

//     return value || "";
//   }, [params?.contestId]);

//   /* ------------------------------------------------------------------------ */
//   /* State                                                                    */
//   /* ------------------------------------------------------------------------ */

//   const [contest, setContest] =
//     useState<SolveAndWinContest | null>(null);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [duration, setDuration] = useState("");
//   const [maxParticipants, setMaxParticipants] = useState("");
//   const [rules, setRules] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* ------------------------------------------------------------------------ */
//   /* Load contest                                                             */
//   /* ------------------------------------------------------------------------ */

//   useEffect(() => {
//     if (!contestId) {
//       setLoading(false);
//       setError("Contest ID is missing.");
//       return;
//     }

//     let cancelled = false;

//     async function loadContest() {
//       try {
//         setLoading(true);
//         setError("");
//         setSuccess("");

//         const response = await getContestById(contestId);

//         if (cancelled) {
//           return;
//         }

//         if (!response?.data) {
//           throw new Error(
//             response?.message ||
//               "Contest data was not returned by the server.",
//           );
//         }

//         const loadedContest = response.data;

//         setContest(loadedContest);

//         setTitle(loadedContest.title || "");

//         setDescription(loadedContest.description || "");

//         setStartDate(
//           formatDateForInput(loadedContest.startDate),
//         );

//         setEndDate(
//           formatDateForInput(loadedContest.endDate),
//         );

//         /*
//          * The current SolveAndWinContest type does not define
//          * duration/maxParticipants/rules, so only populate these
//          * fields when the backend actually sends them.
//          */
//         const extendedContest = loadedContest as SolveAndWinContest & {
//           duration?: number;
//           durationInMinutes?: number;
//           maxParticipants?: number;
//           participantLimit?: number;
//           rules?: string;
//         };

//         const contestDuration =
//           extendedContest.duration ??
//           extendedContest.durationInMinutes;

//         setDuration(
//           contestDuration === undefined
//             ? ""
//             : String(contestDuration),
//         );

//         const participantLimit =
//           extendedContest.maxParticipants ??
//           extendedContest.participantLimit;

//         setMaxParticipants(
//           participantLimit === undefined
//             ? ""
//             : String(participantLimit),
//         );

//         setRules(extendedContest.rules || "");
//       } catch (err) {
//         console.error("Failed to load contest:", err);

//         if (!cancelled) {
//           setError(
//             err instanceof Error
//               ? err.message
//               : "Failed to load contest.",
//           );
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadContest();

//     return () => {
//       cancelled = true;
//     };
//   }, [contestId]);

//   /* ------------------------------------------------------------------------ */
//   /* Save contest                                                             */
//   /* ------------------------------------------------------------------------ */

//   async function handleSubmit(
//     event: React.SyntheticEvent<HTMLFormElement>,
//   ) {
//     event.preventDefault();

//     if (!contestId) {
//       setError("Contest ID is missing.");
//       return;
//     }

//     if (!title.trim()) {
//       setError("Contest title is required.");
//       return;
//     }

//     try {
//       setSaving(true);
//       setError("");
//       setSuccess("");

//       const payload: UpdateContestPayload = {
//         title: title.trim(),
//         description: description.trim(),
//       };

//       /* -------------------------------------------------------------------- */
//       /* Start date                                                            */
//       /* -------------------------------------------------------------------- */

//       if (startDate) {
//         const parsedStartDate = new Date(startDate);

//         if (Number.isNaN(parsedStartDate.getTime())) {
//           setError("Please enter a valid start date.");
//           setSaving(false);
//           return;
//         }

//         payload.startDate = parsedStartDate.toISOString();
//       }

//       /* -------------------------------------------------------------------- */
//       /* End date                                                              */
//       /* -------------------------------------------------------------------- */

//       /*
//        * endDate is not part of CreateContestPayload, but the manage
//        * page supports it because it exists on the contest returned
//        * by the backend.
//        */
//       if (endDate) {
//         const parsedEndDate = new Date(endDate);

//         if (Number.isNaN(parsedEndDate.getTime())) {
//           setError("Please enter a valid end date.");
//           setSaving(false);
//           return;
//         }

//         if (startDate) {
//           const start = new Date(startDate).getTime();
//           const end = parsedEndDate.getTime();

//           if (end <= start) {
//             setError(
//               "End date must be after the start date.",
//             );
//             setSaving(false);
//             return;
//           }
//         }

//         (
//           payload as UpdateContestPayload & {
//             endDate?: string;
//           }
//         ).endDate = parsedEndDate.toISOString();
//       }

//       /* -------------------------------------------------------------------- */
//       /* Duration                                                              */
//       /* -------------------------------------------------------------------- */

//       if (duration !== "") {
//         const numericDuration = Number(duration);

//         if (
//           !Number.isFinite(numericDuration) ||
//           numericDuration <= 0
//         ) {
//           setError(
//             "Duration must be greater than zero.",
//           );
//           setSaving(false);
//           return;
//         }

//         (
//           payload as UpdateContestPayload & {
//             duration?: number;
//           }
//         ).duration = numericDuration;
//       }

//       /* -------------------------------------------------------------------- */
//       /* Maximum participants                                                  */
//       /* -------------------------------------------------------------------- */

//       if (maxParticipants !== "") {
//         const numericParticipants =
//           Number(maxParticipants);

//         if (
//           !Number.isFinite(numericParticipants) ||
//           numericParticipants <= 0
//         ) {
//           setError(
//             "Maximum participants must be greater than zero.",
//           );
//           setSaving(false);
//           return;
//         }

//         (
//           payload as UpdateContestPayload & {
//             maxParticipants?: number;
//           }
//         ).maxParticipants = numericParticipants;
//       }

//       /* -------------------------------------------------------------------- */
//       /* Rules                                                                 */
//       /* -------------------------------------------------------------------- */

//       (
//         payload as UpdateContestPayload & {
//           rules?: string;
//         }
//       ).rules = rules.trim();

//       /* -------------------------------------------------------------------- */
//       /* PATCH                                                                 */
//       /* -------------------------------------------------------------------- */

//       const response = await updateContestById(
//         contestId,
//         payload,
//       );

//       /*
//        * If the backend returns the updated contest,
//        * immediately update the page with it.
//        */
//       if (response?.data) {
//         const updatedContest = response.data;

//         setContest(updatedContest);

//         setTitle(updatedContest.title || title);

//         setDescription(
//           updatedContest.description ?? description,
//         );

//         if (updatedContest.startDate) {
//           setStartDate(
//             formatDateForInput(
//               updatedContest.startDate,
//             ),
//           );
//         }

//         const extendedUpdatedContest =
//           updatedContest as SolveAndWinContest & {
//             endDate?: string;
//             duration?: number;
//             durationInMinutes?: number;
//             maxParticipants?: number;
//             participantLimit?: number;
//             rules?: string;
//           };

//         if (extendedUpdatedContest.endDate) {
//           setEndDate(
//             formatDateForInput(
//               extendedUpdatedContest.endDate,
//             ),
//           );
//         }

//         const updatedDuration =
//           extendedUpdatedContest.duration ??
//           extendedUpdatedContest.durationInMinutes;

//         if (updatedDuration !== undefined) {
//           setDuration(String(updatedDuration));
//         }

//         const updatedParticipants =
//           extendedUpdatedContest.maxParticipants ??
//           extendedUpdatedContest.participantLimit;

//         if (updatedParticipants !== undefined) {
//           setMaxParticipants(
//             String(updatedParticipants),
//           );
//         }

//         if (extendedUpdatedContest.rules !== undefined) {
//           setRules(extendedUpdatedContest.rules);
//         }
//       }

//       setSuccess(
//         response?.message ||
//           "Contest updated successfully.",
//       );
//     } catch (err) {
//       console.error(
//         "Failed to update contest:",
//         err,
//       );

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to update contest.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Loading state                                                             */
//   /* ------------------------------------------------------------------------ */

//   if (loading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center p-6">
//         <div className="flex items-center gap-3 text-sm text-muted-foreground">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           <span>Loading contest...</span>
//         </div>
//       </div>
//     );
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Contest unavailable                                                       */
//   /* ------------------------------------------------------------------------ */

//   if (!contest) {
//     return (
//       <div className="space-y-6 p-4 md:p-6">
//         <Link
//           href="/admin/secondary/solveandwin/competitions"
//           className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to competitions
//         </Link>

//         <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
//           <div className="flex items-start gap-3">
//             <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

//             <div>
//               <h2 className="font-semibold">
//                 Unable to load contest
//               </h2>

//               <p className="mt-1 text-sm text-muted-foreground">
//                 {error ||
//                   "The requested contest could not be found."}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ------------------------------------------------------------------------ */
//   /* Derived values                                                            */
//   /* ------------------------------------------------------------------------ */

//   const subjects = contest.subjects || [];

//   const status = contest.status || "DRAFT";

//   const participantLimit = (
//     contest as SolveAndWinContest & {
//       maxParticipants?: number;
//       participantLimit?: number;
//     }
//   ).maxParticipants ??
//     (
//       contest as SolveAndWinContest & {
//         participantLimit?: number;
//       }
//     ).participantLimit;

//   const contestDuration = (
//     contest as SolveAndWinContest & {
//       duration?: number;
//       durationInMinutes?: number;
//     }
//   ).duration ??
//     (
//       contest as SolveAndWinContest & {
//         durationInMinutes?: number;
//       }
//     ).durationInMinutes;

//   /* ------------------------------------------------------------------------ */
//   /* UI                                                                        */
//   /* ------------------------------------------------------------------------ */

//   return (
//     <div className="space-y-6 p-4 md:p-6">
//       {/* ================================================================== */}
//       {/* Header                                                             */}
//       {/* ================================================================== */}

//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div className="flex items-start gap-3">
//           <Link
//             href="/admin/secondary/solveandwin/competitions"
//             className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
//             aria-label="Back to competitions"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Link>

//           <div>
//             <div className="flex flex-wrap items-center gap-2">
//               <h1 className="text-2xl font-bold tracking-tight">
//                 Manage Contest
//               </h1>

//               <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
//                 {status.toLowerCase()}
//               </span>
//             </div>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Edit contest configuration, schedule and rules.
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() =>
//               router.push(
//                 "/admin/secondary/solveandwin/competitions",
//               )
//             }
//           >
//             <X className="mr-2 h-4 w-4" />
//             Cancel
//           </Button>

//           <Button
//             type="submit"
//             form="contest-management-form"
//             disabled={saving}
//           >
//             {saving ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Save className="mr-2 h-4 w-4" />
//                 Save Changes
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* ================================================================== */}
//       {/* Alerts                                                             */}
//       {/* ================================================================== */}

//       {error && (
//         <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
//           <div className="flex items-start gap-3">
//             <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

//             <div>
//               <p className="font-medium text-destructive">
//                 Something went wrong
//               </p>

//               <p className="mt-1 text-sm text-muted-foreground">
//                 {error}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
//           <div className="flex items-start gap-3">
//             <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

//             <div>
//               <p className="font-medium text-green-700 dark:text-green-400">
//                 Success
//               </p>

//               <p className="mt-1 text-sm text-muted-foreground">
//                 {success}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================================================================== */}
//       {/* Summary cards                                                      */}
//       {/* ================================================================== */}

//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {/* Status */}

//         <div className="rounded-xl border bg-card p-5 shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <Trophy className="h-5 w-5 text-primary" />
//             </div>

//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Status
//               </p>

//               <p className="font-semibold capitalize">
//                 {status.toLowerCase()}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Participants */}

//         <div className="rounded-xl border bg-card p-5 shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <Users className="h-5 w-5 text-primary" />
//             </div>

//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Participants
//               </p>

//               <p className="font-semibold">
//                 {participantLimit ?? "Unlimited"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Duration */}

//         <div className="rounded-xl border bg-card p-5 shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <Clock3 className="h-5 w-5 text-primary" />
//             </div>

//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Duration
//               </p>

//               <p className="font-semibold">
//                 {contestDuration ?? "—"}

//                 {contestDuration ? " mins" : ""}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Subjects */}

//         <div className="rounded-xl border bg-card p-5 shadow-sm">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
//               <CalendarDays className="h-5 w-5 text-primary" />
//             </div>

//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Subjects
//               </p>

//               <p className="font-semibold">
//                 {subjects.length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================================================================== */}
//       {/* Main content                                                       */}
//       {/* ================================================================== */}

//       <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
//         {/* ================================================================= */}
//         {/* Edit form                                                         */}
//         {/* ================================================================= */}

//         <div className="rounded-xl border bg-card shadow-sm">
//           <div className="border-b p-5">
//             <div className="flex items-center gap-2">
//               <Edit3 className="h-5 w-5 text-primary" />

//               <h2 className="font-semibold">
//                 Contest Configuration
//               </h2>
//             </div>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Update the information students will see for this
//               contest.
//             </p>
//           </div>

//           <div className="p-5">
//             <form
//               id="contest-management-form"
//               onSubmit={handleSubmit}
//               className="space-y-6"
//             >
//               {/* ---------------------------------------------------------- */}
//               {/* Basic information                                           */}
//               {/* ---------------------------------------------------------- */}

//               <div className="space-y-4">
//                 <div>
//                   <label
//                     htmlFor="contest-title"
//                     className="text-sm font-medium"
//                   >
//                     Contest Title
//                   </label>

//                   <Input
//                     id="contest-title"
//                     value={title}
//                     onChange={(event) =>
//                       setTitle(event.target.value)
//                     }
//                     placeholder="Enter contest title"
//                     className="mt-2"
//                     disabled={saving}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="contest-description"
//                     className="text-sm font-medium"
//                   >
//                     Description
//                   </label>

//                   <Textarea
//                     id="contest-description"
//                     value={description}
//                     onChange={(event) =>
//                       setDescription(event.target.value)
//                     }
//                     placeholder="Describe this Solve & Win contest"
//                     rows={5}
//                     className="mt-2"
//                     disabled={saving}
//                   />
//                 </div>
//               </div>

//               {/* ---------------------------------------------------------- */}
//               {/* Schedule                                                     */}
//               {/* ---------------------------------------------------------- */}

//               <div className="border-t pt-6">
//                 <h3 className="mb-4 font-semibold">
//                   Contest Schedule
//                 </h3>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="start-date"
//                       className="text-sm font-medium"
//                     >
//                       Start Date
//                     </label>

//                     <Input
//                       id="start-date"
//                       type="datetime-local"
//                       value={startDate}
//                       onChange={(event) =>
//                         setStartDate(event.target.value)
//                       }
//                       className="mt-2"
//                       disabled={saving}
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="end-date"
//                       className="text-sm font-medium"
//                     >
//                       End Date
//                     </label>

//                     <Input
//                       id="end-date"
//                       type="datetime-local"
//                       value={endDate}
//                       onChange={(event) =>
//                         setEndDate(event.target.value)
//                       }
//                       className="mt-2"
//                       disabled={saving}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* ---------------------------------------------------------- */}
//               {/* Settings                                                     */}
//               {/* ---------------------------------------------------------- */}

//               <div className="border-t pt-6">
//                 <h3 className="mb-4 font-semibold">
//                   Contest Settings
//                 </h3>

//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="duration"
//                       className="text-sm font-medium"
//                     >
//                       Duration (minutes)
//                     </label>

//                     <Input
//                       id="duration"
//                       type="number"
//                       min="1"
//                       value={duration}
//                       onChange={(event) =>
//                         setDuration(event.target.value)
//                       }
//                       placeholder="e.g. 30"
//                       className="mt-2"
//                       disabled={saving}
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="max-participants"
//                       className="text-sm font-medium"
//                     >
//                       Maximum Participants
//                     </label>

//                     <Input
//                       id="max-participants"
//                       type="number"
//                       min="1"
//                       value={maxParticipants}
//                       onChange={(event) =>
//                         setMaxParticipants(
//                           event.target.value,
//                         )
//                       }
//                       placeholder="Leave empty for unlimited"
//                       className="mt-2"
//                       disabled={saving}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* ---------------------------------------------------------- */}
//               {/* Rules                                                        */}
//               {/* ---------------------------------------------------------- */}

//               <div className="border-t pt-6">
//                 <label
//                   htmlFor="contest-rules"
//                   className="text-sm font-medium"
//                 >
//                   Contest Rules
//                 </label>

//                 <Textarea
//                   id="contest-rules"
//                   value={rules}
//                   onChange={(event) =>
//                     setRules(event.target.value)
//                   }
//                   placeholder="Enter the rules students should follow..."
//                   rows={8}
//                   className="mt-2"
//                   disabled={saving}
//                 />
//               </div>

//               {/* ---------------------------------------------------------- */}
//               {/* Save                                                         */}
//               {/* ---------------------------------------------------------- */}

//               <div className="flex justify-end border-t pt-6">
//                 <Button
//                   type="submit"
//                   disabled={saving}
//                   className="min-w-[160px]"
//                 >
//                   {saving ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="mr-2 h-4 w-4" />
//                       Save Changes
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* ================================================================= */}
//         {/* Subjects                                                          */}
//         {/* ================================================================= */}

//         <div className="h-fit rounded-xl border bg-card shadow-sm">
//           <div className="border-b p-5">
//             <h2 className="font-semibold">
//               Contest Subjects
//             </h2>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Subjects configured for this contest.
//             </p>
//           </div>

//           <div className="space-y-3 p-5">
//             {subjects.length === 0 ? (
//               <div className="rounded-lg border border-dashed p-5 text-center">
//                 <p className="text-sm font-medium">
//                   No subjects configured
//                 </p>

//                 <p className="mt-1 text-xs text-muted-foreground">
//                   Subjects can be configured when creating or
//                   editing the contest.
//                 </p>
//               </div>
//             ) : (
//               subjects.map((subject, index) => {
//                 const subjectId = getSubjectId(subject);

//                 return (
//                   <div
//                     key={subjectId || index}
//                     className="rounded-lg border p-4"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <p className="font-medium">
//                           {getSubjectName(subject)}
//                         </p>

//                         {subject.questions?.length !==
//                           undefined && (
//                           <p className="mt-1 text-xs text-muted-foreground">
//                             {subject.questions.length} questions
//                           </p>
//                         )}
//                       </div>

//                       <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
//                         {index + 1}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })
//             )}

//             <div className="border-t pt-4">
//               <p className="text-xs leading-5 text-muted-foreground">
//                 Student-specific operations such as starting a
//                 subject, saving answers and updating remaining
//                 time belong to the student contest play page.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================================================================== */}
//       {/* Contest information                                                */}
//       {/* ================================================================== */}

//       <div className="rounded-xl border bg-card shadow-sm">
//         <div className="border-b p-5">
//           <h2 className="font-semibold">
//             Contest Information
//           </h2>
//         </div>

//         <div className="p-5">
//           <div className="grid gap-5 text-sm md:grid-cols-2">
//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Contest ID
//               </p>

//               <p className="mt-1 break-all font-mono text-xs">
//                 {contest._id || contestId}
//               </p>
//             </div>

//             <div>
//               <p className="text-xs text-muted-foreground">
//                 Current Status
//               </p>

//               <p className="mt-1 capitalize">
//                 {status.toLowerCase()}
//               </p>
//             </div>

//             {contest.createdAt && (
//               <div>
//                 <p className="text-xs text-muted-foreground">
//                   Created
//                 </p>

//                 <p className="mt-1">
//                   {new Date(
//                     contest.createdAt,
//                   ).toLocaleString()}
//                 </p>
//               </div>
//             )}

//             {contest.updatedAt && (
//               <div>
//                 <p className="text-xs text-muted-foreground">
//                   Last Updated
//                 </p>

//                 <p className="mt-1">
//                   {new Date(
//                     contest.updatedAt,
//                   ).toLocaleString()}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Loader2,
  Save,
  Trophy,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  getContestById,
  updateContestById,
  updateSolveAndWinContestQuestionRemainingTime,
} from "@/lib/api/solveAndWin";

import type {
  SolveAndWinContest,
  ContestSubject,
  UpdateContestPayload,
} from "@/lib/api/solveAndWin";

/* -------------------------------------------------------------------------- */
/* Extended backend fields                                                    */
/* -------------------------------------------------------------------------- */

type ExtendedContest = SolveAndWinContest & {
  duration?: number;
  durationInMinutes?: number;
  maxParticipants?: number;
  participantLimit?: number;
  rules?: string;
};

type SubjectRemainingTime = Record<string, string>;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDateForInput(value?: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getSubjectName(subject: ContestSubject): string {
  if (typeof subject.subjectId === "object") {
    return subject.subjectId.name || "Unknown Subject";
  }

  return subject.subjectId || "Unknown Subject";
}

function getSubjectId(subject: ContestSubject): string {
  if (typeof subject.subjectId === "string") {
    return subject.subjectId;
  }

  return subject.subjectId?._id || "";
}

function formatSeconds(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ManageSolveAndWinContestPage() {
  const params = useParams();
  const router = useRouter();

  /* ------------------------------------------------------------------------ */
  /* Contest ID                                                               */
  /* ------------------------------------------------------------------------ */

  const contestId = useMemo(() => {
    const value = params?.contestId;

    if (Array.isArray(value)) {
      return value[0] || "";
    }

    return value || "";
  }, [params?.contestId]);

  /* ------------------------------------------------------------------------ */
  /* State                                                                    */
  /* ------------------------------------------------------------------------ */

  const [contest, setContest] =
    useState<SolveAndWinContest | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [rules, setRules] = useState("");

  const [remainingTimes, setRemainingTimes] =
    useState<SubjectRemainingTime>({});

  const [savingRemainingTime, setSavingRemainingTime] =
    useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Load contest                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!contestId) {
      setLoading(false);
      setError("Contest ID is missing.");
      return;
    }

    let cancelled = false;

    async function loadContest() {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const response = await getContestById(contestId);

        if (cancelled) {
          return;
        }

        if (!response?.data) {
          throw new Error(
            response?.message ||
              "Contest data was not returned by the server.",
          );
        }

        const loadedContest = response.data;

        setContest(loadedContest);

        setTitle(loadedContest.title || "");
        setDescription(loadedContest.description || "");

        setStartDate(
          formatDateForInput(loadedContest.startDate),
        );

        setEndDate(
          formatDateForInput(loadedContest.endDate),
        );

        const extendedContest =
          loadedContest as ExtendedContest;

        const contestDuration =
          extendedContest.duration ??
          extendedContest.durationInMinutes;

        setDuration(
          contestDuration === undefined
            ? ""
            : String(contestDuration),
        );

        const participantLimit =
          extendedContest.maxParticipants ??
          extendedContest.participantLimit;

        setMaxParticipants(
          participantLimit === undefined
            ? ""
            : String(participantLimit),
        );

        setRules(extendedContest.rules || "");

        /*
         * If the backend already returns remaining-time information
         * on each subject, initialise it here.
         *
         * The page does not assume a particular backend field name.
         * It checks common possibilities safely.
         */
        const initialRemainingTimes: SubjectRemainingTime = {};

        for (const subject of loadedContest.subjects || []) {
          const subjectId = getSubjectId(subject);

          if (!subjectId) {
            continue;
          }

          const extendedSubject = subject as ContestSubject & {
            remainingTime?: number;
            remainingTimeInSeconds?: number;
            remainingSeconds?: number;
          };

          const remainingTime =
            extendedSubject.remainingTime ??
            extendedSubject.remainingTimeInSeconds ??
            extendedSubject.remainingSeconds;

          if (remainingTime !== undefined) {
            initialRemainingTimes[subjectId] =
              String(remainingTime);
          }
        }

        setRemainingTimes(initialRemainingTimes);
      } catch (err) {
        console.error("Failed to load contest:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load contest.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadContest();

    return () => {
      cancelled = true;
    };
  }, [contestId]);

  /* ------------------------------------------------------------------------ */
  /* Save contest                                                             */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!contestId) {
      setError("Contest ID is missing.");
      return;
    }

    /*
     * The backend currently allows contest configuration updates
     * only while the contest is in DRAFT status.
     */
    if (contest?.status?.toUpperCase() !== "DRAFT") {
      setError(
        "This contest can no longer be modified because it is not in draft status.",
      );
      return;
    }

    if (!title.trim()) {
      setError("Contest title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: UpdateContestPayload = {
        title: title.trim(),
        description: description.trim(),
      };

      /* -------------------------------------------------------------------- */
      /* Start date                                                            */
      /* -------------------------------------------------------------------- */

      if (startDate) {
        const parsedStartDate = new Date(startDate);

        if (Number.isNaN(parsedStartDate.getTime())) {
          setError("Please enter a valid start date.");
          setSaving(false);
          return;
        }

        payload.startDate = parsedStartDate.toISOString();
      }

      /* -------------------------------------------------------------------- */
      /* End date                                                              */
      /* -------------------------------------------------------------------- */

      if (endDate) {
        const parsedEndDate = new Date(endDate);

        if (Number.isNaN(parsedEndDate.getTime())) {
          setError("Please enter a valid end date.");
          setSaving(false);
          return;
        }

        if (startDate) {
          const start = new Date(startDate).getTime();
          const end = parsedEndDate.getTime();

          if (end <= start) {
            setError(
              "End date must be after the start date.",
            );
            setSaving(false);
            return;
          }
        }

        (
          payload as UpdateContestPayload & {
            endDate?: string;
          }
        ).endDate = parsedEndDate.toISOString();
      }

      /* -------------------------------------------------------------------- */
      /* Duration                                                              */
      /* -------------------------------------------------------------------- */

      if (duration !== "") {
        const numericDuration = Number(duration);

        if (
          !Number.isFinite(numericDuration) ||
          numericDuration <= 0
        ) {
          setError(
            "Duration must be greater than zero.",
          );
          setSaving(false);
          return;
        }

        (
          payload as UpdateContestPayload & {
            duration?: number;
          }
        ).duration = numericDuration;
      }

      /* -------------------------------------------------------------------- */
      /* Maximum participants                                                 */
      /* -------------------------------------------------------------------- */

      if (maxParticipants !== "") {
        const numericParticipants =
          Number(maxParticipants);

        if (
          !Number.isFinite(numericParticipants) ||
          numericParticipants <= 0
        ) {
          setError(
            "Maximum participants must be greater than zero.",
          );
          setSaving(false);
          return;
        }

        (
          payload as UpdateContestPayload & {
            maxParticipants?: number;
          }
        ).maxParticipants = numericParticipants;
      }

      /* -------------------------------------------------------------------- */
      /* Rules                                                                 */
      /* -------------------------------------------------------------------- */

      (
        payload as UpdateContestPayload & {
          rules?: string;
        }
      ).rules = rules.trim();

      /* -------------------------------------------------------------------- */
      /* Update contest                                                        */
      /* -------------------------------------------------------------------- */

      const response = await updateContestById(
        contestId,
        payload,
      );

      if (response?.data) {
        const updatedContest = response.data;

        setContest(updatedContest);

        setTitle(updatedContest.title || title);

        setDescription(
          updatedContest.description ?? description,
        );

        if (updatedContest.startDate) {
          setStartDate(
            formatDateForInput(
              updatedContest.startDate,
            ),
          );
        }

        const extendedUpdatedContest =
          updatedContest as ExtendedContest & {
            endDate?: string;
          };

        if (extendedUpdatedContest.endDate) {
          setEndDate(
            formatDateForInput(
              extendedUpdatedContest.endDate,
            ),
          );
        }

        const updatedDuration =
          extendedUpdatedContest.duration ??
          extendedUpdatedContest.durationInMinutes;

        if (updatedDuration !== undefined) {
          setDuration(String(updatedDuration));
        }

        const updatedParticipants =
          extendedUpdatedContest.maxParticipants ??
          extendedUpdatedContest.participantLimit;

        if (updatedParticipants !== undefined) {
          setMaxParticipants(
            String(updatedParticipants),
          );
        }

        if (
          extendedUpdatedContest.rules !==
          undefined
        ) {
          setRules(extendedUpdatedContest.rules);
        }
      }

      setSuccess(
        response?.message ||
          "Contest updated successfully.",
      );
    } catch (err) {
      console.error(
        "Failed to update contest:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update contest.",
      );
    } finally {
      setSaving(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Remaining time input                                                     */
  /* ------------------------------------------------------------------------ */

  function handleRemainingTimeChange(
    subjectId: string,
    value: string,
  ) {
    setRemainingTimes((current) => ({
      ...current,
      [subjectId]: value,
    }));
  }

  /* ------------------------------------------------------------------------ */
  /* Update remaining time                                                    */
  /* ------------------------------------------------------------------------ */

  async function handleUpdateRemainingTime(
    subjectId: string,
  ) {
    if (!contestId) {
      setError("Contest ID is missing.");
      return;
    }

    if (!subjectId) {
      setError("Subject ID is missing.");
      return;
    }

    const rawValue =
      remainingTimes[subjectId] ?? "";

    const numericRemainingTime =
      Number(rawValue);

    if (
      rawValue.trim() === "" ||
      !Number.isFinite(
        numericRemainingTime,
      ) ||
      numericRemainingTime < 0
    ) {
      setError(
        "Remaining time must be zero or greater.",
      );
      return;
    }

    try {
      setSavingRemainingTime((current) => ({
        ...current,
        [subjectId]: true,
      }));

      setError("");
      setSuccess("");

      const response =
        await updateSolveAndWinContestQuestionRemainingTime(
          contestId,
          subjectId,
          {
            remainingTime:
              Math.floor(
                numericRemainingTime,
              ),
          },
        );

      setSuccess(
        response?.message ||
          "Remaining time updated successfully.",
      );
    } catch (err) {
      console.error(
        "Failed to update remaining time:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update remaining time.",
      );
    } finally {
      setSavingRemainingTime((current) => ({
        ...current,
        [subjectId]: false,
      }));
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Loading state                                                             */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading contest...</span>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Contest unavailable                                                       */
  /* ------------------------------------------------------------------------ */

  if (!contest) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Link
          href="/admin/secondary/solveandwin/competitions"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to competitions
        </Link>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <div>
              <h2 className="font-semibold">
                Unable to load contest
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {error ||
                  "The requested contest could not be found."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Derived values                                                            */
  /* ------------------------------------------------------------------------ */

  const subjects = contest.subjects || [];
  const status = contest.status || "DRAFT";

  const isDraft =
    status.toUpperCase() === "DRAFT";

  const participantLimit =
    (contest as ExtendedContest)
      .maxParticipants ??
    (contest as ExtendedContest)
      .participantLimit;

  const contestDuration =
    (contest as ExtendedContest).duration ??
    (contest as ExtendedContest)
      .durationInMinutes;

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ================================================================== */}
      {/* Header                                                             */}
      {/* ================================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/secondary/solveandwin/competitions"
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
            aria-label="Back to competitions"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Manage Contest
              </h1>

              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                {status.toLowerCase()}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Edit contest configuration, schedule,
              rules and live subject timing.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                "/admin/secondary/solveandwin/competitions",
              )
            }
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          <Button
            type="submit"
            form="contest-management-form"
            disabled={
              saving || !isDraft
            }
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Non-draft notice                                                   */}
      {/* ================================================================== */}

      {!isDraft && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div>
              <p className="font-medium text-amber-700 dark:text-amber-400">
                Contest configuration is locked
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                This contest is currently{" "}
                <span className="font-medium">
                  {status.toLowerCase()}
                </span>
                . The backend only allows contest
                configuration changes while the contest
                is in draft status.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* Alerts                                                             */}
      {/* ================================================================== */}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

            <div>
              <p className="font-medium text-destructive">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

            <div>
              <p className="font-medium text-green-700 dark:text-green-400">
                Success
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {success}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* Summary cards                                                      */}
      {/* ================================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Status
              </p>

              <p className="font-semibold capitalize">
                {status.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Participants */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Participants
              </p>

              <p className="font-semibold">
                {participantLimit ?? "Unlimited"}
              </p>
            </div>
          </div>
        </div>

        {/* Duration */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock3 className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Duration
              </p>

              <p className="font-semibold">
                {contestDuration ?? "—"}
                {contestDuration ? " mins" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Subjects */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Subjects
              </p>

              <p className="font-semibold">
                {subjects.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Main content                                                       */}
      {/* ================================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* ================================================================= */}
        {/* Edit form                                                         */}
        {/* ================================================================= */}

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b p-5">
            <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary" />

              <h2 className="font-semibold">
                Contest Configuration
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Update the information students will see
              for this contest.
            </p>
          </div>

          <div className="p-5">
            <form
              id="contest-management-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* ---------------------------------------------------------- */}
              {/* Basic information                                          */}
              {/* ---------------------------------------------------------- */}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="contest-title"
                    className="text-sm font-medium"
                  >
                    Contest Title
                  </label>

                  <Input
                    id="contest-title"
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value,
                      )
                    }
                    placeholder="Enter contest title"
                    className="mt-2"
                    disabled={
                      saving || !isDraft
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="contest-description"
                    className="text-sm font-medium"
                  >
                    Description
                  </label>

                  <Textarea
                    id="contest-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value,
                      )
                    }
                    placeholder="Describe this Solve & Win contest"
                    rows={5}
                    className="mt-2"
                    disabled={
                      saving || !isDraft
                    }
                  />
                </div>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Schedule                                                    */}
              {/* ---------------------------------------------------------- */}

              <div className="border-t pt-6">
                <h3 className="mb-4 font-semibold">
                  Contest Schedule
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="start-date"
                      className="text-sm font-medium"
                    >
                      Start Date
                    </label>

                    <Input
                      id="start-date"
                      type="datetime-local"
                      value={startDate}
                      onChange={(event) =>
                        setStartDate(
                          event.target.value,
                        )
                      }
                      className="mt-2"
                      disabled={
                        saving || !isDraft
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="end-date"
                      className="text-sm font-medium"
                    >
                      End Date
                    </label>

                    <Input
                      id="end-date"
                      type="datetime-local"
                      value={endDate}
                      onChange={(event) =>
                        setEndDate(
                          event.target.value,
                        )
                      }
                      className="mt-2"
                      disabled={
                        saving || !isDraft
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Settings                                                    */}
              {/* ---------------------------------------------------------- */}

              <div className="border-t pt-6">
                <h3 className="mb-4 font-semibold">
                  Contest Settings
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="duration"
                      className="text-sm font-medium"
                    >
                      Duration (minutes)
                    </label>

                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(event) =>
                        setDuration(
                          event.target.value,
                        )
                      }
                      placeholder="e.g. 30"
                      className="mt-2"
                      disabled={
                        saving || !isDraft
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="max-participants"
                      className="text-sm font-medium"
                    >
                      Maximum Participants
                    </label>

                    <Input
                      id="max-participants"
                      type="number"
                      min="1"
                      value={maxParticipants}
                      onChange={(event) =>
                        setMaxParticipants(
                          event.target.value,
                        )
                      }
                      placeholder="Leave empty for unlimited"
                      className="mt-2"
                      disabled={
                        saving || !isDraft
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Rules                                                       */}
              {/* ---------------------------------------------------------- */}

              <div className="border-t pt-6">
                <label
                  htmlFor="contest-rules"
                  className="text-sm font-medium"
                >
                  Contest Rules
                </label>

                <Textarea
                  id="contest-rules"
                  value={rules}
                  onChange={(event) =>
                    setRules(
                      event.target.value,
                    )
                  }
                  placeholder="Enter the rules students should follow..."
                  rows={8}
                  className="mt-2"
                  disabled={
                    saving || !isDraft
                  }
                />
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Save                                                         */}
              {/* ---------------------------------------------------------- */}

              <div className="flex justify-end border-t pt-6">
                <Button
                  type="submit"
                  disabled={
                    saving || !isDraft
                  }
                  className="min-w-[160px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Subjects                                                          */}
        {/* ================================================================= */}

        <div className="h-fit rounded-xl border bg-card shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">
              Contest Subjects
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Subjects configured for this contest.
            </p>
          </div>

          <div className="space-y-4 p-5">
            {subjects.length === 0 ? (
              <div className="rounded-lg border border-dashed p-5 text-center">
                <p className="text-sm font-medium">
                  No subjects configured
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Subjects can be configured when
                  creating or editing the contest.
                </p>
              </div>
            ) : (
              subjects.map((subject, index) => {
                const subjectId =
                  getSubjectId(subject);

                const remainingTime =
                  remainingTimes[
                    subjectId
                  ] ?? "";

                const isUpdating =
                  savingRemainingTime[
                    subjectId
                  ] ?? false;

                const numericRemainingTime =
                  Number(remainingTime);

                return (
                  <div
                    key={
                      subjectId || index
                    }
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">
                          {getSubjectName(
                            subject,
                          )}
                        </p>

                        {subject.questions?.length !==
                          undefined && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {
                              subject
                                .questions
                                .length
                            }{" "}
                            questions
                          </p>
                        )}
                      </div>

                      <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {index + 1}
                      </span>
                    </div>

                    {/* ---------------------------------------------------- */}
                    {/* Admin remaining-time control                       */}
                    {/* ---------------------------------------------------- */}

                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-primary" />

                        <p className="text-sm font-medium">
                          Remaining Time
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Set the remaining time for this
                        contest subject in seconds.
                      </p>

                      <div className="mt-3 space-y-3">
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={remainingTime}
                          onChange={(event) =>
                            handleRemainingTimeChange(
                              subjectId,
                              event.target.value,
                            )
                          }
                          placeholder="e.g. 1800"
                          disabled={
                            isUpdating ||
                            !subjectId
                          }
                        />

                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs text-muted-foreground">
                            {remainingTime !== "" &&
                            Number.isFinite(
                              numericRemainingTime,
                            )
                              ? formatSeconds(
                                  numericRemainingTime,
                                )
                              : "—"}
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              handleUpdateRemainingTime(
                                subjectId,
                              )
                            }
                            disabled={
                              isUpdating ||
                              !subjectId
                            }
                          >
                            {isUpdating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Update Time
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* Contest information                                                */}
      {/* ================================================================== */}

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            Contest Information
          </h2>
        </div>

        <div className="p-5">
          <div className="grid gap-5 text-sm md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                Contest ID
              </p>

              <p className="mt-1 break-all font-mono text-xs">
                {contest._id || contestId}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Current Status
              </p>

              <p className="mt-1 capitalize">
                {status.toLowerCase()}
              </p>
            </div>

            {contest.createdAt && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Created
                </p>

                <p className="mt-1">
                  {new Date(
                    contest.createdAt,
                  ).toLocaleString()}
                </p>
              </div>
            )}

            {contest.updatedAt && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Last Updated
                </p>

                <p className="mt-1">
                  {new Date(
                    contest.updatedAt,
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
