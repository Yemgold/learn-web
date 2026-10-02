"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  Loader2,
  Trophy,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";

import { updateSolveAndWinContestQuestionAnswers } from "@/lib/api/solveAndWin"; 

/* =============================================================
   TYPES
============================================================= */

type GameState = "QUESTION" | "REWARD" | "WRONG" | "CASHED_OUT";

type ContestOption = {
  id?: string;
  _id?: string;
  label?: string;
  text?: string;
  value?: string;
  option?: string;
};

type ContestQuestion = {
  _id?: string;
  id?: string;
  questionId?: string;

  question?: string;
  text?: string;
  instruction?: string;
  content?: string;

  options?: ContestOption[] | string[];

  questionType?: string;
  isMultipleAnswer?: boolean;

  marks?: number;
  explanation?: string;
  explanationSteps?: string[];

  selectedOption?: string;

  /*
   * These are intentionally treated as optional compatibility
   * fields because different versions of the backend may expose
   * correctness information in different places.
   */
  isCorrect?: boolean;
  correctAnswer?: string;
  correctAnswers?: string[];

  subjectId?: string | {
    _id?: string;
    id?: string;
    name?: string;
  };
};

type ParticipationSubject = {
  subjectId?: string | {
    _id?: string;
    id?: string;
    name?: string;
  };

  questions?: ContestQuestion[];

  correctAnswers?: number;
  wrongAnswers?: number;
  unansweredQuestions?: number;

  score?: number;

  durationInSeconds?: number;
  remainingDurationInSeconds?: number;

  startedAt?: string;
  endsAt?: string;
  submittedAt?: string;
};

type Participation = {
  _id?: string;
  id?: string;
  participationId?: string;

  userId?: string;
  contestId?: string;

  subjects?: ParticipationSubject[];
  questions?: ContestQuestion[];

  totalQuestions?: number;

  correctAnswers?: number;
  wrongAnswers?: number;
  unansweredQuestions?: number;

  score?: number;
  percentage?: number;

  pointsSpent?: number;

  durationInSeconds?: number;
  remainingDurationInSeconds?: number;

  status?: string;

  startedAt?: string;
  endsAt?: string;
  submittedAt?: string;
};

type SolveAndWinStartResponse = {
  participation?: Participation;
  data?: unknown;
  result?: unknown;
  message?: string;
};

type SubjectConfig = {
  name: string;
  shortName: string;
  icon: string;
};

/* =============================================================
   SUBJECTS
============================================================= */

const SUBJECTS: Record<string, SubjectConfig> = {
  biology: {
    name: "Biology",
    shortName: "BIO",
    icon: "🧬",
  },

  chemistry: {
    name: "Chemistry",
    shortName: "CHEM",
    icon: "⚗️",
  },

  physics: {
    name: "Physics",
    shortName: "PHY",
    icon: "⚡",
  },

  mathematics: {
    name: "Mathematics",
    shortName: "MATH",
    icon: "📐",
  },

  english: {
    name: "English",
    shortName: "ENG",
    icon: "📚",
  },
};

/* =============================================================
   DEFAULT REWARD LADDER
=============================================================

   These are fallback display values.

   IMPORTANT:
   The backend should eventually return the authoritative
   reward for each correctly answered question.

============================================================= */

const DEFAULT_REWARDS = [
  0.0023,
  0.0046,
  0.0092,
  0.0184,
  0.0368,
  0.0736,
];

/* =============================================================
   UTILITIES
============================================================= */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(
  value: unknown,
  fallback = "",
): string {
  return typeof value === "string" && value.trim()
    ? value
    : fallback;
}

function getNumber(
  value: unknown,
  fallback = 0,
): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

function formatPoints(value: number) {
  return value.toFixed(4);
}





/* =============================================================
   RESPONSE EXTRACTION
============================================================= */

function extractParticipation(
  response: unknown,
): Participation | null {
  if (!isObject(response)) {
    return null;
  }

  const root = response as Record<string, unknown>;

  /*
   * Possible locations used by different versions of the
   * Solve & Win backend.
   */
  const candidates: unknown[] = [
    root.participation,
    root.data,
    root.result,
  ];

  for (const candidate of candidates) {
    if (!isObject(candidate)) {
      continue;
    }

    const nested =
      candidate as Record<string, unknown>;

    /*
     * Example:
     *
     * {
     *   data: {
     *     participation: {...}
     *   }
     * }
     */
    if (isObject(nested.participation)) {
      return nested.participation as Participation;
    }

    /*
     * Example:
     *
     * {
     *   data: {
     *     subjects: [...]
     *   }
     * }
     */
    if (
      Array.isArray(nested.subjects) ||
      Array.isArray(nested.questions) ||
      typeof nested.status === "string"
    ) {
      return nested as Participation;
    }
  }

  /*
   * Direct participation response.
   */
  if (
    Array.isArray(root.subjects) ||
    Array.isArray(root.questions) ||
    typeof root.status === "string"
  ) {
    return root as Participation;
  }

  return null;
}

/* =============================================================
   SUBJECT ID
============================================================= */

function getSubjectId(
  subjectId: ParticipationSubject["subjectId"],
): string {
  if (typeof subjectId === "string") {
    return subjectId.trim();
  }

  if (!isObject(subjectId)) {
    return "";
  }

  return (
    getString(subjectId._id) ||
    getString(subjectId.id)
  );
}

function getParticipationSubjectId(
  subject: ParticipationSubject,
): string {
  return getSubjectId(subject.subjectId);
}

/* =============================================================
   QUESTION ID
============================================================= */

function getQuestionId(
  question: ContestQuestion,
): string {
  return (
    getString(question._id) ||
    getString(question.id) ||
    getString(question.questionId)
  );
}

/* =============================================================
   QUESTION TEXT
============================================================= */

function getQuestionText(
  question: ContestQuestion,
): string {
  return (
    getString(question.question) ||
    getString(question.text) ||
    getString(question.content) ||
    ""
  );
}

/* =============================================================
   OPTION TEXT
============================================================= */

function getOptionLabel(
  option: ContestOption | string,
  index: number,
): string {
  if (typeof option === "string") {
    return String.fromCharCode(65 + index);
  }

  return (
    getString(option.label) ||
    String.fromCharCode(65 + index)
  );
}

function getOptionText(
  option: ContestOption | string,
): string {
  if (typeof option === "string") {
    return option;
  }

  return (
    getString(option.text) ||
    getString(option.value) ||
    getString(option.option) ||
    ""
  );
}

/* =============================================================
   EXPLANATION
============================================================= */

function getQuestionExplanation(
  question: ContestQuestion,
): string {
  if (
    typeof question.explanation === "string" &&
    question.explanation.trim()
  ) {
    return question.explanation;
  }

  if (
    Array.isArray(question.explanationSteps) &&
    question.explanationSteps.length > 0
  ) {
    return question.explanationSteps
      .filter(
        (step): step is string =>
          typeof step === "string",
      )
      .join(" ");
  }

  return "Review this question and try again.";
}

/* =============================================================
   QUESTIONS
============================================================= */

function extractQuestions(
  participation: Participation | null,
  normalizedSubjectId: string,
): ContestQuestion[] {
  if (!participation) {
    return [];
  }

  /*
   * -----------------------------------------------------------
   * CASE 1: QUESTIONS ARE DIRECTLY ON PARTICIPATION
   * -----------------------------------------------------------
   */

  const directQuestions =
    Array.isArray(participation.questions)
      ? participation.questions
      : [];

  if (directQuestions.length > 0) {
    return directQuestions.map(
      (question) => ({
        ...question,

        subjectId:
          question.subjectId ||
          normalizedSubjectId,
      }),
    );
  }

  /*
   * -----------------------------------------------------------
   * CASE 2: QUESTIONS ARE INSIDE SUBJECTS
   * -----------------------------------------------------------
   */

  const subjectQuestions: ContestQuestion[] = [];

  if (
    Array.isArray(participation.subjects)
  ) {
    for (const subject of participation.subjects) {
      const backendSubjectId =
        getParticipationSubjectId(
          subject,
        );

      const normalizedBackendSubjectId =
        backendSubjectId.toLowerCase().trim();

      /*
       * If we don't know the backend subject ID,
       * accept the subject as a compatibility fallback.
       */
      const matchesSubject =
        !normalizedSubjectId ||
        !normalizedBackendSubjectId ||
        normalizedBackendSubjectId ===
          normalizedSubjectId ||
        normalizedBackendSubjectId.includes(
          normalizedSubjectId,
        ) ||
        normalizedSubjectId.includes(
          normalizedBackendSubjectId,
        );

      if (
        !matchesSubject ||
        !Array.isArray(subject.questions)
      ) {
        continue;
      }

      for (const question of subject.questions) {
        subjectQuestions.push({
          ...question,

          subjectId:
            question.subjectId ||
            backendSubjectId ||
            normalizedSubjectId,
        });
      }
    }
  }

  /*
   * -----------------------------------------------------------
   * CASE 3: NO SUBJECT MATCH
   * -----------------------------------------------------------
   *
   * Some older backend responses may contain subjects but
   * omit subjectId from them.
   *
   * In that case, use the first subject containing questions.
   */

  if (
    subjectQuestions.length === 0 &&
    Array.isArray(participation.subjects)
  ) {
    const firstSubjectWithQuestions =
      participation.subjects.find(
        (subject) =>
          Array.isArray(subject.questions) &&
          subject.questions.length > 0,
      );

    if (
      firstSubjectWithQuestions &&
      Array.isArray(
        firstSubjectWithQuestions.questions,
      )
    ) {
      const fallbackSubjectId =
        getParticipationSubjectId(
          firstSubjectWithQuestions,
        );

      return firstSubjectWithQuestions.questions.map(
        (question) => ({
          ...question,

          subjectId:
            question.subjectId ||
            fallbackSubjectId ||
            normalizedSubjectId,
        }),
      );
    }
  }

  return subjectQuestions;
}

/* =============================================================
   BACKEND RESULT EXTRACTION
============================================================= */

type AnswerResult = {
  correct: boolean;
  reward: number;
  totalWinnings: number;
  correctAnswer: string | null;
  explanation: string;
};

/*
 * Extract the deepest useful response object.
 *
 * Supported:
 *
 * response
 * response.data
 * response.result
 * response.data.data
 * response.data.result
 */
function extractResponseObject(
  response: unknown,
): Record<string, unknown> {
  if (!isObject(response)) {
    return {};
  }

  let current =
    response as Record<string, unknown>;

  /*
   * Walk through a small number of common wrapper levels.
   *
   * This avoids making assumptions about the exact
   * Solve & Win API response shape.
   */
  for (let index = 0; index < 4; index += 1) {
    if (isObject(current.data)) {
      current =
        current.data as Record<
          string,
          unknown
        >;

      continue;
    }

    if (isObject(current.result)) {
      current =
        current.result as Record<
          string,
          unknown
        >;

      continue;
    }

    break;
  }

  return current;
}

/* =============================================================
   NUMBER EXTRACTION
============================================================= */

