




"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface SuccessProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  showEmailIcon?: boolean;
}

export default function Success({
  title = "Success!",
  description = "Your request has been completed successfully.",
  buttonText = "Continue",
  buttonHref = "/",
  secondaryText,
  secondaryHref,
  showEmailIcon = false,
}: SuccessProps) {
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
        duration: 0.45,
      }}
      className="text-center"
    >
      {/* Success Icon */}

      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-green-100" />

        <motion.div
          initial={{
            scale: 0,
            rotate: -90,
          }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{
            delay: 0.25,
            type: "spring",
            stiffness: 220,
          }}
          className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-green-600 shadow-xl"
        >
          {showEmailIcon ? (
            <Mail
              size={38}
              className="text-white"
            />
          ) : (
            <CheckCircle2
              size={40}
              className="text-white"
            />
          )}
        </motion.div>
      </div>

      {/* Heading */}

      <motion.h2
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.35,
        }}
        className="mt-8 text-3xl font-bold text-slate-900"
      >
        {title}
      </motion.h2>

      {/* Description */}

      <motion.p
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.45,
        }}
        className="mx-auto mt-4 max-w-md text-slate-600 leading-7"
      >
        {description}
      </motion.p>

      {/* Primary Action */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.6,
        }}
        className="mt-10"
      >
       <Link href={buttonHref}>
  <Button
    size="lg"
    className="w-full"
  >
    {buttonText}

    <ArrowRight size={18} />
  </Button>
</Link>
      </motion.div>

      {/* Secondary Link */}

      {secondaryText &&
        secondaryHref && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.75,
            }}
            className="mt-6"
          >
            <Link
              href={secondaryHref}
              className="
                text-sm
                font-semibold
                text-blue-600
                transition-colors
                hover:text-blue-700
                hover:underline
              "
            >
              {secondaryText}
            </Link>
          </motion.div>
        )}
    </motion.div>
  );
}