






// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AlertCircle,
//   ArrowLeft,
//   CheckCircle2,
//   Clock3,
//   Loader2,
//   Save,
//   Trophy,
//   Users,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// import { getSubjectsByPlan } from "@/lib/api/subjects";
// import { axiosInstance } from "@/lib/api/axios";

// type Subject = {
//   _id: string;
//   name?: string;
//   code?: string;
// };

// type DifficultyBreakdown = {
//   easy: number;
//   medium: number;
//   hard: number;
// };

// type EliminationRound = {
//   round_number: number;
//   no_of_questions: number;
//   difficultyBreakdown: DifficultyBreakdown;
//   exit_number: number;
//   exit_reward: number;
// };

// type FinalRound = {
//   no_of_questions: number;
//   difficultyBreakdown: DifficultyBreakdown;
// };

// type FormState = {
//   quiz_title: string;
//   description: string;
//   subject: string;
//   time_per_question: number;
//   start_date: string;
//   no_of_contestants: number;
//   number_of_rounds: number;
//   status: string;
//   first_position_reward: number;
//   second_position_reward: number;
// };

// const DEFAULT_FORM: FormState = {
//   quiz_title: "",
//   description: "",
//   subject: "",
//   time_per_question: 20,
//   start_date: "",
//   no_of_contestants: 20,
//   number_of_rounds: 5,
//   status: "DRAFT",
//   first_position_reward: 100,
//   second_position_reward: 50,
// };

// const DEFAULT_DIFFICULTY: DifficultyBreakdown = {
//   easy: 0,
//   medium: 0,
//   hard: 0,
// };

// function createEliminationRound(
//   roundNumber: number,
// ): EliminationRound {
//   return {
//     round_number: roundNumber,
//     no_of_questions: 10,
//     difficultyBreakdown: {
//       easy: 4,
//       medium: 4,
//       hard: 2,
//     },
//     exit_number: 5,
//     exit_reward: roundNumber * 5,
//   };
// }

// function createFinalRound(): FinalRound {
//   return {
//     no_of_questions: 10,
//     difficultyBreakdown: {
//       easy: 2,
//       medium: 3,
//       hard: 5,
//     },
//   };
// }

// function getDifficultyTotal(
//   difficulty: DifficultyBreakdown,
// ) {
//   return (
//     Number(difficulty.easy || 0) +
//     Number(difficulty.medium || 0) +
//     Number(difficulty.hard || 0)
//   );
// }

// function formatDateTimeLocal(
//   value: string,
// ) {
//   if (!value) return "";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "";
//   }

//   const pad = (number: number) =>
//     String(number).padStart(2, "0");

//   return `${date.getFullYear()}-${pad(
//     date.getMonth() + 1,
//   )}-${pad(date.getDate())}T${pad(
//     date.getHours(),
//   )}:${pad(date.getMinutes())}`;
// }

// export default function CreateQuizCompetitionPage() {
//   const router = useRouter();

//   const [form, setForm] =
//     useState<FormState>(DEFAULT_FORM);

//   const [subjects, setSubjects] = useState<
//     Subject[]
//   >([]);

//   const [loadingSubjects, setLoadingSubjects] =
//     useState(true);

//   const [saving, setSaving] = useState(false);

//   const [error, setError] =
//     useState<string | null>(null);

//   const [success, setSuccess] =
//     useState<string | null>(null);

//   const [rounds, setRounds] = useState<
//     EliminationRound[]
//   >([]);

//   const [finalRound, setFinalRound] =
//     useState<FinalRound>(createFinalRound());

//   /*
//    * Load subjects
//    */
//   useEffect(() => {
//     let mounted = true;

//     const loadSubjects = async () => {
//       try {
//         setLoadingSubjects(true);

//         const response = await getSubjectsByPlan(
//   "SECONDARY",
//   1,
//   100,
// );

// if (!mounted) return;

// setSubjects(response?.data?.subjectObj ?? []);

//       } catch (err) {
//         console.error(
//           "Failed to load subjects:",
//           err,
//         );

//         if (mounted) {
//           setSubjects([]);
//           setError(
//             "Unable to load subjects. Please refresh the page and try again.",
//           );
//         }
//       } finally {
//         if (mounted) {
//           setLoadingSubjects(false);
//         }
//       }
//     };

//     loadSubjects();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   /*
//    * number_of_rounds includes the final round.
//    *
//    * Example:
//    * 5 total rounds
//    * = 4 elimination rounds
//    * + 1 final round
//    */
//   useEffect(() => {
//     const totalRounds = Math.max(
//       1,
//       Number(form.number_of_rounds || 1),
//     );

//     const eliminationCount =
//       Math.max(0, totalRounds - 1);

//     setRounds((previousRounds) => {
//       const nextRounds: EliminationRound[] = [];

//       for (
//         let index = 0;
//         index < eliminationCount;
//         index++
//       ) {
//         const roundNumber = index + 1;

//         const existing =
//           previousRounds.find(
//             (round) =>
//               round.round_number ===
//               roundNumber,
//           );

//         nextRounds.push(
//           existing ??
//             createEliminationRound(
//               roundNumber,
//             ),
//         );
//       }

//       return nextRounds;
//     });
//   }, [form.number_of_rounds]);

//   const selectedSubject = useMemo(
//     () =>
//       subjects.find(
//         (subject) =>
//           String(subject._id) ===
//           String(form.subject),
//       ),
//     [subjects, form.subject],
//   );

//   const totalEliminationQuestions =
//     useMemo(
//       () =>
//         rounds.reduce(
//           (total, round) =>
//             total +
//             Number(
//               round.no_of_questions || 0,
//             ),
//           0,
//         ),
//       [rounds],
//     );

//   const totalQuestions = useMemo(
//     () =>
//       totalEliminationQuestions +
//       Number(
//         finalRound.no_of_questions || 0,
//       ),
//     [
//       totalEliminationQuestions,
//       finalRound.no_of_questions,
//     ],
//   );

//   const eliminationExitTotal = useMemo(
//     () =>
//       rounds.reduce(
//         (total, round) =>
//           total +
//           Number(round.exit_number || 0),
//         0,
//       ),
//     [rounds],
//   );

//   const remainingAfterExits = useMemo(
//     () =>
//       Number(form.no_of_contestants || 0) -
//       eliminationExitTotal,
//     [
//       form.no_of_contestants,
//       eliminationExitTotal,
//     ],
//   );

//   /*
//    * Generic form updater
//    */
//   const updateForm = <
//     K extends keyof FormState,
//   >(
//     key: K,
//     value: FormState[K],
//   ) => {
//     setForm((previous) => ({
//       ...previous,
//       [key]: value,
//     }));

//     setError(null);
//     setSuccess(null);
//   };

//   /*
//    * Update elimination round
//    */
//   const updateRound = (
//     roundNumber: number,
//     updates: Partial<EliminationRound>,
//   ) => {
//     setRounds((previous) =>
//       previous.map((round) =>
//         round.round_number ===
//         roundNumber
//           ? {
//               ...round,
//               ...updates,
//             }
//           : round,
//       ),
//     );

//     setError(null);
//     setSuccess(null);
//   };

//   /*
//    * Update difficulty
//    */
//   const updateRoundDifficulty = (
//     roundNumber: number,
//     difficulty: keyof DifficultyBreakdown,
//     value: number,
//   ) => {
//     setRounds((previous) =>
//       previous.map((round) =>
//         round.round_number ===
//         roundNumber
//           ? {
//               ...round,
//               difficultyBreakdown: {
//                 ...round.difficultyBreakdown,
//                 [difficulty]: Math.max(
//                   0,
//                   Number(value || 0),
//                 ),
//               },
//             }
//           : round,
//       ),
//     );

