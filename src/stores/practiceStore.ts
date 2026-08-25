// src/stores/practiceStore.ts

import { create } from "zustand";

/* ============================================================
   OPTION
   ============================================================ */

export interface PracticeOption {
  label: string;
  value: string;
}

/* ============================================================
   QUESTION CONTENT
   ============================================================ */

export type PracticeContent =
  | string
  | number
  | null
  | undefined;

export interface PracticeMedia {
  type?: string;
  url?: string;
  src?: string;
  id?: string;
  name?: string;
}

/* ============================================================
   QUESTION
   ============================================================ */

export interface PracticeQuestion {
  _id: string;

  content?: PracticeContent[];

  question: string;

  imageId?: string | null;

  passageId?: string | null;

  media?: PracticeMedia | string | null;

  options: PracticeOption[];

  apiQuestionId?: string;

  topic?: string | null;

  section?: string;

  answer?: string;

  solution?: string;

  explanation?: string;

  examType?: string;

  examYear?: string;

  apiSubjectName?: string;

  difficulty?: string;

  plan?: string;

  subject?: string;

  questionType?: string;

  correctAnswers?: string[];

  isMultipleAnswer?: boolean;

  marks?: number;

  createdAt?: string;

  updatedAt?: string;
}

/* ============================================================
   ANSWERS
   ============================================================ */

export type PracticeAnswers =
  Record<string, string>;

/* ============================================================
   SESSION
   ============================================================ */

export interface PracticeSession {
  subjectSlug: string;

  subjectId: string;

  subjectName: string;

  year: number;

  plan: string;

  examType: string;

  startedAt: string;

  currentQuestionIndex: number;

  answers: PracticeAnswers;

  completed: boolean;
}

/* ============================================================
   QUESTION CACHE
   ============================================================ */

/**
 * Questions are cached using:
 *
 * subjectId + year + plan + examType
 *
 * Example:
 *
 * 69bd417a74676c09ac65bc56__2000__SECONDARY__jamb
 *
 * This keeps JAMB, WAEC and NECO questions
 * completely separated in the cache.
 */

export interface PracticeQuestionCache {
  key: string;

  subjectId: string;

  year: number;

  plan: string;

  examType: string;

  questions: PracticeQuestion[];

  cachedAt: string;
}

/* ============================================================
   STORE STATE
   ============================================================ */

interface PracticeState {
  /* ==========================================================
     CURRENT QUESTIONS
     ========================================================== */

  questions: PracticeQuestion[];

  setQuestions: (
    questions: PracticeQuestion[]
  ) => void;

  clearQuestions: () => void;

  /* ==========================================================
     QUESTION CACHE
     ========================================================== */

  questionCache: Record<
    string,
    PracticeQuestionCache
  >;

  getCachedQuestions: (
    subjectId: string,
    year: number,
    plan: string,
    examType: string
  ) => PracticeQuestion[] | null;

  cacheQuestions: (
    subjectId: string,
    year: number,
    plan: string,
    examType: string,
    questions: PracticeQuestion[]
  ) => void;

  hasCachedQuestions: (
    subjectId: string,
    year: number,
    plan: string,
    examType: string
  ) => boolean;

  clearQuestionCache: () => void;

  /* ==========================================================
     EXAMINATION SUBJECT COMBINATIONS
     ========================================================== */

  /**
   * ==========================================================
   * JAMB
   * ==========================================================
   *
   * JAMB normally uses:
   *
   * Use of English + 3 other subjects = 4 subjects.
   */

  jambCombination: string[];

  setJambCombination: (
    subjectIds: string[]
  ) => void;

  toggleJambSubject: (
    subjectId: string
  ) => void;

  removeJambSubject: (
    subjectId: string
  ) => void;

  clearJambCombination: () => void;

  /**
   * ==========================================================
   * WAEC
   * ==========================================================
   *
   * WAEC has its own subject selection rules.
   *
   * The WAEC combination page controls the
   * appropriate number and compulsory subjects.
   */

