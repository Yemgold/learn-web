



// src/app/admin/(admin)/secondary/quiz-board/page.tsx

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileCheck2,
  Gamepad2,
  HelpCircle,
  Plus,
  Radio,
  Settings2,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type CompetitionStatus =
  | "DRAFT"
  | "UPCOMING"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

type Competition = {
  id: string;
  title: string;
  subject: string;
  examType: string;
  status: CompetitionStatus;
  players: number;
  maxPlayers: number;
  questions: number;
  winnerReward: number;
  startsAt: string;
};

/* ============================================================
   MOCK DATA
   Replace with backend data later.
============================================================ */

const MOCK_COMPETITIONS: Competition[] = [
  {
    id: "biology-speed-challenge",
    title: "Biology Speed Challenge",
    subject: "Biology",
    examType: "JAMB",
    status: "LIVE",
    players: 20,
    maxPlayers: 20,
    questions: 60,
    winnerReward: 100,
    startsAt: "2026-09-09T09:00:00",
  },
  {
    id: "chemistry-championship",
    title: "Chemistry Championship",
    subject: "Chemistry",
    examType: "JAMB",
    status: "UPCOMING",
    players: 14,
    maxPlayers: 20,
    questions: 60,
    winnerReward: 200,
    startsAt: "2026-09-09T11:30:00",
  },
  {
    id: "physics-power-round",
    title: "Physics Power Round",
    subject: "Physics",
    examType: "JAMB",
    status: "UPCOMING",
    players: 8,
    maxPlayers: 20,
    questions: 60,
    winnerReward: 160,
    startsAt: "2026-09-09T13:00:00",
  },
  {
    id: "english-quick-fire",
    title: "English Quick Fire",
    subject: "Use of English",
    examType: "JAMB",
    status: "COMPLETED",
    players: 20,
    maxPlayers: 20,
    questions: 60,
    winnerReward: 100,
    startsAt: "2026-09-08T09:00:00",
  },
  {
    id: "mathematics-masterclass",
    title: "Mathematics Masterclass",
    subject: "Mathematics",
    examType: "JAMB",
    status: "DRAFT",
    players: 0,
    maxPlayers: 20,
    questions: 0,
    winnerReward: 200,
    startsAt: "2026-09-10T14:30:00",
  },
];

/* ============================================================
   HELPERS
============================================================ */

