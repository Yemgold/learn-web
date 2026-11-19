


"use client";

import { useParams } from "next/navigation";

import { CalendarDays } from "lucide-react";

import { useAcademicPeriods } from "@/hooks/schools/useAcademicPeriods"; 

import AcademicPeriodsHeader from "@/components/schools/academicperiods/Header"; 
import AcademicPeriodFeedback from "@/components/schools/academicperiods/Feedback"; 
import AcademicSessionSelector from "@/components/schools/academicperiods/SessionSelector";
import AcademicSessionDetails from "@/components/schools/academicperiods/SessionDetails"; 
import AcademicPeriodSummary from "@/components/schools/academicperiods/PeriodSummary"; 
import AcademicPeriodList from "@/components/schools/academicperiods/PeriodList";
import AcademicPeriodFormModal from "@/components/schools/academicperiods/PeriodFormModal"; 

import { getPeriodTypeLabel } from "@/lib/schools/utils/academic-period.utils"; 

export default function AcademicPeriodPage() {
  /* =====================================================
     SCHOOL SUBDOMAIN
  ===================================================== */

  const params = useParams<{ slug: string }>();

  const slug = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const schoolSubdomain = String(slug || "")
    .trim()
    .toLowerCase();

  /* =====================================================
     ACADEMIC PERIOD HOOK
  ===================================================== */

  const academicPeriods = useAcademicPeriods(
    schoolSubdomain
  );

  const {
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

    handleRefresh,
    handleSessionChange,

    openCreateForm,
    openEditForm,
    closeForm,
    handleFormChange,

    handleSubmit,
    handleToggleStatus,
    fetchPeriods,
  } = academicPeriods;

  /* =====================================================
     LOADING STATE
  ===================================================== */

  const isRefreshing =
    loadingSessions || loadingPeriods;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="space-y-6 pb-10">
      {/* PAGE HEADER */}

      <AcademicPeriodsHeader
        loading={isRefreshing}
        onRefresh={() => void handleRefresh()}
      />

      {/* FEEDBACK */}

      <AcademicPeriodFeedback
        sessionError={sessionError}
        periodError={periodError}
        success={success}
        loadingSessions={loadingSessions}
        onRefresh={() => void handleRefresh()}
        onDismissPeriodError={() =>
          setPeriodError("")
        }
        onDismissSuccess={() =>
          setSuccess("")
        }
      />

      {/* ACADEMIC SESSION SELECTOR */}

      <AcademicSessionSelector
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        loading={loadingSessions}
        error={sessionError}
        onChange={handleSessionChange}
        onReload={() => void handleRefresh()}
      />

      {/* SELECTED SESSION DETAILS */}

      {selectedSession && (
        <AcademicSessionDetails
          session={selectedSession}
        />
      )}

      {/* PERIOD MANAGEMENT */}

      {selectedSessionId && !sessionError && (
        <>
          {/* STATISTICS */}

          <AcademicPeriodSummary
            totalPeriods={periods.length}
            activePeriods={activePeriods}
          />

          {/* PERIOD LIST */}

          <AcademicPeriodList
            periods={periods}
            filteredPeriods={filteredPeriods}
            searchTerm={searchTerm}
            loading={loadingPeriods}
            error={periodError}
            updatingStatusId={updatingStatusId}
            onSearchChange={setSearchTerm}
            onAddPeriod={openCreateForm}
            onEditPeriod={openEditForm}
            onToggleStatus={(period) =>
              void handleToggleStatus(period)
            }
            onRetry={() => void fetchPeriods()}
          />
        </>
      )}

      {/* NO SESSION SELECTED */}

      {!loadingSessions &&
        !sessionError &&
        sessions.length > 0 &&
        !selectedSessionId && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <CalendarDays
              size={30}
              className="mx-auto mb-3 text-gray-400"
            />

            <h3 className="font-semibold text-gray-800">
              Select an Academic Session
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Choose a session above to view and manage
              its periods.
            </p>
          </div>
        )}

      {/* CREATE / EDIT MODAL */}

      <AcademicPeriodFormModal
        open={showForm}
        editingPeriod={editingPeriod}
        form={form}
        submitting={submitting}
        periodTypeLabel={getPeriodTypeLabel(
          selectedSession
        )}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={closeForm}
      />
    </div>
  );
}









// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   type FormEvent,
//   type ChangeEvent,
// } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   Plus,
//   Search,
//   RefreshCw,
//   CalendarDays,
//   BookOpen,
//   Pencil,
//   Power,
//   X,
//   ChevronDown,
//   AlertCircle,
//   ArrowRight,
//   Hash,
// } from "lucide-react";

// import {
//   getAcademicSessions,
//   type AcademicSession,
// } from "@/lib/schools/portal/services/academicsessions";

// import {
//   getAcademicPeriods,
//   createAcademicPeriod,
//   updateAcademicPeriod,
//   updateAcademicPeriodStatus,
//   type AcademicPeriod,
//   type CreateAcademicPeriodPayload,
//   type UpdateAcademicPeriodPayload,
// } from "@/lib/schools/portal/services/academicperiods";

// /* =========================================================
//    TYPES
// ========================================================= */

// interface PeriodForm {
//   periodName: string;
//   periodNumber: string;
//   startDate: string;
//   endDate: string;
// }

// const EMPTY_FORM: PeriodForm = {
//   periodName: "",
//   periodNumber: "1",
//   startDate: "",
//   endDate: "",
// };

// /* =========================================================
//    HELPERS
// ========================================================= */

// function getSessionId(session: AcademicSession): string {
//   return String(
//     session._id ||
//       session.id ||
//       session.academicSessionId ||
//       ""
//   );
// }

// function getSessionName(session: AcademicSession): string {
//   return (
//     session.sessionName ||
//     session.name ||
//     session.academicYear ||
//     session.year ||
//     session.title ||
//     "Unnamed academic session"
//   );
// }

// function getPeriodId(period: AcademicPeriod): string {
//   return String(period._id || period.id || "");
// }

// function getPeriodName(period: AcademicPeriod): string {
//   return (
//     period.periodName ||
//     period.name ||
//     (period.periodNumber
//       ? `Period ${period.periodNumber}`
//       : "Unnamed period")
//   );
// }

// function getPeriodTypeLabel(session: AcademicSession | null): string {
//   if (!session?.periodType) return "Academic period";

//   return session.periodType === "SEMESTER"
//     ? "Semester"
//     : "Term";
// }

// function formatDate(date?: string): string {
//   if (!date) return "—";

//   const parsed = new Date(date);

//   if (Number.isNaN(parsed.getTime())) return "—";

//   return parsed.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }

// function getFriendlyError(
//   error: unknown,
//   fallback: string
// ): string {
//   if (error instanceof Error && error.message.trim()) {
//     return error.message;
//   }

//   return fallback;
// }

// function getNextPeriodNumber(periods: AcademicPeriod[]): number {
//   const numbers = periods
//     .map((period) => Number(period.periodNumber))
//     .filter((number) => Number.isInteger(number) && number > 0);

//   return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
// }

// function getPeriodActive(period: AcademicPeriod): boolean {
//   return (
//     period.isActive === true ||
//     String(period.status || "").toLowerCase() === "active"
//   );
// }

// function isValidDateRange(startDate: string, endDate: string): boolean {
//   if (!startDate || !endDate) return false;

//   return (
//     new Date(`${endDate}T00:00:00`).getTime() >=
//     new Date(`${startDate}T00:00:00`).getTime()
//   );
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// export default function AcademicPeriodPage() {
//   const params = useParams();
//   const router = useRouter();

//   const slug = Array.isArray(params.slug)
//     ? params.slug[0]
//     : params.slug;

//   const schoolSubdomain = String(slug || "")
//     .trim()
//     .toLowerCase();

