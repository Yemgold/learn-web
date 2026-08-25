// src/stores/cbtStore.ts

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ============================================================
   TYPES
   ============================================================ */

export interface CbtOption {
  label: string;
  value: string;
}

export interface CbtQuestion {
  _id: string;

  question: string;

  options: CbtOption[];

  questionType?: string;
  difficulty?: string;

  /*
   * Correct answer is intentionally kept locally
   * because practice results are calculated on
   * the frontend.
   */
  answer?: string;
  correctAnswer?: string;
  correctAnswers?: string[];

  explanation?: string;
  solution?: string;

  subjectId?: string;
  subjectName?: string;

  year?: number | string;

  examType?: string;
  examYear?: string;

  apiQuestionId?: string;

  imageId?: string | null;
  passageId?: string | null;

  media?: unknown;
  content?: unknown[];

  isMultipleAnswer?: boolean;

  marks?: number;

  topic?: string | null;
  section?: string;

  plan?: string;
  subject?: string;
}

export interface CbtSubject {
  _id: string;
  name: string;
  slug?: string;
}

export interface CbtAnswerRecord {
  [questionId: string]: string;
}

/* ============================================================
   PRACTICE CONFIGURATION
   ============================================================ */

export interface CbtPracticeConfig {
  subjectId: string;

  mode:
    | "quick"
    | "standard"
    | "timed";

  questionCount: number;

  duration: number;

  examType: string;
}

/* ============================================================
   SESSION STATUS
   ============================================================ */

/**
 * Practice is frontend-only.
 *
 * These statuses describe the local Zustand state.
 * They do NOT represent backend sessions.
 */
export type CbtSessionStatus =
  | "idle"
  | "active"
  | "completed"
  | "failed";

/* ============================================================
   RESULT
   ============================================================ */

export interface CbtResult {
  _id?: string;

  id?: string;

  /*
   * This is only a local identifier.
   */
  sessionId?: string | null;

  score?: number;

  totalScore?: number;

  percentage?: number;

  correctAnswers?: number;

  incorrectAnswers?: number;

  unansweredQuestions?: number;

  totalQuestions?: number;

  passed?: boolean;

  grade?: string;

  durationInMinutes?: number;

  timeTakenSeconds?: number;

  startedAt?: string;

  submittedAt?: string;

  completedAt?: string;

  [key: string]: unknown;
}

/* ============================================================
   STATE
   ============================================================ */

interface CbtState {
  /* ----------------------------------------------------------
     LOCAL SESSION
     ---------------------------------------------------------- */

  /*
   * This is NOT a backend session.
   *
   * It only identifies the current practice locally.
   */
  sessionId: string | null;

  sessionStatus: CbtSessionStatus;

  sessionError: string | null;

  /* ----------------------------------------------------------
     PRACTICE CONFIG
     ---------------------------------------------------------- */

  practiceConfig: CbtPracticeConfig | null;

  /* ----------------------------------------------------------
     EXAM
     ---------------------------------------------------------- */

  isStarted: boolean;

  isSubmitted: boolean;

  /* ----------------------------------------------------------
     SUBJECTS
     ---------------------------------------------------------- */

  subjects: CbtSubject[];

  currentSubjectIndex: number;

  /* ----------------------------------------------------------
     QUESTIONS
     ---------------------------------------------------------- */

  questions: CbtQuestion[];

  currentQuestionIndex: number;

  /* ----------------------------------------------------------
     ANSWERS
     ---------------------------------------------------------- */

  answers: CbtAnswerRecord;

  /* ----------------------------------------------------------
     FLAGGED QUESTIONS
     ---------------------------------------------------------- */

  flaggedQuestions: string[];

  /* ----------------------------------------------------------
     TIMER
     ---------------------------------------------------------- */

  durationInMinutes: number;

  timeRemainingSeconds: number;

  /* ----------------------------------------------------------
     RESULT
     ---------------------------------------------------------- */

  result: CbtResult | null;

  /* ==========================================================
     LOCAL SESSION ACTIONS
     ========================================================== */

  setSessionId: (
    sessionId: string | null,
  ) => void;

  setSessionStatus: (
    status: CbtSessionStatus,
  ) => void;

  setSessionError: (
    error: string | null,
  ) => void;

  setResult: (
    result: CbtResult | null,
  ) => void;

  clearResult: () => void;

  /*
   * Compatibility method.
   *
   * No backend request.
   */
  markSessionActive: () => void;

  /*
   * Compatibility method.
   *
   * No backend request.
   */
  markSessionSubmitting: () => void;

  /*
   * Marks the local practice as completed.
   */
  markSessionCompleted: (
    result?: CbtResult | null,
  ) => void;

  /*
   * Marks local practice as failed.
   */
  markSessionFailed: (
    error: string,
  ) => void;

  /* ==========================================================
     PRACTICE CONFIG
     ========================================================== */

  setPracticeConfig: (
    config: CbtPracticeConfig | null,
  ) => void;

  clearPracticeConfig: () => void;

  hasMatchingActivePractice: (
    config: CbtPracticeConfig,
  ) => boolean;

  hasActivePractice: () => boolean;

  hasCompletedPractice: () => boolean;

  /* ==========================================================
     SUBJECT ACTIONS
     ========================================================== */

  setSubjects: (
    subjects: CbtSubject[],
  ) => void;

  setCurrentSubject: (
    index: number,
  ) => void;

  nextSubject: () => void;

  previousSubject: () => void;

  /* ==========================================================
     QUESTION ACTIONS
     ========================================================== */

  setQuestions: (
    questions: CbtQuestion[],
  ) => void;

  setCurrentQuestion: (
    index: number,
  ) => void;

  nextQuestion: () => void;

  previousQuestion: () => void;

  /* ==========================================================
     ANSWER ACTIONS
     ========================================================== */

  selectAnswer: (
    questionId: string,
    answer: string,
  ) => void;

  clearAnswer: (
    questionId: string,
  ) => void;

  /* ==========================================================
     FLAG ACTIONS
     ========================================================== */

  toggleFlag: (
    questionId: string,
  ) => void;

  isFlagged: (
    questionId: string,
  ) => boolean;

  /* ==========================================================
     TIMER ACTIONS
     ========================================================== */

  setDuration: (
    durationInMinutes: number,
  ) => void;

  setTimeRemaining: (
    seconds: number,
  ) => void;

  decreaseTime: () => void;

  /* ==========================================================
     EXAM ACTIONS
     ========================================================== */

  startExam: () => void;

  submitExam: () => void;

  resetExam: () => void;

  resetSession: () => void;
}

/* ============================================================
   INITIAL STATE
   ============================================================ */

