




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
  GraduationCap,
  BriefcaseBusiness,
  Palette,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  getSubjectsByPlan,
  type Subject,
} from "@/lib/api/subjects";

import { usePracticeStore } from "@/stores/practiceStore";

const ITEMS_PER_PAGE = 50;
const JAMB_MAX_SUBJECTS = 4;
const OTHER_EXAM_MAX_SUBJECTS = 20;

type ExamType = "jamb" | "waec" | "neco";
type JambClass = "science" | "commercial" | "art";

const examConfig: Record<
  ExamType,
  {
    label: string;
    title: string;
    description: string;
    maxSubjects: number;
  }
> = {
  jamb: {
    label: "JAMB Practice",
    title: "Set Your JAMB Combination",
    description:
      "Choose your class first, then select three optional subjects alongside compulsory Use of English.",
    maxSubjects: JAMB_MAX_SUBJECTS,
  },
  waec: {
    label: "WAEC Practice",
    title: "Select Your WAEC Subjects",
    description: "Select the WAEC subjects you want to practise.",
    maxSubjects: OTHER_EXAM_MAX_SUBJECTS,
  },
  neco: {
    label: "NECO Practice",
    title: "Select Your NECO Subjects",
    description: "Select the NECO subjects you want to practise.",
    maxSubjects: OTHER_EXAM_MAX_SUBJECTS,
  },
};

/*
 * Each JAMB class offers four optional subjects.
 * Students choose three, in addition to Use of English.
 */
const jambClassOptions: {
  id: JambClass;
  title: string;
  description: string;
  icon: typeof GraduationCap;
  subjects: string[];
}[] = [
  {
    id: "science",
    title: "Science",
    description: "For science and technology courses",
    icon: Atom,
    subjects: [
      "mathematics",
      "physics",
      "chemistry",
      "biology",
    ],
  },
  {
    id: "commercial",
    title: "Commercial",
    description: "For business, finance and management courses",
    icon: BriefcaseBusiness,
    subjects: [
      "mathematics",
      "economics",
      "commerce",
      "accounting",
    ],
  },
  {
    id: "art",
    title: "Art",
    description: "For arts, humanities and related courses",
    icon: Palette,
    subjects: [
      "government",
      "literature",
      "history",
      "crs",
    ],
  },
];

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

function normalizeExam(value: unknown): ExamType {
  const exam = String(value ?? "").toLowerCase();

  if (exam === "waec") return "waec";
  if (exam === "neco") return "neco";

  return "jamb";
}

function getSubjectKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "");
}

