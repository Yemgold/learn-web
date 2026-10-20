



"use client";

import { useCallback, useMemo, useState } from "react";

import type { Clip } from "@/lib/studio/types";
import {
  clamp,
  createStudioId,
  getTimelineDuration,
  sortClipsByStart,
} from "@/lib/studio/utils";

interface UseTimelineOptions {
  initialClips?: Clip[];
  initialPlayhead?: number;
}

interface SplitClipResult {
  originalClip: Clip;
  newClip: Clip;
}

export function useTimeline(options: UseTimelineOptions = {}) {
  const [clips, setClips] = useState<Clip[]>(
    options.initialClips ?? [],
  );

  const [selectedClipId, setSelectedClipId] = useState<string | null>(
    null,
  );

  const [playhead, setPlayhead] = useState(
    Math.max(0, options.initialPlayhead ?? 0),
  );

  const sortedClips = useMemo(
    () => sortClipsByStart(clips),
    [clips],
  );

  const timelineDuration = useMemo(
    () => getTimelineDuration(clips),
    [clips],
  );

  const selectedClip = useMemo(
    () => clips.find((clip) => clip.id === selectedClipId) ?? null,
    [clips, selectedClipId],
  );

  const selectClip = useCallback((clipId: string | null) => {
    setSelectedClipId(clipId);
  }, []);

  const addClip = useCallback((clip: Clip) => {
    setClips((current) => [...current, clip]);
    setSelectedClipId(clip.id);
  }, []);

  const addClips = useCallback((newClips: Clip[]) => {
    if (newClips.length === 0) return;

    setClips((current) => [...current, ...newClips]);
    setSelectedClipId(newClips[newClips.length - 1].id);
  }, []);

  const updateClip = useCallback(
    (clipId: string, updates: Partial<Clip>) => {
      setClips((current) =>
        current.map((clip) =>
          clip.id === clipId ? { ...clip, ...updates } : clip,
        ),
      );
    },
    [],
  );

  const updateSelectedClip = useCallback(
    (updates: Partial<Clip>) => {
      if (!selectedClipId) return;

      updateClip(selectedClipId, updates);
    },
    [selectedClipId, updateClip],
  );

  const removeClip = useCallback((clipId: string) => {
    setClips((current) =>
      current.filter((clip) => clip.id !== clipId),
    );

    setSelectedClipId((current) =>
      current === clipId ? null : current,
    );
  }, []);

  const deleteSelectedClip = useCallback(() => {
    if (!selectedClipId) return;

    removeClip(selectedClipId);
  }, [selectedClipId, removeClip]);

  const moveClip = useCallback(
    (clipId: string, start: number) => {
      updateClip(clipId, {
        start: Math.max(0, start),
      });
    },
    [updateClip],
  );

  const trimClipStart = useCallback(
    (clipId: string, newStart: number) => {
      const clip = clips.find((item) => item.id === clipId);

      if (!clip) return;

      const originalEnd = clip.start + clip.duration;
      const safeStart = clamp(newStart, 0, originalEnd - 0.1);

      updateClip(clipId, {
        start: safeStart,
        duration: originalEnd - safeStart,
        trimStart:
          clip.trimStart + Math.max(0, safeStart - clip.start),
      });
    },
    [clips, updateClip],
  );

  const trimClipEnd = useCallback(
    (clipId: string, newEnd: number) => {
      const clip = clips.find((item) => item.id === clipId);

      if (!clip) return;

      const originalEnd = clip.start + clip.duration;
      const safeEnd = clamp(newEnd, clip.start + 0.1, originalEnd);

      updateClip(clipId, {
        duration: safeEnd - clip.start,
        trimEnd:
          clip.trimEnd + Math.max(0, originalEnd - safeEnd),
      });
    },
    [clips, updateClip],
  );

  const splitClip = useCallback(
    (clipId: string, splitAt: number): SplitClipResult | null => {
      const clip = clips.find((item) => item.id === clipId);

      if (!clip) return null;

      const clipEnd = clip.start + clip.duration;
      const safeSplitAt = clamp(
        splitAt,
        clip.start + 0.1,
        clipEnd - 0.1,
      );

      if (
        safeSplitAt <= clip.start ||
        safeSplitAt >= clipEnd
      ) {
        return null;
      }

      const firstDuration = safeSplitAt - clip.start;
      const secondDuration = clipEnd - safeSplitAt;

      const originalClip: Clip = {
        ...clip,
        duration: firstDuration,
        trimEnd: clip.trimEnd + secondDuration,
      };

      const newClip: Clip = {
        ...clip,
        id: createStudioId("clip"),
        start: safeSplitAt,
        duration: secondDuration,
        trimStart: clip.trimStart + firstDuration,
      };

      setClips((current) =>
        current.map((item) =>
          item.id === clipId ? originalClip : item,
        ).concat(newClip),
      );

      setSelectedClipId(newClip.id);

      return {
        originalClip,
        newClip,
      };
    },
    [clips],
  );

  const seek = useCallback(
    (time: number) => {
      setPlayhead(clamp(time, 0, Math.max(timelineDuration, time)));
    },
    [timelineDuration],
  );

  const resetPlayhead = useCallback(() => {
    setPlayhead(0);
  }, []);

  const clearTimeline = useCallback(() => {
    setClips([]);
    setSelectedClipId(null);
    setPlayhead(0);
  }, []);

  const replaceClips = useCallback((newClips: Clip[]) => {
    setClips(newClips);
    setSelectedClipId(null);
    setPlayhead(0);
  }, []);

  return {
    clips,
    sortedClips,
    selectedClip,
    selectedClipId,
    playhead,
    timelineDuration,

    setClips,
    setPlayhead,

    selectClip,
    addClip,
    addClips,
    updateClip,
    updateSelectedClip,
    removeClip,
    deleteSelectedClip,
    moveClip,
    trimClipStart,
    trimClipEnd,
    splitClip,
    seek,
    resetPlayhead,
    clearTimeline,
    replaceClips,
  };
}