


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
  Users,
  Coins,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  getAllSolveAndWinContests,
  type SolveAndWinContest,
} from "@/lib/api/solveAndWin";

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
   PAGE
   ============================================================ */

export default function AdminCompetitionsPage() {
  /* ==========================================================
     STATE
     ========================================================== */

  const [competitions, setCompetitions] = useState<
    SolveAndWinContest[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

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
        err instanceof Error
          ? err.message
          : "Failed to load competitions.",
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
      competition.status.toLowerCase() === "draft",
  ).length;

  const activeCompetitions = competitions.filter(
    (competition) =>
      competition.status.toLowerCase() === "active",
  ).length;

  const totalSubjects = competitions.reduce(
    (total, competition) =>
      total + competition.subjects.length,
    0,
  );

  /* ==========================================================
     RENDER
     ========================================================== */

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
              Create, configure and manage every competition
              running on the JAMB League platform.
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
                Fetching Solve &amp; Win competitions from the server.
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
                            href={`/admin/secondary/solveandwin/competitions/${competition._id}`}
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
                           COMPETITION CONTENT SUMMARY
                           ==================================== */}

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                            <div>

                              <p className="text-sm font-semibold text-slate-900">
                                Competition Content
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                Manage the subjects and questions
                                students will answer.
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

                          {/* Manage */}

                          <Link
                            href={`/admin/secondary/solveandwin/competitions/${competition._id}`}
                          >
                            <Button
                              variant="outline"
                              leftIcon={
                                <Settings2 className="h-4 w-4" />
                              }
                            >
                              Manage
                            </Button>
                          </Link>

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

                          {/* Edit */}

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

                          {/* Delete */}

                          <Button
                            variant="destructive"
                            leftIcon={
                              <Trash2 className="h-4 w-4" />
                            }
                            onClick={() => {
                              console.log(
                                "Delete competition:",
                                competition._id,
                              );
                            }}
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
    </main>
  );
}






















// "use client";

// import Link from "next/link";
// import {
//   Plus,
//   Search,
//   Trophy,
//   Users,
//   CalendarDays,
//   Clock3,
//   Eye,
//   Pencil,
//   Trash2,
//   Settings2,
//   BookOpen,
//   ChevronRight,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// /* ============================================================
//    TYPES
//    ============================================================ */

// interface Competition {
//   id: string;
//   title: string;
//   category: string;
//   status: string;
//   startDate: string;
//   teams: number;
//   maxTeams: number;

//   /*
//    * Number of subjects currently attached
//    * to this competition.
//    *
//    * This will eventually come from the backend.
//    */
//   subjects: number;

//   /*
//    * Total questions currently attached
//    * to the competition.
//    *
//    * This will eventually come from the backend.
//    */
//   questions: number;
// }

// /* ============================================================
//    TEMPORARY DATA
//    ============================================================

//    Replace this with the backend GET endpoint once your
//    competition API is ready.

//    Recommended future endpoint:

//    GET /solve-and-win/contests/get-all-contests
//    ============================================================ */

// const competitions: Competition[] = [
//   {
//     id: "1",
//     title: "JAMB League 2027 Championship",
//     category: "National",
//     status: "Upcoming",
//     startDate: "15 Jan 2027",
//     teams: 425,
//     maxTeams: 1000,
//     subjects: 5,
//     questions: 180,
//   },
//   {
//     id: "2",
//     title: "Science Challenge",
//     category: "STEM",
//     status: "Registration Open",
//     startDate: "05 Dec 2026",
//     teams: 182,
//     maxTeams: 300,
//     subjects: 3,
//     questions: 90,
//   },
//   {
//     id: "3",
//     title: "Mock CBT Tournament",
//     category: "Practice",
//     status: "Completed",
//     startDate: "18 Jul 2026",
//     teams: 300,
//     maxTeams: 300,
//     subjects: 4,
//     questions: 120,
//   },
// ];

// /* ============================================================
//    STATUS STYLING
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
//    PAGE
//    ============================================================ */