//   /* =======================================================
//      STATE
//   ======================================================= */

//   const [sessions, setSessions] = useState<AcademicSession[]>([]);
//   const [selectedSessionId, setSelectedSessionId] = useState("");

//   const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [loadingSessions, setLoadingSessions] = useState(true);
//   const [loadingPeriods, setLoadingPeriods] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [updatingStatusId, setUpdatingStatusId] = useState("");

//   const [sessionError, setSessionError] = useState("");
//   const [periodError, setPeriodError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [showForm, setShowForm] = useState(false);
//   const [editingPeriod, setEditingPeriod] =
//     useState<AcademicPeriod | null>(null);

//   const [form, setForm] = useState<PeriodForm>(EMPTY_FORM);

//   /* =======================================================
//      SELECTED SESSION
//   ======================================================= */

//   const selectedSession = useMemo(
//     () =>
//       sessions.find(
//         (session) => getSessionId(session) === selectedSessionId
//       ) || null,
//     [sessions, selectedSessionId]
//   );

//   /* =======================================================
//      FETCH ACADEMIC SESSIONS
//   ======================================================= */

//   const fetchSessions = useCallback(async () => {
//     if (!schoolSubdomain) {
//       setSessions([]);
//       setSelectedSessionId("");
//       setSessionError(
//         "We couldn't identify your school. Please return to your school portal and try again."
//       );
//       setLoadingSessions(false);
//       return;
//     }

//     setLoadingSessions(true);
//     setSessionError("");
//     setPeriodError("");
//     setSuccess("");

//     try {
//       const result = await getAcademicSessions(schoolSubdomain);

//       const fetchedSessions = Array.isArray(result.sessions)
//         ? result.sessions
//         : [];

//       setSessions(fetchedSessions);

//       setSelectedSessionId((current) => {
//         const currentStillExists = fetchedSessions.some(
//           (session) => getSessionId(session) === current
//         );

//         if (current && currentStillExists) {
//           return current;
//         }

//         return fetchedSessions.length
//           ? getSessionId(fetchedSessions[0])
//           : "";
//       });

//       if (fetchedSessions.length === 0) {
//         setPeriods([]);
//         setSelectedSessionId("");
//       }
//     } catch (error) {
//       setSessions([]);
//       setPeriods([]);
//       setSelectedSessionId("");

//       setSessionError(
//         getFriendlyError(
//           error,
//           "We couldn't load academic sessions. Please try again."
//         )
//       );
//     } finally {
//       setLoadingSessions(false);
//     }
//   }, [schoolSubdomain]);

//   /* =======================================================
//      FETCH PERIODS FOR SELECTED SESSION
//   ======================================================= */

//   const fetchPeriods = useCallback(async () => {
//     if (!selectedSessionId || !schoolSubdomain) {
//       setPeriods([]);
//       setLoadingPeriods(false);
//       return;
//     }

//     setLoadingPeriods(true);
//     setPeriodError("");

//     try {
//       const result = await getAcademicPeriods(
//         selectedSessionId,
//         schoolSubdomain
//       );

//       setPeriods(
//         Array.isArray(result.periods) ? result.periods : []
//       );
//     } catch (error) {
//       setPeriods([]);

//       setPeriodError(
//         getFriendlyError(
//           error,
//           "We couldn't load academic periods. Please try again."
//         )
//       );
//     } finally {
//       setLoadingPeriods(false);
//     }
//   }, [selectedSessionId, schoolSubdomain]);

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     void fetchSessions();
//   }, [fetchSessions]);

//   useEffect(() => {
//     if (selectedSessionId) {
//       void fetchPeriods();
//     } else {
//       setPeriods([]);
//       setLoadingPeriods(false);
//     }
//   }, [selectedSessionId, fetchPeriods]);

//   /* =======================================================
//      SESSION SELECTION
//   ======================================================= */

