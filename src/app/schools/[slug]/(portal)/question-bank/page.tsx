


// "use client";

// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import { useParams } from "next/navigation";

// import {
//   BookOpen,
//   FileQuestion,
//   CheckCircle2,
//   XCircle,
//   BarChart3,
//   RefreshCw,
//   ShieldAlert,
//   GraduationCap,
// } from "lucide-react";

// import { useAuthStore } from "@/stores/auth.store";

// import {
//   getSchoolSubjects,
// } from "@/lib/schools/portal/services/subject.service";

// import {
//   getSchoolClasses,
// } from "@/lib/schools/portal/services/class.service";

// import {
//   getAllMyTeachingAssignments,
// } from "@/lib/schools/portal/services/teaching.assignments";

// import {
//   getQuestionsByQuantity,
// } from "@/lib/schools/portal/services/question-bank.service";

// import {
//   getAcademicSessions,
// } from "@/lib/schools/portal/services/academicsessions";

// import {
//   extractAcademicSessions,
// } from "@/lib/schools/utils/enrollment.utils";

// /* =========================================================
//    TYPES
// ========================================================= */

// type SchoolRole =
//   | "OWNER"
//   | "ADMIN"
//   | "ADMINISTRATOR"
//   | "TEACHER"
//   | string;

// interface SubjectOption {
//   _id: string;
//   subjectName: string;
//   subjectCode?: string;
// }

// interface ClassOption {
//   _id: string;
//   className: string;
//   subjects: string[];
// }

// interface AcademicSessionOption {
//   _id: string;
//   label: string;
// }

// interface QuestionRecord {
//   _id?: string;
//   id?: string;
//   subjectId?: unknown;
//   isActive?: boolean;
//   questionText?: string;
//   [key: string]: unknown;
// }

// interface QuestionTask {
//   academicSessionId: string;
//   classId: string;
//   subjectId: string;
// }

// interface SubjectStatistic {
//   subjectId: string;
//   subjectName: string;
//   total: number;
//   active: number;
//   inactive: number;
// }

// interface QuestionStatistics {
//   total: number;
//   active: number;
//   inactive: number;
//   bySubject: SubjectStatistic[];
// }

// const QUESTION_QUANTITY = 100;
// const REQUEST_CONCURRENCY = 5;

// /* =========================================================
//    HELPERS
// ========================================================= */

// function getRecord(value: unknown): Record<string, unknown> {
//   if (value && typeof value === "object") {
//     return value as Record<string, unknown>;
//   }

//   return {};
// }

// function getText(value: unknown, fallback = ""): string {
//   return typeof value === "string" ? value : fallback;
// }

// function getId(value: unknown): string {
//   if (typeof value === "string") {
//     return value;
//   }

//   if (!value || typeof value !== "object") {
//     return "";
//   }

//   const record = getRecord(value);

//   return (
//     getText(record._id) ||
//     getText(record.id) ||
//     getText(record.subjectId) ||
//     getText(record.classId) ||
//     getText(record.academicSessionId)
//   );
// }

// function normalizeSubject(value: unknown): SubjectOption | null {
//   const record = getRecord(value);

//   const id =
//     getId(record._id) ||
//     getId(record.id) ||
//     getId(record.subjectId);

//   if (!id) return null;

//   return {
//     _id: id,
//     subjectName:
//       getText(record.subjectName) ||
//       getText(record.name) ||
//       "Unnamed subject",
//     subjectCode: getText(record.subjectCode),
//   };
// }

// function normalizeClass(value: unknown): ClassOption | null {
//   const record = getRecord(value);

//   const id =
//     getId(record._id) ||
//     getId(record.id) ||
//     getId(record.classId);

//   if (!id) return null;

//   const rawSubjects = Array.isArray(record.subjects)
//     ? record.subjects
//     : [];

//   const subjects = rawSubjects
//     .map((item) => getId(item))
//     .filter(Boolean);

//   return {
//     _id: id,
//     className:
//       getText(record.className) ||
//       getText(record.name) ||
//       getText(record.class) ||
//       "Unnamed class",
//     subjects: [...new Set(subjects)],
//   };
// }

// function normalizeAcademicSession(
//   value: unknown,
// ): AcademicSessionOption | null {
//   const record = getRecord(value);

//   const id =
//     getId(record._id) ||
//     getId(record.id) ||
//     getId(record.academicSessionId);

//   if (!id) return null;

//   const label =
//     getText(record.sessionName) ||
//     getText(record.academicSessionName) ||
//     getText(record.name) ||
//     getText(record.title) ||
//     getText(record.academicYear) ||
//     getText(record.year) ||
//     "Unnamed academic session";

//   return {
//     _id: id,
//     label,
//   };
// }

// /**
//  * Extract question arrays from the existing endpoint response.
//  *
//  * The supplied backend response uses:
//  * response.data.questions
//  */
// function extractQuestions(response: unknown): QuestionRecord[] {
//   if (Array.isArray(response)) {
//     return response as QuestionRecord[];
//   }

//   const root = getRecord(response);
//   const data = getRecord(root.data);

//   const candidates = [
//     root.questions,
//     root.questionsObj,
//     root.questionBankObj,
//     root.questionBank,
//     root.items,

//     data.questions,
//     data.questionsObj,
//     data.questionBankObj,
//     data.questionBank,
//     data.items,
//     data.data,
//   ];

//   for (const candidate of candidates) {
//     if (Array.isArray(candidate)) {
//       return candidate as QuestionRecord[];
//     }
//   }

//   return [];
// }

// /**
//  * Extract the teaching assignments returned by the
//  * existing teaching-assignment endpoint.
//  */
// function extractAssignments(response: unknown): unknown[] {
//   if (Array.isArray(response)) {
//     return response;
//   }

//   const root = getRecord(response);
//   const data = getRecord(root.data);

//   const candidates = [
//     root.teachingAssignments,
//     root.assignments,
//     root.classes,
//     root.classesObj,

//     data.teachingAssignments,
//     data.assignments,
//     data.classes,
//     data.classesObj,
//   ];

//   for (const candidate of candidates) {
//     if (Array.isArray(candidate)) {
//       return candidate;
//     }
//   }

//   return [];
// }

// function getAssignmentClass(
//   assignment: unknown,
// ): ClassOption | null {
//   const record = getRecord(assignment);

//   const nestedClass =
//     record.class ||
//     record.schoolClass ||
//     record.classObj ||
//     record.assignedClass;

//   return normalizeClass(nestedClass || assignment);
// }

// function getAssignmentSubjectIds(
//   assignment: unknown,
// ): string[] {
//   const record = getRecord(assignment);

//   const nestedClass = getRecord(
//     record.class ||
//       record.schoolClass ||
//       record.classObj ||
//       record.assignedClass,
//   );

//   const rawSubjects = [
//     ...(Array.isArray(record.subjects) ? record.subjects : []),
//     ...(Array.isArray(nestedClass.subjects)
//       ? nestedClass.subjects
//       : []),
//   ];

//   if (record.subject) {
//     rawSubjects.push(record.subject);
//   }

//   if (record.subjectId) {
//     rawSubjects.push(record.subjectId);
//   }

//   if (nestedClass.subject) {
//     rawSubjects.push(nestedClass.subject);
//   }

//   if (nestedClass.subjectId) {
//     rawSubjects.push(nestedClass.subjectId);
//   }

//   return [
//     ...new Set(
//       rawSubjects
//         .map((subject) => getId(subject))
//         .filter(Boolean),
//     ),
//   ];
// }

// function getQuestionId(question: QuestionRecord): string {
//   return (
//     getText(question._id) ||
//     getText(question.id)
//   );
// }

