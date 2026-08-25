




"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Filter,
  GraduationCap,
  MapPin,
  Trophy,
  Users,
  Video,
  X,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type CompetitionStatus =
  | "UPCOMING"
  | "LIVE"
  | "COMPLETED";

type CompetitionType =
  | "INDIVIDUAL"
  | "TEAM";

interface Competition {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: CompetitionType;
  status: CompetitionStatus;

  startDate: string;
  endDate: string;

  startTime: string;
  endTime: string;

  timezone: string;

  participants: number;
  maxParticipants: number;

  registered: boolean;
  teamName?: string;

  location: "ONLINE" | "PHYSICAL";

  color: string;
}

/* ============================================================
   TEST DATA
   Replace this later with your backend API.
============================================================ */

const competitions: Competition[] = [
  {
    id: "jamb-league-2027-physics",
    title: "JAMB League 2027 — Physics Challenge",
    description:
      "Compete against other JAMB candidates in a timed Physics challenge designed to test speed, accuracy, and exam strategy.",
    subject: "Physics",
    type: "TEAM",
    status: "UPCOMING",

    startDate: "2027-01-16",
    endDate: "2027-01-16",

    startTime: "10:00 AM",
    endTime: "11:30 AM",

    timezone: "WAT",

    participants: 486,
    maxParticipants: 1000,

    registered: true,
    teamName: "Quantum Force",

    location: "ONLINE",

    color: "blue",
  },

  {
    id: "jamb-league-2027-chemistry",
    title: "JAMB League 2027 — Chemistry Challenge",
    description:
      "A competitive Chemistry challenge covering important JAMB topics, calculations, reactions, and problem-solving.",
    subject: "Chemistry",
    type: "TEAM",
    status: "UPCOMING",

    startDate: "2027-01-23",
    endDate: "2027-01-23",

    startTime: "2:00 PM",
    endTime: "3:30 PM",

    timezone: "WAT",

    participants: 712,
    maxParticipants: 1000,

    registered: false,

    location: "ONLINE",

    color: "emerald",
  },

  {
    id: "jamb-league-2027-mathematics",
    title: "JAMB League 2027 — Mathematics Battle",
    description:
      "Test your Mathematics speed and accuracy against other students preparing for the JAMB examination.",
    subject: "Mathematics",
    type: "INDIVIDUAL",
    status: "UPCOMING",

    startDate: "2027-02-06",
    endDate: "2027-02-06",

    startTime: "10:00 AM",
    endTime: "12:00 PM",

    timezone: "WAT",

    participants: 925,
    maxParticipants: 1500,

    registered: true,

    location: "ONLINE",

    color: "purple",
  },

  {
    id: "jamb-league-2027-english",
    title: "JAMB League 2027 — Use of English",
    description:
      "Challenge yourself with comprehension, vocabulary, grammar, and other JAMB Use of English topics.",
    subject: "Use of English",
    type: "INDIVIDUAL",
    status: "COMPLETED",

    startDate: "2026-12-20",
    endDate: "2026-12-20",

    startTime: "10:00 AM",
    endTime: "11:00 AM",

    timezone: "WAT",

    participants: 1342,
    maxParticipants: 1500,

    registered: true,

    location: "ONLINE",

    color: "orange",
  },
];

/* ============================================================
   HELPERS
============================================================ */

function parseDate(date: string) {
  return new Date(`${date}T00:00:00`);
}

function formatDate(date: string) {
  return parseDate(date).toLocaleDateString(
    "en-NG",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });
}

function getStatusLabel(
  status: CompetitionStatus,
) {
  switch (status) {
    case "LIVE":
      return "Live Now";

    case "UPCOMING":
      return "Upcoming";

    case "COMPLETED":
      return "Completed";

    default:
      return status;
  }
}

function getTypeLabel(type: CompetitionType) {
  return type === "TEAM"
    ? "Team Competition"
    : "Individual Competition";
}

