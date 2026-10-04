// C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\quiz-board\useQuizSocketActions.ts

"use client";

import { useCallback } from "react";

import { getQuizSocket } from "@/lib/socket/quizSocket";

import type {
  QuizSocketActionContext,
} from "./quizSocketTypes";

/* ============================================================
   HELPERS
   ============================================================ */

function getSelectedQuestionPayload(
  context: QuizSocketActionContext,
) {
  const selectedQuestion =
    context.selectedQuestionRef.current;

  if (!selectedQuestion) {
    return undefined;
  }

  return selectedQuestion;
}

/**
 * Backend round numbers are 1-based.
 *
 * currentRoundRef.current is the actual current round
 * value used by the client.
 *
 * We do not give 0 any special meaning.
 *
 * If the client value is below 1, send 1 to the backend.
 */
function getBackendRoundNumber(
  currentRound: number,
): number {
  return Math.max(
    1,
    Math.floor(
      Number(currentRound) || 1,
    ),
  );
}

/* ============================================================
   HOOK
   ============================================================ */

export function useQuizSocketActions(
  context: QuizSocketActionContext,
) {
  const {
    quizId,
    roomId,

    currentRoundRef,
    selectedQuestionRef,
    timeLimitRef,
    questionRef,

    setActionLoading,
    setSocketError,

    setQuestionStarted,
    setQuestionLocked,

    setSelectedAnswer,
    setAnswerSubmitted,
    setSubmittingAnswer,
  } = context;

  /* ==========================================================
     SHARED SOCKET
     ========================================================== */

  /**
   * Always retrieve the shared quiz socket
   * when an action is executed.
   *
   * We intentionally do NOT retrieve the socket
   * during render.
   */
  const getSocket = useCallback(
    () => getQuizSocket(),
    [],
  );

  /* ==========================================================
     DISPLAY / START QUESTION
     ==========================================================

     IMPORTANT

     The existing HostQuizGameSocket architecture uses:

       display_next_question

     NOT:

       start_question

     Existing flow:

       start_questions
            ↓
       getting_room_questions_ack
            ↓
       host has complete questions
            ↓
       host selects question
            ↓
       display_next_question
            ↓
       backend broadcasts
       new_question_displayed
            ↓
       contestants receive question

     The selected question is already available on the
     host page, so we send that question to the backend.

     The backend remains responsible for:

       - validating the host
       - recording active question state
       - generating startTime
       - broadcasting new_question_displayed
       - authoritative answer validation
       - scoring
       - first-correct handling
       - timer enforcement
   ========================================================== */

  const startQuestion = useCallback(() => {
    const socket = getSocket();

    /* --------------------------------------------------------
       SOCKET CHECK
       -------------------------------------------------------- */

    if (!socket.connected) {
      setSocketError(
        "Socket is not connected.",
      );

      return;
    }

    /* --------------------------------------------------------
       ROOM CHECK
       -------------------------------------------------------- */

    if (!quizId || !roomId) {
      setSocketError(
        "Missing quiz or room information.",
      );

      return;
    }

    /* --------------------------------------------------------
       SELECTED QUESTION
       -------------------------------------------------------- */

    const selectedQuestion =
      getSelectedQuestionPayload(
        context,
      );

    if (!selectedQuestion) {
      setSocketError(
        "No question has been selected.",
      );

      console.warn(
        "[Quiz Socket] DISPLAY NEXT QUESTION aborted:",
        "No selected question.",
      );

      return;
    }

    /* --------------------------------------------------------
       ROUND
       -------------------------------------------------------- */

    const roundNumber =
      getBackendRoundNumber(
        currentRoundRef.current,
      );

    /* --------------------------------------------------------
       TIME LIMIT
       --------------------------------------------------------

       timeLimit remains available to the client for local
       timer/UI purposes.

       The backend remains authoritative for the actual timer.

       We intentionally do not add timeLimit to the
       display_next_question payload because the established
       HostQuizGameSocket contract is:

         {
           quizId,
           roomId,
           question
         }

       The backend generates startTime.
       -------------------------------------------------------- */

    const timeLimit =
      timeLimitRef.current;

    /* --------------------------------------------------------
       DISPLAY NEXT QUESTION PAYLOAD
       --------------------------------------------------------

       This matches HostQuizGameSocket.displayNextQuestion():

         {
           quizId,
           roomId,
           question
         }

       selectedQuestion should already be the host-side
       question object.

       The backend remains authoritative about what contestants
       receive.
       -------------------------------------------------------- */

    const payload = {
      quizId,
      roomId,
      question: selectedQuestion,
    };

    /* --------------------------------------------------------
       LOG
       -------------------------------------------------------- */

    console.log(
      "[Quiz Socket] DISPLAY NEXT QUESTION:",
      {
        quizId,
        roomId,
        roundNumber,
        timeLimit,

        questionId:
          selectedQuestion.id,

        questionNumber:
          selectedQuestion.questionNumber,
      },
    );

    console.log(
      "[Quiz Socket] DISPLAY NEXT QUESTION PAYLOAD:",
      payload,
    );

    /* --------------------------------------------------------
       SEND TO BACKEND
       -------------------------------------------------------- */

    socket.emit(
      "display_next_question",
      payload,
    );

    /* --------------------------------------------------------
       UPDATE HOST UI
       -------------------------------------------------------- */

    setQuestionStarted(true);
    setQuestionLocked(false);

    setAnswerSubmitted(false);
    setSelectedAnswer(null);

    setSocketError(null);
    setActionLoading(true);

    /* --------------------------------------------------------
       ACTION LOADING
       -------------------------------------------------------- */

    window.setTimeout(() => {
      setActionLoading(false);
    }, 500);

  }, [
    context,
    currentRoundRef,
    getSocket,
    quizId,
    roomId,
    selectedQuestionRef,
    timeLimitRef,

    setActionLoading,
    setAnswerSubmitted,
    setQuestionLocked,
    setQuestionStarted,
    setSelectedAnswer,
    setSocketError,
  ]);

  /* ==========================================================
     LOCK QUESTION
     ========================================================== */

  const lockQuestion = useCallback(() => {
    const socket = getSocket();

    if (!socket.connected) {
      setSocketError(
        "Socket is not connected.",
      );

      return;
    }

    if (!quizId || !roomId) {
      setSocketError(
        "Missing quiz or room information.",
      );

      return;
    }

    setActionLoading(true);
    setSocketError(null);

    const roundNumber =
      getBackendRoundNumber(
        currentRoundRef.current,
      );

    const payload = {
      quizId,
      quiz_id: quizId,

      roomId,
      room_id: roomId,

      roundNumber,
      round_number:
        roundNumber,
    };

    console.log(
      "[Quiz Socket] LOCK QUESTION:",
      payload,
    );

    socket.emit(
      "lock_question",
      payload,
    );

    setQuestionLocked(true);

    window.setTimeout(() => {
      setActionLoading(false);
    }, 500);

  }, [
    currentRoundRef,
    getSocket,
    quizId,
    roomId,

    setActionLoading,
    setQuestionLocked,
    setSocketError,
  ]);

  /* ==========================================================
     NEXT QUESTION
     ========================================================== */

  const nextQuestion = useCallback(() => {
    const socket = getSocket();

    if (!socket.connected) {
      setSocketError(
        "Socket is not connected.",
      );

      return;
    }

    if (!quizId || !roomId) {
      setSocketError(
        "Missing quiz or room information.",
      );

      return;
    }

    setActionLoading(true);
    setSocketError(null);

    const roundNumber =
      getBackendRoundNumber(
        currentRoundRef.current,
      );

    const payload = {
      quizId,
      quiz_id: quizId,

      roomId,
      room_id: roomId,

      roundNumber,
      round_number:
        roundNumber,
    };

    console.log(
      "[Quiz Socket] NEXT QUESTION:",
      payload,
    );

    socket.emit(
      "next_question",
      payload,
    );

    /*
     * Clear the current local question state.
     *
     * The next question will be established when the backend
     * sends the corresponding question event.
     */
    setQuestionStarted(false);
    setQuestionLocked(false);

    setAnswerSubmitted(false);
    setSelectedAnswer(null);

    window.setTimeout(() => {
      setActionLoading(false);
    }, 500);

  }, [
    currentRoundRef,
    getSocket,
    quizId,
    roomId,

    setActionLoading,
    setAnswerSubmitted,
    setQuestionLocked,
    setQuestionStarted,
    setSelectedAnswer,
    setSocketError,
  ]);

  /* ==========================================================
     SUBMIT ANSWER
     ==========================================================

     IMPORTANT BACKEND CONTRACT

     The backend expects the Socket.IO argument to be:

       {
         data: {
           roomId,
           roundNumber,
           questionId,
           selectedAnswerId
         }
       }

     Example:

       socket.emit("submit_answer", {
         data: {
           roomId:
             "QUIZ_ROOM_6aabdeb6c2ec85fde18e4185_1790182547850",

           roundNumber: 1,

           questionId:
             "6aa00de4b180c475fe319822",

           selectedAnswerId:
             "6aa00de4b180c475fe319741"
         }
       });

     IMPORTANT:

     Do NOT send:

       quizId
       quiz_id
       room_id
       question_id
       questionNumber
       question_number
       answer
       selectedAnswer
       selected_answer

     The backend wants selectedAnswerId, which is the
     option _id/value selected by the contestant.

     The frontend does NOT determine whether the answer is
     correct.

     The server remains authoritative.
   ========================================================== */

  const submitAnswer = useCallback(
    (answer: string) => {
      const socket = getSocket();

      /* ------------------------------------------------------
         SOCKET CHECK
         ------------------------------------------------------ */

      if (!socket.connected) {
        setSocketError(
          "Socket is not connected.",
        );

        return;
      }

      /* ------------------------------------------------------
         ROOM CHECK
         ------------------------------------------------------ */

      if (!roomId) {
        setSocketError(
          "Missing room information.",
        );

        console.error(
          "[Quiz Socket] SUBMIT ANSWER aborted: Missing roomId.",
        );

        return;
      }

      /* ------------------------------------------------------
         ANSWER CHECK
         ------------------------------------------------------ */

      if (!answer) {
        setSocketError(
          "Please select an answer.",
        );

        return;
      }

      /* ------------------------------------------------------
         ACTIVE QUESTION
         ------------------------------------------------------ */

      const activeQuestion =
        questionRef.current;

      if (
        !activeQuestion ||
        !activeQuestion.id
      ) {
        setSocketError(
          "No active question is available.",
        );

        console.error(
          "[Quiz Socket] SUBMIT ANSWER aborted: No active question.",
        );

        return;
      }

      /* ------------------------------------------------------
         ROUND
         ------------------------------------------------------ */

      const roundNumber =
        getBackendRoundNumber(
          currentRoundRef.current,
        );

      /* ------------------------------------------------------
         QUESTION
         ------------------------------------------------------ */

      const questionId =
        activeQuestion.id;

      /* ------------------------------------------------------
         SUBMIT STATE
         ------------------------------------------------------ */

      setSubmittingAnswer(true);
      setSocketError(null);

      /* ------------------------------------------------------
         BACKEND PAYLOAD
         ------------------------------------------------------

         THIS IS THE IMPORTANT CONTRACT.

         The server expects:

           {
             data: {
               roomId,
               roundNumber,
               questionId,
               selectedAnswerId
             }
           }

         Nothing else is included.
         ------------------------------------------------------ */

      const payload = {
        data: {
          roomId,
          roundNumber,
          questionId,
          selectedAnswerId: answer,
        },
      };

      /* ------------------------------------------------------
         DEBUG LOG
         ------------------------------------------------------ */

      console.log(
        "[Quiz Socket] SUBMIT ANSWER:",
        payload,
      );

      console.log(
        "[Quiz Socket] SUBMIT ANSWER PAYLOAD JSON:",
        JSON.stringify(
          payload,
          null,
          2,
        ),
      );

      /* ------------------------------------------------------
         SEND ANSWER
         ------------------------------------------------------ */

      socket.emit(
        "submit_answer",
        payload,
      );

      /* ------------------------------------------------------
         LOCAL UI STATE ONLY
         ------------------------------------------------------

         This does NOT mean the answer is correct.

         The backend will determine:

           - correct / incorrect
           - score
           - first correct
           - elimination
           - leaderboard
           - answer lock
         ------------------------------------------------------ */

      setSelectedAnswer(answer);
      setAnswerSubmitted(true);

      /* ------------------------------------------------------
         CLEAR SUBMITTING STATE
         ------------------------------------------------------ */

      window.setTimeout(() => {
        setSubmittingAnswer(false);
      }, 1000);

    },
    [
      currentRoundRef,
      getSocket,
      questionRef,
      roomId,

      setAnswerSubmitted,
      setSelectedAnswer,
      setSocketError,
      setSubmittingAnswer,
    ],
  );

  /* ==========================================================
     REQUEST CURRENT ROOM STATE
     ==========================================================

     Primarily useful for the host.

     Contestants should receive the active question through
     the server's question event:

       new_question_displayed

     rather than depending on get_room_doc for the question.
   ========================================================== */

  const refreshSocketState =
    useCallback(() => {
      const socket = getSocket();

      if (!socket.connected) {
        setSocketError(
          "Socket is not connected.",
        );

        return;
      }

      if (!quizId || !roomId) {
        setSocketError(
          "Missing quiz or room information.",
        );

        return;
      }

      const roundNumber =
        getBackendRoundNumber(
          currentRoundRef.current,
        );

      const payload = {
        quizId,
        quiz_id: quizId,

        roomId,
        room_id: roomId,

        roundNumber,
        round_number:
          roundNumber,
      };

      console.log(
        "[Quiz Socket] REQUEST ROOM DOC:",
        payload,
      );

      socket.emit(
        "get_room_doc",
        payload,
      );

    }, [
      currentRoundRef,
      getSocket,
      quizId,
      roomId,
      setSocketError,
    ]);

  /* ==========================================================
     RETURN ACTIONS
     ========================================================== */

  return {
    startQuestion,
    lockQuestion,
    nextQuestion,
    submitAnswer,
    refreshSocketState,
  };
}
















// // C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\quiz-board\useQuizSocketActions.ts

// "use client";

// import { useCallback } from "react";

// import { getQuizSocket } from "@/lib/socket/quizSocket";

// import type {
//   QuizSocketActionContext,
// } from "./quizSocketTypes";

// /* ============================================================
//    HELPERS
//    ============================================================ */

// function getSelectedQuestionPayload(
//   context: QuizSocketActionContext,
// ) {
//   const selectedQuestion =
//     context.selectedQuestionRef.current;

//   if (!selectedQuestion) {
//     return undefined;
//   }

//   return selectedQuestion;
// }

// /**
//  * Backend round numbers are 1-based.
//  *
//  * currentRoundRef.current is the actual current round
//  * value used by the client.
//  *
//  * We do not give 0 any special meaning.
//  *
//  * If the client value is below 1, send 1 to the backend.
//  */
// function getBackendRoundNumber(
//   currentRound: number,
// ): number {
//   return Math.max(
//     1,
//     Math.floor(
//       Number(currentRound) || 1,
//     ),
//   );
// }


// /* ============================================================
//    HOOK
//    ============================================================ */

// export function useQuizSocketActions(
//   context: QuizSocketActionContext,
// ) {
//   const {
//     quizId,
//     roomId,

//     currentRoundRef,
//     selectedQuestionRef,
//     timeLimitRef,
//     questionRef,

