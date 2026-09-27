




"use client";

import {
  Crown,
  Medal,
  Trophy,
  UserRound,
} from "lucide-react";

export interface SpectatorLeaderboardEntry {
  id: string;

  userId?: string | null;
  participantId?: string | null;

  name: string;
  username?: string | null;
  avatarUrl?: string | null;

  score: number;

  rank?: number | null;

  correctAnswers?: number;
  answeredQuestions?: number;

  isEliminated?: boolean;
  isConnected?: boolean;
  isLeader?: boolean;
}

export interface SpectatorLeaderboardProps {
  entries: SpectatorLeaderboardEntry[];

  title?: string;

  currentQuestionNumber?: number | null;
  totalQuestions?: number | null;

  maxVisible?: number;

  loading?: boolean;

  emptyMessage?: string;

  showQuestionProgress?: boolean;
  showScore?: boolean;
  showStats?: boolean;
  showConnectionStatus?: boolean;
  showEliminated?: boolean;

  compact?: boolean;

  onParticipantClick?: (
    participant: SpectatorLeaderboardEntry,
  ) => void;
}

function getRank(
  entry: SpectatorLeaderboardEntry,
  index: number,
) {
  return entry.rank ?? index + 1;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function SpectatorLeaderboard({
  entries,

  title = "Live Leaderboard",

  currentQuestionNumber = null,
  totalQuestions = null,

  maxVisible = 10,

  loading = false,

  emptyMessage = "No leaderboard data available yet.",

  showQuestionProgress = true,
  showScore = true,
  showStats = true,
  showConnectionStatus = false,
  showEliminated = true,

  compact = false,

  onParticipantClick,
}: SpectatorLeaderboardProps) {
  const visibleEntries = entries
    .slice()
    .sort((a, b) => {
      const rankA = a.rank ?? Number.MAX_SAFE_INTEGER;
      const rankB = b.rank ?? Number.MAX_SAFE_INTEGER;

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      return b.score - a.score;
    })
    .slice(0, maxVisible);

  return (
    <section
      className={[
        "rounded-2xl border border-white/10",
        "bg-slate-950/70 shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5",
      ].join(" ")}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
            <Trophy className="h-5 w-5 text-amber-300" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white">
              {title}
            </h2>

            {showQuestionProgress &&
              currentQuestionNumber !== null &&
              totalQuestions !== null && (
                <p className="mt-0.5 text-xs text-slate-500">
                  Question{" "}
                  {currentQuestionNumber} of{" "}
                  {totalQuestions}
                </p>
              )}
          </div>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-slate-500">
          Spectator
        </span>
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({
              length: Math.min(maxVisible, 5),
            }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-white/[0.04]"
              />
            ))}
          </div>
        ) : visibleEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            <Trophy className="mx-auto h-7 w-7 text-slate-700" />

            <p className="mt-3 text-sm text-slate-500">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleEntries.map((entry, index) => {
              const rank = getRank(entry, index);

              const isTopThree =
                rank >= 1 && rank <= 3;

              const accuracy =
                entry.answeredQuestions &&
                entry.answeredQuestions > 0
                  ? Math.round(
                      ((entry.correctAnswers ?? 0) /
                        entry.answeredQuestions) *
                        100,
                    )
                  : null;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() =>
                    onParticipantClick?.(entry)
                  }
                  disabled={!onParticipantClick}
                  className={[
                    "w-full rounded-xl border text-left transition",
                    entry.isLeader
                      ? "border-amber-400/20 bg-amber-400/[0.06]"
                      : "border-white/5 bg-white/[0.02]",
                    onParticipantClick
                      ? "cursor-pointer hover:border-white/15 hover:bg-white/[0.04]"
                      : "cursor-default",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex items-center gap-3",
                      compact ? "p-2.5" : "p-3",
                    ].join(" ")}
                  >
                    {/* RANK */}
                    <div className="flex w-7 shrink-0 justify-center">
                      {rank === 1 ? (
                        <Crown className="h-5 w-5 text-amber-300" />
                      ) : rank === 2 ? (
                        <Medal className="h-5 w-5 text-slate-300" />
                      ) : rank === 3 ? (
                        <Medal className="h-5 w-5 text-orange-300" />
                      ) : (
                        <span className="text-xs font-bold text-slate-600">
                          {rank}
                        </span>
                      )}
                    </div>

                    {/* AVATAR */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                      {entry.avatarUrl ? (
                        <img
                          src={entry.avatarUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">
                          {getInitials(
                            entry.name ||
                              entry.username ||
                              "P",
                          )}
                        </span>
                      )}
                    </div>

                    {/* PARTICIPANT */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {entry.name ||
                            entry.username ||
                            "Participant"}
                        </p>

                        {entry.isLeader && (
                          <span className="rounded-full bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300">
                            Leader
                          </span>
                        )}

                        {entry.isEliminated &&
                          showEliminated && (
                            <span className="rounded-full bg-red-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-red-300">
                              Eliminated
                            </span>
                          )}
                      </div>

                      {showStats && (
                        <div className="mt-0.5 flex flex-wrap gap-x-2 text-[10px] text-slate-500">
                          {entry.correctAnswers !==
                            undefined && (
                            <span>
                              {entry.correctAnswers}{" "}
                              correct
                            </span>
                          )}

                          {entry.answeredQuestions !==
                            undefined && (
                            <span>
                              {entry.answeredQuestions}{" "}
                              answered
                            </span>
                          )}

                          {accuracy !== null && (
                            <span>
                              {accuracy}% accuracy
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* SCORE */}
                    {showScore && (
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-cyan-300">
                          {entry.score}
                        </p>

                        <p className="text-[9px] uppercase tracking-wider text-slate-600">
                          points
                        </p>
                      </div>
                    )}

                    {/* CONNECTION */}
                    {showConnectionStatus && (
                      <span
                        className={[
                          "h-2 w-2 shrink-0 rounded-full",
                          entry.isConnected
                            ? "bg-emerald-400"
                            : "bg-slate-700",
                        ].join(" ")}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER */}
      {!loading &&
        visibleEntries.length > 0 &&
        entries.length > maxVisible && (
          <p className="mt-3 text-center text-[10px] text-slate-600">
            Showing top {maxVisible} of{" "}
            {entries.length} participants
          </p>
        )}
    </section>
  );
}