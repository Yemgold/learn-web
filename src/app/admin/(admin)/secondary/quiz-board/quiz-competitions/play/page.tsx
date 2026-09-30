"use client";

import { useSearchParams } from "next/navigation";

import QuizPlayPage from "@/components/quiz-board/play/QuizPlayController";

export default function Page() {
  const searchParams = useSearchParams();

  const quizId = searchParams.get("quizId");
  const roomId = searchParams.get("roomId");
  const role = searchParams.get("role");

  if (!quizId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-red-500">
          Missing quizId.
        </p>
      </div>
    );
  }

  return (
    <QuizPlayPage
      quizId={quizId}
      requestedRole={role}
      requestedRoomId={roomId}
    />
  );
}