



"use client";

import { useEffect, useMemo, useState } from "react";
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
  Check,
  Loader2,
  RotateCcw,
  Sparkles,
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

const JAMB_MAX_SUBJECTS = 4;

const OTHER_EXAM_MAX_SUBJECTS = 20;

/* ============================================================
   EXAM TYPE
   ============================================================ */

type ExamType = "jamb" | "waec" | "neco";

/* ============================================================
   EXAM CONFIG
   ============================================================ */

const examConfig: Record<
  ExamType,
  {
    label: string;
    title: string;
    description: string;
    maxSubjects: number;
    requiresEnglish: boolean;
  }
> = {
  jamb: {
    label: "JAMB Practice",
    title: "Set Your JAMB Combination",
    description:
      "Select the four subjects you want to practise. Use of English is compulsory.",
    maxSubjects: JAMB_MAX_SUBJECTS,
    requiresEnglish: true,
  },

  waec: {
    label: "WAEC Practice",
    title: "Select Your WAEC Subjects",
    description:
      "Select the WAEC subjects you want to practise.",
    maxSubjects: OTHER_EXAM_MAX_SUBJECTS,
    requiresEnglish: false,
  },

  neco: {
    label: "NECO Practice",
    title: "Select Your NECO Subjects",
    description:
      "Select the NECO subjects you want to practise.",
    maxSubjects: OTHER_EXAM_MAX_SUBJECTS,
    requiresEnglish: false,
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
    selected:
      "border-blue-500 bg-blue-50 ring-2 ring-blue-100",
  },

  useofenglish: {
    color: "text-blue-600",
    bg: "bg-blue-100",
    selected:
      "border-blue-500 bg-blue-50 ring-2 ring-blue-100",
  },

  mathematics: {
    color: "text-green-600",
    bg: "bg-green-100",
    selected:
      "border-green-500 bg-green-50 ring-2 ring-green-100",
  },

  maths: {
    color: "text-green-600",
    bg: "bg-green-100",
    selected:
      "border-green-500 bg-green-50 ring-2 ring-green-100",
  },

  physics: {
    color: "text-purple-600",
    bg: "bg-purple-100",
    selected:
      "border-purple-500 bg-purple-50 ring-2 ring-purple-100",
  },

  chemistry: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    selected:
      "border-orange-500 bg-orange-50 ring-2 ring-orange-100",
  },

  biology: {
    color: "text-pink-600",
    bg: "bg-pink-50",
    selected:
      "border-pink-500 bg-pink-50 ring-2 ring-pink-100",
  },

  government: {
    color: "text-red-600",
    bg: "bg-red-100",
    selected:
      "border-red-500 bg-red-50 ring-2 ring-red-100",
  },

  geography: {
    color: "text-cyan-600",
    bg: "bg-cyan-100",
    selected:
      "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100",
  },

  literature: {
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    selected:
      "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100",
  },
} as const;

/* ============================================================
   HELPERS
   ============================================================ */

function normalizeExam(value: unknown): ExamType {
  const exam = String(value ?? "").toLowerCase();

  if (exam === "waec") {
    return "waec";
  }

  if (exam === "neco") {
    return "neco";
  }

  return "jamb";
}

/* ============================================================
   SUBJECT KEY
   ============================================================ */

function getSubjectKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "");
}

/* ============================================================
   SUBJECT DISPLAY NAME
   ============================================================ */

function getSubjectDisplayName(name: string): string {
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
    agriculturalscience: "Agricultural Science",
  };

  const normalizedName = name
    .toLowerCase()
    .replace(/\s+/g, "");

  return (
    names[normalizedName] ??
    name
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase(),
      )
  );
}

/* ============================================================
   SUBJECT ICON
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
   SUBJECT STYLE
   ============================================================ */

function getSubjectStyle(name: string) {
  const key = getSubjectKey(name);

  return (
    subjectStyles[
      key as keyof typeof subjectStyles
    ] ?? {
      color: "text-slate-600",
      bg: "bg-slate-100",
      selected:
        "border-slate-500 bg-slate-50 ring-2 ring-slate-100",
    }
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function PracticeCombinationPage() {
  const params = useParams();

  /* ==========================================================
     IMPORTANT
     
     The exam comes from:
     
     /practice/[examType]/combination
     
     NOT from ?exam=jamb
     ========================================================== */

  const exam = normalizeExam(params?.examType);

  const config = examConfig[exam];

  /* ==========================================================
     STATE
     ========================================================== */

  const [subjects, setSubjects] = useState<Subject[]>(
    [],
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* ==========================================================
     PRACTICE STORE
     ========================================================== */

  const {
    jambCombination,
    setJambCombination,
    toggleJambSubject,
    clearJambCombination,

    waecCombination,
    toggleWaecSubject,
    clearWaecCombination,

    necoCombination,
    toggleNecoSubject,
    clearNecoCombination,
  } = usePracticeStore();

  /* ==========================================================
     ACTIVE COMBINATION
     ========================================================== */

  const combination =
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

        setSubjects(loadedSubjects);

        /* ----------------------------------------------------
           JAMB ONLY

           Automatically add Use of English.

           WAEC and NECO do NOT get English
           automatically.
           ---------------------------------------------------- */

        if (exam === "jamb") {
          const currentJambCombination =
            usePracticeStore.getState()
              .jambCombination;

          if (
            currentJambCombination.length === 0
          ) {
            const englishSubject =
              loadedSubjects.find(
                (subject) => {
                  const key =
                    getSubjectKey(
                      subject.name,
                    );

                  return (
                    key === "english" ||
                    key === "useofenglish"
                  );
                },
              );

            if (englishSubject) {
              setJambCombination([
                englishSubject._id,
              ]);
            }
          }
        }
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        console.error(
          `Failed to load ${exam} subjects:`,
          err,
        );

        const message =
          err &&
          typeof err === "object" &&
          "response" in err &&
          typeof (
            err as {
              response?: {
                data?: {
                  message?: string;
                };
              };
            }
          ).response?.data?.message ===
            "string"
            ? (
                err as {
                  response: {
                    data: {
                      message: string;
                    };
                  };
                }
              ).response.data.message
            : `Unable to load ${config.label} subjects.`;

        setError(message);
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

    // Zustand combination state intentionally
    // does not belong in this dependency array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam]);

  /* ==========================================================
     ENGLISH SUBJECT
     ========================================================== */

  const englishSubject = useMemo(() => {
    return subjects.find((subject) => {
      const key = getSubjectKey(subject.name);

      return (
        key === "english" ||
        key === "useofenglish"
      );
    });
  }, [subjects]);

  /* ==========================================================
     SELECTED SUBJECTS
     ========================================================== */

  const selectedSubjects = useMemo(() => {
    return subjects.filter((subject) =>
      combination.includes(subject._id),
    );
  }, [subjects, combination]);

  /* ==========================================================
     OPTIONAL JAMB COUNT
     ========================================================== */

  const optionalSelectedCount =
    exam === "jamb"
      ? Math.max(
          combination.length -
            (englishSubject &&
            combination.includes(
              englishSubject._id,
            )
              ? 1
              : 0),
          0,
        )
      : combination.length;

  /* ==========================================================
     COMPLETION
     ========================================================== */

  const combinationComplete =
    exam === "jamb"
      ? combination.length ===
        JAMB_MAX_SUBJECTS
      : combination.length > 0;

  /* ==========================================================
     SUBJECT TOGGLE
     ========================================================== */

  function handleSubjectToggle(
    subject: Subject,
  ) {
    const subjectKey =
      getSubjectKey(subject.name);

    const isEnglish =
      subjectKey === "english" ||
      subjectKey === "useofenglish";

    const isSelected =
      combination.includes(subject._id);

    /* --------------------------------------------------------
       JAMB ENGLISH CANNOT BE REMOVED
       -------------------------------------------------------- */

    if (
      exam === "jamb" &&
      isEnglish
    ) {
      return;
    }

    /* --------------------------------------------------------
       REMOVE
       -------------------------------------------------------- */

    if (isSelected) {
      if (exam === "jamb") {
        toggleJambSubject(subject._id);
      } else if (exam === "waec") {
        toggleWaecSubject(subject._id);
      } else {
        toggleNecoSubject(subject._id);
      }

      return;
    }

    /* --------------------------------------------------------
       MAXIMUM
       -------------------------------------------------------- */

    if (
      combination.length >=
      config.maxSubjects
    ) {
      return;
    }

    /* --------------------------------------------------------
       ADD
       -------------------------------------------------------- */

    if (exam === "jamb") {
      toggleJambSubject(subject._id);
    } else if (exam === "waec") {
      toggleWaecSubject(subject._id);
    } else {
      toggleNecoSubject(subject._id);
    }
  }

  /* ==========================================================
     RESET
     ========================================================== */

  function handleResetCombination() {
    if (exam === "jamb") {
      clearJambCombination();

      /*
       * Restore compulsory Use of English.
       */

      if (englishSubject) {
        setJambCombination([
          englishSubject._id,
        ]);
      }

      return;
    }

    if (exam === "waec") {
      clearWaecCombination();
      return;
    }

    clearNecoCombination();
  }

  /* ==========================================================
     NEXT ROUTE
     ==========================================================

     Current page:

       /student/practice/[examType]/combination

     After selecting subjects:

       /student/practice/[examType]/combination/subjects

     Therefore:

       JAMB -> /student/practice/jamb/combination/subjects
       WAEC -> /student/practice/waec/combination/subjects
       NECO -> /student/practice/neco/combination/subjects
  */

  const nextRoute =
    `/student/practice/${exam}/combination/subjects`;

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Loading{" "}
                {exam.toUpperCase()}{" "}
                subjects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Preparing your subject
                selection...
              </p>
            </div>

          </div>
        </div>
      </main>
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
              <BookOpen className="h-7 w-7 text-red-600" />
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
     PAGE
     ========================================================== */

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">

        {/* ====================================================
            HEADER
           ==================================================== */}

        <section className="mb-6">

          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Sparkles className="h-4 w-4" />

            {config.label}
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {config.title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            {config.description}
          </p>

        </section>

        {/* ====================================================
            COMBINATION SUMMARY
           ==================================================== */}

        <Card className="mb-6 overflow-hidden border-blue-100 bg-white p-0">

          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-5 py-4">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {exam === "jamb"
                    ? "Your combination"
                    : "Selected subjects"}
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">

                  {combination.length}

                  {exam === "jamb"
                    ? ` / ${JAMB_MAX_SUBJECTS}`
                    : ""}

                  {" "}

                  {exam === "jamb"
                    ? "subjects selected"
                    : combination.length === 1
                      ? "subject selected"
                      : "subjects selected"}

                </h2>

              </div>

              <button
                type="button"
                onClick={
                  handleResetCombination
                }
                className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-500 transition hover:text-red-600 sm:self-auto"
              >
                <RotateCcw className="h-4 w-4" />

                Reset
              </button>

            </div>

          </div>

          <div className="px-5 py-4">

            <div className="flex flex-wrap gap-2">

              {selectedSubjects.map(
                (subject, index) => {

                  const key =
                    getSubjectKey(
                      subject.name,
                    );

                  const isEnglish =
                    key === "english" ||
                    key ===
                      "useofenglish";

                  return (
                    <div
                      key={subject._id}
                      className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800"
                    >

                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                        {index + 1}
                      </span>

                      {getSubjectDisplayName(
                        subject.name,
                      )}

                      {exam === "jamb" &&
                        isEnglish && (
                          <span className="text-[10px] font-semibold uppercase text-blue-500">
                            Required
                          </span>
                        )}

                    </div>
                  );
                },
              )}

              {/* JAMB remaining */}

              {!combinationComplete &&
                exam === "jamb" && (
                  <div className="flex items-center rounded-full border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-400">
                    Select{" "}
                    {JAMB_MAX_SUBJECTS -
                      combination.length}{" "}
                    more
                  </div>
                )}

              {/* WAEC / NECO empty */}

              {!combinationComplete &&
                exam !== "jamb" &&
                combination.length ===
                  0 && (
                  <div className="flex items-center rounded-full border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-400">
                    Select at least one
                    subject
                  </div>
                )}

            </div>

          </div>

        </Card>

        {/* ====================================================
            SUBJECT SELECTION
           ==================================================== */}

        <section>

          <div className="mb-4 flex items-end justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Choose your subjects
              </h2>

              <p className="mt-1 text-sm text-slate-500">

                {exam === "jamb"
                  ? `${optionalSelectedCount} of 3 optional subjects selected`
                  : `${combination.length} subject${
                      combination.length ===
                      1
                        ? ""
                        : "s"
                    } selected`}

              </p>

            </div>

            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:block">

              {exam === "jamb"
                ? "4 subjects maximum"
                : "Select your subjects"}

            </span>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

            {subjects.map((subject) => {

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

              const isSelected =
                combination.includes(
                  subject._id,
                );

              const key =
                getSubjectKey(
                  subject.name,
                );

              const isEnglish =
                key === "english" ||
                key === "useofenglish";

              const disabled =
                !isSelected &&
                combination.length >=
                  config.maxSubjects;

              return (
                <button
                  key={subject._id}
                  type="button"
                  disabled={
                    disabled ||
                    (exam === "jamb" &&
                      isEnglish)
                  }
                  onClick={() =>
                    handleSubjectToggle(
                      subject,
                    )
                  }
                  className={[
                    "group relative rounded-xl border bg-white p-4 text-left transition-all duration-200",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",

                    isSelected
                      ? style.selected
                      : "border-slate-200 hover:border-slate-300",

                    disabled
                      ? "cursor-not-allowed opacity-40 hover:translate-y-0 hover:shadow-none"
                      : "",
                  ].join(" ")}
                >

                  {/* Selected indicator */}

                  {isSelected && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  )}

                  {/* Icon */}

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.bg}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${style.color}`}
                    />
                  </div>

                  {/* Name */}

                  <h3 className="mt-4 pr-5 text-sm font-bold text-slate-900 sm:text-base">
                    {displayName}
                  </h3>

                  {/* Status */}

                  <p className="mt-1 text-xs text-slate-500">

                    {exam === "jamb" &&
                    isEnglish
                      ? "Compulsory"
                      : isSelected
                        ? "Selected"
                        : "Tap to select"}

                  </p>

                </button>
              );
            })}

          </div>

        </section>

        {/* ====================================================
            BOTTOM ACTION
           ==================================================== */}

        <div className="sticky bottom-4 z-20 mt-6">

          <Card className="border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="hidden sm:block">

                <p className="text-sm font-semibold text-slate-900">

                  {combinationComplete
                    ? `Your ${exam.toUpperCase()} selection is ready`
                    : "Select your subjects"}

                </p>

                <p className="text-xs text-slate-500">

                  {combinationComplete
                    ? "You can now continue to practice."
                    : exam === "jamb"
                      ? `Select ${
                          JAMB_MAX_SUBJECTS -
                          combination.length
                        } more subject${
                          JAMB_MAX_SUBJECTS -
                            combination.length ===
                          1
                            ? ""
                            : "s"
                        }.`
                      : "Select at least one subject to continue."}

                </p>

              </div>

              {/* ==================================================
                  CONTINUE
                 ================================================== */}

              {combinationComplete ? (
                <Link
                  href={nextRoute}
                  className="w-full sm:w-auto"
                >
                  <Button
                    fullWidth
                    rightIcon={
                      <ArrowRight className="h-4 w-4" />
                    }
                    className="sm:min-w-[220px]"
                  >
                    Start{" "}
                    {exam.toUpperCase()}{" "}
                    Practice
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  fullWidth
                  className="sm:w-auto sm:min-w-[220px]"
                >
                  {exam === "jamb"
                    ? `Select ${
                        JAMB_MAX_SUBJECTS -
                        combination.length
                      } more`
                    : "Select a subject"}
                </Button>
              )}

            </div>

          </Card>

        </div>

      </div>

    </main>
  );
}