  waecCombination: string[];

  setWaecCombination: (
    subjectIds: string[]
  ) => void;

  toggleWaecSubject: (
    subjectId: string
  ) => void;

  removeWaecSubject: (
    subjectId: string
  ) => void;

  clearWaecCombination: () => void;

  /**
   * ==========================================================
   * NECO
   * ==========================================================
   *
   * NECO has its own subject selection rules.
   *
   * The NECO combination page controls the
   * appropriate number and compulsory subjects.
   */

  necoCombination: string[];

  setNecoCombination: (
    subjectIds: string[]
  ) => void;

  toggleNecoSubject: (
    subjectId: string
  ) => void;

  removeNecoSubject: (
    subjectId: string
  ) => void;

  clearNecoCombination: () => void;

  /* ==========================================================
     SESSION
     ========================================================== */

  session: PracticeSession | null;

  startSession: (
    session: PracticeSession
  ) => void;

  endSession: () => void;

  /* ==========================================================
     CURRENT QUESTION
     ========================================================== */

  setCurrentQuestion: (
    index: number
  ) => void;

  nextQuestion: () => void;

  previousQuestion: () => void;

  /* ==========================================================
     ANSWERS
     ========================================================== */

  selectAnswer: (
    questionId: string,
    answer: string
  ) => void;

  clearAnswer: (
    questionId: string
  ) => void;

  /* ==========================================================
     RESET SESSION ONLY
     ========================================================== */

  resetSession: () => void;

  /* ==========================================================
     RESET EVERYTHING
     ========================================================== */

  resetPractice: () => void;
}

/* ============================================================
   CACHE KEY
   ============================================================ */

function createQuestionCacheKey(
  subjectId: string,
  year: number,
  plan: string,
  examType: string
): string {
  return [
    subjectId,
    year,
    plan,
    examType,
  ]
    .map(String)
    .join("__");
}

/* ============================================================
   STORE
   ============================================================ */

