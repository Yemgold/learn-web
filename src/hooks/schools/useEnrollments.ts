




"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useAuthStore } from "@/stores/auth.store";

import { getAcademicSessions } from "@/lib/schools/portal/services/academicsessions";

import {
  countClassEnrollments,
  enrolStudentIntoClass,
  getStudentEnrollmentsInAcademicSession,
  transferStudentToAnotherClass,
  updateStudentEnrollmentStatus,
} from "@/lib/schools/portal/services/enrollment.service";

import {
  getSchoolMembers,
  type SchoolMember,
} from "@/lib/schools/portal/services/member.service";

import {
  getSchoolClasses,
  type SchoolClass,
} from "@/lib/schools/portal/services/class.service";

import {
  getSchoolSubjects,
  type SchoolSubject,
} from "@/lib/schools/portal/services/subject.service";

import type {
  AcademicSessionOption,
  Enrollment,
  EnrollmentCount,
  EnrollmentSummaryData,
} from "@/types/schools/enrollment.types";

import {
  extractAcademicSessions,
  extractEnrollmentCount,
  getEnrollmentId,
  getObjectName,
  getStudentEmail,
  getStudentName,
} from "@/lib/schools/utils/enrollment.utils";

/* =========================================================
   LOCAL API TYPES
========================================================= */

interface PopulatedStudentUser {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

type MembershipUser =
  | string
  | PopulatedStudentUser
  | null
  | undefined;

interface EnrollmentMembershipRecord {
  _id?: string;
  id?: string;
  userId?: MembershipUser;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface ClassReference {
  _id?: string;
  id?: string;
  classId?: string;
  name?: string;
  arm?: string;
}

/**
 * Do not extend Enrollment directly while changing classId.
 *
 * Enrollment.classId does not allow null, but the API can return null.
 * Omit the conflicting properties first, then define the API versions.
 */
type EnrollmentApiRecord = Omit<
  Enrollment,
  "class" | "classId"
> & {
  schoolMembershipId?: string | { _id?: string; id?: string } | null;
  studentId?: string | { _id?: string; id?: string } | null;
  class?: string | ClassReference | null;
  classId?: string | ClassReference | null;
};

/* =========================================================
   HELPERS
========================================================= */

function getRequestErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (
      typeof response?.data?.message === "string" &&
      response.data.message.trim()
    ) {
      return response.data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/**
 * Extract an ID from a string or populated object.
 */
function getRecordId(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const record = value as {
    _id?: unknown;
    id?: unknown;
    classId?: unknown;
  };

  const id = record._id ?? record.id ?? record.classId;

  return typeof id === "string" ? id.trim() : "";
}

/**
 * Extract the school membership ID.
 *
 * Enrollment.schoolMembershipId must match SchoolMember._id,
 * not SchoolMember.userId.
 */
function getEnrollmentMembershipId(
  enrollment: EnrollmentApiRecord
): string {
  return getRecordId(enrollment.schoolMembershipId);
}

/**
 * Extract a class ID from a string or populated class object.
 */
function getClassId(value: unknown): string {
  return getRecordId(value);
}

/**
 * Extract a class name from a populated class object.
 */
function getClassName(value: unknown): string {
  if (!value || typeof value !== "object") {
    return "";
  }

  const record = value as ClassReference;

  const name =
    typeof record.name === "string"
      ? record.name.trim()
      : "";

  const arm =
    typeof record.arm === "string"
      ? record.arm.trim()
      : "";

  if (name && arm) {
    return `${name} ${arm}`;
  }

  return name || arm;
}

/**
 * Only ACTIVE enrollments prevent another enrollment
 * in the same academic session.
 */
function isActiveEnrollment(
  enrollment: Enrollment
): boolean {
  return String(enrollment.status ?? "").toUpperCase() === "ACTIVE";
}

/**
 * Withdrawn enrollments must not be displayed or counted.
 */
function isWithdrawnEnrollment(
  enrollment: EnrollmentApiRecord
): boolean {
  return String(enrollment.status ?? "")
    .trim()
    .toUpperCase() === "WITHDRAWN";
}

/* =========================================================
   HOOK
========================================================= */

export function useEnrollments(slug: string) {
  /* =========================================================
     AUTH / SCHOOL CONTEXT
  ========================================================= */

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const schoolId =
    user?.schoolContext?.userSchoolMembership?.schoolId;

  const schoolSubdomain =
    user?.schoolContext?.subDomain || slug;

  /* =========================================================
     ACADEMIC SESSION STATE
  ========================================================= */

  const [academicSessionId, setAcademicSessionId] = useState("");

  const [academicSessions, setAcademicSessions] = useState<
    AcademicSessionOption[]
  >([]);

  const [sessionsLoading, setSessionsLoading] = useState(false);

  /* =========================================================
     ENROLLMENT STATE
  ========================================================= */

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [counts, setCounts] = useState<EnrollmentCount>({});

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(false);

  const [countLoading, setCountLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [enrollmentsLoadedForSession, setEnrollmentsLoadedForSession] =
    useState("");

  const enrollmentRequestId = useRef(0);

  /* =========================================================
     FEEDBACK STATE
  ========================================================= */

  const [pageError, setPageError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /* =========================================================
     MODAL STATE
  ========================================================= */

  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const [showTransferModal, setShowTransferModal] = useState(false);

  const [selectedEnrollment, setSelectedEnrollment] =
    useState<Enrollment | null>(null);

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [schoolMembershipId, setSchoolMembershipId] = useState("");

  const [classId, setClassId] = useState("");

  const [targetClassId, setTargetClassId] = useState("");

  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  /* =========================================================
     STUDENT, CLASS AND SUBJECT OPTIONS
  ========================================================= */

  const [students, setStudents] = useState<SchoolMember[]>([]);

  const [classes, setClasses] = useState<SchoolClass[]>([]);

  const [schoolSubjects, setSchoolSubjects] = useState<SchoolSubject[]>([]);

  const [optionsLoading, setOptionsLoading] = useState(false);

  /* =========================================================
     SUCCESS / ERROR HANDLERS
  ========================================================= */

  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setPageError("");
  }, []);

  const showError = useCallback(
    (error: unknown, fallback: string) => {
      console.error("[ENROLLMENTS]", error);

      const message = getRequestErrorMessage(error, fallback);

      setPageError(
        message.length < 180 ? message : fallback
      );

      setSuccessMessage("");
    },
    []
  );

  /* =========================================================
     LOAD STUDENTS, CLASSES AND SUBJECTS
  ========================================================= */

  const loadEnrollmentOptions = useCallback(async () => {
    if (!isHydrated) return;

    if (!schoolId || !schoolSubdomain) {
      setStudents([]);
      setClasses([]);
      setSchoolSubjects([]);

      setPageError(
        "School information is unavailable. Please refresh your school portal."
      );

      return;
    }

    setOptionsLoading(true);

    try {
      const [
        membersResult,
        classesResult,
        subjectsResult,
      ] = await Promise.allSettled([
        getSchoolMembers(schoolId, schoolSubdomain),
        getSchoolClasses(schoolSubdomain),
        getSchoolSubjects(schoolSubdomain),
      ]);

      const optionErrors: string[] = [];

      /* -----------------------------------------------
         PROCESS STUDENTS
      ----------------------------------------------- */

      if (membersResult.status === "fulfilled") {
        const fetchedStudents = Array.isArray(
          membersResult.value.members
        )
          ? membersResult.value.members.filter(
              (member) =>
                member.role === "STUDENT" &&
                member.isActive === true &&
                Boolean(member._id)
            )
          : [];

        setStudents(fetchedStudents);
      } else {
        console.error(
          "[ENROLLMENT STUDENTS]",
          membersResult.reason
        );

        setStudents([]);

        optionErrors.push(
          `Students: ${getRequestErrorMessage(
            membersResult.reason,
            "Unable to load students."
          )}`
        );
      }

      /* -----------------------------------------------
         PROCESS CLASSES
      ----------------------------------------------- */

      if (classesResult.status === "fulfilled") {
        const fetchedClasses = Array.isArray(
          classesResult.value.classes
        )
          ? classesResult.value.classes.filter(
              (schoolClass) =>
                schoolClass.isActive &&
                Boolean(
                  schoolClass._id ||
                    schoolClass.id ||
                    schoolClass.classId
                )
            )
          : [];

        setClasses(fetchedClasses);
      } else {
        console.error(
          "[ENROLLMENT CLASSES]",
          classesResult.reason
        );

        setClasses([]);

        optionErrors.push(
          `Classes: ${getRequestErrorMessage(
            classesResult.reason,
            "Unable to load classes."
          )}`
        );
      }

      /* -----------------------------------------------
         PROCESS SUBJECTS
      ----------------------------------------------- */

      if (subjectsResult.status === "fulfilled") {
        const fetchedSubjects = Array.isArray(
          subjectsResult.value.subjects
        )
          ? subjectsResult.value.subjects.filter(
              (subject) =>
                subject.isActive &&
                Boolean(subject._id || subject.id)
            )
          : [];

        setSchoolSubjects(fetchedSubjects);
      } else {
        console.error(
          "[ENROLLMENT SUBJECTS]",
          subjectsResult.reason
        );

        setSchoolSubjects([]);

        optionErrors.push(
          `Subjects: ${getRequestErrorMessage(
            subjectsResult.reason,
            "Unable to load subjects."
          )}`
        );
      }

      /* -----------------------------------------------
         HANDLE OPTION ERRORS
      ----------------------------------------------- */

      if (optionErrors.length > 0) {
        setPageError(
          `Unable to load enrollment options. ${optionErrors.join(" ")}`
        );

        setSuccessMessage("");
      } else {
        setPageError((current) => {
          if (
            current.startsWith(
              "Unable to load enrollment options."
            )
          ) {
            return "";
          }

          return current;
        });
      }
    } catch (error) {
      console.error("[ENROLLMENT OPTIONS]", error);

      setPageError(
        "Unable to load enrollment options. Please refresh and try again."
      );

      setSuccessMessage("");
    } finally {
      setOptionsLoading(false);
    }
  }, [isHydrated, schoolId, schoolSubdomain]);

  /* =========================================================
     INITIAL OPTIONS LOAD
  ========================================================= */

  useEffect(() => {
    if (isHydrated) {
      void loadEnrollmentOptions();
    }
  }, [isHydrated, loadEnrollmentOptions]);

  /* =========================================================
     FETCH ACADEMIC SESSIONS
  ========================================================= */

  const fetchAcademicSessions = useCallback(async () => {
    if (!isHydrated) return;

    if (!schoolSubdomain) {
      setAcademicSessions([]);
      setAcademicSessionId("");

      setPageError(
        "School subdomain is unavailable. Please refresh and try again."
      );

      return;
    }

    try {
      setSessionsLoading(true);

      const response = await getAcademicSessions(schoolSubdomain);

      const sessions = extractAcademicSessions(response);

      setAcademicSessions(sessions);

      setAcademicSessionId((currentId) => {
        if (
          currentId &&
          sessions.some((session) => session._id === currentId)
        ) {
          return currentId;
        }

        return "";
      });
    } catch (error) {
      console.error("[ACADEMIC SESSIONS]", error);

      setAcademicSessions([]);

      setPageError(
        getRequestErrorMessage(
          error,
          "Unable to load academic sessions. Please refresh and try again."
        )
      );

      setSuccessMessage("");
    } finally {
      setSessionsLoading(false);
    }
  }, [isHydrated, schoolSubdomain]);

  /* =========================================================
     INITIAL ACADEMIC SESSION LOAD
  ========================================================= */

  useEffect(() => {
    if (isHydrated) {
      void fetchAcademicSessions();
    }
  }, [isHydrated, fetchAcademicSessions]);

  /* =========================================================
     BUILD CLASS LOOKUP
  ========================================================= */

  const classMap = useMemo(() => {
    const map = new Map<string, SchoolClass>();

    classes.forEach((schoolClass) => {
      const possibleIds = [
        schoolClass._id,
        schoolClass.id,
        schoolClass.classId,
      ];

      possibleIds.forEach((id) => {
        if (typeof id === "string" && id.trim()) {
          map.set(id.trim(), schoolClass);
        }
      });
    });

    return map;
  }, [classes]);

  /* =========================================================
     SUBJECTS ATTACHED TO THE SELECTED CLASS
  ========================================================= */

  const selectedClassSubjects = useMemo(() => {
    const selectedClass = classMap.get(classId);

    if (!selectedClass) return [];

    const subjectMap = new Map<string, SchoolSubject>();

    schoolSubjects.forEach((subject) => {
      const subjectId = subject._id ?? subject.id;

      if (subjectId) {
        subjectMap.set(subjectId, subject);
      }
    });

    return (selectedClass.subjects ?? [])
      .map((subjectId) => subjectMap.get(subjectId))
      .filter(
        (subject): subject is SchoolSubject =>
          Boolean(subject && subject.isActive)
      );
  }, [classId, classMap, schoolSubjects]);

  /* =========================================================
     CLASS / SUBJECT SELECTION HANDLERS
  ========================================================= */

  const handleClassChange = useCallback(
    (value: string) => {
      setClassId(value);

      const selectedClass = classMap.get(value);

      if (!selectedClass) {
        setSelectedSubjectIds([]);
        return;
      }

      const activeSubjectIds = new Set(
        schoolSubjects
          .filter((subject) => subject.isActive)
          .map((subject) => subject._id ?? subject.id ?? "")
          .filter(Boolean)
      );

      const attachedSubjectIds = (
        selectedClass.subjects ?? []
      ).filter((subjectId) => activeSubjectIds.has(subjectId));

      setSelectedSubjectIds([...new Set(attachedSubjectIds)]);
    },
    [classMap, schoolSubjects]
  );

  const handleSubjectChange = useCallback(
    (subjectId: string) => {
      setSelectedSubjectIds((current) =>
        current.includes(subjectId)
          ? current.filter((id) => id !== subjectId)
          : [...current, subjectId]
      );
    },
    []
  );

  const handleSelectAllSubjects = useCallback(
    (checked: boolean) => {
      setSelectedSubjectIds(
        checked
          ? selectedClassSubjects
              .map((subject) => subject._id ?? subject.id ?? "")
              .filter(Boolean)
          : []
      );
    },
    [selectedClassSubjects]
  );

  /* =========================================================
     FETCH ENROLLMENTS

     1. Fetch enrollments for the selected session.
     2. Exclude WITHDRAWN enrollments immediately.
     3. Match schoolMembershipId with membership._id.
     4. Resolve populated or unpopulated userId.
     5. Attach student details.
     6. Resolve class IDs into actual class names.
  ========================================================= */

  const fetchEnrollments = useCallback(async () => {
    const currentSessionId = academicSessionId.trim();

    if (!currentSessionId || !schoolSubdomain) {
      enrollmentRequestId.current += 1;

      setEnrollments([]);
      setEnrollmentsLoadedForSession("");

      return;
    }

    const requestId = ++enrollmentRequestId.current;

    try {
      setLoading(true);

      setEnrollmentsLoadedForSession("");

      const response = await getStudentEnrollmentsInAcademicSession(
        currentSessionId,
        schoolSubdomain
      );

      const rawEnrollments = (
        Array.isArray(response.enrollments)
          ? response.enrollments
          : []
      ) as unknown as EnrollmentApiRecord[];

      if (requestId !== enrollmentRequestId.current) {
        return;
      }

      /* -----------------------------------------------
         BUILD MEMBERSHIP LOOKUP
      ----------------------------------------------- */

      const membershipMap = new Map<
        string,
        EnrollmentMembershipRecord
      >();

      students.forEach((member) => {
        const membership =
          member as unknown as EnrollmentMembershipRecord;

        const membershipId = getRecordId(membership._id);

        if (membershipId) {
          membershipMap.set(membershipId, membership);
        }
      });

      /* -----------------------------------------------
         REMOVE WITHDRAWN ENROLLMENTS

         Withdrawn records are excluded before:
         - Table display
         - Summary calculations
         - Active enrollment checks
         - Available student calculations
      ----------------------------------------------- */

      const visibleRawEnrollments = rawEnrollments.filter(
        (enrollment) => !isWithdrawnEnrollment(enrollment)
      );

      /* -----------------------------------------------
         ENRICH ENROLLMENTS
      ----------------------------------------------- */

      const fetchedEnrollments = visibleRawEnrollments.map(
        (typedEnrollment) => {
          /* -------------------------------------------
             RESOLVE STUDENT MEMBERSHIP
          ------------------------------------------- */

          const membershipId =
            getEnrollmentMembershipId(typedEnrollment);

          const membership = membershipMap.get(membershipId);

          const membershipUser: MembershipUser =
            membership?.userId;

          const populatedUser: PopulatedStudentUser | undefined =
            membershipUser &&
            typeof membershipUser === "object"
              ? membershipUser
              : undefined;

          const existingStudent =
            typedEnrollment.student &&
            typeof typedEnrollment.student === "object"
              ? typedEnrollment.student
              : {};

          const existingStudentRecord = existingStudent as {
            _id?: string;
            id?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
          };

          const firstName =
            populatedUser?.firstName ??
            membership?.firstName ??
            existingStudentRecord.firstName ??
            "";

          const lastName =
            populatedUser?.lastName ??
            membership?.lastName ??
            existingStudentRecord.lastName ??
            "";

          const email =
            populatedUser?.email ??
            membership?.email ??
            existingStudentRecord.email ??
            "";

          const studentId =
            populatedUser?._id ??
            populatedUser?.id ??
            (typeof membershipUser === "string"
              ? membershipUser
              : undefined) ??
            getRecordId(typedEnrollment.studentId) ??
            existingStudentRecord._id ??
            existingStudentRecord.id ??
            "";

          /* -------------------------------------------
             RESOLVE CLASS
          ------------------------------------------- */

          const classReference = typedEnrollment.class;

          const classIdReference =
            getClassId(classReference) ||
            getClassId(typedEnrollment.classId);

          const matchedClass = classIdReference
            ? classMap.get(classIdReference)
            : undefined;

          const existingClassName =
            getClassName(classReference) ||
            getClassName(typedEnrollment.classId);

          const resolvedClassName =
            existingClassName ||
            (matchedClass
              ? getClassName(matchedClass)
              : "");

          const resolvedClassId =
            classIdReference ||
            (matchedClass
              ? getClassId(matchedClass)
              : "");

          /* -------------------------------------------
             RETURN ENRICHED ENROLLMENT
          ------------------------------------------- */

          return {
            ...typedEnrollment,

            student: {
              ...existingStudentRecord,
              _id: studentId,
              firstName,
              lastName,
              email,
            },

            class: {
              ...(classReference &&
              typeof classReference === "object"
                ? classReference
                : {}),

              _id: resolvedClassId,
              name: resolvedClassName,
            },
          };
        }
      );

      if (requestId !== enrollmentRequestId.current) {
        return;
      }

      setEnrollments(
        fetchedEnrollments as unknown as Enrollment[]
      );

      setEnrollmentsLoadedForSession(currentSessionId);
    } catch (error) {
      if (requestId !== enrollmentRequestId.current) {
        return;
      }

      showError(
        error,
        "Unable to load student enrollments. Please try again."
      );

      setEnrollments([]);
      setEnrollmentsLoadedForSession("");
    } finally {
      if (requestId === enrollmentRequestId.current) {
        setLoading(false);
      }
    }
  }, [
    academicSessionId,
    schoolSubdomain,
    students,
    classMap,
    showError,
  ]);

  /* =========================================================
     FETCH ENROLLMENT COUNTS
  ========================================================= */

//   const fetchCounts = useCallback(async () => {
//     if (!academicSessionId.trim() || !schoolSubdomain) {
//       setCounts({});
//       return;
//     }

//     try {
//       setCountLoading(true);

//       const response = await countClassEnrollments(
//         academicSessionId.trim(),
//         schoolSubdomain
//       );

//       setCounts(extractEnrollmentCount(response));
//     } catch (error) {
//       console.error("[ENROLLMENT COUNTS]", error);

//       setCounts({});
//     } finally {
//       setCountLoading(false);
//     }
//   }, [academicSessionId, schoolSubdomain]);





const fetchCounts = useCallback(async () => {
  if (!academicSessionId.trim() || !schoolSubdomain) {
    setCounts({});
    return;
  }

  try {
    setCountLoading(true);

    const response = await countClassEnrollments(
      academicSessionId.trim(),
      schoolSubdomain
    );

    setCounts(extractEnrollmentCount(response));
  } catch (error) {
    console.error("[ENROLLMENT COUNTS]", error);
    setCounts({});
  } finally {
    setCountLoading(false);
  }
}, [academicSessionId, schoolSubdomain]);

  /* =========================================================
     REFRESH ENROLLMENT DATA
  ========================================================= */

  const refreshData = useCallback(async () => {
    if (!academicSessionId.trim()) {
      setEnrollments([]);
      setCounts({});
      setEnrollmentsLoadedForSession("");

      return;
    }

    await Promise.all([
      fetchEnrollments(),
      fetchCounts(),
    ]);
  }, [academicSessionId, fetchEnrollments, fetchCounts]);

  /* =========================================================
     LOAD DATA WHEN SESSION CHANGES
  ========================================================= */

  useEffect(() => {
    if (!isHydrated) return;

    if (!academicSessionId.trim()) {
      enrollmentRequestId.current += 1;

      setEnrollments([]);
      setCounts({});
      setEnrollmentsLoadedForSession("");

      return;
    }

    void refreshData();
  }, [isHydrated, academicSessionId, refreshData]);

  /* =========================================================
     ACADEMIC SESSION CHANGE
  ========================================================= */

  const handleSessionChange = useCallback((value: string) => {
    enrollmentRequestId.current += 1;

    setAcademicSessionId(value);

    setEnrollments([]);
    setCounts({});

    setEnrollmentsLoadedForSession("");

    setSearch("");
    setStatusFilter("ALL");

    setSchoolMembershipId("");
    setClassId("");
    setSelectedSubjectIds([]);

    setSuccessMessage("");
  }, []);

  /* =========================================================
     SELECTED SESSION
  ========================================================= */

  const selectedSession = academicSessions.find(
    (session) => session._id === academicSessionId
  );

  /* =========================================================
     STUDENTS ALREADY ENROLLED IN SELECTED SESSION
  ========================================================= */

  const activeMembershipIds = useMemo(() => {
    return new Set(
      enrollments
        .filter(isActiveEnrollment)
        .map((enrollment) =>
          getEnrollmentMembershipId(
            enrollment as unknown as EnrollmentApiRecord
          )
        )
        .filter(Boolean)
    );
  }, [enrollments]);

  /* =========================================================
     STUDENTS AVAILABLE FOR ENROLLMENT
  ========================================================= */

  const availableStudents = useMemo(() => {
    const enrollmentDataReady =
      Boolean(academicSessionId) &&
      enrollmentsLoadedForSession === academicSessionId &&
      !loading;

    if (!enrollmentDataReady) {
      return [];
    }

    return students.filter((student) => {
      const membershipId = getRecordId(student._id);

      return (
        Boolean(membershipId) &&
        !activeMembershipIds.has(membershipId)
      );
    });
  }, [
    students,
    activeMembershipIds,
    academicSessionId,
    enrollmentsLoadedForSession,
    loading,
  ]);

  /* =========================================================
     FILTER ENROLLMENTS
  ========================================================= */

  const filteredEnrollments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enrollments.filter((enrollment) => {
      // Safety check: withdrawn records must never appear.
      const status = String(
        enrollment.status || ""
      ).toUpperCase();

      if (status === "WITHDRAWN") {
        return false;
      }

      const studentName = getStudentName(enrollment).toLowerCase();

      const studentEmail = getStudentEmail(enrollment).toLowerCase();

      const admissionNumber = String(
        enrollment.admissionNumber ||
          enrollment.student?.admissionNumber ||
          ""
      ).toLowerCase();

      const className = (
        getObjectName(enrollment.class) ||
        getObjectName(enrollment.classId)
      ).toLowerCase();

      const matchesSearch =
        !query ||
        studentName.includes(query) ||
        studentEmail.includes(query) ||
        admissionNumber.includes(query) ||
        className.includes(query);

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enrollments, search, statusFilter]);

  /* =========================================================
     ENROLLMENT SUMMARY

     Withdrawn records are already excluded from enrollments.
     Therefore:
     - Total excludes withdrawn.
     - Active excludes withdrawn.
     - Completed excludes withdrawn.
     - Withdrawn remains zero.
  ========================================================= */

  const summary = useMemo<EnrollmentSummaryData>(
    () => ({
      total: enrollments.length,

      active: enrollments.filter(
        (item) => item.status?.toUpperCase() === "ACTIVE"
      ).length,

      completed: enrollments.filter(
        (item) => item.status?.toUpperCase() === "COMPLETED"
      ).length,

      withdrawn: 0,
    }),
    [enrollments]
  );

  /* =========================================================
     ENROLL STUDENT
  ========================================================= */

const handleEnrollStudent = useCallback(
  async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!academicSessionId.trim()) {
      setPageError("Select an academic session first.");
      return;
    }

    if (!schoolMembershipId.trim() || !classId.trim()) {
      setPageError(
        "Student membership ID and class ID are required."
      );
      return;
    }

    if (selectedSubjectIds.length === 0) {
      setPageError("Select at least one subject for this student.");
      return;
    }

    if (
      loading ||
      enrollmentsLoadedForSession !== academicSessionId
    ) {
      setPageError(
        "Please wait while the current session's enrollments finish loading."
      );
      return;
    }

    if (activeMembershipIds.has(schoolMembershipId.trim())) {
      setPageError(
        "This student already has an active enrollment in this academic session. Use the transfer operation to change the class."
      );

      setSchoolMembershipId("");
      return;
    }

    try {
      setSubmitting(true);
      setPageError("");

      await enrolStudentIntoClass(
        academicSessionId.trim(),
        {
          schoolMembershipId: schoolMembershipId.trim(),
          classId: classId.trim(),
          subjectsOffered: [...new Set(selectedSubjectIds)],
        },
        schoolSubdomain
      );

      setShowEnrollModal(false);

      setSchoolMembershipId("");
      setClassId("");
      setSelectedSubjectIds([]);

      showSuccess("Student enrolled successfully.");

      await refreshData();
    } catch (error) {
      showError(
        error,
        "Unable to enroll this student. Please check the student membership, class and selected subjects."
      );
    } finally {
      setSubmitting(false);
    }
  },
  [
    academicSessionId,
    schoolMembershipId,
    classId,
    selectedSubjectIds,
    schoolSubdomain,
    loading,
    enrollmentsLoadedForSession,
    activeMembershipIds,
    showSuccess,
    showError,
    refreshData,
  ]
);

  /* =========================================================
     TRANSFER STUDENT
  ========================================================= */

  const handleTransferStudent = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedEnrollment) return;

      if (!academicSessionId.trim()) {
        setPageError("Select an academic session first.");
        return;
      }

      const enrollmentId = getEnrollmentId(selectedEnrollment);

      if (!enrollmentId) {
        setPageError(
          "The selected enrollment does not have a valid ID."
        );

        return;
      }

      if (!targetClassId.trim()) {
        setPageError("Select the destination class.");
        return;
      }

      try {
        setSubmitting(true);
        setPageError("");

        await transferStudentToAnotherClass(
          academicSessionId.trim(),
          enrollmentId,
          {
            targetClassId: targetClassId.trim(),
          },
          schoolSubdomain
        );

        setShowTransferModal(false);

        setSelectedEnrollment(null);
        setTargetClassId("");

        showSuccess("Student transfer submitted successfully.");

        await refreshData();
      } catch (error) {
        showError(
          error,
          "Unable to transfer this student. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      selectedEnrollment,
      academicSessionId,
      targetClassId,
      schoolSubdomain,
      showSuccess,
      showError,
      refreshData,
    ]
  );

  /* =========================================================
     UPDATE ENROLLMENT STATUS
  ========================================================= */

  const handleUpdateStatus = useCallback(
    async (
      enrollment: Enrollment,
      status: "COMPLETED" | "WITHDRAWN"
    ) => {
      if (!academicSessionId.trim()) {
        setPageError("Select an academic session first.");
        return;
      }

      const enrollmentId = getEnrollmentId(enrollment);

      if (!enrollmentId) {
        setPageError(
          "This enrollment does not have a valid ID."
        );

        return;
      }

      const action =
        status === "COMPLETED" ? "complete" : "withdraw";

      const confirmed = window.confirm(
        `Are you sure you want to ${action} this student enrollment?`
      );

      if (!confirmed) return;

      try {
        setSubmitting(true);
        setPageError("");

        await updateStudentEnrollmentStatus(
          academicSessionId.trim(),
          enrollmentId,
          { status },
          schoolSubdomain
        );

        showSuccess(
          status === "COMPLETED"
            ? "Student enrollment completed successfully."
            : "Student enrollment withdrawn successfully."
        );

        await refreshData();
      } catch (error) {
        showError(
          error,
          `Unable to ${action} this enrollment. Please try again.`
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      academicSessionId,
      schoolSubdomain,
      showSuccess,
      showError,
      refreshData,
    ]
  );

  /* =========================================================
     OPEN ENROLLMENT MODAL
  ========================================================= */

  const openEnrollModal = useCallback(() => {
    if (!academicSessionId.trim()) {
      setPageError("Select an academic session first.");
      return;
    }

    if (
      loading ||
      enrollmentsLoadedForSession !== academicSessionId
    ) {
      setPageError(
        "Please wait while the current session's enrollments finish loading."
      );

      return;
    }

    setPageError("");

    setSchoolMembershipId("");
    setClassId("");
    setSelectedSubjectIds([]);

    setShowEnrollModal(true);
  }, [
    academicSessionId,
    loading,
    enrollmentsLoadedForSession,
  ]);

  /* =========================================================
     OPEN TRANSFER MODAL
  ========================================================= */

  const openTransferModal = useCallback(
    (enrollment: Enrollment) => {
      setSelectedEnrollment(enrollment);

      setTargetClassId("");

      setShowTransferModal(true);

      setPageError("");
    },
    []
  );

  /* =========================================================
     CLOSE TRANSFER MODAL
  ========================================================= */

  const closeTransferModal = useCallback(() => {
    if (submitting) return;

    setShowTransferModal(false);

    setSelectedEnrollment(null);
  }, [submitting]);

  /* =========================================================
     CLOSE ENROLLMENT MODAL
  ========================================================= */

  const closeEnrollModal = useCallback(() => {
    if (submitting) return;

    setShowEnrollModal(false);
    setSchoolMembershipId("");
    setClassId("");
    setSelectedSubjectIds([]);
  }, [submitting]);

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    user,
    isHydrated,
    schoolId,
    schoolSubdomain,

    academicSessionId,
    academicSessions,
    selectedSession,
    sessionsLoading,
    fetchAcademicSessions,
    handleSessionChange,

    enrollments,
    filteredEnrollments,
    counts,
    summary,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    loading,
    countLoading,
    submitting,
    optionsLoading,

    enrollmentsReady:
      Boolean(academicSessionId) &&
      enrollmentsLoadedForSession === academicSessionId &&
      !loading,

    pageError,
    successMessage,
    setPageError,
    setSuccessMessage,

    students: availableStudents,

    classes,

    // Subjects belonging to the currently selected class.
    subjects: selectedClassSubjects,

    // Subject IDs currently selected by the administrator.
    selectedSubjectIds,

    // Subject selection handlers.
    handleClassChange,
    handleSubjectChange,
    handleSelectAllSubjects,

    showEnrollModal,
    showTransferModal,
    selectedEnrollment,

    schoolMembershipId,
    setSchoolMembershipId,

    classId,
    setClassId,

    targetClassId,
    setTargetClassId,

    refreshData,

    handleEnrollStudent,
    handleTransferStudent,
    handleUpdateStatus,

    openEnrollModal,
    openTransferModal,
    closeEnrollModal,
    closeTransferModal,
  };
}