function getFirstNumber(
  ...values: unknown[]
): number | null {
  for (const value of values) {
    if (typeof value === "number") {
      if (Number.isFinite(value)) {
        return value;
      }

      continue;
    }

    if (typeof value === "string") {
      const parsed =
        Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

/* =============================================================
   BOOLEAN EXTRACTION
============================================================= */

function getBoolean(
  value: unknown,
): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized =
    value.trim().toLowerCase();

  if (
    normalized === "true" ||
    normalized === "correct" ||
    normalized === "yes"
  ) {
    return true;
  }

  if (
    normalized === "false" ||
    normalized === "incorrect" ||
    normalized === "no"
  ) {
    return false;
  }

  return null;
}

/* =============================================================
   BACKEND ANSWER RESULT
============================================================= */

function extractAnswerResult(
  response: unknown,
  question: ContestQuestion,
  selectedAnswer: string,
  currentTotal: number,
  currentReward: number,
): AnswerResult {
  const root =
    extractResponseObject(response);

  /*
   * -----------------------------------------------------------
   * CORRECTNESS
   * -----------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Do NOT use `correctAnswer` as the correctness flag.
   *
   * `correctAnswer: "B"` means the correct option is B.
   * It does NOT mean the answer is true.
   */

  let correct =
    getBoolean(root.correct) ??
    getBoolean(root.isCorrect) ??
    getBoolean(root.correct_response) ??
    getBoolean(root.answerCorrect) ??
    false;

  /*
   * Some backend responses may nest the answer result.
   */
  if (isObject(root.answerResult)) {
    const answerResult =
      root.answerResult as Record<
        string,
        unknown
      >;

    const nestedCorrect =
      getBoolean(
        answerResult.correct,
      ) ??
      getBoolean(
        answerResult.isCorrect,
      );

    if (nestedCorrect !== null) {
      correct = nestedCorrect;
    }
  }

  /*
   * If the question itself already contains an authoritative
   * correctness value, respect it.
   */
  if (
    typeof question.isCorrect === "boolean"
  ) {
    correct = question.isCorrect;
  }

  /*
   * -----------------------------------------------------------
   * CORRECT ANSWER
   * -----------------------------------------------------------
   */

  let backendCorrectAnswer =
    getString(
      root.correctAnswer,
    ) ||
    getString(
      root.correctOption,
    ) ||
    getString(
      root.answerKey,
    );

  if (
    !backendCorrectAnswer &&
    Array.isArray(root.correctAnswers)
  ) {
    backendCorrectAnswer =
      getString(
        root.correctAnswers[0],
      );
  }

  /*
   * Nested answer result.
   */
  if (
    !backendCorrectAnswer &&
    isObject(root.answerResult)
  ) {
    const answerResult =
      root.answerResult as Record<
        string,
        unknown
      >;

    backendCorrectAnswer =
      getString(
        answerResult.correctAnswer,
      ) ||
      getString(
        answerResult.correctOption,
      ) ||
      getString(
        answerResult.answerKey,
      );

    if (
      !backendCorrectAnswer &&
      Array.isArray(
        answerResult.correctAnswers,
      )
    ) {
      backendCorrectAnswer =
        getString(
          answerResult.correctAnswers[0],
        );
    }
  }

  /*
   * Fall back to the question if the backend included
   * correctness information there.
   */
  if (!backendCorrectAnswer) {
    backendCorrectAnswer =
      getString(
        question.correctAnswer,
      );
  }

  if (
    !backendCorrectAnswer &&
    Array.isArray(
      question.correctAnswers,
    )
  ) {
    backendCorrectAnswer =
      getString(
        question.correctAnswers[0],
      );
  }

  /*
   * -----------------------------------------------------------
   * REWARD
   * -----------------------------------------------------------
   */

  const backendReward =
    getFirstNumber(
      root.reward,
      root.rewardAmount,
      root.rewardPoints,
      root.pointsAwarded,
      root.earnedReward,
      root.earnedPoints,
    );

  let reward =
    backendReward !== null
      ? backendReward
      : correct
        ? currentReward
        : 0;

  /*
   * Never allow a negative reward.
   */
  if (reward < 0) {
    reward = 0;
  }

  /*
   * -----------------------------------------------------------
   * TOTAL WINNINGS
   * -----------------------------------------------------------
   */

  const backendTotal =
    getFirstNumber(
      root.totalWinnings,
      root.totalReward,
      root.totalPoints,
      root.currentWinnings,
      root.currentReward,
      root.balance,
      root.score,
    );

  let totalWinnings =
    backendTotal !== null
      ? backendTotal
      : currentTotal;

  /*
   * If backend did not return the running total but the
   * answer was correct, calculate the new total locally.
   *
   * The backend remains authoritative whenever it returns
   * a total.
   */
  if (
    backendTotal === null &&
    correct
  ) {
    totalWinnings =
      currentTotal + reward;
  }

  /*
   * -----------------------------------------------------------
   * EXPLANATION
   * -----------------------------------------------------------
   */

  let explanation =
    getString(
      root.explanation,
    ) ||
    getString(
      root.answerExplanation,
    ) ||
    getString(
      root.solution,
    );

  /*
   * Nested answer result explanation.
   */
  if (
    !explanation &&
    isObject(root.answerResult)
  ) {
    const answerResult =
      root.answerResult as Record<
        string,
        unknown
      >;

    explanation =
      getString(
        answerResult.explanation,
      ) ||
      getString(
        answerResult.answerExplanation,
      ) ||
      getString(
        answerResult.solution,
      );
  }

  if (!explanation) {
    explanation =
      getQuestionExplanation(
        question,
      );
  }

  return {
    correct,

    reward,

    totalWinnings,

    correctAnswer:
      backendCorrectAnswer || null,

    explanation,
  };
}

/* =============================================================
   API ERROR
============================================================= */

function getApiErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (isObject(error)) {
    const message =
      getString(error.message) ||
      getString(error.error);

    if (message) {
      return message;
    }

    if (isObject(error.data)) {
      const data =
        error.data as Record<
          string,
          unknown
        >;

      const nestedMessage =
        getString(data.message) ||
        getString(data.error);

      if (nestedMessage) {
        return nestedMessage;
      }
    }
  }

  return "Something went wrong. Please try again.";
}

/* =============================================================
   MAIN PAGE
============================================================= */

export default function SolveAndWinCbtPlayPage() {
  const params = useParams();
  const router = useRouter();

  const rawContestId =
    params?.contestId;

  const contestId =
    Array.isArray(rawContestId)
      ? rawContestId[0]
      : rawContestId;

  const [participation, setParticipation] =
    useState<Participation | null>(null);

  const [questions, setQuestions] =
    useState<ContestQuestion[]>([]);

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [gameState, setGameState] =
    useState<GameState>(
      "QUESTION",
    );

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [totalWinnings, setTotalWinnings] =
    useState(0);

  const [lastReward, setLastReward] =
    useState(0);

  const [
    lastCorrectAnswer,
    setLastCorrectAnswer,
  ] = useState<string | null>(null);

  const [
    lastExplanation,
    setLastExplanation,
  ] = useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [rewardLadder, setRewardLadder] =
    useState<number[]>(
      DEFAULT_REWARDS,
    );

  /*
   * -----------------------------------------------------------
   * LOAD EXISTING PARTICIPATION
   * -----------------------------------------------------------
   */

  useEffect(() => {
    if (!contestId) {
      setError(
        "Contest ID is missing.",
      );

      setIsLoading(false);

      return;
    }

    try {
      const storageKey =
        `solve-and-win-start-${contestId}`;

      const raw =
        sessionStorage.getItem(
          storageKey,
        );

      if (!raw) {
        setError(
          "Your Solve & Win session could not be found. Please start the contest again.",
        );

        setIsLoading(false);

        return;
      }

      /*
       * Treat the stored response as unknown first.
       *
       * This prevents TypeScript from assuming that every
       * backend version has the same response fields.
       */
      const parsed: unknown =
        JSON.parse(raw);

      /*
       * Extract participation.
       */
      const extracted =
        extractParticipation(
          parsed,
        );

      if (!extracted) {
        setError(
          "The Solve & Win session response is invalid.",
        );

        setIsLoading(false);

        return;
      }

      setParticipation(
        extracted,
      );

      /*
       * ---------------------------------------------------------
       * DETERMINE SUBJECT
       * ---------------------------------------------------------
       */

      const firstSubject =
        Array.isArray(
          extracted.subjects,
        )
          ? extracted.subjects.find(
              (item) =>
                Boolean(
                  getParticipationSubjectId(
                    item,
                  ),
                ),
            )
          : undefined;

      const normalizedSubject =
        getParticipationSubjectId(
          firstSubject ?? {},
        )
          .trim()
          .toLowerCase();

      /*
       * ---------------------------------------------------------
       * EXTRACT QUESTIONS
       * ---------------------------------------------------------
       */

      const extractedQuestions =
        extractQuestions(
          extracted,
          normalizedSubject,
        );

      setQuestions(
        extractedQuestions,
      );

      /*
       * ---------------------------------------------------------
       * EXTRACT START RESPONSE DATA
       * ---------------------------------------------------------
       */

      const responseRoot =
        extractResponseObject(
          parsed,
        );

      /*
       * ---------------------------------------------------------
       * REWARD LADDER
       * ---------------------------------------------------------
       *
       * Supported backend fields:
       *
       * rewardLadder
       * rewards
       * reward
       *
       * We do NOT access them directly on
       * SolveAndWinStartResponse.
       */

      const rewardCandidates: unknown[] = [
        responseRoot.rewardLadder,
        responseRoot.rewards,
        responseRoot.reward,
      ];

      let backendRewardLadderFound =
        false;

      for (
        const candidate of rewardCandidates
      ) {
        if (
          !Array.isArray(candidate)
        ) {
          continue;
        }

        const numericRewards =
          candidate
            .map((value) => {
              if (
                typeof value ===
                "number"
              ) {
                return value;
              }

              if (
                typeof value ===
                "string"
              ) {
                const parsedValue =
                  Number(value);

                return Number.isFinite(
                  parsedValue,
                )
                  ? parsedValue
                  : null;
              }

              return null;
            })
            .filter(
              (
                value,
              ): value is number =>
                value !== null &&
                Number.isFinite(
                  value,
                ),
            );

        if (
          numericRewards.length >
          0
        ) {
          setRewardLadder(
            numericRewards,
          );

          backendRewardLadderFound =
            true;

          break;
        }
      }

      /*
       * If the backend did not provide a reward ladder,
       * retain DEFAULT_REWARDS.
       */
      if (
        !backendRewardLadderFound
      ) {
        setRewardLadder(
          DEFAULT_REWARDS,
        );
      }

      /*
       * ---------------------------------------------------------
       * EXISTING WINNINGS
       * ---------------------------------------------------------
       */

      const existingWinnings =
        getFirstNumber(
          responseRoot.totalWinnings,
          responseRoot.totalReward,
          responseRoot.totalPoints,
          responseRoot.currentWinnings,
          responseRoot.score,
        );

      if (
        existingWinnings !== null &&
        existingWinnings >= 0
      ) {
        setTotalWinnings(
          existingWinnings,
        );
      }

      /*
       * ---------------------------------------------------------
       * VALIDATE QUESTIONS
       * ---------------------------------------------------------
       */

      if (
        extractedQuestions.length ===
        0
      ) {
        setError(
          "No questions were found for this Solve & Win session.",
        );
      }

      setIsLoading(false);
    } catch (loadError) {
      console.error(
        "Failed to load Solve & Win session:",
        loadError,
      );

      setError(
        "Unable to load your Solve & Win session.",
      );

      setIsLoading(false);
    }
  }, [contestId]);




  

  /* ===========================================================
     CURRENT SUBJECT
  =========================================================== */

  const normalizedSubjectId =
    useMemo(() => {
      if (
        participation?.subjects &&
        participation.subjects.length > 0
      ) {
        const subjectId =
          getParticipationSubjectId(
            participation.subjects[0],
          );

        if (subjectId) {
          return subjectId.toLowerCase();
        }
      }

      const question =
        questions[0];

      if (question?.subjectId) {
        const questionSubject =
          getSubjectId(
            question.subjectId,
          );

        if (questionSubject) {
          return questionSubject.toLowerCase();
        }
      }

      return "biology";
    }, [participation, questions]);

  const subject =
    SUBJECTS[normalizedSubjectId] ??
    SUBJECTS.biology;

  /* ===========================================================
     CURRENT QUESTION
  =========================================================== */

  const currentQuestion =
    questions[currentQuestionIndex];

  /* ===========================================================
     CURRENT REWARD
  =========================================================== */

  const currentReward =
    rewardLadder[currentQuestionIndex] ??
    rewardLadder[
      rewardLadder.length - 1
    ] ??
    0;

  /* ===========================================================
     PROGRESS
  =========================================================== */

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) /
          questions.length) *
        100
      : 0;

  /* ===========================================================
     COMPLETED REWARDS
  =========================================================== */

  const completedRewards =
    useMemo(() => {
      return rewardLadder.slice(
        0,
        currentQuestionIndex,
      );
    }, [
      rewardLadder,
      currentQuestionIndex,
    ]);

  /* ===========================================================
     ANSWER QUESTION
  =========================================================== */

  const handleAnswer = useCallback(
    async (answer: string) => {
      if (
        isSubmitting ||
        gameState !== "QUESTION" ||
        !currentQuestion ||
        !contestId
      ) {
        return;
      }

      const questionId =
        getQuestionId(
          currentQuestion,
        );

      if (!questionId) {
        setError(
          "This question does not have a valid question ID.",
        );
        return;
      }

      const subjectId =
        getSubjectId(
          currentQuestion.subjectId,
        ) ||
        normalizedSubjectId;

      setSelectedAnswer(answer);
      setIsSubmitting(true);
      setError(null);
      setLastCorrectAnswer(null);
      setLastExplanation("");

      try {
        /*
         * IMPORTANT:
         *
         * We intentionally send ONE answer immediately.
         *
         * This replaces the old background queue.
         *
         * The existing backend helper is still used so the
         * current backend contract remains compatible.
         */
        const response =
          await updateSolveAndWinContestQuestionAnswers(
            contestId,
            subjectId,
            {
              answers: [
                {
                  questionId,
                  selectedOption: answer,
                },
              ],
            },
          );

        /*
         * Interpret the backend result.
         */
        const result =
          extractAnswerResult(
            response,
            currentQuestion,
            answer,
            totalWinnings,
            currentReward,
          );

        if (result.correct) {
          const actualReward =
            result.reward > 0
              ? result.reward
              : currentReward;

          const actualTotal =
            result.totalWinnings >
            totalWinnings
              ? result.totalWinnings
              : totalWinnings +
                actualReward;

          setLastReward(
            actualReward,
          );

          setTotalWinnings(
            actualTotal,
          );

          setLastExplanation(
            result.explanation,
          );

          setGameState(
            "REWARD",
          );

          return;
        }

        /*
         * WRONG
         */
        setLastCorrectAnswer(
          result.correctAnswer,
        );

        setLastExplanation(
          result.explanation,
        );

        setGameState(
          "WRONG",
        );
      } catch (answerError) {
        console.error(
          "Solve & Win answer error:",
          answerError,
        );

        setError(
          getApiErrorMessage(
            answerError,
          ),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      gameState,
      currentQuestion,
      contestId,
      normalizedSubjectId,
      totalWinnings,
      currentReward,
    ],
  );

  /* ===========================================================
     WIN MORE
  =========================================================== */

  const handleWinMore = useCallback(() => {
    if (
      currentQuestionIndex >=
      questions.length - 1
    ) {
      setGameState(
        "CASHED_OUT",
      );

      return;
    }

    setCurrentQuestionIndex(
      (previous) =>
        previous + 1,
    );

    setSelectedAnswer(null);
    setLastReward(0);
    setLastCorrectAnswer(null);
    setLastExplanation("");
    setError(null);
    setGameState("QUESTION");
  }, [
    currentQuestionIndex,
    questions.length,
  ]);

  /* ===========================================================
     TRY AGAIN
  =========================================================== */

  const handleTryAgain = useCallback(() => {
    setSelectedAnswer(null);
    setLastCorrectAnswer(null);
    setLastExplanation("");
    setError(null);
    setGameState("QUESTION");
  }, []);

  /* ===========================================================
     CASH OUT
     -----------------------------------------------------------
     IMPORTANT:
     This currently completes the frontend state.

     Do NOT credit the wallet from the browser.

     Connect your existing backend cash-out endpoint here.
  =========================================================== */

  const handleCashOut = useCallback(() => {
    /*
     * Backend cash-out should eventually happen here.
     *
     * Example architecture:
     *
     * await cashOutSolveAndWinContest(
     *   contestId,
     *   participationId
     * );
     *
     * The backend must:
     *
     * 1. Lock the session.
     * 2. Prevent additional answers.
     * 3. Calculate authoritative winnings.
     * 4. Credit the user's wallet.
     * 5. Return final wallet/session state.
     *
     * We intentionally do not invent an endpoint here.
     */

    setGameState(
      "CASHED_OUT",
    );
  }, []);

  /* ===========================================================
     RESTART
  =========================================================== */

  const handleRestart = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setLastReward(0);
    setLastCorrectAnswer(null);
    setLastExplanation("");
    setTotalWinnings(0);
    setError(null);
    setGameState("QUESTION");
  }, []);

  /* ===========================================================
     LOADING
  =========================================================== */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#070b14] text-white">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-violet-400" />

            <p className="mt-4 text-sm text-slate-400">
              Loading Solve & Win...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* ===========================================================
     ERROR
  =========================================================== */

  if (
    error &&
    questions.length === 0
  ) {
    return (
      <main className="min-h-screen bg-[#070b14] text-white">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-red-500/20 bg-[#0d1320] p-8 text-center shadow-2xl">
            <XCircle className="mx-auto h-12 w-12 text-red-400" />

            <h1 className="mt-5 text-2xl font-black">
              Unable to Load Contest
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/student/solve-and-win-cbt",
                )
              }
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 font-bold transition hover:bg-violet-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Subjects
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ===========================================================
     NO CURRENT QUESTION
  =========================================================== */

  if (!currentQuestion) {
    return (
      <main className="min-h-screen bg-[#070b14] text-white">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">
            <p className="text-slate-400">
              No question available.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/student/solve-and-win-cbt",
                )
              }
              className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold"
            >
              Choose Subject
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* ===========================================================
     MAIN UI
  =========================================================== */

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="mb-6 flex items-center justify-between gap-4">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/student/solve-and-win-cbt",
              )
            }
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />

            <span className="hidden sm:inline">
              Subjects
            </span>
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
              <span className="text-lg">
                {subject.icon}
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                Solve & Win CBT
              </p>

              <h1 className="text-base font-black sm:text-lg">
                {subject.name}
              </h1>
            </div>

          </div>

          {/* WALLET */}

          <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 sm:px-4">

            <Coins className="h-4 w-4 text-amber-300" />

            <span className="text-sm font-black text-amber-200">
              {formatPoints(
                totalWinnings,
              )}
            </span>

            <span className="hidden text-xs text-amber-200/60 sm:inline">
              CBT
            </span>

          </div>

        </header>

        {/* ===================================================
            ERROR BANNER
        =================================================== */}

        {error && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3">

            <div className="flex items-center gap-3">
              <XCircle className="h-4 w-4 shrink-0 text-red-400" />

              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setError(null)
              }
              className="text-xs font-bold text-red-400 hover:text-red-300"
            >
              Dismiss
            </button>

          </div>
        )}

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <section className="mb-6">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-xs font-medium text-slate-500">
              Question{" "}
              {currentQuestionIndex + 1}{" "}
              of{" "}
              {questions.length}
            </span>

            <span className="text-xs font-bold text-violet-400">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </section>

        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* =================================================
              MAIN GAME
          ================================================= */}

          <section>

            {gameState === "QUESTION" && (
              <QuestionScreen
                subject={subject}
                question={currentQuestion}
                selectedAnswer={
                  selectedAnswer
                }
                isSubmitting={
                  isSubmitting
                }
                currentReward={
                  currentReward
                }
                onAnswer={
                  handleAnswer
                }
              />
            )}

            {gameState === "REWARD" && (
              <RewardScreen
                reward={
                  lastReward
                }
                totalWinnings={
                  totalWinnings
                }
                questionNumber={
                  currentQuestionIndex + 1
                }
                totalQuestions={
                  questions.length
                }
                onCashOut={
                  handleCashOut
                }
                onWinMore={
                  handleWinMore
                }
              />
            )}

            {gameState === "WRONG" && (
              <WrongScreen
                selectedAnswer={
                  selectedAnswer
                }
                correctAnswer={
                  lastCorrectAnswer
                }
                explanation={
                  lastExplanation ||
                  getQuestionExplanation(
                    currentQuestion,
                  )
                }
                totalWinnings={
                  totalWinnings
                }
                onTryAgain={
                  handleTryAgain
                }
                onCashOut={
                  handleCashOut
                }
              />
            )}

            {gameState === "CASHED_OUT" && (
              <CashOutScreen
                subject={
                  subject
                }
                totalWinnings={
                  totalWinnings
                }
                onRestart={
                  handleRestart
                }
                onSubjects={() =>
                  router.push(
                    "/student/solve-and-win-cbt",
                  )
                }
              />
            )}

          </section>

          {/* =================================================
              LADDER
          ================================================= */}

          <aside>
            <CbtLadder
              currentQuestionIndex={
                currentQuestionIndex
              }
              totalWinnings={
                totalWinnings
              }
              completedRewards={
                completedRewards
              }
              rewards={
                rewardLadder
              }
            />
          </aside>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="mt-8 flex items-center justify-center">

          <p className="text-center text-xs text-slate-600">
            Answer each question correctly to
            increase your CBT Points.
          </p>

        </footer>

      </div>
    </main>
  );
}