export const usePracticeStore =
  create<PracticeState>((set, get) => ({

    /* ========================================================
       CURRENT QUESTIONS
       ======================================================== */

    questions: [],

    setQuestions: (questions) =>
      set({
        questions,
      }),

    clearQuestions: () =>
      set({
        questions: [],
      }),

    /* ========================================================
       QUESTION CACHE
       ======================================================== */

    questionCache: {},

    getCachedQuestions: (
      subjectId,
      year,
      plan,
      examType
    ) => {
      const key =
        createQuestionCacheKey(
          subjectId,
          year,
          plan,
          examType
        );

      const cached =
        get().questionCache[key];

      if (!cached) {
        return null;
      }

      return cached.questions;
    },

    cacheQuestions: (
      subjectId,
      year,
      plan,
      examType,
      questions
    ) => {
      const key =
        createQuestionCacheKey(
          subjectId,
          year,
          plan,
          examType
        );

      set((state) => ({
        questionCache: {
          ...state.questionCache,

          [key]: {
            key,

            subjectId,

            year,

            plan,

            examType,

            questions,

            cachedAt:
              new Date().toISOString(),
          },
        },
      }));
    },

    hasCachedQuestions: (
      subjectId,
      year,
      plan,
      examType
    ) => {
      const key =
        createQuestionCacheKey(
          subjectId,
          year,
          plan,
          examType
        );

      const cached =
        get().questionCache[key];

      return Boolean(
        cached?.questions?.length
      );
    },

    clearQuestionCache: () =>
      set({
        questionCache: {},
      }),

    /* ========================================================
       JAMB COMBINATION
       ======================================================== */

    jambCombination: [],

    /* ========================================================
       SET JAMB COMBINATION
       ======================================================== */

    setJambCombination: (
      subjectIds
    ) =>
      set({
        jambCombination: [
          ...new Set(subjectIds),
        ],
      }),

    /* ========================================================
       TOGGLE JAMB SUBJECT
       ======================================================== */

    toggleJambSubject: (
      subjectId
    ) =>
      set((state) => {
        const alreadySelected =
          state.jambCombination.includes(
            subjectId
          );

        /* ----------------------------------------------------
           REMOVE
           ---------------------------------------------------- */

        if (alreadySelected) {
          return {
            jambCombination:
              state.jambCombination.filter(
                (id) =>
                  id !== subjectId
              ),
          };
        }

        /* ----------------------------------------------------
           ADD
           ---------------------------------------------------- */

        /*
         * JAMB uses:
         *
         * Use of English + 3 other subjects
         *
         * Maximum = 4 subjects.
         */

        if (
          state.jambCombination.length >= 4
        ) {
          return state;
        }

        return {
          jambCombination: [
            ...state.jambCombination,
            subjectId,
          ],
        };
      }),

    /* ========================================================
       REMOVE JAMB SUBJECT
       ======================================================== */

    removeJambSubject: (
      subjectId
    ) =>
      set((state) => ({
        jambCombination:
          state.jambCombination.filter(
            (id) =>
              id !== subjectId
          ),
      })),

    /* ========================================================
       CLEAR JAMB COMBINATION
       ======================================================== */

    clearJambCombination: () =>
      set({
        jambCombination: [],
      }),

    /* ========================================================
       WAEC COMBINATION
       ======================================================== */

    waecCombination: [],

    /* ========================================================
       SET WAEC COMBINATION
       ======================================================== */

    setWaecCombination: (
      subjectIds
    ) =>
      set({
        waecCombination: [
          ...new Set(subjectIds),
        ],
      }),

    /* ========================================================
       TOGGLE WAEC SUBJECT
       ======================================================== */

    toggleWaecSubject: (
      subjectId
    ) =>
      set((state) => {
        const alreadySelected =
          state.waecCombination.includes(
            subjectId
          );

        /* ----------------------------------------------------
           REMOVE
           ---------------------------------------------------- */

        if (alreadySelected) {
          return {
            waecCombination:
              state.waecCombination.filter(
                (id) =>
                  id !== subjectId
              ),
          };
        }

        /* ----------------------------------------------------
           ADD
           ---------------------------------------------------- */

        return {
          waecCombination: [
            ...state.waecCombination,
            subjectId,
          ],
        };
      }),

    /* ========================================================
       REMOVE WAEC SUBJECT
       ======================================================== */

    removeWaecSubject: (
      subjectId
    ) =>
      set((state) => ({
        waecCombination:
          state.waecCombination.filter(
            (id) =>
              id !== subjectId
          ),
      })),

    /* ========================================================
       CLEAR WAEC COMBINATION
       ======================================================== */

    clearWaecCombination: () =>
      set({
        waecCombination: [],
      }),

    /* ========================================================
       NECO COMBINATION
       ======================================================== */

    necoCombination: [],

    /* ========================================================
       SET NECO COMBINATION
       ======================================================== */

    setNecoCombination: (
      subjectIds
    ) =>
      set({
        necoCombination: [
          ...new Set(subjectIds),
        ],
      }),

    /* ========================================================
       TOGGLE NECO SUBJECT
       ======================================================== */

    toggleNecoSubject: (
      subjectId
    ) =>
      set((state) => {
        const alreadySelected =
          state.necoCombination.includes(
            subjectId
          );

        /* ----------------------------------------------------
           REMOVE
           ---------------------------------------------------- */

        if (alreadySelected) {
          return {
            necoCombination:
              state.necoCombination.filter(
                (id) =>
                  id !== subjectId
              ),
          };
        }

        /* ----------------------------------------------------
           ADD
           ---------------------------------------------------- */

        return {
          necoCombination: [
            ...state.necoCombination,
            subjectId,
          ],
        };
      }),

    /* ========================================================
       REMOVE NECO SUBJECT
       ======================================================== */

    removeNecoSubject: (
      subjectId
    ) =>
      set((state) => ({
        necoCombination:
          state.necoCombination.filter(
            (id) =>
              id !== subjectId
          ),
      })),

    /* ========================================================
       CLEAR NECO COMBINATION
       ======================================================== */

    clearNecoCombination: () =>
      set({
        necoCombination: [],
      }),

    /* ========================================================
       SESSION
       ======================================================== */

    session: null,

    startSession: (session) =>
      set({
        session,
      }),

    endSession: () =>
      set({
        session: null,
      }),

    /* ========================================================
       CURRENT QUESTION
       ======================================================== */

    setCurrentQuestion: (index) =>
      set((state) => {
        if (!state.session) {
          return state;
        }

        if (
          index < 0 ||
          index >= state.questions.length
        ) {
          return state;
        }

        return {
          session: {
            ...state.session,

            currentQuestionIndex:
              index,
          },
        };
      }),

    /* ========================================================
       NEXT QUESTION
       ======================================================== */

    nextQuestion: () =>
      set((state) => {
        if (!state.session) {
          return state;
        }

        const nextIndex =
          state.session
            .currentQuestionIndex + 1;

        if (
          nextIndex >=
          state.questions.length
        ) {
          return state;
        }

        return {
          session: {
            ...state.session,

            currentQuestionIndex:
              nextIndex,
          },
        };
      }),

    /* ========================================================
       PREVIOUS QUESTION
       ======================================================== */

    previousQuestion: () =>
      set((state) => {
        if (!state.session) {
          return state;
        }

        const previousIndex =
          state.session
            .currentQuestionIndex - 1;

        if (previousIndex < 0) {
          return state;
        }

        return {
          session: {
            ...state.session,

            currentQuestionIndex:
              previousIndex,
          },
        };
      }),

    /* ========================================================
       ANSWERS
       ======================================================== */

    selectAnswer: (
      questionId,
      answer
    ) =>
      set((state) => {
        if (!state.session) {
          return state;
        }

        return {
          session: {
            ...state.session,

            answers: {
              ...state.session.answers,

              [questionId]: answer,
            },
          },
        };
      }),

    clearAnswer: (questionId) =>
      set((state) => {
        if (!state.session) {
          return state;
        }

        const answers = {
          ...state.session.answers,
        };

        delete answers[questionId];

        return {
          session: {
            ...state.session,

            answers,
          },
        };
      }),

    /* ========================================================
       RESET SESSION ONLY
       ======================================================== */

    /**
     * Clears:
     *
     * - current questions
     * - current session
     *
     * Does NOT clear:
     *
     * - questionCache
     * - jambCombination
     * - waecCombination
     * - necoCombination
     */

    resetSession: () =>
      set({
        questions: [],

        session: null,
      }),

    /* ========================================================
       RESET EVERYTHING
       ======================================================== */

    /**
     * Clears:
     *
     * - current questions
     * - current session
     * - cached questions
     *
     * The examination combinations are intentionally
     * preserved because they are student preferences.
     */

    resetPractice: () =>
      set({
        questions: [],

        session: null,

        questionCache: {},
      }),
  }));













