const INITIAL_STATE = {
  /* SESSION */

  sessionId: null as string | null,

  sessionStatus:
    "idle" as CbtSessionStatus,

  sessionError: null as string | null,

  /* PRACTICE */

  practiceConfig:
    null as CbtPracticeConfig | null,

  /* EXAM */

  isStarted: false,

  isSubmitted: false,

  /* SUBJECTS */

  subjects: [] as CbtSubject[],

  currentSubjectIndex: 0,

  /* QUESTIONS */

  questions: [] as CbtQuestion[],

  currentQuestionIndex: 0,

  /* ANSWERS */

  answers: {} as CbtAnswerRecord,

  /* FLAGS */

  flaggedQuestions: [] as string[],

  /* TIMER */

  durationInMinutes: 0,

  timeRemainingSeconds: 0,

  /* RESULT */

  result: null as CbtResult | null,
};

/* ============================================================
   HELPERS
   ============================================================ */

function normalizeAnswer(
  value: unknown,
): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function getCorrectAnswer(
  question: CbtQuestion,
): string | null {
  const possibleAnswers = [
    question.correctAnswer,
    question.answer,
    question.correctAnswers?.[0],
  ];

  for (const answer of possibleAnswers) {
    if (
      typeof answer === "string" &&
      answer.trim()
    ) {
      return answer.trim();
    }
  }

  return null;
}

/* ============================================================
   STORE
   ============================================================ */

