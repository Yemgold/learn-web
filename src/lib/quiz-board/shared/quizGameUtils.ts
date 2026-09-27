





// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\shared\quizGameUtils.ts

import type {
  QuizGameOption,
  QuizGameParticipant,
  QuizGameQuestion,
  QuizLeaderboardEntry,
  QuizHostQuestion,
  QuizGameRole,
} from "./quizGameTypes";

/* ============================================================
   GENERIC HELPERS
   ============================================================ */

export function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function isNonEmptyString(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

export function toNumber(
  value: unknown,
  fallback = 0,
): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function toBoolean(
  value: unknown,
  fallback = false,
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return fallback;
}

/* ============================================================
   ID NORMALIZATION
   ============================================================ */

export function normalizeId(
  value: unknown,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (isRecord(value)) {
    const id =
      value._id ??
      value.id ??
      value.questionId ??
      value.quizId ??
      value.userId;

    if (typeof id === "string") {
      return id;
    }

    if (typeof id === "number") {
      return String(id);
    }
  }

  return "";
}

/* ============================================================
   QUESTION ID
   ============================================================ */

export function getQuestionId(
  question: unknown,
): string {
  if (!isRecord(question)) {
    return "";
  }

  return normalizeId(
    question._id ??
      question.id ??
      question.questionId,
  );
}

/* ============================================================
   QUESTION NUMBER
   ============================================================ */

export function getQuestionNumber(
  question: unknown,
  fallback = 0,
): number {
  if (!isRecord(question)) {
    return fallback;
  }

  return toNumber(
    question.questionNumber ??
      question.question_number ??
      question.number ??
      question.order,
    fallback,
  );
}

/* ============================================================
   OPTIONS
   ============================================================ */

export function normalizeQuizOptions(
  value: unknown,
): QuizGameOption[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((option, index) => {
      if (typeof option === "string") {
        return {
          value: option,
          label: option,
        };
      }

      if (!isRecord(option)) {
        return null;
      }

      const optionValue =
        option.value ??
        option.id ??
        option.key ??
        option.label ??
        String.fromCharCode(65 + index);

      const optionLabel =
        option.label ??
        option.text ??
        option.value ??
        optionValue;

      return {
        value: String(optionValue),
        label: String(optionLabel),
      };
    })
    .filter(
      (
        option,
      ): option is QuizGameOption =>
        option !== null,
    );
}

/* ============================================================
   QUESTION NORMALIZATION
   ============================================================ */

export function normalizeQuizQuestion(
  raw: unknown,
  fallbackQuestionNumber = 0,
): QuizGameQuestion | null {
  if (!isRecord(raw)) {
    return null;
  }

  const questionId = getQuestionId(raw);

  const questionText =
    raw.question ??
    raw.questionText ??
    raw.text ??
    raw.content;

  if (!isNonEmptyString(questionText)) {
    return null;
  }

  const options = normalizeQuizOptions(
    raw.options ??
      raw.answerOptions ??
      raw.choices,
  );

  return {
    id:
      questionId ||
      `question-${fallbackQuestionNumber}`,

    question: questionText,

    options,

    questionNumber: getQuestionNumber(
      raw,
      fallbackQuestionNumber,
    ),

    roundNumber: toNumber(
      raw.roundNumber ??
        raw.round_number,
      undefined as unknown as number,
    ),

    difficulty:
      typeof raw.difficulty === "string"
        ? raw.difficulty
        : undefined,

    subject:
      typeof raw.subject === "string"
        ? raw.subject
        : undefined,

    topic:
      typeof raw.topic === "string"
        ? raw.topic
        : undefined,

    status:
      raw.status === "WAITING" ||
      raw.status === "ACTIVE" ||
      raw.status === "LOCKED" ||
      raw.status === "COMPLETED"
        ? raw.status
        : undefined,
  };
}

/* ============================================================
   HOST QUESTION NORMALIZATION
   ============================================================ */

export function normalizeHostQuestion(
  raw: unknown,
  fallbackQuestionNumber = 0,
): QuizHostQuestion | null {
  const question =
    normalizeQuizQuestion(
      raw,
      fallbackQuestionNumber,
    );

  if (!question || !isRecord(raw)) {
    return null;
  }

  const correctAnswersValue =
    raw.correctAnswers ??
    raw.correct_answers ??
    raw.correctAnswer;

  const correctAnswers = Array.isArray(
    correctAnswersValue,
  )
    ? correctAnswersValue.map(String)
    : correctAnswersValue !== undefined &&
        correctAnswersValue !== null
      ? [String(correctAnswersValue)]
      : undefined;

  return {
    ...question,

    correctAnswers,

    explanation:
      typeof raw.explanation === "string"
        ? raw.explanation
        : undefined,

    points:
      raw.points !== undefined
        ? toNumber(raw.points)
        : undefined,

    timeLimit:
      raw.timeLimit !== undefined
        ? toNumber(raw.timeLimit)
        : raw.time_limit !== undefined
          ? toNumber(raw.time_limit)
          : undefined,
  };
}

/* ============================================================
   QUESTION ARRAYS
   ============================================================ */

export function normalizeQuizQuestions(
  value: unknown,
): QuizGameQuestion[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((question, index) =>
      normalizeQuizQuestion(
        question,
        index + 1,
      ),
    )
    .filter(
      (
        question,
      ): question is QuizGameQuestion =>
        question !== null,
    );
}

export function normalizeHostQuestions(
  value: unknown,
): QuizHostQuestion[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((question, index) =>
      normalizeHostQuestion(
        question,
        index + 1,
      ),
    )
    .filter(
      (
        question,
      ): question is QuizHostQuestion =>
        question !== null,
    );
}

/* ============================================================
   RESPONSE QUESTION EXTRACTION
   ============================================================ */

/**
 * Handles the API shapes currently seen in the project:
 *
 * {
 *   success: true,
 *   data: [...]
 * }
 *
 * or:
 *
 * {
 *   data: {
 *     questions: [...]
 *   }
 * }
 *
 * or:
 *
 * {
 *   questions: [...]
 * }
 */
export function extractQuestionsFromResponse(
  response: unknown,
): unknown[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (!isRecord(response)) {
    return [];
  }

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (isRecord(data)) {
    const nested =
      data.questions ??
      data.questionObj ??
      data.roundQuestions;

    if (Array.isArray(nested)) {
      return nested;
    }
  }

  const direct =
    response.questions ??
    response.questionObj ??
    response.roundQuestions;

  return Array.isArray(direct)
    ? direct
    : [];
}

/* ============================================================
   PARTICIPANT NORMALIZATION
   ============================================================ */

export function normalizeParticipant(
  raw: unknown,
): QuizGameParticipant | null {
  if (!isRecord(raw)) {
    return null;
  }

  const id = normalizeId(
    raw.id ??
      raw._id ??
      raw.participantId ??
      raw.userId,
  );

  if (!id) {
    return null;
  }

  const roleValue =
    raw.role === "HOST" ||
    raw.role === "CONTESTANT" ||
    raw.role === "SPECTATOR"
      ? raw.role
      : undefined;

  const statusValue =
    raw.status === "JOINED" ||
    raw.status === "READY" ||
    raw.status === "ANSWERED" ||
    raw.status === "ELIMINATED" ||
    raw.status === "DISCONNECTED" ||
    raw.status === "COMPLETED"
      ? raw.status
      : "JOINED";

  return {
    id,

    userId:
      typeof raw.userId === "string"
        ? raw.userId
        : undefined,

    name:
      typeof raw.name === "string"
        ? raw.name
        : typeof raw.fullName === "string"
          ? raw.fullName
          : undefined,

    username:
      typeof raw.username === "string"
        ? raw.username
        : undefined,

    avatar:
      typeof raw.avatar === "string"
        ? raw.avatar
        : null,

    role: roleValue,

    status: statusValue,

    score: toNumber(
      raw.score ??
        raw.points,
      0,
    ),

    rank:
      raw.rank !== undefined
        ? toNumber(raw.rank)
        : undefined,

    answered:
      raw.answered !== undefined
        ? toBoolean(raw.answered)
        : undefined,

    correct:
      raw.correct !== undefined
        ? toBoolean(raw.correct)
        : undefined,

    eliminated:
      raw.eliminated !== undefined
        ? toBoolean(raw.eliminated)
        : undefined,

    connected:
      raw.connected !== undefined
        ? toBoolean(raw.connected)
        : undefined,
  };
}

export function normalizeParticipants(
  value: unknown,
): QuizGameParticipant[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(normalizeParticipant)
    .filter(
      (
        participant,
      ): participant is QuizGameParticipant =>
        participant !== null,
    );
}

/* ============================================================
   LEADERBOARD NORMALIZATION
   ============================================================ */

export function normalizeLeaderboardEntry(
  raw: unknown,
  fallbackRank = 1,
): QuizLeaderboardEntry | null {
  if (!isRecord(raw)) {
    return null;
  }

  const participantId = normalizeId(
    raw.participantId ??
      raw.userId ??
      raw.id ??
      raw._id,
  );

  if (!participantId) {
    return null;
  }

  return {
    participantId,

    userId:
      typeof raw.userId === "string"
        ? raw.userId
        : undefined,

    name:
      typeof raw.name === "string"
        ? raw.name
        : typeof raw.fullName === "string"
          ? raw.fullName
          : undefined,

    username:
      typeof raw.username === "string"
        ? raw.username
        : undefined,

    rank: toNumber(
      raw.rank ??
        raw.position,
      fallbackRank,
    ),

    score: toNumber(
      raw.score ??
        raw.points,
      0,
    ),

    correctAnswers:
      raw.correctAnswers !== undefined
        ? toNumber(raw.correctAnswers)
        : undefined,

    wrongAnswers:
      raw.wrongAnswers !== undefined
        ? toNumber(raw.wrongAnswers)
        : undefined,

    unanswered:
      raw.unanswered !== undefined
        ? toNumber(raw.unanswered)
        : undefined,

    eliminated:
      raw.eliminated !== undefined
        ? toBoolean(raw.eliminated)
        : undefined,

    isCurrentUser:
      raw.isCurrentUser !== undefined
        ? toBoolean(raw.isCurrentUser)
        : undefined,
  };
}

export function normalizeLeaderboard(
  value: unknown,
): QuizLeaderboardEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry, index) =>
      normalizeLeaderboardEntry(
        entry,
        index + 1,
      ),
    )
    .filter(
      (
        entry,
      ): entry is QuizLeaderboardEntry =>
        entry !== null,
    )
    .sort(
      (a, b) =>
        a.rank - b.rank,
    );
}