// // src/stores/practiceStore.ts

// import { create } from "zustand";

// /* ============================================================
//    OPTION
//    ============================================================ */

// export interface PracticeOption {
//   label: string;
//   value: string;
// }

// /* ============================================================
//    QUESTION CONTENT
//    ============================================================ */

// export type PracticeContent =
//   | string
//   | number
//   | null
//   | undefined;

// export interface PracticeMedia {
//   type?: string;
//   url?: string;
//   src?: string;
//   id?: string;
//   name?: string;
// }

// /* ============================================================
//    QUESTION
//    ============================================================ */

// export interface PracticeQuestion {
//   _id: string;

//   content?: PracticeContent[];

//   question: string;

//   imageId?: string | null;

//   passageId?: string | null;

//   media?: PracticeMedia | string | null;

//   options: PracticeOption[];

//   apiQuestionId?: string;

//   topic?: string | null;

//   section?: string;

//   answer?: string;

//   solution?: string;

//   explanation?: string;

//   examType?: string;

//   examYear?: string;

//   apiSubjectName?: string;

//   difficulty?: string;

//   plan?: string;

//   subject?: string;

//   questionType?: string;

//   correctAnswers?: string[];

//   isMultipleAnswer?: boolean;

//   marks?: number;

//   createdAt?: string;

