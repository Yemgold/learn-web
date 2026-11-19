


"use client";

import { useParams } from "next/navigation";
import { CircleAlert, Loader2 } from "lucide-react";

import { useEnrollments } from "@/hooks/schools/useEnrollments";

import EnrollmentsHeader from "@/components/schools/enrollments/EnrollmentsHeader";
import EnrollmentFeedback from "@/components/schools/enrollments/EnrollmentFeedback";
import AcademicSessionSelector from "@/components/schools/enrollments/AcademicSessionSelector";
import EnrollmentSummary from "@/components/schools/enrollments/EnrollmentSummary";
import EnrollmentCount from "@/components/schools/enrollments/EnrollmentCount";
import EnrollmentRecords from "@/components/schools/enrollments/EnrollmentRecords";
import EnrollStudentModal from "@/components/schools/enrollments/EnrollStudentModal";
import TransferStudentModal from "@/components/schools/enrollments/TransferStudentModal";



export default function EnrollmentsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const enrollment = useEnrollments(slug);

  const {
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

    pageError,
    successMessage,
    setPageError,
    setSuccessMessage,

    students,
    classes,

    // SUBJECTS AND SUBJECT SELECTION
    subjects,
    selectedSubjectIds,
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
  } = enrollment;

  /* =========================================================
     AUTH HYDRATION
  ========================================================= */

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2
          size={30}
          className="animate-spin text-blue-600"
        />

        <p className="text-sm font-medium text-gray-500">
          Preparing school portal...
        </p>
      </div>
    );
  }

  /* =========================================================
     MISSING SCHOOL CONTEXT
  ========================================================= */

  if (!schoolId || !schoolSubdomain) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm">
          <CircleAlert
            size={32}
            className="mx-auto text-amber-500"
          />

          <h2 className="mt-3 font-bold text-gray-900">
            School information unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Your account does not contain the required school membership
            information. Please sign in again through your school portal.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="space-y-6 pb-10">
      <EnrollmentsHeader
        loading={loading}
        countLoading={countLoading}
        sessionSelected={Boolean(academicSessionId)}
        onRefresh={() => void refreshData()}
        onEnroll={openEnrollModal}
      />

      <EnrollmentFeedback
        successMessage={successMessage}
        pageError={pageError}
        onDismissSuccess={() => setSuccessMessage("")}
        onDismissError={() => setPageError("")}
      />

      <AcademicSessionSelector
        sessions={academicSessions}
        selectedSessionId={academicSessionId}
        selectedSession={selectedSession}
        loading={sessionsLoading}
        onChange={handleSessionChange}
        onReload={() => void fetchAcademicSessions()}
      />

      <EnrollmentSummary
  summary={{
    ...summary,
    total: Number(counts.total ?? summary.total ?? 0),
  }}
  loading={loading || countLoading}
/>

      {/* {academicSessionId && (
        <EnrollmentCount
          counts={counts}
          loading={countLoading}
        />
      )} */}

      <EnrollmentRecords
        academicSessionSelected={Boolean(academicSessionId)}
        loading={loading}
        enrollments={enrollments}
        filteredEnrollments={filteredEnrollments}
        search={search}
        statusFilter={statusFilter}
        schoolSubdomain={schoolSubdomain}
        submitting={submitting}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onTransfer={openTransferModal}
        onUpdateStatus={(record, status) =>
          void handleUpdateStatus(record, status)
        }
      />

      {/* ENROLL STUDENT MODAL */}
      <EnrollStudentModal
        open={showEnrollModal}
        submitting={submitting}
        optionsLoading={optionsLoading}
        sessionName={selectedSession?.sessionName || ""}
        students={students}
        classes={classes}
        schoolMembershipId={schoolMembershipId}
        classId={classId}
        onStudentChange={setSchoolMembershipId}
        subjects={subjects}
        selectedSubjectIds={selectedSubjectIds}
        onClassChange={handleClassChange}
        onSubjectChange={handleSubjectChange}
        onSelectAllSubjects={handleSelectAllSubjects}
        onSubmit={handleEnrollStudent}
        onClose={closeEnrollModal}
      />

      {/* TRANSFER STUDENT MODAL */}
      <TransferStudentModal
        open={showTransferModal}
        submitting={submitting}
        optionsLoading={optionsLoading}
        enrollment={selectedEnrollment}
        classes={classes}
        targetClassId={targetClassId}
        onTargetClassChange={setTargetClassId}
        onSubmit={handleTransferStudent}
        onClose={closeTransferModal}
      />
    </div>
  );
}
