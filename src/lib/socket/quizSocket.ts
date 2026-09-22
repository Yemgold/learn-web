// src/lib/socket/quizSocket.ts

import { io, type Socket } from "socket.io-client";

import { getAccessToken } from "@/lib/auth/token";

/* ============================================================
   QUIZ SOCKET
   ------------------------------------------------------------
   This is a singleton socket connection.

   The waiting room and the play page both use the same socket
   instance so that navigating from:

      Waiting Room
          ↓
      /play
          ↓
      question_started

   does not accidentally create/disconnect another socket.
   ============================================================ */

let socket: Socket | null = null;

/* ============================================================
   SOCKET URL
   ============================================================ */

const QUIZ_SOCKET_URL =
  process.env.NEXT_PUBLIC_QUIZ_SOCKET_URL ||
  "https://mypastquestionsapp.onrender.com/quiz";

/* ============================================================
   GET / CREATE SOCKET
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

  /* ==========================================================
     CREATE SOCKET ONLY ONCE
     ========================================================== */

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
       CONNECT
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

    /* ========================================================
       CONNECT ERROR
       ======================================================== */

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

    /* ========================================================
       DISCONNECT
       ======================================================== */

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
       RECONNECTION ATTEMPT
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

    /* ========================================================
       RECONNECTED
       ======================================================== */

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

    /* ========================================================
       RECONNECTION ERROR
       ======================================================== */

    socket.io.on(
      "reconnect_error",
      (error) => {
        console.error(
          "[Quiz Socket] Reconnection error:",
          error.message,
        );
      },
    );

    /* ========================================================
       RECONNECTION FAILED
       ======================================================== */

    socket.io.on(
      "reconnect_failed",
      () => {
        console.error(
          "[Quiz Socket] Reconnection failed.",
        );
      },
    );

    console.log(
      "[Quiz Socket] Socket instance created.",
    );

    console.log(
      "[Quiz Socket] ----------------------------------------",
    );

    return socket;
  }

  /* ==========================================================
     SOCKET ALREADY EXISTS
     ----------------------------------------------------------
     Refresh the authentication token before returning it.
     ========================================================== */

  socket.auth = {
    token: accessToken,
  };

  /* ==========================================================
     RECONNECT IF NECESSARY
     ========================================================== */

  if (!socket.connected && accessToken) {
    console.log(
      "[Quiz Socket] Existing socket is disconnected.",
    );

    console.log(
      "[Quiz Socket] Reconnecting with authenticated token...",
    );

    socket.connect();
  }

  /* ==========================================================
     RETURN SINGLETON SOCKET
     ========================================================== */

  return socket;
}

/* ============================================================
   DISCONNECT SOCKET
   ------------------------------------------------------------
   IMPORTANT:
   The waiting room should NOT call this when navigating to
   the play page.

   The play page and waiting room share the same singleton
   socket.

   Only call this when the entire quiz socket session should
   actually end.
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

  /*
   * Remove application listeners that were registered directly
   * on the singleton socket.
   *
   * This happens only when the entire socket is intentionally
   * being destroyed.
   */

  socket.removeAllListeners();

  /*
   * Disconnect the Socket.IO connection.
   */

  socket.disconnect();

  /*
   * Clear singleton reference so the next call to
   * getQuizSocket() creates a fresh connection.
   */

  socket = null;

  console.log(
    "[Quiz Socket] Socket completely destroyed.",
  );
}




// // src/lib/socket/quizSocket.ts

// import { io, type Socket } from "socket.io-client";

// import { getAccessToken } from "@/lib/auth/token";

// let socket: Socket | null = null;

// /* ============================================================
//    SOCKET URL
//    ============================================================ */

// const QUIZ_SOCKET_URL =
//   process.env.NEXT_PUBLIC_QUIZ_SOCKET_URL ||
//   "https://mypastquestionsapp.onrender.com/quiz";

// /* ============================================================
//    GET QUIZ SOCKET
//    ============================================================ */

// export function getQuizSocket(): Socket {
//   const accessToken = getAccessToken();

//   console.log(
//     "[Quiz Socket] URL:",
//     QUIZ_SOCKET_URL,
//   );