// function getQuestionSubjectId(
//   question: QuestionRecord,
//   fallbackSubjectId: string,
// ): string {
//   return (
//     getId(question.subjectId) ||
//     fallbackSubjectId
//   );
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// export default function QuestionBankPage() {
//   const params = useParams();

//   const slug = String(params.slug ?? "");

//   const user = useAuthStore((state) => state.user);
//   const isHydrated = useAuthStore((state) => state.isHydrated);

//   const schoolSubdomain = (
//     user?.schoolContext?.subDomain || slug
//   )
//     .trim()
//     .toLowerCase();

//   const role = (
//     user?.schoolContext?.userSchoolMembership?.role || ""
//   ).toUpperCase() as SchoolRole;

//   const isAdministrator =
//     role === "OWNER" ||
//     role === "ADMIN" ||
//     role === "ADMINISTRATOR";

//   const isTeacher = role === "TEACHER";
//   const hasAccess = isAdministrator || isTeacher;

//   /* =======================================================
//      STATE
//   ======================================================= */

//   const [statistics, setStatistics] =
//     useState<QuestionStatistics>({
//       total: 0,
//       active: 0,
//       inactive: 0,
//       bySubject: [],
//     });

//   const [academicSessions, setAcademicSessions] =
//     useState<AcademicSessionOption[]>([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [hasLoaded, setHasLoaded] = useState(false);

//   const [error, setError] = useState("");
//   const [warning, setWarning] = useState("");

//   const [totalRequests, setTotalRequests] = useState(0);
//   const [completedRequests, setCompletedRequests] = useState(0);

//   /* =======================================================
//      LOAD STATISTICS
//   ======================================================= */

//   const loadStatistics = useCallback(async () => {
//     if (
//       !isHydrated ||
//       !schoolSubdomain ||
//       !hasAccess
//     ) {
//       return;
//     }

//     setIsLoading(true);
//     setHasLoaded(false);
//     setError("");
//     setWarning("");

//     setStatistics({
//       total: 0,
//       active: 0,
//       inactive: 0,
//       bySubject: [],
//     });

//     setCompletedRequests(0);
//     setTotalRequests(0);

//     try {
//       /* -----------------------------------------------
//          1. LOAD ALL ACADEMIC SESSIONS
//       ----------------------------------------------- */

//       const sessionsResponse =
//         await getAcademicSessions(schoolSubdomain);

//       const extractedSessions =
//         extractAcademicSessions(sessionsResponse);

//       const sessions = (
//         Array.isArray(extractedSessions)
//           ? extractedSessions
//           : []
//       )
//         .map((item: unknown) =>
//           normalizeAcademicSession(item),
//         )
//         .filter(
//           (
//             item: AcademicSessionOption | null,
//           ): item is AcademicSessionOption =>
//             Boolean(item),
//         );

//       setAcademicSessions(sessions);

//       if (sessions.length === 0) {
//         setStatistics({
//           total: 0,
//           active: 0,
//           inactive: 0,
//           bySubject: [],
//         });

//         setHasLoaded(true);
//         return;
//       }

//       /* -----------------------------------------------
//          2. LOAD SCHOOL SUBJECTS AND CLASSES

//          Teachers also load the school's subject list
//          to resolve subject names. Their question scope
//          still comes exclusively from their assignments.
//       ----------------------------------------------- */

//       const [subjectResult, classResult] =
//         await Promise.all([
//           getSchoolSubjects(schoolSubdomain),
//           isAdministrator
//             ? getSchoolClasses(schoolSubdomain)
//             : Promise.resolve({ classes: [] }),
//         ]);

//       const allSubjects = (
//         subjectResult.subjects || []
//       )
//         .filter((subject) => subject.isActive !== false)
//         .map((subject) => normalizeSubject(subject))
//         .filter(
//           (subject): subject is SubjectOption =>
//             Boolean(subject),
//         );

//       const subjectMap = new Map<string, SubjectOption>();

//       for (const subject of allSubjects) {
//         subjectMap.set(subject._id, subject);
//       }

//       /* -----------------------------------------------
//          3. BUILD QUESTION REQUEST COMBINATIONS
//       ----------------------------------------------- */

//       const tasks: QuestionTask[] = [];

//       const taskKeys = new Set<string>();

//       const addTask = (
//         academicSessionId: string,
//         classId: string,
//         subjectId: string,
//       ) => {
//         if (!academicSessionId || !classId || !subjectId) {
//           return;
//         }

//         const key = [
//           academicSessionId,
//           classId,
//           subjectId,
//         ].join(":");

//         if (taskKeys.has(key)) return;

//         taskKeys.add(key);

//         tasks.push({
//           academicSessionId,
//           classId,
//           subjectId,
//         });
//       };

//       /* -----------------------------------------------
//          ADMINISTRATOR SCOPE

//          All active school classes and subjects
//          across all academic sessions.
//       ----------------------------------------------- */

//       if (isAdministrator) {
//         const allClasses = (
//           classResult.classes || []
//         )
//           .filter((schoolClass) => schoolClass.isActive !== false)
//           .map((schoolClass) => normalizeClass(schoolClass))
//           .filter(
//             (schoolClass): schoolClass is ClassOption =>
//               Boolean(schoolClass),
//           );

//         for (const session of sessions) {
//           for (const schoolClass of allClasses) {
//             const classSubjectIds =
//               schoolClass.subjects.length > 0
//                 ? schoolClass.subjects
//                 : allSubjects.map((subject) => subject._id);

//             for (const subjectId of classSubjectIds) {
//               addTask(
//                 session._id,
//                 schoolClass._id,
//                 subjectId,
//               );
//             }
//           }
//         }
//       }

//       /* -----------------------------------------------
//          TEACHER SCOPE

//          Only assigned classes and subjects, across
//          every academic session.
//       ----------------------------------------------- */

//       if (isTeacher) {
//         for (const session of sessions) {
//           const assignmentResponse =
//             await getAllMyTeachingAssignments(
//               session._id,
//               schoolSubdomain,
//             );

//           const assignments =
//             extractAssignments(assignmentResponse);

//           for (const assignment of assignments) {
//             const assignedClass =
//               getAssignmentClass(assignment);

//             if (!assignedClass) continue;

//             const subjectIds =
//               getAssignmentSubjectIds(assignment);

//             for (const subjectId of subjectIds) {
//               addTask(
//                 session._id,
//                 assignedClass._id,
//                 subjectId,
//               );

//               if (!subjectMap.has(subjectId)) {
//                 const rawAssignment = getRecord(assignment);

//                 const rawSubjects = [
//                   ...(Array.isArray(rawAssignment.subjects)
//                     ? rawAssignment.subjects
//                     : []),
//                   rawAssignment.subject,
//                 ].filter(Boolean);

//                 const matchingSubject = rawSubjects.find(
//                   (item) => getId(item) === subjectId,
//                 );

//                 const normalizedSubject =
//                   normalizeSubject(matchingSubject);

//                 if (normalizedSubject) {
//                   subjectMap.set(
//                     normalizedSubject._id,
//                     normalizedSubject,
//                   );
//                 }
//               }
//             }
//           }
//         }
//       }

//       setTotalRequests(tasks.length);

//       if (tasks.length === 0) {
//         setStatistics({
//           total: 0,
//           active: 0,
//           inactive: 0,
//           bySubject: [],
//         });

//         setHasLoaded(true);
//         return;
//       }

//       /* -----------------------------------------------
//          4. FETCH QUESTIONS

//          Existing endpoint:
//          getQuestionsByQuantity(
//            academicSessionId,
//            subjectId,
//            classId,
//            quantity,
//            schoolSubdomain
//          )

//          We request up to 10,000 per combination.
//       ----------------------------------------------- */

