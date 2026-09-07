



// \student\(student)\question-videos\[videoId]\page.tsx

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Lightbulb,
  Play,
  Sparkles,
  Target,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";

/* ============================================================
   TYPES
============================================================ */

interface LearningObjective {
  id: string;
  text: string;
}

interface LessonStep {
  id: string;
  title: string;
  explanation: string;
  example?: string;
}

interface VideoLesson {
  id: string;
  title: string;
  subject: string;
  topic: string;
  description: string;

  thumbnail: string;
  videoUrl: string;

  duration: number;

  difficulty: "EASY" | "MEDIUM" | "HARD";

  objectives: LearningObjective[];

  steps: LessonStep[];

  keyPoints: string[];

  summary: string;

  jambTips?: string;
}

/* ============================================================
   SAMPLE DATA

   Later replace this with your API response.
============================================================ */

const videoLessons: VideoLesson[] = [
  {
    id: "physics-motion-001",

    title: "Understanding Motion — Complete Tutorial",

    subject: "Physics",

    topic: "Motion",

    description:
      "In this lesson, you will learn the fundamental concepts of motion, how to identify the quantities involved, and how to solve common JAMB-style motion problems step by step.",

    thumbnail: "/images/videos/physics-motion-001.jpg",

    videoUrl: "/videos/physics-motion-001.mp4",

    duration: 1125,

    difficulty: "MEDIUM",

    objectives: [
      {
        id: "obj-1",
        text: "Define motion and explain the difference between distance and displacement.",
      },
      {
        id: "obj-2",
        text: "Distinguish between speed and velocity.",
      },
      {
        id: "obj-3",
        text: "Apply the basic equations of motion to solve problems.",
      },
      {
        id: "obj-4",
        text: "Identify the correct approach when solving JAMB motion questions.",
      },
    ],

    steps: [
      {
        id: "step-1",

        title: "Understand the meaning of motion",

        explanation:
          "Motion occurs when an object changes its position relative to a reference point as time passes. Before solving a motion problem, first identify the object that is moving and the reference point from which its position is being measured.",

        example:
          "A car moving along a straight road is in motion relative to a stationary observer beside the road.",
      },

      {
        id: "step-2",

        title: "Identify distance and displacement",

        explanation:
          "Distance is the total path travelled by an object, while displacement is the shortest straight-line distance from the initial position to the final position in a specified direction. Distance is a scalar quantity, whereas displacement is a vector quantity.",

        example:
          "If a student walks 5 m east and then 3 m west, the distance travelled is 8 m, while the magnitude of the displacement is 2 m east.",
      },

      {
        id: "step-3",

        title: "Understand speed and velocity",

        explanation:
          "Speed tells us how quickly an object covers distance and is calculated as distance divided by time. Velocity is the rate of change of displacement and therefore includes direction.",

        example:
          "If a car travels 120 km in 2 hours, its average speed is 60 km/h.",
      },

      {
        id: "step-4",

        title: "Apply the equation of motion",

        explanation:
          "For uniformly accelerated motion, equations such as v = u + at can be used. Always identify the known quantities before selecting an equation. Here, u represents initial velocity, v represents final velocity, a represents acceleration, and t represents time.",

        example:
          "If a body starts with an initial velocity of 5 m/s and accelerates at 2 m/s² for 4 seconds, its final velocity is v = 5 + (2 × 4) = 13 m/s.",
      },

      {
        id: "step-5",

        title: "Check the answer",

        explanation:
          "After calculating your answer, check the unit and determine whether the result makes physical sense. This is especially useful in examination questions where incorrect unit conversion can produce a wrong answer.",

        example:
          "If the question asks for velocity, your final answer should have a velocity unit such as m/s.",
      },
    ],

    keyPoints: [
      "Motion is a change in position with respect to a reference point.",
      "Distance is scalar while displacement is vector.",
      "Speed is based on distance while velocity is based on displacement.",
      "Always identify the known quantities before choosing an equation.",
      "Check units before selecting your final answer.",
    ],

    summary:
      "Motion describes a change in position with time. Understanding the difference between distance and displacement, as well as speed and velocity, is essential before solving numerical problems. For uniformly accelerated motion, select the appropriate equation based on the quantities provided in the question.",

    jambTips:
      "JAMB questions may test the difference between distance and displacement or speed and velocity. Pay close attention to words such as direction, total distance, displacement, average speed and average velocity.",
  },

  {
    id: "chemistry-atomic-001",

    title: "Atomic Structure — Complete Tutorial",

    subject: "Chemistry",

    topic: "Atomic Structure",

    description:
      "Learn the structure of the atom, subatomic particles, isotopes and how to approach common examination questions.",

    thumbnail: "/images/videos/chemistry-atomic-001.jpg",

    videoUrl: "/videos/chemistry-atomic-001.mp4",

    duration: 980,

    difficulty: "EASY",

    objectives: [
      {
        id: "obj-1",
        text: "Identify the three major subatomic particles.",
      },
      {
        id: "obj-2",
        text: "Explain atomic number and mass number.",
      },
      {
        id: "obj-3",
        text: "Calculate the number of neutrons in an atom.",
      },
    ],

    steps: [
      {
        id: "step-1",

        title: "Identify the subatomic particles",

        explanation:
          "Atoms contain protons, neutrons and electrons. Protons have a positive charge, neutrons have no charge, and electrons have a negative charge.",

        example:
          "A neutral atom with 11 protons also has 11 electrons.",
      },

      {
        id: "step-2",

        title: "Understand atomic number",

        explanation:
          "The atomic number of an element is the number of protons present in the nucleus of its atom. It uniquely identifies the element.",

        example:
          "Sodium has atomic number 11, meaning a sodium atom contains 11 protons.",
      },

      {
        id: "step-3",

        title: "Calculate the number of neutrons",

        explanation:
          "The mass number is the sum of protons and neutrons. Therefore, the number of neutrons can be found by subtracting the atomic number from the mass number.",

        example:
          "For an atom with mass number 23 and atomic number 11: neutrons = 23 − 11 = 12.",
      },
    ],

    keyPoints: [
      "Protons are positively charged.",
      "Neutrons have no electrical charge.",
      "Electrons are negatively charged.",
      "Atomic number equals the number of protons.",
      "Mass number equals protons plus neutrons.",
    ],

    summary:
      "The atom is made up of protons, neutrons and electrons. Atomic number identifies an element, while mass number represents the total number of protons and neutrons.",

    jambTips:
      "When calculating neutrons, remember: Mass number − Atomic number = Number of neutrons.",
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
  difficulty: VideoLesson["difficulty"],
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

export default function VideoLessonPage() {
  const params = useParams();

  const videoId = params.videoId as string;

  /* ============================================================
     FIND LESSON
  ============================================================ */

  const lesson = videoLessons.find(
    (item) => item.id === videoId,
  );

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (!lesson) {
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
              Lesson Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              The video lesson you are looking for does not
              exist or may have been removed.
            </p>

            <Link
              href="/student/question-videos"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              <ArrowLeft size={17} />

              Back to Video Lessons
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
      {/* ========================================================
          HERO / HEADER
      ======================================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/student/question-videos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />

            Back to Video Lessons
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-300 ring-1 ring-blue-400/20">
                {lesson.subject}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                {lesson.topic}
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                {difficultyLabel(lesson.difficulty)}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {lesson.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              {lesson.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Clock3 size={17} />

                {formatDuration(lesson.duration)}
              </div>

              <div className="flex items-center gap-2">
                <BookOpen size={17} />

                {lesson.steps.length} learning steps
              </div>

              <div className="flex items-center gap-2">
                <Target size={17} />

                {lesson.objectives.length} objectives
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONTENT
      ======================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* ====================================================
              MAIN CONTENT
          ==================================================== */}

          <div>
            {/* VIDEO */}

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
                  src={lesson.videoUrl}
                  poster={lesson.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full"
                >
                  Your browser does not support video playback.
                </video>
              </div>
            </motion.div>

            {/* ==================================================
                LEARNING OBJECTIVES
            ================================================== */}

            <motion.section
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
              className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Target size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    What you will learn
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    By the end of this lesson, you should be able
                    to:
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {lesson.objectives.map((objective) => (
                  <div
                    key={objective.id}
                    className="flex gap-3 rounded-2xl bg-white p-4"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Check
                        size={14}
                        strokeWidth={3}
                      />
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {objective.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ==================================================
                STEP-BY-STEP EXPLANATION
            ================================================== */}

            <motion.section
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
              className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <BookOpen size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Step-by-Step Explanation
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Follow each step carefully and try to
                    understand the method.
                  </p>
                </div>
              </div>

              <div className="relative mt-8">
                <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-slate-200 sm:block" />

                <div className="space-y-8">
                  {lesson.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="relative flex gap-4 sm:gap-6"
                    >
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white ring-8 ring-white">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1 pb-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {step.title}
                        </h3>

                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                          {step.explanation}
                        </p>

                        {step.example && (
                          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex items-center gap-2">
                              <Lightbulb
                                size={17}
                                className="text-slate-500"
                              />

                              <span className="text-sm font-bold text-slate-900">
                                Example
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {step.example}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* ==================================================
                KEY POINTS
            ================================================== */}

            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
                duration: 0.4,
              }}
              className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Lightbulb size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Key Points to Remember
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep these important ideas in mind.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {lesson.keyPoints.map((point, index) => (
                  <div
                    key={`${point}-${index}`}
                    className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                      <Check
                        size={14}
                        strokeWidth={3}
                      />
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 0.4,
              }}
              className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Sparkles size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Lesson Summary
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    A quick recap of what you have learned.
                  </p>
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                {lesson.summary}
              </p>
            </motion.section>

            {/* ==================================================
                JAMB TIPS
            ================================================== */}

            {lesson.jambTips && (
              <motion.section
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                  duration: 0.4,
                }}
                className="mt-6 rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
                    <Sparkles size={22} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                      Exam Focus
                    </p>

                    <h2 className="mt-1 text-xl font-bold">
                      JAMB Tip
                    </h2>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-300 sm:text-base">
                  {lesson.jambTips}
                </p>
              </motion.section>
            )}

            {/* ==================================================
                COMPLETION
            ================================================== */}

            <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Ready to test yourself?
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Practice questions can help you confirm
                      that you understand this topic.
                    </p>
                  </div>
                </div>

                <Link
                  href="/student/practice"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                >
                  Practice Questions

                  <ChevronRight size={17} />
                </Link>
              </div>
            </div>
          </div>

          {/* ====================================================
              SIDEBAR
          ==================================================== */}

          <aside>
            <div className="sticky top-6 space-y-5">
              {/* LESSON CARD */}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Video size={21} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Video Lesson
                    </p>

                    <p className="mt-0.5 font-bold text-slate-900">
                      {lesson.subject}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <SidebarInfo
                    label="Topic"
                    value={lesson.topic}
                  />

                  <SidebarInfo
                    label="Duration"
                    value={formatDuration(
                      lesson.duration,
                    )}
                  />

                  <SidebarInfo
                    label="Difficulty"
                    value={difficultyLabel(
                      lesson.difficulty,
                    )}
                  />

                  <SidebarInfo
                    label="Learning Steps"
                    value={`${lesson.steps.length}`}
                  />
                </div>
              </div>

              {/* CONTENT MAP */}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-bold text-slate-900">
                  Lesson Contents
                </h2>

                <div className="mt-4 space-y-1">
                  <ContentLink
                    icon={<Video size={16} />}
                    label="Tutorial Video"
                  />

                  <ContentLink
                    icon={<Target size={16} />}
                    label="Learning Objectives"
                  />

                  <ContentLink
                    icon={<BookOpen size={16} />}
                    label="Step-by-Step Explanation"
                  />

                  <ContentLink
                    icon={<Lightbulb size={16} />}
                    label="Key Points"
                  />

                  <ContentLink
                    icon={<Sparkles size={16} />}
                    label="Lesson Summary"
                  />

                  {lesson.jambTips && (
                    <ContentLink
                      icon={<Sparkles size={16} />}
                      label="JAMB Tip"
                    />
                  )}
                </div>
              </div>

              {/* MORE LESSONS */}

              <Link
                href="/student/question-videos"
                className="flex w-full items-center justify-between rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600"
              >
                <span className="flex items-center gap-2">
                  <Play
                    size={16}
                    fill="currentColor"
                  />

                  More Video Lessons
                </span>

                <ChevronRight size={17} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   SIDEBAR INFO
============================================================ */

function SidebarInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   CONTENT LINK
============================================================ */

function ContentLink({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600">
      <span className="text-slate-400">
        {icon}
      </span>

      <span>{label}</span>
    </div>
  );
}
