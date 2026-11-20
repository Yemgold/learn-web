




"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuthStore } from "@/stores/auth.store";

import {
  getActiveStudentEnrollmentInSession,
  type StudentEnrollment,
} from "@/lib/schools/portal/services/enrollment.service";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface UseMyActiveEnrollmentResult {
  enrollment: StudentEnrollment | null;
  academicSessionId: string;
  classId: string;
  subjectIds: string[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getId(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record._id === "string") {
      return record._id;
    }

    if (typeof record.id === "string") {
      return record.id;
    }
  }

  return "";
}

function extractSubjectIds(
  enrollment: StudentEnrollment | null
): string[] {
  if (!enrollment) return [];

  const subjects = enrollment.subjectsOffered;

  if (!Array.isArray(subjects)) return [];

  return [
    ...new Set(
      subjects
        .map((subject: unknown) => getId(subject))
        .filter(Boolean)
    ),
  ];
}

/* -------------------------------------------------------------------------- */
/* HOOK                                                                       */
/* -------------------------------------------------------------------------- */

export function useMyActiveEnrollment(
  academicSessionId: string,
  slug?: string
): UseMyActiveEnrollmentResult {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const membership = user?.schoolContext?.userSchoolMembership;

  const schoolMembershipId = membership?._id || "";

  const schoolSubdomain = (
    user?.schoolContext?.subDomain || slug || ""
  )
    .trim()
    .toLowerCase();

  const sessionId = academicSessionId?.trim() || "";

  const [enrollment, setEnrollment] =
    useState<StudentEnrollment | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  /* ------------------------------------------------------------------------ */
  /* LOAD ACTIVE ENROLLMENT                                                   */
  /* ------------------------------------------------------------------------ */

  const loadEnrollment = useCallback(async () => {
    if (!isHydrated) return;

    if (!schoolMembershipId || !sessionId || !schoolSubdomain) {
      setEnrollment(null);
      setError(null);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);
      setError(null);

      const result = await getActiveStudentEnrollmentInSession(
        sessionId,
        schoolMembershipId,
        schoolSubdomain
      );

      if (requestId !== requestIdRef.current) return;

      setEnrollment(result);
    } catch (err: unknown) {
      if (requestId !== requestIdRef.current) return;

      setEnrollment(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your active class enrollment."
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    isHydrated,
    schoolMembershipId,
    sessionId,
    schoolSubdomain,
  ]);

  /* ------------------------------------------------------------------------ */
  /* INITIAL LOAD AND SESSION CHANGES                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    void loadEnrollment();

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadEnrollment]);

  /* ------------------------------------------------------------------------ */
  /* DERIVED VALUES                                                           */
  /* ------------------------------------------------------------------------ */

  const classId = getId(enrollment?.classId);

  const subjectIds = extractSubjectIds(enrollment);

  return {
    enrollment,
    academicSessionId: getId(
      enrollment?.academicSessionId
    ) || sessionId,
    classId,
    subjectIds,
    loading,
    error,
    refresh: loadEnrollment,
  };
}

export default useMyActiveEnrollment;