//   updatedAt?: string;
// }

// /* ============================================================
//    ANSWERS
//    ============================================================ */

// export type PracticeAnswers =
//   Record<string, string>;

// /* ============================================================
//    SESSION
//    ============================================================ */

// export interface PracticeSession {
//   subjectSlug: string;

//   subjectId: string;

//   subjectName: string;

//   year: number;

//   plan: string;

//   examType: string;

//   startedAt: string;

//   currentQuestionIndex: number;

//   answers: PracticeAnswers;

//   completed: boolean;
// }

// /* ============================================================
//    QUESTION CACHE
//    ============================================================ */

// /**
//  * Questions are cached using:
//  *
//  * subjectId + year + plan + examType
//  *
//  * Example:
//  *
//  * 69bd417a74676c09ac65bc56__2000__SECONDARY__jamb
//  */

// export interface PracticeQuestionCache {
//   key: string;

//   subjectId: string;

//   year: number;

//   plan: string;

//   examType: string;

//   questions: PracticeQuestion[];

//   cachedAt: string;
// }

// /* ============================================================
//    STORE STATE
//    ============================================================ */

// interface PracticeState {
//   /* ==========================================================
//      CURRENT QUESTIONS
//      ========================================================== */

//   questions: PracticeQuestion[];

//   setQuestions: (
//     questions: PracticeQuestion[]
//   ) => void;

//   clearQuestions: () => void;

//   /* ==========================================================
//      QUESTION CACHE
//      ========================================================== */

//   questionCache: Record<
//     string,
//     PracticeQuestionCache
//   >;

//   getCachedQuestions: (
//     subjectId: string,
//     year: number,
//     plan: string,
//     examType: string
//   ) => PracticeQuestion[] | null;

//   cacheQuestions: (
//     subjectId: string,
//     year: number,
//     plan: string,
//     examType: string,
//     questions: PracticeQuestion[]
//   ) => void;

//   hasCachedQuestions: (
//     subjectId: string,
//     year: number,
//     plan: string,
//     examType: string
//   ) => boolean;

//   clearQuestionCache: () => void;



  

//   /* ==========================================================
//      JAMB COMBINATION
//      ========================================================== */

//   /**
//    * Subject IDs selected by the student
//    * for their JAMB subject combination.
//    *
//    * Maximum recommended combination:
//    *
//    * 4 subjects
//    *
//    * Example:
//    *
//    * [
//    *   "english-id",
//    *   "mathematics-id",
//    *   "physics-id",
//    *   "chemistry-id"
//    * ]
//    */

//   jambCombination: string[];

//   setJambCombination: (
//     subjectIds: string[]
//   ) => void;

//   toggleJambSubject: (
//     subjectId: string
//   ) => void;

//   removeJambSubject: (
//     subjectId: string
//   ) => void;

//   clearJambCombination: () => void;







//   /* ==========================================================
//      SESSION
//      ========================================================== */

//   session: PracticeSession | null;

//   startSession: (
//     session: PracticeSession
//   ) => void;

//   endSession: () => void;

//   /* ==========================================================
//      CURRENT QUESTION
//      ========================================================== */

//   setCurrentQuestion: (
//     index: number
//   ) => void;

//   nextQuestion: () => void;

//   previousQuestion: () => void;

//   /* ==========================================================
//      ANSWERS
//      ========================================================== */

