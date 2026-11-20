




"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  X,
  Loader2,
} from "lucide-react";

import { useAssessments } from "@/hooks/schools/useAssessments";
import { useAuthStore } from "@/stores/auth.store";

import { getAcademicSessions } from "@/lib/schools/portal/services/academicsessions";
import { getAcademicPeriods } from "@/lib/schools/portal/services/academicperiods";

import {
  getAllMyTeachingAssignments,
  type TeachingAssignmentClass,
} from "@/lib/schools/portal/services/teaching.assignments";

/* =========================================================
   TYPES
========================================================= */

type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "ESSAY";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

type AssessmentType =
  | "QUIZ"
  | "TEST"
  | "EXAM"
  | "ASSIGNMENT"
  | "PROJECT"
  | "PRACTICAL";

type MarkingMode = "AUTOMATIC" | "MANUAL";

interface SelectOption {
  id: string;
  name: string;
  code?: string;
}

interface QuestionOption {
  key: string;
  text: string;
  imageUrl: string;
}

interface AssessmentQuestion {
  questionType: QuestionType;
  questionText: string;
  questionImages: string[];
  options: QuestionOption[];
  answerKey: {
    correctOptionKey: string;
    correctOptionKeys: string[];
    correctBoolean: boolean;
    acceptedAnswers: string[];
    modelAnswer: string;
    markingGuide: string;
  };
  difficulty: Difficulty;
  topic: string;
  explanation: string;
  marks: number;
}

interface AssessmentForm {
  subjectId: string;
  academicSessionId: string;
  academicPeriodId: string;
  classIds: string[];
  title: string;
  description: string;
  instructions: string;
  assessmentType: AssessmentType;
  markingMode: MarkingMode;
  durationMinutes: number;
  passMark: number;
  startsAt: string;
  endsAt: string;
}

