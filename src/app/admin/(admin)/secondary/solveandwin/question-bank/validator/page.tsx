"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  CircleX,
  Copy,
  Database,
  Eye,
  FileSearch,
  Filter,
  Layers3,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { getSubjectsByPlan } from "@/lib/api/subjects";
import {
  getQuestionBanks,
  type QuestionDifficulty,
} from "../../competitions/createquestion/questions";

type ExamType = "jamb" | "waec" | "neco";

type Subject = {
  _id: string;
  name: string;
  slug?: string;
};

type ContentSegment = {
  text: string;
  styles: string[];
};

type QuestionContent = {
  type: "text";
  order: number;
  segments: ContentSegment[];
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
};

type QuestionOption = {
  label: string;
  value: string;
};

type QuestionBankItem = {
  content: QuestionContent[];
  question: string;
  instruction: string;
  topic: string;
  section: string;
  options: QuestionOption[];
  correctAnswers: string[];
  explanation: string;
  explanationSteps: string[];
  difficulty: "easy" | "medium" | "hard";
  examType: ExamType;
  apiSubjectName: string;
  isMultipleAnswer: boolean;
};

type QuestionWithId = QuestionBankItem & {
  localId: string;
  difficultySource: QuestionDifficulty;
  sourceIndex: number;
};

type ValidationIssueType =
  | "question"
  | "instruction"
  | "topic"
  | "section"
  | "options"
  | "answers"
  | "content"
  | "explanation"
  | "difficulty"
  | "exam"
  | "subject"
  | "multiple-answer";

type ValidationIssue = {
  type: ValidationIssueType;
  message: string;
};

type QuestionValidationResult = {
  question: QuestionWithId;
  issues: ValidationIssue[];
};

type DuplicateGroup = {
  fingerprint: string;
  questions: QuestionWithId[];
};

type CrossDifficultyPair = {
  key: string;
  label: string;
  first: QuestionWithId;
  second: QuestionWithId;
};

type DifficultyStats = {
  easy: number;
  medium: number;
  hard: number;
};

const DIFFICULTIES: QuestionDifficulty[] = [
  "easy",
  "medium",
  "hard",
];

const DIFFICULTY_LABELS: Record<
  QuestionDifficulty,
  string
> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const DIFFICULTY_COLORS: Record<
  QuestionDifficulty,
  string
> = {
  easy: "text-emerald-300 bg-emerald-400/10",
  medium: "text-cyan-300 bg-cyan-400/10",
  hard: "text-purple-300 bg-purple-400/10",
};

