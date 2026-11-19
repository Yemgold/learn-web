




import type {
  AcademicSession,
} from "@/lib/schools/portal/services/academicsessions";

import type {
  AcademicPeriod,
} from "@/lib/schools/portal/services/academicperiods";

export const EMPTY_PERIOD_FORM = {
  periodName: "",
  periodNumber: "1",
  startDate: "",
  endDate: "",
};

export function getSessionId(
  session: AcademicSession
): string {
  return String(
    session._id ||
      session.id ||
      session.academicSessionId ||
      ""
  );
}

export function getSessionName(
  session: AcademicSession
): string {
  return (
    session.sessionName ||
    session.name ||
    session.academicYear ||
    session.year ||
    session.title ||
    "Unnamed academic session"
  );
}

export function getPeriodId(
  period: AcademicPeriod
): string {
  return String(period._id || period.id || "");
}

export function getPeriodName(
  period: AcademicPeriod
): string {
  return (
    period.periodName ||
    period.name ||
    (period.periodNumber
      ? `Period ${period.periodNumber}`
      : "Unnamed period")
  );
}

export function getPeriodTypeLabel(
  session: AcademicSession | null
): string {
  if (!session?.periodType) {
    return "Academic period";
  }

  return session.periodType === "SEMESTER"
    ? "Semester"
    : "Term";
}

export function formatAcademicDate(
  date?: string
): string {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getFriendlyError(
  error: unknown,
  fallback: string
): string {
  if (
    error instanceof Error &&
    error.message.trim()
  ) {
    return error.message;
  }

  return fallback;
}

export function getNextPeriodNumber(
  periods: AcademicPeriod[]
): number {
  const numbers = periods
    .map((period) => Number(period.periodNumber))
    .filter(
      (number) =>
        Number.isInteger(number) && number > 0
    );

  return numbers.length > 0
    ? Math.max(...numbers) + 1
    : 1;
}

export function getPeriodActive(
  period: AcademicPeriod
): boolean {
  return (
    period.isActive === true ||
    String(period.status || "").toLowerCase() ===
      "active"
  );
}

export function isValidDateRange(
  startDate: string,
  endDate: string
): boolean {
  if (!startDate || !endDate) {
    return false;
  }

  const start = new Date(
    `${startDate}T00:00:00`
  ).getTime();

  const end = new Date(
    `${endDate}T00:00:00`
  ).getTime();

  return (
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    end >= start
  );
}

export function filterAcademicPeriods(
  periods: AcademicPeriod[],
  searchTerm: string
): AcademicPeriod[] {
  const search = searchTerm.trim().toLowerCase();

  if (!search) {
    return periods;
  }

  return periods.filter((period) => {
    const name = getPeriodName(period).toLowerCase();

    return (
      name.includes(search) ||
      String(period.periodNumber ?? "").includes(
        search
      )
    );
  });
}
