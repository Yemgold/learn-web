


"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Lightbulb,
  ListChecks,
  Loader2,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  getAiVideoLesson,
  getAiVideoLessons,
  type AiVideoLesson,
  type LessonScene,
} from "@/lib/storage/ai-video-lessons";

/* =========================================================
   HELPERS
========================================================= */

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;

  return `${minutes}:${remaining
    .toString()
    .padStart(2, "0")}`;
}

function estimateNarrationDuration(
  narration: string,
  speakingRate = 0.92,
) {
  const words = narration
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  if (!words) {
    return 3;
  }

  const wordsPerMinute = 150 * speakingRate;

  return Math.max(
    3,
    Math.ceil((words / wordsPerMinute) * 60),
  );
}

function getLessonEstimatedDuration(
  scenes: LessonScene[],
  speakingRate = 0.92,
) {
  return scenes.reduce((total, scene) => {
    return (
      total +
      estimateNarrationDuration(
        scene.narration,
        speakingRate,
      )
    );
  }, 0);
}

/* =========================================================
   MOCK AI VIDEO PLAYER
========================================================= */

type MockAiVideoPlayerProps = {
  lesson: AiVideoLesson;
};

function MockAiVideoPlayer({
  lesson,
}: MockAiVideoPlayerProps) {
  const scenes = lesson.scenes ?? [];

  const [activeScene, setActiveScene] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  const [sceneElapsedSeconds, setSceneElapsedSeconds] =
    useState(0);

  const [narrationProgress, setNarrationProgress] =
    useState(0);

  const [availableVoices, setAvailableVoices] =
    useState<SpeechSynthesisVoice[]>([]);

  const [speechSupported, setSpeechSupported] =
    useState(true);

  const [speechError, setSpeechError] =
    useState("");

  /*
   * Every speech request receives a new ID.
   *
   * If an old utterance finishes after the user has
   * changed scenes, its callbacks are ignored.
   */
  const speechRunIdRef = useRef(0);

  /*
   * Current browser utterance.
   */
  const utteranceRef =
    useRef<SpeechSynthesisUtterance | null>(null);

  /*
   * Latest mute state.
   */
  const isMutedRef = useRef(false);

  /*
   * Progress timer.
   *
   * This timer ONLY updates the progress display.
   *
   * It NEVER changes the active scene.
   */
  const progressTimerRef =
    useRef<ReturnType<typeof setInterval> | null>(
      null,
    );

  /*
   * Used to keep progress accurate when pause/resume
   * occurs.
   */
  const lastProgressTickRef =
    useRef<number | null>(null);

  /* =======================================================
     CURRENT SCENE
  ======================================================= */

  const currentScene =
    scenes[activeScene] ?? null;

  /* =======================================================
     ESTIMATED CURRENT SCENE DURATION
  ======================================================= */

  const estimatedSceneDuration = useMemo(() => {
    if (!currentScene) {
      return 0;
    }

    return estimateNarrationDuration(
      currentScene.narration,
      lesson.voice?.speakingRate ?? 0.92,
    );
  }, [
    currentScene,
    lesson.voice?.speakingRate,
  ]);

  /* =======================================================
     TOTAL ESTIMATED LESSON DURATION
  ======================================================= */

  const estimatedLessonDuration = useMemo(() => {
    return getLessonEstimatedDuration(
      scenes,
      lesson.voice?.speakingRate ?? 0.92,
    );
  }, [
    scenes,
    lesson.voice?.speakingRate,
  ]);

  /* =======================================================
     LOAD SPEECH SYNTHESIS VOICES
  ======================================================= */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const supported =
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window;

    setSpeechSupported(supported);

    if (!supported) {
      return;
    }

    const loadVoices = () => {
      setAvailableVoices(
        window.speechSynthesis.getVoices(),
      );
    };

    loadVoices();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      loadVoices,
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        loadVoices,
      );
    };
  }, []);

  /* =======================================================
     KEEP MUTE REF UPDATED
  ======================================================= */

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  /* =======================================================
     FIND BEST BROWSER VOICE
  ======================================================= */

  const findBestVoice = useCallback(() => {
    if (availableVoices.length === 0) {
      return null;
    }

    const configuredName =
      lesson.voice?.name?.toLowerCase() ?? "";

    const configuredProviderVoice =
      lesson.voice?.providerVoiceId?.toLowerCase() ??
      "";

    /*
     * Try matching configured application voice.
     */
    const nameMatch = availableVoices.find(
      (voice) => {
        const browserName =
          voice.name.toLowerCase();

        return (
          browserName.includes(
            configuredName,
          ) ||
          configuredName.includes(
            browserName,
          )
        );
      },
    );

    if (nameMatch) {
      return nameMatch;
    }

    /*
     * Try provider voice ID.
     */
    if (configuredProviderVoice) {
      const providerMatch =
        availableVoices.find((voice) =>
          voice.name
            .toLowerCase()
            .includes(
              configuredProviderVoice,
            ),
        );

      if (providerMatch) {
        return providerMatch;
      }
    }

    /*
     * Prefer English.
     */
    const englishVoice =
      availableVoices.find((voice) =>
        voice.lang
          .toLowerCase()
          .startsWith("en"),
      );

    if (englishVoice) {
      return englishVoice;
    }

    return availableVoices[0] ?? null;
  }, [
    availableVoices,
    lesson.voice?.name,
    lesson.voice?.providerVoiceId,
  ]);

  /* =======================================================
     CANCEL SPEECH
  ======================================================= */

  const cancelSpeech = useCallback(() => {
    /*
     * Invalidate the current utterance FIRST.
     *
     * This prevents the old onend callback from advancing
     * to another scene after cancellation.
     */
    speechRunIdRef.current += 1;

    if (
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    utteranceRef.current = null;

    setIsSpeaking(false);

    lastProgressTickRef.current = null;
  }, []);

  /* =======================================================
     STOP PROGRESS TIMER
  ======================================================= */

  const stopProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(
        progressTimerRef.current,
      );

      progressTimerRef.current = null;
    }

    lastProgressTickRef.current = null;
  }, []);

  /* =======================================================
     START PROGRESS TIMER
     
     IMPORTANT:
     This timer NEVER changes activeScene.
  ======================================================= */

  const startProgressTimer = useCallback(() => {
    stopProgressTimer();

    lastProgressTickRef.current =
      Date.now();

    progressTimerRef.current =
      setInterval(() => {
        if (!currentScene) {
          return;
        }

        const now = Date.now();

        const previous =
          lastProgressTickRef.current ??
          now;

        const delta =
          (now - previous) / 1000;

        lastProgressTickRef.current = now;

        setSceneElapsedSeconds(
          (previousValue) => {
            return Math.min(
              estimatedSceneDuration,
              previousValue + delta,
            );
          },
        );
      }, 250);
  }, [
    currentScene,
    estimatedSceneDuration,
    stopProgressTimer,
  ]);

  /* =======================================================
     SPEAK SCENE
     
     THIS IS THE CORE OF THE SYNCHRONIZATION.
  ======================================================= */

  const speakScene = useCallback(
    (sceneIndex: number) => {
      if (!speechSupported) {
        setSpeechError(
          "Speech synthesis is not supported by this browser.",
        );

        setIsPlaying(false);
        setIsSpeaking(false);

        return;
      }

      const scene = scenes[sceneIndex];

      if (!scene) {
        setIsPlaying(false);
        setIsSpeaking(false);

        return;
      }

      if (isMutedRef.current) {
        return;
      }

      /*
       * Create a new speech run.
       */
      const runId =
        speechRunIdRef.current + 1;

      speechRunIdRef.current = runId;

      /*
       * Cancel anything that may still be speaking.
       */
      window.speechSynthesis.cancel();

      utteranceRef.current = null;

      stopProgressTimer();

      /*
       * The visual scene changes BEFORE its narration
       * starts.
       */
      setActiveScene(sceneIndex);

      setSceneElapsedSeconds(0);

      setNarrationProgress(0);

      setSpeechError("");

      setIsPlaying(true);

      setIsSpeaking(false);

      const utterance =
        new SpeechSynthesisUtterance(
          scene.narration,
        );

      utteranceRef.current =
        utterance;

      /*
       * Configure browser voice.
       */
      const browserVoice =
        findBestVoice();

      if (browserVoice) {
        utterance.voice =
          browserVoice;

        utterance.lang =
          browserVoice.lang;
      } else {
        utterance.lang =
          lesson.voice?.language ||
          "en-US";
      }

      utterance.rate =
        lesson.voice?.speakingRate ??
        0.92;

      utterance.pitch =
        lesson.voice?.pitch ?? 1;

      utterance.volume = 1;

      /* =================================================
         SPEECH START
      ================================================= */

      utterance.onstart = () => {
        /*
         * Ignore stale utterances.
         */
        if (
          speechRunIdRef.current !==
          runId
        ) {
          return;
        }

        if (isMutedRef.current) {
          window.speechSynthesis.cancel();
          return;
        }

        setIsPlaying(true);

        setIsSpeaking(true);

        setSceneElapsedSeconds(0);

        setNarrationProgress(0);

        startProgressTimer();
      };

      /* =================================================
         SPEECH BOUNDARY
         
         This lets the progress bar follow actual speech
         when the browser provides character positions.
      ================================================= */

      utterance.onboundary = (event) => {
        if (
          speechRunIdRef.current !==
          runId
        ) {
          return;
        }

        const textLength =
          scene.narration.length;

        if (textLength <= 0) {
          return;
        }

        const charIndex =
          typeof event.charIndex ===
          "number"
            ? event.charIndex
            : 0;

        const progress =
          (charIndex / textLength) *
          100;

        setNarrationProgress(
          Math.min(
            99,
            Math.max(0, progress),
          ),
        );
      };

      /* =================================================
         SPEECH ERROR
      ================================================= */

      utterance.onerror = (event) => {
        if (
          speechRunIdRef.current !==
          runId
        ) {
          return;
        }

        /*
         * Cancellation caused by manually changing
         * scenes is expected.
         */
        if (
          event.error === "canceled" ||
          event.error === "interrupted"
        ) {
          return;
        }

        stopProgressTimer();

        setIsSpeaking(false);

        setIsPlaying(false);

        setSpeechError(
          "The browser could not play this teacher narration.",
        );
      };

      /* =================================================
         SPEECH END
         
         THIS IS THE ONLY PLACE AUTOMATIC SCENE
         ADVANCEMENT HAPPENS.
      ================================================= */

      utterance.onend = () => {
        /*
         * Ignore an old utterance.
         */
        if (
          speechRunIdRef.current !==
          runId
        ) {
          return;
        }

        stopProgressTimer();

        setNarrationProgress(100);

        setSceneElapsedSeconds(
          estimatedSceneDuration,
        );

        setIsSpeaking(false);

        utteranceRef.current = null;

        /*
         * Determine the next scene.
         */
        const nextSceneIndex =
          sceneIndex + 1;

        /*
         * There is another scene.
         */
        if (
          nextSceneIndex <
          scenes.length
        ) {
          /*
           * The CURRENT narration has finished.
           *
           * ONLY NOW do we switch the visual scene.
           */
          setActiveScene(
            nextSceneIndex,
          );

          setSceneElapsedSeconds(0);

          setNarrationProgress(0);

          /*
           * Wait a tiny amount so React renders the
           * next visual scene before its voice begins.
           */
          window.setTimeout(() => {
            /*
             * If another action invalidated this run,
             * do nothing.
             */
            if (
              speechRunIdRef.current !==
              runId
            ) {
              return;
            }

            /*
             * If the student muted the player after the
             * previous narration, stop here.
             */
            if (isMutedRef.current) {
              setIsPlaying(false);
              return;
            }

            /*
             * Start narration for the NEW scene.
             */
            speakScene(
              nextSceneIndex,
            );
          }, 100);

          return;
        }

        /*
         * No more scenes.
         *
         * Lesson is complete.
         */
        setIsPlaying(false);

        setIsSpeaking(false);

        setNarrationProgress(100);

        setSceneElapsedSeconds(
          estimatedSceneDuration,
        );
      };

      /*
       * Start the voice.
       */
      window.speechSynthesis.speak(
        utterance,
      );
    },
    [
      estimatedSceneDuration,
      findBestVoice,
      lesson.voice?.language,
      lesson.voice?.pitch,
      lesson.voice?.speakingRate,
      scenes,
      speechSupported,
      startProgressTimer,
      stopProgressTimer,
    ],
  );

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      speechRunIdRef.current += 1;

      stopProgressTimer();

      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      utteranceRef.current = null;
    };
  }, [stopProgressTimer]);

  /* =======================================================
     RESET WHEN LESSON CHANGES
  ======================================================= */

  useEffect(() => {
    cancelSpeech();

    stopProgressTimer();

    setActiveScene(0);

    setIsPlaying(false);

    setIsSpeaking(false);

    setSceneElapsedSeconds(0);

    setNarrationProgress(0);

    setSpeechError("");
  }, [
    lesson.id,
    cancelSpeech,
    stopProgressTimer,
  ]);

  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  const handlePlayPause = () => {
    if (!speechSupported) {
      setSpeechError(
        "Speech synthesis is not supported by this browser.",
      );

      return;
    }

    /*
     * Currently speaking → pause.
     */
    if (
      isPlaying &&
      isSpeaking &&
      window.speechSynthesis.speaking
    ) {
      window.speechSynthesis.pause();

      stopProgressTimer();

      setIsPlaying(false);

      return;
    }

    /*
     * Currently paused → resume.
     */
    if (
      !isPlaying &&
      window.speechSynthesis.paused &&
      utteranceRef.current
    ) {
      window.speechSynthesis.resume();

      setIsPlaying(true);

      setIsSpeaking(true);

      startProgressTimer();

      return;
    }

    /*
     * Nothing active → start current scene.
     */
    speakScene(activeScene);
  };

  /* =======================================================
     GO TO SCENE
  ======================================================= */

  const goToScene = (
    sceneIndex: number,
  ) => {
    if (
      sceneIndex < 0 ||
      sceneIndex >= scenes.length
    ) {
      return;
    }

    /*
     * Remember whether the student was actively
     * listening before changing scene.
     */
    const wasPlaying =
      isPlaying || isSpeaking;

    /*
     * Cancel old narration first.
     *
     * This is critical.
     */
    cancelSpeech();

    stopProgressTimer();

    /*
     * Immediately display the selected visual.
     */
    setActiveScene(sceneIndex);

    setSceneElapsedSeconds(0);

    setNarrationProgress(0);

    setSpeechError("");

    /*
     * If the player was running, start narration for
     * the selected scene.
     */
    if (
      wasPlaying &&
      !isMutedRef.current
    ) {
      window.setTimeout(() => {
        if (!isMutedRef.current) {
          speakScene(sceneIndex);
        }
      }, 100);
    } else {
      setIsPlaying(false);
    }
  };

  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handlePrevious = () => {
    if (activeScene <= 0) {
      return;
    }

    goToScene(activeScene - 1);
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (
      activeScene >=
      scenes.length - 1
    ) {
      return;
    }

    goToScene(activeScene + 1);
  };

  /* =======================================================
     RESTART
  ======================================================= */

  const handleRestart = () => {
    cancelSpeech();

    stopProgressTimer();

    setActiveScene(0);

    setSceneElapsedSeconds(0);

    setNarrationProgress(0);

    setSpeechError("");

    if (!isMutedRef.current) {
      window.setTimeout(() => {
        speakScene(0);
      }, 100);
    }
  };

  /* =======================================================
     MUTE
  ======================================================= */

  const handleMute = () => {
    if (isMuted) {
      /*
       * Unmute.
       *
       * Keep the current scene.
       * User can press play.
       */
      setIsMuted(false);

      isMutedRef.current = false;

      return;
    }

    /*
     * Mute immediately.
     */
    setIsMuted(true);

    isMutedRef.current = true;

    cancelSpeech();

    stopProgressTimer();

    setIsPlaying(false);

    setIsSpeaking(false);
  };

  /* =======================================================
     NO SCENES
  ======================================================= */

  if (!currentScene) {
    return (
      <div className="rounded-3xl border bg-card p-8 text-center">
        <Wand2 className="mx-auto h-10 w-10 text-primary" />

        <h2 className="mt-4 text-xl font-bold">
          AI lesson is being prepared
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          This lesson does not contain generated
          teaching scenes yet.
        </p>
      </div>
    );
  }

  /* =======================================================
     PLAYER
  ======================================================= */

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border bg-black shadow-xl">
        {/* =================================================
            PLAYER HEADER
        ================================================== */}

        <div className="flex flex-col gap-3 border-b border-white/10 bg-black/80 px-4 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              <Wand2 className="h-4 w-4" />

              AI Teacher

              <span className="text-white/20">
                •
              </span>

              {lesson.subject}
            </div>

            <h2 className="mt-1 truncate text-base font-bold sm:text-lg">
              {lesson.title}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80">
              {lesson.voice?.name ??
                "AI Teacher"}
            </div>
          </div>
        </div>

        {/* =================================================
            VIDEO STAGE
        ================================================== */}

        <div className="relative aspect-video overflow-hidden bg-slate-950">
          {/* Background */}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.16),transparent_30%)]" />

          {/* Scene number */}

          <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur">
            <span
              className={`h-2 w-2 rounded-full ${
                isSpeaking
                  ? "animate-pulse bg-green-400"
                  : "bg-white/40"
              }`}
            />

            Scene {activeScene + 1} of{" "}
            {scenes.length}
          </div>

          {/* =================================================
              MAIN SCENE
          ================================================== */}

          <div className="absolute inset-0 flex items-center justify-center p-4 pb-24 pt-16 sm:p-8 sm:pb-24">
            <div className="grid h-full w-full max-w-6xl gap-4 sm:grid-cols-[190px_minmax(0,1fr)]">
              {/* =================================================
                  AI TEACHER
              ================================================== */}

              <div className="flex flex-col items-center justify-center">
                <div
                  className={`relative aspect-[4/5] w-full max-w-[180px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl ${
                    isSpeaking
                      ? "ring-2 ring-primary/70"
                      : ""
                  }`}
                >
                  {lesson.teacher?.avatarUrl ? (
                    <img
                      src={
                        lesson.teacher.avatarUrl
                      }
                      alt={
                        lesson.teacher.name ||
                        "AI Teacher"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Wand2 className="h-12 w-12 text-white/30" />
                    </div>
                  )}

                  {isSpeaking && (
                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

                      Speaking
                    </div>
                  )}
                </div>

                <p className="mt-3 text-center text-sm font-semibold text-white">
                  {lesson.teacher?.name ??
                    "AI Teacher"}
                </p>

                <p className="mt-1 text-center text-xs text-white/50">
                  {lesson.voice?.name ??
                    "Natural Voice"}
                </p>
              </div>

              {/* =================================================
                  CURRENT SCENE CONTENT
              ================================================== */}

              <div className="flex min-h-0 items-center">
                <div className="flex max-h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur sm:p-6">
                  {/* Scene heading */}

                  <div className="mb-4 shrink-0">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <BookOpen className="h-4 w-4" />

                      {currentScene.title}
                    </div>

                    <h3 className="text-xl font-bold leading-tight text-white sm:text-3xl">
                      {currentScene.title}
                    </h3>
                  </div>

                  {/* =================================================
                      NARRATION INSIDE THE SCENE
                  ================================================== */}

                  <div className="min-h-0 overflow-y-auto rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                        Teacher Narration
                      </span>

                      {isSpeaking && (
                        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />

                          Now speaking
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
                      {currentScene.narration}
                    </p>
                  </div>

                  {/* =================================================
                      VISUAL INSTRUCTION
                  ================================================== */}

                  <div className="mt-3 shrink-0 rounded-2xl border border-white/10 bg-primary/5 p-3 sm:p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-300" />

                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                        Visual
                      </span>
                    </div>

                    <p className="text-xs leading-5 text-white/60">
                      {currentScene.visualInstruction}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              VOICE STATUS
          ================================================== */}

          <div className="absolute bottom-[72px] left-4 right-4 z-20 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs text-white backdrop-blur">
              {isSpeaking ? (
                <>
                  <Volume2 className="h-4 w-4 shrink-0 text-green-400" />

                  <span className="truncate">
                    {lesson.voice?.name ??
                      "AI Teacher"}{" "}
                    is teaching
                  </span>
                </>
              ) : isMuted ? (
                <>
                  <VolumeX className="h-4 w-4 shrink-0 text-white/50" />

                  <span>Voice muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 shrink-0 text-white/50" />

                  <span>Ready to teach</span>
                </>
              )}
            </div>

            <div className="hidden rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs text-white/60 backdrop-blur sm:block">
              {formatTime(
                sceneElapsedSeconds,
              )}{" "}
              /{" "}
              {formatTime(
                estimatedSceneDuration,
              )}
            </div>
          </div>

          {/* =================================================
              CONTROLS
          ================================================== */}

          <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/90 to-transparent px-4 pb-4 pt-8">
            {/* Progress */}

            <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-200"
                style={{
                  width: `${narrationProgress}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              {/* Left controls */}

              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={
                    handlePrevious
                  }
                  disabled={
                    activeScene === 0
                  }
                  className="text-white hover:bg-white/10 hover:text-white disabled:text-white/20"
                  aria-label="Previous scene"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={
                    handlePlayPause
                  }
                  className="h-10 w-10 rounded-full bg-white text-black hover:bg-white/90"
                  aria-label={
                    isPlaying
                      ? "Pause"
                      : "Play"
                  }
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 fill-current" />
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  disabled={
                    activeScene >=
                    scenes.length - 1
                  }
                  className="text-white hover:bg-white/10 hover:text-white disabled:text-white/20"
                  aria-label="Next scene"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={
                    handleRestart
                  }
                  className="hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex"
                  aria-label="Restart lesson"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Scene counter */}

              <div className="text-xs font-medium text-white/60">
                Scene {activeScene + 1} /{" "}
                {scenes.length}
              </div>

              {/* Right controls */}

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleMute}
                className="text-white hover:bg-white/10 hover:text-white"
                aria-label={
                  isMuted
                    ? "Unmute voice"
                    : "Mute voice"
                }
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* =================================================
            SPEECH ERROR
        ================================================== */}

        {speechError && (
          <div className="border-t border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {speechError}
          </div>
        )}

        {!speechSupported && (
          <div className="border-t border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-xs text-yellow-100">
            Your browser does not support speech
            synthesis. You can still view the lesson
            scenes manually.
          </div>
        )}
      </div>

      {/* =====================================================
          SCENE TIMELINE
      ====================================================== */}

      <div className="rounded-3xl border bg-card p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold">
              Lesson Scenes
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Each scene remains visible until its
              teacher narration finishes.
            </p>
          </div>

          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Clock3 className="h-4 w-4" />

            ~
            {formatTime(
              estimatedLessonDuration,
            )}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {scenes.map(
            (scene, index) => {
              const isCurrent =
                index === activeScene;

              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() =>
                    goToScene(index)
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    isCurrent
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold">
                        {scene.title}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {scene.narration}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock3 className="h-3 w-3" />

                        ~
                        {formatTime(
                          estimateNarrationDuration(
                            scene.narration,
                            lesson.voice
                              ?.speakingRate ??
                              0.92,
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AiVideoLessonPage() {
  const params = useParams();

  const videoId = String(
    params?.videoId ?? "",
  );

  const [lesson, setLesson] =
    useState<AiVideoLesson | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

  /* =======================================================
     LOAD LESSON
  ======================================================= */

const loadLesson = useCallback(() => {
  try {
    setIsLoading(true);
    setNotFound(false);

    let found: AiVideoLesson | null = null;

    /*
     * First try to load the exact lesson from local storage.
     */
    const storedLesson = getAiVideoLesson(videoId);

    if (storedLesson) {
      found = storedLesson;
    }

    /*
     * Fallback to the complete local lesson list.
     */
    if (!found) {
      const lessons = getAiVideoLessons();

      const matchedLesson = lessons.find(
        (item: AiVideoLesson) => item.id === videoId,
      );

      /*
       * Array.find() returns undefined when nothing matches.
       * Convert undefined to null so it matches the lesson state type.
       */
      found = matchedLesson ?? null;
    }

    /*
     * Handle missing lesson.
     */
    if (!found) {
      setLesson(null);
      setNotFound(true);
    } else {
      setLesson(found);
    }
  } catch (error) {
    console.error(
      "Failed to load AI video lesson:",
      error,
    );

    setLesson(null);
    setNotFound(true);
  } finally {
    setIsLoading(false);
  }
}, [videoId]);

useEffect(() => {
  loadLesson();
}, [loadLesson]);








  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />

            <span className="text-sm text-muted-foreground">
              Loading AI lesson...
            </span>
          </div>

          <div className="aspect-video animate-pulse rounded-3xl bg-muted" />
        </div>
      </main>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (notFound || !lesson) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Wand2 className="h-8 w-8 text-primary" />
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              AI Lesson Not Found
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              This AI video lesson is not available
              in the current lesson library.
            </p>

            <div className="mt-6 flex justify-center">
              <Link href="/student/question-ai-videos">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />

                  Back to AI Lessons
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN LESSON PAGE
  ======================================================= */

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            BACK
        ================================================== */}

        <div className="mb-6">
          <Link
            href="/student/question-ai-videos"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to AI Video Lessons
          </Link>
        </div>

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {lesson.subject}
            </span>

            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {lesson.topic}
            </span>

            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {lesson.difficulty}
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl text-2xl font-bold tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground sm:text-base">
            {lesson.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />

              {lesson.durationMinutes} minutes
            </span>

            <span className="inline-flex items-center gap-1.5">
              <ListChecks className="h-4 w-4" />

              {lesson.scenes?.length ?? 0} scenes
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Wand2 className="h-4 w-4" />

              AI Teacher
            </span>
          </div>
        </div>

        {/* =================================================
            PLAYER
        ================================================== */}

        <MockAiVideoPlayer lesson={lesson} />

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* =================================================
              MAIN CONTENT
          ================================================== */}

          <div className="space-y-6">
            {/* Learning objectives */}

            {lesson.objectives?.length > 0 && (
              <section className="rounded-3xl border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      Learning Objectives
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      What you should understand after
                      this lesson.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {lesson.objectives.map(
                    (objective) => (
                      <div
                        key={objective.id}
                        className="flex gap-3 rounded-2xl bg-muted/40 p-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                        <p className="text-sm leading-6">
                          {objective.text}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}

            {/* Step-by-step explanation */}

            {lesson.steps?.length > 0 && (
              <section className="rounded-3xl border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <ListChecks className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      Step-by-Step Explanation
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Follow the teacher's explanation.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {lesson.steps.map(
                    (step) => (
                      <div
                        key={step.id}
                        className="flex gap-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {step.number}
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {step.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {step.explanation}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}

            {/* Key points */}

            {lesson.keyPoints?.length > 0 && (
              <section className="rounded-3xl border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      Key Points
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Important ideas to remember.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {lesson.keyPoints.map(
                    (point) => (
                      <div
                        key={point.id}
                        className="rounded-2xl border bg-muted/20 p-4"
                      >
                        <p className="text-sm leading-6">
                          {point.text}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}

            {/* Summary */}

            {lesson.summary && (
              <section className="rounded-3xl border bg-card p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>

                  <h2 className="font-bold">
                    Lesson Summary
                  </h2>
                </div>

                <p className="mt-5 text-sm leading-7 text-muted-foreground">
                  {lesson.summary}
                </p>
              </section>
            )}

            {/* JAMB tips */}

            {lesson.jambTips && (
              <section className="rounded-3xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Wand2 className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      JAMB Exam Tip
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Exam-focused guidance from the AI
                      teacher.
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7">
                  {lesson.jambTips}
                </p>
              </section>
            )}
          </div>

          {/* =================================================
              SIDEBAR
          ================================================== */}

          <aside className="space-y-6">
            {/* Teacher */}

            <section className="rounded-3xl border bg-card p-5">
              <div className="flex items-center gap-3">
                {lesson.teacher?.avatarUrl ? (
                  <img
                    src={
                      lesson.teacher.avatarUrl
                    }
                    alt={
                      lesson.teacher.name ||
                      "AI Teacher"
                    }
                    className="h-14 w-14 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Wand2 className="h-6 w-6 text-primary" />
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    AI Teacher
                  </p>

                  <h3 className="font-bold">
                    {lesson.teacher?.name ??
                      "AI Teacher"}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {lesson.voice?.name ??
                      "Natural Voice"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">
                    Teaching style
                  </span>

                  <span className="font-medium capitalize">
                    {lesson.teachingStyle.replace(
                      /-/g,
                      " ",
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">
                    Visual style
                  </span>

                  <span className="font-medium capitalize">
                    {lesson.visualStyle}
                  </span>
                </div>
              </div>
            </section>

            {/* Lesson details */}

            <section className="rounded-3xl border bg-card p-5">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />

                <h2 className="font-bold">
                  Lesson Details
                </h2>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Subject
                  </span>

                  <span className="font-medium">
                    {lesson.subject}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Topic
                  </span>

                  <span className="text-right font-medium">
                    {lesson.topic}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Difficulty
                  </span>

                  <span className="font-medium">
                    {lesson.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Access
                  </span>

                  <span className="font-medium">
                    {lesson.accessType}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Scenes
                  </span>

                  <span className="font-medium">
                    {lesson.scenes?.length ?? 0}
                  </span>
                </div>
              </div>
            </section>

            {/* Keywords */}

            {lesson.keywords && (
              <section className="rounded-3xl border bg-card p-5">
                <h2 className="font-bold">
                  Topics Covered
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {lesson.keywords
                    .split(",")
                    .map((keyword) => {
                      const value =
                        keyword.trim();

                      if (!value) {
                        return null;
                      }

                      return (
                        <span
                          key={value}
                          className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground"
                        >
                          {value}
                        </span>
                      );
                    })}
                </div>
              </section>
            )}

            {/* Demo notice */}

            <div className="rounded-3xl border border-dashed bg-muted/20 p-4">
              <div className="flex gap-3">
                <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <div>
                  <p className="text-xs font-semibold">
                    AI Video Demo
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    This lesson is currently using the
                    browser's speech engine for the AI
                    teacher voice. The production version
                    can replace this with your real AI
                    voice and video service.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}