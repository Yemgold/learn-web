




"use client";

type StatusSummaryProps = {
  label: string;
  value: number;
  description: string;
  live?: boolean;
};

function StatusSummary({
  label,
  value,
  description,
  live = false,
}: StatusSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>

        {live && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        )}
      </div>

      <p
        className={`mt-2 text-2xl font-black ${
          live
            ? "text-red-600"
            : "text-slate-950"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

type Props = {
  draft: number;
  upcoming: number;
  live: number;
  completed: number;
};

export default function StatusSummarySection({
  draft,
  upcoming,
  live,
  completed,
}: Props) {
  return (
    <section className="mb-8 grid gap-4 md:grid-cols-4">
      <StatusSummary
        label="Draft"
        value={draft}
        description="Still being configured"
      />

      <StatusSummary
        label="Waiting / Upcoming"
        value={upcoming}
        description="Waiting to start"
      />

      <StatusSummary
        label="Live"
        value={live}
        description="Currently running"
        live
      />

      <StatusSummary
        label="Completed"
        value={completed}
        description="Finished competitions"
      />
    </section>
  );
}