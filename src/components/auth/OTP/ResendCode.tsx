



"use client";

import { useEffect, useState } from "react";
import { RotateCcw, MailCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ResendCodeProps {
  initialSeconds?: number;
  onResend?: () => Promise<void> | void;
  disabled?: boolean;
}

export default function ResendCode({
  initialSeconds = 60,
  onResend,
  disabled = false,
}: ResendCodeProps) {
  const [secondsLeft, setSecondsLeft] =
    useState(initialSeconds);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (
      loading ||
      disabled ||
      secondsLeft > 0
    )
      return;

    try {
      setLoading(true);

      if (onResend) {
        await onResend();
      }

      setSecondsLeft(initialSeconds);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.25,
      }}
      className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-blue-100 p-3">
          <MailCheck
            className="text-blue-600"
            size={22}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">
            Didn't receive the code?
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Check your spam folder or request a
            new verification code.
          </p>

          {secondsLeft > 0 ? (
            <p className="mt-4 text-sm font-medium text-slate-500">
              Resend available in{" "}
              <span className="font-bold text-blue-600">
                {secondsLeft}s
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading || disabled}
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <RotateCcw size={16} />

              {loading
                ? "Sending..."
                : "Resend Code"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}