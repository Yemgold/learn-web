



"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import { useParams } from "next/navigation";

import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  GraduationCap,
  RefreshCw,
  X,
  Pencil,
  Power,
  BookOpen,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";

import Button from "@/components/schools/ui/Button";

import Card, {
  CardContent,
  CardHeader,
} from "@/components/schools/ui/Card";

import StatusBadge from "@/components/schools/shared/StatusBadge";
import LoadingState from "@/components/schools/shared/LoadingState";

import TeachersUpdateModal, {
  type ClassOption,
  type SubjectOption,
  type ExistingTeacherAssignment,
  type TeachersUpdatePayload,
} from "@/components/schools/members/TeachersUpdateModal";

import ManageTeacherClassesModal, {
  type ManageTeacherOption,
  type ManageClassOption,
  type ManageSubjectOption,
  type ManageTeacherAssignmentPayload,
} from "@/components/schools/members/ManageTeacherClassesModal";

import {
  getSchoolTeachers,
  createSchoolTeacher,
  updateSchoolTeacherStatus,
  type SchoolTeacher,
  type CreateTeacherPayload,
} from "@/lib/schools/portal/services/member.service";

import { getSchoolClasses } from "@/lib/schools/portal/services/class.service";
import { getSchoolSubjects } from "@/lib/schools/portal/services/subject.service";

import {
  getAcademicSessions,
  type AcademicSession,
} from "@/lib/schools/portal/services/academicsessions";

import {
  assignTeacherSubjectInClass,
} from "@/lib/schools/portal/services/teaching.assignments";

/* =========================================================
   TYPES
========================================================= */

interface TeacherFormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface AcademicSessionOption {
  _id: string;
  sessionName: string;
  isActive: boolean;
}

type TeacherStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

/* =========================================================
   HELPERS
========================================================= */

const getTeacherMembershipId = (
  teacher: SchoolTeacher
): string => {
  return teacher.membershipId || teacher._id || "";
};

