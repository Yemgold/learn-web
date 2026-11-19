
import { apiClient } from "@/lib/api";


export type SchoolSubdomain = string;

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface SchoolClass {
  _id?: string;
  id?: string;
  classId?: string;
  name: string;
  arm?: string;
  classCode?: string;
  description?: string;
  schoolId?: string;

  /** First subject ID (backward compatibility). */
  subjectId?: string;

  /** All subject IDs attached to this class. */
  subjects: string[];

  isActive: boolean;
  studentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSchoolClassPayload {
  name: string;
  arm?: string;
  subjectIds?: string[];
  description?: string;
}

export interface UpdateSchoolClassPayload {
  name?: string;
  arm?: string;
  subjectIds?: string[];
  description?: string;
}

export interface UpdateSchoolClassStatusPayload {
  isActive: boolean;
}

export interface UpdateClassSubjectsPayload {
  subjects: string[];
}

export interface SchoolClassList {
  classes: SchoolClass[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/* -------------------------------------------------------------------------- */
/* INTERNAL TYPES                                                             */
/* -------------------------------------------------------------------------- */

type ApiRecord = Record<string, unknown>;

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

function getSchoolConfig(schoolSubdomain: SchoolSubdomain) {
  const subdomain = schoolSubdomain?.trim();

  if (!subdomain) {
    throw new Error("School subdomain is required for this request.");
  }

  return {
    headers: {
      "x-school-subdomain": subdomain,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function isRecord(value: unknown): value is ApiRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getErrorMessage(
  response: unknown,
  fallback: string
): string {
  if (isRecord(response) && typeof response.message === "string") {
    return response.message;
  }

  return fallback;
}

/**
 * Extracts a subject ID whether the backend returns:
 *
 * "subjectId"
 *
 * or:
 *
 * { _id: "subjectId", name: "Mathematics" }
 */
function extractSubjectId(subject: unknown): string {
  if (typeof subject === "string") {
    return subject.trim();
  }

  if (!isRecord(subject)) {
    return "";
  }

  if (typeof subject._id === "string") {
    return subject._id.trim();
  }

  if (typeof subject.id === "string") {
    return subject.id.trim();
  }

  if (typeof subject.subjectId === "string") {
    return subject.subjectId.trim();
  }

  return "";
}

/**
 * Normalizes subject IDs and removes duplicates.
 */
function normalizeSubjects(value: ApiRecord): string[] {
  const rawSubjects = Array.isArray(value.subjects)
    ? value.subjects
    : value.subjectId
      ? [value.subjectId]
      : [];

  const subjectIds = rawSubjects
    .map(extractSubjectId)
    .filter(Boolean);

  return [...new Set(subjectIds)];
}

/* -------------------------------------------------------------------------- */
/* NORMALIZE CLASS                                                            */
/* -------------------------------------------------------------------------- */

function normalizeClass(value: ApiRecord): SchoolClass {
  const className =
    typeof value.className === "string"
      ? value.className
      : typeof value.name === "string"
        ? value.name
        : "";

  const classCode =
    typeof value.classCode === "string"
      ? value.classCode
      : typeof value.arm === "string"
        ? value.arm
        : "";

  const subjects = normalizeSubjects(value);

  return {
    _id:
      typeof value._id === "string"
        ? value._id
        : undefined,

    id:
      typeof value.id === "string"
        ? value.id
        : undefined,

    classId:
      typeof value.classId === "string"
        ? value.classId
        : undefined,

    name: className,
    arm: classCode,
    classCode,

    description:
      typeof value.description === "string"
        ? value.description
        : undefined,

    schoolId:
      typeof value.schoolId === "string"
        ? value.schoolId
        : undefined,

    subjectId: subjects[0],
    subjects,

    isActive:
      typeof value.isActive === "boolean"
        ? value.isActive
        : true,

    studentCount:
      typeof value.studentCount === "number"
        ? value.studentCount
        : 0,

    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : undefined,

    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : undefined,
  };
}

/* -------------------------------------------------------------------------- */
/* EXTRACT SINGLE CLASS                                                       */
/* -------------------------------------------------------------------------- */

function extractClass(response: unknown): SchoolClass {
  let result = response;

  if (isRecord(result) && "success" in result) {
    if (result.success === false) {
      throw new Error(
        getErrorMessage(
          result,
          "Unable to retrieve school class."
        )
      );
    }

    result = result.data;
  }

  if (isRecord(result) && "data" in result) {
    result = result.data;
  }

  if (isRecord(result) && "class" in result) {
    result = result.class;
  }

  if (!isRecord(result)) {
    throw new Error("Invalid school class response.");
  }

  return normalizeClass(result);
}

/* -------------------------------------------------------------------------- */
/* EXTRACT CLASS LIST                                                         */
/* -------------------------------------------------------------------------- */

function extractClasses(response: unknown): SchoolClassList {
  let result = response;

  // Unwrap standard backend response.
  if (isRecord(result)) {
    if (result.success === false) {
      throw new Error(
        getErrorMessage(
          result,
          "Unable to retrieve school classes."
        )
      );
    }

    if ("data" in result) {
      result = result.data;
    }
  }

  // Unwrap another nested data object if present.
  if (isRecord(result) && "data" in result) {
    result = result.data;
  }

  if (!isRecord(result)) {
    throw new Error(
      "Invalid classes response. Expected a list of school classes."
    );
  }

  const rawClasses = Array.isArray(result.classesObj)
    ? result.classesObj
    : Array.isArray(result.classes)
      ? result.classes
      : Array.isArray(result.results)
        ? result.results
        : Array.isArray(result.items)
          ? result.items
          : Array.isArray(result.schoolClasses)
            ? result.schoolClasses
            : Array.isArray(result.docs)
              ? result.docs
              : null;

  if (!rawClasses) {
    throw new Error(
      "Invalid classes response. Expected a list of school classes."
    );
  }

  const classes = rawClasses
    .filter(isRecord)
    .map(normalizeClass);

  return {
    classes,

    totalCount:
      typeof result.totalCount === "number"
        ? result.totalCount
        : classes.length,

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
          : 1,
  };
}

/* -------------------------------------------------------------------------- */
/* API PAYLOAD                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Converts frontend subjectIds into the backend's subjects array.
 *
 * Example:
 * {
 *   name: "JSS 1",
 *   arm: "A",
 *   subjectIds: ["subject-1", "subject-2"]
 * }
 *
 * Becomes:
 * {
 *   className: "JSS 1",
 *   classCode: "A",
 *   subjects: ["subject-1", "subject-2"]
 * }
 */
function toApiPayload(
  payload: CreateSchoolClassPayload | UpdateSchoolClassPayload
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (payload.name !== undefined) {
    result.className = payload.name.trim();
  }

  if (payload.arm !== undefined) {
    result.classCode = payload.arm.trim();
  }

  if (payload.subjectIds !== undefined) {
    result.subjects = [
      ...new Set(
        payload.subjectIds
          .filter(
            (subjectId): subjectId is string =>
              typeof subjectId === "string"
          )
          .map((subjectId) => subjectId.trim())
          .filter(Boolean)
      ),
    ];
  }

  if (payload.description !== undefined) {
    result.description = payload.description.trim();
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* GET ALL SCHOOL CLASSES                                                     */
/* -------------------------------------------------------------------------- */

export const getSchoolClasses = async (
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolClassList> => {
  const config = getSchoolConfig(schoolSubdomain);

  console.log("[GET SCHOOL CLASSES]", {
    endpoint: "/classes/get-all-classes-for-the-school",
    schoolSubdomain,
    headers: config.headers,
  });

  try {
    const response = await apiClient.get<unknown>(
      "/classes/get-all-classes-for-the-school",
      config
    );

    console.log("[SCHOOL CLASSES RESPONSE]", response);

    return extractClasses(response);
  } catch (error) {
    console.error("[SCHOOL CLASSES ERROR]", error);
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/* GET SINGLE SCHOOL CLASS                                                    */
/* -------------------------------------------------------------------------- */

export const getSchoolClassById = async (
  classId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolClass> => {
  if (!classId.trim()) {
    throw new Error("Class ID is required.");
  }

  const response = await apiClient.get<unknown>(
    `/classes/get-single-class-of-a-school/${encodeURIComponent(classId)}`,
    getSchoolConfig(schoolSubdomain)
  );

 return extractClass(response);

};

/* -------------------------------------------------------------------------- */
/* CREATE SCHOOL CLASS                                                        */
/* -------------------------------------------------------------------------- */

export const createSchoolClass = async (
  payload: CreateSchoolClassPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolClass> => {
  if (!payload.name.trim()) {
    throw new Error("Class name is required.");
  }

  if (!payload.arm?.trim()) {
    throw new Error("Class code is required.");
  }

  const response = await apiClient.post<unknown>(
    "/classes/create-a-school-class",
    toApiPayload(payload),
    getSchoolConfig(schoolSubdomain)
  );
return extractClass(response);
};

/* -------------------------------------------------------------------------- */
/* UPDATE SCHOOL CLASS                                                        */
/* -------------------------------------------------------------------------- */

export const updateSchoolClass = async (
  classId: string,
  payload: UpdateSchoolClassPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolClass> => {
  if (!classId.trim()) {
    throw new Error("Class ID is required.");
  }

  const response = await apiClient.patch<unknown>(
    `/classes/update-a-class-in-a-school/${encodeURIComponent(classId)}`,
    toApiPayload(payload),
    getSchoolConfig(schoolSubdomain)
  );
return extractClass(response);
};

/* -------------------------------------------------------------------------- */
/* ACTIVATE / DEACTIVATE SCHOOL CLASS                                         */
/* -------------------------------------------------------------------------- */

export const updateSchoolClassStatus = async (
  classId: string,
  payload: UpdateSchoolClassStatusPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolClass> => {
  if (!classId.trim()) {
    throw new Error("Class ID is required.");
  }

  const response = await apiClient.patch<unknown>(
    `/classes/update-class-status/${encodeURIComponent(classId)}/status`,
    payload,
    getSchoolConfig(schoolSubdomain)
  );

return extractClass(response);
};

/* -------------------------------------------------------------------------- */
/* DEACTIVATE SCHOOL CLASS                                                    */
/* -------------------------------------------------------------------------- */

export const deactivateSchoolClass = async (
  classId: string,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolClass> => {
  return updateSchoolClassStatus(
    classId,
    { isActive: false },
    schoolSubdomain
  );
};



/* -------------------------------------------------------------------------- */
/* ADD SUBJECTS TO SCHOOL CLASS                                               */
/* -------------------------------------------------------------------------- */

export const addSubjectsToClass = async (
  classId: string,
  payload: UpdateClassSubjectsPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolClass> => {
  if (!classId.trim()) {
    throw new Error("Class ID is required.");
  }

  const subjects = [
    ...new Set(
      payload.subjects
        .filter((id): id is string => typeof id === "string")
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ];

  if (subjects.length === 0) {
    throw new Error("At least one subject ID is required.");
  }

  const response = await apiClient.patch<unknown>(
    `/classes/add-subjects-to-class/${encodeURIComponent(classId)}`,
    { subjects },
    getSchoolConfig(schoolSubdomain)
  );
return extractClass(response);
};

/* -------------------------------------------------------------------------- */
/* REMOVE SUBJECTS FROM SCHOOL CLASS                                          */
/* -------------------------------------------------------------------------- */

export const removeSubjectsFromClass = async (
  classId: string,
  payload: UpdateClassSubjectsPayload,
  schoolSubdomain: SchoolSubdomain
): Promise<SchoolClass> => {
  if (!classId.trim()) {
    throw new Error("Class ID is required.");
  }

  const subjects = [
    ...new Set(
      payload.subjects
        .filter((id): id is string => typeof id === "string")
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ];

  if (subjects.length === 0) {
    throw new Error("At least one subject ID is required.");
  }

  const response = await apiClient.patch<unknown>(
    `/classes/remove-subjects-from-class/${encodeURIComponent(classId)}`,
    { subjects },
    getSchoolConfig(schoolSubdomain)
  );

return extractClass(response);
};

