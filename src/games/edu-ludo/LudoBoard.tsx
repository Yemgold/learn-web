



"use client";

import { Home, Shield, Star } from "lucide-react";

export type LudoColor = "red" | "green" | "yellow" | "blue";

export interface LudoToken {
  id: string;
  position: number;
  finished?: boolean;
}

export interface LudoBoardPlayer {
  id: string;
  name: string;
  color: LudoColor;
  tokens: LudoToken[];
}

export interface LudoBoardProps {
  players?: LudoBoardPlayer[];
  currentPlayerId?: string;
  selectedTokenId?: string | null;
  onTokenClick?: (playerId: string, tokenId: string) => void;
  disabled?: boolean;
}

const COLOR_STYLES: Record<
  LudoColor,
  {
    main: string;
    light: string;
    dark: string;
    text: string;
    border: string;
  }
> = {
  red: {
    main: "#ef4444",
    light: "#fee2e2",
    dark: "#991b1b",
    text: "text-red-700",
    border: "border-red-500",
  },
  green: {
    main: "#22c55e",
    light: "#dcfce7",
    dark: "#166534",
    text: "text-green-700",
    border: "border-green-500",
  },
  yellow: {
    main: "#eab308",
    light: "#fef9c3",
    dark: "#854d0e",
    text: "text-yellow-800",
    border: "border-yellow-500",
  },
  blue: {
    main: "#3b82f6",
    light: "#dbeafe",
    dark: "#1e40af",
    text: "text-blue-700",
    border: "border-blue-500",
  },
};

const DEFAULT_PLAYERS: LudoBoardPlayer[] = [
  {
    id: "red",
    name: "You",
    color: "red",
    tokens: Array.from({ length: 4 }, (_, i) => ({
      id: `red-${i + 1}`,
      position: -1,
    })),
  },
  {
    id: "green",
    name: "Green",
    color: "green",
    tokens: Array.from({ length: 4 }, (_, i) => ({
      id: `green-${i + 1}`,
      position: -1,
    })),
  },
  {
    id: "yellow",
    name: "Yellow",
    color: "yellow",
    tokens: Array.from({ length: 4 }, (_, i) => ({
      id: `yellow-${i + 1}`,
      position: -1,
    })),
  },
  {
    id: "blue",
    name: "Blue",
    color: "blue",
    tokens: Array.from({ length: 4 }, (_, i) => ({
      id: `blue-${i + 1}`,
      position: -1,
    })),
  },
];

/**
 * Board coordinates use a 15 × 15 grid.
 * Track positions 0–51 follow the outer Ludo path.
 * Positions 52–56 are the player's private home stretch.
 * Position 57 means the token has reached HOME.
 *
 * The game engine should use the same coordinate system when updating tokens.
 */
const TRACK: [number, number][] = [
  // Red entry and lower-left approach
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6],
  [0, 6], [0, 7], [0, 8],

  // Upper-left and green approach
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13],
  [6, 14], [7, 14], [8, 14],

  // Upper-right and blue approach
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8],
  [14, 8], [14, 7], [14, 6],

  // Lower-right and yellow approach
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1],
  [8, 0], [7, 0], [6, 0],
];

const SAFE_SQUARES = new Set([
  "6,1",
  "2,6",
  "8,13",
  "12,8",
  "1,8",
  "6,12",
  "13,6",
  "8,2",
]);

const HOME_STRETCHES: Record<LudoColor, [number, number][]> = {
  red: [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
  ],
  green: [
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
  ],
  blue: [
    [13, 7],
    [12, 7],
    [11, 7],
    [10, 7],
    [9, 7],
  ],
  yellow: [
    [7, 13],
    [7, 12],
    [7, 11],
    [7, 10],
    [7, 9],
  ],
};

function coordKey(row: number, col: number) {
  return `${row},${col}`;
}

function isInArray(
  coordinates: [number, number][],
  row: number,
  col: number,
) {
  return coordinates.some(([r, c]) => r === row && c === col);
}

function getTrackIndex(row: number, col: number) {
  return TRACK.findIndex(([r, c]) => r === row && c === col);
}

function getPlayerTokenCoordinate(
  player: LudoBoardPlayer,
  token: LudoToken,
  tokenIndex: number,
): [number, number] | null {
  if (token.finished || token.position === 57) {
    return null;
  }

  if (token.position < 0) {
    const homeSlots: Record<LudoColor, [number, number][]> = {
      red: [[2, 2], [2, 4], [4, 2], [4, 4]],
      green: [[2, 10], [2, 12], [4, 10], [4, 12]],
      yellow: [[10, 2], [10, 4], [12, 2], [12, 4]],
      blue: [[10, 10], [10, 12], [12, 10], [12, 12]],
    };

    return homeSlots[player.color][tokenIndex] ?? null;
  }

  if (token.position >= 52) {
    const homeIndex = token.position - 52;
    return HOME_STRETCHES[player.color][homeIndex] ?? null;
  }

  const startOffsets: Record<LudoColor, number> = {
    red: 0,
    green: 13,
    blue: 26,
    yellow: 39,
  };

  const globalIndex =
    (token.position + startOffsets[player.color]) % TRACK.length;

  return TRACK[globalIndex] ?? null;
}

