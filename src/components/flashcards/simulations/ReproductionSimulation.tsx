





"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { FlashcardSimulation } from "@/types/flashcard";

type ReproductionSimulationProps = {
  simulation: FlashcardSimulation;
};

type StageConfig = {
  stage: number;
  title: string;
  subtitle: string;
};

type Point = {
  x: number;
  y: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 560;

const DEFAULT_STAGE = 1;

const MIN_STAGE = 1;
const MAX_STAGE = 10;

const STAGE_CONFIG: Record<number, StageConfig> = {
  1: {
    stage: 1,
    title: "Reproduction",
    subtitle:
      "Organisms produce new individuals of their species.",
  },

  2: {
    stage: 2,
    title: "Asexual Reproduction",
    subtitle:
      "One parent produces offspring without gamete fusion.",
  },

  3: {
    stage: 3,
    title: "Sexual Reproduction",
    subtitle:
      "Male and female gametes are formed and eventually fuse.",
  },

  4: {
    stage: 4,
    title: "Vegetative Propagation",
    subtitle:
      "New plants develop from vegetative parts of a parent plant.",
  },

  5: {
    stage: 5,
    title: "Grafting",
    subtitle:
      "Plant tissues from two compatible plants are joined.",
  },

  6: {
    stage: 6,
    title: "Pollination",
    subtitle:
      "Pollen is transferred from the anther to the stigma.",
  },

  7: {
    stage: 7,
    title: "Cross-Pollination",
    subtitle:
      "Pollen moves between flowers on different plants.",
  },

  8: {
    stage: 8,
    title: "Fertilization",
    subtitle:
      "Male and female gamete nuclei fuse to form a zygote.",
  },

  9: {
    stage: 9,
    title: "Implantation",
    subtitle:
      "The early embryo attaches to the lining of the uterus.",
  },

  10: {
    stage: 10,
    title: "Placental Exchange",
    subtitle:
      "Materials are exchanged between maternal and fetal blood.",
  },
};

function clampStage(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_STAGE;
  }

  return Math.min(
    MAX_STAGE,
    Math.max(MIN_STAGE, Math.round(value))
  );
}

function getStage(
  simulation: FlashcardSimulation
): number {
  const value =
    simulation.initialValues?.stage;

  return clampStage(
    typeof value === "number"
      ? value
      : DEFAULT_STAGE
  );
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(
    radius,
    width / 2,
    height / 2
  );

  ctx.beginPath();

  ctx.moveTo(
    x + r,
    y
  );

  ctx.lineTo(
    x + width - r,
    y
  );

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + r
  );

  ctx.lineTo(
    x + width,
    y + height - r
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - r,
    y + height
  );

  ctx.lineTo(
    x + r,
    y + height
  );

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - r
  );

  ctx.lineTo(
    x,
    y + r
  );

  ctx.quadraticCurveTo(
    x,
    y,
    x + r,
    y
  );

  ctx.closePath();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options?: {
    size?: number;
    weight?: number;
    align?: CanvasTextAlign;
    color?: string;
  }
) {
  const size =
    options?.size ?? 16;

  const weight =
    options?.weight ?? 500;

  ctx.save();

  ctx.font = `${weight} ${size}px Inter, Arial, sans-serif`;

  ctx.textAlign =
    options?.align ?? "left";

  ctx.textBaseline = "middle";

  ctx.fillStyle =
    options?.color ?? "#f8fafc";

  ctx.fillText(
    text,
    x,
    y
  );

  ctx.restore();
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fill: string,
  stroke?: string,
  lineWidth = 1
) {
  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = fill;
  ctx.fill();

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color = "#22d3ee",
  width = 3
) {
  const angle = Math.atan2(
    to.y - from.y,
    to.x - from.x
  );

  const headLength = 12;

  ctx.save();

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();

  ctx.moveTo(
    from.x,
    from.y
  );

  ctx.lineTo(
    to.x,
    to.y
  );

  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(
    to.x,
    to.y
  );

  ctx.lineTo(
    to.x -
      headLength *
        Math.cos(angle - Math.PI / 6),
    to.y -
      headLength *
        Math.sin(angle - Math.PI / 6)
  );

  ctx.lineTo(
    to.x -
      headLength *
        Math.cos(angle + Math.PI / 6),
    to.y -
      headLength *
        Math.sin(angle + Math.PI / 6)
  );

  ctx.closePath();

  ctx.fill();

  ctx.restore();
}