const getTeacherName = (teacher: SchoolTeacher): string => {
  return `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim();
};

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string | string[];
            error?: string;
          };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    return (
      message ||
      response?.data?.error ||
      "Something went wrong. Please try again."
    );
  }

  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};

const getInitials = (teacher: SchoolTeacher): string => {
  return `${teacher.firstName?.charAt(0) || ""}${teacher.lastName?.charAt(0) || ""}`.toUpperCase();
};

const createEmptyTeacherForm = (): TeacherFormState => ({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

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

/**
 * Safely checks whether a value is a plain record.
 */
function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

/**
 * Extracts arrays from different API response structures.
 */
function getRecordArray(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }

  if (!isRecord(value)) {
    return [];
  }

  const possibleKeys = [
    "classes",
    "classesObj",
    "schoolClassesObj",
    "schoolClasses",
    "subjects",
    "subjectsObj",
    "results",
    "items",
    "docs",
    "data",
  ];

  for (const key of possibleKeys) {
    if (value[key] === undefined) {
      continue;
    }

    const result = getRecordArray(value[key]);

    if (result.length > 0) {
      return result;
    }
  }

  return [];
}

/* =========================================================
   NORMALIZE CLASSES

   Important:
   - Never return null from the map operation.
   - classCode is optional, so omit it when unavailable.
   - The returned objects are explicitly ClassOption[].
========================================================= */

function normalizeClasses(value: unknown): ClassOption[] {
  return getRecordArray(value).flatMap((item): ClassOption[] => {
    const id = getId(
      item._id || item.id || item.classId
    );

    if (!id) {
      return [];
    }

    const className =
      typeof item.className === "string"
        ? item.className
        : typeof item.name === "string"
          ? item.name
          : "Unnamed class";

    const rawClassCode =
      typeof item.classCode === "string"
        ? item.classCode
        : typeof item.arm === "string"
          ? item.arm
          : undefined;

    const rawSubjects = Array.isArray(item.subjects)
      ? item.subjects
      : [];

    const subjectIds = rawSubjects
      .map((subject): string => {
        if (typeof subject === "string") {
          return subject;
        }

        if (isRecord(subject)) {
          return getId(
            subject._id ||
              subject.id ||
              subject.subjectId
          );
        }

        return "";
      })
      .filter((subjectId) => subjectId.length > 0);

    const normalizedClass: ClassOption = {
      _id: id,
      className,
      subjects: subjectIds,

      ...(rawClassCode
        ? { classCode: rawClassCode }
        : {}),
    };

    return [normalizedClass];
  });
}

/* =========================================================
   NORMALIZE SUBJECTS

   Important:
   - Never return null from the map operation.
   - subjectCode is optional, so omit it when unavailable.
   - The returned objects are explicitly SubjectOption[].
========================================================= */

function normalizeSubjects(value: unknown): SubjectOption[] {
  let data: unknown = value;

  if (isRecord(data) && data.data !== undefined) {
    data = data.data;
  }

  if (isRecord(data) && data.data !== undefined) {
    data = data.data;
  }

  if (!isRecord(data) && !Array.isArray(data)) {
    return [];
  }

  let rawSubjects: unknown[] = [];

  if (Array.isArray(data)) {
    rawSubjects = data;
  } else if (isRecord(data)) {
    if (Array.isArray(data.subjectsObj)) {
      rawSubjects = data.subjectsObj;
    } else if (Array.isArray(data.subjects)) {
      rawSubjects = data.subjects;
    } else if (Array.isArray(data.items)) {
      rawSubjects = data.items;
    } else if (Array.isArray(data.results)) {
      rawSubjects = data.results;
    }
  }

  return rawSubjects.flatMap((subject): SubjectOption[] => {
    if (!isRecord(subject)) {
      return [];
    }

    const id = getId(
      subject._id ||
        subject.id ||
        subject.subjectId
    );

    if (!id) {
      return [];
    }

    const subjectName =
      typeof subject.subjectName === "string"
        ? subject.subjectName
        : typeof subject.name === "string"
          ? subject.name
          : "Unknown subject";

    const rawSubjectCode =
      typeof subject.subjectCode === "string"
        ? subject.subjectCode
        : typeof subject.code === "string"
          ? subject.code
          : undefined;

    const normalizedSubject: SubjectOption = {
      _id: id,
      subjectName,

      ...(rawSubjectCode
        ? { subjectCode: rawSubjectCode }
        : {}),
    };

    return [normalizedSubject];
  });
}

/* =========================================================
   ACADEMIC SESSION HELPERS
========================================================= */

function getSessionId(session: AcademicSession): string {
  const record = session as AcademicSession & {
    id?: string;
    academicSessionId?: string;
  };

  return String(
    record._id ||
      record.id ||
      record.academicSessionId ||
      ""
  );
}

function getSessionName(session: AcademicSession): string {
  const record = session as AcademicSession & {
    name?: string;
    academicYear?: string;
    year?: string;
    title?: string;
  };

  return (
    record.sessionName ||
    record.name ||
    record.academicYear ||
    record.year ||
    record.title ||
    "Unnamed academic session"
  );
}

function getSessionActive(session: AcademicSession): boolean {
  const record = session as AcademicSession & {
    status?: string;
  };

  if (typeof record.isActive === "boolean") {
    return record.isActive;
  }

  return String(record.status || "").toLowerCase() === "active";
}

/* =========================================================
   PAGE
========================================================= */

export default function SchoolTeachersPage() {
  const params = useParams<{ slug: string }>();

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const schoolId =
    user?.schoolContext?.userSchoolMembership?.schoolId || "";

  const schoolSubdomain = (
    user?.schoolContext?.subDomain ||
    params?.slug ||
    ""
  )
    .trim()
    .toLowerCase();

  /* =======================================================
     TEACHER STATE
  ======================================================= */

  const [teachers, setTeachers] = useState<SchoolTeacher[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<TeacherStatusFilter>("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);

  const [editingTeacher, setEditingTeacher] =
    useState<SchoolTeacher | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<TeacherFormState>(
    createEmptyTeacherForm()
  );

  /* =======================================================
     ASSIGN CLASSES MODAL STATE
  ======================================================= */

  const [showAssignmentModal, setShowAssignmentModal] =
    useState(false);

  const [assignmentTeacher, setAssignmentTeacher] =
    useState<SchoolTeacher | null>(null);

  const [existingAssignments, setExistingAssignments] = useState<
    ExistingTeacherAssignment[]
  >([]);

  /* =======================================================
     MANAGE CLASSES MODAL STATE
  ======================================================= */

  const [manageTeacher, setManageTeacher] =
    useState<SchoolTeacher | null>(null);

  const [showManageModal, setShowManageModal] = useState(false);

  /* =======================================================
     SHARED ASSIGNMENT OPTIONS
  ======================================================= */

  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  const [academicSessions, setAcademicSessions] = useState<
    AcademicSessionOption[]
  >([]);

  const [academicSessionId, setAcademicSessionId] = useState("");

  const [academicSessionsLoading, setAcademicSessionsLoading] =
    useState(false);

  const [assignmentLoading, setAssignmentLoading] = useState(false);

  const [assignmentSubmitting, setAssignmentSubmitting] =
    useState(false);

  /* =======================================================
     MANAGE MODAL DATA ADAPTERS
  ======================================================= */

  const manageTeacherOption = useMemo<ManageTeacherOption | null>(() => {
    if (!manageTeacher) {
      return null;
    }

    return {
      _id: getTeacherMembershipId(manageTeacher),
      firstName: manageTeacher.firstName,
      lastName: manageTeacher.lastName,
      email: manageTeacher.email,
      teachingAssignment: manageTeacher.teachingAssignment || [],
    };
  }, [manageTeacher]);

  const manageClassOptions = useMemo<ManageClassOption[]>(() => {
    return classes.map((item) => ({
      _id: item._id,
      className: item.className,

      // The Manage modal may require a string.
      // Use an empty string when the class has no code.
      classCode: item.classCode ?? "",

      subjects: Array.isArray(item.subjects)
        ? item.subjects
            .map((subject) => getId(subject))
            .filter((subjectId) => subjectId.length > 0)
        : [],
    }));
  }, [classes]);

  const manageSubjectOptions = useMemo<ManageSubjectOption[]>(() => {
    return subjects.map((item) => ({
      _id: item._id,
      subjectName: item.subjectName,

      // Use an empty string when no subject code exists.
      subjectCode: item.subjectCode ?? "",
    }));
  }, [subjects]);

  /* =======================================================
     FETCH TEACHERS
  ======================================================= */

  const fetchTeachers = useCallback(async () => {
    if (!isHydrated) {
      return;
    }

    if (!schoolId) {
      setTeachers([]);
      setLoading(false);

      setError(
        "Your account does not have an active school membership. Please sign in again or contact your school administrator."
      );

      return;
    }

    if (!schoolSubdomain) {
      setTeachers([]);
      setLoading(false);
      setError("School subdomain is unavailable.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getSchoolTeachers(
        schoolId,
        schoolSubdomain
      );

      setTeachers(response.members || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.currentPage || 1);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [schoolId, schoolSubdomain, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      void fetchTeachers();
    }
  }, [fetchTeachers, isHydrated]);

  /* =======================================================
     FETCH ASSIGNMENT OPTIONS

     Loads:
     - School classes
     - School subjects
     - Academic sessions
  ======================================================= */

  const fetchAssignmentOptions = useCallback(async () => {
    if (!schoolSubdomain) {
      throw new Error("School subdomain is unavailable.");
    }

    const [classResult, subjectResult, sessionResult] =
      await Promise.all([
        getSchoolClasses(
          schoolSubdomain as Parameters<typeof getSchoolClasses>[0]
        ),
        getSchoolSubjects(schoolSubdomain),
        getAcademicSessions(schoolSubdomain),
      ]);

    const normalizedClasses = normalizeClasses(classResult);
    const normalizedSubjects = normalizeSubjects(subjectResult);

    const rawSessions = Array.isArray(sessionResult.sessions)
      ? sessionResult.sessions
      : [];

    const normalizedSessions: AcademicSessionOption[] = rawSessions
      .map((session) => ({
        _id: getSessionId(session),
        sessionName: getSessionName(session),
        isActive: getSessionActive(session),
      }))
      .filter((session) => Boolean(session._id));

    setClasses(normalizedClasses);
    setSubjects(normalizedSubjects);
    setAcademicSessions(normalizedSessions);

    const activeSessions = normalizedSessions.filter(
      (session) => session.isActive
    );

    setAcademicSessionId(
      activeSessions.length === 1
        ? activeSessions[0]._id
        : ""
    );

    return {
      classes: normalizedClasses,
      subjects: normalizedSubjects,
      sessions: normalizedSessions,
    };
  }, [schoolSubdomain]);

  /* =======================================================
     OPEN ASSIGN CLASSES MODAL
  ======================================================= */

  const openAssignmentModal = async (teacher: SchoolTeacher) => {
    const teacherMembershipId = getTeacherMembershipId(teacher);

    if (!teacherMembershipId) {
      setError("Teacher membership ID is missing.");
      return;
    }

    if (!schoolSubdomain) {
      setError("School subdomain is unavailable.");
      return;
    }

    setError("");
    setSuccess("");

    setManageTeacher(null);
    setShowManageModal(false);

    setAssignmentTeacher(teacher);
    setExistingAssignments([]);

    setClasses([]);
    setSubjects([]);
    setAcademicSessions([]);
    setAcademicSessionId("");

    setShowAssignmentModal(true);
    setAssignmentLoading(true);
    setAcademicSessionsLoading(true);

    try {
      const result = await fetchAssignmentOptions();

      if (result.sessions.length === 0) {
        setError(
          "No academic sessions were found. Create an academic session before assigning subjects to this teacher."
        );
      }
    } catch (err: unknown) {
      setError(
        `Unable to load assignment options: ${getErrorMessage(err)}`
      );
    } finally {
      setAssignmentLoading(false);
      setAcademicSessionsLoading(false);
    }
  };

  /* =======================================================
     OPEN MANAGE CLASSES MODAL
  ======================================================= */

  const openManageClassesModal = async (teacher: SchoolTeacher) => {
    const teacherMembershipId = getTeacherMembershipId(teacher);

    if (!teacherMembershipId) {
      setError("Teacher membership ID is missing.");
      return;
    }

    if (!schoolSubdomain) {
      setError("School subdomain is unavailable.");
      return;
    }

    setError("");
    setSuccess("");

    setAssignmentTeacher(null);
    setShowAssignmentModal(false);

    setManageTeacher(teacher);

    setClasses([]);
    setSubjects([]);
    setAcademicSessions([]);
    setAcademicSessionId("");

    setShowManageModal(true);
    setAssignmentLoading(true);
    setAcademicSessionsLoading(true);

    try {
      const result = await fetchAssignmentOptions();

      if (result.sessions.length === 0) {
        setError(
          "No academic sessions were found. You can view existing assignments, but a session must be selected before adding new assignments."
        );
      }
    } catch (err: unknown) {
      setError(
        `Unable to load class and subject options: ${getErrorMessage(err)}`
      );
    } finally {
      setAssignmentLoading(false);
      setAcademicSessionsLoading(false);
    }
  };

  /* =======================================================
     CLOSE ASSIGN CLASSES MODAL
  ======================================================= */

  const closeAssignmentModal = () => {
    if (assignmentSubmitting) {
      return;
    }

    setShowAssignmentModal(false);
    setAssignmentTeacher(null);
    setExistingAssignments([]);
    setAcademicSessionId("");
  };

  /* =======================================================
     CLOSE MANAGE CLASSES MODAL
  ======================================================= */

  const closeManageModal = () => {
    if (assignmentSubmitting) {
      return;
    }

    setShowManageModal(false);
    setManageTeacher(null);
    setAcademicSessionId("");
  };

  /* =======================================================
     SAVE INITIAL TEACHER ASSIGNMENTS
  ======================================================= */

  const handleSaveAssignments = async (
    payload: TeachersUpdatePayload
  ) => {
    if (!schoolSubdomain) {
      throw new Error("School subdomain is unavailable.");
    }

    const teacherMembershipId = assignmentTeacher
      ? getTeacherMembershipId(assignmentTeacher)
      : "";

    if (!teacherMembershipId) {
      throw new Error("Teacher membership ID is missing.");
    }

    if (!payload.teacherId) {
      throw new Error("Please select a teacher.");
    }

    if (payload.teacherId !== teacherMembershipId) {
      throw new Error(
        "The selected teacher does not match the teacher being assigned."
      );
    }

    if (!academicSessionId) {
      throw new Error("Please select an academic session.");
    }

    if (!payload.assignments.length) {
      throw new Error("Please select at least one subject.");
    }

    setAssignmentSubmitting(true);
    setError("");
    setSuccess("");

    try {
      for (const assignment of payload.assignments) {
        if (!assignment.classId || !assignment.subjectId) {
          throw new Error(
            "Every assignment must have a class and subject."
          );
        }

        await assignTeacherSubjectInClass(
          {
            teacherMembershipId,
            academicSessionId,
            classId: assignment.classId,
            subjectId: assignment.subjectId,
          },
          schoolSubdomain
        );
      }

      const teacherName = assignmentTeacher
        ? getTeacherName(assignmentTeacher)
        : "Teacher";

      setSuccess(
        `Teaching assignments submitted successfully for ${teacherName}.`
      );

      setShowAssignmentModal(false);
      setAssignmentTeacher(null);
      setExistingAssignments([]);
      setAcademicSessionId("");

      await fetchTeachers();
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  /* =======================================================
     ADD ASSIGNMENTS FROM MANAGE MODAL
  ======================================================= */

  const handleAddManagedAssignments = async (
    assignments: ManageTeacherAssignmentPayload[]
  ) => {
    if (!schoolSubdomain) {
      throw new Error("School subdomain is unavailable.");
    }

    const teacherMembershipId = manageTeacher
      ? getTeacherMembershipId(manageTeacher)
      : "";

    if (!teacherMembershipId) {
      throw new Error("Teacher membership ID is missing.");
    }

    if (!assignments.length) {
      throw new Error("Select at least one new subject assignment.");
    }

    setAssignmentSubmitting(true);
    setError("");
    setSuccess("");

    try {
      for (const assignment of assignments) {
        if (assignment.teacherMembershipId !== teacherMembershipId) {
          throw new Error(
            "The assignment contains an invalid teacher membership."
          );
        }

        if (!assignment.classId || !assignment.subjectId) {
          throw new Error(
            "Every assignment must have a class and subject."
          );
        }

        if (!assignment.academicSessionId) {
          throw new Error("Please select an academic session.");
        }

        await assignTeacherSubjectInClass(
          {
            teacherMembershipId,
            academicSessionId: assignment.academicSessionId,
            classId: assignment.classId,
            subjectId: assignment.subjectId,
          },
          schoolSubdomain
        );
      }

      const teacherName = manageTeacher
        ? getTeacherName(manageTeacher)
        : "Teacher";

      setSuccess(
        `New class and subject assignments added successfully for ${teacherName}.`
      );

      await fetchTeachers();

      setShowManageModal(false);
      setManageTeacher(null);
      setAcademicSessionId("");
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err));
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  /* =======================================================
     STATISTICS
  ======================================================= */

  const activeTeachers = useMemo(
    () => teachers.filter((teacher) => teacher.isActive).length,
    [teachers]
  );

  const inactiveTeachers = useMemo(
    () => teachers.filter((teacher) => !teacher.isActive).length,
    [teachers]
  );

  /* =======================================================
     FILTERS
  ======================================================= */

  const filteredTeachers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const fullName =
        `${teacher.firstName || ""} ${teacher.lastName || ""}`.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        (teacher.email || "").toLowerCase().includes(normalizedSearch) ||
        (teacher.phoneNumber || "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && teacher.isActive) ||
        (statusFilter === "INACTIVE" && !teacher.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [teachers, search, statusFilter]);

  /* =======================================================
     TEACHER FORM
  ======================================================= */

  const resetForm = () => {
    setForm(createEmptyTeacherForm());
    setEditingTeacher(null);
  };

  const openCreateForm = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (teacher: SchoolTeacher) => {
    setEditingTeacher(teacher);

    setForm({
      firstName: teacher.firstName || "",
      lastName: teacher.lastName || "",
      email: teacher.email || "",
      phoneNumber: teacher.phoneNumber || "",
      password: "",
      confirmPassword: "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
    setError("");
  };

  /* =======================================================
     CREATE TEACHER
  ======================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (!schoolId) {
        setError("Your school membership information is unavailable.");
        return;
      }

      if (!schoolSubdomain) {
        setError("Your school subdomain is unavailable.");
        return;
      }

      if (!form.firstName.trim() || !form.lastName.trim()) {
        setError("Enter the teacher's first and last name.");
        return;
      }

      if (!form.email.trim()) {
        setError("Enter the teacher's email address.");
        return;
      }

      if (editingTeacher) {
        setError(
          "Teacher profile editing is not currently supported by the backend. You can still manage class and subject assignments or activate/deactivate this teacher."
        );
        return;
      }

      if (!form.password.trim()) {
        setError("Enter a temporary password for the teacher.");
        return;
      }

      if (form.password.length < 8) {
        setError(
          "The temporary password must be at least 8 characters."
        );
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("The temporary passwords do not match.");
        return;
      }

      const createPayload: CreateTeacherPayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
       phoneNumber: form.phoneNumber.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      };

      await createSchoolTeacher(
        createPayload,
        schoolSubdomain
      );

      setSuccess("Teacher added successfully.");
      setShowForm(false);
      resetForm();

      await fetchTeachers();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     TEACHER STATUS
  ======================================================= */

  const handleStatusChange = async (
    teacher: SchoolTeacher
  ) => {
    const teacherMembershipId =
      getTeacherMembershipId(teacher);

    if (!teacherMembershipId) {
      setError("Teacher membership ID is missing.");
      return;
    }

    if (!schoolSubdomain) {
      setError("Your school subdomain is unavailable.");
      return;
    }

    const nextStatus = !teacher.isActive;

    const confirmed = window.confirm(
      nextStatus
        ? `Activate ${getTeacherName(teacher)}?`
        : `Deactivate ${getTeacherName(teacher)}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(teacherMembershipId);
      setError("");
      setSuccess("");

      await updateSchoolTeacherStatus(
        teacherMembershipId,
        { isActive: nextStatus },
        schoolSubdomain
      );

      setSuccess(
        nextStatus
          ? "Teacher activated successfully."
          : "Teacher deactivated successfully."
      );

      await fetchTeachers();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (!isHydrated || loading) {
    return <LoadingState message="Loading teachers..." />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6 pb-10">
      {/* PAGE HEADING */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>School</span>
            <span>/</span>
            <span>Teachers</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Teachers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your school's teaching staff, class assignments,
            and subjects.
          </p>

          {schoolSubdomain && (
            <p className="mt-1 text-xs text-gray-400">
              School: {schoolSubdomain}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => void fetchTeachers()}
            leftIcon={<RefreshCw size={16} />}
          >
            Refresh
          </Button>

          <Button
            onClick={openCreateForm}
            leftIcon={<Plus size={16} />}
          >
            Add Teacher
          </Button>
        </div>
      </div>

      {/* ALERTS */}

      {error &&
        !showForm &&
        !showAssignmentModal &&
        !showManageModal && (
          <div className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

      {success && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss success message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Total Teachers</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {teachers.length}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Users size={23} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Active Teachers</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {activeTeachers}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <UserCheck size={23} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-gray-500">Inactive Teachers</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {inactiveTeachers}
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
              <UserX size={23} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TEACHER FORM */}

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingTeacher ? "Teacher Details" : "Add New Teacher"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingTeacher
                    ? "Teacher profile editing is not yet available through the current backend service."
                    : "Enter the teacher's details and create a temporary password."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    First Name *
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleFormChange}
                    required
                    readOnly={!!editingTeacher}
                    placeholder="Enter first name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 read-only:bg-gray-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Last Name *
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleFormChange}
                    required
                    readOnly={!!editingTeacher}
                    placeholder="Enter last name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 read-only:bg-gray-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Email Address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                    readOnly={!!editingTeacher}
                    placeholder="teacher@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 read-only:bg-gray-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleFormChange}
                    readOnly={!!editingTeacher}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 read-only:bg-gray-50"
                  />
                </div>

                {!editingTeacher && (
                  <>
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Temporary Password *
                      </label>

                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={handleFormChange}
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Confirm Temporary Password *
                      </label>

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={handleFormChange}
                        required
                        minLength={8}
                        placeholder="Re-enter temporary password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label
                    htmlFor="role"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    School Role
                  </label>

                  <input
                    id="role"
                    value="TEACHER"
                    readOnly
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 outline-none"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Staff added from this page are assigned the Teacher role.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeForm}
                  disabled={submitting}
                >
                  Close
                </Button>

                {!editingTeacher && (
                  <Button
                    type="submit"
                    isLoading={submitting}
                    disabled={submitting}
                  >
                    Add Teacher
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* SEARCH AND FILTERS */}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {status === "ALL"
                    ? "All"
                    : status === "ACTIVE"
                      ? "Active"
                      : "Inactive"}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TEACHER LIST */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Teaching Staff
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredTeachers.length} teacher
                {filteredTeachers.length === 1 ? "" : "s"} displayed
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="rounded-full bg-gray-100 p-4 text-gray-400">
                <GraduationCap size={30} />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                No teachers found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {search || statusFilter !== "ALL"
                  ? "Try changing your search or filter."
                  : "You have not added any teachers yet."}
              </p>

              {!search && statusFilter === "ALL" && (
                <Button
                  className="mt-4"
                  onClick={openCreateForm}
                  leftIcon={<Plus size={16} />}
                >
                  Add First Teacher
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3 font-medium">Teacher</th>
                      <th className="px-4 py-3 font-medium">Contact</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredTeachers.map((teacher) => {
                      const teacherMembershipId =
                        getTeacherMembershipId(teacher);

                      const hasAssignments =
                        (teacher.teachingAssignment?.length || 0) > 0;

                      return (
                        <tr
                          key={teacherMembershipId || teacher.email}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                                {getInitials(teacher)}
                              </div>

                              <div>
                                <p className="font-medium text-gray-900">
                                  {getTeacherName(teacher)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <p className="flex items-center gap-2 text-sm text-gray-700">
                              <Mail size={14} className="text-gray-400" />
                              {teacher.email}
                            </p>

                            {teacher.phoneNumber && (
                              <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                <Phone size={13} className="text-gray-400" />
                                {teacher.phoneNumber}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge
                              status={teacher.isActive ? "Active" : "Inactive"}
                            />
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  hasAssignments
                                    ? void openManageClassesModal(teacher)
                                    : void openAssignmentModal(teacher)
                                }
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                                  hasAssignments
                                    ? "text-green-700 hover:bg-green-50"
                                    : "text-blue-700 hover:bg-blue-50"
                                }`}
                                title={
                                  hasAssignments
                                    ? "Manage assigned classes and subjects"
                                    : "Assign classes and subjects"
                                }
                              >
                                <BookOpen size={15} />

                                {hasAssignments
                                  ? "Manage Classes"
                                  : "Assign Classes"}
                              </button>

                              <button
                                type="button"
                                onClick={() => openEditForm(teacher)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                title="View teacher details"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  void handleStatusChange(teacher)
                                }
                                disabled={actionId === teacherMembershipId}
                                className={`rounded-lg p-2 disabled:opacity-50 ${
                                  teacher.isActive
                                    ? "text-red-500 hover:bg-red-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                                title={
                                  teacher.isActive
                                    ? "Deactivate teacher"
                                    : "Activate teacher"
                                }
                              >
                                <Power size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}

              <div className="space-y-3 md:hidden">
                {filteredTeachers.map((teacher) => {
                  const teacherMembershipId =
                    getTeacherMembershipId(teacher);

                  const hasAssignments =
                    (teacher.teachingAssignment?.length || 0) > 0;

                  return (
                    <div
                      key={teacherMembershipId || teacher.email}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                            {getInitials(teacher)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">
                              {getTeacherName(teacher)}
                            </p>
                          </div>
                        </div>

                        <StatusBadge
                          status={teacher.isActive ? "Active" : "Inactive"}
                        />
                      </div>

                      <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2 break-all">
                          <Mail size={15} className="shrink-0 text-gray-400" />
                          {teacher.email}
                        </p>

                        {teacher.phoneNumber && (
                          <p className="flex items-center gap-2">
                            <Phone size={15} className="shrink-0 text-gray-400" />
                            {teacher.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                        <button
                          type="button"
                          onClick={() =>
                            hasAssignments
                              ? void openManageClassesModal(teacher)
                              : void openAssignmentModal(teacher)
                          }
                          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                            hasAssignments
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          <BookOpen size={15} />

                          {hasAssignments
                            ? "Manage Classes"
                            : "Assign Classes"}
                        </button>

                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => openEditForm(teacher)}
                          leftIcon={<Pencil size={14} />}
                        >
                          View
                        </Button>

                        <div className="col-span-2">
                          <Button
                            variant={teacher.isActive ? "danger" : "success"}
                            size="sm"
                            fullWidth
                            isLoading={actionId === teacherMembershipId}
                            onClick={() =>
                              void handleStatusChange(teacher)
                            }
                            leftIcon={<Power size={14} />}
                          >
                            {teacher.isActive
                              ? "Deactivate Teacher"
                              : "Activate Teacher"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (
                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                    >
                      Previous
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ASSIGN CLASSES MODAL */}

      {assignmentTeacher && (
        <TeachersUpdateModal
          open={showAssignmentModal}
          submitting={assignmentSubmitting}
          loading={assignmentLoading}
          teachers={[
            {
              _id: getTeacherMembershipId(assignmentTeacher),
              firstName: assignmentTeacher.firstName,
              lastName: assignmentTeacher.lastName,
              email: assignmentTeacher.email,
            },
          ]}
          classes={classes}
          subjects={subjects}
          academicSessions={academicSessions}
          academicSessionId={academicSessionId}
          academicSessionsLoading={academicSessionsLoading}
          onAcademicSessionChange={setAcademicSessionId}
          initialTeacherId={getTeacherMembershipId(assignmentTeacher)}
          initialAssignments={existingAssignments}
          onClose={closeAssignmentModal}
          onSubmit={handleSaveAssignments}
        />
      )}

      {/* MANAGE CLASSES MODAL */}

      <ManageTeacherClassesModal
        open={showManageModal}
        teacher={manageTeacherOption}
        classes={manageClassOptions}
        subjects={manageSubjectOptions}
        academicSessions={academicSessions}
        academicSessionId={academicSessionId}
        academicSessionsLoading={academicSessionsLoading}
        loading={assignmentLoading}
        submitting={assignmentSubmitting}
        onAcademicSessionChange={setAcademicSessionId}
        onClose={closeManageModal}
        onAddAssignments={handleAddManagedAssignments}
      />
    </div>
  );
}