





"use client";

import {
  BookOpen,
  CalendarDays,
  Clock3,
  Layers3,
  Users,
} from "lucide-react";

import type {
  QuizCompetition,
  QuizRoom,
} from "@/lib/quiz-board/waiting-room/types";

import {
  formatDateTime,
  getContestantCapacity,
  getCurrentRound,
  getJoinedCount,
  getNumberOfRounds,
  getSubjectLabel,
  getTimePerQuestion,
} from "@/lib/quiz-board/waiting-room/helpers";

interface CompetitionDetailsProps {
  quiz: QuizCompetition | null;
  room?: QuizRoom | null;
  contestantCount?: number;
  maxContestants?: number;
  currentRound?: number;
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "Not set";
  }

  if (seconds < 60) {
    return `${seconds} sec/question`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min/question`;
  }

  return `${minutes}m ${remainingSeconds}s/question`;
}

function getDescription(
  quiz: QuizCompetition | null,
): string {
  if (!quiz?.description) {
    return "Get ready for the live quiz competition.";
  }

  return quiz.description;
}

export default function CompetitionDetails({
  quiz,
  room = null,
  contestantCount,
  maxContestants,
  currentRound,
}: CompetitionDetailsProps) {
  if (!quiz) {
    return null;
  }

  const subject = getSubjectLabel(
    quiz.subject,
  );

  const quizCurrentRound =
    currentRound ??
    getCurrentRound(quiz);

  const numberOfRounds =
    getNumberOfRounds(quiz);

  const quizJoinedCount =
    getJoinedCount(quiz);

  const quizCapacity =
    getContestantCapacity(quiz);

  const displayedContestantCount =
    typeof contestantCount === "number"
      ? contestantCount
      : quizJoinedCount;

  const displayedMaxContestants =
    typeof maxContestants === "number"
      ? maxContestants
      : quizCapacity;

  const timePerQuestion =
    getTimePerQuestion(quiz);

  const scheduledDate =
    formatDateTime(
      quiz.start_date,
    );

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-400/20">
          <BookOpen className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Competition Details
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">
            {quiz.quiz_title ||
              "Quiz Competition"}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {getDescription(quiz)}
          </p>
        </div>
      </div>

      {/* Main details */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Subject */}
        <DetailItem
          icon={
            <BookOpen className="h-4 w-4" />
          }
          label="Subject"
          value={subject}
        />

        {/* Players */}
        <DetailItem
          icon={
            <Users className="h-4 w-4" />
          }
          label="Contestants"
          value={
            displayedMaxContestants > 0
              ? `${displayedContestantCount} / ${displayedMaxContestants}`
              : `${displayedContestantCount}`
          }
        />

        {/* Rounds */}
        <DetailItem
          icon={
            <Layers3 className="h-4 w-4" />
          }
          label="Rounds"
          value={
            numberOfRounds > 0
              ? quizCurrentRound > 0
                ? `${quizCurrentRound} / ${numberOfRounds}`
                : `${numberOfRounds}`
              : "Not set"
          }
        />

        {/* Time */}
        <DetailItem
          icon={
            <Clock3 className="h-4 w-4" />
          }
          label="Time per Question"
          value={formatDuration(
            timePerQuestion,
          )}
        />

        {/* Start date */}
        <DetailItem
          icon={
            <CalendarDays className="h-4 w-4" />
          }
          label="Scheduled Start"
          value={scheduledDate}
        />

        {/* Room */}
        <DetailItem
          icon={
            <Layers3 className="h-4 w-4" />
          }
          label="Room Status"
          value={
            room?.status
              ? String(room.status)
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(
                    /\b\w/g,
                    (letter) =>
                      letter.toUpperCase(),
                  )
              : "Waiting"
          }
        />
      </div>
    </section>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({
  icon,
  label,
  value,
}: DetailItemProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/10 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-cyan-400/80">
          {icon}
        </span>

        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}