





// src/lib/quiz-board/host/quizGameHttp.ts

import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   QUIZ GAME HTTP CONTROLLER
   ============================================================

   PURPOSE
   ------------------------------------------------------------
   Socket.IO is the PRIMARY mechanism for the live Quiz Board.

   This HTTP controller is the BACKUP / RECOVERY mechanism.

   It is responsible for:
   - Loading quiz information
   - Loading round questions
   - Recovering round questions after reconnect
   - Refreshing quiz state when necessary

   IMPORTANT
   ------------------------------------------------------------
   Students should NOT use getRoundQuestions() if the response
   contains correct answers.

   The host may use getRoundQuestions() because the host is the
   trusted client.

   Live game actions such as:
   - starting questions
   - submitting answers
   - first-correct arbitration
   - question locking
   - leaderboard updates
   - next question

   remain Socket.IO responsibilities.
   ============================================================ */


/* ============================================================
   TYPES
   ============================================================ */

export interface QuizGameHttpOption {
  label: string;
  value: string;
  text: string;
}


export interface QuizGameHttpQuestion {
  id: string;

  question: string;

  options: QuizGameHttpOption[];

  questionNumber: number | null;

  totalQuestions: number | null;

  timeLimit: number | null;

  startedAt: string | null;

  expiresAt: string | null;

  /*
   * HOST-ONLY answer information.
   *
   * These fields must NEVER be forwarded to students.
   */
  correctAnswer?: string | null;

  correctAnswers?: string[];

  answerKey?: string | string[] | null;

  correctValues?: string[];
}


export interface QuizGameHttpRound {
  quizId: string;

  roundNumber: number;

  totalQuestions: number;

  questions: QuizGameHttpQuestion[];
}


export interface QuizGameHttpQuiz {
  id: string;

  title: string;

  subject: string;

  description: string;

  currentRound: number;

  numberOfRounds: number;

  timePerQuestion: number;

  contestants: number;

  joinedCount: number;

  roomId: string | null;

  status: string | null;
}


/* ============================================================
   GENERIC HELPERS
   ============================================================ */

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}


function asString(
  value: unknown,
): string | null {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  return null;
}


function asNumber(
  value: unknown,
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const number = Number(value);

    if (
      Number.isFinite(number)
    ) {
      return number;
    }
  }

  return null;
}


function getData(
  payload: unknown,
): unknown {
  if (
    !isRecord(payload)
  ) {
    return payload;
  }

  if (
    "data" in payload
  ) {
    return payload.data;
  }

  if (
    "payload" in payload
  ) {
    return payload.payload;
  }

  return payload;
}


/* ============================================================
   OPTION NORMALIZATION
   ============================================================ */

function normalizeOption(
  value: unknown,
  index: number,
): QuizGameHttpOption {
  if (
    !isRecord(value)
  ) {
    const text =
      asString(value) ??
      "";

    return {
      label:
        String.fromCharCode(
          65 + index,
        ),

      value:
        text,

      text:
        text,
    };
  }

  const text =
    asString(value.text) ??
    asString(value.label) ??
    asString(value.value) ??
    "";

  const label =
    asString(value.label) ??
    String.fromCharCode(
      65 + index,
    );

  const optionValue =
    asString(value.value) ??
    text;

  return {
    label,

    value:
      optionValue,

    text,
  };
}


/* ============================================================
   QUESTION NORMALIZATION
   ============================================================ */

