

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  ArrowRight,
  Atom,
  BarChart3,
  BookMarked,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  BriefcaseBusiness,
  GraduationCap,
  Loader2,
  Target,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  getSubjectsByPlan,
  type Subject as ApiSubject,
} from "@/lib/api/subjects";

import { axiosInstance } from "@/lib/api/axios";

/* ==========================================================================
   TYPES
   ========================================================================== */

type ClassType = "science" | "commercial" | "art";

interface Subject extends ApiSubject {
  slug: string;
  description: string;
  questions: number;
  icon: React.ElementType;
}

interface ClassConfig {
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  selectedClass: string;
}

/* ==========================================================================
   CLASS CONFIGURATION
   ========================================================================== */

const classes: Record<ClassType, ClassConfig> = {
  science: {
    name: "Science Class",
    description:
      "Practice Mathematics and core Science subjects including Physics, Chemistry and Biology.",
    icon: Atom,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    selectedClass:
      "border-blue-500 bg-blue-50 ring-2 ring-blue-100",
  },

  commercial: {
    name: "Commercial Class",
    description:
      "Practice Mathematics, Economics, Commerce, Accounting and other Commercial subjects.",
    icon: BriefcaseBusiness,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    selectedClass:
      "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100",
  },

  art: {
    name: "Art Class",
    description:
      "Practice Literature, Government, History, CRS and other Arts-related subjects.",
    icon: Languages,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
    selectedClass:
      "border-purple-500 bg-purple-50 ring-2 ring-purple-100",
  },
};

/* ==========================================================================
   SUBJECT METADATA
   ========================================================================== */

const subjectMetadata: Record<
  string,
  {
    slug: string;
    description: string;
    icon: React.ElementType;
  }
> = {
  mathematics: {
    slug: "mathematics",
    description:
      "Practice Mathematics questions covering algebra, geometry, statistics, calculus and more.",
    icon: Calculator,
  },

  physics: {
    slug: "physics",
    description:
      "Practice Physics questions covering mechanics, waves, electricity, heat and modern physics.",
    icon: Atom,
  },

  chemistry: {
    slug: "chemistry",
    description:
      "Practice Chemistry questions covering organic, inorganic and physical chemistry.",
    icon: FlaskConical,
  },

  biology: {
    slug: "biology",
    description:
      "Practice Biology questions covering cells, ecology, genetics, evolution and human biology.",
    icon: Brain,
  },

  english: {
    slug: "english",
    description:
      "Practice comprehension, grammar, vocabulary, lexis and structure.",
    icon: BookOpen,
  },

  "use of english": {
    slug: "english",
    description:
      "Practice comprehension, grammar, vocabulary, lexis and structure.",
    icon: BookOpen,
  },

  economics: {
    slug: "economics",
    description:
      "Practice Economics questions covering microeconomics, macroeconomics, markets and development.",
    icon: BarChart3,
  },

  commerce: {
    slug: "commerce",
    description:
      "Practice Commerce questions covering trade, business organizations, banking and marketing.",
    icon: BriefcaseBusiness,
  },

  accounting: {
    slug: "accounting",
    description:
      "Practice Financial Accounting questions covering bookkeeping, accounts and financial statements.",
    icon: Calculator,
  },

  government: {
    slug: "government",
    description:
      "Practice Government questions covering political systems, constitutions, institutions and international relations.",
    icon: Landmark,
  },

  literature: {
    slug: "literature",
    description:
      "Practice Literature questions covering prose, poetry, drama, literary terms and prescribed texts.",
    icon: Languages,
  },

  history: {
    slug: "history",
    description:
      "Practice History questions covering Nigerian history, African history and world history.",
    icon: Globe,
  },

  crs: {
    slug: "crs",
    description:
      "Practice CRS questions covering Biblical knowledge, Christian teachings and religious principles.",
    icon: BookOpen,
  },

  "christian religious studies": {
    slug: "crs",
    description:
      "Practice CRS questions covering Biblical knowledge, Christian teachings and religious principles.",
    icon: BookOpen,
  },
};

/* ==========================================================================
   CLASS SUBJECT MAPPING
   ========================================================================== */

const classSubjectNames: Record<ClassType, string[]> = {
  science: [
    "mathematics",
    "physics",
    "chemistry",
    "biology",
    "english",
    "use of english",
  ],

  commercial: [
    "mathematics",
    "economics",
    "commerce",
    "accounting",
    "english",
    "use of english",
  ],

  art: [
    "government",
    "literature",
    "history",
    "crs",
    "christian religious studies",
    "english",
    "use of english",
  ],
};