export const useCbtStore =
  create<CbtState>()(
    persist(
      (set, get) => ({
        ...INITIAL_STATE,

        /* ======================================================
           LOCAL SESSION
           ====================================================== */

        setSessionId: (
          sessionId,
        ) => {
          set({
            sessionId,
          });
        },

        setSessionStatus: (
          sessionStatus,
        ) => {
          set({
            sessionStatus,
          });
        },

        setSessionError: (
          sessionError,
        ) => {
          set({
            sessionError,
          });
        },

        setResult: (
          result,
        ) => {
          set({
            result,
          });
        },

        clearResult: () => {
          set({
            result: null,
          });
        },

        /*
         * Frontend only.
         */
        markSessionActive: () => {
          set({
            sessionStatus: "active",

            sessionError: null,

            isStarted: true,

            isSubmitted: false,
          });
        },

        /*
         * Compatibility method.
         *
         * There is no backend submission.
         */
        markSessionSubmitting: () => {
          /*
           * We deliberately do not expose
           * a "submitting" state anymore.
           *
           * Result calculation happens locally.
           */
        },

        /*
         * Complete the local practice.
         */
        markSessionCompleted: (
          result = null,
        ) => {
          set({
            sessionStatus: "completed",

            isSubmitted: true,

            isStarted: false,

            result,

            sessionError: null,
          });
        },

        /*
         * Local failure only.
         */
        markSessionFailed: (
          error,
        ) => {
          set({
            sessionStatus: "failed",

            sessionError: error,
          });
        },

        /* ======================================================
           PRACTICE CONFIG
           ====================================================== */

        setPracticeConfig: (
          practiceConfig,
        ) => {
          set({
            practiceConfig,
          });
        },

        clearPracticeConfig: () => {
          set({
            practiceConfig: null,
          });
        },

        /*
         * Check whether the currently stored
         * frontend practice can be resumed.
         */
        hasMatchingActivePractice: (
          config,
        ) => {
          const state = get();

          if (
            state.questions.length ===
            0
          ) {
            return false;
          }

          if (
            state.isSubmitted ||
            state.sessionStatus ===
              "completed"
          ) {
            return false;
          }

          if (
            !state.isStarted ||
            state.sessionStatus !==
              "active"
          ) {
            return false;
          }

          if (
            !state.practiceConfig
          ) {
            return false;
          }

          const cached =
            state.practiceConfig;

          return (
            cached.subjectId ===
              config.subjectId &&
            cached.mode ===
              config.mode &&
            cached.questionCount ===
              config.questionCount &&
            cached.duration ===
              config.duration &&
            cached.examType
              .trim()
              .toLowerCase() ===
              config.examType
                .trim()
                .toLowerCase()
          );
        },

        hasActivePractice: () => {
          const state = get();

          return Boolean(
            state.questions.length >
              0 &&
              state.isStarted &&
              !state.isSubmitted &&
              state.sessionStatus ===
                "active" &&
              state.practiceConfig,
          );
        },

        hasCompletedPractice: () => {
          const state = get();

          return (
            state.isSubmitted ||
            state.sessionStatus ===
              "completed"
          );
        },

        /* ======================================================
           SUBJECTS
           ====================================================== */

        setSubjects: (
          subjects,
        ) => {
          set({
            subjects,

            currentSubjectIndex: 0,
          });
        },

        setCurrentSubject: (
          index,
        ) => {
          const {
            subjects,
          } = get();

          if (
            index < 0 ||
            index >= subjects.length
          ) {
            return;
          }

          set({
            currentSubjectIndex:
              index,

            currentQuestionIndex: 0,
          });
        },

        nextSubject: () => {
          const {
            currentSubjectIndex,
            subjects,
          } = get();

          if (
            currentSubjectIndex <
            subjects.length - 1
          ) {
            set({
              currentSubjectIndex:
                currentSubjectIndex +
                1,

              currentQuestionIndex: 0,
            });
          }
        },

        previousSubject: () => {
          const {
            currentSubjectIndex,
          } = get();

          if (
            currentSubjectIndex >
            0
          ) {
            set({
              currentSubjectIndex:
                currentSubjectIndex -
                1,

              currentQuestionIndex: 0,
            });
          }
        },

        /* ======================================================
           QUESTIONS
           ====================================================== */

        setQuestions: (
          questions,
        ) => {
          /*
           * NEW FRONTEND PRACTICE.
           *
           * Old answers, flags and result
           * must be removed.
           */

          set({
            questions,

            currentQuestionIndex: 0,

            answers: {},

            flaggedQuestions: [],

            isStarted: false,

            isSubmitted: false,

            result: null,

            sessionError: null,

            sessionStatus: "idle",

            sessionId: null,
          });
        },

        setCurrentQuestion: (
          index,
        ) => {
          const {
            questions,
          } = get();

          if (
            index < 0 ||
            index >= questions.length
          ) {
            return;
          }

          set({
            currentQuestionIndex:
              index,
          });
        },

        nextQuestion: () => {
          const {
            currentQuestionIndex,
            questions,
          } = get();

          if (
            currentQuestionIndex <
            questions.length - 1
          ) {
            set({
              currentQuestionIndex:
                currentQuestionIndex +
                1,
            });
          }
        },

        previousQuestion: () => {
          const {
            currentQuestionIndex,
          } = get();

          if (
            currentQuestionIndex >
            0
          ) {
            set({
              currentQuestionIndex:
                currentQuestionIndex -
                1,
            });
          }
        },

        /* ======================================================
           ANSWERS
           ====================================================== */

        selectAnswer: (
          questionId,
          answer,
        ) => {
          const {
            answers,
            isStarted,
            isSubmitted,
          } = get();

          if (!isStarted) {
            return;
          }

          if (isSubmitted) {
            return;
          }

          set({
            answers: {
              ...answers,

              [questionId]:
                answer,
            },
          });
        },

        clearAnswer: (
          questionId,
        ) => {
          const {
            answers,
            isStarted,
            isSubmitted,
          } = get();

          if (!isStarted) {
            return;
          }

          if (isSubmitted) {
            return;
          }

          const nextAnswers = {
            ...answers,
          };

          delete nextAnswers[
            questionId
          ];

          set({
            answers:
              nextAnswers,
          });
        },

        /* ======================================================
           FLAGS
           ====================================================== */

        toggleFlag: (
          questionId,
        ) => {
          const {
            flaggedQuestions,
            isStarted,
            isSubmitted,
          } = get();

          if (!isStarted) {
            return;
          }

          if (isSubmitted) {
            return;
          }

          const alreadyFlagged =
            flaggedQuestions.includes(
              questionId,
            );

          set({
            flaggedQuestions:
              alreadyFlagged
                ? flaggedQuestions.filter(
                    (id) =>
                      id !==
                      questionId,
                  )
                : [
                    ...flaggedQuestions,
                    questionId,
                  ],
          });
        },

        isFlagged: (
          questionId,
        ) => {
          return get().flaggedQuestions.includes(
            questionId,
          );
        },

        /* ======================================================
           TIMER
           ====================================================== */

        setDuration: (
          durationInMinutes,
        ) => {
          const safeDuration =
            Math.max(
              0,
              Number(
                durationInMinutes,
              ) || 0,
            );

          set({
            durationInMinutes:
              safeDuration,

            timeRemainingSeconds:
              safeDuration * 60,
          });
        },

        setTimeRemaining: (
          seconds,
        ) => {
          set({
            timeRemainingSeconds:
              Math.max(
                0,
                Math.floor(
                  Number(
                    seconds,
                  ) || 0,
                ),
              ),
          });
        },

        decreaseTime: () => {
          const {
            timeRemainingSeconds,
            isStarted,
            isSubmitted,
          } = get();

          if (
            !isStarted ||
            isSubmitted ||
            timeRemainingSeconds <=
              0
          ) {
            return;
          }

          set({
            timeRemainingSeconds:
              timeRemainingSeconds -
              1,
          });
        },

        /* ======================================================
           START EXAM
           ====================================================== */

        startExam: () => {
          const {
            durationInMinutes,
            timeRemainingSeconds,
            questions,
          } = get();

          if (
            questions.length ===
            0
          ) {
            return;
          }

          /*
           * If a timer already exists,
           * preserve it.
           *
           * This allows the student to
           * resume the practice.
           */
          const initialTime =
            timeRemainingSeconds >
            0
              ? timeRemainingSeconds
              : durationInMinutes *
                60;

          set({
            isStarted: true,

            isSubmitted: false,

            sessionStatus: "active",

            timeRemainingSeconds:
              initialTime,

            sessionError: null,
          });
        },

        /* ======================================================
           SUBMIT EXAM
           ====================================================== */

        submitExam: () => {
          const {
            questions,
            answers,
            durationInMinutes,
            sessionId,
          } = get();

          if (
            questions.length ===
            0
          ) {
            return;
          }

          if (get().isSubmitted) {
            return;
          }

          let correctAnswers = 0;

          let incorrectAnswers = 0;

          let unansweredQuestions = 0;

          let totalScore = 0;

          let maximumScore = 0;

          /* ----------------------------------------------------
             CALCULATE RESULT
             ---------------------------------------------------- */

          questions.forEach(
            (question) => {
              const marks = Math.max(
                0,
                Number(
                  question.marks ??
                    1,
                ) || 1,
              );

              maximumScore +=
                marks;

              const studentAnswer =
                answers[
                  question._id
                ];

              /*
               * Unanswered.
               */
              if (
                studentAnswer ===
                  undefined ||
                studentAnswer ===
                  null ||
                studentAnswer ===
                  ""
              ) {
                unansweredQuestions++;

                return;
              }

              const correctAnswer =
                getCorrectAnswer(
                  question,
                );

              /*
               * If the backend did not
               * provide a correct answer,
               * do not count it as correct.
               */
              if (
                correctAnswer ===
                null
              ) {
                incorrectAnswers++;

                return;
              }

              const student =
                normalizeAnswer(
                  studentAnswer,
                );

              const correct =
                normalizeAnswer(
                  correctAnswer,
                );

              if (
                student ===
                correct
              ) {
                correctAnswers++;

                totalScore +=
                  marks;
              } else {
                incorrectAnswers++;
              }
            },
          );

          const totalQuestions =
            questions.length;

          /*
           * Percentage is based on
           * number of correctly answered
           * questions.
           */
          const percentage =
            totalQuestions > 0
              ? Math.round(
                  (correctAnswers /
                    totalQuestions) *
                    100,
                )
              : 0;

          const result: CbtResult =
            {
              sessionId:
                sessionId,

              score:
                totalScore,

              totalScore:
                maximumScore,

              percentage,

              correctAnswers,

              incorrectAnswers,

              unansweredQuestions,

              totalQuestions,

              passed:
                percentage >= 50,

              grade:
                percentage >= 70
                  ? "A"
                  : percentage >= 60
                    ? "B"
                    : percentage >=
                        50
                      ? "C"
                      : percentage >=
                          45
                        ? "D"
                        : "F",

              durationInMinutes,

              submittedAt:
                new Date().toISOString(),
            };

          /*
           * EVERYTHING ENDS LOCALLY.
           *
           * No API call.
           */
          set({
            isSubmitted: true,

            isStarted: false,

            sessionStatus:
              "completed",

            result,

            sessionError: null,
          });
        },

        /* ======================================================
           RESET EXAM
           ====================================================== */

        resetExam: () => {
          set({
            ...INITIAL_STATE,
          });
        },

        /* ======================================================
           RESET SESSION
           ====================================================== */

        resetSession: () => {
          set({
            ...INITIAL_STATE,
          });
        },
      }),

      /* ========================================================
         PERSISTENCE
         ======================================================== */

      {
        name:
          "jamb-league-cbt-practice",

        partialize: (
          state,
        ) => ({
          /*
           * LOCAL SESSION
           */

          sessionId:
            state.sessionId,

          sessionStatus:
            state.sessionStatus,

          sessionError:
            state.sessionError,

          /*
           * PRACTICE
           */

          practiceConfig:
            state.practiceConfig,

          /*
           * EXAM
           */

          isStarted:
            state.isStarted,

          isSubmitted:
            state.isSubmitted,

          /*
           * SUBJECTS
           */

          subjects:
            state.subjects,

          currentSubjectIndex:
            state.currentSubjectIndex,

          /*
           * QUESTIONS
           */

          questions:
            state.questions,

          currentQuestionIndex:
            state.currentQuestionIndex,

          /*
           * ANSWERS
           */

          answers:
            state.answers,

          /*
           * FLAGS
           */

          flaggedQuestions:
            state.flaggedQuestions,

          /*
           * TIMER
           */

          durationInMinutes:
            state.durationInMinutes,

          timeRemainingSeconds:
            state.timeRemainingSeconds,

          /*
           * RESULT
           */

          result:
            state.result,
        }),
      },
    ),
  );