function normalizeQuestion(
  value: unknown,
): QuizGameHttpQuestion | null {
  if (
    !isRecord(value)
  ) {
    return null;
  }

  /*
   * Some APIs return:
   *
   * {
   *   question: {
   *     id,
   *     question,
   *     options
   *   }
   * }
   *
   * while others return the question directly.
   */

  const nestedQuestion =
    isRecord(value.question)
      ? value.question
      : null;

  const source =
    nestedQuestion ??
    value;

  const id =
    asString(source.id) ??
    asString(source._id) ??
    asString(value.questionId) ??
    asString(value.question_id);

  const questionText =
    asString(source.question) ??
    asString(source.text) ??
    asString(source.content);

  if (
    !id ||
    !questionText
  ) {
    return null;
  }

  const rawOptions =
    Array.isArray(source.options)
      ? source.options
      : Array.isArray(source.choices)
        ? source.choices
        : [];

  const options =
    rawOptions.map(
      (
        option,
        index,
      ) =>
        normalizeOption(
          option,
          index,
        ),
    );


  /* ==========================================================
     HOST ANSWER DATA
     ========================================================== */

  const correctAnswer =
    asString(
      source.correctAnswer,
    ) ??
    asString(
      source.correct_answer,
    );


  const rawCorrectAnswers =
    Array.isArray(
      source.correctAnswers,
    )
      ? source.correctAnswers
      : Array.isArray(
          source.correct_answers,
        )
        ? source.correct_answers
        : Array.isArray(
            source.correctValues,
          )
          ? source.correctValues
          : null;


  const correctAnswers =
    rawCorrectAnswers
      ? rawCorrectAnswers
          .map(asString)
          .filter(
            (
              answer,
            ): answer is string =>
              Boolean(answer),
          )
      : undefined;


  const rawAnswerKey =
    source.answerKey ??
    source.answer_key ??
    null;


  /* ==========================================================
     QUESTION NUMBER
     ========================================================== */

  const questionNumber =
    asNumber(
      source.questionNumber,
    ) ??
    asNumber(
      source.question_number,
    ) ??
    asNumber(
      value.questionNumber,
    ) ??
    asNumber(
      value.question_number,
    ) ??
    null;


  /* ==========================================================
     TOTAL QUESTIONS
     ========================================================== */

  const totalQuestions =
    asNumber(
      source.totalQuestions,
    ) ??
    asNumber(
      source.total_questions,
    ) ??
    asNumber(
      value.totalQuestions,
    ) ??
    asNumber(
      value.total_questions,
    ) ??
    null;


  /* ==========================================================
     TIME LIMIT
     ========================================================== */

  const timeLimit =
    asNumber(
      source.timeLimit,
    ) ??
    asNumber(
      source.time_limit,
    ) ??
    asNumber(
      source.timePerQuestion,
    ) ??
    asNumber(
      source.time_per_question,
    ) ??
    null;


  /* ==========================================================
     QUESTION TIMING
     ========================================================== */

  const startedAt =
    asString(
      source.startedAt,
    ) ??
    asString(
      source.started_at,
    ) ??
    null;


  const expiresAt =
    asString(
      source.expiresAt,
    ) ??
    asString(
      source.expires_at,
    ) ??
    null;


  return {
    id,

    question:
      questionText,

    options,

    questionNumber,

    totalQuestions,

    timeLimit,

    startedAt,

    expiresAt,

    /*
     * HOST-ONLY answer information.
     */
    correctAnswer,

    correctAnswers,

    answerKey:
      typeof rawAnswerKey ===
        "string" ||
      Array.isArray(
        rawAnswerKey,
      )
        ? rawAnswerKey
        : null,

    correctValues:
      correctAnswers,
  };
}


/* ============================================================
   QUESTION ARRAY EXTRACTION
   ============================================================ */

function extractQuestions(
  payload: unknown,
): QuizGameHttpQuestion[] {
  const data =
    getData(payload);

  if (
    Array.isArray(data)
  ) {
    return data
      .map(
        normalizeQuestion,
      )
      .filter(
        (
          question,
        ): question is QuizGameHttpQuestion =>
          Boolean(question),
      );
  }

  if (
    !isRecord(data)
  ) {
    return [];
  }

  const candidates = [
    data.questions,
    data.questionList,
    data.question_list,
    data.roundQuestions,
    data.round_questions,
    data.items,
  ];

  for (
    const candidate of candidates
  ) {
    if (
      !Array.isArray(candidate)
    ) {
      continue;
    }

    const questions =
      candidate
        .map(
          normalizeQuestion,
        )
        .filter(
          (
            question,
          ): question is QuizGameHttpQuestion =>
            Boolean(question),
        );

    if (
      questions.length > 0
    ) {
      return questions;
    }
  }

  const single =
    normalizeQuestion(
      data,
    );

  return single
    ? [single]
    : [];
}