//   function handleSessionChange(
//     event: ChangeEvent<HTMLSelectElement>
//   ) {
//     setSelectedSessionId(event.target.value);
//     setPeriods([]);
//     setSearchTerm("");
//     setPeriodError("");
//     setSuccess("");
//     closeForm();
//   }

//   /* =======================================================
//      REFRESH
//   ======================================================= */

//   async function handleRefresh() {
//     await fetchSessions();
//   }

//   /* =======================================================
//      FORM HELPERS
//   ======================================================= */

//   function closeForm() {
//     setShowForm(false);
//     setEditingPeriod(null);
//     setForm(EMPTY_FORM);
//   }

//   function openCreateForm() {
//     setEditingPeriod(null);

//     setForm({
//       ...EMPTY_FORM,
//       periodNumber: String(getNextPeriodNumber(periods)),
//     });

//     setPeriodError("");
//     setSuccess("");
//     setShowForm(true);
//   }

//   function openEditForm(period: AcademicPeriod) {
//     setEditingPeriod(period);

//     setForm({
//       periodName: getPeriodName(period),
//       periodNumber: String(period.periodNumber ?? ""),
//       startDate: period.startDate
//         ? String(period.startDate).slice(0, 10)
//         : "",
//       endDate: period.endDate
//         ? String(period.endDate).slice(0, 10)
//         : "",
//     });

//     setPeriodError("");
//     setSuccess("");
//     setShowForm(true);
//   }

//   function handleFormChange(
//     event: ChangeEvent<HTMLInputElement>
//   ) {
//     const { name, value } = event.target;

//     setForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   }

//   /* =======================================================
//      CREATE / UPDATE PERIOD
//   ======================================================= */

//   async function handleSubmit(
//     event: FormEvent<HTMLFormElement>
//   ) {
//     event.preventDefault();

//     if (!selectedSessionId) {
//       setPeriodError(
//         "Please select an academic session before continuing."
//       );
//       return;
//     }

//     if (!form.periodName.trim()) {
//       setPeriodError("Please enter the period name.");
//       return;
//     }

//     const periodNumber = Number(form.periodNumber);

//     if (
//       !form.periodNumber.trim() ||
//       !Number.isInteger(periodNumber) ||
//       periodNumber < 1
//     ) {
//       setPeriodError(
//         "Please enter a valid period number. It must be a positive whole number."
//       );
//       return;
//     }

//     if (!form.startDate || !form.endDate) {
//       setPeriodError(
//         "Please provide both the start date and end date."
//       );
//       return;
//     }

//     if (!isValidDateRange(form.startDate, form.endDate)) {
//       setPeriodError(
//         "The end date cannot be earlier than the start date."
//       );
//       return;
//     }

//     const duplicateNumber = periods.some((period) => {
//       if (
//         editingPeriod &&
//         getPeriodId(period) === getPeriodId(editingPeriod)
//       ) {
//         return false;
//       }

//       return Number(period.periodNumber) === periodNumber;
//     });

//     if (duplicateNumber) {
//       setPeriodError(
//         `Period number ${periodNumber} is already assigned. Please use another number.`
//       );
//       return;
//     }

//     setSubmitting(true);
//     setPeriodError("");
//     setSuccess("");

//     const payload: CreateAcademicPeriodPayload = {
//       periodName: form.periodName.trim(),
//       periodNumber,
//       startDate: form.startDate,
//       endDate: form.endDate,
//     };

//     try {
//       if (editingPeriod) {
//         const periodId = getPeriodId(editingPeriod);

//         if (!periodId) {
//           throw new Error(
//             "We couldn't identify the academic period you want to update."
//           );
//         }

//         const updatePayload: UpdateAcademicPeriodPayload = payload;

//         await updateAcademicPeriod(
//           selectedSessionId,
//           periodId,
//           updatePayload,
//           schoolSubdomain
//         );

//         setSuccess("Academic period updated successfully.");
//       } else {
//         await createAcademicPeriod(
//           selectedSessionId,
//           payload,
//           schoolSubdomain
//         );

