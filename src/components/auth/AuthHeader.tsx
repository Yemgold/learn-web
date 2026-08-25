



"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
}

export default function AuthHeader({
  title,
  subtitle,
  backHref = "/",
  backLabel = "Back to Home",
}: AuthHeaderProps) {
  return (
    <div className="mb-10">
      {/* Back Button */}

      <motion.div
        initial={{
          opacity: 0,
          x: -20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <Link
          href={backHref}
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-slate-200
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-slate-600
            shadow-sm
            transition-all
            hover:border-blue-600
            hover:text-blue-600
            hover:shadow-md
          "
        >
          <ChevronLeft size={16} />

          {backLabel}
        </Link>
      </motion.div>

      {/* Heading */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
          duration: 0.5,
        }}
        className="mt-8"
      >
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-4 max-w-md text-lg leading-8 text-slate-600">
          {subtitle}
        </p>
      </motion.div>
    </div>
  );
}