// export default function AdminCompetitionsPage() {
//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto px-4 py-10">

//         {/* ==================================================
//            HEADER
//            ================================================== */}

//         <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

//           <div>
//             <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
//               Admin Dashboard
//             </span>

//             <h1 className="mt-4 text-4xl font-bold text-slate-900">
//               Competitions
//             </h1>

//             <p className="mt-3 max-w-3xl text-lg text-slate-600">
//               Create, configure and manage every competition
//               running on the JAMB League platform.
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
//            STATISTICS
//            ================================================== */}

//         <div className="mb-10 grid gap-6 md:grid-cols-4">

//           <Card className="text-center">
//             <Trophy className="mx-auto h-10 w-10 text-yellow-500" />

//             <h2 className="mt-4 text-3xl font-bold text-slate-900">
//               12
//             </h2>

//             <p className="mt-2 text-slate-600">
//               Total Competitions
//             </p>
//           </Card>

//           <Card className="text-center">
//             <CalendarDays className="mx-auto h-10 w-10 text-blue-600" />

//             <h2 className="mt-4 text-3xl font-bold text-slate-900">
//               3
//             </h2>

//             <p className="mt-2 text-slate-600">
//               Upcoming
//             </p>
//           </Card>

//           <Card className="text-center">
//             <Clock3 className="mx-auto h-10 w-10 text-green-600" />

//             <h2 className="mt-4 text-3xl font-bold text-slate-900">
//               2
//             </h2>

//             <p className="mt-2 text-slate-600">
//               Active
//             </p>
//           </Card>

//           <Card className="text-center">
//             <Users className="mx-auto h-10 w-10 text-purple-600" />

//             <h2 className="mt-4 text-3xl font-bold text-slate-900">
//               2,436
//             </h2>

//             <p className="mt-2 text-slate-600">
//               Registered Teams
//             </p>
//           </Card>

//         </div>

//         {/* ==================================================
//            SEARCH
//            ================================================== */}

//         <Card className="mb-8">
//           <Input
//             placeholder="Search competitions..."
//             leftIcon={
//               <Search className="h-4 w-4" />
//             }
//           />
//         </Card>

//         {/* ==================================================
//            COMPETITION LIST
//            ================================================== */}

//         <div className="space-y-6">

//           {competitions.map(
//             (competition) => (
//               <Card
//                 key={competition.id}
//                 hoverable
//                 className="p-8"
//               >

//                 <div className="flex flex-col gap-7">

//                   {/* ========================================
//                      TOP SECTION
//                      ======================================== */}

//                   <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

//                     {/* Competition Information */}

//                     <div className="min-w-0">

//                       <div className="flex flex-wrap items-center gap-3">

//                         <h2 className="text-2xl font-bold text-slate-900">
//                           {competition.title}
//                         </h2>

//                         <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
//                           {competition.category}
//                         </span>

//                         <span
//                           className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
//                             competition.status,
//                           )}`}
//                         >
//                           {competition.status}
//                         </span>

//                       </div>

//                       {/* Metadata */}

//                       <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">

//                         <span className="flex items-center gap-2">
//                           <CalendarDays className="h-4 w-4" />

//                           {competition.startDate}
//                         </span>

//                         <span className="flex items-center gap-2">
//                           <Users className="h-4 w-4" />

//                           {competition.teams}/
//                           {competition.maxTeams} Teams
//                         </span>

//                         <span className="flex items-center gap-2">
//                           <BookOpen className="h-4 w-4" />

//                           {competition.subjects}{" "}
//                           {competition.subjects === 1
//                             ? "Subject"
//                             : "Subjects"}
//                         </span>

//                         <span className="flex items-center gap-2">
//                           <Trophy className="h-4 w-4" />

//                           {competition.questions} Questions
//                         </span>

//                       </div>

//                     </div>

//                     {/* ======================================
//                        PRIMARY MANAGE BUTTON
//                        ====================================== */}

