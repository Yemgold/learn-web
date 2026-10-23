


"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { LoaderCircle, AlertCircle, ArrowLeft } from "lucide-react";

import WhotGame, {
  type WhotGameSelection,
} from "@/games/whot/components/WhotGame";

const SELECTION_STORAGE_KEY = "learnyfi-whot-selection";

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="flex flex-col items-center gap-3 text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-cyan-300" />

        <p className="text-sm text-slate-400">
          Preparing your WHOT game...
        </p>
      </div>
    </main>
  );
}

function WhotQuestionPageContent() {
  const router = useRouter();

  const [selection, setSelection] =
    useState<WhotGameSelection | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [selectionError, setSelectionError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    try {
      const storedSelection = sessionStorage.getItem(
        SELECTION_STORAGE_KEY,
      );

      if (!storedSelection) {
        setSelectionError(
          "Your WHOT game setup was not found. Please select your subjects first.",
        );
        return;
      }

      const parsed: unknown = JSON.parse(storedSelection);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("classGroup" in parsed) ||
        !("subjects" in parsed)
      ) {
        setSelectionError(
          "Your game setup is invalid. Please select your subjects again.",
        );
        return;
      }

      const candidate = parsed as WhotGameSelection;

      const validClassGroups = [
        "SCIENCES",
        "COMMERCIAL",
        "ARTS",
      ] as const;

      if (
        !validClassGroups.includes(
          candidate.classGroup as (typeof validClassGroups)[number],
        ) ||
        !Array.isArray(candidate.subjects) ||
        candidate.subjects.length < 4 ||
        !candidate.subjects.every(
          (subject) =>
            typeof subject?.id === "string" &&
            typeof subject?.name === "string",
        )
      ) {
        setSelectionError(
          "Your game setup is incomplete. Please return to setup and select at least four subjects.",
        );
        return;
      }

      setSelection(candidate);
    } catch (error) {
      console.error("Failed to load WHOT game selection:", error);

      setSelectionError(
        "We could not read your game setup. Please select your subjects again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExit = useCallback(() => {
    router.push("/student/games");
  }, [router]);

  const handleBackToSetup = useCallback(() => {
    router.push("/student/games/whot/setup");
  }, [router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (selectionError || !selection) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
            <AlertCircle className="h-7 w-7 text-amber-400" />
          </div>

          <h1 className="text-xl font-bold">
            WHOT Setup Required
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {selectionError ??
              "Your game setup could not be loaded."}
          </p>

          <button
            type="button"
            onClick={handleBackToSetup}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to WHOT Setup
          </button>

          <button
            type="button"
            onClick={handleExit}
            className="mt-3 w-full rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
          >
            Back to Games
          </button>
        </div>
      </main>
    );
  }

  return (
    <WhotGame
      playerName="You"
      botName="Learnyfi Bot"
      autoStart
      botDelay={900}
      questionTimeLimit={15}
      selection={selection}
      onExit={handleExit}
    />
  );
}

export default function WhotQuestionPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <WhotQuestionPageContent />
    </Suspense>
  );
}
