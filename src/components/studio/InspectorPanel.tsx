



"use client";

import {
  AudioLines,
  Clock3,
  Film,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Clip, TrackKind } from "@/lib/studio/types";
import { formatFileSize, formatTime } from "@/lib/studio/utils";

interface InspectorPanelProps {
  clip: Clip | null;
  onUpdateClip: (clipId: string, updates: Partial<Clip>) => void;
  onDeleteClip: (clipId: string) => void;
  onSelectAsset?: (assetId: string) => void;
  className?: string;
}

const TRACK_OPTIONS: { label: string; value: TrackKind }[] = [
  { label: "Video", value: "video" },
  { label: "Audio", value: "audio" },
  { label: "Overlay", value: "overlay" },
];

export default function InspectorPanel({
  clip,
  onUpdateClip,
  onDeleteClip,
  onSelectAsset,
  className = "",
}: InspectorPanelProps) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("0");
  const [duration, setDuration] = useState("5");
  const [trimStart, setTrimStart] = useState("0");
  const [trimEnd, setTrimEnd] = useState("0");
  const [volume, setVolume] = useState(1);
  const [track, setTrack] = useState<TrackKind>("video");
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!clip) return;

    setName(clip.name);
    setStart(String(clip.start));
    setDuration(String(clip.duration));
    setTrimStart(String(clip.trimStart));
    setTrimEnd(String(clip.trimEnd));
    setVolume(clip.volume ?? 1);
    setTrack(clip.track);
    setMuted(clip.muted ?? false);
  }, [clip]);

  if (!clip) {
    return (
      <section
        className={`studio-inspector-panel ${className}`.trim()}
        style={panelStyle}
      >
        <header style={headerStyle}>Inspector</header>

        <div
          style={{
            display: "flex",
            flex: 1,
            minHeight: 160,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 10,
            padding: 20,
            color: "var(--studio-muted, #a1a1aa)",
            textAlign: "center",
          }}
        >
          <Film size={28} strokeWidth={1.4} />
          <div style={{ fontSize: 12, fontWeight: 600 }}>
            Nothing selected
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.6 }}>
            Select a clip on the timeline to inspect and edit its properties.
          </div>
        </div>
      </section>
    );
  }

  const isAudio = clip.kind === "audio";
  const KindIcon =
    clip.kind === "video"
      ? Film
      : clip.kind === "audio"
        ? AudioLines
        : ImageIcon;

  const sourceDuration = Math.max(
    0,
    clip.duration + clip.trimStart + clip.trimEnd,
  );

  const commitNumber = (
    field: "start" | "duration" | "trimStart" | "trimEnd",
    rawValue: string,
  ) => {
    const value = Number(rawValue);

    if (!Number.isFinite(value) || value < 0) {
      return;
    }

    if (field === "start") {
      onUpdateClip(clip.id, { start: value });
    }

    if (field === "duration" && value > 0) {
      onUpdateClip(clip.id, { duration: value });
    }

    if (field === "trimStart") {
      const safeValue = Math.min(value, Math.max(0, sourceDuration - 0.05));
      onUpdateClip(clip.id, { trimStart: safeValue });
    }

    if (field === "trimEnd") {
      const safeValue = Math.min(value, Math.max(0, sourceDuration - 0.05));
      onUpdateClip(clip.id, { trimEnd: safeValue });
    }
  };

  const resetProperties = () => {
    setName(clip.name);
    setStart(String(clip.start));
    setDuration(String(clip.duration));
    setTrimStart(String(clip.trimStart));
    setTrimEnd(String(clip.trimEnd));
    setVolume(clip.volume ?? 1);
    setTrack(clip.track);
    setMuted(clip.muted ?? false);

    onUpdateClip(clip.id, {
      start: 0,
      trimStart: 0,
      trimEnd: 0,
      volume: 1,
      muted: false,
    });
  };

  return (
    <section
      className={`studio-inspector-panel ${className}`.trim()}
      style={panelStyle}
    >
      <header
        style={{
          ...headerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span>Inspector</span>

        <button
          type="button"
          onClick={resetProperties}
          title="Reset clip properties"
          aria-label="Reset clip properties"
          style={iconButtonStyle}
        >
          <RotateCcw size={14} />
        </button>
      </header>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
            padding: 10,
            border: "1px solid var(--studio-border, #303030)",
            borderRadius: 8,
            background: "var(--studio-surface, #1c1c1c)",
          }}
        >
          <div
            style={{
              display: "grid",
              placeItems: "center",
              width: 38,
              height: 38,
              flex: "0 0 auto",
              borderRadius: 7,
              background: "#7c3aed22",
              color: "#c4b5fd",
            }}
          >
            <KindIcon size={19} />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={clip.name}
            >
              {clip.name}
            </div>

            <div
              style={{
                marginTop: 4,
                color: "var(--studio-muted, #a1a1aa)",
                fontSize: 10,
                textTransform: "uppercase",
              }}
            >
              {clip.kind} clip
            </div>
          </div>
        </div>

        <InspectorSection title="Basic properties">
          <Field label="Clip name">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => {
                const nextName = name.trim() || clip.name;
                setName(nextName);
                onUpdateClip(clip.id, { name: nextName });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              style={inputStyle}
            />
          </Field>

          <Field label="Track">
            <select
              value={track}
              onChange={(event) => {
                const value = event.target.value as TrackKind;
                setTrack(value);
                onUpdateClip(clip.id, { track: value });
              }}
              style={inputStyle}
            >
              {TRACK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Source media ID">
            <button
              type="button"
              onClick={() => onSelectAsset?.(clip.assetId)}
              style={{
                ...inputStyle,
                display: "block",
                width: "100%",
                overflow: "hidden",
                textAlign: "left",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: onSelectAsset ? "pointer" : "default",
              }}
              title={clip.assetId}
            >
              {clip.assetId}
            </button>
          </Field>
        </InspectorSection>

        <InspectorSection title="Timing">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            <Field label="Timeline start (sec)">
              <input
                type="number"
                min={0}
                step={0.1}
                value={start}
                onChange={(event) => setStart(event.target.value)}
                onBlur={() => commitNumber("start", start)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                style={inputStyle}
              />
            </Field>

            <Field label="Duration (sec)">
              <input
                type="number"
                min={0.05}
                step={0.1}
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                onBlur={() => commitNumber("duration", duration)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                style={inputStyle}
              />
            </Field>

            <Field label="Trim start (sec)">
              <input
                type="number"
                min={0}
                step={0.1}
                value={trimStart}
                onChange={(event) => setTrimStart(event.target.value)}
                onBlur={() => commitNumber("trimStart", trimStart)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                style={inputStyle}
              />
            </Field>

            <Field label="Trim end (sec)">
              <input
                type="number"
                min={0}
                step={0.1}
                value={trimEnd}
                onChange={(event) => setTrimEnd(event.target.value)}
                onBlur={() => commitNumber("trimEnd", trimEnd)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                style={inputStyle}
              />
            </Field>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 10,
              color: "var(--studio-muted, #a1a1aa)",
              fontSize: 10,
            }}
          >
            <Clock3 size={13} />
            Timeline end: {formatTime(clip.start + clip.duration)}
          </div>
        </InspectorSection>

        <InspectorSection title="Audio">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12,
              }}
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              Volume
            </div>

            <span
              style={{
                color: "var(--studio-muted, #a1a1aa)",
                fontSize: 11,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.round(volume * 100)}%
            </span>
          </div>

          <input
            aria-label="Clip volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(event) => {
              const value = Number(event.target.value);
              setVolume(value);
              onUpdateClip(clip.id, { volume: value });
            }}
            disabled={!isAudio && clip.kind !== "video"}
            style={{
              width: "100%",
              accentColor: "var(--studio-accent, #8b5cf6)",
            }}
          />

          <button
            type="button"
            onClick={() => {
              const nextMuted = !muted;
              setMuted(nextMuted);
              onUpdateClip(clip.id, { muted: nextMuted });
            }}
            disabled={!isAudio && clip.kind !== "video"}
            style={{
              ...secondaryButtonStyle,
              width: "100%",
              marginTop: 12,
              opacity: !isAudio && clip.kind !== "video" ? 0.5 : 1,
            }}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            {muted ? "Unmute clip" : "Mute clip"}
          </button>

          <div
            style={{
              marginTop: 8,
              color: "var(--studio-muted, #a1a1aa)",
              fontSize: 10,
              lineHeight: 1.5,
            }}
          >
            Volume changes are stored with the clip. They take effect in
            playback/export only when the studio renderer applies them.
          </div>
        </InspectorSection>

        <InspectorSection title="Clip information">
          <InfoRow label="Type" value={clip.kind.toUpperCase()} />
          <InfoRow label="Clip ID" value={clip.id} />
          <InfoRow label="Asset ID" value={clip.assetId} />
          {clip.file && (
            <InfoRow
              label="File size"
              value={formatFileSize(clip.file.size)}
            />
          )}
          <InfoRow label="Timeline start" value={formatTime(clip.start)} />
          <InfoRow
            label="Timeline end"
            value={formatTime(clip.start + clip.duration)}
          />
        </InspectorSection>

        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(`Delete "${clip.name}" from the timeline?`)
            ) {
              onDeleteClip(clip.id);
            }
          }}
          style={{
            ...secondaryButtonStyle,
            width: "100%",
            marginTop: 8,
            borderColor: "#7f1d1d",
            background: "#450a0a30",
            color: "#f87171",
          }}
        >
          <Trash2 size={14} />
          Delete clip
        </button>
      </div>
    </section>
  );
}

function InspectorSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: "1px solid var(--studio-border, #2a2a2a)",
      }}
    >
      <h3
        style={{
          margin: "0 0 12px",
          color: "var(--studio-text, #f4f4f5)",
          fontSize: 11,
          fontWeight: 650,
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        minWidth: 0,
        marginBottom: 11,
        color: "var(--studio-muted, #a1a1aa)",
        fontSize: 10,
      }}
    >
      {label}
      {children}
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 9,
        fontSize: 10,
      }}
    >
      <span style={{ color: "var(--studio-muted, #a1a1aa)" }}>
        {label}
      </span>
      <span
        title={value}
        style={{
          maxWidth: "60%",
          overflowWrap: "anywhere",
          textAlign: "right",
          color: "var(--studio-text, #f4f4f5)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: 0,
  minWidth: 0,
  background: "var(--studio-panel, #151515)",
  color: "var(--studio-text, #f4f4f5)",
};

const headerStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid var(--studio-border, #2a2a2a)",
  fontSize: 13,
  fontWeight: 650,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  padding: "8px",
  border: "1px solid var(--studio-border, #333)",
  borderRadius: 6,
  outline: "none",
  background: "var(--studio-surface, #202020)",
  color: "var(--studio-text, #f4f4f5)",
  fontSize: 11,
};

const iconButtonStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: 28,
  height: 28,
  border: "1px solid var(--studio-border, #333)",
  borderRadius: 6,
  background: "var(--studio-surface, #202020)",
  color: "var(--studio-muted, #a1a1aa)",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  padding: "9px 10px",
  border: "1px solid var(--studio-border, #333)",
  borderRadius: 6,
  background: "var(--studio-surface, #202020)",
  color: "var(--studio-text, #f4f4f5)",
  fontSize: 11,
  cursor: "pointer",
};
