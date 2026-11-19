



"use client";

import { useMemo, useState, useEffect } from "react";
import {
  X,
  BookOpen,
  GraduationCap,
  Loader2,
  Search,
  Check,
  AlertCircle,
  Plus,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

export interface ManageTeacherOption {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  teachingAssignment?: {
    class: string;
    subject: string;
  }[];
}

export interface ManageClassOption {
  _id: string;
  className: string;
  classCode?: string;
  subjects?: string[];
}

export interface ManageSubjectOption {
  _id: string;
  subjectName: string;
  subjectCode?: string;
}

export interface ManageAcademicSessionOption {
  _id: string;
  sessionName: string;
  isActive?: boolean;
}

export interface ManageTeacherAssignmentPayload {
  teacherMembershipId: string;
  academicSessionId: string;
  classId: string;
  subjectId: string;
}

interface ManageTeacherClassesModalProps {
  open: boolean;
  submitting?: boolean;
  loading?: boolean;

  teacher: ManageTeacherOption | null;
  classes: ManageClassOption[];
  subjects: ManageSubjectOption[];

  academicSessions: ManageAcademicSessionOption[];
  academicSessionId: string;
  academicSessionsLoading?: boolean;
  onAcademicSessionChange: (sessionId: string) => void;

  onClose: () => void;
  onAddAssignments: (
    assignments: ManageTeacherAssignmentPayload[]
  ) => Promise<void> | void;
}

/* =========================================================
   COMPONENT
========================================================= */


export default function ManageTeacherClassesModal({
  open,
  submitting = false,
  loading = false,
  teacher,
  classes = [],
  subjects = [],
  academicSessions = [],
  academicSessionId = "",
  academicSessionsLoading = false,
  onAcademicSessionChange,
  onClose,
  onAddAssignments,
}: ManageTeacherClassesModalProps) {
  const safeClasses = Array.isArray(classes) ? classes : [];
  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const safeAcademicSessions = Array.isArray(academicSessions)
    ? academicSessions
    : [];

  const [search, setSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setSelectedClassId("");
      setSelectedSubjectIds([]);
      setShowAddForm(false);
    }
  }, [open]);

  const teacherName = useMemo(() => {
    if (!teacher) return "Teacher";

    return (
      `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
      teacher.email ||
      "Teacher"
    );
  }, [teacher]);

  const classMap = useMemo(
    () => new Map(classes.map((item) => [item._id, item])),
    [classes]
  );

 const subjectMap = useMemo(() => {
  return new Map(
    safeSubjects.map((item) => [
      String(item._id).trim(),
      item,
    ])
  );
}, [safeSubjects]);

  const existingAssignments = useMemo(() => {
    if (!teacher?.teachingAssignment) return [];

    console.log("LOADED SUBJECTS:", safeSubjects);
console.log(
  "TEACHER ASSIGNMENTS:",
  teacher?.teachingAssignment
);

    const grouped = new Map<
      string,
      {
        classId: string;
        className: string;
        classCode?: string;
        subjectIds: Set<string>;
      }
    >();

    teacher.teachingAssignment.forEach((assignment) => {
      const classId = assignment.class;
      const subjectId = assignment.subject;
      const classInfo = classMap.get(classId);

      if (!grouped.has(classId)) {
        grouped.set(classId, {
          classId,
          className: classInfo?.className || "Unknown class",
          classCode: classInfo?.classCode,
          subjectIds: new Set(),
        });
      }

      grouped.get(classId)?.subjectIds.add(subjectId);
    });

    return Array.from(grouped.values())
      .map((item) => ({
        ...item,
     subjects: Array.from(item.subjectIds).map((subjectId) => {
  const normalizedId = String(subjectId).trim();
  const subject = subjectMap.get(normalizedId);

  return {
    _id: normalizedId,
    subjectName: subject?.subjectName || "Unknown subject",
    subjectCode: subject?.subjectCode,
  };
}),
      }))
      .sort((a, b) => a.className.localeCompare(b.className));
  }, [teacher, classMap, subjectMap]);

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return existingAssignments;

    return existingAssignments.filter((item) => {
      const classMatches =
        item.className.toLowerCase().includes(query) ||
        item.classCode?.toLowerCase().includes(query);

      const subjectMatches = item.subjects.some(
        (subject) =>
          subject.subjectName.toLowerCase().includes(query) ||
          subject.subjectCode?.toLowerCase().includes(query)
      );

      return classMatches || subjectMatches;
    });
  }, [existingAssignments, search]);

  const selectedClass = classes.find(
    (item) => item._id === selectedClassId
  );

  const availableSubjects = useMemo(() => {
    if (!selectedClass) return subjects;

    if (!selectedClass.subjects?.length) return subjects;

    return subjects.filter((subject) =>
      selectedClass.subjects?.includes(subject._id)
    );
  }, [selectedClass, subjects]);

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjectIds((current) =>
      current.includes(subjectId)
        ? current.filter((id) => id !== subjectId)
        : [...current, subjectId]
    );
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubjectIds([]);
  };

  const handleAddAssignments = async () => {
    if (
      !teacher?._id ||
      !academicSessionId ||
      !selectedClassId ||
      !selectedSubjectIds.length
    ) {
      return;
    }

    const existingPairs = new Set(
      (teacher.teachingAssignment || []).map(
        (item) => `${item.class}:${item.subject}`
      )
    );

    const newAssignments = selectedSubjectIds
      .filter(
        (subjectId) =>
          !existingPairs.has(`${selectedClassId}:${subjectId}`)
      )
      .map((subjectId) => ({
        teacherMembershipId: teacher._id,
        academicSessionId,
        classId: selectedClassId,
        subjectId,
      }));

    if (!newAssignments.length) {
      setShowAddForm(false);
      setSelectedClassId("");
      setSelectedSubjectIds([]);
      return;
    }

    await onAddAssignments(newAssignments);

    setShowAddForm(false);
    setSelectedClassId("");
    setSelectedSubjectIds([]);
  };

  if (!open || !teacher) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <GraduationCap size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Manage Classes
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage classes and subjects assigned to {teacherName}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">

          {/* TEACHER DETAILS */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Teacher
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              {teacherName}
            </p>

            {teacher.email && (
              <p className="mt-0.5 text-sm text-gray-500">
                {teacher.email}
              </p>
            )}
          </div>

          {/* ASSIGNMENT SUMMARY */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Assigned classes</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {existingAssignments.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Assigned subjects</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {existingAssignments.reduce(
                  (total, item) => total + item.subjects.length,
                  0
                )}
              </p>
            </div>
          </div>

          {/* EXISTING ASSIGNMENTS */}
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Existing assignments
                </h3>
                <p className="text-xs text-gray-500">
                  Classes and subjects currently assigned to this teacher.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm((current) => !current)}
                disabled={submitting || loading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus size={16} />
                Add Assignment
              </button>
            </div>

            <div className="relative mb-3">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search classes or subjects..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-12 text-sm text-gray-500">
                <Loader2 size={18} className="animate-spin" />
                Loading assignments...
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center">
                <BookOpen size={28} className="mx-auto text-gray-300" />
                <p className="mt-2 text-sm font-medium text-gray-700">
                  {existingAssignments.length
                    ? "No matching assignments found"
                    : "No classes assigned yet"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Use Add Assignment to assign a class and its subjects.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.classId}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                          <GraduationCap size={18} />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {assignment.className}
                          </p>
                          {assignment.classCode && (
                            <p className="text-xs text-gray-500">
                              {assignment.classCode}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {assignment.subjects.length} subject
                        {assignment.subjects.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {assignment.subjects.map((subject) => (
                        <span
                          key={subject._id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700"
                        >
                          <BookOpen size={13} />
                          {subject.subjectName}
                          {subject.subjectCode && (
                            <span className="text-gray-400">
                              ({subject.subjectCode})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ADD ASSIGNMENT FORM */}
          {showAddForm && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">
                  Add class and subjects
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Select an academic session first, then choose a class and its subjects.
                </p>
              </div>

              {/* ACADEMIC SESSION */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Academic session <span className="text-red-500">*</span>
                </label>

                <select
                  value={academicSessionId}
                  onChange={(event) => {
                    onAcademicSessionChange(event.target.value);
                    setSelectedClassId("");
                    setSelectedSubjectIds([]);
                  }}
                  disabled={academicSessionsLoading || submitting}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {academicSessionsLoading
                      ? "Loading academic sessions..."
                      : "Choose an academic session"}
                  </option>

                  {academicSessions.map((session) => (
                    <option key={session._id} value={session._id}>
                      {session.sessionName}
                      {session.isActive ? " (Active)" : ""}
                    </option>
                  ))}
                </select>

                {!academicSessionsLoading &&
                  academicSessions.length === 0 && (
                    <p className="mt-2 text-xs text-red-600">
                      No academic sessions found. Create an academic session before assigning classes.
                    </p>
                  )}
              </div>

              {/* CLASS */}
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Select class
                </label>

                <select
                  value={selectedClassId}
                  onChange={(event) =>
                    handleClassChange(event.target.value)
                  }
                  disabled={!academicSessionId || submitting}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">
                    {!academicSessionId
                      ? "Select an academic session first"
                      : "Choose a class"}
                  </option>

                  {classes.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.className}
                      {item.classCode ? ` (${item.classCode})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBJECTS */}
              {selectedClassId && academicSessionId && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Select subjects
                    </label>
                    <span className="text-xs text-gray-500">
                      {selectedSubjectIds.length} selected
                    </span>
                  </div>

                  {availableSubjects.length === 0 ? (
                    <p className="rounded-lg bg-white p-3 text-sm text-gray-500">
                      No subjects are available for this class.
                    </p>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {availableSubjects.map((subject) => {
                        const alreadyAssigned =
                          teacher.teachingAssignment?.some(
                            (item) =>
                              item.class === selectedClassId &&
                              item.subject === subject._id
                          );

                        const checked = selectedSubjectIds.includes(
                          subject._id
                        );

                        return (
                          <label
                            key={subject._id}
                            className={`flex items-center gap-3 rounded-lg border bg-white p-3 transition ${
                              alreadyAssigned
                                ? "cursor-not-allowed border-gray-100 opacity-60"
                                : checked
                                  ? "cursor-pointer border-blue-400 bg-blue-50"
                                  : "cursor-pointer border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={alreadyAssigned || submitting}
                              onChange={() => toggleSubject(subject._id)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />

                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium text-gray-800">
                                {subject.subjectName}
                              </span>
                              {subject.subjectCode && (
                                <span className="block text-xs text-gray-400">
                                  {subject.subjectCode}
                                </span>
                              )}
                            </span>

                            {alreadyAssigned ? (
                              <span className="text-xs text-green-600">
                                Assigned
                              </span>
                            ) : checked ? (
                              <Check size={16} className="text-blue-600" />
                            ) : null}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ACTIONS */}
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedClassId("");
                    setSelectedSubjectIds([]);
                  }}
                  disabled={submitting}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void handleAddAssignments()}
                  disabled={
                    submitting ||
                    !academicSessionId ||
                    !selectedClassId ||
                    selectedSubjectIds.length === 0
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  Save Assignments
                </button>
              </div>

              {!academicSessionId && (
                <p className="mt-3 flex items-center gap-2 text-xs text-red-600">
                  <AlertCircle size={14} />
                  Select an academic session before adding assignments.
                </p>
              )}
            </div>
          )}

          
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-gray-100 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
