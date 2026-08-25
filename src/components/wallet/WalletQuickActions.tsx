



"use client";

import {
  ArrowUpRight,
  Gift,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function WalletQuickActions() {
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* ============================================================
          REFERRAL CARD
      ============================================================ */}

      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <Gift className="h-5 w-5 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h2 className="font-bold text-slate-900">
              Earn through referrals
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Invite other students to Klazik Exams and earn rewards
              when your referrals complete qualifying activities.
            </p>

            <button
              type="button"
              onClick={() => router.push("/student/referrals")}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Go to referrals
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* ============================================================
          ARENA / COMPETITION CARD
      ============================================================ */}

      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <Trophy className="h-5 w-5 text-amber-600" />
          </div>

          <div className="min-w-0">
            <h2 className="font-bold text-slate-900">
              Win competition rewards
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Compete in the arena, climb the leaderboard and earn
              rewards through your performance.
            </p>

            <button
              type="button"
              onClick={() => router.push("/student/arena")}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 transition hover:text-amber-700"
            >
              Enter the arena
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}