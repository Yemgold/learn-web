





"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

interface Reward {
  id: string;
  participantName: string;
  participantEmail: string;
  challenge: string;
  rank: number;
  score: number;
  totalQuestions: number;
  amount: number;
  currency: string;
  rewardType: "cash" | "cbt_points";
  status:
    | "pending"
    | "processing"
    | "paid"
    | "failed";
  createdAt: string;
  paidAt: string | null;
}

const rewards: Reward[] = [
  {
    id: "reward-001",
    participantName: "John Doe",
    participantEmail: "john@example.com",
    challenge: "JAMB Quick Challenge",
    rank: 1,
    score: 9,
    totalQuestions: 10,
    amount: 500,
    currency: "NGN",
    rewardType: "cash",
    status: "paid",
    createdAt: "27 August 2026, 11:05 AM",
    paidAt: "27 August 2026, 11:12 AM",
  },
  {
    id: "reward-002",
    participantName: "Grace Okafor",
    participantEmail: "grace@example.com",
    challenge: "JAMB Biology Challenge",
    rank: 1,
    score: 17,
    totalQuestions: 20,
    amount: 1000,
    currency: "NGN",
    rewardType: "cash",
    status: "pending",
    createdAt: "27 August 2026, 10:30 AM",
    paidAt: null,
  },
  {
    id: "reward-003",
    participantName: "David Williams",
    participantEmail: "david@example.com",
    challenge: "JAMB Mathematics Challenge",
    rank: 1,
    score: 18,
    totalQuestions: 20,
    amount: 1500,
    currency: "NGN",
    rewardType: "cash",
    status: "processing",
    createdAt: "27 August 2026, 9:48 AM",
    paidAt: null,
  },
  {
    id: "reward-004",
    participantName: "Sarah James",
    participantEmail: "sarah@example.com",
    challenge: "JAMB Science Challenge",
    rank: 1,
    score: 25,
    totalQuestions: 30,
    amount: 2000,
    currency: "NGN",
    rewardType: "cash",
    status: "paid",
    createdAt: "26 August 2026, 6:20 PM",
    paidAt: "26 August 2026, 6:32 PM",
  },
  {
    id: "reward-005",
    participantName: "Michael Adams",
    participantEmail: "michael@example.com",
    challenge: "JAMB Biology Challenge",
    rank: 2,
    score: 15,
    totalQuestions: 20,
    amount: 500,
    currency: "NGN",
    rewardType: "cash",
    status: "failed",
    createdAt: "26 August 2026, 5:42 PM",
    paidAt: null,
  },
  {
    id: "reward-006",
    participantName: "Emmanuel Peter",
    participantEmail: "emmanuel@example.com",
    challenge: "JAMB Points Challenge",
    rank: 1,
    score: 20,
    totalQuestions: 25,
    amount: 1000,
    currency: "CBT",
    rewardType: "cbt_points",
    status: "pending",
    createdAt: "26 August 2026, 4:15 PM",
    paidAt: null,
  },
];