function createLocalId(
  difficulty: QuestionDifficulty,
  index: number,
) {
  return `question-${difficulty}-${Date.now()}-${index}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .replace(/[“”‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function normalizeForComparison(value: unknown) {
  return normalizeText(value)
    .replace(/[()[\]{}]/g, "")
    .replace(/["']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getFingerprint(
  question: QuestionBankItem,
) {
  const questionText =
    normalizeForComparison(
      question.question,
    );

  const options = (
    Array.isArray(question.options)
      ? question.options
      : []
  )
    .map((option) =>
      normalizeForComparison(
        option?.value,
      ),
    )
    .sort()
    .join("|");

  return [
    normalizeForComparison(
      question.apiSubjectName,
    ),
    normalizeText(question.examType),
    questionText,
    options,
  ].join("::");
}

function convertBankToLocal(
  bank: QuestionBankItem[],
  difficultySource: QuestionDifficulty,
): QuestionWithId[] {
  return bank.map((question, index) => ({
    ...question,

    localId: createLocalId(
      difficultySource,
      index,
    ),

    difficultySource,

    sourceIndex: index,

    content:
      Array.isArray(question.content)
        ? question.content.map(
            (block) => ({
              ...block,

              segments:
                Array.isArray(
                  block.segments,
                )
                  ? block.segments.map(
                      (segment) => ({
                        ...segment,
                        styles:
                          Array.isArray(
                            segment.styles,
                          )
                            ? [
                                ...segment.styles,
                              ]
                            : [],
                      }),
                    )
                  : [],

              table:
                Array.isArray(
                  block.table,
                )
                  ? block.table.map(
                      (row) => [
                        ...row,
                      ],
                    )
                  : undefined,

              graph: block.graph
                ? {
                    ...block.graph,

                    labels:
                      Array.isArray(
                        block.graph
                          .labels,
                      )
                        ? [
                            ...block.graph
                              .labels,
                          ]
                        : [],

                    datasets:
                      Array.isArray(
                        block.graph
                          .datasets,
                      )
                        ? block.graph.datasets.map(
                            (
                              dataset,
                            ) => ({
                              ...dataset,
                              data:
                                Array.isArray(
                                  dataset.data,
                                )
                                  ? [
                                      ...dataset.data,
                                    ]
                                  : [],
                            }),
                          )
                        : [],
                  }
                : undefined,
            }),
          )
        : [],

    options: Array.isArray(
      question.options,
    )
      ? question.options.map(
          (option) => ({
            ...option,
          }),
        )
      : [],

    correctAnswers:
      Array.isArray(
        question.correctAnswers,
      )
        ? [
            ...question.correctAnswers,
          ]
        : [],

    explanationSteps:
      Array.isArray(
        question.explanationSteps,
      )
        ? [
            ...question.explanationSteps,
          ]
        : [],
  }));
}

function getExpectedDifficulty(
  source: QuestionDifficulty,
): QuestionBankItem["difficulty"] {
  return source;
}

function getSourcePath(
  subjectName: string,
  difficulty: QuestionDifficulty,
  examType: ExamType,
) {
  const subjectSlug = subjectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  return `${subjectSlug}/${difficulty}/${examType}.ts`;
}

/*
 * ============================================================
 * CREATE COPYABLE QUESTION OBJECT
 * ============================================================
 *
 * This deliberately removes validator-only fields:
 *
 * localId
 * difficultySource
 * sourceIndex
 *
 * What remains is the actual question-bank object.
 */
function getCopyableQuestion(
  question: QuestionWithId,
): QuestionBankItem {
  return {
    content: question.content,
    question: question.question,
    instruction: question.instruction,
    topic: question.topic,
    section: question.section,
    options: question.options,
    correctAnswers: question.correctAnswers,
    explanation: question.explanation,
    explanationSteps:
      question.explanationSteps,
    difficulty: question.difficulty,
    examType: question.examType,
    apiSubjectName:
      question.apiSubjectName,
    isMultipleAnswer:
      question.isMultipleAnswer,
  };
}

/*
 * ============================================================
 * FORMAT QUESTION FOR TYPESCRIPT
 * ============================================================
 *
 * JSON object syntax is valid JavaScript/TypeScript object
 * syntax, so the copied result can be pasted directly inside
 * your questions array.
 */
function formatQuestionForCopy(
  question: QuestionWithId,
) {
  const cleanQuestion =
    getCopyableQuestion(question);

  return JSON.stringify(
    cleanQuestion,
    null,
    2,
  );
}

/*
 * ============================================================
 * FORMAT MULTIPLE QUESTIONS FOR TYPESCRIPT
 * ============================================================
 */
function formatQuestionsForCopy(
  questionsToCopy: QuestionWithId[],
) {
  return questionsToCopy
    .map((question) =>
      formatQuestionForCopy(
        question,
      ),
    )
    .join(",\n\n");
}

/*
 * ============================================================
 * CLIPBOARD HELPER
 * ============================================================
 *
 * Uses the modern Clipboard API first, then falls back to a
 * temporary textarea for browsers/environments where the
 * Clipboard API is unavailable.
 */
async function copyTextToClipboard(
  text: string,
) {
  if (
    typeof navigator !==
      "undefined" &&
    navigator.clipboard &&
    window.isSecureContext
  ) {
    await navigator.clipboard.writeText(
      text,
    );

    return;
  }

  const textarea =
    document.createElement(
      "textarea",
    );

  textarea.value = text;

  textarea.style.position =
    "fixed";
  textarea.style.left = "-999999px";
  textarea.style.top = "-999999px";

  document.body.appendChild(
    textarea,
  );

  textarea.focus();
  textarea.select();

  const successful =
    document.execCommand(
      "copy",
    );

  document.body.removeChild(
    textarea,
  );

  if (!successful) {
    throw new Error(
      "Unable to copy text to clipboard.",
    );
  }
}

function validateQuestion(
  question: QuestionWithId,
  selectedExamType: ExamType,
  selectedSubjectName: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] =
    [];

  /*
   * QUESTION
   */

  if (
    typeof question.question !==
      "string" ||
    !question.question.trim()
  ) {
    issues.push({
      type: "question",
      message:
        "Question text is missing.",
    });
  }

  /*
   * INSTRUCTION
   */

  if (
    typeof question.instruction !==
    "string"
  ) {
    issues.push({
      type: "instruction",
      message:
        "Instruction must be a string.",
    });
  }

  /*
   * TOPIC
   */

  if (
    typeof question.topic !==
      "string" ||
    !question.topic.trim()
  ) {
    issues.push({
      type: "topic",
      message: "Topic is missing.",
    });
  }

  /*
   * SECTION
   */

  if (
    typeof question.section !==
      "string" ||
    !question.section.trim()
  ) {
    issues.push({
      type: "section",
      message:
        "Section is missing.",
    });
  }

  /*
   * OPTIONS
   */

  if (
    !Array.isArray(question.options)
  ) {
    issues.push({
      type: "options",
      message:
        "Options must be an array.",
    });
  } else {
    if (question.options.length !== 4) {
      issues.push({
        type: "options",
        message: `Expected exactly 4 options, found ${question.options.length}.`,
      });
    }

    const labels =
      question.options.map(
        (option) =>
          normalizeText(
            option?.label,
          ),
      );

    const values =
      question.options.map(
        (option) =>
          normalizeForComparison(
            option?.value,
          ),
      );

    const duplicateLabels =
      labels.filter(
        (label, index) =>
          label &&
          labels.indexOf(label) !==
            index,
      );

    if (duplicateLabels.length > 0) {
      issues.push({
        type: "options",
        message:
          "Option labels contain duplicates.",
      });
    }

    const duplicateValues =
      values.filter(
        (value, index) =>
          value &&
          values.indexOf(value) !==
            index,
      );

    if (duplicateValues.length > 0) {
      issues.push({
        type: "options",
        message:
          "Option values contain duplicates.",
      });
    }

    question.options.forEach(
      (option, index) => {
        if (
          !option ||
          typeof option.label !==
            "string" ||
          !option.label.trim()
        ) {
          issues.push({
            type: "options",
            message: `Option ${index + 1} has no label.`,
          });
        }

        if (
          !option ||
          typeof option.value !==
            "string" ||
          !option.value.trim()
        ) {
          issues.push({
            type: "options",
            message: `Option ${index + 1} has no value.`,
          });
        }
      },
    );
  }

  /*
   * CORRECT ANSWERS
   */

  if (
    !Array.isArray(
      question.correctAnswers,
    )
  ) {
    issues.push({
      type: "answers",
      message:
        "correctAnswers must be an array.",
    });
  } else {
    if (
      question.isMultipleAnswer
    ) {
      if (
        question.correctAnswers
          .length < 1
      ) {
        issues.push({
          type: "multiple-answer",
          message:
            "Multiple-answer question must have at least one correct answer.",
        });
      }
    } else if (
      question.correctAnswers
        .length !== 1
    ) {
      issues.push({
        type: "answers",
        message: `Single-answer question must have exactly 1 correct answer, found ${question.correctAnswers.length}.`,
      });
    }

    const optionValues =
      Array.isArray(question.options)
        ? question.options.map(
            (option) =>
              normalizeForComparison(
                option.value,
              ),
          )
        : [];

    question.correctAnswers.forEach(
      (answer, index) => {
        const normalizedAnswer =
          normalizeForComparison(
            answer,
          );

        if (!normalizedAnswer) {
          issues.push({
            type: "answers",
            message: `Correct answer ${index + 1} is empty.`,
          });

          return;
        }

        const matchesValue =
          optionValues.includes(
            normalizedAnswer,
          );

        const matchesLabel =
          Array.isArray(
            question.options,
          ) &&
          question.options.some(
            (option) =>
              normalizeText(
                option.label,
              ) ===
              normalizeText(
                answer,
              ),
          );

        if (
          !matchesValue &&
          !matchesLabel
        ) {
          issues.push({
            type: "answers",
            message: `Correct answer "${answer}" does not match any option value or label.`,
          });
        }
      },
    );
  }

  /*
   * CONTENT
   */

  if (
    !Array.isArray(question.content)
  ) {
    issues.push({
      type: "content",
      message:
        "Content must be an array.",
    });
  } else {
    if (question.content.length === 0) {
      issues.push({
        type: "content",
        message:
          "Content array is empty.",
      });
    }

    const orders =
      question.content.map(
        (block) => block?.order,
      );

    const duplicateOrders =
      orders.filter(
        (order, index) =>
          orders.indexOf(order) !==
          index,
      );

    if (duplicateOrders.length > 0) {
      issues.push({
        type: "content",
        message:
          "Content blocks contain duplicate order values.",
      });
    }

    question.content.forEach(
      (block, index) => {
        if (
          !block ||
          block.type !== "text"
        ) {
          issues.push({
            type: "content",
            message: `Content block ${index + 1} must have type "text".`,
          });
        }

        if (
          !Number.isFinite(
            block?.order,
          )
        ) {
          issues.push({
            type: "content",
            message: `Content block ${index + 1} has an invalid order.`,
          });
        }

        if (
          !Array.isArray(
            block?.segments,
          )
        ) {
          issues.push({
            type: "content",
            message: `Content block ${index + 1} has invalid segments.`,
          });
        } else {
          block.segments.forEach(
            (
              segment,
              segmentIndex,
            ) => {
              if (
                typeof segment?.text !==
                  "string" ||
                !segment.text.trim()
              ) {
                issues.push({
                  type: "content",
                  message: `Content block ${index + 1}, segment ${segmentIndex + 1} has no text.`,
                });
              }

              if (
                !Array.isArray(
                  segment?.styles,
                )
              ) {
                issues.push({
                  type: "content",
                  message: `Content block ${index + 1}, segment ${segmentIndex + 1} has invalid styles.`,
                });
              }
            },
          );
        }

        if (
          block?.table !==
            undefined &&
          !Array.isArray(
            block.table,
          )
        ) {
          issues.push({
            type: "content",
            message: `Content block ${index + 1} has an invalid table.`,
          });
        }

        if (
          block?.graph !==
            undefined
        ) {
          if (
            typeof block.graph.type !==
            "string"
          ) {
            issues.push({
              type: "content",
              message: `Content block ${index + 1} graph has no type.`,
            });
          }

          if (
            !Array.isArray(
              block.graph.labels,
            )
          ) {
            issues.push({
              type: "content",
              message: `Content block ${index + 1} graph labels are invalid.`,
            });
          }

          if (
            !Array.isArray(
              block.graph.datasets,
            )
          ) {
            issues.push({
              type: "content",
              message: `Content block ${index + 1} graph datasets are invalid.`,
            });
          } else {
            block.graph.datasets.forEach(
              (
                dataset,
                datasetIndex,
              ) => {
                if (
                  typeof dataset.label !==
                  "string"
                ) {
                  issues.push({
                    type: "content",
                    message: `Content block ${index + 1}, dataset ${datasetIndex + 1} has an invalid label.`,
                  });
                }

                if (
                  !Array.isArray(
                    dataset.data,
                  )
                ) {
                  issues.push({
                    type: "content",
                    message: `Content block ${index + 1}, dataset ${datasetIndex + 1} has invalid data.`,
                  });
                }
              },
            );
          }
        }
      },
    );
  }

  /*
   * EXPLANATION
   */

  if (
    typeof question.explanation !==
      "string" ||
    !question.explanation.trim()
  ) {
    issues.push({
      type: "explanation",
      message:
        "Explanation is missing.",
    });
  }

  if (
    !Array.isArray(
      question.explanationSteps,
    )
  ) {
    issues.push({
      type: "explanation",
      message:
        "Explanation steps must be an array.",
    });
  } else {
    question.explanationSteps.forEach(
      (step, index) => {
        if (
          typeof step !== "string" ||
          !step.trim()
        ) {
          issues.push({
            type: "explanation",
            message: `Explanation step ${index + 1} is empty.`,
          });
        }
      },
    );
  }

  /*
   * DIFFICULTY
   */

  const expectedDifficulty =
    getExpectedDifficulty(
      question.difficultySource,
    );

  if (
    question.difficulty !==
    expectedDifficulty
  ) {
    issues.push({
      type: "difficulty",
      message: `Difficulty is "${question.difficulty}" but source folder requires "${expectedDifficulty}".`,
    });
  }

  /*
   * EXAM TYPE
   */

  if (
    question.examType !==
    selectedExamType
  ) {
    issues.push({
      type: "exam",
      message: `Question is marked "${question.examType}" but selected exam is "${selectedExamType}".`,
    });
  }

  /*
   * SUBJECT
   */

  if (
    typeof question.apiSubjectName !==
      "string" ||
    !question.apiSubjectName.trim()
  ) {
    issues.push({
      type: "subject",
      message:
        "apiSubjectName is missing.",
    });
  } else if (
    normalizeText(
      question.apiSubjectName,
    ) !==
    normalizeText(
      selectedSubjectName,
    )
  ) {
    issues.push({
      type: "subject",
      message: `apiSubjectName "${question.apiSubjectName}" does not match selected subject "${selectedSubjectName}".`,
    });
  }

  /*
   * MULTIPLE ANSWER
   */

  if (
    typeof question.isMultipleAnswer !==
    "boolean"
  ) {
    issues.push({
      type: "multiple-answer",
      message:
        "isMultipleAnswer must be a boolean.",
    });
  }

  return issues;
}

export default function QuestionBankValidatorPage() {
  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [
    selectedSubjectId,
    setSelectedSubjectId,
  ] = useState("");

  const [
    selectedExamType,
    setSelectedExamType,
  ] = useState<ExamType>("jamb");

  const [
    questions,
    setQuestions,
  ] = useState<QuestionWithId[]>([]);

  const [
    loadingSubjects,
    setLoadingSubjects,
  ] = useState(true);

  const [
    loadingBank,
    setLoadingBank,
  ] = useState(false);

  const [pageError, setPageError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    expandedGroups,
    setExpandedGroups,
  ] = useState<string[]>([]);

  const [
    expandedValidationIds,
    setExpandedValidationIds,
  ] = useState<string[]>([]);

  const [
    activeValidationFilter,
    setActiveValidationFilter,
  ] = useState<
    "all" | "errors" | "duplicates"
  >("all");

  /*
   * ============================================================
   * COPY STATE
   * ============================================================
   *
   * null  = nothing copied
   * localId = individual question copied
   * "all-errors" = all visible validation errors copied
   */
  const [
    copiedQuestionId,
    setCopiedQuestionId,
  ] = useState<string | null>(
    null,
  );

  /*
   * ============================================================
   * LOAD SUBJECTS
   * ============================================================
   */

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

        if (loadedSubjects.length > 0) {
          setSelectedSubjectId(
            loadedSubjects[0]._id,
          );
        }
      } catch (error) {
        console.error(
          "Failed to load subjects:",
          error,
        );

        setPageError(
          "Unable to load secondary subjects. Please try again.",
        );
      } finally {
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, []);

  /*
   * ============================================================
   * SELECTED SUBJECT
   * ============================================================
   */

  const selectedSubject = useMemo(
    () =>
      subjects.find(
        (subject) =>
          subject._id ===
          selectedSubjectId,
      ),
    [
      subjects,
      selectedSubjectId,
    ],
  );

  /*
   * ============================================================
   * AVAILABLE BANKS
   * ============================================================
   */

  const availableBanks =
    useMemo(() => {
      if (!selectedSubject) {
        return {
          easy: [],
          medium: [],
          hard: [],
        };
      }

      return getQuestionBanks(
        selectedSubject.name,
        selectedExamType,
      );
    }, [
      selectedSubject,
      selectedExamType,
    ]);

  const availableTotal =
    availableBanks.easy.length +
    availableBanks.medium.length +
    availableBanks.hard.length;

  /*
   * ============================================================
   * DIFFICULTY STATS
   * ============================================================
   */

  const difficultyStats =
    useMemo<DifficultyStats>(
      () => ({
        easy: questions.filter(
          (question) =>
            question.difficultySource ===
            "easy",
        ).length,

        medium: questions.filter(
          (question) =>
            question.difficultySource ===
            "medium",
        ).length,

        hard: questions.filter(
          (question) =>
            question.difficultySource ===
            "hard",
        ).length,
      }),
      [questions],
    );

  /*
   * ============================================================
   * DUPLICATE GROUPS
   * ============================================================
   */

  const duplicateGroups =
    useMemo<DuplicateGroup[]>(
      () => {
        const groups = new Map<
          string,
          QuestionWithId[]
        >();

        for (const question of questions) {
          const fingerprint =
            getFingerprint(question);

          const existing =
            groups.get(fingerprint);

          if (existing) {
            existing.push(question);
          } else {
            groups.set(fingerprint, [
              question,
            ]);
          }
        }

        return Array.from(
          groups.entries(),
        )
          .filter(
            ([, group]) =>
              group.length > 1,
          )
          .map(
            ([
              fingerprint,
              group,
            ]) => ({
              fingerprint,
              questions: group,
            }),
          );
      },
      [questions],
    );

  /*
   * ============================================================
   * DUPLICATE COUNTS
   * ============================================================
   */

  const duplicateGroupCount =
    duplicateGroups.length;

  const duplicateQuestionCount =
    duplicateGroups.reduce(
      (total, group) =>
        total + group.questions.length,
      0,
    );

  const duplicateCopiesCount =
    duplicateGroups.reduce(
      (total, group) =>
        total +
        Math.max(
          0,
          group.questions.length - 1,
        ),
      0,
    );

  const uniqueQuestionCount =
    questions.length -
    duplicateCopiesCount;

  /*
   * ============================================================
   * FULL STRUCTURAL VALIDATION
   * ============================================================
   */

  const validationResults =
    useMemo<
      QuestionValidationResult[]
    >(() => {
      if (!selectedSubject) {
        return [];
      }

      return questions
        .map((question) => ({
          question,
          issues: validateQuestion(
            question,
            selectedExamType,
            selectedSubject.name,
          ),
        }))
        .filter(
          (result) =>
            result.issues.length > 0,
        );
    }, [
      questions,
      selectedExamType,
      selectedSubject,
    ]);

  const validationErrorCount =
    validationResults.length;

  const validationIssueCount =
    validationResults.reduce(
      (total, result) =>
        total + result.issues.length,
      0,
    );

  /*
   * ============================================================
   * DIFFICULTY ERRORS
   * ============================================================
   */

  const difficultyValidationErrors =
    useMemo(
      () =>
        validationResults.filter(
          (result) =>
            result.issues.some(
              (issue) =>
                issue.type ===
                "difficulty",
            ),
        ),
      [validationResults],
    );

  const difficultyErrorStats =
    useMemo(() => {
      const stats: DifficultyStats =
        {
          easy: 0,
          medium: 0,
          hard: 0,
        };

      for (const result of difficultyValidationErrors) {
        stats[
          result.question
            .difficultySource
        ]++;
      }

      return stats;
    }, [
      difficultyValidationErrors,
    ]);

  /*
   * ============================================================
   * CROSS-DIFFICULTY DUPLICATES
   * ============================================================
   */

  const crossDifficultyDuplicates =
    useMemo<
      CrossDifficultyPair[]
    >(() => {
      const pairs: CrossDifficultyPair[] =
        [];

      for (const group of duplicateGroups) {
        for (
          let a = 0;
          a < group.questions.length;
          a++
        ) {
          for (
            let b = a + 1;
            b <
            group.questions.length;
            b++
          ) {
            const first =
              group.questions[a];

            const second =
              group.questions[b];

            if (
              first.difficultySource ===
              second.difficultySource
            ) {
              continue;
            }

            const difficulties =
              [
                first.difficultySource,
                second.difficultySource,
              ].sort();

            const pairKey = `${group.fingerprint}::${difficulties.join(
              "-",
            )}`;

            pairs.push({
              key: pairKey,
              label: `${DIFFICULTY_LABELS[first.difficultySource]} ↔ ${DIFFICULTY_LABELS[second.difficultySource]}`,
              first,
              second,
            });
          }
        }
      }

      return pairs;
    }, [duplicateGroups]);

  const crossPairStats =
    useMemo(() => {
      let easyMedium = 0;
      let easyHard = 0;
      let mediumHard = 0;

      for (const pair of crossDifficultyDuplicates) {
        const values = [
          pair.first.difficultySource,
          pair.second.difficultySource,
        ].sort();

        const key = values.join(
          "-",
        );

        if (key === "easy-medium") {
          easyMedium++;
        }

        if (key === "easy-hard") {
          easyHard++;
        }

        if (key === "hard-medium") {
          mediumHard++;
        }
      }

      return {
        easyMedium,
        easyHard,
        mediumHard,
      };
    }, [
      crossDifficultyDuplicates,
    ]);

  /*
   * ============================================================
   * SEARCH
   * ============================================================
   */

  const normalizedSearch =
    normalizeText(searchTerm);

  const filteredValidationResults =
    useMemo(() => {
      let results =
        validationResults;

      if (
        activeValidationFilter ===
        "duplicates"
      ) {
        const duplicateIds =
          new Set(
            duplicateGroups.flatMap(
              (group) =>
                group.questions.map(
                  (question) =>
                    question.localId,
                ),
            ),
          );

        results = results.filter(
          (result) =>
            duplicateIds.has(
              result.question.localId,
            ),
        );
      }

      if (
        normalizedSearch
      ) {
        results = results.filter(
          (result) =>
            normalizeText(
              result.question.question,
            ).includes(
              normalizedSearch,
            ) ||
            normalizeText(
              result.question.topic,
            ).includes(
              normalizedSearch,
            ) ||
            result.issues.some(
              (issue) =>
                normalizeText(
                  issue.message,
                ).includes(
                  normalizedSearch,
                ),
            ),
        );
      }

      return results;
    }, [
      validationResults,
      activeValidationFilter,
      duplicateGroups,
      normalizedSearch,
    ]);

  const filteredDuplicateGroups =
    useMemo(() => {
      if (!normalizedSearch) {
        return duplicateGroups;
      }

      return duplicateGroups.filter(
        (group) =>
          group.questions.some(
            (question) =>
              normalizeText(
                question.question,
              ).includes(
                normalizedSearch,
              ) ||
              normalizeText(
                question.topic,
              ).includes(
                normalizedSearch,
              ) ||
              question.options.some(
                (option) =>
                  normalizeText(
                    option.value,
                  ).includes(
                    normalizedSearch,
                  ),
              ),
          ),
      );
    }, [
      duplicateGroups,
      normalizedSearch,
    ]);

  const filteredCrossDifficulty =
    useMemo(() => {
      if (!normalizedSearch) {
        return crossDifficultyDuplicates;
      }

      return crossDifficultyDuplicates.filter(
        (pair) =>
          normalizeText(
            pair.first.question,
          ).includes(
            normalizedSearch,
          ) ||
          normalizeText(
            pair.second.question,
          ).includes(
            normalizedSearch,
          ) ||
          normalizeText(
            pair.first.topic,
          ).includes(
            normalizedSearch,
          ) ||
          normalizeText(
            pair.second.topic,
          ).includes(
            normalizedSearch,
          ),
      );
    }, [
      crossDifficultyDuplicates,
      normalizedSearch,
    ]);

  /*
   * ============================================================
   * STATUS
   * ============================================================
   */

  const hasLoadedQuestions =
    questions.length > 0;

  const hasDuplicates =
    duplicateGroups.length > 0;

  const hasCrossDifficultyDuplicates =
    crossDifficultyDuplicates.length >
    0;

  const hasValidationErrors =
    validationResults.length > 0;

  const isClean =
    hasLoadedQuestions &&
    !hasDuplicates &&
    !hasValidationErrors;

  /*
   * ============================================================
   * RESET SESSION
   * ============================================================
   */

  function resetValidationSession() {
    setQuestions([]);
    setSearchTerm("");
    setExpandedGroups([]);
    setExpandedValidationIds([]);
    setActiveValidationFilter(
      "all",
    );
    setSuccessMessage("");
    setPageError("");
    setCopiedQuestionId(null);
  }

  /*
   * ============================================================
   * LOAD QUESTION BANKS
   * ============================================================
   */

  function loadQuestionFile() {
    if (!selectedSubject) {
      setPageError(
        "Please select a subject first.",
      );
      return;
    }

    setLoadingBank(true);
    setPageError("");
    setSuccessMessage("");
    setSearchTerm("");
    setExpandedGroups([]);
    setExpandedValidationIds([]);
    setActiveValidationFilter(
      "all",
    );
    setCopiedQuestionId(null);

    try {
      const banks =
        getQuestionBanks(
          selectedSubject.name,
          selectedExamType,
        );

      const total =
        banks.easy.length +
        banks.medium.length +
        banks.hard.length;

      if (total === 0) {
        setQuestions([]);

        setPageError(
          `No ${selectedExamType.toUpperCase()} question banks are registered for ${selectedSubject.name}.`,
        );

        return;
      }

      const loadedQuestions: QuestionWithId[] =
        [
          ...convertBankToLocal(
            banks.easy,
            "easy",
          ),
          ...convertBankToLocal(
            banks.medium,
            "medium",
          ),
          ...convertBankToLocal(
            banks.hard,
            "hard",
          ),
        ];

      setQuestions(
        loadedQuestions,
      );

      setSuccessMessage(
        `${loadedQuestions.length.toLocaleString()} questions loaded for validation: Easy ${banks.easy.length.toLocaleString()}, Medium ${banks.medium.length.toLocaleString()}, Hard ${banks.hard.length.toLocaleString()}.`,
      );
    } catch (error) {
      console.error(
        "Failed to load question banks:",
        error,
      );

      setQuestions([]);

      setPageError(
        "The question banks could not be loaded. Check the question bank registry and source files.",
      );
    } finally {
      setLoadingBank(false);
    }
  }

  /*
   * ============================================================
   * COPY ONE QUESTION
   * ============================================================
   */

  async function handleCopyQuestion(
    question: QuestionWithId,
  ) {
    try {
      const text =
        formatQuestionForCopy(
          question,
        );

      await copyTextToClipboard(
        text,
      );

      setCopiedQuestionId(
        question.localId,
      );

      setSuccessMessage(
        "Question copied to clipboard. You can paste it directly into your question bank.",
      );

      window.setTimeout(() => {
        setCopiedQuestionId(
          (current) =>
            current ===
            question.localId
              ? null
              : current,
        );
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy question:",
        error,
      );

      setPageError(
        "Unable to copy the question. Please check your browser clipboard permissions.",
      );
    }
  }

  /*
   * ============================================================
   * COPY ALL CURRENTLY DISPLAYED ERRORS
   * ============================================================
   */

  async function handleCopyAllErrors() {
    if (
      filteredValidationResults.length ===
      0
    ) {
      return;
    }

    try {
      const questionsToCopy =
        filteredValidationResults.map(
          (result) =>
            result.question,
        );

      const header = `// ${selectedSubject?.name ?? "Subject"} — ${selectedExamType.toUpperCase()}\n// Validation errors: ${questionsToCopy.length}\n\n`;

      const text =
        header +
        formatQuestionsForCopy(
          questionsToCopy,
        );

      await copyTextToClipboard(
        text,
      );

      setCopiedQuestionId(
        "all-errors",
      );

      setSuccessMessage(
        `${questionsToCopy.length.toLocaleString()} validation-error questions copied to clipboard.`,
      );

      window.setTimeout(() => {
        setCopiedQuestionId(
          (current) =>
            current ===
            "all-errors"
              ? null
              : current,
        );
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to copy validation errors:",
        error,
      );

      setPageError(
        "Unable to copy the validation-error questions. Please check your browser clipboard permissions.",
      );
    }
  }

  /*
   * ============================================================
   * TOGGLE GROUP
   * ============================================================
   */

  function toggleGroup(
    fingerprint: string,
  ) {
    setExpandedGroups(
      (current) =>
        current.includes(
          fingerprint,
        )
          ? current.filter(
              (value) =>
                value !==
                fingerprint,
            )
          : [
              ...current,
              fingerprint,
            ],
    );
  }

  /*
   * ============================================================
   * TOGGLE VALIDATION RESULT
   * ============================================================
   */

  function toggleValidationResult(
    localId: string,
  ) {
    setExpandedValidationIds(
      (current) =>
        current.includes(localId)
          ? current.filter(
              (id) =>
                id !== localId,
            )
          : [
              ...current,
              localId,
            ],
    );
  }

  /*
   * ============================================================
   * RENDER HELPERS
   * ============================================================
   */

  function renderDifficultyBadge(
    difficulty: QuestionDifficulty,
  ) {
    return (
      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${DIFFICULTY_COLORS[difficulty]}`}
      >
        {DIFFICULTY_LABELS[difficulty]}
      </span>
    );
  }

  function getQuestionValidationIssues(
    localId: string,
  ) {
    return (
      validationResults.find(
        (result) =>
          result.question.localId ===
          localId,
      )?.issues ?? []
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8">
          <Link
            href="/admin/secondary/solveandwin"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Solve & Win
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Question Bank Validator
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Validate Question Banks
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Validate your Easy, Medium, and
                Hard question banks before they
                are used by the application.
                This page only performs validation
                in memory.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
              <Database className="h-5 w-5 text-cyan-400" />

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Validation Mode
                </p>

                <p className="text-sm font-bold text-slate-200">
                  Read-only
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ALERTS */}

        {pageError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

            <p>{pageError}</p>

            <button
              type="button"
              onClick={() =>
                setPageError("")
              }
              className="ml-auto rounded-lg p-1 text-red-300 hover:bg-red-500/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <p>{successMessage}</p>

            <button
              type="button"
              onClick={() =>
                setSuccessMessage("")
              }
              className="ml-auto rounded-lg p-1 text-emerald-300 hover:bg-emerald-500/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* SELECTOR */}

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
              <BookOpen className="h-5 w-5 text-cyan-400" />
            </div>

            <div>
              <h2 className="font-bold text-white">
                Select Question Banks
              </h2>

              <p className="text-sm text-slate-500">
                Choose the subject and exam.
                All three difficulty folders
                will be validated together.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Subject
              </label>

              <select
                value={
                  selectedSubjectId
                }
                onChange={(event) => {
                  setSelectedSubjectId(
                    event.target.value,
                  );

                  resetValidationSession();
                }}
                disabled={
                  loadingSubjects
                }
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
              >
                {loadingSubjects ? (
                  <option value="">
                    Loading subjects...
                  </option>
                ) : subjects.length ===
                  0 ? (
                  <option value="">
                    No subjects available
                  </option>
                ) : (
                  subjects.map(
                    (subject) => (
                      <option
                        key={
                          subject._id
                        }
                        value={
                          subject._id
                        }
                      >
                        {
                          subject.name
                        }
                      </option>
                    ),
                  )
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Exam Type
              </label>

              <select
                value={
                  selectedExamType
                }
                onChange={(event) => {
                  setSelectedExamType(
                    event.target
                      .value as ExamType,
                  );

                  resetValidationSession();
                }}
                className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
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

            <div className="flex items-end">
              <button
                type="button"
                onClick={
                  loadQuestionFile
                }
                disabled={
                  loadingBank ||
                  loadingSubjects ||
                  !selectedSubject
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingBank ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading Banks...
                  </>
                ) : (
                  <>
                    <Layers3 className="h-4 w-4" />
                    Load All Banks
                  </>
                )}
              </button>
            </div>
          </div>

          {selectedSubject && (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Subject
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {
                      selectedSubject.name
                    }
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Exam
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {selectedExamType.toUpperCase()}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Registered Questions
                  </p>

                  <p className="mt-1 text-sm font-black text-cyan-300">
                    {availableTotal.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                    Validation
                  </p>

                  <p className="mt-1 text-sm font-black text-emerald-300">
                    Easy ↔ Medium ↔ Hard
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {DIFFICULTIES.map(
                  (difficulty) => (
                    <span
                      key={
                        difficulty
                      }
                      className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${DIFFICULTY_COLORS[difficulty]}`}
                    >
                      {
                        DIFFICULTY_LABELS[
                          difficulty
                        ]
                      }
                      :{" "}
                      {availableBanks[
                        difficulty
                      ].length.toLocaleString()}
                    </span>
                  ),
                )}
              </div>
            </>
          )}
        </section>

        {/* STATISTICS */}

        {hasLoadedQuestions && (
          <>
            <section className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Loaded
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {questions.length.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Questions under validation
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Easy
                </p>

                <p className="mt-2 text-3xl font-black text-emerald-300">
                  {difficultyStats.easy.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  easy/{selectedExamType}.ts
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Medium
                </p>

                <p className="mt-2 text-3xl font-black text-cyan-300">
                  {difficultyStats.medium.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  medium/{selectedExamType}.ts
                </p>
              </div>

              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Hard
                </p>

                <p className="mt-2 text-3xl font-black text-purple-300">
                  {difficultyStats.hard.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  hard/{selectedExamType}.ts
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Unique
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {uniqueQuestionCount.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  After duplicate grouping
                </p>
              </div>
            </section>

            {/* CROSS DIFFICULTY */}

            <section className="mb-8 grid gap-4 md:grid-cols-3">
              {[
                {
                  label:
                    "Easy ↔ Medium",
                  value:
                    crossPairStats.easyMedium,
                },
                {
                  label:
                    "Easy ↔ Hard",
                  value:
                    crossPairStats.easyHard,
                },
                {
                  label:
                    "Medium ↔ Hard",
                  value:
                    crossPairStats.mediumHard,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                      {item.label}
                    </p>

                    <Copy className="h-4 w-4 text-amber-400" />
                  </div>

                  <p className="mt-2 text-3xl font-black text-amber-300">
                    {item.value.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Exact question overlap
                  </p>
                </div>
              ))}
            </section>
          </>
        )}

        {/* VALIDATION SUMMARY */}

        {hasLoadedQuestions && (
          <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  {isClean ? (
                    <CircleCheck className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <CircleX className="h-6 w-6 text-red-400" />
                  )}

                  <h2 className="text-xl font-black text-white">
                    Validation Summary
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  {isClean
                    ? "All loaded question banks passed the current validation rules."
                    : "One or more validation checks require review."}
                </p>
              </div>

              <div
                className={`rounded-2xl px-5 py-3 text-center ${
                  isClean
                    ? "bg-emerald-400/10"
                    : "bg-red-400/10"
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Result
                </p>

                <p
                  className={`mt-1 text-lg font-black ${
                    isClean
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  {isClean
                    ? "PASS"
                    : "REVIEW REQUIRED"}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Questions With Errors
                </p>

                <p
                  className={`mt-1 text-2xl font-black ${
                    validationErrorCount ===
                    0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {validationErrorCount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Validation Issues
                </p>

                <p
                  className={`mt-1 text-2xl font-black ${
                    validationIssueCount ===
                    0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {validationIssueCount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Duplicate Groups
                </p>

                <p
                  className={`mt-1 text-2xl font-black ${
                    duplicateGroupCount ===
                    0
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {duplicateGroupCount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Cross-Difficulty
                </p>

                <p
                  className={`mt-1 text-2xl font-black ${
                    crossDifficultyDuplicates.length ===
                    0
                      ? "text-emerald-400"
                      : "text-cyan-400"
                  }`}
                >
                  {crossDifficultyDuplicates.length.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Question Text",
                  valid:
                    !validationResults.some(
                      (result) =>
                        result.issues.some(
                          (issue) =>
                            issue.type ===
                            "question",
                        ),
                    ),
                },
                {
                  label: "Options",
                  valid:
                    !validationResults.some(
                      (result) =>
                        result.issues.some(
                          (issue) =>
                            issue.type ===
                            "options",
                        ),
                    ),
                },
                {
                  label: "Correct Answers",
                  valid:
                    !validationResults.some(
                      (result) =>
                        result.issues.some(
                          (issue) =>
                            issue.type ===
                            "answers",
                        ),
                    ),
                },
                {
                  label: "Difficulty",
                  valid:
                    difficultyValidationErrors.length ===
                    0,
                },
                {
                  label: "Exam Type",
                  valid:
                    !validationResults.some(
                      (result) =>
                        result.issues.some(
                          (issue) =>
                            issue.type ===
                            "exam",
                        ),
                    ),
                },
                {
                  label: "Subject",
                  valid:
                    !validationResults.some(
                      (result) =>
                        result.issues.some(
                          (issue) =>
                            issue.type ===
                            "subject",
                        ),
                    ),
                },
                {
                  label: "Content",
                  valid:
                    !validationResults.some(
                      (result) =>
                        result.issues.some(
                          (issue) =>
                            issue.type ===
                            "content",
                        ),
                    ),
                },
                {
                  label: "Explanation",
                  valid:
                    !validationResults.some(
                      (result) =>
                        result.issues.some(
                          (issue) =>
                            issue.type ===
                            "explanation",
                        ),
                    ),
                },
              ].map(
                (check) => (
                  <div
                    key={
                      check.label
                    }
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                      check.valid
                        ? "border-emerald-500/10 bg-emerald-500/5"
                        : "border-red-500/10 bg-red-500/5"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-300">
                      {check.label}
                    </span>

                    {check.valid ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                ),
              )}
            </div>
          </section>
        )}

        {/* VALIDATION ERRORS */}

        {hasLoadedQuestions &&
          validationResults.length >
            0 && (
            <section className="mb-8 overflow-hidden rounded-3xl border border-red-500/20 bg-slate-900">
              <div className="border-b border-slate-800 p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-red-400" />

                      <h2 className="text-xl font-black text-white">
                        Validation Errors
                      </h2>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      These questions contain one
                      or more schema or data
                      integrity problems.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        [
                          "all",
                          "All Errors",
                        ],
                        [
                          "errors",
                          "All Validation",
                        ],
                        [
                          "duplicates",
                          "Duplicates",
                        ],
                      ] as const
                    ).map(
                      ([
                        value,
                        label,
                      ]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setActiveValidationFilter(
                              value,
                            )
                          }
                          className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                            activeValidationFilter ===
                            value
                              ? "bg-red-500 text-white"
                              : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {label}
                        </button>
                      ),
                    )}

                    {/* COPY ALL ERRORS */}
                    <button
                      type="button"
                      onClick={
                        handleCopyAllErrors
                      }
                      disabled={
                        filteredValidationResults.length ===
                        0
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs font-black text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {copiedQuestionId ===
                      "all-errors" ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy All Errors
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-500" />

                  <input
                    value={
                      searchTerm
                    }
                    onChange={(
                      event,
                    ) =>
                      setSearchTerm(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Search questions, topics, or validation errors..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />

                  <Filter className="h-4 w-4 text-slate-600" />
                </div>

                {/* COPY INFORMATION */}
                <div className="mt-4 rounded-xl border border-cyan-400/10 bg-cyan-400/5 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Copy className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />

                    <p className="text-xs leading-5 text-cyan-200/70">
                      Use{" "}
                      <strong className="text-cyan-300">
                        Copy
                      </strong>{" "}
                      on an individual question
                      to copy its complete
                      TypeScript question object,
                      or use{" "}
                      <strong className="text-cyan-300">
                        Copy All Errors
                      </strong>{" "}
                      to copy every currently
                      filtered validation error.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-800">
                {filteredValidationResults.map(
                  (
                    result,
                    index,
                  ) => {
                    const isExpanded =
                      expandedValidationIds.includes(
                        result
                          .question
                          .localId,
                      );

                    const isCopied =
                      copiedQuestionId ===
                      result
                        .question
                        .localId;

                    return (
                      <div
                        key={
                          result
                            .question
                            .localId
                        }
                      >
                        {/* QUESTION HEADER */}

                        <div className="flex items-start gap-3 p-5 transition hover:bg-slate-800/30 sm:p-6">
                          <button
                            type="button"
                            onClick={() =>
                              toggleValidationResult(
                                result
                                  .question
                                  .localId,
                              )
                            }
                            className="flex min-w-0 flex-1 items-start justify-between gap-4 text-left"
                          >
                            <div className="flex min-w-0 items-start gap-4">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-xs font-black text-red-300">
                                {index +
                                  1}
                              </div>

                              <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
                                    {
                                      result
                                        .issues
                                        .length
                                    }{" "}
                                    issue
                                    {result
                                      .issues
                                      .length ===
                                    1
                                      ? ""
                                      : "s"}
                                  </span>

                                  {renderDifficultyBadge(
                                    result
                                      .question
                                      .difficultySource,
                                  )}

                                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    Index{" "}
                                    {
                                      result
                                        .question
                                        .sourceIndex
                                    }
                                  </span>
                                </div>

                                <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-200">
                                  {
                                    result
                                      .question
                                      .question
                                  }
                                </p>
                              </div>
                            </div>

                            <ChevronDown
                              className={`h-5 w-5 shrink-0 text-slate-500 transition ${
                                isExpanded
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>

                          {/* INDIVIDUAL COPY BUTTON */}

                          <button
                            type="button"
                            title="Copy complete question"
                            aria-label="Copy complete question"
                            onClick={() =>
                              handleCopyQuestion(
                                result.question,
                              )
                            }
                            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-black transition ${
                              isCopied
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                : "border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                  Copy
                                </span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* EXPANDED ERROR DETAILS */}

                        {isExpanded && (
                          <div className="bg-slate-950/70 px-5 pb-6 sm:px-6">
                            <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-5">
                              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap gap-2">
                                  {result.issues.map(
                                    (
                                      issue,
                                      issueIndex,
                                    ) => (
                                      <span
                                        key={`${result.question.localId}-issue-${issueIndex}`}
                                        className="rounded-full bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300"
                                      >
                                        {
                                          issue.type
                                        }
                                      </span>
                                    ),
                                  )}
                                </div>

                                {/* LARGE COPY BUTTON */}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyQuestion(
                                      result.question,
                                    )
                                  }
                                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                                    isCopied
                                      ? "bg-emerald-400/10 text-emerald-300"
                                      : "bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
                                  }`}
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="h-4 w-4" />
                                      Question Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4" />
                                      Copy Question
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="space-y-2">
                                {result.issues.map(
                                  (
                                    issue,
                                    issueIndex,
                                  ) => (
                                    <div
                                      key={`${result.question.localId}-message-${issueIndex}`}
                                      className="flex items-start gap-3 rounded-xl bg-slate-950 p-3"
                                    >
                                      <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

                                      <p className="text-xs leading-5 text-slate-300">
                                        {
                                          issue.message
                                        }
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>

                              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl bg-slate-950 p-3">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                    Source
                                  </p>

                                  <p className="mt-1 text-xs font-bold text-white">
                                    {getSourcePath(
                                      selectedSubject?.name ??
                                        "subject",
                                      result
                                        .question
                                        .difficultySource,
                                      selectedExamType,
                                    )}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-slate-950 p-3">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                    Topic
                                  </p>

                                  <p className="mt-1 text-xs font-bold text-white">
                                    {result
                                      .question
                                      .topic ||
                                      "Missing"}
                                  </p>
                                </div>

                                <div className="rounded-xl bg-slate-950 p-3">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                    Difficulty
                                  </p>

                                  <p className="mt-1 text-xs font-bold text-white">
                                    {
                                      result
                                        .question
                                        .difficulty
                                    }
                                  </p>
                                </div>

                                <div className="rounded-xl bg-slate-950 p-3">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                    Exam
                                  </p>

                                  <p className="mt-1 text-xs font-bold text-white">
                                    {result
                                      .question
                                      .examType
                                      .toUpperCase()}
                                  </p>
                                </div>
                              </div>

                              {/* QUESTION PREVIEW */}

                              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                    Question Preview
                                  </p>

                                  <span className="text-[10px] font-bold text-slate-600">
                                    Source Index{" "}
                                    {
                                      result
                                        .question
                                        .sourceIndex
                                    }
                                  </span>
                                </div>

                                <p className="text-sm font-semibold leading-6 text-slate-200">
                                  {
                                    result
                                      .question
                                      .question
                                  }
                                </p>

                                <div className="mt-4 grid gap-2">
                                  {result.question.options.map(
                                    (
                                      option,
                                      optionIndex,
                                    ) => (
                                      <div
                                        key={`${result.question.localId}-preview-option-${optionIndex}`}
                                        className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3"
                                      >
                                        <span className="mr-2 font-black text-slate-300">
                                          {
                                            option.label
                                          }
                                          .
                                        </span>

                                        <span className="text-xs text-slate-400">
                                          {
                                            option.value
                                          }
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  },
                )}

                {filteredValidationResults.length ===
                  0 && (
                  <div className="p-12 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />

                    <p className="mt-4 text-sm font-bold text-emerald-300">
                      No matching validation errors
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

        {/* DUPLICATES */}

        {hasLoadedQuestions &&
          hasDuplicates && (
            <section className="overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-900">
              <div className="border-b border-slate-800 p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <Copy className="h-5 w-5 text-amber-400" />

                      <h2 className="text-xl font-black text-white">
                        Exact Duplicate Questions
                      </h2>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Questions with matching
                      normalized question text
                      and option values are grouped
                      together.
                    </p>
                  </div>

                  <div className="rounded-xl bg-amber-400/10 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                      Duplicate Copies
                    </p>

                    <p className="mt-1 text-xl font-black text-amber-300">
                      {duplicateCopiesCount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-500" />

                  <input
                    value={
                      searchTerm
                    }
                    onChange={(
                      event,
                    ) =>
                      setSearchTerm(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Search duplicate questions..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-800">
                {filteredDuplicateGroups.map(
                  (
                    group,
                    groupIndex,
                  ) => {
                    const isExpanded =
                      expandedGroups.includes(
                        group.fingerprint,
                      );

                    const sourceDifficulties =
                      new Set(
                        group.questions.map(
                          (question) =>
                            question.difficultySource,
                        ),
                      );

                    const isCrossDifficulty =
                      sourceDifficulties.size >
                      1;

                    return (
                      <div
                        key={
                          group.fingerprint
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggleGroup(
                              group.fingerprint,
                            )
                          }
                          className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-800/50 sm:p-6"
                        >
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-sm font-black text-amber-300">
                              {groupIndex +
                                1}
                            </div>

                            <div className="min-w-0">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
                                  {
                                    group
                                      .questions
                                      .length
                                  }{" "}
                                  copies
                                </span>

                                {isCrossDifficulty && (
                                  <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                                    Cross-Difficulty
                                  </span>
                                )}
                              </div>

                              <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-200">
                                {
                                  group
                                    .questions[0]
                                    .question
                                }
                              </p>
                            </div>
                          </div>

                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-slate-500 transition ${
                              isExpanded
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="space-y-4 bg-slate-950/60 px-5 pb-6 sm:px-6">
                            {group.questions.map(
                              (
                                question,
                                questionIndex,
                              ) => {
                                const isFirst =
                                  questionIndex ===
                                  0;

                                const questionIssues =
                                  getQuestionValidationIssues(
                                    question.localId,
                                  );

                                const isCopied =
                                  copiedQuestionId ===
                                  question.localId;

                                return (
                                  <div
                                    key={
                                      question.localId
                                    }
                                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                                  >
                                    <div className="flex flex-col gap-4">
                                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                          <div className="mb-3 flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                                              Copy{" "}
                                              {questionIndex +
                                                1}
                                            </span>

                                            {renderDifficultyBadge(
                                              question.difficultySource,
                                            )}

                                            <span
                                              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                                                isFirst
                                                  ? "bg-emerald-400/10 text-emerald-300"
                                                  : "bg-red-400/10 text-red-300"
                                              }`}
                                            >
                                              {isFirst
                                                ? "First occurrence"
                                                : "Duplicate"}
                                            </span>

                                            {questionIssues.length >
                                              0 && (
                                              <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
                                                {
                                                  questionIssues.length
                                                }{" "}
                                                validation
                                                issue
                                                {questionIssues.length ===
                                                1
                                                  ? ""
                                                  : "s"}
                                              </span>
                                            )}
                                          </div>

                                          <p className="text-sm font-semibold leading-6 text-slate-200">
                                            {
                                              question.question
                                            }
                                          </p>

                                          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                            <div className="rounded-xl bg-slate-950 p-3">
                                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                                Difficulty
                                              </p>

                                              <p className="mt-1 text-xs font-bold text-white">
                                                {
                                                  question.difficulty
                                                }
                                              </p>
                                            </div>

                                            <div className="rounded-xl bg-slate-950 p-3">
                                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                                Source Folder
                                              </p>

                                              <p className="mt-1 text-xs font-bold text-white">
                                                {
                                                  question.difficultySource
                                                }
                                              </p>
                                            </div>

                                            <div className="rounded-xl bg-slate-950 p-3">
                                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                                Source Index
                                              </p>

                                              <p className="mt-1 text-xs font-bold text-white">
                                                {
                                                  question.sourceIndex
                                                }
                                              </p>
                                            </div>

                                            <div className="rounded-xl bg-slate-950 p-3">
                                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                                                Topic
                                              </p>

                                              <p className="mt-1 text-xs font-bold text-white">
                                                {question.topic ||
                                                  "Missing"}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="mt-4 grid gap-2">
                                            {question.options.map(
                                              (
                                                option,
                                                optionIndex,
                                              ) => (
                                                <div
                                                  key={`${question.localId}-${optionIndex}`}
                                                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
                                                >
                                                  <span className="mr-2 font-black text-slate-300">
                                                    {
                                                      option.label
                                                    }
                                                    .
                                                  </span>

                                                  <span className="text-xs text-slate-400">
                                                    {
                                                      option.value
                                                    }
                                                  </span>
                                                </div>
                                              ),
                                            )}
                                          </div>
                                        </div>

                                        {/* COPY DUPLICATE */}

                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCopyQuestion(
                                              question,
                                            )
                                          }
                                          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                                            isCopied
                                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                              : "border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                                          }`}
                                        >
                                          {isCopied ? (
                                            <>
                                              <Check className="h-4 w-4" />
                                              Copied
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="h-4 w-4" />
                                              Copy
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </section>
          )}

        {/* CROSS DIFFICULTY */}

        {hasLoadedQuestions &&
          hasCrossDifficultyDuplicates && (
            <section className="mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-cyan-400/5">
              <div className="border-b border-cyan-400/10 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <Layers3 className="mt-0.5 h-5 w-5 text-cyan-400" />

                  <div>
                    <h2 className="text-xl font-black text-white">
                      Cross-Difficulty Duplicates
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      The same question exists in
                      more than one difficulty
                      bank.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                      Easy ↔ Medium
                    </p>

                    <p className="mt-1 text-2xl font-black text-amber-300">
                      {
                        crossPairStats.easyMedium
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                      Easy ↔ Hard
                    </p>

                    <p className="mt-1 text-2xl font-black text-amber-300">
                      {
                        crossPairStats.easyHard
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                      Medium ↔ Hard
                    </p>

                    <p className="mt-1 text-2xl font-black text-amber-300">
                      {
                        crossPairStats.mediumHard
                      }
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-cyan-400/10 bg-slate-950 px-4 py-3">
                  <Search className="h-4 w-4 text-slate-500" />

                  <input
                    value={
                      searchTerm
                    }
                    onChange={(
                      event,
                    ) =>
                      setSearchTerm(
                        event.target
                          .value,
                      )
                    }
                    placeholder="Search cross-difficulty duplicates..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="divide-y divide-cyan-400/10">
                {filteredCrossDifficulty.map(
                  (
                    pair,
                    index,
                  ) => (
                    <div
                      key={`${pair.key}-${index}`}
                      className="p-5 sm:p-6"
                    >
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300">
                          Exact Overlap
                        </span>

                        <span className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                          {pair.label}
                        </span>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
                        {[pair.first, pair.second].map(
                          (item) => {
                            const isCopied =
                              copiedQuestionId ===
                              item.localId;

                            return (
                              <div
                                key={
                                  item.localId
                                }
                                className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                              >
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {renderDifficultyBadge(
                                      item.difficultySource,
                                    )}

                                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
                                      Index{" "}
                                      {
                                        item.sourceIndex
                                      }
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCopyQuestion(
                                        item,
                                      )
                                    }
                                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-black transition ${
                                      isCopied
                                        ? "bg-emerald-400/10 text-emerald-300"
                                        : "bg-slate-800 text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-300"
                                    }`}
                                  >
                                    {isCopied ? (
                                      <>
                                        <Check className="h-3.5 w-3.5" />
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3.5 w-3.5" />
                                        Copy
                                      </>
                                    )}
                                  </button>
                                </div>

                                <p className="text-sm font-semibold leading-6 text-slate-200">
                                  {
                                    item.question
                                  }
                                </p>

                                <div className="mt-4 space-y-2 text-xs text-slate-500">
                                  <p>
                                    Topic:{" "}
                                    <strong className="text-slate-300">
                                      {
                                        item.topic
                                      }
                                    </strong>
                                  </p>

                                  <p>
                                    Source:{" "}
                                    <strong className="text-slate-300">
                                      {getSourcePath(
                                        selectedSubject?.name ??
                                          "subject",
                                        item.difficultySource,
                                        selectedExamType,
                                      )}
                                    </strong>
                                  </p>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

        {/* CLEAN STATE */}

        {isClean && (
          <section className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-black text-emerald-300">
                    Validation Passed
                  </h2>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                    PASS
                  </span>
                </div>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-200/70">
                  No exact duplicates, cross-difficulty
                  duplicates, difficulty mismatches,
                  structural errors, subject mismatches,
                  exam-type mismatches, or content
                  validation errors were detected.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {DIFFICULTIES.map(
                    (difficulty) => (
                      <span
                        key={
                          difficulty
                        }
                        className={`rounded-full px-3 py-1.5 text-xs font-black ${DIFFICULTY_COLORS[difficulty]}`}
                      >
                        {
                          DIFFICULTY_LABELS[
                            difficulty
                          ]
                        }
                        :{" "}
                        {difficultyStats[
                          difficulty
                        ].toLocaleString()}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* NO ERRORS */}

        {hasLoadedQuestions &&
          !hasDuplicates &&
          !hasValidationErrors && (
            <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-start gap-4">
                <CircleCheck className="h-6 w-6 shrink-0 text-emerald-400" />

                <div>
                  <h3 className="font-black text-white">
                    All validation checks passed
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    The loaded Easy, Medium, and
                    Hard banks currently contain
                    no detected validation problems.
                  </p>
                </div>
              </div>
            </section>
          )}

        {/* EMPTY STATE */}

        {!hasLoadedQuestions &&
          !loadingBank && (
            <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
                <FileSearch className="h-7 w-7 text-slate-500" />
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-300">
                No Question Banks Loaded
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Select a subject and exam type,
                then click Load All Banks to run
                the validator.
              </p>
            </section>
          )}

        {/* VALIDATION SESSION INFO */}

        {hasLoadedQuestions && (
          <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-black text-white">
                  Validation Session
                </h2>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                  This page reads your imported
                  TypeScript question banks and
                  validates them in memory. It does
                  not modify the source files or
                  send anything to the backend.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  loadQuestionFile
                }
                disabled={loadingBank}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-black text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Banks
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Current Questions
                </p>

                <p className="mt-1 text-xl font-black text-white">
                  {questions.length.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Validation Issues
                </p>

                <p
                  className={`mt-1 text-xl font-black ${
                    validationIssueCount ===
                    0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {validationIssueCount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Duplicate Groups
                </p>

                <p
                  className={`mt-1 text-xl font-black ${
                    duplicateGroupCount ===
                    0
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {duplicateGroupCount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs font-bold text-slate-600">
                  Cross-Difficulty
                </p>

                <p
                  className={`mt-1 text-xl font-black ${
                    crossDifficultyDuplicates.length ===
                    0
                      ? "text-emerald-400"
                      : "text-cyan-400"
                  }`}
                >
                  {crossDifficultyDuplicates.length.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-start gap-3">
                <Eye className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Read-only validation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    The validator does not delete,
                    rewrite, export, upload, or save
                    your questions. Any corrections
                    must be made directly in your
                    source question files.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" />

                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Expected Source Structure
                </p>
              </div>

              <div className="space-y-1 font-mono text-[11px] text-slate-500">
                <p>
                  {selectedSubject?.name
                    .toLowerCase()
                    .replace(
                      /[^a-z0-9]+/g,
                      "",
                    ) ?? "subject"}
                  /easy/
                  {
                    selectedExamType
                  }
                  .ts
                </p>

                <p>
                  {selectedSubject?.name
                    .toLowerCase()
                    .replace(
                      /[^a-z0-9]+/g,
                      "",
                    ) ?? "subject"}
                  /medium/
                  {
                    selectedExamType
                  }
                  .ts
                </p>

                <p>
                  {selectedSubject?.name
                    .toLowerCase()
                    .replace(
                      /[^a-z0-9]+/g,
                      "",
                    ) ?? "subject"}
                  /hard/
                  {
                    selectedExamType
                  }
                  .ts
                </p>
              </div>
            </div>
          </section>
        )}

        {/* FOOTER NOTE */}

        <div className="mt-8 flex items-center justify-center gap-2 pb-8 text-center text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4" />
          Validation runs against the question
          banks registered by your question-bank
          loader.
        </div>
      </div>
    </main>
  );
}



















// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   AlertCircle,
//   AlertTriangle,
//   ArrowLeft,
//   BookOpen,
//   CheckCircle2,
//   ChevronDown,
//   CircleCheck,
//   CircleX,
//   Copy,
//   Database,
//   Eye,
//   FileSearch,
//   Filter,
//   Layers3,
//   Loader2,
//   RefreshCw,
//   Search,
//   ShieldCheck,
//   X,
// } from "lucide-react";

// import { getSubjectsByPlan } from "@/lib/api/subjects";
// import {
//   getQuestionBanks,
//   type QuestionDifficulty,
// } from "../../competitions/createquestion/questions";

// type ExamType = "jamb" | "waec" | "neco";

// type Subject = {
//   _id: string;
//   name: string;
//   slug?: string;
// };

// type ContentSegment = {
//   text: string;
//   styles: string[];
// };

// type QuestionContent = {
//   type: "text";
//   order: number;
//   segments: ContentSegment[];
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
// };

// type QuestionOption = {
//   label: string;
//   value: string;
// };

// type QuestionBankItem = {
//   content: QuestionContent[];
//   question: string;
//   instruction: string;
//   topic: string;
//   section: string;
//   options: QuestionOption[];
//   correctAnswers: string[];
//   explanation: string;
//   explanationSteps: string[];
//   difficulty: "easy" | "medium" | "hard";
//   examType: ExamType;
//   apiSubjectName: string;
//   isMultipleAnswer: boolean;
// };

// type QuestionWithId = QuestionBankItem & {
//   localId: string;
//   difficultySource: QuestionDifficulty;
//   sourceIndex: number;
// };

// type ValidationIssueType =
//   | "question"
//   | "instruction"
//   | "topic"
//   | "section"
//   | "options"
//   | "answers"
//   | "content"
//   | "explanation"
//   | "difficulty"
//   | "exam"
//   | "subject"
//   | "multiple-answer";

// type ValidationIssue = {
//   type: ValidationIssueType;
//   message: string;
// };

// type QuestionValidationResult = {
//   question: QuestionWithId;
//   issues: ValidationIssue[];
// };

// type DuplicateGroup = {
//   fingerprint: string;
//   questions: QuestionWithId[];
// };

// type CrossDifficultyPair = {
//   key: string;
//   label: string;
//   first: QuestionWithId;
//   second: QuestionWithId;
// };

// type DifficultyStats = {
//   easy: number;
//   medium: number;
//   hard: number;
// };

// const DIFFICULTIES: QuestionDifficulty[] = [
//   "easy",
//   "medium",
//   "hard",
// ];

// const DIFFICULTY_LABELS: Record<
//   QuestionDifficulty,
//   string
// > = {
//   easy: "Easy",
//   medium: "Medium",
//   hard: "Hard",
// };

// const DIFFICULTY_COLORS: Record<
//   QuestionDifficulty,
//   string
// > = {
//   easy: "text-emerald-300 bg-emerald-400/10",
//   medium: "text-cyan-300 bg-cyan-400/10",
//   hard: "text-purple-300 bg-purple-400/10",
// };

// function createLocalId(
//   difficulty: QuestionDifficulty,
//   index: number,
// ) {
//   return `question-${difficulty}-${Date.now()}-${index}-${Math.random()
//     .toString(36)
//     .slice(2, 8)}`;
// }

// function normalizeText(value: unknown) {
//   if (typeof value !== "string") {
//     return "";
//   }

//   return value
//     .toLowerCase()
//     .replace(/[“”‘’]/g, "'")
//     .replace(/[–—]/g, "-")
//     .replace(/\s+/g, " ")
//     .replace(/\s+([,.!?;:])/g, "$1")
//     .trim();
// }

// function normalizeForComparison(value: unknown) {
//   return normalizeText(value)
//     .replace(/[()[\]{}]/g, "")
//     .replace(/["']/g, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function getFingerprint(
//   question: QuestionBankItem,
// ) {
//   const questionText =
//     normalizeForComparison(
//       question.question,
//     );

//   const options = (
//     Array.isArray(question.options)
//       ? question.options
//       : []
//   )
//     .map((option) =>
//       normalizeForComparison(
//         option?.value,
//       ),
//     )
//     .sort()
//     .join("|");

//   return [
//     normalizeForComparison(
//       question.apiSubjectName,
//     ),
//     normalizeText(question.examType),
//     questionText,
//     options,
//   ].join("::");
// }

// function convertBankToLocal(
//   bank: QuestionBankItem[],
//   difficultySource: QuestionDifficulty,
// ): QuestionWithId[] {
//   return bank.map((question, index) => ({
//     ...question,

//     localId: createLocalId(
//       difficultySource,
//       index,
//     ),

//     difficultySource,

//     sourceIndex: index,

//     content:
//       Array.isArray(question.content)
//         ? question.content.map(
//             (block) => ({
//               ...block,

//               segments:
//                 Array.isArray(
//                   block.segments,
//                 )
//                   ? block.segments.map(
//                       (segment) => ({
//                         ...segment,
//                         styles:
//                           Array.isArray(
//                             segment.styles,
//                           )
//                             ? [
//                                 ...segment.styles,
//                               ]
//                             : [],
//                       }),
//                     )
//                   : [],

//               table:
//                 Array.isArray(
//                   block.table,
//                 )
//                   ? block.table.map(
//                       (row) => [
//                         ...row,
//                       ],
//                     )
//                   : undefined,

//               graph: block.graph
//                 ? {
//                     ...block.graph,

//                     labels:
//                       Array.isArray(
//                         block.graph
//                           .labels,
//                       )
//                         ? [
//                             ...block.graph
//                               .labels,
//                           ]
//                         : [],

//                     datasets:
//                       Array.isArray(
//                         block.graph
//                           .datasets,
//                       )
//                         ? block.graph.datasets.map(
//                             (
//                               dataset,
//                             ) => ({
//                               ...dataset,
//                               data:
//                                 Array.isArray(
//                                   dataset.data,
//                                 )
//                                   ? [
//                                       ...dataset.data,
//                                     ]
//                                   : [],
//                             }),
//                           )
//                         : [],
//                   }
//                 : undefined,
//             }),
//           )
//         : [],

//     options: Array.isArray(
//       question.options,
//     )
//       ? question.options.map(
//           (option) => ({
//             ...option,
//           }),
//         )
//       : [],

//     correctAnswers:
//       Array.isArray(
//         question.correctAnswers,
//       )
//         ? [
//             ...question.correctAnswers,
//           ]
//         : [],

//     explanationSteps:
//       Array.isArray(
//         question.explanationSteps,
//       )
//         ? [
//             ...question.explanationSteps,
//           ]
//         : [],
//   }));
// }

// function getExpectedDifficulty(
//   source: QuestionDifficulty,
// ): QuestionBankItem["difficulty"] {
//   return source;
// }

// function getSourcePath(
//   subjectName: string,
//   difficulty: QuestionDifficulty,
//   examType: ExamType,
// ) {
//   const subjectSlug = subjectName
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "");

//   return `${subjectSlug}/${difficulty}/${examType}.ts`;
// }

// function validateQuestion(
//   question: QuestionWithId,
//   selectedExamType: ExamType,
//   selectedSubjectName: string,
// ): ValidationIssue[] {
//   const issues: ValidationIssue[] =
//     [];

//   /*
//    * QUESTION
//    */

//   if (
//     typeof question.question !==
//       "string" ||
//     !question.question.trim()
//   ) {
//     issues.push({
//       type: "question",
//       message:
//         "Question text is missing.",
//     });
//   }

//   /*
//    * INSTRUCTION
//    *
//    * Instruction is part of your schema.
//    * We allow an empty instruction because
//    * some valid objective questions may not
//    * require one.
//    */

//   if (
//     typeof question.instruction !==
//     "string"
//   ) {
//     issues.push({
//       type: "instruction",
//       message:
//         "Instruction must be a string.",
//     });
//   }

//   /*
//    * TOPIC
//    */

//   if (
//     typeof question.topic !==
//       "string" ||
//     !question.topic.trim()
//   ) {
//     issues.push({
//       type: "topic",
//       message: "Topic is missing.",
//     });
//   }

//   /*
//    * SECTION
//    */

//   if (
//     typeof question.section !==
//       "string" ||
//     !question.section.trim()
//   ) {
//     issues.push({
//       type: "section",
//       message:
//         "Section is missing.",
//     });
//   }

//   /*
//    * OPTIONS
//    */

//   if (
//     !Array.isArray(question.options)
//   ) {
//     issues.push({
//       type: "options",
//       message:
//         "Options must be an array.",
//     });
//   } else {
//     if (question.options.length !== 4) {
//       issues.push({
//         type: "options",
//         message: `Expected exactly 4 options, found ${question.options.length}.`,
//       });
//     }

//     const labels =
//       question.options.map(
//         (option) =>
//           normalizeText(
//             option?.label,
//           ),
//       );

//     const values =
//       question.options.map(
//         (option) =>
//           normalizeForComparison(
//             option?.value,
//           ),
//       );

//     const duplicateLabels =
//       labels.filter(
//         (label, index) =>
//           label &&
//           labels.indexOf(label) !==
//             index,
//       );

//     if (duplicateLabels.length > 0) {
//       issues.push({
//         type: "options",
//         message:
//           "Option labels contain duplicates.",
//       });
//     }

//     const duplicateValues =
//       values.filter(
//         (value, index) =>
//           value &&
//           values.indexOf(value) !==
//             index,
//       );

//     if (duplicateValues.length > 0) {
//       issues.push({
//         type: "options",
//         message:
//           "Option values contain duplicates.",
//       });
//     }

//     question.options.forEach(
//       (option, index) => {
//         if (
//           !option ||
//           typeof option.label !==
//             "string" ||
//           !option.label.trim()
//         ) {
//           issues.push({
//             type: "options",
//             message: `Option ${index + 1} has no label.`,
//           });
//         }

//         if (
//           !option ||
//           typeof option.value !==
//             "string" ||
//           !option.value.trim()
//         ) {
//           issues.push({
//             type: "options",
//             message: `Option ${index + 1} has no value.`,
//           });
//         }
//       },
//     );
//   }

//   /*
//    * CORRECT ANSWERS
//    */

//   if (
//     !Array.isArray(
//       question.correctAnswers,
//     )
//   ) {
//     issues.push({
//       type: "answers",
//       message:
//         "correctAnswers must be an array.",
//     });
//   } else {
//     if (
//       question.isMultipleAnswer
//     ) {
//       if (
//         question.correctAnswers
//           .length < 1
//       ) {
//         issues.push({
//           type: "multiple-answer",
//           message:
//             "Multiple-answer question must have at least one correct answer.",
//         });
//       }
//     } else if (
//       question.correctAnswers
//         .length !== 1
//     ) {
//       issues.push({
//         type: "answers",
//         message: `Single-answer question must have exactly 1 correct answer, found ${question.correctAnswers.length}.`,
//       });
//     }

//     const optionValues =
//       Array.isArray(question.options)
//         ? question.options.map(
//             (option) =>
//               normalizeForComparison(
//                 option.value,
//               ),
//           )
//         : [];

//     question.correctAnswers.forEach(
//       (answer, index) => {
//         const normalizedAnswer =
//           normalizeForComparison(
//             answer,
//           );

//         if (!normalizedAnswer) {
//           issues.push({
//             type: "answers",
//             message: `Correct answer ${index + 1} is empty.`,
//           });
//           return;
//         }

//         const matchesValue =
//           optionValues.includes(
//             normalizedAnswer,
//           );

//         const matchesLabel =
//           Array.isArray(
//             question.options,
//           ) &&
//           question.options.some(
//             (option) =>
//               normalizeText(
//                 option.label,
//               ) ===
//               normalizeText(
//                 answer,
//               ),
//           );

//         if (
//           !matchesValue &&
//           !matchesLabel
//         ) {
//           issues.push({
//             type: "answers",
//             message: `Correct answer "${answer}" does not match any option value or label.`,
//           });
//         }
//       },
//     );
//   }

//   /*
//    * CONTENT
//    */

//   if (
//     !Array.isArray(question.content)
//   ) {
//     issues.push({
//       type: "content",
//       message:
//         "Content must be an array.",
//     });
//   } else {
//     if (question.content.length === 0) {
//       issues.push({
//         type: "content",
//         message:
//           "Content array is empty.",
//       });
//     }

//     const orders =
//       question.content.map(
//         (block) => block?.order,
//       );

//     const duplicateOrders =
//       orders.filter(
//         (order, index) =>
//           orders.indexOf(order) !==
//           index,
//       );

//     if (duplicateOrders.length > 0) {
//       issues.push({
//         type: "content",
//         message:
//           "Content blocks contain duplicate order values.",
//       });
//     }

//     question.content.forEach(
//       (block, index) => {
//         if (
//           !block ||
//           block.type !== "text"
//         ) {
//           issues.push({
//             type: "content",
//             message: `Content block ${index + 1} must have type "text".`,
//           });
//         }

//         if (
//           !Number.isFinite(
//             block?.order,
//           )
//         ) {
//           issues.push({
//             type: "content",
//             message: `Content block ${index + 1} has an invalid order.`,
//           });
//         }

//         if (
//           !Array.isArray(
//             block?.segments,
//           )
//         ) {
//           issues.push({
//             type: "content",
//             message: `Content block ${index + 1} has invalid segments.`,
//           });
//         } else {
//           block.segments.forEach(
//             (
//               segment,
//               segmentIndex,
//             ) => {
//               if (
//                 typeof segment?.text !==
//                   "string" ||
//                 !segment.text.trim()
//               ) {
//                 issues.push({
//                   type: "content",
//                   message: `Content block ${index + 1}, segment ${segmentIndex + 1} has no text.`,
//                 });
//               }

//               if (
//                 !Array.isArray(
//                   segment?.styles,
//                 )
//               ) {
//                 issues.push({
//                   type: "content",
//                   message: `Content block ${index + 1}, segment ${segmentIndex + 1} has invalid styles.`,
//                 });
//               }
//             },
//           );
//         }

//         if (
//           block?.table !==
//             undefined &&
//           !Array.isArray(
//             block.table,
//           )
//         ) {
//           issues.push({
//             type: "content",
//             message: `Content block ${index + 1} has an invalid table.`,
//           });
//         }

//         if (
//           block?.graph !==
//             undefined
//         ) {
//           if (
//             typeof block.graph.type !==
//             "string"
//           ) {
//             issues.push({
//               type: "content",
//               message: `Content block ${index + 1} graph has no type.`,
//             });
//           }

//           if (
//             !Array.isArray(
//               block.graph.labels,
//             )
//           ) {
//             issues.push({
//               type: "content",
//               message: `Content block ${index + 1} graph labels are invalid.`,
//             });
//           }

//           if (
//             !Array.isArray(
//               block.graph.datasets,
//             )
//           ) {
//             issues.push({
//               type: "content",
//               message: `Content block ${index + 1} graph datasets are invalid.`,
//             });
//           } else {
//             block.graph.datasets.forEach(
//               (
//                 dataset,
//                 datasetIndex,
//               ) => {
//                 if (
//                   typeof dataset.label !==
//                   "string"
//                 ) {
//                   issues.push({
//                     type: "content",
//                     message: `Content block ${index + 1}, dataset ${datasetIndex + 1} has an invalid label.`,
//                   });
//                 }

//                 if (
//                   !Array.isArray(
//                     dataset.data,
//                   )
//                 ) {
//                   issues.push({
//                     type: "content",
//                     message: `Content block ${index + 1}, dataset ${datasetIndex + 1} has invalid data.`,
//                   });
//                 }
//               },
//             );
//           }
//         }
//       },
//     );
//   }

//   /*
//    * EXPLANATION
//    */

//   if (
//     typeof question.explanation !==
//       "string" ||
//     !question.explanation.trim()
//   ) {
//     issues.push({
//       type: "explanation",
//       message:
//         "Explanation is missing.",
//     });
//   }

//   if (
//     !Array.isArray(
//       question.explanationSteps,
//     )
//   ) {
//     issues.push({
//       type: "explanation",
//       message:
//         "Explanation steps must be an array.",
//     });
//   } else {
//     question.explanationSteps.forEach(
//       (step, index) => {
//         if (
//           typeof step !== "string" ||
//           !step.trim()
//         ) {
//           issues.push({
//             type: "explanation",
//             message: `Explanation step ${index + 1} is empty.`,
//           });
//         }
//       },
//     );
//   }

//   /*
//    * DIFFICULTY
//    */

//   const expectedDifficulty =
//     getExpectedDifficulty(
//       question.difficultySource,
//     );

//   if (
//     question.difficulty !==
//     expectedDifficulty
//   ) {
//     issues.push({
//       type: "difficulty",
//       message: `Difficulty is "${question.difficulty}" but source folder requires "${expectedDifficulty}".`,
//     });
//   }

//   /*
//    * EXAM TYPE
//    */

//   if (
//     question.examType !==
//     selectedExamType
//   ) {
//     issues.push({
//       type: "exam",
//       message: `Question is marked "${question.examType}" but selected exam is "${selectedExamType}".`,
//     });
//   }

//   /*
//    * SUBJECT
//    */

//   if (
//     typeof question.apiSubjectName !==
//       "string" ||
//     !question.apiSubjectName.trim()
//   ) {
//     issues.push({
//       type: "subject",
//       message:
//         "apiSubjectName is missing.",
//     });
//   } else if (
//     normalizeText(
//       question.apiSubjectName,
//     ) !==
//     normalizeText(
//       selectedSubjectName,
//     )
//   ) {
//     issues.push({
//       type: "subject",
//       message: `apiSubjectName "${question.apiSubjectName}" does not match selected subject "${selectedSubjectName}".`,
//     });
//   }

//   /*
//    * MULTIPLE ANSWER
//    */

//   if (
//     typeof question.isMultipleAnswer !==
//     "boolean"
//   ) {
//     issues.push({
//       type: "multiple-answer",
//       message:
//         "isMultipleAnswer must be a boolean.",
//     });
//   }

//   return issues;
// }

// export default function QuestionBankValidatorPage() {
//   const [subjects, setSubjects] =
//     useState<Subject[]>([]);

//   const [
//     selectedSubjectId,
//     setSelectedSubjectId,
//   ] = useState("");

//   const [
//     selectedExamType,
//     setSelectedExamType,
//   ] = useState<ExamType>("jamb");

//   const [
//     questions,
//     setQuestions,
//   ] = useState<QuestionWithId[]>([]);

//   const [
//     loadingSubjects,
//     setLoadingSubjects,
//   ] = useState(true);

//   const [
//     loadingBank,
//     setLoadingBank,
//   ] = useState(false);

//   const [pageError, setPageError] =
//     useState("");

//   const [
//     successMessage,
//     setSuccessMessage,
//   ] = useState("");

//   const [
//     searchTerm,
//     setSearchTerm,
//   ] = useState("");

//   const [
//     expandedGroups,
//     setExpandedGroups,
//   ] = useState<string[]>([]);

//   const [
//     expandedValidationIds,
//     setExpandedValidationIds,
//   ] = useState<string[]>([]);

//   const [
//     activeValidationFilter,
//     setActiveValidationFilter,
//   ] = useState<
//     "all" | "errors" | "duplicates"
//   >("all");

//   /*
//    * ============================================================
//    * LOAD SUBJECTS
//    * ============================================================
//    */

//   useEffect(() => {
//     async function loadSubjects() {
//       try {
//         setLoadingSubjects(true);
//         setPageError("");

//         const response =
//           await getSubjectsByPlan(
//             "SECONDARY",
//             1,
//             100,
//           );

//         const loadedSubjects: Subject[] =
//           response?.data?.subjectObj ?? [];

//         setSubjects(loadedSubjects);

//         if (loadedSubjects.length > 0) {
//           setSelectedSubjectId(
//             loadedSubjects[0]._id,
//           );
//         }
//       } catch (error) {
//         console.error(
//           "Failed to load subjects:",
//           error,
//         );

//         setPageError(
//           "Unable to load secondary subjects. Please try again.",
//         );
//       } finally {
//         setLoadingSubjects(false);
//       }
//     }

//     loadSubjects();
//   }, []);

//   /*
//    * ============================================================
//    * SELECTED SUBJECT
//    * ============================================================
//    */

//   const selectedSubject = useMemo(
//     () =>
//       subjects.find(
//         (subject) =>
//           subject._id ===
//           selectedSubjectId,
//       ),
//     [
//       subjects,
//       selectedSubjectId,
//     ],
//   );

//   /*
//    * ============================================================
//    * AVAILABLE BANKS
//    * ============================================================
//    */

//   const availableBanks =
//     useMemo(() => {
//       if (!selectedSubject) {
//         return {
//           easy: [],
//           medium: [],
//           hard: [],
//         };
//       }

//       return getQuestionBanks(
//         selectedSubject.name,
//         selectedExamType,
//       );
//     }, [
//       selectedSubject,
//       selectedExamType,
//     ]);

//   const availableTotal =
//     availableBanks.easy.length +
//     availableBanks.medium.length +
//     availableBanks.hard.length;

//   /*
//    * ============================================================
//    * DIFFICULTY STATS
//    * ============================================================
//    */

//   const difficultyStats =
//     useMemo<DifficultyStats>(
//       () => ({
//         easy: questions.filter(
//           (question) =>
//             question.difficultySource ===
//             "easy",
//         ).length,

//         medium: questions.filter(
//           (question) =>
//             question.difficultySource ===
//             "medium",
//         ).length,

//         hard: questions.filter(
//           (question) =>
//             question.difficultySource ===
//             "hard",
//         ).length,
//       }),
//       [questions],
//     );

//   /*
//    * ============================================================
//    * DUPLICATE GROUPS
//    * ============================================================
//    */

//   const duplicateGroups =
//     useMemo<DuplicateGroup[]>(
//       () => {
//         const groups = new Map<
//           string,
//           QuestionWithId[]
//         >();

//         for (const question of questions) {
//           const fingerprint =
//             getFingerprint(question);

//           const existing =
//             groups.get(fingerprint);

//           if (existing) {
//             existing.push(question);
//           } else {
//             groups.set(fingerprint, [
//               question,
//             ]);
//           }
//         }

//         return Array.from(
//           groups.entries(),
//         )
//           .filter(
//             ([, group]) =>
//               group.length > 1,
//           )
//           .map(
//             ([
//               fingerprint,
//               group,
//             ]) => ({
//               fingerprint,
//               questions: group,
//             }),
//           );
//       },
//       [questions],
//     );

//   /*
//    * ============================================================
//    * DUPLICATE COUNTS
//    * ============================================================
//    */

//   const duplicateGroupCount =
//     duplicateGroups.length;

//   const duplicateQuestionCount =
//     duplicateGroups.reduce(
//       (total, group) =>
//         total + group.questions.length,
//       0,
//     );

//   const duplicateCopiesCount =
//     duplicateGroups.reduce(
//       (total, group) =>
//         total +
//         Math.max(
//           0,
//           group.questions.length - 1,
//         ),
//       0,
//     );

//   const uniqueQuestionCount =
//     questions.length -
//     duplicateCopiesCount;

//   /*
//    * ============================================================
//    * FULL STRUCTURAL VALIDATION
//    * ============================================================
//    */

//   const validationResults =
//     useMemo<
//       QuestionValidationResult[]
//     >(() => {
//       if (!selectedSubject) {
//         return [];
//       }

//       return questions
//         .map((question) => ({
//           question,
//           issues: validateQuestion(
//             question,
//             selectedExamType,
//             selectedSubject.name,
//           ),
//         }))
//         .filter(
//           (result) =>
//             result.issues.length > 0,
//         );
//     }, [
//       questions,
//       selectedExamType,
//       selectedSubject,
//     ]);

//   const validationErrorCount =
//     validationResults.length;

//   const validationIssueCount =
//     validationResults.reduce(
//       (total, result) =>
//         total + result.issues.length,
//       0,
//     );

//   /*
//    * ============================================================
//    * DIFFICULTY ERRORS
//    * ============================================================
//    */

//   const difficultyValidationErrors =
//     useMemo(
//       () =>
//         validationResults.filter(
//           (result) =>
//             result.issues.some(
//               (issue) =>
//                 issue.type ===
//                 "difficulty",
//             ),
//         ),
//       [validationResults],
//     );

//   const difficultyErrorStats =
//     useMemo(() => {
//       const stats: DifficultyStats =
//         {
//           easy: 0,
//           medium: 0,
//           hard: 0,
//         };

//       for (const result of difficultyValidationErrors) {
//         stats[
//           result.question
//             .difficultySource
//         ]++;
//       }

//       return stats;
//     }, [
//       difficultyValidationErrors,
//     ]);

//   /*
//    * ============================================================
//    * CROSS-DIFFICULTY DUPLICATES
//    * ============================================================
//    */

//   const crossDifficultyDuplicates =
//     useMemo<
//       CrossDifficultyPair[]
//     >(() => {
//       const pairs: CrossDifficultyPair[] =
//         [];

//       for (const group of duplicateGroups) {
//         for (
//           let a = 0;
//           a < group.questions.length;
//           a++
//         ) {
//           for (
//             let b = a + 1;
//             b <
//             group.questions.length;
//             b++
//           ) {
//             const first =
//               group.questions[a];

//             const second =
//               group.questions[b];

//             if (
//               first.difficultySource ===
//               second.difficultySource
//             ) {
//               continue;
//             }

//             const difficulties =
//               [
//                 first.difficultySource,
//                 second.difficultySource,
//               ].sort();

//             const pairKey = `${group.fingerprint}::${difficulties.join(
//               "-",
//             )}`;

//             pairs.push({
//               key: pairKey,
//               label: `${DIFFICULTY_LABELS[first.difficultySource]} ↔ ${DIFFICULTY_LABELS[second.difficultySource]}`,
//               first,
//               second,
//             });
//           }
//         }
//       }

//       return pairs;
//     }, [duplicateGroups]);

//   const crossPairStats =
//     useMemo(() => {
//       let easyMedium = 0;
//       let easyHard = 0;
//       let mediumHard = 0;

//       for (const pair of crossDifficultyDuplicates) {
//         const values = [
//           pair.first.difficultySource,
//           pair.second.difficultySource,
//         ].sort();

//         const key = values.join(
//           "-",
//         );

//         if (key === "easy-medium") {
//           easyMedium++;
//         }

//         if (key === "easy-hard") {
//           easyHard++;
//         }

//         if (key === "hard-medium") {
//           mediumHard++;
//         }
//       }

//       return {
//         easyMedium,
//         easyHard,
//         mediumHard,
//       };
//     }, [
//       crossDifficultyDuplicates,
//     ]);

//   /*
//    * ============================================================
//    * SEARCH
//    * ============================================================
//    */

//   const normalizedSearch =
//     normalizeText(searchTerm);

//   const filteredValidationResults =
//     useMemo(() => {
//       let results =
//         validationResults;

//       if (
//         activeValidationFilter ===
//         "duplicates"
//       ) {
//         const duplicateIds =
//           new Set(
//             duplicateGroups.flatMap(
//               (group) =>
//                 group.questions.map(
//                   (question) =>
//                     question.localId,
//                 ),
//             ),
//           );

//         results = results.filter(
//           (result) =>
//             duplicateIds.has(
//               result.question.localId,
//             ),
//         );
//       }

//       if (
//         normalizedSearch
//       ) {
//         results = results.filter(
//           (result) =>
//             normalizeText(
//               result.question.question,
//             ).includes(
//               normalizedSearch,
//             ) ||
//             normalizeText(
//               result.question.topic,
//             ).includes(
//               normalizedSearch,
//             ) ||
//             result.issues.some(
//               (issue) =>
//                 normalizeText(
//                   issue.message,
//                 ).includes(
//                   normalizedSearch,
//                 ),
//             ),
//         );
//       }

//       return results;
//     }, [
//       validationResults,
//       activeValidationFilter,
//       duplicateGroups,
//       normalizedSearch,
//     ]);

//   const filteredDuplicateGroups =
//     useMemo(() => {
//       if (!normalizedSearch) {
//         return duplicateGroups;
//       }

//       return duplicateGroups.filter(
//         (group) =>
//           group.questions.some(
//             (question) =>
//               normalizeText(
//                 question.question,
//               ).includes(
//                 normalizedSearch,
//               ) ||
//               normalizeText(
//                 question.topic,
//               ).includes(
//                 normalizedSearch,
//               ) ||
//               question.options.some(
//                 (option) =>
//                   normalizeText(
//                     option.value,
//                   ).includes(
//                     normalizedSearch,
//                   ),
//               ),
//           ),
//       );
//     }, [
//       duplicateGroups,
//       normalizedSearch,
//     ]);

//   const filteredCrossDifficulty =
//     useMemo(() => {
//       if (!normalizedSearch) {
//         return crossDifficultyDuplicates;
//       }

//       return crossDifficultyDuplicates.filter(
//         (pair) =>
//           normalizeText(
//             pair.first.question,
//           ).includes(
//             normalizedSearch,
//           ) ||
//           normalizeText(
//             pair.second.question,
//           ).includes(
//             normalizedSearch,
//           ) ||
//           normalizeText(
//             pair.first.topic,
//           ).includes(
//             normalizedSearch,
//           ) ||
//           normalizeText(
//             pair.second.topic,
//           ).includes(
//             normalizedSearch,
//           ),
//       );
//     }, [
//       crossDifficultyDuplicates,
//       normalizedSearch,
//     ]);

//   /*
//    * ============================================================
//    * STATUS
//    * ============================================================
//    */

//   const hasLoadedQuestions =
//     questions.length > 0;

//   const hasDuplicates =
//     duplicateGroups.length > 0;

//   const hasCrossDifficultyDuplicates =
//     crossDifficultyDuplicates.length >
//     0;

//   const hasValidationErrors =
//     validationResults.length > 0;

//   const isClean =
//     hasLoadedQuestions &&
//     !hasDuplicates &&
//     !hasValidationErrors;

//   /*
//    * ============================================================
//    * RESET SESSION
//    * ============================================================
//    */

//   function resetValidationSession() {
//     setQuestions([]);
//     setSearchTerm("");
//     setExpandedGroups([]);
//     setExpandedValidationIds([]);
//     setActiveValidationFilter(
//       "all",
//     );
//     setSuccessMessage("");
//     setPageError("");
//   }

//   /*
//    * ============================================================
//    * LOAD QUESTION BANKS
//    * ============================================================
//    */

//   function loadQuestionFile() {
//     if (!selectedSubject) {
//       setPageError(
//         "Please select a subject first.",
//       );
//       return;
//     }

//     setLoadingBank(true);
//     setPageError("");
//     setSuccessMessage("");
//     setSearchTerm("");
//     setExpandedGroups([]);
//     setExpandedValidationIds([]);
//     setActiveValidationFilter(
//       "all",
//     );

//     try {
//       const banks =
//         getQuestionBanks(
//           selectedSubject.name,
//           selectedExamType,
//         );

//       const total =
//         banks.easy.length +
//         banks.medium.length +
//         banks.hard.length;

//       if (total === 0) {
//         setQuestions([]);

//         setPageError(
//           `No ${selectedExamType.toUpperCase()} question banks are registered for ${selectedSubject.name}.`,
//         );

//         return;
//       }

//       const loadedQuestions: QuestionWithId[] =
//         [
//           ...convertBankToLocal(
//             banks.easy,
//             "easy",
//           ),
//           ...convertBankToLocal(
//             banks.medium,
//             "medium",
//           ),
//           ...convertBankToLocal(
//             banks.hard,
//             "hard",
//           ),
//         ];

//       setQuestions(
//         loadedQuestions,
//       );

//       setSuccessMessage(
//         `${loadedQuestions.length.toLocaleString()} questions loaded for validation: Easy ${banks.easy.length.toLocaleString()}, Medium ${banks.medium.length.toLocaleString()}, Hard ${banks.hard.length.toLocaleString()}.`,
//       );
//     } catch (error) {
//       console.error(
//         "Failed to load question banks:",
//         error,
//       );

//       setQuestions([]);

//       setPageError(
//         "The question banks could not be loaded. Check the question bank registry and source files.",
//       );
//     } finally {
//       setLoadingBank(false);
//     }
//   }

//   /*
//    * ============================================================
//    * TOGGLE GROUP
//    * ============================================================
//    */

//   function toggleGroup(
//     fingerprint: string,
//   ) {
//     setExpandedGroups(
//       (current) =>
//         current.includes(
//           fingerprint,
//         )
//           ? current.filter(
//               (value) =>
//                 value !==
//                 fingerprint,
//             )
//           : [
//               ...current,
//               fingerprint,
//             ],
//     );
//   }

//   /*
//    * ============================================================
//    * TOGGLE VALIDATION RESULT
//    * ============================================================
//    */

//   function toggleValidationResult(
//     localId: string,
//   ) {
//     setExpandedValidationIds(
//       (current) =>
//         current.includes(localId)
//           ? current.filter(
//               (id) =>
//                 id !== localId,
//             )
//           : [
//               ...current,
//               localId,
//             ],
//     );
//   }

//   /*
//    * ============================================================
//    * RENDER HELPERS
//    * ============================================================
//    */

//   function renderDifficultyBadge(
//     difficulty: QuestionDifficulty,
//   ) {
//     return (
//       <span
//         className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${DIFFICULTY_COLORS[difficulty]}`}
//       >
//         {DIFFICULTY_LABELS[difficulty]}
//       </span>
//     );
//   }

//   function getQuestionValidationIssues(
//     localId: string,
//   ) {
//     return (
//       validationResults.find(
//         (result) =>
//           result.question.localId ===
//           localId,
//       )?.issues ?? []
//     );
//   }

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* HEADER */}

//         <div className="mb-8">
//           <Link
//             href="/admin/secondary/solveandwin"
//             className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Solve & Win
//           </Link>

//           <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
//                 <ShieldCheck className="h-3.5 w-3.5" />
//                 Question Bank Validator
//               </div>

//               <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
//                 Validate Question Banks
//               </h1>

//               <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
//                 Validate your Easy, Medium, and
//                 Hard question banks before they
//                 are used by the application.
//                 This page only performs validation
//                 in memory.
//               </p>
//             </div>

//             <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
//               <Database className="h-5 w-5 text-cyan-400" />

//               <div>
//                 <p className="text-xs font-semibold text-slate-500">
//                   Validation Mode
//                 </p>

//                 <p className="text-sm font-bold text-slate-200">
//                   Read-only
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ALERTS */}

//         {pageError && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
//             <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
//             <p>{pageError}</p>

//             <button
//               type="button"
//               onClick={() =>
//                 setPageError("")
//               }
//               className="ml-auto rounded-lg p-1 text-red-300 hover:bg-red-500/10"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
//             <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
//             <p>{successMessage}</p>

//             <button
//               type="button"
//               onClick={() =>
//                 setSuccessMessage("")
//               }
//               className="ml-auto rounded-lg p-1 text-emerald-300 hover:bg-emerald-500/10"
//             >
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         )}

//         {/* SELECTOR */}

//         <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-black/20 sm:p-6">
//           <div className="mb-5 flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
//               <BookOpen className="h-5 w-5 text-cyan-400" />
//             </div>

//             <div>
//               <h2 className="font-bold text-white">
//                 Select Question Banks
//               </h2>

//               <p className="text-sm text-slate-500">
//                 Choose the subject and exam.
//                 All three difficulty folders
//                 will be validated together.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             <div>
//               <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
//                 Subject
//               </label>

//               <select
//                 value={
//                   selectedSubjectId
//                 }
//                 onChange={(event) => {
//                   setSelectedSubjectId(
//                     event.target.value,
//                   );

//                   resetValidationSession();
//                 }}
//                 disabled={
//                   loadingSubjects
//                 }
//                 className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
//               >
//                 {loadingSubjects ? (
//                   <option value="">
//                     Loading subjects...
//                   </option>
//                 ) : subjects.length ===
//                   0 ? (
//                   <option value="">
//                     No subjects available
//                   </option>
//                 ) : (
//                   subjects.map(
//                     (subject) => (
//                       <option
//                         key={
//                           subject._id
//                         }
//                         value={
//                           subject._id
//                         }
//                       >
//                         {
//                           subject.name
//                         }
//                       </option>
//                     ),
//                   )
//                 )}
//               </select>
//             </div>

//             <div>
//               <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
//                 Exam Type
//               </label>

//               <select
//                 value={
//                   selectedExamType
//                 }
//                 onChange={(event) => {
//                   setSelectedExamType(
//                     event.target
//                       .value as ExamType,
//                   );

//                   resetValidationSession();
//                 }}
//                 className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-semibold text-white outline-none transition focus:border-cyan-400"
//               >
//                 <option value="jamb">
//                   JAMB
//                 </option>

//                 <option value="waec">
//                   WAEC
//                 </option>

//                 <option value="neco">
//                   NECO
//                 </option>
//               </select>
//             </div>

//             <div className="flex items-end">
//               <button
//                 type="button"
//                 onClick={
//                   loadQuestionFile
//                 }
//                 disabled={
//                   loadingBank ||
//                   loadingSubjects ||
//                   !selectedSubject
//                 }
//                 className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {loadingBank ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Loading Banks...
//                   </>
//                 ) : (
//                   <>
//                     <Layers3 className="h-4 w-4" />
//                     Load All Banks
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           {selectedSubject && (
//             <>
//               <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//                 <div className="rounded-xl bg-slate-950 p-4">
//                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                     Subject
//                   </p>

//                   <p className="mt-1 text-sm font-bold text-white">
//                     {
//                       selectedSubject.name
//                     }
//                   </p>
//                 </div>

//                 <div className="rounded-xl bg-slate-950 p-4">
//                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                     Exam
//                   </p>

//                   <p className="mt-1 text-sm font-bold text-white">
//                     {selectedExamType.toUpperCase()}
//                   </p>
//                 </div>

//                 <div className="rounded-xl bg-slate-950 p-4">
//                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                     Registered Questions
//                   </p>

//                   <p className="mt-1 text-sm font-black text-cyan-300">
//                     {availableTotal.toLocaleString()}
//                   </p>
//                 </div>

//                 <div className="rounded-xl bg-slate-950 p-4">
//                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                     Validation
//                   </p>

//                   <p className="mt-1 text-sm font-black text-emerald-300">
//                     Easy ↔ Medium ↔ Hard
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-4 flex flex-wrap gap-2">
//                 {DIFFICULTIES.map(
//                   (difficulty) => (
//                     <span
//                       key={
//                         difficulty
//                       }
//                       className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${DIFFICULTY_COLORS[difficulty]}`}
//                     >
//                       {
//                         DIFFICULTY_LABELS[
//                           difficulty
//                         ]
//                       }
//                       :{" "}
//                       {availableBanks[
//                         difficulty
//                       ].length.toLocaleString()}
//                     </span>
//                   ),
//                 )}
//               </div>
//             </>
//           )}
//         </section>

//         {/* STATISTICS */}

//         {hasLoadedQuestions && (
//           <>
//             <section className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
//                   Loaded
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-white">
//                   {questions.length.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Questions under validation
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
//                   Easy
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-emerald-300">
//                   {difficultyStats.easy.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   easy/{selectedExamType}.ts
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
//                   Medium
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-cyan-300">
//                   {difficultyStats.medium.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   medium/{selectedExamType}.ts
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-purple-400">
//                   Hard
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-purple-300">
//                   {difficultyStats.hard.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   hard/{selectedExamType}.ts
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
//                   Unique
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-white">
//                   {uniqueQuestionCount.toLocaleString()}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   After duplicate grouping
//                 </p>
//               </div>
//             </section>

//             {/* CROSS DIFFICULTY */}

//             <section className="mb-8 grid gap-4 md:grid-cols-3">
//               {[
//                 {
//                   label:
//                     "Easy ↔ Medium",
//                   value:
//                     crossPairStats.easyMedium,
//                 },
//                 {
//                   label:
//                     "Easy ↔ Hard",
//                   value:
//                     crossPairStats.easyHard,
//                 },
//                 {
//                   label:
//                     "Medium ↔ Hard",
//                   value:
//                     crossPairStats.mediumHard,
//                 },
//               ].map((item) => (
//                 <div
//                   key={item.label}
//                   className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
//                 >
//                   <div className="flex items-center justify-between">
//                     <p className="text-xs font-black uppercase tracking-wider text-slate-500">
//                       {item.label}
//                     </p>

//                     <Copy className="h-4 w-4 text-amber-400" />
//                   </div>

//                   <p className="mt-2 text-3xl font-black text-amber-300">
//                     {item.value.toLocaleString()}
//                   </p>

//                   <p className="mt-1 text-xs text-slate-500">
//                     Exact question overlap
//                   </p>
//                 </div>
//               ))}
//             </section>
//           </>
//         )}

//         {/* VALIDATION SUMMARY */}

//         {hasLoadedQuestions && (
//           <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
//             <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//               <div>
//                 <div className="flex items-center gap-3">
//                   {isClean ? (
//                     <CircleCheck className="h-6 w-6 text-emerald-400" />
//                   ) : (
//                     <CircleX className="h-6 w-6 text-red-400" />
//                   )}

//                   <h2 className="text-xl font-black text-white">
//                     Validation Summary
//                   </h2>
//                 </div>

//                 <p className="mt-2 text-sm text-slate-400">
//                   {isClean
//                     ? "All loaded question banks passed the current validation rules."
//                     : "One or more validation checks require review."}
//                 </p>
//               </div>

//               <div
//                 className={`rounded-2xl px-5 py-3 text-center ${
//                   isClean
//                     ? "bg-emerald-400/10"
//                     : "bg-red-400/10"
//                 }`}
//               >
//                 <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
//                   Result
//                 </p>

//                 <p
//                   className={`mt-1 text-lg font-black ${
//                     isClean
//                       ? "text-emerald-300"
//                       : "text-red-300"
//                   }`}
//                 >
//                   {isClean
//                     ? "PASS"
//                     : "REVIEW REQUIRED"}
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Questions With Errors
//                 </p>

//                 <p
//                   className={`mt-1 text-2xl font-black ${
//                     validationErrorCount ===
//                     0
//                       ? "text-emerald-400"
//                       : "text-red-400"
//                   }`}
//                 >
//                   {validationErrorCount.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Validation Issues
//                 </p>

//                 <p
//                   className={`mt-1 text-2xl font-black ${
//                     validationIssueCount ===
//                     0
//                       ? "text-emerald-400"
//                       : "text-red-400"
//                   }`}
//                 >
//                   {validationIssueCount.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Duplicate Groups
//                 </p>

//                 <p
//                   className={`mt-1 text-2xl font-black ${
//                     duplicateGroupCount ===
//                     0
//                       ? "text-emerald-400"
//                       : "text-amber-400"
//                   }`}
//                 >
//                   {duplicateGroupCount.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Cross-Difficulty
//                 </p>

//                 <p
//                   className={`mt-1 text-2xl font-black ${
//                     crossDifficultyDuplicates.length ===
//                     0
//                       ? "text-emerald-400"
//                       : "text-cyan-400"
//                   }`}
//                 >
//                   {crossDifficultyDuplicates.length.toLocaleString()}
//                 </p>
//               </div>
//             </div>

//             <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
//               {[
//                 {
//                   label: "Question Text",
//                   valid:
//                     !validationResults.some(
//                       (result) =>
//                         result.issues.some(
//                           (issue) =>
//                             issue.type ===
//                             "question",
//                         ),
//                     ),
//                 },
//                 {
//                   label: "Options",
//                   valid:
//                     !validationResults.some(
//                       (result) =>
//                         result.issues.some(
//                           (issue) =>
//                             issue.type ===
//                             "options",
//                         ),
//                     ),
//                 },
//                 {
//                   label: "Correct Answers",
//                   valid:
//                     !validationResults.some(
//                       (result) =>
//                         result.issues.some(
//                           (issue) =>
//                             issue.type ===
//                             "answers",
//                         ),
//                     ),
//                 },
//                 {
//                   label: "Difficulty",
//                   valid:
//                     difficultyValidationErrors.length ===
//                     0,
//                 },
//                 {
//                   label: "Exam Type",
//                   valid:
//                     !validationResults.some(
//                       (result) =>
//                         result.issues.some(
//                           (issue) =>
//                             issue.type ===
//                             "exam",
//                         ),
//                     ),
//                 },
//                 {
//                   label: "Subject",
//                   valid:
//                     !validationResults.some(
//                       (result) =>
//                         result.issues.some(
//                           (issue) =>
//                             issue.type ===
//                             "subject",
//                         ),
//                     ),
//                 },
//                 {
//                   label: "Content",
//                   valid:
//                     !validationResults.some(
//                       (result) =>
//                         result.issues.some(
//                           (issue) =>
//                             issue.type ===
//                             "content",
//                         ),
//                     ),
//                 },
//                 {
//                   label: "Explanation",
//                   valid:
//                     !validationResults.some(
//                       (result) =>
//                         result.issues.some(
//                           (issue) =>
//                             issue.type ===
//                             "explanation",
//                         ),
//                     ),
//                 },
//               ].map(
//                 (check) => (
//                   <div
//                     key={
//                       check.label
//                     }
//                     className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
//                       check.valid
//                         ? "border-emerald-500/10 bg-emerald-500/5"
//                         : "border-red-500/10 bg-red-500/5"
//                     }`}
//                   >
//                     <span className="text-xs font-bold text-slate-300">
//                       {check.label}
//                     </span>

//                     {check.valid ? (
//                       <CheckCircle2 className="h-4 w-4 text-emerald-400" />
//                     ) : (
//                       <AlertCircle className="h-4 w-4 text-red-400" />
//                     )}
//                   </div>
//                 ),
//               )}
//             </div>
//           </section>
//         )}

//         {/* VALIDATION ERRORS */}

//         {hasLoadedQuestions &&
//           validationResults.length >
//             0 && (
//             <section className="mb-8 overflow-hidden rounded-3xl border border-red-500/20 bg-slate-900">
//               <div className="border-b border-slate-800 p-5 sm:p-6">
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <AlertTriangle className="h-6 w-6 text-red-400" />

//                       <h2 className="text-xl font-black text-white">
//                         Validation Errors
//                       </h2>
//                     </div>

//                     <p className="mt-2 text-sm leading-6 text-slate-400">
//                       These questions contain one
//                       or more schema or data
//                       integrity problems.
//                     </p>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     {(
//                       [
//                         [
//                           "all",
//                           "All Errors",
//                         ],
//                         [
//                           "errors",
//                           "All Validation",
//                         ],
//                         [
//                           "duplicates",
//                           "Duplicates",
//                         ],
//                       ] as const
//                     ).map(
//                       ([
//                         value,
//                         label,
//                       ]) => (
//                         <button
//                           key={value}
//                           type="button"
//                           onClick={() =>
//                             setActiveValidationFilter(
//                               value,
//                             )
//                           }
//                           className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
//                             activeValidationFilter ===
//                             value
//                               ? "bg-red-500 text-white"
//                               : "border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
//                           }`}
//                         >
//                           {label}
//                         </button>
//                       ),
//                     )}
//                   </div>
//                 </div>

//                 <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
//                   <Search className="h-4 w-4 text-slate-500" />

//                   <input
//                     value={
//                       searchTerm
//                     }
//                     onChange={(
//                       event,
//                     ) =>
//                       setSearchTerm(
//                         event.target
//                           .value,
//                       )
//                     }
//                     placeholder="Search questions, topics, or validation errors..."
//                     className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
//                   />

//                   <Filter className="h-4 w-4 text-slate-600" />
//                 </div>
//               </div>

//               <div className="divide-y divide-slate-800">
//                 {filteredValidationResults.map(
//                   (
//                     result,
//                     index,
//                   ) => {
//                     const isExpanded =
//                       expandedValidationIds.includes(
//                         result
//                           .question
//                           .localId,
//                       );

//                     return (
//                       <div
//                         key={
//                           result
//                             .question
//                             .localId
//                         }
//                       >
//                         <button
//                           type="button"
//                           onClick={() =>
//                             toggleValidationResult(
//                               result
//                                 .question
//                                 .localId,
//                             )
//                           }
//                           className="flex w-full items-start justify-between gap-4 p-5 text-left transition hover:bg-slate-800/40 sm:p-6"
//                         >
//                           <div className="flex min-w-0 items-start gap-4">
//                             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-400/10 text-xs font-black text-red-300">
//                               {index +
//                                 1}
//                             </div>

//                             <div className="min-w-0">
//                               <div className="mb-2 flex flex-wrap items-center gap-2">
//                                 <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
//                                   {
//                                     result
//                                       .issues
//                                       .length
//                                   }{" "}
//                                   issue
//                                   {result
//                                     .issues
//                                     .length ===
//                                   1
//                                     ? ""
//                                     : "s"}
//                                 </span>

//                                 {renderDifficultyBadge(
//                                   result
//                                     .question
//                                     .difficultySource,
//                                 )}

//                                 <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
//                                   Index{" "}
//                                   {
//                                     result
//                                       .question
//                                       .sourceIndex
//                                   }
//                                 </span>
//                               </div>

//                               <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-200">
//                                 {
//                                   result
//                                     .question
//                                     .question
//                                 }
//                               </p>
//                             </div>
//                           </div>

//                           <ChevronDown
//                             className={`h-5 w-5 shrink-0 text-slate-500 transition ${
//                               isExpanded
//                                 ? "rotate-180"
//                                 : ""
//                             }`}
//                           />
//                         </button>

//                         {isExpanded && (
//                           <div className="bg-slate-950/70 px-5 pb-6 sm:px-6">
//                             <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-5">
//                               <div className="mb-4 flex flex-wrap gap-2">
//                                 {result.issues.map(
//                                   (
//                                     issue,
//                                     issueIndex,
//                                   ) => (
//                                     <span
//                                       key={`${result.question.localId}-issue-${issueIndex}`}
//                                       className="rounded-full bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300"
//                                     >
//                                       {
//                                         issue.type
//                                       }
//                                     </span>
//                                   ),
//                                 )}
//                               </div>

//                               <div className="space-y-2">
//                                 {result.issues.map(
//                                   (
//                                     issue,
//                                     issueIndex,
//                                   ) => (
//                                     <div
//                                       key={`${result.question.localId}-message-${issueIndex}`}
//                                       className="flex items-start gap-3 rounded-xl bg-slate-950 p-3"
//                                     >
//                                       <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

//                                       <p className="text-xs leading-5 text-slate-300">
//                                         {
//                                           issue.message
//                                         }
//                                       </p>
//                                     </div>
//                                   ),
//                                 )}
//                               </div>

//                               <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//                                 <div className="rounded-xl bg-slate-950 p-3">
//                                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                                     Source
//                                   </p>

//                                   <p className="mt-1 text-xs font-bold text-white">
//                                     {getSourcePath(
//                                       selectedSubject?.name ??
//                                         "subject",
//                                       result
//                                         .question
//                                         .difficultySource,
//                                       selectedExamType,
//                                     )}
//                                   </p>
//                                 </div>

//                                 <div className="rounded-xl bg-slate-950 p-3">
//                                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                                     Topic
//                                   </p>

//                                   <p className="mt-1 text-xs font-bold text-white">
//                                     {result
//                                       .question
//                                       .topic ||
//                                       "Missing"}
//                                   </p>
//                                 </div>

//                                 <div className="rounded-xl bg-slate-950 p-3">
//                                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                                     Difficulty
//                                   </p>

//                                   <p className="mt-1 text-xs font-bold text-white">
//                                     {
//                                       result
//                                         .question
//                                         .difficulty
//                                     }
//                                   </p>
//                                 </div>

//                                 <div className="rounded-xl bg-slate-950 p-3">
//                                   <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                                     Exam
//                                   </p>

//                                   <p className="mt-1 text-xs font-bold text-white">
//                                     {result
//                                       .question
//                                       .examType
//                                       .toUpperCase()}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   },
//                 )}

//                 {filteredValidationResults.length ===
//                   0 && (
//                   <div className="p-12 text-center">
//                     <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />

//                     <p className="mt-4 text-sm font-bold text-emerald-300">
//                       No matching validation errors
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </section>
//           )}

//         {/* DUPLICATES */}

//         {hasLoadedQuestions &&
//           hasDuplicates && (
//             <section className="overflow-hidden rounded-3xl border border-amber-500/20 bg-slate-900">
//               <div className="border-b border-slate-800 p-5 sm:p-6">
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <Copy className="h-5 w-5 text-amber-400" />

//                       <h2 className="text-xl font-black text-white">
//                         Exact Duplicate Questions
//                       </h2>
//                     </div>

//                     <p className="mt-2 text-sm leading-6 text-slate-400">
//                       Questions with matching
//                       normalized question text
//                       and option values are grouped
//                       together.
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-amber-400/10 px-4 py-3">
//                     <p className="text-[10px] font-black uppercase tracking-wider text-amber-500">
//                       Duplicate Copies
//                     </p>

//                     <p className="mt-1 text-xl font-black text-amber-300">
//                       {duplicateCopiesCount.toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
//                   <Search className="h-4 w-4 text-slate-500" />

//                   <input
//                     value={
//                       searchTerm
//                     }
//                     onChange={(
//                       event,
//                     ) =>
//                       setSearchTerm(
//                         event.target
//                           .value,
//                       )
//                     }
//                     placeholder="Search duplicate questions..."
//                     className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
//                   />
//                 </div>
//               </div>

//               <div className="divide-y divide-slate-800">
//                 {filteredDuplicateGroups.map(
//                   (
//                     group,
//                     groupIndex,
//                   ) => {
//                     const isExpanded =
//                       expandedGroups.includes(
//                         group.fingerprint,
//                       );

//                     const sourceDifficulties =
//                       new Set(
//                         group.questions.map(
//                           (question) =>
//                             question.difficultySource,
//                         ),
//                       );

//                     const isCrossDifficulty =
//                       sourceDifficulties.size >
//                       1;

//                     return (
//                       <div
//                         key={
//                           group.fingerprint
//                         }
//                       >
//                         <button
//                           type="button"
//                           onClick={() =>
//                             toggleGroup(
//                               group.fingerprint,
//                             )
//                           }
//                           className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-800/50 sm:p-6"
//                         >
//                           <div className="flex min-w-0 items-start gap-4">
//                             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-sm font-black text-amber-300">
//                               {groupIndex +
//                                 1}
//                             </div>

//                             <div className="min-w-0">
//                               <div className="mb-2 flex flex-wrap items-center gap-2">
//                                 <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
//                                   {
//                                     group
//                                       .questions
//                                       .length
//                                   }{" "}
//                                   copies
//                                 </span>

//                                 {isCrossDifficulty && (
//                                   <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
//                                     Cross-Difficulty
//                                   </span>
//                                 )}
//                               </div>

//                               <p className="line-clamp-2 text-sm font-semibold leading-6 text-slate-200">
//                                 {
//                                   group
//                                     .questions[0]
//                                     .question
//                                 }
//                               </p>
//                             </div>
//                           </div>

//                           <ChevronDown
//                             className={`h-5 w-5 shrink-0 text-slate-500 transition ${
//                               isExpanded
//                                 ? "rotate-180"
//                                 : ""
//                             }`}
//                           />
//                         </button>

//                         {isExpanded && (
//                           <div className="space-y-4 bg-slate-950/60 px-5 pb-6 sm:px-6">
//                             {group.questions.map(
//                               (
//                                 question,
//                                 questionIndex,
//                               ) => {
//                                 const isFirst =
//                                   questionIndex ===
//                                   0;

//                                 const questionIssues =
//                                   getQuestionValidationIssues(
//                                     question.localId,
//                                   );

//                                 return (
//                                   <div
//                                     key={
//                                       question.localId
//                                     }
//                                     className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
//                                   >
//                                     <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//                                       <div className="min-w-0">
//                                         <div className="mb-3 flex flex-wrap items-center gap-2">
//                                           <span className="text-xs font-black uppercase tracking-wider text-slate-500">
//                                             Copy{" "}
//                                             {questionIndex +
//                                               1}
//                                           </span>

//                                           {renderDifficultyBadge(
//                                             question.difficultySource,
//                                           )}

//                                           <span
//                                             className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
//                                               isFirst
//                                                 ? "bg-emerald-400/10 text-emerald-300"
//                                                 : "bg-red-400/10 text-red-300"
//                                             }`}
//                                           >
//                                             {isFirst
//                                               ? "First occurrence"
//                                               : "Duplicate"}
//                                           </span>

//                                           {questionIssues.length >
//                                             0 && (
//                                             <span className="rounded-full bg-red-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-300">
//                                               {
//                                                 questionIssues.length
//                                               }{" "}
//                                               validation
//                                               issue
//                                               {questionIssues.length ===
//                                               1
//                                                 ? ""
//                                                 : "s"}
//                                             </span>
//                                           )}
//                                         </div>

//                                         <p className="text-sm font-semibold leading-6 text-slate-200">
//                                           {
//                                             question.question
//                                           }
//                                         </p>

//                                         <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//                                           <div className="rounded-xl bg-slate-950 p-3">
//                                             <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                                               Difficulty
//                                             </p>

//                                             <p className="mt-1 text-xs font-bold text-white">
//                                               {
//                                                 question.difficulty
//                                               }
//                                             </p>
//                                           </div>

//                                           <div className="rounded-xl bg-slate-950 p-3">
//                                             <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                                               Source Folder
//                                             </p>

//                                             <p className="mt-1 text-xs font-bold text-white">
//                                               {
//                                                 question.difficultySource
//                                               }
//                                             </p>
//                                           </div>

//                                           <div className="rounded-xl bg-slate-950 p-3">
//                                             <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                                               Source Index
//                                             </p>

//                                             <p className="mt-1 text-xs font-bold text-white">
//                                               {
//                                                 question.sourceIndex
//                                               }
//                                             </p>
//                                           </div>

//                                           <div className="rounded-xl bg-slate-950 p-3">
//                                             <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                                               Topic
//                                             </p>

//                                             <p className="mt-1 text-xs font-bold text-white">
//                                               {question.topic ||
//                                                 "Missing"}
//                                             </p>
//                                           </div>
//                                         </div>

//                                         <div className="mt-4 grid gap-2">
//                                           {question.options.map(
//                                             (
//                                               option,
//                                               optionIndex,
//                                             ) => (
//                                               <div
//                                                 key={`${question.localId}-${optionIndex}`}
//                                                 className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
//                                               >
//                                                 <span className="mr-2 font-black text-slate-300">
//                                                   {
//                                                     option.label
//                                                   }
//                                                   .
//                                                 </span>

//                                                 <span className="text-xs text-slate-400">
//                                                   {
//                                                     option.value
//                                                   }
//                                                 </span>
//                                               </div>
//                                             ),
//                                           )}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 );
//                               },
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   },
//                 )}
//               </div>
//             </section>
//           )}

//         {/* CROSS DIFFICULTY */}

//         {hasLoadedQuestions &&
//           hasCrossDifficultyDuplicates && (
//             <section className="mt-8 overflow-hidden rounded-3xl border border-cyan-400/20 bg-cyan-400/5">
//               <div className="border-b border-cyan-400/10 p-5 sm:p-6">
//                 <div className="flex items-start gap-3">
//                   <Layers3 className="mt-0.5 h-5 w-5 text-cyan-400" />

//                   <div>
//                     <h2 className="text-xl font-black text-white">
//                       Cross-Difficulty Duplicates
//                     </h2>

//                     <p className="mt-1 text-sm leading-6 text-slate-400">
//                       The same question exists in
//                       more than one difficulty
//                       bank.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-5 grid gap-3 md:grid-cols-3">
//                   <div className="rounded-xl bg-slate-950 p-4">
//                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                       Easy ↔ Medium
//                     </p>

//                     <p className="mt-1 text-2xl font-black text-amber-300">
//                       {
//                         crossPairStats.easyMedium
//                       }
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-slate-950 p-4">
//                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                       Easy ↔ Hard
//                     </p>

//                     <p className="mt-1 text-2xl font-black text-amber-300">
//                       {
//                         crossPairStats.easyHard
//                       }
//                     </p>
//                   </div>

//                   <div className="rounded-xl bg-slate-950 p-4">
//                     <p className="text-[10px] font-black uppercase tracking-wider text-slate-600">
//                       Medium ↔ Hard
//                     </p>

//                     <p className="mt-1 text-2xl font-black text-amber-300">
//                       {
//                         crossPairStats.mediumHard
//                       }
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-5 flex items-center gap-3 rounded-xl border border-cyan-400/10 bg-slate-950 px-4 py-3">
//                   <Search className="h-4 w-4 text-slate-500" />

//                   <input
//                     value={
//                       searchTerm
//                     }
//                     onChange={(
//                       event,
//                     ) =>
//                       setSearchTerm(
//                         event.target
//                           .value,
//                       )
//                     }
//                     placeholder="Search cross-difficulty duplicates..."
//                     className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
//                   />
//                 </div>
//               </div>

//               <div className="divide-y divide-cyan-400/10">
//                 {filteredCrossDifficulty.map(
//                   (
//                     pair,
//                     index,
//                   ) => (
//                     <div
//                       key={`${pair.key}-${index}`}
//                       className="p-5 sm:p-6"
//                     >
//                       <div className="mb-4 flex flex-wrap items-center gap-2">
//                         <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300">
//                           Exact Overlap
//                         </span>

//                         <span className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-300">
//                           {pair.label}
//                         </span>
//                       </div>

//                       <div className="grid gap-4 lg:grid-cols-2">
//                         {[pair.first, pair.second].map(
//                           (item) => (
//                             <div
//                               key={
//                                 item.localId
//                               }
//                               className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
//                             >
//                               <div className="mb-3 flex flex-wrap items-center gap-2">
//                                 {renderDifficultyBadge(
//                                   item.difficultySource,
//                                 )}

//                                 <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">
//                                   Index{" "}
//                                   {
//                                     item.sourceIndex
//                                   }
//                                 </span>
//                               </div>

//                               <p className="text-sm font-semibold leading-6 text-slate-200">
//                                 {
//                                   item.question
//                                 }
//                               </p>

//                               <div className="mt-4 space-y-2 text-xs text-slate-500">
//                                 <p>
//                                   Topic:{" "}
//                                   <strong className="text-slate-300">
//                                     {
//                                       item.topic
//                                     }
//                                   </strong>
//                                 </p>

//                                 <p>
//                                   Source:{" "}
//                                   <strong className="text-slate-300">
//                                     {getSourcePath(
//                                       selectedSubject?.name ??
//                                         "subject",
//                                       item.difficultySource,
//                                       selectedExamType,
//                                     )}
//                                   </strong>
//                                 </p>
//                               </div>
//                             </div>
//                           ),
//                         )}
//                       </div>
//                     </div>
//                   ),
//                 )}
//               </div>
//             </section>
//           )}

//         {/* CLEAN STATE */}

//         {isClean && (
//           <section className="mt-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
//             <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10">
//                 <ShieldCheck className="h-6 w-6 text-emerald-400" />
//               </div>

//               <div>
//                 <div className="flex flex-wrap items-center gap-3">
//                   <h2 className="text-xl font-black text-emerald-300">
//                     Validation Passed
//                   </h2>

//                   <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
//                     PASS
//                   </span>
//                 </div>

//                 <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-200/70">
//                   No exact duplicates, cross-difficulty
//                   duplicates, difficulty mismatches,
//                   structural errors, subject mismatches,
//                   exam-type mismatches, or content
//                   validation errors were detected.
//                 </p>

//                 <div className="mt-5 flex flex-wrap gap-2">
//                   {DIFFICULTIES.map(
//                     (difficulty) => (
//                       <span
//                         key={
//                           difficulty
//                         }
//                         className={`rounded-full px-3 py-1.5 text-xs font-black ${DIFFICULTY_COLORS[difficulty]}`}
//                       >
//                         {
//                           DIFFICULTY_LABELS[
//                             difficulty
//                           ]
//                         }
//                         :{" "}
//                         {difficultyStats[
//                           difficulty
//                         ].toLocaleString()}
//                       </span>
//                     ),
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* NO ERRORS */}

//         {hasLoadedQuestions &&
//           !hasDuplicates &&
//           !hasValidationErrors && (
//             <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
//               <div className="flex items-start gap-4">
//                 <CircleCheck className="h-6 w-6 shrink-0 text-emerald-400" />

//                 <div>
//                   <h3 className="font-black text-white">
//                     All validation checks passed
//                   </h3>

//                   <p className="mt-1 text-sm leading-6 text-slate-500">
//                     The loaded Easy, Medium, and
//                     Hard banks currently contain
//                     no detected validation problems.
//                   </p>
//                 </div>
//               </div>
//             </section>
//           )}

//         {/* EMPTY STATE */}

//         {!hasLoadedQuestions &&
//           !loadingBank && (
//             <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
//               <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800">
//                 <FileSearch className="h-7 w-7 text-slate-500" />
//               </div>

//               <h2 className="mt-5 text-lg font-black text-slate-300">
//                 No Question Banks Loaded
//               </h2>

//               <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
//                 Select a subject and exam type,
//                 then click Load All Banks to run
//                 the validator.
//               </p>
//             </section>
//           )}

//         {/* VALIDATION SESSION INFO */}

//         {hasLoadedQuestions && (
//           <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
//             <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//               <div>
//                 <h2 className="font-black text-white">
//                   Validation Session
//                 </h2>

//                 <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
//                   This page reads your imported
//                   TypeScript question banks and
//                   validates them in memory. It does
//                   not modify the source files or
//                   send anything to the backend.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={
//                   loadQuestionFile
//                 }
//                 disabled={loadingBank}
//                 className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-black text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
//               >
//                 <RefreshCw className="h-4 w-4" />
//                 Reload Banks
//               </button>
//             </div>

//             <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Current Questions
//                 </p>

//                 <p className="mt-1 text-xl font-black text-white">
//                   {questions.length.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Validation Issues
//                 </p>

//                 <p
//                   className={`mt-1 text-xl font-black ${
//                     validationIssueCount ===
//                     0
//                       ? "text-emerald-400"
//                       : "text-red-400"
//                   }`}
//                 >
//                   {validationIssueCount.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Duplicate Groups
//                 </p>

//                 <p
//                   className={`mt-1 text-xl font-black ${
//                     duplicateGroupCount ===
//                     0
//                       ? "text-emerald-400"
//                       : "text-amber-400"
//                   }`}
//                 >
//                   {duplicateGroupCount.toLocaleString()}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-slate-950 p-4">
//                 <p className="text-xs font-bold text-slate-600">
//                   Cross-Difficulty
//                 </p>

//                 <p
//                   className={`mt-1 text-xl font-black ${
//                     crossDifficultyDuplicates.length ===
//                     0
//                       ? "text-emerald-400"
//                       : "text-cyan-400"
//                   }`}
//                 >
//                   {crossDifficultyDuplicates.length.toLocaleString()}
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
//               <div className="flex items-start gap-3">
//                 <Eye className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

//                 <div>
//                   <p className="text-sm font-bold text-slate-200">
//                     Read-only validation
//                   </p>

//                   <p className="mt-1 text-xs leading-5 text-slate-500">
//                     The validator does not delete,
//                     rewrite, export, upload, or save
//                     your questions. Any corrections
//                     must be made directly in your
//                     source question files.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">
//               <div className="mb-3 flex items-center gap-2">
//                 <Database className="h-4 w-4 text-cyan-400" />

//                 <p className="text-xs font-black uppercase tracking-wider text-slate-400">
//                   Expected Source Structure
//                 </p>
//               </div>

//               <div className="space-y-1 font-mono text-[11px] text-slate-500">
//                 <p>
//                   {selectedSubject?.name
//                     .toLowerCase()
//                     .replace(
//                       /[^a-z0-9]+/g,
//                       "",
//                     ) ?? "subject"}
//                   /easy/
//                   {
//                     selectedExamType
//                   }
//                   .ts
//                 </p>

//                 <p>
//                   {selectedSubject?.name
//                     .toLowerCase()
//                     .replace(
//                       /[^a-z0-9]+/g,
//                       "",
//                     ) ?? "subject"}
//                   /medium/
//                   {
//                     selectedExamType
//                   }
//                   .ts
//                 </p>

//                 <p>
//                   {selectedSubject?.name
//                     .toLowerCase()
//                     .replace(
//                       /[^a-z0-9]+/g,
//                       "",
//                     ) ?? "subject"}
//                   /hard/
//                   {
//                     selectedExamType
//                   }
//                   .ts
//                 </p>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* FOOTER NOTE */}

//         <div className="mt-8 flex items-center justify-center gap-2 pb-8 text-center text-xs text-slate-600">
//           <ShieldCheck className="h-4 w-4" />
//           Validation runs against the question
//           banks registered by your question-bank
//           loader.
//         </div>
//       </div>
//     </main>
//   );
// }