/* ============================================================
   QUIZ NORMALIZATION
   ============================================================ */

function normalizeQuiz(
  payload: unknown,
): QuizGameHttpQuiz | null {
  const data =
    getData(payload);

  if (
    !isRecord(data)
  ) {
    return null;
  }

  const id =
    asString(data.id) ??
    asString(data._id) ??
    asString(data.quizId) ??
    asString(data.quiz_id);

  if (!id) {
    return null;
  }

  return {
    id,

    title:
      asString(
        data.title,
      ) ??
      asString(
        data.quiz_title,
      ) ??
      asString(
        data.quizTitle,
      ) ??
      "Quiz Competition",

    subject:
      asString(
        data.subject,
      ) ??
      "Quiz",

    description:
      asString(
        data.description,
      ) ??
      "",

    currentRound:
      asNumber(
        data.currentRound,
      ) ??
      asNumber(
        data.current_round,
      ) ??
      0,

    numberOfRounds:
      asNumber(
        data.numberOfRounds,
      ) ??
      asNumber(
        data.number_of_rounds,
      ) ??
      1,

    timePerQuestion:
      asNumber(
        data.timePerQuestion,
      ) ??
      asNumber(
        data.time_per_question,
      ) ??
      30,

    contestants:
      asNumber(
        data.noOfContestants,
      ) ??
      asNumber(
        data.no_of_contestants,
      ) ??
      asNumber(
        data.contestants,
      ) ??
      20,

    joinedCount:
      asNumber(
        data.joinedCount,
      ) ??
      asNumber(
        data.joined_count,
      ) ??
      asNumber(
        data.joinedUsers,
      ) ??
      asNumber(
        data.joined_users,
      ) ??
      0,

    roomId:
      asString(
        data.roomId,
      ) ??
      asString(
        data.room_id,
      ),

    status:
      asString(
        data.status,
      ),
  };
}


/* ============================================================
   CONTROLLER
   ============================================================ */

export class QuizGameHttpController {
  private readonly quizId: string;


  constructor(
    quizId: string,
  ) {
    this.quizId =
      String(
        quizId,
      ).trim();

    if (
      !this.quizId
    ) {
      throw new Error(
        "Quiz ID is required.",
      );
    }
  }


  /* ==========================================================
     GET QUIZ

     BACKUP:
       GET /quiz/get-quiz-by-quizId/{quizId}
     ========================================================== */

  async getQuiz(): Promise<QuizGameHttpQuiz> {
    console.log(
      "[Quiz Game HTTP] Loading quiz:",
      this.quizId,
    );

    const response =
      await axiosInstance.get(
        `/quiz/get-quiz-by-quizId/${encodeURIComponent(
          this.quizId,
        )}`,
      );

    const quiz =
      normalizeQuiz(
        response?.data,
      );

    if (!quiz) {
      throw new Error(
        "Unable to parse quiz information from the server.",
      );
    }

    return quiz;
  }


  /* ==========================================================
     GET ROUND QUESTIONS

     HOST BACKUP / RECOVERY

     EXACT REQUEST:

       GET /quiz/get-round-questions/{quizId}

     WITH:

       params: {
         roundNumber,
       }

     IMPORTANT
     ----------------------------------------------------------
     roundNumber is sent as a QUERY PARAMETER.

     Example:

       GET /quiz/get-round-questions/123
           ?roundNumber=2

     This prevents the previous problem where the backend
     received an invalid/missing round number.
     ========================================================== */