/* ==========================================================================
   EXAM TYPE
   ========================================================================== */

function normalizeExamType(value: string | null): string {
  const exam = value?.trim().toLowerCase();

  if (
    exam === "jamb" ||
    exam === "waec" ||
    exam === "neco"
  ) {
    return exam;
  }

  return "";
}

/* ==========================================================================
   NORMALIZE SUBJECT NAME
   ========================================================================== */

function normalizeSubjectName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/* ==========================================================================
   CREATE SUBJECT SLUG
   ========================================================================== */

function createSubjectSlug(name: string): string {
  const normalized = normalizeSubjectName(name);

  const metadata = subjectMetadata[normalized];

  if (metadata) {
    return metadata.slug;
  }

  return normalized
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ==========================================================================
   GET SUBJECT METADATA
   ========================================================================== */

function getSubjectMetadata(name: string) {
  const normalized = normalizeSubjectName(name);

  return (
    subjectMetadata[normalized] ?? {
      slug: createSubjectSlug(name),
      description: `Practice ${name} questions and improve your examination performance.`,
      icon: BookOpen,
    }
  );
}

/* ==========================================================================
   QUESTION COUNT
   ========================================================================== */

/**
 * Gets the real number of questions available for a subject.
 *
 * Backend:
 *
 * GET
 * /api/v1/questions/count-questions-by-subjectId/{subjectId}
 */

async function getQuestionCount(
  subjectId: string,
): Promise<number> {
  const response = await axiosInstance.get(
    `/questions/count-questions-by-subjectId/${encodeURIComponent(
      subjectId,
    )}`,
  );

  const data = response.data;

  /*
   * Support the common response shapes without
   * breaking if the backend wraps the count.
   */

  if (typeof data === "number") {
    return data;
  }

  if (
    typeof data?.data === "number"
  ) {
    return data.data;
  }

  if (
    typeof data?.data?.count === "number"
  ) {
    return data.data.count;
  }

  if (
    typeof data?.count === "number"
  ) {
    return data.count;
  }

  if (
    typeof data?.data?.totalCount === "number"
  ) {
    return data.data.totalCount;
  }

  if (
    typeof data?.totalCount === "number"
  ) {
    return data.totalCount;
  }

  return 0;
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export default function PracticePage() {
  /* ========================================================================
     EXAM TYPE
     ======================================================================== */

  const searchParams = useSearchParams();

  const examType = normalizeExamType(
    searchParams.get("exam"),
  );

  const examDisplayName = examType
    ? examType.toUpperCase()
    : "EXAM";

  /* ========================================================================
     STATE
     ======================================================================== */

  const [
    selectedClass,
    setSelectedClass,
  ] = useState<ClassType | null>(null);

  const [
    selectedSubject,
    setSelectedSubject,
  ] = useState<string | null>(null);

  const [
    subjects,
    setSubjects,
  ] = useState<Subject[]>([]);

  const [
    loadingSubjects,
    setLoadingSubjects,
  ] = useState(false);

  const [
    subjectsError,
    setSubjectsError,
  ] = useState<string | null>(null);

  /* ========================================================================
     LOAD SUBJECTS FROM BACKEND
     ======================================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      setLoadingSubjects(true);
      setSubjectsError(null);

      try {
        /*
         * SECONDARY is the plan currently used
         * by your subjects service.
         */
        const response =
          await getSubjectsByPlan(
            "SECONDARY",
            1,
            100,
          );

        if (cancelled) {
          return;
        }

        const backendSubjects =
          response.data?.subjectObj ?? [];

        /*
         * Convert backend subjects into the
         * shape required by this page.
         */
        const mappedSubjects: Subject[] =
          backendSubjects.map(
            (subject) => {
              const metadata =
                getSubjectMetadata(
                  subject.name,
                );

              return {
                ...subject,
                slug: metadata.slug,
                description:
                  metadata.description,
                icon: metadata.icon,
                questions: 0,
              };
            },
          );

        setSubjects(mappedSubjects);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "[PracticePage] Failed to load subjects:",
          error,
        );

        setSubjectsError(
          error instanceof Error
            ? error.message
            : "Failed to load subjects.",
        );
      } finally {
        if (!cancelled) {
          setLoadingSubjects(false);
        }
      }
    }

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ========================================================================
     LOAD QUESTION COUNTS
     ======================================================================== */

  useEffect(() => {
    if (subjects.length === 0) {
      return;
    }

    let cancelled = false;

    async function loadQuestionCounts() {
      const results =
        await Promise.allSettled(
          subjects.map(
            async (subject) => {
              const count =
                await getQuestionCount(
                  subject._id,
                );

              return {
                id: subject._id,
                count,
              };
            },
          ),
        );

      if (cancelled) {
        return;
      }

      setSubjects((current) =>
        current.map((subject) => {
          const result =
            results.find(
              (item) =>
                item.status ===
                  "fulfilled" &&
                item.value.id ===
                  subject._id,
            );

          return {
            ...subject,
            questions:
              result?.status ===
              "fulfilled"
                ? result.value.count
                : 0,
          };
        }),
      );
    }

    loadQuestionCounts();

    return () => {
      cancelled = true;
    };
  }, [subjects.length]);

  /* ========================================================================
     CURRENT CLASS
     ======================================================================== */

  const currentClass =
    useMemo(() => {
      if (!selectedClass) {
        return null;
      }

      return classes[selectedClass];
    }, [selectedClass]);

  /* ========================================================================
     CURRENT SUBJECTS
     ======================================================================== */

  const currentSubjects =
    useMemo(() => {
      if (!selectedClass) {
        return [];
      }

      const allowedNames =
        classSubjectNames[
          selectedClass
        ];

      return subjects.filter(
        (subject) => {
          const normalized =
            normalizeSubjectName(
              subject.name,
            );

          return allowedNames.includes(
            normalized,
          );
        },
      );
    }, [
      selectedClass,
      subjects,
    ]);

  /* ========================================================================
     SELECT CLASS
     ======================================================================== */

  const handleSelectClass = (
    classType: ClassType,
  ) => {
    setSelectedClass(classType);
    setSelectedSubject(null);
  };

  /* ========================================================================
     SELECT SUBJECT
     ======================================================================== */

  const handleSelectSubject = (
    subjectId: string,
  ) => {
    setSelectedSubject(subjectId);
  };

  /* ========================================================================
     SELECTED SUBJECT
     ======================================================================== */

  const selectedSubjectData =
    useMemo(() => {
      if (!selectedSubject) {
        return null;
      }

      return (
        currentSubjects.find(
          (subject) =>
            subject._id ===
            selectedSubject,
        ) ?? null
      );
    }, [
      selectedSubject,
      currentSubjects,
    ]);

  /* ========================================================================
     SUBJECT LINK
     ======================================================================== */

  const subjectPracticeHref =
    selectedSubjectData &&
    examType
      ? `/student/practice/${examType}/${selectedSubjectData.slug}?subjectId=${encodeURIComponent(
          selectedSubjectData._id,
        )}`
      : null;

  /* ========================================================================
     RENDER
     ======================================================================== */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-10">

        {/* ================================================================
            HEADER
           ================================================================ */}

        <section className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            <GraduationCap className="h-4 w-4" />

            {examType
              ? `${examDisplayName} Practice`
              : "Student Practice"}
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Practice by Subject
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Choose your academic class
            first, then select the subject
            you want to practise.
          </p>

          {examType && (
            <div className="mt-4 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
              {examDisplayName} Examination
            </div>
          )}

          {!examType && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              No examination type was
              provided. Please open this
              page with{" "}
              <code className="font-bold">
                ?exam=jamb
              </code>
              ,{" "}
              <code className="font-bold">
                ?exam=waec
              </code>
              , or{" "}
              <code className="font-bold">
                ?exam=neco
              </code>
              .
            </div>
          )}
        </section>

        {/* ================================================================
            STATISTICS
           ================================================================ */}

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card
            hoverable
            className="text-center"
          >
            <BookOpen className="mx-auto h-9 w-9 text-blue-600" />

            <h2 className="mt-3 text-2xl font-black text-slate-900">
              —
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tests Taken
            </p>
          </Card>

          <Card
            hoverable
            className="text-center"
          >
            <Target className="mx-auto h-9 w-9 text-green-600" />

            <h2 className="mt-3 text-2xl font-black text-slate-900">
              —
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Average Score
            </p>
          </Card>

          <Card
            hoverable
            className="text-center"
          >
            <Clock3 className="mx-auto h-9 w-9 text-orange-600" />

            <h2 className="mt-3 text-2xl font-black text-slate-900">
              —
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Study Time
            </p>
          </Card>

          <Card
            hoverable
            className="text-center"
          >
            <BarChart3 className="mx-auto h-9 w-9 text-purple-600" />

            <h2 className="mt-3 text-2xl font-black text-slate-900">
              —
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Improvement
            </p>
          </Card>
        </section>

        {/* ================================================================
            STEP 1 — CHOOSE CLASS
           ================================================================ */}

        <section>
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                1
              </span>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Choose Your Class
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select the class that
                  contains the subject you
                  want to practise.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {(
              Object.entries(
                classes,
              ) as [
                ClassType,
                ClassConfig,
              ][]
            ).map(
              ([
                classType,
                classConfig,
              ]) => {
                const Icon =
                  classConfig.icon;

                const isSelected =
                  selectedClass ===
                  classType;

                return (
                  <button
                    key={classType}
                    type="button"
                    onClick={() =>
                      handleSelectClass(
                        classType,
                      )
                    }
                    className={[
                      "group relative rounded-3xl border-2 bg-white p-6 text-left transition-all duration-200",
                      "hover:-translate-y-1 hover:shadow-lg",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      isSelected
                        ? classConfig.selectedClass
                        : "border-slate-200 hover:border-slate-300",
                    ].join(" ")}
                  >
                    {isSelected && (
                      <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    )}

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${classConfig.iconBg}`}
                    >
                      <Icon
                        className={`h-7 w-7 ${classConfig.iconColor}`}
                      />
                    </div>

                    <h3 className="mt-6 text-xl font-black text-slate-900">
                      {classConfig.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {classConfig.description}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                      {isSelected
                        ? "Class selected"
                        : "Choose this class"}

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </section>

        {/* ================================================================
            STEP 2 — SUBJECTS
           ================================================================ */}

        {selectedClass &&
          currentClass && (
            <section className="mt-12">

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      2
                    </span>

                    <h2 className="text-2xl font-black text-slate-900">
                      Choose One Subject
                    </h2>
                  </div>

                  <p className="mt-2 pl-11 text-sm text-slate-500">
                    {currentClass.name}{" "}
                    subjects
                  </p>
                </div>

                <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
                  Select 1 subject
                </div>
              </div>

              {/* ==========================================================
                  LOADING
                 ========================================================== */}

              {loadingSubjects && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <Card
                      key={index}
                      className="animate-pulse p-6"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-slate-200" />

                      <div className="mt-6 h-6 w-2/3 rounded bg-slate-200" />

                      <div className="mt-3 h-12 w-full rounded bg-slate-100" />

                      <div className="mt-5 h-4 w-1/3 rounded bg-slate-200" />
                    </Card>
                  ))}
                </div>
              )}

              {/* ==========================================================
                  ERROR
                 ========================================================== */}

              {!loadingSubjects &&
                subjectsError && (
                  <Card className="border-red-200 bg-red-50 p-6">
                    <h3 className="font-bold text-red-800">
                      Unable to load subjects
                    </h3>

                    <p className="mt-2 text-sm text-red-700">
                      {subjectsError}
                    </p>

                    <Button
                      className="mt-4"
                      onClick={() =>
                        window.location.reload()
                      }
                    >
                      Try Again
                    </Button>
                  </Card>
                )}

              {/* ==========================================================
                  SUBJECTS
                 ========================================================== */}

              {!loadingSubjects &&
                !subjectsError &&
                currentSubjects.length >
                  0 && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {currentSubjects.map(
                      (subject) => {
                        const Icon =
                          subject.icon;

                        const isSelected =
                          selectedSubject ===
                          subject._id;

                        return (
                          <button
                            key={
                              subject._id
                            }
                            type="button"
                            onClick={() =>
                              handleSelectSubject(
                                subject._id,
                              )
                            }
                            className={[
                              "group relative rounded-3xl border-2 bg-white p-6 text-left transition-all duration-200",
                              "hover:-translate-y-1 hover:shadow-lg",
                              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                              isSelected
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                : "border-slate-200 hover:border-slate-300",
                            ].join(" ")}
                          >
                            {isSelected && (
                              <div className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                                <Icon className="h-7 w-7 text-blue-600" />
                              </div>

                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {subject.questions >
                                0
                                  ? `${subject.questions.toLocaleString()} Questions`
                                  : "Loading..."}
                              </span>
                            </div>

                            <h3 className="mt-6 pr-8 text-xl font-black text-slate-900">
                              {
                                subject.name
                              }
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                              {
                                subject.description
                              }
                            </p>

                            <div
                              className={[
                                "mt-5 text-sm font-bold",
                                isSelected
                                  ? "text-blue-700"
                                  : "text-slate-500 group-hover:text-blue-600",
                              ].join(" ")}
                            >
                              {isSelected
                                ? "Selected"
                                : "Select Subject"}
                            </div>
                          </button>
                        );
                      },
                    )}

                  </div>
                )}

              {/* ==========================================================
                  NO SUBJECTS
                 ========================================================== */}

              {!loadingSubjects &&
                !subjectsError &&
                currentSubjects.length ===
                  0 && (
                  <Card className="border-dashed border-slate-300 p-10 text-center">
                    <BookOpen className="mx-auto h-10 w-10 text-slate-400" />

                    <h3 className="mt-4 font-bold text-slate-900">
                      No subjects found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      No backend subjects were
                      found for this class.
                    </p>
                  </Card>
                )}
            </section>
          )}

        {/* ================================================================
            SELECTED SUBJECT ACTION
           ================================================================ */}

        {selectedSubjectData && (
          <section className="sticky bottom-4 z-20 mt-8">

            <Card className="border-blue-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">

                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Selected Subject
                  </p>

                  <div className="mt-1 flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                      {(() => {
                        const Icon =
                          selectedSubjectData.icon;

                        return (
                          <Icon className="h-5 w-5 text-blue-600" />
                        );
                      })()}
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-lg font-black text-slate-900">
                        {
                          selectedSubjectData.name
                        }
                      </h3>

                      <p className="text-xs text-slate-500">
                        {selectedSubjectData.questions >
                        0
                          ? `${selectedSubjectData.questions.toLocaleString()} questions available`
                          : "Checking question availability..."}
                      </p>

                    </div>
                  </div>
                </div>

                {/* ==========================================================
                    CONTINUE
                   ========================================================== */}

                {subjectPracticeHref ? (
                  <Link
                    href={
                      subjectPracticeHref
                    }
                    className="w-full sm:w-auto"
                  >
                    <Button
                      fullWidth
                      size="lg"
                      rightIcon={
                        <ArrowRight className="h-5 w-5" />
                      }
                      className="sm:min-w-[220px]"
                    >
                      Continue to Practice
                    </Button>
                  </Link>
                ) : (
                  <Button
                    fullWidth
                    size="lg"
                    disabled
                    className="sm:min-w-[220px]"
                  >
                    Select an Exam
                  </Button>
                )}

              </div>
            </Card>
          </section>
        )}

        {/* ================================================================
            NO CLASS SELECTED
           ================================================================ */}

        {!selectedClass && (
          <section className="mt-10">

            <Card className="border-dashed border-slate-300 bg-white p-8 text-center sm:p-12">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <GraduationCap className="h-8 w-8 text-slate-400" />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-900">
                Choose a class to continue
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Select Science,
                Commercial or Art Class
                above to see the subjects
                available for practice.
              </p>
            </Card>
          </section>
        )}

{/* ================================================================
    CBT SEPARATE FLOW — JAMB ONLY
   ================================================================ */}

{examType === "jamb" && (
  <section className="mt-12">

    <Card className="overflow-hidden border-0 bg-slate-950 p-0 text-white shadow-xl">

      <div className="relative overflow-hidden p-6 sm:p-8">

        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300">

              <Clock3 className="h-4 w-4" />

              JAMB CBT Simulator

            </div>

            <h2 className="mt-4 text-2xl font-black sm:text-3xl">
              Want to practise the full JAMB CBT?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Choose your four-subject JAMB combination
              and take a complete timed CBT examination
              under realistic examination conditions.
            </p>

          </div>

          <Link
            href="/student/practice/cbtcombination"
            className="shrink-0"
          >

            <Button
              size="lg"
              rightIcon={
                <ArrowRight className="h-5 w-5" />
              }
              className="w-full sm:w-auto"
            >
              Start Full CBT
            </Button>

          </Link>

        </div>

      </div>

    </Card>

  </section>
)}

        {/* ================================================================
            PRACTICE HISTORY
           ================================================================ */}

        <section className="mt-6">

          <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100">
                <BookMarked className="h-6 w-6 text-purple-600" />
              </div>

              <div>

                <h2 className="text-lg font-black text-slate-900">
                  Practice History
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Review previous attempts
                  and monitor your
                  improvement over time.
                </p>

              </div>

            </div>

            <Link
              href="/student/practice/history"
              className="shrink-0"
            >
              <Button
                variant="outline"
                rightIcon={
                  <ArrowRight className="h-4 w-4" />
                }
              >
                View History
              </Button>
            </Link>

          </Card>

        </section>

      </div>
    </main>
  );
}