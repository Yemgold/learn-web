







import type { ReactNode } from "react";
import type { FormEvent } from "react";
import type { SchoolMember } from "@/lib/schools/portal/services/member.service";
import type { SchoolClass } from "@/lib/schools/portal/services/class.service";
import { SchoolSubject } from "@/lib/schools/portal/services/subject.service";

export type EnrollmentStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "WITHDRAWN"
  | "TRANSFERRED"
  | "INACTIVE"
  | string;

export interface AcademicSessionOption {
  _id: string;
  sessionName: string;
  status?: string;
  periodType?: string;
}

export interface EnrollmentPerson {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  admissionNumber?: string;
}

export interface EnrollmentClass {
  _id?: string;
  id?: string;
  className?: string;
  name?: string;
}

export interface Enrollment {
  _id?: string;
  id?: string;

  studentId?: string | EnrollmentPerson;
  student?: EnrollmentPerson;

  classId?: string | EnrollmentClass;
  class?: EnrollmentClass;

  academicSessionId?: string | {
    _id?: string;
    id?: string;
    sessionName?: string;
  };

  academicPeriodId?: string | {
    _id?: string;
    id?: string;
    periodName?: string;
  };

  admissionNumber?: string;
  enrollmentDate?: string;
  status?: EnrollmentStatus;
  createdAt?: string;
  updatedAt?: string;

  [key: string]: unknown;
}

export interface EnrollmentCount {
  totalCount?: number;
  count?: number;
  enrollmentCount?: number;
  activeCount?: number;
  completedCount?: number;
  withdrawnCount?: number;
  [key: string]: unknown;
}

export interface EnrollmentSummaryData {
  total: number;
  active: number;
  completed: number;
  withdrawn: number;
}

export type SummaryCardColor = "blue" | "green" | "purple" | "red";

export interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: SummaryCardColor;
  loading?: boolean;
}

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface EnrollmentFormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

export interface ModalProps {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}

export interface ModalActionsProps {
  submitting: boolean;
  submitLabel: string;
  onCancel: () => void;
}

export interface EnrollmentFeedbackProps {
  successMessage: string;
  pageError: string;
  onDismissSuccess: () => void;
  onDismissError: () => void;
}

export interface AcademicSessionSelectorProps {
  sessions: AcademicSessionOption[];
  selectedSessionId: string;
  selectedSession?: AcademicSessionOption;
  loading: boolean;
  onChange: (value: string) => void;
  onReload: () => void;
}

export interface EnrollmentsHeaderProps {
  loading: boolean;
  countLoading: boolean;
  sessionSelected: boolean;
  onRefresh: () => void;
  onEnroll: () => void;
}

export interface EnrollmentCountProps {
  counts: EnrollmentCount;
  loading: boolean;
}

export interface EnrollmentRecordActions {
  submitting: boolean;
  onTransfer: (enrollment: Enrollment) => void;
  onUpdateStatus: (
    enrollment: Enrollment,
    status: "COMPLETED" | "WITHDRAWN"
  ) => void;
}

export interface EnrollmentTableProps extends EnrollmentRecordActions {
  enrollments: Enrollment[];
}

export interface EnrollmentMobileCardsProps extends EnrollmentRecordActions {
  enrollments: Enrollment[];
}

export interface EnrollmentRecordsProps extends EnrollmentRecordActions {
  academicSessionSelected: boolean;
  loading: boolean;
  enrollments: Enrollment[];
  filteredEnrollments: Enrollment[];
  search: string;
  statusFilter: string;
  schoolSubdomain: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export interface EnrollmentSummaryProps {
  summary: EnrollmentSummaryData;
  loading: boolean;
}


export interface EnrollStudentModalProps {
  open: boolean;
  submitting: boolean;
  optionsLoading: boolean;
  sessionName: string;

  students: SchoolMember[];
  classes: SchoolClass[];

  schoolMembershipId: string;
  classId: string;

  subjects: SchoolSubject[];
  selectedSubjectIds: string[];

  onStudentChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onSubjectChange: (subjectId: string) => void;
  onSelectAllSubjects: (checked: boolean) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}


export interface TransferStudentModalProps {
  open: boolean;
  submitting: boolean;
  optionsLoading: boolean;
  enrollment: Enrollment | null;
  classes: SchoolClass[];
  targetClassId: string;
  onTargetClassChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}


export interface EnrollmentSubject {
  _id: string;
  id?: string;
  name: string;
  subjectCode?: string;
  description?: string;
  isActive?: boolean;
}