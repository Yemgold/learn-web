




"use client";

import {
  CircleUserRound,
  LogIn,
  LogOut,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

export interface HostParticipant {
  id: string;
  userId?: string | null;
  participantId?: string | null;

  name: string;
  username?: string | null;
  email?: string | null;
  avatarUrl?: string | null;

  connected?: boolean;
  joinedAt?: string | null;

  score?: number;
  rank?: number | null;

  answeredQuestions?: number;
  correctAnswers?: number;

  isEliminated?: boolean;
  isActive?: boolean;
  isCurrentUser?: boolean;
}

export interface HostParticipantPanelProps {
  participants: HostParticipant[];

  title?: string;

  maxVisible?: number;

  loading?: boolean;

  showSearch?: boolean;
  showScore?: boolean;
  showStats?: boolean;
  showConnectionStatus?: boolean;
  showEliminated?: boolean;

  emptyMessage?: string;

  onParticipantClick?: (
    participant: HostParticipant,
  ) => void;

  onRemoveParticipant?: (
    participant: HostParticipant,
  ) => void;
}

function getDisplayName(
  participant: HostParticipant,
): string {
  return (
    participant.name?.trim() ||
    participant.username?.trim() ||
    "Contestant"
  );
}

export default function HostParticipantPanel({
  participants,
  title = "Participants",
  maxVisible = 8,
  loading = false,
  showSearch = true,
  showScore = true,
  showStats = true,
  showConnectionStatus = true,
  showEliminated = true,
  emptyMessage = "No contestants have joined yet.",
  onParticipantClick,
  onRemoveParticipant,
}: HostParticipantPanelProps) {
  const [search, setSearch] =
    useState("");

  const [showAll, setShowAll] =
    useState(false);

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredParticipants =
    useMemo(() => {
      return participants.filter(
        (participant) => {
          if (
            !showEliminated &&
            participant.isEliminated
          ) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const name =
            getDisplayName(
              participant,
            ).toLowerCase();

          const username =
            participant.username
              ?.toLowerCase() ?? "";

          const email =
            participant.email
              ?.toLowerCase() ?? "";

          return (
            name.includes(
              normalizedSearch,
            ) ||
            username.includes(
              normalizedSearch,
            ) ||
            email.includes(
              normalizedSearch,
            )
          );
        },
      );
    }, [
      participants,
      normalizedSearch,
      showEliminated,
    ]);

  const visibleParticipants =
    showAll
      ? filteredParticipants
      : filteredParticipants.slice(
          0,
          maxVisible,
        );

  const hiddenCount = Math.max(
    filteredParticipants.length -
      maxVisible,
    0,
  );

  const connectedCount =
    participants.filter(
      (participant) =>
        participant.connected,
    ).length;

  const disconnectedCount =
    participants.length -
    connectedCount;

  const activeCount =
    participants.filter(
      (participant) =>
        !participant.isEliminated,
    ).length;

  return (
    <section
      className={[
        "overflow-hidden rounded-2xl border",
        "border-white/10 bg-slate-950/70",
        "shadow-xl shadow-black/10",
      ].join(" ")}
    >
      {/* Header */}
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Users
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-white">
                {title}
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {participants.length}{" "}
                {participants.length === 1
                  ? "contestant"
                  : "contestants"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1">
              <Wifi
                className="h-3 w-3 text-emerald-400"
                aria-hidden="true"
              />

              <span className="text-[10px] font-bold text-emerald-300">
                {connectedCount}
              </span>
            </div>

            {disconnectedCount > 0 && (
              <div className="flex items-center gap-1.5 rounded-full border border-slate-400/10 bg-white/[0.03] px-2.5 py-1">
                <WifiOff
                  className="h-3 w-3 text-slate-500"
                  aria-hidden="true"
                />

                <span className="text-[10px] font-bold text-slate-500">
                  {disconnectedCount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
              Total
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {participants.length}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] px-3 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-500">
              Active
            </p>

            <p className="mt-1 text-lg font-black text-emerald-300">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] px-3 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-cyan-500">
              Online
            </p>

            <p className="mt-1 text-lg font-black text-cyan-300">
              {connectedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="border-b border-white/5 px-4 py-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search contestants..."
              className={[
                "h-10 w-full rounded-xl border",
                "border-white/10 bg-black/20",
                "pl-9 pr-3 text-sm text-white",
                "outline-none placeholder:text-slate-600",
                "focus:border-cyan-400/30",
                "focus:ring-2 focus:ring-cyan-400/10",
              ].join(" ")}
            />
          </div>
        </div>
      )}

      {/* List */}
      <div className="p-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-14 animate-pulse rounded-xl bg-white/[0.04]"
                />
              ),
            )}
          </div>
        ) : filteredParticipants.length ===
          0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            {search ? (
              <>
                <Search
                  className="mx-auto h-7 w-7 text-slate-600"
                  aria-hidden="true"
                />

                <p className="mt-3 text-sm font-medium text-slate-400">
                  No matching contestants.
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Try another name or username.
                </p>
              </>
            ) : (
              <>
                <Users
                  className="mx-auto h-7 w-7 text-slate-600"
                  aria-hidden="true"
                />

                <p className="mt-3 text-sm font-medium text-slate-400">
                  {emptyMessage}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Contestants will appear here
                  when they join the room.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {visibleParticipants.map(
              (participant, index) => {
                const displayName =
                  getDisplayName(
                    participant,
                  );

                const isClickable =
                  Boolean(
                    onParticipantClick,
                  );

                return (
                  <div
                    key={
                      participant.id ||
                      participant.participantId ||
                      participant.userId ||
                      `participant-${index}`
                    }
                    className={[
                      "group rounded-xl border",
                      "border-white/5 bg-white/[0.02]",
                      "transition",
                      participant.isEliminated
                        ? "opacity-55"
                        : "hover:border-white/10 hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3 px-3 py-3">
                      {/* Avatar */}
                      <button
                        type="button"
                        disabled={!isClickable}
                        onClick={() =>
                          onParticipantClick?.(
                            participant,
                          )
                        }
                        className={[
                          "relative shrink-0 rounded-full",
                          isClickable
                            ? "cursor-pointer"
                            : "cursor-default",
                        ].join(" ")}
                        aria-label={`View ${displayName}`}
                      >
                        {participant.avatarUrl ? (
                          <img
                            src={
                              participant.avatarUrl
                            }
                            alt=""
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300 ring-1 ring-white/10">
                            {displayName
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        {showConnectionStatus && (
                          <span
                            className={[
                              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-950",
                              participant.connected
                                ? "bg-emerald-400"
                                : "bg-slate-600",
                            ].join(" ")}
                          />
                        )}
                      </button>

                      {/* Identity */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {displayName}
                          </p>

                          {participant.isCurrentUser && (
                            <span className="shrink-0 rounded-full bg-cyan-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                              Host
                            </span>
                          )}

                          {participant.isEliminated && (
                            <span className="shrink-0 rounded-full bg-red-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-300">
                              Eliminated
                            </span>
                          )}
                        </div>

                        {participant.username && (
                          <p className="mt-0.5 truncate text-[11px] text-slate-500">
                            @{participant.username}
                          </p>
                        )}

                        {showStats && (
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
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
                              <>
                                {participant.correctAnswers !==
                                  undefined && (
                                  <span>
                                    •
                                  </span>
                                )}

                                <span>
                                  {
                                    participant.answeredQuestions
                                  }{" "}
                                  answered
                                </span>
                              </>
                            )}

                            {showConnectionStatus && (
                              <>
                                {(participant.correctAnswers !==
                                  undefined ||
                                  participant.answeredQuestions !==
                                    undefined) && (
                                  <span>
                                    •
                                  </span>
                                )}

                                <span
                                  className={
                                    participant.connected
                                      ? "text-emerald-500"
                                      : "text-slate-600"
                                  }
                                >
                                  {participant.connected
                                    ? "Online"
                                    : "Offline"}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Score */}
                      {showScore &&
                        participant.score !==
                          undefined && (
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-black tabular-nums text-white">
                              {participant.score.toLocaleString()}
                            </p>

                            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                              points
                            </p>
                          </div>
                        )}
                    </div>

                    {/* Status row */}
                    <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
                      <div className="flex items-center gap-2">
                        {participant.connected ? (
                          <>
                            <Wifi
                              className="h-3 w-3 text-emerald-400"
                              aria-hidden="true"
                            />

                            <span className="text-[10px] font-medium text-emerald-400">
                              Connected
                            </span>
                          </>
                        ) : (
                          <>
                            <WifiOff
                              className="h-3 w-3 text-slate-600"
                              aria-hidden="true"
                            />

                            <span className="text-[10px] font-medium text-slate-600">
                              Disconnected
                            </span>
                          </>
                        )}
                      </div>

                      {participant.rank &&
                        participant.rank >
                          0 && (
                          <span className="text-[10px] font-semibold text-slate-500">
                            Rank #
                            {participant.rank}
                          </span>
                        )}

                      {onRemoveParticipant &&
                        !participant.isEliminated && (
                          <button
                            type="button"
                            onClick={() =>
                              onRemoveParticipant(
                                participant,
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] font-semibold text-slate-500 transition hover:bg-red-400/10 hover:text-red-300"
                          >
                            <LogOut
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            Remove
                          </button>
                        )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}

        {/* Show more */}
        {!loading &&
          hiddenCount > 0 && (
            <button
              type="button"
              onClick={() =>
                setShowAll(
                  (value) => !value,
                )
              }
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              {showAll
                ? "Show less"
                : `Show ${hiddenCount} more`}
            </button>
          )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 bg-white/[0.015] px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          <ShieldCheck
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />

          <span>
            Participant status is synchronized
            with the live quiz room.
          </span>
        </div>
      </div>
    </section>
  );
}