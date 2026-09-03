"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  getContestWithSubjectsById,
  addQuestionsToSubjectInContest,
} from "@/lib/api/solveAndWin";

/* ============================================================
   TYPES
============================================================ */

type QuestionType = "single" | "multiple";

type QuestionSection =
  | "objective"
  | "essay"
  | "comprehension"
  | "oral";

type QuestionDifficulty =
  | "easy"
  | "medium"
  | "hard";

interface Option {
  id: string;
  label: string;
  text: string;
}

interface CompetitionQuestion {
  id: string;

  questionType: QuestionType;

  question: string;

  instruction: string;

  topic: string;

  section: QuestionSection;

  marks: string;

  difficulty: QuestionDifficulty;

  category: string;

  examType: string;

  examYear: string;

  explanation: string;

  solution: string;

  explanationSteps: string[];

  imageUrl: string;

  options: Option[];

  correctAnswers: string[];
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

  instruction: "",

  topic: "",

  /*
   * Backend enum:
   * objective | essay | comprehension | oral
   */
  section: "objective",

  marks: "1",

  /*
   * Backend enum:
   * easy | medium | hard
   */
  difficulty: "medium",

  category: "JAMB",

  examType: "JAMB",

  examYear: "",

  explanation: "",

  solution: "",

  explanationSteps: [],

  imageUrl: "",

  options: createOptions(),

  correctAnswers: [],
});

/* ============================================================
   PAGE
============================================================ */

