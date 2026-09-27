






"use client";

import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  FileQuestion,
  Lock,
  Play,
  Search,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";

export interface HostQuestionListItem {
  id: string;

  questionNumber: number;

  question: string;

  options?: Array<{
    label?: string;
    value?: string;
  }>;

  timeLimit?: number | null;

  status?:
    | "READY"
    | "CURRENT"
    | "LIVE"
    | "LOCKED"
    | "COMPLETED";

  answeredCount?: number;
  correctCount?: number;
}

export interface HostQuestionListProps {
  questions: HostQuestionListItem[];

  selectedQuestionNumber?: number | null;
  currentQuestionNumber?: number | null;

  totalQuestions?: number | null;

  loading?: boolean;

  title?: string;

  searchable?: boolean;

  onSelectQuestion: (
    question: HostQuestionListItem,
  ) => void;

  disabled?: boolean;
}

function getStatus(
  question: HostQuestionListItem,
  currentQuestionNumber:
    | number
    | null
    | undefined,
): NonNullable<
  HostQuestionListItem["status"]
> {
  if (
    question.status === "COMPLETED" ||
    question.status === "LOCKED" ||
    question.status === "LIVE"
  ) {
    return question.status;
  }

  if (
    currentQuestionNumber !== null &&
    currentQuestionNumber !== undefined &&
    question.questionNumber ===
      currentQuestionNumber
  ) {
    return "CURRENT";
  }

  return question.status ?? "READY";
}

function getQuestionPreview(
  question: string,
): string {
  const normalized =
    question
      ?.replace(/\s+/g, " ")
      .trim() || "Question";

  if (normalized.length <= 72) {
    return normalized;
  }

  return `${normalized.slice(0, 69)}...`;
}

function getStatusLabel(
  status: HostQuestionListItem["status"],
): string {
  switch (status) {
    case "LIVE":
      return "Live";

    case "LOCKED":
      return "Locked";

    case "COMPLETED":
      return "Done";

    case "CURRENT":
      return "Current";

    default:
      return "Ready";
  }
}

function getStatusIcon(
  status: HostQuestionListItem["status"],
) {
  switch (status) {
    case "LIVE":
      return (
        <Play
          className="h-3.5 w-3.5"
          fill="currentColor"
          aria-hidden="true"
        />
      );

    case "LOCKED":
      return (
        <Lock
          className="h-3.5 w-3.5"
          aria-hidden="true"
        />
      );

    case "COMPLETED":
      return (
        <CheckCircle2
          className="h-3.5 w-3.5"
          aria-hidden="true"
        />
      );

    case "CURRENT":
      return (
        <Circle
          className="h-3.5 w-3.5"
          fill="currentColor"
          aria-hidden="true"
        />
      );

    default:
      return (
        <Circle
          className="h-3.5 w-3.5"
          aria-hidden="true"
        />
      );
  }
}

