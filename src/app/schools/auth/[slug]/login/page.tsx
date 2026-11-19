//\src\app\schools\auth\[slug]\login\page.tsx

"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  School,
  AlertCircle,
  Loader2,
  Monitor,
  RefreshCw,
  Smartphone,
  X,
} from "lucide-react";

import { getSchoolBySubdomain } from "@/lib/schools/management/services/school.service";
import { useLogin } from "@/hooks/auth/useLogin";

/* ============================================================
   TYPES
============================================================ */

interface SchoolInfo {
  id: string;
  name: string;
  slug: string;
  email?: string;
  logo?: string;
  isActive?: boolean;
}

interface LoginFormData {
  email: string;
  password: string;
  schoolSubdomain?: string;
}

/* ============================================================
   HELPERS
============================================================ */

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

/* ============================================================
   EXTRACT SCHOOL INFORMATION
============================================================ */

function extractSchool(response: unknown): SchoolInfo | null {
  if (!isRecord(response)) return null;

  let school: Record<string, unknown> | null = null;

  if (isRecord(response.data)) {
    const data = response.data;

    if (
      typeof data._id === "string" ||
      typeof data.id === "string"
    ) {
      school = data;
    } else if (isRecord(data.school)) {
      school = data.school;
    } else if (isRecord(data.schoolObj)) {
      school = data.schoolObj;
    } else if (
      Array.isArray(data.schoolObj) &&
      isRecord(data.schoolObj[0])
    ) {
      school = data.schoolObj[0];
    }
  }

  if (
    !school &&
    (typeof response._id === "string" ||
      typeof response.id === "string")
  ) {
    school = response;
  }

  if (!school) return null;

  const id = school._id ?? school.id;
  const name = school.schoolName ?? school.name;
  const slug = school.subDomain ?? school.slug;

  if (typeof id !== "string" || typeof name !== "string") {
    return null;
  }

  return {
    id,
    name,
    slug: typeof slug === "string" ? slug : "",
    email:
      typeof school.schoolEmail === "string"
        ? school.schoolEmail
        : typeof school.email === "string"
          ? school.email
          : undefined,
    logo:
      typeof school.logo === "string"
        ? school.logo
        : typeof school.schoolLogo === "string"
          ? school.schoolLogo
          : undefined,
    isActive:
      typeof school.isActive === "boolean"
        ? school.isActive
        : undefined,
  };
}

/* ============================================================
   ERROR HELPERS
============================================================ */

function getErrorResponseData(error: unknown): Record<string, unknown> | null {
  if (!isRecord(error)) return null;

  const response = error.response;

  if (!isRecord(response)) return null;

  return isRecord(response.data) ? response.data : null;
}

function getLoginErrorMessage(error: unknown): string {
  const data = getErrorResponseData(error);

  if (data) {
    if (typeof data.message === "string") {
      return data.message;
    }

    if (typeof data.error === "string") {
      return data.error;
    }
  }

  if (isRecord(error) && typeof error.message === "string") {
    return error.message;
  }

  return "Unable to sign in. Please check your credentials and try again.";
}

/**
 * Only show the force-switch prompt when the backend indicates
 * that an existing session/device is preventing normal login.
 *
 * Invalid credentials must NOT trigger this prompt.
 */
function isForceSwitchRequired(error: unknown): boolean {
  const data = getErrorResponseData(error);

  if (!data) return false;

  const message = [
    data.message,
    data.error,
    data.code,
    data.errorCode,
  ]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  const sessionConflictKeywords = [
    "another device",
    "different device",
    "other device",
    "already logged in",
    "already login",
    "active session",
    "session already exists",
    "device already active",
    "logged in elsewhere",
    "force switch",
    "session conflict",
    "device limit",
  ];

  return sessionConflictKeywords.some((keyword) =>
    message.includes(keyword),
  );
}

/**
 * Attempts to get the existing device name from the backend error.
 */
