



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   Plus,
//   Search,
//   Trophy,
//   CalendarDays,
//   Clock3,
//   Eye,
//   Pencil,
//   Trash2,
//   Settings2,
//   BookOpen,
//   ChevronRight,
//   Loader2,
//   Coins,
//   AlertCircle,
//   X,
//   Lock,
//   Power,
//   CheckCircle2,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// import {
//   getAllSolveAndWinContests,
//   deactivateContest,
//   type SolveAndWinContest,
// } from "@/lib/api/solveAndWin";

// import { axiosInstance } from "@/lib/api/axios";

// /* ============================================================
//    HELPERS
//    ============================================================ */

// function getStatusClass(status: string) {
//   switch (status.toLowerCase()) {
//     case "active":
//       return "bg-green-100 text-green-700";

//     case "registration open":
//       return "bg-blue-100 text-blue-700";

//     case "upcoming":
//       return "bg-yellow-100 text-yellow-700";

//     case "completed":
//       return "bg-slate-100 text-slate-600";

//     case "draft":
//       return "bg-purple-100 text-purple-700";

//     default:
//       return "bg-slate-100 text-slate-600";
//   }
// }

// /* ============================================================
//    FORMAT DATE
//    ============================================================ */

// function formatDate(dateString: string) {
//   if (!dateString) {
//     return "—";
//   }

//   const date = new Date(dateString);

//   if (Number.isNaN(date.getTime())) {
//     return "—";
//   }

//   return new Intl.DateTimeFormat("en-NG", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// }

// /* ============================================================
//    FORMAT CURRENCY
//    ============================================================ */

// function formatCurrencyFromKobo(amountInKobo: number) {
//   const amountInNaira = amountInKobo / 100;

//   return new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//     minimumFractionDigits: 0,
//   }).format(amountInNaira);
// }

// /* ============================================================
//    COUNT QUESTIONS
//    ============================================================ */

// function getQuestionCount(contest: SolveAndWinContest) {
//   return contest.subjects.reduce((total, subject) => {
//     return total + (subject.questions?.length ?? 0);
//   }, 0);
// }

// /* ============================================================
//    CHECK DRAFT STATUS
//    ============================================================ */

// function isDraftCompetition(contest: SolveAndWinContest) {
//   return String(contest.status || "").toLowerCase() === "draft";
// }

// /* ============================================================
//    CHECK ACTIVE STATUS
//    ============================================================ */

// function isActiveCompetition(contest: SolveAndWinContest) {
//   return String(contest.status || "").toLowerCase() === "active";
// }

// /* ============================================================
//    EXTRACT API ERROR
//    ============================================================ */

// function getApiErrorMessage(error: unknown, fallback: string) {
//   const axiosError = error as {
//     response?: {
//       data?: {
//         message?: string;
//         error?: string;
//       };
//     };
//     message?: string;
//   };

//   return (
//     axiosError.response?.data?.message ||
//     axiosError.response?.data?.error ||
//     axiosError.message ||
//     fallback
//   );
// }

// /* ============================================================
//    PAGE
//    ============================================================ */

// export default function AdminCompetitionsPage() {
//   /* ==========================================================
//      COMPETITION STATE
//      ========================================================== */

//   const [competitions, setCompetitions] = useState<
//     SolveAndWinContest[]
//   >([]);

//   const [isLoading, setIsLoading] = useState(true);

//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");

//   /* ==========================================================
//      DELETE STATE
//      ========================================================== */

//   const [competitionToDelete, setCompetitionToDelete] =
//     useState<SolveAndWinContest | null>(null);

//   const [isDeleting, setIsDeleting] = useState(false);

//   const [deleteError, setDeleteError] = useState("");

//   /* ==========================================================
//      ACTIVATE STATE
//      ========================================================== */

//   const [competitionToActivate, setCompetitionToActivate] =
//     useState<SolveAndWinContest | null>(null);

//   const [isActivating, setIsActivating] = useState(false);

//   const [activateError, setActivateError] = useState("");

//   /* ==========================================================
//      LOAD COMPETITIONS
//      ========================================================== */

//   const loadCompetitions = async () => {
//     try {
//       setIsLoading(true);
//       setError("");

//       const response = await getAllSolveAndWinContests();

//       setCompetitions(
//         response.data?.solveAndWinContestObj ?? [],
//       );
//     } catch (err) {
//       console.error(
//         "Failed to load Solve & Win competitions:",
//         err,
//       );

//       setError(
//         getApiErrorMessage(
//           err,
//           "Failed to load competitions.",
//         ),
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* ==========================================================
//      INITIAL LOAD
//      ========================================================== */

//   useEffect(() => {
//     loadCompetitions();
//   }, []);

//   /* ==========================================================
//      FILTERED COMPETITIONS
//      ========================================================== */

//   const filteredCompetitions = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     if (!query) {
//       return competitions;
//     }

//     return competitions.filter((competition) => {
//       return (
//         competition.title
//           .toLowerCase()
//           .includes(query) ||
//         competition.description
//           .toLowerCase()
//           .includes(query) ||
//         competition.category
//           .toLowerCase()
//           .includes(query) ||
//         competition.status
//           .toLowerCase()
//           .includes(query)
//       );
//     });
//   }, [competitions, search]);

//   /* ==========================================================
//      STATISTICS
//      ========================================================== */

//   const totalCompetitions = competitions.length;

//   const draftCompetitions = competitions.filter(
//     (competition) => isDraftCompetition(competition),
//   ).length;

//   const activeCompetitions = competitions.filter(
//     (competition) => isActiveCompetition(competition),
//   ).length;

//   const totalSubjects = competitions.reduce(
//     (total, competition) =>
//       total + competition.subjects.length,
//     0,
//   );

//   /* ==========================================================
//      OPEN DELETE CONFIRMATION
//      ========================================================== */

//   const openDeleteConfirmation = (
//     competition: SolveAndWinContest,
//   ) => {
//     setDeleteError("");
//     setCompetitionToDelete(competition);
//   };

//   /* ==========================================================
//      CLOSE DELETE CONFIRMATION
//      ========================================================== */

//   const closeDeleteConfirmation = () => {
//     if (isDeleting) {
//       return;
//     }

//     setCompetitionToDelete(null);
//     setDeleteError("");
//   };

//   /* ==========================================================
//      DELETE COMPETITION
//      ========================================================== */

//   const handleDeleteCompetition = async () => {
//     if (!competitionToDelete?._id) {
//       return;
//     }

//     try {
//       setIsDeleting(true);
//       setDeleteError("");

//       const contestId = competitionToDelete._id;

//       console.log(
//         "Deleting Solve & Win competition:",
//         contestId,
//       );

//       /*
//        * DELETE ENDPOINT
//        *
//        * /api/v1/solve-and-win/contests/delete-contest-by-id/{contestId}
//        */

//       await axiosInstance.delete(
//         `/solve-and-win/contests/delete-contest-by-id/${contestId}`,
//       );

//       console.log(
//         "Competition deleted successfully:",
//         contestId,
//       );

//       /*
//        * Remove it immediately from the UI.
//        */

//       setCompetitions((currentCompetitions) =>
//         currentCompetitions.filter(
//           (competition) =>
//             competition._id !== contestId,
//         ),
//       );

//       /*
//        * Close confirmation modal.
//        */

//       setCompetitionToDelete(null);
//     } catch (err) {
//       console.error(
//         "Failed to delete competition:",
//         err,
//       );

//       setDeleteError(
//         getApiErrorMessage(
//           err,
//           "Something went wrong while deleting the competition.",
//         ),
//       );
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   /* ==========================================================
//      OPEN ACTIVATE CONFIRMATION
//      ========================================================== */

//   const openActivateConfirmation = (
//     competition: SolveAndWinContest,
//   ) => {
//     setActivateError("");
//     setCompetitionToActivate(competition);
//   };

//   /* ==========================================================
//      CLOSE ACTIVATE CONFIRMATION
//      ========================================================== */

//   const closeActivateConfirmation = () => {
//     if (isActivating) {
//       return;
//     }

//     setCompetitionToActivate(null);
//     setActivateError("");
//   };

//   /* ==========================================================
//      ACTIVATE COMPETITION
//      ========================================================== */

//   const handleActivateCompetition = async () => {
//     if (!competitionToActivate?._id) {
//       return;
//     }

//     try {
//       setIsActivating(true);
//       setActivateError("");

//       const contestId = competitionToActivate._id;

//       console.log(
//         "Activating Solve & Win competition:",
//         contestId,
//       );

//       /*
//        * ACTIVATE ENDPOINT
//        *
//        * PATCH
//        * /api/v1/solve-and-win/contests/activate-contest/{contestId}
//        */

//       const response = await axiosInstance.patch(
//         `/solve-and-win/contests/activate-contest/${contestId}`,
//       );

//       console.log(
//         "Competition activation response:",
//         response.data,
//       );

//       console.log(
//         "Competition activated successfully:",
//         contestId,
//       );

//       /*
//        * Automatically update the competition status
//        * in the local UI.
//        *
//        * This avoids making the admin wait for another
//        * full page reload.
//        */

//       setCompetitions((currentCompetitions) =>
//         currentCompetitions.map((competition) =>
//           competition._id === contestId
//             ? {
//                 ...competition,
//                 status: "active",
//               }
//             : competition,
//         ),
//       );

//       /*
//        * Also update the competition inside the modal
//        * before closing it.
//        */

//       setCompetitionToActivate((currentCompetition) =>
//         currentCompetition
//           ? {
//               ...currentCompetition,
//               status: "active",
//             }
//           : null,
//       );

//       /*
//        * Close the modal after successful activation.
//        */

//       setCompetitionToActivate(null);
//     } catch (err) {
//       console.error(
//         "Failed to activate competition:",
//         err,
//       );

//       setActivateError(
//         getApiErrorMessage(
//           err,
//           "Something went wrong while activating the competition.",
//         ),
//       );
//     } finally {
//       setIsActivating(false);
//     }
//   };

//   /* ============================================================
//      RENDER
//      ============================================================ */

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto px-4 py-10">

//         {/* ==================================================
//             HEADER
//             ================================================== */}

//         <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
//               Admin Dashboard
//             </span>

//             <h1 className="mt-4 text-4xl font-bold text-slate-900">
//               Competitions
//             </h1>

//             <p className="mt-3 max-w-3xl text-lg text-slate-600">
//               Create, configure and manage every
//               competition running on the JAMB League
//               platform.
//             </p>
//           </div>

//           <Link href="/admin/secondary/solveandwin/competitions/create">
//             <Button
//               leftIcon={
//                 <Plus className="h-4 w-4" />
//               }
//             >
//               New Competition
//             </Button>
//           </Link>
//         </div>

//         {/* ==================================================
//             STATUS INFORMATION
//             ================================================== */}

//         <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
//               <Settings2 className="h-5 w-5 text-blue-600" />
//             </div>

//             <div>
//               <p className="font-semibold text-blue-900">
//                 Competition editing rules
//               </p>

//               <p className="mt-1 text-sm leading-6 text-blue-800">
//                 Competition configuration can only be
//                 edited while the competition is in{" "}
//                 <span className="font-semibold">
//                   DRAFT
//                 </span>{" "}
//                 status. Once a competition is activated,
//                 its configuration becomes read-only.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ==================================================
//             STATISTICS
//             ================================================== */}

//         <div className="mb-10 grid gap-6 md:grid-cols-4">
//           <Card className="text-center">
//             <Trophy className="mx-auto h-10 w-10 text-yellow-500" />

//             <h2 className="mt-4 text-3xl font-bold text-slate-900">
//               {totalCompetitions}
//             </h2>

//             <p className="mt-2 text-slate-600">
//               Total Competitions
//             </p>
//           </Card>

//           <Card className="text-center">
//             <CalendarDays className="mx-auto h-10 w-10 text-blue-600" />

//             <h2 className="mt-4 text-3xl font-bold text-slate-900">
//               {draftCompetitions}
//             </h2>

//             <p className="mt-2 text-slate-600">
//               Draft
//             </p>
//           </Card>

//           <Card className="text-center">
//             <Clock3 className="mx-auto h-10 w-10 text-green-600" />

//             <h2 className="mt-4 text-3xl font-bold text-slate-900">
//               {activeCompetitions}
//             </h2>

//             <p className="mt-2 text-slate-600">
//               Active
//             </p>
//           </Card>

//           <Card className="text-center">
//             <BookOpen className="mx-auto h-10 w-10 text-purple-600" />

//             <h2 className="mt-4 text-3xl font-bold text-slate-900">
//               {totalSubjects}
//             </h2>

//             <p className="mt-2 text-slate-600">
//               Attached Subjects
//             </p>
//           </Card>
//         </div>

//         {/* ==================================================
//             SEARCH
//             ================================================== */}

//         <Card className="mb-8">
//           <Input
//             placeholder="Search competitions..."
//             value={search}
//             onChange={(event) =>
//               setSearch(event.target.value)
//             }
//             leftIcon={
//               <Search className="h-4 w-4" />
//             }
//           />
//         </Card>

//         {/* ==================================================
//             LOADING
//             ================================================== */}