//     setError(null);
//     setSuccess(null);
//   };

//   /*
//    * Update final difficulty
//    */
//   const updateFinalDifficulty = (
//     difficulty: keyof DifficultyBreakdown,
//     value: number,
//   ) => {
//     setFinalRound((previous) => ({
//       ...previous,
//       difficultyBreakdown: {
//         ...previous.difficultyBreakdown,
//         [difficulty]: Math.max(
//           0,
//           Number(value || 0),
//         ),
//       },
//     }));

//     setError(null);
//     setSuccess(null);
//   };

//   /*
//    * Validate form before submission
//    */
//   const validateForm = (): string | null => {
//     if (!form.quiz_title.trim()) {
//       return "Quiz title is required.";
//     }

//     if (!form.description.trim()) {
//       return "Description is required.";
//     }

//     if (!form.subject) {
//       return "Please select a subject.";
//     }

//     if (
//       !Number.isFinite(
//         Number(form.time_per_question),
//       ) ||
//       Number(form.time_per_question) <= 0
//     ) {
//       return "Time per question must be greater than 0.";
//     }

//     if (!form.start_date) {
//       return "Please select a start date and time.";
//     }

//     const startDate = new Date(
//       form.start_date,
//     );

//     if (Number.isNaN(startDate.getTime())) {
//       return "Please provide a valid start date.";
//     }

//     if (
//       Number(form.no_of_contestants) < 2
//     ) {
//       return "There must be at least 2 contestants.";
//     }

//     if (
//       Number(form.number_of_rounds) < 1
//     ) {
//       return "There must be at least 1 round.";
//     }

//     /*
//      * Validate elimination rounds.
//      */
//     for (const round of rounds) {
//       const questionCount = Number(
//         round.no_of_questions || 0,
//       );

//       const difficultyTotal =
//         getDifficultyTotal(
//           round.difficultyBreakdown,
//         );

//       if (questionCount <= 0) {
//         return `Round ${round.round_number} must have at least 1 question.`;
//       }

//       if (
//         difficultyTotal !==
//         questionCount
//       ) {
//         return `Round ${round.round_number}: Easy + Medium + Hard must equal the number of questions (${questionCount}).`;
//       }

//       if (
//         Number(round.exit_number || 0) <
//         0
//       ) {
//         return `Round ${round.round_number}: exit number cannot be negative.`;
//       }

//       if (
//         Number(round.exit_number || 0) >
//         Number(form.no_of_contestants || 0)
//       ) {
//         return `Round ${round.round_number}: exit number cannot exceed the number of contestants.`;
//       }

//       if (
//         Number(round.exit_reward || 0) <
//         0
//       ) {
//         return `Round ${round.round_number}: exit reward cannot be negative.`;
//       }
//     }

//     /*
//      * Validate total eliminations.
//      */
//     if (
//       eliminationExitTotal >=
//         Number(form.no_of_contestants || 0) &&
//       rounds.length > 0
//     ) {
//       return "The elimination rounds cannot remove all contestants before the final round.";
//     }

//     /*
//      * Validate final round.
//      */
//     const finalQuestionCount = Number(
//       finalRound.no_of_questions || 0,
//     );

//     const finalDifficultyTotal =
//       getDifficultyTotal(
//         finalRound.difficultyBreakdown,
//       );

//     if (finalQuestionCount <= 0) {
//       return "Final round must have at least 1 question.";
//     }

//     if (
//       finalDifficultyTotal !==
//       finalQuestionCount
//     ) {
//       return `Final Round: Easy + Medium + Hard must equal the number of questions (${finalQuestionCount}).`;
//     }

//     /*
//      * First place must be greater than second place.
//      */
//     if (
//       Number(form.first_position_reward) <
//       0
//     ) {
//       return "First position reward cannot be negative.";
//     }

//     if (
//       Number(form.second_position_reward) <
//       0
//     ) {
//       return "Second position reward cannot be negative.";
//     }

//     if (
//       Number(form.first_position_reward) <
//       Number(form.second_position_reward)
//     ) {
//       return "First position reward should be greater than or equal to second position reward.";
//     }

//     return null;
//   };

//   /*
//    * Submit
//    */
//   const handleSubmit = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();

//     setError(null);
//     setSuccess(null);

//     const validationError =
//       validateForm();

//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     try {
//       setSaving(true);

//       const startsAt = new Date(
//         form.start_date,
//       );

//       /*
//        * Exact backend payload.
//        *
//        * IMPORTANT:
//        * number_of_rounds includes the final round.
//        *
//        * round_information contains ONLY
//        * elimination rounds.
//        *
//        * final_round_information contains
//        * the final round.
//        */
//       const payload = {
//         quiz_title: form.quiz_title.trim(),

//         description:
//           form.description.trim(),

//         subject: form.subject,

//         time_per_question: Number(
//           form.time_per_question,
//         ),

//         start_date:
//           startsAt.toISOString(),

//         no_of_contestants: Number(
//           form.no_of_contestants,
//         ),

//         number_of_rounds: Number(
//           form.number_of_rounds,
//         ),

//         status: form.status,

//         round_information:
//           rounds.map((round) => ({
//             round_number:
//               round.round_number,

//             no_of_questions: Number(
//               round.no_of_questions,
//             ),

//             difficultyBreakdown: {
//               easy: Number(
//                 round
//                   .difficultyBreakdown
//                   .easy,
//               ),
//               medium: Number(
//                 round
//                   .difficultyBreakdown
//                   .medium,
//               ),
//               hard: Number(
//                 round
//                   .difficultyBreakdown
//                   .hard,
//               ),
//             },

//             exit_number: Number(
//               round.exit_number,
//             ),

//             exit_reward: Number(
//               round.exit_reward,
//             ),
//           })),

//         final_round_information: {
//           no_of_questions: Number(
//             finalRound.no_of_questions,
//           ),

//           difficultyBreakdown: {
//             easy: Number(
//               finalRound
//                 .difficultyBreakdown
//                 .easy,
//             ),
//             medium: Number(
//               finalRound
//                 .difficultyBreakdown
//                 .medium,
//             ),
//             hard: Number(
//               finalRound
//                 .difficultyBreakdown
//                 .hard,
//             ),
//           },

//           first_position_reward:
//             Number(
//               form.first_position_reward,
//             ),

//           second_position_reward:
//             Number(
//               form.second_position_reward,
//             ),
//         },
//       };

//       console.log(
//         "Creating quiz competition:",
//         payload,
//       );

//       const response =
//         await axiosInstance.post(
//           "/quiz-board/quiz-competitions",
//           payload,
//         );

//       console.log(
//         "Quiz competition created:",
//         response.data,
//       );

//       setSuccess(
//         "Quiz competition created successfully.",
//       );

//       /*
//        * Give the success message a moment
//        * before navigating.
//        */
//       setTimeout(() => {
//         router.push(
//           "/admin/secondary/quiz-board/quiz-competitions",
//         );
//       }, 800);
//     } catch (err: any) {
//       console.error(
//         "Failed to create quiz competition:",
//         err,
//       );

//       const backendMessage =
//         err?.response?.data?.message;

//       const backendError =
//         err?.response?.data?.error;

//       setError(
//         backendMessage ||
//           backendError ||
//           "Failed to create quiz competition. Please check the form and try again.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-start gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               size="icon"
//               onClick={() =>
//                 router.back()
//               }
//               className="mt-1 shrink-0"
//             >
//               <ArrowLeft className="h-4 w-4" />
//             </Button>

//             <div>
//               <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//                 Create Quiz Competition
//               </h1>

//               <p className="mt-1 text-sm text-slate-500">
//                 Configure the quiz board,
//                 elimination rounds and
//                 final championship round.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Alerts */}
//         {error && (
//           <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//             <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