/* ============================================================
   SELECTORS
   ============================================================ */

export const selectCurrentQuestion = (
  state: CbtState,
) =>
  state.questions[
    state.currentQuestionIndex
  ] ?? null;

export const selectCurrentSubject = (
  state: CbtState,
) =>
  state.subjects[
    state.currentSubjectIndex
  ] ?? null;

export const selectAnsweredCount = (
  state: CbtState,
) =>
  Object.values(
    state.answers,
  ).filter(
    (answer) =>
      answer !== undefined &&
      answer !== null &&
      answer !== "",
  ).length;

export const selectUnansweredCount = (
  state: CbtState,
) =>
  Math.max(
    state.questions.length -
      Object.values(
        state.answers,
      ).filter(
        (answer) =>
          answer !== undefined &&
          answer !== null &&
          answer !== "",
      ).length,
    0,
  );

export const selectFlaggedCount = (
  state: CbtState,
) =>
  state.flaggedQuestions.length;

export const selectAnsweredPercentage = (
  state: CbtState,
) => {
  if (
    state.questions.length ===
    0
  ) {
    return 0;
  }

  const answered =
    Object.values(
      state.answers,
    ).filter(
      (answer) =>
        answer !== undefined &&
        answer !== null &&
        answer !== "",
    ).length;

  return Math.round(
    (answered /
      state.questions.length) *
      100,
  );
};

export const selectIsSessionActive = (
  state: CbtState,
) =>
  Boolean(
    state.practiceConfig &&
      state.questions.length >
        0 &&
      state.isStarted &&
      !state.isSubmitted &&
      state.sessionStatus ===
        "active",
  );

export const selectIsSessionCompleted = (
  state: CbtState,
) =>
  state.sessionStatus ===
  "completed";



// // src/stores/cbtStore.ts

// "use client";

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// /* ============================================================
//    TYPES
//    ============================================================ */

// export interface CbtOption {
//   label: string;
//   value: string;
// }

// export interface CbtQuestion {
//   _id: string;
//   question: string;
//   options: CbtOption[];

//   questionType?: string;
//   difficulty?: string;

//   /*
//    * These fields may come from the backend.
//    *
//    * They are stored locally so the application can
//    * calculate results after submission.
//    *
//    * They should NOT be displayed during the examination.
//    */
//   answer?: string;
//   correctAnswer?: string;
//   correctAnswers?: string[];

//   explanation?: string;
//   solution?: string;

//   subjectId?: string;
//   subjectName?: string;

//   year?: number | string;

//   examType?: string;
//   examYear?: string;

//   apiQuestionId?: string;

//   imageId?: string | null;
//   passageId?: string | null;

//   media?: unknown;
//   content?: unknown[];

//   isMultipleAnswer?: boolean;
//   marks?: number;

//   topic?: string | null;
//   section?: string;

//   plan?: string;
//   subject?: string;
// }

// export interface CbtSubject {
//   _id: string;
//   name: string;
//   slug?: string;
// }

// export interface CbtAnswerRecord {
//   [questionId: string]: string;
// }

// /* ============================================================
//    PRACTICE CONFIGURATION
//    ============================================================ */

// /**
//  * Identifies exactly which practice generated the
//  * currently stored questions.
//  *
//  * This is what allows the frontend to decide whether
//  * it can resume an existing practice or must request
//  * a completely new practice from the backend.
//  */
// export interface CbtPracticeConfig {
//   subjectId: string;

//   mode:
//     | "quick"
//     | "standard"
//     | "timed";

//   questionCount: number;

//   duration: number;

//   examType: string;
// }

// /* ============================================================
//    SESSION STATUS
//    ============================================================ */

// export type CbtSessionStatus =
//   | "idle"
//   | "creating"
//   | "active"
//   | "submitting"
//   | "completed"
//   | "failed";

// /* ============================================================
//    BACKEND RESULT
//    ============================================================ */

// export interface CbtResult {
//   _id?: string;
//   id?: string;

//   sessionId?: string;

//   score?: number;
//   totalScore?: number;

//   percentage?: number;

//   correctAnswers?: number;
//   incorrectAnswers?: number;
//   unansweredQuestions?: number;

//   totalQuestions?: number;

//   passed?: boolean;

//   grade?: string;

//   durationInMinutes?: number;
//   timeTakenSeconds?: number;

//   startedAt?: string;
//   submittedAt?: string;
//   completedAt?: string;

//   [key: string]: unknown;
// }

// /* ============================================================
//    STATE
//    ============================================================ */

// interface CbtState {
//   /* ----------------------------------------------------------
//      SESSION
//      ---------------------------------------------------------- */

//   sessionId: string | null;

//   sessionStatus: CbtSessionStatus;

//   sessionError: string | null;

//   /*
//    * Identifies the practice currently stored in the frontend.
//    *
//    * This remains available after completion so the application
//    * knows what the previous practice was, but completed
//    * sessions must NEVER be reused as active practice.
//    */
//   practiceConfig: CbtPracticeConfig | null;

//   /* ----------------------------------------------------------
//      EXAM
//      ---------------------------------------------------------- */

//   isStarted: boolean;

//   isSubmitted: boolean;

//   /* ----------------------------------------------------------
//      SUBJECTS
//      ---------------------------------------------------------- */

//   subjects: CbtSubject[];

//   currentSubjectIndex: number;

//   /* ----------------------------------------------------------
//      QUESTIONS
//      ---------------------------------------------------------- */

//   questions: CbtQuestion[];