function getCurrentDeviceName(error: unknown): string {
  const data = getErrorResponseData(error);

  if (!data) return "another device";

  const possibleObjects: Record<string, unknown>[] = [data];

  if (isRecord(data.data)) {
    possibleObjects.push(data.data);
  }

  if (isRecord(data.session)) {
    possibleObjects.push(data.session);
  }

  if (isRecord(data.currentSession)) {
    possibleObjects.push(data.currentSession);
  }

  if (isRecord(data.activeSession)) {
    possibleObjects.push(data.activeSession);
  }

  if (isRecord(data.device)) {
    possibleObjects.push(data.device);
  }

  if (isRecord(data.currentDevice)) {
    possibleObjects.push(data.currentDevice);
  }

  const possibleKeys = [
    "currentDevice",
    "deviceName",
    "activeDevice",
    "activeDeviceName",
    "currentDeviceName",
    "device",
  ];

  for (const object of possibleObjects) {
    for (const key of possibleKeys) {
      const value = object[key];

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }

      if (isRecord(value)) {
        if (
          typeof value.deviceName === "string" &&
          value.deviceName.trim()
        ) {
          return value.deviceName.trim();
        }

        if (
          typeof value.name === "string" &&
          value.name.trim()
        ) {
          return value.name.trim();
        }
      }
    }
  }

  return "another device";
}

/* ============================================================
   SCHOOL LOGIN PAGE
============================================================ */

