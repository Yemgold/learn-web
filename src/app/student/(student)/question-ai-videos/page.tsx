







"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  GraduationCap,
  Play,
  Search,
  Sparkles,
  Trophy,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  getPublishedAiVideoLessons,
  subscribeToAiVideoLessons,
  type AiVideoLesson,
  type Difficulty,
} from "@/lib/storage/ai-video-lessons";

type DifficultyFilter = "All Levels" | Difficulty;

type VideoLesson = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  description: string;
  duration: number;
  difficulty: Difficulty;
  sections: number;
  completed: boolean;
  avatar: string;
};

const SUBJECTS = [
  "All Subjects",
  "Physics",
  "Biology",
  "Chemistry",
  "Mathematics",
  "English Language",
  "Economics",
];

const DIFFICULTIES: DifficultyFilter[] = [
  "All Levels",
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
];

const FALLBACK_AVATAR =
  "https://api.dicebear.com/9.x/personas/svg?seed=Teacher&backgroundColor=f3f4f6";

function formatDuration(minutes: number) {
  if (minutes <= 0) {
    return "0 min";
  }

  return `${minutes} min`;
}

function difficultyLabel(difficulty: Difficulty) {
  switch (difficulty) {
    case "BEGINNER":
      return "Beginner";

    case "INTERMEDIATE":
      return "Intermediate";

    case "ADVANCED":
      return "Advanced";

    default:
      return "Beginner";
  }
}

