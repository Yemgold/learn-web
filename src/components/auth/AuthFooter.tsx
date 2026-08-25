


"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({
  text,
  linkText,
  href,
}: AuthFooterProps) {
  return (
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
        delay: 0.25,
        duration: 0.4,
      }}
      className="mt-8"
    >
      {/* Divider */}

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-slate-400">
            or
          </span>
        </div>
      </div>

      {/* Footer */}

      <div className="text-center">
        <p className="text-sm text-slate-600">
          {text}{" "}
          <Link
            href={href}
            className="
              font-semibold
              text-blue-600
              transition-colors
              hover:text-blue-700
              hover:underline
            "
          >
            {linkText}
          </Link>
        </p>

        <div className="mt-6 text-xs leading-6 text-slate-400">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-blue-600"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-blue-600"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </motion.div>
  );
}