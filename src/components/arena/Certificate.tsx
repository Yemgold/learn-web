




// "use client";

// import { motion } from "framer-motion";
// import {
//   Award,
//   CheckCircle2,
//   Download,
//   Home,
//   RotateCcw,
//   Share2,
//   Star,
//   Trophy,
// } from "lucide-react";

// interface CertificateProps {
//   studentName: string;
//   subject: string;
//   topic: string;
//   correctAnswers: number;
//   totalQuestions: number;
//   completedAt?: string | Date;
//   onRetry?: () => void;
//   onContinue?: () => void;
// }

// export default function Certificate({
//   studentName,
//   subject,
//   topic,
//   correctAnswers,
//   totalQuestions,
//   completedAt = new Date(),
//   onRetry,
//   onContinue,
// }: CertificateProps) {
//   const isPerfect =
//     totalQuestions > 0 &&
//     correctAnswers === totalQuestions;

//   const percentage =
//     totalQuestions > 0
//       ? Math.round((correctAnswers / totalQuestions) * 100)
//       : 0;

//   const formattedDate = new Intl.DateTimeFormat("en-NG", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(new Date(completedAt));

//   /*
//    * Certificate of Excellence is ONLY awarded
//    * when every question has been answered correctly.
//    */
//   if (!isPerfect) {
//     return (
//       <motion.section
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="mx-auto w-full max-w-3xl"
//       >
//         <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
//           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
//             <Trophy className="h-10 w-10 text-slate-400" />
//           </div>

//           <h2 className="mt-6 text-2xl font-bold text-slate-900">
//             Topic Completed
//           </h2>

//           <p className="mx-auto mt-3 max-w-xl text-slate-600">
//             You completed{" "}
//             <span className="font-semibold text-slate-900">
//               {subject} — {topic}
//             </span>
//             .
//           </p>

//           <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-2xl font-bold text-slate-900">
//                 {correctAnswers}
//               </p>
//               <p className="mt-1 text-xs font-medium text-slate-500">
//                 Correct
//               </p>
//             </div>

//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-2xl font-bold text-slate-900">
//                 {totalQuestions}
//               </p>
//               <p className="mt-1 text-xs font-medium text-slate-500">
//                 Questions
//               </p>
//             </div>

//             <div className="rounded-2xl bg-slate-50 p-4">
//               <p className="text-2xl font-bold text-slate-900">
//                 {percentage}%
//               </p>
//               <p className="mt-1 text-xs font-medium text-slate-500">
//                 Score
//               </p>
//             </div>
//           </div>

//           <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
//             <p className="font-semibold text-slate-800">
//               🏆 Certificate of Excellence
//             </p>

//             <p className="mt-1 text-sm text-slate-500">
//               Get {totalQuestions}/{totalQuestions} questions correct
//               to unlock your certificate.
//             </p>
//           </div>

//           {onRetry && (
//             <button
//               type="button"
//               onClick={onRetry}
//               className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
//             >
//               <RotateCcw className="h-4 w-4" />
//               Retry Topic
//             </button>
//           )}
//         </div>
//       </motion.section>
//     );
//   }

//   return (
//     <motion.section
//       initial={{ opacity: 0, scale: 0.92 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{
//         duration: 0.6,
//         ease: "easeOut",
//       }}
//       className="mx-auto w-full max-w-5xl"
//     >
//       Celebration
//       <motion.div
//         initial={{ opacity: 0, y: -15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.25 }}
//         className="mb-8 text-center"
//       >
//         <div className="mb-4 flex justify-center">
//           <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
//             <Trophy className="h-10 w-10 text-amber-500" />
//           </div>
//         </div>

//         <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//           🎉 Outstanding!
//         </h1>

//         <p className="mt-2 text-slate-600">
//           You mastered every question in this topic.
//         </p>
//       </motion.div>