export default function SchoolLoginPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = params.slug?.trim().toLowerCase() ?? "";

  /* ============================================================
     AUTHENTICATION
  ============================================================ */

  const {
    mutateAsync: login,
    isPending: isSubmitting,
    forceSwitchMutation,
  } = useLogin();

  const isForceSwitching = forceSwitchMutation.isPending;

  /* ============================================================
     SCHOOL STATE
  ============================================================ */

  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [isLoadingSchool, setIsLoadingSchool] = useState(true);
  const [schoolError, setSchoolError] = useState("");

  /* ============================================================
     LOGIN FORM STATE
  ============================================================ */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

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
     LOAD SCHOOL
  ============================================================ */

  const loadSchool = useCallback(async () => {
    if (!slug) {
      setSchool(null);
      setSchoolError("School subdomain is missing.");
      setIsLoadingSchool(false);
      return;
    }

    try {
      setIsLoadingSchool(true);
      setSchoolError("");

      const response = await getSchoolBySubdomain(slug);

      console.log("[SCHOOL LOGIN] API response:", response);

      const schoolData = extractSchool(response);

      if (!schoolData) {
        throw new Error(
          "The school API returned an unexpected response. Please try again.",
        );
      }

      if (schoolData.isActive === false) {
        throw new Error(
          "This school's portal is currently inactive.",
        );
      }

      setSchool(schoolData);
    } catch (error: unknown) {
      console.error(
        "[SCHOOL LOGIN] Failed to load school:",
        error,
      );

      setSchool(null);

      setSchoolError(
        error instanceof Error
          ? error.message
          : "Unable to load this school's portal.",
      );
    } finally {
      setIsLoadingSchool(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadSchool();
  }, [loadSchool]);

  /* ============================================================
     RESET FORCE SWITCH STATE
  ============================================================ */

  const closeForceSwitch = () => {
    setShowForceSwitch(false);
    setForceSwitchData(null);
    setForceSwitchError(null);
  };

  /* ============================================================
     HANDLE NORMAL LOGIN
  ============================================================ */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoginError("");
    setForceSwitchError(null);
    closeForceSwitch();

    if (!email.trim() || !password) {
      setLoginError(
        "Please enter your email and password.",
      );
      return;
    }

    if (!school) {
      setLoginError(
        "School information is unavailable.",
      );
      return;
    }

    const loginData: LoginFormData = {
      email: email.trim().toLowerCase(),
      password,
      schoolSubdomain: slug,
    };

    try {
      console.log(
        "========== SCHOOL LOGIN START ==========",
      );

      console.log({
        schoolName: school.name,
        schoolId: school.id,
        schoolSubdomain: slug,
        email: loginData.email,
      });

      await login(loginData);

      console.log(
        "========== SCHOOL LOGIN SUCCESS ==========",
      );

      router.replace(`/schools/${slug}/dashboard`);
    } catch (error: unknown) {
      console.error(
        "========== SCHOOL LOGIN FAILED ==========",
        error,
      );

      if (isForceSwitchRequired(error)) {
        setForceSwitchData(loginData);
        setCurrentDevice(getCurrentDeviceName(error));
        setForceSwitchError(null);
        setShowForceSwitch(true);
        setLoginError("");
        return;
      }

      setLoginError(getLoginErrorMessage(error));
    }
  };

  /* ============================================================
     HANDLE FORCE SWITCH
  ============================================================ */

  const handleForceSwitch = async () => {
    if (!forceSwitchData || !school) {
      setForceSwitchError(
        "Your login information is unavailable. Please try signing in again.",
      );
      return;
    }

    try {
      setForceSwitchError(null);

      console.log(
        "========== SCHOOL FORCE SWITCH START ==========",
      );

      console.log({
        schoolName: school.name,
        schoolSubdomain: slug,
        email: forceSwitchData.email,
        currentDevice,
      });

      await forceSwitchMutation.mutateAsync({
        email: forceSwitchData.email,
        password: forceSwitchData.password,
        schoolSubdomain: slug,
      });

      console.log(
        "========== SCHOOL FORCE SWITCH SUCCESS ==========",
      );

      closeForceSwitch();

      router.replace(`/schools/${slug}/dashboard`);
    } catch (error: unknown) {
      console.error(
        "========== SCHOOL FORCE SWITCH FAILED ==========",
        error,
      );

      setForceSwitchError(
        getLoginErrorMessage(error),
      );
    }
  };

  /* ============================================================
     LOADING SCREEN
  ============================================================ */

  if (isLoadingSchool) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading school portal...
          </p>
        </div>
      </main>
    );
  }

  /* ============================================================
     SCHOOL ERROR SCREEN
  ============================================================ */

  if (schoolError || !school) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={28} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            School portal unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {schoolError || "We couldn't find this school."}
          </p>

          <button
            type="button"
            onClick={() => void loadSchool()}
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Try again
          </button>

          <Link
            href="/"
            className="mt-4 block text-sm font-medium text-slate-500 hover:text-indigo-600"
          >
            Back to Learnyfi
          </Link>
        </div>
      </main>
    );
  }

  /* ============================================================
     LOGIN PAGE
  ============================================================ */

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* LEFT BRANDING SECTION */}

      <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-12 text-white lg:flex">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            {school.logo ? (
              <img
                src={school.logo}
                alt={`${school.name} logo`}
                className="h-10 w-10 rounded-lg object-contain"
              />
            ) : (
              <School size={27} />
            )}
          </div>

          <div>
            <p className="text-lg font-bold">
              Learnyfi
            </p>

            <p className="text-xs text-indigo-200">
              School Management Platform
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-indigo-100">
            <ShieldCheck size={15} />
            Secure School Portal
          </div>

          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Welcome to your school&apos;s digital learning environment.
          </h1>

          <p className="mt-6 max-w-md text-base leading-8 text-indigo-100">
            Access your academic activities, assessments,
            assignments, results and other school resources
            from one place.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <GraduationCap size={26} />
            </div>

            <div>
              <p className="font-semibold">
                {school.name}
              </p>

              <p className="text-sm text-indigo-200">
                Official school portal
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-indigo-200">
          Powered by Learnyfi · © {new Date().getFullYear()}
        </p>
      </section>

      {/* LOGIN SECTION */}

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          {/* MOBILE BRANDING */}

          <div className="mb-10 text-center lg:hidden">
            <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50 text-indigo-600">
              {school.logo ? (
                <img
                  src={school.logo}
                  alt={`${school.name} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <School size={32} />
              )}
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              {school.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              School Portal
            </p>
          </div>

          {/* FORM HEADING */}

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Welcome back
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your school account details to continue.
            </p>
          </div>

          {/* LOGIN ERROR */}

          {loginError && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <p>{loginError}</p>
            </div>
          )}

          {/* FORCE SWITCH CONFIRMATION */}

          {showForceSwitch && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
              <div className="flex items-start justify-between gap-3 border-b border-amber-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Monitor size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-amber-950">
                      Account already active
                    </h3>

                    <p className="mt-0.5 text-xs text-amber-800">
                      Another device is using this account.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeForceSwitch}
                  disabled={isForceSwitching}
                  aria-label="Close force switch confirmation"
                  className="rounded-lg p-1 text-amber-700 transition hover:bg-amber-100 disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="space-y-4 p-5">
                <p className="text-sm leading-6 text-amber-950">
                  Your account appears to be active on another
                  device. You can switch this session to your
                  current device.
                </p>

                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-white p-3">
                  <Smartphone
                    size={20}
                    className="shrink-0 text-amber-700"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Existing device
                    </p>

                    <p className="truncate text-sm font-semibold text-slate-900">
                      {currentDevice}
                    </p>
                  </div>
                </div>

                {forceSwitchError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <p>{forceSwitchError}</p>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleForceSwitch}
                    disabled={isForceSwitching}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isForceSwitching ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Switching...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={17} />
                        Switch to this device
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={closeForceSwitch}
                    disabled={isForceSwitching}
                    className="h-12 rounded-xl border border-amber-300 bg-white px-5 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs leading-5 text-amber-800">
                  Switching devices may end the existing active
                  session. Only continue if you recognise this
                  account and want to use it here.
                </p>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email address"
                  disabled={isSubmitting || isForceSwitching}
                  className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <Link
                  href={`/schools/${slug}/forgot-password`}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  disabled={isSubmitting || isForceSwitching}
                  className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  disabled={isSubmitting || isForceSwitching}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              disabled={isSubmitting || isForceSwitching}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-xs leading-6 text-slate-500">
              Having trouble accessing your account? Contact
              your school administrator for assistance.
            </p>

            <p className="mt-6 text-xs text-slate-400">
              Powered by{" "}
              <span className="font-semibold text-indigo-600">
                Learnyfi
              </span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}














// "use client";

// import {
//   useCallback,
//   useEffect,
//   useState,
//   type FormEvent,
// } from "react";

// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";

// import {
//   ArrowRight,
//   Eye,
//   EyeOff,
//   GraduationCap,
//   LockKeyhole,
//   Mail,
//   ShieldCheck,
//   School,
//   AlertCircle,
//   Loader2,
// } from "lucide-react";

// import { getSchoolBySubdomain } from "@/lib/schools/management/services/school.service";
// import { useLogin } from "@/hooks/auth/useLogin";

// /* ============================================================
//    TYPES
//    ============================================================ */

// interface SchoolInfo {
//   id: string;
//   name: string;
//   slug: string;
//   email?: string;
//   logo?: string;
//   isActive?: boolean;
// }

// /* ============================================================
//    HELPERS
//    ============================================================ */

// function isRecord(value: unknown): value is Record<string, unknown> {
//   return typeof value === "object" && value !== null && !Array.isArray(value);
// }

// /* ============================================================
//    EXTRACT SCHOOL INFORMATION
//    Supports:
//    1. { success, data: { _id, schoolName, subDomain } }
//    2. { success, data: { schoolObj: [...] } }
//    3. { data: { school: {...} } }
//    ============================================================ */

// function extractSchool(response: unknown): SchoolInfo | null {
//   if (!isRecord(response)) return null;

//   let school: Record<string, unknown> | null = null;

//   // Your confirmed API response:
//   // response.data is the school object itself.
//   if (isRecord(response.data)) {
//     const data = response.data;

//     if (
//       typeof data._id === "string" ||
//       typeof data.id === "string"
//     ) {
//       school = data;
//     } else if (isRecord(data.school)) {
//       school = data.school;
//     } else if (isRecord(data.schoolObj)) {
//       school = data.schoolObj;
//     } else if (Array.isArray(data.schoolObj) && isRecord(data.schoolObj[0])) {
//       school = data.schoolObj[0];
//     }
//   }

//   // Also support an already-unwrapped school object.
//   if (!school && (
//     typeof response._id === "string" ||
//     typeof response.id === "string"
//   )) {
//     school = response;
//   }

//   if (!school) return null;

//   const id = school._id ?? school.id;
//   const name = school.schoolName ?? school.name;
//   const slug = school.subDomain ?? school.slug;

//   if (typeof id !== "string" || typeof name !== "string") {
//     return null;
//   }

//   return {
//     id,
//     name,
//     slug: typeof slug === "string" ? slug : "",
//     email:
//       typeof school.schoolEmail === "string"
//         ? school.schoolEmail
//         : typeof school.email === "string"
//           ? school.email
//           : undefined,
//     logo:
//       typeof school.logo === "string"
//         ? school.logo
//         : typeof school.schoolLogo === "string"
//           ? school.schoolLogo
//           : undefined,
//     isActive:
//       typeof school.isActive === "boolean"
//         ? school.isActive
//         : undefined,
//   };
// }

// /* ============================================================
//    ERROR MESSAGE HELPER
//    ============================================================ */

// function getLoginErrorMessage(error: unknown): string {
//   if (isRecord(error)) {
//     const response = error.response;

//     if (isRecord(response)) {
//       const data = response.data;

//       if (isRecord(data)) {
//         if (typeof data.message === "string") {
//           return data.message;
//         }

//         if (typeof data.error === "string") {
//           return data.error;
//         }
//       }
//     }

//     if (typeof error.message === "string") {
//       return error.message;
//     }
//   }

//   return "Unable to sign in. Please check your credentials and try again.";
// }

// /* ============================================================
//    SCHOOL LOGIN PAGE
//    ============================================================ */

// export default function SchoolLoginPage() {
//   const params = useParams<{ slug: string }>();
//   const router = useRouter();

//   const slug = params.slug?.trim().toLowerCase() ?? "";

//   /* AUTHENTICATION */

//   const {
//     mutateAsync: login,
//     isPending: isSubmitting,
//   } = useLogin();

//   /* SCHOOL STATE */

//   const [school, setSchool] = useState<SchoolInfo | null>(null);
//   const [isLoadingSchool, setIsLoadingSchool] = useState(true);
//   const [schoolError, setSchoolError] = useState("");

//   /* FORM STATE */

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginError, setLoginError] = useState("");

//   /* ============================================================
//      LOAD SCHOOL
//      ============================================================ */

//   const loadSchool = useCallback(async () => {
//     if (!slug) {
//       setSchool(null);
//       setSchoolError("School subdomain is missing.");
//       setIsLoadingSchool(false);
//       return;
//     }

//     try {
//       setIsLoadingSchool(true);
//       setSchoolError("");

//       const response = await getSchoolBySubdomain(slug);

//       console.log("[SCHOOL LOGIN] API response:", response);

//       const schoolData = extractSchool(response);

//       if (!schoolData) {
//         throw new Error(
//           "The school API returned an unexpected response. Please try again.",
//         );
//       }

//       if (schoolData.isActive === false) {
//         throw new Error("This school's portal is currently inactive.");
//       }

//       setSchool(schoolData);
//     } catch (error: unknown) {
//       console.error("[SCHOOL LOGIN] Failed to load school:", error);

//       setSchool(null);

//       setSchoolError(
//         error instanceof Error
//           ? error.message
//           : "Unable to load this school's portal.",
//       );
//     } finally {
//       setIsLoadingSchool(false);
//     }
//   }, [slug]);

//   useEffect(() => {
//     void loadSchool();
//   }, [loadSchool]);

//   /* ============================================================
//      HANDLE LOGIN
//      ============================================================ */

//   const handleSubmit = async (
//     event: FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();
//     setLoginError("");

//     if (!email.trim() || !password) {
//       setLoginError("Please enter your email and password.");
//       return;
//     }

//     if (!school) {
//       setLoginError("School information is unavailable.");
//       return;
//     }

//     try {
//       console.log("========== SCHOOL LOGIN START ==========");
//       console.log({
//         schoolName: school.name,
//         schoolId: school.id,
//         schoolSubdomain: slug,
//         email: email.trim().toLowerCase(),
//       });

//       // The useLogin hook passes schoolSubdomain to loginUser.
//       // loginUser sends it through the x-school-subdomain header.
//       // It is NOT included in the login request body.

//       await login({
//         email: email.trim().toLowerCase(),
//         password,
//         schoolSubdomain: slug,
//       });

//       console.log("========== SCHOOL LOGIN SUCCESS ==========");

//       router.replace(`/schools/${slug}/dashboard`);
//     } catch (error: unknown) {
//       console.error("========== SCHOOL LOGIN FAILED ==========", error);
//       setLoginError(getLoginErrorMessage(error));
//     }
//   };

//   /* ============================================================
//      LOADING SCREEN
//      ============================================================ */

//   if (isLoadingSchool) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <Loader2 className="mx-auto h-9 w-9 animate-spin text-indigo-600" />
//           <p className="mt-4 text-sm font-medium text-slate-600">
//             Loading school portal...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   /* ============================================================
//      SCHOOL ERROR SCREEN
//      ============================================================ */

//   if (schoolError || !school) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
//         <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
//             <AlertCircle size={28} />
//           </div>

//           <h1 className="mt-5 text-xl font-bold text-slate-900">
//             School portal unavailable
//           </h1>

//           <p className="mt-2 text-sm leading-6 text-slate-500">
//             {schoolError || "We couldn't find this school."}
//           </p>

//           <button
//             type="button"
//             onClick={() => void loadSchool()}
//             className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
//           >
//             Try again
//           </button>

//           <Link
//             href="/"
//             className="mt-4 block text-sm font-medium text-slate-500 hover:text-indigo-600"
//           >
//             Back to Learnyfi
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   /* ============================================================
//      LOGIN PAGE
//      ============================================================ */

//   return (
//     <main className="grid min-h-screen bg-white lg:grid-cols-2">
//       {/* LEFT BRANDING SECTION */}

//       <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-12 text-white lg:flex">
//         <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
//         <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

//         <div className="relative z-10 flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
//             {school.logo ? (
//               <img
//                 src={school.logo}
//                 alt={`${school.name} logo`}
//                 className="h-10 w-10 rounded-lg object-contain"
//               />
//             ) : (
//               <School size={27} />
//             )}
//           </div>

//           <div>
//             <p className="text-lg font-bold">Learnyfi</p>
//             <p className="text-xs text-indigo-200">
//               School Management Platform
//             </p>
//           </div>
//         </div>

//         <div className="relative z-10 max-w-lg">
//           <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-indigo-100">
//             <ShieldCheck size={15} />
//             Secure School Portal
//           </div>

//           <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
//             Welcome to your school&apos;s digital learning environment.
//           </h1>

//           <p className="mt-6 max-w-md text-base leading-8 text-indigo-100">
//             Access your academic activities, assessments, assignments,
//             results and other school resources from one place.
//           </p>

//           <div className="mt-10 flex items-center gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
//               <GraduationCap size={26} />
//             </div>

//             <div>
//               <p className="font-semibold">{school.name}</p>
//               <p className="text-sm text-indigo-200">
//                 Official school portal
//               </p>
//             </div>
//           </div>
//         </div>

//         <p className="relative z-10 text-xs text-indigo-200">
//           Powered by Learnyfi · © {new Date().getFullYear()}
//         </p>
//       </section>

//       {/* LOGIN SECTION */}

//       <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
//         <div className="w-full max-w-md">
//           {/* MOBILE BRANDING */}

//           <div className="mb-10 text-center lg:hidden">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50 text-indigo-600">
//               {school.logo ? (
//                 <img
//                   src={school.logo}
//                   alt={`${school.name} logo`}
//                   className="h-full w-full object-contain"
//                 />
//               ) : (
//                 <School size={32} />
//               )}
//             </div>

//             <h1 className="mt-4 text-xl font-bold text-slate-900">
//               {school.name}
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               School Portal
//             </p>
//           </div>

//           {/* FORM HEADING */}

//           <div className="mb-8">
//             <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
//               Welcome back
//             </p>

//             <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
//               Sign in to your account
//             </h2>

//             <p className="mt-3 text-sm leading-6 text-slate-500">
//               Enter your school account details to continue.
//             </p>
//           </div>

//           {/* LOGIN ERROR */}

//           {loginError && (
//             <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//               <AlertCircle size={18} className="mt-0.5 shrink-0" />
//               <p>{loginError}</p>
//             </div>
//           )}

//           {/* LOGIN FORM */}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* EMAIL */}

//             <div>
//               <label
//                 htmlFor="email"
//                 className="mb-2 block text-sm font-semibold text-slate-700"
//               >
//                 Email address
//               </label>

//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

//                 <input
//                   id="email"
//                   type="email"
//                   autoComplete="username"
//                   required
//                   value={email}
//                   onChange={(event) => setEmail(event.target.value)}
//                   placeholder="Enter your email address"
//                   disabled={isSubmitting}
//                   className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
//                 />
//               </div>
//             </div>

//             {/* PASSWORD */}

//             <div>
//               <div className="mb-2 flex items-center justify-between">
//                 <label
//                   htmlFor="password"
//                   className="text-sm font-semibold text-slate-700"
//                 >
//                   Password
//                 </label>

//                 <Link
//                   href={`/schools/${slug}/forgot-password`}
//                   className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <div className="relative">
//                 <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   onChange={(event) => setPassword(event.target.value)}
//                   placeholder="Enter your password"
//                   disabled={isSubmitting}
//                   className="h-13 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60"
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((previous) => !previous)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                   disabled={isSubmitting}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
//                 >
//                   {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
//                 </button>
//               </div>
//             </div>

//             {/* SUBMIT BUTTON */}

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 size={18} className="animate-spin" />
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   Sign in
//                   <ArrowRight size={18} />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* FOOTER */}

//           <div className="mt-8 border-t border-slate-100 pt-6 text-center">
//             <p className="text-xs leading-6 text-slate-500">
//               Having trouble accessing your account? Contact your school
//               administrator for assistance.
//             </p>

//             <p className="mt-6 text-xs text-slate-400">
//               Powered by{" "}
//               <span className="font-semibold text-indigo-600">
//                 Learnyfi
//               </span>
//             </p>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
