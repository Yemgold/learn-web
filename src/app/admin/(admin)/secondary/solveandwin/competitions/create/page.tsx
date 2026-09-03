

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Trophy,
  Users,
   Clock3,
  Coins,
  FileText,
  Save,
  Loader2,
  Info,
  BookOpen,
  Check,
  ChevronDown,
  X,
  ChevronRight,
  HelpCircle,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  getSubjectsByPlan,
  type Subject,
} from "@/lib/api/subjects";

import {
  createContest,
  type CreateContestPayload,
} from "@/lib/api/solveAndWin";

/* ============================================================
   TYPES
============================================================ */

type CompetitionForm = {
  title: string;
  description: string;

  timePerQuestion: string;

  startDate: string;
  windowPeriod: "1" | "3" | "7";

  questionCount: string;
  difficultyRange: string;

  prizeAmount: string;
  maxParticipants: string;
  entryPoints: string;
};

/* ============================================================
   PREDEFINED OPTIONS
============================================================ */

const TITLE_OPTIONS = [
  {
    value: "JAMB Solve & Win Championship",
    label: "JAMB Solve & Win Championship",
  },
  {
    value: "JAMB Weekly Solve & Win",
    label: "JAMB Weekly Solve & Win",
  },
  {
    value: "JAMB Weekend Challenge",
    label: "JAMB Weekend Challenge",
  },
  {
    value: "JAMB Ultimate Challenge",
    label: "JAMB Ultimate Challenge",
  },
  {
    value: "JAMB National Academic Challenge",
    label: "JAMB National Academic Challenge",
  },
];

const DESCRIPTION_OPTIONS = [
  {
    value:
      "Test your JAMB knowledge, compete with other students and win exciting cash prizes.",
    label: "JAMB knowledge challenge",
  },
  {
    value:
      "Answer carefully selected JAMB questions from the question bank and compete for the highest score.",
    label: "Question bank competition",
  },
  {
    value:
      "Challenge yourself across selected JAMB subjects, earn points and compete for the available prize.",
    label: "Multi-subject challenge",
  },
  {
    value:
      "Compete against students across Nigeria by answering timed JAMB questions and ranking on the leaderboard.",
    label: "National leaderboard challenge",
  },
];

const QUESTION_COUNT_OPTIONS = [
  { value: "10", label: "10 Questions" },
  { value: "20", label: "20 Questions" },
  { value: "30", label: "30 Questions" },
  { value: "40", label: "40 Questions" },
  { value: "50", label: "50 Questions" },
  { value: "60", label: "60 Questions" },
  { value: "100", label: "100 Questions" },
];

const DIFFICULTY_OPTIONS = [
  {
    value: "EASY_MEDIUM",
    label: "Easy – Medium",
  },
  {
    value: "MEDIUM",
    label: "Medium Only",
  },
  {
    value: "MEDIUM_HARD",
    label: "Medium – Hard",
  },
  {
    value: "EASY_HARD",
    label: "Easy – Hard",
  },
  {
    value: "HARD",
    label: "Hard Only",
  },
];

const WINDOW_OPTIONS = [
  {
    value: "1",
    label: "1 Day",
  },
  {
    value: "3",
    label: "3 Days",
  },
  {
    value: "7",
    label: "7 Days",
  },
];

const PRIZE_OPTIONS = [
  {
    value: "10000",
    label: "₦10,000",
  },
  {
    value: "25000",
    label: "₦25,000",
  },
  {
    value: "50000",
    label: "₦50,000",
  },
  {
    value: "100000",
    label: "₦100,000",
  },
  {
    value: "250000",
    label: "₦250,000",
  },
  {
    value: "500000",
    label: "₦500,000",
  },
  {
    value: "1000000",
    label: "₦1,000,000",
  },
  {
    value: "5000000",
    label: "₦5,000,000",
  },
];

const PARTICIPANT_OPTIONS = [
  {
    value: "50",
    label: "50 Participants",
  },
  {
    value: "100",
    label: "100 Participants",
  },
  {
    value: "250",
    label: "250 Participants",
  },
  {
    value: "500",
    label: "500 Participants",
  },
  {
    value: "1000",
    label: "1,000 Participants",
  },
  {
    value: "5000",
    label: "5,000 Participants",
  },
  {
    value: "10000",
    label: "10,000 Participants",
  },
];

