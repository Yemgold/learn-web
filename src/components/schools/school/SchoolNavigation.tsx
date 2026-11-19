




"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardList,
  UserRound,
  FileText,
  KeyRound,
  CreditCard,
  Settings,
  BarChart3,
  CalendarDays,
  CalendarRange,
  type LucideIcon,
} from "lucide-react";

export type SchoolNavigationRole =
  | "OWNER"
  | "ADMIN"
  | "TEACHER"
  | "STUDENT";

export interface SchoolNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string | number;
  description?: string;
  allowedRoles?: SchoolNavigationRole[];
  disabled?: boolean;
  external?: boolean;
}

export interface SchoolNavigationGroup {
  title?: string;
  items: SchoolNavigationItem[];
  allowedRoles?: SchoolNavigationRole[];
}

interface SchoolNavigationProps {
  groups?: SchoolNavigationGroup[];
  role?: SchoolNavigationRole;
  basePath?: string;
  orientation?: "vertical" | "horizontal";
  showGroupTitles?: boolean;
  showDescriptions?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export const DEFAULT_SCHOOL_NAVIGATION: SchoolNavigationGroup[] = [
  // --------------------------------------------------
  // OVERVIEW
  // --------------------------------------------------
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        label: "School Profile",
        href: "/profile",
        icon: Building2,
        allowedRoles: ["OWNER", "ADMIN"],
      },
    ],
  },

  // --------------------------------------------------
  // SCHOOL MANAGEMENT - OWNER AND ADMIN
  // --------------------------------------------------
  {
    title: "SCHOOL MANAGEMENT",
    allowedRoles: ["OWNER", "ADMIN"],
    items: [
      {
        label: "Administrators",
        href: "/administrators",
        icon: ShieldCheck,
      },
      {
        label: "Teachers",
        href: "/teachers",
        icon: GraduationCap,
      },
      {
        label: "Students",
        href: "/students",
        icon: Users,
      },
      {
        label: "Classes",
        href: "/classes",
        icon: ClipboardList,
      },
      {
        label: "Subjects",
        href: "/subjects",
        icon: BookOpen,
      },
      {
        label: "Academic Sessions",
        href: "/academic-sessions",
        icon: CalendarDays,
      },
      {
        label: "Academic Periods",
        href: "/academic-periods",
        icon: CalendarRange,
      },
      {
        label: "Enrollments",
        href: "/enrollments",
        icon: UserRound,
      },
      {
        label: "Teacher Assignments",
        href: "/assignments",
        icon: CalendarDays,
      },
    ],
  },

  // --------------------------------------------------
  // TEACHER MANAGEMENT
  // --------------------------------------------------
  {
    title: "TEACHER MANAGEMENT",
    allowedRoles: ["TEACHER"],
    items: [
      {
        label: "My Classes",
        href: "/my-classes",
        icon: ClipboardList,
        description: "View your assigned classes",
      },
      {
        label: "My Students",
        href: "/my-students",
        icon: Users,
        description: "View students in your classes",
      },
      {
        label: "Teacher Assignments",
        href: "/assignments",
        icon: CalendarDays,
        description: "View your teaching assignments",
      },
      // {
      //   label: "Subjects",
      //   href: "/subjects",
      //   icon: BookOpen,
      //   description: "View your assigned subjects",
      // },
    ],
  },

  // --------------------------------------------------
  // ACADEMICS
  // --------------------------------------------------
  {
    title: "ACADEMICS",
    items: [
      {
        label: "Question Bank",
        href: "/question-bank",
        icon: BookOpen,
        allowedRoles: ["OWNER", "ADMIN","TEACHER"],
      },
      {
        label: "Assessments",
        href: "/assessments",
        icon: FileText,
        allowedRoles: ["OWNER", "ADMIN", "TEACHER"],
      },
      {
        label: "Assessment History",
        href: "/assessment-history",
        icon: ClipboardList,
        allowedRoles: ["STUDENT"],
      },
      {
        label: "Results",
        href: "/results",
        icon: BarChart3,
        allowedRoles: ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
      },
      {
        label: "Performance",
        href: "/performance",
        icon: BarChart3,
        allowedRoles: ["OWNER", "ADMIN", "TEACHER", "STUDENT"],
      },
      {
        label: "Reports",
        href: "/reports",
        icon: FileText,
        allowedRoles: ["OWNER", "ADMIN", "TEACHER"],
      },
    ],
  },

  // --------------------------------------------------
  // ACCESS AND BILLING
  // --------------------------------------------------
  {
    title: "ACCESS & BILLING",
    allowedRoles: ["OWNER", "ADMIN"],
    items: [
      {
        label: "Student Access",
        href: "/access",
        icon: KeyRound,
      },
      {
        label: "Subscription",
        href: "/subscription",
        icon: CreditCard,
        allowedRoles: ["OWNER"],
      },
    ],
  },

  // --------------------------------------------------
  // ACCOUNT
  // --------------------------------------------------
  {
    title: "ACCOUNT",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        allowedRoles: ["OWNER", "ADMIN"],
      },
    ],
  },
];