//         setSuccess("Academic period created successfully.");
//       }

//       closeForm();
//       await fetchPeriods();
//     } catch (error) {
//       setPeriodError(
//         getFriendlyError(
//           error,
//           editingPeriod
//             ? "We couldn't update the academic period. Please try again."
//             : "We couldn't create the academic period. Please try again."
//         )
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   /* =======================================================
//      ACTIVATE / DEACTIVATE PERIOD
//   ======================================================= */

//   async function handleToggleStatus(period: AcademicPeriod) {
//     const periodId = getPeriodId(period);

//     if (!periodId || !selectedSessionId) {
//       setPeriodError("We couldn't identify this academic period.");
//       return;
//     }

//     const currentlyActive = getPeriodActive(period);
//     const nextStatus = !currentlyActive;

//     setPeriodError("");
//     setSuccess("");
//     setUpdatingStatusId(periodId);

//     try {
//       await updateAcademicPeriodStatus(
//         selectedSessionId,
//         periodId,
//         { isActive: nextStatus },
//         schoolSubdomain
//       );

//       setSuccess(
//         nextStatus
//           ? "Academic period activated successfully."
//           : "Academic period deactivated successfully."
//       );

//       await fetchPeriods();
//     } catch (error) {
//       setPeriodError(
//         getFriendlyError(
//           error,
//           "We couldn't update the academic period status. Please try again."
//         )
//       );
//     } finally {
//       setUpdatingStatusId("");
//     }
//   }

//   /* =======================================================
//      SEARCH AND STATISTICS
//   ======================================================= */

//   const filteredPeriods = useMemo(() => {
//     const search = searchTerm.trim().toLowerCase();

//     if (!search) return periods;

//     return periods.filter((period) => {
//       const name = getPeriodName(period).toLowerCase();

//       return (
//         name.includes(search) ||
//         String(period.periodNumber ?? "").includes(search)
//       );
//     });
//   }, [periods, searchTerm]);

//   const activePeriods = periods.filter(getPeriodActive).length;

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div className="space-y-6 pb-10">
//       {/* PAGE HEADER */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
//             <CalendarDays size={16} />
//             <span>Academic Management</span>
//             <span>/</span>
//             <span>Academic Periods</span>
//           </div>

//           <h1 className="text-2xl font-bold text-gray-900">
//             Academic Periods
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Manage terms, semesters, and other periods within an academic
//             session.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={handleRefresh}
//           disabled={loadingSessions || loadingPeriods}
//           className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           <RefreshCw
//             size={16}
//             className={
//               loadingSessions || loadingPeriods
//                 ? "animate-spin"
//                 : ""
//             }
//           />
//           Refresh
//         </button>
//       </div>

//       {/* SESSION ERROR */}
//       {sessionError && (
//         <div className="rounded-xl border border-red-200 bg-red-50 p-5">
//           <div className="flex items-start gap-3">
//             <AlertCircle
//               size={20}
//               className="mt-0.5 shrink-0 text-red-600"
//             />

//             <div className="min-w-0 flex-1">
//               <h3 className="font-semibold text-red-800">
//                 Unable to load academic sessions
//               </h3>

//               <p className="mt-1 text-sm text-red-700">
//                 {sessionError}
//               </p>

//               <button
//                 type="button"
//                 onClick={handleRefresh}
//                 disabled={loadingSessions}
//                 className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
//               >
//                 <RefreshCw
//                   size={15}
//                   className={loadingSessions ? "animate-spin" : ""}
//                 />
//                 Try Again
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PERIOD ERROR */}
//       {periodError && (
//         <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//           <AlertCircle size={18} className="mt-0.5 shrink-0" />

//           <p className="flex-1">{periodError}</p>

//           <button
//             type="button"
//             onClick={() => setPeriodError("")}
//             className="shrink-0"
//             aria-label="Dismiss error"
//           >
//             <X size={17} />
//           </button>
//         </div>
//       )}

