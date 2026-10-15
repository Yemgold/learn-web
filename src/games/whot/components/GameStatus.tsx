
"use client";

import { memo } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Sparkles,
  Trophy,
} from "lucide-react";

import type {
  WhotGameStatus,
  WhotPlayerId,
  WhotSubject,
} from "../types/whot";

export interface GameStatusProps {
  status: WhotGameStatus;
  currentTurn: WhotPlayerId;
  winner?: WhotPlayerId | null;
  message?: string;
  centerSubject?: WhotSubject;
  playerCardCount?: number;
  botCardCount?: number;
  drawPileCount?: number;
  timeRemaining?: number | null;
  isQuestionOpen?: boolean;
  isConnected?: boolean;
  compact?: boolean;
  className?: string;
}

interface SubjectStyle {
  border: string;
  background: string;
  text: string;
}

/* ============================================================
   SUBJECT STYLES — ALL 21 SUBJECTS
   ============================================================ */

const SUBJECT_STYLES: Record<WhotSubject, SubjectStyle> = {
  MATHS: {
    border: "border-blue-400/25",
    background: "bg-blue-400/10",
    text: "text-blue-200",
  },
  FURTHER_MATHS: {
    border: "border-indigo-400/25",
    background: "bg-indigo-400/10",
    text: "text-indigo-200",
  },
  ENGLISH: {
    border: "border-fuchsia-400/25",
    background: "bg-fuchsia-400/10",
    text: "text-fuchsia-200",
  },
  BIOLOGY: {
    border: "border-emerald-400/25",
    background: "bg-emerald-400/10",
    text: "text-emerald-200",
  },
  CHEMISTRY: {
    border: "border-orange-400/25",
    background: "bg-orange-400/10",
    text: "text-orange-200",
  },
  PHYSICS: {
    border: "border-cyan-400/25",
    background: "bg-cyan-400/10",
    text: "text-cyan-200",
  },
  AGRICULTURAL_SCIENCE: {
    border: "border-lime-400/25",
    background: "bg-lime-400/10",
    text: "text-lime-200",
  },
  COMPUTER_STUDIES: {
    border: "border-sky-400/25",
    background: "bg-sky-400/10",
    text: "text-sky-200",
  },
  COMMERCE: {
    border: "border-teal-400/25",
    background: "bg-teal-400/10",
    text: "text-teal-200",
  },
  ACCOUNTING: {
    border: "border-green-400/25",
    background: "bg-green-400/10",
    text: "text-green-200",
  },
  ECONOMICS: {
    border: "border-yellow-400/25",
    background: "bg-yellow-400/10",
    text: "text-yellow-200",
  },
  GOVERNMENT: {
    border: "border-red-400/25",
    background: "bg-red-400/10",
    text: "text-red-200",
  },
  OFFICE_PRACTICE: {
    border: "border-stone-400/25",
    background: "bg-stone-400/10",
    text: "text-stone-200",
  },
  BUSINESS_STUDIES: {
    border: "border-rose-400/25",
    background: "bg-rose-400/10",
    text: "text-rose-200",
  },
  LITERATURE: {
    border: "border-pink-400/25",
    background: "bg-pink-400/10",
    text: "text-pink-200",
  },
  HISTORY: {
    border: "border-amber-400/25",
    background: "bg-amber-400/10",
    text: "text-amber-200",
  },
  CRS: {
    border: "border-purple-400/25",
    background: "bg-purple-400/10",
    text: "text-purple-200",
  },
  IRS: {
    border: "border-violet-400/25",
    background: "bg-violet-400/10",
    text: "text-violet-200",
  },
  FRENCH: {
    border: "border-red-300/25",
    background: "bg-red-300/10",
    text: "text-red-200",
  },
  YORUBA: {
    border: "border-orange-300/25",
    background: "bg-orange-300/10",
    text: "text-orange-200",
  },
  GENERAL: {
    border: "border-violet-400/25",
    background: "bg-violet-400/10",
    text: "text-violet-200",
  },
};

/* ============================================================
   SUBJECT LABELS — ALL 21 SUBJECTS
   ============================================================ */

