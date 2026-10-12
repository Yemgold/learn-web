




"use client";

import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { memo, type ReactNode } from "react";

export interface WhotHeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  onBack?: () => void;
  playerName?: string;
  score?: number;
  showScore?: boolean;
  statusLabel?: string;
  rightContent?: ReactNode;
  className?: string;
  compact?: boolean;
}

function WhotHeaderComponent({
  title = "Learnyfi WHOT",
  subtitle = "Play your card. Answer correctly. Win the game.",
  backHref = "/student/games",
  onBack,
  playerName,
  score,
  showScore = false,
  statusLabel,
  rightContent,
  className = "",
  compact = false,
}: WhotHeaderProps) {
  return (
    <header
      className={`flex w-full flex-wrap items-center justify-between gap-4 ${
        compact ? "py-2" : "py-3 sm:py-4"
      } ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 transition hover:border-white/20 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <Link
            href={backHref}
            aria-label="Back to games"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-slate-300 transition hover:border-white/20 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 sm:h-12 sm:w-12">
          <BookOpen className="h-5 w-5 text-cyan-300 sm:h-6 sm:w-6" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-lg font-black tracking-tight text-white sm:text-2xl">
            {title.includes("WHOT") ? (
              <>
                {title.replace(/WHOT/i, "").trim()}{" "}
                <span className="text-cyan-300">WHOT</span>
              </>
            ) : (
              title
            )}
          </h1>

          {!compact && (
            <p className="mt-1 max-w-md text-xs leading-5 text-slate-400 sm:text-sm">
              {subtitle}
            </p>
          )}

          {playerName && (
            <p className="mt-1 truncate text-xs font-medium text-slate-300">
              Playing as {playerName}
            </p>
          )}
        </div>
      </div>

      <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
        {statusLabel && (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-emerald-400"
            />
            {statusLabel}
          </div>
        )}

        {showScore && typeof score === "number" && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2">
            <Trophy className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-extrabold tabular-nums text-amber-100">
              {score.toLocaleString()} pts
            </span>
          </div>
        )}

        {rightContent}

        {!rightContent && !statusLabel && !showScore && (
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-200 sm:text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Learn while you play</span>
          </div>
        )}
      </div>
    </header>
  );
}

const WhotHeader = memo(WhotHeaderComponent);

WhotHeader.displayName = "WhotHeader";

export default WhotHeader;
