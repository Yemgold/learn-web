






import type {
  AcademicSession,
} from "@/lib/schools/portal/services/academicsessions";

import type {
  AcademicPeriod,
} from "@/lib/schools/portal/services/academicperiods";

export interface PeriodForm {
  periodName: string;
  periodNumber: string;
  startDate: string;
  endDate: string;
}

export interface AcademicPeriodPageProps {
  schoolSubdomain: string;
}

export interface AcademicSessionSelectorProps {
  sessions: AcademicSession[];
  selectedSessionId: string;
  loading: boolean;
  error: string;
  onChange: (sessionId: string) => void;
  onReload: () => void;
}

export interface AcademicSessionDetailsProps {
  session: AcademicSession | null;
}

export interface AcademicPeriodSummaryProps {
  totalPeriods: number;
  activePeriods: number;
}

export interface AcademicPeriodSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface AcademicPeriodTableProps {
  periods: AcademicPeriod[];
  updatingStatusId: string;
  onEdit: (period: AcademicPeriod) => void;
  onToggleStatus: (period: AcademicPeriod) => void;
}

export interface AcademicPeriodEmptyStateProps {
  searchTerm: string;
  onAddPeriod: () => void;
  onRetry: () => void;
}

export interface AcademicPeriodListProps {
  periods: AcademicPeriod[];
  filteredPeriods: AcademicPeriod[];
  searchTerm: string;
  loading: boolean;
  error: string;
  updatingStatusId: string;
  onSearchChange: (value: string) => void;
  onAddPeriod: () => void;
  onEditPeriod: (period: AcademicPeriod) => void;
  onToggleStatus: (period: AcademicPeriod) => void;
  onRetry: () => void;
}

export interface AcademicPeriodFormModalProps {
  open: boolean;
  editingPeriod: AcademicPeriod | null;
  form: PeriodForm;
  submitting: boolean;
  periodTypeLabel: string;
  onChange: (
    name: keyof PeriodForm,
    value: string
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export interface AcademicPeriodFeedbackProps {
  sessionError: string;
  periodError: string;
  success: string;
  loadingSessions: boolean;
  onRefresh: () => void;
  onDismissPeriodError: () => void;
  onDismissSuccess: () => void;
}

export interface AcademicPeriodsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}
