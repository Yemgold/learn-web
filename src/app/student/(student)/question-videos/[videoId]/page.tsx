




"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Play,
  Sparkles,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";

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
   Later this should come from your API/data file.
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

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
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

export default function QuestionVideoPage() {
  const params = useParams();

  const videoId = params.videoId as string;

  /* ============================================================
     FIND VIDEO
  ============================================================ */

  const video = questionVideos.find(
    (item) => item.id === videoId,
  );

  /* ============================================================
     VIDEO NOT FOUND
  ============================================================ */

  if (!video) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Video
                size={28}
                className="text-slate-400"
              />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Video Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              The question video you are looking for does
              not exist or may have been removed.
            </p>

            <Link
              href="/student/question-videos"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <ArrowLeft size={17} />

              Back to Question Videos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/student/question-videos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />

            Back to Question Videos
          </Link>
        </div>
      </section>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ==================================================
              MAIN VIDEO
          ================================================== */}

          <div>
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
                duration: 0.4,
              }}
              className="overflow-hidden rounded-3xl bg-black shadow-xl"
            >
              <div className="aspect-video">
                <video
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full"
                >
                  Your browser does not support video
                  playback.
                </video>
              </div>
            </motion.div>

            {/* ==================================================
                VIDEO INFORMATION
            ================================================== */}

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
                delay: 0.1,
                duration: 0.4,
              }}
              className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              {/* Tags */}

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                  {video.subject}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {video.topic}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {difficultyLabel(video.difficulty)}
                </span>
              </div>

              {/* Title */}

              <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {video.title}
              </h1>

              {/* Description */}

              <p className="mt-4 text-base leading-7 text-slate-600">
                {video.description}
              </p>

              {/* Stats */}

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock3 size={17} />

                    <span className="text-xs font-semibold">
                      Duration
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {formatDuration(video.duration)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <BookOpen size={17} />

                    <span className="text-xs font-semibold">
                      Questions
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {video.questionCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Sparkles size={17} />

                    <span className="text-xs font-semibold">
                      Level
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {difficultyLabel(video.difficulty)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ==================================================
                LEARNING OUTCOME
            ================================================== */}

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
                delay: 0.2,
                duration: 0.4,
              }}
              className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <CheckCircle2 size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    What you should learn
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Pay attention to the method used to solve
                    the question. The goal is not only to get
                    the answer but to understand the process so
                    you can solve similar JAMB questions on your
                    own.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside>
            <div className="sticky top-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Video size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Current Lesson
                  </p>

                  <p className="mt-0.5 font-bold text-slate-900">
                    {video.subject}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Topic
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {video.topic}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Difficulty
                </p>

                <p className="mt-1 font-bold text-slate-900">
                  {difficultyLabel(video.difficulty)}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <Link
                  href="/student/question-videos"
                  className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                >
                  <span className="flex items-center gap-2">
                    <Play
                      size={16}
                      fill="currentColor"
                    />

                    More Videos
                  </span>

                  <ChevronRight size={17} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}