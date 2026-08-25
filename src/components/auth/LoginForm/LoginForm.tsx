

// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import { useForm } from "react-hook-form";

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   AuthCard,
//   AuthHeader,
//   AuthFooter,
//   Divider,
//   PasswordInput,
//   SocialLogin,
// } from "@/components/auth";

// import { useLogin } from "@/hooks/auth/useLogin";

// const loginSchema = z.object({
//   email: z
//     .string()
//     .trim()
//     .email("Enter a valid email address"),

//   password: z
//     .string()
//     .min(
//       8,
//       "Password must contain at least 8 characters"
//     ),
// });

// type LoginFormData = z.infer<
//   typeof loginSchema
// >;

// interface LoginFormProps {
//   adminOnly?: boolean;
// }

// export default function LoginForm({
//   adminOnly = false,
// }: LoginFormProps) {
//   const router = useRouter();

//   const loginMutation = useLogin();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),

//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (
//     data: LoginFormData
//   ) => {
//     try {
//       const response =
//         await loginMutation.mutateAsync(
//           data
//         );

//       const role =
//         response.data.user.role;

//       /**
//        * Admin Login Page
//        */

//       if (adminOnly) {
//         if (role !== "ADMIN") {
//           alert(
//             "You are not authorized to access the Admin Dashboard."
//           );

//           return;
//         }

//         router.push("/admin/dashboard");
//         return;
//       }

// /* ============================================================ 

//                 NORMAL LOGIN REDIRECT 
// ============================================================ */

//  switch (role) { 
//   case "ADMIN": 
//   router.push("/admin/dashboard"); break;

//    case "ORGANIZER":
//      router.push("/organizer/dashboard"); break; 

//    case "STUDENT": 
//    case "USER": 
//    router.push("/student/dashboard"); break;

//     default: 
//     console.warn( "Unknown user role:", role, );
//      router.push("/"); break;
//     }

//   } catch (error) {
//     console.error("Login failed:", error);
//   }
// };

//   return (
//     <AuthCard>
//       <AuthHeader
//         title={
//           adminOnly
//             ? "Administrator Login"
//             : "Welcome Back"
//         }
//         subtitle={
//   adminOnly
//     ? "Sign in to manage competitions, students, questions, results, and the JAMB League platform."
//     : "Sign in to continue your JAMB preparation, compete with others, and climb the leaderboard."
// }
//       />

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="space-y-6"
//       >
//         <Input
//           label="Email Address"
//           type="email"
//           placeholder="example@email.com"
//           autoComplete="email"
//           {...register("email")}
//           error={errors.email?.message}
//         />

//         <PasswordInput
//           label="Password"
//           placeholder="Enter your password"
//           autoComplete="current-password"
//           {...register("password")}
//           error={
//             errors.password?.message
//           }
//         />

//         <div className="flex justify-end">
//           <Link
//             href="/auth/forgot-password"
//             className="text-sm font-medium text-primary transition hover:underline"
//           >
//             Forgot password?
//           </Link>
//         </div>

//         {loginMutation.isError && (
//           <div className="rounded-xl border border-red-200 bg-red-50 p-4">
//             <p className="text-sm font-medium text-red-600">
//               {loginMutation.error
//                 ?.message ??
//                 "Login failed. Please check your credentials and try again."}
//             </p>
//           </div>
//         )}

//         {loginMutation.isSuccess && (
//           <div className="rounded-xl border border-green-200 bg-green-50 p-4">
//             <p className="text-sm font-medium text-green-700">
//               {
//                 loginMutation.data
//                   ?.message
//               }
//             </p>
//           </div>
//         )}

//         <Button
//           type="submit"
//           className="w-full"
//           disabled={
//             loginMutation.isPending
//           }
//         >
//           {loginMutation.isPending
//             ? adminOnly
//               ? "Signing in..."
//               : "Logging in..."
//             : adminOnly
//             ? "Admin Login"
//             : "Login"}
//         </Button>
//       </form>

//       {!adminOnly && (
//         <>
//           <Divider />

//           <SocialLogin />
//         </>
//       )}

//       {!adminOnly ? (
//         <AuthFooter
//           text="Don't have an account?"
//           linkText="Create Account"
//           href="/auth/register"
//         />
//       ) : (
//         <AuthFooter
//           text="Return to website?"
//           linkText="Go Home"
//           href="/"
//         />
//       )}
//     </AuthCard>
//   );
// }





"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  AuthCard,
  AuthHeader,
  AuthFooter,
  Divider,
  PasswordInput,
  SocialLogin,
} from "@/components/auth";

import { useLogin } from "@/hooks/auth/useLogin";