/* =========================================================
   FLEXIBLE SERVICE RESPONSE EXTRACTION
========================================================= */

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getNestedArray(
  value: unknown,
  candidateKeys: string[],
  depth = 0
): unknown[] {
  if (depth > 5 || value == null) return [];

  if (Array.isArray(value)) return value;
  if (!isRecord(value)) return [];

  for (const key of candidateKeys) {
    const candidate = value[key];

    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  for (const key of ["data", "result", "results", "response"]) {
    const nested = value[key];

    if (nested !== undefined) {
      const result = getNestedArray(
        nested,
        candidateKeys,
        depth + 1
      );

      if (result.length > 0) return result;
    }
  }

  for (const key of candidateKeys) {
    const candidate = value[key];

    if (isRecord(candidate)) {
      const nested = getNestedArray(
        candidate,
        candidateKeys,
        depth + 1
      );

      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function getString(
  record: UnknownRecord,
  keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
}

function normalizeOptions(
  records: unknown[],
  idKeys: string[],
  nameKeys: string[],
  codeKeys: string[] = []
): SelectOption[] {
  const result: SelectOption[] = [];
  const seen = new Set<string>();

  for (const item of records) {
    if (!isRecord(item)) continue;

    const id = getString(item, idKeys);
    const name = getString(item, nameKeys);
    const code = getString(item, codeKeys);

    if (!id || !name || seen.has(id)) continue;

    seen.add(id);

    result.push({
      id,
      name,
      code: code || undefined,
    });
  }

  return result;
}

function extractSessions(data: unknown): SelectOption[] {
  return normalizeOptions(
    getNestedArray(data, [
      "academicSessionsObj",
      "academicSessionObj",
      "sessionsObj",
      "academicSessions",
      "sessions",
      "sessionList",
    ]),
    ["_id", "id", "academicSessionId", "sessionId"],
    ["sessionName", "academicSessionName", "name", "title"],
    ["sessionCode", "code"]
  );
}

function extractPeriods(data: unknown): SelectOption[] {
  return normalizeOptions(
    getNestedArray(data, [
      "academicPeriodsObj",
      "academicPeriodObj",
      "periodsObj",
      "academicPeriods",
      "periods",
      "periodList",
    ]),
    ["_id", "id", "academicPeriodId", "periodId"],
    ["periodName", "academicPeriodName", "name", "title"],
    ["periodCode", "code"]
  );
}

/* =========================================================
   QUESTION HELPERS
========================================================= */

const createEmptyQuestion = (): AssessmentQuestion => ({
  questionType: "SINGLE_CHOICE",
  questionText: "",
  questionImages: [],
  options: [
    { key: "A", text: "", imageUrl: "" },
    { key: "B", text: "", imageUrl: "" },
    { key: "C", text: "", imageUrl: "" },
    { key: "D", text: "", imageUrl: "" },
  ],
  answerKey: {
    correctOptionKey: "A",
    correctOptionKeys: ["A"],
    correctBoolean: true,
    acceptedAnswers: [],
    modelAnswer: "",
    markingGuide: "",
  },
  difficulty: "EASY",
  topic: "",
  explanation: "",
  marks: 5,
});

const createInitialForm = (sessionId: string): AssessmentForm => ({
  subjectId: "",
  academicSessionId: sessionId,
  academicPeriodId: "",
  classIds: [],
  title: "",
  description: "",
  instructions: "",
  assessmentType: "QUIZ",
  markingMode: "AUTOMATIC",
  durationMinutes: 45,
  passMark: 20,
  startsAt: "",
  endsAt: "",
});

function toISODate(value: string) {
  if (!value) return "";
  return new Date(value).toISOString();
}

function updateQuestion(
  questions: AssessmentQuestion[],
  index: number,
  changes: Partial<AssessmentQuestion>
) {
  return questions.map((question, questionIndex) =>
    questionIndex === index
      ? { ...question, ...changes }
      : question
  );
}

/* =========================================================
   REUSABLE SELECT
========================================================= */

function FieldSelect({
  label,
  value,
  options,
  loading,
  disabled,
  placeholder,
  onChange,
  onReload,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  loading?: boolean;
  disabled?: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onReload?: () => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} *
        </label>

        {onReload && (
          <button
            type="button"
            onClick={onReload}
            disabled={loading}
            title={`Reload ${label}`}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            <Loader2
              size={14}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        )}
      </div>

      <div className="relative">
        <select
          required
          value={value}
          disabled={disabled || loading}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-9 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="">
            {loading
              ? `Loading ${label.toLowerCase()}...`
              : placeholder}
          </option>

          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
              {option.code ? ` (${option.code})` : ""}
            </option>
          ))}
        </select>

        {loading ? (
          <Loader2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
          />
        ) : (
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
      </div>

      {!loading && options.length === 0 && (
        <p className="mt-1 text-xs text-amber-600">
          No records available for this selection.
        </p>
      )}
    </div>
  );
}

/* =========================================================
   CREATE ASSESSMENT PAGE
========================================================= */

export default function CreateAssessmentPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const slug = params.slug;

  const initialSessionId =
    searchParams.get("academicSessionId") || "";

  const user = useAuthStore((state) => state.user);

  const schoolId =
    user?.schoolContext?.userSchoolMembership?.schoolId;

  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug;

  const membershipRole = String(
    user?.schoolContext?.userSchoolMembership?.role || ""
  ).toUpperCase();

  const isTeacher = membershipRole === "TEACHER";

  const {
    handleCreateAssessment,
    isSubmitting,
    error,
    successMessage,
  } = useAssessments(slug);

  const [form, setForm] = useState<AssessmentForm>(() =>
    createInitialForm(initialSessionId)
  );

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([
    createEmptyQuestion(),
  ]);

  /* =========================================================
     DROPDOWN DATA
  ========================================================= */

  const [academicSessions, setAcademicSessions] = useState<SelectOption[]>([]);
  const [academicPeriods, setAcademicPeriods] = useState<SelectOption[]>([]);

  const [assignedClasses, setAssignedClasses] = useState<
    TeachingAssignmentClass[]
  >([]);

  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [periodsLoading, setPeriodsLoading] = useState(false);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  const [lookupError, setLookupError] = useState("");
  const [formError, setFormError] = useState("");

  /* =========================================================
     ASSIGNED CLASS OPTIONS
  ========================================================= */

  const classes = useMemo<SelectOption[]>(() => {
    const seen = new Set<string>();

    return assignedClasses
      .filter((item) => {
        if (!item?._id || !item?.className) return false;
        if (seen.has(item._id)) return false;

        seen.add(item._id);
        return true;
      })
      .map((item) => ({
        id: item._id,
        name: item.className,
        code: item.classCode,
      }));
  }, [assignedClasses]);

  /* =========================================================
     SELECTED ASSIGNED CLASS
  ========================================================= */

  const selectedAssignedClass = useMemo(() => {
    const selectedClassId = form.classIds[0];

    if (!selectedClassId) return undefined;

    return assignedClasses.find(
      (item) => item._id === selectedClassId
    );
  }, [assignedClasses, form.classIds]);

  /* =========================================================
     ASSIGNED SUBJECT OPTIONS
  ========================================================= */

  const subjects = useMemo<SelectOption[]>(() => {
    if (!selectedAssignedClass) return [];

    const seen = new Set<string>();

    return (selectedAssignedClass.subjects || [])
      .filter((item) => {
        if (!item?._id || !item?.subjectName) return false;
        if (seen.has(item._id)) return false;

        seen.add(item._id);
        return true;
      })
      .map((item) => ({
        id: item._id,
        name: item.subjectName,
        code: item.subjectCode,
      }));
  }, [selectedAssignedClass]);

  /* =========================================================
     FETCH ACADEMIC SESSIONS
  ========================================================= */

  const fetchSessions = useCallback(async () => {
    if (!schoolSubdomain) return;

    setSessionsLoading(true);
    setLookupError("");

    try {
      const response = await getAcademicSessions(schoolSubdomain);
      const records = extractSessions(response);

      setAcademicSessions(records);

      setForm((previous) => {
        const currentExists = records.some(
          (item) => item.id === previous.academicSessionId
        );

        if (currentExists) return previous;

        const querySessionExists = records.some(
          (item) => item.id === initialSessionId
        );

        return {
          ...previous,
          academicSessionId: querySessionExists
            ? initialSessionId
            : "",
          academicPeriodId: "",
          classIds: [],
          subjectId: "",
        };
      });
    } catch (err) {
      console.error("Academic sessions fetch error:", err);

      setLookupError(
        err instanceof Error
          ? err.message
          : "Unable to load academic sessions."
      );
    } finally {
      setSessionsLoading(false);
    }
  }, [schoolSubdomain, initialSessionId]);

  /* =========================================================
     FETCH ACADEMIC PERIODS
  ========================================================= */

  const fetchPeriods = useCallback(
    async (sessionId: string) => {
      if (!sessionId || !schoolSubdomain) {
        setAcademicPeriods([]);
        return;
      }

      setPeriodsLoading(true);
      setLookupError("");

      try {
        const response = await getAcademicPeriods(
          sessionId,
          schoolSubdomain
        );

        setAcademicPeriods(extractPeriods(response));
      } catch (err) {
        console.error("Academic periods fetch error:", err);

        setAcademicPeriods([]);

        setLookupError(
          err instanceof Error
            ? err.message
            : "Unable to load academic periods."
        );
      } finally {
        setPeriodsLoading(false);
      }
    },
    [schoolSubdomain]
  );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    if (!schoolId || !schoolSubdomain || !isTeacher) return;

    void fetchSessions();
  }, [schoolId, schoolSubdomain, isTeacher, fetchSessions]);

  /* =========================================================
     FETCH PERIODS WHEN SESSION CHANGES
  ========================================================= */

  useEffect(() => {
    if (!form.academicSessionId || !schoolSubdomain || !isTeacher) {
      setAcademicPeriods([]);
      setPeriodsLoading(false);
      return;
    }

    let cancelled = false;

    const loadPeriods = async () => {
      setPeriodsLoading(true);
      setLookupError("");

      try {
        const response = await getAcademicPeriods(
          form.academicSessionId,
          schoolSubdomain
        );

        if (!cancelled) {
          setAcademicPeriods(extractPeriods(response));
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Academic periods fetch error:", err);
        setAcademicPeriods([]);

        setLookupError(
          err instanceof Error
            ? err.message
            : "Unable to load academic periods."
        );
      } finally {
        if (!cancelled) {
          setPeriodsLoading(false);
        }
      }
    };

    void loadPeriods();

    return () => {
      cancelled = true;
    };
  }, [form.academicSessionId, schoolSubdomain, isTeacher]);

  /* =========================================================
     FETCH MY TEACHING ASSIGNMENTS

     Only assignments belonging to the logged-in teacher
     are returned by this endpoint.
  ========================================================= */

  useEffect(() => {
    if (
      !form.academicSessionId ||
      !schoolSubdomain ||
      !isTeacher
    ) {
      setAssignedClasses([]);
      setAssignmentsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchAssignments = async () => {
      setAssignmentsLoading(true);
      setLookupError("");
      setAssignedClasses([]);

      try {
        const response = await getAllMyTeachingAssignments(
          form.academicSessionId,
          schoolSubdomain
        );

        if (cancelled) return;

       setAssignedClasses(
  Array.isArray(response)
    ? response.filter(
        (item) =>
          item &&
          item._id &&
          item.className
      )
    : []
);
      } catch (err) {
        if (cancelled) return;

        console.error("Teacher assignments fetch error:", err);

        setAssignedClasses([]);

        setLookupError(
          err instanceof Error
            ? err.message
            : "Unable to load your teaching assignments."
        );
      } finally {
        if (!cancelled) {
          setAssignmentsLoading(false);
        }
      }
    };

    void fetchAssignments();

    return () => {
      cancelled = true;
    };
  }, [
    form.academicSessionId,
    schoolSubdomain,
    isTeacher,
  ]);

  /* =========================================================
     FORM HANDLERS
  ========================================================= */

  const setField = <K extends keyof AssessmentForm>(
    key: K,
    value: AssessmentForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSessionChange = (sessionId: string) => {
    setForm((previous) => ({
      ...previous,
      academicSessionId: sessionId,
      academicPeriodId: "",
      classIds: [],
      subjectId: "",
    }));

    setAcademicPeriods([]);
    setAssignedClasses([]);
    setLookupError("");
    setFormError("");
  };

  const handleClassChange = (classId: string) => {
    setForm((previous) => ({
      ...previous,
      classIds: classId ? [classId] : [],
      subjectId: "",
    }));

    setFormError("");
  };

  /* =========================================================
     QUESTION HANDLERS
  ========================================================= */

  const addQuestion = () => {
    setQuestions((previous) => [
      ...previous,
      createEmptyQuestion(),
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((previous) =>
      previous.filter((_, questionIndex) => questionIndex !== index)
    );
  };

  const changeQuestion = (
    index: number,
    changes: Partial<AssessmentQuestion>
  ) => {
    setQuestions((previous) =>
      updateQuestion(previous, index, changes)
    );
  };

  const changeAnswerKey = (
    index: number,
    changes: Partial<AssessmentQuestion["answerKey"]>
  ) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              answerKey: {
                ...question.answerKey,
                ...changes,
              },
            }
          : question
      )
    );
  };

  const changeOption = (
    questionIndex: number,
    optionIndex: number,
    changes: Partial<QuestionOption>
  ) => {
    setQuestions((previous) =>
      previous.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: question.options.map((option, i) =>
                i === optionIndex
                  ? { ...option, ...changes }
                  : option
              ),
            }
          : question
      )
    );
  };

  const addOption = (questionIndex: number) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (index !== questionIndex) return question;

        const nextKey = String.fromCharCode(
          65 + question.options.length
        );

        return {
          ...question,
          options: [
            ...question.options,
            { key: nextKey, text: "", imageUrl: "" },
          ],
        };
      })
    );
  };

  const removeOption = (
    questionIndex: number,
    optionIndex: number
  ) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (index !== questionIndex) return question;

        const removedKey = question.options[optionIndex]?.key;

        const options = question.options
          .filter((_, i) => i !== optionIndex)
          .map((option, i) => ({
            ...option,
            key: String.fromCharCode(65 + i),
          }));

        const correctOptionKeys =
          question.answerKey.correctOptionKeys
            .filter((key) => key !== removedKey)
            .map((key) => {
              const oldIndex = question.options.findIndex(
                (option) => option.key === key
              );

              return oldIndex >= 0 && oldIndex !== optionIndex
                ? String.fromCharCode(
                    65 +
                      (oldIndex > optionIndex
                        ? oldIndex - 1
                        : oldIndex)
                  )
                : "";
            })
            .filter(Boolean);

        return {
          ...question,
          options,
          answerKey: {
            ...question.answerKey,
            correctOptionKey:
              correctOptionKeys[0] || options[0]?.key || "",
            correctOptionKeys,
          },
        };
      })
    );
  };

  const toggleCorrectOption = (
    questionIndex: number,
    optionKey: string
  ) => {
    const question = questions[questionIndex];

    if (!question) return;

    if (question.questionType === "SINGLE_CHOICE") {
      changeAnswerKey(questionIndex, {
        correctOptionKey: optionKey,
        correctOptionKeys: [optionKey],
      });

      return;
    }

    const selected = question.answerKey.correctOptionKeys;

    const updated = selected.includes(optionKey)
      ? selected.filter((key) => key !== optionKey)
      : [...selected, optionKey];

    changeAnswerKey(questionIndex, {
      correctOptionKeys: updated,
      correctOptionKey: updated[0] || "",
    });
  };

  const changeQuestionType = (
    index: number,
    questionType: QuestionType
  ) => {
    setQuestions((previous) =>
      previous.map((question, questionIndex) => {
        if (questionIndex !== index) return question;

        const options =
          questionType === "TRUE_FALSE"
            ? [
                { key: "A", text: "True", imageUrl: "" },
                { key: "B", text: "False", imageUrl: "" },
              ]
            : question.options.length
              ? question.options
              : [
                  { key: "A", text: "", imageUrl: "" },
                  { key: "B", text: "", imageUrl: "" },
                  { key: "C", text: "", imageUrl: "" },
                  { key: "D", text: "", imageUrl: "" },
                ];

        return {
          ...question,
          questionType,
          options,
          answerKey: {
            ...question.answerKey,
            correctOptionKey: "A",
            correctOptionKeys: ["A"],
          },
        };
      })
    );
  };


