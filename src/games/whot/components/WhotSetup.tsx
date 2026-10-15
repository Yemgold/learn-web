




"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  GraduationCap,
  Layers,
  Play,
} from "lucide-react";

export type WhotClassGroup = "SCIENCES" | "COMMERCIAL" | "ARTS";

export interface WhotSubject {
  id: string;
  name: string;
  color: string;
  lightColor: string;
}

export interface WhotSetupSelection {
  classGroup: WhotClassGroup;
  subjects: WhotSubject[];
}

const SUBJECT_GROUPS: Record<WhotClassGroup, WhotSubject[]> = {
  SCIENCES: [
    { id: "mathematics", name: "Mathematics", color: "#2563EB", lightColor: "#DBEAFE" },
    { id: "english", name: "English", color: "#7C3AED", lightColor: "#EDE9FE" },
    { id: "biology", name: "Biology", color: "#059669", lightColor: "#D1FAE5" },
    { id: "chemistry", name: "Chemistry", color: "#D97706", lightColor: "#FEF3C7" },
    { id: "physics", name: "Physics", color: "#DC2626", lightColor: "#FEE2E2" },
    { id: "further-mathematics", name: "Further Mathematics", color: "#0891B2", lightColor: "#CFFAFE" },
    { id: "agricultural-science", name: "Agricultural Science", color: "#65A30D", lightColor: "#ECFCCB" },
    { id: "computer-studies", name: "Computer Studies", color: "#4F46E5", lightColor: "#E0E7FF" },
  ],
  COMMERCIAL: [
    { id: "mathematics", name: "Mathematics", color: "#2563EB", lightColor: "#DBEAFE" },
    { id: "english", name: "English", color: "#7C3AED", lightColor: "#EDE9FE" },
    { id: "economics", name: "Economics", color: "#059669", lightColor: "#D1FAE5" },
    { id: "accounting", name: "Financial Accounting", color: "#D97706", lightColor: "#FEF3C7" },
    { id: "commerce", name: "Commerce", color: "#DC2626", lightColor: "#FEE2E2" },
    { id: "government", name: "Government", color: "#0891B2", lightColor: "#CFFAFE" },
    { id: "marketing", name: "Marketing", color: "#65A30D", lightColor: "#ECFCCB" },
    { id: "business-studies", name: "Business Studies", color: "#4F46E5", lightColor: "#E0E7FF" },
  ],
  ARTS: [
    { id: "english", name: "English", color: "#7C3AED", lightColor: "#EDE9FE" },
    { id: "literature", name: "Literature in English", color: "#2563EB", lightColor: "#DBEAFE" },
    { id: "government", name: "Government", color: "#059669", lightColor: "#D1FAE5" },
    { id: "history", name: "History", color: "#D97706", lightColor: "#FEF3C7" },
    { id: "crs-irs", name: "CRS / IRS", color: "#DC2626", lightColor: "#FEE2E2" },
    { id: "civic-education", name: "Civic Education", color: "#0891B2", lightColor: "#CFFAFE" },
    { id: "french", name: "French", color: "#65A30D", lightColor: "#ECFCCB" },
    { id: "fine-arts", name: "Fine Arts", color: "#4F46E5", lightColor: "#E0E7FF" },
  ],
};

const GROUP_INFO: {
  id: WhotClassGroup;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    id: "SCIENCES",
    title: "Sciences",
    description: "Explore science and mathematics",
    color: "#059669",
  },
  {
    id: "COMMERCIAL",
    title: "Commercial",
    description: "Business, finance and economics",
    color: "#D97706",
  },
  {
    id: "ARTS",
    title: "Arts",
    description: "Languages, humanities and culture",
    color: "#7C3AED",
  },
];

interface WhotSetupProps {
  onStart: (selection: WhotSetupSelection) => void;
  minimumSubjects?: number;
}