/* ============================================================
   VALIDATION
   ============================================================ */

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(
      8,
      "Password must contain at least 8 characters",
    ),
});

type LoginFormData = z.infer<
  typeof loginSchema
>;

/* ============================================================
   PROPS
   ============================================================ */

interface LoginFormProps {
  adminOnly?: boolean;
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function LoginForm({
  adminOnly = false,
}: LoginFormProps) {
  const router = useRouter();

  const loginMutation = useLogin();

  /* ============================================================
     FORCE SWITCH STATE
     ============================================================ */

  const [showForceSwitch, setShowForceSwitch] =
    useState(false);

  const [forceSwitchData, setForceSwitchData] =
    useState<LoginFormData | null>(null);

  const [currentDevice, setCurrentDevice] =
    useState<string>("another device");

  const [forceSwitchError, setForceSwitchError] =
    useState<string | null>(null);

  /* ============================================================
     FORM
     ============================================================ */

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ============================================================
     REDIRECT USER BASED ON ROLE
     ============================================================ */

  const redirectAfterLogin = (
    role: string,
  ) => {
    /* ========================================================
       ADMIN LOGIN PAGE
       ======================================================== */

    if (adminOnly) {
      if (role !== "ADMIN") {
        alert(
          "You are not authorized to access the Admin Dashboard.",
        );

        return;
      }

      router.push("/admin/dashboard");

      return;
    }

    /* ========================================================
       NORMAL LOGIN REDIRECT
       ======================================================== */

    switch (role) {
      case "ADMIN":
        router.push("/admin/dashboard");
        break;

      case "ORGANIZER":
        router.push(
          "/organizer/dashboard",
        );
        break;

      case "STUDENT":
      case "USER":
        router.push(
          "/student/dashboard",
        );
        break;

      default:
        console.warn(
          "Unknown user role:",
          role,
        );

        router.push("/");
        break;
    }
  };

  /* ============================================================
     NORMAL LOGIN
     ============================================================ */

  const onSubmit = async (
    data: LoginFormData,
  ) => {
    /* ========================================================
       CLEAR OLD FORCE-SWITCH ERROR
       ======================================================== */

    setForceSwitchError(null);

    try {
      const response =
        await loginMutation.mutateAsync(
          data,
        );

      /* ========================================================
         GET USER ROLE
         ======================================================== */

      const role =
        response.data.user.role;

      /* ========================================================
         REDIRECT
         ======================================================== */

      redirectAfterLogin(role);

    } catch (error: any) {
      console.error(
        "Login failed:",
        error,
      );

      /* ========================================================
         FORCE SWITCH REQUIRED
         ======================================================== */

      const status =
        error?.response?.status;

      const errorData =
        error?.response?.data;

      const action =
        errorData?.action;

      if (
        status === 409 &&
        action ===
          "FORCE_SWITCH_REQUIRED"
      ) {
        /* ======================================================
           SAVE LOGIN DATA
           ====================================================== */

        setForceSwitchData(data);

        /* ======================================================
           GET CURRENT DEVICE
           ====================================================== */

        setCurrentDevice(
          errorData?.currentDevice ??
            "another device",
        );

        /* ======================================================
           SHOW FORCE SWITCH UI
           ====================================================== */

        setShowForceSwitch(true);

        return;
      }

      /* ========================================================
         OTHER LOGIN ERRORS
         ======================================================== */

      console.error(
        "Unhandled login error:",
        errorData,
      );
    }
  };

  /* ============================================================
     FORCE SWITCH
     ============================================================ */

  const handleForceSwitch =
    async () => {
      if (!forceSwitchData) {
        console.error(
          "No login data available for force switch.",
        );

        return;
      }

      /* ========================================================
         CLEAR PREVIOUS FORCE SWITCH ERROR
         ======================================================== */

      setForceSwitchError(null);

      try {
        console.log(
          "========== STARTING FORCE SWITCH ==========",
        );

        /* ======================================================
           CALL FORCE SWITCH MUTATION
           ====================================================== */

        const response =
          await loginMutation.forceSwitchMutation.mutateAsync(
            forceSwitchData,
          );

        console.log(
          "========== FORCE SWITCH COMPLETED ==========",
        );

        console.log(response);

        /* ======================================================
           GET USER ROLE
           ====================================================== */

        const role =
          response.data.user.role;

        /* ======================================================
           CLOSE FORCE SWITCH UI
           ====================================================== */

        setShowForceSwitch(false);

        setForceSwitchData(null);

        /* ======================================================
           REDIRECT
           ====================================================== */

        redirectAfterLogin(role);

      } catch (error: any) {
        console.error(
          "Force switch failed:",
          error,
        );

        const message =
          error?.response?.data?.message ??
          error?.message ??
          "Unable to switch this account to your device. Please try again.";

        setForceSwitchError(message);
      }
    };

  /* ============================================================
     CANCEL FORCE SWITCH
     ============================================================ */

  const handleCancelForceSwitch =
    () => {
      setShowForceSwitch(false);

      setForceSwitchData(null);

      setForceSwitchError(null);
    };

  /* ============================================================
     LOADING STATES
     ============================================================ */

  const isLoggingIn =
    loginMutation.isPending;

  const isForceSwitching =
    loginMutation
      .forceSwitchMutation
      .isPending;

  const isSubmitting =
    isLoggingIn ||
    isForceSwitching;

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <>
      <AuthCard>
        <AuthHeader
          title={
            adminOnly
              ? "Administrator Login"
              : "Welcome Back"
          }
          subtitle={
            adminOnly
              ? "Sign in to manage competitions, students, questions, results, and the JAMB League platform."
              : "Sign in to continue your JAMB preparation, compete with others, and climb the leaderboard."
          }
        />

        <form
          onSubmit={handleSubmit(
            onSubmit,
          )}
          className="space-y-6"
        >
          {/* ==================================================
              EMAIL
          ================================================== */}

          <Input
            label="Email Address"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            {...register("email")}
            error={
              errors.email?.message
            }
          />

          {/* ==================================================
              PASSWORD
          ================================================== */}

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register("password")}
            error={
              errors.password?.message
            }
          />

