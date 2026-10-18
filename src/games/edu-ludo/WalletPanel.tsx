




"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  CircleHelp,
  Coins,
  CreditCard,
  History,
  Info,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

export type WalletTransactionType = "credit" | "debit";

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  description: string;
  createdAt: string | Date;
  status?: "successful" | "pending" | "failed";
  reference?: string;
}

export interface WalletPanelProps {
  balance?: number;
  cbtPoints?: number;
  questionCost?: number;
  transactions?: WalletTransaction[];
  loading?: boolean;
  fundingDisabled?: boolean;
  onFundWallet?: () => void;
  onViewTransactions?: () => void;
  onRefresh?: () => void;
  compact?: boolean;
  error?: string;
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatPoints(points: number) {
  return new Intl.NumberFormat("en-NG", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(points) ? points : 0);
}

function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function transactionStatus(status?: WalletTransaction["status"]) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        className: "bg-amber-100 text-amber-800",
      };
    case "failed":
      return {
        label: "Failed",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        label: "Successful",
        className: "bg-green-100 text-green-700",
      };
  }
}

export default function WalletPanel({
  balance = 0,
  cbtPoints = 0,
  questionCost = 2,
  transactions = [],
  loading = false,
  fundingDisabled = false,
  onFundWallet,
  onViewTransactions,
  onRefresh,
  compact = false,
  error,
}: WalletPanelProps) {
  const safeBalance = Math.max(0, Number.isFinite(balance) ? balance : 0);
  const safePoints = Math.max(0, Number.isFinite(cbtPoints) ? cbtPoints : 0);
  const safeCost = Math.max(
    0,
    Number.isFinite(questionCost) ? questionCost : 2,
  );

  const affordableQuestions =
    safeCost > 0 ? Math.floor(safeBalance / safeCost) : null;

  const balanceAfterQuestion =
    safeCost > 0 ? Math.max(0, safeBalance - safeCost) : safeBalance;

  const canAffordQuestion = safeCost === 0 || safeBalance >= safeCost;

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, compact ? 3 : 5);

  return (
    <section
      aria-label="Learnyfi wallet"
      className="space-y-4"
    >
      {/* Main naira wallet */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-800 via-purple-700 to-indigo-700 p-5 text-white sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <Wallet size={23} />
              </div>
              <div>
                <p className="text-sm font-semibold text-violet-100">
                  Real-money wallet
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-violet-200">
                  <ShieldCheck size={13} />
                  <span>Game balance</span>
                </div>
              </div>
            </div>

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold transition hover:bg-white/20 disabled:opacity-50"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            )}
          </div>

          <div className="relative mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
              Available balance
            </p>

            <div
              aria-live="polite"
              className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl"
            >
              {loading ? "Loading..." : formatNaira(safeBalance)}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold">
                {safeCost > 0
                  ? `${formatNaira(safeCost)} per question`
                  : "No question fee configured"}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  canAffordQuestion
                    ? "bg-green-400/20 text-green-100"
                    : "bg-red-400/20 text-red-100"
                }`}
              >
                {canAffordQuestion
                  ? "Ready to play"
                  : "Insufficient balance"}
              </span>
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onFundWallet}
              disabled={!onFundWallet || fundingDisabled || loading}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-violet-800 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CreditCard size={17} />
              Fund Wallet
            </button>

            <button
              type="button"
              onClick={onViewTransactions}
              disabled={!onViewTransactions || loading}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <History size={17} />
              Transactions
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <CircleHelp size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Question affordability */}
        {!compact && (
          <div className="grid grid-cols-2 divide-x divide-slate-100">
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-slate-500">
                <Zap size={16} className="text-violet-600" />
                <span className="text-xs font-semibold">
                  Questions affordable
                </span>
              </div>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {safeCost > 0 ? affordableQuestions : "—"}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Estimated at {formatNaira(safeCost)} per presented question
              </p>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 text-slate-500">
                <Coins size={16} className="text-amber-600" />
                <span className="text-xs font-semibold">
                  After one question
                </span>
              </div>

              <p className="mt-2 break-words text-xl font-black text-slate-900">
                {formatNaira(balanceAfterQuestion)}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {canAffordQuestion
                  ? "Estimated remaining balance"
                  : "Add funds before the next question"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CBT Points are separate from naira */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Coins size={22} />
            </div>

            <div>
              <p className="text-sm font-bold text-amber-950">
                CBT Points
              </p>
              <p className="mt-0.5 text-xs text-amber-800">
                Game rewards and learning points
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xl font-black text-amber-950">
              {formatPoints(safePoints)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Points
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200/70 bg-white/70 p-3">
          <Info size={15} className="mt-0.5 shrink-0 text-amber-700" />
          <p className="text-xs leading-5 text-amber-900">
            CBT Points are separate from your naira wallet. They are not
            treated as cash and cannot pay the question fee unless your
            platform explicitly supports a separate, approved conversion.
          </p>
        </div>
      </div>

      {/* Recent transactions */}
      {!compact && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h3 className="font-extrabold text-slate-900">
                Recent transactions
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Wallet credits and debits
              </p>
            </div>

            <button
              type="button"
              onClick={onViewTransactions}
              disabled={!onViewTransactions}
              className="text-xs font-bold text-violet-700 hover:text-violet-900 disabled:opacity-40"
            >
              View all
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <History size={22} />
              </div>

              <p className="mt-3 text-sm font-bold text-slate-700">
                No transactions yet
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Completed wallet activity will appear here when transaction
                history is connected.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((transaction) => {
                const isCredit = transaction.type === "credit";
                const status = transactionStatus(transaction.status);

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-3 px-4 py-4 sm:px-5"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isCredit
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft size={19} />
                      ) : (
                        <ArrowUpRight size={19} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {transaction.description}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {formatDate(transaction.createdAt)}
                      </p>

                      {transaction.reference && (
                        <p className="mt-1 truncate text-[10px] text-slate-400">
                          Ref: {transaction.reference}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={`text-sm font-extrabold ${
                          isCredit ? "text-green-700" : "text-slate-800"
                        }`}
                      >
                        {isCredit ? "+" : "−"}
                        {formatNaira(transaction.amount)}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
            <p className="flex items-start gap-2 text-[11px] leading-5 text-slate-500">
              <BadgeCheck
                size={14}
                className="mt-0.5 shrink-0 text-slate-400"
              />
              Transaction records and available balance should come from your
              trusted wallet API in production.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
