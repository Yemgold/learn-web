
// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\storage\practiceDb.ts

// import type {
//   PracticeSession,
//   PracticeQuestion,
// } from "@/lib/api/practice";

// /* ============================================================
//    DATABASE CONFIGURATION
//    ============================================================ */

// const DB_NAME =
//   "jamb-league-db";

// const DB_VERSION = 1;

// const SESSION_STORE =
//   "practiceSessions";

// /* ============================================================
//    LOCAL QUESTION TYPE
//    ============================================================ */


// export interface StoredPracticeQuestion
//   extends PracticeQuestion {
//   selectedOption:
//     string | null;

//   answered: boolean;
// }

// /* ============================================================
//    LOCAL SESSION TYPE
//    ============================================================ */

// /**
//  * Practice session stored in IndexedDB.
//  *
//  * It contains everything from the backend session plus
//  * local answer/progress information.
//  */
// export interface StoredPracticeSession
//   extends Omit<
//     PracticeSession,
//     "questions"
//   > {
//   questions:
//     StoredPracticeQuestion[];

//   cachedAt: string;
// }

// /* ============================================================
//    OPEN DATABASE
//    ============================================================ */

// function openDatabase(): Promise<IDBDatabase> {
//   return new Promise(
//     (resolve, reject) => {
//       if (
//         typeof window ===
//         "undefined"
//       ) {
//         reject(
//           new Error(
//             "IndexedDB is only available in the browser.",
//           ),
//         );

//         return;
//       }

//       if (
//         !("indexedDB" in window)
//       ) {
//         reject(
//           new Error(
//             "IndexedDB is not supported by this browser.",
//           ),
//         );

//         return;
//       }

//       const request =
//         window.indexedDB.open(
//           DB_NAME,
//           DB_VERSION,
//         );

//       /* ======================================================
//          CREATE / UPDATE DATABASE
//          ====================================================== */

//       request.onupgradeneeded = () => {
//         const db =
//           request.result;

//         if (
//           !db.objectStoreNames.contains(
//             SESSION_STORE,
//           )
//         ) {
//           const store =
//             db.createObjectStore(
//               SESSION_STORE,
//               {
//                 keyPath:
//                   "sessionId",
//               },
//             );

//           /* ==================================================
//              INDEXES
//              ================================================== */

//           store.createIndex(
//             "subjectId",
//             "subjectId",
//             {
//               unique: false,
//             },
//           );

//           store.createIndex(
//             "status",
//             "status",
//             {
//               unique: false,
//             },
//           );

//           store.createIndex(
//             "cachedAt",
//             "cachedAt",
//             {
//               unique: false,
//             },
//           );
//         }
//       };

//       request.onsuccess =
//         () => {
//           const db =
//             request.result;

//           /*
//            * If another tab upgrades the database,
//            * close this connection.
//            */
//           db.onversionchange = () => {
//             db.close();
//           };

//           resolve(db);
//         };

//       request.onerror =
//         () => {
//           reject(
//             request.error ??
//               new Error(
//                 "Failed to open IndexedDB.",
//               ),
//           );
//         };
//     },
//   );
// }

// /* ============================================================
//    CONVERT BACKEND SESSION → LOCAL SESSION
//    ============================================================ */

// function toStoredPracticeSession(
//   session: PracticeSession,
// ): StoredPracticeSession {
//   const questions =
//     session.questions.map(
//       (
//         question,
//       ): StoredPracticeQuestion => {
//         /*
//          * If the backend already supplied answer state,
//          * preserve it.
//          *
//          * Otherwise this is a newly-created practice
//          * session, so the question starts unanswered.
//          */
//         const backendQuestion =
//           question as PracticeQuestion & {
//             selectedOption?:
//               string | null;

//             answered?:
//               boolean;
//           };

//         return {
//           ...question,

//           selectedOption:
//             backendQuestion
//               .selectedOption ??
//             null,

