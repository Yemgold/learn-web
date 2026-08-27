


"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Trophy,
  Users,
  Medal,
} from "lucide-react";

interface AuthBannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function AuthBanner({
  title = "Compete. Learn. Win.",
  subtitle = "Join thousands of students across Nigeria preparing for JAMB through competitions, practice challenges, leaderboards and scholarship rewards.",
  image = "/images/auth/auth-banner.png",
}: AuthBannerProps) {
  return (
    <div className="relative hidden min-h-screen overflow-hidden lg:block">
      {/* Background */}

      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </motion.div>

      {/* Overlays */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-blue-950/50" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_45%)]" />

      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,.65)]" />

      {/* Decorative blobs */}

      <div className="absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-blue-500/20 blur-[160px]" />

      <div className="absolute -right-40 bottom-10 h-[30rem] w-[30rem] rounded-full bg-indigo-500/20 blur-[160px]" />

      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[170px]" />

      {/* Floating particles */}

      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-blue-300"
          style={{
            left: `${(index * 97) % 100}%`,
            top: `${(index * 37) % 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 4 + (index % 4),
            repeat: Infinity,
          }}
        />
      ))}

      {/* Floating Achievement Card */}

      <motion.div
        initial={{
          opacity: 0,
          x: 40,
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -8, 0],
        }}
        transition={{
          delay: 0.5,
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="
          absolute
          right-10
          top-10
          rounded-3xl
          border
          border-white/20
          bg-white/10
          p-6
          shadow-2xl
          backdrop-blur-2xl
        "
      >
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-yellow-500/20 p-3">
            <Trophy
              className="text-yellow-400"
              size={28}
            />
          </div>

          <div>
            <p className="font-semibold text-white">
              ₦1,000,000 Prize Pool
            </p>

            <p className="text-sm text-white/70">
              Scholarships • Medals • Recognition
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content */}

      <div className="relative z-10 flex h-full flex-col justify-between p-16 text-white">

        {/* Brand */}

        <motion.div
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="flex items-center gap-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white shadow-[0_20px_60px_rgba(59,130,246,0.45)]">
            <GraduationCap
              size={30}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-wide">
              Learnyfi League
            </h2>

            <p className="mt-1 text-sm uppercase tracking-widest text-white/70">
              Learn • Compete • Win
            </p>
          </div>
        </motion.div>

        {/* Hero */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300 backdrop-blur-xl">
              🏆 National JAMB Competition
            </div>
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-tight xl:text-6xl">
            {title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
            {subtitle}
          </p>

          {/* Stats */}

          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold">
                10K+
              </p>

              <span className="text-white/70">
                Students
              </span>
            </div>

            <div>
              <p className="text-4xl font-bold">
                500+
              </p>

              <span className="text-white/70">
                Teams
              </span>
            </div>

            <div>
              <p className="text-4xl font-bold">
                ₦1M
              </p>

              <span className="text-white/70">
                Prize Pool
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Card */}

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
            delay: 0.9,
          }}
          className="
            rounded-3xl
            border
            border-white/20
            bg-white/10
            p-6
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-3">
            <Users className="text-blue-300" />

            <span className="font-semibold">
              Team-Based Competition
            </span>
          </div>

          <p className="mt-4 text-lg leading-7 text-white/90">
            Form a team, challenge students across
            Nigeria, improve your UTME score and
            climb the national leaderboard.
          </p>

          <div className="mt-5 flex items-center gap-2 text-blue-300">
            <Medal size={18} />

            <span className="text-sm">
              Scholarships • Certificates • Recognition
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