//             <div>
//               <p className="font-semibold">
//                 Unable to continue
//               </p>

//               <p className="mt-1">
//                 {error}
//               </p>
//             </div>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
//             <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

//             <div>
//               <p className="font-semibold">
//                 Success
//               </p>

//               <p className="mt-1">
//                 {success}
//               </p>
//             </div>
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6"
//         >

        
//           {/* Basic Information */}
//           <Card className="p-6">
//             <div className="mb-6">
//               <h2 className="text-lg font-semibold text-slate-900">
//                 Basic Information
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Set the main details for the
//                 competition.
//               </p>
//             </div>

//             <div className="grid gap-5 md:grid-cols-2">
//               {/* Title */}
//               <div className="md:col-span-2">
//                 <label
//                   htmlFor="quiz_title"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Quiz Title
//                 </label>

//                 <input
//                   id="quiz_title"
//                   type="text"
//                   value={form.quiz_title}
//                   onChange={(event) =>
//                     updateForm(
//                       "quiz_title",
//                       event.target.value,
//                     )
//                   }
//                   placeholder="e.g. Biology Elimination Championship"
//                   className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               {/* Description */}
//               <div className="md:col-span-2">
//                 <label
//                   htmlFor="description"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Description
//                 </label>

//                 <textarea
//                   id="description"
//                   value={form.description}
//                   onChange={(event) =>
//                     updateForm(
//                       "description",
//                       event.target.value,
//                     )
//                   }
//                   rows={4}
//                   placeholder="Describe the competition..."
//                   className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>

//               {/* Subject */}
//               <div>
//                 <label
//                   htmlFor="subject"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Subject
//                 </label>

//                 <select
//                   id="subject"
//                   value={form.subject}
//                   onChange={(event) =>
//                     updateForm(
//                       "subject",
//                       event.target.value,
//                     )
//                   }
//                   disabled={loadingSubjects}
//                   className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
//                 >
//                   <option value="">
//                     {loadingSubjects
//                       ? "Loading subjects..."
//                       : "Select subject"}
//                   </option>

//                   {subjects.map(
//                     (subject) => (
//                       <option
//                         key={String(
//                           subject._id,
//                         )}
//                         value={String(
//                           subject._id,
//                         )}
//                       >
//                         {subject.name ??
//                           "Unnamed subject"}
//                       </option>
//                     ),
//                   )}
//                 </select>

//                 {selectedSubject && (
//                   <p className="mt-2 text-xs text-slate-500">
//                     Selected:{" "}
//                     {selectedSubject.name}
//                   </p>
//                 )}
//               </div>

//               {/* Status */}
//               <div>
//                 <label
//                   htmlFor="status"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Status
//                 </label>

//                 <select
//                   id="status"
//                   value={form.status}
//                   onChange={(event) =>
//                     updateForm(
//                       "status",
//                       event.target.value,
//                     )
//                   }
//                   className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 >
//                   <option value="DRAFT">
//                     Draft
//                   </option>

//                   <option value="PUBLISHED">
//                     Published
//                   </option>
//                 </select>
//               </div>

//               {/* Time */}
//               <div>
//                 <label
//                   htmlFor="time_per_question"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Time Per Question
//                 </label>

//                 <div className="relative">
//                   <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                   <input
//                     id="time_per_question"
//                     type="number"
//                     min={1}
//                     value={
//                       form.time_per_question
//                     }
//                     onChange={(event) =>
//                       updateForm(
//                         "time_per_question",
//                         Number(
//                           event.target.value,
//                         ),
//                       )
//                     }
//                     className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                   />
//                 </div>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Seconds allowed for each
//                   question.
//                 </p>
//               </div>

//               {/* Contestants */}
//               <div>
//                 <label
//                   htmlFor="no_of_contestants"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Number of Contestants
//                 </label>

//                 <div className="relative">
//                   <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                   <input
//                     id="no_of_contestants"
//                     type="number"
//                     min={2}
//                     value={
//                       form.no_of_contestants
//                     }
//                     onChange={(event) =>
//                       updateForm(
//                         "no_of_contestants",
//                         Number(
//                           event.target.value,
//                         ),
//                       )
//                     }
//                     className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                   />
//                 </div>
//               </div>

//               {/* Total rounds */}
//               <div>
//                 <label
//                   htmlFor="number_of_rounds"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Total Number of Rounds
//                 </label>

//                 <input
//                   id="number_of_rounds"
//                   type="number"
//                   min={1}
//                   value={
//                     form.number_of_rounds
//                   }
//                   onChange={(event) =>
//                     updateForm(
//                       "number_of_rounds",
//                       Math.max(
//                         1,
//                         Number(
//                           event.target.value,
//                         ),
//                       ),
//                     )
//                   }
//                   className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 />

//                 <p className="mt-1 text-xs text-slate-500">
//                   Includes the Final Round.
//                   Therefore, 5 means 4
//                   elimination rounds + 1
//                   final.
//                 </p>
//               </div>

//               {/* Start date */}
//               <div>
//                 <label
//                   htmlFor="start_date"
//                   className="mb-2 block text-sm font-medium text-slate-700"
//                 >
//                   Start Date & Time
//                 </label>

//                 <input
//                   id="start_date"
//                   type="datetime-local"
//                   value={formatDateTimeLocal(
//                     form.start_date,
//                   )}
//                   onChange={(event) =>
//                     updateForm(
//                       "start_date",
//                       event.target.value,
//                     )
//                   }
//                   className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                 />
//               </div>
//             </div>
//           </Card>

//           {/* Competition Summary */}
//           <Card className="p-6">
//             <div className="mb-5">
//               <h2 className="text-lg font-semibold text-slate-900">
//                 Competition Summary
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Overview of the competition
//                 structure.
//               </p>
//             </div>

//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                   Total Rounds
//                 </p>

//                 <p className="mt-2 text-2xl font-bold text-slate-900">
//                   {form.number_of_rounds}
//                 </p>
//               </div>

//               <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                   Elimination Rounds
//                 </p>

//                 <p className="mt-2 text-2xl font-bold text-slate-900">
//                   {rounds.length}
//                 </p>
//               </div>

//               <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                   Total Questions
//                 </p>

//                 <p className="mt-2 text-2xl font-bold text-slate-900">
//                   {totalQuestions}
//                 </p>
//               </div>

//               <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                   Contestants Remaining
//                 </p>

//                 <p
//                   className={`mt-2 text-2xl font-bold ${
//                     remainingAfterExits > 0
//                       ? "text-slate-900"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {remainingAfterExits}
//                 </p>
//               </div>
//             </div>
//           </Card>

//           {/* Elimination Rounds */}
//           {rounds.length > 0 && (
//             <div className="space-y-6">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900">
//                   Elimination Rounds
//                 </h2>

//                 <p className="mt-1 text-sm text-slate-500">
//                   Configure each elimination
//                   round. The final round is
//                   configured separately below.
//                 </p>
//               </div>

//               {rounds.map((round) => {
//                 const difficultyTotal =
//                   getDifficultyTotal(
//                     round.difficultyBreakdown,
//                   );

//                 const isValid =
//                   difficultyTotal ===
//                   Number(
//                     round.no_of_questions,
//                   );

//                 return (
//                   <Card
//                     key={round.round_number}
//                     className="overflow-hidden"
//                   >
//                     <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
//                       <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                         <div>
//                           <h3 className="text-lg font-semibold text-slate-900">
//                             Round{" "}
//                             {
//                               round.round_number
//                             }
//                           </h3>

//                           <p className="text-sm text-slate-500">
//                             Elimination round
//                           </p>
//                         </div>

