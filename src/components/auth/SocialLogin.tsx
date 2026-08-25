


"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface SocialLoginProps {
  onGoogleClick?: () => void;
  onAppleClick?: () => void;
  loading?: boolean;
}

export default function SocialLogin({
  onGoogleClick,
  onAppleClick,
  loading = false,
}: SocialLoginProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.1,
      }}
      className="mt-5"
    >
      <div className="grid grid-cols-2 gap-3">
        {/* Google */}

        <button
          type="button"
          disabled={loading}
          onClick={onGoogleClick}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            font-semibold
            text-slate-700
            transition-all
            hover:border-blue-500
            hover:shadow-md
          "
        >
          <Image
            src="/icons/google.svg"
            alt="Google"
            width={18}
            height={18}
          />

          Google
        </button>

        {/* Apple */}

        <button
          type="button"
          disabled={loading}
          onClick={onAppleClick}
          className="
            flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-900
            bg-slate-900
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            hover:bg-black
            hover:shadow-md
          "
        >
          <Image
            src="/icons/apple.svg"
            alt="Apple"
            width={18}
            height={18}
          />

          Apple
        </button>
      </div>
    </motion.div>
  );
}