export default function WhotSetup({
  onStart,
  minimumSubjects = 4,
}: WhotSetupProps) {
  const [classGroup, setClassGroup] =
    useState<WhotClassGroup>("SCIENCES");

  const [selectedIds, setSelectedIds] = useState<string[]>([
    "mathematics",
    "english",
    "biology",
    "chemistry",
  ]);

  const subjects = useMemo(
    () => SUBJECT_GROUPS[classGroup],
    [classGroup],
  );

  const selectedSubjects = subjects.filter((subject) =>
    selectedIds.includes(subject.id),
  );

  const canStart = selectedSubjects.length >= minimumSubjects;

  function chooseGroup(group: WhotClassGroup) {
    setClassGroup(group);

    // Preserve shared subjects where possible, but ensure
    // the new group starts with at least four selections.
    const available = SUBJECT_GROUPS[group];
    const preserved = selectedIds.filter((id) =>
      available.some((subject) => subject.id === id),
    );

    const next = [...preserved];

    for (const subject of available) {
      if (next.length >= minimumSubjects) break;
      if (!next.includes(subject.id)) next.push(subject.id);
    }

    setSelectedIds(next);
  }

  function toggleSubject(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
            <GraduationCap size={34} />
          </div>

          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
            Learnyfi WHOT
          </p>

          <h1 className="text-3xl font-black sm:text-4xl">
            Build Your Subject Deck
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
            Choose your class group and select the subjects you
            want to play with. Every selected subject can have
            its own cards, colours and quiz questions.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Layers size={20} />
            1. Choose your class group
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {GROUP_INFO.map((group) => {
              const active = classGroup === group.id;

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => chooseGroup(group.id)}
                  aria-pressed={active}
                  className={`rounded-2xl border p-5 text-left transition ${
                    active
                      ? "border-white bg-white/10 ring-2 ring-white/20"
                      : "border-white/10 bg-slate-900 hover:border-white/30"
                  }`}
                >
                  <span
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${group.color}25`,
                      color: group.color,
                    }}
                  >
                    <BookOpen size={22} />
                  </span>

                  <span className="block font-extrabold">
                    {group.title}
                  </span>

                  <span className="mt-1 block text-sm text-slate-400">
                    {group.description}
                  </span>

                  {active && (
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <Check size={14} />
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900 p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                2. Select your subjects
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Select at least {minimumSubjects} subjects.
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                canStart
                  ? "bg-emerald-400/15 text-emerald-300"
                  : "bg-amber-400/15 text-amber-300"
              }`}
            >
              {selectedSubjects.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {subjects.map((subject) => {
              const active = selectedIds.includes(subject.id);

              return (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => toggleSubject(subject.id)}
                  aria-pressed={active}
                  className={`relative min-h-28 rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-white/60"
                      : "border-white/10 bg-slate-950 hover:border-white/30"
                  }`}
                  style={
                    active
                      ? { backgroundColor: `${subject.color}22` }
                      : undefined
                  }
                >
                  <span
                    className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: subject.lightColor,
                      color: subject.color,
                    }}
                  >
                    <BookOpen size={19} />
                  </span>

                  <span className="block text-sm font-bold">
                    {subject.name}
                  </span>

                  {active && (
                    <span
                      className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: subject.color }}
                    >
                      <Check size={13} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-950 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Your deck includes
            </p>

            <div className="flex flex-wrap gap-2">
              {selectedSubjects.map((subject) => (
                <span
                  key={subject.id}
                  className="rounded-full px-3 py-1.5 text-xs font-bold"
                  style={{
                    backgroundColor: subject.lightColor,
                    color: subject.color,
                  }}
                >
                  {subject.name}
                </span>
              ))}

              {selectedSubjects.length === 0 && (
                <span className="text-sm text-slate-500">
                  No subjects selected yet.
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={!canStart}
            onClick={() =>
              onStart({
                classGroup,
                subjects: selectedSubjects,
              })
            }
            className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-4 font-black text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Play size={20} fill="currentColor" />
            Start WHOT Game
          </button>

          {!canStart && (
            <p className="mt-3 text-center text-sm text-amber-300">
              Choose at least {minimumSubjects} subjects to continue.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
