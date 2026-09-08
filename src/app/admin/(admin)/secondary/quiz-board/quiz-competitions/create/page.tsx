






"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Coins,
  FileText,
  HelpCircle,
  Info,
  Loader2,
  Plus,
  Save,
  Target,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  getSubjectsByPlan,
  type Subject,
} from "@/lib/api/subjects";

import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   TYPES
============================================================ */

type Difficulty = "EASY" | "MEDIUM" | "HARD" | "MIXED";

type QuizBoardForm = {
  title: string;
  description: string;
  difficulty: Difficulty;
  entryPoints: string;
  winnerReward: string;
  startDate: string;
  startTime: string;
  timePerQuestion: string;
};

type RoundConfig = {
  round: 1 | 2 | 3 | 4 | 5;
  name: string;
  from: number;
  to: number;
  questions: number;
};

/* ============================================================
   QUIZ BOARD RULES
============================================================ */

const MAX_PLAYERS = 20;

const ROUND_CONFIGS: RoundConfig[] = [
  {
    round: 1,
    name: "Round 1",
    from: 20,
    to: 15,
    questions: 10,
  },
  {
    round: 2,
    name: "Round 2",
    from: 15,
    to: 10,
    questions: 10,
  },
  {
    round: 3,
    name: "Round 3",
    from: 10,
    to: 5,
    questions: 10,
  },
  {
    round: 4,
    name: "Round 4",
    from: 5,
    to: 2,
    questions: 10,
  },
  {
    round: 5,
    name: "Final",
    from: 2,
    to: 1,
    questions: 20,
  },
];

const TOTAL_QUESTIONS = ROUND_CONFIGS.reduce(
  (total, round) => total + round.questions,
  0,
);

/* ============================================================
   OPTIONS
============================================================ */

const TITLE_OPTIONS = [
  {
    value: "JAMB Biology Quiz Board",
    label: "JAMB Biology Quiz Board",
  },
  {
    value: "JAMB Chemistry Quiz Board",
    label: "JAMB Chemistry Quiz Board",
  },
  {
    value: "JAMB Physics Quiz Board",
    label: "JAMB Physics Quiz Board",
  },
  {
    value: "JAMB Mathematics Quiz Board",
    label: "JAMB Mathematics Quiz Board",
  },
  {
    value: "JAMB English Quiz Board",
    label: "JAMB English Quiz Board",
  },
  {
    value: "JAMB Science Quiz Board",
    label: "JAMB Science Quiz Board",
  },
  {
    value: "JAMB Ultimate Quiz Board",
    label: "JAMB Ultimate Quiz Board",
  },
];

const DESCRIPTION_OPTIONS = [
  {
    value:
      "Compete live against other students by answering JAMB questions as quickly and accurately as possible.",
    label: "Live speed competition",
  },
  {
    value:
      "Answer carefully selected JAMB questions, qualify through each elimination round and compete for the championship.",
    label: "Elimination championship",
  },
  {
    value:
      "A real-time academic competition where the fastest correct students advance through five competitive rounds.",
    label: "Five-round competition",
  },
  {
    value:
      "Challenge other students in a fast-paced quiz board and earn points by answering questions correctly and quickly.",
    label: "Fast-paced quiz",
  },
];

const DIFFICULTY_OPTIONS = [
  {
    value: "EASY",
    label: "Easy",
  },
  {
    value: "MEDIUM",
    label: "Medium",
  },
  {
    value: "HARD",
    label: "Hard",
  },
  {
    value: "MIXED",
    label: "Mixed Difficulty",
  },
];

const ENTRY_POINT_OPTIONS = [
  {
    value: "1",
    label: "1 CBT Point",
  },
  {
    value: "2",
    label: "2 CBT Points",
  },
  {
    value: "5",
    label: "5 CBT Points",
  },
  {
    value: "10",
    label: "10 CBT Points",
  },
  {
    value: "20",
    label: "20 CBT Points",
  },
  {
    value: "50",
    label: "50 CBT Points",
  },
];