function isEnglishSubject(name: string): boolean {
  const key = getSubjectKey(name);
  return key === "english" || key === "useofenglish";
}

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
    crs: "Christian Religious Studies",
    christianreligiousknowledge: "Christian Religious Knowledge",
    christianreligiousstudies: "Christian Religious Studies",
    christianreligion: "Christian Religious Studies",
    irk: "Islamic Religious Knowledge",
    islamicreligiousknowledge: "Islamic Religious Knowledge",
    economics: "Economics",
    currentaffairs: "Current Affairs",
    insurance: "Insurance",
    civiceducation: "Civic Education",
    history: "History",
    commerce: "Commerce",
    accounting: "Accounting",
    agriculturalscience: "Agricultural Science",
  };

  const key = getSubjectKey(name);

  return (
    names[key] ??
    name
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function getSubjectIcon(name: string) {
  const key = getSubjectKey(name);
  return subjectIcons[key as keyof typeof subjectIcons] ?? BookOpen;
}

function getSubjectStyle(name: string) {
  const key = getSubjectKey(name);

  return (
    subjectStyles[key as keyof typeof subjectStyles] ?? {
      color: "text-slate-400",
      bg: "bg-white/[0.04]",
      selected:
        "border-white/20 bg-white/[0.06] ring-2 ring-white/5",
    }
  );
}

function getClassForSubject(name: string): JambClass | null {
  const key = getSubjectKey(name);

  if (
    [
      "mathematics",
      "maths",
      "physics",
      "chemistry",
      "biology",
    ].includes(key)
  ) {
    return "science";
  }

  if (
    [
      "economics",
      "commerce",
      "accounting",
    ].includes(key)
  ) {
    return "commercial";
  }

  if (
    [
      "government",
      "literature",
      "history",
      "crs",
      "crk",
      "christianreligiousknowledge",
      "christianreligiousstudies",
      "christianreligion",
    ].includes(key)
  ) {
    return "art";
  }

  return null;
}

export default function PracticeCombinationPage() {
  const params = useParams();
  const exam = normalizeExam(params?.examType);
  const config = examConfig[exam];

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] =
    useState<JambClass | null>(null);

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

  const combination =
    exam === "jamb"
      ? jambCombination
      : exam === "waec"
        ? waecCombination
        : necoCombination;

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      try {
        setLoading(true);
        setError(null);

        const response = await getSubjectsByPlan(
          "SECONDARY",
          1,
          ITEMS_PER_PAGE,
        );

        if (cancelled) return;

        const loadedSubjects = response.data?.subjectObj ?? [];
        setSubjects(loadedSubjects);

        if (exam === "jamb") {
          const currentCombination =
            usePracticeStore.getState().jambCombination;

          if (currentCombination.length === 0) {
            const english = loadedSubjects.find((subject) =>
              isEnglishSubject(subject.name),
            );

            if (english) {
              setJambCombination([english._id]);
            }
          }
        }
      } catch (err: unknown) {
        if (cancelled) return;

        console.error(`Failed to load ${exam} subjects:`, err);

        const responseMessage =
          err &&
          typeof err === "object" &&
          "response" in err &&
          typeof (
            err as {
              response?: { data?: { message?: unknown } };
            }
          ).response?.data?.message === "string"
            ? (
                err as {
                  response: { data: { message: string } };
                }
              ).response.data.message
            : null;

        setError(
          responseMessage ?? `Unable to load ${config.label} subjects.`,
        );
        setSubjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSubjects();

    return () => {
      cancelled = true;
    };
  }, [exam, config.label, setJambCombination]);

  const englishSubject = useMemo(
    () => subjects.find((subject) => isEnglishSubject(subject.name)),
    [subjects],
  );

  const visibleSubjects = useMemo(() => {
    if (exam !== "jamb") return subjects;
    if (!selectedClass) return [];

    const selectedClassConfig = jambClassOptions.find(
      (item) => item.id === selectedClass,
    );

    if (!selectedClassConfig) return [];

    return subjects.filter((subject) => {
      if (isEnglishSubject(subject.name)) return true;

      const key = getSubjectKey(subject.name);

      return selectedClassConfig.subjects.includes(key);
    });
  }, [exam, selectedClass, subjects]);

  const selectedSubjects = useMemo(
    () =>
      subjects.filter((subject) =>
        combination.includes(subject._id),
      ),
    [subjects, combination],
  );

  const optionalSelectedCount =
    exam === "jamb"
      ? combination.filter((id) => {
          const subject = subjects.find((item) => item._id === id);
          return subject ? !isEnglishSubject(subject.name) : false;
        }).length
      : combination.length;

  const combinationComplete =
    exam === "jamb"
      ? Boolean(selectedClass) &&
        Boolean(englishSubject) &&
        combination.length === JAMB_MAX_SUBJECTS &&
        combination.includes(englishSubject?._id ?? "")
      : combination.length > 0;

  function handleClassChange(nextClass: JambClass) {
    if (nextClass === selectedClass) return;

    setSelectedClass(nextClass);

    /*
     * A class change clears the previous optional subjects.
     * Keep Use of English as the compulsory JAMB subject.
     */
    if (englishSubject) {
      setJambCombination([englishSubject._id]);
    } else {
      clearJambCombination();
    }
  }

  function handleSubjectToggle(subject: Subject) {
    const isEnglish = isEnglishSubject(subject.name);
    const isSelected = combination.includes(subject._id);

    if (exam === "jamb") {
      if (!selectedClass || isEnglish) return;

      const allowedClass = getClassForSubject(subject.name);

      if (allowedClass !== selectedClass) return;
    }

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

    if (combination.length >= config.maxSubjects) return;

    if (exam === "jamb") {
      toggleJambSubject(subject._id);
    } else if (exam === "waec") {
      toggleWaecSubject(subject._id);
    } else {
      toggleNecoSubject(subject._id);
    }
  }

  function handleResetCombination() {
    if (exam === "jamb") {
      if (englishSubject) {
        setJambCombination([englishSubject._id]);
      } else {
        clearJambCombination();
      }
      return;
    }

    if (exam === "waec") {
      clearWaecCombination();
      return;
    }

    clearNecoCombination();
  }

  const nextRoute =
    `/student/practice/${exam}/combination/subjects`;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-9 w-9 animate-spin text-blue-400" />
          <div>
            <h2 className="font-semibold">
              Loading {exam.toUpperCase()} subjects
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Preparing your subject selection...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/[0.04] p-8 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-red-400" />
          <h2 className="mt-5 text-xl font-bold">
            Unable to load subjects
          </h2>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
          <Button
            className="mt-6"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <section className="mb-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
            <Sparkles className="h-4 w-4" />
            {config.label}
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {config.title}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            {config.description}
          </p>
        </section>

        {/* STEP 1: CLASS SELECTION — JAMB ONLY */}
        {exam === "jamb" && (
          <section className="mb-8">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Step 1
              </p>
              <h2 className="mt-1 text-xl font-bold">
                Choose your class
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Your class determines the optional subjects available to you.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {jambClassOptions.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedClass === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleClassChange(item.id)}
                    aria-pressed={isSelected}
                    className={[
                      "relative rounded-2xl border p-5 text-left transition-all",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                      isSelected
                        ? "border-blue-500/60 bg-blue-500/10 ring-2 ring-blue-500/20"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                    ].join(" ")}
                  >
                    {isSelected && (
                      <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                        <Check className="h-4 w-4" />
                      </span>
                    )}

                    <span
                      className={[
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        isSelected
                          ? "bg-blue-500/15 text-blue-300"
                          : "bg-white/[0.06] text-slate-300",
                      ].join(" ")}
                    >
                      <Icon className="h-6 w-6" />
                    </span>

                    <h3 className="mt-4 font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      {item.description}
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                      {item.subjects
                        .map((key) => {
                          const subject = subjects.find(
                            (candidate) =>
                              getSubjectKey(candidate.name) === key ||
                              (key === "mathematics" &&
                                getSubjectKey(candidate.name) === "maths"),
                          );

                          const fallbackNames: Record<string, string> = {
                            mathematics: "Mathematics",
                            physics: "Physics",
                            chemistry: "Chemistry",
                            biology: "Biology",
                            economics: "Economics",
                            commerce: "Commerce",
                            accounting: "Accounting",
                            government: "Government",
                            literature: "Literature",
                            history: "History",
                            crs: "CRS",
                          };

                          return subject
                            ? getSubjectDisplayName(subject.name)
                            : fallbackNames[key] ?? key;
                        })
                        .join(" · ")}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* COMBINATION SUMMARY */}
        <Card className="mb-7 overflow-hidden border border-white/10 bg-white/[0.04] p-0 shadow-none">
          <div className="border-b border-white/5 bg-gradient-to-r from-blue-950/60 via-blue-950/30 to-slate-950 px-5 py-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  {exam === "jamb" ? "Your combination" : "Selected subjects"}
                </p>
                <h2 className="mt-1 text-lg font-bold">
                  {combination.length}
                  {exam === "jamb" ? ` / ${JAMB_MAX_SUBJECTS}` : ""}{" "}
                  {combination.length === 1
                    ? "subject selected"
                    : "subjects selected"}
                </h2>
                {exam === "jamb" && selectedClass && (
                  <p className="mt-1 text-xs text-slate-400">
                    Class:{" "}
                    {jambClassOptions.find(
                      (item) => item.id === selectedClass,
                    )?.title}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleResetCombination}
                className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-400 transition hover:text-red-400 sm:self-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Reset subjects
              </button>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map((subject, index) => {
                const isEnglish = isEnglishSubject(subject.name);

                return (
                  <div
                    key={subject._id}
                    className="flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-300"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    {getSubjectDisplayName(subject.name)}
                    {exam === "jamb" && isEnglish && (
                      <span className="text-[10px] font-semibold uppercase text-blue-400">
                        Required
                      </span>
                    )}
                  </div>
                );
              })}

              {exam === "jamb" && !combinationComplete && (
                <div className="rounded-full border border-dashed border-white/10 px-3 py-2 text-sm text-slate-500">
                  Select {Math.max(0, JAMB_MAX_SUBJECTS - combination.length)} more
                </div>
              )}

              {exam !== "jamb" && combination.length === 0 && (
                <div className="rounded-full border border-dashed border-white/10 px-3 py-2 text-sm text-slate-500">
                  Select at least one subject
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* STEP 2: SUBJECT SELECTION */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              {exam === "jamb" ? "Step 2" : "Subject selection"}
            </p>

            <h2 className="mt-1 text-lg font-bold">
              {exam === "jamb" && !selectedClass
                ? "Choose a class to continue"
                : "Choose your subjects"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {exam === "jamb"
                ? selectedClass
                  ? `${optionalSelectedCount} of 3 optional subjects selected. Use of English is compulsory.`
                  : "Your available subjects will appear after you choose a class."
                : `${combination.length} subject${combination.length === 1 ? "" : "s"} selected`}
            </p>
          </div>

          {exam === "jamb" && !selectedClass ? (
            <Card className="border border-dashed border-white/10 bg-white/[0.02] p-8 text-center shadow-none">
              <GraduationCap className="mx-auto h-10 w-10 text-slate-500" />
              <p className="mt-3 font-semibold text-slate-300">
                Select Science, Commercial or Art
              </p>
              <p className="mt-1 text-sm text-slate-500">
                We will show the subjects for your chosen class here.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleSubjects.map((subject) => {
                const Icon = getSubjectIcon(subject.name);
                const style = getSubjectStyle(subject.name);
                const displayName = getSubjectDisplayName(subject.name);
                const isSelected = combination.includes(subject._id);
                const isEnglish = isEnglishSubject(subject.name);

                const disabled =
                  (!isSelected &&
                    combination.length >= config.maxSubjects) ||
                  (exam === "jamb" && isEnglish);

                return (
                  <button
                    key={subject._id}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSubjectToggle(subject)}
                    className={[
                      "group relative rounded-xl border bg-white/[0.04] p-4 text-left transition-all duration-200",
                      "hover:-translate-y-0.5 hover:bg-white/[0.06]",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/40",
                      isSelected
                        ? style.selected
                        : "border-white/10 hover:border-white/20",
                      disabled
                        ? "cursor-not-allowed opacity-50 hover:translate-y-0"
                        : "",
                    ].join(" ")}
                  >
                    {isSelected && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}

                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 ${style.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${style.color}`} />
                    </span>

                    <h3 className="mt-4 pr-5 text-sm font-bold sm:text-base">
                      {displayName}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {exam === "jamb" && isEnglish
                        ? "Compulsory"
                        : isSelected
                          ? "Selected"
                          : "Tap to select"}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* BOTTOM ACTION */}
        <div className="sticky bottom-4 z-20 mt-6">
          <Card className="border border-white/10 bg-slate-950/90 p-3 shadow-none backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">
                  {combinationComplete
                    ? `Your ${exam.toUpperCase()} selection is ready`
                    : exam === "jamb" && !selectedClass
                      ? "Choose your class first"
                      : "Complete your subject selection"}
                </p>

                <p className="text-xs text-slate-500">
                  {combinationComplete
                    ? "You can now continue to practice."
                    : exam === "jamb"
                      ? selectedClass
                        ? `Select ${Math.max(0, JAMB_MAX_SUBJECTS - combination.length)} more subject${JAMB_MAX_SUBJECTS - combination.length === 1 ? "" : "s"}.`
                        : "Your class determines the optional subjects."
                      : "Select at least one subject to continue."}
                </p>
              </div>

              {combinationComplete ? (
                <Link href={nextRoute} className="w-full sm:w-auto">
                  <Button
                    fullWidth
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="sm:min-w-[220px]"
                  >
                    Start {exam.toUpperCase()} Practice
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled
                  fullWidth
                  className="sm:w-auto sm:min-w-[220px]"
                >
                  {exam === "jamb"
                    ? !selectedClass
                      ? "Choose a class"
                      : `Select ${Math.max(0, JAMB_MAX_SUBJECTS - combination.length)} more`
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


