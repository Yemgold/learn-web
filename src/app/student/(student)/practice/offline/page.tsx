



"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  HardDrive,
  Play,
  Search,
  Trash2,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type Subject =
  | "Mathematics"
  | "Biology"
  | "English Language"
  | "Chemistry"
  | "Physics";

type ExamType = "JAMB" | "WAEC" | "NECO" | "Secondary School";

type PracticeSet = {
  id: string;
  subject: Subject;
  exam: ExamType;
  questions: number;
  size: number;
  downloaded: boolean;
  completed: number;
};

const INITIAL_SETS: PracticeSet[] = [
  {
    id: "math-jamb-100",
    subject: "Mathematics",
    exam: "JAMB",
    questions: 100,
    size: 12,
    downloaded: true,
    completed: 24,
  },
  {
    id: "biology-jamb-100",
    subject: "Biology",
    exam: "JAMB",
    questions: 100,
    size: 11,
    downloaded: true,
    completed: 0,
  },
  {
    id: "english-jamb-100",
    subject: "English Language",
    exam: "JAMB",
    questions: 100,
    size: 10,
    downloaded: false,
    completed: 0,
  },
  {
    id: "chemistry-jamb-100",
    subject: "Chemistry",
    exam: "JAMB",
    questions: 100,
    size: 11,
    downloaded: false,
    completed: 0,
  },
  {
    id: "physics-jamb-100",
    subject: "Physics",
    exam: "JAMB",
    questions: 100,
    size: 12,
    downloaded: false,
    completed: 0,
  },
];

const SUBJECTS: Subject[] = [
  "Mathematics",
  "Biology",
  "English Language",
  "Chemistry",
  "Physics",
];

const SUBJECT_STYLES: Record<
  Subject,
  { icon: string; color: string; background: string }
> = {
  Mathematics: {
    icon: "M",
    color: "text-blue-700 dark:text-blue-300",
    background: "bg-blue-100 dark:bg-blue-500/15",
  },
  Biology: {
    icon: "B",
    color: "text-emerald-700 dark:text-emerald-300",
    background: "bg-emerald-100 dark:bg-emerald-500/15",
  },
  "English Language": {
    icon: "E",
    color: "text-violet-700 dark:text-violet-300",
    background: "bg-violet-100 dark:bg-violet-500/15",
  },
  Chemistry: {
    icon: "C",
    color: "text-orange-700 dark:text-orange-300",
    background: "bg-orange-100 dark:bg-orange-500/15",
  },
  Physics: {
    icon: "P",
    color: "text-pink-700 dark:text-pink-300",
    background: "bg-pink-100 dark:bg-pink-500/15",
  },
};