const REWARD_POINT_OPTIONS = [
  {
    value: "10",
    label: "10 CBT Points",
  },
  {
    value: "25",
    label: "25 CBT Points",
  },
  {
    value: "50",
    label: "50 CBT Points",
  },
  {
    value: "100",
    label: "100 CBT Points",
  },
  {
    value: "250",
    label: "250 CBT Points",
  },
  {
    value: "500",
    label: "500 CBT Points",
  },
  {
    value: "1000",
    label: "1,000 CBT Points",
  },
  {
    value: "2500",
    label: "2,500 CBT Points",
  },
  {
    value: "5000",
    label: "5,000 CBT Points",
  },
];

const TIME_PER_QUESTION_OPTIONS = [
  {
    value: "10",
    label: "10 seconds",
  },
  {
    value: "15",
    label: "15 seconds",
  },
  {
    value: "20",
    label: "20 seconds",
  },
  {
    value: "30",
    label: "30 seconds",
  },
  {
    value: "45",
    label: "45 seconds",
  },
  {
    value: "60",
    label: "1 minute",
  },
];

/* ============================================================
   INITIAL FORM
============================================================ */

const initialForm: QuizBoardForm = {
  title: "",
  description: "",
  difficulty: "MIXED",
  entryPoints: "5",
  winnerReward: "100",
  startDate: "",
  startTime: "19:00",
  timePerQuestion: "20",
};

/* ============================================================
   HELPERS
============================================================ */