//       const uniqueQuestions = new Map<
//         string,
//         {
//           question: QuestionRecord;
//           subjectId: string;
//         }
//       >();

//       let failedRequests = 0;
//       let possiblyLimitedRequests = 0;

//       let nextTaskIndex = 0;

//       const worker = async () => {
//         while (true) {
//           const currentIndex = nextTaskIndex++;

//           if (currentIndex >= tasks.length) {
//             return;
//           }

//           const task = tasks[currentIndex];

//           try {
//             const response = await getQuestionsByQuantity(
//               task.academicSessionId,
//               task.subjectId,
//               task.classId,
//               QUESTION_QUANTITY,
//               schoolSubdomain,
//             );

//             const questions = extractQuestions(response);

//             const root = getRecord(response);
//             const data = getRecord(root.data);

//             const fetchedCount =
//               typeof data.totalNoOfQuestionsFetched === "number"
//                 ? data.totalNoOfQuestionsFetched
//                 : questions.length;

//             if (fetchedCount >= QUESTION_QUANTITY) {
//               possiblyLimitedRequests += 1;
//             }

//             for (const question of questions) {
//               const questionId = getQuestionId(question);

//               const subjectId = getQuestionSubjectId(
//                 question,
//                 task.subjectId,
//               );

//               const uniqueKey =
//                 questionId ||
//                 `${subjectId}:${getText(question.questionText)}`;

//               if (!uniqueQuestions.has(uniqueKey)) {
//                 uniqueQuestions.set(uniqueKey, {
//                   question,
//                   subjectId,
//                 });
//               }
//             }
//           } catch (requestError) {
//             failedRequests += 1;

//             console.error(
//               "Question statistics request failed:",
//               {
//                 task,
//                 error: requestError,
//               },
//             );
//           } finally {
//             setCompletedRequests((current) => current + 1);
//           }
//         }
//       };

//       const workerCount = Math.min(
//         REQUEST_CONCURRENCY,
//         tasks.length,
//       );

//       await Promise.all(
//         Array.from(
//           { length: workerCount },
//           () => worker(),
//         ),
//       );

//       /* -----------------------------------------------
//          5. CALCULATE STATISTICS
//       ----------------------------------------------- */

//       const subjectStatistics = new Map<
//         string,
//         SubjectStatistic
//       >();

//       let total = 0;
//       let active = 0;
//       let inactive = 0;

//       for (const {
//         question,
//         subjectId,
//       } of uniqueQuestions.values()) {
//         total += 1;

//         const isQuestionActive =
//           question.isActive === true;

//         const isQuestionInactive =
//           question.isActive === false;

//         if (isQuestionActive) {
//           active += 1;
//         }

//         if (isQuestionInactive) {
//           inactive += 1;
//         }

//         const subject =
//           subjectMap.get(subjectId);

//         const subjectName =
//           subject?.subjectName || "Unknown subject";

//         const existing =
//           subjectStatistics.get(subjectId) || {
//             subjectId,
//             subjectName,
//             total: 0,
//             active: 0,
//             inactive: 0,
//           };

//         existing.total += 1;

//         if (isQuestionActive) {
//           existing.active += 1;
//         }

//         if (isQuestionInactive) {
//           existing.inactive += 1;
//         }

//         subjectStatistics.set(
//           subjectId,
//           existing,
//         );
//       }

//       const bySubject = Array.from(
//         subjectStatistics.values(),
//       ).sort((a, b) => b.total - a.total);

//       setStatistics({
//         total,
//         active,
//         inactive,
//         bySubject,
//       });

//       /* -----------------------------------------------
//          6. WARN ABOUT PARTIAL RESULTS
//       ----------------------------------------------- */

//       const warnings: string[] = [];

//       if (failedRequests > 0) {
//         warnings.push(
//           `${failedRequests} of ${tasks.length} class/subject/session requests failed. The displayed statistics may be incomplete.`,
//         );
//       }

//       if (possiblyLimitedRequests > 0) {
//         warnings.push(
//           `${possiblyLimitedRequests} requests returned the full requested quantity of ${QUESTION_QUANTITY.toLocaleString()}. Some combinations may contain more questions than were retrieved.`,
//         );
//       }

//       if (warnings.length > 0) {
//         setWarning(warnings.join(" "));
//       }
//     } catch (loadError) {
//       console.error(
//         "Question Bank statistics loading error:",
//         loadError,
//       );

//       const record = getRecord(loadError);
//       const response = getRecord(record.response);
//       const responseData = getRecord(response.data);

//       setError(
//         getText(responseData.message) ||
//           getText(record.message) ||
//           "Unable to load Question Bank statistics. Please refresh and try again.",
//       );
//     } finally {
//       setIsLoading(false);
//       setHasLoaded(true);
//     }
//   }, [
//     isHydrated,
//     schoolSubdomain,
//     hasAccess,
//     isAdministrator,
//     isTeacher,
//   ]);

//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {
//     if (!isHydrated || !hasAccess) return;

//     void loadStatistics();
//   }, [
//     isHydrated,
//     hasAccess,
//     loadStatistics,
//   ]);

//   /* =======================================================
//      SUBJECT BAR WIDTHS
//   ======================================================= */

//   const maxSubjectCount = useMemo(() => {
//     return Math.max(
//       1,
//       ...statistics.bySubject.map(
//         (subject) => subject.total,
//       ),
//     );
//   }, [statistics.bySubject]);

//   /* =======================================================
//      ACCESS CHECK
//   ======================================================= */

//   if (!isHydrated) {
//     return (
//       <div className="flex min-h-[300px] items-center justify-center">
//         <RefreshCw className="h-7 w-7 animate-spin text-indigo-600" />
//       </div>
//     );
//   }

//   if (!hasAccess) {
//     return (
//       <div className="mx-auto max-w-xl p-6">
//         <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
//           <ShieldAlert className="mx-auto h-10 w-10 text-red-500" />

//           <h1 className="mt-3 text-xl font-bold text-gray-900">
//             Access Restricted
//           </h1>

//           <p className="mt-2 text-sm text-gray-600">
//             Your school membership role does not have permission
//             to access Question Bank statistics.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div className="space-y-6 p-4 md:p-6">

//       {/* HEADER */}

//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <div className="flex items-center gap-2">
//             <BookOpen className="h-6 w-6 text-indigo-600" />

//             <h1 className="text-2xl font-bold tracking-tight text-gray-900">
//               Question Bank Statistics
//             </h1>
//           </div>

//           <p className="mt-1 text-sm text-gray-500">
//             Overview of questions available across your school.
//           </p>

//           <p className="mt-2 text-xs font-medium text-indigo-600">
//             {isTeacher
//               ? "Statistics for your assigned classes and subjects"
//               : "School-wide statistics"}
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => void loadStatistics()}
//           disabled={isLoading}
//           className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           <RefreshCw
//             className={`h-4 w-4 ${
//               isLoading ? "animate-spin" : ""
//             }`}
//           />

//           {isLoading ? "Refreshing..." : "Refresh Statistics"}
//         </button>
//       </div>

//       {/* ERRORS */}

//       {error && (
//         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       {warning && (
//         <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
//           {warning}
//         </div>
//       )}

//       {/* LOADING */}

//       {isLoading && (
//         <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
//           <div className="flex items-center gap-3">
//             <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />

//             <div className="flex-1">
//               <p className="text-sm font-semibold text-indigo-900">
//                 Calculating Question Bank statistics
//               </p>

//               <p className="mt-1 text-xs text-indigo-700">
//                 Retrieving questions across academic sessions,
//                 classes and subjects...
//               </p>

