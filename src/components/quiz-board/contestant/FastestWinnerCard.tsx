
"use client";

import {
  Crown,
  Trophy,
  Zap,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";

interface FastestWinnerCardProps {
  winnerName?: string | null;
  winnerEmail?: string | null;
  timeTakenInSeconds?: number | null;
  showEmail?: boolean;
  title?: string;
  message?: string;
  duration?: number;
  className?: string;
}

export function FastestWinnerCard({
  winnerName,
  winnerEmail,
  timeTakenInSeconds,
  showEmail = false,
  title = "Fastest Correct Answer",
  message = "Answered correctly before everyone else.",
  duration = 10000,
  className = "",
}: FastestWinnerCardProps) {
  const [visible, setVisible] = useState(true);

  /*
   * Reset visibility whenever a new winner arrives.
   */
  useEffect(() => {
    if (!winnerName && !winnerEmail) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    winnerName,
    winnerEmail,
    timeTakenInSeconds,
    duration,
  ]);

  /*
   * Do not display if there is no winner.
   */
  if (!winnerName && !winnerEmail) {
    return null;
  }

  /*
   * Hide after the timer expires.
   */
  if (!visible) {
    return null;
  }

  const displayName =
    winnerName?.trim() ||
    winnerEmail?.trim() ||
    "Contestant";

  return (
    <div
      className={[
        "relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl",
        "border border-yellow-400/20",
        "bg-gradient-to-b from-yellow-400/[0.10] via-yellow-500/[0.05] to-slate-950/80",
        "p-5",
        "shadow-xl shadow-yellow-950/20",
        "animate-in fade-in zoom-in-95 duration-300",
        className,
      ].join(" ")}
    >
      {/* ============================================================
          DECORATIVE GLOW
          ============================================================ */}

      <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-yellow-400/5 blur-3xl" />

      {/* ============================================================
          CONTENT
          ============================================================ */}

      <div className="relative flex flex-col items-center text-center">

        {/* TROPHY */}

        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 shadow-lg shadow-yellow-950/20">
          <Trophy className="h-10 w-10 text-yellow-400" />
        </div>

        {/* TITLE */}

        <div className="mt-4 flex items-center justify-center gap-2">
          <Crown className="h-4 w-4 text-yellow-400" />

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">
            {title}
          </p>

          <Crown className="h-4 w-4 text-yellow-400" />
        </div>

        {/* WINNER NAME */}

        <h3 className="mt-2 max-w-full truncate px-2 text-xl font-extrabold text-white">
          {displayName}
        </h3>

        {/* EMAIL */}

        {showEmail && winnerEmail ? (
          <p className="mt-1 max-w-full truncate px-2 text-xs text-slate-400">
            {winnerEmail}
          </p>
        ) : null}

        {/* FASTEST BADGE */}

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2">
          <Zap className="h-4 w-4 text-yellow-400" />

          <span className="text-xs font-extrabold uppercase tracking-wider text-yellow-400">
            FASTEST
          </span>
        </div>

        {/* RESPONSE TIME */}

        {timeTakenInSeconds != null ? (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-300">
            <Timer className="h-4 w-4 text-yellow-400" />

            <span>
              Answered in{" "}
              <span className="font-bold text-white">
                {timeTakenInSeconds}s
              </span>
            </span>
          </div>
        ) : null}

        {/* MESSAGE */}

        <div className="mt-4 w-full rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
          <p className="text-xs leading-5 text-slate-400">
            {message}
          </p>
        </div>

      </div>
    </div>
  );
}

export default FastestWinnerCard;








// // src\components\quiz-board\contestant\FastestWinnerCard.tsx

// "use client";

// import {
//   Crown,
//   Trophy,
//   Zap,
// } from "lucide-react";

// interface FastestWinnerCardProps {
//   winnerName?: string | null;
//   winnerEmail?: string | null;
//   showEmail?: boolean;
//   title?: string;
//   message?: string;
//   className?: string;
// }

// export function FastestWinnerCard({
//   winnerName,
//   winnerEmail,
//   showEmail = false,
//   title = "Fastest Correct Answer",
//   message = "Answered correctly before everyone else.",
//   className = "",
// }: FastestWinnerCardProps) {
//   /*
//    * Do not display the card if there is no winner yet.
//    */
//   if (!winnerName && !winnerEmail) {
//     return null;
//   }

//   const displayName =
//     winnerName?.trim() ||
//     winnerEmail?.trim() ||
//     "Contestant";

//   return (
//     <div
//       className={[
//         "relative overflow-hidden rounded-2xl",
//         "border border-yellow-500/20",
//         "bg-yellow-500/[0.06]",
//         "p-4",
//         "shadow-lg shadow-yellow-950/10",
//         className,
//       ].join(" ")}
//     >
//       {/* Glow */}
//       <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-yellow-400/10 blur-2xl" />

//       <div className="relative flex items-center gap-3">
//         {/* Trophy */}
//         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/10">
//           <Trophy className="h-6 w-6 text-yellow-400" />
//         </div>

//         {/* Content */}
//         <div className="min-w-0 flex-1">
//           <div className="flex items-center gap-2">
//             <Crown className="h-4 w-4 shrink-0 text-yellow-400" />

//             <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
//               {title}
//             </p>
//           </div>

//           <h3 className="mt-1 truncate text-base font-bold text-white">
//             {displayName}
//           </h3>

//           {showEmail && winnerEmail ? (
//             <p className="mt-0.5 truncate text-xs text-slate-400">
//               {winnerEmail}
//             </p>
//           ) : null}
//         </div>

//         {/* Fastest indicator */}
//         <div className="flex shrink-0 items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1">
//           <Zap className="h-3.5 w-3.5 text-yellow-400" />

//           <span className="text-[11px] font-bold text-yellow-400">
//             FASTEST
//           </span>
//         </div>
//       </div>

//       {/* Message */}
//       <div className="relative mt-3 rounded-xl border border-white/5 bg-black/10 px-3 py-2">
//         <p className="text-xs leading-5 text-slate-400">
//           {message}
//         </p>
//       </div>
//     </div>
//   );
// }

// export default FastestWinnerCard;
