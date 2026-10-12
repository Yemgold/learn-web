






"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  FileQuestion,
  Loader2,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";

import { axiosInstance } from "@/lib";

/* =========================================================
   TYPES
   ========================================================= */

type AnyRecord = Record<string, any>;

type RoundInformation = {
  round_number?: number;
  roundNumber?: number;
  no_of_questions?: number;
  noOfQuestions?: number;
  exit_number?: number;
  exitNumber?: number;
  exit_reward?: number;
  exitReward?: number;
  difficultyBreakdown?: AnyRecord;
  difficulty_breakdown?: AnyRecord;
};

type FinalRoundInformation = {
  no_of_questions?: number;
  noOfQuestions?: number;
  first_position_reward?: number;
  firstPositionReward?: number;
  second_position_reward?: number;
  secondPositionReward?: number;
  difficultyBreakdown?: AnyRecord;
  difficulty_breakdown?: AnyRecord;
};

type Quiz = {
  _id?: string;
  id?: string;
  quizId?: string;

  title?: string;
  quiz_title?: string;
  quizTitle?: string;
  name?: string;

  subject?: string | AnyRecord;

  no_of_contestants?: number;
  noOfContestants?: number;

  number_of_rounds?: number;
  numberOfRounds?: number;

  round_information?: RoundInformation[];
  roundInformation?: RoundInformation[];

  final_round_information?:
    | FinalRoundInformation
    | FinalRoundInformation[];
  finalRoundInformation?:
    | FinalRoundInformation
    | FinalRoundInformation[];

  time_per_question?: number;
  timePerQuestion?: number;

  start_date?: string;
  startDate?: string;

  room_id?: string | null;
  roomId?: string | null;

  current_round?: number;
  currentRound?: number;

  status?: string;

  joined_users?: number | unknown[];
  joinedUsers?: number | unknown[];
};

type NormalizedOption = {
  label: string;
  value: string;
  isCorrect: boolean;
};

type NormalizedQuestion = {
  id: string;
  number: number;
  text: string;
  options: NormalizedOption[];
  correctAnswers: string[];
  difficulty?: string;
  explanation?: string;
  raw: AnyRecord;
};

type RoundTab = {
  number: number;
  label: string;
  isFinal: boolean;
  config?: RoundInformation | FinalRoundInformation;
};

/* =========================================================
   HELPERS
   ========================================================= */

function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
): string {
  const err = error as AnyRecord;

  const message =
    err?.response?.data?.message ??
    err?.response?.data?.error ??
    err?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return fallback;
}

function unwrapApiData(payload: unknown): unknown {
  const response = payload as AnyRecord;

  return response?.data ?? response;
}

function extractQuiz(payload: unknown): Quiz | null {
  const root = unwrapApiData(payload) as AnyRecord;

  const candidates = [
    root?.quiz,
    root?.quizObj,
    root?.quizDetails,
    root?.quizData,
    root?.data?.quiz,
    root?.data?.quizObj,
    root?.data?.quizDetails,
    root,
  ];

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      const item = candidate as Quiz;

      if (
        item._id ||
        item.id ||
        item.quizId ||
        item.title ||
        item.quiz_title ||
        item.number_of_rounds ||
        item.round_information
      ) {
        return item;
      }
    }
  }

  return null;
}

function extractQuestionArray(payload: unknown): AnyRecord[] {
  const root = payload as AnyRecord;

  const candidates: unknown[] = [
    root?.data?.questions,
    root?.data?.roundQuestions,
    root?.data?.questionsObj,
    root?.data?.roundQuestionsObj,

    root?.questions,
    root?.roundQuestions,
    root?.questionsObj,
    root?.roundQuestionsObj,

    root?.data?.data?.questions,
    root?.data?.data?.roundQuestions,

    Array.isArray(root?.data) ? root.data : null,
    Array.isArray(root) ? root : null,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(
        (item): item is AnyRecord =>
          !!item && typeof item === "object" && !Array.isArray(item),
      );
    }

    if (
      candidate &&
      typeof candidate === "object" &&
      !Array.isArray(candidate)
    ) {
      const objectCandidate = candidate as AnyRecord;

      const nestedArrays = [
        objectCandidate.questions,
        objectCandidate.roundQuestions,
        objectCandidate.items,
        objectCandidate.results,
      ];

      for (const nested of nestedArrays) {
        if (Array.isArray(nested)) {
          return nested.filter(
            (item): item is AnyRecord =>
              !!item &&
              typeof item === "object" &&
              !Array.isArray(item),
          );
        }
      }
    }
  }

  return [];
}

