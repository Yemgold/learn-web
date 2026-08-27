

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
   * Local/frontend session identifier.
   */
  sessionId?: string | null;

  /*
   * Backend practice identifier.
   *
   * This identifies the practice created by the
   * backend when questions are fetched.
   */
  practiceId?: string | null;

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
   * Local/frontend session identifier.
   *
   * This is different from practiceId.
   */
  sessionId: string | null;

  /*
   * Backend-created practice identifier.
   *
   * Example:
   * "6a8f2307703a8eab6490f78a"
   */
  practiceId: string | null;

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

  setPracticeId: (
    practiceId: string | null,
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

  sessionId:
    null as string | null,

  /*
   * Backend-created practice ID.
   */
  practiceId:
    null as string | null,

  sessionStatus:
    "idle" as CbtSessionStatus,

  sessionError:
    null as string | null,

  /* PRACTICE */

  practiceConfig:
    null as CbtPracticeConfig | null,

  /* EXAM */

  isStarted: false,

  isSubmitted: false,

  /* SUBJECTS */

  subjects:
    [] as CbtSubject[],

  currentSubjectIndex: 0,

  /* QUESTIONS */

  questions:
    [] as CbtQuestion[],

  currentQuestionIndex: 0,

  /* ANSWERS */

  answers:
    {} as CbtAnswerRecord,

  /* FLAGS */

  flaggedQuestions:
    [] as string[],

  /* TIMER */

  durationInMinutes: 0,

  timeRemainingSeconds: 0,

  /* RESULT */

  result:
    null as CbtResult | null,
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

        /*
         * Stores the backend-created practice ID.
         *
         * Example:
         * setPracticeId("6a8f2307703a8eab6490f78a")
         */
        setPracticeId: (
          practiceId,
        ) => {
          set({
            practiceId,
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
            sessionStatus:
              "active",

            sessionError:
              null,

            isStarted:
              true,

            isSubmitted:
              false,
          });
        },

        /*
         * Compatibility method.
         *
         * There is no backend submission
         * from this action.
         */
        markSessionSubmitting: () => {
          /*
           * Intentionally empty.
           *
           * Backend submission will be handled
           * separately.
           */
        },

        /*
         * Complete the local practice.
         */
        markSessionCompleted: (
          result = null,
        ) => {
          set({
            sessionStatus:
              "completed",

            isSubmitted:
              true,

            isStarted:
              false,

            result,

            sessionError:
              null,
          });
        },

        /*
         * Local failure only.
         */
        markSessionFailed: (
          error,
        ) => {
          set({
            sessionStatus:
              "failed",

            sessionError:
              error,
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
            practiceConfig:
              null,
          });
        },

        /*
         * Check whether the currently stored
         * frontend practice can be resumed.
         */
        hasMatchingActivePractice: (
          config,
        ) => {
          const state =
            get();

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

          /*
           * A backend practice ID must exist
           * for a resumable practice.
           */
          if (
            !state.practiceId
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
          const state =
            get();

          return Boolean(
            state.questions.length >
              0 &&
              state.isStarted &&
              !state.isSubmitted &&
              state.sessionStatus ===
                "active" &&
              state.practiceConfig &&
              state.practiceId,
          );
        },

        hasCompletedPractice: () => {
          const state =
            get();

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

            currentSubjectIndex:
              0,
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
            index >=
              subjects.length
          ) {
            return;
          }

          set({
            currentSubjectIndex:
              index,

            currentQuestionIndex:
              0,
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

              currentQuestionIndex:
                0,
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

              currentQuestionIndex:
                0,
            });
          }
        },

        /* ======================================================
           QUESTIONS
           ====================================================== */

       setQuestions: (
  questions,
) => {
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

    /*
     * IMPORTANT:
     *
     * Do NOT clear practiceId here.
     *
     * The backend practiceId belongs to the
     * practice represented by these questions.
     *
     * It is set separately using setPracticeId().
     */
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
            index >=
              questions.length
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
          return get()
            .flaggedQuestions.includes(
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
            isStarted:
              true,

            isSubmitted:
              false,

            sessionStatus:
              "active",

            timeRemainingSeconds:
              initialTime,

            sessionError:
              null,
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
            practiceId,
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

          let correctAnswers =
            0;

          let incorrectAnswers =
            0;

          let unansweredQuestions =
            0;

          let totalScore =
            0;

          let maximumScore =
            0;

          /* ----------------------------------------------------
             CALCULATE RESULT
             ---------------------------------------------------- */

          questions.forEach(
            (question) => {
              const marks =
                Math.max(
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

              practiceId:
                practiceId,

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
           * Result is still calculated locally.
           *
           * The practiceId is now retained in the
           * result so it can later be used when
           * connecting result submission to the
           * backend.
           */
          set({
            isSubmitted:
              true,

            isStarted:
              false,

            sessionStatus:
              "completed",

            result,

            sessionError:
              null,
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

          /*
           * BACKEND PRACTICE
           */

          practiceId:
            state.practiceId,

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
    state.practiceId &&
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