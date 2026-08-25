




"use client";

import {
  Quote,
  Star,
  BadgeCheck,
  Trophy,
  Users,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

import Container from "@/components/layout/Container";

const testimonials = [
  {
    name: "David Adewale",
    role: "JAMB Candidate",
    school: "Lagos",
    initials: "DA",
    message:
      "JAMB League changed the way I prepare for JAMB. Instead of studying alone, I can practice with my friends, compete and see exactly where I stand.",
    score: "312",
  },

  {
    name: "Sarah Okeke",
    role: "Science Student",
    school: "Enugu",
    initials: "SO",
    message:
      "The competition makes preparation much more exciting. Our team started practicing every day because nobody wanted to fall behind on the leaderboard.",
    score: "298",
  },

  {
    name: "Michael Yusuf",
    role: "Team Captain",
    school: "Abuja",
    initials: "MY",
    message:
      "The leaderboard gives us something to work towards. We can see our progress, identify our weak subjects and challenge ourselves to improve.",
    score: "305",
  },
];

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Students",
  },
  {
    icon: Trophy,
    value: "100+",
    label: "Competitions",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Practice Engagement",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      {/* =========================================================
          BACKGROUND DECORATION
         ========================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-yellow-100/50 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-indigo-50/70 blur-3xl"
      />

      <Container>
        {/* =========================================================
            HEADER
           ========================================================= */}

        <div className="relative mx-auto mb-14 max-w-3xl text-center">
          {/* Eyebrow */}

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
              <Quote size={11} />
            </span>

            Student Stories
          </div>

          {/* Heading */}

          <h2
            className={cn(
              "text-3xl",
              "font-extrabold",
              "tracking-tight",
              "text-slate-950",
              "sm:text-4xl",
              "lg:text-5xl"
            )}
          >
            Built for students who want to
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              become champions.
            </span>
          </h2>

          {/* Description */}

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            JAMB League turns JAMB preparation into an experience where
            students can learn together, compete, track their progress and
            push themselves further.
          </p>
        </div>

        {/* =========================================================
            TESTIMONIAL CARDS
           ========================================================= */}

        <div className="relative grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className={cn(
                "group relative overflow-hidden rounded-3xl",
                "border border-slate-200",
                "bg-white",
                "p-6 sm:p-7",
                "shadow-sm",
                "transition-all duration-300",
                "hover:-translate-y-2",
                "hover:border-blue-200",
                "hover:shadow-2xl hover:shadow-blue-900/10"
              )}
            >
              {/* Top gradient line */}

              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-1",
                  index === 0 &&
                    "bg-gradient-to-r from-blue-500 to-indigo-600",
                  index === 1 &&
                    "bg-gradient-to-r from-indigo-500 to-purple-600",
                  index === 2 &&
                    "bg-gradient-to-r from-yellow-400 to-orange-500"
                )}
              />

              {/* Decorative quote */}

              <div className="absolute -right-5 -top-5 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-blue-100 transition-transform duration-500 group-hover:scale-110">
                <Quote size={40} />
              </div>

              {/* Stars */}

              <div className="relative mb-6 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}

                <span className="ml-2 text-xs font-semibold text-slate-400">
                  5.0
                </span>
              </div>

              {/* Quote */}

              <blockquote className="relative mb-8">
                <p className="text-[15px] leading-7 text-slate-600 sm:text-base">
                  “{item.message}”
                </p>
              </blockquote>

              {/* Divider */}

              <div className="mb-6 h-px bg-slate-100" />

              {/* Student */}

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20">
                    {item.initials}
                  </div>

                  {/* Information */}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900">
                        {item.name}
                      </h3>

                      <BadgeCheck
                        size={15}
                        className="fill-blue-600 text-white"
                      />
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.role} · {item.school}
                    </p>
                  </div>
                </div>

                {/* Score */}

                <div className="hidden rounded-xl bg-slate-50 px-3 py-2 text-right sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Practice
                  </p>

                  <p className="text-sm font-extrabold text-blue-600">
                    {item.score}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* =========================================================
            TRUST / STATS
           ========================================================= */}

        <div className="relative mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950">
          {/* Background glow */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 bottom-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"
          />

          <div className="relative grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-center gap-4 px-6 py-6 sm:py-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-yellow-300">
                    <Icon size={21} />
                  </div>

                  <div>
                    <p className="text-xl font-extrabold text-white">
                      {stat.value}
                    </p>

                    <p className="text-xs font-medium text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            BOTTOM MESSAGE
           ========================================================= */}

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Preparing together is better than preparing alone.
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            <span className="h-2 w-2 rounded-full bg-yellow-400" />

            <span className="ml-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              JAMB League
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}