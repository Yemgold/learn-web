
"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  BookOpen,
  Calculator,
  Atom,
  FlaskConical,
  Brain,
  Globe,
  Landmark,
  Languages,
  ArrowRight,
  FileQuestion,
  Loader2,
  Settings2,
  AlertCircle,
  Lock,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  getSubjectsByPlan,
  type Subject,
} from "@/lib/api/subjects";

import { usePracticeStore } from "@/stores/practiceStore";

/* ============================================================
   CONFIG
   ============================================================ */

const ITEMS_PER_PAGE = 50;

type ExamType = "jamb" | "waec" | "neco";

/**
 * Subjects available to students who have:
 * - no active plan
 * - free trial access
 *
 * IMPORTANT:
 * Keep these normalized keys consistent with getSubjectKey().
 */
const FREE_TRIAL_SUBJECTS = new Set([
  "english",
  "useofenglish",
  "mathematics",
  "maths",
]);

/* ============================================================
   EXAM CONFIG
   ============================================================ */

const EXAM_CONFIG: Record<
  ExamType,
  {
    label: string;
    shortLabel: string;
    combinationLabel: string;
    description: string;
    practiceDescription: string;
    compulsoryText: string;
  }
> = {
  jamb: {
    label: "JAMB Practice",
    shortLabel: "JAMB",
    combinationLabel: "JAMB combination",
    description:
      "Choose one of your selected JAMB subjects to practise past questions.",
    practiceDescription:
      "Practise past questions from 2000 to 2026.",
    compulsoryText:
      "Use of English is compulsory for JAMB.",
  },

  waec: {
    label: "WAEC Practice",
    shortLabel: "WAEC",
    combinationLabel: "WAEC combination",
    description:
      "Choose one of your selected WAEC subjects to practise past questions.",
    practiceDescription:
      "Practise WAEC past questions and build your examination confidence.",
    compulsoryText:
      "Your WAEC subjects are based on the combination you selected.",
  },

  neco: {
    label: "NECO Practice",
    shortLabel: "NECO",
    combinationLabel: "NECO combination",
    description:
      "Choose one of your selected NECO subjects to practise past questions.",
    practiceDescription:
      "Practise NECO past questions and build your examination confidence.",
    compulsoryText:
      "Your NECO subjects are based on the combination you selected.",
  },
};

/* ============================================================
   SUBJECT ICONS
   ============================================================ */

const subjectIcons = {
  english: BookOpen,
  useofenglish: BookOpen,

  mathematics: Calculator,
  maths: Calculator,

  physics: Atom,
  chemistry: FlaskConical,
  biology: Brain,

  government: Landmark,
  geography: Globe,
  literature: Languages,
} as const;

/* ============================================================
   SUBJECT STYLES
   ============================================================ */

const subjectStyles = {
  english: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },

  useofenglish: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },

  mathematics: {
    color: "text-green-400",
    bg: "bg-green-500/10",
  },

  maths: {
    color: "text-green-400",
    bg: "bg-green-500/10",
  },

  physics: {
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },

  chemistry: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },

  biology: {
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },

  government: {
    color: "text-red-400",
    bg: "bg-red-500/10",
  },

  geography: {
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },

  literature: {
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
} as const;

/* ============================================================
   HELPERS
   ============================================================ */

function getSubjectKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "");
}

/* ============================================================
   DISPLAY NAMES
   ============================================================ */

function getSubjectDisplayName(
  name: string,
): string {
  const names: Record<string, string> = {
    english: "Use of English",
    useofenglish: "Use of English",

    mathematics: "Mathematics",
    maths: "Mathematics",

    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",

    government: "Government",
    geography: "Geography",
    literature: "Literature",

    englishlit: "Literature",

    crk: "Christian Religious Knowledge",
    christianreligiousknowledge:
      "Christian Religious Knowledge",

    irk: "Islamic Religious Knowledge",
    islamicreligiousknowledge:
      "Islamic Religious Knowledge",

    economics: "Economics",
    currentaffairs: "Current Affairs",
    insurance: "Insurance",
    civiceducation: "Civic Education",
    history: "History",
    commerce: "Commerce",
    accounting: "Accounting",
    agriculturalscience:
      "Agricultural Science",
  };

  const normalizedName = name
    .toLowerCase()
    .replace(/\s+/g, "");

  return (
    names[normalizedName] ??
    name
      .replace(
        /([a-z])([A-Z])/g,
        "$1 $2",
      )
      .replace(
        /\b\w/g,
        (char) => char.toUpperCase(),
      )
  );
}

/* ============================================================
   ICON
   ============================================================ */

function getSubjectIcon(name: string) {
  const key = getSubjectKey(name);

  return (
    subjectIcons[
      key as keyof typeof subjectIcons
    ] ?? BookOpen
  );
}

/* ============================================================
   STYLE
   ============================================================ */