//       {/* SUCCESS */}
//       {success && (
//         <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
//           <p>{success}</p>

//           <button
//             type="button"
//             onClick={() => setSuccess("")}
//             aria-label="Dismiss success message"
//           >
//             <X size={17} />
//           </button>
//         </div>
//       )}

//       {/* SESSION SELECTOR */}
//       <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//         <div className="mb-4 flex items-center gap-3">
//           <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
//             <CalendarDays size={21} />
//           </div>

//           <div>
//             <h2 className="font-semibold text-gray-900">
//               Select Academic Session
//             </h2>

//             <p className="text-sm text-gray-500">
//               Choose the session whose periods you want to manage.
//             </p>
//           </div>
//         </div>

//         {loadingSessions ? (
//           <div className="flex items-center gap-2 py-3 text-sm text-gray-500">
//             <RefreshCw size={16} className="animate-spin" />
//             Loading academic sessions...
//           </div>
//         ) : sessionError ? (
//           <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
//             Academic sessions could not be loaded. Please try again.
//           </div>
//         ) : sessions.length === 0 ? (
//           <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
//             <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
//               <CalendarDays size={25} />
//             </div>

//             <h3 className="font-semibold text-gray-800">
//               No Academic Sessions Found
//             </h3>

//             <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
//               Your school does not have any academic sessions yet.
//               Create an academic session before adding terms,
//               semesters or other academic periods.
//             </p>

//             <button
//               type="button"
//               onClick={() => router.push("/academic-sessions")}
//               className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
//             >
//               <Plus size={17} />
//               Create Academic Session
//               <ArrowRight size={16} />
//             </button>
//           </div>
//         ) : (
//           <div className="relative max-w-xl">
//             <select
//               value={selectedSessionId}
//               onChange={handleSessionChange}
//               className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             >
//               <option value="">Select an academic session</option>

//               {sessions.map((session, index) => {
//                 const id = getSessionId(session);

//                 return (
//                   <option key={id || index} value={id}>
//                     {getSessionName(session)}
//                     {session.isActive === true ? " (Active)" : ""}
//                   </option>
//                 );
//               })}
//             </select>

//             <ChevronDown
//               size={18}
//               className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             />
//           </div>
//         )}

//         {selectedSession && (
//           <div className="mt-4 rounded-lg bg-gray-50 p-4">
//             <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
//               Selected session
//             </p>

//             <p className="mt-1 font-semibold text-gray-900">
//               {getSessionName(selectedSession)}
//             </p>

//             <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
//               {(selectedSession.startDate ||
//                 selectedSession.endDate) && (
//                 <span>
//                   {formatDate(selectedSession.startDate)} –{" "}
//                   {formatDate(selectedSession.endDate)}
//                 </span>
//               )}

//               {selectedSession.periodType && (
//                 <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
//                   {selectedSession.periodType}
//                 </span>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* PERIOD MANAGEMENT */}
//       {selectedSessionId && !sessionError && (
//         <>
//           {/* STATISTICS */}
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">
//                     Total Periods
//                   </p>

//                   <p className="mt-2 text-2xl font-bold text-gray-900">
//                     {periods.length}
//                   </p>
//                 </div>

//                 <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
//                   <BookOpen size={22} />
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">
//                     Active Periods
//                   </p>

//                   <p className="mt-2 text-2xl font-bold text-green-600">
//                     {activePeriods}
//                   </p>
//                 </div>

//                 <div className="rounded-lg bg-green-50 p-3 text-green-600">
//                   <CalendarDays size={22} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* PERIOD LIST */}
//           <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
//             <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h2 className="font-semibold text-gray-900">
//                   Academic Periods
//                 </h2>

//                 <p className="mt-1 text-sm text-gray-500">
//                   Periods belonging to the selected academic session.
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={openCreateForm}
//                 disabled={loadingPeriods}
//                 className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <Plus size={17} />
//                 Add Period
//               </button>
//             </div>

