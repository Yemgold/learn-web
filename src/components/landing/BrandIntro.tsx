"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const letters = "LEARNYFI".split("");

const directions = [
  "from-left",
  "from-bottom",
  "from-right",
  "from-top",
  "from-right-low",
  "from-top-left",
  "from-bottom-left",
  "from-right-top",
];

export default function BrandIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      if (window.sessionStorage.getItem("learnyfi-brand-intro-seen") === "1") {
        return;
      }
    } catch {
      // Continue without session storage if the browser blocks it.
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      try {
        window.sessionStorage.setItem("learnyfi-brand-intro-seen", "1");
      } catch {}
      return;
    }

    setVisible(true);

    timer = setTimeout(() => {
      setVisible(false);
      try {
        window.sessionStorage.setItem("learnyfi-brand-intro-seen", "1");
      } catch {}
    }, 3400);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const skip = () => {
    setVisible(false);
    try {
      window.sessionStorage.setItem("learnyfi-brand-intro-seen", "1");
    } catch {}
  };

  if (!visible) return null;

  return (
    <div
      className="learnyfi-intro fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#030611] text-white"
      role="dialog"
      aria-label="Learnyfi brand introduction"
      aria-modal="true"
    >
      <div className="learnyfi-intro-grid" aria-hidden="true" />
      <div className="learnyfi-intro-orb learnyfi-intro-orb-a" aria-hidden="true" />
      <div className="learnyfi-intro-orb learnyfi-intro-orb-b" aria-hidden="true" />
      <div className="learnyfi-intro-orb learnyfi-intro-orb-c" aria-hidden="true" />

      <div className="relative z-10 w-full px-4 text-center">
        <div className="mx-auto mb-7 flex max-w-full items-center justify-center gap-[2px] sm:gap-2">
          {letters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className={`learnyfi-intro-letter ${directions[index]}`}
              style={{ animationDelay: `${index * 95}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="learnyfi-intro-rule mx-auto mb-5 h-px w-40 max-w-[50vw] bg-gradient-to-r from-transparent via-cyan-300 to-transparent sm:w-64" />

        <p className="learnyfi-intro-tagline text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-100/75 sm:text-xs sm:tracking-[0.55em]">
          Learn <span className="px-1 text-blue-300">·</span> Practise{" "}
          <span className="px-1 text-blue-300">·</span> Achieve
        </p>

        <div className="learnyfi-intro-loader mx-auto mt-8 h-1 w-36 overflow-hidden rounded-full bg-white/10 sm:w-48">
          <span className="block h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-violet-400" />
        </div>
      </div>

      <div className="absolute bottom-7 left-0 right-0 z-20 flex justify-center px-4">
        <p className="text-[10px] font-medium tracking-[0.22em] text-white/35 sm:text-xs">
          A NEW WAY TO LEARN
        </p>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/70 backdrop-blur-xl transition hover:border-cyan-200/40 hover:bg-white/10 hover:text-white sm:right-7 sm:top-7 sm:px-4"
        aria-label="Skip Learnyfi introduction"
      >
        Skip intro <X className="h-3.5 w-3.5" />
      </button>

      <style jsx>{`
        .learnyfi-intro {
          animation: intro-exit 700ms ease 2.75s forwards;
        }

        .learnyfi-intro-grid {
          position: absolute;
          inset: -30%;
          opacity: 0.16;
          background-image:
            linear-gradient(rgba(125, 211, 252, 0.13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.13) 1px, transparent 1px);
          background-size: 58px 58px;
          transform: perspective(600px) rotateX(58deg) scale(1.5);
          transform-origin: center 70%;
          mask-image: radial-gradient(ellipse at center, black, transparent 66%);
          animation: grid-drift 8s linear infinite;
        }

        .learnyfi-intro-orb {
          position: absolute;
          width: min(48vw, 34rem);
          aspect-ratio: 1;
          border-radius: 9999px;
          filter: blur(85px);
          opacity: 0.25;
          pointer-events: none;
          animation: orb-drift 6s ease-in-out infinite alternate;
        }

        .learnyfi-intro-orb-a {
          left: -12%;
          top: -20%;
          background: #2563eb;
        }

        .learnyfi-intro-orb-b {
          right: -12%;
          bottom: -22%;
          background: #06b6d4;
          animation-delay: -2s;
        }

        .learnyfi-intro-orb-c {
          left: 42%;
          top: 35%;
          width: min(22vw, 15rem);
          background: #7c3aed;
          opacity: 0.16;
          animation-delay: -3s;
        }

        .learnyfi-intro-letter {
          display: inline-block;
          color: #f8fbff;
          font-size: clamp(1.65rem, 8.2vw, 6.8rem);
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.085em;
          opacity: 0;
          text-shadow:
            0 0 20px rgba(103, 232, 249, 0.2),
            0 0 60px rgba(59, 130, 246, 0.15);
          animation: letter-arrive 850ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .learnyfi-intro-letter:nth-child(6),
        .learnyfi-intro-letter:nth-child(8) {
          color: #a5f3fc;
        }

        .from-left { --x: -110vw; --y: -25vh; --r: -40deg; }
        .from-bottom { --x: 0; --y: 110vh; --r: 45deg; }
        .from-right { --x: 110vw; --y: -35vh; --r: 35deg; }
        .from-top { --x: 0; --y: -110vh; --r: -50deg; }
        .from-right-low { --x: 110vw; --y: 30vh; --r: -40deg; }
        .from-top-left { --x: -90vw; --y: -100vh; --r: 55deg; }
        .from-bottom-left { --x: -100vw; --y: 70vh; --r: -45deg; }
        .from-right-top { --x: 100vw; --y: -80vh; --r: 50deg; }

        .learnyfi-intro-rule {
          opacity: 0;
          animation: rule-reveal 500ms ease 1.15s forwards;
        }

        .learnyfi-intro-tagline {
          opacity: 0;
          transform: translateY(10px);
          animation: tagline-reveal 600ms ease 1.25s forwards;
        }

        .learnyfi-intro-loader span {
          width: 0;
          animation: loader-fill 2.5s cubic-bezier(0.7, 0, 0.3, 1) 0.15s forwards;
        }

        @keyframes letter-arrive {
          0% {
            opacity: 0;
            filter: blur(14px);
            transform: translate3d(var(--x), var(--y), 0) scale(0.45) rotate(var(--r));
          }
          72% {
            opacity: 1;
            filter: blur(0);
            transform: translate3d(0, 0, 0) scale(1.1) rotate(0);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translate3d(0, 0, 0) scale(1) rotate(0);
          }
        }

        @keyframes rule-reveal {
          from { opacity: 0; transform: scaleX(0.2); }
          to { opacity: 1; transform: scaleX(1); }
        }

        @keyframes tagline-reveal {
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes loader-fill {
          to { width: 100%; }
        }

        @keyframes grid-drift {
          from { background-position: 0 0; }
          to { background-position: 0 58px; }
        }

        @keyframes orb-drift {
          from { transform: translate3d(-12px, 8px, 0) scale(0.92); }
          to { transform: translate3d(20px, -14px, 0) scale(1.08); }
        }

        @keyframes intro-exit {
          to { opacity: 0; visibility: hidden; pointer-events: none; }
        }

        @media (max-width: 420px) {
          .learnyfi-intro-letter { letter-spacing: -0.095em; }
        }

        @media (prefers-reduced-motion: reduce) {
          .learnyfi-intro,
          .learnyfi-intro * {
            animation-duration: 0.01ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
