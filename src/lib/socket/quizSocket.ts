




// src/lib/socket/quizSocket.ts

import { io, type Socket } from "socket.io-client";

import { getAccessToken } from "@/lib/auth/token";

let socket: Socket | null = null;

/* ============================================================
   SOCKET URL
   ============================================================ */

const QUIZ_SOCKET_URL =
  process.env.NEXT_PUBLIC_QUIZ_SOCKET_URL ||
  "https://mypastquestionsapp.onrender.com/quiz";

/* ============================================================
   GET QUIZ SOCKET
   ============================================================ */

export function getQuizSocket(): Socket {
  const accessToken = getAccessToken();

  console.log(
    "[Quiz Socket] URL:",
    QUIZ_SOCKET_URL,
  );

  console.log(
    "[Quiz Socket] Access token available:",
    Boolean(accessToken),
  );

  /* ============================================================
     CREATE SOCKET
     ============================================================ */

  if (!socket) {
    console.log(
      "[Quiz Socket] Creating socket connection...",
    );

    socket = io(QUIZ_SOCKET_URL, {
      /*
       * Force WebSocket transport.
       *
       * The browser should therefore connect to the
       * configured Render Socket.IO server instead of
       * the Vercel frontend.
       */
      transports: ["websocket"],

      /*
       * Socket.IO authentication.
       *
       * Backend should read:
       *
       * socket.handshake.auth.token
       */
      auth: {
        token: accessToken,
      },

      /*
       * Allow the Socket.IO client to reconnect automatically.
       */
      reconnection: true,

      /*
       * Number of automatic reconnection attempts.
       */
      reconnectionAttempts: 10,

      /*
       * Delay between reconnection attempts.
       */
      reconnectionDelay: 1000,

      /*
       * Maximum reconnection delay.
       */
      reconnectionDelayMax: 5000,
    });

    /* ============================================================
       CONNECT
       ============================================================ */

    socket.on("connect", () => {
      console.log(
        "[Quiz Socket] Connected successfully.",
      );

      console.log(
        "[Quiz Socket] Socket ID:",
        socket?.id,
      );
    });

    /* ============================================================
       CONNECT ERROR
       ============================================================ */

    socket.on("connect_error", (error) => {
      console.error(
        "[Quiz Socket] Connection error:",
        error.message,
      );

      console.error(
        "[Quiz Socket] Full error:",
        error,
      );
    });

    /* ============================================================
       DISCONNECT
       ============================================================ */

    socket.on("disconnect", (reason) => {
      console.log(
        "[Quiz Socket] Disconnected:",
        reason,
      );
    });

    /* ============================================================
       RECONNECT ATTEMPT
       ============================================================ */

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(
        "[Quiz Socket] Reconnection attempt:",
        attempt,
      );
    });

    /* ============================================================
       RECONNECT
       ============================================================ */

    socket.io.on("reconnect", (attempt) => {
      console.log(
        "[Quiz Socket] Reconnected after attempts:",
        attempt,
      );
    });

    /* ============================================================
       RECONNECT ERROR
       ============================================================ */

    socket.io.on("reconnect_error", (error) => {
      console.error(
        "[Quiz Socket] Reconnection error:",
        error.message,
      );
    });

    /* ============================================================
       RECONNECT FAILED
       ============================================================ */

    socket.io.on("reconnect_failed", () => {
      console.error(
        "[Quiz Socket] Reconnection failed.",
      );
    });

    return socket;
  }

  /* ============================================================
     SOCKET ALREADY EXISTS
     ============================================================ */

  /*
   * Update authentication information in case the socket
   * was originally created before the user was authenticated.
   */
  socket.auth = {
    token: accessToken,
  };

  /* ============================================================
     RECONNECT WITH AUTHENTICATION
     ============================================================ */

  if (!socket.connected && accessToken) {
    console.log(
      "[Quiz Socket] Socket exists but is disconnected.",
    );

    console.log(
      "[Quiz Socket] Reconnecting with authenticated token...",
    );

    socket.connect();
  }

  return socket;
}

/* ============================================================
   DISCONNECT QUIZ SOCKET
   ============================================================ */

export function disconnectQuizSocket(): void {
  if (!socket) {
    return;
  }

  console.log(
    "[Quiz Socket] Disconnecting socket...",
  );

  socket.removeAllListeners();

  socket.disconnect();

  socket = null;
}