          {/* ==================================================
              FORGOT PASSWORD
          ================================================== */}

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-primary transition hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* ==================================================
              LOGIN ERROR
          ================================================== */}

          {loginMutation.isError &&
            !showForceSwitch && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-600">
                  {loginMutation.error
                    ?.response?.data
                    ?.message ??
                    loginMutation.error
                      ?.message ??
                    "Login failed. Please check your credentials and try again."}
                </p>
              </div>
            )}

          {/* ==================================================
              LOGIN SUCCESS
          ================================================== */}

          {loginMutation.isSuccess && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-medium text-green-700">
                {
                  loginMutation
                    .data?.message
                }
              </p>
            </div>
          )}

          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isLoggingIn
              ? adminOnly
                ? "Signing in..."
                : "Logging in..."
              : adminOnly
              ? "Admin Login"
              : "Login"}
          </Button>
        </form>

        {/* ======================================================
            SOCIAL LOGIN
        ====================================================== */}

        {!adminOnly && (
          <>
            <Divider />

            <SocialLogin />
          </>
        )}

        {/* ======================================================
            FOOTER
        ====================================================== */}

        {!adminOnly ? (
          <AuthFooter
            text="Don't have an account?"
            linkText="Create Account"
            href="/auth/register"
          />
        ) : (
          <AuthFooter
            text="Return to website?"
            linkText="Go Home"
            href="/"
          />
        )}
      </AuthCard>

      {/* ========================================================
          FORCE SWITCH MODAL
      ======================================================== */}

      {showForceSwitch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* ==================================================
                ICON
            ================================================== */}

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6 text-amber-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.8 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                />
              </svg>
            </div>

            {/* ==================================================
                TITLE
            ================================================== */}

            <h2 className="text-xl font-semibold text-gray-900">
              Account Already Active
            </h2>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Your account is currently
              logged in on another device.
            </p>

            {/* ==================================================
                CURRENT DEVICE
            ================================================== */}

            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Current active device
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {currentDevice}
              </p>
            </div>

            {/* ==================================================
                WARNING
            ================================================== */}

            <p className="mt-4 text-sm leading-6 text-gray-600">
              If you continue, the existing
              session on{" "}
              <span className="font-semibold text-gray-900">
                {currentDevice}
              </span>{" "}
              will be logged out and this
              device will become your active
              device.
            </p>

            {/* ==================================================
                FORCE SWITCH ERROR
            ================================================== */}

            {forceSwitchError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-600">
                  {forceSwitchError}
                </p>
              </div>
            )}

            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {/* =================================================
                  CANCEL
              ================================================= */}

              <Button
                type="button"
                variant="outline"
                onClick={
                  handleCancelForceSwitch
                }
                disabled={isForceSwitching}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              {/* =================================================
                  SWITCH DEVICE
              ================================================= */}

              <Button
                type="button"
                onClick={
                  handleForceSwitch
                }
                disabled={isForceSwitching}
                className="w-full sm:w-auto"
              >
                {isForceSwitching
                  ? "Switching..."
                  : "Switch Device"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}