function getQuestionText(question: AnyRecord): string {
  return String(
    question?.question ??
      question?.question_text ??
      question?.questionText ??
      question?.text ??
      question?.title ??
      question?.content ??
      "Question text unavailable",
  );
}

function getQuestionId(question: AnyRecord, index: number): string {
  return String(
    question?._id ??
      question?.id ??
      question?.questionId ??
      question?.question_id ??
      `question-${index + 1}`,
  );
}

function getQuestionNumber(
  question: AnyRecord,
  index: number,
): number {
  const value =
    question?.question_number ??
    question?.questionNumber ??
    question?.number ??
    question?.order ??
    index + 1;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : index + 1;
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "object") {
    const obj = value as AnyRecord;

    return String(
      obj?.value ??
        obj?.text ??
        obj?.label ??
        obj?.option ??
        obj?.answer ??
        "",
    );
  }

  return String(value);
}

function getCorrectAnswerValues(question: AnyRecord): string[] {
  const raw =
    question?.correctAnswers ??
    question?.correct_answers ??
    question?.correctAnswer ??
    question?.correct_answer ??
    question?.answer ??
    question?.correctOption ??
    question?.correct_option;

  if (Array.isArray(raw)) {
    return raw
      .map((item) => stringifyValue(item))
      .filter(Boolean);
  }

  if (raw !== undefined && raw !== null) {
    const value = stringifyValue(raw);

    return value ? [value] : [];
  }

  return [];
}

function getOptions(question: AnyRecord): NormalizedOption[] {
  const rawOptions =
    question?.options ??
    question?.choices ??
    question?.answers ??
    question?.option_list ??
    [];

  const correctAnswers = getCorrectAnswerValues(question);

  const correctSet = new Set(
    correctAnswers.map((answer) => answer.trim().toLowerCase()),
  );

  const letter = (index: number) =>
    String.fromCharCode("A".charCodeAt(0) + index);

  if (Array.isArray(rawOptions)) {
    return rawOptions.map((option, index) => {
      if (
        option &&
        typeof option === "object" &&
        !Array.isArray(option)
      ) {
        const optionObject = option as AnyRecord;

        const label = String(
          optionObject?.label ??
            optionObject?.key ??
            optionObject?.letter ??
            letter(index),
        );

        const value = String(
          optionObject?.value ??
            optionObject?.text ??
            optionObject?.option ??
            optionObject?.answer ??
            "",
        );

        const explicitlyCorrect =
          optionObject?.isCorrect ??
          optionObject?.is_correct ??
          optionObject?.correct;

        const isCorrect =
          explicitlyCorrect === true ||
          correctSet.has(label.trim().toLowerCase()) ||
          correctSet.has(value.trim().toLowerCase());

        return {
          label,
          value,
          isCorrect,
        };
      }

      const value = stringifyValue(option);

      return {
        label: letter(index),
        value,
        isCorrect: correctSet.has(value.trim().toLowerCase()),
      };
    });
  }

  if (
    rawOptions &&
    typeof rawOptions === "object" &&
    !Array.isArray(rawOptions)
  ) {
    return Object.entries(rawOptions).map(
      ([key, value], index) => {
        const optionValue = stringifyValue(value);

        return {
          label: key || letter(index),
          value: optionValue,
          isCorrect:
            correctSet.has(key.trim().toLowerCase()) ||
            correctSet.has(optionValue.trim().toLowerCase()),
        };
      },
    );
  }

  return [];
}

