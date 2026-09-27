




"use client";

import {
  Crown,
  Medal,
  Trophy,
  UserRound,
} from "lucide-react";

export interface QuizLeaderboardEntry {
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

  isCurrentUser?: boolean;
  isLeader?: boolean;
  isEliminated?: boolean;
  isConnected?: boolean;
}

export interface QuizLeaderboardProps {
  entries: QuizLeaderboardEntry[];

  title?: string;

  currentUserId?: string | null;

  maxVisible?: number;

  loading?: boolean;

  showRank?: boolean;
  showScore?: boolean;
  showStats?: boolean;
  showStatus?: boolean;

  emptyMessage?: string;

  onParticipantClick?: (
    entry: QuizLeaderboardEntry,
  ) => void;

  compact?: boolean;
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function RankIcon({
  rank,
}: {
  rank: number;
}) {
  if (rank === 1) {
    return (
      <Crown className="h-4 w-4 text-yellow-300" />
    );
  }

  if (rank === 2) {
    return (
      <Medal className="h-4 w-4 text-slate-300" />
    );
  }

  if (rank === 3) {
    return (
      <Medal className="h-4 w-4 text-orange-300" />
    );
  }

  return null;
}

export default function QuizLeaderboard({
  entries,

  title = "Leaderboard",

  currentUserId = null,

  maxVisible = 10,

  loading = false,

  showRank = true,
  showScore = true,
  showStats = true,
  showStatus = true,

  emptyMessage = "No leaderboard data yet.",

  onParticipantClick,

  compact = false,
}: QuizLeaderboardProps) {
  const visibleEntries =
    entries.slice(0, Math.max(1, maxVisible));

  return (
    <section
      className={[
        "rounded-2xl border border-white/10",
        "bg-slate-950/70 shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5 sm:p-6",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-yellow-400/10 p-2">
            <Trophy className="h-4 w-4 text-yellow-300" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              {title}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {entries.length} participant
              {entries.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                >
                  <div className="h-7 w-7 rounded-lg bg-white/10" />
                  <div className="h-9 w-9 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <div className="h-3 w-28 rounded bg-white/10" />
                    <div className="mt-2 h-2 w-20 rounded bg-white/5" />
                  </div>
                  <div className="h-5 w-12 rounded bg-white/10" />
                </div>
              ),
            )}
          </div>
        ) : visibleEntries.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            <Trophy className="mx-auto h-6 w-6 text-slate-600" />

            <p className="mt-3 text-sm font-medium text-slate-400">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleEntries.map((entry, index) => {
              const resolvedRank =
                entry.rank ?? index + 1;

              const isCurrentUser =
                entry.isCurrentUser ||
                Boolean(
                  currentUserId &&
                    (entry.userId ===
                      currentUserId ||
                      entry.participantId ===
                        currentUserId),
                );

              return (
                <button
                  key={entry.id}
                  type="button"
                  disabled={!onParticipantClick}
                  onClick={() =>
                    onParticipantClick?.(entry)
                  }
                  className={[
                    "w-full rounded-xl border text-left transition",
                    "focus:outline-none focus:ring-2 focus:ring-cyan-400/30",
                    isCurrentUser
                      ? "border-cyan-400/25 bg-cyan-400/5"
                      : "border-white/5 bg-white/[0.02]",
                    onParticipantClick
                      ? "cursor-pointer hover:border-white/15 hover:bg-white/[0.04]"
                      : "cursor-default",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 p-3">
                    {showRank && (
                      <div className="flex w-7 shrink-0 justify-center">
                        {resolvedRank <= 3 ? (
                          <RankIcon
                            rank={resolvedRank}
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-500">
                            #{resolvedRank}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                      {entry.avatarUrl ? (
                        <img
                          src={entry.avatarUrl}
                          alt={entry.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-slate-300">
                          {getInitials(entry.name)}
                        </span>
                      )}

                      {entry.isConnected !== false && (
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-slate-950 bg-emerald-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {entry.name}
                        </p>

                        {isCurrentUser && (
                          <span className="shrink-0 rounded-full bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyan-300">
                            You
                          </span>
                        )}
                      </div>

                      {showStats && (
                        <div className="mt-1 flex flex-wrap gap-x-2 text-[10px] text-slate-500">
                          {entry.correctAnswers !==
                            undefined && (
                            <span>
                              {entry.correctAnswers} correct
                            </span>
                          )}

                          {entry.answeredQuestions !==
                            undefined && (
                            <span>
                              {entry.answeredQuestions} answered
                            </span>
                          )}
                        </div>
                      )}

                      {showStatus &&
                        entry.isEliminated && (
                          <span className="mt-1 inline-block text-[10px] font-semibold text-red-300">
                            Eliminated
                          </span>
                        )}
                    </div>

                    {showScore && (
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold tabular-nums text-white">
                          {entry.score.toLocaleString()}
                        </p>

                        <p className="text-[9px] uppercase tracking-wider text-slate-600">
                          pts
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {entries.length > visibleEntries.length && (
        <p className="mt-4 text-center text-xs text-slate-600">
          Showing {visibleEntries.length} of{" "}
          {entries.length} participants
        </p>
      )}
    </section>
  );
}