function getDaysUntil(date: string) {
  const today = new Date();
  const target = parseDate(date);

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const targetStart = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const difference =
    targetStart.getTime() -
    todayStart.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24),
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function CompetitionCalendarPage() {
  const [currentMonth, setCurrentMonth] =
    useState(new Date(2027, 0, 1));

  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<CompetitionStatus | "ALL">(
      "ALL",
    );

  const [view, setView] = useState<
    "CALENDAR" | "LIST"
  >("CALENDAR");

  /* ==========================================================
     FILTERED COMPETITIONS
  ========================================================== */

  const filteredCompetitions = useMemo(() => {
    if (statusFilter === "ALL") {
      return competitions;
    }

    return competitions.filter(
      (competition) =>
        competition.status === statusFilter,
    );
  }, [statusFilter]);

  /* ==========================================================
     MONTH INFORMATION
  ========================================================== */

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(
    year,
    month,
    1,
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const calendarDays = Array.from(
    {
      length: firstDay + daysInMonth,
    },
    (_, index) => {
      if (index < firstDay) {
        return null;
      }

      return index - firstDay + 1;
    },
  );

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const previousMonth = () => {
    setCurrentMonth(
      new Date(year, month - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(year, month + 1, 1),
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  /* ==========================================================
     GET COMPETITIONS FOR DAY
  ========================================================== */

  const getCompetitionsForDay = (
    day: number,
  ) => {
    const dateString = `${year}-${String(
      month + 1,
    ).padStart(2, "0")}-${String(day).padStart(
      2,
      "0",
    )}`;

    return filteredCompetitions.filter(
      (competition) =>
        competition.startDate === dateString,
    );
  };

  /* ==========================================================
     PERSONAL STATS
  ========================================================== */

  const registeredCompetitions =
    competitions.filter(
      (competition) => competition.registered,
    );

  const upcomingCompetitions =
    competitions.filter(
      (competition) =>
        competition.status === "UPCOMING",
    );

  const completedCompetitions =
    competitions.filter(
      (competition) =>
        competition.status === "COMPLETED",
    );

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="space-y-8">
      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <section>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
              <CalendarDays size={14} />

              My Competition Calendar
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Your Competition Schedule
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Keep track of competitions you have joined,
              upcoming battles, team events, and completed
              challenges.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/student/competitions"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Trophy size={17} />

              Competitions
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          PERSONAL SUMMARY
      ====================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Registered */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Trophy size={21} />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              My Events
            </span>
          </div>

          <p className="mt-5 text-3xl font-extrabold text-slate-900">
            {registeredCompetitions.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Competitions joined
          </p>
        </div>

        {/* Upcoming */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Clock3 size={21} />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Coming Up
            </span>
          </div>

          <p className="mt-5 text-3xl font-extrabold text-slate-900">
            {upcomingCompetitions.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Upcoming competitions
          </p>
        </div>

        {/* Completed */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <GraduationCap size={21} />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              History
            </span>
          </div>

          <p className="mt-5 text-3xl font-extrabold text-slate-900">
            {completedCompetitions.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Completed competitions
          </p>
        </div>

        {/* Teams */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Users size={21} />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Teams
            </span>
          </div>

          <p className="mt-5 text-3xl font-extrabold text-slate-900">
            {
              competitions.filter(
                (competition) =>
                  competition.registered &&
                  competition.type === "TEAM",
              ).length
            }
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Team competitions
          </p>
        </div>
      </section>

      {/* ======================================================
          CALENDAR CONTROLS
      ====================================================== */}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Month */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previousMonth}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
              aria-label="Previous month"
            >
              <ChevronLeft size={19} />
            </button>

            <h2 className="min-w-[180px] text-center text-xl font-bold text-slate-900">
              {formatMonthYear(currentMonth)}
            </h2>

            <button
              type="button"
              onClick={nextMonth}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50"
              aria-label="Next month"
            >
              <ChevronRight size={19} />
            </button>

            <button
              type="button"
              onClick={goToToday}
              className="ml-2 hidden rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 sm:block"
            >
              Today
            </button>
          </div>

          {/* Controls */}

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter
                size={16}
                className="text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | CompetitionStatus
                      | "ALL",
                  )
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="ALL">
                  All Events
                </option>

                <option value="UPCOMING">
                  Upcoming
                </option>

                <option value="LIVE">
                  Live
                </option>

                <option value="COMPLETED">
                  Completed
                </option>
              </select>
            </div>

            <div className="flex rounded-xl border border-slate-200 p-1">
              <button
                type="button"
                onClick={() =>
                  setView("CALENDAR")
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  view === "CALENDAR"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Calendar
              </button>

              <button
                type="button"
                onClick={() =>
                  setView("LIST")
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  view === "LIST"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* ====================================================
            CALENDAR VIEW
        ==================================================== */}

        {view === "CALENDAR" && (
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              {/* Weekdays */}

              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (
                  <div
                    key={day}
                    className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}

              <div className="grid grid-cols-7">
                {calendarDays.map(
                  (day, index) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="min-h-[130px] border-b border-r border-slate-100 bg-slate-50/40"
                        />
                      );
                    }

                    const dayCompetitions =
                      getCompetitionsForDay(day);

                    const isToday =
                      new Date().getFullYear() ===
                        year &&
                      new Date().getMonth() ===
                        month &&
                      new Date().getDate() ===
                        day;

                    return (
                      <div
                        key={day}
                        className={`min-h-[130px] border-b border-r border-slate-100 p-2 ${
                          isToday
                            ? "bg-blue-50/40"
                            : "bg-white"
                        }`}
                      >
                        {/* Day number */}

                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                              isToday
                                ? "bg-blue-600 text-white"
                                : "text-slate-500"
                            }`}
                          >
                            {day}
                          </span>

                          {dayCompetitions.length >
                            0 && (
                            <span className="text-[10px] font-bold text-blue-500">
                              {
                                dayCompetitions.length
                              }{" "}
                              event
                              {dayCompetitions.length >
                              1
                                ? "s"
                                : ""}
                            </span>
                          )}
                        </div>

                        {/* Events */}

                        <div className="space-y-1.5">
                          {dayCompetitions.map(
                            (competition) => (
                              <button
                                key={
                                  competition.id
                                }
                                type="button"
                                onClick={() =>
                                  setSelectedCompetition(
                                    competition,
                                  )
                                }
                                className="w-full rounded-xl bg-blue-50 p-2 text-left transition hover:bg-blue-100"
                              >
                                <p className="line-clamp-2 text-[11px] font-bold leading-4 text-blue-700">
                                  {
                                    competition.title
                                  }
                                </p>

                                <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-blue-500">
                                  <Clock3
                                    size={10}
                                  />

                                  {
                                    competition.startTime
                                  }
                                </div>

                                {competition.registered && (
                                  <div className="mt-1 text-[9px] font-bold text-emerald-600">
                                    Registered
                                  </div>
                                )}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            LIST VIEW
        ==================================================== */}

        {view === "LIST" && (
          <div className="divide-y divide-slate-100">
            {filteredCompetitions.length ===
            0 ? (
              <div className="px-6 py-16 text-center">
                <CalendarDays
                  size={32}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-bold text-slate-900">
                  No competitions found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try another filter.
                </p>
              </div>
            ) : (
              filteredCompetitions.map(
                (competition) => (
                  <button
                    key={competition.id}
                    type="button"
                    onClick={() =>
                      setSelectedCompetition(
                        competition,
                      )
                    }
                    className="flex w-full flex-col gap-4 p-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Trophy size={21} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            {
                              competition.title
                            }
                          </h3>

                          {competition.registered && (
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                              Registered
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(
                            competition.startDate,
                          )}
                          {" • "}
                          {
                            competition.startTime
                          }
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {
                            competition.subject
                          }
                          {" • "}
                          {getTypeLabel(
                            competition.type,
                          )}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      size={19}
                      className="hidden text-slate-400 sm:block"
                    />
                  </button>
                ),
              )
            )}
          </div>
        )}
      </section>

      {/* ======================================================
          UPCOMING EVENTS
      ====================================================== */}

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your Upcoming Competitions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Competitions currently on your schedule.
            </p>
          </div>

          <Link
            href="/student/competitions"
            className="hidden items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 sm:flex"
          >
            Browse competitions

            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {upcomingCompetitions
            .slice(0, 4)
            .map((competition, index) => {
              const daysUntil = getDaysUntil(
                competition.startDate,
              );

              return (
                <motion.article
                  key={competition.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* Top */}

                  <div className="border-b border-slate-100 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
                            {
                              competition.subject
                            }
                          </span>

                          {competition.registered && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                              Registered
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-slate-900">
                          {
                            competition.title
                          }
                        </h3>
                      </div>

                      <div className="shrink-0 rounded-2xl bg-slate-900 px-3 py-2 text-center text-white">
                        <p className="text-lg font-extrabold">
                          {daysUntil > 0
                            ? daysUntil
                            : "Today"}
                        </p>

                        {daysUntil > 0 && (
                          <p className="text-[9px] font-semibold uppercase text-white/60">
                            days
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details */}

                  <div className="grid grid-cols-2 gap-3 p-5">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <CalendarDays
                          size={15}
                        />

                        <span className="text-[10px] font-semibold uppercase">
                          Date
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {formatDate(
                          competition.startDate,
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock3
                          size={15}
                        />

                        <span className="text-[10px] font-semibold uppercase">
                          Time
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {
                          competition.startTime
                        }{" "}
                        {competition.timezone}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users size={15} />

                        <span className="text-[10px] font-semibold uppercase">
                          Participants
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {
                          competition.participants
                        }{" "}
                        /{" "}
                        {
                          competition.maxParticipants
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        {competition.location ===
                        "ONLINE" ? (
                          <Video size={15} />
                        ) : (
                          <MapPin size={15} />
                        )}

                        <span className="text-[10px] font-semibold uppercase">
                          Location
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-bold text-slate-800">
                        {competition.location}
                      </p>
                    </div>
                  </div>

                  {/* Action */}

                  <div className="border-t border-slate-100 p-5">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCompetition(
                          competition,
                        )
                      }
                      className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                    >
                      <span>
                        View Competition
                      </span>

                      <ChevronRight
                        size={17}
                      />
                    </button>
                  </div>
                </motion.article>
              );
            })}
        </div>
      </section>

      {/* ======================================================
          COMPETITION DETAILS MODAL
      ====================================================== */}

      {selectedCompetition && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedCompetition(null)
          }
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}

            <div className="relative overflow-hidden bg-slate-950 p-6 text-white sm:p-8">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

              <button
                type="button"
                onClick={() =>
                  setSelectedCompetition(
                    null,
                  )
                }
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-slate-900"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300">
                  <Trophy size={14} />

                  {getStatusLabel(
                    selectedCompetition.status,
                  )}
                </span>

                <h2 className="mt-4 pr-8 text-2xl font-extrabold sm:text-3xl">
                  {
                    selectedCompetition.title
                  }
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {
                    selectedCompetition.description
                  }
                </p>
              </div>
            </div>

            {/* Details */}

            <div className="space-y-6 p-6 sm:p-8">
              {/* Date and time */}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarDays
                      size={17}
                    />

                    <span className="text-xs font-semibold">
                      Date
                    </span>
                  </div>

                  <p className="mt-2 font-bold text-slate-900">
                    {formatDate(
                      selectedCompetition.startDate,
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock3 size={17} />

                    <span className="text-xs font-semibold">
                      Competition Time
                    </span>
                  </div>

                  <p className="mt-2 font-bold text-slate-900">
                    {
                      selectedCompetition.startTime
                    }{" "}
                    —{" "}
                    {
                      selectedCompetition.endTime
                    }{" "}
                    {
                      selectedCompetition.timezone
                    }
                  </p>
                </div>
              </div>

              {/* Competition information */}

              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Competition Information
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">
                      Subject
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {
                        selectedCompetition.subject
                      }
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">
                      Competition Type
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {getTypeLabel(
                        selectedCompetition.type,
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">
                      Participants
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {
                        selectedCompetition.participants
                      }{" "}
                      /{" "}
                      {
                        selectedCompetition.maxParticipants
                      }
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {
                        selectedCompetition.location
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration */}

              {selectedCompetition.registered && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Trophy size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-emerald-800">
                        You are registered
                      </p>

                      {selectedCompetition.teamName && (
                        <p className="mt-1 text-xs text-emerald-700">
                          Team:{" "}
                          <span className="font-bold">
                            {
                              selectedCompetition.teamName
                            }
                          </span>
                        </p>
                      )}

                      <p className="mt-1 text-xs text-emerald-700">
                        This competition has
                        been added to your
                        personal calendar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}

              <div className="flex flex-col gap-3 sm:flex-row">
                {selectedCompetition.status ===
                  "UPCOMING" &&
                  selectedCompetition.registered && (
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      Open Competition
                      <ExternalLink
                        size={16}
                      />
                    </button>
                  )}

                {!selectedCompetition.registered &&
                  selectedCompetition.status ===
                    "UPCOMING" && (
                    <button
                      type="button"
                      className="flex-1 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                    >
                      Register for Competition
                    </button>
                  )}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedCompetition(
                      null,
                    )
                  }
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}