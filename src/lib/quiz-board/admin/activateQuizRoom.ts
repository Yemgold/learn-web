
// C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\admin\activateQuizRoom.ts

import { getQuizSocket } from "@/lib/socket/quizSocket";

export interface ActivateQuizRoomResult {
  quizId: string;
  roomId: string;
}

type RecordPayload = Record<string, unknown>;

function isRecord(value: unknown): value is RecordPayload {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

/**
 * Converts payloads such as:
 *
 * {
 *   event: "room_activation_ack",
 *   data: {
 *     quizId: "...",
 *     roomId: "...",
 *     status: "IN_PROGRESS",
 *     message: "Quiz room activated successfully."
 *   }
 * }
 *
 * or:
 *
 * [
 *   {
 *     event: "room_activation_ack",
 *     data: {...}
 *   }
 * ]
 *
 * into a list of objects that can be inspected.
 */
function getPayloadLayers(payload: unknown): RecordPayload[] {
  const layers: RecordPayload[] = [];
  const queue: unknown[] = [];

  if (Array.isArray(payload)) {
    queue.push(...payload);
  } else {
    queue.push(payload);
  }

  const visited = new Set<object>();

  while (queue.length > 0) {
    const current = queue.shift();

    if (!isRecord(current)) {
      continue;
    }

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    layers.push(current);

    if (isRecord(current.data)) {
      queue.push(current.data);
    }

    if (isRecord(current.payload)) {
      queue.push(current.payload);
    }

    if (Array.isArray(current.data)) {
      queue.push(...current.data);
    }

    if (Array.isArray(current.payload)) {
      queue.push(...current.payload);
    }
  }

  return layers;
}

function getString(
  layers: RecordPayload[],
  keys: string[],
): string | null {
  for (const layer of layers) {
    for (const key of keys) {
      const value = layer[key];

      if (
        typeof value === "string" &&
        value.trim().length > 0
      ) {
        return value.trim();
      }
    }
  }

  return null;
}

function getBoolean(
  layers: RecordPayload[],
  keys: string[],
): boolean | null {
  for (const layer of layers) {
    for (const key of keys) {
      const value = layer[key];

      if (typeof value === "boolean") {
        return value;
      }

      if (typeof value === "string") {
        const normalized = value
          .trim()
          .toLowerCase();

        if (normalized === "true") {
          return true;
        }

        if (normalized === "false") {
          return false;
        }
      }
    }
  }

  return null;
}

function getEventName(
  payload: unknown,
): string | null {
  const layers = getPayloadLayers(payload);

  return getString(layers, [
    "event",
    "eventName",
    "event_name",
    "type",
  ]);
}

function isMatchingRoom(
  payload: unknown,
  quizId: string,
  roomId: string,
): boolean {
  const layers = getPayloadLayers(payload);

  const responseQuizId = getString(layers, [
    "quizId",
    "quiz_id",
    "quizID",
  ]);

  const responseRoomId = getString(layers, [
    "roomId",
    "room_id",
    "roomID",
  ]);

  /*
   * If the server did not send IDs at all,
   * don't reject the event merely because
   * they are absent.
   */
  if (
    responseQuizId &&
    responseQuizId !== quizId
  ) {
    return false;
  }

  if (
    responseRoomId &&
    responseRoomId !== roomId
  ) {
    return false;
  }

  return true;
}

function getActivationMessage(
  payload: unknown,
): string {
  const layers = getPayloadLayers(payload);

  return (
    getString(layers, [
      "message",
      "error",
      "reason",
      "detail",
    ]) ||
    "The server rejected room activation."
  );
}

function isExplicitFailure(
  payload: unknown,
): boolean {
  const layers = getPayloadLayers(payload);

  const success = getBoolean(layers, [
    "success",
    "ok",
    "activated",
  ]);

  return success === false;
}

function isExplicitSuccess(
  payload: unknown,
): boolean {
  const layers = getPayloadLayers(payload);

  const success = getBoolean(layers, [
    "success",
    "ok",
    "activated",
  ]);

  return success === true;
}

/**
 * Detects the exact backend response currently
 * being returned:
 *
 * {
 *   event: "room_activation_ack",
 *   data: {
 *     roomId: "...",
 *     quizId: "...",
 *     role: "...",
 *     status: "...",
 *     message: "Quiz room activated successfully."
 *   }
 * }
 */
function isSuccessfulActivationEnvelope(
  payload: unknown,
  quizId: string,
  roomId: string,
): boolean {
  const eventName = getEventName(payload);

  if (
    eventName !== "room_activation_ack"
  ) {
    return false;
  }

  if (
    !isMatchingRoom(
      payload,
      quizId,
      roomId,
    )
  ) {
    return false;
  }

  if (isExplicitFailure(payload)) {
    return false;
  }

  /*
   * The backend's response itself says:
   *
   * "Quiz room activated successfully."
   *
   * Therefore the envelope is enough to
   * complete the activation.
   */
  return true;
}

/**
 * Activates an already-created Quiz Board room.
 *
 * IMPORTANT:
 * This function does NOT create the room.
 *
 * It:
 *
 * 1. Gets the shared quiz socket.
 * 2. Registers listeners.
 * 3. Emits activate_room.
 * 4. Handles room_activation_ack.
 * 5. Handles room_activated.
 * 6. Handles the backend's current
 *    { event, data } response.
 * 7. Handles the current "exception" transport
 *    observed in the browser.
 * 8. Handles Socket.IO acknowledgement callbacks.
 */
export function activateQuizRoom(
  quizId: string,
  roomId: string,
): Promise<ActivateQuizRoomResult> {
  return new Promise((resolve, reject) => {
    const normalizedQuizId = quizId.trim();
    const normalizedRoomId = roomId.trim();

    if (!normalizedQuizId) {
      reject(
        new Error(
          "A valid quiz ID is required.",
        ),
      );

      return;
    }

    if (!normalizedRoomId) {
      reject(
        new Error(
          "A valid room ID is required.",
        ),
      );

      return;
    }

    const socket = getQuizSocket();

    let settled = false;

    let timeoutId:
      | ReturnType<typeof setTimeout>
      | null = null;

    function cleanup() {
      socket.off(
        "room_activation_ack",
        handleActivationAck,
      );

      socket.off(
        "room_activated",
        handleRoomActivated,
      );

      socket.off(
        "exception",
        handleException,
      );

      socket.off(
        "message",
        handleMessage,
      );

      socket.off(
        "connect_error",
        handleConnectError,
      );

      socket.off(
        "disconnect",
        handleDisconnect,
      );

      socket.off(
        "connect",
        emitActivation,
      );

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }

    function finishSuccess() {
      if (settled) {
        return;
      }

      settled = true;

      cleanup();

      console.log(
        "[Quiz Activation] ========================================",
      );

      console.log(
        "[Quiz Activation] ROOM ACTIVATED SUCCESSFULLY",
      );

      console.log(
        "[Quiz Activation] quizId:",
        normalizedQuizId,
      );

      console.log(
        "[Quiz Activation] roomId:",
        normalizedRoomId,
      );

      console.log(
        "[Quiz Activation] ========================================",
      );

      resolve({
        quizId: normalizedQuizId,
        roomId: normalizedRoomId,
      });
    }

    function finishError(
      message: string,
    ) {
      if (settled) {
        return;
      }

      settled = true;

      cleanup();

      console.error(
        "[Quiz Activation] ========================================",
      );

      console.error(
        "[Quiz Activation] ACTIVATION FAILED:",
        message,
      );

      console.error(
        "[Quiz Activation] ========================================",
      );

      reject(new Error(message));
    }

    /**
     * Process any payload that could represent
     * the backend activation response.
     */
    function processActivationPayload(
      payload: unknown,
      source: string,
    ) {
      if (settled) {
        return;
      }

      console.log(
        `[Quiz Activation] Processing ${source}:`,
        payload,
      );

      const eventName =
        getEventName(payload);

      console.log(
        `[Quiz Activation] ${source} event name:`,
        eventName,
      );

      /*
       * FIRST:
       *
       * Handle the exact backend envelope:
       *
       * {
       *   event: "room_activation_ack",
       *   data: {...}
       * }
       */
      if (
        isSuccessfulActivationEnvelope(
          payload,
          normalizedQuizId,
          normalizedRoomId,
        )
      ) {
        console.log(
          "[Quiz Activation] Backend activation envelope confirmed success.",
        );

        finishSuccess();

        return;
      }

      /*
       * Explicit backend failure.
       */
      if (isExplicitFailure(payload)) {
        finishError(
          getActivationMessage(payload),
        );

        return;
      }

      /*
       * Direct success response.
       */
      if (
        isExplicitSuccess(payload) &&
        isMatchingRoom(
          payload,
          normalizedQuizId,
          normalizedRoomId,
        )
      ) {
        console.log(
          "[Quiz Activation] Explicit success received.",
        );

        finishSuccess();

        return;
      }

      /*
       * Check matching room IDs.
       */
      if (
        isMatchingRoom(
          payload,
          normalizedQuizId,
          normalizedRoomId,
        )
      ) {
        const layers =
          getPayloadLayers(payload);

        const responseQuizId =
          getString(layers, [
            "quizId",
            "quiz_id",
            "quizID",
          ]);

        const responseRoomId =
          getString(layers, [
            "roomId",
            "room_id",
            "roomID",
          ]);

        /*
         * If the backend gave us both IDs and
         * they match, this is enough to identify
         * the activation response.
         */
        if (
          responseQuizId ===
            normalizedQuizId &&
          responseRoomId ===
            normalizedRoomId
        ) {
          const message =
            getString(layers, [
              "message",
            ]);

          if (
            message
              ?.toLowerCase()
              .includes("activated")
          ) {
            console.log(
              "[Quiz Activation] Matching activation success message received.",
            );

            finishSuccess();

            return;
          }
        }
      }

      /*
       * If the payload was received through
       * "exception" but it is NOT the activation
       * envelope, do NOT treat it as success.
       */
      if (
        source === "exception"
      ) {
        console.error(
          "[Quiz Activation] Server exception did not contain a valid room_activation_ack envelope:",
          payload,
        );

        finishError(
          getActivationMessage(payload),
        );
      }
    }

    /**
     * Normal:
     *
     * socket.on("room_activation_ack")
     */
    function handleActivationAck(
      payload: unknown,
    ) {
      console.log(
        "[Quiz Activation] room_activation_ack received:",
        payload,
      );

      processActivationPayload(
        payload,
        "room_activation_ack",
      );
    }

    /**
     * Alternative:
     *
     * socket.on("room_activated")
     */
    function handleRoomActivated(
      payload: unknown,
    ) {
      console.log(
        "[Quiz Activation] room_activated received:",
        payload,
      );

      if (
        !isMatchingRoom(
          payload,
          normalizedQuizId,
          normalizedRoomId,
        )
      ) {
        console.warn(
          "[Quiz Activation] Ignoring room_activated for another room.",
        );

        return;
      }

      if (
        isExplicitFailure(payload)
      ) {
        finishError(
          getActivationMessage(payload),
        );

        return;
      }

      finishSuccess();
    }

    /**
     * IMPORTANT:
     *
     * Your browser is currently showing:
     *
     * Incoming event: exception
     *
     * The backend response is:
     *
     * {
     *   event: "room_activation_ack",
     *   data: {...}
     * }
     *
     * Therefore we inspect exception for
     * that envelope.
     */

    // function handleException(
    //   payload: unknown,
    // ) {
    //   console.warn(
    //     "[Quiz Activation] exception event received:",
    //     payload,
    //   );

    //   processActivationPayload(
    //     payload,
    //     "exception",
    //   );
    // }



function handleException(
  payload: unknown,
) {
  console.error(
    "[Quiz Activation] FULL SERVER EXCEPTION:",
    JSON.stringify(payload, null, 2),
  );

  console.error(
    "[Quiz Activation] exception event received:",
    payload,
  );

  processActivationPayload(
    payload,
    "exception",
  );
}









    /**
     * Some Socket.IO/NestJS setups may place
     * returned event envelopes on "message".
     */
    function handleMessage(
      payload: unknown,
    ) {
      console.log(
        "[Quiz Activation] message event received:",
        payload,
      );

      processActivationPayload(
        payload,
        "message",
      );
    }

    function handleConnectError(
      error: unknown,
    ) {
      if (settled) {
        return;
      }

      console.error(
        "[Quiz Activation] Socket connection error:",
        error,
      );

      const message =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (
          error as {
            message?: unknown;
          }
        ).message === "string"
          ? String(
              (
                error as {
                  message: string;
                }
              ).message,
            )
          : "Unable to connect to the quiz server.";

      finishError(message);
    }

    function handleDisconnect(
      reason: string,
    ) {
      if (settled) {
        return;
      }

      console.error(
        "[Quiz Activation] Socket disconnected:",
        reason,
      );

      finishError(
        `Quiz server disconnected${
          reason
            ? `: ${reason}`
            : "."
        }`,
      );
    }

    /**
     * Socket.IO acknowledgement callback.
     */
    function handleSocketAck(
      response: unknown,
    ) {
      if (settled) {
        return;
      }

      console.log(
        "[Quiz Activation] Socket acknowledgement received:",
        response,
      );

      /*
       * No response object means the server
       * invoked the acknowledgement callback.
       */
      if (
        response === undefined ||
        response === null
      ) {
        finishSuccess();
        return;
      }

      processActivationPayload(
        response,
        "socket acknowledgement",
      );
    }

    /**
     * Emit the activation request.
     */
    function emitActivation() {
      if (settled) {
        return;
      }

      console.log(
        "[Quiz Activation] ----------------------------------------",
      );

      console.log(
        "[Quiz Activation] Emitting activate_room:",
        {
          quizId: normalizedQuizId,
          roomId: normalizedRoomId,
        },
      );

      console.log(
        "[Quiz Activation] Socket connected:",
        socket.connected,
      );

      console.log(
        "[Quiz Activation] ----------------------------------------",
      );

      socket.emit(
        "activate_room",
        {
          roomId: normalizedRoomId,
          quizId: normalizedQuizId,
          role: "ADMIN",
        },
        handleSocketAck,
      );
    }

    /*
     * Register listeners BEFORE emitting.
     */
    socket.on(
      "room_activation_ack",
      handleActivationAck,
    );

    socket.on(
      "room_activated",
      handleRoomActivated,
    );

    socket.on(
      "exception",
      handleException,
    );

    socket.on(
      "message",
      handleMessage,
    );

    socket.on(
      "connect_error",
      handleConnectError,
    );

    socket.on(
      "disconnect",
      handleDisconnect,
    );

    /*
     * Socket is already connected.
     */
    if (socket.connected) {
      emitActivation();
    } else {
      /*
       * Wait for connection.
       */
      socket.once(
        "connect",
        emitActivation,
      );

      socket.connect();
    }

    /*
     * Safety timeout.
     */
    timeoutId = setTimeout(() => {
      if (settled) {
        return;
      }

      finishError(
        "Timed out waiting for room activation. The quiz server did not acknowledge the activation request.",
      );
    }, 15_000);
  });
}









// // C:\Users\Lara Spellman\Jamb\jamb-league\src\lib\quiz-board\admin\activateQuizRoom.ts

// import { getQuizSocket } from "@/lib/socket/quizSocket";

// export interface ActivateQuizRoomResult {
//   quizId: string;
//   roomId: string;
// }

// type RecordPayload = Record<string, unknown>;

// interface SocketActivationAck {
//   success?: boolean;
//   ok?: boolean;
//   activated?: boolean;
//   message?: string;
//   error?: string;
//   reason?: string;
//   quizId?: string;
//   quiz_id?: string;
//   roomId?: string;
//   room_id?: string;
//   data?: unknown;
//   payload?: unknown;
// }

// function getPayloadLayers(payload: unknown): RecordPayload[] {
//   const layers: RecordPayload[] = [];

//   let current: unknown = payload;

//   while (
//     current &&
//     typeof current === "object" &&
//     !Array.isArray(current)
//   ) {
//     const record = current as RecordPayload;

//     layers.push(record);

//     if (
//       record.data &&
//       typeof record.data === "object" &&
//       !Array.isArray(record.data) &&
//       record.data !== current
//     ) {
//       current = record.data;
//       continue;
//     }

//     if (
//       record.payload &&
//       typeof record.payload === "object" &&
//       !Array.isArray(record.payload) &&
//       record.payload !== current
//     ) {
//       current = record.payload;
//       continue;
//     }

//     break;
//   }

//   return layers;
// }

// function getString(
//   layers: RecordPayload[],
//   keys: string[],
// ): string | null {
//   for (const layer of layers) {
//     for (const key of keys) {
//       const value = layer[key];

//       if (typeof value === "string" && value.trim()) {
//         return value.trim();
//       }
//     }
//   }

//   return null;
// }

// function getBoolean(
//   layers: RecordPayload[],
//   keys: string[],
// ): boolean | null {
//   for (const layer of layers) {
//     for (const key of keys) {
//       const value = layer[key];

//       if (typeof value === "boolean") {
//         return value;
//       }

//       if (typeof value === "string") {
//         const normalized = value.trim().toLowerCase();

//         if (normalized === "true") {
//           return true;
//         }

//         if (normalized === "false") {
//           return false;
//         }
//       }
//     }
//   }

//   return null;
// }

// function isMatchingRoom(
//   payload: unknown,
//   quizId: string,
//   roomId: string,
// ): boolean {
//   const layers = getPayloadLayers(payload);

//   const responseQuizId = getString(layers, [
//     "quizId",
//     "quiz_id",
//     "quizID",
//   ]);

//   const responseRoomId = getString(layers, [
//     "roomId",
//     "room_id",
//     "roomID",
//   ]);

//   if (responseQuizId && responseQuizId !== quizId) {
//     return false;
//   }

//   if (responseRoomId && responseRoomId !== roomId) {
//     return false;
//   }

//   return true;
// }

// function getActivationMessage(payload: unknown): string {
//   const layers = getPayloadLayers(payload);

//   return (
//     getString(layers, [
//       "message",
//       "error",
//       "reason",
//     ]) || "The server rejected room activation."
//   );
// }

// function isSuccessfulActivation(payload: unknown): boolean {
//   const layers = getPayloadLayers(payload);

//   const success = getBoolean(layers, [
//     "success",
//     "ok",
//     "activated",
//   ]);

//   /*
//    * Some Socket.IO backends return:
//    *
//    * { success: true }
//    *
//    * while others may return:
//    *
//    * { ok: true }
//    *
//    * or:
//    *
//    * { activated: true }
//    */

//   return success === true;
// }

// /**
//  * Activates an already-created Quiz Board room through Socket.IO.
//  *
//  * This function DOES NOT create the room.
//  *
//  * Flow:
//  *
//  *   1. Get the shared quiz socket.
//  *   2. Register listeners before emitting.
//  *   3. Emit activate_room.
//  *   4. Accept a successful activation acknowledgement.
//  *   5. Also accept room_activated when the backend emits it.
//  *   6. Support Socket.IO acknowledgement callbacks.
//  */
// export function activateQuizRoom(
//   quizId: string,
//   roomId: string,
// ): Promise<ActivateQuizRoomResult> {
//   return new Promise((resolve, reject) => {
//     const normalizedQuizId = quizId.trim();
//     const normalizedRoomId = roomId.trim();

//     if (!normalizedQuizId) {
//       reject(new Error("A valid quiz ID is required."));
//       return;
//     }

//     if (!normalizedRoomId) {
//       reject(new Error("A valid room ID is required."));
//       return;
//     }

//     const socket = getQuizSocket();

//     let settled = false;
//     let timeoutId: ReturnType<typeof setTimeout> | null = null;

//     function cleanup() {
//       socket.off(
//         "room_activation_ack",
//         handleActivationAck,
//       );

//       socket.off(
//         "room_activated",
//         handleRoomActivated,
//       );

//       socket.off(
//         "connect_error",
//         handleConnectError,
//       );

//       socket.off(
//         "disconnect",
//         handleDisconnect,
//       );

//       socket.off(
//         "connect",
//         emitActivation,
//       );

//       if (timeoutId) {
//         clearTimeout(timeoutId);
//         timeoutId = null;
//       }
//     }

//     function finishSuccess() {
//       if (settled) {
//         return;
//       }

//       settled = true;

//       cleanup();

//       console.log(
//         "[Quiz Activation] Room activated successfully:",
//         {
//           quizId: normalizedQuizId,
//           roomId: normalizedRoomId,
//         },
//       );

//       resolve({
//         quizId: normalizedQuizId,
//         roomId: normalizedRoomId,
//       });
//     }

//     function finishError(message: string) {
//       if (settled) {
//         return;
//       }

//       settled = true;

//       cleanup();

//       console.error(
//         "[Quiz Activation] Activation failed:",
//         message,
//       );

//       reject(new Error(message));
//     }

//     /**
//      * Handles:
//      *
//      * room_activation_ack
//      *
//      * Example:
//      *
//      * {
//      *   success: true,
//      *   quizId: "...",
//      *   roomId: "..."
//      * }
//      */
//     function handleActivationAck(payload: unknown) {
//       if (settled) {
//         return;
//       }

//       console.log(
//         "[Quiz Activation] room_activation_ack received:",
//         payload,
//       );

//       if (
//         !isMatchingRoom(
//           payload,
//           normalizedQuizId,
//           normalizedRoomId,
//         )
//       ) {
//         console.warn(
//           "[Quiz Activation] Ignoring acknowledgement for another room.",
//         );

//         return;
//       }

//       const layers = getPayloadLayers(payload);

//       const success = getBoolean(layers, [
//         "success",
//         "ok",
//         "activated",
//       ]);

//       /*
//        * Explicit failure from the backend.
//        */
//       if (success === false) {
//         finishError(
//           getActivationMessage(payload),
//         );

//         return;
//       }

//       /*
//        * Successful acknowledgement.
//        *
//        * IMPORTANT:
//        *
//        * The previous implementation only set
//        * acknowledgementReceived = true and then
//        * waited for another event.
//        *
//        * That caused the 15-second timeout when the
//        * backend did not emit room_activated.
//        *
//        * A successful activation acknowledgement is
//        * enough for this client to continue.
//        */
//       if (success === true) {
//         finishSuccess();

//         return;
//       }

//       /*
//        * Some backends may send the room identifiers
//        * without an explicit success boolean.
//        *
//        * If the acknowledgement is clearly associated
//        * with our room, allow it to complete.
//        */
//       const responseQuizId = getString(layers, [
//         "quizId",
//         "quiz_id",
//         "quizID",
//       ]);

//       const responseRoomId = getString(layers, [
//         "roomId",
//         "room_id",
//         "roomID",
//       ]);

//       if (
//         responseQuizId === normalizedQuizId &&
//         responseRoomId === normalizedRoomId
//       ) {
//         finishSuccess();
//       }
//     }

//     /**
//      * Handles the authoritative room_activated event
//      * when the backend emits it.
//      */
//     function handleRoomActivated(payload: unknown) {
//       if (settled) {
//         return;
//       }

//       console.log(
//         "[Quiz Activation] room_activated received:",
//         payload,
//       );

//       if (
//         !isMatchingRoom(
//           payload,
//           normalizedQuizId,
//           normalizedRoomId,
//         )
//       ) {
//         console.warn(
//           "[Quiz Activation] Ignoring room_activated event for another room.",
//         );

//         return;
//       }

//       /*
//        * Explicit failure should still be respected.
//        */
//       const layers = getPayloadLayers(payload);

//       const success = getBoolean(layers, [
//         "success",
//         "ok",
//         "activated",
//       ]);

//       if (success === false) {
//         finishError(
//           getActivationMessage(payload),
//         );

//         return;
//       }

//       finishSuccess();
//     }

//     function handleConnectError(error: unknown) {
//       if (settled) {
//         return;
//       }

//       console.error(
//         "[Quiz Activation] Socket connection error:",
//         error,
//       );

//       const message =
//         error &&
//         typeof error === "object" &&
//         "message" in error &&
//         typeof (
//           error as { message?: unknown }
//         ).message === "string"
//           ? String(
//               (
//                 error as {
//                   message: string;
//                 }
//               ).message,
//             )
//           : "Unable to connect to the quiz server.";

//       finishError(message);
//     }

//     function handleDisconnect(reason: string) {
//       if (settled) {
//         return;
//       }

//       console.error(
//         "[Quiz Activation] Socket disconnected:",
//         reason,
//       );

//       finishError(
//         `Quiz server disconnected${
//           reason ? `: ${reason}` : "."
//         }`,
//       );
//     }

//     /**
//      * Socket.IO acknowledgement callback.
//      *
//      * This supports servers that do:
//      *
//      * socket.emit(
//      *   "activate_room",
//      *   payload,
//      *   (response) => {
//      *     ...
//      *   }
//      * )
//      */
//     function handleSocketAck(
//       response: unknown,
//     ) {
//       if (settled) {
//         return;
//       }

//       console.log(
//         "[Quiz Activation] Socket acknowledgement received:",
//         response,
//       );

//       /*
//        * Some servers use no response object at all
//        * and simply invoke the callback.
//        *
//        * In that case, successful callback execution
//        * means the request was accepted.
//        */
//       if (
//         response === undefined ||
//         response === null
//       ) {
//         finishSuccess();
//         return;
//       }

//       if (
//         !isMatchingRoom(
//           response,
//           normalizedQuizId,
//           normalizedRoomId,
//         )
//       ) {
//         return;
//       }

//       const layers = getPayloadLayers(response);

//       const success = getBoolean(layers, [
//         "success",
//         "ok",
//         "activated",
//       ]);

//       if (success === false) {
//         finishError(
//           getActivationMessage(response),
//         );

//         return;
//       }

//       if (success === true) {
//         finishSuccess();
//         return;
//       }

//       /*
//        * If the response contains matching room
//        * identifiers but no success flag, treat the
//        * Socket.IO acknowledgement as successful.
//        */
//       finishSuccess();
//     }

//     /**
//      * Emit activation request.
//      */
//     function emitActivation() {
//       if (settled) {
//         return;
//       }

//       console.log(
//         "[Quiz Activation] Emitting activate_room:",
//         {
//           quizId: normalizedQuizId,
//           roomId: normalizedRoomId,
//         },
//       );

//       socket.emit(
//   "activate_room",
//   {
//     roomId: normalizedRoomId,
//     quizId: normalizedQuizId,
//     role: "ADMIN",
//   },
//   handleSocketAck,
// );
//     }

//     /*
//      * Register listeners BEFORE emitting.
//      */
//     socket.on(
//       "room_activation_ack",
//       handleActivationAck,
//     );

//     socket.on(
//       "room_activated",
//       handleRoomActivated,
//     );

//     socket.on(
//       "connect_error",
//       handleConnectError,
//     );

//     socket.on(
//       "disconnect",
//       handleDisconnect,
//     );

//     /*
//      * Socket already connected.
//      */
//     if (socket.connected) {
//       emitActivation();
//     } else {
//       /*
//        * Wait for the shared socket to connect.
//        */
//       socket.once(
//         "connect",
//         emitActivation,
//       );

//       socket.connect();
//     }

//     /*
//      * Safety timeout.
//      *
//      * This should now only happen if the backend
//      * genuinely does not acknowledge the request.
//      */
//     timeoutId = setTimeout(() => {
//       if (settled) {
//         return;
//       }

//       finishError(
//         "Timed out waiting for room activation. The quiz server did not acknowledge the activation request.",
//       );
//     }, 15_000);
//   });
// }