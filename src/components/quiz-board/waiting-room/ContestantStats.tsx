





"use client";

import {
  CheckCircle2,
  Clock3,
  Trophy,
  Users,
  Wifi,
} from "lucide-react";

interface ContestantStatsProps {
  contestantCount?: number;
  maxContestants?: number;
  currentRound?: number;
  totalRounds?: number;
  socketConnected?: boolean;
  socketRoomJoined?: boolean;
  roomActivated?: boolean;
  remainingPlayers?: number;
}

export default function ContestantStats({
  contestantCount = 0,
  maxContestants = 0,
  currentRound = 0,
  totalRounds = 0,
  socketConnected = false,
  socketRoomJoined = false,
  roomActivated = false,
  remainingPlayers,
}: ContestantStatsProps) {
  const calculatedRemaining =
    maxContestants > 0
      ? Math.max(
          0,
          maxContestants - contestantCount,
        )
      : 0;

  const spotsRemaining =
    typeof remainingPlayers === "number"
      ? Math.max(0, remainingPlayers)
      : calculatedRemaining;

  const isFull =
    maxContestants > 0 &&
    contestantCount >= maxContestants;

  const isConnected =
    socketConnected && socketRoomJoined;

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={
          <Users className="h-5 w-5" />
        }
        label="Contestants"
        value={
          maxContestants > 0
            ? `${contestantCount} / ${maxContestants}`
            : String(contestantCount)
        }
        description={
          isFull
            ? "Competition is full"
            : spotsRemaining > 0
              ? `${spotsRemaining} ${
                  spotsRemaining === 1
                    ? "spot"
                    : "spots"
                } remaining`
              : "Waiting for registration"
        }
        tone={isFull ? "success" : "cyan"}
      />

      <StatCard
        icon={
          <Trophy className="h-5 w-5" />
        }
        label="Current Round"
        value={
          currentRound > 0
            ? totalRounds > 0
              ? `${currentRound} / ${totalRounds}`
              : String(currentRound)
            : "Waiting"
        }
        description={
          currentRound > 0
            ? "Competition is in progress"
            : roomActivated
              ? "Waiting for host"
              : "Room not active"
        }
        tone={
          currentRound > 0
            ? "violet"
            : "slate"
        }
      />

      <StatCard
        icon={
          <Wifi className="h-5 w-5" />
        }
        label="Connection"
        value={
          isConnected
            ? "Connected"
            : socketConnected
              ? "Connecting"
              : "Offline"
        }
        description={
          isConnected
            ? "Live room connection active"
            : socketConnected
              ? "Joining quiz room..."
              : "Waiting for connection"
        }
        tone={
          isConnected
            ? "success"
            : socketConnected
              ? "cyan"
              : "slate"
        }
      />

      <StatCard
        icon={
          <Clock3 className="h-5 w-5" />
        }
        label="Room Status"
        value={
          roomActivated
            ? "Active"
            : "Waiting"
        }
        description={
          roomActivated
            ? isConnected
              ? "You are in the live room"
              : "Room is ready"
            : "Waiting for host activation"
        }
        tone={
          roomActivated
            ? "success"
            : "amber"
        }
      />
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  tone:
    | "cyan"
    | "violet"
    | "success"
    | "amber"
    | "slate";
}

function StatCard({
  icon,
  label,
  value,
  description,
  tone,
}: StatCardProps) {
  const toneClasses = {
    cyan: {
      icon: "bg-cyan-400/10 text-cyan-400 ring-cyan-400/20",
      value: "text-cyan-300",
      dot: "bg-cyan-400",
    },
    violet: {
      icon: "bg-violet-400/10 text-violet-400 ring-violet-400/20",
      value: "text-violet-300",
      dot: "bg-violet-400",
    },
    success: {
      icon: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
      value: "text-emerald-300",
      dot: "bg-emerald-400",
    },
    amber: {
      icon: "bg-amber-400/10 text-amber-400 ring-amber-400/20",
      value: "text-amber-300",
      dot: "bg-amber-400",
    },
    slate: {
      icon: "bg-white/[0.05] text-slate-400 ring-white/10",
      value: "text-slate-200",
      dot: "bg-slate-500",
    },
  }[tone];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-lg shadow-black/10 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${toneClasses.icon}`}
        >
          {icon}
        </div>

        <span
          className={`mt-2 h-2 w-2 rounded-full ${toneClasses.dot}`}
        />
      </div>

      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-bold ${toneClasses.value}`}
      >
        {value}
      </p>

      <div className="mt-2 flex items-center gap-1.5">
        {tone === "success" && (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        )}

        <p className="truncate text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}