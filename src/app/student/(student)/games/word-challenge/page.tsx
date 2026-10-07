




"use client";

import { ArrowLeft, Gamepad2 } from "lucide-react";
import Link from "next/link";

import {
  WordChallengeGame,
  wordChallengeQuestions,
} from "@/games/word-challenge";

export default function WordChallengePage() {
  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#070b14]/95">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/student/games"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Games</span>
          </Link>

          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-violet-300" />

            <span className="text-sm font-semibold">
              Word Challenge
            </span>
          </div>

          <div className="w-[72px]" />
        </div>
      </div>

      {/* Game */}
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <WordChallengeGame
          questions={wordChallengeQuestions}
        />
      </div>
    </main>
  );
}
