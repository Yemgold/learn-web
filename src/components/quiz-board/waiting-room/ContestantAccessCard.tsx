




"use client";

import {
  CheckCircle2,
  Copy,
  KeyRound,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";

interface ContestantAccessCardProps {
  contestantId?: string | null;
  contestantCount?: number;
  maxContestants?: number;
  roomActivated?: boolean;
  roomJoined?: boolean;
  joining?: boolean;
  error?: string;
  onJoinRoom?: () => void;
}

export default function ContestantAccessCard({
  contestantId,
  contestantCount = 0,
  maxContestants = 0,
  roomActivated = false,
  roomJoined = false,
  joining = false,
  error = "",
  onJoinRoom,
}: ContestantAccessCardProps) {
  const [copied, setCopied] =
    useState(false);

  const normalizedContestantId =
    typeof contestantId === "string"
      ? contestantId.trim()
      : "";

  const hasContestantId =
    normalizedContestantId.length > 0;

  const isFull =
    maxContestants > 0 &&
    contestantCount >= maxContestants;

  const handleCopy = async () => {
    if (!hasContestantId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        normalizedContestantId,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/[0.08] via-white/[0.03] to-violet-500/[0.06] p-5 shadow-xl shadow-black/10 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-400/20">
          <KeyRound className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Contestant Access
          </p>

          <h2 className="mt-1 text-lg font-bold text-white">
            Your Contestant ID
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Your contestant identity is already linked
            to this competition. No access code needs to
            be entered manually.
          </p>
        </div>
      </div>

      {/* Contestant ID */}
      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Contestant ID
          </span>

          {hasContestantId && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>

        {hasContestantId ? (
          <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.05] px-4 py-3">
            <p className="font-mono text-base font-bold tracking-wider text-cyan-300">
              {normalizedContestantId}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-400/20 bg-amber-400/[0.05] px-4 py-3">
            <p className="text-sm text-amber-300">
              Contestant ID is not available for this
              competition.
            </p>
          </div>
        )}
      </div>

      {/* Room information */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoItem
          icon={
            <Users className="h-4 w-4" />
          }
          label="Contestants"
          value={
            maxContestants > 0
              ? `${contestantCount} / ${maxContestants}`
              : `${contestantCount}`
          }
        />

        <InfoItem
          icon={
            <ShieldCheck className="h-4 w-4" />
          }
          label="Room"
          value={
            roomJoined
              ? "Joined"
              : roomActivated
                ? "Active"
                : "Waiting"
          }
        />
      </div>

      {/* Status */}
      <div className="mt-4">
        {roomJoined ? (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

            <div>
              <p className="text-sm font-semibold text-emerald-300">
                You are in the quiz room
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                You are connected to the live competition
                room. Stay here while waiting for the host
                to start the next round.
              </p>
            </div>
          </div>
        ) : roomActivated ? (
          <div className="flex items-start gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />

            <div className="flex-1">
              <p className="text-sm font-semibold text-cyan-300">
                Quiz room is active
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                Your contestant identity has been verified
                for this competition.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Waiting for the host
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The quiz room has not been activated yet.
                You will be connected automatically when the
                host opens the room.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Optional join action */}
      {roomActivated &&
        !roomJoined &&
        hasContestantId &&
        onJoinRoom && (
          <button
            type="button"
            onClick={onJoinRoom}
            disabled={joining || isFull}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {joining
              ? "Joining Quiz Room..."
              : isFull
                ? "Quiz Room Is Full"
                : "Enter Quiz Room"}
          </button>
        )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3">
          <p className="text-sm text-red-300">
            {error}
          </p>
        </div>
      )}
    </section>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/10 p-3.5">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-cyan-400/80">
          {icon}
        </span>

        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-1.5 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}