  async getRoundQuestions(
    roundNumber = 1,
  ): Promise<QuizGameHttpRound> {
    const normalizedRound =
      Math.max(
        1,
        Math.floor(
          Number(
            roundNumber,
          ) || 1,
        ),
      );

    console.log(
      "[Quiz Game HTTP] Loading round questions:",
      {
        quizId:
          this.quizId,

        roundNumber:
          normalizedRound,
      },
    );


    /*
     * ========================================================
     * EXACT HTTP REQUEST
     * ========================================================
     *
     * const response = await axiosInstance.get(
     *   `/quiz/get-round-questions/${quizId}`,
     *   {
     *     params: {
     *       roundNumber,
     *     },
     *   },
     * );
     *
     * Since this controller stores quizId on the instance,
     * this.quizId is used here.
     */

    const response =
      await axiosInstance.get(
        `/quiz/get-round-questions/${encodeURIComponent(
          this.quizId,
        )}`,
        {
          params: {
            roundNumber:
              normalizedRound,
          },
        },
      );


    /* ========================================================
       EXTRACT QUESTIONS
       ======================================================== */

    const questions =
      extractQuestions(
        response?.data,
      );


    if (
      questions.length === 0
    ) {
      throw new Error(
        `No questions were returned for round ${normalizedRound}.`,
      );
    }


    /* ========================================================
       NORMALIZE QUESTION NUMBERS
       ======================================================== */

    const normalizedQuestions =
      questions.map(
        (
          question,
          index,
        ) => ({
          ...question,

          questionNumber:
            question.questionNumber ??
            index + 1,

          totalQuestions:
            question.totalQuestions ??
            questions.length,
        }),
      );


    /* ========================================================
       RETURN NORMALIZED ROUND
       ======================================================== */

    return {
      quizId:
        this.quizId,

      roundNumber:
        normalizedRound,

      totalQuestions:
        normalizedQuestions.length,

      questions:
        normalizedQuestions,
    };
  }


  /* ==========================================================
     GET ALL ROUNDS

     HOST BACKUP

     Loads every round separately.

     Example:

       round 1
       round 2
       round 3
       round 4
       round 5

     Each request becomes:

       GET /quiz/get-round-questions/{quizId}
       ?roundNumber=N
     ========================================================== */

  async getAllRounds(
    numberOfRounds: number,
  ): Promise<QuizGameHttpRound[]> {
    const totalRounds =
      Math.max(
        1,
        Math.floor(
          Number(
            numberOfRounds,
          ) || 1,
        ),
      );

    const rounds:
      QuizGameHttpRound[] =
      [];


    for (
      let round = 1;
      round <= totalRounds;
      round += 1
    ) {
      const result =
        await this.getRoundQuestions(
          round,
        );

      rounds.push(
        result,
      );
    }


    return rounds;
  }


  /* ==========================================================
     SAFE STUDENT QUESTION PROJECTION

     IMPORTANT

     Removes:

       correctAnswer
       correctAnswers
       answerKey
       correctValues

     before a question reaches student UI.
     ========================================================== */

  toStudentQuestion(
    question: QuizGameHttpQuestion,
  ): Omit<
    QuizGameHttpQuestion,
    | "correctAnswer"
    | "correctAnswers"
    | "answerKey"
    | "correctValues"
  > {
    const {
      correctAnswer: _correctAnswer,
      correctAnswers: _correctAnswers,
      answerKey: _answerKey,
      correctValues: _correctValues,
      ...studentQuestion
    } = question;

    return studentQuestion;
  }


  /* ==========================================================
     SAFE STUDENT ROUND PROJECTION
     ========================================================== */

  toStudentRound(
    round: QuizGameHttpRound,
  ): {
    quizId: string;

    roundNumber: number;

    totalQuestions: number;

    questions: Array<
      Omit<
        QuizGameHttpQuestion,
        | "correctAnswer"
        | "correctAnswers"
        | "answerKey"
        | "correctValues"
      >
    >;
  } {
    return {
      quizId:
        round.quizId,

      roundNumber:
        round.roundNumber,

      totalQuestions:
        round.totalQuestions,

      questions:
        round.questions.map(
          (
            question,
          ) =>
            this.toStudentQuestion(
              question,
            ),
        ),
    };
  }
}


/* ============================================================
   FACTORY
   ============================================================ */

export function createQuizGameHttpController(
  quizId: string,
): QuizGameHttpController {
  return new QuizGameHttpController(
    quizId,
  );
}