function normalizeQuestions(
  payload: unknown,
): NormalizedQuestion[] {
  const rawQuestions = extractQuestionArray(payload);

  return rawQuestions.map((question, index) => {
    const correctAnswers = getCorrectAnswerValues(question);

    const options = getOptions(question);

    const explicitlyDifficulty =
      question?.difficulty ??
      question?.difficulty_level ??
      question?.difficultyLevel;

    const explanation =
      question?.explanation ??
      question?.solution ??
      question?.answer_explanation;

    return {
      id: getQuestionId(question, index),
      number: getQuestionNumber(question, index),
      text: getQuestionText(question),
      options,
      correctAnswers,
      difficulty: explicitlyDifficulty
        ? String(explicitlyDifficulty)
        : undefined,
      explanation: explanation
        ? String(explanation)
        : undefined,
      raw: question,
    };
  });
}

function getTotalRounds(quiz: Quiz | null): number {
  if (!quiz) return 0;

  const explicit =
    quiz.number_of_rounds ?? quiz.numberOfRounds;

  const explicitNumber = Number(explicit);

  if (Number.isFinite(explicitNumber) && explicitNumber > 0) {
    return explicitNumber;
  }

  const information =
    quiz.round_information ?? quiz.roundInformation ?? [];

  const highestRound = information.reduce((highest, round) => {
    const number = Number(
      round?.round_number ?? round?.roundNumber ?? 0,
    );

    return number > highest ? number : highest;
  }, 0);

  const finalInformation =
    quiz.final_round_information ??
    quiz.finalRoundInformation;

  const hasFinal =
    !!finalInformation &&
    (!Array.isArray(finalInformation) ||
      finalInformation.length > 0);

  return Math.max(
    highestRound,
    information.length + (hasFinal ? 1 : 0),
  );
}

function getRoundInformation(
  quiz: Quiz,
  roundNumber: number,
): RoundInformation | undefined {
  const information =
    quiz.round_information ?? quiz.roundInformation ?? [];

  return (
    information.find(
      (round) =>
        Number(
          round?.round_number ?? round?.roundNumber,
        ) === roundNumber,
    ) ??
    information[roundNumber - 1]
  );
}

function getFinalRoundInformation(
  quiz: Quiz,
): FinalRoundInformation | undefined {
  const finalInformation =
    quiz.final_round_information ??
    quiz.finalRoundInformation;

  if (Array.isArray(finalInformation)) {
    return finalInformation[0];
  }

  return finalInformation;
}

function getRoundTabs(quiz: Quiz | null): RoundTab[] {
  if (!quiz) return [];

  const totalRounds = getTotalRounds(quiz);

  if (totalRounds <= 0) return [];

  const tabs: RoundTab[] = [];

  for (let roundNumber = 1; roundNumber <= totalRounds; roundNumber++) {
    const isFinal = roundNumber === totalRounds;

    tabs.push({
      number: roundNumber,
      label: isFinal
        ? "Final Round"
        : `Round ${roundNumber}`,
      isFinal,
      config: isFinal
        ? getFinalRoundInformation(quiz)
        : getRoundInformation(quiz, roundNumber),
    });
  }

  return tabs;
}

function getQuizTitle(quiz: Quiz | null): string {
  if (!quiz) return "Quiz Competition";

  return String(
    quiz.title ??
      quiz.quiz_title ??
      quiz.quizTitle ??
      quiz.name ??
      "Quiz Competition",
  );
}

function getSubjectName(quiz: Quiz | null): string {
  if (!quiz?.subject) return "—";

  if (typeof quiz.subject === "string") {
    return quiz.subject;
  }

  return String(
    quiz.subject?.name ??
      quiz.subject?.title ??
      quiz.subject?.subject_name ??
      "—",
  );
}

function getContestantCount(quiz: Quiz | null): number {
  if (!quiz) return 0;

  return Number(
    quiz.no_of_contestants ??
      quiz.noOfContestants ??
      0,
  );
}

