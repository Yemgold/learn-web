






"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface Participant {
  id: string;
  name: string;
  email: string;
  challenge: string;
  examType: string;
  score: number;
  totalQuestions: number;
  entryCost: number;
  completed: boolean;
  rank: number | null;
  reward: number;
  rewardStatus:
    | "pending"
    | "processing"
    | "paid"
    | "failed"
    | "not_eligible";
  joinedAt: string;
}

const participants: Participant[] = [
  {
    id: "participant-001",
    name: "John Doe",
    email: "john@example.com",
    challenge: "JAMB Quick Challenge",
    examType: "jamb",
    score: 9,
    totalQuestions: 10,
    entryCost: 500,
    completed: true,
    rank: 1,
    reward: 500,
    rewardStatus: "paid",
    joinedAt: "27 August 2026, 10:42 AM",
  },
  {
    id: "participant-002",
    name: "Sarah James",
    email: "sarah@example.com",
    challenge: "JAMB Quick Challenge",
    examType: "jamb",
    score: 8,
    totalQuestions: 10,
    entryCost: 500,
    completed: true,
    rank: 2,
    reward: 0,
    rewardStatus: "not_eligible",
    joinedAt: "27 August 2026, 10:35 AM",
  },
  {
    id: "participant-003",
    name: "David Michael",
    email: "david@example.com",
    challenge: "JAMB Quick Challenge",
    examType: "jamb",
    score: 7,
    totalQuestions: 10,
    entryCost: 500,
    completed: true,
    rank: 3,
    reward: 0,
    rewardStatus: "not_eligible",
    joinedAt: "27 August 2026, 10:29 AM",
  },
  {
    id: "participant-004",
    name: "Grace Okafor",
    email: "grace@example.com",
    challenge: "JAMB Biology Challenge",
    examType: "jamb",
    score: 17,
    totalQuestions: 20,
    entryCost: 750,
    completed: true,
    rank: 1,
    reward: 1000,
    rewardStatus: "pending",
    joinedAt: "27 August 2026, 9:50 AM",
  },
  {
    id: "participant-005",
    name: "Michael Adams",
    email: "michael@example.com",
    challenge: "JAMB Biology Challenge",
    examType: "jamb",
    score: 15,
    totalQuestions: 20,
    entryCost: 750,
    completed: true,
    rank: 2,
    reward: 0,
    rewardStatus: "not_eligible",
    joinedAt: "27 August 2026, 9:43 AM",
  },
  {
    id: "participant-006",
    name: "Emmanuel Peter",
    email: "emmanuel@example.com",
    challenge: "JAMB Science Master",
    examType: "jamb",
    score: 21,
    totalQuestions: 30,
    entryCost: 1000,
    completed: false,
    rank: null,
    reward: 0,
    rewardStatus: "pending",
    joinedAt: "27 August 2026, 9:12 AM",
  },
];

export default function SolveAndWinParticipantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [challengeFilter, setChallengeFilter] =
    useState("all");

  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const searchMatch =
        searchValue === "" ||
        participant.name
          .toLowerCase()
          .includes(searchValue) ||
        participant.email
          .toLowerCase()
          .includes(searchValue) ||
        participant.challenge
          .toLowerCase()
          .includes(searchValue);

      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "completed" &&
          participant.completed) ||
        (statusFilter === "in_progress" &&
          !participant.completed) ||
        (statusFilter === "reward_pending" &&
          participant.rewardStatus === "pending") ||
        (statusFilter === "reward_paid" &&
          participant.rewardStatus === "paid");

      const challengeMatch =
        challengeFilter === "all" ||
        participant.challenge ===
          challengeFilter;

      return (
        searchMatch &&
        statusMatch &&
        challengeMatch
      );
    });
  }, [
    search,
    statusFilter,
    challengeFilter,
  ]);

  const completedCount = participants.filter(
    (participant) => participant.completed,
  ).length;

  const inProgressCount =
    participants.length - completedCount;

  const totalEntries = participants.reduce(
    (total, participant) =>
      total + participant.entryCost,
    0,
  );

  const totalRewards = participants.reduce(
    (total, participant) =>
      total + participant.reward,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/solveandwin"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Solve & Win
            </Link>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              Participants
            </h1>

            <p className="mt-2 text-slate-600">
              Monitor Solve & Win entries, scores, rankings,
              completion and rewards.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Export Participants
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Participants"
            value={participants.length.toLocaleString()}
            description="All challenge entries"
          />

          <StatCard
            label="Completed"
            value={completedCount.toLocaleString()}
            description="Completed challenges"
          />

          <StatCard
            label="In Progress"
            value={inProgressCount.toLocaleString()}
            description="Active participants"
          />

          <StatCard
            label="Rewards"
            value={`₦${totalRewards.toLocaleString()}`}
            description="Configured participant rewards"
          />
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Participant Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search and filter challenge participants.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Name, email or challenge..."
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Challenge
              </label>

              <select
                value={challengeFilter}
                onChange={(event) =>
                  setChallengeFilter(
                    event.target.value,
                  )
                }
                className={inputClass}
              >
                <option value="all">
                  All Challenges
                </option>

                <option value="JAMB Quick Challenge">
                  JAMB Quick Challenge
                </option>

                <option value="JAMB Biology Challenge">
                  JAMB Biology Challenge
                </option>

                <option value="JAMB Science Master">
                  JAMB Science Master
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value,
                  )
                }
                className={inputClass}
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="in_progress">
                  In Progress
                </option>

                <option value="reward_pending">
                  Reward Pending
                </option>

                <option value="reward_paid">
                  Reward Paid
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Participants Table */}
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Participants
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing {filteredParticipants.length} participant
                  {filteredParticipants.length === 1
                    ? ""
                    : "s"}
                </p>
              </div>

              <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                Entries: ₦
                {totalEntries.toLocaleString()}
              </div>
            </div>
          </div>

          {filteredParticipants.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                👥
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No participants found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Participant
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Challenge
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Score
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Rank
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Entry
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Reward
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredParticipants.map(
                    (participant) => (
                      <tr
                        key={participant.id}
                        className="hover:bg-slate-50"
                      >
                        {/* Participant */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                              {getInitials(
                                participant.name,
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {participant.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {participant.email}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {participant.joinedAt}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Challenge */}
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {participant.challenge}
                          </p>

                          <p className="mt-1 text-xs uppercase text-slate-500">
                            {participant.examType}
                          </p>
                        </td>

                        {/* Score */}
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-900">
                            {participant.score}/
                            {participant.totalQuestions}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {Math.round(
                              (participant.score /
                                participant.totalQuestions) *
                                100,
                            )}
                            %
                          </p>
                        </td>

                        {/* Rank */}
                        <td className="px-6 py-5">
                          {participant.rank ? (
                            <span
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-full font-bold ${
                                participant.rank ===
                                1
                                  ? "bg-yellow-100 text-yellow-700"
                                  : participant.rank ===
                                      2
                                    ? "bg-slate-200 text-slate-700"
                                    : participant.rank ===
                                        3
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {participant.rank}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* Entry */}
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {participant.entryCost.toLocaleString()}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            CBT Points
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <ParticipantStatus
                            completed={
                              participant.completed
                            }
                          />
                        </td>

                        {/* Reward */}
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {participant.reward >
                            0
                              ? `₦${participant.reward.toLocaleString()}`
                              : "—"}
                          </p>

                          <RewardStatus
                            status={
                              participant.rewardStatus
                            }
                          />
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/solveandwin/participants/${participant.id}`}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Admin Information */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="font-semibold text-blue-900">
            Participant Management
          </h2>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-blue-800">
            Participant records should be generated by the backend
            when a student successfully enters a challenge. Entry
            CBT Points, scores, ranks and reward status should be
            calculated and stored server-side.
          </p>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */

interface StatCardProps {
  label: string;
  value: string;
  description: string;
}

function StatCard({
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </section>
  );
}

/* ============================================================
   PARTICIPANT STATUS
   ============================================================ */

function ParticipantStatus({
  completed,
}: {
  completed: boolean;
}) {
  if (completed) {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
      In Progress
    </span>
  );
}

/* ============================================================
   REWARD STATUS
   ============================================================ */

function RewardStatus({
  status,
}: {
  status: Participant["rewardStatus"];
}) {
  const config = {
    pending: {
      label: "Pending",
      className:
        "bg-amber-50 text-amber-700",
    },

    processing: {
      label: "Processing",
      className:
        "bg-blue-50 text-blue-700",
    },

    paid: {
      label: "Paid",
      className:
        "bg-green-50 text-green-700",
    },

    failed: {
      label: "Failed",
      className:
        "bg-red-50 text-red-700",
    },

    not_eligible: {
      label: "Not Eligible",
      className:
        "bg-slate-100 text-slate-600",
    },
  };

  const current = config[status];

  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

