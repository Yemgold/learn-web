


"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

import AuthBanner from "../AuthBanner";
import AuthBackground from "./AuthBackground";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  title = "Turn Your EXAMS Preparation Into Victory",
  subtitle = "Prepare smarter, compete with students across Nigeria, climb the leaderboard, and win your place among the best.",
}: AuthLayoutProps) {
  return (
    <section className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ================= LEFT PANEL ================= */}

        <div className="hidden lg:block">
          <AuthBanner
            title={title}
            subtitle={subtitle}
          />
        </div>

        {/* ================= RIGHT PANEL ================= */}

        <div className="relative flex items-center justify-center overflow-hidden bg-slate-50 px-6 py-12 lg:px-12">
          {/* Decorative Background */}

          <AuthBackground />

          {/* Form Container */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="relative z-10 w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}











