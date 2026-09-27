


"use client";

import {
  ArrowLeft,
  Copy,
  Radio,
  Users,
} from "lucide-react";
import { useState } from "react";

import QuizConnectionStatus, {
  type QuizConnectionState,
} from "./QuizConnectionStatus";

export interface QuizRoomHeaderProps {
  quizTitle: string;

  roomId?: string | null;

  subject?: string | null;

  currentRound?: number | null;
  totalRounds?: number | null;

  participantCount?: number | null;

  connected?: boolean;
  connectionStatus?: QuizConnectionState;

  live?: boolean;

  onBack?: () => void;

  onCopyRoomId?: () => void;

  compact?: boolean;
}

export default function QuizRoomHeader({
  quizTitle,
  roomId = null,
  subject = null,
  currentRound = null,
  totalRounds = null,
  participantCount = null,
  connected = false,
  connectionStatus,
  live = false,
  onBack,
  onCopyRoomId,
  compact = false,
}: QuizRoomHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!roomId) {
      return;
    }

    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(roomId);
      }

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);

      onCopyRoomId?.();
    } catch {
      onCopyRoomId?.();
    }
  };

  const showRound =
    currentRound !== null &&
    totalRounds !== null;

  const showParticipants =
    participantCount !== null;

  return (
    <header
      className={[
        "sticky top-0 z-40 border-b border-white/10",
        "bg-slate-950/90 backdrop-blur-xl",
        compact
          ? "px-3 py-3"
          : "px-4 py-3 sm:px-6",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* LEFT SIDE */}
        <div className="flex min-w-0 items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <div className="min-w-0">
            {/* TITLE */}
            <div className="flex items-center gap-2">
              <Radio
                className={[
                  "h-4 w-4 shrink-0",
                  live
                    ? "animate-pulse text-emerald-300"
                    : "text-cyan-300",
                ].join(" ")}
              />

              <h1 className="truncate text-sm font-bold text-white sm:text-base">
                {quizTitle}
              </h1>
            </div>

            {/* META INFORMATION */}
            {(subject ||
              showRound ||
              showParticipants) && (
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500 sm:text-xs">
                {subject && (
                  <>
                    <span>{subject}</span>

                    {(showRound ||
                      showParticipants) && (
                      <span className="text-slate-700">
                        •
                      </span>
                    )}
                  </>
                )}

                {showRound && (
                  <>
                    <span>
                      Round {currentRound} /{" "}
                      {totalRounds}
                    </span>

                    {showParticipants && (
                      <span className="text-slate-700">
                        •
                      </span>
                    )}
                  </>
                )}

                {showParticipants && (
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />

                    {participantCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-2">
          {roomId && (
            <button
              type="button"
              onClick={handleCopy}
              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 transition hover:bg-white/[0.06] hover:text-white sm:flex"
              title="Copy room ID"
              aria-label="Copy room ID"
            >
              <span className="font-mono">
                {roomId}
              </span>

              <Copy className="h-3.5 w-3.5" />

              {copied && (
                <span className="text-emerald-300">
                  Copied
                </span>
              )}
            </button>
          )}

          <QuizConnectionStatus
            status={connectionStatus}
            connected={connected}
            compact
          />
        </div>
      </div>

      {/* MOBILE ROOM ID */}
      {roomId && (
        <div className="mx-auto mt-2 flex max-w-7xl items-center justify-end sm:hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-[10px] text-slate-600 transition hover:text-slate-300"
            aria-label="Copy room ID"
          >
            <span>Room:</span>

            <span className="max-w-[180px] truncate font-mono text-slate-500">
              {roomId}
            </span>

            <Copy className="h-3 w-3 shrink-0" />

            {copied && (
              <span className="text-emerald-400">
                Copied
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
}