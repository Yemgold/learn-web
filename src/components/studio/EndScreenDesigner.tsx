



"use client";

import { useState } from "react";
import type { Asset } from "@/lib/studio/types";
import type { StudioAspectRatio } from "@/components/studio/PreviewPanel";

export type ScreenPlacement = "intro" | "end";

interface EndScreenDesignerProps {
  aspectRatio: StudioAspectRatio;
  disabled?: boolean;
  onCreate: (asset: Asset, placement: ScreenPlacement) => void;
}

const DIMENSIONS: Record<
  StudioAspectRatio,
  { width: number; height: number }
> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "4:3": { width: 1440, height: 1080 },
};

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  let line = "";
  let currentY = y;

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;

    if (
      line &&
      context.measureText(candidate).width > maxWidth
    ) {
      context.fillText(line, x, currentY);
      currentY += lineHeight;
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) {
    context.fillText(line, x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

function createId(): string {
  return typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
    ? `asset-${crypto.randomUUID()}`
    : `asset-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function createScreenAsset(options: {
  aspectRatio: StudioAspectRatio;
  title: string;
  subtitle: string;
  callToAction: string;
  brand: string;
  background: string;
  duration: number;
  placement: ScreenPlacement;
}): Promise<Asset> {
  const { width, height } = DIMENSIONS[options.aspectRatio];
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create the screen canvas.");
  }

  const isIntro = options.placement === "intro";
  const defaultTitle = isIntro
    ? "Welcome to our video!"
    : "Thanks for watching!";
  const defaultSubtitle = isIntro
    ? "Let's get started."
    : "See you in the next video.";
  const defaultCallToAction = isIntro
    ? "LET'S BEGIN"
    : "LIKE • SUBSCRIBE • SHARE";

  // Background.
  context.fillStyle = options.background;
  context.fillRect(0, 0, width, height);

  // Decorative circles.
  context.save();
  context.globalAlpha = 0.1;
  context.fillStyle = "#ffffff";

  context.beginPath();
  context.arc(
    width * 0.92,
    height * 0.12,
    width * 0.2,
    0,
    Math.PI * 2,
  );
  context.fill();

  context.beginPath();
  context.arc(
    width * 0.06,
    height * 0.88,
    width * 0.25,
    0,
    Math.PI * 2,
  );
  context.fill();

  context.restore();

  const margin = width * 0.09;
  const centerX = width / 2;
  const verticalScale = height / 1080;

  context.textAlign = "center";
  context.textBaseline = "middle";

  // Brand.
  context.fillStyle = "#d4d4d8";
  context.font = `600 ${Math.round(
    22 * verticalScale,
  )}px Arial, sans-serif`;

  context.fillText(
    options.brand.trim() || "LEARNYFI",
    centerX,
    height * 0.23,
    width - margin * 2,
  );

  // Title.
  context.fillStyle = "#ffffff";
  context.font = `800 ${Math.round(
    68 * verticalScale,
  )}px Arial, sans-serif`;

  const titleBottom = drawWrappedText(
    context,
    options.title.trim() || defaultTitle,
    centerX,
    height * 0.39,
    width - margin * 2,
    Math.round(82 * verticalScale),
  );

  // Subtitle.
  context.fillStyle = "#e4e4e7";
  context.font = `400 ${Math.round(
    30 * verticalScale,
  )}px Arial, sans-serif`;

  drawWrappedText(
    context,
    options.subtitle.trim() || defaultSubtitle,
    centerX,
    Math.max(
      height * 0.55,
      titleBottom + height * 0.035,
    ),
    width - margin * 2,
    Math.round(42 * verticalScale),
  );

  // Call-to-action button.
  const buttonText =
    options.callToAction.trim() || defaultCallToAction;
  const buttonFontSize = Math.round(24 * verticalScale);
  const buttonHeight = Math.round(66 * verticalScale);

  context.font = `700 ${buttonFontSize}px Arial, sans-serif`;

  const buttonWidth = Math.min(
    width - margin * 2,
    Math.max(
      width * 0.42,
      context.measureText(buttonText).width + margin,
    ),
  );

  const buttonX = centerX - buttonWidth / 2;
  const buttonY = height * 0.73;

  context.fillStyle = "#ffffff";
  context.beginPath();
  context.roundRect(
    buttonX,
    buttonY,
    buttonWidth,
    buttonHeight,
    buttonHeight / 2,
  );
  context.fill();

  context.fillStyle = options.background;
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillText(
    buttonText,
    centerX,
    buttonY + buttonHeight / 2,
    buttonWidth - 24 * verticalScale,
  );

  // Footer.
  context.fillStyle = "#d4d4d8";
  context.font = `400 ${Math.round(
    18 * verticalScale,
  )}px Arial, sans-serif`;

  context.fillText(
    isIntro ? "WELCOME TO LEARNYFI" : "THANK YOU FOR WATCHING",
    centerX,
    height * 0.9,
    width - margin * 2,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(
            new Error("Could not generate the screen image."),
          );
        }
      },
      "image/png",
    );
  });

  const screenName = isIntro ? "Intro Screen" : "End Screen";
  const file = new File(
    [blob],
    `learnyfi-${options.placement}-screen.png`,
    {
      type: "image/png",
      lastModified: Date.now(),
    },
  );

  return {
    id: createId(),
    name: `${screenName} - ${
      options.title.trim() || defaultTitle
    }`,
    kind: "image",
    url: URL.createObjectURL(file),
    file,
    duration: options.duration,
    width,
    height,
    size: file.size,
    createdAt: Date.now(),
  };
}

export default function EndScreenDesigner({
  aspectRatio,
  disabled = false,
  onCreate,
}: EndScreenDesignerProps) {
  const [placement, setPlacement] =
    useState<ScreenPlacement>("intro");

  const [title, setTitle] = useState("Thanks for watching!");
  const [subtitle, setSubtitle] = useState(
    "See you in the next video.",
  );
  const [callToAction, setCallToAction] = useState(
    "LIKE • SUBSCRIBE • SHARE",
  );
  const [brand, setBrand] = useState("LEARNYFI");
  const [background, setBackground] = useState("#17152f");
  const [duration, setDuration] = useState(5);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIntro = placement === "intro";
  const defaultTitle = isIntro
    ? "Welcome to our video!"
    : "Thanks for watching!";
  const defaultSubtitle = isIntro
    ? "Let's get started."
    : "See you in the next video.";
  const defaultCallToAction = isIntro
    ? "LET'S BEGIN"
    : "LIKE • SUBSCRIBE • SHARE";

  const handlePlacementChange = (
    nextPlacement: ScreenPlacement,
  ) => {
    setPlacement(nextPlacement);
    setError(null);

    if (nextPlacement === "intro") {
      setTitle("Welcome to our video!");
      setSubtitle("Let's get started.");
      setCallToAction("LET'S BEGIN");
    } else {
      setTitle("Thanks for watching!");
      setSubtitle("See you in the next video.");
      setCallToAction("LIKE • SUBSCRIBE • SHARE");
    }
  };

  const handleCreate = async () => {
    if (creating || disabled) return;

    setCreating(true);
    setError(null);

    try {
      const asset = await createScreenAsset({
        aspectRatio,
        title,
        subtitle,
        callToAction,
        brand,
        background,
        duration,
        placement,
      });

      onCreate(asset, placement);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not create the screen.",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="space-y-4 p-3">
      <div>
        <h2 className="text-sm font-semibold">
          Intro &amp; End Screen Designer
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Design a branded screen for the beginning or end of
          your video. Output format: {aspectRatio}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handlePlacementChange("intro")}
          disabled={disabled || creating}
          aria-pressed={isIntro}
          className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
            isIntro
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background hover:bg-muted"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          Intro — Beginning
        </button>

        <button
          type="button"
          onClick={() => handlePlacementChange("end")}
          disabled={disabled || creating}
          aria-pressed={!isIntro}
          className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
            !isIntro
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background hover:bg-muted"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          End Screen — Ending
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {isIntro
          ? "Your intro will be placed before your existing timeline clips. The Studio page must shift those clips forward to make room."
          : "Your end screen will be placed after your existing timeline content."}
      </p>

      <div className="space-y-3">
        <label className="block space-y-1">
          <span className="text-xs font-medium">
            Brand or channel name
          </span>
          <input
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            maxLength={80}
            disabled={disabled || creating}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Your channel name"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium">Main title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            disabled={disabled || creating}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder={defaultTitle}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium">Subtitle</span>
          <textarea
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            maxLength={240}
            rows={2}
            disabled={disabled || creating}
            className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder={defaultSubtitle}
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium">
            Call to action
          </span>
          <input
            value={callToAction}
            onChange={(event) =>
              setCallToAction(event.target.value)
            }
            maxLength={80}
            disabled={disabled || creating}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder={defaultCallToAction}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-xs font-medium">
              Background color
            </span>
            <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-background px-2">
              <input
                type="color"
                value={background}
                onChange={(event) =>
                  setBackground(event.target.value)
                }
                disabled={disabled || creating}
                aria-label="Screen background color"
                className="h-7 w-9 cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs uppercase">
                {background}
              </span>
            </div>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-medium">Duration</span>
            <select
              value={duration}
              onChange={(event) =>
                setDuration(Number(event.target.value))
              }
              disabled={disabled || creating}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value={3}>3 seconds</option>
              <option value={5}>5 seconds</option>
              <option value={8}>8 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={15}>15 seconds</option>
              <option value={20}>20 seconds</option>
            </select>
          </label>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-lg border border-border p-3"
        style={{ background }}
      >
        <div className="space-y-3 py-5 text-center text-white">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-white/70">
            {brand || "LEARNYFI"}
          </p>

          <p className="text-lg font-extrabold leading-tight">
            {title || defaultTitle}
          </p>

          <p className="text-xs text-white/80">
            {subtitle || defaultSubtitle}
          </p>

          <span className="inline-block max-w-full rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-black">
            {callToAction || defaultCallToAction}
          </span>
        </div>

        <p className="text-center text-[10px] text-white/70">
          {isIntro ? "Intro preview" : "End screen preview"} ·{" "}
          {aspectRatio} · {duration}s
        </p>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleCreate}
        disabled={disabled || creating}
        className="w-full rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {creating
          ? "Creating screen…"
          : isIntro
            ? "Create and Add to Beginning"
            : "Create and Add to End"}
      </button>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Creates a PNG image asset using your selected canvas
        dimensions and adds it to Media. The Studio page handles
        placing it at the beginning or end of the timeline for
        preview and export.
      </p>
    </section>
  );
}
