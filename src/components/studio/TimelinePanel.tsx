





"use client";

import { useMemo, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  AudioLines,
  Film,
  Image as ImageIcon,
  Layers,
  Plus,
  Scissors,
  Trash2,
} from "lucide-react";

import type { Clip, TrackKind } from "@/lib/studio/types";
import { formatTime } from "@/lib/studio/utils";

interface TimelinePanelProps {
  clips: Clip[];
  selectedClipId: string | null;
  playhead: number;
  duration: number;
  zoom?: number;
  onSelectClip: (clipId: string) => void;
  onSeek: (time: number) => void;
  onMoveClip?: (clipId: string, newStart: number) => void;
  onDeleteClip?: (clipId: string) => void;
  onSplitClip?: (clipId: string, time: number) => void;
  onAddMedia?: () => void;
  className?: string;
}

const TRACKS: {
  id: TrackKind;
  label: string;
  color: string;
  icon: typeof Film;
}[] = [
  {
    id: "video",
    label: "Video",
    color: "#7c3aed",
    icon: Film,
  },
  {
    id: "audio",
    label: "Audio",
    color: "#0891b2",
    icon: AudioLines,
  },
  {
    id: "overlay",
    label: "Overlay / Images",
    color: "#16a34a",
    icon: Layers,
  },
];

const LABEL_WIDTH = 116;
const PIXELS_PER_SECOND = 48;
const TRACK_HEIGHT = 64;
const RULER_HEIGHT = 32;

interface DragState {
  clipId: string;
  startX: number;
  originalStart: number;
  moved: boolean;
}