//                         <div
//                           className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                             isValid
//                               ? "bg-emerald-100 text-emerald-700"
//                               : "bg-red-100 text-red-700"
//                           }`}
//                         >
//                           {difficultyTotal} /{" "}
//                           {
//                             round.no_of_questions
//                           }{" "}
//                           questions
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-6 p-6">
//                       {/* Questions */}
//                       <div className="grid gap-5 md:grid-cols-3">
//                         <div>
//                           <label className="mb-2 block text-sm font-medium text-slate-700">
//                             Number of Questions
//                           </label>

//                           <input
//                             type="number"
//                             min={1}
//                             value={
//                               round.no_of_questions
//                             }
//                             onChange={(event) =>
//                               updateRound(
//                                 round.round_number,
//                                 {
//                                   no_of_questions:
//                                     Math.max(
//                                       1,
//                                       Number(
//                                         event
//                                           .target
//                                           .value,
//                                       ),
//                                     ),
//                                 },
//                               )
//                             }
//                             className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                           />
//                         </div>

//                         <div>
//                           <label className="mb-2 block text-sm font-medium text-slate-700">
//                             Exit Number
//                           </label>

//                           <input
//                             type="number"
//                             min={0}
//                             value={
//                               round.exit_number
//                             }
//                             onChange={(event) =>
//                               updateRound(
//                                 round.round_number,
//                                 {
//                                   exit_number:
//                                     Math.max(
//                                       0,
//                                       Number(
//                                         event
//                                           .target
//                                           .value,
//                                       ),
//                                     ),
//                                 },
//                               )
//                             }
//                             className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                           />

//                           <p className="mt-1 text-xs text-slate-500">
//                             Contestants removed
//                             after this round.
//                           </p>
//                         </div>

//                         <div>
//                           <label className="mb-2 block text-sm font-medium text-slate-700">
//                             Exit Reward
//                           </label>

//                           <input
//                             type="number"
//                             min={0}
//                             value={
//                               round.exit_reward
//                             }
//                             onChange={(event) =>
//                               updateRound(
//                                 round.round_number,
//                                 {
//                                   exit_reward:
//                                     Math.max(
//                                       0,
//                                       Number(
//                                         event
//                                           .target
//                                           .value,
//                                       ),
//                                     ),
//                                 },
//                               )
//                             }
//                             className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                           />

//                           <p className="mt-1 text-xs text-slate-500">
//                             Reward for contestants
//                             exiting at this stage.
//                           </p>
//                         </div>
//                       </div>

//                       {/* Difficulty */}
//                       <div>
//                         <div className="mb-3 flex items-center justify-between">
//                           <div>
//                             <h4 className="text-sm font-semibold text-slate-900">
//                               Difficulty Breakdown
//                             </h4>

//                             <p className="text-xs text-slate-500">
//                               Must equal the total
//                               number of questions.
//                             </p>
//                           </div>

//                           <span
//                             className={`text-sm font-semibold ${
//                               isValid
//                                 ? "text-emerald-600"
//                                 : "text-red-600"
//                             }`}
//                           >
//                             Total:{" "}
//                             {difficultyTotal}
//                           </span>
//                         </div>

//                         <div className="grid gap-4 sm:grid-cols-3">
//                           {/* Easy */}
//                           <div className="rounded-lg border border-slate-200 p-4">
//                             <label className="mb-2 block text-sm font-medium text-slate-700">
//                               Easy
//                             </label>

//                             <input
//                               type="number"
//                               min={0}
//                               value={
//                                 round
//                                   .difficultyBreakdown
//                                   .easy
//                               }
//                               onChange={(event) =>
//                                 updateRoundDifficulty(
//                                   round.round_number,
//                                   "easy",
//                                   Number(
//                                     event.target
//                                       .value,
//                                   ),
//                                 )
//                               }
//                               className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                             />
//                           </div>

//                           {/* Medium */}
//                           <div className="rounded-lg border border-slate-200 p-4">
//                             <label className="mb-2 block text-sm font-medium text-slate-700">
//                               Medium
//                             </label>

//                             <input
//                               type="number"
//                               min={0}
//                               value={
//                                 round
//                                   .difficultyBreakdown
//                                   .medium
//                               }
//                               onChange={(event) =>
//                                 updateRoundDifficulty(
//                                   round.round_number,
//                                   "medium",
//                                   Number(
//                                     event.target
//                                       .value,
//                                   ),
//                                 )
//                               }
//                               className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                             />
//                           </div>

//                           {/* Hard */}
//                           <div className="rounded-lg border border-slate-200 p-4">
//                             <label className="mb-2 block text-sm font-medium text-slate-700">
//                               Hard
//                             </label>

//                             <input
//                               type="number"
//                               min={0}
//                               value={
//                                 round
//                                   .difficultyBreakdown
//                                   .hard
//                               }
//                               onChange={(event) =>
//                                 updateRoundDifficulty(
//                                   round.round_number,
//                                   "hard",
//                                   Number(
//                                     event.target
//                                       .value,
//                                   ),
//                                 )
//                               }
//                               className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                             />
//                           </div>
//                         </div>

//                         {!isValid && (
//                           <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
//                             <AlertCircle className="h-4 w-4" />

//                             Easy + Medium + Hard
//                             must equal{" "}
//                             {
//                               round.no_of_questions
//                             }.
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}

//           {/* Final Round */}
//           <Card className="overflow-hidden">
//             <div className="border-b border-slate-200 bg-slate-900 px-6 py-5 text-white">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
//                   <Trophy className="h-5 w-5" />
//                 </div>

//                 <div>
//                   <h2 className="text-lg font-bold">
//                     Final Round
//                   </h2>

//                   <p className="text-sm text-slate-300">
//                     The championship round for
//                     the remaining contestants.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6 p-6">
//               {/* Final question count */}
//               <div className="grid gap-5 md:grid-cols-3">
//                 <div>
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Number of Questions
//                   </label>

//                   <input
//                     type="number"
//                     min={1}
//                     value={
//                       finalRound.no_of_questions
//                     }
//                     onChange={(event) =>
//                       setFinalRound(
//                         (previous) => ({
//                           ...previous,
//                           no_of_questions:
//                             Math.max(
//                               1,
//                               Number(
//                                 event.target
//                                   .value,
//                               ),
//                             ),
//                         }),
//                       )
//                     }
//                     className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                   />
//                 </div>

//                 <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
//                   <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
//                     First Position
//                   </p>

//                   <div className="mt-2 flex items-center gap-2">
//                     <input
//                       type="number"
//                       min={0}
//                       value={
//                         form.first_position_reward
//                       }
//                       onChange={(event) =>
//                         updateForm(
//                           "first_position_reward",
//                           Math.max(
//                             0,
//                             Number(
//                               event.target
//                                 .value,
//                             ),
//                           ),
//                         )
//                       }
//                       className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
//                     />
//                   </div>
//                 </div>

//                 <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
//                   <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
//                     Second Position
//                   </p>

//                   <div className="mt-2 flex items-center gap-2">
//                     <input
//                       type="number"
//                       min={0}
//                       value={
//                         form.second_position_reward
//                       }
//                       onChange={(event) =>
//                         updateForm(
//                           "second_position_reward",
//                           Math.max(
//                             0,
//                             Number(
//                               event.target
//                                 .value,
//                             ),
//                           ),
//                         )
//                       }
//                       className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Final difficulty */}
//               <div>
//                 <div className="mb-3 flex items-center justify-between">
//                   <div>
//                     <h4 className="text-sm font-semibold text-slate-900">
//                       Final Round Difficulty
//                       Breakdown
//                     </h4>

//                     <p className="text-xs text-slate-500">
//                       Must equal the total number
//                       of final-round questions.
//                     </p>
//                   </div>

//                   <span
//                     className={`text-sm font-semibold ${
//                       getDifficultyTotal(
//                         finalRound.difficultyBreakdown,
//                       ) ===
//                       Number(
//                         finalRound.no_of_questions,
//                       )
//                         ? "text-emerald-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     Total:{" "}
//                     {getDifficultyTotal(
//                       finalRound.difficultyBreakdown,
//                     )}
//                   </span>
//                 </div>

//                 <div className="grid gap-4 sm:grid-cols-3">
//                   {/* Easy */}
//                   <div className="rounded-lg border border-slate-200 p-4">
//                     <label className="mb-2 block text-sm font-medium text-slate-700">
//                       Easy
//                     </label>

//                     <input
//                       type="number"
//                       min={0}
//                       value={
//                         finalRound
//                           .difficultyBreakdown
//                           .easy
//                       }
//                       onChange={(event) =>
//                         updateFinalDifficulty(
//                           "easy",
//                           Number(
//                             event.target.value,
//                           ),
//                         )
//                       }
//                       className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                     />
//                   </div>

//                   {/* Medium */}
//                   <div className="rounded-lg border border-slate-200 p-4">
//                     <label className="mb-2 block text-sm font-medium text-slate-700">
//                       Medium
//                     </label>

//                     <input
//                       type="number"
//                       min={0}
//                       value={
//                         finalRound
//                           .difficultyBreakdown
//                           .medium
//                       }
//                       onChange={(event) =>
//                         updateFinalDifficulty(
//                           "medium",
//                           Number(
//                             event.target.value,
//                           ),
//                         )
//                       }
//                       className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                     />
//                   </div>

//                   {/* Hard */}
//                   <div className="rounded-lg border border-slate-200 p-4">
//                     <label className="mb-2 block text-sm font-medium text-slate-700">
//                       Hard
//                     </label>

//                     <input
//                       type="number"
//                       min={0}
//                       value={
//                         finalRound
//                           .difficultyBreakdown
//                           .hard
//                       }
//                       onChange={(event) =>
//                         updateFinalDifficulty(
//                           "hard",
//                           Number(
//                             event.target.value,
//                           ),
//                         )
//                       }
//                       className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
//                     />
//                   </div>
//                 </div>

//                 {getDifficultyTotal(
//                   finalRound.difficultyBreakdown,
//                 ) !==
//                   Number(
//                     finalRound.no_of_questions,
//                   ) && (
//                   <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
//                     <AlertCircle className="h-4 w-4" />

//                     Easy + Medium + Hard
//                     must equal{" "}
//                     {
//                       finalRound.no_of_questions
//                     }.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {/* Final Review */}
//           <Card className="p-6">
//             <div className="mb-5">
//               <h2 className="text-lg font-semibold text-slate-900">
//                 Final Review
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Confirm the competition before
//                 creating it.
//               </p>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                   Subject
//                 </p>

//                 <p className="mt-1 font-semibold text-slate-900">
//                   {selectedSubject?.name ??
//                     "Not selected"}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                   Contestants
//                 </p>

//                 <p className="mt-1 font-semibold text-slate-900">
//                   {form.no_of_contestants}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                   Total Rounds
//                 </p>

//                 <p className="mt-1 font-semibold text-slate-900">
//                   {form.number_of_rounds}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
//                   Total Questions
//                 </p>

//                 <p className="mt-1 font-semibold text-slate-900">
//                   {totalQuestions}
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
//               <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm font-semibold text-slate-900">
//                     Structure
//                   </p>

//                   <p className="text-sm text-slate-500">
//                     {rounds.length} elimination
//                     round
//                     {rounds.length === 1
//                       ? ""
//                       : "s"}{" "}
//                     + 1 final round
//                   </p>
//                 </div>

//                 <div className="text-sm font-medium text-slate-700">
//                   {eliminationExitTotal} contestants
//                   exit before the final
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Actions */}
//           <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => router.back()}
//               disabled={saving}
//             >
//               Cancel
//             </Button>

//             <Button
//               type="submit"
//               disabled={saving}
//               className="min-w-[180px]"
//             >
//               {saving ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 <>
//                   <Save className="mr-2 h-4 w-4" />
//                   Create Competition
//                 </>
//               )}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }









"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Save,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { getSubjectsByPlan } from "@/lib/api/subjects";
import { axiosInstance } from "@/lib/api/axios";

type Subject = {
  _id: string;
  name?: string;
  code?: string;
};

type DifficultyBreakdown = {
  easy: number;
  medium: number;
  hard: number;
};

type EliminationRound = {
  round_number: number;
  no_of_questions: number;
  difficultyBreakdown: DifficultyBreakdown;
  exit_number: number;
  exit_reward: number;
};

type FinalRound = {
  no_of_questions: number;
  difficultyBreakdown: DifficultyBreakdown;
};

type FormState = {
  quiz_title: string;
  description: string;
  subject: string;
  time_per_question: number;
  start_date: string;
  no_of_contestants: number;
  number_of_rounds: number;
  status: string;
  first_position_reward: number;
  second_position_reward: number;
};

type QuizPreset = {
  title: string;
  description: string;
};

const DEFAULT_FORM: FormState = {
  quiz_title: "",
  description: "",
  subject: "",
  time_per_question: 20,
  start_date: "",
  no_of_contestants: 20,
  number_of_rounds: 5,
  status: "DRAFT",
  first_position_reward: 100,
  second_position_reward: 50,
};

const DEFAULT_DIFFICULTY: DifficultyBreakdown = {
  easy: 0,
  medium: 0,
  hard: 0,
};

/*
 * Ready-made competition title and description options.
 *
 * The selected subject is inserted automatically into
 * the title and description.
 */
const QUIZ_PRESET_TEMPLATES = [
  {
    title: "{subject} JAMB League Championship",
    description:
      "A competitive {subject} quiz designed to test students' knowledge, speed, accuracy, and ability to perform under pressure.",
  },
  {
    title: "{subject} JAMB League Elimination Challenge",
    description:
      "An elimination-based {subject} competition where students compete through multiple rounds to qualify for the final championship round.",
  },
  {
    title: "{subject} JAMB League Academic Challenge",
    description:
      "A structured {subject} academic competition designed to challenge students with questions of varying difficulty across multiple rounds.",
  },
  {
    title: "{subject} JAMB League Masters Challenge",
    description:
      "An advanced {subject} competition for students who want to demonstrate strong subject knowledge, quick thinking, and consistent performance.",
  },
];

function createQuizPresets(
  subjectName: string,
): QuizPreset[] {
  if (!subjectName) {
    return [];
  }

  return QUIZ_PRESET_TEMPLATES.map(
    (template) => ({
      title: template.title.replace(
        "{subject}",
        subjectName,
      ),
      description:
        template.description.replace(
          "{subject}",
          subjectName,
        ),
    }),
  );
}

function createEliminationRound(
  roundNumber: number,
): EliminationRound {
  return {
    round_number: roundNumber,
    no_of_questions: 10,
    difficultyBreakdown: {
      easy: 4,
      medium: 4,
      hard: 2,
    },
    exit_number: 5,
    exit_reward: roundNumber * 5,
  };
}

function createFinalRound(): FinalRound {
  return {
    no_of_questions: 10,
    difficultyBreakdown: {
      easy: 2,
      medium: 3,
      hard: 5,
    },
  };
}

function getDifficultyTotal(
  difficulty: DifficultyBreakdown,
) {
  return (
    Number(difficulty.easy || 0) +
    Number(difficulty.medium || 0) +
    Number(difficulty.hard || 0)
  );
}

