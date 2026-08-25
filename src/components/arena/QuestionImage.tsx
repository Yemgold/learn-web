



"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface QuestionImageProps {
  src?: string;
  alt?: string;
  caption?: string;
  priority?: boolean;
}

export default function QuestionImage({
  src,
  alt = "Question illustration",
  caption,
  priority = false,
}: QuestionImageProps) {
  // No image? Don't render anything.
  if (!src) {
    return null;
  }

  return (
    <motion.figure
      initial={{
        opacity: 0,
        scale: 0.96,
        y: 15,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="mt-8 w-full"
    >
      {/* -------------------------------------------------------------- */}
      {/* Image Container                                                 */}
      {/* -------------------------------------------------------------- */}

      <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-2xl">
        <div className="relative aspect-video w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 80vw,
              768px
            "
            className="object-contain p-2 sm:p-4"
          />
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* Optional Caption                                                */}
      {/* -------------------------------------------------------------- */}

      {caption && (
        <figcaption className="mx-auto mt-3 max-w-2xl text-center text-xs leading-relaxed text-slate-500 sm:text-sm">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