//     setActionLoading,
//     setSocketError,

//     setQuestionStarted,
//     setQuestionLocked,

//     setSelectedAnswer,
//     setAnswerSubmitted,
//     setSubmittingAnswer,
//   } = context;


//   /* ==========================================================
//      SHARED SOCKET
//      ========================================================== */

//   /**
//    * Always retrieve the shared quiz socket
//    * when an action is executed.
//    *
//    * We intentionally do NOT retrieve the socket
//    * during render.
//    */
//   const getSocket = useCallback(
//     () => getQuizSocket(),
//     [],
//   );


//   /* ==========================================================
//      DISPLAY / START QUESTION
//      ==========================================================

//      IMPORTANT

//      The existing HostQuizGameSocket architecture uses:

//        display_next_question

//      NOT:

//        start_question

//      Existing flow:

//        start_questions
//             ↓
//        getting_room_questions_ack
//             ↓
//        host has complete questions
//             ↓
//        host selects question
//             ↓
//        display_next_question
//             ↓
//        backend broadcasts
//        new_question_displayed
//             ↓
//        contestants receive question

//      The selected question is already available on the
//      host page, so we send that question to the backend.

//      The backend remains responsible for:

//        - validating the host
//        - recording active question state
//        - generating startTime
//        - broadcasting new_question_displayed
//        - authoritative answer validation
//        - scoring
//        - first-correct handling
//        - timer enforcement
//    ========================================================== */

