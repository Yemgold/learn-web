// src/lib/socket/quizSocket.ts

import { io, type Socket } from "socket.io-client";

import { getAccessToken } from "@/lib/auth/token";

let socket: Socket | null = null;

const QUIZ_SOCKET_URL =
  process.env.NEXT_PUBLIC_QUIZ_SOCKET_URL ||
  "https://mypastquestionsapp.onrender.com/quiz";

  console.log(
  "🔥🔥🔥 quizSocket.ts MODULE LOADED 🔥🔥🔥",
);

/* ============================================================
   GET QUIZ SOCKET
   ============================================================ */

export function getQuizSocket(): Socket {
  const accessToken = getAccessToken();

  console.log(
    "[Quiz Socket] ----------------------------------------",
  );

  console.log(
    "[Quiz Socket] URL:",
    QUIZ_SOCKET_URL,
  );

  console.log(
    "[Quiz Socket] Access token available:",
    Boolean(accessToken),
  );

  /*
   * Create the singleton socket once.
   */
  if (!socket) {
    console.log(
      "[Quiz Socket] Creating new socket connection...",
    );

    socket = io(QUIZ_SOCKET_URL, {
      transports: ["websocket"],

      auth: {
        token: accessToken,
      },

      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    /* ========================================================
       CONNECTION LIFECYCLE
       ======================================================== */

    socket.on("connect", () => {
      console.log(
        "[Quiz Socket] Connected successfully.",
      );

      console.log(
        "[Quiz Socket] Socket ID:",
        socket?.id,
      );

      console.log(
        "[Quiz Socket] Connected:",
        socket?.connected,
      );
    });

    socket.on(
      "connect_error",
      (error) => {
        console.error(
          "[Quiz Socket] Connection error:",
          error.message,
        );

        console.error(
          "[Quiz Socket] Full connection error:",
          error,
        );
      },
    );

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "[Quiz Socket] Disconnected.",
        );

        console.log(
          "[Quiz Socket] Reason:",
          reason,
        );
      },
    );

    /* ========================================================
       SOCKET.IO MANAGER EVENTS
       ======================================================== */

    socket.io.on(
      "reconnect_attempt",
      (attempt) => {
        console.log(
          "[Quiz Socket] Reconnection attempt:",
          attempt,
        );
      },
    );

    socket.io.on(
      "reconnect",
      (attempt) => {
        console.log(
          "[Quiz Socket] Reconnected successfully.",
        );

        console.log(
          "[Quiz Socket] Attempts:",
          attempt,
        );

        console.log(
          "[Quiz Socket] Socket ID:",
          socket?.id,
        );
      },
    );

    socket.io.on(
      "reconnect_error",
      (error) => {
        console.error(
          "[Quiz Socket] Reconnection error:",
          error.message,
        );
      },
    );

    socket.io.on(
      "reconnect_failed",
      () => {
        console.error(
          "[Quiz Socket] Reconnection failed.",
        );
      },
    );

    /* ========================================================
       DIAGNOSTIC INCOMING EVENT LOGGER
       ======================================================== */

    socket.onAny((event, ...args) => {
      console.log(
        "[Quiz Socket] Incoming event:",
        event,
        args,
      );

      /*
       * Generic socket error logging.
       */
      if (event === "socket_error") {
        console.error(
          "[Quiz Socket] ===== SOCKET ERROR =====",
        );

        console.error(
          "[Quiz Socket] Error payload:",
          args[0],
        );

        try {
          console.error(
            "[Quiz Socket] Error payload JSON:",
            JSON.stringify(
              args[0],
              null,
              2,
            ),
          );
        } catch {
          console.error(
            "[Quiz Socket] Could not stringify socket error payload.",
          );
        }

        console.error(
          "[Quiz Socket] =========================",
        );
      }

      /*
       * Fastest winner diagnostic.
       */
      if (
        event ===
        "question_fastest_winner"
      ) {
        console.log(
          "[Quiz Socket] 🏆🏆🏆 QUESTION_FASTEST_WINNER RECEIVED 🏆🏆🏆",
        );

        console.log(
          "[Quiz Socket] QUESTION_FASTEST_WINNER ARGS:",
          args,
        );

        try {
          console.log(
            "[Quiz Socket] QUESTION_FASTEST_WINNER JSON:",
            JSON.stringify(
              args,
              null,
              2,
            ),
          );
        } catch {
          console.log(
            "[Quiz Socket] Could not stringify fastest winner response.",
          );
        }
      }
    });

    /* ========================================================
       DIAGNOSTIC OUTGOING EVENT LOGGER
       ======================================================== */

    socket.onAnyOutgoing((event, ...args) => {
      console.log(
        "[Quiz Socket] OUTGOING EVENT:",
        event,
        args,
      );

      /*
       * Participant answer logging.
       */
      if (
        event ===
        "participant_selected_answer"
      ) {
        console.log(
          "[Quiz Socket] ⭐ PARTICIPANT_SELECTED_ANSWER ACTUALLY EMITTED:",
          args,
        );

        try {
          console.log(
            "[Quiz Socket] ⭐ PARTICIPANT_SELECTED_ANSWER JSON:",
            JSON.stringify(
              args,
              null,
              2,
            ),
          );
        } catch {
          // Ignore serialization errors.
        }
      }

      /*
       * Fastest winner request logging.
       */
      if (
        event ===
        "get_question_fastest_winner"
      ) {
        console.log(
          "[Quiz Socket] 🏆 GET_QUESTION_FASTEST_WINNER ACTUALLY EMITTED:",
          args,
        );

        try {
          console.log(
            "[Quiz Socket] 🏆 GET_QUESTION_FASTEST_WINNER JSON:",
            JSON.stringify(
              args,
              null,
              2,
            ),
          );
        } catch {
          // Ignore serialization errors.
        }
      }
    });

    console.log(
      "[Quiz Socket] Socket instance created.",
    );

    console.log(
      "[Quiz Socket] ----------------------------------------",
    );

    return socket;
  }

  /* ==========================================================
     KEEP LATEST ACCESS TOKEN
     ========================================================== */

  socket.auth = {
    token: accessToken,
  };

  /* ==========================================================
     RECONNECT EXISTING SOCKET
     ========================================================== */

  if (
    !socket.connected &&
    accessToken
  ) {
    console.log(
      "[Quiz Socket] Existing socket is disconnected.",
    );

    console.log(
      "[Quiz Socket] Reconnecting with authenticated token...",
    );

    socket.connect();
  }

  return socket;
}