//   selectAnswer: (
//     questionId: string,
//     answer: string
//   ) => void;

//   clearAnswer: (
//     questionId: string
//   ) => void;

//   /* ==========================================================
//      RESET SESSION ONLY
//      ========================================================== */

//   resetSession: () => void;

//   /* ==========================================================
//      RESET EVERYTHING
//      ========================================================== */

//   resetPractice: () => void;
// }

// /* ============================================================
//    CACHE KEY
//    ============================================================ */

// function createQuestionCacheKey(
//   subjectId: string,
//   year: number,
//   plan: string,
//   examType: string
// ): string {
//   return [
//     subjectId,
//     year,
//     plan,
//     examType,
//   ]
//     .map(String)
//     .join("__");
// }

// /* ============================================================
//    STORE
//    ============================================================ */

// export const usePracticeStore =
//   create<PracticeState>((set, get) => ({
//     /* ========================================================
//        CURRENT QUESTIONS
//        ======================================================== */

//     questions: [],

//     setQuestions: (questions) =>
//       set({
//         questions,
//       }),

//     clearQuestions: () =>
//       set({
//         questions: [],
//       }),

//     /* ========================================================
//        QUESTION CACHE
//        ======================================================== */

//     questionCache: {},

//     getCachedQuestions: (
//       subjectId,
//       year,
//       plan,
//       examType
//     ) => {
//       const key =
//         createQuestionCacheKey(
//           subjectId,
//           year,
//           plan,
//           examType
//         );

//       const cached =
//         get().questionCache[key];

//       if (!cached) {
//         return null;
//       }

//       return cached.questions;
//     },

//     cacheQuestions: (
//       subjectId,
//       year,
//       plan,
//       examType,
//       questions
//     ) => {
//       const key =
//         createQuestionCacheKey(
//           subjectId,
//           year,
//           plan,
//           examType
//         );

//       set((state) => ({
//         questionCache: {
//           ...state.questionCache,

//           [key]: {
//             key,

//             subjectId,

//             year,

//             plan,

//             examType,

//             questions,

//             cachedAt:
//               new Date().toISOString(),
//           },
//         },
//       }));
//     },

//     hasCachedQuestions: (
//       subjectId,
//       year,
//       plan,
//       examType
//     ) => {
//       const key =
//         createQuestionCacheKey(
//           subjectId,
//           year,
//           plan,
//           examType
//         );

//       const cached =
//         get().questionCache[key];

//       return Boolean(
//         cached?.questions?.length
//       );
//     },

//     clearQuestionCache: () =>
//       set({
//         questionCache: {},
//       }),

//     /* ========================================================
//        JAMB COMBINATION
//        ======================================================== */

//     /**
//      * Selected JAMB subjects.
//      *
//      * We keep only subject IDs here.
//      * The actual Subject objects remain
//      * in the subjects page/API response.
//      */

//     jambCombination: [],

//     /* ========================================================
//        SET COMPLETE COMBINATION
//        ======================================================== */

//     setJambCombination: (
//       subjectIds
//     ) =>
//       set({
//         jambCombination: [
//           ...new Set(subjectIds),
//         ],
//       }),

//     /* ========================================================
//        TOGGLE SUBJECT
//        ======================================================== */

//     toggleJambSubject: (
//       subjectId
//     ) =>
//       set((state) => {
//         const alreadySelected =
//           state.jambCombination.includes(
//             subjectId
//           );

//         /* ----------------------------------------------------
//            REMOVE SUBJECT
//            ---------------------------------------------------- */

//         if (alreadySelected) {
//           return {
//             jambCombination:
//               state.jambCombination.filter(
//                 (id) =>
//                   id !== subjectId
//               ),
//           };
//         }

//         /* ----------------------------------------------------
//            ADD SUBJECT
//            ---------------------------------------------------- */