//               <div className="mt-3 h-2 overflow-hidden rounded-full bg-indigo-100">
//                 <div
//                   className="h-full rounded-full bg-indigo-600 transition-all"
//                   style={{
//                     width: `${
//                       totalRequests > 0
//                         ? Math.min(
//                             100,
//                             (completedRequests / totalRequests) * 100,
//                           )
//                         : 0
//                     }%`,
//                   }}
//                 />
//               </div>

//               <p className="mt-1 text-xs text-indigo-700">
//                 {completedRequests.toLocaleString()} of{" "}
//                 {totalRequests.toLocaleString()} requests completed
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* STATISTICS CARDS */}

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

//         <StatCard
//           label="Total Questions"
//           value={statistics.total}
//           description="Unique questions retrieved"
//           icon={<FileQuestion className="h-5 w-5" />}
//           color="indigo"
//         />

//         <StatCard
//           label="Active Questions"
//           value={statistics.active}
//           description="Questions marked as active"
//           icon={<CheckCircle2 className="h-5 w-5" />}
//           color="green"
//         />

//         <StatCard
//           label="Inactive Questions"
//           value={statistics.inactive}
//           description="Questions marked as inactive"
//           icon={<XCircle className="h-5 w-5" />}
//           color="red"
//         />

//       </div>

//       {/* NUMBER OF QUESTIONS BY SUBJECT */}

//       <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

//         <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <div className="flex items-center gap-2">
//               <BarChart3 className="h-5 w-5 text-indigo-600" />

//               <h2 className="text-lg font-semibold text-gray-900">
//                 Number of Questions by Subject
//               </h2>
//             </div>

//             <p className="mt-1 text-sm text-gray-500">
//               Distribution of unique questions across subjects.
//             </p>
//           </div>

//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <GraduationCap className="h-4 w-4" />

//             {statistics.bySubject.length} subject
//             {statistics.bySubject.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         <div className="mt-6">

//           {isLoading && statistics.bySubject.length === 0 ? (
//             <div className="py-12 text-center">
//               <RefreshCw className="mx-auto h-7 w-7 animate-spin text-indigo-600" />

//               <p className="mt-3 text-sm text-gray-500">
//                 Loading subject statistics...
//               </p>
//             </div>
//           ) : statistics.bySubject.length === 0 ? (
//             <div className="py-12 text-center">
//               <BookOpen className="mx-auto h-10 w-10 text-gray-300" />

//               <h3 className="mt-3 font-semibold text-gray-800">
//                 No subject statistics available
//               </h3>

//               <p className="mt-1 text-sm text-gray-500">
//                 No questions were returned for the available
//                 classes and subjects.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-5">
//               {statistics.bySubject.map((subject) => {
//                 const percentage =
//                   statistics.total > 0
//                     ? (subject.total / statistics.total) * 100
//                     : 0;

//                 const barWidth =
//                   (subject.total / maxSubjectCount) * 100;

//                 return (
//                   <div key={subject.subjectId}>
//                     <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
//                       <div>
//                         <p className="text-sm font-semibold text-gray-800">
//                           {subject.subjectName}
//                         </p>

//                         <p className="mt-0.5 text-xs text-gray-500">
//                           {subject.active.toLocaleString()} active
//                           {" · "}
//                           {subject.inactive.toLocaleString()} inactive
//                         </p>
//                       </div>

//                       <div className="text-right">
//                         <p className="text-sm font-bold tabular-nums text-gray-900">
//                           {subject.total.toLocaleString()}
//                         </p>

//                         <p className="text-xs text-gray-500">
//                           {percentage.toFixed(1)}%
//                         </p>
//                       </div>
//                     </div>

//                     <div className="h-3 overflow-hidden rounded-full bg-gray-100">
//                       <div
//                         className="h-full rounded-full bg-indigo-600 transition-all duration-500"
//                         style={{
//                           width: `${barWidth}%`,
//                         }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//         </div>
//       </section>

//       {/* SUMMARY */}

//       {!isLoading && hasLoaded && !error && (
//         <div className="rounded-xl border border-gray-200 bg-white p-4">
//           <div className="flex items-start gap-3">
//             <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />

//             <div>
//               <p className="text-sm font-semibold text-gray-800">
//                 Statistics calculation completed
//               </p>

//               <p className="mt-1 text-xs leading-5 text-gray-500">
//                 {isTeacher
//                   ? "These figures are calculated from questions retrieved for your assigned classes and subjects across the available academic sessions."
//                   : "These figures are calculated from questions retrieved across the school's active classes, subjects and available academic sessions."}
//               </p>

//               <p className="mt-2 text-xs text-gray-400">
//                 {academicSessions.length.toLocaleString()} academic
//                 session
//                 {academicSessions.length === 1 ? "" : "s"} checked
//                 {" · "}
//                 {totalRequests.toLocaleString()} request
//                 {totalRequests === 1 ? "" : "s"} processed
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// /* =========================================================
//    STAT CARD
// ========================================================= */

// function StatCard({
//   label,
//   value,
//   description,
//   icon,
//   color,
// }: {
//   label: string;
//   value: number;
//   description: string;
//   icon: React.ReactNode;
//   color: "indigo" | "green" | "red";
// }) {
//   const styles = {
//     indigo: {
//       icon: "bg-indigo-50 text-indigo-600",
//       value: "text-indigo-700",
//     },
//     green: {
//       icon: "bg-green-50 text-green-600",
//       value: "text-green-700",
//     },
//     red: {
//       icon: "bg-red-50 text-red-600",
//       value: "text-red-700",
//     },
//   };

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
//       <div className="flex items-center justify-between gap-3">
//         <p className="text-sm font-medium text-gray-500">
//           {label}
//         </p>

//         <span
//           className={`rounded-lg p-2 ${styles[color].icon}`}
//         >
//           {icon}
//         </span>
//       </div>

//       <p
//         className={`mt-4 text-3xl font-bold tabular-nums ${styles[color].value}`}
//       >
//         {value.toLocaleString()}
//       </p>

//       <p className="mt-1 text-xs text-gray-500">
//         {description}
//       </p>
//     </div>
//   );
// }








"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import {
  BookOpen,
  Plus,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Filter,
  X,
  FileQuestion,
  CheckCircle2,
  Archive,
  Clock,
  ShieldAlert,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";
import { useQuestionBank } from "@/hooks/schools/useQuestionBank";

import {
  getSchoolSubjects,
} from "@/lib/schools/portal/services/subject.service";

import {
  getSchoolClasses,
} from "@/lib/schools/portal/services/class.service";

import {
  getAllMyTeachingAssignments,
} from "@/lib/schools/portal/services/teaching.assignments";

import {
  getQuestionsByQuantity,
} from "@/lib/schools/portal/services/question-bank.service";

import type { Question } from "@/lib/schools/portal/services/question-bank.service";

import {
  getAcademicSessions,
} from "@/lib/schools/portal/services/academicsessions";

import {
  extractAcademicSessions,
} from "@/lib/schools/utils/enrollment.utils";

/* =========================================================
   TYPES
========================================================= */

type QuestionRecord = Question & Record<string, unknown>;

interface SubjectOption {
  _id: string;
  subjectName: string;
  subjectCode?: string;
}

interface ClassOption {
  _id: string;
  className: string;
  classCode?: string;
  subjects: string[];
}

type SchoolRole = "OWNER" | "ADMIN" | "ADMINISTRATOR" | "TEACHER" | string;

const PAGE_SIZE = 10;
const QUESTION_QUANTITY = 100;

interface AcademicSessionOption {
  _id: string;
  label: string;
}

/* =========================================================
   HELPERS
========================================================= */

function getRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }

  return {};
}