function formatDate(date: string) {
  if (!date) return "";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPoints(value: number) {
  return `${value.toLocaleString()} CBT ${
    value === 1 ? "Point" : "Points"
  }`;
}

function formatDuration(totalSeconds: number) {
  if (totalSeconds <= 0) return "0 seconds";

  if (totalSeconds < 60) {
    return `${totalSeconds} seconds`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (seconds === 0) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    }`;
  }

  return `${minutes}m ${seconds}s`;
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string | string[];
          error?: string;
        };
      };
    };

    const backendMessage =
      axiosError.response?.data?.message ??
      axiosError.response?.data?.error;

    if (Array.isArray(backendMessage)) {
      return backendMessage.join(", ");
    }

    if (backendMessage) {
      return backendMessage;
    }

    return error.message;
  }

  const axiosError = error as {
    response?: {
      data?: {
        message?: string | string[];
        error?: string;
      };
    };
  };

  const backendMessage =
    axiosError.response?.data?.message ??
    axiosError.response?.data?.error;

  if (Array.isArray(backendMessage)) {
    return backendMessage.join(", ");
  }

  if (backendMessage) {
    return backendMessage;
  }

  return "Something went wrong while creating the Quiz Board.";
}

/* ============================================================
   SELECT FIELD
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
  onChange: (value: string) => void;
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

export default function CreateQuizBoardPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<QuizBoardForm>(initialForm);

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

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* ==========================================================
     UPDATE FIELD
  ========================================================== */

  const updateField = (
    field: keyof QuizBoardForm,
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
          getApiErrorMessage(err),
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
     SUBJECTS
  ========================================================== */

  const availableSubjects = useMemo(
    () =>
      subjects.filter(
        (subject) =>
          !selectedSubjectIds.includes(
            subject._id,
          ),
      ),
    [subjects, selectedSubjectIds],
  );

  const selectedSubjects = useMemo(
    () =>
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
        ),
    [selectedSubjectIds, subjects],
  );

  /* ==========================================================
     TIME CALCULATIONS
  ========================================================== */

  const timePerQuestion =
    Number(form.timePerQuestion) || 0;

  const totalCompetitionSeconds =
    TOTAL_QUESTIONS * timePerQuestion;

  const totalCompetitionMinutes = Math.ceil(
    totalCompetitionSeconds / 60,
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

    setError("");
  };

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateForm = () => {
    if (!form.title) {
      return "Please select a Quiz Board title.";
    }

    if (!form.description) {
      return "Please select a Quiz Board description.";
    }

    if (
      selectedSubjectIds.length === 0
    ) {
      return "Please select at least one subject.";
    }

    if (!form.startDate) {
      return "Please select the Quiz Board start date.";
    }

    if (!form.startTime) {
      return "Please select the Quiz Board start time.";
    }

    const entryPoints =
      Number(form.entryPoints);

    const winnerReward =
      Number(form.winnerReward);

    const seconds =
      Number(form.timePerQuestion);

    if (
      !Number.isInteger(entryPoints) ||
      entryPoints <= 0
    ) {
      return "Entry CBT Points must be a whole number greater than zero.";
    }

    if (
      !Number.isInteger(winnerReward) ||
      winnerReward <= 0
    ) {
      return "Winner reward must be a whole number greater than zero.";
    }

    if (
      !Number.isInteger(seconds) ||
      seconds <= 0
    ) {
      return "Time per question must be greater than zero.";
    }

    return "";
  };

  /* ==========================================================
     CREATE QUIZ BOARD
  ========================================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setSuccessMessage("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const startsAt = new Date(
      `${form.startDate}T${form.startTime}:00`,
    );

    if (
      Number.isNaN(startsAt.getTime())
    ) {
      setError(
        "Please provide a valid start date and time.",
      );
      return;
    }

    const entryPoints =
      Number(form.entryPoints);

    const winnerReward =
      Number(form.winnerReward);

    const timePerQuestion =
      Number(form.timePerQuestion);

    /*
     * The backend should treat this configuration
     * as authoritative for the Quiz Board structure.
     *
     * 20 → 15 → 10 → 5 → 2 → 1
     *
     * Questions:
     * 10 + 10 + 10 + 10 + 20 = 60
     */

    const payload = {
      title: form.title,
      description: form.description,

      examType: "JAMB",

      status: "DRAFT",

      subjectIds: selectedSubjectIds,

      difficulty: form.difficulty,

      maxPlayers: MAX_PLAYERS,

      entryFee: entryPoints,
      entryFeeType: "CBT_POINTS",

      winnerReward,
      winnerRewardType: "CBT_POINTS",

      startsAt: startsAt.toISOString(),

      timePerQuestion,

      totalQuestions: TOTAL_QUESTIONS,

      rounds: ROUND_CONFIGS.map(
        (round) => ({
          roundNumber: round.round,
          name: round.name,
          playersFrom: round.from,
          playersTo: round.to,
          questionCount: round.questions,
        }),
      ),
    };

    console.log(
      "CREATE QUIZ BOARD PAYLOAD:",
      JSON.stringify(
        payload,
        null,
        2,
      ),
    );

    try {
      setIsSubmitting(true);

      const response =
        await axiosInstance.post(
          "/admin/quiz-board",
          payload,
        );

      console.log(
        "CREATE QUIZ BOARD RESPONSE:",
        response.data,
      );

      const createdBoard =
        response.data?.data ??
        response.data?.quizBoard ??
        response.data;

      const quizBoardId =
        createdBoard?._id ??
        createdBoard?.id;

      setSuccessMessage(
        "Quiz Board created successfully.",
      );

      if (quizBoardId) {
        setTimeout(() => {
          router.push(
            `/admin/secondary/quiz-board/quiz-competitions/${quizBoardId}`,
          );
        }, 700);
      }
    } catch (err) {
      console.error(
        "Failed to create Quiz Board:",
        err,
      );

      setError(
        getApiErrorMessage(err),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==========================================================
     TODAY
  ========================================================== */

  const today = new Date()
    .toISOString()
    .split("T")[0];

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-10">

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
            href="/admin/secondary/quiz-board"
            className="transition hover:text-slate-900"
          >
            Quiz Board
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/admin/secondary/quiz-board/quiz-competitions"
            className="transition hover:text-slate-900"
          >
            Quiz Boards
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-slate-900">
            Create
          </span>
        </div>

        {/* ======================================================
            BACK
        ====================================================== */}

        <Link
          href="/admin/secondary/quiz-board/quiz-competitions"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quiz Boards
        </Link>

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-700">
            <Trophy className="h-4 w-4" />
            Quiz Board
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Create Quiz Board
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Create a live, real-time Quiz Board where
            a maximum of 20 students compete through
            five elimination rounds until one champion
            remains.
          </p>
        </div>

        {/* ======================================================
            CORE RULES BANNER
        ====================================================== */}

        <Card className="mb-8 overflow-hidden border-blue-200 bg-white">
          <div className="border-b border-blue-100 bg-blue-50 px-6 py-5 md:px-8">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <h2 className="font-black text-blue-950">
                  Quiz Board Rules
                </h2>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  The competition is designed around
                  speed, accuracy and elimination.
                  The backend should control the official
                  answer order and qualification decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-5">
              <Users className="mb-3 h-5 w-5 text-blue-600" />

              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Maximum Players
              </p>

              <p className="mt-1 text-2xl font-black text-slate-900">
                20
              </p>
            </div>

            <div className="bg-white p-5">
              <HelpCircle className="mb-3 h-5 w-5 text-orange-600" />

              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Total Questions
              </p>

              <p className="mt-1 text-2xl font-black text-slate-900">
                60
              </p>
            </div>

            <div className="bg-white p-5">
              <Target className="mb-3 h-5 w-5 text-green-600" />

              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Elimination Rounds
              </p>

              <p className="mt-1 text-2xl font-black text-slate-900">
                5
              </p>
            </div>

            <div className="bg-white p-5">
              <Trophy className="mb-3 h-5 w-5 text-yellow-600" />

              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Finalists
              </p>

              <p className="mt-1 text-2xl font-black text-slate-900">
                2 → 1
              </p>
            </div>
          </div>
        </Card>

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
                  <h2 className="text-xl font-black text-slate-900">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Define the identity and academic
                    configuration of the Quiz Board.
                  </p>
                </div>
              </div>

              <div className="space-y-6">

                <SelectField
                  id="title"
                  label="Quiz Board Title"
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
                  options={
                    DESCRIPTION_OPTIONS
                  }
                  disabled={isSubmitting}
                  required
                  description={
                    form.description
                      ? form.description
                      : "Select a description that explains the live competition."
                  }
                />

                <SelectField
                  id="difficulty"
                  label="Question Difficulty"
                  value={form.difficulty}
                  onChange={(value) =>
                    updateField(
                      "difficulty",
                      value,
                    )
                  }
                  options={
                    DIFFICULTY_OPTIONS
                  }
                  disabled={isSubmitting}
                  required
                  description="The backend will use this difficulty when selecting questions."
                />

                {/* INITIAL STATUS */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Initial Status
                  </label>

                  <div className="flex min-h-11 items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />

                      <span className="text-sm font-bold text-slate-800">
                        Draft
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      Fixed on creation
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    New Quiz Boards are created as
                    Draft. You can review and publish
                    them from the management page.
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
                  <BookOpenIcon />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Quiz Board Subjects
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select the subjects from which the
                    60 competition questions will be
                    selected.
                  </p>
                </div>
              </div>

              {/* SUBJECT SELECT */}

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Add Subject
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
                            ? subjects.length === 0
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
                    className="h-11"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subject
                  </Button>
                </div>

                {subjectsError && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {subjectsError}
                  </div>
                )}
              </div>

              {/* SELECTED SUBJECTS */}

              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">
                    Selected Subjects
                  </h3>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {selectedSubjects.length} selected
                  </span>
                </div>

                {selectedSubjects.length ===
                0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center">
                    <BookOpenIcon />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No subjects selected yet.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Add at least one subject before
                      creating the Quiz Board.
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
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                              {index + 1}
                            </span>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">
                                {subject.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                Question source enabled
                              </p>
                            </div>

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
                            className="ml-3 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-red-600"
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

              {/* SUBJECT NOTE */}

              <div className="mt-7 flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                <div>
                  <p className="text-sm font-black text-green-900">
                    Automatic Question Selection
                  </p>

                  <p className="mt-1 text-sm leading-6 text-green-800">
                    Questions do not need to be manually
                    selected here. The backend should
                    select the required questions from
                    the Question Bank for each round,
                    subject and difficulty.
                  </p>
                </div>
              </div>
            </Card>

            {/* ==================================================
                ROUND STRUCTURE
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                  <Target className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Elimination Structure
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    This structure is fixed for every
                    Quiz Board.
                  </p>
                </div>
              </div>

              {/* FLOW */}

              <div className="mb-8 overflow-x-auto pb-2">
                <div className="flex min-w-max items-center gap-2">
                  {[
                    "20",
                    "15",
                    "10",
                    "5",
                    "2",
                    "1",
                  ].map(
                    (number, index) => (
                      <div
                        key={`${number}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`flex h-12 min-w-12 items-center justify-center rounded-xl px-3 text-lg font-black ${
                            index === 5
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-slate-900 text-white"
                          }`}
                        >
                          {number}
                        </div>

                        {index <
                          5 && (
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* ROUNDS */}

              <div className="space-y-3">
                {ROUND_CONFIGS.map(
                  (round) => (
                    <div
                      key={round.round}
                      className={`rounded-2xl border p-5 ${
                        round.round === 5
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                              round.round === 5
                                ? "bg-yellow-200 text-yellow-900"
                                : "bg-white text-slate-900 shadow-sm"
                            }`}
                          >
                            {round.round}
                          </div>

                          <div>
                            <p className="font-black text-slate-900">
                              {round.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {round.from} students compete
                              → {round.to} advance
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                            {round.questions} Questions
                          </span>

                          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                            {round.from} →{" "}
                            {round.to}
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* TOTAL */}

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <div>
                  <p className="text-sm font-black text-blue-900">
                    Total Questions
                  </p>

                  <p className="mt-1 text-xs text-blue-700">
                    10 + 10 + 10 + 10 + 20
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-black text-blue-900">
                    {TOTAL_QUESTIONS}
                  </p>

                  <p className="text-xs font-bold text-blue-600">
                    questions
                  </p>
                </div>
              </div>
            </Card>

            {/* ==================================================
                QUESTION SETTINGS
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-orange-100 p-3 text-orange-700">
                  <HelpCircle className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Question Settings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure how quickly students must
                    respond to each question.
                  </p>
                </div>
              </div>

              <SelectField
                id="timePerQuestion"
                label="Time Per Question"
                value={
                  form.timePerQuestion
                }
                onChange={(value) =>
                  updateField(
                    "timePerQuestion",
                    value,
                  )
                }
                options={
                  TIME_PER_QUESTION_OPTIONS
                }
                disabled={isSubmitting}
                required
                description="The server should use this value when controlling each question's response window."
              />

              {/* DURATION */}

              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <div className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <div className="flex-1">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-blue-900">
                          Maximum Question Time
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-700">
                          Based on all 60 questions.
                          Actual round timing should
                          remain server-authoritative.
                        </p>
                      </div>

                      <div className="rounded-xl bg-white px-5 py-3 text-center shadow-sm">
                        <p className="text-2xl font-black text-blue-900">
                          {formatDuration(
                            totalCompetitionSeconds,
                          )}
                        </p>

                        <p className="mt-1 text-xs font-bold text-blue-600">
                          Maximum quiz duration
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800">
                        {TOTAL_QUESTIONS} questions
                      </span>

                      <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800">
                        {timePerQuestion} sec/question
                      </span>

                      <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-800">
                        ~{totalCompetitionMinutes} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SERVER AUTHORITY */}

              <div className="mt-5 flex gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

                <div>
                  <p className="text-sm font-black text-orange-900">
                    Real-Time Competition Rule
                  </p>

                  <p className="mt-1 text-sm leading-6 text-orange-800">
                    The browser should not decide who
                    answered first. The backend should
                    record the server timestamp, determine
                    answer order, calculate points and
                    decide who qualifies for the next round.
                  </p>
                </div>
              </div>
            </Card>

            {/* ==================================================
                SCHEDULE
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Quiz Board Schedule
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Set when the live Quiz Board should
                    begin.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                {/* DATE */}

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
                    min={today}
                    value={form.startDate}
                    onChange={(event) =>
                      updateField(
                        "startDate",
                        event.target.value,
                      )
                    }
                    disabled={isSubmitting}
                    required
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  {form.startDate && (
                    <p className="mt-2 text-xs text-slate-500">
                      Starts{" "}
                      <span className="font-bold text-slate-700">
                        {formatDate(
                          form.startDate,
                        )}
                      </span>
                    </p>
                  )}
                </div>

                {/* TIME */}

                <div>
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Start Time
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={(event) =>
                      updateField(
                        "startTime",
                        event.target.value,
                      )
                    }
                    disabled={isSubmitting}
                    required
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Students can join before the
                    competition begins, subject to the
                    20-player capacity.
                  </p>
                </div>
              </div>

              {/* SCHEDULE PREVIEW */}

              {form.startDate &&
                form.startTime && (
                  <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

                      <div>
                        <p className="text-sm font-black text-indigo-900">
                          Scheduled Start
                        </p>

                        <p className="mt-1 text-base font-bold text-indigo-800">
                          {formatDate(
                            form.startDate,
                          )}{" "}
                          at{" "}
                          {form.startTime}
                        </p>

                        <p className="mt-1 text-xs text-indigo-700">
                          The Quiz Board remains scheduled
                          until the backend starts the live
                          competition.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              <div className="mt-6 flex gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                <p>
                  Use the management page to publish,
                  start or cancel the Quiz Board after
                  reviewing the configuration.
                </p>
              </div>
            </Card>

            {/* ==================================================
                ENTRY + REWARD
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                  <Coins className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Entry &amp; Winner Reward
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure the CBT Points used to
                    enter and the reward paid to the
                    eventual champion.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">

                {/* ENTRY */}

                <SelectField
                  id="entryPoints"
                  label="Entry Fee"
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
                  description="CBT Points deducted when a student successfully joins."
                />

                {/* REWARD */}

                <SelectField
                  id="winnerReward"
                  label="Winner Reward"
                  value={form.winnerReward}
                  onChange={(value) =>
                    updateField(
                      "winnerReward",
                      value,
                    )
                  }
                  options={
                    REWARD_POINT_OPTIONS
                  }
                  disabled={isSubmitting}
                  required
                  description="CBT Points awarded to the final winner."
                />
              </div>

              {/* 20 PLAYER CAPACITY */}

              <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-yellow-700" />

                  <div className="flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-yellow-950">
                          Player Capacity
                        </p>

                        <p className="mt-1 text-sm text-yellow-800">
                          Every Quiz Board has a maximum
                          capacity of 20 students.
                        </p>
                      </div>

                      <div className="rounded-xl bg-white px-5 py-3 text-center shadow-sm">
                        <p className="text-2xl font-black text-yellow-950">
                          20
                        </p>

                        <p className="text-xs font-bold text-yellow-700">
                          Maximum Players
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ENTRY ECONOMY */}

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Entry
                    </p>

                    <p className="mt-1 font-black text-slate-900">
                      {form.entryPoints
                        ? formatPoints(
                            Number(
                              form.entryPoints,
                            ),
                          )
                        : "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Winner
                    </p>

                    <p className="mt-1 font-black text-green-700">
                      {form.winnerReward
                        ? formatPoints(
                            Number(
                              form.winnerReward,
                            ),
                          )
                        : "Not selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Maximum Entries
                    </p>

                    <p className="mt-1 font-black text-slate-900">
                      20 Students
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <Card className="overflow-hidden border-slate-200">
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 md:px-8">
                <h2 className="text-lg font-black text-slate-900">
                  Quiz Board Summary
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Review the configuration before
                  creating the board.
                </p>
              </div>

              <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">

                <div className="bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 font-black text-slate-700">
                    Draft
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Players
                  </p>

                  <p className="mt-1 font-black text-slate-900">
                    20 Maximum
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Subjects
                  </p>

                  <p className="mt-1 font-black text-slate-900">
                    {selectedSubjects.length}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Questions
                  </p>

                  <p className="mt-1 font-black text-slate-900">
                    60 Questions
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Difficulty
                  </p>

                  <p className="mt-1 font-black text-slate-900">
                    {DIFFICULTY_OPTIONS.find(
                      (option) =>
                        option.value ===
                        form.difficulty,
                    )?.label ??
                      form.difficulty}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Entry
                  </p>

                  <p className="mt-1 font-black text-yellow-700">
                    {form.entryPoints
                      ? formatPoints(
                          Number(
                            form.entryPoints,
                          ),
                        )
                      : "Not selected"}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Winner Reward
                  </p>

                  <p className="mt-1 font-black text-green-700">
                    {form.winnerReward
                      ? formatPoints(
                          Number(
                            form.winnerReward,
                          ),
                        )
                      : "Not selected"}
                  </p>
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Start
                  </p>

                  <p className="mt-1 font-black text-slate-900">
                    {form.startDate
                      ? formatDate(
                          form.startDate,
                        )
                      : "Not selected"}
                  </p>

                  {form.startTime && (
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      {form.startTime}
                    </p>
                  )}
                </div>

                <div className="bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Elimination
                  </p>

                  <p className="mt-1 font-black text-purple-700">
                    20 → 15 → 10 → 5 → 2 → 1
                  </p>
                </div>
              </div>
            </Card>

            {/* ==================================================
                ROUND SUMMARY
            ================================================== */}

            <Card className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-black text-slate-900">
                  Competition Flow Preview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This is what students will experience
                  after the Quiz Board starts.
                </p>
              </div>

              <div className="space-y-4">
                {ROUND_CONFIGS.map(
                  (round) => (
                    <div
                      key={round.round}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                          {round.round}
                        </div>

                        {round.round <
                          5 && (
                          <div className="mt-2 h-full min-h-8 w-px bg-slate-200" />
                        )}
                      </div>

                      <div className="pb-5">
                        <p className="font-black text-slate-900">
                          {round.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          {round.questions} questions.
                          The fastest correct students
                          qualify from{" "}
                          <strong>
                            {round.from}
                          </strong>{" "}
                          players down to{" "}
                          <strong>
                            {round.to}
                          </strong>
                          .
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Card>

            {/* ==================================================
                BACKEND NOTE
            ================================================== */}

            <Card className="border-blue-200 bg-blue-50 p-6 md:p-8">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div className="min-w-0">
                  <h3 className="text-sm font-black text-blue-950">
                    Backend Responsibilities
                  </h3>

                  <div className="mt-3 space-y-2 text-sm leading-6 text-blue-900">
                    <p>
                      • Create the Quiz Board in{" "}
                      <code className="rounded bg-white px-1.5 py-0.5 text-xs font-bold">
                        DRAFT
                      </code>{" "}
                      status.
                    </p>

                    <p>
                      • Store the 20-player capacity
                      and CBT Point entry fee.
                    </p>

                    <p>
                      • Prepare 60 questions across
                      the five rounds.
                    </p>

                    <p>
                      • Control question timing using
                      server timestamps.
                    </p>

                    <p>
                      • Record the exact server-side
                      answer order.
                    </p>

                    <p>
                      • Determine qualification and
                      elimination.
                    </p>

                    <p>
                      • Calculate final-round points
                      and determine the winner.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* ==================================================
                ERRORS
            ================================================== */}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-bold text-green-700">
                {successMessage}
              </div>
            )}

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/admin/secondary/quiz-board/quiz-competitions"
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
                    Creating Quiz Board...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Quiz Board
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* ======================================================
            CREATION FLOW
        ====================================================== */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <p className="text-sm font-black text-slate-900">
            Quiz Board Administration Flow
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-lg bg-slate-900 px-3 py-2 font-bold text-white">
              1. Create
            </span>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <span className="rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-700">
              2. Configure Questions
            </span>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <span className="rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-700">
              3. Review
            </span>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <span className="rounded-lg bg-slate-100 px-3 py-2 font-bold text-slate-700">
              4. Open Registration
            </span>

            <ChevronRight className="h-4 w-4 text-slate-400" />

            <span className="rounded-lg bg-green-100 px-3 py-2 font-bold text-green-700">
              5. Start Live Board
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   SMALL ICON COMPONENT
============================================================ */

function BookOpenIcon() {
  return (
    <div className="flex h-5 w-5 items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M2 4h6a4 4 0 0 1 4 4v12a4 4 0 0 0-4-4H2z" />
        <path d="M22 4h-6a4 4 0 0 0-4 4v12a4 4 0 0 1 4-4h6z" />
      </svg>
    </div>
  );
}