





"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

/* ==========================================================================
   TYPES
   ========================================================================== */

export interface TopicItem {
  name: string;
}

interface TopicSelectorProps {
  selectedSubject: string | null;
  topics: TopicItem[];
  selectedTopic: string | null;
  onTopicSelect: (topic: string) => void;
}

/* ==========================================================================
   CONSTANTS
   ========================================================================== */

const MOBILE_TOPICS_PER_PAGE = 5;

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export default function TopicSelector({
  selectedSubject,
  topics,
  selectedTopic,
  onTopicSelect,
}: TopicSelectorProps) {
  /* ------------------------------------------------------------------------
     MOBILE PAGINATION
     ------------------------------------------------------------------------ */

  const [mobilePage, setMobilePage] = useState(0);

  /* ------------------------------------------------------------------------
     RESET PAGINATION WHEN SUBJECT CHANGES
     ------------------------------------------------------------------------ */

  useEffect(() => {
    setMobilePage(0);
  }, [selectedSubject]);

  /* ------------------------------------------------------------------------
     PAGINATION CALCULATIONS
     ------------------------------------------------------------------------ */

  const totalMobilePages = Math.max(
    1,
    Math.ceil(
      topics.length / MOBILE_TOPICS_PER_PAGE
    )
  );

  /*
   * Protect against the selected page becoming invalid
   * if the number of topics changes.
   */
  useEffect(() => {
    if (mobilePage >= totalMobilePages) {
      setMobilePage(
        Math.max(0, totalMobilePages - 1)
      );
    }
  }, [mobilePage, totalMobilePages]);

  /* ------------------------------------------------------------------------
     CURRENT MOBILE TOPICS
     ------------------------------------------------------------------------ */

  const mobileTopics = useMemo(() => {
    const start =
      mobilePage * MOBILE_TOPICS_PER_PAGE;

    const end =
      start + MOBILE_TOPICS_PER_PAGE;

    return topics.slice(start, end);
  }, [topics, mobilePage]);

  /* ------------------------------------------------------------------------
     MOBILE RANGE
     ------------------------------------------------------------------------ */

  const mobileStart =
    topics.length === 0
      ? 0
      : mobilePage * MOBILE_TOPICS_PER_PAGE + 1;

  const mobileEnd =
    topics.length === 0
      ? 0
      : Math.min(
          (mobilePage + 1) *
            MOBILE_TOPICS_PER_PAGE,
          topics.length
        );

  const hasPreviousPage = mobilePage > 0;

  const hasNextPage =
    mobilePage < totalMobilePages - 1;

  /* ------------------------------------------------------------------------
     PAGE NAVIGATION
     ------------------------------------------------------------------------ */

  const handleNextPage = () => {
    if (!hasNextPage) {
      return;
    }

    setMobilePage(
      (previousPage) => previousPage + 1
    );
  };

  const handlePreviousPage = () => {
    if (!hasPreviousPage) {
      return;
    }

    setMobilePage(
      (previousPage) =>
        Math.max(0, previousPage - 1)
    );
  };

  /* ------------------------------------------------------------------------
     NO SUBJECT
     ------------------------------------------------------------------------ */

  if (!selectedSubject) {
    return (
      <div className="border-b border-white/10 p-5 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <StepNumber number="02" />

          <div>
            <h2 className="text-lg font-black text-white sm:text-xl">
              Select Topic
            </h2>

            <p className="text-xs text-slate-500 sm:text-sm">
              Select a subject first
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <div className="text-3xl">
            📚
          </div>

          <p className="mt-3 text-sm font-medium text-slate-500">
            Select a subject to see available topics.
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     NO TOPICS
     ------------------------------------------------------------------------ */

  if (!topics.length) {
    return (
      <div className="border-b border-white/10 p-5 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <StepNumber number="02" />

          <div>
            <h2 className="text-lg font-black text-white sm:text-xl">
              Select Topic
            </h2>

            <p className="text-xs text-slate-500 sm:text-sm">
              Choose a {selectedSubject} topic
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <div className="text-3xl">
            📚
          </div>

          <p className="mt-3 text-sm font-medium text-slate-500">
            No topics are currently available
            for this subject.
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
     MAIN
     ------------------------------------------------------------------------ */

  return (
    <div className="border-b border-white/10 p-5 sm:p-8">
      {/* ==================================================================
          HEADER
          ================================================================== */}

      <div className="mb-5 flex items-center gap-3">
        <StepNumber number="02" />

        <div>
          <h2 className="text-lg font-black text-white sm:text-xl">
            Select Topic
          </h2>

          <p className="text-xs text-slate-500 sm:text-sm">
            Choose a {selectedSubject} topic
          </p>
        </div>
      </div>

      {/* ==================================================================
          DESKTOP
          ================================================================== */}

      <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {topics.map((topic, index) => {
          const isSelected =
            selectedTopic === topic.name;

          return (
            <TopicCard
              key={`${topic.name}-${index}`}
              topic={topic}
              index={index}
              isSelected={isSelected}
              onSelect={() =>
                onTopicSelect(topic.name)
              }
            />
          );
        })}
      </div>

      {/* ==================================================================
          MOBILE
          ================================================================== */}

      <div className="sm:hidden">
        {/* --------------------------------------------------------------
            Topic range
            -------------------------------------------------------------- */}

        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Topics {mobileStart}–{mobileEnd}
          </p>

          <p className="text-[11px] font-semibold text-slate-600">
            {mobilePage + 1} / {totalMobilePages}
          </p>
        </div>

        {/* --------------------------------------------------------------
            Topic list
            -------------------------------------------------------------- */}

        <div className="relative">
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            <motion.div
              key={mobilePage}
              initial={{
                opacity: 0,
                x: 18,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -18,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="space-y-2"
            >
              {mobileTopics.map(
                (topic, localIndex) => {
                  const globalIndex =
                    mobilePage *
                      MOBILE_TOPICS_PER_PAGE +
                    localIndex;

                  const isSelected =
                    selectedTopic ===
                    topic.name;

                  return (
                    <MobileTopicCard
                      key={`${topic.name}-${globalIndex}`}
                      topic={topic}
                      index={globalIndex}
                      isSelected={
                        isSelected
                      }
                      onSelect={() =>
                        onTopicSelect(
                          topic.name
                        )
                      }
                    />
                  );
                }
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --------------------------------------------------------------
            Navigation
            -------------------------------------------------------------- */}

        {totalMobilePages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-3">
            {/* Previous */}

            <button
              type="button"
              onClick={
                handlePreviousPage
              }
              disabled={!hasPreviousPage}
              className={[
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition",
                hasPreviousPage
                  ? "text-slate-300 hover:bg-white/5 hover:text-white"
                  : "cursor-not-allowed text-slate-700",
              ].join(" ")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Previous
            </button>

            {/* Page dots */}

            <div className="flex items-center gap-1.5">
              {Array.from({
                length: totalMobilePages,
              }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to topic page ${
                    index + 1
                  }`}
                  onClick={() =>
                    setMobilePage(index)
                  }
                  className={[
                    "h-1.5 rounded-full transition-all duration-200",
                    mobilePage === index
                      ? "w-5 bg-purple-400"
                      : "w-1.5 bg-white/15",
                  ].join(" ")}
                />
              ))}
            </div>

            {/* More Topics */}

            <button
              type="button"
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className={[
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition",
                hasNextPage
                  ? "bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
                  : "cursor-not-allowed text-slate-700",
              ].join(" ")}
            >
              {hasNextPage
                ? "More Topics"
                : "All Topics"}
              {hasNextPage && (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   DESKTOP TOPIC CARD
   ========================================================================== */

interface TopicCardProps {
  topic: TopicItem;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function TopicCard({
  topic,
  index,
  isSelected,
  onSelect,
}: TopicCardProps) {
  return (
    <motion.button
      type="button"
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: Math.min(index * 0.025, 0.3),
      }}
      onClick={onSelect}
      className={[
        "group rounded-2xl border p-4 text-left transition-all duration-200",
        isSelected
          ? "border-purple-400/50 bg-purple-500/10 text-purple-300 shadow-lg shadow-purple-500/5"
          : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20 hover:bg-white/[0.05]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* Topic number */}

          <span
            className={[
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black",
              isSelected
                ? "bg-purple-500 text-white"
                : "bg-white/5 text-slate-500",
            ].join(" ")}
          >
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </span>

          <span className="text-sm font-semibold leading-5">
            {topic.name}
          </span>
        </div>

        {isSelected && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white">
            <Check className="h-3 w-3" />
          </span>
        )}
      </div>
    </motion.button>
  );
}

/* ==========================================================================
   MOBILE TOPIC CARD
   ========================================================================== */

function MobileTopicCard({
  topic,
  index,
  isSelected,
  onSelect,
}: TopicCardProps) {
  return (
    <motion.button
      type="button"
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index % MOBILE_TOPICS_PER_PAGE * 0.035,
        duration: 0.2,
      }}
      whileTap={{
        scale: 0.985,
      }}
      onClick={onSelect}
      className={[
        "flex min-h-[54px] w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
        isSelected
          ? "border-purple-400/50 bg-purple-500/10 shadow-lg shadow-purple-500/5"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Number */}

        <span
          className={[
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black",
            isSelected
              ? "bg-purple-500 text-white"
              : "bg-white/5 text-slate-500",
          ].join(" ")}
        >
          {String(index + 1).padStart(
            2,
            "0"
          )}
        </span>

        {/* Name */}

        <span
          className={[
            "truncate text-sm font-semibold",
            isSelected
              ? "text-purple-200"
              : "text-slate-300",
          ].join(" ")}
        >
          {topic.name}
        </span>
      </div>

      {/* Selection */}

      {isSelected ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500 text-white">
          <Check className="h-3 w-3" />
        </span>
      ) : (
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-700 transition group-hover:text-slate-400" />
      )}
    </motion.button>
  );
}

/* ==========================================================================
   STEP NUMBER
   ========================================================================== */

function StepNumber({
  number,
}: {
  number: string;
}) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-xs font-black text-purple-300">
      {number}
    </div>
  );
}