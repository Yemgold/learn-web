


// src/lib/socket/quizSocket.ts

import { io, type Socket } from "socket.io-client";

import { getAccessToken } from "@/lib/auth/token";

let socket: Socket | null = null;

const QUIZ_SOCKET_URL =
  process.env.NEXT_PUBLIC_QUIZ_SOCKET_URL ||
  "https://mypastquestionsapp.onrender.com/quiz";

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

    /*
     * Connection lifecycle logging.
     */
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

    /*
     * Socket.IO manager events.
     */
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

    /*
     * TEMPORARY diagnostic listener.
     *
     * This lets us see every event the server sends to
     * this socket while we debug the activation contract.
     *
     * It can be removed once the socket protocol is confirmed.
     */
    socket.onAny((event, ...args) => {
      console.log(
        "[Quiz Socket] Incoming event:",
        event,
        args,
      );
    });

    console.log(
      "[Quiz Socket] Socket instance created.",
    );

    console.log(
      "[Quiz Socket] ----------------------------------------",
    );

    return socket;
  }

  /*
   * Keep the latest access token on the singleton.
   */
  socket.auth = {
    token: accessToken,
  };

  /*
   * Reconnect an existing socket if necessary.
   */
  if (!socket.connected && accessToken) {
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