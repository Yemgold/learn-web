






// C:\Users\Lara Spellman\Jamb\jamb-league\src\components\flashcards\simulations\MotionSimulation.tsx

"use client";

import {
  Pause,
  Play,
  RotateCcw,
  Gauge,
  Timer,
  MoveRight,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface MotionSimulationProps {
  initialVelocity?: number;
  initialAcceleration?: number;
  initialTime?: number;
  maxTime?: number;
  className?: string;
}

interface GraphPoint {
  time: number;
  velocity: number;
}

const DEFAULT_VELOCITY = 0;
const DEFAULT_ACCELERATION = 2;
const DEFAULT_TIME = 5;
const DEFAULT_MAX_TIME = 10;

const TIME_STEP = 0.05;
const ANIMATION_INTERVAL = 50;

function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2).replace(/\.?0+$/, "");
}

export default function MotionSimulation({
  initialVelocity = DEFAULT_VELOCITY,
  initialAcceleration = DEFAULT_ACCELERATION,
  initialTime = DEFAULT_TIME,
  maxTime = DEFAULT_MAX_TIME,
  className = "",
}: MotionSimulationProps) {
  const safeMaxTime = Math.max(
    maxTime,
    1
  );

  const safeInitialTime = clamp(
    initialTime,
    0,
    safeMaxTime
  );

  const [initialVelocityValue, setInitialVelocityValue] =
    useState(initialVelocity);

  const [acceleration, setAcceleration] =
    useState(initialAcceleration);

  const [time, setTime] =
    useState(safeInitialTime);

  const [isRunning, setIsRunning] =
    useState(false);

  const [graphPoints, setGraphPoints] =
    useState<GraphPoint[]>([]);

  const animationRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null
    );

  /* ================================================================
     PHYSICS CALCULATIONS
     ================================================================ */

  const velocity = useMemo(() => {
    return (
      initialVelocityValue +
      acceleration * time
    );
  }, [
    initialVelocityValue,
    acceleration,
    time,
  ]);

  const displacement = useMemo(() => {
    return (
      initialVelocityValue * time +
      0.5 * acceleration * time * time
    );
  }, [
    initialVelocityValue,
    acceleration,
    time,
  ]);

  const averageVelocity = useMemo(() => {
    if (time <= 0) {
      return initialVelocityValue;
    }

    return displacement / time;
  }, [
    displacement,
    initialVelocityValue,
    time,
  ]);

  /* ================================================================
     GRAPH
     ================================================================ */

  const rebuildGraph = useCallback(
    (currentTime: number) => {
      const points: GraphPoint[] = [];

      const numberOfPoints = Math.max(
        2,
        Math.ceil(
          currentTime / TIME_STEP
        )
      );

      for (
        let index = 0;
        index <= numberOfPoints;
        index += 1
      ) {
        const pointTime = Math.min(
          index * TIME_STEP,
          currentTime
        );

        points.push({
          time: pointTime,
          velocity:
            initialVelocityValue +
            acceleration * pointTime,
        });
      }

      setGraphPoints(points);
    },
    [
      initialVelocityValue,
      acceleration,
    ]
  );

  /* ================================================================
     INITIAL GRAPH
     ================================================================ */

  useEffect(() => {
    rebuildGraph(time);
  }, [
    initialVelocityValue,
    acceleration,
    time,
    rebuildGraph,
  ]);

  /* ================================================================
     PLAY / PAUSE
     ================================================================ */

  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }

      return;
    }

    animationRef.current =
      setInterval(() => {
        setTime((previousTime) => {
          const nextTime =
            previousTime + TIME_STEP;

          if (nextTime >= safeMaxTime) {
            setIsRunning(false);

            return safeMaxTime;
          }

          return nextTime;
        });
      }, ANIMATION_INTERVAL);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isRunning, safeMaxTime]);

  /* ================================================================
     PLAY
     ================================================================ */

  const handlePlay = useCallback(() => {
    if (time >= safeMaxTime) {
      setTime(0);
    }

    setIsRunning(true);
  }, [time, safeMaxTime]);

  /* ================================================================
     PAUSE
     ================================================================ */

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  /* ================================================================
     RESET
     ================================================================ */

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
  }, []);

  /* ================================================================
     VELOCITY SLIDER
     ================================================================ */

  const handleVelocityChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setInitialVelocityValue(
        Number(event.target.value)
      );
      setTime(0);
      setIsRunning(false);
    },
    []
  );

  /* ================================================================
     ACCELERATION SLIDER
     ================================================================ */

  const handleAccelerationChange =
    useCallback(
      (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        setAcceleration(
          Number(event.target.value)
        );
        setTime(0);
        setIsRunning(false);
      },
      []
    );

  /* ================================================================
     TIME SLIDER
     ================================================================ */

  const handleTimeChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setIsRunning(false);

      setTime(
        clamp(
          Number(event.target.value),
          0,
          safeMaxTime
        )
      );
    },
    [safeMaxTime]
  );

  /* ================================================================
     GRAPH DIMENSIONS
     ================================================================ */

  const graphWidth = 320;
  const graphHeight = 140;

  const graphPaddingLeft = 38;
  const graphPaddingBottom = 25;
  const graphPaddingTop = 15;
  const graphPaddingRight = 15;

  const graphInnerWidth =
    graphWidth -
    graphPaddingLeft -
    graphPaddingRight;

  const graphInnerHeight =
    graphHeight -
    graphPaddingTop -
    graphPaddingBottom;

  const maxVelocity = useMemo(() => {
    const candidates = [
      initialVelocityValue,
      velocity,
      initialVelocityValue +
        acceleration * safeMaxTime,
      0,
    ];

    const highest = Math.max(
      ...candidates
    );

    return Math.max(
      Math.abs(highest),
      1
    );
  }, [
    initialVelocityValue,
    velocity,
    acceleration,
    safeMaxTime,
  ]);

  const minVelocity = useMemo(() => {
    const candidates = [
      initialVelocityValue,
      velocity,
      initialVelocityValue +
        acceleration * safeMaxTime,
      0,
    ];

    const lowest = Math.min(
      ...candidates
    );

    return Math.min(
      lowest,
      0
    );
  }, [
    initialVelocityValue,
    velocity,
    acceleration,
    safeMaxTime,
  ]);

  const velocityRange =
    Math.max(
      maxVelocity - minVelocity,
      1
    );

  const graphPath = useMemo(() => {
    if (graphPoints.length === 0) {
      return "";
    }

    return graphPoints
      .map((point, index) => {
        const x =
          graphPaddingLeft +
          (point.time /
            safeMaxTime) *
            graphInnerWidth;

        const y =
          graphPaddingTop +
          ((maxVelocity -
            point.velocity) /
            velocityRange) *
            graphInnerHeight;

        return `${index === 0 ? "M" : "L"} ${x.toFixed(
          2
        )} ${y.toFixed(2)}`;
      })
      .join(" ");
  }, [
    graphPoints,
    safeMaxTime,
    graphInnerWidth,
    graphInnerHeight,
    maxVelocity,
    velocityRange,
  ]);

  const currentGraphX =
    graphPaddingLeft +
    (time / safeMaxTime) *
      graphInnerWidth;

  const currentGraphY =
    graphPaddingTop +
    ((maxVelocity - velocity) /
      velocityRange) *
      graphInnerHeight;

  /* ================================================================
     TRACK POSITION
     ================================================================ */

  const trackProgress =
    clamp(
      Math.abs(displacement) /
        Math.max(
          Math.abs(
            initialVelocityValue *
              safeMaxTime +
              0.5 *
                acceleration *
                safeMaxTime *
                safeMaxTime
          ),
          1
        ),
      0,
      1
    );

  const objectPosition =
    8 + trackProgress * 84;

  /* ================================================================
     RENDER
     ================================================================ */

  return (
    <div
      className={`overflow-hidden rounded-3xl border border-white/10 bg-[#0c111d] shadow-2xl shadow-black/20 ${className}`}
    >
      {/* ============================================================
          HEADER
          ============================================================ */}

      <div className="border-b border-white/10 bg-white/[0.02] px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <MoveRight className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
                  Interactive Simulation
                </p>

                <h3 className="mt-0.5 text-sm font-bold text-white">
                  Motion
                </h3>
              </div>
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-white/35">
            v = u + at
          </span>
        </div>
      </div>

      {/* ============================================================
          SIMULATION AREA
          ============================================================ */}

      <div className="px-5 pt-5 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080c14]">
          {/* Grid */}
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                backgroundSize:
                  "32px 32px",
              }}
            />
          </div>

          <div className="relative px-4 pb-8 pt-8">
            {/* Distance labels */}

            <div className="mb-3 flex justify-between px-1 text-[9px] font-semibold text-white/25">
              <span>0 m</span>
              <span>Position</span>
              <span>100 m</span>
            </div>

            {/* Track */}

            <div className="relative h-16">
              <div className="absolute left-2 right-2 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-white/10" />

              <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 justify-between">
                {Array.from({
                  length: 11,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-2 w-px bg-white/15"
                  />
                ))}
              </div>

              {/* Moving object */}

              <div
                className="absolute top-1/2 -translate-y-1/2 transition-[left] duration-75"
                style={{
                  left: `${objectPosition}%`,
                }}
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-primary/20 blur-md" />

                  <div className="relative flex h-10 w-14 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
                    <div className="h-3.5 w-3.5 rounded-full bg-primary shadow-lg shadow-primary/40" />

                    <div className="absolute -bottom-2 left-2 h-3 w-3 rounded-full border-2 border-[#080c14] bg-white/30" />

                    <div className="absolute -bottom-2 right-2 h-3 w-3 rounded-full border-2 border-[#080c14] bg-white/30" />
                  </div>
                </div>
              </div>
            </div>

            {/* Current values */}

            <div className="mt-2 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-white/30">
                  Time
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {formatNumber(time)}
                  <span className="ml-1 text-[10px] font-medium text-white/30">
                    s
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-primary/10 bg-primary/[0.04] p-3 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-primary/50">
                  Velocity
                </p>

                <p className="mt-1 text-lg font-bold text-primary">
                  {formatNumber(velocity)}
                  <span className="ml-1 text-[10px] font-medium text-primary/40">
                    m/s
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-white/30">
                  Distance
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {formatNumber(displacement)}
                  <span className="ml-1 text-[10px] font-medium text-white/30">
                    m
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          CONTROLS
          ============================================================ */}

      <div className="px-5 pt-5 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          {/* Velocity */}

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-3.5 w-3.5 text-white/35" />

                <label
                  htmlFor="motion-initial-velocity"
                  className="text-xs font-semibold text-white/60"
                >
                  Initial velocity
                </label>
              </div>

              <span className="text-xs font-bold text-white/70">
                {formatNumber(
                  initialVelocityValue
                )}{" "}
                m/s
              </span>
            </div>

            <input
              id="motion-initial-velocity"
              type="range"
              min="-20"
              max="20"
              step="1"
              value={initialVelocityValue}
              onChange={
                handleVelocityChange
              }
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
            />
          </div>

          {/* Acceleration */}

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <MoveRight className="h-3.5 w-3.5 text-white/35" />

                <label
                  htmlFor="motion-acceleration"
                  className="text-xs font-semibold text-white/60"
                >
                  Acceleration
                </label>
              </div>

              <span className="text-xs font-bold text-white/70">
                {formatNumber(
                  acceleration
                )}{" "}
                m/s²
              </span>
            </div>

            <input
              id="motion-acceleration"
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={acceleration}
              onChange={
                handleAccelerationChange
              }
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
            />
          </div>

          {/* Time */}

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Timer className="h-3.5 w-3.5 text-white/35" />

                <label
                  htmlFor="motion-time"
                  className="text-xs font-semibold text-white/60"
                >
                  Time
                </label>
              </div>

              <span className="text-xs font-bold text-white/70">
                {formatNumber(time)} s
              </span>
            </div>

            <input
              id="motion-time"
              type="range"
              min="0"
              max={safeMaxTime}
              step={TIME_STEP}
              value={time}
              onChange={
                handleTimeChange
              }
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          PLAYBACK
          ============================================================ */}

      <div className="flex items-center justify-center gap-2 px-5 py-5 sm:px-6">
        {!isRunning ? (
          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 active:scale-[0.98]"
          >
            <Play className="h-4 w-4 fill-current" />
            {time >= safeMaxTime
              ? "Replay"
              : "Start"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePause}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-5 text-sm font-bold text-primary transition hover:bg-primary/15 active:scale-[0.98]"
          >
            <Pause className="h-4 w-4 fill-current" />
            Pause
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-11 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
          aria-label="Reset simulation"
          title="Reset simulation"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* ============================================================
          VELOCITY-TIME GRAPH
          ============================================================ */}

      <div className="border-t border-white/10 px-5 py-5 sm:px-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Live Graph
            </p>

            <p className="mt-1 text-xs font-semibold text-white/60">
              Velocity vs Time
            </p>
          </div>

          <span className="text-[10px] text-white/25">
            v = u + at
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080c14] p-3">
          <svg
            viewBox={`0 0 ${graphWidth} ${graphHeight}`}
            className="h-auto w-full"
            role="img"
            aria-label="Velocity versus time graph"
          >
            {/* Horizontal grid */}

            {Array.from({
              length: 5,
            }).map((_, index) => {
              const y =
                graphPaddingTop +
                (index / 4) *
                  graphInnerHeight;

              return (
                <line
                  key={`h-${index}`}
                  x1={graphPaddingLeft}
                  y1={y}
                  x2={
                    graphWidth -
                    graphPaddingRight
                  }
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Vertical grid */}

            {Array.from({
              length: 6,
            }).map((_, index) => {
              const x =
                graphPaddingLeft +
                (index / 5) *
                  graphInnerWidth;

              return (
                <line
                  key={`v-${index}`}
                  x1={x}
                  y1={graphPaddingTop}
                  x2={x}
                  y2={
                    graphHeight -
                    graphPaddingBottom
                  }
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Y axis */}

            <line
              x1={graphPaddingLeft}
              y1={graphPaddingTop}
              x2={graphPaddingLeft}
              y2={
                graphHeight -
                graphPaddingBottom
              }
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />

            {/* X axis */}

            <line
              x1={graphPaddingLeft}
              y1={
                graphHeight -
                graphPaddingBottom
              }
              x2={
                graphWidth -
                graphPaddingRight
              }
              y2={
                graphHeight -
                graphPaddingBottom
              }
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />

            {/* Graph path */}

            {graphPath && (
              <path
                d={graphPath}
                fill="none"
                stroke="currentColor"
                className="text-primary"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Current point */}

            <circle
              cx={currentGraphX}
              cy={currentGraphY}
              r="4"
              fill="currentColor"
              className="text-primary"
            />

            <circle
              cx={currentGraphX}
              cy={currentGraphY}
              r="7"
              fill="none"
              stroke="currentColor"
              className="text-primary"
              opacity="0.2"
            />

            {/* Y labels */}

            <text
              x="3"
              y={graphPaddingTop + 4}
              fill="rgba(255,255,255,0.3)"
              fontSize="8"
            >
              {formatNumber(maxVelocity)}
            </text>

            <text
              x="3"
              y={
                graphHeight -
                graphPaddingBottom
              }
              fill="rgba(255,255,255,0.3)"
              fontSize="8"
            >
              {formatNumber(minVelocity)}
            </text>

            {/* X labels */}

            <text
              x={graphPaddingLeft}
              y={
                graphHeight - 6
              }
              fill="rgba(255,255,255,0.3)"
              fontSize="8"
              textAnchor="middle"
            >
              0s
            </text>

            <text
              x={
                graphWidth -
                graphPaddingRight
              }
              y={
                graphHeight - 6
              }
              fill="rgba(255,255,255,0.3)"
              fontSize="8"
              textAnchor="end"
            >
              {formatNumber(
                safeMaxTime
              )}
              s
            </text>

            {/* Axis titles */}

            <text
              x="8"
              y={
                graphHeight / 2
              }
              fill="rgba(255,255,255,0.22)"
              fontSize="7"
              transform={`rotate(-90 8 ${
                graphHeight / 2
              })`}
              textAnchor="middle"
            >
              velocity
            </text>

            <text
              x={
                graphWidth / 2
              }
              y={
                graphHeight - 1
              }
              fill="rgba(255,255,255,0.22)"
              fontSize="7"
              textAnchor="middle"
            >
              time
            </text>
          </svg>
        </div>
      </div>

      {/* ============================================================
          FORMULA SUMMARY
          ============================================================ */}

      <div className="border-t border-white/10 bg-white/[0.015] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px]">
          <span className="font-medium text-white/30">
            u ={" "}
            <strong className="text-white/55">
              {formatNumber(
                initialVelocityValue
              )}
            </strong>{" "}
            m/s
          </span>

          <span className="text-white/15">
            +
          </span>

          <span className="font-medium text-white/30">
            at ={" "}
            <strong className="text-white/55">
              {formatNumber(
                acceleration
              )}
            </strong>{" "}
            ×{" "}
            <strong className="text-white/55">
              {formatNumber(time)}
            </strong>
          </span>

          <span className="text-white/15">
            =
          </span>

          <span className="font-bold text-primary">
            {formatNumber(velocity)} m/s
          </span>
        </div>
      </div>
    </div>
  );
}