//   currentQuestionIndex: number;

//   /* ----------------------------------------------------------
//      ANSWERS
//      ---------------------------------------------------------- */

//   answers: CbtAnswerRecord;

//   /*
//    * Tracks questions whose answers have been
//    * successfully synchronized with the backend.
//    */
//   syncedAnswers: string[];

//   /*
//    * Tracks questions currently being synchronized.
//    */
//   syncingAnswers: string[];

//   /*
//    * Tracks questions whose answer synchronization
//    * failed.
//    */
//   failedAnswers: string[];

//   /* ----------------------------------------------------------
//      FLAGGED QUESTIONS
//      ---------------------------------------------------------- */

//   flaggedQuestions: string[];

//   /* ----------------------------------------------------------
//      TIMER
//      ---------------------------------------------------------- */

//   durationInMinutes: number;

//   timeRemainingSeconds: number;

//   /* ----------------------------------------------------------
//      RESULT
//      ---------------------------------------------------------- */

//   result: CbtResult | null;

//   /* ==========================================================
//      SESSION ACTIONS
//      ========================================================== */

//   setSessionId: (
//     sessionId: string | null,
//   ) => void;

//   setSessionStatus: (
//     status: CbtSessionStatus,
//   ) => void;

//   setSessionError: (
//     error: string | null,
//   ) => void;

//   setResult: (
//     result: CbtResult | null,
//   ) => void;

//   clearResult: () => void;

//   markSessionCreating: () => void;

//   markSessionActive: () => void;

//   markSessionSubmitting: () => void;

//   markSessionCompleted: (
//     result?: CbtResult | null,
//   ) => void;

//   markSessionFailed: (
//     error: string,
//   ) => void;

//   /* ==========================================================
//      PRACTICE CACHE ACTIONS
//      ========================================================== */

//   setPracticeConfig: (
//     config: CbtPracticeConfig | null,
//   ) => void;

//   clearPracticeConfig: () => void;

//   /*
//    * Returns true ONLY when:
//    *
//    * 1. A practice exists
//    * 2. Questions exist
//    * 3. The practice is currently active
//    * 4. The requested configuration exactly matches
//    *    the stored configuration
//    *
//    * Completed sessions return false.
//    */
//   hasMatchingActivePractice: (
//     config: CbtPracticeConfig,
//   ) => boolean;

//   /*
//    * Returns true when the store contains an unfinished
//    * practice session with questions.
//    */
//   hasActivePractice: () => boolean;

//   /*
//    * Returns true when the stored practice has been
//    * completed/submitted.
//    */
//   hasCompletedPractice: () => boolean;

//   /* ==========================================================
//      SUBJECT ACTIONS
//      ========================================================== */

//   setSubjects: (
//     subjects: CbtSubject[],
//   ) => void;

//   setCurrentSubject: (
//     index: number,
//   ) => void;

//   nextSubject: () => void;

//   previousSubject: () => void;

//   /* ==========================================================
//      QUESTION ACTIONS
//      ========================================================== */

//   setQuestions: (
//     questions: CbtQuestion[],
//   ) => void;

//   setCurrentQuestion: (
//     index: number,
//   ) => void;

//   nextQuestion: () => void;

//   previousQuestion: () => void;

//   /* ==========================================================
//      ANSWER ACTIONS
//      ========================================================== */

//   selectAnswer: (
//     questionId: string,
//     answer: string,
//   ) => void;

//   clearAnswer: (
//     questionId: string,
//   ) => void;

//   markAnswerSyncing: (
//     questionId: string,
//   ) => void;

//   markAnswerSynced: (
//     questionId: string,
//   ) => void;

//   markAnswerSyncFailed: (
//     questionId: string,
//   ) => void;

//   clearAnswerSyncState: (
//     questionId: string,
//   ) => void;

//   /* ==========================================================
//      FLAG ACTIONS
//      ========================================================== */

//   toggleFlag: (
//     questionId: string,
//   ) => void;

//   isFlagged: (
//     questionId: string,
//   ) => boolean;

//   /* ==========================================================
//      TIMER ACTIONS
//      ========================================================== */

//   setDuration: (
//     durationInMinutes: number,
//   ) => void;

//   setTimeRemaining: (
//     seconds: number,
//   ) => void;

//   decreaseTime: () => void;

//   /* ==========================================================
//      EXAM ACTIONS
//      ========================================================== */

//   startExam: () => void;

//   submitExam: () => void;

//   resetExam: () => void;

//   resetSession: () => void;
// }

// /* ============================================================
//    INITIAL STATE
//    ============================================================ */

// const INITIAL_STATE = {
//   /* SESSION */

//   sessionId: null,

//   sessionStatus:
//     "idle" as CbtSessionStatus,

//   sessionError: null,

//   practiceConfig:
//     null as CbtPracticeConfig | null,

//   /* EXAM */

//   isStarted: false,

//   isSubmitted: false,

//   /* SUBJECTS */

//   subjects: [],

//   currentSubjectIndex: 0,

//   /* QUESTIONS */

//   questions: [],

//   currentQuestionIndex: 0,

//   /* ANSWERS */

//   answers: {},

//   syncedAnswers: [],

//   syncingAnswers: [],

//   failedAnswers: [],

//   /* FLAGS */

//   flaggedQuestions: [],

//   /* TIMER */

//   durationInMinutes: 0,

//   timeRemainingSeconds: 0,

//   /* RESULT */

//   result: null,
// };

// /* ============================================================
//    STORE
//    ============================================================ */

// export const useCbtStore =
//   create<CbtState>()(
//     persist(
//       (set, get) => ({
//         ...INITIAL_STATE,

//         /* ======================================================
//            SESSION
//            ====================================================== */

//         setSessionId: (
//           sessionId,
//         ) => {
//           set({
//             sessionId,
//           });
//         },

//         setSessionStatus: (
//           sessionStatus,
//         ) => {
//           set({
//             sessionStatus,
//           });
//         },

//         setSessionError: (
//           sessionError,
//         ) => {
//           set({
//             sessionError,
//           });
//         },

//         setResult: (
//           result,
//         ) => {
//           set({
//             result,
//           });
//         },

//         clearResult: () => {
//           set({
//             result: null,
//           });
//         },

//         markSessionCreating: () => {
//           set({
//             sessionStatus: "creating",
//             sessionError: null,
//           });
//         },

//         markSessionActive: () => {
//           set({
//             sessionStatus: "active",
//             sessionError: null,
//             isStarted: true,
//             isSubmitted: false,
//           });
//         },

//         markSessionSubmitting: () => {
//           set({
//             sessionStatus: "submitting",
//           });
//         },