function getJoinedUsersCount(quiz: Quiz | null): number {
  if (!quiz) return 0;

  const value =
    quiz.joined_users ??
    quiz.joinedUsers ??
    0;

  if (Array.isArray(value)) {
    return value.length;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function getTimePerQuestion(quiz: Quiz | null): number {
  if (!quiz) return 0;

  return Number(
    quiz.time_per_question ??
      quiz.timePerQuestion ??
      0,
  );
}

function getRoomId(quiz: Quiz | null): string {
  if (!quiz) return "";

  return String(
    quiz.room_id ??
      quiz.roomId ??
      "",
  );
}

function getStatus(quiz: Quiz | null): string {
  return String(quiz?.status ?? "DRAFT").toUpperCase();
}

function formatDate(value?: string): string {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getDifficultySummary(
  config?: RoundInformation | FinalRoundInformation,
): string {
  if (!config) return "";

  const breakdown =
    config.difficultyBreakdown ??
    config.difficulty_breakdown;

  if (!breakdown || typeof breakdown !== "object") {
    return "";
  }

  return Object.entries(breakdown)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" • ");
}

function getExpectedQuestionCount(
  config?: RoundInformation | FinalRoundInformation,
): number {
  if (!config) return 0;

  return Number(
    config.no_of_questions ??
      config.noOfQuestions ??
      0,
  );
}

function getRoundExitNumber(
  config?: RoundInformation | FinalRoundInformation,
): number | null {
  if (!config) return null;

  const value =
    (config as RoundInformation).exit_number ??
    (config as RoundInformation).exitNumber;

  if (value === undefined || value === null) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function getReward(
  value: unknown,
): string {
  if (value === undefined || value === null || value === "") {
    return "—";
  }

  return String(value);
}

/* =========================================================
   PAGE
   ========================================================= */

export default function QuizBoardQuestionsPage() {
  const router = useRouter();

  const params = useParams<{
    "quiz-competitionsId": string;
  }>();

  const quizId = String(
    params?.["quiz-competitionsId"] ?? "",
  );

  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [selectedRound, setSelectedRound] = useState(1);

  const [questions, setQuestions] = useState<
    NormalizedQuestion[]
  >([]);

  const [quizLoading, setQuizLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] =
    useState(false);

  const [quizError, setQuizError] = useState("");
  const [questionsError, setQuestionsError] = useState("");

  const [copiedRoomId, setCopiedRoomId] = useState(false);

  /* =========================================================
     DERIVED DATA
     ========================================================= */

  const roundTabs = useMemo(
    () => getRoundTabs(quiz),
    [quiz],
  );

  const selectedRoundConfig = useMemo(
    () =>
      roundTabs.find(
        (round) => round.number === selectedRound,
      ),
    [roundTabs, selectedRound],
  );

  const totalRounds = roundTabs.length;

  const expectedQuestionCount = getExpectedQuestionCount(
    selectedRoundConfig?.config,
  );

  const joinedUsers = getJoinedUsersCount(quiz);
  const contestantLimit = getContestantCount(quiz);

  const roomId = getRoomId(quiz);

  const roomIsFull =
    contestantLimit > 0 &&
    joinedUsers >= contestantLimit;

  /* =========================================================
     FETCH QUIZ
     ========================================================= */

  const fetchQuiz = useCallback(async () => {
    if (!quizId) {
      setQuizError("Quiz ID is missing from the URL.");
      setQuizLoading(false);
      return;
    }

    try {
      setQuizLoading(true);
      setQuizError("");

      const response = await axiosInstance.get(
        `/quiz/get-quiz-by-quizId/${quizId}`,
      );

      const quizData = extractQuiz(response.data);

      if (!quizData) {
        throw new Error(
          "The quiz details could not be found in the response.",
        );
      }

      setQuiz(quizData);
    } catch (error) {
      console.error(
        "Failed to fetch quiz details:",
        error,
      );

      setQuizError(
        getApiErrorMessage(
          error,
          "Unable to load this quiz competition.",
        ),
      );
    } finally {
      setQuizLoading(false);
    }
  }, [quizId]);

  /* =========================================================
     FETCH ROUND QUESTIONS
     ========================================================= */

  const fetchRoundQuestions = useCallback(
    async (roundNumber: number) => {
      if (!quizId) {
        setQuestionsError(
          "Quiz ID is missing from the URL.",
        );
        return;
      }

      if (!Number.isFinite(roundNumber) || roundNumber < 1) {
        setQuestionsError(
          "A valid round number is required.",
        );
        return;
      }

      try {
        setQuestionsLoading(true);
        setQuestionsError("");
        setQuestions([]);

        /*
         * IMPORTANT:
         *
         * The backend requires:
         *
         * GET /quiz/get-round-questions/{quizId}?roundNumber=1
         *
         * Do NOT use:
         * /quiz/get-round-questions/{quizId}
         *
         * and do NOT use:
         * /quiz/get-round-questions/%7BquizId%7D
         */
        const response = await axiosInstance.get(
          `/quiz/get-round-questions/${quizId}`,
          {
            params: {
              roundNumber,
            },
          },
        );

        const normalized =
          normalizeQuestions(response.data);

        setQuestions(normalized);
      } catch (error) {
        console.error(
          `Failed to fetch round ${roundNumber} questions:`,
          error,
        );

        setQuestionsError(
          getApiErrorMessage(
            error,
            `Unable to load questions for Round ${roundNumber}.`,
          ),
        );
      } finally {
        setQuestionsLoading(false);
      }
    },
    [quizId],
  );

  /* =========================================================
     INITIAL LOAD
     ========================================================= */

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  /* =========================================================
     LOAD QUESTIONS WHEN ROUND CHANGES
     ========================================================= */

  useEffect(() => {
    if (!quiz || totalRounds <= 0) {
      return;
    }

    if (selectedRound > totalRounds) {
      setSelectedRound(totalRounds);
      return;
    }

    fetchRoundQuestions(selectedRound);
  }, [
    quiz,
    selectedRound,
    totalRounds,
    fetchRoundQuestions,
  ]);

  /* =========================================================
     ACTIONS
     ========================================================= */

  function handleSelectRound(roundNumber: number) {
    if (roundNumber === selectedRound) {
      return;
    }

    setSelectedRound(roundNumber);
    setQuestionsError("");
  }

  async function handleCopyRoomId() {
    if (!roomId) return;

    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedRoomId(true);

      window.setTimeout(() => {
        setCopiedRoomId(false);
      }, 1800);
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  }

  function handleRefresh() {
    fetchQuiz();
    fetchRoundQuestions(selectedRound);
  }

  /* =========================================================
     LOADING
     ========================================================= */

  if (quizLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <p className="text-sm text-white/60">
              Loading quiz competition...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (quizError || !quiz) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/secondary/quiz-board/quiz-competitions",
              )
            }
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to competitions
          </button>

          <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.06] p-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-red-400/10 p-3">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>

              <div>
                <h1 className="text-lg font-semibold">
                  Unable to load competition
                </h1>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  {quizError ||
                    "The quiz could not be found."}
                </p>

                <button
                  type="button"
                  onClick={fetchQuiz}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium transition hover:bg-white/[0.1]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
     ========================================================= */

  return (
    <div className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ==================================================
            TOP NAV
            ================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/secondary/quiz-board/quiz-competitions",
              )
            }
            className="inline-flex w-fit items-center gap-2 text-sm text-white/55 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to competitions
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={
              quizLoading || questionsLoading
            }
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                questionsLoading
                  ? "animate-spin"
                  : ""
              }`}
            />
            Refresh
          </button>
        </div>

        {/* ==================================================
            HEADER
            ================================================== */}

        <section className="mb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                  <FileQuestion className="h-3.5 w-3.5" />
                  Question Management
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/55">
                  {getStatus(quiz)}
                </span>

                {roomId && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Room Created
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {getQuizTitle(quiz)}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                Review the questions assigned to each round
                before the Quiz Board competition is opened.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
             

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wider text-white/35">
                  Rounds
                </div>
                <div className="mt-1 text-sm font-semibold text-white/85">
                  {totalRounds || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wider text-white/35">
                  Contestants
                </div>
                <div className="mt-1 text-sm font-semibold text-white/85">
                  {joinedUsers}/{contestantLimit || "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-[11px] uppercase tracking-wider text-white/35">
                  Time / Q
                </div>
                <div className="mt-1 text-sm font-semibold text-white/85">
                  {getTimePerQuestion(quiz)
                    ? `${getTimePerQuestion(quiz)}s`
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            ROOM STATUS
            ================================================== */}

        <section className="mb-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-2xl p-3 ${
                    roomId
                      ? "bg-emerald-400/10"
                      : "bg-amber-400/10"
                  }`}
                >
                  {roomId ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-amber-400" />
                  )}
                </div>

                <div>
                  <h2 className="font-semibold">
                    {roomId
                      ? "Competition room created"
                      : "Competition room not created"}
                  </h2>

                  <p className="mt-1 text-sm text-white/50">
                    {roomId
                      ? roomIsFull
                        ? "The contestant capacity has been reached."
                        : "Questions can be reviewed while contestants join the room."
                      : "Create the competition room before contestants can join."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {roomId && (
                  <button
                    type="button"
                    onClick={handleCopyRoomId}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/[0.08]"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedRoomId
                      ? "Copied"
                      : "Copy Room ID"}
                  </button>
                )}

                {roomId && (
                  <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5">
                    <span className="text-xs text-white/35">
                      Room ID
                    </span>
                    <div className="mt-0.5 max-w-[220px] truncate font-mono text-xs text-white/75">
                      {roomId}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================
            ROUND SELECTOR
            ================================================== */}

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Competition Rounds
              </h2>
              <p className="mt-1 text-sm text-white/45">
                Select a round to load its questions.
              </p>
            </div>

            {totalRounds > 0 && (
              <div className="hidden text-xs text-white/35 sm:block">
                {totalRounds}{" "}
                {totalRounds === 1 ? "round" : "rounds"}
              </div>
            )}
          </div>

          {roundTabs.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center">
              <FileQuestion className="mx-auto h-8 w-8 text-white/25" />
              <p className="mt-3 text-sm text-white/50">
                No round configuration was found for this
                competition.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {roundTabs.map((round) => {
                const isSelected =
                  round.number === selectedRound;

                const configuredQuestions =
                  getExpectedQuestionCount(
                    round.config,
                  );

                return (
                  <button
                    key={round.number}
                    type="button"
                    onClick={() =>
                      handleSelectRound(round.number)
                    }
                    className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-blue-400/40 bg-blue-400/[0.10] shadow-lg shadow-blue-950/20"
                        : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                          isSelected
                            ? "bg-blue-400/20 text-blue-300"
                            : round.isFinal
                              ? "bg-amber-400/10 text-amber-300"
                              : "bg-white/[0.06] text-white/60"
                        }`}
                      >
                        {round.isFinal ? (
                          <Trophy className="h-4 w-4" />
                        ) : (
                          round.number
                        )}
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-blue-300" />
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="font-semibold">
                        {round.label}
                      </div>

                      <div className="mt-1 text-xs text-white/40">
                        {configuredQuestions > 0
                          ? `${configuredQuestions} questions`
                          : "Question count not configured"}
                      </div>
                    </div>

                    <ChevronRight
                      className={`absolute bottom-4 right-4 h-4 w-4 transition ${
                        isSelected
                          ? "text-blue-300"
                          : "text-white/15 group-hover:text-white/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ==================================================
            SELECTED ROUND HEADER
            ================================================== */}

        {selectedRoundConfig && (
          <section className="mb-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-2xl p-3 ${
                        selectedRoundConfig.isFinal
                          ? "bg-amber-400/10"
                          : "bg-blue-400/10"
                      }`}
                    >
                      {selectedRoundConfig.isFinal ? (
                        <Trophy className="h-5 w-5 text-amber-300" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-blue-300" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-wider text-white/35">
                        Selected Round
                      </div>

                      <h2 className="mt-0.5 text-xl font-bold">
                        {selectedRoundConfig.label}
                      </h2>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5">
                    <div className="text-[11px] uppercase tracking-wider text-white/30">
                      Questions loaded
                    </div>

                    <div className="mt-0.5 text-sm font-semibold">
                      {questionsLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        <>
                          {questions.length}
                          {expectedQuestionCount > 0 &&
                            ` / ${expectedQuestionCount}`}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <FileQuestion className="h-3.5 w-3.5" />
                      Configured questions
                    </div>
                    <div className="mt-2 text-lg font-bold">
                      {expectedQuestionCount || "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Clock3 className="h-3.5 w-3.5" />
                      Time per question
                    </div>
                    <div className="mt-2 text-lg font-bold">
                      {getTimePerQuestion(quiz)
                        ? `${getTimePerQuestion(quiz)} sec`
                        : "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Users className="h-3.5 w-3.5" />
                      Contestants
                    </div>
                    <div className="mt-2 text-lg font-bold">
                      {joinedUsers}/{contestantLimit || "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Trophy className="h-3.5 w-3.5" />
                      Round type
                    </div>
                    <div className="mt-2 text-lg font-bold">
                      {selectedRoundConfig.isFinal
                        ? "Final"
                        : "Elimination"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ROUND RULES */}

              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
                <h3 className="font-semibold">
                  Round Configuration
                </h3>

                <div className="mt-4 space-y-3">
                  {!selectedRoundConfig.isFinal && (
                    <>
                      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <span className="text-sm text-white/45">
                          Exit number
                        </span>

                        <span className="text-sm font-semibold">
                          {getRoundExitNumber(
                            selectedRoundConfig.config,
                          ) ?? "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <span className="text-sm text-white/45">
                          Exit reward
                        </span>

                        <span className="text-sm font-semibold">
                          {getReward(
                            (selectedRoundConfig.config as RoundInformation)
                              ?.exit_reward ??
                              (selectedRoundConfig.config as RoundInformation)
                                ?.exitReward,
                          )}
                        </span>
                      </div>
                    </>
                  )}

                  {selectedRoundConfig.isFinal && (
                    <>
                      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <span className="text-sm text-white/45">
                          1st position reward
                        </span>

                        <span className="text-sm font-semibold text-amber-300">
                          {getReward(
                            (selectedRoundConfig.config as FinalRoundInformation)
                              ?.first_position_reward ??
                              (selectedRoundConfig.config as FinalRoundInformation)
                                ?.firstPositionReward,
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <span className="text-sm text-white/45">
                          2nd position reward
                        </span>

                        <span className="text-sm font-semibold">
                          {getReward(
                            (selectedRoundConfig.config as FinalRoundInformation)
                              ?.second_position_reward ??
                              (selectedRoundConfig.config as FinalRoundInformation)
                                ?.secondPositionReward,
                          )}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="pt-1">
                    <div className="text-xs uppercase tracking-wider text-white/30">
                      Difficulty breakdown
                    </div>

                    <p className="mt-2 text-sm leading-6 text-white/55">
                      {getDifficultySummary(
                        selectedRoundConfig.config,
                      ) || "No difficulty breakdown configured."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            QUESTIONS ERROR
            ================================================== */}

        {questionsError && (
          <section className="mb-6">
            <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.06] p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                <div>
                  <h3 className="font-semibold text-red-200">
                    Unable to load questions
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-red-200/60">
                    {questionsError}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      fetchRoundQuestions(
                        selectedRound,
                      )
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-200 transition hover:bg-red-400/15"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry round
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================
            QUESTIONS
            ================================================== */}

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {selectedRoundConfig?.label ?? "Round Questions"}
              </h2>

              <p className="mt-1 text-sm text-white/45">
                Questions returned by the Quiz Board API for
                round {selectedRound}.
              </p>
            </div>

            {!questionsLoading &&
              questions.length > 0 && (
                <div className="text-sm text-white/40">
                  Showing{" "}
                  <span className="font-semibold text-white/70">
                    {questions.length}
                  </span>{" "}
                  questions
                </div>
              )}
          </div>

          {/* LOADING QUESTIONS */}

          {questionsLoading && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />

                <p className="mt-4 text-sm font-medium text-white/70">
                  Loading {selectedRoundConfig?.label ?? "round"}{" "}
                  questions...
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Fetching questions from the Quiz Board
                  backend.
                </p>
              </div>
            </div>
          )}

          {/* EMPTY */}

          {!questionsLoading &&
            !questionsError &&
            questions.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-12">
                <div className="mx-auto max-w-md text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05]">
                    <FileQuestion className="h-7 w-7 text-white/25" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    No questions found
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    The API did not return any questions for{" "}
                    {selectedRoundConfig?.label ??
                      `Round ${selectedRound}`}
                    .
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      fetchRoundQuestions(
                        selectedRound,
                      )
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium transition hover:bg-white/[0.1]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reload questions
                  </button>
                </div>
              </div>
            )}

          {/* QUESTION LIST */}

          {!questionsLoading &&
            questions.length > 0 && (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <article
                    key={question.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]"
                  >
                    {/* QUESTION HEADER */}

                    <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-sm font-bold text-blue-300">
                          {question.number || index + 1}
                        </div>

                        <div>
                          <div className="text-sm font-semibold">
                            Question{" "}
                            {question.number ||
                              index + 1}
                          </div>

                          <div className="mt-0.5 text-[11px] text-white/30">
                            ID: {question.id}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {question.difficulty && (
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/55">
                            {question.difficulty}
                          </span>
                        )}

                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                          Loaded
                        </span>
                      </div>
                    </div>

                    {/* QUESTION BODY */}

                    <div className="p-5">
                      <div className="rounded-2xl border border-white/10 bg-black/10 p-5">
                        <p className="whitespace-pre-wrap text-[15px] font-medium leading-7 text-white/90">
                          {question.text}
                        </p>
                      </div>

                      {/* OPTIONS */}

                      {question.options.length > 0 && (
                        <div className="mt-5">
                          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
                            Answer Options
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            {question.options.map(
                              (option, optionIndex) => (
                                <div
                                  key={`${question.id}-${option.label}-${optionIndex}`}
                                  className={`rounded-2xl border p-4 transition ${
                                    option.isCorrect
                                      ? "border-emerald-400/30 bg-emerald-400/[0.07]"
                                      : "border-white/10 bg-white/[0.02]"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                        option.isCorrect
                                          ? "bg-emerald-400/15 text-emerald-300"
                                          : "bg-white/[0.06] text-white/50"
                                      }`}
                                    >
                                      {option.label ||
                                        String.fromCharCode(
                                          65 +
                                            optionIndex,
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="whitespace-pre-wrap text-sm leading-6 text-white/75">
                                        {option.value ||
                                          "Option value unavailable"}
                                      </p>

                                      {option.isCorrect && (
                                        <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                                          <CheckCircle2 className="h-3.5 w-3.5" />
                                          Correct answer
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* CORRECT ANSWERS FALLBACK */}

                      {question.options.length === 0 &&
                        question.correctAnswers.length >
                          0 && (
                          <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                              <CheckCircle2 className="h-4 w-4" />
                              Correct Answer
                            </div>

                            <p className="mt-2 text-sm leading-6 text-white/75">
                              {question.correctAnswers.join(
                                ", ",
                              )}
                            </p>
                          </div>
                        )}

                      {/* EXPLANATION */}

                      {question.explanation && (
                        <div className="mt-5 rounded-2xl border border-blue-400/15 bg-blue-400/[0.04] p-4">
                          <div className="text-xs font-semibold uppercase tracking-wider text-blue-300/80">
                            Explanation
                          </div>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/60">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>

        {/* ==================================================
            BOTTOM SUMMARY
            ================================================== */}

        <section className="mt-8 pb-10">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />

                  <h3 className="font-semibold">
                    Question Review
                  </h3>
                </div>

                <p className="mt-1 text-sm leading-6 text-white/45">
                  You are currently reviewing{" "}
                  {selectedRoundConfig?.label ??
                    `Round ${selectedRound}`}
                  . Use the round selector above to review
                  every configured round.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-white/30">
                    Round
                  </div>

                  <div className="mt-1 text-sm font-bold">
                    {selectedRound}/{totalRounds || "—"}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/10 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-white/30">
                    Loaded
                  </div>

                  <div className="mt-1 text-sm font-bold">
                    {questions.length}
                  </div>
                </div>

                <div className="col-span-2 rounded-xl border border-white/10 bg-black/10 px-4 py-3 sm:col-span-1">
                  <div className="text-[10px] uppercase tracking-wider text-white/30">
                    Room
                  </div>

                  <div className="mt-1 text-sm font-bold">
                    {roomId
                      ? roomIsFull
                        ? "Full"
                        : "Open"
                      : "Not Created"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}