//           answered:
//             backendQuestion
//               .answered ??
//             false,
//         };
//       },
//     );

//   return {
//     ...session,

//     questions,

//     cachedAt:
//       new Date().toISOString(),
//   };
// }

// /* ============================================================
//    SAVE PRACTICE SESSION
//    ============================================================ */

// /**
//  * Saves or replaces the entire practice session.
//  *
//  * When a newly-created session is saved, every question
//  * automatically receives:
//  *
//  * selectedOption: null
//  * answered: false
//  */
// export async function savePracticeSession(
//   session: PracticeSession,
// ): Promise<void> {
//   const db =
//     await openDatabase();

//   return new Promise(
//     (resolve, reject) => {
//       const transaction =
//         db.transaction(
//           SESSION_STORE,
//           "readwrite",
//         );

//       const store =
//         transaction.objectStore(
//           SESSION_STORE,
//         );

//       const record =
//         toStoredPracticeSession(
//           session,
//         );

//       store.put(record);

//       transaction.oncomplete =
//         () => {
//           db.close();

//           resolve();
//         };

//       transaction.onerror =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Failed to save practice session.",
//               ),
//           );
//         };

//       transaction.onabort =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Practice session storage transaction was aborted.",
//               ),
//           );
//         };
//     },
//   );
// }

// /* ============================================================
//    SAVE ALREADY STORED SESSION
//    ============================================================ */

// /**
//  * Saves an IndexedDB session without removing its local
//  * answer state.
//  *
//  * Useful when updating session progress locally.
//  */
// export async function saveStoredPracticeSession(
//   session: StoredPracticeSession,
// ): Promise<void> {
//   const db =
//     await openDatabase();

//   return new Promise(
//     (resolve, reject) => {
//       const transaction =
//         db.transaction(
//           SESSION_STORE,
//           "readwrite",
//         );

//       const store =
//         transaction.objectStore(
//           SESSION_STORE,
//         );

//       store.put({
//         ...session,

//         cachedAt:
//           new Date().toISOString(),
//       });

//       transaction.oncomplete =
//         () => {
//           db.close();

//           resolve();
//         };

//       transaction.onerror =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Failed to save stored practice session.",
//               ),
//           );
//         };

//       transaction.onabort =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Practice session storage transaction was aborted.",
//               ),
//           );
//         };
//     },
//   );
// }

// /* ============================================================
//    GET PRACTICE SESSION
//    ============================================================ */

// export async function getPracticeSessionFromDb(
//   sessionId: string,
// ): Promise<StoredPracticeSession | null> {
//   const db =
//     await openDatabase();

//   return new Promise(
//     (resolve, reject) => {
//       const transaction =
//         db.transaction(
//           SESSION_STORE,
//           "readonly",
//         );

//       const store =
//         transaction.objectStore(
//           SESSION_STORE,
//         );

//       const request =
//         store.get(
//           sessionId,
//         );

//       request.onsuccess =
//         () => {
//           db.close();

//           resolve(
//             request.result ??
//               null,
//           );
//         };

//       request.onerror =
//         () => {
//           db.close();

//           reject(
//             request.error ??
//               new Error(
//                 "Failed to retrieve practice session.",
//               ),
//           );
//         };
//     },
//   );
// }

// /* ============================================================
//    UPDATE PRACTICE SESSION
//    ============================================================ */

// /**
//  * Replaces the session with a fresh backend/session object.
//  *
//  * IMPORTANT:
//  * If you call this with a PracticeSession that does not
//  * contain local answer information, existing local answers
//  * will be reset.
//  *
//  * For individual student answers, use
//  * updatePracticeQuestionAnswer() instead.
//  */
// export async function updatePracticeSession(
//   session: PracticeSession,
// ): Promise<void> {
//   await savePracticeSession(
//     session,
//   );
// }