//         {isLoading && (
//           <Card className="p-12">
//             <div className="flex flex-col items-center justify-center text-center">
//               <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

//               <p className="mt-4 text-sm font-medium text-slate-700">
//                 Loading competitions...
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 Fetching Solve & Win competitions from
//                 the server.
//               </p>
//             </div>
//           </Card>
//         )}

//         {/* ==================================================
//             ERROR
//             ================================================== */}

//         {!isLoading && error && (
//           <Card className="border-red-200 bg-red-50 p-8">
//             <div className="flex items-start gap-4">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
//                 <AlertCircle className="h-5 w-5 text-red-600" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <h2 className="font-bold text-red-900">
//                   Failed to load competitions
//                 </h2>

//                 <p className="mt-1 text-sm text-red-700">
//                   {error}
//                 </p>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="mt-4"
//                   onClick={loadCompetitions}
//                 >
//                   Try Again
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         )}

//         {/* ==================================================
//             COMPETITION LIST
//             ================================================== */}

//         {!isLoading &&
//           !error &&
//           filteredCompetitions.length > 0 && (
//             <div className="space-y-6">
//               {filteredCompetitions.map(
//                 (competition) => {
//                   const questionCount =
//                     getQuestionCount(
//                       competition,
//                     );

//                   const subjectCount =
//                     competition.subjects.length;

//                   const isDraft =
//                     isDraftCompetition(
//                       competition,
//                     );

//                   const isActive =
//                     isActiveCompetition(
//                       competition,
//                     );

//                   return (
//                     <Card
//                       key={competition._id}
//                       hoverable
//                       className="p-8"
//                     >
//                       <div className="flex flex-col gap-7">

//                         {/* ====================================
//                             TOP SECTION
//                             ==================================== */}

//                         <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

//                           {/* Competition Information */}

//                           <div className="min-w-0">
//                             <div className="flex flex-wrap items-center gap-3">
//                               <h2 className="text-2xl font-bold text-slate-900">
//                                 {competition.title}
//                               </h2>

//                               <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
//                                 {competition.category}
//                               </span>

//                               <span
//                                 className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
//                                   competition.status,
//                                 )}`}
//                               >
//                                 {competition.status}
//                               </span>

//                               {!isDraft && (
//                                 <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
//                                   <Lock className="h-3 w-3" />
//                                   Read-only
//                                 </span>
//                               )}
//                             </div>

//                             {/* Description */}

//                             <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
//                               {competition.description ||
//                                 "No description provided."}
//                             </p>

//                             {/* Metadata */}

//                             <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
//                               <span className="flex items-center gap-2">
//                                 <CalendarDays className="h-4 w-4" />

//                                 {formatDate(
//                                   competition.startDate,
//                                 )}

//                                 {" → "}

//                                 {formatDate(
//                                   competition.endDate,
//                                 )}
//                               </span>

//                               <span className="flex items-center gap-2">
//                                 <BookOpen className="h-4 w-4" />

//                                 {subjectCount}{" "}
//                                 {subjectCount === 1
//                                   ? "Subject"
//                                   : "Subjects"}
//                               </span>

//                               <span className="flex items-center gap-2">
//                                 <Trophy className="h-4 w-4" />

//                                 {questionCount}{" "}
//                                 {questionCount === 1
//                                   ? "Question"
//                                   : "Questions"}
//                               </span>

//                               <span className="flex items-center gap-2">
//                                 <Coins className="h-4 w-4 text-yellow-500" />

//                                 {competition.entryPoints.toLocaleString()}{" "}
//                                 Points
//                               </span>
//                             </div>
//                           </div>

//                           {/* ==================================
//                               PRIMARY MANAGE BUTTON
//                               ================================== */}

//                           <Link
//                             href={`/admin/secondary/solveandwin/competitions/${competition._id}/manage`}
//                             className="shrink-0"
//                           >
//                             <Button
//                               leftIcon={
//                                 <Settings2 className="h-4 w-4" />
//                               }
//                             >
//                               Manage Competition

//                               <ChevronRight className="ml-1 h-4 w-4" />
//                             </Button>
//                           </Link>
//                         </div>

//                         {/* ====================================
//                             DRAFT ACTIVATION INFORMATION
//                             ==================================== */}

//                         {isDraft && (
//                           <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
//                             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//                               <div className="flex items-start gap-3">
//                                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
//                                   <Power className="h-5 w-5 text-purple-600" />
//                                 </div>

//                                 <div>
//                                   <p className="text-sm font-semibold text-purple-900">
//                                     Ready to activate
//                                   </p>

//                                   <p className="mt-1 text-sm leading-5 text-purple-800">
//                                     Activating this competition
//                                     will make it active and lock
//                                     its configuration from further
//                                     editing.
//                                   </p>
//                                 </div>
//                               </div>

//                               <Button
//                                 type="button"
//                                 onClick={() =>
//                                   openActivateConfirmation(
//                                     competition,
//                                   )
//                                 }
//                                 leftIcon={
//                                   <Power className="h-4 w-4" />
//                                 }
//                                 className="shrink-0"
//                               >
//                                 Activate Competition
//                               </Button>
//                             </div>
//                           </div>
//                         )}

//                         {/* ====================================
//                             ACTIVE INFORMATION
//                             ==================================== */}

//                         {isActive && (
//                           <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
//                             <div className="flex items-start gap-3">
//                               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
//                                 <CheckCircle2 className="h-5 w-5 text-green-600" />
//                               </div>

//                               <div>
//                                 <p className="text-sm font-semibold text-green-900">
//                                   Competition is active
//                                 </p>

//                                 <p className="mt-1 text-sm leading-5 text-green-800">
//                                   This competition has been
//                                   activated. Its configuration
//                                   is now read-only.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         {/* ====================================
//                             NON-DRAFT INFORMATION
//                             ==================================== */}

//                         {!isDraft && !isActive && (
//                           <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
//                             <div className="flex items-start gap-3">
//                               <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

//                               <div>
//                                 <p className="text-sm font-semibold text-amber-900">
//                                   Configuration editing is locked
//                                 </p>

//                                 <p className="mt-1 text-sm leading-5 text-amber-800">
//                                   This competition is no
//                                   longer in draft status.
//                                   You can still view and
//                                   manage its competition
//                                   content, but configuration
//                                   changes are disabled.
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         {/* ====================================
//                             COMPETITION CONTENT SUMMARY
//                             ==================================== */}

//                         <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
//                           <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//                             <div>
//                               <p className="text-sm font-semibold text-slate-900">
//                                 Competition Content
//                               </p>

//                               <p className="mt-1 text-sm text-slate-500">
//                                 Manage the subjects and
//                                 questions students will
//                                 answer.
//                               </p>
//                             </div>

