




"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "lucide-react"; 
import {
  BookOpen,
  ChevronRight,
  Clock3,
  Filter,
  Play,
  Search,
  Sparkles,
  Video,
  X,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

interface QuestionVideo {
  id: string;
  title: string;
  subject: string;
  topic: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  questionCount: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

/* ============================================================
   SAMPLE DATA
   Replace this later with your API/data file.
============================================================ */

const questionVideos: QuestionVideo[] = [
  {
    id: "physics-motion-001",
    title: "Physics Motion — Question 1 Explained",
    subject: "Physics",
    topic: "Motion",
    description:
      "Watch the question, identify the correct option, and follow the step-by-step explanation.",
    thumbnail: "/images/videos/physics-motion-001.jpg",
    videoUrl: "/videos/physics-motion-001.mp4",
    duration: 62,
    questionCount: 1,
    difficulty: "EASY",
  },

  {
    id: "physics-motion-002",
    title: "Physics Motion — Question 2 Explained",
    subject: "Physics",
    topic: "Motion",
    description:
      "A step-by-step explanation of a JAMB-style motion question.",
    thumbnail: "/images/videos/physics-motion-002.jpg",
    videoUrl: "/videos/physics-motion-002.mp4",
    duration: 74,
    questionCount: 1,
    difficulty: "MEDIUM",
  },

  {
    id: "chemistry-atomic-001",
    title: "Chemistry — Atomic Structure",
    subject: "Chemistry",
    topic: "Atomic Structure",
    description:
      "Understand how to approach atomic structure questions and identify the correct answer.",
    thumbnail: "/images/videos/chemistry-atomic-001.jpg",
    videoUrl: "/videos/chemistry-atomic-001.mp4",
    duration: 81,
    questionCount: 1,
    difficulty: "MEDIUM",
  },

  {
    id: "mathematics-algebra-001",
    title: "Mathematics — Algebra Explained",
    subject: "Mathematics",
    topic: "Algebra",
    description:
      "Follow the complete solution from the question to the correct option.",
    thumbnail: "/images/videos/mathematics-algebra-001.jpg",
    videoUrl: "/videos/mathematics-algebra-001.mp4",
    duration: 88,
    questionCount: 1,
    difficulty: "HARD",
  },
];

/* ============================================================
   HELPERS
============================================================ */

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function difficultyLabel(
  difficulty: QuestionVideo["difficulty"],
) {
  switch (difficulty) {
    case "EASY":
      return "Easy";

    case "MEDIUM":
      return "Medium";

    case "HARD":
      return "Hard";

    default:
      return difficulty;
  }
}

/* ============================================================
   PAGE
============================================================ */

export default function QuestionVideosPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("ALL");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedVideo, setSelectedVideo] =
    useState<QuestionVideo | null>(null);

  /* ============================================================
     SUBJECTS
  ============================================================ */

  const subjects = useMemo(() => {
    return [
      "ALL",
      ...Array.from(
        new Set(questionVideos.map((video) => video.subject)),
      ),
    ];
  }, []);

  /* ============================================================
     FILTER VIDEOS
  ============================================================ */

  const filteredVideos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return questionVideos.filter((video) => {
      const matchesSubject =
        subject === "ALL" || video.subject === subject;

      const matchesDifficulty =
        difficulty === "ALL" ||
        video.difficulty === difficulty;

      const matchesSearch =
        !normalizedSearch ||
        video.title.toLowerCase().includes(normalizedSearch) ||
        video.subject.toLowerCase().includes(normalizedSearch) ||
        video.topic.toLowerCase().includes(normalizedSearch) ||
        video.description
          .toLowerCase()
          .includes(normalizedSearch);

      return (
        matchesSubject &&
        matchesDifficulty &&
        matchesSearch
      );
    });
  }, [search, subject, difficulty]);

  /* ============================================================
     CLEAR FILTERS
  ============================================================ */

  const clearFilters = () => {
    setSearch("");
    setSubject("ALL");
    setDifficulty("ALL");
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        {/* Background effects */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_40%)]" />

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            {/* Badge */}

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              <Sparkles size={16} />

              <span>Learn from every question</span>
            </div>

            {/* Title */}

            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Question Videos
            </h1>

            {/* Description */}

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Watch exam questions being solved step by step.
              See the correct option, understand the explanation,
              and learn how to approach similar questions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ====================================================
            SEARCH + FILTERS
        ==================================================== */}

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search questions, subjects or topics..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Subject */}

            <div className="flex items-center gap-2">
              <BookOpen
                size={18}
                className="hidden text-slate-400 sm:block"
              />

              <select
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                {subjects.map((item) => (
                  <option key={item} value={item}>
                    {item === "ALL"
                      ? "All Subjects"
                      : item}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}

            <div className="flex items-center gap-2">
              <Filter
                size={18}
                className="hidden text-slate-400 sm:block"
              />

              <select
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value)
                }
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="ALL">
                  All Difficulties
                </option>

                <option value="EASY">Easy</option>

                <option value="MEDIUM">Medium</option>

                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* ====================================================
            RESULTS HEADER
        ==================================================== */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Latest Lessons
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredVideos.length} video
              {filteredVideos.length === 1 ? "" : "s"} available
            </p>
          </div>
        </div>

        {/* ====================================================
            VIDEO GRID
        ==================================================== */}

        {filteredVideos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredVideos.map((video, index) => (
              <motion.article
                key={video.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* ==================================================
                    THUMBNAIL
                ================================================== */}

                <button
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className="relative block aspect-video w-full overflow-hidden bg-slate-900 text-left"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Gradient */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Subject */}

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-900 shadow">
                      {video.subject}
                    </span>
                  </div>

                  {/* Duration */}

                  <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-lg bg-black/75 px-2.5 py-1.5 text-xs font-semibold text-white">
                    <Clock3 size={13} />

                    {formatDuration(video.duration)}
                  </div>

                  {/* Play button */}

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-blue-600 shadow-2xl transition group-hover:scale-110">
                      <Play
                        size={23}
                        fill="currentColor"
                        className="ml-0.5"
                      />
                    </span>
                  </div>
                </button>

                {/* ==================================================
                    DETAILS
                ================================================== */}

                <div className="p-5">
                  {/* Topic + difficulty */}

                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-600">
                      {video.topic}
                    </span>

                    <span className="text-slate-300">
                      •
                    </span>

                    <span className="text-xs font-medium text-slate-500">
                      {difficultyLabel(video.difficulty)}
                    </span>
                  </div>

                  {/* Title */}

                  <h3 className="line-clamp-2 text-lg font-bold leading-6 text-slate-900">
                    {video.title}
                  </h3>

                  {/* Description */}

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {video.description}
                  </p>

                  {/* Watch button */}

                  <Link
  href={`/student/question-videos/${video.id}`}
  className="mt-5 flex w-full items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
>
  <span className="flex items-center gap-2">
    <Video size={17} />
    Watch Explanation
  </span>

  <ChevronRight size={17} />
</Link>

                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          /* ====================================================
             EMPTY STATE
          ==================================================== */

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Video
                size={28}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No videos found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try another subject, topic, difficulty or
              search term.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* ======================================================
          VIDEO MODAL
      ====================================================== */}

      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.25,
            }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-950 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* ==================================================
                CLOSE BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-white hover:text-slate-900"
              aria-label="Close video"
            >
              <X size={20} />
            </button>

            {/* ==================================================
                VIDEO PLAYER
            ================================================== */}

            <div className="aspect-video bg-black">
              <video
                key={selectedVideo.id}
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="h-full w-full"
              >
                Your browser does not support video playback.
              </video>
            </div>

            {/* ==================================================
                VIDEO INFORMATION
            ================================================== */}

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                {/* Subject */}

                <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-400">
                  {selectedVideo.subject}
                </span>

                {/* Topic */}

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                  {selectedVideo.topic}
                </span>

                {/* Difficulty */}

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300">
                  {difficultyLabel(
                    selectedVideo.difficulty,
                  )}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-white sm:text-2xl">
                {selectedVideo.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {selectedVideo.description}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}