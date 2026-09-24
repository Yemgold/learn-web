





"use client";

import {
  CheckCircle2,
  CircleUserRound,
  Crown,
  Loader2,
  Users,
} from "lucide-react";

import type { QuizCompetition } from "@/lib/quiz-board/waiting-room/types";

import {
  getJoinedUsers,
  getParticipantLabel,
} from "@/lib/quiz-board/waiting-room/helpers";

interface ContestantsGridProps {
  quiz: QuizCompetition | null;
  contestantCount?: number;
  maxContestants?: number;
  currentUserId?: string | null;
  currentContestantId?: string | null;
  connectedContestantIds?: string[];
  loading?: boolean;
}

interface ContestantItem {
  id: string;
  label: string;
  isCurrentUser: boolean;
  isConnected: boolean;
}

export default function ContestantsGrid({
  quiz,
  contestantCount,
  maxContestants,
  currentUserId = null,
  currentContestantId = null,
  connectedContestantIds = [],
  loading = false,
}: ContestantsGridProps) {
  const joinedUsers = getJoinedUsers(quiz);

  const displayedCount =
    typeof contestantCount === "number"
      ? contestantCount
      : joinedUsers.length;

  const displayedCapacity =
    typeof maxContestants === "number"
      ? maxContestants
      : Number(quiz?.no_of_contestants ?? 0);

  const normalizedCurrentUserId =
    normalizeValue(currentUserId);

  const normalizedCurrentContestantId =
    normalizeValue(currentContestantId);

  const normalizedConnectedIds =
    new Set(
      connectedContestantIds
        .map(normalizeValue)
        .filter(Boolean),
    );

  const contestants: ContestantItem[] =
    joinedUsers.map((participant, index) => {
      const label =
        getParticipantLabel(
          participant,
          index,
        );

      const participantKey =
        getParticipantKey(
          participant,
          index,
        );

      const normalizedParticipantKey =
        normalizeValue(
          participantKey,
        );

      const isCurrentUser =
        Boolean(
          normalizedCurrentUserId &&
            normalizedParticipantKey ===
              normalizedCurrentUserId,
        ) ||
        Boolean(
          normalizedCurrentContestantId &&
            normalizedParticipantKey ===
              normalizedCurrentContestantId,
        ) ||
        Boolean(
          normalizedCurrentContestantId &&
            normalizeValue(label) ===
              normalizedCurrentContestantId,
        );

      const isConnected =
        isCurrentUser ||
        normalizedConnectedIds.has(
          normalizedParticipantKey,
        ) ||
        normalizedConnectedIds.has(
          normalizeValue(label),
        );

      return {
        id: participantKey,
        label,
        isCurrentUser,
        isConnected,
      };
    });

  /*
   * If Socket.IO reports more contestants than the REST
   * snapshot currently contains, preserve the live count
   * without inventing contestant identities.
   */
  const visibleSlots =
    displayedCapacity > 0
      ? Math.max(
          displayedCapacity,
          contestants.length,
        )
      : contestants.length;

  const emptySlots = Math.max(
    0,
    visibleSlots - contestants.length,
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-400/20">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
              Contestants
            </p>

            <h2 className="mt-1 text-lg font-bold text-white">
              Competition Lobby
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Players registered for this competition.
            </p>
          </div>
        </div>

        {/* Count */}
        <div className="shrink-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-right">
          <p className="text-lg font-bold text-white">
            {displayedCount}
            {displayedCapacity > 0 && (
              <span className="text-slate-500">
                {" "}
                / {displayedCapacity}
              </span>
            )}
          </p>

          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Players
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="mt-5 flex min-h-[160px] items-center justify-center rounded-xl border border-white/8 bg-black/10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />

            <p className="text-sm text-slate-500">
              Loading contestants...
            </p>
          </div>
        </div>
      ) : contestants.length > 0 ? (
        <>
          {/* Contestant cards */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contestants.map(
              (contestant, index) => (
                <ContestantCard
                  key={`${contestant.id}-${index}`}
                  contestant={contestant}
                  index={index}
                />
              ),
            )}

            {/* Empty slots */}
            {Array.from({
              length: emptySlots,
            }).map((_, index) => (
              <EmptySlot
                key={`empty-${index}`}
                position={
                  contestants.length +
                  index +
                  1
                }
              />
            ))}
          </div>

          {/* Lobby status */}
          <LobbySummary
            joinedCount={displayedCount}
            capacity={displayedCapacity}
          />
        </>
      ) : (
        <EmptyLobby
          capacity={displayedCapacity}
        />
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Contestant card                                                           */
/* -------------------------------------------------------------------------- */

function ContestantCard({
  contestant,
  index,
}: {
  contestant: ContestantItem;
  index: number;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border p-4 transition",
        contestant.isCurrentUser
          ? "border-cyan-400/30 bg-cyan-400/[0.07] shadow-lg shadow-cyan-950/20"
          : contestant.isConnected
            ? "border-emerald-400/15 bg-emerald-400/[0.04]"
            : "border-white/8 bg-black/10",
      ].join(" ")}
    >
      {/* Current contestant indicator */}
      {contestant.isCurrentUser && (
        <div className="absolute right-3 top-3">
          <Crown className="h-4 w-4 text-amber-400" />
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1",
            contestant.isCurrentUser
              ? "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20"
              : "bg-white/[0.05] text-slate-400 ring-white/10",
          ].join(" ")}
        >
          <CircleUserRound className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {contestant.label}
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                contestant.isConnected
                  ? "bg-emerald-400"
                  : "bg-slate-600",
              ].join(" ")}
            />

            <span className="text-[11px] text-slate-500">
              {contestant.isCurrentUser
                ? "You"
                : contestant.isConnected
                  ? "Connected"
                  : "Registered"}
            </span>
          </div>
        </div>

        {/* Position */}
        <span className="self-start text-xs font-semibold text-slate-600">
          #{index + 1}
        </span>
      </div>

      {contestant.isCurrentUser && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-cyan-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Your contestant account
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty slot                                                                 */
/* -------------------------------------------------------------------------- */

function EmptySlot({
  position,
}: {
  position: number;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-black/[0.06] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-white/10 text-slate-600">
          <Users className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">
            Waiting for contestant
          </p>

          <p className="mt-0.5 text-[11px] text-slate-700">
            Position #{position}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty lobby                                                                */
/* -------------------------------------------------------------------------- */

function EmptyLobby({
  capacity,
}: {
  capacity: number;
}) {
  return (
    <div className="mt-5 flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/[0.06] px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] text-slate-500">
        <Users className="h-5 w-5" />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-300">
        No contestants to display yet
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
        Contestants will appear here as they register
        and connect to the competition room.
      </p>

      {capacity > 0 && (
        <p className="mt-3 text-xs font-medium text-slate-600">
          Room capacity: {capacity}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Lobby summary                                                              */
/* -------------------------------------------------------------------------- */

function LobbySummary({
  joinedCount,
  capacity,
}: {
  joinedCount: number;
  capacity: number;
}) {
  if (capacity <= 0) {
    return null;
  }

  const isFull =
    joinedCount >= capacity;

  const remaining = Math.max(
    0,
    capacity - joinedCount,
  );

  return (
    <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-black/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <span
          className={[
            "h-2 w-2 rounded-full",
            isFull
              ? "bg-emerald-400"
              : "bg-cyan-400",
          ].join(" ")}
        />

        <p className="text-xs text-slate-400">
          {isFull
            ? "Competition is full"
            : `${remaining} ${
                remaining === 1
                  ? "spot"
                  : "spots"
              } remaining`}
        </p>
      </div>

      <p className="text-xs font-semibold text-slate-500">
        {joinedCount} / {capacity}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeValue(
  value: unknown,
): string {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .trim()
    .toLowerCase();
}

function getParticipantKey(
  participant: unknown,
  index: number,
): string {
  if (
    typeof participant === "string" &&
    participant.trim()
  ) {
    return participant.trim();
  }

  if (
    typeof participant === "object" &&
    participant !== null
  ) {
    const data =
      participant as Record<
        string,
        unknown
      >;

    const possibleIds = [
      data.contestantId,
      data.contestant_id,
      data.participantId,
      data.participant_id,
      data.userId,
      data.user_id,
      data._id,
      data.id,
      data.username,
    ];

    for (const value of possibleIds) {
      if (
        typeof value === "string" &&
        value.trim()
      ) {
        return value.trim();
      }
    }
  }

  return `contestant-${index + 1}`;
}