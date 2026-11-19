



import type { QuestionStatus } from "@/types/schools/question-bank.types";

interface QuestionStatusBadgeProps {
  status: QuestionStatus;
  className?: string;
}

const STATUS_STYLES: Record<
  QuestionStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  },

  PUBLISHED: {
    label: "Published",
    className:
      "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20",
  },

  ARCHIVED: {
    label: "Archived",
    className:
      "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20",
  },
};

export default function QuestionStatusBadge({
  status,
  className = "",
}: QuestionStatusBadgeProps) {
  const normalizedStatus = String(status)
    .toUpperCase() as QuestionStatus;

  const config = STATUS_STYLES[normalizedStatus];

  if (!config) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 ${className}`}
      >
        Unknown
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${config.className} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          normalizedStatus === "PUBLISHED"
            ? "bg-green-500"
            : normalizedStatus === "DRAFT"
              ? "bg-amber-500"
              : "bg-gray-400"
        }`}
      />

      {config.label}
    </span>
  );
}
