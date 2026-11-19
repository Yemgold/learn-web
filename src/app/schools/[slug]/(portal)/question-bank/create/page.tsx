




"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  X,
  CalendarDays,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";

import {
  createQuestions,
  type QuestionType,
  type QuestionDifficulty,
  type QuestionOption,
  type CreateQuestionItem,
} from "@/lib/schools/portal/services/question-bank.service";

import {
  getAllMyTeachingAssignments,
} from "@/lib/schools/portal/services/teaching.assignments";

import {
  getAcademicSessions,
} from "@/lib/schools/portal/services/academicsessions";

import {
  extractAcademicSessions,
} from "@/lib/schools/utils/enrollment.utils";

/* =========================================================
   TYPES
========================================================= */

interface AcademicSessionOption {
  _id: string;
  label: string;
}

interface AssignedSubject {
  _id: string;
  subjectName: string;
  subjectCode?: string;
}

interface AssignedClass {
  _id: string;
  className: string;
  classCode?: string;
  subjects: string[];
}

interface OptionDraft {
  key: string;
  text: string;
}

const QUESTION_TYPES: {
  value: QuestionType;
  label: string;
}[] = [
  { value: "SINGLE_CHOICE", label: "Single Choice" },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "TRUE_FALSE", label: "True / False" },
  { value: "SHORT_ANSWER", label: "Short Answer" },
  { value: "ESSAY", label: "Essay" },
];

const DIFFICULTIES: QuestionDifficulty[] = [
  "EASY",
  "MEDIUM",
  "HARD",
];

const INITIAL_OPTIONS: OptionDraft[] = [
  { key: "A", text: "" },
  { key: "B", text: "" },
  { key: "C", text: "" },
  { key: "D", text: "" },
];

/* =========================================================
   HELPERS
========================================================= */

function getRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function getText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function getId(value: unknown): string {
  if (typeof value === "string") return value;

  if (!value || typeof value !== "object") return "";

  const record = getRecord(value);

  if (typeof record._id === "string") return record._id;
  if (typeof record.id === "string") return record.id;
  if (typeof record.subjectId === "string") return record.subjectId;
  if (typeof record.classId === "string") return record.classId;

  return "";
}

