






"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  useParams,
  useSearchParams,
} from "next/navigation";

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

/* ============================================================
   CONFIG
   ============================================================ */

const ITEMS_PER_PAGE = 50;

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
  }
> = {
  jamb: {
    label: "JAMB Practice",
    title: "Choose a Subject",
    description:
      "Select one subject you want to practise. You can choose any available JAMB subject.",
  },

  waec: {
    label: "WAEC Practice",
    title: "Choose a Subject",
    description:
      "Select one WAEC subject you want to practise.",
  },

  neco: {
    label: "NECO Practice",
    title: "Choose a Subject",
    description:
      "Select one NECO subject you want to practise.",
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
    selected:
      "border-blue-500/50 bg-blue-500/[0.08] ring-2 ring-blue-500/10",
  },

  useofenglish: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    selected:
      "border-blue-500/50 bg-blue-500/[0.08] ring-2 ring-blue-500/10",
  },

  mathematics: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    selected:
      "border-green-500/50 bg-green-500/[0.08] ring-2 ring-green-500/10",
  },

  maths: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    selected:
      "border-green-500/50 bg-green-500/[0.08] ring-2 ring-green-500/10",
  },

  physics: {
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    selected:
      "border-purple-500/50 bg-purple-500/[0.08] ring-2 ring-purple-500/10",
  },

  chemistry: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    selected:
      "border-orange-500/50 bg-orange-500/[0.08] ring-2 ring-orange-500/10",
  },

  biology: {
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    selected:
      "border-pink-500/50 bg-pink-500/[0.08] ring-2 ring-pink-500/10",
  },

  government: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    selected:
      "border-red-500/50 bg-red-500/[0.08] ring-2 ring-red-500/10",
  },

  geography: {
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    selected:
      "border-cyan-500/50 bg-cyan-500/[0.08] ring-2 ring-cyan-500/10",
  },

  literature: {
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    selected:
      "border-indigo-500/50 bg-indigo-500/[0.08] ring-2 ring-indigo-500/10",
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
   SUBJECT SLUG
   ============================================================ */

function getSubjectSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
      color: "text-slate-400",
      bg: "bg-white/[0.04]",
      selected:
        "border-white/20 bg-white/[0.06] ring-2 ring-white/5",
    }
  );
}

/* ============================================================
   PAGE
   ============================================================ */

export default function PracticeSingleSubjectPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  /* ==========================================================
     EXAM TYPE
     ========================================================== */

  const exam = normalizeExam(params?.examType);

  const config = examConfig[exam];

  /* ==========================================================
     PRACTICE MODE
     ========================================================== */

  const mode = searchParams.get("mode") ?? "normal";

  /* ==========================================================
     STATE
     ========================================================== */

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

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
  }, [exam, config.label]);

  /* ==========================================================
     SELECTED SUBJECT
     ========================================================== */

  const selectedSubject = useMemo(() => {
    if (!selectedSubjectId) {
      return null;
    }

    return (
      subjects.find(
        (subject) =>
          subject._id === selectedSubjectId,
      ) ?? null
    );
  }, [subjects, selectedSubjectId]);

  /* ==========================================================
     SUBJECT SELECT
     ========================================================== */

  function handleSubjectSelect(
    subject: Subject,
  ) {
    setSelectedSubjectId(subject._id);
  }

  /* ==========================================================
     RESET
     ========================================================== */

  function handleReset() {
    setSelectedSubjectId(null);
  }

  /* ==========================================================
     NEXT ROUTE
     ==========================================================

      /student/practice/jamb/combination
  */

  const nextRoute = useMemo(() => {
    if (!selectedSubject) {
      return "#";
    }

    const subjectSlug = getSubjectSlug(
      selectedSubject.name,
    );

    const query = new URLSearchParams();

    query.set(
      "subjectId",
      selectedSubject._id,
    );

    query.set("mode", mode);

    return `/student/practice/${exam}/${subjectSlug}?${query.toString()}`;
  }, [selectedSubject, exam, mode]);

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        {/* Background identity */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
        </div>

        <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10">
              <Loader2 className="h-7 w-7 animate-spin text-blue-400" />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Loading{" "}
                {exam.toUpperCase()} subjects
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Preparing your subject selection...
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
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        {/* Background identity */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        <div className="relative container mx-auto flex min-h-[70vh] items-center justify-center px-4">
          <Card className="w-full max-w-md border border-white/10 bg-white/[0.04] p-8 text-center shadow-none">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
              <BookOpen className="h-7 w-7 text-red-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              Unable to load subjects
            </h2>

            <p className="mt-2 text-sm text-slate-400">
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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ====================================================
          BACKGROUND IDENTITY
         ==================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* ====================================================
            HEADER
           ==================================================== */}

        <section className="mb-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
            <Sparkles className="h-4 w-4" />

            {config.label}
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {config.title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            {config.description}
          </p>

          {/* Mode */}

          <div className="mt-4 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
            {mode === "quick"
              ? "Quick Practice"
              : "Practice Mode"}
          </div>
        </section>

        {/* ====================================================
            SELECTION SUMMARY
           ==================================================== */}

        <Card className="mb-6 overflow-hidden border border-white/10 bg-white/[0.04] p-0 shadow-none">
          <div className="border-b border-white/5 bg-gradient-to-r from-blue-950/60 via-blue-950/30 to-slate-950 px-5 py-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Your selection
                </p>

                <h2 className="mt-1 text-lg font-bold text-white">
                  {selectedSubject
                    ? getSubjectDisplayName(
                        selectedSubject.name,
                      )
                    : "No subject selected"}
                </h2>
              </div>

              {selectedSubject && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-400 transition hover:text-red-400 sm:self-auto"
                >
                  <RotateCcw className="h-4 w-4" />

                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="px-5 py-4">
            {selectedSubject ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  1
                </span>

                {getSubjectDisplayName(
                  selectedSubject.name,
                )}

                <Check className="ml-1 h-4 w-4 text-blue-400" />
              </div>
            ) : (
              <div className="inline-flex items-center rounded-full border border-dashed border-white/10 px-3 py-2 text-sm text-slate-500">
                Select one subject below
              </div>
            )}
          </div>
        </Card>

        {/* ====================================================
            SUBJECT SELECTION
           ==================================================== */}

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Choose one subject
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select the subject you want to practise.
              </p>
            </div>

            <span className="hidden rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-400 sm:block">
              1 subject only
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
                selectedSubjectId ===
                subject._id;

              return (
                <button
                  key={subject._id}
                  type="button"
                  onClick={() =>
                    handleSubjectSelect(
                      subject,
                    )
                  }
                  className={[
                    "group relative rounded-xl border bg-white/[0.04] p-4 text-left transition-all duration-200",
                    "hover:-translate-y-0.5 hover:bg-white/[0.06] hover:shadow-none",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/40",

                    isSelected
                      ? style.selected
                      : "border-white/10 hover:border-white/20",
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
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 ${style.bg}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${style.color}`}
                    />
                  </div>

                  {/* Name */}

                  <h3 className="mt-4 pr-5 text-sm font-bold text-white sm:text-base">
                    {displayName}
                  </h3>

                  {/* Status */}

                  <p className="mt-1 text-xs text-slate-500">
                    {isSelected
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
          <Card className="border border-white/10 bg-slate-950/90 p-3 shadow-none backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">
                  {selectedSubject
                    ? `${getSubjectDisplayName(
                        selectedSubject.name,
                      )} is ready`
                    : "Select one subject"}
                </p>

                <p className="text-xs text-slate-500">
                  {selectedSubject
                    ? "You can now continue to practice."
                    : "Choose one subject to continue."}
                </p>
              </div>

              {/* ==================================================
                  CONTINUE
                 ================================================== */}

              {selectedSubject ? (
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
                    {getSubjectDisplayName(
                      selectedSubject.name,
                    )}{" "}
                    Practice
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  fullWidth
                  className="sm:w-auto sm:min-w-[220px]"
                >
                  Select a Subject
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