function normalizeBasePath(basePath: string) {
  if (!basePath || basePath === "/") return "";

  return `/${basePath.replace(/^\/+|\/+$/g, "")}`;
}

function buildNavigationHref(basePath: string, href: string) {
  if (/^https?:\/\//i.test(href)) return href;

  const base = normalizeBasePath(basePath);
  const path = href.startsWith("/") ? href : `/${href}`;

  return `${base}${path}` || "/";
}

function isActiveRoute(
  pathname: string,
  href: string,
  exact = false
) {
  if (exact) return pathname === href;

  return pathname === href || pathname.startsWith(`${href}/`);
}

function canView(
  allowedRoles?: SchoolNavigationRole[],
  currentRole?: SchoolNavigationRole
) {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!currentRole) return false;

  return allowedRoles.includes(currentRole);
}

export default function SchoolNavigation({
  groups = DEFAULT_SCHOOL_NAVIGATION,
  role,
  basePath = "",
  orientation = "vertical",
  showGroupTitles = true,
  showDescriptions = false,
  onNavigate,
  className = "",
}: SchoolNavigationProps) {
  const pathname = usePathname();

  const isHorizontal = orientation === "horizontal";

  const visibleGroups = groups
    .filter((group) => canView(group.allowedRoles, role))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        canView(item.allowedRoles, role)
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <nav
      aria-label="School portal navigation"
      className={`${
        isHorizontal
          ? "flex flex-wrap items-center gap-2"
          : "space-y-6"
      } ${className}`}
    >
      {visibleGroups.map((group, groupIndex) => (
        <div
          key={group.title || `navigation-group-${groupIndex}`}
          className={
            isHorizontal ? "contents" : "space-y-2"
          }
        >
          {showGroupTitles && group.title && !isHorizontal && (
            <h3 className="px-3 text-[10px] font-bold tracking-[0.12em] text-slate-400">
              {group.title}
            </h3>
          )}

          <div
            className={
              isHorizontal
                ? "flex flex-wrap items-center gap-2"
                : "space-y-1"
            }
          >
            {group.items.map((item) => {
              const Icon = item.icon;

              const href = buildNavigationHref(
                basePath,
                item.href
              );

              const active =
                !item.external &&
                isActiveRoute(pathname, href, item.exact);

              const sharedClassName = `
                group flex items-center gap-3 rounded-lg px-3 py-2.5
                text-sm font-medium transition-colors
                ${isHorizontal ? "min-h-10" : "w-full"}
                ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
                ${
                  item.disabled
                    ? "pointer-events-none cursor-not-allowed opacity-50"
                    : ""
                }
              `;

              const content = (
                <>
                  <Icon
                    size={18}
                    strokeWidth={active ? 2.3 : 1.8}
                    className={`shrink-0 ${
                      active
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block truncate">
                      {item.label}
                    </span>

                    {showDescriptions && item.description && (
                      <span className="mt-0.5 block text-xs font-normal text-slate-400">
                        {item.description}
                      </span>
                    )}
                  </span>

                  {item.badge !== undefined && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              );

              if (item.external) {
                return (
                  <a
                    key={item.href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={sharedClassName}
                    onClick={onNavigate}
                    aria-disabled={item.disabled || undefined}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  aria-disabled={item.disabled || undefined}
                  tabIndex={item.disabled ? -1 : undefined}
                  className={sharedClassName}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}


