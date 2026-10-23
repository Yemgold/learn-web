







"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const PIXEL_ID = "1108308785255401";
const CONSENT_KEY = "learnyfi-advertising-consent";

type MetaPixelFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: MetaPixelFunction;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<boolean | null>(null);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    try {
      const savedConsent = window.localStorage.getItem(CONSENT_KEY);

      if (savedConsent === "accepted") {
        setConsent(true);
      } else if (savedConsent === "rejected") {
        setConsent(false);
      }
    } catch {
      setConsent(false);
    }
  }, []);

  useEffect(() => {
    if (consent !== true || !pathname) return;

    let fbq = window.fbq;

    if (!fbq) {
      const pixel = ((...args: unknown[]) => {
        if (pixel.callMethod) {
          pixel.callMethod(...args);
        } else {
          pixel.queue.push(args);
        }
      }) as MetaPixelFunction;

      pixel.queue = [];
      pixel.loaded = true;
      pixel.version = "2.0";
      pixel.push = pixel;

      window.fbq = pixel;
      window._fbq = pixel;

      fbq = pixel;

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.id = "learnyfi-meta-pixel-script";

      document.head.appendChild(script);

      fbq("init", PIXEL_ID);
    }

    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      fbq("track", "PageView");
    }
  }, [consent, pathname]);

  function saveConsent(accepted: boolean) {
    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        accepted ? "accepted" : "rejected",
      );
    } catch {
      // If consent cannot be saved, do not activate tracking.
      setConsent(false);
      return;
    }

    setConsent(accepted);
  }

  if (consent !== null) return null;

  return (
    <aside
      role="dialog"
      aria-label="Advertising cookie preferences"
      aria-describedby="learnyfi-cookie-description"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white p-4 shadow-2xl sm:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold text-slate-900">
            Your privacy matters
          </h2>

          <p
            id="learnyfi-cookie-description"
            className="mt-1 text-sm leading-6 text-slate-600"
          >
            Learnyfi would like to use advertising cookies to measure
            website visits and help show relevant Learnyfi advertisements
            on Facebook and Instagram. You can reject optional advertising
            tracking and continue using the website.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => saveConsent(false)}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reject
          </button>

          <button
            type="button"
            onClick={() => saveConsent(true)}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Accept advertising cookies
          </button>
        </div>
      </div>
    </aside>
  );
}
