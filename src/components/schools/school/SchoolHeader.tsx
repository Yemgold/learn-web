
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";

export interface SchoolBreadcrumb {
  label: string;
  href?: string;
}

export interface SchoolHeaderUser {
  name: string;
  email?: string;
  role?: string;
  avatarUrl?: string | null;
}

interface SchoolHeaderProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: SchoolBreadcrumb[];

  user?: SchoolHeaderUser;

  basePath?: string;

  notificationCount?: number;
  onNotificationsClick?: () => void;

  onMenuClick?: () => void;
  showMenuButton?: boolean;

  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;

  rightContent?: ReactNode;
  className?: string;
  sticky?: boolean;
}

function getInitials(name?: string) {
  if (!name?.trim()) return "SA";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatCount(count: number) {
  if (count > 99) return "99+";
  return String(count);
}

function normalizeBasePath(basePath = "") {
  if (!basePath || basePath === "/") return "";

  return `/${basePath.replace(/^\/+|\/+$/g, "")}`;
}

function generateBreadcrumbs(
  pathname: string,
  basePath = "",
): SchoolBreadcrumb[] {
  const normalizedBasePath = normalizeBasePath(basePath);

  const segments = pathname.split("/").filter(Boolean);

  const schoolIndex = segments.indexOf("schools");

  const routeSegments =
    schoolIndex !== -1
      ? segments.slice(schoolIndex + 2)
      : segments;

  const breadcrumbs: SchoolBreadcrumb[] = [
    {
      label: "Home",
      href: `${normalizedBasePath}/dashboard`,
    },
  ];

  let currentPath =
    schoolIndex !== -1
      ? `/${segments.slice(0, schoolIndex + 2).join("/")}`
      : normalizedBasePath;

  routeSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    const label = segment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    breadcrumbs.push({
      label,
      href:
        index === routeSegments.length - 1
          ? undefined
          : currentPath,
    });
  });

  return breadcrumbs;
}

export default function SchoolHeader({
  title,
  subtitle,
  breadcrumbs,
  user,
  basePath = "",
  notificationCount = 0,
  onNotificationsClick,
  onMenuClick,
  showMenuButton = true,
  onProfileClick,
  onSettingsClick,
  onLogout,
  rightContent,
  className = "",
  sticky = true,
}: SchoolHeaderProps) {
  const pathname = usePathname();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || "School User";

  const initials = getInitials(displayName);

  const breadcrumbItems =
    breadcrumbs ?? generateBreadcrumbs(pathname, basePath);

  const pageTitle =
    title ||
    breadcrumbItems[breadcrumbItems.length - 1]?.label ||
    "Dashboard";

  useEffect(() => {
    if (!isProfileOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  const closeProfile = () => setIsProfileOpen(false);

  const handleProfileClick = () => {
    closeProfile();
    onProfileClick?.();
  };

  const handleSettingsClick = () => {
    closeProfile();
    onSettingsClick?.();
  };

  const handleLogout = () => {
    closeProfile();
    onLogout?.();
  };

  return (
    <header
      className={`z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8 ${
        sticky ? "sticky top-0" : ""
      } ${className}`}
    >
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="mb-1 hidden items-center gap-1.5 text-xs text-slate-400 sm:flex"
          >
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;

              return (
                <span
                  key={`${item.label}-${index}`}
                  className="flex min-w-0 items-center gap-1.5"
                >
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="truncate transition hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={`truncate ${
                        isLast
                          ? "font-medium text-slate-600"
                          : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}

                  {!isLast && <ChevronRight size={13} />}
                </span>
              );
            })}
          </nav>

          <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
            {pageTitle}
          </h1>

          {subtitle && (
            <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {rightContent}

        {onNotificationsClick && (
          <button
            type="button"
            onClick={onNotificationsClick}
            aria-label={
              notificationCount > 0
                ? `Notifications, ${notificationCount} unread`
                : "Notifications"
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <Bell size={19} />

            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold text-white">
                {formatCount(notificationCount)}
              </span>
            )}
          </button>
        )}

        {/* User profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((current) => !current)}
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
            aria-label="Open user menu"
            className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50 sm:gap-3 sm:px-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={displayName}
                  width={36}
                  height={36}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-[140px] truncate text-xs font-semibold text-slate-800">
                {displayName}
              </p>

              <p className="mt-0.5 max-w-[140px] truncate text-[10px] text-slate-500">
                {user?.role || "School User"}
              </p>
            </div>

            <ChevronDown
              size={15}
              className={`hidden text-slate-400 transition sm:block ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            >
              <div className="border-b border-slate-100 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={displayName}
                        width={40}
                        height={40}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {displayName}
                    </p>

                    {user?.email && (
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    )}

                    {user?.role && (
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-blue-600">
                        {user.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1 p-2">
                {onProfileClick && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleProfileClick}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <UserRound size={17} />
                    My profile
                  </button>
                )}

                {onSettingsClick && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSettingsClick}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Settings size={17} />
                    Account settings
                  </button>
                )}

                {onLogout && (
                  <>
                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Sign out
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
