



import { ReactNode } from "react";

type LoadingStateProps = {
  variant?: "spinner" | "skeleton" | "table" | "cards" | "page";
  message?: string;
  rows?: number;
  columns?: number;
  cards?: number;
  className?: string;
  children?: ReactNode;
};

function Spinner({ message }: { message: string }) {
  return (
    <div
      className="flex min-h-[180px] flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
}

function TableSkeleton({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white"
      aria-hidden="true"
    >
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="flex-1">
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-4">
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <div key={columnIndex} className="flex-1">
                <Skeleton
                  className={`h-4 ${
                    columnIndex === 0 ? "w-32" : "w-20"
                  }`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardSkeleton({ cards }: { cards: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 bg-white p-5"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>

          <Skeleton className="mt-5 h-8 w-28" />
          <Skeleton className="mt-4 h-3 w-36" />
        </div>
      ))}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <CardSkeleton cards={4} />

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <Skeleton className="mb-5 h-5 w-40" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoadingState({
  variant = "spinner",
  message = "Loading, please wait...",
  rows = 5,
  columns = 4,
  cards = 4,
  className = "",
}: LoadingStateProps) {
  let content: ReactNode;

  switch (variant) {
    case "skeleton":
      content = (
        <div className="space-y-4" aria-hidden="true">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      );
      break;

    case "table":
      content = <TableSkeleton rows={rows} columns={columns} />;
      break;

    case "cards":
      content = <CardSkeleton cards={cards} />;
      break;

    case "page":
      content = <PageSkeleton />;
      break;

    case "spinner":
    default:
      content = <Spinner message={message} />;
      break;
  }

  return (
    <div className={className}>
      {content}
      {variant !== "spinner" && (
        <span className="sr-only" role="status" aria-live="polite">
          {message}
        </span>
      )}
    </div>
  );
}
