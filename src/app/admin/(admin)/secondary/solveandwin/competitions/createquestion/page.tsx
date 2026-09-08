


"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  FileText,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { getQuestionBanks } from "./questions";

import type {
  Difficulty,
  ExamType,
  QuestionBankItem,
  QuestionOption,
} from "./questions/types";

import { getSubjectsByPlan } from "@/lib/api/subjects";
import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   TYPES
============================================================ */

interface Subject {
  _id: string;
  name: string;
  slug?: string;
}

interface QuestionContent {
  type: "text";
  order: number;
  segments: {
    text: string;
    styles: string[];
  }[];
  latex?: string;
  table?: string[][];
  graph?: {
    type: string;
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
}

interface ExplanationStep {
  step: number;
  text: string;
}

interface QuestionForm {
  id: string;

  content: QuestionContent[];

  question: string;
  instruction: string;
  topic: string;
  section: string;

  difficulty: Difficulty;
  examType: ExamType;

  apiSubjectName: string;

  options: QuestionOption[];

  correctAnswers: string[];

  isMultipleAnswer: boolean;

  explanation: string;
  explanationSteps: ExplanationStep[];
}

/* ============================================================
   CONSTANTS
============================================================ */

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

const BATCH_SIZE = 50;

/* ============================================================
   HELPERS
============================================================ */

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

/**
 * Normalize difficulty values coming from the question bank.
 *
 * This protects the importer against values such as:
 * "Easy"
 * "EASY"
 * " medium "
 * "Moderate"
 * "Hard"
 */
function normalizeDifficulty(
  value: unknown,
): Difficulty {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (
    normalized === "medium" ||
    normalized === "moderate"
  ) {
    return "medium";
  }

  if (
    normalized === "hard" ||
    normalized === "very hard" ||
    normalized === "very-hard" ||
    normalized === "veryhard"
  ) {
    return "hard";
  }

  return "easy";
}

/**
 * Normalize exam type.
 */
function normalizeExamType(
  value: unknown,
): ExamType {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (normalized === "waec") {
    return "waec";
  }

  if (normalized === "neco") {
    return "neco";
  }

  return "jamb";
}

/**
 * Creates an empty question.
 */
function createEmptyQuestion(
  subjectName = "",
  examType: ExamType = "jamb",
  difficulty: Difficulty = "easy",
): QuestionForm {
  return {
    id: createId(),

    content: [],

    question: "",
    instruction: "Choose the correct answer.",
    topic: "",
    section: "objective",

    difficulty,
    examType,

    apiSubjectName: subjectName,

    options: [
      {
        label: "A",
        value: "",
      },
      {
        label: "B",
        value: "",
      },
      {
        label: "C",
        value: "",
      },
      {
        label: "D",
        value: "",
      },
    ],

    correctAnswers: [],

    isMultipleAnswer: false,

    explanation: "",
    explanationSteps: [],
  };
}

/**
 * Converts a static question-bank item
 * into the editable UI format.
 */
function questionBankItemToForm(
  item: QuestionBankItem,
  fallbackSubjectName: string,
  fallbackExamType: ExamType,
  fallbackDifficulty: Difficulty,
): QuestionForm {
  const difficulty =
    normalizeDifficulty(item.difficulty);

  const examType =
    normalizeExamType(item.examType);

  return {
    id: createId(),

    content: item.content ?? [],

    question: item.question ?? "",

    instruction:
      item.instruction ||
      "Choose the correct answer.",

    topic: item.topic ?? "",

    section:
      item.section || "objective",

    difficulty:
      difficulty || fallbackDifficulty,

    examType:
      examType || fallbackExamType,

    apiSubjectName:
      item.apiSubjectName?.trim() ||
      fallbackSubjectName,

    options: (item.options ?? []).map(
      (option) => ({
        label: option.label,
        value: option.value ?? "",
      }),
    ),

    correctAnswers: [
      ...(item.correctAnswers ?? []),
    ],

    isMultipleAnswer:
      Boolean(item.isMultipleAnswer),

    explanation:
      item.explanation ?? "",

    explanationSteps: (
      item.explanationSteps ?? []
    ).map((text, index) => ({
      step: index + 1,
      text,
    })),
  };
}

/**
 * Split an array into batches.
 */
function createBatches<T>(
  items: T[],
  batchSize: number,
): T[][] {
  const batches: T[][] = [];

  for (
    let i = 0;
    i < items.length;
    i += batchSize
  ) {
    batches.push(
      items.slice(i, i + batchSize),
    );
  }

  return batches;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function CreateSolveAndWinQuestionsPage() {
  /* ==========================================================
     SUBJECTS
  ========================================================== */

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [
    selectedSubjectId,
    setSelectedSubjectId,
  ] = useState("");

  /* ==========================================================
     FILTERS
  ========================================================== */

  const [
    selectedExamType,
    setSelectedExamType,
  ] = useState<ExamType>("jamb");

  const [
    selectedDifficulty,
    setSelectedDifficulty,
  ] = useState<Difficulty>("easy");

  /* ==========================================================
     QUESTIONS
  ========================================================== */

  const [questions, setQuestions] =
    useState<QuestionForm[]>([]);

  /* ==========================================================
     LOADING
  ========================================================== */

  const [
    loadingSubjects,
    setLoadingSubjects,
  ] = useState(true);

  const [
    loadingQuestionBank,
    setLoadingQuestionBank,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  /* ==========================================================
     UPLOAD PROGRESS
  ========================================================== */

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState({
    uploaded: 0,
    total: 0,
    currentBatch: 0,
    totalBatches: 0,
  });

  /* ==========================================================
     BANK COUNTS
  ========================================================== */

  const [
    bankCounts,
    setBankCounts,
  ] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });

  /* ==========================================================
     MESSAGES
  ========================================================== */

  const [pageError, setPageError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  /* ==========================================================
     SELECTED SUBJECT
  ========================================================== */

  const selectedSubject = useMemo(() => {
    return subjects.find(
      (subject) =>
        subject._id ===
        selectedSubjectId,
    );
  }, [
    subjects,
    selectedSubjectId,
  ]);

  /* ==========================================================
     LOAD SUBJECTS
  ========================================================== */

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoadingSubjects(true);
        setPageError("");

        const response =
          await getSubjectsByPlan(
            "SECONDARY",
            1,
            100,
          );

        const loadedSubjects: Subject[] =
          response?.data?.subjectObj ?? [];

        setSubjects(loadedSubjects);

        if (
          loadedSubjects.length > 0
        ) {
          setSelectedSubjectId(
            loadedSubjects[0]._id,
          );
        }
      } catch (error: any) {
        console.error(
          "Failed to load subjects:",
          error,
        );

        setPageError(
          error?.response?.data?.message ||
            "Unable to load subjects. Please try again.",
        );
      } finally {
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, []);

  /* ==========================================================
     LOAD QUESTION BANK COUNTS
  ========================================================== */

  function refreshBankCounts() {
    if (!selectedSubject) {
      setBankCounts({
        easy: 0,
        medium: 0,
        hard: 0,
      });

      return;
    }

    try {
      const banks = getQuestionBanks(
        selectedSubject.name,
        selectedExamType,
      );

      setBankCounts({
        easy: banks.easy.length,
        medium: banks.medium.length,
        hard: banks.hard.length,
      });
    } catch (error) {
      console.error(
        "Failed to read question bank counts:",
        error,
      );

      setBankCounts({
        easy: 0,
        medium: 0,
        hard: 0,
      });
    }
  }

  useEffect(() => {
    refreshBankCounts();

    /*
     * Changing the subject or exam type means
     * the currently loaded bank is no longer
     * valid.
     */
    setQuestions([]);
    setSuccessMessage("");
    setPageError("");
  }, [
    selectedSubjectId,
    selectedExamType,
  ]);

  /* ==========================================================
     LOAD QUESTION BANK
  ========================================================== */

  function loadSelectedQuestionBank() {
    if (!selectedSubject) {
      setPageError(
        "Please select a subject.",
      );

      return;
    }

    setLoadingQuestionBank(true);
    setPageError("");
    setSuccessMessage("");

    try {
      /*
       * IMPORTANT:
       *
       * Use getQuestionBanks(), NOT getQuestionBank().
       *
       * getQuestionBank() is the legacy/default
       * loader and currently points Biology/JAMB
       * to the Easy bank only.
       *
       * getQuestionBanks() gives us:
       *
       * easy
       * medium
       * hard
       */
      const banks = getQuestionBanks(
        selectedSubject.name,
        selectedExamType,
      );

      /*
       * Update the visible counts so the admin
       * can immediately see what exists.
       */
      setBankCounts({
        easy: banks.easy.length,
        medium: banks.medium.length,
        hard: banks.hard.length,
      });

      /*
       * Select the complete requested bank.
       *
       * There is intentionally NO:
       *
       * slice(0, 50)
       *
       * here.
       */
      const selectedBank =
        banks[selectedDifficulty];

      /*
       * Additional normalization/filtering.
       *
       * This protects the page if an imported
       * record has "Medium", "MEDIUM", etc.
       */
      const filteredBank =
        selectedBank.filter((item) => {
          return (
            normalizeDifficulty(
              item.difficulty,
            ) === selectedDifficulty &&
            normalizeExamType(
              item.examType,
            ) === selectedExamType
          );
        });

      if (
        filteredBank.length === 0
      ) {
        setQuestions([]);

        setPageError(
          `No ${selectedDifficulty} ${selectedExamType.toUpperCase()} questions were found for ${selectedSubject.name}. Available in this bank: Easy ${banks.easy.length}, Medium ${banks.medium.length}, Hard ${banks.hard.length}.`,
        );

        return;
      }

      /*
       * Convert ALL matching questions.
       */
      const loadedQuestions =
        filteredBank.map((item) =>
          questionBankItemToForm(
            item,
            selectedSubject.name,
            selectedExamType,
            selectedDifficulty,
          ),
        );

      setQuestions(
        loadedQuestions,
      );

      setSuccessMessage(
        `${loadedQuestions.length} ${selectedDifficulty} ${selectedSubject.name} ${selectedExamType.toUpperCase()} question${
          loadedQuestions.length === 1
            ? ""
            : "s"
        } loaded successfully. All matching questions are ready for review.`,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Failed to load question bank:",
        error,
      );

      setQuestions([]);

      setPageError(
        "Unable to load the selected question bank. Check the question-bank registry and imported files.",
      );
    } finally {
      setLoadingQuestionBank(false);
    }
  }

  /* ==========================================================
     SUBJECT CHANGE
  ========================================================== */

  function handleSubjectChange(
    subjectId: string,
  ) {
    if (saving) return;

    setSelectedSubjectId(
      subjectId,
    );

    setQuestions([]);

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     EXAM TYPE CHANGE
  ========================================================== */

  function handleExamTypeChange(
    examType: ExamType,
  ) {
    if (saving) return;

    setSelectedExamType(
      examType,
    );

    setQuestions([]);

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     DIFFICULTY CHANGE
  ========================================================== */

  function handleDifficultyChange(
    difficulty: Difficulty,
  ) {
    if (saving) return;

    setSelectedDifficulty(
      difficulty,
    );

    setQuestions([]);

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     QUESTION UPDATE
  ========================================================== */

  function updateQuestion(
    questionId: string,
    field: keyof QuestionForm,
    value: any,
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              [field]: value,
            }
          : question,
      ),
    );

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     OPTION UPDATE
  ========================================================== */

  function updateOption(
    questionId: string,
    optionIndex: number,
    value: string,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !==
          questionId
        ) {
          return question;
        }

        const oldValue =
          question.options[
            optionIndex
          ]?.value ?? "";

        const updatedOptions = [
          ...question.options,
        ];

        updatedOptions[
          optionIndex
        ] = {
          ...updatedOptions[
            optionIndex
          ],
          value,
        };

        const updatedCorrectAnswers =
          question.correctAnswers.map(
            (answer) =>
              answer === oldValue
                ? value
                : answer,
          );

        return {
          ...question,
          options:
            updatedOptions,
          correctAnswers:
            updatedCorrectAnswers,
        };
      }),
    );

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     ADD OPTION
  ========================================================== */

  function addOption(
    questionId: string,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !==
          questionId
        ) {
          return question;
        }

        if (
          question.options.length >=
          OPTION_LABELS.length
        ) {
          return question;
        }

        const label =
          OPTION_LABELS[
            question.options.length
          ];

        return {
          ...question,
          options: [
            ...question.options,
            {
              label,
              value: "",
            },
          ],
        };
      }),
    );
  }

  /* ==========================================================
     REMOVE OPTION
  ========================================================== */

  function removeOption(
    questionId: string,
    optionIndex: number,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !==
          questionId
        ) {
          return question;
        }

        if (
          question.options.length <=
          2
        ) {
          return question;
        }

        const removedOption =
          question.options[
            optionIndex
          ];

        const updatedOptions =
          question.options
            .filter(
              (_, index) =>
                index !==
                optionIndex,
            )
            .map(
              (
                option,
                index,
              ) => ({
                ...option,
                label:
                  OPTION_LABELS[
                    index
                  ],
              }),
            );

        const updatedCorrectAnswers =
          question.correctAnswers.filter(
            (answer) =>
              answer !==
              removedOption?.value,
          );

        return {
          ...question,
          options:
            updatedOptions,
          correctAnswers:
            updatedCorrectAnswers,
        };
      }),
    );
  }

  /* ==========================================================
     CORRECT ANSWER
  ========================================================== */

  function toggleCorrectAnswer(
    questionId: string,
    optionValue: string,
  ) {
    if (!optionValue.trim()) {
      return;
    }

    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !==
          questionId
        ) {
          return question;
        }

        if (
          question.isMultipleAnswer
        ) {
          const exists =
            question.correctAnswers.includes(
              optionValue,
            );

          return {
            ...question,
            correctAnswers:
              exists
                ? question.correctAnswers.filter(
                    (answer) =>
                      answer !==
                      optionValue,
                  )
                : [
                    ...question.correctAnswers,
                    optionValue,
                  ],
          };
        }

        return {
          ...question,
          correctAnswers: [
            optionValue,
          ],
        };
      }),
    );

    setSuccessMessage("");
  }

  /* ==========================================================
     MULTIPLE ANSWERS
  ========================================================== */

  function toggleMultipleAnswers(
    questionId: string,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !==
          questionId
        ) {
          return question;
        }

        const enableMultiple =
          !question.isMultipleAnswer;

        return {
          ...question,
          isMultipleAnswer:
            enableMultiple,

          correctAnswers:
            enableMultiple
              ? question.correctAnswers
              : question.correctAnswers.slice(
                  0,
                  1,
                ),
        };
      }),
    );
  }

  /* ==========================================================
     EXPLANATION STEPS
  ========================================================== */

  function addExplanationStep(
    questionId: string,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !==
          questionId
        ) {
          return question;
        }

        return {
          ...question,
          explanationSteps: [
            ...question.explanationSteps,
            {
              step:
                question
                  .explanationSteps
                  .length + 1,
              text: "",
            },
          ],
        };
      }),
    );
  }

  function updateExplanationStep(
    questionId: string,
    stepIndex: number,
    value: string,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !==
          questionId
        ) {
          return question;
        }

        const updatedSteps = [
          ...question.explanationSteps,
        ];

        updatedSteps[
          stepIndex
        ] = {
          ...updatedSteps[
            stepIndex
          ],
          text: value,
        };

        return {
          ...question,
          explanationSteps:
            updatedSteps,
        };
      }),
    );
  }

  function removeExplanationStep(
    questionId: string,
    stepIndex: number,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !==
          questionId
        ) {
          return question;
        }

        return {
          ...question,
          explanationSteps:
            question.explanationSteps
              .filter(
                (_, index) =>
                  index !==
                  stepIndex,
              )
              .map(
                (
                  step,
                  index,
                ) => ({
                  ...step,
                  step:
                    index + 1,
                }),
              ),
        };
      }),
    );
  }

  /* ==========================================================
     ADD QUESTION
  ========================================================== */

  function addQuestion() {
    setQuestions((current) => [
      ...current,
      createEmptyQuestion(
        selectedSubject?.name ??
          "",
        selectedExamType,
        selectedDifficulty,
      ),
    ]);

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     DUPLICATE QUESTION
  ========================================================== */

  function duplicateQuestion(
    questionId: string,
  ) {
    setQuestions((current) => {
      const question =
        current.find(
          (item) =>
            item.id ===
            questionId,
        );

      if (!question) {
        return current;
      }

      const duplicated: QuestionForm =
        {
          ...question,

          id: createId(),

          content:
            question.content.map(
              (content) => ({
                ...content,

                segments:
                  content.segments.map(
                    (
                      segment,
                    ) => ({
                      ...segment,
                      styles: [
                        ...segment.styles,
                      ],
                    }),
                  ),

                table:
                  content.table?.map(
                    (row) => [
                      ...row,
                    ],
                  ),

                graph:
                  content.graph
                    ? {
                        ...content.graph,

                        labels: [
                          ...content
                            .graph
                            .labels,
                        ],

                        datasets:
                          content.graph.datasets.map(
                            (
                              dataset,
                            ) => ({
                              ...dataset,

                              data: [
                                ...dataset.data,
                              ],
                            }),
                          ),
                      }
                    : undefined,
              }),
            ),

          options:
            question.options.map(
              (option) => ({
                ...option,
              }),
            ),

          correctAnswers: [
            ...question.correctAnswers,
          ],

          explanationSteps:
            question.explanationSteps.map(
              (step) => ({
                ...step,
              }),
            ),
        };

      const index =
        current.findIndex(
          (item) =>
            item.id ===
            questionId,
        );

      const updated = [
        ...current,
      ];

      updated.splice(
        index + 1,
        0,
        duplicated,
      );

      return updated;
    });

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     REMOVE QUESTION
  ========================================================== */

  function removeQuestion(
    questionId: string,
  ) {
    setQuestions((current) =>
      current.filter(
        (question) =>
          question.id !==
          questionId,
      ),
    );

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  function validateQuestions() {
    if (!selectedSubjectId) {
      return "Please select a subject.";
    }

    if (
      questions.length === 0
    ) {
      return "Please load a question bank or add at least one question.";
    }

    for (
      let index = 0;
      index < questions.length;
      index++
    ) {
      const question =
        questions[index];

      const number =
        index + 1;

      if (
        !question.question.trim()
      ) {
        return `Question ${number}: question text is required.`;
      }

      if (
        !question.instruction.trim()
      ) {
        return `Question ${number}: instruction is required.`;
      }

      if (
        !question.topic.trim()
      ) {
        return `Question ${number}: topic is required.`;
      }

      if (
        !question.apiSubjectName.trim()
      ) {
        return `Question ${number}: subject name is required.`;
      }

      const validOptions =
        question.options.filter(
          (option) =>
            option.value.trim(),
        );

      if (
        validOptions.length < 2
      ) {
        return `Question ${number}: at least two options are required.`;
      }

      if (
        question.correctAnswers
          .length === 0
      ) {
        return `Question ${number}: select at least one correct answer.`;
      }

      const validOptionValues =
        validOptions.map(
          (option) =>
            option.value.trim(),
        );

      const invalidCorrectAnswer =
        question.correctAnswers.some(
          (answer) =>
            !validOptionValues.includes(
              answer.trim(),
            ),
        );

      if (
        invalidCorrectAnswer
      ) {
        return `Question ${number}: every correct answer must match an option.`;
      }

      if (
        !question.isMultipleAnswer &&
        question.correctAnswers
          .length > 1
      ) {
        return `Question ${number}: only one correct answer is allowed.`;
      }
    }

    return null;
  }

  /* ==========================================================
     PAYLOAD
  ========================================================== */

  function convertQuestionToPayload(
    question: QuestionForm,
  ) {
    const validOptions =
      question.options
        .filter(
          (option) =>
            option.value.trim(),
        )
        .map((option) => ({
          label: option.label,
          value: option.value.trim(),
        }));

    return {
      content:
        question.content,

      question:
        question.question.trim(),

      instruction:
        question.instruction.trim(),

      topic:
        question.topic.trim(),

      section:
        question.section.trim(),

      options:
        validOptions,

      correctAnswers:
        question.correctAnswers.map(
          (answer) =>
            answer.trim(),
        ),

      explanation:
        question.explanation.trim(),

      explanationSteps:
        question.explanationSteps
          .filter(
            (step) =>
              step.text.trim(),
          )
          .map(
            (step) =>
              step.text.trim(),
          ),

      difficulty:
        normalizeDifficulty(
          question.difficulty,
        ),

      examType:
        normalizeExamType(
          question.examType,
        ),

      apiSubjectName:
        question.apiSubjectName.trim(),

      isMultipleAnswer:
        question.isMultipleAnswer,
    };
  }

  /* ==========================================================
     SUBMIT / BATCH UPLOAD
  ========================================================== */

  async function handleSubmit() {
    setPageError("");
    setSuccessMessage("");

    const validationError =
      validateQuestions();

    if (validationError) {
      setPageError(
        validationError,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!selectedSubjectId) {
      return;
    }

    const payloadQuestions =
      questions.map(
        convertQuestionToPayload,
      );

    const batches =
      createBatches(
        payloadQuestions,
        BATCH_SIZE,
      );

    try {
      setSaving(true);

      setUploadProgress({
        uploaded: 0,
        total:
          payloadQuestions.length,
        currentBatch: 0,
        totalBatches:
          batches.length,
      });

      console.log(
        "Starting Solve & Win question upload:",
        {
          totalQuestions:
            payloadQuestions.length,

          batchSize:
            BATCH_SIZE,

          totalBatches:
            batches.length,

          selectedSubjectId,

          selectedSubject:
            selectedSubject?.name,

          selectedExamType,

          selectedDifficulty,
        },
      );

      let uploadedCount = 0;

      /*
       * Sequential upload.
       *
       * Each request contains at most
       * 50 questions.
       */
      for (
        let batchIndex = 0;
        batchIndex <
        batches.length;
        batchIndex++
      ) {
        const batch =
          batches[batchIndex];

        const batchNumber =
          batchIndex + 1;

        setUploadProgress({
          uploaded:
            uploadedCount,

          total:
            payloadQuestions.length,

          currentBatch:
            batchNumber,

          totalBatches:
            batches.length,
        });

        console.log(
          `Uploading batch ${batchNumber}/${batches.length} containing ${batch.length} questions.`,
        );

        try {
          const response =
            await axiosInstance.patch(
              `/solve-and-win/contests/add-solve-and-win-contest-questions-to-database/${encodeURIComponent(
                selectedSubjectId,
              )}`,
              {
                questions: batch,
              },
            );

          console.log(
            `Batch ${batchNumber} uploaded successfully:`,
            response.data,
          );

          uploadedCount +=
            batch.length;

          setUploadProgress({
            uploaded:
              uploadedCount,

            total:
              payloadQuestions.length,

            currentBatch:
              batchNumber,

            totalBatches:
              batches.length,
          });
        } catch (batchError: any) {
          console.error(
            `Batch ${batchNumber} failed:`,
            batchError,
          );

          const responseData =
            batchError?.response
              ?.data;

          const message =
            responseData?.message ||
            responseData?.error ||
            `Batch ${batchNumber} failed while uploading.`;

          const readableMessage =
            Array.isArray(message)
              ? message.join(
                  ", ",
                )
              : String(message);

          throw new Error(
            `Upload stopped at Batch ${batchNumber} of ${batches.length}. ${uploadedCount} of ${payloadQuestions.length} questions were successfully uploaded. ${readableMessage}`,
          );
        }
      }

      /* ======================================================
         SUCCESS
      ====================================================== */

      setSuccessMessage(
        `All ${uploadedCount} question${
          uploadedCount === 1
            ? ""
            : "s"
        } saved successfully in ${batches.length} batch${
          batches.length === 1
            ? ""
            : "es"
        }.`,
      );

      setUploadProgress({
        uploaded:
          uploadedCount,

        total:
          payloadQuestions.length,

        currentBatch:
          batches.length,

        totalBatches:
          batches.length,
      });

      /*
       * Clear the loaded questions after
       * successful upload.
       */
      setQuestions([]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      console.error(
        "Failed to save Solve & Win questions:",
        error,
      );

      setPageError(
        error?.message ||
          "Unable to save questions. Please try again.",
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     PAYLOAD PREVIEW
  ========================================================== */

  const payloadPreview =
    useMemo(() => {
      return {
        questions:
          questions.map(
            convertQuestionToPayload,
          ),
      };
    }, [questions]);

  /* ==========================================================
     UPLOAD CALCULATIONS
  ========================================================== */

  const totalQuestions =
    questions.length;

  const totalBatches =
    totalQuestions > 0
      ? Math.ceil(
          totalQuestions /
            BATCH_SIZE,
        )
      : 0;

  const progressPercentage =
    uploadProgress.total >
    0
      ? Math.round(
          (uploadProgress.uploaded /
            uploadProgress.total) *
            100,
        )
      : 0;

  const selectedDifficultyCount =
    bankCounts[selectedDifficulty];

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">
          <Link
            href="/admin/secondary/solveandwin/competitions"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Upload className="h-5 w-5 text-white" />
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300">
                  Solve & Win
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Import Questions
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Select a subject, exam type,
                and difficulty to load the
                complete matching question
                bank. Review or edit the
                questions, then upload them
                to the Solve & Win database.
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              disabled={
                loadingSubjects ||
                saving
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>
        </div>

        {/* ====================================================
            ALERTS
        ==================================================== */}

        {pageError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
            <X className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">
                Upload / Import Error
              </p>

              <p className="mt-1 text-red-200/80">
                {pageError}
              </p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <Check className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">
                Import Successful
              </p>

              <p className="mt-1 text-emerald-200/80">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* ====================================================
            UPLOAD PROGRESS
        ==================================================== */}

        {saving && (
          <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>

                  <div>
                    <h2 className="font-black">
                      Uploading Questions
                    </h2>

                    <p className="text-xs text-slate-500">
                      Please keep this page open
                      until the upload is complete.
                    </p>
                  </div>
                </div>
              </div>

              <span className="text-2xl font-black">
                {progressPercentage}%
              </span>
            </div>

            <div className="mb-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white transition-all duration-300"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-500">
                  Questions Uploaded
                </p>

                <p className="mt-1 text-lg font-black">
                  {
                    uploadProgress.uploaded
                  }{" "}
                  /{" "}
                  {
                    uploadProgress.total
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-500">
                  Current Batch
                </p>

                <p className="mt-1 text-lg font-black">
                  {
                    uploadProgress.currentBatch
                  }{" "}
                  /{" "}
                  {
                    uploadProgress.totalBatches
                  }
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-slate-500">
                  Batch Size
                </p>

                <p className="mt-1 text-lg font-black">
                  Max {BATCH_SIZE}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            QUESTION BANK FILTER
        ==================================================== */}

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-black">
                Question Bank
              </h2>

              <p className="text-xs text-slate-400">
                Choose the source of the
                questions you want to import.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {/* SUBJECT */}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Subject
              </label>

              <div className="relative">
                <select
                  value={
                    selectedSubjectId
                  }
                  onChange={(event) =>
                    handleSubjectChange(
                      event.target.value,
                    )
                  }
                  disabled={
                    loadingSubjects ||
                    saving
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingSubjects ? (
                    <option value="">
                      Loading subjects...
                    </option>
                  ) : subjects.length ===
                    0 ? (
                    <option value="">
                      No subjects found
                    </option>
                  ) : (
                    <>
                      <option value="">
                        Select a subject
                      </option>

                      {subjects.map(
                        (subject) => (
                          <option
                            key={
                              subject._id
                            }
                            value={
                              subject._id
                            }
                          >
                            {subject.name}
                          </option>
                        ),
                      )}
                    </>
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* EXAM TYPE */}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Exam Type
              </label>

              <div className="relative">
                <select
                  value={
                    selectedExamType
                  }
                  onChange={(event) =>
                    handleExamTypeChange(
                      event.target
                        .value as ExamType,
                    )
                  }
                  disabled={saving}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="jamb">
                    JAMB
                  </option>

                  <option value="waec">
                    WAEC
                  </option>

                  <option value="neco">
                    NECO
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* DIFFICULTY */}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Difficulty
              </label>

              <div className="relative">
                <select
                  value={
                    selectedDifficulty
                  }
                  onChange={(event) =>
                    handleDifficultyChange(
                      event.target
                        .value as Difficulty,
                    )
                  }
                  disabled={saving}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
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

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* ==================================================
              AVAILABLE BANK COUNTS
          ================================================== */}

          {selectedSubject && (
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div
                className={`rounded-2xl border p-4 transition ${
                  selectedDifficulty ===
                  "easy"
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Easy
                  </p>

                  <span className="text-lg font-black">
                    {bankCounts.easy}
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-slate-600">
                  Available questions
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 transition ${
                  selectedDifficulty ===
                  "medium"
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Medium
                  </p>

                  <span className="text-lg font-black">
                    {bankCounts.medium}
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-slate-600">
                  Available questions
                </p>
              </div>

              <div
                className={`rounded-2xl border p-4 transition ${
                  selectedDifficulty ===
                  "hard"
                    ? "border-white/30 bg-white/10"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Hard
                  </p>

                  <span className="text-lg font-black">
                    {bankCounts.hard}
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-slate-600">
                  Available questions
                </p>
              </div>
            </div>
          )}

          {/* ==================================================
              CURRENT FILTER
          ================================================== */}

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Import Selection
                </p>

                <p className="mt-1 text-sm font-black">
                  {selectedSubject
                    ? selectedSubject.name
                    : "No subject selected"}{" "}
                  •{" "}
                  {selectedExamType.toUpperCase()}{" "}
                  •{" "}
                  {selectedDifficulty
                    .charAt(0)
                    .toUpperCase() +
                    selectedDifficulty.slice(
                      1,
                    )}
                </p>

                {selectedSubject && (
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedDifficultyCount}{" "}
                    matching question
                    {selectedDifficultyCount ===
                    1
                      ? ""
                      : "s"}{" "}
                    available
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={
                  loadSelectedQuestionBank
                }
                disabled={
                  loadingSubjects ||
                  loadingQuestionBank ||
                  saving ||
                  !selectedSubjectId
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingQuestionBank ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading All Questions...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Load Question Bank
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

              <div>
                <p className="text-xs leading-5 text-slate-500">
                  The selected difficulty
                  determines which static
                  question bank is loaded. The
                  complete matching bank is loaded
                  into this editor.
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  The maximum of{" "}
                  {BATCH_SIZE} questions applies
                  only to each backend upload
                  request.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            LOADED BANK SUMMARY
        ==================================================== */}

        {questions.length > 0 && (
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Check className="h-5 w-5 text-emerald-300" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Question Bank Loaded
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      {questions.length}{" "}
                      Questions
                    </h2>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  All loaded questions can be
                  reviewed and edited before
                  saving to the database.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-xs text-slate-500">
                    Questions
                  </p>

                  <p className="mt-1 text-lg font-black">
                    {totalQuestions}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-xs text-slate-500">
                    Batch Size
                  </p>

                  <p className="mt-1 text-lg font-black">
                    {BATCH_SIZE}
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:col-span-1">
                  <p className="text-xs text-slate-500">
                    Upload Batches
                  </p>

                  <p className="mt-1 text-lg font-black">
                    {totalBatches}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            QUESTIONS
        ==================================================== */}

        <div className="space-y-8">
          {questions.map(
            (
              question,
              questionIndex,
            ) => (
              <div
                key={question.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl"
              >
                {/* QUESTION HEADER */}

                <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                      {questionIndex +
                        1}
                    </span>

                    <div>
                      <h2 className="font-black">
                        Question{" "}
                        {questionIndex +
                          1}
                      </h2>

                      <p className="text-xs text-slate-500">
                        {question.apiSubjectName ||
                          "No subject selected"}{" "}
                        •{" "}
                        {question.examType.toUpperCase()}{" "}
                        •{" "}
                        {question.difficulty
                          .charAt(0)
                          .toUpperCase() +
                          question.difficulty.slice(
                            1,
                          )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        duplicateQuestion(
                          question.id,
                        )
                      }
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeQuestion(
                          question.id,
                        )
                      }
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-500/5 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="space-y-7 p-5 sm:p-6">

                  {/* QUESTION */}

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Question
                    </label>

                    <textarea
                      value={
                        question.question
                      }
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          "question",
                          event.target
                            .value,
                        )
                      }
                      rows={5}
                      placeholder="Enter the question..."
                      className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                    />
                  </div>

                  {/* BASIC DETAILS */}

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Instruction
                      </label>

                      <input
                        value={
                          question.instruction
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "instruction",
                            event.target
                              .value,
                          )
                        }
                        placeholder="Choose the correct answer."
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Topic
                      </label>

                      <input
                        value={
                          question.topic
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "topic",
                            event.target
                              .value,
                          )
                        }
                        placeholder="e.g. Cell Biology"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                      />
                    </div>
                  </div>

                  {/* META */}

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Difficulty
                      </label>

                      <select
                        value={
                          question.difficulty
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "difficulty",
                            event.target
                              .value as Difficulty,
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
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

                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Exam Type
                      </label>

                      <select
                        value={
                          question.examType
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "examType",
                            event.target
                              .value as ExamType,
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                      >
                        <option value="jamb">
                          JAMB
                        </option>

                        <option value="waec">
                          WAEC
                        </option>

                        <option value="neco">
                          NECO
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Section
                      </label>

                      <input
                        value={
                          question.section
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "section",
                            event.target
                              .value,
                          )
                        }
                        placeholder="objective"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                      />
                    </div>
                  </div>

                  {/* OPTIONS */}

                  <div>
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-black">
                          Answer Options
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Click an option letter
                          to mark it as correct.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addOption(
                            question.id,
                          )
                        }
                        disabled={
                          question.options
                            .length >=
                          OPTION_LABELS.length
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                        Add Option
                      </button>
                    </div>

                    <div className="space-y-3">
                      {question.options.map(
                        (
                          option,
                          optionIndex,
                        ) => {
                          const isCorrect =
                            question.correctAnswers.includes(
                              option.value,
                            );

                          return (
                            <div
                              key={`${question.id}-${option.label}`}
                              className={`flex gap-3 rounded-2xl border p-3 transition ${
                                isCorrect
                                  ? "border-emerald-400/40 bg-emerald-500/5"
                                  : "border-white/10 bg-slate-900"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  toggleCorrectAnswer(
                                    question.id,
                                    option.value,
                                  )
                                }
                                disabled={
                                  !option.value.trim()
                                }
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black transition ${
                                  isCorrect
                                    ? "bg-emerald-500 text-white"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="h-5 w-5" />
                                ) : (
                                  option.label
                                )}
                              </button>

                              <input
                                value={
                                  option.value
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateOption(
                                    question.id,
                                    optionIndex,
                                    event.target
                                      .value,
                                  )
                                }
                                placeholder={`Option ${option.label}`}
                                className="min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-slate-600"
                              />

                              {question
                                .options
                                .length >
                                2 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeOption(
                                      question.id,
                                      optionIndex,
                                    )
                                  }
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>

                    <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <input
                        type="checkbox"
                        checked={
                          question.isMultipleAnswer
                        }
                        onChange={() =>
                          toggleMultipleAnswers(
                            question.id,
                          )
                        }
                        className="h-4 w-4 rounded border-white/20"
                      />

                      <div>
                        <p className="text-sm font-bold">
                          Allow multiple correct answers
                        </p>

                        <p className="text-xs text-slate-500">
                          Enable this only when more
                          than one option should be
                          correct.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* EXPLANATION */}

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Explanation
                    </label>

                    <textarea
                      value={
                        question.explanation
                      }
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          "explanation",
                          event.target
                            .value,
                        )
                      }
                      rows={4}
                      placeholder="Explain why the correct answer is correct..."
                      className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                    />

                    <div className="mt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold">
                            Explanation Steps
                          </p>

                          <p className="text-xs text-slate-500">
                            Optional step-by-step explanation.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addExplanationStep(
                              question.id,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          <Plus className="h-4 w-4" />
                          Add Step
                        </button>
                      </div>

                      {question
                        .explanationSteps
                        .length > 0 && (
                        <div className="space-y-3">
                          {question.explanationSteps.map(
                            (
                              step,
                              stepIndex,
                            ) => (
                              <div
                                key={`${question.id}-step-${stepIndex}`}
                                className="flex gap-3"
                              >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-black text-slate-400">
                                  {stepIndex +
                                    1}
                                </div>

                                <input
                                  value={
                                    step.text
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateExplanationStep(
                                      question.id,
                                      stepIndex,
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  placeholder={`Explanation step ${
                                    stepIndex +
                                    1
                                  }`}
                                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeExplanationStep(
                                      question.id,
                                      stepIndex,
                                    )
                                  }
                                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {questions.length === 0 &&
          !loadingQuestionBank && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                <BookOpen className="h-6 w-6 text-slate-500" />
              </div>

              <h2 className="mt-4 text-lg font-black">
                No Questions Loaded
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Select your subject, exam type,
                and difficulty above, then load
                the complete matching question
                bank.
              </p>

              <button
                type="button"
                onClick={addQuestion}
                disabled={
                  saving ||
                  loadingSubjects
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add Question Manually
              </button>
            </div>
          )}

        {/* ====================================================
            PAYLOAD PREVIEW
        ==================================================== */}

        {questions.length > 0 && (
          <details className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
            <summary className="cursor-pointer select-none px-5 py-4 text-sm font-bold text-slate-300 hover:text-white">
              Preview API Payload
            </summary>

            <div className="border-t border-white/10 px-5 py-3 text-xs text-slate-500">
              The preview below represents the
              complete set of questions that will
              be uploaded. During saving, the
              questions are automatically split
              into batches of{" "}
              {BATCH_SIZE}.
            </div>

            <pre className="max-h-[500px] overflow-auto border-t border-white/10 p-5 text-xs leading-6 text-slate-400">
              {JSON.stringify(
                payloadPreview,
                null,
                2,
              )}
            </pre>
          </details>
        )}

        {/* ====================================================
            BOTTOM ACTIONS
        ==================================================== */}

        <div className="sticky bottom-4 z-20 mt-8">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="px-2">
              {questions.length > 0 ? (
                <>
                  <p className="text-xs font-bold text-slate-300">
                    {questions.length} question
                    {questions.length ===
                    1
                      ? ""
                      : "s"}{" "}
                    ready to save
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    Will upload in{" "}
                    {totalBatches} batch
                    {totalBatches === 1
                      ? ""
                      : "es"}{" "}
                    of max {BATCH_SIZE}.
                  </p>
                </>
              ) : (
                <p className="text-xs text-slate-500">
                  Load a question bank to
                  begin importing.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={addQuestion}
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 disabled:opacity-50 sm:flex-none"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  saving ||
                  loadingSubjects ||
                  !selectedSubjectId ||
                  questions.length ===
                    0
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading{" "}
                    {
                      uploadProgress.uploaded
                    }
                    /
                    {
                      uploadProgress.total
                    }
                    ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Questions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}























// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   BookOpen,
//   Check,
//   ChevronDown,
//   Copy,
//   FileText,
//   Loader2,
//   Plus,
//   Save,
//   Trash2,
//   X,
// } from "lucide-react";

// import { getQuestionBank } from "./questions";
// import type {
//   Difficulty,
//   ExamType,
//   QuestionBankItem,
//   QuestionOption,
// } from "./questions/types";

// import { getSubjectsByPlan } from "@/lib/api/subjects";
// import { axiosInstance } from "@/lib/api/axios";

// /* ============================================================
//    TYPES
// ============================================================ */

// interface Subject {
//   _id: string;
//   name: string;
//   slug?: string;
// }

// interface QuestionContent {
//   type: "text";
//   order: number;
//   segments: {
//     text: string;
//     styles: string[];
//   }[];
//   latex?: string;
//   table?: string[][];
//   graph?: {
//     type: string;
//     labels: string[];
//     datasets: {
//       label: string;
//       data: number[];
//     }[];
//   };
// }

// interface ExplanationStep {
//   step: number;
//   text: string;
// }

// interface QuestionForm {
//   id: string;

//   content: QuestionContent[];

//   question: string;
//   instruction: string;
//   topic: string;
//   section: string;

//   difficulty: Difficulty;
//   examType: ExamType;

//   apiSubjectName: string;

//   options: QuestionOption[];

//   correctAnswers: string[];

//   isMultipleAnswer: boolean;

//   explanation: string;
//   explanationSteps: ExplanationStep[];
// }

// /* ============================================================
//    HELPERS
// ============================================================ */

// const OPTION_LABELS = ["A", "B", "C", "D", "E"];

// function createId() {
//   return `${Date.now()}-${Math.random()
//     .toString(36)
//     .slice(2, 9)}`;
// }

// /**
//  * Creates an empty question.
//  */
// function createEmptyQuestion(
//   subjectName = "",
//   examType: ExamType = "jamb",
// ): QuestionForm {
//   return {
//     id: createId(),

//     content: [],

//     question: "",
//     instruction: "Choose the correct answer.",
//     topic: "",
//     section: "objective",

//     difficulty: "easy",
//     examType,

//     apiSubjectName: subjectName,

//     options: [
//       {
//         label: "A",
//         value: "",
//       },
//       {
//         label: "B",
//         value: "",
//       },
//       {
//         label: "C",
//         value: "",
//       },
//       {
//         label: "D",
//         value: "",
//       },
//     ],

//     correctAnswers: [],

//     isMultipleAnswer: false,

//     explanation: "",
//     explanationSteps: [],
//   };
// }

// /**
//  * Converts a question from the static question-bank file
//  * into the editable UI format.
//  */
// function questionBankItemToForm(
//   item: QuestionBankItem,
// ): QuestionForm {
//   return {
//     id: createId(),

//     content: item.content ?? [],

//     question: item.question ?? "",
//     instruction:
//       item.instruction || "Choose the correct answer.",
//     topic: item.topic ?? "",
//     section: item.section || "objective",

//     difficulty: item.difficulty,
//     examType: item.examType,

//     apiSubjectName: item.apiSubjectName ?? "",

//     options: item.options.map((option) => ({
//       label: option.label,
//       value: option.value,
//     })),

//     correctAnswers: [...item.correctAnswers],

//     isMultipleAnswer: item.isMultipleAnswer,

//     explanation: item.explanation ?? "",

//     explanationSteps: (
//       item.explanationSteps ?? []
//     ).map((text, index) => ({
//       step: index + 1,
//       text,
//     })),
//   };
// }

// /* ============================================================
//    COMPONENT
// ============================================================ */

// export default function CreateSolveAndWinQuestionsPage() {
//   const [subjects, setSubjects] = useState<Subject[]>([]);

//   const [selectedSubjectId, setSelectedSubjectId] =
//     useState("");

//   const [selectedExamType, setSelectedExamType] =
//     useState<ExamType>("jamb");

//   const [questions, setQuestions] = useState<
//     QuestionForm[]
//   >([createEmptyQuestion("", "jamb")]);

//   const [loadingSubjects, setLoadingSubjects] =
//     useState(true);

//   const [loadingQuestionBank, setLoadingQuestionBank] =
//     useState(false);

//   const [saving, setSaving] = useState(false);

//   const [pageError, setPageError] = useState("");

//   const [successMessage, setSuccessMessage] =
//     useState("");

//   /* ==========================================================
//      SELECTED SUBJECT
//   ========================================================== */

//   const selectedSubject = useMemo(() => {
//     return subjects.find(
//       (subject) =>
//         subject._id === selectedSubjectId,
//     );
//   }, [subjects, selectedSubjectId]);

//   /* ==========================================================
//      LOAD SUBJECTS
//   ========================================================== */

//   useEffect(() => {
//     async function loadSubjects() {
//       try {
//         setLoadingSubjects(true);
//         setPageError("");

//         const response = await getSubjectsByPlan(
//           "SECONDARY",
//           1,
//           100,
//         );

//         const loadedSubjects: Subject[] =
//           response?.data?.subjectObj ?? [];

//         setSubjects(loadedSubjects);

//         if (loadedSubjects.length > 0) {
//           const firstSubject =
//             loadedSubjects[0];

//           setSelectedSubjectId(
//             firstSubject._id,
//           );

//           setQuestions([
//             createEmptyQuestion(
//               firstSubject.name,
//               "jamb",
//             ),
//           ]);
//         }
//       } catch (error: any) {
//         console.error(
//           "Failed to load subjects:",
//           error,
//         );

//         setPageError(
//           error?.response?.data?.message ||
//             "Unable to load subjects. Please try again.",
//         );
//       } finally {
//         setLoadingSubjects(false);
//       }
//     }

//     loadSubjects();
//   }, []);

//   /* ==========================================================
//      LOAD QUESTION BANK
//   ========================================================== */

//   function loadSelectedQuestionBank() {
//     if (!selectedSubject) {
//       setPageError("Please select a subject.");
//       return;
//     }

//     setLoadingQuestionBank(true);
//     setPageError("");
//     setSuccessMessage("");

//     try {
//       const bank = getQuestionBank(
//         selectedSubject.name,
//         selectedExamType,
//       );

//       if (!bank.length) {
//         setQuestions([
//           createEmptyQuestion(
//             selectedSubject.name,
//             selectedExamType,
//           ),
//         ]);

//         setPageError(
//           `No ${selectedExamType.toUpperCase()} question bank is available yet for ${selectedSubject.name}.`,
//         );

//         return;
//       }

//       const loadedQuestions =
//         bank.map(questionBankItemToForm);

//       setQuestions(loadedQuestions);

//       setSuccessMessage(
//         `${loadedQuestions.length} ${selectedSubject.name} ${selectedExamType.toUpperCase()} question${
//           loadedQuestions.length === 1
//             ? ""
//             : "s"
//         } loaded from the question bank.`,
//       );

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } catch (error) {
//       console.error(
//         "Failed to load question bank:",
//         error,
//       );

//       setPageError(
//         "Unable to load the selected question bank.",
//       );
//     } finally {
//       setLoadingQuestionBank(false);
//     }
//   }

//   /* ==========================================================
//      SELECT SUBJECT
//   ========================================================== */

//   function handleSubjectChange(
//     subjectId: string,
//   ) {
//     setSelectedSubjectId(subjectId);
//     setSuccessMessage("");
//     setPageError("");

//     const subject = subjects.find(
//       (item) => item._id === subjectId,
//     );

//     if (!subject) return;

//     setQuestions([
//       createEmptyQuestion(
//         subject.name,
//         selectedExamType,
//       ),
//     ]);
//   }

//   /* ==========================================================
//      EXAM TYPE
//   ========================================================== */

//   function handleExamTypeChange(
//     examType: ExamType,
//   ) {
//     setSelectedExamType(examType);
//     setSuccessMessage("");
//     setPageError("");

//     const subjectName =
//       selectedSubject?.name ?? "";

//     setQuestions([
//       createEmptyQuestion(
//         subjectName,
//         examType,
//       ),
//     ]);
//   }

//   /* ==========================================================
//      QUESTION FIELD UPDATE
//   ========================================================== */

//   function updateQuestion(
//     questionId: string,
//     field: keyof QuestionForm,
//     value: any,
//   ) {
//     setQuestions((current) =>
//       current.map((question) =>
//         question.id === questionId
//           ? {
//               ...question,
//               [field]: value,
//             }
//           : question,
//       ),
//     );

//     setSuccessMessage("");
//     setPageError("");
//   }

//   /* ==========================================================
//      OPTION UPDATE
//   ========================================================== */

//   function updateOption(
//     questionId: string,
//     optionIndex: number,
//     value: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         const oldValue =
//           question.options[optionIndex]
//             ?.value ?? "";

//         const updatedOptions = [
//           ...question.options,
//         ];

//         updatedOptions[optionIndex] = {
//           ...updatedOptions[optionIndex],
//           value,
//         };

//         const updatedCorrectAnswers =
//           question.correctAnswers.map(
//             (answer) =>
//               answer === oldValue
//                 ? value
//                 : answer,
//           );

//         return {
//           ...question,
//           options: updatedOptions,
//           correctAnswers:
//             updatedCorrectAnswers,
//         };
//       }),
//     );

//     setSuccessMessage("");
//     setPageError("");
//   }

//   /* ==========================================================
//      ADD OPTION
//   ========================================================== */

//   function addOption(questionId: string) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         if (
//           question.options.length >=
//           OPTION_LABELS.length
//         ) {
//           return question;
//         }

//         const label =
//           OPTION_LABELS[
//             question.options.length
//           ];

//         return {
//           ...question,
//           options: [
//             ...question.options,
//             {
//               label,
//               value: "",
//             },
//           ],
//         };
//       }),
//     );
//   }

//   /* ==========================================================
//      REMOVE OPTION
//   ========================================================== */

//   function removeOption(
//     questionId: string,
//     optionIndex: number,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         if (question.options.length <= 2) {
//           return question;
//         }

//         const removedOption =
//           question.options[optionIndex];

//         const updatedOptions =
//           question.options
//             .filter(
//               (_, index) =>
//                 index !== optionIndex,
//             )
//             .map((option, index) => ({
//               ...option,
//               label: OPTION_LABELS[index],
//             }));

//         const updatedCorrectAnswers =
//           question.correctAnswers.filter(
//             (answer) =>
//               answer !== removedOption.value,
//           );

//         return {
//           ...question,
//           options: updatedOptions,
//           correctAnswers:
//             updatedCorrectAnswers,
//         };
//       }),
//     );
//   }

//   /* ==========================================================
//      CORRECT ANSWER
//   ========================================================== */

//   function toggleCorrectAnswer(
//     questionId: string,
//     optionValue: string,
//   ) {
//     if (!optionValue.trim()) return;

//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         if (question.isMultipleAnswer) {
//           const exists =
//             question.correctAnswers.includes(
//               optionValue,
//             );

//           return {
//             ...question,
//             correctAnswers: exists
//               ? question.correctAnswers.filter(
//                   (answer) =>
//                     answer !== optionValue,
//                 )
//               : [
//                   ...question.correctAnswers,
//                   optionValue,
//                 ],
//           };
//         }

//         return {
//           ...question,
//           correctAnswers: [optionValue],
//         };
//       }),
//     );

//     setSuccessMessage("");
//   }

//   /* ==========================================================
//      MULTIPLE ANSWERS
//   ========================================================== */

//   function toggleMultipleAnswers(
//     questionId: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         const enableMultiple =
//           !question.isMultipleAnswer;

//         return {
//           ...question,
//           isMultipleAnswer:
//             enableMultiple,
//           correctAnswers: enableMultiple
//             ? question.correctAnswers
//             : question.correctAnswers.slice(
//                 0,
//                 1,
//               ),
//         };
//       }),
//     );
//   }

//   /* ==========================================================
//      EXPLANATION STEP
//   ========================================================== */

//   function addExplanationStep(
//     questionId: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         return {
//           ...question,
//           explanationSteps: [
//             ...question.explanationSteps,
//             {
//               step:
//                 question
//                   .explanationSteps
//                   .length + 1,
//               text: "",
//             },
//           ],
//         };
//       }),
//     );
//   }

//   function updateExplanationStep(
//     questionId: string,
//     stepIndex: number,
//     value: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         const updatedSteps = [
//           ...question.explanationSteps,
//         ];

//         updatedSteps[stepIndex] = {
//           ...updatedSteps[stepIndex],
//           text: value,
//         };

//         return {
//           ...question,
//           explanationSteps:
//             updatedSteps,
//         };
//       }),
//     );
//   }

//   function removeExplanationStep(
//     questionId: string,
//     stepIndex: number,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         return {
//           ...question,
//           explanationSteps:
//             question.explanationSteps
//               .filter(
//                 (_, index) =>
//                   index !== stepIndex,
//               )
//               .map((step, index) => ({
//                 ...step,
//                 step: index + 1,
//               })),
//         };
//       }),
//     );
//   }

//   /* ==========================================================
//      QUESTION MANAGEMENT
//   ========================================================== */

//   function addQuestion() {
//     setQuestions((current) => [
//       ...current,
//       createEmptyQuestion(
//         selectedSubject?.name ?? "",
//         selectedExamType,
//       ),
//     ]);

//     setSuccessMessage("");
//   }

//   function duplicateQuestion(
//     questionId: string,
//   ) {
//     setQuestions((current) => {
//       const question = current.find(
//         (item) => item.id === questionId,
//       );

//       if (!question) return current;

//       const duplicated: QuestionForm = {
//         ...question,
//         id: createId(),

//         content:
//           question.content.map(
//             (content) => ({
//               ...content,
//               segments:
//                 content.segments.map(
//                   (segment) => ({
//                     ...segment,
//                     styles: [
//                       ...segment.styles,
//                     ],
//                   }),
//                 ),
//               table:
//                 content.table?.map(
//                   (row) => [...row],
//                 ),
//               graph: content.graph
//                 ? {
//                     ...content.graph,
//                     labels: [
//                       ...content.graph
//                         .labels,
//                     ],
//                     datasets:
//                       content.graph.datasets.map(
//                         (dataset) => ({
//                           ...dataset,
//                           data: [
//                             ...dataset.data,
//                           ],
//                         }),
//                       ),
//                   }
//                 : undefined,
//             }),
//           ),

//         options:
//           question.options.map(
//             (option) => ({
//               ...option,
//             }),
//           ),

//         correctAnswers: [
//           ...question.correctAnswers,
//         ],

//         explanationSteps:
//           question.explanationSteps.map(
//             (step) => ({
//               ...step,
//             }),
//           ),
//       };

//       const index =
//         current.findIndex(
//           (item) =>
//             item.id === questionId,
//         );

//       const updated = [...current];

//       updated.splice(
//         index + 1,
//         0,
//         duplicated,
//       );

//       return updated;
//     });

//     setSuccessMessage("");
//   }

//   function removeQuestion(
//     questionId: string,
//   ) {
//     setQuestions((current) => {
//       if (current.length === 1) {
//         return current;
//       }

//       return current.filter(
//         (question) =>
//           question.id !== questionId,
//       );
//     });

//     setSuccessMessage("");
//   }

//   /* ==========================================================
//      VALIDATION
//   ========================================================== */

//   function validateQuestions() {
//     if (!selectedSubjectId) {
//       return "Please select a subject.";
//     }

//     if (questions.length === 0) {
//       return "Please add at least one question.";
//     }

//     for (
//       let index = 0;
//       index < questions.length;
//       index++
//     ) {
//       const question = questions[index];
//       const number = index + 1;

//       if (!question.question.trim()) {
//         return `Question ${number}: question text is required.`;
//       }

//       if (!question.instruction.trim()) {
//         return `Question ${number}: instruction is required.`;
//       }

//       if (!question.topic.trim()) {
//         return `Question ${number}: topic is required.`;
//       }

//       if (
//         !question.apiSubjectName.trim()
//       ) {
//         return `Question ${number}: subject name is required.`;
//       }

//       const validOptions =
//         question.options.filter(
//           (option) =>
//             option.value.trim(),
//         );

//       if (validOptions.length < 2) {
//         return `Question ${number}: at least two options are required.`;
//       }

//       if (
//         question.correctAnswers.length ===
//         0
//       ) {
//         return `Question ${number}: select at least one correct answer.`;
//       }

//       const validOptionValues =
//         validOptions.map(
//           (option) =>
//             option.value.trim(),
//         );

//       const invalidCorrectAnswer =
//         question.correctAnswers.some(
//           (answer) =>
//             !validOptionValues.includes(
//               answer.trim(),
//             ),
//         );

//       if (invalidCorrectAnswer) {
//         return `Question ${number}: every correct answer must match an option.`;
//       }

//       if (
//         !question.isMultipleAnswer &&
//         question.correctAnswers.length > 1
//       ) {
//         return `Question ${number}: only one correct answer is allowed.`;
//       }
//     }

//     return null;
//   }

//   /* ==========================================================
//      PAYLOAD
//   ========================================================== */

//   function convertQuestionToPayload(
//     question: QuestionForm,
//   ) {
//     const validOptions =
//       question.options
//         .filter(
//           (option) =>
//             option.value.trim(),
//         )
//         .map((option) => ({
//           label: option.label,
//           value: option.value.trim(),
//         }));

//     return {
//       content: question.content,

//       question:
//         question.question.trim(),

//       instruction:
//         question.instruction.trim(),

//       topic: question.topic.trim(),

//       section:
//         question.section.trim(),

//       options: validOptions,

//       correctAnswers:
//         question.correctAnswers.map(
//           (answer) => answer.trim(),
//         ),

//       explanation:
//         question.explanation.trim(),

//       explanationSteps:
//         question.explanationSteps
//           .filter(
//             (step) =>
//               step.text.trim(),
//           )
//           .map(
//             (step) =>
//               step.text.trim(),
//           ),

//       difficulty:
//         question.difficulty,

//       examType:
//         question.examType,

//       apiSubjectName:
//         question.apiSubjectName.trim(),

//       isMultipleAnswer:
//         question.isMultipleAnswer,
//     };
//   }

//   /* ==========================================================
//      SUBMIT
//   ========================================================== */

//   async function handleSubmit() {
//     setPageError("");
//     setSuccessMessage("");

//     const validationError =
//       validateQuestions();

//     if (validationError) {
//       setPageError(validationError);

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });

//       return;
//     }

//     if (!selectedSubjectId) {
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         questions:
//           questions.map(
//             convertQuestionToPayload,
//           ),
//       };

//       console.log(
//         "Submitting Solve & Win questions:",
//         payload,
//       );

//       const response =
//         await axiosInstance.patch(
//           `/solve-and-win/contests/add-solve-and-win-contest-questions-to-database/${encodeURIComponent(
//             selectedSubjectId,
//           )}`,
//           payload,
//         );

//       console.log(
//         "Questions saved successfully:",
//         response.data,
//       );

//       setSuccessMessage(
//         `${questions.length} question${
//           questions.length === 1
//             ? ""
//             : "s"
//         } saved successfully.`,
//       );

//       setQuestions([
//         createEmptyQuestion(
//           selectedSubject?.name ?? "",
//           selectedExamType,
//         ),
//       ]);

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } catch (error: any) {
//       console.error(
//         "Failed to save questions:",
//         error,
//       );

//       const message =
//         error?.response?.data
//           ?.message ||
//         error?.response?.data?.error ||
//         "Unable to save questions. Please try again.";

//       setPageError(
//         Array.isArray(message)
//           ? message.join(", ")
//           : message,
//       );

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } finally {
//       setSaving(false);
//     }
//   }

//   /* ==========================================================
//      PAYLOAD PREVIEW
//   ========================================================== */

//   const payloadPreview = useMemo(() => {
//     return {
//       questions:
//         questions.map(
//           convertQuestionToPayload,
//         ),
//     };
//   }, [questions]);

//   /* ==========================================================
//      RENDER
//   ========================================================== */

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

//         {/* ====================================================
//             HEADER
//         ==================================================== */}

//         <div className="mb-8">
//           <Link
//             href="/admin/secondary/solveandwin/competitions"
//             className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Competitions
//           </Link>

//           <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <div className="mb-3 flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
//                   <FileText className="h-5 w-5 text-white" />
//                 </div>

//                 <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300">
//                   Solve & Win
//                 </span>
//               </div>

//               <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
//                 Create Questions
//               </h1>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
//                 Load questions from the subject
//                 question bank, edit them, add new
//                 questions, and send them to the
//                 Solve & Win database.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={addQuestion}
//               disabled={
//                 loadingSubjects ||
//                 saving
//               }
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Plus className="h-4 w-4" />
//               Add Question
//             </button>
//           </div>
//         </div>

//         {/* ====================================================
//             ALERTS
//         ==================================================== */}

//         {pageError && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
//             <X className="mt-0.5 h-5 w-5 shrink-0" />

//             <div>
//               <p className="font-bold">
//                 Something went wrong
//               </p>

//               <p className="mt-1 text-red-200/80">
//                 {pageError}
//               </p>
//             </div>
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
//             <Check className="mt-0.5 h-5 w-5 shrink-0" />

//             <div>
//               <p className="font-bold">
//                 Success
//               </p>

//               <p className="mt-1 text-emerald-200/80">
//                 {successMessage}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* ====================================================
//             SUBJECT + EXAM TYPE
//         ==================================================== */}

//         <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
//           <div className="mb-5 flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
//               <BookOpen className="h-5 w-5" />
//             </div>

//             <div>
//               <h2 className="font-black">
//                 Question Bank
//               </h2>

//               <p className="text-xs text-slate-400">
//                 Select a subject and exam type,
//                 then load its question file.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">

//             {/* SUBJECT */}

//             <div>
//               <label className="mb-2 block text-sm font-bold">
//                 Subject
//               </label>

//               <div className="relative">
//                 <select
//                   value={
//                     selectedSubjectId
//                   }
//                   onChange={(event) =>
//                     handleSubjectChange(
//                       event.target.value,
//                     )
//                   }
//                   disabled={
//                     loadingSubjects ||
//                     saving
//                   }
//                   className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   {loadingSubjects ? (
//                     <option value="">
//                       Loading subjects...
//                     </option>
//                   ) : subjects.length ===
//                     0 ? (
//                     <option value="">
//                       No subjects found
//                     </option>
//                   ) : (
//                     <>
//                       <option value="">
//                         Select a subject
//                       </option>

//                       {subjects.map(
//                         (subject) => (
//                           <option
//                             key={
//                               subject._id
//                             }
//                             value={
//                               subject._id
//                             }
//                           >
//                             {subject.name}
//                           </option>
//                         ),
//                       )}
//                     </>
//                   )}
//                 </select>

//                 <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               </div>
//             </div>

//             {/* EXAM TYPE */}

//             <div>
//               <label className="mb-2 block text-sm font-bold">
//                 Exam Type
//               </label>

//               <div className="relative">
//                 <select
//                   value={
//                     selectedExamType
//                   }
//                   onChange={(event) =>
//                     handleExamTypeChange(
//                       event.target
//                         .value as ExamType,
//                     )
//                   }
//                   disabled={saving}
//                   className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   <option value="jamb">
//                     JAMB
//                   </option>

//                   <option value="waec">
//                     WAEC
//                   </option>

//                   <option value="neco">
//                     NECO
//                   </option>
//                 </select>

//                 <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               </div>
//             </div>
//           </div>

//           {/* LOAD BANK BUTTON */}

//           <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div className="text-xs text-slate-500">
//               {selectedSubject
//                 ? `${selectedSubject.name} • ${selectedExamType.toUpperCase()}`
//                 : "Select a subject"}
//             </div>

//             <button
//               type="button"
//               onClick={
//                 loadSelectedQuestionBank
//               }
//               disabled={
//                 loadingSubjects ||
//                 loadingQuestionBank ||
//                 saving ||
//                 !selectedSubjectId
//               }
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {loadingQuestionBank ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Loading Questions...
//                 </>
//               ) : (
//                 <>
//                   <BookOpen className="h-4 w-4" />
//                   Load Question Bank
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* ====================================================
//             QUESTIONS
//         ==================================================== */}

//         <div className="space-y-8">
//           {questions.map(
//             (
//               question,
//               questionIndex,
//             ) => (
//               <div
//                 key={question.id}
//                 className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl"
//               >
//                 {/* QUESTION HEADER */}

//                 <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
//                   <div className="flex items-center gap-3">
//                     <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
//                       {questionIndex + 1}
//                     </span>

//                     <div>
//                       <h2 className="font-black">
//                         Question{" "}
//                         {questionIndex + 1}
//                       </h2>

//                       <p className="text-xs text-slate-500">
//                         {question.apiSubjectName ||
//                           "No subject selected"}{" "}
//                         •{" "}
//                         {question.examType.toUpperCase()}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         duplicateQuestion(
//                           question.id,
//                         )
//                       }
//                       disabled={saving}
//                       className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
//                     >
//                       <Copy className="h-4 w-4" />
//                       Duplicate
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         removeQuestion(
//                           question.id,
//                         )
//                       }
//                       disabled={
//                         saving ||
//                         questions.length ===
//                           1
//                       }
//                       className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-500/5 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       Remove
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-7 p-5 sm:p-6">

//                   {/* QUESTION */}

//                   <div>
//                     <label className="mb-2 block text-sm font-bold">
//                       Question
//                     </label>

//                     <textarea
//                       value={
//                         question.question
//                       }
//                       onChange={(event) =>
//                         updateQuestion(
//                           question.id,
//                           "question",
//                           event.target
//                             .value,
//                         )
//                       }
//                       rows={5}
//                       placeholder="Enter the question..."
//                       className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                     />
//                   </div>

//                   {/* BASIC DETAILS */}

//                   <div className="grid gap-5 md:grid-cols-2">
//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Instruction
//                       </label>

//                       <input
//                         value={
//                           question.instruction
//                         }
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "instruction",
//                             event.target
//                               .value,
//                           )
//                         }
//                         placeholder="Choose the correct answer."
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Topic
//                       </label>

//                       <input
//                         value={
//                           question.topic
//                         }
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "topic",
//                             event.target
//                               .value,
//                           )
//                         }
//                         placeholder="e.g. Cell Biology"
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                       />
//                     </div>
//                   </div>

//                   {/* META */}

//                   <div className="grid gap-5 sm:grid-cols-3">
//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Difficulty
//                       </label>

//                       <select
//                         value={
//                           question.difficulty
//                         }
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "difficulty",
//                             event.target
//                               .value as Difficulty,
//                           )
//                         }
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
//                       >
//                         <option value="easy">
//                           Easy
//                         </option>

//                         <option value="medium">
//                           Medium
//                         </option>

//                         <option value="hard">
//                           Hard
//                         </option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Exam Type
//                       </label>

//                       <select
//                         value={
//                           question.examType
//                         }
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "examType",
//                             event.target
//                               .value as ExamType,
//                           )
//                         }
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
//                       >
//                         <option value="jamb">
//                           JAMB
//                         </option>

//                         <option value="waec">
//                           WAEC
//                         </option>

//                         <option value="neco">
//                           NECO
//                         </option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Section
//                       </label>

//                       <input
//                         value={
//                           question.section
//                         }
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "section",
//                             event.target
//                               .value,
//                           )
//                         }
//                         placeholder="objective"
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                       />
//                     </div>
//                   </div>

//                   {/* OPTIONS */}

//                   <div>
//                     <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                       <div>
//                         <h3 className="text-sm font-black">
//                           Answer Options
//                         </h3>

//                         <p className="mt-1 text-xs text-slate-500">
//                           Click an option letter to
//                           mark it as correct.
//                         </p>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           addOption(
//                             question.id,
//                           )
//                         }
//                         disabled={
//                           question.options
//                             .length >=
//                           OPTION_LABELS.length
//                         }
//                         className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
//                       >
//                         <Plus className="h-4 w-4" />
//                         Add Option
//                       </button>
//                     </div>

//                     <div className="space-y-3">
//                       {question.options.map(
//                         (
//                           option,
//                           optionIndex,
//                         ) => {
//                           const isCorrect =
//                             question.correctAnswers.includes(
//                               option.value,
//                             );

//                           return (
//                             <div
//                               key={`${question.id}-${option.label}`}
//                               className={`flex gap-3 rounded-2xl border p-3 transition ${
//                                 isCorrect
//                                   ? "border-emerald-400/40 bg-emerald-500/5"
//                                   : "border-white/10 bg-slate-900"
//                               }`}
//                             >
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   toggleCorrectAnswer(
//                                     question.id,
//                                     option.value,
//                                   )
//                                 }
//                                 disabled={
//                                   !option.value.trim()
//                                 }
//                                 className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black transition ${
//                                   isCorrect
//                                     ? "bg-emerald-500 text-white"
//                                     : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
//                                 }`}
//                               >
//                                 {isCorrect ? (
//                                   <Check className="h-5 w-5" />
//                                 ) : (
//                                   option.label
//                                 )}
//                               </button>

//                               <input
//                                 value={
//                                   option.value
//                                 }
//                                 onChange={(
//                                   event,
//                                 ) =>
//                                   updateOption(
//                                     question.id,
//                                     optionIndex,
//                                     event.target
//                                       .value,
//                                   )
//                                 }
//                                 placeholder={`Option ${option.label}`}
//                                 className="min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-slate-600"
//                               />

//                               {question
//                                 .options
//                                 .length >
//                                 2 && (
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     removeOption(
//                                       question.id,
//                                       optionIndex,
//                                     )
//                                   }
//                                   className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
//                                 >
//                                   <X className="h-4 w-4" />
//                                 </button>
//                               )}
//                             </div>
//                           );
//                         },
//                       )}
//                     </div>

//                     <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
//                       <input
//                         type="checkbox"
//                         checked={
//                           question.isMultipleAnswer
//                         }
//                         onChange={() =>
//                           toggleMultipleAnswers(
//                             question.id,
//                           )
//                         }
//                         className="h-4 w-4 rounded border-white/20"
//                       />

//                       <div>
//                         <p className="text-sm font-bold">
//                           Allow multiple correct answers
//                         </p>

//                         <p className="text-xs text-slate-500">
//                           Enable this only when more than
//                           one option should be correct.
//                         </p>
//                       </div>
//                     </label>
//                   </div>

//                   {/* EXPLANATION */}

//                   <div>
//                     <label className="mb-2 block text-sm font-bold">
//                       Explanation
//                     </label>

//                     <textarea
//                       value={
//                         question.explanation
//                       }
//                       onChange={(event) =>
//                         updateQuestion(
//                           question.id,
//                           "explanation",
//                           event.target
//                             .value,
//                         )
//                       }
//                       rows={4}
//                       placeholder="Explain why the correct answer is correct..."
//                       className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                     />

//                     <div className="mt-4">
//                       <div className="mb-3 flex items-center justify-between">
//                         <div>
//                           <p className="text-sm font-bold">
//                             Explanation Steps
//                           </p>

//                           <p className="text-xs text-slate-500">
//                             Optional step-by-step explanation.
//                           </p>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             addExplanationStep(
//                               question.id,
//                             )
//                           }
//                           className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
//                         >
//                           <Plus className="h-4 w-4" />
//                           Add Step
//                         </button>
//                       </div>

//                       {question
//                         .explanationSteps
//                         .length > 0 && (
//                         <div className="space-y-3">
//                           {question.explanationSteps.map(
//                             (
//                               step,
//                               stepIndex,
//                             ) => (
//                               <div
//                                 key={`${question.id}-step-${stepIndex}`}
//                                 className="flex gap-3"
//                               >
//                                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-black text-slate-400">
//                                   {stepIndex +
//                                     1}
//                                 </div>

//                                 <input
//                                   value={
//                                     step.text
//                                   }
//                                   onChange={(
//                                     event,
//                                   ) =>
//                                     updateExplanationStep(
//                                       question.id,
//                                       stepIndex,
//                                       event
//                                         .target
//                                         .value,
//                                     )
//                                   }
//                                   placeholder={`Explanation step ${
//                                     stepIndex +
//                                     1
//                                   }`}
//                                   className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                                 />

//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     removeExplanationStep(
//                                       question.id,
//                                       stepIndex,
//                                     )
//                                   }
//                                   className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             ),
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ),
//           )}
//         </div>

//         {/* ====================================================
//             PAYLOAD PREVIEW
//         ==================================================== */}

//         <details className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
//           <summary className="cursor-pointer select-none px-5 py-4 text-sm font-bold text-slate-300 hover:text-white">
//             Preview API Payload
//           </summary>

//           <pre className="max-h-[500px] overflow-auto border-t border-white/10 p-5 text-xs leading-6 text-slate-400">
//             {JSON.stringify(
//               payloadPreview,
//               null,
//               2,
//             )}
//           </pre>
//         </details>

//         {/* ====================================================
//             BOTTOM ACTIONS
//         ==================================================== */}

//         <div className="sticky bottom-4 z-20 mt-8">
//           <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
//             <div className="px-2 text-xs text-slate-500">
//               {questions.length} question
//               {questions.length === 1
//                 ? ""
//                 : "s"} ready to save
//             </div>

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={addQuestion}
//                 disabled={saving}
//                 className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 disabled:opacity-50 sm:flex-none"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add Question
//               </button>

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={
//                   saving ||
//                   loadingSubjects ||
//                   !selectedSubjectId
//                 }
//                 className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
//               >
//                 {saving ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4" />
//                     Save Questions
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