//   const startQuestion = useCallback(() => {
//     const socket = getSocket();


//     /* --------------------------------------------------------
//        SOCKET CHECK
//        -------------------------------------------------------- */

//     if (!socket.connected) {
//       setSocketError(
//         "Socket is not connected.",
//       );

//       return;
//     }


//     /* --------------------------------------------------------
//        ROOM CHECK
//        -------------------------------------------------------- */

//     if (!quizId || !roomId) {
//       setSocketError(
//         "Missing quiz or room information.",
//       );

//       return;
//     }


//     /* --------------------------------------------------------
//        SELECTED QUESTION
//        -------------------------------------------------------- */

//     const selectedQuestion =
//       getSelectedQuestionPayload(
//         context,
//       );

//     if (!selectedQuestion) {
//       setSocketError(
//         "No question has been selected.",
//       );

//       console.warn(
//         "[Quiz Socket] DISPLAY NEXT QUESTION aborted:",
//         "No selected question.",
//       );

//       return;
//     }


//     /* --------------------------------------------------------
//        ROUND
//        -------------------------------------------------------- */

//     const roundNumber =
//       getBackendRoundNumber(
//         currentRoundRef.current,
//       );


//     /* --------------------------------------------------------
//        TIME LIMIT
//        --------------------------------------------------------

