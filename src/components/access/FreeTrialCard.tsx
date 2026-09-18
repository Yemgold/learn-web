






"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Gift, ShieldCheck } from "lucide-react";

const FREE_TRIAL_DAYS = 30;
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

interface FreeTrialCardProps {
  createdAt?: string | Date | null;
  className?: string;
}

export default function FreeTrialCard({
  createdAt,
  className = "",
}: FreeTrialCardProps) {
  /* ============================================================
     TRIAL END DATE
     ============================================================ */

  const trialEndsAt = useMemo(() => {
    if (!createdAt) {
      return null;
    }

    const registrationTime = new Date(createdAt).getTime();

    if (Number.isNaN(registrationTime)) {
      return null;
    }

    return (
      registrationTime +
      FREE_TRIAL_DAYS * MILLISECONDS_IN_DAY
    );
  }, [createdAt]);

  /* ============================================================
     REMAINING TIME
     ============================================================ */

  const [remainingTime, setRemainingTime] = useState(() => {
    if (!trialEndsAt) {
      return 0;
    }

    return Math.max(0, trialEndsAt - Date.now());
  });

  /* ============================================================
     COUNTDOWN
     ============================================================ */

  useEffect(() => {
    if (!trialEndsAt) {
      setRemainingTime(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        trialEndsAt - Date.now(),
      );

      setRemainingTime(remaining);
    };

    updateCountdown();

    const interval = window.setInterval(
      updateCountdown,
      1000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [trialEndsAt]);

  /* ============================================================
     TRIAL STATUS
     ============================================================ */

  const isActive =
    trialEndsAt !== null &&
    remainingTime > 0;

  const isExpired =
    trialEndsAt !== null &&
    remainingTime <= 0;

  /* ============================================================
     COUNTDOWN VALUES
     ============================================================ */

  const countdown = useMemo(() => {
    const totalSeconds = Math.floor(
      remainingTime / 1000,
    );

    const days = Math.floor(
      totalSeconds / (24 * 60 * 60),
    );

    const hours = Math.floor(
      (totalSeconds % (24 * 60 * 60)) /
        (60 * 60),
    );

    const minutes = Math.floor(
      (totalSeconds % (60 * 60)) / 60,
    );

    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }, [remainingTime]);

  /* ============================================================
     NO REGISTRATION DATE
     ============================================================ */

  if (!trialEndsAt) {
    return null;
  }

  /* ============================================================
     EXPIRED
     ============================================================ */

  if (isExpired) {
    return (
      <section
        className={`
          rounded-3xl
          border
          border-amber-400/20
          bg-amber-500/[0.06]
          p-5
          backdrop-blur-sm
          ${className}
        `}
      >
        <div className="flex items-center gap-3">
          <Clock3 className="h-5 w-5 shrink-0 text-amber-300" />

          <div>
            <h2 className="font-semibold text-white">
              Your free access has expired
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Choose a Secondary plan to continue using
              Secondary learning and practice features.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ============================================================
     ACTIVE TRIAL
     ============================================================ */

  if (!isActive) {
    return null;
  }

  return (
    <section
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        border-blue-400/20
        bg-blue-500/[0.08]
        p-6
        shadow-2xl
        shadow-blue-950/20
        backdrop-blur-sm
        sm:p-8
        ${className}
      `}
    >
      {/* ========================================================
          BACKGROUND GLOW
         ======================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-blue-500/20
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-24
          h-64
          w-64
          rounded-full
          bg-purple-500/10
          blur-3xl
        "
      />

      <div className="relative">
        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* ==================================================
              TRIAL INFORMATION
             ================================================== */}

          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-blue-400/20
                bg-blue-500/10
                shadow-lg
                shadow-blue-950/20
              "
            >
              <Gift className="h-7 w-7 text-blue-300" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className="
                    text-lg
                    font-bold
                    text-white
                    sm:text-xl
                  "
                >
                  Your 30-Day Free Trial
                </h2>

                <span
                  className="
                    rounded-full
                    border
                    border-emerald-400/20
                    bg-emerald-500/10
                    px-2.5
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-emerald-300
                  "
                >
                  Active
                </span>
              </div>

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-white/55
                "
              >
                You currently have free access to Secondary
                learning, practice, and competition features.
              </p>

              <p className="mt-2 text-xs text-white/35">
                Your trial started from your original
                registration date.
              </p>
            </div>
          </div>

          {/* ==================================================
              COUNTDOWN
             ================================================== */}

          <div
            className="
              shrink-0
              rounded-3xl
              border
              border-amber-400/20
              bg-black/10
              p-4
              shadow-xl
              shadow-black/10
              sm:p-5
            "
          >
            {/* Countdown title */}

            <div
              className="
                mb-3
                flex
                items-center
                gap-2
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-amber-300
              "
            >
              <Clock3 className="h-4 w-4" />

              <span>Free Trial Ends In</span>
            </div>

            {/* ==================================================
                LARGE DAYS REMAINING
               ================================================== */}

            <div
              className="
                mb-4
                rounded-2xl
                border
                border-amber-400/20
                bg-amber-500/[0.08]
                px-5
                py-4
                text-center
              "
            >
              <div
                className="
                  text-4xl
                  font-black
                  leading-none
                  tracking-tight
                  text-amber-100
                  sm:text-5xl
                "
              >
                {countdown.days}
              </div>

              <div
                className="
                  mt-2
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-amber-300
                "
              >
                Days Remaining
              </div>
            </div>

            {/* ==================================================
                HOURS / MINUTES / SECONDS
               ================================================== */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-1.5
                sm:gap-2
              "
            >
              {/* Hours */}

              <div
                className="
                  min-w-[58px]
                  rounded-xl
                  border
                  border-amber-400/20
                  bg-amber-500/[0.06]
                  px-2.5
                  py-2.5
                  text-center
                  sm:min-w-[64px]
                "
              >
                <div
                  className="
                    text-lg
                    font-bold
                    text-amber-100
                    sm:text-xl
                  "
                >
                  {String(countdown.hours).padStart(2, "0")}
                </div>

                <div
                  className="
                    mt-0.5
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-amber-300/60
                  "
                >
                  Hours
                </div>
              </div>

              <span className="text-amber-400/40">
                :
              </span>

              {/* Minutes */}

              <div
                className="
                  min-w-[58px]
                  rounded-xl
                  border
                  border-amber-400/20
                  bg-amber-500/[0.06]
                  px-2.5
                  py-2.5
                  text-center
                  sm:min-w-[64px]
                "
              >
                <div
                  className="
                    text-lg
                    font-bold
                    text-amber-100
                    sm:text-xl
                  "
                >
                  {String(countdown.minutes).padStart(2, "0")}
                </div>

                <div
                  className="
                    mt-0.5
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-amber-300/60
                  "
                >
                  Minutes
                </div>
              </div>

              <span className="text-amber-400/40">
                :
              </span>

              {/* Seconds */}

              <div
                className="
                  min-w-[58px]
                  rounded-xl
                  border
                  border-amber-400/20
                  bg-amber-500/[0.06]
                  px-2.5
                  py-2.5
                  text-center
                  sm:min-w-[64px]
                "
              >
                <div
                  className="
                    text-lg
                    font-bold
                    text-amber-100
                    sm:text-xl
                  "
                >
                  {String(countdown.seconds).padStart(2, "0")}
                </div>

                <div
                  className="
                    mt-0.5
                    text-[9px]
                    uppercase
                    tracking-wider
                    text-amber-300/60
                  "
                >
                  Seconds
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            TRIAL REMINDER
           ====================================================== */}

        <div
          className="
            mt-6
            flex
            items-start
            gap-2
            rounded-2xl
            border
            border-white/5
            bg-white/[0.02]
            px-4
            py-3
            text-xs
            text-white/40
          "
        >
          <ShieldCheck
            className="
              mt-0.5
              h-4
              w-4
              shrink-0
              text-blue-300/70
            "
          />

          <p>
            Your free Secondary access is calculated from
            your original registration date and does not
            restart when you log in.
          </p>
        </div>
      </div>
    </section>
  );
}