/* ============================================================
   DISCONNECT SOCKET
   ============================================================ */

export function disconnectQuizSocket(): void {
  if (!socket) {
    console.log(
      "[Quiz Socket] No socket to disconnect.",
    );

    return;
  }

  console.log(
    "[Quiz Socket] Disconnecting socket...",
  );

  console.log(
    "[Quiz Socket] Socket ID:",
    socket.id,
  );

  socket.removeAllListeners();

  socket.disconnect();

  socket = null;

  console.log(
    "[Quiz Socket] Socket completely destroyed.",
  );
}

/* ============================================================
   PARTICIPANT ANSWER SOCKET
   ============================================================ */

const participantAnswerSocket =
  getQuizSocket();

/* ============================================================
   ANSWER RESULT LISTENER
   ============================================================ */

/**
 * Listen for the backend answer result.
 *
 * We intentionally log the complete response here first.
 * This allows us to confirm the backend response contract
 * before making assumptions about fields such as:
 *
 * - isCorrect
 * - correct
 * - questionId
 * - userId
 * - timeTakenInSeconds
 */
participantAnswerSocket.on(
  "answer_result",
  (...args: unknown[]) => {
    console.log(
      "[Quiz Socket] ⭐⭐⭐ ANSWER_RESULT RESPONSE RECEIVED ⭐⭐⭐",
    );

    console.log(
      "[Quiz Socket] ANSWER_RESULT ARGUMENT COUNT:",
      args.length,
    );

    console.log(
      "[Quiz Socket] ANSWER_RESULT ALL ARGS:",
      args,
    );

    try {
      console.log(
        "[Quiz Socket] ANSWER_RESULT JSON:",
        JSON.stringify(
          args,
          null,
          2,
        ),
      );
    } catch {
      console.log(
        "[Quiz Socket] Could not stringify answer_result arguments.",
      );
    }

    const response: unknown =
      args[0];

    console.log(
      "[Quiz Socket] ANSWER_RESULT PAYLOAD:",
      response,
    );

    try {
      console.log(
        "[Quiz Socket] ANSWER_RESULT PAYLOAD JSON:",
        JSON.stringify(
          response,
          null,
          2,
        ),
      );
    } catch {
      console.log(
        "[Quiz Socket] Could not stringify answer_result payload.",
      );
    }
  },
);

