





"use client";

import {
  CheckCircle2,
  Circle,
  UserRound,
  Wifi,
  WifiOff,
} from "lucide-react";

export interface QuizParticipant {
  id: string;

  userId?: string | null;
  participantId?: string | null;

  name: string;
  username?: string | null;
  avatarUrl?: string | null;

  connected?: boolean;

  score?: number;
  rank?: number | null;

  answeredQuestions?: number;
  correctAnswers?: number;

  isCurrentUser?: boolean;
  isEliminated?: boolean;
  isActive?: boolean;
}

export interface QuizParticipantListProps {
  participants: QuizParticipant[];

  title?: string;

  currentUserId?: string | null;

  maxVisible?: number;

  loading?: boolean;

  showSearch?: boolean;
  showScore?: boolean;
  showRank?: boolean;
  showStats?: boolean;
  showConnection?: boolean;
  showEliminated?: boolean;

  emptyMessage?: string;

  onParticipantClick?: (
    participant: QuizParticipant,
  ) => void;

  compact?: boolean;
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[
    parts.length - 1
  ][0]}`.toUpperCase();
}

export default function QuizParticipantList({
  participants,

  title = "Participants",

  currentUserId = null,

  maxVisible = 20,

  loading = false,

  showSearch = false,
  showScore = true,
  showRank = true,
  showStats = false,
  showConnection = true,
  showEliminated = true,

  emptyMessage = "No participants have joined yet.",

  onParticipantClick,

  compact = false,
}: QuizParticipantListProps) {
  const [search, setSearch] = React.useState("");

  const filteredParticipants =
    search.trim().length === 0
      ? participants
      : participants.filter(
          (participant) => {
            const query =
              search.toLowerCase();

            return (
              participant.name
                .toLowerCase()
                .includes(query) ||
              participant.username
                ?.toLowerCase()
                .includes(query)
            );
          },
        );

  const visibleParticipants =
    filteredParticipants.slice(
      0,
      Math.max(1, maxVisible),
    );

  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-slate-950/70",
        "shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5 sm:p-6",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {participants.length} participant
            {participants.length === 1
              ? ""
              : "s"}
          </p>
        </div>

        <div className="rounded-full bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400">
          {participants.filter(
            (participant) =>
              participant.connected !== false,
          ).length}{" "}
          online
        </div>
      </div>

      {showSearch && (
        <div className="mt-4">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search participants..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>
      )}

      <div className="mt-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-3 rounded-xl bg-white/[0.02] p-3"
                >
                  <div className="h-9 w-9 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <div className="h-3 w-28 rounded bg-white/10" />
                    <div className="mt-2 h-2 w-16 rounded bg-white/5" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : visibleParticipants.length ===
          0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
            <UserRound className="mx-auto h-6 w-6 text-slate-600" />

            <p className="mt-3 text-sm text-slate-500">
              {search
                ? "No matching participants."
                : emptyMessage}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleParticipants.map(
              (participant) => {
                const isCurrentUser =
                  participant.isCurrentUser ||
                  Boolean(
                    currentUserId &&
                      (participant.userId ===
                        currentUserId ||
                        participant.participantId ===
                          currentUserId),
                  );

                const clickable =
                  Boolean(
                    onParticipantClick,
                  );

                return (
                  <button
                    key={participant.id}
                    type="button"
                    disabled={!clickable}
                    onClick={() =>
                      onParticipantClick?.(
                        participant,
                      )
                    }
                    className={[
                      "w-full rounded-xl border text-left transition",
                      isCurrentUser
                        ? "border-cyan-400/20 bg-cyan-400/5"
                        : "border-white/5 bg-white/[0.02]",
                      clickable
                        ? "cursor-pointer hover:border-white/15 hover:bg-white/[0.04]"
                        : "cursor-default",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                        {participant.avatarUrl ? (
                          <img
                            src={
                              participant.avatarUrl
                            }
                            alt={participant.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-300">
                            {getInitials(
                              participant.name,
                            )}
                          </span>
                        )}

                        {showConnection && (
                          <span
                            className={[
                              "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-slate-950",
                              participant.connected ===
                                false
                                ? "bg-slate-600"
                                : "bg-emerald-400",
                            ].join(" ")}
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {participant.name}
                          </p>

                          {isCurrentUser && (
                            <span className="shrink-0 rounded-full bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-cyan-300">
                              You
                            </span>
                          )}
                        </div>

                        {participant.username && (
                          <p className="truncate text-[10px] text-slate-600">
                            @{participant.username}
                          </p>
                        )}

                        {showStats && (
                          <div className="mt-1 flex gap-2 text-[10px] text-slate-500">
                            {participant.correctAnswers !==
                              undefined && (
                              <span>
                                {
                                  participant.correctAnswers
                                }{" "}
                                correct
                              </span>
                            )}

                            {participant.answeredQuestions !==
                              undefined && (
                              <span>
                                {
                                  participant.answeredQuestions
                                }{" "}
                                answered
                              </span>
                            )}
                          </div>
                        )}

                        {showEliminated &&
                          participant.isEliminated && (
                            <span className="mt-1 inline-flex text-[10px] font-semibold text-red-300">
                              Eliminated
                            </span>
                          )}
                      </div>

                      {showRank &&
                        participant.rank !==
                          null &&
                        participant.rank !==
                          undefined && (
                          <span className="hidden shrink-0 text-xs font-bold text-slate-500 sm:block">
                            #{participant.rank}
                          </span>
                        )}

                      {showScore &&
                        participant.score !==
                          undefined && (
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold tabular-nums text-white">
                              {participant.score.toLocaleString()}
                            </p>

                            <p className="text-[9px] uppercase tracking-wider text-slate-600">
                              pts
                            </p>
                          </div>
                        )}
                    </div>

                    {showConnection && (
                      <div className="border-t border-white/5 px-3 py-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                          {participant.connected ===
                          false ? (
                            <>
                              <WifiOff className="h-3 w-3" />
                              Offline
                            </>
                          ) : (
                            <>
                              <Wifi className="h-3 w-3 text-emerald-400/70" />
                              Online
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                );
              },
            )}
          </div>
        )}
      </div>

      {filteredParticipants.length >
        visibleParticipants.length && (
        <p className="mt-4 text-center text-xs text-slate-600">
          Showing {visibleParticipants.length} of{" "}
          {filteredParticipants.length}
        </p>
      )}
    </section>
  );
}

/*
 * React is intentionally imported through the namespace here
 * because this component uses React.useState while remaining
 * compatible with projects using the classic JSX runtime.
 */
import * as React from "react";