//         markSessionCompleted: (
//           result = null,
//         ) => {
//           set({
//             sessionStatus: "completed",

//             isSubmitted: true,

//             isStarted: false,

//             result,
//           });
//         },

//         markSessionFailed: (
//           error,
//         ) => {
//           set({
//             sessionStatus: "failed",

//             sessionError: error,
//           });
//         },

//         /* ======================================================
//            PRACTICE CACHE
//            ====================================================== */

//         setPracticeConfig: (
//           practiceConfig,
//         ) => {
//           set({
//             practiceConfig,
//           });
//         },

//         clearPracticeConfig: () => {
//           set({
//             practiceConfig: null,
//           });
//         },

//         hasMatchingActivePractice: (
//           config,
//         ) => {
//           const state = get();

//           /*
//            * There must actually be questions stored.
//            */
//           if (
//             state.questions.length === 0
//           ) {
//             return false;
//           }

//           /*
//            * A completed/submitted practice
//            * must NEVER be reused.
//            */
//           if (
//             state.isSubmitted ||
//             state.sessionStatus ===
//               "completed"
//           ) {
//             return false;
//           }

//           /*
//            * The session must still be active.
//            */
//           if (
//             !state.isStarted ||
//             state.sessionStatus !==
//               "active"
//           ) {
//             return false;
//           }

//           /*
//            * Configuration must exist.
//            */
//           if (
//             !state.practiceConfig
//           ) {
//             return false;
//           }

//           const cached =
//             state.practiceConfig;

//           /*
//            * Every important practice
//            * configuration value must match.
//            */
//           return (
//             cached.subjectId ===
//               config.subjectId &&
//             cached.mode ===
//               config.mode &&
//             cached.questionCount ===
//               config.questionCount &&
//             cached.duration ===
//               config.duration &&
//             cached.examType
//               .trim()
//               .toLowerCase() ===
//               config.examType
//                 .trim()
//                 .toLowerCase()
//           );
//         },

//         hasActivePractice: () => {
//           const state = get();

//           return Boolean(
//             state.questions.length >
//               0 &&
//               state.isStarted &&
//               !state.isSubmitted &&
//               state.sessionStatus ===
//                 "active" &&
//               state.practiceConfig,
//           );
//         },

//         hasCompletedPractice: () => {
//           const state = get();

//           return (
//             state.isSubmitted ||
//             state.sessionStatus ===
//               "completed"
//           );
//         },

//         /* ======================================================
//            SUBJECTS
//            ====================================================== */

//         setSubjects: (
//           subjects,
//         ) => {
//           set({
//             subjects,

//             currentSubjectIndex: 0,
//           });
//         },

//         setCurrentSubject: (
//           index,
//         ) => {
//           const {
//             subjects,
//           } = get();

//           if (
//             index < 0 ||
//             index >= subjects.length
//           ) {
//             return;
//           }

//           set({
//             currentSubjectIndex:
//               index,

//             currentQuestionIndex: 0,
//           });
//         },

//         nextSubject: () => {
//           const {
//             currentSubjectIndex,
//             subjects,
//           } = get();

//           if (
//             currentSubjectIndex <
//             subjects.length - 1
//           ) {
//             set({
//               currentSubjectIndex:
//                 currentSubjectIndex +
//                 1,

//               currentQuestionIndex: 0,
//             });
//           }
//         },

//         previousSubject: () => {
//           const {
//             currentSubjectIndex,
//           } = get();

//           if (
//             currentSubjectIndex >
//             0
//           ) {
//             set({
//               currentSubjectIndex:
//                 currentSubjectIndex -
//                 1,

//               currentQuestionIndex: 0,
//             });
//           }
//         },

//         /* ======================================================
//            QUESTIONS
//            ====================================================== */

//         setQuestions: (
//           questions,
//         ) => {
//           /*
//            * IMPORTANT:
//            *
//            * This function represents a NEW practice.
//            *
//            * Therefore old answers, flags, result and
//            * synchronization state are intentionally cleared.
//            *
//            * When resuming an existing active practice,
//            * DO NOT call setQuestions().
//            *
//            * Simply use the questions already in the store.
//            */
//           set({
//             questions,

//             currentQuestionIndex: 0,

//             answers: {},

//             syncedAnswers: [],

//             syncingAnswers: [],

//             failedAnswers: [],

//             flaggedQuestions: [],

//             isStarted: false,

//             isSubmitted: false,

//             result: null,

//             sessionError: null,

//             sessionStatus:
//               "idle",
//           });
//         },

//         setCurrentQuestion: (
//           index,
//         ) => {
//           const {
//             questions,
//           } = get();

//           if (
//             index < 0 ||
//             index >= questions.length
//           ) {
//             return;
//           }

//           set({
//             currentQuestionIndex:
//               index,
//           });
//         },

//         nextQuestion: () => {
//           const {
//             currentQuestionIndex,
//             questions,
//           } = get();

//           if (
//             currentQuestionIndex <
//             questions.length - 1
//           ) {
//             set({
//               currentQuestionIndex:
//                 currentQuestionIndex +
//                 1,
//             });
//           }
//         },

//         previousQuestion: () => {
//           const {
//             currentQuestionIndex,
//           } = get();

//           if (
//             currentQuestionIndex >
//             0
//           ) {
//             set({
//               currentQuestionIndex:
//                 currentQuestionIndex -
//                 1,
//             });
//           }
//         },

//         /* ======================================================
//            ANSWERS
//            ====================================================== */

//         selectAnswer: (
//           questionId,
//           answer,
//         ) => {
//           const {
//             answers,
//             isStarted,
//             isSubmitted,
//           } = get();

//           /*
//            * Do not allow answers before
//            * the examination has started.
//            */
//           if (!isStarted) {
//             return;
//           }

//           /*
//            * Do not allow answers after
//            * submission.
//            */
//           if (isSubmitted) {
//             return;
//           }

//           set({
//             answers: {
//               ...answers,

//               [questionId]:
//                 answer,
//             },

//             /*
//              * A changed answer is no longer
//              * considered synchronized.
//              */
//             syncedAnswers:
//               get().syncedAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),

//             syncingAnswers:
//               get().syncingAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),

//             failedAnswers:
//               get().failedAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),
//           });
//         },

//         clearAnswer: (
//           questionId,
//         ) => {
//           const {
//             answers,
//             isStarted,
//             isSubmitted,
//           } = get();

//           if (!isStarted) {
//             return;
//           }

//           if (isSubmitted) {
//             return;
//           }

//           const nextAnswers = {
//             ...answers,
//           };

//           delete nextAnswers[
//             questionId
//           ];