//       {/* Certificate */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.35 }}
//         className="relative overflow-hidden rounded-[2rem] border-8 border-slate-900 bg-white shadow-2xl"
//       >
//         {/* Decorative inner border */}
//         <div className="pointer-events-none absolute inset-4 rounded-2xl border-2 border-amber-400/70" />

//         {/* Decorative corners */}
//         <div className="absolute left-8 top-8">
//           <Star className="h-7 w-7 text-amber-400" />
//         </div>

//         <div className="absolute right-8 top-8">
//           <Star className="h-7 w-7 text-amber-400" />
//         </div>

//         <div className="absolute bottom-8 left-8">
//           <Star className="h-7 w-7 text-amber-400" />
//         </div>

//         <div className="absolute bottom-8 right-8">
//           <Star className="h-7 w-7 text-amber-400" />
//         </div>

//         <div className="relative px-8 py-14 text-center sm:px-16 sm:py-16">
//           {/* Brand */}
//           <div className="flex items-center justify-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
//               <Award className="h-7 w-7" />
//             </div>

//             <div className="text-left">
//               <p className="text-lg font-black tracking-tight text-slate-900">
//                 JAMB LEAGUE
//               </p>

//               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
//                 Learn • Practice • Compete
//               </p>
//             </div>
//           </div>

//           {/* Certificate title */}
//           <div className="mt-12">
//             <p className="text-sm font-bold uppercase tracking-[0.35em] text-slate-500">
//               Certificate of
//             </p>

//             <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">
//               Excellence
//             </h2>
//           </div>

//           {/* Student */}
//           <div className="mt-10">
//             <p className="text-sm text-slate-500">
//               This certificate is proudly presented to
//             </p>

//             <h3 className="mt-4 text-3xl font-black text-blue-700 sm:text-4xl">
//               {studentName}
//             </h3>

//             <div className="mx-auto mt-4 h-px max-w-md bg-slate-200" />
//           </div>

//           {/* Achievement */}
//           <div className="mx-auto mt-8 max-w-2xl">
//             <p className="text-base leading-7 text-slate-600">
//               For demonstrating exceptional mastery by answering
//               every question correctly in
//             </p>

//             <p className="mt-4 text-xl font-black text-slate-900">
//               {subject}
//             </p>

//             <p className="mt-1 text-lg font-semibold text-blue-600">
//               {topic}
//             </p>
//           </div>

//           {/* Score */}
//           <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-3">
//             <div className="rounded-2xl bg-slate-50 p-4">
//               <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-500" />

//               <p className="mt-2 text-xl font-black text-slate-900">
//                 {correctAnswers}/{totalQuestions}
//               </p>

//               <p className="text-xs font-medium text-slate-500">
//                 Correct
//               </p>
//             </div>

//             <div className="rounded-2xl bg-blue-50 p-4">
//               <Trophy className="mx-auto h-6 w-6 text-blue-600" />

//               <p className="mt-2 text-xl font-black text-blue-700">
//                 {percentage}%
//               </p>

//               <p className="text-xs font-medium text-slate-500">
//                 Score
//               </p>
//             </div>

//             <div className="rounded-2xl bg-amber-50 p-4">
//               <Star className="mx-auto h-6 w-6 text-amber-500" />

//               <p className="mt-2 text-xl font-black text-slate-900">
//                 EXCELLENT
//               </p>

//               <p className="text-xs font-medium text-slate-500">
//                 Achievement
//               </p>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-slate-200 pt-8 sm:flex-row">
//             <div className="text-left">
//               <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
//                 Completed
//               </p>

//               <p className="mt-1 font-semibold text-slate-700">
//                 {formattedDate}
//               </p>
//             </div>

//             <div>
//               <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-300 bg-amber-50">
//                 <Award className="h-8 w-8 text-amber-500" />
//               </div>

//               <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
//                 Verified Achievement
//               </p>
//             </div>

//             <div className="text-left sm:text-right">
//               <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
//                 JAMB League
//               </p>

