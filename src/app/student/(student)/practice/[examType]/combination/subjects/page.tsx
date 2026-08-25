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
    color: "text-blue-600",
    bg: "bg-blue-100",
  },

  useofenglish: {
    color: "text-blue-600",
    bg: "bg-blue-100",
  },

  mathematics: {
    color: "text-green-600",
    bg: "bg-green-100",
  },

  maths: {
    color: "text-green-600",
    bg: "bg-green-100",
  },

  physics: {
    color: "text-purple-600",
    bg: "bg-purple-100",
  },

  chemistry: {
    color: "text-orange-600",
    bg: "bg-orange-100",
  },

  biology: {
    color: "text-pink-600",
    bg: "bg-pink-100",
  },

  government: {
    color: "text-red-600",
    bg: "bg-red-100",
  },

  geography: {
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },

  literature: {
    color: "text-indigo-600",
    bg: "bg-indigo-100",
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
      color: "text-slate-600",
      bg: "bg-slate-100",
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
     SELECTED SUBJECTS
     ========================================================== */

  const selectedSubjects =
    useMemo(() => {
      return currentCombination
        .map((subjectId) =>
          subjects.find(
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
      subjects,
    ]);

  /* ==========================================================
     MISSING SUBJECT IDS
     ========================================================== */

  const missingSubjectIds =
    useMemo(() => {
      const availableIds =
        new Set(
          subjects.map(
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
      subjects,
    ]);

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
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
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-md p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Unable to load subjects
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {error}
            </p>

            <Button
              className="mt-6"
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
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-lg p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Settings2 className="h-7 w-7 text-blue-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No{" "}
              {config.shortLabel}{" "}
              combination selected
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Please select your{" "}
              {config.shortLabel}{" "}
              subjects before
              starting practice.
            </p>

            <Link
              href={`/student/practice/${exam}/combination/subjects`}
              className="mt-6 inline-block"
            >
              <Button
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
     SUBJECTS COULD NOT BE RESOLVED
     ========================================================== */

  if (
    selectedSubjects.length ===
      0 &&
    subjects.length > 0
  ) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-lg p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
              <AlertCircle className="h-7 w-7 text-orange-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Combination subjects not
              found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Your saved{" "}
              {config.shortLabel}{" "}
              combination contains
              subject IDs that are not
              available from the subjects
              service.
            </p>

            <Link
              href={`/student/practice/${exam}/combination/subjects`}
              className="mt-6 inline-block"
            >
              <Button
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
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 sm:py-10">

        {/* ====================================================
            HEADER
           ==================================================== */}

        <div className="mb-8">
          <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
            {config.label}
          </span>

          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Your{" "}
            {config.shortLabel}{" "}
            Subjects
          </h1>

          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            {config.description}{" "}
            {config.practiceDescription}
          </p>
        </div>

        {/* ====================================================
            COMBINATION SUMMARY
           ==================================================== */}

        <Card className="mb-8 border-blue-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Selected combination
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {selectedSubjects.length}{" "}
                subject
                {selectedSubjects.length ===
                1
                  ? ""
                  : "s"}{" "}
                available for practice
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {config.compulsoryText}
              </p>

              {missingSubjectIds.length >
                0 && (
                <p className="mt-2 text-xs font-medium text-orange-600">
                  {
                    missingSubjectIds.length
                  }{" "}
                  selected subject
                  {missingSubjectIds.length ===
                  1
                    ? ""
                    : "s"}{" "}
                  could not be
                  resolved.
                </p>
              )}
            </div>

            <Link
              href={`/student/practice/${exam}/combination/subjects`}
            >
              <Button
                variant="outline"
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

              /*
               * NEW ROUTE
               *
               * JAMB:
               * /student/practice/jamb/{subjectId}/years
               *
               * WAEC:
               * /student/practice/waec/{subjectId}/years
               *
               * NECO:
               * /student/practice/neco/{subjectId}/years
               */

              const practiceHref =
                `/student/practice/${exam}/${subject._id}/years`;

              return (
                <Card
                  key={subject._id}
                  hoverable
                  className="flex flex-col"
                >
                  {/* ==================================================
                      SUBJECT NUMBER
                     ================================================== */}

                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.bg}`}
                    >
                      <Icon
                        className={`h-7 w-7 ${style.color}`}
                      />
                    </div>

                    <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-600">
                      {index + 1}
                    </span>
                  </div>

                  {/* ==================================================
                      SUBJECT NAME
                     ================================================== */}

                  <h2 className="mt-6 text-xl font-bold text-slate-900">
                    {displayName}
                  </h2>

                  {/* ==================================================
                      REQUIRED BADGE
                     ================================================== */}

                  {isEnglish && (
                    <span className="mt-2 w-fit rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {exam ===
                      "jamb"
                        ? "Compulsory Subject"
                        : "Selected Subject"}
                    </span>
                  )}

                  {/* ==================================================
                      PRACTICE INFORMATION
                     ================================================== */}

                  <div className="mt-5 space-y-3 text-sm text-slate-600">

                    <div className="flex items-center gap-2">
                      <FileQuestion className="h-4 w-4 shrink-0" />

                      <span>
                        {
                          config.shortLabel
                        }{" "}
                        Practice
                        Questions
                      </span>
                    </div>

                    <div>
                      {subject.hasFreePractice
                        ? "Free practice available"
                        : "Practice available"}
                    </div>

                  </div>

                  <div className="mt-8 flex-1" />

                  {/* ==================================================
                      PRACTICE BUTTON
                     ================================================== */}

                  <Link
                    href={practiceHref}
                    className="block"
                  >
                    <Button
                      fullWidth
                      rightIcon={
                        <ArrowRight className="h-4 w-4" />
                      }
                    >
                      Practice{" "}
                      {displayName}
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

        <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-4 text-center">
          <p className="text-sm text-slate-500">
            These are the subjects currently
            saved in your{" "}
            {config.shortLabel}{" "}
            combination.
          </p>
        </div>
      </div>
    </main>
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
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
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
// import { useSearchParams } from "next/navigation";

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
//     combinationPath: string;
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
//     combinationPath:
//       // "/student/practice/${exam}/combination/jamb",
//       `/student/practice/${exam}/${subjectId}/years`
      
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
//     combinationPath:
     
//        "/student/practice/${exam}/combination/subjects",
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
//     combinationPath:
      
//        "/student/practice/${exam}/combination/subjects",
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
//     color: "text-blue-600",
//     bg: "bg-blue-100",
//   },

//   useofenglish: {
//     color: "text-blue-600",
//     bg: "bg-blue-100",
//   },

//   mathematics: {
//     color: "text-green-600",
//     bg: "bg-green-100",
//   },

//   maths: {
//     color: "text-green-600",
//     bg: "bg-green-100",
//   },

//   physics: {
//     color: "text-purple-600",
//     bg: "bg-purple-100",
//   },

//   chemistry: {
//     color: "text-orange-600",
//     bg: "bg-orange-100",
//   },

//   biology: {
//     color: "text-pink-600",
//     bg: "bg-pink-100",
//   },

//   government: {
//     color: "text-red-600",
//     bg: "bg-red-100",
//   },

//   geography: {
//     color: "text-cyan-600",
//     bg: "bg-cyan-100",
//   },

//   literature: {
//     color: "text-indigo-600",
//     bg: "bg-indigo-100",
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
//     agriculturalScience:
//       "Agricultural Science",
//   };

//   const normalizedName = name
//     .toLowerCase()
//     .replace(/\s+/g, "");

//   return (
//     names[normalizedName] ??
//     name
//       .replace(/([a-z])([A-Z])/g, "$1 $2")
//       .replace(/\b\w/g, (char) =>
//         char.toUpperCase(),
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
//       color: "text-slate-600",
//       bg: "bg-slate-100",
//     }
//   );
// }

// /* ============================================================
//    EXAM NORMALIZER
//    ============================================================ */

// function normalizeExam(
//   value: string | null,
// ): ExamType {
//   const exam = value?.toLowerCase();

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
//         <LoadingScreen message="Loading your subjects..." />
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
//   const searchParams = useSearchParams();

//   /* ==========================================================
//      EXAM
//      ========================================================== */

//   const exam = normalizeExam(
//     searchParams.get("exam"),
//   );

//   const config = EXAM_CONFIG[exam];

//   /* ==========================================================
//      STATE
//      ========================================================== */

//   const [subjects, setSubjects] = useState<
//     Subject[]
//   >([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState<string | null>(null);

//   /* ==========================================================
//      PRACTICE STORE
//      ========================================================== */

//   const jambCombination =
//     usePracticeStore(
//       (state) => state.jambCombination,
//     );

//   const waecCombination =
//     usePracticeStore(
//       (state) => state.waecCombination,
//     );

//   const necoCombination =
//     usePracticeStore(
//       (state) => state.necoCombination,
//     );

//   /* ==========================================================
//      GET CURRENT COMBINATION
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

//         /*
//          * The subject catalogue is shared.
//          *
//          * The examination determines which
//          * combination IDs we use below.
//          */

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

//         setSubjects(loadedSubjects);
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
//   }, [exam, config.shortLabel]);

//   /* ==========================================================
//      SELECTED SUBJECTS
//      ========================================================== */

//   const selectedSubjects = useMemo(() => {
//     /*
//      * IMPORTANT:
//      *
//      * currentCombination contains backend
//      * subject IDs.
//      *
//      * Example:
//      *
//      * JAMB:
//      * [
//      *   englishId,
//      *   physicsId,
//      *   chemistryId,
//      *   mathematicsId
//      * ]
//      *
//      * WAEC:
//      * [
//      *   englishId,
//      *   mathematicsId,
//      *   biologyId,
//      *   chemistryId,
//      *   ...
//      * ]
//      *
//      * NECO:
//      * [
//      *   ...
//      * ]
//      */

//     return currentCombination
//       .map((subjectId) =>
//         subjects.find(
//           (subject) =>
//             subject._id === subjectId,
//         ),
//       )
//       .filter(
//         (
//           subject,
//         ): subject is Subject =>
//           Boolean(subject),
//       );
//   }, [
//     currentCombination,
//     subjects,
//   ]);

//   /* ==========================================================
//      MISSING SUBJECT IDS
//      ========================================================== */

//   const missingSubjectIds = useMemo(() => {
//     const availableIds = new Set(
//       subjects.map(
//         (subject) => subject._id,
//       ),
//     );

//     return currentCombination.filter(
//       (id) => !availableIds.has(id),
//     );
//   }, [
//     currentCombination,
//     subjects,
//   ]);

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
//       <main className="min-h-screen bg-slate-50">
//         <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
//           <Card className="w-full max-w-md p-8 text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
//               <AlertCircle className="h-7 w-7 text-red-600" />
//             </div>

//             <h2 className="mt-5 text-xl font-bold text-slate-900">
//               Unable to load subjects
//             </h2>

//             <p className="mt-2 text-sm text-slate-600">
//               {error}
//             </p>

//             <Button
//               className="mt-6"
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

//   if (currentCombination.length === 0) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
//           <Card className="w-full max-w-lg p-8 text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
//               <Settings2 className="h-7 w-7 text-blue-600" />
//             </div>

//             <h2 className="mt-5 text-xl font-bold text-slate-900">
//               No {config.shortLabel} combination selected
//             </h2>

//             <p className="mt-2 text-sm leading-6 text-slate-600">
//               Please select your{" "}
//               {config.shortLabel} subjects before
//               starting practice.
//             </p>

//             <Link
//               href={config.combinationPath}
//               className="mt-6 inline-block"
//             >
//               <Button
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
//      SOME SUBJECTS ARE MISSING
//      ========================================================== */

//   if (
//     selectedSubjects.length === 0 &&
//     subjects.length > 0
//   ) {
//     return (
//       <main className="min-h-screen bg-slate-50">
//         <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
//           <Card className="w-full max-w-lg p-8 text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
//               <AlertCircle className="h-7 w-7 text-orange-600" />
//             </div>

//             <h2 className="mt-5 text-xl font-bold text-slate-900">
//               Combination subjects not found
//             </h2>

//             <p className="mt-2 text-sm leading-6 text-slate-600">
//               Your saved {config.shortLabel} combination
//               contains subject IDs that are not available
//               from the subjects service.
//             </p>

//             <Link
//               href={config.combinationPath}
//               className="mt-6 inline-block"
//             >
//               <Button
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
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto px-4 py-8 sm:py-10">

//         {/* ====================================================
//             HEADER
//            ==================================================== */}

//         <div className="mb-8">
//           <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
//             {config.label}
//           </span>

//           <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
//             Your {config.shortLabel} Subjects
//           </h1>

//           <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
//             {config.description}{" "}
//             {config.practiceDescription}
//           </p>
//         </div>

//         {/* ====================================================
//             COMBINATION SUMMARY
//            ==================================================== */}

//         <Card className="mb-8 border-blue-100 bg-gradient-to-r from-blue-50 to-white">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//             <div>
//               <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
//                 Selected combination
//               </p>

//               <h2 className="mt-1 text-xl font-bold text-slate-900">
//                 {selectedSubjects.length}{" "}
//                 subject
//                 {selectedSubjects.length === 1
//                   ? ""
//                   : "s"}{" "}
//                 available for practice
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 {config.compulsoryText}
//               </p>

//               {missingSubjectIds.length > 0 && (
//                 <p className="mt-2 text-xs font-medium text-orange-600">
//                   {missingSubjectIds.length} selected
//                   subject
//                   {missingSubjectIds.length === 1
//                     ? ""
//                     : "s"}{" "}
//                   could not be resolved.
//                 </p>
//               )}
//             </div>

//             <Link
//               href={config.combinationPath}
//             >
//               <Button
//                 variant="outline"
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

//               const isEnglish =
//                 getSubjectKey(
//                   subject.name,
//                 ) === "english" ||
//                 getSubjectKey(
//                   subject.name,
//                 ) === "useofenglish";

//               /*
//                * IMPORTANT:
//                *
//                * Pass the examination to the
//                * subject years page too.
//                *
//                * Without this, WAEC/NECO can
//                * fall back to JAMB there.
//                */

//               const practiceHref =
//                 `/student/practice/${subject._id}/years?exam=${exam}`;

//               return (
//                 <Card
//                   key={subject._id}
//                   hoverable
//                   className="flex flex-col"
//                 >
//                   {/* ==================================================
//                       SUBJECT NUMBER
//                      ================================================== */}

//                   <div className="flex items-start justify-between">
//                     <div
//                       className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.bg}`}
//                     >
//                       <Icon
//                         className={`h-7 w-7 ${style.color}`}
//                       />
//                     </div>

//                     <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-bold text-slate-600">
//                       {index + 1}
//                     </span>
//                   </div>

//                   {/* ==================================================
//                       SUBJECT NAME
//                      ================================================== */}

//                   <h2 className="mt-6 text-xl font-bold text-slate-900">
//                     {displayName}
//                   </h2>

//                   {/* ==================================================
//                       REQUIRED BADGE
//                      ================================================== */}

//                   {isEnglish && (
//                     <span className="mt-2 w-fit rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
//                       {exam === "jamb"
//                         ? "Compulsory Subject"
//                         : "Selected Subject"}
//                     </span>
//                   )}

//                   {/* ==================================================
//                       PRACTICE INFORMATION
//                      ================================================== */}

//                   <div className="mt-5 space-y-3 text-sm text-slate-600">

//                     <div className="flex items-center gap-2">
//                       <FileQuestion className="h-4 w-4 shrink-0" />

//                       <span>
//                         {config.shortLabel} Practice
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
//                       rightIcon={
//                         <ArrowRight className="h-4 w-4" />
//                       }
//                     >
//                       Practice{" "}
//                       {displayName}
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

//         <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-4 text-center">
//           <p className="text-sm text-slate-500">
//             These are the subjects currently saved
//             in your {config.shortLabel} combination.
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
//     <main className="min-h-screen bg-slate-50">
//       <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
//         <div className="flex flex-col items-center gap-4 text-center">

//           <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
//             <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
//           </div>

//           <div>
//             <h2 className="font-semibold text-slate-900">
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