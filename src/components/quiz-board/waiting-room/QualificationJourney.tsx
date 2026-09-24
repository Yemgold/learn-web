






"use client";

import {
  Check,
  Circle,
  Lock,
  Trophy,
  Users,
} from "lucide-react";

interface QualificationJourneyProps {
  currentRound?: number;
  totalRounds?: number;
  contestantCount?: number;
  maxContestants?: number;
  eliminatedInRound?: number | null;
  completed?: boolean;
}

interface JourneyStep {
  round: number;
  title: string;
  description: string;
}

const DEFAULT_STEPS: JourneyStep[] = [
  {
    round: 1,
    title: "Round 1",
    description: "Contestants compete in the opening round.",
  },
  {
    round: 2,
    title: "Round 2",
    description: "Qualified contestants continue.",
  },
  {
    round: 3,
    title: "Round 3",
    description: "The competition becomes more selective.",
  },
  {
    round: 4,
    title: "Round 4",
    description: "Only the strongest contestants remain.",
  },
  {
    round: 5,
    title: "Final",
    description: "The remaining contestants compete for the top positions.",
  },
];

export default function QualificationJourney({
  currentRound = 0,
  totalRounds = 0,
  contestantCount = 0,
  maxContestants = 0,
  eliminatedInRound = null,
  completed = false,
}: QualificationJourneyProps) {
  const rounds = Math.max(
    1,
    totalRounds || DEFAULT_STEPS.length,
  );

  const steps = buildJourneySteps(rounds);

  const isEliminated =
    eliminatedInRound !== null &&
    eliminatedInRound !== undefined &&
    eliminatedInRound > 0;

  const normalizedCurrentRound = Math.max(
    0,
    currentRound,
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-xl shadow-black/10 backdrop-blur-xl">
      <div className="border-b border-white/8 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300 ring-1 ring-violet-400/20">
            <Trophy className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold text-white">
              Qualification Journey
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-400">
              Track your progress through each stage of
              the competition.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <SummaryPill
            icon={
              <Users className="h-3.5 w-3.5" />
            }
            label="Contestants"
            value={
              maxContestants > 0
                ? `${contestantCount}/${maxContestants}`
                : String(contestantCount)
            }
          />

          <SummaryPill
            label="Current Round"
            value={
              normalizedCurrentRound > 0
                ? `${normalizedCurrentRound}/${rounds}`
                : "Not started"
            }
          />
        </div>
      </div>

      <div className="px-5 py-6 sm:px-6">
        {isEliminated ? (
          <div className="mb-6 rounded-xl border border-red-400/15 bg-red-400/[0.05] p-4">
            <p className="text-sm font-semibold text-red-300">
              Competition journey ended
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Your participation ended in Round{" "}
              {eliminatedInRound}. The remaining stages
              are shown below for context.
            </p>
          </div>
        ) : completed ? (
          <div className="mb-6 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
            <p className="text-sm font-semibold text-emerald-300">
              Competition completed
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              You have reached the end of the
              competition journey.
            </p>
          </div>
        ) : null}

        <div className="relative">
          {/* Vertical progress line */}
          <div className="absolute bottom-5 left-[19px] top-5 w-px bg-white/10" />

          <div className="relative space-y-1">
            {steps.map((step) => {
              const status = getStepStatus({
                round: step.round,
                currentRound:
                  normalizedCurrentRound,
                totalRounds: rounds,
                eliminatedInRound,
                completed,
              });

              return (
                <JourneyStep
                  key={step.round}
                  step={step}
                  status={status}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function buildJourneySteps(
  totalRounds: number,
): JourneyStep[] {
  if (totalRounds <= DEFAULT_STEPS.length) {
    return DEFAULT_STEPS.slice(0, totalRounds);
  }

  return Array.from(
    { length: totalRounds },
    (_, index) => {
      const round = index + 1;
      const isFinal =
        round === totalRounds;

      return {
        round,
        title: isFinal
          ? "Final"
          : `Round ${round}`,
        description: isFinal
          ? "The remaining contestants compete for the top positions."
          : round === 1
            ? "Contestants compete in the opening round."
            : "Qualified contestants continue to the next stage.",
      };
    },
  );
}

type StepStatus =
  | "completed"
  | "current"
  | "upcoming"
  | "eliminated";

function getStepStatus({
  round,
  currentRound,
  totalRounds,
  eliminatedInRound,
  completed,
}: {
  round: number;
  currentRound: number;
  totalRounds: number;
  eliminatedInRound?: number | null;
  completed: boolean;
}): StepStatus {
  if (
    eliminatedInRound !== null &&
    eliminatedInRound !== undefined &&
    eliminatedInRound > 0
  ) {
    if (round < eliminatedInRound) {
      return "completed";
    }

    if (round === eliminatedInRound) {
      return "eliminated";
    }

    return "upcoming";
  }

  if (completed) {
    return "completed";
  }

  if (currentRound <= 0) {
    return "upcoming";
  }

  if (round < currentRound) {
    return "completed";
  }

  if (round === currentRound) {
    return "current";
  }

  if (
    currentRound >= totalRounds &&
    round === totalRounds
  ) {
    return "current";
  }

  return "upcoming";
}

function JourneyStep({
  step,
  status,
}: {
  step: JourneyStep;
  status: StepStatus;
}) {
  const isFinal =
    step.round === 5 ||
    step.title.toLowerCase() === "final";

  return (
    <div className="relative flex gap-4 py-3">
      <StepIndicator
        status={status}
        isFinal={isFinal}
      />

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={[
              "text-sm font-semibold",
              status === "current"
                ? "text-emerald-300"
                : status === "completed"
                  ? "text-white"
                  : status === "eliminated"
                    ? "text-red-300"
                    : "text-slate-500",
            ].join(" ")}
          >
            {step.title}
          </h3>

          <StatusBadge status={status} />
        </div>

        <p
          className={[
            "mt-1 text-xs leading-5",
            status === "upcoming"
              ? "text-slate-600"
              : "text-slate-400",
          ].join(" ")}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

function StepIndicator({
  status,
  isFinal,
}: {
  status: StepStatus;
  isFinal: boolean;
}) {
  const base =
    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border";

  if (status === "completed") {
    return (
      <div
        className={`${base} border-emerald-400/30 bg-emerald-400/10 text-emerald-400`}
      >
        <Check className="h-4 w-4" />
      </div>
    );
  }

  if (status === "current") {
    return (
      <div
        className={`${base} border-emerald-400/40 bg-emerald-400/10 text-emerald-300`}
      >
        <span className="absolute h-10 w-10 animate-ping rounded-full bg-emerald-400/10" />

        {isFinal ? (
          <Trophy className="relative h-4 w-4" />
        ) : (
          <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400" />
        )}
      </div>
    );
  }

  if (status === "eliminated") {
    return (
      <div
        className={`${base} border-red-400/30 bg-red-400/10 text-red-400`}
      >
        <span className="text-sm font-bold">
          ×
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${base} border-white/10 bg-slate-900 text-slate-600`}
    >
      {isFinal ? (
        <Lock className="h-4 w-4" />
      ) : (
        <Circle className="h-3.5 w-3.5" />
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: StepStatus;
}) {
  const config: Record<
    StepStatus,
    {
      label: string;
      className: string;
    }
  > = {
    completed: {
      label: "Completed",
      className:
        "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-400",
    },
    current: {
      label: "Current",
      className:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    },
    upcoming: {
      label: "Upcoming",
      className:
        "border-white/8 bg-white/[0.03] text-slate-600",
    },
    eliminated: {
      label: "Eliminated",
      className:
        "border-red-400/15 bg-red-400/[0.06] text-red-400",
    },
  };

  const item = config[status];

  return (
    <span
      className={[
        "rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
        item.className,
      ].join(" ")}
    >
      {item.label}
    </span>
  );
}

function SummaryPill({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
      {icon && (
        <span className="text-violet-300">
          {icon}
        </span>
      )}

      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <span className="text-xs font-semibold text-white">
        {value}
      </span>
    </div>
  );
}