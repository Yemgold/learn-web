


"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Users,
  BookOpen,
  GraduationCap,
  Loader2,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

export interface TeacherOption {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  email?: string;

    teachingAssignment?: {
    class: string;
    subject: string;
  }[];
}

export interface SubjectOption {
  _id: string;
  subjectName: string;
  subjectCode?: string;
}

export interface ClassOption {
  _id: string;
  className: string;
  classCode?: string;
  subjects?: Array<string | SubjectOption>;
}

export interface AcademicSessionOption {
  _id: string;
  sessionName: string;
  isActive: boolean;
}

export interface ExistingTeacherAssignment {
  _id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
}

export interface TeacherSubjectAssignment {
  assignmentId?: string;
  classId: string;
  subjectId: string;
}

export interface TeachersUpdatePayload {
  teacherId: string;
  assignments: TeacherSubjectAssignment[];
}

interface TeachersUpdateModalProps {
  open: boolean;
  submitting?: boolean;
  loading?: boolean;

  teachers: TeacherOption[];
  classes: ClassOption[];
  subjects?: SubjectOption[];

  academicSessions: AcademicSessionOption[];
  academicSessionId: string;
  academicSessionsLoading?: boolean;
  onAcademicSessionChange: (sessionId: string) => void;

  initialTeacherId?: string;
  initialAssignments?: ExistingTeacherAssignment[];

  onClose: () => void;

  onSubmit: (payload: TeachersUpdatePayload) => void | Promise<void>;
}

/* =========================================================
   HELPERS
========================================================= */

