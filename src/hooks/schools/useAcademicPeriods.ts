




"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  getAcademicSessions,
  type AcademicSession,
} from "@/lib/schools/portal/services/academicsessions";

import {
  getAcademicPeriods,
  createAcademicPeriod,
  updateAcademicPeriod,
  updateAcademicPeriodStatus,
  type AcademicPeriod,
  type CreateAcademicPeriodPayload,
  type UpdateAcademicPeriodPayload,
} from "@/lib/schools/portal/services/academicperiods";

import type { PeriodForm } from "@/types/schools/academic-period.types";

import {
  EMPTY_PERIOD_FORM,
  filterAcademicPeriods,
  getFriendlyError,
  getNextPeriodNumber,
  getPeriodActive,
  getPeriodId,
  getPeriodName,
  getSessionId,
  isValidDateRange,
} from "@/lib/schools/utils/academic-period.utils";

export function useAcademicPeriods(schoolSubdomain: string) {
  /* =====================================================
     STATE
  ===================================================== */

  const [sessions, setSessions] = useState<AcademicSession[]>([]);

  const [selectedSessionId, setSelectedSessionId] = useState("");

  const [periods, setPeriods] = useState<AcademicPeriod[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loadingSessions, setLoadingSessions] = useState(true);

  const [loadingPeriods, setLoadingPeriods] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [updatingStatusId, setUpdatingStatusId] = useState("");

  const [sessionError, setSessionError] = useState("");

  const [periodError, setPeriodError] = useState("");

  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingPeriod, setEditingPeriod] =
    useState<AcademicPeriod | null>(null);

  const [form, setForm] = useState<PeriodForm>(EMPTY_PERIOD_FORM);

  /* =====================================================
     SELECTED SESSION
  ===================================================== */

  const selectedSession = useMemo(() => {
    return (
      sessions.find(
        (session) => getSessionId(session) === selectedSessionId
      ) || null
    );
  }, [sessions, selectedSessionId]);

  /* =====================================================
     FORM HELPERS
  ===================================================== */

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingPeriod(null);
    setForm(EMPTY_PERIOD_FORM);
  }, []);

  const openCreateForm = useCallback(() => {
    setEditingPeriod(null);

    setForm({
      ...EMPTY_PERIOD_FORM,
      periodNumber: String(getNextPeriodNumber(periods)),
    });

    setPeriodError("");
    setSuccess("");
    setShowForm(true);
  }, [periods]);

  const openEditForm = useCallback((period: AcademicPeriod) => {
    setEditingPeriod(period);

    setForm({
      periodName: getPeriodName(period),
      periodNumber: String(period.periodNumber ?? ""),
      startDate: period.startDate
        ? String(period.startDate).slice(0, 10)
        : "",
      endDate: period.endDate
        ? String(period.endDate).slice(0, 10)
        : "",
    });

    setPeriodError("");
    setSuccess("");
    setShowForm(true);
  }, []);

  const handleFormChange = useCallback(
    (name: keyof PeriodForm, value: string) => {
      setForm((current) => ({
        ...current,
        [name]: value,
      }));
    },
    []
  );

  /* =====================================================
     FETCH ACADEMIC SESSIONS
  ===================================================== */

  const fetchSessions = useCallback(async () => {
    if (!schoolSubdomain) {
      setSessions([]);
      setSelectedSessionId("");
      setPeriods([]);

      setSessionError(
        "We couldn't identify your school. Please return to your school portal and try again."
      );

      setLoadingSessions(false);
      return;
    }

    setLoadingSessions(true);
    setSessionError("");
    setPeriodError("");
    setSuccess("");

    try {
      const result = await getAcademicSessions(schoolSubdomain);

      const fetchedSessions = Array.isArray(result.sessions)
        ? result.sessions
        : [];

      setSessions(fetchedSessions);

      setSelectedSessionId((current) => {
        const currentStillExists = fetchedSessions.some(
          (session) => getSessionId(session) === current
        );

        if (current && currentStillExists) {
          return current;
        }

        return fetchedSessions.length > 0
          ? getSessionId(fetchedSessions[0])
          : "";
      });

      if (fetchedSessions.length === 0) {
        setPeriods([]);
        setSelectedSessionId("");
        closeForm();
      }
    } catch (error) {
      setSessions([]);
      setPeriods([]);
      setSelectedSessionId("");

      setSessionError(
        getFriendlyError(
          error,
          "We couldn't load academic sessions. Please try again."
        )
      );
    } finally {
      setLoadingSessions(false);
    }
  }, [schoolSubdomain, closeForm]);

  /* =====================================================
     FETCH ACADEMIC PERIODS
  ===================================================== */

  const fetchPeriods = useCallback(async () => {
    if (!selectedSessionId || !schoolSubdomain) {
      setPeriods([]);
      setLoadingPeriods(false);
      return;
    }

    setLoadingPeriods(true);
    setPeriodError("");

    try {
      const result = await getAcademicPeriods(
        selectedSessionId,
        schoolSubdomain
      );

      setPeriods(
        Array.isArray(result.periods) ? result.periods : []
      );
    } catch (error) {
      setPeriods([]);

      setPeriodError(
        getFriendlyError(
          error,
          "We couldn't load academic periods. Please try again."
        )
      );
    } finally {
      setLoadingPeriods(false);
    }
  }, [selectedSessionId, schoolSubdomain]);

  /* =====================================================
     SESSION SELECTION
  ===================================================== */

  const handleSessionChange = useCallback(
    (sessionId: string) => {
      setSelectedSessionId(sessionId);
      setPeriods([]);
      setSearchTerm("");
      setPeriodError("");
      setSuccess("");
      closeForm();
    },
    [closeForm]
  );

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = useCallback(async () => {
    await fetchSessions();
  }, [fetchSessions]);

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (selectedSessionId) {
      void fetchPeriods();
    } else {
      setPeriods([]);
      setLoadingPeriods(false);
    }
  }, [selectedSessionId, fetchPeriods]);

  /* =====================================================
     CREATE / UPDATE ACADEMIC PERIOD
  ===================================================== */

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedSessionId) {
        setPeriodError(
          "Please select an academic session before continuing."
        );
        return;
      }

      if (!form.periodName.trim()) {
        setPeriodError("Please enter the period name.");
        return;
      }

      const periodNumber = Number(form.periodNumber);

      if (
        !form.periodNumber.trim() ||
        !Number.isInteger(periodNumber) ||
        periodNumber < 1
      ) {
        setPeriodError(
          "Please enter a valid period number. It must be a positive whole number."
        );
        return;
      }

      if (!form.startDate || !form.endDate) {
        setPeriodError(
          "Please provide both the start date and end date."
        );
        return;
      }

      if (!isValidDateRange(form.startDate, form.endDate)) {
        setPeriodError(
          "The end date cannot be earlier than the start date."
        );
        return;
      }

      const duplicateNumber = periods.some((period) => {
        if (
          editingPeriod &&
          getPeriodId(period) === getPeriodId(editingPeriod)
        ) {
          return false;
        }

        return Number(period.periodNumber) === periodNumber;
      });

      if (duplicateNumber) {
        setPeriodError(
          `Period number ${periodNumber} is already assigned. Please use another number.`
        );
        return;
      }

      setSubmitting(true);
      setPeriodError("");
      setSuccess("");

      const payload: CreateAcademicPeriodPayload = {
        periodName: form.periodName.trim(),
        periodNumber,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      try {
        if (editingPeriod) {
          const periodId = getPeriodId(editingPeriod);

          if (!periodId) {
            throw new Error(
              "We couldn't identify the academic period you want to update."
            );
          }

          const updatePayload: UpdateAcademicPeriodPayload = payload;

          await updateAcademicPeriod(
            selectedSessionId,
            periodId,
            updatePayload,
            schoolSubdomain
          );

          setSuccess("Academic period updated successfully.");
        } else {
          await createAcademicPeriod(
            selectedSessionId,
            payload,
            schoolSubdomain
          );

          setSuccess("Academic period created successfully.");
        }

        closeForm();
        await fetchPeriods();
      } catch (error) {
        setPeriodError(
          getFriendlyError(
            error,
            editingPeriod
              ? "We couldn't update the academic period. Please try again."
              : "We couldn't create the academic period. Please try again."
          )
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      selectedSessionId,
      form,
      periods,
      editingPeriod,
      schoolSubdomain,
      closeForm,
      fetchPeriods,
    ]
  );

  /* =====================================================
     ACTIVATE / DEACTIVATE ACADEMIC PERIOD
  ===================================================== */

  const handleToggleStatus = useCallback(
    async (period: AcademicPeriod) => {
      const periodId = getPeriodId(period);

      if (!periodId || !selectedSessionId) {
        setPeriodError(
          "We couldn't identify this academic period."
        );
        return;
      }

      const currentlyActive = getPeriodActive(period);
      const nextStatus = !currentlyActive;

      setPeriodError("");
      setSuccess("");
      setUpdatingStatusId(periodId);

      try {
        await updateAcademicPeriodStatus(
          selectedSessionId,
          periodId,
          { isActive: nextStatus },
          schoolSubdomain
        );

        setSuccess(
          nextStatus
            ? "Academic period activated successfully."
            : "Academic period deactivated successfully."
        );

        await fetchPeriods();
      } catch (error) {
        setPeriodError(
          getFriendlyError(
            error,
            "We couldn't update the academic period status. Please try again."
          )
        );
      } finally {
        setUpdatingStatusId("");
      }
    },
    [selectedSessionId, schoolSubdomain, fetchPeriods]
  );

  /* =====================================================
     SEARCH AND STATISTICS
  ===================================================== */

  const filteredPeriods = useMemo(
    () => filterAcademicPeriods(periods, searchTerm),
    [periods, searchTerm]
  );

  const activePeriods = useMemo(
    () => periods.filter(getPeriodActive).length,
    [periods]
  );

  /* =====================================================
     RETURN
  ===================================================== */

  return {
    sessions,
    selectedSessionId,
    selectedSession,
    periods,
    filteredPeriods,

    searchTerm,
    setSearchTerm,

    loadingSessions,
    loadingPeriods,
    submitting,
    updatingStatusId,

    sessionError,
    periodError,
    success,

    showForm,
    editingPeriod,
    form,

    activePeriods,

    setPeriodError,
    setSuccess,

    fetchSessions,
    fetchPeriods,
    handleRefresh,
    handleSessionChange,

    openCreateForm,
    openEditForm,
    closeForm,
    handleFormChange,

    handleSubmit,
    handleToggleStatus,
  };
}
