



"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import SchoolSidebar from "@/components/schools/school/SchoolSidebar";
import SchoolHeader from "@/components/schools/school/SchoolHeader";

import { useAuthStore } from "@/stores/auth.store";

import type { SchoolNavigationRole } from "@/components/schools/school/SchoolNavigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [basePath, setBasePath] = useState<string | null>(null);

  // School membership role, not the general account role.
  const role = user?.schoolContext?.userSchoolMembership?.role as
    | SchoolNavigationRole
    | undefined;

  const schoolName =
    user?.schoolContext?.schoolName || "School Portal";

  const schoolSlug =
    user?.schoolContext?.subDomain;

  // Resolve whether the user is accessing the school through
  // its subdomain or through /schools/[slug].
  useEffect(() => {
    if (!schoolSlug) return;

    const hostname = window.location.hostname.toLowerCase();
    const slug = schoolSlug.toLowerCase();

    const isSchoolSubdomain =
      hostname.startsWith(`${slug}.`);

    setBasePath(
      isSchoolSubdomain
        ? ""
        : `/schools/${schoolSlug}`,
    );
  }, [schoolSlug]);

  const handleLogout = () => {
    logout();

    if (basePath === "") {
      router.replace("/login");
      return;
    }

    router.replace(
      schoolSlug
        ? `/schools/auth/${schoolSlug}/login`
        : "/login",
    );
  };

  // Wait for authentication and school context.
  if (!isHydrated || !schoolSlug || basePath === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-3 text-sm text-slate-500">
            Loading school portal...
          </p>
        </div>
      </div>
    );
  }

  // Never assume OWNER when membership information is missing.
  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            School membership unavailable
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Your account does not currently have a valid school
            membership role. Please sign in again or contact
            your school administrator.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const displayName =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ") || "School User";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SchoolSidebar
        schoolName={schoolName}
        schoolSlug={schoolSlug}
        basePath={basePath}
        role={role}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[270px]">
        <SchoolHeader
          user={{
            name: displayName,
            email: user?.email,
            role,
            avatarUrl: user?.avatar ?? null,
          }}
          onMenuClick={() => setIsMobileOpen(true)}
          onLogout={handleLogout}
        />

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