export default function SolveAndWinRewardsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [typeFilter, setTypeFilter] =
    useState("all");

  const filteredRewards = useMemo(() => {
    return rewards.filter((reward) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const searchMatch =
        searchValue === "" ||
        reward.participantName
          .toLowerCase()
          .includes(searchValue) ||
        reward.participantEmail
          .toLowerCase()
          .includes(searchValue) ||
        reward.challenge
          .toLowerCase()
          .includes(searchValue);

      const statusMatch =
        statusFilter === "all" ||
        reward.status === statusFilter;

      const typeMatch =
        typeFilter === "all" ||
        reward.rewardType === typeFilter;

      return (
        searchMatch &&
        statusMatch &&
        typeMatch
      );
    });
  }, [
    search,
    statusFilter,
    typeFilter,
  ]);

  const totalRewards = rewards.reduce(
    (total, reward) =>
      total + reward.amount,
    0,
  );

  const pendingRewards = rewards
    .filter(
      (reward) =>
        reward.status === "pending",
    )
    .reduce(
      (total, reward) =>
        total + reward.amount,
      0,
    );

  const processingRewards = rewards
    .filter(
      (reward) =>
        reward.status === "processing",
    )
    .reduce(
      (total, reward) =>
        total + reward.amount,
      0,
    );

  const paidRewards = rewards
    .filter(
      (reward) =>
        reward.status === "paid",
    )
    .reduce(
      (total, reward) =>
        total + reward.amount,
      0,
    );

  const paidCount = rewards.filter(
    (reward) =>
      reward.status === "paid",
  ).length;

  const pendingCount = rewards.filter(
    (reward) =>
      reward.status === "pending",
  ).length;

  const failedCount = rewards.filter(
    (reward) =>
      reward.status === "failed",
  ).length;

  const handleProcessReward = (
    rewardId: string,
  ) => {
    /*
     * BACKEND INTEGRATION
     *
     * Example:
     *
     * POST
     * /api/v1/admin/solve-and-win/rewards/:rewardId/process
     *
     * The backend should:
     *
     * 1. Verify the reward is legitimate.
     * 2. Verify the participant's final result.
     * 3. Verify the participant's rank.
     * 4. Verify the reward amount.
     * 5. Process the payout.
     * 6. Update reward status.
     * 7. Record the transaction.
     */

    console.log(
      "PROCESS REWARD:",
      rewardId,
    );

    alert(
      "Reward processing will be connected to the backend API.",
    );
  };

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
              Rewards
            </h1>

            <p className="mt-2 text-slate-600">
              Manage Solve & Win rewards, payouts and reward
              transactions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Export Rewards
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Rewards"
            value={`₦${totalRewards.toLocaleString()}`}
            description="Configured reward value"
          />

          <StatCard
            label="Pending"
            value={`₦${pendingRewards.toLocaleString()}`}
            description={`${pendingCount} reward${
              pendingCount === 1 ? "" : "s"
            } awaiting processing`}
          />

          <StatCard
            label="Processing"
            value={`₦${processingRewards.toLocaleString()}`}
            description="Currently being processed"
          />

          <StatCard
            label="Paid"
            value={`₦${paidRewards.toLocaleString()}`}
            description={`${paidCount} completed payout${
              paidCount === 1 ? "" : "s"
            }`}
          />
        </div>

        {/* Warning */}
        {pendingCount > 0 && (
          <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-amber-900">
                  Rewards Awaiting Processing
                </h2>

                <p className="mt-2 text-sm leading-6 text-amber-800">
                  There are {pendingCount} reward
                  {pendingCount === 1 ? "" : "s"} currently
                  waiting for payout processing.
                </p>
              </div>

              <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
                ₦{pendingRewards.toLocaleString()}
              </span>
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Reward Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search and filter participant rewards.
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
                Reward Status
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

                <option value="pending">
                  Pending
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="paid">
                  Paid
                </option>

                <option value="failed">
                  Failed
                </option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Reward Type
              </label>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(
                    event.target.value,
                  )
                }
                className={inputClass}
              >
                <option value="all">
                  All Reward Types
                </option>

                <option value="cash">
                  Cash
                </option>

                <option value="cbt_points">
                  CBT Points
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Rewards Table */}
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Reward Records
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing {filteredRewards.length} reward
                  {filteredRewards.length === 1
                    ? ""
                    : "s"}
                </p>
              </div>

              {failedCount > 0 && (
                <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                  {failedCount} Failed
                </span>
              )}
            </div>
          </div>

          {filteredRewards.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                💰
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No rewards found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Winner
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Challenge
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Result
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Reward
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredRewards.map(
                    (reward) => (
                      <tr
                        key={reward.id}
                        className="hover:bg-slate-50"
                      >
                        {/* Winner */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                              {getInitials(
                                reward.participantName,
                              )}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {
                                  reward.participantName
                                }
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {
                                  reward.participantEmail
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Challenge */}
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-900">
                            {reward.challenge}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Rank #{reward.rank}
                          </p>
                        </td>

                        {/* Result */}
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-900">
                            {reward.score}/
                            {reward.totalQuestions}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {Math.round(
                              (reward.score /
                                reward.totalQuestions) *
                                100,
                            )}
                            % score
                          </p>
                        </td>

                        {/* Reward */}
                        <td className="px-6 py-5">
                          <p className="font-bold text-green-700">
                            {formatReward(reward)}
                          </p>

                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {reward.rewardType ===
                            "cash"
                              ? "Cash reward"
                              : "CBT Points"}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <RewardStatus
                            status={reward.status}
                          />
                        </td>

                        {/* Created */}
                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-slate-700">
                            {reward.createdAt}
                          </p>

                          {reward.paidAt && (
                            <p className="mt-1 text-xs text-green-600">
                              Paid:{" "}
                              {reward.paidAt}
                            </p>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/solveandwin/rewards/${reward.id}`}
                              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              View
                            </Link>

                            {(reward.status ===
                              "pending" ||
                              reward.status ===
                                "failed") && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleProcessReward(
                                    reward.id,
                                  )
                                }
                                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                              >
                                Process
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Reward System */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Reward System
            </h2>

            <div className="mt-5 space-y-5">
              <Info
                label="Cash Rewards"
                value="Paid to eligible winners"
              />

              <Info
                label="CBT Point Rewards"
                value="Credited to student wallet"
              />

              <Info
                label="Winner Selection"
                value="Based on final challenge score"
              />

              <Info
                label="Payout"
                value="Processed after result verification"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-semibold text-amber-900">
              Admin Safety
            </h2>

            <p className="mt-2 text-sm leading-6 text-amber-800">
              Reward amounts, winners, rankings and payout
              eligibility should never be trusted from the frontend.
              The backend must calculate and verify the final result
              before a reward can be processed.
            </p>

            <div className="mt-5 rounded-xl border border-amber-200 bg-white/60 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Current Summary
              </p>

              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-amber-700">
                    Paid
                  </p>

                  <p className="mt-1 font-bold text-amber-900">
                    ₦
                    {paidRewards.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-amber-700">
                    Pending
                  </p>

                  <p className="mt-1 font-bold text-amber-900">
                    ₦
                    {pendingRewards.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
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
   REWARD STATUS
   ============================================================ */

function RewardStatus({
  status,
}: {
  status: Reward["status"];
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
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

/* ============================================================
   INFO
   ============================================================ */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */

function formatReward(reward: Reward) {
  if (reward.rewardType === "cash") {
    return `₦${reward.amount.toLocaleString()}`;
  }

  return `${reward.amount.toLocaleString()} CBT`;
}

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