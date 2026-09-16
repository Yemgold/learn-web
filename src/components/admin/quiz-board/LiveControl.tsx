




"use client";

import Link from "next/link";
import {
  Eye,
  Radio,
  Settings2,
} from "lucide-react";

import {
  Competition,
  getParticipantCount,
} from "@/lib/api/quizBoard";

type Props = {
  competitions: Competition[];
};

export default function LiveControl({
  competitions,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-sm">
      <div className="border-b border-red-100 bg-red-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
            <Radio className="h-5 w-5 text-red-600" />
          </div>

          <div>
            <h2 className="font-black text-red-950">
              Live Control
            </h2>

            <p className="mt-0.5 text-xs text-red-700">
              Real-time competition monitoring
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {competitions.length > 0 ? (
          <div className="space-y-4">
            {competitions.map(
              (competition) => {
                const players =
                  getParticipantCount(
                    competition,
                  );

                return (
                  <div
                    key={competition.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900">
                          {competition.quiz_title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {players}/
                          {
                            competition.no_of_contestants
                          }{" "}
                          contestants
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                        LIVE
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={`/admin/secondary/quiz-board/quiz-competitions/${competition.id}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        Control
                      </Link>

                      <Link
                        href={`/student/quiz-board/${competition.id}/watch`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Watch
                      </Link>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        ) : (
          <div className="py-5 text-center">
            <Radio className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-700">
              No live competitions
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Competitions with IN_PROGRESS
              status will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}