function getStatusClasses(status: CompetitionStatus) {
  switch (status) {
    case "LIVE":
      return "border-red-200 bg-red-50 text-red-700";

    case "UPCOMING":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "COMPLETED":
      return "border-slate-200 bg-slate-100 text-slate-600";

    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getStatusLabel(status: CompetitionStatus) {
  switch (status) {
    case "LIVE":
      return "Live";

    case "UPCOMING":
      return "Upcoming";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return "Draft";
  }
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

/* ============================================================
   PAGE
============================================================ */

export default function QuizBoardAdminPage() {
  const competitions = MOCK_COMPETITIONS;

  const liveCompetitions = competitions.filter(
    (competition) => competition.status === "LIVE",
  );

  const upcomingCompetitions = competitions.filter(
    (competition) => competition.status === "UPCOMING",
  );

  const completedCompetitions = competitions.filter(
    (competition) => competition.status === "COMPLETED",
  );

  const draftCompetitions = competitions.filter(
    (competition) => competition.status === "DRAFT",
  );

  const totalParticipants = competitions.reduce(
    (total, competition) => total + competition.players,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Admin Dashboard
          </Link>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <Gamepad2 className="h-4 w-4" />
                Quiz Board Control Center
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Quiz Board
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Create and manage competitive quiz boards, configure questions,
                monitor live competitions, track participants and review
                results.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/secondary/quiz-board/quiz-competitions"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Trophy className="h-4 w-4" />
                Manage Boards
              </Link>

              <Link
                href="/admin/secondary/quiz-board/quiz-competitions/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
                Create Quiz Board
              </Link>
            </div>
          </div>
        </div>

        {/* ======================================================
            LIVE ALERT
        ====================================================== */}

        {liveCompetitions.length > 0 && (
          <section className="mb-8 overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
            <div className="border-b border-red-100 bg-red-50 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                    <Radio className="h-5 w-5 animate-pulse text-red-600" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-red-900">
                      Live competition in progress
                    </p>

                    <p className="mt-0.5 text-xs text-red-700">
                      {liveCompetitions.length} Quiz Board
                      {liveCompetitions.length !== 1 ? "s are" : " is"} live
                      right now.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/secondary/quiz-board/quiz-competitions/${liveCompetitions[0].id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Open Live Control
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3">
              {liveCompetitions.map((competition) => (
                <LiveCompetitionCard
                  key={competition.id}
                  competition={competition}
                />
              ))}
            </div>
          </section>
        )}

        {/* ======================================================
            OVERVIEW
        ====================================================== */}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            icon={<Trophy className="h-5 w-5" />}
            label="Competitions"
            value={String(competitions.length)}
            description="Total Quiz Boards"
          />

          <OverviewCard
            icon={<Radio className="h-5 w-5" />}
            label="Live Now"
            value={String(liveCompetitions.length)}
            description="Currently running"
            accent="red"
          />

          <OverviewCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Upcoming"
            value={String(upcomingCompetitions.length)}
            description="Scheduled competitions"
            accent="blue"
          />

          <OverviewCard
            icon={<Users className="h-5 w-5" />}
            label="Participants"
            value={String(totalParticipants)}
            description="Across all boards"
            accent="violet"
          />
        </section>

        {/* ======================================================
            STATUS SUMMARY
        ====================================================== */}

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <StatusSummary
            label="Draft"
            value={draftCompetitions.length}
            description="Still being configured"
          />

          <StatusSummary
            label="Upcoming"
            value={upcomingCompetitions.length}
            description="Waiting to start"
          />

          <StatusSummary
            label="Live"
            value={liveCompetitions.length}
            description="Currently running"
            live
          />

          <StatusSummary
            label="Completed"
            value={completedCompetitions.length}
            description="Finished competitions"
          />
        </section>

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ====================================================
              LEFT
          ==================================================== */}

          <section className="space-y-8 lg:col-span-2">
            {/* Competition Management */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Settings2 className="h-5 w-5" />
                  </div>

                  <h2 className="mt-5 text-xl font-black text-slate-950">
                    Competition Management
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Configure each Quiz Board from creation through questions,
                    scheduling, rewards and competition settings.
                  </p>
                </div>

                <Link
                  href="/admin/secondary/quiz-board/quiz-competitions"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <ManagementStep
                  icon={<Trophy className="h-5 w-5" />}
                  title="Competition"
                  description="Name, schedule and entry rules."
                />

                <ManagementStep
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Subjects"
                  description="Choose the competition subject."
                />

                <ManagementStep
                  icon={<HelpCircle className="h-5 w-5" />}
                  title="Questions"
                  description="Add and validate questions."
                />

                <ManagementStep
                  icon={<Settings2 className="h-5 w-5" />}
                  title="Settings"
                  description="Rounds, rewards and rules."
                />
              </div>
            </section>

            {/* Recent Competitions */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />

                    <h2 className="text-xl font-black text-slate-950">
                      Recent Quiz Boards
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Monitor the latest competitions and their current states.
                  </p>
                </div>

                <Link
                  href="/admin/secondary/quiz-board/quiz-competitions"
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {competitions.map((competition) => (
                  <CompetitionRow
                    key={competition.id}
                    competition={competition}
                  />
                ))}
              </div>
            </section>

            {/* Competition Format */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    Quiz Board Format
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    The competition progressively eliminates players until
                    only one champion remains.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  ["Round 1", "20 → 15"],
                  ["Round 2", "15 → 10"],
                  ["Round 3", "10 → 5"],
                  ["Round 4", "5 → 2"],
                  ["Final", "2 → 1"],
                ].map(([round, players], index) => (
                  <div
                    key={round}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {round}
                      </span>

                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-blue-600 shadow-sm">
                        {index + 1}
                      </span>
                    </div>

                    <p className="mt-3 text-xl font-black text-slate-900">
                      {players}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {round === "Final"
                        ? "Champion decided"
                        : "Elimination stage"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </section>

          {/* ====================================================
              SIDEBAR
          ==================================================== */}

          <aside className="space-y-6">
            {/* Quick Actions */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-950">
                    Quick Actions
                  </h2>

                  <p className="text-xs text-slate-500">
                    Common administration tasks
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <QuickAction
                  href="/admin/secondary/quiz-board/quiz-competitions/create"
                  icon={<Plus className="h-5 w-5" />}
                  title="Create Quiz Board"
                  description="Launch a new competition"
                />

                <QuickAction
                  href="/admin/secondary/quiz-board/quiz-competitions"
                  icon={<Trophy className="h-5 w-5" />}
                  title="Manage Competitions"
                  description="View and configure boards"
                />

                <QuickAction
                  href="/admin/secondary/quiz-board/questions"
                  icon={<HelpCircle className="h-5 w-5" />}
                  title="Question Bank"
                  description="Manage quiz questions"
                />

                <QuickAction
                  href="/admin/secondary/quiz-board/results"
                  icon={<BarChart3 className="h-5 w-5" />}
                  title="Results & Analytics"
                  description="Review competition performance"
                />
              </div>
            </section>

            {/* Live Control */}

            <section className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
              <div className="border-b border-red-100 bg-red-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                    <Radio className="h-5 w-5 text-red-600" />
                  </div>

                  <div>
                    <h2 className="font-black text-red-950">
                      Live Control
                    </h2>

                    <p className="mt-0.5 text-xs text-red-700">
                      Real-time competition monitoring
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {liveCompetitions.length > 0 ? (
                  <div className="space-y-4">
                    {liveCompetitions.map((competition) => (
                      <div key={competition.id}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-900">
                              {competition.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {competition.players}/{competition.maxPlayers}{" "}
                              players
                            </p>
                          </div>

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                            LIVE
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Link
                            href={`/admin/secondary/quiz-board/quiz-competitions/${competition.id}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
                          >
                            <Settings2 className="h-3.5 w-3.5" />
                            Control
                          </Link>

                          <Link
                            href={`/student/quiz-board/${competition.id}/watch`}
                            target="_blank"
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Watch
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-5 text-center">
                    <Radio className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-bold text-slate-700">
                      No live competitions
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Live competitions will appear here when they start.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Configuration Checklist */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FileCheck2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-black text-slate-950">
                    Setup Checklist
                  </h2>

                  <p className="text-xs text-slate-500">
                    Before starting a competition
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <ChecklistItem
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Competition configured"
                  description="Name, subject and schedule"
                />

                <ChecklistItem
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Questions available"
                  description="Enough questions for all rounds"
                />

                <ChecklistItem
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Rewards configured"
                  description="Entry fee and winner reward"
                />

                <ChecklistItem
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Rules configured"
                  description="Elimination and timing rules"
                />
              </div>
            </section>
          </aside>
        </div>

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <section className="mt-8 rounded-3xl bg-slate-950 p-6 sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <ShieldIcon />
              </div>

              <div>
                <p className="text-sm font-black text-white">
                  Quiz Board administration
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">
                  Competition timing, answer order, qualification, elimination
                  and final results should ultimately be controlled by the
                  backend to ensure fair real-time competition.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Zap className="h-4 w-4" />
              Configure • Monitor • Compete
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   OVERVIEW CARD
============================================================ */

interface OverviewCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  accent?: "blue" | "red" | "violet";
}

function OverviewCard({
  icon,
  label,
  value,
  description,
  accent = "blue",
}: OverviewCardProps) {
  const iconClasses = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClasses[accent]}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </section>
  );
}

/* ============================================================
   STATUS SUMMARY
============================================================ */

interface StatusSummaryProps {
  label: string;
  value: number;
  description: string;
  live?: boolean;
}

function StatusSummary({
  label,
  value,
  description,
  live = false,
}: StatusSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>

        {live && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        )}
      </div>

      <p
        className={`mt-2 text-2xl font-black ${
          live ? "text-red-600" : "text-slate-950"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

/* ============================================================
   LIVE COMPETITION CARD
============================================================ */

function LiveCompetitionCard({
  competition,
}: {
  competition: Competition;
}) {
  const percentage =
    competition.maxPlayers > 0
      ? Math.round((competition.players / competition.maxPlayers) * 100)
      : 0;

  return (
    <div className="rounded-2xl border border-red-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">
            {competition.title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {competition.subject} • {competition.examType}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          LIVE
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">
          {competition.players}/{competition.maxPlayers} players
        </span>

        <span className="font-bold text-slate-500">{percentage}%</span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-red-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   MANAGEMENT STEP
============================================================ */

function ManagementStep({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   COMPETITION ROW
============================================================ */

function CompetitionRow({
  competition,
}: {
  competition: Competition;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Trophy className="h-4 w-4 text-slate-600" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-black text-slate-900">
              {competition.title}
            </h3>

            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClasses(
                competition.status,
              )}`}
            >
              {getStatusLabel(competition.status)}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>
              {competition.examType} • {competition.subject}
            </span>

            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {competition.players}/{competition.maxPlayers}
            </span>

            <span className="inline-flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              {competition.questions}
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDate(competition.startsAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {competition.status === "LIVE" && (
          <Link
            href={`/admin/secondary/quiz-board/quiz-competitions/${competition.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            <Radio className="h-3.5 w-3.5" />
            Control
          </Link>
        )}

        <Link
          href={`/admin/secondary/quiz-board/quiz-competitions/${competition.id}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          Manage
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">{title}</p>

        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
    </Link>
  );
}

/* ============================================================
   CHECKLIST ITEM
============================================================ */

function ChecklistItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-emerald-600">{icon}</div>

      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>

        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

/* ============================================================
   SIMPLE SHIELD ICON
============================================================ */

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}