


"use client";

import Link from "next/link";
import {
  Gamepad2,
  Loader2,
  Plus,
  RefreshCw,
  Trophy,
} from "lucide-react";

type Props = {
  refreshing: boolean;
  onRefresh: () => void;
};

export default function QuizBoardHeader({
  refreshing,
  onRefresh,
}: Props) {
  return (
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
            Create and manage elimination
            competitions, configure rounds and
            rewards, monitor contestants and
            review competition activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>

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
  );
}