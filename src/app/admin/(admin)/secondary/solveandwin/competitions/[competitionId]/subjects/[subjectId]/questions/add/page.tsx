


// POST /api/v1/solveandwin/competitions/:competitionId/subjects/:subjectId/questions





"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ============================================================
   TYPES
============================================================ */

type QuestionType = "single" | "multiple";

interface Option {
  id: string;
  label: string;
  text: string;
}

interface CompetitionQuestion {
  id: string;
  questionType: QuestionType;
  question: string;
  marks: string;
  difficulty: string;
  explanation: string;
  imageUrl: string;
  options: Option[];
  correctAnswers: string[];
}

/* ============================================================
   API PAYLOAD TYPES
============================================================ */

interface CreateCompetitionQuestionPayload {
  competitionId: string;
  subjectId: string;
  questions: Array<{
    question: string;
    questionType: QuestionType;
    options: Option[];
    correctAnswers: string[];
    isMultipleAnswer: boolean;
    marks: number;
    difficulty: string;
    explanation: string;
    imageUrl?: string;
  }>;
}

/* ============================================================
   HELPERS
============================================================ */

const createOptions = (): Option[] => [
  {
    id: "a",
    label: "A",
    text: "",
  },
  {
    id: "b",
    label: "B",
    text: "",
  },
  {
    id: "c",
    label: "C",
    text: "",
  },
  {
    id: "d",
    label: "D",
    text: "",
  },
];

const createQuestion = (): CompetitionQuestion => ({
  id: `question-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`,
  questionType: "single",
  question: "",
  marks: "1",
  difficulty: "Medium",
  explanation: "",
  imageUrl: "",
  options: createOptions(),
  correctAnswers: [],
});

/* ============================================================
   PAGE
============================================================ */