/* =============================================================
   QUESTION SCREEN
============================================================= */

function QuestionScreen({
  subject,
  question,
  selectedAnswer,
  isSubmitting,
  currentReward,
  onAnswer,
}: {
  subject: SubjectConfig;
  question: ContestQuestion;
  selectedAnswer: string | null;
  isSubmitting: boolean;
  currentReward: number;
  onAnswer: (
    answer: string,
  ) => void;
}) {
  const options =
    Array.isArray(question.options)
      ? question.options
      : [];

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0d1320] p-5 shadow-2xl sm:p-7">

      {/* TOP LABEL */}

      <div className="mb-6 flex items-center justify-between gap-3">

        <div className="flex items-center gap-2">

          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-lg">
            {subject.icon}
          </span>

          <div>
            <p className="text-xs text-slate-500">
              Subject
            </p>

            <p className="text-sm font-bold">
              {subject.name}
            </p>
          </div>

        </div>

        <div className="rounded-xl border border-amber-400/10 bg-amber-400/5 px-3 py-2">

          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Win
          </p>

          <p className="text-sm font-black text-amber-300">
            +{formatPoints(
              currentReward,
            )}
          </p>

        </div>

      </div>

      {/* QUESTION */}

      <div className="mb-7">

        {question.instruction && (
          <p className="mb-3 text-sm text-slate-500">
            {question.instruction}
          </p>
        )}

        <span className="mb-3 inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">
          Question
        </span>

        <h2 className="text-xl font-black leading-relaxed sm:text-2xl">
          {getQuestionText(
            question,
          )}
        </h2>

      </div>

      {/* OPTIONS */}

      <div className="space-y-3">

        {options.map(
          (
            option,
            index,
          ) => {
            const label =
              getOptionLabel(
                option,
                index,
              );

            const text =
              getOptionText(
                option,
              );

            const selected =
              selectedAnswer ===
              label;

            return (
              <button
                key={`${label}-${index}`}
                type="button"
                disabled={
                  isSubmitting
                }
                onClick={() =>
                  onAnswer(
                    label,
                  )
                }
                className={[
                  "group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200",
                  selected
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-slate-800 bg-slate-900/50 hover:border-violet-500/50 hover:bg-violet-500/5",
                  isSubmitting
                    ? "cursor-wait opacity-70"
                    : "cursor-pointer",
                ].join(" ")}
              >

                <span
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition",
                    selected
                      ? "border-violet-500 bg-violet-500 text-white"
                      : "border-slate-700 bg-slate-800 text-slate-300 group-hover:border-violet-500/50 group-hover:text-white",
                  ].join(" ")}
                >
                  {label}
                </span>

                <span className="flex-1 text-sm font-semibold leading-6 text-slate-200 sm:text-base">
                  {text}
                </span>

                {isSubmitting &&
                selected ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-violet-300" />
                ) : (
                  <ArrowRight
                    className={[
                      "h-5 w-5 shrink-0 transition",
                      selected
                        ? "text-violet-300"
                        : "text-slate-700 group-hover:text-violet-400",
                    ].join(" ")}
                  />
                )}

              </button>
            );
          },
        )}

      </div>

      {/* BOTTOM INFO */}

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">

        <Zap className="h-3.5 w-3.5" />

        <span>
          Choose the correct answer
          to win CBT Points
        </span>

      </div>

    </div>
  );
}