//        timeLimit remains available to the client for local
//        timer/UI purposes.

//        The backend remains authoritative for the actual timer.

//        We intentionally do not add timeLimit to the
//        display_next_question payload because the established
//        HostQuizGameSocket contract is:

//          {
//            quizId,
//            roomId,
//            question
//          }

//        The backend generates startTime.
//        -------------------------------------------------------- */

//     const timeLimit =
//       timeLimitRef.current;


//     /* --------------------------------------------------------
//        DISPLAY NEXT QUESTION PAYLOAD
//        --------------------------------------------------------

//        This matches HostQuizGameSocket.displayNextQuestion():

//          {
//            quizId,
//            roomId,
//            question
//          }

//        selectedQuestion should already be the host-side
//        question object.

//        The existing HostQuizGameSocket contains the
//        sanitizeQuestionForRoom() logic for stripping answer
//        information.

//        If selectedQuestion is already a public question,
//        it can be sent directly.

//        If it is a HostQuizQuestion, the backend should still
//        remain authoritative about what contestants receive.
//        -------------------------------------------------------- */

//     const payload = {
//       quizId,
//       roomId,
//       question: selectedQuestion,
//     };


//     /* --------------------------------------------------------
//        LOG
//        -------------------------------------------------------- */

//     console.log(
//       "[Quiz Socket] DISPLAY NEXT QUESTION:",
//       {
//         quizId,
//         roomId,
//         roundNumber,
//         timeLimit,

//         questionId:
//           selectedQuestion.id,

//         questionNumber:
//           selectedQuestion.questionNumber,
//       },
//     );