//                     <Link
//                       href={`/admin/secondary/solveandwin/competitions/${competition.id}`}
//                       className="shrink-0"
//                     >
//                       <Button
//                         leftIcon={
//                           <Settings2 className="h-4 w-4" />
//                         }
//                       >
//                         Manage Competition
//                         <ChevronRight className="ml-1 h-4 w-4" />
//                       </Button>
//                     </Link>

//                   </div>

//                   {/* ========================================
//                      COMPETITION CONTENT SUMMARY
//                      ======================================== */}

//                   <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

//                     <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

//                       <div>

//                         <p className="text-sm font-semibold text-slate-900">
//                           Competition Content
//                         </p>

//                         <p className="mt-1 text-sm text-slate-500">
//                           Manage the subjects and questions
//                           students will answer.
//                         </p>

//                       </div>

//                       <div className="flex flex-wrap gap-3">

//                         <div className="rounded-xl bg-white px-4 py-3 shadow-sm">

//                           <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                             Subjects
//                           </p>

//                           <p className="mt-1 text-lg font-bold text-slate-900">
//                             {competition.subjects}
//                           </p>

//                         </div>

//                         <div className="rounded-xl bg-white px-4 py-3 shadow-sm">

//                           <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
//                             Questions
//                           </p>

//                           <p className="mt-1 text-lg font-bold text-slate-900">
//                             {competition.questions}
//                           </p>

//                         </div>

//                       </div>

//                     </div>

//                   </div>

//                   {/* ========================================
//                      ACTIONS
//                      ======================================== */}

//                   <div className="flex flex-wrap items-center gap-3 border-t pt-5">

//                     {/* Manage */}

//                     <Link
//                       href={`/admin/secondary/solveandwin/competitions/${competition.id}`}
//                     >
//                       <Button
//                         variant="outline"
//                         leftIcon={
//                           <Settings2 className="h-4 w-4" />
//                         }
//                       >
//                         Manage
//                       </Button>
//                     </Link>

//                     {/* View */}

//                     <Link
//                       href={`/admin/secondary/solveandwin/competitions/${competition.id}`}
//                     >
//                       <Button
//                         variant="outline"
//                         leftIcon={
//                           <Eye className="h-4 w-4" />
//                         }
//                       >
//                         View
//                       </Button>
//                     </Link>

//                     {/* Edit */}

//                     <Link
//                       href={`/admin/secondary/solveandwin/competitions/${competition.id}/edit`}
//                     >
//                       <Button
//                         variant="outline"
//                         leftIcon={
//                           <Pencil className="h-4 w-4" />
//                         }
//                       >
//                         Edit
//                       </Button>
//                     </Link>

//                     {/* Delete */}

//                     <Button
//                       variant="destructive"
//                       leftIcon={
//                         <Trash2 className="h-4 w-4" />
//                       }
//                       onClick={() => {
//                         /*
//                          * TODO:
//                          *
//                          * Replace this with your backend
//                          * delete request.
//                          *
//                          * DELETE
//                          * /admin/competitions/:competitionId
//                          */

//                         console.log(
//                           "Delete competition:",
//                           competition.id,
//                         );
//                       }}
//                     >
//                       Delete
//                     </Button>

//                   </div>

//                 </div>

//               </Card>
//             ),
//           )}

//         </div>

//         {/* ==================================================
//            EMPTY STATE
//            ================================================== */}

//         {competitions.length === 0 && (
//           <Card className="p-12 text-center">

//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
//               <Trophy className="h-8 w-8 text-blue-600" />
//             </div>

//             <h2 className="mt-5 text-xl font-bold text-slate-900">
//               No competitions yet
//             </h2>

//             <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
//               Create your first competition and then add
//               subjects and questions from the competition
//               management page.
//             </p>

//             <div className="mt-6">
//               <Link href="/admin/secondary/competitions/create">
//                 <Button
//                   leftIcon={
//                     <Plus className="h-4 w-4" />
//                   }
//                 >
//                   Create Competition
//                 </Button>
//               </Link>
//             </div>

//           </Card>
//         )}

//       </div>
//     </main>
//   );
// }