/* =============================================================
   REWARD SCREEN
============================================================= */

function RewardScreen({
  reward,
  totalWinnings,
  questionNumber,
  totalQuestions,
  onCashOut,
  onWinMore,
}: {
  reward: number;
  totalWinnings: number;
  questionNumber: number;
  totalQuestions: number;
  onCashOut: () => void;
  onWinMore: () => void;
}) {
  const hasMore =
    questionNumber <
    totalQuestions;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0c1715] p-6 shadow-2xl sm:p-10">

      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-8 ring-emerald-500/5">

          <CheckCircle2 className="h-10 w-10 text-emerald-400" />

        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
          Correct Answer
        </p>

        <h2 className="mt-3 text-3xl font-black sm:text-4xl">
          Congratulations! 🎉
        </h2>

        <p className="mt-4 text-sm text-slate-400">
          You have won
        </p>

        <div className="my-4 text-4xl font-black text-amber-300 sm:text-5xl">
          +{formatPoints(
            reward,
          )}
        </div>

        <div className="mx-auto flex max-w-sm items-center justify-center gap-2 rounded-2xl border border-amber-400/10 bg-amber-400/5 px-5 py-3">

          <Coins className="h-5 w-5 text-amber-300" />

          <span className="text-sm text-slate-400">
            Total:
          </span>

          <span className="font-black text-amber-200">
            {formatPoints(
              totalWinnings,
            )}{" "}
            CBT
          </span>

        </div>

        <div className="mx-auto mt-8 max-w-md">

          <p className="mb-4 text-sm font-bold text-white">
            Cash Out Or Win More?
          </p>

          <div className="grid gap-3 sm:grid-cols-2">

            <button
              type="button"
              onClick={
                onCashOut
              }
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-5 font-bold transition hover:border-slate-500 hover:bg-slate-800"
            >
              <Wallet className="h-5 w-5" />

              Cash Out
            </button>

            <button
              type="button"
              onClick={
                onWinMore
              }
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 font-bold shadow-lg shadow-violet-600/20 transition hover:bg-violet-500"
            >
              {hasMore
                ? "Win More"
                : "Finish"}

              <ArrowRight className="h-5 w-5" />
            </button>

          </div>

          {hasMore && (
            <p className="mt-4 text-xs text-slate-600">
              Continue to the next
              question to increase
              your winnings.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   WRONG SCREEN
============================================================= */

function WrongScreen({
  selectedAnswer,
  correctAnswer,
  explanation,
  totalWinnings,
  onTryAgain,
  onCashOut,
}: {
  selectedAnswer: string | null;
  correctAnswer: string | null;
  explanation: string;
  totalWinnings: number;
  onTryAgain: () => void;
  onCashOut: () => void;
}) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-[#170d12] p-6 shadow-2xl sm:p-10">

      <div className="text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">

          <XCircle className="h-10 w-10 text-red-400" />

        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
          Incorrect Answer
        </p>

        <h2 className="mt-3 text-3xl font-black">
          Keep Learning 💪
        </h2>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-left">

          <p className="text-xs text-slate-500">
            Your answer
          </p>

          <p className="mt-1 font-bold text-red-300">
            {selectedAnswer ??
              "-"}
          </p>

          <div className="my-4 border-t border-slate-800" />

          <p className="text-xs text-slate-500">
            Correct answer
          </p>

          <p className="mt-1 font-bold text-emerald-300">
            {correctAnswer ??
              "-"}
          </p>

        </div>

        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-left">

          <p className="text-xs font-bold text-slate-400">
            Explanation
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {explanation}
          </p>

        </div>

        <div className="mt-6 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">

          <p className="text-xs text-slate-500">
            Current CBT Points
          </p>

          <p className="mt-1 font-black text-amber-300">
            {formatPoints(
              totalWinnings,
            )}
          </p>

        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">

          <button
            type="button"
            onClick={
              onTryAgain
            }
            className="h-14 rounded-2xl bg-violet-600 font-bold transition hover:bg-violet-500"
          >
            Try Again
          </button>

          <button
            type="button"
            onClick={
              onCashOut
            }
            className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 font-bold transition hover:bg-slate-800"
          >
            <Wallet className="h-5 w-5" />

            Cash Out
          </button>

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   CASH OUT SCREEN
============================================================= */

function CashOutScreen({
  subject,
  totalWinnings,
  onRestart,
  onSubjects,
}: {
  subject: SubjectConfig;
  totalWinnings: number;
  onRestart: () => void;
  onSubjects: () => void;
}) {
  return (
    <div className="rounded-3xl border border-amber-400/20 bg-[#151208] p-6 shadow-2xl sm:p-10">

      <div className="text-center">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/10">

          <Wallet className="h-10 w-10 text-amber-300" />

        </div>

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
          Session Complete
        </p>

        <h2 className="mt-3 text-3xl font-black">
          Your Winnings
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {subject.icon}{" "}
          {subject.name}
        </p>

        <div className="my-7 flex items-center justify-center gap-2">

          <Coins className="h-7 w-7 text-amber-300" />

          <span className="text-5xl font-black text-amber-300">
            {formatPoints(
              totalWinnings,
            )}
          </span>

        </div>

        <p className="mx-auto max-w-md text-sm leading-6 text-slate-500">
          You have ended this
          Solve & Win session.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">

          <button
            type="button"
            onClick={
              onSubjects
            }
            className="h-14 rounded-2xl border border-slate-700 bg-slate-900 font-bold transition hover:bg-slate-800"
          >
            Choose Subject
          </button>

          <button
            type="button"
            onClick={
              onRestart
            }
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-violet-600 font-bold transition hover:bg-violet-500"
          >
            Play Again

            <ArrowRight className="h-5 w-5" />
          </button>

        </div>

      </div>

    </div>
  );
}

/* =============================================================
   CBT LADDER
============================================================= */

function CbtLadder({
  currentQuestionIndex,
  totalWinnings,
  completedRewards,
  rewards,
}: {
  currentQuestionIndex: number;
  totalWinnings: number;
  completedRewards: number[];
  rewards: number[];
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0d1320] p-5">

      {/* HEADER */}

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10">
          <Trophy className="h-5 w-5 text-amber-300" />
        </div>

        <div>
          <h3 className="font-black">
            CBT Point Ladder
          </h3>

          <p className="text-xs text-slate-500">
            Climb by answering
            correctly
          </p>
        </div>

      </div>

      {/* TOTAL */}

      <div className="mb-5 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">

        <p className="text-xs text-slate-500">
          Current winnings
        </p>

        <div className="mt-1 flex items-center gap-2">

          <Coins className="h-4 w-4 text-amber-300" />

          <span className="text-xl font-black text-amber-200">
            {formatPoints(
              totalWinnings,
            )}
          </span>

        </div>

      </div>

      {/* LADDER */}

      <div className="space-y-2">

        {[...rewards]
          .map(
            (
              reward,
              index,
            ) => {
              const completed =
                index <
                currentQuestionIndex;

              const current =
                index ===
                currentQuestionIndex;

              return {
                reward,
                index,
                completed,
                current,
              };
            },
          )
          .reverse()
          .map(
            ({
              reward,
              index,
              completed,
              current,
            }) => (
              <div
                key={index}
                className={[
                  "flex items-center justify-between rounded-xl border px-3 py-3 transition-all",
                  current
                    ? "border-violet-500/40 bg-violet-500/10"
                    : completed
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-slate-800 bg-slate-900/40",
                ].join(" ")}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black",
                      completed
                        ? "bg-emerald-500 text-white"
                        : current
                          ? "bg-violet-500 text-white"
                          : "bg-slate-800 text-slate-600",
                    ].join(" ")}
                  >
                    {completed ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <span
                    className={[
                      "text-xs font-bold",
                      current
                        ? "text-violet-300"
                        : completed
                          ? "text-emerald-300"
                          : "text-slate-500",
                    ].join(" ")}
                  >
                    Question{" "}
                    {index + 1}
                  </span>

                </div>

                <span
                  className={[
                    "text-xs font-black",
                    current
                      ? "text-violet-300"
                      : completed
                        ? "text-emerald-300"
                        : "text-slate-600",
                  ].join(" ")}
                >
                  +
                  {formatPoints(
                    reward,
                  )}
                </span>

              </div>
            ),
          )}

      </div>

      {/* NEXT REWARD */}

      {rewards.length > 0 && (
        <div className="mt-5 rounded-2xl border border-violet-500/10 bg-violet-500/5 p-4">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Next correct answer
          </p>

          <p className="mt-1 text-lg font-black text-violet-300">
            +
            {formatPoints(
              rewards[
                Math.min(
                  currentQuestionIndex,
                  rewards.length - 1,
                )
              ],
            )}
          </p>

        </div>
      )}

    </div>
  );
}
















// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import {
//   AlertCircle,
//   ArrowLeft,
//   ArrowRight,
//   CheckCircle2,
//   Clock3,
//   Flag,
//   Loader2,
//   Trophy,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// import {
//   updateSolveAndWinContestQuestionAnswers,
//   submitSolveAndWinContest,
// } from "@/lib/api/solveAndWin";

// /* ============================================================
// TYPES
// ============================================================ */

// type ContestOption = {
//   id?: string;
//   _id?: string;
//   label?: string;
//   text?: string;
//   value?: string;
//   option?: string;
// };

// type ContestQuestion = {
//   _id?: string;
//   id?: string;
//   questionId?: string;

//   question?: string;
//   text?: string;
//   instruction?: string;

//   content?: unknown[];
//   media?: unknown;

//   options?: ContestOption[] | string[];

//   questionType?: string;
//   isMultipleAnswer?: boolean;

//   marks?: number;

//   explanation?: string;
//   explanationSteps?: string[];

//   selectedOption?: string | null;
//   isCorrect?: boolean | null;
//   marksAwarded?: number;

//   subjectId?: string;
// };

// type ParticipationSubject = {
//   subjectId?:
//     | string
//     | {
//         _id?: string;
//         id?: string;
//         name?: string;
//       };

//   questions?: ContestQuestion[];

//   correctAnswers?: number;
//   wrongAnswers?: number;
//   unansweredQuestions?: number;
//   score?: number;

//   durationInSeconds?: number;
//   remainingDurationInSeconds?: number;

//   startedAt?: string | null;
//   endsAt?: string | null;
//   submittedAt?: string | null;
// };

// type Participation = {
//   _id?: string;
//   id?: string;
//   participationId?: string;

//   userId?: string;
//   contestId?: string;

//   subjects?: ParticipationSubject[];
//   questions?: ContestQuestion[];

//   totalQuestions?: number;
//   correctAnswers?: number;
//   wrongAnswers?: number;
//   unansweredQuestions?: number;

//   score?: number;
//   percentage?: number;
//   pointsSpent?: number;

//   durationInSeconds?: number;
//   remainingDurationInSeconds?: number;

//   status?: string;

//   startedAt?: string;
//   endsAt?: string;
//   submittedAt?: string;
// };

// /* ============================================================
// PENDING ANSWER

// Every queued answer carries its own subjectId.

// This is important because a contest can contain questions
// belonging to different subjects.
// ============================================================ */

// type PendingAnswer = {
//   subjectId: string;
//   questionId: string;
//   selectedOption: string;
// };

// /* ============================================================
// CONSTANTS
// ============================================================ */

// const ANSWERS_PER_BACKGROUND_SYNC = 3;

// /*
//  * If the student answers only 1 or 2 questions and then
//  * spends several seconds reading/thinking, we still save them.
//  */
// const BACKGROUND_SYNC_DELAY_MS = 3500;

// /* ============================================================
// GENERIC HELPERS
// ============================================================ */

// function isObject(
//   value: unknown,
// ): value is Record<string, unknown> {
//   return (
//     typeof value === "object" &&
//     value !== null
//   );
// }

// function getNumber(
//   value: unknown,
// ): number | null {
//   if (typeof value === "number") {
//     return Number.isFinite(value)
//       ? value
//       : null;
//   }

//   if (
//     typeof value === "string" &&
//     value.trim() !== ""
//   ) {
//     const parsed = Number(value);

//     return Number.isFinite(parsed)
//       ? parsed
//       : null;
//   }

//   return null;
// }

// /* ============================================================
// RESPONSE EXTRACTION
// ============================================================ */

// function extractParticipation(
//   response: unknown,
// ): Participation | null {
//   if (!isObject(response)) {
//     return null;
//   }

//   if (
//     isObject(response.participation)
//   ) {
//     return response.participation as Participation;
//   }

//   if (
//     isObject(response.data) &&
//     isObject(response.data.participation)
//   ) {
//     return response.data
//       .participation as Participation;
//   }

//   if (isObject(response.data)) {
//     const data =
//       response.data as Record<
//         string,
//         unknown
//       >;

//     if (
//       data.subjects ||
//       data.questions ||
//       data.contestId ||
//       data.participationId ||
//       data._id
//     ) {
//       return data as Participation;
//     }
//   }

//   if (
//     response.subjects ||
//     response.questions ||
//     response.contestId ||
//     response.participationId
//   ) {
//     return response as Participation;
//   }

//   return null;
// }

// /* ============================================================
// QUESTION EXTRACTION
// ============================================================ */

// function extractQuestions(
//   participation: Participation | null,
// ): ContestQuestion[] {
//   if (!participation) {
//     return [];
//   }

//   if (
//     Array.isArray(
//       participation.questions,
//     )
//   ) {
//     /*
//      * Questions may already contain subjectId.
//      *
//      * If they don't, we fall back to the first
//      * participation subject where possible.
//      */
//     const fallbackSubjectId =
//       getParticipationSubjectId(
//         participation,
//       );

//     return participation.questions.map(
//       (question) => ({
//         ...question,
//         subjectId:
//           question.subjectId ??
//           fallbackSubjectId ??
//           undefined,
//       }),
//     );
//   }

//   if (
//     Array.isArray(
//       participation.subjects,
//     )
//   ) {
//     return participation.subjects.flatMap(
//       (subject) => {
//         if (
//           !Array.isArray(
//             subject.questions,
//           )
//         ) {
//           return [];
//         }

//         const subjectId =
//           getSubjectId(subject);

//         return subject.questions.map(
//           (question) => ({
//             ...question,
//             subjectId:
//               question.subjectId ??
//               subjectId ??
//               undefined,
//           }),
//         );
//       },
//     );
//   }

//   return [];
// }

// /* ============================================================
// SUBJECT ID
// ============================================================ */

// function getSubjectId(
//   subject:
//     | ParticipationSubject
//     | undefined,
// ): string | null {
//   if (!subject?.subjectId) {
//     return null;
//   }

//   if (
//     typeof subject.subjectId ===
//     "string"
//   ) {
//     return subject.subjectId;
//   }

//   return (
//     subject.subjectId._id ??
//     subject.subjectId.id ??
//     null
//   );
// }

// function getParticipationSubjectId(
//   participation: Participation | null,
// ): string | null {
//   if (
//     !participation ||
//     !Array.isArray(
//       participation.subjects,
//     ) ||
//     participation.subjects.length === 0
//   ) {
//     return null;
//   }

//   return getSubjectId(
//     participation.subjects[0],
//   );
// }

// /* ============================================================
// QUESTION HELPERS
// ============================================================ */

// function getQuestionText(
//   question: ContestQuestion,
// ): string {
//   return (
//     question.question ??
//     question.text ??
//     "Question unavailable"
//   );
// }

// function getQuestionId(
//   question: ContestQuestion,
//   index: number,
// ): string {
//   return (
//     question.questionId ??
//     question._id ??
//     question.id ??
//     `question-${index}`
//   );
// }

// /* ============================================================
// OPTION HELPERS
// ============================================================ */

// function getOptionText(
//   option: ContestOption | string,
//   index: number,
// ): string {
//   if (typeof option === "string") {
//     return option;
//   }

//   return (
//     option.value ??
//     option.text ??
//     option.option ??
//     option.label ??
//     `Option ${index + 1}`
//   );
// }

// function getOptionLabel(
//   option: ContestOption | string,
//   index: number,
// ): string {
//   if (typeof option === "string") {
//     return String.fromCharCode(
//       65 + index,
//     );
//   }

//   return (
//     option.label ??
//     String.fromCharCode(
//       65 + index,
//     )
//   );
// }

// function getOptionId(
//   option: ContestOption | string,
//   index: number,
// ): string {
//   if (typeof option === "string") {
//     return option;
//   }

//   return (
//     option._id ??
//     option.id ??
//     option.value ??
//     `option-${index}`
//   );
// }

// /* ============================================================
// API ERROR
// ============================================================ */

// function getApiErrorMessage(
//   error: unknown,
//   fallback: string,
// ): string {
//   if (
//     isObject(error) &&
//     isObject(error.response) &&
//     isObject(
//       error.response.data,
//     )
//   ) {
//     const data =
//       error.response.data;

//     if (
//       typeof data.message ===
//         "string" &&
//       data.message.trim()
//     ) {
//       return data.message;
//     }

//     if (
//       Array.isArray(data.message)
//     ) {
//       return data.message.join(
//         ", ",
//       );
//     }

//     if (
//       typeof data.error ===
//         "string" &&
//       data.error.trim()
//     ) {
//       return data.error;
//     }
//   }

//   if (
//     error instanceof Error &&
//     error.message
//   ) {
//     return error.message;
//   }

//   return fallback;
// }

// /* ============================================================
// BACKGROUND
// ============================================================ */

// function ContestBackground({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//       <div className="pointer-events-none fixed inset-0">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
//       </div>

//       <div className="relative z-10">
//         {children}
//       </div>
//     </main>
//   );
// }

// /* ============================================================
// PAGE
// ============================================================ */

// export default function SolveAndWinPlayPage() {
//   const params = useParams();

//   const contestId =
//     params?.contestId as
//       | string
//       | undefined;

//   /* ==========================================================
//   PARTICIPATION
//   ========================================================== */

//   const [participation, setParticipation] =
//     useState<Participation | null>(
//       null,
//     );

//   const [questions, setQuestions] =
//     useState<ContestQuestion[]>([]);

//   /* ==========================================================
//   QUESTION STATE
//   ========================================================== */

//   const [
//     currentQuestionIndex,
//     setCurrentQuestionIndex,
//   ] = useState(0);

//   /*
//    * This is the student's immediate local answer state.
//    *
//    * It changes instantly when the student clicks.
//    *
//    * No API request happens here.
//    */
//   const [answers, setAnswers] =
//     useState<
//       Record<string, string>
//     >({});

//   /* ==========================================================
//   BACKGROUND QUEUE
//   ========================================================== */

//   /*
//    * Key:
//    *
//    * subjectId:questionId
//    *
//    * This allows the same question ID to safely belong
//    * to a different subject if necessary.
//    */
//   const pendingAnswersRef =
//     useRef<
//       Map<string, PendingAnswer>
//     >(new Map());

//   /*
//    * Prevent overlapping sync requests.
//    */
//   const isSyncingAnswersRef =
//     useRef(false);

//   /*
//    * Used when a new answer arrives while a sync
//    * request is already running.
//    */
//   const syncAgainRef =
//     useRef(false);

//   /*
//    * Timer used for the 3.5 second debounce.
//    */
//   const syncTimerRef =
//     useRef<number | null>(null);

//   /*
//    * Keep the latest sync function available to
//    * timer callbacks without stale closure problems.
//    */
//   const syncPendingAnswersRef =
//     useRef<
//       (
//         force?: boolean,
//       ) => Promise<boolean>
//     >(async () => true);

//   /*
//    * This state is only used to make the pending
//    * count visible in the UI.
//    */
//   const [
//     pendingAnswerCount,
//     setPendingAnswerCount,
//   ] = useState(0);

//   /* ==========================================================
//   TIMER
//   ========================================================== */

//   const [timeRemaining, setTimeRemaining] =
//     useState<number | null>(null);

//   /* ==========================================================
//   LOADING / ERROR
//   ========================================================== */

//   const [isLoading, setIsLoading] =
//     useState(true);

//   const [error, setError] =
//     useState<string | null>(null);

//   /* ==========================================================
//   SUBMISSION
//   ========================================================== */

//   const [isSubmitting, setIsSubmitting] =
//     useState(false);

//   const [isSubmitted, setIsSubmitted] =
//     useState(false);

//   const [submitError, setSubmitError] =
//     useState<string | null>(null);

//   /* ==========================================================
//   ANSWER SYNC UI
//   ========================================================== */

//   const [
//     isSyncingAnswers,
//     setIsSyncingAnswers,
//   ] = useState(false);

//   const [
//     answerSaveError,
//     setAnswerSaveError,
//   ] = useState<string | null>(null);

//   /* ==========================================================
//   LOAD START RESPONSE
//   ========================================================== */

//   useEffect(() => {
//     if (!contestId) {
//       setError(
//         "Contest information could not be found.",
//       );

//       setIsLoading(false);
//       return;
//     }

//     try {
//       const storageKey =
//         `solve-and-win-start-${contestId}`;

//       const stored =
//         sessionStorage.getItem(
//           storageKey,
//         );

//       if (!stored) {
//         setError(
//           "Your contest session could not be found. Please return to the contest and start again.",
//         );

//         setIsLoading(false);
//         return;
//       }

//       const parsed: unknown =
//         JSON.parse(stored);

//       console.log(
//         "Stored Solve & Win start response:",
//         parsed,
//       );

//       const extracted =
//         extractParticipation(parsed);

//       console.log(
//         "Extracted participation:",
//         extracted,
//       );

//       if (!extracted) {
//         setError(
//           "The contest session was created, but the response format could not be understood yet.",
//         );

//         setIsLoading(false);
//         return;
//       }

//       const extractedQuestions =
//         extractQuestions(
//           extracted,
//         );

//       console.log(
//         "Extracted contest questions:",
//         extractedQuestions,
//       );

//       setParticipation(
//         extracted,
//       );

//       setQuestions(
//         extractedQuestions,
//       );

//       /*
//        * Restore answers that were already returned
//        * by the backend.
//        */
//       const initialAnswers: Record<
//         string,
//         string
//       > = {};

//       extractedQuestions.forEach(
//         (question, index) => {
//           const questionId =
//             getQuestionId(
//               question,
//               index,
//             );

//           if (
//             question.selectedOption
//           ) {
//             initialAnswers[
//               questionId
//             ] =
//               question.selectedOption;
//           }
//         },
//       );

//       setAnswers(
//         initialAnswers,
//       );

//       const remaining =
//         getNumber(
//           extracted.remainingDurationInSeconds,
//         );

//       if (remaining !== null) {
//         setTimeRemaining(
//           remaining,
//         );
//       } else {
//         const firstSubject =
//           extracted.subjects?.[0];

//         const subjectRemaining =
//           getNumber(
//             firstSubject?.remainingDurationInSeconds,
//           );

//         const subjectDuration =
//           getNumber(
//             firstSubject?.durationInSeconds,
//           );

//         setTimeRemaining(
//           subjectRemaining ??
//             subjectDuration,
//         );
//       }

//       setIsLoading(false);
//     } catch (err) {
//       console.error(
//         "Failed to load contest session:",
//         err,
//       );

//       setError(
//         "Unable to load your contest session. Please return and start the contest again.",
//       );

//       setIsLoading(false);
//     }
//   }, [contestId]);

//   /* ==========================================================
//   CURRENT QUESTION
//   ========================================================== */

//   const currentQuestion =
//     questions[
//       currentQuestionIndex
//     ];

//   const currentQuestionId =
//     currentQuestion
//       ? getQuestionId(
//           currentQuestion,
//           currentQuestionIndex,
//         )
//       : null;

//   const currentOptions =
//     currentQuestion &&
//     Array.isArray(
//       currentQuestion.options,
//     )
//       ? currentQuestion.options
//       : [];

//   /* ==========================================================
//   CURRENT SUBJECT ID
//   ========================================================== */

//   const subjectId = useMemo(() => {
//     return (
//       currentQuestion?.subjectId ??
//       getParticipationSubjectId(
//         participation,
//       )
//     );
//   }, [
//     currentQuestion,
//     participation,
//   ]);

//   /* ==========================================================
//   QUEUE HELPERS
//   ========================================================== */

//   const getPendingAnswerKey =
//     useCallback(
//       (
//         pending: PendingAnswer,
//       ) =>
//         `${pending.subjectId}:${pending.questionId}`,
//       [],
//     );

//   const updatePendingCount =
//     useCallback(() => {
//       setPendingAnswerCount(
//         pendingAnswersRef.current.size,
//       );
//     }, []);

//   const clearSyncTimer =
//     useCallback(() => {
//       if (
//         syncTimerRef.current !==
//         null
//       ) {
//         window.clearTimeout(
//           syncTimerRef.current,
//         );

//         syncTimerRef.current = null;
//       }
//     }, []);

//   /* ==========================================================
//   BACKGROUND SYNC
//   ========================================================== */

//   const syncPendingAnswers =
//     useCallback(
//       async (
//         force = false,
//       ): Promise<boolean> => {
//         if (
//           !contestId ||
//           isSubmitted
//         ) {
//           return false;
//         }

//         /*
//          * Nothing to send.
//          */
//         if (
//           pendingAnswersRef.current
//             .size === 0
//         ) {
//           updatePendingCount();
//           return true;
//         }

//         /*
//          * If another request is currently running,
//          * ask it to perform another pass afterwards.
//          */
//         if (
//           isSyncingAnswersRef.current
//         ) {
//           syncAgainRef.current = true;
//           return false;
//         }

//         /*
//          * Don't sync before the threshold unless
//          * this is a forced flush.
//          */
//         if (
//           !force &&
//           pendingAnswersRef.current
//             .size <
//             ANSWERS_PER_BACKGROUND_SYNC
//         ) {
//           return true;
//         }

//         clearSyncTimer();

//         isSyncingAnswersRef.current =
//           true;

//         setIsSyncingAnswers(true);
//         setAnswerSaveError(null);

//         /*
//          * Snapshot the current queue.
//          */
//         const snapshot =
//           Array.from(
//             pendingAnswersRef.current.values(),
//           );

//         /*
//          * IMPORTANT:
//          *
//          * We do NOT clear the entire queue permanently.
//          *
//          * We temporarily remove only entries whose
//          * current value still matches the snapshot.
//          *
//          * If the student changes an answer while the
//          * request is running, the newer answer remains.
//          */
//         snapshot.forEach(
//           (answer) => {
//             const key =
//               getPendingAnswerKey(
//                 answer,
//               );

//             const current =
//               pendingAnswersRef.current.get(
//                 key,
//               );

//             if (
//               current &&
//               current.selectedOption ===
//                 answer.selectedOption
//             ) {
//               pendingAnswersRef.current.delete(
//                 key,
//               );
//             }
//           },
//         );

//         updatePendingCount();

//         try {
//           /*
//            * ==================================================
//            * GROUP ANSWERS BY SUBJECT
//            * ==================================================
//            *
//            * The backend endpoint requires:
//            *
//            * contestId
//            * subjectId
//            *
//            * Therefore different subjects must be sent
//            * using separate requests.
//            */
//           const groupedBySubject =
//             new Map<
//               string,
//               PendingAnswer[]
//             >();

//           snapshot.forEach(
//             (answer) => {
//               const existing =
//                 groupedBySubject.get(
//                   answer.subjectId,
//                 ) ?? [];

//               existing.push(
//                 answer,
//               );

//               groupedBySubject.set(
//                 answer.subjectId,
//                 existing,
//               );
//             },
//           );

//           /*
//            * Send each subject group separately.
//            */
//           for (
//             const [
//               answerSubjectId,
//               subjectAnswers,
//             ] of groupedBySubject
//           ) {
//             /*
//              * Safety check.
//              *
//              * NEVER call the backend with:
//              *
//              * answers: []
//              */
//             if (
//               subjectAnswers.length ===
//               0
//             ) {
//               continue;
//             }

//             const payload = {
//               answers:
//                 subjectAnswers.map(
//                   (answer) => ({
//                     questionId:
//                       answer.questionId,
//                     selectedOption:
//                       answer.selectedOption,
//                   }),
//                 ),
//             };

//             console.log(
//               "Background Solve & Win answer sync:",
//               {
//                 contestId,
//                 subjectId:
//                   answerSubjectId,
//                 payload,
//               },
//             );

//             await updateSolveAndWinContestQuestionAnswers(
//               contestId,
//               answerSubjectId,
//               payload,
//             );
//           }

//           console.log(
//             "Background answer sync successful.",
//           );

//           /*
//            * If more answers accumulated while the
//            * requests were running, do another pass.
//            */
//           if (
//             pendingAnswersRef.current
//               .size >=
//             ANSWERS_PER_BACKGROUND_SYNC
//           ) {
//             syncAgainRef.current = true;
//           }

//           updatePendingCount();

//           return true;
//         } catch (err) {
//           console.error(
//             "Background answer sync failed:",
//             err,
//           );

//           /*
//            * Restore failed answers.
//            *
//            * If a newer answer already exists for the
//            * same question, keep the newer answer.
//            */
//           snapshot.forEach(
//             (answer) => {
//               const key =
//                 getPendingAnswerKey(
//                   answer,
//                 );

//               const current =
//                 pendingAnswersRef.current.get(
//                   key,
//                 );

//               if (!current) {
//                 pendingAnswersRef.current.set(
//                   key,
//                   answer,
//                 );
//               }
//             },
//           );

//           updatePendingCount();

//           setAnswerSaveError(
//             getApiErrorMessage(
//               err,
//               "Some answers are waiting to be saved. Your selections remain safe on this page and will be retried.",
//             ),
//           );

//           return false;
//         } finally {
//           isSyncingAnswersRef.current =
//             false;

//           setIsSyncingAnswers(false);

//           /*
//            * If another answer was added while
//            * the request was running, continue syncing.
//            */
//           if (
//             syncAgainRef.current
//           ) {
//             syncAgainRef.current =
//               false;

//             window.setTimeout(() => {
//               void syncPendingAnswers(
//                 false,
//               );
//             }, 0);
//           } else if (
//             pendingAnswersRef.current
//               .size >=
//             ANSWERS_PER_BACKGROUND_SYNC
//           ) {
//             window.setTimeout(() => {
//               void syncPendingAnswers(
//                 false,
//               );
//             }, 0);
//           }
//         }
//       },
//       [
//         contestId,
//         isSubmitted,
//         clearSyncTimer,
//         getPendingAnswerKey,
//         updatePendingCount,
//       ],
//     );

//   /*
//    * Keep ref pointing at the latest callback.
//    */
//   useEffect(() => {
//     syncPendingAnswersRef.current =
//       syncPendingAnswers;
//   }, [syncPendingAnswers]);

//   /* ==========================================================
//   SCHEDULE BACKGROUND SYNC
//   ========================================================== */

//   const scheduleBackgroundSync =
//     useCallback(() => {
//       clearSyncTimer();

//       if (
//         pendingAnswersRef.current
//           .size === 0
//       ) {
//         return;
//       }

//       /*
//        * If threshold is already reached, don't wait.
//        */
//       if (
//         pendingAnswersRef.current
//           .size >=
//         ANSWERS_PER_BACKGROUND_SYNC
//       ) {
//         void syncPendingAnswers(
//           false,
//         );
//         return;
//       }

//       /*
//        * Otherwise wait a few seconds.
//        *
//        * This means 1 or 2 answers are still eventually
//        * synchronized without interrupting the student.
//        */
//       syncTimerRef.current =
//         window.setTimeout(() => {
//           syncTimerRef.current =
//             null;

//           void syncPendingAnswers(
//             true,
//           );
//         }, BACKGROUND_SYNC_DELAY_MS);
//     }, [
//       clearSyncTimer,
//       syncPendingAnswers,
//     ]);

//   /* ==========================================================
//   SELECT ANSWER
//   ========================================================== */

//   const handleSelectAnswer =
//     useCallback(
//       (optionId: string) => {
//         if (
//           !currentQuestionId ||
//           !contestId ||
//           !subjectId ||
//           isSubmitted ||
//           timeRemaining === 0
//         ) {
//           return;
//         }

//         /*
//          * ================================================
//          * 1. UPDATE UI IMMEDIATELY
//          * ================================================
//          *
//          * There is deliberately NO await here.
//          */
//         setAnswers(
//           (previous) => ({
//             ...previous,
//             [currentQuestionId]:
//               optionId,
//           }),
//         );

//         setAnswerSaveError(null);

//         /*
//          * ================================================
//          * 2. QUEUE THE ANSWER
//          * ================================================
//          *
//          * If the student changes:
//          *
//          * A -> B
//          *
//          * before synchronization, the Map contains B only.
//          */
//         const pending: PendingAnswer =
//           {
//             subjectId,
//             questionId:
//               currentQuestionId,
//             selectedOption:
//               optionId,
//           };

//         const key =
//           getPendingAnswerKey(
//             pending,
//           );

//         pendingAnswersRef.current.set(
//           key,
//           pending,
//         );

//         updatePendingCount();

//         /*
//          * ================================================
//          * 3. BACKGROUND SYNC
//          * ================================================
//          *
//          * If 3 unique pending answer changes exist,
//          * synchronize immediately.
//          *
//          * Otherwise schedule a short background flush.
//          */
//         if (
//           pendingAnswersRef.current
//             .size >=
//           ANSWERS_PER_BACKGROUND_SYNC
//         ) {
//           clearSyncTimer();

//           void syncPendingAnswers(
//             false,
//           );
//         } else {
//           scheduleBackgroundSync();
//         }
//       },
//       [
//         currentQuestionId,
//         contestId,
//         subjectId,
//         isSubmitted,
//         timeRemaining,
//         getPendingAnswerKey,
//         updatePendingCount,
//         clearSyncTimer,
//         syncPendingAnswers,
//         scheduleBackgroundSync,
//       ],
//     );

//   /* ==========================================================
//   TIMER
//   ========================================================== */

//   useEffect(() => {
//     if (
//       timeRemaining === null ||
//       isSubmitted
//     ) {
//       return;
//     }

//     if (timeRemaining <= 0) {
//       return;
//     }

//     const timer =
//       window.setInterval(() => {
//         setTimeRemaining(
//           (previous) => {
//             if (
//               previous === null ||
//               previous <= 1
//             ) {
//               return 0;
//             }

//             return previous - 1;
//           },
//         );
//       }, 1000);

//     return () => {
//       window.clearInterval(
//         timer,
//       );
//     };
//   }, [
//     timeRemaining,
//     isSubmitted,
//   ]);

//   /* ==========================================================
//   AUTO FLUSH WHEN TIMER EXPIRES
//   ========================================================== */

//   useEffect(() => {
//     if (
//       timeRemaining !== 0 ||
//       isSubmitted
//     ) {
//       return;
//     }

//     /*
//      * Time has expired.
//      *
//      * Flush every remaining answer.
//      */
//     void syncPendingAnswersRef.current(
//       true,
//     );
//   }, [
//     timeRemaining,
//     isSubmitted,
//   ]);

//   /* ==========================================================
//   PROGRESS
//   ========================================================== */

//   const answeredCount =
//     Object.keys(
//       answers,
//     ).length;

//   const progressPercentage =
//     questions.length > 0
//       ? Math.round(
//           ((currentQuestionIndex +
//             1) /
//             questions.length) *
//             100,
//         )
//       : 0;

//   const answeredPercentage =
//     questions.length > 0
//       ? Math.round(
//           (answeredCount /
//             questions.length) *
//             100,
//         )
//       : 0;

//   /* ==========================================================
//   TIMER DISPLAY
//   ========================================================== */

//   const timerDisplay =
//     useMemo(() => {
//       if (
//         timeRemaining === null
//       ) {
//         return "--:--";
//       }

//       const minutes =
//         Math.floor(
//           timeRemaining / 60,
//         );

//       const seconds =
//         timeRemaining % 60;

//       return `${String(
//         minutes,
//       ).padStart(
//         2,
//         "0",
//       )}:${String(
//         seconds,
//       ).padStart(
//         2,
//         "0",
//       )}`;
//     }, [timeRemaining]);

//   const timerCritical =
//     timeRemaining !== null &&
//     timeRemaining <= 60;

//   /* ==========================================================
//   NAVIGATION
//   ========================================================== */

//   const goToPreviousQuestion =
//     () => {
//       if (
//         timeRemaining === 0
//       ) {
//         return;
//       }

//       setCurrentQuestionIndex(
//         (previous) =>
//           Math.max(
//             0,
//             previous - 1,
//           ),
//       );
//     };

//   const goToNextQuestion =
//     () => {
//       if (
//         timeRemaining === 0
//       ) {
//         return;
//       }

//       setCurrentQuestionIndex(
//         (previous) =>
//           Math.min(
//             questions.length - 1,
//             previous + 1,
//           ),
//       );
//     };

//   const handleSubmit = async () => {
//   if (
//     !contestId ||
//     !subjectId ||
//     isSubmitting ||
//     isSubmitted ||
//     timeRemaining === 0
//   ) {
//     return;
//   }

//   try {
//     setIsSubmitting(true);
//     setSubmitError(null);

//     /* ======================================================
//        STEP 1
//        FLUSH ANY ANSWERS STILL WAITING IN THE LOCAL QUEUE
//     ====================================================== */

//     let answersSynced = await syncPendingAnswers(true);

//     /*
//      * If another background sync was already running,
//      * wait for it to finish and then flush once more.
//      */
//     if (
//       !answersSynced &&
//       isSyncingAnswersRef.current
//     ) {
//       for (
//         let attempt = 0;
//         attempt < 50;
//         attempt++
//       ) {
//         await new Promise<void>((resolve) => {
//           window.setTimeout(resolve, 100);
//         });

//         if (
//           !isSyncingAnswersRef.current
//         ) {
//           break;
//         }
//       }

//       answersSynced =
//         await syncPendingAnswers(true);
//     }

//     if (!answersSynced) {
//       setSubmitError(
//         "Some answers could not be saved yet. Please check your connection and try submitting again.",
//       );

//       return;
//     }

//     /*
//      * Final background-sync safety check.
//      */
//     if (
//       pendingAnswersRef.current.size > 0
//     ) {
//       const retryResult =
//         await syncPendingAnswers(true);

//       if (
//         !retryResult ||
//         pendingAnswersRef.current.size > 0
//       ) {
//         setSubmitError(
//           "Some answers are still waiting to be saved. Please try submitting again.",
//         );

//         return;
//       }
//     }

//     /* ======================================================
//        STEP 2
//        BUILD FINAL SUBMISSION PAYLOAD
//     ====================================================== */

//     /*
//      * IMPORTANT:
//      *
//      * `answers` is the immediate local UI state.
//      *
//      * It contains:
//      *
//      * {
//      *   questionId: selectedOption
//      * }
//      *
//      * We convert it into the backend format:
//      *
//      * {
//      *   answers: [
//      *     {
//      *       questionId: "...",
//      *       selectedOption: "..."
//      *     }
//      *   ]
//      * }
//      */

//     const finalAnswers = questions
//       .map((question, index) => {
//         const questionId =
//           getQuestionId(
//             question,
//             index,
//           );

//         const selectedOption =
//           answers[questionId];

//         /*
//          * Ignore unanswered questions.
//          */
//         if (
//           !selectedOption ||
//           !question.subjectId
//         ) {
//           return null;
//         }

//         return {
//           subjectId:
//             question.subjectId,
//           questionId,
//           selectedOption,
//         };
//       })
//       .filter(
//         (
//           answer,
//         ): answer is {
//           subjectId: string;
//           questionId: string;
//           selectedOption: string;
//         } => answer !== null,
//       );

//     /* ======================================================
//        STEP 3
//        ONLY SUBMIT ANSWERS BELONGING TO THIS SUBJECT
//     ====================================================== */

//     const subjectAnswers =
//       finalAnswers.filter(
//         (answer) =>
//           answer.subjectId === subjectId,
//       );

//     /*
//      * VERY IMPORTANT:
//      *
//      * Never call the backend with:
//      *
//      * {
//      *   answers: []
//      * }
//      *
//      * That is exactly the validation error you were seeing.
//      */
//     if (
//       subjectAnswers.length === 0
//     ) {
//       setSubmitError(
//         "Please answer at least one question before submitting the contest.",
//       );

//       return;
//     }

//     const submissionPayload = {
//       answers:
//         subjectAnswers.map(
//           (answer) => ({
//             questionId:
//               answer.questionId,
//             selectedOption:
//               answer.selectedOption,
//           }),
//         ),
//     };

//     console.log(
//       "FINAL Solve & Win submission:",
//       {
//         contestId,
//         subjectId,
//         payload:
//           submissionPayload,
//         answeredCount:
//           subjectAnswers.length,
//       },
//     );

//     /* ======================================================
//        STEP 4
//        FINAL SUBMISSION ENDPOINT
//     ====================================================== */

//     const response =
//       await submitSolveAndWinContest(
//         contestId,
//         subjectId,
//         submissionPayload,
//       );

//     console.log(
//       "Solve & Win contest submitted successfully:",
//       response,
//     );

//     /* ======================================================
//        STEP 5
//        COMPLETE LOCAL SUBMISSION
//     ====================================================== */

//     setIsSubmitted(true);

//     clearSyncTimer();

//     pendingAnswersRef.current.clear();

//     updatePendingCount();

//     try {
//       sessionStorage.setItem(
//         `solve-and-win-submit-${contestId}`,
//         JSON.stringify(response),
//       );
//     } catch (storageError) {
//       console.warn(
//         "Could not save submission response to sessionStorage:",
//         storageError,
//       );
//     }
//   } catch (err) {
//     console.error(
//       "Failed to submit Solve & Win contest:",
//       err,
//     );

//     setSubmitError(
//       getApiErrorMessage(
//         err,
//         "Your contest could not be submitted. Please try again.",
//       ),
//     );
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   /* ==========================================================
//   CLEANUP
//   ========================================================== */

//   useEffect(() => {
//     return () => {
//       clearSyncTimer();

//       /*
//        * We intentionally do not attempt to await an Axios
//        * request during browser unload.
//        *
//        * Guaranteed synchronization points are:
//        *
//        * - 3 pending answers
//        * - debounce timeout
//        * - timer expiry
//        * - final Submit
//        */
//     };
//   }, [clearSyncTimer]);

//   /* ==========================================================
//   LOADING
//   ========================================================== */

//   if (isLoading) {
//     return (
//       <ContestBackground>
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

//             <div className="p-10 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//                 <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
//               </div>

//               <h1 className="mt-6 text-2xl font-black text-white">
//                 Loading Contest
//               </h1>

//               <p className="mt-2 text-sm text-slate-400">
//                 Preparing your questions...
//               </p>
//             </div>
//           </Card>
//         </div>
//       </ContestBackground>
//     );
//   }

//   /* ==========================================================
//   ERROR
//   ========================================================== */

//   if (error) {
//     return (
//       <ContestBackground>
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />

//             <div className="p-8 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10">
//                 <AlertCircle className="h-8 w-8 text-red-400" />
//               </div>

//               <h1 className="mt-6 text-2xl font-black text-white">
//                 Unable to Load Contest
//               </h1>

//               <p className="mt-3 text-sm leading-6 text-slate-400">
//                 {error}
//               </p>

//               <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
//                 <Link
//                   href={`/student/solve-and-win/contests/${contestId}/start`}
//                   className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Return to Start
//                 </Link>

//                 <Link
//                   href="/student/solve-and-win"
//                   className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
//                 >
//                   Back to Contests
//                 </Link>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </ContestBackground>
//     );
//   }

//   /* ==========================================================
//   NO QUESTIONS
//   ========================================================== */

//   if (
//     !questions.length &&
//     !isSubmitted
//   ) {
//     return (
//       <ContestBackground>
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />

//             <div className="p-8 text-center">
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
//                 <AlertCircle className="h-8 w-8 text-amber-400" />
//               </div>

//               <h1 className="mt-6 text-2xl font-black text-white">
//                 No Questions Available
//               </h1>

//               <p className="mt-3 text-sm leading-6 text-slate-400">
//                 The contest session was created,
//                 but no questions were returned yet.
//               </p>

//               <Link
//                 href={`/student/solve-and-win/contests/${contestId}/start`}
//                 className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
//               >
//                 <ArrowLeft className="h-4 w-4" />
//                 Return to Contest
//               </Link>
//             </div>
//           </Card>
//         </div>
//       </ContestBackground>
//     );
//   }

//   /* ==========================================================
//   SUBMITTED
//   ========================================================== */

//   if (isSubmitted) {
//     return (
//       <ContestBackground>
//         <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-4">
//           <Card className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

//             <div className="p-8 text-center">
//               <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-xl shadow-emerald-500/20">
//                 <CheckCircle2 className="h-10 w-10 text-white" />
//               </div>

//               <p className="mt-6 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
//                 Contest Submitted
//               </p>

//               <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
//                 Your answers have been recorded
//               </h1>

//               <p className="mt-3 text-sm leading-6 text-slate-400">
//                 Your contest result will be processed
//                 by the competition system.
//               </p>

//               <Link
//                 href="/student/solve-and-win"
//                 className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5"
//               >
//                 <Trophy className="h-4 w-4" />
//                 Back to Solve & Win
//               </Link>
//             </div>
//           </Card>
//         </div>
//       </ContestBackground>
//     );
//   }

//   /* ==========================================================
//   MAIN CBT
//   ========================================================== */

//   return (
//     <ContestBackground>
//       <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

//         {/* ====================================================
//             TOP HEADER
//         ==================================================== */}

//         <div className="mb-5 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-sm">
//           <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

//           <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">

//             <div className="flex items-center gap-3">
//               <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-600 shadow-lg shadow-blue-600/20">
//                 <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />

//                 <Trophy className="relative h-5 w-5 text-white" />
//               </div>

//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-400">
//                   Solve & Win
//                 </p>

//                 <h1 className="text-base font-black text-white">
//                   Live Contest
//                 </h1>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center justify-end gap-3">

//               {/* Answered */}

//               <div className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-right sm:block">
//                 <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
//                   Answered
//                 </p>

//                 <p className="text-sm font-black text-white">
//                   {answeredCount}

//                   <span className="text-slate-500">
//                     {" "}
//                     / {questions.length}
//                   </span>
//                 </p>
//               </div>

//               {/* Background sync */}

//               {isSyncingAnswers && (
//                 <div className="hidden items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-[10px] font-bold text-blue-300 sm:flex">
//                   <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                   Saving...
//                 </div>
//               )}

//               {/* Pending */}

//               {pendingAnswerCount > 0 && (
//                 <div className="hidden rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-[10px] font-bold text-amber-300 sm:block">
//                   {pendingAnswerCount} pending
//                 </div>
//               )}

//               {/* Timer */}

//               <div
//                 className={`relative flex items-center gap-2 overflow-hidden rounded-xl border px-4 py-2.5 shadow-sm ${
//                   timerCritical
//                     ? "border-red-400/30 bg-red-500/10 text-red-400"
//                     : "border-cyan-400/25 bg-cyan-500/10 text-cyan-300"
//                 }`}
//               >
//                 <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

//                 <Clock3 className="h-4 w-4" />

//                 <span className="font-mono text-sm font-black tracking-wider">
//                   {timerDisplay}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="h-1.5 bg-white/[0.04]">
//             <div
//               className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all duration-300"
//               style={{
//                 width: `${progressPercentage}%`,
//               }}
//             />
//           </div>
//         </div>

//         {/* ====================================================
//             ANSWER SAVE ERROR
//         ==================================================== */}

//         {answerSaveError && (
//           <div className="mb-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

//               <div className="flex-1">
//                 <p className="text-sm font-bold text-amber-300">
//                   Answer save warning
//                 </p>

//                 <p className="mt-1 text-xs leading-5 text-amber-200/80">
//                   {answerSaveError}
//                 </p>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     void syncPendingAnswers(
//                       true,
//                     )
//                   }
//                   disabled={
//                     isSyncingAnswers
//                   }
//                   className="mt-3 text-xs font-black text-amber-300 underline underline-offset-4 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   Retry saving answers
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ====================================================
//             SUBMIT ERROR
//         ==================================================== */}

//         {submitError && (
//           <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

//               <div>
//                 <p className="text-sm font-bold text-red-300">
//                   Submission failed
//                 </p>

//                 <p className="mt-1 text-xs leading-5 text-red-200/80">
//                   {submitError}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ====================================================
//             QUESTION PROGRESS
//         ==================================================== */}

//         <div className="mb-5">
//           <div className="mb-2 flex items-center justify-between">
//             <div className="text-xs font-bold text-slate-500">
//               Question{" "}
//               <span className="font-black text-white">
//                 {currentQuestionIndex + 1}
//               </span>{" "}
//               of{" "}
//               <span className="font-black text-white">
//                 {questions.length}
//               </span>
//             </div>

//             <div className="text-xs font-black text-emerald-400">
//               {progressPercentage}%
//             </div>
//           </div>

//           <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
//             <div
//               className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
//               style={{
//                 width: `${progressPercentage}%`,
//               }}
//             />
//           </div>
//         </div>

//         {/* ====================================================
//             CBT LAYOUT
//         ==================================================== */}

//         <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">

//           {/* QUESTION CARD */}

//           <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//             <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />

//             <div className="p-6 sm:p-9">

//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5">
//                     <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
//                       Question{" "}
//                       {currentQuestionIndex +
//                         1}
//                     </span>
//                   </div>

//                   {currentQuestion?.instruction && (
//                     <p className="mt-3 text-sm font-medium leading-6 text-slate-400">
//                       {
//                         currentQuestion.instruction
//                       }
//                     </p>
//                   )}
//                 </div>

//                 {currentQuestion?.marks !==
//                   undefined && (
//                   <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-black text-slate-300">
//                     {
//                       currentQuestion.marks
//                     }{" "}
//                     {currentQuestion.marks ===
//                     1
//                       ? "mark"
//                       : "marks"}
//                   </div>
//                 )}
//               </div>

//               {/* Question */}

//               <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
//                 <h2 className="max-w-4xl whitespace-pre-wrap text-xl font-extrabold leading-9 tracking-tight text-white sm:text-[1.4rem]">
//                   {currentQuestion
//                     ? getQuestionText(
//                         currentQuestion,
//                       )
//                     : "Question unavailable"}
//                 </h2>
//               </div>

//               {/* Options */}

//               <div className="mt-8 space-y-3">
//                 {currentOptions.map(
//                   (
//                     option,
//                     optionIndex,
//                   ) => {
//                     const optionId =
//                       getOptionId(
//                         option,
//                         optionIndex,
//                       );

//                     const optionLabel =
//                       getOptionLabel(
//                         option,
//                         optionIndex,
//                       );

//                     const optionText =
//                       getOptionText(
//                         option,
//                         optionIndex,
//                       );

//                     const selected =
//                       currentQuestionId
//                         ? answers[
//                             currentQuestionId
//                           ] ===
//                           optionId
//                         : false;

//                     return (
//                       <button
//                         key={optionId}
//                         type="button"
//                         onClick={() =>
//                           handleSelectAnswer(
//                             optionId,
//                           )
//                         }
//                         disabled={
//                           isSubmitted ||
//                           timeRemaining ===
//                             0
//                         }
//                         className={`group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${
//                           selected
//                             ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/10"
//                             : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-white/[0.05] hover:shadow-lg"
//                         } disabled:cursor-not-allowed disabled:opacity-60`}
//                       >
//                         <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

//                         <span
//                           className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition-all ${
//                             selected
//                               ? "border-blue-400/40 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20"
//                               : "border-white/10 bg-white/[0.04] text-slate-300 group-hover:border-blue-400/30 group-hover:bg-blue-500/10 group-hover:text-blue-300"
//                           }`}
//                         >
//                           {optionLabel}
//                         </span>

//                         <span
//                           className={`relative pt-1.5 whitespace-pre-wrap text-[15px] font-semibold leading-7 sm:text-base ${
//                             selected
//                               ? "text-white"
//                               : "text-slate-200"
//                           }`}
//                         >
//                           {optionText}
//                         </span>

//                         {selected && (
//                           <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
//                             <CheckCircle2 className="h-4 w-4" />
//                           </span>
//                         )}
//                       </button>
//                     );
//                   },
//                 )}
//               </div>

//               {/* Navigation */}

//               <div className="mt-9 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={
//                     goToPreviousQuestion
//                   }
//                   disabled={
//                     currentQuestionIndex ===
//                       0 ||
//                     timeRemaining ===
//                       0
//                   }
//                   className="h-11 rounded-xl border-white/10 bg-white/[0.03] px-5 font-bold text-slate-300 shadow-sm hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
//                 >
//                   <ArrowLeft className="mr-2 h-4 w-4" />
//                   Previous
//                 </Button>

//                 {currentQuestionIndex <
//                 questions.length - 1 ? (
//                   <Button
//                     type="button"
//                     onClick={
//                       goToNextQuestion
//                     }
//                     disabled={
//                       timeRemaining ===
//                       0
//                     }
//                     className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-7 font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     Next
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 ) : (
//                   <Button
//                     type="button"
//                     onClick={
//                       handleSubmit
//                     }
//                     disabled={
//                       isSubmitting ||
//                       timeRemaining ===
//                         0
//                     }
//                     className="h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 font-black text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Saving & Submitting...
//                       </>
//                     ) : (
//                       <>
//                         <Flag className="mr-2 h-4 w-4" />
//                         Submit Contest
//                       </>
//                     )}
//                   </Button>
//                 )}
//               </div>

//               {/* Timer expired */}

//               {timeRemaining === 0 && (
//                 <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
//                   <div className="flex items-start gap-3">
//                     <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

//                     <div>
//                       <p className="text-sm font-bold text-red-300">
//                         Contest time has expired
//                       </p>

//                       <p className="mt-1 text-xs leading-5 text-red-200/80">
//                         Your contest time has ended.
//                         Any remaining answers are
//                         being synchronized with the
//                         backend.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </Card>

//           {/* SIDEBAR */}

//           <div className="lg:sticky lg:top-5 lg:self-start">

//             {/* Question navigator */}

//             <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//               <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

//               <div className="p-5">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//                       Questions
//                     </p>

//                     <p className="mt-1 text-sm font-black text-white">
//                       {answeredCount}{" "}
//                       <span className="font-semibold text-slate-500">
//                         answered
//                       </span>
//                     </p>
//                   </div>

//                   <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-blue-500/10">
//                     <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

//                     <span className="relative text-xs font-black text-blue-300">
//                       {questions.length}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-5">
//                   <div className="mb-1.5 flex justify-between text-[10px] font-bold">
//                     <span className="text-slate-500">
//                       Completion
//                     </span>

//                     <span className="text-emerald-400">
//                       {answeredPercentage}%
//                     </span>
//                   </div>

//                   <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
//                       style={{
//                         width: `${answeredPercentage}%`,
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-5 grid grid-cols-5 gap-2">
//                   {questions.map(
//                     (
//                       question,
//                       index,
//                     ) => {
//                       const questionId =
//                         getQuestionId(
//                           question,
//                           index,
//                         );

//                       const answered =
//                         Boolean(
//                           answers[
//                             questionId
//                           ],
//                         );

//                       const active =
//                         index ===
//                         currentQuestionIndex;

//                       return (
//                         <button
//                           key={`${question.subjectId ?? "subject"}-${questionId}`}
//                           type="button"
//                           onClick={() =>
//                             setCurrentQuestionIndex(
//                               index,
//                             )
//                           }
//                           disabled={
//                             timeRemaining ===
//                             0
//                           }
//                           className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border text-xs font-black transition-all ${
//                             active
//                               ? "border-blue-400/40 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/10"
//                               : answered
//                               ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
//                               : "border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20 hover:bg-white/[0.05] hover:text-slate-300"
//                           } disabled:cursor-not-allowed disabled:opacity-50`}
//                         >
//                           {active && (
//                             <span className="absolute inset-x-0 top-0 h-px bg-white/70" />
//                           )}

//                           {index + 1}
//                         </button>
//                       );
//                     },
//                   )}
//                 </div>

//                 <div className="mt-5 space-y-2 border-t border-white/10 pt-5">
//                   <div className="flex items-center gap-2 text-xs text-slate-500">
//                     <span className="h-3 w-3 rounded bg-gradient-to-br from-blue-500 to-cyan-500" />
//                     Current
//                   </div>

//                   <div className="flex items-center gap-2 text-xs text-slate-500">
//                     <span className="h-3 w-3 rounded border border-emerald-400/20 bg-emerald-500/10" />
//                     Answered
//                   </div>

//                   <div className="flex items-center gap-2 text-xs text-slate-500">
//                     <span className="h-3 w-3 rounded border border-white/10 bg-white/[0.03]" />
//                     Unanswered
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             {/* Contest session */}

//             <Card className="mt-4 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] text-white shadow-2xl backdrop-blur-sm">
//               <div className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />

//               <div className="p-5">
//                 <div className="flex items-center gap-3">
//                   <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-500/10">
//                     <div className="absolute inset-x-0 top-0 h-px bg-white/20" />

//                     <Trophy className="relative h-4 w-4 text-emerald-400" />
//                   </div>

//                   <div>
//                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
//                       Contest Session
//                     </p>

//                     <p className="mt-0.5 text-xs font-bold text-slate-300">
//                       Live participation
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-5 space-y-3">
//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-xs text-slate-500">
//                       Questions
//                     </span>

//                     <span className="text-xs font-black text-white">
//                       {questions.length}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-xs text-slate-500">
//                       Answered
//                     </span>

//                     <span className="text-xs font-black text-emerald-400">
//                       {answeredCount}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-xs text-slate-500">
//                       Remaining
//                     </span>

//                     <span className="text-xs font-black text-cyan-400">
//                       {Math.max(
//                         0,
//                         questions.length -
//                           answeredCount,
//                       )}
//                     </span>
//                   </div>

//                   {subjectId && (
//                     <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
//                       <span className="text-xs text-slate-500">
//                         Subject
//                       </span>

//                       <span className="max-w-[150px] truncate text-right text-[10px] font-bold text-slate-500">
//                         {subjectId}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </ContestBackground>
//   );
// }