
"use client";

import { useMemo } from "react";
import { Dice5, Flag, ShieldCheck, Sparkles } from "lucide-react";

import type {
  EduLudoColor,
  EduLudoCoordinate,
  EduLudoMove,
  EduLudoPlayer,
} from "./eduLudoTypes";

import {
  BOARD_SIZE,
  COLOR_STYLES,
  HOME_LANES,
  SAFE_POSITIONS,
  START_POSITIONS,
  TOKEN_BASES,
  TRACK_COORDINATES,
  TRACK_LENGTH,
} from "./eduLudoConstants";

interface LudoBoardProps {
  players: EduLudoPlayer[];
  currentPlayerId?: string | null;
  legalMoves?: EduLudoMove[];
  selectedTokenId?: number | null;
  diceValue?: number | null;
  disabled?: boolean;
  onTokenClick?: (player: EduLudoPlayer, tokenId: number) => void;
  onDiceClick?: () => void;
  showDice?: boolean;
  className?: string;
  movementCount?: number;
  isMoving?: boolean;
}

interface BoardToken {
  player: EduLudoPlayer;
  tokenId: number;
  coordinate: EduLudoCoordinate;
  isSelected: boolean;
  isLegal: boolean;
}

const GRID_CELLS = Array.from(
  { length: BOARD_SIZE * BOARD_SIZE },
  (_, index) => ({
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  }),
);

const TOKEN_GLOSS: Record<EduLudoColor, string> = {
  red: "from-red-300 via-red-600 to-red-900",
  green: "from-green-300 via-green-600 to-green-900",
  blue: "from-blue-300 via-blue-600 to-blue-900",
  yellow: "from-yellow-200 via-yellow-400 to-amber-600",
};

const TOKEN_RIM: Record<EduLudoColor, string> = {
  red: "ring-red-950/20",
  green: "ring-green-950/20",
  blue: "ring-blue-950/20",
  yellow: "ring-amber-950/25",
};

const BASE_SURFACE: Record<EduLudoColor, string> = {
  red: "from-red-100 via-red-200 to-red-300",
  green: "from-green-100 via-green-200 to-green-300",
  blue: "from-blue-100 via-blue-200 to-blue-300",
  yellow: "from-yellow-100 via-yellow-200 to-amber-300",
};

function getGlobalPosition(
  color: EduLudoColor,
  localPosition: number,
) {
  return (localPosition + START_POSITIONS[color]) % TRACK_LENGTH;
}

function getTokenCoordinate(
  player: EduLudoPlayer,
  tokenId: number,
): EduLudoCoordinate | null {
  const token = player.tokens?.find((item) => item.id === tokenId);

  if (!token) return null;

  if (token.status === "home" || token.position >= 57) {
    return HOME_LANES[player.color][5] ?? null;
  }

  if (token.position < 0 || token.status === "base") {
    return TOKEN_BASES[player.color][tokenId] ?? null;
  }

  if (token.position >= TRACK_LENGTH) {
    const index = Math.min(
      token.position - TRACK_LENGTH,
      HOME_LANES[player.color].length - 1,
    );

    return HOME_LANES[player.color][index] ?? null;
  }

  return (
    TRACK_COORDINATES[
      getGlobalPosition(player.color, token.position)
    ] ?? null
  );
}

function getCellType(row: number, col: number) {
  if (row <= 5 && col <= 5) return "red-base";
  if (row <= 5 && col >= 9) return "green-base";
  if (row >= 9 && col <= 5) return "blue-base";
  if (row >= 9 && col >= 9) return "yellow-base";
  return "track";
}

function isHomeLaneCell(
  row: number,
  col: number,
  color: EduLudoColor,
) {
  return HOME_LANES[color].some(
    (coordinate) => coordinate.row === row && coordinate.col === col,
  );
}

function getCellBackground(
  row: number,
  col: number,
  trackIndex: number,
) {
  if (isHomeLaneCell(row, col, "red")) {
    return "bg-gradient-to-br from-red-100 via-red-200 to-red-300 border-red-300";
  }

  if (isHomeLaneCell(row, col, "green")) {
    return "bg-gradient-to-br from-green-100 via-green-200 to-green-300 border-green-300";
  }

  if (isHomeLaneCell(row, col, "yellow")) {
    return "bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 border-yellow-300";
  }

  if (isHomeLaneCell(row, col, "blue")) {
    return "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 border-blue-300";
  }

  if (trackIndex >= 0) {
    return SAFE_POSITIONS.has(trackIndex)
      ? "bg-gradient-to-br from-amber-50 via-amber-100 to-amber-200 border-amber-300"
      : "bg-gradient-to-br from-white via-slate-50 to-slate-200 border-slate-200";
  }

  return "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 border-slate-200";
}