function Token({
  player,
  token,
  tokenIndex,
  selected,
  disabled,
  onClick,
}: {
  player: LudoBoardPlayer;
  token: LudoToken;
  tokenIndex: number;
  selected: boolean;
  disabled: boolean;
  onClick?: () => void;
}) {
  const color = COLOR_STYLES[player.color];
  const canSelect = !disabled && Boolean(onClick);

  return (
    <button
      type="button"
      aria-label={`${player.name}, token ${tokenIndex + 1}`}
      title={`${player.name} — token ${tokenIndex + 1}`}
      disabled={!canSelect}
      onClick={onClick}
      className={`relative flex h-full w-full items-center justify-center rounded-full border-[3px] border-white shadow-md transition ${
        selected
          ? "z-20 scale-125 ring-4 ring-violet-500 ring-offset-1"
          : "hover:scale-110"
      } ${canSelect ? "cursor-pointer" : "cursor-default"}`}
      style={{
        backgroundColor: color.main,
        boxShadow: selected
          ? `0 0 0 3px white, 0 0 0 6px ${color.main}`
          : "0 2px 4px rgba(0,0,0,.18)",
      }}
    >
      <span className="text-[clamp(7px,1.6vw,13px)] font-black text-white">
        {tokenIndex + 1}
      </span>
    </button>
  );
}

