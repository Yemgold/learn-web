




"use client";

import {
  ArrowLeft,
  CircleHelp,
  Home,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface WaitingRoomFooterProps {
  quizId?: string;
  refreshing?: boolean;
  leaving?: boolean;
  onRefresh?: () => void;
  onLeave?: () => void;
}

export default function WaitingRoomFooter({
  quizId,
  refreshing = false,
  leaving = false,
  onRefresh,
  onLeave,
}: WaitingRoomFooterProps) {
  const isBusy =
    refreshing || leaving;

  return (
    <footer className="mt-8 border-t border-white/8 pt-6">
      <div className="flex flex-col gap-5">
        {/* Help / security information */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/10">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-semibold text-white">
                Stay connected to the competition
              </p>

              <p className="mt-1 max-w-2xl text-[11px] leading-5 text-slate-500">
                Keep this page open while waiting for
                the host. Your live room connection will
                receive updates when the competition
                starts.
              </p>
            </div>
          </div>

          <Link
            href="/student/quiz-board"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
          >
            <CircleHelp className="h-3.5 w-3.5" />
            Quiz Board
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/student/quiz-board"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quiz Board
            </Link>

            <Link
              href="/student/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-2.5 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/25 hover:bg-cyan-400/[0.09] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={[
                    "h-4 w-4",
                    refreshing
                      ? "animate-spin"
                      : "",
                  ].join(" ")}
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh Room"}
              </button>
            )}

            {onLeave && (
              <button
                type="button"
                onClick={onLeave}
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:border-red-400/25 hover:bg-red-400/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {leaving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}

                {leaving
                  ? "Leaving..."
                  : "Leave Waiting Room"}
              </button>
            )}
          </div>
        </div>

        {/* Small room identifier */}
        {quizId && (
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-700">
              Competition
            </span>

            <span className="max-w-[220px] truncate font-mono text-[10px] text-slate-600">
              {quizId}
            </span>
          </div>
        )}
      </div>
    </footer>
  );
}