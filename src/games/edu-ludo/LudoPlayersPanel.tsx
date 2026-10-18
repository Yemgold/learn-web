




"use client";

import {
  CheckCircle2,
  Circle,
  Crown,
  Target,
  Trophy,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import type {
  EduLudoColor,
  EduLudoPlayer,
} from "./eduLudoTypes";

import { COLOR_STYLES, TOKENS_PER_PLAYER } from "./eduLudoConstants";

interface LudoPlayersPanelProps {
  players: EduLudoPlayer[];
  currentPlayerId?: string | null;
  currentTurn?: number;
  cbtPoints?: number;
  compact?: boolean;
  showTokenProgress?: boolean;
  onPlayerClick?: (player: EduLudoPlayer) => void;
}

const COLOR_DOT_STYLES: Record<EduLudoColor, string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  blue: "bg-blue-500",
};

function getTokenProgress(player: EduLudoPlayer) {
  const tokens = player.tokens ?? [];

  const home = tokens.filter(
    (token) => token.position === 57 || token.status === "home",
  ).length;

  const onBoard = tokens.filter(
    (token) =>
      token.position >= 0 &&
      token.position < 57 &&
      token.status !== "home",
  ).length;

  const inBase = Math.max(0, tokens.length - home - onBoard);

  return {
    home,
    onBoard,
    inBase,
    total: tokens.length || TOKENS_PER_PLAYER,
  };
}

function getPlayerStatus(
  player: EduLudoPlayer,
  isCurrentPlayer: boolean,
) {
  if (player.hasWon) return "Winner";
  if (isCurrentPlayer) return "Playing";
  if (player.isBot) return "Bot";
  return "Waiting";
}

export default function LudoPlayersPanel({
  players,
  currentPlayerId,
  currentTurn,
  cbtPoints,
  compact = false,
  showTokenProgress = true,
  onPlayerClick,
}: LudoPlayersPanelProps) {
  const activeIndex =
    typeof currentTurn === "number" &&
    currentTurn >= 0 &&
    currentTurn < players.length
      ? currentTurn
      : -1;

  return (
    <section
      aria-label="Game players"
      className="w-full space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Users size={18} />
          </div>

          <div className="min-w-0">
            <h2 className="font-bold text-slate-900">
              Players
            </h2>
            <p className="text-xs text-slate-500">
              {players.length}{" "}
              {players.length === 1 ? "player" : "players"} in this game
            </p>
          </div>
        </div>

        {typeof cbtPoints === "number" && (
          <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-800">
            <Zap size={14} className="fill-amber-400 text-amber-500" />
            {cbtPoints.toLocaleString()} CBT
          </div>
        )}
      </div>

      <div className={compact ? "space-y-2" : "grid grid-cols-1 gap-3 sm:grid-cols-2"}>
        {players.map((player, index) => {
          const isCurrentPlayer =
            currentPlayerId != null
              ? player.id === currentPlayerId
              : index === activeIndex;

          const styles = COLOR_STYLES[player.color];
          const progress = getTokenProgress(player);
          const status = getPlayerStatus(player, isCurrentPlayer);

          return (
            <button
              key={player.id}
              type="button"
              onClick={() => onPlayerClick?.(player)}
              disabled={!onPlayerClick}
              aria-current={isCurrentPlayer ? "true" : undefined}
              className={[
                "w-full rounded-2xl border p-3 text-left transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                onPlayerClick ? "cursor-pointer hover:shadow-md" : "cursor-default",
                isCurrentPlayer
                  ? "border-indigo-300 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-200"
                  : "border-slate-200 bg-white hover:border-slate-300",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div
                  className={[
                    "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    COLOR_DOT_STYLES[player.color],
                    player.color === "yellow" ? "text-slate-900" : "text-white",
                  ].join(" ")}
                >
                  {player.isBot ? (
                    <Users size={20} />
                  ) : (
                    <UserRound size={20} />
                  )}

                  {player.hasWon && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-amber-950">
                      <Crown size={11} />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {player.name}
                    </h3>

                    {isCurrentPlayer && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                        Your turn
                      </span>
                    )}

                    {player.hasWon && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        Winner
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    <span
                      className={[
                        "h-2 w-2 rounded-full",
                        COLOR_DOT_STYLES[player.color],
                      ].join(" ")}
                    />
                    <span>{styles.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{player.isBot ? "Computer" : "Human"}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-lg font-extrabold tabular-nums text-slate-900">
                    {(player.score ?? 0).toLocaleString()}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    Points
                  </p>
                </div>
              </div>

              {!compact && (
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 text-xs font-semibold",
                      player.hasWon
                        ? "text-amber-700"
                        : isCurrentPlayer
                          ? "text-indigo-700"
                          : "text-slate-500",
                    ].join(" ")}
                  >
                    {player.hasWon ? (
                      <Trophy size={13} />
                    ) : isCurrentPlayer ? (
                      <Target size={13} />
                    ) : (
                      <Circle size={12} />
                    )}

                    {status}
                  </span>

                  {showTokenProgress && (
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        {progress.home}/{progress.total} home
                      </span>
                    </div>
                  )}
                </div>
              )}

              {showTokenProgress && (
                <div className="mt-3">
                  <div
                    className="flex gap-1.5"
                    aria-label={`${progress.home} of ${progress.total} tokens home`}
                  >
                    {Array.from(
                      { length: progress.total },
                      (_, tokenIndex) => {
                        const tokenIsHome = tokenIndex < progress.home;
                        const tokenIsOnBoard =
                          tokenIndex >= progress.home &&
                          tokenIndex < progress.home + progress.onBoard;

                        return (
                          <span
                            key={tokenIndex}
                            title={
                              tokenIsHome
                                ? "Token home"
                                : tokenIsOnBoard
                                  ? "Token on board"
                                  : "Token in base"
                            }
                            className={[
                              "h-1.5 flex-1 rounded-full",
                              tokenIsHome
                                ? "bg-emerald-500"
                                : tokenIsOnBoard
                                  ? COLOR_DOT_STYLES[player.color]
                                  : "bg-slate-200",
                            ].join(" ")}
                          />
                        );
                      },
                    )}
                  </div>

                  {!compact && (
                    <p className="mt-1.5 text-[10px] text-slate-400">
                      {progress.onBoard} on board · {progress.inBase} in base
                    </p>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center">
          <Users
            size={28}
            className="mx-auto mb-2 text-slate-400"
          />
          <p className="text-sm font-semibold text-slate-600">
            No players yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Players will appear here when the game starts.
          </p>
        </div>
      )}
    </section>
  );
}