function getTeacherName(teacher: TeacherOption): string {
  if (teacher.fullName) return teacher.fullName;
  if (teacher.name) return teacher.name;

  return (
    [teacher.firstName, teacher.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    teacher.email ||
    "Unnamed teacher"
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TeachersUpdateModal({
  open,
  submitting = false,
  loading = false,
  teachers,
  classes,
  subjects = [],
  academicSessions,
  academicSessionId,
  academicSessionsLoading = false,
  onAcademicSessionChange,
  initialTeacherId = "",
  initialAssignments = [],
  onClose,
  onSubmit,
}: TeachersUpdateModalProps) {
  const [teacherId, setTeacherId] = useState(initialTeacherId);

  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchClass, setSearchClass] = useState("");

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const [selectedSubjects, setSelectedSubjects] = useState<
    Record<string, string[]>
  >({});

  const [expandedClasses, setExpandedClasses] = useState<string[]>([]);

  const [error, setError] = useState("");

  /* =========================================================
     NORMALIZE CLASS SUBJECTS
  ========================================================= */

  const getClassSubjects = (
    schoolClass: ClassOption
  ): SubjectOption[] => {
    return (schoolClass.subjects ?? [])
      .map((item) => {
        if (typeof item !== "string") {
          return item;
        }

        return subjects.find((subject) => subject._id === item);
      })
      .filter((item): item is SubjectOption => Boolean(item));
  };

  /* =========================================================
     INITIALIZE EDIT DATA
  ========================================================= */

  useEffect(() => {
    if (!open) return;

    setTeacherId(initialTeacherId);
    setError("");

    setSearchTeacher("");
    setSearchClass("");

    const grouped: Record<string, string[]> = {};

    initialAssignments.forEach((assignment) => {
      if (!grouped[assignment.classId]) {
        grouped[assignment.classId] = [];
      }

      if (
        !grouped[assignment.classId].includes(
          assignment.subjectId
        )
      ) {
        grouped[assignment.classId].push(
          assignment.subjectId
        );
      }
    });

    setSelectedClasses(Object.keys(grouped));
    setSelectedSubjects(grouped);
    setExpandedClasses(Object.keys(grouped));
  }, [open, initialTeacherId, initialAssignments]);

  /* =========================================================
     FILTER TEACHERS
  ========================================================= */

  const filteredTeachers = useMemo(() => {
    const search = searchTeacher.toLowerCase().trim();

    if (!search) return teachers;

    return teachers.filter((teacher) => {
      const name = getTeacherName(teacher).toLowerCase();
      const email = (teacher.email ?? "").toLowerCase();

      return (
        name.includes(search) ||
        email.includes(search)
      );
    });
  }, [teachers, searchTeacher]);

  /* =========================================================
     FILTER CLASSES
  ========================================================= */

  const filteredClasses = useMemo(() => {
    const search = searchClass.toLowerCase().trim();

    if (!search) return classes;

    return classes.filter((schoolClass) => {
      return (
        schoolClass.className
          .toLowerCase()
          .includes(search) ||
        (schoolClass.classCode ?? "")
          .toLowerCase()
          .includes(search)
      );
    });
  }, [classes, searchClass]);

  /* =========================================================
     CLASS SELECTION
  ========================================================= */

  const toggleClass = (classId: string) => {
    if (submitting) return;

    const schoolClass = classes.find(
      (item) => item._id === classId
    );

    if (!schoolClass) return;

    const isSelected = selectedClasses.includes(classId);

    if (isSelected) {
      setSelectedClasses((current) =>
        current.filter((id) => id !== classId)
      );

      setSelectedSubjects((current) => {
        const updated = { ...current };
        delete updated[classId];
        return updated;
      });

      setExpandedClasses((current) =>
        current.filter((id) => id !== classId)
      );

      return;
    }

    const availableSubjects = getClassSubjects(schoolClass);

    setSelectedClasses((current) => [
      ...current,
      classId,
    ]);

    // Select all subjects attached to the class initially.
    setSelectedSubjects((current) => ({
      ...current,
      [classId]: availableSubjects.map(
        (subject) => subject._id
      ),
    }));

    setExpandedClasses((current) => [
      ...current,
      classId,
    ]);
  };

  /* =========================================================
     SUBJECT SELECTION
  ========================================================= */

  const toggleSubject = (
    classId: string,
    subjectId: string
  ) => {
    if (submitting) return;

    setSelectedSubjects((current) => {
      const currentSubjects = current[classId] ?? [];

      const updatedSubjects = currentSubjects.includes(
        subjectId
      )
        ? currentSubjects.filter(
            (id) => id !== subjectId
          )
        : [...currentSubjects, subjectId];

      return {
        ...current,
        [classId]: updatedSubjects,
      };
    });
  };

  /* =========================================================
     EXPAND / COLLAPSE CLASS
  ========================================================= */

  const toggleExpanded = (classId: string) => {
    setExpandedClasses((current) =>
      current.includes(classId)
        ? current.filter((id) => id !== classId)
        : [...current, classId]
    );
  };

  /* =========================================================
     SELECT ALL SUBJECTS
  ========================================================= */

  const toggleAllSubjects = (
    classId: string,
    checked: boolean
  ) => {
    if (submitting) return;

    const schoolClass = classes.find(
      (item) => item._id === classId
    );

    if (!schoolClass) return;

    const classSubjectIds = getClassSubjects(
      schoolClass
    ).map((subject) => subject._id);

    setSelectedSubjects((current) => ({
      ...current,
      [classId]: checked ? classSubjectIds : [],
    }));
  };

  /* =========================================================
     COUNTS
  ========================================================= */

  const totalSelectedSubjects = selectedClasses.reduce(
    (total, classId) =>
      total + (selectedSubjects[classId]?.length ?? 0),
    0
  );

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async () => {
    if (submitting || loading || academicSessionsLoading) {
      return;
    }

    setError("");

    if (!academicSessionId) {
      setError("Please select an academic session.");
      return;
    }

    if (!teacherId) {
      setError("Please select a teacher.");
      return;
    }

    if (selectedClasses.length === 0) {
      setError("Please select at least one class.");
      return;
    }

    const assignments: TeacherSubjectAssignment[] = [];

    selectedClasses.forEach((classId) => {
      const subjectIds = selectedSubjects[classId] ?? [];

      subjectIds.forEach((subjectId) => {
        const existing = initialAssignments.find(
          (assignment) =>
            assignment.classId === classId &&
            assignment.subjectId === subjectId
        );

        assignments.push({
          classId,
          subjectId,
          ...(existing
            ? { assignmentId: existing._id }
            : {}),
        });
      });
    });

    if (assignments.length === 0) {
      setError("Please select at least one subject.");
      return;
    }

    try {
      await onSubmit({
        teacherId,
        assignments,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update teacher assignments."
      );
    }
  };

  if (!open) return null;

  const selectedSession = academicSessions.find(
    (session) => session._id === academicSessionId
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Assign Teacher to Classes
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select an academic session, classes, and the
              subjects the teacher will handle.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">

          {loading || academicSessionsLoading ? (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2
                size={28}
                className="animate-spin"
              />

              <p className="text-sm">
                Loading teachers, classes, and academic sessions...
              </p>
            </div>
          ) : (
            <>
              {/* ACADEMIC SESSION */}
              <section>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <CalendarDays size={17} />
                  Academic Session
                </label>

                {academicSessions.length === 0 ? (
                  <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <p>
                      No academic sessions are available.
                      Create an academic session before
                      assigning teachers.
                    </p>
                  </div>
                ) : (
                  <>
                    <select
                      value={academicSessionId}
                      onChange={(event) => {
                        onAcademicSessionChange(
                          event.target.value
                        );
                        setError("");
                      }}
                      disabled={submitting}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">
                        Choose an academic session
                      </option>

                      {academicSessions.map((session) => (
                        <option
                          key={session._id}
                          value={session._id}
                        >
                          {session.sessionName}
                          {session.isActive
                            ? " (Active)"
                            : ""}
                        </option>
                      ))}
                    </select>

                    {selectedSession && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Selected session:{" "}
                        <span className="font-semibold text-gray-700 dark:text-gray-200">
                          {selectedSession.sessionName}
                        </span>
                      </p>
                    )}
                  </>
                )}
              </section>

              {/* TEACHER SELECT */}
              <section>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  <Users size={17} />
                  Select Teacher
                </label>

                <div className="relative mb-2">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchTeacher}
                    onChange={(event) =>
                      setSearchTeacher(event.target.value)
                    }
                    placeholder="Search teacher..."
                    disabled={submitting}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <select
                  value={teacherId}
                  onChange={(event) =>
                    setTeacherId(event.target.value)
                  }
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="">
                    Choose a teacher
                  </option>

                  {filteredTeachers.map((teacher) => (
                    <option
                      key={teacher._id}
                      value={teacher._id}
                    >
                      {getTeacherName(teacher)}
                      {teacher.email
                        ? ` — ${teacher.email}`
                        : ""}
                    </option>
                  ))}
                </select>

                {teachers.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    No teachers are available in this school.
                  </p>
                )}
              </section>

              {/* CLASS SELECTION */}
              <section>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                    <GraduationCap size={18} />
                    Select Classes
                  </label>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {selectedClasses.length} selected
                  </span>
                </div>

                <div className="relative mb-3">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={searchClass}
                    onChange={(event) =>
                      setSearchClass(event.target.value)
                    }
                    placeholder="Search classes..."
                    disabled={submitting}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {filteredClasses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700">
                    No classes found.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredClasses.map((schoolClass) => {
                      const isSelected =
                        selectedClasses.includes(
                          schoolClass._id
                        );

                      const isExpanded =
                        expandedClasses.includes(
                          schoolClass._id
                        );

                      const classSubjects =
                        getClassSubjects(schoolClass);

                      const chosenSubjects =
                        selectedSubjects[
                          schoolClass._id
                        ] ?? [];

                      const allSelected =
                        classSubjects.length > 0 &&
                        classSubjects.every((subject) =>
                          chosenSubjects.includes(
                            subject._id
                          )
                        );

                      return (
                        <div
                          key={schoolClass._id}
                          className={`overflow-hidden rounded-xl border transition ${
                            isSelected
                              ? "border-blue-300 bg-blue-50/40 dark:border-blue-800 dark:bg-blue-950/20"
                              : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                          }`}
                        >
                          {/* CLASS ROW */}
                          <div className="flex items-center gap-3 p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={submitting}
                              onChange={() =>
                                toggleClass(schoolClass._id)
                              }
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />

                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => {
                                if (!isSelected) {
                                  toggleClass(
                                    schoolClass._id
                                  );
                                } else {
                                  toggleExpanded(
                                    schoolClass._id
                                  );
                                }
                              }}
                              className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                            >
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                                  {schoolClass.className}
                                </span>

                                {schoolClass.classCode && (
                                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                                    {schoolClass.classCode}
                                  </span>
                                )}
                              </span>

                              <span className="flex shrink-0 items-center gap-2 text-xs text-gray-500">
                                {isSelected && (
                                  <span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                    {chosenSubjects.length}{" "}
                                    subjects
                                  </span>
                                )}

                                {isExpanded ? (
                                  <ChevronUp size={17} />
                                ) : (
                                  <ChevronDown size={17} />
                                )}
                              </span>
                            </button>
                          </div>

                          {/* SUBJECTS */}
                          {isSelected && isExpanded && (
                            <div className="border-t border-blue-200 px-4 py-4 dark:border-blue-900">
                              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                                  <BookOpen size={16} />
                                  Subjects in{" "}
                                  {schoolClass.className}
                                </h4>

                                {classSubjects.length > 0 && (
                                  <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() =>
                                      toggleAllSubjects(
                                        schoolClass._id,
                                        !allSelected
                                      )
                                    }
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400"
                                  >
                                    {allSelected
                                      ? "Deselect all"
                                      : "Select all"}
                                  </button>
                                )}
                              </div>

                              {classSubjects.length === 0 ? (
                                <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                                  <AlertCircle
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                  />

                                  <p>
                                    No subjects are attached
                                    to this class. Add
                                    subjects to this class
                                    before assigning them
                                    to a teacher.
                                  </p>
                                </div>
                              ) : (
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {classSubjects.map(
                                    (subject) => {
                                      const checked =
                                        chosenSubjects.includes(
                                          subject._id
                                        );

                                      return (
                                        <label
                                          key={subject._id}
                                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                                            checked
                                              ? "border-blue-300 bg-white dark:border-blue-800 dark:bg-gray-900"
                                              : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={checked}
                                            disabled={submitting}
                                            onChange={() =>
                                              toggleSubject(
                                                schoolClass._id,
                                                subject._id
                                              )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                          />

                                          <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                              {subject.subjectName}
                                            </span>

                                            {subject.subjectCode && (
                                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {subject.subjectCode}
                                              </span>
                                            )}
                                          </span>

                                          {checked && (
                                            <Check
                                              size={16}
                                              className="text-blue-600"
                                            />
                                          )}
                                        </label>
                                      );
                                    }
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* SUMMARY */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Selected Classes
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedClasses.length}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Selected Subjects
                  </p>

                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {totalSelectedSubjects}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ERROR */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0"
              />

              <p>{error}</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end dark:border-gray-800 dark:bg-gray-950">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting ||
              loading ||
              academicSessionsLoading ||
              academicSessions.length === 0
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Assigning...
              </>
            ) : (
              <>
                <Check size={17} />
                Save Teacher Assignments
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}