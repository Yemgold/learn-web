






"use client";

import { useEffect, useMemo, useState } from "react";
import {
ArrowRight,
Clock3,
Gift,
X,
} from "lucide-react";

const FREE_TRIAL_DAYS = 30;
const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

// The notification will reappear 30 seconds after dismissal.
const REAPPEAR_INTERVAL = 30 * 1000;

interface FreeTrialCardProps {
createdAt?: string | Date | null;
className?: string;
actionHref?: string;
actionLabel?: string;
}

export default function FreeTrialCard({
createdAt,
className = "",
actionHref = "/student/access/secondary",
actionLabel = "Activate Learning Now",
}: FreeTrialCardProps) {
/*

* Calculate the exact trial expiration date from
* the user's original registration date.
  */
  const trialEndsAt = useMemo(() => {
  if (!createdAt) {
  return null;
  }


const registrationTime = new Date(

  createdAt,
).getTime();

if (Number.isNaN(registrationTime)) {
  return null;
}

return (
  registrationTime +
  FREE_TRIAL_DAYS * MILLISECONDS_IN_DAY
);

}, [createdAt]);

/*

* Remaining time in the 30-day trial.
  */
  const [remainingTime, setRemainingTime] = useState(() => {
  if (!trialEndsAt) {
  return 0;
  }


return Math.max(

  0,
  trialEndsAt - Date.now(),
);


});

/*

* Keep the trial countdown updated every second.
  */
  useEffect(() => {
  if (!trialEndsAt) {
  setRemainingTime(0);
  return;
  }


const updateCountdown = () => {

  setRemainingTime(
    Math.max(
      0,
      trialEndsAt - Date.now(),
    ),
  );
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

/*

* Controls whether the notification is visible.
  */
  const [isVisible, setIsVisible] = useState(true);

/*

* Store the timeout so it can be cleaned up
* if the component unmounts.
  */
  const reappearTimeoutRef =
  useMemo(() => ({ current: null as number | null }), []);

/*

* Dismiss the notification for 30 seconds.
  */
  const dismissBanner = () => {
  setIsVisible(false);


if (reappearTimeoutRef.current !== null) {



  window.clearTimeout(
    reappearTimeoutRef.current,
  );
}

reappearTimeoutRef.current =
  window.setTimeout(() => {
    setIsVisible(true);
  }, REAPPEAR_INTERVAL);


};

/*

* Clean up the reappearance timer.
  */
  useEffect(() => {
  return () => {
  if (reappearTimeoutRef.current !== null) {
  window.clearTimeout(
  reappearTimeoutRef.current,
  );
  }
  };
  }, [reappearTimeoutRef]);

const isActive =
trialEndsAt !== null &&
remainingTime > 0;

const isExpired =
trialEndsAt !== null &&
remainingTime <= 0;

/*

* Convert remaining milliseconds into:
* days, hours, minutes and seconds.
  */
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
  (totalSeconds % (60 * 60)) /
    60,
);

const seconds =
  totalSeconds % 60;

return {
  days,
  hours,
  minutes,
  seconds,
};


}, [remainingTime]);

/*

* Don't render anything if the trial
* doesn't exist or has expired.
  */
  if (
  !trialEndsAt ||
  isExpired ||
  !isActive
  ) {
  return null;
  }

/*

* Keep the notification hidden during
* the 30-second dismissal period.
  */
  if (!isVisible) {
  return null;
  }

const totalTrialTime =
FREE_TRIAL_DAYS *
MILLISECONDS_IN_DAY;

const progressPercentage = Math.min(
100,
Math.max(
0,
(remainingTime /
totalTrialTime) *
100,
),
);

return ( <div
   className="
     fixed
     inset-0
     z-[100]
     flex
     items-center
     justify-center
     bg-black/50
     px-4
     backdrop-blur-[2px]
   "
 >
<section
className={`           relative
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-blue-400/20
          bg-slate-950
          shadow-2xl
          shadow-black/60
          ${className}
        `}
>
{/* Decorative background */} <div
       className="
         pointer-events-none
         absolute
         -right-24
         -top-24
         h-64
         w-64
         rounded-full
         bg-blue-500/15
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

    {/* Close button */}
    <button
      type="button"
      onClick={dismissBanner}
      aria-label="Dismiss free trial notification"
      title="Dismiss for 30 seconds"
      className="
        absolute
        right-4
        top-4
        z-20
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-white/10
        bg-white/[0.04]
        text-white/40
        transition
        hover:bg-white/[0.08]
        hover:text-white
      "
    >
      <X className="h-4 w-4" />
    </button>

    <div className="relative p-7 sm:p-8">
      {/* Blinking notification icon */}
      <div
        className="
          relative
          mx-auto
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-2xl
          border
          border-blue-400/20
          bg-blue-500/10
          shadow-xl
          shadow-blue-950/20
          animate-pulse
        "
      >
        <Gift className="h-8 w-8 text-blue-300" />

        {/* Blinking notification dot */}
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span
            className="
              absolute
              inline-flex
              h-full
              w-full
              animate-ping
              rounded-full
              bg-red-400
              opacity-75
            "
          />

          <span
            className="
              relative
              inline-flex
              h-4
              w-4
              rounded-full
              bg-red-500
            "
          />
        </span>
      </div>

      {/* Heading */}
      <div className="mt-5 text-center">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Your Free Trial is Active
        </h2>

        <div className="mt-2 flex justify-center">
          <span
            className="
              rounded-full
              border
              border-emerald-400/20
              bg-emerald-500/10
              px-3
              py-1
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-emerald-300
            "
          >
            30-Day Free Access
          </span>
        </div>

        <p
          className="
            mx-auto
            mt-4
            max-w-sm
            text-sm
            leading-6
            text-white/50
          "
        >
          You currently have free access to Secondary
          learning, practice, and competition features.
        </p>
      </div>

      {/* Countdown */}
      <div
        className="
          mt-7
          rounded-2xl
          border
          border-amber-400/20
          bg-amber-500/[0.06]
          p-5
        "
      >
        <div className="flex items-center justify-center gap-2">
          <Clock3 className="h-4 w-4 text-amber-300" />

          <span
            className="
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-amber-300
            "
          >
            Free Trial Ends In
          </span>
        </div>

        <div className="mt-4 text-center">
          <div
            className="
              text-5xl
              font-black
              tracking-tight
              text-amber-100
            "
          >
            {countdown.days}
          </div>

          <div
            className="
              mt-1
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-amber-300/60
            "
          >
            Days Remaining
          </div>
        </div>

        {/* Hours / Minutes / Seconds */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Hours */}
          <div
            className="
              rounded-xl
              border
              border-amber-400/15
              bg-black/10
              px-2
              py-3
              text-center
            "
          >
            <div className="text-lg font-bold text-amber-100">
              {String(
                countdown.hours,
              ).padStart(2, "0")}
            </div>

            <div
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-wider
                text-amber-300/50
              "
            >
              Hours
            </div>
          </div>

          {/* Minutes */}
          <div
            className="
              rounded-xl
              border
              border-amber-400/15
              bg-black/10
              px-2
              py-3
              text-center
            "
          >
            <div className="text-lg font-bold text-amber-100">
              {String(
                countdown.minutes,
              ).padStart(2, "0")}
            </div>

            <div
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-wider
                text-amber-300/50
              "
            >
              Minutes
            </div>
          </div>

          {/* Seconds */}
          <div
            className="
              rounded-xl
              border
              border-amber-400/15
              bg-black/10
              px-2
              py-3
              text-center
            "
          >
            <div className="text-lg font-bold text-amber-100">
              {String(
                countdown.seconds,
              ).padStart(2, "0")}
            </div>

            <div
              className="
                mt-1
                text-[9px]
                uppercase
                tracking-wider
                text-amber-300/50
              "
            >
              Seconds
            </div>
          </div>
        </div>
      </div>

      {/* Action button */}
     

     <a
  href={actionHref}
  className="
    activate-learning-button
    mt-6
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    bg-blue-500
    px-5
    py-3.5
    text-sm
    font-bold
    text-white
    shadow-lg
    shadow-blue-950/30
    transition
    hover:bg-blue-400
    active:scale-[0.98]
  "
>
  {actionLabel}
  <ArrowRight className="h-4 w-4" />
</a>



      {/* Information */}
      <p
        className="
          mt-4
          text-center
          text-[11px]
          leading-5
          text-white/30
        "
      >
        Your trial is calculated from your original
        registration date and does not restart when
        you log in.
      </p>
    </div>

    {/* Trial progress */}
    <div className="h-1 bg-white/[0.04]">
      <div
        className="
          h-full
          bg-blue-400
          transition-all
          duration-1000
        "
        style={{
          width: `${progressPercentage}%`,
        }}
      />
    </div>
  </section>
</div>


);
}