//     console.log(
//       "[Quiz Socket] DISPLAY NEXT QUESTION PAYLOAD:",
//       payload,
//     );


//     /* --------------------------------------------------------
//        SEND TO BACKEND
//        --------------------------------------------------------

//        IMPORTANT:

//        This is the established event from
//        HostQuizGameSocket.

//        Do NOT use:

//          start_question

//        -------------------------------------------------------- */

//     socket.emit(
//       "display_next_question",
//       payload,
//     );


//     /* --------------------------------------------------------
//        UPDATE HOST UI
//        --------------------------------------------------------

//        The host already knows which question was selected.

//        Therefore the host UI can immediately enter the
//        question-started state.

//        The authoritative server event will still arrive as:

//          new_question_displayed

//        and should be handled by useQuizSocket.
//        -------------------------------------------------------- */

//     setQuestionStarted(true);
//     setQuestionLocked(false);

//     setAnswerSubmitted(false);
//     setSelectedAnswer(null);

//     setSocketError(null);
//     setActionLoading(true);


//     /* --------------------------------------------------------
//        ACTION LOADING
//        -------------------------------------------------------- */

//     window.setTimeout(() => {
//       setActionLoading(false);
//     }, 500);

//   }, [
//     context,

//     currentRoundRef,
//     getSocket,
//     quizId,
//     roomId,
//     selectedQuestionRef,
//     timeLimitRef,

//     setActionLoading,
//     setAnswerSubmitted,
//     setQuestionLocked,
//     setQuestionStarted,
//     setSelectedAnswer,
//     setSocketError,
//   ]);


//   /* ==========================================================
//      LOCK QUESTION
//      ========================================================== */

//   const lockQuestion = useCallback(() => {
//     const socket = getSocket();


//     if (!socket.connected) {
//       setSocketError(
//         "Socket is not connected.",
//       );

//       return;
//     }


//     if (!quizId || !roomId) {
//       setSocketError(
//         "Missing quiz or room information.",
//       );

//       return;
//     }


//     setActionLoading(true);
//     setSocketError(null);


//     const roundNumber =
//       getBackendRoundNumber(
//         currentRoundRef.current,
//       );


//     const payload = {
//       quizId,
//       quiz_id: quizId,

//       roomId,
//       room_id: roomId,

//       roundNumber,
//       round_number:
//         roundNumber,
//     };


//     console.log(
//       "[Quiz Socket] LOCK QUESTION:",
//       payload,
//     );


//     socket.emit(
//       "lock_question",
//       payload,
//     );


//     setQuestionLocked(true);


//     window.setTimeout(() => {
//       setActionLoading(false);
//     }, 500);

//   }, [
//     currentRoundRef,
//     getSocket,
//     quizId,
//     roomId,

//     setActionLoading,
//     setQuestionLocked,
//     setSocketError,
//   ]);


//   /* ==========================================================
//      NEXT QUESTION
//      ========================================================== */

//   const nextQuestion = useCallback(() => {
//     const socket = getSocket();


//     if (!socket.connected) {
//       setSocketError(
//         "Socket is not connected.",
//       );

//       return;
//     }


//     if (!quizId || !roomId) {
//       setSocketError(
//         "Missing quiz or room information.",
//       );

//       return;
//     }


//     setActionLoading(true);
//     setSocketError(null);


//     const roundNumber =
//       getBackendRoundNumber(
//         currentRoundRef.current,
//       );


//     const payload = {
//       quizId,
//       quiz_id: quizId,

//       roomId,
//       room_id: roomId,

//       roundNumber,
//       round_number:
//         roundNumber,
//     };


//     console.log(
//       "[Quiz Socket] NEXT QUESTION:",
//       payload,
//     );


//     socket.emit(
//       "next_question",
//       payload,
//     );


//     /*
//      * Clear the current local question state.
//      *
//      * The next question will be established when the backend
//      * sends the corresponding question event.
//      */
//     setQuestionStarted(false);
//     setQuestionLocked(false);

