"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthCard({
  children,
  title,
  subtitle,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -3,
      }}
      className="
        group
        relative
        w-full
        max-w-xl
        overflow-hidden
        rounded-[34px]
        border
        border-white/30
        bg-white/75
        backdrop-blur-2xl
        shadow-[0_20px_80px_rgba(15,23,42,0.15)]
      "
    >
      {/* Animated Luxury Background */}

      <div className="absolute inset-0 overflow-hidden">

        {/* Gold Glow */}

        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -top-28
            -right-24
            h-80
            w-80
            rounded-full
            bg-amber-300/20
            blur-3xl
          "
        />

        {/* Champagne Glow */}

        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -bottom-32
            -left-24
            h-96
            w-96
            rounded-full
            bg-yellow-400/10
            blur-3xl
          "
        />

        {/* Soft White Glow */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-96
            w-96
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-white/30
            blur-[120px]
          "
        />
      </div>

      {/* Premium Gold Border */}

      <div
        className="
          absolute
          inset-0
          rounded-[34px]
          border
          border-[#D4AF37]/20
          pointer-events-none
        "
      />

      {/* Glass Reflection */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-28
          bg-gradient-to-b
          from-white/50
          to-transparent
          pointer-events-none
        "
      />

      {/* Animated Gold Accent */}

      <motion.div
        animate={{
          backgroundPosition: [
            "0% 50%",
            "100% 50%",
            "0% 50%",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          h-1.5
          w-full
          bg-[length:200%_100%]
          bg-gradient-to-r
          from-[#B8860B]
          via-[#F4D03F]
          to-[#B8860B]
        "
      />

      <div className="relative z-10 p-8 sm:p-10 lg:p-12">

        {(title || subtitle) && (

          <div className="mb-10 text-center">

            {title && (

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                }}
                className="
                  text-4xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                {title}
              </motion.h1>

            )}

            {subtitle && (

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
                  delay: 0.3,
                }}
                className="
                  mt-4
                  mx-auto
                  max-w-md
                  text-[15px]
                  leading-7
                  text-slate-600
                "
              >
                {subtitle}
              </motion.p>

            )}

          </div>

        )}

        {children}

      </div>

      {/* Floating Luxury Particles */}

      <motion.span
        animate={{
          y: [0, -18, 0],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="
          absolute
          top-10
          right-10
          h-2
          w-2
          rounded-full
          bg-amber-400
        "
      />

      <motion.span
        animate={{
          y: [0, 15, 0],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="
          absolute
          bottom-16
          left-10
          h-1.5
          w-1.5
          rounded-full
          bg-yellow-500
        "
      />
    </motion.div>
  );
}


// "use client";

// import { ReactNode } from "react";
// import { motion } from "framer-motion";

// interface AuthCardProps {
//   children: ReactNode;
//   title?: string;
//   subtitle?: string;
// }

// export default function AuthCard({
//   children,
//   title,
//   subtitle,
// }: AuthCardProps) {
//   return (
//     <motion.div
//       initial={{
//         opacity: 0,
//         y: 24,
//         scale: 0.98,
//       }}
//       animate={{
//         opacity: 1,
//         y: 0,
//         scale: 1,
//       }}
//       transition={{
//         duration: 0.45,
//       }}
//       className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl"
//     >
//       {/* Decorative Background */}

//       <div className="absolute inset-0">
//         <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

//         <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
//       </div>

//       {/* Accent Bar */}

//       <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700" />

//       <div className="relative z-10 p-8 sm:p-10">
//         {(title || subtitle) && (
//           <div className="mb-8 text-center">
//             {title && (
//               <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//                 {title}
//               </h1>
//             )}

//             {subtitle && (
//               <p className="mt-3 text-slate-600 leading-7">
//                 {subtitle}
//               </p>
//             )}
//           </div>
//         )}

//         {children}
//       </div>
//     </motion.div>
//   );
// }