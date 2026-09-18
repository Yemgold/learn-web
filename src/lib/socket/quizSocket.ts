


import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getQuizSocket(): Socket {
  if (!socket) {
    socket = io(
      process.env.NEXT_PUBLIC_QUIZ_SOCKET_URL!,
      {
        transports: ["websocket"],
      },
    );
  }

  return socket;
}

export function disconnectQuizSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}