function HomeBase({
  player,
  current,
  disabled,
  selectedTokenId,
  onTokenClick,
}: {
  player: LudoBoardPlayer;
  current: boolean;
  disabled: boolean;
  selectedTokenId?: string | null;
  onTokenClick?: (playerId: string, tokenId: string) => void;
}) {
  const color = COLOR_STYLES[player.color];

  return (
    <div
      className={`absolute flex flex-col items-center justify-center rounded-lg border-[3px] p-[5%] sm:rounded-xl sm:border-4 ${
        current ? "ring-2 ring-violet-500 ring-offset-1" : ""
      }`}
      style={{
        left:
          player.color === "red" || player.color === "yellow"
            ? "0%"
            : "60%",
        top:
          player.color === "red" || player.color === "green"
            ? "0%"
            : "60%",
        width: "40%",
        height: "40%",
        backgroundColor: color.light,
        borderColor: color.main,
      }}
    >
      <div
        className="mb-1 flex items-center gap-1 font-black sm:mb-2 sm:gap-2"
        style={{ color: color.dark }}
      >
        <span className="text-[clamp(6px,1.5vw,11px)]">
          {player.name.toUpperCase()}
        </span>
        {current && (
          <span className="rounded-full bg-white/80 px-1 py-0.5 text-[7px] sm:text-[9px]">
            TURN
          </span>
        )}
      </div>

      <div className="grid aspect-square w-[88%] grid-cols-2 grid-rows-2 gap-[10%] rounded-md bg-white/75 p-[10%] sm:rounded-lg">
        {player.tokens.slice(0, 4).map((token, index) => (
          <Token
            key={token.id}
            player={player}
            token={token}
            tokenIndex={index}
            selected={selectedTokenId === token.id}
            disabled={disabled || !current}
            onClick={() => onTokenClick?.(player.id, token.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function LudoBoard({
  players = DEFAULT_PLAYERS,
  currentPlayerId = "red",
  selectedTokenId = null,
  onTokenClick,
  disabled = false,
}: LudoBoardProps) {
  const orderedColors: LudoColor[] = ["red", "green", "yellow", "blue"];

  const boardPlayers = orderedColors.map(
    (color) =>
      players.find((player) => player.color === color) ??
      DEFAULT_PLAYERS.find((player) => player.color === color)!,
  );

  const currentPlayer = players.find(
    (player) => player.id === currentPlayerId,
  );

  const tokenPositions = new Map<
    string,
    { player: LudoBoardPlayer; token: LudoToken; index: number }[]
  >();

  players.forEach((player) => {
    player.tokens.forEach((token, index) => {
      const coordinate = getPlayerTokenCoordinate(player, token, index);
      if (!coordinate) return;

      const key = coordKey(coordinate[0], coordinate[1]);
      const existing = tokenPositions.get(key) ?? [];
      existing.push({ player, token, index });
      tokenPositions.set(key, existing);
    });
  });

  return (
    <div className="mx-auto w-full max-w-[620px]">
      <div className="rounded-2xl border border-slate-300 bg-slate-200 p-1 shadow-xl sm:rounded-3xl sm:p-2">
        <div
          className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-slate-400 bg-white sm:rounded-2xl"
          role="group"
          aria-label="Learnyfi Educational Ludo board"
        >
          {/* Four home bases */}
          {boardPlayers.map((player) => (
            <HomeBase
              key={player.id}
              player={player}
              current={player.id === currentPlayerId}
              disabled={disabled}
              selectedTokenId={selectedTokenId}
              onTokenClick={onTokenClick}
            />
          ))}

          {/* Track cells */}
          {Array.from({ length: 15 }, (_, row) =>
            Array.from({ length: 15 }, (_, col) => {
              const trackIndex = getTrackIndex(row, col);
              const isTrack = trackIndex !== -1;
              const isHomeStretch = orderedColors.some((color) =>
                isInArray(HOME_STRETCHES[color], row, col),
              );

              if (!isTrack && !isHomeStretch) return null;

              const key = coordKey(row, col);
              const occupants = tokenPositions.get(key) ?? [];
              const safe = SAFE_SQUARES.has(key);
              const homeColor = orderedColors.find((color) =>
                isInArray(HOME_STRETCHES[color], row, col),
              );

              const isStart =
                trackIndex === 0 ||
                trackIndex === 13 ||
                trackIndex === 26 ||
                trackIndex === 39;

              return (
                <div
                  key={key}
                  className="absolute flex items-center justify-center border border-slate-300"
                  style={{
                    left: `${(col / 15) * 100}%`,
                    top: `${(row / 15) * 100}%`,
                    width: `${100 / 15}%`,
                    height: `${100 / 15}%`,
                    backgroundColor: homeColor
                      ? COLOR_STYLES[homeColor].light
                      : "#ffffff",
                  }}
                >
                  {safe && (
                    <Shield
                      className="h-[55%] w-[55%] text-slate-400"
                      strokeWidth={1.8}
                    />
                  )}

                  {isStart && (
                    <Star
                      className="h-[65%] w-[65%]"
                      fill={COLOR_STYLES[
                        trackIndex === 0
                          ? "red"
                          : trackIndex === 13
                            ? "green"
                            : trackIndex === 26
                              ? "blue"
                              : "yellow"
                      ].main}
                      color="#ffffff"
                      strokeWidth={1.5}
                    />
                  )}

                  {occupants.length > 0 && (
                    <div className="absolute inset-[8%] z-10 flex flex-wrap items-center justify-center gap-[1px]">
                      {occupants.map(({ player, token, index }) => (
                        <div
                          key={token.id}
                          className="h-[44%] w-[44%]"
                          style={{ minWidth: "35%" }}
                        >
                          <Token
                            player={player}
                            token={token}
                            tokenIndex={index}
                            selected={selectedTokenId === token.id}
                            disabled={
                              disabled ||
                              player.id !== currentPlayerId
                            }
                            onClick={() =>
                              onTokenClick?.(player.id, token.id)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }),
          )}

          {/* Central finish triangle */}
          <div
            className="absolute z-10 flex items-center justify-center overflow-hidden"
            style={{
              left: `${(6 / 15) * 100}%`,
              top: `${(6 / 15) * 100}%`,
              width: `${(3 / 15) * 100}%`,
              height: `${(3 / 15) * 100}%`,
              background:
                "conic-gradient(from 45deg, #3b82f6 0deg 90deg, #22c55e 90deg 180deg, #ef4444 180deg 270deg, #eab308 270deg 360deg)",
              clipPath: "polygon(50% 50%, 0 0, 100% 0, 50% 50%, 100% 100%, 0 100%)",
            }}
          >
            <div className="flex h-8 w-8 flex-col items-center justify-center rounded-full border-2 border-white bg-slate-950/80 text-white shadow sm:h-12 sm:w-12">
              <Home size={16} />
              <span className="text-[6px] font-black sm:text-[8px]">
                HOME
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Player legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {boardPlayers.map((player) => {
          const color = COLOR_STYLES[player.color];
          const finished = player.tokens.filter(
            (token) => token.finished || token.position === 57,
          ).length;

          return (
            <div
              key={player.id}
              className={`rounded-xl border bg-white p-3 ${
                player.id === currentPlayerId
                  ? "border-violet-400 ring-1 ring-violet-400/30"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color.main }}
                />
                <span className="truncate text-xs font-bold text-slate-800">
                  {player.name}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                {finished}/4 tokens home
              </p>
            </div>
          );
        })}
      </div>

      {currentPlayer && (
        <p className="mt-3 text-center text-xs text-slate-500">
          Current turn:{" "}
          <span className="font-bold text-slate-700">
            {currentPlayer.name}
          </span>
        </p>
      )}
    </div>
  );
}
