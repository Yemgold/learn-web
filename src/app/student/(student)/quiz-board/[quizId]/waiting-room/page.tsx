"use client";

import { useParams, useSearchParams } from "next/navigation";

import WaitingRoom from "@/components/quiz-board/waiting-room/WaitingRoom";

export default function WaitingRoomPage() {
  const params = useParams<{
    quizId: string;
  }>();

  const searchParams = useSearchParams();

  const quizId =
    typeof params?.quizId === "string"
      ? params.quizId
      : "";

  const contestantId =
    searchParams.get("contestantId")?.trim() || null;

  return (
    <WaitingRoom
      quizId={quizId}
      contestantId={contestantId}
    />
  );
}