/* ============================================================
   ROLE NORMALIZATION
   ============================================================ */

export function normalizeQuizRole(
  value: unknown,
): QuizGameRole | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized =
    value.trim().toUpperCase();

  if (
    normalized === "HOST" ||
    normalized === "CONTESTANT" ||
    normalized === "SPECTATOR"
  ) {
    return normalized;
  }

  return null;
}

/* ============================================================
   TIME HELPERS
   ============================================================ */

export function normalizeTimeLimit(
  value: unknown,
  fallback = 30,
): number {
  const seconds = toNumber(
    value,
    fallback,
  );

  return Math.max(
    1,
    Math.floor(seconds),
  );
}

export function calculateRemainingSeconds(
  endsAt: number | null | undefined,
  now = Date.now(),
): number {
  if (!endsAt) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil(
      (endsAt - now) / 1000,
    ),
  );
}

export function hasTimerExpired(
  endsAt: number | null | undefined,
  now = Date.now(),
): boolean {
  if (!endsAt) {
    return false;
  }

  return now >= endsAt;
}

/* ============================================================
   ANSWER COMPARISON
   ============================================================ */

export function normalizeAnswer(
  answer: unknown,
): string {
  return String(answer ?? "")
    .trim()
    .toLowerCase();
}

export function answersMatch(
  answer: unknown,
  correctAnswer: unknown,
): boolean {
  return (
    normalizeAnswer(answer) ===
    normalizeAnswer(correctAnswer)
  );
}

