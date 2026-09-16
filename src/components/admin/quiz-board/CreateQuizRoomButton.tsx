
"use client";

import { DoorOpen, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  quizId: string;
  joinedCount: number;
  contestantCount: number;
  onCreateRoom?: (quizId: string) => void;
  loading?: boolean;
};

export default function CreateQuizRoomButton({
  quizId,
  joinedCount,
  contestantCount,
  onCreateRoom,
  loading = false,
}: Props) {
  const isFull =
    contestantCount > 0 &&
    joinedCount >= contestantCount;

  const handleClick = () => {
    if (!isFull || loading || !onCreateRoom) {
      return;
    }

    onCreateRoom(quizId);
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleClick}
        disabled={!isFull || loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Room...
          </>
        ) : isFull ? (
          <>
            <DoorOpen className="mr-2 h-4 w-4" />
            Create Quiz Room
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            {joinedCount} / {contestantCount} Joined
          </>
        )}
      </Button>

      <p className="text-center text-xs text-gray-500">
        {isFull
          ? "All contestants have joined. You can create the quiz room."
          : `The quiz room will be available when all ${contestantCount} contestants have joined.`}
      </p>
    </div>
  );
}
