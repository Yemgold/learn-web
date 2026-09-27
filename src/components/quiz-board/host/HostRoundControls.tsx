



"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Flag,
  Loader2,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

export type HostRoundStatus =
  | "WAITING"
  | "READY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ELIMINATION"
  | "FINAL"
  | "CANCELLED";

export interface HostRoundControlsProps {
  currentRound: number;

  totalRounds: number;

  status?: HostRoundStatus;

  /**
   * Number of questions in this round.
   */
  totalQuestions?: number | null;

  /**
   * Current question number.
   */
  currentQuestionNumber?: number | null;

  /**
   * Number of participants at the beginning of the round.
   */
  startingParticipantCount?: number | null;

  /**
   * Current active participants.
   */
  activeParticipantCount?: number | null;

  /**
   * Number of participants expected to remain after elimination.
   */
  targetParticipantCount?: number | null;

  /**
   * True while a question is currently active.
   */
  questionStarted?: boolean;

  /**
   * True when current question is locked.
   */
  questionLocked?: boolean;

  /**
   * Whether the host is allowed to start the round.
   */
  canStartRound?: boolean;

  /**
   * Whether the host is allowed to complete the round.
   */
  canCompleteRound?: boolean;

  /**
   * Whether the host can move to the next round.
   */
  canNextRound?: boolean;

  /**
   * Whether the host can restart/reopen the current round.
   */
  canRestartRound?: boolean;

  /**
   * Processing state.
   */
  loading?: boolean;

  /**
   * Optional action callbacks.
   *
   * The actual Socket.IO calls should live outside this component.
   */
  onStartRound: () => void;

  onCompleteRound: () => void;

  onNextRound: () => void;

  onRestartRound?: () => void;

  /**
   * Prevents all controls.
   */
  disabled?: boolean;

  /**
   * Compact layout.
   */
  compact?: boolean;
}

function getStatusLabel(status: HostRoundStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return "IN PROGRESS";

    case "ELIMINATION":
      return "ELIMINATION";

    case "FINAL":
      return "FINAL";

    case "COMPLETED":
      return "COMPLETED";

    case "CANCELLED":
      return "CANCELLED";

    case "READY":
      return "READY";

    default:
      return "WAITING";
  }
}

function getStatusClasses(status: HostRoundStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    case "ELIMINATION":
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";

    case "FINAL":
      return "border-violet-400/20 bg-violet-400/10 text-violet-300";

    case "COMPLETED":
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";

    case "CANCELLED":
      return "border-red-400/20 bg-red-400/10 text-red-300";

    default:
      return "border-slate-600 bg-slate-800 text-slate-300";
  }
}

export default function HostRoundControls({
  currentRound,
  totalRounds,

  status = "WAITING",

  totalQuestions = null,
  currentQuestionNumber = null,

  startingParticipantCount = null,
  activeParticipantCount = null,
  targetParticipantCount = null,

  questionStarted = false,
  questionLocked = false,

  canStartRound = true,
  canCompleteRound = false,
  canNextRound = false,
  canRestartRound = false,

  loading = false,

  onStartRound,
  onCompleteRound,
  onNextRound,
  onRestartRound,

  disabled = false,

  compact = false,
}: HostRoundControlsProps) {
  const isFirstRound = currentRound <= 1;
  const isLastRound = currentRound >= totalRounds;

  const effectiveStartDisabled =
    disabled ||
    loading ||
    !canStartRound ||
    status === "IN_PROGRESS" ||
    status === "COMPLETED" ||
    status === "CANCELLED";

  const effectiveCompleteDisabled =
    disabled ||
    loading ||
    !canCompleteRound ||
    status !== "IN_PROGRESS" ||
    questionStarted;

  const effectiveNextDisabled =
    disabled ||
    loading ||
    !canNextRound ||
    status !== "COMPLETED" ||
    isLastRound;

  const effectiveRestartDisabled =
    disabled ||
    loading ||
    !canRestartRound ||
    status === "IN_PROGRESS";

  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-slate-950/70 shadow-xl shadow-black/10",
        compact ? "p-4" : "p-5",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
            <Flag className="h-5 w-5 text-violet-300" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-white">
                Round Controls
              </h2>

              <span
                className={[
                  "rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                  getStatusClasses(status),
                ].join(" ")}
              >
                {getStatusLabel(status)}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Round {currentRound} of {totalRounds}
            </p>
          </div>
        </div>

        {isLastRound && (
          <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-300">
            Final Round
          </div>
        )}
      </div>

      {/* Round stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Questions
          </p>

          <p className="mt-1 text-lg font-bold text-white">
            {currentQuestionNumber ?? "—"}
            {totalQuestions ? ` / ${totalQuestions}` : ""}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Started With
          </p>

          <p className="mt-1 text-lg font-bold text-white">
            {startingParticipantCount ?? "—"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Active
          </p>

          <p className="mt-1 text-lg font-bold text-emerald-300">
            {activeParticipantCount ?? "—"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Target
          </p>

          <p className="mt-1 text-lg font-bold text-amber-300">
            {targetParticipantCount ?? "—"}
          </p>
        </div>
      </div>

      {/* Question warning */}
      {questionStarted && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />

          <div>
            <p className="text-xs font-semibold text-amber-200">
              Question currently active
            </p>

            <p className="mt-1 text-[11px] leading-5 text-amber-200/60">
              Complete or lock the current question before ending
              the round.
            </p>
          </div>
        </div>
      )}

      {/* Elimination target */}
      {targetParticipantCount !== null &&
        targetParticipantCount !== undefined &&
        activeParticipantCount !== null &&
        activeParticipantCount !== undefined && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Round progression
              </span>

              <span className="text-xs font-semibold text-white">
                {activeParticipantCount} →{" "}
                {targetParticipantCount}
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-violet-400/70 transition-all"
                style={{
                  width:
                    activeParticipantCount > 0
                      ? `${Math.min(
                          100,
                          (Math.min(
                            activeParticipantCount,
                            targetParticipantCount,
                          ) /
                            activeParticipantCount) *
                            100,
                        )}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        )}

      {/* Controls */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {/* Start */}
        <button
          type="button"
          onClick={onStartRound}
          disabled={effectiveStartDisabled}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300/40 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}

          Start Round
        </button>

        {/* Complete */}
        <button
          type="button"
          onClick={onCompleteRound}
          disabled={effectiveCompleteDisabled}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:border-amber-300/40 hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCircle2 className="h-4 w-4" />

          Complete Round
        </button>

        {/* Next */}
        {!isLastRound && (
          <button
            type="button"
            onClick={onNextRound}
            disabled={effectiveNextDisabled}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next Round
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Restart */}
        {onRestartRound && (
          <button
            type="button"
            onClick={onRestartRound}
            disabled={effectiveRestartDisabled}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" />
            Restart Round
          </button>
        )}
      </div>

      {/* Last round message */}
      {isLastRound && status === "COMPLETED" && (
        <div className="mt-4 rounded-xl border border-violet-400/20 bg-violet-400/[0.05] p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />

            <div>
              <p className="text-sm font-semibold text-violet-200">
                Final round completed
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The competition can now proceed to final scoring
                and result processing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Authority note */}
      <div className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-slate-600">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400/60" />

        <span>
          Round transitions should be validated by the server.
          These controls only request the corresponding host
          action.
        </span>
      </div>
    </section>
  );
}