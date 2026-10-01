









"use client";

import {
  CheckCircle2,
  Clock3,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";

export type ContestantAnswerStatusType =
  | "IDLE"
  | "SELECTED"
  | "SUBMITTING"
  | "SUBMITTED"
  | "CORRECT"
  | "INCORRECT"
  | "EXPIRED"
  | "LOCKED";

export interface ContestantAnswerStatusProps {
  status: ContestantAnswerStatusType;

  selectedAnswer?: string | null;
  submittedAnswer?: string | null;

  pointsEarned?: number | null;

  message?: string | null;

  showSelectedAnswer?: boolean;
  showPoints?: boolean;

  compact?: boolean;
}

export default function ContestantAnswerStatus({
  status,
  selectedAnswer = null,
  submittedAnswer = null,
  pointsEarned = null,
  message = null,
  showSelectedAnswer = true,
  showPoints = true,
  compact = false,
}: ContestantAnswerStatusProps) {
  const config = {
    IDLE: {
      icon: Info,
      title: "Choose an answer",
      description:
        "Select an option before submitting.",
      className:
        "border-white/10 bg-white/[0.03] text-slate-300",
      iconClassName: "text-slate-400",
    },

    SELECTED: {
      icon: CheckCircle2,
      title: "Answer selected",
      description:
        "Submit your answer before the question closes.",
      className:
        "border-cyan-400/20 bg-cyan-400/5 text-cyan-100",
      iconClassName: "text-cyan-300",
    },

    SUBMITTING: {
      icon: Loader2,
      title: "Submitting answer",
      description:
        "Your answer is being sent to the game server.",
      className:
        "border-cyan-400/20 bg-cyan-400/5 text-cyan-100",
      iconClassName: "animate-spin text-cyan-300",
    },

    SUBMITTED: {
      icon: CheckCircle2,
      title: "Answer submitted",
      description:
        "Your answer has been received. Wait for the result.",
      className:
        "border-emerald-400/20 bg-emerald-400/5 text-emerald-100",
      iconClassName: "text-emerald-300",
    },

    CORRECT: {
      icon: CheckCircle2,
      title: "Correct answer",
      description:
        "You answered correctly.",
      className:
        "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
      iconClassName: "text-emerald-300",
    },

    INCORRECT: {
      icon: XCircle,
      title: "Incorrect answer",
      description:
        "Your answer was not correct.",
      className:
        "border-red-400/30 bg-red-400/10 text-red-100",
      iconClassName: "text-red-300",
    },

    EXPIRED: {
      icon: Clock3,
      title: "Time expired",
      description:
        "The question timer has ended.",
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-100",
      iconClassName: "text-amber-300",
    },

    LOCKED: {
      icon: Clock3,
      title: "Question locked",
      description:
        "The host has locked this question.",
      className:
        "border-amber-400/20 bg-amber-400/10 text-amber-100",
      iconClassName: "text-amber-300",
    },
  }[status];

  const Icon = config.icon;

  const answer =
    submittedAnswer || selectedAnswer;

  return (
    <section
      className={[
        "rounded-2xl border",
        compact ? "p-3.5" : "p-4 sm:p-5",
        config.className,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon
            className={[
              "h-5 w-5",
              config.iconClassName,
            ].join(" ")}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">
              {config.title}
            </h3>

            {showPoints &&
              pointsEarned !== null &&
              (status === "CORRECT" ||
                status === "INCORRECT") && (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">
                  {pointsEarned > 0
                    ? `+${pointsEarned}`
                    : pointsEarned}{" "}
                  pts
                </span>
              )}
          </div>

          <p className="mt-1 text-xs leading-5 text-current/70 sm:text-sm">
            {message || config.description}
          </p>

          {showSelectedAnswer && answer && (
            <div className="mt-3 rounded-xl border border-white/10 bg-black/10 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-current/50">
                Your answer
              </p>

              <p className="mt-1 break-words text-sm font-medium text-current">
                {answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}