
"use client";

import { memo } from "react";
import {
  Atom,
  BookOpen,
  BriefcaseBusiness,
  Calculator,
  Check,
  Clock3,
  Code2,
  Coins,
  FlaskConical,
  FunctionSquare,
  Globe,
  GraduationCap,
  History,
  Languages,
  Leaf,
  Landmark,
  Microscope,
  Scale,
  Sparkles,
  Star,
  BookMarked,
  type LucideIcon,
} from "lucide-react";

import type {
  WhotCard,
  WhotDifficulty,
  WhotSubject,
} from "../types/whot";

export interface PlayingCardProps {
  card?: WhotCard;
  faceDown?: boolean;
  playable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  showQuestion?: boolean;
  showDifficulty?: boolean;
  compact?: boolean;
  onClick?: (instanceId: string) => void;
  className?: string;
  index?: number;
  label?: string;
}

interface SubjectConfig {
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  border: string;
  badge: string;
  surface: string;
  accent: string;
}

/* ============================================================
   SUBJECT CONFIGURATION — ALL 21 SUBJECTS
   ============================================================ */

const SUBJECT_CONFIG: Record<WhotSubject, SubjectConfig> = {
  MATHS: {
    label: "Mathematics",
    shortLabel: "MATHS",
    icon: FunctionSquare,
    border: "border-blue-400/50",
    badge: "border-blue-300/30 bg-blue-400/15 text-blue-200",
    surface: "from-blue-950 via-slate-950 to-blue-900/80",
    accent: "text-blue-200",
  },

  FURTHER_MATHS: {
    label: "Further Mathematics",
    shortLabel: "FURTHER MATHS",
    icon: Calculator,
    border: "border-indigo-400/50",
    badge: "border-indigo-300/30 bg-indigo-400/15 text-indigo-200",
    surface: "from-indigo-950 via-slate-950 to-indigo-900/80",
    accent: "text-indigo-200",
  },

  ENGLISH: {
    label: "English Language",
    shortLabel: "ENGLISH",
    icon: BookOpen,
    border: "border-fuchsia-400/50",
    badge: "border-fuchsia-300/30 bg-fuchsia-400/15 text-fuchsia-200",
    surface: "from-fuchsia-950 via-slate-950 to-purple-950",
    accent: "text-fuchsia-200",
  },

  BIOLOGY: {
    label: "Biology",
    shortLabel: "BIOLOGY",
    icon: Sparkles,
    border: "border-emerald-400/50",
    badge: "border-emerald-300/30 bg-emerald-400/15 text-emerald-200",
    surface: "from-emerald-950 via-slate-950 to-green-950",
    accent: "text-emerald-200",
  },

  CHEMISTRY: {
    label: "Chemistry",
    shortLabel: "CHEMISTRY",
    icon: FlaskConical,
    border: "border-orange-400/50",
    badge: "border-orange-300/30 bg-orange-400/15 text-orange-200",
    surface: "from-orange-950 via-slate-950 to-amber-950",
    accent: "text-orange-200",
  },

  PHYSICS: {
    label: "Physics",
    shortLabel: "PHYSICS",
    icon: Atom,
    border: "border-cyan-400/50",
    badge: "border-cyan-300/30 bg-cyan-400/15 text-cyan-200",
    surface: "from-cyan-950 via-slate-950 to-blue-950",
    accent: "text-cyan-200",
  },

  AGRICULTURAL_SCIENCE: {
    label: "Agricultural Science",
    shortLabel: "AGRIC SCI",
    icon: Leaf,
    border: "border-lime-400/50",
    badge: "border-lime-300/30 bg-lime-400/15 text-lime-200",
    surface: "from-lime-950 via-slate-950 to-green-950",
    accent: "text-lime-200",
  },

  COMPUTER_STUDIES: {
    label: "Computer Studies",
    shortLabel: "COMPUTER",
    icon: Code2,
    border: "border-sky-400/50",
    badge: "border-sky-300/30 bg-sky-400/15 text-sky-200",
    surface: "from-sky-950 via-slate-950 to-blue-950",
    accent: "text-sky-200",
  },

  COMMERCE: {
    label: "Commerce",
    shortLabel: "COMMERCE",
    icon: Coins,
    border: "border-teal-400/50",
    badge: "border-teal-300/30 bg-teal-400/15 text-teal-200",
    surface: "from-teal-950 via-slate-950 to-cyan-950",
    accent: "text-teal-200",
  },

  ACCOUNTING: {
    label: "Financial Accounting",
    shortLabel: "ACCOUNTING",
    icon: Calculator,
    border: "border-green-400/50",
    badge: "border-green-300/30 bg-green-400/15 text-green-200",
    surface: "from-green-950 via-slate-950 to-emerald-950",
    accent: "text-green-200",
  },

  ECONOMICS: {
    label: "Economics",
    shortLabel: "ECONOMICS",
    icon: Globe,
    border: "border-yellow-400/50",
    badge: "border-yellow-300/30 bg-yellow-400/15 text-yellow-200",
    surface: "from-yellow-950 via-slate-950 to-amber-950",
    accent: "text-yellow-200",
  },

  GOVERNMENT: {
    label: "Government",
    shortLabel: "GOVERNMENT",
    icon: Landmark,
    border: "border-red-400/50",
    badge: "border-red-300/30 bg-red-400/15 text-red-200",
    surface: "from-red-950 via-slate-950 to-rose-950",
    accent: "text-red-200",
  },

  OFFICE_PRACTICE: {
    label: "Office Practice",
    shortLabel: "OFFICE",
    icon: BriefcaseBusiness,
    border: "border-stone-400/50",
    badge: "border-stone-300/30 bg-stone-400/15 text-stone-200",
    surface: "from-stone-900 via-slate-950 to-zinc-900",
    accent: "text-stone-200",
  },

  BUSINESS_STUDIES: {
    label: "Business Studies",
    shortLabel: "BUSINESS",
    icon: GraduationCap,
    border: "border-rose-400/50",
    badge: "border-rose-300/30 bg-rose-400/15 text-rose-200",
    surface: "from-rose-950 via-slate-950 to-pink-950",
    accent: "text-rose-200",
  },

  LITERATURE: {
    label: "Literature in English",
    shortLabel: "LITERATURE",
    icon: BookMarked,
    border: "border-pink-400/50",
    badge: "border-pink-300/30 bg-pink-400/15 text-pink-200",
    surface: "from-pink-950 via-slate-950 to-purple-950",
    accent: "text-pink-200",
  },

  HISTORY: {
    label: "History",
    shortLabel: "HISTORY",
    icon: History,
    border: "border-amber-400/50",
    badge: "border-amber-300/30 bg-amber-400/15 text-amber-200",
    surface: "from-amber-950 via-slate-950 to-yellow-950",
    accent: "text-amber-200",
  },

  CRS: {
    label: "Christian Religious Studies",
    shortLabel: "CRS",
    icon: BookOpen,
    border: "border-purple-400/50",
    badge: "border-purple-300/30 bg-purple-400/15 text-purple-200",
    surface: "from-purple-950 via-slate-950 to-violet-950",
    accent: "text-purple-200",
  },

  IRS: {
    label: "Islamic Religious Studies",
    shortLabel: "IRS",
    icon: BookOpen,
    border: "border-violet-400/50",
    badge: "border-violet-300/30 bg-violet-400/15 text-violet-200",
    surface: "from-violet-950 via-slate-950 to-indigo-950",
    accent: "text-violet-200",
  },

  FRENCH: {
    label: "French",
    shortLabel: "FRENCH",
    icon: Languages,
    border: "border-red-300/50",
    badge: "border-red-300/30 bg-red-300/15 text-red-200",
    surface: "from-red-950 via-slate-950 to-rose-950",
    accent: "text-red-200",
  },

  YORUBA: {
    label: "Yoruba",
    shortLabel: "YORUBA",
    icon: Languages,
    border: "border-orange-300/50",
    badge: "border-orange-300/30 bg-orange-300/15 text-orange-200",
    surface: "from-orange-950 via-slate-950 to-amber-950",
    accent: "text-orange-200",
  },

  GENERAL: {
    label: "General Knowledge",
    shortLabel: "GENERAL",
    icon: Star,
    border: "border-violet-400/50",
    badge: "border-violet-300/30 bg-violet-400/15 text-violet-200",
    surface: "from-violet-950 via-slate-950 to-purple-950",
    accent: "text-violet-200",
  },
};