/* ============================================================
   SOCKET ERROR LISTENER
   ============================================================ */

participantAnswerSocket.on(
  "socket_error",
  (...args: unknown[]) => {
    console.error(
      "[Quiz Socket] ❌❌❌ SOCKET_ERROR RESPONSE RECEIVED ❌❌❌",
    );

    console.error(
      "[Quiz Socket] SOCKET_ERROR ARGUMENT COUNT:",
      args.length,
    );

    console.error(
      "[Quiz Socket] SOCKET_ERROR ALL ARGS:",
      args,
    );

    try {
      console.error(
        "[Quiz Socket] SOCKET_ERROR JSON:",
        JSON.stringify(
          args,
          null,
          2,
        ),
      );
    } catch {
      console.error(
        "[Quiz Socket] Could not stringify socket_error arguments.",
      );
    }

    const error: unknown =
      args[0];

    console.error(
      "[Quiz Socket] SOCKET_ERROR PAYLOAD:",
      error,
    );

    try {
      console.error(
        "[Quiz Socket] SOCKET_ERROR PAYLOAD JSON:",
        JSON.stringify(
          error,
          null,
          2,
        ),
      );
    } catch {
      console.error(
        "[Quiz Socket] Could not stringify socket_error payload.",
      );
    }
  },
);

/* ============================================================
   QUESTION FASTEST WINNER LISTENER
   ============================================================ */

/**
 * Listen for the backend response to:
 *
 * get_question_fastest_winner
 *
 * IMPORTANT:
 * We are intentionally not assuming the response shape yet.
 *
 * Once the backend response is visible in the console,
 * we can map it safely to QuizFastestWinner.
 */
participantAnswerSocket.on(
  "question_fastest_winner",
  (...args: unknown[]) => {
    console.log(
      "[Quiz Socket] 🏆🏆🏆 QUESTION_FASTEST_WINNER RESPONSE RECEIVED 🏆🏆🏆",
    );

    console.log(
      "[Quiz Socket] QUESTION_FASTEST_WINNER ARGUMENT COUNT:",
      args.length,
    );

    console.log(
      "[Quiz Socket] QUESTION_FASTEST_WINNER ALL ARGS:",
      args,
    );

    try {
      console.log(
        "[Quiz Socket] QUESTION_FASTEST_WINNER JSON:",
        JSON.stringify(
          args,
          null,
          2,
        ),
      );
    } catch {
      console.log(
        "[Quiz Socket] Could not stringify question_fastest_winner arguments.",
      );
    }

    const response: unknown =
      args[0];

    console.log(
      "[Quiz Socket] QUESTION_FASTEST_WINNER PAYLOAD:",
      response,
    );

    try {
      console.log(
        "[Quiz Socket] QUESTION_FASTEST_WINNER PAYLOAD JSON:",
        JSON.stringify(
          response,
          null,
          2,
        ),
      );
    } catch {
      console.log(
        "[Quiz Socket] Could not stringify question_fastest_winner payload.",
      );
    }
  },
);

/* ============================================================
   PARTICIPANT ANSWER PAYLOAD
   ============================================================ */

export interface SubmitParticipantAnswerPayload {
  roomId: string;
  roundNumber: number;
  questionId: string;
  selectedAnswerId: string;
}

/* ============================================================
   PARTICIPANT ANSWER EMITTER
   ============================================================ */

export function submitParticipantAnswer(
  payload: SubmitParticipantAnswerPayload,
): void {
  console.log(
    "[Quiz Socket] PARTICIPANT_SELECTED_ANSWER:",
    payload,
  );

  console.log(
    "[Quiz Socket] PARTICIPANT_SELECTED_ANSWER JSON:",
    JSON.stringify(
      payload,
      null,
      2,
    ),
  );

  console.log(
    "[Quiz Socket] EMITTING participant_selected_answer",
  );

  participantAnswerSocket.emit(
    "participant_selected_answer",
    payload,
  );

  console.log(
    "[Quiz Socket] PARTICIPANT_SELECTED_ANSWER EMITTED",
  );
}

/* ============================================================
   FASTEST QUESTION WINNER
   ============================================================ */

export interface GetQuestionFastestWinnerPayload {
  quizId: string;
  roomId: string;
  questionId: string;
}

/**
 * Request the first participant who got the
 * current question correct.
 *
 * Socket event:
 *
 * get_question_fastest_winner
 */
export function getQuestionFastestWinner(
  payload: GetQuestionFastestWinnerPayload,
): void {
  console.log(
    "[Quiz Socket] 🏆 GET_QUESTION_FASTEST_WINNER PAYLOAD:",
    payload,
  );

  console.log(
    "[Quiz Socket] 🏆 GET_QUESTION_FASTEST_WINNER JSON:",
    JSON.stringify(
      payload,
      null,
      2,
    ),
  );

  console.log(
    "[Quiz Socket] 🏆 EMITTING get_question_fastest_winner",
  );

  participantAnswerSocket.emit(
    "get_question_fastest_winner",
    payload,
  );

  console.log(
    "[Quiz Socket] 🏆 GET_QUESTION_FASTEST_WINNER EMITTED",
  );
}











// // src/lib/socket/quizSocket.ts

// import { io, type Socket } from "socket.io-client";

// import { getAccessToken } from "@/lib/auth/token";

// let socket: Socket | null = null;

// const QUIZ_SOCKET_URL =
//   process.env.NEXT_PUBLIC_QUIZ_SOCKET_URL ||
//   "https://mypastquestionsapp.onrender.com/quiz";

// export function getQuizSocket(): Socket {
//   const accessToken = getAccessToken();

//   console.log(
//     "[Quiz Socket] ----------------------------------------",
//   );

//   console.log(
//     "[Quiz Socket] URL:",
//     QUIZ_SOCKET_URL,
//   );

//   console.log(
//     "[Quiz Socket] Access token available:",
//     Boolean(accessToken),
//   );

//   /*
//    * Create the singleton socket once.
//    */
//   if (!socket) {
//     console.log(
//       "[Quiz Socket] Creating new socket connection...",
//     );

//     socket = io(QUIZ_SOCKET_URL, {
//       transports: ["websocket"],

//       auth: {
//         token: accessToken,
//       },

//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//     });

//     /*
//      * Connection lifecycle logging.
//      */
//     socket.on("connect", () => {
//       console.log(
//         "[Quiz Socket] Connected successfully.",
//       );

//       console.log(
//         "[Quiz Socket] Socket ID:",
//         socket?.id,
//       );

//       console.log(
//         "[Quiz Socket] Connected:",
//         socket?.connected,
//       );
//     });

//     socket.on(
//       "connect_error",
//       (error) => {
//         console.error(
//           "[Quiz Socket] Connection error:",
//           error.message,
//         );

//         console.error(
//           "[Quiz Socket] Full connection error:",
//           error,
//         );
//       },
//     );

//     socket.on(
//       "disconnect",
//       (reason) => {
//         console.log(
//           "[Quiz Socket] Disconnected.",
//         );

//         console.log(
//           "[Quiz Socket] Reason:",
//           reason,
//         );
//       },
//     );

//     /*
//      * Socket.IO manager events.
//      */
//     socket.io.on(
//       "reconnect_attempt",
//       (attempt) => {
//         console.log(
//           "[Quiz Socket] Reconnection attempt:",
//           attempt,
//         );
//       },
//     );

