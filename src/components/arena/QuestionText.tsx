



"use client";

import { motion } from "framer-motion";

interface QuestionTextProps {
  question: string;
}

export default function QuestionText({
  question,
}: QuestionTextProps) {
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
        duration: 0.6,
        ease: "easeOut",
      }}
      className="mx-auto max-w-4xl text-center"
    >
      <p
        className="
          text-xl
          font-semibold
          leading-relaxed
          tracking-tight
          text-white

          sm:text-2xl
          sm:leading-relaxed

          md:text-3xl

          lg:text-4xl
          lg:leading-[1.35]
        "
      >
        {question}
      </p>
    </motion.div>
  );
}
