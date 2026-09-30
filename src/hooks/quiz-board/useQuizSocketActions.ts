// C:\Users\Lara Spellman\Jamb\jamb-league\src\hooks\quiz-board\useQuizSocketActions.ts

"use client";

import {
  useCallback,
} from "react";

import {
  getQuizSocket,
} from "@/lib/socket/quizSocket";

import type {
  QuizSocketActionContext,
} from "./quizSocketTypes";

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

  /**
   * START QUESTION
   */
  const startQuestion = useCallback(() => {
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
      currentRoundRef.current;

    const selectedQuestion =
      getSelectedQuestionPayload(
        context,
      );

    const timeLimit =
      timeLimitRef.current;

    const payload = {
      quizId,
      quiz_id: quizId,

      roomId,
      room_id: roomId,

      roundNumber,
      round_number: roundNumber,

      timeLimit,
      time_limit: timeLimit,

      ...(selectedQuestion
        ? {
            question:
              selectedQuestion,
          }
        : {}),
    };

    console.log(
      "[Quiz Socket] START QUESTION:",
      payload,
    );

    socket.emit(
      "start_question",
      payload,
    );

    setQuestionStarted(true);
    setQuestionLocked(false);
    setAnswerSubmitted(false);
    setSelectedAnswer(null);

    window.setTimeout(() => {
      setActionLoading(false);
    }, 500);
  }, [
    context,
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
    timeLimitRef,
  ]);

  /**
   * LOCK QUESTION
   */
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
      currentRoundRef.current;

    const payload = {
      quizId,
      quiz_id: quizId,

      roomId,
      room_id: roomId,

      roundNumber,
      round_number: roundNumber,
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

  /**
   * NEXT QUESTION
   */
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
      currentRoundRef.current;

    const payload = {
      quizId,
      quiz_id: quizId,

      roomId,
      room_id: roomId,

      roundNumber,
      round_number: roundNumber,
    };

    console.log(
      "[Quiz Socket] NEXT QUESTION:",
      payload,
    );

    socket.emit(
      "next_question",
      payload,
    );

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

  /**
   * SUBMIT ANSWER
   *
   * IMPORTANT:
   * Do not check the client-side role here.
   *
   * The server must determine whether the
   * connected user is allowed to submit an answer.
   */
  const submitAnswer = useCallback(
    (answer: string) => {
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

      if (!answer) {
        setSocketError(
          "Please select an answer.",
        );

        return;
      }

      const activeQuestion =
        questionRef.current;

      if (
        activeQuestion &&
        !activeQuestion.id
      ) {
        setSocketError(
          "No active question is available.",
        );

        return;
      }

      setSubmittingAnswer(true);
      setSocketError(null);

      const questionId =
        activeQuestion?.id ?? null;

      const questionNumber =
        activeQuestion?.questionNumber ??
        null;

      const roundNumber =
        currentRoundRef.current;

      const payload = {
        quizId,
        quiz_id: quizId,

        roomId,
        room_id: roomId,

        questionId,
        question_id: questionId,

        questionNumber,
        question_number:
          questionNumber,

        roundNumber,
        round_number:
          roundNumber,

        answer,

        selectedAnswer:
          answer,

        selected_answer:
          answer,
      };

      console.log(
        "[Quiz Socket] SUBMIT ANSWER:",
        payload,
      );

      socket.emit(
        "submit_answer",
        payload,
      );

      setSelectedAnswer(answer);
      setAnswerSubmitted(true);

      window.setTimeout(() => {
        setSubmittingAnswer(false);
      }, 1000);
    },
    [
      currentRoundRef,
      getSocket,
      quizId,
      questionRef,
      roomId,
      setAnswerSubmitted,
      setSelectedAnswer,
      setSocketError,
      setSubmittingAnswer,
    ],
  );

  /**
   * REQUEST CURRENT ROOM STATE
   */
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
        currentRoundRef.current;

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

  return {
    startQuestion,
    lockQuestion,
    nextQuestion,
    submitAnswer,
    refreshSocketState,
  };
}