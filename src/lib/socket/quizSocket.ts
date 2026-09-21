

// src/lib/socket/quizSocket.ts

import { io, type Socket } from "socket.io-client";

import { getAccessToken } from "@/lib/auth/token";

let socket: Socket | null = null;

/* ============================================================
   GET QUIZ SOCKET
   ============================================================ */

export function getQuizSocket(): Socket {
  const accessToken = getAccessToken();

  console.log("[Quiz Socket] Access token available:", Boolean(accessToken));

  /* ============================================================
     CREATE SOCKET
     ============================================================ */

  if (!socket) {
    console.log("[Quiz Socket] Creating socket...");

    socket = io(
      process.env.NEXT_PUBLIC_QUIZ_SOCKET_URL!,
      {
        transports: ["websocket"],

        /*
         * Socket.IO authentication.
         *
         * The backend should read this from:
         *
         * socket.handshake.auth.token
         */
        auth: {
          token: accessToken,
        },
      },
    );

    return socket;
  }

  /* ============================================================
     SOCKET ALREADY EXISTS
     ============================================================ */

  /*
   * The socket may have been created before authentication
   * finished.
   *
   * Update the authentication data with the current token.
   */
  socket.auth = {
    token: accessToken,
  };

  /*
   * If the socket previously failed because there was no token,
   * reconnect using the newly updated authentication data.
   */
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

export function disconnectQuizSocket() {
  if (socket) {
    console.log("[Quiz Socket] Disconnecting socket...");

    socket.disconnect();

    socket = null;
  }
}