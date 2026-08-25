


"use client";

import {
  ArrowRight,
  Check,
  Crown,
  Sparkles,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

export interface AccessPlanCardProps {
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  disabled?: boolean;
  buttonText?: string;
  onSelect?: () => void;
}

/* ============================================================
   ACCESS PLAN CARD
   ============================================================ */

export default function AccessPlanCard({
  name,
  description,
  price,
  duration,
  features,
  popular = false,
  disabled = false,
  buttonText = "Choose Plan",
  onSelect,
}: AccessPlanCardProps) {
  const formattedPrice = new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    },
  ).format(price);

  return (
    <article
      className={[
        "relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition",
        popular
          ? "border-2 border-blue-500 shadow-lg shadow-blue-100/50"
          : "border-slate-200",
        disabled
          ? "opacity-60"
          : "hover:-translate-y-1 hover:shadow-lg",
      ].join(" ")}
    >
      {/* ======================================================
          POPULAR BADGE
         ====================================================== */}

      {popular && (
        <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          <Sparkles className="h-3.5 w-3.5" />

          POPULAR
        </div>
      )}

      {/* ======================================================
          PLAN ICON
         ====================================================== */}

      <div
        className={[
          "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl",
          popular
            ? "bg-blue-100 text-blue-600"
            : "bg-slate-100 text-slate-600",
        ].join(" ")}
      >
        {popular ? (
          <Crown className="h-7 w-7" />
        ) : (
          <Sparkles className="h-7 w-7" />
        )}
      </div>

      {/* ======================================================
          PLAN NAME
         ====================================================== */}

      <h2 className="text-xl font-bold text-slate-900">
        {name}
      </h2>

      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
        {description}
      </p>

      {/* ======================================================
          PRICE
         ====================================================== */}

      <div className="mt-6">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            {formattedPrice}
          </span>

          <span className="mb-1 text-sm font-medium text-slate-500">
            {duration}
          </span>
        </div>
      </div>

      {/* ======================================================
          DIVIDER
         ====================================================== */}

      <div className="my-6 h-px bg-slate-100" />

      {/* ======================================================
          FEATURES
         ====================================================== */}

      <ul className="flex-1 space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-slate-600"
          >
            <span
              className={[
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                popular
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              <Check className="h-3.5 w-3.5" />
            </span>

            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* ======================================================
          ACTION
         ====================================================== */}

      <button
        type="button"
        disabled={disabled}
        onClick={onSelect}
        className={[
          "mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition",
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : popular
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
              : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.98]",
        ].join(" ")}
      >
        {buttonText}

        {!disabled && (
          <ArrowRight className="h-4 w-4" />
        )}
      </button>
    </article>
  );
}