export default function AddCompetitionQuestionPage() {
  const params = useParams<{
    competitionId: string;
    subjectId: string;
  }>();

  const router = useRouter();

  /* ==========================================================
     ROUTE PARAMS
  ========================================================== */

  const competitionId = params.competitionId;
  const subjectId = params.subjectId;

  /* ==========================================================
     STATE
  ========================================================== */

  const [questions, setQuestions] = useState<
    CompetitionQuestion[]
  >([createQuestion()]);

  const [expandedQuestionId, setExpandedQuestionId] =
    useState<string | null>(
      questions[0]?.id ?? null,
    );

  const [isSaving, setIsSaving] = useState(false);

  const [isLoadingSubject, setIsLoadingSubject] =
    useState(true);

  const [subjectName, setSubjectName] =
    useState("");

  const [subjectLoadError, setSubjectLoadError] =
    useState("");

  /* ==========================================================
     LOAD SUBJECT INFORMATION
  ========================================================== */

  useEffect(() => {
    let isMounted = true;

    const loadSubject = async () => {
      if (!competitionId || !subjectId) {
        if (isMounted) {
          setIsLoadingSubject(false);
          setSubjectLoadError(
            "Competition ID or Subject ID is missing.",
          );
        }

        return;
      }

      try {
        setIsLoadingSubject(true);
        setSubjectLoadError("");

        const response =
          await getContestWithSubjectsById(
            competitionId,
          );

        const currentSubject =
          response.data?.subjects?.find(
            (item) => {
              if (
                typeof item.subjectId ===
                "object"
              ) {
                return (
                  item.subjectId?._id ===
                  subjectId
                );
              }

              return false;
            },
          );

        if (!currentSubject) {
          throw new Error(
            "The selected subject could not be found in this competition.",
          );
        }

        const name =
          typeof currentSubject.subjectId ===
          "object"
            ? currentSubject.subjectId.name
                ?.trim() ?? ""
            : "";

        if (!name) {
          throw new Error(
            "The selected subject does not have a valid API subject name.",
          );
        }

        if (isMounted) {
          setSubjectName(name);
        }
      } catch (error) {
        console.error(
          "Failed to load competition subject:",
          error,
        );

        if (isMounted) {
          setSubjectName("");

          setSubjectLoadError(
            error instanceof Error
              ? error.message
              : "Failed to load the competition subject.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingSubject(false);
        }
      }
    };

    loadSubject();

    return () => {
      isMounted = false;
    };
  }, [competitionId, subjectId]);

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

  const duplicateQuestion = (
    questionId: string,
  ) => {
    const sourceQuestion = questions.find(
      (question) =>
        question.id === questionId,
    );

    if (!sourceQuestion) {
      return;
    }

    const duplicatedQuestion: CompetitionQuestion =
      {
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

        explanationSteps: [
          ...sourceQuestion.explanationSteps,
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

  const removeQuestion = (
    questionId: string,
  ) => {
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

  const toggleQuestion = (
    questionId: string,
  ) => {
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
        if (
          question.id !== questionId
        ) {
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

  const addOption = (
    questionId: string,
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !== questionId
        ) {
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
        if (
          question.id !== questionId
        ) {
          return question;
        }

        if (
          question.options.length <= 2
        ) {
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
        if (
          question.id !== questionId
        ) {
          return question;
        }

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
        if (
          question.id !== questionId
        ) {
          return question;
        }

        return {
          ...question,

          questionType: type,

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

    if (!subjectName.trim()) {
      alert(
        "The subject information has not loaded correctly. Please refresh the page and try again.",
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

      if (
        question.questionType ===
          "multiple" &&
        question.correctAnswers.length <
          2
      ) {
        alert(
          `Question ${
            index + 1
          } is set to Multiple Answers. Please select at least two correct answers.`,
        );

        setExpandedQuestionId(
          question.id,
        );

        return false;
      }

      /*
       * Ensure the section can only contain a
       * backend-supported value.
       */
      const validSections: QuestionSection[] =
        [
          "objective",
          "essay",
          "comprehension",
          "oral",
        ];

      if (
        !validSections.includes(
          question.section,
        )
      ) {
        alert(
          `Question ${
            index + 1
          } has an invalid section.`,
        );

        setExpandedQuestionId(
          question.id,
        );

        return false;
      }

      /*
       * Ensure difficulty can only contain a
       * backend-supported value.
       */
      const validDifficulties: QuestionDifficulty[] =
        [
          "easy",
          "medium",
          "hard",
        ];

      if (
        !validDifficulties.includes(
          question.difficulty,
        )
      ) {
        alert(
          `Question ${
            index + 1
          } has an invalid difficulty.`,
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
   BUILD BACKEND PAYLOAD
========================================================== */

const buildPayload = () => {
  return {
    questions: questions.map((question, index) => {
      const options = question.options.map((option) => ({
        label: option.label,
        value: option.text.trim(),
      }));

      /*
       * The UI stores selected answers using the option's
       * internal ID.
       *
       * The backend expects correctAnswers to contain the
       * OPTION VALUE, not the option label.
       *
       * Example:
       * {
       *   label: "B",
       *   value: "Abuja"
       * }
       *
       * correctAnswers must therefore be:
       * ["Abuja"]
       */
      const correctAnswerValues = question.correctAnswers
        .map((answerId) => {
          const option = question.options.find(
            (item) => item.id === answerId,
          );

          return option?.text.trim() ?? "";
        })
        .filter(Boolean);

      /*
       * Backend answer field should use the same correct
       * answer value(s).
       */
      const answer = correctAnswerValues.join(",");

      const explanation = question.explanation.trim();

      const solution =
        question.solution.trim() || explanation;

      return {
        /*
         * IMPORTANT:
         * Order MUST be inside each question object.
         */
        order: index + 1,

        content: [],

        question: question.question.trim(),

        instruction: question.instruction.trim(),

        topic: question.topic.trim(),

        section: question.section,

        options,

        /*
         * IMPORTANT:
         * Send option VALUES here, not labels.
         */
        correctAnswers: correctAnswerValues,

        answer,

        solution,

        explanation,

        explanationSteps: question.explanationSteps,

        difficulty: question.difficulty,

        category: question.category.trim(),

        examType: question.examType.trim(),

        examYear: question.examYear.trim(),

        apiSubjectName: subjectName.trim(),

        isMultipleAnswer:
          question.questionType === "multiple",

        marks: Number(question.marks),
      };
    }),

    totalNumberOfExpectedQuestions: questions.length,
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
      const payload =
        buildPayload();

      console.log(
        "========== ADD QUESTIONS TO SUBJECT ==========",
      );

      console.log(
        "Competition ID:",
        competitionId,
      );

      console.log(
        "Subject ID:",
        subjectId,
      );

      console.log(
        "API Subject Name:",
        subjectName,
      );

      console.log(
        "Questions count:",
        questions.length,
      );

      console.log(
        "PATCH payload:",
        JSON.stringify(
          payload,
          null,
          2,
        ),
      );

      const response =
        await addQuestionsToSubjectInContest(
          competitionId,
          subjectId,
          payload,
        );

      console.log(
        "Add questions response:",
        response,
      );

      alert(
        `${questions.length} ${
          questions.length === 1
            ? "question"
            : "questions"
        } added successfully.`,
      );

      router.push(
        `/admin/secondary/solveandwin/competitions/${encodeURIComponent(
          competitionId,
        )}/subjects/${encodeURIComponent(
          subjectId,
        )}/questions`,
      );

      router.refresh();
    } catch (error: any) {
      console.error(
        "Failed to add competition questions:",
        error,
      );

      const message =
        Array.isArray(
          error?.response?.data?.message,
        )
          ? error.response.data.message.join(
              "\n",
            )
          : error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Failed to save questions. Please try again.";

      alert(message);
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
          href={`/admin/secondary/solveandwin/competitions/${encodeURIComponent(
            competitionId,
          )}/subjects/${encodeURIComponent(
            subjectId,
          )}/questions`}
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
                have its own answers, marks, difficulty
                and explanation.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                  Competition:{" "}
                  <span className="font-semibold text-slate-900">
                    {competitionId}
                  </span>
                </span>

                <span className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                  Subject:{" "}
                  <span className="font-semibold text-slate-900">
                    {isLoadingSubject
                      ? "Loading..."
                      : subjectName ||
                        subjectId}
                  </span>
                </span>
              </div>

              {subjectLoadError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {subjectLoadError}
                </div>
              )}
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
            (
              question,
              questionIndex,
            ) => {
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

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
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

                          {/* Instruction */}

                          <div>
                            <label
                              htmlFor={`instruction-${question.id}`}
                              className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              Instruction
                              <span className="ml-2 font-normal text-slate-400">
                                Optional
                              </span>
                            </label>

                            <Input
                              id={`instruction-${question.id}`}
                              value={
                                question.instruction
                              }
                              onChange={(
                                event,
                              ) =>
                                updateQuestion(
                                  question.id,
                                  {
                                    instruction:
                                      event
                                        .target
                                        .value,
                                  },
                                )
                              }
                              placeholder="e.g. Choose the correct answer."
                            />
                          </div>

                          {/* Topic / Section */}

                          <div className="grid gap-5 md:grid-cols-2">
                            <div>
                              <label
                                htmlFor={`topic-${question.id}`}
                                className="mb-2 block text-sm font-semibold text-slate-700"
                              >
                                Topic
                              </label>

                              <Input
                                id={`topic-${question.id}`}
                                value={
                                  question.topic
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateQuestion(
                                    question.id,
                                    {
                                      topic:
                                        event
                                          .target
                                          .value,
                                    },
                                  )
                                }
                                placeholder="Enter topic"
                              />
                            </div>

                            {/* SECTION */}

                            <div>
                              <label
                                htmlFor={`section-${question.id}`}
                                className="mb-2 block text-sm font-semibold text-slate-700"
                              >
                                Section
                              </label>

                              <select
                                id={`section-${question.id}`}
                                value={
                                  question.section
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateQuestion(
                                    question.id,
                                    {
                                      section:
                                        event
                                          .target
                                          .value as QuestionSection,
                                    },
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              >
                                <option value="objective">
                                  Objective
                                </option>

                                <option value="essay">
                                  Essay
                                </option>

                                <option value="comprehension">
                                  Comprehension
                                </option>

                                <option value="oral">
                                  Oral
                                </option>
                              </select>

                              <p className="mt-1.5 text-xs text-slate-400">
                                Select the section type
                                required by the backend.
                              </p>
                            </div>
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

                            {/* DIFFICULTY */}

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
                                          .value as QuestionDifficulty,
                                    },
                                  )
                                }
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              >
                                <option value="easy">
                                  Easy
                                </option>

                                <option value="medium">
                                  Medium
                                </option>

                                <option value="hard">
                                  Hard
                                </option>
                              </select>
                            </div>
                          </div>

                          {/* Category / Exam Type / Exam Year */}

                          <div className="grid gap-5 md:grid-cols-3">
                            <div>
                              <label
                                htmlFor={`category-${question.id}`}
                                className="mb-2 block text-sm font-semibold text-slate-700"
                              >
                                Category
                              </label>

                              <Input
                                id={`category-${question.id}`}
                                value={
                                  question.category
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateQuestion(
                                    question.id,
                                    {
                                      category:
                                        event
                                          .target
                                          .value,
                                    },
                                  )
                                }
                                placeholder="JAMB"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`examType-${question.id}`}
                                className="mb-2 block text-sm font-semibold text-slate-700"
                              >
                                Exam Type
                              </label>

                              <Input
                                id={`examType-${question.id}`}
                                value={
                                  question.examType
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateQuestion(
                                    question.id,
                                    {
                                      examType:
                                        event
                                          .target
                                          .value,
                                    },
                                  )
                                }
                                placeholder="JAMB"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`examYear-${question.id}`}
                                className="mb-2 block text-sm font-semibold text-slate-700"
                              >
                                Exam Year
                              </label>

                              <Input
                                id={`examYear-${question.id}`}
                                value={
                                  question.examYear
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateQuestion(
                                    question.id,
                                    {
                                      examYear:
                                        event
                                          .target
                                          .value,
                                    },
                                  )
                                }
                                placeholder="e.g. 2025"
                              />
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
                                : ""}.
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
                            Optionally attach an image URL.
                          </p>
                        </div>

                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                          <ImagePlus className="mx-auto h-10 w-10 text-slate-400" />

                          <h4 className="mt-3 font-semibold text-slate-900">
                            Add an image
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            Connect this field to your media
                            upload service when available.
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
                            Add the answer explanation and
                            solution.
                          </p>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <label
                              htmlFor={`solution-${question.id}`}
                              className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              Solution
                            </label>

                            <textarea
                              id={`solution-${question.id}`}
                              value={
                                question.solution
                              }
                              onChange={(
                                event,
                              ) =>
                                updateQuestion(
                                  question.id,
                                  {
                                    solution:
                                      event
                                        .target
                                        .value,
                                  },
                                )
                              }
                              placeholder="Enter the solution..."
                              rows={5}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`explanation-${question.id}`}
                              className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                              Explanation
                            </label>

                            <textarea
                              id={`explanation-${question.id}`}
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
                              placeholder="Enter the explanation..."
                              rows={6}
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                        </div>
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
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-6 text-sm font-bold text-blue-600 transition hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                These questions will be added to the selected
                competition subject.
              </p>

              {!isLoadingSubject &&
                subjectName && (
                  <p className="mt-2 text-xs font-medium text-blue-600">
                    Subject:{" "}
                    {subjectName}
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/admin/secondary/solveandwin/competitions/${encodeURIComponent(
                  competitionId,
                )}/subjects/${encodeURIComponent(
                  subjectId,
                )}/questions`}
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </Link>

              <Button
                onClick={handleSubmit}
                disabled={
                  isSaving ||
                  isLoadingSubject ||
                  !subjectName.trim()
                }
                leftIcon={
                  isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
                className="w-full sm:w-auto"
              >
                {isSaving
                  ? "Saving..."
                  : `Save ${questions.length} ${
                      questions.length ===
                      1
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