//         /*
//          * JAMB normally uses 4 subjects:
//          *
//          * Use of English + 3 other subjects.
//          *
//          * Prevent the student from selecting
//          * more than 4.
//          */

//         if (
//           state.jambCombination.length >= 4
//         ) {
//           return state;
//         }

//         return {
//           jambCombination: [
//             ...state.jambCombination,
//             subjectId,
//           ],
//         };
//       }),

//     /* ========================================================
//        REMOVE SUBJECT
//        ======================================================== */

//     removeJambSubject: (
//       subjectId
//     ) =>
//       set((state) => ({
//         jambCombination:
//           state.jambCombination.filter(
//             (id) =>
//               id !== subjectId
//           ),
//       })),

//     /* ========================================================
//        CLEAR COMBINATION
//        ======================================================== */

//     clearJambCombination: () =>
//       set({
//         jambCombination: [],
//       }),

//     /* ========================================================
//        SESSION
//        ======================================================== */

//     session: null,

//     startSession: (session) =>
//       set({
//         session,
//       }),

//     endSession: () =>
//       set({
//         session: null,
//       }),

//     /* ========================================================
//        CURRENT QUESTION
//        ======================================================== */

//     setCurrentQuestion: (index) =>
//       set((state) => {
//         if (!state.session) {
//           return state;
//         }

//         if (
//           index < 0 ||
//           index >= state.questions.length
//         ) {
//           return state;
//         }

//         return {
//           session: {
//             ...state.session,

//             currentQuestionIndex:
//               index,
//           },
//         };
//       }),

//     nextQuestion: () =>
//       set((state) => {
//         if (!state.session) {
//           return state;
//         }

//         const nextIndex =
//           state.session
//             .currentQuestionIndex + 1;

//         if (
//           nextIndex >=
//           state.questions.length
//         ) {
//           return state;
//         }

//         return {
//           session: {
//             ...state.session,

//             currentQuestionIndex:
//               nextIndex,
//           },
//         };
//       }),

//     previousQuestion: () =>
//       set((state) => {
//         if (!state.session) {
//           return state;
//         }

//         const previousIndex =
//           state.session
//             .currentQuestionIndex - 1;

//         if (previousIndex < 0) {
//           return state;
//         }

//         return {
//           session: {
//             ...state.session,

//             currentQuestionIndex:
//               previousIndex,
//           },
//         };
//       }),

//     /* ========================================================
//        ANSWERS
//        ======================================================== */

//     selectAnswer: (
//       questionId,
//       answer
//     ) =>
//       set((state) => {
//         if (!state.session) {
//           return state;
//         }

//         return {
//           session: {
//             ...state.session,

//             answers: {
//               ...state.session.answers,

//               [questionId]: answer,
//             },
//           },
//         };
//       }),

//     clearAnswer: (questionId) =>
//       set((state) => {
//         if (!state.session) {
//           return state;
//         }

//         const answers = {
//           ...state.session.answers,
//         };

//         delete answers[questionId];

//         return {
//           session: {
//             ...state.session,

//             answers,
//           },
//         };
//       }),

//     /* ========================================================
//        RESET SESSION ONLY
//        ======================================================== */

//     /**
//      * IMPORTANT:
//      *
//      * This clears the currently loaded
//      * questions and session.
//      *
//      * It does NOT clear:
//      *
//      * - questionCache
//      * - jambCombination
//      */

//     resetSession: () =>
//       set({
//         questions: [],

//         session: null,
//       }),

//     /* ========================================================
//        RESET EVERYTHING
//        ======================================================== */

//     /**
//      * This clears:
//      *
//      * - current questions
//      * - current session
//      * - cached questions
//      *
//      * IMPORTANT:
//      *
//      * The student's JAMB combination is NOT
//      * cleared here.
//      *
//      * The combination is a student preference,
//      * not temporary practice-session data.
//      */

//     resetPractice: () =>
//       set({
//         questions: [],

//         session: null,

//         questionCache: {},
//       }),
//   }));