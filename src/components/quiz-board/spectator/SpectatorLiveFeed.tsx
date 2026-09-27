




"use client";

import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  Radio,
  Trophy,
  UserPlus,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

export type SpectatorFeedEventType =
  | "QUESTION_STARTED"
  | "QUESTION_LOCKED"
  | "ANSWER_SUBMITTED"
  | "FIRST_CORRECT"
  | "PARTICIPANT_JOINED"
  | "PARTICIPANT_ELIMINATED"
  | "ROUND_STARTED"
  | "ROUND_COMPLETED"
  | "LEADERBOARD_UPDATED"
  | "MESSAGE"
  | "SYSTEM";

export interface SpectatorFeedEvent {
  id: string;

  type: SpectatorFeedEventType;

  message?: string;

  participantName?: string | null;

  questionNumber?: number | null;

  roundNumber?: number | null;

  score?: number | null;

  timestamp?: string | null;
}

export interface SpectatorLiveFeedProps {
  events: SpectatorFeedEvent[];

  title?: string;

  maxVisible?: number;

  loading?: boolean;

  emptyMessage?: string;

  compact?: boolean;

  autoScroll?: boolean;
}

function formatTime(
  timestamp?: string | null,
) {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getEventIcon(
  type: SpectatorFeedEventType,
) {
  switch (type) {
    case "QUESTION_STARTED":
      return (
        <Radio className="h-4 w-4 text-cyan-300" />
      );

    case "QUESTION_LOCKED":
      return (
        <Clock3 className="h-4 w-4 text-orange-300" />
      );

    case "ANSWER_SUBMITTED":
      return (
        <CheckCircle2 className="h-4 w-4 text-blue-300" />
      );

    case "FIRST_CORRECT":
      return (
        <Zap className="h-4 w-4 text-amber-300" />
      );

    case "PARTICIPANT_JOINED":
      return (
        <UserPlus className="h-4 w-4 text-emerald-300" />
      );

    case "PARTICIPANT_ELIMINATED":
      return (
        <XCircle className="h-4 w-4 text-red-300" />
      );

    case "ROUND_STARTED":
      return (
        <Radio className="h-4 w-4 text-violet-300" />
      );

    case "ROUND_COMPLETED":
      return (
        <Trophy className="h-4 w-4 text-amber-300" />
      );

    case "LEADERBOARD_UPDATED":
      return (
        <Users className="h-4 w-4 text-cyan-300" />
      );

    case "MESSAGE":
      return (
        <CircleAlert className="h-4 w-4 text-slate-300" />
      );

    default:
      return (
        <CircleAlert className="h-4 w-4 text-slate-400" />
      );
  }
}

function getEventLabel(
  type: SpectatorFeedEventType,
) {
  switch (type) {
    case "QUESTION_STARTED":
      return "Question started";

    case "QUESTION_LOCKED":
      return "Question locked";

    case "ANSWER_SUBMITTED":
      return "Answer submitted";

    case "FIRST_CORRECT":
      return "First correct";

    case "PARTICIPANT_JOINED":
      return "Participant joined";

    case "PARTICIPANT_ELIMINATED":
      return "Participant eliminated";

    case "ROUND_STARTED":
      return "Round started";

    case "ROUND_COMPLETED":
      return "Round completed";

    case "LEADERBOARD_UPDATED":
      return "Leaderboard updated";

    case "MESSAGE":
      return "Message";

    default:
      return "System";
  }
}

export default function SpectatorLiveFeed({
  events,

  title = "Live Activity",

  maxVisible = 20,

  loading = false,

  emptyMessage = "Live activity will appear here.",

  compact = false,

  autoScroll = false,
}: SpectatorLiveFeedProps) {
  const visibleEvents = events.slice(-maxVisible);

  return (
    <section
      className={[
        "rounded-2xl border border-white/10",
        "bg-slate-950/70 shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5",
      ].join(" ")}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
            <Radio className="h-4 w-4 text-cyan-300" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-white">
              {title}
            </h2>

            <p className="text-[10px] text-slate-600">
              Real-time room activity
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          LIVE
        </span>
      </div>

      {/* FEED */}
      <div
        className={[
          "mt-4 space-y-2",
          autoScroll
            ? "max-h-[420px] overflow-y-auto pr-1"
            : "",
        ].join(" ")}
      >
        {loading ? (
          Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-white/[0.03]"
            />
          ))
        ) : visibleEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            <Radio className="mx-auto h-6 w-6 text-slate-700" />

            <p className="mt-3 text-xs text-slate-500">
              {emptyMessage}
            </p>
          </div>
        ) : (
          visibleEvents
            .slice()
            .reverse()
            .map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    {getEventIcon(event.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {getEventLabel(event.type)}
                      </p>

                      {event.timestamp && (
                        <span className="shrink-0 text-[9px] text-slate-700">
                          {formatTime(
                            event.timestamp,
                          )}
                        </span>
                      )}
                    </div>

                    {event.message && (
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        {event.message}
                      </p>
                    )}

                    {event.participantName && (
                      <p className="mt-1 text-xs font-medium text-white">
                        {event.participantName}
                      </p>
                    )}

                    {(event.questionNumber !==
                      null &&
                      event.questionNumber !==
                        undefined) ||
                    (event.roundNumber !== null &&
                      event.roundNumber !==
                        undefined) ? (
                      <div className="mt-1 flex flex-wrap gap-2 text-[9px] text-slate-600">
                        {event.roundNumber !==
                          null &&
                          event.roundNumber !==
                            undefined && (
                            <span>
                              Round{" "}
                              {event.roundNumber}
                            </span>
                          )}

                        {event.questionNumber !==
                          null &&
                          event.questionNumber !==
                            undefined && (
                            <span>
                              Question{" "}
                              {event.questionNumber}
                            </span>
                          )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </section>
  );
}