function difficultyClasses(difficulty: Difficulty) {
  switch (difficulty) {
    case "BEGINNER":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "INTERMEDIATE":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "ADVANCED":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function getSubjectInitials(subject: string) {
  if (subject === "English Language") {
    return "EN";
  }

  return subject
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mapLessonToCard(lesson: AiVideoLesson): VideoLesson {
  return {
    id: lesson.id,
    title: lesson.title,
    subject: lesson.subject,
    topic: lesson.topic,
    description: lesson.description,
    duration: lesson.durationMinutes,
    difficulty: lesson.difficulty,
    sections: lesson.scenes?.length || lesson.steps?.length || 0,
    completed: false,
    avatar:
      lesson.teacher?.avatarUrl ||
      FALLBACK_AVATAR,
  };
}

function formatTeachingStyle(
  style: AiVideoLesson["teachingStyle"],
) {
  switch (style) {
    case "friendly":
      return "Friendly";

    case "exam":
      return "Exam-focused";

    case "energetic":
      return "Energetic";

    case "step-by-step":
      return "Step-by-step";

    default:
      return "Step-by-step";
  }
}

function formatVisualStyle(
  style: AiVideoLesson["visualStyle"],
) {
  switch (style) {
    case "modern":
      return "Modern";

    case "whiteboard":
      return "Whiteboard";

    case "science":
      return "Science";

    case "exam":
      return "Exam";

    default:
      return "Modern";
  }
}

export default function QuestionAiVideosPage() {
  const [lessons, setLessons] = useState<AiVideoLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] =
    useState("All Subjects");

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>("All Levels");

  const [showFilters, setShowFilters] =
    useState(false);

  useEffect(() => {
    const loadLessons = () => {
      const publishedLessons =
        getPublishedAiVideoLessons();

      setLessons(publishedLessons);
      setIsLoading(false);
    };

    loadLessons();

    const unsubscribe =
      subscribeToAiVideoLessons(loadLessons);

    return unsubscribe;
  }, []);

  const cardLessons = useMemo(
    () => lessons.map(mapLessonToCard),
    [lessons],
  );

  const filteredLessons = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return cardLessons.filter((lesson) => {
      const matchesSearch =
        !query ||
        lesson.title
          .toLowerCase()
          .includes(query) ||
        lesson.subject
          .toLowerCase()
          .includes(query) ||
        lesson.topic
          .toLowerCase()
          .includes(query) ||
        lesson.description
          .toLowerCase()
          .includes(query);

      const matchesSubject =
        selectedSubject === "All Subjects" ||
        lesson.subject === selectedSubject;

      const matchesDifficulty =
        selectedDifficulty === "All Levels" ||
        lesson.difficulty === selectedDifficulty;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesDifficulty
      );
    });
  }, [
    cardLessons,
    searchQuery,
    selectedSubject,
    selectedDifficulty,
  ]);

  const completedLessons = cardLessons.filter(
    (lesson) => lesson.completed,
  ).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("All Subjects");
    setSelectedDifficulty("All Levels");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link
              href="/student/dashboard"
              className="transition hover:text-slate-900"
            >
              Dashboard
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span className="font-medium text-slate-900">
              AI Video Lessons
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700">
                <Sparkles className="h-4 w-4" />
                AI-Powered Learning
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Learn with AI Video Lessons
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Watch engaging lessons taught by AI
                teachers. Understand difficult topics
                through explanations, visual examples
                and JAMB-focused tips.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <Video className="h-4 w-4 text-violet-600" />
                  {cardLessons.length}{" "}
                  {cardLessons.length === 1
                    ? "lesson"
                    : "lessons"}
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {completedLessons} completed
                </div>

                <div className="inline-flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  JAMB focused
                </div>
              </div>
            </div>

            {/* AI Teacher Preview */}
            <div className="relative hidden lg:block">
              <div className="relative h-48 w-64 overflow-hidden rounded-2xl border bg-gradient-to-br from-violet-50 via-white to-indigo-50 shadow-sm">
                <div className="absolute right-3 top-3 rounded-full border bg-white/90 px-2.5 py-1 text-xs font-semibold text-violet-700 shadow-sm">
                  AI Teacher
                </div>

                <img
                  src="https://api.dicebear.com/9.x/personas/svg?seed=Amara&backgroundColor=f3f4f6"
                  alt="AI teacher"
                  className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 object-contain"
                />

                <div className="absolute bottom-3 left-3 right-3 rounded-lg border bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                    <span className="text-xs font-semibold text-slate-700">
                      Ready to teach
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search + Filters */}
        <div className="mb-8 rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search lessons, subjects or topics..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setShowFilters((value) => !value)
              }
              className="h-11 gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Subject
                </label>

                <select
                  value={selectedSubject}
                  onChange={(event) =>
                    setSelectedSubject(
                      event.target.value,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                >
                  {SUBJECTS.map((subject) => (
                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Difficulty
                </label>

                <select
                  value={selectedDifficulty}
                  onChange={(event) =>
                    setSelectedDifficulty(
                      event.target
                        .value as DifficultyFilter,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                >
                  {DIFFICULTIES.map(
                    (difficulty) => (
                      <option
                        key={difficulty}
                        value={difficulty}
                      >
                        {difficulty ===
                        "All Levels"
                          ? difficulty
                          : difficultyLabel(
                              difficulty,
                            )}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Subject Quick Filters */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {SUBJECTS.map((subject) => {
              const active =
                selectedSubject === subject;

              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() =>
                    setSelectedSubject(subject)
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700"
                  }`}
                >
                  {subject}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Video Lessons
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredLessons.length} lesson
              {filteredLessons.length !== 1
                ? "s"
                : ""}{" "}
              available
            </p>
          </div>

          {(selectedSubject !== "All Subjects" ||
            selectedDifficulty !== "All Levels" ||
            searchQuery) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-violet-600 hover:text-violet-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-video animate-pulse bg-slate-100" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />

                    <div className="h-6 w-4/5 animate-pulse rounded bg-slate-100" />

                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />

                    <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : filteredLessons.length > 0 ? (
          /* Lesson Grid */
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="group overflow-hidden border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 via-white to-violet-100">
                  {/* Decorative Educational Visual */}
                  <div className="absolute inset-0">
                    <div className="absolute left-5 top-5 h-16 w-16 rounded-2xl bg-white/80 shadow-sm" />

                    <div className="absolute bottom-8 right-6 h-20 w-20 rounded-full bg-violet-100/80" />

                    <div className="absolute left-1/3 top-1/3 h-24 w-24 rounded-full border-8 border-white/70" />
                  </div>

                  {/* AI Teacher */}
                  <img
                    src={lesson.avatar}
                    alt={`${lesson.subject} AI teacher`}
                    className="absolute bottom-0 left-1/2 z-10 h-[88%] w-auto -translate-x-1/2 object-contain transition duration-300 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.src =
                        FALLBACK_AVATAR;
                    }}
                  />

                  {/* AI Label */}
                  <div className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-xs font-bold text-violet-700 shadow-sm backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Teacher
                  </div>

                  {/* Difficulty */}
                  <div className="absolute right-3 top-3 z-20 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                    {difficultyLabel(
                      lesson.difficulty,
                    )}
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-white">
                    <Clock3 className="h-3 w-3" />
                    {formatDuration(
                      lesson.duration,
                    )}
                  </div>

                  {/* Play Link */}
                  <Link
                    href={`/student/question-ai-videos/${lesson.id}`}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 transition group-hover:bg-black/10"
                    aria-label={`Watch ${lesson.title}`}
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-violet-700 opacity-0 shadow-xl transition duration-200 group-hover:scale-110 group-hover:opacity-100">
                      <Play className="ml-1 h-6 w-6 fill-current" />
                    </span>
                  </Link>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-xs font-bold text-violet-700">
                        {getSubjectInitials(
                          lesson.subject,
                        )}
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-violet-600">
                          {lesson.subject}
                        </p>

                        <p className="text-xs text-slate-400">
                          {lesson.topic}
                        </p>
                      </div>
                    </div>

                    {lesson.completed && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Done
                      </span>
                    )}
                  </div>

                  <h3 className="line-clamp-2 text-lg font-bold text-slate-950 transition group-hover:text-violet-700">
                    {lesson.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {lesson.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${difficultyClasses(
                        lesson.difficulty,
                      )}`}
                    >
                      {difficultyLabel(
                        lesson.difficulty,
                      )}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                      <BookOpen className="h-3.5 w-3.5" />
                      {lesson.sections}{" "}
                      {lesson.sections === 1
                        ? "section"
                        : "sections"}
                    </span>
                  </div>

                  {/* Teaching / Visual Info */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-violet-50 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-500">
                        Teaching
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-violet-800">
                        {formatTeachingStyle(
                          lessons.find(
                            (item) =>
                              item.id ===
                              lesson.id,
                          )
                            ?.teachingStyle ??
                            "step-by-step",
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg bg-indigo-50 px-3 py-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-500">
                        Visuals
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-indigo-800">
                        {formatVisualStyle(
                          lessons.find(
                            (item) =>
                              item.id ===
                              lesson.id,
                          )
                            ?.visualStyle ??
                            "modern",
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Start Lesson */}
                  <div className="mt-5">
                    <Link
                      href={`/student/question-ai-videos/${lesson.id}`}
                    >
                      <Button className="w-full gap-2 bg-violet-600 hover:bg-violet-700">
                        {lesson.completed
                          ? "Watch Again"
                          : "Start Lesson"}

                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Video className="h-7 w-7 text-slate-400" />
            </div>

            {lessons.length === 0 ? (
              <>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No AI video lessons yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  AI video lessons published by the
                  admin will appear here. Once a lesson
                  is published, students can open it and
                  start learning.
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No lessons found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  We couldn't find any AI video lessons
                  matching your search or selected
                  filters.
                </p>
              </>
            )}

            {(searchQuery ||
              selectedSubject !==
                "All Subjects" ||
              selectedDifficulty !==
                "All Levels") && (
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Temporary Storage Notice */}
        {!isLoading && lessons.length > 0 && (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Sparkles className="h-4 w-4 text-amber-700" />
              </div>

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Temporary AI Video Storage
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-800">
                  Published AI video lessons are currently
                  loaded from this browser's local storage.
                  This is temporary frontend storage and
                  will later be replaced with the backend
                  video lesson API.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <section className="mt-12 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50">
              <Brain className="h-6 w-6 text-violet-600" />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-950">
              Learn differently with AI
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Each AI video lesson combines teacher
              explanations, visual learning, examples
              and exam-focused guidance.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border bg-slate-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                <GraduationCap className="h-5 w-5 text-violet-700" />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                AI Teacher
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Learn from an AI teacher that explains
                concepts step by step.
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <Video className="h-5 w-5 text-indigo-700" />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                Visual Lessons
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                See diagrams, examples and animated
                explanations alongside the teacher.
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <Trophy className="h-5 w-5 text-amber-700" />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                JAMB Preparation
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Get exam-focused tips and understand how
                concepts appear in JAMB questions.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}