/* ============================================================
   DIFFICULTY CONFIGURATION
   ============================================================ */

const DIFFICULTY_CONFIG: Record<
  WhotDifficulty,
  { label: string; className: string }
> = {
  EASY: {
    label: "Easy",
    className: "bg-emerald-400/10 text-emerald-300",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-amber-400/10 text-amber-300",
  },
  HARD: {
    label: "Hard",
    className: "bg-rose-400/10 text-rose-300",
  },
};

/* ============================================================
   PLAYING CARD
   ============================================================ */

function PlayingCard({
  card,
  faceDown = false,
  playable = false,
  selected = false,
  disabled = false,
  showQuestion = true,
  showDifficulty = true,
  compact = false,
  onClick,
  className = "",
  index,
  label,
}: PlayingCardProps) {
  const canClick =
    Boolean(card && onClick) &&
    !faceDown &&
    !disabled &&
    playable;

  const config = card
    ? SUBJECT_CONFIG[card.subject]
    : null;

  const cardLabel =
    label ??
    (config
      ? `${config.label} card`
      : "WHOT playing card");

  const sizeClasses = compact
    ? "min-h-[112px] w-[82px] p-2"
    : "min-h-[164px] w-full max-w-[156px] p-3 sm:min-h-[188px] sm:p-3.5";

  /* -------------------- FACE-DOWN CARD -------------------- */

  if (faceDown || !card) {
    return (
      <div
        role="img"
        aria-label={cardLabel}
        className={`relative ${sizeClasses} overflow-hidden rounded-xl border border-cyan-300/40 bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 shadow-lg ${className}`}
      >
        <div className="absolute inset-[5px] rounded-lg border border-cyan-300/25" />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10">
            <span className="text-xl font-black text-cyan-200">
              W
            </span>
          </div>

          <span className="mt-3 text-[8px] font-extrabold tracking-[0.2em] text-cyan-100/70">
            LEARNYFI
          </span>
        </div>

        {index !== undefined && (
          <span className="absolute left-2 top-2 text-[9px] font-bold text-cyan-100/70">
            {index + 1}
          </span>
        )}
      </div>
    );
  }

  const SubjectIcon = config!.icon;
  const difficulty = DIFFICULTY_CONFIG[card.difficulty];

  /* -------------------- FACE-UP CARD -------------------- */

  return (
    <button
      type="button"
      disabled={!canClick}
      onClick={() => {
        if (canClick) {
          onClick?.(card.instanceId);
        }
      }}
      aria-label={`${cardLabel}: ${config!.label}${
        playable ? ", playable" : ""
      }${selected ? ", selected" : ""}`}
      aria-pressed={selected}
      className={`group relative flex ${sizeClasses} flex-col overflow-hidden rounded-xl border bg-gradient-to-br text-left shadow-lg transition-all duration-200 ${
        selected
          ? "z-10 -translate-y-1 border-amber-300 ring-2 ring-amber-300/70 shadow-amber-300/10"
          : playable && !disabled
            ? `${config!.border} hover:-translate-y-1 hover:shadow-xl`
            : "border-white/10"
      } ${config!.surface} ${
        canClick ? "cursor-pointer" : "cursor-default"
      } ${disabled ? "opacity-60" : ""} ${className}`}
    >
      <div className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-white/[0.05] blur-xl" />

      <div className="relative flex items-start justify-between gap-1">
        <span
          className={`rounded-md border px-1.5 py-1 text-[8px] font-extrabold tracking-wide sm:text-[9px] ${config!.badge}`}
        >
          {config!.shortLabel}
        </span>

        {selected ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-300 text-slate-950">
            <Check
              size={12}
              strokeWidth={3}
              aria-hidden="true"
            />
          </span>
        ) : playable && !disabled ? (
          <span
            className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-cyan-300"
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center py-2 text-center">
        <div
          className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-black/20 sm:h-11 sm:w-11 ${config!.accent}`}
        >
          <SubjectIcon
            size={compact ? 19 : 23}
            aria-hidden="true"
          />
        </div>

        {showQuestion && (
          <p className="line-clamp-4 w-full break-words text-[10px] font-semibold leading-4 text-white sm:text-xs sm:leading-5">
            {card.question}
          </p>
        )}

        {!showQuestion && (
          <p className="text-[10px] font-bold text-white sm:text-xs">
            {config!.label}
          </p>
        )}
      </div>

      <div className="relative mt-auto border-t border-white/10 pt-2">
        {showDifficulty ? (
          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-[8px] text-slate-300/80 sm:text-[9px]">
              {config!.label}
            </span>

            <span
              className={`shrink-0 rounded px-1 py-0.5 text-[8px] font-bold ${difficulty.className}`}
            >
              {difficulty.label}
            </span>
          </div>
        ) : (
          <p className="truncate text-center text-[9px] font-semibold text-slate-300/80">
            {config!.label}
          </p>
        )}
      </div>

      {playable && !disabled && !selected && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400" />
      )}

      {selected && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-amber-300 py-1 text-[8px] font-black uppercase tracking-wider text-slate-950">
          <Clock3 size={10} aria-hidden="true" />
          Selected
        </div>
      )}
    </button>
  );
}

export default memo(PlayingCard);
