



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  FileQuestion,
  Loader2,
  Percent,
  RefreshCw,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

import { getAllContestParticipations } from "@/lib/api/solveAndWin";

/* =========================================================
   TYPES
========================================================= */

type QuestionOption = {
  label: string;
  value: string;
  _id?: string;
};

type QuestionContentSegment = {
  text?: string;
  styles?: unknown[];
};

type QuestionContent = {
  type?: string;
  order?: number;
  segments?: QuestionContentSegment[];
  image?: unknown;
  table?: unknown[];
  graph?: unknown;
  items?: unknown[];
};

type ContestQuestion = {
  questionId: string;
  question: string;
  instruction?: string;

  content?: QuestionContent[];

  media?: unknown;

  options?: QuestionOption[];

  section?: string;
  questionType?: string;

  correctAnswers?: string[];

  isMultipleAnswer?: boolean;

  explanation?: string;
  explanationSteps?: unknown[];

  difficulty?: string;
  marks?: number;

  selectedOption?: string | null;
  isCorrect?: boolean | null;
  marksAwarded?: number;
};

type SubjectParticipation = {
  subjectId: string;

  questions: ContestQuestion[];

  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;

  score: number;

  durationInSeconds: number;
  remainingDurationInSeconds?: number;

  startedAt?: string | null;
  endsAt?: string | null;
  submittedAt?: string | null;
};

type ContestParticipation = {
  _id: string;

  userId: string;
  contestId: string;

  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;

  score: number;
  percentage: number;
  pointsSpent: number;

  durationInSeconds: number;

  status: string;

  subjects: SubjectParticipation[];

  createdAt?: string;
  updatedAt?: string;

  __v?: number;
};

type GetAllContestParticipationsResponse = {
  success: boolean;
  message?: string;

  data?: {
    totalCount: number;
    totalPages: number;
    contestParticipationObj: ContestParticipation[];
  };
};

type StatusFilter =
  | "ALL"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "SUBMITTED";

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDuration(seconds?: number | null) {
  if (
    seconds === undefined ||
    seconds === null ||
    Number.isNaN(Number(seconds))
  ) {
    return "—";
  }

  const safeSeconds = Math.max(0, Math.floor(Number(seconds)));

  const hours = Math.floor(safeSeconds / 3600);

  const minutes = Math.floor((safeSeconds % 3600) / 60);

  const secs = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }

  return `${secs}s`;
}

