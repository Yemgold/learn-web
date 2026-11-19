





import { apiClient } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type SchoolSubdomain = string;

export type SchoolMemberRole =
  | "STUDENT"
  | "TEACHER"
  | "ADMIN"
  | "ADMINISTRATOR";

export type SchoolMembershipStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "SUSPENDED";

export interface SchoolMember {
  _id?: string;
  id?: string;
  membershipId?: string;

  userId?: string;
  schoolId?: string;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;

  role: SchoolMemberRole | string;
  isActive: boolean;
  status?: SchoolMembershipStatus | string;

  profileImage?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolTeacher extends SchoolMember {
  role: "TEACHER";
  employeeId?: string;
  qualification?: string;
  specialization?: string;
  subjects?: string[];
  classes?: string[];

  teachingAssignment?: {
  class: string;
  subject: string;
}[];
}

export interface SchoolAdministrator extends SchoolMember {
  role: "ADMIN" | "ADMINISTRATOR";
}

export interface CreateSchoolMemberPayload {
  schoolId?: string;
  userId?: string;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;

  role: SchoolMemberRole;
}

export interface CreateTeacherPayload {
  schoolId?: string;
  userId?: string;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;

  employeeId?: string;
  qualification?: string;
  specialization?: string;
  subjects?: string[];
  classes?: string[];
}

export interface UpdateTeacherPayload {
  employeeId?: string;
  qualification?: string;
  specialization?: string;
  subjects?: string[];
  classes?: string[];
}

export interface UpdateSchoolMemberRolePayload {
  role: SchoolMemberRole;
}

export interface UpdateMemberStatusPayload {
  isActive: boolean;
}

export interface SchoolMemberList {
  members: SchoolMember[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface SchoolTeacherList {
  members: SchoolTeacher[];
  totalCount: number;
  currentPage: number;
  totalPages: number;

  teachingAssignment?: {
  class: string;
  subject: string;
}[];
}

export interface SchoolMembershipList {
  memberships: SchoolMember[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/* -------------------------------------------------------------------------- */
/*                           SUBDOMAIN REQUEST HELPER                         */
/* -------------------------------------------------------------------------- */

const getSchoolRequestConfig = (
  schoolSubdomain: SchoolSubdomain
) => {
  const subdomain = schoolSubdomain?.trim().toLowerCase();

  if (!subdomain) {
    throw new Error(
      "School subdomain is required for this request."
    );
  }

  return {
    headers: {
      "x-school-subdomain": subdomain,
    },
  };
};

/* -------------------------------------------------------------------------- */
/*                              RESPONSE HELPERS                              */
/* -------------------------------------------------------------------------- */

const isRecord = (
  value: unknown
): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
};

/**
 * Supports:
 * Axios response
 *   -> response.data
 *      -> backend response.data
 */
const unwrapResponse = (response: unknown): unknown => {
  let result = response;

  for (let index = 0; index < 5; index += 1) {
    if (!isRecord(result)) {
      break;
    }

    if (result.success === false) {
      throw new Error(
        typeof result.message === "string"
          ? result.message
          : "The request could not be completed."
      );
    }

    if ("data" in result && result.data !== undefined) {
      result = result.data;
      continue;
    }

    break;
  }

  return result;
};

const normalizeRole = (role: unknown): string => {
  return typeof role === "string"
    ? role.toUpperCase().replace(/[\s-]/g, "_")
    : "";
};

/* -------------------------------------------------------------------------- */
/*                          NORMALIZE SCHOOL MEMBER                           */
/* -------------------------------------------------------------------------- */

/**
 * Actual backend membership structure:
 *
 * {
 *   _id: "membershipId",
 *   schoolId: "...",
 *   userId: {
 *     _id: "userId",
 *     firstName: "...",
 *     lastName: "...",
 *     email: "...",
 *     phoneNumber: "..."
 *   },
 *   role: "STUDENT",
 *   isActive: true
 * }
 *
 * Important:
 * We extract only safe user fields.
 * Password hashes and other unnecessary user fields are not returned.
 */
const normalizeMember = (value: unknown): SchoolMember => {
  if (!isRecord(value)) {
    throw new Error(
      "Invalid school membership returned by the server."
    );
  }

  const user =
    isRecord(value.userId)
      ? value.userId
      : isRecord(value.user)
        ? value.user
        : isRecord(value.member)
          ? value.member
          : {};

  const firstName =
    typeof value.firstName === "string"
      ? value.firstName
      : typeof user.firstName === "string"
        ? user.firstName
        : "";

  const lastName =
    typeof value.lastName === "string"
      ? value.lastName
      : typeof user.lastName === "string"
        ? user.lastName
        : "";

  const email =
    typeof value.email === "string"
      ? value.email
      : typeof user.email === "string"
        ? user.email
        : "";

  const phoneNumber =
    typeof value.phoneNumber === "string"
      ? value.phoneNumber
      : typeof user.phoneNumber === "string"
        ? user.phoneNumber
        : undefined;

  const rawStatus =
    typeof value.status === "string"
      ? value.status
      : undefined;

  const isActive =
    typeof value.isActive === "boolean"
      ? value.isActive
      : rawStatus
        ? rawStatus.toUpperCase() === "ACTIVE"
        : true;

  const membershipId =
    typeof value._id === "string"
      ? value._id
      : typeof value.membershipId === "string"
        ? value.membershipId
        : undefined;

  const userId =
    typeof value.userId === "string"
      ? value.userId
      : typeof user._id === "string"
        ? user._id
        : typeof user.id === "string"
          ? user.id
          : undefined;

  // Preserve the teacher's existing class/subject assignments.
  const teachingAssignment = Array.isArray(
    value.teachingAssignment
  )
    ? value.teachingAssignment.flatMap((assignment) => {
        if (!isRecord(assignment)) {
          return [];
        }

        const getReferenceId = (reference: unknown): string => {
          if (typeof reference === "string") {
            return reference;
          }

          if (isRecord(reference)) {
            if (typeof reference._id === "string") {
              return reference._id;
            }

            if (typeof reference.id === "string") {
              return reference.id;
            }
          }

          return "";
        };

        const classId = getReferenceId(assignment.class);
        const subjectId = getReferenceId(assignment.subject);

        if (!classId || !subjectId) {
          return [];
        }

        return [
          {
            class: classId,
            subject: subjectId,
          },
        ];
      })
    : undefined;

  return {
    _id: membershipId,

    id:
      typeof value.id === "string"
        ? value.id
        : membershipId,

    membershipId,
    userId,

    schoolId:
      typeof value.schoolId === "string"
        ? value.schoolId
        : undefined,

    firstName,
    lastName,
    email,
    phoneNumber,

    role:
      typeof value.role === "string"
        ? normalizeRole(value.role)
        : "STUDENT",

    isActive,
    status: rawStatus,

    profileImage:
      typeof value.profileImage === "string"
        ? value.profileImage
        : typeof user.profileImage === "string"
          ? user.profileImage
          : undefined,

    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : undefined,

    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : undefined,

    teachingAssignment,
  };
};

/* -------------------------------------------------------------------------- */
/*                           EXTRACT ALL MEMBERS                              */
/* -------------------------------------------------------------------------- */

const extractMembers = (
  response: unknown
): SchoolMemberList => {
  const result = unwrapResponse(response);

  if (Array.isArray(result)) {
    const members = result.map(normalizeMember);

    return {
      members,
      totalCount: members.length,
      currentPage: 1,
      totalPages: members.length > 0 ? 1 : 0,
    };
  }

  if (!isRecord(result)) {
    return {
      members: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
    };
  }

  // IMPORTANT:
  // schoolMembershipObj is the actual array key returned
  // by your backend.
  const rawMembers = [
    result.schoolMembershipObj,
    result.membershipObj,
    result.members,
    result.memberships,
    result.schoolMemberships,
    result.data,
    result.results,
    result.items,
  ].find(Array.isArray);

  const members = Array.isArray(rawMembers)
    ? rawMembers.map(normalizeMember)
    : [];

  return {
    members,

    totalCount:
      typeof result.totalCount === "number"
        ? result.totalCount
        : typeof result.total === "number"
          ? result.total
          : members.length,

    currentPage:
      typeof result.currentPage === "number"
        ? result.currentPage
        : typeof result.page === "number"
          ? result.page
          : 1,

    totalPages:
      typeof result.totalPages === "number"
        ? result.totalPages
        : typeof result.pages === "number"
          ? result.pages
          : members.length > 0
            ? 1
            : 0,
  };
};

/* -------------------------------------------------------------------------- */
/*                          EXTRACT SINGLE MEMBER                             */
/* -------------------------------------------------------------------------- */

const extractMember = (
  response: unknown
): SchoolMember => {
  const result = unwrapResponse(response);

  if (!isRecord(result)) {
    throw new Error(
      "Invalid school membership response."
    );
  }

  let candidate: unknown =
    result.schoolMembershipObj ??
    result.membership ??
    result.schoolMembership ??
    result.member ??
    result;

  if (Array.isArray(candidate)) {
    candidate = candidate[0];
  }

  return normalizeMember(candidate);
};

/* -------------------------------------------------------------------------- */
/*                         SCHOOL MEMBERSHIP SERVICES                         */
/* -------------------------------------------------------------------------- */

/**
 * Register a school member.
 *
 * POST /school-memberships/register-school-member/register
 */
export const createSchoolMember = async (
  payload: CreateSchoolMemberPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMember> => {
  const response = await apiClient.post<unknown>(
    "/school-memberships/register-school-member/register",
    payload,
    getSchoolRequestConfig(schoolSubdomain)
  );

  return extractMember(response);
};

/**
 * Get all memberships belonging to a school.
 *
 * GET /school-memberships/get-all-membership-of-a-school/:schoolId
 */
export const getSchoolMembers = async (
  schoolId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMemberList> => {
  if (!schoolId?.trim()) {
    throw new Error(
      "School ID is required to fetch school memberships."
    );
  }

  const url = `/school-memberships/get-all-membership-of-a-school/${encodeURIComponent(
    schoolId.trim()
  )}`;

  try {
    const response = await apiClient.get<unknown>(
      url,
      getSchoolRequestConfig(schoolSubdomain)
    );

    console.log("SCHOOL MEMBERS RESPONSE:", response.data);

    return extractMembers(response);
  } catch (error: unknown) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: unknown;
      };
      config?: {
        url?: string;
        method?: string;
      };
      message?: string;
    };

    console.error("GET SCHOOL MEMBERS FAILED:", {
      status: axiosError.response?.status,
      response: axiosError.response?.data,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      message: axiosError.message,
    });

    throw error;
  }
};

/**
 * Get all school memberships belonging to a user.
 *
 * GET /school-memberships/get-all-user-school-memberships/:userId
 */
export const getUserSchoolMemberships = async (
  userId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMemberList> => {
  if (!userId?.trim()) {
    throw new Error(
      "User ID is required to fetch school memberships."
    );
  }

  const response = await apiClient.get<unknown>(
    `/school-memberships/get-all-user-school-memberships/${encodeURIComponent(
      userId.trim()
    )}`,
    getSchoolRequestConfig(schoolSubdomain)
  );

  return extractMembers(response);
};

/**
 * Get one school membership by membership ID.
 *
 * GET /school-memberships/get-school-membership-by-membershipId/:membershipId
 */
export const getSchoolMemberById = async (
  membershipId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMember> => {
  if (!membershipId?.trim()) {
    throw new Error("Membership ID is required.");
  }

  const response = await apiClient.get<unknown>(
    `/school-memberships/get-school-membership-by-membershipId/${encodeURIComponent(
      membershipId.trim()
    )}`,
    getSchoolRequestConfig(schoolSubdomain)
  );

  return extractMember(response);
};

/**
 * Update a user's role in a school.
 *
 * PATCH /school-memberships/update-user-school-membership-role/:membershipId/role
 */
export const updateSchoolMemberRole = async (
  membershipId: string,
  payload: UpdateSchoolMemberRolePayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMember> => {
  const response = await apiClient.patch<unknown>(
    `/school-memberships/update-user-school-membership-role/${encodeURIComponent(
      membershipId
    )}/role`,
    payload,
    getSchoolRequestConfig(schoolSubdomain)
  );

  return extractMember(response);
};

/**
 * Activate or deactivate a school membership.
 *
 * PATCH /school-memberships/user-school-membership-status-update/:membershipId/status
 */
export const updateSchoolMemberStatus = async (
  membershipId: string,
  payload: UpdateMemberStatusPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMember> => {
  const response = await apiClient.patch<unknown>(
    `/school-memberships/user-school-membership-status-update/${encodeURIComponent(
      membershipId
    )}/status`,
    payload,
    getSchoolRequestConfig(schoolSubdomain)
  );

  return extractMember(response);
};

export const activateSchoolMember = (
  membershipId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMember> => {
  return updateSchoolMemberStatus(
    membershipId,
    { isActive: true },
    schoolSubdomain
  );
};

export const deactivateSchoolMember = (
  membershipId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMember> => {
  return updateSchoolMemberStatus(
    membershipId,
    { isActive: false },
    schoolSubdomain
  );
};

/* -------------------------------------------------------------------------- */
/*                              TEACHER SERVICES                              */
/* -------------------------------------------------------------------------- */

/**
 * Get teachers from a school's membership list.
 */
export const getSchoolTeachers = async (
  schoolId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolTeacherList> => {
  const result = await getSchoolMembers(
    schoolId,
    schoolSubdomain
  );

  const teachers = result.members.filter(
    (member): member is SchoolTeacher =>
      normalizeRole(member.role) === "TEACHER"
  );

  return {
    members: teachers,
    totalCount: teachers.length,
    currentPage: result.currentPage,
    totalPages: result.totalPages,
  };
};

/**
 * Get one teacher using their membership ID.
 */
export const getSchoolTeacherById = async (
  membershipId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolTeacher> => {
  const teacher = await getSchoolMemberById(
    membershipId,
    schoolSubdomain
  );

  if (normalizeRole(teacher.role) !== "TEACHER") {
    throw new Error(
      "The requested membership is not a teacher."
    );
  }

  return {
    ...teacher,
    role: "TEACHER",
  };
};

/**
 * Create a teacher membership.
 */
export const createSchoolTeacher = async (
  payload: CreateTeacherPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolTeacher> => {
  const {
    employeeId,
    qualification,
    specialization,
    subjects,
    classes,
    ...account
  } = payload;

  const teacher = await createSchoolMember(
    {
      ...account,
      role: "TEACHER",
    },
    schoolSubdomain
  );

  return {
    ...teacher,
    role: "TEACHER",
    employeeId,
    qualification,
    specialization,
    subjects,
    classes,
  };
};

/**
 * Update teacher-specific profile information.
 *
 * The supplied backend routes do not expose a teacher-details endpoint.
 */
export const updateSchoolTeacher = async (
  membershipId: string,
  payload: UpdateTeacherPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolTeacher> => {
  void payload;

  return getSchoolTeacherById(
    membershipId,
    schoolSubdomain
  );
};

/**
 * Change a teacher membership's status.
 */
export const updateSchoolTeacherStatus = async (
  membershipId: string,
  payload: UpdateMemberStatusPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolTeacher> => {
  const teacher = await updateSchoolMemberStatus(
    membershipId,
    payload,
    schoolSubdomain
  );

  if (normalizeRole(teacher.role) !== "TEACHER") {
    throw new Error(
      "The requested membership is not a teacher."
    );
  }

  return {
    ...teacher,
    role: "TEACHER",
  };
};

export const activateSchoolTeacher = (
  membershipId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolTeacher> => {
  return updateSchoolTeacherStatus(
    membershipId,
    { isActive: true },
    schoolSubdomain
  );
};

export const deactivateSchoolTeacher = (
  membershipId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolTeacher> => {
  return updateSchoolTeacherStatus(
    membershipId,
    { isActive: false },
    schoolSubdomain
  );
};

/* -------------------------------------------------------------------------- */
/*                           ADMINISTRATOR SERVICES                           */
/* -------------------------------------------------------------------------- */

const ADMIN_ROLES = [
  "ADMIN",
  "ADMINISTRATOR",
  "SCHOOL_ADMIN",
  "SCHOOL_ADMINISTRATOR",
];

export const getSchoolAdministrators = async (
  schoolId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMemberList> => {
  const result = await getSchoolMembers(
    schoolId,
    schoolSubdomain
  );

  const administrators = result.members.filter((member) =>
    ADMIN_ROLES.includes(normalizeRole(member.role))
  );

  return {
    ...result,
    members: administrators,
    totalCount: administrators.length,
    totalPages:
      administrators.length > 0
        ? Math.ceil(
            administrators.length /
              Math.max(result.members.length, 1)
          )
        : 0,
  };
};

export const getSchoolAdministratorById = async (
  membershipId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolAdministrator> => {
  const administrator = await getSchoolMemberById(
    membershipId,
    schoolSubdomain
  );

  if (
    !ADMIN_ROLES.includes(
      normalizeRole(administrator.role)
    )
  ) {
    throw new Error(
      "The requested membership is not an administrator."
    );
  }

  return {
    ...administrator,
    role: normalizeRole(administrator.role) as
      | "ADMIN"
      | "ADMINISTRATOR",
  };
};

export const createSchoolAdministrator = (
  payload: Omit<CreateSchoolMemberPayload, "role">,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolMember> => {
  return createSchoolMember(
    {
      ...payload,
      role: "ADMIN",
    },
    schoolSubdomain
  );
};