// /* ============================================================
//    UPDATE QUESTION ANSWER
//    ============================================================ */

// /**
//  * Saves one student's answer immediately to IndexedDB.
//  *
//  * This is the important function for offline/resume support.
//  *
//  * Example:
//  *
//  * await updatePracticeQuestionAnswer(
//  *   "session_abc123",
//  *   "question_002",
//  *   "B",
//  * );
//  */
// export async function updatePracticeQuestionAnswer(
//   sessionId: string,
//   questionId: string,
//   selectedOption:
//     string | null,
// ): Promise<
//   StoredPracticeSession
// > {
//   const db =
//     await openDatabase();

//   return new Promise(
//     (resolve, reject) => {
//       const transaction =
//         db.transaction(
//           SESSION_STORE,
//           "readwrite",
//         );

//       const store =
//         transaction.objectStore(
//           SESSION_STORE,
//         );

//       const request =
//         store.get(
//           sessionId,
//         );

//       request.onsuccess =
//         () => {
//           const session =
//             request.result as
//               | StoredPracticeSession
//               | undefined;

//           if (!session) {
//             transaction.abort();

//             reject(
//               new Error(
//                 `Practice session "${sessionId}" was not found in IndexedDB.`,
//               ),
//             );

//             return;
//           }

//           const questionIndex =
//             session.questions.findIndex(
//               (
//                 question,
//               ) =>
//                 question.questionId ===
//                 questionId,
//             );

//           if (
//             questionIndex ===
//             -1
//           ) {
//             transaction.abort();

//             reject(
//               new Error(
//                 `Question "${questionId}" was not found in practice session "${sessionId}".`,
//               ),
//             );

//             return;
//           }

//           /* ================================================
//              UPDATE ANSWER
//              ================================================ */

//           session.questions[
//             questionIndex
//           ] = {
//             ...session.questions[
//               questionIndex
//             ],

//             selectedOption,

//             answered:
//               selectedOption !==
//               null,
//           };

//           /* ================================================
//              UPDATE CURRENT QUESTION
//              ================================================ */

//           session.currentQuestionIndex =
//             Math.max(
//               session.currentQuestionIndex,
//               questionIndex,
//             );

//           /* ================================================
//              UPDATE CACHE TIMESTAMP
//              ================================================ */

//           session.cachedAt =
//             new Date().toISOString();

//           store.put(
//             session,
//           );

//           transaction.oncomplete =
//             () => {
//               db.close();

//               resolve(
//                 session,
//               );
//             };
//         };

//       request.onerror =
//         () => {
//           db.close();

//           reject(
//             request.error ??
//               new Error(
//                 "Failed to update practice question answer.",
//               ),
//           );
//         };

//       transaction.onerror =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Failed to update practice question answer.",
//               ),
//           );
//         };

//       transaction.onabort =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Practice question answer transaction was aborted.",
//               ),
//           );
//         };
//     },
//   );
// }

// /* ============================================================
//    UPDATE CURRENT QUESTION INDEX
//    ============================================================ */

// /**
//  * Updates the student's current position without
//  * modifying their answers.
//  */
// export async function updateCurrentQuestionIndex(
//   sessionId: string,
//   currentQuestionIndex: number,
// ): Promise<void> {
//   const db =
//     await openDatabase();

//   return new Promise(
//     (resolve, reject) => {
//       const transaction =
//         db.transaction(
//           SESSION_STORE,
//           "readwrite",
//         );

//       const store =
//         transaction.objectStore(
//           SESSION_STORE,
//         );

//       const request =
//         store.get(
//           sessionId,
//         );

//       request.onsuccess =
//         () => {
//           const session =
//             request.result as
//               | StoredPracticeSession
//               | undefined;

//           if (!session) {
//             transaction.abort();

//             reject(
//               new Error(
//                 `Practice session "${sessionId}" was not found.`,
//               ),
//             );

//             return;
//           }