export default function AddCompetitionQuestionPage() {
  const params = useParams();
  const router = useRouter();

  /* ==========================================================
     ROUTE PARAMS
  ========================================================== */

  const competitionId = params.competitionId as string;
  const subjectId = params.subjectId as string;

  /* ==========================================================
     STATE
  ========================================================== */

  const [questions, setQuestions] = useState<
    CompetitionQuestion[]
  >([createQuestion()]);

  const [expandedQuestionId, setExpandedQuestionId] =
    useState<string | null>(questions[0]?.id ?? null);

  const [isSaving, setIsSaving] = useState(false);

  /* ==========================================================
     QUESTION HANDLERS
  ========================================================== */

  const addQuestion = () => {
    const newQuestion = createQuestion();

    setQuestions((current) => [
      ...current,
      newQuestion,
    ]);

    setExpandedQuestionId(newQuestion.id);
  };

  const duplicateQuestion = (questionId: string) => {
    const sourceQuestion = questions.find(
      (question) => question.id === questionId,
    );

    if (!sourceQuestion) {
      return;
    }

    const duplicatedQuestion: CompetitionQuestion = {
      ...sourceQuestion,

      id: `question-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,

      options: sourceQuestion.options.map(
        (option) => ({
          ...option,
        }),
      ),

      correctAnswers: [
        ...sourceQuestion.correctAnswers,
      ],
    };

    setQuestions((current) => {
      const index = current.findIndex(
        (question) =>
          question.id === questionId,
      );

      const next = [...current];

      next.splice(
        index + 1,
        0,
        duplicatedQuestion,
      );

      return next;
    });

    setExpandedQuestionId(
      duplicatedQuestion.id,
    );
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length === 1) {
      return;
    }

    setQuestions((current) =>
      current.filter(
        (question) =>
          question.id !== questionId,
      ),
    );

    if (
      expandedQuestionId === questionId
    ) {
      const remaining = questions.filter(
        (question) =>
          question.id !== questionId,
      );

      setExpandedQuestionId(
        remaining[0]?.id ?? null,
      );
    }
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestionId(
      (current) =>
        current === questionId
          ? null
          : questionId,
    );
  };

  /* ==========================================================
     UPDATE QUESTION
  ========================================================== */

  const updateQuestion = (
    questionId: string,
    updates: Partial<CompetitionQuestion>,
  ) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              ...updates,
            }
          : question,
      ),
    );
  };

  /* ==========================================================
     OPTION HANDLERS
  ========================================================== */

  const updateOption = (
    questionId: string,
    optionId: string,
    value: string,
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        return {
          ...question,

          options: question.options.map(
            (option) =>
              option.id === optionId
                ? {
                    ...option,
                    text: value,
                  }
                : option,
          ),
        };
      }),
    );
  };

  const addOption = (questionId: string) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const nextIndex =
          question.options.length;

        const label =
          String.fromCharCode(
            65 + nextIndex,
          );

        return {
          ...question,

          options: [
            ...question.options,
            {
              id: label.toLowerCase(),
              label,
              text: "",
            },
          ],
        };
      }),
    );
  };

  const removeOption = (
    questionId: string,
    optionId: string,
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        if (question.options.length <= 2) {
          return question;
        }

        return {
          ...question,

          options:
            question.options.filter(
              (option) =>
                option.id !== optionId,
            ),

          correctAnswers:
            question.correctAnswers.filter(
              (answer) =>
                answer !== optionId,
            ),
        };
      }),
    );
  };

  /* ==========================================================
     CORRECT ANSWER
  ========================================================== */

  const toggleCorrectAnswer = (
    questionId: string,
    optionId: string,
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        /*
         * SINGLE ANSWER
         *
         * Only one correct option is allowed.
         */
        if (
          question.questionType ===
          "single"
        ) {
          return {
            ...question,
            correctAnswers: [
              optionId,
            ],
          };
        }

        /*
         * MULTIPLE ANSWER
         *
         * Add/remove selected options.
         */
        const alreadySelected =
          question.correctAnswers.includes(
            optionId,
          );

        return {
          ...question,

          correctAnswers:
            alreadySelected
              ? question.correctAnswers.filter(
                  (answer) =>
                    answer !== optionId,
                )
              : [
                  ...question.correctAnswers,
                  optionId,
                ],
        };
      }),
    );
  };

  /* ==========================================================
     QUESTION TYPE
  ========================================================== */

  const changeQuestionType = (
    questionId: string,
    type: QuestionType,
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        return {
          ...question,

          questionType: type,

          /*
           * If changing from multiple to single,
           * keep only the first correct answer.
           */
          correctAnswers:
            type === "single"
              ? question.correctAnswers.slice(
                  0,
                  1,
                )
              : question.correctAnswers,
        };
      }),
    );
  };

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateQuestions = () => {
    if (!competitionId) {
      alert(
        "Competition ID is missing from the URL.",
      );

      return false;
    }

    if (!subjectId) {
      alert(
        "Subject ID is missing from the URL.",
      );

      return false;
    }

    if (questions.length === 0) {
      alert(
        "Please add at least one question.",
      );

      return false;
    }

    for (
      let index = 0;
      index < questions.length;
      index++
    ) {
      const question =
        questions[index];

      /* ------------------------------------------------------
         QUESTION TEXT
      ------------------------------------------------------ */

      if (!question.question.trim()) {
        alert(
          `Question ${
            index + 1
          } is missing the question text.`,
        );

        setExpandedQuestionId(
          question.id,
        );

        return false;
      }

      /* ------------------------------------------------------
         CORRECT ANSWER
      ------------------------------------------------------ */

      if (
        question.correctAnswers.length ===
        0
      ) {
        alert(
          `Question ${
            index + 1
          } does not have a correct answer selected.`,
        );

        setExpandedQuestionId(
          question.id,
        );

        return false;
      }

      /* ------------------------------------------------------
         SINGLE ANSWER VALIDATION
      ------------------------------------------------------ */

      if (
        question.questionType ===
          "single" &&
        question.correctAnswers.length >
          1
      ) {
        alert(
          `Question ${
            index + 1
          } can only have one correct answer.`,
        );

        setExpandedQuestionId(
          question.id,
        );

        return false;
      }

      /* ------------------------------------------------------
         OPTIONS
      ------------------------------------------------------ */

      if (question.options.length < 2) {
        alert(
          `Question ${
            index + 1
          } must have at least two options.`,
        );

        setExpandedQuestionId(
          question.id,
        );

        return false;
      }

      const emptyOption =
        question.options.find(
          (option) =>
            !option.text.trim(),
        );

      if (emptyOption) {
        alert(
          `Question ${
            index + 1
          } has an empty option (${emptyOption.label}).`,
        );

        setExpandedQuestionId(
          question.id,
        );

        return false;
      }

      /* ------------------------------------------------------
         MARKS
      ------------------------------------------------------ */

      const marks = Number(
        question.marks,
      );

      if (
        !Number.isFinite(marks) ||
        marks <= 0
      ) {
        alert(
          `Question ${
            index + 1
          } must have valid marks greater than 0.`,
        );

        setExpandedQuestionId(
          question.id,
        );

        return false;
      }

      /* ------------------------------------------------------
         CORRECT ANSWERS MUST EXIST IN OPTIONS
      ------------------------------------------------------ */

      const optionIds =
        question.options.map(
          (option) => option.id,
        );

      const invalidCorrectAnswer =
        question.correctAnswers.find(
          (answer) =>
            !optionIds.includes(answer),
        );

      if (invalidCorrectAnswer) {
        alert(
          `Question ${
            index + 1
          } contains an invalid correct answer.`,
        );

        setExpandedQuestionId(
          question.id,
        );

        return false;
      }
    }

    return true;
  };

  /* ==========================================================
     BUILD API PAYLOAD
  ========================================================== */

  const buildPayload =
    (): CreateCompetitionQuestionPayload => {
      return {
        competitionId,
        subjectId,

        questions: questions.map(
          (question) => ({
            question:
              question.question.trim(),

            questionType:
              question.questionType,

            options:
              question.options.map(
                (option) => ({
                  id: option.id,
                  label: option.label,
                  text: option.text.trim(),
                }),
              ),

            /*
             * THIS IS THE CORRECT OPTION DATA.
             *
             * Example:
             * ["b"]
             *
             * or:
             * ["a", "c"]
             */
            correctAnswers: [
              ...question.correctAnswers,
            ],

            /*
             * Backend can use this to determine
             * whether multiple correct answers
             * are allowed.
             */
            isMultipleAnswer:
              question.questionType ===
              "multiple",

            /*
             * Convert string input to number.
             */
            marks: Number(
              question.marks,
            ),

            difficulty:
              question.difficulty,

            explanation:
              question.explanation.trim(),

            /*
             * Only send imageUrl when provided.
             */
            ...(question.imageUrl.trim()
              ? {
                  imageUrl:
                    question.imageUrl.trim(),
                }
              : {}),
          }),
        ),
      };
    };

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async () => {
    if (isSaving) {
      return;
    }

    if (!validateQuestions()) {
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildPayload();

      console.log(
        "========== CREATE COMPETITION QUESTIONS ==========",
      );

      console.log(
        "competitionId:",
        competitionId,
      );

      console.log(
        "subjectId:",
        subjectId,
      );

      console.log(
        "payload:",
        JSON.stringify(
          payload,
          null,
          2,
        ),
      );

      /*
       * ======================================================
       * API REQUEST
       * ======================================================
       *
       * Expected backend endpoint:
       *
       * POST
       * /api/v1/solveandwin/competitions/
       * :competitionId/subjects/:subjectId/questions
       *
       */

      const apiUrl =
        `/api/v1/solveandwin/competitions/${encodeURIComponent(
          competitionId,
        )}/subjects/${encodeURIComponent(
          subjectId,
        )}/questions`;

      const response = await fetch(
        apiUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(
            payload,
          ),
        },
      );

      /* ------------------------------------------------------
         READ RESPONSE
      ------------------------------------------------------ */

      let result: unknown = null;

      try {
        result =
          await response.json();
      } catch {
        result = null;
      }

      console.log(
        "Create questions response:",
        result,
      );

      /* ------------------------------------------------------
         ERROR
      ------------------------------------------------------ */

      if (!response.ok) {
        const errorMessage =
          typeof result ===
            "object" &&
          result !== null &&
          "message" in result &&
          typeof (
            result as {
              message?: unknown;
            }
          ).message === "string"
            ? (
                result as {
                  message: string;
                }
              ).message
            : `Failed to save questions. HTTP ${response.status}`;

        throw new Error(
          errorMessage,
        );
      }

      /* ------------------------------------------------------
         SUCCESS
      ------------------------------------------------------ */

      alert(
        `${questions.length} ${
          questions.length === 1
            ? "question"
            : "questions"
        } saved successfully.`,
      );

      /*
       * Go back to:
       *
       * /competitions/[competitionId]
       * /subjects/[subjectId]
       * /questions
       */
      router.push(
        `/admin/solveandwin/competitions/${encodeURIComponent(
          competitionId,
        )}/subjects/${encodeURIComponent(
          subjectId,
        )}/questions`,
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to save competition questions:",
        error,
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save questions. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {/* ======================================================
            BACK
        ====================================================== */}

        <Link
          href="../../"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Questions
        </Link>

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                Solve &amp; Win
              </span>

              <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                Add Competition Questions
              </h1>

              <p className="mt-3 max-w-3xl text-slate-600">
                Create multiple questions for this
                competition subject. Each question can
                have its own answers, media, marks,
                difficulty and explanation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Questions
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {questions.length}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================
            QUESTIONS
        ====================================================== */}

        <div className="space-y-5">
          {questions.map(
            (question, questionIndex) => {
              const isExpanded =
                expandedQuestionId ===
                question.id;

              const selectedCorrectCount =
                question.correctAnswers
                  .length;

              return (
                <Card
                  key={question.id}
                  className="overflow-hidden"
                >
                  {/* =================================================
                      QUESTION HEADER
                  ================================================= */}

                  <div
                    className={`flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between ${
                      isExpanded
                        ? "bg-white"
                        : "bg-slate-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        toggleQuestion(
                          question.id,
                        )
                      }
                      className="flex min-w-0 items-center gap-4 text-left"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                        {questionIndex + 1}
                      </div>

                      <div className="min-w-0">
                        <h2 className="font-bold text-slate-900">
                          Question{" "}
                          {questionIndex + 1}
                        </h2>

                        <p className="mt-1 max-w-2xl truncate text-sm text-slate-500">
                          {question.question.trim()
                            ? question.question
                            : "No question text entered yet"}
                        </p>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="ml-auto h-5 w-5 shrink-0 text-slate-400" />
                      ) : (
                        <ChevronDown className="ml-auto h-5 w-5 shrink-0 text-slate-400" />
                      )}
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {question.marks}{" "}
                        {question.marks ===
                        "1"
                          ? "mark"
                          : "marks"}
                      </span>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {
                          question.difficulty
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          duplicateQuestion(
                            question.id,
                          )
                        }
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                        title="Duplicate question"
                      >
                        <Copy className="h-4 w-4" />
                      </button>

                      {questions.length >
                        1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeQuestion(
                              question.id,
                            )
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          title="Remove question"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* =================================================
                      QUESTION BODY
                  ================================================= */}

                  {isExpanded && (
                    <div className="space-y-6 p-5 md:p-8">
                      {/* =============================================
                          QUESTION DETAILS
                      ============================================= */}

                      <div>
                        <div className="mb-5">
                          <h3 className="text-lg font-bold text-slate-900">
                            Question Details
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Enter the question and
                            configure how it will be
                            scored.
                          </p>
                        </div>

                        <div className="space-y-6">
                          {/* Question */}

                          <div>
                            <label
                              htmlFor={`question-${question.id}`}
                              className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              Question
                            </label>

                            <textarea
                              id={`question-${question.id}`}
                              value={
                                question.question
                              }
                              onChange={(
                                event,
                              ) =>
                                updateQuestion(
                                  question.id,
                                  {
                                    question:
                                      event
                                        .target
                                        .value,
                                  },
                                )
                              }
                              placeholder="Enter the question..."
                              rows={6}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>

                          {/* Question Type */}

                          <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-700">
                              Question Type
                            </label>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <button
                                type="button"
                                onClick={() =>
                                  changeQuestionType(
                                    question.id,
                                    "single",
                                  )
                                }
                                className={`rounded-xl border p-4 text-left transition ${
                                  question.questionType ===
                                  "single"
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                              >
                                <p className="font-semibold text-slate-900">
                                  Single Answer
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  Only one option can
                                  be correct.
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  changeQuestionType(
                                    question.id,
                                    "multiple",
                                  )
                                }
                                className={`rounded-xl border p-4 text-left transition ${
                                  question.questionType ===
                                  "multiple"
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                              >
                                <p className="font-semibold text-slate-900">
                                  Multiple Answers
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  More than one option can
                                  be correct.
                                </p>
                              </button>
                            </div>
                          </div>

                          {/* Marks / Difficulty */}

                          <div className="grid gap-5 md:grid-cols-2">
                            <div>
                              <label
                                htmlFor={`marks-${question.id}`}
                                className="mb-2 block text-sm font-semibold text-slate-700"
                              >
                                Marks
                              </label>

                              <Input
                                id={`marks-${question.id}`}
                                type="number"
                                min="1"
                                value={
                                  question.marks
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateQuestion(
                                    question.id,
                                    {
                                      marks:
                                        event
                                          .target
                                          .value,
                                    },
                                  )
                                }
                                placeholder="1"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`difficulty-${question.id}`}
                                className="mb-2 block text-sm font-semibold text-slate-700"
                              >
                                Difficulty
                              </label>

                              <select
                                id={`difficulty-${question.id}`}
                                value={
                                  question.difficulty
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateQuestion(
                                    question.id,
                                    {
                                      difficulty:
                                        event
                                          .target
                                          .value,
                                    },
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              >
                                <option value="Easy">
                                  Easy
                                </option>

                                <option value="Medium">
                                  Medium
                                </option>

                                <option value="Hard">
                                  Hard
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* =============================================
                          OPTIONS
                      ============================================= */}

                      <div className="border-t border-slate-200 pt-6">
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              Answer Options
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Select the correct answer
                              option
                              {question.questionType ===
                              "multiple"
                                ? "s"
                                : ""}
                              .
                            </p>
                          </div>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {selectedCorrectCount}{" "}
                            correct
                          </span>
                        </div>

                        <div className="space-y-4">
                          {question.options.map(
                            (option) => {
                              const isCorrect =
                                question.correctAnswers.includes(
                                  option.id,
                                );

                              return (
                                <div
                                  key={
                                    option.id
                                  }
                                  className={`rounded-xl border p-4 transition ${
                                    isCorrect
                                      ? "border-green-300 bg-green-50"
                                      : "border-slate-200 bg-white"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleCorrectAnswer(
                                          question.id,
                                          option.id,
                                        )
                                      }
                                      aria-label={`Mark option ${option.label} as correct`}
                                      className={`mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${
                                        isCorrect
                                          ? "border-green-600 bg-green-600 text-white"
                                          : "border-slate-300 bg-white text-slate-500 hover:border-blue-500 hover:text-blue-600"
                                      }`}
                                    >
                                      {isCorrect ? (
                                        <CheckCircle2 className="h-5 w-5" />
                                      ) : (
                                        option.label
                                      )}
                                    </button>

                                    <div className="flex-1">
                                      <label
                                        htmlFor={`option-${question.id}-${option.id}`}
                                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
                                      >
                                        Option{" "}
                                        {
                                          option.label
                                        }
                                      </label>

                                      <textarea
                                        id={`option-${question.id}-${option.id}`}
                                        value={
                                          option.text
                                        }
                                        onChange={(
                                          event,
                                        ) =>
                                          updateOption(
                                            question.id,
                                            option.id,
                                            event
                                              .target
                                              .value,
                                          )
                                        }
                                        placeholder={`Enter option ${option.label}...`}
                                        rows={2}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      />
                                    </div>

                                    {question
                                      .options
                                      .length >
                                      2 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeOption(
                                            question.id,
                                            option.id,
                                          )
                                        }
                                        className="mt-7 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                        aria-label={`Remove option ${option.label}`}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>

                                  {isCorrect && (
                                    <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-700">
                                      <CheckCircle2 className="h-4 w-4" />
                                      Correct answer
                                    </p>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addOption(
                              question.id,
                            )
                          }
                          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add another option
                        </button>
                      </div>

                      {/* =============================================
                          MEDIA
                      ============================================= */}

                      <div className="border-t border-slate-200 pt-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-bold text-slate-900">
                            Question Media
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Optionally attach an image or
                            media reference to this
                            question.
                          </p>
                        </div>

                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                          <ImagePlus className="mx-auto h-10 w-10 text-slate-400" />

                          <h4 className="mt-3 font-semibold text-slate-900">
                            Add an image
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            You can connect this field to
                            your media upload service.
                          </p>

                          <div className="mx-auto mt-5 max-w-xl">
                            <Input
                              value={
                                question.imageUrl
                              }
                              onChange={(
                                event,
                              ) =>
                                updateQuestion(
                                  question.id,
                                  {
                                    imageUrl:
                                      event
                                        .target
                                        .value,
                                  },
                                )
                              }
                              placeholder="Optional image URL"
                            />
                          </div>

                          {question.imageUrl.trim() && (
                            <div className="mx-auto mt-5 max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                              <img
                                src={
                                  question.imageUrl
                                }
                                alt={`Question ${
                                  questionIndex +
                                  1
                                } media preview`}
                                className="max-h-72 w-full rounded-lg object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* =============================================
                          EXPLANATION
                      ============================================= */}

                      <div className="border-t border-slate-200 pt-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-bold text-slate-900">
                            Solution / Explanation
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Add an explanation that can be
                            displayed when reviewing the
                            answer.
                          </p>
                        </div>

                        <textarea
                          value={
                            question.explanation
                          }
                          onChange={(event) =>
                            updateQuestion(
                              question.id,
                              {
                                explanation:
                                  event
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="Enter the solution or explanation..."
                          rows={6}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  )}
                </Card>
              );
            },
          )}
        </div>

        {/* ======================================================
            ADD QUESTION
        ====================================================== */}

        <div className="mt-6">
          <button
            type="button"
            onClick={addQuestion}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-6 text-sm font-bold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
          >
            <Plus className="h-5 w-5" />
            Add Another Question
          </button>
        </div>

        {/* ======================================================
            SUMMARY / ACTIONS
        ====================================================== */}

        <Card className="mt-6 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-semibold text-slate-900">
                {questions.length}{" "}
                {questions.length === 1
                  ? "question"
                  : "questions"}{" "}
                ready
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Review each question and make sure every
                question has a correct answer before
                saving.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="../../">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>

              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                leftIcon={
                  <Save className="h-4 w-4" />
                }
                className="w-full sm:w-auto"
              >
                {isSaving
                  ? "Saving..."
                  : `Save ${questions.length} ${
                      questions.length === 1
                        ? "Question"
                        : "Questions"
                    }`}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
















// // Uses the competitionId and subjectId route params







// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import {
//   ArrowLeft,
//   CheckCircle2,
//   ImagePlus,
//   Plus,
//   Save,
//   Trash2,
//   Copy,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// /* ============================================================
//    TYPES
// ============================================================ */

// type QuestionType = "single" | "multiple";

// interface Option {
//   id: string;
//   label: string;
//   text: string;
// }

// interface CompetitionQuestion {
//   id: string;
//   questionType: QuestionType;
//   question: string;
//   marks: string;
//   difficulty: string;
//   explanation: string;
//   imageUrl: string;
//   options: Option[];
//   correctAnswers: string[];
// }

// /* ============================================================
//    HELPERS
// ============================================================ */

// const createOptions = (): Option[] => [
//   {
//     id: "a",
//     label: "A",
//     text: "",
//   },
//   {
//     id: "b",
//     label: "B",
//     text: "",
//   },
//   {
//     id: "c",
//     label: "C",
//     text: "",
//   },
//   {
//     id: "d",
//     label: "D",
//     text: "",
//   },
// ];

// const createQuestion = (): CompetitionQuestion => ({
//   id: `question-${Date.now()}-${Math.random()
//     .toString(36)
//     .slice(2)}`,
//   questionType: "single",
//   question: "",
//   marks: "1",
//   difficulty: "Medium",
//   explanation: "",
//   imageUrl: "",
//   options: createOptions(),
//   correctAnswers: [],
// });

// /* ============================================================
//    PAGE
// ============================================================ */

// export default function AddCompetitionQuestionPage() {
//   const [questions, setQuestions] = useState<
//     CompetitionQuestion[]
//   >([createQuestion()]);

//   const [expandedQuestionId, setExpandedQuestionId] =
//     useState<string | null>(questions[0]?.id ?? null);

//   const [isSaving, setIsSaving] = useState(false);

//   /* ==========================================================
//      QUESTION HANDLERS
//   ========================================================== */

//   const addQuestion = () => {
//     const newQuestion = createQuestion();

//     setQuestions((current) => [
//       ...current,
//       newQuestion,
//     ]);

//     setExpandedQuestionId(newQuestion.id);
//   };

//   const duplicateQuestion = (
//     questionId: string,
//   ) => {
//     const sourceQuestion = questions.find(
//       (question) => question.id === questionId,
//     );

//     if (!sourceQuestion) {
//       return;
//     }

//     const duplicatedQuestion: CompetitionQuestion = {
//       ...sourceQuestion,
//       id: `question-${Date.now()}-${Math.random()
//         .toString(36)
//         .slice(2)}`,
//       options: sourceQuestion.options.map(
//         (option) => ({
//           ...option,
//         }),
//       ),
//       correctAnswers: [
//         ...sourceQuestion.correctAnswers,
//       ],
//     };

//     setQuestions((current) => {
//       const index = current.findIndex(
//         (question) =>
//           question.id === questionId,
//       );

//       const next = [...current];

//       next.splice(
//         index + 1,
//         0,
//         duplicatedQuestion,
//       );

//       return next;
//     });

//     setExpandedQuestionId(
//       duplicatedQuestion.id,
//     );
//   };

//   const removeQuestion = (
//     questionId: string,
//   ) => {
//     if (questions.length === 1) {
//       return;
//     }

//     setQuestions((current) =>
//       current.filter(
//         (question) =>
//           question.id !== questionId,
//       ),
//     );

//     if (
//       expandedQuestionId === questionId
//     ) {
//       const remaining = questions.filter(
//         (question) =>
//           question.id !== questionId,
//       );

//       setExpandedQuestionId(
//         remaining[0]?.id ?? null,
//       );
//     }
//   };

//   const toggleQuestion = (
//     questionId: string,
//   ) => {
//     setExpandedQuestionId(
//       (current) =>
//         current === questionId
//           ? null
//           : questionId,
//     );
//   };

//   /* ==========================================================
//      UPDATE QUESTION
//   ========================================================== */

//   const updateQuestion = (
//     questionId: string,
//     updates: Partial<CompetitionQuestion>,
//   ) => {
//     setQuestions((current) =>
//       current.map((question) =>
//         question.id === questionId
//           ? {
//               ...question,
//               ...updates,
//             }
//           : question,
//       ),
//     );
//   };

//   /* ==========================================================
//      OPTION HANDLERS
//   ========================================================== */

//   const updateOption = (
//     questionId: string,
//     optionId: string,
//     value: string,
//   ) => {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         return {
//           ...question,
//           options: question.options.map(
//             (option) =>
//               option.id === optionId
//                 ? {
//                     ...option,
//                     text: value,
//                   }
//                 : option,
//           ),
//         };
//       }),
//     );
//   };

//   const addOption = (
//     questionId: string,
//   ) => {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         const nextIndex =
//           question.options.length;

//         const label =
//           String.fromCharCode(
//             65 + nextIndex,
//           );

//         return {
//           ...question,
//           options: [
//             ...question.options,
//             {
//               id: label.toLowerCase(),
//               label,
//               text: "",
//             },
//           ],
//         };
//       }),
//     );
//   };

//   const removeOption = (
//     questionId: string,
//     optionId: string,
//   ) => {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         if (question.options.length <= 2) {
//           return question;
//         }

//         return {
//           ...question,
//           options:
//             question.options.filter(
//               (option) =>
//                 option.id !== optionId,
//             ),
//           correctAnswers:
//             question.correctAnswers.filter(
//               (answer) =>
//                 answer !== optionId,
//             ),
//         };
//       }),
//     );
//   };

//   /* ==========================================================
//      CORRECT ANSWER
//   ========================================================== */

//   const toggleCorrectAnswer = (
//     questionId: string,
//     optionId: string,
//   ) => {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         if (
//           question.questionType ===
//           "single"
//         ) {
//           return {
//             ...question,
//             correctAnswers: [
//               optionId,
//             ],
//           };
//         }

//         const alreadySelected =
//           question.correctAnswers.includes(
//             optionId,
//           );

//         return {
//           ...question,
//           correctAnswers:
//             alreadySelected
//               ? question.correctAnswers.filter(
//                   (answer) =>
//                     answer !== optionId,
//                 )
//               : [
//                   ...question.correctAnswers,
//                   optionId,
//                 ],
//         };
//       }),
//     );
//   };

//   /* ==========================================================
//      QUESTION TYPE
//   ========================================================== */

//   const changeQuestionType = (
//     questionId: string,
//     type: QuestionType,
//   ) => {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         return {
//           ...question,
//           questionType: type,
//           correctAnswers:
//             type === "single"
//               ? question.correctAnswers.slice(
//                   0,
//                   1,
//                 )
//               : question.correctAnswers,
//         };
//       }),
//     );
//   };

//   /* ==========================================================
//      VALIDATION
//   ========================================================== */

//   const validateQuestions = () => {
//     for (
//       let index = 0;
//       index < questions.length;
//       index++
//     ) {
//       const question =
//         questions[index];

//       if (!question.question.trim()) {
//         alert(
//           `Question ${
//             index + 1
//           } is missing the question text.`,
//         );

//         setExpandedQuestionId(
//           question.id,
//         );

//         return false;
//       }

//       if (
//         question.correctAnswers.length ===
//         0
//       ) {
//         alert(
//           `Question ${
//             index + 1
//           } does not have a correct answer selected.`,
//         );

//         setExpandedQuestionId(
//           question.id,
//         );

//         return false;
//       }

//       const emptyOption =
//         question.options.find(
//           (option) =>
//             !option.text.trim(),
//         );

//       if (emptyOption) {
//         alert(
//           `Question ${
//             index + 1
//           } has an empty option (${emptyOption.label}).`,
//         );

//         setExpandedQuestionId(
//           question.id,
//         );

//         return false;
//       }
//     }

//     return true;
//   };

//   /* ==========================================================
//      SUBMIT
//   ========================================================== */

//   const handleSubmit = async () => {
//     if (isSaving) {
//       return;
//     }

//     if (!validateQuestions()) {
//       return;
//     }

//     setIsSaving(true);

//     /*
//      * Backend integration will eventually happen here.
//      *
//      * The payload is now an ARRAY so multiple questions
//      * can be submitted together.
//      *
//      * Example:
//      *
//      * {
//      *   competitionId,
//      *   subjectId,
//      *   questions: [...]
//      * }
//      */

//     console.log(
//       "Create competition questions",
//       {
//         questions,
//       },
//     );

//     /*
//      * Replace the timeout with your API call.
//      *
//      * Example:
//      *
//      * await createCompetitionQuestions({
//      *   competitionId,
//      *   subjectId,
//      *   questions,
//      * });
//      */

//     await new Promise((resolve) =>
//       setTimeout(resolve, 500),
//     );

//     setIsSaving(false);
//   };

//   /* ============================================================
//      RENDER
//   ============================================================ */

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto max-w-6xl px-4 py-10">
//         {/* ======================================================
//             BACK
//         ====================================================== */}

//         <Link
//           href="../../"
//           className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Questions
//         </Link>

//         {/* ======================================================
//             HEADER
//         ====================================================== */}

//         <div className="mb-8">
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
//                 Solve &amp; Win
//               </span>

//               <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
//                 Add Competition Questions
//               </h1>

//               <p className="mt-3 max-w-3xl text-slate-600">
//                 Create multiple questions for this
//                 competition subject. Each question can
//                 have its own answers, media, marks,
//                 difficulty and explanation.
//               </p>
//             </div>

//             <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
//               <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//                 Questions
//               </p>

//               <p className="mt-1 text-2xl font-bold text-slate-900">
//                 {questions.length}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ======================================================
//             QUESTIONS
//         ====================================================== */}

//         <div className="space-y-5">
//           {questions.map(
//             (question, questionIndex) => {
//               const isExpanded =
//                 expandedQuestionId ===
//                 question.id;

//               const selectedCorrectCount =
//                 question.correctAnswers
//                   .length;

//               return (
//                 <Card
//                   key={question.id}
//                   className="overflow-hidden"
//                 >
//                   {/* =================================================
//                       QUESTION HEADER
//                   ================================================= */}

//                   <div
//                     className={`flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between ${
//                       isExpanded
//                         ? "bg-white"
//                         : "bg-slate-50"
//                     }`}
//                   >
//                     <button
//                       type="button"
//                       onClick={() =>
//                         toggleQuestion(
//                           question.id,
//                         )
//                       }
//                       className="flex min-w-0 items-center gap-4 text-left"
//                     >
//                       <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
//                         {questionIndex + 1}
//                       </div>

//                       <div className="min-w-0">
//                         <h2 className="font-bold text-slate-900">
//                           Question{" "}
//                           {questionIndex + 1}
//                         </h2>

//                         <p className="mt-1 max-w-2xl truncate text-sm text-slate-500">
//                           {question.question.trim()
//                             ? question.question
//                             : "No question text entered yet"}
//                         </p>
//                       </div>

//                       {isExpanded ? (
//                         <ChevronUp className="ml-auto h-5 w-5 shrink-0 text-slate-400" />
//                       ) : (
//                         <ChevronDown className="ml-auto h-5 w-5 shrink-0 text-slate-400" />
//                       )}
//                     </button>

//                     <div className="flex flex-wrap items-center gap-2">
//                       <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
//                         {question.marks}{" "}
//                         {question.marks ===
//                         "1"
//                           ? "mark"
//                           : "marks"}
//                       </span>

//                       <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
//                         {
//                           question
//                             .difficulty
//                         }
//                       </span>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           duplicateQuestion(
//                             question.id,
//                           )
//                         }
//                         className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
//                         title="Duplicate question"
//                       >
//                         <Copy className="h-4 w-4" />
//                       </button>

//                       {questions.length >
//                         1 && (
//                         <button
//                           type="button"
//                           onClick={() =>
//                             removeQuestion(
//                               question.id,
//                             )
//                           }
//                           className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
//                           title="Remove question"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* =================================================
//                       QUESTION BODY
//                   ================================================= */}

//                   {isExpanded && (
//                     <div className="space-y-6 p-5 md:p-8">
//                       {/* =============================================
//                           QUESTION DETAILS
//                       ============================================= */}

//                       <div>
//                         <div className="mb-5">
//                           <h3 className="text-lg font-bold text-slate-900">
//                             Question Details
//                           </h3>

//                           <p className="mt-1 text-sm text-slate-500">
//                             Enter the question and
//                             configure how it will be
//                             scored.
//                           </p>
//                         </div>

//                         <div className="space-y-6">
//                           {/* Question */}
//                           <div>
//                             <label
//                               htmlFor={`question-${question.id}`}
//                               className="mb-2 block text-sm font-semibold text-slate-700"
//                             >
//                               Question
//                             </label>

//                             <textarea
//                               id={`question-${question.id}`}
//                               value={
//                                 question.question
//                               }
//                               onChange={(
//                                 event,
//                               ) =>
//                                 updateQuestion(
//                                   question.id,
//                                   {
//                                     question:
//                                       event
//                                         .target
//                                         .value,
//                                   },
//                                 )
//                               }
//                               placeholder="Enter the question..."
//                               rows={6}
//                               className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             />
//                           </div>

//                           {/* Question Type */}
//                           <div>
//                             <label className="mb-3 block text-sm font-semibold text-slate-700">
//                               Question Type
//                             </label>

//                             <div className="grid gap-3 sm:grid-cols-2">
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   changeQuestionType(
//                                     question.id,
//                                     "single",
//                                   )
//                                 }
//                                 className={`rounded-xl border p-4 text-left transition ${
//                                   question.questionType ===
//                                   "single"
//                                     ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                                     : "border-slate-200 bg-white hover:border-slate-300"
//                                 }`}
//                               >
//                                 <p className="font-semibold text-slate-900">
//                                   Single Answer
//                                 </p>

//                                 <p className="mt-1 text-sm text-slate-500">
//                                   Only one option can
//                                   be correct.
//                                 </p>
//                               </button>

//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   changeQuestionType(
//                                     question.id,
//                                     "multiple",
//                                   )
//                                 }
//                                 className={`rounded-xl border p-4 text-left transition ${
//                                   question.questionType ===
//                                   "multiple"
//                                     ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                                     : "border-slate-200 bg-white hover:border-slate-300"
//                                 }`}
//                               >
//                                 <p className="font-semibold text-slate-900">
//                                   Multiple Answers
//                                 </p>

//                                 <p className="mt-1 text-sm text-slate-500">
//                                   More than one option can
//                                   be correct.
//                                 </p>
//                               </button>
//                             </div>
//                           </div>

//                           {/* Marks / Difficulty */}
//                           <div className="grid gap-5 md:grid-cols-2">
//                             <div>
//                               <label
//                                 htmlFor={`marks-${question.id}`}
//                                 className="mb-2 block text-sm font-semibold text-slate-700"
//                               >
//                                 Marks
//                               </label>

//                               <Input
//                                 id={`marks-${question.id}`}
//                                 type="number"
//                                 min="1"
//                                 value={
//                                   question.marks
//                                 }
//                                 onChange={(
//                                   event,
//                                 ) =>
//                                   updateQuestion(
//                                     question.id,
//                                     {
//                                       marks:
//                                         event
//                                           .target
//                                           .value,
//                                     },
//                                   )
//                                 }
//                                 placeholder="1"
//                               />
//                             </div>

//                             <div>
//                               <label
//                                 htmlFor={`difficulty-${question.id}`}
//                                 className="mb-2 block text-sm font-semibold text-slate-700"
//                               >
//                                 Difficulty
//                               </label>

//                               <select
//                                 id={`difficulty-${question.id}`}
//                                 value={
//                                   question.difficulty
//                                 }
//                                 onChange={(
//                                   event,
//                                 ) =>
//                                   updateQuestion(
//                                     question.id,
//                                     {
//                                       difficulty:
//                                         event
//                                           .target
//                                           .value,
//                                     },
//                                   )
//                                 }
//                                 className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                               >
//                                 <option value="Easy">
//                                   Easy
//                                 </option>

//                                 <option value="Medium">
//                                   Medium
//                                 </option>

//                                 <option value="Hard">
//                                   Hard
//                                 </option>
//                               </select>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* =============================================
//                           OPTIONS
//                       ============================================= */}

//                       <div className="border-t border-slate-200 pt-6">
//                         <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                           <div>
//                             <h3 className="text-lg font-bold text-slate-900">
//                               Answer Options
//                             </h3>

//                             <p className="mt-1 text-sm text-slate-500">
//                               Select the correct answer
//                               option{question.questionType ===
//                               "multiple"
//                                 ? "s"
//                                 : ""}
//                               .
//                             </p>
//                           </div>

//                           <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
//                             {selectedCorrectCount}{" "}
//                             correct
//                           </span>
//                         </div>

//                         <div className="space-y-4">
//                           {question.options.map(
//                             (option) => {
//                               const isCorrect =
//                                 question.correctAnswers.includes(
//                                   option.id,
//                                 );

//                               return (
//                                 <div
//                                   key={
//                                     option.id
//                                   }
//                                   className={`rounded-xl border p-4 transition ${
//                                     isCorrect
//                                       ? "border-green-300 bg-green-50"
//                                       : "border-slate-200 bg-white"
//                                   }`}
//                                 >
//                                   <div className="flex items-start gap-3">
//                                     <button
//                                       type="button"
//                                       onClick={() =>
//                                         toggleCorrectAnswer(
//                                           question.id,
//                                           option.id,
//                                         )
//                                       }
//                                       aria-label={`Mark option ${option.label} as correct`}
//                                       className={`mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${
//                                         isCorrect
//                                           ? "border-green-600 bg-green-600 text-white"
//                                           : "border-slate-300 bg-white text-slate-500 hover:border-blue-500 hover:text-blue-600"
//                                       }`}
//                                     >
//                                       {isCorrect ? (
//                                         <CheckCircle2 className="h-5 w-5" />
//                                       ) : (
//                                         option.label
//                                       )}
//                                     </button>

//                                     <div className="flex-1">
//                                       <label
//                                         htmlFor={`option-${question.id}-${option.id}`}
//                                         className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500"
//                                       >
//                                         Option{" "}
//                                         {
//                                           option.label
//                                         }
//                                       </label>

//                                       <textarea
//                                         id={`option-${question.id}-${option.id}`}
//                                         value={
//                                           option.text
//                                         }
//                                         onChange={(
//                                           event,
//                                         ) =>
//                                           updateOption(
//                                             question.id,
//                                             option.id,
//                                             event
//                                               .target
//                                               .value,
//                                           )
//                                         }
//                                         placeholder={`Enter option ${option.label}...`}
//                                         rows={2}
//                                         className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                       />
//                                     </div>

//                                     {question
//                                       .options
//                                       .length >
//                                       2 && (
//                                       <button
//                                         type="button"
//                                         onClick={() =>
//                                           removeOption(
//                                             question.id,
//                                             option.id,
//                                           )
//                                         }
//                                         className="mt-7 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
//                                         aria-label={`Remove option ${option.label}`}
//                                       >
//                                         <Trash2 className="h-4 w-4" />
//                                       </button>
//                                     )}
//                                   </div>

//                                   {isCorrect && (
//                                     <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-green-700">
//                                       <CheckCircle2 className="h-4 w-4" />
//                                       Correct answer
//                                     </p>
//                                   )}
//                                 </div>
//                               );
//                             },
//                           )}
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             addOption(
//                               question.id,
//                             )
//                           }
//                           className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
//                         >
//                           <Plus className="h-4 w-4" />
//                           Add another option
//                         </button>
//                       </div>

//                       {/* =============================================
//                           MEDIA
//                       ============================================= */}

//                       <div className="border-t border-slate-200 pt-6">
//                         <div className="mb-6">
//                           <h3 className="text-lg font-bold text-slate-900">
//                             Question Media
//                           </h3>

//                           <p className="mt-1 text-sm text-slate-500">
//                             Optionally attach an image or
//                             media reference to this
//                             question.
//                           </p>
//                         </div>

//                         <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
//                           <ImagePlus className="mx-auto h-10 w-10 text-slate-400" />

//                           <h4 className="mt-3 font-semibold text-slate-900">
//                             Add an image
//                           </h4>

//                           <p className="mt-1 text-sm text-slate-500">
//                             You can connect this field to
//                             your media upload service.
//                           </p>

//                           <div className="mx-auto mt-5 max-w-xl">
//                             <Input
//                               value={
//                                 question.imageUrl
//                               }
//                               onChange={(
//                                 event,
//                               ) =>
//                                 updateQuestion(
//                                   question.id,
//                                   {
//                                     imageUrl:
//                                       event
//                                         .target
//                                         .value,
//                                   },
//                                 )
//                               }
//                               placeholder="Optional image URL"
//                             />
//                           </div>

//                           {question.imageUrl.trim() && (
//                             <div className="mx-auto mt-5 max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
//                               <img
//                                 src={
//                                   question.imageUrl
//                                 }
//                                 alt={`Question ${
//                                   questionIndex +
//                                   1
//                                 } media preview`}
//                                 className="max-h-72 w-full rounded-lg object-contain"
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* =============================================
//                           EXPLANATION
//                       ============================================= */}

//                       <div className="border-t border-slate-200 pt-6">
//                         <div className="mb-6">
//                           <h3 className="text-lg font-bold text-slate-900">
//                             Solution / Explanation
//                           </h3>

//                           <p className="mt-1 text-sm text-slate-500">
//                             Add an explanation that can be
//                             displayed when reviewing the
//                             answer.
//                           </p>
//                         </div>

//                         <textarea
//                           value={
//                             question.explanation
//                           }
//                           onChange={(event) =>
//                             updateQuestion(
//                               question.id,
//                               {
//                                 explanation:
//                                   event
//                                     .target
//                                     .value,
//                               },
//                             )
//                           }
//                           placeholder="Enter the solution or explanation..."
//                           rows={6}
//                           className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </Card>
//               );
//             },
//           )}
//         </div>

//         {/* ======================================================
//             ADD QUESTION
//         ====================================================== */}

//         <div className="mt-6">
//           <button
//             type="button"
//             onClick={addQuestion}
//             className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-6 text-sm font-bold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50"
//           >
//             <Plus className="h-5 w-5" />
//             Add Another Question
//           </button>
//         </div>

//         {/* ======================================================
//             SUMMARY / ACTIONS
//         ====================================================== */}

//         <Card className="mt-6 p-6 md:p-8">
//           <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//             <div>
//               <p className="font-semibold text-slate-900">
//                 {questions.length}{" "}
//                 {questions.length === 1
//                   ? "question"
//                   : "questions"}{" "}
//                 ready
//               </p>

//               <p className="mt-1 text-sm text-slate-500">
//                 Review each question and make sure every
//                 question has a correct answer before
//                 saving.
//               </p>
//             </div>

//             <div className="flex flex-col gap-3 sm:flex-row">
//               <Link href="../../">
//                 <Button
//                   variant="outline"
//                   className="w-full sm:w-auto"
//                 >
//                   Cancel
//                 </Button>
//               </Link>

//               <Button
//                 onClick={handleSubmit}
//                 disabled={isSaving}
//                 leftIcon={
//                   <Save className="h-4 w-4" />
//                 }
//                 className="w-full sm:w-auto"
//               >
//                 {isSaving
//                   ? "Saving..."
//                   : `Save ${questions.length} ${
//                       questions.length === 1
//                         ? "Question"
//                         : "Questions"
//                     }`}
//               </Button>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </main>
//   );
// }