//               <p className="mt-1 font-semibold text-slate-700">
//                 Excellence Award
//               </p>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Actions */}
//       <motion.div
//         initial={{ opacity: 0, y: 15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6 }}
//         className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
//       >
//         <button
//           type="button"
//           onClick={() => window.print()}
//           className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
//         >
//           <Download className="h-4 w-4" />
//           Print / Save Certificate
//         </button>

//         <button
//           type="button"
//           onClick={async () => {
//             if (navigator.share) {
//               await navigator.share({
//                 title: "JAMB League Certificate of Excellence",
//                 text: `${studentName} achieved 100% in ${subject} — ${topic}.`,
//               });
//             }
//           }}
//           className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-100"
//         >
//           <Share2 className="h-4 w-4" />
//           Share Achievement
//         </button>

//         {onContinue && (
//           <button
//             type="button"
//             onClick={onContinue}
//             className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
//           >
//             Continue Learning
//             <span aria-hidden="true">→</span>
//           </button>
//         )}
//       </motion.div>

//       <p className="mt-5 text-center text-xs text-slate-400">
//         JAMB League • Excellence is earned through mastery.
//       </p>
//     </motion.section>
//   );
// }






"use client";

import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Download,
  RotateCcw,
  Share2,
  Star,
  Trophy,
} from "lucide-react";

interface CertificateProps {
  studentName: string;
  subject: string;
  topic: string;
  correctAnswers: number;
  totalQuestions: number;
  completedAt?: string | Date;
  onRetry?: () => void;
  onContinue?: () => void;
}