//     socket.io.on(
//       "reconnect",
//       (attempt) => {
//         console.log(
//           "[Quiz Socket] Reconnected successfully.",
//         );

//         console.log(
//           "[Quiz Socket] Attempts:",
//           attempt,
//         );

//         console.log(
//           "[Quiz Socket] Socket ID:",
//           socket?.id,
//         );
//       },
//     );

//     socket.io.on(
//       "reconnect_error",
//       (error) => {
//         console.error(
//           "[Quiz Socket] Reconnection error:",
//           error.message,
//         );
//       },
//     );

//     socket.io.on(
//       "reconnect_failed",
//       () => {
//         console.error(
//           "[Quiz Socket] Reconnection failed.",
//         );
//       },
//     );

//     /*
//      * TEMPORARY diagnostic listener.
//      *
//      * This lets us see every event the server sends to
//      * this socket while we debug the activation contract.
//      *
//      * It can be removed once the socket protocol is confirmed.
//      */
//     socket.onAny((event, ...args) => {
//   console.log(
//     "[Quiz Socket] Incoming event:",
//     event,
//     args,
//   );

//   if (event === "socket_error") {
//     console.error(
//       "[Quiz Socket] ===== SOCKET ERROR =====",
//     );

//     console.error(
//       "[Quiz Socket] Error payload:",
//       args[0],
//     );

//     console.error(
//       "[Quiz Socket] Error payload JSON:",
//       JSON.stringify(
//         args[0],
//         null,
//         2,
//       ),
//     );

//     console.error(
//       "[Quiz Socket] =========================",
//     );
//   }
// });


// socket.onAnyOutgoing((event, ...args) => {
//   console.log(
//     "[Quiz Socket] OUTGOING EVENT:",
//     event,
//     args,
//   );

//   if (event === "participant_selected_answer") {
//     console.log(
//       "[Quiz Socket] ⭐ PARTICIPANT_SELECTED_ANSWER ACTUALLY EMITTED:",
//       args,
//     );

//     try {
//       console.log(
//         "[Quiz Socket] ⭐ ⭐ PARTICIPANT_SELECTED_ANSWER JSON:",
//         JSON.stringify(args, null, 2),
//       );
//     } catch {
//       // Ignore serialization errors.
//     }
//   }
// });


//     console.log(
//       "[Quiz Socket] Socket instance created.",
//     );

//     console.log(
//       "[Quiz Socket] ----------------------------------------",
//     );

//     return socket;
//   }

//   /*
//    * Keep the latest access token on the singleton.
//    */
//   socket.auth = {
//     token: accessToken,
//   };

//   /*
//    * Reconnect an existing socket if necessary.
//    */
//   if (!socket.connected && accessToken) {
//     console.log(
//       "[Quiz Socket] Existing socket is disconnected.",
//     );

//     console.log(
//       "[Quiz Socket] Reconnecting with authenticated token...",
//     );

//     socket.connect();
//   }

//   return socket;
// }

// /* ============================================================
//    DISCONNECT SOCKET
//    ============================================================ */

// export function disconnectQuizSocket(): void {
//   if (!socket) {
//     console.log(
//       "[Quiz Socket] No socket to disconnect.",
//     );

//     return;
//   }

//   console.log(
//     "[Quiz Socket] Disconnecting socket...",
//   );

//   console.log(
//     "[Quiz Socket] Socket ID:",
//     socket.id,
//   );

//   socket.removeAllListeners();

//   socket.disconnect();

//   socket = null;

//   console.log(
//     "[Quiz Socket] Socket completely destroyed.",
//   );
// }


// /* ============================================================
//    PARTICIPANT ANSWER SOCKET
//    ============================================================ */

// const participantAnswerSocket = getQuizSocket();

// /**
//  * Listen for the backend answer result.
//  */
// participantAnswerSocket.on(
//   "answer_result",
//   (...args: unknown[]) => {
//     console.log(
//       "[Quiz Socket] ⭐⭐⭐ ANSWER_RESULT RESPONSE RECEIVED ⭐⭐⭐",
//     );

//     console.log(
//       "[Quiz Socket] ANSWER_RESULT ARGUMENT COUNT:",
//       args.length,
//     );

//     console.log(
//       "[Quiz Socket] ANSWER_RESULT ALL ARGS:",
//       args,
//     );

//     console.log(
//       "[Quiz Socket] ANSWER_RESULT JSON:",
//       JSON.stringify(args, null, 2),
//     );

//     const response: unknown = args[0];

//     console.log(
//       "[Quiz Socket] ANSWER_RESULT PAYLOAD:",
//       response,
//     );

//     console.log(
//       "[Quiz Socket] ANSWER_RESULT PAYLOAD JSON:",
//       JSON.stringify(response, null, 2),
//     );
//   },
// );

// /**
//  * Listen for backend socket errors.
//  */
// participantAnswerSocket.on(
//   "socket_error",
//   (...args: unknown[]) => {
//     console.error(
//       "[Quiz Socket] ❌❌❌ SOCKET_ERROR RESPONSE RECEIVED ❌❌❌",
//     );

//     console.error(
//       "[Quiz Socket] SOCKET_ERROR ARGUMENT COUNT:",
//       args.length,
//     );

//     console.error(
//       "[Quiz Socket] SOCKET_ERROR ALL ARGS:",
//       args,
//     );

//     console.error(
//       "[Quiz Socket] SOCKET_ERROR JSON:",
//       JSON.stringify(args, null, 2),
//     );

//     const error: unknown = args[0];

//     console.error(
//       "[Quiz Socket] SOCKET_ERROR PAYLOAD:",
//       error,
//     );

//     console.error(
//       "[Quiz Socket] SOCKET_ERROR PAYLOAD JSON:",
//       JSON.stringify(error, null, 2),
//     );
//   },
// );


// /* ============================================================
//    PARTICIPANT ANSWER PAYLOAD
//    ============================================================ */

// export interface SubmitParticipantAnswerPayload {
//   roomId: string;
//   roundNumber: number;
//   questionId: string;
//   selectedAnswerId: string;
// }


// /* ============================================================
//    PARTICIPANT ANSWER EMITTER
//    ============================================================ */

// export function submitParticipantAnswer(
//   payload: SubmitParticipantAnswerPayload,
// ): void {
//   console.log(
//     "[Quiz Socket] PARTICIPANT_SELECTED_ANSWER:",
//     payload,
//   );

//   console.log(
//     "[Quiz Socket] PARTICIPANT_SELECTED_ANSWER JSON:",
//     JSON.stringify(payload, null, 2),
//   );

//   console.log(
//     "[Quiz Socket] EMITTING participant_selected_answer",
//   );

//   participantAnswerSocket.emit(
//     "participant_selected_answer",
//     payload,
//   );

//   console.log(
//     "[Quiz Socket] PARTICIPANT_SELECTED_ANSWER EMITTED",
//   );
// }


// /* ============================================================
//    FASTEST QUESTION WINNER
//    ============================================================ */

// export interface GetQuestionFastestWinnerPayload {
//   quizId: string;
//   roomId: string;
//   questionId: string;
// }

// /**
//  * Request the first participant who got the current
//  * question correct.
//  *
//  * Socket event:
//  * get_question_fastest_winner
//  */
// export function getQuestionFastestWinner(
//   payload: GetQuestionFastestWinnerPayload,
// ): void {
//   console.log(
//     "[Quiz Socket] 🏆 GET_QUESTION_FASTEST_WINNER PAYLOAD:",
//     payload,
//   );

//   console.log(
//     "[Quiz Socket] 🏆 GET_QUESTION_FASTEST_WINNER JSON:",
//     JSON.stringify(
//       payload,
//       null,
//       2,
//     ),
//   );

//   console.log(
//     "[Quiz Socket] 🏆 EMITTING get_question_fastest_winner",
//   );

//   participantAnswerSocket.emit(
//     "get_question_fastest_winner",
//     payload,
//   );

//   console.log(
//     "[Quiz Socket] 🏆 GET_QUESTION_FASTEST_WINNER EMITTED",
//   );
// }