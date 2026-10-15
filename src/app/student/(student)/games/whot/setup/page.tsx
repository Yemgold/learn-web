"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  GraduationCap,
  Layers3,
  Sparkles,
  LockKeyhole,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

type ClassGroup = "SCIENCES" | "COMMERCIAL" | "ARTS";

interface Subject {
  id: string;
  name: string;
  description: string;
  color: string;
  selectedColor: string;
}

interface WhotSelection {
  classGroup: ClassGroup;
  subjects: Array<{
    id: string;
    name: string;
  }>;
  selectedAt: string;
}

/* ============================================================
   SUBJECTS BY CLASS GROUP
   ============================================================ */

const SUBJECT_GROUPS: Record<ClassGroup, Subject[]> = {
  SCIENCES: [
    {
      id: "biology",
      name: "Biology",
      description: "Living things and life processes",
      color: "border-emerald-400/20 bg-emerald-400/5",
      selectedColor: "border-emerald-400 bg-emerald-400/15",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      description: "Matter, reactions and elements",
      color: "border-violet-400/20 bg-violet-400/5",
      selectedColor: "border-violet-400 bg-violet-400/15",
    },
    {
      id: "physics",
      name: "Physics",
      description: "Energy, motion and forces",
      color: "border-blue-400/20 bg-blue-400/5",
      selectedColor: "border-blue-400 bg-blue-400/15",
    },
    {
      id: "mathematics",
      name: "Mathematics",
      description: "Numbers, calculations and logic",
      color: "border-amber-400/20 bg-amber-400/5",
      selectedColor: "border-amber-400 bg-amber-400/15",
    },
    {
      id: "english",
      name: "English Language",
      description: "Grammar, vocabulary and comprehension",
      color: "border-cyan-400/20 bg-cyan-400/5",
      selectedColor: "border-cyan-400 bg-cyan-400/15",
    },
    {
      id: "agricultural-science",
      name: "Agricultural Science",
      description: "Farming and agricultural practices",
      color: "border-lime-400/20 bg-lime-400/5",
      selectedColor: "border-lime-400 bg-lime-400/15",
    },
    {
      id: "further-mathematics",
      name: "Further Mathematics",
      description: "Advanced mathematical concepts",
      color: "border-orange-400/20 bg-orange-400/5",
      selectedColor: "border-orange-400 bg-orange-400/15",
    },
    {
      id: "computer-studies",
      name: "Computer Studies",
      description: "Computing and digital technology",
      color: "border-sky-400/20 bg-sky-400/5",
      selectedColor: "border-sky-400 bg-sky-400/15",
    },
  ],

  COMMERCIAL: [
    {
      id: "commerce",
      name: "Commerce",
      description: "Trade and business activities",
      color: "border-amber-400/20 bg-amber-400/5",
      selectedColor: "border-amber-400 bg-amber-400/15",
    },
    {
      id: "accounting",
      name: "Financial Accounting",
      description: "Records, accounts and financial statements",
      color: "border-emerald-400/20 bg-emerald-400/5",
      selectedColor: "border-emerald-400 bg-emerald-400/15",
    },
    {
      id: "economics",
      name: "Economics",
      description: "Markets, resources and the economy",
      color: "border-blue-400/20 bg-blue-400/5",
      selectedColor: "border-blue-400 bg-blue-400/15",
    },
    {
      id: "mathematics",
      name: "Mathematics",
      description: "Numbers, calculations and logic",
      color: "border-amber-400/20 bg-amber-400/5",
      selectedColor: "border-amber-400 bg-amber-400/15",
    },
    {
      id: "english",
      name: "English Language",
      description: "Grammar, vocabulary and comprehension",
      color: "border-cyan-400/20 bg-cyan-400/5",
      selectedColor: "border-cyan-400 bg-cyan-400/15",
    },
    {
      id: "government",
      name: "Government",
      description: "Political institutions and public affairs",
      color: "border-rose-400/20 bg-rose-400/5",
      selectedColor: "border-rose-400 bg-rose-400/15",
    },
    {
      id: "office-practice",
      name: "Office Practice",
      description: "Office procedures and administration",
      color: "border-indigo-400/20 bg-indigo-400/5",
      selectedColor: "border-indigo-400 bg-indigo-400/15",
    },
    {
      id: "business-studies",
      name: "Business Studies",
      description: "Business operations and management",
      color: "border-orange-400/20 bg-orange-400/5",
      selectedColor: "border-orange-400 bg-orange-400/15",
    },
  ],

  ARTS: [
    {
      id: "literature",
      name: "Literature in English",
      description: "Drama, prose and poetry",
      color: "border-fuchsia-400/20 bg-fuchsia-400/5",
      selectedColor: "border-fuchsia-400 bg-fuchsia-400/15",
    },
    {
      id: "government",
      name: "Government",
      description: "Politics and political institutions",
      color: "border-rose-400/20 bg-rose-400/5",
      selectedColor: "border-rose-400 bg-rose-400/15",
    },
    {
      id: "history",
      name: "History",
      description: "People, events and civilizations",
      color: "border-amber-400/20 bg-amber-400/5",
      selectedColor: "border-amber-400 bg-amber-400/15",
    },
    {
      id: "crs",
      name: "Christian Religious Studies",
      description: "Biblical teachings and religious studies",
      color: "border-sky-400/20 bg-sky-400/5",
      selectedColor: "border-sky-400 bg-sky-400/15",
    },
    {
      id: "irs",
      name: "Islamic Religious Studies",
      description: "Islamic teachings and religious studies",
      color: "border-teal-400/20 bg-teal-400/5",
      selectedColor: "border-teal-400 bg-teal-400/15",
    },
    {
      id: "english",
      name: "English Language",
      description: "Grammar, vocabulary and comprehension",
      color: "border-cyan-400/20 bg-cyan-400/5",
      selectedColor: "border-cyan-400 bg-cyan-400/15",
    },
    {
      id: "economics",
      name: "Economics",
      description: "Markets and economic systems",
      color: "border-blue-400/20 bg-blue-400/5",
      selectedColor: "border-blue-400 bg-blue-400/15",
    },
    {
      id: "french",
      name: "French",
      description: "French language and communication",
      color: "border-indigo-400/20 bg-indigo-400/5",
      selectedColor: "border-indigo-400 bg-indigo-400/15",
    },
    {
      id: "yoruba",
      name: "Yoruba",
      description: "Yoruba language and culture",
      color: "border-orange-400/20 bg-orange-400/5",
      selectedColor: "border-orange-400 bg-orange-400/15",
    },
  ],
};

