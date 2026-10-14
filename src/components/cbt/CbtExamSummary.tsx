





"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flag,
  GraduationCap,
  Printer,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

export interface CbtExamSummaryProps {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  flaggedQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  totalPointsAwarded: number;
  studentName?: string;
  subjectName?: string;
  certificateId?: string;
  onExit?: () => void;
  onReview?: () => void;
}

export default function CbtExamSummary({
  totalQuestions,
  answeredQuestions,
  unansweredQuestions,
  flaggedQuestions,
  correctAnswers,
  score,
  percentage,
  totalPointsAwarded,
  studentName = "Learner",
  subjectName = "CBT Practice Examination",
  certificateId,
  onExit,
  onReview,
}: CbtExamSummaryProps) {
  const [showResults, setShowResults] = useState(false);
  const [showPoints, setShowPoints] = useState(false);

  const safePercentage = Math.max(
    0,
    Math.min(100, Number(percentage) || 0),
  );

  const grade =
    safePercentage >= 70
      ? "A"
      : safePercentage >= 60
        ? "B"
        : safePercentage >= 50
          ? "C"
          : safePercentage >= 45
            ? "D"
            : "F";

  const completedDate = new Date().toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      {/* Certificate */}
      <section
        id="cbt-practice-certificate"
        className="certificate-print overflow-hidden rounded-3xl border border-amber-300/30 bg-slate-950 p-2 shadow-2xl sm:p-4"
      >
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 px-5 py-8 text-center sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full border border-amber-300" />
            <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full border border-amber-300" />
            <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full border border-amber-300" />
            <div className="absolute -bottom-12 -right-8 h-40 w-40 rounded-full border border-amber-300" />
          </div>

          <div className="relative">
            {/* Certificate emblem */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/60 bg-amber-400/10 shadow-lg shadow-amber-500/10 sm:h-20 sm:w-20">
              <Award className="h-9 w-9 text-amber-300 sm:h-11 sm:w-11" />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-amber-300 sm:text-sm">
              Practice Achievement
            </p>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
              Certificate of Completion
            </h1>

            <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />

            <p className="mt-5 text-sm text-slate-300">
              This certificate recognizes the successful completion
              of a CBT practice session by
            </p>

            <h2 className="mt-5 break-words text-2xl font-black text-amber-300 sm:text-4xl">
              {studentName}
            </h2>

            <div className="mx-auto mt-4 max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Examination
              </p>
              <p className="mt-2 text-base font-semibold text-white sm:text-lg">
                {subjectName}
              </p>
            </div>

            {/* Main achievement */}
            <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-3 sm:gap-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                  Final Score
                </p>
                <p className="mt-2 text-4xl font-black text-white sm:text-5xl">
                  {safePercentage}%
                </p>
              </div>

              <div className="rounded-2xl border border-amber-300/20 bg-amber-400/[0.06] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                  Grade
                </p>
                <p className="mt-2 text-4xl font-black text-amber-300 sm:text-5xl">
                  {grade}
                </p>
              </div>
            </div>

            <div className="mx-auto mt-7 flex max-w-lg flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-xs text-slate-400">Date completed</p>
                <p className="mt-1 text-sm font-bold text-white">
                  {completedDate}
                </p>
              </div>

              {certificateId && (
                <div className="text-center sm:text-right">
                  <p className="text-xs text-slate-400">
                    Certificate reference
                  </p>
                  <p className="mt-1 break-all text-sm font-bold text-amber-300">
                    {certificateId}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Practice session completed
            </div>

            <p className="mt-3 text-[10px] text-slate-500">
              Learnyfi · Learning and Practice
            </p>
          </div>
        </div>
      </section>

      {/* Certificate actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          <Printer className="h-4 w-4" />
          Print / Save Certificate
        </button>

        <button
          type="button"
          onClick={() => setShowResults((value) => !value)}
          aria-expanded={showResults}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <GraduationCap className="h-4 w-4 text-blue-300" />
          {showResults ? "Hide Examination Results" : "View Examination Results"}
          {showResults ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Expandable examination details */}
      {showResults && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
              Performance Report
            </p>
            <h2 className="mt-2 text-xl font-black text-white">
              Your Examination Results
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Review your answers and examination performance.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.06] p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <p className="mt-3 text-2xl font-black text-white">
                {answeredQuestions}
              </p>
              <p className="mt-1 text-xs text-slate-400">Answered</p>
            </div>

            <div className="rounded-2xl border border-blue-400/15 bg-blue-500/[0.06] p-4">
              <Trophy className="h-5 w-5 text-blue-400" />
              <p className="mt-3 text-2xl font-black text-white">
                {correctAnswers}
              </p>
              <p className="mt-1 text-xs text-slate-400">Correct</p>
            </div>

            <div className="rounded-2xl border border-red-400/15 bg-red-500/[0.06] p-4">
              <XCircle className="h-5 w-5 text-red-400" />
              <p className="mt-3 text-2xl font-black text-white">
                {unansweredQuestions}
              </p>
              <p className="mt-1 text-xs text-slate-400">Unanswered</p>
            </div>

            <div className="rounded-2xl border border-amber-400/15 bg-amber-500/[0.06] p-4">
              <Flag className="h-5 w-5 text-amber-400" />
              <p className="mt-3 text-2xl font-black text-white">
                {flaggedQuestions}
              </p>
              <p className="mt-1 text-xs text-slate-400">Flagged</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">
                Overall score
              </span>
              <span className="text-lg font-black text-white">
                {score} / {totalQuestions}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                style={{ width: `${safePercentage}%` }}
              />
            </div>

            <p className="mt-2 text-right text-xs text-slate-400">
              {safePercentage}% achieved
            </p>
          </div>

          {onReview && (
            <button
              type="button"
              onClick={onReview}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
            >
              <RotateCcw className="h-4 w-4" />
              Review Questions
            </button>
          )}
        </section>
      )}

      {/* Expandable points and rewards */}
      <section className="overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/[0.08] to-emerald-500/[0.06]">
        <button
          type="button"
          onClick={() => setShowPoints((value) => !value)}
          aria-expanded={showPoints}
          className="flex min-h-20 w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.03] sm:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400/10">
              <Trophy className="h-6 w-6 text-amber-300" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                CBT Rewards
              </p>
              <h2 className="mt-1 text-lg font-black text-white">
                {totalPointsAwarded} Points Earned
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Tap to view your points information
              </p>
            </div>
          </div>

          {showPoints ? (
            <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
          )}
        </button>

        {showPoints && (
          <div className="border-t border-white/10 px-5 py-5 sm:px-6">
            <p className="text-sm leading-6 text-slate-300">
              You earned{" "}
              <span className="font-black text-emerald-300">
                {totalPointsAwarded} CBT points
              </span>{" "}
              in this practice session. Check your wallet to confirm your
              available balance and see which rewards or activities are
              eligible for your points.
            </p>
          </div>
        )}
      </section>

      {/* Return action */}
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/[0.08]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CBT Practice
        </button>
      )}

      {/* Print only the certificate */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 8mm;
          }

          body {
            background: #ffffff !important;
            color: #0f172a !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          body * {
            visibility: hidden !important;
          }

          #cbt-practice-certificate,
          #cbt-practice-certificate * {
            visibility: visible !important;
          }

          #cbt-practice-certificate {
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            break-inside: avoid !important;
          }

          #cbt-practice-certificate > div {
            min-height: 175mm;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