//           set({
//             answers:
//               nextAnswers,

//             syncedAnswers:
//               get().syncedAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),

//             syncingAnswers:
//               get().syncingAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),

//             failedAnswers:
//               get().failedAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),
//           });
//         },

//         /* ======================================================
//            ANSWER SYNC STATE
//            ====================================================== */

//         markAnswerSyncing: (
//           questionId,
//         ) => {
//           const {
//             syncingAnswers,
//             failedAnswers,
//           } = get();

//           set({
//             syncingAnswers:
//               syncingAnswers.includes(
//                 questionId,
//               )
//                 ? syncingAnswers
//                 : [
//                     ...syncingAnswers,
//                     questionId,
//                   ],

//             failedAnswers:
//               failedAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),
//           });
//         },

//         markAnswerSynced: (
//           questionId,
//         ) => {
//           const {
//             syncingAnswers,
//             syncedAnswers,
//             failedAnswers,
//           } = get();

//           set({
//             syncingAnswers:
//               syncingAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),

//             syncedAnswers:
//               syncedAnswers.includes(
//                 questionId,
//               )
//                 ? syncedAnswers
//                 : [
//                     ...syncedAnswers,
//                     questionId,
//                   ],

//             failedAnswers:
//               failedAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),
//           });
//         },

//         markAnswerSyncFailed: (
//           questionId,
//         ) => {
//           const {
//             syncingAnswers,
//             failedAnswers,
//           } = get();

//           set({
//             syncingAnswers:
//               syncingAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),

//             failedAnswers:
//               failedAnswers.includes(
//                 questionId,
//               )
//                 ? failedAnswers
//                 : [
//                     ...failedAnswers,
//                     questionId,
//                   ],
//           });
//         },

//         clearAnswerSyncState: (
//           questionId,
//         ) => {
//           const {
//             syncingAnswers,
//             syncedAnswers,
//             failedAnswers,
//           } = get();

//           set({
//             syncingAnswers:
//               syncingAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),

//             syncedAnswers:
//               syncedAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),

//             failedAnswers:
//               failedAnswers.filter(
//                 (id) =>
//                   id !== questionId,
//               ),
//           });
//         },

//         /* ======================================================
//            FLAGS
//            ====================================================== */

//         toggleFlag: (
//           questionId,
//         ) => {
//           const {
//             flaggedQuestions,
//             isStarted,
//             isSubmitted,
//           } = get();

//           if (!isStarted) {
//             return;
//           }

//           if (isSubmitted) {
//             return;
//           }

//           const alreadyFlagged =
//             flaggedQuestions.includes(
//               questionId,
//             );

//           set({
//             flaggedQuestions:
//               alreadyFlagged
//                 ? flaggedQuestions.filter(
//                     (id) =>
//                       id !==
//                       questionId,
//                   )
//                 : [
//                     ...flaggedQuestions,
//                     questionId,
//                   ],
//           });
//         },

//         isFlagged: (
//           questionId,
//         ) => {
//           return get().flaggedQuestions.includes(
//             questionId,
//           );
//         },

//         /* ======================================================
//            TIMER
//            ====================================================== */

//         setDuration: (
//           durationInMinutes,
//         ) => {
//           const safeDuration =
//             Math.max(
//               0,
//               Number(
//                 durationInMinutes,
//               ) || 0,
//             );

//           set({
//             durationInMinutes:
//               safeDuration,

//             timeRemainingSeconds:
//               safeDuration * 60,
//           });
//         },

//         setTimeRemaining: (
//           seconds,
//         ) => {
//           set({
//             timeRemainingSeconds:
//               Math.max(
//                 0,
//                 Math.floor(
//                   Number(
//                     seconds,
//                   ) || 0,
//                 ),
//               ),
//           });
//         },

//         decreaseTime: () => {
//           const {
//             timeRemainingSeconds,
//             isStarted,
//             isSubmitted,
//           } = get();

//           if (
//             !isStarted ||
//             isSubmitted ||
//             timeRemainingSeconds <=
//               0
//           ) {
//             return;
//           }

//           set({
//             timeRemainingSeconds:
//               timeRemainingSeconds -
//               1,
//           });
//         },

//         /* ======================================================
//            START EXAM
//            ====================================================== */

//         startExam: () => {
//           const {
//             durationInMinutes,
//             timeRemainingSeconds,
//             questions,
//             sessionId,
//           } = get();

//           /*
//            * Cannot start an empty examination.
//            */
//           if (
//             questions.length === 0
//           ) {
//             return;
//           }

//           /*
//            * IMPORTANT:
//            *
//            * If the timer already exists, preserve it.
//            *
//            * This is what allows an active practice to be
//            * resumed without resetting the timer.
//            */
//           const initialTime =
//             timeRemainingSeconds >
//             0
//               ? timeRemainingSeconds
//               : durationInMinutes *
//                 60;

//           set({
//             isStarted: true,

//             isSubmitted: false,

//             sessionStatus:
//               sessionId
//                 ? "active"
//                 : "active",

//             timeRemainingSeconds:
//               initialTime,

//             sessionError: null,
//           });
//         },

//         /* ======================================================
//            SUBMIT EXAM
//            ====================================================== */

//         submitExam: () => {
//           const {
//             questions,
//             answers,
//           } = get();

//           let correctAnswers = 0;
//           let incorrectAnswers = 0;
//           let unansweredQuestions = 0;
//           let totalScore = 0;

//           questions.forEach(
//             (question) => {
//               const studentAnswer =
//                 answers[
//                   question._id
//                 ];

//               const correctAnswer =
//                 question.answer ??
//                 question.correctAnswer ??
//                 question.correctAnswers?.[0];

//               const marks =
//                 Number(
//                   question.marks ?? 1,
//                 );

//               /*
//                * No answer selected.
//                */
//               if (
//                 studentAnswer ===
//                   undefined ||
//                 studentAnswer ===
//                   null ||
//                 studentAnswer ===
//                   ""
//               ) {
//                 unansweredQuestions++;

//                 return;
//               }

//               /*
//                * Normalize both values.
//                */
//               const student =
//                 String(
//                   studentAnswer,
//                 )
//                   .trim()
//                   .toLowerCase();

//               const correct =
//                 String(
//                   correctAnswer ??
//                     "",
//                 )
//                   .trim()
//                   .toLowerCase();

//               /*
//                * Correct.
//                */
//               if (
//                 student ===
//                 correct
//               ) {
//                 correctAnswers++;

//                 totalScore += marks;
//               } else {
//                 incorrectAnswers++;
//               }
//             },
//           );

//           const totalQuestions =
//             questions.length;