export default function TimelinePanel({
  clips,
  selectedClipId,
  playhead,
  duration,
  zoom = 1,
  onSelectClip,
  onSeek,
  onMoveClip,
  onDeleteClip,
  onSplitClip,
  onAddMedia,
  className = "",
}: TimelinePanelProps) {
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

  const safeDuration = Math.max(
    10,
    duration,
    ...clips.map((clip) => clip.start + clip.duration),
  );

  const pixelsPerSecond = PIXELS_PER_SECOND * Math.max(0.25, zoom);
  const timelineWidth = safeDuration * pixelsPerSecond;

  const ticks = useMemo(() => {
    const result: number[] = [];
    const interval = safeDuration > 120 ? 10 : safeDuration > 60 ? 5 : 1;

    for (let time = 0; time <= safeDuration; time += interval) {
      result.push(time);
    }

    return result;
  }, [safeDuration]);

  const getTrackClips = (track: TrackKind) =>
    clips.filter((clip) => clip.track === track);

  const seekFromPointer = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;

    onSeek(
      Math.max(0, Math.min(safeDuration, offsetX / pixelsPerSecond)),
    );
  };

  const selectedClip = clips.find(
    (clip) => clip.id === selectedClipId,
  );

  const splitSelectedClip = () => {
    if (!selectedClip || !onSplitClip) return;

    const clipEnd = selectedClip.start + selectedClip.duration;

    if (
      playhead > selectedClip.start + 0.1 &&
      playhead < clipEnd - 0.1
    ) {
      onSplitClip(selectedClip.id, playhead);
    }
  };

  const handleClipPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    clip: Clip,
  ) => {
    if (event.button !== 0) return;

    event.stopPropagation();
    onSelectClip(clip.id);

    if (!onMoveClip) return;

    dragRef.current = {
      clipId: clip.id,
      startX: event.clientX,
      originalStart: clip.start,
      moved: false,
    };

    suppressClickRef.current = false;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleClipPointerMove = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const drag = dragRef.current;

    if (!drag || !onMoveClip) return;

    const deltaX = event.clientX - drag.startX;

    if (Math.abs(deltaX) > 3) {
      drag.moved = true;
    }

    if (!drag.moved) return;

    const deltaSeconds = deltaX / pixelsPerSecond;
    const newStart = Math.max(
      0,
      Math.round((drag.originalStart + deltaSeconds) * 100) / 100,
    );

    onMoveClip(drag.clipId, newStart);
  };

  const handleClipPointerUp = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const drag = dragRef.current;

    if (drag?.moved) {
      suppressClickRef.current = true;
    }

    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleClipClick = (clipId: string) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    onSelectClip(clipId);
  };

  return (
    <section
      className={className}
      aria-label="Video editing timeline"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
        overflow: "hidden",
        border: "1px solid var(--studio-border, #303030)",
        borderRadius: 12,
        background: "var(--studio-panel, #151515)",
        color: "var(--studio-text, #f5f5f5)",
      }}
    >
      {/* Timeline header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          padding: "12px 14px",
          borderBottom: "1px solid var(--studio-border, #303030)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Layers size={17} />
          <strong style={{ fontSize: 14 }}>Timeline</strong>
          <span style={{ fontSize: 12, opacity: 0.6 }}>
            {clips.length} clip{clips.length === 1 ? "" : "s"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {onSplitClip && (
            <button
              type="button"
              onClick={splitSelectedClip}
              disabled={
                !selectedClip ||
                playhead <= selectedClip.start + 0.1 ||
                playhead >=
                  selectedClip.start + selectedClip.duration - 0.1
              }
              style={actionButtonStyle}
              title="Split selected clip at the playhead"
            >
              <Scissors size={14} />
              Split
            </button>
          )}

          {selectedClip && onDeleteClip && (
            <button
              type="button"
              onClick={() => onDeleteClip(selectedClip.id)}
              style={actionButtonStyle}
              title="Delete selected clip"
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}

          {onAddMedia && (
            <button
              type="button"
              onClick={onAddMedia}
              style={{
                ...actionButtonStyle,
                background: "var(--studio-accent, #7c3aed)",
                borderColor: "transparent",
                color: "#fff",
              }}
            >
              <Plus size={14} />
              Add media
            </button>
          )}
        </div>
      </div>

      {/* Scrollable tracks */}
      <div
        style={{
          overflow: "auto",
          maxHeight: 360,
          position: "relative",
        }}
      >
        <div
          style={{
            minWidth: LABEL_WIDTH + timelineWidth,
            position: "relative",
          }}
        >
          {/* Time ruler */}
          <div
            style={{
              display: "flex",
              position: "sticky",
              top: 0,
              zIndex: 5,
              height: RULER_HEIGHT,
              background: "var(--studio-panel, #151515)",
              borderBottom: "1px solid var(--studio-border, #303030)",
            }}
          >
            <div
              style={{
                position: "sticky",
                left: 0,
                zIndex: 7,
                flex: `0 0 ${LABEL_WIDTH}px`,
                width: LABEL_WIDTH,
                background: "var(--studio-panel, #151515)",
                borderRight: "1px solid var(--studio-border, #303030)",
                padding: "8px 12px",
                boxSizing: "border-box",
                fontSize: 10,
                opacity: 0.6,
              }}
            >
              TRACK / TIME
            </div>

            <div
              onClick={seekFromPointer}
              style={{
                position: "relative",
                width: timelineWidth,
                height: RULER_HEIGHT,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {ticks.map((time) => (
                <div
                  key={time}
                  style={{
                    position: "absolute",
                    left: time * pixelsPerSecond,
                    top: 0,
                    height: RULER_HEIGHT,
                    borderLeft: "1px solid #444",
                    paddingLeft: 4,
                    fontSize: 10,
                    color: "#aaa",
                    boxSizing: "border-box",
                    paddingTop: 9,
                  }}
                >
                  {formatTime(time)}
                </div>
              ))}
            </div>
          </div>

          {/* Track rows */}
          {TRACKS.map((track) => {
            const Icon = track.icon;
            const trackClips = getTrackClips(track.id);

            return (
              <div
                key={track.id}
                style={{
                  display: "flex",
                  height: TRACK_HEIGHT,
                  borderBottom: "1px solid var(--studio-border, #303030)",
                }}
              >
                <div
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 3,
                    flex: `0 0 ${LABEL_WIDTH}px`,
                    width: LABEL_WIDTH,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 12px",
                    boxSizing: "border-box",
                    background: "var(--studio-panel, #151515)",
                    borderRight: "1px solid var(--studio-border, #303030)",
                    fontSize: 12,
                  }}
                >
                  <Icon size={15} color={track.color} />
                  <span>{track.label}</span>
                </div>

                <div
                  style={{
                    width: timelineWidth,
                    height: TRACK_HEIGHT,
                    position: "relative",
                    flexShrink: 0,
                    backgroundImage:
                      "repeating-linear-gradient(to right, transparent 0, transparent " +
                      `${pixelsPerSecond - 1}px, rgba(255,255,255,0.05) ${pixelsPerSecond - 1}px, rgba(255,255,255,0.05) ${pixelsPerSecond}px)`,
                  }}
                  onDoubleClick={seekFromPointer}
                >
                  {trackClips.map((clip) => {
                    const selected = clip.id === selectedClipId;
                    const clipWidth = Math.max(
                      12,
                      clip.duration * pixelsPerSecond,
                    );

                    const draggable = Boolean(onMoveClip);

                    return (
                      <button
                        key={clip.id}
                        type="button"
                        title={
                          `${clip.name} — ${formatTime(clip.duration)}` +
                          (draggable
                            ? "\nDrag left or right to change its start time."
                            : "")
                        }
                        onClick={() => handleClipClick(clip.id)}
                        onPointerDown={(event) =>
                          handleClipPointerDown(event, clip)
                        }
                        onPointerMove={handleClipPointerMove}
                        onPointerUp={handleClipPointerUp}
                        onPointerCancel={() => {
                          dragRef.current = null;
                        }}
                        style={{
                          position: "absolute",
                          left: clip.start * pixelsPerSecond,
                          top: 8,
                          width: clipWidth,
                          height: TRACK_HEIGHT - 16,
                          overflow: "hidden",
                          textAlign: "left",
                          padding: "6px 8px",
                          borderRadius: 6,
                          border: selected
                            ? "2px solid #fff"
                            : `1px solid ${track.color}`,
                          background: `${track.color}${selected ? "cc" : "88"}`,
                          color: "#fff",
                          cursor: draggable ? "grab" : "pointer",
                          touchAction: "none",
                          userSelect: "none",
                          boxSizing: "border-box",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          fontSize: 11,
                          boxShadow: selected
                            ? "0 0 0 2px rgba(255,255,255,0.12)"
                            : "none",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            overflow: "hidden",
                          }}
                        >
                          {clip.kind === "image" ? (
                            <ImageIcon size={12} />
                          ) : clip.kind === "audio" ? (
                            <AudioLines size={12} />
                          ) : (
                            <Film size={12} />
                          )}

                          <span
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {clip.name}
                          </span>
                        </span>

                        {clipWidth > 95 && (
                          <span style={{ fontSize: 10, opacity: 0.8 }}>
                            {formatTime(clip.duration)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Playhead */}
          <div
            style={{
              position: "absolute",
              zIndex: 8,
              top: RULER_HEIGHT,
              bottom: 0,
              left: LABEL_WIDTH + playhead * pixelsPerSecond,
              width: 1,
              background: "#f43f5e",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -RULER_HEIGHT,
                left: -5,
                width: 11,
                height: 11,
                borderRadius: 2,
                background: "#f43f5e",
              }}
            />
          </div>
        </div>
      </div>

      {/* Timeline footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          padding: "9px 14px",
          fontSize: 11,
          opacity: 0.7,
        }}
      >
        <span>Playhead: {formatTime(playhead)}</span>
        <span>Project duration: {formatTime(duration)}</span>
      </div>
    </section>
  );
}

const actionButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  minHeight: 30,
  padding: "5px 9px",
  border: "1px solid var(--studio-border, #303030)",
  borderRadius: 7,
  background: "transparent",
  color: "var(--studio-text, #f5f5f5)",
  fontSize: 11,
  cursor: "pointer",
};