//             {/* SEARCH */}
//             <div className="border-b border-gray-100 p-5">
//               <div className="relative max-w-md">
//                 <Search
//                   size={17}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(event) =>
//                     setSearchTerm(event.target.value)
//                   }
//                   placeholder="Search academic periods..."
//                   className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>
//             </div>

//             {/* PERIOD TABLE */}
//             {loadingPeriods ? (
//               <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-gray-500">
//                 <RefreshCw size={18} className="animate-spin" />
//                 Loading academic periods...
//               </div>
//             ) : periodError ? (
//               <div className="px-5 py-12 text-center">
//                 <BookOpen
//                   size={27}
//                   className="mx-auto mb-3 text-gray-400"
//                 />

//                 <h3 className="font-semibold text-gray-800">
//                   Unable to display academic periods
//                 </h3>

//                 <button
//                   type="button"
//                   onClick={() => void fetchPeriods()}
//                   className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//                 >
//                   <RefreshCw size={15} />
//                   Try Again
//                 </button>
//               </div>
//             ) : filteredPeriods.length === 0 ? (
//               <div className="px-5 py-14 text-center">
//                 <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
//                   <BookOpen size={23} />
//                 </div>

//                 <h3 className="font-semibold text-gray-800">
//                   {searchTerm
//                     ? "No Matching Periods Found"
//                     : "No Academic Periods Yet"}
//                 </h3>

//                 <p className="mt-1 text-sm text-gray-500">
//                   {searchTerm
//                     ? "Try another search term."
//                     : "Add the first period to this academic session."}
//                 </p>

//                 {!searchTerm && (
//                   <button
//                     type="button"
//                     onClick={openCreateForm}
//                     className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
//                   >
//                     <Plus size={16} />
//                     Add First Period
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[760px] text-left text-sm">
//                   <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
//                     <tr>
//                       <th className="px-5 py-4 font-semibold">
//                         Period
//                       </th>

//                       <th className="px-5 py-4 font-semibold">
//                         Period Number
//                       </th>

//                       <th className="px-5 py-4 font-semibold">
//                         Start Date
//                       </th>

//                       <th className="px-5 py-4 font-semibold">
//                         End Date
//                       </th>

//                       <th className="px-5 py-4 font-semibold">
//                         Status
//                       </th>

//                       <th className="px-5 py-4 text-right font-semibold">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-gray-100">
//                     {filteredPeriods.map((period, index) => {
//                       const id = getPeriodId(period);
//                       const isActive = getPeriodActive(period);
//                       const isUpdating = updatingStatusId === id;

//                       return (
//                         <tr
//                           key={id || index}
//                           className="transition hover:bg-gray-50"
//                         >
//                           <td className="px-5 py-4">
//                             <div className="font-medium text-gray-900">
//                               {getPeriodName(period)}
//                             </div>
//                           </td>

//                           <td className="px-5 py-4 text-gray-600">
//                             {period.periodNumber ?? "—"}
//                           </td>

//                           <td className="px-5 py-4 text-gray-600">
//                             {formatDate(period.startDate)}
//                           </td>

//                           <td className="px-5 py-4 text-gray-600">
//                             {formatDate(period.endDate)}
//                           </td>

//                           <td className="px-5 py-4">
//                             <span
//                               className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                                 isActive
//                                   ? "bg-green-50 text-green-700"
//                                   : "bg-gray-100 text-gray-600"
//                               }`}
//                             >
//                               {isActive ? "Active" : "Inactive"}
//                             </span>
//                           </td>

//                           <td className="px-5 py-4">
//                             <div className="flex items-center justify-end gap-2">
//                               <button
//                                 type="button"
//                                 onClick={() => openEditForm(period)}
//                                 disabled={isUpdating}
//                                 title="Edit period"
//                                 className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
//                               >
//                                 <Pencil size={16} />
//                               </button>