//     setAnswerSubmitted(false);
//     setSelectedAnswer(null);


//     window.setTimeout(() => {
//       setActionLoading(false);
//     }, 500);

//   }, [
//     currentRoundRef,
//     getSocket,
//     quizId,
//     roomId,

//     setActionLoading,
//     setAnswerSubmitted,
//     setQuestionLocked,
//     setQuestionStarted,
//     setSelectedAnswer,
//     setSocketError,
//   ]);


//   /* ==========================================================
//      SUBMIT ANSWER
//      ==========================================================

//      IMPORTANT

//      The frontend does NOT determine whether the answer is
//      correct.

//      The server remains authoritative.
//    ========================================================== */

//   const submitAnswer = useCallback(
//     (answer: string) => {
//       const socket = getSocket();


//       if (!socket.connected) {
//         setSocketError(
//           "Socket is not connected.",
//         );

//         return;
//       }


//       if (!quizId || !roomId) {
//         setSocketError(
//           "Missing quiz or room information.",
//         );

//         return;
//       }


//       if (!answer) {
//         setSocketError(
//           "Please select an answer.",
//         );

//         return;
//       }


//       const activeQuestion =
//         questionRef.current;


//       if (
//         !activeQuestion ||
//         !activeQuestion.id
//       ) {
//         setSocketError(
//           "No active question is available.",
//         );

//         return;
//       }


//       setSubmittingAnswer(true);
//       setSocketError(null);


//       const questionId =
//         activeQuestion.id;


//       const questionNumber =
//         activeQuestion.questionNumber ??
//         null;


//       const roundNumber =
//         getBackendRoundNumber(
//           currentRoundRef.current,
//         );


// const payload = {
//   data: {
//     roomId,
//     roundNumber,
//     questionId,
//     selectedAnswerId: answer,
//   },
// };

// console.log(
//   "[Quiz Socket] SUBMIT ANSWER:",
//   payload,
// );

// socket.emit(
//   "submit_answer",
//   payload,
// );


//       /*
//        * Local UI state only.
//        *
//        * Correctness is determined by the backend.
//        */
//       setSelectedAnswer(answer);
//       setAnswerSubmitted(true);


//       window.setTimeout(() => {
//         setSubmittingAnswer(false);
//       }, 1000);

//     },
//     [
//       currentRoundRef,
//       getSocket,
//       quizId,
//       questionRef,
//       roomId,

//       setAnswerSubmitted,
//       setSelectedAnswer,
//       setSocketError,
//       setSubmittingAnswer,
//     ],
//   );


//   /* ==========================================================
//      REQUEST CURRENT ROOM STATE
//      ==========================================================

//      Primarily useful for the host.

//      Contestants should receive the active question through
//      the server's question event:

//        new_question_displayed

//      rather than depending on get_room_doc for the question.
//    ========================================================== */

//   const refreshSocketState =
//     useCallback(() => {
//       const socket = getSocket();


//       if (!socket.connected) {
//         setSocketError(
//           "Socket is not connected.",
//         );

//         return;
//       }


//       if (!quizId || !roomId) {
//         setSocketError(
//           "Missing quiz or room information.",
//         );

//         return;
//       }


//       const roundNumber =
//         getBackendRoundNumber(
//           currentRoundRef.current,
//         );


//       const payload = {
//         quizId,
//         quiz_id: quizId,

//         roomId,
//         room_id: roomId,

//         roundNumber,
//         round_number:
//           roundNumber,
//       };


//       console.log(
//         "[Quiz Socket] REQUEST ROOM DOC:",
//         payload,
//       );


//       socket.emit(
//         "get_room_doc",
//         payload,
//       );

//     }, [
//       currentRoundRef,
//       getSocket,
//       quizId,
//       roomId,
//       setSocketError,
//     ]);


//   /* ==========================================================
//      RETURN ACTIONS
//      ========================================================== */

//   return {
//     startQuestion,
//     lockQuestion,
//     nextQuestion,
//     submitAnswer,
//     refreshSocketState,
//   };
// }