function getTokenLabel(player: EduLudoPlayer, tokenId: number) {
  return `${player.name}, token ${tokenId + 1}`;
}

function getPlayerBaseColor(cellType: string): EduLudoColor | null {
  if (cellType === "red-base") return "red";
  if (cellType === "green-base") return "green";
  if (cellType === "blue-base") return "blue";
  if (cellType === "yellow-base") return "yellow";
  return null;
}

export default function LudoBoard({
  players,
  currentPlayerId,
  legalMoves = [],
  selectedTokenId = null,
  diceValue = null,
  disabled = false,
  onTokenClick,
  onDiceClick,
  showDice = true,
  className = "",
  movementCount,
  isMoving = false,
}: LudoBoardProps) {
  const tokenCoordinates = useMemo(() => {
    const result: BoardToken[] = [];

    for (const player of players) {
      for (const token of player.tokens ?? []) {
        const coordinate = getTokenCoordinate(player, token.id);
        if (!coordinate) continue;

        const isLegal = legalMoves.some(
          (move) =>
            move.playerId === player.id && move.tokenId === token.id,
        );

        result.push({
          player,
          tokenId: token.id,
          coordinate,
          isSelected:
            player.id === currentPlayerId &&
            selectedTokenId === token.id,
          isLegal: isLegal && player.id === currentPlayerId,
        });
      }
    }

    return result;
  }, [players, legalMoves, currentPlayerId, selectedTokenId]);

  const currentPlayer = players.find(
    (player) => player.id === currentPlayerId,
  );

  const tokensAtCoordinate = (row: number, col: number) =>
    tokenCoordinates.filter(
      (token) =>
        token.coordinate.row === row && token.coordinate.col === col,
    );

  const trackPositionAt = (row: number, col: number) =>
    TRACK_COORDINATES.findIndex(
      (coordinate) => coordinate.row === row && coordinate.col === col,
    );

  return (
    <section
      className={`w-full ${className}`}
      aria-label="Educational Ludo board"
    >
      <div className="mx-auto w-full max-w-[620px]">
        {/* Board heading */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-300 bg-gradient-to-br from-indigo-100 to-indigo-300 text-indigo-800 shadow-[0_3px_0_#a5b4fc,0_5px_10px_rgba(30,41,59,0.12)]">
              <Flag size={19} />
            </div>

            <div>
              <h2 className="text-sm font-extrabold text-slate-900 sm:text-base">
                Ludo Board
              </h2>
              <p className="text-xs text-slate-500">
                Your 3D-style learning arena
              </p>
            </div>
          </div>

          {currentPlayer && (
            <div className="flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-1.5 shadow-md">
              <span
                className={`h-3 w-3 rounded-full ring-2 ring-white shadow ${COLOR_STYLES[currentPlayer.color].bg}`}
              />
              <span className="text-xs font-bold text-slate-700">
                {currentPlayer.name}&apos;s turn
              </span>
            </div>
          )}
        </div>

        {/* Raised board frame */}
        <div className="relative rounded-[22px] bg-gradient-to-br from-slate-500 via-slate-700 to-slate-950 p-[5px] shadow-[0_5px_0_#334155,0_10px_0_#1e293b,0_18px_28px_rgba(15,23,42,0.28)] sm:rounded-[28px] sm:p-2">
          <div className="rounded-[18px] bg-gradient-to-br from-white via-slate-100 to-slate-300 p-1.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(15,23,42,0.18)] sm:rounded-[22px] sm:p-2">
            <div
              className="grid aspect-square w-full overflow-hidden rounded-xl border-2 border-slate-400 bg-slate-300 shadow-[inset_0_3px_7px_rgba(15,23,42,0.24)] sm:rounded-2xl"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {GRID_CELLS.map(({ row, col }) => {
                const trackIndex = trackPositionAt(row, col);
                const cellType = getCellType(row, col);
                const isSafe = SAFE_POSITIONS.has(trackIndex);
                const cellTokens = tokensAtCoordinate(row, col);

                const isCenter =
                  row >= 6 && row <= 8 && col >= 6 && col <= 8;

                if (isCenter) {
                  const isCenterMiddle = row === 7 && col === 7;

                  return (
                    <div
                      key={`${row}-${col}`}
                      className={[
                        "relative flex items-center justify-center border border-slate-300",
                        isCenterMiddle
                          ? "bg-gradient-to-br from-indigo-500 via-indigo-700 to-violet-950 shadow-[inset_0_2px_5px_rgba(255,255,255,0.25),inset_0_-3px_5px_rgba(15,23,42,0.4)]"
                          : "bg-gradient-to-br from-slate-100 to-slate-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-2px_2px_rgba(15,23,42,0.1)]",
                      ].join(" ")}
                    >
                      {isCenterMiddle && (
                        <div className="flex flex-col items-center justify-center text-white drop-shadow-md">
                          <Sparkles size={15} className="sm:h-5 sm:w-5" />
                          <span className="mt-0.5 text-[6px] font-black tracking-wide sm:text-[9px]">
                            LEARNYFI
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }

                const baseColor = getPlayerBaseColor(cellType);

                const isBaseCenter =
                  baseColor !== null &&
                  (row === 2 || row === 3) &&
                  (col === 2 ||
                    col === 3 ||
                    col === 11 ||
                    col === 12);

                return (
                  <div
                    key={`${row}-${col}`}
                    className={[
                      "relative flex min-h-0 min-w-0 items-center justify-center border",
                      getCellBackground(row, col, trackIndex),
                      "shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),inset_0_-1px_2px_rgba(15,23,42,0.10)]",
                    ].join(" ")}
                  >
                    {/* Softly raised player bases */}
                    {baseColor && isBaseCenter && (
                      <div
                        className={[
                          "absolute inset-[8%] rounded-md border border-white/80 bg-gradient-to-br shadow-[inset_0_2px_3px_rgba(255,255,255,0.7),0_2px_3px_rgba(15,23,42,0.12)]",
                          BASE_SURFACE[baseColor],
                        ].join(" ")}
                      />
                    )}

                    {/* Safe-square badge */}
                    {isSafe && (
                      <ShieldCheck
                        size={9}
                        className="absolute right-0 top-0 z-0 text-amber-700/80 drop-shadow-sm sm:h-3 sm:w-3"
                      />
                    )}

                    {/* Tokens retain the original board coordinates */}
                    {cellTokens.length > 0 && (
                      <div className="relative z-10 flex h-full w-full flex-wrap items-center justify-center gap-[1px] p-[1px]">
                        {cellTokens.map((token) => {
                          const clickable =
                            !disabled &&
                            token.player.id === currentPlayerId &&
                            token.isLegal &&
                            Boolean(onTokenClick);

                          return (
                            <button
                              key={`${token.player.id}-${token.tokenId}`}
                              type="button"
                              title={getTokenLabel(token.player, token.tokenId)}
                              aria-label={getTokenLabel(token.player, token.tokenId)}
                              disabled={!clickable}
                              onClick={() =>
                                onTokenClick?.(token.player, token.tokenId)
                              }
                              className={[
                                "group relative flex aspect-square max-h-full max-w-full items-center justify-center rounded-full border border-white/90 bg-gradient-to-br shadow-[0_2px_0_rgba(15,23,42,0.35),0_3px_5px_rgba(15,23,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.85)] ring-1 transition-transform duration-150 ease-out",
                                TOKEN_GLOSS[token.player.color],
                                TOKEN_RIM[token.player.color],
                                clickable
                                  ? "cursor-pointer ring-emerald-400 hover:z-30 hover:-translate-y-1 hover:scale-125 hover:shadow-[0_5px_0_rgba(15,23,42,0.28),0_8px_10px_rgba(15,23,42,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                                  : "cursor-default",
                                token.isSelected
                                  ? "z-20 -translate-y-1 scale-125 ring-2 ring-indigo-600 ring-offset-1"
                                  : "",
                                cellTokens.length > 1 ? "w-[43%]" : "w-[82%]",
                              ].join(" ")}
                            >
                              {/* Gloss highlight */}
                              <span className="pointer-events-none absolute left-[17%] top-[10%] h-[30%] w-[46%] rounded-full bg-white/60 blur-[0.5px]" />

                              {/* Token number */}
                              <span
                                className={[
                                  "relative z-10 text-[6px] font-black leading-none drop-shadow-sm sm:text-[9px]",
                                  token.player.color === "yellow"
                                    ? "text-amber-950"
                                    : "text-white",
                                ].join(" ")}
                              >
                                {token.tokenId + 1}
                              </span>

                              {/* Selected token highlight */}
                              {token.isSelected && (
                                <span className="pointer-events-none absolute -inset-1 rounded-full border-2 border-white/90" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Raised dice and movement panel */}
        {showDice && (
          <div className="mt-5 rounded-2xl border border-indigo-200 bg-gradient-to-br from-white via-indigo-50 to-violet-100 p-3 shadow-[0_4px_0_#c7d2fe,0_8px_15px_rgba(30,41,59,0.10)] sm:p-4">
            <div className="flex items-center gap-3">
              {/* 3D-style dice */}
              <div
                className={[
                  "relative flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-2xl border-2 bg-gradient-to-br from-white via-white to-slate-200 shadow-[0_4px_0_#94a3b8,0_7px_10px_rgba(15,23,42,0.2),inset_0_2px_3px_white] transition-transform duration-300 sm:h-20 sm:w-20",
                  currentPlayer
                    ? COLOR_STYLES[currentPlayer.color].border
                    : "border-indigo-200",
                  isMoving ? "animate-pulse" : "",
                ].join(" ")}
                aria-label={
                  diceValue == null
                    ? "Dice has not been rolled"
                    : `Dice result ${diceValue}`
                }
              >
                <span className="absolute left-2 top-1 h-3 w-6 rounded-full bg-white/90 blur-[1px]" />

                {diceValue != null ? (
                  <span className="relative text-4xl font-black tabular-nums text-indigo-700 drop-shadow-[0_2px_0_rgba(99,102,241,0.25)] sm:text-5xl">
                    {diceValue}
                  </span>
                ) : (
                  <Dice5
                    size={35}
                    className="relative text-indigo-600 drop-shadow-sm"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 sm:text-xs">
                  {isMoving ? "Movement in progress" : "Dice result"}
                </p>

                <p className="mt-1 text-base font-black text-slate-900 sm:text-xl">
                  {diceValue == null
                    ? "Ready to roll"
                    : isMoving
                      ? `Counting ${movementCount ?? 0} of ${diceValue}`
                      : `You rolled ${diceValue}`}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  {isMoving
                    ? "Watch your token move one square at a time."
                    : diceValue != null
                      ? "Your dice result stays visible throughout your turn."
                      : "Roll the dice to receive your question."}
                </p>

                {isMoving && (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-indigo-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-200"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            ((movementCount ?? 0) / Math.max(1, diceValue ?? 1)) *
                              100,
                          ),
                        )}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {diceValue == null && onDiceClick && (
                <button
                  type="button"
                  onClick={onDiceClick}
                  disabled={disabled || isMoving}
                  aria-label="Roll dice"
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-indigo-500 via-indigo-600 to-indigo-800 px-3 py-3 text-sm font-extrabold text-white shadow-[0_4px_0_#312e81,0_6px_8px_rgba(49,46,129,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_5px_0_#312e81,0_8px_10px_rgba(49,46,129,0.2)] active:translate-y-1 active:shadow-[0_1px_0_#312e81] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
                >
                  <Dice5 size={19} />
                  <span className="hidden min-[380px]:inline">Roll Dice</span>
                  <span className="min-[380px]:hidden">Roll</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Board legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-300 shadow-sm" />
            Safe square
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border border-emerald-200 bg-gradient-to-br from-emerald-300 to-emerald-700 shadow-sm" />
            Selectable token
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border border-slate-300 bg-gradient-to-br from-slate-200 to-slate-500 shadow-sm" />
            Token in base
          </span>
        </div>
      </div>
    </section>
  );
}












// "use client";

// import { useMemo } from "react";
// import { Dice5, Flag, ShieldCheck, Sparkles } from "lucide-react";

// import type {
//   EduLudoColor,
//   EduLudoCoordinate,
//   EduLudoMove,
//   EduLudoPlayer,
// } from "./eduLudoTypes";

// import {
//   BOARD_SIZE,
//   COLOR_STYLES,
//   HOME_LANES,
//   SAFE_POSITIONS,
//   START_POSITIONS,
//   TOKEN_BASES,
//   TRACK_COORDINATES,
//   TRACK_LENGTH,
// } from "./eduLudoConstants";

// interface LudoBoardProps {
//   players: EduLudoPlayer[];
//   currentPlayerId?: string | null;
//   legalMoves?: EduLudoMove[];
//   selectedTokenId?: number | null;
//   diceValue?: number | null;
//   disabled?: boolean;
//   onTokenClick?: (player: EduLudoPlayer, tokenId: number) => void;
//   onDiceClick?: () => void;
//   showDice?: boolean;
//   className?: string;
//   movementCount?: number;
//   isMoving?: boolean;
// }

// interface BoardToken {
//   player: EduLudoPlayer;
//   tokenId: number;
//   coordinate: EduLudoCoordinate;
//   isSelected: boolean;
//   isLegal: boolean;
// }

// const GRID_CELLS = Array.from(
//   { length: BOARD_SIZE * BOARD_SIZE },
//   (_, index) => ({
//     row: Math.floor(index / BOARD_SIZE),
//     col: index % BOARD_SIZE,
//   }),
// );

// function getGlobalPosition(
//   color: EduLudoColor,
//   localPosition: number,
// ) {
//   return (localPosition + START_POSITIONS[color]) % TRACK_LENGTH;
// }

// function getTokenCoordinate(
//   player: EduLudoPlayer,
//   tokenId: number,
// ): EduLudoCoordinate | null {
//   const token = player.tokens?.find((item) => item.id === tokenId);

//   if (!token) return null;

//   if (token.status === "home" || token.position >= 57) {
//     return HOME_LANES[player.color][5] ?? null;
//   }

//   if (token.position < 0 || token.status === "base") {
//     return TOKEN_BASES[player.color][tokenId] ?? null;
//   }

//   if (token.position >= TRACK_LENGTH) {
//     const index = Math.min(
//       token.position - TRACK_LENGTH,
//       HOME_LANES[player.color].length - 1,
//     );

//     return HOME_LANES[player.color][index] ?? null;
//   }

//   return (
//     TRACK_COORDINATES[
//       getGlobalPosition(player.color, token.position)
//     ] ?? null
//   );
// }

// function getCellType(row: number, col: number) {
//   if (row <= 5 && col <= 5) return "red-base";
//   if (row <= 5 && col >= 9) return "green-base";
//   if (row >= 9 && col <= 5) return "blue-base";
//   if (row >= 9 && col >= 9) return "yellow-base";
//   return "track";
// }

// function isHomeLaneCell(
//   row: number,
//   col: number,
//   color: EduLudoColor,
// ) {
//   return HOME_LANES[color].some(
//     (coordinate) => coordinate.row === row && coordinate.col === col,
//   );
// }

// function getCellBackground(
//   row: number,
//   col: number,
//   trackIndex: number,
// ) {
//   if (isHomeLaneCell(row, col, "red")) {
//     return "bg-red-200 border-red-300";
//   }

//   if (isHomeLaneCell(row, col, "green")) {
//     return "bg-green-200 border-green-300";
//   }

//   if (isHomeLaneCell(row, col, "yellow")) {
//     return "bg-yellow-200 border-yellow-300";
//   }

//   if (isHomeLaneCell(row, col, "blue")) {
//     return "bg-blue-200 border-blue-300";
//   }

//   if (trackIndex >= 0) {
//     return SAFE_POSITIONS.has(trackIndex)
//       ? "bg-amber-100 border-amber-300"
//       : "bg-white border-slate-200";
//   }

//   return "bg-slate-50 border-slate-100";
// }

// function getTokenLabel(player: EduLudoPlayer, tokenId: number) {
//   return `${player.name}, token ${tokenId + 1}`;
// }

// export default function LudoBoard({
//   players,
//   currentPlayerId,
//   legalMoves = [],
//   selectedTokenId = null,
//   diceValue = null,
//   disabled = false,
//   onTokenClick,
//   onDiceClick,
//   showDice = true,
//   className = "",
//   movementCount,
//   isMoving = false,
// }: LudoBoardProps) {
//   const tokenCoordinates = useMemo(() => {
//     const result: BoardToken[] = [];

//     for (const player of players) {
//       for (const token of player.tokens ?? []) {
//         const coordinate = getTokenCoordinate(player, token.id);
//         if (!coordinate) continue;

//         const isLegal = legalMoves.some(
//           (move) =>
//             move.playerId === player.id && move.tokenId === token.id,
//         );

//         result.push({
//           player,
//           tokenId: token.id,
//           coordinate,
//           isSelected:
//             player.id === currentPlayerId &&
//             selectedTokenId === token.id,
//           isLegal: isLegal && player.id === currentPlayerId,
//         });
//       }
//     }

//     return result;
//   }, [players, legalMoves, currentPlayerId, selectedTokenId]);

//   const currentPlayer = players.find(
//     (player) => player.id === currentPlayerId,
//   );

//   const tokensAtCoordinate = (row: number, col: number) =>
//     tokenCoordinates.filter(
//       (token) =>
//         token.coordinate.row === row && token.coordinate.col === col,
//     );

//   const trackPositionAt = (row: number, col: number) =>
//     TRACK_COORDINATES.findIndex(
//       (coordinate) => coordinate.row === row && coordinate.col === col,
//     );

//   return (
//     <section
//       className={`w-full ${className}`}
//       aria-label="Educational Ludo board"
//     >
//       <div className="mx-auto w-full max-w-[620px]">
//         <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
//           <div className="flex items-center gap-2">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
//               <Flag size={18} />
//             </div>

//             <div>
//               <h2 className="text-sm font-extrabold text-slate-900 sm:text-base">
//                 Ludo Board
//               </h2>
//               <p className="text-xs text-slate-500">
//                 Count each square as your token moves
//               </p>
//             </div>
//           </div>

//           {currentPlayer && (
//             <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
//               <span
//                 className={`h-2.5 w-2.5 rounded-full ${
//                   COLOR_STYLES[currentPlayer.color].bg
//                 }`}
//               />
//               <span className="text-xs font-bold text-slate-700">
//                 {currentPlayer.name}&apos;s turn
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
//           <div
//             className="grid aspect-square w-full overflow-hidden rounded-xl border-2 border-slate-300"
//             style={{
//               gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
//               gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
//             }}
//           >
//             {GRID_CELLS.map(({ row, col }) => {
//               const trackIndex = trackPositionAt(row, col);
//               const cellType = getCellType(row, col);
//               const isSafe = SAFE_POSITIONS.has(trackIndex);
//               const cellTokens = tokensAtCoordinate(row, col);

//               const isCenter =
//                 row >= 6 && row <= 8 && col >= 6 && col <= 8;

//               if (isCenter) {
//                 const isCenterMiddle = row === 7 && col === 7;

//                 return (
//                   <div
//                     key={`${row}-${col}`}
//                     className={[
//                       "relative flex items-center justify-center border border-slate-200",
//                       isCenterMiddle ? "bg-indigo-600" : "bg-slate-100",
//                     ].join(" ")}
//                   >
//                     {isCenterMiddle && (
//                       <div className="flex flex-col items-center justify-center text-white">
//                         <Sparkles size={16} />
//                         <span className="text-[7px] font-black sm:text-[9px]">
//                           LEARNYFI
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 );
//               }

//               const baseColor =
//                 cellType === "red-base"
//                   ? "red"
//                   : cellType === "green-base"
//                     ? "green"
//                     : cellType === "blue-base"
//                       ? "blue"
//                       : cellType === "yellow-base"
//                         ? "yellow"
//                         : null;

//               const isBaseCenter =
//                 baseColor !== null &&
//                 (row === 2 || row === 3) &&
//                 (col === 2 ||
//                   col === 3 ||
//                   col === 11 ||
//                   col === 12);

//               return (
//                 <div
//                   key={`${row}-${col}`}
//                   className={[
//                     "relative flex min-h-0 min-w-0 items-center justify-center border",
//                     getCellBackground(row, col, trackIndex),
//                     baseColor ? "border-slate-200" : "",
//                   ].join(" ")}
//                 >
//                   {baseColor && isBaseCenter && (
//                     <div
//                       className={[
//                         "absolute inset-[8%] rounded-sm opacity-20",
//                         COLOR_STYLES[baseColor].bg,
//                       ].join(" ")}
//                     />
//                   )}

//                   {isSafe && (
//                     <ShieldCheck
//                       size={9}
//                       className="absolute right-0 top-0 z-0 text-amber-600/70 sm:h-3 sm:w-3"
//                     />
//                   )}

//                   {cellTokens.length > 0 && (
//                     <div className="relative z-10 flex h-full w-full flex-wrap items-center justify-center gap-[1px] p-[1px]">
//                       {cellTokens.map((token) => {
//                         const clickable =
//                           !disabled &&
//                           token.player.id === currentPlayerId &&
//                           token.isLegal &&
//                           Boolean(onTokenClick);

//                         return (
//                           <button
//                             key={`${token.player.id}-${token.tokenId}`}
//                             type="button"
//                             title={getTokenLabel(token.player, token.tokenId)}
//                             aria-label={getTokenLabel(token.player, token.tokenId)}
//                             disabled={!clickable}
//                             onClick={() =>
//                               onTokenClick?.(token.player, token.tokenId)
//                             }
//                             className={[
//                               "relative flex aspect-square max-h-full max-w-full items-center justify-center rounded-full border border-white/90 shadow-sm transition-all duration-150",
//                               COLOR_STYLES[token.player.color].bg,
//                               token.player.color === "yellow"
//                                 ? "text-slate-900"
//                                 : "text-white",
//                               clickable
//                                 ? "cursor-pointer ring-2 ring-emerald-400 ring-offset-1 hover:scale-125"
//                                 : "cursor-default",
//                               token.isSelected
//                                 ? "z-20 scale-125 ring-2 ring-indigo-600 ring-offset-2"
//                                 : "",
//                               cellTokens.length > 1 ? "w-[43%]" : "w-[82%]",
//                             ].join(" ")}
//                           >
//                             <span className="text-[6px] font-black leading-none sm:text-[9px]">
//                               {token.tokenId + 1}
//                             </span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {showDice && (
//             <div className="mt-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-3 sm:p-4">
//               <div className="flex items-center gap-3">
//                 <div
//                   className={[
//                     "flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl border-2 bg-white shadow-md sm:h-20 sm:w-20",
//                     currentPlayer
//                       ? COLOR_STYLES[currentPlayer.color].border
//                       : "border-indigo-200",
//                     isMoving ? "animate-pulse" : "",
//                   ].join(" ")}
//                   aria-label={
//                     diceValue == null
//                       ? "Dice has not been rolled"
//                       : `Dice result ${diceValue}`
//                   }
//                 >
//                   {diceValue != null ? (
//                     <span className="text-4xl font-black tabular-nums text-indigo-700 sm:text-5xl">
//                       {diceValue}
//                     </span>
//                   ) : (
//                     <Dice5 size={35} className="text-indigo-500" />
//                   )}
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
//                     {isMoving ? "Movement in progress" : "Dice result"}
//                   </p>

//                   <p className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
//                     {diceValue == null
//                       ? "Ready to roll"
//                       : isMoving
//                         ? `Counting ${movementCount ?? 0} of ${diceValue}`
//                         : `You rolled ${diceValue}`}
//                   </p>

//                   <p className="mt-1 text-xs leading-5 text-slate-600">
//                     {isMoving
//                       ? "Watch your token move one square at a time."
//                       : diceValue != null
//                         ? "The number stays visible throughout your turn."
//                         : "Roll the dice to receive your question."}
//                   </p>
//                 </div>

//                 {isMoving && (
//                   <div className="hidden shrink-0 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-black text-white sm:block">
//                     {movementCount ?? 0}/{diceValue}
//                   </div>
//                 )}

                
                
// {showDice && diceValue == null && onDiceClick && (
//   <button
//     type="button"
//     onClick={onDiceClick}
//     disabled={disabled || isMoving}
//     aria-label="Roll dice"
//     className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
//   >
//     <Dice5 size={19} />
//     Roll Dice
//   </button>
// )}



//               </div>
//             </div>
//           )}
//         </div>

//         <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
//           <span className="inline-flex items-center gap-1.5">
//             <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
//             Safe square
//           </span>

//           <span className="inline-flex items-center gap-1.5">
//             <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
//             Selectable token
//           </span>

//           <span className="inline-flex items-center gap-1.5">
//             <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
//             Token in base
//           </span>
//         </div>
//       </div>
//     </section>
//   );
// }
