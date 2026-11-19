





// import type {
//   ID,
//   SchoolAccessMode,
//   SchoolMembershipRole,
//   SchoolStatus,
//   MemberStatus,
//   SubscriptionStatus,
//   PaymentStatus,
//   EnrollmentStatus,
// } from "@/types/schools/types";

// import type {
//   QuestionDifficulty,
//   QuestionStatus,
//   QuestionType,
// } from "@/types/schools/question";

// import type {
//   AssessmentStatus,
//   AssessmentType,
//   AssessmentAttemptStatus,
//   AssessmentResultStatus,
// } from "@/types/schools/assessment";

// /* =========================================================
//    CONSTANTS
// ========================================================= */

// export const DEFAULT_PAGE_SIZE = 10;

// export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// export const DEFAULT_CURRENCY = "NGN";

// export const DEFAULT_LOCALE = "en-NG";

// /* =========================================================
//    STRING HELPERS
// ========================================================= */

// export function capitalize(value?: string | null): string {
//   if (!value) return "";

//   return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
// }

// export function titleCase(value?: string | null): string {
//   if (!value) return "";

//   return value
//     .replace(/[_-]+/g, " ")
//     .trim()
//     .split(/\s+/)
//     .map((word) => capitalize(word))
//     .join(" ");
// }

// export function getInitials(
//   firstName?: string | null,
//   lastName?: string | null
// ): string {
//   const first = firstName?.trim().charAt(0) || "";
//   const last = lastName?.trim().charAt(0) || "";

//   return `${first}${last}`.toUpperCase();
// }

// export function getFullName(
//   firstName?: string | null,
//   lastName?: string | null
// ): string {
//   return [firstName, lastName]
//     .filter((value) => Boolean(value?.trim()))
//     .join(" ");
// }

// export function truncateText(
//   value: string,
//   maxLength = 100
// ): string {
//   if (value.length <= maxLength) return value;

//   return `${value.slice(0, maxLength).trimEnd()}...`;
// }

// export function slugify(value: string): string {
//   return value
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// }

// export function normalizeSearch(value?: string): string {
//   return (value || "").trim().toLowerCase();
// }

// /* =========================================================
//    DATE HELPERS
// ========================================================= */

// export function formatDate(
//   value?: string | Date | null,
//   options?: Intl.DateTimeFormatOptions
// ): string {
//   if (!value) return "Not available";

//   const date = value instanceof Date ? value : new Date(value);

//   if (Number.isNaN(date.getTime())) return "Invalid date";

//   return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//     ...options,
//   }).format(date);
// }

// export function formatDateTime(
//   value?: string | Date | null
// ): string {
//   return formatDate(value, {
//     hour: "numeric",
//     minute: "2-digit",
//   });
// }

// export function formatTime(value?: string | Date | null): string {
//   if (!value) return "Not available";

//   const date =
//     value instanceof Date
//       ? value
//       : new Date(
//           /^\d{1,2}:\d{2}/.test(value)
//             ? `2000-01-01T${value}`
//             : value
//         );

//   if (Number.isNaN(date.getTime())) return "Invalid time";

//   return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
//     hour: "numeric",
//     minute: "2-digit",
//   }).format(date);
// }

// export function isValidDate(value?: string | Date | null): boolean {
//   if (!value) return false;

//   const date = value instanceof Date ? value : new Date(value);

//   return !Number.isNaN(date.getTime());
// }

// export function getDaysRemaining(
//   expiryDate?: string | Date | null
// ): number | null {
//   if (!expiryDate) return null;

//   const expiry =
//     expiryDate instanceof Date
//       ? expiryDate
//       : new Date(expiryDate);

//   if (Number.isNaN(expiry.getTime())) return null;

//   const now = new Date();

//   const today = new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     now.getDate()
//   );

//   const expiryDay = new Date(
//     expiry.getFullYear(),
//     expiry.getMonth(),
//     expiry.getDate()
//   );

//   return Math.ceil(
//     (expiryDay.getTime() - today.getTime()) /
//       (1000 * 60 * 60 * 24)
//   );
// }

// export function isExpired(
//   expiryDate?: string | Date | null
// ): boolean {
//   if (!expiryDate) return false;

//   const expiry =
//     expiryDate instanceof Date
//       ? expiryDate
//       : new Date(expiryDate);

//   if (Number.isNaN(expiry.getTime())) return false;

//   return expiry.getTime() < Date.now();
// }

// export function isDateInRange(
//   date: string | Date,
//   startDate: string | Date,
//   endDate: string | Date
// ): boolean {
//   const target = new Date(date).getTime();
//   const start = new Date(startDate).getTime();
//   const end = new Date(endDate).getTime();