/* ============================================================
   CLASS GROUP INFORMATION
   ============================================================ */

const GROUP_INFO: Record<
  ClassGroup,
  {
    label: string;
    description: string;
    accent: string;
    border: string;
    background: string;
    icon: string;
  }
> = {
  SCIENCES: {
    label: "Sciences",
    description: "Explore science, technology and mathematics.",
    accent: "text-cyan-300",
    border: "border-cyan-400",
    background: "bg-cyan-400/10",
    icon: "🔬",
  },
  COMMERCIAL: {
    label: "Commercial",
    description: "Focus on commerce, finance and business.",
    accent: "text-amber-300",
    border: "border-amber-400",
    background: "bg-amber-400/10",
    icon: "📊",
  },
  ARTS: {
    label: "Arts",
    description: "Discover languages, literature and humanities.",
    accent: "text-fuchsia-300",
    border: "border-fuchsia-400",
    background: "bg-fuchsia-400/10",
    icon: "🎨",
  },
};

const CLASS_GROUPS: ClassGroup[] = [
  "SCIENCES",
  "COMMERCIAL",
  "ARTS",
];

const STORAGE_KEY = "learnyfi-whot-selection";
const MINIMUM_SUBJECTS = 4;

/* ============================================================
   PAGE
   ============================================================ */

