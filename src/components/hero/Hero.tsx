

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Medal,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import Container from "@/components/layout/Container";

const stats = [
  {
    icon: Trophy,
    value: "100+",
    label: "Competitions",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Students",
  },
  {
    icon: GraduationCap,
    value: "500+",
    label: "Schools",
  },
];

const floatingStats = [
  {
    icon: Trophy,
    title: "Top Performer",
    value: "98% Score",
    position:
      "left-0 top-10 sm:-left-8 sm:top-16 lg:-left-12 lg:top-20",
    delay: 0,
  },
  {
    icon: Medal,
    title: "National Rank",
    value: "#12",
    position:
      "right-0 top-28 sm:-right-8 sm:top-32 lg:-right-10 lg:top-36",
    delay: 0.2,
  },
  {
    icon: Zap,
    title: "Practice Streak",
    value: "21 Days",
    position:
      "bottom-8 left-2 sm:-left-6 sm:bottom-10 lg:-left-8 lg:bottom-12",
    delay: 0.4,
  },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071438] text-white">
      {/* =========================================================
          BACKGROUND
         ========================================================= */}

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.45),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(99,102,241,0.38),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(30,64,175,0.3),transparent_40%)]" />

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -right-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <Container>
        <div className="relative grid min-h-[760px] items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-24">
          {/* =========================================================
              LEFT CONTENT
             ========================================================= */}

          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 shadow-lg shadow-blue-950/20 backdrop-blur-md"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-slate-950">
                <Trophy size={14} strokeWidth={2.5} />
              </span>

              <span>Nigeria&apos;s Premier EXAMS Competition</span>

              <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" />
            </motion.div>

            {/* Heading */}
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Prepare to
              <span className="block">Compete.</span>

              <span className="mt-1 block bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                Rise to the Top.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-2xl text-base leading-7 text-blue-100/90 sm:text-lg sm:leading-8">
              Turn your EXAMS preparation into a competition. Practice with
              real exam-style questions, build your team, challenge other
              students and climb the national leaderboard.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-7 text-sm font-bold text-slate-950 shadow-xl shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/20"
              >
                Join the Competition

                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/auth/login"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                Login
                
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-blue-100/80">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-yellow-300"
                />
                Free competition entry
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-yellow-300"
                />
                Team challenges
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-yellow-300"
                />
                National leaderboard
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid max-w-xl grid-cols-3 border-t border-white/10 pt-7">
              {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.45 + index * 0.1,
                      duration: 0.5,
                    }}
                    className="border-r border-white/10 px-3 first:pl-0 last:border-r-0"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        size={16}
                        className="text-yellow-300"
                      />

                      <span className="text-xl font-extrabold sm:text-2xl">
                        {item.value}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-blue-100/60 sm:text-sm">
                      {item.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* =========================================================
              RIGHT IMAGE AREA
             ========================================================= */}

          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            {/* Outer glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[3rem] bg-blue-500/20 blur-3xl"
            />

            {/* Decorative orbit */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -inset-5 rounded-[3rem] border border-dashed border-white/10"
            />

            {/* Image frame */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-2xl shadow-blue-950/50 backdrop-blur-sm sm:rounded-[2.5rem]">
              <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.6rem] sm:aspect-[4/4.2]">
                <Image
                  src="/images/hero/jamb-league-students.png"
                  alt="Students preparing and competing in JAMB League"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 48vw"
                  className="object-cover"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071438]/90 via-[#071438]/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                        <Sparkles
                          size={13}
                          className="text-yellow-300"
                        />

                        JAMB League 2027
                      </div>

                      <h2 className="text-2xl font-extrabold sm:text-3xl">
                        Your journey to
                        <span className="block text-yellow-300">
                          becoming a champion.
                        </span>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                FLOATING CARDS
               ===================================================== */}

            {floatingStats.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -8, 0],
                  }}
                  transition={{
                    opacity: {
                      duration: 0.5,
                      delay: 0.7 + item.delay,
                    },
                    scale: {
                      duration: 0.5,
                      delay: 0.7 + item.delay,
                    },
                    y: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: item.delay,
                    },
                  }}
                  className={`absolute z-20 ${item.position}`}
                >
                  <div className="flex min-w-[155px] items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/75 px-4 py-3 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20">
                      <Icon size={19} />
                    </div>

                    <div>
                      <p className="text-[11px] font-medium text-blue-100/60">
                        {item.title}
                      </p>

                      <p className="text-sm font-extrabold text-white">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Bottom achievement card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1,
                duration: 0.6,
              }}
              className="absolute -bottom-5 right-3 z-20 sm:-bottom-6 sm:right-6"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-400/20 text-green-300">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Ready to compete?
                  </p>

                  <p className="text-[11px] text-blue-100/60">
                    Join students across Nigeria
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* =========================================================
          BOTTOM WAVE / GLOW
         ========================================================= */}

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#071438] to-transparent"
      />
    </section>
  );
}