//   if ([target, start, end].some(Number.isNaN)) return false;

//   return target >= start && target <= end;
// }

// /* =========================================================
//    CURRENCY HELPERS
// ========================================================= */

// export function formatCurrency(
//   amount?: number | string | null,
//   currency = DEFAULT_CURRENCY,
//   locale = DEFAULT_LOCALE
// ): string {
//   const numericAmount =
//     typeof amount === "string" ? Number(amount) : amount;

//   if (
//     numericAmount === null ||
//     numericAmount === undefined ||
//     !Number.isFinite(numericAmount)
//   ) {
//     return "—";
//   }

//   try {
//     return new Intl.NumberFormat(locale, {
//       style: "currency",
//       currency,
//       maximumFractionDigits: 2,
//     }).format(numericAmount);
//   } catch {
//     return `${currency} ${numericAmount.toLocaleString()}`;
//   }
// }

// /* =========================================================
//    STATUS HELPERS
// ========================================================= */

// export type StatusColor =
//   | "green"
//   | "red"
//   | "yellow"
//   | "blue"
//   | "purple"
//   | "gray"
//   | "orange";

// export interface StatusConfiguration {
//   label: string;
//   color: StatusColor;
// }

// const STATUS_CONFIG: Record<string, StatusConfiguration> = {
//   ACTIVE: { label: "Active", color: "green" },
//   INACTIVE: { label: "Inactive", color: "gray" },
//   SUSPENDED: { label: "Suspended", color: "red" },
//   PENDING: { label: "Pending", color: "yellow" },
//   APPROVED: { label: "Approved", color: "green" },
//   REJECTED: { label: "Rejected", color: "red" },
//   COMPLETED: { label: "Completed", color: "blue" },
//   PUBLISHED: { label: "Published", color: "green" },
//   DRAFT: { label: "Draft", color: "gray" },
//   CLOSED: { label: "Closed", color: "gray" },
//   EXPIRED: { label: "Expired", color: "red" },
//   CANCELLED: { label: "Cancelled", color: "gray" },
//   FAILED: { label: "Failed", color: "red" },
//   SUCCESS: { label: "Successful", color: "green" },
//   REFUNDED: { label: "Refunded", color: "purple" },
//   ONGOING: { label: "Ongoing", color: "blue" },
//   ARCHIVED: { label: "Archived", color: "gray" },
//   GRADED: { label: "Graded", color: "green" },
//   SUBMITTED: { label: "Submitted", color: "blue" },
//   AUTO_SUBMITTED: { label: "Auto submitted", color: "orange" },
//   IN_PROGRESS: { label: "In progress", color: "blue" },
//   NOT_STARTED: { label: "Not started", color: "gray" },
//   EXHAUSTED: { label: "Exhausted", color: "red" },
//   TRANSFERRED: { label: "Transferred", color: "purple" },
//   WITHDRAWN: { label: "Withdrawn", color: "red" },
//   AVAILABLE: { label: "Available", color: "green" },
//   EXPIRED_SUBSCRIPTION: {
//     label: "Expired",
//     color: "red",
//   },
// };

// export function getStatusConfig(
//   status?: string | null
// ): StatusConfiguration {
//   const key = status?.toUpperCase() || "";

//   return (
//     STATUS_CONFIG[key] || {
//       label: status ? titleCase(status) : "Unknown",
//       color: "gray",
//     }
//   );
// }

// export function getStatusLabel(status?: string | null): string {
//   return getStatusConfig(status).label;
// }

// export function getStatusColor(status?: string | null): StatusColor {
//   return getStatusConfig(status).color;
// }

// /* =========================================================
//    ROLE HELPERS
// ========================================================= */

// const ROLE_LABELS: Record<SchoolMembershipRole, string> = {
//   OWNER: "School Owner",
//   ADMIN: "Administrator",
//   TEACHER: "Teacher",
//   STUDENT: "Student",
// };

// export function getRoleLabel(
//   role?: SchoolMembershipRole | string | null
// ): string {
//   if (!role) return "Unknown";

//   if (role in ROLE_LABELS) {
//     return ROLE_LABELS[role as SchoolMembershipRole];
//   }

//   return titleCase(role);
// }

// export function getRoleInitial(role?: string): string {
//   return role?.charAt(0).toUpperCase() || "?";
// }

// /* =========================================================
//    SCHOOL HELPERS
// ========================================================= */

// export function getSchoolAccessModeLabel(
//   mode?: SchoolAccessMode
// ): string {
//   switch (mode) {
//     case "STUDENT_PIN":
//       return "Student PIN Access";

//     case "SCHOOL_SUBSCRIPTION":
//       return "School Subscription";

//     default:
//       return "Not configured";
//   }
// }