//                             <div className="flex flex-wrap gap-3">

//                               <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
//                                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                                   Subjects
//                                 </p>

//                                 <p className="mt-1 text-lg font-bold text-slate-900">
//                                   {subjectCount}
//                                 </p>
//                               </div>

//                               <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
//                                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                                   Questions
//                                 </p>

//                                 <p className="mt-1 text-lg font-bold text-slate-900">
//                                   {questionCount}
//                                 </p>
//                               </div>

//                               <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
//                                 <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                                   Prize
//                                 </p>

//                                 <p className="mt-1 text-lg font-bold text-slate-900">
//                                   {formatCurrencyFromKobo(
//                                     competition.amountToBeWonInKobo,
//                                   )}
//                                 </p>
//                               </div>

//                             </div>
//                           </div>
//                         </div>

//                         {/* ====================================
//                             ACTIONS
//                             ==================================== */}

//                         <div className="flex flex-wrap items-center gap-3 border-t pt-5">

//                           {/* View */}

//                           <Link
//                             href={`/admin/secondary/solveandwin/competitions/${competition._id}`}
//                           >
//                             <Button
//                               variant="outline"
//                               leftIcon={
//                                 <Eye className="h-4 w-4" />
//                               }
//                             >
//                               View
//                             </Button>
//                           </Link>

//                           {/* Edit — DRAFT ONLY */}

//                           {isDraft ? (
//                             <Link
//                               href={`/admin/secondary/solveandwin/competitions/${competition._id}/edit`}
//                             >
//                               <Button
//                                 variant="outline"
//                                 leftIcon={
//                                   <Pencil className="h-4 w-4" />
//                                 }
//                               >
//                                 Edit
//                               </Button>
//                             </Link>
//                           ) : (
//                             <Button
//                               type="button"
//                               variant="outline"
//                               disabled
//                               leftIcon={
//                                 <Lock className="h-4 w-4" />
//                               }
//                             >
//                               Edit Locked
//                             </Button>
//                           )}

//                           {/* Activate — DRAFT ONLY */}

//                           {isDraft && (
//                             <Button
//                               type="button"
//                               variant="outline"
//                               onClick={() =>
//                                 openActivateConfirmation(
//                                   competition,
//                                 )
//                               }
//                               leftIcon={
//                                 <Power className="h-4 w-4" />
//                               }
//                             >
//                               Activate
//                             </Button>
//                           )}

//                           {/* Delete */}

//                           <Button
//                             type="button"
//                             variant="destructive"
//                             leftIcon={
//                               <Trash2 className="h-4 w-4" />
//                             }
//                             onClick={() =>
//                               openDeleteConfirmation(
//                                 competition,
//                               )
//                             }
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   );
//                 },
//               )}
//             </div>
//           )}

//         {/* ==================================================
//             SEARCH EMPTY STATE
//             ================================================== */}

//         {!isLoading &&
//           !error &&
//           competitions.length > 0 &&
//           filteredCompetitions.length === 0 && (
//             <Card className="p-12 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
//                 <Search className="h-8 w-8 text-slate-400" />
//               </div>

//               <h2 className="mt-5 text-xl font-bold text-slate-900">
//                 No competitions found
//               </h2>

//               <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
//                 No competition matches your search.
//                 Try another title, category or status.
//               </p>
//             </Card>
//           )}

//         {/* ==================================================
//             EMPTY STATE
//             ================================================== */}

//         {!isLoading &&
//           !error &&
//           competitions.length === 0 && (
//             <Card className="p-12 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
//                 <Trophy className="h-8 w-8 text-blue-600" />
//               </div>

//               <h2 className="mt-5 text-xl font-bold text-slate-900">
//                 No competitions yet
//               </h2>

//               <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
//                 Create your first competition and then
//                 add subjects and questions from the
//                 competition management page.
//               </p>

//               <div className="mt-6">
//                 <Link href="/admin/secondary/solveandwin/competitions/create">
//                   <Button
//                     leftIcon={
//                       <Plus className="h-4 w-4" />
//                     }
//                   >
//                     Create Competition
//                   </Button>
//                 </Link>
//               </div>
//             </Card>
//           )}
//       </div>

//       {/* ======================================================
//           ACTIVATE CONFIRMATION MODAL
//           ====================================================== */}

//       {competitionToActivate && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
//           <div
//             className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="activate-competition-title"
//           >
//             {/* Modal Header */}

//             <div className="flex items-start justify-between gap-4">
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
//                   <Power className="h-6 w-6 text-green-600" />
//                 </div>

//                 <div>
//                   <h2
//                     id="activate-competition-title"
//                     className="text-xl font-bold text-slate-900"
//                   >
//                     Activate Competition?
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Please confirm before making this
//                     competition active.
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeActivateConfirmation}
//                 disabled={isActivating}
//                 className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
//                 aria-label="Close activation confirmation"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Competition */}

//             <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4">
//               <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
//                 Competition
//               </p>

//               <p className="mt-1 font-bold text-green-900">
//                 {competitionToActivate.title}
//               </p>

//               <p className="mt-1 text-xs text-green-700">
//                 ID: {competitionToActivate._id}
//               </p>
//             </div>

//             {/* Current Status */}

//             <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
//               <div className="flex items-start gap-3">
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
//                   <CalendarDays className="h-4 w-4 text-slate-600" />
//                 </div>

//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//                     Current Status
//                   </p>

//                   <p className="mt-1 text-sm font-semibold text-slate-900">
//                     {competitionToActivate.status}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Activation Warning */}

//             <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
//               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

//               <div>
//                 <p className="text-sm font-semibold text-amber-900">
//                   Activation will lock configuration
//                 </p>

//                 <p className="mt-1 text-sm leading-5 text-amber-800">
//                   Once this competition is activated,
//                   its configuration will become
//                   read-only. Make sure the competition,
//                   subjects, questions, dates and other
//                   settings are ready before continuing.
//                 </p>
//               </div>
//             </div>

//             {/* Activation Error */}

//             {activateError && (
//               <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

//                   <div className="min-w-0">
//                     <p className="text-sm font-semibold text-red-900">
//                       Activation failed
//                     </p>

//                     <p className="mt-1 text-sm leading-5 text-red-700">
//                       {activateError}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Modal Actions */}

//             <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={closeActivateConfirmation}
//                 disabled={isActivating}
//                 className="sm:min-w-28"
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="button"
//                 onClick={handleActivateCompetition}
//                 disabled={isActivating}
//                 leftIcon={
//                   isActivating ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Power className="h-4 w-4" />
//                   )
//                 }
//                 className="sm:min-w-40"
//               >
//                 {isActivating
//                   ? "Activating..."
//                   : "Activate Competition"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================================================
//           DELETE CONFIRMATION MODAL
//           ====================================================== */}