//   console.log(
//     "[Quiz Socket] Access token available:",
//     Boolean(accessToken),
//   );

//   /* ============================================================
//      CREATE SOCKET
//      ============================================================ */

//   if (!socket) {
//     console.log(
//       "[Quiz Socket] Creating socket connection...",
//     );

//     socket = io(QUIZ_SOCKET_URL, {
//       /*
//        * Force WebSocket transport.
//        *
//        * The browser should therefore connect to the
//        * configured Render Socket.IO server instead of
//        * the Vercel frontend.
//        */
//       transports: ["websocket"],

//       /*
//        * Socket.IO authentication.
//        *
//        * Backend should read:
//        *
//        * socket.handshake.auth.token
//        */
//       auth: {
//         token: accessToken,
//       },

//       /*
//        * Allow the Socket.IO client to reconnect automatically.
//        */
//       reconnection: true,

//       /*
//        * Number of automatic reconnection attempts.
//        */
//       reconnectionAttempts: 10,

//       /*
//        * Delay between reconnection attempts.
//        */
//       reconnectionDelay: 1000,

//       /*
//        * Maximum reconnection delay.
//        */
//       reconnectionDelayMax: 5000,
//     });

//     /* ============================================================
//        CONNECT
//        ============================================================ */

//     socket.on("connect", () => {
//       console.log(
//         "[Quiz Socket] Connected successfully.",
//       );

//       console.log(
//         "[Quiz Socket] Socket ID:",
//         socket?.id,
//       );
//     });

//     /* ============================================================
//        CONNECT ERROR
//        ============================================================ */

//     socket.on("connect_error", (error) => {
//       console.error(
//         "[Quiz Socket] Connection error:",
//         error.message,
//       );

//       console.error(
//         "[Quiz Socket] Full error:",
//         error,
//       );
//     });

//     /* ============================================================
//        DISCONNECT
//        ============================================================ */

//     socket.on("disconnect", (reason) => {
//       console.log(
//         "[Quiz Socket] Disconnected:",
//         reason,
//       );
//     });

//     /* ============================================================
//        RECONNECT ATTEMPT
//        ============================================================ */

//     socket.io.on("reconnect_attempt", (attempt) => {
//       console.log(
//         "[Quiz Socket] Reconnection attempt:",
//         attempt,
//       );
//     });

//     /* ============================================================
//        RECONNECT
//        ============================================================ */

//     socket.io.on("reconnect", (attempt) => {
//       console.log(
//         "[Quiz Socket] Reconnected after attempts:",
//         attempt,
//       );
//     });

//     /* ============================================================
//        RECONNECT ERROR
//        ============================================================ */

//     socket.io.on("reconnect_error", (error) => {
//       console.error(
//         "[Quiz Socket] Reconnection error:",
//         error.message,
//       );
//     });

//     /* ============================================================
//        RECONNECT FAILED
//        ============================================================ */

//     socket.io.on("reconnect_failed", () => {
//       console.error(
//         "[Quiz Socket] Reconnection failed.",
//       );
//     });

//     return socket;
//   }

//   /* ============================================================
//      SOCKET ALREADY EXISTS
//      ============================================================ */

//   /*
//    * Update authentication information in case the socket
//    * was originally created before the user was authenticated.
//    */
//   socket.auth = {
//     token: accessToken,
//   };

//   /* ============================================================
//      RECONNECT WITH AUTHENTICATION
//      ============================================================ */

//   if (!socket.connected && accessToken) {
//     console.log(
//       "[Quiz Socket] Socket exists but is disconnected.",
//     );

//     console.log(
//       "[Quiz Socket] Reconnecting with authenticated token...",
//     );

//     socket.connect();
//   }

//   return socket;
// }

// /* ============================================================
//    DISCONNECT QUIZ SOCKET
//    ============================================================ */

// export function disconnectQuizSocket(): void {
//   if (!socket) {
//     return;
//   }

//   console.log(
//     "[Quiz Socket] Disconnecting socket...",
//   );

//   socket.removeAllListeners();

//   socket.disconnect();

//   socket = null;
// }