// export function getSchoolStatusLabel(
//   status?: SchoolStatus
// ): string {
//   return getStatusLabel(status);
// }

// /* =========================================================
//    PAGINATION HELPERS
// ========================================================= */

// export interface PaginationResult {
//   currentPage: number;
//   totalPages: number;
//   totalItems: number;
//   pageSize: number;
//   startItem: number;
//   endItem: number;
//   hasPreviousPage: boolean;
//   hasNextPage: boolean;
// }

// export function getPaginationInfo(
//   totalItems: number,
//   currentPage: number,
//   pageSize: number
// ): PaginationResult {
//   const safeTotal = Math.max(0, totalItems);
//   const safePageSize = Math.max(1, Math.floor(pageSize));
//   const totalPages = Math.ceil(safeTotal / safePageSize);
//   const safeCurrentPage = Math.min(
//     Math.max(1, Math.floor(currentPage)),
//     Math.max(1, totalPages)
//   );

//   const startItem =
//     safeTotal === 0
//       ? 0
//       : (safeCurrentPage - 1) * safePageSize + 1;

//   const endItem = Math.min(
//     safeCurrentPage * safePageSize,
//     safeTotal
//   );

//   return {
//     currentPage: safeCurrentPage,
//     totalPages,
//     totalItems: safeTotal,
//     pageSize: safePageSize,
//     startItem,
//     endItem,
//     hasPreviousPage: safeCurrentPage > 1,
//     hasNextPage: safeCurrentPage < totalPages,
//   };
// }

// /* =========================================================
//    MEMBER HELPERS
// ========================================================= */

// export function getMemberDisplayName(
//   member?: {
//     firstName?: string;
//     lastName?: string;
//     user?: {
//       firstName?: string;
//       lastName?: string;
//     };
//   } | null
// ): string {
//   if (!member) return "Unknown member";

//   return (
//     getFullName(
//       member.firstName || member.user?.firstName,
//       member.lastName || member.user?.lastName
//     ) || "Unknown member"
//   );
// }

// export function getMemberStatusLabel(
//   status?: MemberStatus
// ): string {
//   return getStatusLabel(status);
// }

// /* =========================================================
//    QUESTION HELPERS
// ========================================================= */

// export function getQuestionDifficultyLabel(
//   difficulty?: QuestionDifficulty
// ): string {
//   switch (difficulty) {
//     case "EASY":
//       return "Easy";

//     case "MEDIUM":
//       return "Medium";

//     case "HARD":
//       return "Hard";

//     default:
//       return "Not specified";
//   }
// }

// export function getQuestionTypeLabel(
//   type?: QuestionType
// ): string {
//   switch (type) {
//     case "OBJECTIVE":
//       return "Objective";

//     case "THEORY":
//       return "Theory";

//     case "FILL_IN_THE_GAP":
//       return "Fill in the gap";

//     case "TRUE_FALSE":
//       return "True or False";

//     case "MATCHING":
//       return "Matching";

//     default:
//       return "Unknown";
//   }
// }

// export function getQuestionStatusLabel(
//   status?: QuestionStatus
// ): string {
//   return getStatusLabel(status);
// }

// /* =========================================================
//    ASSESSMENT HELPERS
// ========================================================= */

// export function getAssessmentTypeLabel(
//   type?: AssessmentType
// ): string {
//   switch (type) {
//     case "EXAM":
//       return "Examination";

//     case "TEST":
//       return "Test";

//     case "QUIZ":
//       return "Quiz";

//     case "ASSIGNMENT":
//       return "Assignment";

//     case "PRACTICE":
//       return "Practice";

//     default:
//       return "Unknown";
//   }
// }

// export function getAssessmentStatusLabel(
//   status?: AssessmentStatus
// ): string {
//   return getStatusLabel(status);
// }

// export function getAttemptStatusLabel(
//   status?: AssessmentAttemptStatus
// ): string {
//   return getStatusLabel(status);
// }

// export function getResultStatusLabel(
//   status?: AssessmentResultStatus
// ): string {
//   return getStatusLabel(status);
// }

// export function calculatePercentage(
//   score: number,
//   total: number
// ): number {
//   if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) {
//     return 0;
//   }

//   return Math.round((score / total) * 100 * 100) / 100;
// }

// export function calculateGrade(
//   percentage: number
// ): string {
//   if (!Number.isFinite(percentage)) return "N/A";

//   if (percentage >= 70) return "A";
//   if (percentage >= 60) return "B";
//   if (percentage >= 50) return "C";
//   if (percentage >= 45) return "D";
//   if (percentage >= 40) return "E";

//   return "F";
// }

// export function isPassingScore(
//   score: number,
//   passMark: number
// ): boolean {
//   return score >= passMark;
// }

