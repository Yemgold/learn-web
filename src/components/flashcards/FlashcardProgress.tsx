



// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\flashcards\FlashcardProgress.tsx

"use client";

import { useMemo } from "react";
import {
  BookOpen,
  Check,
  Circle,
  Clock3,
  Eye,
  Flame,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";

import type { FlashcardDeckProgress } from "@/types/flashcard";

interface FlashcardProgressProps {
  progress: FlashcardDeckProgress;
  title?: string;
  description?: string;
  showDetails?: boolean;
  showCardBreakdown?: boolean;
  compact?: boolean;
  className?: string;
}

export default function FlashcardProgress({
  progress,
  title = "Your Progress",
  description = "Track how far you have progressed through this flashcard deck.",
  showDetails = true,
  showCardBreakdown = true,
  compact = false,
  className = "",
}: FlashcardProgressProps) {
  const {
    totalCards,
    masteredCards,
    reviewCards,
    remainingCards,
    percentage,
    cards,
  } = progress;

  const safePercentage = Math.min(
    100,
    Math.max(0, Math.round(percentage || 0)),
  );

  const totalViews = useMemo(() => {
    return cards.reduce((total, card) => total + (card.views || 0), 0);
  }, [cards]);

  const totalCorrect = useMemo(() => {
    return cards.reduce(
      (total, card) => total + (card.correctCount || 0),
      0,
    );
  }, [cards]);

  const totalReviews = useMemo(() => {
    return cards.reduce(
      (total, card) => total + (card.reviewCount || 0),
      0,
    );
  }, [cards]);

  const accuracy = useMemo(() => {
    const attempts = totalCorrect + totalReviews;

    if (attempts === 0) {
      return 0;
    }

    return Math.round((totalCorrect / attempts) * 100);
  }, [totalCorrect, totalReviews]);

  const isComplete = totalCards > 0 && masteredCards >= totalCards;

  const progressLabel = isComplete
    ? "Deck Completed"
    : safePercentage === 0
      ? "Not Started"
      : safePercentage < 50
        ? "Getting Started"
        : safePercentage < 80
          ? "Making Progress"
          : "Almost There";

  if (compact) {
    return (
      <div
        className={[
          "rounded-2xl border border-white/10 bg-white/[0.04] p-4",
          className,
        ].join(" ")}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {isComplete ? (
                <Trophy className="h-4 w-4" />
              ) : (
                <BookOpen className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {title}
              </p>

              <p className="text-xs text-white/45">
                {masteredCards} of {totalCards} mastered
              </p>
            </div>
          </div>

          <span className="shrink-0 text-sm font-bold text-primary">
            {safePercentage}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${safePercentage}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-white/45">{progressLabel}</span>

          {remainingCards > 0 && (
            <span className="text-white/60">
              {remainingCards} remaining
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <section
      className={[
        "overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-sm",
        className,
      ].join(" ")}
    >
      {/* =========================================================
          HEADER
          ========================================================= */}
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={[
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                isComplete
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-primary/10 text-primary",
              ].join(" ")}
            >
              {isComplete ? (
                <Trophy className="h-5 w-5" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2 className="text-base font-bold text-white sm:text-lg">
                {title}
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-white/45">
                {description}
              </p>
            </div>
          </div>

          {/* Percentage */}
          <div className="flex items-center gap-2 sm:block sm:text-right">
            <span className="text-3xl font-black tracking-tight text-white">
              {safePercentage}%
            </span>

            <span className="text-xs font-medium uppercase tracking-wider text-white/35 sm:block">
              complete
            </span>
          </div>
        </div>

        {/* =========================================================
            MAIN PROGRESS BAR
            ========================================================= */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-white/55">
              {progressLabel}
            </span>

            <span className="text-white/35">
              {masteredCards}/{totalCards} cards mastered
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className={[
                "relative h-full rounded-full transition-all duration-700 ease-out",
                isComplete ? "bg-emerald-500" : "bg-primary",
              ].join(" ")}
              style={{ width: `${safePercentage}%` }}
            >
              {safePercentage > 0 && safePercentage < 100 && (
                <div className="absolute inset-y-0 right-0 w-12 bg-white/20 blur-sm" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          SUMMARY CARDS
          ========================================================= */}
      {showDetails && (
        <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border-b border-white/10 sm:grid-cols-4 sm:divide-y-0">
          {/* Mastered */}
          <ProgressStat
            icon={<Check className="h-4 w-4" />}
            label="Mastered"
            value={masteredCards}
            iconClassName="bg-emerald-500/10 text-emerald-400"
          />

          {/* Review */}
          <ProgressStat
            icon={<RotateCcw className="h-4 w-4" />}
            label="Review"
            value={reviewCards}
            iconClassName="bg-amber-500/10 text-amber-400"
          />

          {/* Remaining */}
          <ProgressStat
            icon={<Circle className="h-4 w-4" />}
            label="Remaining"
            value={remainingCards}
            iconClassName="bg-blue-500/10 text-blue-400"
          />

          {/* Views */}
          <ProgressStat
            icon={<Eye className="h-4 w-4" />}
            label="Views"
            value={totalViews}
            iconClassName="bg-violet-500/10 text-violet-400"
          />
        </div>
      )}

      {/* =========================================================
          LEARNING STATISTICS
          ========================================================= */}
      {showDetails && (
        <div className="grid grid-cols-1 gap-3 border-b border-white/10 p-5 sm:grid-cols-2 sm:p-6">
          <LearningMetric
            icon={<Flame className="h-4 w-4" />}
            label="Learning accuracy"
            value={`${accuracy}%`}
            description={`${totalCorrect} correct answers`}
          />

          <LearningMetric
            icon={<Clock3 className="h-4 w-4" />}
            label="Review activity"
            value={totalReviews.toString()}
            description="Cards sent back for review"
          />
        </div>
      )}

      {/* =========================================================
          CARD BREAKDOWN
          ========================================================= */}
      {showCardBreakdown && cards.length > 0 && (
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Card Breakdown
              </h3>

              <p className="mt-1 text-xs text-white/40">
                See the learning status of each card.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/50">
              {cards.length} cards
            </span>
          </div>

          <div className="space-y-2">
            {cards.map((card, index) => {
              const status = getCardStatus(card);

              return (
                <div
                  key={card.cardId}
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/10 px-3 py-3 transition-colors hover:border-white/10 hover:bg-white/[0.03]"
                >
                  {/* Number */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-xs font-bold text-white/45">
                    {index + 1}
                  </div>

                  {/* Status */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "h-2 w-2 shrink-0 rounded-full",
                          status.dotClass,
                        ].join(" ")}
                      />

                      <span className="truncate text-xs font-medium text-white/65">
                        {card.cardId}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-[11px] text-white/30">
                      <span>{card.views || 0} views</span>

                      <span>
                        {card.correctCount || 0} correct
                      </span>

                      <span>
                        {card.reviewCount || 0} reviews
                      </span>
                    </div>
                  </div>

                  {/* Status Label */}
                  <span
                    className={[
                      "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                      status.badgeClass,
                    ].join(" ")}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          COMPLETION MESSAGE
          ========================================================= */}
      {isComplete && (
        <div className="border-t border-emerald-500/10 bg-emerald-500/[0.04] px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Trophy className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-emerald-300">
                Deck completed
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-200/50">
                You have marked every card in this deck as mastered.
                Keep reviewing to strengthen your memory.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ================================================================
   PROGRESS STAT
   ================================================================ */

interface ProgressStatProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconClassName: string;
}

function ProgressStat({
  icon,
  label,
  value,
  iconClassName,
}: ProgressStatProps) {
  return (
    <div className="flex items-center gap-3 p-4 sm:p-5">
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          iconClassName,
        ].join(" ")}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-lg font-black text-white">{value}</p>
        <p className="truncate text-[11px] font-medium text-white/35">
          {label}
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   LEARNING METRIC
   ================================================================ */

interface LearningMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

function LearningMetric({
  icon,
  label,
  value,
  description,
}: LearningMetricProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-white/45">
            {icon}

            <span className="text-xs font-medium">
              {label}
            </span>
          </div>

          <p className="mt-2 text-2xl font-black text-white">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-white/30">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   CARD STATUS
   ================================================================ */

function getCardStatus(card: FlashcardDeckProgress["cards"][number]) {
  if (card.mastered) {
    return {
      label: "Mastered",
      dotClass: "bg-emerald-400",
      badgeClass:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    };
  }

  if (card.reviewCount > 0) {
    return {
      label: "Review",
      dotClass: "bg-amber-400",
      badgeClass:
        "border-amber-500/20 bg-amber-500/10 text-amber-400",
    };
  }

  if (card.views > 0) {
    return {
      label: "Learning",
      dotClass: "bg-blue-400",
      badgeClass:
        "border-blue-500/20 bg-blue-500/10 text-blue-400",
    };
  }

  return {
    label: "New",
    dotClass: "bg-white/25",
    badgeClass:
      "border-white/10 bg-white/[0.04] text-white/35",
  };
}