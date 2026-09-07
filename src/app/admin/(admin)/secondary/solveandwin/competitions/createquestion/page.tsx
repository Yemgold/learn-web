





// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   BookOpen,
//   Check,
//   ChevronDown,
//   Copy,
//   FileText,
//   Loader2,
//   Plus,
//   Save,
//   Trash2,
//   X,
// } from "lucide-react";

// import {getQuestionBank,} from "./questions";

// import { getSubjectsByPlan } from "@/lib/api/subjects";
// import { axiosInstance } from "@/lib/api/axios";

// /* ============================================================
//    TYPES
// ============================================================ */

// type Difficulty = "easy" | "medium" | "hard";
// type ExamType = "jamb" | "waec" | "neco";

// interface Subject {
//   _id: string;
//   name: string;
//   slug?: string;
// }

// interface QuestionOption {
//   label: string;
//   value: string;
// }

// interface ExplanationStep {
//   step: number;
//   text: string;
// }

// interface QuestionForm {
//   id: string;

//   question: string;
//   instruction: string;
//   topic: string;
//   section: string;

//   difficulty: Difficulty;
//   examType: ExamType;

//   apiSubjectName: string;

//   options: QuestionOption[];

//   correctAnswers: string[];

//   allowMultipleAnswers: boolean;

//   explanation: string;
//   explanationSteps: ExplanationStep[];
// }

// /* ============================================================
//    HELPERS
// ============================================================ */

// const OPTION_LABELS = ["A", "B", "C", "D", "E"];

// function createId() {
//   return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
// }

// function createEmptyQuestion(subjectName = ""): QuestionForm {
//   return {
//     id: createId(),

//     question: "",
//     instruction: "Choose the correct answer.",
//     topic: "",
//     section: "objective",

//     difficulty: "easy",
//     examType: "jamb",

//     apiSubjectName: subjectName,

//     options: [
//       {
//         label: "A",
//         value: "",
//       },
//       {
//         label: "B",
//         value: "",
//       },
//       {
//         label: "C",
//         value: "",
//       },
//       {
//         label: "D",
//         value: "",
//       },
//     ],

//     correctAnswers: [],

//     allowMultipleAnswers: false,

//     explanation: "",
//     explanationSteps: [],
//   };
// }

// /* ============================================================
//    COMPONENT
// ============================================================ */

// export default function CreateSolveAndWinQuestionsPage() {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState("");
//   const [questions, setQuestions] = useState<QuestionForm[]>([
//     createEmptyQuestion(),
//   ]);

//   const [loadingSubjects, setLoadingSubjects] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [pageError, setPageError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");



   
 
//  const bank = getQuestionBank(selectedSubject,selectedExamType,);

//   /* ==========================================================
//      LOAD SUBJECTS
//   ========================================================== */

//   useEffect(() => {
//     async function loadSubjects() {
//       try {
//         setLoadingSubjects(true);
//         setPageError("");

//         const response = await getSubjectsByPlan("SECONDARY", 1, 100);

//         const loadedSubjects: Subject[] =
//           response?.data?.subjectObj ?? [];

//         setSubjects(loadedSubjects);

//         if (loadedSubjects.length > 0) {
//           const firstSubject = loadedSubjects[0];

//           setSelectedSubjectId(firstSubject._id);

//           setQuestions((current) =>
//             current.map((question) => ({
//               ...question,
//               apiSubjectName: firstSubject.name,
//             })),
//           );
//         }
//       } catch (error: any) {
//         console.error("Failed to load subjects:", error);

//         setPageError(
//           error?.response?.data?.message ||
//             "Unable to load subjects. Please try again.",
//         );
//       } finally {
//         setLoadingSubjects(false);
//       }
//     }

//     loadSubjects();
//   }, []);

//   /* ==========================================================
//      SELECT SUBJECT
//   ========================================================== */

//   function handleSubjectChange(subjectId: string) {
//     setSelectedSubjectId(subjectId);
//     setSuccessMessage("");
//     setPageError("");

//     const selectedSubject = subjects.find(
//       (subject) => subject._id === subjectId,
//     );

//     if (!selectedSubject) return;

//     setQuestions((current) =>
//       current.map((question) => ({
//         ...question,
//         apiSubjectName: selectedSubject.name,
//       })),
//     );
//   }

//   /* ==========================================================
//      QUESTION FIELD UPDATE
//   ========================================================== */

//   function updateQuestion(
//     questionId: string,
//     field: keyof QuestionForm,
//     value: any,
//   ) {
//     setQuestions((current) =>
//       current.map((question) =>
//         question.id === questionId
//           ? {
//               ...question,
//               [field]: value,
//             }
//           : question,
//       ),
//     );

//     setSuccessMessage("");
//     setPageError("");
//   }

//   /* ==========================================================
//      OPTION UPDATE
//   ========================================================== */

//   function updateOption(
//     questionId: string,
//     optionIndex: number,
//     value: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         const updatedOptions = [...question.options];

//         updatedOptions[optionIndex] = {
//           ...updatedOptions[optionIndex],
//           value,
//         };

//         return {
//           ...question,
//           options: updatedOptions,
//         };
//       }),
//     );

//     setSuccessMessage("");
//   }

//   /* ==========================================================
//      ADD OPTION
//   ========================================================== */

//   function addOption(questionId: string) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         if (question.options.length >= OPTION_LABELS.length) {
//           return question;
//         }

//         const label = OPTION_LABELS[question.options.length];

//         return {
//           ...question,
//           options: [
//             ...question.options,
//             {
//               label,
//               value: "",
//             },
//           ],
//         };
//       }),
//     );
//   }

//   /* ==========================================================
//      REMOVE OPTION
//   ========================================================== */

//   function removeOption(
//     questionId: string,
//     optionIndex: number,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         if (question.options.length <= 2) {
//           return question;
//         }

//         const removedOption =
//           question.options[optionIndex];

//         const updatedOptions = question.options
//           .filter((_, index) => index !== optionIndex)
//           .map((option, index) => ({
//             ...option,
//             label: OPTION_LABELS[index],
//           }));

//         const updatedCorrectAnswers =
//           question.correctAnswers.filter(
//             (answer) => answer !== removedOption.value,
//           );

//         return {
//           ...question,
//           options: updatedOptions,
//           correctAnswers: updatedCorrectAnswers,
//         };
//       }),
//     );
//   }

//   /* ==========================================================
//      CORRECT ANSWER
//   ========================================================== */

//   function toggleCorrectAnswer(
//     questionId: string,
//     optionValue: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         if (question.allowMultipleAnswers) {
//           const exists =
//             question.correctAnswers.includes(optionValue);

//           return {
//             ...question,
//             correctAnswers: exists
//               ? question.correctAnswers.filter(
//                   (answer) => answer !== optionValue,
//                 )
//               : [
//                   ...question.correctAnswers,
//                   optionValue,
//                 ],
//           };
//         }

//         return {
//           ...question,
//           correctAnswers: [optionValue],
//         };
//       }),
//     );

//     setSuccessMessage("");
//   }

//   /* ==========================================================
//      MULTIPLE ANSWERS
//   ========================================================== */

//   function toggleMultipleAnswers(questionId: string) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         const enableMultiple =
//           !question.allowMultipleAnswers;

//         return {
//           ...question,
//           allowMultipleAnswers: enableMultiple,
//           correctAnswers: enableMultiple
//             ? question.correctAnswers
//             : question.correctAnswers.slice(0, 1),
//         };
//       }),
//     );
//   }

//   /* ==========================================================
//      EXPLANATION STEP
//   ========================================================== */

//   function addExplanationStep(questionId: string) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         return {
//           ...question,
//           explanationSteps: [
//             ...question.explanationSteps,
//             {
//               step:
//                 question.explanationSteps.length + 1,
//               text: "",
//             },
//           ],
//         };
//       }),
//     );
//   }

//   function updateExplanationStep(
//     questionId: string,
//     stepIndex: number,
//     value: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         const updatedSteps = [
//           ...question.explanationSteps,
//         ];

//         updatedSteps[stepIndex] = {
//           ...updatedSteps[stepIndex],
//           text: value,
//         };

//         return {
//           ...question,
//           explanationSteps: updatedSteps,
//         };
//       }),
//     );
//   }

//   function removeExplanationStep(
//     questionId: string,
//     stepIndex: number,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         return {
//           ...question,
//           explanationSteps: question.explanationSteps
//             .filter((_, index) => index !== stepIndex)
//             .map((step, index) => ({
//               ...step,
//               step: index + 1,
//             })),
//         };
//       }),
//     );
//   }

//   /* ==========================================================
//      QUESTION MANAGEMENT
//   ========================================================== */

//   function addQuestion() {
//     const selectedSubject = subjects.find(
//       (subject) => subject._id === selectedSubjectId,
//     );

//     setQuestions((current) => [
//       ...current,
//       createEmptyQuestion(selectedSubject?.name ?? ""),
//     ]);

//     setSuccessMessage("");
//   }

//   function duplicateQuestion(questionId: string) {
//     setQuestions((current) => {
//       const question = current.find(
//         (item) => item.id === questionId,
//       );

//       if (!question) return current;

//       const duplicated: QuestionForm = {
//         ...question,
//         id: createId(),
//         options: question.options.map((option) => ({
//           ...option,
//         })),
//         correctAnswers: [
//           ...question.correctAnswers,
//         ],
//         explanationSteps:
//           question.explanationSteps.map((step) => ({
//             ...step,
//           })),
//       };

//       const index = current.findIndex(
//         (item) => item.id === questionId,
//       );

//       const updated = [...current];

//       updated.splice(index + 1, 0, duplicated);

//       return updated;
//     });

//     setSuccessMessage("");
//   }

//   function removeQuestion(questionId: string) {
//     setQuestions((current) => {
//       if (current.length === 1) {
//         return current;
//       }

//       return current.filter(
//         (question) => question.id !== questionId,
//       );
//     });

//     setSuccessMessage("");
//   }

//   /* ==========================================================
//      VALIDATION
//   ========================================================== */

//   function validateQuestions() {
//     if (!selectedSubjectId) {
//       return "Please select a subject.";
//     }

//     if (questions.length === 0) {
//       return "Please add at least one question.";
//     }

//     for (let index = 0; index < questions.length; index++) {
//       const question = questions[index];
//       const number = index + 1;

//       if (!question.question.trim()) {
//         return `Question ${number}: question text is required.`;
//       }

//       if (!question.instruction.trim()) {
//         return `Question ${number}: instruction is required.`;
//       }

//       if (!question.topic.trim()) {
//         return `Question ${number}: topic is required.`;
//       }

//       if (!question.apiSubjectName.trim()) {
//         return `Question ${number}: subject name is required.`;
//       }

//       const validOptions = question.options.filter(
//         (option) => option.value.trim(),
//       );

//       if (validOptions.length < 2) {
//         return `Question ${number}: at least two options are required.`;
//       }

//       if (question.correctAnswers.length === 0) {
//         return `Question ${number}: select at least one correct answer.`;
//       }

//       const validOptionValues = validOptions.map(
//         (option) => option.value.trim(),
//       );

//       const invalidCorrectAnswer =
//         question.correctAnswers.some(
//           (answer) =>
//             !validOptionValues.includes(answer.trim()),
//         );

//       if (invalidCorrectAnswer) {
//         return `Question ${number}: every correct answer must match an option.`;
//       }