export default function OfflinePracticePage() {
  const [sets, setSets] = useState(INITIAL_SETS);
  const [activeTab, setActiveTab] = useState<
    "downloaded" | "available"
  >("downloaded");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [showDownload, setShowDownload] = useState(false);
  const [selectedSubject, setSelectedSubject] =
    useState<Subject>("Mathematics");
  const [selectedExam, setSelectedExam] =
    useState<ExamType>("JAMB");
  const [questionCount, setQuestionCount] = useState(100);
  const [selectedPractice, setSelectedPractice] =
    useState<PracticeSet | null>(null);
  const [notice, setNotice] = useState("");

  const downloadedSets = sets.filter((set) => set.downloaded);

  const storageUsed = downloadedSets.reduce(
    (total, set) => total + set.size,
    0
  );

  const visibleSets = useMemo(() => {
    return sets.filter((set) => {
      const matchesTab =
        activeTab === "downloaded"
          ? set.downloaded
          : !set.downloaded;

      const matchesSubject =
        subjectFilter === "All subjects" ||
        set.subject === subjectFilter;

      const matchesSearch =
        `${set.subject} ${set.exam}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesTab && matchesSubject && matchesSearch;
    });
  }, [sets, activeTab, subjectFilter, search]);

  function downloadSet() {
    const existing = sets.find(
      (set) =>
        set.subject === selectedSubject &&
        set.exam === selectedExam &&
        set.questions === questionCount
    );

    if (existing?.downloaded) {
      setNotice("This practice set is already downloaded.");
      setShowDownload(false);
      return;
    }

    const newSet: PracticeSet = {
      id: `${selectedSubject}-${selectedExam}-${questionCount}`
        .toLowerCase()
        .replace(/\s+/g, "-"),
      subject: selectedSubject,
      exam: selectedExam,
      questions: questionCount,
      size: Math.max(1, Math.round(questionCount * 0.12)),
      downloaded: true,
      completed: 0,
    };

    setSets((current) => {
      if (existing) {
        return current.map((set) =>
          set.id === existing.id ? newSet : set
        );
      }

      return [...current, newSet];
    });

    setActiveTab("downloaded");
    setSubjectFilter("All subjects");
    setSearch("");
    setShowDownload(false);
    setNotice(
      "Demo download complete. This sample set is not yet saved for offline use."
    );
  }

  function removeSet(set: PracticeSet) {
    setSets((current) =>
      current.map((item) =>
        item.id === set.id
          ? { ...item, downloaded: false, completed: 0 }
          : item
      )
    );

    setNotice(`${set.subject} was removed from your downloaded list.`);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href="/student/practice"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Practice
        </Link>

        {/* Page heading */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <WifiOff className="h-3.5 w-3.5" />
              Offline Practice Centre
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Practise anywhere.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
              Prepare for your examinations even when your internet
              connection is unavailable. Download practice sets and
              continue learning at your own pace.
            </p>
          </div>

          <button
            onClick={() => {
              setNotice("");
              setShowDownload(true);
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Download questions
          </button>
        </div>

        {/* Offline information banner */}

        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-6 text-white sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <WifiOff className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold">
                Your learning goes with you.
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Download selected question sets while online. Your
                practice sessions can then be designed to work offline,
                with progress saved and synchronized when you reconnect.
              </p>

              <button
                onClick={() => setShowDownload(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 sm:flex">
              <BookOpen className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>

        {/* Statistics */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Downloaded sets
              </span>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-3 text-3xl font-bold">
              {downloadedSets.length}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Ready in your demo list
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Available questions
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="mt-3 text-3xl font-bold">
              {downloadedSets.reduce(
                (total, set) => total + set.questions,
                0
              )}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Across downloaded demo sets
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Estimated storage
              </span>
              <HardDrive className="h-5 w-5 text-violet-500" />
            </div>
            <p className="mt-3 text-3xl font-bold">
              {storageUsed} MB
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Illustrative estimate
            </p>
          </Card>
        </div>

        {/* Practice sets */}

        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                My practice sets
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your selected examination questions.
              </p>
            </div>

            <button
              onClick={() => setShowDownload(true)}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <Download className="h-4 w-4" />
              Add practice set
            </button>
          </div>

          <div className="mb-5 flex flex-col gap-3 lg:flex-row">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.03]">
              <button
                onClick={() => setActiveTab("downloaded")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                  activeTab === "downloaded"
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Downloaded ({downloadedSets.length})
              </button>

              <button
                onClick={() => setActiveTab("available")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                  activeTab === "available"
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                Available ({sets.length - downloadedSets.length})
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search subjects..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.03]"
                />
              </div>

              <select
                value={subjectFilter}
                onChange={(event) =>
                  setSubjectFilter(event.target.value)
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-900"
              >
                <option>All subjects</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {visibleSets.length === 0 ? (
            <Card className="flex flex-col items-center justify-center border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-white/[0.02]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
                <BookOpen className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold">
                No practice sets found
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Try another search or choose a different subject.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSubjectFilter("All subjects");
                }}
                className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400"
              >
                Clear filters
              </button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleSets.map((set) => {
                const style = SUBJECT_STYLES[set.subject];
                const progress = Math.round(
                  (set.completed / set.questions) * 100
                );

                return (
                  <Card
                    key={set.id}
                    className="overflow-hidden border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${style.background} ${style.color}`}
                      >
                        {style.icon}
                      </div>

                      {set.downloaded ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <Check className="h-3.5 w-3.5" />
                          Downloaded
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-400">
                          Online required
                        </span>
                      )}
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      {set.exam} {set.subject}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                      <span>{set.questions} questions</span>
                      <span>·</span>
                      <span>{set.size} MB est.</span>
                    </div>

                    {set.downloaded && (
                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">
                            Practice progress
                          </span>
                          <span className="font-semibold">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-5 flex gap-2">
                      {set.downloaded ? (
                        <>
                          <button
                            onClick={() => setSelectedPractice(set)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            <Play className="h-4 w-4" />
                            Start practice
                          </button>

                          <button
                            onClick={() => removeSet(set)}
                            aria-label={`Remove ${set.subject}`}
                            title="Remove download"
                            className="rounded-lg border border-slate-200 px-3 text-slate-500 transition hover:border-red-300 hover:text-red-600 dark:border-white/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedSubject(set.subject);
                            setSelectedExam(set.exam);
                            setQuestionCount(set.questions);
                            setShowDownload(true);
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-500/30 dark:text-blue-300 dark:hover:bg-blue-500/10"
                        >
                          <Download className="h-4 w-4" />
                          Download set
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Storage information */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/15">
              <HardDrive className="h-5 w-5 text-violet-600 dark:text-violet-300" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <h3 className="font-bold">Offline storage</h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {storageUsed} MB estimated
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{
                    width: `${Math.min(storageUsed / 10, 100)}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Download only the subjects you need. You can remove
                practice sets whenever you want to free up space.
              </p>
            </div>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200"
          >
            <span>{notice}</span>
            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Download dialog */}

      {showDownload && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowDownload(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-dialog-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/15">
                  <Download className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h2
                  id="download-dialog-title"
                  className="text-xl font-bold"
                >
                  Download practice set
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Choose your examination and the number of questions.
                </p>
              </div>

              <button
                onClick={() => setShowDownload(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(event) =>
                    setSelectedSubject(event.target.value as Subject)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800"
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Examination type
                </label>
                <select
                  value={selectedExam}
                  onChange={(event) =>
                    setSelectedExam(event.target.value as ExamType)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-800"
                >
                  {(["JAMB", "WAEC", "NECO", "Secondary School"] as const).map(
                    (exam) => (
                      <option key={exam}>{exam}</option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold">
                  Number of questions
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[50, 100, 200].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`rounded-xl border px-3 py-4 text-center transition ${
                        questionCount === count
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-300"
                          : "border-slate-200 hover:border-blue-300 dark:border-white/10"
                      }`}
                    >
                      <span className="block text-xl font-bold">
                        {count}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        Questions
                      </span>
                      {count === 100 && (
                        <span className="mt-2 block text-[10px] font-bold uppercase tracking-wide">
                          Recommended
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${SUBJECT_STYLES[selectedSubject].background} ${SUBJECT_STYLES[selectedSubject].color}`}
                  >
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {selectedExam} {selectedSubject}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {questionCount} questions · Estimated{" "}
                      {Math.max(1, Math.round(questionCount * 0.12))} MB
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
              </div>

              <button
                onClick={downloadSet}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download practice set
              </button>

              <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                UI prototype only. Real question downloads and offline
                storage will be connected in the next implementation stage.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Practice preview */}

      {selectedPractice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="practice-preview-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <WifiOff className="h-3.5 w-3.5" />
                  Offline mode preview
                </span>
                <h2
                  id="practice-preview-title"
                  className="mt-4 text-xl font-bold"
                >
                  {selectedPractice.exam} {selectedPractice.subject}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedPractice.questions} questions in this set
                </p>
              </div>

              <button
                onClick={() => setSelectedPractice(null)}
                aria-label="Close practice preview"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 p-5 dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Sample question · UI preview
              </p>
              <p className="mt-4 text-base font-semibold leading-7">
                Solve x² − 4x + 3 = 0.
              </p>

              <div className="mt-4 space-y-3">
                {["3 or 1", "4 or 3", "-3 or -1", "3 and 1"].map(
                  (answer, index) => (
                    <div
                      key={answer}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm dark:border-white/10"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold dark:bg-white/10">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {answer}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
              This is a display preview, not a functioning exam. The real
              practice engine will load the selected questions and save
              answers locally in a later stage.
            </div>

            <button
              onClick={() => setSelectedPractice(null)}
              className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Close preview
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