// /* =========================================================
//    TIME HELPERS
// ========================================================= */

// export function formatDuration(totalMinutes: number): string {
//   if (!Number.isFinite(totalMinutes) || totalMinutes < 0) {
//     return "Invalid duration";
//   }

//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;

//   if (hours === 0) return `${minutes} minutes`;

//   if (minutes === 0) {
//     return `${hours} ${hours === 1 ? "hour" : "hours"}`;
//   }

//   return `${hours}h ${minutes}m`;
// }

// export function formatCountdown(totalSeconds: number): string {
//   const safeSeconds = Math.max(
//     0,
//     Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0)
//   );

//   const hours = Math.floor(safeSeconds / 3600);
//   const minutes = Math.floor((safeSeconds % 3600) / 60);
//   const seconds = safeSeconds % 60;

//   return [hours, minutes, seconds]
//     .map((value) => String(value).padStart(2, "0"))
//     .join(":");
// }

// /* =========================================================
//    VALIDATION HELPERS
// ========================================================= */

// export function isValidEmail(email?: string): boolean {
//   if (!email) return false;

//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
// }

// export function isValidPhone(phone?: string): boolean {
//   if (!phone) return false;

//   const normalized = phone.replace(/[\s()-]/g, "");

//   return /^\+?\d{7,15}$/.test(normalized);
// }

// export function isRequired(value?: string | null): boolean {
//   return Boolean(value?.trim());
// }

// export function isValidSchoolSlug(slug: string): boolean {
//   return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
// }

// /* =========================================================
//    FILE HELPERS
// ========================================================= */

// export function formatFileSize(bytes: number): string {
//   if (!Number.isFinite(bytes) || bytes < 0) return "Invalid size";

//   if (bytes === 0) return "0 Bytes";

//   const units = ["Bytes", "KB", "MB", "GB", "TB"];
//   const index = Math.floor(Math.log(bytes) / Math.log(1024));
//   const safeIndex = Math.min(index, units.length - 1);

//   const size = bytes / Math.pow(1024, safeIndex);

//   return `${size.toFixed(safeIndex === 0 ? 0 : 2)} ${units[safeIndex]}`;
// }

// /* =========================================================
//    ENROLLMENT HELPERS
// ========================================================= */

// export function getEnrollmentStatusLabel(
//   status?: EnrollmentStatus
// ): string {
//   return getStatusLabel(status);
// }

// /* =========================================================
//    SUBSCRIPTION & PAYMENT HELPERS
// ========================================================= */

// export function getSubscriptionStatusLabel(
//   status?: SubscriptionStatus
// ): string {
//   return getStatusLabel(status);
// }

// export function getPaymentStatusLabel(
//   status?: PaymentStatus
// ): string {
//   return getStatusLabel(status);
// }

// /* =========================================================
//    ID HELPERS
// ========================================================= */

// export function isValidId(value?: ID | null): boolean {
//   return Boolean(value && value.trim().length > 0);
// }

// /* =========================================================
//    ARRAY HELPERS
// ========================================================= */

// export function removeDuplicates<T>(
//   items: T[],
//   getKey: (item: T) => string | number = (item) =>
//     item as string | number
// ): T[] {
//   const seen = new Set<string | number>();

//   return items.filter((item) => {
//     const key = getKey(item);

//     if (seen.has(key)) return false;

//     seen.add(key);
//     return true;
//   });
// }

// export function sortByDate<T>(
//   items: T[],
//   getDate: (item: T) => string | Date,
//   direction: "asc" | "desc" = "desc"
// ): T[] {
//   return [...items].sort((a, b) => {
//     const first = new Date(getDate(a)).getTime();
//     const second = new Date(getDate(b)).getTime();

//     return direction === "asc"
//       ? first - second
//       : second - first;
//   });
// }

// /* =========================================================
//    SEARCH HELPERS
// ========================================================= */

// export function filterBySearch<T>(
//   items: T[],
//   search: string,
//   getSearchableText: (item: T) => string
// ): T[] {
//   const query = normalizeSearch(search);

//   if (!query) return items;

//   return items.filter((item) =>
//     normalizeSearch(getSearchableText(item)).includes(query)
//   );
// }

// /* =========================================================
//    ERROR HELPERS
// ========================================================= */

// export function getErrorMessage(
//   error: unknown,
//   fallback = "Something went wrong. Please try again."
// ): string {
//   if (error instanceof Error && error.message) {
//     return error.message;
//   }

//   if (
//     typeof error === "object" &&
//     error !== null &&
//     "message" in error &&
//     typeof error.message === "string"
//   ) {
//     return error.message;
//   }

//   return fallback;
// }