export default function WhotSetupPage() {
  const router = useRouter();

  // No class is selected initially.
  // Subjects remain hidden until the user chooses a class.
  const [classGroup, setClassGroup] =
    useState<ClassGroup | null>(null);

  const [selectedSubjects, setSelectedSubjects] =
    useState<string[]>([]);

  const [error, setError] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  const subjects = useMemo(
    () => (classGroup ? SUBJECT_GROUPS[classGroup] : []),
    [classGroup],
  );

  const selectedSubjectDetails = useMemo(
    () =>
      subjects.filter((subject) =>
        selectedSubjects.includes(subject.id),
      ),
    [subjects, selectedSubjects],
  );

  const canStart =
    classGroup !== null &&
    selectedSubjects.length >= MINIMUM_SUBJECTS;

  const remainingSubjects = Math.max(
    0,
    MINIMUM_SUBJECTS - selectedSubjects.length,
  );

  function handleGroupChange(group: ClassGroup) {
    if (group === classGroup) return;

    // Prevent subjects from one class being carried
    // into a different class group.
    setClassGroup(group);
    setSelectedSubjects([]);
    setError("");
  }

  function toggleSubject(subjectId: string) {
    if (!classGroup) return;

    setError("");

    setSelectedSubjects((current) => {
      if (current.includes(subjectId)) {
        return current.filter((id) => id !== subjectId);
      }

      return [...current, subjectId];
    });
  }

  function handleStartGame() {
    if (isStarting) return;

    if (!classGroup) {
      setError("Please choose a class group first.");
      return;
    }

    if (selectedSubjects.length < MINIMUM_SUBJECTS) {
      setError(
        `Please select at least ${MINIMUM_SUBJECTS} subjects to continue.`,
      );
      return;
    }

    const selection: WhotSelection = {
      classGroup,
      subjects: selectedSubjects.map((id) => {
        const subject = SUBJECT_GROUPS[classGroup].find(
          (item) => item.id === id,
        );

        return {
          id,
          name: subject?.name ?? id,
        };
      }),
      selectedAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(selection),
      );

      setIsStarting(true);
      router.push("/student/games/whot/play");
    } catch {
      setIsStarting(false);
      setError(
        "We couldn't save your selection. Please check your browser settings and try again.",
      );
    }
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-950 px-4 py-5 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <header className="flex items-center justify-between gap-3">
          <Link
            href="/student/games/whot"
            className="flex min-w-0 items-center gap-3"
            aria-label="Back to Learnyfi WHOT home"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <Layers3 className="h-6 w-6 text-cyan-300" />
            </div>

            <div className="min-w-0">
              <p className="text-lg font-black tracking-tight">
                Learnyfi{" "}
                <span className="text-cyan-300">WHOT</span>
              </p>
              <p className="text-xs text-slate-500">
                Prepare your game
              </p>
            </div>
          </Link>

          <Link
            href="/student/games/whot"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/[0.08] sm:px-4 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back home</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </header>

        {/* HERO */}

        <section className="relative mt-7 overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 p-6 sm:mt-8 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"
          />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Personalise your game
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Choose your class.
              <span className="block text-cyan-300">
                Own the WHOT arena.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              First, select your class group. We will then
              display only the subjects available for that
              group, so you can customise your game.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Minimum 4 subjects
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-2">
                <BookOpen className="h-4 w-4 text-cyan-300" />
                Educational gameplay
              </span>
            </div>
          </div>
        </section>

        {/* STEP 1: CHOOSE CLASS */}

        <section className="mt-8" aria-labelledby="class-heading">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Step 1
            </p>

            <h2
              id="class-heading"
              className="mt-2 text-xl font-black sm:text-2xl"
            >
              Choose your class group
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Your subject list will depend on this selection.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CLASS_GROUPS.map((group) => {
              const active = classGroup === group;
              const info = GROUP_INFO[group];

              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => handleGroupChange(group)}
                  aria-pressed={active}
                  className={`relative flex min-h-36 items-start gap-4 rounded-2xl border p-5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                    active
                      ? `${info.border} ${info.background} shadow-lg`
                      : "border-white/10 bg-slate-900/70 hover:border-white/20 hover:bg-slate-900"
                  }`}
                >
                  <span
                    className="text-3xl"
                    aria-hidden="true"
                  >
                    {info.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-black ${
                        active ? info.accent : "text-white"
                      }`}
                    >
                      {info.label}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {info.description}
                    </p>

                    {active && (
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        Class selected
                      </span>
                    )}
                  </div>

                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      active
                        ? `${info.border} ${info.accent}`
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    {active && <Check className="h-4 w-4" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP 2: SUBJECTS — HIDDEN UNTIL CLASS IS CHOSEN */}

        {!classGroup ? (
          <section
            className="mt-8 rounded-3xl border border-dashed border-white/15 bg-slate-900/40 px-5 py-10 text-center sm:py-14"
            aria-live="polite"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <LockKeyhole className="h-7 w-7 text-cyan-300" />
            </div>

            <h2 className="mt-5 text-xl font-black sm:text-2xl">
              Your subjects are waiting
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              Choose Sciences, Commercial, or Arts above.
              The subjects for your selected class will appear
              here automatically.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-slate-400">
              <LockKeyhole className="h-3.5 w-3.5" />
              Select a class to unlock subjects
            </div>
          </section>
        ) : (
          <section
            className="mt-10"
            aria-labelledby="subjects-heading"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Step 2
                </p>

                <h2
                  id="subjects-heading"
                  className="mt-2 text-xl font-black sm:text-2xl"
                >
                  Select your {GROUP_INFO[classGroup].label} subjects
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  These subjects belong to the{" "}
                  <span className={GROUP_INFO[classGroup].accent}>
                    {GROUP_INFO[classGroup].label}
                  </span>{" "}
                  group. Choose at least four to continue.
                </p>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-3 ${
                  canStart
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-cyan-400/20 bg-cyan-400/5 text-cyan-200"
                }`}
                aria-live="polite"
              >
                <BookOpen className="h-4 w-4" />

                <span className="text-sm font-extrabold tabular-nums">
                  {selectedSubjects.length} selected
                </span>

                <span className="text-xs opacity-80">
                  / {subjects.length}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((subject) => {
                const active = selectedSubjects.includes(
                  subject.id,
                );

                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    aria-pressed={active}
                    className={`relative flex min-h-32 items-start gap-3 rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                      active
                        ? subject.selectedColor
                        : `${subject.color} hover:border-white/20`
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
                        active
                          ? "border-cyan-300 bg-cyan-300 text-slate-950"
                          : "border-white/20 bg-slate-950/40 text-transparent"
                      }`}
                    >
                      {active && <Check className="h-4 w-4" />}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold text-white">
                        {subject.name}
                      </span>

                      <span className="mt-2 block text-xs leading-5 text-slate-400">
                        {subject.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-200"
              >
                {error}
              </p>
            )}
          </section>
        )}

        {/* SELECTED SUBJECTS SUMMARY */}

        {classGroup && selectedSubjects.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-white">
                Your selected subjects
              </h3>

              <span
                className={`text-xs font-bold ${GROUP_INFO[classGroup].accent}`}
              >
                {GROUP_INFO[classGroup].label}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSubjectDetails.map((subject) => (
                <span
                  key={subject.id}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-200"
                >
                  <Check className="h-3.5 w-3.5" />
                  {subject.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* START GAME */}

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-950/60 to-slate-900 p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <GraduationCap className="h-5 w-5" />

                <span className="text-xs font-bold uppercase tracking-widest">
                  Almost ready
                </span>
              </div>

              <h2 className="mt-3 text-xl font-black sm:text-2xl">
                {!classGroup
                  ? "Choose your class to begin"
                  : canStart
                    ? "Your WHOT game is ready!"
                    : `Choose ${remainingSubjects} more ${
                        remainingSubjects === 1
                          ? "subject"
                          : "subjects"
                      }`}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                {!classGroup
                  ? "Select a class group first. Your available subjects will then appear."
                  : canStart
                    ? `You've selected ${selectedSubjects.length} subjects from ${GROUP_INFO[classGroup].label}. Start playing when you're ready.`
                    : "Select at least four subjects from your chosen class to unlock the game."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartGame}
              disabled={!canStart || isStarting}
              className="inline-flex min-h-14 w-full shrink-0 items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-7 py-4 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:w-auto"
            >
              <Sparkles className="h-5 w-5" />

              {isStarting ? "Opening game..." : "Start WHOT Game"}

              {!isStarting && <ArrowRight className="h-5 w-5" />}
            </button>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="mt-10 border-t border-white/5 py-6 text-center">
          <p className="text-xs text-slate-600">
            Learnyfi WHOT · Learn something with every move.
          </p>
        </footer>
      </div>
    </main>
  );
}