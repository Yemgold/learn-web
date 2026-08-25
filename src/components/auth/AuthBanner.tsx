


"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Trophy,
  Users,
  Medal,
} from "lucide-react";

interface AuthBannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function AuthBanner({
  title = "Compete. Learn. Win.",
  subtitle = "Join thousands of students across Nigeria preparing for JAMB through competitions, practice challenges, leaderboards and scholarship rewards.",
  image = "/images/auth/auth-banner.png",
}: AuthBannerProps) {
  return (
    <div className="relative hidden min-h-screen overflow-hidden lg:block">
      {/* Background */}

      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </motion.div>

      {/* Overlays */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-blue-950/50" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_45%)]" />

      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,.65)]" />

      {/* Decorative blobs */}

      <div className="absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-blue-500/20 blur-[160px]" />

      <div className="absolute -right-40 bottom-10 h-[30rem] w-[30rem] rounded-full bg-indigo-500/20 blur-[160px]" />

      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[170px]" />

      {/* Floating particles */}

      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-blue-300"
          style={{
            left: `${(index * 97) % 100}%`,
            top: `${(index * 37) % 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 4 + (index % 4),
            repeat: Infinity,
          }}
        />
      ))}

      {/* Floating Achievement Card */}

      <motion.div
        initial={{
          opacity: 0,
          x: 40,
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -8, 0],
        }}
        transition={{
          delay: 0.5,
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="
          absolute
          right-10
          top-10
          rounded-3xl
          border
          border-white/20
          bg-white/10
          p-6
          shadow-2xl
          backdrop-blur-2xl
        "
      >
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-yellow-500/20 p-3">
            <Trophy
              className="text-yellow-400"
              size={28}
            />
          </div>

          <div>
            <p className="font-semibold text-white">
              ₦1,000,000 Prize Pool
            </p>

            <p className="text-sm text-white/70">
              Scholarships • Medals • Recognition
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content */}

      <div className="relative z-10 flex h-full flex-col justify-between p-16 text-white">

        {/* Brand */}

        <motion.div
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          className="flex items-center gap-4"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 text-white shadow-[0_20px_60px_rgba(59,130,246,0.45)]">
            <GraduationCap
              size={30}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-wide">
              Klazik JAMB League
            </h2>

            <p className="mt-1 text-sm uppercase tracking-widest text-white/70">
              Learn • Compete • Win
            </p>
          </div>
        </motion.div>

        {/* Hero */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-300 backdrop-blur-xl">
              🏆 National JAMB Competition
            </div>
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-tight xl:text-6xl">
            {title}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
            {subtitle}
          </p>

          {/* Stats */}

          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold">
                10K+
              </p>

              <span className="text-white/70">
                Students
              </span>
            </div>

            <div>
              <p className="text-4xl font-bold">
                500+
              </p>

              <span className="text-white/70">
                Teams
              </span>
            </div>

            <div>
              <p className="text-4xl font-bold">
                ₦1M
              </p>

              <span className="text-white/70">
                Prize Pool
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Card */}

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
            delay: 0.9,
          }}
          className="
            rounded-3xl
            border
            border-white/20
            bg-white/10
            p-6
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-3">
            <Users className="text-blue-300" />

            <span className="font-semibold">
              Team-Based Competition
            </span>
          </div>

          <p className="mt-4 text-lg leading-7 text-white/90">
            Form a team, challenge students across
            Nigeria, improve your UTME score and
            climb the national leaderboard.
          </p>

          <div className="mt-5 flex items-center gap-2 text-blue-300">
            <Medal size={18} />

            <span className="text-sm">
              Scholarships • Certificates • Recognition
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}




// "use client";

// import Image from "next/image";
// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   GraduationCap,
//   Globe2,
//   Medal,
//   ShieldCheck,
//   Sparkles,
//   Trophy,
//   Users,
// } from "lucide-react";

// interface AuthBannerProps {
//   title?: string;
//   subtitle?: string;
//   image?: string;
// }

// export default function AuthBanner({
//   title = "Turn Your Exams Preparation Into Victory",
//   subtitle = "Prepare smarter, compete with students across Nigeria, climb the national leaderboard, and earn your place among the best.",
//   image = "/images/auth/auth-banner.png",
// }: AuthBannerProps) {
//   return (
//     <div className="relative hidden min-h-screen overflow-hidden bg-[#07122F] lg:block">
//       {/* =========================================================
//           BACKGROUND IMAGE
//          ========================================================= */}

//       <motion.div
//         className="absolute inset-0"
//         initial={{ scale: 1.03 }}
//         animate={{ scale: [1.03, 1.07, 1.03] }}
//         transition={{
//           duration: 24,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//       >
//         <Image
//           src={image}
//           alt="Students preparing for the JAMB League competition"
//           fill
//           priority
//           sizes="50vw"
//           className="object-cover object-center"
//         />
//       </motion.div>

//       {/* =========================================================
//           CINEMATIC OVERLAY
//          ========================================================= */}

//       {/* Main dark overlay */}
//       <div className="absolute inset-0 bg-[#07122F]/70" />

//       {/* Left text protection */}
//       <div className="absolute inset-0 bg-gradient-to-r from-[#050D25]/95 via-[#0A1740]/80 to-[#112B67]/35" />

//       {/* Bottom fade */}
//       <div className="absolute inset-0 bg-gradient-to-t from-[#050B20]/95 via-transparent to-[#07122F]/30" />

//       {/* Blue atmospheric glow */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(37,99,235,0.35),transparent_38%)]" />

//       {/* Gold atmospheric glow */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(250,204,21,0.12),transparent_30%)]" />

//       {/* Inner cinematic shadow */}
//       <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.65)]" />

//       {/* =========================================================
//           DECORATIVE LIGHTS
//          ========================================================= */}

//       <div className="absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-blue-600/20 blur-[150px]" />

//       <div className="absolute -right-40 bottom-20 h-[30rem] w-[30rem] rounded-full bg-indigo-600/25 blur-[150px]" />

//       <div className="absolute left-[55%] top-[30%] h-72 w-72 rounded-full bg-blue-400/10 blur-[120px]" />

//       {/* =========================================================
//           FLOATING PARTICLES
//          ========================================================= */}

//       {Array.from({ length: 20 }).map((_, index) => (
//         <motion.span
//           key={index}
//           className={`absolute rounded-full ${
//             index % 5 === 0
//               ? "h-2 w-2 bg-yellow-300"
//               : "h-1.5 w-1.5 bg-blue-300"
//           }`}
//           style={{
//             left: `${(index * 47 + 5) % 100}%`,
//             top: `${(index * 31 + 8) % 100}%`,
//           }}
//           animate={{
//             y: [0, -18, 0],
//             x: [0, index % 2 === 0 ? 8 : -8, 0],
//             opacity: [0.15, 0.8, 0.15],
//             scale: [0.8, 1.15, 0.8],
//           }}
//           transition={{
//             duration: 4 + (index % 5),
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: index * 0.15,
//           }}
//         />
//       ))}

//       {/* =========================================================
//           MAIN CONTENT
//          ========================================================= */}

//       <div className="relative z-10 flex min-h-screen flex-col justify-between px-10 py-10 xl:px-16 xl:py-12">
//         {/* =======================================================
//             BRAND
//            ======================================================= */}

//         <motion.div
//           initial={{ opacity: 0, x: -25 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{
//             duration: 0.7,
//             ease: "easeOut",
//           }}
//           className="flex items-center"
//         >
//           {/* Logo */}
//           <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700 shadow-[0_15px_50px_rgba(37,99,235,0.4)]">
//             <GraduationCap
//               size={30}
//               strokeWidth={2.2}
//               className="text-white"
//             />

//             {/* Gold dot */}
//             <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#07122F] bg-yellow-400" />
//           </div>

//           <div className="ml-4">
//             <h2 className="text-2xl font-extrabold tracking-tight text-white xl:text-3xl">
//               Klazik JAMB League
//             </h2>

//             <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-blue-200">
//               <span>Learn</span>
//               <span className="h-1 w-1 rounded-full bg-yellow-400" />
//               <span>Compete</span>
//               <span className="h-1 w-1 rounded-full bg-yellow-400" />
//               <span>Win</span>
//             </div>
//           </div>
//         </motion.div>

//         {/* =======================================================
//             FLOATING PRIZE CARD
//            ======================================================= */}

//         <motion.div
//           initial={{ opacity: 0, x: 40, y: -10 }}
//           animate={{
//             opacity: 1,
//             x: 0,
//             y: [0, -7, 0],
//           }}
//           transition={{
//             opacity: {
//               duration: 0.7,
//               delay: 0.4,
//             },
//             x: {
//               duration: 0.7,
//               delay: 0.4,
//             },
//             y: {
//               duration: 5,
//               repeat: Infinity,
//               ease: "easeInOut",
//             },
//           }}
//           className="absolute right-8 top-10 xl:right-12"
//         >
//           <div className="rounded-2xl border border-white/15 bg-white/[0.10] p-4 shadow-2xl backdrop-blur-2xl xl:p-5">
//             <div className="flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300/30 to-yellow-500/10 ring-1 ring-yellow-300/20">
//                 <Trophy
//                   size={22}
//                   className="text-yellow-300"
//                   strokeWidth={2}
//                 />
//               </div>

//               <div>
//                 <p className="text-sm font-bold text-white">
//                   ₦1,000,000 Prize Pool
//                 </p>

//                 <p className="mt-0.5 text-xs text-white/55">
//                   Scholarships • Medals • Recognition
//                 </p>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* =======================================================
//             HERO CONTENT
//            ======================================================= */}

//         <motion.div
//           initial={{
//             opacity: 0,
//             y: 35,
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//           transition={{
//             duration: 0.8,
//             delay: 0.2,
//             ease: "easeOut",
//           }}
//           className="max-w-2xl xl:max-w-3xl"
//         >
//           {/* Competition badge */}

//           <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-500/15 px-4 py-2 text-xs font-semibold text-blue-100 shadow-lg backdrop-blur-xl">
//             <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] text-slate-950">
//               🏆
//             </span>

//             <span>National JAMB Competition</span>

//             <span className="h-1 w-1 rounded-full bg-yellow-300" />

//             <span className="text-blue-200">
//               2027
//             </span>
//           </div>

//           {/* Heading */}

//           <h1 className="max-w-3xl text-5xl font-black leading-[1.03] tracking-[-0.035em] text-white xl:text-6xl 2xl:text-7xl">
//             {title.split(" ").map((word, index) => (
//               <span key={`${word}-${index}`}>
//                 {word}{" "}
//               </span>
//             ))}
//           </h1>

//           {/* Gold highlight */}

//           <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-[0_0_25px_rgba(250,204,21,0.45)]" />

//           {/* Subtitle */}

//           <p className="mt-6 max-w-2xl text-base leading-7 text-blue-50/80 xl:text-lg xl:leading-8">
//             {subtitle}
//           </p>

//           {/* =====================================================
//               STATS
//              ===================================================== */}

//           <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 xl:mt-12 xl:gap-4">
//             {/* Students */}
//             <div className="group rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl transition hover:border-blue-300/30 hover:bg-white/[0.10]">
//               <div className="flex items-center gap-2">
//                 <Users
//                   size={17}
//                   className="text-blue-300"
//                 />

//                 <span className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
//                   Community
//                 </span>
//               </div>

//               <p className="mt-2 text-2xl font-extrabold text-white xl:text-3xl">
//                 10K+
//               </p>

//               <p className="mt-0.5 text-xs text-white/55">
//                 Students
//               </p>
//             </div>

//             {/* Teams */}
//             <div className="group rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl transition hover:border-indigo-300/30 hover:bg-white/[0.10]">
//               <div className="flex items-center gap-2">
//                 <Globe2
//                   size={17}
//                   className="text-indigo-300"
//                 />

//                 <span className="text-[10px] font-semibold uppercase tracking-wider text-white/45">
//                   National
//                 </span>
//               </div>

//               <p className="mt-2 text-2xl font-extrabold text-white xl:text-3xl">
//                 500+
//               </p>

//               <p className="mt-0.5 text-xs text-white/55">
//                 Teams
//               </p>
//             </div>

//             {/* Prize */}
//             <div className="group rounded-2xl border border-yellow-300/20 bg-yellow-300/[0.08] p-4 backdrop-blur-xl transition hover:border-yellow-300/40 hover:bg-yellow-300/[0.12]">
//               <div className="flex items-center gap-2">
//                 <Medal
//                   size={17}
//                   className="text-yellow-300"
//                 />

//                 <span className="text-[10px] font-semibold uppercase tracking-wider text-yellow-100/55">
//                   Rewards
//                 </span>
//               </div>

//               <p className="mt-2 text-2xl font-extrabold text-yellow-300 xl:text-3xl">
//                 ₦1M
//               </p>

//               <p className="mt-0.5 text-xs text-yellow-100/55">
//                 Prize Pool
//               </p>
//             </div>
//           </div>

//           {/* Small trust line */}

//           <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/55">
//             <span className="flex items-center gap-1.5">
//               <ShieldCheck
//                 size={14}
//                 className="text-green-300"
//               />
//               Secure platform
//             </span>

//             <span className="flex items-center gap-1.5">
//               <Sparkles
//                 size={14}
//                 className="text-yellow-300"
//               />
//               Scholarships & recognition
//             </span>

//             <span className="flex items-center gap-1.5">
//               <Globe2
//                 size={14}
//                 className="text-blue-300"
//               />
//               Students across Nigeria
//             </span>
//           </div>
//         </motion.div>

//         {/* =======================================================
//             BOTTOM COMPETITION CARD
//            ======================================================= */}

//         <motion.div
//           initial={{
//             opacity: 0,
//             y: 25,
//           }}
//           animate={{
//             opacity: 1,
//             y: 0,
//           }}
//           transition={{
//             duration: 0.7,
//             delay: 0.8,
//             ease: "easeOut",
//           }}
//           className="relative max-w-2xl"
//         >
//           <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.09] p-5 shadow-2xl backdrop-blur-2xl xl:p-6">
//             {/* Top row */}

//             <div className="flex items-center justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-300/20">
//                   <Users
//                     size={21}
//                     className="text-blue-200"
//                   />
//                 </div>

//                 <div>
//                   <p className="text-sm font-bold text-white">
//                     Team-Based Competition
//                   </p>

//                   <p className="mt-0.5 text-xs text-white/45">
//                     Compete together. Rise together.
//                   </p>
//                 </div>
//               </div>

//               {/* Live indicator */}

//               <div className="flex items-center gap-2 rounded-full border border-green-300/15 bg-green-400/10 px-3 py-1.5">
//                 <span className="relative flex h-2 w-2">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-60" />
//                   <span className="relative inline-flex h-2 w-2 rounded-full bg-green-300" />
//                 </span>

//                 <span className="text-[10px] font-bold uppercase tracking-wider text-green-200">
//                   Open
//                 </span>
//               </div>
//             </div>

//             {/* Description */}

//             <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 xl:text-base xl:leading-7">
//               Form a team, challenge students across Nigeria, improve your
//               UTME score and climb the national leaderboard.
//             </p>

//             {/* Bottom row */}

//             <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
//               <div className="flex flex-wrap items-center gap-4 text-xs text-white/55">
//                 <span className="flex items-center gap-1.5">
//                   <Trophy
//                     size={15}
//                     className="text-yellow-300"
//                   />
//                   Scholarships
//                 </span>

//                 <span className="flex items-center gap-1.5">
//                   <Medal
//                     size={15}
//                     className="text-blue-300"
//                   />
//                   Certificates
//                 </span>

//                 <span className="flex items-center gap-1.5">
//                   <Globe2
//                     size={15}
//                     className="text-indigo-300"
//                   />
//                   National Ranking
//                 </span>
//               </div>

//               <motion.div
//                 whileHover={{
//                   x: 4,
//                 }}
//                 className="flex items-center gap-2 text-sm font-semibold text-blue-200"
//               >
//                 Discover the League
//                 <ArrowRight size={16} />
//               </motion.div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }