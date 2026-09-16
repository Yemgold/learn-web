




"use client";

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Radio,
  Settings2,
} from "lucide-react";

import {
  Competition,
  getParticipantCount,
  getSubjectName,
} from "@/lib/api/quizBoard";

function LiveCompetitionCard({
  competition,
}: {
  competition: Competition;
}) {
  const players =
    getParticipantCount(competition);

  const percentage =
    competition.no_of_contestants > 0
      ? Math.min(
          Math.round(
            (players /
              competition.no_of_contestants) *
              100,
          ),
          100,
        )
      : 0;

  return (
    <div className="rounded-2xl border border-red-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-950">
            {competition.quiz_title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {getSubjectName(
              competition.subject,
            )}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          LIVE
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600">
          {players}/
          {competition.no_of_contestants}{" "}
          contestants
        </span>

        <span className="font-bold text-slate-500">
          {percentage}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-red-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          href={`/admin/secondary/quiz-board/quiz-competitions/${competition.id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Control
        </Link>

        <Link
          href={`/student/quiz-board/${competition.id}/watch`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5" />
          Watch
        </Link>
      </div>
    </div>
  );
}

type Props = {
  competitions: Competition[];
};

export default function LiveCompetitions({
  competitions,
}: Props) {
  if (competitions.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
      <div className="border-b border-red-100 bg-red-50 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <Radio className="h-5 w-5 animate-pulse text-red-600" />
            </div>

            <div>
              <p className="text-sm font-black text-red-900">
                Live competition in progress
              </p>

              <p className="mt-0.5 text-xs text-red-700">
                {competitions.length} Quiz Board
                {competitions.length !== 1
                  ? "s are"
                  : " is"}{" "}
                live right now.
              </p>
            </div>
          </div>

          {competitions[0]?.id && (
            <Link
              href={`/admin/secondary/quiz-board/quiz-competitions/${competitions[0].id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Open Live Control
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3">
        {competitions.map(
          (competition) => (
            <LiveCompetitionCard
              key={competition.id}
              competition={competition}
            />
          ),
        )}
      </div>
    </section>
  );
}