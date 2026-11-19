



"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, X, LogOut } from "lucide-react";

import SchoolNavigation, {
  type SchoolNavigationGroup,
  type SchoolNavigationRole,
} from "@/components/schools/school/SchoolNavigation";

interface SchoolSidebarProps {
  schoolName: string;
  schoolSlug?: string;
  logoUrl?: string | null;
  basePath?: string;

  role: SchoolNavigationRole;

  isMobileOpen?: boolean;
  onMobileClose?: () => void;

  onLogout?: () => void;
  logoutLabel?: string;

  groups?: SchoolNavigationGroup[];
  footerText?: string;
  className?: string;
}

function normalizeBasePath(basePath: string) {
  if (!basePath || basePath === "/") return "";

  return `/${basePath.replace(/^\/+|\/+$/g, "")}`;
}

interface SchoolSidebarContentProps {
  schoolName: string;
  logoUrl?: string | null;
  basePath: string;
  role: SchoolNavigationRole;
  groups?: SchoolNavigationGroup[];
  footerText: string;
  onLogout?: () => void;
  logoutLabel: string;
  onNavigate?: () => void;
}

function SchoolSidebarContent({
  schoolName,
  logoUrl,
  basePath,
  role,
  groups,
  footerText,
  onLogout,
  logoutLabel,
  onNavigate,
}: SchoolSidebarContentProps) {
  const dashboardHref = `${normalizeBasePath(basePath)}/dashboard`;

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* School branding */}
      <div className="border-b border-slate-100 px-5 py-5">
        <Link
          href={dashboardHref}
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${schoolName} logo`}
                width={44}
                height={44}
                unoptimized
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 size={23} className="text-blue-600" />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">
              {schoolName}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              School Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <SchoolNavigation
          groups={groups}
          role={role}
          basePath={basePath}
          orientation="vertical"
          showGroupTitles
          onNavigate={onNavigate}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        {footerText && (
          <p className="mb-3 text-center text-[11px] text-slate-400">
            {footerText}
          </p>
        )}

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            {logoutLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default function SchoolSidebar({
  schoolName,
  schoolSlug,
  logoUrl,
  basePath,
  role,
  isMobileOpen = false,
  onMobileClose,
  onLogout,
  logoutLabel = "Sign out",
  groups,
  footerText = "Powered by Learnyfi",
  className = "",
}: SchoolSidebarProps) {
  const resolvedBasePath =
    basePath !== undefined
      ? basePath
      : schoolSlug
        ? `/schools/${schoolSlug}`
        : "";

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden h-screen w-[270px] border-r border-slate-200 bg-white lg:flex lg:flex-col ${className}`}
      >
        <SchoolSidebarContent
          schoolName={schoolName}
          logoUrl={logoUrl}
          basePath={resolvedBasePath}
          role={role}
          groups={groups}
          footerText={footerText}
          onLogout={onLogout}
          logoutLabel={logoutLabel}
        />
      </aside>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onMobileClose}
            className="absolute inset-0 bg-slate-950/50"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[285px] max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-sm font-semibold text-slate-800">
                Navigation
              </span>

              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <SchoolSidebarContent
                schoolName={schoolName}
                logoUrl={logoUrl}
                basePath={resolvedBasePath}
                role={role}
                groups={groups}
                footerText={footerText}
                onLogout={onLogout}
                logoutLabel={logoutLabel}
                onNavigate={onMobileClose}
              />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
