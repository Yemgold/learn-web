






"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, GraduationCap } from "lucide-react";

import EduLudoGame from "@/games/edu-ludo/EduLudoGame";

export default function EduLudoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page introduction */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <GraduationCap size={25} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-black text-slate-900 sm:text-xl">
              Educational Ludo
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              Learn, answer questions, and play your way HOME.
            </p>
          </div>

          <div className="ml-auto hidden items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700 sm:flex">
            <BookOpen size={15} />
            Learn while playing
          </div>
        </div>
      </div>

      {/* Main game */}
      <EduLudoGame
        onBack={() => router.back()}
        onFundWallet={() => {
          router.push("/student/wallet");
        }}
      />
    </div>
  );
}