export default function Certificate({
  studentName,
  subject,
  topic,
  correctAnswers,
  totalQuestions,
  completedAt = new Date(),
  onRetry,
  onContinue,
}: CertificateProps) {
  const isPerfect =
    totalQuestions > 0 &&
    correctAnswers === totalQuestions;

  const percentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  const formattedDate = new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(completedAt));

  /*
   * --------------------------------------------------------------------------
   * LOCKED CERTIFICATE
   * --------------------------------------------------------------------------
   *
   * The student only gets the real Certificate of Excellence
   * when every question is answered correctly.
   */

  if (!isPerfect) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-3xl"
      >
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Trophy */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.15,
              type: "spring",
              stiffness: 180,
            }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5"
          >
            <Trophy className="h-11 w-11 text-slate-400" />
          </motion.div>

          {/* Heading */}
          <h2 className="mt-7 text-3xl font-black text-white">
            Topic Complete
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            You completed{" "}
            <span className="font-bold text-white">
              {subject} — {topic}
            </span>
            .
          </p>

          {/* Score cards */}
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-black text-white">
                {correctAnswers}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Correct
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-black text-white">
                {totalQuestions}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Questions
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-2xl font-black text-white">
                {percentage}%
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Score
              </p>
            </div>
          </div>

          {/* Certificate locked */}
          <div className="mt-8 rounded-2xl border border-dashed border-amber-400/30 bg-amber-400/[0.04] p-6">
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="text-4xl"
            >
              🏆
            </motion.div>

            <p className="mt-3 font-bold text-white">
              Certificate of Excellence
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Answer every question correctly to unlock
              your Certificate of Excellence for this topic.
            </p>

            <div className="mt-4 text-sm font-bold text-amber-300">
              {correctAnswers}/{totalQuestions} correct
            </div>
          </div>

          {/* Retry */}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:scale-[1.02] hover:bg-blue-500"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Topic
            </button>
          )}
        </div>
      </motion.section>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * PERFECT SCORE / CERTIFICATE OF EXCELLENCE
   * --------------------------------------------------------------------------
   */

  return (
    <motion.section
      initial={{
        opacity: 0,
        scale: 0.94,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="mx-auto w-full max-w-6xl"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Celebration header                                                 */}
      {/* ------------------------------------------------------------------ */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.2,
          duration: 0.5,
        }}
        className="mb-8 text-center"
      >
        {/* Animated trophy */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -3, 3, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/10 shadow-lg shadow-amber-500/10"
        >
          <Trophy className="h-10 w-10 text-amber-400" />
        </motion.div>

        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          🎉 Outstanding!
        </h1>

        <p className="mt-2 text-slate-400">
          You mastered every question in this topic.
        </p>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Certificate                                                        */}
      {/* ------------------------------------------------------------------ */}

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
          delay: 0.35,
          duration: 0.7,
        }}
        className="relative overflow-hidden rounded-[2rem] border-[6px] border-slate-900 bg-white shadow-2xl sm:border-8"
      >
        {/* ================================================================ */}
        {/* Decorative background                                            */}
        {/* ================================================================ */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Top glow */}
          <div className="absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl" />

          {/* Right glow */}
          <div className="absolute right-0 top-1/2 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />
        </div>

        {/* ================================================================ */}
        {/* Inner border                                                      */}
        {/* ================================================================ */}

        <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border-2 border-amber-400/70 sm:inset-5" />

        <div className="pointer-events-none absolute inset-5 rounded-[1.25rem] border border-blue-200/70 sm:inset-7" />

        {/* ================================================================ */}
        {/* Decorative stars                                                  */}
        {/* ================================================================ */}

        <motion.div
          animate={{
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute left-8 top-8 text-amber-400 sm:left-12 sm:top-12"
        >
          <Star className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, -8, 8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute right-8 top-8 text-amber-400 sm:right-12 sm:top-12"
        >
          <Star className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute bottom-8 left-8 text-amber-400 sm:bottom-12 sm:left-12"
        >
          <Star className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, -8, 8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute bottom-8 right-8 text-amber-400 sm:bottom-12 sm:right-12"
        >
          <Star className="h-6 w-6 fill-current sm:h-7 sm:w-7" />
        </motion.div>

        {/* ================================================================ */}
        {/* Certificate content                                              */}
        {/* ================================================================ */}

        <div className="relative px-7 py-12 text-center sm:px-16 sm:py-16 md:px-20">
          {/* -------------------------------------------------------------- */}
          {/* Brand                                                           */}
          {/* -------------------------------------------------------------- */}

          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            className="flex items-center justify-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Award className="h-7 w-7" />
            </div>

            <div className="text-left">
              <p className="text-lg font-black tracking-tight text-slate-900">
                JAMB LEAGUE
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-xs sm:tracking-[0.2em]">
                Learn • Practice • Compete
              </p>
            </div>
          </motion.div>

          {/* -------------------------------------------------------------- */}
          {/* Certificate title                                               */}
          {/* -------------------------------------------------------------- */}

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
              delay: 0.6,
            }}
            className="mt-10 sm:mt-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500 sm:text-sm sm:tracking-[0.35em]">
              Certificate of
            </p>

            <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Excellence
            </h2>

            <div className="mx-auto mt-4 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-amber-400 sm:w-20" />

              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

              <div className="h-px w-12 bg-amber-400 sm:w-20" />
            </div>
          </motion.div>

          {/* -------------------------------------------------------------- */}
          {/* Student name                                                    */}
          {/* -------------------------------------------------------------- */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.75,
              duration: 0.5,
            }}
            className="mt-9 sm:mt-10"
          >
            <p className="text-xs text-slate-500 sm:text-sm">
              This certificate is proudly presented to
            </p>

            <h3 className="mt-4 break-words px-4 text-3xl font-black text-blue-700 sm:text-4xl md:text-5xl">
              {studentName}
            </h3>

            <div className="mx-auto mt-4 h-px max-w-md bg-slate-200" />
          </motion.div>

          {/* -------------------------------------------------------------- */}
          {/* Achievement statement                                           */}
          {/* -------------------------------------------------------------- */}

          <div className="mx-auto mt-8 max-w-2xl">
            <p className="text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              For demonstrating exceptional mastery by
              answering every question correctly in
            </p>

            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.9,
              }}
              className="mt-5 text-xl font-black text-slate-900 sm:text-2xl"
            >
              {subject}
            </motion.p>

            <p className="mt-1 text-lg font-semibold text-blue-600 sm:text-xl">
              {topic}
            </p>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Score section                                                   */}
          {/* -------------------------------------------------------------- */}

          <div className="mx-auto mt-9 grid max-w-xl grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-3">
            {/* Correct */}
            <div className="rounded-2xl bg-slate-50 p-4">
              <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-500" />

              <p className="mt-2 text-xl font-black text-slate-900">
                {correctAnswers}/{totalQuestions}
              </p>

              <p className="text-xs font-medium text-slate-500">
                Correct
              </p>
            </div>

            {/* Score */}
            <div className="rounded-2xl bg-blue-50 p-4">
              <Trophy className="mx-auto h-6 w-6 text-blue-600" />

              <p className="mt-2 text-xl font-black text-blue-700">
                {percentage}%
              </p>

              <p className="text-xs font-medium text-slate-500">
                Score
              </p>
            </div>

            {/* Achievement */}
            <div className="rounded-2xl bg-amber-50 p-4">
              <Star className="mx-auto h-6 w-6 fill-amber-400 text-amber-500" />

              <p className="mt-2 text-lg font-black text-slate-900 sm:text-xl">
                EXCELLENT
              </p>

              <p className="text-xs font-medium text-slate-500">
                Achievement
              </p>
            </div>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Footer                                                          */}
          {/* -------------------------------------------------------------- */}

          <div className="mt-10 flex flex-col items-center justify-between gap-7 border-t border-slate-200 pt-8 sm:mt-12 sm:flex-row">
            {/* Date */}
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                Completed
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {formattedDate}
              </p>
            </div>

            {/* Verification seal */}
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber-300 bg-amber-50">
                <Award className="h-8 w-8 text-amber-500" />
              </div>

              <p className="mt-2 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Verified Achievement
              </p>
            </div>

            {/* Award */}
            <div className="text-center sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                JAMB League
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                Excellence Award
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* ACTIONS                                                            */}
      {/* ------------------------------------------------------------------ */}

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
          delay: 1,
        }}
        className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
      >
        {/* Print / Save */}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 hover:scale-[1.02]"
        >
          <Download className="h-4 w-4" />
          Print / Save Certificate
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={async () => {
            const shareText =
              `${studentName} achieved 100% in ` +
              `${subject} — ${topic} on JAMB League.`;

            if (
              typeof navigator !== "undefined" &&
              navigator.share
            ) {
              try {
                await navigator.share({
                  title:
                    "JAMB League Certificate of Excellence",
                  text: shareText,
                });
              } catch {
                // User cancelled the share dialog.
              }
            } else if (
              typeof navigator !== "undefined" &&
              navigator.clipboard
            ) {
              try {
                await navigator.clipboard.writeText(
                  shareText
                );

                alert(
                  "Achievement copied to clipboard."
                );
              } catch {
                // Clipboard unavailable.
              }
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 font-semibold text-blue-300 transition hover:bg-blue-500/20 hover:scale-[1.02]"
        >
          <Share2 className="h-4 w-4" />
          Share Achievement
        </button>

        {/* Continue */}
        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 hover:scale-[1.02]"
          >
            Continue Learning
            <span aria-hidden="true">→</span>
          </button>
        )}
      </motion.div>

      <p className="mt-5 text-center text-xs text-slate-500">
        JAMB League • Excellence is earned through mastery.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* Print styles                                                       */}
      {/* ------------------------------------------------------------------ */}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          .certificate-print-area,
          .certificate-print-area * {
            visibility: visible;
          }
        }
      `}</style>
    </motion.section>
  );
}