//       if (
//         !question.allowMultipleAnswers &&
//         question.correctAnswers.length > 1
//       ) {
//         return `Question ${number}: only one correct answer is allowed.`;
//       }
//     }

//     return null;
//   }

//   /* ==========================================================
//      PAYLOAD
//   ========================================================== */

//   function convertQuestionToPayload(
//     question: QuestionForm,
//   ) {
//     const validOptions = question.options
//       .filter((option) => option.value.trim())
//       .map((option) => ({
//         label: option.label,
//         value: option.value.trim(),
//       }));

//     return {
//       question: question.question.trim(),

//       instruction:
//         question.instruction.trim(),

//       topic: question.topic.trim(),

//       section: question.section.trim(),

//       difficulty: question.difficulty,

//       examType: question.examType,

//       subject: question.apiSubjectName.trim(),

//       options: validOptions,

//       correctAnswers:
//         question.correctAnswers.map((answer) =>
//           answer.trim(),
//         ),

//       allowMultipleAnswers:
//         question.allowMultipleAnswers,

//       explanation:
//         question.explanation.trim(),

//       explanationSteps:
//         question.explanationSteps
//           .filter((step) => step.text.trim())
//           .map((step, index) => ({
//             step: index + 1,
//             text: step.text.trim(),
//           })),
//     };
//   }

//   /* ==========================================================
//      SUBMIT
//   ========================================================== */

//   async function handleSubmit() {
//     setPageError("");
//     setSuccessMessage("");

//     const validationError = validateQuestions();

//     if (validationError) {
//       setPageError(validationError);
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//       return;
//     }

//     if (!selectedSubjectId) return;

//     try {
//       setSaving(true);

//       const payload = {
//         questions: questions.map(
//           convertQuestionToPayload,
//         ),
//       };

//       console.log(
//         "Submitting Solve & Win questions:",
//         payload,
//       );

//       const response =
//         await axiosInstance.patch(
//           `/solve-and-win/contests/add-solve-and-win-contest-questions-to-database/${encodeURIComponent(
//             selectedSubjectId,
//           )}`,
//           payload,
//         );

//       console.log(
//         "Questions saved successfully:",
//         response.data,
//       );

//       setSuccessMessage(
//         `${questions.length} question${
//           questions.length === 1 ? "" : "s"
//         } saved successfully.`,
//       );

//       setQuestions([
//         createEmptyQuestion(
//           subjects.find(
//             (subject) =>
//               subject._id === selectedSubjectId,
//           )?.name ?? "",
//         ),
//       ]);

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } catch (error: any) {
//       console.error(
//         "Failed to save questions:",
//         error,
//       );

//       const message =
//         error?.response?.data?.message ||
//         error?.response?.data?.error ||
//         "Unable to save questions. Please try again.";

//       setPageError(
//         Array.isArray(message)
//           ? message.join(", ")
//           : message,
//       );

//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } finally {
//       setSaving(false);
//     }
//   }

//   /* ==========================================================
//      PAYLOAD PREVIEW
//   ========================================================== */

//   const payloadPreview = useMemo(() => {
//     return {
//       questions: questions.map(
//         convertQuestionToPayload,
//       ),
//     };
//   }, [questions]);

//   /* ==========================================================
//      RENDER
//   ========================================================== */

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* ====================================================
//             HEADER
//         ==================================================== */}

//         <div className="mb-8">
//           <Link
//             href="/admin/secondary/solveandwin/competitions"
//             className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to Competitions
//           </Link>

//           <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <div className="mb-3 flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
//                   <FileText className="h-5 w-5 text-white" />
//                 </div>

//                 <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300">
//                   Solve & Win
//                 </span>
//               </div>

//               <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
//                 Create Questions
//               </h1>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
//                 Add questions to the Solve & Win question
//                 database for a selected secondary subject.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={addQuestion}
//               disabled={loadingSubjects || saving}
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <Plus className="h-4 w-4" />
//               Add Question
//             </button>
//           </div>
//         </div>

//         {/* ====================================================
//             ALERTS
//         ==================================================== */}

//         {pageError && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
//             <X className="mt-0.5 h-5 w-5 shrink-0" />

//             <div>
//               <p className="font-bold">
//                 Something went wrong
//               </p>

//               <p className="mt-1 text-red-200/80">
//                 {pageError}
//               </p>
//             </div>
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
//             <Check className="mt-0.5 h-5 w-5 shrink-0" />

//             <div>
//               <p className="font-bold">
//                 Questions saved
//               </p>

//               <p className="mt-1 text-emerald-200/80">
//                 {successMessage}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* ====================================================
//             SUBJECT
//         ==================================================== */}

//         <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
//           <div className="mb-4 flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
//               <BookOpen className="h-5 w-5" />
//             </div>

//             <div>
//               <h2 className="font-black">
//                 Question Subject
//               </h2>

//               <p className="text-xs text-slate-400">
//                 All questions on this page will be saved
//                 under this subject.
//               </p>
//             </div>
//           </div>

//           <div className="relative">
//             <select
//               value={selectedSubjectId}
//               onChange={(event) =>
//                 handleSubjectChange(
//                   event.target.value,
//                 )
//               }
//               disabled={
//                 loadingSubjects || saving
//               }
//               className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {loadingSubjects ? (
//                 <option value="">
//                   Loading subjects...
//                 </option>
//               ) : subjects.length === 0 ? (
//                 <option value="">
//                   No subjects found
//                 </option>
//               ) : (
//                 <>
//                   <option value="">
//                     Select a subject
//                   </option>

//                   {subjects.map((subject) => (
//                     <option
//                       key={subject._id}
//                       value={subject._id}
//                     >
//                       {subject.name}
//                     </option>
//                   ))}
//                 </>
//               )}
//             </select>

//             <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//           </div>
//         </div>

//         {/* ====================================================
//             QUESTIONS
//         ==================================================== */}

//         <div className="space-y-8">
//           {questions.map(
//             (question, questionIndex) => (
//               <div
//                 key={question.id}
//                 className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl"
//               >
//                 {/* QUESTION HEADER */}

//                 <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
//                   <div>
//                     <div className="flex items-center gap-3">
//                       <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
//                         {questionIndex + 1}
//                       </span>

//                       <div>
//                         <h2 className="font-black">
//                           Question{" "}
//                           {questionIndex + 1}
//                         </h2>

//                         <p className="text-xs text-slate-500">
//                           {question.apiSubjectName ||
//                             "No subject selected"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         duplicateQuestion(
//                           question.id,
//                         )
//                       }
//                       disabled={saving}
//                       className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
//                     >
//                       <Copy className="h-4 w-4" />
//                       Duplicate
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() =>
//                         removeQuestion(
//                           question.id,
//                         )
//                       }
//                       disabled={
//                         saving ||
//                         questions.length === 1
//                       }
//                       className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-500/5 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                       Remove
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-7 p-5 sm:p-6">
//                   {/* QUESTION TEXT */}

//                   <div>
//                     <label className="mb-2 block text-sm font-bold">
//                       Question
//                     </label>

//                     <textarea
//                       value={question.question}
//                       onChange={(event) =>
//                         updateQuestion(
//                           question.id,
//                           "question",
//                           event.target.value,
//                         )
//                       }
//                       rows={5}
//                       placeholder="Enter the question..."
//                       className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                     />
//                   </div>

//                   {/* BASIC DETAILS */}

//                   <div className="grid gap-5 md:grid-cols-2">
//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Instruction
//                       </label>

//                       <input
//                         value={question.instruction}
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "instruction",
//                             event.target.value,
//                           )
//                         }
//                         placeholder="Choose the correct answer."
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Topic
//                       </label>

//                       <input
//                         value={question.topic}
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "topic",
//                             event.target.value,
//                           )
//                         }
//                         placeholder="e.g. Cell Biology"
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                       />
//                     </div>
//                   </div>

//                   {/* META */}

//                   <div className="grid gap-5 sm:grid-cols-3">
//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Difficulty
//                       </label>

//                       <select
//                         value={
//                           question.difficulty
//                         }
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "difficulty",
//                             event.target
//                               .value as Difficulty,
//                           )
//                         }
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
//                       >
//                         <option value="easy">
//                           Easy
//                         </option>

//                         <option value="medium">
//                           Medium
//                         </option>

//                         <option value="hard">
//                           Hard
//                         </option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Exam Type
//                       </label>

//                       <select
//                         value={
//                           question.examType
//                         }
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "examType",
//                             event.target
//                               .value as ExamType,
//                           )
//                         }
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
//                       >
//                         <option value="jamb">
//                           JAMB
//                         </option>

//                         <option value="waec">
//                           WAEC
//                         </option>

//                         <option value="neco">
//                           NECO
//                         </option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="mb-2 block text-sm font-bold">
//                         Section
//                       </label>

//                       <input
//                         value={question.section}
//                         onChange={(event) =>
//                           updateQuestion(
//                             question.id,
//                             "section",
//                             event.target.value,
//                           )
//                         }
//                         placeholder="objective"
//                         className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                       />
//                     </div>
//                   </div>

//                   {/* OPTIONS */}

//                   <div>
//                     <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                       <div>
//                         <h3 className="text-sm font-black">
//                           Answer Options
//                         </h3>

//                         <p className="mt-1 text-xs text-slate-500">
//                           Select the correct answer below.
//                         </p>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           addOption(
//                             question.id,
//                           )
//                         }
//                         disabled={
//                           question.options
//                             .length >=
//                             OPTION_LABELS.length
//                         }
//                         className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
//                       >
//                         <Plus className="h-4 w-4" />
//                         Add Option
//                       </button>
//                     </div>

//                     <div className="space-y-3">
//                       {question.options.map(
//                         (option, optionIndex) => {
//                           const isCorrect =
//                             question.correctAnswers.includes(
//                               option.value,
//                             );

//                           return (
//                             <div
//                               key={`${question.id}-${option.label}`}
//                               className={`flex gap-3 rounded-2xl border p-3 transition ${
//                                 isCorrect
//                                   ? "border-emerald-400/40 bg-emerald-500/5"
//                                   : "border-white/10 bg-slate-900"
//                               }`}
//                             >
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   toggleCorrectAnswer(
//                                     question.id,
//                                     option.value,
//                                   )
//                                 }
//                                 disabled={
//                                   !option.value.trim()
//                                 }
//                                 className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black transition ${
//                                   isCorrect
//                                     ? "bg-emerald-500 text-white"
//                                     : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
//                                 }`}
//                                 title={
//                                   isCorrect
//                                     ? "Correct answer"
//                                     : "Mark as correct"
//                                 }
//                               >
//                                 {isCorrect ? (
//                                   <Check className="h-5 w-5" />
//                                 ) : (
//                                   option.label
//                                 )}
//                               </button>

//                               <input
//                                 value={
//                                   option.value
//                                 }
//                                 onChange={(
//                                   event,
//                                 ) =>
//                                   updateOption(
//                                     question.id,
//                                     optionIndex,
//                                     event.target
//                                       .value,
//                                   )
//                                 }
//                                 placeholder={`Option ${option.label}`}
//                                 className="min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-slate-600"
//                               />

//                               {question.options
//                                 .length >
//                                 2 && (
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     removeOption(
//                                       question.id,
//                                       optionIndex,
//                                     )
//                                   }
//                                   className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
//                                 >
//                                   <X className="h-4 w-4" />
//                                 </button>
//                               )}
//                             </div>
//                           );
//                         },
//                       )}
//                     </div>

//                     <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
//                       <input
//                         type="checkbox"
//                         checked={
//                           question.allowMultipleAnswers
//                         }
//                         onChange={() =>
//                           toggleMultipleAnswers(
//                             question.id,
//                           )
//                         }
//                         className="h-4 w-4 rounded border-white/20"
//                       />

//                       <div>
//                         <p className="text-sm font-bold">
//                           Allow multiple correct answers
//                         </p>

//                         <p className="text-xs text-slate-500">
//                           Enable this only when more than
//                           one option should be correct.
//                         </p>
//                       </div>
//                     </label>
//                   </div>

//                   {/* EXPLANATION */}

//                   <div>
//                     <label className="mb-2 block text-sm font-bold">
//                       Explanation
//                     </label>

//                     <textarea
//                       value={question.explanation}
//                       onChange={(event) =>
//                         updateQuestion(
//                           question.id,
//                           "explanation",
//                           event.target.value,
//                         )
//                       }
//                       rows={4}
//                       placeholder="Explain why the correct answer is correct..."
//                       className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                     />

//                     <div className="mt-4">
//                       <div className="mb-3 flex items-center justify-between">
//                         <div>
//                           <p className="text-sm font-bold">
//                             Explanation Steps
//                           </p>

//                           <p className="text-xs text-slate-500">
//                             Optional step-by-step explanation.
//                           </p>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             addExplanationStep(
//                               question.id,
//                             )
//                           }
//                           className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
//                         >
//                           <Plus className="h-4 w-4" />
//                           Add Step
//                         </button>
//                       </div>

//                       {question.explanationSteps
//                         .length > 0 && (
//                         <div className="space-y-3">
//                           {question.explanationSteps.map(
//                             (
//                               step,
//                               stepIndex,
//                             ) => (
//                               <div
//                                 key={`${question.id}-step-${stepIndex}`}
//                                 className="flex gap-3"
//                               >
//                                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-black text-slate-400">
//                                   {stepIndex +
//                                     1}
//                                 </div>

//                                 <input
//                                   value={step.text}
//                                   onChange={(
//                                     event,
//                                   ) =>
//                                     updateExplanationStep(
//                                       question.id,
//                                       stepIndex,
//                                       event
//                                         .target
//                                         .value,
//                                     )
//                                   }
//                                   placeholder={`Explanation step ${
//                                     stepIndex +
//                                     1
//                                   }`}
//                                   className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
//                                 />

//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     removeExplanationStep(
//                                       question.id,
//                                       stepIndex,
//                                     )
//                                   }
//                                   className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             ),
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ),
//           )}
//         </div>

//         {/* ====================================================
//             PAYLOAD PREVIEW
//         ==================================================== */}

//         <details className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
//           <summary className="cursor-pointer select-none px-5 py-4 text-sm font-bold text-slate-300 hover:text-white">
//             Preview API Payload
//           </summary>

//           <pre className="max-h-[500px] overflow-auto border-t border-white/10 p-5 text-xs leading-6 text-slate-400">
//             {JSON.stringify(
//               payloadPreview,
//               null,
//               2,
//             )}
//           </pre>
//         </details>

//         {/* ====================================================
//             BOTTOM ACTIONS
//         ==================================================== */}

//         <div className="sticky bottom-4 z-20 mt-8">
//           <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
//             <div className="px-2 text-xs text-slate-500">
//               {questions.length} question
//               {questions.length === 1
//                 ? ""
//                 : "s"} ready to save
//             </div>

//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={addQuestion}
//                 disabled={saving}
//                 className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 disabled:opacity-50 sm:flex-none"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add Question
//               </button>

//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={
//                   saving ||
//                   loadingSubjects ||
//                   !selectedSubjectId
//                 }
//                 className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
//               >
//                 {saving ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4" />
//                     Save Questions
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   BookOpen,
//   Check,
//   ChevronDown,
//   Copy,
//   FileText,
//   Loader2,
//   Plus,
//   RefreshCw,
//   Save,
//   Trash2,
//   X,
// } from "lucide-react";

// import { getSubjectsByPlan } from "@/lib/api/subjects";
// import { axiosInstance } from "@/lib/api/axios";

// type Difficulty = "easy" | "medium" | "hard";
// type ExamType = "jamb" | "waec" | "neco";

// interface Subject {
//   _id: string;
//   name: string;
//   slug?: string;
// }

// interface ContentSegment {
//   text: string;
//   styles: string[];
// }

// interface QuestionContent {
//   type: "text";
//   order: number;
//   segments: ContentSegment[];
//   latex?: string;
//   table?: string[][];
//   graph?: {
//     type: string;
//     labels: string[];
//     datasets: {
//       label: string;
//       data: number[];
//     }[];
//   };
// }

// interface QuestionOption {
//   label: string;
//   value: string;
// }

// interface QuestionForm {
//   id: string;
//   content: QuestionContent[];
//   question: string;
//   instruction: string;
//   topic: string;
//   section: string;
//   options: QuestionOption[];
//   correctAnswers: string[];
//   explanation: string;
//   explanationSteps: string[];
//   difficulty: Difficulty;
//   examType: ExamType;
//   apiSubjectName: string;
//   isMultipleAnswer: boolean;
// }

// const OPTION_LABELS = ["A", "B", "C", "D", "E"];

// function createId() {
//   return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
// }

// function createContent(text: string): QuestionContent[] {
//   return [
//     {
//       type: "text",
//       order: 1,
//       segments: [
//         {
//           text,
//           styles: [],
//         },
//       ],
//     },
//   ];
// }

// /**
//  * ============================================================
//  * PRELOADED TEST QUESTIONS
//  * ============================================================
//  */
// function createTestQuestions(subjectName = "Biology"): QuestionForm[] {
//   return [
//     {
//       id: createId(),
//       content: createContent(
//         "Mitochondria are membrane-bound organelles found in most eukaryotic cells.",
//       ),
//       question:
//         "Which organelle is known as the powerhouse of the cell?",
//       instruction: "Choose the correct answer.",
//       topic: "Cell Biology",
//       section: "objective",
//       options: [
//         { label: "A", value: "Mitochondria" },
//         { label: "B", value: "Nucleus" },
//         { label: "C", value: "Ribosome" },
//         { label: "D", value: "Golgi apparatus" },
//       ],
//       correctAnswers: ["Mitochondria"],
//       explanation:
//         "Mitochondria are called the powerhouse of the cell because they produce most of the ATP used to provide energy for cellular activities.",
//       explanationSteps: [
//         "Mitochondria contain enzymes needed for cellular respiration.",
//         "Cellular respiration releases energy from food molecules.",
//         "The released energy is stored mainly as ATP.",
//       ],
//       difficulty: "easy",
//       examType: "waec",
//       apiSubjectName: subjectName,
//       isMultipleAnswer: false,
//     },

//     {
//       id: createId(),
//       content: createContent(
//         "The nucleus contains genetic material and coordinates many cellular activities.",
//       ),
//       question:
//         "Which structure controls most of the activities of a cell?",
//       instruction: "Choose the correct answer.",
//       topic: "Cell Biology",
//       section: "objective",
//       options: [
//         { label: "A", value: "Cell wall" },
//         { label: "B", value: "Nucleus" },
//         { label: "C", value: "Cytoplasm" },
//         { label: "D", value: "Vacuole" },
//       ],
//       correctAnswers: ["Nucleus"],
//       explanation:
//         "The nucleus contains the genetic material of the cell and regulates many of its activities.",
//       explanationSteps: [
//         "The nucleus contains DNA.",
//         "DNA carries genetic information.",
//         "The information in DNA helps regulate cellular activities.",
//       ],
//       difficulty: "easy",
//       examType: "waec",
//       apiSubjectName: subjectName,
//       isMultipleAnswer: false,
//     },

//     {
//       id: createId(),
//       content: createContent(
//         "Green plants manufacture organic food using light energy.",
//       ),
//       question:
//         "Which process do green plants use to manufacture their food?",
//       instruction: "Choose the correct answer.",
//       topic: "Nutrition in Plants",
//       section: "objective",
//       options: [
//         { label: "A", value: "Respiration" },
//         { label: "B", value: "Transpiration" },
//         { label: "C", value: "Photosynthesis" },
//         { label: "D", value: "Excretion" },
//       ],
//       correctAnswers: ["Photosynthesis"],
//       explanation:
//         "Photosynthesis is the process by which green plants use light energy to manufacture glucose from carbon dioxide and water.",
//       explanationSteps: [
//         "Chlorophyll absorbs light energy.",
//         "Carbon dioxide enters the leaf through the stomata.",
//         "Water is absorbed from the soil through the roots.",
//         "Light energy is used to form glucose.",
//       ],
//       difficulty: "easy",
//       examType: "jamb",
//       apiSubjectName: subjectName,
//       isMultipleAnswer: false,
//     },

//     {
//       id: createId(),
//       content: createContent(
//         "Red blood cells contain haemoglobin, which binds with oxygen.",
//       ),
//       question:
//         "Which component of blood is mainly responsible for transporting oxygen?",
//       instruction: "Choose the correct answer.",
//       topic: "Transport System",
//       section: "objective",
//       options: [
//         { label: "A", value: "Platelets" },
//         { label: "B", value: "White blood cells" },
//         { label: "C", value: "Red blood cells" },
//         { label: "D", value: "Plasma" },
//       ],
//       correctAnswers: ["Red blood cells"],
//       explanation:
//         "Red blood cells transport oxygen because they contain haemoglobin, a pigment that binds with oxygen.",
//       explanationSteps: [
//         "Red blood cells contain haemoglobin.",
//         "Haemoglobin combines reversibly with oxygen.",
//         "This allows oxygen to be transported from the lungs to body tissues.",
//       ],
//       difficulty: "medium",
//       examType: "waec",
//       apiSubjectName: subjectName,
//       isMultipleAnswer: false,
//     },

//     {
//       id: createId(),
//       content: createContent(
//         "Enzymes are biological catalysts that increase the rate of chemical reactions.",
//       ),
//       question:
//         "What is the main function of an enzyme in a biological reaction?",
//       instruction: "Choose the correct answer.",
//       topic: "Enzymes",
//       section: "objective",
//       options: [
//         { label: "A", value: "To increase activation energy" },
//         { label: "B", value: "To slow down every reaction" },
//         { label: "C", value: "To lower activation energy" },
//         { label: "D", value: "To permanently change into the product" },
//       ],
//       correctAnswers: ["To lower activation energy"],
//       explanation:
//         "Enzymes act as biological catalysts by lowering the activation energy required for a reaction to occur.",
//       explanationSteps: [
//         "Reactants must reach a certain activation energy before reacting.",
//         "Enzymes provide an alternative reaction pathway.",
//         "This pathway requires less activation energy.",
//         "The reaction therefore occurs more rapidly.",
//       ],
//       difficulty: "medium",
//       examType: "jamb",
//       apiSubjectName: subjectName,
//       isMultipleAnswer: false,
//     },
//   ];
// }

// function createEmptyQuestion(subjectName = ""): QuestionForm {
//   return {
//     id: createId(),
//     content: createContent(""),
//     question: "",
//     instruction: "Choose the correct answer.",
//     topic: "",
//     section: "objective",
//     options: [
//       { label: "A", value: "" },
//       { label: "B", value: "" },
//       { label: "C", value: "" },
//       { label: "D", value: "" },
//     ],
//     correctAnswers: [],
//     explanation: "",
//     explanationSteps: [],
//     difficulty: "easy",
//     examType: "jamb",
//     apiSubjectName: subjectName,
//     isMultipleAnswer: false,
//   };
// }

// export default function CreateQuestionPage() {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState("");

//   const [questions, setQuestions] = useState<QuestionForm[]>([]);

//   const [loadingSubjects, setLoadingSubjects] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [pageError, setPageError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   /**
//    * ============================================================
//    * LOAD SUBJECTS
//    * ============================================================
//    */
//   useEffect(() => {
//     async function loadSubjects() {
//       try {
//         setLoadingSubjects(true);
//         setPageError("");

//         const response = await getSubjectsByPlan(
//           "SECONDARY",
//           1,
//           100,
//         );

//         const loadedSubjects: Subject[] =
//           response?.data?.subjectObj ?? [];

//         setSubjects(loadedSubjects);

//         if (loadedSubjects.length === 0) {
//           setQuestions([createEmptyQuestion()]);
//           return;
//         }

//         /**
//          * Prefer Biology because the preloaded questions
//          * are Biology questions.
//          */
//         const biologySubject =
//           loadedSubjects.find((subject) =>
//             subject.name.toLowerCase().includes("biology"),
//           ) ?? loadedSubjects[0];

//         setSelectedSubjectId(biologySubject._id);

//         setQuestions(
//           createTestQuestions(biologySubject.name),
//         );
//       } catch (error: any) {
//         console.error("Failed to load subjects:", error);

//         setPageError(
//           error?.response?.data?.message ||
//             error?.message ||
//             "Failed to load subjects.",
//         );

//         setQuestions([createEmptyQuestion()]);
//       } finally {
//         setLoadingSubjects(false);
//       }
//     }

//     loadSubjects();
//   }, []);

//   /**
//    * ============================================================
//    * SELECTED SUBJECT
//    * ============================================================
//    */
//   const selectedSubject = useMemo(
//     () =>
//       subjects.find(
//         (subject) => subject._id === selectedSubjectId,
//       ),
//     [subjects, selectedSubjectId],
//   );

//   /**
//    * ============================================================
//    * SUBJECT CHANGE
//    * ============================================================
//    */
//   function handleSubjectChange(subjectId: string) {
//     setSelectedSubjectId(subjectId);
//     setPageError("");
//     setSuccessMessage("");

//     const subject = subjects.find(
//       (item) => item._id === subjectId,
//     );

//     if (!subject) return;

//     setQuestions((current) =>
//       current.map((question) => ({
//         ...question,
//         apiSubjectName: subject.name,
//       })),
//     );
//   }

//   /**
//    * ============================================================
//    * UPDATE QUESTION
//    * ============================================================
//    */
//   function updateQuestion(
//     questionId: string,
//     field: keyof QuestionForm,
//     value: any,
//   ) {
//     setQuestions((current) =>
//       current.map((question) =>
//         question.id === questionId
//           ? {
//               ...question,
//               [field]: value,
//             }
//           : question,
//       ),
//     );

//     setSuccessMessage("");
//   }

//   /**
//    * ============================================================
//    * UPDATE CONTENT TEXT
//    * ============================================================
//    */
//   function updateContentText(
//     questionId: string,
//     value: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         const content = [...question.content];

//         if (!content[0]) {
//           content.push({
//             type: "text",
//             order: 1,
//             segments: [
//               {
//                 text: value,
//                 styles: [],
//               },
//             ],
//           });
//         } else {
//           content[0] = {
//             ...content[0],
//             segments: [
//               {
//                 ...(content[0].segments[0] ?? {
//                   text: "",
//                   styles: [],
//                 }),
//                 text: value,
//               },
//             ],
//           };
//         }

//         return {
//           ...question,
//           content,
//         };
//       }),
//     );
//   }

//   /**
//    * ============================================================
//    * UPDATE OPTION
//    * ============================================================
//    */
//   function updateOption(
//     questionId: string,
//     optionIndex: number,
//     value: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         const options = question.options.map(
//           (option, index) =>
//             index === optionIndex
//               ? {
//                   ...option,
//                   value,
//                 }
//               : option,
//         );

//         /**
//          * Keep correctAnswers synchronized if an option
//          * that was previously correct gets edited.
//          */
//         const oldValue =
//           question.options[optionIndex]?.value ?? "";

//         const correctAnswers =
//           question.correctAnswers.map((answer) =>
//             answer === oldValue ? value : answer,
//           );

//         return {
//           ...question,
//           options,
//           correctAnswers,
//         };
//       }),
//     );
//   }

//   /**
//    * ============================================================
//    * ADD OPTION
//    * ============================================================
//    */
//   function addOption(questionId: string) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         if (question.options.length >= 5) {
//           return question;
//         }

//         return {
//           ...question,
//           options: [
//             ...question.options,
//             {
//               label:
//                 OPTION_LABELS[question.options.length],
//               value: "",
//             },
//           ],
//         };
//       }),
//     );
//   }

//   /**
//    * ============================================================
//    * REMOVE OPTION
//    * ============================================================
//    */
//   function removeOption(
//     questionId: string,
//     optionIndex: number,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) return question;

//         if (question.options.length <= 2) {
//           return question;
//         }

//         const removedValue =
//           question.options[optionIndex]?.value;

//         const options = question.options
//           .filter((_, index) => index !== optionIndex)
//           .map((option, index) => ({
//             ...option,
//             label: OPTION_LABELS[index],
//           }));

//         return {
//           ...question,
//           options,
//           correctAnswers:
//             question.correctAnswers.filter(
//               (answer) => answer !== removedValue,
//             ),
//         };
//       }),
//     );
//   }

//   /**
//    * ============================================================
//    * TOGGLE CORRECT ANSWER
//    * ============================================================
//    */
//   function toggleCorrectAnswer(
//     questionId: string,
//     optionValue: string,
//   ) {
//     if (!optionValue.trim()) return;

//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         if (question.isMultipleAnswer) {
//           const alreadySelected =
//             question.correctAnswers.includes(optionValue);

//           return {
//             ...question,
//             correctAnswers: alreadySelected
//               ? question.correctAnswers.filter(
//                   (answer) => answer !== optionValue,
//                 )
//               : [
//                   ...question.correctAnswers,
//                   optionValue,
//                 ],
//           };
//         }

//         return {
//           ...question,
//           correctAnswers:
//             question.correctAnswers[0] === optionValue
//               ? []
//               : [optionValue],
//         };
//       }),
//     );
//   }

//   /**
//    * ============================================================
//    * TOGGLE MULTIPLE ANSWERS
//    * ============================================================
//    */
//   function toggleMultipleAnswers(
//     questionId: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         const isMultipleAnswer =
//           !question.isMultipleAnswer;

//         return {
//           ...question,
//           isMultipleAnswer,
//           correctAnswers: isMultipleAnswer
//             ? question.correctAnswers
//             : question.correctAnswers.slice(0, 1),
//         };
//       }),
//     );
//   }

//   /**
//    * ============================================================
//    * EXPLANATION STEP
//    * ============================================================
//    */
//   function addExplanationStep(questionId: string) {
//     setQuestions((current) =>
//       current.map((question) =>
//         question.id === questionId
//           ? {
//               ...question,
//               explanationSteps: [
//                 ...question.explanationSteps,
//                 "",
//               ],
//             }
//           : question,
//       ),
//     );
//   }

//   function updateExplanationStep(
//     questionId: string,
//     stepIndex: number,
//     value: string,
//   ) {
//     setQuestions((current) =>
//       current.map((question) => {
//         if (question.id !== questionId) {
//           return question;
//         }

//         const explanationSteps = [
//           ...question.explanationSteps,
//         ];

//         explanationSteps[stepIndex] = value;

//         return {
//           ...question,
//           explanationSteps,
//         };
//       }),
//     );
//   }

//   function removeExplanationStep(
//     questionId: string,
//     stepIndex: number,
//   ) {
//     setQuestions((current) =>
//       current.map((question) =>
//         question.id === questionId
//           ? {
//               ...question,
//               explanationSteps:
//                 question.explanationSteps.filter(
//                   (_, index) => index !== stepIndex,
//                 ),
//             }
//           : question,
//       ),
//     );
//   }

//   /**
//    * ============================================================
//    * QUESTION MANAGEMENT
//    * ============================================================
//    */
//   function addQuestion() {
//     setQuestions((current) => [
//       ...current,
//       createEmptyQuestion(
//         selectedSubject?.name ?? "",
//       ),
//     ]);

//     setSuccessMessage("");
//   }

//   function duplicateQuestion(questionId: string) {
//     setQuestions((current) => {
//       const source = current.find(
//         (question) => question.id === questionId,
//       );

//       if (!source) return current;

//       const copy: QuestionForm = {
//         ...source,
//         id: createId(),
//         content: source.content.map((block) => ({
//           ...block,
//           segments: block.segments.map((segment) => ({
//             ...segment,
//             styles: [...segment.styles],
//           })),
//         })),
//         options: source.options.map((option) => ({
//           ...option,
//         })),
//         correctAnswers: [
//           ...source.correctAnswers,
//         ],
//         explanationSteps: [
//           ...source.explanationSteps,
//         ],
//       };

//       const index = current.findIndex(
//         (question) => question.id === questionId,
//       );

//       return [
//         ...current.slice(0, index + 1),
//         copy,
//         ...current.slice(index + 1),
//       ];
//     });
//   }

//   function removeQuestion(questionId: string) {
//     setQuestions((current) => {
//       if (current.length <= 1) {
//         return current;
//       }

//       return current.filter(
//         (question) => question.id !== questionId,
//       );
//     });
//   }

//   /**
//    * ============================================================
//    * RELOAD TEST QUESTIONS
//    * ============================================================
//    */
//   function loadTestQuestions() {
//     const subjectName =
//       selectedSubject?.name || "Biology";

//     setQuestions(
//       createTestQuestions(subjectName),
//     );

//     setPageError("");
//     setSuccessMessage(
//       "5 test questions have been loaded.",
//     );
//   }

//   /**
//    * ============================================================
//    * VALIDATION
//    * ============================================================
//    */
//   function validateQuestions() {
//     if (!selectedSubjectId) {
//       return "Please select a subject.";
//     }

//     if (questions.length === 0) {
//       return "Please add at least one question.";
//     }

//     for (let index = 0; index < questions.length; index++) {
//       const question = questions[index];
//       const number = index + 1;

//       if (!question.question.trim()) {
//         return `Question ${number}: question text is required.`;
//       }

//       if (!question.instruction.trim()) {
//         return `Question ${number}: instruction is required.`;
//       }

//       if (!question.topic.trim()) {
//         return `Question ${number}: topic is required.`;
//       }

//       if (!question.apiSubjectName.trim()) {
//         return `Question ${number}: subject name is required.`;
//       }

//       const validOptions = question.options.filter(
//         (option) => option.value.trim(),
//       );

//       if (validOptions.length < 2) {
//         return `Question ${number}: at least 2 options are required.`;
//       }

//       if (question.correctAnswers.length === 0) {
//         return `Question ${number}: please select a correct answer.`;
//       }

//       if (
//         !question.isMultipleAnswer &&
//         question.correctAnswers.length > 1
//       ) {
//         return `Question ${number}: only one correct answer is allowed.`;
//       }

//       const optionValues = validOptions.map(
//         (option) => option.value.trim(),
//       );

//       const invalidCorrectAnswer =
//         question.correctAnswers.some(
//           (answer) =>
//             !optionValues.includes(answer.trim()),
//         );

//       if (invalidCorrectAnswer) {
//         return `Question ${number}: one or more correct answers do not match an option.`;
//       }
//     }

//     return "";
//   }

//   /**
//    * ============================================================
//    * PAYLOAD CONVERTER
//    * ============================================================
//    */
//   function convertQuestionToPayload(
//     question: QuestionForm,
//   ) {
//     const validOptions = question.options
//       .filter((option) => option.value.trim())
//       .map((option) => ({
//         label: option.label,
//         value: option.value.trim(),
//       }));

//     return {
//       content: question.content,

//       question: question.question.trim(),

//       instruction:
//         question.instruction.trim(),

//       topic: question.topic.trim(),

//       section: question.section.trim(),

//       options: validOptions,

//       /**
//        * IMPORTANT:
//        * Backend receives option VALUES here,
//        * not A/B/C/D labels.
//        */
//       correctAnswers:
//         question.correctAnswers.map((answer) =>
//           answer.trim(),
//         ),

//       explanation:
//         question.explanation.trim(),

//       explanationSteps:
//         question.explanationSteps
//           .map((step) => step.trim())
//           .filter(Boolean),

//       difficulty:
//         question.difficulty,

//       examType:
//         question.examType,

//       apiSubjectName:
//         question.apiSubjectName.trim(),

//       isMultipleAnswer:
//         question.isMultipleAnswer,
//     };
//   }

//   /**
//    * ============================================================
//    * FINAL API PAYLOAD
//    * ============================================================
//    */
//   const payloadPreview = useMemo(
//     () => ({
//       questions:
//         questions.map(convertQuestionToPayload),
//     }),
//     [questions],
//   );

//   /**
//    * ============================================================
//    * SEND QUESTIONS TO DATABASE
//    * ============================================================
//    */
//   async function handleSaveQuestions() {
//     setPageError("");
//     setSuccessMessage("");

//     const validationError =
//       validateQuestions();

//     if (validationError) {
//       setPageError(validationError);
//       return;
//     }

//     if (!selectedSubjectId) {
//       setPageError("Please select a subject.");
//       return;
//     }

//     try {
//       setSaving(true);

//       const payload = {
//         questions:
//           questions.map(convertQuestionToPayload),
//       };

//       console.log(
//         "Sending Solve & Win questions:",
//         payload,
//       );

//       const response =
//         await axiosInstance.patch(
//           `/solve-and-win/contests/add-solve-and-win-contest-questions-to-database/${encodeURIComponent(
//             selectedSubjectId,
//           )}`,
//           payload,
//         );

//       console.log(
//         "Questions saved successfully:",
//         response.data,
//       );

//       setSuccessMessage(
//         `${questions.length} question${
//           questions.length === 1 ? "" : "s"
//         } sent to the database successfully.`,
//       );
//     } catch (error: any) {
//       console.error(
//         "Failed to save questions:",
//         error,
//       );

//       setPageError(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to send questions to the database.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       {/* =====================================================
//           HEADER
//       ====================================================== */}
//       <div className="border-b border-white/10 bg-slate-950/95">
//         <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex items-start gap-4">
//               <Link
//                 href="/admin/secondary/solveandwin/competitions"
//                 className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//               </Link>

//               <div>
//                 <div className="mb-1 flex items-center gap-2">
//                   <BookOpen className="h-5 w-5 text-cyan-400" />

//                   <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
//                     Solve & Win
//                   </span>
//                 </div>

//                 <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
//                   Create Questions
//                 </h1>

//                 <p className="mt-1 max-w-2xl text-sm text-slate-400">
//                   Load, review, edit and send multiple
//                   questions directly to the database.
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <button
//                 type="button"
//                 onClick={loadTestQuestions}
//                 disabled={loadingSubjects || saving}
//                 className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <RefreshCw className="h-4 w-4" />
//                 Load Test Questions
//               </button>

//               <button
//                 type="button"
//                 onClick={addQuestion}
//                 disabled={saving}
//                 className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <Plus className="h-4 w-4" />
//                 Add Question
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//         {/* =====================================================
//             ALERTS
//         ====================================================== */}
//         {pageError && (
//           <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-red-300">
//             <div className="flex items-start gap-3">
//               <X className="mt-0.5 h-5 w-5 shrink-0" />

//               <div>
//                 <p className="font-bold">
//                   Unable to continue
//                 </p>

//                 <p className="mt-1">
//                   {pageError}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-300">
//             <div className="flex items-start gap-3">
//               <Check className="mt-0.5 h-5 w-5 shrink-0" />

//               <div>
//                 <p className="font-bold">
//                   Success
//                 </p>

//                 <p className="mt-1">
//                   {successMessage}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* =====================================================
//             SUBJECT SELECTOR
//         ====================================================== */}
//         <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/10">
//           <div className="mb-4 flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
//               <BookOpen className="h-5 w-5" />
//             </div>

//             <div>
//               <h2 className="font-black">
//                 Question Subject
//               </h2>

//               <p className="text-sm text-slate-400">
//                 The selected subject ID is used in the
//                 database endpoint.
//               </p>
//             </div>
//           </div>

//           <div className="relative">
//             <select
//               value={selectedSubjectId}
//               onChange={(event) =>
//                 handleSubjectChange(
//                   event.target.value,
//                 )
//               }
//               disabled={
//                 loadingSubjects || saving
//               }
//               className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 pr-12 text-sm font-semibold text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <option value="">
//                 Select a subject
//               </option>

//               {subjects.map((subject) => (
//                 <option
//                   key={subject._id}
//                   value={subject._id}
//                 >
//                   {subject.name}
//                 </option>
//               ))}
//             </select>

//             <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
//           </div>

//           <div className="mt-3 flex flex-wrap gap-2 text-xs">
//             <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-400">
//               Subject ID:
//               <span className="ml-1 font-mono text-slate-300">
//                 {selectedSubjectId || "Not selected"}
//               </span>
//             </span>

//             <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-400">
//               Questions:
//               <span className="ml-1 font-bold text-white">
//                 {questions.length}
//               </span>
//             </span>
//           </div>
//         </section>

//         {/* =====================================================
//             LOADING
//         ====================================================== */}
//         {loadingSubjects ? (
//           <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.035]">
//             <div className="flex items-center gap-3 text-sm font-semibold text-slate-400">
//               <Loader2 className="h-5 w-5 animate-spin" />
//               Loading subjects and test questions...
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* =================================================
//                 QUESTIONS
//             ================================================== */}
//             <div className="space-y-6">
//               {questions.map(
//                 (question, questionIndex) => (
//                   <section
//                     key={question.id}
//                     className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/10"
//                   >
//                     {/* QUESTION HEADER */}
//                     <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-sm font-black text-cyan-300">
//                           {questionIndex + 1}
//                         </div>

//                         <div>
//                           <p className="font-black">
//                             Question {questionIndex + 1}
//                           </p>

//                           <p className="text-xs text-slate-500">
//                             {question.topic ||
//                               "No topic specified"}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             duplicateQuestion(
//                               question.id,
//                             )
//                           }
//                           disabled={saving}
//                           className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
//                         >
//                           <Copy className="h-4 w-4" />
//                           Duplicate
//                         </button>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             removeQuestion(
//                               question.id,
//                             )
//                           }
//                           disabled={
//                             saving ||
//                             questions.length <= 1
//                           }
//                           className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-500/5 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                           Remove
//                         </button>
//                       </div>
//                     </div>

//                     <div className="space-y-6 p-5">
//                       {/* ===============================
//                           CONTENT
//                       ================================= */}
//                       <div>
//                         <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
//                           Content / Question Context
//                         </label>

//                         <textarea
//                           value={
//                             question.content[0]
//                               ?.segments[0]?.text ??
//                             ""
//                           }
//                           onChange={(event) =>
//                             updateContentText(
//                               question.id,
//                               event.target.value,
//                             )
//                           }
//                           rows={3}
//                           placeholder="Optional content shown before the question..."
//                           className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
//                         />
//                       </div>

//                       {/* ===============================
//                           QUESTION
//                       ================================= */}
//                       <div>
//                         <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
//                           Question
//                         </label>

//                         <textarea
//                           value={question.question}
//                           onChange={(event) =>
//                             updateQuestion(
//                               question.id,
//                               "question",
//                               event.target.value,
//                             )
//                           }
//                           rows={3}
//                           placeholder="Enter the question..."
//                           className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
//                         />
//                       </div>

//                       {/* ===============================
//                           BASIC DETAILS
//                       ================================= */}
//                       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                         <div>
//                           <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
//                             Instruction
//                           </label>

//                           <input
//                             value={question.instruction}
//                             onChange={(event) =>
//                               updateQuestion(
//                                 question.id,
//                                 "instruction",
//                                 event.target.value,
//                               )
//                             }
//                             className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
//                           />
//                         </div>

//                         <div>
//                           <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
//                             Topic
//                           </label>

//                           <input
//                             value={question.topic}
//                             onChange={(event) =>
//                               updateQuestion(
//                                 question.id,
//                                 "topic",
//                                 event.target.value,
//                               )
//                             }
//                             placeholder="e.g. Cell Biology"
//                             className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
//                           />
//                         </div>

//                         <div>
//                           <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
//                             Difficulty
//                           </label>

//                           <select
//                             value={question.difficulty}
//                             onChange={(event) =>
//                               updateQuestion(
//                                 question.id,
//                                 "difficulty",
//                                 event.target
//                                   .value as Difficulty,
//                               )
//                             }
//                             className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
//                           >
//                             <option value="easy">
//                               Easy
//                             </option>
//                             <option value="medium">
//                               Medium
//                             </option>
//                             <option value="hard">
//                               Hard
//                             </option>
//                           </select>
//                         </div>

//                         <div>
//                           <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
//                             Exam Type
//                           </label>

//                           <select
//                             value={question.examType}
//                             onChange={(event) =>
//                               updateQuestion(
//                                 question.id,
//                                 "examType",
//                                 event.target
//                                   .value as ExamType,
//                               )
//                             }
//                             className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-3 text-sm uppercase text-white outline-none focus:border-cyan-400/50"
//                           >
//                             <option value="jamb">
//                               JAMB
//                             </option>
//                             <option value="waec">
//                               WAEC
//                             </option>
//                             <option value="neco">
//                               NECO
//                             </option>
//                           </select>
//                         </div>
//                       </div>

//                       {/* ===============================
//                           SECTION / SUBJECT
//                       ================================= */}
//                       <div className="grid gap-4 md:grid-cols-2">
//                         <div>
//                           <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
//                             Section
//                           </label>

//                           <input
//                             value={question.section}
//                             onChange={(event) =>
//                               updateQuestion(
//                                 question.id,
//                                 "section",
//                                 event.target.value,
//                               )
//                             }
//                             className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
//                           />
//                         </div>

//                         <div>
//                           <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
//                             API Subject Name
//                           </label>

//                           <input
//                             value={
//                               question.apiSubjectName
//                             }
//                             onChange={(event) =>
//                               updateQuestion(
//                                 question.id,
//                                 "apiSubjectName",
//                                 event.target.value,
//                               )
//                             }
//                             className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
//                           />
//                         </div>
//                       </div>

//                       {/* ===============================
//                           MULTIPLE ANSWER
//                       ================================= */}
//                       <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4">
//                         <div>
//                           <p className="text-sm font-bold">
//                             Multiple correct answers
//                           </p>

//                           <p className="mt-1 text-xs text-slate-500">
//                             Enable this when more than one
//                             option can be correct.
//                           </p>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() =>
//                             toggleMultipleAnswers(
//                               question.id,
//                             )
//                           }
//                           className={`relative h-7 w-12 rounded-full transition ${
//                             question.isMultipleAnswer
//                               ? "bg-cyan-400"
//                               : "bg-slate-700"
//                           }`}
//                         >
//                           <span
//                             className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
//                               question.isMultipleAnswer
//                                 ? "left-6"
//                                 : "left-1"
//                             }`}
//                           />
//                         </button>
//                       </div>

//                       {/* ===============================
//                           OPTIONS
//                       ================================= */}
//                       <div>
//                         <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                           <div>
//                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
//                               Answer Options
//                             </label>

//                             <p className="mt-1 text-xs text-slate-500">
//                               Click the circle beside an option
//                               to mark it as correct.
//                             </p>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               addOption(question.id)
//                             }
//                             disabled={
//                               question.options.length >=
//                                 5 || saving
//                             }
//                             className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
//                           >
//                             <Plus className="h-4 w-4" />
//                             Add Option
//                           </button>
//                         </div>

//                         <div className="space-y-3">
//                           {question.options.map(
//                             (option, optionIndex) => {
//                               const isCorrect =
//                                 question.correctAnswers.includes(
//                                   option.value,
//                                 );

//                               return (
//                                 <div
//                                   key={`${question.id}-${option.label}`}
//                                   className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
//                                     isCorrect
//                                       ? "border-emerald-400/30 bg-emerald-500/5"
//                                       : "border-white/10 bg-slate-900/60"
//                                   }`}
//                                 >
//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       toggleCorrectAnswer(
//                                         question.id,
//                                         option.value,
//                                       )
//                                     }
//                                     className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-black transition ${
//                                       isCorrect
//                                         ? "border-emerald-400 bg-emerald-400 text-slate-950"
//                                         : "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-300"
//                                     }`}
//                                   >
//                                     {isCorrect ? (
//                                       <Check className="h-5 w-5" />
//                                     ) : (
//                                       option.label
//                                     )}
//                                   </button>

//                                   <input
//                                     value={
//                                       option.value
//                                     }
//                                     onChange={(event) =>
//                                       updateOption(
//                                         question.id,
//                                         optionIndex,
//                                         event.target
//                                           .value,
//                                       )
//                                     }
//                                     placeholder={`Option ${option.label}`}
//                                     className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
//                                   />

//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       removeOption(
//                                         question.id,
//                                         optionIndex,
//                                       )
//                                     }
//                                     disabled={
//                                       question.options
//                                         .length <= 2 ||
//                                       saving
//                                     }
//                                     className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-500 transition hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </button>
//                                 </div>
//                               );
//                             },
//                           )}
//                         </div>
//                       </div>

//                       {/* ===============================
//                           EXPLANATION
//                       ================================= */}
//                       <div className="border-t border-white/10 pt-6">
//                         <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
//                           Explanation
//                         </label>

//                         <textarea
//                           value={question.explanation}
//                           onChange={(event) =>
//                             updateQuestion(
//                               question.id,
//                               "explanation",
//                               event.target.value,
//                             )
//                           }
//                           rows={4}
//                           placeholder="Explain why the correct answer is correct..."
//                           className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
//                         />
//                       </div>

//                       {/* ===============================
//                           EXPLANATION STEPS
//                       ================================= */}
//                       <div>
//                         <div className="mb-3 flex items-center justify-between">
//                           <div>
//                             <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
//                               Explanation Steps
//                             </label>

//                             <p className="mt-1 text-xs text-slate-500">
//                               These are sent as an array of strings.
//                             </p>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() =>
//                               addExplanationStep(
//                                 question.id,
//                               )
//                             }
//                             className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
//                           >
//                             <Plus className="h-4 w-4" />
//                             Add Step
//                           </button>
//                         </div>

//                         {question.explanationSteps.length ===
//                         0 ? (
//                           <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-4 py-5 text-center text-xs text-slate-600">
//                             No explanation steps added.
//                           </div>
//                         ) : (
//                           <div className="space-y-3">
//                             {question.explanationSteps.map(
//                               (step, stepIndex) => (
//                                 <div
//                                   key={`${question.id}-step-${stepIndex}`}
//                                   className="flex gap-3"
//                                 >
//                                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xs font-black text-cyan-300">
//                                     {stepIndex + 1}
//                                   </div>

//                                   <textarea
//                                     value={step}
//                                     onChange={(event) =>
//                                       updateExplanationStep(
//                                         question.id,
//                                         stepIndex,
//                                         event.target.value,
//                                       )
//                                     }
//                                     rows={2}
//                                     placeholder={`Explanation step ${
//                                       stepIndex + 1
//                                     }`}
//                                     className="min-w-0 flex-1 resize-none rounded-xl border border-white/10 bg-slate-900 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
//                                   />

//                                   <button
//                                     type="button"
//                                     onClick={() =>
//                                       removeExplanationStep(
//                                         question.id,
//                                         stepIndex,
//                                       )
//                                     }
//                                     className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-500 hover:bg-red-500/10 hover:text-red-300"
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </button>
//                                 </div>
//                               ),
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {/* ===============================
//                           QUESTION JSON
//                       ================================= */}
//                       <details className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
//                         <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold text-slate-300">
//                           <span className="flex items-center gap-2">
//                             <FileText className="h-4 w-4 text-cyan-400" />
//                             Question JSON
//                           </span>

//                           <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
//                         </summary>

//                         <pre className="max-h-[400px] overflow-auto border-t border-white/10 p-4 text-xs leading-6 text-slate-400">
// {JSON.stringify(
//   convertQuestionToPayload(question),
//   null,
//   2,
// )}
//                         </pre>
//                       </details>
//                     </div>
//                   </section>
//                 ),
//               )}
//             </div>

//             {/* =================================================
//                 PAYLOAD PREVIEW
//             ================================================== */}
//             <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
//               <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
//                 <div>
//                   <h2 className="flex items-center gap-2 font-black">
//                     <FileText className="h-5 w-5 text-cyan-400" />
//                     Database Payload Preview
//                   </h2>

//                   <p className="mt-1 text-xs text-slate-500">
//                     This is the exact structure sent in the
//                     PATCH request.
//                   </p>
//                 </div>

//                 <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
//                   {questions.length} questions
//                 </span>
//               </div>

//               <pre className="max-h-[500px] overflow-auto p-5 text-xs leading-6 text-slate-400">
// {JSON.stringify(payloadPreview, null, 2)}
//               </pre>
//             </section>

//             {/* =================================================
//                 BOTTOM ACTIONS
//             ================================================== */}
//             <div className="sticky bottom-4 z-20 mt-8">
//               <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm font-black">
//                     Ready to send?
//                   </p>

//                   <p className="mt-1 text-xs text-slate-500">
//                     {questions.length} question
//                     {questions.length === 1
//                       ? ""
//                       : "s"} will be sent to the selected
//                     subject.
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-2 sm:flex-row">
//                   <button
//                     type="button"
//                     onClick={addQuestion}
//                     disabled={saving}
//                     className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
//                   >
//                     <Plus className="h-4 w-4" />
//                     Add Question
//                   </button>

//                   <button
//                     type="button"
//                     onClick={handleSaveQuestions}
//                     disabled={
//                       saving ||
//                       loadingSubjects ||
//                       !selectedSubjectId ||
//                       questions.length === 0
//                     }
//                     className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     {saving ? (
//                       <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Sending...
//                       </>
//                     ) : (
//                       <>
//                         <Save className="h-4 w-4" />
//                         Send to Database
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }






























"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  FileText,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { getQuestionBank } from "./questions";
import type {
  Difficulty,
  ExamType,
  QuestionBankItem,
  QuestionOption,
} from "./questions/types";

import { getSubjectsByPlan } from "@/lib/api/subjects";
import { axiosInstance } from "@/lib/api/axios";

/* ============================================================
   TYPES
============================================================ */

interface Subject {
  _id: string;
  name: string;
  slug?: string;
}

interface QuestionContent {
  type: "text";
  order: number;
  segments: {
    text: string;
    styles: string[];
  }[];
  latex?: string;
  table?: string[][];
  graph?: {
    type: string;
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
}

interface ExplanationStep {
  step: number;
  text: string;
}

interface QuestionForm {
  id: string;

  content: QuestionContent[];

  question: string;
  instruction: string;
  topic: string;
  section: string;

  difficulty: Difficulty;
  examType: ExamType;

  apiSubjectName: string;

  options: QuestionOption[];

  correctAnswers: string[];

  isMultipleAnswer: boolean;

  explanation: string;
  explanationSteps: ExplanationStep[];
}

/* ============================================================
   HELPERS
============================================================ */

const OPTION_LABELS = ["A", "B", "C", "D", "E"];

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

/**
 * Creates an empty question.
 */
function createEmptyQuestion(
  subjectName = "",
  examType: ExamType = "jamb",
): QuestionForm {
  return {
    id: createId(),

    content: [],

    question: "",
    instruction: "Choose the correct answer.",
    topic: "",
    section: "objective",

    difficulty: "easy",
    examType,

    apiSubjectName: subjectName,

    options: [
      {
        label: "A",
        value: "",
      },
      {
        label: "B",
        value: "",
      },
      {
        label: "C",
        value: "",
      },
      {
        label: "D",
        value: "",
      },
    ],

    correctAnswers: [],

    isMultipleAnswer: false,

    explanation: "",
    explanationSteps: [],
  };
}

/**
 * Converts a question from the static question-bank file
 * into the editable UI format.
 */
function questionBankItemToForm(
  item: QuestionBankItem,
): QuestionForm {
  return {
    id: createId(),

    content: item.content ?? [],

    question: item.question ?? "",
    instruction:
      item.instruction || "Choose the correct answer.",
    topic: item.topic ?? "",
    section: item.section || "objective",

    difficulty: item.difficulty,
    examType: item.examType,

    apiSubjectName: item.apiSubjectName ?? "",

    options: item.options.map((option) => ({
      label: option.label,
      value: option.value,
    })),

    correctAnswers: [...item.correctAnswers],

    isMultipleAnswer: item.isMultipleAnswer,

    explanation: item.explanation ?? "",

    explanationSteps: (
      item.explanationSteps ?? []
    ).map((text, index) => ({
      step: index + 1,
      text,
    })),
  };
}

/* ============================================================
   COMPONENT
============================================================ */

export default function CreateSolveAndWinQuestionsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] =
    useState("");

  const [selectedExamType, setSelectedExamType] =
    useState<ExamType>("jamb");

  const [questions, setQuestions] = useState<
    QuestionForm[]
  >([createEmptyQuestion("", "jamb")]);

  const [loadingSubjects, setLoadingSubjects] =
    useState(true);

  const [loadingQuestionBank, setLoadingQuestionBank] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [pageError, setPageError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* ==========================================================
     SELECTED SUBJECT
  ========================================================== */

  const selectedSubject = useMemo(() => {
    return subjects.find(
      (subject) =>
        subject._id === selectedSubjectId,
    );
  }, [subjects, selectedSubjectId]);

  /* ==========================================================
     LOAD SUBJECTS
  ========================================================== */

  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoadingSubjects(true);
        setPageError("");

        const response = await getSubjectsByPlan(
          "SECONDARY",
          1,
          100,
        );

        const loadedSubjects: Subject[] =
          response?.data?.subjectObj ?? [];

        setSubjects(loadedSubjects);

        if (loadedSubjects.length > 0) {
          const firstSubject =
            loadedSubjects[0];

          setSelectedSubjectId(
            firstSubject._id,
          );

          setQuestions([
            createEmptyQuestion(
              firstSubject.name,
              "jamb",
            ),
          ]);
        }
      } catch (error: any) {
        console.error(
          "Failed to load subjects:",
          error,
        );

        setPageError(
          error?.response?.data?.message ||
            "Unable to load subjects. Please try again.",
        );
      } finally {
        setLoadingSubjects(false);
      }
    }

    loadSubjects();
  }, []);

  /* ==========================================================
     LOAD QUESTION BANK
  ========================================================== */

  function loadSelectedQuestionBank() {
    if (!selectedSubject) {
      setPageError("Please select a subject.");
      return;
    }

    setLoadingQuestionBank(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const bank = getQuestionBank(
        selectedSubject.name,
        selectedExamType,
      );

      if (!bank.length) {
        setQuestions([
          createEmptyQuestion(
            selectedSubject.name,
            selectedExamType,
          ),
        ]);

        setPageError(
          `No ${selectedExamType.toUpperCase()} question bank is available yet for ${selectedSubject.name}.`,
        );

        return;
      }

      const loadedQuestions =
        bank.map(questionBankItemToForm);

      setQuestions(loadedQuestions);

      setSuccessMessage(
        `${loadedQuestions.length} ${selectedSubject.name} ${selectedExamType.toUpperCase()} question${
          loadedQuestions.length === 1
            ? ""
            : "s"
        } loaded from the question bank.`,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Failed to load question bank:",
        error,
      );

      setPageError(
        "Unable to load the selected question bank.",
      );
    } finally {
      setLoadingQuestionBank(false);
    }
  }

  /* ==========================================================
     SELECT SUBJECT
  ========================================================== */

  function handleSubjectChange(
    subjectId: string,
  ) {
    setSelectedSubjectId(subjectId);
    setSuccessMessage("");
    setPageError("");

    const subject = subjects.find(
      (item) => item._id === subjectId,
    );

    if (!subject) return;

    setQuestions([
      createEmptyQuestion(
        subject.name,
        selectedExamType,
      ),
    ]);
  }

  /* ==========================================================
     EXAM TYPE
  ========================================================== */

  function handleExamTypeChange(
    examType: ExamType,
  ) {
    setSelectedExamType(examType);
    setSuccessMessage("");
    setPageError("");

    const subjectName =
      selectedSubject?.name ?? "";

    setQuestions([
      createEmptyQuestion(
        subjectName,
        examType,
      ),
    ]);
  }

  /* ==========================================================
     QUESTION FIELD UPDATE
  ========================================================== */

  function updateQuestion(
    questionId: string,
    field: keyof QuestionForm,
    value: any,
  ) {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              [field]: value,
            }
          : question,
      ),
    );

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     OPTION UPDATE
  ========================================================== */

  function updateOption(
    questionId: string,
    optionIndex: number,
    value: string,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const oldValue =
          question.options[optionIndex]
            ?.value ?? "";

        const updatedOptions = [
          ...question.options,
        ];

        updatedOptions[optionIndex] = {
          ...updatedOptions[optionIndex],
          value,
        };

        const updatedCorrectAnswers =
          question.correctAnswers.map(
            (answer) =>
              answer === oldValue
                ? value
                : answer,
          );

        return {
          ...question,
          options: updatedOptions,
          correctAnswers:
            updatedCorrectAnswers,
        };
      }),
    );

    setSuccessMessage("");
    setPageError("");
  }

  /* ==========================================================
     ADD OPTION
  ========================================================== */

  function addOption(questionId: string) {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        if (
          question.options.length >=
          OPTION_LABELS.length
        ) {
          return question;
        }

        const label =
          OPTION_LABELS[
            question.options.length
          ];

        return {
          ...question,
          options: [
            ...question.options,
            {
              label,
              value: "",
            },
          ],
        };
      }),
    );
  }

  /* ==========================================================
     REMOVE OPTION
  ========================================================== */

  function removeOption(
    questionId: string,
    optionIndex: number,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        if (question.options.length <= 2) {
          return question;
        }

        const removedOption =
          question.options[optionIndex];

        const updatedOptions =
          question.options
            .filter(
              (_, index) =>
                index !== optionIndex,
            )
            .map((option, index) => ({
              ...option,
              label: OPTION_LABELS[index],
            }));

        const updatedCorrectAnswers =
          question.correctAnswers.filter(
            (answer) =>
              answer !== removedOption.value,
          );

        return {
          ...question,
          options: updatedOptions,
          correctAnswers:
            updatedCorrectAnswers,
        };
      }),
    );
  }

  /* ==========================================================
     CORRECT ANSWER
  ========================================================== */

  function toggleCorrectAnswer(
    questionId: string,
    optionValue: string,
  ) {
    if (!optionValue.trim()) return;

    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        if (question.isMultipleAnswer) {
          const exists =
            question.correctAnswers.includes(
              optionValue,
            );

          return {
            ...question,
            correctAnswers: exists
              ? question.correctAnswers.filter(
                  (answer) =>
                    answer !== optionValue,
                )
              : [
                  ...question.correctAnswers,
                  optionValue,
                ],
          };
        }

        return {
          ...question,
          correctAnswers: [optionValue],
        };
      }),
    );

    setSuccessMessage("");
  }

  /* ==========================================================
     MULTIPLE ANSWERS
  ========================================================== */

  function toggleMultipleAnswers(
    questionId: string,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const enableMultiple =
          !question.isMultipleAnswer;

        return {
          ...question,
          isMultipleAnswer:
            enableMultiple,
          correctAnswers: enableMultiple
            ? question.correctAnswers
            : question.correctAnswers.slice(
                0,
                1,
              ),
        };
      }),
    );
  }

  /* ==========================================================
     EXPLANATION STEP
  ========================================================== */

  function addExplanationStep(
    questionId: string,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        return {
          ...question,
          explanationSteps: [
            ...question.explanationSteps,
            {
              step:
                question
                  .explanationSteps
                  .length + 1,
              text: "",
            },
          ],
        };
      }),
    );
  }

  function updateExplanationStep(
    questionId: string,
    stepIndex: number,
    value: string,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        const updatedSteps = [
          ...question.explanationSteps,
        ];

        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          text: value,
        };

        return {
          ...question,
          explanationSteps:
            updatedSteps,
        };
      }),
    );
  }

  function removeExplanationStep(
    questionId: string,
    stepIndex: number,
  ) {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        return {
          ...question,
          explanationSteps:
            question.explanationSteps
              .filter(
                (_, index) =>
                  index !== stepIndex,
              )
              .map((step, index) => ({
                ...step,
                step: index + 1,
              })),
        };
      }),
    );
  }

  /* ==========================================================
     QUESTION MANAGEMENT
  ========================================================== */

  function addQuestion() {
    setQuestions((current) => [
      ...current,
      createEmptyQuestion(
        selectedSubject?.name ?? "",
        selectedExamType,
      ),
    ]);

    setSuccessMessage("");
  }

  function duplicateQuestion(
    questionId: string,
  ) {
    setQuestions((current) => {
      const question = current.find(
        (item) => item.id === questionId,
      );

      if (!question) return current;

      const duplicated: QuestionForm = {
        ...question,
        id: createId(),

        content:
          question.content.map(
            (content) => ({
              ...content,
              segments:
                content.segments.map(
                  (segment) => ({
                    ...segment,
                    styles: [
                      ...segment.styles,
                    ],
                  }),
                ),
              table:
                content.table?.map(
                  (row) => [...row],
                ),
              graph: content.graph
                ? {
                    ...content.graph,
                    labels: [
                      ...content.graph
                        .labels,
                    ],
                    datasets:
                      content.graph.datasets.map(
                        (dataset) => ({
                          ...dataset,
                          data: [
                            ...dataset.data,
                          ],
                        }),
                      ),
                  }
                : undefined,
            }),
          ),

        options:
          question.options.map(
            (option) => ({
              ...option,
            }),
          ),

        correctAnswers: [
          ...question.correctAnswers,
        ],

        explanationSteps:
          question.explanationSteps.map(
            (step) => ({
              ...step,
            }),
          ),
      };

      const index =
        current.findIndex(
          (item) =>
            item.id === questionId,
        );

      const updated = [...current];

      updated.splice(
        index + 1,
        0,
        duplicated,
      );

      return updated;
    });

    setSuccessMessage("");
  }

  function removeQuestion(
    questionId: string,
  ) {
    setQuestions((current) => {
      if (current.length === 1) {
        return current;
      }

      return current.filter(
        (question) =>
          question.id !== questionId,
      );
    });

    setSuccessMessage("");
  }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  function validateQuestions() {
    if (!selectedSubjectId) {
      return "Please select a subject.";
    }

    if (questions.length === 0) {
      return "Please add at least one question.";
    }

    for (
      let index = 0;
      index < questions.length;
      index++
    ) {
      const question = questions[index];
      const number = index + 1;

      if (!question.question.trim()) {
        return `Question ${number}: question text is required.`;
      }

      if (!question.instruction.trim()) {
        return `Question ${number}: instruction is required.`;
      }

      if (!question.topic.trim()) {
        return `Question ${number}: topic is required.`;
      }

      if (
        !question.apiSubjectName.trim()
      ) {
        return `Question ${number}: subject name is required.`;
      }

      const validOptions =
        question.options.filter(
          (option) =>
            option.value.trim(),
        );

      if (validOptions.length < 2) {
        return `Question ${number}: at least two options are required.`;
      }

      if (
        question.correctAnswers.length ===
        0
      ) {
        return `Question ${number}: select at least one correct answer.`;
      }

      const validOptionValues =
        validOptions.map(
          (option) =>
            option.value.trim(),
        );

      const invalidCorrectAnswer =
        question.correctAnswers.some(
          (answer) =>
            !validOptionValues.includes(
              answer.trim(),
            ),
        );

      if (invalidCorrectAnswer) {
        return `Question ${number}: every correct answer must match an option.`;
      }

      if (
        !question.isMultipleAnswer &&
        question.correctAnswers.length > 1
      ) {
        return `Question ${number}: only one correct answer is allowed.`;
      }
    }

    return null;
  }

  /* ==========================================================
     PAYLOAD
  ========================================================== */

  function convertQuestionToPayload(
    question: QuestionForm,
  ) {
    const validOptions =
      question.options
        .filter(
          (option) =>
            option.value.trim(),
        )
        .map((option) => ({
          label: option.label,
          value: option.value.trim(),
        }));

    return {
      content: question.content,

      question:
        question.question.trim(),

      instruction:
        question.instruction.trim(),

      topic: question.topic.trim(),

      section:
        question.section.trim(),

      options: validOptions,

      correctAnswers:
        question.correctAnswers.map(
          (answer) => answer.trim(),
        ),

      explanation:
        question.explanation.trim(),

      explanationSteps:
        question.explanationSteps
          .filter(
            (step) =>
              step.text.trim(),
          )
          .map(
            (step) =>
              step.text.trim(),
          ),

      difficulty:
        question.difficulty,

      examType:
        question.examType,

      apiSubjectName:
        question.apiSubjectName.trim(),

      isMultipleAnswer:
        question.isMultipleAnswer,
    };
  }

  /* ==========================================================
     SUBMIT
  ========================================================== */

  async function handleSubmit() {
    setPageError("");
    setSuccessMessage("");

    const validationError =
      validateQuestions();

    if (validationError) {
      setPageError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!selectedSubjectId) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        questions:
          questions.map(
            convertQuestionToPayload,
          ),
      };

      console.log(
        "Submitting Solve & Win questions:",
        payload,
      );

      const response =
        await axiosInstance.patch(
          `/solve-and-win/contests/add-solve-and-win-contest-questions-to-database/${encodeURIComponent(
            selectedSubjectId,
          )}`,
          payload,
        );

      console.log(
        "Questions saved successfully:",
        response.data,
      );

      setSuccessMessage(
        `${questions.length} question${
          questions.length === 1
            ? ""
            : "s"
        } saved successfully.`,
      );

      setQuestions([
        createEmptyQuestion(
          selectedSubject?.name ?? "",
          selectedExamType,
        ),
      ]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      console.error(
        "Failed to save questions:",
        error,
      );

      const message =
        error?.response?.data
          ?.message ||
        error?.response?.data?.error ||
        "Unable to save questions. Please try again.";

      setPageError(
        Array.isArray(message)
          ? message.join(", ")
          : message,
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
     PAYLOAD PREVIEW
  ========================================================== */

  const payloadPreview = useMemo(() => {
    return {
      questions:
        questions.map(
          convertQuestionToPayload,
        ),
    };
  }, [questions]);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8">
          <Link
            href="/admin/secondary/solveandwin/competitions"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <FileText className="h-5 w-5 text-white" />
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300">
                  Solve & Win
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Create Questions
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Load questions from the subject
                question bank, edit them, add new
                questions, and send them to the
                Solve & Win database.
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              disabled={
                loadingSubjects ||
                saving
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </button>
          </div>
        </div>

        {/* ====================================================
            ALERTS
        ==================================================== */}

        {pageError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
            <X className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">
                Something went wrong
              </p>

              <p className="mt-1 text-red-200/80">
                {pageError}
              </p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            <Check className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">
                Success
              </p>

              <p className="mt-1 text-emerald-200/80">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* ====================================================
            SUBJECT + EXAM TYPE
        ==================================================== */}

        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-black">
                Question Bank
              </h2>

              <p className="text-xs text-slate-400">
                Select a subject and exam type,
                then load its question file.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* SUBJECT */}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Subject
              </label>

              <div className="relative">
                <select
                  value={
                    selectedSubjectId
                  }
                  onChange={(event) =>
                    handleSubjectChange(
                      event.target.value,
                    )
                  }
                  disabled={
                    loadingSubjects ||
                    saving
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingSubjects ? (
                    <option value="">
                      Loading subjects...
                    </option>
                  ) : subjects.length ===
                    0 ? (
                    <option value="">
                      No subjects found
                    </option>
                  ) : (
                    <>
                      <option value="">
                        Select a subject
                      </option>

                      {subjects.map(
                        (subject) => (
                          <option
                            key={
                              subject._id
                            }
                            value={
                              subject._id
                            }
                          >
                            {subject.name}
                          </option>
                        ),
                      )}
                    </>
                  )}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* EXAM TYPE */}

            <div>
              <label className="mb-2 block text-sm font-bold">
                Exam Type
              </label>

              <div className="relative">
                <select
                  value={
                    selectedExamType
                  }
                  onChange={(event) =>
                    handleExamTypeChange(
                      event.target
                        .value as ExamType,
                    )
                  }
                  disabled={saving}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="jamb">
                    JAMB
                  </option>

                  <option value="waec">
                    WAEC
                  </option>

                  <option value="neco">
                    NECO
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* LOAD BANK BUTTON */}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              {selectedSubject
                ? `${selectedSubject.name} • ${selectedExamType.toUpperCase()}`
                : "Select a subject"}
            </div>

            <button
              type="button"
              onClick={
                loadSelectedQuestionBank
              }
              disabled={
                loadingSubjects ||
                loadingQuestionBank ||
                saving ||
                !selectedSubjectId
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingQuestionBank ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading Questions...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  Load Question Bank
                </>
              )}
            </button>
          </div>
        </div>

        {/* ====================================================
            QUESTIONS
        ==================================================== */}

        <div className="space-y-8">
          {questions.map(
            (
              question,
              questionIndex,
            ) => (
              <div
                key={question.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl"
              >
                {/* QUESTION HEADER */}

                <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                      {questionIndex + 1}
                    </span>

                    <div>
                      <h2 className="font-black">
                        Question{" "}
                        {questionIndex + 1}
                      </h2>

                      <p className="text-xs text-slate-500">
                        {question.apiSubjectName ||
                          "No subject selected"}{" "}
                        •{" "}
                        {question.examType.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        duplicateQuestion(
                          question.id,
                        )
                      }
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeQuestion(
                          question.id,
                        )
                      }
                      disabled={
                        saving ||
                        questions.length ===
                          1
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-500/5 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="space-y-7 p-5 sm:p-6">

                  {/* QUESTION */}

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Question
                    </label>

                    <textarea
                      value={
                        question.question
                      }
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          "question",
                          event.target
                            .value,
                        )
                      }
                      rows={5}
                      placeholder="Enter the question..."
                      className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                    />
                  </div>

                  {/* BASIC DETAILS */}

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Instruction
                      </label>

                      <input
                        value={
                          question.instruction
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "instruction",
                            event.target
                              .value,
                          )
                        }
                        placeholder="Choose the correct answer."
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Topic
                      </label>

                      <input
                        value={
                          question.topic
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "topic",
                            event.target
                              .value,
                          )
                        }
                        placeholder="e.g. Cell Biology"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                      />
                    </div>
                  </div>

                  {/* META */}

                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Difficulty
                      </label>

                      <select
                        value={
                          question.difficulty
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "difficulty",
                            event.target
                              .value as Difficulty,
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                      >
                        <option value="easy">
                          Easy
                        </option>

                        <option value="medium">
                          Medium
                        </option>

                        <option value="hard">
                          Hard
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Exam Type
                      </label>

                      <select
                        value={
                          question.examType
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "examType",
                            event.target
                              .value as ExamType,
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                      >
                        <option value="jamb">
                          JAMB
                        </option>

                        <option value="waec">
                          WAEC
                        </option>

                        <option value="neco">
                          NECO
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Section
                      </label>

                      <input
                        value={
                          question.section
                        }
                        onChange={(event) =>
                          updateQuestion(
                            question.id,
                            "section",
                            event.target
                              .value,
                          )
                        }
                        placeholder="objective"
                        className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                      />
                    </div>
                  </div>

                  {/* OPTIONS */}

                  <div>
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-black">
                          Answer Options
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Click an option letter to
                          mark it as correct.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          addOption(
                            question.id,
                          )
                        }
                        disabled={
                          question.options
                            .length >=
                          OPTION_LABELS.length
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                        Add Option
                      </button>
                    </div>

                    <div className="space-y-3">
                      {question.options.map(
                        (
                          option,
                          optionIndex,
                        ) => {
                          const isCorrect =
                            question.correctAnswers.includes(
                              option.value,
                            );

                          return (
                            <div
                              key={`${question.id}-${option.label}`}
                              className={`flex gap-3 rounded-2xl border p-3 transition ${
                                isCorrect
                                  ? "border-emerald-400/40 bg-emerald-500/5"
                                  : "border-white/10 bg-slate-900"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  toggleCorrectAnswer(
                                    question.id,
                                    option.value,
                                  )
                                }
                                disabled={
                                  !option.value.trim()
                                }
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black transition ${
                                  isCorrect
                                    ? "bg-emerald-500 text-white"
                                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                {isCorrect ? (
                                  <Check className="h-5 w-5" />
                                ) : (
                                  option.label
                                )}
                              </button>

                              <input
                                value={
                                  option.value
                                }
                                onChange={(
                                  event,
                                ) =>
                                  updateOption(
                                    question.id,
                                    optionIndex,
                                    event.target
                                      .value,
                                  )
                                }
                                placeholder={`Option ${option.label}`}
                                className="min-w-0 flex-1 bg-transparent px-1 text-sm text-white outline-none placeholder:text-slate-600"
                              />

                              {question
                                .options
                                .length >
                                2 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeOption(
                                      question.id,
                                      optionIndex,
                                    )
                                  }
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>

                    <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <input
                        type="checkbox"
                        checked={
                          question.isMultipleAnswer
                        }
                        onChange={() =>
                          toggleMultipleAnswers(
                            question.id,
                          )
                        }
                        className="h-4 w-4 rounded border-white/20"
                      />

                      <div>
                        <p className="text-sm font-bold">
                          Allow multiple correct answers
                        </p>

                        <p className="text-xs text-slate-500">
                          Enable this only when more than
                          one option should be correct.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* EXPLANATION */}

                  <div>
                    <label className="mb-2 block text-sm font-bold">
                      Explanation
                    </label>

                    <textarea
                      value={
                        question.explanation
                      }
                      onChange={(event) =>
                        updateQuestion(
                          question.id,
                          "explanation",
                          event.target
                            .value,
                        )
                      }
                      rows={4}
                      placeholder="Explain why the correct answer is correct..."
                      className="w-full resize-y rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                    />

                    <div className="mt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold">
                            Explanation Steps
                          </p>

                          <p className="text-xs text-slate-500">
                            Optional step-by-step explanation.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addExplanationStep(
                              question.id,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          <Plus className="h-4 w-4" />
                          Add Step
                        </button>
                      </div>

                      {question
                        .explanationSteps
                        .length > 0 && (
                        <div className="space-y-3">
                          {question.explanationSteps.map(
                            (
                              step,
                              stepIndex,
                            ) => (
                              <div
                                key={`${question.id}-step-${stepIndex}`}
                                className="flex gap-3"
                              >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-black text-slate-400">
                                  {stepIndex +
                                    1}
                                </div>

                                <input
                                  value={
                                    step.text
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    updateExplanationStep(
                                      question.id,
                                      stepIndex,
                                      event
                                        .target
                                        .value,
                                    )
                                  }
                                  placeholder={`Explanation step ${
                                    stepIndex +
                                    1
                                  }`}
                                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/30"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeExplanationStep(
                                      question.id,
                                      stepIndex,
                                    )
                                  }
                                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* ====================================================
            PAYLOAD PREVIEW
        ==================================================== */}

        <details className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-black/20">
          <summary className="cursor-pointer select-none px-5 py-4 text-sm font-bold text-slate-300 hover:text-white">
            Preview API Payload
          </summary>

          <pre className="max-h-[500px] overflow-auto border-t border-white/10 p-5 text-xs leading-6 text-slate-400">
            {JSON.stringify(
              payloadPreview,
              null,
              2,
            )}
          </pre>
        </details>

        {/* ====================================================
            BOTTOM ACTIONS
        ==================================================== */}

        <div className="sticky bottom-4 z-20 mt-8">
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div className="px-2 text-xs text-slate-500">
              {questions.length} question
              {questions.length === 1
                ? ""
                : "s"} ready to save
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={addQuestion}
                disabled={saving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 disabled:opacity-50 sm:flex-none"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  saving ||
                  loadingSubjects ||
                  !selectedSubjectId
                }
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Questions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