function getId(value: unknown): string {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    const record = getRecord(value);

    if (typeof record._id === "string") return record._id;
    if (typeof record.id === "string") return record.id;
    if (typeof record.subjectId === "string") return record.subjectId;
    if (typeof record.classId === "string") return record.classId;
  }

  return "";
}

function getText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeAcademicSession(
  value: unknown,
): AcademicSessionOption | null {
  const record = getRecord(value);

  const id =
    getId(record._id) ||
    getId(record.id) ||
    getId(record.academicSessionId);

  if (!id) return null;

  const label =
    getText(record.sessionName) ||
    getText(record.academicSessionName) ||
    getText(record.name) ||
    getText(record.title) ||
    getText(record.academicYear) ||
    getText(record.year) ||
    "Unnamed academic session";

  const status = getText(record.status).toUpperCase();
  const startDate = getText(record.startDate);
  const endDate = getText(record.endDate);

  const dateLabel =
    startDate || endDate
      ? ` (${startDate || "—"} to ${endDate || "—"})`
      : "";

  return {
    _id: id,
    label: `${label}${status ? ` — ${status}` : ""}${dateLabel}`,
  };
}

function normalizeSubject(value: unknown): SubjectOption | null {
  const record = getRecord(value);

  const id =
    getId(record._id) ||
    getId(record.id) ||
    getId(record.subjectId);

  if (!id) return null;

  return {
    _id: id,
    subjectName:
      getText(record.subjectName) ||
      getText(record.name) ||
      "Unnamed subject",
    subjectCode: getText(record.subjectCode),
  };
}

function normalizeClass(value: unknown): ClassOption | null {
  const record = getRecord(value);

  const id =
    getId(record._id) ||
    getId(record.id) ||
    getId(record.classId);

  if (!id) return null;

  const rawSubjects = Array.isArray(record.subjects)
    ? record.subjects
    : [];

  const subjects = rawSubjects
    .map((subject) => {
      if (typeof subject === "object" && subject !== null) {
        const subjectRecord = getRecord(subject);

        return (
          getId(subjectRecord._id) ||
          getId(subjectRecord.id) ||
          getId(subjectRecord.subjectId)
        );
      }

      return getId(subject);
    })
    .filter(Boolean);

  return {
    _id: id,
    className:
      getText(record.className) ||
      getText(record.name) ||
      getText(record.class) ||
      "Unnamed class",
    classCode: getText(record.classCode),
    subjects: [...new Set(subjects)],
  };
}

/**
 * Extracts the assigned classes returned by the teaching
 * assignment endpoint.
 */
