"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import DashboardSidebar from "../DashboardSidebar";
import DashboardHeader from "../DashboardHeader";

import { cn } from "@/lib/utils";

import { useAuthStore } from "@/stores";

export type DashboardRole =
  | "student"
  | "admin";

interface DashboardLayoutProps {
  children: ReactNode;
  role: DashboardRole;
  className?: string;
}

export default function DashboardLayout({
  children,
  role,
  className,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const {
    user,
    isAuthenticated,
  } = useAuthStore();

  /* ============================================================
     AUTHENTICATION / AUTHORIZATION
  ============================================================ */

  useEffect(() => {
    /*
     * Give Zustand a moment to initialize
     * before deciding whether the user is
     * authenticated.
     */

    if (!isAuthenticated || !user) {
      const loginUrl =
        `/auth/login?redirect=${encodeURIComponent(
          pathname,
        )}`;

      router.replace(loginUrl);

      return;
    }

    /*
     * STUDENT DASHBOARD
     *
     * Backend uses USER as the normal student role.
     *
     * STUDENT is also accepted in case older
     * accounts use that role.
     */

    if (role === "student") {
      const allowedStudentRoles = [
        "USER",
        "STUDENT",
      ];

      if (
        !allowedStudentRoles.includes(
          user.role,
        )
      ) {
        console.warn(
          "Unauthorized student dashboard access:",
          user.role,
        );

        router.replace("/");

        return;
      }
    }

    /*
     * ADMIN DASHBOARD
     */

    if (role === "admin") {
      if (user.role !== "ADMIN") {
        console.warn(
          "Unauthorized admin dashboard access:",
          user.role,
        );

        router.replace("/");

        return;
      }
    }

    /*
     * Everything passed.
     */

    setCheckingAuth(false);
  }, [
    isAuthenticated,
    user,
    role,
    pathname,
    router,
  ]);

  /* ============================================================
     SIDEBAR
  ============================================================ */

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(
      (previous) => !previous,
    );
  };

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (checkingAuth || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

          <p className="mt-4 text-sm text-white/60">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     USER DISPLAY NAME
  ============================================================ */

  const userName = [
    user.firstName,
    user.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  /* ============================================================
     DASHBOARD
  ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">

        {/* ======================================================
            SIDEBAR
        ====================================================== */}

        <DashboardSidebar
          role={role}
          open={sidebarOpen}
          onClose={closeSidebar}
        />

        {/* ======================================================
            MAIN AREA
        ====================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* ====================================================
              HEADER
          ==================================================== */}

          <DashboardHeader
            role={role}
            userName={userName || "Student"}
            onMenuClick={toggleSidebar}
          />

          {/* ====================================================
              PAGE CONTENT
          ==================================================== */}

          <main
            className={cn(
              "min-w-0 flex-1",
              "p-4 sm:p-6 lg:p-8",
              className,
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}






// "use client";

// import {
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";

// import { usePathname, useRouter } from "next/navigation";

// import DashboardSidebar from "../DashboardSidebar";
// import DashboardHeader from "../DashboardHeader";

// import { cn } from "@/lib/utils";



// import { useAuthStore } from "@/stores"; 

// export type DashboardRole =
//   | "student"
//   | "admin";

// interface DashboardLayoutProps {
//   children: ReactNode;
//   role: DashboardRole;
//   className?: string;
// }

// export default function DashboardLayout({
//   children,
//   role,
//   className,
// }: DashboardLayoutProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [sidebarOpen, setSidebarOpen] =
//     useState(false);

//   const [checkingAuth, setCheckingAuth] =
//     useState(true);

//   const {
//     user,
//     isAuthenticated,
//   } = useAuthStore();

//   /* ============================================================
//      AUTHENTICATION / AUTHORIZATION
//      ============================================================ */

//   useEffect(() => {
//     /*
//      * Give Zustand a moment to initialize
//      * before deciding whether the user is
//      * authenticated.
//      */

//     if (!isAuthenticated || !user) {
//       const loginUrl =
//         `/auth/login?redirect=${encodeURIComponent(
//           pathname,
//         )}`;

//       router.replace(loginUrl);

//       return;
//     }

//     /*
//      * STUDENT DASHBOARD
//      *
//      * Backend uses USER as the normal student role.
//      *
//      * STUDENT is also accepted in case older
//      * accounts use that role.
//      */

//     if (role === "student") {
//       const allowedStudentRoles = [
//         "USER",
//         "STUDENT",
//       ];

//       if (
//         !allowedStudentRoles.includes(
//           user.role,
//         )
//       ) {
//         console.warn(
//           "Unauthorized student dashboard access:",
//           user.role,
//         );

//         router.replace("/");

//         return;
//       }
//     }

//     /*
//      * ADMIN DASHBOARD
//      */

//     if (role === "admin") {
//       if (user.role !== "ADMIN") {
//         console.warn(
//           "Unauthorized admin dashboard access:",
//           user.role,
//         );

//         router.replace("/");

//         return;
//       }
//     }

//     /*
//      * Everything passed.
//      */

//     setCheckingAuth(false);
//   }, [
//     isAuthenticated,
//     user,
//     role,
//     pathname,
//     router,
//   ]);

//   /* ============================================================
//      SIDEBAR
//      ============================================================ */

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(
//       (previous) => !previous,
//     );
//   };

//   /* ============================================================
//      LOADING STATE
//      ============================================================ */

//   if (checkingAuth) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-slate-950">
//         <div className="text-center">
//           <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

//           <p className="mt-4 text-sm text-white/60">
//             Checking your account...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* ============================================================
//      DASHBOARD
//      ============================================================ */

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="flex min-h-screen">

//         {/* ======================================================
//             SIDEBAR
//         ====================================================== */}

//         <DashboardSidebar
//           role={role}
//           open={sidebarOpen}
//           onClose={closeSidebar}
//         />

//         {/* ======================================================
//             MAIN AREA
//         ====================================================== */}

//         <div className="flex min-w-0 flex-1 flex-col">

//           {/* ====================================================
//               HEADER
//           ==================================================== */}

//           <DashboardHeader
//             role={role}
//             onMenuClick={toggleSidebar}
//           />

//           {/* ====================================================
//               PAGE CONTENT
//           ==================================================== */}

//           <main
//             className={cn(
//               "min-w-0 flex-1",
//               "p-4 sm:p-6 lg:p-8",
//               className,
//             )}
//           >
//             {children}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }
