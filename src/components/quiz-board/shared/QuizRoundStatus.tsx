



"use client";

import {
  CheckCircle2,
  CircleDot,
  Flag,
  Loader2,
  PauseCircle,
  Trophy,
} from "lucide-react";

export type QuizRoundState =
  | "WAITING"
  | "READY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ELIMINATION"
  | "FINAL"
  | "CANCELLED";

export interface QuizRoundStatusProps {
  currentRound: number;
  totalRounds: number;

  status?: QuizRoundState;

  currentQuestionNumber?: number | null;
  totalQuestions?: number | null;

  activeParticipantCount?: number | null;
  targetParticipantCount?: number | null;

  label?: string;

  compact?: boolean;
}

export default function QuizRoundStatus({
  currentRound,
  totalRounds,

  status = "WAITING",

  currentQuestionNumber = null,
  totalQuestions = null,

  activeParticipantCount = null,
  targetParticipantCount = null,

  label,

  compact = false,
}: QuizRoundStatusProps) {
  const config = {
    WAITING: {
      icon: PauseCircle,
      label: label ?? "Waiting for round",
      className:
        "border-slate-400/20 bg-white/[0.03]",
      iconClassName: "text-slate-400",
    },

    READY: {
      icon: CircleDot,
      label: label ?? "Round ready",
      className:
        "border-cyan-400/20 bg-cyan-400/5",
      iconClassName: "text-cyan-300",
    },

    IN_PROGRESS: {
      icon: Loader2,
      label: label ?? "Round in progress",
      className:
        "border-emerald-400/20 bg-emerald-400/5",
      iconClassName:
        "animate-spin text-emerald-300",
    },

    COMPLETED: {
      icon: CheckCircle2,
      label: label ?? "Round completed",
      className:
        "border-slate-400/20 bg-white/[0.03]",
      iconClassName: "text-slate-300",
    },

    ELIMINATION: {
      icon: Flag,
      label: label ?? "Elimination stage",
      className:
        "border-amber-400/20 bg-amber-400/5",
      iconClassName: "text-amber-300",
    },

    FINAL: {
      icon: Trophy,
      label: label ?? "Final round",
      className:
        "border-violet-400/20 bg-violet-400/5",
      iconClassName: "text-violet-300",
    },

    CANCELLED: {
      icon: Flag,
      label: label ?? "Round cancelled",
      className:
        "border-red-400/20 bg-red-400/5",
      iconClassName: "text-red-300",
    },
  }[status];

  const Icon = config.icon;

  const questionProgress =
    currentQuestionNumber !== null &&
    totalQuestions !== null &&
    totalQuestions > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (currentQuestionNumber /
              totalQuestions) *
              100,
          ),
        )
      : null;

  return (
    <section
      className={[
        "rounded-2xl border",
        compact ? "p-4" : "p-5 sm:p-6",
        config.className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon
            className={[
              compact
                ? "h-4 w-4"
                : "h-5 w-5",
              config.iconClassName,
            ].join(" ")}
          />

          <div>
            <p className="text-sm font-semibold text-white">
              {config.label}
            </p>

            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">
              Round {currentRound} of{" "}
              {totalRounds}
            </p>
          </div>
        </div>

        {status === "FINAL" && (
          <Trophy className="h-5 w-5 text-violet-300" />
        )}
      </div>

      {(questionProgress !== null ||
        activeParticipantCount !== null) && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {questionProgress !== null && (
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  Questions
                </span>

                <span className="text-xs font-semibold text-slate-300">
                  {currentQuestionNumber} /{" "}
                  {totalQuestions}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{
                    width: `${questionProgress}%`,
                  }}
                />
              </div>
            </div>
          )}

          {activeParticipantCount !==
            null && (
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  Active participants
                </span>

                <span className="text-xs font-semibold text-slate-300">
                  {activeParticipantCount}
                  {targetParticipantCount !==
                    null &&
                    ` / ${targetParticipantCount}`}
                </span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-violet-400 transition-all duration-500"
                  style={{
                    width:
                      targetParticipantCount &&
                      targetParticipantCount > 0
                        ? `${Math.min(
                            100,
                            (activeParticipantCount /
                              targetParticipantCount) *
                              100,
                          )}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}