"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Coins,
  HelpCircle,
  Loader2,
  Target,
  type LucideIcon,
} from "lucide-react";

import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useCbtStore } from "@/stores/cbtStore";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  createPracticeSession,
  type PracticeMode,
} from "@/lib/api/practice";

import { getAllPracticeModes } from "@/lib/api/practice-modes";

/* ============================================================
   TYPES
   ============================================================ */

interface BackendPracticeMode {
  _id: string;
  name: string;
  description: string;
  timePerQuestion: number;
  awardedPointPerCorrectAnswer: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ModeOption {
  id: PracticeMode;
  backendId: string;
  name: string;
  description: string;
  icon: LucideIcon;
  secondsPerQuestion: number;
  pointsPerCorrect: number;
}

interface StoredPracticeConfig {
  subjectId: string;
  mode: PracticeMode;
  questionCount: number;
  duration: number;
  secondsPerQuestion: number;
  pointsPerCorrect: number;
  examType: string;
}

const PRACTICE_CONFIG_KEY =
  "jamb-league-active-practice-config";

/* ============================================================
   MODE ICON
   ============================================================ */

function getModeIcon(modeName: string): LucideIcon {
  const name = modeName.toLowerCase();

  if (name.includes("quick")) {
    return Target;
  }

  if (name.includes("timed")) {
    return Clock3;
  }

  return BookOpen;
}

/* ============================================================
   MODE ID
   ============================================================ */

function getModeId(
  modeName: string,
): PracticeMode | null {
  const name = modeName.toLowerCase().trim();

  if (name.includes("quick")) {
    return "quick practice";
  }

  if (name.includes("standard")) {
    return "standard practice";
  }

  if (name.includes("timed")) {
    return "timed practice";
  }

  return null;
}

/* ============================================================
   FORMAT SUBJECT NAME
   ============================================================ */

function formatSubjectName(subject: string) {
  if (!subject) {
    return "Practice";
  }

  return subject
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

/* ============================================================
   FORMAT DURATION
   ============================================================ */

function formatDuration(totalSeconds: number) {
  const safeSeconds = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.round(totalSeconds))
    : 0;

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  if (minutes === 0) {
    return `${seconds} sec`;
  }

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds} sec`;
}

/* ============================================================
   FORMAT CBT POINTS
   ============================================================ */

function formatPoints(points: number) {
  const numericPoints = Number(points);

  if (!Number.isFinite(numericPoints)) {
    return "0";
  }

  if (numericPoints === 0) {
    return "0";
  }

  return numericPoints
    .toFixed(4)
    .replace(/\.?0+$/, "");
}

/* ============================================================
   CONFIG COMPARISON
   ============================================================ */

function configsMatch(
  first: StoredPracticeConfig | null,
  second: StoredPracticeConfig,
) {
  if (!first) {
    return false;
  }

  return (
    first.subjectId === second.subjectId &&
    first.mode === second.mode &&
    first.questionCount === second.questionCount &&
    first.duration === second.duration &&
    first.secondsPerQuestion ===
      second.secondsPerQuestion &&
    first.pointsPerCorrect ===
      second.pointsPerCorrect &&
    first.examType === second.examType
  );
}

/* ============================================================
   LOAD SAVED CONFIG
   ============================================================ */

function getStoredPracticeConfig():
  | StoredPracticeConfig
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(
      PRACTICE_CONFIG_KEY,
    );

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return null;
    }

    return parsed as StoredPracticeConfig;
  } catch (error) {
    console.error(
      "Failed to read saved practice configuration:",
      error,
    );

    return null;
  }
}

/* ============================================================
   SAVE CONFIG
   ============================================================ */

function savePracticeConfig(
  config: StoredPracticeConfig,
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      PRACTICE_CONFIG_KEY,
      JSON.stringify(config),
    );
  } catch (error) {
    console.error(
      "Failed to save practice configuration:",
      error,
    );
  }
}

/* ============================================================
   PAGE
   ============================================================ */

export default function PracticeConfigurationPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  /* ==========================================================
     CBT STORE
     ========================================================== */

  const questions = useCbtStore(
    (state) => state.questions,
  );

  const answers = useCbtStore(
    (state) => state.answers,
  );

  const isStarted = useCbtStore(
    (state) => state.isStarted,
  );

  const isSubmitted = useCbtStore(
    (state) => state.isSubmitted,
  );

  const sessionId = useCbtStore(
    (state) => state.sessionId,
  );

  const practiceId = useCbtStore(
    (state) => state.practiceId,
  );

  const timeRemainingSeconds = useCbtStore(
    (state) => state.timeRemainingSeconds,
  );

  const setQuestions = useCbtStore(
    (state) => state.setQuestions,
  );

  const setPracticeId = useCbtStore(
    (state) => state.setPracticeId,
  );

  const setPracticeConfig = useCbtStore(
    (state) => state.setPracticeConfig,
  );

  const setSubjects = useCbtStore(
    (state) => state.setSubjects,
  );

  const setDuration = useCbtStore(
    (state) => state.setDuration,
  );

  const startExam = useCbtStore(
    (state) => state.startExam,
  );

  /* ==========================================================
     URL VALUES
     ========================================================== */

  const examType = String(
    params.examType ?? "jamb",
  )
    .trim()
    .toLowerCase();

  const subjectSlug = String(
    params.subject ?? "",
  )
    .trim()
    .toLowerCase();

  const subjectId =
    searchParams.get("subjectId")?.trim() ?? "";

  const initialMode =
    searchParams
      .get("mode")
      ?.trim()
      .toLowerCase();

  /* ==========================================================
     BACKEND MODES
     ========================================================== */

  const [modes, setModes] =
    useState<ModeOption[]>([]);

  const [isLoadingModes, setIsLoadingModes] =
    useState(true);

  const [modesError, setModesError] =
    useState<string | null>(null);

  /* ==========================================================
     STATE
     ========================================================== */

  const [selectedMode, setSelectedMode] =
    useState<PracticeMode>(
      initialMode === "quick practice"
        ? "quick practice"
        : initialMode === "timed practice"
          ? "timed practice"
          : "standard practice",
    );

  const [questionCount, setQuestionCount] =
    useState(20);

  const [isStarting, setIsStarting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [walletError, setWalletError] =
    useState<string | null>(null);

  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

  const [
    hasMatchingActiveSession,
    setHasMatchingActiveSession,
  ] = useState(false);

  /* ==========================================================
     FETCH PRACTICE MODES
     ========================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadModes = async () => {
      setIsLoadingModes(true);
      setModesError(null);

      try {
        console.log(
          "========================================",
        );

        console.log(
          "FETCHING PRACTICE MODES",
        );

        const response =
          await getAllPracticeModes();

        console.log(
          "Practice modes response:",
          response,
        );

        console.log(
          "Practice modes response JSON:",
          JSON.stringify(
            response,
            null,
            2,
          ),
        );

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Failed to load practice modes.",
          );
        }

        const backendModes: BackendPracticeMode[] =
          Array.isArray(response.data)
            ? response.data
            : [];

        const mappedModes =
          backendModes.reduce<ModeOption[]>(
            (result, mode) => {
              if (mode.isActive === false) {
                return result;
              }

              const modeId =
                getModeId(mode.name);

              if (!modeId) {
                console.warn(
                  "Ignoring unknown practice mode:",
                  mode.name,
                );

                return result;
              }

              const seconds = Number(
                mode.timePerQuestion,
              );

              const points = Number(
                mode.awardedPointPerCorrectAnswer,
              );

              const normalizedSeconds =
                Number.isFinite(seconds)
                  ? seconds
                  : 0;

              const normalizedPoints =
                Number.isFinite(points)
                  ? points
                  : 0;

              const mappedMode: ModeOption = {
                id: modeId,
                backendId: mode._id,
                name: mode.name.replace(
                  /\b\w/g,
                  (letter) =>
                    letter.toUpperCase(),
                ),
                description:
                  mode.description,
                icon: getModeIcon(
                  mode.name,
                ),
                secondsPerQuestion:
                  normalizedSeconds,
                pointsPerCorrect:
                  normalizedPoints,
              };

              result.push(mappedMode);

              return result;
            },
            [],
          );

        console.log(
          "Mapped backend modes:",
          mappedModes,
        );

        console.log(
          "Mapped CBT point values:",
          mappedModes.map((mode) => ({
            name: mode.name,
            backendId: mode.backendId,
            pointsPerCorrect:
              mode.pointsPerCorrect,
            formatted: formatPoints(
              mode.pointsPerCorrect,
            ),
          })),
        );

        if (!cancelled) {
          setModes(mappedModes);

          const requestedMode =
            mappedModes.find(
              (mode) =>
                mode.id === selectedMode,
            );

          if (
            !requestedMode &&
            mappedModes.length > 0
          ) {
            setSelectedMode(
              mappedModes[0].id,
            );
          }
        }

        console.log(
          "========================================",
        );
      } catch (err) {
        console.error(
          "Failed to load practice modes:",
          err,
        );

        if (!cancelled) {
          setModesError(
            err instanceof Error
              ? err.message
              : "Failed to load practice modes.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingModes(false);
        }
      }
    };

    void loadModes();

    return () => {
      cancelled = true;
    };
  }, [selectedMode]);

  /* ==========================================================
     DISPLAY
     ========================================================== */

  const subjectName = useMemo(
    () =>
      formatSubjectName(
        subjectSlug,
      ),
    [subjectSlug],
  );

  const examName =
    examType.toUpperCase();

  /* ==========================================================
     SELECTED BACKEND MODE
     ========================================================== */

  const selectedModeInfo =
    useMemo<ModeOption | undefined>(
      () =>
        modes.find(
          (mode) =>
            mode.id === selectedMode,
        ),
      [modes, selectedMode],
    );

  /* ==========================================================
     BACKEND VALUES
     ========================================================== */

  const secondsPerQuestion =
    selectedModeInfo
      ?.secondsPerQuestion ?? 0;

  const pointsPerCorrect =
    selectedModeInfo
      ?.pointsPerCorrect ?? 0;

  /* ==========================================================
     AUTOMATIC TIME
     ========================================================== */

  const totalDurationSeconds =
    questionCount *
    secondsPerQuestion;

  /* ==========================================================
     MAXIMUM REWARD
     ========================================================== */

  const maximumPossiblePoints =
    questionCount *
    pointsPerCorrect;

  /* ==========================================================
     CURRENT CONFIGURATION
     ========================================================== */

  const currentConfig =
    useMemo<StoredPracticeConfig>(
      () => ({
        subjectId,
        mode: selectedMode,
        questionCount,
        duration:
          totalDurationSeconds,
        secondsPerQuestion,
        pointsPerCorrect,
        examType,
      }),
      [
        subjectId,
        selectedMode,
        questionCount,
        totalDurationSeconds,
        secondsPerQuestion,
        pointsPerCorrect,
        examType,
      ],
    );

  /* ==========================================================
     CHECK ACTIVE SESSION
     ========================================================== */

  useEffect(() => {
    if (isLoadingModes) {
      return;
    }

    if (!subjectId) {
      setIsCheckingSession(false);
      setHasMatchingActiveSession(false);
      return;
    }

    const storedConfig =
      getStoredPracticeConfig();

    const activeSession = Boolean(
      isStarted &&
        !isSubmitted &&
        practiceId &&
        Array.isArray(questions) &&
        questions.length > 0 &&
        storedConfig &&
        configsMatch(
          storedConfig,
          currentConfig,
        ),
    );

    setHasMatchingActiveSession(
      activeSession,
    );

    setIsCheckingSession(false);

    if (activeSession) {
      console.log(
        "========================================",
      );

      console.log(
        "ACTIVE PRACTICE SESSION FOUND",
      );

      console.log(
        "No backend request will be made.",
      );

      console.log(
        "Questions:",
        questions.length,
      );

      console.log(
        "Answers:",
        answers,
      );

      console.log(
        "Session ID:",
        sessionId,
      );

      console.log(
        "Practice ID:",
        practiceId,
      );

      console.log(
        "Time remaining:",
        timeRemainingSeconds,
      );

      console.log(
        "Practice mode:",
        selectedMode,
      );

      console.log(
        "Backend seconds/question:",
        secondsPerQuestion,
      );

      console.log(
        "Backend points/correct:",
        pointsPerCorrect,
      );

      console.log(
        "Formatted points:",
        formatPoints(
          pointsPerCorrect,
        ),
      );

      console.log(
        "========================================",
      );
    }
  }, [
    subjectId,
    selectedMode,
    questionCount,
    totalDurationSeconds,
    secondsPerQuestion,
    pointsPerCorrect,
    examType,
    currentConfig,
    isLoadingModes,
    isStarted,
    isSubmitted,
    questions,
    answers,
    sessionId,
    practiceId,
    timeRemainingSeconds,
  ]);

  /* ==========================================================
     RESUME
     ========================================================== */

  const handleResumePractice = () => {
    console.log(
      "Resuming cached practice session.",
    );

    console.log(
      "Session ID:",
      sessionId,
    );

    console.log(
      "Practice ID:",
      practiceId,
    );

    console.log(
      "Questions:",
      questions.length,
    );

    console.log(
      "Answers:",
      answers,
    );

    router.push(
      "/student/practice/cbtsubjects/session",
    );
  };

  /* ==========================================================
     START PRACTICE
     ========================================================== */

  const handleStartPractice = async () => {
    setError(null);
    setWalletError(null);

    if (!subjectId) {
      setError(
        "Subject ID is missing. Please go back and select the subject again.",
      );

      return;
    }

    if (!selectedModeInfo) {
      setError(
        "Practice mode information is not available yet.",
      );

      return;
    }

    if (hasMatchingActiveSession) {
      handleResumePractice();
      return;
    }

    setIsStarting(true);

    try {
      console.log(
        "========================================",
      );

      console.log(
        "STARTING NEW PRACTICE SESSION",
      );

      console.log(
        "Practice mode:",
        selectedMode,
      );

      console.log(
        "Backend mode ID:",
        selectedModeInfo.backendId,
      );

      console.log(
        "Questions:",
        questionCount,
      );

      console.log(
        "Backend seconds/question:",
        secondsPerQuestion,
      );

      console.log(
        "Backend points/correct:",
        pointsPerCorrect,
      );

      console.log(
        "Formatted backend points:",
        formatPoints(
          pointsPerCorrect,
        ),
      );

      console.log(
        "Total duration seconds:",
        totalDurationSeconds,
      );

      console.log(
        "Maximum possible points:",
        maximumPossiblePoints,
      );

      console.log(
        "Formatted maximum points:",
        formatPoints(
          maximumPossiblePoints,
        ),
      );

      console.log(
        "Request configuration:",
        currentConfig,
      );

      console.log(
        "========================================",
      );

      /* ======================================================
         REQUEST PAYLOAD
         ====================================================== */

      const payload = {
        subjectId,
        mode: selectedMode,
        questionCount,
        duration:
          totalDurationSeconds,
        examType,
      };

      console.log(
        "Practice session payload:",
        payload,
      );

      /* ======================================================
         CREATE BACKEND SESSION
         ====================================================== */

      const response =
        await createPracticeSession(
          payload,
        );

      console.log(
        "Practice session response:",
        response,
      );

      console.log(
        "Response JSON:",
        JSON.stringify(
          response,
          null,
          2,
        ),
      );

      /* ======================================================
         HANDLE BACKEND APPLICATION ERROR
         ====================================================== */

      if (!response.success) {
        const responseMessage =
          response.message
            ?.toLowerCase()
            .trim() ?? "";

        if (
          responseMessage.includes(
            "insufficient",
          ) &&
          responseMessage.includes(
            "wallet",
          )
        ) {
          setWalletError(
            "Insufficient CBT Points. Please fund your practice wallet to start this practice session.",
          );

          return;
        }

        setError(
          response.message ||
            "Failed to create practice session.",
        );

        return;
      }

      /* ======================================================
         VALIDATE RESPONSE DATA
         ====================================================== */

      const practiceData =
        response.data;

      if (!practiceData) {
        throw new Error(
          "The server did not return practice session data.",
        );
      }

      if (
        !Array.isArray(
          practiceData.questions,
        )
      ) {
        throw new Error(
          "The server did not return practice questions.",
        );
      }

      if (
        practiceData.questions.length ===
        0
      ) {
        throw new Error(
          "No questions were returned for this practice session.",
        );
      }

      /* ======================================================
         GET BACKEND PRACTICE ID
         ====================================================== */

      console.log(
        "========== PRACTICE ID DEBUG ==========",
      );

      console.log(
        "Full practiceData:",
        practiceData,
      );

      console.log(
        "practiceData.practiceId:",
        practiceData.practiceId,
      );

      console.log(
        "=======================================",
      );

      const returnedPracticeId =
        practiceData.practiceId;

      if (!returnedPracticeId) {
        throw new Error(
          "The server did not return a practice ID.",
        );
      }

      console.log(
        "Backend Practice ID:",
        returnedPracticeId,
      );

      /* ======================================================
         STORE PRACTICE ID
         ====================================================== */

      setPracticeId(
        returnedPracticeId,
      );

      console.log(
        "Practice ID stored in CBT store:",
        returnedPracticeId,
      );

      /* ======================================================
         STORE PRACTICE CONFIGURATION
         ====================================================== */

      setPracticeConfig({
        subjectId:
          practiceData.subjectId,

        mode:
          selectedMode ===
          "quick practice"
            ? "quick"
            : selectedMode ===
                "standard practice"
              ? "standard"
              : "timed",

        questionCount:
          practiceData.questionCount,

        duration:
          practiceData.duration,

        examType:
          examType,
      });

      /* ======================================================
         CONVERT QUESTIONS
         ====================================================== */

      const cbtQuestions =
        practiceData.questions.map(
          (question) => ({
            _id:
              question._id,

            question:
              question.question,

            options:
              question.options,

            questionType:
              question.questionType,

            difficulty:
              question.difficulty,

            answer:
              question.answer,

            correctAnswers:
              question.correctAnswers,

            explanation:
              question.explanation,

            solution:
              question.solution,

            examType:
              question.examType,

            examYear:
              question.examYear,

            apiQuestionId:
              question.apiQuestionId,

            imageId:
              question.imageId,

            passageId:
              question.passageId,

            media:
              question.media,

            content:
              question.content,

            isMultipleAnswer:
              question.isMultipleAnswer,

            marks:
              question.marks,

            topic:
              question.topic,

            section:
              question.section,

            plan:
              question.plan,

            subject:
              question.subject,
          }),
        );

      /* ======================================================
         STORE QUESTIONS
         ====================================================== */

      setQuestions(
        cbtQuestions,
      );

      /* ======================================================
         STORE SUBJECT
         ====================================================== */

      setSubjects([
        {
          _id:
            practiceData.subjectId,

          name:
            subjectName,

          slug:
            subjectSlug,
        },
      ]);

      /* ======================================================
         STORE TIMER
         ====================================================== */

      setDuration(
        practiceData.duration ??
          totalDurationSeconds,
      );

      /* ======================================================
         SAVE CONFIG
         ====================================================== */

      savePracticeConfig(
        currentConfig,
      );

      /* ======================================================
         START CBT
         ====================================================== */

      console.log(
        "PRACTICE ID BEFORE startExam:",
        useCbtStore.getState()
          .practiceId,
      );

      startExam();

      console.log(
        "PRACTICE ID AFTER startExam:",
        useCbtStore.getState()
          .practiceId,
      );

      console.log(
        "========================================",
      );

      console.log(
        "NEW PRACTICE READY",
      );

      console.log(
        "Practice ID:",
        returnedPracticeId,
      );

      console.log(
        "Questions stored:",
        cbtQuestions.length,
      );

      console.log(
        "Navigating to CBT session...",
      );

      console.log(
        "========================================",
      );

      router.push(
        "/student/practice/cbtsubjects/session",
      );
    } catch (err) {
      console.error(
        "Failed to start practice:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to start practice.",
      );
    } finally {
      setIsStarting(false);
    }
  };

  /* ==========================================================
     MODE CHANGE
     ========================================================== */

  const handleModeChange = (
    mode: PracticeMode,
  ) => {
    setSelectedMode(mode);
    setHasMatchingActiveSession(false);
    setError(null);
    setWalletError(null);
  };

  /* ==========================================================
     QUESTION COUNT CHANGE
     ========================================================== */

  const handleQuestionCountChange = (
    count: number,
  ) => {
    setQuestionCount(count);
    setHasMatchingActiveSession(false);
    setError(null);
    setWalletError(null);
  };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ======================================================
          BACKGROUND ATMOSPHERE
          ====================================================== */}

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_35%)]" />
      </div>

      <div className="relative">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          {/* ==================================================
              BACK
              ================================================== */}

          <button
            type="button"
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {/* ==================================================
              HEADER
              ================================================== */}

          <section className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-blue-300">
              <BookOpen className="h-3.5 w-3.5" />
              {examName} Practice
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {subjectName} Practice
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Choose your practice mode
              and number of questions.
            </p>
          </section>

          {/* ==================================================
              LOADING MODES
              ================================================== */}

          {isLoadingModes && (
            <Card className="mb-8 rounded-3xl border border-blue-400/20 bg-blue-500/[0.08] p-6 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                </div>

                <div>
                  <p className="text-sm font-bold text-blue-200">
                    Loading practice modes
                  </p>

                  <p className="mt-1 text-xs text-blue-300/70">
                    Fetching the latest practice rules...
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* ==================================================
              MODE ERROR
              ================================================== */}

          {modesError && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-300 backdrop-blur-sm">
              {modesError}
            </div>
          )}

          {/* ==================================================
              ACTIVE SESSION
              ================================================== */}

          {!isCheckingSession &&
            hasMatchingActiveSession && (
              <section className="mb-8">
                <Card className="rounded-3xl border border-emerald-400/20 bg-emerald-500/[0.08] p-6 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/15 text-emerald-300">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>

                      <div>
                        <h2 className="font-black text-white">
                          Practice in Progress
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-emerald-200/70">
                          You already have an
                          unfinished practice
                          session for this
                          configuration.
                        </p>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-emerald-300">
                          <span>
                            {questions.length}{" "}
                            questions
                          </span>

                          <span>
                            {
                              Object.keys(
                                answers ?? {},
                              ).length
                            }{" "}
                            answered
                          </span>

                          {sessionId && (
                            <span>
                              Session active
                            </span>
                          )}

                          {practiceId && (
                            <span>
                              Practice active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      onClick={
                        handleResumePractice
                      }
                      rightIcon={
                        <ArrowRight className="h-5 w-5" />
                      }
                    >
                      Resume Practice
                    </Button>
                  </div>
                </Card>
              </section>
            )}

          {/* ==================================================
              SUBJECT WARNING
              ================================================== */}

          {!subjectId && (
            <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-sm font-medium text-amber-300 backdrop-blur-sm">
              Subject ID is missing from
              the URL. Please go back and
              select the subject again.
            </div>
          )}

          {/* ==================================================
              ERROR
              ================================================== */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-300 backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* ==================================================
              STEP 1 — MODE
              ================================================== */}

          <section className="mb-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-900/30">
                1
              </span>

              <div>
                <h2 className="text-xl font-black text-white">
                  Choose Practice Mode
                </h2>

                <p className="text-sm text-slate-400">
                  These values come directly
                  from the backend.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {modes.map((mode) => {
                const Icon = mode.icon;

                const selected =
                  selectedMode ===
                  mode.id;

                return (
                  <button
                    key={mode.backendId}
                    type="button"
                    onClick={() =>
                      handleModeChange(
                        mode.id,
                      )
                    }
                    className={[
                      "relative rounded-3xl border p-5 text-left transition-all duration-200",
                      "bg-white/[0.03] backdrop-blur-sm",
                      "hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]",
                      "focus:outline-none focus:ring-2 focus:ring-blue-400/50",
                      selected
                        ? "border-blue-400/50 bg-blue-500/10 ring-2 ring-blue-400/20"
                        : "border-white/10",
                    ].join(" ")}
                  >
                    {selected && (
                      <div className="absolute right-4 top-4">
                        <CheckCircle2 className="h-5 w-5 text-blue-400" />
                      </div>
                    )}

                    <div
                      className={[
                        "flex h-12 w-12 items-center justify-center rounded-2xl border",
                        selected
                          ? "border-blue-400/20 bg-blue-500/15 text-blue-300"
                          : "border-white/10 bg-white/[0.04] text-slate-400",
                      ].join(" ")}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-4 font-black text-white">
                      {mode.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {mode.description}
                    </p>

                    <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          Time/question
                        </span>

                        <span className="font-black text-slate-200">
                          {
                            mode.secondsPerQuestion
                          }{" "}
                          sec
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          Correct answer
                        </span>

                        <span className="font-black text-blue-400">
                          +
                          {formatPoints(
                            mode.pointsPerCorrect,
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ==================================================
              STEP 2 — QUESTIONS
              ================================================== */}

          <section className="mb-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-900/30">
                2
              </span>

              <div>
                <h2 className="text-xl font-black text-white">
                  Number of Questions
                </h2>

                <p className="text-sm text-slate-400">
                  Choose how many questions
                  you want to answer.
                </p>
              </div>
            </div>

            <Card className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[10, 20, 30, 40, 50].map(
                  (count) => {
                    const selected =
                      questionCount ===
                      count;

                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() =>
                          handleQuestionCountChange(
                            count,
                          )
                        }
                        className={[
                          "rounded-2xl border-2 px-4 py-4 text-center font-bold transition-all",
                          "focus:outline-none focus:ring-2 focus:ring-blue-400/40",
                          selected
                            ? "border-blue-400/50 bg-blue-500/15 text-blue-300"
                            : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-blue-400/30 hover:bg-white/[0.04] hover:text-white",
                        ].join(" ")}
                      >
                        {count}
                      </button>
                    );
                  },
                )}
              </div>
            </Card>
          </section>

          {/* ==================================================
              STEP 3 — RULES
              ================================================== */}

          <section className="mb-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-900/30">
                3
              </span>

              <div>
                <h2 className="text-xl font-black text-white">
                  Practice Rules
                </h2>

                <p className="text-sm text-slate-400">
                  Automatically loaded from
                  the backend.
                </p>
              </div>
            </div>

            <Card className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
              <div className="grid gap-4 sm:grid-cols-3">
                {/* TIME PER QUESTION */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                      <Clock3 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Time / Question
                      </p>

                      <p className="mt-1 text-2xl font-black text-white">
                        {
                          secondsPerQuestion
                        }{" "}
                        sec
                      </p>
                    </div>
                  </div>
                </div>

                {/* TOTAL TIME */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-500/10 text-amber-300">
                      <Clock3 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Total Time
                      </p>

                      <p className="mt-1 text-2xl font-black text-white">
                        {formatDuration(
                          totalDurationSeconds,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* REWARD */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-300">
                      <Coins className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Correct Answer
                      </p>

                      <p className="mt-1 text-2xl font-black text-emerald-400">
                        +
                        {formatPoints(
                          pointsPerCorrect,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAXIMUM REWARD */}

              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08] p-5">
                <div className="flex items-start gap-3">
                  <Coins className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                  <div>
                    <p className="font-black text-white">
                      Maximum CBT Points
                    </p>

                    <p className="mt-1 text-sm leading-6 text-emerald-200/70">
                      If you answer all{" "}
                      <strong className="text-emerald-300">
                        {questionCount}
                      </strong>{" "}
                      questions correctly,
                      you can earn up to{" "}
                      <strong className="text-emerald-300">
                        {formatPoints(
                          maximumPossiblePoints,
                        )}
                      </strong>{" "}
                      CBT points in this
                      practice session.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ==================================================
              SESSION SUMMARY
              ================================================== */}

          <section className="mb-8">
            <Card className="rounded-3xl border border-blue-400/20 bg-blue-500/[0.06] p-6 text-white shadow-2xl shadow-black/20 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/15 text-blue-300">
                  <HelpCircle className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-black text-white">
                    Session Summary
                  </h2>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <p className="text-slate-400">
                      <strong className="text-slate-200">
                        Exam:
                      </strong>{" "}
                      {examName}
                    </p>

                    <p className="text-slate-400">
                      <strong className="text-slate-200">
                        Subject:
                      </strong>{" "}
                      {subjectName}
                    </p>

                    <p className="text-slate-400">
                      <strong className="text-slate-200">
                        Mode:
                      </strong>{" "}
                      {selectedModeInfo?.name ??
                        "Loading..."}
                    </p>

                    <p className="text-slate-400">
                      <strong className="text-slate-200">
                        Questions:
                      </strong>{" "}
                      {questionCount}
                    </p>

                    <p className="text-slate-400">
                      <strong className="text-slate-200">
                        Time/question:
                      </strong>{" "}
                      {secondsPerQuestion}{" "}
                      seconds
                    </p>

                    <p className="text-slate-400">
                      <strong className="text-slate-200">
                        Total duration:
                      </strong>{" "}
                      {formatDuration(
                        totalDurationSeconds,
                      )}
                    </p>

                    <p className="text-slate-400">
                      <strong className="text-slate-200">
                        Correct answer:
                      </strong>{" "}
                      <span className="font-black text-emerald-400">
                        +
                        {formatPoints(
                          pointsPerCorrect,
                        )}{" "}
                        CBT points
                      </span>
                    </p>

                    <p className="text-slate-400">
                      <strong className="text-slate-200">
                        Maximum reward:
                      </strong>{" "}
                      <span className="font-black text-emerald-400">
                        {formatPoints(
                          maximumPossiblePoints,
                        )}{" "}
                        points
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          
          {/* ==================================================
    START / RESUME
    ================================================== */}

<section className="pb-6">
  <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/30 backdrop-blur-sm">

    {/* ==================================================
        INSUFFICIENT WALLET CARD
        ================================================== */}

    {walletError && (
      <div className="mb-3 rounded-2xl border border-amber-400/20 bg-amber-500/[0.08] p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-400/20 bg-amber-500/10">
              <Coins className="h-4 w-4 text-amber-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-black text-amber-200">
                Insufficient CBT Points
              </p>

              <p className="mt-1 text-sm leading-5 text-amber-300/80">
                Please fund your practice wallet to start this practice session.
              </p>
            </div>
          </div>

          {/* ==================================================
              FUND ACCOUNT BUTTON
              ================================================== */}

          <Button
            type="button"
            size="sm"
            onClick={() =>
              router.push("/student/practice/wallet")
            }
            className="shrink-0"
            rightIcon={
              <ArrowRight className="h-4 w-4" />
            }
          >
            Fund Account
          </Button>
        </div>
      </div>
    )}

    {/* ==================================================
        START / RESUME BUTTON
        ================================================== */}

    <Button
      size="lg"
      fullWidth
      disabled={
        isStarting ||
        isCheckingSession ||
        isLoadingModes ||
        !subjectId ||
        !selectedModeInfo
      }
      onClick={
        hasMatchingActiveSession
          ? handleResumePractice
          : handleStartPractice
      }
      rightIcon={
        isCheckingSession ||
        isLoadingModes ||
        isStarting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ArrowRight className="h-5 w-5" />
        )
      }
    >
      {isLoadingModes
        ? "Loading Practice Modes..."
        : isCheckingSession
          ? "Checking Practice..."
          : isStarting
            ? "Starting Practice..."
            : hasMatchingActiveSession
              ? "Resume Practice"
              : "Start Practice"}
    </Button>
  </div>
</section>




        </div>
      </div>
    </main>
  );
}