//       {competitionToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
//           <div
//             className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="delete-competition-title"
//           >
//             {/* Modal Header */}

//             <div className="flex items-start justify-between gap-4">
//               <div className="flex items-start gap-4">
//                 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
//                   <Trash2 className="h-6 w-6 text-red-600" />
//                 </div>

//                 <div>
//                   <h2
//                     id="delete-competition-title"
//                     className="text-xl font-bold text-slate-900"
//                   >
//                     Delete Competition?
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     This action cannot be undone.
//                   </p>
//                 </div>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeDeleteConfirmation}
//                 disabled={isDeleting}
//                 className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
//                 aria-label="Close delete confirmation"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Competition being deleted */}

//             <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
//               <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
//                 Competition
//               </p>

//               <p className="mt-1 font-bold text-red-900">
//                 {competitionToDelete.title}
//               </p>

//               <p className="mt-1 text-xs text-red-700">
//                 ID: {competitionToDelete._id}
//               </p>
//             </div>

//             {/* Status Information */}

//             <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
//               <div className="flex items-start gap-3">
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
//                   <CalendarDays className="h-4 w-4 text-slate-600" />
//                 </div>

//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
//                     Current Status
//                   </p>

//                   <p className="mt-1 text-sm font-semibold text-slate-900">
//                     {competitionToDelete.status}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Warning */}

//             <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
//               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

//               <div>
//                 <p className="text-sm font-semibold text-amber-900">
//                   Please confirm this action
//                 </p>

//                 <p className="mt-1 text-sm leading-5 text-amber-800">
//                   Deleting this competition may also
//                   remove its associated configuration,
//                   subjects, and questions depending on
//                   how the backend handles deletion.
//                 </p>
//               </div>
//             </div>

//             {/* Delete Error */}

//             {deleteError && (
//               <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

//                   <div>
//                     <p className="text-sm font-semibold text-red-900">
//                       Delete failed
//                     </p>

//                     <p className="mt-1 text-sm text-red-700">
//                       {deleteError}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Modal Actions */}

//             <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={closeDeleteConfirmation}
//                 disabled={isDeleting}
//                 className="sm:min-w-28"
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="button"
//                 variant="destructive"
//                 onClick={handleDeleteCompetition}
//                 disabled={isDeleting}
//                 leftIcon={
//                   isDeleting ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Trash2 className="h-4 w-4" />
//                   )
//                 }
//                 className="sm:min-w-36"
//               >
//                 {isDeleting
//                   ? "Deleting..."
//                   : "Delete Competition"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }









"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trophy,
  CalendarDays,
  Clock3,
  Eye,
  Pencil,
  Trash2,
  Settings2,
  BookOpen,
  ChevronRight,
  Loader2,
  Coins,
  AlertCircle,
  X,
  Lock,
  Power,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  getAllSolveAndWinContests,
  deactivateContest,
  type SolveAndWinContest,
} from "@/lib/api/solveAndWin";

import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   HELPERS
   ============================================================ */

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700";

    case "registration open":
      return "bg-blue-100 text-blue-700";

    case "upcoming":
      return "bg-yellow-100 text-yellow-700";

    case "completed":
      return "bg-slate-100 text-slate-600";

    case "draft":
      return "bg-purple-100 text-purple-700";

    case "deactivated":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

/* ============================================================
   FORMAT DATE
   ============================================================ */

function formatDate(dateString: string) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/* ============================================================
   FORMAT CURRENCY
   ============================================================ */

function formatCurrencyFromKobo(amountInKobo: number) {
  const amountInNaira = amountInKobo / 100;

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amountInNaira);
}

/* ============================================================
   COUNT QUESTIONS
   ============================================================ */

function getQuestionCount(contest: SolveAndWinContest) {
  return contest.subjects.reduce((total, subject) => {
    return total + (subject.questions?.length ?? 0);
  }, 0);
}

/* ============================================================
   CHECK DRAFT STATUS
   ============================================================ */

function isDraftCompetition(contest: SolveAndWinContest) {
  return String(contest.status || "").toLowerCase() === "draft";
}

/* ============================================================
   CHECK ACTIVE STATUS
   ============================================================ */

function isActiveCompetition(contest: SolveAndWinContest) {
  return String(contest.status || "").toLowerCase() === "active";
}

/* ============================================================
   CHECK DEACTIVATED STATUS
   ============================================================ */

function isDeactivatedCompetition(contest: SolveAndWinContest) {
  return (
    String(contest.status || "").toLowerCase() ===
    "deactivated"
  );
}

/* ============================================================
   EXTRACT API ERROR
   ============================================================ */

