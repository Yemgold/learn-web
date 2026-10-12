





"use client";

import { Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import WhotGame from "@/games/whot/components/WhotGame";

function WhotQuestionPageContent() {
  const router = useRouter();

  const handleExit = useCallback(() => {
    router.push("/student/games");
  }, [router]);

  return (
    <WhotGame
      playerName="You"
      botName="Learnyfi Bot"
      autoStart
      botDelay={900}
      questionTimeLimit={15}
      onExit={handleExit}
    />
  );
}

export default function WhotQuestionPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
          <div className="flex flex-col items-center gap-3 text-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-cyan-300" />
            <p className="text-sm text-slate-400">
              Preparing your WHOT game...
            </p>
          </div>
        </main>
      }
    >
      <WhotQuestionPageContent />
    </Suspense>
  );
}
