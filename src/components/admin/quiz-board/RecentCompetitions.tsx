







"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Loader2,
  Radio,
  Trophy,
  Users,
} from "lucide-react";

import { axiosInstance } from "@/lib/api";

import {
  Competition,
  formatShortDate,
  getParticipantCount,
  getStatusClasses,
  getStatusLabel,
  getTotalQuestions,
  inferStatus,
  isLiveCompetition,
} from "@/lib/api/quizBoard";

function EmptyCompetitions() {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Trophy className="h-6 w-6 text-slate-400" />
      </div>

      <h3 className="mt-4 text-base font-black text-slate-900">
        No Quiz Boards yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Create your first Quiz Board competition to start managing elimination
        contests.
      </p>

      <Link
        href="/admin/secondary/quiz-board/quiz-competitions/create"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
      >
        <Trophy className="h-4 w-4" />
        Create Quiz Board
      </Link>
    </div>
  );
}

function CompetitionRow({
  competition,
}: {
  competition: Competition;
}) {
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomError, setRoomError] = useState("");

  const status = inferStatus(competition);

  const totalQuestions = getTotalQuestions(competition);

  const players = getParticipantCount(competition);

  const maximumPlayers = Number(
    competition.no_of_contestants || 0,
  );

  /**
   * Room can only be created when all required
   * contestants have joined.
   */
  const isRoomReady =
    maximumPlayers > 0 &&
    players === maximumPlayers;

  const competitionId = String(
    competition.id ?? competition._id ?? "",
  );

  const competitionUrl = competitionId
    ? `/admin/secondary/quiz-board/quiz-competitions/${competitionId}`
    : "#";

  async function handleCreateQuizRoom() {
    if (!competitionId) {
      setRoomError("Quiz ID is missing.");
      return;
    }

    if (!isRoomReady) {
      setRoomError(
        `The room cannot be created yet. ${Math.max(
          maximumPlayers - players,
          0,
        )} more contestant${
          Math.max(maximumPlayers - players, 0) === 1
            ? ""
            : "s"
        } need to join.`,
      );
      return;
    }

    try {
      setCreatingRoom(true);
      setRoomError("");
      setRoomCreated(false);

      const response = await axiosInstance.post(
        `/quiz/create-room/${competitionId}`,
      );

      console.log("Create Quiz Room response:", response.data);

      setRoomCreated(true);
    } catch (err: any) {
      console.error("Failed to create Quiz Room:", err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to create Quiz Room.";

      setRoomError(backendMessage);
    } finally {
      setCreatingRoom(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
      {/* LEFT SIDE */}
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Trophy className="h-4 w-4 text-slate-600" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-black text-slate-900">
              {competition.quiz_title ||
                "Untitled competition"}
            </h3>

            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClasses(
                status,
              )}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span>
              {typeof competition.subject === "string"
                ? competition.subject
                : competition.subject?.name ??
                  "Subject not assigned"}
            </span>

            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />

              <span
                className={
                  isRoomReady
                    ? "font-black text-green-600"
                    : ""
                }
              >
                {players}/{maximumPlayers}
              </span>
            </span>

            <span className="inline-flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              {totalQuestions}
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {competition.time_per_question}
              s/question
            </span>

            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatShortDate(
                competition.start_date,
              )}
            </span>
          </div>

          {/* ROOM STATUS */}
          <div className="mt-2">
            {roomCreated ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black text-green-700">
                <CheckCircle2 className="h-3 w-3" />
                Quiz Room Created
              </span>
            ) : isRoomReady ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black text-green-700">
                <CheckCircle2 className="h-3 w-3" />
                All Contestants Joined — Room Ready
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                <Users className="h-3 w-3" />

                Waiting for{" "}
                {Math.max(
                  maximumPlayers - players,
                  0,
                )}{" "}
                more contestant
                {Math.max(
                  maximumPlayers - players,
                  0,
                ) === 1
                  ? ""
                  : "s"}
              </span>
            )}
          </div>

          {/* ERROR */}
          {roomError && (
            <p className="mt-2 max-w-md text-xs font-semibold text-red-600">
              {roomError}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {/* LIVE CONTROL */}
        {isLiveCompetition(competition) && (
          <Link
            href={competitionUrl}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            <Radio className="h-3.5 w-3.5" />
            Control
          </Link>
        )}

        {/* CREATE QUIZ ROOM */}
        {competitionId ? (
          <button
            type="button"
            onClick={handleCreateQuizRoom}
            disabled={
              !isRoomReady ||
              creatingRoom ||
              roomCreated
            }
            title={
              roomCreated
                ? "Quiz Room has already been created"
                : isRoomReady
                ? "Create Quiz Room"
                : `Waiting for ${Math.max(
                    maximumPlayers - players,
                    0,
                  )} more contestant${
                    Math.max(
                      maximumPlayers - players,
                      0,
                    ) === 1
                      ? ""
                      : "s"
                  }`
            }
            className={
              roomCreated
                ? "inline-flex cursor-default items-center gap-1.5 rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white"
                : isRoomReady
                ? "inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                : "inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-400"
            }
          >
            {creatingRoom ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Creating...
              </>
            ) : roomCreated ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Room Created
              </>
            ) : (
              <>
                <Radio className="h-3.5 w-3.5" />
                Create Quiz Room
              </>
            )}
          </button>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-400">
            <Radio className="h-3.5 w-3.5" />
            Create Quiz Room
          </span>
        )}

        {/* MANAGE */}
        {competitionId ? (
          <Link
            href={competitionUrl}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Manage
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-400">
            No ID
          </span>
        )}
      </div>
    </div>
  );
}

type Props = {
  competitions: Competition[];
};

export default function RecentCompetitions({
  competitions,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950">
            Recent Quiz Boards
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor competitions using live backend data.
          </p>
        </div>

        <Link
          href="/admin/secondary/quiz-board/quiz-competitions"
          className="text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      {competitions.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {competitions
            .slice(0, 10)
            .map((competition) => (
              <CompetitionRow
                key={
                  competition.id ??
                  competition._id
                }
                competition={competition}
              />
            ))}
        </div>
      ) : (
        <EmptyCompetitions />
      )}
    </section>
  );
}