/* =========================================================
   SUBMIT ASSESSMENT
========================================================= */

const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
  setFormError("");

  if (!isTeacher) {
    setFormError(
      "Only teachers can create assessments from this page."
    );
    return;
  }

  if (!schoolId || !schoolSubdomain) {
    setFormError(
      "Your school information is not available. Please refresh and try again."
    );
    return;
  }

  if (assignmentsLoading) {
    setFormError(
      "Please wait while your teaching assignments load."
    );
    return;
  }

  if (
    !form.subjectId ||
    !form.academicSessionId ||
    !form.academicPeriodId
  ) {
    setFormError(
      "Subject, academic session and academic period are required."
    );
    return;
  }

  if (form.classIds.length !== 1) {
    setFormError("Select one assigned class.");
    return;
  }

  const assignedClass = assignedClasses.find(
    (item) => item._id === form.classIds[0]
  );

  if (!assignedClass) {
    setFormError(
      "The selected class is not assigned to you for this academic session."
    );
    return;
  }

  const subjectIsAssigned = (
    assignedClass.subjects || []
  ).some((subject) => subject._id === form.subjectId);

  if (!subjectIsAssigned) {
    setFormError(
      "The selected subject is not assigned to you in this class."
    );
    return;
  }

  if (!form.title.trim()) {
    setFormError("Assessment title is required.");
    return;
  }

  if (form.durationMinutes <= 0 || form.passMark < 0) {
    setFormError("Enter a valid duration and pass mark.");
    return;
  }

  if (!form.startsAt || !form.endsAt) {
    setFormError(
      "Assessment start and end times are required."
    );
    return;
  }

  const startDate = new Date(form.startsAt);
  const endDate = new Date(form.endsAt);

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate <= startDate
  ) {
    setFormError(
      "The end time must be later than the start time."
    );
    return;
  }

  if (questions.length === 0) {
    setFormError("Add at least one question.");
    return;
  }

  /* -------------------------------------------------------
     VALIDATE QUESTIONS
  ------------------------------------------------------- */

  for (let index = 0; index < questions.length; index++) {
    const question = questions[index];

    if (!question.questionText.trim()) {
      setFormError(
        `Question ${index + 1}: Enter the question text.`
      );
      return;
    }

    if (question.marks <= 0) {
      setFormError(
        `Question ${index + 1}: Marks must be greater than zero.`
      );
      return;
    }

    if (
      question.questionType === "SINGLE_CHOICE" ||
      question.questionType === "MULTIPLE_CHOICE"
    ) {
      const validOptions = question.options.filter(
        (option) => option.text.trim()
      );

      if (validOptions.length < 2) {
        setFormError(
          `Question ${index + 1}: Provide at least two answer options.`
        );
        return;
      }

      const validCorrectKeys =
        question.answerKey.correctOptionKeys.filter((key) =>
          validOptions.some((option) => option.key === key)
        );

      if (validCorrectKeys.length === 0) {
        setFormError(
          `Question ${index + 1}: Select at least one valid correct answer.`
        );
        return;
      }

      if (
        question.questionType === "SINGLE_CHOICE" &&
        validCorrectKeys.length !== 1
      ) {
        setFormError(
          `Question ${index + 1}: Select only one correct answer.`
        );
        return;
      }
    }

    if (
      question.questionType === "TRUE_FALSE" &&
      typeof question.answerKey.correctBoolean !== "boolean"
    ) {
      setFormError(
        `Question ${index + 1}: Select True or False as the correct answer.`
      );
      return;
    }

    if (
      question.questionType === "SHORT_ANSWER" &&
      !question.answerKey.acceptedAnswers.some(
        (answer) => answer.trim()
      )
    ) {
      setFormError(
        `Question ${index + 1}: Enter at least one accepted answer.`
      );
      return;
    }

    if (
      question.questionType === "ESSAY" &&
      !question.answerKey.modelAnswer.trim()
    ) {
      setFormError(
        `Question ${index + 1}: Enter a model answer.`
      );
      return;
    }
  }

  /* -------------------------------------------------------
     BUILD PAYLOAD
  ------------------------------------------------------- */

  const payload = {
    subjectId: form.subjectId,
    academicSessionId: form.academicSessionId,
    academicPeriodId: form.academicPeriodId,

    classIds: [form.classIds[0]],

    title: form.title.trim(),
    description: form.description.trim(),
    instructions: form.instructions.trim(),
    assessmentType: form.assessmentType,
    markingMode: form.markingMode,
    durationMinutes: Number(form.durationMinutes),
    passMark: Number(form.passMark),
    startsAt: toISODate(form.startsAt),
    endsAt: toISODate(form.endsAt),

    questions: questions.map((question) => {
      const isChoiceQuestion =
        question.questionType === "SINGLE_CHOICE" ||
        question.questionType === "MULTIPLE_CHOICE";

      const validOptions = question.options.filter(
        (option) =>
          option.text.trim() || option.imageUrl.trim()
      );

      const correctOptionKeys = isChoiceQuestion
        ? question.answerKey.correctOptionKeys.filter((key) =>
            validOptions.some(
              (option) =>
                option.key === key && option.text.trim()
            )
          )
        : [];

      // Convert selected correct option keys into their actual text.
      const acceptedAnswers = isChoiceQuestion
        ? validOptions
            .filter((option) =>
              correctOptionKeys.includes(option.key)
            )
            .map((option) => option.text.trim())
            .filter(Boolean)
        : question.answerKey.acceptedAnswers
            .map((answer) => answer.trim())
            .filter(Boolean);

      return {
        questionType: question.questionType,
        questionText: question.questionText.trim(),
        questionImages: question.questionImages,

        options: validOptions.map((option) => ({
          key: option.key,
          text: option.text.trim(),
          imageUrl: option.imageUrl.trim(),
        })),

        answerKey: {
          correctOptionKey: isChoiceQuestion
            ? correctOptionKeys[0] || ""
            : question.answerKey.correctOptionKey,

          correctOptionKeys,

          correctBoolean: question.answerKey.correctBoolean,

          acceptedAnswers,

          modelAnswer: question.answerKey.modelAnswer.trim(),

          markingGuide: question.answerKey.markingGuide,
        },

        difficulty: question.difficulty,
        topic: question.topic.trim(),
        explanation: question.explanation.trim(),
        marks: Number(question.marks),
      };
    }),
  };

  // Temporary debugging: inspect the exact payload before submission.
  console.log(
    "CREATE ASSESSMENT PAYLOAD:",
    JSON.stringify(payload, null, 2)
  );

  try {
    const result = await handleCreateAssessment(payload);

    if (result) {
      router.push(
        `/schools/${slug}/assessments?academicSessionId=${encodeURIComponent(
          form.academicSessionId
        )}`
      );
    }
  } catch (error) {
    console.error("Create assessment error:", error);

    setFormError(
      error instanceof Error
        ? error.message
        : "Unable to create assessment. Please try again."
    );
  }
};


  /* =========================================================
     ACCESS CHECK
  ========================================================= */

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
          <Loader2 className="mx-auto mb-3 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (!isTeacher) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-lg font-semibold text-amber-900">
            Access restricted
          </h1>

          <p className="mt-2 text-sm text-amber-800">
            This assessment creation page is available to teachers only.
          </p>

          <Link
            href={`/schools/${slug}/assessments`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE UI
  ========================================================= */

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 pb-12 md:p-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href={`/schools/${slug}/assessments`}
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Assessments
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">
            Create Assessment
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create an assessment for a class and subject assigned to you.
          </p>
        </div>
      </div>

      {(formError || error || lookupError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {formError || error || lookupError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ASSESSMENT DETAILS */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <BookOpen className="text-blue-600" size={21} />

            <div>
              <h2 className="font-semibold text-gray-900">
                Assessment Details
              </h2>

              <p className="text-sm text-gray-500">
                Basic information and academic placement.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* TITLE */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Assessment Title *
              </label>

              <input
                required
                value={form.title}
                onChange={(e) =>
                  setField("title", e.target.value)
                }
                placeholder="e.g. First Continuous Assessment"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* ACADEMIC SESSION */}
            <FieldSelect
              label="Academic Session"
              value={form.academicSessionId}
              options={academicSessions}
              loading={sessionsLoading}
              placeholder="Select academic session"
              onChange={handleSessionChange}
              onReload={() => void fetchSessions()}
            />

            {/* ACADEMIC PERIOD */}
            <FieldSelect
              label="Academic Period"
              value={form.academicPeriodId}
              options={academicPeriods}
              loading={periodsLoading}
              disabled={!form.academicSessionId}
              placeholder={
                form.academicSessionId
                  ? "Select academic period"
                  : "Select a session first"
              }
              onChange={(value) =>
                setField("academicPeriodId", value)
              }
              onReload={
                form.academicSessionId
                  ? () => void fetchPeriods(form.academicSessionId)
                  : undefined
              }
            />

            {/* ASSIGNED CLASS */}
            <FieldSelect
              label="Assigned Class"
              value={form.classIds[0] || ""}
              options={classes}
              loading={assignmentsLoading}
              disabled={!form.academicSessionId}
              placeholder={
                !form.academicSessionId
                  ? "Select an academic session first"
                  : "Select your assigned class"
              }
              onChange={handleClassChange}
            />

            {/* ASSIGNED SUBJECT */}
            <FieldSelect
              label="Assigned Subject"
              value={form.subjectId}
              options={subjects}
              loading={assignmentsLoading}
              disabled={
                !form.classIds.length ||
                assignmentsLoading ||
                !selectedAssignedClass
              }
              placeholder={
                !form.classIds.length
                  ? "Select a class first"
                  : "Select your assigned subject"
              }
              onChange={(value) =>
                setField("subjectId", value)
              }
            />

            {/* ASSIGNMENT INFORMATION */}
            {form.academicSessionId && !assignmentsLoading && (
              <div className="md:col-span-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
                <p className="text-sm text-blue-800">
                  <strong>Your teaching assignments:</strong>{" "}
                  Only classes and subjects assigned to you for the
                  selected academic session are available here.
                </p>

                {classes.length === 0 && (
                  <p className="mt-1 text-sm text-amber-700">
                    You have no class or subject assignments for this
                    academic session. Contact your school administrator
                    if this is unexpected.
                  </p>
                )}

                {selectedAssignedClass && subjects.length === 0 && (
                  <p className="mt-1 text-sm text-amber-700">
                    No subjects are assigned to you in this class.
                  </p>
                )}
              </div>
            )}

            {/* ASSIGNMENT LOADING */}
            {form.academicSessionId && assignmentsLoading && (
              <div className="md:col-span-2 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
                <Loader2 size={16} className="animate-spin" />
                Loading your teaching assignments...
              </div>
            )}

            {/* ASSESSMENT TYPE */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Assessment Type *
              </label>

              <select
                value={form.assessmentType}
                onChange={(e) =>
                  setField(
                    "assessmentType",
                    e.target.value as AssessmentType
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                <option value="QUIZ">Quiz</option>
                <option value="TEST">Test</option>
                <option value="EXAM">Examination</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="PROJECT">Project</option>
                <option value="PRACTICAL">Practical</option>
              </select>
            </div>

            {/* MARKING MODE */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Marking Mode *
              </label>

              <select
                value={form.markingMode}
                onChange={(e) =>
                  setField(
                    "markingMode",
                    e.target.value as MarkingMode
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                <option value="AUTOMATIC">Automatic</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>

            {/* DURATION */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Duration (minutes) *
              </label>

              <input
                required
                type="number"
                min="1"
                value={form.durationMinutes}
                onChange={(e) =>
                  setField(
                    "durationMinutes",
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>

            {/* PASS MARK */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Pass Mark *
              </label>

              <input
                required
                type="number"
                min="0"
                value={form.passMark}
                onChange={(e) =>
                  setField("passMark", Number(e.target.value))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>

            {/* START */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Starts At *
              </label>

              <input
                required
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) =>
                  setField("startsAt", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>

            {/* END */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Ends At *
              </label>

              <input
                required
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) =>
                  setField("endsAt", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setField("description", e.target.value)
                }
                placeholder="Describe this assessment..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>

            {/* INSTRUCTIONS */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Instructions
              </label>

              <textarea
                rows={3}
                value={form.instructions}
                onChange={(e) =>
                  setField("instructions", e.target.value)
                }
                placeholder="Instructions for students..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </section>

        {/* QUESTIONS */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Assessment Questions
              </h2>

              <p className="text-sm text-gray-500">
                Add questions, answer options and marking information.
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Question
            </button>
          </div>

          {questions.map((question, index) => (
            <QuestionEditor
              key={index}
              question={question}
              index={index}
              onChange={(changes) =>
                changeQuestion(index, changes)
              }
              onChangeType={(type) =>
                changeQuestionType(index, type)
              }
              onChangeAnswerKey={(changes) =>
                changeAnswerKey(index, changes)
              }
              onChangeOption={(optionIndex, changes) =>
                changeOption(index, optionIndex, changes)
              }
              onAddOption={() => addOption(index)}
              onRemoveOption={(optionIndex) =>
                removeOption(index, optionIndex)
              }
              onToggleCorrectOption={(key) =>
                toggleCorrectOption(index, key)
              }
              onRemove={() => removeQuestion(index)}
            />
          ))}
        </section>

        {/* SUBMIT */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-5">
          <div>
            <p className="font-semibold text-gray-900">
              {questions.length} question(s) added
            </p>

            <p className="text-sm text-gray-500">
              Review your assessment before creating it.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/schools/${slug}/assessments`}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                assignmentsLoading ||
                sessionsLoading ||
                !form.academicSessionId
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {isSubmitting ? "Creating..." : "Create Assessment"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   QUESTION EDITOR
========================================================= */

interface QuestionEditorProps {
  question: AssessmentQuestion;
  index: number;
  onChange: (changes: Partial<AssessmentQuestion>) => void;
  onChangeType: (type: QuestionType) => void;
  onChangeAnswerKey: (
    changes: Partial<AssessmentQuestion["answerKey"]>
  ) => void;
  onChangeOption: (
    optionIndex: number,
    changes: Partial<QuestionOption>
  ) => void;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
  onToggleCorrectOption: (key: string) => void;
  onRemove: () => void;
}

function QuestionEditor({
  question,
  index,
  onChange,
  onChangeType,
  onChangeAnswerKey,
  onChangeOption,
  onAddOption,
  onRemoveOption,
  onToggleCorrectOption,
  onRemove,
}: QuestionEditorProps) {
  const [expanded, setExpanded] = useState(true);

  const [imageInput, setImageInput] = useState(
    question.questionImages.join(", ")
  );

  const [acceptedAnswerInput, setAcceptedAnswerInput] =
    useState(question.answerKey.acceptedAnswers.join(", "));

  const isChoice =
    question.questionType === "SINGLE_CHOICE" ||
    question.questionType === "MULTIPLE_CHOICE";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            {index + 1}
          </span>

          <span>
            <span className="block text-sm font-semibold text-gray-900">
              Question {index + 1}
            </span>

            <span className="block text-xs text-gray-500">
              {question.questionType.replaceAll("_", " ")} ·{" "}
              {question.marks} marks
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRemove}
            title="Remove question"
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={17} />
          </button>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-200"
          >
            {expanded ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Question Type *
              </label>

              <select
                value={question.questionType}
                onChange={(e) =>
                  onChangeType(e.target.value as QuestionType)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                <option value="SINGLE_CHOICE">Single Choice</option>
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TRUE_FALSE">True / False</option>
                <option value="SHORT_ANSWER">Short Answer</option>
                <option value="ESSAY">Essay</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Marks *
              </label>

              <input
                type="number"
                min="1"
                value={question.marks}
                onChange={(e) =>
                  onChange({ marks: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Question Text *
            </label>

            <textarea
              required
              rows={3}
              value={question.questionText}
              onChange={(e) =>
                onChange({ questionText: e.target.value })
              }
              placeholder="Enter your question..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <ImagePlus size={16} />
              Question Image URLs
            </label>

            <textarea
              rows={2}
              value={imageInput}
              onChange={(e) => {
                setImageInput(e.target.value);

                onChange({
                  questionImages: e.target.value
                    .split(/[\n,]+/)
                    .map((value) => value.trim())
                    .filter(Boolean),
                });
              }}
              placeholder="Paste image URLs separated by commas"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>

          {isChoice && (
            <div className="space-y-3 rounded-lg bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Answer Options
                  </h3>

                  <p className="text-xs text-gray-500">
                    {question.questionType === "MULTIPLE_CHOICE"
                      ? "Select all correct answers."
                      : "Select one correct answer."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onAddOption}
                  disabled={question.options.length >= 26}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 disabled:opacity-50"
                >
                  <Plus size={14} />
                  Add Option
                </button>
              </div>

              {question.options.map((option, optionIndex) => {
                const selected =
                  question.questionType === "SINGLE_CHOICE"
                    ? question.answerKey.correctOptionKey === option.key
                    : question.answerKey.correctOptionKeys.includes(
                        option.key
                      );

                return (
                  <div
                    key={`${option.key}-${optionIndex}`}
                    className="flex flex-wrap items-start gap-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onToggleCorrectOption(option.key)
                      }
                      title="Mark as correct answer"
                      className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${
                        selected
                          ? "border-green-500 bg-green-100 text-green-700"
                          : "border-gray-300 bg-white text-gray-600"
                      }`}
                    >
                      {option.key}
                    </button>

                    <div className="min-w-0 flex-1 space-y-2">
                      <input
                        value={option.text}
                        onChange={(e) =>
                          onChangeOption(optionIndex, {
                            text: e.target.value,
                          })
                        }
                        placeholder={`Option ${option.key}`}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />

                      <input
                        value={option.imageUrl}
                        onChange={(e) =>
                          onChangeOption(optionIndex, {
                            imageUrl: e.target.value,
                          })
                        }
                        placeholder="Optional option image URL"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs"
                      />
                    </div>

                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() =>
                          onRemoveOption(optionIndex)
                        }
                        title="Remove option"
                        className="mt-1 rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <X size={17} />
                      </button>
                    )}
                  </div>
                );
              })}

              <p className="text-xs text-gray-500">
                Green option letters indicate the selected correct answer(s).
              </p>
            </div>
          )}

          {question.questionType === "TRUE_FALSE" && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Correct Answer
              </h3>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onChangeAnswerKey({
                      correctBoolean: true,
                      correctOptionKey: "A",
                      correctOptionKeys: ["A"],
                    })
                  }
                  className={`rounded-lg border px-4 py-2 text-sm ${
                    question.answerKey.correctBoolean
                      ? "border-green-500 bg-green-100 text-green-700"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  True
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onChangeAnswerKey({
                      correctBoolean: false,
                      correctOptionKey: "B",
                      correctOptionKeys: ["B"],
                    })
                  }
                  className={`rounded-lg border px-4 py-2 text-sm ${
                    !question.answerKey.correctBoolean
                      ? "border-green-500 bg-green-100 text-green-700"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  False
                </button>
              </div>
            </div>
          )}

          {question.questionType === "SHORT_ANSWER" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Accepted Answers *
              </label>

              <textarea
                rows={2}
                value={acceptedAnswerInput}
                onChange={(e) => {
                  setAcceptedAnswerInput(e.target.value);

                  onChangeAnswerKey({
                    acceptedAnswers: e.target.value
                      .split(/[\n,]+/)
                      .map((value) => value.trim())
                      .filter(Boolean),
                  });
                }}
                placeholder="Enter accepted answers separated by commas"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>
          )}

          {question.questionType === "ESSAY" && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Model Answer *
                </label>

                <textarea
                  rows={4}
                  value={question.answerKey.modelAnswer}
                  onChange={(e) =>
                    onChangeAnswerKey({
                      modelAnswer: e.target.value,
                    })
                  }
                  placeholder="Enter the expected answer..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Marking Guide
                </label>

                <textarea
                  rows={3}
                  value={question.answerKey.markingGuide}
                  onChange={(e) =>
                    onChangeAnswerKey({
                      markingGuide: e.target.value,
                    })
                  }
                  placeholder="Explain how marks should be awarded..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Difficulty
              </label>

              <select
                value={question.difficulty}
                onChange={(e) =>
                  onChange({
                    difficulty: e.target.value as Difficulty,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Topic
              </label>

              <input
                value={question.topic}
                onChange={(e) =>
                  onChange({ topic: e.target.value })
                }
                placeholder="e.g. Photosynthesis"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Explanation
            </label>

            <textarea
              rows={2}
              value={question.explanation}
              onChange={(e) =>
                onChange({ explanation: e.target.value })
              }
              placeholder="Explain why the answer is correct..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}