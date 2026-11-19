





import { apiClient } from "@/lib/api";

export type AssignmentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED";

export interface SchoolAssignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  dueDate: string | null;
  totalMarks: number;
  status: AssignmentStatus;
  submissionCount: number;
  createdAt: string | null;
}

export interface CreateAssignmentPayload {
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  dueDate: string;
  totalMarks: number;
  status: AssignmentStatus;
}

export type UpdateAssignmentPayload =
  Partial<CreateAssignmentPayload>;

export interface AssignmentList {
  assignments: SchoolAssignment[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface GetAssignmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AssignmentStatus | "ALL";
  classId?: string;
  subjectId?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapResponse(value: unknown): unknown {
  let result = value;

  for (let i = 0; i < 3; i++) {
    if (!isRecord(result) || !("data" in result)) break;
    result = result.data;
  }

  return result;
}

function normalizeAssignment(value: unknown): SchoolAssignment | null {
  if (!isRecord(value)) return null;

  const schoolClass = isRecord(value.schoolClass)
    ? value.schoolClass
    : isRecord(value.class)
      ? value.class
      : {};

  const subject = isRecord(value.subject) ? value.subject : {};

  const rawStatus = String(value.status ?? "DRAFT").toUpperCase();

  const status: AssignmentStatus =
    rawStatus === "PUBLISHED" || rawStatus === "CLOSED"
      ? rawStatus
      : "DRAFT";

  return {
    id: String(value.id ?? value._id ?? ""),
    title: String(value.title ?? value.name ?? ""),
    description: String(value.description ?? ""),
    classId: String(
      value.classId ?? schoolClass.id ?? schoolClass._id ?? ""
    ),
    className: String(
      value.className ?? schoolClass.name ?? ""
    ),
    subjectId: String(
      value.subjectId ?? subject.id ?? subject._id ?? ""
    ),
    subjectName: String(
      value.subjectName ?? subject.name ?? ""
    ),
    dueDate: value.dueDate ? String(value.dueDate) : null,
    totalMarks: Number(value.totalMarks ?? value.maxScore ?? 0),
    status,
    submissionCount: Number(
      value.submissionCount ?? value.submissionsCount ?? 0
    ),
    createdAt: value.createdAt ? String(value.createdAt) : null,
  };
}

function normalizeAssignmentList(value: unknown): AssignmentList {
  const result = unwrapResponse(value);

  let records: unknown[] = [];
  let totalCount = 0;
  let totalPages = 1;
  let currentPage = 1;

  if (Array.isArray(result)) {
    records = result;
    totalCount = result.length;
  } else if (isRecord(result)) {
    const possibleRecords =
      result.assignments ?? result.items ?? result.results;

    if (Array.isArray(possibleRecords)) {
      records = possibleRecords;
    }

    totalCount = Number(
      result.totalCount ?? result.total ?? records.length
    );

    totalPages = Number(result.totalPages ?? 1);
    currentPage = Number(result.currentPage ?? result.page ?? 1);
  }

  return {
    assignments: records
      .map(normalizeAssignment)
      .filter(
        (item): item is SchoolAssignment => item !== null
      ),
    totalCount,
    totalPages,
    currentPage,
  };
}

export async function getSchoolAssignments(
  params: GetAssignmentsParams = {}
): Promise<AssignmentList> {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);

  if (params.status && params.status !== "ALL") {
    query.set("status", params.status);
  }

  if (params.classId) query.set("classId", params.classId);
  if (params.subjectId) query.set("subjectId", params.subjectId);

  const queryString = query.toString();

  const response: unknown = await apiClient.get(
    `/schools/assignments${queryString ? `?${queryString}` : ""}`
  );

  return normalizeAssignmentList(response);
}

export async function getSchoolAssignment(
  assignmentId: string
): Promise<SchoolAssignment | null> {
  const response: unknown = await apiClient.get(
    `/schools/assignments/${encodeURIComponent(assignmentId)}`
  );

  return normalizeAssignment(unwrapResponse(response));
}

export async function createSchoolAssignment(
  payload: CreateAssignmentPayload
): Promise<SchoolAssignment | null> {
  const response: unknown = await apiClient.post(
    "/schools/assignments",
    payload
  );

  return normalizeAssignment(unwrapResponse(response));
}

export async function updateSchoolAssignment(
  assignmentId: string,
  payload: UpdateAssignmentPayload
): Promise<SchoolAssignment | null> {
  const response: unknown = await apiClient.patch(
    `/schools/assignments/${encodeURIComponent(assignmentId)}`,
    payload
  );

  return normalizeAssignment(unwrapResponse(response));
}

export async function deleteSchoolAssignment(
  assignmentId: string
): Promise<unknown> {
  return apiClient.delete(
    `/schools/assignments/${encodeURIComponent(assignmentId)}`
  );
}