export default function HostQuestionList({
  questions,
  selectedQuestionNumber = null,
  currentQuestionNumber = null,
  totalQuestions = null,
  loading = false,
  title = "Questions",
  searchable = true,
  onSelectQuestion,
  disabled = false,
}: HostQuestionListProps) {
  const [search, setSearch] =
    useState("");

  const filteredQuestions =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      if (!normalizedSearch) {
        return questions;
      }

      return questions.filter(
        (question) => {
          const numberText =
            String(
              question.questionNumber,
            );

          const questionText =
            question.question
              ?.toLowerCase() ?? "";

          return (
            numberText.includes(
              normalizedSearch,
            ) ||
            questionText.includes(
              normalizedSearch,
            )
          );
        },
      );
    }, [questions, search]);

  const liveQuestion =
    currentQuestionNumber !== null &&
    currentQuestionNumber !== undefined
      ? questions.find(
          (question) =>
            question.questionNumber ===
            currentQuestionNumber,
        )
      : null;

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 shadow-xl shadow-black/10">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <FileQuestion
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-white">
                {title}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {totalQuestions ??
                  questions.length}{" "}
                questions
              </p>
            </div>
          </div>

          {liveQuestion && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Q
                {
                  liveQuestion.questionNumber
                }{" "}
                Live
              </span>
            </div>
          )}
        </div>

        {/* Search */}
        {searchable && (
          <div className="relative mt-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600"
              aria-hidden="true"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search questions..."
              className={[
                "h-10 w-full rounded-xl border",
                "border-white/10 bg-black/20",
                "pl-9 pr-3 text-sm text-white",
                "outline-none placeholder:text-slate-600",
                "focus:border-cyan-400/30",
                "focus:ring-2 focus:ring-cyan-400/10",
              ].join(" ")}
            />
          </div>
        )}
      </div>

      {/* Question list */}
      <div className="max-h-[620px] overflow-y-auto p-3">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[76px] animate-pulse rounded-xl bg-white/[0.04]"
                />
              ),
            )}
          </div>
        ) : filteredQuestions.length ===
          0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-center">
            <FileQuestion
              className="mx-auto h-7 w-7 text-slate-600"
              aria-hidden="true"
            />

            <p className="mt-3 text-sm font-medium text-slate-400">
              {search
                ? "No matching questions."
                : "No questions loaded."}
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {search
                ? "Try another search term."
                : "Load the round questions before starting the competition."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredQuestions.map(
              (question) => {
                const status =
                  getStatus(
                    question,
                    currentQuestionNumber,
                  );

                const selected =
                  question.questionNumber ===
                  selectedQuestionNumber;

                const isDisabled =
                  disabled ||
                  status ===
                    "COMPLETED";

                return (
                  <button
                    key={question.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() =>
                      onSelectQuestion(
                        question,
                      )
                    }
                    className={[
                      "group w-full rounded-xl border text-left transition",
                      "focus:outline-none focus:ring-2 focus:ring-cyan-400/20",
                      selected
                        ? "border-cyan-400/25 bg-cyan-400/[0.07]"
                        : status === "LIVE"
                          ? "border-emerald-400/20 bg-emerald-400/[0.05]"
                          : status ===
                              "LOCKED"
                            ? "border-amber-400/15 bg-amber-400/[0.03]"
                            : "border-white/5 bg-white/[0.02]",
                      isDisabled
                        ? "cursor-not-allowed opacity-55"
                        : "cursor-pointer hover:border-white/15 hover:bg-white/[0.04]",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3 px-3.5 py-3">
                      {/* Number */}
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black",
                          selected
                            ? "bg-cyan-400/15 text-cyan-300"
                            : status ===
                                "LIVE"
                              ? "bg-emerald-400/10 text-emerald-300"
                              : status ===
                                  "LOCKED"
                                ? "bg-amber-400/10 text-amber-300"
                                : "bg-white/[0.04] text-slate-400",
                        ].join(" ")}
                      >
                        {question.questionNumber}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={[
                              "flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider",
                              status === "LIVE"
                                ? "text-emerald-400"
                                : status ===
                                    "LOCKED"
                                  ? "text-amber-400"
                                  : status ===
                                      "COMPLETED"
                                    ? "text-slate-500"
                                    : selected
                                      ? "text-cyan-400"
                                      : "text-slate-600",
                            ].join(" ")}
                          >
                            {getStatusIcon(
                              status,
                            )}

                            {getStatusLabel(
                              status,
                            )}
                          </span>

                          {question.timeLimit &&
                            question.timeLimit >
                              0 && (
                              <span className="flex items-center gap-1 text-[9px] text-slate-600">
                                <Clock3
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                                {
                                  question.timeLimit
                                }
                                s
                              </span>
                            )}
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-slate-300">
                          {getQuestionPreview(
                            question.question,
                          )}
                        </p>

                        {(question.answeredCount !==
                          undefined ||
                          question.correctCount !==
                            undefined) && (
                          <div className="mt-1.5 flex items-center gap-2 text-[9px] text-slate-600">
                            {question.answeredCount !==
                              undefined && (
                              <span>
                                {
                                  question.answeredCount
                                }{" "}
                                answered
                              </span>
                            )}

                            {question.correctCount !==
                              undefined && (
                              <>
                                {question.answeredCount !==
                                  undefined && (
                                  <span>
                                    •
                                  </span>
                                )}

                                <span>
                                  {
                                    question.correctCount
                                  }{" "}
                                  correct
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        className={[
                          "h-4 w-4 shrink-0 transition",
                          selected
                            ? "text-cyan-400"
                            : "text-slate-700 group-hover:text-slate-400",
                        ].join(" ")}
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                );
              },
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 bg-white/[0.015] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-600">
              Showing
            </span>

            <span className="text-[10px] font-bold text-slate-400">
              {filteredQuestions.length}
            </span>

            <span className="text-[10px] text-slate-700">
              /
            </span>

            <span className="text-[10px] font-semibold text-slate-600">
              {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <CheckCircle2
              className="h-3 w-3"
              aria-hidden="true"
            />

            <span>
              Click a question to preview
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}