export function isCorrectAnswer(
  answer: unknown,
  correctAnswers: unknown,
): boolean {
  if (!Array.isArray(correctAnswers)) {
    return answersMatch(
      answer,
      correctAnswers,
    );
  }

  return correctAnswers.some(
    (correctAnswer) =>
      answersMatch(
        answer,
        correctAnswer,
      ),
  );
}

/* ============================================================
   QUESTION LOOKUP
   ============================================================ */

export function findQuestionByNumber(
  questions: QuizGameQuestion[],
  questionNumber: number,
): QuizGameQuestion | undefined {
  return questions.find(
    (question) =>
      question.questionNumber ===
      questionNumber,
  );
}

export function findQuestionById(
  questions: QuizGameQuestion[],
  questionId: string,
): QuizGameQuestion | undefined {
  return questions.find(
    (question) =>
      question.id === questionId,
  );
}

/* ============================================================
   SAFE ERROR MESSAGE
   ============================================================ */

export function getSocketErrorMessage(
  error: unknown,
  fallback = "An unexpected quiz error occurred.",
): string {
  if (typeof error === "string") {
    return error;
  }

  if (isRecord(error)) {
    if (
      typeof error.message === "string" &&
      error.message.trim()
    ) {
      return error.message;
    }

    if (
      typeof error.error === "string" &&
      error.error.trim()
    ) {
      return error.error;
    }
  }

  return fallback;
}

/* ============================================================
   OBJECT PATH HELPER
   ============================================================ */

export function getNestedValue(
  value: unknown,
  path: string,
): unknown {
  const parts = path.split(".");

  let current: unknown = value;

  for (const part of parts) {
    if (!isRecord(current)) {
      return undefined;
    }

    current = current[part];
  }

  return current;
}

/* ============================================================
   SAFE ARRAY
   ============================================================ */

export function toArray<T>(
  value: unknown,
): T[] {
  return Array.isArray(value)
    ? (value as T[])
    : [];
}