function extractAssignmentClasses(response: unknown): unknown[] {
  if (Array.isArray(response)) return response;

  const root = getRecord(response);
  const data = getRecord(root.data);

  const candidates = [
    root.classes,
    root.classesObj,
    root.teachingAssignments,
    root.assignments,
    data.classes,
    data.classesObj,
    data.teachingAssignments,
    data.assignments,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

/**
 * Extracts questions from common API response envelopes.
 *
 * Supports:
 * - An array returned directly
 * - data.questions
 * - data.questionsObj
 * - data.questionBankObj
 * - data.questionBank
 * - data.items
 */
function extractQuestions(response: unknown): QuestionRecord[] {
  if (Array.isArray(response)) {
    return response as QuestionRecord[];
  }

  const root = getRecord(response);
  const data = getRecord(root.data);

  const candidates = [
    root.questions,
    root.questionsObj,
    root.questionBankObj,
    root.questionBank,
    root.items,

    data.questions,
    data.questionsObj,
    data.questionBankObj,
    data.questionBank,
    data.items,

    data.data,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as QuestionRecord[];
    }
  }

  return [];
}

function getQuestionId(question: QuestionRecord): string {
  return getText(question._id) || getText(question.id);
}

function getStatus(question: QuestionRecord): string {
  return getText(question.status, "DRAFT").toUpperCase();
}

function getDifficulty(question: QuestionRecord): string {
  return getText(question.difficulty, "NOT SET").toUpperCase();
}

function getQuestionType(question: QuestionRecord): string {
  return getText(question.questionType, "NOT SET")
    .replaceAll("_", " ")
    .toUpperCase();
}

function getQuestionText(question: QuestionRecord): string {
  return getText(question.questionText) || "Untitled question";
}

/* =========================================================
   PAGE
========================================================= */

export default function QuestionBankPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slug = String(params.slug ?? "");

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const schoolSubdomain = (
    user?.schoolContext?.subDomain || slug
  ).trim().toLowerCase();

  const role = (
    user?.schoolContext?.userSchoolMembership?.role || ""
  ).toUpperCase() as SchoolRole;

  const isAdministrator =
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "ADMINISTRATOR";

  const isTeacher = role === "TEACHER";
  const hasAccess = isAdministrator || isTeacher;

  const {
    questions,
    isLoading: isAdminLoading,
    error: adminError,
    successMessage,
    academicSessionId,
    setAcademicSessionId,
    fetchQuestions,
    handleUpdateQuestionStatus,
  } = useQuestionBank(slug);

  /* =======================================================
     TEACHER QUESTION STATE
  ======================================================= */

  const [teacherQuestions, setTeacherQuestions] = useState<QuestionRecord[]>([]);
  const [isTeacherLoading, setIsTeacherLoading] = useState(false);
  const [teacherError, setTeacherError] = useState("");

  const teacherRequestId = useRef(0);

  /* =======================================================
     SHARED QUESTION STATE
  ======================================================= */

  const isLoading = isAdministrator
    ? isAdminLoading
    : isTeacherLoading;

  const questionRecords = useMemo(() => {
    return isAdministrator
      ? (questions as QuestionRecord[])
      : teacherQuestions;
  }, [isAdministrator, questions, teacherQuestions]);

  const error = isAdministrator ? adminError : teacherError;

  /* =======================================================
     OPTIONS
  ======================================================= */

  const [academicSessions, setAcademicSessions] = useState<
    AcademicSessionOption[]
  >([]);

  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState("");

  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);

  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState("");

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  /* =======================================================
     FILTERS
  ======================================================= */

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [questionType, setQuestionType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [examType, setExamType] = useState("ALL");
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     CLEAR QUESTION RESULTS
  ======================================================= */

  const clearQuestionResults = useCallback(() => {
    teacherRequestId.current += 1;
    setTeacherQuestions([]);
    setTeacherError("");
  }, []);

  /* =======================================================
     LOAD ACADEMIC SESSIONS
  ======================================================= */

  useEffect(() => {
    if (!isHydrated || !schoolSubdomain || !hasAccess) return;

    let cancelled = false;

    const loadAcademicSessions = async () => {
      setIsLoadingSessions(true);
      setSessionsError("");

      try {
        const response = await getAcademicSessions(schoolSubdomain);
        const extracted = extractAcademicSessions(response);

        const normalized = (
          Array.isArray(extracted) ? extracted : []
        )
          .map((session: unknown) => normalizeAcademicSession(session))
          .filter(
            (
              session: AcademicSessionOption | null,
            ): session is AcademicSessionOption => Boolean(session),
          );

        if (cancelled) return;

        setAcademicSessions(normalized);

        const sessionFromUrl = searchParams.get("academicSessionId");
        const currentSessionId = sessionFromUrl || academicSessionId;

        if (
          currentSessionId &&
          normalized.some((session) => session._id === currentSessionId)
        ) {
          setAcademicSessionId(currentSessionId);
        } else if (
          academicSessionId &&
          !normalized.some((session) => session._id === academicSessionId)
        ) {
          setAcademicSessionId("");
          setSelectedClassId("");
          setSelectedSubjectId("");
          clearQuestionResults();
        }
      } catch (err) {
        console.error("Academic sessions loading error:", err);

        if (!cancelled) {
          setAcademicSessions([]);
          setSessionsError(
            "Unable to load academic sessions. Please refresh and try again.",
          );
        }
      } finally {
        if (!cancelled) setIsLoadingSessions(false);
      }
    };

    void loadAcademicSessions();

    return () => {
      cancelled = true;
    };
  }, [
    isHydrated,
    schoolSubdomain,
    hasAccess,
    searchParams,
    academicSessionId,
    setAcademicSessionId,
    clearQuestionResults,
  ]);

  /* =======================================================
     LOAD ADMINISTRATOR OPTIONS
  ======================================================= */

  const loadAdministratorOptions = useCallback(async () => {
    const [subjectResult, classResult] = await Promise.all([
      getSchoolSubjects(schoolSubdomain),
      getSchoolClasses(schoolSubdomain),
    ]);

    const activeSubjects = (subjectResult.subjects || [])
      .filter((subject) => subject.isActive)
      .map((subject) => normalizeSubject(subject))
      .filter(
        (subject): subject is SubjectOption => Boolean(subject),
      );

    const activeClasses = (classResult.classes || [])
      .filter((schoolClass) => schoolClass.isActive)
      .map((schoolClass) => normalizeClass(schoolClass))
      .filter(
        (schoolClass): schoolClass is ClassOption => Boolean(schoolClass),
      );

    setSubjects(activeSubjects);
    setClasses(activeClasses);
  }, [schoolSubdomain]);

  /* =======================================================
     LOAD TEACHER ASSIGNED CLASSES AND SUBJECTS
  ======================================================= */

  const loadTeacherOptions = useCallback(async () => {
    if (!academicSessionId) {
      setClasses([]);
      setSubjects([]);
      setSelectedClassId("");
      setSelectedSubjectId("");
      clearQuestionResults();
      return;
    }

    const response = await getAllMyTeachingAssignments(
      academicSessionId,
      schoolSubdomain,
    );

    const assignmentClasses = extractAssignmentClasses(response);

    const normalizedClasses = assignmentClasses
      .map((assignment) => {
        const record = getRecord(assignment);

        // Some assignment responses contain the class under
        // a nested "class" or "schoolClass" property.
        const nestedClass =
          record.class ||
          record.schoolClass ||
          record.classObj;

        return normalizeClass(nestedClass || assignment);
      })
      .filter(
        (item): item is ClassOption => Boolean(item),
      );

    const uniqueClasses = Array.from(
      new Map(
        normalizedClasses.map((item) => [item._id, item]),
      ).values(),
    );

    const assignedSubjects: SubjectOption[] = [];

    for (const assignment of assignmentClasses) {
      const record = getRecord(assignment);

      const rawSubjects = Array.isArray(record.subjects)
        ? record.subjects
        : Array.isArray(getRecord(record.class).subjects)
          ? (getRecord(record.class).subjects as unknown[])
          : [];

      for (const rawSubject of rawSubjects) {
        const subject = normalizeSubject(rawSubject);

        if (subject) assignedSubjects.push(subject);
      }
    }

    const uniqueSubjects = Array.from(
      new Map(
        assignedSubjects.map((item) => [item._id, item]),
      ).values(),
    );

    setClasses(uniqueClasses);
    setSubjects(uniqueSubjects);

    setSelectedClassId((current) =>
      uniqueClasses.some((item) => item._id === current)
        ? current
        : "",
    );

    setSelectedSubjectId((current) =>
      uniqueSubjects.some((item) => item._id === current)
        ? current
        : "",
    );
  }, [
    academicSessionId,
    schoolSubdomain,
    clearQuestionResults,
  ]);

  /* =======================================================
     LOAD OPTIONS BY ROLE
  ======================================================= */

  const loadOptions = useCallback(async () => {
    if (!isHydrated || !schoolSubdomain || !hasAccess) return;

    setIsLoadingOptions(true);
    setOptionsError("");

    try {
      if (isAdministrator) {
        await loadAdministratorOptions();
      } else if (isTeacher) {
        await loadTeacherOptions();
      }
    } catch (err) {
      console.error("Question Bank options error:", err);

      setOptionsError(
        isTeacher
          ? "Unable to load your teaching assignments. Confirm that you have assigned classes and subjects for this academic session."
          : "Unable to load school classes and subjects. Please refresh and try again.",
      );

      setClasses([]);
      setSubjects([]);
    } finally {
      setIsLoadingOptions(false);
    }
  }, [
    isHydrated,
    schoolSubdomain,
    hasAccess,
    isAdministrator,
    isTeacher,
    loadAdministratorOptions,
    loadTeacherOptions,
  ]);

  useEffect(() => {
    if (!isHydrated || !hasAccess) return;

    if (isTeacher && !academicSessionId) {
      setClasses([]);
      setSubjects([]);
      setSelectedClassId("");
      setSelectedSubjectId("");
      clearQuestionResults();
      return;
    }

    void loadOptions();
  }, [
    isHydrated,
    hasAccess,
    isTeacher,
    academicSessionId,
    loadOptions,
    clearQuestionResults,
  ]);

  /* =======================================================
     CLASS AND SUBJECT SELECTION
  ======================================================= */

  const selectedClass = useMemo(
    () => classes.find((item) => item._id === selectedClassId),
    [classes, selectedClassId],
  );

  const availableSubjects = useMemo(() => {
    if (!selectedClass) return [];

    if (selectedClass.subjects.length === 0) {
      return isTeacher ? [] : subjects;
    }

    return subjects.filter((subject) =>
      selectedClass.subjects.includes(subject._id),
    );
  }, [subjects, selectedClass, isTeacher]);

  useEffect(() => {
    if (
      selectedSubjectId &&
      !availableSubjects.some(
        (subject) => subject._id === selectedSubjectId,
      )
    ) {
      setSelectedSubjectId("");
      clearQuestionResults();
    }
  }, [
    availableSubjects,
    selectedSubjectId,
    clearQuestionResults,
  ]);

  /* =======================================================
     LOAD QUESTIONS
  ======================================================= */

  const loadQuestions = useCallback(async () => {
    if (
      !academicSessionId ||
      !selectedClassId ||
      !selectedSubjectId
    ) {
      clearQuestionResults();
      return;
    }

    // ADMINISTRATOR / OWNER:
    // Continue using the existing useQuestionBank flow.
    if (isAdministrator) {
      await fetchQuestions(
        academicSessionId,
        selectedSubjectId,
        selectedClassId,
        QUESTION_QUANTITY,
      );

      return;
    }

    // TEACHER:
    // Use the quantity endpoint for the selected assigned
    // academic session, class and subject.
    if (isTeacher) {
      const requestId = ++teacherRequestId.current;

      setIsTeacherLoading(true);
      setTeacherError("");
      setTeacherQuestions([]);

      try {
        const response = await getQuestionsByQuantity(
          academicSessionId,
          selectedSubjectId,
          selectedClassId,
          QUESTION_QUANTITY,
          schoolSubdomain,
        );

        // Ignore an older response if the teacher has changed
        // the selected class, subject or session.
        if (requestId !== teacherRequestId.current) return;

        const extractedQuestions = extractQuestions(response);

        setTeacherQuestions(extractedQuestions);

        if (extractedQuestions.length === 0) {
          setTeacherQuestions([]);
        }
      } catch (err) {
        console.error("Teacher question loading error:", err);

        if (requestId !== teacherRequestId.current) return;

        const errorRecord = getRecord(err);
        const responseRecord = getRecord(errorRecord.response);
        const responseData = getRecord(responseRecord.data);

        const backendMessage =
          getText(responseData.message) ||
          getText(errorRecord.message);

        setTeacherQuestions([]);
        setTeacherError(
          backendMessage ||
            "Unable to load questions for this class and subject. Please try again.",
        );
      } finally {
        if (requestId === teacherRequestId.current) {
          setIsTeacherLoading(false);
        }
      }
    }
  }, [
    academicSessionId,
    selectedClassId,
    selectedSubjectId,
    isAdministrator,
    isTeacher,
    fetchQuestions,
    schoolSubdomain,
    clearQuestionResults,
  ]);

  useEffect(() => {
    if (
      academicSessionId &&
      selectedClassId &&
      selectedSubjectId
    ) {
      void loadQuestions();
    } else {
      clearQuestionResults();
    }
  }, [
    academicSessionId,
    selectedClassId,
    selectedSubjectId,
    loadQuestions,
    clearQuestionResults,
  ]);

  /* =======================================================
     QUESTION FILTER OPTIONS
  ======================================================= */

  const topics = useMemo(() => {
    const values = questionRecords
      .map((question) => getText(question.topic))
      .filter(Boolean);

    return [...new Set(values)].sort();
  }, [questionRecords]);

  const categories = useMemo(() => {
    const values = questionRecords
      .map((question) => getText(question.category))
      .filter(Boolean);

    return [...new Set(values)].sort();
  }, [questionRecords]);

  /* =======================================================
     FILTER QUESTIONS
  ======================================================= */

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return questionRecords.filter((question) => {
      const questionText = getQuestionText(question).toLowerCase();
      const questionTopic = getText(question.topic);
      const questionCategory = getText(question.category);

      const matchesSearch =
        !normalizedSearch ||
        questionText.includes(normalizedSearch) ||
        questionTopic.toLowerCase().includes(normalizedSearch) ||
        questionCategory.toLowerCase().includes(normalizedSearch);

      const matchesDifficulty =
        difficulty === "ALL" ||
        getDifficulty(question) === difficulty;

      const matchesType =
        questionType === "ALL" ||
        getText(question.questionType).toUpperCase() === questionType;

      const matchesStatus =
        status === "ALL" ||
        getStatus(question) === status;

      const matchesExam =
        examType === "ALL" ||
        getText(question.examType).toUpperCase() === examType;

      const matchesTopic =
        !topic || questionTopic === topic;

      const matchesCategory =
        !category || questionCategory === category;

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesType &&
        matchesStatus &&
        matchesExam &&
        matchesTopic &&
        matchesCategory
      );
    });
  }, [
    questionRecords,
    search,
    difficulty,
    questionType,
    status,
    examType,
    topic,
    category,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / PAGE_SIZE),
  );

  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredQuestions.slice(start, start + PAGE_SIZE);
  }, [filteredQuestions, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    difficulty,
    questionType,
    status,
    examType,
    topic,
    category,
    selectedSubjectId,
    selectedClassId,
  ]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const statistics = useMemo(
    () => ({
      total: questionRecords.length,
      published: questionRecords.filter(
        (question) => getStatus(question) === "PUBLISHED",
      ).length,
      draft: questionRecords.filter(
        (question) => getStatus(question) === "DRAFT",
      ).length,
      archived: questionRecords.filter(
        (question) => getStatus(question) === "ARCHIVED",
      ).length,
    }),
    [questionRecords],
  );

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goToQuestion = (questionId: string) => {
    if (
      !questionId ||
      !academicSessionId ||
      !selectedClassId ||
      !selectedSubjectId
    ) {
      return;
    }

    router.push(
      `/schools/${slug}/question-bank/${encodeURIComponent(questionId)}?academicSessionId=${encodeURIComponent(academicSessionId)}&classId=${encodeURIComponent(selectedClassId)}&subjectId=${encodeURIComponent(selectedSubjectId)}`,
    );
  };

  const goToEdit = (questionId: string) => {
    if (
      !questionId ||
      !academicSessionId ||
      !selectedClassId ||
      !selectedSubjectId
    ) {
      return;
    }

    router.push(
      `/schools/${slug}/question-bank/${encodeURIComponent(questionId)}/edit?academicSessionId=${encodeURIComponent(academicSessionId)}&classId=${encodeURIComponent(selectedClassId)}&subjectId=${encodeURIComponent(selectedSubjectId)}`,
    );
  };

  const goToCreate = () => {
    if (
      !isTeacher ||
      !academicSessionId ||
      !selectedClassId ||
      !selectedSubjectId
    ) {
      return;
    }

    router.push(
      `/schools/${slug}/question-bank/create?academicSessionId=${encodeURIComponent(academicSessionId)}&classId=${encodeURIComponent(selectedClassId)}&subjectId=${encodeURIComponent(selectedSubjectId)}`,
    );
  };

  /* =======================================================
     QUESTION STATUS
  ======================================================= */

  const handleStatusChange = async (
    questionId: string,
    nextStatus: string,
  ) => {
    if (!isAdministrator || !questionId) return;

    try {
      await handleUpdateQuestionStatus(questionId, {
        status: nextStatus,
      });

      await loadQuestions();
    } catch (err) {
      console.error("Question status update failed:", err);
    }
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setDifficulty("ALL");
    setQuestionType("ALL");
    setStatus("ALL");
    setExamType("ALL");
    setTopic("");
    setCategory("");
  };

  const hasActiveFilters =
    Boolean(search) ||
    difficulty !== "ALL" ||
    questionType !== "ALL" ||
    status !== "ALL" ||
    examType !== "ALL" ||
    Boolean(topic) ||
    Boolean(category);

  /* =======================================================
     ACCESS CHECK
  ======================================================= */

  if (!isHydrated) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <RefreshCw className="h-7 w-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-500" />

          <h1 className="mt-3 text-xl font-bold text-gray-900">
            Access Restricted
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Your school membership role does not have permission
            to access the Question Bank.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Question Bank
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Create, organise and manage reusable questions.
          </p>

          <p className="mt-1 text-xs font-medium text-indigo-600">
            {isTeacher ? "Teacher Question Bank" : "School Question Bank"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadOptions()}
            disabled={isLoadingOptions}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoadingOptions ? "animate-spin" : ""}`}
            />
            Reload Options
          </button>

          <button
            type="button"
            onClick={() => void loadQuestions()}
            disabled={
              isLoading ||
              !academicSessionId ||
              !selectedClassId ||
              !selectedSubjectId
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          {isTeacher && (
            <button
              type="button"
              onClick={goToCreate}
              disabled={
                !academicSessionId ||
                !selectedClassId ||
                !selectedSubjectId
              }
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Create Question
            </button>
          )}
        </div>
      </div>

      {/* MESSAGES */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && isAdministrator && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {optionsError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {optionsError}
        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Questions"
          value={statistics.total}
          icon={<FileQuestion className="h-5 w-5" />}
          color="indigo"
        />

        <StatCard
          label="Published"
          value={statistics.published}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="green"
        />

        <StatCard
          label="Draft"
          value={statistics.draft}
          icon={<Clock className="h-5 w-5" />}
          color="amber"
        />

        <StatCard
          label="Archived"
          value={statistics.archived}
          icon={<Archive className="h-5 w-5" />}
          color="gray"
        />
      </div>

      {/* SESSION, CLASS AND SUBJECT */}

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />

          <h2 className="font-semibold text-gray-900">
            Question Bank Selection
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* ACADEMIC SESSION */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Academic Session
            </label>

            <select
              value={academicSessionId || ""}
              onChange={(event) => {
                clearQuestionResults();
                setAcademicSessionId(event.target.value);
                setSelectedClassId("");
                setSelectedSubjectId("");
              }}
              disabled={
                isLoadingSessions || academicSessions.length === 0
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100"
            >
              <option value="">
                {isLoadingSessions
                  ? "Loading academic sessions..."
                  : academicSessions.length
                    ? "Select academic session"
                    : "No academic sessions found"}
              </option>

              {academicSessions.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.label}
                </option>
              ))}
            </select>

            {sessionsError && (
              <p className="mt-1 text-xs text-red-600">
                {sessionsError}
              </p>
            )}

            <p className="mt-1 text-xs text-gray-400">
              Select the academic session whose questions you want to manage.
            </p>
          </div>

          {/* CLASS */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Class
            </label>

            <select
              value={selectedClassId}
              onChange={(event) => {
                clearQuestionResults();
                setSelectedClassId(event.target.value);
                setSelectedSubjectId("");
              }}
              disabled={
                isLoadingOptions ||
                (isTeacher && !academicSessionId)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-100"
            >
              <option value="">Select class</option>

              {classes.map((schoolClass) => (
                <option key={schoolClass._id} value={schoolClass._id}>
                  {schoolClass.className}
                  {schoolClass.classCode
                    ? ` (${schoolClass.classCode})`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <select
              value={selectedSubjectId}
              onChange={(event) => {
                clearQuestionResults();
                setSelectedSubjectId(event.target.value);
              }}
              disabled={!selectedClassId || isLoadingOptions}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 disabled:bg-gray-100"
            >
              <option value="">Select subject</option>

              {availableSubjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName}
                  {subject.subjectCode
                    ? ` (${subject.subjectCode})`
                    : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoadingSessions && (
          <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            Fetching all academic sessions created for this school...
          </p>
        )}

        {isLoadingOptions && (
          <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            {isTeacher
              ? "Loading your assigned classes and subjects..."
              : "Loading school classes and subjects..."}
          </p>
        )}

        {isTeacher && !academicSessionId && (
          <p className="mt-3 text-xs text-amber-700">
            Select an academic session to load your teaching assignments.
          </p>
        )}

        {academicSessionId && selectedClassId && selectedSubjectId && (
          <p className="mt-3 text-xs text-green-700">
            Your Question Bank selection is ready.
          </p>
        )}

        {isTeacher &&
          !isLoadingOptions &&
          classes.length === 0 &&
          academicSessionId && (
            <p className="mt-3 text-xs text-amber-700">
              No assigned classes were returned for this academic session.
            </p>
          )}

        {isTeacher &&
          selectedClassId &&
          availableSubjects.length === 0 && (
            <p className="mt-3 text-xs text-amber-700">
              No assigned subjects were returned for this class.
            </p>
          )}
      </section>

      {/* SEARCH AND FILTERS */}

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search question text, topic or category..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <FilterSelect
              label="Difficulty"
              value={difficulty}
              onChange={setDifficulty}
              options={["EASY", "MEDIUM", "HARD"]}
            />

            <FilterSelect
              label="Question Type"
              value={questionType}
              onChange={setQuestionType}
              options={[
                "SINGLE_CHOICE",
                "MULTIPLE_CHOICE",
                "TRUE_FALSE",
                "SHORT_ANSWER",
                "ESSAY",
              ]}
            />

            <FilterSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={["DRAFT", "PUBLISHED", "ARCHIVED"]}
            />

            <FilterSelect
              label="Exam Type"
              value={examType}
              onChange={setExamType}
              options={[
                "JAMB",
                "WAEC",
                "NECO",
                "BECE",
                "INTERNAL",
              ]}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Topic
              </label>

              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">All topics</option>

                {topics.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">All categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>

      {/* QUESTIONS TABLE */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-gray-900">
              Questions
            </h2>

            <p className="text-sm text-gray-500">
              {filteredQuestions.length} question
              {filteredQuestions.length === 1 ? "" : "s"} found
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadQuestions()}
            disabled={
              isLoading ||
              !academicSessionId ||
              !selectedClassId ||
              !selectedSubjectId
            }
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Load Questions
          </button>
        </div>

        {!academicSessionId ||
        !selectedClassId ||
        !selectedSubjectId ? (
          <div className="px-6 py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Select your Question Bank
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Select an academic session, class and subject to load
              the questions for that selection.
            </p>
          </div>
        ) : isLoading ? (
          <div className="px-6 py-16 text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-indigo-600" />

            <p className="mt-3 text-sm text-gray-500">
              Loading questions...
            </p>
          </div>
        ) : paginatedQuestions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileQuestion className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No questions found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              There are no questions matching your selection or filters.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              )}

              {isTeacher && (
                <button
                  type="button"
                  onClick={goToCreate}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Create First Question
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Question</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Marks</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedQuestions.map((question) => {
                    const questionId = getQuestionId(question);

                    const marks =
                      typeof question.marks === "number"
                        ? question.marks
                        : 0;

                    const questionStatus = getStatus(question);

                    return (
                      <tr
                        key={questionId || getQuestionText(question)}
                        className="hover:bg-gray-50"
                      >
                        <td className="max-w-[360px] px-4 py-4">
                          <p className="line-clamp-2 font-medium text-gray-900">
                            {getQuestionText(question)}
                          </p>

                          {getText(question.topic) && (
                            <p className="mt-1 text-xs text-gray-500">
                              Topic: {getText(question.topic)}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {getQuestionType(question)}
                        </td>

                        <td className="px-4 py-4">
                          <DifficultyBadge
                            difficulty={getDifficulty(question)}
                          />
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {getText(question.topic, "—")}
                        </td>

                        <td className="px-4 py-4 text-gray-600">
                          {marks}
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={questionStatus} />
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="View question"
                              onClick={() => goToQuestion(questionId)}
                              disabled={!questionId}
                              className="rounded-lg p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              title="Edit question"
                              onClick={() => goToEdit(questionId)}
                              disabled={!questionId}
                              className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            {isAdministrator &&
                              questionStatus === "DRAFT" && (
                                <button
                                  type="button"
                                  title="Publish question"
                                  onClick={() =>
                                    void handleStatusChange(
                                      questionId,
                                      "PUBLISHED",
                                    )
                                  }
                                  disabled={!questionId}
                                  className="rounded-lg p-2 text-gray-500 hover:bg-green-50 hover:text-green-600 disabled:opacity-40"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                              )}

                            {isAdministrator &&
                              questionStatus === "PUBLISHED" && (
                                <button
                                  type="button"
                                  title="Archive question"
                                  onClick={() =>
                                    void handleStatusChange(
                                      questionId,
                                      "ARCHIVED",
                                    )
                                  }
                                  disabled={!questionId}
                                  className="rounded-lg p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-40"
                                >
                                  <Archive className="h-4 w-4" />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className="flex flex-col justify-between gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center">
              <p className="text-sm text-gray-500">
                Showing{" "}
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filteredQuestions.length,
                )}{" "}
                of {filteredQuestions.length}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="min-w-[90px] text-center text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1),
                    )
                  }
                  className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  color: "indigo" | "green" | "amber" | "gray";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-gray-500">{label}</p>

        <span className={`rounded-lg p-2 ${colors[color]}`}>
          {icon}
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
      >
        <option value="ALL">All {label.toLowerCase()}s</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}

function DifficultyBadge({
  difficulty,
}: {
  difficulty: string;
}) {
  const styles: Record<string, string> = {
    EASY: "bg-green-50 text-green-700",
    MEDIUM: "bg-amber-50 text-amber-700",
    HARD: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[difficulty] || "bg-gray-100 text-gray-600"
      }`}
    >
      {difficulty}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-green-50 text-green-700",
    DRAFT: "bg-amber-50 text-amber-700",
    ARCHIVED: "bg-gray-100 text-gray-600",
    ACTIVE: "bg-green-50 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}