//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   void handleToggleStatus(period)
//                                 }
//                                 disabled={isUpdating}
//                                 title={
//                                   isActive
//                                     ? "Deactivate period"
//                                     : "Activate period"
//                                 }
//                                 className={`rounded-lg border p-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
//                                   isActive
//                                     ? "border-red-200 text-red-600 hover:bg-red-50"
//                                     : "border-green-200 text-green-600 hover:bg-green-50"
//                                 }`}
//                               >
//                                 {isUpdating ? (
//                                   <RefreshCw
//                                     size={16}
//                                     className="animate-spin"
//                                   />
//                                 ) : (
//                                   <Power size={16} />
//                                 )}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
//               Showing {filteredPeriods.length} of {periods.length} periods
//             </div>
//           </div>
//         </>
//       )}

//       {/* NO SESSION SELECTED */}
//       {!loadingSessions &&
//         !sessionError &&
//         sessions.length > 0 &&
//         !selectedSessionId && (
//           <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
//             <CalendarDays
//               size={30}
//               className="mx-auto mb-3 text-gray-400"
//             />

//             <h3 className="font-semibold text-gray-800">
//               Select an Academic Session
//             </h3>

//             <p className="mt-1 text-sm text-gray-500">
//               Choose a session above to view and manage its periods.
//             </p>
//           </div>
//         )}

//       {/* CREATE / EDIT FORM */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
//           <div className="my-auto w-full max-w-lg rounded-xl bg-white shadow-xl">
//             <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   {editingPeriod
//                     ? "Edit Academic Period"
//                     : "Create Academic Period"}
//                 </h2>

//                 <p className="mt-1 text-sm text-gray-500">
//                   {editingPeriod
//                     ? "Update the details of this period."
//                     : `Add a new ${getPeriodTypeLabel(selectedSession).toLowerCase()} to the selected session.`}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={closeForm}
//                 disabled={submitting}
//                 className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
//                 aria-label="Close form"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form
//               onSubmit={handleSubmit}
//               className="space-y-5 p-6"
//             >
//               <div>
//                 <label
//                   htmlFor="periodName"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   Period Name
//                 </label>

//                 <input
//                   id="periodName"
//                   name="periodName"
//                   type="text"
//                   value={form.periodName}
//                   onChange={handleFormChange}
//                   placeholder={
//                     selectedSession?.periodType === "SEMESTER"
//                       ? "e.g. First Semester"
//                       : "e.g. First Term"
//                   }
//                   required
//                   disabled={submitting}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="periodNumber"
//                   className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
//                 >
//                   <Hash size={15} />
//                   Period Number
//                 </label>

//                 <input
//                   id="periodNumber"
//                   name="periodNumber"
//                   type="number"
//                   min="1"
//                   step="1"
//                   value={form.periodNumber}
//                   onChange={handleFormChange}
//                   placeholder="e.g. 1"
//                   required
//                   disabled={submitting}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
//                 />

//                 <p className="mt-1 text-xs text-gray-500">
//                   Enter a unique number for this period within the session.
//                 </p>
//               </div>

//               <div>
//                 <label
//                   htmlFor="startDate"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   Start Date
//                 </label>

//                 <input
//                   id="startDate"
//                   name="startDate"
//                   type="date"
//                   value={form.startDate}
//                   onChange={handleFormChange}
//                   required
//                   disabled={submitting}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="endDate"
//                   className="mb-2 block text-sm font-medium text-gray-700"
//                 >
//                   End Date
//                 </label>

//                 <input
//                   id="endDate"
//                   name="endDate"
//                   type="date"
//                   min={form.startDate || undefined}
//                   value={form.endDate}
//                   onChange={handleFormChange}
//                   required
//                   disabled={submitting}
//                   className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50"
//                 />
//               </div>

//               <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   disabled={submitting}
//                   className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {submitting && (
//                     <RefreshCw
//                       size={16}
//                       className="animate-spin"
//                     />
//                   )}

//                   {submitting
//                     ? "Saving..."
//                     : editingPeriod
//                       ? "Update Period"
//                       : "Create Period"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