const SUBJECT_LABELS: Record<WhotSubject, string> = {
  MATHS: "Mathematics",
  FURTHER_MATHS: "Further Mathematics",
  ENGLISH: "English Language",
  BIOLOGY: "Biology",
  CHEMISTRY: "Chemistry",
  PHYSICS: "Physics",
  AGRICULTURAL_SCIENCE: "Agricultural Science",
  COMPUTER_STUDIES: "Computer Studies",
  COMMERCE: "Commerce",
  ACCOUNTING: "Financial Accounting",
  ECONOMICS: "Economics",
  GOVERNMENT: "Government",
  OFFICE_PRACTICE: "Office Practice",
  BUSINESS_STUDIES: "Business Studies",
  LITERATURE: "Literature in English",
  HISTORY: "History",
  CRS: "Christian Religious Studies",
  IRS: "Islamic Religious Studies",
  FRENCH: "French",
  YORUBA: "Yoruba",
  GENERAL: "General Knowledge",
};

function GameStatus({
  status,
  currentTurn,
  winner = null,
  message,
  centerSubject,
  timeRemaining = null,
  isQuestionOpen = false,
  compact = false,
  className = "",
}: GameStatusProps) {
  const isPlaying = status === "PLAYING";
  const isFinished = status === "FINISHED";

  const isPlayerTurn =
    isPlaying && currentTurn === "player";

  const isBotTurn =
    isPlaying && currentTurn === "bot";

  const safeTime =
    typeof timeRemaining === "number" &&
    Number.isFinite(timeRemaining)
      ? Math.max(0, Math.ceil(timeRemaining))
      : null;

  const subjectStyle = centerSubject
    ? SUBJECT_STYLES[centerSubject]
    : null;

  let statusText: string;
  let statusTone: string;
  let StatusIcon = Activity;

  if (isFinished) {
    if (winner === "player") {
      statusText = "You won the game!";
      statusTone =
        "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
      StatusIcon = Trophy;
    } else if (winner === "bot") {
      statusText = "The bot won this round.";
      statusTone =
        "border-rose-400/25 bg-rose-400/10 text-rose-200";
      StatusIcon = Trophy;
    } else {
      statusText = "Game completed.";
      statusTone =
        "border-white/10 bg-slate-800/70 text-slate-300";
      StatusIcon = CheckCircle2;
    }
  } else if (status === "READY") {
    statusText = "Ready to play";
    statusTone =
      "border-violet-400/25 bg-violet-400/10 text-violet-200";
    StatusIcon = Sparkles;
  } else if (isQuestionOpen && safeTime !== null) {
    statusText =
      safeTime <= 5
        ? `Hurry! ${safeTime}s remaining`
        : `Answer the question · ${safeTime}s`;

    statusTone =
      safeTime <= 5
        ? "border-rose-400/30 bg-rose-400/10 text-rose-200"
        : "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";

    StatusIcon = Clock3;
  } else if (isQuestionOpen) {
    statusText = "Choose your answer";
    statusTone =
      "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  } else if (isPlayerTurn) {
    statusText =
      "Your turn — play a matching card or draw.";

    statusTone =
      "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  } else if (isBotTurn) {
    statusText = "The bot is thinking...";
    statusTone =
      "border-amber-400/25 bg-amber-400/10 text-amber-200";
  } else {
    statusText = "Game in progress";
    statusTone =
      "border-white/10 bg-slate-800/70 text-slate-300";
  }

  // A specific game message takes priority during active play.
  // Keep the final message short and display only one status row.
  const visibleMessage =
    message?.trim() && !isFinished && !isQuestionOpen
      ? message.trim()
      : statusText;

  return (
    <section
      aria-label="Game status"
      className={`w-full min-w-0 ${className}`}
    >
      <div
        className={`flex min-w-0 items-center gap-2.5 rounded-xl border px-3 ${
          compact ? "min-h-10 py-2" : "min-h-11 py-2.5"
        } ${statusTone}`}
        role="status"
        aria-live="polite"
      >
        <StatusIcon
          size={17}
          className="shrink-0"
          aria-hidden="true"
        />

        <p className="min-w-0 flex-1 break-words text-xs font-bold leading-5 sm:text-sm">
          {visibleMessage}
        </p>

        {centerSubject &&
          !isFinished &&
          !isQuestionOpen && (
            <span
              className={`hidden shrink-0 rounded-lg border px-2 py-1 text-[10px] font-extrabold sm:inline-flex ${
                subjectStyle?.border ?? ""
              } ${
                subjectStyle?.background ?? ""
              } ${
                subjectStyle?.text ?? ""
              }`}
            >
              {SUBJECT_LABELS[centerSubject]}
            </span>
          )}
      </div>
    </section>
  );
}

export default memo(GameStatus);