function getApiErrorMessage(
  error: unknown,
  fallback: string,
) {
  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    fallback
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function AdminCompetitionsPage() {
  /* ==========================================================
     COMPETITION STATE
     ========================================================== */

  const [competitions, setCompetitions] = useState<
    SolveAndWinContest[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  /* ==========================================================
     DELETE STATE
     ========================================================== */

  const [competitionToDelete, setCompetitionToDelete] =
    useState<SolveAndWinContest | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  /* ==========================================================
     ACTIVATE STATE
     ========================================================== */

  const [competitionToActivate, setCompetitionToActivate] =
    useState<SolveAndWinContest | null>(null);

  const [isActivating, setIsActivating] = useState(false);

  const [activateError, setActivateError] = useState("");

  /* ==========================================================
     DEACTIVATE STATE
     ========================================================== */

  const [
    competitionToDeactivate,
    setCompetitionToDeactivate,
  ] = useState<SolveAndWinContest | null>(null);

  const [isDeactivating, setIsDeactivating] = useState(false);

  const [deactivateError, setDeactivateError] =
    useState("");

  /* ==========================================================
     LOAD COMPETITIONS
     ========================================================== */

  const loadCompetitions = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAllSolveAndWinContests();

      setCompetitions(
        response.data?.solveAndWinContestObj ?? [],
      );
    } catch (err) {
      console.error(
        "Failed to load Solve & Win competitions:",
        err,
      );

      setError(
        getApiErrorMessage(
          err,
          "Failed to load competitions.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================================
     INITIAL LOAD
     ========================================================== */

  useEffect(() => {
    loadCompetitions();
  }, []);

  /* ==========================================================
     FILTERED COMPETITIONS
     ========================================================== */

  const filteredCompetitions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return competitions;
    }

    return competitions.filter((competition) => {
      return (
        competition.title
          .toLowerCase()
          .includes(query) ||
        competition.description
          .toLowerCase()
          .includes(query) ||
        competition.category
          .toLowerCase()
          .includes(query) ||
        competition.status
          .toLowerCase()
          .includes(query)
      );
    });
  }, [competitions, search]);

  /* ==========================================================
     STATISTICS
     ========================================================== */

  const totalCompetitions = competitions.length;

  const draftCompetitions = competitions.filter(
    (competition) =>
      isDraftCompetition(competition),
  ).length;

  const activeCompetitions = competitions.filter(
    (competition) =>
      isActiveCompetition(competition),
  ).length;

  const totalSubjects = competitions.reduce(
    (total, competition) =>
      total + competition.subjects.length,
    0,
  );

  /* ==========================================================
     DELETE
     ========================================================== */

  const openDeleteConfirmation = (
    competition: SolveAndWinContest,
  ) => {
    setDeleteError("");
    setCompetitionToDelete(competition);
  };

  const closeDeleteConfirmation = () => {
    if (isDeleting) {
      return;
    }

    setCompetitionToDelete(null);
    setDeleteError("");
  };

  const handleDeleteCompetition = async () => {
    if (!competitionToDelete?._id) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      const contestId = competitionToDelete._id;

      console.log(
        "Deleting Solve & Win competition:",
        contestId,
      );

      await axiosInstance.delete(
        `/solve-and-win/contests/delete-contest-by-id/${contestId}`,
      );

      console.log(
        "Competition deleted successfully:",
        contestId,
      );

      setCompetitions((currentCompetitions) =>
        currentCompetitions.filter(
          (competition) =>
            competition._id !== contestId,
        ),
      );

      setCompetitionToDelete(null);
    } catch (err) {
      console.error(
        "Failed to delete competition:",
        err,
      );

      setDeleteError(
        getApiErrorMessage(
          err,
          "Something went wrong while deleting the competition.",
        ),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  /* ==========================================================
     ACTIVATE
     ========================================================== */

  const openActivateConfirmation = (
    competition: SolveAndWinContest,
  ) => {
    setActivateError("");
    setCompetitionToActivate(competition);
  };

  const closeActivateConfirmation = () => {
    if (isActivating) {
      return;
    }

    setCompetitionToActivate(null);
    setActivateError("");
  };

  const handleActivateCompetition = async () => {
    if (!competitionToActivate?._id) {
      return;
    }

    try {
      setIsActivating(true);
      setActivateError("");

      const contestId = competitionToActivate._id;

      console.log(
        "Activating Solve & Win competition:",
        contestId,
      );

      const response = await axiosInstance.patch(
        `/solve-and-win/contests/activate-contest/${contestId}`,
      );

      console.log(
        "Competition activation response:",
        response.data,
      );

      setCompetitions((currentCompetitions) =>
        currentCompetitions.map((competition) =>
          competition._id === contestId
            ? {
                ...competition,
                status: "active",
              }
            : competition,
        ),
      );

      setCompetitionToActivate(null);
    } catch (err) {
      console.error(
        "Failed to activate competition:",
        err,
      );

      setActivateError(
        getApiErrorMessage(
          err,
          "Something went wrong while activating the competition.",
        ),
      );
    } finally {
      setIsActivating(false);
    }
  };

  /* ==========================================================
     DEACTIVATE
     ========================================================== */

  const openDeactivateConfirmation = (
    competition: SolveAndWinContest,
  ) => {
    setDeactivateError("");
    setCompetitionToDeactivate(competition);
  };

  const closeDeactivateConfirmation = () => {
    if (isDeactivating) {
      return;
    }

    setCompetitionToDeactivate(null);
    setDeactivateError("");
  };

  const handleDeactivateCompetition = async () => {
    if (!competitionToDeactivate?._id) {
      return;
    }

    try {
      setIsDeactivating(true);
      setDeactivateError("");

      const contestId = competitionToDeactivate._id;

      console.log(
        "Deactivating Solve & Win competition:",
        contestId,
      );

      const response = await deactivateContest(contestId);

      console.log(
        "Competition deactivation response:",
        response,
      );

      /*
       * Update the local UI immediately.
       */

      setCompetitions((currentCompetitions) =>
        currentCompetitions.map((competition) =>
          competition._id === contestId
            ? {
                ...competition,
                status: "deactivated",
              }
            : competition,
        ),
      );

      /*
       * Close modal after successful request.
       */

      setCompetitionToDeactivate(null);
    } catch (err) {
      console.error(
        "Failed to deactivate competition:",
        err,
      );

      setDeactivateError(
        getApiErrorMessage(
          err,
          "Something went wrong while deactivating the competition.",
        ),
      );
    } finally {
      setIsDeactivating(false);
    }
  };

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10">

        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Admin Dashboard
            </span>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              Competitions
            </h1>

            <p className="mt-3 max-w-3xl text-lg text-slate-600">
              Create, configure and manage every
              competition running on the JAMB League
              platform.
            </p>
          </div>

          <Link href="/admin/secondary/solveandwin/competitions/create">
            <Button
              leftIcon={
                <Plus className="h-4 w-4" />
              }
            >
              New Competition
            </Button>
          </Link>
        </div>

        {/* ==================================================
            STATUS INFORMATION
            ================================================== */}

        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Settings2 className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="font-semibold text-blue-900">
                Competition editing rules
              </p>

              <p className="mt-1 text-sm leading-6 text-blue-800">
                Competition configuration can only be
                edited while the competition is in{" "}
                <span className="font-semibold">
                  DRAFT
                </span>{" "}
                status. Once a competition is activated,
                its configuration becomes read-only.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            STATISTICS
            ================================================== */}

        <div className="mb-10 grid gap-6 md:grid-cols-4">
          <Card className="text-center">
            <Trophy className="mx-auto h-10 w-10 text-yellow-500" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {totalCompetitions}
            </h2>

            <p className="mt-2 text-slate-600">
              Total Competitions
            </p>
          </Card>

          <Card className="text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-blue-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {draftCompetitions}
            </h2>

            <p className="mt-2 text-slate-600">
              Draft
            </p>
          </Card>

          <Card className="text-center">
            <Clock3 className="mx-auto h-10 w-10 text-green-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {activeCompetitions}
            </h2>

            <p className="mt-2 text-slate-600">
              Active
            </p>
          </Card>

          <Card className="text-center">
            <BookOpen className="mx-auto h-10 w-10 text-purple-600" />

            <h2 className="mt-4 text-3xl font-bold text-slate-900">
              {totalSubjects}
            </h2>

            <p className="mt-2 text-slate-600">
              Attached Subjects
            </p>
          </Card>
        </div>

        {/* ==================================================
            SEARCH
            ================================================== */}

        <Card className="mb-8">
          <Input
            placeholder="Search competitions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            leftIcon={
              <Search className="h-4 w-4" />
            }
          />
        </Card>

        {/* ==================================================
            LOADING
            ================================================== */}

        {isLoading && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-700">
                Loading competitions...
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Fetching Solve & Win competitions from
                the server.
              </p>
            </div>
          </Card>
        )}

        {/* ==================================================
            ERROR
            ================================================== */}

        {!isLoading && error && (
          <Card className="border-red-200 bg-red-50 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-red-900">
                  Failed to load competitions
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={loadCompetitions}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ==================================================
            COMPETITION LIST
            ================================================== */}

        {!isLoading &&
          !error &&
          filteredCompetitions.length > 0 && (
            <div className="space-y-6">
              {filteredCompetitions.map(
                (competition) => {
                  const questionCount =
                    getQuestionCount(
                      competition,
                    );

                  const subjectCount =
                    competition.subjects.length;

                  const isDraft =
                    isDraftCompetition(
                      competition,
                    );

                  const isActive =
                    isActiveCompetition(
                      competition,
                    );

                  const isDeactivated =
                    isDeactivatedCompetition(
                      competition,
                    );

                  return (
                    <Card
                      key={competition._id}
                      hoverable
                      className="p-8"
                    >
                      <div className="flex flex-col gap-7">

                        {/* ====================================
                            TOP SECTION
                            ==================================== */}

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                          {/* Competition Information */}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="text-2xl font-bold text-slate-900">
                                {competition.title}
                              </h2>

                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                {competition.category}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                  competition.status,
                                )}`}
                              >
                                {competition.status}
                              </span>

                              {!isDraft && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                  <Lock className="h-3 w-3" />
                                  Read-only
                                </span>
                              )}
                            </div>

                            {/* Description */}

                            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                              {competition.description ||
                                "No description provided."}
                            </p>

                            {/* Metadata */}

                            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                              <span className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />

                                {formatDate(
                                  competition.startDate,
                                )}

                                {" → "}

                                {formatDate(
                                  competition.endDate,
                                )}
                              </span>

                              <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />

                                {subjectCount}{" "}
                                {subjectCount === 1
                                  ? "Subject"
                                  : "Subjects"}
                              </span>

                              <span className="flex items-center gap-2">
                                <Trophy className="h-4 w-4" />

                                {questionCount}{" "}
                                {questionCount === 1
                                  ? "Question"
                                  : "Questions"}
                              </span>

                              <span className="flex items-center gap-2">
                                <Coins className="h-4 w-4 text-yellow-500" />

                                {competition.entryPoints.toLocaleString()}{" "}
                                Points
                              </span>
                            </div>
                          </div>

                          {/* ==================================
                              PRIMARY MANAGE BUTTON
                              ================================== */}

                          <Link
                            href={`/admin/secondary/solveandwin/competitions/${competition._id}/manage`}
                            className="shrink-0"
                          >
                            <Button
                              leftIcon={
                                <Settings2 className="h-4 w-4" />
                              }
                            >
                              Manage Competition

                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>

                        {/* ====================================
                            DRAFT ACTIVATION INFORMATION
                            ==================================== */}

                        {isDraft && (
                          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                                  <Power className="h-5 w-5 text-purple-600" />
                                </div>

                                <div>
                                  <p className="text-sm font-semibold text-purple-900">
                                    Ready to activate
                                  </p>

                                  <p className="mt-1 text-sm leading-5 text-purple-800">
                                    Activating this competition
                                    will make it active and lock
                                    its configuration from further
                                    editing.
                                  </p>
                                </div>
                              </div>

                              <Button
                                type="button"
                                onClick={() =>
                                  openActivateConfirmation(
                                    competition,
                                  )
                                }
                                leftIcon={
                                  <Power className="h-4 w-4" />
                                }
                                className="shrink-0"
                              >
                                Activate Competition
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* ====================================
                            ACTIVE INFORMATION
                            ==================================== */}

                        {isActive && (
                          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>

                                <div>
                                  <p className="text-sm font-semibold text-green-900">
                                    Competition is active
                                  </p>

                                  <p className="mt-1 text-sm leading-5 text-green-800">
                                    This competition is currently
                                    active. Its configuration is
                                    read-only.
                                  </p>
                                </div>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  openDeactivateConfirmation(
                                    competition,
                                  )
                                }
                                leftIcon={
                                  <Power className="h-4 w-4" />
                                }
                                className="shrink-0"
                              >
                                Deactivate Competition
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* ====================================
                            DEACTIVATED INFORMATION
                            ==================================== */}

                        {isDeactivated && (
                          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                                <Power className="h-5 w-5 text-red-600" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-red-900">
                                  Competition is deactivated
                                </p>

                                <p className="mt-1 text-sm leading-5 text-red-800">
                                  This competition has been
                                  deactivated and is no longer
                                  active.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ====================================
                            NON-DRAFT INFORMATION
                            ==================================== */}

                        {!isDraft &&
                          !isActive &&
                          !isDeactivated && (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                              <div className="flex items-start gap-3">
                                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                                <div>
                                  <p className="text-sm font-semibold text-amber-900">
                                    Configuration editing is locked
                                  </p>

                                  <p className="mt-1 text-sm leading-5 text-amber-800">
                                    This competition is no
                                    longer in draft status.
                                    You can still view and
                                    manage its competition
                                    content, but configuration
                                    changes are disabled.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                        {/* ====================================
                            COMPETITION CONTENT SUMMARY
                            ==================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                Competition Content
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Manage the subjects and
                                questions students will
                                answer.
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3">

                              <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  Subjects
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                  {subjectCount}
                                </p>
                              </div>

                              <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  Questions
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                  {questionCount}
                                </p>
                              </div>

                              <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  Prize
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                  {formatCurrencyFromKobo(
                                    competition.amountToBeWonInKobo,
                                  )}
                                </p>
                              </div>

                            </div>
                          </div>
                        </div>

                        {/* ====================================
                            ACTIONS
                            ==================================== */}

                        <div className="flex flex-wrap items-center gap-3 border-t pt-5">

                          {/* View */}

                          <Link
                            href={`/admin/secondary/solveandwin/competitions/${competition._id}`}
                          >
                            <Button
                              variant="outline"
                              leftIcon={
                                <Eye className="h-4 w-4" />
                              }
                            >
                              View
                            </Button>
                          </Link>

                          {/* Edit — DRAFT ONLY */}

                          {isDraft ? (
                            <Link
                              href={`/admin/secondary/solveandwin/competitions/${competition._id}/edit`}
                            >
                              <Button
                                variant="outline"
                                leftIcon={
                                  <Pencil className="h-4 w-4" />
                                }
                              >
                                Edit
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              disabled
                              leftIcon={
                                <Lock className="h-4 w-4" />
                              }
                            >
                              Edit Locked
                            </Button>
                          )}

                          {/* Activate — DRAFT ONLY */}

                          {isDraft && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                openActivateConfirmation(
                                  competition,
                                )
                              }
                              leftIcon={
                                <Power className="h-4 w-4" />
                              }
                            >
                              Activate
                            </Button>
                          )}

                          {/* Deactivate — ACTIVE ONLY */}

                          {isActive && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                openDeactivateConfirmation(
                                  competition,
                                )
                              }
                              leftIcon={
                                <Power className="h-4 w-4" />
                              }
                            >
                              Deactivate
                            </Button>
                          )}

                          {/* Delete */}

                          <Button
                            type="button"
                            variant="destructive"
                            leftIcon={
                              <Trash2 className="h-4 w-4" />
                            }
                            onClick={() =>
                              openDeleteConfirmation(
                                competition,
                              )
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                },
              )}
            </div>
          )}

        {/* ==================================================
            SEARCH EMPTY STATE
            ================================================== */}

        {!isLoading &&
          !error &&
          competitions.length > 0 &&
          filteredCompetitions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Search className="h-8 w-8 text-slate-400" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No competitions found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                No competition matches your search.
                Try another title, category or status.
              </p>
            </Card>
          )}

        {/* ==================================================
            EMPTY STATE
            ================================================== */}

        {!isLoading &&
          !error &&
          competitions.length === 0 && (
            <Card className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No competitions yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Create your first competition and then
                add subjects and questions from the
                competition management page.
              </p>

              <div className="mt-6">
                <Link href="/admin/secondary/solveandwin/competitions/create">
                  <Button
                    leftIcon={
                      <Plus className="h-4 w-4" />
                    }
                  >
                    Create Competition
                  </Button>
                </Link>
              </div>
            </Card>
          )}
      </div>

      {/* ======================================================
          ACTIVATE CONFIRMATION MODAL
          ====================================================== */}

      {competitionToActivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="activate-competition-title"
          >
            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
                  <Power className="h-6 w-6 text-green-600" />
                </div>

                <div>
                  <h2
                    id="activate-competition-title"
                    className="text-xl font-bold text-slate-900"
                  >
                    Activate Competition?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Please confirm before making this
                    competition active.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeActivateConfirmation}
                disabled={isActivating}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close activation confirmation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Competition */}

            <div className="mt-6 rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                Competition
              </p>

              <p className="mt-1 font-bold text-green-900">
                {competitionToActivate.title}
              </p>

              <p className="mt-1 text-xs text-green-700">
                ID: {competitionToActivate._id}
              </p>
            </div>

            {/* Current Status */}

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                  <CalendarDays className="h-4 w-4 text-slate-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Current Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {competitionToActivate.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Activation Warning */}

            <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Activation will lock configuration
                </p>

                <p className="mt-1 text-sm leading-5 text-amber-800">
                  Once this competition is activated,
                  its configuration will become
                  read-only. Make sure the competition,
                  subjects, questions, dates and other
                  settings are ready before continuing.
                </p>
              </div>
            </div>

            {/* Activation Error */}

            {activateError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-red-900">
                      Activation failed
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-700">
                      {activateError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeActivateConfirmation}
                disabled={isActivating}
                className="sm:min-w-28"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleActivateCompetition}
                disabled={isActivating}
                leftIcon={
                  isActivating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )
                }
                className="sm:min-w-40"
              >
                {isActivating
                  ? "Activating..."
                  : "Activate Competition"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          DEACTIVATE CONFIRMATION MODAL
          ====================================================== */}

      {competitionToDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="deactivate-competition-title"
          >
            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                  <Power className="h-6 w-6 text-amber-600" />
                </div>

                <div>
                  <h2
                    id="deactivate-competition-title"
                    className="text-xl font-bold text-slate-900"
                  >
                    Deactivate Competition?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Please confirm before deactivating this
                    competition.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeactivateConfirmation}
                disabled={isDeactivating}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close deactivation confirmation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Competition */}

            <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                Competition
              </p>

              <p className="mt-1 font-bold text-amber-900">
                {competitionToDeactivate.title}
              </p>

              <p className="mt-1 text-xs text-amber-700">
                ID: {competitionToDeactivate._id}
              </p>
            </div>

            {/* Current Status */}

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                  <CalendarDays className="h-4 w-4 text-slate-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Current Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {competitionToDeactivate.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning */}

            <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Competition will be deactivated
                </p>

                <p className="mt-1 text-sm leading-5 text-amber-800">
                  Deactivating this competition will remove
                  it from its active state. Make sure you
                  want to stop the competition before
                  continuing.
                </p>
              </div>
            </div>

            {/* Deactivation Error */}

            {deactivateError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-red-900">
                      Deactivation failed
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-700">
                      {deactivateError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeDeactivateConfirmation}
                disabled={isDeactivating}
                className="sm:min-w-28"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleDeactivateCompetition}
                disabled={isDeactivating}
                leftIcon={
                  isDeactivating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )
                }
                className="sm:min-w-40"
              >
                {isDeactivating
                  ? "Deactivating..."
                  : "Deactivate Competition"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          DELETE CONFIRMATION MODAL
          ====================================================== */}

      {competitionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-competition-title"
          >
            {/* Modal Header */}

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>

                <div>
                  <h2
                    id="delete-competition-title"
                    className="text-xl font-bold text-slate-900"
                  >
                    Delete Competition?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteConfirmation}
                disabled={isDeleting}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close delete confirmation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Competition being deleted */}

            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                Competition
              </p>

              <p className="mt-1 font-bold text-red-900">
                {competitionToDelete.title}
              </p>

              <p className="mt-1 text-xs text-red-700">
                ID: {competitionToDelete._id}
              </p>
            </div>

            {/* Status Information */}

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                  <CalendarDays className="h-4 w-4 text-slate-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Current Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {competitionToDelete.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Warning */}

            <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Please confirm this action
                </p>

                <p className="mt-1 text-sm leading-5 text-amber-800">
                  Deleting this competition may also
                  remove its associated configuration,
                  subjects, and questions depending on
                  how the backend handles deletion.
                </p>
              </div>
            </div>

            {/* Delete Error */}

            {deleteError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Delete failed
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {deleteError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeDeleteConfirmation}
                disabled={isDeleting}
                className="sm:min-w-28"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteCompetition}
                disabled={isDeleting}
                leftIcon={
                  isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )
                }
                className="sm:min-w-36"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Competition"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
