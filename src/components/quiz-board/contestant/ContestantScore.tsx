


"use client";

import {
  Award,
  CheckCircle2,
  Hash,
  Target,
  Trophy,
  Users,
} from "lucide-react";

export interface ContestantScoreProps {
  score: number;

  rank?: number | null;

  correctAnswers?: number;
  answeredQuestions?: number;

  totalQuestions?: number | null;

  totalParticipants?: number | null;

  title?: string;

  showRank?: boolean;
  showAccuracy?: boolean;
  showProgress?: boolean;
  showParticipants?: boolean;

  compact?: boolean;
}

export default function ContestantScore({
  score,
  rank = null,

  correctAnswers = 0,
  answeredQuestions = 0,

  totalQuestions = null,

  totalParticipants = null,

  title = "Your Score",

  showRank = true,
  showAccuracy = true,
  showProgress = true,
  showParticipants = true,

  compact = false,
}: ContestantScoreProps) {
  const accuracy =
    answeredQuestions > 0
      ? Math.round(
          (correctAnswers / answeredQuestions) * 100,
        )
      : 0;

  const progress =
    totalQuestions !== null &&
    totalQuestions > 0
      ? Math.min(
          100,
          Math.round(
            (answeredQuestions / totalQuestions) * 100,
          ),
        )
      : null;

  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-slate-950/70",
        "shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5 sm:p-6",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-cyan-400/10 p-2">
            <Trophy className="h-4 w-4 text-cyan-300" />
          </div>

          <h2 className="text-sm font-semibold text-white">
            {title}
          </h2>
        </div>

        <Award className="h-4 w-4 text-slate-600" />
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Current points
        </p>

        <p className="mt-1 text-3xl font-black tracking-tight text-white">
          {score.toLocaleString()}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Competition points
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {showRank && (
          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Hash className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider">
                Rank
              </span>
            </div>

            <p className="mt-1 text-lg font-bold text-white">
              {rank !== null ? `#${rank}` : "—"}
            </p>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
          <div className="flex items-center gap-1.5 text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-wider">
              Correct
            </span>
          </div>

          <p className="mt-1 text-lg font-bold text-white">
            {correctAnswers}
          </p>
        </div>

        {showAccuracy && (
          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Target className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider">
                Accuracy
              </span>
            </div>

            <p className="mt-1 text-lg font-bold text-white">
              {accuracy}%
            </p>
          </div>
        )}

        {showParticipants &&
          totalParticipants !== null && (
            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Users className="h-3.5 w-3.5" />
                <span className="text-[10px] uppercase tracking-wider">
                  Players
                </span>
              </div>

              <p className="mt-1 text-lg font-bold text-white">
                {totalParticipants}
              </p>
            </div>
          )}
      </div>

      {showProgress &&
        progress !== null && (
          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Questions answered
              </span>

              <span className="text-xs font-semibold text-slate-300">
                {answeredQuestions} / {totalQuestions}
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}
    </section>
  );
}