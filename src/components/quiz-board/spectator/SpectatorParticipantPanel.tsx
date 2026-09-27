




"use client";

import {
  Circle,
  Search,
  Shield,
  UserRound,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface SpectatorParticipant {
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

  isEliminated?: boolean;
  isActive?: boolean;
}

export interface SpectatorParticipantPanelProps {
  participants: SpectatorParticipant[];

  title?: string;

  maxVisible?: number;

  loading?: boolean;

  showSearch?: boolean;
  showScore?: boolean;
  showRank?: boolean;
  showStats?: boolean;
  showConnectionStatus?: boolean;
  showEliminated?: boolean;

  emptyMessage?: string;

  compact?: boolean;

  onParticipantClick?: (
    participant: SpectatorParticipant,
  ) => void;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function SpectatorParticipantPanel({
  participants,

  title = "Participants",

  maxVisible = 20,

  loading = false,

  showSearch = true,
  showScore = true,
  showRank = true,
  showStats = false,
  showConnectionStatus = true,
  showEliminated = true,

  emptyMessage = "No participants have joined yet.",

  compact = false,

  onParticipantClick,
}: SpectatorParticipantPanelProps) {
  const [search, setSearch] = useState("");

  const filteredParticipants =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      const filtered = participants.filter(
        (participant) => {
          if (!query) {
            return true;
          }

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

      return filtered
        .slice()
        .sort((a, b) => {
          if (
            a.isEliminated !==
            b.isEliminated
          ) {
            return a.isEliminated ? 1 : -1;
          }

          if (
            a.connected !==
            b.connected
          ) {
            return a.connected ? -1 : 1;
          }

          return (
            (a.rank ?? Number.MAX_SAFE_INTEGER) -
            (b.rank ?? Number.MAX_SAFE_INTEGER)
          );
        })
        .slice(0, maxVisible);
    }, [
      participants,
      search,
      maxVisible,
    ]);

  const onlineCount = participants.filter(
    (participant) =>
      participant.connected,
  ).length;

  const activeCount = participants.filter(
    (participant) =>
      participant.isActive !== false &&
      !participant.isEliminated,
  ).length;

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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <Users className="h-4 w-4 text-cyan-300" />
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white">
              {title}
            </h2>

            <div className="mt-0.5 flex flex-wrap gap-2 text-[10px] text-slate-600">
              <span>
                {participants.length} total
              </span>

              <span>
                {activeCount} active
              </span>

              {showConnectionStatus && (
                <span className="text-emerald-500/70">
                  {onlineCount} online
                </span>
              )}
            </div>
          </div>
        </div>

        <Shield className="h-4 w-4 shrink-0 text-slate-700" />
      </div>

      {/* SEARCH */}
      {showSearch && (
        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search participants..."
            className="h-9 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
          />
        </div>
      )}

      {/* LIST */}
      <div className="mt-4 space-y-2">
        {loading ? (
          Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl bg-white/[0.03]"
            />
          ))
        ) : filteredParticipants.length ===
          0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            <UserRound className="mx-auto h-6 w-6 text-slate-700" />

            <p className="mt-3 text-xs text-slate-500">
              {search
                ? "No matching participants."
                : emptyMessage}
            </p>
          </div>
        ) : (
          filteredParticipants.map(
            (participant) => (
              <button
                key={participant.id}
                type="button"
                disabled={
                  !onParticipantClick
                }
                onClick={() =>
                  onParticipantClick?.(
                    participant,
                  )
                }
                className={[
                  "w-full rounded-xl border border-white/5 bg-white/[0.02] text-left transition",
                  onParticipantClick
                    ? "cursor-pointer hover:border-white/15 hover:bg-white/[0.04]"
                    : "cursor-default",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex items-center gap-3",
                    compact
                      ? "p-2.5"
                      : "p-3",
                  ].join(" ")}
                >
                  {/* AVATAR */}
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                    {participant.avatarUrl ? (
                      <img
                        src={
                          participant.avatarUrl
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">
                        {getInitials(
                          participant.name ||
                            participant.username ||
                            "P",
                        )}
                      </span>
                    )}

                    {showConnectionStatus && (
                      <span
                        className={[
                          "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950",
                          participant.connected
                            ? "bg-emerald-400"
                            : "bg-slate-700",
                        ].join(" ")}
                      />
                    )}
                  </div>

                  {/* INFO */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-semibold text-white">
                        {participant.name ||
                          participant.username ||
                          "Participant"}
                      </p>

                      {participant.isEliminated &&
                        showEliminated && (
                          <span className="rounded-full bg-red-400/10 px-1.5 py-0.5 text-[9px] font-medium text-red-300">
                            Eliminated
                          </span>
                        )}
                    </div>

                    {showStats && (
                      <div className="mt-0.5 flex gap-2 text-[9px] text-slate-600">
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
                  </div>

                  {/* RANK */}
                  {showRank &&
                    participant.rank !==
                      null &&
                    participant.rank !==
                      undefined && (
                      <div className="shrink-0 text-center">
                        <p className="text-xs font-bold text-slate-300">
                          #
                          {participant.rank}
                        </p>

                        <p className="text-[8px] uppercase tracking-wider text-slate-700">
                          rank
                        </p>
                      </div>
                    )}

                  {/* SCORE */}
                  {showScore && (
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-cyan-300">
                        {participant.score ??
                          0}
                      </p>

                      <p className="text-[8px] uppercase tracking-wider text-slate-700">
                        pts
                      </p>
                    </div>
                  )}

                  {showConnectionStatus && (
                    <Circle
                      className={[
                        "h-2.5 w-2.5 shrink-0 fill-current",
                        participant.connected
                          ? "text-emerald-400"
                          : "text-slate-700",
                      ].join(" ")}
                    />
                  )}
                </div>
              </button>
            ),
          )
        )}
      </div>

      {!loading &&
        filteredParticipants.length >
          0 &&
        participants.length > maxVisible && (
          <p className="mt-3 text-center text-[10px] text-slate-600">
            Showing {maxVisible} of{" "}
            {participants.length} participants
          </p>
        )}
    </section>
  );
}