function formatDateTimeLocal(
  value: string,
) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (number: number) =>
    String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export default function CreateQuizCompetitionPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<FormState>(DEFAULT_FORM);

  const [subjects, setSubjects] = useState<
    Subject[]
  >([]);

  const [loadingSubjects, setLoadingSubjects] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [rounds, setRounds] = useState<
    EliminationRound[]
  >([]);

  const [finalRound, setFinalRound] =
    useState<FinalRound>(createFinalRound());

  /*
   * Load subjects
   */
  useEffect(() => {
    let mounted = true;

    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true);

        const response = await getSubjectsByPlan(
          "SECONDARY",
          1,
          100,
        );

        if (!mounted) return;

        setSubjects(
          response?.data?.subjectObj ?? [],
        );
      } catch (err) {
        console.error(
          "Failed to load subjects:",
          err,
        );

        if (mounted) {
          setSubjects([]);

          setError(
            "Unable to load subjects. Please refresh the page and try again.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingSubjects(false);
        }
      }
    };

    loadSubjects();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * number_of_rounds includes the final round.
   *
   * Example:
   * 5 total rounds
   * = 4 elimination rounds
   * + 1 final round
   */
  useEffect(() => {
    const totalRounds = Math.max(
      1,
      Number(form.number_of_rounds || 1),
    );

    const eliminationCount =
      Math.max(0, totalRounds - 1);

    setRounds((previousRounds) => {
      const nextRounds: EliminationRound[] = [];

      for (
        let index = 0;
        index < eliminationCount;
        index++
      ) {
        const roundNumber = index + 1;

        const existing =
          previousRounds.find(
            (round) =>
              round.round_number ===
              roundNumber,
          );

        nextRounds.push(
          existing ??
            createEliminationRound(
              roundNumber,
            ),
        );
      }

      return nextRounds;
    });
  }, [form.number_of_rounds]);

  const selectedSubject = useMemo(
    () =>
      subjects.find(
        (subject) =>
          String(subject._id) ===
          String(form.subject),
      ),
    [subjects, form.subject],
  );

  /*
   * Generate title/description presets
   * for the selected subject.
   */
  const quizPresets = useMemo(
    () =>
      createQuizPresets(
        selectedSubject?.name ||
          selectedSubject?.code ||
          "",
      ),
    [selectedSubject],
  );

  const totalEliminationQuestions =
    useMemo(
      () =>
        rounds.reduce(
          (total, round) =>
            total +
            Number(
              round.no_of_questions || 0,
            ),
          0,
        ),
      [rounds],
    );

  const totalQuestions = useMemo(
    () =>
      totalEliminationQuestions +
      Number(
        finalRound.no_of_questions || 0,
      ),
    [
      totalEliminationQuestions,
      finalRound.no_of_questions,
    ],
  );

  const eliminationExitTotal = useMemo(
    () =>
      rounds.reduce(
        (total, round) =>
          total +
          Number(round.exit_number || 0),
        0,
      ),
    [rounds],
  );

  const remainingAfterExits = useMemo(
    () =>
      Number(form.no_of_contestants || 0) -
      eliminationExitTotal,
    [
      form.no_of_contestants,
      eliminationExitTotal,
    ],
  );

  /*
   * Generic form updater
   */
  const updateForm = <
    K extends keyof FormState,
  >(
    key: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setError(null);
    setSuccess(null);
  };

  /*
   * Select a ready-made quiz title.
   *
   * The matching description is automatically
   * loaded into the description field.
   */
  const handleQuizPresetChange = (
    title: string,
  ) => {
    const selectedPreset =
      quizPresets.find(
        (preset) =>
          preset.title === title,
      );

    setForm((previous) => ({
      ...previous,
      quiz_title: title,
      description:
        selectedPreset?.description ??
        previous.description,
    }));

    setError(null);
    setSuccess(null);
  };

  /*
   * When subject changes, clear the old
   * title/description because they belong
   * to the previous subject.
   */
  const handleSubjectChange = (
    subjectId: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      subject: subjectId,
      quiz_title: "",
      description: "",
    }));

    setError(null);
    setSuccess(null);
  };

  /*
   * Update elimination round
   */
  const updateRound = (
    roundNumber: number,
    updates: Partial<EliminationRound>,
  ) => {
    setRounds((previous) =>
      previous.map((round) =>
        round.round_number ===
        roundNumber
          ? {
              ...round,
              ...updates,
            }
          : round,
      ),
    );

    setError(null);
    setSuccess(null);
  };

  /*
   * Update difficulty
   */
  const updateRoundDifficulty = (
    roundNumber: number,
    difficulty: keyof DifficultyBreakdown,
    value: number,
  ) => {
    setRounds((previous) =>
      previous.map((round) =>
        round.round_number ===
        roundNumber
          ? {
              ...round,
              difficultyBreakdown: {
                ...round.difficultyBreakdown,
                [difficulty]: Math.max(
                  0,
                  Number(value || 0),
                ),
              },
            }
          : round,
      ),
    );

    setError(null);
    setSuccess(null);
  };

  /*
   * Update final difficulty
   */
  const updateFinalDifficulty = (
    difficulty: keyof DifficultyBreakdown,
    value: number,
  ) => {
    setFinalRound((previous) => ({
      ...previous,
      difficultyBreakdown: {
        ...previous.difficultyBreakdown,
        [difficulty]: Math.max(
          0,
          Number(value || 0),
        ),
      },
    }));

    setError(null);
    setSuccess(null);
  };

  /*
   * Validate form before submission
   */
  const validateForm = (): string | null => {
    if (!form.quiz_title.trim()) {
      return "Quiz title is required.";
    }

    if (!form.description.trim()) {
      return "Description is required.";
    }

    if (!form.subject) {
      return "Please select a subject.";
    }

    if (
      !Number.isFinite(
        Number(form.time_per_question),
      ) ||
      Number(form.time_per_question) <= 0
    ) {
      return "Time per question must be greater than 0.";
    }

    if (!form.start_date) {
      return "Please select a start date and time.";
    }

    const startDate = new Date(
      form.start_date,
    );

    if (Number.isNaN(startDate.getTime())) {
      return "Please provide a valid start date.";
    }

    if (
      Number(form.no_of_contestants) < 2
    ) {
      return "There must be at least 2 contestants.";
    }

    if (
      Number(form.number_of_rounds) < 1
    ) {
      return "There must be at least 1 round.";
    }

    /*
     * Validate elimination rounds.
     */
    for (const round of rounds) {
      const questionCount = Number(
        round.no_of_questions || 0,
      );

      const difficultyTotal =
        getDifficultyTotal(
          round.difficultyBreakdown,
        );

      if (questionCount <= 0) {
        return `Round ${round.round_number} must have at least 1 question.`;
      }

      if (
        difficultyTotal !==
        questionCount
      ) {
        return `Round ${round.round_number}: Easy + Medium + Hard must equal the number of questions (${questionCount}).`;
      }

      if (
        Number(round.exit_number || 0) <
        0
      ) {
        return `Round ${round.round_number}: exit number cannot be negative.`;
      }

      if (
        Number(round.exit_number || 0) >
        Number(form.no_of_contestants || 0)
      ) {
        return `Round ${round.round_number}: exit number cannot exceed the number of contestants.`;
      }

      if (
        Number(round.exit_reward || 0) <
        0
      ) {
        return `Round ${round.round_number}: exit reward cannot be negative.`;
      }
    }

    /*
     * Validate total eliminations.
     */
    if (
      eliminationExitTotal >=
        Number(form.no_of_contestants || 0) &&
      rounds.length > 0
    ) {
      return "The elimination rounds cannot remove all contestants before the final round.";
    }

    /*
     * Validate final round.
     */
    const finalQuestionCount = Number(
      finalRound.no_of_questions || 0,
    );

    const finalDifficultyTotal =
      getDifficultyTotal(
        finalRound.difficultyBreakdown,
      );

    if (finalQuestionCount <= 0) {
      return "Final round must have at least 1 question.";
    }

    if (
      finalDifficultyTotal !==
      finalQuestionCount
    ) {
      return `Final Round: Easy + Medium + Hard must equal the number of questions (${finalQuestionCount}).`;
    }

    /*
     * First place must be greater than second place.
     */
    if (
      Number(form.first_position_reward) <
      0
    ) {
      return "First position reward cannot be negative.";
    }

    if (
      Number(form.second_position_reward) <
      0
    ) {
      return "Second position reward cannot be negative.";
    }

    if (
      Number(form.first_position_reward) <
      Number(form.second_position_reward)
    ) {
      return "First position reward should be greater than or equal to second position reward.";
    }

    return null;
  };

  /*
   * Submit
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const startsAt = new Date(
        form.start_date,
      );

      /*
       * Exact backend payload.
       *
       * IMPORTANT:
       * number_of_rounds includes the final round.
       *
       * round_information contains ONLY
       * elimination rounds.
       *
       * final_round_information contains
       * the final round.
       */
      const payload = {
        quiz_title: form.quiz_title.trim(),

        description:
          form.description.trim(),

        subject: form.subject,

        time_per_question: Number(
          form.time_per_question,
        ),

        start_date:
          startsAt.toISOString(),

        no_of_contestants: Number(
          form.no_of_contestants,
        ),

        number_of_rounds: Number(
          form.number_of_rounds,
        ),

        status: form.status,

        round_information:
          rounds.map((round) => ({
            round_number:
              round.round_number,

            no_of_questions: Number(
              round.no_of_questions,
            ),

            difficultyBreakdown: {
              easy: Number(
                round
                  .difficultyBreakdown
                  .easy,
              ),
              medium: Number(
                round
                  .difficultyBreakdown
                  .medium,
              ),
              hard: Number(
                round
                  .difficultyBreakdown
                  .hard,
              ),
            },

            exit_number: Number(
              round.exit_number,
            ),

            exit_reward: Number(
              round.exit_reward,
            ),
          })),

        final_round_information: {
          no_of_questions: Number(
            finalRound.no_of_questions,
          ),

          difficultyBreakdown: {
            easy: Number(
              finalRound
                .difficultyBreakdown
                .easy,
            ),
            medium: Number(
              finalRound
                .difficultyBreakdown
                .medium,
            ),
            hard: Number(
              finalRound
                .difficultyBreakdown
                .hard,
            ),
          },

          first_position_reward:
            Number(
              form.first_position_reward,
            ),

          second_position_reward:
            Number(
              form.second_position_reward,
            ),
        },
      };

      console.log(
        "Creating quiz competition:",
        payload,
      );

      const response =
        await axiosInstance.post(
          "/quiz",
          payload,
        );

      console.log(
        "Quiz competition created:",
        response.data,
      );

      setSuccess(
        "Quiz competition created successfully.",
      );

      setTimeout(() => {
        router.push(
          "/admin/secondary/quiz-board/quiz-competitions",
        );
      }, 800);
    } catch (err: any) {
      console.error(
        "Failed to create quiz competition:",
        err,
      );

      const backendMessage =
        err?.response?.data?.message;

      const backendError =
        err?.response?.data?.error;

      setError(
        backendMessage ||
          backendError ||
          "Failed to create quiz competition. Please check the form and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                router.back()
              }
              className="mt-1 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Create Quiz Competition
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Configure the quiz board,
                elimination rounds and
                final championship round.
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Unable to continue
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-semibold">
                Success
              </p>

              <p className="mt-1">
                {success}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Set the main details for the
                competition.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Subject
                </label>

                <select
                  id="subject"
                  value={form.subject}
                  onChange={(event) =>
                    handleSubjectChange(
                      event.target.value,
                    )
                  }
                  disabled={loadingSubjects}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {loadingSubjects
                      ? "Loading subjects..."
                      : "Select subject"}
                  </option>

                  {subjects.map(
                    (subject) => (
                      <option
                        key={String(
                          subject._id,
                        )}
                        value={String(
                          subject._id,
                        )}
                      >
                        {subject.name ??
                          "Unnamed subject"}
                      </option>
                    ),
                  )}
                </select>

                {selectedSubject && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selected:{" "}
                    {selectedSubject.name}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="PUBLISHED">
                    Published
                  </option>
                </select>
              </div>

              {/* Quiz Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="quiz_title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Quiz Title
                </label>

                <select
                  id="quiz_title"
                  value={form.quiz_title}
                  onChange={(event) =>
                    handleQuizPresetChange(
                      event.target.value,
                    )
                  }
                  disabled={
                    !form.subject ||
                    quizPresets.length === 0
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {!form.subject
                      ? "Select a subject first"
                      : "Select quiz title"}
                  </option>

                  {quizPresets.map(
                    (preset) => (
                      <option
                        key={preset.title}
                        value={preset.title}
                      >
                        {preset.title}
                      </option>
                    ),
                  )}
                </select>

                <p className="mt-1.5 text-xs text-slate-500">
                  Select a ready-made competition
                  title. The matching description
                  will be filled automatically.
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder={
                    form.quiz_title
                      ? "The description will appear here..."
                      : "Select a quiz title to load a description..."
                  }
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-1.5 text-xs text-slate-500">
                  The description is automatically
                  populated from the selected title,
                  but you can edit it before creating
                  the competition.
                </p>
              </div>

              {/* Time */}
              <div>
                <label
                  htmlFor="time_per_question"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Time Per Question
                </label>

                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="time_per_question"
                    type="number"
                    min={1}
                    value={
                      form.time_per_question
                    }
                    onChange={(event) =>
                      updateForm(
                        "time_per_question",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Seconds allowed for each
                  question.
                </p>
              </div>

              {/* Contestants */}
              <div>
                <label
                  htmlFor="no_of_contestants"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Number of Contestants
                </label>

                <div className="relative">
                  <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="no_of_contestants"
                    type="number"
                    min={2}
                    value={
                      form.no_of_contestants
                    }
                    onChange={(event) =>
                      updateForm(
                        "no_of_contestants",
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              {/* Total rounds */}
              <div>
                <label
                  htmlFor="number_of_rounds"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Total Number of Rounds
                </label>

                <input
                  id="number_of_rounds"
                  type="number"
                  min={1}
                  value={
                    form.number_of_rounds
                  }
                  onChange={(event) =>
                    updateForm(
                      "number_of_rounds",
                      Math.max(
                        1,
                        Number(
                          event.target.value,
                        ),
                      ),
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Includes the Final Round.
                  Therefore, 5 means 4
                  elimination rounds + 1
                  final.
                </p>
              </div>

              {/* Start date */}
              <div>
                <label
                  htmlFor="start_date"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Start Date & Time
                </label>

                <input
                  id="start_date"
                  type="datetime-local"
                  value={formatDateTimeLocal(
                    form.start_date,
                  )}
                  onChange={(event) =>
                    updateForm(
                      "start_date",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>
            </div>
          </Card>

          {/* Competition Summary */}
          <Card className="p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Competition Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Overview of the competition
                structure.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total Rounds
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {form.number_of_rounds}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Elimination Rounds
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {rounds.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total Questions
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {totalQuestions}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Contestants Remaining
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    remainingAfterExits > 0
                      ? "text-slate-900"
                      : "text-red-600"
                  }`}
                >
                  {remainingAfterExits}
                </p>
              </div>
            </div>
          </Card>

          {/* Elimination Rounds */}
          {rounds.length > 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Elimination Rounds
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure each elimination
                  round. The final round is
                  configured separately below.
                </p>
              </div>

              {rounds.map((round) => {
                const difficultyTotal =
                  getDifficultyTotal(
                    round.difficultyBreakdown,
                  );

                const isValid =
                  difficultyTotal ===
                  Number(
                    round.no_of_questions,
                  );

                return (
                  <Card
                    key={round.round_number}
                    className="overflow-hidden"
                  >
                    <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            Round{" "}
                            {
                              round.round_number
                            }
                          </h3>

                          <p className="text-sm text-slate-500">
                            Elimination round
                          </p>
                        </div>

                        <div
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isValid
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {difficultyTotal} /{" "}
                          {
                            round.no_of_questions
                          }{" "}
                          questions
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 p-6">
                      {/* Questions */}
                      <div className="grid gap-5 md:grid-cols-3">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Number of Questions
                          </label>

                          <input
                            type="number"
                            min={1}
                            value={
                              round.no_of_questions
                            }
                            onChange={(event) =>
                              updateRound(
                                round.round_number,
                                {
                                  no_of_questions:
                                    Math.max(
                                      1,
                                      Number(
                                        event
                                          .target
                                          .value,
                                      ),
                                    ),
                                },
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Exit Number
                          </label>

                          <input
                            type="number"
                            min={0}
                            value={
                              round.exit_number
                            }
                            onChange={(event) =>
                              updateRound(
                                round.round_number,
                                {
                                  exit_number:
                                    Math.max(
                                      0,
                                      Number(
                                        event
                                          .target
                                          .value,
                                      ),
                                    ),
                                },
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                          />

                          <p className="mt-1 text-xs text-slate-500">
                            Contestants removed
                            after this round.
                          </p>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Exit Reward
                          </label>

                          <input
                            type="number"
                            min={0}
                            value={
                              round.exit_reward
                            }
                            onChange={(event) =>
                              updateRound(
                                round.round_number,
                                {
                                  exit_reward:
                                    Math.max(
                                      0,
                                      Number(
                                        event
                                          .target
                                          .value,
                                      ),
                                    ),
                                },
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                          />

                          <p className="mt-1 text-xs text-slate-500">
                            Reward for contestants
                            exiting at this stage.
                          </p>
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">
                              Difficulty Breakdown
                            </h4>

                            <p className="text-xs text-slate-500">
                              Must equal the total
                              number of questions.
                            </p>
                          </div>

                          <span
                            className={`text-sm font-semibold ${
                              isValid
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            Total:{" "}
                            {difficultyTotal}
                          </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          {/* Easy */}
                          <div className="rounded-lg border border-slate-200 p-4">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Easy
                            </label>

                            <input
                              type="number"
                              min={0}
                              value={
                                round
                                  .difficultyBreakdown
                                  .easy
                              }
                              onChange={(event) =>
                                updateRoundDifficulty(
                                  round.round_number,
                                  "easy",
                                  Number(
                                    event.target
                                      .value,
                                  ),
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                            />
                          </div>

                          {/* Medium */}
                          <div className="rounded-lg border border-slate-200 p-4">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Medium
                            </label>

                            <input
                              type="number"
                              min={0}
                              value={
                                round
                                  .difficultyBreakdown
                                  .medium
                              }
                              onChange={(event) =>
                                updateRoundDifficulty(
                                  round.round_number,
                                  "medium",
                                  Number(
                                    event.target
                                      .value,
                                  ),
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                            />
                          </div>

                          {/* Hard */}
                          <div className="rounded-lg border border-slate-200 p-4">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Hard
                            </label>

                            <input
                              type="number"
                              min={0}
                              value={
                                round
                                  .difficultyBreakdown
                                  .hard
                              }
                              onChange={(event) =>
                                updateRoundDifficulty(
                                  round.round_number,
                                  "hard",
                                  Number(
                                    event.target
                                      .value,
                                  ),
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                            />
                          </div>
                        </div>

                        {!isValid && (
                          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                            <AlertCircle className="h-4 w-4" />

                            Easy + Medium + Hard
                            must equal{" "}
                            {
                              round.no_of_questions
                            }.
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Final Round */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-900 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Trophy className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Final Round
                  </h2>

                  <p className="text-sm text-slate-300">
                    The championship round for
                    the remaining contestants.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {/* Final question count */}
              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Number of Questions
                  </label>

                  <input
                    type="number"
                    min={1}
                    value={
                      finalRound.no_of_questions
                    }
                    onChange={(event) =>
                      setFinalRound(
                        (previous) => ({
                          ...previous,
                          no_of_questions:
                            Math.max(
                              1,
                              Number(
                                event.target
                                  .value,
                              ),
                            ),
                        }),
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                    First Position
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={
                        form.first_position_reward
                      }
                      onChange={(event) =>
                        updateForm(
                          "first_position_reward",
                          Math.max(
                            0,
                            Number(
                              event.target
                                .value,
                            ),
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                    Second Position
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={
                        form.second_position_reward
                      }
                      onChange={(event) =>
                        updateForm(
                          "second_position_reward",
                          Math.max(
                            0,
                            Number(
                              event.target
                                .value,
                            ),
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
                    />
                  </div>
                </div>
              </div>

              {/* Final difficulty */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Final Round Difficulty
                      Breakdown
                    </h4>

                    <p className="text-xs text-slate-500">
                      Must equal the total number
                      of final-round questions.
                    </p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      getDifficultyTotal(
                        finalRound.difficultyBreakdown,
                      ) ===
                      Number(
                        finalRound.no_of_questions,
                      )
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    Total:{" "}
                    {getDifficultyTotal(
                      finalRound.difficultyBreakdown,
                    )}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Easy */}
                  <div className="rounded-lg border border-slate-200 p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Easy
                    </label>

                    <input
                      type="number"
                      min={0}
                      value={
                        finalRound
                          .difficultyBreakdown
                          .easy
                      }
                      onChange={(event) =>
                        updateFinalDifficulty(
                          "easy",
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  {/* Medium */}
                  <div className="rounded-lg border border-slate-200 p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Medium
                    </label>

                    <input
                      type="number"
                      min={0}
                      value={
                        finalRound
                          .difficultyBreakdown
                          .medium
                      }
                      onChange={(event) =>
                        updateFinalDifficulty(
                          "medium",
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  {/* Hard */}
                  <div className="rounded-lg border border-slate-200 p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Hard
                    </label>

                    <input
                      type="number"
                      min={0}
                      value={
                        finalRound
                          .difficultyBreakdown
                          .hard
                      }
                      onChange={(event) =>
                        updateFinalDifficulty(
                          "hard",
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                </div>

                {getDifficultyTotal(
                  finalRound.difficultyBreakdown,
                ) !==
                  Number(
                    finalRound.no_of_questions,
                  ) && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                    <AlertCircle className="h-4 w-4" />

                    Easy + Medium + Hard
                    must equal{" "}
                    {
                      finalRound.no_of_questions
                    }.
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Final Review */}
          <Card className="p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Final Review
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Confirm the competition before
                creating it.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Quiz Title
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {form.quiz_title ||
                    "Not selected"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Subject
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedSubject?.name ??
                    "Not selected"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Contestants
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {form.no_of_contestants}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total Rounds
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {form.number_of_rounds}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Structure
                  </p>

                  <p className="text-sm text-slate-500">
                    {rounds.length} elimination
                    round
                    {rounds.length === 1
                      ? ""
                      : "s"}{" "}
                    + 1 final round
                  </p>
                </div>

                <div className="text-sm font-medium text-slate-700">
                  {eliminationExitTotal} contestants
                  exit before the final
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {form.description ||
                  "No description selected."}
              </p>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="min-w-[180px]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Competition
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

