





import type { EnrollStudentModalProps } from "@/types/schools/enrollment.types";

import Modal from "../shared/Modal";
import FormField from "../shared/FormField";
import ModalActions from "../shared/ModalActions";

export default function EnrollStudentModal({
  open,
  submitting,
  optionsLoading,
  sessionName,
  students,
  classes,
  schoolMembershipId,
  classId,
  subjects,
  selectedSubjectIds,
  onStudentChange,
  onClassChange,
  onSubjectChange,
  onSelectAllSubjects,
  onSubmit,
  onClose,
}: EnrollStudentModalProps) {
  if (!open) return null;

  const allSubjectsSelected =
    subjects.length > 0 &&
    subjects.every((subject) => {
      const subjectId = String(subject._id ?? subject.id ?? "");
      return selectedSubjectIds.includes(subjectId);
    });

  const selectedClass = classes.find((schoolClass) => {
    const actualClassId = String(
      schoolClass._id ||
        schoolClass.id ||
        schoolClass.classId ||
        ""
    );

    return actualClassId === classId;
  });

  return (
    <Modal
      title="Enroll Student"
      description="Add a student to a class and select the subjects they will study."
      onClose={onClose}
    >
      <form
        onSubmit={onSubmit}
        className="flex max-h-[calc(100dvh-12rem)] min-h-0 flex-col"
      >
        {/* SCROLLABLE FORM CONTENT */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-1 pb-4 pr-2">

          {/* ACADEMIC SESSION */}
          <div className="rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-700">
            Academic Session:{" "}
            <strong>{sessionName || "Not selected"}</strong>
          </div>

          {/* STUDENT */}
          <FormField label="Student" required>
            <select
              value={schoolMembershipId}
              onChange={(event) =>
                onStudentChange(event.target.value)
              }
              required
              disabled={optionsLoading || students.length === 0}
              className="form-input"
            >
              <option value="">
                {optionsLoading
                  ? "Loading students..."
                  : students.length === 0
                    ? "No active students available"
                    : "Select a student"}
              </option>

              {students.map((student) => {
                const membershipId = student._id || "";

                return (
                  <option key={membershipId} value={membershipId}>
                    {student.firstName} {student.lastName}
                  </option>
                );
              })}
            </select>
          </FormField>

          {/* CLASS */}
          <FormField label="Class" required>
            <select
              value={classId}
              onChange={(event) =>
                onClassChange(event.target.value)
              }
              required
              disabled={optionsLoading || classes.length === 0}
              className="form-input"
            >
              <option value="">
                {optionsLoading
                  ? "Loading classes..."
                  : classes.length === 0
                    ? "No active classes available"
                    : "Select a class"}
              </option>

              {classes.map((schoolClass) => {
                const actualClassId =
                  schoolClass._id ||
                  schoolClass.id ||
                  schoolClass.classId ||
                  "";

                return (
                  <option
                    key={actualClassId}
                    value={actualClassId}
                  >
                    {schoolClass.name}
                    {schoolClass.arm
                      ? ` - ${schoolClass.arm}`
                      : ""}
                  </option>
                );
              })}
            </select>
          </FormField>

          {/* CLASS SUBJECTS */}
          {classId && (
            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Student Subjects
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Select the subjects this student will study
                    {selectedClass
                      ? ` in ${selectedClass.name}${
                          selectedClass.arm
                            ? ` - ${selectedClass.arm}`
                            : ""
                        }.`
                      : "."}
                  </p>
                </div>

                {subjects.length > 0 && (
                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {selectedSubjectIds.length}/{subjects.length} selected
                  </span>
                )}
              </div>

              {optionsLoading ? (
                <p className="text-sm text-gray-500">
                  Loading subjects...
                </p>
              ) : subjects.length === 0 ? (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                  No active subjects are attached to this class.
                  Please attach subjects to the class before
                  enrolling a student.
                </div>
              ) : (
                <>
                  {/* SELECT ALL */}
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-gray-50 p-3">
                    <input
                      type="checkbox"
                      checked={allSubjectsSelected}
                      onChange={(event) =>
                        onSelectAllSubjects(event.target.checked)
                      }
                      disabled={submitting}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span className="text-sm font-medium text-gray-800">
                      Select all subjects
                    </span>
                  </label>

                  {/* SCROLLABLE SUBJECT LIST */}
                  <div className="max-h-64 space-y-2 overflow-y-auto overscroll-contain rounded-lg pr-2">
                    {subjects.map((subject) => {
                      const subjectId = String(
                        subject._id ?? subject.id ?? ""
                      );

                      if (!subjectId) return null;

                      const checked =
                        selectedSubjectIds.includes(subjectId);

                      return (
                        <label
                          key={subjectId}
                          className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                onSubjectChange(subjectId)
                              }
                              disabled={submitting}
                              className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />

                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-gray-800">
                                {subject.subjectName}
                              </span>

                              {subject.subjectCode && (
                                <span className="block text-xs text-gray-500">
                                  {subject.subjectCode}
                                </span>
                              )}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* INFORMATION */}
          <div className="rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-700">
            The enrollment will be created under the selected
            academic session.
          </div>
        </div>

        {/* FIXED ACTION AREA */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-1 pt-4">
          <ModalActions
            submitting={submitting}
            submitLabel="Enroll Student"
            onCancel={onClose}
          />
        </div>
      </form>
    </Modal>
  );
}