function parseLines(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getQuestionOptions(
  options: OptionDraft[],
): QuestionOption[] {
  return options
    .filter((option) => option.text.trim())
    .map((option) => ({
      key: option.key,
      text: option.text.trim(),
    }));
}

/* =========================================================
   ACADEMIC SESSION NORMALIZATION
========================================================= */

function normalizeAcademicSession(
  value: unknown,
): AcademicSessionOption | null {
  const record = getRecord(value);

  const id =
    getId(record._id) ||
    getId(record.id) ||
    getId(record.academicSessionId);

  if (!id) return null;

  const sessionName =
    getText(record.sessionName) ||
    getText(record.academicSessionName) ||
    getText(record.name) ||
    getText(record.academicYear) ||
    getText(record.year);

  const startDate = getText(record.startDate);
  const endDate = getText(record.endDate);

  const dateLabel =
    startDate || endDate
      ? `${startDate || "Start date unavailable"} - ${
          endDate || "End date unavailable"
        }`
      : "";

  return {
    _id: id,
    label: sessionName
      ? `${sessionName}${dateLabel ? ` (${dateLabel})` : ""}`
      : dateLabel || `Academic Session ${id.slice(-6)}`,
  };
}

/* =========================================================
   TEACHING ASSIGNMENT NORMALIZATION
========================================================= */

function extractAssignmentClasses(response: unknown): unknown[] {
  if (Array.isArray(response)) return response;

  const root = getRecord(response);
  const data = getRecord(root.data);

  const candidates = [
    root.classes,
    root.classesObj,
    root.teachingAssignments,
    root.teachingAssignmentsObj,
    root.assignments,
    root.assignmentsObj,
    data.classes,
    data.classesObj,
    data.teachingAssignments,
    data.teachingAssignmentsObj,
    data.assignments,
    data.assignmentsObj,
    data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function normalizeAssignmentClass(
  value: unknown,
): AssignedClass | null {
  const record = getRecord(value);

  const nestedClass =
    getRecord(record.class). _id
      ? getRecord(record.class)
      : getRecord(record.schoolClass)._id
        ? getRecord(record.schoolClass)
        : getRecord(record.classObj)._id
          ? getRecord(record.classObj)
          : record;

  const id =
    getId(nestedClass._id) ||
    getId(nestedClass.id) ||
    getId(nestedClass.classId) ||
    getId(record.classId) ||
    getId(record.class);

  if (!id) return null;

  const rawSubjects = Array.isArray(record.subjects)
    ? record.subjects
    : Array.isArray(nestedClass.subjects)
      ? nestedClass.subjects
      : [];

  return {
    _id: id,
    className:
      getText(nestedClass.className) ||
      getText(nestedClass.name) ||
      getText(record.className) ||
      "Unnamed class",
    classCode:
      getText(nestedClass.classCode) ||
      getText(record.classCode),
    subjects: rawSubjects.map(getId).filter(Boolean),
  };
}

function extractAssignmentSubjects(
  assignments: unknown[],
): AssignedSubject[] {
  const subjectMap = new Map<string, AssignedSubject>();

  for (const assignment of assignments) {
    const record = getRecord(assignment);

    const nestedClass = getRecord(
      record.class || record.schoolClass || record.classObj,
    );

    const rawSubjects = Array.isArray(record.subjects)
      ? record.subjects
      : Array.isArray(nestedClass.subjects)
        ? nestedClass.subjects
        : [];

    for (const rawSubject of rawSubjects) {
      const subject = getRecord(rawSubject);

      const id =
        getId(subject._id) ||
        getId(subject.id) ||
        getId(subject.subjectId) ||
        getId(rawSubject);

      if (!id) continue;

      subjectMap.set(id, {
        _id: id,
        subjectName:
          getText(subject.subjectName) ||
          getText(subject.name) ||
          "Unnamed subject",
        subjectCode: getText(subject.subjectCode),
      });
    }
  }

  return Array.from(subjectMap.values());
}

/* =========================================================
   PAGE
========================================================= */

export default function CreateQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = String(params.slug ?? "");

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug;

  const role = (
    user?.schoolContext?.userSchoolMembership?.role || ""
  ).toUpperCase();

  const isTeacher = role === "TEACHER";

  /* =======================================================
     REQUEST CONTROL
  ======================================================= */

  const sessionRequestId = useRef(0);
  const assignmentRequestId = useRef(0);

  /* =======================================================
     ACADEMIC SESSIONS
  ======================================================= */

  const [academicSessions, setAcademicSessions] = useState<
    AcademicSessionOption[]
  >([]);

  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState("");

  const [academicSessionId, setAcademicSessionId] = useState(
    searchParams.get("academicSessionId") || "",
  );

  /* =======================================================
     TEACHER ASSIGNMENTS
  ======================================================= */

  const [subjects, setSubjects] = useState<AssignedSubject[]>([]);
  const [classes, setClasses] = useState<AssignedClass[]>([]);

  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [optionsError, setOptionsError] = useState("");

  const [classId, setClassId] = useState(
    searchParams.get("classId") || "",
  );

  const [subjectId, setSubjectId] = useState(
    searchParams.get("subjectId") || "",
  );

  /* =======================================================
     QUESTION FORM
  ======================================================= */

  const [questionType, setQuestionType] =
    useState<QuestionType>("SINGLE_CHOICE");

  const [difficulty, setDifficulty] =
    useState<QuestionDifficulty>("MEDIUM");

  const [questionText, setQuestionText] = useState("");
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [questionImages, setQuestionImages] = useState("");

  const [options, setOptions] = useState<OptionDraft[]>(
    INITIAL_OPTIONS.map((option) => ({ ...option })),
  );

  const [correctOptionKeys, setCorrectOptionKeys] = useState<string[]>([]);
  const [correctBoolean, setCorrectBoolean] = useState(true);

  const [acceptedAnswers, setAcceptedAnswers] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [markingGuide, setMarkingGuide] = useState("");

  /* =======================================================
     SUBMISSION
  ======================================================= */

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =======================================================
     LOAD ALL ACADEMIC SESSIONS
  ======================================================= */

  const loadAcademicSessions = useCallback(async () => {
    if (!isHydrated || !schoolSubdomain.trim()) return;

    const currentRequestId = ++sessionRequestId.current;

    setLoadingSessions(true);
    setSessionsError("");

    try {
      const response = await getAcademicSessions(schoolSubdomain);

      if (currentRequestId !== sessionRequestId.current) return;

      const extracted = extractAcademicSessions(response);

      const normalized = (Array.isArray(extracted) ? extracted : [])
        .map(normalizeAcademicSession)
        .filter(
          (item): item is AcademicSessionOption => Boolean(item),
        );

      const uniqueSessions = Array.from(
        new Map(
          normalized.map((session) => [session._id, session]),
        ).values(),
      );

      setAcademicSessions(uniqueSessions);

      // Preserve a session passed in the URL only if it exists.
      const requestedSessionId =
        searchParams.get("academicSessionId") || "";

      setAcademicSessionId((current) => {
        const candidate = current || requestedSessionId;

        return uniqueSessions.some(
          (session) => session._id === candidate,
        )
          ? candidate
          : "";
      });

      if (uniqueSessions.length === 0) {
        setSessionsError(
          "No academic sessions have been created for this school yet.",
        );
      }
    } catch (err) {
      console.error("Academic sessions loading error:", err);

      if (currentRequestId === sessionRequestId.current) {
        setAcademicSessions([]);
        setAcademicSessionId("");
        setSessionsError(
          err instanceof Error
            ? err.message
            : "Unable to load academic sessions.",
        );
      }
    } finally {
      if (currentRequestId === sessionRequestId.current) {
        setLoadingSessions(false);
      }
    }
  }, [isHydrated, schoolSubdomain, searchParams]);

  useEffect(() => {
    if (!isHydrated || !isTeacher) return;

    void loadAcademicSessions();

    return () => {
      sessionRequestId.current += 1;
    };
  }, [isHydrated, isTeacher, loadAcademicSessions]);

  /* =======================================================
     LOAD TEACHER'S ASSIGNED CLASSES AND SUBJECTS
  ======================================================= */

  const loadTeacherAssignments = useCallback(async () => {
    if (!academicSessionId || !schoolSubdomain.trim()) {
      setClasses([]);
      setSubjects([]);
      setClassId("");
      setSubjectId("");
      return;
    }

    const currentRequestId = ++assignmentRequestId.current;

    setLoadingAssignments(true);
    setOptionsError("");

    try {
      const response = await getAllMyTeachingAssignments(
        academicSessionId,
        schoolSubdomain,
      );

      if (currentRequestId !== assignmentRequestId.current) return;

      const assignmentRecords = extractAssignmentClasses(response);

      const normalizedClasses = assignmentRecords
        .map(normalizeAssignmentClass)
        .filter(
          (item): item is AssignedClass => Boolean(item),
        );

      const uniqueClasses = Array.from(
        new Map(
          normalizedClasses.map((item) => [item._id, item]),
        ).values(),
      );

      const assignedSubjects = extractAssignmentSubjects(
        assignmentRecords,
      );

      setClasses(uniqueClasses);
      setSubjects(assignedSubjects);

      setClassId((current) =>
        uniqueClasses.some((item) => item._id === current)
          ? current
          : "",
      );

      const assignedSubjectIds = new Set(
        assignedSubjects.map((subject) => subject._id),
      );

      setSubjectId((current) =>
        assignedSubjectIds.has(current) ? current : "",
      );

      if (uniqueClasses.length === 0) {
        setOptionsError(
          "No class assignments were found for you in this academic session.",
        );
      }
    } catch (err) {
      console.error("Teacher assignments loading error:", err);

      if (currentRequestId === assignmentRequestId.current) {
        setClasses([]);
        setSubjects([]);
        setClassId("");
        setSubjectId("");

        setOptionsError(
          err instanceof Error
            ? err.message
            : "Unable to load your teaching assignments.",
        );
      }
    } finally {
      if (currentRequestId === assignmentRequestId.current) {
        setLoadingAssignments(false);
      }
    }
  }, [academicSessionId, schoolSubdomain]);

  useEffect(() => {
    if (!isHydrated || !isTeacher) return;

    void loadTeacherAssignments();

    return () => {
      assignmentRequestId.current += 1;
    };
  }, [isHydrated, isTeacher, loadTeacherAssignments]);

  /* =======================================================
     SELECTED CLASS AND SUBJECTS
  ======================================================= */

  const selectedClass = useMemo(
    () => classes.find((item) => item._id === classId),
    [classes, classId],
  );

  const availableSubjects = useMemo(() => {
    if (!selectedClass) return [];

    return subjects.filter((subject) =>
      selectedClass.subjects.includes(subject._id),
    );
  }, [selectedClass, subjects]);

  useEffect(() => {
    if (
      subjectId &&
      !availableSubjects.some(
        (subject) => subject._id === subjectId,
      )
    ) {
      setSubjectId("");
    }
  }, [availableSubjects, subjectId]);

  /* =======================================================
     QUESTION TYPE CHANGE
  ======================================================= */

  const changeQuestionType = (nextType: QuestionType) => {
    setQuestionType(nextType);
    setCorrectOptionKeys([]);
    setAcceptedAnswers("");
    setModelAnswer("");
    setMarkingGuide("");

    if (nextType === "TRUE_FALSE") {
      setOptions([
        { key: "TRUE", text: "True" },
        { key: "FALSE", text: "False" },
      ]);
    } else {
      setOptions(INITIAL_OPTIONS.map((option) => ({ ...option })));
    }
  };

  /* =======================================================
     OPTION MANAGEMENT
  ======================================================= */

  const updateOption = (key: string, text: string) => {
    setOptions((current) =>
      current.map((option) =>
        option.key === key ? { ...option, text } : option,
      ),
    );
  };

  const addOption = () => {
    if (options.length >= 8) return;

    const nextKey = String.fromCharCode(65 + options.length);

    setOptions((current) => [
      ...current,
      { key: nextKey, text: "" },
    ]);
  };

  const removeOption = (key: string) => {
    setOptions((current) =>
      current.filter((option) => option.key !== key),
    );

    setCorrectOptionKeys((current) =>
      current.filter((item) => item !== key),
    );
  };

  const toggleCorrectOption = (key: string) => {
    if (questionType === "SINGLE_CHOICE") {
      setCorrectOptionKeys([key]);
      return;
    }

    setCorrectOptionKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  /* =======================================================
     BUILD QUESTION PAYLOAD
  ======================================================= */

  const buildQuestionPayload = (): CreateQuestionItem => {
    const questionOptions = getQuestionOptions(options);

    let answerKey: CreateQuestionItem["answerKey"] = {};

    if (questionType === "SINGLE_CHOICE") {
      const correctKey = correctOptionKeys[0];

      const correctOption = questionOptions.find(
        (option) => option.key === correctKey,
      );

      answerKey = {
        correctOptionKey: correctKey,
        acceptedAnswers: correctOption
          ? [correctOption.text]
          : [],
      };
    }

    if (questionType === "MULTIPLE_CHOICE") {
      const correctOptions = questionOptions.filter((option) =>
        correctOptionKeys.includes(option.key),
      );

      answerKey = {
        correctOptionKeys,
        acceptedAnswers: correctOptions.map(
          (option) => option.text,
        ),
      };
    }

    if (questionType === "TRUE_FALSE") {
      answerKey = {
        correctBoolean,
        acceptedAnswers: [
          correctBoolean ? "True" : "False",
        ],
      };
    }

    if (questionType === "SHORT_ANSWER") {
      answerKey = {
        acceptedAnswers: parseLines(acceptedAnswers),
      };
    }

    if (questionType === "ESSAY") {
      answerKey = {
        modelAnswer: modelAnswer.trim(),
        markingGuide: markingGuide.trim(),
      };
    }

    const payload: CreateQuestionItem = {
      questionType,
      questionText: questionText.trim(),
      answerKey,
      difficulty,
    };

    if (
      questionType === "SINGLE_CHOICE" ||
      questionType === "MULTIPLE_CHOICE" ||
      questionType === "TRUE_FALSE"
    ) {
      payload.options = questionOptions;
    }

    if (topic.trim()) {
      payload.topic = topic.trim();
    }

    if (explanation.trim()) {
      payload.explanation = explanation.trim();
    }

    const images = parseLines(questionImages);

    if (images.length > 0) {
      payload.questionImages = images;
    }

    return payload;
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = (): string => {
    if (!academicSessionId.trim()) {
      return "Please select an academic session.";
    }

    if (!classId) {
      return "Please select a class.";
    }

    if (!subjectId) {
      return "Please select a subject.";
    }

    if (!questionText.trim()) {
      return "Please enter the question.";
    }

    if (questionType === "SINGLE_CHOICE") {
      const filledOptions = getQuestionOptions(options);

      if (filledOptions.length < 2) {
        return "A single-choice question requires at least two options.";
      }

      if (correctOptionKeys.length !== 1) {
        return "Select exactly one correct option.";
      }

      if (
        !filledOptions.some(
          (option) => option.key === correctOptionKeys[0],
        )
      ) {
        return "The selected correct option must have text.";
      }
    }

    if (questionType === "MULTIPLE_CHOICE") {
      const filledOptions = getQuestionOptions(options);

      if (filledOptions.length < 2) {
        return "A multiple-choice question requires at least two options.";
      }

      if (correctOptionKeys.length === 0) {
        return "Select at least one correct option.";
      }

      if (
        correctOptionKeys.some(
          (key) =>
            !filledOptions.some((option) => option.key === key),
        )
      ) {
        return "Every selected correct option must have text.";
      }
    }

    if (questionType === "SHORT_ANSWER") {
      if (parseLines(acceptedAnswers).length === 0) {
        return "Enter at least one accepted answer.";
      }
    }

    if (
      questionType === "ESSAY" &&
      !modelAnswer.trim() &&
      !markingGuide.trim()
    ) {
      return "Enter a model answer or marking guide for the essay.";
    }

    return "";
  };

  /* =======================================================
     SUBMIT QUESTION
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!isTeacher) {
      setError("Only teachers can create questions.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!schoolSubdomain.trim()) {
      setError("A valid school subdomain is required.");
      return;
    }

    const question = buildQuestionPayload();

    setSubmitting(true);

    try {
      await createQuestions(
        academicSessionId.trim(),
        {
          subjectId,
          classIds: [classId],
          questions: [question],
        },
        schoolSubdomain,
      );

      setSuccess("Question created successfully.");

      setQuestionText("");
      setTopic("");
      setExplanation("");
      setQuestionImages("");
      setCorrectOptionKeys([]);
      setAcceptedAnswers("");
      setModelAnswer("");
      setMarkingGuide("");
      setDifficulty("MEDIUM");

      if (questionType === "TRUE_FALSE") {
        setOptions([
          { key: "TRUE", text: "True" },
          { key: "FALSE", text: "False" },
        ]);
      } else {
        setOptions(
          INITIAL_OPTIONS.map((option) => ({ ...option })),
        );
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err: unknown) {
      console.error("Create question error:", err);

      const response = getRecord(getRecord(err).response);
      const data = getRecord(response.data);
      const message = data.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : typeof message === "string"
            ? message
            : err instanceof Error
              ? err.message
              : "Unable to create question. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goBack = () => {
    const query = new URLSearchParams();

    if (academicSessionId) {
      query.set("academicSessionId", academicSessionId);
    }

    if (classId) {
      query.set("classId", classId);
    }

    if (subjectId) {
      query.set("subjectId", subjectId);
    }

    const suffix = query.toString();

    router.push(
      `/schools/${slug}/question-bank${suffix ? `?${suffix}` : ""}`,
    );
  };

  /* =======================================================
     ACCESS CHECKS
  ======================================================= */

  if (!isHydrated) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isTeacher) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-500" />

          <h1 className="mt-3 text-xl font-bold text-gray-900">
            Access Restricted
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Only teachers can create questions in the school question bank.
          </p>

          <button
            type="button"
            onClick={goBack}
            className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to Question Bank
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            type="button"
            onClick={goBack}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Question Bank
          </button>

          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />

            <h1 className="text-2xl font-bold text-gray-900">
              Create Question
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Add a question to your school's question bank.
          </p>

          <p className="mt-1 text-xs font-medium text-indigo-600">
            Teacher Question Bank
          </p>
        </div>
      </div>

      {/* FEEDBACK */}

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {sessionsError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {sessionsError}
        </div>
      )}

      {optionsError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {optionsError}
        </div>
      )}

      {/* FORM */}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ACADEMIC DETAILS */}

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-gray-900">
              Academic Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select an academic session, then choose one of your assigned classes and subjects.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* ACADEMIC SESSION */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Academic Session *
              </label>

              <select
                value={academicSessionId}
                onChange={(event) => {
                  setAcademicSessionId(event.target.value);
                  setClassId("");
                  setSubjectId("");
                  setClasses([]);
                  setSubjects([]);
                  setOptionsError("");
                }}
                disabled={loadingSessions || academicSessions.length === 0}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100"
              >
                <option value="">
                  {loadingSessions
                    ? "Loading academic sessions..."
                    : "Select academic session"}
                </option>

                {academicSessions.map((session) => (
                  <option key={session._id} value={session._id}>
                    {session.label}
                  </option>
                ))}
              </select>

              {loadingSessions && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Fetching academic sessions...
                </p>
              )}
            </div>

            {/* CLASS */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Class *
              </label>

              <select
                value={classId}
                onChange={(event) => {
                  setClassId(event.target.value);
                  setSubjectId("");
                }}
                disabled={
                  !academicSessionId ||
                  loadingAssignments ||
                  classes.length === 0
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-100"
              >
                <option value="">
                  {!academicSessionId
                    ? "Select academic session first"
                    : loadingAssignments
                      ? "Loading assigned classes..."
                      : "Select class"}
                </option>

                {classes.map((schoolClass) => (
                  <option key={schoolClass._id} value={schoolClass._id}>
                    {schoolClass.className}
                    {schoolClass.classCode
                      ? ` (${schoolClass.classCode})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBJECT */}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Subject *
              </label>

              <select
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                disabled={
                  !classId ||
                  loadingAssignments ||
                  availableSubjects.length === 0
                }
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-100"
              >
                <option value="">
                  {!classId
                    ? "Select class first"
                    : availableSubjects.length === 0
                      ? "No assigned subjects"
                      : "Select subject"}
                </option>

                {availableSubjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName}
                    {subject.subjectCode
                      ? ` (${subject.subjectCode})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(loadingSessions || loadingAssignments) && (
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {loadingSessions
                ? "Loading academic sessions..."
                : "Loading your assigned classes and subjects..."}
            </div>
          )}

          {academicSessionId &&
            !loadingAssignments &&
            classes.length > 0 && (
              <p className="mt-3 text-xs text-green-700">
                {classes.length} assigned class
                {classes.length === 1 ? "" : "es"} found for this academic session.
              </p>
            )}

          {selectedClass && (
            <div className="mt-4 rounded-lg bg-indigo-50 p-3">
              <p className="text-xs font-semibold text-indigo-800">
                Selected class
              </p>

              <p className="mt-1 text-sm text-indigo-700">
                {selectedClass.className}
                {selectedClass.classCode
                  ? ` (${selectedClass.classCode})`
                  : ""}
              </p>
            </div>
          )}
        </section>

        {/* QUESTION DETAILS */}

        <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="font-semibold text-gray-900">
              Question Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the question and choose its type and difficulty.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Question Type *
              </label>

              <select
                value={questionType}
                onChange={(event) =>
                  changeQuestionType(event.target.value as QuestionType)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
              >
                {QUESTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Difficulty *
              </label>

              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value as QuestionDifficulty)
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
              >
                {DIFFICULTIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* QUESTION TEXT */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Question *
            </label>

            <textarea
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              rows={5}
              required
              placeholder="Enter your question here..."
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* IMAGES */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Question Image URLs
            </label>

            <textarea
              value={questionImages}
              onChange={(event) => setQuestionImages(event.target.value)}
              rows={2}
              placeholder="Enter one image URL per line"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />

            <p className="mt-1 text-xs text-gray-400">
              Optional. Enter one image URL per line.
            </p>
          </div>

          {/* TOPIC */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Topic
            </label>

            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. Algebra, Photosynthesis, Accounting"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
            />
          </div>
        </section>

        {/* SINGLE / MULTIPLE CHOICE */}

        {(questionType === "SINGLE_CHOICE" ||
          questionType === "MULTIPLE_CHOICE") && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Answer Options
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {questionType === "SINGLE_CHOICE"
                    ? "Select exactly one correct answer."
                    : "Select all correct answers."}
                </p>
              </div>

              <button
                type="button"
                onClick={addOption}
                disabled={options.length >= 8}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            </div>

            <div className="space-y-3">
              {options.map((option) => {
                const isCorrect = correctOptionKeys.includes(option.key);

                return (
                  <div
                    key={option.key}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${
                      isCorrect
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleCorrectOption(option.key)}
                      title="Mark as correct answer"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                        isCorrect
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-white text-gray-600"
                      }`}
                    >
                      {option.key}
                    </button>

                    <input
                      value={option.text}
                      onChange={(event) =>
                        updateOption(option.key, event.target.value)
                      }
                      placeholder={`Option ${option.key}`}
                      className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />

                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(option.key)}
                        title="Remove option"
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Click an option's letter to mark it as correct.
              {questionType === "MULTIPLE_CHOICE"
                ? " You can select more than one."
                : " Only one option can be correct."}
            </p>
          </section>
        )}

        {/* TRUE / FALSE */}

        {questionType === "TRUE_FALSE" && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              Correct Answer
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select whether the statement is true or false.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCorrectBoolean(true)}
                className={`rounded-lg border p-4 text-center font-semibold ${
                  correctBoolean
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                True
              </button>

              <button
                type="button"
                onClick={() => setCorrectBoolean(false)}
                className={`rounded-lg border p-4 text-center font-semibold ${
                  !correctBoolean
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                False
              </button>
            </div>
          </section>
        )}

        {/* SHORT ANSWER */}

        {questionType === "SHORT_ANSWER" && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900">
              Accepted Answers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add all acceptable answers. Each line or comma-separated value becomes an accepted answer.
            </p>

            <textarea
              value={acceptedAnswers}
              onChange={(event) => setAcceptedAnswers(event.target.value)}
              rows={4}
              placeholder={"e.g.\nLagos\nLAGOS"}
              className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
            />
          </section>
        )}

        {/* ESSAY */}

        {questionType === "ESSAY" && (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="font-semibold text-gray-900">
                Essay Marking Guide
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Provide a model answer or instructions for marking the essay.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Model Answer
              </label>

              <textarea
                value={modelAnswer}
                onChange={(event) => setModelAnswer(event.target.value)}
                rows={5}
                placeholder="Enter the expected answer..."
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Marking Guide
              </label>

              <textarea
                value={markingGuide}
                onChange={(event) => setMarkingGuide(event.target.value)}
                rows={5}
                placeholder="Enter marking criteria..."
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </section>
        )}

        {/* EXPLANATION */}

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Explanation
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Optional explanation shown after a student answers.
          </p>

          <textarea
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            rows={4}
            placeholder="Explain why the answer is correct..."
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-indigo-500"
          />
        </section>

        {/* SUBMIT */}

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={goBack}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              submitting ||
              loadingSessions ||
              loadingAssignments ||
              !academicSessionId ||
              !classId ||
              !subjectId
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Question...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Question
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