function getSubjectStyle(name: string) {
  const key = getSubjectKey(name);

  return (
    subjectStyles[
      key as keyof typeof subjectStyles
    ] ?? {
      color: "text-slate-400",
      bg: "bg-white/[0.04]",
    }
  );
}

/* ============================================================
   EXAM NORMALIZER
   ============================================================ */

function normalizeExam(
  value: string,
): ExamType {
  const exam = value.toLowerCase();

  if (
    exam === "waec" ||
    exam === "neco"
  ) {
    return exam;
  }

  return "jamb";
}

/* ============================================================
   PAGE WRAPPER
   ============================================================ */

export default function PracticeCombinationSubjectsPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          message="Loading your subjects..."
        />
      }
    >
      <PracticeCombinationSubjectsContent />
    </Suspense>
  );
}

/* ============================================================
   PAGE CONTENT
   ============================================================ */

function PracticeCombinationSubjectsContent() {
  const params = useParams();

  /* ==========================================================
     EXAM TYPE FROM URL
     ========================================================== */

  const examTypeParam =
    typeof params.examType === "string"
      ? params.examType
      : "";

  const exam =
    normalizeExam(examTypeParam);

  const config =
    EXAM_CONFIG[exam];

  /* ==========================================================
     STATE
     ========================================================== */

  const [subjects, setSubjects] =
    useState<Subject[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* ==========================================================
     FREE TRIAL / NO PLAN
     
     IMPORTANT:
     Replace this section with your actual auth/subscription
     source if you already have one.

     The values below support common localStorage structures.
     ========================================================== */

  const [isFreeTrialUser, setIsFreeTrialUser] =
    useState(false);

  const [subscriptionChecked, setSubscriptionChecked] =
    useState(false);

  useEffect(() => {
    try {
      const possibleUsers = [
        "user",
        "auth-user",
        "jamb_user",
        "jamb_auth_user",
      ];

      let storedUser: any = null;

      for (const key of possibleUsers) {
        const raw =
          localStorage.getItem(key);

        if (!raw) continue;

        try {
          storedUser = JSON.parse(raw);
          break;
        } catch {
          continue;
        }
      }

      /**
       * Support several possible plan fields.
       *
       * Adjust these once your actual user response shape
       * is confirmed.
       */
      const plan =
        storedUser?.plan ??
        storedUser?.subscriptionPlan ??
        storedUser?.subscription?.plan ??
        storedUser?.currentPlan ??
        storedUser?.data?.plan ??
        null;

      const subscription =
        storedUser?.subscription ??
        storedUser?.data?.subscription ??
        null;

      const planName =
        typeof plan === "string"
          ? plan.toLowerCase()
          : (
              plan?.name ??
              plan?.code ??
              plan?.slug ??
              ""
            )
              .toString()
              .toLowerCase();

      const subscriptionStatus =
        (
          subscription?.status ??
          storedUser?.subscriptionStatus ??
          ""
        )
          .toString()
          .toLowerCase();

      const hasNoPlan =
        !plan ||
        planName === "" ||
        planName === "none" ||
        planName === "no-plan" ||
        planName === "free" ||
        planName === "free-trial" ||
        planName === "trial";

      const trial =
        storedUser?.isFreeTrial === true ||
        storedUser?.freeTrial === true ||
        storedUser?.isTrial === true ||
        storedUser?.trial === true ||
        subscriptionStatus === "trial";

      setIsFreeTrialUser(
        hasNoPlan || trial,
      );
    } catch (err) {
      console.error(
        "Unable to determine user plan:",
        err,
      );

      /**
       * Fail closed:
       * if we cannot determine the plan,
       * restrict the user to free subjects.
       */
      setIsFreeTrialUser(true);
    } finally {
      setSubscriptionChecked(true);
    }
  }, []);

  /* ==========================================================
     PRACTICE STORE
     ========================================================== */

  const jambCombination =
    usePracticeStore(
      (state) =>
        state.jambCombination,
    );

  const waecCombination =
    usePracticeStore(
      (state) =>
        state.waecCombination,
    );

  const necoCombination =
    usePracticeStore(
      (state) =>
        state.necoCombination,
    );

  /* ==========================================================
     CURRENT COMBINATION
     ========================================================== */

  const currentCombination =
    exam === "jamb"
      ? jambCombination
      : exam === "waec"
        ? waecCombination
        : necoCombination;

  /* ==========================================================
     LOAD SUBJECTS
     ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getSubjectsByPlan(
            "SECONDARY",
            1,
            ITEMS_PER_PAGE,
          );

        if (cancelled) {
          return;
        }

        const loadedSubjects =
          response.data?.subjectObj ?? [];

        setSubjects(
          loadedSubjects,
        );
      } catch (err: any) {
        if (cancelled) {
          return;
        }

        console.error(
          `Failed to load ${exam} combination subjects:`,
          err,
        );

        setError(
          err?.response?.data?.message ??
            `Unable to load your ${config.shortLabel} subjects.`,
        );

        setSubjects([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, [
    exam,
    config.shortLabel,
  ]);

  /* ==========================================================
     AVAILABLE SUBJECTS FOR THIS USER
     ========================================================== */

  const availableSubjects =
    useMemo(() => {
      if (!isFreeTrialUser) {
        return subjects;
      }

      return subjects.filter(
        (subject) =>
          FREE_TRIAL_SUBJECTS.has(
            getSubjectKey(
              subject.name,
            ),
          ),
      );
    }, [
      subjects,
      isFreeTrialUser,
    ]);

  /* ==========================================================
     SELECTED SUBJECTS
     ========================================================== */

  const selectedSubjects =
    useMemo(() => {
      return currentCombination
        .map((subjectId) =>
          availableSubjects.find(
            (subject) =>
              subject._id ===
              subjectId,
          ),
        )
        .filter(
          (
            subject,
          ): subject is Subject =>
            Boolean(subject),
        );
    }, [
      currentCombination,
      availableSubjects,
    ]);

  /* ==========================================================
     MISSING SUBJECT IDS
     ========================================================== */

  const missingSubjectIds =
    useMemo(() => {
      const availableIds =
        new Set(
          availableSubjects.map(
            (subject) =>
              subject._id,
          ),
        );

      return currentCombination.filter(
        (id) =>
          !availableIds.has(id),
      );
    }, [
      currentCombination,
      availableSubjects,
    ]);

  /* ==========================================================
     LOADING
     ========================================================== */

  if (
    loading ||
    !subscriptionChecked
  ) {
    return (
      <LoadingScreen
        message={`Preparing your ${config.shortLabel} subjects...`}
      />
    );
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <BackgroundGlow />

        <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-md border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              Unable to load subjects
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {error}
            </p>

            <Button
              className="mt-6 bg-blue-600 text-white hover:bg-blue-500"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </Button>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     NO COMBINATION
     ========================================================== */

  if (
    currentCombination.length ===
    0
  ) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <BackgroundGlow />

        <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-lg border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
              <Settings2 className="h-7 w-7 text-blue-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              No{" "}
              {config.shortLabel}{" "}
              combination selected
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Please select your{" "}
              {config.shortLabel}{" "}
              subjects before starting
              practice.
            </p>

            <Link
              href={`/student/practice/${exam}/combination`}
              className="mt-6 inline-block"
            >
              <Button
                className="bg-blue-600 text-white hover:bg-blue-500"
                rightIcon={
                  <ArrowRight className="h-4 w-4" />
                }
              >
                Set My Combination
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     FREE TRIAL + NO ALLOWED SUBJECTS
     ========================================================== */

  if (
    isFreeTrialUser &&
    selectedSubjects.length === 0
  ) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <BackgroundGlow />

        <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-lg border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
              <Lock className="h-7 w-7 text-blue-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              Free Trial Practice
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Students without an active plan
              can currently practise only
              <span className="font-semibold text-white">
                {" "}Use of English
              </span>{" "}
              and
              <span className="font-semibold text-white">
                {" "}Mathematics
              </span>.
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Upgrade your plan to unlock
              additional subjects.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/student/practice"
              >
                <Button
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                >
                  Back to Practice
                </Button>
              </Link>

              <Link
                href="/student/plans"
              >
                <Button className="bg-blue-600 text-white hover:bg-blue-500">
                  View Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     SUBJECTS COULD NOT BE RESOLVED
     ========================================================== */

  if (
    selectedSubjects.length ===
      0 &&
    subjects.length > 0
  ) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <BackgroundGlow />

        <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-lg border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10">
              <AlertCircle className="h-7 w-7 text-orange-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              Combination subjects not found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your saved{" "}
              {config.shortLabel}{" "}
              combination contains subject IDs
              that are not available from the
              subjects service.
            </p>

            <Link
              href={`/student/practice/${exam}/combination/subjects`}
              className="mt-6 inline-block"
            >
              <Button
                className="bg-blue-600 text-white hover:bg-blue-500"
                rightIcon={
                  <ArrowRight className="h-4 w-4" />
                }
              >
                Review Combination
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <BackgroundGlow />

      <div className="relative container mx-auto px-4 py-8 sm:py-10">

        {/* ====================================================
            HEADER
           ==================================================== */}

        <div className="mb-8">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-300">
            {config.label}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Your {config.shortLabel} Subjects
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">
            {config.description}{" "}
            {config.practiceDescription}
          </p>
        </div>

        {/* ====================================================
            FREE TRIAL NOTICE
           ==================================================== */}

        {isFreeTrialUser && (
          <Card className="mb-6 border border-blue-500/20 bg-blue-500/[0.06] shadow-none">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <Lock className="h-4 w-4 text-blue-400" />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Free Trial Access
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Your free trial currently
                    includes only Use of English
                    and Mathematics practice.
                    Upgrade your plan to unlock
                    more subjects.
                  </p>
                </div>
              </div>

              <Link
                href="/student/plans"
                className="shrink-0"
              >
                <Button className="bg-blue-600 text-white hover:bg-blue-500">
                  Upgrade Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* ====================================================
            COMBINATION SUMMARY
           ==================================================== */}

        <Card className="mb-8 border border-white/10 bg-white/[0.04] shadow-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Selected combination
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                {selectedSubjects.length}{" "}
                subject
                {selectedSubjects.length ===
                1
                  ? ""
                  : "s"}{" "}
                available for practice
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isFreeTrialUser
                  ? "Free trial access is limited to Use of English and Mathematics."
                  : config.compulsoryText}
              </p>

              {missingSubjectIds.length >
                0 && (
                <p className="mt-2 text-xs font-medium text-orange-400">
                  {missingSubjectIds.length}{" "}
                  selected subject
                  {missingSubjectIds.length ===
                  1
                    ? ""
                    : "s"}{" "}
                  could not be resolved or
                  are unavailable on your
                  current access.
                </p>
              )}
            </div>

            <Link
              href={`/student/practice/${exam}/combination/subjects`}
            >
              <Button
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
                leftIcon={
                  <Settings2 className="h-4 w-4" />
                }
              >
                Change Combination
              </Button>
            </Link>
          </div>
        </Card>

        {/* ====================================================
            SUBJECT CARDS
           ==================================================== */}

        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {selectedSubjects.map(
            (subject, index) => {
              const Icon =
                getSubjectIcon(
                  subject.name,
                );

              const style =
                getSubjectStyle(
                  subject.name,
                );

              const displayName =
                getSubjectDisplayName(
                  subject.name,
                );

              const subjectKey =
                getSubjectKey(
                  subject.name,
                );

              const isEnglish =
                subjectKey ===
                  "english" ||
                subjectKey ===
                  "useofenglish";

              const practiceHref =
                `/student/practice/${exam}/${subject._id}/years`;

              return (
                <Card
                  key={subject._id}
                  hoverable
                  className="flex flex-col border border-white/10 bg-white/[0.04] shadow-none transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                >
                  {/* SUBJECT NUMBER */}

                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 ${style.bg}`}
                    >
                      <Icon
                        className={`h-7 w-7 ${style.color}`}
                      />
                    </div>

                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-2 text-xs font-bold text-slate-400">
                      {index + 1}
                    </span>
                  </div>

                  {/* SUBJECT NAME */}

                  <h2 className="mt-6 text-xl font-bold text-white">
                    {displayName}
                  </h2>

                  {/* REQUIRED BADGE */}

                  {isEnglish && (
                    <span className="mt-2 w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-300">
                      {exam === "jamb"
                        ? "Compulsory Subject"
                        : "Selected Subject"}
                    </span>
                  )}

                  {/* PRACTICE INFORMATION */}

                  <div className="mt-5 space-y-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <FileQuestion className="h-4 w-4 shrink-0 text-slate-500" />

                      <span>
                        {config.shortLabel}{" "}
                        Practice Questions
                      </span>
                    </div>

                    <div>
                      {subject.hasFreePractice
                        ? "Free practice available"
                        : "Practice available"}
                    </div>
                  </div>

                  <div className="mt-8 flex-1" />

                  {/* PRACTICE BUTTON */}

                  <Link
                    href={practiceHref}
                    className="block"
                  >
                    <Button
                      fullWidth
                      className="bg-blue-600 text-white hover:bg-blue-500"
                      rightIcon={
                        <ArrowRight className="h-4 w-4" />
                      }
                    >
                      Practice Now
                    </Button>
                  </Link>
                </Card>
              );
            },
          )}
        </div>

        {/* ====================================================
            FOOTER
           ==================================================== */}

        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
          <p className="text-sm text-slate-500">
            {isFreeTrialUser
              ? "Free trial students can practise Use of English and Mathematics. Upgrade your plan for additional subjects."
              : `These are the subjects currently saved in your ${config.shortLabel} combination.`}
          </p>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   BACKGROUND
   ============================================================ */

function BackgroundGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
    </div>
  );
}

/* ============================================================
   LOADING SCREEN
   ============================================================ */

function LoadingScreen({
  message,
}: {
  message: string;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <BackgroundGlow />

      <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
            <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Loading your subjects
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {message}
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}



















// "use client";

// import {
//   Suspense,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";

// import {
//   BookOpen,
//   Calculator,
//   Atom,
//   FlaskConical,
//   Brain,
//   Globe,
//   Landmark,
//   Languages,
//   ArrowRight,
//   FileQuestion,
//   Loader2,
//   Settings2,
//   AlertCircle,
// } from "lucide-react";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// import {
//   getSubjectsByPlan,
//   type Subject,
// } from "@/lib/api/subjects";

// import { usePracticeStore } from "@/stores/practiceStore";

// /* ============================================================
//    CONFIG
//    ============================================================ */

// const ITEMS_PER_PAGE = 50;

// type ExamType = "jamb" | "waec" | "neco";

// /* ============================================================
//    EXAM CONFIG
//    ============================================================ */

// const EXAM_CONFIG: Record<
//   ExamType,
//   {
//     label: string;
//     shortLabel: string;
//     combinationLabel: string;
//     description: string;
//     practiceDescription: string;
//     compulsoryText: string;
//   }
// > = {
//   jamb: {
//     label: "JAMB Practice",
//     shortLabel: "JAMB",
//     combinationLabel: "JAMB combination",
//     description:
//       "Choose one of your selected JAMB subjects to practise past questions.",
//     practiceDescription:
//       "Practise past questions from 2000 to 2026.",
//     compulsoryText:
//       "Use of English is compulsory for JAMB.",
//   },

//   waec: {
//     label: "WAEC Practice",
//     shortLabel: "WAEC",
//     combinationLabel: "WAEC combination",
//     description:
//       "Choose one of your selected WAEC subjects to practise past questions.",
//     practiceDescription:
//       "Practise WAEC past questions and build your examination confidence.",
//     compulsoryText:
//       "Your WAEC subjects are based on the combination you selected.",
//   },

//   neco: {
//     label: "NECO Practice",
//     shortLabel: "NECO",
//     combinationLabel: "NECO combination",
//     description:
//       "Choose one of your selected NECO subjects to practise past questions.",
//     practiceDescription:
//       "Practise NECO past questions and build your examination confidence.",
//     compulsoryText:
//       "Your NECO subjects are based on the combination you selected.",
//   },
// };

// /* ============================================================
//    SUBJECT ICONS
//    ============================================================ */

// const subjectIcons = {
//   english: BookOpen,
//   useofenglish: BookOpen,

//   mathematics: Calculator,
//   maths: Calculator,

//   physics: Atom,
//   chemistry: FlaskConical,
//   biology: Brain,

//   government: Landmark,
//   geography: Globe,
//   literature: Languages,
// } as const;

// /* ============================================================
//    SUBJECT STYLES
//    ============================================================ */

// const subjectStyles = {
//   english: {
//     color: "text-blue-400",
//     bg: "bg-blue-500/10",
//   },

//   useofenglish: {
//     color: "text-blue-400",
//     bg: "bg-blue-500/10",
//   },

//   mathematics: {
//     color: "text-green-400",
//     bg: "bg-green-500/10",
//   },

//   maths: {
//     color: "text-green-400",
//     bg: "bg-green-500/10",
//   },

//   physics: {
//     color: "text-purple-400",
//     bg: "bg-purple-500/10",
//   },

//   chemistry: {
//     color: "text-orange-400",
//     bg: "bg-orange-500/10",
//   },

//   biology: {
//     color: "text-pink-400",
//     bg: "bg-pink-500/10",
//   },

//   government: {
//     color: "text-red-400",
//     bg: "bg-red-500/10",
//   },

//   geography: {
//     color: "text-cyan-400",
//     bg: "bg-cyan-500/10",
//   },

//   literature: {
//     color: "text-indigo-400",
//     bg: "bg-indigo-500/10",
//   },
// } as const;

// /* ============================================================
//    HELPERS
//    ============================================================ */

// function getSubjectKey(name: string): string {
//   return name
//     .toLowerCase()
//     .replace(/\s+/g, "")
//     .replace(/[^a-z]/g, "");
// }

// /* ============================================================
//    DISPLAY NAMES
//    ============================================================ */

// function getSubjectDisplayName(
//   name: string,
// ): string {
//   const names: Record<string, string> = {
//     english: "Use of English",
//     useofenglish: "Use of English",

//     mathematics: "Mathematics",
//     maths: "Mathematics",

//     physics: "Physics",
//     chemistry: "Chemistry",
//     biology: "Biology",

//     government: "Government",
//     geography: "Geography",
//     literature: "Literature",

//     englishlit: "Literature",

//     crk: "Christian Religious Knowledge",
//     christianreligiousknowledge:
//       "Christian Religious Knowledge",

//     irk: "Islamic Religious Knowledge",
//     islamicreligiousknowledge:
//       "Islamic Religious Knowledge",

//     economics: "Economics",
//     currentaffairs: "Current Affairs",
//     insurance: "Insurance",
//     civiceducation: "Civic Education",
//     history: "History",
//     commerce: "Commerce",
//     accounting: "Accounting",
//     agriculturalscience:
//       "Agricultural Science",
//   };

//   const normalizedName = name
//     .toLowerCase()
//     .replace(/\s+/g, "");

//   return (
//     names[normalizedName] ??
//     name
//       .replace(
//         /([a-z])([A-Z])/g,
//         "$1 $2",
//       )
//       .replace(
//         /\b\w/g,
//         (char) => char.toUpperCase(),
//       )
//   );
// }

// /* ============================================================
//    ICON
//    ============================================================ */

// function getSubjectIcon(name: string) {
//   const key = getSubjectKey(name);

//   return (
//     subjectIcons[
//       key as keyof typeof subjectIcons
//     ] ?? BookOpen
//   );
// }

// /* ============================================================
//    STYLE
//    ============================================================ */

// function getSubjectStyle(name: string) {
//   const key = getSubjectKey(name);

//   return (
//     subjectStyles[
//       key as keyof typeof subjectStyles
//     ] ?? {
//       color: "text-slate-400",
//       bg: "bg-white/[0.04]",
//     }
//   );
// }

// /* ============================================================
//    EXAM NORMALIZER
//    ============================================================ */

// function normalizeExam(
//   value: string,
// ): ExamType {
//   const exam = value.toLowerCase();

//   if (
//     exam === "waec" ||
//     exam === "neco"
//   ) {
//     return exam;
//   }

//   return "jamb";
// }

// /* ============================================================
//    PAGE WRAPPER
//    ============================================================ */

// export default function PracticeCombinationSubjectsPage() {
//   return (
//     <Suspense
//       fallback={
//         <LoadingScreen
//           message="Loading your subjects..."
//         />
//       }
//     >
//       <PracticeCombinationSubjectsContent />
//     </Suspense>
//   );
// }

// /* ============================================================
//    PAGE CONTENT
//    ============================================================ */

// function PracticeCombinationSubjectsContent() {
//   const params = useParams();

//   /* ==========================================================
//      EXAM TYPE FROM URL
//      ========================================================== */

//   const examTypeParam =
//     typeof params.examType === "string"
//       ? params.examType
//       : "";

//   const exam =
//     normalizeExam(examTypeParam);

//   const config =
//     EXAM_CONFIG[exam];

//   /* ==========================================================
//      STATE
//      ========================================================== */

//   const [subjects, setSubjects] =
//     useState<Subject[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState<string | null>(null);

//   /* ==========================================================
//      PRACTICE STORE
//      ========================================================== */

//   const jambCombination =
//     usePracticeStore(
//       (state) =>
//         state.jambCombination,
//     );

//   const waecCombination =
//     usePracticeStore(
//       (state) =>
//         state.waecCombination,
//     );

//   const necoCombination =
//     usePracticeStore(
//       (state) =>
//         state.necoCombination,
//     );

//   /* ==========================================================
//      CURRENT COMBINATION
//      ========================================================== */

//   const currentCombination =
//     exam === "jamb"
//       ? jambCombination
//       : exam === "waec"
//         ? waecCombination
//         : necoCombination;

//   /* ==========================================================
//      LOAD SUBJECTS
//      ========================================================== */

//   useEffect(() => {
//     let cancelled = false;

//     async function loadSubjects() {
//       try {
//         setLoading(true);
//         setError(null);

//         const response =
//           await getSubjectsByPlan(
//             "SECONDARY",
//             1,
//             ITEMS_PER_PAGE,
//           );

//         if (cancelled) {
//           return;
//         }

//         const loadedSubjects =
//           response.data?.subjectObj ?? [];

//         setSubjects(
//           loadedSubjects,
//         );
//       } catch (err: any) {
//         if (cancelled) {
//           return;
//         }

//         console.error(
//           `Failed to load ${exam} combination subjects:`,
//           err,
//         );

//         setError(
//           err?.response?.data?.message ??
//             `Unable to load your ${config.shortLabel} subjects.`,
//         );

//         setSubjects([]);
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadSubjects();

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     exam,
//     config.shortLabel,
//   ]);

//   /* ==========================================================
//      SELECTED SUBJECTS
//      ========================================================== */

//   const selectedSubjects =
//     useMemo(() => {
//       return currentCombination
//         .map((subjectId) =>
//           subjects.find(
//             (subject) =>
//               subject._id ===
//               subjectId,
//           ),
//         )
//         .filter(
//           (
//             subject,
//           ): subject is Subject =>
//             Boolean(subject),
//         );
//     }, [
//       currentCombination,
//       subjects,
//     ]);

//   /* ==========================================================
//      MISSING SUBJECT IDS
//      ========================================================== */

//   const missingSubjectIds =
//     useMemo(() => {
//       const availableIds =
//         new Set(
//           subjects.map(
//             (subject) =>
//               subject._id,
//           ),
//         );

//       return currentCombination.filter(
//         (id) =>
//           !availableIds.has(id),
//       );
//     }, [
//       currentCombination,
//       subjects,
//     ]);

//   /* ==========================================================
//      LOADING
//      ========================================================== */

//   if (loading) {
//     return (
//       <LoadingScreen
//         message={`Preparing your ${config.shortLabel} subjects...`}
//       />
//     );
//   }

//   /* ==========================================================
//      ERROR
//      ========================================================== */

//   if (error) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         {/* Background glow */}
//         <div className="pointer-events-none fixed inset-0 overflow-hidden">
//           <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
//           <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
//           <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
//         </div>

//         <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
//           <Card className="w-full max-w-md border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
//               <AlertCircle className="h-7 w-7 text-red-400" />
//             </div>

//             <h2 className="mt-5 text-xl font-bold text-white">
//               Unable to load subjects
//             </h2>

//             <p className="mt-2 text-sm text-slate-400">
//               {error}
//             </p>

//             <Button
//               className="mt-6 bg-blue-600 text-white hover:bg-blue-500"
//               onClick={() =>
//                 window.location.reload()
//               }
//             >
//               Try Again
//             </Button>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      NO COMBINATION
//      ========================================================== */

//   if (
//     currentCombination.length ===
//     0
//   ) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         {/* Background glow */}
//         <div className="pointer-events-none fixed inset-0 overflow-hidden">
//           <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
//           <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
//           <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
//         </div>

//         <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
//           <Card className="w-full max-w-lg border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
//               <Settings2 className="h-7 w-7 text-blue-400" />
//             </div>

//             <h2 className="mt-5 text-xl font-bold text-white">
//               No{" "}
//               {config.shortLabel}{" "}
//               combination selected
//             </h2>

//             <p className="mt-2 text-sm leading-6 text-slate-400">
//               Please select your{" "}
//               {config.shortLabel}{" "}
//               subjects before
//               starting practice.
//             </p>

//             <Link
//               href={`/student/practice/${exam}/combination`}
//               className="mt-6 inline-block"
//             >
//               <Button
//                 className="bg-blue-600 text-white hover:bg-blue-500"
//                 rightIcon={
//                   <ArrowRight className="h-4 w-4" />
//                 }
//               >
//                 Set My Combination
//               </Button>
//             </Link>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      SUBJECTS COULD NOT BE RESOLVED
//      ========================================================== */

//   if (
//     selectedSubjects.length ===
//       0 &&
//     subjects.length > 0
//   ) {
//     return (
//       <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//         {/* Background glow */}
//         <div className="pointer-events-none fixed inset-0 overflow-hidden">
//           <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
//           <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
//           <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
//         </div>

//         <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
//           <Card className="w-full max-w-lg border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10">
//               <AlertCircle className="h-7 w-7 text-orange-400" />
//             </div>

//             <h2 className="mt-5 text-xl font-bold text-white">
//               Combination subjects not
//               found
//             </h2>

//             <p className="mt-2 text-sm leading-6 text-slate-400">
//               Your saved{" "}
//               {config.shortLabel}{" "}
//               combination contains
//               subject IDs that are not
//               available from the subjects
//               service.
//             </p>

//             <Link
//               href={`/student/practice/${exam}/combination/subjects`}
//               className="mt-6 inline-block"
//             >
//               <Button
//                 className="bg-blue-600 text-white hover:bg-blue-500"
//                 rightIcon={
//                   <ArrowRight className="h-4 w-4" />
//                 }
//               >
//                 Review Combination
//               </Button>
//             </Link>
//           </Card>
//         </div>
//       </main>
//     );
//   }

//   /* ==========================================================
//      RENDER
//      ========================================================== */

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//       {/* ======================================================
//           BACKGROUND GLOW
//          ====================================================== */}

//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

//         <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

//         <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
//       </div>

//       <div className="relative container mx-auto px-4 py-8 sm:py-10">

//         {/* ====================================================
//             HEADER
//            ==================================================== */}

//         <div className="mb-8">
//           <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-sm font-semibold text-blue-300">
//             {config.label}
//           </span>

//           <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
//             Your{" "}
//             {config.shortLabel}{" "}
//             Subjects
//           </h1>

//           <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">
//             {config.description}{" "}
//             {config.practiceDescription}
//           </p>
//         </div>

//         {/* ====================================================
//             COMBINATION SUMMARY
//            ==================================================== */}

//         <Card className="mb-8 border border-white/10 bg-white/[0.04] shadow-none">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//             <div>
//               <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
//                 Selected combination
//               </p>

//               <h2 className="mt-1 text-xl font-bold text-white">
//                 {selectedSubjects.length}{" "}
//                 subject
//                 {selectedSubjects.length ===
//                 1
//                   ? ""
//                   : "s"}{" "}
//                 available for practice
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 {config.compulsoryText}
//               </p>

//               {missingSubjectIds.length >
//                 0 && (
//                 <p className="mt-2 text-xs font-medium text-orange-400">
//                   {
//                     missingSubjectIds.length
//                   }{" "}
//                   selected subject
//                   {missingSubjectIds.length ===
//                   1
//                     ? ""
//                     : "s"}{" "}
//                   could not be
//                   resolved.
//                 </p>
//               )}
//             </div>

//             <Link
//               href={`/student/practice/${exam}/combination/subjects`}
//             >
//               <Button
//                 variant="outline"
//                 className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] hover:text-white"
//                 leftIcon={
//                   <Settings2 className="h-4 w-4" />
//                 }
//               >
//                 Change Combination
//               </Button>
//             </Link>
//           </div>
//         </Card>

//         {/* ====================================================
//             SUBJECT CARDS
//            ==================================================== */}

//         <div
//           className="
//             grid
//             gap-5
//             sm:grid-cols-2
//             lg:grid-cols-3
//             xl:grid-cols-4
//           "
//         >
//           {selectedSubjects.map(
//             (subject, index) => {
//               const Icon =
//                 getSubjectIcon(
//                   subject.name,
//                 );

//               const style =
//                 getSubjectStyle(
//                   subject.name,
//                 );

//               const displayName =
//                 getSubjectDisplayName(
//                   subject.name,
//                 );

//               const subjectKey =
//                 getSubjectKey(
//                   subject.name,
//                 );

//               const isEnglish =
//                 subjectKey ===
//                   "english" ||
//                 subjectKey ===
//                   "useofenglish";


//               const practiceHref =
//                 `/student/practice/${exam}/${subject._id}/years`;

//               return (
//                 <Card
//                   key={subject._id}
//                   hoverable
//                   className="flex flex-col border border-white/10 bg-white/[0.04] shadow-none transition-colors hover:border-white/20 hover:bg-white/[0.06]"
//                 >
//                   {/* ==================================================
//                       SUBJECT NUMBER
//                      ================================================== */}

//                   <div className="flex items-start justify-between">
//                     <div
//                       className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 ${style.bg}`}
//                     >
//                       <Icon
//                         className={`h-7 w-7 ${style.color}`}
//                       />
//                     </div>

//                     <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-2 text-xs font-bold text-slate-400">
//                       {index + 1}
//                     </span>
//                   </div>

//                   {/* ==================================================
//                       SUBJECT NAME
//                      ================================================== */}

//                   <h2 className="mt-6 text-xl font-bold text-white">
//                     {displayName}
//                   </h2>

//                   {/* ==================================================
//                       REQUIRED BADGE
//                      ================================================== */}

//                   {isEnglish && (
//                     <span className="mt-2 w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-300">
//                       {exam ===
//                       "jamb"
//                         ? "Compulsory Subject"
//                         : "Selected Subject"}
//                     </span>
//                   )}

//                   {/* ==================================================
//                       PRACTICE INFORMATION
//                      ================================================== */}

//                   <div className="mt-5 space-y-3 text-sm text-slate-400">

//                     <div className="flex items-center gap-2">
//                       <FileQuestion className="h-4 w-4 shrink-0 text-slate-500" />

//                       <span>
//                         {
//                           config.shortLabel
//                         }{" "}
//                         Practice
//                         Questions
//                       </span>
//                     </div>

//                     <div>
//                       {subject.hasFreePractice
//                         ? "Free practice available"
//                         : "Practice available"}
//                     </div>

//                   </div>

//                   <div className="mt-8 flex-1" />

//                   {/* ==================================================
//                       PRACTICE BUTTON
//                      ================================================== */}

//                   <Link
//                     href={practiceHref}
//                     className="block"
//                   >
//                     <Button
//                       fullWidth
//                       className="bg-blue-600 text-white hover:bg-blue-500"
//                       rightIcon={
//                         <ArrowRight className="h-4 w-4" />
//                       }
//                     >
//                       Practice Now
                      
//                     </Button>
//                   </Link>
//                 </Card>
//               );
//             },
//           )}
//         </div>

//         {/* ====================================================
//             FOOTER
//            ==================================================== */}

//         <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
//           <p className="text-sm text-slate-500">
//             These are the subjects currently
//             saved in your{" "}
//             {config.shortLabel}{" "}
//             combination.
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// }

// /* ============================================================
//    LOADING SCREEN
//    ============================================================ */

// function LoadingScreen({
//   message,
// }: {
//   message: string;
// }) {
//   return (
//     <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
//       {/* Background glow */}
//       <div className="pointer-events-none fixed inset-0 overflow-hidden">
//         <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

//         <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

//         <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
//       </div>

//       <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
//         <div className="flex flex-col items-center gap-4 text-center">

//           <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
//             <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
//           </div>

//           <div>
//             <h2 className="font-semibold text-white">
//               Loading your subjects
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               {message}
//             </p>
//           </div>

//         </div>
//       </div>
//     </main>
//   );
// }






















