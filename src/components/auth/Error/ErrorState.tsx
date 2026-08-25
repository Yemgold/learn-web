




"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  backLabel?: string;
  backHref?: string;
  onRetry?: () => void | Promise<void>;
  loading?: boolean;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete your request. Please try again in a moment.",
  retryLabel = "Try Again",
  backLabel = "Back to Login",
  backHref = "/auth/login",
  onRetry,
  loading = false,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.95,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="text-center"
    >
      {/* Icon */}

      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-red-100" />

        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-lg">
          <AlertTriangle
            size={40}
            className="text-white"
          />
        </div>
      </div>

      {/* Title */}

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        {title}
      </h2>

      {/* Description */}

      <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">
        {description}
      </p>

      {/* Actions */}

      <div className="mt-10 flex flex-col gap-4">
        {onRetry && (
          <Button
            size="lg"
            className="w-full"
            onClick={onRetry}
            disabled={loading}
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            {loading
              ? "Please wait..."
              : retryLabel}
          </Button>
        )}

        <Link href={backHref}>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
          >
            <ArrowLeft size={18} />

            {backLabel}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}