function drawLabelPill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number
) {
  roundedRectPath(
    ctx,
    x,
    y,
    width,
    30,
    15
  );

  ctx.fillStyle =
    "rgba(15,23,42,0.94)";

  ctx.fill();

  ctx.strokeStyle =
    "rgba(148,163,184,0.28)";

  ctx.lineWidth = 1;

  ctx.stroke();

  drawText(
    ctx,
    text,
    x + width / 2,
    y + 15,
    {
      size: 12,
      weight: 700,
      align: "center",
      color: "#e2e8f0",
    }
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function ReproductionSimulation({
  simulation,
}: ReproductionSimulationProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const animationFrameRef =
    useRef<number | null>(null);

  const particlesRef =
    useRef<Particle[]>([]);

  const startTimeRef =
    useRef<number>(
      performance.now()
    );

  const [isPlaying, setIsPlaying] =
    useState(true);

  const [speed, setSpeed] =
    useState(1);

  const [manualStage, setManualStage] =
    useState<number | null>(null);

  const configuredStage =
    getStage(simulation);

  const stage =
    manualStage ?? configuredStage;

  const stageConfig =
    STAGE_CONFIG[stage] ??
    STAGE_CONFIG[DEFAULT_STAGE];

  const simulationTitle =
    simulation.title ??
    stageConfig.title;

  const simulationDescription =
    simulation.description ??
    stageConfig.subtitle;

  const resetAnimation =
    useCallback(() => {
      startTimeRef.current =
        performance.now();

      particlesRef.current = [];
    }, []);

  useEffect(() => {
    setManualStage(null);
    resetAnimation();
  }, [
    simulation,
    configuredStage,
    resetAnimation,
  ]);

  const cycleStage =
    useCallback(
      (direction: number) => {
        setManualStage(
          (current) => {
            const currentStage =
              current ??
              configuredStage;

            const next =
              currentStage + direction;

            if (next > MAX_STAGE) {
              return MIN_STAGE;
            }

            if (next < MIN_STAGE) {
              return MAX_STAGE;
            }

            return next;
          }
        );

        resetAnimation();
      },
      [
        configuredStage,
        resetAnimation,
      ]
    );

  /* ============================================================
     STAGE 1
     ============================================================ */

  const drawIntroduction =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const centerX =
          CANVAS_WIDTH / 2;

        const centerY =
          CANVAS_HEIGHT / 2 + 20;

        const pulse =
          1 +
          Math.sin(time * 0.003) *
            0.05;

        drawCircle(
          ctx,
          centerX,
          centerY,
          78 * pulse,
          "rgba(34,211,238,0.12)",
          "rgba(34,211,238,0.65)",
          2
        );

        drawCircle(
          ctx,
          centerX,
          centerY,
          48,
          "rgba(34,211,238,0.16)",
          "#22d3ee",
          2
        );

        drawText(
          ctx,
          "Parent",
          centerX,
          centerY,
          {
            size: 18,
            weight: 700,
            align: "center",
          }
        );

        drawArrow(
          ctx,
          {
            x: centerX + 80,
            y: centerY,
          },
          {
            x: centerX + 180,
            y: centerY,
          }
        );

        drawCircle(
          ctx,
          centerX + 240,
          centerY,
          50,
          "rgba(167,139,250,0.15)",
          "#a78bfa",
          2
        );

        drawText(
          ctx,
          "Offspring",
          centerX + 240,
          centerY,
          {
            size: 16,
            weight: 700,
            align: "center",
          }
        );

        drawLabelPill(
          ctx,
          "Continuation of the species",
          centerX - 125,
          centerY + 105,
          250
        );
      },
      []
    );

  /* ============================================================
     STAGE 2 — ASEXUAL
     ============================================================ */

  const drawAsexual =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const parentX =
          CANVAS_WIDTH / 2 - 180;

        const centerY =
          CANVAS_HEIGHT / 2 + 20;

        const splitProgress =
          (Math.sin(time * 0.002) + 1) /
          2;

        drawCircle(
          ctx,
          parentX,
          centerY,
          70,
          "rgba(34,211,238,0.15)",
          "#22d3ee",
          3
        );

        drawText(
          ctx,
          "Parent",
          parentX,
          centerY,
          {
            size: 17,
            weight: 700,
            align: "center",
          }
        );

        drawArrow(
          ctx,
          {
            x: parentX + 85,
            y: centerY,
          },
          {
            x:
              parentX +
              145 +
              splitProgress * 30,
            y: centerY,
          },
          "#22d3ee"
        );

        const childX =
          CANVAS_WIDTH / 2 + 130;

        drawCircle(
          ctx,
          childX,
          centerY - 65,
          48,
          "rgba(167,139,250,0.15)",
          "#a78bfa",
          2
        );

        drawCircle(
          ctx,
          childX,
          centerY + 65,
          48,
          "rgba(167,139,250,0.15)",
          "#a78bfa",
          2
        );

        drawText(
          ctx,
          "Offspring",
          childX,
          centerY - 65,
          {
            size: 13,
            weight: 700,
            align: "center",
          }
        );

        drawText(
          ctx,
          "Offspring",
          childX,
          centerY + 65,
          {
            size: 13,
            weight: 700,
            align: "center",
          }
        );

        drawLabelPill(
          ctx,
          "One parent • No gamete fusion",
          CANVAS_WIDTH / 2 - 145,
          CANVAS_HEIGHT - 80,
          290
        );
      },
      []
    );

  /* ============================================================
     STAGE 3 — SEXUAL
     ============================================================ */

  const drawSexual =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const y =
          CANVAS_HEIGHT / 2;

        const maleX = 240;
        const femaleX = 760;
        const centerX = 500;

        drawCircle(
          ctx,
          maleX,
          y,
          64,
          "rgba(34,211,238,0.14)",
          "#22d3ee",
          3
        );

        drawText(
          ctx,
          "Male",
          maleX,
          y,
          {
            size: 18,
            weight: 700,
            align: "center",
          }
        );

        drawCircle(
          ctx,
          femaleX,
          y,
          64,
          "rgba(244,114,182,0.14)",
          "#f472b6",
          3
        );

        drawText(
          ctx,
          "Female",
          femaleX,
          y,
          {
            size: 18,
            weight: 700,
            align: "center",
          }
        );

        const movement =
          ((time * 0.06) % 160);

        const spermX =
          maleX +
          80 +
          movement;

        drawCircle(
          ctx,
          spermX,
          y - 20,
          7,
          "#67e8f9"
        );

        drawArrow(
          ctx,
          {
            x: maleX + 80,
            y: y + 50,
          },
          {
            x: centerX - 40,
            y: y + 50,
          },
          "#22d3ee",
          2
        );

        drawArrow(
          ctx,
          {
            x: femaleX - 80,
            y: y + 50,
          },
          {
            x: centerX + 40,
            y: y + 50,
          },
          "#f472b6",
          2
        );

        drawCircle(
          ctx,
          centerX,
          y,
          50,
          "rgba(167,139,250,0.15)",
          "#a78bfa",
          3
        );

        drawText(
          ctx,
          "Gametes",
          centerX,
          y,
          {
            size: 15,
            weight: 700,
            align: "center",
          }
        );

        drawLabelPill(
          ctx,
          "Genetic variation can result",
          centerX - 135,
          CANVAS_HEIGHT - 80,
          270
        );
      },
      []
    );

  /* ============================================================
     STAGE 4 — VEGETATIVE PROPAGATION
     ============================================================ */

  const drawVegetativePropagation =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const baseY =
          CANVAS_HEIGHT - 130;

        const stemX =
          CANVAS_WIDTH / 2;

        ctx.save();

        ctx.strokeStyle =
          "#22c55e";

        ctx.lineWidth = 12;

        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.moveTo(
          stemX,
          baseY
        );

        ctx.lineTo(
          stemX,
          180
        );

        ctx.stroke();

        ctx.lineWidth = 7;

        ctx.beginPath();

        ctx.moveTo(
          stemX,
          290
        );

        ctx.lineTo(
          stemX - 120,
          220
        );

        ctx.moveTo(
          stemX,
          330
        );

        ctx.lineTo(
          stemX + 130,
          245
        );

        ctx.stroke();

        ctx.restore();

        const growth =
          1 +
          Math.sin(time * 0.002) *
            0.04;

        drawCircle(
          ctx,
          stemX,
          160,
          46 * growth,
          "rgba(34,197,94,0.14)",
          "#22c55e",
          2
        );

        drawCircle(
          ctx,
          stemX - 150,
          205,
          35,
          "rgba(74,222,128,0.13)",
          "#4ade80",
          2
        );

        drawCircle(
          ctx,
          stemX + 160,
          225,
          35,
          "rgba(74,222,128,0.13)",
          "#4ade80",
          2
        );

        drawText(
          ctx,
          "Parent plant",
          stemX,
          160,
          {
            size: 14,
            weight: 700,
            align: "center",
          }
        );

        drawArrow(
          ctx,
          {
            x: stemX - 150,
            y: 260,
          },
          {
            x: stemX - 150,
            y: 360,
          },
          "#4ade80",
          2
        );

        drawArrow(
          ctx,
          {
            x: stemX + 160,
            y: 280,
          },
          {
            x: stemX + 160,
            y: 380,
          },
          "#4ade80",
          2
        );

        drawLabelPill(
          ctx,
          "New plants develop from vegetative parts",
          CANVAS_WIDTH / 2 - 190,
          CANVAS_HEIGHT - 75,
          380
        );
      },
      []
    );

  /* ============================================================
     STAGE 5 — GRAFTING
     ============================================================ */

  const drawGrafting =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const centerX =
          CANVAS_WIDTH / 2;

        const joinY =
          CANVAS_HEIGHT / 2 + 25;

        const pulse =
          1 +
          Math.sin(time * 0.003) *
            0.08;

        /*
         * Rootstock.
         */
        ctx.save();

        ctx.strokeStyle =
          "#22c55e";

        ctx.lineWidth = 20;

        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.moveTo(
          centerX,
          CANVAS_HEIGHT - 80
        );

        ctx.lineTo(
          centerX,
          joinY
        );

        ctx.stroke();

        /*
         * Scion.
         */
        ctx.strokeStyle =
          "#a78bfa";

        ctx.lineWidth = 18;

        ctx.beginPath();

        ctx.moveTo(
          centerX - 5,
          joinY + 5
        );

        ctx.lineTo(
          centerX - 90,
          170
        );

        ctx.stroke();

        ctx.restore();

        drawCircle(
          ctx,
          centerX,
          joinY,
          36 * pulse,
          "rgba(250,204,21,0.14)",
          "#facc15",
          3
        );

        drawText(
          ctx,
          "Graft union",
          centerX,
          joinY,
          {
            size: 13,
            weight: 700,
            align: "center",
          }
        );

        drawLabelPill(
          ctx,
          "Scion + rootstock → one growing plant",
          centerX - 190,
          CANVAS_HEIGHT - 70,
          380
        );
      },
      []
    );

  /* ============================================================
     STAGE 6 — POLLINATION
     ============================================================ */

  const drawPollination =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const flowerX =
          CANVAS_WIDTH / 2;

        const flowerY = 300;

        /*
         * Petals.
         */
        for (
          let i = 0;
          i < 6;
          i++
        ) {
          const angle =
            (Math.PI * 2 * i) /
            6;

          const px =
            flowerX +
            Math.cos(angle) * 75;

          const py =
            flowerY +
            Math.sin(angle) * 75;

          drawCircle(
            ctx,
            px,
            py,
            48,
            "rgba(244,114,182,0.13)",
            "#f472b6",
            2
          );
        }

        /*
         * Anther.
         */
        const antherX =
          flowerX - 100;

        const antherY =
          flowerY + 25;

        drawCircle(
          ctx,
          antherX,
          antherY,
          24,
          "rgba(250,204,21,0.18)",
          "#facc15",
          2
        );

        drawText(
          ctx,
          "Anther",
          antherX,
          antherY + 45,
          {
            size: 13,
            weight: 700,
            align: "center",
          }
        );

        /*
         * Stigma.
         */
        const stigmaX =
          flowerX + 100;

        const stigmaY =
          flowerY - 55;

        drawCircle(
          ctx,
          stigmaX,
          stigmaY,
          22,
          "rgba(34,211,238,0.16)",
          "#22d3ee",
          2
        );

        drawText(
          ctx,
          "Stigma",
          stigmaX,
          stigmaY - 42,
          {
            size: 13,
            weight: 700,
            align: "center",
          }
        );

        /*
         * Animated pollen.
         */
        const progress =
          (time * 0.00035) % 1;

        const pollenX =
          antherX +
          (stigmaX - antherX) *
            progress;

        const pollenY =
          antherY +
          (stigmaY - antherY) *
            progress -
          Math.sin(progress * Math.PI) *
            35;

        drawCircle(
          ctx,
          pollenX,
          pollenY,
          8,
          "#facc15"
        );

        drawArrow(
          ctx,
          {
            x: antherX + 35,
            y: antherY,
          },
          {
            x: stigmaX - 35,
            y: stigmaY,
          },
          "#facc15",
          2
        );

        drawLabelPill(
          ctx,
          "Pollen: anther → stigma",
          CANVAS_WIDTH / 2 - 125,
          CANVAS_HEIGHT - 70,
          250
        );
      },
      []
    );

  /* ============================================================
     STAGE 7 — CROSS POLLINATION
     ============================================================ */

  const drawCrossPollination =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const leftX = 250;
        const rightX = 750;
        const flowerY = 275;

        const drawFlower =
          (
            x: number,
            label: string
          ) => {
            for (
              let i = 0;
              i < 5;
              i++
            ) {
              const angle =
                (Math.PI * 2 * i) /
                5;

              drawCircle(
                ctx,
                x +
                  Math.cos(angle) *
                    55,
                flowerY +
                  Math.sin(angle) *
                    55,
                36,
                "rgba(244,114,182,0.12)",
                "#f472b6",
                2
              );
            }

            drawCircle(
              ctx,
              x,
              flowerY,
              22,
              "rgba(250,204,21,0.18)",
              "#facc15",
              2
            );

            drawText(
              ctx,
              label,
              x,
              flowerY + 105,
              {
                size: 15,
                weight: 700,
                align: "center",
              }
            );
          };

        drawFlower(
          leftX,
          "Plant A"
        );

        drawFlower(
          rightX,
          "Plant B"
        );

        const progress =
          (time * 0.0003) % 1;

        const pollenX =
          leftX +
          (rightX - leftX) *
            progress;

        const pollenY =
          flowerY -
          Math.sin(progress * Math.PI) *
            80;

        drawCircle(
          ctx,
          pollenX,
          pollenY,
          9,
          "#facc15"
        );

        drawArrow(
          ctx,
          {
            x: leftX + 75,
            y: flowerY,
          },
          {
            x: rightX - 75,
            y: flowerY,
          },
          "#facc15",
          2
        );

        drawLabelPill(
          ctx,
          "Pollen moves between different plants",
          CANVAS_WIDTH / 2 - 165,
          CANVAS_HEIGHT - 70,
          330
        );
      },
      []
    );

  /* ============================================================
     STAGE 8 — FERTILIZATION
     ============================================================ */

  const drawFertilization =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const centerX =
          CANVAS_WIDTH / 2;

        const centerY =
          CANVAS_HEIGHT / 2;

        const movement =
          (time * 0.12) % 300;

        /*
         * Egg.
         */
        drawCircle(
          ctx,
          centerX + 100,
          centerY,
          70,
          "rgba(244,114,182,0.12)",
          "#f472b6",
          3
        );

        drawText(
          ctx,
          "Egg",
          centerX + 100,
          centerY,
          {
            size: 16,
            weight: 700,
            align: "center",
          }
        );

        /*
         * Sperm.
         */
        const spermX =
          centerX -
          220 +
          Math.min(
            movement,
            270
          );

        const spermY =
          centerY -
          Math.sin(
            movement * 0.03
          ) *
            18;

        drawCircle(
          ctx,
          spermX,
          spermY,
          8,
          "#67e8f9"
        );

        ctx.save();

        ctx.strokeStyle =
          "#67e8f9";

        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(
          spermX - 8,
          spermY
        );

        ctx.quadraticCurveTo(
          spermX - 22,
          spermY + 12,
          spermX - 35,
          spermY
        );

        ctx.stroke();

        ctx.restore();

        drawArrow(
          ctx,
          {
            x: centerX - 205,
            y: centerY + 65,
          },
          {
            x: centerX + 55,
            y: centerY + 65,
          },
          "#22d3ee",
          2
        );

        /*
         * Zygote after fusion.
         */
        const flash =
          Math.max(
            0,
            Math.sin(
              time * 0.004
            )
          );

        drawCircle(
          ctx,
          centerX,
          centerY,
          42 +
            flash * 8,
          `rgba(167,139,250,${0.15 + flash * 0.12})`,
          "#a78bfa",
          3
        );

        drawText(
          ctx,
          "Zygote",
          centerX,
          centerY,
          {
            size: 15,
            weight: 700,
            align: "center",
          }
        );

        drawLabelPill(
          ctx,
          "Male gamete + female gamete → zygote",
          centerX - 185,
          CANVAS_HEIGHT - 70,
          370
        );
      },
      []
    );

  /* ============================================================
     STAGE 9 — IMPLANTATION
     ============================================================ */

  const drawImplantation =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const centerX =
          CANVAS_WIDTH / 2;

        const uterusTop =
          135;

        const uterusBottom =
          CANVAS_HEIGHT - 90;

        /*
         * Uterine wall.
         */
        ctx.save();

        ctx.strokeStyle =
          "#f472b6";

        ctx.lineWidth = 42;

        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.moveTo(
          centerX,
          uterusTop
        );

        ctx.lineTo(
          centerX,
          uterusBottom
        );

        ctx.stroke();

        ctx.restore();

        /*
         * Endometrium.
         */
        ctx.save();

        ctx.strokeStyle =
          "rgba(251,113,133,0.55)";

        ctx.lineWidth = 14;

        ctx.beginPath();

        ctx.moveTo(
          centerX - 25,
          250
        );

        ctx.lineTo(
          centerX - 25,
          uterusBottom - 20
        );

        ctx.stroke();

        ctx.restore();

        /*
         * Embryo moving toward wall.
         */
        const progress =
          (Math.sin(time * 0.0015) + 1) /
          2;

        const embryoX =
          centerX -
          130 +
          progress * 80;

        const embryoY =
          255 +
          progress * 90;

        drawCircle(
          ctx,
          embryoX,
          embryoY,
          34,
          "rgba(167,139,250,0.18)",
          "#a78bfa",
          3
        );

        drawCircle(
          ctx,
          embryoX - 10,
          embryoY - 5,
          6,
          "#c4b5fd"
        );

        drawCircle(
          ctx,
          embryoX + 9,
          embryoY + 5,
          6,
          "#c4b5fd"
        );

        drawText(
          ctx,
          "Embryo",
          embryoX,
          embryoY + 55,
          {
            size: 13,
            weight: 700,
            align: "center",
          }
        );

        drawArrow(
          ctx,
          {
            x: embryoX + 45,
            y: embryoY,
          },
          {
            x: centerX - 35,
            y: embryoY,
          },
          "#a78bfa",
          2
        );

        drawLabelPill(
          ctx,
          "Embryo attaches to the uterine lining",
          centerX - 175,
          CANVAS_HEIGHT - 70,
          350
        );
      },
      []
    );

  /* ============================================================
     STAGE 10 — PLACENTA
     ============================================================ */

  const drawPlacenta =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        time: number
      ) => {
        const centerX =
          CANVAS_WIDTH / 2;

        const placentaY =
          CANVAS_HEIGHT / 2;

        /*
         * Placenta.
         */
        drawCircle(
          ctx,
          centerX,
          placentaY,
          85,
          "rgba(244,114,182,0.14)",
          "#f472b6",
          3
        );

        drawText(
          ctx,
          "Placenta",
          centerX,
          placentaY,
          {
            size: 18,
            weight: 700,
            align: "center",
          }
        );

        /*
         * Mother.
         */
        drawLabelPill(
          ctx,
          "Maternal blood",
          90,
          115,
          150
        );

        /*
         * Fetus.
         */
        drawLabelPill(
          ctx,
          "Fetal blood",
          CANVAS_WIDTH - 240,
          115,
          150
        );

        /*
         * Exchange particles.
         */
        const particleProgress =
          (time * 0.00025) % 1;

        const oxygenX =
          240 +
          (centerX - 100 - 240) *
            particleProgress;

        const nutrientY =
          245 +
          Math.sin(
            particleProgress *
              Math.PI *
              2
          ) *
            20;

        drawCircle(
          ctx,
          oxygenX,
          nutrientY,
          7,
          "#38bdf8"
        );

        drawText(
          ctx,
          "O₂",
          oxygenX,
          nutrientY - 22,
          {
            size: 11,
            weight: 700,
            align: "center",
            color: "#38bdf8",
          }
        );

        drawArrow(
          ctx,
          {
            x: 245,
            y: 240,
          },
          {
            x: centerX - 95,
            y: 240,
          },
          "#38bdf8",
          2
        );

        drawArrow(
          ctx,
          {
            x: centerX + 95,
            y: 330,
          },
          {
            x: CANVAS_WIDTH - 245,
            y: 330,
          },
          "#f97316",
          2
        );

        drawText(
          ctx,
          "Waste",
          CANVAS_WIDTH / 2 + 250,
          350,
          {
            size: 12,
            weight: 700,
            align: "center",
            color: "#fb923c",
          }
        );

        /*
         * Umbilical cord.
         */
        ctx.save();

        ctx.strokeStyle =
          "#a78bfa";

        ctx.lineWidth = 8;

        ctx.beginPath();

        ctx.moveTo(
          centerX,
          placentaY + 80
        );

        ctx.bezierCurveTo(
          centerX - 40,
          placentaY + 130,
          centerX + 50,
          placentaY + 155,
          centerX + 25,
          placentaY + 200
        );

        ctx.stroke();

        ctx.restore();

        drawCircle(
          ctx,
          centerX + 25,
          placentaY + 215,
          38,
          "rgba(167,139,250,0.14)",
          "#a78bfa",
          2
        );

        drawText(
          ctx,
          "Fetus",
          centerX + 25,
          placentaY + 215,
          {
            size: 13,
            weight: 700,
            align: "center",
          }
        );

        drawLabelPill(
          ctx,
          "O₂ + nutrients → fetus     wastes → mother",
          centerX - 220,
          CANVAS_HEIGHT - 70,
          440
        );
      },
      []
    );

  /* ============================================================
     DRAW DISPATCHER
     ============================================================ */

  const drawStage =
    useCallback(
      (
        ctx: CanvasRenderingContext2D,
        currentStage: number,
        time: number
      ) => {
        switch (currentStage) {
          case 1:
            drawIntroduction(
              ctx,
              time
            );
            break;

          case 2:
            drawAsexual(
              ctx,
              time
            );
            break;

          case 3:
            drawSexual(
              ctx,
              time
            );
            break;

          case 4:
            drawVegetativePropagation(
              ctx,
              time
            );
            break;

          case 5:
            drawGrafting(
              ctx,
              time
            );
            break;

          case 6:
            drawPollination(
              ctx,
              time
            );
            break;

          case 7:
            drawCrossPollination(
              ctx,
              time
            );
            break;

          case 8:
            drawFertilization(
              ctx,
              time
            );
            break;

          case 9:
            drawImplantation(
              ctx,
              time
            );
            break;

          case 10:
            drawPlacenta(
              ctx,
              time
            );
            break;

          default:
            drawIntroduction(
              ctx,
              time
            );
        }
      },
      [
        drawIntroduction,
        drawAsexual,
        drawSexual,
        drawVegetativePropagation,
        drawGrafting,
        drawPollination,
        drawCrossPollination,
        drawFertilization,
        drawImplantation,
        drawPlacenta,
      ]
    );

  /* ============================================================
     CANVAS LOOP
     ============================================================ */

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const render =
      (timestamp: number) => {
        /*
         * Background.
         */
        ctx.clearRect(
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );

        const gradient =
          ctx.createLinearGradient(
            0,
            0,
            0,
            CANVAS_HEIGHT
          );

        gradient.addColorStop(
          0,
          "#020617"
        );

        gradient.addColorStop(
          1,
          "#0f172a"
        );

        ctx.fillStyle =
          gradient;

        ctx.fillRect(
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT
        );

        /*
         * Grid.
         */
        ctx.save();

        ctx.strokeStyle =
          "rgba(148,163,184,0.07)";

        ctx.lineWidth = 1;

        const gridSize = 40;

        for (
          let x = 0;
          x <= CANVAS_WIDTH;
          x += gridSize
        ) {
          ctx.beginPath();

          ctx.moveTo(
            x,
            0
          );

          ctx.lineTo(
            x,
            CANVAS_HEIGHT
          );

          ctx.stroke();
        }

        for (
          let y = 0;
          y <= CANVAS_HEIGHT;
          y += gridSize
        ) {
          ctx.beginPath();

          ctx.moveTo(
            0,
            y
          );

          ctx.lineTo(
            CANVAS_WIDTH,
            y
          );

          ctx.stroke();
        }

        ctx.restore();

        /*
         * Animation time.
         */
        const elapsed =
          isPlaying
            ? (timestamp -
                startTimeRef.current) *
              speed
            : 0;

        /*
         * Stage visualization.
         */
        drawStage(
          ctx,
          stage,
          elapsed
        );

        /*
         * Header.
         */
        ctx.save();

        roundedRectPath(
          ctx,
          24,
          20,
          952,
          68,
          16
        );

        ctx.fillStyle =
          "rgba(15,23,42,0.88)";

        ctx.fill();

        ctx.strokeStyle =
          "rgba(148,163,184,0.18)";

        ctx.lineWidth = 1;

        ctx.stroke();

        ctx.restore();

        drawText(
          ctx,
          simulationTitle,
          48,
          47,
          {
            size: 21,
            weight: 800,
            color: "#f8fafc",
          }
        );

        drawText(
          ctx,
          simulationDescription,
          48,
          70,
          {
            size: 12,
            weight: 500,
            color: "#94a3b8",
          }
        );

        /*
         * Stage indicator.
         */
        drawLabelPill(
          ctx,
          `Stage ${stage} / ${MAX_STAGE}`,
          820,
          39,
          125
        );

        /*
         * Continue animation.
         */
        animationFrameRef.current =
          requestAnimationFrame(
            render
          );
      };

    animationFrameRef.current =
      requestAnimationFrame(
        render
      );

    return () => {
      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }
    };
  }, [
    stage,
    speed,
    isPlaying,
    drawStage,
    simulationTitle,
    simulationDescription,
  ]);

  /* ============================================================
     CONTROLS
     ============================================================ */

  const handleReset =
    useCallback(() => {
      resetAnimation();
      setManualStage(null);
    }, [resetAnimation]);

  const stageOptions =
    useMemo(
      () =>
        Object.values(
          STAGE_CONFIG
        ),
      []
    );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      {/* ========================================================
          CANVAS
      ======================================================== */}

      <div className="relative w-full bg-slate-950">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block h-auto w-full"
        />
      </div>

      {/* ========================================================
          CONTROLS
      ======================================================== */}

      <div className="border-t border-slate-800 bg-slate-950/95 p-4">
        <div className="flex flex-col gap-4">
          {/* Playback controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setIsPlaying(
                  (value) => !value
                )
              }
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-500 hover:bg-slate-800"
            >
              {isPlaying
                ? "Pause"
                : "Play"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-500 hover:bg-slate-800"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() =>
                cycleStage(-1)
              }
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-violet-500 hover:bg-slate-800"
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={() =>
                cycleStage(1)
              }
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-violet-500 hover:bg-slate-800"
            >
              Next →
            </button>

            {/* Speed */}
            <label className="ml-auto flex items-center gap-2 text-sm text-slate-400">
              Speed

              <select
                value={speed}
                onChange={(event) =>
                  setSpeed(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
              >
                <option value={0.5}>
                  0.5×
                </option>

                <option value={1}>
                  1×
                </option>

                <option value={1.5}>
                  1.5×
                </option>

                <option value={2}>
                  2×
                </option>
              </select>
            </label>
          </div>

          {/* Stage selector */}
          <div className="flex flex-wrap gap-2">
            {stageOptions.map(
              (option) => {
                const active =
                  option.stage ===
                  stage;

                return (
                  <button
                    key={
                      option.stage
                    }
                    type="button"
                    onClick={() => {
                      setManualStage(
                        option.stage
                      );

                      resetAnimation();
                    }}
                    className={[
                      "rounded-lg border px-3 py-2 text-xs font-semibold transition",
                      active
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200",
                    ].join(" ")}
                  >
                    {option.stage}.{" "}
                    {option.title}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}