//           session.currentQuestionIndex =
//             currentQuestionIndex;

//           session.cachedAt =
//             new Date().toISOString();

//           store.put(
//             session,
//           );
//         };

//       request.onerror =
//         () => {
//           db.close();

//           reject(
//             request.error ??
//               new Error(
//                 "Failed to update current question index.",
//               ),
//           );
//         };

//       transaction.oncomplete =
//         () => {
//           db.close();

//           resolve();
//         };

//       transaction.onerror =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Failed to update current question index.",
//               ),
//           );
//         };
//     },
//   );
// }

// /* ============================================================
//    DELETE PRACTICE SESSION
//    ============================================================ */

// export async function deletePracticeSession(
//   sessionId: string,
// ): Promise<void> {
//   const db =
//     await openDatabase();

//   return new Promise(
//     (resolve, reject) => {
//       const transaction =
//         db.transaction(
//           SESSION_STORE,
//           "readwrite",
//         );

//       const store =
//         transaction.objectStore(
//           SESSION_STORE,
//         );

//       store.delete(
//         sessionId,
//       );

//       transaction.oncomplete =
//         () => {
//           db.close();

//           resolve();
//         };

//       transaction.onerror =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Failed to delete practice session.",
//               ),
//           );
//         };

//       transaction.onabort =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Practice session deletion transaction was aborted.",
//               ),
//           );
//         };
//     },
//   );
// }

// /* ============================================================
//    GET ACTIVE SESSION FOR SUBJECT
//    ============================================================ */

// export async function getActivePracticeSession(
//   subjectId: string,
// ): Promise<StoredPracticeSession | null> {
//   const db =
//     await openDatabase();

//   return new Promise(
//     (resolve, reject) => {
//       const transaction =
//         db.transaction(
//           SESSION_STORE,
//           "readonly",
//         );

//       const store =
//         transaction.objectStore(
//           SESSION_STORE,
//         );

//       const index =
//         store.index(
//           "subjectId",
//         );

//       const request =
//         index.getAll(
//           subjectId,
//         );

//       request.onsuccess =
//         () => {
//           db.close();

//           const sessions =
//             request.result as
//               StoredPracticeSession[];

//           /*
//            * Only return unfinished sessions.
//            *
//            * The newest cached session wins.
//            */
//           const activeSession =
//             sessions
//               .filter(
//                 (
//                   session,
//                 ) =>
//                   session.status ===
//                   "in_progress",
//               )
//               .sort(
//                 (
//                   a,
//                   b,
//                 ) =>
//                   new Date(
//                     b.cachedAt,
//                   ).getTime() -
//                   new Date(
//                     a.cachedAt,
//                   ).getTime(),
//               )[0];

//           resolve(
//             activeSession ??
//               null,
//           );
//         };

//       request.onerror =
//         () => {
//           db.close();

//           reject(
//             request.error ??
//               new Error(
//                 "Failed to retrieve active practice session.",
//               ),
//           );
//         };
//     },
//   );
// }

// /* ============================================================
//    CLEAR ALL PRACTICE SESSIONS
//    ============================================================ */

// export async function clearPracticeSessions(): Promise<void> {
//   const db =
//     await openDatabase();

//   return new Promise(
//     (resolve, reject) => {
//       const transaction =
//         db.transaction(
//           SESSION_STORE,
//           "readwrite",
//         );

//       const store =
//         transaction.objectStore(
//           SESSION_STORE,
//         );

//       store.clear();

//       transaction.oncomplete =
//         () => {
//           db.close();

//           resolve();
//         };

//       transaction.onerror =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Failed to clear practice sessions.",
//               ),
//           );
//         };

//       transaction.onabort =
//         () => {
//           db.close();

//           reject(
//             transaction.error ??
//               new Error(
//                 "Practice sessions clear transaction was aborted.",
//               ),
//           );
//         };
//     },
//   );
// }