function formatRemainingTime(seconds?: number | null) {
  if (
    seconds === undefined ||
    seconds === null ||
    Number.isNaN(Number(seconds))
  ) {
    return "—";
  }

  const safeSeconds = Math.max(0, Math.floor(Number(seconds)));

  const minutes = Math.floor(safeSeconds / 60);

  const secs = safeSeconds % 60;

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function normalizeStatus(status?: string) {
  return String(status || "UNKNOWN")
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function getStatusClasses(status?: string) {
  const normalized = normalizeStatus(status);

  if (
    normalized === "COMPLETED" ||
    normalized === "SUBMITTED" ||
    normalized === "FINISHED"
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (
    normalized === "IN_PROGRESS" ||
    normalized === "STARTED" ||
    normalized === "ONGOING"
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (
    normalized === "FAILED" ||
    normalized === "CANCELLED" ||
    normalized === "DISQUALIFIED"
  ) {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

function getStatusLabel(status?: string) {
  return normalizeStatus(status)
    .split("_")
    .map(
      (word) =>
        word.charAt(0) + word.slice(1).toLowerCase()
    )
    .join(" ");
}

function getQuestionText(question: ContestQuestion) {
  if (question.question?.trim()) {
    return question.question.trim();
  }

  const contentText = question.content
    ?.flatMap(
      (item) =>
        item.segments?.map(
          (segment) => segment.text || ""
        ) || []
    )
    .join(" ")
    .trim();

  return contentText || "Question text unavailable";
}

function getOptionByLabel(
  question: ContestQuestion,
  label?: string | null
) {
  if (!label || !question.options) {
    return null;
  }

  return (
    question.options.find(
      (option) =>
        option.label?.toUpperCase() ===
        label.toUpperCase()
    ) || null
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          {description ? (
            <p className="mt-1 text-xs text-slate-400">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   QUESTION CARD
========================================================= */

function QuestionCard({
  question,
  index,
}: {
  question: ContestQuestion;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  const questionText = getQuestionText(question);

  const selectedOption = getOptionByLabel(
    question,
    question.selectedOption
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-slate-50"
      >
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
          {index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {question.questionType ? (
              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-700">
                {question.questionType}
              </span>
            ) : null}

            {question.difficulty ? (
              <span className="rounded-full bg-purple-50 px-2 py-1 text-[10px] font-bold uppercase text-purple-700">
                {question.difficulty}
              </span>
            ) : null}

            {question.isCorrect === true ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Correct
              </span>
            ) : null}

            {question.isCorrect === false ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold uppercase text-red-700">
                <XCircle className="h-3 w-3" />
                Wrong
              </span>
            ) : null}

            {question.isCorrect === null ||
            question.isCorrect === undefined ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">
                <CircleHelp className="h-3 w-3" />
                Unanswered
              </span>
            ) : null}
          </div>

          <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-800">
            {questionText}
          </p>
        </div>

        <div className="shrink-0 pt-1 text-slate-400">
          {open ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </button>

      {open ? (
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Question
              </p>

              <p className="mt-2 text-sm leading-7 text-slate-800">
                {questionText}
              </p>
            </div>

            {question.instruction ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Instruction
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {question.instruction}
                </p>
              </div>
            ) : null}

            {question.options?.length ? (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Options
                </p>

                <div className="grid gap-2">
                  {question.options.map((option) => {
                    const isSelected =
                      question.selectedOption?.toUpperCase() ===
                      option.label?.toUpperCase();

                    const isCorrect =
                      question.correctAnswers?.some(
                        (answer) =>
                          answer?.toUpperCase() ===
                          option.label?.toUpperCase()
                      ) ?? false;

                    return (
                      <div
                        key={option._id || option.label}
                        className={`rounded-xl border p-3 ${
                          isCorrect
                            ? "border-emerald-300 bg-emerald-50"
                            : isSelected
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                              isCorrect
                                ? "bg-emerald-600 text-white"
                                : isSelected
                                  ? "bg-red-600 text-white"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {option.label}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-6 text-slate-800">
                              {option.value}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {isSelected ? (
                                <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold uppercase text-red-700">
                                  Selected
                                </span>
                              ) : null}

                              {isCorrect ? (
                                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
                                  Correct answer
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem
                label="Selected option"
                value={
                  selectedOption
                    ? `${selectedOption.label}: ${selectedOption.value}`
                    : question.selectedOption ||
                      "Not answered"
                }
              />

              <DetailItem
                label="Marks"
                value={question.marks ?? 0}
              />

              <DetailItem
                label="Marks awarded"
                value={question.marksAwarded ?? 0}
              />

              <DetailItem
                label="Question ID"
                value={question.questionId}
              />
            </div>

            {question.explanation ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  Explanation
                </p>

                <p className="mt-2 text-sm leading-6 text-blue-950">
                  {question.explanation}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* =========================================================
   SUBJECT CARD
========================================================= */

function SubjectCard({
  subject,
  index,
}: {
  subject: SubjectParticipation;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="w-full p-4 text-left transition hover:bg-slate-50"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <BookOpen className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-slate-900">
                Subject {index + 1}
              </h4>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                {subject.questions?.length || 0} questions
              </span>
            </div>

            <p className="mt-1 break-all text-xs text-slate-400">
              Subject ID: {subject.subjectId}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Correct: {subject.correctAnswers ?? 0}
              </span>

              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                Wrong: {subject.wrongAnswers ?? 0}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                Unanswered:{" "}
                {subject.unansweredQuestions ?? 0}
              </span>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                Score: {subject.score ?? 0}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-slate-400">
            {open ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>
      </button>

      {open ? (
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem
              label="Duration"
              value={formatDuration(
                subject.durationInSeconds
              )}
            />

            <DetailItem
              label="Remaining"
              value={formatRemainingTime(
                subject.remainingDurationInSeconds
              )}
            />

            <DetailItem
              label="Started"
              value={formatDate(subject.startedAt)}
            />

            <DetailItem
              label="Submitted"
              value={formatDate(subject.submittedAt)}
            />
          </div>

          {subject.questions?.length ? (
            <div className="space-y-3">
              {subject.questions.map(
                (question, questionIndex) => (
                  <QuestionCard
                    key={
                      question.questionId ||
                      `${subject.subjectId}-${questionIndex}`
                    }
                    question={question}
                    index={questionIndex}
                  />
                )
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <FileQuestion className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-2 text-sm font-semibold text-slate-600">
                No questions found for this subject.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

/* =========================================================
   PARTICIPATION CARD
========================================================= */

function ParticipationCard({
  participation,
}: {
  participation: ContestParticipation;
}) {
  const [open, setOpen] = useState(false);

  const totalQuestions =
    participation.totalQuestions ||
    participation.subjects?.reduce(
      (total, subject) =>
        total + (subject.questions?.length || 0),
      0
    ) ||
    0;

  const percentage = Number.isFinite(
    Number(participation.percentage)
  )
    ? Number(participation.percentage)
    : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className="w-full p-5 text-left transition hover:bg-slate-50"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Users className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Participant
                </span>

                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${getStatusClasses(
                    participation.status
                  )}`}
                >
                  {getStatusLabel(participation.status)}
                </span>
              </div>

              <p className="mt-1 break-all text-xs text-slate-500">
                User ID: {participation.userId}
              </p>

              <p className="mt-1 break-all text-xs text-slate-400">
                Participation ID: {participation._id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:items-center">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-[10px] font-semibold uppercase text-slate-400">
                Score
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {participation.score ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-[10px] font-semibold uppercase text-slate-400">
                Percentage
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {percentage}%
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-[10px] font-semibold uppercase text-slate-400">
                Questions
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {totalQuestions}
              </p>
            </div>

            <div className="flex items-center justify-center px-2 text-slate-400">
              {open ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          </div>
        </div>
      </button>

      {open ? (
        <div className="border-t border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem
              label="Total questions"
              value={
                participation.totalQuestions ??
                totalQuestions
              }
            />

            <DetailItem
              label="Correct answers"
              value={participation.correctAnswers ?? 0}
            />

            <DetailItem
              label="Wrong answers"
              value={participation.wrongAnswers ?? 0}
            />

            <DetailItem
              label="Unanswered"
              value={
                participation.unansweredQuestions ?? 0
              }
            />

            <DetailItem
              label="Score"
              value={participation.score ?? 0}
            />

            <DetailItem
              label="Percentage"
              value={`${percentage}%`}
            />

            <DetailItem
              label="Points spent"
              value={participation.pointsSpent ?? 0}
            />

            <DetailItem
              label="Duration"
              value={formatDuration(
                participation.durationInSeconds
              )}
            />

            <DetailItem
              label="Contest ID"
              value={participation.contestId}
            />

            <DetailItem
              label="Created"
              value={formatDate(participation.createdAt)}
            />

            <DetailItem
              label="Updated"
              value={formatDate(participation.updatedAt)}
            />

            <DetailItem
              label="Subjects"
              value={participation.subjects?.length || 0}
            />
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-slate-700" />

              <h3 className="font-bold text-slate-900">
                Subjects & Questions
              </h3>
            </div>

            {participation.subjects?.length ? (
              <div className="space-y-3">
                {participation.subjects.map(
                  (subject, subjectIndex) => (
                    <SubjectCard
                      key={`${subject.subjectId}-${subjectIndex}`}
                      subject={subject}
                      index={subjectIndex}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-2 text-sm font-semibold text-slate-600">
                  No subjects found for this
                  participation.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AllParticipantsPage() {
  const [participations, setParticipations] =
    useState<ContestParticipation[]>([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [totalCount, setTotalCount] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* =======================================================
     FETCH PARTICIPATIONS
  ======================================================= */

  const fetchParticipations = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        /*
         * IMPORTANT:
         *
         * We no longer manually get the access token.
         *
         * We no longer use fetch().
         *
         * The API function uses your axiosInstance,
         * allowing your existing authentication/interceptors
         * to handle the token.
         */
        const result =
          (await getAllContestParticipations(
            page,
            limit
          )) as GetAllContestParticipationsResponse;

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to load contest participations."
          );
        }

        const apiData = result.data;

        setParticipations(
          apiData?.contestParticipationObj || []
        );

        setTotalCount(apiData?.totalCount || 0);

        setTotalPages(
          Math.max(1, apiData?.totalPages || 1)
        );
      } catch (fetchError: unknown) {
        let message =
          "Unable to load contest participations.";

        if (fetchError instanceof Error) {
          message = fetchError.message;
        } else if (
          typeof fetchError === "object" &&
          fetchError !== null &&
          "response" in fetchError
        ) {
          const axiosError = fetchError as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

          message =
            axiosError.response?.data?.message ||
            message;
        }

        setError(message);

        setParticipations([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit]
  );

  /* =======================================================
     INITIAL LOAD / PAGE CHANGE
  ======================================================= */

  useEffect(() => {
    fetchParticipations();
  }, [fetchParticipations]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredParticipations = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return participations.filter((participation) => {
      const normalizedStatus = normalizeStatus(
        participation.status
      );

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizedStatus === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        participation.userId
          ?.toLowerCase()
          .includes(search) ||
        participation._id
          ?.toLowerCase()
          .includes(search) ||
        participation.contestId
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [
    participations,
    searchTerm,
    statusFilter,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const pageStart =
    totalCount === 0
      ? 0
      : (page - 1) * limit + 1;

  const pageEnd = Math.min(
    page * limit,
    totalCount
  );

  const canGoPrevious = page > 1;

  const canGoNext = page < totalPages;

  const goToPage = (newPage: number) => {
    if (
      newPage < 1 ||
      newPage > totalPages
    ) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary = useMemo(() => {
    const current = participations;

    const totalQuestions = current.reduce(
      (sum, item) =>
        sum + (item.totalQuestions || 0),
      0
    );

    const correctAnswers = current.reduce(
      (sum, item) =>
        sum + (item.correctAnswers || 0),
      0
    );

    const wrongAnswers = current.reduce(
      (sum, item) =>
        sum + (item.wrongAnswers || 0),
      0
    );

    const pointsSpent = current.reduce(
      (sum, item) =>
        sum + (item.pointsSpent || 0),
      0
    );

    const averagePercentage =
      current.length > 0
        ? current.reduce(
            (sum, item) =>
              sum +
              Number(item.percentage || 0),
            0
          ) / current.length
        : 0;

    return {
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      pointsSpent,
      averagePercentage,
    };
  }, [participations]);

  /* =======================================================
     STATUS COUNTS
  ======================================================= */

  const statusCounts = useMemo(() => {
    return {
      all: totalCount,

      inProgress: participations.filter(
        (item) =>
          normalizeStatus(item.status) ===
          "IN_PROGRESS"
      ).length,

      completed: participations.filter(
        (item) =>
          normalizeStatus(item.status) ===
            "COMPLETED" ||
          normalizeStatus(item.status) ===
            "SUBMITTED"
      ).length,
    };
  }, [participations, totalCount]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                  <Trophy className="h-6 w-6" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    All Participants
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    View contest participation,
                    scores, subjects and submitted
                    questions.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                fetchParticipations(true)
              }
              disabled={
                loading || refreshing
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </div>

        {/* PRIMARY STATS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <Users className="h-5 w-5" />
            }
            label="Total participants"
            value={totalCount}
            description="All contest participations"
          />

          <StatCard
            icon={
              <FileQuestion className="h-5 w-5" />
            }
            label="Questions"
            value={summary.totalQuestions}
            description="On the current page"
          />

          <StatCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Correct answers"
            value={summary.correctAnswers}
            description="On the current page"
          />

          <StatCard
            icon={
              <Percent className="h-5 w-5" />
            }
            label="Average percentage"
            value={`${summary.averagePercentage.toFixed(
              1
            )}%`}
            description="Current page average"
          />
        </div>

        {/* SECONDARY STATS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Zap className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Points spent
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {summary.pointsSpent}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Correct
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {summary.correctAnswers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <XCircle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Wrong
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {summary.wrongAnswers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value
                    )
                  }
                  placeholder="Search user ID, participation ID or contest ID..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target
                      .value as StatusFilter
                  );
                }}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value="ALL">
                  All statuses ({statusCounts.all})
                </option>

                <option value="IN_PROGRESS">
                  In progress
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="SUBMITTED">
                  Submitted
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="page-limit"
                className="text-xs font-medium text-slate-500"
              >
                Per page
              </label>

              <select
                id="page-limit"
                value={limit}
                onChange={(event) => {
                  setLimit(
                    Number(event.target.value)
                  );

                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error ? (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-red-800">
                  Unable to load participants
                </p>

                <p className="mt-1 break-words text-sm text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fetchParticipations()
                  }
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-700" />

            <p className="mt-4 text-sm font-semibold text-slate-700">
              Loading contest participants...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Please wait while the participation
              records are retrieved.
            </p>
          </div>
        ) : null}

        {/* EMPTY */}
        {!loading &&
        !error &&
        filteredParticipations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
            <Eye className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 text-lg font-bold text-slate-800">
              No participants found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {searchTerm ||
              statusFilter !== "ALL"
                ? "No participation records match your current search or status filter."
                : "There are currently no contest participation records."}
            </p>

            {(searchTerm ||
              statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : null}

        {/* PARTICIPANTS */}
        {!loading &&
        filteredParticipations.length > 0 ? (
          <div className="space-y-4">
            {filteredParticipations.map(
              (participation) => (
                <ParticipationCard
                  key={participation._id}
                  participation={participation}
                />
              )
            )}
          </div>
        ) : null}

        {/* PAGINATION */}
        {!loading && totalCount > 0 ? (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {pageStart}
                </span>{" "}
                to{" "}
                <span className="font-bold text-slate-900">
                  {pageEnd}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {totalCount}
                </span>{" "}
                participants
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Page {page} of {totalPages}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canGoPrevious}
                onClick={() =>
                  goToPage(page - 1)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <div className="hidden items-center gap-1 sm:flex">
                {Array.from(
                  {
                    length: Math.min(
                      totalPages,
                      5
                    ),
                  },
                  (_, index) => {
                    let pageNumber: number;

                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (page <= 3) {
                      pageNumber = index + 1;
                    } else if (
                      page >=
                      totalPages - 2
                    ) {
                      pageNumber =
                        totalPages -
                        4 +
                        index;
                    } else {
                      pageNumber =
                        page -
                        2 +
                        index;
                    }

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() =>
                          goToPage(
                            pageNumber
                          )
                        }
                        className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
                          pageNumber === page
                            ? "bg-slate-900 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                type="button"
                disabled={!canGoNext}
                onClick={() =>
                  goToPage(page + 1)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}

        {/* ENDPOINT INFORMATION */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Participation endpoint
              </p>

              <p className="mt-1 break-all font-mono text-xs text-slate-600">
                /solve-and-win/contests/get-all-contest-participations
                ?page={page}&limit={limit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
