




"use client";

import { useParams } from "next/navigation";

import QuizPlayController from "@/components/quiz-board/play/QuizPlayController";

export default function QuizWatchPage() {
  const params =
    useParams<{
      quizId: string;
    }>();

  const quizId =
    String(
      params.quizId ?? "",
    ).trim();

  return (
    <QuizPlayController
      quizId={quizId}
      requestedRole="SPECTATOR"
    />
  );
}