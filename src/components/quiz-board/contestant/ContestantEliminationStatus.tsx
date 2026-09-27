



"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

export type ContestantEliminationState =
  | "ACTIVE"
  | "SAFE"
  | "AT_RISK"
  | "ELIMINATED"
  | "FINALIST"
  | "WINNER"
  | "WAITING";

export interface ContestantEliminationStatusProps {
  status: ContestantEliminationState;

  currentRound?: number | null;
  totalRounds?: number | null;

  rank?: number | null;
  activeParticipantCount?: number | null;
  targetParticipantCount?: number | null;

  score?: number | null;

  message?: string | null;

  compact?: boolean;
}

export default function ContestantEliminationStatus({
  status,
  currentRound = null,
  totalRounds = null,
  rank = null,
  activeParticipantCount = null,
  targetParticipantCount = null,
  score = null,
  message = null,
  compact = false,
}: ContestantEliminationStatusProps) {
  const config = {
    ACTIVE: {
      icon: ShieldCheck,
      title: "You are still in the game",
      description:
        "Keep answering questions to remain competitive.",
      className:
        "border-cyan-400/20 bg-cyan-400/5",
      iconClassName: "text-cyan-300",
      titleClassName: "text-cyan-100",
    },

    SAFE: {
      icon: CheckCircle2,
      title: "You are safe",
      description:
        "You have qualified for the next stage.",
      className:
        "border-emerald-400/20 bg-emerald-400/5",
      iconClassName: "text-emerald-300",
      titleClassName: "text-emerald-100",
    },

    AT_RISK: {
      icon: AlertTriangle,
      title: "You are at risk",
      description:
        "Your current position may place you in the elimination group.",
      className:
        "border-amber-400/20 bg-amber-400/5",
      iconClassName: "text-amber-300",
      titleClassName: "text-amber-100",
    },

    ELIMINATED: {
      icon: AlertTriangle,
      title: "You have been eliminated",
      description:
        "You are no longer competing in this round.",
      className:
        "border-red-400/30 bg-red-400/10",
      iconClassName: "text-red-300",
      titleClassName: "text-red-100",
    },

    FINALIST: {
      icon: Trophy,
      title: "You are a finalist",
      description:
        "You have reached the final stage of the competition.",
      className:
        "border-violet-400/30 bg-violet-400/10",
      iconClassName: "text-violet-300",
      titleClassName: "text-violet-100",
    },

    WINNER: {
      icon: Trophy,
      title: "You won the competition",
      description:
        "The competition has been completed.",
      className:
        "border-yellow-400/30 bg-yellow-400/10",
      iconClassName: "text-yellow-300",
      titleClassName: "text-yellow-100",
    },

    WAITING: {
      icon: Users,
      title: "Waiting for the next stage",
      description:
        "The host is preparing the next stage of the competition.",
      className:
        "border-white/10 bg-white/[0.03]",
      iconClassName: "text-slate-300",
      titleClassName: "text-slate-100",
    },
  }[status];

  const Icon = config.icon;

  return (
    <section
      className={[
        "rounded-2xl border",
        compact ? "p-3.5" : "p-4 sm:p-5",
        config.className,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-xl bg-white/[0.04] p-2">
          <Icon
            className={[
              "h-5 w-5",
              config.iconClassName,
            ].join(" ")}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={[
              "text-sm font-semibold",
              config.titleClassName,
            ].join(" ")}
          >
            {config.title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
            {message || config.description}
          </p>

          {(currentRound !== null ||
            rank !== null ||
            score !== null) && (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {currentRound !== null && (
                <div className="rounded-xl border border-white/10 bg-black/10 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Round
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {currentRound}
                    {totalRounds !== null &&
                      ` / ${totalRounds}`}
                  </p>
                </div>
              )}

              {rank !== null && (
                <div className="rounded-xl border border-white/10 bg-black/10 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Rank
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    #{rank}
                  </p>
                </div>
              )}

              {score !== null && (
                <div className="rounded-xl border border-white/10 bg-black/10 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Score
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {score}
                  </p>
                </div>
              )}

              {activeParticipantCount !== null && (
                <div className="rounded-xl border border-white/10 bg-black/10 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Active
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {activeParticipantCount}
                    {targetParticipantCount !== null &&
                      ` / ${targetParticipantCount}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}