//           const percentage =
//             totalQuestions > 0
//               ? Math.round(
//                   (correctAnswers /
//                     totalQuestions) *
//                     100,
//                 )
//               : 0;

//           const maximumScore =
//             questions.reduce(
//               (
//                 total,
//                 question,
//               ) =>
//                 total +
//                 Number(
//                   question.marks ??
//                     1,
//                 ),
//               0,
//             );

//           const result: CbtResult =
//             {
//               sessionId:
//                 get().sessionId ??
//                 undefined,

//               score:
//                 totalScore,

//               totalScore:
//                 maximumScore,

//               percentage,

//               correctAnswers,

//               incorrectAnswers,

//               unansweredQuestions,

//               totalQuestions,

//               passed:
//                 percentage >= 50,

//               submittedAt:
//                 new Date().toISOString(),
//             };

//           /*
//            * IMPORTANT:
//            *
//            * Once submitted, this practice becomes
//            * COMPLETED.
//            *
//            * The questions and answers remain in the
//            * persisted store for the result screen,
//            * but hasMatchingActivePractice() will return
//            * FALSE.
//            *
//            * Therefore the next "Start Practice" will
//            * request NEW questions from the backend.
//            */
//           set({
//             isSubmitted: true,

//             isStarted: false,

//             sessionStatus:
//               "completed",

//             result,

//             sessionError: null,
//           });
//         },

//         /* ======================================================
//            RESET EXAM
//            ====================================================== */

//         resetExam: () => {
//           set({
//             ...INITIAL_STATE,
//           });
//         },

//         /* ======================================================
//            RESET SESSION
//            ====================================================== */

//         resetSession: () => {
//           set({
//             sessionId: null,

//             sessionStatus: "idle",

//             sessionError: null,

//             practiceConfig: null,

//             isStarted: false,

//             isSubmitted: false,

//             subjects: [],

//             currentSubjectIndex: 0,

//             questions: [],

//             currentQuestionIndex: 0,

//             answers: {},

//             syncedAnswers: [],

//             syncingAnswers: [],

//             failedAnswers: [],

//             flaggedQuestions: [],

//             durationInMinutes: 0,

//             timeRemainingSeconds: 0,

//             result: null,
//           });
//         },
//       }),

//       /* ========================================================
//          PERSISTENCE
//          ======================================================== */

//       {
//         name: "jamb-league-cbt-session",

//         partialize: (
//           state,
//         ) => ({
//           /*
//            * SESSION
//            */

//           sessionId:
//             state.sessionId,

//           sessionStatus:
//             state.sessionStatus,

//           sessionError:
//             state.sessionError,

//           /*
//            * PRACTICE CONFIGURATION
//            */

//           practiceConfig:
//             state.practiceConfig,

//           /*
//            * EXAM
//            */

//           isStarted:
//             state.isStarted,

//           isSubmitted:
//             state.isSubmitted,

//           /*
//            * SUBJECTS
//            */

//           subjects:
//             state.subjects,

//           currentSubjectIndex:
//             state.currentSubjectIndex,

//           /*
//            * QUESTIONS
//            */

//           questions:
//             state.questions,

//           currentQuestionIndex:
//             state.currentQuestionIndex,

//           /*
//            * ANSWERS
//            */

//           answers:
//             state.answers,

//           syncedAnswers:
//             state.syncedAnswers,

//           syncingAnswers:
//             state.syncingAnswers,

//           failedAnswers:
//             state.failedAnswers,

//           /*
//            * FLAGS
//            */

//           flaggedQuestions:
//             state.flaggedQuestions,

//           /*
//            * TIMER
//            */

//           durationInMinutes:
//             state.durationInMinutes,

//           timeRemainingSeconds:
//             state.timeRemainingSeconds,

//           /*
//            * RESULT
//            */

//           result:
//             state.result,
//         }),
//       },
//     ),
//   );

// /* ============================================================
//    SELECTORS
//    ============================================================ */

// export const selectCurrentQuestion = (
//   state: CbtState,
// ) =>
//   state.questions[
//     state.currentQuestionIndex
//   ] ?? null;

// export const selectCurrentSubject = (
//   state: CbtState,
// ) =>
//   state.subjects[
//     state.currentSubjectIndex
//   ] ?? null;

// export const selectAnsweredCount = (
//   state: CbtState,
// ) =>
//   Object.values(
//     state.answers,
//   ).filter(
//     (answer) =>
//       answer !== undefined &&
//       answer !== null &&
//       answer !== "",
//   ).length;

// export const selectUnansweredCount = (
//   state: CbtState,
// ) =>
//   Math.max(
//     state.questions.length -
//       Object.values(
//         state.answers,
//       ).filter(
//         (answer) =>
//           answer !== undefined &&
//           answer !== null &&
//           answer !== "",
//       ).length,
//     0,
//   );

// export const selectFlaggedCount = (
//   state: CbtState,
// ) =>
//   state.flaggedQuestions.length;

// export const selectAnsweredPercentage = (
//   state: CbtState,
// ) => {
//   if (
//     state.questions.length ===
//     0
//   ) {
//     return 0;
//   }

//   const answered =
//     Object.values(
//       state.answers,
//     ).filter(
//       (answer) =>
//         answer !== undefined &&
//         answer !== null &&
//         answer !== "",
//     ).length;

//   return Math.round(
//     (answered /
//       state.questions.length) *
//       100,
//   );
// };

// export const selectIsAnswerSyncing = (
//   state: CbtState,
//   questionId: string,
// ) =>
//   state.syncingAnswers.includes(
//     questionId,
//   );

// export const selectIsAnswerSynced = (
//   state: CbtState,
//   questionId: string,
// ) =>
//   state.syncedAnswers.includes(
//     questionId,
//   );

// export const selectHasAnswerSyncFailed = (
//   state: CbtState,
//   questionId: string,
// ) =>
//   state.failedAnswers.includes(
//     questionId,
//   );

// export const selectHasUnsyncedAnswers = (
//   state: CbtState,
// ) =>
//   state.failedAnswers.length >
//     0 ||
//   state.syncingAnswers.length >
//     0;

// export const selectIsSessionActive = (
//   state: CbtState,
// ) =>
//   Boolean(
//     state.practiceConfig &&
//       state.questions.length >
//         0 &&
//       state.isStarted &&
//       !state.isSubmitted &&
//       state.sessionStatus ===
//         "active",
//   );

// export const selectIsSessionSubmitting = (
//   state: CbtState,
// ) =>
//   state.sessionStatus ===
//   "submitting";

// export const selectIsSessionCompleted = (
//   state: CbtState,
// ) =>
//   state.sessionStatus ===
//   "completed";