const ENTRY_POINT_OPTIONS = [
  {
    value: "100",
    label: "100 CBT Tokens",
  },
  {
    value: "250",
    label: "250 CBT Tokens",
  },
  {
    value: "500",
    label: "500 CBT Tokens",
  },
  {
    value: "1000",
    label: "1,000 CBT Tokens",
  },
  {
    value: "2500",
    label: "2,500 CBT Tokens",
  },
  {
    value: "5000",
    label: "5,000 CBT Tokens",
  },
];

/* ============================================================
   INITIAL FORM
============================================================ */

const initialForm: CompetitionForm = {
  title: "",
  description: "",

   timePerQuestion: "",

  startDate: "",
  windowPeriod: "1",

  questionCount: "20",
  difficultyRange: "EASY_HARD",

  prizeAmount: "",
  maxParticipants: "1000",
  entryPoints: "500",
};

/* ============================================================
   HELPERS
============================================================ */

function calculateEndDate(
  startDate: string,
  windowPeriod: string,
) {
  if (!startDate) return "";

  const date = new Date(`${startDate}T00:00:00`);

  const days = Number(windowPeriod);

  if (!Number.isFinite(days)) {
    return "";
  }

  date.setDate(date.getDate() + days - 1);

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString: string) {
  if (!dateString) return "";

  const date = new Date(
    `${dateString}T00:00:00`,
  );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ============================================================
   SELECT COMPONENT
============================================================ */

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  description,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  options: {
    value: string;
    label: string;
  }[];
  disabled?: boolean;
  required?: boolean;
  description?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          disabled={disabled}
          required={required}
          className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">
            Select {label.toLowerCase()}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {description && (
        <p className="mt-2 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function CreateCompetitionPage() {
  const [form, setForm] =
    useState<CompetitionForm>(initialForm);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* ==========================================================
     SUBJECTS
  ========================================================== */

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [selectedSubjectIds, setSelectedSubjectIds] =
    useState<string[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] =
    useState("");

  const [isSubjectsLoading, setIsSubjectsLoading] =
    useState(true);

  const [subjectsError, setSubjectsError] =
    useState("");

  /* ==========================================================
     UPDATE FIELD
  ========================================================== */

  const updateField = (
    field: keyof CompetitionForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccessMessage("");
  };

  /* ==========================================================
     LOAD SUBJECTS
  ========================================================== */

  useEffect(() => {
    let mounted = true;

    const loadSubjects = async () => {
      try {
        setIsSubjectsLoading(true);
        setSubjectsError("");

        const response =
          await getSubjectsByPlan(
            "SECONDARY",
            1,
            100,
          );

        if (!mounted) return;

        setSubjects(
          response.data.subjectObj ?? [],
        );
      } catch (err) {
        if (!mounted) return;

        console.error(
          "Failed to load secondary subjects:",
          err,
        );

        setSubjectsError(
          err instanceof Error
            ? err.message
            : "Failed to load secondary subjects.",
        );
      } finally {
        if (mounted) {
          setIsSubjectsLoading(false);
        }
      }
    };

    loadSubjects();

    return () => {
      mounted = false;
    };
  }, []);

  /* ==========================================================
     AVAILABLE SUBJECTS
  ========================================================== */

  const availableSubjects = useMemo(() => {
    return subjects.filter(
      (subject) =>
        !selectedSubjectIds.includes(
          subject._id,
        ),
    );
  }, [
    subjects,
    selectedSubjectIds,
  ]);

  /* ==========================================================
     SELECTED SUBJECT OBJECTS
  ========================================================== */

  const selectedSubjects =
    selectedSubjectIds
      .map((id) =>
        subjects.find(
          (subject) =>
            subject._id === id,
        ),
      )
      .filter(
        (
          subject,
        ): subject is Subject =>
          Boolean(subject),
      );

  /* ==========================================================
     END DATE
  ========================================================== */

  const endDate = useMemo(
    () =>
      calculateEndDate(
        form.startDate,
        form.windowPeriod,
      ),
    [
      form.startDate,
      form.windowPeriod,
    ],
  );

  /* ==========================================================
     ADD SUBJECT
  ========================================================== */

  const addSubject = () => {
    if (!selectedSubjectId) {
      return;
    }

    if (
      selectedSubjectIds.includes(
        selectedSubjectId,
      )
    ) {
      return;
    }

    setSelectedSubjectIds(
      (current) => [
        ...current,
        selectedSubjectId,
      ],
    );

    setSelectedSubjectId("");
    setError("");
  };

  /* ==========================================================
     REMOVE SUBJECT
  ========================================================== */

  const removeSubject = (
    subjectId: string,
  ) => {
    setSelectedSubjectIds(
      (current) =>
        current.filter(
          (id) => id !== subjectId,
        ),
    );
  };

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (isSubmitting) {
      return;
    }

    /* ========================================================
       BASIC VALIDATION
    ======================================================== */

    if (!form.title) {
      setError(
        "Please select a competition title.",
      );
      return;
    }

    if (!form.description) {
      setError(
        "Please select a competition description.",
      );
      return;
    }

    if (!form.startDate) {
      setError(
        "Please select a competition start date.",
      );
      return;
    }

    if (!form.windowPeriod) {
      setError(
        "Please select a competition window period.",
      );
      return;
    }

    if (
      selectedSubjectIds.length === 0
    ) {
      setError(
        "Please select at least one competition subject.",
      );
      return;
    }

    if (!form.questionCount) {
      setError(
        "Please select the number of questions.",
      );
      return;
    }

    if (!form.difficultyRange) {
      setError(
        "Please select the question difficulty range.",
      );
      return;
    }

    if (!form.prizeAmount) {
      setError(
        "Please select a competition prize.",
      );
      return;
    }

    if (!form.maxParticipants) {
      setError(
        "Please select the maximum number of participants.",
      );
      return;
    }

    if (!form.entryPoints) {
      setError(
        "Please select the entry CBT token amount.",
      );
      return;
    }

    /* ========================================================
       VALUES
    ======================================================== */

    const prizeAmount =
      Number(form.prizeAmount);

    const entryPoints =
      Number(form.entryPoints);

    if (
      !Number.isFinite(prizeAmount) ||
      prizeAmount <= 0
    ) {
      setError(
        "Invalid competition prize.",
      );
      return;
    }

    if (
      !Number.isFinite(entryPoints) ||
      entryPoints <= 0
    ) {
      setError(
        "Entry CBT Tokens must be greater than zero.",
      );
      return;
    }

    /* ========================================================
       PRIZE → KOBO
    ======================================================== */

    const amountToBeWonInKobo =
      Math.round(
        prizeAmount * 100,
      );

    /* ========================================================
       CREATE CONTEST PAYLOAD
       
       Status is intentionally ALWAYS UPCOMING.
       The backend currently accepts the fields below.
    ======================================================== */

    const payload: CreateContestPayload = {
      title: form.title,

      description: form.description,

      category: "National",

      status: "UPCOMING",

      amountToBeWonInKobo,

      entryPoints,

      startDate: form.startDate,

      endDate,

      subjectIds:
        selectedSubjectIds,
    };

    console.log(
      "CREATE COMPETITION PAYLOAD:",
      payload,
    );

    /* ========================================================
       QUESTION CONFIG
       
       This is the configuration selected by admin for the
       next question-bank step.
    ======================================================== */

    const questionConfiguration = {
      source: "QUESTION_BANK",
      questionCount:
        Number(form.questionCount),
      difficultyRange:
        form.difficultyRange,
      subjectIds:
        selectedSubjectIds,
    };

    console.log(
      "QUESTION BANK CONFIGURATION:",
      questionConfiguration,
    );

    /* ========================================================
       API
    ======================================================== */

    try {
      setIsSubmitting(true);

      const response =
        await createContest(payload);

      console.log(
        "CREATE CONTEST RESPONSE:",
        response,
      );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Failed to create competition.",
        );
      }

      setSuccessMessage(
        response.message ||
          "Competition created successfully.",
      );

      /*
       * The next step can use the returned competition ID
       * to open the Question Bank configuration page.
       */

      const competitionId =
        response.data?._id ??
        response.data?.id;

      if (competitionId) {
        console.log(
          "CREATED COMPETITION ID:",
          competitionId,
        );

        /*
         * When your next page is ready:
         *
         * router.push(
         *   `/admin/secondary/solveandwin/competitions/${competitionId}`
         * );
         */
      }
    } catch (err: unknown) {
      console.error(
        "Failed to create competition:",
        err,
      );

      let message =
        "Something went wrong while creating the competition.";

      if (err instanceof Error) {
        message = err.message;
      }

      const axiosError = err as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      };

      const backendMessage =
        axiosError.response?.data?.message ??
        axiosError.response?.data?.error;

      if (backendMessage) {
        message = backendMessage;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-5xl px-4 py-10">

        {/* ======================================================
            BREADCRUMB
        ====================================================== */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            href="/admin"
            className="transition hover:text-slate-900"
          >
            Admin
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span>Secondary</span>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/admin/secondary/solveandwin/competitions"
            className="transition hover:text-slate-900"
          >
            Solve &amp; Win
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-slate-900">
            Create Competition
          </span>
        </div>

        {/* ======================================================
            BACK
        ====================================================== */}

        <Link
          href="/admin/secondary/solveandwin/competitions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Competitions
        </Link>

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
            <Trophy className="h-4 w-4" />
            Solve &amp; Win
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Create Competition
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-600">
            Set up the competition, choose its
            subjects and question configuration,
            then define the prize, entry cost and
            competition window.
          </p>
        </div>

        {/* ======================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">

            {/* ==================================================
                BASIC INFORMATION
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select the predefined competition
                    information.
                  </p>
                </div>
              </div>

              <div className="space-y-6">

                {/* TITLE */}

                <SelectField
                  id="title"
                  label="Competition Title"
                  value={form.title}
                  onChange={(value) =>
                    updateField(
                      "title",
                      value,
                    )
                  }
                  options={TITLE_OPTIONS}
                  disabled={isSubmitting}
                  required
                />

                {/* DESCRIPTION */}

                <SelectField
                  id="description"
                  label="Description"
                  value={form.description}
                  onChange={(value) =>
                    updateField(
                      "description",
                      value,
                    )
                  }
                  options={DESCRIPTION_OPTIONS}
                  disabled={isSubmitting}
                  required
                  description={
                    form.description
                      ? form.description
                      : "Select a predefined competition description."
                  }
                />

                {/* STATUS */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Initial Status
                  </label>

                  <div className="flex h-11 items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />

                      <span className="text-sm font-bold text-blue-800">
                        Upcoming
                      </span>
                    </div>

                    <span className="text-xs font-medium text-blue-600">
                      Fixed on creation
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Every newly created competition
                    starts as Upcoming.
                  </p>
                </div>
              </div>
            </Card>

            {/* ==================================================
                SUBJECTS
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Competition Subjects
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select the subjects from which
                    competition questions will be
                    sourced.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Select Subject
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <select
                      id="subject"
                      value={selectedSubjectId}
                      onChange={(event) =>
                        setSelectedSubjectId(
                          event.target.value,
                        )
                      }
                      disabled={
                        isSubjectsLoading ||
                        isSubmitting ||
                        availableSubjects.length ===
                          0
                      }
                      className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">
                        {isSubjectsLoading
                          ? "Loading subjects..."
                          : availableSubjects.length ===
                              0
                            ? subjects.length ===
                              0
                              ? "No subjects available"
                              : "All subjects selected"
                            : "Select a subject"}
                      </option>

                      {availableSubjects.map(
                        (subject) => (
                          <option
                            key={subject._id}
                            value={subject._id}
                          >
                            {subject.name}
                          </option>
                        ),
                      )}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  <Button
                    type="button"
                    onClick={addSubject}
                    disabled={
                      !selectedSubjectId ||
                      isSubmitting ||
                      isSubjectsLoading
                    }
                    className="h-11 sm:w-auto"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Add Subject
                  </Button>
                </div>

                {subjectsError && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {subjectsError}
                  </div>
                )}
              </div>

              {/* SELECTED */}

              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Selected Subjects
                  </h3>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {selectedSubjects.length} selected
                  </span>
                </div>

                {selectedSubjects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 px-5 py-8 text-center">
                    <BookOpen className="mx-auto mb-2 h-7 w-7 text-slate-400" />

                    <p className="text-sm font-medium text-slate-500">
                      No subjects selected yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedSubjects.map(
                      (subject, index) => (
                        <div
                          key={subject._id}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                              {index + 1}
                            </span>

                            <span className="truncate text-sm font-semibold text-slate-900">
                              {subject.name}
                            </span>

                            <Check className="h-4 w-4 shrink-0 text-green-600" />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeSubject(
                                subject._id,
                              )
                            }
                            disabled={
                              isSubmitting
                            }
                            className="ml-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-red-600"
                            aria-label={`Remove ${subject.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </Card>



{/* ==================================================
    QUESTION BANK
================================================== */}

<Card className="p-6 md:p-8">
  <div className="mb-7 flex items-start gap-4">
    <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
      <HelpCircle className="h-5 w-5" />
    </div>

    <div>
      <h2 className="text-xl font-bold text-slate-900">
        Competition Questions
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Questions will be automatically selected from the Question
        Bank using a 20/30/50 difficulty distribution.
      </p>
    </div>
  </div>

  {/* ==================================================
      QUESTION SOURCE
  ================================================== */}

  <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
    <div className="flex items-start gap-3">
      <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

      <div>
        <p className="text-sm font-bold text-orange-900">
          Question Source
        </p>

        <p className="mt-1 text-sm text-orange-800">
          Questions will be fetched automatically from the
          existing Question Bank.
        </p>
      </div>
    </div>
  </div>

  {/* ==================================================
      QUESTION COUNT
  ================================================== */}

  <SelectField
    id="questionCount"
    label="Number of Questions"
    value={form.questionCount}
    onChange={(value) =>
      updateField("questionCount", value)
    }
    options={QUESTION_COUNT_OPTIONS}
    disabled={isSubmitting}
    required
    description="Select the total number of questions for the competition."
  />

  {/* ==================================================
      AUTOMATIC DIFFICULTY DISTRIBUTION
  ================================================== */}

  {form.questionCount && (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Difficulty Distribution
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            The distribution is automatically calculated from
            the selected question count.
          </p>
        </div>

        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
          20 / 30 / 50
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">

        {/* ==================================================
            EASY — 20%
        ================================================== */}

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-green-900">
              Easy
            </span>

            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
              20%
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-green-900">
            {Math.round(
              Number(form.questionCount) * 0.2,
            )}
          </p>

          <p className="mt-1 text-xs font-medium text-green-700">
            questions
          </p>
        </div>

        {/* ==================================================
            MEDIUM — 30%
        ================================================== */}

        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-yellow-900">
              Medium
            </span>

            <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-bold text-yellow-700">
              30%
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-yellow-900">
            {Math.round(
              Number(form.questionCount) * 0.3,
            )}
          </p>

          <p className="mt-1 text-xs font-medium text-yellow-700">
            questions
          </p>
        </div>

        {/* ==================================================
            HARD — 50%
        ================================================== */}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-red-900">
              Hard
            </span>

            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
              50%
            </span>
          </div>

          <p className="mt-4 text-3xl font-black text-red-900">
            {Math.round(
              Number(form.questionCount) * 0.5,
            )}
          </p>

          <p className="mt-1 text-xs font-medium text-red-700">
            questions
          </p>
        </div>
      </div>



  {/* ==================================================
      TIME PER QUESTION
  ================================================== */}

  <div className="mt-6">
    <SelectField
      id="timePerQuestion"
      label="Time Per Question"
      value={form.timePerQuestion}
      onChange={(value) =>
        updateField("timePerQuestion", value)
      }
      options={[
        { value: "30", label: "30 seconds" },
        { value: "45", label: "45 seconds" },
        { value: "60", label: "1 minute" },
        { value: "90", label: "1 minute 30 seconds" },
        { value: "120", label: "2 minutes" },
        { value: "180", label: "3 minutes" },
      ]}
      disabled={isSubmitting}
      required
      description="Each question will have the selected amount of time before the competition moves to the next question."
    />
  </div>



  {/* ==================================================
      TOTAL DURATION
  ================================================== */}

  {form.questionCount && form.timePerQuestion && (
    <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
      <div className="flex items-start gap-3">
        <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-900">
                Competition Duration
              </p>

              <p className="mt-1 text-xs text-blue-700">
                Automatically calculated from the number of
                questions and time allowed per question.
              </p>
            </div>

            <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">
              <p className="text-2xl font-black text-blue-900">
                {(() => {
                  const totalSeconds =
                    Number(form.questionCount) *
                    Number(form.timePerQuestion);

                  const totalMinutes =
                    totalSeconds / 60;

                  if (totalMinutes < 1) {
                    return `${totalSeconds} sec`;
                  }

                  if (
                    Number.isInteger(totalMinutes)
                  ) {
                    return `${totalMinutes} min`;
                  }

                  const minutes = Math.floor(
                    totalMinutes,
                  );

                  const seconds =
                    totalSeconds % 60;

                  return `${minutes}m ${seconds}s`;
                })()}
              </p>

              <p className="mt-1 text-xs font-semibold text-blue-600">
                Total Time
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-blue-800">
            <span className="rounded-full bg-blue-100 px-3 py-1.5">
              {form.questionCount} questions
            </span>

            <span>×</span>

            <span className="rounded-full bg-blue-100 px-3 py-1.5">
              {Number(form.timePerQuestion) < 60
                ? `${form.timePerQuestion} seconds`
                : `${Number(form.timePerQuestion) / 60} minute${
                    Number(form.timePerQuestion) / 60 === 1
                      ? ""
                      : "s"
                  }`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )}




      {/* ==================================================
          DISTRIBUTION SUMMARY
      ================================================== */}

      <div className="mt-5 flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <Target className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

        <div className="text-sm text-slate-600">
          <p className="font-semibold text-slate-900">
            Automatic Question Selection
          </p>

          <p className="mt-1">
            The system will fetch{" "}
            <span className="font-bold text-green-700">
              {Math.round(
                Number(form.questionCount) * 0.2,
              )}{" "}
              Easy
            </span>
            ,{" "}
            <span className="font-bold text-yellow-700">
              {Math.round(
                Number(form.questionCount) * 0.3,
              )}{" "}
              Medium
            </span>
            , and{" "}
            <span className="font-bold text-red-700">
              {Math.round(
                Number(form.questionCount) * 0.5,
              )}{" "}
              Hard
            </span>{" "}
            questions from the Question Bank.
          </p>
        </div>
      </div>
    </div>
  )}
</Card>



            {/* ==================================================
                SCHEDULE
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Competition Schedule
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose when the competition
                    starts and how long it remains
                    open.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                {/* START DATE */}

                <div>
                  <label
                    htmlFor="startDate"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Start Date
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(event) =>
                      updateField(
                        "startDate",
                        event.target.value,
                      )
                    }
                    required
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {form.startDate && (
                    <p className="mt-2 text-xs text-slate-500">
                      Starts{" "}
                      <span className="font-semibold text-slate-700">
                        {formatDisplayDate(
                          form.startDate,
                        )}
                      </span>
                    </p>
                  )}
                </div>

                {/* WINDOW */}

                <SelectField
                  id="windowPeriod"
                  label="Window Period"
                  value={form.windowPeriod}
                  onChange={(value) =>
                    updateField(
                      "windowPeriod",
                      value,
                    )
                  }
                  options={
                    WINDOW_OPTIONS
                  }
                  disabled={isSubmitting}
                  required
                  description="How long students can participate."
                />
              </div>

              {/* END DATE PREVIEW */}

              {endDate && (
                <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-5">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 text-purple-600" />

                    <div>
                      <p className="text-sm font-bold text-purple-900">
                        Competition Window
                      </p>

                      <p className="mt-1 text-sm text-purple-800">
                        {formatDisplayDate(
                          form.startDate,
                        )}{" "}
                        →{" "}
                        {formatDisplayDate(
                          endDate,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-purple-700">
                        {form.windowPeriod}{" "}
                        {form.windowPeriod ===
                        "1"
                          ? "day"
                          : "days"}{" "}
                        participation window.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />

                <p>
                  The end date is automatically
                  calculated from the selected
                  start date and window period.
                </p>
              </div>
            </Card>

            {/* ==================================================
                PRIZE / PARTICIPATION / ENTRY
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                  <Coins className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Prize, Participation &amp; Entry
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select the competition prize,
                    participant limit and entry cost.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">

                {/* PRIZE */}

                <SelectField
                  id="prizeAmount"
                  label="Prize Amount"
                  value={form.prizeAmount}
                  onChange={(value) =>
                    updateField(
                      "prizeAmount",
                      value,
                    )
                  }
                  options={
                    PRIZE_OPTIONS
                  }
                  disabled={isSubmitting}
                  required
                  description="Cash prize awarded to the winner."
                />

                {/* PARTICIPANTS */}

                <SelectField
                  id="maxParticipants"
                  label="Maximum Participants"
                  value={
                    form.maxParticipants
                  }
                  onChange={(value) =>
                    updateField(
                      "maxParticipants",
                      value,
                    )
                  }
                  options={
                    PARTICIPANT_OPTIONS
                  }
                  disabled={isSubmitting}
                  required
                  description="Maximum number of students allowed."
                />

                {/* ENTRY */}

                <SelectField
                  id="entryPoints"
                  label="Entry Solve & Win Points"
                  value={form.entryPoints}
                  onChange={(value) =>
                    updateField(
                      "entryPoints",
                      value,
                    )
                  }
                  options={
                    ENTRY_POINT_OPTIONS
                  }
                  disabled={isSubmitting}
                  required
                  description="CBT Tokens deducted when a student enters."
                />
              </div>

              {/* ENTRY TOKEN EXPLANATION */}

              <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                <div className="flex items-start gap-3">
                  <Coins className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />

                  <div>
                    <p className="text-sm font-bold text-yellow-900">
                      Solve &amp; Win Entry
                    </p>

                    <p className="mt-1 text-sm text-yellow-800">
                      Students use their earned
                      <span className="font-bold">
                        {" "}
                        CBT Tokens
                      </span>{" "}
                      to enter the competition.
                      The selected amount is deducted
                      when they join.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <Card className="overflow-hidden border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Competition Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review the selected configuration
                  before creating the competition.
                </p>
              </div>

              <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 font-bold text-blue-700">
                    Upcoming
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Subjects
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {selectedSubjects.length}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Questions
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {form.questionCount
                      ? `${form.questionCount} Questions`
                      : "Not selected"}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Difficulty
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {DIFFICULTY_OPTIONS.find(
                      (item) =>
                        item.value ===
                        form.difficultyRange,
                    )?.label ??
                      "Not selected"}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Window
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {form.windowPeriod}{" "}
                    {form.windowPeriod ===
                    "1"
                      ? "Day"
                      : "Days"}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Entry
                  </p>

                  <p className="mt-1 font-bold text-yellow-700">
                    {form.entryPoints
                      ? `${Number(
                          form.entryPoints,
                        ).toLocaleString()} CBT Tokens`
                      : "Not selected"}
                  </p>
                </div>
              </div>
            </Card>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* ==================================================
                SUCCESS
            ================================================== */}

            {successMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                {successMessage}
              </div>
            )}

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/admin/secondary/solveandwin/competitions"
                className={
                  isSubmitting
                    ? "pointer-events-none"
                    : ""
                }
              >
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  isSubjectsLoading ||
                  selectedSubjectIds.length ===
                    0
                }
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Competition
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* ======================================================
            FLOW
        ====================================================== */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-bold text-slate-900">
            Competition Creation Flow
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white">
              1. Create Competition
            </span>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-700">
              2. Configure Question Bank
            </span>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-700">
              3. Review &amp; Publish
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

