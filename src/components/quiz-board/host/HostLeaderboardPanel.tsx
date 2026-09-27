





"use client";

import {
  Award,
  ChevronDown,
  ChevronUp,
  Crown,
  Medal,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface HostLeaderboardEntry {
  id: string;
  userId?: string | null;
  participantId?: string | null;
  name: string;
  username?: string | null;
  avatarUrl?: string | null;

  score: number;
  correctAnswers?: number;
  answeredQuestions?: number;

  rank?: number | null;
  isCurrentLeader?: boolean;
  isEliminated?: boolean;
  isConnected?: boolean;
}

export interface HostLeaderboardPanelProps {
  entries: HostLeaderboardEntry[];

  title?: string;
  currentQuestionNumber?: number | null;
  totalQuestions?: number | null;

  maxVisible?: number;

  loading?: boolean;
  emptyMessage?: string;

  compact?: boolean;
  showQuestionProgress?: boolean;
  showConnectionStatus?: boolean;
  showEliminated?: boolean;

  onParticipantClick?: (
    participant: HostLeaderboardEntry,
  ) => void;
}

function getRankValue(
  entry: HostLeaderboardEntry,
  index: number,
): number {
  return entry.rank && entry.rank > 0
    ? entry.rank
    : index + 1;
}

function getRankIcon(rank: number) {
  if (rank === 1) {
    return (
      <Crown
        className="h-4 w-4"
        aria-hidden="true"
      />
    );
  }

  if (rank === 2) {
    return (
      <Medal
        className="h-4 w-4"
        aria-hidden="true"
      />
    );
  }

  if (rank === 3) {
    return (
      <Award
        className="h-4 w-4"
        aria-hidden="true"
      />
    );
  }

  return (
    <span className="text-xs font-bold text-slate-400">
      {rank}
    </span>
  );
}

function getDisplayName(
  entry: HostLeaderboardEntry,
): string {
  return (
    entry.name?.trim() ||
    entry.username?.trim() ||
    "Contestant"
  );
}

export default function HostLeaderboardPanel({
  entries,
  title = "Leaderboard",
  currentQuestionNumber = null,
  totalQuestions = null,
  maxVisible = 10,
  loading = false,
  emptyMessage = "No leaderboard data yet.",
  compact = false,
  showQuestionProgress = true,
  showConnectionStatus = true,
  showEliminated = true,
  onParticipantClick,
}: HostLeaderboardPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const sortedEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => {
        const rankA =
          a.rank && a.rank > 0
            ? a.rank
            : Number.MAX_SAFE_INTEGER;

        const rankB =
          b.rank && b.rank > 0
            ? b.rank
            : Number.MAX_SAFE_INTEGER;

        if (rankA !== rankB) {
          return rankA - rankB;
        }

        return b.score - a.score;
      })
      .filter((entry) =>
        showEliminated
          ? true
          : !entry.isEliminated,
      );
  }, [entries, showEliminated]);

  const visibleEntries = expanded
    ? sortedEntries
    : sortedEntries.slice(0, maxVisible);

  const hiddenCount = Math.max(
    sortedEntries.length - maxVisible,
    0,
  );

  const leader = sortedEntries[0] ?? null;

  const participantCount = sortedEntries.length;

  return (
    <section
      className={[
        "overflow-hidden rounded-2xl border",
        "border-white/10 bg-slate-950/70",
        "shadow-xl shadow-black/10",
      ].join(" ")}
    >
      {/* Header */}
      <div
        className={[
          "flex items-center justify-between gap-3",
          compact ? "px-4 py-3" : "px-5 py-4",
          "border-b border-white/10",
          "bg-white/[0.03]",
        ].join(" ")}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <Trophy
              className="h-4 w-4"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white">
              {title}
            </h2>

            <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
              <Users
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              <span>
                {participantCount}{" "}
                {participantCount === 1
                  ? "contestant"
                  : "contestants"}
              </span>

              {showQuestionProgress &&
                currentQuestionNumber &&
                totalQuestions && (
                  <>
                    <span className="text-slate-600">
                      •
                    </span>

                    <span>
                      Q{currentQuestionNumber}/
                      {totalQuestions}
                    </span>
                  </>
                )}
            </div>
          </div>
        </div>

        {leader && (
          <div className="hidden text-right sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Leader
            </p>

            <p className="mt-0.5 max-w-[140px] truncate text-xs font-semibold text-amber-300">
              {getDisplayName(leader)}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={compact ? "p-3" : "p-4"}>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-xl bg-white/[0.04]"
                />
              ),
            )}
          </div>
        ) : sortedEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            <Trophy
              className="mx-auto h-7 w-7 text-slate-600"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-medium text-slate-400">
              {emptyMessage}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Scores will appear as contestants
              participate.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleEntries.map(
              (entry, index) => {
                const rank = getRankValue(
                  entry,
                  index,
                );

                const displayName =
                  getDisplayName(entry);

                const isClickable =
                  Boolean(onParticipantClick);

                return (
                  <button
                    key={
                      entry.id ||
                      entry.participantId ||
                      entry.userId ||
                      `leader-${index}`
                    }
                    type="button"
                    disabled={!isClickable}
                    onClick={() =>
                      onParticipantClick?.(entry)
                    }
                    className={[
                      "group w-full rounded-xl border text-left",
                      "transition",
                      isClickable
                        ? "cursor-pointer hover:border-white/20 hover:bg-white/[0.05]"
                        : "cursor-default",
                      entry.isCurrentLeader
                        ? "border-amber-400/25 bg-amber-400/[0.06]"
                        : "border-white/5 bg-white/[0.02]",
                      entry.isEliminated
                        ? "opacity-60"
                        : "",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex items-center gap-3",
                        compact
                          ? "px-3 py-2.5"
                          : "px-3.5 py-3",
                      ].join(" ")}
                    >
                      {/* Rank */}
                      <div
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          rank === 1
                            ? "bg-amber-400/10 text-amber-300"
                            : rank === 2
                              ? "bg-slate-300/10 text-slate-300"
                              : rank === 3
                                ? "bg-orange-400/10 text-orange-300"
                                : "bg-white/[0.04] text-slate-400",
                        ].join(" ")}
                      >
                        {getRankIcon(rank)}
                      </div>

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {entry.avatarUrl ? (
                          <img
                            src={entry.avatarUrl}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300 ring-1 ring-white/10">
                            {displayName
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        {showConnectionStatus && (
                          <span
                            className={[
                              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-950",
                              entry.isConnected
                                ? "bg-emerald-400"
                                : "bg-slate-600",
                            ].join(" ")}
                            title={
                              entry.isConnected
                                ? "Connected"
                                : "Disconnected"
                            }
                          />
                        )}
                      </div>

                      {/* Contestant */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {displayName}
                          </p>

                          {entry.isCurrentLeader && (
                            <span className="shrink-0 rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                              Leader
                            </span>
                          )}

                          {entry.isEliminated && (
                            <span className="shrink-0 rounded-full bg-red-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-300">
                              Out
                            </span>
                          )}
                        </div>

                        {(entry.answeredQuestions !==
                          undefined ||
                          entry.correctAnswers !==
                            undefined) && (
                          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                            {entry.correctAnswers !==
                              undefined && (
                              <span>
                                {
                                  entry.correctAnswers
                                }{" "}
                                correct
                              </span>
                            )}

                            {entry.answeredQuestions !==
                              undefined && (
                              <>
                                {entry.correctAnswers !==
                                  undefined && (
                                  <span className="text-slate-700">
                                    •
                                  </span>
                                )}

                                <span>
                                  {
                                    entry.answeredQuestions
                                  }{" "}
                                  answered
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Score */}
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-black tabular-nums text-white">
                          {entry.score.toLocaleString()}
                        </p>

                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                          points
                        </p>
                      </div>
                    </div>
                  </button>
                );
              },
            )}
          </div>
        )}

        {/* Expand */}
        {!loading &&
          hiddenCount > 0 && (
            <button
              type="button"
              onClick={() =>
                setExpanded((value) => !value)
              }
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              {expanded ? (
                <>
                  <ChevronUp
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  Show {hiddenCount} more
                </>
              )}
            </button>
          )}
      </div>
    </section>
  );
}